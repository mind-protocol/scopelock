"""
Backend Tests: Earnings Calculation Correctness (T2)
Maps to: AC.md F1, F3 (Earnings display and calculation)
Mission: mission-deck-compensation
"""

import pytest
from decimal import Decimal
from tests.fixtures.compensation_fixtures import (
    create_test_job,
    create_test_member,
    add_interactions,
    calculate_member_earning,
    get_team_pool,
    clear_test_data,
)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Clear test data before and after each test."""
    clear_test_data()
    yield
    clear_test_data()


class TestEarningsCalculation:
    """Test suite for earnings calculation correctness."""

    def test_earnings_formula_single_member(self):
        """
        Test: Earnings formula correct for single member
        Maps to: VALIDATION.md T2.1

        Given: Job value $1,000, team pool $300 (30%)
        When: Member A has 10/10 interactions
        Then: Member A earning = (10/10) × $300 = $300.00
        """
        # Setup
        job = create_test_job(value=1000, title="Solo Job")
        member_a = create_test_member("member_a")

        # Action
        add_interactions(job.id, member_a.id, count=10)

        # Calculate earning
        earning = calculate_member_earning(job.id, member_a.id)
        team_pool = get_team_pool(job.id)

        # Assertions
        assert team_pool == Decimal("300.00")  # 30% of $1,000
        assert earning == Decimal("300.00")  # (10/10) × $300

    def test_earnings_formula_multiple_members(self):
        """
        Test: Earnings formula correct for multiple members
        Maps to: VALIDATION.md T2.2, AC.md F1 test data

        Given: Job value $1,500, team pool $450 (30%)
        When: Member A has 20 interactions, Member B has 10, Total = 30
        Then: Member A = $300.00, Member B = $150.00
        """
        # Setup
        job = create_test_job(value=1500, title="Build Chatbot")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        # Simulate interactions
        add_interactions(job.id, member_a.id, count=20)
        add_interactions(job.id, member_b.id, count=10)

        # Calculate earnings
        earnings_a = calculate_member_earning(job.id, member_a.id)
        earnings_b = calculate_member_earning(job.id, member_b.id)
        team_pool = get_team_pool(job.id)

        # Assertions
        assert team_pool == Decimal("450.00")  # 30% of $1,500
        assert earnings_a == Decimal("300.00")  # (20/30) × 450
        assert earnings_b == Decimal("150.00")  # (10/30) × 450
        assert earnings_a + earnings_b == Decimal("450.00")  # Exact team pool

    def test_earnings_update_on_new_interaction(self):
        """
        Test: Earnings recalculate when new interaction added
        Maps to: VALIDATION.md T2.3

        Given: Member A has 10 interactions, Total = 20
        When: Member A sends new message (11 interactions, Total = 21)
        Then: Earning updates from $150 to $157.14
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")  # Team pool = $300
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        # Initial state: A=10, B=10, Total=20
        add_interactions(job.id, member_a.id, count=10)
        add_interactions(job.id, member_b.id, count=10)

        # Initial earning: (10/20) × $300 = $150
        initial_earning = calculate_member_earning(job.id, member_a.id)
        assert initial_earning == Decimal("150.00")

        # Action: Member A adds 1 more interaction → A=11, Total=21
        add_interactions(job.id, member_a.id, count=1)

        # New earning: (11/21) × $300 = $157.14
        new_earning = calculate_member_earning(job.id, member_a.id)
        assert new_earning == Decimal("157.14")

    def test_rounding_to_two_decimals(self):
        """
        Test: Earnings rounded to 2 decimal places
        Maps to: VALIDATION.md T2.4

        Given: Job pool $300, Member A has 7/11 interactions
        When: Earnings calculated
        Then: Earning = $190.91 (not $190.909090...)
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")  # Team pool = $300
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        # A=7, B=4, Total=11
        add_interactions(job.id, member_a.id, count=7)
        add_interactions(job.id, member_b.id, count=4)

        # Calculate: (7/11) × $300 = $190.909090...
        earning = calculate_member_earning(job.id, member_a.id)

        # Assertion: Rounded to 2 decimals
        assert earning == Decimal("190.91")
        assert str(earning) == "190.91"  # Exactly 2 decimal places

    def test_zero_interactions_zero_earnings(self):
        """
        Test: Zero interactions = zero earnings
        Maps to: VALIDATION.md T2.5

        Given: Member B has 0 interactions on job
        When: Earnings calculated
        Then: Earning = $0.00
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        # Only Member A has interactions
        add_interactions(job.id, member_a.id, count=10)

        # Member B has 0 interactions
        earning_b = calculate_member_earning(job.id, member_b.id)

        # Assertion
        assert earning_b == Decimal("0.00")

    def test_total_pool_distribution_exact(self):
        """
        Test: Sum of all earnings = exactly team pool
        Maps to: VALIDATION.md T2.6

        Given: 3 members: A=15, B=10, C=5, Total=30
        When: Earnings calculated
        Then: Sum of all earnings = exactly $300 (team pool)
        """
        # Setup
        job = create_test_job(value=1000, title="Multi-member Job")  # Pool = $300
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")
        member_c = create_test_member("member_c")

        # Interactions: A=15, B=10, C=5, Total=30
        add_interactions(job.id, member_a.id, count=15)
        add_interactions(job.id, member_b.id, count=10)
        add_interactions(job.id, member_c.id, count=5)

        # Calculate earnings
        earning_a = calculate_member_earning(job.id, member_a.id)
        earning_b = calculate_member_earning(job.id, member_b.id)
        earning_c = calculate_member_earning(job.id, member_c.id)
        team_pool = get_team_pool(job.id)

        # Assertions
        assert earning_a == Decimal("150.00")  # (15/30) × 300
        assert earning_b == Decimal("100.00")  # (10/30) × 300
        assert earning_c == Decimal("50.00")   # (5/30) × 300
        assert earning_a + earning_b + earning_c == team_pool  # Exact pool

    def test_earnings_calculation_performance(self):
        """
        Test: Earnings calculation completes in <200ms (NF1 requirement)
        Maps to: AC.md NF1 (Performance)

        Given: Job with 50 members and 1000 total interactions
        When: Calculate earnings for 1 member
        Then: Calculation completes in <200ms
        """
        import time

        # Setup: Large job with many members
        job = create_test_job(value=10000, title="Large Job")  # Pool = $3,000

        # Create 50 members with varying interaction counts
        members = [create_test_member(f"member_{i}") for i in range(50)]
        for i, member in enumerate(members):
            add_interactions(job.id, member.id, count=(i + 1) * 2)  # 2, 4, 6, ..., 100

        # Measure calculation time for 1 member
        start = time.time()
        earning = calculate_member_earning(job.id, members[0].id)
        duration_ms = (time.time() - start) * 1000

        # Assertions
        assert earning >= Decimal("0.00")
        assert duration_ms < 200  # p95 latency requirement

    def test_team_pool_always_30_percent(self):
        """
        Test: Team pool always exactly 30% of job value

        Given: Various job values
        When: Team pool calculated
        Then: Always exactly 30%
        """
        test_values = [500, 1000, 1500, 2000, 10000]

        for value in test_values:
            job = create_test_job(value=value, title=f"Job ${value}")
            team_pool = get_team_pool(job.id)

            # Assertion: Exactly 30%
            expected_pool = Decimal(str(value)) * Decimal("0.30")
            assert team_pool == expected_pool

    def test_earnings_with_fractional_interactions(self):
        """
        Test: Earnings handle edge case of uneven distribution

        Given: 3 members with interactions that don't divide evenly
        When: 100 total interactions, A=37, B=33, C=30
        Then: Earnings sum to exactly team pool (no rounding errors)
        """
        # Setup
        job = create_test_job(value=1000, title="Uneven Job")  # Pool = $300
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")
        member_c = create_test_member("member_c")

        # Uneven interactions: 37 + 33 + 30 = 100
        add_interactions(job.id, member_a.id, count=37)
        add_interactions(job.id, member_b.id, count=33)
        add_interactions(job.id, member_c.id, count=30)

        # Calculate earnings
        earning_a = calculate_member_earning(job.id, member_a.id)
        earning_b = calculate_member_earning(job.id, member_b.id)
        earning_c = calculate_member_earning(job.id, member_c.id)

        # Assertions
        assert earning_a == Decimal("111.00")  # (37/100) × 300
        assert earning_b == Decimal("99.00")   # (33/100) × 300
        assert earning_c == Decimal("90.00")   # (30/100) × 300

        # Critical: Sum equals exactly $300 (no floating-point errors)
        total = earning_a + earning_b + earning_c
        assert total == Decimal("300.00")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
