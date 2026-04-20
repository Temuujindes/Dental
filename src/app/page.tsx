 "use client";

import Link from "next/link";
import { useI18n } from "@/components/shared/I18nProvider";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold">{t.home.title}</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        {t.home.description}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/booking" className="btn-primary">
          {t.home.bookCta}
        </Link>
        <Link href="/doctors" className="btn-outline">
          {t.home.browseCta}
        </Link>
      </div>
    </div>
  );
}
