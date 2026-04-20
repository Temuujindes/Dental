import { addMinutes, format, parse } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (doctorId && date) {
    const day = new Date(date);
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: { gte: start, lte: end },
        status: { not: "CANCELLED" }
      },
      select: { startTime: true }
    });

    const bookedTimes = new Set(bookedAppointments.map((item) => item.startTime));
    const slots = generateTimeSlots().map((time, index) => ({
      id: `${doctorId}-${date}-${index}`,
      startTime: time,
      endTime: format(addMinutes(parse(time, "HH:mm", new Date()), 30), "HH:mm"),
      isBooked: bookedTimes.has(time)
    }));
    return NextResponse.json({ slots });
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.user.id },
    include: { doctor: { select: { name: true, specialty: true } } },
    orderBy: { date: "desc" }
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { doctorId, date, startTime, endTime, service, notes } = await request.json();
  if (!doctorId || !date || !startTime || !endTime || !service) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date: { gte: day, lt: nextDay },
      startTime,
      status: { not: "CANCELLED" }
    }
  });
  if (conflict) {
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: session.user.id,
      doctorId,
      date: day,
      startTime,
      endTime,
      service,
      notes,
      status: "PENDING"
    }
  });
  return NextResponse.json(appointment, { status: 201 });
}
