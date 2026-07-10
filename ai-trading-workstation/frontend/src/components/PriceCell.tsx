"use client";

import type { LivePrice } from "@/lib/usePriceStream";

function fmtPrice(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export function PriceCell({ tick }: { tick: LivePrice }) {
  const positive = tick.change >= 0;
  const flashClass = tick.direction === "up" ? "animate-flash-up" : tick.direction === "down" ? "animate-flash-down" : "";

  return (
    <div key={tick.ts} className={`flex items-baseline justify-between gap-3 rounded px-2 py-1 ${flashClass}`}>
      <span className="font-semibold text-term-text">{tick.ticker}</span>
      <span className="tabular-nums text-term-text">${fmtPrice(tick.price)}</span>
      <span className={`tabular-nums text-xs w-16 text-right ${positive ? "text-term-up" : "text-term-down"}`}>
        {fmtPct(tick.change_pct)}
      </span>
    </div>
  );
}

export { fmtPrice, fmtPct };
