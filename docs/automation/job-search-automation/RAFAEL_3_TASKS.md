# Rafael-3: Backend Services + Database Tasks

**Your Track:** Services + Database (11 files)
**Estimated Time:** 8-10 hours
**Work Mode:** Foundational layer - others depend on you

---

## Your Deliverables

### Backend Services (5 files)
1. job_scoring_engine.py
2. proposal_drafter.py
3. task_pipeline_manager.py
4. handoff_brief_generator.py
5. follow_up_reminder.py

### Backend Cron (1 file)
6. morning_brief_cron.py

### Database (5 files)
7. 001_job_search_graph_schema.md
8. 002_seed_jobs.json
9. 003_seed_proposals.json
10. 004_seed_tasks.json
11. README.md

---

## Step-by-Step Instructions

### Phase 1: Read Documentation (45 min)

**CRITICAL READING (these are your source of truth):**
1. `/citizens/emma/MISSION_SELECTION.md` ⭐⭐ AUTHORITATIVE - Emma's 0-13 scoring system
2. `/docs/marketing/proposal_framework.md` ⭐⭐ - Proposal templates
3. `/docs/automation/02-task-pipeline-spec.md` ⭐⭐ - Task state machine
4. `/home/mind-protocol/mind-protocol/docs/COMPLETE_TYPE_REFERENCE.md` - Mind Protocol types

**Additional context:**
5. `/docs/automation/job-search-automation/architecture/00_MAPPING.md` - Your files
6. `/scripts/mission-deck/backend/migrations/README.md` - FalkorDB ingestion examples

---

### Phase 2: Set Up Directory Structure (5 min)

```bash
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/backend/{services,cron}
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/database
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/tests/backend/services
```

---

### Phase 3: Implement Services (4 hours)

#### File 1: job_scoring_engine.py (60 min) ⭐ MOST CRITICAL

**Reference:** `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System

**Complete Implementation Required:**

```python
"""
Job Scoring Engine - Emma's 0-13 point system

DOCUMENTATION:
- AUTHORITATIVE: /citizens/emma/MISSION_SELECTION.md § Emma's Scoring System
- Strategy: /docs/marketing/daily_job_search_strategy.md § Job Selection Criteria

PURPOSE:
Analyze job posts and score 0-13 points based on:
- Stack match: 0-3 (Python/JS/TS, Next.js, FastAPI)
- Budget fit: 0-2 ($200-600 Phase 1, $600-1500 Phase 2+)
- Clear scope: 0-2 (can write AC.md in 5 min)
- Client quality: 0-2 (payment verified, $1000+ spent, 4.5+ rating)
- Timeline: 0-1 (2-7 days)
- AI fit: 0-3 (opportunity for AI features)

DECISION LOGIC:
- 8-13 points: strong_yes (write proposal)
- 6-7 points: maybe (ask Alexis/NLR)
- 0-5 points: pass
"""

from typing import Dict, Literal, List
from dataclasses import dataclass

@dataclass
class EmmaScoreBreakdown:
    stack_match: int  # 0-3
    budget_fit: int  # 0-2
    clear_scope: int  # 0-2
    client_quality: int  # 0-2
    timeline: int  # 0-1
    ai_fit: int  # 0-3

@dataclass
class EmmaScore:
    total: int  # 0-13
    breakdown: EmmaScoreBreakdown
    recommendation: Literal["strong_yes", "maybe", "pass"]

