"use client";
import { useEffect, useRef, useState } from "react";

const EMOJI_GROUPS = [
  {
    label: "Feelings",
    emojis: ["😊","😢","😰","😟","😐","🙂","😔","😮‍💨","🥺","😌","😤","😩","🫠","🥹","😭","😅","🤗","😴","🫂","🤍"],
  },
  {
    label: "Support",
    emojis: ["💜","❤️","🤍","💚","💛","🧡","❤️‍🩹","🫶","👐","🙏","💪","✊","👋","🤝","🫁","🌿"],
  },
  {
    label: "Nature",
    emojis: ["🌙","⭐","🌟","☀️","🌤️","🌧️","🌈","🕯️","🌊","🍃","🌸","🌺","🌻","🍵","☕","🌿"],
  },
  {
    label: "Symbols",
    emojis: ["✨","💫","🔥","💤","💭","🗣️","👂","🤫","🫶","🙌","👏","🫡","🫢","💯","🌱","🕊️"],
  },
];

interface Props {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState(0);
  const ref             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:opacity-80 active:scale-95"
        style={{
          background: open ? "rgba(196,149,106,0.15)" : "var(--surface2)",
          border: `1px solid ${open ? "rgba(196,149,106,0.4)" : "var(--border)"}`,
        }}
        title="Add emoji"
      >
        😊
      </button>

      {open && (
        <div
          className="fixed z-50 rounded-2xl overflow-hidden"
          style={{
            bottom: "72px",
            left: "8px",
            right: "8px",
            maxWidth: "340px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.6)",
          }}
        >
          {/* Tab row */}
          <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
            {EMOJI_GROUPS.map((g, i) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setTab(i)}
                className="flex-1 py-2 text-xs font-medium transition-colors"
                style={{
                  background: tab === i ? "var(--surface2)" : "transparent",
                  color: tab === i ? "var(--accent)" : "var(--muted)",
                  borderBottom: tab === i ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Grid — 8 cols, bigger touch targets */}
          <div className="p-3 grid grid-cols-8 gap-0.5">
            {EMOJI_GROUPS[tab].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onSelect(emoji); setOpen(false); }}
                className="aspect-square rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
                style={{ background: "transparent", minWidth: 0 }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
