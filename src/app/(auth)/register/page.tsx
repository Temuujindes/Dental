"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/shared/I18nProvider";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? t.auth.registrationFailed);
      return;
    }
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">{t.auth.registerTitle}</h1>
      <form className="card space-y-4 p-6" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder={t.auth.fullName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          minLength={8}
          placeholder={t.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary w-full" type="submit">
          {t.auth.createAccount}
        </button>
      </form>
    </div>
  );
}
