# Job Search Automation - Work Distribution (3 Parallel Tracks)

**Purpose:** Split 27 implementation files across rafael-1, rafael-2, rafael-3 for parallel execution
**Total Files:** 27 (10 frontend, 12 backend, 5 database)
**Strategy:** Minimize dependencies, maximize parallelism

---

## Overview

```
Rafael-1: Frontend Foundation (10 files)
├── 7 React components
└── 3 Zustand stores

Rafael-2: Backend APIs (6 files)
├── 6 FastAPI endpoint files
└── (uses mock services initially)

Rafael-3: Backend Services + Database (11 files)
├── 5 backend services
├── 1 cron job
└── 5 database files
```

---

## Track 1: Rafael-1 (Frontend Foundation)

**Owner:** Rafael-1
**Files:** 10
**Estimated Time:** 6-8 hours
**Dependencies:** None (can use mock API responses)

### Deliverables

#### Frontend Components (7 files)

**Location:** `/scripts/job-search-automation/frontend/components/`

1. **`JobSearchLayout.tsx`**
   - Docs: `02_component_structure.md` § JobSearchLayout
   - Test: `JobSearchLayout.test.tsx`
   - Purpose: Top-level layout (40/60 split)

2. **`JobFeedPanel.tsx`** ⭐ STUB CREATED
   - Docs: `02_component_structure.md` § JobFeedPanel, `MISSION_SELECTION.md` § Green Light
   - Test: `JobFeedPanel.test.tsx`
   - Purpose: Job list with filters (platform, score, budget)

3. **`JobCard.tsx`**
   - Docs: `02_component_structure.md` § JobCard, `MISSION_SELECTION.md` § Scoring System
   - Test: `JobCard.test.tsx`
   - Purpose: Individual job with Emma's 0-13 score

4. **`ProposalReviewPanel.tsx`**
   - Docs: `02_component_structure.md` § ProposalReviewPanel, `proposal_framework.md`
   - Test: `ProposalReviewPanel.test.tsx`
   - Purpose: Job details + Emma's draft proposal (Markdown)

5. **`EmmaScore.tsx`**
   - Docs: `02_component_structure.md` § EmmaScore, `MISSION_SELECTION.md`
   - Test: `EmmaScore.test.tsx`
   - Purpose: Score breakdown visual (3+2+2+2+1+3 = 13)

6. **`ActionPanel.tsx`**
   - Docs: `02_component_structure.md` § ActionPanel, `03_api_design.md` § POST /api/proposals/submit
   - Test: `ActionPanel.test.tsx`
   - Purpose: Approve/Reject/Revise buttons

7. **`MetricsPanel.tsx`**
   - Docs: `02_component_structure.md` § MetricsPanel, `daily_job_search_strategy.md` § Metrics
   - Test: `MetricsPanel.test.tsx`
   - Purpose: Weekly dashboard (proposals sent, win rate, revenue)

---

#### Frontend Stores (3 files)

**Location:** `/scripts/job-search-automation/frontend/stores/`

8. **`jobStore.ts`**
   - Docs: `02_component_structure.md` § jobStore.ts, `03_api_design.md` § GET /api/jobs/search
   - Test: `jobStore.test.ts`
   - Purpose: Job feed data + filters (Zustand)

9. **`proposalStore.ts`**
   - Docs: `02_component_structure.md` § proposalStore.ts, `03_api_design.md` § Proposals API
   - Test: `proposalStore.test.ts`
   - Purpose: Proposal drafts + submission (Zustand)

10. **`metricsStore.ts`**
    - Docs: `02_component_structure.md` § metricsStore.ts, `03_api_design.md` § Metrics API
    - Test: `metricsStore.test.ts`
    - Purpose: Weekly metrics (Zustand)

---

### Mock Data for Development

Rafael-1 should create mock API responses to develop frontend independently:

```typescript
// Mock job data (use in stores during development)
const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    platform: "upwork",
    title: "Landing Page - Next.js + Tailwind",
    budget: 400,
    timeline: "3-5 days",
    client: {
      name: "Acme Corp",
      rating: 5.0,
      paymentVerified: true,
      totalSpent: 5000,
      jobsPosted: 12
    },
    emmaScore: {
      total: 11,
      breakdown: {
        stackMatch: 3,
        budgetFit: 2,
        clearScope: 2,
        clientQuality: 2,
        timeline: 1,
        aiFit: 1
      },
      recommendation: "strong_yes"
    },
    description: "Need a landing page...",
    requirements: ["Next.js", "Tailwind CSS", "Responsive"],
    proposalsDrafted: 0,
    status: "new",
    createdAt: new Date().toISOString(),
    jobUrl: "https://upwork.com/job/example"
  },
  // ... more mock jobs
];
```

