import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const DAY_NAMES = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    where: { available: true },
    orderBy: { rating: "desc" },
    select: { id: true, name: true, bio: true, imageUrl: true, experience: true, rating: true, available: true }
  });
  return NextResponse.json(doctors);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  
  const schema = z.object({
    name: z.string().min(2),
    // specialty: z.string().min(2), // All doctors are dentists, no need for specialty
    bio: z.string().min(1),
    rating: z.number().min(0).max(5).optional(),
    experience: z.number().int().min(0),
    available: z.boolean().optional()
  });

  const payload = {
    name: formData.get("name"),
    // specialty: formData.get("specialty"), // All doctors are dentists
    bio: formData.get("bio"),
    rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
    experience: Number(formData.get("experience")),
    available: formData.get("available") ? formData.get("available") === "true" : true
  };

  const validated = schema.parse(payload);

  // Handle image upload
  let imageUrl: string | null = null;
  const imageFile = formData.get("image");
  
  if (imageFile instanceof File && imageFile.size > 0) {
    // Convert file to buffer and create data URL for now
    // In production, use Vercel Blob Storage or Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';
    
    // Create data URL (this will store the actual image)
    imageUrl = `data:${mimeType};base64,${base64}`;
  } else {
    // No image uploaded - leave as null for frontend placeholder
    imageUrl = null;
  }

  const doctorPayload = {
    ...validated,
    specialty: "Нялгамны эмч", // Default since all doctors are dentists
    imageUrl
  };
  const doctor = await prisma.doctor.create({ data: doctorPayload });

  for (const dayOfWeek of DAY_NAMES) {
    await prisma.$executeRaw`
      INSERT INTO "DoctorSchedule" ("id", "doctorId", "dayOfWeek", "startTime", "endTime", "isWorking")
      VALUES (gen_random_uuid()::text, ${doctor.id}, ${dayOfWeek}::"DayOfWeek", '09:00', '17:00', true)
    `;
  }

  return NextResponse.json(doctor, { status: 201 });
}
