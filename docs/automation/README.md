# ScopeLock Automation Specifications

**Version:** 1.0
**Date:** 2025-11-02
**Purpose:** Technical specifications for all approved automation features

---

## Overview

This directory contains detailed technical specifications for automation features that reduce manual work and coordination overhead.

**📊 Track Progress:** See **[PROGRESS.md](PROGRESS.md)** for TODO vs DONE status, test results, and implementation checklist.

**🔄 Real-Time Updates:** Use **`/citizens/SYNC.md`** for work-in-progress status and blockers. See **[SYNC_vs_PROGRESS.md](SYNC_vs_PROGRESS.md)** to understand the difference.

**🌟 NEW: Automatic Task System:** See **[00-automatic-task-system-vision.md](00-automatic-task-system-vision.md)** for strategic vision of automatic task management with morning briefs, button-driven workflows, and AI-written handoffs.

Each specification follows the consciousness design pattern:

```
PATTERN (consciousness design principle)
  → BEHAVIOR_SPEC (what should happen, events, contracts)
    → VALIDATION (how we verify it works)
      → MECHANISM (implementation approach, architecture)
        → ALGORITHM (detailed steps, formulas, NO pseudocode)
          → GUIDE (implementation with code, function names, pseudocode)
```

---

## Strategic Initiatives

### Automatic Task System (NEW - Phase 2)

**[Strategic Vision](00-automatic-task-system-vision.md)** - Comprehensive task automation system

**What:** Morning briefs, button-driven workflows, automatic task creation, AI-written handoffs

**Components:**
- Morning brief system (8:00 AM WAT cron → AI citizen writes personalized brief → Telegram)
- Mission pipeline state machine (automatic task creation when job won)
- Button interface (one-tap task actions in Telegram)
- Handoff brief system (task completion triggers AI-written brief for next person)
- Revision loop handling (proposal revisions, bug fixes, spec clarifications)

**Time Saved:**
- Zero coordination overhead (no Slack messages for handoffs)
- <2 min to task clarity (morning brief tells you exactly what to do)
- <15 min handoff latency (completion → next person notified)

**Status:** Strategic vision complete, ready for Emma (specification) → Inna (documentation) → Rafael (implementation)

**Next Steps:**
1. Emma creates specifications (morning brief spec, task pipeline spec, handoff system spec)
2. Inna creates 6-level documentation (PATTERN → GUIDE)
3. Rafael implements based on Inna's complete docs

---

## Features by Priority

### P0: Quick Wins (2-4h each, immediate ROI)

**1. [Auto-Regenerate Proof Pages](01_proof_regeneration.md)**
- **What:** Proofgen runs automatically on git tag push
- **Time Saved:** 1.7h/year (prevent forgetting to regenerate)
- **Cost:** $0
- **Status:** Approved (deployment script integration)

**2. [Response Monitoring & Auto-Reply](02_response_monitoring.md)**
- **What:** Gmail → Wake Rafael → Auto-draft → Telegram approval
- **Time Saved:** 10h/week (no inbox checking)
- **Cost:** $15/mo (Zapier + hosting)
- **Status:** Approved (email integration + Rafael citizen wake)

**3. [Lead Tracker Auto-Update](03_lead_tracker.md)**
- **What:** Emma output → JSON log → Markdown regeneration
- **Time Saved:** 3.3h/month (no manual logging)
- **Cost:** $0
- **Status:** Approved (Python script)

---

### P1: Medium Complexity (8-20h each, strong ROI)

**4. [Emma RSS Scraper + Auto-Send](04_emma_rss_auto_send.md)**
- **What:** RSS feed → Emma evaluates → Confidence >80% auto-send
- **Time Saved:** 10h/week (50+ leads/day automated)
- **Cost:** $0 (Puppeteer for Upwork submission)
- **Status:** Approved (Emma generates AND sends proposals)

**5. [AC.md Drafting Assistant](05_ac_drafting.md)**
- **What:** Wake Rafael citizen to draft AC.md from templates
- **Time Saved:** 1h per milestone (10h/month)
- **Cost:** $0
- **Status:** Approved (wake citizen, not direct API)

