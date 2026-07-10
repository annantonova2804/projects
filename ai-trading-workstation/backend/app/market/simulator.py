import asyncio
import math
import random
import time
from typing import AsyncIterator

from app.market.base import MarketDataProvider
from app.schemas import PriceTick

# ticker -> (starting price, annualized drift)
UNIVERSE: dict[str, float] = {
    "AAPL": 227.50,
    "MSFT": 421.30,
    "GOOGL": 175.80,
    "AMZN": 186.40,
    "NVDA": 128.90,
    "TSLA": 251.20,
    "META": 563.10,
    "NFLX": 685.00,
    "AMD": 141.75,
    "JPM": 218.60,
}


class GBMSimulator(MarketDataProvider):
    """Simulates live prices using Geometric Brownian Motion, ticking on an
    interval and fanning out updates to subscribers via asyncio.Queues."""

    def __init__(self, tick_interval: float = 1.5, volatility: float = 0.0015):
        self._tick_interval = tick_interval
        self._sigma = volatility
        self._prices: dict[str, float] = dict(UNIVERSE)
        self._open_prices: dict[str, float] = dict(UNIVERSE)
        self._subscribers: list[asyncio.Queue] = []
        self._task: asyncio.Task | None = None
        self._rng = random.Random()

    async def start(self) -> None:
        if self._task is None:
            self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        if self._task is not None:
            self._task.cancel()
            self._task = None

    def list_symbols(self) -> list[str]:
        return list(self._prices.keys())

    def _tick_to_price(self, ticker: str) -> PriceTick:
        price = self._prices[ticker]
        open_price = self._open_prices[ticker]
        change = price - open_price
        change_pct = (change / open_price) * 100 if open_price else 0.0
        return PriceTick(
            ticker=ticker,
            price=round(price, 2),
            open_price=round(open_price, 2),
            change=round(change, 2),
            change_pct=round(change_pct, 3),
            ts=time.time(),
        )

    def get_snapshot(self) -> list[PriceTick]:
        return [self._tick_to_price(t) for t in self._prices]

    def get_price(self, ticker: str) -> float | None:
        p = self._prices.get(ticker.upper())
        return round(p, 2) if p is not None else None

    def subscribe(self) -> AsyncIterator[PriceTick]:
        queue: asyncio.Queue = asyncio.Queue(maxsize=200)
        self._subscribers.append(queue)
        return self._consume(queue)

    async def _consume(self, queue: asyncio.Queue) -> AsyncIterator[PriceTick]:
        try:
            while True:
                tick = await queue.get()
                yield tick
        finally:
            self._subscribers.remove(queue)

    async def _run(self) -> None:
        dt = 1.0
        while True:
            await asyncio.sleep(self._tick_interval)
            for ticker in list(self._prices.keys()):
                price = self._prices[ticker]
                z = self._rng.gauss(0, 1)
                drift = -0.5 * self._sigma**2 * dt
                shock = self._sigma * math.sqrt(dt) * z
                new_price = max(price * math.exp(drift + shock), 0.01)
                self._prices[ticker] = new_price
                tick = self._tick_to_price(ticker)
                for queue in list(self._subscribers):
                    if queue.full():
                        continue
                    queue.put_nowait(tick)


_simulator: GBMSimulator | None = None


def get_market_provider() -> GBMSimulator:
    global _simulator
    if _simulator is None:
        from app.config import get_settings

        settings = get_settings()
        _simulator = GBMSimulator(
            tick_interval=settings.tick_interval_seconds,
            volatility=settings.tick_volatility,
        )
    return _simulator
