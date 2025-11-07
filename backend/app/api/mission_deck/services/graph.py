"""
FalkorDB REST API Client for Mission Deck

This module provides graph database operations for Mission Deck,
connecting to the production Mind Protocol v2 FalkorDB instance.

Architecture:
- REST API client (not direct database connection)
- Cypher query language for graph operations
- Mind Protocol v2 universal node attributes
- Scope: scopelock (L2 org level)
"""

import requests
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.config import settings


# Production FalkorDB connection
FALKORDB_API_URL = settings.falkordb_api_url
FALKORDB_API_KEY = settings.falkordb_api_key
GRAPH_NAME = settings.graph_name


def _escape_cypher_value(value: Any) -> str:
    """
    Escape a Python value for inline Cypher query.

    FalkorDB doesn't support parameterized queries, so we must inline values safely.

    Args:
        value: Python value to escape

    Returns:
        Cypher-safe string representation
    """
    if value is None:
        return "null"
    elif isinstance(value, bool):
        return "true" if value else "false"
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, str):
        # Escape single quotes for Cypher strings
        escaped = value.replace("'", "\\'")
        return f"'{escaped}'"
    elif isinstance(value, list):
        # Convert list to Cypher array
        items = [_escape_cypher_value(item) for item in value]
        return f"[{', '.join(items)}]"
    elif isinstance(value, dict):
        # Convert dict to Cypher map
        items = [f"{k}: {_escape_cypher_value(v)}" for k, v in value.items()]
        return f"{{{', '.join(items)}}}"
    else:
        # Fallback: convert to string
        return _escape_cypher_value(str(value))


def query_graph(cypher: str, params: Optional[Dict[str, Any]] = None) -> List[Dict]:
    """
    Execute Cypher query on FalkorDB production graph.

    IMPORTANT: FalkorDB doesn't support parameterized queries, so parameters are
    interpolated inline using safe escaping.

    Args:
        cypher: Cypher query string (use $param for parameters)
        params: Dict of parameters to substitute in query

    Returns:
        List of result dictionaries

    Raises:
        requests.HTTPError: If FalkorDB API returns error

    Example:
        results = query_graph(
            "MATCH (m:U4_Work_Item {slug: $slug}) RETURN m",
            {"slug": "mission-47"}
        )
    """
    if not FALKORDB_API_URL or not FALKORDB_API_KEY:
        raise ValueError(
            "FalkorDB credentials missing. Set FALKORDB_API_URL and FALKORDB_API_KEY."
        )

    # Inline parameters since FalkorDB doesn't support parameterized queries
    if params:
        for key, value in params.items():
            escaped_value = _escape_cypher_value(value)
            cypher = cypher.replace(f"${key}", escaped_value)

    try:
        response = requests.post(
            FALKORDB_API_URL,
            headers={
                "Content-Type": "application/json",
                "X-API-Key": FALKORDB_API_KEY
            },
            json={
                "graph_name": GRAPH_NAME,
                "query": cypher,
                "params": {}  # Always empty since we inline
            },
            timeout=10
        )
        response.raise_for_status()
        # FalkorDB returns "result" (not "results")
        return response.json().get("result", [])
    except requests.exceptions.RequestException as e:
        # Fail loud per ScopeLock fail-loud principle
        print(f"[graph.py:query_graph] FalkorDB query failed: {e}")
        raise


def get_mission_by_slug(slug: str) -> Optional[Dict]:
    """
    Get mission node by slug.

    Args:
        slug: Mission slug (e.g., "mission-47-telegram-bot")

    Returns:
        Mission node dict or None if not found
    """
    cypher = """
    MATCH (m:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
    WHERE m.work_type = 'mission'
    RETURN m
    """
    results = query_graph(cypher, {"slug": slug})
    return results[0]["m"] if results else None


def get_user_missions(assignee_ref: str) -> List[Dict]:
    """
    Get all missions assigned to a developer.

    Args:
        assignee_ref: Developer slug (e.g., "bigbosexf", "kara")

    Returns:
        List of mission nodes
    """
    cypher = """
    MATCH (m:U4_Work_Item {scope_ref: 'scopelock'})
    WHERE m.work_type = 'mission'
      AND m.assignee_ref = $assignee_ref
      AND m.state IN ['todo', 'doing']
    RETURN m
    ORDER BY m.due_date ASC
    """
    results = query_graph(cypher, {"assignee_ref": assignee_ref})
    return [r["m"] for r in results]


