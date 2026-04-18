"use client";
import { useState } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "denied";
    return Notification.permission;
  });

  async function request() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  }

  function notify(title: string, body: string) {
    if (permission !== "granted" || !document.hidden) return;
    try { new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" }); } catch { /* blocked */ }
  }

  function beep() {
    try {
      type WC = Window & { webkitAudioContext?: typeof AudioContext };
      const AC = window.AudioContext ?? (window as WC).webkitAudioContext;
      if (!AC) return;
      const ctx  = new AC();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 660;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* blocked */ }
  }

  return { permission, request, notify, beep };
}
