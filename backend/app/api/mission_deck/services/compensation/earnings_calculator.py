"""
Earnings Calculator

Calculates member earnings from job interactions and completed missions.
Formula: (member_interactions / team_total_interactions) × job.teamPool

Maps to: docs/missions/mission-deck-compensation/ALGORITHM.md Step 2
"""

from decimal import Decimal
from typing import Dict, List, Optional
from app.api.mission_deck.services.graph import query_graph


def get_job_interaction_counts(job_slug: str) -> Dict[str, int]:
    """
    Get interaction counts for all members on a specific job.

    Args:
        job_slug: Job slug (e.g., "job-therapykin-chatbot-2025-11")

    Returns:
        Dict mapping member_slug to interaction count
        Example: {'member_a': 10, 'member_b': 5}

    Note: Counts U4_Event nodes with event_kind='message' linked to job
    """
    cypher = """
    MATCH (job:U4_Work_Item {slug: $job_slug, work_type: 'job', scope_ref: 'scopelock'})
    OPTIONAL MATCH (job)<-[:U4_ABOUT]-(msg:U4_Event)
    WHERE msg.event_kind = 'message' AND msg.scope_ref = 'scopelock'
    WITH job, msg
    WHERE msg IS NOT NULL
    RETURN msg.actor_ref AS member_slug, count(msg) AS interaction_count
    """

    try:
        results = query_graph(cypher, {"job_slug": job_slug})

        interaction_counts = {}
        for row in results:
            member_slug = row.get('member_slug')
            count = row.get('interaction_count', 0)
            if member_slug:
                interaction_counts[member_slug] = count

        return interaction_counts

    except Exception as e:
        print(f"[earnings_calculator:get_job_interaction_counts] Error: {e}")
        raise


def get_job_team_pool(job_slug: str) -> Decimal:
    """
    Get team pool amount for a job (30% of job value).

    Args:
        job_slug: Job slug

    Returns:
        Team pool amount as Decimal

    Raises:
        ValueError: If job not found
    """
    cypher = """
    MATCH (job:U4_Work_Item {slug: $job_slug, work_type: 'job', scope_ref: 'scopelock'})
    RETURN job.teamPool AS team_pool
    """

    try:
        results = query_graph(cypher, {"job_slug": job_slug})

        if not results or 'team_pool' not in results[0]:
            raise ValueError(f"Job not found or missing teamPool: {job_slug}")

        team_pool = results[0]['team_pool']
        return Decimal(str(team_pool))

    except Exception as e:
        print(f"[earnings_calculator:get_job_team_pool] Error: {e}")
        raise


def calculate_member_job_earning(
    job_slug: str,
    member_slug: str,
    interaction_counts: Optional[Dict[str, int]] = None
) -> Decimal:
    """
    Calculate a member's potential earning from a specific job.

    Args:
        job_slug: Job slug
        member_slug: Member slug
        interaction_counts: Optional pre-fetched interaction counts (for performance)

    Returns:
        Member's earning as Decimal

    Formula: (member_interactions / team_total_interactions) × job.teamPool

    Example:
        Job value: $1,500, Team pool: $450
        Member A: 10 interactions, Team total: 50 interactions
        Earning: (10/50) × $450 = $90.00
    """
    # Get interaction counts (use provided or fetch)
    if interaction_counts is None:
        interaction_counts = get_job_interaction_counts(job_slug)

    member_interactions = interaction_counts.get(member_slug, 0)

    # If member has no interactions, earning is $0
    if member_interactions == 0:
        return Decimal('0.00')

    team_total = sum(interaction_counts.values())

    # If no team interactions yet, earning is $0
    if team_total == 0:
        return Decimal('0.00')

    # Get team pool
    team_pool = get_job_team_pool(job_slug)

    # Calculate member's share
    member_share = Decimal(member_interactions) / Decimal(team_total)
    earning = member_share * team_pool

    # Round to 2 decimal places (cents)
    earning = earning.quantize(Decimal('0.01'))

    return earning


def get_all_active_jobs() -> List[Dict]:
    """
    Get all active jobs (status='active').

    Returns:
        List of job dicts with slug, value, teamPool

    Note: Limited to 50 jobs to prevent memory issues on free tier hosting
    """
    cypher = """
    MATCH (job:U4_Work_Item {work_type: 'job', scope_ref: 'scopelock'})
    WHERE job.status = 'active'
    RETURN job.slug AS slug, job.value AS value, job.teamPool AS team_pool, job.name AS name
    LIMIT 50
    """

    try:
        results = query_graph(cypher)
        return [
            {
                'slug': row['slug'],
                'name': row.get('name', row['slug']),
                'value': row['value'],
                'teamPool': row['team_pool']
            }
            for row in results
        ]

    except Exception as e:
        print(f"[earnings_calculator:get_all_active_jobs] Error: {e}")
        raise


