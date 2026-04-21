"use client";

import { CheckCircle, Star } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  rating: number;
  experience: number;
  bio: string;
  imageUrl?: string | null;
};

type Props = {
  doctor: Doctor;
  selected: boolean;
  onSelect: (doctorId: string) => void;
};


export default function DoctorCard({ doctor, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(doctor.id)}
      className={`card card-hover relative border-l-4 border-l-blue-400 p-5 text-left ${selected ? "ring-2 ring-blue-300 ring-offset-1" : ""}`}
    >
      {selected ? <CheckCircle className="absolute right-4 top-4 h-4 w-4 text-blue-600" /> : null}
      <div className="flex items-center gap-3">
        {doctor.imageUrl ? (
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium bg-blue-50 text-blue-600">
            {doctor.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{doctor.name}</p>
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
