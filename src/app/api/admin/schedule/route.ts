import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ScheduleRow = {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isWorking: boolean;
};
type BreakRow = { id: string; doctorId: string; dayOfWeek: string; startTime: string; endTime: string; isActive: boolean };
type BlockRow = { id: string; doctorId: string; date: Date; startTime: string; endTime: string; reason: string | null; isActive: boolean };
const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
const dayNameToNumber: Record<(typeof DAY_NAMES)[number], number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const doctorId = new URL(request.url).searchParams.get("doctorId");
  if (!doctorId) return NextResponse.json({ error: "doctorId required" }, { status: 400 });

  const [schedulesRaw, breaksRaw, blockedSlotsRaw] = await Promise.all([
    prisma.$queryRaw<ScheduleRow[]>`SELECT * FROM "DoctorSchedule" WHERE "doctorId" = ${doctorId} ORDER BY "dayOfWeek" ASC`,
    prisma.$queryRaw<BreakRow[]>`SELECT * FROM "DoctorBreak" WHERE "doctorId" = ${doctorId} AND "isActive" = true ORDER BY "dayOfWeek" ASC, "startTime" ASC`,
    prisma.$queryRaw<BlockRow[]>`SELECT * FROM "DoctorBlock" WHERE "doctorId" = ${doctorId} AND "isActive" = true ORDER BY "date" ASC, "startTime" ASC`
  ]);
  const schedules = schedulesRaw.map((item) => ({
    ...item,
    dayOfWeek: dayNameToNumber[item.dayOfWeek as keyof typeof dayNameToNumber] ?? 0,
    slotDurationMinutes: 30
  }));
  const breaks = breaksRaw.map((item) => ({ ...item, dayOfWeek: dayNameToNumber[item.dayOfWeek as keyof typeof dayNameToNumber] ?? 0 }));
  return NextResponse.json({ schedules, breaks, blockedSlots: blockedSlotsRaw });
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
        slotDurationMinutes: z.number().int().min(15).max(60).optional()
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
        INSERT INTO "DoctorSchedule" ("id","doctorId","dayOfWeek","startTime","endTime","isWorking")
        VALUES (gen_random_uuid()::text, ${doctorId}, ${DAY_NAMES[item.dayOfWeek]}::"DayOfWeek", ${item.startTime}, ${item.endTime}, true)
      `
    )
  ]);

  return NextResponse.json({ ok: true });
}
