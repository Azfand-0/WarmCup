"use client";
import { useEffect, useState } from "react";

export function useStreak(): number {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("warmcup_last_visit");
    const stored = parseInt(localStorage.getItem("warmcup_streak") ?? "0", 10);

    if (lastVisit === today) {
      setStreak(stored);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newStreak = lastVisit === yesterday.toDateString() ? stored + 1 : 1;

    localStorage.setItem("warmcup_last_visit", today);
    localStorage.setItem("warmcup_streak", String(newStreak));
    setStreak(newStreak);
  }, []);

  return streak;
}
