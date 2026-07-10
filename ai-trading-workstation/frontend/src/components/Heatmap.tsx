"use client";

import type { Position } from "@/lib/types";

function heatColor(changePct: number): string {
  const clamped = Math.max(-5, Math.min(5, changePct));
  const intensity = Math.abs(clamped) / 5;
  if (changePct >= 0) {
    const l = 14 + intensity * 18;
    return `hsl(142, 60%, ${l}%)`;
  }
  const l = 14 + intensity * 18;
  return `hsl(0, 65%, ${l}%)`;
}

export function Heatmap({ positions }: { positions: Position[] }) {
  if (positions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded border border-term-border bg-term-panel text-sm text-term-muted">
        No open positions yet — buy something to populate the heatmap.
      </div>
    );
  }

  const totalValue = positions.reduce((sum, p) => sum + p.market_value, 0);

  return (
    <div className="flex h-full flex-wrap gap-1 overflow-hidden rounded border border-term-border bg-term-panel p-1">
      {positions.map((p) => {
        const pct = totalValue ? (p.market_value / totalValue) * 100 : 0;
        const changePct = p.cost_basis ? (p.unrealized_pnl / p.cost_basis) * 100 : 0;
        return (
          <div
            key={p.ticker}
            className="flex min-w-[110px] flex-col justify-between rounded p-2 transition-colors"
            style={{
              backgroundColor: heatColor(changePct),
              flexBasis: `${Math.max(pct, 10)}%`,
              flexGrow: 1,
            }}
          >
            <span className="text-sm font-bold text-white drop-shadow">{p.ticker}</span>
            <div className="text-xs text-white/90 drop-shadow">
              <div>${p.market_value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
              <div className="font-semibold">
                {changePct >= 0 ? "+" : ""}
                {changePct.toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
