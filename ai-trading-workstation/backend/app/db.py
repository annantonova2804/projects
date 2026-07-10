import os
from contextlib import asynccontextmanager

import aiosqlite

from app.config import get_settings

_SCHEMA = """
CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    cash REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS positions (
    ticker TEXT PRIMARY KEY,
    qty REAL NOT NULL,
    avg_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS watchlist (
    ticker TEXT PRIMARY KEY,
    added_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticker TEXT NOT NULL,
    side TEXT NOT NULL,
    qty REAL NOT NULL,
    price REAL NOT NULL,
    ts TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    ts TEXT NOT NULL DEFAULT (datetime('now'))
);
"""

DEFAULT_WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX", "AMD", "JPM"]

_initialized = False


async def init_db() -> None:
    """Lazily create tables and seed defaults. Safe to call repeatedly."""
    global _initialized
    settings = get_settings()
    os.makedirs(os.path.dirname(settings.db_path) or ".", exist_ok=True)

    async with aiosqlite.connect(settings.db_path) as db:
        await db.executescript(_SCHEMA)
        cur = await db.execute("SELECT COUNT(*) FROM account")
        (count,) = await cur.fetchone()
        if count == 0:
            await db.execute("INSERT INTO account (id, cash) VALUES (1, ?)", (settings.starting_cash,))
        cur = await db.execute("SELECT COUNT(*) FROM watchlist")
        (wl_count,) = await cur.fetchone()
        if wl_count == 0:
            await db.executemany(
                "INSERT OR IGNORE INTO watchlist (ticker) VALUES (?)",
                [(t,) for t in DEFAULT_WATCHLIST],
            )
        await db.commit()
    _initialized = True


@asynccontextmanager
async def get_db():
    settings = get_settings()
    if not _initialized:
        await init_db()
    db = await aiosqlite.connect(settings.db_path)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()
