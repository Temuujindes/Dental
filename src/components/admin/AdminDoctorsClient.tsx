"use client";

import Link from "next/link";
import { useMemo, useState, useRef } from "react";

type Doctor = {
  id: string;
  name: string;
  bio: string;
  imageUrl?: string | null;
  rating: number;
  experience: number;
  available: boolean;
};

type FormState = {
  name: string;
  bio: string;
  imageUrl: string;
  rating: string;
  experience: string;
};

const initialForm: FormState = {
  name: "",
  bio: "",
  imageUrl: "",
  rating: "5",
  experience: "1"
};

export default function AdminDoctorsClient({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedDoctors = useMemo(() => [...doctors].sort((a, b) => Number(b.available) - Number(a.available)), [doctors]);

  async function addDoctor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("bio", form.bio.trim());
    formData.append("rating", form.rating);
    formData.append("experience", form.experience);
    formData.append("available", "true");

    // Add image file if selected
    const file = fileInputRef.current?.files?.[0];
    
    if (file) {
      formData.append("image", file);
    }

    const res = await fetch("/api/doctors", {
      method: "POST",
      body: formData
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Эмч нэмэх үед алдаа гарлаа");
      return;
    }

    const created = (await res.json()) as Doctor;
    setDoctors((prev) => [created, ...prev]);
    setForm(initialForm);
  }

  async function deactivateDoctor(id: string) {
    const ok = window.confirm("Энэ эмчийг идэвхгүй болгох уу?");
    if (!ok) return;
    const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Эмч устгах үед алдаа гарлаа");
      return;
    }
    setDoctors((prev) => prev.map((item) => (item.id === id ? { ...item, available: false } : item)));
  }

  return (
    <div className="section pb-20 md:pb-10">
      <h1 className="page-title">Эмч нар</h1>
      <p className="page-sub">Эмч нэмэх, идэвхгүй болгох, хуваарь удирдах</p>

      <form className="card mt-8 space-y-4 p-5" onSubmit={addDoctor}>
        <h2 className="text-lg font-semibold text-slate-900">Шинэ эмч нэмэх</h2>
        <div className="grid gap-3">
          <div>
            <label className="label">Нэр</label>
            <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
                    <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Үнэлгээ</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                className="input"
                value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Туршлага (жил)</label>
              <input
                type="number"
                min={0}
                className="input"
                value={form.experience}
                onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Зураг</label>
          <input 
            ref={fileInputRef}
            type="file" 
            className="input" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setForm((p) => ({ ...p, imageUrl: file.name }));
              }
            }}
          />
          <p className="mt-1 text-xs text-slate-500">URL-ruu oruulj bolno</p>
        </div>
        <div>
          <label className="label">Танилцуулга</label>
          <textarea className="input min-h-24" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} required />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Нэмж байна..." : "Эмч нэмэх"}
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedDoctors.map((doctor) => (
          <article key={doctor.id} className="card p-5">
            <div className="flex items-center justify-between">
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
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                )}
                <p className="text-sm font-medium text-slate-900">{doctor.name}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${doctor.available ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                {doctor.available ? "Идэвхтэй" : "Идэвхгүй"}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">⭐ {doctor.rating.toFixed(1)} · {doctor.experience} жил</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{doctor.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/doctors/${doctor.id}/schedule`} className="btn-outline">
                Хуваарь
              </Link>
              <Link href={`/doctors/${doctor.id}`} className="btn-primary">
                Профайл
              </Link>
              {doctor.available ? (
                <button className="btn-danger" type="button" onClick={() => deactivateDoctor(doctor.id)}>
                  Идэвхгүй болгох
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
