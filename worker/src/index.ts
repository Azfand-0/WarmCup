export interface Env {
  CHAT_ROOM: DurableObjectNamespace;
  ENVIRONMENT: string;
}

interface StoredMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  color: string;
  levelBadge?: string;
  replyTo?: { id: string; username: string; text: string };
}

interface WallPost {
  id: string;
  message: string;
  timestamp: number;
}

const MAX_HISTORY = 50;

interface SessionMeta {
  userId: string;
  username: string;
  room: string;
  mood: string;
  flair: string;
  color: string;
  joinedAt: number;
  lastMessageAt: number;
  messageCount: number;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Upgrade, Connection",
};

const VALID_MOODS  = ["😰", "😟", "😐", "🙂", ""];
const VALID_FLAIRS = ["😴", "🎵", "☕", "🌧️", "📚", "🌙", "🌅", "💪", ""];
const VALID_VIBES  = ["chill", "supportive", "silly", "deep"];
const MILESTONES   = [100, 500, 1000, 5000, 10000, 50000, 100000];

// Safe-word replacements (server-side safety net — client also filters)
const SAFE_WORDS: [RegExp, string][] = [
  [/\bkill myself\b/gi,    "I'm really struggling"],
  [/\bwant to die\b/gi,    "this pain feels unbearable"],
  [/\bend my life\b/gi,    "I need things to change"],
];

function applySafeWords(text: string): string {
  let t = text;
  for (const [pattern, replacement] of SAFE_WORDS) t = t.replace(pattern, replacement);
  return t;
}

