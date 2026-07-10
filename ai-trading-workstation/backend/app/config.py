from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    openrouter_api_key: str = ""
    openrouter_model: str = "openrouter/openai/gpt-4o-mini"
    massive_api_key: str = ""
    llm_mock: bool = False

    db_path: str = "db/finally.sqlite3"
    starting_cash: float = 10_000.0

    tick_interval_seconds: float = 1.5
    tick_volatility: float = 0.0015


@lru_cache
def get_settings() -> Settings:
    return Settings()
