"""
Chat Router for Mission Deck

Handles chat interactions with Rafael citizen.

Architecture:
- POST /chat: Send message, get Rafael response, save to graph
- GET /messages: Retrieve chat history from graph
- All endpoints require authentication + mission access
"""

from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

from dependencies import get_current_user, get_current_user_mission, CurrentUser
from services.rafael_cli import ask_rafael  # Uses Claude CLI (subscription, not API)
from services.graph import create_chat_message, get_mission_messages
from schemas import (
    ChatMessageRequest,
    ChatMessageResponse,
    MessageHistoryResponse,
    MessageHistoryItem,
    CodeBlockResponse
)

router = APIRouter(prefix="/api/missions", tags=["Chat"])


@router.post("/{mission_id}/chat", response_model=ChatMessageResponse)
async def send_chat_message(
    mission_id: str,
    request: ChatMessageRequest,
    current_user: CurrentUser = Depends(get_current_user),
    mission: dict = Depends(get_current_user_mission)
):
    """
    Send message to Rafael and get response.

    Flow:
    1. Save user message to graph
    2. Call Rafael API (Claude) with mission context
    3. Save Rafael response to graph
    4. Return Rafael response to frontend

    Args:
        mission_id: Mission slug (from URL)
        request: ChatMessageRequest with user message
        current_user: Authenticated user
        mission: Mission node (injected, includes auth check)

    Returns:
        ChatMessageResponse with Rafael's response and code blocks

    Raises:
        HTTPException 400: If message is empty or too long
        HTTPException 500: If Rafael API fails

    Example:
        POST /api/missions/mission-47-telegram-bot/chat
        Authorization: Bearer <token>
        {
            "message": "How do I send a Telegram message?"
        }

        Response:
        {
            "response": "Here's how...\n```python\nfrom telegram import Bot\n```",
            "code_blocks": [
                {
                    "language": "python",
                    "code": "from telegram import Bot",
                    "filename": "code.py"
                }
            ]
        }
    """
    # Validate message
    if not request.message or len(request.message.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    try:
        # Save user message to graph
        create_chat_message(
            mission_slug=mission_id,
            role="user",
            content=request.message,
            actor_ref=current_user.slug,
            code_blocks=None
        )

        # Build mission context for Rafael
        mission_context = {
            "title": mission.get("name", "Unknown Mission"),
            "stack": {
                "backend": mission.get("stack_backend"),
                "frontend": mission.get("stack_frontend"),
                "database": mission.get("stack_database")
            },
            "notes": mission.get("notes")
        }

        # Get response from Rafael (via Claude CLI - subscription, not API)
        rafael_response, code_blocks = ask_rafael(request.message, mission_context)

        # Save Rafael response to graph
        create_chat_message(
            mission_slug=mission_id,
            role="assistant",
            content=rafael_response,
            actor_ref="rafael_citizen",
            code_blocks=code_blocks
        )

        # Format code blocks for response
        formatted_code_blocks = [
            CodeBlockResponse(**block) for block in code_blocks
        ]

        return ChatMessageResponse(
            response=rafael_response,
            code_blocks=formatted_code_blocks
        )

    except HTTPException:
        raise  # Re-raise HTTP exceptions

    except Exception as e:
        # Fail loud - log error but return user-friendly message
        print(f"[routers/chat.py:send_chat_message] Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat message. Please try again."
        )


@router.get("/{mission_id}/messages", response_model=MessageHistoryResponse)
async def get_chat_history(
    mission_id: str,
    limit: int = 50,
    current_user: CurrentUser = Depends(get_current_user),
    mission: dict = Depends(get_current_user_mission)
):
    """
    Get chat message history for a mission.

    Args:
        mission_id: Mission slug (from URL)
        limit: Max messages to return (default 50, max 100)
        current_user: Authenticated user
        mission: Mission node (injected, includes auth check)

    Returns:
        MessageHistoryResponse with list of messages

    Example:
        GET /api/missions/mission-47-telegram-bot/messages?limit=10
        Authorization: Bearer <token>

        Response:
        {
            "messages": [
                {
                    "id": "chat-msg-uuid-1",
                    "role": "system",
                    "content": "Mission #47: Telegram Notifier. Ready to help.",
                    "code_blocks": [],
                    "created_at": "2025-11-05T10:00:00Z"
                },
                {
                    "id": "chat-msg-uuid-2",
                    "role": "user",
                    "content": "How do I deploy to Render?",
                    "code_blocks": [],
                    "created_at": "2025-11-05T10:05:00Z"
                },
                {
                    "id": "chat-msg-uuid-3",
                    "role": "assistant",
                    "content": "Here's how to deploy...",
                    "code_blocks": [{...}],
                    "created_at": "2025-11-05T10:05:10Z"
                }
            ],
            "total": 3
        }
    """
    # Validate limit
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )

    try:
        # Get messages from graph
        messages = get_mission_messages(mission_id, limit=limit)

        # Format messages for response
        formatted_messages = []
        for msg in messages:
            # Parse timestamp
            timestamp = msg.get("timestamp")
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))

            # Parse code blocks
            code_blocks = msg.get("code_blocks", [])
            if code_blocks and isinstance(code_blocks, list):
                code_blocks = [CodeBlockResponse(**block) for block in code_blocks]

            formatted_messages.append(
                MessageHistoryItem(
                    id=msg.get("slug"),
                    role=msg.get("role"),
                    content=msg.get("content"),
                    code_blocks=code_blocks,
                    created_at=timestamp or datetime.utcnow()
                )
            )

        return MessageHistoryResponse(
            messages=formatted_messages,
            total=len(formatted_messages)
        )

    except Exception as e:
        # Fail loud
        print(f"[routers/chat.py:get_chat_history] Error fetching messages: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch chat history"
        )
