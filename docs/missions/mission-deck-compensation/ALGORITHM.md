# ALGORITHM: Mission Deck Compensation System

**Version:** 1.1 (WebSocket + Tier-Based Payments)
**Created:** 2025-11-07
**Updated:** 2025-11-07
**Mission:** Step-by-step implementation guide for compensation tracking with WebSocket real-time updates

---

## Overview

This implementation uses **WebSocket** for real-time personal earnings updates and **tier-based mission payments** (4 tiers based on mission fund balance).

**Scope (Week 1):**
- ✅ WebSocket infrastructure for personal earnings
- ✅ Tier-based mission payments (dynamic)
- ❌ Team awareness features (Week 2+ when team is active)

---

## Phase 1: Backend Foundation (Day 1-2)

### Step 1.1: Update Dependencies

**File:** `requirements.txt`

Add compensation-specific dependencies:

```txt
# Existing dependencies
fastapi==0.104.0
uvicorn[standard]==0.24.0
requests==2.31.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0

# New for compensation
redis==5.0.1                # For earnings caching (optional)
websockets==12.0            # For WebSocket real-time updates
```

Install:
```bash
pip install -r requirements.txt
```

---

### Step 1.2: Create Compensation Service Module

**File:** `backend/services/compensation/__init__.py`

```python
"""
Compensation service for interaction-based earnings tracking.
"""

from .interaction_tracker import track_interaction, get_interaction_history
from .earnings_calculator import (
    calculate_member_earning,
    calculate_all_member_earnings,
    get_total_potential_earnings
)
from .mission_manager import (
    claim_mission,
    complete_mission,
    approve_mission,
    check_mission_expiry
)
from .payment_processor import trigger_payment, get_payment_history

__all__ = [
    "track_interaction",
    "get_interaction_history",
    "calculate_member_earning",
    "calculate_all_member_earnings",
    "get_total_potential_earnings",
    "claim_mission",
    "complete_mission",
    "approve_mission",
    "check_mission_expiry",
    "trigger_payment",
    "get_payment_history",
]
```

---

### Step 1.3: Tier-Based Mission Payment System

**File:** `backend/services/compensation/tier_calculator.py`

**Purpose:** Calculate mission payments dynamically based on current mission fund balance.

```python
"""
Tier-based mission payment calculator.
Mission payments vary based on mission fund health.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Tuple
from services.graph import query_graph


# Tier thresholds
TIER_1_THRESHOLD = Decimal('200.00')  # Abundant
TIER_2_THRESHOLD = Decimal('100.00')  # Healthy
TIER_3_THRESHOLD = Decimal('50.00')   # Limited
# Tier 4: < $50 (Critical)

# Payment matrix: [tier1, tier2, tier3, tier4]
PAYMENT_MATRIX = {
    'proposal':    [Decimal('2.00'), Decimal('1.50'), Decimal('1.00'), Decimal('0.50')],
    'social':      [Decimal('3.00'), Decimal('2.50'), Decimal('2.00'), Decimal('1.00')],
    'recruitment': [Decimal('15.00'), Decimal('12.00'), Decimal('10.00'), Decimal('8.00')],
    'other':       [Decimal('5.00'), Decimal('4.00'), Decimal('3.00'), Decimal('2.00')]
}


def get_mission_fund_balance() -> Decimal:
    """
    Calculate current mission fund balance.
    Balance = (sum of 5% contributions from jobs) - (sum of paid missions)

    Returns:
        Decimal: Current balance (rounded to 2 decimals)
    """

    # Step 1: Get total contributions (5% from each job)
    cypher_contributions = """
    MATCH (job:U4_Work_Item {work_type: 'job', scope_ref: 'scopelock'})
    RETURN sum(job.missionFund) AS total
    """

    contrib_result = query_graph(cypher_contributions, {})
    total_contrib = Decimal(str(contrib_result[0].get("total", 0))) if contrib_result else Decimal('0.00')

    # Step 2: Get total spent on paid missions
    cypher_spent = """
    MATCH (mission:U4_Work_Item {work_type: 'mission', scope_ref: 'scopelock'})
    WHERE mission.status = 'paid'
    RETURN sum(mission.fixedPayment) AS total
    """

    spent_result = query_graph(cypher_spent, {})
    total_spent = Decimal(str(spent_result[0].get("total", 0))) if spent_result else Decimal('0.00')

    # Step 3: Calculate balance
    balance = (total_contrib - total_spent).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    return max(balance, Decimal('0.00'))  # Ensure non-negative


def get_current_tier() -> Tuple[int, Decimal]:
    """
    Determine current mission fund tier.

    Returns:
        Tuple[int, Decimal]: (tier_number, current_balance)

    Tier levels:
    - 1 (Abundant):  balance >= $200
    - 2 (Healthy):   $100 <= balance < $200
    - 3 (Limited):   $50 <= balance < $100
    - 4 (Critical):  balance < $50
    """

    balance = get_mission_fund_balance()

    if balance >= TIER_1_THRESHOLD:
        tier = 1
    elif balance >= TIER_2_THRESHOLD:
        tier = 2
    elif balance >= TIER_3_THRESHOLD:
        tier = 3
    else:
        tier = 4

    return (tier, balance)


def get_mission_payment(mission_type: str) -> Decimal:
    """
    Get mission payment amount based on type and current tier.

    Args:
        mission_type: 'proposal' | 'social' | 'recruitment' | 'other'

    Returns:
        Decimal: Payment amount for current tier

    Raises:
        ValueError: If mission_type invalid
    """

    if mission_type not in PAYMENT_MATRIX:
        raise ValueError(f"Invalid mission_type: {mission_type}")

    tier, _ = get_current_tier()

    # Get payment for tier (tier is 1-indexed, array is 0-indexed)
    payment = PAYMENT_MATRIX[mission_type][tier - 1]

    return payment


def get_tier_info() -> dict:
    """
    Get complete tier information for UI display.

    Returns:
        {
            "tier": 2,
            "balance": 150.50,
            "tier_name": "Healthy",
            "payments": {
                "proposal": 1.50,
                "social": 2.50,
                "recruitment": 12.00,
                "other": 4.00
            }
        }
    """

    tier, balance = get_current_tier()

    tier_names = {
        1: "Abundant",
        2: "Healthy",
        3: "Limited",
        4: "Critical"
    }

    payments = {}
    for mission_type in PAYMENT_MATRIX.keys():
        payment = PAYMENT_MATRIX[mission_type][tier - 1]
        payments[mission_type] = float(payment)

    return {
        "tier": tier,
        "balance": float(balance),
        "tier_name": tier_names[tier],
        "payments": payments
    }
```

---

### Step 1.4: Interaction Tracker Implementation

**File:** `backend/services/compensation/interaction_tracker.py`

