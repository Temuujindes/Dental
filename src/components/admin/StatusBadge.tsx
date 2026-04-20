import { AppointmentStatus } from "@prisma/client";

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config: Record<AppointmentStatus, { label: string; classes: string; dot: string }> = {
    PENDING: {
      label: "Хүлээгдэж буй",
      classes: "border border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-400"
    },
    CONFIRMED: {
      label: "Баталгаажсан",
      classes: "border border-green-200 bg-green-50 text-green-700",
      dot: "bg-green-400"
    },
    CANCELLED: {
      label: "Цуцлагдсан",
      classes: "border border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-400"
    },
    COMPLETED: {
      label: "Дууссан",
      classes: "border border-slate-200 bg-slate-100 text-slate-600",
      dot: "bg-slate-400"
    }
  };
  const item = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}
