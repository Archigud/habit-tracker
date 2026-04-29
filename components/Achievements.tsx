"use client";

import { Habit, lastNDays, overallWeeklyProgress, weeklyProgress } from "@/lib/types";
import ProgressRing from "./ProgressRing";

type Props = {
  habits: Habit[];
};

type Badge = {
  id: string;
  title: string;
  hint: string;
  unlocked: boolean;
  emoji: string;
};

function buildBadges(habits: Habit[]): Badge[] {
  const week = lastNDays(7);
  const today = week[week.length - 1];
  const totalThisWeek = habits.reduce(
    (sum, h) => sum + week.filter((d) => h.completions.includes(d)).length,
    0,
  );
  const allDoneToday =
    habits.length > 0 && habits.every((h) => h.completions.includes(today));
  const hasPerfectHabit = habits.some((h) => weeklyProgress(h) === 100);
  const hasStarted = habits.length > 0;

  return [
    {
      id: "first-step",
      title: "Первый шаг",
      hint: "Создать первую привычку",
      unlocked: hasStarted,
      emoji: "🌱",
    },
    {
      id: "today-hero",
      title: "Герой дня",
      hint: "Выполнить все привычки за день",
      unlocked: allDoneToday,
      emoji: "⚡",
    },
    {
      id: "consistent",
      title: "Постоянство",
      hint: "Выполнить 5+ отметок за неделю",
      unlocked: totalThisWeek >= 5,
      emoji: "🔥",
    },
    {
      id: "perfect-week",
      title: "Идеальная неделя",
      hint: "Хотя бы одна привычка с 100%",
      unlocked: hasPerfectHabit,
      emoji: "🏆",
    },
  ];
}

export default function Achievements({ habits }: Props) {
  const overall = overallWeeklyProgress(habits);
  const badges = buildBadges(habits);
  const week = lastNDays(7);

  const completedCount = habits.filter((h) =>
    h.completions.includes(week[week.length - 1]),
  ).length;

  return (
    <section className="rounded-2xl border border-line dark:border-gray-700/60 bg-surface dark:bg-gray-900 p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink dark:text-gray-100 sm:text-lg">
            Мои достижения
          </h2>
          <p className="mt-0.5 text-xs text-muted dark:text-gray-400">Прогресс за последние 7 дней</p>
        </div>
        <ProgressRing value={overall} size={64} stroke={6} />
      </header>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Stat
          label="Привычек"
          value={habits.length.toString()}
          hint={habits.length === 1 ? "активная" : "активных"}
        />
        <Stat
          label="Сегодня"
          value={`${completedCount}/${habits.length || 0}`}
          hint="выполнено"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted dark:text-gray-500">
          Бейджи
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl border p-3 text-center ${
                b.unlocked
                  ? "border-accent/30 dark:border-emerald-700/40 bg-accentSoft/40 dark:bg-emerald-900/20"
                  : "border-line dark:border-gray-700 bg-canvas dark:bg-gray-800 opacity-50"
              }`}
              title={b.hint}
            >
              <div className={`text-2xl ${b.unlocked ? "" : "grayscale"}`} aria-hidden>
                {b.emoji}
              </div>
              <div className="mt-1 text-xs font-medium text-ink dark:text-gray-200">{b.title}</div>
              <div className="mt-0.5 text-[10px] leading-tight text-muted dark:text-gray-500">
                {b.hint}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-canvas dark:bg-gray-800 p-3">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted dark:text-gray-400">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-semibold tabular-nums text-ink dark:text-gray-100">
          {value}
        </span>
        <span className="text-xs text-muted dark:text-gray-400">{hint}</span>
      </div>
    </div>
  );
}
