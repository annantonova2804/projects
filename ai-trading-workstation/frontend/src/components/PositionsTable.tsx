"use client";

import type { Position } from "@/lib/types";
import { fmtPct, fmtPrice } from "./PriceCell";

export function PositionsTable({ positions, onTrade }: { positions: Position[]; onTrade: (ticker: string) => void }) {
  return (
    <div className="h-full overflow-y-auto rounded border border-term-border bg-term-panel">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-term-panel text-term-muted">
          <tr className="border-b border-term-border">
            <th className="px-3 py-2 text-left font-normal">Ticker</th>
            <th className="px-3 py-2 text-right font-normal">Qty</th>
            <th className="px-3 py-2 text-right font-normal">Avg Cost</th>
            <th className="px-3 py-2 text-right font-normal">Price</th>
            <th className="px-3 py-2 text-right font-normal">Value</th>
            <th className="px-3 py-2 text-right font-normal">P&amp;L</th>
            <th className="px-3 py-2 text-right font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {positions.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-6 text-center text-term-muted">
                No positions. Use the AI chat or a watchlist ticker to place your first trade.
              </td>
            </tr>
          )}
          {positions.map((p) => {
            const positive = p.unrealized_pnl >= 0;
            return (
              <tr key={p.ticker} className="border-b border-term-border/50 tabular-nums hover:bg-term-border/20">
                <td className="px-3 py-2 font-semibold">{p.ticker}</td>
                <td className="px-3 py-2 text-right">{p.qty}</td>
                <td className="px-3 py-2 text-right text-term-muted">${fmtPrice(p.avg_price)}</td>
                <td className="px-3 py-2 text-right">${fmtPrice(p.price)}</td>
                <td className="px-3 py-2 text-right">${fmtPrice(p.market_value)}</td>
                <td className={`px-3 py-2 text-right ${positive ? "text-term-up" : "text-term-down"}`}>
                  ${fmtPrice(p.unrealized_pnl)} ({fmtPct(p.unrealized_pnl_pct)})
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => onTrade(p.ticker)}
                    className="rounded border border-term-border px-2 py-0.5 text-term-muted hover:border-term-accent hover:text-term-accent"
                  >
                    Trade
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
