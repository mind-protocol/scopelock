"""
Tier-Based Mission Payment Calculator

Dynamically calculates mission payments based on mission fund balance.
4 tiers: Abundant (≥$200), Healthy ($100-200), Limited ($50-100), Critical (<$50)

Maps to: docs/missions/mission-deck-compensation/ALGORITHM.md Step 1.3
"""

from decimal import Decimal
from typing import Tuple, Dict
from app.api.mission_deck.services.graph import query_graph


# Tier thresholds (in dollars)
TIER_1_THRESHOLD = Decimal('200.00')  # Abundant
TIER_2_THRESHOLD = Decimal('100.00')  # Healthy
TIER_3_THRESHOLD = Decimal('50.00')   # Limited
# Tier 4: < $50 (Critical)

# Payment matrix: mission_type -> [tier1, tier2, tier3, tier4]
PAYMENT_MATRIX: Dict[str, list[Decimal]] = {
    'proposal':    [Decimal('2.00'), Decimal('1.50'), Decimal('1.00'), Decimal('0.50')],
    'social':      [Decimal('3.00'), Decimal('2.50'), Decimal('2.00'), Decimal('1.00')],
    'recruitment': [Decimal('15.00'), Decimal('12.00'), Decimal('10.00'), Decimal('8.00')],
    'other':       [Decimal('5.00'), Decimal('4.00'), Decimal('3.00'), Decimal('2.00')]
}


def get_mission_fund_balance() -> Decimal:
    """
    Query FalkorDB for current mission fund balance.

    Returns:
        Mission fund balance as Decimal

    Note: Mission fund is a U4_Account node with accountType='mission_fund'
    """
    cypher = """
    MATCH (fund:U4_Account {accountType: 'mission_fund', scope_ref: 'scopelock'})
    RETURN fund.balance AS balance
    """

    try:
        results = query_graph(cypher)

        if not results or 'balance' not in results[0]:
            # If mission fund doesn't exist yet, return $0
            print("[tier_calculator] Mission fund not found, returning $0")
            return Decimal('0.00')

        balance = results[0]['balance']
        return Decimal(str(balance))

    except Exception as e:
        print(f"[tier_calculator:get_mission_fund_balance] Error: {e}")
        # Return 0 instead of crashing (prevents memory issues)
        return Decimal('0.00')


def get_current_tier() -> Tuple[int, Decimal]:
    """
    Determine current mission fund tier based on balance.

    Returns:
        (tier_number, balance) tuple
        - tier_number: 1 (Abundant) | 2 (Healthy) | 3 (Limited) | 4 (Critical)
        - balance: Current mission fund balance

    Example:
        >>> tier, balance = get_current_tier()
        >>> print(f"Tier {tier}, Balance: ${balance}")
        Tier 2, Balance: $150.00
    """
    balance = get_mission_fund_balance()

    if balance >= TIER_1_THRESHOLD:
        tier = 1  # Abundant
    elif balance >= TIER_2_THRESHOLD:
        tier = 2  # Healthy
    elif balance >= TIER_3_THRESHOLD:
        tier = 3  # Limited
    else:
        tier = 4  # Critical

    return (tier, balance)


def get_mission_payment(mission_type: str, tier: int = None) -> Decimal:
    """
    Get payment amount for a mission type at current or specified tier.

    Args:
        mission_type: "proposal" | "social" | "recruitment" | "other"
        tier: Optional specific tier (1-4). If None, uses current tier.

    Returns:
        Payment amount as Decimal

    Raises:
        ValueError: If mission_type is invalid

    Example:
        >>> payment = get_mission_payment('proposal')  # Uses current tier
        >>> print(f"Proposal payment: ${payment}")
        Proposal payment: $1.50
    """
    if mission_type not in PAYMENT_MATRIX:
        raise ValueError(
            f"Invalid mission_type: {mission_type}. "
            f"Must be one of: {list(PAYMENT_MATRIX.keys())}"
        )

    # If tier not specified, get current tier
    if tier is None:
        tier, _ = get_current_tier()

    # Validate tier range
    if tier not in [1, 2, 3, 4]:
        raise ValueError(f"Invalid tier: {tier}. Must be 1-4.")

    # Get payment from matrix (tier 1 = index 0)
    payment = PAYMENT_MATRIX[mission_type][tier - 1]
    return payment