```python
"""
Track interactions (messages sent to AI citizens) and update job interaction counts.
"""

import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from services.graph import query_graph
from services.compensation.earnings_calculator import calculate_all_member_earnings


def track_interaction(
    job_id: str,
    member_id: str,
    message: str,
    ai_recipient: str
) -> Dict:
    """
    Track new interaction and update earnings.

    Args:
        job_id: Job slug (e.g., "job-therapykin-chatbot-2025-11")
        member_id: Member slug (e.g., "member_a")
        message: Message content
        ai_recipient: AI citizen name ("rafael", "inna", "sofia", "emma")

    Returns:
        {
            "interactionCounted": True,
            "newInteractionCount": 21,
            "teamTotal": 51,
            "newPotentialEarning": 185.29,
            "eventId": "chat-msg-uuid-12345"
        }

    Raises:
        ValueError: If duplicate message detected or job not found
    """

    # 1. Check for duplicate (same message within 1 second)
    content_hash = hashlib.sha256(message.encode()).hexdigest()

    cypher_check_duplicate = """
    MATCH (e:U4_Event {actor_ref: $member_id, content_hash: $content_hash})
    WHERE e.timestamp > datetime($since)
    RETURN count(e) AS count
    """

    since = (datetime.utcnow() - timedelta(seconds=1)).isoformat()
    duplicate_result = query_graph(cypher_check_duplicate, {
        "member_id": member_id,
        "content_hash": content_hash,
        "since": since
    })

    if duplicate_result and duplicate_result[0]["count"] > 0:
        raise ValueError("Duplicate message detected (sent within 1 second)")

    # 2. Verify job exists
    cypher_check_job = """
    MATCH (job:U4_Work_Item {slug: $job_slug, work_type: 'job'})
    RETURN job.slug AS slug
    """

    job_result = query_graph(cypher_check_job, {"job_slug": job_id})
    if not job_result:
        raise ValueError(f"Job not found: {job_id}")

    # 3. Create U4_Event node
    event_slug = f"chat-msg-{uuid.uuid4()}"
    timestamp = datetime.utcnow().isoformat()

    cypher_create_event = """
    CREATE (e:U4_Event {
      slug: $slug,
      name: $name,
      event_kind: 'message',
      level: 'L2',
      scope_ref: 'scopelock',
      status: 'active',
      actor_ref: $actor_ref,
      timestamp: datetime($timestamp),
      role: 'user',
      content: $content,
      code_blocks: [],
      ai_recipient: $ai_recipient,
      interaction_context: 'job',
      job_slug: $job_slug,
      content_hash: $content_hash,
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      description: $description,
      type_name: 'U4_Event',
      visibility: 'partners',
      created_by: $actor_ref,
      substrate: 'organizational'
    })
    RETURN e
    """

    query_graph(cypher_create_event, {
        "slug": event_slug,
        "name": f"{member_id}: {message[:50]}...",
        "actor_ref": member_id,
        "timestamp": timestamp,
        "content": message,
        "ai_recipient": ai_recipient,
        "job_slug": job_id,
        "content_hash": content_hash,
        "description": f"Chat message from {member_id} to {ai_recipient}"
    })

    # 4. Link event to job
    cypher_link = """
    MATCH (e:U4_Event {slug: $event_slug})
    MATCH (job:U4_Work_Item {slug: $job_slug})
    CREATE (e)-[:U4_ABOUT {
      focus_type: 'primary_subject',
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      confidence: 1.0,
      energy: 0.7,
      forming_mindstate: 'guidance',
      goal: 'Message contributes to job',
      visibility: 'partners',
      created_by: $member_id,
      substrate: 'organizational'
    }]->(job)
    """

    query_graph(cypher_link, {
        "event_slug": event_slug,
        "job_slug": job_id,
        "member_id": member_id
    })

    # 5. Update job interaction counts
    #    NOTE: FalkorDB doesn't support nested object updates directly,
    #    so we fetch, modify, and set the entire interactionCounts object

    # Fetch current counts
    cypher_get_counts = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    RETURN job.interactionCounts AS counts, job.totalInteractions AS total
    """

    counts_result = query_graph(cypher_get_counts, {"job_slug": job_id})
    current_counts = counts_result[0].get("counts", {}) if counts_result else {}
    current_total = counts_result[0].get("total", 0) if counts_result else 0

    # Update counts
    if member_id not in current_counts:
        current_counts[member_id] = 0
    current_counts[member_id] += 1
    new_total = current_total + 1

    # Write back updated counts
    cypher_update_job = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    SET job.interactionCounts = $new_counts,
        job.totalInteractions = $new_total,
        job.updated_at = datetime()
    RETURN job
    """

    query_graph(cypher_update_job, {
        "job_slug": job_id,
        "new_counts": current_counts,
        "new_total": new_total
    })

    # 6. Recalculate earnings for all members
    all_earnings = calculate_all_member_earnings(job_id)
    member_earning = all_earnings.get(member_id, 0.0)

    # 7. Broadcast update via WebSocket (personal earnings only)
    # Send to THIS member's WebSocket connection
    from services.websocket_manager import broadcast_to_member

    broadcast_to_member(member_id, {
        "event": "interaction_counted",
        "jobId": job_id,
        "yourInteractions": current_counts[member_id],
        "teamTotal": new_total,
        "yourPotentialEarning": member_earning
    })

    return {
        "interactionCounted": True,
        "newInteractionCount": current_counts[member_id],
        "teamTotal": new_total,
        "newPotentialEarning": member_earning,
        "eventId": event_slug
    }


def get_interaction_history(job_id: str, member_id: str) -> List[Dict]:
    """
    Get complete interaction history for a member on a job.

    Returns:
        [
            {
                "timestamp": "2025-11-07T14:23:15Z",
                "messagePreview": "Rafael, implement OTP flow...",
                "aiRecipient": "rafael",
                "eventId": "chat-msg-uuid-123"
            },
            ...
        ]
    """

    cypher = """
    MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {slug: $job_slug})
    WHERE e.actor_ref = $member_id AND e.event_kind = 'message'
    RETURN e.timestamp AS timestamp,
           e.content AS content,
           e.ai_recipient AS aiRecipient,
           e.slug AS eventId
    ORDER BY e.timestamp DESC
    """

    results = query_graph(cypher, {"job_slug": job_id, "member_id": member_id})

    history = []
    for row in results:
        content = row["content"]
        preview = content[:50] + "..." if len(content) > 50 else content

        history.append({
            "timestamp": row["timestamp"],
            "messagePreview": preview,
            "aiRecipient": row["aiRecipient"],
            "eventId": row["eventId"]
        })

    return history
```

---

### Step 1.4: Earnings Calculator Implementation

**File:** `backend/services/compensation/earnings_calculator.py`

