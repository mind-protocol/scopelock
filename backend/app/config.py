"""
Configuration management for ScopeLock backend

Loads environment variables with validation and defaults.
"""

import os
from pathlib import Path
from typing import Literal
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # API Keys (required in production)
    anthropic_api_key: str = ""
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    # Optional API keys
    upwork_api_key: str = ""

    # Environment
    environment: Literal["development", "production"] = "development"
    log_level: str = "INFO"

    # Data storage
    data_dir: Path = Path("/var/data")

    # Server
    port: int = 8000
    workers: int = 2

    # Paths
    citizens_dir: Path = Path("/home/mind-protocol/scopelock/citizens")
    proof_dir: Path = Path("/home/mind-protocol/scopelock/proof")

    class Config:
        env_file = ".env"
        case_sensitive = False

    def validate_required(self):
        """Validate required settings in production"""
        if self.environment == "production":
            missing = []
            if not self.anthropic_api_key:
                missing.append("ANTHROPIC_API_KEY")
            if not self.telegram_bot_token:
                missing.append("TELEGRAM_BOT_TOKEN")
            if not self.telegram_chat_id:
                missing.append("TELEGRAM_CHAT_ID")

            if missing:
                raise ValueError(
                    f"Missing required environment variables: {', '.join(missing)}"
                )

        # Ensure data directory exists
        self.data_dir.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()
