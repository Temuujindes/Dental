import { addMinutes, format, parse } from "date-fns";
import { mn } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTimeSlots(startTime = "09:00", endTime = "17:00", intervalMinutes = 30): string[] {
  const slots: string[] = [];
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  while (start < end) {
    slots.push(format(start, "HH:mm"));
    start.setTime(addMinutes(start, intervalMinutes).getTime());
  }
  return slots;
}

export function overlaps(a1: string, a2: string, b1: string, b2: string): boolean {
  return a1 < b2 && a2 > b1;
}

export function formatDateMN(date: Date): string {
  return format(date, "yyyy оны MMMM d", { locale: mn });
}

export const SERVICES = [
  "Ерөнхий үзлэг",
  "Шүд цэвэрлэгэ",
  "Шүд авалт",
  "Суурь эмчилгээ",
  "Шүд цайруулга",
  "Зөвлөгөө"
];
