"use client";
import { useState } from "react";

interface Props { onClose: () => void; }

const STEPS = [
  { count: 5, sense: "see",   emoji: "👀", instruction: "Look around slowly. Name 5 things you can see right now.", color: "var(--accent)"   },
  { count: 4, sense: "touch", emoji: "🖐️", instruction: "Notice 4 things you can physically feel — your chair, your clothes, the air.", color: "var(--lavender)" },
  { count: 3, sense: "hear",  emoji: "👂", instruction: "Listen carefully. What are 3 sounds you can hear?", color: "var(--online)"   },
  { count: 2, sense: "smell", emoji: "👃", instruction: "What are 2 things you can smell? (Even faint scents count.)", color: "#c4956a"   },
  { count: 1, sense: "taste", emoji: "👅", instruction: "Notice 1 thing you can taste right now.", color: "var(--lavender)" },
];

export default function GroundingModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const current = STEPS[step];

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else setDone(true);
  }

  if (done) {
    return (
      <Overlay>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-5xl">💚</div>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            You&apos;re grounded.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
            You just proved your senses work. You&apos;re here, in your body,
            and you are safe. The panic cannot hurt you.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#0f0d0a" }}
          >
            I feel better
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === step ? "24px" : "8px",
              background: i <= step ? current.color : "var(--border)",
            }}
          />
        ))}
      </div>

      {/* Sense badge */}
      <div className="flex flex-col items-center gap-4 text-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: `${current.color}18`,
            border: `1px solid ${current.color}40`,
          }}
        >
          {current.emoji}
        </div>

        <div>
          <p className="text-3xl font-bold mb-1" style={{ color: current.color }}>
            {current.count}
          </p>
          <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
            things you can {current.sense}
          </h2>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
          {current.instruction}
        </p>
      </div>

      <p className="text-xs text-center mb-6" style={{ color: "var(--muted)" }}>
        Take your time. Say them out loud if you can.
      </p>

      <button
        onClick={next}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
        style={{ background: current.color, color: "#0f0d0a" }}
      >
        {step < STEPS.length - 1 ? `Done → Next (${STEPS[step + 1].count} things)` : "I did it ✓"}
      </button>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.92)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "var(--surface2)", color: "var(--muted)" }}
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
