# ScopeLock Automation Roadmap

**Version:** 1.0
**Date:** 2025-11-02
**Purpose:** Path from manual workflows to full automation

---

## Current State: What's Manual (2025-11-02)

### 🔴 Fully Manual (Requires Human Every Time)

**Lead Processing (Emma):**
- ❌ Finding Upwork posts (manual browse)
- ❌ Copy/paste job post text to Emma session
- ❌ Copy/paste Emma's proposal back to Upwork
- ❌ Submitting proposal (click Upwork UI)
- ❌ Monitoring responses (check Upwork inbox)
- ❌ Tracking in leads-tracker.md (manual updates)

**Client Communication (Rafael):**
- ❌ Reading client messages (Upwork, email, Cal.com)
- ❌ Drafting responses
- ❌ Co-editing AC.md (back-and-forth in Google Docs or markdown)
- ❌ Tagging baseline (manual git commands)

**Delivery (Daniel):**
- ❌ Reading AC.md and understanding requirements
- ❌ Writing code
- ❌ Running tests locally
- ❌ Creating DEMO.md and DELTA.md
- ❌ Tagging milestones (manual git commands)
- ❌ Pushing tags

**Proof Publishing (Maya):**
- ⚠️ **Semi-automated:** Tag triggers proofgen, but:
  - ❌ Must run `npm run build:local` manually
  - ❌ Must commit generated proof HTML
  - ❌ Must push to trigger deploy

**Quality Gates (Sofia):**
- ❌ Reading diffs/PRs
- ❌ Issuing verdicts (pass/soft/hard)
- ❌ Tracking override requests

**Orchestration (Priya):**
- ❌ Checking SYNC.md
- ❌ Routing work between citizens
- ❌ Tracking budgets/timelines
- ❌ Updating metrics

### 🟡 Partially Automated

**Build & Deploy:**
- ✅ CI runs tests on push (automated)
- ✅ Vercel deploys on merge (automated)
- ❌ Tag creation still manual

**Proof Generation:**
- ✅ Proofgen reads tags and generates HTML (automated)
- ❌ Running proofgen requires manual command
- ❌ Committing generated files still manual

**Testing:**
- ✅ Playwright tests run in CI (automated)
- ❌ Writing new tests still manual
- ❌ Updating tests when AC changes still manual

---

## Automation Priority Matrix

| Task | Current Effort | Automation Complexity | ROI | Priority |
|------|---------------|----------------------|-----|----------|
| **Lead parsing** | 5min/post × 20 = 100min/day | Medium | High | 🔥 P0 |
| **Proposal submission** | 3min/proposal × 10 = 30min/day | High (ToS) | Medium | P2 |
| **Response monitoring** | Check every 2h = 40min/day | Low | High | 🔥 P0 |
| **Proof regeneration** | 5min/milestone | Low | Medium | 🔥 P0 |
| **AC.md drafting** | 30min/milestone | Medium | High | P1 |
| **Test generation** | 60min/milestone | Medium | High | P1 |
| **DEMO/DELTA creation** | 20min/milestone | Low | Medium | P1 |
| **Git tagging** | 2min/milestone | Low | Low | P2 |
| **Metrics tracking** | 15min/week | Low | Low | P3 |

**Priority Legend:**
- 🔥 **P0:** Automate first (high ROI, low complexity)
- **P1:** Automate second (high ROI, medium complexity)
- **P2:** Automate later (medium ROI or high complexity)
- **P3:** Keep manual (low ROI)

---

## Phase 1: Quick Wins (Weeks 1-4)

**Goal:** Automate highest-ROI, lowest-complexity tasks

### 1.1 Auto-Regenerate Proof Pages

**Current:** Manual `npm run build:local` → commit → push

**Automated:**
```yaml
# .github/workflows/proofgen.yml
name: Regenerate Proof Pages
on:
  push:
    tags:
      - 'evidence-sprint_*'
      - 'ac-green_*'
      - 'change-*'

jobs:
  proofgen:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Fetch all tags
      - run: npm install
      - run: npm run proofgen
      - run: |
          git config user.name "ScopeLock Bot"
          git config user.email "bot@scopelock.mindprotocol.ai"
          git add public/proof/
          git commit -m "chore: auto-regenerate proof pages [skip ci]" || exit 0
          git push
```

**Benefit:** Eliminates 5min manual work per milestone, prevents forgetting to regenerate

**Effort:** 1 hour (create workflow file, test)

**Owner:** Daniel

---

