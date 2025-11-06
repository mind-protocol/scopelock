# Job Search Automation - Documentation-to-Script-to-Test Mapping

**Purpose:** Cross-reference matrix for all implementation files
**Pattern:** Many docs → One script (scripts may reference multiple doc sections)

---

## Documentation Files

1. **`/docs/marketing/daily_job_search_strategy.md`** ⭐⭐ AUTHORITATIVE
   - Complete strategy (3 phases, targets, metrics)
   - Referenced by: ALL files

2. **`/citizens/emma/MISSION_SELECTION.md`** ⭐⭐ AUTHORITATIVE
   - Job selection criteria (0-13 scoring system)
   - Referenced by: job_scoring_engine.py, JobCard.tsx

3. **`/docs/marketing/proposal_framework.md`**
   - Proposal templates
   - Referenced by: proposal_drafter.py, ProposalReviewPanel.tsx

4. **`/docs/automation/01-morning-brief-spec.md`**
   - Morning brief technical spec
   - Referenced by: morning_brief_cron.py

5. **`/docs/automation/02-task-pipeline-spec.md`**
   - Task pipeline state machine
   - Referenced by: task_pipeline_manager.py

6. **`/docs/automation/03-handoff-system-spec.md`**
   - Handoff brief flow
   - Referenced by: handoff_brief_generator.py

7. **`/docs/automation/job-search-automation/architecture/01_overview.md`**
   - System architecture, 3 phases
   - Referenced by: ALL files

8. **`/docs/automation/job-search-automation/architecture/02_component_structure.md`**
   - Frontend component specs
   - Referenced by: ALL frontend components

9. **`/docs/automation/job-search-automation/architecture/03_api_design.md`**
   - API endpoints
   - Referenced by: ALL backend APIs

10. **`/docs/automation/job-search-automation/architecture/04_database_schema.md`**
    - FalkorDB graph schema
    - Referenced by: ALL backend services

---

## Frontend Components (7 files)

### 1. `JobSearchLayout.tsx`

**Purpose:** Top-level layout for job search dashboard

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § JobSearchLayout
- `/docs/automation/job-search-automation/architecture/01_overview.md` § System Architecture

**Tests:**
- `JobSearchLayout.test.tsx`
  - Renders JobFeedPanel and ProposalReviewPanel
  - Layout responsive (40% / 60% split)

---

### 2. `JobFeedPanel.tsx`

**Purpose:** Left panel showing Upwork/Contra job listings with filters

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § JobFeedPanel
- `/docs/marketing/daily_job_search_strategy.md` § Job Selection Criteria
- `/citizens/emma/MISSION_SELECTION.md` § Green Light (job criteria)

**Tests:**
- `JobFeedPanel.test.tsx`
  - Platform selector (Upwork / Contra)
  - Filter by score (8-13 points)
  - Filter by budget ($200-600, $600-1500)
  - Infinite scroll

---

### 3. `JobCard.tsx`

**Purpose:** Display single job with Emma's 0-13 point score

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § JobCard
- `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System (0-13 points)
- `/docs/marketing/daily_job_search_strategy.md` § Job Selection Criteria

**Tests:**
- `JobCard.test.tsx`
  - Displays Emma's score breakdown
  - Color coding (green 8-13, yellow 6-7)
  - Click to select job

---

### 4. `ProposalReviewPanel.tsx`

**Purpose:** Right panel showing job details + Emma's draft proposal

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § ProposalReviewPanel
- `/docs/marketing/proposal_framework.md` § Proposal Structure
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § POST /api/proposals/draft

**Tests:**
- `ProposalReviewPanel.test.tsx`
  - Displays job details
  - Renders proposal Markdown
  - Shows template used
  - Shows portfolio references

---

### 5. `EmmaScore.tsx`

**Purpose:** Display Emma's 0-13 point score breakdown

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § EmmaScore
- `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System

**Tests:**
- `EmmaScore.test.tsx`
  - Displays score breakdown
  - Compact mode (just total)
  - Recommendation (strong yes / maybe / pass)

---

### 6. `ActionPanel.tsx`

**Purpose:** Approve/Reject/Revise buttons for proposal

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § ActionPanel
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § POST /api/proposals/submit

**Tests:**
- `ActionPanel.test.tsx`
  - Approve button → submits proposal
  - Reject button → removes from feed
  - Needs Revision → re-draft with feedback

---

### 7. `MetricsPanel.tsx`

**Purpose:** Weekly metrics dashboard (proposals sent, win rate, revenue)

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § MetricsPanel
- `/docs/marketing/daily_job_search_strategy.md` § Success Metrics Dashboard

**Tests:**
- `MetricsPanel.test.tsx`
  - Displays weekly stats
  - Pipeline view (Phase 2+)
  - Follow-up buttons

