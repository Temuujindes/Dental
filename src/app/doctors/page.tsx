"use client";

import { useI18n } from "@/components/shared/I18nProvider";
import Link from "next/link";
import { Award, Star } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.doctors.title}</h1>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">{t.doctors.subtitle}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input className="input" placeholder="Эмчийн нэрээр хайх" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item === "ALL" ? "Бүх төрөл" : item}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doctor) => (
          <article
            key={doctor.id}
            className="card flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                {doctor.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{doctor.name}</h2>
                <p className="text-sm text-blue-700">{doctor.specialty}</p>
              </div>
            </div>
            <p className="line-clamp-3 text-sm leading-6 text-gray-600">{doctor.bio}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="rounded-lg bg-blue-50 px-2 py-1.5">
                <div className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-blue-600" />
                  {doctor.experience} {t.doctors.years}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 px-2 py-1.5">
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