### 1.2 Upwork Response Monitoring

**Current:** Check Upwork inbox every 2 hours manually

**Automated:**
```bash
# scripts/monitor-upwork-responses.sh
# Runs every 15 minutes via cron

# Check Upwork RSS feed for new messages
curl -s "https://www.upwork.com/api/messages/rss" | \
  grep "<item>" | \
  while read message; do
    # Extract client name, first line
    # Send Slack/Discord notification
    # Log to citizens/emma/responses.log
  done
```

**Alternative:** IFTTT/Zapier integration (Upwork → Slack notification)

**Benefit:** Instant response awareness, <2h SLA guaranteed

**Effort:** 2 hours (script + cron setup OR Zapier flow)

**Owner:** Priya (ops) or Daniel (script)

---

### 1.3 Emma Lead Tracker Auto-Update

**Current:** Manually update `citizens/emma/leads-tracker.md` after each post

**Automated:**
```python
# scripts/track-lead.py
import json
from datetime import datetime

def track_lead(platform, title, budget, decision, reason, sent=False, link=""):
    log = {
        "date": datetime.now().isoformat(),
        "platform": platform,
        "title": title,
        "budget": budget,
        "decision": decision,
        "reason": reason,
        "sent": sent,
        "link": link
    }

    # Append to citizens/emma/leads.json
    with open("citizens/emma/leads.json", "a") as f:
        f.write(json.dumps(log) + "\n")

    # Regenerate leads-tracker.md from JSON
    generate_tracker_markdown()

# Usage in Emma workflow:
# After Emma evaluates: track_lead("Upwork", "Build AI chat", "$8K", "GO", "AI + clear budget", sent=True)
```

**Benefit:** No manual tracker updates, automatic stats (GO rate, sent count)

**Effort:** 3 hours (script + Emma integration)

**Owner:** Daniel

---

## Phase 2: Medium Complexity (Weeks 5-12)

**Goal:** Automate proposal generation and AC drafting

### 2.1 Upwork Lead Scraper (ToS-Compliant)

**Current:** Manually browse Upwork and copy/paste

**Automated (Option A: RSS Feed):**
```python
# scripts/fetch-upwork-leads.py
import feedparser

# Upwork has RSS feeds for saved searches
feed_url = "https://www.upwork.com/ab/feed/jobs/rss?q=web+app&sort=recency"

feed = feedparser.parse(feed_url)
for entry in feed.entries:
    title = entry.title
    description = entry.description
    link = entry.link
    budget = extract_budget(description)  # Parse from description

    # Save to citizens/emma/queue.json
    queue_for_emma(title, description, budget, link)
```

**Automated (Option B: Browser Extension):**
- Chrome extension that adds "Send to Emma" button on Upwork posts
- Extracts post content, sends to local Emma API
- Emma evaluates, returns GO/NO-GO + proposal
- User clicks "Submit" (still manual submission, but faster)

**Benefit:** Emma can process 50+ leads/day instead of 20

**Effort:**
- RSS: 4 hours (script + parsing logic)
- Extension: 12 hours (Chrome extension + local API)

**Owner:** Daniel

**Note:** Automated *submission* is ToS violation. We fetch but submit manually.

---

### 2.2 AC.md Drafting Assistant

**Current:** Rafael co-edits AC.md with client manually

**Automated:**
```markdown
# AC.md Template Generator

Input: Client requirements (from kickoff call notes or job post)
Output: Pre-filled AC.md with:
- Functional requirements (extracted from notes)
- Non-functional requirements (performance estimates based on similar projects)
- Verification section (test command templates)

Process:
1. Parse kickoff notes or job post
2. Match to similar past projects (portfolio/)
3. Generate AC.md template with sections pre-filled
4. Rafael reviews + edits with client (still collaborative)
```

**Implementation:**
```python
# scripts/generate-ac-draft.py
def generate_ac_draft(requirements: str, tech_stack: list) -> str:
    # Use Claude API to generate AC.md from requirements
    prompt = f"""
    Generate AC.md for:
    Requirements: {requirements}
    Tech: {tech_stack}

    Include:
    - Functional criteria (what it does)
    - Non-functional (p95 <300ms, etc.)
    - Verification (playwright test commands)
    """

    ac_md = call_claude_api(prompt)
    return ac_md
```

**Benefit:** Reduces AC drafting from 30min to 10min (Rafael just reviews)

**Effort:** 6 hours (template system + Claude API integration)

**Owner:** Aïcha (schemas) + Daniel (implementation)

