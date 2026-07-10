#!/usr/bin/env bash
# Runs the FastAPI backend locally (serving backend/static if it exists),
# using whatever uv is on PATH. Set LLM_MOCK=true for deterministic chat
# responses without an OpenRouter key.
set -euo pipefail
export PATH="$HOME/Library/Python/3.9/bin:$PATH"
cd "$(dirname "$0")/../backend"
export LLM_MOCK="${LLM_MOCK:-true}"
exec uv run uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