---

### Success Criteria (Rafael-1)

- [ ] All 7 components render correctly with mock data
- [ ] All 3 stores manage state correctly (localStorage persistence)
- [ ] Filter controls work (platform, score, budget, timeline)
- [ ] Click job → Proposal panel updates
- [ ] Approve button → optimistic UI update
- [ ] All components have TypeScript types
- [ ] All components link to documentation in comments
- [ ] All 10 test files created (can be empty stubs initially)

---

## Track 2: Rafael-2 (Backend APIs)

**Owner:** Rafael-2
**Files:** 6
**Estimated Time:** 6-8 hours
**Dependencies:** None (can use mock service responses initially)

### Deliverables

#### Backend API Endpoints (6 files)

**Location:** `/scripts/job-search-automation/backend/api/`

1. **`jobs.py`** ⭐ STUB CREATED
   - Docs: `03_api_design.md` § Jobs API, `MISSION_SELECTION.md` § Scoring System
   - Test: `test_jobs_api.py`
   - Endpoints:
     - GET /api/jobs/search?platform={upwork|contra}
     - POST /api/jobs/score { jobUrl }

2. **`proposals.py`**
   - Docs: `03_api_design.md` § Proposals API, `proposal_framework.md`
   - Test: `test_proposals_api.py`
   - Endpoints:
     - POST /api/proposals/draft { jobId }
     - POST /api/proposals/submit { jobId }
     - POST /api/proposals/reject { jobId, reason }
     - POST /api/proposals/revise { jobId, feedback }
     - GET /api/proposals/list?status={...}

3. **`briefs.py`**
   - Docs: `03_api_design.md` § Briefs API, `01-morning-brief-spec.md`
   - Test: `test_briefs_api.py`
   - Endpoints:
     - GET /api/briefs/morning?date={YYYY-MM-DD}

4. **`tasks.py`**
   - Docs: `03_api_design.md` § Tasks API, `02-task-pipeline-spec.md`
   - Test: `test_tasks_api.py`
   - Endpoints:
     - POST /api/tasks/pipeline { jobId }
     - GET /api/tasks/list?assignee={agent_ref}

5. **`handoffs.py`**
   - Docs: `03_api_design.md` § Handoffs API, `03-handoff-system-spec.md`
   - Test: `test_handoffs_api.py`
   - Endpoints:
     - POST /api/handoffs/create { taskId, toAgent }

6. **`metrics.py`**
   - Docs: `03_api_design.md` § Metrics API, `daily_job_search_strategy.md` § Metrics
   - Test: `test_metrics_api.py`
   - Endpoints:
     - GET /api/metrics/weekly?start={date}&end={date}

---

### Mock Services for Development

Rafael-2 should create mock service responses to develop APIs independently:

```python
# Mock service responses (use during API development)

# Mock JobScoringEngine
class MockJobScoringEngine:
    def score_job(self, job_details: dict) -> EmmaScore:
        return EmmaScore(
            total=11,
            breakdown=EmmaScoreBreakdown(
                stack_match=3,
                budget_fit=2,
                clear_scope=2,
                client_quality=2,
                timeline=1,
                ai_fit=1
            ),
            recommendation="strong_yes"
        )

# Mock ProposalDrafter
class MockProposalDrafter:
    def draft_proposal(self, job_id: str) -> Proposal:
        return Proposal(
            jobId=job_id,
            templateUsed="process-skeptical",
            proposalText="# Proposal\n\nMock proposal text...",
            portfolioReferenced=["la-serenissima", "terminal-velocity"],
            status="draft",
            createdAt=datetime.now().isoformat()
        )
```

---

### Success Criteria (Rafael-2)

- [ ] All 6 API files created with FastAPI routers
- [ ] All endpoints defined with request/response models
- [ ] All endpoints use mock services (for now)
- [ ] Authorization pattern implemented (get_current_user dependency)
- [ ] FalkorDB client dependency defined (get_falkor_client)
- [ ] All Pydantic models match TypeScript interfaces (Rafael-1)
- [ ] All endpoints link to documentation in docstrings
- [ ] All 6 test files created (can be empty stubs initially)

