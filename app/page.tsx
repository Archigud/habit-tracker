"use client";

import Achievements from "@/components/Achievements";
import AddHabitForm from "@/components/AddHabitForm";
import HabitCard from "@/components/HabitCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useHabits } from "@/lib/useHabits";

export default function Page() {
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
          <div>
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
          <ThemeToggle />
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
        Данные хранятся локально в вашем браузере.
      </footer>
    </main>
  );
}
