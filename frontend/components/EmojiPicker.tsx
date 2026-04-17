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
  const [open, setOpen]   = useState(false);
  const [tab, setTab]     = useState(0);
  const ref               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:opacity-80 active:scale-95"
        style={{
          background: open ? "rgba(196,149,106,0.15)" : "var(--surface2)",
          border: `1px solid ${open ? "rgba(196,149,106,0.4)" : "var(--border)"}`,
          color: open ? "var(--accent)" : "var(--muted)",
        }}
        title="Add emoji"
      >
        😊
      </button>

      {open && (
        <div
          className="absolute bottom-full right-0 mb-2 z-30 rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
            width: "280px",
          }}
        >
          {/* Tabs */}
          <div
            className="flex border-b px-2 pt-2 gap-1"
            style={{ borderColor: "var(--border)" }}
          >
            {EMOJI_GROUPS.map((g, i) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setTab(i)}
                className="flex-1 text-xs py-1.5 rounded-t-lg transition-colors"
                style={{
                  background: tab === i ? "var(--surface2)" : "transparent",
                  color: tab === i ? "var(--accent)" : "var(--muted)",
                  fontWeight: tab === i ? 600 : 400,
                }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="p-3 grid grid-cols-8 gap-1">
            {EMOJI_GROUPS[tab].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onSelect(emoji); setOpen(false); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-125 active:scale-95"
                style={{ background: "transparent" }}
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
