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

export default function DoctorCard({ doctor, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(doctor.id)}
      className={`relative rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${
        selected ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"
      }`}
    >
      {selected ? <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-blue-600" /> : null}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {doctor.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{doctor.name}</p>
          <p className="text-xs text-blue-700">{doctor.specialty}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
          {doctor.rating.toFixed(1)}
        </span>
        <span>{doctor.experience} жил</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{doctor.bio}</p>
    </button>
  );
}
