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
    logger.info(f"Data directory: {settings.data_dir}")

    # Validate required settings in production
    try:
        settings.validate_required()
        logger.info("✅ Configuration validated")
    except ValueError as e:
        logger.error(f"❌ Configuration error: {e}")
        if settings.environment == "production":
            raise

    # Ensure data directory exists
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"✅ Data directory ready: {settings.data_dir}")

    # Initialize event log
    events_log = settings.data_dir / "events.jsonl"
    if not events_log.exists():
        events_log.touch()
        logger.info(f"✅ Created event log: {events_log}")

    # Initialize leads log
    leads_log = settings.data_dir / "leads.json"
    if not leads_log.exists():
        leads_log.touch()
        logger.info(f"✅ Created leads log: {leads_log}")

    logger.info("🚀 ScopeLock Backend ready")

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

# CORS middleware (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://scopelock.mindprotocol.ai", "http://localhost:3000"],
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

    # Check Anthropic API
    services["anthropic_api"] = ServiceStatus(
        status="connected" if settings.anthropic_api_key else "disconnected",
        last_check=datetime.utcnow()
    )

    # Check Telegram Bot
    services["telegram_bot"] = ServiceStatus(
        status="connected" if settings.telegram_bot_token else "disconnected",
        last_check=datetime.utcnow()
    )

    # Check data storage
    try:
        test_file = settings.data_dir / ".health_check"
        test_file.write_text("test")
        test_file.unlink()
        services["data_storage"] = ServiceStatus(
            status="connected",
            last_check=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Data storage check failed: {e}")
        services["data_storage"] = ServiceStatus(
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
# TODO: Uncomment as we implement these modules
# from app.api import webhooks, tracking, events
# app.include_router(webhooks.router, prefix="/webhook", tags=["webhooks"])
# app.include_router(tracking.router, prefix="/api/lead", tags=["tracking"])
# app.include_router(events.router, prefix="/api/events", tags=["events"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development",
        log_level=settings.log_level.lower()
    )
