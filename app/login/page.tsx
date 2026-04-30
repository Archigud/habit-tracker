"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Неверный email или пароль");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Theme toggle top-right */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🌿</div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-gray-50">
            Трекер привычек
          </h1>
          <p className="mt-1 text-sm text-muted dark:text-gray-400">
            Войдите, чтобы продолжить
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line dark:border-gray-700 bg-surface dark:bg-gray-900 p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted dark:text-gray-400">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-line dark:border-gray-700 bg-canvas dark:bg-gray-800 px-3 py-2.5 text-sm text-ink dark:text-gray-100 placeholder:text-muted dark:placeholder:text-gray-600 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accentSoft dark:focus:ring-emerald-900"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted dark:text-gray-400">
                Пароль
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-line dark:border-gray-700 bg-canvas dark:bg-gray-800 px-3 py-2.5 text-sm text-ink dark:text-gray-100 placeholder:text-muted dark:placeholder:text-gray-600 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accentSoft dark:focus:ring-emerald-900"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-5 w-full rounded-xl bg-ink dark:bg-gray-100 py-2.5 text-sm font-medium text-white dark:text-gray-900 hover:bg-ink/90 dark:hover:bg-gray-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-line dark:disabled:bg-gray-700 disabled:text-muted dark:disabled:text-gray-500"
          >
            {loading ? "Вход…" : "Войти"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted dark:text-gray-600">
          Данные хранятся в защищённой базе данных
        </p>
      </div>
    </main>
  );
}
