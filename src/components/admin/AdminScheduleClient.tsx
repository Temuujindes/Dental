"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  available: boolean;
};

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

export default function AdminScheduleClient({ doctors }: { doctors: Doctor[] }) {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [breaks, setBreaks] = useState<BreakItem[]>([]);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [breakForm, setBreakForm] = useState({ dayOfWeek: 1, startTime: "12:00", endTime: "13:00" });
  const [blockForm, setBlockForm] = useState({ date: new Date().toISOString().slice(0, 10), startTime: "09:00", endTime: "10:00", reason: "" });

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
  );

  async function selectDoctor(doctor: Doctor) {
    setSelectedDoctor(doctor);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/schedule?doctorId=${doctor.id}`);
      if (!res.ok) throw new Error("Хуваарь авах үед алдаа гарлаа");
      const data = await res.json();
      let fetchedSchedules = data.schedules ?? [];
      
      // If no schedules found, create default schedule for each day
      if (fetchedSchedules.length === 0) {
        const defaultSchedules = [
          { id: `temp-${doctor.id}-1`, doctorId: doctor.id, dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isWorking: true, slotDurationMinutes: 30 },
          { id: `temp-${doctor.id}-2`, doctorId: doctor.id, dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isWorking: true, slotDurationMinutes: 30 },
          { id: `temp-${doctor.id}-3`, doctorId: doctor.id, dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isWorking: true, slotDurationMinutes: 30 },
          { id: `temp-${doctor.id}-4`, doctorId: doctor.id, dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isWorking: true, slotDurationMinutes: 30 },
          { id: `temp-${doctor.id}-5`, doctorId: doctor.id, dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isWorking: true, slotDurationMinutes: 30 },
          { id: `temp-${doctor.id}-6`, doctorId: doctor.id, dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isWorking: true, slotDurationMinutes: 30 },
        ];
        fetchedSchedules = defaultSchedules;
      }
      
      setSchedules(fetchedSchedules);
      setBreaks(data.breaks ?? []);
      setBlocks(data.blockedSlots ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  async function saveSchedule() {
    if (!selectedDoctor) return;
    setSavingSchedule(true);
    setError("");
    setSuccess("");
    const payload = {
      doctorId: selectedDoctor.id,
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
    setSuccess("Хуваарь амжилттай хадгалагдлаа!");
    setTimeout(() => setSuccess(""), 3000);
  }

  async function addBreak(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoctor) return;
    setError("");
    const res = await fetch("/api/admin/breaks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: selectedDoctor.id, ...breakForm })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Завсарлага нэмэх үед алдаа гарлаа");
      return;
    }
    const refreshed = await fetch(`/api/admin/schedule?doctorId=${selectedDoctor.id}`).then((r) => r.json());
    setBreaks(refreshed.breaks ?? []);
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoctor) return;
    setError("");
    const res = await fetch("/api/admin/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: selectedDoctor.id, ...blockForm, reason: blockForm.reason || undefined })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Хаалттай цаг нэмэх үед алдаа гарлаа");
      return;
    }
    const refreshed = await fetch(`/api/admin/schedule?doctorId=${selectedDoctor.id}`).then((r) => r.json());
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
      <h1 className="page-title">Хуваарь</h1>
      <p className="page-sub">Ажилчдаа хайж, хуваарь өгөх</p>

      {/* Doctor Search */}
      <div className="card mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Эмч хайх</h2>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Нэр эсвэл мэргэжилээр хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => selectDoctor(doctor)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                selectedDoctor?.id === doctor.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-medium text-slate-900">{doctor.name}</p>
            </button>
          ))}
          {filteredDoctors.length === 0 && (
            <p className="col-span-full py-4 text-center text-sm text-slate-400">Эмч олдсонгүй</p>
          )}
        </div>
      </div>

      {/* Schedule Editor */}
      {selectedDoctor && (
        <>
          {loading ? (
            <div className="mt-8 flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="ml-2 text-sm text-slate-600">Ачаалж байна...</span>
            </div>
          ) : (
            <>
              {/* А. Долоо хоногийн хуваарь */}
              <section className="card mt-8 p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  А. Долоо хоногийн хуваарь — <span className="text-blue-600">{selectedDoctor.name}</span>
                </h2>
                <div className="mt-3 space-y-2">
                  {schedules.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[120px_1fr_1fr]">
                      <p className="text-sm font-medium text-slate-700">{dayNames[item.dayOfWeek]}</p>
                      <input
                        type="time"
                        className="input"
                        value={item.startTime}
                        onChange={(e) =>
                          setSchedules((prev) =>
                            prev.map((row) => (row.id === item.id ? { ...row, startTime: e.target.value } : row))
                          )
                        }
                      />
                      <input
                        type="time"
                        className="input"
                        value={item.endTime}
                        onChange={(e) =>
                          setSchedules((prev) =>
                            prev.map((row) => (row.id === item.id ? { ...row, endTime: e.target.value } : row))
                          )
                        }
                      />
                    </div>
                  ))}
                  {schedules.length === 0 && (
                    <p className="py-4 text-center text-sm text-slate-400">Хуваарь олдсонгүй</p>
                  )}
                </div>
                <button className="btn-primary mt-4" type="button" onClick={saveSchedule} disabled={savingSchedule}>
                  {savingSchedule ? "Хадгалж байна..." : "Хуваарь хадгалах"}
                </button>
              </section>

              {/* Б. Завсарлага */}
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

              {/* В. Хаалттай цаг */}
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
            </>
          )}

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {success ? <p className="mt-4 text-sm text-green-600">{success}</p> : null}
        </>
      )}
    </div>
  );
}
