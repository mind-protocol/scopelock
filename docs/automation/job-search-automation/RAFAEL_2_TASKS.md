# Rafael-2: Backend APIs Tasks

**Your Track:** Backend APIs (6 files)
**Estimated Time:** 6-8 hours
**Work Mode:** Can develop independently with mock services

---

## Your Deliverables

### API Endpoints (6 files)
1. jobs.py ⭐ STUB ALREADY CREATED
2. proposals.py
3. briefs.py
4. tasks.py
5. handoffs.py
6. metrics.py

---

## Step-by-Step Instructions

### Phase 1: Read Documentation (30 min)

**Read in this order:**
1. `/docs/automation/job-search-automation/architecture/00_MAPPING.md` - Your files are listed here
2. `/docs/automation/job-search-automation/architecture/03_api_design.md` - ALL API specs (to be created by you)
3. `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System - Understand scoring
4. `/docs/marketing/proposal_framework.md` - Proposal templates

**Key Concepts:**
- All endpoints use FastAPI with Pydantic models
- Authorization via `get_current_user` dependency
- FalkorDB client via `get_falkor_client` dependency
- Cypher queries for graph database
- Mock services initially (Rafael-3 provides real implementations)

---

### Phase 2: Set Up Directory Structure (5 min)

```bash
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/backend/{api,services,cron,dependencies}
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/tests/backend/api
```

---

### Phase 3: Create Mock Services File (20 min)

**Create:** `/scripts/job-search-automation/backend/mock_services.py`

```python
"""
Mock services for API development
Phase 2: Replace with real services from Rafael-3
"""

from datetime import datetime
from typing import List, Literal

# Mock models (Rafael-1's TypeScript interfaces converted to Python)
class EmmaScoreBreakdown:
    stack_match: int = 3
    budget_fit: int = 2
    clear_scope: int = 2
    client_quality: int = 2
    timeline: int = 1
    ai_fit: int = 1

class EmmaScore:
    total: int = 11
    breakdown: EmmaScoreBreakdown = EmmaScoreBreakdown()
    recommendation: Literal["strong_yes", "maybe", "pass"] = "strong_yes"

class Proposal:
    job_id: str
    template_used: str = "process-skeptical"
    proposal_text: str = "# Evidence Sprint\n\nMock proposal..."
    portfolio_referenced: List[str] = ["la-serenissima", "terminal-velocity"]
    status: str = "draft"
    created_at: str = datetime.now().isoformat()

# Mock service classes
class MockJobScoringEngine:
    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def score_job(self, job_details: dict) -> EmmaScore:
        """Mock Emma's 0-13 scoring"""
        return EmmaScore()

class MockProposalDrafter:
    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def draft_proposal(self, job_id: str) -> Proposal:
        """Mock proposal drafting"""
        proposal = Proposal()
        proposal.job_id = job_id
        return proposal

class MockTaskPipelineManager:
    def __init__(self, falkor_client):
        self.falkor_client = falkor_client

    def create_pipeline(self, job_id: str) -> List[str]:
        """Mock task pipeline creation"""
        return ["task-1", "task-2", "task-3", "task-4", "task-5"]

# ... more mock services
```

---

### Phase 4: Create Dependencies File (15 min)

**Create:** `/scripts/job-search-automation/backend/dependencies.py`

```python
"""
FastAPI dependencies for authentication and database
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

class User:
    """Current authenticated user"""
    def __init__(self, email: str, name: str):
        self.email = email
        self.name = name

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Extract user from JWT token
    
    TODO (Phase 2): Implement real JWT validation
    For now: mock user
    """
    # Mock user for development
    return User(email="person1@scopelock.ai", name="Bigbosexf")

def get_falkor_client():
    """
    FalkorDB client dependency
    
    TODO (Phase 2): Implement real FalkorDB connection
    For now: return mock client
    """
    class MockFalkorClient:
        def query(self, graph_name: str, query: str, params: dict):
            # Mock query results
            return []
    
    return MockFalkorClient()
```

---

### Phase 5: Implement API Files in Order

#### File 1: jobs.py (45 min)

**Reference:** `jobs.py.stub` (ALREADY CREATED)

**Complete the stub:**
1. Add all Pydantic models (ClientInfo, EmmaScoreBreakdown, EmmaScore, Job, etc.)
2. Implement GET /api/jobs/search endpoint
3. Implement POST /api/jobs/score endpoint
4. Use MockJobScoringEngine for scoring
5. Use MockFalkorClient for queries

**Key Implementation:**
```python
from fastapi import APIRouter, Depends, Query
from typing import List, Literal
from pydantic import BaseModel, HttpUrl
from datetime import datetime

