# Proposal Activation Plan: From 0 to 20 Proposals/Week

**Created:** 2025-11-07
**Owner:** Alexis (Strategy) + Bigbosexf (Execution)
**Priority:** 🔴 CRITICAL (blocking all revenue)

---

## Current State

**Proposals sent:** 0
**Revenue:** $0
**Blocker:** No one actively hunting for Upwork jobs

**We have everything ready:**
- ✅ Emma's mission selection criteria (`/citizens/emma/MISSION_SELECTION.md`)
- ✅ Proposal templates (`/docs/marketing/proposal_templates/`)
- ✅ Portfolio projects (Terminal Velocity, La Serenissima, TherapyKin, etc.)
- ✅ New compensation system ($1 per proposal written)
- ❌ **Missing:** Someone executing the hunt daily

---

## Goal

**Week 1 (2025-11-07 to 2025-11-13):** 5 proposals sent (ramp-up week)
**Week 2+:** 20 proposals/week (target state)

**Win rate assumption:** 25% → 5 jobs/week won at Week 2+
**Revenue target:** $400-1100/week → $1,600-4,400/month

---

## Activation Protocol

### Step 1: Bigbosexf Starts Daily Hunt (TODAY)

**Time commitment:** 2 hours/day
**Process:**

1. **Morning (30 min):** Search Upwork for jobs matching Emma's criteria
   - Filter: $400-1500 budget
   - Filter: Posted <24 hours
   - Filter: Creative AI services OR simple development
   - Save 5-10 job URLs

2. **Midday (60 min):** Analyze with Emma + draft proposals
   - For each job: Ask Emma "Should we bid on this?"
   - Emma analyzes: client type, budget match, stack match, red flags
   - Emma drafts proposal using correct template
   - Bigbosexf reviews and customizes

3. **Afternoon (30 min):** Submit proposals on Upwork
   - Copy Emma's draft into Upwork
   - Adjust budget/timeline if needed
   - Submit
   - Log in `citizens/emma/leads-tracker.md`

**Compensation:** $1 per proposal submitted (paid from mission fund)

---

### Step 2: Emma Provides Daily Support

**Emma's role:**
- Analyze job posts when Bigbosexf requests
- Draft proposals matching client type (process-skeptical vs process-oriented)
- Flag red flags (unclear scope, demanding client, budget mismatch)
- Track leads in `leads-tracker.md`
- Follow up with non-responding clients after 2 weeks

**Emma does NOT:** Browse Upwork directly (humans must search/submit)

---

### Step 3: Daily Standup (15 min)

**When:** End of day (around 18:00 UTC)
**Who:** Bigbosexf + Alexis
**Format:**

```
DAILY PROPOSAL STANDUP:

Jobs found today: [X]
Proposals submitted: [X]
Emma's analysis: [brief summary of patterns]
Blockers: [any issues]
Tomorrow's target: [X proposals]
```

**Communication:** Post in Telegram using `/home/mind-protocol/scopelock/tools/telegram-send.cjs`

---

### Step 4: Weekly Review (Friday)

**Metrics to track:**
- Proposals sent this week: [X]
- Response rate: [X]%
- Interviews scheduled: [X]
- Jobs won: [X]
- Revenue won: $[X]

**Adjust strategy based on:**
- Which service types get most responses (double down)
- Which proposal templates work best (refine)
- Which budget ranges win most (optimize)

---

## Target Service Mix (Week 1)

**Prioritize creative AI services (higher margins, faster delivery):**

- 2 proposals: Voice generation (ElevenLabs)
- 1 proposal: Image generation (Ideogram)
- 1 proposal: Presentation design (Gamma)
- 1 proposal: Simple development (Next.js dashboard)

**Why this mix:**
- Creative AI services: 70-85% margin (higher profit)
- Faster delivery: 3-5 days vs 7-14 days for dev
- Less technical risk: AI tools handle complexity
- Business Buyers: More likely to hire for creative work

---

## Success Metrics

**Week 1 (2025-11-07 to 2025-11-13):**
- ✅ 5 proposals sent
- ✅ At least 1 response from client
- ✅ Daily hunt rhythm established (Bigbosexf commits 2h/day)

**Week 2 (2025-11-14 to 2025-11-20):**
- ✅ 20 proposals sent
- ✅ 5+ client responses
- ✅ At least 1 job won
- ✅ Revenue: $400-1100

**Week 3+ (Steady State):**
- ✅ 20 proposals/week
- ✅ 5 jobs/week won (25% win rate)
- ✅ Revenue: $1,600-4,400/month

---

## Failure Modes & Mitigation

### Failure Mode 1: Bigbosexf doesn't commit 2h/day

