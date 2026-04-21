import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDoctorsClient from "@/components/admin/AdminDoctorsClient";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  const doctors = await prisma.doctor.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      bio: true,
      experience: true,
      rating: true,
      available: true
    }
  });

  return <AdminDoctorsClient initialDoctors={doctors} />;
}
