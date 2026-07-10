from abc import ABC, abstractmethod
from typing import AsyncIterator

from app.schemas import PriceTick


class MarketDataProvider(ABC):
    """Common interface for price sources (simulator or live feed)."""

    @abstractmethod
    async def start(self) -> None: ...

    @abstractmethod
    async def stop(self) -> None: ...

    @abstractmethod
    def list_symbols(self) -> list[str]: ...

    @abstractmethod
    def get_snapshot(self) -> list[PriceTick]: ...

    @abstractmethod
    def get_price(self, ticker: str) -> float | None: ...

    @abstractmethod
    def subscribe(self) -> AsyncIterator[PriceTick]: ...
