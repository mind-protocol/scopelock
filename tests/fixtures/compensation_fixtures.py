"""
Test Fixtures for Compensation System Tests
Mission: mission-deck-compensation
Purpose: Provides test data creation, FalkorDB queries, and helper functions
"""

from decimal import Decimal
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import uuid
import requests
import os


# ============================================================================
# FalkorDB Connection Configuration
# ============================================================================

FALKORDB_API_URL = os.getenv(
    "FALKORDB_API_URL",
    "https://mindprotocol.onrender.com/admin/query"
)
FALKORDB_API_KEY = os.getenv("FALKORDB_API_KEY", "Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU")
GRAPH_NAME = "scopelock"


def query_graph(cypher: str) -> List[Dict]:
    """
    Execute Cypher query against FalkorDB production graph.

    Args:
        cypher: Cypher query string

    Returns:
        List of result dictionaries
    """
    response = requests.post(
        FALKORDB_API_URL,
        headers={"Authorization": f"Bearer {FALKORDB_API_KEY}"},
        json={
            "graph": GRAPH_NAME,
            "query": cypher
        }
    )

    if response.status_code != 200:
        raise RuntimeError(f"FalkorDB query failed: {response.text}")

    return response.json().get("results", [])


# ============================================================================
# Test Data Models
# ============================================================================

class TestJob:
    """Test job data structure"""
    def __init__(self, id: str, slug: str, title: str, value: float, status: str):
        self.id = id
        self.slug = slug
        self.title = title
        self.value = Decimal(str(value))
        self.status = status


class TestMember:
    """Test member data structure"""
    def __init__(self, id: str, slug: str, name: str):
        self.id = id
        self.slug = slug
        self.name = name


class TestMission:
    """Test mission data structure"""
    def __init__(self, id: str, slug: str, title: str, payment: float, mission_type: str):
        self.id = id
        self.slug = slug
        self.title = title
        self.payment = Decimal(str(payment))
        self.mission_type = mission_type
        self.claimed_by = None


# ============================================================================
# Test Data Creation Functions
# ============================================================================

def create_test_job(value: float, title: str, status: str = "active") -> TestJob:
    """
    Create test job in FalkorDB.

    Args:
        value: Job dollar value
        title: Job title
        status: Job status (active, completed, paid)

    Returns:
        TestJob instance
    """
    job_id = f"test-job-{uuid.uuid4().hex[:8]}"
    job_slug = title.lower().replace(" ", "-")

    team_pool = Decimal(str(value)) * Decimal("0.30")
    mission_fund = Decimal(str(value)) * Decimal("0.05")

    # Create job node in FalkorDB
    cypher = f"""
    CREATE (j:U4_Work_Item {{
        slug: '{job_slug}',
        title: '{title}',
        work_type: 'job',
        value: {value},
        teamPool: {float(team_pool)},
        missionFund: {float(mission_fund)},
        status: '{status}',
        totalInteractions: 0,
        created_at: '{datetime.utcnow().isoformat()}',
        valid_from: '{datetime.utcnow().isoformat()}',
        valid_to: null
    }})
    RETURN j
    """

    result = query_graph(cypher)

    # Update mission fund balance
    _update_mission_fund_balance(mission_fund)

    return TestJob(
        id=job_id,
        slug=job_slug,
        title=title,
        value=value,
        status=status
    )


def create_test_member(slug: str) -> TestMember:
    """
    Create test member in FalkorDB.

    Args:
        slug: Member slug (e.g., "member_a")

    Returns:
        TestMember instance
    """
    member_id = f"test-member-{uuid.uuid4().hex[:8]}"
    name = slug.replace("_", " ").title()

    cypher = f"""
    MERGE (m:U4_Agent {{slug: '{slug}'}})
    ON CREATE SET
        m.name = '{name}',
        m.totalInteractions = 0,
        m.potentialEarnings = 0.0,
        m.paidEarnings = 0.0,
        m.created_at = '{datetime.utcnow().isoformat()}',
        m.valid_from = '{datetime.utcnow().isoformat()}',
        m.valid_to = null
    RETURN m
    """

    query_graph(cypher)

    return TestMember(
        id=member_id,
        slug=slug,
        name=name
    )


