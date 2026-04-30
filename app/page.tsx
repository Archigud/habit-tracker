"use client";

import { signOut, useSession } from "next-auth/react";
import Achievements from "@/components/Achievements";
import AddHabitForm from "@/components/AddHabitForm";
import HabitCard from "@/components/HabitCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useHabits } from "@/lib/useHabits";

export default function Page() {
  const { data: session } = useSession();
  const { habits, hydrated, addHabit, toggleToday, resetHabit, deleteHabit } =
    useHabits();

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 sm:mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted dark:text-gray-500">
              {today}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink dark:text-gray-50 sm:text-3xl">
              Трекер привычек
            </h1>
            <p className="mt-1 text-sm text-muted dark:text-gray-400">
              Маленькие шаги каждый день складываются в большие изменения.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title={session?.user?.email ?? "Выйти"}
              className="flex h-9 items-center gap-1.5 rounded-xl px-3 ring-1 ring-line dark:ring-gray-700 bg-surface dark:bg-gray-800 text-xs font-medium text-muted dark:text-gray-400 hover:bg-canvas dark:hover:bg-gray-700 hover:text-ink dark:hover:text-gray-100 active:scale-95"
            >
              <span className="max-w-[96px] truncate hidden sm:block">
                {session?.user?.email}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-3">
          <AddHabitForm onAdd={addHabit} />

          {hydrated && habits.length === 0 && (
            <div className="animate-fade-in rounded-2xl border border-dashed border-line dark:border-gray-700 bg-surface dark:bg-gray-900 p-8 text-center">
              <div className="text-3xl">🌿</div>
              <h2 className="mt-2 text-sm font-semibold text-ink dark:text-gray-200">
                Здесь пока пусто
              </h2>
              <p className="mt-1 text-xs text-muted dark:text-gray-500">
                Добавьте первую привычку, чтобы начать отслеживать прогресс.
              </p>
            </div>
          )}

          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleToday}
              onReset={resetHabit}
              onDelete={deleteHabit}
            />
          ))}
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Achievements habits={habits} />
        </aside>
      </div>

      <footer className="mt-12 text-center text-xs text-muted dark:text-gray-600">
        Данные хранятся в защищённой базе данных Neon.
      </footer>
    </main>
  );
}
