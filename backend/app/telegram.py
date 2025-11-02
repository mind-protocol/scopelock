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
    confidence: int
) -> Optional[str]:
    """
    Send draft notification with approval buttons

    Args:
        draft_id: UUID of draft
        client: Client name
        draft_text: Draft response text
        confidence: Confidence score (0-100)

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

    # Store message_id in draft file
    if message_id:
        try:
            draft_file = settings.data_dir / "drafts" / f"{draft_id}.json"
            draft_file.parent.mkdir(parents=True, exist_ok=True)

            draft_data = {
                "id": draft_id,
                "client": client,
                "draft_text": draft_text,
                "confidence": confidence,
                "status": "pending",
                "telegram_message_id": message_id
            }

            draft_file.write_text(json.dumps(draft_data, indent=2))
            logger.info(f"[telegram:notify] Draft file created: {draft_file}")

        except Exception as e:
            logger.error(f"[telegram:notify] Failed to create draft file: {e}")

    return message_id


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

        # Update status
        if action == "approve":
            draft_data["status"] = "approved"
            status_icon = "✅"
            status_text = "Approved"
        elif action == "reject":
            draft_data["status"] = "rejected"
            status_icon = "❌"
            status_text = "Rejected"
        elif action == "edit":
            draft_data["status"] = "editing"
            status_icon = "✏️"
            status_text = "Editing"
        else:
            logger.warning(f"[telegram:approve] Unknown action: {action}")
            return {"status": "unknown_action", "draft_id": draft_id}

        # Save updated draft
        draft_file.write_text(json.dumps(draft_data, indent=2))

        # Edit Telegram message
        message_id = draft_data.get("telegram_message_id")
        if message_id:
            updated_text = f"""{status_icon} **Draft {status_text}**

**Client:** {draft_data['client']}
**Confidence:** {draft_data['confidence']}%

**Draft:**
```
{draft_data['draft_text'][:500]}{"..." if len(draft_data['draft_text']) > 500 else ""}
```

Draft ID: `{draft_id}`
Status: **{status_text}**
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