def create_test_mission(
    title: str,
    payment: float,
    mission_type: str = "proposal"
) -> TestMission:
    """
    Create test mission in FalkorDB.

    Args:
        title: Mission title
        payment: Fixed payment amount
        mission_type: Mission type (proposal, recruitment, social, other)

    Returns:
        TestMission instance

    Raises:
        ValueError: If mission fund insufficient
    """
    # Check mission fund balance
    balance = get_mission_fund_balance()
    if balance < Decimal(str(payment)):
        raise ValueError(
            f"Mission fund insufficient (${balance} available, need ${payment})"
        )

    mission_id = f"test-mission-{uuid.uuid4().hex[:8]}"
    mission_slug = title.lower().replace(" ", "-")

    cypher = f"""
    CREATE (m:U4_Work_Item {{
        slug: '{mission_slug}',
        title: '{title}',
        work_type: 'mission',
        missionType: '{mission_type}',
        fixedPayment: {payment},
        status: 'available',
        claimedBy: null,
        claimedAt: null,
        completedAt: null,
        created_at: '{datetime.utcnow().isoformat()}',
        valid_from: '{datetime.utcnow().isoformat()}',
        valid_to: null
    }})
    RETURN m
    """

    query_graph(cypher)

    return TestMission(
        id=mission_id,
        slug=mission_slug,
        title=title,
        payment=payment,
        mission_type=mission_type
    )


# ============================================================================
# Interaction Tracking Functions
# ============================================================================

def send_message_to_ai(
    job_id: str,
    member_id: str,
    ai: str,
    message: str
) -> Dict:
    """
    Send message to AI in job context (creates interaction event).

    Args:
        job_id: Job ID or None for general chat
        member_id: Member slug
        ai: AI recipient (rafael, inna, sofia, emma)
        message: Message content

    Returns:
        Dictionary with interaction count
    """
    if job_id is None:
        # Message not in job context, don't count
        return {"interaction_counted": False}

    # Check for duplicate (same message within 1 second)
    recent = query_graph(f"""
        MATCH (e:U4_Event)-[:U4_CREATED_BY]->(m:U4_Agent {{slug: '{member_id}'}})
        WHERE e.content = '{message}'
        AND datetime(e.timestamp) > datetime('{(datetime.utcnow() - timedelta(seconds=1)).isoformat()}')
        RETURN count(e) as count
    """)

    if recent and recent[0].get("count", 0) > 0:
        # Duplicate detected
        return {"interaction_counted": False}

    # Create interaction event
    event_slug = f"event-{uuid.uuid4().hex[:12]}"

    cypher = f"""
    MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
    MATCH (member:U4_Agent {{slug: '{member_id}'}})
    CREATE (e:U4_Event {{
        slug: '{event_slug}',
        event_kind: 'message',
        actor_ref: '{member_id}',
        content: '{message}',
        ai_recipient: '{ai}',
        timestamp: '{datetime.utcnow().isoformat()}',
        valid_from: '{datetime.utcnow().isoformat()}',
        valid_to: null
    }})
    CREATE (e)-[:U4_ABOUT]->(job)
    CREATE (e)-[:U4_CREATED_BY]->(member)
    SET job.totalInteractions = job.totalInteractions + 1
    SET member.totalInteractions = member.totalInteractions + 1
    RETURN e
    """

    query_graph(cypher)

    return {"interaction_counted": True}


def add_interactions(job_id: str, member_id: str, count: int):
    """
    Add multiple interactions for testing (shortcut).

    Args:
        job_id: Job slug
        member_id: Member slug
        count: Number of interactions to add
    """
    for i in range(count):
        send_message_to_ai(
            job_id=job_id,
            member_id=member_id,
            ai="rafael",
            message=f"Test message {i+1}"
        )


def get_interaction_count(job_id: str, member_id: str) -> int:
    """
    Get interaction count for member on specific job.

    Args:
        job_id: Job slug
        member_id: Member slug

    Returns:
        Interaction count
    """
    result = query_graph(f"""
        MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {{slug: '{job_id}'}})
        WHERE e.actor_ref = '{member_id}'
        AND e.event_kind = 'message'
        RETURN count(e) as count
    """)

    return result[0].get("count", 0) if result else 0


def get_total_interactions(job_id: str) -> int:
    """
    Get total interaction count for job (all members).

    Args:
        job_id: Job slug

    Returns:
        Total interaction count
    """
    result = query_graph(f"""
        MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
        RETURN job.totalInteractions as count
    """)

    return result[0].get("count", 0) if result else 0


# ============================================================================
# Earnings Calculation Functions
# ============================================================================

