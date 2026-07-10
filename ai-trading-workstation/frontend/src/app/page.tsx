"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { usePriceStream } from "@/lib/usePriceStream";
import type { Portfolio } from "@/lib/types";
import { Watchlist } from "@/components/Watchlist";
import { Heatmap } from "@/components/Heatmap";
import { PnLChart } from "@/components/PnLChart";
import { PositionsTable } from "@/components/PositionsTable";
import { ChatPanel } from "@/components/ChatPanel";
import { TradeTicket } from "@/components/TradeTicket";
import { fmtPct, fmtPrice } from "@/components/PriceCell";

const STARTING_CASH = 10_000;

export default function Home() {
  const prices = usePriceStream();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [equityHistory, setEquityHistory] = useState<number[]>([]);
  const [tradeTicker, setTradeTicker] = useState<string | null>(null);

  const refreshPortfolio = useCallback(() => {
    api.portfolio().then((p) => {
      setPortfolio(p);
      setEquityHistory((h) => [...h.slice(-119), p.total_value]);
    });
  }, []);

  useEffect(() => {
    refreshPortfolio();
    const id = setInterval(refreshPortfolio, 3000);
    return () => clearInterval(id);
  }, [refreshPortfolio]);

  const totalPnlPositive = (portfolio?.total_pnl ?? 0) >= 0;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-term-border bg-term-panel px-4 py-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold tracking-widest text-term-accent">FINALLY</span>
          <span className="text-xs text-term-muted">AI Trading Workstation</span>
        </div>
        {portfolio && (
          <div className="flex gap-6 text-xs tabular-nums">
            <div data-testid="header-cash">
              <span className="text-term-muted">Cash </span>
              <span>${fmtPrice(portfolio.cash)}</span>
            </div>
            <div>
              <span className="text-term-muted">Equity </span>
              <span>${fmtPrice(portfolio.equity)}</span>
            </div>
            <div>
              <span className="text-term-muted">Total Value </span>
              <span className="font-semibold">${fmtPrice(portfolio.total_value)}</span>
            </div>
            <div className={totalPnlPositive ? "text-term-up" : "text-term-down"}>
              <span className="text-term-muted">P&amp;L </span>
              <span className="font-semibold">
                ${fmtPrice(portfolio.total_pnl)} ({fmtPct(portfolio.total_pnl_pct)})
              </span>
            </div>
          </div>
        )}
      </header>

      <main className="grid flex-1 grid-cols-[220px_1fr_320px] gap-2 overflow-hidden p-2">
        <div className="overflow-hidden">
          <Watchlist prices={prices} onTrade={setTradeTicker} />
        </div>

        <div className="grid grid-rows-[1fr_1fr_1fr] gap-2 overflow-hidden">
          <Heatmap positions={portfolio?.positions ?? []} />
          <PnLChart history={equityHistory} startingCash={STARTING_CASH} />
          <PositionsTable positions={portfolio?.positions ?? []} onTrade={setTradeTicker} />
        </div>

        <div className="overflow-hidden">
          <ChatPanel onPortfolioChanged={refreshPortfolio} />
        </div>
      </main>

      {tradeTicker && (
        <TradeTicket
          ticker={tradeTicker}
          price={prices[tradeTicker]}
          onClose={() => setTradeTicker(null)}
          onFilled={refreshPortfolio}
        />
      )}
    </div>
  );
}
