import aiosqlite

from app.market.base import MarketDataProvider
from app.schemas import Portfolio, Position, Trade


class InsufficientFundsError(Exception):
    pass


class InsufficientSharesError(Exception):
    pass


class UnknownTickerError(Exception):
    pass


async def get_portfolio(db: aiosqlite.Connection, market: MarketDataProvider) -> Portfolio:
    cur = await db.execute("SELECT cash FROM account WHERE id = 1")
    row = await cur.fetchone()
    cash = row["cash"]

    cur = await db.execute("SELECT ticker, qty, avg_price FROM positions WHERE qty > 0")
    rows = await cur.fetchall()

    positions: list[Position] = []
    equity = 0.0
    for r in rows:
        price = market.get_price(r["ticker"]) or r["avg_price"]
        market_value = price * r["qty"]
        cost_basis = r["avg_price"] * r["qty"]
        pnl = market_value - cost_basis
        pnl_pct = (pnl / cost_basis) * 100 if cost_basis else 0.0
        equity += market_value
        positions.append(
            Position(
                ticker=r["ticker"],
                qty=r["qty"],
                avg_price=round(r["avg_price"], 4),
                price=price,
                market_value=round(market_value, 2),
                cost_basis=round(cost_basis, 2),
                unrealized_pnl=round(pnl, 2),
                unrealized_pnl_pct=round(pnl_pct, 3),
            )
        )

    total_value = cash + equity
    total_pnl = sum(p.unrealized_pnl for p in positions)
    cost_total = sum(p.cost_basis for p in positions)
    total_pnl_pct = (total_pnl / cost_total) * 100 if cost_total else 0.0

    return Portfolio(
        cash=round(cash, 2),
        equity=round(equity, 2),
        total_value=round(total_value, 2),
        total_pnl=round(total_pnl, 2),
        total_pnl_pct=round(total_pnl_pct, 3),
        positions=sorted(positions, key=lambda p: p.market_value, reverse=True),
    )


async def execute_trade(
    db: aiosqlite.Connection,
    market: MarketDataProvider,
    ticker: str,
    side: str,
    qty: float,
) -> Trade:
    ticker = ticker.upper()
    price = market.get_price(ticker)
    if price is None:
        raise UnknownTickerError(f"Unknown ticker: {ticker}")

    cur = await db.execute("SELECT cash FROM account WHERE id = 1")
    (cash,) = await cur.fetchone()

    cur = await db.execute("SELECT qty, avg_price FROM positions WHERE ticker = ?", (ticker,))
    pos = await cur.fetchone()
    cur_qty = pos["qty"] if pos else 0.0
    cur_avg = pos["avg_price"] if pos else 0.0

    cost = price * qty

    if side == "buy":
        if cost > cash + 1e-6:
            raise InsufficientFundsError(
                f"Insufficient funds: need ${cost:,.2f}, have ${cash:,.2f}"
            )
        new_qty = cur_qty + qty
        new_avg = ((cur_avg * cur_qty) + cost) / new_qty
        new_cash = cash - cost
    elif side == "sell":
        if qty > cur_qty + 1e-6:
            raise InsufficientSharesError(
                f"Insufficient shares: trying to sell {qty}, hold {cur_qty}"
            )
        new_qty = cur_qty - qty
        new_avg = cur_avg if new_qty > 1e-9 else 0.0
        new_cash = cash + cost
    else:
        raise ValueError(f"Invalid side: {side}")

    await db.execute("UPDATE account SET cash = ? WHERE id = 1", (new_cash,))
    await db.execute(
        """INSERT INTO positions (ticker, qty, avg_price) VALUES (?, ?, ?)
           ON CONFLICT(ticker) DO UPDATE SET qty = excluded.qty, avg_price = excluded.avg_price""",
        (ticker, new_qty, new_avg),
    )
    cur = await db.execute(
        "INSERT INTO trades (ticker, side, qty, price) VALUES (?, ?, ?, ?) RETURNING id, ticker, side, qty, price, ts",
        (ticker, side, qty, price),
    )
    row = await cur.fetchone()
    await db.commit()

    return Trade(
        id=row["id"], ticker=row["ticker"], side=row["side"],
        qty=row["qty"], price=row["price"], ts=row["ts"],
    )


async def get_watchlist(db: aiosqlite.Connection) -> list[str]:
    cur = await db.execute("SELECT ticker FROM watchlist ORDER BY added_at")
    rows = await cur.fetchall()
    return [r["ticker"] for r in rows]


async def add_watchlist(db: aiosqlite.Connection, ticker: str) -> None:
    await db.execute("INSERT OR IGNORE INTO watchlist (ticker) VALUES (?)", (ticker.upper(),))
    await db.commit()


async def remove_watchlist(db: aiosqlite.Connection, ticker: str) -> None:
    await db.execute("DELETE FROM watchlist WHERE ticker = ?", (ticker.upper(),))
    await db.commit()
