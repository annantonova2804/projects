"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LivePrice } from "@/lib/usePriceStream";
import { PriceCell } from "./PriceCell";

export function Watchlist({ prices, onTrade }: { prices: Record<string, LivePrice>; onTrade: (ticker: string) => void }) {
  const [tickers, setTickers] = useState<string[]>([]);
  const [newTicker, setNewTicker] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.watchlist().then(setTickers).catch(() => setError("Failed to load watchlist"));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const ticker = newTicker.trim().toUpperCase();
    if (!ticker) return;
    try {
      const updated = await api.addWatchlist(ticker);
      setTickers(updated);
      setNewTicker("");
      setError(null);
    } catch {
      setError(`Unknown ticker: ${ticker}`);
    }
  }

  async function handleRemove(ticker: string) {
    const updated = await api.removeWatchlist(ticker);
    setTickers(updated);
  }

  return (
    <div className="flex h-full flex-col rounded border border-term-border bg-term-panel">
      <div className="border-b border-term-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-term-muted">
        Watchlist
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {tickers.map((ticker) => {
          const tick = prices[ticker];
          return (
            <div key={ticker} className="group flex items-center gap-1">
              <button
                onClick={() => onTrade(ticker)}
                className="flex-1 text-left"
                title="Open trade ticket"
                data-testid={`watchlist-trade-${ticker}`}
              >
                {tick ? (
                  <PriceCell tick={tick} />
                ) : (
                  <div className="px-2 py-1 text-term-muted">{ticker} …</div>
                )}
              </button>
              <button
                onClick={() => handleRemove(ticker)}
                className="invisible px-2 text-term-muted hover:text-term-down group-hover:visible"
                title="Remove from watchlist"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleAdd} className="flex gap-1 border-t border-term-border p-2">
        <input
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          placeholder="Add ticker…"
          className="w-full rounded bg-term-bg px-2 py-1 text-xs uppercase text-term-text outline-none ring-1 ring-term-border focus:ring-term-accent"
        />
        <button type="submit" className="rounded bg-term-border px-2 text-xs text-term-text hover:bg-term-accent hover:text-term-bg">
          Add
        </button>
      </form>
      {error && <div className="px-2 pb-2 text-xs text-term-down">{error}</div>}
    </div>
  );
}
