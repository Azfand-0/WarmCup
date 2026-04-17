"use client";
import { useState } from "react";

const REASONS = [
  { id: "harassment",  label: "Harassment or bullying",        icon: "😤" },
  { id: "grooming",    label: "Grooming or predatory behavior", icon: "🚨" },
  { id: "hate",        label: "Hate speech or slurs",          icon: "🚫" },
  { id: "spam",        label: "Spam or flooding",              icon: "💬" },
  { id: "other",       label: "Something else",                icon: "⚠️" },
];

interface Props {
  messageId: string;
  username: string;
  onClose: () => void;
  onReport: (messageId: string, reason: string) => void;
}

export default function ReportModal({ messageId, username, onClose, onReport }: Props) {
  const [selected, setSelected] = useState("");
  const [done, setDone]         = useState(false);

  function submit() {
    if (!selected) return;
    onReport(messageId, selected);
    setDone(true);
    setTimeout(onClose, 2500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.93)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-xs rounded-3xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {done ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-3">✅</p>
            <p className="font-semibold" style={{ color: "var(--text)" }}>Report submitted</p>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              Message hidden. Our moderation team will review it.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                  Report message
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  from <span style={{ color: "var(--accent)" }}>{username}</span>
                </p>
              </div>
              <button onClick={onClose} style={{ color: "var(--muted)", fontSize: "13px" }}>✕</button>
            </div>

            <div className="space-y-1.5 mb-5">
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: selected === r.id ? "rgba(196,149,106,0.12)" : "var(--surface2)",
                    border: `1px solid ${selected === r.id ? "rgba(196,149,106,0.35)" : "var(--border)"}`,
                    color: "var(--text-soft)",
                  }}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={submit}
              disabled={!selected}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 active:scale-95"
              style={{ background: "#c47a6a", color: "#fff" }}
            >
              Submit report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
