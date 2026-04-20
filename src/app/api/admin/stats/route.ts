import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);

  const [total, pending, confirmed, cancelled, completed, doctors, patients, todayCount] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.doctor.count(),
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } })
  ]);

  return NextResponse.json({ total, pending, confirmed, cancelled, completed, doctors, patients, todayCount });
}
