"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";
import AdminAppointmentsTable from "@/components/admin/AdminAppointmentsTable";
import { useI18n } from "@/components/shared/I18nProvider";

type Appointment = {
  id: string;
  date: string | Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  startTime: string;
  endTime: string;
  service: string;
  patient: { name: string; email: string };
  doctor: { name: string };
};

type DashboardData = {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  totalDoctors: number;
  totalPatients: number;
  appointments: Appointment[];
};

export default function AdminDashboardClient({ data }: { data: DashboardData }) {
  const { t } = useI18n();
  const [calendarMode, setCalendarMode] = useState<"day" | "week">("day");

  const todayCount = useMemo(
    () => data.appointments.filter((item) => format(new Date(item.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")).length,
    [data.appointments]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-3">
          <nav className="space-y-1 text-sm">
            <SidebarItem label={t.admin.sidebarDoctors} />
            <SidebarItem active label={t.admin.sidebarAppointments} />
            <SidebarItem label={t.admin.sidebarCalendar} />
            <SidebarItem label={t.admin.sidebarSettings} />
          </nav>
        </aside>

        <section>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.admin.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.admin.subtitle}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label={t.admin.todayAppointments} value={todayCount} />
            <StatCard label={t.admin.totalBookings} value={data.totalAppointments} />
            <StatCard label={t.admin.pending} value={data.pendingAppointments} />
            <StatCard label={t.admin.completed} value={data.completedAppointments} />
            <StatCard label={t.admin.doctors} value={data.totalDoctors} />
          </div>

          <div className="card mt-5 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">{t.admin.sidebarCalendar}</p>
              <div className="rounded-xl bg-gray-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCalendarMode("day")}
                  className={`rounded-lg px-3 py-1.5 transition ${calendarMode === "day" ? "bg-white shadow-sm" : "text-gray-600"}`}
                >
                  {t.admin.day}
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMode("week")}
                  className={`rounded-lg px-3 py-1.5 transition ${calendarMode === "week" ? "bg-white shadow-sm" : "text-gray-600"}`}
                >
                  {t.admin.week}
                </button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-7">
              {(calendarMode === "day" ? [new Date()] : Array.from({ length: 7 }).map((_, idx) => new Date(Date.now() + idx * 86400000))).map(
                (date) => (
                  <div key={date.toISOString()} className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">{["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"][date.getDay()]}</p>
                    <p className="text-sm font-semibold text-gray-900">{format(date, "MM/dd")}</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-5">
            <AdminAppointmentsTable data={data.appointments} />
          </div>
        </section>
      </div>
    </div>
  );
}

function SidebarItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center rounded-xl px-3 py-2 text-left transition ${
        active ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
