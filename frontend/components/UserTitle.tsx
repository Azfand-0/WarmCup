"use client";

interface Props { title: string; emoji: string; }

export default function UserTitle({ title, emoji }: Props) {
  if (!title) return null;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: "rgba(196,149,106,0.12)", color: "var(--accent)", border: "1px solid rgba(196,149,106,0.2)" }}
    >
      {emoji} {title}
    </span>
  );
}
