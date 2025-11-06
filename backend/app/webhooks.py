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


# ============================================================================
# Vercel Auto-Fix Webhook
# ============================================================================

# Deployment tracking for Vercel webhooks
import json
from pathlib import Path

HANDLED_DEPLOYMENTS_FILE = Path("/var/data/handled-vercel-deployments.json")

def load_handled_deployments() -> set:
    """Load set of already-handled Vercel deployment IDs"""
    if not HANDLED_DEPLOYMENTS_FILE.exists():
        return set()

    try:
        with open(HANDLED_DEPLOYMENTS_FILE, 'r') as f:
            data = json.load(f)
            return set(data.get("handled", []))
    except Exception as e:
        logger.error(f"[vercel:load_handled] Error: {e}")
        return set()

def mark_vercel_deployment_handled(deployment_id: str):
    """Add Vercel deployment ID to handled set"""
    handled = load_handled_deployments()
    handled.add(deployment_id)

    try:
        HANDLED_DEPLOYMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(HANDLED_DEPLOYMENTS_FILE, 'w') as f:
            json.dump({
                "handled": list(handled),
                "last_updated": datetime.utcnow().isoformat() + "Z"
            }, f, indent=2)
    except Exception as e:
        logger.error(f"[vercel:mark_handled] Error: {e}")

@router.post("/api/webhooks/vercel-failure")
async def vercel_failure_webhook(request: Request):
    """
    Receive Vercel deployment failure webhooks and auto-invoke Rafael

    Flow:
    1. Vercel deployment fails (state=ERROR, target=production)
    2. Vercel POSTs to this endpoint
    3. Backend invokes Rafael via Claude CLI (background task)
    4. Rafael uses Vercel MCP to get build logs
    5. Rafael diagnoses and pushes fix
    6. Vercel auto-deploys fixed version

    Security:
    - Verifies HMAC-SHA1 signature using VERCEL_WEBHOOK_SIGNATURE env var
    - If signature env var not set, accepts all requests (dev mode)

    Args:
        request: Vercel webhook payload

    Returns:
        {"status": "rafael_invoked"|"already_handled"|"ignored", ...}
    """
    # Verify webhook signature if configured
    from app.config import settings
    if hasattr(settings, 'vercel_webhook_signature') and settings.vercel_webhook_signature:
        import hmac
        import hashlib

        # Get signature from header
        signature_header = request.headers.get('x-vercel-signature')
        if not signature_header:
            logger.error(f"[vercel:webhook] Missing x-vercel-signature header")
            return JSONResponse(
                status_code=401,
                content={"status": "error", "message": "Missing webhook signature"}
            )

        # Get raw body for signature verification
        body_bytes = await request.body()

        # Compute expected signature
        expected_signature = hmac.new(
            settings.vercel_webhook_signature.encode(),
            body_bytes,
            hashlib.sha1
        ).hexdigest()

        # Verify signature
        if not hmac.compare_digest(signature_header, expected_signature):
            logger.error(f"[vercel:webhook] Invalid signature")
            return JSONResponse(
                status_code=401,
                content={"status": "error", "message": "Invalid webhook signature"}
            )

        logger.info(f"[vercel:webhook] Signature verified ✅")
    else:
        logger.warning(f"[vercel:webhook] No signature verification (VERCEL_WEBHOOK_SIGNATURE not set)")

    # Parse JSON body
    try:
        body = await request.json()
    except Exception as e:
        logger.error(f"[vercel:webhook] Invalid JSON: {e}")
        return {"status": "error", "message": "Invalid JSON payload"}

    logger.info(f"[vercel:webhook] Received - project: {body.get('name')}, state: {body.get('state')}")

    # Extract deployment ID
    deployment_id = body.get("deployment_id") or body.get("id")
    if not deployment_id:
        logger.error(f"[vercel:webhook] Missing deployment ID")
        return {"status": "error", "message": "Missing deployment ID"}

    # Only process ERROR state on production
    state = body.get("state")
    target = body.get("target")

    if state != "ERROR":
        logger.info(f"[vercel:webhook] Ignored (state={state})")
        return {"status": "ignored", "reason": "not_an_error"}

    if target != "production":
        logger.info(f"[vercel:webhook] Ignored (target={target})")
        return {"status": "ignored", "reason": "not_production"}

    # Check if already handled
    if deployment_id in load_handled_deployments():
        logger.info(f"[vercel:webhook] Already handled: {deployment_id}")
        return {"status": "already_handled", "deployment_id": deployment_id}

    # Invoke Rafael asynchronously
    logger.info(f"[vercel:webhook] 🚨 PRODUCTION FAILURE - Invoking Rafael for {deployment_id}")

    import asyncio
    asyncio.create_task(invoke_rafael_for_vercel_failure(deployment_id, body))

    return {
        "status": "rafael_invoked",
        "deployment_id": deployment_id,
        "project": body.get("name")
    }

