"""
Backend Tests: Interaction Tracking Accuracy (T1)
Maps to: AC.md F1 (Job Tracking with Interaction Counting)
Mission: mission-deck-compensation
"""

import pytest
from decimal import Decimal
from datetime import datetime, timedelta
from tests.fixtures.compensation_fixtures import (
    create_test_job,
    create_test_member,
    send_message_to_ai,
    get_interaction_count,
    get_total_interactions,
    query_graph,
    clear_test_data,
)


@pytest.fixture(autouse=True)
def setup_and_teardown():
    """Clear test data before and after each test."""
    clear_test_data()
    yield
    clear_test_data()


class TestInteractionTracking:
    """Test suite for interaction tracking accuracy."""

    def test_interaction_increments_on_message_sent(self):
        """
        Test: Interaction count increments when message sent
        Maps to: VALIDATION.md T1.1

        Given: Job exists with $1,000 value
        When: Member A sends message to Rafael
        Then: Member A interaction count = 1, total = 1
        """
        # Setup
        job = create_test_job(value=1000, title="Build Chatbot")
        member = create_test_member("member_a")

        # Action
        send_message_to_ai(
            job_id=job.id,
            member_id=member.id,
            ai="rafael",
            message="Implement OTP flow"
        )

        # Assertions
        assert get_interaction_count(job.id, member.id) == 1
        assert get_total_interactions(job.id) == 1

        # Verify FalkorDB persistence
        events = query_graph(f"""
            MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {{slug: '{job.slug}'}})
            WHERE e.actor_ref = '{member.slug}'
            RETURN e
        """)
        assert len(events) == 1
        assert events[0]["e"]["event_kind"] == "message"
        assert events[0]["e"]["ai_recipient"] == "rafael"

    def test_interaction_counts_only_in_job_thread(self):
        """
        Test: Interactions counted per-job only
        Maps to: VALIDATION.md T1.2

        Given: 2 jobs exist (Job A, Job B)
        When: Member sends message in Job A thread
        Then: Job A interactions = 1, Job B interactions = 0
        """
        # Setup
        job_a = create_test_job(value=1000, title="Chatbot")
        job_b = create_test_job(value=800, title="Dashboard")
        member = create_test_member("member_a")

        # Action: Send message in Job A context
        send_message_to_ai(
            job_id=job_a.id,
            member_id=member.id,
            ai="inna",
            message="Update AC.md"
        )

        # Assertions
        assert get_interaction_count(job_a.id, member.id) == 1
        assert get_interaction_count(job_b.id, member.id) == 0
        assert get_total_interactions(job_a.id) == 1
        assert get_total_interactions(job_b.id) == 0

    def test_multiple_members_tracked_separately(self):
        """
        Test: Multiple members tracked independently
        Maps to: VALIDATION.md T1.3

        Given: Job exists
        When: Member A sends 5 messages, Member B sends 3 messages
        Then: Member A count = 5, Member B count = 3, Total = 8
        """
        # Setup
        job = create_test_job(value=1500, title="AI Dashboard")
        member_a = create_test_member("member_a")
        member_b = create_test_member("member_b")

        # Action: Member A sends 5 messages
        for i in range(5):
            send_message_to_ai(
                job_id=job.id,
                member_id=member_a.id,
                ai="rafael",
                message=f"Member A message {i+1}"
            )

        # Action: Member B sends 3 messages
        for i in range(3):
            send_message_to_ai(
                job_id=job.id,
                member_id=member_b.id,
                ai="sofia",
                message=f"Member B message {i+1}"
            )

        # Assertions
        assert get_interaction_count(job.id, member_a.id) == 5
        assert get_interaction_count(job.id, member_b.id) == 3
        assert get_total_interactions(job.id) == 8

    def test_interaction_not_counted_outside_job_context(self):
        """
        Test: Messages outside job context not counted
        Maps to: VALIDATION.md T1.4

        Given: Member sends message in general chat (not job thread)
        When: Message sent
        Then: No job interaction count incremented
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")
        member = create_test_member("member_a")

        # Action: Send message WITHOUT job context
        send_message_to_ai(
            job_id=None,  # No job context
            member_id=member.id,
            ai="emma",
            message="General question about proposals"
        )

        # Assertions
        assert get_interaction_count(job.id, member.id) == 0
        assert get_total_interactions(job.id) == 0

    def test_duplicate_message_prevention(self):
        """
        Test: Duplicate messages not counted
        Maps to: VALIDATION.md T1.5

        Given: Member sends same message twice within 1 second
        When: Messages sent
        Then: Only 1 interaction counted (duplicate detection)
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")
        member = create_test_member("member_a")

        # Action: Send identical message twice rapidly
        message = "Implement OTP flow"
        send_message_to_ai(job.id, member.id, "rafael", message)
        send_message_to_ai(job.id, member.id, "rafael", message)  # Duplicate

        # Assertion: Only 1 counted (duplicate detection)
        assert get_interaction_count(job.id, member.id) == 1
        assert get_total_interactions(job.id) == 1

    def test_interaction_audit_trail(self):
        """
        Test: Complete audit trail stored in FalkorDB
        Maps to: VALIDATION.md T1.6

        Given: Member sends 10 messages
        When: Messages sent over time
        Then: 10 U4_Event nodes exist with timestamps, all linked to job
        """
        # Setup
        job = create_test_job(value=1500, title="Chatbot")
        member = create_test_member("member_a")

        # Action: Send 10 messages
        for i in range(10):
            send_message_to_ai(
                job_id=job.id,
                member_id=member.id,
                ai="rafael" if i % 2 == 0 else "sofia",
                message=f"Message {i+1}"
            )

        # Query FalkorDB for interaction history
        events = query_graph(f"""
            MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {{slug: '{job.slug}'}})
            WHERE e.actor_ref = '{member.slug}'
            RETURN e
            ORDER BY e.timestamp DESC
        """)

        # Assertions
        assert len(events) == 10
        assert get_interaction_count(job.id, member.id) == 10

        # Verify all events have required fields
        for event in events:
            assert event["e"]["event_kind"] == "message"
            assert event["e"]["actor_ref"] == member.slug
            assert "timestamp" in event["e"]
            assert event["e"]["ai_recipient"] in ["rafael", "sofia", "inna", "emma"]

    def test_interaction_count_persists_across_sessions(self):
        """
        Test: Interaction counts persist after system restart

        Given: Member has 5 interactions on job
        When: System restarts (simulated by clearing cache)
        Then: Interaction count still = 5 (persisted in FalkorDB)
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")
        member = create_test_member("member_a")

        # Action: Send 5 messages
        for i in range(5):
            send_message_to_ai(job.id, member.id, "rafael", f"Message {i+1}")

        # Verify count before "restart"
        assert get_interaction_count(job.id, member.id) == 5

        # Simulate system restart (clear in-memory cache)
        from tests.fixtures.compensation_fixtures import clear_cache
        clear_cache()

        # Assertion: Count still correct after restart (loaded from FalkorDB)
        assert get_interaction_count(job.id, member.id) == 5

    def test_interaction_timestamp_accuracy(self):
        """
        Test: Timestamps accurate to the second

        Given: Member sends message
        When: Message sent at specific time
        Then: Event timestamp matches within 1 second
        """
        # Setup
        job = create_test_job(value=1000, title="Test Job")
        member = create_test_member("member_a")

        # Action
        before = datetime.utcnow()
        send_message_to_ai(job.id, member.id, "rafael", "Test message")
        after = datetime.utcnow()

        # Query timestamp
        events = query_graph(f"""
            MATCH (e:U4_Event)-[:U4_ABOUT]->(job:U4_Work_Item {{slug: '{job.slug}'}})
            WHERE e.actor_ref = '{member.slug}'
            RETURN e.timestamp as timestamp
        """)

        assert len(events) == 1
        event_time = datetime.fromisoformat(events[0]["timestamp"])

        # Assertion: Timestamp within 1 second
        assert before <= event_time <= after + timedelta(seconds=1)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
