import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PatientAppointmentsClient from "@/components/appointments/PatientAppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.user.id },
    include: { doctor: { select: { name: true, specialty: true } } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }]
  });

  return <PatientAppointmentsClient appointments={appointments} />;
}
