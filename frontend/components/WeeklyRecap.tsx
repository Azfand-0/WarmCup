"use client";
import { useState } from "react";
import type { WeekStats } from "@/lib/useWeeklyRecap";

const DAY_LABELS: Record<number, string> = {
  1: "One day this week",
  2: "Two days this week",
  3: "Three days",
  4: "Four days",
  5: "Five days!",
  6: "Six days!",
  7: "Every single day 🔥",
};

interface Props { stats: WeekStats; onClose: () => void; }

export default function WeeklyRecap({ stats, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,13,10,0.93)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-4xl mb-4">📊</p>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>Your week</h2>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Private — only visible to you</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: "Days showed up",    value: DAY_LABELS[stats.daysThisWeek] ?? `${stats.daysThisWeek} days`, accent: "var(--accent)" },
            { label: "Messages shared",   value: String(stats.totalMessages),               accent: "var(--lavender)" },
            { label: "Favourite room",    value: stats.topRoom,                             accent: "var(--online)"  },
            { label: "Current streak",    value: `Day ${stats.streak}`,                    accent: "var(--accent)"  },
          ].map(({ label, value, accent }) => (
            <div key={label} className="p-4 rounded-2xl text-left" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{label}</div>
              <div className="text-sm font-semibold capitalize" style={{ color: accent }}>{value}</div>
            </div>
          ))}
        </div>

        <p className="text-sm italic mb-6" style={{ color: "var(--lavender)" }}>
          &ldquo;You showed up {stats.daysThisWeek} {stats.daysThisWeek === 1 ? "time" : "times"} this week. That matters.&rdquo;
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-semibold"
          style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
