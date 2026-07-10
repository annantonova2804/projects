# FinAlly — Agent Guide

## Project Overview

A simulated AI trading workstation. Live (simulated) market prices stream to
a dark, terminal-style dashboard; the user trades a $10,000 virtual
portfolio; an embedded LLM chat assistant can inspect the portfolio, check
prices, manage the watchlist, and execute trades on the user's behalf via
tool-calling. Single Docker container: FastAPI serves both the REST/SSE API
and the static Next.js frontend from one port.

---

## Business Requirements

- Stream live simulated prices for a fixed universe of 10 tickers via SSE
- $10,000 starting virtual cash; market orders fill instantly at the current
  simulated price
- Portfolio view: cash, equity, total value, unrealized P&L per position and
  in aggregate
- Position heatmap, equity curve, and a positions table
- Watchlist: add/remove tickers, independent of held positions
- AI chat assistant: reads portfolio/prices/watchlist and executes trades via
  the same validation path as manual trades (funds/shares checks) — never
  refuses a trade for real-world financial risk reasons, since it's virtual
  money, but does flag concentration risk or insufficient funds/shares
- No authentication, no multi-user — one shared portfolio per running
  instance

---

## Limitations

- Single simulated market (GBM) by default; real market data via the Massive
  API is optional and best-effort (falls back silently on a failed poll)
- No limit/stop orders — market orders only
- No multi-user, no accounts, no auth
- No database migrations framework — schema changes are hand-edited in
  `backend/app/db.py`
- AI assistant can only act through the tools declared in
  `backend/app/ai/tools.py`; anything not exposed there, it cannot do

---

## Technical Decisions

- **Backend**: FastAPI (Python 3.11+, managed with `uv`), SQLite via
  `aiosqlite` with lazy table creation (no migrations needed to get started)
- **Market data**: `GBMSimulator` (geometric Brownian motion, ticks every
  ~1.5s) by default; `MassiveMarketProvider` (Polygon.io-compatible REST
  polling) when `MASSIVE_API_KEY` is set — both implement the same
  `MarketDataProvider` interface and fan out ticks to SSE subscribers via
  `asyncio.Queue`
- **Trading logic**: centralized in `backend/app/services/trading.py`, the
  only place that mutates cash/positions/trade log — shared by the REST
  router (`POST /api/trade`) and the AI tool dispatcher so a human trade and
  an AI trade go through identical validation
- **AI**: LiteLLM → OpenRouter, tool-calling loop in `backend/app/ai/llm.py`
  against the schemas in `backend/app/ai/tools.py`; `LLM_MOCK=true` swaps in
  a deterministic regex-based responder (no network, no API key) used by
  tests/CI so chat behavior doesn't depend on a live key
- **Frontend**: Next.js App Router, `output: "export"` (static HTML/JS/CSS,
  no Node server at runtime), TypeScript, Tailwind CSS
- **Frontend ↔ backend**: same-origin `/api/*` in production (FastAPI mounts
  the static export); `NEXT_PUBLIC_API_BASE` overrides this for local dev
  when the frontend runs on a different port than the backend
- **Packaging**: single multi-stage Dockerfile (Node build → uv install →
  slim Python runtime), one container, one port (8000)

---

## Color Scheme

Dark terminal aesthetic, Bloomberg-inspired — brand accent kept distinct from
the semantic gain/loss colors so a chip or focus ring never gets mistaken for
a price direction.

- Background: `#0b0e14` / panel: `#10141d` / border: `#212736`
- Text primary: `#e7e4dc`, muted: `#6b7484`
- Brand accent (buttons, focus, links): `#e8a33d` (amber)
- Gains: `#34d399` (emerald) / Losses: `#f0576c` (crimson)
- Data (tickers, prices, tables): monospace throughout, `font-variant-numeric: tabular-nums`
- Chat prose: system sans-serif — deliberately distinct from the monospace
  data to separate "machine" output from "human" conversation

---

## Coding Standards

- Backend: type-hinted Python, Pydantic models in `app/schemas.py` as the one
  source of truth for API shapes (`frontend/src/lib/types.ts` is a hand-kept
  mirror — update both in the same change)
- No comments explaining what code does — only why (non-obvious constraints)
- Frontend: functional components only, one component per file, props typed
  with TypeScript interfaces, no `any`
- Tailwind classes only — no inline styles, no CSS modules
- Named exports except page/layout files, which Next.js expects as default
  exports
- Any new AI capability is added to `TOOL_SCHEMAS` + `dispatch_tool` in
  `backend/app/ai/tools.py` first, then referenced from the system prompt —
  what the model can do stays auditable in one place
- `LLM_MOCK=true` must keep working without network access; update its
  pattern matching in `_mock_chat()` in the same change as any tool schema
  change, or E2E coverage silently goes stale

---

## Starting Point

```
backend/
  app/
    market/
      base.py        # MarketDataProvider interface
      simulator.py    # GBM simulator (default)
      massive.py      # Massive/Polygon.io REST poller (optional)
    services/
      trading.py      # portfolio reads, trade execution, watchlist — shared by REST + AI
    ai/
      tools.py        # tool schemas + dispatch
      llm.py          # OpenRouter tool-calling loop + LLM_MOCK responder
    routers/
      prices.py       # /api/symbols, /api/prices, /api/stream (SSE)
      portfolio.py     # /api/portfolio, /api/trade, /api/trades
      watchlist.py     # /api/watchlist
      chat.py          # /api/chat
    db.py             # SQLite lazy init
    schemas.py         # Pydantic models (source of truth for API shapes)
    main.py            # app wiring, static frontend mount
frontend/
  src/
    app/page.tsx        # dashboard composition
    components/          # Watchlist, Heatmap, PnLChart, PositionsTable, ChatPanel, TradeTicket
    lib/
      api.ts             # REST client
      usePriceStream.ts  # SSE hook
      types.ts            # hand-kept mirror of backend/app/schemas.py
test/
  e2e/trading.spec.ts    # Playwright: dashboard load, manual trade, AI trade, AI portfolio query
```

---

## Working Documentation

- All docs live at the repo root: `AGENTS.md`, `PLAN.md`, `README.md`
- Keep docs current when implementation changes
- README stays minimal: setup steps only, no feature tours
- No emojis anywhere