---

### 2.3 Acceptance Test Generation

**Current:** Daniel writes Playwright tests manually

**Automated:**
```python
# scripts/generate-tests-from-ac.py

def generate_tests(ac_md_path: str) -> list[str]:
    """
    Parse AC.md, generate Playwright test skeletons.

    Example:
    AC.md says: "F1: All pages return 200"
    Generates: test('all pages return 200', async ({ page }) => { ... })
    """

    ac = parse_ac_md(ac_md_path)
    tests = []

    for criterion in ac.functional:
        test_code = generate_test_for_criterion(criterion)
        tests.append(test_code)

    # Write to tests/acceptance/generated.spec.ts
    write_tests(tests)
```

**Benefit:** Test scaffolding in 5min instead of 60min (Daniel fills in details)

**Effort:** 8 hours (AC parser + test generator)

**Owner:** Daniel

---

### 2.4 DEMO.md + DELTA.md Auto-Generation

**Current:** Daniel writes manually after building

**Automated:**
```python
# scripts/generate-demo-delta.py

def generate_demo_delta(milestone: str, before_metrics: dict, after_metrics: dict, demo_url: str):
    """
    Auto-generate DEMO.md and DELTA.md from:
    - Demo URL (from milestone tag or env var)
    - Before/after metrics (from performance logs or manual input)
    """

    demo_md = f"""
# Demo — {milestone}

**View live:** {demo_url}
**Duration:** ≤90 seconds

## Demo Walkthrough
[Auto-generated from milestone description]
    """

    delta_md = f"""
# Delta — {milestone}

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Build time | {before_metrics['build_time']} | {after_metrics['build_time']} | {calculate_delta(...)} |
| Test coverage | {before_metrics['tests']} | {after_metrics['tests']} | +{...} |
    """

    write_file("proof/DEMO.md", demo_md)
    write_file("proof/DELTA.md", delta_md)
```

**Benefit:** DEMO/DELTA generation in 5min instead of 20min

**Effort:** 4 hours (template + metric extraction)

**Owner:** Daniel

---

## Phase 3: Advanced Automation (Weeks 13-24)

**Goal:** End-to-end workflows with minimal human intervention

### 3.1 Emma Autonomous Mode

**Current:** Human pastes job posts to Emma, Emma responds

**Automated:**
```
Upwork RSS → Scraper → Queue (citizens/emma/queue.json)
  ↓
Emma (autonomous cron job every 15min):
  - Reads queue
  - Evaluates each post (GO/NO-GO)
  - Generates proposals
  - Saves to citizens/emma/proposals/
  - Logs to citizens/emma/leads.json
  ↓
Human review (daily digest):
  - Reviews GO proposals
  - Approves/rejects (1-click)
  - Submits to Upwork
```

**Implementation:**
```bash
# cron: */15 * * * * /home/mind-protocol/scopelock/scripts/emma-autonomous.sh

# emma-autonomous.sh
cd /home/mind-protocol/scopelock
node scripts/emma-evaluate-queue.js  # Reads queue, calls Emma API
python scripts/generate-daily-digest.py  # Emails Nicolas with GO proposals
```

**Benefit:** Emma processes 100+ leads/day, Nicolas reviews 20min/day

**Effort:** 16 hours (Emma API, autonomous loop, digest generator)

**Owner:** Daniel + Emma

---

### 3.2 Sofia Autonomous Review

**Current:** Sofia manually reviews diffs/PRs

**Automated:**
```
GitHub PR opened
  ↓
Webhook → Sofia API:
  - Fetch diff
  - Run linter + tests
  - Check R-400/R-401 compliance
  - Issue verdict (pass/soft/hard)
  ↓
Auto-comment on PR:
  - ✅ PASS: "All checks green, merge approved"
  - ⚠️ SOFT: "Minor issues, fix before merge: [list]"
  - ❌ HARD: "Blocking issues: [list]"
  ↓
If PASS: Auto-merge (optional)
```

**Benefit:** Sofia reviews in <1min instead of manual check

**Effort:** 12 hours (GitHub webhook, Sofia API, auto-comment)

**Owner:** Daniel + Sofia

---

### 3.3 Priya Dashboard

**Current:** Priya manually checks SYNC.md, tracks metrics

**Automated:**
```
Real-time dashboard showing:
- Lead pipeline (evaluated, GO, sent, responses)
- Delivery status (AC.md → Evidence Sprint → AC green)
- Citizen workload (who's blocked, who's idle)
- Metrics (proposals/week, revenue/month, test coverage)
- Alerts (CI red, client response SLA missed, budget exceeded)
```

