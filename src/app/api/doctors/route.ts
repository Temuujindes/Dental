import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    where: { available: true },
    orderBy: { rating: "desc" },
    select: { id: true, name: true, specialty: true, bio: true, imageUrl: true, experience: true, rating: true, available: true }
  });
  return NextResponse.json(doctors);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const schema = z.object({
    name: z.string().min(2),
    specialty: z.string().min(2),
    bio: z.string().min(10),
    imageUrl: z.string().url().optional().nullable(),
    rating: z.number().min(0).max(5).optional(),
    experience: z.number().int().min(0),
    available: z.boolean().optional()
  });
  const payload = schema.parse(await request.json());
  const doctor = await prisma.doctor.create({ data: payload });

  for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
    await prisma.$executeRaw`
      INSERT INTO "DoctorSchedule" ("id", "doctorId", "dayOfWeek", "startTime", "endTime", "slotDurationMinutes")
      VALUES (gen_random_uuid()::text, ${doctor.id}, ${dayOfWeek}, '09:00', '17:00', 30)
    `;
  }

  return NextResponse.json(doctor, { status: 201 });
}
