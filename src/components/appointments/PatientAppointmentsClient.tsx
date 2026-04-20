"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";

type Appointment = {
  id: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  service: string;
  doctor: { name: string; specialty: string };
};

type Tab = "UPCOMING" | "PAST" | "CANCELLED";

export default function PatientAppointmentsClient({ appointments }: { appointments: Appointment[] }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("UPCOMING");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [items, setItems] = useState<Appointment[]>(appointments);

  const now = new Date();
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      if (tab === "CANCELLED") return item.status === "CANCELLED";
      if (tab === "PAST") return itemDate < now && item.status !== "CANCELLED";
      return itemDate >= now && item.status !== "CANCELLED";
    });
  }, [items, now, tab]);

  async function cancelAppointment(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    setLoadingId(null);
    if (!res.ok) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "CANCELLED" } : item)));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t.appointments.title}</h1>
      <p className="mt-2 text-sm text-gray-600">{t.appointments.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["UPCOMING", t.appointments.upcoming],
            ["PAST", t.appointments.past],
            ["CANCELLED", t.appointments.cancelled]
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`rounded-xl px-3 py-2 text-sm font-medium ${
              value === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-gray-500">{t.appointments.empty}</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {filtered.map((item) => (
            <article key={item.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.doctor.name}</p>
                  <p className="text-sm text-blue-700">{item.doctor.specialty}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {format(new Date(item.date), "PPP")} - {item.startTime} - {item.endTime}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{item.service}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {(item.status === "PENDING" || item.status === "CONFIRMED") && tab !== "CANCELLED" ? (
                    <button
                      type="button"
                      onClick={() => cancelAppointment(item.id)}
                      disabled={loadingId === item.id}
                      className="btn-outline text-xs"
                    >
                      {loadingId === item.id ? t.appointments.cancelling : t.appointments.cancel}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const classes: Record<Appointment["status"], { label: string; className: string }> = {
    PENDING: { label: "Хүлээгдэж буй", className: "bg-amber-100 text-amber-700" },
    CONFIRMED: { label: "Баталгаажсан", className: "bg-emerald-100 text-emerald-700" },
    COMPLETED: { label: "Дууссан", className: "bg-blue-100 text-blue-700" },
    CANCELLED: { label: "Цуцлагдсан", className: "bg-gray-200 text-gray-700" }
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status].className}`}>{classes[status].label}</span>;
}
