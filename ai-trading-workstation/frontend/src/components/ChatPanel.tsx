"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

export function ChatPanel({ onPortfolioChanged }: { onPortfolioChanged: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi — I can analyze your portfolio, check prices, manage your watchlist, and execute trades. Try \"buy 10 AAPL\" or \"how's my portfolio doing?\"" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat(text, messages);
      setMessages([...nextHistory, { role: "assistant", content: res.reply }]);
      if (res.tool_calls.some((tc) => tc.name === "execute_trade")) {
        onPortfolioChanged();
      }
    } catch {
      setMessages([...nextHistory, { role: "assistant", content: "Sorry, I hit an error talking to the model." }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }));
    }
  }

  return (
    <div className="flex h-full flex-col rounded border border-term-border bg-term-panel">
      <div className="border-b border-term-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-term-muted">
        AI Assistant
      </div>
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded px-3 py-2 text-xs leading-relaxed ${
                m.role === "user" ? "bg-term-accent/20 text-term-text" : "bg-term-border/40 text-term-text"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-term-muted">Thinking…</div>}
      </div>
      <form onSubmit={send} className="flex gap-1 border-t border-term-border p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the assistant…"
          className="w-full rounded bg-term-bg px-2 py-1.5 text-xs text-term-text outline-none ring-1 ring-term-border focus:ring-term-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-term-accent px-3 text-xs font-semibold text-term-bg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
