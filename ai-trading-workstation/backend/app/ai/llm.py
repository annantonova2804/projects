import json
import re

import aiosqlite
import litellm

from app.ai.tools import TOOL_SCHEMAS, dispatch_tool
from app.config import get_settings
from app.market.base import MarketDataProvider
from app.schemas import ChatMessage, ChatResponse, ChatToolCall

SYSTEM_PROMPT = """You are the AI trading assistant embedded in FinAlly, a simulated \
trading workstation. You can inspect the user's simulated portfolio, look up live \
simulated prices, manage their watchlist, and execute simulated market orders on their \
behalf via tools. All trading is virtual play money — never refuse a trade for real-world \
risk reasons, but do flag concentration risk or insufficient funds/shares when relevant. \
Be concise and quantitative. When you take an action via a tool, summarize the result \
in plain language."""

MAX_TOOL_ROUNDS = 5


async def chat(
    db: aiosqlite.Connection,
    market: MarketDataProvider,
    message: str,
    history: list[ChatMessage],
) -> ChatResponse:
    settings = get_settings()
    if settings.llm_mock:
        return await _mock_chat(db, market, message)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": message})

    collected_calls: list[ChatToolCall] = []

    for _ in range(MAX_TOOL_ROUNDS):
        response = await litellm.acompletion(
            model=settings.openrouter_model,
            api_key=settings.openrouter_api_key,
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto",
        )
        choice = response.choices[0].message
        tool_calls = getattr(choice, "tool_calls", None)

        if not tool_calls:
            return ChatResponse(reply=choice.content or "", tool_calls=collected_calls)

        messages.append({"role": "assistant", "content": choice.content or "", "tool_calls": [
            tc.model_dump() for tc in tool_calls
        ]})

        for tc in tool_calls:
            args = json.loads(tc.function.arguments or "{}")
            result = await dispatch_tool(db, market, tc.function.name, args)
            collected_calls.append(ChatToolCall(name=tc.function.name, arguments=args, result=result))
            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": json.dumps(result),
            })

    return ChatResponse(
        reply="I ran into trouble finishing that request after several tool calls — please try rephrasing.",
        tool_calls=collected_calls,
    )


_BUY_SELL_RE = re.compile(
    r"\b(buy|sell)\b.{0,20}?\b(\d+(?:\.\d+)?)\b.{0,20}?\b([A-Z]{1,5})\b", re.IGNORECASE
)
_TICKER_RE = re.compile(r"\b([A-Z]{2,5})\b")


async def _mock_chat(db: aiosqlite.Connection, market: MarketDataProvider, message: str) -> ChatResponse:
    """Deterministic offline responder for LLM_MOCK=true (used in tests/CI)."""
    collected: list[ChatToolCall] = []
    lower = message.lower()

    trade_match = _BUY_SELL_RE.search(message)
    if trade_match:
        side, qty, ticker = trade_match.group(1).lower(), float(trade_match.group(2)), trade_match.group(3).upper()
        result = await dispatch_tool(db, market, "execute_trade", {"ticker": ticker, "side": side, "qty": qty})
        collected.append(ChatToolCall(name="execute_trade", arguments={"ticker": ticker, "side": side, "qty": qty}, result=result))
        if result.get("status") == "filled":
            t = result["trade"]
            return ChatResponse(
                reply=f"Filled: {side} {qty} {ticker} @ ${t['price']:.2f}.",
                tool_calls=collected,
            )
        return ChatResponse(reply=f"Trade rejected: {result.get('reason')}", tool_calls=collected)

    if "portfolio" in lower or "holdings" in lower or "p&l" in lower or "pnl" in lower:
        result = await dispatch_tool(db, market, "get_portfolio", {})
        collected.append(ChatToolCall(name="get_portfolio", arguments={}, result=result))
        pos_summary = ", ".join(f"{p['ticker']} x{p['qty']:g}" for p in result["positions"]) or "no open positions"
        return ChatResponse(
            reply=(
                f"Cash: ${result['cash']:,.2f}. Total value: ${result['total_value']:,.2f} "
                f"(P&L {result['total_pnl_pct']:+.2f}%). Holdings: {pos_summary}."
            ),
            tool_calls=collected,
        )

    if "watchlist" in lower:
        result = await dispatch_tool(db, market, "get_watchlist", {})
        collected.append(ChatToolCall(name="get_watchlist", arguments={}, result=result))
        return ChatResponse(reply=f"Watchlist: {', '.join(result['watchlist'])}.", tool_calls=collected)

    price_match = _TICKER_RE.search(message)
    if price_match and market.get_price(price_match.group(1)):
        ticker = price_match.group(1)
        result = await dispatch_tool(db, market, "get_price", {"ticker": ticker})
        collected.append(ChatToolCall(name="get_price", arguments={"ticker": ticker}, result=result))
        return ChatResponse(reply=f"{ticker} is trading at ${result['price']:.2f}.", tool_calls=collected)

    return ChatResponse(
        reply="I'm running in mock mode. Try: \"buy 10 AAPL\", \"show my portfolio\", or \"what's TSLA trading at\".",
        tool_calls=collected,
    )
