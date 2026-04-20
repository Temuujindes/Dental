import { addMinutes, format, parse } from "date-fns";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, overlaps } from "@/lib/utils";

type ScheduleRow = { startTime: string; endTime: string; slotDurationMinutes: number };
type TimeRangeRow = { startTime: string; endTime: string };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");
  if (!doctorId || !date) return NextResponse.json({ error: "doctorId and date are required" }, { status: 400 });

  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day.getTime() + 86400000);
  const dayOfWeek = day.getDay();

  const schedules = await prisma.$queryRaw<ScheduleRow[]>`
    SELECT "startTime", "endTime", "slotDurationMinutes"
    FROM "DoctorSchedule"
    WHERE "doctorId" = ${doctorId} AND "dayOfWeek" = ${dayOfWeek}
    LIMIT 1
  `;
  const schedule = schedules[0];
  if (!schedule) return NextResponse.json({ slots: [] });

  const [breaks, blockedSlots, appointments] = await Promise.all([
    prisma.$queryRaw<TimeRangeRow[]>`
      SELECT "startTime", "endTime" FROM "BreakTime"
      WHERE "doctorId" = ${doctorId} AND "dayOfWeek" = ${dayOfWeek}
    `,
    prisma.$queryRaw<TimeRangeRow[]>`
      SELECT "startTime", "endTime" FROM "BlockedSlot"
      WHERE "doctorId" = ${doctorId} AND "date" >= ${day} AND "date" < ${nextDay}
    `,
    prisma.appointment.findMany({
      where: { doctorId, date: { gte: day, lt: nextDay }, status: { not: "CANCELLED" } },
      select: { startTime: true }
    })
  ]);

  const slots = generateTimeSlots(schedule.startTime, schedule.endTime, schedule.slotDurationMinutes).map((startTime) => {
    const endTime = format(addMinutes(parse(startTime, "HH:mm", new Date()), schedule.slotDurationMinutes), "HH:mm");
    const isBooked = appointments.some((appt) => appt.startTime === startTime);
    const isUnavailable =
      breaks.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime)) ||
      blockedSlots.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime));
    return { startTime, endTime, isBooked, isUnavailable };
  });

  return NextResponse.json({ slots });
}
