#!/usr/bin/env bash
# Runs the Next.js dev server against a locally running backend (see dev-backend.sh).
set -euo pipefail
cd "$(dirname "$0")/../frontend"
export NEXT_PUBLIC_API_BASE="${NEXT_PUBLIC_API_BASE:-http://localhost:8000}"
npm run dev