**Tech Stack:**
- Next.js dashboard (`/admin` route)
- PostgreSQL or SQLite for metrics
- Cron jobs update metrics every 15min
- Real-time via WebSocket (optional)

**Benefit:** Priya has full visibility without manual SYNC checks

**Effort:** 24 hours (dashboard UI, metrics DB, cron jobs)

**Owner:** Maya (UI) + Daniel (backend) + Priya (specs)

---

### 3.4 Client Self-Service Portal

**Current:** Clients ask Rafael "is it done yet?"

**Automated:**
```
Client portal at scopelock.mindprotocol.ai/client/[project-id]

Shows:
- AC.md (frozen baseline)
- Test status (X/Y passing, progress bar)
- Demo link (if Evidence Sprint tagged)
- DELTA metrics (before/after)
- Change Requests (if any, with status)
- Invoice status (pending AC green)
```

**Benefit:** Clients self-serve status, Rafael handles exceptions only

**Effort:** 20 hours (Next.js portal, auth, DB)

**Owner:** Maya (UI) + Rafael (client UX) + Daniel (backend)

---

## Phase 4: Full Autonomy (Weeks 25-52)

**Goal:** Minimal human intervention, AI citizens handle 80%+ of work

### 4.1 Autonomous Delivery Pipeline

**End-to-End Automation:**
```
1. Emma finds lead (RSS scraper, 24/7)
2. Emma evaluates GO/NO-GO (autonomous)
3. Emma generates proposal (autonomous)
4. Human approves proposal (1-click, takes 5min/day)
5. Human submits to Upwork (still manual, ToS)
6. Client responds
7. Rafael drafts AC.md (auto-generated template, Rafael reviews)
8. Client approves AC.md
9. Baseline tag auto-created (git tag via webhook)
10. Daniel implements (human-in-loop for code)
11. Tests auto-generated from AC.md (Daniel fills in logic)
12. CI runs tests (automated)
13. Sofia reviews PR (autonomous verdict)
14. Merge to main (auto if PASS)
15. DEMO/DELTA auto-generated (from metrics)
16. Tag auto-created (evidence-sprint_* or ac-green_*)
17. Proof pages auto-regenerated (GitHub Actions)
18. Client notified (email with demo link)
19. Invoice auto-generated (when AC green tag pushed)
20. Priya tracks metrics (dashboard auto-updates)
```

**Human Touch Points (Only 5):**
1. Approve Emma's GO proposals (5min/day)
2. Submit proposals to Upwork (15min/day)
3. Co-edit AC.md with client (30min/milestone)
4. Write code (Daniel, still human)
5. Handle client questions (Rafael, exceptions only)

**Benefit:** 80% automation, Nicolas time <10h/week, revenue/hour 5x

---

## Automation Metrics

### Success Criteria (Per Phase)

**Phase 1 (Weeks 1-4):**
- [ ] Proof regeneration: 100% automated
- [ ] Response monitoring: <15min lag
- [ ] Lead tracking: 0 manual updates

**Phase 2 (Weeks 5-12):**
- [ ] Lead scraping: 50+ leads/day (up from 20)
- [ ] AC drafting: 10min (down from 30min)
- [ ] Test generation: 5min (down from 60min)

**Phase 3 (Weeks 13-24):**
- [ ] Emma autonomous: 100+ leads/day evaluated
- [ ] Sofia autonomous: <1min verdict (down from manual)
- [ ] Priya dashboard: Real-time metrics

**Phase 4 (Weeks 25-52):**
- [ ] Nicolas time: <10h/week (down from 40h)
- [ ] Revenue/hour: 5x (due to automation efficiency)
- [ ] Client satisfaction: Maintained or improved (self-service)

---

## Cost-Benefit Analysis

### Manual Baseline (Week 1)

| Task | Time | Frequency | Weekly Cost |
|------|------|-----------|-------------|
| Lead processing | 100min/day | 5 days | 500min (8.3h) |
| Proposal submission | 30min/day | 5 days | 150min (2.5h) |
| Response monitoring | 40min/day | 7 days | 280min (4.7h) |
| AC drafting | 30min | 2x/week | 60min (1h) |
| Test writing | 60min | 2x/week | 120min (2h) |
| DEMO/DELTA | 20min | 2x/week | 40min (0.7h) |
| Proof regeneration | 5min | 2x/week | 10min (0.2h) |
| Metrics tracking | 15min | 1x/week | 15min (0.25h) |
| **Total** | | | **1,175min (19.6h/week)** |

