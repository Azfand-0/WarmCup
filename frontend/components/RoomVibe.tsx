"use client";
import { useState } from "react";
import type { RoomVibe } from "@/lib/useChat";

const VIBES: { id: RoomVibe; label: string; emoji: string; color: string }[] = [
  { id: "chill",      label: "Chill",      emoji: "🌙", color: "#a0b4e8" },
  { id: "supportive", label: "Supportive", emoji: "💜", color: "#b8a9d4" },
  { id: "silly",      label: "Silly",      emoji: "😄", color: "#e8c4a0" },
  { id: "deep",       label: "Deep Talk",  emoji: "🌊", color: "#a0c4e8" },
];

interface Props {
  vibe: RoomVibe;
  onVote: (vibe: string) => void;
}

export default function RoomVibe({ vibe, onVote }: Props) {
  const [open, setOpen] = useState(false);
  const current = VIBES.find((v) => v.id === vibe) ?? VIBES[1];

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
        style={{
          background: `${current.color}18`,
          color: current.color,
          border: `1px solid ${current.color}40`,
        }}
      >
        {current.emoji} {current.label}
        <span style={{ fontSize: "10px", color: "var(--muted)" }}>▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full right-0 mt-1 z-20 rounded-2xl p-2 flex flex-col gap-1 min-w-[150px]"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
          >
            <p className="text-xs px-2 pb-1" style={{ color: "var(--muted)" }}>Set room vibe</p>
            {VIBES.map((v) => (
              <button
                key={v.id}
                onClick={() => { onVote(v.id); setOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors hover:opacity-80"
                style={{
                  background: v.id === vibe ? `${v.color}18` : "transparent",
                  color: v.id === vibe ? v.color : "var(--text-soft)",
                  fontWeight: v.id === vibe ? 600 : 400,
                }}
              >
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
