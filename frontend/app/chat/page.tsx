"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChat }        from "@/lib/useChat";
import { useNotifications } from "@/lib/useNotifications";
import { getUsername }    from "@/lib/username";
import { useStreak }      from "@/lib/useStreak";
import { useSound }       from "@/lib/useSound";
import { useWeeklyRecap, recordVisit } from "@/lib/useWeeklyRecap";
import { useUserProfile } from "@/lib/useUserProfile";
import { getUserColor }   from "@/lib/userColors";
import { filterText }     from "@/lib/safeWords";
import { COUNTRY_CHANNELS, THEMED_CHANNELS, CHANNELS, detectCountryChannel } from "@/lib/channels";
import type { Channel }   from "@/lib/channels";

import BreathingModal     from "@/components/BreathingModal";
import GroundingModal     from "@/components/GroundingModal";
import CrisisBanner       from "@/components/CrisisBanner";
import ShareButton        from "@/components/ShareButton";
import BetterHelpBanner   from "@/components/BetterHelpBanner";
import MessageReactions   from "@/components/MessageReactions";
import TypingIndicator    from "@/components/TypingIndicator";
import { PrivateInviteToast, StartPrivateChatButton } from "@/components/PrivateChatInvite";
import PanicDiary         from "@/components/PanicDiary";
import RoomVibe           from "@/components/RoomVibe";
import WeeklyRecap        from "@/components/WeeklyRecap";
import WarmCupTip         from "@/components/WarmCupTip";
import CommunityMilestone from "@/components/CommunityMilestone";
import GratitudeToast     from "@/components/GratitudeToast";
import QuietRoomBanner    from "@/components/QuietRoomBanner";
import EmojiPicker        from "@/components/EmojiPicker";
import OnlineUsers        from "@/components/OnlineUsers";
import ReportModal        from "@/components/ReportModal";
import SafetyNotice       from "@/components/SafetyNotice";
import PremiumModal       from "@/components/PremiumModal";
import SponsorBanner      from "@/components/SponsorBanner";
import TherapistDirectory from "@/components/TherapistDirectory";
import ErrorBoundary      from "@/components/ErrorBoundary";
import { usePremium }     from "@/lib/usePremium";
import type { PremiumTier } from "@/lib/usePremium";
import { useLevel }       from "@/lib/useLevel";

