"use client";

import { useState } from "react";

type Schedule = {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
  slotDurationMinutes: number;
};

type BreakItem = {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type BlockItem = {
  id: string;
  doctorId: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  reason: string | null;
};

const dayNames = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

export default function AdminDoctorScheduleClient({
  doctorId,
  doctorName,
  initialSchedules,
  initialBreaks,
  initialBlocks
}: {
  doctorId: string;
  doctorName: string;
  initialSchedules: Schedule[];
  initialBreaks: BreakItem[];
  initialBlocks: BlockItem[];
}) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [breaks, setBreaks] = useState<BreakItem[]>(initialBreaks);
  const [blocks, setBlocks] = useState<BlockItem[]>(initialBlocks);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [error, setError] = useState("");
  const [breakForm, setBreakForm] = useState({ dayOfWeek: 1, startTime: "12:00", endTime: "13:00" });
  const [blockForm, setBlockForm] = useState({ date: new Date().toISOString().slice(0, 10), startTime: "09:00", endTime: "10:00", reason: "" });

  async function saveSchedule() {
    setSavingSchedule(true);
    setError("");
    const payload = {
      doctorId,
      schedules: schedules.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        slotDurationMinutes: 30
      }))
    };
    const res = await fetch("/api/admin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSavingSchedule(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Хуваарь хадгалах үед алдаа гарлаа");
      return;
    }
  }

  async function addBreak(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/breaks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, ...breakForm })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Завсарлага нэмэх үед алдаа гарлаа");
      return;
    }
    const refreshed = await fetch(`/api/admin/schedule?doctorId=${doctorId}`).then((r) => r.json());
    setBreaks(refreshed.breaks ?? []);
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, ...blockForm, reason: blockForm.reason || undefined })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Хаалттай цаг нэмэх үед алдаа гарлаа");
      return;
    }
    const refreshed = await fetch(`/api/admin/schedule?doctorId=${doctorId}`).then((r) => r.json());
    setBlocks(refreshed.blockedSlots ?? []);
  }

  async function removeBreak(id: string) {
    const res = await fetch(`/api/admin/breaks/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setBreaks((prev) => prev.filter((item) => item.id !== id));
  }

  async function removeBlock(id: string) {
    const res = await fetch(`/api/admin/blocked-slots/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setBlocks((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="section pb-20 md:pb-10">
      <h1 className="page-title">{doctorName} — Хуваарь</h1>

      <section className="card mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-900">А. Долоо хоногийн хуваарь</h2>
        <div className="mt-3 space-y-2">
          {schedules.map((item) => (
            <div key={item.id} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[120px_1fr_1fr]">
              <p className="text-sm font-medium text-slate-700">{dayNames[item.dayOfWeek]}</p>
              <input
                type="time"
                className="input"
                value={item.startTime}
                onChange={(e) => setSchedules((prev) => prev.map((row) => (row.id === item.id ? { ...row, startTime: e.target.value } : row)))}
              />
              <input
                type="time"
                className="input"
                value={item.endTime}
                onChange={(e) => setSchedules((prev) => prev.map((row) => (row.id === item.id ? { ...row, endTime: e.target.value } : row)))}
              />
            </div>
          ))}
        </div>
        <button className="btn-primary mt-4" type="button" onClick={saveSchedule} disabled={savingSchedule}>
          {savingSchedule ? "Хадгалж байна..." : "Хуваарь хадгалах"}
        </button>
      </section>

      <section className="card mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Б. Завсарлага</h2>
        <form className="mt-3 grid gap-2 sm:grid-cols-4" onSubmit={addBreak}>
          <select
            className="input"
            value={breakForm.dayOfWeek}
            onChange={(e) => setBreakForm((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
          >
            {dayNames.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>
          <input type="time" className="input" value={breakForm.startTime} onChange={(e) => setBreakForm((prev) => ({ ...prev, startTime: e.target.value }))} />
          <input type="time" className="input" value={breakForm.endTime} onChange={(e) => setBreakForm((prev) => ({ ...prev, endTime: e.target.value }))} />
          <button className="btn-outline" type="submit">Завсарлага нэмэх</button>
        </form>
        <div className="mt-3 space-y-2">
          {breaks.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
              <p>{dayNames[item.dayOfWeek]} · {item.startTime} - {item.endTime}</p>
              <button className="btn-danger" type="button" onClick={() => removeBreak(item.id)}>Устгах</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-900">В. Хаалттай цаг</h2>
        <form className="mt-3 grid gap-2 sm:grid-cols-5" onSubmit={addBlock}>
          <input type="date" className="input" value={blockForm.date} onChange={(e) => setBlockForm((prev) => ({ ...prev, date: e.target.value }))} />
          <input type="time" className="input" value={blockForm.startTime} onChange={(e) => setBlockForm((prev) => ({ ...prev, startTime: e.target.value }))} />
          <input type="time" className="input" value={blockForm.endTime} onChange={(e) => setBlockForm((prev) => ({ ...prev, endTime: e.target.value }))} />
          <input className="input" placeholder="Шалтгаан (заавал биш)" value={blockForm.reason} onChange={(e) => setBlockForm((prev) => ({ ...prev, reason: e.target.value }))} />
          <button className="btn-outline" type="submit">Хаалт нэмэх</button>
        </form>
        <div className="mt-3 space-y-2">
          {blocks.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
              <p>
                {new Date(item.date).toLocaleDateString("mn-MN")} · {item.startTime} - {item.endTime}
                {item.reason ? ` (${item.reason})` : ""}
              </p>
              <button className="btn-danger" type="button" onClick={() => removeBlock(item.id)}>Устгах</button>
            </div>
          ))}
        </div>
      </section>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
