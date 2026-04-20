type Props = {
  label: string;
  value: number;
  color?: "blue" | "yellow" | "green" | "red" | "gray";
};

export default function StatsCard({ label, value, color = "blue" }: Props) {
  const borderClass =
    color === "yellow"
      ? "border-l-amber-400"
      : color === "green"
        ? "border-l-green-400"
        : color === "red"
          ? "border-l-red-400"
          : color === "gray"
            ? "border-l-slate-400"
            : "border-l-blue-400";

  return (
    <div className={`card border-l-4 p-5 ${borderClass}`}>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