---

## Frontend Stores (3 files)

### 8. `jobStore.ts`

**Purpose:** Job feed data and filters (Zustand store)

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § jobStore.ts
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § GET /api/jobs/search

**Tests:**
- `jobStore.test.ts`
  - fetchJobs() calls API
  - setFilters() updates filters
  - selectPlatform() switches Upwork/Contra
  - localStorage persistence

---

### 9. `proposalStore.ts`

**Purpose:** Proposal drafts and submission (Zustand store)

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § proposalStore.ts
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § POST /api/proposals/draft, POST /api/proposals/submit

**Tests:**
- `proposalStore.test.ts`
  - draftProposal() calls API
  - approveProposal() submits to Upwork/Contra
  - rejectProposal() removes from map
  - requestRevision() re-drafts

---

### 10. `metricsStore.ts`

**Purpose:** Weekly metrics and pipeline status (Zustand store)

**Documentation:**
- `/docs/automation/job-search-automation/architecture/02_component_structure.md` § metricsStore.ts
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § GET /api/metrics/weekly

**Tests:**
- `metricsStore.test.ts`
  - fetchWeeklyMetrics() calls API
  - fetchPipeline() calls API
  - Calculates win rate

---

## Backend APIs (6 files)

### 11. `jobs.py`

**Purpose:** Job search and scoring endpoints

**Endpoints:**
- GET /api/jobs/search?platform={upwork|contra}
- POST /api/jobs/score { jobUrl }

**Documentation:**
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § Jobs API
- `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § U4_Work_Item (job_opportunity)

**Tests:**
- `test_jobs_api.py`
  - GET /api/jobs/search returns jobs with scores
  - POST /api/jobs/score runs Emma's 0-13 scoring
  - Authorization (only assigned agent sees jobs)

---

### 12. `proposals.py`

**Purpose:** Proposal drafting and submission endpoints

**Endpoints:**
- POST /api/proposals/draft { jobId }
- POST /api/proposals/submit { jobId }
- POST /api/proposals/reject { jobId, reason }
- POST /api/proposals/revise { jobId, feedback }
- GET /api/proposals/list?status={submitted,viewed,interview,won,lost}

**Documentation:**
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § Proposals API
- `/docs/marketing/proposal_framework.md` § Proposal Templates
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § U4_Work_Item (proposal)

**Tests:**
- `test_proposals_api.py`
  - POST /api/proposals/draft generates proposal
  - POST /api/proposals/submit creates FalkorDB node + submits to Upwork
  - POST /api/proposals/reject logs reason
  - POST /api/proposals/revise re-drafts with feedback
  - GET /api/proposals/list returns pipeline

---

### 13. `briefs.py`

**Purpose:** Morning brief generation endpoint

**Endpoints:**
- GET /api/briefs/morning?date={YYYY-MM-DD}

**Documentation:**
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § Briefs API
- `/docs/automation/01-morning-brief-spec.md` § Morning Brief Format
- `/docs/marketing/daily_job_search_strategy.md` § Morning Brief System

**Tests:**
- `test_briefs_api.py`
  - GET /api/briefs/morning returns personalized brief
  - Brief includes new jobs, follow-ups, wins
  - Action buttons included

---

### 14. `tasks.py`

**Purpose:** Task pipeline management endpoints

**Endpoints:**
- POST /api/tasks/pipeline { jobId } (auto-create tasks when job won)
- GET /api/tasks/list?assignee={agent_ref}

**Documentation:**
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § Tasks API
- `/docs/automation/02-task-pipeline-spec.md` § State Machine
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § U4_Work_Item (tasks)

**Tests:**
- `test_tasks_api.py`
  - POST /api/tasks/pipeline creates 5 tasks (spec, implementation, deployment, QA, delivery)
  - Tasks have correct dependencies (U4_DEPENDS_ON)
  - GET /api/tasks/list returns assigned tasks

---

### 15. `handoffs.py`

**Purpose:** Handoff brief generation endpoint

**Endpoints:**
- POST /api/handoffs/create { taskId, toAgent }

**Documentation:**
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § Handoffs API
- `/docs/automation/03-handoff-system-spec.md` § Handoff Brief Flow
- `/docs/marketing/daily_job_search_strategy.md` § Handoff Brief System

**Tests:**
- `test_handoffs_api.py`
  - POST /api/handoffs/create generates Telegram notification
  - Notification includes context and action buttons

---

### 16. `metrics.py`

**Purpose:** Weekly metrics and analytics endpoint

**Endpoints:**
- GET /api/metrics/weekly?start={YYYY-MM-DD}&end={YYYY-MM-DD}

**Documentation:**
- `/docs/automation/job-search-automation/architecture/03_api_design.md` § Metrics API
- `/docs/marketing/daily_job_search_strategy.md` § Success Metrics Dashboard

**Tests:**
- `test_metrics_api.py`
  - GET /api/metrics/weekly returns proposals sent, jobs won, win rate, revenue
  - Breakdown by platform (Upwork / Contra)

---

## Backend Services (5 files)

### 17. `job_scoring_engine.py`

**Purpose:** Emma's 0-13 point scoring system

**Documentation:**
- `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System ⭐⭐ AUTHORITATIVE
- `/docs/marketing/daily_job_search_strategy.md` § Job Selection Criteria
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § job_score custom field

