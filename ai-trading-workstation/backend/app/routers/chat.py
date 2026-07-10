from fastapi import APIRouter

from app.ai.llm import chat as llm_chat
from app.db import get_db
from app.market.simulator import get_market_provider
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
async def chat(req: ChatRequest) -> ChatResponse:
    async with get_db() as db:
        return await llm_chat(db, get_market_provider(), req.message, req.history)
