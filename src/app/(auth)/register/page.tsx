"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t.auth.passwordsDoNotMatch);
      return;
    }
    setIsSubmitting(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone })
    });
    setIsSubmitting(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? t.auth.registrationFailed);
      return;
    }
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    if (signInRes?.ok) {
      router.push("/");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-4 py-10 sm:grid-cols-2 sm:py-16">
      <section className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{t.auth.registerTitle}</h1>
        <p className="mt-2 text-sm text-gray-600">{t.auth.registerSubtitle}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.auth.fullName}</label>
            <input
              className="input"
              placeholder={t.auth.fullName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.auth.email}</label>
            <input
              className="input"
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Утас (сонголтоор)</label>
            <input className="input" placeholder="99112233" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.auth.password}</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPassword ? "text" : "password"}
                minLength={8}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">{t.auth.passwordHint}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.auth.confirmPassword}</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showConfirmPassword ? "text" : "password"}
                minLength={8}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t.auth.creatingAccount : t.auth.createAccount}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          {t.auth.hasAccount}{" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:underline">
            {t.auth.goToLogin}
          </Link>
        </p>
      </section>

      <section className="card hidden p-6 sm:block sm:p-8">
        <h2 className="text-xl font-semibold">DentaBook</h2>
        <p className="mt-2 text-sm leading-7 text-gray-600">{t.home.description}</p>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p className="rounded-xl bg-blue-50 px-3 py-2">- {t.home.benefitFast}</p>
          <p className="rounded-xl bg-blue-50 px-3 py-2">- {t.home.benefitNoConflict}</p>
          <p className="rounded-xl bg-blue-50 px-3 py-2">- {t.home.benefitCompare}</p>
        </div>
      </section>
    </div>
  );
}
