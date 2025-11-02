"""
Webhook authentication using HMAC signatures

Implements R-AUTH-100: All webhooks must verify HMAC-SHA256 signatures.
"""

import hmac
import hashlib
import logging
from fastapi import Header, HTTPException, Request

from app.config import settings

logger = logging.getLogger(__name__)


async def verify_webhook_signature(
    request: Request,
    x_webhook_signature: str = Header(..., alias="X-Webhook-Signature")
) -> bool:
    """
    Verify HMAC-SHA256 webhook signature

    Args:
        request: FastAPI request object
        x_webhook_signature: Signature from webhook header

    Returns:
        True if signature is valid

    Raises:
        HTTPException: 401 if signature is invalid

    Usage:
        @app.post("/webhook/upwork", dependencies=[Depends(verify_webhook_signature)])
        async def upwork_webhook(data: dict):
            ...
    """
    # Get raw request body
    body = await request.body()

    # Compute expected signature
    secret = settings.webhook_secret.encode()
    expected = hmac.new(secret, body, hashlib.sha256).hexdigest()

    # Compare signatures (constant-time comparison to prevent timing attacks)
    if not hmac.compare_digest(x_webhook_signature, expected):
        logger.warning(f"[auth:verify_webhook] Invalid signature from {request.client.host}")
        raise HTTPException(
            status_code=401,
            detail="Invalid webhook signature"
        )

    logger.info(f"[auth:verify_webhook] Valid signature from {request.client.host}")
    return True


def generate_webhook_signature(payload: str) -> str:
    """
    Generate HMAC-SHA256 signature for outgoing webhooks

    Args:
        payload: JSON string to sign

    Returns:
        Hex-encoded signature

    Usage:
        import json
        payload = json.dumps({"event": "draft.created"})
        signature = generate_webhook_signature(payload)
        headers = {"X-Webhook-Signature": signature}
    """
    secret = settings.webhook_secret.encode()
    signature = hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()
    return signature
