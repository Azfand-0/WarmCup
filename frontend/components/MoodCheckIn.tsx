"use client";

const MOODS = [
  { emoji: "😰", label: "Panicking",   color: "#e87c6a" },
  { emoji: "😟", label: "Anxious",     color: "#e8b46a" },
  { emoji: "😐", label: "Okay",        color: "#a0c4e8" },
  { emoji: "🙂", label: "Alright",     color: "#7ec8a0" },
];

interface Props {
  onSelect: (mood: string) => void;
}

export default function MoodCheckIn({ onSelect }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.95)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-xs rounded-3xl p-8 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-2xl mb-2">👋</p>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
          How are you right now?
        </h2>
        <p className="text-xs mb-8" style={{ color: "var(--muted)" }}>
          Others will see this gently next to your name
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              onClick={() => onSelect(m.emoji)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 hover:opacity-90"
              style={{
                background: `${m.color}18`,
                border: `1px solid ${m.color}40`,
              }}
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-soft)" }}>
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect("")}
          className="text-xs"
          style={{ color: "var(--muted)" }}
        >
          Skip — prefer not to share
        </button>
      </div>
    </div>
  );
}
