"use client";
import { useRouter } from "next/navigation";

interface Props {
  fromUsername: string;
  roomId: string;
  onDismiss: () => void;
  onInvite: (roomId: string) => void;  // sends the invite to chat
}

export function PrivateInviteToast({
  fromUsername,
  roomId,
  onDismiss,
}: Omit<Props, "onInvite">) {
  const router = useRouter();

  function accept() {
    router.push(`/chat?room=priv-${roomId}`);
  }

  return (
    <div
      className="fixed bottom-24 right-4 z-40 w-72 rounded-2xl p-4 shadow-2xl"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">💌</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Private chat invite
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            <span style={{ color: "var(--accent)" }}>{fromUsername}</span> wants to chat privately with you
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs flex-shrink-0"
          style={{ color: "var(--muted)" }}
        >
          ✕
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={accept}
          className="flex-1 py-2 rounded-xl text-xs font-semibold"
          style={{ background: "var(--accent)", color: "#0f0d0a" }}
        >
          Join private room
        </button>
        <button
          onClick={onDismiss}
          className="flex-1 py-2 rounded-xl text-xs"
          style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

// Button to start a private chat — generates a random room ID
export function StartPrivateChatButton({ onSend }: { onSend: (roomId: string) => void }) {
  function handleClick() {
    const roomId = crypto.randomUUID().split("-")[0]; // short random ID
    onSend(roomId);
  }

  return (
    <button
      onClick={handleClick}
      className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
      style={{
        background: "rgba(184,169,212,0.1)",
        color: "var(--lavender)",
        border: "1px solid rgba(184,169,212,0.2)",
      }}
    >
      💌 Invite to private chat
    </button>
  );
}
