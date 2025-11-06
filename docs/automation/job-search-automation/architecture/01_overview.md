# Job Search Automation - Architecture Overview

**Purpose:** Systematic job search and proposal system with 3 phases of automation
**Owner:** Alexis (Strategy) + Emma (Execution) + Bigbosexf (Hunter)
**Tech Stack:** Next.js 14 (frontend), FastAPI (backend), FalkorDB graph (data), Telegram (notifications)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    JOB SEARCH DASHBOARD                          │
│                  (scopelock.mindprotocol.ai/jobs)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Job Feed Panel  │  │   Proposal       │  │   Weekly     │  │
│  │  (Upwork/Contra) │  │   Draft Review   │  │   Metrics    │  │
│  │                  │  │                  │  │              │  │
│  │  • Emma scores   │  │  • Approve       │  │  • Win rate  │  │
│  │  • Filter 8-13   │  │  • Reject        │  │  • Revenue   │  │
│  │  • Click to view │  │  • Revise        │  │  • Pipeline  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ▲  │
                              │  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Job Search       Proposal         Task Pipeline                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐              │
│  │  Scraper │───▶│  Scorer  │───▶│  Manager     │              │
│  │  (RSS)   │    │  (0-13)  │    │  (State      │              │
│  └──────────┘    └──────────┘    │   Machine)   │              │
│                          │        └──────────────┘              │
│                          ▼                │                       │
│                  ┌──────────────┐         ▼                       │
│                  │   Proposal   │    ┌──────────────┐            │
│                  │   Drafter    │    │   Handoff    │            │
│                  │   (Templates)│    │   Generator  │            │
│                  └──────────────┘    └──────────────┘            │
│                          │                    │                   │
└──────────────────────────┼────────────────────┼──────────────────┘
                           │                    │
                           ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FALKORDB GRAPH DATABASE                         │
│                   (scopelock - Level 2 org)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Nodes:                         Links:                            │
│  • U4_Work_Item (proposals)    • U4_ASSIGNED_TO (ownership)     │
│  • U4_Mission (won jobs)       • U4_DEPENDS_ON (dependencies)   │
│  • U4_Agent (team members)     • U4_TRIGGERED_BY (audit trail)  │
│  • U4_Event (notifications)    • FOLLOWUP_SENT (tracking)       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NOTIFICATION SYSTEM                             │
│                      (Telegram)                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  • Morning Brief (8:00 AM WAT)                                   │
│  • Proposal ready for review                                     │
│  • Job won → Mission pipeline created                            │
│  • Follow-up reminders (24h, 48h)                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Three-Phase Roadmap

### Phase 1: Manual with Templates (Week 1-4)

**Goal:** Build consistent pipeline through systematic manual process

**Features:**
- Manual Upwork sweeps (3-4 times/day)
- Emma drafts proposals via chat
- Manual submission to Upwork
- leads-tracker.md for tracking
- Weekly metrics manually calculated

**Targets:**
- 5-8 proposals/day
- 10-15% win rate
- $800-1,800/week revenue
- 2-3 jobs won/week

**Time Investment:** 4-5h/day (Bigbosexf)

---

### Phase 2: Partial Automation (Month 2-3)

**Goal:** Reduce human time via automation, add Contra platform

**New Features:**
- **Morning Brief System:** Telegram notification at 8:00 AM WAT with daily summary
- **Task Pipeline System:** Auto-create tasks when jobs are won (spec → implementation → QA → delivery)
- **Handoff Brief System:** Telegram notifications for proposal approvals and handoffs
- **FalkorDB Tracking:** All proposals/tasks tracked in graph database
- **Emma's Workspace:** Mission Deck integration for job review
- **Contra Integration:** Add second platform (3-5 proposals/day)

**Targets:**
- 10-15 proposals/day (Upwork + Contra)
- 15-20% win rate (Upwork), 10-15% (Contra)
- $1,500-3,000/week revenue
- 3-5 jobs won/week

