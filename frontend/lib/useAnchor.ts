"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "warmcup_anchor_id";

export function useAnchor() {
  const [anchorId, setAnchorId] = useState<string | null>(null);

  useEffect(() => {
    setAnchorId(localStorage.getItem(KEY));
  }, []);

  const setAnchor = useCallback((userId: string | null) => {
    if (userId) localStorage.setItem(KEY, userId);
    else localStorage.removeItem(KEY);
    setAnchorId(userId);
  }, []);

  return { anchorId, setAnchor };
}