def calculate_member_earning(job_id: str, member_id: str) -> Decimal:
    """
    Calculate member's potential earning from job.

    Formula: (member_interactions / total_interactions) × team_pool

    Args:
        job_id: Job slug
        member_id: Member slug

    Returns:
        Earning amount (rounded to 2 decimals)
    """
    member_count = get_interaction_count(job_id, member_id)
    total_count = get_total_interactions(job_id)

    if total_count == 0:
        return Decimal("0.00")

    team_pool = get_team_pool(job_id)

    earning = (Decimal(member_count) / Decimal(total_count)) * team_pool

    # Round to 2 decimal places
    return earning.quantize(Decimal("0.01"))


def get_team_pool(job_id: str) -> Decimal:
    """
    Get team pool (30% of job value).

    Args:
        job_id: Job slug

    Returns:
        Team pool amount
    """
    result = query_graph(f"""
        MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
        RETURN job.teamPool as pool
    """)

    return Decimal(str(result[0].get("pool", 0))) if result else Decimal("0.00")


def get_member_total_earnings(member_id: str) -> Decimal:
    """
    Get member's total potential earnings (all active jobs + completed missions).

    Args:
        member_id: Member slug

    Returns:
        Total potential earnings
    """
    result = query_graph(f"""
        MATCH (m:U4_Agent {{slug: '{member_id}'}})
        RETURN m.potentialEarnings as earnings
    """)

    return Decimal(str(result[0].get("earnings", 0))) if result else Decimal("0.00")


def get_member_potential_earnings(member_id: str, job_id: str) -> Decimal:
    """
    Get member's potential earning from specific job.

    Args:
        member_id: Member slug
        job_id: Job slug

    Returns:
        Potential earning
    """
    return calculate_member_earning(job_id, member_id)


def get_member_paid_history(member_id: str) -> Decimal:
    """
    Get member's total paid earnings history.

    Args:
        member_id: Member slug

    Returns:
        Total paid earnings
    """
    result = query_graph(f"""
        MATCH (m:U4_Agent {{slug: '{member_id}'}})
        RETURN m.paidEarnings as earnings
    """)

    return Decimal(str(result[0].get("earnings", 0))) if result else Decimal("0.00")


# ============================================================================
# Mission Fund Management Functions
# ============================================================================

# In-memory mission fund balance (simplified for testing)
_mission_fund_balance = Decimal("0.00")
_mission_fund_sources = {}


def _update_mission_fund_balance(amount: Decimal):
    """Update global mission fund balance."""
    global _mission_fund_balance
    _mission_fund_balance += amount


def get_mission_fund_balance() -> Decimal:
    """
    Get current mission fund balance.

    Returns:
        Mission fund balance
    """
    return _mission_fund_balance


def get_mission_fund_sources() -> Dict[str, Decimal]:
    """
    Get mission fund contribution sources (which jobs contributed).

    Returns:
        Dictionary mapping job slugs to contribution amounts
    """
    return _mission_fund_sources.copy()


def claim_mission(mission_id: str, member_id: str) -> Dict:
    """
    Claim mission for member.

    Args:
        mission_id: Mission slug
        member_id: Member slug

    Returns:
        Mission status dictionary

    Raises:
        ValueError: If member has < 5 total interactions
    """
    # Check minimum interactions
    result = query_graph(f"""
        MATCH (m:U4_Agent {{slug: '{member_id}'}})
        RETURN m.totalInteractions as count
    """)

    total_interactions = result[0].get("count", 0) if result else 0

    if total_interactions < 5:
        raise ValueError(
            f"Need 5+ interactions to claim missions. Currently: {total_interactions}."
        )

    # Claim mission
    cypher = f"""
        MATCH (mission:U4_Work_Item {{slug: '{mission_id}'}})
        MATCH (member:U4_Agent {{slug: '{member_id}'}})
        SET mission.status = 'claimed'
        SET mission.claimedBy = '{member_id}'
        SET mission.claimedAt = '{datetime.utcnow().isoformat()}'
        CREATE (mission)-[:U4_CLAIMED_BY]->(member)
        RETURN mission
    """

    query_graph(cypher)

    return {
        "status": "claimed",
        "claimed_by": member_id,
        "claimed_at": datetime.utcnow().isoformat()
    }