class JobScoringEngine:
    """
    Emma's 0-13 point scoring engine
    
    Implements: /citizens/emma/MISSION_SELECTION.md § Emma's Scoring System
    """
    
    def __init__(self, falkor_client=None):
        self.falkor_client = falkor_client
        
        # Stack patterns from MISSION_SELECTION.md
        self.stack_keywords = {
            "python": ["python", "fastapi", "django", "flask"],
            "javascript": ["javascript", "js", "node", "next.js", "react"],
            "typescript": ["typescript", "ts"],
            "frameworks": ["next.js", "fastapi", "django", "react"]
        }
        
        # AI opportunity keywords
        self.ai_keywords = [
            "ai", "machine learning", "ml", "llm", "gpt", "openai",
            "claude", "chatbot", "assistant", "automation"
        ]
    
    def score_job(self, job_details: Dict) -> EmmaScore:
        """
        Score a job using Emma's 0-13 point system
        
        Args:
            job_details: {
                "title": str,
                "description": str,
                "requirements": List[str],
                "budget": float,
                "timeline": str,  # "3-5 days", "1 week", etc.
                "client": {
                    "rating": float,
                    "payment_verified": bool,
                    "total_spent": float,
                    "jobs_posted": int
                }
            }
        
        Returns:
            EmmaScore with 0-13 total and breakdown
        """
        
        breakdown = EmmaScoreBreakdown(
            stack_match=self._score_stack_match(job_details),
            budget_fit=self._score_budget_fit(job_details["budget"]),
            clear_scope=self._score_clear_scope(job_details),
            client_quality=self._score_client_quality(job_details["client"]),
            timeline=self._score_timeline(job_details["timeline"]),
            ai_fit=self._score_ai_fit(job_details)
        )
        
        total = (
            breakdown.stack_match +
            breakdown.budget_fit +
            breakdown.clear_scope +
            breakdown.client_quality +
            breakdown.timeline +
            breakdown.ai_fit
        )
        
        # Decision logic from MISSION_SELECTION.md § Decision
        if total >= 8:
            recommendation = "strong_yes"
        elif total >= 6:
            recommendation = "maybe"
        else:
            recommendation = "pass"
        
        return EmmaScore(
            total=total,
            breakdown=breakdown,
            recommendation=recommendation
        )
    
    def _score_stack_match(self, job_details: Dict) -> int:
        """
        Score stack match: 0-3 points
        
        IMPLEMENTS: /citizens/emma/MISSION_SELECTION.md § Stack Match
        
        Scoring:
        - 3 points: 80%+ our tools (Python/JS/TS, Next.js, FastAPI)
        - 2 points: 60-80% match
        - 1 point: 40-60% match
        - 0 points: <40% match
        """
        text = (job_details["title"] + " " + job_details["description"]).lower()
        
        # Count stack keywords
        matches = 0
        total_keywords = 0
        
        for category, keywords in self.stack_keywords.items():
            total_keywords += len(keywords)
            for keyword in keywords:
                if keyword in text:
                    matches += 1
        
        match_percentage = matches / total_keywords if total_keywords > 0 else 0
        
        if match_percentage >= 0.8:
            return 3
        elif match_percentage >= 0.6:
            return 2
        elif match_percentage >= 0.4:
            return 1
        else:
            return 0
    
    def _score_budget_fit(self, budget: float) -> int:
        """
        Score budget fit: 0-2 points
        
        IMPLEMENTS: /citizens/emma/MISSION_SELECTION.md § Budget
        
        Phase 1 (Week 1-4): $200-600
        Phase 2+ (Month 2+): $600-1500
        
        Scoring:
        - 2 points: Perfect fit ($200-600 or $600-1500 depending on phase)
        - 1 point: Close ($150-200 or $600-800)
        - 0 points: Outside range
        """
        # TODO: Get current phase from config (default Phase 1)
        phase_1_range = (200, 600)
        phase_2_range = (600, 1500)
        
        # Check Phase 1 range
        if phase_1_range[0] <= budget <= phase_1_range[1]:
            return 2
        elif budget >= 150 and budget < phase_1_range[0]:
            return 1
        elif budget > phase_1_range[1] and budget <= 800:
            return 1
        else:
            return 0
    
    def _score_clear_scope(self, job_details: Dict) -> int:
        """
        Score clear scope: 0-2 points
        
        IMPLEMENTS: /citizens/emma/MISSION_SELECTION.md § Clear Deliverable
        
        Criteria:
        - Can write AC.md in 5 minutes
        - Clear requirements listed
        - No vague "ongoing maintenance"
        
        Scoring:
        - 2 points: Very clear (3+ requirements, deliverable stated)
        - 1 point: Somewhat clear
        - 0 points: Vague or "ongoing"
        """
        description = job_details["description"].lower()
        requirements = job_details.get("requirements", [])
        
        # Red flags (vague scope)
        vague_keywords = ["ongoing", "maintenance", "as needed", "flexible"]
        has_vague = any(keyword in description for keyword in vague_keywords)
        
        # Green flags (clear scope)
        has_requirements = len(requirements) >= 3
        has_deliverable = any(word in description for word in ["build", "create", "develop", "implement"])
        
        if has_requirements and has_deliverable and not has_vague:
            return 2
        elif has_deliverable and not has_vague:
            return 1
        else:
            return 0
    
    def _score_client_quality(self, client: Dict) -> int:
        """
        Score client quality: 0-2 points
        
        IMPLEMENTS: /citizens/emma/MISSION_SELECTION.md § Client Quality
        
        Criteria:
        - 3+ green flags: payment verified, $1000+ spent, 4.5+ rating
        
        Scoring:
        - 2 points: 3 green flags
        - 1 point: 2 green flags
        - 0 points: <2 green flags
        """
        green_flags = 0
        
        if client.get("payment_verified", False):
            green_flags += 1
        
        if client.get("total_spent", 0) >= 1000:
            green_flags += 1
        
        if client.get("rating", 0) >= 4.5:
            green_flags += 1
        
        if green_flags >= 3:
            return 2
        elif green_flags >= 2:
            return 1
        else:
            return 0
    
    def _score_timeline(self, timeline: str) -> int:
        """
        Score timeline: 0-1 point
        
        IMPLEMENTS: /citizens/emma/MISSION_SELECTION.md § Timeline
        
        Criteria:
        - 2-7 days ideal
        
        Scoring:
        - 1 point: 2-7 days
        - 0 points: Outside range
        """
        timeline_lower = timeline.lower()
        
        # Extract days
        days = 0
        if "week" in timeline_lower:
            # "1 week" = 7 days
            if "1" in timeline_lower:
                days = 7
            elif "2" in timeline_lower:
                days = 14
        elif "day" in timeline_lower:
            # Extract first number
            import re
            match = re.search(r'(\d+)', timeline_lower)
            if match:
                days = int(match.group(1))
        
        if 2 <= days <= 7:
            return 1
        else:
            return 0
    
    def _score_ai_fit(self, job_details: Dict) -> int:
        """
        Score AI integration fit: 0-3 points
        
        IMPLEMENTS: /citizens/emma/MISSION_SELECTION.md § AI Integration Fit
        
        Criteria:
        - Explicit AI features requested
        - Opportunity for AI enhancement
        
        Scoring:
        - 3 points: Explicit AI requirements (chatbot, LLM, etc.)
        - 2 points: Clear AI opportunity (automation, smart features)
        - 1 point: Minor AI opportunity
        - 0 points: No AI relevance
        """
        text = (job_details["title"] + " " + job_details["description"]).lower()
        
        # Count AI keyword matches
        ai_matches = sum(1 for keyword in self.ai_keywords if keyword in text)
        
        if ai_matches >= 3:
            return 3
        elif ai_matches >= 2:
            return 2
        elif ai_matches >= 1:
            return 1
        else:
            return 0
