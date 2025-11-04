"""
Webhook handlers for Gmail and Telegram

Core backend responsibility: receive webhooks, run Claude CLI, send Telegram.
"""

import logging
from datetime import datetime
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.auth import verify_webhook_signature
from app.runner import runner
from app.telegram import (
    send_draft_notification,
    handle_approval,
    send_proposal_notification,
    handle_proposal_action
)

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


class CloudMailinWebhook(BaseModel):
    """CloudMailin webhook payload (JSON Normalized format)"""
    envelope: dict
    headers: dict
    plain: str
    html: str | None = None


class VollnaWebhook(BaseModel):
    """
    Vollna webhook payload

    Vollna sends batches of jobs matching filters.
    Docs: https://docs.vollna.com/integrations/webhooks
    """
    total: int
    results_url: str | None = None
    filter: dict | None = None
    filters: list[dict] | None = None
    projects: list[dict]


# ============================================================================
# Endpoints
# ============================================================================

@router.post("/webhook/upwork")  # TODO: Re-enable signature verification after testing
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
        # Track received timestamp for SLA monitoring
        received_at = datetime.utcnow().isoformat()
        logger.info(f"[webhook:upwork] Received response from {request.client} at {received_at}")

        # Run Rafael via Claude CLI (pass received timestamp)
        result = runner.run_rafael(
            client=request.client,
            message=request.message,
            job_title=request.job_title,
            job_link=request.job_link,
            received_at=received_at  # For SLA tracking
        )

        if result["success"]:
            logger.info(f"[webhook:upwork] Rafael session completed")
            return {
                "status": "triggered",
                "citizen": "rafael",
                "received_at": received_at,
                "output": result["output"][:200]  # First 200 chars
            }
        else:
            logger.error(f"[webhook:upwork] Rafael session failed: {result['error']}")
            return {
                "status": "error",
                "citizen": "rafael",
                "received_at": received_at,
                "error": result["error"]
            }

    except Exception as e:
        logger.error(f"[webhook:upwork] {e}", exc_info=True)
        raise


@router.post("/api/webhooks/cloudmailin")
async def cloudmailin_webhook(request: Request):
    """
    Receive emails from CloudMailin and trigger Rafael for Upwork responses

    CloudMailin forwards Gmail emails as HTTP webhooks (JSON format).
    This endpoint parses the email and triggers the same flow as /webhook/upwork.

    Flow:
    1. Parse CloudMailin JSON (envelope, headers, plain text body)
    2. Filter: only process emails from @upwork.com with "New message from" in subject
    3. Extract client name from subject
    4. Run Rafael via Citizen Runner
    5. Rafael drafts response and calls /api/notify/draft

    Args:
        request: CloudMailin webhook (JSON Normalized format)

    Returns:
        {"status": "triggered"|"ignored", "reason": "..."}
    """
    try:
        # Parse CloudMailin JSON
        data = await request.json()

        # Extract email fields
        envelope = data.get("envelope", {})
        headers = data.get("headers", {})
        plain_body = data.get("plain", "")

        from_address = envelope.get("from", "")
        subject = headers.get("Subject", "")

        logger.info(f"[cloudmailin] Received email from: {from_address}, subject: {subject}")

        # Filter: only process Upwork emails
        if "@upwork.com" not in from_address.lower():
            logger.info(f"[cloudmailin] Ignored: not from Upwork ({from_address})")
            return {
                "status": "ignored",
                "reason": "not_from_upwork",
                "from": from_address
            }

        if "new message from" not in subject.lower():
            logger.info(f"[cloudmailin] Ignored: not a client response ({subject})")
            return {
                "status": "ignored",
                "reason": "not_client_message",
                "subject": subject
            }

        # Extract client name from subject
        # Format: "New message from John Doe on Upwork"
        client_name = subject.replace("New message from", "").replace("on Upwork", "").strip()

        # Extract job info from body (if available)
        # For MVP: use placeholders, Rafael can find job details
        job_title = "Upwork Job"
        job_link = "https://www.upwork.com/messages"

        # Track received timestamp for SLA monitoring
        received_at = datetime.utcnow().isoformat()

        logger.info(f"[cloudmailin] Parsed email from: {client_name}")

        # Run Rafael via Citizen Runner
        result = runner.run_rafael(
            client=client_name,
            message=plain_body[:500],  # First 500 chars
            job_title=job_title,
            job_link=job_link,
            received_at=received_at
        )

        if result["success"]:
            logger.info(f"[cloudmailin] Rafael session completed")
            return {
                "status": "triggered",
                "citizen": "rafael",
                "client": client_name,
                "received_at": received_at
            }
        else:
            logger.error(f"[cloudmailin] Rafael session failed: {result['error']}")
            return {
                "status": "error",
                "citizen": "rafael",
                "client": client_name,
                "error": result["error"]
            }

    except Exception as e:
        logger.error(f"[cloudmailin] {e}", exc_info=True)
        raise


