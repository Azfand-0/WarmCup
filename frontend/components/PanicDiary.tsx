"use client";
import { useEffect, useState } from "react";

interface DiaryEntry { id: string; date: string; mood: string; text: string; room: string; }

const KEY = "warmcup_diary";
const MAX = 90;

function load(): DiaryEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function save(entries: DiaryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX)));
}

interface Props { onClose: () => void; currentMood: string; currentRoom: string; }

export default function PanicDiary({ onClose, currentMood, currentRoom }: Props) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [text, setText]       = useState("");
  const [view, setView]       = useState<"write" | "history">("write");

  useEffect(() => { setEntries(load()); }, []);

  function addEntry() {
    if (!text.trim()) return;
    const entry: DiaryEntry = {
      id:   `${Date.now()}`,
      date: new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
      mood: currentMood || "💭",
      text: text.trim().slice(0, 300),
      room: currentRoom,
    };
    const next = [...entries, entry];
    save(next);
    setEntries(next);
    setText("");
  }

  function deleteEntry(id: string) {
    const next = entries.filter((e) => e.id !== id);
    save(next);
    setEntries(next);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,13,10,0.93)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl flex flex-col overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="font-semibold" style={{ color: "var(--text)" }}>📔 Panic Diary</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Only stored on your device. Never sent anywhere.</p>
          </div>
          <button onClick={onClose} style={{ color: "var(--muted)" }}>✕</button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-3 flex-shrink-0">
          {(["write", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className="text-sm px-4 py-1.5 rounded-full capitalize transition-colors"
              style={{
                background: view === t ? "var(--accent)" : "var(--surface2)",
                color: view === t ? "#0f0d0a" : "var(--muted)",
              }}
            >
              {t === "write" ? "✍️ Write" : `📖 History (${entries.length})`}
            </button>
          ))}
        </div>

        {/* Write view */}
        {view === "write" && (
          <div className="flex flex-col gap-4 p-6 flex-1 overflow-y-auto">
            <p className="text-sm" style={{ color: "var(--text-soft)" }}>
              How was your experience today? One line is enough.
            </p>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <span>{currentMood || "💭"}</span>
              <span>{new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={300}
              rows={4}
              placeholder="I felt... The room helped me by... I'm grateful for..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
            <button
              onClick={addEntry}
              disabled={!text.trim()}
              className="py-3 rounded-xl text-sm font-semibold disabled:opacity-40 active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
            >
              Save to diary
            </button>
          </div>
        )}

        {/* History view */}
        {view === "history" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {entries.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
                No entries yet. Your diary is waiting 🌿
              </p>
            )}
            {[...entries].reverse().map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-2xl relative group"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{e.mood}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{e.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface3)", color: "var(--muted)" }}>
                    {e.room}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>{e.text}</p>
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="absolute top-3 right-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--muted)" }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