```

**Test file:** Create `test_job_scoring_engine.py` with pytest tests for each scoring function

---

#### File 2: proposal_drafter.py (45 min)

**Reference:** `/docs/marketing/proposal_framework.md`

**Key Implementation:**

```python
"""
Proposal Drafter - Generate proposals from templates

DOCUMENTATION:
- AUTHORITATIVE: /docs/marketing/proposal_framework.md
- Client Personas: /docs/marketing/communication_guide.md

PURPOSE:
Draft proposals using template selection:
- Process-skeptical: "We just need it done fast and reliably"
- Process-oriented: "Explain your process and how you ensure quality"
"""

from typing import Literal, List
from dataclasses import dataclass

@dataclass
class Proposal:
    job_id: str
    template_used: Literal["process-skeptical", "process-oriented"]
    proposal_text: str  # Markdown
    portfolio_referenced: List[str]  # ["la-serenissima", "terminal-velocity"]
    status: Literal["draft", "approved", "submitted", "rejected"]
    created_at: str

class ProposalDrafter:
    """
    Generate proposals from templates
    
    Implements: /docs/marketing/proposal_framework.md
    """
    
    def __init__(self, falkor_client=None):
        self.falkor_client = falkor_client
        
        # Portfolio projects for references
        self.portfolio = {
            "la-serenissima": {
                "name": "La Serenissima",
                "url": "https://serenissima.ai",
                "proof": "97+ agents, 6+ months production, 99.7% uptime"
            },
            "terminal-velocity": {
                "name": "Terminal Velocity",
                "url": "https://github.com/nlr-ai/terminal-velocity",
                "proof": "1,051 stars, top 0.01% of GitHub"
            },
            "therapykin": {
                "name": "TherapyKin",
                "url": "https://therapykin.ai",
                "proof": "121+ deployments, AI companion, text+voice"
            }
        }
    
    def draft_proposal(self, job_id: str, job_details: dict) -> Proposal:
        """
        Draft proposal using appropriate template
        
        Args:
            job_id: Unique job identifier
            job_details: Job information (title, description, budget, etc.)
        
        Returns:
            Proposal with template_used and proposal_text
        """
        
        # Select template based on job characteristics
        template_type = self._select_template(job_details)
        
        # Select portfolio projects to reference
        portfolio_refs = self._select_portfolio_projects(job_details)
        
        # Generate proposal text
        proposal_text = self._generate_proposal_text(
            template_type, job_details, portfolio_refs
        )
        
        return Proposal(
            job_id=job_id,
            template_used=template_type,
            proposal_text=proposal_text,
            portfolio_referenced=portfolio_refs,
            status="draft",
            created_at=datetime.now().isoformat()
        )
    
    def _select_template(self, job_details: dict) -> str:
        """
        Select template: process-skeptical or process-oriented
        
        IMPLEMENTS: /docs/marketing/proposal_framework.md § Template Selection
        
        Heuristics:
        - Process-skeptical: "quick", "asap", "simple", lower budget
        - Process-oriented: "process", "quality", "methodology", higher budget
        """
        description = job_details["description"].lower()
        budget = job_details["budget"]
        
        # Process-skeptical indicators
        skeptical_keywords = ["quick", "asap", "simple", "straightforward", "fast"]
        has_skeptical = any(k in description for k in skeptical_keywords)
        
        # Process-oriented indicators
        oriented_keywords = ["process", "quality", "methodology", "testing", "documentation"]
        has_oriented = any(k in description for k in oriented_keywords)
        
        # Decision logic
        if has_oriented or budget > 800:
            return "process-oriented"
        else:
            return "process-skeptical"
    
    def _select_portfolio_projects(self, job_details: dict) -> List[str]:
        """
        Select 1-2 portfolio projects relevant to job
        
        Relevance matching:
        - AI job → La Serenissima, TherapyKin
        - Technical depth → La Serenissima, Terminal Velocity
        - Landing page → TherapyKin
        """
        description = (job_details["title"] + " " + job_details["description"]).lower()
        
        refs = []
        
        # AI-related → La Serenissima
        if any(k in description for k in ["ai", "ml", "chatbot", "automation"]):
            refs.append("la-serenissima")
        
        # Technical depth → Terminal Velocity (social proof via GitHub stars)
        if len(refs) < 2:
            refs.append("terminal-velocity")
        
        return refs[:2]  # Max 2 references
    
    def _generate_proposal_text(
        self, template_type: str, job_details: dict, portfolio_refs: List[str]
    ) -> str:
        """
        Generate proposal Markdown from template
        
        IMPLEMENTS: /docs/marketing/proposal_framework.md § Templates
        """
        
        if template_type == "process-skeptical":
            return self._generate_process_skeptical_proposal(job_details, portfolio_refs)
        else:
            return self._generate_process_oriented_proposal(job_details, portfolio_refs)
    
    def _generate_process_skeptical_proposal(
        self, job_details: dict, portfolio_refs: List[str]
    ) -> str:
        """Process-skeptical template (brief, results-focused)"""
        
        portfolio_section = "\n\n".join([
            f"**{self.portfolio[ref]['name']}** ({self.portfolio[ref]['url']})\n"
            f"→ {self.portfolio[ref]['proof']}"
            for ref in portfolio_refs
        ])
        
        return f"""# {job_details['title']}

I'll deliver this in {job_details['timeline']} with proof at every step.

## What You Get

{job_details['description'][:200]}...

## Evidence Sprint Approach

**Day 1:** Working prototype (you can test it)
**Day 2-3:** Core features complete (you approve each)
**Day 4:** Polish + deploy (you verify it's live)

## Recent Work

{portfolio_section}

Budget: ${job_details['budget']} | Timeline: {job_details['timeline']}

Ready to start immediately.
"""
    
    def _generate_process_oriented_proposal(
        self, job_details: dict, portfolio_refs: List[str]
    ) -> str:
        """Process-oriented template (detailed, methodology-focused)"""
        
        # Similar structure, more detailed...
        # TODO: Implement full template from proposal_framework.md
        pass