```python
"""
Calculate member earnings from interaction counts.
"""

from typing import Dict
from services.graph import query_graph


def calculate_member_earning(job_id: str, member_id: str) -> float:
    """
    Calculate member's potential earning for a job.

    Formula: (member_interactions / total_interactions) × team_pool

    Args:
        job_id: Job slug
        member_id: Member slug

    Returns:
        Potential earning in dollars (rounded to 2 decimals)
    """

    # Get job data
    cypher = """
    MATCH (job:U4_Work_Item {slug: $job_slug, work_type: 'job'})
    RETURN job.teamPool AS pool,
           job.interactionCounts AS counts,
           job.totalInteractions AS total
    """

    result = query_graph(cypher, {"job_slug": job_id})

    if not result:
        return 0.0

    data = result[0]
    team_pool = data.get("pool", 0)
    interaction_counts = data.get("counts", {})
    total_interactions = data.get("total", 0)

    member_interactions = interaction_counts.get(member_id, 0)

    if total_interactions == 0:
        return 0.0

    # Calculate earning
    earning = (member_interactions / total_interactions) * team_pool

    # Round to 2 decimals
    return round(earning, 2)


def calculate_all_member_earnings(job_id: str) -> Dict[str, float]:
    """
    Calculate earnings for all members who contributed to job.

    Returns:
        {
            "member_a": 180.00,
            "member_b": 90.00,
            ...
        }
    """

    cypher = """
    MATCH (job:U4_Work_Item {slug: $job_slug, work_type: 'job'})
    RETURN job.interactionCounts AS counts
    """

    result = query_graph(cypher, {"job_slug": job_id})

    if not result:
        return {}

    counts = result[0].get("counts", {})
    earnings = {}

    for member_id in counts.keys():
        earnings[member_id] = calculate_member_earning(job_id, member_id)

    return earnings


def get_total_potential_earnings(member_id: str) -> Dict:
    """
    Get member's total potential earnings across all active jobs + pending missions.

    Returns:
        {
            "totalPotentialEarnings": 164.00,
            "fromJobs": 159.00,
            "fromMissions": 5.00,
            "breakdown": {
                "jobs": [...],
                "missions": [...]
            }
        }
    """

    # 1. Get earnings from all active jobs
    cypher_jobs = """
    MATCH (job:U4_Work_Item {work_type: 'job', scope_ref: 'scopelock'})
    WHERE job.status IN ['active', 'completed']
    RETURN job.slug AS jobId,
           job.name AS title,
           job.interactionCounts AS counts,
           job.totalInteractions AS total,
           job.teamPool AS pool
    """

    job_results = query_graph(cypher_jobs, {})

    job_earnings = 0.0
    jobs_breakdown = []

    for row in job_results:
        job_id = row["jobId"]
        counts = row.get("counts", {})
        member_interactions = counts.get(member_id, 0)

        if member_interactions > 0:
            earning = calculate_member_earning(job_id, member_id)
            job_earnings += earning

            jobs_breakdown.append({
                "jobId": job_id,
                "title": row["title"],
                "yourInteractions": member_interactions,
                "teamTotal": row["total"],
                "potentialEarning": earning
            })

    # 2. Get earnings from completed missions (pending payment)
    cypher_missions = """
    MATCH (mission:U4_Work_Item {work_type: 'mission', scope_ref: 'scopelock'})
    WHERE mission.status = 'completed' AND mission.claimedBy = $member_id
    RETURN mission.slug AS missionId,
           mission.name AS title,
           mission.fixedPayment AS payment
    """

    mission_results = query_graph(cypher_missions, {"member_id": member_id})

    mission_earnings = 0.0
    missions_breakdown = []

    for row in mission_results:
        payment = row.get("payment", 0)
        mission_earnings += payment

        missions_breakdown.append({
            "missionId": row["missionId"],
            "title": row["title"],
            "payment": payment,
            "status": "pending"
        })

    # 3. Calculate total
    total = round(job_earnings + mission_earnings, 2)

    return {
        "totalPotentialEarnings": total,
        "fromJobs": round(job_earnings, 2),
        "fromMissions": round(mission_earnings, 2),
        "breakdown": {
            "jobs": jobs_breakdown,
            "missions": missions_breakdown
        }
    }
```

---

### Step 1.5: Mission Manager Implementation

**File:** `backend/services/compensation/mission_manager.py`

```python
"""
Handle mission claiming, completion, and approval.
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict

from services.graph import query_graph


def get_member_total_interactions(member_id: str) -> int:
    """Get member's total interactions across all jobs."""

    cypher = """
    MATCH (e:U4_Event {actor_ref: $member_id, event_kind: 'message'})
    WHERE e.interaction_context = 'job'
    RETURN count(e) AS total
    """

    result = query_graph(cypher, {"member_id": member_id})
    return result[0]["total"] if result else 0


# NOTE: get_mission_fund_balance() is now in tier_calculator.py
# Import it here for backward compatibility
from services.compensation.tier_calculator import (
    get_mission_fund_balance,
    get_mission_payment,
    get_current_tier
)


def claim_mission(mission_id: str, member_id: str) -> Dict:
    """
    Claim a mission (with validation).
    Payment is calculated dynamically based on current tier.

    Raises:
        ValueError: If validation fails
    """

    # 1. Check member has minimum 5 total interactions
    total_interactions = get_member_total_interactions(member_id)
    if total_interactions < 5:
        raise ValueError(
            f"Need 5+ interactions to claim missions. Currently: {total_interactions}"
        )

    # 2. Check mission exists and is available
    cypher_check = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, work_type: 'mission'})
    RETURN mission.status AS status, mission.missionType AS missionType
    """

    result = query_graph(cypher_check, {"mission_slug": mission_id})

    if not result:
        raise ValueError(f"Mission not found: {mission_id}")

    if result[0]["status"] != "available":
        raise ValueError("Mission not available (already claimed or completed)")

    # 3. Calculate payment based on current tier
    mission_type = result[0]["missionType"]
    tier, fund_balance = get_current_tier()
    mission_payment = float(get_mission_payment(mission_type))

    if fund_balance < mission_payment:
        raise ValueError(
            f"Mission fund insufficient (${fund_balance:.2f} available, need ${mission_payment:.2f})"
        )

    # 4. Update mission status (store calculated payment + tier)
    claimed_at = datetime.utcnow()
    expires_at = claimed_at + timedelta(hours=24)

    cypher_claim = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    SET mission.status = 'claimed',
        mission.claimedBy = $member_id,
        mission.claimedAt = datetime($claimed_at),
        mission.claimExpiresAt = datetime($expires_at),
        mission.fixedPayment = $payment,
        mission.claimTier = $tier,
        mission.updated_at = datetime()
    RETURN mission
    """

    query_graph(cypher_claim, {
        "mission_slug": mission_id,
        "member_id": member_id,
        "claimed_at": claimed_at.isoformat(),
        "expires_at": expires_at.isoformat(),
        "payment": mission_payment,
        "tier": tier
    })

    # 5. Create U4_CLAIMED_BY link
    cypher_link = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    MATCH (agent:U4_Agent {slug: $member_id})
    CREATE (mission)-[:U4_CLAIMED_BY {
      claimed_at: datetime($claimed_at),
      expires_at: datetime($expires_at),
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      visibility: 'partners',
      created_by: $member_id,
      substrate: 'organizational'
    }]->(agent)
    """

    query_graph(cypher_link, {
        "mission_slug": mission_id,
        "member_id": member_id,
        "claimed_at": claimed_at.isoformat(),
        "expires_at": expires_at.isoformat()
    })

    return {
        "missionId": mission_id,
        "status": "claimed",
        "claimedBy": member_id,
        "expiresAt": expires_at.isoformat(),
        "payment": mission_payment,
        "tier": tier
    }


def complete_mission(
    mission_id: str,
    member_id: str,
    proof_url: str,
    proof_notes: str = ""
) -> Dict:
    """
    Mark mission complete (awaiting NLR approval).

    Args:
        mission_id: Mission slug
        member_id: Member who completed
        proof_url: URL or file path proving completion
        proof_notes: Optional notes

    Raises:
        ValueError: If mission not claimed by this member
    """

    # 1. Verify mission claimed by this member
    cypher_check = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, work_type: 'mission'})
    RETURN mission.status AS status, mission.claimedBy AS claimedBy
    """

    result = query_graph(cypher_check, {"mission_slug": mission_id})

    if not result:
        raise ValueError(f"Mission not found: {mission_id}")

    if result[0]["claimedBy"] != member_id:
        raise ValueError("Mission not claimed by you")

    if result[0]["status"] != "claimed":
        raise ValueError(f"Mission status is {result[0]['status']}, expected 'claimed'")

    # 2. Update mission with completion data
    completed_at = datetime.utcnow().isoformat()

    cypher_complete = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    SET mission.status = 'completed',
        mission.completedAt = datetime($completed_at),
        mission.proofUrl = $proof_url,
        mission.proofNotes = $proof_notes,
        mission.updated_at = datetime()
    RETURN mission
    """

    query_graph(cypher_complete, {
        "mission_slug": mission_id,
        "completed_at": completed_at,
        "proof_url": proof_url,
        "proof_notes": proof_notes
    })

    return {
        "missionId": mission_id,
        "status": "completed",
        "pendingApproval": True
    }


def approve_mission(mission_id: str, approved_by: str, approved: bool) -> Dict:
    """
    Approve or reject mission completion (NLR only).

    Args:
        mission_id: Mission slug
        approved_by: NLR slug
        approved: True to approve, False to reject

    Returns:
        {
            "missionId": "...",
            "status": "paid" or "claimed",
            "memberEarnings": 1.00 (if approved),
            "newMissionFundBalance": 149.00 (if approved)
        }
    """

    if not approved:
        # Reject: revert to "claimed" status
        cypher_reject = """
        MATCH (mission:U4_Work_Item {slug: $mission_slug})
        SET mission.status = 'claimed',
            mission.completedAt = null,
            mission.proofUrl = null,
            mission.proofNotes = null,
            mission.updated_at = datetime()
        RETURN mission.claimedBy AS claimedBy
        """

        result = query_graph(cypher_reject, {"mission_slug": mission_id})

        return {
            "missionId": mission_id,
            "status": "claimed",
            "rejected": True
        }

    # Approve: mark as paid
    approved_at = datetime.utcnow().isoformat()

    cypher_approve = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    SET mission.status = 'paid',
        mission.approvedBy = $approved_by,
        mission.approvedAt = datetime($approved_at),
        mission.updated_at = datetime()
    RETURN mission.claimedBy AS claimedBy, mission.fixedPayment AS payment
    """

    result = query_graph(cypher_approve, {
        "mission_slug": mission_id,
        "approved_by": approved_by,
        "approved_at": approved_at
    })

    member_id = result[0]["claimedBy"]
    payment = result[0]["payment"]

    # Update member earnings (will be implemented in payment_processor.py)
    # For now, just return success

    new_balance = get_mission_fund_balance()

    return {
        "missionId": mission_id,
        "status": "paid",
        "memberEarnings": payment,
        "newMissionFundBalance": new_balance
    }


def check_mission_expiry() -> int:
    """
    Check for expired mission claims (24 hours) and revert to 'available'.

    Returns:
        Number of missions reverted

    Should be run periodically (e.g., every hour via cron job).
    """

    now = datetime.utcnow().isoformat()

    cypher = """
    MATCH (mission:U4_Work_Item {work_type: 'mission', status: 'claimed'})
    WHERE mission.claimExpiresAt < datetime($now)
    SET mission.status = 'available',
        mission.claimedBy = null,
        mission.claimedAt = null,
        mission.claimExpiresAt = null,
        mission.updated_at = datetime()
    RETURN count(mission) AS reverted
    """

    result = query_graph(cypher, {"now": now})
    return result[0]["reverted"] if result else 0
```