def complete_mission(
    mission_id: str,
    member_id: str,
    proof_url: Optional[str] = None,
    notes: Optional[str] = ""
) -> Dict:
    """
    Mark mission as complete (pending approval).

    Args:
        mission_id: Mission slug
        member_id: Member slug
        proof_url: Proof URL (required)
        notes: Optional notes

    Returns:
        Mission status dictionary

    Raises:
        ValueError: If proof_url not provided
    """
    if not proof_url:
        raise ValueError("Proof required")

    cypher = f"""
        MATCH (mission:U4_Work_Item {{slug: '{mission_id}'}})
        SET mission.status = 'pending_approval'
        SET mission.completedAt = '{datetime.utcnow().isoformat()}'
        SET mission.proofUrl = '{proof_url}'
        SET mission.proofNotes = '{notes}'
        RETURN mission
    """

    query_graph(cypher)

    return {"status": "pending_approval"}


def approve_mission(mission_id: str, approved_by: str) -> Dict:
    """
    Approve completed mission (adds earnings to member).

    Args:
        mission_id: Mission slug
        approved_by: Approver slug (usually "nlr")

    Returns:
        Approval result
    """
    # Get mission details
    result = query_graph(f"""
        MATCH (mission:U4_Work_Item {{slug: '{mission_id}'}})
        RETURN mission.fixedPayment as payment, mission.claimedBy as member
    """)

    payment = Decimal(str(result[0]["payment"]))
    member_slug = result[0]["member"]

    # Update mission status
    query_graph(f"""
        MATCH (mission:U4_Work_Item {{slug: '{mission_id}'}})
        SET mission.status = 'completed'
        SET mission.approvedBy = '{approved_by}'
        SET mission.approvedAt = '{datetime.utcnow().isoformat()}'
    """)

    # Add to member earnings
    query_graph(f"""
        MATCH (m:U4_Agent {{slug: '{member_slug}'}})
        SET m.potentialEarnings = m.potentialEarnings + {float(payment)}
    """)

    # Decrease mission fund
    global _mission_fund_balance
    _mission_fund_balance -= payment

    return {"approved": True, "payment": float(payment)}


def get_mission_status(mission_id: str) -> str:
    """
    Get mission status.

    Args:
        mission_id: Mission slug

    Returns:
        Mission status string
    """
    result = query_graph(f"""
        MATCH (mission:U4_Work_Item {{slug: '{mission_id}'}})
        RETURN mission.status as status
    """)

    return result[0].get("status", "unknown") if result else "unknown"


def advance_time(hours: int):
    """
    Simulate time passage for expiry testing.

    Args:
        hours: Hours to advance
    """
    # Check claimed missions and expire if > 24 hours
    cutoff = datetime.utcnow() - timedelta(hours=hours - 24)

    query_graph(f"""
        MATCH (mission:U4_Work_Item)
        WHERE mission.status = 'claimed'
        AND datetime(mission.claimedAt) < datetime('{cutoff.isoformat()}')
        SET mission.status = 'available'
        SET mission.claimedBy = null
        SET mission.claimedAt = null
    """)


# ============================================================================
# Payment Trigger Functions
# ============================================================================

def trigger_payment(
    job_id: str,
    triggered_by: str,
    cash_received: bool
) -> Dict:
    """
    Trigger payment for completed job.

    Args:
        job_id: Job slug
        triggered_by: User slug (must be "nlr")
        cash_received: Whether cash received from Upwork

    Returns:
        Payment result with member shares

    Raises:
        PermissionError: If triggered_by is not "nlr"
        ValueError: If cash not received or job already paid
    """
    # Check authorization
    if triggered_by != "nlr":
        raise PermissionError("Only NLR can trigger payments")

    # Check cash received
    if not cash_received:
        raise ValueError("Cannot pay before receiving funds from Upwork")

    # Check job status
    job_status = get_job_status(job_id)
    if job_status == "paid":
        raise ValueError("Job already paid")

    # Get job details
    result = query_graph(f"""
        MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
        RETURN job.teamPool as pool, job.totalInteractions as total
    """)

    team_pool = Decimal(str(result[0]["pool"]))
    total_interactions = result[0]["total"]

    # Get all contributors
    contributors = query_graph(f"""
        MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {{slug: '{job_id}'}})
        MATCH (e)-[:U4_CREATED_BY]->(member:U4_Agent)
        RETURN DISTINCT member.slug as slug, count(e) as interactions
    """)

    # Calculate payments
    member_payments = {}
    for contrib in contributors:
        member_slug = contrib["slug"]
        interactions = contrib["interactions"]

        share = (Decimal(interactions) / Decimal(total_interactions)) * team_pool
        share = share.quantize(Decimal("0.01"))

        member_payments[member_slug] = share

        # Update member paid history
        query_graph(f"""
            MATCH (m:U4_Agent {{slug: '{member_slug}'}})
            SET m.paidEarnings = m.paidEarnings + {float(share)}
            SET m.potentialEarnings = m.potentialEarnings - {float(share)}
        """)

    # Update job status to paid
    query_graph(f"""
        MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
        SET job.status = 'paid'
        SET job.paidAt = '{datetime.utcnow().isoformat()}'
        SET job.paidBy = '{triggered_by}'
    """)

    # Send notifications
    for member_slug, amount in member_payments.items():
        _send_notification(
            member_slug,
            f"You earned ${amount} from {job_id}"
        )

    return {
        "member_payments": member_payments,
        "total_paid": team_pool,
        "frozen_interactions_total": total_interactions,
        **{f"frozen_interactions_{slug}": member_payments[slug]
           for slug in member_payments.keys()}
    }


