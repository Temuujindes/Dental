import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ScheduleRow = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
};

type BreakRow = { id: string; dayOfWeek: number; startTime: string; endTime: string };
type BlockRow = { id: string; date: Date; startTime: string; endTime: string; reason: string | null };

const dayNames = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

export default async function DoctorSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");
  const { id } = await params;

  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) redirect("/admin/doctors");

  const [schedules, breaks, blockedSlots] = await Promise.all([
    prisma.$queryRaw<ScheduleRow[]>`SELECT * FROM "DoctorSchedule" WHERE "doctorId" = ${id} ORDER BY "dayOfWeek" ASC`,
    prisma.$queryRaw<BreakRow[]>`SELECT * FROM "BreakTime" WHERE "doctorId" = ${id} ORDER BY "dayOfWeek" ASC`,
    prisma.$queryRaw<BlockRow[]>`SELECT * FROM "BlockedSlot" WHERE "doctorId" = ${id} ORDER BY "date" ASC`
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold">{doctor.name} — Хуваарь</h1>
      <p className="mt-1 text-sm text-gray-600">{doctor.specialty}</p>

      <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">A. Weekly schedule</h2>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Өдөр</th>
                <th className="py-2">Эхлэх</th>
                <th className="py-2">Дуусах</th>
                <th className="py-2">Интервал</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2">{dayNames[item.dayOfWeek]}</td>
                  <td className="py-2">{item.startTime}</td>
                  <td className="py-2">{item.endTime}</td>
                  <td className="py-2">{item.slotDurationMinutes} мин</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">B. Break times</h2>
        <div className="mt-3 space-y-2 text-sm">
          {breaks.map((item) => (
            <div key={item.id} className="rounded-xl border p-3">
              {dayNames[item.dayOfWeek]} · {item.startTime} - {item.endTime}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">C. Blocked slots</h2>
        <div className="mt-3 space-y-2 text-sm">
          {blockedSlots.map((item) => (
            <div key={item.id} className="rounded-xl border p-3">
              {new Date(item.date).toLocaleDateString()} · {item.startTime} - {item.endTime}
              {item.reason ? <span className="ml-2 text-gray-500">({item.reason})</span> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
