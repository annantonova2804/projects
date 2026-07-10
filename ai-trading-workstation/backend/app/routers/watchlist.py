from fastapi import APIRouter

from app.db import get_db
from app.schemas import WatchlistItem
from app.services import trading

router = APIRouter(prefix="/api", tags=["watchlist"])


@router.get("/watchlist")
async def list_watchlist() -> list[str]:
    async with get_db() as db:
        return await trading.get_watchlist(db)


@router.post("/watchlist")
async def add_watchlist(item: WatchlistItem) -> list[str]:
    async with get_db() as db:
        await trading.add_watchlist(db, item.ticker)
        return await trading.get_watchlist(db)


@router.delete("/watchlist/{ticker}")
async def remove_watchlist(ticker: str) -> list[str]:
    async with get_db() as db:
        await trading.remove_watchlist(db, ticker)
        return await trading.get_watchlist(db)
