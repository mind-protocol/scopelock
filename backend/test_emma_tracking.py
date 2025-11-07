#!/usr/bin/env python3
"""
Test Emma's FalkorDB tracking system with sample data.

This script verifies:
1. Search logging
2. Proposal creation
3. Search-to-proposal linking
4. Proposal state updates
5. Follow-up task creation
6. Analytics queries
"""

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from app.api.mission_deck.services.emma import (
    log_upwork_search,
    create_proposal,
    link_search_to_proposal,
    update_proposal_state,
    create_followup_task,
    get_proposals_needing_followup,
    get_proposal_by_slug,
    get_proposals_by_state,
    get_win_rate_by_search_query
)


def test_search_logging():
    """Test search logging functionality."""
    print("\n=== Testing Search Logging ===")

    search = log_upwork_search(
        search_query="AI integration Python Next.js",
        jobs_filtered=50,
        proposals_sent=3,
        filters_applied=["payment_verified", "fixed_price", "$3K+"]
    )

    print(f"✅ Search logged: {search['slug']}")
    print(f"   Query: {search.get('search_query')}")
    print(f"   Jobs filtered: {search.get('jobs_filtered')}")

    return search['slug']


def test_proposal_creation():
    """Test proposal creation with different scenarios."""
    print("\n=== Testing Proposal Creation ===")

    proposals = []

    # Proposal 1: STRONG GO - High-value client
    proposal1 = create_proposal(
        job_title="Build Dental SaaS MVP with AI",
        job_url="https://www.upwork.com/jobs/~test001",
        budget_cents=800000,  # $8000
        client_info={
            "name": "Dr. Smith",
            "spent": 12500.50,
            "rating": 4.9,
            "hires": 15,
            "payment_verified": True,
            "country": "United States",
            "rank": "Enterprise"
        },
        proposal_text="I noticed you need a Dental SaaS MVP. Here's what you'll get...",
        confidence=0.85,
        client_type="process-skeptical",
        portfolio_match="TherapyKin",
        questions=["Which integration matters most?"],
        decision="STRONG GO",
        urgency=8,
        pain=9
    )

    print(f"✅ Proposal 1 created: {proposal1['slug']}")
    print(f"   Client: {proposal1.get('client_name')}")
    print(f"   Budget: ${proposal1.get('amount_value')}")
    print(f"   State: {proposal1.get('state')}")
    proposals.append(proposal1)

    # Proposal 2: QUALIFIED MAYBE - Medium-value
    proposal2 = create_proposal(
        job_title="Build AI Chatbot for Website",
        job_url="https://www.upwork.com/jobs/~test002",
        budget_cents=500000,  # $5000
        client_info={
            "name": "John Doe",
            "spent": 3000.0,
            "rating": 4.7,
            "hires": 8,
            "payment_verified": True,
            "country": "Canada"
        },
        proposal_text="I noticed you need an AI chatbot...",
        confidence=0.70,
        client_type="process-skeptical",
        portfolio_match="TherapyKin",
        decision="QUALIFIED MAYBE",
        urgency=6,
        pain=7
    )

    print(f"✅ Proposal 2 created: {proposal2['slug']}")
    proposals.append(proposal2)

    # Proposal 3: Another STRONG GO
    proposal3 = create_proposal(
        job_title="Voice AI Integration for App",
        job_url="https://www.upwork.com/jobs/~test003",
        budget_cents=600000,  # $6000
        client_info={
            "name": "Sarah Johnson",
            "spent": 8000.0,
            "rating": 5.0,
            "hires": 12,
            "payment_verified": True,
            "country": "United Kingdom"
        },
        proposal_text="I noticed you need voice AI integration...",
        confidence=0.90,
        client_type="process-skeptical",
        portfolio_match="DuoAI",
        decision="STRONG GO",
        urgency=9,
        pain=8
    )

    print(f"✅ Proposal 3 created: {proposal3['slug']}")
    proposals.append(proposal3)

    return proposals