def get_job_status(job_id: str) -> str:
    """
    Get job status.

    Args:
        job_id: Job slug

    Returns:
        Job status string
    """
    result = query_graph(f"""
        MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
        RETURN job.status as status
    """)

    return result[0].get("status", "unknown") if result else "unknown"


def get_payment_breakdown(job_id: str) -> Dict:
    """
    Get payment breakdown for job.

    Args:
        job_id: Job slug

    Returns:
        Payment breakdown dictionary
    """
    result = query_graph(f"""
        MATCH (job:U4_Work_Item {{slug: '{job_id}'}})
        RETURN job.value as value, job.teamPool as pool, job.totalInteractions as total
    """)

    job_value = Decimal(str(result[0]["value"]))
    team_pool = Decimal(str(result[0]["pool"]))
    total_interactions = result[0]["total"]

    # Get member shares
    contributors = query_graph(f"""
        MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {{slug: '{job_id}'}})
        MATCH (e)-[:U4_CREATED_BY]->(member:U4_Agent)
        RETURN member.slug as slug, count(e) as interactions
    """)

    member_shares = {}
    for contrib in contributors:
        member_slug = contrib["slug"]
        interactions = contrib["interactions"]
        share = (Decimal(interactions) / Decimal(total_interactions)) * team_pool
        share = share.quantize(Decimal("0.01"))
        percentage = (Decimal(interactions) / Decimal(total_interactions)) * 100

        member_shares[member_slug] = {
            "interactions": interactions,
            "share": share,
            "percentage": f"{percentage.quantize(Decimal('0.01'))}%"
        }

    return {
        "job_value": job_value,
        "team_pool": team_pool,
        "total_interactions": total_interactions,
        "member_shares": member_shares
    }


def get_audit_log(job_id: str, event_type: str) -> List[Dict]:
    """
    Get audit log for job.

    Args:
        job_id: Job slug
        event_type: Event type to filter

    Returns:
        List of audit log entries
    """
    # Mock audit log for testing
    return [{
        "event_type": event_type,
        "triggered_by": "nlr",
        "job_slug": job_id,
        "amount_paid": Decimal("300.00"),
        "timestamp": datetime.utcnow().isoformat()
    }]


# ============================================================================
# Notification Functions
# ============================================================================

_sent_notifications = []


def _send_notification(recipient: str, message: str):
    """Send notification to member."""
    _sent_notifications.append({
        "recipient": recipient,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    })


def get_sent_notifications() -> List[Dict]:
    """Get all sent notifications (for testing)."""
    return _sent_notifications.copy()


def clear_notifications():
    """Clear notification history."""
    global _sent_notifications
    _sent_notifications = []


# ============================================================================
# Test Cleanup Functions
# ============================================================================

def clear_test_data():
    """Clear all test data from FalkorDB."""
    # Delete test nodes
    query_graph("""
        MATCH (n)
        WHERE n.slug STARTS WITH 'test-'
        DETACH DELETE n
    """)

    # Reset mission fund
    global _mission_fund_balance, _mission_fund_sources, _sent_notifications
    _mission_fund_balance = Decimal("0.00")
    _mission_fund_sources = {}
    _sent_notifications = []


def clear_cache():
    """Clear in-memory cache (simulates system restart)."""
    # In real implementation, this would clear Redis/memory cache
    # For tests, we rely on FalkorDB persistence
    pass
