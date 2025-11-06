"""
ScopeLock Backend - FastAPI Application

Main entry point for the event-native automation backend.
"""

import logging
import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.contracts import ErrorResponse

# Set up logging
logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

# Track uptime
START_TIME = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for the application"""
    # Startup
    logger.info("ScopeLock Backend starting...")
    logger.info(f"Environment: {settings.environment}")

    # Validate required settings in production
    try:
        settings.validate_required()
        logger.info("✅ Configuration validated")
    except ValueError as e:
        logger.error(f"❌ Configuration error: {e}")
        if settings.environment == "production":
            raise

    # Ensure data directory exists for file storage
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"✅ Data directory ready: {settings.data_dir}")

    logger.info("🚀 ScopeLock Backend ready (file-based, webhook-only)")

    yield

    # Shutdown
    logger.info("ScopeLock Backend shutting down...")


# Create FastAPI app
app = FastAPI(
    title="ScopeLock Backend",
    description="Event-native automation services for ScopeLock citizens",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
CORS_ORIGINS = settings.cors_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch all exceptions and return structured error"""
    logger.error(f"[main:global_error] {exc}", exc_info=True)

    error_response = ErrorResponse(
        error=str(exc),
        code_location="main:global_exception_handler",
        details=f"{request.method} {request.url}"
    )

    return JSONResponse(
        status_code=500,
        content=error_response.model_dump(mode="json")
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check for Render monitoring

    Returns service status and uptime.
    """
    from app.contracts import HealthCheckResult, ServiceStatus
    from datetime import datetime

    uptime = int(time.time() - START_TIME)

    # Check services
    services = {}

    # Check file storage
    try:
        test_file = settings.data_dir / ".health_check"
        test_file.write_text("test")
        test_file.unlink()
        services["file_storage"] = ServiceStatus(
            status="connected",
            last_check=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"File storage check failed: {e}")
        services["file_storage"] = ServiceStatus(
            status="disconnected",
            last_check=datetime.utcnow()
        )

    # Check Telegram Bot
    services["telegram_bot"] = ServiceStatus(
        status="connected" if settings.telegram_bot_token else "disconnected",
        last_check=datetime.utcnow()
    )

    # Check Citizen Runner service
    try:
        import httpx
        response = httpx.get(f"{settings.citizen_runner_url}/health", timeout=5.0)
        services["citizen_runner"] = ServiceStatus(
            status="connected" if response.status_code == 200 else "disconnected",
            last_check=datetime.utcnow()
        )
    except Exception as e:
        logger.debug(f"Citizen Runner check failed: {e}")
        services["citizen_runner"] = ServiceStatus(
            status="disconnected",
            last_check=datetime.utcnow()
        )

    # Determine overall status
    all_connected = all(s.status == "connected" for s in services.values())
    overall_status = "healthy" if all_connected else "degraded"

    return HealthCheckResult(
        status=overall_status,
        uptime_seconds=uptime,
        services=services
    )


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint - API information
    """
    return {
        "service": "ScopeLock Backend",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }


# Import and include routers
from app.webhooks import router as webhooks_router
app.include_router(webhooks_router, tags=["webhooks"])

# Mission Deck routers
from app.api.mission_deck.missions import router as missions_router
from app.api.mission_deck.chat import router as chat_router
from app.api.mission_deck.dod import router as dod_router
app.include_router(missions_router, prefix="/api", tags=["Mission Deck"])
app.include_router(chat_router, prefix="/api", tags=["Mission Deck"])
app.include_router(dod_router, prefix="/api", tags=["Mission Deck"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development",
        log_level=settings.log_level.lower()
    )