from ..dependencies import get_falkor_client, get_current_user
from ..mock_services import MockJobScoringEngine

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# ... Pydantic models here ...

@router.get("/search", response_model=List[Job])
async def search_jobs(
    platform: Literal["upwork", "contra"] = Query(...),
    current_user = Depends(get_current_user),
    falkor_client = Depends(get_falkor_client)
):
    """
    Fetch jobs from Upwork or Contra with Emma's scores
    
    IMPLEMENTS:
    - 03_api_design.md § GET /api/jobs/search
    - daily_job_search_strategy.md § Search Frequency
    
    TODO (Phase 2): Replace mock data with real Upwork RSS/Contra API
    """
    
    # Mock query to FalkorDB
    query = """
    MATCH (job:U4_Work_Item {work_type: 'job_opportunity', platform: $platform})
          -[:U4_CANDIDATE_FOR]->(agent:U4_Agent {email: $user_email})
    WHERE job.status IN ['new', 'scored']
    RETURN job
    ORDER BY job.emma_score.total DESC
    """
    
    result = falkor_client.query(
        graph_name="scopelock",
        query=query,
        params={"platform": platform, "user_email": current_user.email}
    )
    
    # For now: return empty list (will be populated by Rafael-3's seed data)
    jobs = [Job(**record["job"]) for record in result]
    
    return jobs
```

**Test file:** Create `test_jobs_api.py` with pytest tests

---

#### File 2: proposals.py (60 min)

**Reference:** `00_MAPPING.md` § proposals.py

**Endpoints to implement:**
- POST /api/proposals/draft { jobId }
- POST /api/proposals/submit { jobId }
- POST /api/proposals/reject { jobId, reason }
- POST /api/proposals/revise { jobId, feedback }
- GET /api/proposals/list?status={...}

**Key Logic:**

```python
@router.post("/draft", response_model=Proposal)
async def draft_proposal(
    request: DraftProposalRequest,
    current_user = Depends(get_current_user),
    falkor_client = Depends(get_falkor_client)
):
    """
    Draft proposal using Emma's templates
    
    IMPLEMENTS:
    - 03_api_design.md § POST /api/proposals/draft
    - proposal_framework.md § Template Selection
    
    FLOW:
    1. Fetch job details from FalkorDB
    2. Call ProposalDrafter service
    3. Return draft proposal
    """
    
    from ..mock_services import MockProposalDrafter
    
    drafter = MockProposalDrafter(falkor_client)
    proposal = drafter.draft_proposal(request.job_id)
    
    # TODO (Phase 2): Create U4_Work_Item node for proposal draft
    
    return proposal

@router.post("/submit")
async def submit_proposal(
    request: SubmitProposalRequest,
    current_user = Depends(get_current_user),
    falkor_client = Depends(get_falkor_client)
):
    """
    Submit proposal to Upwork/Contra
    
    IMPLEMENTS:
    - 03_api_design.md § POST /api/proposals/submit
    - daily_job_search_strategy.md § Task Pipeline System
    
    FLOW:
    1. Fetch proposal from FalkorDB
    2. Submit to Upwork/Contra API
    3. Update proposal status to 'submitted'
    4. Create follow-up reminder tasks (24h, 48h)
    5. Send Telegram notification
    """
    
    # TODO (Phase 2): Real Upwork/Contra API submission
    # TODO (Phase 3): Telegram notification
    
    return {"success": True, "proposal_id": request.job_id}
```

---

#### File 3: briefs.py (30 min)

**Reference:** `01-morning-brief-spec.md`

**Endpoint:**
- GET /api/briefs/morning?date={YYYY-MM-DD}

**Key Logic:**
```python
@router.get("/morning")
async def get_morning_brief(
    date: str = Query(..., regex=r"^\d{4}-\d{2}-\d{2}$"),
    current_user = Depends(get_current_user),
    falkor_client = Depends(get_falkor_client)
):
    """
    Generate morning brief for specified date
    
    IMPLEMENTS:
    - 01-morning-brief-spec.md § Morning Brief Format
    - daily_job_search_strategy.md § Morning Brief System
    
    QUERIES:
    - New jobs scored overnight
    - Proposals needing follow-up (>24h, no followup_sent)
    - Jobs won yesterday
    """
    
    # Query 1: New jobs
    new_jobs_query = """
    MATCH (job:U4_Work_Item {work_type: 'job_opportunity'})
          -[:U4_CANDIDATE_FOR]->(agent:U4_Agent {email: $user_email})
    WHERE job.created_at > $yesterday
      AND job.emma_score.total >= 8
    RETURN count(job) as new_jobs_count
    """
    
    # Query 2: Follow-ups needed
    # ... (see Mission Deck README for query patterns)
    
    # Generate brief text
    brief = {
        "date": date,
        "summary": f"Good morning! {new_jobs_count} new jobs found...",
        "new_jobs": [],
        "follow_ups": [],
        "wins": []
    }
    
    return brief