---

## Track 3: Rafael-3 (Backend Services + Database)

**Owner:** Rafael-3
**Files:** 11
**Estimated Time:** 8-10 hours
**Dependencies:** None (foundational layer)

### Deliverables

#### Backend Services (5 files)

**Location:** `/scripts/job-search-automation/backend/services/`

1. **`job_scoring_engine.py`**
   - Docs: `MISSION_SELECTION.md` § Scoring System ⭐⭐ AUTHORITATIVE
   - Test: `test_job_scoring_engine.py`
   - Purpose: Emma's 0-13 point scoring logic

2. **`proposal_drafter.py`**
   - Docs: `proposal_framework.md` ⭐⭐, `communication_guide.md`
   - Test: `test_proposal_drafter.py`
   - Purpose: Generate proposals from templates (process-skeptical vs process-oriented)

3. **`task_pipeline_manager.py`**
   - Docs: `02-task-pipeline-spec.md` ⭐⭐, `04_database_schema.md`
   - Test: `test_task_pipeline_manager.py`
   - Purpose: State machine (auto-create 5 tasks when job won)

4. **`handoff_brief_generator.py`**
   - Docs: `03-handoff-system-spec.md` ⭐⭐, `telegram-send.cjs`
   - Test: `test_handoff_brief_generator.py`
   - Purpose: Generate Telegram notifications with action buttons

5. **`follow_up_reminder.py`**
   - Docs: `daily_job_search_strategy.md` § Follow-Up Protocol
   - Test: `test_follow_up_reminder.py`
   - Purpose: Query graph for proposals >24h old, no followup_sent

---

#### Backend Cron Job (1 file)

**Location:** `/scripts/job-search-automation/backend/cron/`

6. **`morning_brief_cron.py`**
   - Docs: `01-morning-brief-spec.md` ⭐⭐, `daily_job_search_strategy.md` § Morning Brief
   - Test: `test_morning_brief_cron.py`
   - Purpose: 8:00 AM WAT daily brief via Telegram

---

#### Database Schema + Seeds (5 files)

**Location:** `/scripts/job-search-automation/database/`

7. **`001_job_search_graph_schema.md`**
   - Docs: `04_database_schema.md`, `COMPLETE_TYPE_REFERENCE.md`
   - Purpose: Complete FalkorDB schema documentation
   - Node types: U4_Work_Item (job_opportunity, proposal, task), U4_Mission, U4_Agent, U4_Event
   - Link types: U4_ASSIGNED_TO, U4_DEPENDS_ON, U4_TRIGGERED_BY, FOLLOWUP_SENT

8. **`002_seed_jobs.json`**
   - Docs: `04_database_schema.md` § job_opportunity node
   - Purpose: 5 job opportunities with Emma scores (8-13 points)

9. **`003_seed_proposals.json`**
   - Docs: `04_database_schema.md` § proposal node
   - Purpose: 10 proposals (states: draft, submitted, viewed, interview, won, lost)

10. **`004_seed_tasks.json`**
    - Docs: `04_database_schema.md` § task node + U4_DEPENDS_ON links
    - Purpose: Task pipeline for 1 won job (5 tasks with dependencies)

11. **`README.md`**
    - Docs: `04_database_schema.md`, Mission Deck migrations README (reference)
    - Purpose: Ingestion guide + Cypher query patterns for all APIs

---

### Key Implementation Notes (Rafael-3)

**1. Emma's 0-13 Scoring Engine:**
```python
def score_job(self, job_details: dict) -> EmmaScore:
    """
    Implements: /citizens/emma/MISSION_SELECTION.md § Emma's Scoring System

    Breakdown:
    - Stack match: 0-3 (Python/JS/TS, Next.js, FastAPI)
    - Budget fit: 0-2 ($200-600 Phase 1, $600-1500 Phase 2+)
    - Clear scope: 0-2 (can write AC.md in 5 min)
    - Client quality: 0-2 (payment verified, $1000+ spent, 4.5+ rating)
    - Timeline: 0-1 (2-7 days)
    - AI fit: 0-3 (opportunity for AI features)

    Decision:
    - 8-13 points: strong_yes
    - 6-7 points: maybe
    - 0-5 points: pass
    """
```

