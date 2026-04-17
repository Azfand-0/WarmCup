"use client";
import { useState } from "react";

export type PremiumTier = "none" | "calm" | "glow";

export interface PremiumStatus {
  tier: PremiumTier;
  customColor: string;    // calm+: picked color
  expiresAt: number | null;
}

const DEFAULT: PremiumStatus = {
  tier: "none",
  customColor: "",
  expiresAt: null,
};

const KEY = "warmcup_premium";

function loadPremium(): PremiumStatus {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const saved: PremiumStatus = JSON.parse(raw);
    if (saved.expiresAt && Date.now() > saved.expiresAt) {
      localStorage.removeItem(KEY);
      return DEFAULT;
    }
    return saved;
  } catch { return DEFAULT; }
}

export function usePremium(): [PremiumStatus, (patch: Partial<PremiumStatus>) => void] {
  const [status, setStatus] = useState<PremiumStatus>(loadPremium);

  function update(patch: Partial<PremiumStatus>) {
    setStatus((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return [status, update];
}

// Called after Stripe payment confirmed (webhook → your API → returns token)
// For now stores locally with 30-day expiry
export function activatePremium(tier: PremiumTier, customColor = "") {
  const status: PremiumStatus = {
    tier,
    customColor,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(KEY, JSON.stringify(status));
}
