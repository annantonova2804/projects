import aiosqlite

from app.market.base import MarketDataProvider
from app.services import trading

TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "get_portfolio",
            "description": "Get the current portfolio: cash balance, positions, market values, and unrealized P&L.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_price",
            "description": "Get the current simulated market price for a ticker symbol.",
            "parameters": {
                "type": "object",
                "properties": {"ticker": {"type": "string", "description": "Ticker symbol, e.g. AAPL"}},
                "required": ["ticker"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "execute_trade",
            "description": "Execute a simulated market order (buy or sell) at the current price. Use this when the user explicitly asks to buy or sell shares.",
            "parameters": {
                "type": "object",
                "properties": {
                    "ticker": {"type": "string", "description": "Ticker symbol, e.g. AAPL"},
                    "side": {"type": "string", "enum": ["buy", "sell"]},
                    "qty": {"type": "number", "description": "Number of shares"},
                },
                "required": ["ticker", "side", "qty"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_watchlist",
            "description": "Get the list of tickers currently on the user's watchlist.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "add_to_watchlist",
            "description": "Add a ticker to the watchlist.",
            "parameters": {
                "type": "object",
                "properties": {"ticker": {"type": "string"}},
                "required": ["ticker"],
            },
        },
    },
]


async def dispatch_tool(
    db: aiosqlite.Connection,
    market: MarketDataProvider,
    name: str,
    arguments: dict,
) -> dict:
    if name == "get_portfolio":
        portfolio = await trading.get_portfolio(db, market)
        return portfolio.model_dump()

    if name == "get_price":
        ticker = arguments["ticker"].upper()
        price = market.get_price(ticker)
        if price is None:
            return {"error": f"Unknown ticker: {ticker}"}
        return {"ticker": ticker, "price": price}

    if name == "execute_trade":
        try:
            trade = await trading.execute_trade(
                db, market, arguments["ticker"], arguments["side"], float(arguments["qty"])
            )
            return {"status": "filled", "trade": trade.model_dump()}
        except (trading.InsufficientFundsError, trading.InsufficientSharesError, trading.UnknownTickerError) as e:
            return {"status": "rejected", "reason": str(e)}

    if name == "get_watchlist":
        return {"watchlist": await trading.get_watchlist(db)}

    if name == "add_to_watchlist":
        await trading.add_watchlist(db, arguments["ticker"])
        return {"status": "added", "watchlist": await trading.get_watchlist(db)}

    return {"error": f"Unknown tool: {name}"}
