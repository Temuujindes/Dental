"use client";

import { DENTAL_SERVICES } from "@/lib/utils";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

type Doctor = { id: string; name: string; specialty: string };
type Slot = { id: string; startTime: string; endTime: string; isBooked: boolean };

export default function BookingClient() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const defaultDoctorId = params.get("doctorId") ?? "";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState(defaultDoctorId);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<string>("");
  const [service, setService] = useState(DENTAL_SERVICES[0]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data) => setDoctors(data));
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    fetch(`/api/appointments?doctorId=${doctorId}&date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []));
  }, [doctorId, date]);

  const selectedSlot = useMemo(() => slots.find((s) => s.id === slot), [slot, slots]);
  const selectedDoctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctorId, doctors]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setMessage("");
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        service,
        notes
      })
    });
    if (res.ok) {
      setMessage(t.booking.success);
      setSlot("");
      setNotes("");
    } else {
      const data = await res.json();
      setMessage(data.error ?? t.booking.failed);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.booking.title}</h1>
      <p className="mt-2 text-sm text-gray-600 sm:text-base">{t.booking.subtitle}</p>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {[t.booking.chooseDoctorStep, t.booking.chooseTimeStep, t.booking.confirmStep].map((label, idx) => {
          const isDone = step > idx + 1;
          const isActive = step === idx + 1;
          return (
            <div
              key={label}
              className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-2 text-xs font-medium sm:text-sm ${
                isActive ? "border-blue-200 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  isDone || isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : idx + 1}
              </span>
              <span className="truncate">{label}</span>
            </div>
          );
        })}
      </div>

      <form className="card mt-6 space-y-5 p-4 sm:p-6" onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium">{t.booking.doctor}</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => setDoctorId(doctor.id)}
                    className={`rounded-xl border p-3 text-left transition ${
                      doctorId === doctor.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t.booking.service}</label>
              <select className="input" value={service} onChange={(e) => setService(e.target.value)}>
                {DENTAL_SERVICES.map((item) => (
                  <option key={item} value={item}>
                    {locale === "mn" ? translateServiceToMn(item) : item}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">{t.booking.date}</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{t.booking.slots}</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    disabled={item.isBooked}
                    onClick={() => setSlot(item.id)}
                    className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                      item.isBooked
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : item.id === slot
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {item.startTime}
                  </button>
                ))}
              </div>
              {slots.length === 0 ? <p className="mt-3 text-sm text-gray-500">{t.booking.noSlots}</p> : null}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm">
              <p className="font-semibold text-blue-700">{t.booking.selectedSummary}</p>
              <p className="mt-2 text-gray-700">
                {selectedDoctor?.name ?? "-"} - {selectedDoctor?.specialty ?? "-"}
              </p>
              <p className="text-gray-700">{format(new Date(date), "PPP")}</p>
              <p className="text-gray-700">
                {t.booking.selectedSlot}: {selectedSlot?.startTime ?? "-"}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t.booking.notes}</label>
              <textarea className="input min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </>
        ) : null}

        <div className="sticky bottom-2 rounded-xl border border-gray-200 bg-white p-2 sm:static sm:border-0 sm:p-0">
          <div className="flex gap-2">
            {step > 1 ? (
              <button type="button" className="btn-outline flex-1" onClick={() => setStep((current) => current - 1)}>
                <ChevronLeft className="mr-1 inline h-4 w-4" />
                {t.booking.back}
              </button>
            ) : null}

            {step < 3 ? (
              <button
                type="button"
                className="btn-primary flex-1"
                disabled={(step === 1 && !doctorId) || (step === 2 && !selectedSlot)}
                onClick={() => setStep((current) => current + 1)}
              >
                {t.booking.continue}
                <ChevronRight className="ml-1 inline h-4 w-4" />
              </button>
            ) : (
              <button type="submit" className="btn-primary flex-1" disabled={!doctorId || !selectedSlot}>
                {t.booking.confirm}
              </button>
            )}
          </div>
        </div>
        {message ? <p className="text-sm text-gray-700">{message}</p> : null}
      </form>
    </div>
  );
}

function translateServiceToMn(service: string): string {
  const map: Record<string, string> = {
    "General Checkup": "Ерөнхий үзлэг",
    "Teeth Cleaning": "Шүд цэвэрлэгээ",
    "Tooth Extraction": "Шүд авах",
    "Root Canal": "Суваг эмчилгээ",
    "Dental Filling": "Шүд ломбо",
    "Teeth Whitening": "Шүд цайруулах",
    "Orthodontic Consultation": "Гажиг заслын зөвлөгөө",
    "Emergency Care": "Яаралтай тусламж"
  };
  return map[service] ?? service;
}
