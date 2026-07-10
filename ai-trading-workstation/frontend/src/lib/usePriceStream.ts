"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "./api";
import type { PriceTick } from "./types";

export type Direction = "up" | "down" | null;

export interface LivePrice extends PriceTick {
  direction: Direction;
}

export function usePriceStream() {
  const [prices, setPrices] = useState<Record<string, LivePrice>>({});
  const lastPriceRef = useRef<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    api.prices().then((snapshot) => {
      if (cancelled) return;
      const initial: Record<string, LivePrice> = {};
      for (const tick of snapshot) {
        initial[tick.ticker] = { ...tick, direction: null };
        lastPriceRef.current[tick.ticker] = tick.price;
      }
      setPrices(initial);
    });

    const source = new EventSource(api.streamUrl());
    source.addEventListener("tick", (event) => {
      const tick = JSON.parse((event as MessageEvent).data) as PriceTick;
      const prev = lastPriceRef.current[tick.ticker];
      const direction: Direction = prev == null ? null : tick.price > prev ? "up" : tick.price < prev ? "down" : null;
      lastPriceRef.current[tick.ticker] = tick.price;
      setPrices((current) => ({ ...current, [tick.ticker]: { ...tick, direction } }));
    });

    return () => {
      cancelled = true;
      source.close();
    };
  }, []);

  return prices;
}
