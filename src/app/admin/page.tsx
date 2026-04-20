import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminAppointmentsTable from "@/components/admin/AdminAppointmentsTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  const [totalAppointments, pendingAppointments, totalDoctors, totalPatients] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.doctor.count(),
    prisma.user.count({ where: { role: "PATIENT" } })
  ]);

  const appointments = await prisma.appointment.findMany({
    include: {
      doctor: { select: { name: true, specialty: true } },
      patient: { select: { name: true, email: true } }
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }]
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Appointments" value={totalAppointments} />
        <StatCard label="Pending" value={pendingAppointments} />
        <StatCard label="Doctors" value={totalDoctors} />
        <StatCard label="Patients" value={totalPatients} />
      </div>
      <AdminAppointmentsTable data={appointments} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
