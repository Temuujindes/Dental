import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDoctorScheduleClient from "@/components/admin/AdminDoctorScheduleClient";

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
const dayNameToNumber: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6
};

export default async function DoctorSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");
  const { id } = await params;

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) redirect("/admin/doctors" as any);

  const [schedulesRaw, breaksRaw, blockedSlotsRaw] = await Promise.all([
    prisma.$queryRaw<ScheduleRow[]>`SELECT * FROM "DoctorSchedule" WHERE "doctorId" = ${id} ORDER BY "dayOfWeek" ASC`,
    prisma.$queryRaw<BreakRow[]>`SELECT * FROM "DoctorBreak" WHERE "doctorId" = ${id} AND "isActive" = true ORDER BY "dayOfWeek" ASC`,
    prisma.$queryRaw<BlockRow[]>`SELECT * FROM "DoctorBlock" WHERE "doctorId" = ${id} AND "isActive" = true ORDER BY "date" ASC`
  ]);
  const schedules = schedulesRaw.map((item) => ({ ...item, dayOfWeek: dayNameToNumber[item.dayOfWeek] ?? 0, slotDurationMinutes: 30 }));
  const breaks = breaksRaw.map((item) => ({ ...item, dayOfWeek: dayNameToNumber[item.dayOfWeek] ?? 0 }));
  const blockedSlots = blockedSlotsRaw.map((item) => ({ ...item }));

  return <AdminDoctorScheduleClient doctorId={doctor.id} doctorName={doctor.name} initialSchedules={schedules} initialBreaks={breaks} initialBlocks={blockedSlots} />;
}