// ---------------------------------------------------------------------------
// ChatRoom Durable Object
// ---------------------------------------------------------------------------
export class ChatRoom implements DurableObject {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.state.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong")
    );
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Wall endpoints — GET all posts, POST new post
    if (url.pathname === "/wall") {
      if (request.method === "GET") {
        const posts = (await this.state.storage.get<WallPost[]>("wall_posts")) ?? [];
        return Response.json({ posts: posts.slice(-100) }, { headers: CORS });
      }
      if (request.method === "POST") {
        let body: { message?: string };
        try { body = await request.json() as { message?: string }; } catch {
          return Response.json({ error: "bad json" }, { status: 400, headers: CORS });
        }
        const message = typeof body.message === "string"
          ? body.message.replace(/[<>]/g, "").trim().slice(0, 200) : "";
        if (!message) return Response.json({ error: "empty" }, { status: 400, headers: CORS });
        const posts = (await this.state.storage.get<WallPost[]>("wall_posts")) ?? [];
        posts.push({ id: crypto.randomUUID(), message, timestamp: Date.now() });
        if (posts.length > 500) posts.splice(0, posts.length - 500);
        await this.state.storage.put("wall_posts", posts);
        return Response.json({ ok: true }, { headers: CORS });
      }
      return new Response("method not allowed", { status: 405, headers: CORS });
    }

    if (request.headers.get("Upgrade") !== "websocket") {
      const wsCount   = this.state.getWebSockets().length;
      const vibe      = (await this.state.storage.get<string>("vibe")) ?? "supportive";
      const msgCount  = (await this.state.storage.get<number>("msg_count")) ?? 0;
      const slowMode  = (await this.state.storage.get<boolean>("slow_mode")) ?? false;
      return Response.json({ count: wsCount, vibe, msgCount, slowMode }, { headers: CORS });
    }

    const rawName  = url.searchParams.get("username") || "Anonymous";
    const username = rawName.replace(/[<>"'&]/g, "").slice(0, 30).trim() || "Anonymous";
    const room     = url.searchParams.get("room") || "global";
    const mood     = VALID_MOODS.includes(url.searchParams.get("mood") ?? "") ? (url.searchParams.get("mood") ?? "") : "";
    const flair    = VALID_FLAIRS.includes(url.searchParams.get("flair") ?? "") ? (url.searchParams.get("flair") ?? "") : "";
    const color    = (url.searchParams.get("color") ?? "#c4956a").replace(/[^#a-f0-9]/gi, "").slice(0, 7);

    const [client, server] = Object.values(new WebSocketPair());

    const meta: SessionMeta = {
      userId: crypto.randomUUID(),
      username,
      room,
      mood,
      flair,
      color,
      joinedAt: Date.now(),
      lastMessageAt: 0,
      messageCount: 0,
    };

    // Close any stale connections with the same username (prevents ghost counts)
    for (const stale of this.state.getWebSockets()) {
      const staleMeta: SessionMeta | null = stale.deserializeAttachment();
      if (staleMeta?.username === username) {
        try { stale.close(1000, "Reconnected"); } catch { /* already closing */ }
      }
    }

    this.state.acceptWebSocket(server, [meta.userId]);
    server.serializeAttachment(meta);

    const [vibe, msgCount, slowMode, history] = await Promise.all([
      this.state.storage.get<string>("vibe"),
      this.state.storage.get<number>("msg_count"),
      this.state.storage.get<boolean>("slow_mode"),
      this.state.storage.get<StoredMessage[]>("history"),
    ]);

    const wsCount = this.state.getWebSockets().length;

    // Build current users list for the welcome payload
    const currentUsers = this.state.getWebSockets()
      .map((ws) => ws.deserializeAttachment() as SessionMeta | null)
      .filter((m): m is SessionMeta => m !== null && m.userId !== meta.userId)
      .map((m) => ({ userId: m.userId, username: m.username, color: m.color, mood: m.mood }));

    server.send(JSON.stringify({
      type: "welcome",
      userId: meta.userId,
      count: wsCount,
      username,
      vibe: vibe ?? "supportive",
      msgCount: msgCount ?? 0,
      slowMode: slowMode ?? false,
      users: currentUsers,
    }));

    // Send room history so new joiners see recent messages
    if (history && history.length > 0) {
      server.send(JSON.stringify({ type: "history", messages: history }));
    }

    this.broadcastExcept(server, {
      type: "presence",
      event: "join",
      userId: meta.userId,
      username,
      mood,
      flair,
      color,
      count: wsCount,
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer): Promise<void> {
    const meta: SessionMeta = ws.deserializeAttachment();
    if (!meta) return;

    const now      = Date.now();
    const slowMode = (await this.state.storage.get<boolean>("slow_mode")) ?? false;
    const minGap   = slowMode ? 5000 : 1000;

    if (now - meta.lastMessageAt < minGap) return;
    if (meta.messageCount > 60 && now - meta.joinedAt < 60_000) return;
    if (now - meta.joinedAt > 60_000) { meta.messageCount = 0; meta.joinedAt = now; }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(typeof raw === "string" ? raw : new TextDecoder().decode(raw));
    } catch { return; }

    switch (data.type) {

      case "message": {
        if (typeof data.text !== "string") return;
        const raw   = data.text.replace(/[<>]/g, "").trim().slice(0, 500);
        const text  = applySafeWords(raw);
        if (!text) return;

        meta.lastMessageAt = now;
        meta.messageCount++;
        ws.serializeAttachment(meta);

        // Milestone tracking
        const count = ((await this.state.storage.get<number>("msg_count")) ?? 0) + 1;
        await this.state.storage.put("msg_count", count);

        const levelBadge = typeof data.levelBadge === "string"
          ? data.levelBadge.slice(0, 4) : "";
        const msgId = crypto.randomUUID();

        // Validate replyTo
        const replyTo = (
          data.replyTo &&
          typeof (data.replyTo as Record<string, unknown>).id === "string" &&
          typeof (data.replyTo as Record<string, unknown>).username === "string" &&
          typeof (data.replyTo as Record<string, unknown>).text === "string"
        ) ? {
          id: (data.replyTo as Record<string, string>).id,
          username: (data.replyTo as Record<string, string>).username.slice(0, 30),
          text: (data.replyTo as Record<string, string>).text.slice(0, 100),
        } : undefined;

        this.broadcastAll({
          type: "message",
          id: msgId,
          userId: meta.userId,
          username: meta.username,
          mood: meta.mood,
          flair: meta.flair,
          color: meta.color,
          levelBadge,
          text,
          timestamp: now,
          replyTo,
        });

        // Persist to room history (last 50 non-system messages)
        const history = (await this.state.storage.get<StoredMessage[]>("history")) ?? [];
        history.push({ id: msgId, userId: meta.userId, username: meta.username, text, timestamp: now, color: meta.color, levelBadge, replyTo });
        if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
        await this.state.storage.put("history", history);

        if (MILESTONES.includes(count)) {
          this.broadcastAll({
            type: "milestone",
            count,
            message: `This room has shared ${count.toLocaleString()} messages together 🎉`,
          });
        }
        break;
      }

      case "typing":
        this.broadcastExcept(ws, { type: "typing", userId: meta.userId, username: meta.username });
        break;

      case "reaction": {
        const allowed = ["🤍", "❤️‍🩹", "💪", "🫂"];
        if (typeof data.messageId !== "string" || !allowed.includes(data.emoji as string)) return;
        this.broadcastAll({ type: "reaction", messageId: data.messageId, emoji: data.emoji, userId: meta.userId, action: data.action === "remove" ? "remove" : "add" });
        break;
      }

      case "feeling_better":
        this.broadcastAll({ type: "message", id: crypto.randomUUID(), userId: "system", username: "system", text: `${meta.username} is feeling better 💚 — you helped.`, timestamp: now, isSystem: true });
        break;

      case "gratitude": {
        if (typeof data.targetUserId !== "string") return;
        const msg = typeof data.message === "string" ? data.message.slice(0, 100) : "Thank you 🤍";
        const targets = this.state.getWebSockets(data.targetUserId as string);
        const payload = JSON.stringify({ type: "gratitude", fromUsername: meta.username, fromColor: meta.color, message: msg });
        for (const tws of targets) try { tws.send(payload); } catch { /* gone */ }
        break;
      }

      case "vibe_vote": {
        if (!VALID_VIBES.includes(data.vibe as string)) return;
        await this.state.storage.put("vibe", data.vibe);
        this.broadcastAll({ type: "vibe_update", vibe: data.vibe, votedBy: meta.username });
        break;
      }

      case "slow_mode": {
        const current = (await this.state.storage.get<boolean>("slow_mode")) ?? false;
        const next    = !current;
        await this.state.storage.put("slow_mode", next);
        this.broadcastAll({ type: "slow_mode_update", enabled: next, setBy: meta.username });
        break;
      }

      case "update_profile": {
        if (VALID_MOODS.includes(data.mood as string))   meta.mood  = data.mood as string;
        if (VALID_FLAIRS.includes(data.flair as string)) meta.flair = data.flair as string;
        ws.serializeAttachment(meta);
        this.broadcastAll({ type: "profile_update", userId: meta.userId, mood: meta.mood, flair: meta.flair });
        break;
      }

      case "private_invite": {
        if (typeof data.roomId !== "string" || typeof data.targetUserId !== "string") return;
        const safeRoom = (data.roomId as string).replace(/[^a-z0-9-]/g, "").slice(0, 40);
        const payload  = JSON.stringify({ type: "private_invite", fromUserId: meta.userId, fromUsername: meta.username, roomId: safeRoom, timestamp: now });
        const targets  = this.state.getWebSockets(data.targetUserId as string);
        for (const tws of targets) try { tws.send(payload); } catch { /* gone */ }
        break;
      }

      case "breathing_start":
      case "breathing_stop":
        this.broadcastExcept(ws, {
          type: "breathing_update",
          userId: meta.userId,
          username: meta.username,
          active: data.type === "breathing_start",
        });
        break;

      case "panic_request": {
        // Queue-based 1-on-1 panic match
        const waiting = await this.state.storage.get<{ userId: string; wsTag: string }>("panic_waiting");
        if (waiting && waiting.userId !== meta.userId) {
          await this.state.storage.delete("panic_waiting");
          const pairedRoom = `panic-${crypto.randomUUID().split("-")[0]}`;
          const payload = JSON.stringify({ type: "panic_paired", roomId: pairedRoom });
          for (const tws of this.state.getWebSockets(waiting.wsTag)) try { tws.send(payload); } catch { /* gone */ }
          ws.send(payload);
        } else {
          await this.state.storage.put("panic_waiting", { userId: meta.userId, wsTag: meta.userId });
          ws.send(JSON.stringify({ type: "panic_waiting" }));
        }
        break;
      }
    }
  }

  webSocketClose(ws: WebSocket): void {
    const meta: SessionMeta | null = ws.deserializeAttachment();
    const count = this.state.getWebSockets().length; // already excludes the closed socket
    if (meta) this.broadcastAll({ type: "presence", event: "leave", userId: meta.userId, username: meta.username, count });
  }

  webSocketError(ws: WebSocket): void { this.webSocketClose(ws); }

  private broadcastAll(data: unknown): void {
    const msg = JSON.stringify(data);
    for (const ws of this.state.getWebSockets()) try { ws.send(msg); } catch { /* gone */ }
  }

  private broadcastExcept(exclude: WebSocket, data: unknown): void {
    const msg = JSON.stringify(data);
    for (const ws of this.state.getWebSockets()) {
      if (ws !== exclude) try { ws.send(msg); } catch { /* gone */ }
    }
  }
}

// ---------------------------------------------------------------------------
// Worker entrypoint
// ---------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    if (url.pathname === "/wall") {
      return env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName("__wall__")).fetch(request);
    }

    if (url.pathname.startsWith("/chat/") || url.pathname.startsWith("/presence/")) {
      const raw  = url.pathname.split("/")[2] ?? "global";
      const room = sanitizeRoom(raw);
      return env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName(room)).fetch(request);
    }

    return new Response("warmcup worker", { headers: CORS });
  },
};

function sanitizeRoom(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40) || "global";
}
