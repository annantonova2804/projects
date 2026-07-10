from fastapi import APIRouter, HTTPException

from app.db import get_db
from app.market.simulator import get_market_provider
from app.schemas import Portfolio, Trade, TradeRequest
from app.services import trading

router = APIRouter(prefix="/api", tags=["portfolio"])


@router.get("/portfolio")
async def portfolio() -> Portfolio:
    async with get_db() as db:
        return await trading.get_portfolio(db, get_market_provider())


@router.post("/trade")
async def trade(req: TradeRequest) -> Trade:
    async with get_db() as db:
        try:
            return await trading.execute_trade(db, get_market_provider(), req.ticker, req.side, req.qty)
        except trading.UnknownTickerError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except (trading.InsufficientFundsError, trading.InsufficientSharesError) as e:
            raise HTTPException(status_code=400, detail=str(e))


@router.get("/trades")
async def trade_history() -> list[Trade]:
    async with get_db() as db:
        cur = await db.execute("SELECT id, ticker, side, qty, price, ts FROM trades ORDER BY ts DESC LIMIT 200")
        rows = await cur.fetchall()
        return [Trade(**dict(r)) for r in rows]