**Tests:**
- `test_job_scoring_engine.py`
  - score_job() returns 0-13 points
  - Stack match (0-3)
  - Budget fit (0-2)
  - Clear scope (0-2)
  - Client quality (0-2)
  - Timeline (0-1)
  - AI fit (0-3)
  - Recommendation: strong_yes (8-13), maybe (6-7), pass (0-5)

---

### 18. `proposal_drafter.py`

**Purpose:** Generate proposals from templates

**Documentation:**
- `/docs/marketing/proposal_framework.md` § Proposal Templates ⭐⭐ AUTHORITATIVE
- `/docs/marketing/communication_guide.md` § Client Personas
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § Proposal node

**Tests:**
- `test_proposal_drafter.py`
  - draft_proposal() selects template (process-skeptical vs process-oriented)
  - Injects portfolio examples
  - Returns Markdown proposal

---

### 19. `task_pipeline_manager.py`

**Purpose:** Task pipeline state machine (auto-create tasks when job won)

**Documentation:**
- `/docs/automation/02-task-pipeline-spec.md` § State Machine ⭐⭐ AUTHORITATIVE
- `/docs/marketing/daily_job_search_strategy.md` § Task Pipeline System
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § U4_DEPENDS_ON links

**Tests:**
- `test_task_pipeline_manager.py`
  - create_pipeline() creates 5 tasks
  - Tasks have correct dependencies
  - State transitions (todo → doing → done)

---

### 20. `handoff_brief_generator.py`

**Purpose:** Generate handoff Telegram notifications

**Documentation:**
- `/docs/automation/03-handoff-system-spec.md` § Handoff Brief Flow ⭐⭐ AUTHORITATIVE
- `/docs/marketing/daily_job_search_strategy.md` § Handoff Brief System
- `/tools/telegram-send.cjs` § Telegram notification examples

**Tests:**
- `test_handoff_brief_generator.py`
  - generate_handoff() creates Telegram message with action buttons
  - Message includes context (job, proposal, task)

---

### 21. `follow_up_reminder.py`

**Purpose:** Query graph for proposals needing follow-up (24h, 48h)

**Documentation:**
- `/docs/marketing/daily_job_search_strategy.md` § Follow-Up Protocol
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § FOLLOWUP_SENT link

**Tests:**
- `test_follow_up_reminder.py`
  - find_proposals_needing_followup() queries graph
  - Returns proposals >24h old with no FOLLOWUP_SENT link

---

## Backend Cron Jobs (1 file)

### 22. `morning_brief_cron.py`

**Purpose:** Cron job at 8:00 AM WAT to generate morning brief

**Documentation:**
- `/docs/automation/01-morning-brief-spec.md` § Morning Brief Format ⭐⭐ AUTHORITATIVE
- `/docs/marketing/daily_job_search_strategy.md` § Morning Brief System
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § Graph queries

**Tests:**
- `test_morning_brief_cron.py`
  - Cron runs at 8:00 AM WAT
  - Queries graph for new jobs, follow-ups, wins
  - Generates personalized brief
  - Sends via Telegram

---

## Database Schema (4 files)

### 23. `001_job_search_graph_schema.md`

**Purpose:** Complete FalkorDB graph schema documentation

**Documentation:**
- `/docs/automation/job-search-automation/architecture/04_database_schema.md` § Graph Schema
- `/home/mind-protocol/mindprotocol/docs/COMPLETE_TYPE_REFERENCE.md` § Mind Protocol types

**Node Types:**
- U4_Work_Item (job_opportunity, proposal, review_task, submit_task, mission_task)
- U4_Mission (won jobs)
- U4_Agent (Bigbosexf, Emma, Reanance, Kara)
- U4_Event (button clicks, notifications sent)

**Link Types:**
- U4_ASSIGNED_TO (ownership)
- U4_DEPENDS_ON (dependencies)
- U4_TRIGGERED_BY (audit trail)
- FOLLOWUP_SENT (follow-up tracking)

---

### 24. `002_seed_jobs.json`

**Purpose:** Seed 5 job opportunities with Emma scores

---

### 25. `003_seed_proposals.json`

