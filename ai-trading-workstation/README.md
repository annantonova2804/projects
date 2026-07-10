# FinAlly — AI Trading Workstation

A simulated trading workstation: live-streamed prices, a $10,000 virtual
portfolio, and an AI chat assistant that can execute trades via natural
language. Single Docker container — FastAPI serves both the API and a static
Next.js frontend on port 8000.

## Setup

```
cp .env.example .env
```

Add `OPENROUTER_API_KEY` to `.env` for the AI chat assistant, or leave
`LLM_MOCK=true` to run without one (deterministic offline responses).

## Dev (without Docker)

```
./scripts/dev-backend.sh    # FastAPI on :8000 (uv, LLM_MOCK=true by default)
./scripts/dev-frontend.sh   # Next.js dev server on :3000, proxies to :8000
```

## Build / run

```
docker build -t finally .
docker run -v finally-data:/app/db -p 8000:8000 --env-file .env finally
```

or `./scripts/start.sh` / `./scripts/stop.sh`.

## Test

```
./scripts/dev-backend.sh &
cd test && npm install && npx playwright install --with-deps chromium && npm test
```