**Time Investment:** 4-5.5h/day (automation reduces Bigbosexf's load)

**Key Automation:**
- Morning brief auto-generated from graph
- Proposals auto-logged when approved
- Tasks auto-created when jobs won
- Follow-up reminders auto-calculated

---

### Phase 3: Full Automation (Month 4+)

**Goal:** Minimal human intervention (2h/day), Emma handles 80%+ of workflow

**New Features:**
- **Emma Auto-Send:** Proposals with 80%+ confidence auto-submit (no human review)
- **RSS Alerts:** Instant notifications for new jobs matching criteria
- **Auto Follow-ups:** Emma sends follow-up messages at 24h/48h without human approval
- **Pipeline Visualization:** Mission Deck shows full proposal → delivery pipeline

**Targets:**
- 10-15 proposals/day (mostly automated)
- 20-25% win rate
- $3,000-6,000/week revenue
- 5-10 jobs won/week

**Time Investment:** 1.5-2h/day (Bigbosexf reviews edge cases only)

**Automation Coverage:**
- Emma scores jobs automatically (from RSS feed)
- Emma drafts proposals automatically (using proven templates)
- Emma auto-submits if confidence >80%
- Emma sends follow-ups at 24h/48h
- Morning brief includes AI-generated recommendations

---

## Key Design Decisions

### 1. Why Start Manual (Phase 1)?

**Rationale:**
- Learn job selection criteria empirically (which missions we actually win)
- Refine proposal templates through A/B testing
- Build testimonials and JSS before scaling volume
- Understand client psychology before automating

**Risk mitigation:** Don't automate a broken process

---

### 2. Why Add Contra in Phase 2 (Not Phase 1)?

**Rationale:**
- Master one platform (Upwork) before spreading effort
- Concentrated reputation building (testimonials compound faster)
- Emma's MISSION_SELECTION.md is Upwork-optimized
- Contra requires different client communication style

**When to add Contra:**
- After 4 weeks of Upwork (proven templates)
- After 8-12 jobs won (portfolio evidence)
- After JSS >85% (proven track record)

---

### 3. Why FalkorDB Graph (Not SQL)?

**Rationale:**
- Rich relationship tracking (proposal → interview → job → tasks → delivery)
- Mind Protocol type system integration (U4_Work_Item, U4_Mission, U4_Agent)
- Complex queries: "Find proposals >24h old with no follow-up sent"
- Audit trail via links (U4_TRIGGERED_BY captures every button click)
- Enables future analytics: "Which job types have highest win rate?"

**Example query value:**
```cypher
// Find proposals needing follow-up
MATCH (you:U4_Agent {telegram_id: '@Bigbosefx2'})
      -[:U4_ASSIGNED_TO]-(proposal:U4_Work_Item)
WHERE proposal.work_type = 'proposal'
  AND proposal.state = 'submitted'
  AND proposal.submitted_at < datetime() - duration({hours: 24})
  AND NOT exists((proposal)-[:FOLLOWUP_SENT]->())
RETURN proposal
```

---

### 4. Why Telegram for Notifications (Not Email)?

**Rationale:**
- Real-time (email delays are minutes, Telegram is instant)
- Action buttons (approve proposal with one tap)
- Mobile-first (Bigbosexf can approve proposals from phone)
- Group chat integration (team sees same notifications)

**Use cases:**
- Morning brief (8:00 AM WAT)
- Proposal ready for review (Emma finished draft)
- Job won (mission pipeline auto-created)
- Follow-up reminder (24h/48h flags)

---

### 5. Why Emma's Workspace in Mission Deck?

**Rationale:**
- Unified interface (don't switch between Upwork + chat + tracker)
- Context-aware chat (Emma knows which job you're discussing)
- One-click actions (score job, draft proposal, approve, submit)
- Persistent memory (Emma remembers previous conversations about similar jobs)

**User flow:**
1. Open Mission Deck → Select "Emma" workspace
2. Browse Upwork jobs in left panel (Emma pre-scored 8-13 points)
3. Click job → Chat with Emma about it
4. Click [Draft Proposal] → Emma writes it in chat
5. Review → Click [Approve] → Auto-submits to Upwork
6. Logged in FalkorDB + leads-tracker.md

---

## Implementation Scope

### Week 1 MVP (Phase 1 Foundation)

**Must Have:**
- Job feed viewer (read-only Upwork job list)
- Emma scoring interface (manual: user pastes job, Emma scores 0-13)
- Proposal draft review (Emma drafts via chat, user reviews)
- Manual submit (user copies proposal to Upwork manually)
- leads-tracker.md logging (manual entry)

**Nice to Have:**
- None (keep it simple, prove the workflow)

**Success Criteria:**
- 5-8 proposals submitted in first week
- Win rate tracked (manual calculation)
- Emma's scoring calibrated (learn from wins/losses)

---

### Week 2-4 (Phase 1 Refinement)

**Add:**
- Weekly metrics dashboard (proposals sent, win rate, revenue)
- Proposal template A/B testing (track which templates win most)
- Job type win rate analysis (landing pages vs APIs vs AI integration)

---

### Month 2-3 (Phase 2 Automation)

**Add:**
- Morning Brief cron job (8:00 AM WAT)
- Task Pipeline state machine (auto-create tasks when job won)
- Handoff Brief system (Telegram notifications)
- FalkorDB graph schema (migrate from leads-tracker.md)
- Emma's workspace in Mission Deck (unified interface)
- Contra integration (2nd platform)

---

### Month 4+ (Phase 3 Full Automation)

**Add:**
- Emma auto-send (80%+ confidence proposals)
- RSS alerts (instant job notifications)
- Auto follow-ups (24h/48h without human approval)
- Pipeline visualization (proposal → delivery flow in Mission Deck)

---

## Related Documents

**Strategy:**
- `/docs/marketing/daily_job_search_strategy.md` ⭐⭐ AUTHORITATIVE - This architecture implements this strategy
- `/citizens/emma/MISSION_SELECTION.md` ⭐⭐ AUTHORITATIVE - Job selection criteria (Emma's scoring system)
- `/docs/marketing/proposal_framework.md` - Proposal templates
- `/docs/marketing/contra_tactical_guide.md` - Contra platform specifics

**Automation Specs:**
- `/docs/automation/01-morning-brief-spec.md` - Morning brief technical spec
- `/docs/automation/02-task-pipeline-spec.md` - Task pipeline state machine
- `/docs/automation/03-handoff-system-spec.md` - Handoff brief flow

**Mission Deck:**
- `/docs/missions/mission-deck/CITIZEN_WORKSPACES.md` - Emma's workspace interface
- `/docs/missions/mission-deck/architecture/` - Mission Deck architecture

**Tracking:**
- `/citizens/emma/leads-tracker.md` - Phase 1 manual tracking
- FalkorDB graph - Phase 2+ automatic tracking

---

**Rafael Silva** — The Guide
Job Search Automation
2025-11-06
