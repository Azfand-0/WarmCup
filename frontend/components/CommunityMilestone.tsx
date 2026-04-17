"use client";
import { useEffect, useState } from "react";

interface Props { message: string | null; }

export default function CommunityMilestone({ message }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) { setShow(true); }
    else { const t = setTimeout(() => setShow(false), 600); return () => clearTimeout(t); }
  }, [message]);

  if (!show) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-all duration-500"
      style={{
        background: "linear-gradient(135deg, rgba(196,149,106,0.95), rgba(184,169,212,0.95))",
        color: "#0f0d0a",
        opacity: message ? 1 : 0,
        transform: message ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-20px)",
      }}
    >
      <span className="text-xl">🎉</span>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