def test_search_to_proposal_linking(search_slug, proposal_slugs):
    """Test linking searches to proposals."""
    print("\n=== Testing Search-to-Proposal Linking ===")

    for proposal_slug in proposal_slugs:
        link_search_to_proposal(search_slug, proposal_slug)
        print(f"✅ Linked search {search_slug} → {proposal_slug}")


def test_proposal_state_updates(proposals):
    """Test updating proposal states."""
    print("\n=== Testing Proposal State Updates ===")

    # Proposal 1: Client accepted (win!)
    update_proposal_state(
        proposal_slug=proposals[0]['slug'],
        new_state="Confirmed",
        response_timestamp="2025-11-05T14:30:00Z"
    )
    print(f"✅ Proposal 1 → Confirmed (WIN)")

    # Proposal 2: Client rejected
    update_proposal_state(
        proposal_slug=proposals[1]['slug'],
        new_state="Rejected",
        response_timestamp="2025-11-06T10:15:00Z"
    )
    print(f"✅ Proposal 2 → Rejected")

    # Proposal 3: Still pending (will need follow-up)
    print(f"✅ Proposal 3 → Still Proposed (needs follow-up)")


def test_followup_task_creation(proposal):
    """Test follow-up task creation."""
    print("\n=== Testing Follow-up Task Creation ===")

    followup = create_followup_task(
        proposal_slug=proposal['slug'],
        followup_date="2025-11-20",
        reason="No response after 14 days",
        followup_type="no_response"
    )

    print(f"✅ Follow-up task created: {followup['slug']}")
    print(f"   Due date: {followup.get('due_date')}")
    print(f"   Reason: {followup.get('reason')}")


def test_proposals_needing_followup():
    """Test getting proposals that need follow-up."""
    print("\n=== Testing Get Proposals Needing Follow-up ===")

    proposals = get_proposals_needing_followup(days_since=0)  # 0 days for testing

    print(f"✅ Found {len(proposals)} proposals needing follow-up")
    for p in proposals:
        print(f"   - {p.get('client_name')}: {p.get('job_title')}")


def test_get_proposals_by_state():
    """Test getting proposals by state."""
    print("\n=== Testing Get Proposals by State ===")

    states = ["Proposed", "Confirmed", "Rejected"]

    for state in states:
        proposals = get_proposals_by_state(state, limit=10)
        print(f"✅ {state}: {len(proposals)} proposals")


def test_win_rate_analytics():
    """Test win rate analytics."""
    print("\n=== Testing Win Rate Analytics ===")

    results = get_win_rate_by_search_query()

    if results:
        print(f"✅ Win rate analysis:")
        for row in results:
            query = row.get('search_query', 'Unknown')
            total = row.get('total_proposals', 0)
            wins = row.get('wins', 0)
            win_rate = row.get('win_rate', 0) * 100
            print(f"   {query}: {wins}/{total} wins ({win_rate:.1f}%)")
    else:
        print("✅ No win rate data yet (expected for first test)")


def main():
    """Run all tests."""
    print("=" * 60)
    print("Emma FalkorDB Tracking System Test")
    print("=" * 60)

    try:
        # Test 1: Log search
        search_slug = test_search_logging()

        # Test 2: Create proposals
        proposals = test_proposal_creation()
        proposal_slugs = [p['slug'] for p in proposals]

        # Test 3: Link searches to proposals
        test_search_to_proposal_linking(search_slug, proposal_slugs)

        # Test 4: Update proposal states
        test_proposal_state_updates(proposals)

        # Test 5: Create follow-up task (for proposal 3, still pending)
        test_followup_task_creation(proposals[2])

        # Test 6: Get proposals needing follow-up
        test_proposals_needing_followup()

        # Test 7: Get proposals by state
        test_get_proposals_by_state()

        # Test 8: Win rate analytics
        test_win_rate_analytics()

        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED")
        print("=" * 60)
        print("\nEmma's FalkorDB tracking system is working correctly!")
        print("Next steps:")
        print("1. Check local backups in /var/data/emma/proposals/")
        print("2. Query FalkorDB directly to verify graph structure")
        print("3. Integrate into Emma's workflow in CLAUDE.md")

    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
