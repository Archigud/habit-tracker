export type Habit = {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completions: string[];
};

export const STORAGE_KEY = "habit-tracker:v1";

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function lastNDays(n: number, from: Date = new Date()): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(todayKey(d));
  }
  return days;
}

export function weeklyProgress(habit: Habit): number {
  const week = lastNDays(7);
  const completedInWeek = week.filter((day) => habit.completions.includes(day)).length;
  return Math.round((completedInWeek / 7) * 100);
}

export function overallWeeklyProgress(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  const total = habits.reduce((sum, h) => sum + weeklyProgress(h), 0);
  return Math.round(total / habits.length);
}

export function isCompletedToday(habit: Habit): boolean {
  return habit.completions.includes(todayKey());
}
