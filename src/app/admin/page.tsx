import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold">Админ хяналтын самбар</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard label="Нийт" value={totalAppointments} color="blue" />
        <StatsCard label="Хүлээгдэж буй" value={pendingAppointments} color="yellow" />
        <StatsCard label="Баталгаажсан" value={confirmedAppointments} color="green" />
        <StatsCard label="Цуцлагдсан" value={cancelledAppointments} color="red" />
        <StatsCard label="Дууссан" value={completedAppointments} color="gray" />
        <StatsCard label="Өнөөдөр" value={todayCount} color="blue" />
      </div>
      <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm text-gray-600">Эмчийн тоо: {totalDoctors}</p>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-2">Өвчтөн</th>
                <th className="py-2">Эмч</th>
                <th className="py-2">Огноо & цаг</th>
                <th className="py-2">Үйлчилгээ</th>
                <th className="py-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.patient.name}</td>
                  <td className="py-2">{item.doctor.name}</td>
                  <td className="py-2">{new Date(item.date).toLocaleDateString()} {item.startTime}</td>
                  <td className="py-2">{item.service}</td>
                  <td className="py-2"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
