"use client";

import { type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/shared/I18nProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  function buttonClasses(target: Locale) {
    return locale === target
      ? "rounded px-2 py-1 text-xs font-semibold bg-blue-600 text-white"
      : "rounded px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200";
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      <button type="button" onClick={() => setLocale("mn")} className={buttonClasses("mn")}>
        MN
      </button>
      <button type="button" onClick={() => setLocale("en")} className={buttonClasses("en")}>
        EN
      </button>
    </div>
  );
}

