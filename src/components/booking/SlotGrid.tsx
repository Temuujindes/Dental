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
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-10 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const disabled = slot.isBooked || slot.isUnavailable;
        return (
          <button
            key={slot.startTime}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(slot.startTime)}
            className={`rounded-xl border px-2 py-2 text-sm font-medium ${
              selected === slot.startTime
                ? "border-blue-600 bg-blue-600 text-white"
                : disabled
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                  : "border-gray-300 bg-white hover:border-blue-400"
            }`}
          >
            {slot.startTime}
          </button>
        );
      })}
    </div>
  );
}
