"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const response = await signIn("credentials", { email, password, redirect: false });
    setIsSubmitting(false);
    if (response?.error) {
      setError(t.auth.invalidCredentials);
      return;
    }
    router.push("/");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 px-4 py-10 sm:grid-cols-2 sm:py-16">
      <section className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{t.auth.loginTitle}</h1>
        <p className="mt-2 text-sm text-gray-600">{t.auth.loginSubtitle}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.auth.email}</label>
            <input
              className="input"
              type="email"
              placeholder="жишээ: name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t.auth.password}</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харах"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? t.auth.signingIn : t.auth.signIn}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="font-semibold text-blue-700 hover:underline">
            {t.auth.goToRegister}
          </Link>
        </p>
      </section>

      <section className="card hidden p-6 sm:block sm:p-8">
        <h2 className="text-xl font-semibold">DentaBook</h2>
        <p className="mt-2 text-sm leading-7 text-gray-600">{t.booking.instantFeedback}</p>
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p className="rounded-xl bg-blue-50 px-3 py-2">- {t.home.benefitFast}</p>
          <p className="rounded-xl bg-blue-50 px-3 py-2">- {t.home.benefitNoConflict}</p>
          <p className="rounded-xl bg-blue-50 px-3 py-2">- {t.home.benefitCompare}</p>
        </div>
      </section>
    </div>
  );
}
