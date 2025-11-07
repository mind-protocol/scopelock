"""
Backend Tests: Payment Trigger Logic (T4)
Maps to: AC.md F6 (Job completion and payment trigger)
Mission: mission-deck-compensation
"""

import pytest
from decimal import Decimal
from tests.fixtures.compensation_fixtures import (
    create_test_job,
    create_test_member,
    add_interactions,
    trigger_payment,
    get_job_status,
    get_member_potential_earnings,
    get_member_paid_history,
    clear_test_data,
)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Clear test data before and after each test."""
    clear_test_data()
    yield
    clear_test_data()


class TestPaymentTriggers:
    """Test suite for payment trigger logic."""

    def test_payment_trigger_requires_nlr_role(self):
        """
        Test: Only NLR can trigger payment
        Maps to: VALIDATION.md T4.1, AC.md NF4 (Security)

        Given: Non-NLR member tries to trigger payment
        When: Payment trigger called
        Then: 403 Forbidden error
        """
        # Setup
        job = create_test_job(value=1500, title="Test Job", status="completed")
        member = create_test_member("member_a")

        add_interactions(job.id, member.id, count=10)

        # Action & Assertion: Non-NLR cannot trigger payment
        with pytest.raises(PermissionError, match="Only NLR can trigger payments"):
            trigger_payment(
                job_id=job.id,
                triggered_by="member_a",  # Not NLR
                cash_received=True
            )

    def test_payment_freezes_interaction_counts(self):
        """
        Test: Payment freezes interaction counts
        Maps to: VALIDATION.md T4.2, AC.md F6

        Given: Job has 50 total interactions
        When: Payment triggered
        Then: Job status = "Paid", interaction counts frozen
        """
        # Setup
        job = create_test_job(value=1500, title="Chatbot", status="completed")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        add_interactions(job.id, member_a.id, count=30)
        add_interactions(job.id, member_b.id, count=20)

        # Action: Trigger payment
        result = trigger_payment(
            job_id=job.id,
            triggered_by="nlr",
            cash_received=True
        )

        # Assertions
        assert get_job_status(job.id) == "paid"
        assert result["frozen_interactions_total"] == 50
        assert result["frozen_interactions_member_a"] == 30
        assert result["frozen_interactions_member_b"] == 20

        # Verify counts cannot change after payment
        with pytest.raises(ValueError, match="Cannot add interactions to paid job"):
            add_interactions(job.id, member_a.id, count=1)

    def test_payment_calculates_final_shares(self):
        """
        Test: Payment calculates correct final shares
        Maps to: VALIDATION.md T4.3, AC.md F6 test data

        Given: Job value $1,500, pool $450
              Member A: 30 interactions, Member B: 20, Total: 50
        When: Payment triggered
        Then: Member A gets $270, Member B gets $180
        """
        # Setup
        job = create_test_job(value=1500, title="Chatbot", status="completed")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        add_interactions(job.id, member_a.id, count=30)
        add_interactions(job.id, member_b.id, count=20)

        # Action: Trigger payment (as NLR)
        result = trigger_payment(
            job_id=job.id,
            triggered_by="nlr",
            cash_received=True
        )

        # Assertions
        assert result["member_payments"][member_a.id] == Decimal("270.00")
        assert result["member_payments"][member_b.id] == Decimal("180.00")
        assert result["total_paid"] == Decimal("450.00")
        assert get_job_status(job.id) == "paid"

    def test_payment_moves_earnings_to_history(self):
        """
        Test: Payment moves earnings from potential to paid history
        Maps to: VALIDATION.md T4.4, AC.md F6

        Given: Member has $164 potential earnings from job
        When: Payment triggered
        Then: Potential earnings for this job = $0, Paid history += $164
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job", status="completed")
        member = create_test_member("member_a")

        add_interactions(job.id, member.id, count=10)

        # Check potential earnings before payment
        potential_before = get_member_potential_earnings(member.id, job.id)
        assert potential_before == Decimal("300.00")  # (10/10) × $300

        paid_history_before = get_member_paid_history(member.id)

        # Action: Trigger payment
        trigger_payment(
            job_id=job.id,
            triggered_by="nlr",
            cash_received=True
        )

        # Check after payment
        potential_after = get_member_potential_earnings(member.id, job.id)
        paid_history_after = get_member_paid_history(member.id)

        # Assertions
        assert potential_after == Decimal("0.00")  # Cleared
        assert paid_history_after == paid_history_before + Decimal("300.00")

    def test_payment_notification_sent_to_all_contributors(self):
        """
        Test: Payment sends notifications to all contributors
        Maps to: VALIDATION.md T4.5, AC.md F6

        Given: 3 members contributed to job
        When: Payment triggered
        Then: 3 notifications sent with correct amounts
        """
        # Setup
        job = create_test_job(value=1500, title="Chatbot", status="completed")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")
        member_c = create_test_member("member_c")

        add_interactions(job.id, member_a.id, count=30)
        add_interactions(job.id, member_b.id, count=15)
        add_interactions(job.id, member_c.id, count=5)

        # Mock notification service
        from tests.fixtures.compensation_fixtures import get_sent_notifications, clear_notifications
        clear_notifications()

        # Action: Trigger payment
        trigger_payment(
            job_id=job.id,
            triggered_by="nlr",
            cash_received=True
        )

        # Get sent notifications
        notifications = get_sent_notifications()

        # Assertions
        assert len(notifications) == 3  # 3 notifications sent

        # Verify notification content
        notif_a = next(n for n in notifications if n["recipient"] == member_a.id)
        notif_b = next(n for n in notifications if n["recipient"] == member_b.id)
        notif_c = next(n for n in notifications if n["recipient"] == member_c.id)

        assert "You earned $270.00" in notif_a["message"]
        assert "You earned $135.00" in notif_b["message"]
        assert "You earned $45.00" in notif_c["message"]

    def test_payment_without_cash_receipt_fails(self):
        """
        Test: Cannot trigger payment without marking cash received
        Maps to: VALIDATION.md T4.6

        Given: Job completed but cash not yet received from Upwork
        When: Try to trigger payment with cash_received=False
        Then: Error "Cannot pay before receiving funds from Upwork"
        """
        # Setup
        job = create_test_job(value=1500, title="Test Job", status="completed")
        member = create_test_member("member_a")
        add_interactions(job.id, member.id, count=10)

        # Action & Assertion: Cannot pay without cash received
        with pytest.raises(ValueError, match="Cannot pay before receiving funds"):
            trigger_payment(
                job_id=job.id,
                triggered_by="nlr",
                cash_received=False  # Cash not received yet
            )

    def test_payment_cannot_be_triggered_twice(self):
        """
        Test: Payment cannot be triggered twice for same job

        Given: Job already paid
        When: Try to trigger payment again
        Then: Error "Job already paid"
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job", status="completed")
        member = create_test_member("member_a")
        add_interactions(job.id, member.id, count=10)

        # First payment (succeeds)
        trigger_payment(job_id=job.id, triggered_by="nlr", cash_received=True)

        # Second payment (fails)
        with pytest.raises(ValueError, match="Job already paid"):
            trigger_payment(job_id=job.id, triggered_by="nlr", cash_received=True)

    def test_payment_with_zero_interactions_pays_zero(self):
        """
        Test: Job with 0 interactions has no payment

        Given: Job exists but no one worked on it
        When: Payment triggered
        Then: Total paid = $0, job status = "paid"
        """
        # Setup
        job = create_test_job(value=1000, title="Untouched Job", status="completed")

        # Action: Trigger payment (no interactions)
        result = trigger_payment(
            job_id=job.id,
            triggered_by="nlr",
            cash_received=True
        )

        # Assertions
        assert result["total_paid"] == Decimal("0.00")
        assert len(result["member_payments"]) == 0
        assert get_job_status(job.id) == "paid"

    def test_payment_breakdown_visible_after_trigger(self):
        """
        Test: Payment breakdown accessible after payment
        Maps to: AC.md F6

        Given: Payment triggered
        When: Query payment breakdown
        Then: Shows each member's share with interaction counts
        """
        # Setup
        job = create_test_job(value=1500, title="Chatbot", status="completed")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        add_interactions(job.id, member_a.id, count=30)
        add_interactions(job.id, member_b.id, count=20)

        # Action: Trigger payment
        trigger_payment(job_id=job.id, triggered_by="nlr", cash_received=True)

        # Query payment breakdown
        from tests.fixtures.compensation_fixtures import get_payment_breakdown
        breakdown = get_payment_breakdown(job.id)

        # Assertions
        assert breakdown["job_value"] == Decimal("1500.00")
        assert breakdown["team_pool"] == Decimal("450.00")
        assert breakdown["total_interactions"] == 50

        assert len(breakdown["member_shares"]) == 2
        assert breakdown["member_shares"][member_a.slug] == {
            "interactions": 30,
            "share": Decimal("270.00"),
            "percentage": "60.00%"
        }
        assert breakdown["member_shares"][member_b.slug] == {
            "interactions": 20,
            "share": Decimal("180.00"),
            "percentage": "40.00%"
        }

    def test_payment_audit_log_created(self):
        """
        Test: Payment creates audit log entry
        Maps to: AC.md NF4 (Security - Audit logging)

        Given: Payment triggered
        When: Query audit log
        Then: Entry exists with who, what, when
        """
        # Setup
        job = create_test_job(value=1500, title="Test Job", status="completed")
        member = create_test_member("member_a")
        add_interactions(job.id, member.id, count=10)

        # Action: Trigger payment
        trigger_payment(job_id=job.id, triggered_by="nlr", cash_received=True)

        # Query audit log
        from tests.fixtures.compensation_fixtures import get_audit_log
        log = get_audit_log(job.id, event_type="payment_triggered")

        # Assertions
        assert len(log) == 1
        entry = log[0]

        assert entry["event_type"] == "payment_triggered"
        assert entry["triggered_by"] == "nlr"
        assert entry["job_slug"] == job.slug
        assert entry["amount_paid"] == Decimal("300.00")
        assert "timestamp" in entry


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
