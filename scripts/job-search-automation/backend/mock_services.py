"""
Mock services for API development
Phase 2: Replace with real services from Rafael-3

DOCUMENTATION:
- /docs/automation/job-search-automation/architecture/00_MAPPING.md § Backend Services
- /citizens/emma/MISSION_SELECTION.md § Emma's Scoring System
- /docs/marketing/proposal_framework.md § Proposal Templates

PURPOSE:
Provide mock implementations of backend services to allow API development
without waiting for real service implementations.

USAGE:
These are imported by API files (jobs.py, proposals.py, etc.) during Phase 1.
Rafael-3 will implement real services, then APIs import those instead.
"""

from datetime import datetime
from typing import List, Literal, Optional, Dict, Any


# === MOCK MODELS === #
# These mirror Rafael-1's TypeScript interfaces


class EmmaScoreBreakdown:
    """Emma's 0-13 point score breakdown (mock)"""

    def __init__(
        self,
        stack_match: int = 3,
        budget_fit: int = 2,
        clear_scope: int = 2,
        client_quality: int = 2,
        timeline: int = 1,
        ai_fit: int = 1,
    ):
        self.stack_match = stack_match
        self.budget_fit = budget_fit
        self.clear_scope = clear_scope
        self.client_quality = client_quality
        self.timeline = timeline
        self.ai_fit = ai_fit

    def to_dict(self) -> dict:
        return {
            "stack_match": self.stack_match,
            "budget_fit": self.budget_fit,
            "clear_scope": self.clear_scope,
            "client_quality": self.client_quality,
            "timeline": self.timeline,
            "ai_fit": self.ai_fit,
        }


class EmmaScore:
    """Emma's complete score with recommendation (mock)"""

    def __init__(
        self,
        total: int = 11,
        breakdown: Optional[EmmaScoreBreakdown] = None,
        recommendation: Literal["strong_yes", "maybe", "pass"] = "strong_yes",
    ):
        self.total = total
        self.breakdown = breakdown or EmmaScoreBreakdown()
        self.recommendation = recommendation

    def to_dict(self) -> dict:
        return {
            "total": self.total,
            "breakdown": self.breakdown.to_dict(),
            "recommendation": self.recommendation,
        }


class Proposal:
    """Proposal draft (mock)"""

    def __init__(
        self,
        job_id: str,
        template_used: str = "process-skeptical",
        proposal_text: str = "# Evidence Sprint\n\nMock proposal...",
        portfolio_referenced: Optional[List[str]] = None,
        status: str = "draft",
        created_at: Optional[str] = None,
    ):
        self.job_id = job_id
        self.template_used = template_used
        self.proposal_text = proposal_text
        self.portfolio_referenced = portfolio_referenced or [
            "la-serenissima",
            "terminal-velocity",
        ]
        self.status = status
        self.created_at = created_at or datetime.now().isoformat()

    def to_dict(self) -> dict:
        return {
            "job_id": self.job_id,
            "template_used": self.template_used,
            "proposal_text": self.proposal_text,
            "portfolio_referenced": self.portfolio_referenced,
            "status": self.status,
            "created_at": self.created_at,
        }


# === MOCK SERVICE CLASSES === #


class MockJobScoringEngine:
    """
    Mock implementation of Emma's 0-13 scoring engine

    Real implementation: /backend/services/job_scoring_engine.py (Rafael-3)
    Documentation: /citizens/emma/MISSION_SELECTION.md § Emma's Scoring System ⭐⭐
    """

    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def score_job(self, job_details: dict) -> EmmaScore:
        """
        Mock Emma's 0-13 scoring

        Real implementation will:
        1. Analyze job description for stack match (0-3)
        2. Check budget fit (0-2)
        3. Evaluate scope clarity (0-2)
        4. Assess client quality (0-2)
        5. Check timeline (0-1)
        6. Evaluate AI integration fit (0-3)
        7. Return total score + recommendation

        For now: Return fixed high score
        """
        return EmmaScore(
            total=11,
            breakdown=EmmaScoreBreakdown(
                stack_match=3,
                budget_fit=2,
                clear_scope=2,
                client_quality=2,
                timeline=1,
                ai_fit=1,
            ),
            recommendation="strong_yes",
        )


class MockProposalDrafter:
    """
    Mock implementation of proposal drafting service

    Real implementation: /backend/services/proposal_drafter.py (Rafael-3)
    Documentation: /docs/marketing/proposal_framework.md § Proposal Templates ⭐⭐
    """

    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def draft_proposal(self, job_id: str, job_details: Optional[dict] = None) -> Proposal:
        """
        Mock proposal drafting

        Real implementation will:
        1. Fetch job details from FalkorDB
        2. Detect client type (process-skeptical vs process-oriented)
        3. Select appropriate template from proposal_framework.md
        4. Match relevant portfolio projects (from /docs/portfolio/)
        5. Generate personalized proposal
        6. Return Proposal object with text + metadata

        For now: Return mock proposal
        """
        proposal = Proposal(job_id=job_id)
        return proposal


