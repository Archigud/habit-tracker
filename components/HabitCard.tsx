"use client";

import { Habit, isCompletedToday, lastNDays, weeklyProgress } from "@/lib/types";
import ProgressRing from "./ProgressRing";

type Props = {
  habit: Habit;
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
};

const WEEKDAY = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function dayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const idx = (date.getDay() + 6) % 7;
  return WEEKDAY[idx];
}

export default function HabitCard({ habit, onToggle, onReset, onDelete }: Props) {
  const done = isCompletedToday(habit);
  const progress = weeklyProgress(habit);
  const week = lastNDays(7);

  return (
    <article className="animate-fade-in group rounded-2xl border border-line dark:border-gray-700/60 bg-surface dark:bg-gray-900 p-4 shadow-sm hover:shadow-md sm:p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas dark:bg-gray-800 text-xl">
          {habit.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-ink dark:text-gray-100 sm:text-base">
            {habit.name}
          </h3>
          <p className="text-xs text-muted dark:text-gray-400">{progress}% за 7 дней</p>
        </div>
        <ProgressRing value={progress} size={44} stroke={4} />
      </div>

      {/* Weekly grid */}
      <div className="mt-4 flex gap-1.5">
        {week.map((day, i) => {
          const isDone = habit.completions.includes(day);
          const isToday = i === week.length - 1;
          const label = dayLabel(day);

          if (isToday) {
            return (
              <button
                key={day}
                type="button"
                onClick={() => onToggle(habit.id)}
                title={isDone ? "Отменить выполнение" : "Отметить как выполнено"}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 ring-2 transition-all active:scale-95 ${
                  isDone
                    ? "bg-accent ring-accent"
                    : "bg-canvas dark:bg-gray-800 ring-ink/25 dark:ring-gray-500/50 hover:ring-ink/50 dark:hover:ring-gray-400/70"
                }`}
              >
                <span className={`text-sm font-bold ${isDone ? "text-white" : "text-ink dark:text-gray-100"}`}>
                  {isDone ? "✓" : "+"}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${isDone ? "text-white/80" : "text-ink dark:text-gray-300"}`}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <div key={day} className="flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5">
              <span className={`text-sm font-medium ${isDone ? "text-accent" : "text-muted dark:text-gray-600"}`}>
                {isDone ? "✓" : "·"}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted dark:text-gray-500">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status hint */}
      <p className="mt-2 text-center text-[11px] text-muted dark:text-gray-500">
        {done
          ? "Выполнено сегодня — так держать!"
          : "Нажмите на сегодняшний день, чтобы отметить"}
      </p>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-end gap-1 opacity-100 sm:opacity-50 sm:group-hover:opacity-100">
        <button
          onClick={() => onReset(habit.id)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted dark:text-gray-500 hover:bg-canvas dark:hover:bg-gray-800 hover:text-ink dark:hover:text-gray-200"
        >
          Сбросить
        </button>
        <button
          onClick={() => onDelete(habit.id)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          Удалить
        </button>
      </div>
    </article>
  );
}
