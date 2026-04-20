import Link from "next/link";
import { ShieldCheck, Sparkles, Stethoscope, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const doctors = await prisma.doctor.findMany({
    where: { available: true },
    orderBy: { rating: "desc" },
    take: 3,
    select: { id: true, name: true, specialty: true, rating: true, experience: true }
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Шүдний эмчийн цаг захиалгыг хялбар болгоно</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">Монголын хамгийн найдвартай цаг захиалгын платформ</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/booking" className="btn-primary">Цаг захиалах →</Link>
          <Link href="/doctors" className="btn-outline">Эмч нар харах</Link>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <Stat text="50+ Эмч" />
          <Stat text="10,000+ Захиалга" />
          <Stat text="4.9⭐ Үнэлгээ" />
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Benefit icon={<Sparkles className="h-4 w-4 text-blue-600" />} title="Хурдан" />
        <Benefit icon={<ShieldCheck className="h-4 w-4 text-blue-600" />} title="Давхцалгүй" />
        <Benefit icon={<Stethoscope className="h-4 w-4 text-blue-600" />} title="Харьцуулах" />
        <Benefit icon={<BadgeCheck className="h-4 w-4 text-blue-600" />} title="Баталгаат" />
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Онцлох эмч нар</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="rounded-xl border p-4">
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-sm text-blue-700">{doctor.specialty}</p>
              <p className="mt-2 text-sm text-gray-600">⭐ {doctor.rating.toFixed(1)} · {doctor.experience} жил</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Хэрхэн ажилладаг вэ</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["1. Эмч сонгох", "2. Цаг сонгох", "3. Баталгаажуулах"].map((step) => (
            <div key={step} className="rounded-xl border p-4 text-sm font-medium text-gray-700">{step}</div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ text }: { text: string }) {
  return <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">{text}</div>;
}

function Benefit({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">{icon}</div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  );
}
