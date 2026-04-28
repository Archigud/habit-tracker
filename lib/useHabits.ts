"use client";

import { useCallback, useEffect, useState } from "react";
import { Habit, STORAGE_KEY, todayKey } from "./types";

function readStorage(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Habit[];
  } catch {
    return [];
  }
}

function writeStorage(habits: Habit[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHabits(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(habits);
  }, [habits, hydrated]);

  const addHabit = useCallback((name: string, emoji: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const habit: Habit = {
      id: makeId(),
      name: trimmed,
      emoji: emoji || "✨",
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits((prev) => [habit, ...prev]);
  }, []);

  const toggleToday = useCallback((id: string) => {
    const day = todayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(day);
        return {
          ...h,
          completions: has
            ? h.completions.filter((d) => d !== day)
            : [...h.completions, day],
        };
      }),
    );
  }, []);

  const resetHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completions: [] } : h)),
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return {
    habits,
    hydrated,
    addHabit,
    toggleToday,
    resetHabit,
    deleteHabit,
  };
}
