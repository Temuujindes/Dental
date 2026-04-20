import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const doctors = await prisma.doctor.findMany({
    where: { available: true },
    orderBy: { rating: "desc" },
    select: { id: true, name: true, specialty: true, bio: true, experience: true, rating: true, available: true }
  });
  return NextResponse.json(doctors);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const payload = await request.json();
  const doctor = await prisma.doctor.create({ data: payload });
  return NextResponse.json(doctor, { status: 201 });
}
