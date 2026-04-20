"use client";

import { useI18n } from "@/components/shared/I18nProvider";

export default function LanguageToggle() {
  const { setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1" aria-label="Хэлний сонголт">
      <button
        type="button"
        onClick={() => setLocale("mn")}
        className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors duration-150"
      >
        Монгол
      </button>
    </div>
  );
}