---

### Step 1.6: Payment Processor Implementation

**File:** `backend/services/compensation/payment_processor.py`

```python
"""
Handle payment triggers and history tracking.
"""

from datetime import datetime
from typing import Dict

from services.graph import query_graph
from services.compensation.earnings_calculator import calculate_member_earning


def is_nlr(member_id: str) -> bool:
    """Check if member has NLR role."""

    cypher = """
    MATCH (agent:U4_Agent {slug: $member_id})
    RETURN agent.slug AS slug
    """

    result = query_graph(cypher, {"member_id": member_id})

    # Simplified check: Only "nlr" slug has permission
    return member_id == "nlr"


def trigger_payment(job_id: str, triggered_by: str, cash_received: bool) -> Dict:
    """
    Trigger payment for completed job (NLR only).

    **NEW: Validates wallet addresses before payment.**

    Args:
        job_id: Job slug
        triggered_by: NLR member slug
        cash_received: True if Upwork payment received

    Returns:
        {
            "jobId": "...",
            "status": "paid",
            "totalPaid": 450.00,
            "memberPayments": {"member_a": 270.00, "member_b": 180.00},
            "notificationsSent": 2,
            "walletValidation": {"member_a": True, "member_b": True}
        }

    Raises:
        PermissionError: If not NLR
        ValueError: If cash not received, job already paid, or wallet not connected
    """

    # 1. Verify NLR role
    if not is_nlr(triggered_by):
        raise PermissionError("Only NLR can trigger payments")

    # 2. Verify cash received
    if not cash_received:
        raise ValueError("Cannot pay before receiving funds from Upwork")

    # 3. Get job data
    cypher_job = """
    MATCH (job:U4_Work_Item {slug: $job_slug, work_type: 'job'})
    RETURN job.teamPool AS pool,
           job.interactionCounts AS counts,
           job.status AS status,
           job.name AS title
    """

    result = query_graph(cypher_job, {"job_slug": job_id})

    if not result:
        raise ValueError(f"Job not found: {job_id}")

    job_data = result[0]

    if job_data["status"] == "paid":
        raise ValueError("Job already paid")

    # 4. Validate wallet addresses for all members (NEW)
    interaction_counts = job_data.get("counts", {})

    cypher_check_wallets = """
    MATCH (agent:U4_Agent {slug: $member_id})
    RETURN agent.walletAddress AS address,
           agent.walletVerified AS verified
    """

    wallet_validation = {}
    members_without_wallet = []

    for member_id in interaction_counts.keys():
        wallet_result = query_graph(cypher_check_wallets, {"member_id": member_id})

        if not wallet_result:
            members_without_wallet.append(member_id)
            wallet_validation[member_id] = False
            continue

        wallet_address = wallet_result[0].get("address")
        wallet_verified = wallet_result[0].get("verified", False)

        if not wallet_address or not wallet_verified:
            members_without_wallet.append(member_id)
            wallet_validation[member_id] = False
        else:
            wallet_validation[member_id] = True

    # Fail if ANY member lacks wallet
    if members_without_wallet:
        raise ValueError(
            f"Cannot pay. These members need to connect wallet: {', '.join(members_without_wallet)}. "
            f"Wallet connection flow: Mission Deck → Settings → Connect Solana Wallet"
        )

    # 5. Calculate final shares
    member_payments = {}

    for member_id in interaction_counts.keys():
        earning = calculate_member_earning(job_id, member_id)
        member_payments[member_id] = earning

    # 6. Update job status to 'paid'
    paid_at = datetime.utcnow().isoformat()

    cypher_update = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    SET job.status = 'paid',
        job.paidAt = datetime($paid_at),
        job.updated_at = datetime()
    RETURN job
    """

    query_graph(cypher_update, {"job_slug": job_id, "paid_at": paid_at})

    # 7. Update each member's paid earnings history
    #    (Store as compensationData.paidEarnings on U4_Agent node)

    for member_id, amount in member_payments.items():
        update_member_paid_earnings(member_id, job_id, amount, job_data["title"])

    # 8. Send notifications (placeholder - actual implementation TBD)
    notifications_sent = len(member_payments)
    for member_id, amount in member_payments.items():
        # TODO: Implement send_payment_notification()
        print(f"Notification: {member_id} earned ${amount:.2f} from {job_data['title']}")

    return {
        "jobId": job_id,
        "status": "paid",
        "totalPaid": round(sum(member_payments.values()), 2),
        "memberPayments": member_payments,
        "walletValidation": wallet_validation,
        "notificationsSent": notifications_sent
    }


def update_member_paid_earnings(
    member_id: str,
    job_id: str,
    amount: float,
    job_title: str
) -> None:
    """
    Update member's paid earnings history.

    Stores data in agent.compensationData.paidEarnings
    """

    # Fetch current compensationData
    cypher_get = """
    MATCH (agent:U4_Agent {slug: $member_id})
    RETURN agent.compensationData AS data
    """

    result = query_graph(cypher_get, {"member_id": member_id})
    compensation_data = result[0].get("data", {}) if result else {}

    # Initialize if missing
    if not compensation_data:
        compensation_data = {
            "totalInteractions": 0,
            "potentialEarnings": 0.0,
            "paidEarnings": 0.0,
            "jobEarnings": {},
            "missionEarnings": {},
            "paidHistory": []
        }

    # Add to paid history
    compensation_data["paidHistory"].append({
        "jobId": job_id,
        "title": job_title,
        "amount": amount,
        "paidAt": datetime.utcnow().isoformat()
    })

    # Update total paid earnings
    compensation_data["paidEarnings"] = round(
        compensation_data.get("paidEarnings", 0) + amount,
        2
    )

    # Remove from job earnings (no longer potential)
    if job_id in compensation_data.get("jobEarnings", {}):
        del compensation_data["jobEarnings"][job_id]

    # Write back
    cypher_update = """
    MATCH (agent:U4_Agent {slug: $member_id})
    SET agent.compensationData = $data,
        agent.updated_at = datetime()
    """

    query_graph(cypher_update, {
        "member_id": member_id,
        "data": compensation_data
    })


def get_payment_history(member_id: str) -> Dict:
    """
    Get member's payment history.

    Returns:
        {
            "totalPaid": 450.00,
            "history": [
                {
                    "jobId": "...",
                    "title": "...",
                    "amount": 120.00,
                    "paidAt": "2025-11-01T10:00:00Z"
                },
                ...
            ]
        }
    """

    cypher = """
    MATCH (agent:U4_Agent {slug: $member_id})
    RETURN agent.compensationData AS data
    """

    result = query_graph(cypher, {"member_id": member_id})
    compensation_data = result[0].get("data", {}) if result else {}

    paid_history = compensation_data.get("paidHistory", [])
    total_paid = compensation_data.get("paidEarnings", 0.0)

    return {
        "totalPaid": total_paid,
        "history": paid_history
    }
```

