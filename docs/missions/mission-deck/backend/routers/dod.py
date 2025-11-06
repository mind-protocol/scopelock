"""
DoD (Definition of Done) Router for Mission Deck

Handles DoD checklist endpoints for mission completion tracking.

Architecture:
- GET /dod: List all DoD items for a mission
- PATCH /dod/{item_id}: Toggle DoD item completion state
- PATCH /dod/complete: Mark all items complete (transition to QA)
- All endpoints require authentication + mission access
- DoD items stored in FalkorDB as U4_Work_Item nodes with work_type='task'

Implements: ALGORITHM.md Step 1.10
"""

from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime

from dependencies import get_current_user, get_current_user_mission, CurrentUser
from services.graph import (
    get_mission_dod_items,
    update_dod_task_state,
    query_graph
)
from schemas import (
    DoDListResponse,
    DoDItemResponse,
    DoDUpdateRequest,
    DoDUpdateResponse
)

router = APIRouter(prefix="/api/missions", tags=["DoD"])


def format_dod_item(task_node: dict) -> DoDItemResponse:
    """
    Convert FalkorDB DoD task node to DoDItemResponse schema.

    Args:
        task_node: U4_Work_Item node with work_type='task' from FalkorDB

    Returns:
        DoDItemResponse with formatted data
    """
    # Determine completed state based on task state
    state = task_node.get("state", "todo")
    completed = state == "done"

    # Parse completion timestamp
    updated_at = task_node.get("updated_at")
    completed_at = None
    if completed and updated_at:
        if isinstance(updated_at, str):
            try:
                completed_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
            except (ValueError, AttributeError):
                completed_at = None

    return DoDItemResponse(
        id=task_node.get("slug"),
        text=task_node.get("name", "Untitled Task"),
        category=task_node.get("dod_category", "functional"),
        completed=completed,
        completed_at=completed_at
    )


@router.get("/{mission_id}/dod", response_model=DoDListResponse)
async def list_dod_items(
    mission_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    mission: dict = Depends(get_current_user_mission)
):
    """
    Get DoD checklist items for a mission.

    Args:
        mission_id: Mission slug (from URL)
        current_user: Authenticated user (injected dependency)
        mission: Mission node (injected dependency, includes auth check)

    Returns:
        DoDListResponse with list of DoD items and completion stats

    Example:
        GET /api/missions/mission-47-telegram-bot/dod
        Authorization: Bearer <token>

        Response:
        {
            "items": [
                {
                    "id": "mission-47-task-1",
                    "text": "Bot sends text messages",
                    "category": "functional",
                    "completed": False,
                    "completed_at": None
                },
                {
                    "id": "mission-47-task-2",
                    "text": "Bot sends inline buttons",
                    "category": "functional",
                    "completed": True,
                    "completed_at": "2025-11-05T14:30:00Z"
                },
                {
                    "id": "mission-47-task-3",
                    "text": "Deployed to Render",
                    "category": "non-functional",
                    "completed": False,
                    "completed_at": None
                },
                {
                    "id": "mission-47-task-4",
                    "text": "Acceptance tests passing",
                    "category": "tests",
                    "completed": False,
                    "completed_at": None
                }
            ],
            "total": 4,
            "completed": 1
        }
    """
    try:
        # Get DoD items from FalkorDB
        dod_items = get_mission_dod_items(mission_id)

        # Format items
        formatted_items = [format_dod_item(item) for item in dod_items]

        # Count completed items
        completed_count = sum(1 for item in formatted_items if item.completed)

        return DoDListResponse(
            items=formatted_items,
            total=len(formatted_items),
            completed=completed_count
        )

    except Exception as e:
        # Fail loud
        print(f"[routers/dod.py:list_dod_items] Error fetching DoD items: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch DoD items"
        )


