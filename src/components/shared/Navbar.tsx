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
    <nav className="border-b bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="text-lg font-bold text-blue-700">
          DentaBook
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 text-sm sm:gap-3">
          <Link href="/doctors">{t.nav.doctors}</Link>
          <Link href="/booking">{t.nav.book}</Link>
          {session ? <Link href="/appointments">{t.nav.appointments}</Link> : null}
          {isAdmin ? <Link href="/admin">{t.nav.admin}</Link> : null}
          <LanguageToggle />
          {session ? (
            <button onClick={() => signOut()} className="rounded bg-gray-100 px-3 py-1.5">
              {t.nav.signOut}
            </button>
          ) : (
            <>
              <Link href="/login">{t.nav.logIn}</Link>
              <Link href="/register" className="rounded bg-blue-600 px-3 py-1.5 text-white">
                {t.nav.signUp}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