**Detection:** 0-1 proposals sent for 2 consecutive days
**Mitigation:**
- Alexis sends alert via Telegram
- 1-on-1 check-in: What's blocking you?
- If capacity issue: Recruit Reanance or Kara to help with hunt

### Failure Mode 2: Win rate <15% (worse than expected)

**Detection:** After 20 proposals, <3 jobs won
**Mitigation:**
- Analyze which proposals got responses (what worked)
- Refine Emma's mission selection criteria (wrong jobs?)
- A/B test proposal templates (process-skeptical vs process-oriented)
- Adjust budget positioning (too high? too low?)

### Failure Mode 3: Creative AI tools access issues

**Detection:** Win job but can't deliver (no access to Ideogram/Runway/Suno)
**Mitigation:**
- Before submitting proposal: Verify tool access
- If no access: Only bid on dev jobs (fallback to 50-60% margin)
- Budget for tool subscriptions ($50-200/month)

---

## Financial Impact

**Current runway:** [Need to calculate - not enough data yet]
**Burn rate:** ~$1,000/month (developer salaries + AI costs)

**Revenue scenarios (Week 2+ steady state):**

**Best case (30% win rate, high-margin creative AI jobs):**
- 20 proposals/week → 6 jobs won/week
- Avg job value: $800
- Avg margin: 75%
- **Revenue: $4,800/week → $19,200/month**
- **Profit: $3,600/week → $14,400/month**
- **Runway: 14+ months**

**Expected case (25% win rate, mixed creative + dev jobs):**
- 20 proposals/week → 5 jobs won/week
- Avg job value: $700
- Avg margin: 65%
- **Revenue: $3,500/week → $14,000/month**
- **Profit: $2,275/week → $9,100/month**
- **Runway: 9+ months**

**Worst case (15% win rate, only dev jobs):**
- 20 proposals/week → 3 jobs won/week
- Avg job value: $600
- Avg margin: 50%
- **Revenue: $1,800/week → $7,200/month**
- **Profit: $900/week → $3,600/month**
- **Runway: 3-4 months (need to improve or reduce costs)**

---

## Next Actions (Immediate)

**TODAY (2025-11-07):**

1. **Bigbosexf:** Commit to 2h/day hunt starting tomorrow (2025-11-08)
   - [ ] Confirm availability via Telegram
   - [ ] Set daily calendar block (10:00-12:00 UTC or preferred time)

2. **Alexis:** Verify Bigbosexf's commitment
   - [ ] Send message: "Bigbosexf, can you commit 2h/day to Upwork hunt starting tomorrow? First proposals due by end of day Friday (3 proposals)."

3. **Emma:** Prepare for incoming requests
   - [ ] Review mission selection criteria
   - [ ] Have proposal templates ready
   - [ ] Set up leads-tracker.md structure

**TOMORROW (2025-11-08):**

1. **Bigbosexf:** First hunt session
   - [ ] Find 5-10 jobs matching Emma's criteria
   - [ ] Ask Emma to analyze top 3
   - [ ] Submit at least 1 proposal

2. **Emma:** Analyze first batch
   - [ ] Respond within 30 minutes to Bigbosexf's requests
   - [ ] Draft proposals using correct template
   - [ ] Log jobs in leads-tracker.md

3. **Alexis:** Monitor progress
   - [ ] Check for first proposal submission
   - [ ] Send encouragement message if proposal submitted
   - [ ] Alert if no proposal by end of day

---

## Communication Plan

**Daily (End of day):**
Bigbosexf posts standup in Telegram:
```
📊 Proposal Hunt Update:

Jobs found: 8
Analyzed with Emma: 3
Proposals submitted: 2
Tomorrow's target: 2 proposals

Status: On track / Behind / Blocked
```

**Weekly (Friday evening):**
Alexis posts weekly metrics in Telegram:
```
📈 Week 1 Results:

Proposals sent: 5
Responses: 2
Interviews: 1
Jobs won: 0 (expected Week 2)

Next week target: 10 proposals
Strategy adjustment: [if needed]
```

---

## Decision Log

**2025-11-07:** Plan created, awaiting Bigbosexf confirmation
**[Next decision date]:** [Record key decisions here]

---

## Resources

**For Bigbosexf:**
- Mission selection: `/citizens/emma/MISSION_SELECTION.md`
- Proposal templates: `/docs/marketing/proposal_templates/`
- Emma's workflow: `/citizens/emma/WORKFLOW.md`

**For Emma:**
- Citizen prompt: `/citizens/emma/CLAUDE.md`
- Portfolio examples: `/docs/portfolio/README.md`
- Communication guide: `/docs/marketing/communication_guide.md`

**For Alexis:**
- Financial tracking: Track in monthly dashboard
- Strategic decisions: Log in `/citizens/alexis/IDEAS.md`
