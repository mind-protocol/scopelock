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

    # Required in production
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    webhook_secret: str = ""  # HMAC secret for webhook verification
    vercel_webhook_signature: str = ""  # Vercel webhook signing secret (optional)

    # Environment
    environment: Literal["development", "production"] = "development"
    log_level: str = "INFO"

    # Data storage (file-based)
    data_dir: Path = Path("/var/data")

    # Server
    port: int = 8000
    workers: int = 2

    # Service URLs
    citizen_runner_url: str = "http://localhost:3000"  # Citizen Runner service
    backend_api_url: str = "http://localhost:8000"  # This backend (for citizens to call back)

    # Mission Deck Configuration
    falkordb_api_url: str = "https://mindprotocol.onrender.com/admin/query"
    falkordb_api_key: str = ""
    graph_name: str = "scopelock"
    jwt_secret: str = ""
    cors_origins: str = "https://scopelock.mindprotocol.ai,http://localhost:3000"

    # Claude CLI Configuration
    claude_credentials: str = ""  # JSON string with Claude session credentials

    class Config:
        env_file = ".env"
        case_sensitive = False

    def validate_required(self):
        """Validate required settings in production"""
        if self.environment == "production":
            missing = []
            if not self.telegram_bot_token:
                missing.append("TELEGRAM_BOT_TOKEN")
            if not self.telegram_chat_id:
                missing.append("TELEGRAM_CHAT_ID")
            if not self.webhook_secret:
                missing.append("WEBHOOK_SECRET")
            if not self.falkordb_api_key:
                missing.append("FALKORDB_API_KEY")
            if not self.jwt_secret:
                missing.append("JWT_SECRET")

            if missing:
                raise ValueError(
                    f"Missing required environment variables: {', '.join(missing)}"
                )

        # Ensure data directory exists
        self.data_dir.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()
