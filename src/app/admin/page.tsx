import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import AdminAppointmentsTable from "@/components/admin/AdminAppointmentsTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  const [totalAppointments, pendingAppointments, confirmedAppointments, cancelledAppointments, completedAppointments, totalDoctors] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.doctor.count()
  ]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 86400000);
  const todayCount = await prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } });

  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: { select: { name: true, specialty: true } },
      patient: { select: { name: true, email: true } }
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }],
    take: 20
  });
  const weekDates = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() + index);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = appointments.filter((item) => item.date >= d && item.date < next).length;
    return { date: d, count };
  });

  return (
    <div className="section pb-20 md:pb-12">
      <h1 className="page-title">Админ хяналтын самбар</h1>
      <p className="page-sub">Өнөөдөр: {new Date().toLocaleDateString("mn-MN")}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatsCard label="Нийт" value={totalAppointments} color="blue" />
        <StatsCard label="Хүлээгдэж буй" value={pendingAppointments} color="yellow" />
        <StatsCard label="Баталгаажсан" value={confirmedAppointments} color="green" />
        <StatsCard label="Цуцлагдсан" value={cancelledAppointments} color="red" />
        <StatsCard label="Дууссан" value={completedAppointments} color="gray" />
        <StatsCard label="Өнөөдөр" value={todayCount} color="blue" />
      </div>

      <div className="mt-8 card p-4 sm:p-5">
        <p className="mb-3 text-sm leading-relaxed text-slate-600">Эмчийн тоо: {totalDoctors}</p>
        <h2 className="text-lg font-semibold text-slate-900">Календарь (7 хоног)</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {weekDates.map((item) => (
            <div key={item.date.toISOString()} className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs text-slate-500">{item.date.toLocaleDateString("mn-MN", { weekday: "short" })}</p>
              <p className="text-sm font-medium text-slate-900">{item.date.toLocaleDateString("mn-MN", { month: "2-digit", day: "2-digit" })}</p>
              <p className="mt-1 text-xs text-slate-500">{item.count} захиалга</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <AdminAppointmentsTable data={appointments} />
      </div>
    </div>
  );
}
