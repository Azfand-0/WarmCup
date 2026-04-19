"use client";
import { useState } from "react";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const STEPS = [
  {
    icon: "🫂",
    title: "You won't be alone",
    body: "This will connect you with one person who's also struggling right now. They're not a therapist — just another human showing up.",
  },
  {
    icon: "🤍",
    title: "You don't need to say anything profound",
    body: '"I\'m here" is enough. Sometimes just knowing another person is present makes the panic smaller. You can leave at any time.',
  },
  {
    icon: "🫁",
    title: "Breathe first if you need to",
    body: "The breathing exercise will open automatically. You can just breathe together without typing a single word. Ready when you are.",
  },
];

export default function PanicMatchModal({ onConfirm, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-sm rounded-3xl p-6 space-y-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === step ? "20px" : "6px",
                height: "6px",
                background: i === step ? "var(--accent)" : "var(--border)",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-3">
          <div className="text-4xl">{current.icon}</div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{current.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{current.body}</p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => isLast ? onConfirm() : setStep((s) => s + 1)}
            className="w-full py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
          >
            {isLast ? "Connect me →" : "Next →"}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 rounded-2xl text-sm transition-all hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            Take me to the group room instead
          </button>
        </div>
      </div>
    </div>
  );
}
