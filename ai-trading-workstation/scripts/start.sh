#!/usr/bin/env bash
# Builds and runs FinAlly in a single Docker container on port 8000.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "No .env found — copying .env.example. Add your OPENROUTER_API_KEY before using the AI chat."
  cp .env.example .env
fi

docker build -t finally .
docker run -d --name finally \
  -v finally-data:/app/db \
  -p 8000:8000 \
  --env-file .env \
  finally

echo "FinAlly is running at http://localhost:8000"
