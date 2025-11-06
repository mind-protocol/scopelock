"""
JWT Authentication for Mission Deck

Provides JWT token generation and validation for secure API access.

Architecture:
- HS256 algorithm (symmetric key)
- 7-day token expiration
- bcrypt password hashing
- Fail-loud on errors
"""

import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is required")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password string

    Example:
        hashed = hash_password("securepassword123")
    """
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain: Plain text password to verify
        hashed: Hashed password from database

    Returns:
        True if password matches, False otherwise

    Example:
        is_valid = verify_password("userInput", stored_hash)
    """
    try:
        return pwd_context.verify(plain, hashed)
    except Exception as e:
        # Fail loud - log error but don't crash
        print(f"[auth.py:verify_password] Password verification error: {e}")
        return False


def create_access_token(user_id: str, email: str) -> str:
    """
    Create a JWT access token.

    Args:
        user_id: User's unique identifier (slug)
        email: User's email address

    Returns:
        JWT token string

    Raises:
        Exception: If token creation fails

    Example:
        token = create_access_token("bigbosexf", "person1@scopelock.ai")
    """
    if not user_id or not email:
        raise ValueError("user_id and email are required")

    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    payload = {
        "sub": str(user_id),  # Subject (user identifier)
        "email": email,
        "exp": expire,  # Expiration time
        "iat": datetime.utcnow(),  # Issued at
    }

    try:
        token = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)
        return token
    except Exception as e:
        # Fail loud
        print(f"[auth.py:create_access_token] Token creation failed: {e}")
        raise Exception("Failed to create authentication token")


def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT access token.

    Args:
        token: JWT token string

    Returns:
        Decoded payload dict with 'sub' (user_id) and 'email'

    Raises:
        JWTError: If token is invalid, expired, or malformed

    Example:
        try:
            payload = decode_access_token(token)
            user_id = payload["sub"]
            email = payload["email"]
        except JWTError:
            # Token is invalid
    """
    if not token:
        raise JWTError("Token is required")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])

        # Verify required fields
        if "sub" not in payload or "email" not in payload:
            raise JWTError("Invalid token payload")

        return payload

    except jwt.ExpiredSignatureError:
        # Token expired - specific error for client handling
        raise JWTError("Token has expired")

    except jwt.JWTClaimsError:
        # Token claims invalid
        raise JWTError("Invalid token claims")

    except Exception as e:
        # Any other JWT error - fail loud
        print(f"[auth.py:decode_access_token] Token decode error: {e}")
        raise JWTError("Invalid token")
