"""
Compensation API Router

REST endpoints for earnings tracking and mission fund visibility.
Maps to: docs/missions/mission-deck-compensation/MECHANISM.md REST API section
"""

from fastapi import APIRouter, HTTPException
from typing import Dict
from pydantic import BaseModel

from app.api.mission_deck.services.compensation.tier_calculator import (
    get_mission_fund_balance,
    get_current_tier,
    get_tier_info,
    get_all_mission_payments
)
from app.api.mission_deck.services.compensation.earnings_calculator import (
    calculate_member_full_earnings,
    calculate_member_total_potential_earnings
)

router = APIRouter()


# Response models
class EarningsResponse(BaseModel):
    """Member earnings summary"""
    potentialFromJobs: float
    completedMissions: float
    grandTotal: float
    jobs: list[Dict]
    totalInteractions: int


class MissionFundResponse(BaseModel):
    """Mission fund status"""
    balance: float
    tier: int
    tierName: str
    tierStatus: str
    tierColor: str
    tierEmoji: str
    missionPayments: Dict[str, float]


@router.get("/api/compensation/earnings/{member_slug}", response_model=EarningsResponse)
async def get_member_earnings(member_slug: str):
    """
    Get member's complete earnings summary.

    This endpoint is polled by the frontend every 2 seconds for real-time updates.

    Returns:
        - potentialFromJobs: Earnings from active jobs (based on interactions)
        - completedMissions: Earnings from completed missions (pending payment)
        - grandTotal: Total potential earnings
        - jobs: List of job earnings breakdowns
        - totalInteractions: Total interactions across all jobs
    """
    try:
        earnings_data = calculate_member_full_earnings(member_slug)
        return EarningsResponse(**earnings_data)

    except Exception as e:
        print(f"[compensation:get_member_earnings] Error for {member_slug}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate earnings: {str(e)}"
        )


@router.get("/api/compensation/mission-fund", response_model=MissionFundResponse)
async def get_mission_fund_status():
    """
    Get current mission fund balance and tier information.

    Returns:
        - balance: Current mission fund balance
        - tier: Current tier number (1-4)
        - tierName: Human-readable tier name ("Tier 1", "Tier 2", etc.)
        - tierStatus: Status text ("Abundant", "Healthy", "Limited", "Critical")
        - tierColor: Color for UI ("green", "yellow", "orange", "red")
        - tierEmoji: Emoji indicator (🟢, 🟡, 🟠, 🔴)
        - missionPayments: Current payment amounts for each mission type
    """
    try:
        # Get current tier and balance
        tier, balance = get_current_tier()

        # Get tier info
        tier_info = get_tier_info(tier)

        # Get all mission payments at current tier
        mission_payments = get_all_mission_payments(tier)

        return MissionFundResponse(
            balance=float(balance),
            tier=tier,
            tierName=tier_info['name'],
            tierStatus=tier_info['status'],
            tierColor=tier_info['color'],
            tierEmoji=tier_info['emoji'],
            missionPayments={
                mission_type: float(payment)
                for mission_type, payment in mission_payments.items()
            }
        )

    except Exception as e:
        print(f"[compensation:get_mission_fund_status] Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get mission fund status: {str(e)}"
        )


@router.get("/api/compensation/jobs/{job_slug}/earnings/{member_slug}")
async def get_job_specific_earnings(job_slug: str, member_slug: str):
    """
    Get member's earnings for a specific job.

    Used by job card detail view to show interaction breakdown.

    Returns:
        - earning: Member's earning from this job
        - yourInteractions: Member's interaction count
        - teamTotal: Total team interactions on this job
    """
    try:
        from app.api.mission_deck.services.compensation.earnings_calculator import (
            get_job_interaction_counts,
            calculate_member_job_earning
        )

        interaction_counts = get_job_interaction_counts(job_slug)
        your_interactions = interaction_counts.get(member_slug, 0)
        team_total = sum(interaction_counts.values())
        earning = calculate_member_job_earning(job_slug, member_slug, interaction_counts)

        return {
            'earning': float(earning),
            'yourInteractions': your_interactions,
            'teamTotal': team_total
        }

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"[compensation:get_job_specific_earnings] Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get job earnings: {str(e)}"
        )


@router.get("/api/compensation/health")
async def compensation_health_check():
    """
    Health check for compensation service.

    Returns:
        - status: "ok" if service is operational
        - missionFundExists: True if mission fund account exists
        - currentTier: Current tier number
    """
    try:
        tier, balance = get_current_tier()

        return {
            'status': 'ok',
            'missionFundExists': balance > 0,
            'currentTier': tier,
            'balance': float(balance)
        }

    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }
