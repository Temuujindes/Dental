import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schema = z.object({
    doctorId: z.string().min(1),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/)
  });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { doctorId, dayOfWeek, startTime, endTime } = parsed.data;
  await prisma.$executeRaw`
    INSERT INTO "DoctorBreak" ("id", "doctorId", "dayOfWeek", "startTime", "endTime", "isActive")
    VALUES (gen_random_uuid()::text, ${doctorId}, ${DAY_NAMES[dayOfWeek]}::"DayOfWeek", ${startTime}, ${endTime}, true)
  `;
  return NextResponse.json({ ok: true }, { status: 201 });
}
