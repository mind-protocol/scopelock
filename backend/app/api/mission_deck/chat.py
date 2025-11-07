"""
Chat Router for Mission Deck

Handles chat interactions with citizens (Emma, Rafael, Sofia, etc.).

Architecture:
- POST /citizens/{citizen_id}/chat: Send message to citizen via Claude CLI
- GET /citizens/{citizen_id}/messages: Retrieve shared chat history
- Chats are SHARED (all users see same conversation with each citizen)
- All endpoints require authentication
"""

from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
import os
from pathlib import Path

from app.api.mission_deck.dependencies import get_current_user, CurrentUser
from app.api.mission_deck.services.citizen_cli import ask_citizen  # Uses Claude CLI (subscription, not API)
from app.api.mission_deck.services.graph import create_citizen_message, get_citizen_messages
from app.api.mission_deck.schemas import (
    ChatMessageRequest,
    ChatMessageResponse,
    MessageHistoryResponse,
    MessageHistoryItem,
    CodeBlockResponse
)

router = APIRouter(prefix="/api/citizens", tags=["Chat"])


def _is_valid_citizen(citizen_id: str) -> bool:
    """
    Check if citizen is valid by verifying folder exists.

    Args:
        citizen_id: Citizen identifier to validate

    Returns:
        True if citizens/{citizen_id}/ folder exists, False otherwise
    """
    # Find scopelock root
    # chat.py is at: backend/app/api/mission_deck/chat.py
    # Need to go up 4 levels to backend/, then 1 more to scopelock/
    current_file = Path(__file__).resolve()
    backend_dir = current_file.parent.parent.parent.parent  # backend/
    scopelock_root = backend_dir.parent  # scopelock/
    citizen_dir = scopelock_root / "citizens" / citizen_id

    return citizen_dir.exists() and citizen_dir.is_dir()


@router.post("/{citizen_id}/chat", response_model=ChatMessageResponse)
async def send_chat_message(
    citizen_id: str,
    request: ChatMessageRequest,
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Send message to a citizen and get response via Claude CLI.

    Flow:
    1. Save user message to graph (shared chat history)
    2. Call Claude CLI from citizen's folder (e.g., citizens/rafael/)
    3. Save citizen response to graph
    4. Return citizen response to frontend

    Args:
        citizen_id: Citizen identifier (emma, rafael, sofia, etc.)
        request: ChatMessageRequest with user message
        current_user: Authenticated user

    Returns:
        ChatMessageResponse with citizen's response and code blocks

    Raises:
        HTTPException 400: If message is empty or citizen_id invalid
        HTTPException 500: If Claude CLI fails

    Example:
        POST /api/citizens/rafael/chat
        Authorization: Bearer <token>
        {
            "message": "How do I deploy to Render?"
        }

        Response:
        {
            "response": "Here's how to deploy...\n```bash\ngit push render main\n```",
            "code_blocks": [
                {
                    "language": "bash",
                    "code": "git push render main",
                    "filename": "deploy.sh"
                }
            ]
        }
    """
    # Validate citizen_id (check if folder exists)
    if not _is_valid_citizen(citizen_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid citizen_id: {citizen_id}. Citizen folder not found."
        )

    # Validate message
    if not request.message or len(request.message.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    try:
        # Save user message to graph (shared chat history)
        create_citizen_message(
            citizen_id=citizen_id,
            role="user",
            content=request.message,
            actor_ref=current_user.slug,
            code_blocks=None
        )

        # Get response from citizen via Claude CLI (cd citizens/{citizen_id} && claude -p "message")
        citizen_response, code_blocks = ask_citizen(citizen_id, request.message)

        # Save citizen response to graph
        create_citizen_message(
            citizen_id=citizen_id,
            role="assistant",
            content=citizen_response,
            actor_ref=f"{citizen_id}_citizen",
            code_blocks=code_blocks
        )

        # Format code blocks for response
        formatted_code_blocks = [
            CodeBlockResponse(**block) for block in code_blocks
        ]

        return ChatMessageResponse(
            response=citizen_response,
            code_blocks=formatted_code_blocks
        )

    except HTTPException:
        raise  # Re-raise HTTP exceptions

    except Exception as e:
        # Fail loud - log error with traceback but return user-friendly message
        import traceback
        print(f"[routers/chat.py:send_chat_message] Chat error for {citizen_id}: {e}")
        print(f"[routers/chat.py:send_chat_message] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat message with {citizen_id}. Please try again."
        )


@router.get("/{citizen_id}/messages", response_model=MessageHistoryResponse)
async def get_chat_history(
    citizen_id: str,
    limit: int = 50,
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Get shared chat message history for a citizen.

    Chat history is SHARED across all users - everyone sees the same conversation.

    Args:
        citizen_id: Citizen identifier (emma, rafael, sofia, etc.)
        limit: Max messages to return (default 50, max 100)
        current_user: Authenticated user

    Returns:
        MessageHistoryResponse with list of messages

    Example:
        GET /api/citizens/rafael/messages?limit=10
        Authorization: Bearer <token>

        Response:
        {
            "messages": [
                {
                    "id": "chat-msg-uuid-1",
                    "role": "user",
                    "content": "How do I deploy to Render?",
                    "code_blocks": [],
                    "created_at": "2025-11-05T10:05:00Z"
                },
                {
                    "id": "chat-msg-uuid-2",
                    "role": "assistant",
                    "content": "Here's how to deploy...",
                    "code_blocks": [{...}],
                    "created_at": "2025-11-05T10:05:10Z"
                }
            ],
            "total": 2
        }
    """
    # Validate citizen_id (check if folder exists)
    if not _is_valid_citizen(citizen_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid citizen_id: {citizen_id}. Citizen folder not found."
        )

    # Validate limit
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )

    try:
        # Get shared messages from graph
        messages = get_citizen_messages(citizen_id, limit=limit)

        # Format messages for response
        formatted_messages = []
        for msg in messages:
            # Parse timestamp safely
            timestamp = msg.get("timestamp")
            if timestamp:
                try:
                    if isinstance(timestamp, str):
                        timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
                    elif not isinstance(timestamp, datetime):
                        timestamp = datetime.utcnow()
                except (ValueError, AttributeError) as e:
                    print(f"[chat.py:get_chat_history] Failed to parse timestamp: {timestamp}, error: {e}")
                    timestamp = datetime.utcnow()
            else:
                timestamp = datetime.utcnow()

            # Parse code blocks safely
            code_blocks = msg.get("code_blocks", [])
            try:
                if code_blocks and isinstance(code_blocks, list):
                    code_blocks = [CodeBlockResponse(**block) for block in code_blocks]
                else:
                    code_blocks = []
            except Exception as e:
                print(f"[chat.py:get_chat_history] Failed to parse code blocks: {e}")
                code_blocks = []

            formatted_messages.append(
                MessageHistoryItem(
                    id=msg.get("slug"),
                    role=msg.get("role"),
                    content=msg.get("content"),
                    code_blocks=code_blocks,
                    created_at=timestamp
                )
            )

        return MessageHistoryResponse(
            messages=formatted_messages,
            total=len(formatted_messages)
        )

    except Exception as e:
        # Fail loud - print full traceback for debugging
        import traceback
        print(f"[routers/chat.py:get_chat_history] Error fetching messages for {citizen_id}: {e}")
        print(f"[routers/chat.py:get_chat_history] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch chat history for {citizen_id}"
        )