def calculate_member_total_potential_earnings(member_slug: str) -> Dict:
    """
    Calculate member's total potential earnings from all active jobs.

    Args:
        member_slug: Member slug (e.g., "member_a", "bigbosexf")

    Returns:
        Dict with:
        - total: Total potential earnings (Decimal)
        - jobs: List of job earnings breakdown
        - totalInteractions: Total interactions across all jobs

    Example:
        {
          'total': Decimal('164.00'),
          'jobs': [
            {'jobSlug': 'job-1', 'jobName': 'Chatbot', 'yourInteractions': 10, 'teamTotal': 50, 'earning': Decimal('90.00')},
            {'jobSlug': 'job-2', 'jobName': 'Landing', 'yourInteractions': 5, 'teamTotal': 40, 'earning': Decimal('24.00')}
          ],
          'totalInteractions': 15
        }
    """
    try:
        active_jobs = get_all_active_jobs()
    except Exception as e:
        # If query fails, return empty earnings (prevents memory crash)
        print(f"[earnings_calculator:calculate_member_total_potential_earnings] Failed to get jobs: {e}")
        return {
            'total': 0.0,
            'jobs': [],
            'totalInteractions': 0
        }

    # Early return if no active jobs (prevents unnecessary queries)
    if not active_jobs:
        return {
            'total': 0.0,
            'jobs': [],
            'totalInteractions': 0
        }

    total_earning = Decimal('0.00')
    job_earnings = []
    total_interactions = 0

    for job in active_jobs:
        job_slug = job['slug']

        # Get interaction counts for this job
        interaction_counts = get_job_interaction_counts(job_slug)

        member_interactions = interaction_counts.get(member_slug, 0)
        team_total = sum(interaction_counts.values())

        # Calculate earning for this job
        earning = calculate_member_job_earning(job_slug, member_slug, interaction_counts)

        total_earning += earning
        total_interactions += member_interactions

        job_earnings.append({
            'jobSlug': job_slug,
            'jobName': job['name'],
            'yourInteractions': member_interactions,
            'teamTotal': team_total,
            'earning': float(earning)  # Convert to float for JSON serialization
        })

    return {
        'total': float(total_earning),
        'jobs': job_earnings,
        'totalInteractions': total_interactions
    }


def get_member_completed_mission_earnings(member_slug: str) -> Decimal:
    """
    Get total earnings from completed missions (pending payment).

    Args:
        member_slug: Member slug

    Returns:
        Total mission earnings as Decimal

    Note: This includes missions that are completed but not yet paid
    """
    cypher = """
    MATCH (mission:U4_Work_Item {work_type: 'mission', scope_ref: 'scopelock'})
    WHERE mission.claimedBy = $member_slug
      AND mission.status IN ['completed', 'approved']
    RETURN sum(mission.fixedPayment) AS total_mission_earnings
    """

    try:
        results = query_graph(cypher, {"member_slug": member_slug})

        if not results or 'total_mission_earnings' not in results[0]:
            return Decimal('0.00')

        total = results[0]['total_mission_earnings']
        return Decimal(str(total)) if total else Decimal('0.00')

    except Exception as e:
        # Return 0 instead of crashing (prevents memory issues from cascading)
        print(f"[earnings_calculator:get_member_completed_mission_earnings] Error: {e}")
        return Decimal('0.00')


def calculate_member_full_earnings(member_slug: str) -> Dict:
    """
    Calculate member's complete earnings summary.

    Includes:
    - Potential earnings from active jobs (based on interactions)
    - Completed mission earnings (pending payment)
    - Grand total

    Args:
        member_slug: Member slug

    Returns:
        Dict with:
        - potentialFromJobs: Earnings from active jobs (Decimal)
        - completedMissions: Earnings from completed missions (Decimal)
        - grandTotal: Total potential earnings (Decimal)
        - jobs: List of job breakdowns
        - totalInteractions: Total interactions across all jobs
    """
    # Get job earnings
    job_data = calculate_member_total_potential_earnings(member_slug)

    # Get mission earnings
    mission_earnings = get_member_completed_mission_earnings(member_slug)

    grand_total = Decimal(str(job_data['total'])) + mission_earnings

    return {
        'potentialFromJobs': job_data['total'],
        'completedMissions': float(mission_earnings),
        'grandTotal': float(grand_total),
        'jobs': job_data['jobs'],
        'totalInteractions': job_data['totalInteractions']
    }
