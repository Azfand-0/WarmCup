"use client";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6"
            style={{ background: "rgba(196,149,106,0.1)", border: "1px solid rgba(196,149,106,0.2)" }}
          >
            🕯️
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
            Something went wrong
          </h2>
          <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
            The room had a hiccup. You&apos;re still safe.
          </p>
          <p className="text-xs mb-8 font-mono px-4 py-2 rounded-xl" style={{ color: "var(--danger)", background: "rgba(196,122,106,0.08)", border: "1px solid rgba(196,122,106,0.2)" }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
            className="px-8 py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "linear-gradient(135deg, #c4956a, #b8a9d4)", color: "#0f0d0a" }}
          >
            Try again →
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