---

### Step 1.7: WebSocket Manager Implementation

**File:** `backend/services/websocket_manager.py`

**Purpose:** Manage WebSocket connections for real-time personal earnings updates.

```python
"""
WebSocket manager for real-time compensation updates.
Sends updates to individual members (personal earnings only).
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json
import asyncio
from datetime import datetime


# Active WebSocket connections: {member_id: Set[WebSocket]}
active_connections: Dict[str, Set[WebSocket]] = {}


async def connect_member(websocket: WebSocket, member_id: str):
    """
    Accept WebSocket connection and add to active connections.

    Args:
        websocket: FastAPI WebSocket instance
        member_id: Member slug (e.g., "member_a")
    """

    await websocket.accept()

    # Add to active connections
    if member_id not in active_connections:
        active_connections[member_id] = set()

    active_connections[member_id].add(websocket)

    # Send initial connection confirmation
    await websocket.send_json({
        "event": "connected",
        "memberId": member_id,
        "timestamp": datetime.utcnow().isoformat()
    })

    print(f"[WebSocket] Member {member_id} connected. Total connections: {len(active_connections[member_id])}")


async def disconnect_member(websocket: WebSocket, member_id: str):
    """
    Remove WebSocket from active connections.

    Args:
        websocket: FastAPI WebSocket instance
        member_id: Member slug
    """

    if member_id in active_connections:
        active_connections[member_id].discard(websocket)

        # Remove member key if no more connections
        if not active_connections[member_id]:
            del active_connections[member_id]

    print(f"[WebSocket] Member {member_id} disconnected.")


def broadcast_to_member(member_id: str, data: dict):
    """
    Broadcast message to all WebSocket connections for a specific member.
    (Synchronous version - wraps async call)

    Args:
        member_id: Member slug
        data: Message data (will be sent as JSON)
    """

    asyncio.create_task(async_broadcast_to_member(member_id, data))


async def async_broadcast_to_member(member_id: str, data: dict):
    """
    Async broadcast to specific member's connections.

    Events sent:
    - "interaction_counted": When member sends message
    - "mission_claimed": When member claims mission
    - "mission_completed": When member completes mission
    - "job_payment_received": When job pays out
    """

    if member_id not in active_connections:
        # Member not connected, skip (they'll get update on reconnect)
        return

    disconnected = []

    for websocket in active_connections[member_id]:
        try:
            await websocket.send_json({
                **data,
                "timestamp": datetime.utcnow().isoformat()
            })

        except Exception as e:
            print(f"[WebSocket] Error sending to {member_id}: {e}")
            disconnected.append(websocket)

    # Clean up disconnected websockets
    for websocket in disconnected:
        await disconnect_member(websocket, member_id)
```

**FastAPI WebSocket endpoint:**

```python
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.websocket_manager import connect_member, disconnect_member

router = APIRouter()

@router.websocket("/api/compensation/ws/{member_id}")
async def websocket_compensation_endpoint(websocket: WebSocket, member_id: str):
    """
    WebSocket endpoint for real-time compensation updates.

    Client connects: ws://api/compensation/ws/member_a

    Events received by client:
    - "connected": Initial connection confirmation
    - "interaction_counted": Your interaction count updated
    - "mission_claimed": You claimed a mission
    - "mission_completed": You completed a mission
    - "job_payment_received": You received payment
    """

    await connect_member(websocket, member_id)

    try:
        while True:
            # Keep connection alive, listen for pings
            message = await websocket.receive_text()

            if message == "ping":
                await websocket.send_text("pong")

    except WebSocketDisconnect:
        await disconnect_member(websocket, member_id)
```

---

### Step 1.8: Team Leaderboard Implementation (NEW)

**File:** `backend/services/compensation/team_leaderboard.py`

**Purpose:** Get team-wide potential earnings leaderboard. **Requires wallet connection.**

