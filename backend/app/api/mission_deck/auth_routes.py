"""
Mission Deck Authentication Routes

Provides login endpoints for Mission Deck:
- POST /api/auth/wallet-login: Solana wallet authentication
- POST /api/auth/logout: Logout (clears session)

Architecture:
- Verifies Solana wallet signature
- Returns JWT token for subsequent requests
- Fail-loud on verification errors
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.api.mission_deck.schemas import LoginResponse, UserInfo
from app.api.mission_deck.auth import create_access_token
import base58
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

router = APIRouter(prefix="/api/auth", tags=["Mission Deck Auth"])


class WalletLoginRequest(BaseModel):
    """Solana wallet login request"""

    wallet_address: str
    signature: str  # Base58 encoded signature
    message: str  # Original message that was signed


@router.post("/wallet-login", response_model=LoginResponse)
async def wallet_login(request: WalletLoginRequest):
    """
    Authenticate user with Solana wallet signature.

    Process:
    1. Decode wallet address and signature from base58
    2. Verify signature matches message
    3. Generate JWT token for authenticated user
    4. Return token + user info

    Args:
        request: WalletLoginRequest with wallet_address, signature, message

    Returns:
        LoginResponse with access_token and user info

    Raises:
        HTTPException 401: If signature verification fails
        HTTPException 500: If token generation fails
    """
    try:
        # Decode wallet address (Solana public key) from base58
        try:
            wallet_pubkey_bytes = base58.b58decode(request.wallet_address)
        except Exception as e:
            print(
                f"[auth_routes.py:wallet_login] Invalid wallet address format: {e}"
            )
            raise HTTPException(
                status_code=401, detail="Invalid wallet address format"
            )

        # Decode signature from base58
        try:
            signature_bytes = base58.b58decode(request.signature)
        except Exception as e:
            print(f"[auth_routes.py:wallet_login] Invalid signature format: {e}")
            raise HTTPException(status_code=401, detail="Invalid signature format")

        # Encode message to bytes (must match what was signed)
        message_bytes = request.message.encode("utf-8")

        # Verify signature using Solana's Ed25519
        try:
            verify_key = VerifyKey(wallet_pubkey_bytes)
            verify_key.verify(message_bytes, signature_bytes)
        except BadSignatureError:
            print("[auth_routes.py:wallet_login] Signature verification failed")
            raise HTTPException(
                status_code=401, detail="Invalid signature - verification failed"
            )
        except Exception as e:
            print(f"[auth_routes.py:wallet_login] Signature verification error: {e}")
            raise HTTPException(
                status_code=401,
                detail="Signature verification error",
            )

        # Signature valid → create JWT token
        # Use wallet address as user_id (unique identifier)
        try:
            access_token = create_access_token(
                user_id=request.wallet_address,
                email=f"{request.wallet_address}@wallet",  # Pseudo-email for JWT
            )
        except Exception as e:
            print(f"[auth_routes.py:wallet_login] Token creation failed: {e}")
            raise HTTPException(
                status_code=500, detail="Failed to create authentication token"
            )

        # Return login response
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserInfo(
                id=request.wallet_address,
                email=f"{request.wallet_address}@wallet",
                name=f"{request.wallet_address[:4]}...{request.wallet_address[-4:]}",
            ),
        )

    except HTTPException:
        # Re-raise HTTP exceptions (already handled above)
        raise
    except Exception as e:
        # Unexpected error → fail loud
        print(f"[auth_routes.py:wallet_login] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")


@router.post("/logout")
async def logout():
    """
    Logout endpoint (token-based auth is stateless, so just returns success).

    Frontend should clear stored token after calling this endpoint.

    Returns:
        Success message
    """
    return {"message": "Logged out successfully"}