@router.post("/webhook/telegram")
async def telegram_webhook(update: TelegramUpdate):
    """
    Handle Telegram callback queries (approval buttons)

    Flow:
    1. Parse callback_data → "approve:{draft_id}" or "proposal_approve:{proposal_id}"
    2. Route to appropriate handler (draft or proposal)
    3. Update status and edit Telegram message
    4. If proposal approved, trigger browser automation

    Args:
        update: Telegram update object

    Returns:
        {"status": str, "id": str}
    """
    try:
        if not update.callback_query:
            logger.warning("[webhook:telegram] No callback_query in update")
            return {"status": "ignored"}

        callback_data = update.callback_query.get("data", "")
        callback_id = update.callback_query.get("id")

        logger.info(f"[webhook:telegram] Callback: {callback_data}")

        # Parse action and ID
        if ":" not in callback_data:
            logger.warning(f"[webhook:telegram] Invalid callback_data: {callback_data}")
            return {"status": "invalid_format"}

        parts = callback_data.split(":", 1)
        action = parts[0]
        item_id = parts[1]

        # Route to appropriate handler
        if action.startswith("proposal_"):
            # Proposal actions: proposal_approve, proposal_edit, proposal_reject
            proposal_action = action.replace("proposal_", "")  # "approve", "edit", "reject"
            result = await handle_proposal_action(item_id, proposal_action, callback_id)
        else:
            # Draft actions: approve, edit, reject
            result = await handle_approval(item_id, action, callback_id)

        return result

    except Exception as e:
        logger.error(f"[webhook:telegram] {e}", exc_info=True)
        raise


@router.post("/api/notify/draft")
async def notify_draft(
    draft_id: str,
    client: str,
    draft_text: str,
    confidence: int,
    received_at: str = None  # Optional SLA tracking timestamp
):
    """
    Send Telegram notification with approval buttons

    Called by Rafael (via Bash tool) after creating draft file.

    Args:
        draft_id: UUID of draft
        client: Client name
        draft_text: Draft response text
        confidence: Confidence score (0-100)
        received_at: ISO timestamp when Gmail alert received (optional, for SLA)

    Returns:
        {"telegram_sent": true, "message_id": "..."}
    """
    try:
        logger.info(f"[notify:draft] Sending notification for draft {draft_id}")

        message_id = await send_draft_notification(
            draft_id=draft_id,
            client=client,
            draft_text=draft_text,
            confidence=confidence,
            received_at=received_at  # Pass SLA timestamp
        )

        return {
            "telegram_sent": True,
            "message_id": message_id
        }

    except Exception as e:
        logger.error(f"[notify:draft] {e}", exc_info=True)
        raise


@router.post("/api/notify/proposal")
async def notify_proposal(
    proposal_id: str,
    job_title: str,
    job_url: str,
    proposal_text: str,
    bid_amount: int,
    confidence: int,
    client_spent: float = 0,
    client_rating: float = 0,
    client_hires: int = 0,
    client_payment_verified: bool = False,
    client_country: str = "Unknown",
    client_rank: str = "Unknown"
):
    """
    Send Upwork proposal notification with approval buttons

    Called by Emma (via Bash tool) after evaluating a Vollna job as GO.

    Args:
        proposal_id: UUID of proposal
        job_title: Upwork job title
        job_url: Upwork job URL
        proposal_text: Emma's generated proposal
        bid_amount: Suggested bid amount
        confidence: Confidence score (0-100)
        client_*: Client details from Vollna

    Returns:
        {"telegram_sent": bool, "message_id": str}
    """
    try:
        logger.info(f"[notify:proposal] Sending notification for proposal {proposal_id}")

        client_info = {
            "total_spent": client_spent,
            "rating": client_rating,
            "total_hires": client_hires,
            "payment_method_verified": client_payment_verified,
            "country": {"name": client_country},
            "rank": client_rank
        }

        message_id = await send_proposal_notification(
            proposal_id=proposal_id,
            job_title=job_title,
            job_url=job_url,
            proposal_text=proposal_text,
            bid_amount=bid_amount,
            confidence=confidence,
            client_info=client_info
        )

        return {
            "telegram_sent": True,
            "message_id": message_id
        }

    except Exception as e:
        logger.error(f"[notify:proposal] {e}", exc_info=True)
        raise


