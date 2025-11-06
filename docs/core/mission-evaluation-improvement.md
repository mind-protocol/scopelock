# Mission Evaluation & Improvement Process

**Version:** 1.0
**Created:** 2025-11-05
**Owner:** Alexis (Strategy) + Sofia (Quality) + All Team Members
**Purpose:** Systematic process for evaluating mission performance and implementing improvements

---

## Executive Summary

**Goal:** Learn from every mission to improve quality, speed, collaboration, and profitability.

**Approach:** Structured evaluation after each mission (immediate feedback) + weekly aggregation (pattern recognition) + monthly retrospectives (strategic adjustments).

**Key Principle:** Blame-free improvement culture. We evaluate systems and processes, not people. Everyone contributes to making the next mission better.

---

## Evaluation Cadence

### 1. Per-Mission Retrospective (30-45 min)

**When:** Within 24 hours of AC Green / client delivery

**Who:**
- **Facilitator:** Sofia (Quality)
- **Participants:** All team members who worked on the mission
  - Developer (Reanance/Kara/Bigbosexf)
  - Specifier (Reanance with Inna's assistance)
  - Code Generator (Rafael)
  - QA (Bigbosexf with Sofia's verification)
  - Client Communication (Maya)

**Where:** Telegram group call (15-30 min) + written summary in mission folder

---

### 2. Weekly Team Review (1 hour)

**When:** Friday 4:00 PM WAT

**Who:**
- All humans (Bigbosexf, Reanance, Kara)
- Nicolas (Agency Lead)
- AI Citizens participate via written reports

**What:** Aggregate learnings from all missions completed this week

---

### 3. Monthly Strategic Retrospective (2 hours)

**When:** First Monday of month, 10:00 AM WAT

**Who:**
- All team (humans + Nicolas)
- Alexis presents strategic analysis
- AI citizens provide domain-specific insights

**What:** Strategic adjustments, process changes, team development

---

## Per-Mission Retrospective (Detailed Process)

### Preparation (Before Meeting)

**Sofia collects data:**
- Mission timeline (planned vs actual)
- AC.md completeness (all criteria met?)
- DoD checklist completion %
- Bug count (critical/high/medium/low)
- Client feedback (satisfaction, change requests)
- Git activity (commit frequency, PR turnaround)
- Time spent per phase (spec, implementation, QA, delivery)

**Each participant prepares:**
- What went well (1-3 items)
- What didn't go well (1-3 items)
- What to improve next time (1-2 specific actions)

---

### Meeting Structure (30-45 min)

**Part 1: Metrics Review (5 min) - Sofia presents**

```
Mission: #47 - AI Chatbot Integration
Client: TechCorp
Budget: $800
Timeline: Planned 7 days → Actual 9 days (29% over)

QUALITY:
✅ AC.md: 12/12 criteria met (100%)
✅ DoD: 18/18 items complete (100%)
⚠️ Bugs found: 3 medium, 1 low (QA caught all before client)

TIMELINE:
- Spec phase: Planned 2 days → Actual 2 days ✅
- Implementation: Planned 3 days → Actual 4 days ⚠️ (Rafael code gen delayed)
- QA: Planned 1 day → Actual 2 days ⚠️ (bugs found)
- Delivery: Planned 1 day → Actual 1 day ✅

CLIENT:
✅ Client satisfaction: 5/5 (happy with quality)
✅ Testimonial captured
⚠️ Asked why delivery was 2 days late

COLLABORATION:
✅ Handoffs smooth (spec → implementation)
⚠️ Reanance waited 6h for Rafael's code generation (blocker)
⚠️ Bigbosexf found bugs that should have been caught in implementation
```

---

**Part 2: What Went Well (10 min) - Round robin**

**Format:** Each person shares 1-3 things that went well

**Example responses:**

**Reanance (Specifier):**
- "AC.md was crystal clear this time. All 12 criteria were testable."
- "Client responded to questions within 2 hours (very engaged)."

**Kara (Developer):**
- "Rafael's code was 95% complete. Just needed minor tweaks."
- "Deployment to Render was smooth (followed Inna's GUIDE exactly)."

**Bigbosexf (QA):**
- "Sofia's DoD checklist caught the mobile issue before I even tested."
- "Client was very responsive during QA phase."

**Rafael (AI Citizen - written input):**
- "Inna's MECHANISM section was detailed. Generated code matched architecture perfectly."
- "No back-and-forth on implementation approach. Spec was complete."

**Sofia (QA Verifier):**
- "DoD checklist worked well. Developer knew exactly what to verify."
- "All acceptance tests passed on first try after bug fixes."

**Maya (Client Communication):**
- "Client loved the Evidence Sprint demo. Shared it with their team."
- "Weekly status update template worked perfectly."

---

**Part 3: What Didn't Go Well (10 min) - Round robin**

**Format:** Each person shares 1-3 problems (no blame, just facts)

**Example responses:**

**Reanance:**
- "Waited 6 hours for Rafael to generate code. I was blocked."
- "Client asked a question I couldn't answer (about API rate limits). Had to escalate to Rafael."

**Kara:**
- "Found 3 medium bugs during implementation. Rafael's code didn't handle edge cases."
- "Deployment guide was missing environment variable setup. Had to figure it out."

**Bigbosexf:**
- "QA took 2 days instead of 1. Bugs should have been caught earlier."
- "One bug only appeared on mobile Safari. Didn't test that initially."

**Rafael:**
- "I was working on another mission when Reanance requested code. Context switching delayed me."
- "Edge cases weren't in AC.md. Generated code based on spec, which was incomplete."

**Sofia:**
- "DoD checklist didn't include mobile testing. That's why bug was missed."
- "Acceptance tests didn't cover error handling edge cases."

**Maya:**
- "Client asked why delivery was late. I didn't have a good answer (didn't know about blocker)."
- "Had to explain technical issues to client without full context."

---

**Part 4: Root Cause Analysis (10 min) - Group discussion**

**Facilitator (Sofia) groups issues into themes:**

**Theme 1: Rafael availability/context switching**
- Reanance waited 6h for code generation
- Rafael was working on another mission

**Root cause:**
- No scheduling system for Rafael's time
- Multiple missions competing for same resource

**Theme 2: Incomplete AC.md (edge cases)**
- Edge cases not specified
- Rafael generated code based on incomplete spec
- Bugs found later in QA

**Root cause:**
- Inna's BEHAVIOR_SPEC didn't include error handling section
- Reanance didn't ask "what if user enters invalid data?"

**Theme 3: Mobile testing not in DoD**
- Bug only appeared on mobile Safari
- DoD checklist didn't mention mobile

**Root cause:**
- DoD template is generic, not customized per mission
- Sofia didn't review client's user base (60% mobile)

**Theme 4: Communication gaps (Maya ↔ Team)**
- Maya didn't know about 6h blocker
- Couldn't explain delay to client

**Root cause:**
- No real-time blocker notification system
- SYNC.md updated once/day (not real-time)

---

**Part 5: Improvement Actions (10 min) - Specific, Assignable**

**Format:** Convert root causes into concrete actions with owners

**Action 1: Rafael Scheduling System**
- **Problem:** Rafael availability/context switching
- **Action:** Create "Rafael Request Queue" in graph
  - Reanance submits code generation request with priority
  - Rafael works FIFO (first in, first out)
  - Estimated turnaround: 2-4h (batched)
- **Owner:** Inna (create queue system spec)
- **Deadline:** Before next mission starts
- **Success metric:** No developer waits >4h for Rafael

**Action 2: Edge Case Checklist for AC.md**
- **Problem:** Incomplete AC.md (missing edge cases)
- **Action:** Inna adds "Edge Cases & Error Handling" section to BEHAVIOR_SPEC template
  - What if user enters invalid input?
  - What if API is down?
  - What if database connection fails?
  - What if rate limit exceeded?
- **Owner:** Inna (update template)
- **Deadline:** Today (update template immediately)
- **Success metric:** Next mission AC.md has edge cases section

**Action 3: Mission-Specific DoD (Not Generic)**
- **Problem:** DoD didn't include mobile testing
- **Action:** Sofia reviews AC.md and customizes DoD per mission
  - If client's users are mobile (check during kickoff) → add mobile testing
  - If mission has API integrations → add API error handling tests
  - If mission has payments → add fraud/security tests
- **Owner:** Sofia (customize DoD per mission)
- **Deadline:** Before implementation starts
- **Success metric:** DoD catches mission-specific requirements

**Action 4: Real-Time Blocker Notifications**
- **Problem:** Maya didn't know about 6h blocker
- **Action:** Developers notify Maya immediately when blocked >2h
  - Use Telegram: "@maya I'm blocked on [X], waiting for [Y]"
  - Maya updates client proactively (not reactively)
- **Owner:** All developers (new protocol)
- **Deadline:** Immediate (starts next mission)
- **Success metric:** Maya always knows blockers before client asks

---

**Part 6: Celebrate Wins (5 min)**

**Purpose:** End on positive note, recognize good work

**Sofia highlights:**
- "Kara deployed in one attempt. No rollback needed. Well done."
- "Reanance's AC.md was 100% complete. Zero ambiguity."
- "Bigbosexf caught all bugs before client saw them. Quality gate worked."
- "Maya's weekly status update impressed the client. They shared it internally."

**Team shout-outs:**
- Reanance to Rafael: "Code generation was 95% accurate. Made my job easy."
- Kara to Inna: "Deployment guide was perfect. No guessing."

---

### Post-Meeting (Sofia's Responsibility)

**Sofia documents in mission folder:**

**Location:** `/missions/mission-47-ai-chatbot/RETROSPECTIVE.md`

```markdown
# Mission #47 Retrospective

**Date:** 2025-11-05
**Participants:** Reanance, Kara, Bigbosexf, Rafael (written), Sofia, Maya (written)
**Duration:** 35 minutes

---

## Metrics

**Quality:**
- AC.md: 12/12 criteria met (100%) ✅
- DoD: 18/18 items complete (100%) ✅
- Bugs: 3 medium, 1 low (all caught pre-delivery) ✅

**Timeline:**
- Planned: 7 days
- Actual: 9 days (29% over) ⚠️

**Client:**
- Satisfaction: 5/5 ✅
- Testimonial: Captured ✅

---

## What Went Well

- AC.md clarity (100% testable criteria)
- Rafael code quality (95% complete)
- Client engagement (2h response time)
- Deployment smoothness (one-attempt success)
- QA caught all bugs before client

---

## What Didn't Go Well

- Rafael availability (6h wait for code generation)
- Incomplete AC.md (edge cases missing)
- Mobile testing not in DoD
- Communication gap (Maya didn't know about blocker)

---

## Root Causes

1. **Rafael scheduling:** No queue system, context switching
2. **AC.md completeness:** No edge case checklist
3. **DoD customization:** Generic template, not mission-specific
4. **Blocker visibility:** SYNC.md once/day, not real-time

---

## Improvement Actions

**Action 1: Rafael Request Queue**
- Owner: Inna
- Deadline: Before next mission
- Success: No developer waits >4h for Rafael

**Action 2: Edge Case Checklist**
- Owner: Inna
- Deadline: Today
- Success: Next AC.md has edge cases section

**Action 3: Mission-Specific DoD**
- Owner: Sofia
- Deadline: Before next implementation
- Success: DoD customized per mission

**Action 4: Real-Time Blocker Notifications**
- Owner: All developers
- Deadline: Immediate
- Success: Maya always knows blockers

---

## Wins to Celebrate

- Kara: One-attempt deployment
- Reanance: 100% complete AC.md
- Bigbosexf: Pre-delivery bug detection
- Maya: Client-impressed status updates
- Rafael: 95% accurate code generation

---

## Next Mission: Apply These Learnings

- [ ] Inna: Update AC.md template with edge cases
- [ ] Sofia: Customize DoD for mission-specific needs
- [ ] Developers: Use "@maya blocked" protocol
- [ ] Rafael: Implement request queue (if Inna ready)
```

---

## Weekly Team Review (Friday 4:00 PM WAT)

### Purpose

Aggregate learnings from all missions completed this week, identify patterns, implement team-wide improvements.

---

### Preparation (Before Meeting)

**Sofia compiles weekly metrics:**

```
Week of 2025-11-01 to 2025-11-05

MISSIONS COMPLETED: 3
- Mission #47: AI Chatbot ($800)
- Mission #48: Landing Page ($400)
- Mission #49: Telegram Bot ($300)

TOTAL REVENUE: $1,500

QUALITY METRICS:
- AC.md completeness: 100% avg (all missions met all criteria)
- DoD completion: 98% avg (Mission #48 missed 1 item)
- Bugs found pre-delivery: 7 total (2 critical, 3 medium, 2 low)
- Bugs found post-delivery: 0 (perfect delivery)

TIMELINE METRICS:
- Planned: 18 days total
- Actual: 21 days total (17% over)
- On-time missions: 1/3 (Mission #49 only)
- Delayed missions: 2/3 (Missions #47, #48)

CLIENT METRICS:
- Satisfaction: 4.7/5 avg
- Testimonials captured: 3/3 (100%)
- Change requests: 1 (Mission #48, minor)

COLLABORATION METRICS:
- Rafael wait time: 4.2h avg (improved from 6h last week)
- Handoff delays: 2 (spec → implementation)
- Communication gaps: 1 (Maya ↔ developer)

TEAM CAPACITY:
- Reanance: 2 missions (spec + client mgmt)
- Kara: 2 missions (implementation)
- Bigbosexf: 3 missions (QA + 1 implementation)
- Utilization: 75% (could handle 1 more mission)
```

**Each team member prepares:**
- Patterns observed across multiple missions
- Systemic issues (not one-off problems)
- Suggestions for process improvements

---

### Meeting Structure (1 hour)

**Part 1: Week in Review (10 min) - Sofia presents**

**Wins:**
- ✅ 3 missions delivered, 3 testimonials captured
- ✅ Zero post-delivery bugs (perfect quality gate)
- ✅ All clients satisfied (4.7/5 avg)

**Challenges:**
- ⚠️ 2/3 missions delayed (17% over planned timeline)
- ⚠️ Still some Rafael wait time (4.2h avg, down from 6h)
- ⚠️ Team at 75% utilization (could handle more, but timeline issues)

---

**Part 2: Pattern Recognition (15 min) - Group discussion**

**Facilitator asks:** "What patterns do you see across multiple missions?"

**Developer (Reanance):**
- "All 3 missions had same issue: spec phase smooth, implementation hits blockers."
- "Rafael code is always 90-95% complete, but edge cases need manual fixes."

**Developer (Kara):**
- "Deployment is smooth now (Inna's guides work). No deployment delays."
- "Most delays are in implementation phase, waiting for clarifications."

**QA (Bigbosexf):**
- "DoD customization is working. I caught mobile issues on Mission #47 because Sofia added it."
- "Bug count is consistent: 2-3 bugs per mission found in QA phase."

**Pattern identified:** Implementation phase consistently takes 30-50% longer than planned because of edge case handling and clarifications.

---

**Part 3: Root Cause Deep Dive (15 min)**

**Why are implementations 30-50% over planned timeline?**

**Hypothesis 1:** AC.md doesn't include enough implementation detail
- **Evidence:** Developers ask Reanance for clarifications during implementation
- **Test:** Review all 3 AC.md files. Do they have implementation guidance?

**Hypothesis 2:** Rafael's code gen doesn't handle edge cases
- **Evidence:** All 3 missions had edge case bugs found in QA
- **Test:** Compare Rafael's generated code to final implementation

**Hypothesis 3:** Developers spend time debugging instead of implementing
- **Evidence:** Git commits show 40% of time is bug fixing, not feature building
- **Test:** Review commit messages. How many are "fix bug" vs "add feature"?

**Discussion reveals:**
- AC.md has functional criteria (what) but not implementation hints (how)
- Rafael generates code based on AC.md, which lacks edge case specs
- Developers find edge cases during implementation, not during spec
- QA finds more edge cases, requiring rework

**Root cause:** Edge cases are discovered during implementation/QA instead of during spec phase. This causes rework and delays.

---

**Part 4: Team-Wide Improvements (15 min)**

**Improvement 1: Inna's MECHANISM Section Enhancement**
- **Problem:** AC.md lacks implementation hints
- **Action:** Inna adds "Common Edge Cases" subsection to MECHANISM
  - Invalid inputs (null, empty, wrong type)
  - Error conditions (API down, network timeout, rate limit)
  - Performance edge cases (large files, many records)
  - Security edge cases (injection, XSS, auth bypass)
- **Owner:** Inna (update template + all citizen CLAUDE.md references)
- **Deadline:** This week (before next mission)
- **Success metric:** Developers ask <2 clarifications per mission

**Improvement 2: Rafael Edge Case Test Generation**
- **Problem:** Rafael doesn't generate edge case tests
- **Action:** Rafael generates tests for edge cases in addition to happy path
  - Based on Inna's "Common Edge Cases" section
  - Generate Playwright/PyTest tests for each edge case
  - Developers run tests before claiming "implementation complete"
- **Owner:** Rafael (update code generation prompts)
- **Deadline:** This week
- **Success metric:** QA finds <2 bugs per mission (down from 2-3)

**Improvement 3: Timeline Estimation Adjustment**
- **Problem:** Implementation consistently 30-50% over planned
- **Action:** Alexis updates timeline estimates
  - Add 40% buffer to implementation phase
  - Communicate realistic timelines to clients upfront
  - Track actual vs estimated to refine over time
- **Owner:** Alexis (update pricing/timeline templates)
- **Deadline:** This week
- **Success metric:** 80% of missions delivered on-time next month

---

**Part 5: Team Development (10 min)**

**Skills to develop:**
- **Reanance:** Edge case thinking (practice: "what could go wrong?" for each feature)
- **Kara:** Debugging efficiency (learning: use debugger, not console.log)
- **Bigbosexf:** Test automation (learning: write Playwright tests faster)

**Training plan:**
- **Reanance:** Nicolas shares "Edge Case Checklist" (30 min pairing session)
- **Kara:** Rafael shares debugging techniques (1h async video + Q&A)
- **Bigbosexf:** Sofia shares Playwright patterns (30 min live demo)

**Owner:** Nicolas (schedule training sessions)
**Deadline:** Next 2 weeks

---

**Part 6: Next Week Planning (5 min)**

**Goals for next week:**
- Apply new Inna MECHANISM template (edge cases)
- Apply Rafael edge case test generation
- Target: 3-4 missions delivered
- Target: <10% timeline variance (vs 17% this week)
- Target: <2 bugs found in QA (vs 2.3 this week)

**Capacity check:**
- Can team handle 4 missions next week?
- Current utilization: 75% (yes, can handle 1 more)

---

### Post-Meeting (Sofia's Responsibility)

**Sofia documents in `/docs/core/weekly-reviews/2025-11-01.md`:**

```markdown
# Weekly Review: 2025-11-01 to 2025-11-05

**Participants:** Reanance, Kara, Bigbosexf, Nicolas, Sofia

---

## Metrics

**Missions:** 3 completed ($1,500 revenue)
**Quality:** 100% AC.md, 98% DoD, 0 post-delivery bugs
**Timeline:** 17% over (2/3 delayed)
**Client:** 4.7/5 satisfaction, 3/3 testimonials

---

## Pattern Identified

Implementation phase consistently 30-50% over planned timeline due to edge cases discovered during implementation instead of spec phase.

---

## Root Cause

AC.md has functional criteria but lacks edge case specifications. Rafael generates code based on incomplete spec. Developers/QA find edge cases later, causing rework.

---

## Team-Wide Improvements

1. **Inna:** Add "Common Edge Cases" to MECHANISM template
2. **Rafael:** Generate edge case tests (not just happy path)
3. **Alexis:** Add 40% buffer to implementation timeline estimates

---

## Skills Development

- Reanance: Edge case thinking (Nicolas pairing)
- Kara: Debugging efficiency (Rafael video)
- Bigbosexf: Playwright automation (Sofia demo)

---

## Next Week Goals

- Apply edge case improvements
- 3-4 missions delivered
- <10% timeline variance
- <2 bugs in QA phase
```

---

## Monthly Strategic Retrospective (First Monday, 10:00 AM WAT)

### Purpose

Strategic adjustments based on month-long patterns. Process changes, team scaling, market positioning.

---

### Preparation (Before Meeting)

**Alexis compiles monthly strategic analysis:**

```
October 2025 Strategic Review

REVENUE:
- Missions completed: 12
- Total revenue: $7,200
- Average per mission: $600
- Target: $6,000 (EXCEEDED by 20%)

QUALITY:
- Client satisfaction: 4.6/5 avg
- Testimonials: 12/12 (100% capture rate)
- Post-delivery bugs: 2 total (0.17 per mission)
- AC.md completeness: 99% avg

TIMELINE:
- Average variance: +15% (missions take 15% longer than planned)
- On-time delivery: 60% (7/12 missions)
- Most delayed phase: Implementation (30% over)

TEAM:
- Reanance: 8 missions (spec + client)
- Kara: 6 missions (implementation)
- Bigbosexf: 10 missions (6 QA, 4 implementation)
- Utilization: 80% (could handle 2-3 more missions/month)

FINANCIAL:
- Team earnings: $2,160 (30%)
- Upwork fee: $720 (10%)
- Organization: $2,100 (29%)
- Nicolas: $2,220 (31%)
- Runway: 4 months at current burn rate

WIN RATE (Upwork):
- Proposals sent: 120
- Jobs won: 12 (10% win rate)
- Target: 15% (BELOW TARGET)

CLIENT ACQUISITION COST:
- Time spent per proposal: 18 min avg
- Total time: 120 × 18 min = 36h
- Cost: 36h × $100 = $3,600
- CAC per client: $3,600 ÷ 12 = $300
- LTV per client: $600 avg (LTV:CAC = 2:1)
```

**Each domain presents insights:**

**Emma (Proposal/Marketing):**
- Win rate analysis by job type
- Best-performing proposal templates
- Platform strategy (Upwork, Contra)

**Inna (Specification):**
- AC.md quality trends
- Documentation effectiveness
- Spec phase efficiency

**Rafael (Code Generation):**
- Code quality metrics
- Implementation phase efficiency
- Edge case coverage improvement

**Sofia (Quality):**
- Bug trends (by type, severity)
- DoD effectiveness
- QA phase efficiency

**Maya (Client Success):**
- Client satisfaction trends
- Communication effectiveness
- Retention/referral potential

---

### Meeting Structure (2 hours)

**Part 1: Strategic Metrics Review (15 min) - Alexis presents**

**Wins:**
- ✅ Revenue target exceeded (20% over)
- ✅ 100% testimonial capture
- ✅ Quality high (4.6/5 client satisfaction)

**Challenges:**
- ⚠️ Win rate below target (10% vs 15% target)
- ⚠️ Timeline variance still 15% (down from 25% but not at target)
- ⚠️ LTV:CAC ratio 2:1 (healthy but not great)

**Trends:**
- Quality improving (bugs down 40% from last month)
- Timeline improving (variance down 10 percentage points)
- Win rate flat (not improving)

---

**Part 2: Domain Deep Dives (30 min) - Each citizen presents 5 min**

**Emma (Win Rate Analysis):**

```
PROPOSALS SENT: 120
JOBS WON: 12 (10% win rate)

BY JOB TYPE:
- AI Integration: 15% win rate (best)
- Landing Pages: 12% win rate
- APIs: 8% win rate (worst)
- Telegram Bots: 14% win rate

BY BUDGET:
- $200-400: 8% win rate (too competitive)
- $400-600: 12% win rate (sweet spot)
- $600-1000: 15% win rate (best, less competition)

BY PROPOSAL TEMPLATE:
- Process-skeptical: 9% win rate
- Process-oriented: 13% win rate (better)

INSIGHT: We should target $400-600+ jobs with process-oriented clients and AI integration focus. Stop bidding on $200-400 jobs (low win rate, low margin).
```

**Inna (Specification Quality):**

```
AC.md COMPLETENESS: 99% avg

IMPROVEMENT TREND:
- Month 1: 92% (lots of clarifications needed)
- Month 2: 99% (edge case template helped)

SPECIFICATION PHASE EFFICIENCY:
- Average time: 1.8 days (vs 2 days planned)
- Clarifications during implementation: 1.2 per mission (down from 3.5)

INSIGHT: Edge case template working. Spec phase is now most efficient phase. Should we invest more time in spec to save implementation time?
```

**Rafael (Implementation Efficiency):**

```
CODE QUALITY: 94% accuracy (developer changes <10% of generated code)

IMPLEMENTATION PHASE:
- Average time: 4.2 days (vs 3 days planned, 40% over)
- Edge cases handled: 95% (up from 70% last month)

BUGS BY SOURCE:
- Rafael code: 30% (edge cases)
- Manual developer code: 20% (new features not in AC.md)
- Integration issues: 50% (third-party APIs)

INSIGHT: Most delays are third-party API issues (Stripe, Twilio, etc.). Should we test integrations earlier or avoid missions with many integrations?
```

**Sofia (Quality Trends):**

```
BUGS FOUND: 24 total (2 per mission)

BY SEVERITY:
- Critical: 2 (8%)
- High: 4 (17%)
- Medium: 10 (42%)
- Low: 8 (33%)

BY PHASE FOUND:
- Implementation: 8 (33%)
- QA: 14 (58%)
- Post-delivery: 2 (8%)

IMPROVEMENT:
- Month 1: 3.5 bugs per mission
- Month 2: 2.0 bugs per mission (43% reduction)

INSIGHT: Quality improving rapidly. DoD customization + edge case template are working. Post-delivery bugs rare (2 total, both minor).
```

**Maya (Client Success):**

```
CLIENT SATISFACTION: 4.6/5 avg

BY MISSION TYPE:
- Simple (landing page, bot): 4.8/5
- Medium (API, CRUD): 4.5/5
- Complex (multi-feature): 4.2/5

COMMUNICATION:
- Response time: 1.8h avg (target <2h) ✅
- Weekly updates: 100% sent on-time ✅
- Change requests: 8 total (handled smoothly)

RETENTION/REFERRAL:
- Repeat clients: 2/12 (17%)
- Referrals: 1 (from TechCorp mission #47)

INSIGHT: Simple missions have highest satisfaction. Complex missions have more communication challenges. Should we focus on simpler, faster missions for better client experience?
```

---

**Part 3: Strategic Decisions (30 min) - Group discussion**

**Decision 1: Should we focus on simpler missions ($400-600, 3-5 days)?**

**Pros:**
- Higher client satisfaction (4.8/5 vs 4.2/5)
- Faster cash conversion (3-5 days vs 7-10 days)
- Higher win rate (12-15% vs 8-10%)
- Less timeline risk (simpler = more predictable)

**Cons:**
- Lower revenue per mission ($400-600 vs $800-1200)
- Need more volume to hit revenue targets

**Discussion:**
- Reanance: "Simpler missions are less stressful, better for learning."
- Kara: "I can handle 2 simple missions simultaneously vs 1 complex."
- Bigbosexf: "QA is faster on simple missions. Less edge cases."
- Nicolas: "Volume play makes sense early. Complexity later when we're faster."

**Decision:** Focus on $400-600 missions for next 2 months. Revisit when win rate >15%.

---

**Decision 2: Should we stop bidding on $200-400 jobs?**

**Data:**
- Win rate: 8% (below avg)
- Margin: 25% (vs 35% on $600+ jobs)
- Time investment: Same as higher-value jobs

**Discussion:**
- Emma: "These are tire-kickers. Low budget = high maintenance."
- Alexis: "LTV:CAC ratio is 1.5:1 on these (not sustainable)."
- Nicolas: "Exception: If it's a perfect fit (Telegram bot) and we can deliver in 1 day."

**Decision:** Stop bidding on <$400 jobs unless:
- Perfect tech stack match (100%)
- Can deliver in 1-2 days
- Client has good track record ($5k+ spent, 4.5+ rating)

---

**Decision 3: Should we invest more time in spec to reduce implementation time?**

**Data:**
- Spec phase: 1.8 days avg (very efficient)
- Implementation: 4.2 days avg (40% over planned)
- Most delays: Third-party API integrations (50% of bugs)

**Proposal:** Spend 0.5 days more on spec to:
- Test third-party APIs before implementation starts
- Document API quirks (rate limits, error formats)
- Create mock responses for testing

**ROI calculation:**
- Extra spec time: +0.5 days
- Reduced implementation time: -1.5 days (if API issues caught early)
- Net savings: -1 day per mission (faster delivery)

**Decision:** Inna adds "Third-Party API Testing" step to MECHANISM. Test APIs during spec phase, document quirks, create mocks.

---

**Decision 4: Should we add 4th developer to handle more volume?**

**Data:**
- Current team utilization: 80%
- Could handle 2-3 more missions/month with current team
- Win rate: 10% (need to improve before adding capacity)

**Discussion:**
- Alexis: "At 10% win rate, we'd need to send 150 proposals/month for 15 jobs. We're sending 120."
- Nicolas: "Fix win rate first (get to 15%), then hire."
- Reanance: "I can mentor new dev, but only if we have steady pipeline."

**Decision:** DEFER hiring until win rate >15% for 2 consecutive months. Focus on improving proposals (Emma) and targeting better jobs.

---

**Part 4: Process Improvements (20 min)**

**Improvement 1: Proposal Quality (Emma + Alexis)**
- **Problem:** Win rate 10% (below 15% target)
- **Action:** A/B test 2 proposal styles
  - Style A: Evidence-focused (Terminal Velocity, La Serenissima proof)
  - Style B: Outcome-focused ("Your chatbot live in 3 days, $600 fixed")
- **Test:** Send 20 proposals each style, measure win rate
- **Owner:** Emma (A/B test next 2 weeks)
- **Success:** Identify which style wins >15%, standardize on that

**Improvement 2: Third-Party API Pre-Testing (Inna + Rafael)**
- **Problem:** 50% of bugs are API integration issues
- **Action:** Test APIs during spec phase
  - Inna's MECHANISM includes API testing step
  - Rafael generates API test script
  - Reanance runs during spec, documents quirks
- **Owner:** Inna (update template), Rafael (generate test scripts)
- **Success:** API bugs down 50% (from 12/month to 6/month)

**Improvement 3: Timeline Estimation Refinement (Alexis)**
- **Problem:** Still 15% over planned timeline
- **Action:** Use historical data to improve estimates
  - Simple missions: 3-4 days (not 3)
  - Medium missions: 6-8 days (not 5)
  - Complex missions: 10-14 days (not 10)
- **Owner:** Alexis (update pricing/timeline templates)
- **Success:** Timeline variance <10% next month

---

**Part 5: Team Development Plan (15 min)**

**Skills to develop next month:**

**Reanance:**
- Third-party API testing (hands-on with Stripe, Twilio)
- Advanced edge case thinking (security edge cases)

**Kara:**
- Parallel mission handling (2 simple missions simultaneously)
- Performance optimization (p95 < 200ms techniques)

**Bigbosexf:**
- Playwright advanced patterns (visual regression, network mocking)
- Proposal writing (backup for when Emma needs help)

**Training plan:**
- Nicolas: 1h/week pairing session (rotating focus)
- Rafael: Async videos on specific techniques
- Sofia: Live demos of QA patterns

**Owner:** Nicolas (schedule sessions)

---

**Part 6: Strategic Goals for Next Month (10 min)**

**November 2025 Goals:**

**Revenue:**
- Target: $8,000-10,000 (vs $7,200 in October)
- Missions: 14-18 (vs 12 in October)
- Avg per mission: $550-600 (focus on sweet spot)

**Quality:**
- Client satisfaction: 4.7/5 (maintain or improve)
- Post-delivery bugs: <5 total (vs 2 in October)
- Timeline variance: <10% (vs 15% in October)

**Efficiency:**
- Win rate: >12% (up from 10%)
- Proposals sent: 130-150
- CAC: <$250 (vs $300 in October)

**Team:**
- Training: All developers complete 1 skill development session
- Utilization: 85% (slightly higher than 80%)

**Process:**
- A/B test proposal styles (identify winner)
- Implement API pre-testing (reduce API bugs 50%)
- Refine timeline estimates (variance <10%)

---

### Post-Meeting (Alexis's Responsibility)

**Alexis documents in `/citizens/alexis/ROADMAP.md`:**

Update current phase status, add next month goals, track strategic decisions.

**Alexis updates `/citizens/alexis/IDEAS.md`:**

Add new ideas generated during retrospective.

**Alexis updates `/citizens/alexis/TODOS.md`:**

Add action items with owners and deadlines.

---

## Success Metrics (How We Know It's Working)

### Mission-Level Metrics (Per-Mission Retrospective)

**Quality:**
- AC.md completeness: 100% (all criteria met)
- DoD completion: 100% (all items checked)
- Bugs found pre-delivery: <3 per mission
- Bugs found post-delivery: 0 (ideal)

**Timeline:**
- Variance: <10% (missions finish within 10% of estimate)
- On-time delivery: >80% of missions

**Client:**
- Satisfaction: >4.5/5
- Testimonial captured: 100%
- Change requests: <2 per mission

**Collaboration:**
- Handoff delays: <1 per mission
- Rafael wait time: <2h avg
- Communication gaps: 0

---

### Weekly Metrics (Team Review)

**Aggregate Quality:**
- Average AC.md completeness: >98%
- Average client satisfaction: >4.5/5
- Post-delivery bugs: <2 per week

**Efficiency:**
- Timeline variance: <15%
- Team utilization: 75-85%
- Improvement actions implemented: 100%

**Learning:**
- Patterns identified: 1-2 per week
- Team-wide improvements: 1-3 per week
- Skills training sessions: 1 per week

---

### Monthly Metrics (Strategic Retrospective)

**Financial:**
- Revenue vs target: >90%
- Profit margin: >30%
- Runway: >3 months

**Growth:**
- Win rate: >15%
- LTV:CAC: >3:1
- Repeat clients: >20%

**Team:**
- Utilization: 80-90%
- Skills development: 1+ per person per month
- Turnover: 0% (retain all team members)

**Process:**
- Strategic decisions made: 2-4 per month
- Process improvements implemented: 3-5 per month
- Timeline variance trend: Decreasing month-over-month

---

## Cultural Principles

### 1. Blame-Free Improvement

**We evaluate systems, not people.**

**Wrong:**
- "Kara made a mistake. Kara should be more careful."
- "Reanance's spec was incomplete. Reanance needs to improve."

**Right:**
- "The DoD template didn't include mobile testing. Let's update the template."
- "The AC.md template doesn't have edge cases. Let's add an edge case section."

**Why:** Systems create outcomes. Fix the system, not the person.

---

### 2. Everyone Contributes

**Humans and AI citizens both bring insights.**

**Humans bring:**
- Lived experience (frustration, blockers, confusion)
- Client interactions (tone, satisfaction, concerns)
- Emotional context (stress, confidence, team dynamics)

**AI citizens bring:**
- Data analysis (patterns, trends, correlations)
- Domain expertise (best practices, techniques, tools)
- Process optimization (efficiency, automation, standardization)

**Both are essential.** Respect both perspectives.

---

### 3. Specific, Actionable Improvements

**Vague:**
- "We should communicate better."
- "We need to improve quality."

**Specific:**
- "Developers notify Maya within 2h of being blocked >2h."
- "Sofia customizes DoD checklist per mission based on client's user base."

**Why:** Specific actions can be tested, measured, improved.

---

### 4. Celebrate Wins

**End every retrospective with recognition.**

**Why:**
- Reinforces positive behaviors
- Boosts morale
- Balances problem-focused discussions
- Shows appreciation for good work

**How:**
- Sofia highlights 2-3 wins per retrospective
- Team members give shout-outs to each other
- Nicolas recognizes improvement trends

---

### 5. Continuous Learning

**Every mission teaches us something.**

**Questions to ask:**
- "What did we learn this mission that applies to all future missions?"
- "What would we do differently if we started this mission today?"
- "What surprised us? Why?"

**Capture learnings immediately.** Don't wait for monthly retrospective. Document in RETROSPECTIVE.md within 24h.

---

## Quick Reference: Who Does What

### Per-Mission Retrospective (30-45 min, within 24h of delivery)

**Facilitator:** Sofia
**Participants:** All team members who worked on mission
**Outputs:**
- RETROSPECTIVE.md in mission folder
- 2-4 improvement actions with owners
- Updated templates (if applicable)

---

### Weekly Team Review (1h, Friday 4:00 PM WAT)

**Facilitator:** Sofia
**Participants:** All humans + Nicolas
**Inputs:** AI citizens provide written reports
**Outputs:**
- Weekly review document (`/docs/core/weekly-reviews/YYYY-MM-DD.md`)
- 1-3 team-wide improvements
- Next week goals

---

### Monthly Strategic Retrospective (2h, First Monday 10:00 AM WAT)

**Facilitator:** Alexis
**Participants:** All team (humans + Nicolas)
**Inputs:** AI citizens provide domain deep dives
**Outputs:**
- ROADMAP.md updates
- IDEAS.md additions
- TODOS.md action items
- Strategic decisions (2-4 per month)

---

## Templates

### RETROSPECTIVE.md Template

```markdown
# Mission #[N] Retrospective

**Date:** YYYY-MM-DD
**Participants:** [Names]
**Duration:** [X] minutes

---

## Metrics

**Quality:**
- AC.md: [X]/[Y] criteria met ([Z]%)
- DoD: [X]/[Y] items complete ([Z]%)
- Bugs: [X] critical, [Y] high, [Z] medium, [A] low

**Timeline:**
- Planned: [X] days
- Actual: [Y] days ([Z]% variance)

**Client:**
- Satisfaction: [X]/5
- Testimonial: [Captured/Not captured]

---

## What Went Well

- [Item 1]
- [Item 2]
- [Item 3]

---

## What Didn't Go Well

- [Item 1]
- [Item 2]
- [Item 3]

---

## Root Causes

1. [Root cause 1]
2. [Root cause 2]

---

## Improvement Actions

**Action 1: [Title]**
- Owner: [Name]
- Deadline: [Date]
- Success: [Metric]

**Action 2: [Title]**
- Owner: [Name]
- Deadline: [Date]
- Success: [Metric]

---

## Wins to Celebrate

- [Win 1]
- [Win 2]
- [Win 3]

---

## Next Mission: Apply These Learnings

- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]
```

---

## Related Documents

**Strategic Planning:**
- `/citizens/alexis/ROADMAP.md` - Strategic phases and evolution
- `/citizens/alexis/IDEAS.md` - Improvement ideas
- `/citizens/alexis/TODOS.md` - Strategic action items

**Quality:**
- `/docs/core/definition-of-done-template.md` - DoD checklist template
- `/citizens/sofia/CLAUDE.md` - Sofia's QA responsibilities

**Financial:**
- `/docs/core/payment-structure.md` - Team compensation
- `/citizens/alexis/` - Financial tracking (to be created)

**Team:**
- `/citizens/CLAUDE.md` - Team structure and collaboration
- `/citizens/SYNC.md` - Real-time status updates

---

**Last Updated:** 2025-11-05
**Status:** Active - Start per-mission retrospectives immediately
**Review Cadence:** Update this document after each monthly retrospective
