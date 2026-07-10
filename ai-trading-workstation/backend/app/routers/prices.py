import json

from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse

from app.market.simulator import get_market_provider
from app.schemas import PriceTick

router = APIRouter(prefix="/api", tags=["prices"])


@router.get("/symbols")
async def list_symbols() -> list[str]:
    return get_market_provider().list_symbols()


@router.get("/prices")
async def snapshot() -> list[PriceTick]:
    return get_market_provider().get_snapshot()


@router.get("/stream")
async def stream(request: Request) -> EventSourceResponse:
    market = get_market_provider()

    async def event_generator():
        async for tick in market.subscribe():
            if await request.is_disconnected():
                break
            yield {"event": "tick", "data": json.dumps(tick.model_dump())}

    return EventSourceResponse(event_generator())