def get_mission_messages(mission_slug: str, limit: int = 50) -> List[Dict]:
    """
    Get chat messages for a mission.

    Args:
        mission_slug: Mission slug
        limit: Max number of messages to return (default 50)

    Returns:
        List of message nodes (U4_Event with event_kind='message')
    """
    cypher = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, scope_ref: 'scopelock'})
          <-[:U4_ABOUT]-(msg:U4_Event)
    WHERE msg.event_kind = 'message'
      AND msg.scope_ref = 'scopelock'
    RETURN msg
    ORDER BY msg.timestamp ASC
    LIMIT $limit
    """
    results = query_graph(cypher, {"mission_slug": mission_slug, "limit": limit})
    return [r["msg"] for r in results]


def get_mission_dod_items(mission_slug: str) -> List[Dict]:
    """
    Get DoD checklist items for a mission.

    Args:
        mission_slug: Mission slug

    Returns:
        List of DoD task nodes (U4_Work_Item with work_type='task')
    """
    cypher = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, scope_ref: 'scopelock'})
          <-[:U4_MEMBER_OF {role: 'dod_task'}]-(task:U4_Work_Item)
    WHERE task.scope_ref = 'scopelock'
    RETURN task
    ORDER BY task.dod_category, task.dod_sort_order
    """
    results = query_graph(cypher, {"mission_slug": mission_slug})
    return [r["task"] for r in results]


def create_chat_message(
    mission_slug: str,
    role: str,
    content: str,
    actor_ref: str,
    code_blocks: Optional[List[Dict]] = None
) -> Dict:
    """
    Create a new chat message and link to mission.

    Args:
        mission_slug: Mission slug to attach message to
        role: "system" | "user" | "assistant"
        content: Message text
        actor_ref: Who sent the message (citizen or developer slug)
        code_blocks: Optional list of {language, code, filename} dicts

    Returns:
        Created message node

    Raises:
        Exception: If message creation or linking fails
    """
    msg_slug = f"chat-msg-{uuid.uuid4()}"
    timestamp = datetime.utcnow().isoformat()

    # Truncate content for name field (max 100 chars)
    msg_name = f"{actor_ref}: {content[:50]}..." if len(content) > 50 else f"{actor_ref}: {content}"

    # Create message node with Mind Protocol v2 universal attributes
    cypher_create = """
    CREATE (msg:U4_Event {
      name: $name,
      slug: $slug,
      event_kind: 'message',
      level: 'L2',
      scope_ref: 'scopelock',
      actor_ref: $actor_ref,
      timestamp: datetime($timestamp),
      status: 'active',
      role: $role,
      content: $content,
      code_blocks: $code_blocks,
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      description: $description,
      detailed_description: $detailed_description,
      type_name: 'U4_Event',
      visibility: 'partners',
      policy_ref: 'l4://law/scopelock-chat-policy',
      proof_uri: '',
      commitments: [],
      created_by: $created_by,
      substrate: 'organizational'
    })
    RETURN msg
    """

    try:
        results = query_graph(cypher_create, {
            "name": msg_name,
            "slug": msg_slug,
            "actor_ref": actor_ref,
            "timestamp": timestamp,
            "role": role,
            "content": content,
            "code_blocks": code_blocks or [],
            "description": f"Chat message from {actor_ref}",
            "detailed_description": content[:200],
            "created_by": actor_ref
        })

        if not results:
            raise Exception("Failed to create message node")

        # Link message to mission
        cypher_link = """
        MATCH (msg:U4_Event {slug: $msg_slug})
        MATCH (mission:U4_Work_Item {slug: $mission_slug})
        CREATE (msg)-[:U4_ABOUT {
          focus_type: 'primary_subject',
          created_at: datetime(),
          updated_at: datetime(),
          valid_from: datetime(),
          valid_to: null,
          confidence: 1.0,
          energy: 0.7,
          forming_mindstate: 'guidance',
          goal: 'Chat message about mission',
          visibility: 'partners',
          commitments: [],
          created_by: $created_by,
          substrate: 'organizational'
        }]->(mission)
        """

        query_graph(cypher_link, {
            "msg_slug": msg_slug,
            "mission_slug": mission_slug,
            "created_by": actor_ref
        })

        return results[0]["msg"]

    except Exception as e:
        # Fail loud per ScopeLock principle
        print(f"[graph.py:create_chat_message] Failed to create message: {e}")
        raise


def update_dod_task_state(task_slug: str, new_state: str) -> Dict:
    """
    Update DoD task state (todo/doing/done).

    Args:
        task_slug: DoD task slug
        new_state: "todo" | "doing" | "done"

    Returns:
        Updated task node

    Raises:
        Exception: If task not found or update fails
    """
    if new_state not in ["todo", "doing", "done"]:
        raise ValueError(f"Invalid state: {new_state}. Must be todo/doing/done.")

    cypher = """
    MATCH (task:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
    SET task.state = $new_state,
        task.updated_at = datetime()
    RETURN task
    """

    try:
        results = query_graph(cypher, {
            "slug": task_slug,
            "new_state": new_state
        })

        if not results:
            raise Exception(f"DoD task not found: {task_slug}")

        return results[0]["task"]

    except Exception as e:
        # Fail loud
        print(f"[graph.py:update_dod_task_state] Failed to update task: {e}")
        raise
