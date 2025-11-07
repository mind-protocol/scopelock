"""
FastAPI Dependencies for Mission Deck

Provides reusable dependencies for authentication and authorization.

Dependencies:
- get_current_user: Extracts and validates JWT from Authorization header
- get_current_user_mission: Verifies user has access to requested mission
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from jose import JWTError
from typing import Dict

from app.api.mission_deck.auth import decode_access_token
from app.api.mission_deck.services.graph import get_mission_by_slug

# HTTP Bearer security scheme (Authorization: Bearer <token>)
security = HTTPBearer()


class CurrentUser:
    """
    Represents the authenticated current user.

    Attributes:
        user_id: User's unique identifier (slug)
        email: User's email address
    """
    def __init__(self, user_id: str, email: str):
        self.user_id = user_id
        self.email = email
        self.slug = user_id  # Alias for compatibility with graph queries


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    """
    FastAPI dependency to get current authenticated user from JWT.

    Args:
        credentials: HTTP Bearer credentials from Authorization header

    Returns:
        CurrentUser instance

    Raises:
        HTTPException 401: If token is missing, invalid, or expired

    Usage:
        @app.get("/api/protected")
        def protected_route(current_user: CurrentUser = Depends(get_current_user)):
            return {"user_id": current_user.user_id}
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token = credentials.credentials
        payload = decode_access_token(token)

        user_id: str = payload.get("sub")
        email: str = payload.get("email")

        if user_id is None or email is None:
            raise credentials_exception

        return CurrentUser(user_id=user_id, email=email)

    except JWTError as e:
        # Token invalid or expired
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_mission(
    mission_id: str,
    current_user: CurrentUser = Depends(get_current_user)
) -> Dict:
    """
    FastAPI dependency to get mission and verify user has access.

    Authorization rules:
    - Missions (work_type='mission'): Allow any authenticated user to access unclaimed missions,
      or allow access to claimed missions only if claimedBy matches current user
    - Jobs (work_type='job'): Check assignee_ref matches current user (if implemented)

    Args:
        mission_id: Mission slug from URL parameter
        current_user: Current authenticated user (injected dependency)

    Returns:
        Mission node dict from FalkorDB

    Raises:
        HTTPException 404: If mission not found
        HTTPException 403: If user is not authorized to access this mission

    Usage:
        @app.get("/api/missions/{mission_id}")
        def get_mission(
            mission_id: str,
            mission: Dict = Depends(get_current_user_mission)
        ):
            return mission
    """
    # Query mission from FalkorDB
    mission = get_mission_by_slug(mission_id)

    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission not found: {mission_id}"
        )

    # Check work_type to determine authorization model
    work_type = mission.get("work_type")

    if work_type == "mission":
        # MISSIONS: Allow access to unclaimed missions, or claimed by current user
        claimed_by = mission.get("claimedBy")

        if claimed_by is None:
            # Unclaimed mission - any authenticated user can access
            return mission
        elif claimed_by == current_user.slug:
            # Claimed by current user - allow access
            return mission
        else:
            # Claimed by someone else - deny access
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Mission is claimed by another user: {claimed_by}"
            )

    elif work_type == "job":
        # JOBS: Check assignee_ref (for future job implementation)
        if mission.get("assignee_ref") != current_user.slug:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this job"
            )
        return mission

    else:
        # Unknown work_type or missing - for backwards compatibility, allow access
        # (This handles any legacy data without work_type field)
        return mission
