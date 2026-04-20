"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await signIn("credentials", { email, password, redirect: false });
    if (response?.error) {
      setError(t.auth.invalidCredentials);
      return;
    }
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">{t.auth.loginTitle}</h1>
      <form className="card space-y-4 p-6" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder={t.auth.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder={t.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="btn-primary w-full">
          {t.auth.signIn}
        </button>
      </form>
    </div>
  );
}
