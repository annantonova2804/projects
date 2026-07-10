import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from app.db import init_db
from app.market.massive import MassiveMarketProvider
from app.market.simulator import get_market_provider
from app.routers import chat, portfolio, prices, watchlist
from app.config import get_settings

FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "static")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    settings = get_settings()

    if settings.massive_api_key:
        provider = MassiveMarketProvider(settings.massive_api_key)
        import app.market.simulator as sim_module

        sim_module._simulator = provider  # route get_market_provider() to the live feed
        await provider.start()
    else:
        await get_market_provider().start()

    yield

    await get_market_provider().stop()


app = FastAPI(title="FinAlly — AI Trading Workstation", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices.router)
app.include_router(portfolio.router)
app.include_router(watchlist.router)
app.include_router(chat.router)


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok"}


if os.path.isdir(FRONTEND_DIST):
    app.mount("/_next", StaticFiles(directory=os.path.join(FRONTEND_DIST, "_next")), name="next-assets")

    @app.get("/{full_path:path}")
    async def spa(full_path: str):
        candidate = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(candidate):
            return FileResponse(candidate)
        index_candidate = os.path.join(FRONTEND_DIST, full_path, "index.html")
        if os.path.isfile(index_candidate):
            return FileResponse(index_candidate)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
