import { addMinutes, format, parse } from "date-fns";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, overlaps } from "@/lib/utils";

type ScheduleRow = { startTime: string; endTime: string; isWorking: boolean };
type TimeRangeRow = { startTime: string; endTime: string };
type AppointmentRow = { startTime: string; endTime: string };
const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");
  if (!doctorId || !date) return NextResponse.json({ error: "doctorId and date are required" }, { status: 400 });

  const day = new Date(`${date}T00:00:00`);
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day.getTime() + 86400000);
  const dayOfWeek = DAY_NAMES[day.getDay()];

  const schedules = await prisma.$queryRaw<ScheduleRow[]>`
    SELECT "startTime", "endTime", "isWorking"
    FROM "DoctorSchedule"
    WHERE "doctorId" = ${doctorId} AND "dayOfWeek" = ${dayOfWeek}::"DayOfWeek"
    LIMIT 1
  `;
  const schedule = schedules[0];
  if (!schedule || !schedule.isWorking) return NextResponse.json({ slots: [] });

  const [breaks, blockedSlots, appointments] = await Promise.all([
    prisma.$queryRaw<TimeRangeRow[]>`
      SELECT "startTime", "endTime" FROM "DoctorBreak"
      WHERE "doctorId" = ${doctorId} AND "dayOfWeek" = ${dayOfWeek}::"DayOfWeek" AND "isActive" = true
    `,
    prisma.$queryRaw<TimeRangeRow[]>`
      SELECT "startTime", "endTime" FROM "DoctorBlock"
      WHERE "doctorId" = ${doctorId} AND "date" >= ${day} AND "date" < ${nextDay} AND "isActive" = true
    `,
    prisma.appointment.findMany({
      where: { doctorId, date: { gte: day, lt: nextDay }, status: { not: "CANCELLED" } },
      select: { startTime: true, endTime: true }
    })
  ]);

  const slotDurationMinutes = 30;
  const now = new Date();
  const isToday = now >= day && now < nextDay;
  const nowTime = format(now, "HH:mm");
  const slots = generateTimeSlots(schedule.startTime, schedule.endTime, slotDurationMinutes).map((startTime) => {
    const endTime = format(addMinutes(parse(startTime, "HH:mm", new Date()), slotDurationMinutes), "HH:mm");
    const isBooked = (appointments as AppointmentRow[]).some((appt) => overlaps(startTime, endTime, appt.startTime, appt.endTime));
    const isUnavailable =
      breaks.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime)) ||
      blockedSlots.some((item) => overlaps(startTime, endTime, item.startTime, item.endTime));
    const isPastTime = isToday && endTime <= nowTime;
    return { startTime, endTime, isBooked, isUnavailable: isUnavailable || isPastTime };
  });

  return NextResponse.json({ slots });
}
