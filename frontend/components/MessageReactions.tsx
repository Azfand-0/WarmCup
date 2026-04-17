"use client";
import { useState } from "react";

const EMOJIS = ["🤍", "❤️‍🩹", "💪", "🫂"];

interface Props {
  messageId: string;
  reactions: Record<string, string[]>;  // emoji -> userIds
  myUserId: string;
  onReact: (messageId: string, emoji: string, action: "add" | "remove") => void;
}

export default function MessageReactions({ messageId, reactions, myUserId, onReact }: Props) {
  const [hovering, setHovering] = useState(false);

  const hasReactions = Object.values(reactions).some((users) => users.length > 0);

  return (
    <div
      className="relative flex items-center gap-1 mt-1"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Existing reactions */}
      {hasReactions &&
        EMOJIS.filter((e) => (reactions[e]?.length ?? 0) > 0).map((emoji) => {
          const users = reactions[emoji] ?? [];
          const iMine = users.includes(myUserId);
          return (
            <button
              key={emoji}
              onClick={() => onReact(messageId, emoji, iMine ? "remove" : "add")}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
              style={{
                background: iMine ? "rgba(196,149,106,0.2)" : "var(--surface2)",
                border: `1px solid ${iMine ? "rgba(196,149,106,0.4)" : "var(--border)"}`,
                color: iMine ? "var(--accent)" : "var(--muted)",
              }}
            >
              {emoji} {users.length}
            </button>
          );
        })}

      {/* Add reaction picker (shows on hover) */}
      {hovering && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
        >
          {EMOJIS.map((emoji) => {
            const iMine = (reactions[emoji] ?? []).includes(myUserId);
            return (
              <button
                key={emoji}
                onClick={() => onReact(messageId, emoji, iMine ? "remove" : "add")}
                className="text-sm transition-transform hover:scale-125 active:scale-95"
                title={emoji}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
