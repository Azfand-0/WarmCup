"use client";
import { useEffect, useState } from "react";

const KEY = "warmcup_onboarded";

const SCREENS = [
  {
    icon: "🕯️",
    title: "This is WarmCup.",
    body: "Real people, real-time, when panic hits. No scripts, no bots, no algorithms — just humans showing up for each other at 2am.",
    cta: "Next",
  },
  {
    icon: "🔒",
    title: "Everything is anonymous.",
    body: "No account. No name. No record. What you say here disappears when you leave. You can say anything.",
    cta: "Next",
  },
  {
    icon: "💜",
    title: "You are safe here.",
    body: "If you're ever in crisis, one tap always shows a trained helpline in your country. You are never alone.",
    cta: "I'm ready — open the room",
  },
];

interface Props { onDone: () => void; }

export default function OnboardingModal({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  function advance() {
    if (step < SCREENS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function finish() {
    localStorage.setItem(KEY, "1");
    setVisible(false);
    onDone();
  }

  if (!visible) return null;

  const screen = SCREENS[step];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to WarmCup"
    >
      <div
        className="w-full max-w-sm rounded-3xl p-7 space-y-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Progress */}
        <div className="flex justify-center gap-1.5" role="tablist" aria-label="Onboarding step">
          {SCREENS.map((_, i) => (
            <div
              key={i}
              role="tab"
              aria-selected={i === step}
              className="rounded-full transition-all"
              style={{
                width: i === step ? "24px" : "6px",
                height: "6px",
                background: i === step ? "var(--accent)" : i < step ? "rgba(196,149,106,0.4)" : "var(--border)",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="text-5xl" aria-hidden="true">{screen.icon}</div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{screen.title}</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{screen.body}</p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={advance}
            autoFocus
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)",
              color: "#0f0d0a",
              outlineColor: "var(--accent)",
            }}
          >
            {screen.cta}
          </button>
          <button
            onClick={finish}
            className="w-full py-2 text-xs transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-xl"
            style={{ color: "var(--muted)", outlineColor: "var(--accent)" }}
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