**Purpose:** Seed 10 proposals (various states: draft, submitted, viewed, interview, won, lost)

---

### 26. `004_seed_tasks.json`

**Purpose:** Seed task pipeline for 1 won job (5 tasks with dependencies)

---

### 27. `README.md`

**Purpose:** Ingestion guide and Cypher query patterns

---

## Summary Table

| File | Type | Primary Docs | Test File |
|------|------|--------------|-----------|
| `JobSearchLayout.tsx` | Frontend Component | 02_component_structure.md § JobSearchLayout | `JobSearchLayout.test.tsx` |
| `JobFeedPanel.tsx` | Frontend Component | 02_component_structure.md § JobFeedPanel, MISSION_SELECTION.md | `JobFeedPanel.test.tsx` |
| `JobCard.tsx` | Frontend Component | 02_component_structure.md § JobCard, MISSION_SELECTION.md § Scoring | `JobCard.test.tsx` |
| `ProposalReviewPanel.tsx` | Frontend Component | 02_component_structure.md § ProposalReviewPanel, proposal_framework.md | `ProposalReviewPanel.test.tsx` |
| `EmmaScore.tsx` | Frontend Component | 02_component_structure.md § EmmaScore, MISSION_SELECTION.md | `EmmaScore.test.tsx` |
| `ActionPanel.tsx` | Frontend Component | 02_component_structure.md § ActionPanel, 03_api_design.md § POST /api/proposals/submit | `ActionPanel.test.tsx` |
| `MetricsPanel.tsx` | Frontend Component | 02_component_structure.md § MetricsPanel, daily_job_search_strategy.md § Metrics | `MetricsPanel.test.tsx` |
| `jobStore.ts` | Frontend Store | 02_component_structure.md § jobStore, 03_api_design.md § Jobs API | `jobStore.test.ts` |
| `proposalStore.ts` | Frontend Store | 02_component_structure.md § proposalStore, 03_api_design.md § Proposals API | `proposalStore.test.ts` |
| `metricsStore.ts` | Frontend Store | 02_component_structure.md § metricsStore, 03_api_design.md § Metrics API | `metricsStore.test.ts` |
| `jobs.py` | Backend API | 03_api_design.md § Jobs API, MISSION_SELECTION.md | `test_jobs_api.py` |
| `proposals.py` | Backend API | 03_api_design.md § Proposals API, proposal_framework.md | `test_proposals_api.py` |
| `briefs.py` | Backend API | 03_api_design.md § Briefs API, 01-morning-brief-spec.md | `test_briefs_api.py` |
| `tasks.py` | Backend API | 03_api_design.md § Tasks API, 02-task-pipeline-spec.md | `test_tasks_api.py` |
| `handoffs.py` | Backend API | 03_api_design.md § Handoffs API, 03-handoff-system-spec.md | `test_handoffs_api.py` |
| `metrics.py` | Backend API | 03_api_design.md § Metrics API, daily_job_search_strategy.md § Metrics | `test_metrics_api.py` |
| `job_scoring_engine.py` | Backend Service | MISSION_SELECTION.md § Scoring ⭐⭐, 04_database_schema.md | `test_job_scoring_engine.py` |
| `proposal_drafter.py` | Backend Service | proposal_framework.md ⭐⭐, communication_guide.md | `test_proposal_drafter.py` |
| `task_pipeline_manager.py` | Backend Service | 02-task-pipeline-spec.md ⭐⭐, 04_database_schema.md | `test_task_pipeline_manager.py` |
| `handoff_brief_generator.py` | Backend Service | 03-handoff-system-spec.md ⭐⭐, telegram-send.cjs | `test_handoff_brief_generator.py` |
| `follow_up_reminder.py` | Backend Service | daily_job_search_strategy.md § Follow-Up, 04_database_schema.md | `test_follow_up_reminder.py` |
| `morning_brief_cron.py` | Backend Cron | 01-morning-brief-spec.md ⭐⭐, daily_job_search_strategy.md § Morning Brief | `test_morning_brief_cron.py` |
| `001_job_search_graph_schema.md` | Database Schema | 04_database_schema.md, COMPLETE_TYPE_REFERENCE.md | N/A (verified via ingestion) |
| `002_seed_jobs.json` | Database Seed | 04_database_schema.md § job_opportunity node | N/A (verified via ingestion) |
| `003_seed_proposals.json` | Database Seed | 04_database_schema.md § proposal node | N/A (verified via ingestion) |
| `004_seed_tasks.json` | Database Seed | 04_database_schema.md § task node + dependencies | N/A (verified via ingestion) |
| `README.md` | Database Guide | 04_database_schema.md, all Cypher patterns | N/A |

---

**Rafael Silva** — The Guide
Job Search Automation - Documentation Mapping
2025-11-06