**6. [Test Generation from AC.md](06_test_generation.md)**
- **What:** Wake Daniel → Parse AC.md → Generate Playwright tests
- **Time Saved:** 3h per milestone (30h/month)
- **Cost:** $0
- **Status:** Approved

**7. [DEMO/DELTA Auto-Generation](07_demo_delta_generation.md)**
- **What:** Wake Maya → Capture screenshots → Measure metrics → Generate markdown
- **Time Saved:** 55min per milestone (9h/month)
- **Cost:** $0
- **Status:** Approved

---

### P2: Advanced (6-16h each, scales with usage)

**8. [Emma Autonomous Mode](08_emma_autonomous.md)**
- **What:** Confidence-based routing (≥80% auto-send, <80% approval)
- **Time Saved:** 7.9h/week (80% of proposals auto-sent)
- **Cost:** $0 (logic layer on Feature 4)
- **Status:** Approved (confidence score formula)

**9. [Sofia Auto-Review](09_sofia_auto_review.md)**
- **What:** GitHub webhook → Sofia checks policies → Block/allow merge
- **Time Saved:** 8.3h/month (no manual boilerplate review)
- **Cost:** $0
- **Status:** Approved

**10. [Priya Dashboard](10_priya_dashboard.md)**
- **What:** Event log → Real-time metrics dashboard
- **Time Saved:** 4h/month (no manual metric collection)
- **Cost:** $0 (static HTML)
- **Status:** Approved

---

### P3: Deferred (Phase 2)

**11. [Client Portal](11_client_portal.md)**
- **What:** Self-service AC status tracking for clients
- **Time Saved:** 9.7h/month (when implemented)
- **Cost:** $20/mo
- **Status:** DEFERRED (not needed until 5+ concurrent clients)

---

## Automation Priority Matrix

| Task | Current Effort | Automation Complexity | ROI | Priority |
|------|---------------|----------------------|-----|----------|
| **Lead parsing** | 5min/post × 20 = 100min/day | Medium | High | 🔥 P0 |
| **Response monitoring** | Check every 2h = 40min/day | Low | High | 🔥 P0 |
| **Proof regeneration** | 5min/milestone | Low | Medium | 🔥 P0 |
| **AC.md drafting** | 30min/milestone | Medium | High | P1 |
| **Test generation** | 60min/milestone | Medium | High | P1 |
| **DEMO/DELTA creation** | 20min/milestone | Low | Medium | P1 |
| **Proposal submission** | 3min/proposal × 10 = 30min/day | High (ToS) | Medium | P2 |
| **Git tagging** | 2min/milestone | Low | Low | P2 |
| **Metrics tracking** | 15min/week | Low | Low | P3 |

**Priority Legend:**
- 🔥 **P0:** Automate first (high ROI, low complexity)
- **P1:** Automate second (high ROI, medium complexity)
- **P2:** Automate later (medium ROI or high complexity)
- **P3:** Keep manual (low ROI)

---

## Implementation Order

**Week 1-2 (P0 Quick Wins):**
1. Proof regeneration (2h)
2. Lead tracker (3h)
3. Response monitoring IFTTT (4h for phase 1)

**Week 3-4 (P1 Core Automation):**
4. Emma RSS scraper (20h)
5. AC drafting (8h)

**Week 5-6 (P1 Continued):**
6. Test generation (12h)
7. DEMO/DELTA generation (10h)

**Week 7-8 (P2 Advanced):**
8. Emma autonomous mode (6h - builds on Feature 4)
9. Sofia auto-review (10h)
10. Priya dashboard (16h)

**Phase 2 (Deferred):**
11. Client portal (24h - when scaling to 5+ clients)

---

## Total Investment vs. ROI

**Phase 1 Investment (Features 1-10):**
- Development time: 91h × $100/h = $9,100
- Ongoing cost: $15/mo (Zapier)

