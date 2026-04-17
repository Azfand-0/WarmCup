"use client";
import { useEffect, useState } from "react";

interface DayEntry { date: string; room: string; messagesSent: number; }

export interface WeekStats {
  daysThisWeek: number;
  totalMessages: number;
  topRoom: string;
  streak: number;
}

const KEY = "warmcup_visits";
const MAX_ENTRIES = 90; // 3 months

export function recordVisit(room: string) {
  if (typeof window === "undefined") return;
  const today = new Date().toDateString();
  const raw   = localStorage.getItem(KEY);
  const entries: DayEntry[] = raw ? JSON.parse(raw) : [];
  const existing = entries.find((e) => e.date === today && e.room === room);
  if (existing) { existing.messagesSent++; }
  else { entries.push({ date: today, room, messagesSent: 1 }); }
  const trimmed = entries.slice(-MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function useWeeklyRecap(): WeekStats | null {
  const [stats, setStats] = useState<WeekStats | null>(null);

  useEffect(() => {
    const raw     = localStorage.getItem(KEY);
    if (!raw) return;
    const entries: DayEntry[] = JSON.parse(raw);

    // Last 7 days
    const cutoff  = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const week    = entries.filter((e) => new Date(e.date) >= cutoff);
    if (week.length === 0) return;

    const days    = new Set(week.map((e) => e.date)).size;
    const total   = week.reduce((s, e) => s + e.messagesSent, 0);
    const roomMap = week.reduce<Record<string, number>>((m, e) => {
      m[e.room] = (m[e.room] ?? 0) + 1; return m;
    }, {});
    const topRoom = Object.entries(roomMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "global";
    const streak  = parseInt(localStorage.getItem("warmcup_streak") ?? "0", 10);

    setStats({ daysThisWeek: days, totalMessages: total, topRoom, streak });
  }, []);

  return stats;
}
