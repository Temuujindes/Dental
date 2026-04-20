import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const { status } = await request.json();
  if (!["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.appointment.findUnique({ where: { id }, select: { status: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = existing.status;
  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED"],
    COMPLETED: ["CANCELLED"],
    CANCELLED: []
  };
  if (!validTransitions[current].includes(status)) {
    return NextResponse.json({ error: `Invalid transition: ${current} -> ${status}` }, { status: 409 });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status }
  });
  return NextResponse.json(appointment);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    select: { patientId: true, status: true }
  });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.user.role !== "ADMIN" && appointment.patientId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (appointment.status === "CANCELLED") {
    return NextResponse.json({ ok: true });
  }
  await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" }
  });
  return NextResponse.json({ ok: true });
}
