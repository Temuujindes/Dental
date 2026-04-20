import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const schema = z.object({
    doctorId: z.string().min(1),
    date: z.string().min(1),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    reason: z.string().optional()
  });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { doctorId, date, startTime, endTime, reason } = parsed.data;

  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  await prisma.$executeRaw`
    INSERT INTO "BlockedSlot" ("id","doctorId","date","startTime","endTime","reason","createdAt")
    VALUES (gen_random_uuid()::text, ${doctorId}, ${day}, ${startTime}, ${endTime}, ${reason ?? null}, NOW())
  `;
  return NextResponse.json({ ok: true }, { status: 201 });
}
