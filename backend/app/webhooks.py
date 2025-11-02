"""
Webhook handlers for Gmail and Telegram

Core backend responsibility: receive webhooks, run Claude CLI, send Telegram.
"""

import logging
from datetime import datetime
from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel

from app.auth import verify_webhook_signature
from app.runner import runner
from app.telegram import send_draft_notification, handle_approval

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# Request Models
# ============================================================================

class UpworkWebhookRequest(BaseModel):
    """Gmail webhook payload for Upwork responses"""
    client: str
    message: str
    job_title: str
    job_link: str


class TelegramUpdate(BaseModel):
    """Telegram callback update"""
    update_id: int
    callback_query: dict | None = None


# ============================================================================
# Endpoints
# ============================================================================

@router.post("/webhook/upwork", dependencies=[Depends(verify_webhook_signature)])
async def upwork_webhook(request: UpworkWebhookRequest):
    """
    Receive Gmail webhook for Upwork client responses

    Flow:
    1. Verify HMAC signature (via dependency)
    2. Extract client message
    3. Run: claude --print "New Upwork response from {client}: {message}" --continue
    4. Rafael drafts response via Claude Code tools
    5. Rafael writes draft file: citizens/rafael/drafts/{uuid}.json
    6. Rafael calls this backend's Telegram endpoint (or we trigger it)

    Args:
        request: Webhook payload from Gmail/Cloud Function

    Returns:
        {"status": "triggered", "citizen": "rafael"}
    """
    try:
        logger.info(f"[webhook:upwork] Received response from {request.client}")

        # Run Rafael via Claude CLI
        result = runner.run_rafael(
            client=request.client,
            message=request.message,
            job_title=request.job_title,
            job_link=request.job_link
        )

        if result["success"]:
            logger.info(f"[webhook:upwork] Rafael session completed")
            return {
                "status": "triggered",
                "citizen": "rafael",
                "output": result["output"][:200]  # First 200 chars
            }
        else:
            logger.error(f"[webhook:upwork] Rafael session failed: {result['error']}")
            return {
                "status": "error",
                "citizen": "rafael",
                "error": result["error"]
            }

    except Exception as e:
        logger.error(f"[webhook:upwork] {e}", exc_info=True)
        raise


@router.post("/webhook/telegram")
async def telegram_webhook(update: TelegramUpdate):
    """
    Handle Telegram callback queries (approval buttons)

    Flow:
    1. Parse callback_data → "approve:{draft_id}" or "reject:{draft_id}"
    2. Read draft file: citizens/rafael/drafts/{draft_id}.json
    3. Update status field
    4. Call Telegram API to edit message ("✅ Approved" or "❌ Rejected")
    5. If approved, trigger send (future: call Upwork API or copy to clipboard)

    Args:
        update: Telegram update object

    Returns:
        {"status": "approved"|"rejected", "draft_id": "..."}
    """
    try:
        if not update.callback_query:
            logger.warning("[webhook:telegram] No callback_query in update")
            return {"status": "ignored"}

        callback_data = update.callback_query.get("data", "")
        callback_id = update.callback_query.get("id")

        logger.info(f"[webhook:telegram] Callback: {callback_data}")

        # Parse action and draft_id
        if ":" not in callback_data:
            logger.warning(f"[webhook:telegram] Invalid callback_data: {callback_data}")
            return {"status": "invalid_format"}

        action, draft_id = callback_data.split(":", 1)

        # Handle approval/rejection
        result = await handle_approval(draft_id, action, callback_id)

        return result

    except Exception as e:
        logger.error(f"[webhook:telegram] {e}", exc_info=True)
        raise


@router.post("/api/notify/draft")
async def notify_draft(draft_id: str, client: str, draft_text: str, confidence: int):
    """
    Send Telegram notification with approval buttons

    Called by Rafael (via Bash tool) after creating draft file.

    Args:
        draft_id: UUID of draft
        client: Client name
        draft_text: Draft response text
        confidence: Confidence score (0-100)

    Returns:
        {"telegram_sent": true, "message_id": "..."}
    """
    try:
        logger.info(f"[notify:draft] Sending notification for draft {draft_id}")

        message_id = await send_draft_notification(
            draft_id=draft_id,
            client=client,
            draft_text=draft_text,
            confidence=confidence
        )

        return {
            "telegram_sent": True,
            "message_id": message_id
        }

    except Exception as e:
        logger.error(f"[notify:draft] {e}", exc_info=True)
        raise
