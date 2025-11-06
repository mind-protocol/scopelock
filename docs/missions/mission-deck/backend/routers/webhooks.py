"""
Webhooks Router - Vercel Auto-Fix Integration

Receives Vercel deployment failure webhooks and auto-invokes Rafael via Claude CLI.

Architecture:
- Endpoint: POST /api/webhooks/vercel-failure
- When Vercel deployment fails, webhook POSTs here
- System invokes Rafael autonomously to diagnose and fix
- Duplicate prevention via tracked deployment IDs

Design:
- Background tasks for async Claude CLI invocation
- No authentication (public webhook endpoint)
- Fail-loud if invocation errors
"""

import os
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
from fastapi import APIRouter, BackgroundTasks, Request
from pydantic import BaseModel

router = APIRouter(prefix="/api/webhooks", tags=["Webhooks"])

# ============================================================================
# Configuration
# ============================================================================

# File to track handled deployment IDs (prevent duplicates)
HANDLED_DEPLOYMENTS_FILE = Path(__file__).parent.parent / "handled-deployments.json"

# Rafael's working directory
RAFAEL_DIR = "/home/mind-protocol/scopelock/citizens/rafael"

# ============================================================================
# Pydantic Models
# ============================================================================

class VercelWebhookPayload(BaseModel):
    """
    Vercel webhook payload structure.

    Vercel sends this JSON when deployments succeed/fail.
    We only care about ERROR state on production target.
    """
    id: str | None = None
    deployment_id: str | None = None
    name: str
    url: str | None = None
    state: str  # READY, ERROR, etc.
    target: str | None = None  # production, preview
    type: str | None = None
    meta: Dict[str, Any] | None = None

# ============================================================================
# Deployment Tracking
# ============================================================================

def load_handled_deployments() -> set:
    """Load set of already-handled deployment IDs from JSON file."""
    if not HANDLED_DEPLOYMENTS_FILE.exists():
        return set()

    try:
        with open(HANDLED_DEPLOYMENTS_FILE, 'r') as f:
            data = json.load(f)
            return set(data.get("handled", []))
    except Exception as e:
        print(f"[webhooks.py:load_handled_deployments] Error loading: {e}")
        return set()


def mark_deployment_handled(deployment_id: str):
    """Add deployment ID to handled set and persist to JSON."""
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
        print(f"[webhooks.py:mark_deployment_handled] Error saving: {e}")


def is_deployment_handled(deployment_id: str) -> bool:
    """Check if deployment has already been handled."""
    handled = load_handled_deployments()
    return deployment_id in handled

# ============================================================================
# Rafael Invocation
# ============================================================================

def invoke_rafael_autonomous(deployment: Dict[str, Any]):
    """
    Invoke Rafael via Claude CLI to fix deployment failure.

    This runs asynchronously in background task.
    Rafael will:
    1. Use Vercel MCP to get build logs
    2. Diagnose root cause
    3. Fix the issue (edit code, update config, etc.)
    4. Push fix to main branch
    5. Update SYNC.md with fix details

    Args:
        deployment: Dict with deployment details (id, name, url, meta)
    """
    deployment_id = deployment.get("id")
    project_name = deployment.get("name")
    deployment_url = deployment.get("url", "N/A")
    commit_sha = deployment.get("meta", {}).get("githubCommitSha", "N/A")
    commit_msg = deployment.get("meta", {}).get("githubCommitMessage", "N/A")

    print("\n" + "=" * 80)
    print("🤖 VERCEL AUTO-FIX - INVOKING RAFAEL")
    print("=" * 80)
    print(f"  Deployment ID: {deployment_id}")
    print(f"  Project: {project_name}")
    print(f"  URL: {deployment_url}")
    print(f"  Commit: {commit_sha[:7]} - {commit_msg}")
    print(f"  Inspector: https://vercel.com/mindprotocol/{project_name}/{deployment_id}")
    print("=" * 80 + "\n")

    # Construct prompt for Rafael
    prompt = f"""Vercel deployment FAILED - Auto-fix requested

Project: {project_name}
Deployment ID: {deployment_id}
URL: {deployment_url}
Inspector: https://vercel.com/mindprotocol/{project_name}/{deployment_id}

Commit: {commit_sha}
Message: {commit_msg}

TASK: Fix this deployment failure autonomously
1. Use Vercel MCP to get build logs: mcp__vercel__get_deployment_build_logs
2. Diagnose root cause from logs
3. Fix the issue (code, config, dependencies, etc.)
4. Commit fix: git add . && git commit -m "fix: resolve Vercel deployment failure"
5. Push to main: git push origin main
6. Update SYNC.md with fix details

Work autonomously. No human intervention needed.
If you cannot fix, document blockers in SYNC.md and emit failure event.

Ready? Begin now.
"""

    # Escape quotes for shell command
    escaped_prompt = prompt.replace('"', '\\"').replace('$', '\\$')

    # Claude CLI invocation command
    # - cd to Rafael's directory (has CLAUDE.md system prompt)
    # - Use --continue (no interactive approval)
    # - Use --dangerously-skip-permissions (autonomous operation)
    claude_cmd = f'''cd {RAFAEL_DIR} && claude -p "{escaped_prompt}" --continue --dangerously-skip-permissions'''

    try:
        # Run Claude CLI as subprocess
        # - shell=True to enable cd command
        # - capture_output=True to get stdout/stderr
        # - text=True for string output
        # - timeout=600 (10 minutes max)
        result = subprocess.run(
            claude_cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=600
        )

        print("\n" + "=" * 80)
        print("✅ RAFAEL COMPLETED")
        print("=" * 80)
        print("STDOUT:")
        print(result.stdout)

        if result.stderr:
            print("\nSTDERR:")
            print(result.stderr)

        print("\nReturn Code:", result.returncode)
        print("=" * 80 + "\n")

        # Mark deployment as handled
        mark_deployment_handled(deployment_id)

    except subprocess.TimeoutExpired:
        print(f"❌ RAFAEL TIMEOUT: Exceeded 10 minutes for deployment {deployment_id}")
        print("   Rafael may still be running in background.")
        # Still mark as handled to prevent duplicate invocation
        mark_deployment_handled(deployment_id)

    except Exception as e:
        print(f"❌ ERROR INVOKING RAFAEL: {e}")
        print(f"   Deployment: {deployment_id}")
        print(f"   Command: {claude_cmd}")
        # Don't mark as handled - allow retry on next failure
        # Emit failure event per ScopeLock fail-loud principle
        raise RuntimeError(f"Failed to invoke Rafael for deployment {deployment_id}: {e}")

