# --- Stage 1: build the Next.js static export ---
FROM node:22-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: install backend deps with uv ---
FROM python:3.12-slim AS backend-build
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /uvx /usr/local/bin/
WORKDIR /app/backend
COPY backend/pyproject.toml ./
RUN uv sync --no-dev --no-install-project
COPY backend/ ./
RUN uv sync --no-dev

# --- Stage 3: final runtime image ---
FROM python:3.12-slim
WORKDIR /app
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/out /app/backend/static

RUN mkdir -p /app/db
ENV DB_PATH=/app/db/finally.sqlite3
ENV PATH="/app/backend/.venv/bin:$PATH"

WORKDIR /app/backend
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
