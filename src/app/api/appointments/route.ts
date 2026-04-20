import { addMinutes, format, parse } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { overlaps } from "@/lib/utils";

type ScheduleRow = { startTime: string; endTime: string; slotDurationMinutes: number };
type TimeRangeRow = { startTime: string; endTime: string };

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);

  if (session.user.role === "PATIENT") {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: session.user.id },
      include: { doctor: { select: { name: true, specialty: true } } },
      orderBy: { date: "desc" }
    });
    return NextResponse.json(appointments);
  }

  const doctorId = searchParams.get("doctorId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const date = searchParams.get("date");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit") ?? "20")));
  const whereDate = date ? new Date(date) : undefined;
  const nextDate = whereDate ? new Date(whereDate.getTime() + 86400000) : undefined;

  const where = {
    doctorId,
    status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | undefined,
    date: whereDate && nextDate ? { gte: whereDate, lt: nextDate } : undefined
  };
  const [total, rows] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: {
        patient: { select: { name: true, email: true } },
        doctor: { select: { name: true, specialty: true } }
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return NextResponse.json({ total, page, limit, rows });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const schema = z.object({
    doctorId: z.string().min(1),
    date: z.string().min(1),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    service: z.string().min(2),
    notes: z.string().optional()
  });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { doctorId, date, startTime, service, notes } = parsed.data;
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day.getTime() + 86400000);
  const dayOfWeek = day.getDay();

  try {
    const created = await prisma.$transaction(async (tx) => {
      const schedules = await tx.$queryRaw<ScheduleRow[]>`
      SELECT "startTime", "endTime", "slotDurationMinutes"
      FROM "DoctorSchedule"
      WHERE "doctorId" = ${doctorId} AND "dayOfWeek" = ${dayOfWeek}
      LIMIT 1
      `;
      const schedule = schedules[0];
      if (!schedule) throw new Error("Энэ өдөр ажиллахгүй байна");

      const endTime = format(addMinutes(parse(startTime, "HH:mm", new Date()), schedule.slotDurationMinutes), "HH:mm");
      if (startTime < schedule.startTime || endTime > schedule.endTime) throw new Error("Ажлын цагаас гадуур байна");

      const breaks = await tx.$queryRaw<TimeRangeRow[]>`
      SELECT "startTime", "endTime" FROM "BreakTime"
      WHERE "doctorId" = ${doctorId} AND "dayOfWeek" = ${dayOfWeek}
      `;
      if (breaks.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime))) throw new Error("Завсарлагаатай давхцаж байна");

      const blocks = await tx.$queryRaw<TimeRangeRow[]>`
      SELECT "startTime", "endTime" FROM "BlockedSlot"
      WHERE "doctorId" = ${doctorId} AND "date" >= ${day} AND "date" < ${nextDay}
      `;
      if (blocks.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime))) throw new Error("Цаг хаагдсан байна");

      const conflict = await tx.appointment.findFirst({
        where: { doctorId, date: { gte: day, lt: nextDay }, startTime, status: { not: "CANCELLED" } },
        select: { id: true }
      });
      if (conflict) throw new Error("Цаг давхцаж байна");

      return tx.appointment.create({
        data: { patientId: session.user.id, doctorId, date: day, startTime, endTime, service, notes, status: "PENDING" }
      });
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Алдаа гарлаа";
    const status = message === "Цаг давхцаж байна" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