```

---

#### File 3-5: Remaining Services (90 min total)

**task_pipeline_manager.py** (30 min)
- Implements `/docs/automation/02-task-pipeline-spec.md`
- Creates 5 tasks when job won: spec → implementation → deployment → QA → delivery
- Uses U4_DEPENDS_ON links for dependencies

**handoff_brief_generator.py** (30 min)
- Implements `/docs/automation/03-handoff-system-spec.md`
- Generates Telegram message with action buttons
- Uses `/tools/telegram-send.cjs` for sending

**follow_up_reminder.py** (30 min)
- Queries graph for proposals >24h old with no FOLLOWUP_SENT link
- Returns list of proposals needing follow-up

---

### Phase 4: Implement Cron Job (45 min)

#### File 6: morning_brief_cron.py

**Reference:** `/docs/automation/01-morning-brief-spec.md`

```python
"""
Morning Brief Cron - 8:00 AM WAT daily brief

DOCUMENTATION:
- AUTHORITATIVE: /docs/automation/01-morning-brief-spec.md
- Strategy: /docs/marketing/daily_job_search_strategy.md § Morning Brief System

PURPOSE:
Generate personalized brief at 8:00 AM WAT with:
- New jobs found overnight (Emma scored 8-13)
- Proposals needing follow-up (>24h)
- Jobs won yesterday

DEPLOYMENT:
Cron schedule: 0 8 * * * (8:00 AM WAT)
"""

