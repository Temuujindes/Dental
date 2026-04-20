"use client";

import { CheckCircle, Star } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  bio: string;
};

type Props = {
  doctor: Doctor;
  selected: boolean;
  onSelect: (doctorId: string) => void;
};

const specialtyStyles: Record<string, { border: string; avatar: string }> = {
  Ерөнхий: { border: "border-l-blue-400", avatar: "bg-blue-50 text-blue-600" },
  Ортодонт: { border: "border-l-purple-400", avatar: "bg-purple-50 text-purple-600" },
  Хүүхдийн: { border: "border-l-green-400", avatar: "bg-green-50 text-green-600" },
  "Гоо сайхны": { border: "border-l-pink-400", avatar: "bg-pink-50 text-pink-600" },
  "Мэс заслын": { border: "border-l-orange-400", avatar: "bg-orange-50 text-orange-600" },
  Эндодонт: { border: "border-l-teal-400", avatar: "bg-teal-50 text-teal-600" }
};

export default function DoctorCard({ doctor, selected, onSelect }: Props) {
  const style = specialtyStyles[doctor.specialty] ?? { border: "border-l-blue-400", avatar: "bg-blue-50 text-blue-600" };

  return (
    <button
      type="button"
      onClick={() => onSelect(doctor.id)}
      className={`card card-hover relative border-l-4 p-5 text-left ${style.border} ${selected ? "ring-2 ring-blue-300 ring-offset-1" : ""}`}
    >
      {selected ? <CheckCircle className="absolute right-4 top-4 h-4 w-4 text-blue-600" /> : null}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${style.avatar}`}>
          {doctor.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{doctor.name}</p>
          <p className="truncate text-xs text-slate-500">{doctor.specialty}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          {doctor.rating.toFixed(1)}
        </span>
        <span>·</span>
        <span>{doctor.experience}ж туршлага</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{doctor.bio}</p>
      <span className={`mt-4 inline-flex rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 ${selected ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-600"}`}>
        Цаг захиалах
      </span>
    </button>
  );
}
