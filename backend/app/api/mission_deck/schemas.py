"""
Pydantic Schemas for Mission Deck API

Defines request/response models for type safety and auto-documentation.

Architecture:
- Pydantic v2 (FastAPI 0.104+ compatible)
- Camel case for frontend (snake_case mapped to camelCase in responses)
- Complete field validation
"""

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


# ============================================================================
# Auth Schemas
# ============================================================================

class LoginRequest(BaseModel):
    """Login request payload."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=1, description="User password")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "person1@scopelock.ai",
                "password": "securepassword"
            }
        }


class UserResponse(BaseModel):
    """User information in responses."""
    id: str = Field(..., description="User unique identifier (slug)")
    email: str = Field(..., description="User email address")
    name: str = Field(..., description="User display name")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "bigbosexf",
                "email": "person1@scopelock.ai",
                "name": "Person 1"
            }
        }


class LoginResponse(BaseModel):
    """Login response with JWT token."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: UserResponse = Field(..., description="User information")

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "bigbosexf",
                    "email": "person1@scopelock.ai",
                    "name": "Person 1"
                }
            }
        }


# ============================================================================
# Mission Schemas
# ============================================================================

class MissionStackResponse(BaseModel):
    """Mission tech stack information."""
    backend: Optional[str] = Field(None, description="Backend framework (e.g., 'Python FastAPI')")
    frontend: Optional[str] = Field(None, description="Frontend framework (e.g., 'Next.js 14')")
    deploy_backend: Optional[str] = Field(None, description="Backend deployment platform")
    deploy_frontend: Optional[str] = Field(None, description="Frontend deployment platform")
    database: Optional[str] = Field(None, description="Database type")

    class Config:
        json_schema_extra = {
            "example": {
                "backend": "Python FastAPI",
                "frontend": None,
                "deploy_backend": "Render",
                "deploy_frontend": None,
                "database": "FalkorDB"
            }
        }


class MissionResponse(BaseModel):
    """Single mission response."""
    id: str = Field(..., description="Mission identifier (slug)")
    title: str = Field(..., description="Mission title")
    client: str = Field(..., description="Client name")
    budget: float = Field(..., description="Mission budget in dollars")
    deadline: datetime = Field(..., description="Mission deadline (ISO 8601)")
    status: str = Field(..., description="Mission status (active/qa/completed)")
    assigned_to: str = Field(..., description="Developer slug")
    stack: Optional[MissionStackResponse] = Field(None, description="Tech stack")
    notes: Optional[str] = Field(None, description="Developer notes")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "mission-47-telegram-bot",
                "title": "Telegram Notifier",
                "client": "Acme Corp",
                "budget": 300.0,
                "deadline": "2025-11-08T23:59:59Z",
                "status": "active",
                "assigned_to": "bigbosexf",
                "stack": {
                    "backend": "Python FastAPI",
                    "frontend": None,
                    "deploy_backend": "Render",
                    "deploy_frontend": None,
                    "database": "FalkorDB"
                },
                "notes": "Client prefers inline buttons.",
                "created_at": "2025-11-05T10:00:00Z"
            }
        }


class MissionListResponse(BaseModel):
    """List of missions response."""
    missions: List[MissionResponse] = Field(..., description="List of missions")
    total: int = Field(..., description="Total number of missions")

    class Config:
        json_schema_extra = {
            "example": {
                "missions": [],
                "total": 0
            }
        }


class MissionNotesRequest(BaseModel):
    """Request to update mission notes."""
    notes: str = Field(..., max_length=50000, description="Developer notes (markdown supported)")

    class Config:
        json_schema_extra = {
            "example": {
                "notes": "Client prefers inline buttons over separate commands."
            }
        }


# ============================================================================
# Chat Schemas
# ============================================================================

class CodeBlockResponse(BaseModel):
    """Code block in chat message."""
    language: str = Field(..., description="Programming language")
    code: str = Field(..., description="Code content")
    filename: str = Field(..., description="Suggested filename")

    class Config:
        json_schema_extra = {
            "example": {
                "language": "python",
                "code": "from telegram import Bot\n\nbot = Bot(token='YOUR_TOKEN')",
                "filename": "telegram_bot.py"
            }
        }


class ChatMessageRequest(BaseModel):
    """Request to send chat message."""
    message: str = Field(..., min_length=1, max_length=10000, description="Message to Rafael")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "How do I send a Telegram message with inline buttons?"
            }
        }


class ChatMessageResponse(BaseModel):
    """Chat message response from Rafael."""
    response: str = Field(..., description="Rafael's response text")
    code_blocks: List[CodeBlockResponse] = Field(default_factory=list, description="Extracted code blocks")

    class Config:
        json_schema_extra = {
            "example": {
                "response": "Here's how to send a Telegram message with inline buttons:\n\n```python\nfrom telegram import Bot\n```",
                "code_blocks": [
                    {
                        "language": "python",
                        "code": "from telegram import Bot",
                        "filename": "code.py"
                    }
                ]
            }
        }


class MessageHistoryItem(BaseModel):
    """Single message in chat history."""
    id: str = Field(..., description="Message unique identifier")
    role: str = Field(..., description="Message role (system/user/assistant)")
    content: str = Field(..., description="Message content")
    code_blocks: Optional[List[CodeBlockResponse]] = Field(default_factory=list, description="Code blocks")
    created_at: datetime = Field(..., description="Message timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "chat-msg-uuid-123",
                "role": "user",
                "content": "How do I deploy to Render?",
                "code_blocks": [],
                "created_at": "2025-11-05T10:05:00Z"
            }
        }


class MessageHistoryResponse(BaseModel):
    """Chat message history response."""
    messages: List[MessageHistoryItem] = Field(..., description="List of messages")
    total: int = Field(..., description="Total number of messages")

    class Config:
        json_schema_extra = {
            "example": {
                "messages": [],
                "total": 0
            }
        }


# ============================================================================
# DoD Schemas
# ============================================================================

class DoDItemResponse(BaseModel):
    """DoD checklist item response."""
    id: str = Field(..., description="Task unique identifier (slug)")
    text: str = Field(..., description="Task description")
    category: str = Field(..., description="Category (functional/non-functional/tests)")
    completed: bool = Field(..., description="Whether task is completed (state == 'done')")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "mission-47-task-1",
                "text": "Bot sends text messages",
                "category": "functional",
                "completed": False,
                "completed_at": None
            }
        }


class DoDListResponse(BaseModel):
    """List of DoD items response."""
    items: List[DoDItemResponse] = Field(..., description="DoD checklist items")
    total: int = Field(..., description="Total number of items")
    completed: int = Field(..., description="Number of completed items")

    class Config:
        json_schema_extra = {
            "example": {
                "items": [],
                "total": 0,
                "completed": 0
            }
        }


class DoDUpdateRequest(BaseModel):
    """Request to toggle DoD item completed state."""
    completed: bool = Field(..., description="New completed state")

    class Config:
        json_schema_extra = {
            "example": {
                "completed": True
            }
        }


class DoDUpdateResponse(BaseModel):
    """Response after toggling DoD item."""
    id: str = Field(..., description="Task identifier")
    completed: bool = Field(..., description="New completed state")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "mission-47-task-1",
                "completed": True,
                "completed_at": "2025-11-05T15:00:00Z"
            }
        }


# ============================================================================
# Error Schemas
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str = Field(..., description="Human-readable error message")
    code: Optional[str] = Field(None, description="Error code (e.g., MISSION_NOT_FOUND)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Mission not found",
                "code": "MISSION_NOT_FOUND",
                "timestamp": "2025-11-05T15:00:00Z"
            }
        }
