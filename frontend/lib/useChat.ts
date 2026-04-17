"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  mood?: string;
  flair?: string;
  color?: string;
  levelBadge?: string;
  isSystem?: boolean;
}

export type Reactions = Record<string, Record<string, string[]>>;

export interface GratitudeToast {
  fromUsername: string;
  fromColor: string;
  message: string;
}

export interface PrivateInvite {
  fromUserId: string;
  fromUsername: string;
  roomId: string;
}

export type RoomVibe = "chill" | "supportive" | "silly" | "deep";

const WORKER_URL       = process.env.NEXT_PUBLIC_WORKER_URL ?? "ws://localhost:8787";
const MAX_MESSAGES     = 150;
const RECONNECT_DELAY  = 3000;
const TYPING_EXPIRE_MS = 3500;

export function useChat(room: string, username: string, mood: string, flair: string, color: string) {
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [count, setCount]                 = useState(0);
  const [connected, setConnected]         = useState(false);
  const [showConnecting, setShowConnecting] = useState(false);
  const [myUserId, setMyUserId]           = useState("");
  const [typingUsers, setTypingUsers]     = useState<Record<string, string>>({});
  const [reactions, setReactions]         = useState<Reactions>({});
  const [privateInvite, setPrivateInvite] = useState<PrivateInvite | null>(null);
  const [gratitude, setGratitude]         = useState<GratitudeToast | null>(null);
  const [vibe, setVibe]                   = useState<RoomVibe>("supportive");
  const [slowMode, setSlowMode]           = useState(false);
  const [milestone, setMilestone]         = useState<string | null>(null);
  const [userProfiles, setUserProfiles]   = useState<Record<string, { mood: string; flair: string }>>({});
  const [breathingUsers, setBreathingUsers] = useState<Set<string>>(new Set());
  const [helpedCount, setHelpedCount]     = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("warmcup_helped_count") ?? "0", 10);
  });
  const [panicPaired, setPanicPaired]     = useState<string | null>(null);

  const wsRef         = useRef<WebSocket | null>(null);
  const messagesRef   = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;
  const timerRef      = useRef<ReturnType<typeof setTimeout>>();
  const typingTimers  = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const typingDebRef  = useRef<ReturnType<typeof setTimeout>>();
  const aliveRef      = useRef(true);
  const roomRef       = useRef(room);
  const colorRef      = useRef(color);
  const flairRef      = useRef(flair);
  const moodRef       = useRef(mood);
  roomRef.current     = room;
  colorRef.current    = color;
  flairRef.current    = flair;
  moodRef.current     = mood;

  const addMessage = (msg: ChatMessage) =>
    setMessages((p) => {
      if (p.some((m) => m.id === msg.id)) return p;
      const n = [...p, msg];
      return n.length > MAX_MESSAGES ? n.slice(-MAX_MESSAGES) : n;
    });

  const connect = useCallback(() => {
    if (!aliveRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const base = WORKER_URL.replace(/^http/, "ws");
    const params = new URLSearchParams({
      username, room: roomRef.current,
      mood: moodRef.current, flair: flairRef.current, color: colorRef.current,
    });
    const ws = new WebSocket(`${base}/chat/${roomRef.current}?${params}`);
    wsRef.current = ws;

    ws.onopen = () => { setConnected(true); setShowConnecting(false); clearTimeout(timerRef.current); };

    ws.onmessage = ({ data }) => {
      let ev: Record<string, unknown>;
      try { ev = JSON.parse(data); } catch { return; }

      switch (ev.type) {
        case "welcome":
          setMyUserId(ev.userId as string);
          setCount((ev.count as number) ?? 0);
          setVibe((ev.vibe as RoomVibe) ?? "supportive");
          setSlowMode((ev.slowMode as boolean) ?? false);
          break;

        case "message":
          addMessage({
            id:         ev.id as string,
            userId:     ev.userId as string,
            username:   ev.username as string,
            text:       ev.text as string,
            timestamp:  (ev.timestamp as number) ?? Date.now(),
            mood:       ev.mood as string,
            flair:      ev.flair as string,
            color:      ev.color as string,
            levelBadge: ev.levelBadge as string,
            isSystem:   (ev.isSystem as boolean) ?? false,
          });
          break;

        case "presence":
          setCount((ev.count as number) ?? 0);
          addMessage({
            id: `sys-${Date.now()}-${Math.random()}`,
            userId: "system", username: "system",
            text: ev.event === "join"
              ? `${ev.username} joined${ev.mood ? " " + ev.mood : ""}`
              : `${ev.username} left`,
            timestamp: Date.now(), isSystem: true,
          });
          break;

        case "typing": {
          const uid = ev.userId as string;
          setTypingUsers((p) => ({ ...p, [uid]: ev.username as string }));
          clearTimeout(typingTimers.current[uid]);
          typingTimers.current[uid] = setTimeout(() => {
            setTypingUsers((p) => { const n = { ...p }; delete n[uid]; return n; });
          }, TYPING_EXPIRE_MS);
          break;
        }

        case "reaction":
          setReactions((p) => {
            const mid = ev.messageId as string;
            const emoji = ev.emoji as string;
            const uid = ev.userId as string;
            const msgR = { ...(p[mid] ?? {}) };
            const users = [...(msgR[emoji] ?? [])];
            if (ev.action === "add" && !users.includes(uid)) users.push(uid);
            if (ev.action === "remove") { const i = users.indexOf(uid); if (i > -1) users.splice(i, 1); }
            msgR[emoji] = users;
            return { ...p, [mid]: msgR };
          });
          break;

        case "gratitude":
          setGratitude({ fromUsername: ev.fromUsername as string, fromColor: ev.fromColor as string, message: ev.message as string });
          setTimeout(() => setGratitude(null), 6000);
          setHelpedCount((c) => { const n = c + 1; localStorage.setItem("warmcup_helped_count", String(n)); return n; });
          break;

        case "vibe_update":
          setVibe(ev.vibe as RoomVibe);
          break;

        case "slow_mode_update":
          setSlowMode(ev.enabled as boolean);
          addMessage({
            id: `sys-${Date.now()}`, userId: "system", username: "system",
            text: ev.enabled ? `Slow mode on — 1 message per 5s (set by ${ev.setBy})` : `Slow mode off (set by ${ev.setBy})`,
            timestamp: Date.now(), isSystem: true,
          });
          break;

        case "milestone":
          setMilestone(ev.message as string);
          setTimeout(() => setMilestone(null), 8000);
          break;

        case "profile_update":
          setUserProfiles((p) => ({
            ...p,
            [ev.userId as string]: { mood: ev.mood as string, flair: ev.flair as string },
          }));
          break;

        case "private_invite":
          setPrivateInvite({ fromUserId: ev.fromUserId as string, fromUsername: ev.fromUsername as string, roomId: ev.roomId as string });
          break;

        case "breathing_update": {
          const uid = ev.userId as string;
          const active = ev.active as boolean;
          setBreathingUsers((prev) => {
            const next = new Set(prev);
            if (active) next.add(uid); else next.delete(uid);
            return next;
          });
          break;
        }

        case "panic_paired":
          setPanicPaired(ev.roomId as string);
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (aliveRef.current) {
        timerRef.current = setTimeout(() => { setShowConnecting(true); connect(); }, RECONNECT_DELAY);
      }
    };
    ws.onerror = () => ws.close();
  }, [username]);

  useEffect(() => {
    aliveRef.current = true;
    // Load cached messages for this room before connecting
    try {
      const cached = localStorage.getItem(`warmcup_msgs_${room}`);
      const parsed: ChatMessage[] = cached ? JSON.parse(cached) : [];
      setMessages(parsed);
    } catch { setMessages([]); }
    setCount(0); setConnected(false); setTypingUsers({}); setReactions({});
    wsRef.current?.close();
    connect();

    function persist() {
      const toSave = messagesRef.current.filter((m) => !m.isSystem).slice(-50);
      if (toSave.length > 0)
        try { localStorage.setItem(`warmcup_msgs_${room}`, JSON.stringify(toSave)); } catch { /* quota */ }
    }
    window.addEventListener("beforeunload", persist);
    return () => {
      persist(); // save when switching rooms or unmounting
      aliveRef.current = false;
      clearTimeout(timerRef.current);
      wsRef.current?.close();
      window.removeEventListener("beforeunload", persist);
    };
  }, [room, connect]);

  useEffect(() => {
    const id = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify({ type: "ping" }));
    }, 25_000);
    return () => clearInterval(id);
  }, []);

  const send = (payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify(payload));
  };

  const sendMessage      = useCallback((text: string, levelBadge?: string) => send({ type: "message", text, levelBadge }), []);
  const sendTyping       = useCallback(() => { clearTimeout(typingDebRef.current); typingDebRef.current = setTimeout(() => send({ type: "typing" }), 300); }, []);
  const sendReaction     = useCallback((messageId: string, emoji: string, action: "add" | "remove") => send({ type: "reaction", messageId, emoji, action }), []);
  const sendFeelingBetter = useCallback(() => send({ type: "feeling_better" }), []);
  const sendGratitude    = useCallback((targetUserId: string, message: string) => send({ type: "gratitude", targetUserId, message }), []);
  const sendVibeVote     = useCallback((v: string) => send({ type: "vibe_vote", vibe: v }), []);
  const toggleSlowMode   = useCallback(() => send({ type: "slow_mode" }), []);
  const updateProfile    = useCallback((m: string, f: string) => send({ type: "update_profile", mood: m, flair: f }), []);
  const sendPrivateInvite = useCallback((roomId: string, targetUserId: string) => send({ type: "private_invite", roomId, targetUserId }), []);
  const dismissPrivateInvite  = useCallback(() => setPrivateInvite(null), []);
  const sendBreathingStart    = useCallback(() => send({ type: "breathing_start" }), []);
  const sendBreathingStop     = useCallback(() => send({ type: "breathing_stop" }), []);
  const dismissPanicPaired    = useCallback(() => setPanicPaired(null), []);

  return {
    messages, count, connected, showConnecting, myUserId,
    typingUsers, reactions, vibe, slowMode,
    milestone, gratitude, userProfiles,
    breathingUsers, helpedCount,
    panicPaired, dismissPanicPaired,
    privateInvite, dismissPrivateInvite,
    sendMessage, sendTyping, sendReaction,
    sendFeelingBetter, sendGratitude,
    sendVibeVote, toggleSlowMode, updateProfile,
    sendPrivateInvite, sendBreathingStart, sendBreathingStop,
  };
}
