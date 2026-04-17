"use client";
import { useEffect, useRef, useState } from "react";

interface Props { onClose: () => void; }

// 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s (19s cycle)
// Clinically proven to activate the parasympathetic nervous system
const PHASES = [
  { label: "Breathe in",  duration: 4, scale: 1.4, color: "rgba(196,149,106,0.3)"  },
  { label: "Hold",        duration: 7, scale: 1.4, color: "rgba(184,169,212,0.3)"  },
  { label: "Breathe out", duration: 8, scale: 1.0, color: "rgba(126,200,160,0.2)"  },
];

export default function BreathingModal({ onClose }: Props) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [counter, setCounter]   = useState(PHASES[0].duration);
  const [cycles, setCycles]     = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    setCounter(phase.duration);
    timerRef.current = setInterval(() => {
      setCounter((c) => {
        if (c <= 1) {
          setPhaseIdx((p) => {
            const next = (p + 1) % PHASES.length;
            if (next === 0) setCycles((cy) => cy + 1);
            setCounter(PHASES[next].duration);
            return next;
          });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phaseIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.92)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-8 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-opacity hover:opacity-70"
          style={{ background: "var(--surface2)", color: "var(--muted)" }}
        >
          ✕
        </button>

        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            4-7-8 Breathing
          </h2>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Activates your calm response
          </p>
        </div>

        {/* Animated circle */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="absolute rounded-full transition-all"
            style={{
              width: "180px",
              height: "180px",
              border: "1px solid",
              borderColor: phase.phaseIdx === 1 ? "rgba(184,169,212,0.4)" : "rgba(196,149,106,0.3)",
              transform: `scale(${phase.scale})`,
              transition: `transform ${phase.duration}s ease-in-out, border-color 0.5s`,
              opacity: 0.4,
            }}
          />
          {/* Main circle */}
          <div
            className="rounded-full flex flex-col items-center justify-center transition-all"
            style={{
              width: "140px",
              height: "140px",
              background: phase.color,
              border: "1px solid rgba(196,149,106,0.25)",
              transform: `scale(${phase.scale})`,
              transition: `transform ${phase.duration}s ease-in-out, background ${phase.duration}s ease-in-out`,
            }}
          >
            <span className="text-3xl font-light tabular-nums" style={{ color: "var(--text)" }}>
              {counter}
            </span>
          </div>
        </div>

        {/* Phase label */}
        <div>
          <p className="text-xl font-medium" style={{ color: "var(--accent)" }}>
            {phase.label}
          </p>
          <div className="flex justify-center gap-1.5 mt-3">
            {PHASES.map((p, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === phaseIdx ? "24px" : "8px",
                  background: i === phaseIdx ? "var(--accent)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>

        {cycles > 0 && (
          <p className="text-sm" style={{ color: "var(--online)" }}>
            {cycles} {cycles === 1 ? "cycle" : "cycles"} complete 💚
          </p>
        )}

        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          Breathe in through your nose. Hold gently. Exhale slowly through your mouth.
        </p>
      </div>
    </div>
  );
}
