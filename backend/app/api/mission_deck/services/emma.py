"""
Emma Service - Proposal & Lead Tracking in FalkorDB

Provides functions for Emma to track:
- Upwork searches
- Proposals sent
- Lead assessments
- Follow-up tasks

Architecture:
- All data stored in FalkorDB production graph
- Local JSON backup for resilience
- Mind Protocol v2 universal node attributes
- Scope: scopelock (L2 org level)
"""

import uuid
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pathlib import Path
from app.api.mission_deck.services.graph import query_graph
from app.config import settings

# Local backup directory (fallback if FalkorDB unavailable)
# Use /var/data in production (Render), local path in development
if settings.environment == "production":
    BACKUP_DIR = Path("/var/data/emma/proposals")
else:
    BACKUP_DIR = Path(__file__).parent.parent.parent.parent / "data" / "emma" / "proposals"

BACKUP_DIR.mkdir(parents=True, exist_ok=True)


def _save_local_backup(slug: str, data: Dict) -> None:
    """Save local JSON backup for resilience."""
    try:
        backup_path = BACKUP_DIR / f"{slug}.json"
        with open(backup_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        print(f"[emma.py] Failed to save local backup: {e}")


def log_upwork_search(
    search_query: str,
    jobs_filtered: int,
    proposals_sent: int,
    platform: str = "upwork",
    filters_applied: Optional[List[str]] = None
) -> Dict:
    """
    Log an Upwork search query execution.

    Args:
        search_query: The search query used (e.g., "AI integration Python Next.js")
        jobs_filtered: Number of jobs reviewed
        proposals_sent: Number of proposals sent from this search
        platform: Platform searched (default "upwork")
        filters_applied: List of filters used (e.g., ["payment_verified", "fixed_price"])

    Returns:
        Created U4_Event node

    Raises:
        Exception: If FalkorDB query fails

    Example:
        log_upwork_search(
            search_query="AI integration Python Next.js",
            jobs_filtered=50,
            proposals_sent=5,
            filters_applied=["payment_verified", "fixed_price", "$3K+"]
        )
    """
    slug = f"search-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
    timestamp = datetime.utcnow().isoformat()

    cypher = """
    CREATE (s:U4_Event {
      name: $name,
      slug: $slug,
      event_kind: 'upwork_search',
      level: 'L2',
      scope_ref: 'scopelock',
      actor_ref: 'emma',

      search_query: $search_query,
      jobs_filtered: $jobs_filtered,
      proposals_sent: $proposals_sent,
      platform: $platform,
      filters_applied: $filters_applied,
      timestamp: $timestamp,

      description: $description,
      detailed_description: $detailed_description,
      type_name: 'U4_Event',
      visibility: 'partners',
      policy_ref: 'l4://law/scopelock-tracking-policy',
      proof_uri: '',
      commitments: [],
      created_by: 'emma',
      substrate: 'organizational',

      created_at: $created_at,
      updated_at: $updated_at,
      valid_from: $valid_from,
      valid_to: null
    })
    RETURN s
    """

    try:
        results = query_graph(cypher, {
            "name": f"Upwork Search: {search_query[:50]}",
            "slug": slug,
            "search_query": search_query,
            "jobs_filtered": jobs_filtered,
            "proposals_sent": proposals_sent,
            "platform": platform,
            "filters_applied": filters_applied or [],
            "timestamp": timestamp,
            "created_at": timestamp,
            "updated_at": timestamp,
            "valid_from": timestamp,
            "description": f"Upwork search for {search_query[:50]}",
            "detailed_description": f"Searched {platform} with query '{search_query}'. Filtered {jobs_filtered} jobs, sent {proposals_sent} proposals."
        })

        if not results:
            raise Exception("Failed to create search event node")

        search_node = results[0]["s"]

        # Save local backup
        _save_local_backup(slug, search_node)

        return search_node

    except Exception as e:
        print(f"[emma.py:log_upwork_search] Failed: {e}")
        raise


def create_proposal(
    job_title: str,
    job_url: str,
    budget_cents: int,
    client_info: Dict[str, Any],
    proposal_text: str,
    confidence: float,
    client_type: str,
    portfolio_match: str,
    questions: Optional[List[str]] = None,
    decision: str = "STRONG GO",
    urgency: int = 5,
    pain: int = 5,
    platform: str = "upwork"
) -> Dict:
    """
    Create a proposal node in FalkorDB.

    Args:
        job_title: Job post title
        job_url: URL to job post
        budget_cents: Budget in cents (e.g., 800000 = $8000)
        client_info: Dict with keys:
            - spent: float (total client spend)
            - rating: float (client rating out of 5)
            - hires: int (number of hires)
            - payment_verified: bool
            - country: str
            - rank: str (optional, e.g., "Enterprise")
        proposal_text: Full proposal content
        confidence: Emma's confidence score (0-1)
        client_type: "process-skeptical" or "process-friendly"
        portfolio_match: Which proof project used (e.g., "TherapyKin")
        questions: List of clarification questions asked
        decision: "STRONG GO" | "QUALIFIED MAYBE" | "HARD NO"
        urgency: Urgency score 1-10
        pain: Pain score 1-10
        platform: Platform (default "upwork")

    Returns:
        Created U3_Deal node

    Raises:
        Exception: If proposal creation fails

    Example:
        create_proposal(
            job_title="Build Dental SaaS MVP",
            job_url="https://upwork.com/jobs/...",
            budget_cents=800000,
            client_info={
                "spent": 12500.50,
                "rating": 4.9,
                "hires": 15,
                "payment_verified": True,
                "country": "United States",
                "rank": "Enterprise"
            },
            proposal_text="Full proposal...",
            confidence=0.85,
            client_type="process-skeptical",
            portfolio_match="TherapyKin"
        )
    """
    slug = f"proposal-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{job_title[:30].lower().replace(' ', '-')}"
    timestamp = datetime.utcnow().isoformat()

    # Extract client info
    client_name = client_info.get("name", "Unknown Client")
    client_spent = client_info.get("spent", 0.0)
    client_rating = client_info.get("rating", 0.0)
    client_hires = client_info.get("hires", 0)
    payment_verified = client_info.get("payment_verified", False)
    client_country = client_info.get("country", "Unknown")
    client_rank = client_info.get("rank", "")

    cypher = """
    CREATE (p:U3_Deal {
      name: $name,
      slug: $slug,
      deal_kind: 'service',
      level: 'L2',
      scope_ref: 'scopelock',
      state: 'Proposed',

      job_title: $job_title,
      job_url: $job_url,
      platform: $platform,
      job_posted_at: datetime($timestamp),

      amount_value: $amount_value,
      amount_ccy: 'USD',
      budget_cents: $budget_cents,

      client_name: $client_name,
      client_spent: $client_spent,
      client_rating: $client_rating,
      client_hires: $client_hires,
      client_payment_verified: $payment_verified,
      client_country: $client_country,
      client_rank: $client_rank,

      proposal_text: $proposal_text,
      questions: $questions,

      decision: $decision,
      confidence: $confidence,
      client_type: $client_type,
      portfolio_match: $portfolio_match,
      urgency: $urgency,
      pain: $pain,

      submitted_at: datetime($timestamp),
      response_at: null,
      settlement_date: null,

      notes: $notes,
      counterparties: [],
      status: 'active',

      description: $description,
      detailed_description: $detailed_description,
      type_name: 'U3_Deal',
      visibility: 'partners',
      policy_ref: 'l4://law/scopelock-proposals-policy',
      proof_uri: '',
      commitments: [],
      created_by: 'emma',
      substrate: 'organizational',

      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null
    })
    RETURN p
    """

    try:
        results = query_graph(cypher, {
            "name": f"Proposal: {job_title[:50]}",
            "slug": slug,
            "job_title": job_title,
            "job_url": job_url,
            "platform": platform,
            "timestamp": timestamp,
            "amount_value": budget_cents / 100.0,
            "budget_cents": budget_cents,
            "client_name": client_name,
            "client_spent": client_spent,
            "client_rating": client_rating,
            "client_hires": client_hires,
            "payment_verified": payment_verified,
            "client_country": client_country,
            "client_rank": client_rank,
            "proposal_text": proposal_text,
            "questions": questions or [],
            "decision": decision,
            "confidence": confidence,
            "client_type": client_type,
            "portfolio_match": portfolio_match,
            "urgency": urgency,
            "pain": pain,
            "notes": f"{decision}: {client_type}, portfolio={portfolio_match}",
            "description": f"Proposal for {job_title[:50]}",
            "detailed_description": proposal_text[:200]
        })

        if not results:
            raise Exception("Failed to create proposal node")

        proposal_node = results[0]["p"]

        # Save local backup
        _save_local_backup(slug, {
            **proposal_node,
            "client_info": client_info,
            "backup_timestamp": timestamp
        })

        return proposal_node

    except Exception as e:
        print(f"[emma.py:create_proposal] Failed: {e}")
        raise


def link_search_to_proposal(search_slug: str, proposal_slug: str) -> None:
    """
    Link a search event to a proposal (tracks search effectiveness).

    Args:
        search_slug: Slug of search event
        proposal_slug: Slug of proposal

    Raises:
        Exception: If linking fails
    """
    cypher = """
    MATCH (s:U4_Event {slug: $search_slug, event_kind: 'upwork_search'})
    MATCH (p:U3_Deal {slug: $proposal_slug})
    CREATE (s)-[:U4_LEADS_TO {
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      confidence: 1.0,
      energy: 0.8,
      forming_mindstate: 'opportunity_detection',
      goal: 'Track search query effectiveness',
      visibility: 'partners',
      commitments: [],
      created_by: 'emma',
      substrate: 'organizational'
    }]->(p)
    """

    try:
        query_graph(cypher, {
            "search_slug": search_slug,
            "proposal_slug": proposal_slug
        })
    except Exception as e:
        print(f"[emma.py:link_search_to_proposal] Failed: {e}")
        raise


def update_proposal_state(
    proposal_slug: str,
    new_state: str,
    response_timestamp: Optional[str] = None
) -> Dict:
    """
    Update proposal state (Proposed → Confirmed/Rejected/NoResponse).

    Args:
        proposal_slug: Slug of proposal
        new_state: "Confirmed" | "Rejected" | "NoResponse"
        response_timestamp: When client responded (ISO format)

    Returns:
        Updated proposal node

    Raises:
        ValueError: If invalid state
        Exception: If update fails
    """
    valid_states = ["Confirmed", "Rejected", "NoResponse"]
    if new_state not in valid_states:
        raise ValueError(f"Invalid state: {new_state}. Must be one of {valid_states}")

    cypher = """
    MATCH (p:U3_Deal {slug: $slug, scope_ref: 'scopelock'})
    SET p.state = $new_state,
        p.response_at = datetime($response_timestamp),
        p.updated_at = datetime()
    RETURN p
    """

    try:
        response_ts = response_timestamp or datetime.utcnow().isoformat()
        results = query_graph(cypher, {
            "slug": proposal_slug,
            "new_state": new_state,
            "response_timestamp": response_ts
        })

        if not results:
            raise Exception(f"Proposal not found: {proposal_slug}")

        return results[0]["p"]

    except Exception as e:
        print(f"[emma.py:update_proposal_state] Failed: {e}")
        raise


def create_followup_task(
    proposal_slug: str,
    followup_date: str,
    reason: str,
    followup_type: str = "no_response"
) -> Dict:
    """
    Create a follow-up task for a proposal.

    Args:
        proposal_slug: Slug of proposal to follow up on
        followup_date: Due date for follow-up (ISO format, e.g., "2025-11-20")
        reason: Why following up (e.g., "No response after 14 days")
        followup_type: "no_response" | "maybe_later" | "warm_lead"

    Returns:
        Created U4_Work_Item node

    Raises:
        Exception: If task creation fails

    Example:
        create_followup_task(
            proposal_slug="proposal-2025-11-03-dental-saas",
            followup_date="2025-11-20",
            reason="No response after 14 days"
        )
    """
    # First get proposal to extract client name
    proposal = get_proposal_by_slug(proposal_slug)
    if not proposal:
        raise Exception(f"Proposal not found: {proposal_slug}")

    client_name = proposal.get("client_name", "Unknown Client")
    job_title = proposal.get("job_title", "Unknown Job")

    slug = f"followup-{proposal_slug}-{datetime.utcnow().strftime('%Y%m%d')}"

    cypher_create = """
    CREATE (f:U4_Work_Item {
      name: $name,
      slug: $slug,
      work_type: 'lead_followup',
      level: 'L2',
      scope_ref: 'scopelock',
      state: 'todo',

      assignee_ref: 'emma',
      due_date: datetime($due_date),

      client_name: $client_name,
      proposal_ref: $proposal_ref,
      reason: $reason,
      followup_type: $followup_type,
      days_since_proposal: $days_since_proposal,

      notes: $notes,

      description: $description,
      detailed_description: $detailed_description,
      type_name: 'U4_Work_Item',
      visibility: 'partners',
      policy_ref: 'l4://law/scopelock-tasks-policy',
      proof_uri: '',
      commitments: [],
      created_by: 'emma',
      substrate: 'organizational',

      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null
    })
    RETURN f
    """

    # Calculate days since proposal
    submitted_at = proposal.get("submitted_at")
    if submitted_at:
        submitted_dt = datetime.fromisoformat(submitted_at.replace("Z", "+00:00"))
        days_since = (datetime.utcnow() - submitted_dt.replace(tzinfo=None)).days
    else:
        days_since = 0

    try:
        results = query_graph(cypher_create, {
            "name": f"Follow up: {client_name} ({job_title[:30]})",
            "slug": slug,
            "due_date": followup_date,
            "client_name": client_name,
            "proposal_ref": proposal_slug,
            "reason": reason,
            "followup_type": followup_type,
            "days_since_proposal": days_since,
            "notes": "Use 'Quick question' approach, offer Evidence Sprint",
            "description": f"Follow up on {job_title[:50]}",
            "detailed_description": f"Client {client_name} hasn't responded to proposal. {reason}."
        })

        if not results:
            raise Exception("Failed to create follow-up task")

        followup_node = results[0]["f"]

        # Link follow-up to proposal
        cypher_link = """
        MATCH (f:U4_Work_Item {slug: $followup_slug})
        MATCH (p:U3_Deal {slug: $proposal_slug})
        CREATE (f)-[:U4_DEPENDS_ON {
          created_at: datetime(),
          updated_at: datetime(),
          valid_from: datetime(),
          valid_to: null,
          confidence: 1.0,
          energy: 0.6,
          forming_mindstate: 'nurturing',
          goal: 'Follow up on cold proposal',
          visibility: 'partners',
          commitments: [],
          created_by: 'emma',
          substrate: 'organizational'
        }]->(p)
        """

        query_graph(cypher_link, {
            "followup_slug": slug,
            "proposal_slug": proposal_slug
        })

        return followup_node

    except Exception as e:
        print(f"[emma.py:create_followup_task] Failed: {e}")
        raise


def get_proposals_needing_followup(days_since: int = 14) -> List[Dict]:
    """
    Get proposals with no response after N days.

    Args:
        days_since: Number of days since proposal submission (default 14)

    Returns:
        List of proposal nodes needing follow-up

    Example:
        # Get proposals with no response after 14 days
        followups = get_proposals_needing_followup(days_since=14)
    """
    cypher = """
    MATCH (p:U3_Deal {scope_ref: 'scopelock', state: 'Proposed'})
    WHERE datetime() - datetime(p.submitted_at) > duration({days: $days_since})
      AND NOT exists((p)<-[:U4_DEPENDS_ON]-(:U4_Work_Item {work_type: 'lead_followup'}))
    RETURN p
    ORDER BY p.submitted_at ASC
    """

    try:
        results = query_graph(cypher, {"days_since": days_since})
        return [r["p"] for r in results]
    except Exception as e:
        print(f"[emma.py:get_proposals_needing_followup] Failed: {e}")
        raise


def get_proposal_by_slug(slug: str) -> Optional[Dict]:
    """
    Get proposal by slug.

    Args:
        slug: Proposal slug

    Returns:
        Proposal node or None if not found
    """
    cypher = """
    MATCH (p:U3_Deal {slug: $slug, scope_ref: 'scopelock'})
    RETURN p
    """

    try:
        results = query_graph(cypher, {"slug": slug})
        return results[0]["p"] if results else None
    except Exception as e:
        print(f"[emma.py:get_proposal_by_slug] Failed: {e}")
        raise


def get_proposals_by_state(state: str, limit: int = 50) -> List[Dict]:
    """
    Get proposals by state.

    Args:
        state: "Proposed" | "Confirmed" | "Rejected" | "NoResponse"
        limit: Max number of proposals to return

    Returns:
        List of proposal nodes
    """
    cypher = """
    MATCH (p:U3_Deal {scope_ref: 'scopelock', state: $state})
    RETURN p
    ORDER BY p.submitted_at DESC
    LIMIT $limit
    """

    try:
        results = query_graph(cypher, {"state": state, "limit": limit})
        return [r["p"] for r in results]
    except Exception as e:
        print(f"[emma.py:get_proposals_by_state] Failed: {e}")
        raise


def get_win_rate_by_search_query() -> List[Dict]:
    """
    Calculate win rate for each search query.

    Returns:
        List of dicts with:
        - search_query: str
        - total_proposals: int
        - wins: int
        - win_rate: float (0-1)

    Example:
        results = get_win_rate_by_search_query()
        # [
        #   {"search_query": "AI integration Python", "total": 10, "wins": 3, "win_rate": 0.3},
        #   ...
        # ]
    """
    cypher = """
    MATCH (search:U4_Event {event_kind: 'upwork_search'})
          -[:U4_LEADS_TO]->(proposal:U3_Deal)
    WITH search.search_query as query,
         count(proposal) as total,
         count(CASE WHEN proposal.state = 'Confirmed' THEN 1 END) as wins
    WHERE total > 0
    RETURN query as search_query,
           total as total_proposals,
           wins,
           toFloat(wins) / toFloat(total) as win_rate
    ORDER BY win_rate DESC, total DESC
    """

    try:
        results = query_graph(cypher, {})
        return results
    except Exception as e:
        print(f"[emma.py:get_win_rate_by_search_query] Failed: {e}")
        raise


def create_mission(
    search_slug: str,
    search_query: str,
    validated_jobs_count: int,
    mission_type: str = "proposal"
) -> Dict:
    """
    Create a mission after Emma completes an Upwork search.

    Args:
        search_slug: Slug of the search event that triggered this mission
        search_query: The search query used (e.g., "voice AI dashboard")
        validated_jobs_count: Number of jobs Emma validated for proposals
        mission_type: Type of mission (default "proposal")

    Returns:
        Created U4_Work_Item node (mission)

    Raises:
        Exception: If mission creation fails

    Example:
        create_mission(
            search_slug="search-20251107-153045",
            search_query="voice AI dashboard",
            validated_jobs_count=5,
            mission_type="proposal"
        )
    """
    slug = f"mission-{mission_type}-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
    timestamp = datetime.utcnow().isoformat()
    search_date = timestamp[:10]  # Extract YYYY-MM-DD

    cypher = """
    CREATE (m:U4_Work_Item {
      name: $name,
      slug: $slug,
      work_type: 'mission',
      level: 'L2',
      scope_ref: 'scopelock',
      status: 'available',

      missionType: $mission_type,
      points: 1,

      createdBy: 'emma_citizen',
      emmaSearchQuery: $search_query,
      emmaValidatedJobsCount: $validated_jobs_count,
      emmaSearchDate: $search_date,

      completedBy: null,
      completedAt: null,
      emmaChatSessionId: null,

      paidAt: null,
      paidWithJob: null,
      actualPayment: null,

      created_at: $created_at,
      updated_at: $updated_at,
      valid_from: $valid_from,
      valid_to: null,

      description: $description,
      detailed_description: $detailed_description,
      type_name: 'U4_Work_Item',
      visibility: 'partners',
      policy_ref: 'l4://law/scopelock-mission-policy',
      proof_uri: '',
      commitments: [],
      created_by: 'emma_citizen',
      substrate: 'organizational'
    })
    RETURN m
    """

    try:
        results = query_graph(cypher, {
            "name": f"Apply to all jobs from Emma search '{search_query}' ({validated_jobs_count} jobs)",
            "slug": slug,
            "mission_type": mission_type,
            "search_query": search_query,
            "validated_jobs_count": validated_jobs_count,
            "search_date": search_date,
            "created_at": timestamp,
            "updated_at": timestamp,
            "valid_from": timestamp,
            "description": f"Mission: Apply to {validated_jobs_count} validated jobs",
            "detailed_description": f"Complete proposals for all {validated_jobs_count} jobs validated by Emma from search '{search_query}'"
        })

        if not results:
            raise Exception("Failed to create mission node")

        mission_node = results[0]["m"]

        # Link mission to search event
        link_search_to_mission(search_slug, slug)

        # Save local backup
        _save_local_backup(slug, mission_node)

        return mission_node

    except Exception as e:
        print(f"[emma.py:create_mission] Failed: {e}")
        raise


def link_search_to_mission(search_slug: str, mission_slug: str) -> None:
    """
    Link a search event to a mission.

    Creates U4_LEADS_TO relationship from search to mission.

    Args:
        search_slug: Search event slug
        mission_slug: Mission slug

    Raises:
        Exception: If linking fails
    """
    timestamp = datetime.utcnow().isoformat()

    cypher = """
    MATCH (search:U4_Event {slug: $search_slug, event_kind: 'upwork_search'})
    MATCH (mission:U4_Work_Item {slug: $mission_slug, work_type: 'mission'})
    CREATE (search)-[:U4_LEADS_TO {
      focus_type: 'mission_creation',
      created_at: $created_at,
      updated_at: $updated_at,
      valid_from: $valid_from,
      valid_to: null,
      confidence: 1.0,
      energy: 0.8,
      forming_mindstate: 'execution',
      goal: 'Mission created from search results',
      visibility: 'partners',
      commitments: [],
      created_by: 'emma_citizen',
      substrate: 'organizational'
    }]->(mission)
    """

    try:
        query_graph(cypher, {
            "search_slug": search_slug,
            "mission_slug": mission_slug,
            "created_at": timestamp,
            "updated_at": timestamp,
            "valid_from": timestamp
        })
    except Exception as e:
        print(f"[emma.py:link_search_to_mission] Failed: {e}")
        raise


def complete_mission(
    mission_slug: str,
    member_id: str,
    chat_session_id: str
) -> Dict:
    """
    Mark a mission as completed when Emma validates it via chat.

    Args:
        mission_slug: Mission slug (e.g., "mission-proposal-20251107-153045")
        member_id: Team member who completed the mission (e.g., "bigbosexf", "kara")
        chat_session_id: Chat session ID where Emma validated completion

    Returns:
        Updated mission node with completion details

    Raises:
        Exception: If mission not found or update fails

    Example:
        complete_mission(
            mission_slug="mission-proposal-20251107-153045",
            member_id="bigbosexf",
            chat_session_id="chat-session-uuid-12345"
        )
    """
    timestamp = datetime.utcnow().isoformat()

    cypher = """
    MATCH (m:U4_Work_Item {slug: $mission_slug, work_type: 'mission'})
    SET m.status = 'completed',
        m.completedBy = $member_id,
        m.completedAt = $completed_at,
        m.emmaChatSessionId = $chat_session_id,
        m.updated_at = $updated_at
    RETURN m
    """

    try:
        results = query_graph(cypher, {
            "mission_slug": mission_slug,
            "member_id": member_id,
            "chat_session_id": chat_session_id,
            "completed_at": timestamp,
            "updated_at": timestamp
        })

        if not results:
            raise Exception(f"Mission not found: {mission_slug}")

        mission_node = results[0]["m"]

        # Update local backup
        _save_local_backup(mission_slug, mission_node)

        return mission_node

    except Exception as e:
        print(f"[emma.py:complete_mission] Failed: {e}")
        raise
