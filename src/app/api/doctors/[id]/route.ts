import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    select: { id: true, name: true, specialty: true, bio: true, imageUrl: true, experience: true, rating: true, available: true }
  });

  if (!doctor || !doctor.available) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json(doctor);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.doctor.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  await prisma.doctor.update({
    where: { id },
    data: { available: false }
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const schema = z.object({
    name: z.string().min(2).optional(),
    specialty: z.string().min(2).optional(),
    bio: z.string().min(10).optional(),
    imageUrl: z.string().url().nullable().optional(),
    rating: z.number().min(0).max(5).optional(),
    experience: z.number().int().min(0).optional(),
    available: z.boolean().optional()
  });

  const payload = schema.parse(await request.json());
  const updated = await prisma.doctor.update({
    where: { id },
    data: payload
  });
  return NextResponse.json(updated);
}
