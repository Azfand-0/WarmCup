"use client";
import { useState } from "react";

const FLAIRS = ["", "😴", "🎵", "☕", "🌧️", "📚", "🌙", "🌅", "💪", "🫂"];

interface Props {
  current: string;
  onChange: (flair: string) => void;
}

export default function MoodFlair({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Set your flair"
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-opacity hover:opacity-80"
        style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: current || "var(--muted)" }}
      >
        {current || "✨"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute bottom-full right-0 mb-2 z-20 rounded-2xl p-3"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
          >
            <p className="text-xs mb-2 px-1" style={{ color: "var(--muted)" }}>Your vibe right now</p>
            <div className="grid grid-cols-5 gap-1">
              {FLAIRS.map((f) => (
                <button
                  key={f || "none"}
                  onClick={() => { onChange(f); setOpen(false); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: f === current ? "rgba(196,149,106,0.2)" : "var(--surface3)",
                    border: f === current ? "1px solid rgba(196,149,106,0.4)" : "1px solid transparent",
                  }}
                  title={f || "None"}
                >
                  {f || "✕"}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