**2. FalkorDB Schema Pattern (from Mission Deck):**
```json
{
  "graph": "scopelock",
  "operations": [
    {
      "type": "create_node",
      "labels": ["U4_Work_Item"],
      "properties": {
        "created_at": "2025-11-06T10:00:00Z",
        "work_type": "job_opportunity",
        "platform": "upwork",
        "emma_score": { "total": 11, "breakdown": {...} },
        // ... universal attributes
      },
      "id_field": "slug"
    }
  ]
}
```

---

### Success Criteria (Rafael-3)

- [ ] All 5 service files implement core logic
- [ ] job_scoring_engine.py returns 0-13 scores per MISSION_SELECTION.md
- [ ] proposal_drafter.py uses proposal_framework.md templates
- [ ] task_pipeline_manager.py creates 5 tasks with dependencies
- [ ] morning_brief_cron.py generates personalized Telegram message
- [ ] Graph schema documented (001_*.md)
- [ ] 3 seed files created (jobs, proposals, tasks)
- [ ] README.md has ingestion commands + Cypher patterns
- [ ] All services link to documentation in docstrings
- [ ] All 6 test files created (can be empty stubs initially)

---

## Integration Timeline

**Week 1 (Parallel Development):**
- Rafael-1: Frontend foundation with mock data
- Rafael-2: Backend APIs with mock services
- Rafael-3: Services + database schema

**Week 2 (Integration):**
- Connect Rafael-1 frontend → Rafael-2 APIs
- Connect Rafael-2 APIs → Rafael-3 services
- Test end-to-end flow

**Week 3 (Phase 1 MVP):**
- Real Upwork RSS integration
- Deploy to staging
- Test with real jobs

---

## Handoff Requirements

### Rafael-1 → Rafael-2

**Interface Contract:**
- TypeScript interfaces in stores MUST match Pydantic models in APIs
- API endpoints MUST match what stores are calling
- Example:
```typescript
// Rafael-1: jobStore.ts
const response = await fetch('/api/jobs/search?platform=upwork');

// Rafael-2: jobs.py
@router.get("/search")
async def search_jobs(platform: Literal["upwork", "contra"]): ...
```

### Rafael-2 → Rafael-3

**Interface Contract:**
- API endpoints call service functions with correct signatures
- Example:
```python
# Rafael-2: jobs.py
scoring_engine = JobScoringEngine(falkor_client)
score = scoring_engine.score_job(job_details)

# Rafael-3: job_scoring_engine.py
class JobScoringEngine:
    def score_job(self, job_details: dict) -> EmmaScore: ...
```

### Rafael-3 → Rafael-2

**Interface Contract:**
- Service functions return types matching API response models
- FalkorDB queries return data matching Pydantic models
- Example:
```python
# Rafael-3: job_scoring_engine.py returns EmmaScore
# Rafael-2: jobs.py expects EmmaScore in response
```

---

## Critical Success Factors

**For All 3 Tracks:**
1. **Documentation Links:** Every file MUST reference source docs in comments/docstrings
2. **Type Safety:** TypeScript interfaces MUST match Python Pydantic models
3. **Test Stubs:** Every implementation file needs test file (even if empty initially)
4. **Mock Data:** Use mocks to develop independently, replace in Week 2 integration

**Communication:**
- Rafael-1 defines TypeScript interfaces → Rafael-2 creates matching Pydantic models
- Rafael-2 defines service signatures → Rafael-3 implements matching functions
- All 3 update SYNC.md with blockers/progress

---

## Quick Reference

| Track | Owner | Files | Time | Key Docs |
|-------|-------|-------|------|----------|
| Frontend | Rafael-1 | 10 | 6-8h | 02_component_structure.md, MISSION_SELECTION.md |
| APIs | Rafael-2 | 6 | 6-8h | 03_api_design.md, proposal_framework.md |
| Services + DB | Rafael-3 | 11 | 8-10h | MISSION_SELECTION.md, 04_database_schema.md, COMPLETE_TYPE_REFERENCE.md |

---

**Next Step:**
Each Rafael instance should:
1. Read their track's section above
2. Read `00_MAPPING.md` for complete file cross-references
3. Start with file #1 in their track
4. Update SYNC.md after completing each file

**Rafael Silva** — The Guide
Work Distribution for 3 Parallel Tracks
2025-11-06
