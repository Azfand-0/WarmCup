"use client";
import { useState } from "react";

export interface Level {
  num: number;
  badge: string;
  name: string;
  min: number;
  next: number | null;
}

const LEVEL_TABLE: Omit<Level, "num">[] = [
  { badge: "🌱", name: "Seedling",  min: 0,    next: 10   },
  { badge: "🌿", name: "Sprout",    min: 10,   next: 25   },
  { badge: "🌸", name: "Bloom",     min: 25,   next: 50   },
  { badge: "✨", name: "Shining",   min: 50,   next: 100  },
  { badge: "💫", name: "Glowing",   min: 100,  next: 250  },
  { badge: "🔥", name: "Warm",      min: 250,  next: 500  },
  { badge: "💎", name: "Crystal",   min: 500,  next: 1000 },
  { badge: "👑", name: "Guardian",  min: 1000, next: null },
];

export function getLevel(count: number): Level {
  let idx = 0;
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (count >= LEVEL_TABLE[i].min) { idx = i; break; }
  }
  return { num: idx + 1, ...LEVEL_TABLE[idx] };
}

const KEY = "warmcup_msg_count";

export function useLevel() {
  const [msgCount, setMsgCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(KEY) ?? "0", 10);
  });

  function increment() {
    setMsgCount((c) => {
      const next = c + 1;
      localStorage.setItem(KEY, String(next));
      return next;
    });
  }

  return { msgCount, level: getLevel(msgCount), increment };
}
