# FinAlly — Implementation Plan

## Step 1: Backend core

- `uv init` FastAPI project; dependencies: `fastapi`, `uvicorn`, `aiosqlite`,
  `litellm`, `sse-starlette`, `pydantic-settings`, `httpx`
- `app/config.py` — `pydantic-settings` env config (`OPENROUTER_API_KEY`,
  `MASSIVE_API_KEY`, `LLM_MOCK`, `STARTING_CASH`, `DB_PATH`, tick interval)
- `app/db.py` — SQLite schema (`account`, `positions`, `watchlist`, `trades`,
  `chat_messages`) with lazy `init_db()`, seeded starting cash + default
  10-ticker watchlist
- `app/schemas.py` — Pydantic models for every API shape (`PriceTick`,
  `Position`, `Portfolio`, `Trade`, `ChatRequest`/`ChatResponse`, ...)

## Step 2: Market data

- `app/market/base.py` — `MarketDataProvider` abstract interface
- `app/market/simulator.py` — `GBMSimulator`: geometric Brownian motion per
  ticker, ticks on an interval, fans out to subscriber `asyncio.Queue`s
- `app/market/massive.py` — `MassiveMarketProvider`: polls the Massive
  (Polygon.io-compatible) REST API when `MASSIVE_API_KEY` is set, same
  interface, falls back silently on a failed poll

## Step 3: Trading service + REST routers

- `app/services/trading.py` — `get_portfolio`, `execute_trade` (funds/shares
  validation, updates cash + position + trade log), `get_watchlist`,
  `add_watchlist`, `remove_watchlist` — the only place that mutates state
- `app/routers/prices.py` — `/api/symbols`, `/api/prices`, `/api/stream` (SSE)
- `app/routers/portfolio.py` — `/api/portfolio`, `/api/trade`, `/api/trades`
- `app/routers/watchlist.py` — `/api/watchlist` GET/POST/DELETE

## Step 4: AI chat assistant

- `app/ai/tools.py` — tool schemas (`get_portfolio`, `get_price`,
  `execute_trade`, `get_watchlist`, `add_to_watchlist`) + `dispatch_tool`
  routing into `services/trading`
- `app/ai/llm.py` — tool-calling loop against OpenRouter via `litellm`;
  `_mock_chat()` deterministic regex responder for `LLM_MOCK=true` (buy/sell,
  portfolio, watchlist, price-lookup intents) so chat is testable offline
- `app/routers/chat.py` — `/api/chat`

## Step 5: App wiring

- `app/main.py` — lifespan starts the market provider (simulator or Massive)
  on startup, stops it on shutdown; mounts routers under `/api`; mounts
  `static/` (the frontend build) with an SPA-fallback catch-all route

## Step 6: Frontend scaffold

- Next.js App Router, `output: "export"`, TypeScript, Tailwind CSS
- Dark terminal token set in `tailwind.config.ts` (`term.bg/panel/border/up/down/accent`)
  + flash-up/flash-down keyframes for price ticks
- `lib/types.ts` (mirrors `app/schemas.py`), `lib/api.ts` (REST client),
  `lib/usePriceStream.ts` (SSE hook tracking per-ticker up/down direction)

## Step 7: Dashboard components

- `Watchlist` — live prices with flash animation, add/remove
- `Heatmap` — positions sized by market value, colored by P&L%
- `PnLChart` — inline SVG equity curve (no charting library)
- `PositionsTable` — qty/cost/price/value/P&L, opens `TradeTicket`
- `TradeTicket` — buy/sell modal, estimated cost/proceeds, posts `/api/trade`
- `ChatPanel` — message list + input, posts `/api/chat`, triggers a
  portfolio refresh when the assistant's response includes an `execute_trade`
  tool call
- `app/page.tsx` — three-column composition (watchlist / heatmap+chart+positions / chat)

## Step 8: Packaging and verification

- Multi-stage `Dockerfile`: Node build (frontend static export) → `uv sync`
  (backend deps) → slim Python runtime serving `uvicorn` on `:8000`
- `scripts/start.sh` / `stop.sh` (Docker) and `dev-backend.sh` / `dev-frontend.sh`
  (local dev, `LLM_MOCK=true` by default)
- `test/e2e/trading.spec.ts` (Playwright): dashboard loads with starting
  cash, manual trade ticket fills an order, AI chat executes a trade via
  natural language, AI chat reports portfolio status — run against a live
  `LLM_MOCK=true` instance
- Verified end-to-end: backend smoke-tested via curl (health, trade, SSE
  stream), frontend typechecked and built clean, full stack served from one
  FastAPI process, all 4 Playwright tests passing in Chromium
