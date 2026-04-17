"use client";

interface Props { streak: number; }

const LABELS: Record<number, string> = {
  1:  "First step. Welcome 💛",
  2:  "Showing up again 🌱",
  3:  "3 days strong 🌿",
  7:  "One week of courage 🌟",
  14: "Two weeks. You're healing 💚",
  30: "A whole month. Incredible 🔥",
};

function getLabel(streak: number): string {
  const milestones = [30, 14, 7, 3, 2, 1];
  for (const m of milestones) {
    if (streak >= m) return LABELS[m];
  }
  return `Day ${streak} 🌱`;
}

export default function CheckInStreak({ streak }: Props) {
  if (streak < 1) return null;

  return (
    <div
      className="mx-3 mb-2 px-3 py-2.5 rounded-xl flex items-center gap-3"
      style={{
        background: "rgba(196,149,106,0.07)",
        border: "1px solid rgba(196,149,106,0.15)",
      }}
    >
      <div className="text-xl">🔥</div>
      <div>
        <div className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
          Day {streak} streak
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
          {getLabel(streak)}
        </div>
      </div>
    </div>
  );
}
