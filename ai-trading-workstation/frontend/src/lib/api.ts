import type { ChatMessage, ChatResponse, Portfolio, PriceTick, Trade } from "./types";

// Same-origin in production (FastAPI serves the static export on :8000).
// In dev, Next runs on :3000 and proxies to the backend on :8000.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  symbols: () => request<string[]>("/api/symbols"),
  prices: () => request<PriceTick[]>("/api/prices"),
  portfolio: () => request<Portfolio>("/api/portfolio"),
  trades: () => request<Trade[]>("/api/trades"),
  trade: (ticker: string, side: "buy" | "sell", qty: number) =>
    request<Trade>("/api/trade", { method: "POST", body: JSON.stringify({ ticker, side, qty }) }),
  watchlist: () => request<string[]>("/api/watchlist"),
  addWatchlist: (ticker: string) =>
    request<string[]>("/api/watchlist", { method: "POST", body: JSON.stringify({ ticker }) }),
  removeWatchlist: (ticker: string) =>
    request<string[]>(`/api/watchlist/${ticker}`, { method: "DELETE" }),
  chat: (message: string, history: ChatMessage[]) =>
    request<ChatResponse>("/api/chat", { method: "POST", body: JSON.stringify({ message, history }) }),
  streamUrl: () => `${API_BASE}/api/stream`,
};
