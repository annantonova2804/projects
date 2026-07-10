from typing import Literal

from pydantic import BaseModel, Field


class PriceTick(BaseModel):
    ticker: str
    price: float
    open_price: float
    change: float
    change_pct: float
    ts: float


class Position(BaseModel):
    ticker: str
    qty: float
    avg_price: float
    price: float
    market_value: float
    cost_basis: float
    unrealized_pnl: float
    unrealized_pnl_pct: float


class Portfolio(BaseModel):
    cash: float
    equity: float
    total_value: float
    total_pnl: float
    total_pnl_pct: float
    positions: list[Position]


class TradeRequest(BaseModel):
    ticker: str
    side: Literal["buy", "sell"]
    qty: float = Field(gt=0)


class Trade(BaseModel):
    id: int
    ticker: str
    side: str
    qty: float
    price: float
    ts: str


class WatchlistItem(BaseModel):
    ticker: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system", "tool"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)


class ChatToolCall(BaseModel):
    name: str
    arguments: dict
    result: dict | None = None


class ChatResponse(BaseModel):
    reply: str
    tool_calls: list[ChatToolCall] = Field(default_factory=list)
