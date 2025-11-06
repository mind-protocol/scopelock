"""
Mission Deck Backend - FastAPI Application

Main entry point for the Mission Deck backend API.

Architecture:
- FastAPI 0.104+
- FalkorDB for graph database
- JWT authentication
- CORS enabled for frontend
- Automatic OpenAPI docs at /docs

Run:
    uvicorn main:app --reload
    # API available at http://localhost:8000
    # Docs available at http://localhost:8000/docs
"""

import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from jose import JWTError
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import auth, missions, chat, dod, webhooks

# ============================================================================
# FastAPI App Configuration
# ============================================================================

app = FastAPI(
    title="Mission Deck API",
    description="Internal developer dashboard for ScopeLock mission execution",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ============================================================================
# CORS Middleware
# ============================================================================

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Include Routers
# ============================================================================

app.include_router(auth.router)
app.include_router(missions.router)
app.include_router(chat.router)
app.include_router(dod.router)
app.include_router(webhooks.router)

# ============================================================================
# Health Check Endpoint
# ============================================================================

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and deployment verification.
    """
    return {
        "status": "ok",
        "service": "mission-deck-api",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors (400 Bad Request)."""
    errors = exc.errors()
    error_messages = []

    for error in errors:
        field = " -> ".join(str(x) for x in error["loc"])
        message = error["msg"]
        error_messages.append(f"{field}: {message}")

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": "Validation error",
            "errors": error_messages,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    )


@app.exception_handler(JWTError)
async def jwt_exception_handler(request: Request, exc: JWTError):
    """Handle JWT authentication errors (401 Unauthorized)."""
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "detail": "Invalid or expired authentication token",
            "code": "INVALID_TOKEN",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        headers={"WWW-Authenticate": "Bearer"}
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors (500 Internal Server Error)."""
    print(f"[main.py:exception_handler] Unexpected error: {exc}")
    print(f"  Request: {request.method} {request.url}")

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred.",
            "code": "INTERNAL_ERROR",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    )

# ============================================================================
# Startup Event
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    print("\n" + "=" * 80)
    print("Mission Deck API - Starting Up")
    print("=" * 80)

    # Verify environment variables
    required_vars = [
        "FALKORDB_API_URL",
        "FALKORDB_API_KEY",
        "JWT_SECRET",
        "CLAUDE_API_KEY"
    ]

    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print("\n⚠️  WARNING: Missing environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nSome features may not work. See .env.example\n")
    else:
        print("\n✅ All required environment variables configured")

    # Test FalkorDB connection
    try:
        from services.graph import query_graph
        result = query_graph("MATCH (n) RETURN count(n) as count LIMIT 1")
        node_count = result[0].get("count", 0) if result else 0
        print(f"✅ FalkorDB connected ({node_count} nodes)")
    except Exception as e:
        print(f"⚠️  FalkorDB connection failed: {e}")

    print("\n🚀 Mission Deck API ready")
    print(f"   Docs: http://localhost:8000/docs")
    print(f"   Health: http://localhost:8000/health")
    print("=" * 80 + "\n")