class MockTaskPipelineManager:
    """
    Mock implementation of task pipeline creation

    Real implementation: /backend/services/task_pipeline_manager.py (Rafael-3)
    Documentation: /docs/automation/02-task-pipeline-spec.md § State Machine ⭐⭐
    """

    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def create_pipeline(self, job_id: str) -> List[str]:
        """
        Mock task pipeline creation

        Real implementation will:
        1. Create 5 U4_Work_Item nodes (tasks):
           - Specification (Inna)
           - Implementation (Rafael → Developer)
           - Deployment (Developer)
           - QA (Sofia)
           - Delivery (Developer → Client)
        2. Link tasks with U4_DEPENDS_ON (dependency graph)
        3. Assign to appropriate agents via U4_ASSIGNED_TO
        4. Return list of task IDs

        For now: Return mock task IDs
        """
        return [
            f"{job_id}-task-1-spec",
            f"{job_id}-task-2-impl",
            f"{job_id}-task-3-deploy",
            f"{job_id}-task-4-qa",
            f"{job_id}-task-5-delivery",
        ]


class MockHandoffBriefGenerator:
    """
    Mock implementation of handoff brief generation

    Real implementation: /backend/services/handoff_brief_generator.py (Rafael-3)
    Documentation: /docs/automation/03-handoff-system-spec.md § Handoff Brief Flow ⭐⭐
    """

    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def generate_handoff(self, task_id: str, to_agent: str) -> dict:
        """
        Mock handoff brief generation

        Real implementation will:
        1. Fetch task details from FalkorDB
        2. Fetch related job/mission context
        3. Generate Telegram notification with:
           - Task description
           - Context (job details, client info)
           - Action buttons (Accept / Reassign)
        4. Send via /tools/telegram-send.cjs
        5. Create U4_Event node for audit trail
        6. Return notification metadata

        For now: Return mock notification
        """
        return {
            "task_id": task_id,
            "to_agent": to_agent,
            "message": f"<b>New Task Handoff</b>\n\nTask: {task_id}\nAssigned to: {to_agent}",
            "notification_sent": True,
        }


class MockFollowUpReminder:
    """
    Mock implementation of follow-up reminder service

    Real implementation: /backend/services/follow_up_reminder.py (Rafael-3)
    Documentation: /docs/marketing/daily_job_search_strategy.md § Follow-Up Protocol
    """

    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def find_proposals_needing_followup(self, user_email: str) -> List[dict]:
        """
        Mock follow-up query

        Real implementation will:
        1. Query FalkorDB for proposals >24h old
        2. Filter: No FOLLOWUP_SENT link OR >48h since last follow-up
        3. Return list of proposals needing follow-up

        For now: Return empty list
        """
        return []


# === SINGLETON INSTANCES === #
# These can be used directly or instantiated per-request


def get_mock_job_scoring_engine(falkor_client):
    """Factory function for job scoring engine"""
    return MockJobScoringEngine(falkor_client)


def get_mock_proposal_drafter(falkor_client):
    """Factory function for proposal drafter"""
    return MockProposalDrafter(falkor_client)


def get_mock_task_pipeline_manager(falkor_client):
    """Factory function for task pipeline manager"""
    return MockTaskPipelineManager(falkor_client)


def get_mock_handoff_brief_generator(falkor_client):
    """Factory function for handoff brief generator"""
    return MockHandoffBriefGenerator(falkor_client)


def get_mock_follow_up_reminder(falkor_client):
    """Factory function for follow-up reminder"""
    return MockFollowUpReminder(falkor_client)


"""
IMPLEMENTATION NOTES:

1. MOCK DATA VS. REAL DATA:
   - These mocks return fixed values for development
   - Rafael-3 implements real services with actual logic
   - APIs should work identically with both mock and real services

2. TRANSITION PLAN (Phase 2):
   - Rafael-3 implements real services in /backend/services/
   - APIs update imports from mock_services → real services
   - Example:
     OLD: from ..mock_services import MockJobScoringEngine
     NEW: from ..services.job_scoring_engine import JobScoringEngine

3. FALKOR CLIENT:
   - All services receive falkor_client in __init__
   - This allows real services to query/mutate graph
   - Mocks ignore it (return fixed data)

4. CONSISTENCY WITH TYPESCRIPT:
   - EmmaScore, Proposal models match Rafael-1's TypeScript interfaces
   - Ensures frontend can consume API without changes

5. TESTING:
   - These mocks are also used in test files
   - Tests verify API structure, not service logic
   - Service logic tested separately by Rafael-3
"""