### Automated (Phase 3)

| Task | Time | Frequency | Weekly Cost |
|------|------|-----------|-------------|
| Approve Emma proposals | 5min/day | 5 days | 25min (0.4h) |
| Submit proposals | 15min/day | 5 days | 75min (1.25h) |
| Response monitoring | 0 (auto-alert) | - | 0h |
| AC review (generated) | 10min | 2x/week | 20min (0.3h) |
| Test logic (generated skeleton) | 15min | 2x/week | 30min (0.5h) |
| DEMO/DELTA review | 0 (auto-generated) | - | 0h |
| Proof regeneration | 0 (GitHub Actions) | - | 0h |
| Metrics tracking | 0 (dashboard) | - | 0h |
| **Total** | | | **150min (2.5h/week)** |

**Time Savings:** 19.6h → 2.5h = **17.1 hours saved per week**

**Efficiency Gain:** 87% reduction in manual work

**ROI:** If Nicolas bills $150/h, that's $2,565/week saved → $10,260/month

**Investment:** ~80 hours of engineering (Phases 1-3) = $12K one-time cost
**Payback:** 5 weeks

---

## Technology Stack (Automation Tools)

### Phase 1-2 (Quick Wins)
- **GitHub Actions** — Proof regeneration, CI/CD
- **Bash/Python scripts** — RSS scraping, lead tracking
- **Cron jobs** — Response monitoring, Emma queue processing
- **Zapier/IFTTT** — Upwork → Slack notifications (optional)

### Phase 3 (Advanced)
- **Node.js API** — Emma autonomous mode, Sofia verdicts
- **PostgreSQL/SQLite** — Metrics storage
- **Next.js** — Priya dashboard, client portal
- **WebSockets** — Real-time updates (optional)
- **Claude API** — AC generation, test generation

### Phase 4 (Full Autonomy)
- **Event bus** (Redis or EventBridge) — Citizen coordination
- **Webhook server** — Git tags → actions
- **Job queue** (Bull or similar) — Async task processing
- **Monitoring** (Sentry, Datadog) — Track automation health

---

## Risks & Mitigation

### Risk 1: Over-Automation Reduces Quality

**Symptom:** Sofia auto-PASS lets bugs through, clients complain

**Mitigation:**
- Sofia stays in review-only mode (no auto-merge)
- Human spot-checks 10% of verdicts
- Ratchet up automation only after quality proven

### Risk 2: Upwork ToS Violation

**Symptom:** Account banned for bot activity

**Mitigation:**
- Never automate submission (always human click)
- Use RSS feeds (public, ToS-compliant)
- Browser extension for *assist* (not bot)
- Clearly disclose "AI-assisted" in profile

### Risk 3: Automation Complexity Exceeds Maintenance Capacity

**Symptom:** Broken scripts, no one fixes them

**Mitigation:**
- Start simple (bash scripts, cron)
- Document every automation (README + comments)
- Monitoring: alert when automation fails
- Budget 20% time for maintenance

---

## Next Actions (This Week)

**Immediate (Today):**
1. [ ] Manually process 20 Upwork posts (establish baseline)
2. [ ] Track time for each task (validate cost-benefit model)

**This Week:**
1. [ ] Implement P0 automations:
   - [ ] Proof regeneration (GitHub Actions)
   - [ ] Response monitoring (Zapier or bash script)
   - [ ] Lead tracker auto-update (Python script)

**Next Week:**
1. [ ] Test automations in production
2. [ ] Measure time savings
3. [ ] Plan Phase 2 automations (lead scraper, AC drafting)

---

## Summary

**Current:** 19.6h/week manual work
**Target (Phase 3):** 2.5h/week (87% automated)
**ROI:** $10K+/month time savings, 5-week payback

**Priority:**
1. 🔥 **P0 (Week 1-4):** Proof regen, response monitoring, lead tracking
2. **P1 (Week 5-12):** Lead scraping, AC drafting, test generation
3. **P2 (Week 13-24):** Emma autonomous, Sofia auto-review, Priya dashboard
4. **P3 (Week 25-52):** Full autonomy, 80%+ automated

**Key Principle:** Automate the repeatable, preserve human judgment where it matters (code, client relationships, strategic decisions).

Let's start with Phase 1 automations this week while processing Upwork posts manually. 🚀
