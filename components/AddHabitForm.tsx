"use client";

import { useState } from "react";

const EMOJI_CHOICES = ["✨", "💧", "📚", "🏃", "🧘", "🥗", "💤", "🎯", "✍️", "🎧"];

type Props = {
  onAdd: (name: string, emoji: string) => void;
};

export default function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, emoji);
    setName("");
    setEmoji(EMOJI_CHOICES[0]);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface px-4 py-4 text-sm font-medium text-muted hover:border-accent hover:text-accent active:scale-[0.99]"
      >
        <span className="text-lg leading-none transition-transform group-hover:rotate-90">＋</span>
        Добавить привычку
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in rounded-2xl border border-line bg-surface p-4 shadow-sm"
    >
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
        Название привычки
      </label>
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Например: Пить 2 литра воды"
        className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accentSoft"
        maxLength={60}
      />

      <label className="mb-2 mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
        Иконка
      </label>
      <div className="flex flex-wrap gap-1.5">
        {EMOJI_CHOICES.map((e) => (
          <button
            type="button"
            key={e}
            onClick={() => setEmoji(e)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${
              emoji === e
                ? "bg-accentSoft ring-2 ring-accent"
                : "bg-canvas hover:bg-line"
            }`}
            aria-label={`Выбрать ${e}`}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          Добавить
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName("");
          }}
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted hover:bg-canvas"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
