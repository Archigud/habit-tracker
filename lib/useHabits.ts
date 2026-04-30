"use client";

import { useCallback, useEffect, useState } from "react";
import { Habit, todayKey } from "./types";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetch("/api/habits")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setHabits(Array.isArray(data) ? data : []);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  const addHabit = useCallback(async (name: string, emoji: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = makeId();
    const habit: Habit = {
      id,
      name: trimmed,
      emoji: emoji || "✨",
      createdAt: new Date().toISOString(),
      completions: [],
    };
    // Optimistic update
    setHabits((prev) => [habit, ...prev]);

    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: trimmed, emoji: emoji || "✨" }),
    });
  }, []);

  const toggleToday = useCallback(async (id: string) => {
    const day = todayKey();
    // Optimistic update
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

    await fetch(`/api/habits/${id}/toggle`, { method: "POST" });
  }, []);

  const resetHabit = useCallback(async (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completions: [] } : h)),
    );
    await fetch(`/api/habits/${id}/reset`, { method: "POST" });
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
  }, []);

  return { habits, hydrated, addHabit, toggleToday, resetHabit, deleteHabit };
}
