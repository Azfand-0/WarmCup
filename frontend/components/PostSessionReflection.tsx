"use client";
import { useState } from "react";

interface Props {
  onClose: () => void;
  onShareToWall: (text: string) => void;
}

const OPTIONS = [
  { emoji: "🫂", label: "Just being here with others" },
  { emoji: "🫁", label: "The breathing exercise" },
  { emoji: "💬", label: "Someone said something that helped" },
  { emoji: "💚", label: "I helped someone else" },
];

export default function PostSessionReflection({ onClose, onShareToWall }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shared, setShared]     = useState(false);

  function handleShare() {
    if (selected === null) return;
    const opt = OPTIONS[selected];
    onShareToWall(`I made it through. What helped: ${opt.label} ${opt.emoji}`);
    setShared(true);
    setTimeout(onClose, 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-sm rounded-3xl p-6 space-y-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {shared ? (
          <div className="text-center py-4 space-y-3">
            <div className="text-4xl">💚</div>
            <p className="font-semibold" style={{ color: "var(--online)" }}>Shared to the wall</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Someone struggling right now will see this.</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <div className="text-3xl">🌿</div>
              <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Before you go</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>What helped tonight? (tap one)</p>
            </div>

            <div className="space-y-2">
              {OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: selected === i ? "rgba(196,149,106,0.15)" : "var(--surface2)",
                    border: `1px solid ${selected === i ? "rgba(196,149,106,0.4)" : "var(--border)"}`,
                    color: selected === i ? "var(--accent)" : "var(--text-soft)",
                  }}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleShare}
                disabled={selected === null}
                className="w-full py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97] disabled:opacity-40"
                style={{ background: "rgba(126,200,160,0.12)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.25)" }}
              >
                💚 Share to the wall — help someone else
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-xs transition-all hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