```

---

#### File 4: tasks.py (30 min)

**Reference:** `02-task-pipeline-spec.md`

**Endpoints:**
- POST /api/tasks/pipeline { jobId }
- GET /api/tasks/list?assignee={agent_ref}

**Use MockTaskPipelineManager**

---

#### File 5: handoffs.py (20 min)

**Reference:** `03-handoff-system-spec.md`

**Endpoint:**
- POST /api/handoffs/create { taskId, toAgent }

**Generates Telegram notification with action buttons**

---

#### File 6: metrics.py (30 min)

**Reference:** `daily_job_search_strategy.md` § Success Metrics Dashboard

**Endpoint:**
- GET /api/metrics/weekly?start={date}&end={date}

**Returns:**
```python
{
  "proposals_sent": 32,
  "jobs_won": 5,
  "win_rate": 15.6,
  "revenue": 1400,
  "breakdown": {
    "upwork": { "sent": 32, "won": 5, "revenue": 1400 },
    "contra": { "sent": 0, "won": 0, "revenue": 0 }
  }
}
```

---

### Phase 6: Create Main Router (15 min)

**Create:** `/scripts/job-search-automation/backend/api/main.py`

```python
"""
Main FastAPI app for job search automation
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .jobs import router as jobs_router
from .proposals import router as proposals_router
from .briefs import router as briefs_router
from .tasks import router as tasks_router
from .handoffs import router as handoffs_router
from .metrics import router as metrics_router

app = FastAPI(title="Job Search Automation API")

# CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jobs_router)
app.include_router(proposals_router)
app.include_router(briefs_router)
app.include_router(tasks_router)
app.include_router(handoffs_router)
app.include_router(metrics_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

**Test:**
```bash
cd /home/mind-protocol/scopelock/scripts/job-search-automation/backend
uvicorn api.main:app --reload --port 8001
```

---

## Success Checklist

- [ ] All 6 API files created with FastAPI routers
- [ ] All endpoints defined with request/response Pydantic models
- [ ] All endpoints use mock services (documented with TODOs for Phase 2)
- [ ] Authorization pattern implemented (get_current_user dependency)
- [ ] FalkorDB client dependency defined (get_falkor_client)
- [ ] Main FastAPI app created with all routers
- [ ] API runs locally on port 8001
- [ ] All Pydantic models match Rafael-1's TypeScript interfaces
- [ ] All endpoints link to documentation in docstrings
- [ ] All 6 test files created (pytest stubs)
- [ ] Update SYNC.md with "Rafael-2: Backend APIs complete, ready for service integration"

---

## Handoff to Rafael-1 & Rafael-3

**When you're done:**

1. Document your Pydantic models in SYNC.md
2. Rafael-1 can replace mock fetch() with real API calls
3. Rafael-3 implements real services to replace mocks

**Example handoff message:**

```markdown
## Rafael-2 → Rafael-1 Handoff

Backend APIs complete with mock services. Ready for frontend integration.

**API Endpoints Available:**
- GET http://localhost:8001/api/jobs/search?platform=upwork
- POST http://localhost:8001/api/proposals/draft
- POST http://localhost:8001/api/proposals/submit
- GET http://localhost:8001/api/metrics/weekly

**Next:** Rafael-1 replaces mock data with fetch() to these endpoints.

## Rafael-2 → Rafael-3 Handoff

Backend APIs expect these service interfaces:

**JobScoringEngine:**
- `score_job(job_details: dict) -> EmmaScore`

**ProposalDrafter:**
- `draft_proposal(job_id: str) -> Proposal`

**TaskPipelineManager:**
- `create_pipeline(job_id: str) -> List[str]`

**Next:** Rafael-3 implements real services, APIs import them instead of mock_services.
```

---

## Questions?

- Check `00_MAPPING.md` for documentation references
- Check `jobs.py.stub` for example implementation pattern
- Check Mission Deck APIs for Cypher query examples

**Good luck!** 🚀

**Rafael Silva** — The Guide
2025-11-06