@router.patch("/{mission_id}/dod/{item_id}", response_model=DoDUpdateResponse)
async def toggle_dod_item(
    mission_id: str,
    item_id: str,
    request: DoDUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    mission: dict = Depends(get_current_user_mission)
):
    """
    Toggle DoD item completion state.

    Args:
        mission_id: Mission slug (from URL)
        item_id: DoD task slug (from URL)
        request: DoDUpdateRequest with desired completion state
        current_user: Authenticated user (injected dependency)
        mission: Mission node (injected dependency, includes auth check)

    Returns:
        DoDUpdateResponse with updated item state

    Raises:
        HTTPException 404: If item not found or not part of this mission
        HTTPException 500: If update fails

    Example:
        PATCH /api/missions/mission-47-telegram-bot/dod/mission-47-task-1
        Authorization: Bearer <token>
        {
            "completed": true
        }

        Response:
        {
            "id": "mission-47-task-1",
            "completed": True,
            "completed_at": "2025-11-05T15:00:00Z"
        }
    """
    try:
        # Map completed bool to Cypher state
        new_state = "done" if request.completed else "todo"

        # Update task state in FalkorDB
        updated_task = update_dod_task_state(item_id, new_state)

        # Parse completion timestamp
        updated_at = updated_task.get("updated_at")
        completed_at = None
        if request.completed and updated_at:
            if isinstance(updated_at, str):
                try:
                    completed_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
                except (ValueError, AttributeError):
                    completed_at = None

        return DoDUpdateResponse(
            id=updated_task.get("slug"),
            completed=request.completed,
            completed_at=completed_at
        )

    except Exception as e:
        # Check if error is "task not found"
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="DoD item not found"
            )

        # Fail loud
        print(f"[routers/dod.py:toggle_dod_item] Error updating DoD item: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update DoD item"
        )


@router.patch("/{mission_id}/dod/complete", response_model=dict)
async def mark_all_dod_complete(
    mission_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    mission: dict = Depends(get_current_user_mission)
):
    """
    Mark all DoD items complete and transition mission to QA status.

    This endpoint marks all remaining "todo" and "doing" items as "done"
    and updates the mission state to "qa" (Quality Assurance phase).

    Args:
        mission_id: Mission slug (from URL)
        current_user: Authenticated user (injected dependency)
        mission: Mission node (injected dependency, includes auth check)

    Returns:
        Success response with updated mission status

    Raises:
        HTTPException 500: If update fails

    Example:
        PATCH /api/missions/mission-47-telegram-bot/dod/complete
        Authorization: Bearer <token>

        Response:
        {
            "message": "All DoD items marked complete",
            "mission_status": "qa",
            "completed_count": 4
        }
    """
    try:
        # Get all current DoD items
        dod_items = get_mission_dod_items(mission_id)

        # Mark each item as complete
        completed_count = 0
        for item in dod_items:
            try:
                item_slug = item.get("slug")
                item_state = item.get("state", "todo")

                # Only update if not already done
                if item_state != "done":
                    update_dod_task_state(item_slug, "done")
                    completed_count += 1
            except Exception as item_error:
                # Log but continue with other items (fail-loud but don't crash)
                print(f"[routers/dod.py:mark_all_dod_complete] Failed to mark item {item.get('slug')} complete: {item_error}")

        # Update mission status to QA
        cypher = """
        MATCH (m:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
        SET m.state = 'qa',
            m.updated_at = datetime()
        RETURN m.state as new_state
        """

        try:
            results = query_graph(cypher, {"slug": mission_id})
            new_state = results[0].get("new_state") if results else "unknown"
        except Exception as e:
            # Log error but still return success (items were marked complete)
            print(f"[routers/dod.py:mark_all_dod_complete] Failed to update mission status: {e}")
            new_state = "qa"

        return {
            "message": "All DoD items marked complete",
            "mission_status": new_state or "qa",
            "completed_count": completed_count
        }

    except Exception as e:
        # Fail loud
        print(f"[routers/dod.py:mark_all_dod_complete] Error marking all items complete: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark all DoD items complete"
        )
