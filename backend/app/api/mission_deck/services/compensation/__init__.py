"""
Compensation Service Module

Handles interaction-based earnings tracking and tier-based mission payments.
Maps to: docs/missions/mission-deck-compensation/
"""

from .tier_calculator import (
    get_mission_fund_balance,
    get_current_tier,
    get_mission_payment,
    get_tier_info,
    get_all_mission_payments,
    increase_mission_fund,
    decrease_mission_fund
)

__all__ = [
    'get_mission_fund_balance',
    'get_current_tier',
    'get_mission_payment',
    'get_tier_info',
    'get_all_mission_payments',
    'increase_mission_fund',
    'decrease_mission_fund'
]