@router.post("/webhook/vollna-job")
async def vollna_webhook(request: Request):
    """
    Receive Vollna job notifications and trigger Emma evaluation

    Vollna sends batches of jobs matching filters.
    Each job is evaluated by Emma citizen via Claude CLI.

    Flow:
    1. Verify webhook authentication (Basic Auth)
    2. Parse job batch from Vollna
    3. For each job: run Emma via Claude CLI
    4. Emma evaluates GO/NO-GO and calls /api/lead/track
    5. If GO: Emma drafts proposal and calls /api/notify/proposal

    Args:
        request: Vollna webhook payload

    Returns:
        {"received": true, "total": N, "processing": N}
    """
    try:
        logger.info(f"[vollna] Received webhook at {datetime.utcnow().isoformat()}")

        # Verify webhook authentication if configured
        from app.config import settings
        if settings.webhook_secret:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                logger.error("[vollna] Missing Authorization header")
                return JSONResponse(
                    status_code=401,
                    content={"error": "Unauthorized"}
                )

            # Vollna uses Basic Auth: "Basic base64(:password)"
            import base64
            expected_auth = f"Basic {base64.b64encode(f':{settings.webhook_secret}'.encode()).decode()}"
            if auth_header != expected_auth:
                logger.error("[vollna] Invalid webhook authentication")
                return JSONResponse(
                    status_code=401,
                    content={"error": "Unauthorized"}
                )

        # Parse payload
        data = await request.json()
        total = data.get('total', 0)
        projects = data.get('projects', [])

        logger.info(f"[vollna] Processing {len(projects)} projects (total: {total})")

        if not projects:
            logger.warning("[vollna] No projects in payload")
            return {"received": True, "processed": 0}

        # Process each project (async background task)
        # Respond quickly to avoid Vollna timeout
        import asyncio
        for project in projects:
            asyncio.create_task(process_vollna_project(project, data))

        return {
            "received": True,
            "total": total,
            "processing": len(projects)
        }

    except Exception as e:
        logger.error(f"[vollna] {e}", exc_info=True)
        # Return 200 to avoid Vollna auto-disable
        return {
            "received": True,
            "error": str(e)
        }


async def process_vollna_project(project: dict, payload: dict):
    """
    Process individual Vollna project (async background task)

    Args:
        project: Vollna project object
        payload: Full webhook payload (for feed info)
    """
    try:
        # Normalize project data
        job_id_match = project.get('url', '').split('~')
        job_id = job_id_match[-1] if len(job_id_match) > 1 else f"vollna_{datetime.utcnow().timestamp()}"

        # Extract clean Upwork URL
        import urllib.parse
        upwork_url = project.get('url', '')
        if 'url=' in upwork_url:
            upwork_url = urllib.parse.unquote(upwork_url.split('url=')[1].split('&')[0])

        # Feed name
        feed_name = (
            project.get('filters', [{}])[0].get('name') if project.get('filters')
            else payload.get('filter', {}).get('name')
            or 'Unknown Feed'
        )

        # Build job summary for Emma
        client_details = project.get('client_details', {})

        # Safely extract client details with proper None handling
        total_spent = client_details.get('total_spent') or 0
        rating = client_details.get('rating') or 0
        total_hires = client_details.get('total_hires') or 0
        payment_verified = client_details.get('payment_method_verified') or False
        country_name = (client_details.get('country') or {}).get('name', 'Unknown')
        rank = client_details.get('rank') or 'Unknown'

        job_summary = f"""
Title: {project.get('title', 'Unknown')}
Budget: {project.get('budget', 'Not specified')}
Budget Type: {project.get('budget_type', 'fixed')}

Description:
{project.get('description', '')}

Client:
- Total Spent: ${total_spent:,.2f}
- Rating: {rating}⭐
- Hires: {total_hires}
- Payment Verified: {payment_verified}
- Location: {country_name}
- Rank: {rank}

Feed: {feed_name}
Link: {upwork_url}

Skills: {', '.join(project.get('skills', []))}
"""

        logger.info(f"[vollna:project] Processing: {project.get('title', 'Unknown')[:50]}")

        # Run Emma evaluation
        result = runner.run_emma(job_summary)

        if result["success"]:
            logger.info(f"[vollna:project] Emma evaluation completed for {job_id}")
        else:
            logger.error(f"[vollna:project] Emma evaluation failed: {result['error']}")

    except Exception as e:
        logger.error(f"[vollna:project] Failed to process project: {e}", exc_info=True)
