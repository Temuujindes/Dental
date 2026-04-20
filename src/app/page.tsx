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
    <div className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-[32rem] w-[32rem] rounded-full bg-blue-50/60 blur-3xl" />
      <section className="section relative min-h-[calc(100vh-64px)] px-4 pb-24 pt-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            🇲🇳 Монголын #1 шүдний цаг захиалгын платформ
          </p>
          <h1 className="mt-4 max-w-3xl text-center text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Шүдний эмчийн цаг захиалгыг хялбар болгоно
          </h1>
          <p className="mt-4 max-w-xl text-center text-base leading-relaxed text-slate-500 sm:text-lg">
            Найдвартай, ойлгомжтой, давхцалгүй захиалгын системээр эмнэлгийн үйлчилгээгээ хурдан аваарай.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="btn-primary">Цаг захиалах →</Link>
            <Link href="/doctors" className="btn-outline">Эмч нар харах</Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Stat value="50+" label="Эмч" />
            <Stat value="10,000+" label="Захиалга" />
            <Stat value="4.9" label="Үнэлгээ" />
          </div>
        </div>
      </section>

      <section className="section mt-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Benefit icon={<Sparkles className="h-4 w-4 text-blue-600" />} title="Хурдан" />
        <Benefit icon={<ShieldCheck className="h-4 w-4 text-blue-600" />} title="Давхцалгүй" />
        <Benefit icon={<Stethoscope className="h-4 w-4 text-blue-600" />} title="Харьцуулах" />
        <Benefit icon={<BadgeCheck className="h-4 w-4 text-blue-600" />} title="Баталгаат" />
      </section>

      <section className="section mt-0">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold leading-tight text-slate-900">Онцлох эмч нар</h2>
            <Link href="/doctors" className="text-sm font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700">
              Бүгдийг харах →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="card p-5">
              <p className="text-lg font-semibold text-slate-900">{doctor.name}</p>
              <p className="text-sm text-slate-500">{doctor.specialty}</p>
              <p className="mt-2 text-sm text-slate-600">⭐ {doctor.rating.toFixed(1)} · {doctor.experience} жил</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <section className="section mt-0 pt-0">
        <h2 className="text-xl font-semibold">Хэрхэн ажилладаг вэ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {["1. Эмч сонгох", "2. Цаг сонгох", "3. Баталгаажуулах"].map((step) => (
            <div key={step} className="card p-5 text-sm font-medium text-slate-700">{step}</div>
          ))}
        </div>
      </section>

      <footer className="pb-12 text-center text-sm text-slate-500">© {new Date().getFullYear()} DentaBook. Бүх эрх хуулиар хамгаалагдсан.</footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Benefit({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="card p-5">
      <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">{icon}</div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
    </div>
  );
}
