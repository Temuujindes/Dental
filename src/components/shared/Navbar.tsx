"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, Stethoscope, X } from "lucide-react";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { useI18n } from "@/components/shared/I18nProvider";
import { useState } from "react";
import type { Route } from "next";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainLinks: { href: Route; label: string }[] = [
    { href: "/doctors", label: t.nav.doctors },
    { href: "/booking", label: t.nav.book }
  ];
  if (session) mainLinks.push({ href: "/appointments", label: t.nav.appointments });
  if (isAdmin) mainLinks.push({ href: "/admin", label: t.nav.admin });

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          {t.common.appName}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {mainLinks.map((item) => (
            <Link key={item.href + item.label} className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          {session ? (
            <button onClick={() => signOut()} className="btn-ghost">
              {t.nav.signOut}
            </button>
          ) : (
            <>
              <Link className="btn-ghost" href="/login">{t.nav.logIn}</Link>
              <Link href="/register" className="btn-primary">
                {t.nav.signUp}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Цэс нээх"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="space-y-2">
            {mainLinks.map((item) => (
              <Link
                key={item.href + item.label}
                className="block rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <LanguageToggle />
            {session ? (
              <button onClick={() => signOut()} className="btn-ghost">
                {t.nav.signOut}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link className="btn-ghost" href="/login">{t.nav.logIn}</Link>
                <Link href="/register" className="btn-primary">{t.nav.signUp}</Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
