export interface PriceTick {
  ticker: string;
  price: number;
  open_price: number;
  change: number;
  change_pct: number;
  ts: number;
}

export interface Position {
  ticker: string;
  qty: number;
  avg_price: number;
  price: number;
  market_value: number;
  cost_basis: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
}

export interface Portfolio {
  cash: number;
  equity: number;
  total_value: number;
  total_pnl: number;
  total_pnl_pct: number;
  positions: Position[];
}

export interface Trade {
  id: number;
  ticker: string;
  side: "buy" | "sell";
  qty: number;
  price: number;
  ts: string;
}

export interface ChatToolCall {
  name: string;
  arguments: Record<string, unknown>;
  result: Record<string, unknown> | null;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

export interface ChatResponse {
  reply: string;
  tool_calls: ChatToolCall[];
}
