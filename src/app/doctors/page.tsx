"use client";

import { useI18n } from "@/components/shared/I18nProvider";
import Link from "next/link";
import { Award, Search, Star, Stethoscope } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl?: string | null;
  rating: number;
  experience: number;
};

export default function DoctorsPage() {
  const { t } = useI18n();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("ALL");

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  const specialties = useMemo(() => ["ALL", ...Array.from(new Set(doctors.map((doctor) => doctor.specialty)))], [doctors]);
  const filtered = useMemo(
    () =>
      doctors.filter((doctor) => {
        const matchesQuery = query.trim() === "" || doctor.name.toLowerCase().includes(query.toLowerCase());
        const matchesSpecialty = specialty === "ALL" || doctor.specialty === specialty;
        return matchesQuery && matchesSpecialty;
      }),
    [doctors, query, specialty]
  );

  return (
    <div className="section">
      <h1 className="page-title">{t.doctors.title}</h1>
      <p className="page-sub">{t.doctors.subtitle}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Эмчийн нэрээр хайх" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2">
          {specialties.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setSpecialty(item)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                specialty === item ? "bg-blue-50 text-blue-700" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item === "ALL" ? "Бүх төрөл" : item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Stethoscope className="h-8 w-8 text-slate-400" />
          <p className="mt-3 text-lg font-semibold text-slate-900">Эмч олдсонгүй</p>
          <p className="mt-1 text-sm text-slate-500">Хайлт эсвэл төрөл сонголтоо өөрчлөөд дахин оролдоно уу.</p>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doctor) => (
          <article
            key={doctor.id}
            className={`card card-hover flex flex-col border-l-4 p-5 ${specialtyBorderClass(doctor.specialty)}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${specialtyAvatarClass(doctor.specialty)}`}>
                {doctor.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{doctor.name}</h2>
                <p className="text-xs text-slate-500">{doctor.specialty}</p>
              </div>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{doctor.bio}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-blue-600" />
                  {doctor.experience} {t.doctors.years}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                  {doctor.rating.toFixed(1)} {t.doctors.rating}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link className="btn-outline text-center" href={`/doctors/${doctor.id}`}>
                {t.doctors.viewProfile}
              </Link>
              <Link className="btn-primary text-center" href={`/booking?doctorId=${doctor.id}`}>
                {t.doctors.book}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function specialtyBorderClass(specialty: string) {
  switch (specialty) {
    case "Ерөнхий":
      return "border-l-blue-400";
    case "Ортодонт":
      return "border-l-purple-400";
    case "Хүүхдийн":
      return "border-l-green-400";
    case "Гоо сайхны":
      return "border-l-pink-400";
    case "Мэс заслын":
      return "border-l-orange-400";
    case "Эндодонт":
      return "border-l-teal-400";
    default:
      return "border-l-blue-400";
  }
}

function specialtyAvatarClass(specialty: string) {
  switch (specialty) {
    case "Ерөнхий":
      return "bg-blue-50 text-blue-600";
    case "Ортодонт":
      return "bg-purple-50 text-purple-600";
    case "Хүүхдийн":
      return "bg-green-50 text-green-600";
    case "Гоо сайхны":
      return "bg-pink-50 text-pink-600";
    case "Мэс заслын":
      return "bg-orange-50 text-orange-600";
    case "Эндодонт":
      return "bg-teal-50 text-teal-600";
    default:
      return "bg-blue-50 text-blue-600";
  }
}
