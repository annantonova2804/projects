import asyncio
import time
from typing import AsyncIterator

import httpx

from app.market.base import MarketDataProvider
from app.market.simulator import UNIVERSE
from app.schemas import PriceTick

MASSIVE_BASE_URL = "https://api.massive.dev/v2"


class MassiveMarketProvider(MarketDataProvider):
    """Polls the Massive (Polygon.io-compatible) API for last-trade prices.

    Falls back gracefully to whatever was last observed if a poll fails,
    so a transient network blip never kills the stream.
    """

    def __init__(self, api_key: str, symbols: list[str] | None = None, poll_interval: float = 2.0):
        self._api_key = api_key
        self._symbols = symbols or list(UNIVERSE.keys())
        self._poll_interval = poll_interval
        self._prices: dict[str, float] = dict(UNIVERSE)
        self._open_prices: dict[str, float] = dict(UNIVERSE)
        self._subscribers: list[asyncio.Queue] = []
        self._task: asyncio.Task | None = None
        self._client: httpx.AsyncClient | None = None

    async def start(self) -> None:
        self._client = httpx.AsyncClient(timeout=5.0)
        if self._task is None:
            self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        if self._task is not None:
            self._task.cancel()
            self._task = None
        if self._client is not None:
            await self._client.aclose()

    def list_symbols(self) -> list[str]:
        return list(self._symbols)

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
        return [self._tick_to_price(t) for t in self._symbols]

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
                yield await queue.get()
        finally:
            self._subscribers.remove(queue)

    async def _poll_once(self) -> None:
        assert self._client is not None
        for ticker in self._symbols:
            try:
                resp = await self._client.get(
                    f"{MASSIVE_BASE_URL}/last/trade/{ticker}",
                    params={"apiKey": self._api_key},
                )
                resp.raise_for_status()
                data = resp.json()
                price = float(data["results"]["p"])
                self._prices[ticker] = price
                for queue in list(self._subscribers):
                    if not queue.full():
                        queue.put_nowait(self._tick_to_price(ticker))
            except (httpx.HTTPError, KeyError, ValueError):
                continue

    async def _run(self) -> None:
        while True:
            await self._poll_once()
            await asyncio.sleep(self._poll_interval)
