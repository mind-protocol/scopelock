"""
Telegram Bot integration

Sends notifications with approval buttons and handles callbacks.
"""

import json
import logging
from pathlib import Path
from typing import Optional
import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class TelegramBot:
    """
    Simple Telegram Bot client

    Uses Telegram Bot API directly (no python-telegram-bot library).
    """

    def __init__(self, token: Optional[str] = None, chat_id: Optional[str] = None):
        """
        Initialize Telegram bot

        Args:
            token: Bot token from @BotFather (default: from settings)
            chat_id: Chat ID to send messages to (default: from settings)
        """
        self.token = token or settings.telegram_bot_token
        self.chat_id = chat_id or settings.telegram_chat_id
        self.api_base = f"https://api.telegram.org/bot{self.token}"

    async def send_message(
        self,
        text: str,
        reply_markup: Optional[dict] = None
    ) -> Optional[str]:
        """
        Send message to chat

        Args:
            text: Message text (supports Markdown)
            reply_markup: Inline keyboard buttons

        Returns:
            Message ID if successful, None otherwise
        """
        try:
            url = f"{self.api_base}/sendMessage"
            payload = {
                "chat_id": self.chat_id,
                "text": text,
                "parse_mode": "Markdown"
            }

            if reply_markup:
                payload["reply_markup"] = reply_markup

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                result = response.json()

                if result.get("ok"):
                    message_id = str(result["result"]["message_id"])
                    logger.info(f"[telegram:send] Message sent: {message_id}")
                    return message_id
                else:
                    logger.error(f"[telegram:send] API error: {result}")
                    return None

        except Exception as e:
            logger.error(f"[telegram:send] Failed to send message: {e}", exc_info=True)
            return None

    async def edit_message(
        self,
        message_id: str,
        text: str,
        reply_markup: Optional[dict] = None
    ) -> bool:
        """
        Edit existing message

        Args:
            message_id: Message ID to edit
            text: New text
            reply_markup: New inline keyboard (or None to remove)

        Returns:
            True if successful
        """
        try:
            url = f"{self.api_base}/editMessageText"
            payload = {
                "chat_id": self.chat_id,
                "message_id": message_id,
                "text": text,
                "parse_mode": "Markdown"
            }

            if reply_markup:
                payload["reply_markup"] = reply_markup

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                result = response.json()

                if result.get("ok"):
                    logger.info(f"[telegram:edit] Message {message_id} edited")
                    return True
                else:
                    logger.error(f"[telegram:edit] API error: {result}")
                    return False

        except Exception as e:
            logger.error(f"[telegram:edit] Failed to edit message: {e}", exc_info=True)
            return False

    async def answer_callback(self, callback_id: str, text: str = "") -> bool:
        """
        Answer callback query (removes loading state from button)

        Args:
            callback_id: Callback query ID
            text: Optional notification text

        Returns:
            True if successful
        """
        try:
            url = f"{self.api_base}/answerCallbackQuery"
            payload = {
                "callback_query_id": callback_id,
                "text": text
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                return response.json().get("ok", False)

        except Exception as e:
            logger.error(f"[telegram:answer] Failed to answer callback: {e}")
            return False


# Global bot instance
bot = TelegramBot()


# ============================================================================
# High-level functions
# ============================================================================

async def send_draft_notification(
    draft_id: str,
    client: str,
    draft_text: str,
    confidence: int,
    received_at: Optional[str] = None
) -> Optional[str]:
    """
    Send draft notification with approval buttons

    Args:
        draft_id: UUID of draft
        client: Client name
        draft_text: Draft response text
        confidence: Confidence score (0-100)
        received_at: ISO timestamp when Gmail alert received (for SLA tracking)

    Returns:
        Message ID if successful
    """
    # Format message
    text = f"""📝 **New Draft Response**

**Client:** {client}
**Confidence:** {confidence}%

**Draft:**
```
{draft_text[:500]}{"..." if len(draft_text) > 500 else ""}
```

Draft ID: `{draft_id}`
"""

    # Create inline keyboard with approval buttons
    reply_markup = {
        "inline_keyboard": [
            [
                {"text": "✅ Approve", "callback_data": f"approve:{draft_id}"},
                {"text": "✏️ Edit", "callback_data": f"edit:{draft_id}"},
                {"text": "❌ Reject", "callback_data": f"reject:{draft_id}"}
            ]
        ]
    }

    message_id = await bot.send_message(text, reply_markup)

    # Store message_id in draft file with SLA tracking
    if message_id:
        try:
            from datetime import datetime

            draft_file = settings.data_dir / "drafts" / f"{draft_id}.json"
            draft_file.parent.mkdir(parents=True, exist_ok=True)

            now = datetime.utcnow().isoformat()

            draft_data = {
                "id": draft_id,
                "client": client,
                "draft_text": draft_text,
                "confidence": confidence,
                "status": "pending",
                "telegram_message_id": message_id,
                "timestamps": {
                    "received_at": received_at,  # When Gmail alert received (for SLA)
                    "notified_at": now
                }
            }

            draft_file.write_text(json.dumps(draft_data, indent=2))
            logger.info(f"[telegram:notify] Draft file created: {draft_file}")

        except Exception as e:
            logger.error(f"[telegram:notify] Failed to create draft file: {e}")

    return message_id


async def send_proposal_notification(
    proposal_id: str,
    job_title: str,
    job_url: str,
    proposal_text: str,
    bid_amount: int,
    confidence: int,
    client_info: dict
) -> Optional[str]:
    """
    Send Upwork proposal notification with approval buttons

    Args:
        proposal_id: UUID of proposal
        job_title: Upwork job title
        job_url: Upwork job URL
        proposal_text: Emma's generated proposal
        bid_amount: Suggested bid amount
        confidence: Confidence score (0-100)
        client_info: Client details (spent, rating, etc.)

    Returns:
        Message ID if successful
    """
    # Format client info
    client_spent = client_info.get('total_spent', 0)
    client_rating = client_info.get('rating', 0)
    client_hires = client_info.get('total_hires', 0)

    # Format message
    text = f"""🎯 **New Upwork Proposal**

**Job:** {job_title[:80]}{"..." if len(job_title) > 80 else ""}
**Bid:** ${bid_amount}
**Confidence:** {confidence}%

**Client:**
• Spent: ${client_spent:,.0f}
• Rating: {client_rating}⭐
• Hires: {client_hires}

**Proposal:**
```
{proposal_text[:400]}{"..." if len(proposal_text) > 400 else ""}
```

[View Full Job]({job_url})

Proposal ID: `{proposal_id}`
"""

    # Create inline keyboard with approval buttons
    reply_markup = {
        "inline_keyboard": [
            [
                {"text": "✅ Approve & Submit", "callback_data": f"proposal_approve:{proposal_id}"},
                {"text": "✏️ Edit", "callback_data": f"proposal_edit:{proposal_id}"}
            ],
            [
                {"text": "❌ Reject", "callback_data": f"proposal_reject:{proposal_id}"}
            ]
        ]
    }

    message_id = await bot.send_message(text, reply_markup)

    # Store message_id in proposal file
    if message_id:
        try:
            from datetime import datetime

            proposal_file = settings.data_dir / "proposals" / f"{proposal_id}.json"
            proposal_file.parent.mkdir(parents=True, exist_ok=True)

            now = datetime.utcnow().isoformat()

            proposal_data = {
                "id": proposal_id,
                "job_title": job_title,
                "job_url": job_url,
                "proposal_text": proposal_text,
                "bid_amount": bid_amount,
                "confidence": confidence,
                "client_info": client_info,
                "status": "pending",
                "telegram_message_id": message_id,
                "timestamps": {
                    "created_at": now,
                    "notified_at": now
                }
            }

            proposal_file.write_text(json.dumps(proposal_data, indent=2))
            logger.info(f"[telegram:proposal] Proposal file created: {proposal_file}")

        except Exception as e:
            logger.error(f"[telegram:proposal] Failed to create proposal file: {e}")

    return message_id


async def handle_proposal_action(proposal_id: str, action: str, callback_id: str) -> dict:
    """
    Handle approval/edit/rejection of Upwork proposal

    Args:
        proposal_id: UUID of proposal
        action: "approve", "edit", or "reject"
        callback_id: Telegram callback query ID

    Returns:
        {"status": str, "proposal_id": str, "action": str}
    """
    try:
        # Read proposal file
        proposal_file = settings.data_dir / "proposals" / f"{proposal_id}.json"

        if not proposal_file.exists():
            logger.warning(f"[telegram:proposal] Proposal file not found: {proposal_id}")
            await bot.answer_callback(callback_id, "Proposal not found")
            return {"status": "not_found", "proposal_id": proposal_id}

        proposal_data = json.loads(proposal_file.read_text())

        from datetime import datetime
        now_iso = datetime.utcnow().isoformat()

        if action == "approve":
            proposal_data["status"] = "approved"
            status_icon = "✅"
            status_text = "Approved - Ready to Submit"
            proposal_data["timestamps"]["approved_at"] = now_iso

            # Trigger browser automation (will be implemented next)
            logger.info(f"[telegram:proposal] Triggering browser automation for {proposal_id}")

        elif action == "reject":
            proposal_data["status"] = "rejected"
            status_icon = "❌"
            status_text = "Rejected"
            proposal_data["timestamps"]["rejected_at"] = now_iso

        elif action == "edit":
            proposal_data["status"] = "editing"
            status_icon = "✏️"
            status_text = "Edit in Emma Context"
            proposal_data["timestamps"]["editing_at"] = now_iso

        else:
            logger.warning(f"[telegram:proposal] Unknown action: {action}")
            return {"status": "unknown_action", "proposal_id": proposal_id}

        # Save updated proposal
        proposal_file.write_text(json.dumps(proposal_data, indent=2))

        # Edit Telegram message
        message_id = proposal_data.get("telegram_message_id")
        if message_id:
            updated_text = f"""{status_icon} **Proposal {status_text}**

**Job:** {proposal_data['job_title'][:80]}{"..." if len(proposal_data['job_title']) > 80 else ""}
**Bid:** ${proposal_data['bid_amount']}
**Confidence:** {proposal_data['confidence']}%

**Status:** {status_text}

[View Full Job]({proposal_data['job_url']})

Proposal ID: `{proposal_id}`
"""

            await bot.edit_message(message_id, updated_text)

        # Answer callback
        await bot.answer_callback(callback_id, f"Proposal {status_text.lower()}")

        logger.info(f"[telegram:proposal] Proposal {proposal_id} {status_text.lower()}")

        return {
            "status": proposal_data["status"],
            "proposal_id": proposal_id,
            "action": action
        }

    except Exception as e:
        logger.error(f"[telegram:proposal] {e}", exc_info=True)
        await bot.answer_callback(callback_id, "Error processing approval")
        return {"status": "error", "proposal_id": proposal_id, "error": str(e)}


async def handle_approval(draft_id: str, action: str, callback_id: str) -> dict:
    """
    Handle approval/rejection of draft

    Args:
        draft_id: UUID of draft
        action: "approve", "edit", or "reject"
        callback_id: Telegram callback query ID

    Returns:
        {"status": str, "draft_id": str}
    """
    try:
        # Read draft file
        draft_file = settings.data_dir / "drafts" / f"{draft_id}.json"

        if not draft_file.exists():
            logger.warning(f"[telegram:approve] Draft file not found: {draft_id}")
            await bot.answer_callback(callback_id, "Draft not found")
            return {"status": "not_found", "draft_id": draft_id}

        draft_data = json.loads(draft_file.read_text())

        from datetime import datetime

        # Update status and timestamp
        now = datetime.utcnow()
        now_iso = now.isoformat()

        if action == "approve":
            draft_data["status"] = "approved"
            status_icon = "✅"
            status_text = "Approved"
            draft_data["timestamps"]["approved_at"] = now_iso
        elif action == "reject":
            draft_data["status"] = "rejected"
            status_icon = "❌"
            status_text = "Rejected"
            draft_data["timestamps"]["rejected_at"] = now_iso
        elif action == "edit":
            draft_data["status"] = "editing"
            status_icon = "✏️"
            status_text = "Editing"
            draft_data["timestamps"]["editing_at"] = now_iso
        else:
            logger.warning(f"[telegram:approve] Unknown action: {action}")
            return {"status": "unknown_action", "draft_id": draft_id}

        # Calculate response time for SLA tracking
        response_time_minutes = None
        sla_met = None
        if "timestamps" in draft_data:
            received_at = draft_data["timestamps"].get("received_at")
            if received_at and action == "approve":
                received_dt = datetime.fromisoformat(received_at)
                response_time_seconds = (now - received_dt).total_seconds()
                response_time_minutes = int(response_time_seconds / 60)
                sla_met = response_time_minutes < 120  # <2h SLA

                draft_data["sla"] = {
                    "response_time_minutes": response_time_minutes,
                    "sla_met": sla_met,
                    "target_minutes": 120
                }

                logger.info(f"[telegram:approve] SLA: {response_time_minutes}m ({'✅ MET' if sla_met else '❌ MISSED'})")

        # Save updated draft
        draft_file.write_text(json.dumps(draft_data, indent=2))

        # Edit Telegram message with SLA info
        message_id = draft_data.get("telegram_message_id")
        if message_id:
            # Build SLA section if available
            sla_section = ""
            if response_time_minutes is not None and sla_met is not None:
                sla_icon = "✅" if sla_met else "⚠️"
                sla_section = f"\n{sla_icon} **Response Time:** {response_time_minutes}m (Target: <120m)"

            updated_text = f"""{status_icon} **Draft {status_text}**

**Client:** {draft_data['client']}
**Confidence:** {draft_data['confidence']}%

**Draft:**
```
{draft_data['draft_text'][:500]}{"..." if len(draft_data['draft_text']) > 500 else ""}
```

Draft ID: `{draft_id}`
Status: **{status_text}**{sla_section}
"""

            await bot.edit_message(message_id, updated_text)

        # Answer callback
        await bot.answer_callback(callback_id, f"Draft {status_text.lower()}")

        logger.info(f"[telegram:approve] Draft {draft_id} {status_text.lower()}")

        return {
            "status": draft_data["status"],
            "draft_id": draft_id
        }

    except Exception as e:
        logger.error(f"[telegram:approve] {e}", exc_info=True)
        await bot.answer_callback(callback_id, "Error processing approval")
        return {"status": "error", "draft_id": draft_id, "error": str(e)}
