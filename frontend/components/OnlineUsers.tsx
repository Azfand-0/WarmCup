"use client";
import { useState } from "react";

export interface OnlineUser {
  userId: string;
  username: string;
  color: string;
  mood: string;
}

interface Props {
  users: OnlineUser[];
  myUserId: string;
  anchorId?: string | null;
  onSetAnchor?: (userId: string | null) => void;
}

export default function OnlineUsers({ users, myUserId, anchorId, onSetAnchor }: Props) {
  const [open, setOpen]       = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="px-2 mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Online users, ${users.length} people`}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest hover:opacity-80"
        style={{ color: "var(--muted)" }}
      >
        <span>👥 Online — {users.length}</span>
        <span aria-hidden="true" style={{ fontSize: "10px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5" role="list" aria-label="People in this room">
          {users.map((u) => {
            const isMe     = u.userId === myUserId;
            const isAnchor = anchorId === u.userId;

            return (
              <li
                key={u.userId}
                className="flex items-center gap-2 px-2 py-1 rounded-lg"
                style={{ background: "transparent" }}
                onMouseEnter={() => setHovered(u.userId)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  aria-hidden="true"
                  style={{ background: `${u.color}25`, color: u.color, border: `1px solid ${u.color}50` }}
                >
                  {u.username[0]?.toUpperCase()}
                </div>

                <span className="text-xs truncate flex-1" style={{ color: isMe ? "var(--accent)" : "var(--text-soft)" }}>
                  {u.username}{isMe ? " (you)" : ""}
                  {isAnchor && (
                    <span className="ml-1" title="Your anchor" aria-label="anchor">⚓</span>
                  )}
                </span>

                {u.mood && <span className="text-xs flex-shrink-0" aria-hidden="true">{u.mood}</span>}

                {/* Anchor toggle on hover — only for others */}
                {!isMe && onSetAnchor && hovered === u.userId && (
                  <button
                    onClick={() => onSetAnchor(isAnchor ? null : u.userId)}
                    aria-label={isAnchor ? `Remove ${u.username} as anchor` : `Set ${u.username} as your anchor`}
                    title={isAnchor ? "Remove anchor" : "Set as anchor — get notified when they're here"}
                    className="text-xs flex-shrink-0 transition-opacity"
                    style={{ color: isAnchor ? "var(--accent)" : "var(--muted)", opacity: isAnchor ? 1 : 0.6 }}
                  >
                    ⚓
                  </button>
                )}

                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 online-dot"
                  aria-hidden="true"
                  style={{ background: "var(--online)" }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