```python
"""
Team leaderboard for potential earnings (requires wallet connection).
"""

from typing import List, Dict
from services.graph import query_graph


def get_team_leaderboard() -> List[Dict]:
    """
    Get team-wide potential earnings leaderboard.

    **NEW: Only includes members with connected wallets.**

    Returns:
        [
            {
                "rank": 1,
                "memberId": "member_a",
                "name": "Alice",
                "potentialEarnings": 450.00,
                "walletAddress": "9xQe...rGtX" (truncated)
            },
            ...
        ]

    Privacy constraints:
    - Only shows potential earnings (NOT paid)
    - Only shows totals (NOT per-job breakdown)
    - Only includes members with walletAddress IS NOT NULL
    """

    # Query members with wallet addresses, ordered by potential earnings
    cypher = """
    MATCH (agent:U4_Agent)
    WHERE agent.walletAddress IS NOT NULL
      AND agent.walletVerified = true
    RETURN agent.slug AS memberId,
           agent.name AS name,
           agent.potentialEarnings AS potentialEarnings,
           agent.walletAddress AS walletAddress
    ORDER BY agent.potentialEarnings DESC
    """

    results = query_graph(cypher, {})

    leaderboard = []

    for idx, row in enumerate(results):
        wallet_full = row.get("walletAddress", "")
        # Truncate wallet: show first 4 and last 4 chars
        wallet_truncated = f"{wallet_full[:4]}...{wallet_full[-4:]}" if len(wallet_full) > 8 else wallet_full

        leaderboard.append({
            "rank": idx + 1,
            "memberId": row["memberId"],
            "name": row.get("name", row["memberId"]),
            "potentialEarnings": round(row.get("potentialEarnings", 0), 2),
            "walletAddress": wallet_truncated
        })

    return leaderboard


def get_team_total_potential() -> float:
    """
    Get total team potential earnings (sum across all members with wallets).

    Returns:
        Total potential earnings (e.g., 1040.50)
    """

    cypher = """
    MATCH (agent:U4_Agent)
    WHERE agent.walletAddress IS NOT NULL
      AND agent.walletVerified = true
    RETURN sum(agent.potentialEarnings) AS total
    """

    result = query_graph(cypher, {})
    total = result[0].get("total", 0) if result else 0

    return round(total, 2)


def check_member_has_wallet(member_id: str) -> Dict:
    """
    Check if member has connected wallet (for leaderboard access gate).

    Args:
        member_id: Member slug

    Returns:
        {
            "hasWallet": True/False,
            "walletAddress": "9xQe...rGtX" or None,
            "walletVerified": True/False
        }
    """

    cypher = """
    MATCH (agent:U4_Agent {slug: $member_id})
    RETURN agent.walletAddress AS address,
           agent.walletVerified AS verified
    """

    result = query_graph(cypher, {"member_id": member_id})

    if not result:
        return {
            "hasWallet": False,
            "walletAddress": None,
            "walletVerified": False
        }

    address = result[0].get("address")
    verified = result[0].get("verified", False)

    has_wallet = bool(address) and verified

    # Truncate for display
    address_truncated = None
    if address:
        address_truncated = f"{address[:4]}...{address[-4:]}"

    return {
        "hasWallet": has_wallet,
        "walletAddress": address_truncated,
        "walletVerified": verified
    }
```

**WebSocket Update for Leaderboard:**

Update `backend/services/websocket_manager.py` to broadcast leaderboard updates:

```python
def broadcast_leaderboard_update():
    """
    Broadcast leaderboard update to ALL members with wallets.
    Called when any member's potential earnings change.
    """

    from services.compensation.team_leaderboard import get_team_leaderboard, get_team_total_potential

    leaderboard = get_team_leaderboard()
    team_total = get_team_total_potential()

    # Broadcast to all connected members
    for member_id in active_connections.keys():
        asyncio.create_task(async_broadcast_to_member(member_id, {
            "event": "leaderboard_updated",
            "leaderboard": leaderboard,
            "teamTotal": team_total
        }))
```

**Integration with interaction tracker:**

Update `interaction_tracker.py` to trigger leaderboard broadcast after earnings update:

```python
# In track_interaction() function, after broadcasting to member:

# 8. Broadcast leaderboard update to all members (NEW)
from services.websocket_manager import broadcast_leaderboard_update

broadcast_leaderboard_update()
```

---

## Phase 2: API Endpoints (Day 3)

### Step 2.1: Create Compensation Router

**File:** `backend/routers/compensation.py`

```python
"""
Compensation API endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from services.compensation import (
    track_interaction,
    get_interaction_history,
    calculate_all_member_earnings,
    get_total_potential_earnings,
    claim_mission,
    complete_mission,
    approve_mission,
    trigger_payment,
    get_payment_history
)
from auth import get_current_user, User, require_nlr

router = APIRouter(prefix="/api/compensation", tags=["compensation"])


# ----- Request/Response Models -----

class CreateJobRequest(BaseModel):
    title: str
    client: str
    value: float
    dueDate: Optional[str] = None


class TrackInteractionRequest(BaseModel):
    jobId: str
    memberId: str
    message: str
    aiRecipient: str


class ClaimMissionRequest(BaseModel):
    memberId: str


class CompleteMissionRequest(BaseModel):
    memberId: str
    proofUrl: str
    proofNotes: Optional[str] = ""


class ApproveMissionRequest(BaseModel):
    approvedBy: str
    approved: bool


class TriggerPaymentRequest(BaseModel):
    triggeredBy: str
    cashReceived: bool


# ----- Jobs Endpoints -----

@router.post("/jobs")
async def create_job(req: CreateJobRequest):
    """Create new job."""
    # Implementation similar to create_test_job()
    # (Omitted for brevity - see MECHANISM.md for full schema)
    pass


@router.get("/jobs")
async def list_jobs(
    status: Optional[str] = None,
    memberId: Optional[str] = None
):
    """List all jobs."""
    pass


@router.get("/jobs/{job_id}/interactions")
async def get_job_interactions(job_id: str):
    """Get interaction history for a job."""
    pass


# ----- Interactions Endpoints -----

@router.post("/interactions")
async def create_interaction(req: TrackInteractionRequest):
    """Track new interaction (called when message sent)."""

    try:
        result = track_interaction(
            job_id=req.jobId,
            member_id=req.memberId,
            message=req.message,
            ai_recipient=req.aiRecipient
        )
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ----- Missions Endpoints -----

@router.get("/missions")
async def list_missions(
    status: Optional[str] = None,
    type: Optional[str] = None
):
    """List available missions."""
    pass


@router.post("/missions/{mission_id}/claim")
async def create_mission_claim(mission_id: str, req: ClaimMissionRequest):
    """Claim a mission."""

    try:
        result = claim_mission(mission_id, req.memberId)
        return result

    except ValueError as e:
        if "Need 5+ interactions" in str(e):
            raise HTTPException(status_code=403, detail=str(e))
        elif "not available" in str(e):
            raise HTTPException(status_code=409, detail=str(e))
        else:
            raise HTTPException(status_code=400, detail=str(e))


@router.post("/missions/{mission_id}/complete")
async def create_mission_completion(mission_id: str, req: CompleteMissionRequest):
    """Mark mission complete (with proof)."""

    try:
        result = complete_mission(
            mission_id,
            req.memberId,
            req.proofUrl,
            req.proofNotes
        )
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/missions/{mission_id}/approve")
@require_nlr
async def create_mission_approval(mission_id: str, req: ApproveMissionRequest):
    """Approve mission completion (NLR only)."""

    result = approve_mission(mission_id, req.approvedBy, req.approved)
    return result


# ----- Earnings Endpoints -----

@router.get("/earnings/{member_id}")
async def get_member_earnings(member_id: str):
    """Get member's complete earnings breakdown."""

    result = get_total_potential_earnings(member_id)
    paid_history = get_payment_history(member_id)

    return {
        **result,
        "totalPaidEarnings": paid_history["totalPaid"],
        "paidHistory": paid_history["history"]
    }


# ----- Team Leaderboard Endpoints (NEW) -----

@router.get("/team/leaderboard")
async def get_leaderboard(member_id: str):
    """
    Get team leaderboard (requires wallet connection).

    Args:
        member_id: Current member slug (to check wallet requirement)

    Returns:
        {
            "hasWallet": True,
            "leaderboard": [...],
            "teamTotal": 1040.50,
            "yourRank": 2
        }

    Raises:
        HTTPException 403: If member doesn't have wallet connected
    """

    from services.compensation.team_leaderboard import (
        check_member_has_wallet,
        get_team_leaderboard,
        get_team_total_potential
    )

    # Check wallet requirement
    wallet_status = check_member_has_wallet(member_id)

    if not wallet_status["hasWallet"]:
        raise HTTPException(
            status_code=403,
            detail={
                "error": "wallet_required",
                "message": "Connect your Solana wallet to view team leaderboard",
                "walletConnectionFlow": "Mission Deck → Settings → Connect Solana Wallet"
            }
        )

    # Get leaderboard
    leaderboard = get_team_leaderboard()
    team_total = get_team_total_potential()

    # Find current member's rank
    your_rank = None
    for entry in leaderboard:
        if entry["memberId"] == member_id:
            your_rank = entry["rank"]
            break

    return {
        "hasWallet": True,
        "walletAddress": wallet_status["walletAddress"],
        "leaderboard": leaderboard,
        "teamTotal": team_total,
        "yourRank": your_rank
    }


@router.get("/team/wallet-status/{member_id}")
async def get_wallet_status(member_id: str):
    """
    Check if member has wallet connected (for leaderboard gate).

    Returns:
        {
            "hasWallet": True/False,
            "walletAddress": "9xQe...rGtX" or None,
            "walletVerified": True/False
        }
    """

    from services.compensation.team_leaderboard import check_member_has_wallet

    return check_member_has_wallet(member_id)


# ----- Payments Endpoints -----

@router.post("/payments/trigger")
@require_nlr
async def create_payment_trigger(req: TriggerPaymentRequest):
    """Trigger payment for completed job (NLR only)."""

    try:
        result = trigger_payment(
            job_id=req.jobId,
            triggered_by=req.triggeredBy,
            cash_received=req.cashReceived
        )
        return result

    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## Phase 3: Frontend Implementation (Day 4-5)

### Step 3.1: Create Zustand Store

**File:** `frontend/stores/compensationStore.ts`

```typescript
import create from 'zustand';

