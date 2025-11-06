"""
Missions Router for Mission Deck

Handles mission-related endpoints (list, get, update notes).

Architecture:
- All endpoints require authentication (JWT)
- Users can only access their assigned missions
- Mission data from FalkorDB (U4_Work_Item nodes)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime

from dependencies import get_current_user, get_current_user_mission, CurrentUser
from services.graph import get_user_missions, query_graph
from schemas import (
    MissionResponse,
    MissionListResponse,
    MissionStackResponse,
    MissionNotesRequest
)

router = APIRouter(prefix="/api/missions", tags=["Missions"])


def format_mission_response(mission_node: dict) -> MissionResponse:
    """
    Convert FalkorDB mission node to MissionResponse schema.

    Args:
        mission_node: U4_Work_Item node from FalkorDB

    Returns:
        MissionResponse with formatted data
    """
    # Extract budget (convert cents to dollars)
    budget_cents = mission_node.get("budget_cents", 0)
    budget_dollars = budget_cents / 100.0

    # Build stack response
    stack = MissionStackResponse(
        backend=mission_node.get("stack_backend"),
        frontend=mission_node.get("stack_frontend"),
        deploy_backend=mission_node.get("stack_deploy_backend"),
        deploy_frontend=mission_node.get("stack_deploy_frontend"),
        database=mission_node.get("stack_database")
    )

    # Format dates
    deadline = mission_node.get("due_date")
    if isinstance(deadline, str):
        deadline = datetime.fromisoformat(deadline.replace("Z", "+00:00"))

    created_at = mission_node.get("created_at")
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))

    return MissionResponse(
        id=mission_node.get("slug"),
        title=mission_node.get("name", "Untitled Mission"),
        client=mission_node.get("client_name", "Unknown Client"),
        budget=budget_dollars,
        deadline=deadline or datetime.utcnow(),
        status=mission_node.get("state", "unknown"),
        assigned_to=mission_node.get("assignee_ref", "unknown"),
        stack=stack,
        notes=mission_node.get("notes"),
        created_at=created_at or datetime.utcnow()
    )


@router.get("", response_model=MissionListResponse)
async def list_missions(current_user: CurrentUser = Depends(get_current_user)):
    """
    List all missions for authenticated user.

    Args:
        current_user: Authenticated user (injected dependency)

    Returns:
        MissionListResponse with list of missions

    Example:
        GET /api/missions
        Authorization: Bearer <token>

        Response:
        {
            "missions": [
                {
                    "id": "mission-47-telegram-bot",
                    "title": "Telegram Notifier",
                    "client": "Acme Corp",
                    "budget": 300.0,
                    "deadline": "2025-11-08T23:59:59Z",
                    "status": "active",
                    "assigned_to": "bigbosexf",
                    ...
                }
            ],
            "total": 1
        }
    """
    try:
        # Get missions from FalkorDB
        missions = get_user_missions(current_user.slug)

        # Format responses
        formatted_missions = [format_mission_response(m) for m in missions]

        return MissionListResponse(
            missions=formatted_missions,
            total=len(formatted_missions)
        )

    except Exception as e:
        # Fail loud
        print(f"[routers/missions.py:list_missions] Error fetching missions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch missions"
        )


@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(
    mission_id: str,
    mission: dict = Depends(get_current_user_mission)
):
    """
    Get single mission details.

    Args:
        mission_id: Mission slug (from URL)
        mission: Mission node (injected dependency, includes auth check)

    Returns:
        MissionResponse with mission details

    Raises:
        HTTPException 404: If mission not found
        HTTPException 403: If user not authorized

    Example:
        GET /api/missions/mission-47-telegram-bot
        Authorization: Bearer <token>

        Response:
        {
            "id": "mission-47-telegram-bot",
            "title": "Telegram Notifier",
            ...
        }
    """
    try:
        return format_mission_response(mission)
    except Exception as e:
        # Fail loud
        print(f"[routers/missions.py:get_mission] Error formatting mission: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to format mission data"
        )


@router.patch("/{mission_id}/notes")
async def update_mission_notes(
    mission_id: str,
    request: MissionNotesRequest,
    mission: dict = Depends(get_current_user_mission)
):
    """
    Update mission developer notes.

    Args:
        mission_id: Mission slug (from URL)
        request: MissionNotesRequest with notes text
        mission: Mission node (injected dependency, includes auth check)

    Returns:
        Success response with updated notes

    Raises:
        HTTPException 404: If mission not found
        HTTPException 403: If user not authorized

    Example:
        PATCH /api/missions/mission-47-telegram-bot/notes
        Authorization: Bearer <token>
        {
            "notes": "Client prefers inline buttons."
        }

        Response:
        {
            "mission_id": "mission-47-telegram-bot",
            "notes": "Client prefers inline buttons.",
            "updated_at": "2025-11-05T15:30:00Z"
        }
    """
    try:
        # Update notes in FalkorDB
        cypher = """
        MATCH (m:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
        SET m.notes = $notes,
            m.updated_at = datetime()
        RETURN m.updated_at as updated_at
        """

        results = query_graph(cypher, {
            "slug": mission_id,
            "notes": request.notes
        })

        if not results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mission not found"
            )

        updated_at = results[0].get("updated_at")
        if isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))

        return {
            "mission_id": mission_id,
            "notes": request.notes,
            "updated_at": updated_at or datetime.utcnow()
        }

    except HTTPException:
        raise  # Re-raise HTTP exceptions

    except Exception as e:
        # Fail loud
        print(f"[routers/missions.py:update_mission_notes] Error updating notes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mission notes"
        )
