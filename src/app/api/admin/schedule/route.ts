import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ScheduleRow = {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const doctorId = new URL(request.url).searchParams.get("doctorId");
  if (!doctorId) return NextResponse.json({ error: "doctorId required" }, { status: 400 });

  const [schedules, breaks, blockedSlots] = await Promise.all([
    prisma.$queryRaw<ScheduleRow[]>`SELECT * FROM "DoctorSchedule" WHERE "doctorId" = ${doctorId} ORDER BY "dayOfWeek" ASC`,
    prisma.$queryRaw`SELECT * FROM "BreakTime" WHERE "doctorId" = ${doctorId} ORDER BY "dayOfWeek" ASC, "startTime" ASC`,
    prisma.$queryRaw`SELECT * FROM "BlockedSlot" WHERE "doctorId" = ${doctorId} ORDER BY "date" ASC, "startTime" ASC`
  ]);
  return NextResponse.json({ schedules, breaks, blockedSlots });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const schema = z.object({
    doctorId: z.string().min(1),
    schedules: z.array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
        slotDurationMinutes: z.number().int().min(15).max(60)
      })
    )
  });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { doctorId, schedules } = parsed.data;
  await prisma.$transaction([
    prisma.$executeRaw`DELETE FROM "DoctorSchedule" WHERE "doctorId" = ${doctorId}`,
    ...schedules.map((item) =>
      prisma.$executeRaw`
        INSERT INTO "DoctorSchedule" ("id","doctorId","dayOfWeek","startTime","endTime","slotDurationMinutes")
        VALUES (gen_random_uuid()::text, ${doctorId}, ${item.dayOfWeek}, ${item.startTime}, ${item.endTime}, ${item.slotDurationMinutes})
      `
    )
  ]);

  return NextResponse.json({ ok: true });
}
