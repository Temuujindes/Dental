"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { useI18n } from "@/components/shared/I18nProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";
  const { t } = useI18n();

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="text-lg font-bold tracking-tight text-blue-700">
          {t.common.appName}
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 text-sm sm:gap-3">
          <Link className="rounded-lg px-2 py-1.5 transition hover:bg-gray-100" href="/doctors">
            {t.nav.doctors}
          </Link>
          <Link className="rounded-lg px-2 py-1.5 transition hover:bg-gray-100" href="/booking">
            {t.nav.book}
          </Link>
          {session ? (
            <Link className="rounded-lg px-2 py-1.5 transition hover:bg-gray-100" href="/appointments">
              {t.nav.appointments}
            </Link>
          ) : null}
          {isAdmin ? <Link className="rounded-lg px-2 py-1.5 transition hover:bg-gray-100" href="/admin">{t.nav.admin}</Link> : null}
          <LanguageToggle />
          {session ? (
            <button onClick={() => signOut()} className="rounded-xl bg-gray-100 px-3 py-1.5 transition hover:bg-gray-200">
              {t.nav.signOut}
            </button>
          ) : (
            <>
              <Link className="rounded-lg px-2 py-1.5 transition hover:bg-gray-100" href="/login">{t.nav.logIn}</Link>
              <Link href="/register" className="rounded-xl bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-700">
                {t.nav.signUp}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
