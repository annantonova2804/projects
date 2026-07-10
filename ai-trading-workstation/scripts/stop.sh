#!/usr/bin/env bash
# Stops and removes the FinAlly container (the finally-data volume is preserved).
set -euo pipefail
docker stop finally 2>/dev/null || true
docker rm finally 2>/dev/null || true
echo "FinAlly stopped."
