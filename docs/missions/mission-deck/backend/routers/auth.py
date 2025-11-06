"""
Auth Router for Mission Deck

Handles authentication endpoints (login, logout).

Week 1 MVP: Hardcoded test users for development
Week 2: Integrate with FalkorDB U4_Agent nodes for real user auth
"""

from fastapi import APIRouter, HTTPException, status
from auth import create_access_token, hash_password, verify_password
from schemas import LoginRequest, LoginResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ============================================================================
# Week 1 MVP: Hardcoded Test Users
# ============================================================================
# TODO Week 2: Replace with FalkorDB query for real user authentication

# Hardcoded users for testing (password: "testpass" for all)
TEST_USERS = {
    "person1@scopelock.ai": {
        "id": "bigbosexf",
        "email": "person1@scopelock.ai",
        "name": "Person 1",
        "password_hash": hash_password("testpass")
    },
    "person2@scopelock.ai": {
        "id": "kara",
        "email": "person2@scopelock.ai",
        "name": "Person 2",
        "password_hash": hash_password("testpass")
    },
    "person3@scopelock.ai": {
        "id": "reanance",
        "email": "person3@scopelock.ai",
        "name": "Person 3",
        "password_hash": hash_password("testpass")
    }
}


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    User login endpoint.

    Week 1 MVP: Hardcoded test users
    Week 2: Query FalkorDB for real user authentication

    Args:
        request: LoginRequest with email and password

    Returns:
        LoginResponse with JWT token and user info

    Raises:
        HTTPException 401: If credentials are invalid

    Example:
        POST /api/auth/login
        {
            "email": "person1@scopelock.ai",
            "password": "testpass"
        }

        Response:
        {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer",
            "user": {
                "id": "bigbosexf",
                "email": "person1@scopelock.ai",
                "name": "Person 1"
            }
        }
    """
    # Week 1 MVP: Check hardcoded users
    user = TEST_USERS.get(request.email)

    if not user:
        # User not found
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT token
    try:
        access_token = create_access_token(
            user_id=user["id"],
            email=user["email"]
        )
    except Exception as e:
        # Token creation failed - fail loud
        print(f"[routers/auth.py:login] Token creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create authentication token"
        )

    # Return token + user info
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"]
        )
    )


@router.post("/logout")
async def logout():
    """
    User logout endpoint.

    Week 1 MVP: No-op (JWT tokens are stateless)
    Week 2: Implement token blacklist if needed

    Returns:
        Success message

    Example:
        POST /api/auth/logout
        Authorization: Bearer <token>

        Response:
        {
            "message": "Logged out successfully"
        }
    """
    return {"message": "Logged out successfully"}


# ============================================================================
# Week 2 Implementation Notes
# ============================================================================
# Replace TEST_USERS with FalkorDB query:
#
# def get_user_by_email(email: str) -> Optional[Dict]:
#     cypher = """
#     MATCH (user:U4_Agent {scope_ref: 'scopelock'})
#     WHERE user.email = $email
#       AND user.agent_type = 'human'
#       AND user.status = 'active'
#     RETURN user
#     """
#     results = query_graph(cypher, {"email": email})
#     return results[0]["user"] if results else None
#
# Then in login endpoint:
#     user = get_user_by_email(request.email)
#     if not user:
#         raise HTTPException(401, "Invalid credentials")
#
#     # Verify password against user.password_hash from graph
#     if not verify_password(request.password, user["password_hash"]):
#         raise HTTPException(401, "Invalid credentials")
#
#     # Continue with token creation...
