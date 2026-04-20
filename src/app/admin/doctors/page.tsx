import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDoctorsPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") redirect("/");

  const doctors = await prisma.doctor.findMany({ orderBy: { rating: "desc" } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-20">
      <h1 className="text-2xl font-bold">Эмч нар</h1>
      <p className="mt-1 text-sm text-gray-600">Эмч нэмэх, засах, хуваарь удирдах хэсэг</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-sm text-blue-700">{doctor.specialty}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${doctor.available ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                {doctor.available ? "Идэвхтэй" : "Идэвхгүй"}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">⭐ {doctor.rating.toFixed(1)} · {doctor.experience} жил</p>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">{doctor.bio}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/admin/doctors/${doctor.id}/schedule`} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
                Хуваарь
              </Link>
              <Link href={`/doctors/${doctor.id}`} className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                Профайл
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
