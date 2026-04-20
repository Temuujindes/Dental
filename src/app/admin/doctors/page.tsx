import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDoctorsClient from "@/components/admin/AdminDoctorsClient";

export default async function AdminDoctorsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  const doctors = await prisma.doctor.findMany({ orderBy: { rating: "desc" } });

  return <AdminDoctorsClient initialDoctors={doctors} />;
}
