"""
Backend Tests: Mission Fund Management (T3)
Maps to: AC.md F2, F4, F5, F8 (Mission creation, claiming, completion, fund balance)
Mission: mission-deck-compensation
"""

import pytest
from decimal import Decimal
from datetime import datetime, timedelta
from tests.fixtures.compensation_fixtures import (
    create_test_job,
    create_test_member,
    create_test_mission,
    get_mission_fund_balance,
    claim_mission,
    complete_mission,
    approve_mission,
    add_interactions,
    clear_test_data,
)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Clear test data before and after each test."""
    clear_test_data()
    yield
    clear_test_data()


class TestMissionFundManagement:
    """Test suite for mission fund management."""

    def test_mission_fund_contribution_on_job_creation(self):
        """
        Test: Mission fund increases by 5% when job created
        Maps to: VALIDATION.md T3.1, AC.md F2

        Given: Mission fund balance is $X
        When: Job created with value $1,000
        Then: Mission fund increases by $50 (5%)
        """
        # Setup
        initial_balance = get_mission_fund_balance()

        # Action: Create job
        job = create_test_job(value=1000, title="Build Chatbot")

        # Get new balance
        new_balance = get_mission_fund_balance()

        # Assertions
        expected_increase = Decimal("50.00")  # 5% of $1,000
        assert new_balance == initial_balance + expected_increase

    def test_mission_fund_decreases_on_completion(self):
        """
        Test: Mission fund decreases when mission completed
        Maps to: VALIDATION.md T3.2, AC.md F5

        Given: Mission fund balance $100
        When: Mission worth $2 completed and approved
        Then: Balance = $98
        """
        # Setup
        create_test_job(value=2000, title="Test Job")  # Adds $100 to fund
        initial_balance = get_mission_fund_balance()

        mission = create_test_mission(
            title="Write proposal",
            payment=2.00,
            mission_type="proposal"
        )
        member = create_test_member("member_a")

        # Member needs 5+ interactions to claim
        temp_job = create_test_job(value=1000, title="Temp")
        add_interactions(temp_job.id, member.id, count=10)

        # Action: Claim, complete, approve mission
        claim_mission(mission.id, member.id)
        complete_mission(
            mission.id,
            member.id,
            proof_url="https://upwork.com/job/123",
            notes="Completed proposal"
        )
        approve_mission(mission.id, approved_by="nlr")

        # Get new balance
        new_balance = get_mission_fund_balance()

        # Assertion
        expected_decrease = Decimal("2.00")
        assert new_balance == initial_balance - expected_decrease

    def test_mission_claiming_requires_minimum_interactions(self):
        """
        Test: Cannot claim mission with < 5 interactions
        Maps to: VALIDATION.md T3.3, AC.md F4

        Given: Member has 3 total interactions (need 5+)
        When: Member tries to claim mission
        Then: Error "Need 5+ interactions to claim missions"
        """
        # Setup
        mission = create_test_mission(title="Write proposal", payment=1.00)
        member = create_test_member("member_a")

        # Give member only 3 interactions
        job = create_test_job(value=1000, title="Test")
        add_interactions(job.id, member.id, count=3)

        # Action & Assertion: Claim should fail
        with pytest.raises(ValueError, match="Need 5\\+ interactions to claim missions"):
            claim_mission(mission.id, member.id)

    def test_mission_claiming_succeeds_with_sufficient_interactions(self):
        """
        Test: Mission claiming succeeds with 5+ interactions

        Given: Member has 10 total interactions
        When: Member claims mission
        Then: Mission status = "Claimed by member_a"
        """
        # Setup
        mission = create_test_mission(title="Post on X", payment=2.00)
        member = create_test_member("member_a")

        # Give member 10 interactions
        job = create_test_job(value=1000, title="Test")
        add_interactions(job.id, member.id, count=10)

        # Action: Claim mission
        result = claim_mission(mission.id, member.id)

        # Assertions
        assert result["status"] == "claimed"
        assert result["claimed_by"] == member.slug
        assert "claimed_at" in result

    def test_mission_claim_expiry_24_hours(self):
        """
        Test: Claimed mission expires after 24 hours
        Maps to: VALIDATION.md T3.4, AC.md F4

        Given: Member claims mission at T=0
        When: 25 hours pass without completion
        Then: Status reverted to "Available"
        """
        # Setup
        mission = create_test_mission(title="Write proposal", payment=1.00)
        member = create_test_member("member_a")

        # Give member sufficient interactions
        job = create_test_job(value=1000, title="Test")
        add_interactions(job.id, member.id, count=10)

        # Action: Claim mission
        claim_mission(mission.id, member.id)

        # Fast-forward time by 25 hours (simulated)
        from tests.fixtures.compensation_fixtures import advance_time
        advance_time(hours=25)

        # Check status
        from tests.fixtures.compensation_fixtures import get_mission_status
        status = get_mission_status(mission.id)

        # Assertion: Reverted to available
        assert status == "available"
        assert mission.claimed_by is None

    def test_mission_fund_insufficient_blocks_creation(self):
        """
        Test: Cannot create mission if fund insufficient
        Maps to: VALIDATION.md T3.5

        Given: Mission fund = $5
        When: Try to create $10 mission
        Then: Error "Mission fund insufficient ($5 available, need $10)"
        """
        # Setup: Ensure mission fund has only $5
        create_test_job(value=100, title="Small Job")  # Adds $5 to fund
        balance = get_mission_fund_balance()
        assert balance == Decimal("5.00")

        # Action & Assertion: Cannot create $10 mission
        with pytest.raises(ValueError, match="Mission fund insufficient"):
            create_test_mission(
                title="Expensive mission",
                payment=10.00,
                mission_type="recruitment"
            )

    def test_mission_fund_rollover(self):
        """
        Test: Mission fund balance rolls over between jobs
        Maps to: VALIDATION.md T3.6, AC.md F8

        Given: Job A contributes $50, Job B contributes $75
        When: Spend $25 on missions
        Then: Balance = $100 (rolls over)
        """
        # Setup: Create 2 jobs
        job_a = create_test_job(value=1000, title="Job A")  # +$50
        job_b = create_test_job(value=1500, title="Job B")  # +$75

        # Initial balance: $125
        initial_balance = get_mission_fund_balance()
        assert initial_balance == Decimal("125.00")

        # Create and complete mission worth $25
        mission = create_test_mission(title="Test mission", payment=25.00)
        member = create_test_member("member_a")
        add_interactions(job_a.id, member.id, count=10)

        claim_mission(mission.id, member.id)
        complete_mission(mission.id, member.id, proof_url="https://proof.com")
        approve_mission(mission.id, approved_by="nlr")

        # New balance: $100
        new_balance = get_mission_fund_balance()
        assert new_balance == Decimal("100.00")

    def test_mission_fund_source_tracking(self):
        """
        Test: Can track which jobs contributed to mission fund
        Maps to: AC.md F8

        Given: 3 jobs created
        When: Query mission fund sources
        Then: Shows contribution from each job
        """
        # Setup: Create 3 jobs
        job_a = create_test_job(value=1000, title="Chatbot")    # $50
        job_b = create_test_job(value=800, title="Dashboard")   # $40
        job_c = create_test_job(value=1200, title="Landing")    # $60

        # Query fund sources
        from tests.fixtures.compensation_fixtures import get_mission_fund_sources
        sources = get_mission_fund_sources()

        # Assertions
        assert len(sources) == 3
        assert sources[job_a.slug] == Decimal("50.00")
        assert sources[job_b.slug] == Decimal("40.00")
        assert sources[job_c.slug] == Decimal("60.00")

    def test_multiple_missions_claimed_by_same_member(self):
        """
        Test: Member can claim multiple missions simultaneously

        Given: 3 available missions
        When: Member claims all 3
        Then: All 3 show "Claimed by member_a"
        """
        # Setup
        create_test_job(value=10000, title="Large Job")  # Fund = $500

        mission_1 = create_test_mission(title="Proposal 1", payment=1.00)
        mission_2 = create_test_mission(title="X Post", payment=2.00)
        mission_3 = create_test_mission(title="Proposal 2", payment=1.00)

        member = create_test_member("member_a")
        job = create_test_job(value=1000, title="Test")
        add_interactions(job.id, member.id, count=10)

        # Action: Claim all 3
        claim_mission(mission_1.id, member.id)
        claim_mission(mission_2.id, member.id)
        claim_mission(mission_3.id, member.id)

        # Assertions
        from tests.fixtures.compensation_fixtures import get_mission_status
        assert get_mission_status(mission_1.id) == "claimed"
        assert get_mission_status(mission_2.id) == "claimed"
        assert get_mission_status(mission_3.id) == "claimed"

    def test_mission_completion_requires_proof(self):
        """
        Test: Cannot complete mission without proof
        Maps to: AC.md F5

        Given: Mission claimed
        When: Try to complete without proof URL
        Then: Error "Proof required"
        """
        # Setup
        mission = create_test_mission(title="Write proposal", payment=1.00)
        member = create_test_member("member_a")

        job = create_test_job(value=1000, title="Test")
        add_interactions(job.id, member.id, count=10)
        claim_mission(mission.id, member.id)

        # Action & Assertion: Complete without proof should fail
        with pytest.raises(ValueError, match="Proof required"):
            complete_mission(
                mission.id,
                member.id,
                proof_url=None,  # No proof
                notes="Completed"
            )

    def test_mission_approval_updates_member_earnings(self):
        """
        Test: Approved mission adds earnings to member total
        Maps to: AC.md F5

        Given: Member completes mission worth $2
        When: NLR approves completion
        Then: Member's potential earnings increase by $2
        """
        # Setup
        create_test_job(value=2000, title="Fund Job")  # $100 to fund

        mission = create_test_mission(title="X Post", payment=2.00)
        member = create_test_member("member_a")

        job = create_test_job(value=1000, title="Test")
        add_interactions(job.id, member.id, count=10)

        # Get initial earnings
        from tests.fixtures.compensation_fixtures import get_member_total_earnings
        initial_earnings = get_member_total_earnings(member.id)

        # Action: Claim, complete, approve
        claim_mission(mission.id, member.id)
        complete_mission(mission.id, member.id, proof_url="https://twitter.com/123")
        approve_mission(mission.id, approved_by="nlr")

        # Get new earnings
        new_earnings = get_member_total_earnings(member.id)

        # Assertion: Increased by $2
        assert new_earnings == initial_earnings + Decimal("2.00")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
