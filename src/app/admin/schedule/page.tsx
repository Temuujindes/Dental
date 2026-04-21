import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminScheduleClient from "@/components/admin/AdminScheduleClient";

export const dynamic = "force-dynamic";

export default async function AdminSchedulePage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  const doctors = await prisma.doctor.findMany({
    where: { available: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      specialty: true,
      available: true
    }
  });

  return <AdminScheduleClient doctors={doctors} />;
}