**Time Saved:**
- Week 1: 10h/week (Emma RSS + Response monitoring)
- Month 1: +20h/month (AC drafting, test gen, DEMO/DELTA)
- Month 2: +12h/month (Sofia, Priya, Emma autonomous)

**Total monthly savings after full implementation:**
- 75h/month = $7,500/month value

**Payback Period:**
- $9,100 investment / $7,500 monthly savings = 1.2 months

---

## Feature Dependencies

```
Feature 4 (Emma RSS)
  └─ Feature 8 (Emma Autonomous) ← Uses confidence calculator from Feature 4

Feature 5 (AC Drafting)
  └─ Feature 6 (Test Generation) ← Needs AC.md to generate tests

Feature 6 (Test Generation)
  └─ Feature 7 (DEMO/DELTA) ← Uses test results for metrics

All Features
  └─ Feature 10 (Priya Dashboard) ← Aggregates events from all citizens
```

**Implementation Strategy:**
- Features 1-3 can run in parallel (no dependencies)
- Feature 8 requires Feature 4 to be completed first
- Features 5-7 form a pipeline (AC → Tests → Demo/Delta)
- Feature 10 can start early, will show more data as other features go live

---

## Success Metrics

**Target State (After Full Implementation):**

| Citizen | Manual Work (Before) | Automated Work (After) | Time Saved |
|---------|---------------------|------------------------|------------|
| Emma | 7h/week | 1h/week (review only) | 6h/week |
| Rafael | 4h/week | 30min/week | 3.5h/week |
| Daniel | 4h/week | 1h/week | 3h/week |
| Sofia | 3h/week | 30min/week | 2.5h/week |
| Maya | 2h/week | 15min/week | 1.75h/week |
| **Total** | **20h/week** | **3.75h/week** | **16.25h/week** |

**Value Created:**
- 16.25h/week × $100/h = $1,625/week = $7,000/month
- Equivalent to hiring 0.4 FTE developer without headcount
- Frees Nicolas for high-value tasks (client calls, architecture, pricing)

---

## Files in This Directory

**Strategic Initiatives:**
- `00-automatic-task-system-vision.md` ⭐ NEW - Strategic vision for automatic task management

**Feature Specifications:**
- `README.md` (this file) - Index and overview
- `01_proof_regeneration.md` - Auto-regenerate proof pages on git tag
- `02_response_monitoring.md` - Wake Rafael on client responses
- `03_lead_tracker.md` - Auto-update leads tracker from Emma output
- `04_emma_rss_auto_send.md` - RSS scraping + auto-send proposals
- `05_ac_drafting.md` - Wake Rafael to draft AC.md from templates
- `06_test_generation.md` - Generate Playwright tests from AC.md
- `07_demo_delta_generation.md` - Capture demos + calculate deltas
- `08_emma_autonomous.md` - Confidence-based auto-send routing
- `09_sofia_auto_review.md` - GitHub webhook policy enforcement
- `10_priya_dashboard.md` - Real-time metrics dashboard
- `11_client_portal.md` - Client self-service (DEFERRED)

---

## Next Steps

**Immediate (This Week):**
1. Implement Features 1-3 (P0 quick wins) - 9h total
2. Test in production with real Upwork leads
3. Track time saved and calculate actual ROI

**Week 2:**
1. Start Feature 4 (Emma RSS) - highest impact
2. Set up RSS feed monitoring infrastructure
3. Test with dry-run mode (don't actually send proposals yet)

**Week 3-4:**
1. Go live with Emma RSS auto-send
2. Implement Features 5-7 (AC → Tests → Demo/Delta pipeline)
3. Monitor confidence scores, tune thresholds

**Week 5-8:**
1. Implement Features 8-10 (advanced automation)
2. Measure actual time savings vs. projections
3. Adjust roadmap based on learnings

---

## Questions or Issues?

- Check individual feature spec for detailed implementation
- See **[PROGRESS.md](PROGRESS.md)** for TODO vs DONE tracking
- Update `/citizens/SYNC.md` with automation progress and blockers