interface Job {
  id: string;
  title: string;
  client: string;
  value: number;
  teamPool: number;
  status: 'active' | 'completed' | 'paid';
  yourInteractions: number;
  teamTotal: number;
  yourPotentialEarning: number;
}

interface Mission {
  id: string;
  title: string;
  type: 'proposal' | 'recruitment' | 'social' | 'other';
  fixedPayment: number;
  status: 'available' | 'claimed' | 'completed' | 'paid';
  canClaim: boolean;
}

interface CompensationState {
  totalPotentialEarnings: number;
  jobs: Job[];
  missions: Mission[];
  missionFundBalance: number;

  // Actions
  setTotalEarnings: (amount: number) => void;
  updateJobInteraction: (jobId: string, newCount: number, newEarning: number) => void;
  setJobs: (jobs: Job[]) => void;
  setMissions: (missions: Mission[]) => void;
}

export const useCompensationStore = create<CompensationState>((set) => ({
  totalPotentialEarnings: 0,
  jobs: [],
  missions: [],
  missionFundBalance: 0,

  setTotalEarnings: (amount) => set({ totalPotentialEarnings: amount }),

  updateJobInteraction: (jobId, newCount, newEarning) => set((state) => ({
    jobs: state.jobs.map(job =>
      job.id === jobId
        ? {
            ...job,
            yourInteractions: newCount,
            yourPotentialEarning: newEarning
          }
        : job
    )
  })),

  setJobs: (jobs) => set({ jobs }),
  setMissions: (missions) => set({ missions }),
}));
```

---

### Step 3.2: Create Earnings Banner Component

**File:** `frontend/components/EarningsBanner.tsx`

```typescript
'use client';

import { useCompensationStore } from '@/stores/compensationStore';

export function EarningsBanner() {
  const totalEarnings = useCompensationStore((state) => state.totalPotentialEarnings);

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">YOUR TOTAL POTENTIAL EARNINGS</p>
          <p className="text-4xl font-bold" data-testid="total-earnings">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>

        <button
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          onClick={() => {
            // Open earnings breakdown modal
          }}
        >
          View Breakdown
        </button>
      </div>
    </div>
  );
}
```

---

### Step 3.3: Team Leaderboard Component (NEW)

**File:** `frontend/components/TeamLeaderboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  memberId: string;
  name: string;
  potentialEarnings: number;
  walletAddress: string;
}

interface TeamLeaderboardProps {
  memberId: string;
}