# ============================================================================
# Webhook Endpoints
# ============================================================================

@router.post("/vercel-failure")
async def vercel_failure_webhook(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Receive Vercel deployment failure webhooks.

    Vercel POSTs here when deployments fail.
    If deployment is ERROR state on production target:
    1. Check if already handled (prevent duplicates)
    2. Invoke Rafael asynchronously via Claude CLI
    3. Return immediate response (don't block webhook)

    Returns:
        - rafael_invoked: Invocation triggered successfully
        - already_handled: Deployment already processed (duplicate)
        - ignored: Not an error or not production
    """
    # Parse JSON body
    try:
        body = await request.json()
    except Exception as e:
        print(f"[webhooks.py:vercel_failure_webhook] Invalid JSON: {e}")
        return {
            "status": "error",
            "message": "Invalid JSON payload"
        }

    # Log webhook receipt
    print(f"\n[{datetime.utcnow().isoformat()}Z] Webhook received")
    print(f"  Project: {body.get('name', 'N/A')}")
    print(f"  State: {body.get('state', 'N/A')}")
    print(f"  Target: {body.get('target', 'N/A')}")
    print(f"  Type: {body.get('type', 'N/A')}")

    # Extract deployment ID (Vercel sends either 'id' or 'deployment_id')
    deployment_id = body.get("deployment_id") or body.get("id")

    if not deployment_id:
        print("  ❌ No deployment ID in webhook payload")
        return {
            "status": "error",
            "message": "Missing deployment ID"
        }

    # Only process ERROR state on production target
    state = body.get("state")
    target = body.get("target")

    if state != "ERROR":
        print(f"  ✅ Non-failure deployment (state: {state})")
        return {
            "status": "ignored",
            "reason": "not_an_error",
            "state": state
        }

    if target != "production":
        print(f"  ✅ Non-production deployment (target: {target})")
        return {
            "status": "ignored",
            "reason": "not_production",
            "target": target
        }

    # Check if already handled (prevent duplicates)
    if is_deployment_handled(deployment_id):
        print(f"  ⏭️  Already handled deployment: {deployment_id}")
        return {
            "status": "already_handled",
            "deployment_id": deployment_id,
            "message": "This deployment has already been processed"
        }

    # Invoke Rafael asynchronously (background task)
    print(f"  🚨 PRODUCTION DEPLOYMENT FAILURE DETECTED")
    print(f"  🤖 Invoking Rafael for deployment: {deployment_id}")

    background_tasks.add_task(
        invoke_rafael_autonomous,
        {
            "id": deployment_id,
            "name": body.get("name"),
            "url": body.get("url"),
            "meta": body.get("meta", {})
        }
    )

    return {
        "status": "rafael_invoked",
        "deployment_id": deployment_id,
        "project": body.get("name"),
        "message": "Rafael is now investigating and fixing the deployment failure"
    }


@router.get("/vercel-failure/status")
async def webhook_status():
    """
    Get webhook system status.

    Returns:
        - Total deployments handled
        - List of handled deployment IDs
        - System health
    """
    handled = load_handled_deployments()

    return {
        "status": "operational",
        "service": "vercel-auto-fix",
        "handled_deployments": len(handled),
        "recent_deployments": list(handled)[-10:] if handled else [],  # Last 10
        "rafael_directory": RAFAEL_DIR,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
