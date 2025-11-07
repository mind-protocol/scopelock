"""
FalkorDB Query API for Mission Deck

Provides GET endpoint to query FalkorDB via URL parameters.
Useful for browser-based testing and debugging.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.api.mission_deck.services.graph import query_graph

router = APIRouter(prefix="/api/graph", tags=["Graph"])


@router.get("/query")
async def get_query_graph(
    q: str = Query(..., description="Cypher query to execute"),
    limit: Optional[int] = Query(None, description="Optional LIMIT to append to query")
):
    """
    Execute Cypher query on FalkorDB via GET request.

    Args:
        q: Cypher query string
        limit: Optional limit to append (for safety)

    Returns:
        Query results as JSON

    Example:
        GET /api/graph/query?q=MATCH (n) RETURN n&limit=10

    Security:
        - Public endpoint (no auth required for now)
        - Consider adding auth or rate limiting in production
    """
    try:
        # Append LIMIT if provided and not already in query
        cypher = q
        if limit and "LIMIT" not in cypher.upper():
            cypher = f"{cypher} LIMIT {limit}"

        # Execute query
        results = query_graph(cypher)

        return {
            "success": True,
            "query": cypher,
            "results": results,
            "count": len(results)
        }

    except ValueError as e:
        # Configuration error (missing credentials)
        raise HTTPException(
            status_code=500,
            detail=f"FalkorDB configuration error: {str(e)}"
        )

    except Exception as e:
        # Query error
        raise HTTPException(
            status_code=400,
            detail=f"Query failed: {str(e)}"
        )
