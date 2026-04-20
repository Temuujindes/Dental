"use client";

import { format, addDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DoctorCard from "@/components/booking/DoctorCard";
import SlotGrid from "@/components/booking/SlotGrid";
import { SERVICES, formatDateMN } from "@/lib/utils";

type Doctor = { id: string; name: string; specialty: string; rating: number; experience: number; bio: string };
type Slot = { startTime: string; endTime: string; isBooked: boolean; isUnavailable: boolean };

function BookingPageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/doctors").then(async (res) => setDoctors(await res.json()));
  }, []);

  useEffect(() => {
    const selectedDoctorId = searchParams.get("doctorId");
    if (selectedDoctorId) {
      setDoctorId(selectedDoctorId);
      setStep(2);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!doctorId || !date) return;
    setSlot("");
    setLoadingSlots(true);
    fetch(`/api/availability?doctorId=${doctorId}&date=${date}`)
      .then(async (res) => setSlots((await res.json()).slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, date]);

  const selectedDoctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctors, doctorId]);
  const dates = Array.from({ length: 14 })
    .map((_, i) => addDays(new Date(), i))
    .filter((d) => d.getDay() !== 0);

  async function submitBooking() {
    if (!doctorId || !slot) return;
    setError("");
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, date, startTime: slot, service, notes })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Алдаа гарлаа");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <p className="text-3xl">✅</p>
          <h1 className="mt-2 text-2xl font-bold">Захиалга амжилттай!</h1>
          <Link className="btn-primary mt-6 inline-block" href="/">
            Нүүр рүү буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h1 className="page-title">Цаг захиалах</h1>
      <div className="mx-auto mb-8 mt-4 flex max-w-xs items-center justify-between">
        {["1 Эмч", "2 Цаг", "3 Батлах"].map((label, index) => (
          <div key={label} className="flex flex-1 items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ${
              step >= index + 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
            }`}>
              {step > index + 1 ? "✓" : index + 1}
            </div>
            {index < 2 ? <div className={`mx-2 h-px flex-1 ${step > index + 1 ? "bg-blue-500" : "bg-slate-200"}`} /> : null}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <section className="mt-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} selected={doctor.id === doctorId} onSelect={setDoctorId} />
            ))}
          </div>
          <div className="mt-8">
            <label className="label">Үйлчилгээ</label>
            <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
              {SERVICES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-primary mt-4" disabled={!doctorId} onClick={() => setStep(2)}>
            Үргэлжлүүлэх →
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="mt-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDate(key)}
                  className={`min-w-[56px] whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    key === date ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {format(d, "MM/dd")}
                </button>
              );
            })}
          </div>
          <SlotGrid slots={slots} selected={slot} onSelect={setSlot} loading={loadingSlots} />
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white p-4 md:static md:border-0 md:bg-transparent md:p-0">
            <div className="mx-auto flex max-w-6xl gap-2">
            <button className="btn-ghost" onClick={() => setStep(1)}>
              ← Буцах
            </button>
            <button className="btn-primary" disabled={!slot} onClick={() => setStep(3)}>
              Үргэлжлүүлэх →
            </button>
            </div>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="mt-5 card animate-in fade-in p-5 duration-200">
          <h2 className="text-lg font-semibold">Батлах</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-700">
            <p>Эмч: {selectedDoctor?.name}</p>
            <p>Огноо: {formatDateMN(new Date(date))}</p>
            <p>Цаг: {slot}</p>
            <p>Үйлчилгээ: {service}</p>
          </div>
          <textarea className="input mt-3 min-h-24" placeholder="Тэмдэглэл" value={notes} onChange={(e) => setNotes(e.target.value)} />
          {!session ? (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              Нэвтэрсний дараа захиалга баталгаажна. <Link className="underline" href="/login">Нэвтрэх</Link>
            </div>
          ) : null}
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
          <div className="mt-4 flex gap-2">
            <button className="btn-ghost" onClick={() => setStep(2)}>
              ← Буцах
            </button>
            <button className="btn-primary" onClick={submitBooking} disabled={!session}>
              Захиалга батлах
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="section"><p className="text-sm text-slate-500">Ачаалж байна...</p></div>}>
      <BookingPageContent />
    </Suspense>
  );
}