export function TeamLeaderboard({ memberId }: TeamLeaderboardProps) {
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teamTotal, setTeamTotal] = useState<number>(0);
  const [yourRank, setYourRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(`/api/compensation/team/leaderboard?member_id=${memberId}`);

        if (response.status === 403) {
          // Wallet not connected
          setHasWallet(false);
          setLoading(false);
          return;
        }

        const data = await response.json();

        setHasWallet(true);
        setLeaderboard(data.leaderboard);
        setTeamTotal(data.teamTotal);
        setYourRank(data.yourRank);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [memberId]);

  // Listen for WebSocket updates
  useEffect(() => {
    // WebSocket connection managed by useEarningsWebSocket hook
    // This component just listens to Zustand store updates

    const handleLeaderboardUpdate = (event: CustomEvent) => {
      const { leaderboard: newLeaderboard, teamTotal: newTotal } = event.detail;
      setLeaderboard(newLeaderboard);
      setTeamTotal(newTotal);

      // Recalculate your rank
      const entry = newLeaderboard.find((e: LeaderboardEntry) => e.memberId === memberId);
      setYourRank(entry ? entry.rank : null);
    };

    window.addEventListener('leaderboard_updated', handleLeaderboardUpdate as EventListener);

    return () => {
      window.removeEventListener('leaderboard_updated', handleLeaderboardUpdate as EventListener);
    };
  }, [memberId]);

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  // Wallet not connected - show prompt
  if (hasWallet === false) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Connect Your Solana Wallet</h3>
        <p className="text-gray-600 mb-4">
          Required to receive payments and view team leaderboard
        </p>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          onClick={() => {
            // Open wallet connection flow
            window.location.href = '/deck/settings?action=connect-wallet';
          }}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  // Wallet connected - show leaderboard
  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Team Potential Earnings Leaderboard</h2>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="text-sm text-gray-600">Team Total</p>
        <p className="text-3xl font-bold text-blue-600">${teamTotal.toFixed(2)}</p>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Rank</th>
            <th className="text-left py-2">Name</th>
            <th className="text-right py-2">Potential Earnings</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr
              key={entry.memberId}
              className={`border-b ${
                entry.memberId === memberId ? 'bg-yellow-50 font-semibold' : ''
              }`}
              data-testid={entry.memberId === memberId ? 'your-row' : undefined}
            >
              <td className="py-3">#{entry.rank}</td>
              <td className="py-3">{entry.name}</td>
              <td className="py-3 text-right text-green-600 font-semibold">
                ${entry.potentialEarnings.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {yourRank && (
        <div className="mt-4 p-3 bg-green-50 rounded text-center">
          <p className="text-sm text-gray-600">Your Rank</p>
          <p className="text-2xl font-bold text-green-600">#{yourRank}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Privacy: Only shows potential earnings (not paid), no per-job breakdown.</p>
        <p>Real-time: Updates automatically when any team member's earnings change.</p>
      </div>
    </div>
  );
}
```

---

### Step 3.4: Create Job Card Component

**File:** `frontend/components/JobCard.tsx`

```typescript
'use client';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    client: string;
    value: number;
    yourInteractions: number;
    teamTotal: number;
    yourPotentialEarning: number;
    status: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{job.title}</h3>
      <p className="text-sm text-gray-600">Client: {job.client}</p>
      <p className="text-sm text-gray-600">Value: ${job.value.toFixed(2)}</p>

      <div className="mt-3 space-y-1">
        <p className="text-sm">
          <span className="text-gray-600">Your interactions:</span>{' '}
          <span className="font-semibold" data-testid="your-interactions">
            {job.yourInteractions}
          </span>
        </p>

        <p className="text-sm">
          <span className="text-gray-600">Team total:</span>{' '}
          <span className="font-semibold" data-testid="team-total">
            {job.teamTotal}
          </span>
        </p>

        <p className="text-base font-bold text-green-600" data-testid="potential-earning">
          Earning at job completion: ${job.yourPotentialEarning.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          View Details
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-300">
          Message AI
        </button>
      </div>
    </div>
  );
}
```

---

### Step 3.5: Real-Time Updates with WebSocket (Updated)

**File:** `frontend/hooks/useEarningsWebSocket.ts`

```typescript
import { useEffect, useRef } from 'react';
import { useCompensationStore } from '@/stores/compensationStore';

export function useEarningsWebSocket(memberId: string) {
  const setTotalEarnings = useCompensationStore((state) => state.setTotalEarnings);
  const updateJobInteraction = useCompensationStore((state) => state.updateJobInteraction);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/compensation/ws/${memberId}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WebSocket] Connected');

      // Send ping every 30 seconds to keep connection alive
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('ping');
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle different event types
      switch (data.event) {
        case 'connected':
          console.log('[WebSocket] Connection confirmed');
          break;

        case 'interaction_counted':
          // Update your interaction count and earning for this job
          updateJobInteraction(
            data.jobId,
            data.yourInteractions,
            data.yourPotentialEarning
          );
          console.log('[WebSocket] Interaction counted:', data);
          break;

        case 'leaderboard_updated':
          // NEW: Broadcast leaderboard update to all team members
          console.log('[WebSocket] Leaderboard updated:', data);

          // Dispatch custom event for TeamLeaderboard component to listen
          const leaderboardEvent = new CustomEvent('leaderboard_updated', {
            detail: {
              leaderboard: data.leaderboard,
              teamTotal: data.teamTotal
            }
          });
          window.dispatchEvent(leaderboardEvent);
          break;

        case 'mission_claimed':
          console.log('[WebSocket] Mission claimed:', data);
          // Could update UI to show claimed mission
          break;

        case 'mission_completed':
          console.log('[WebSocket] Mission completed:', data);
          break;

        case 'job_payment_received':
          console.log('[WebSocket] Payment received:', data);
          // Could show celebration notification!
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    ws.onclose = () => {
      console.log('[WebSocket] Disconnected');
    };

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [memberId, setTotalEarnings, updateJobInteraction]);

  return wsRef;
}
```

**Usage in component:**

```typescript
'use client';

import { useEarningsWebSocket } from '@/hooks/useEarningsWebSocket';

export function MissionDeckConsole({ memberId }: { memberId: string }) {
  // Connect WebSocket for real-time updates
  useEarningsWebSocket(memberId);

  return (
    <div>
      {/* Your Mission Deck UI */}
    </div>
  );
}
```

---

## Phase 4: Testing (Day 6)

### Step 4.1: Backend Tests

See VALIDATION.md for complete test specifications.

**Run tests:**
```bash
pytest tests/backend/test_compensation_*.py -v --cov=services/compensation
```

---

### Step 4.2: Frontend Tests

**Run tests:**
```bash
npm test -- tests/frontend/compensation*.test.tsx
```

---

### Step 4.3: E2E Tests

**Run tests:**
```bash
npx playwright test tests/e2e/compensation-flow.spec.ts
```

---

## Phase 5: Deployment (Day 7)

### Step 5.1: Database Migration

No explicit migrations needed (FalkorDB is schema-free), but create seed data:

```bash
python3 scripts/seed-compensation-test-data.py
```

---

### Step 5.2: Deploy Backend

```bash
# Push to main branch (triggers Render deployment)
git push origin main
```

---

### Step 5.3: Deploy Frontend

```bash
# Push to main branch (triggers Vercel deployment)
git push origin main
```

---

## Complete Implementation Checklist

- [ ] Phase 1: Backend services
  - [ ] Interaction tracker (track_interaction, get_interaction_history)
  - [ ] Earnings calculator (calculate_member_earning, get_total_potential_earnings)
  - [ ] Mission manager (claim_mission, complete_mission, approve_mission)
  - [ ] Payment processor with **wallet validation** (trigger_payment checks walletAddress)
  - [ ] **Team leaderboard service** (get_team_leaderboard, check_member_has_wallet)
  - [ ] WebSocket manager with **leaderboard broadcast** (broadcast_leaderboard_update)
- [ ] Phase 2: API endpoints
  - [ ] Jobs (create, list, get interactions)
  - [ ] Interactions (track interaction)
  - [ ] Missions (list, claim, complete, approve)
  - [ ] Earnings (get member earnings)
  - [ ] **Team leaderboard** (GET /team/leaderboard, GET /team/wallet-status)
  - [ ] Payments (trigger payment with wallet validation)
- [ ] Phase 3: Frontend UI
  - [ ] Zustand store (compensation state management)
  - [ ] Earnings banner (total potential earnings)
  - [ ] Job cards (your interactions, potential earning)
  - [ ] Mission cards (available missions, claim/complete)
  - [ ] **Team leaderboard component** (wallet gate, live updates via WebSocket)
  - [ ] **WebSocket hook updated** (handle leaderboard_updated events)
- [ ] Phase 4: Tests
  - [ ] Backend pytest (interaction tracking, earnings, missions, **wallet validation**, **leaderboard**)
  - [ ] Frontend Vitest (components, hooks, **leaderboard UI**, **wallet gate**)
  - [ ] E2E Playwright (complete flows, **wallet connection**, **leaderboard access**)
- [ ] Phase 5: Deployment
  - [ ] Render backend (with wallet validation logic)
  - [ ] Vercel frontend (with team leaderboard page)
  - [ ] Seed data (test team members with wallet addresses)
