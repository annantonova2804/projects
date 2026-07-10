"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { LivePrice } from "@/lib/usePriceStream";

export function TradeTicket({
  ticker,
  price,
  onClose,
  onFilled,
}: {
  ticker: string;
  price: LivePrice | undefined;
  onClose: () => void;
  onFilled: () => void;
}) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [qty, setQty] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const qtyNum = Number(qty);
    if (!qtyNum || qtyNum <= 0) {
      setError("Enter a valid quantity");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.trade(ticker, side, qtyNum);
      onFilled();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Trade failed");
    } finally {
      setSubmitting(false);
    }
  }

  const estimated = price ? price.price * (Number(qty) || 0) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-80 rounded border border-term-border bg-term-panel p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="trade-ticket"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold">{ticker}</span>
          <span className="text-xs text-term-muted">{price ? `$${price.price.toFixed(2)}` : "…"}</span>
        </div>

        <div className="mb-3 flex rounded border border-term-border">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 py-1.5 text-xs font-semibold ${side === "buy" ? "bg-term-up text-black" : "text-term-muted"}`}
          >
            BUY
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`flex-1 py-1.5 text-xs font-semibold ${side === "sell" ? "bg-term-down text-black" : "text-term-muted"}`}
          >
            SELL
          </button>
        </div>

        <label className="mb-1 block text-xs text-term-muted">Quantity</label>
        <input
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          type="number"
          min="0"
          step="1"
          className="mb-3 w-full rounded bg-term-bg px-2 py-1.5 text-sm text-term-text outline-none ring-1 ring-term-border focus:ring-term-accent"
        />

        {estimated !== null && (
          <div className="mb-3 text-xs text-term-muted">Est. {side === "buy" ? "cost" : "proceeds"}: ${estimated.toFixed(2)}</div>
        )}

        {error && <div className="mb-3 text-xs text-term-down">{error}</div>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-term-border py-1.5 text-xs text-term-muted hover:text-term-text"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`flex-1 rounded py-1.5 text-xs font-semibold text-black disabled:opacity-50 ${
              side === "buy" ? "bg-term-up" : "bg-term-down"
            }`}
          >
            {submitting ? "…" : `${side === "buy" ? "Buy" : "Sell"} ${ticker}`}
          </button>
        </div>
      </div>
    </div>
  );
}
