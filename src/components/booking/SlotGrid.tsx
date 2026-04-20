"use client";

type Slot = { startTime: string; endTime: string; isBooked: boolean; isUnavailable: boolean };

type Props = {
  slots: Slot[];
  selected: string;
  onSelect: (value: string) => void;
  loading?: boolean;
};

export default function SlotGrid({ slots, selected, onSelect, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-10 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {slots.map((slot) => {
        const disabled = slot.isBooked || slot.isUnavailable;
        return (
          <button
            key={slot.startTime}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(slot.startTime)}
            className={`rounded-xl border px-3 py-2 text-center text-sm font-medium transition-all duration-150 ${
              selected === slot.startTime
                ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                : disabled
                  ? slot.isUnavailable
                    ? "cursor-not-allowed border-slate-100 bg-slate-50 text-xs text-slate-400"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {slot.isUnavailable ? "Боломжгүй" : slot.startTime}
          </button>
        );
      })}
    </div>
  );
}