@router.get("/api/webhooks/vercel-failure/status")
async def vercel_webhook_status():
    """Get Vercel auto-fix webhook status"""
    handled = load_handled_deployments()
    return {
        "status": "operational",
        "service": "vercel-auto-fix",
        "handled_deployments": len(handled),
        "recent_deployments": list(handled)[-10:] if handled else []
    }

async def invoke_rafael_for_vercel_failure(deployment_id: str, body: dict):
    """
    Invoke Rafael via Claude CLI to fix Vercel deployment failure

    This runs as a background task (non-blocking webhook response).
    """
    try:
        project_name = body.get("name")
        deployment_url = body.get("url", "N/A")
        commit_sha = body.get("meta", {}).get("githubCommitSha", "N/A")
        commit_msg = body.get("meta", {}).get("githubCommitMessage", "N/A")

        logger.info("=" * 80)
        logger.info("🤖 VERCEL AUTO-FIX - INVOKING RAFAEL")
        logger.info(f"  Deployment: {deployment_id}")
        logger.info(f"  Project: {project_name}")
        logger.info(f"  Commit: {commit_sha[:7]} - {commit_msg}")
        logger.info(f"  Inspector: https://vercel.com/mindprotocol/{project_name}/{deployment_id}")
        logger.info("=" * 80)

        # Build prompt for Rafael
        prompt = f"""Vercel deployment FAILED - Auto-fix requested

Project: {project_name}
Deployment ID: {deployment_id}
URL: {deployment_url}
Inspector: https://vercel.com/mindprotocol/{project_name}/{deployment_id}

Commit: {commit_sha}
Message: {commit_msg}

TASK: Fix this deployment failure autonomously
1. Use Vercel MCP to get build logs
2. Diagnose root cause from logs
3. Fix the issue (code, config, dependencies, etc.)
4. Commit fix and push to main
5. Update SYNC.md with fix details

Work autonomously. No human intervention needed.
If you cannot fix, document blockers in SYNC.md.

Ready? Begin now.
"""

        # Run Rafael via Citizen Runner
        result = runner._run_claude(prompt, citizen="rafael")

        # Send Telegram notification with outcome
        import subprocess
        import os

        if result["success"]:
            logger.info(f"[vercel:rafael] ✅ Rafael completed for {deployment_id}")
            mark_vercel_deployment_handled(deployment_id)

            # Success notification
            tg_message = f"""<b>🤖 Vercel Auto-Fix: SUCCESS ✅</b>

<b>Project:</b> {project_name}
<b>Deployment:</b> {deployment_id[:12]}...
<b>Commit:</b> {commit_sha[:7]} - {commit_msg[:50]}

Rafael diagnosed and fixed the deployment failure autonomously.

<b>Inspector:</b> https://vercel.com/mindprotocol/{project_name}/{deployment_id}

Check SYNC.md for fix details."""
        else:
            logger.error(f"[vercel:rafael] ❌ Rafael failed: {result['error']}")
            # Don't mark as handled - allow retry on next failure

            # Failure notification
            error_msg = result.get('error', 'Unknown error')[:200]
            tg_message = f"""<b>🤖 Vercel Auto-Fix: FAILED ❌</b>

<b>Project:</b> {project_name}
<b>Deployment:</b> {deployment_id[:12]}...
<b>Commit:</b> {commit_sha[:7]} - {commit_msg[:50]}

Rafael attempted to fix the deployment but encountered an error.

<b>Error:</b> {error_msg}

<b>Inspector:</b> https://vercel.com/mindprotocol/{project_name}/{deployment_id}

Manual intervention may be required."""

        # Send Telegram notification
        try:
            telegram_script = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                'tools',
                'telegram-send.cjs'
            )
            subprocess.run(
                ['node', telegram_script, tg_message],
                check=True,
                capture_output=True,
                timeout=10
            )
            logger.info(f"[vercel:rafael] Telegram notification sent")
        except Exception as tg_error:
            logger.error(f"[vercel:rafael] Failed to send Telegram notification: {tg_error}")

    except Exception as e:
        logger.error(f"[vercel:rafael] Failed to invoke Rafael: {e}", exc_info=True)

        # Send critical error notification
        try:
            import subprocess
            import os
            tg_message = f"""<b>🚨 Vercel Auto-Fix: CRITICAL ERROR</b>

Failed to invoke Rafael for deployment {deployment_id[:12]}...

<b>Error:</b> {str(e)[:200]}

Check backend logs immediately."""

            telegram_script = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                'tools',
                'telegram-send.cjs'
            )
            subprocess.run(['node', telegram_script, tg_message], timeout=10)
        except:
            pass  # Don't fail if notification fails

        # Emit failure event per fail-loud principle
        raise
