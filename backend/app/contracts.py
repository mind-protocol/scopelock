"""
API contracts (Pydantic models) for all requests and responses

All endpoints must use these contracts for validation.
"""

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, field_validator


# ============================================================================
# Rafael Responder Contracts
# ============================================================================

class UpworkResponseWebhook(BaseModel):
    """Webhook payload from Gmail when Upwork client responds"""
    subject: str
    body_html: str
    from_email: str
    received_at: Optional[datetime] = None


class ResponseDraftRequest(BaseModel):
    """Request to draft a response"""
    client: str
    message: str
    job_title: str
    job_link: Optional[str] = None


class ResponseDraft(BaseModel):
    """Drafted response with confidence score"""
    client: str
    job_title: str
    draft_text: str
    confidence: int = Field(ge=0, le=100, description="Confidence score 0-100")
    reasoning: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ResponseDraftResult(BaseModel):
    """API response for draft request"""
    status: Literal["drafted", "failed"]
    confidence: int = Field(ge=0, le=100)
    action: Literal["sent", "sent_for_approval", "failed"]
    message: Optional[str] = None


# ============================================================================
# Lead Tracker Contracts
# ============================================================================

class LeadEvaluation(BaseModel):
    """Emma's lead evaluation"""
    platform: str  # "Upwork", "Contra", etc.
    title: str
    budget: str
    decision: Literal["GO", "NO-GO"]
    reason: str
    urgency: Optional[int] = Field(None, ge=1, le=10)
    pain: Optional[int] = Field(None, ge=1, le=10)
    link: Optional[str] = None
    sent: bool = False

    @field_validator("platform")
    @classmethod
    def validate_platform(cls, v: str) -> str:
        allowed = ["Upwork", "Contra", "LinkedIn"]
        if v not in allowed:
            raise ValueError(f"Platform must be one of: {', '.join(allowed)}")
        return v


class LeadStats(BaseModel):
    """Aggregated lead statistics"""
    total_evaluated: int
    go_count: int
    nogo_count: int
    sent_count: int
    go_rate: float = Field(description="Percentage of GO decisions")


class LeadTrackResult(BaseModel):
    """API response for lead tracking"""
    status: Literal["tracked", "failed"]
    total_evaluated: int
    go_rate: float
    message: Optional[str] = None


# ============================================================================
# Event Hub Contracts
# ============================================================================

class Event(BaseModel):
    """Universal event structure"""
    event: str  # e.g., "response.drafted@1.0"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    payload: dict


class EventQuery(BaseModel):
    """Query parameters for event log"""
    since: Optional[datetime] = None
    event: Optional[str] = None
    limit: int = Field(default=100, le=1000)


class EventQueryResult(BaseModel):
    """API response for event queries"""
    events: list[Event]
    total: int


# ============================================================================
# Telegram Contracts
# ============================================================================

class TelegramCallback(BaseModel):
    """Telegram bot button callback"""
    callback_id: str
    action: Literal["approve", "edit", "reject"]
    draft_id: str


class TelegramCallbackResult(BaseModel):
    """API response for Telegram callback"""
    status: Literal["sent", "rejected", "waiting_edit"]
    message: str


# ============================================================================
# Health Check Contracts
# ============================================================================

class ServiceStatus(BaseModel):
    """Status of external service"""
    status: Literal["connected", "disconnected", "unknown"]
    last_check: Optional[datetime] = None


class HealthCheckResult(BaseModel):
    """Health check response"""
    status: Literal["healthy", "degraded", "unhealthy"]
    uptime_seconds: int
    services: dict[str, ServiceStatus]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Error Response
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    code_location: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    details: Optional[str] = None
