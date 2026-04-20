type Props = {
  label: string;
  value: number;
  color?: "blue" | "yellow" | "green" | "red" | "gray";
};

export default function StatsCard({ label, value, color = "blue" }: Props) {
  const borderClass =
    color === "yellow"
      ? "border-yellow-400"
      : color === "green"
        ? "border-green-400"
        : color === "red"
          ? "border-red-400"
          : color === "gray"
            ? "border-gray-400"
            : "border-blue-400";

  return (
    <div className={`rounded-2xl border-l-4 ${borderClass} border-r border-t border-b bg-white p-4 shadow-sm`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