def get_tier_info(tier: int) -> Dict[str, str]:
    """
    Get human-readable tier information.

    Args:
        tier: Tier number (1-4)

    Returns:
        Dict with tier name, status, color, emoji

    Example:
        >>> info = get_tier_info(2)
        >>> print(info)
        {'name': 'Tier 2', 'status': 'Healthy', 'color': 'yellow', 'emoji': '🟡'}
    """
    tier_info_map = {
        1: {'name': 'Tier 1', 'status': 'Abundant', 'color': 'green', 'emoji': '🟢'},
        2: {'name': 'Tier 2', 'status': 'Healthy', 'color': 'yellow', 'emoji': '🟡'},
        3: {'name': 'Tier 3', 'status': 'Limited', 'color': 'orange', 'emoji': '🟠'},
        4: {'name': 'Tier 4', 'status': 'Critical', 'color': 'red', 'emoji': '🔴'}
    }

    if tier not in tier_info_map:
        raise ValueError(f"Invalid tier: {tier}. Must be 1-4.")

    return tier_info_map[tier]


def get_all_mission_payments(tier: int = None) -> Dict[str, Decimal]:
    """
    Get payment amounts for all mission types at current or specified tier.

    Args:
        tier: Optional specific tier (1-4). If None, uses current tier.

    Returns:
        Dict mapping mission_type to payment amount

    Example:
        >>> payments = get_all_mission_payments()
        >>> print(payments)
        {'proposal': Decimal('1.50'), 'social': Decimal('2.50'), ...}
    """
    if tier is None:
        tier, _ = get_current_tier()

    return {
        mission_type: get_mission_payment(mission_type, tier)
        for mission_type in PAYMENT_MATRIX.keys()
    }


def increase_mission_fund(amount: Decimal, source_job_slug: str, source_job_value: Decimal):
    """
    Increase mission fund balance (5% from job completion).

    Args:
        amount: Amount to add to mission fund (typically job_value * 0.05)
        source_job_slug: Job slug that contributed this amount
        source_job_value: Original job value

    Note: Creates mission fund account if it doesn't exist
    """
    # Check if mission fund exists
    cypher_check = """
    MATCH (fund:U4_Account {accountType: 'mission_fund', scope_ref: 'scopelock'})
    RETURN fund
    """
    results = query_graph(cypher_check)

    if not results:
        # Create mission fund account
        cypher_create = """
        CREATE (fund:U4_Account {
          name: 'ScopeLock Mission Fund',
          slug: 'scopelock-mission-fund',
          accountType: 'mission_fund',
          level: 'L2',
          scope_ref: 'scopelock',
          balance: $amount,
          currency: 'USD',
          created_at: datetime(),
          updated_at: datetime(),
          valid_from: datetime(),
          valid_to: null,
          description: 'Fund for internal missions (5% from client jobs)',
          type_name: 'U4_Account',
          visibility: 'partners',
          created_by: 'system',
          substrate: 'organizational'
        })
        RETURN fund
        """
        query_graph(cypher_create, {"amount": float(amount)})
        print(f"[tier_calculator] Created mission fund with ${amount}")
    else:
        # Increase existing balance
        cypher_increase = """
        MATCH (fund:U4_Account {accountType: 'mission_fund', scope_ref: 'scopelock'})
        SET fund.balance = fund.balance + $amount,
            fund.updated_at = datetime()
        RETURN fund.balance AS new_balance
        """
        results = query_graph(cypher_increase, {"amount": float(amount)})
        new_balance = results[0]['new_balance']
        print(f"[tier_calculator] Mission fund increased by ${amount} → ${new_balance}")


def decrease_mission_fund(amount: Decimal, mission_slug: str):
    """
    Decrease mission fund balance (mission payment).

    Args:
        amount: Amount to deduct from mission fund
        mission_slug: Mission slug that consumed this amount

    Raises:
        ValueError: If insufficient funds
    """
    current_balance = get_mission_fund_balance()

    if current_balance < amount:
        raise ValueError(
            f"Insufficient mission fund balance. "
            f"Available: ${current_balance}, Needed: ${amount}"
        )

    cypher = """
    MATCH (fund:U4_Account {accountType: 'mission_fund', scope_ref: 'scopelock'})
    SET fund.balance = fund.balance - $amount,
        fund.updated_at = datetime()
    RETURN fund.balance AS new_balance
    """

    results = query_graph(cypher, {"amount": float(amount)})
    new_balance = results[0]['new_balance']
    print(f"[tier_calculator] Mission fund decreased by ${amount} → ${new_balance}")
