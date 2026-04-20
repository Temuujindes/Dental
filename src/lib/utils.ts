import { addMinutes, format } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTimeSlots(startHour = 9, endHour = 17, intervalMinutes = 30): string[] {
  const slots: string[] = [];
  const start = new Date();
  start.setHours(startHour, 0, 0, 0);
  const end = new Date();
  end.setHours(endHour, 0, 0, 0);

  while (start < end) {
    slots.push(format(start, "HH:mm"));
    start.setTime(addMinutes(start, intervalMinutes).getTime());
  }
  return slots;
}

export const DENTAL_SERVICES = [
  "General Checkup",
  "Teeth Cleaning",
  "Tooth Extraction",
  "Root Canal",
  "Dental Filling",
  "Teeth Whitening",
  "Orthodontic Consultation",
  "Emergency Care"
];