function ChatApp() {
  const router       = useRouter();

  const [username]                         = useState(() => typeof window !== "undefined" ? getUsername() : "");
  const [room, setRoom]                   = useState(() => {
    if (typeof window === "undefined") return "global";
    const p = new URLSearchParams(window.location.search);
    return p.get("room") ?? detectCountryChannel();
  });
  const [input, setInput]                 = useState("");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [countryOpen, setCountryOpen]     = useState(false);
  const [hangoutOpen, setHangoutOpen]     = useState(true);
  const [countrySearch, setCountrySearch] = useState("");

  const [showBreathing, setShowBreathing] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [showDiary, setShowDiary]         = useState(false);
  const [showRecap, setShowRecap]         = useState(false);
  const [warmCupTarget, setWarmCupTarget] = useState<{ userId: string; username: string } | null>(null);
  const [hoveredMsg, setHoveredMsg]       = useState<string | null>(null);
  const [feltBetter, setFeltBetter]       = useState(false);
  const [showCrisis, setShowCrisis]       = useState(false);
  const [reportTarget, setReportTarget]   = useState<{ messageId: string; username: string } | null>(null);
  const [reportedIds, setReportedIds]     = useState<Set<string>>(new Set());
  const [blockedWarning, setBlockedWarning] = useState(false);
  const [showPremium, setShowPremium]     = useState(false);
  const [showTherapists, setShowTherapists] = useState(false);
  const [isScrolledUp, setIsScrolledUp]   = useState(false);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [replyTo, setReplyTo]             = useState<{ id: string; username: string; text: string } | null>(null);

  const [premium, updatePremium] = usePremium();
  const { level, increment: incrementLevel } = useLevel();

  const bottomRef      = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const scrollAreaRef  = useRef<HTMLDivElement>(null);

  const streak        = useStreak();
  const sound         = useSound();
  const notifications = useNotifications();
  const weeklyStats = useWeeklyRecap();
  const [profile]   = useUserProfile();

  const myColor        = getUserColor(username);
  const effectiveColor = premium.tier !== "none" && premium.customColor
    ? premium.customColor
    : myColor;

  const {
    messages, count, connected, showConnecting, myUserId,
    typingUsers, reactions, vibe,
    milestone, gratitude, privateInvite, dismissPrivateInvite,
    breathingUsers, helpedCount, onlineUsers,
    panicPaired, dismissPanicPaired,
    sendMessage, sendTyping, sendReaction,
    sendFeelingBetter, sendGratitude,
    sendVibeVote, sendPrivateInvite,
    sendBreathingStart, sendBreathingStop,
  } = useChat(room, username, "", profile.flair, effectiveColor);

  const prevMsgLenRef = useRef(0);
  useEffect(() => {
    const prev = prevMsgLenRef.current;
    prevMsgLenRef.current = messages.length;
    if (!isScrolledUp) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setUnreadCount((c) => c + 1);
    }
    if (messages.length > prev && myUserId) {
      const newOnes = messages.slice(prev).filter((m) => !m.isSystem && m.userId !== myUserId);
      if (newOnes.length > 0) {
        if (document.hidden) notifications.beep();
        const latest = newOnes[newOnes.length - 1];
        notifications.notify("warmcup", `${latest.username}: ${latest.text.slice(0, 80)}`);
      }
    }
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isScrolledUp) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [typingUsers]);

  // Tab title unread badge
  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) warmcup` : "warmcup";
    return () => { document.title = "warmcup"; };
  }, [unreadCount]);

  function handleScroll() {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const scrolled = distFromBottom > 120;
    setIsScrolledUp(scrolled);
    if (!scrolled) setUnreadCount(0);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setUnreadCount(0);
    setIsScrolledUp(false);
  }

  useEffect(() => {
    if (username && room) recordVisit(room);
  }, [username, room]);

  // Navigate when panic match is found
  useEffect(() => {
    if (!panicPaired) return;
    dismissPanicPaired();
    const privRoomId = `priv-${panicPaired}`;
    setRoom(privRoomId);
    const url = new URL(window.location.href);
    url.searchParams.set("room", privRoomId);
    window.history.replaceState(null, "", url.toString());
    setShowBreathing(true);
  }, [panicPaired]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const raw = input.trim();
    if (!raw || !connected) return;

    const { filtered, showCrisis: crisis, blocked } = filterText(raw);

    if (blocked) {
      setBlockedWarning(true);
      setTimeout(() => setBlockedWarning(false), 4000);
      setInput("");
      return;
    }
    if (crisis) setShowCrisis(true);
    if (filtered) { sendMessage(filtered, level.badge, replyTo ?? undefined); incrementLevel(); }
    setInput("");
    setReplyTo(null);
    inputRef.current?.focus();
  }

  function insertEmoji(emoji: string) {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  }

  function switchRoom(ch: Channel) {
    setRoom(ch.id);
    setSidebarOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("room", ch.id);
    window.history.replaceState(null, "", url.toString());
  }

  function handleReport(messageId: string, reason: string) {
    setReportedIds((prev) => new Set([...prev, messageId]));
    console.info("[Report]", { messageId, reason, timestamp: Date.now() });
  }

  const filteredCountries = COUNTRY_CHANNELS.filter((ch) =>
    ch.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const currentChannel = CHANNELS.find((c) => c.id === room) ?? {
    id: room, name: room.startsWith("priv-") ? "Private Room" : room,
    flag: room.startsWith("priv-") ? "💌" : "💬", group: "themed" as const,
  };
  const isQuietRoom   = !!(currentChannel as Channel).quiet;
  const isPrivateRoom = room.startsWith("priv-");

  if (!username) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={[
          "fixed md:static inset-y-0 left-0 z-30 w-56 flex-shrink-0 flex flex-col",
          "transform transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
      >
        {/* Brand + user */}
        <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => router.push("/")} className="font-bold hover:opacity-80" style={{ color: "var(--accent)" }}>
              warmcup
            </button>
            <button className="md:hidden text-sm" onClick={() => setSidebarOpen(false)} style={{ color: "var(--muted)" }}>✕</button>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: `${effectiveColor}25`,
                color: effectiveColor,
                border: premium.tier === "glow"
                  ? `2px solid ${effectiveColor}`
                  : `1px solid ${effectiveColor}50`,
                boxShadow: premium.tier === "glow"
                  ? `0 0 8px ${effectiveColor}80`
                  : "none",
              }}
            >
              {username[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: effectiveColor }}>
                {username}
                {premium.tier === "calm" && <span className="ml-1">✨</span>}
                {premium.tier === "glow" && <span className="ml-1">🌟</span>}
                <span className="ml-1" title={`Level ${level.num} · ${level.name}`}>{level.badge}</span>
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {level.name}{streak > 0 ? ` · 🔥 ${streak}d` : ""}
                {helpedCount > 0 && ` · helped ${helpedCount} 💚`}
              </p>
            </div>
          </div>
        </div>

        {/* Channels */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">

          {/* Country rooms — collapsible with search */}
          <div className="mb-2">
            <button
              onClick={() => setCountryOpen((o) => !o)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              <span>🌍 Country Rooms</span>
              <span style={{ fontSize: "10px" }}>{countryOpen ? "▲" : "▼"}</span>
            </button>

            {countryOpen && (
              <div className="mt-1 mb-2">
                {/* Search */}
                <div className="px-1 mb-1.5">
                  <input
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country…"
                    className="w-full px-3 py-1.5 rounded-lg text-xs outline-none"
                    style={{
                      background: "var(--surface2)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
                {/* List */}
                <div className="max-h-52 overflow-y-auto space-y-0.5">
                  {filteredCountries.map((ch) => (
                    <ChannelButton key={ch.id} ch={ch} active={ch.id === room} onClick={() => switchRoom(ch)} />
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="text-xs text-center py-3" style={{ color: "var(--muted)" }}>No match</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hangout rooms — collapsible */}
          <div>
            <button
              onClick={() => setHangoutOpen((o) => !o)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors hover:opacity-80"
              style={{ color: "var(--muted)" }}
            >
              <span>💬 Hangout Rooms</span>
              <span style={{ fontSize: "10px" }}>{hangoutOpen ? "▲" : "▼"}</span>
            </button>
            {hangoutOpen && (
              <div className="mt-1 space-y-0.5">
                {THEMED_CHANNELS.map((ch) => (
                  <ChannelButton key={ch.id} ch={ch} active={ch.id === room} onClick={() => switchRoom(ch)} />
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Online users */}
        <div className="flex-shrink-0 py-1" style={{ borderTop: "1px solid var(--border)" }}>
          <OnlineUsers users={onlineUsers} myUserId={myUserId} />
        </div>

        {/* Bottom tools + share */}
        <div className="px-3 pb-4 pt-3 flex-shrink-0 space-y-2.5" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Panic match button */}
          <button
            onClick={() => { sendBreathingStart(); switchRoom({ id: "panic-match", name: "Panic Match", flag: "🆘", group: "themed" as const }); }}
            className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:opacity-90"
            style={{ background: "rgba(196,80,80,0.15)", color: "#e88080", border: "1px solid rgba(196,80,80,0.3)" }}
          >
            🆘 I&apos;m panicking right now
          </button>
          <div className="flex items-center gap-1.5">
            {[
              { icon: "🫁", title: "Breathing", onClick: () => setShowBreathing(true) },
              { icon: "🌿", title: "Grounding",  onClick: () => setShowGrounding(true) },
              { icon: "📔", title: "Diary",      onClick: () => setShowDiary(true)     },
              { icon: sound.playing ? "🔊" : "🌧️", title: "Rain sounds", onClick: sound.toggle, active: sound.playing },
              ...(weeklyStats ? [{ icon: "📊", title: "Weekly recap", onClick: () => setShowRecap(true), active: false }] : []),
            ].map(({ icon, title, onClick, active }) => (
              <button
                key={title}
                onClick={onClick}
                title={title}
                className="flex-1 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:opacity-80"
                style={{
                  background: active ? "rgba(196,149,106,0.15)" : "var(--surface2)",
                  border: `1px solid ${active ? "rgba(196,149,106,0.3)" : "var(--border)"}`,
                }}
              >
                {icon}
              </button>
            ))}
          </div>
          {/* Premium + Therapists */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setShowPremium(true)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 flex items-center justify-center gap-1"
              style={{
                background: premium.tier !== "none"
                  ? "linear-gradient(135deg, rgba(196,149,106,0.2), rgba(184,169,212,0.2))"
                  : "var(--surface2)",
                color: premium.tier !== "none" ? "var(--accent)" : "var(--muted)",
                border: `1px solid ${premium.tier !== "none" ? "rgba(196,149,106,0.4)" : "var(--border)"}`,
              }}
            >
              {premium.tier !== "none" ? "⭐" : "✨"} {premium.tier !== "none" ? premium.tier.charAt(0).toUpperCase() + premium.tier.slice(1) : "Premium"}
            </button>
            <button
              onClick={() => setShowTherapists(true)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80 flex items-center justify-center gap-1"
              style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              🧠 Therapists
            </button>
          </div>
          <ShareButton />
          <Link
            href="/wall"
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
            style={{ background: "rgba(126,200,160,0.08)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.2)" }}
          >
            💚 I made it through
          </Link>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Anonymous · Nothing stored</p>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        <CrisisBanner autoExpand={showCrisis} />

        {/* Header */}
        <header
          className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          <button className="md:hidden p-1 text-xl" onClick={() => setSidebarOpen(true)} style={{ color: "var(--muted)" }}>☰</button>
          <span className="text-xl">{currentChannel.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              {currentChannel.name}
              {isPrivateRoom && <span className="ml-2 text-xs font-normal" style={{ color: "var(--muted)" }}>· private</span>}
            </div>
            <div className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 online-dot" style={{ background: connected ? "var(--online)" : showConnecting ? "var(--danger)" : "var(--muted)" }} />
              {connected ? (count <= 1 ? "Just you — others will join" : `${count} people here`) : showConnecting ? "Reconnecting…" : ""}
            </div>
          </div>
          <RoomVibe vibe={vibe} onVote={sendVibeVote} />
          {isPrivateRoom && (
            <button
              onClick={() => switchRoom({ id: "global", name: "Global", flag: "🌍", group: "country" })}
              className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-opacity hover:opacity-70"
              style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              ← Leave
            </button>
          )}
        </header>

        {/* Safe space bar */}
        <div
          className="px-4 py-1.5 text-xs flex-shrink-0 flex items-center justify-between gap-3"
          style={{ background: "rgba(184,169,212,0.05)", borderBottom: "1px solid rgba(184,169,212,0.08)", color: "var(--lavender)" }}
        >
          <span className="truncate">Safe, anonymous space · Be kind · You are among friends</span>
          {!feltBetter ? (
            <button
              onClick={() => { sendFeelingBetter(); setFeltBetter(true); setTimeout(() => setFeltBetter(false), 5000); }}
              className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 hover:opacity-80"
              style={{ background: "rgba(126,200,160,0.1)", color: "var(--online)", border: "1px solid rgba(126,200,160,0.2)" }}
            >
              I&apos;m better 💚
            </button>
          ) : (
            <span className="flex-shrink-0" style={{ color: "var(--online)" }}>Sent 💚</span>
          )}
        </div>

        {/* Sponsor banner — country rooms only */}
        {!isPrivateRoom && <SponsorBanner roomId={room} />}

        {/* Blocked message warning */}
        {blockedWarning && (
          <div
            className="px-4 py-2 text-xs flex-shrink-0 text-center"
            style={{ background: "rgba(196,122,106,0.12)", color: "#e8a090", borderBottom: "1px solid rgba(196,122,106,0.2)" }}
          >
            🚫 That message was blocked by our content filter. Please keep the space safe and kind.
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-5 space-y-5 relative"
        >
          {isQuietRoom ? (
            <QuietRoomBanner count={count} />
          ) : (
            <>
              {messages.filter((m) => !m.isSystem).length === 0 && connected && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: "rgba(196,149,106,0.1)", border: "1px solid rgba(196,149,106,0.2)" }}>
                    {isPrivateRoom ? "🔒" : "🕯️"}
                  </div>
                  <div>
                    {isPrivateRoom ? (
                      <>
                        <p className="font-medium" style={{ color: "var(--text-soft)" }}>Waiting for your partner to join…</p>
                        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>Share the invite link or wait for them to accept.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium" style={{ color: "var(--text-soft)" }}>You made it here. That took courage.</p>
                        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>Say anything. No pressure. You&apos;re safe.</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {messages.map((msg) => {
                if (msg.isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center msg-in">
                      <span className="text-xs px-3 py-1 rounded-full" style={{ color: "var(--muted)", background: "var(--surface2)" }}>
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                // Hide reported messages
                if (reportedIds.has(msg.id)) {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <span className="text-xs px-3 py-1 rounded-full italic" style={{ color: "var(--muted)", background: "var(--surface2)" }}>
                        Message hidden — reported
                      </span>
                    </div>
                  );
                }

                const mine     = msg.userId === myUserId;
                const rawColor = msg.color || getUserColor(msg.username);
                const msgColor = mine && premium.tier !== "none" && premium.customColor
                  ? premium.customColor
                  : rawColor;
                const isGlow    = mine && premium.tier === "glow";
                const isCalm    = mine && premium.tier === "calm";
                const msgReactions = reactions[msg.id] ?? {};

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 msg-in ${mine ? "flex-row-reverse" : "flex-row"}`}
                    onMouseEnter={() => setHoveredMsg(msg.id)}
                    onMouseLeave={() => setHoveredMsg(null)}
                  >
                    {/* Avatar — shown for both sides */}
                    <div className="relative flex-shrink-0 mt-5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: `${msgColor}22`,
                          color: msgColor,
                          border: isGlow
                            ? `2px solid ${msgColor}`
                            : `1px solid ${msgColor}50`,
                          boxShadow: isGlow
                            ? `0 0 8px ${msgColor}90, 0 0 16px ${msgColor}40`
                            : "none",
                        }}
                      >
                        {msg.username[0].toUpperCase()}
                      </div>
                      {breathingUsers.has(msg.userId) && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full breathing-dot" style={{ background: "var(--online)", border: "2px solid var(--surface)" }} title={`${msg.username} is breathing`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex flex-col max-w-xs lg:max-w-md ${mine ? "items-end" : "items-start"}`}>

                      {/* Username row */}
                      <div className={`flex items-center gap-2 mb-1 ${mine ? "flex-row-reverse" : ""}`}>
                        <span
                          className="text-xs font-semibold"
                          style={isGlow ? {
                            background: `linear-gradient(90deg, ${msgColor}, #b8a9d4)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          } : { color: msgColor }}
                        >
                          {msg.username}
                          {isCalm && " ✨"}
                          {isGlow && " 🌟"}
                          {msg.levelBadge && <span className="ml-1 text-xs">{msg.levelBadge}</span>}
                        </span>
                        {mine && (
                          <span className="text-xs" style={{ color: "var(--muted)" }}>you</span>
                        )}
                        {/* Hover actions */}
                        {hoveredMsg === msg.id && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setReplyTo({ id: msg.id, username: msg.username, text: msg.text })}
                              title="Reply"
                              className="text-xs px-1.5 py-0.5 rounded-lg"
                              style={{ background: "rgba(184,169,212,0.1)", color: "var(--lavender)", border: "1px solid rgba(184,169,212,0.2)" }}
                            >
                              ↩
                            </button>
                            {!mine && (
                              <>
                                <StartPrivateChatButton onSend={(roomId) => {
                                  sendPrivateInvite(roomId, msg.userId);
                                  const privRoomId = `priv-${roomId}`;
                                  setRoom(privRoomId);
                                  const url = new URL(window.location.href);
                                  url.searchParams.set("room", privRoomId);
                                  window.history.replaceState(null, "", url.toString());
                                }} />
                                <button
                                  onClick={() => setWarmCupTarget({ userId: msg.userId, username: msg.username })}
                                  title="Send warm cup"
                                  className="text-xs px-1.5 py-0.5 rounded-lg"
                                  style={{ background: "rgba(196,149,106,0.1)", color: "var(--accent)", border: "1px solid rgba(196,149,106,0.2)" }}
                                >
                                  🍵
                                </button>
                                <button
                                  onClick={() => setReportTarget({ messageId: msg.id, username: msg.username })}
                                  title="Report message"
                                  className="text-xs px-1.5 py-0.5 rounded-lg"
                                  style={{ background: "rgba(196,122,106,0.1)", color: "#e8a090", border: "1px solid rgba(196,122,106,0.2)" }}
                                >
                                  🚩
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`px-4 py-2.5 text-sm leading-relaxed break-words${isGlow ? " msg-glow-shimmer" : ""}`}
                        style={{
                          background: mine
                            ? isGlow
                              ? `linear-gradient(135deg, ${msgColor} 0%, #b8a9d4 100%)`
                              : "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)"
                            : "var(--surface2)",
                          color: mine ? "#0f0d0a" : "var(--text)",
                          borderRadius: mine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                          border: mine ? "none" : "1px solid var(--border)",
                          boxShadow: isGlow && mine ? `0 2px 12px ${msgColor}40` : "none",
                        }}
                      >
                        {msg.replyTo && (
                          <div className="mb-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(0,0,0,0.15)", borderLeft: "2px solid rgba(255,255,255,0.25)" }}>
                            <span className="font-semibold">{msg.replyTo.username}</span>: {msg.replyTo.text.slice(0, 60)}{msg.replyTo.text.length > 60 ? "…" : ""}
                          </div>
                        )}
                        <MessageText text={msg.text} />
                      </div>

                      {/* Reactions */}
                      <MessageReactions
                        messageId={msg.id}
                        reactions={msgReactions}
                        myUserId={myUserId}
                        onReact={sendReaction}
                      />

                      <span className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}

              <TypingIndicator typingUsers={typingUsers} myUserId={myUserId} />
            </>
          )}
          <div ref={bottomRef} />

          {/* Scroll-to-bottom FAB */}
          {isScrolledUp && (
            <button
              onClick={scrollToBottom}
              className="sticky bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-lg transition-all hover:opacity-90"
              style={{ background: "var(--accent)", color: "#0f0d0a", border: "none" }}
            >
              ↓ {unreadCount > 0 ? `${unreadCount} new` : "scroll down"}
            </button>
          )}
        </div>

        <BetterHelpBanner />

        {/* Reply preview */}
        {replyTo && (
          <div
            className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
            style={{ background: "var(--surface2)", borderTop: "1px solid var(--border)" }}
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Replying to </span>
              <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>{replyTo.username}</span>
              <span className="text-xs block truncate" style={{ color: "var(--muted)" }}>{replyTo.text.slice(0, 80)}</span>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-xs flex-shrink-0 hover:opacity-70" style={{ color: "var(--muted)" }}>✕</button>
          </div>
        )}

        {/* Input bar */}
        {!isQuietRoom && (
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
          >
            <EmojiPicker onSelect={insertEmoji} />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); sendTyping(); }}
              placeholder={connected ? "Share what's on your heart…" : showConnecting ? "Reconnecting…" : "Share what's on your heart…"}
              disabled={!connected}
              maxLength={500}
              autoComplete="off"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm outline-none disabled:opacity-40"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(196,149,106,0.5)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              type="submit"
              disabled={!connected || !input.trim()}
              className="w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-30 flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #c4956a 0%, #b8a9d4 100%)", color: "#0f0d0a" }}
            >
              <span className="hidden sm:inline">Send</span>
              <span className="sm:hidden text-base">↑</span>
            </button>
          </form>
        )}
      </div>

      {/* Modals */}
      <SafetyNotice />
      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onActivated={(tier: PremiumTier, color: string) => {
            updatePremium({ tier, customColor: color });
            setShowPremium(false);
          }}
        />
      )}
      {showTherapists && <TherapistDirectory onClose={() => setShowTherapists(false)} />}
      {showBreathing  && <BreathingModal onClose={() => { setShowBreathing(false); sendBreathingStop(); }} onOpen={sendBreathingStart} />}
      {showGrounding  && <GroundingModal onClose={() => setShowGrounding(false)} />}
      {showDiary      && <PanicDiary onClose={() => setShowDiary(false)} currentMood="" currentRoom={room} />}
      {showRecap && weeklyStats && <WeeklyRecap stats={weeklyStats} onClose={() => setShowRecap(false)} />}
      {warmCupTarget  && <WarmCupTip targetUsername={warmCupTarget.username} targetUserId={warmCupTarget.userId} onSendGratitude={sendGratitude} onClose={() => setWarmCupTarget(null)} />}
      {reportTarget   && <ReportModal messageId={reportTarget.messageId} username={reportTarget.username} onClose={() => setReportTarget(null)} onReport={handleReport} />}

      {/* Toasts */}
      <CommunityMilestone message={milestone} />
      <GratitudeToast data={gratitude} />
      {privateInvite && privateInvite.fromUserId !== myUserId && (
        <PrivateInviteToast fromUsername={privateInvite.fromUsername} roomId={privateInvite.roomId} onDismiss={dismissPrivateInvite} />
      )}
    </div>
  );
}

function MessageText({ text }: { text: string }) {
  const imgRe = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)(?:\?\S*)?)/gi;
  const parts = text.split(imgRe);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp)/i.test(part)
          ? <img key={i} src={part} alt="" className="max-w-full rounded-xl mt-2 block" style={{ maxHeight: "200px", objectFit: "contain" }} />
          : part ? <span key={i}>{part}</span> : null
      )}
    </>
  );
}

function ChannelButton({ ch, active, onClick }: { ch: Channel; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-sm transition-all text-left"
      style={{
        background: active ? "var(--surface3)" : "transparent",
        color: active ? "var(--text)" : "var(--muted)",
        fontWeight: active ? 600 : 400,
        borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
      }}
    >
      <span className="text-base leading-none">{ch.flag}</span>
      <span className="truncate flex-1">{ch.name}</span>
      {ch.quiet && <span className="text-xs" style={{ color: "var(--muted)" }}>silent</span>}
    </button>
  );
}

export default function ChatPage() {
  return (
    <ErrorBoundary>
      <Suspense>
        <ChatApp />
      </Suspense>
    </ErrorBoundary>
  );
}
