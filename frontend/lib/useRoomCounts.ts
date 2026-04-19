"use client";
import { useEffect, useRef, useState } from "react";

const WORKER = (process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787")
  .replace(/^wss?:\/\//, (m) => m.startsWith("wss") ? "https://" : "http://");

const POLL_MS    = 30_000; // refresh every 30 s
const FETCH_ROOMS = [
  "global","us","uk","ca","au","in","pk","de","fr","es","br",
  "night-owls","morning-coffee","just-venting","deep-talks","silly-stuff","music-vibes",
];

export function useRoomCounts(): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const timer = useRef<ReturnType<typeof setTimeout>>();

  async function refresh() {
    try {
      const results = await Promise.allSettled(
        FETCH_ROOMS.map((id) =>
          fetch(`${WORKER}/presence/${id}`, { signal: AbortSignal.timeout(4000) })
            .then((r) => r.json() as Promise<{ count?: number }>)
            .then((d) => ({ id, count: d.count ?? 0 }))
        )
      );
      const map: Record<string, number> = {};
      for (const r of results) {
        if (r.status === "fulfilled") map[r.value.id] = r.value.count;
      }
      setCounts(map);
    } catch { /* offline */ }
  }

  useEffect(() => {
    refresh();
    timer.current = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer.current);
  }, []);

  return counts;
}
