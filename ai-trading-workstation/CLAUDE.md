# FinAlly Project

## Overview

FinAlly is a simulated AI trading workstation. Live (simulated) market prices
stream to a dark, terminal-style dashboard; the user trades a $10,000
virtual portfolio; an embedded LLM chat assistant can inspect the portfolio,
check prices, manage the watchlist, and execute trades on the user's behalf
via tool-calling. Single Docker container: FastAPI serves both the
REST/SSE API and the static Next.js frontend from one port.

## Development process

When instructed to build a feature:

1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your GitHub tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via
OpenRouter to the `gpt-oss-120b` model with Cerebras as the inference provider. You
should use Structured Outputs so that you can interpret the results and populate
trading actions (the tool-calling contract in `backend/app/ai/tools.py`).

## Technical design

The entire project is packaged into a single Docker container. The backend lives in
`backend/` and is a `uv` project using FastAPI. The frontend lives in `frontend/`,
built as a static export and served by FastAPI — no separate Node server at runtime.
The database is SQLite, lazily initialized on first request, persisted via a Docker
volume mount rather than its own container (no separate DB service to orchestrate).

Scripts live in `scripts/`:

- **start.sh** / **stop.sh** - build/run and stop the full stack via Docker
- **dev-backend.sh** - run the backend with `uv`, `LLM_MOCK=true` by default
- **dev-frontend.sh** - run the Next.js dev server against a local backend

There is no `setup`/`migrate`/`seed`/`lint`/`docker:up`/`docker:down` script set —
`db.py` lazily creates and seeds the schema itself, and there is no separate database
service to bring up or down independently of the app container.

## Current state vs. this spec

The codebase currently matches this spec: single-container FastAPI + static Next.js
export, GBM price simulator (Massive/Polygon.io optional), SQLite lazy init, and an
AI chat assistant wired through LiteLLM/OpenRouter tool-calling with an `LLM_MOCK`
offline fallback for tests. No outstanding gap to reconcile.
