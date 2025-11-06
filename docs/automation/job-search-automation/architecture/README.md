# Job Search Automation - Architecture Documentation

**Purpose:** Complete architecture for 3-phase job search automation system
**Status:** Architecture complete, ready for implementation
**Implementation Timeline:** 8 weeks (Phase 1: 4 weeks, Phase 2: 8 weeks, Phase 3: 12+ weeks)

---

## Documentation Files

**Read in this order:**

1. **`00_MAPPING.md`** ⭐ START HERE
   - Complete doc-to-script-to-test cross-reference
   - All 27 implementation files with documentation links
   - Essential for understanding system structure

2. **`01_overview.md`**
   - System architecture diagram
   - 3-phase roadmap (Manual → Partial Automation → Full Automation)
   - Key design decisions (why FalkorDB, why Telegram, why Emma's workspace)

3. **`02_component_structure.md`**
   - Frontend component specifications (7 components)
   - Zustand store architecture (3 stores)
   - Data flow examples
   - Complete TypeScript interfaces

4. **`03_api_design.md`** (to be created)
   - Backend API endpoints (6 files)
   - Request/response formats
   - Authorization patterns

5. **`04_database_schema.md`** (to be created)
   - FalkorDB graph schema
   - Mind Protocol type mappings
   - Cypher query patterns

---

## Implementation Structure

```
scripts/job-search-automation/
├── frontend/
│   ├── components/              # 7 React components
│   │   ├── JobSearchLayout.tsx
│   │   ├── JobFeedPanel.tsx
│   │   ├── JobCard.tsx
│   │   ├── ProposalReviewPanel.tsx
│   │   ├── EmmaScore.tsx
│   │   ├── ActionPanel.tsx
│   │   └── MetricsPanel.tsx
│   │
│   └── stores/                  # 3 Zustand stores
│       ├── jobStore.ts
│       ├── proposalStore.ts
│       └── metricsStore.ts
│
├── backend/
│   ├── api/                     # 6 FastAPI endpoints
│   │   ├── jobs.py
│   │   ├── proposals.py
│   │   ├── briefs.py
│   │   ├── tasks.py
│   │   ├── handoffs.py
│   │   └── metrics.py
│   │
│   ├── services/                # 5 backend services
│   │   ├── job_scoring_engine.py
│   │   ├── proposal_drafter.py
│   │   ├── task_pipeline_manager.py
│   │   ├── handoff_brief_generator.py
│   │   └── follow_up_reminder.py
│   │
│   └── cron/                    # 1 cron job
│       └── morning_brief_cron.py
│
└── database/                    # FalkorDB schema + seed data
    ├── 001_job_search_graph_schema.md
    ├── 002_seed_jobs.json
    ├── 003_seed_proposals.json
    ├── 004_seed_tasks.json
    └── README.md
```

---

## Key Features by Phase

### Phase 1: Manual with Templates (Week 1-4)
✅ Job feed viewer (read-only Upwork list)
✅ Emma scoring interface (0-13 points)
✅ Proposal draft review (Emma drafts via chat)
✅ Manual submit (copy to Upwork manually)
✅ leads-tracker.md logging

### Phase 2: Partial Automation (Month 2-3)
✅ Morning Brief (Telegram at 8:00 AM WAT)
✅ Task Pipeline (auto-create tasks when job won)
✅ Handoff Briefs (Telegram notifications)
✅ FalkorDB graph tracking
✅ Emma's workspace in Mission Deck
✅ Contra integration

### Phase 3: Full Automation (Month 4+)
✅ Emma auto-send (80%+ confidence)
✅ RSS alerts (instant job notifications)
✅ Auto follow-ups (24h/48h)
✅ Pipeline visualization

---

## Related Documents

**Strategy:**
- `/docs/marketing/daily_job_search_strategy.md` ⭐⭐ AUTHORITATIVE - Complete strategy
- `/citizens/emma/MISSION_SELECTION.md` ⭐⭐ AUTHORITATIVE - Job selection criteria

**Automation Specs:**
- `/docs/automation/01-morning-brief-spec.md` - Morning brief technical spec
- `/docs/automation/02-task-pipeline-spec.md` - Task pipeline state machine
- `/docs/automation/03-handoff-system-spec.md` - Handoff brief flow

**Mission Deck:**
- `/docs/missions/mission-deck/CITIZEN_WORKSPACES.md` - Emma's workspace interface

---

**Next Steps:**
1. Review 00_MAPPING.md for complete file list
2. Implement Phase 1 MVP (Week 1)
3. Test with real Upwork jobs
4. Build Phase 2 automation (Month 2-3)

**Rafael Silva** — The Guide
2025-11-06
