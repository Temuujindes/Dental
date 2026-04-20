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
  patient: { name: string; email: string };
  doctor: { name: string; specialty: string };
};

type StatusFilter = "ALL" | Appointment["status"];

export default function AdminAppointmentsTable({ data }: { data: Appointment[] }) {
  const { t } = useI18n();
  const [items, setItems] = useState(data);
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [query, setQuery] = useState("");
  const [doctor, setDoctor] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const doctors = useMemo(() => ["ALL", ...Array.from(new Set(items.map((i) => i.doctor.name)))], [items]);
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const statusMatch = status === "ALL" || item.status === status;
      const doctorMatch = doctor === "ALL" || item.doctor.name === doctor;
      const dateMatch = selectedDate === "" || format(new Date(item.date), "yyyy-MM-dd") === selectedDate;
      const queryMatch =
        query.trim() === "" ||
        item.patient.name.toLowerCase().includes(query.toLowerCase()) ||
        item.doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        item.service.toLowerCase().includes(query.toLowerCase());
      return statusMatch && doctorMatch && dateMatch && queryMatch;
    });
  }, [items, status, doctor, selectedDate, query]);

  async function updateStatus(id: string, nextStatus: Appointment["status"]) {
    setUpdatingId(id);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    setUpdatingId(null);
    if (!res.ok) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
  }

  return (
    <div className="card p-4 sm:p-5">
      <p className="mb-3 text-sm font-semibold text-gray-700">{t.admin.filtersTitle}</p>
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input
          className="input"
          placeholder={t.admin.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="input" value={doctor} onChange={(e) => setDoctor(e.target.value)}>
          <option value="ALL">{t.admin.filterDoctor}: {t.admin.all}</option>
          {doctors.slice(1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((value) => (
            <option key={value} value={value}>
              {value === "ALL" ? t.admin.all : value}
            </option>
          ))}
        </select>
        <input type="date" className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">{t.admin.noResults}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    {item.patient.name} - {item.doctor.name}
                  </p>
                  <p className="text-gray-500">{item.patient.email}</p>
                  <p className="mt-1 text-gray-700">
                    {format(new Date(item.date), "PPP")} - {item.startTime} to {item.endTime}
                  </p>
                  <p className="text-gray-600">{item.service}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.status === "PENDING" ? (
                  <>
                    <button
                      type="button"
                      className="btn-primary text-xs"
                      disabled={updatingId === item.id}
                      onClick={() => updateStatus(item.id, "CONFIRMED")}
                    >
                      {t.admin.confirm}
                    </button>
                    <button
                      type="button"
                      className="btn-outline text-xs"
                      disabled={updatingId === item.id}
                      onClick={() => updateStatus(item.id, "CANCELLED")}
                    >
                      {t.admin.cancel}
                    </button>
                  </>
                ) : null}
                {item.status === "CONFIRMED" ? (
                  <>
                    <button
                      type="button"
                      className="btn-primary text-xs"
                      disabled={updatingId === item.id}
                      onClick={() => updateStatus(item.id, "COMPLETED")}
                    >
                      {t.admin.complete}
                    </button>
                    <button
                      type="button"
                      className="btn-outline text-xs"
                      disabled={updatingId === item.id}
                      onClick={() => updateStatus(item.id, "CANCELLED")}
                    >
                      {t.admin.cancel}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const classes: Record<Appointment["status"], string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700"
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{status}</span>;
}
