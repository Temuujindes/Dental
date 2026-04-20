"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl?: string | null;
  experience: number;
  rating: number;
};

type Slot = { id: string; startTime: string; endTime: string; isBooked: boolean };

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const upcomingWeek = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        return {
          key: format(date, "yyyy-MM-dd"),
          label: format(date, "EEE, MMM d")
        };
      }),
    []
  );

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setDoctor(data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!doctor) return;
    fetch(`/api/appointments?doctorId=${doctor.id}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []));
  }, [doctor, selectedDate]);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-gray-500">{t.common.loading}</div>;
  }

  if (!doctor) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-gray-700">{t.doctorProfile.notFound}</p>
        <Link href="/doctors" className="mt-4 inline-flex text-sm font-medium text-blue-700">
          {t.doctorProfile.backToDoctors}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:py-10 sm:pb-10">
      <section className="card p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
              {doctor.name
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{doctor.name}</h1>
              <p className="text-sm text-blue-700">{doctor.specialty}</p>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
            <Star className="mr-1 inline h-4 w-4 fill-current" />
            {doctor.rating.toFixed(1)}
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-gray-600">{doctor.bio}</p>
      </section>

      <section className="mt-6 card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">{t.doctorProfile.scheduleTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{t.doctorProfile.scheduleSubtitle}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {upcomingWeek.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDate(day.key)}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition duration-200 sm:text-sm ${
                selectedDate === day.key ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        <h3 className="mt-5 text-sm font-semibold text-gray-700">{t.doctorProfile.availableSlots}</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={slot.isBooked}
              onClick={() => setSelectedSlot(slot.id)}
              className={`rounded-xl border px-2 py-2 text-sm font-medium transition duration-200 ${
                slot.isBooked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : slot.id === selectedSlot
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 hover:border-blue-400"
              }`}
            >
              {slot.startTime}
            </button>
          ))}
        </div>

        {slots.length === 0 ? <p className="mt-3 text-sm text-gray-500">{t.doctorProfile.noSlots}</p> : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white p-3 sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0">
        <Link
          href={`/booking?doctorId=${doctor.id}`}
          className="btn-primary block w-full text-center"
          aria-label={t.doctorProfile.bookNow}
        >
          {t.doctorProfile.bookNow}
        </Link>
      </div>
    </div>
  );
}