import asyncio
from datetime import datetime, timedelta

async def generate_morning_brief(user_email: str, falkor_client):
    """
    Generate morning brief for user
    
    Queries:
    1. New jobs scored overnight (created_at > yesterday, score >= 8)
    2. Proposals needing follow-up (submitted_at < 24h ago, no followup_sent)
    3. Jobs won yesterday (state = 'won', created_at = yesterday)
    """
    
    yesterday = (datetime.now() - timedelta(days=1)).isoformat()
    
    # Query 1: New jobs
    new_jobs_query = """
    MATCH (job:U4_Work_Item {work_type: 'job_opportunity'})
          -[:U4_CANDIDATE_FOR]->(agent:U4_Agent {email: $user_email})
    WHERE job.created_at > $yesterday
      AND job.emma_score.total >= 8
    RETURN count(job) as new_jobs_count, 
           collect({title: job.title, score: job.emma_score.total})[0..3] as top_jobs
    """
    
    new_jobs_result = falkor_client.query(
        graph_name="scopelock",
        query=new_jobs_query,
        params={"user_email": user_email, "yesterday": yesterday}
    )
    
    # Query 2: Follow-ups needed (from follow_up_reminder.py)
    # ...
    
    # Query 3: Jobs won
    # ...
    
    # Generate brief text
    brief_text = f"""
<b>Good Morning! ☀️</b>

<b>New Jobs Found:</b> {new_jobs_count} strong matches (8-13 points)

{top_jobs_summary}

<b>Follow-ups Needed:</b> {followups_count} proposals
{followups_summary}

<b>Yesterday's Wins:</b> {wins_count} jobs won 🎉

<i>Ready to review? Open Mission Deck → Jobs</i>
"""
    
    return brief_text

async def send_morning_brief_to_all_users():
    """Cron job entry point"""
    
    # TODO: Get all active users from FalkorDB
    users = ["person1@scopelock.ai"]  # Bigbosexf
    
    for user_email in users:
        brief = await generate_morning_brief(user_email, get_falkor_client())
        
        # Send via Telegram
        # subprocess.run(["node", "/home/mind-protocol/scopelock/tools/telegram-send.cjs", brief])

if __name__ == "__main__":
    asyncio.run(send_morning_brief_to_all_users())
```

---

### Phase 5: Create Database Schema (3 hours)

#### File 7: 001_job_search_graph_schema.md (60 min)

**Reference:** `/scripts/mission-deck/backend/migrations/001_mission_graph_schema.md` (pattern)

**Document these node types:**

```markdown
# Job Search Automation - FalkorDB Graph Schema

