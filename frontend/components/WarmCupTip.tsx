"use client";
import { useState } from "react";

interface Props {
  targetUsername: string;
  targetUserId: string;
  onSendGratitude: (targetUserId: string, message: string) => void;
  onClose: () => void;
}

export default function WarmCupTip({ targetUsername, targetUserId, onSendGratitude, onClose }: Props) {
  const [step, setStep]     = useState<"tip" | "gratitude" | "done">("tip");
  const [message, setMessage] = useState("");

  function sendGratitude() {
    onSendGratitude(targetUserId, message || "Thank you — you helped me 🤍");
    setStep("done");
    setTimeout(onClose, 2500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.93)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-xs rounded-3xl p-6 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {step === "tip" && (
          <>
            <p className="text-4xl mb-3">🍵</p>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>
              Send {targetUsername} a warm cup
            </h3>
            <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>
              A small token that says "you helped me"
            </p>

            <div className="space-y-2 mb-6">
              {[
                { label: "☕ Warm Cup",   price: "$0.99",  note: "A simple thank you" },
                { label: "🍵 Hot Tea",    price: "$1.99",  note: "You really helped" },
                { label: "🌟 Warm Hug",  price: "$4.99",  note: "You made a difference" },
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => setStep("gratitude")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                >
                  <span className="text-sm" style={{ color: "var(--text)" }}>{t.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>{t.price}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{t.note}</div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Payments coming soon. Send a free thank you for now.
            </p>
            <button
              onClick={() => setStep("gratitude")}
              className="w-full py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "rgba(196,149,106,0.15)", color: "var(--accent)", border: "1px solid rgba(196,149,106,0.3)" }}
            >
              🤍 Send a free thank you
            </button>
            <button onClick={onClose} className="mt-3 text-xs w-full" style={{ color: "var(--muted)" }}>Cancel</button>
          </>
        )}

        {step === "gratitude" && (
          <>
            <p className="text-4xl mb-3">🤍</p>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>
              Send a thank you to {targetUsername}
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>They&apos;ll receive it privately</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
              rows={3}
              placeholder="Thank you for being here with me…"
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none mb-4"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
            <button
              onClick={sendGratitude}
              className="w-full py-3 rounded-xl text-sm font-semibold active:scale-95"
              style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
            >
              Send 🤍
            </button>
          </>
        )}

        {step === "done" && (
          <>
            <p className="text-5xl mb-4">💌</p>
            <h3 className="font-semibold" style={{ color: "var(--online)" }}>Sent!</h3>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>{targetUsername} just received your warm thank you.</p>
          </>
        )}
      </div>
    </div>
  );
}
