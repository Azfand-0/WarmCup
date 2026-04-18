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
}

export default function OnlineUsers({ users, myUserId }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="px-2 mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest hover:opacity-80"
        style={{ color: "var(--muted)" }}
      >
        <span>👥 Online — {users.length}</span>
        <span style={{ fontSize: "10px" }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-1 space-y-0.5">
          {users.map((u) => (
            <div key={u.userId} className="flex items-center gap-2 px-2 py-1 rounded-lg" style={{ background: "transparent" }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${u.color}25`, color: u.color, border: `1px solid ${u.color}50` }}
              >
                {u.username[0]?.toUpperCase()}
              </div>
              <span className="text-xs truncate flex-1" style={{ color: u.userId === myUserId ? "var(--accent)" : "var(--text-soft)" }}>
                {u.username}{u.userId === myUserId ? " (you)" : ""}
              </span>
              {u.mood && <span className="text-xs flex-shrink-0">{u.mood}</span>}
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--online)" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
