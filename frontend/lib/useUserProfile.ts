"use client";
import { useEffect, useState } from "react";

export interface UserProfile {
  flair:     string;
  calmMode:  boolean;
  title:     string;
  titleEmoji: string;
}

// Titles earned from localStorage stats
function computeTitle(streak: number, visits: number): { title: string; emoji: string } {
  if (streak >= 30) return { title: "Lighthouse",  emoji: "🔆" };
  if (streak >= 14) return { title: "Anchor",       emoji: "⚓" };
  if (streak >= 7)  return { title: "Regular",      emoji: "🌿" };
  if (visits >= 50) return { title: "Warm Soul",    emoji: "🤍" };
  if (visits >= 20) return { title: "Voice",        emoji: "🗣️" };
  const hour = new Date().getHours();
  if (hour >= 23 || hour < 4)  return { title: "Night Owl",   emoji: "🦉" };
  if (hour >= 5  && hour < 8)  return { title: "Early Bird",  emoji: "🌅" };
  return { title: "", emoji: "" };
}

export function useUserProfile(): [UserProfile, (patch: Partial<UserProfile>) => void] {
  const [profile, setProfile] = useState<UserProfile>({
    flair: "", calmMode: false, title: "", titleEmoji: "",
  });

  useEffect(() => {
    const streak = parseInt(localStorage.getItem("warmcup_streak") ?? "0", 10);
    const raw    = localStorage.getItem("warmcup_visits");
    const visits = raw ? (JSON.parse(raw) as unknown[]).length : 0;
    const { title, emoji } = computeTitle(streak, visits);

    const saved = localStorage.getItem("warmcup_profile");
    const base  = saved ? JSON.parse(saved) : {};
    setProfile({ flair: base.flair ?? "", calmMode: base.calmMode ?? false, title, titleEmoji: emoji });
  }, []);

  const update = (patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("warmcup_profile", JSON.stringify({ flair: next.flair, calmMode: next.calmMode }));
      return next;
    });
  };

  return [profile, update];
}