## Node Types

### 1. Job Opportunity → U4_Work_Item

work_type: 'job_opportunity'
platform: 'upwork' | 'contra'
emma_score: { total: int, breakdown: {...} }  # Custom field
job_url: string  # Custom field

### 2. Proposal → U4_Work_Item

work_type: 'proposal'
template_used: 'process-skeptical' | 'process-oriented'  # Custom
proposal_text: string  # Custom
portfolio_referenced: array  # Custom

### 3. Review Task → U4_Work_Item

work_type: 'review_task'
(Standard U4_Work_Item fields)

### 4. Submit Task → U4_Work_Item

work_type: 'submit_task'
(Standard U4_Work_Item fields)

### 5. Mission Tasks → U4_Work_Item

work_type: 'spec_task' | 'implementation_task' | 'deployment_task' | 'qa_task' | 'delivery_task'

## Link Types

1. U4_CANDIDATE_FOR (job → agent)
2. U4_ASSIGNED_TO (task → agent)
3. U4_DEPENDS_ON (task → task) - For pipeline dependencies
4. U4_TRIGGERED_BY (task → event) - Audit trail
5. FOLLOWUP_SENT (proposal → event) - Follow-up tracking
```

**Include Cypher query patterns for all API endpoints**

---

#### File 8-10: Seed Data Files (90 min total)

**002_seed_jobs.json** (30 min)
- 5 job opportunities with Emma scores 8-13
- Use pattern from Mission Deck 002_seed_missions.json

**003_seed_proposals.json** (30 min)
- 10 proposals in various states (draft, submitted, viewed, interview, won, lost)
- Link to jobs via properties

**004_seed_tasks.json** (30 min)
- Task pipeline for 1 won job (5 tasks with U4_DEPENDS_ON links)
- spec → implementation → deployment → QA → delivery

---

#### File 11: README.md (30 min)

**Reference:** `/scripts/mission-deck/backend/migrations/README.md`

**Include:**
- Ingestion commands
- Verification queries
- Cypher patterns for ALL API endpoints (from Rafael-2's needs)

---

## Success Checklist

- [ ] All 5 service files implement core logic
- [ ] job_scoring_engine.py returns 0-13 scores per MISSION_SELECTION.md
- [ ] proposal_drafter.py uses proposal_framework.md templates
- [ ] task_pipeline_manager.py creates 5 tasks with U4_DEPENDS_ON links
- [ ] morning_brief_cron.py generates personalized Telegram message
- [ ] Graph schema documented (001_*.md) with all node/link types
- [ ] 3 seed files created (jobs, proposals, tasks) with valid JSON
- [ ] README.md has ingestion commands + Cypher patterns for Rafael-2
- [ ] All services have docstrings linking to documentation
- [ ] All 6 test files created (pytest stubs)
- [ ] Update SYNC.md with "Rafael-3: Services + DB complete, ready for integration"

---

## Handoff to Rafael-2

**When you're done:**

1. Replace Rafael-2's mock_services.py imports with your real services
2. Provide Cypher query patterns for API endpoints

**Example handoff message:**

```markdown
## Rafael-3 → Rafael-2 Handoff

Services + Database complete. Ready for API integration.

**Real Services Available:**
```python
from ..services.job_scoring_engine import JobScoringEngine
from ..services.proposal_drafter import ProposalDrafter
from ..services.task_pipeline_manager import TaskPipelineManager

# Example usage:
scoring_engine = JobScoringEngine(falkor_client)
score = scoring_engine.score_job(job_details)
```

**FalkorDB Seed Data:**
Ingest in this order:
```bash
python3 tools/ingestion/falkordb_ingestor_rest.py 002_seed_jobs.json
python3 tools/ingestion/falkordb_ingestor_rest.py 003_seed_proposals.json
python3 tools/ingestion/falkordb_ingestor_rest.py 004_seed_tasks.json
```

**Cypher Patterns:**
See database/README.md for all query patterns.
```

---

## Questions?

- Check Mission Deck migrations for FalkorDB examples
- Check COMPLETE_TYPE_REFERENCE.md for Mind Protocol types
- Check MISSION_SELECTION.md for scoring logic

**Good luck!** 🚀

**Rafael Silva** — The Guide
2025-11-06
