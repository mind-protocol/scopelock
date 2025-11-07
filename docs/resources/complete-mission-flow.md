# The Complete Mission Flow: Who Does What When

**Target audience:** Nigerian and Colombian developers joining ScopeLock
**Reading time:** 12 minutes
**Prerequisites:** None (this is your starting point!)

**📚 Resource:** [Interactive version with expandable sections](https://scopelock.mindprotocol.ai/resources/complete-mission-flow) • [Download Quick Reference Card (PDF)](#)

---

## Why This Matters

You're joining a team where **AI does 95% of the heavy lifting** and you supervise, deploy, and verify. But if you don't know:
- **WHO** to ask when stuck
- **WHEN** to escalate vs. continue
- **WHAT** a good handoff looks like

...you'll waste hours in confusion instead of shipping fast.

**This guide shows the complete flow** from "job posted on Upwork" to "client paid, testimonial received."

---

## The Big Picture: 5 Phases

```
┌─────────────┐   ┌──────────────┐   ┌───────────┐   ┌─────────┐   ┌──────────┐
│ 1. ACQUIRE  │ → │ 2. SPECIFY   │ → │ 3. BUILD  │ → │ 4. TEST │ → │ 5. DELIVER│
│  (~2 min)   │   │ (PLACEHOLDER)│   │ (2-5 days)│   │(2-4 hrs)│   │  (~1 day) │
└─────────────┘   └──────────────┘   └───────────┘   └─────────┘   └──────────┘
     ↓                   ↓                  ↓              ↓             ↓
 Find & Propose    Lock the Scope    Code & Deploy    QA Check    Client Accept
```

**Key insight:** Each phase has a **clear owner**, **AI support**, and **handoff criteria**.

---

## Phase 1: ACQUIRE (~2 minutes)

### Owner: Any team member
### AI Support: Emma ("The Scout")

### The Flow

**Step 1: Search & Filter (Team member)**
1. Open Upwork, search for jobs matching our criteria
2. Copy entire results page
3. Paste to Emma (via Claude Code): `"Emma, analyze these jobs"`

**Step 2: Emma's Analysis (AI, instant)**
- Emma reads all job posts
- Returns: `"3 NO-GO (reasons), 2 STRONG GO (confidence scores)"`
- Provides brief rationale for each decision

**Step 3: Deep Dive (Team member)**
- Open each STRONG GO job
- Copy ENTIRE job description (don't summarize!)
- Paste to Emma: `"Emma, write proposal for this job"`

**Step 4: Emma Generates Complete Proposal Package (AI, ~60 seconds)**
Emma produces:
- ✅ Full proposal text (plain text, ready to paste)
- ✅ Answers to client questions
- ✅ Metadata JSON (budget, timeline, client info)
- ✅ Telegram notification to team

**Step 5: Send (Team member)**
- Review Emma's proposal (30 seconds)
- Copy-paste into Upwork
- Submit!

### Duration: ~2 minutes per proposal

### What You Receive

📱 **Telegram notification:**
```
🎯 STRONG GO • UPWORK • 90% confidence

Landing Page for SaaS Product

💰 $400-600 (bid: $500)
👤 $12,500 spent • 4.9★ • 15 hires • ✅ verified
📁 Proof: TherapyKin
🎭 Type: process-skeptical

PROPOSAL:
[Full text here, ready to paste]

🔗 [Job URL]
```

📄 **Files created:**
- `/citizens/emma/proposals/2025-11-05_upwork_saas-landing-page.txt`
- `/citizens/emma/proposals/2025-11-05_upwork_saas-landing-page.json`

### When to Escalate
- ❌ **DON'T escalate:** Emma says NO-GO → Trust her, move on
- ✅ **DO escalate:** Client responds with technical question you can't answer → Telegram NLR

---

## Phase 2: SPECIFY (Duration: PLACEHOLDER - Details TBD)

### Owner: Any team member
### AI Support: Inna ("The Specifier")

### The Flow

**[PLACEHOLDER - Multi-step process being documented]**

This phase involves:
1. Client onboarding (with Maya's guidance)
2. Requirements gathering
3. Writing complete specifications with Inna (6 levels: PATTERN → BEHAVIOR_SPEC → VALIDATION → MECHANISM → ALGORITHM → GUIDE)
4. Locking scope via AC.md baseline
5. Creating DoD (Definition of Done) checklist

### What Gets Produced
- ✅ AC.md (Acceptance Criteria)
- ✅ DoD checklist
- ✅ Architecture notes
- ✅ Deployment guide
- ✅ Test plan

### When to Escalate
- ✅ **DO escalate:** Client unclear on requirements → Telegram NLR
- ✅ **DO escalate:** Client requests change and you don't know if it's Swap or Add → Telegram NLR

---

## Phase 3: BUILD (2 days simple, 5 days complex)

### Owner: Any team member
### AI Support: Rafael ("The Guide")

### The Flow

**Step 1: Read Specs (Team member, 30 min)**
- Read complete specs from Phase 2
- Check AC.md (what must work)
- Check DoD checklist (how we verify it works)
- Review architecture notes
- Check deployment guide

**Step 2: Generate Code (Rafael, AI, instant)**

Team member asks Rafael via Claude Code:
```
"Rafael, generate implementation for Mission #47 per specs at
/path/to/specs/AC.md"
```

Rafael returns:
- ✅ Complete file structure
- ✅ All code files
- ✅ Dependencies (package.json, requirements.txt)
- ✅ Configuration (.env.example)
- ✅ Deployment instructions

**Step 3: Review & Test Locally (Team member, 2-4 hours)**
- Create project from Rafael's code
- Install dependencies
- Run locally
- Test against AC.md criteria
- Fix any obvious issues

**Step 4: Deploy (Team member, 1-2 hours)**
- Deploy to Vercel (frontend) or Render (backend)
- Configure environment variables
- Test deployed version
- Verify all AC.md criteria pass on production

**Step 5: Update SYNC.md (Team member)**
```markdown
## 2025-11-05 14:30 - [Your Name]: Mission #47 Deployed

**Status:** Deployed to production, ready for QA
**URL:** https://client-project.vercel.app
**What works:** All 5 AC.md criteria tested and passing
**Next:** QA testing
**Link:** [path to mission folder]
```

### Duration
- **Simple (landing page, bot):** 2 days
- **Medium (CRUD dashboard, API integration):** 3-4 days
- **Complex (multi-feature app):** 5 days

### When to Escalate

**If stuck >1 hour:**
1. Try asking Rafael first: `"Rafael, I'm getting this error: [paste error]. I tried [X]. What should I do?"`
2. If still stuck after Rafael's guidance → **Telegram NLR** (include error, what you tried, Rafael's suggestion)
3. If truly urgent/blocking → **Call NLR**

**Common issues Rafael can fix:**
- ✅ Deployment errors
- ✅ Environment variable configuration
- ✅ API integration issues
- ✅ Database connection problems
- ✅ Build failures

---

## Phase 4: TEST (2-4 hours)

### Owner: Any team member (QA role)
### AI Support: Sofia ("The Checker")

### The Flow

**Step 1: Receive Handoff (QA team member)**

Builder updates SYNC.md → QA team member sees notification

**Step 2: Get QA Checklist (QA team member + Sofia)**

Ask Sofia via Claude Code:
```
"Sofia, verify Mission #47 ready for delivery. Specs at
/path/to/specs/AC.md"
```

Sofia returns:
- ✅ DoD checklist from specs
- ✅ AC.md criteria to verify
- ✅ Performance thresholds to check
- ✅ Test URLs and credentials

**Step 3: Manual Testing (QA team member, 1-2 hours)**
- Test every AC.md criterion
- Try to break it (edge cases)
- Check mobile responsiveness
- Verify performance (fast enough?)
- Test error handling

**Step 4: Document Findings**

**If bugs found:**
- Screenshot the bug
- Write clear reproduction steps
- Update SYNC.md with findings
- **Talk directly to builder** (not NLR, not Rafael)

**If all passes:**
- Update SYNC.md: "QA passed ✅"
- Screenshot proof of working features
- Sign off DoD checklist

### Duration: 2-4 hours
- Simple: 2 hours
- Complex: 4 hours

### Bug Fix Loop

```
QA finds bug
    ↓
Talks to builder (in-person or Telegram)
    ↓
Builder fixes (with Rafael's help if needed)
    ↓
Builder deploys fix
    ↓
QA re-tests ONLY the fixed part
    ↓
If still broken: repeat
If fixed: continue QA
```

### When to Escalate
- ❌ **DON'T escalate:** Bug found → Talk to builder directly
- ✅ **DO escalate:** Bug is critical AND builder can't fix in 2 hours → Telegram NLR

---

## Phase 5: DELIVER (~1 day)

### Owner: Any team member (Client relations role)
### AI Support: Maya ("The Bridge")

### The Flow

**Step 1: Prepare Delivery Package (Team member + Maya)**

Ask Maya:
```
"Maya, create delivery presentation for Mission #47 client. Demo URL:
[URL]. AC.md at [path]."
```

Maya provides:
- ✅ Demo script (what to show, in what order)
- ✅ Key deltas to highlight (before/after)
- ✅ Handoff documentation template
- ✅ Post-delivery check-in message template

**Step 2: Present to Client (Team member, 30 min call)**
- Show demo (following Maya's script)
- Highlight quantified deltas
- Provide credentials + documentation
- Explain support plan

**Step 3: NLR Final Review (NLR, 15 min)**
- Check SYNC.md status
- Verify QA passed
- Quick visual check of deployed site
- Approve delivery ✅

**Step 4: Client Accepts**
- [PLACEHOLDER: Payment flow details TBD]
- [PLACEHOLDER: Team payment distribution TBD]

**Step 5: Post-Delivery Check-in (Team member + Maya, 1 week later)**

Maya provides message template:
```
Hi [Client Name],

It's been a week since we delivered [Project Name]. Quick check-in:

1. How's everything working?
2. Any questions or issues?
3. If you're happy with the work, would you be open to providing a brief
   testimonial?

[Name]
```

### Duration: ~1 day (including waiting for client response)

### When to Escalate
- ✅ **DO escalate:** Client unhappy/requests major changes → Telegram NLR immediately
- ✅ **DO escalate:** Client requests scope change → Team member decides Swap/Add (unless unsure, then ask NLR)

---

## SYNC.md Update Triggers

Update SYNC.md **after any significant event**, not daily. "Significant" means:

✅ **DO update:**
- Proposal sent
- Job won
- Specs completed
- Deployment live
- Bug found in QA
- Bug fixed
- QA passed
- Client presented
- Client accepted
- Payment received
- **Blocked >1 hour**

❌ **DON'T update:**
- "Still working on it" (unless blocked)
- Minor progress updates
- Daily check-ins

**Rule:** Every 1-2 meaningful messages, update SYNC.md

---

## Decision Points Reference

### "Who do I ask?"

| Situation | Ask | Why |
|-----------|-----|-----|
| Stuck on code error <1 hour | Rafael (AI) | He debugs instantly |
| Stuck on code error >1 hour | NLR (Telegram/Call) | Need human guidance |
| Bug found in QA | Builder directly | They're the implementer |
| Client question (technical) | Rafael or NLR | Depends on complexity |
| Client question (scope/timeline) | Team member handling client (with Maya's help) | Whoever owns that mission |
| Client requests change | Team member decides Swap/Add | Unless unclear, then NLR |
| Should I take this job? | Emma (AI) | She evaluates fit |
| How should I price this? | Alexis (AI) | She guides pricing strategy |
| How do I write specs? | Inna (AI) | She generates complete docs |
| Is this ready for delivery? | Sofia (AI) | She verifies DoD |

---

## Common Failure Modes & How to Avoid

### Failure Mode 1: "I Don't Know What to Do Next"
**Symptom:** Finished a phase, not sure who to hand off to
**Fix:** Check the phase diagram at top → See next phase owner → Update SYNC.md with handoff

### Failure Mode 2: "I'm Stuck and Wasting Time"
**Symptom:** Been stuck >1 hour, haven't asked for help
**Fix:**
1. Try Rafael first (ask specific question with error/context)
2. Still stuck after 30 min? → Telegram NLR
3. Urgent? → Call NLR

### Failure Mode 3: "Client Changed Requirements Mid-Mission"
**Symptom:** Client wants something different from AC.md
**Fix:**
1. Team member handling client decides: is this Swap (equal/lower complexity, €0) or Add (new milestone, priced)?
2. If Swap: Update AC.md, continue
3. If Add: Create new milestone, get client approval, schedule separately
4. If unsure which: Telegram NLR

### Failure Mode 4: "QA Found Critical Bug Right Before Delivery"
**Symptom:** Bug breaks core functionality, delivery is tomorrow
**Fix:**
1. QA team member talks to builder immediately (don't wait)
2. Builder asks Rafael for fix
3. If fixable in <2 hours: fix, re-test, deliver
4. If not fixable quickly: Telegram NLR + postpone delivery 1 day

---

## Day-in-the-Life Example: $500 Landing Page Mission

### Day 1 Morning: Acquire
- **09:00** - Team member searches Upwork, finds 8 jobs
- **09:02** - Pastes results to Emma
- **09:03** - Emma returns: "6 NO-GO, 2 STRONG GO"
- **09:05** - Team member opens STRONG GO #1, copies full description
- **09:06** - Pastes to Emma: "Write proposal"
- **09:07** - Emma returns complete proposal
- **09:08** - Team member reviews, submits
- **09:10** - Repeats for STRONG GO #2
- **Total time:** 10 minutes, 2 proposals sent

### Day 1 Afternoon: Specify
- **14:00** - Client accepts proposal! 🎉
- **14:05** - Team member gets notification
- **14:10** - [PLACEHOLDER: Specification process details TBD]
- **16:00** - Specs complete, AC.md locked

### Day 2-3: Build
- **Day 2, 10:00** - Team member reads specs
- **10:30** - Asks Rafael: "Generate implementation"
- **10:45** - Rafael returns complete Next.js code
- **11:00-13:00** - Team member reviews, sets up project, tests locally
- **14:00** - Deploys to Vercel
- **14:30** - Tests deployed version, all AC.md criteria pass
- **14:45** - Updates SYNC.md: "Ready for QA"

### Day 4 Morning: Test
- **09:00** - Team member sees SYNC.md update
- **09:15** - Asks Sofia for QA checklist
- **09:20** - Tests all AC.md criteria
- **10:30** - Bug found: Mobile menu doesn't close when clicking link
- **10:35** - Talks to Team member: "Mobile menu bug, repro steps: [...]"
- **10:50** - Team member asks Rafael for fix
- **11:00** - Rafael provides fix
- **11:15** - Team member deploys fixed version
- **11:20** - Team member re-tests mobile menu
- **11:25** - Bug fixed ✅
- **11:30** - Completes rest of QA
- **12:00** - Updates SYNC.md: "QA passed ✅"

### Day 4 Afternoon: Deliver
- **14:00** - Team member asks Maya for delivery script
- **14:15** - Schedules demo call with client
- **14:30** - Presents demo (15 min)
- **14:45** - Client loves it! ✅
- **15:00** - NLR reviews (15 min), approves
- **15:30** - [PLACEHOLDER: Payment received]

### Day 11: Follow-up
- **Team member sends Maya's check-in message**
- Client responds: "Working great! Here's a testimonial..."
- 🎉 Mission complete!

---

## Visual Swimlane Diagram

[PLACEHOLDER: Interactive diagram to be added with avatars]

```
PHASE 1: ACQUIRE (~2 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team member  │ [Search Upwork] → [Copy results] → [Paste to Emma]
Emma (AI)  │ ........................ [Analyze jobs] → [Select STRONG GO]
Team member  │ ........................ [Open job] → [Copy full description]
Emma (AI)  │ ........................ [Write proposal + JSON + Telegram]
Team member  │ ........................ [Review] → [Submit] ✅

PHASE 2: SPECIFY (TBD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team member   │ [Onboard client] → [Gather requirements]
Inna (AI)  │ ........................ [Write 6-level docs]
Team member   │ ........................ [Review] → [Lock scope] ✅

PHASE 3: BUILD (2-5 days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team member       │ [Read specs] → [Ask Rafael]
Rafael (AI)│ ........................ [Generate complete code]
Team member       │ ........................ [Review] → [Test] → [Deploy] → [SYNC update] ✅

PHASE 4: TEST (2-4 hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team member  │ [Ask Sofia for checklist]
Sofia (AI) │ ........................ [Generate QA checklist]
Team member  │ ........................ [Manual testing]
           │ → Bug found? → [Talk to Team member] → Team member fixes → Re-test
           │ → All pass? → [SYNC update: QA passed] ✅

PHASE 5: DELIVER (~1 day)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Team member   │ [Ask Maya for demo script]
Maya (AI)  │ ........................ [Generate delivery package]
Team member   │ ........................ [Present demo to client]
NLR        │ ........................ [Final review 15 min] → [Approve]
Client     │ ........................ [Accept] → [Payment] 🎉
Team member   │ ........................ [1 week later: check-in + testimonial request]
```

---

## Handoff Checklists

*Note: This article shows WHO and WHEN. For detailed WHAT (specific handoff criteria), see the specialized articles on each role.*

### Team member → Team member (Job Won)
- ✅ Job URL
- ✅ Emma's proposal JSON (has all client context)
- ✅ Client's Upwork profile link
- ✅ Budget confirmed

### Team member → Team member (Specs Ready)
- ✅ AC.md (acceptance criteria)
- ✅ DoD checklist
- ✅ Architecture notes
- ✅ Deployment guide
- ✅ Test credentials (if needed)
- ✅ SYNC.md updated

### Team member → Team member (Ready for QA)
- ✅ Deployed URL (production)
- ✅ Test credentials
- ✅ What to test (AC.md criteria)
- ✅ Known issues (if any)
- ✅ SYNC.md updated

### Team member → Team member (QA Passed)
- ✅ All AC.md criteria tested ✅
- ✅ Screenshots of key features working
- ✅ DoD checklist signed off
- ✅ SYNC.md updated

### Team member → NLR (Ready for Approval)
- ✅ Demo prepared
- ✅ QA passed
- ✅ Client scheduled for presentation
- ✅ SYNC.md shows green status

---

## Quiz: Test Your Understanding

**Scenario 1:** You're Team member. You deployed the app but get a weird error you've never seen. You've been stuck for 45 minutes. What do you do?

<details>
<summary>Show Answer</summary>

**Correct action:**
1. Ask Rafael with specific context: "Rafael, I'm getting this error: [paste error]. I tried [X and Y]. What should I do?"
2. If Rafael's solution doesn't work after 30 min → Telegram NLR with: error, what you tried, Rafael's suggestion

**Why:** Rafael can debug most issues instantly. Only escalate to NLR if Rafael can't solve it.
</details>

---

**Scenario 2:** You're Team member doing QA. You find a bug where the contact form doesn't send emails. What do you do?

<details>
<summary>Show Answer</summary>

**Correct action:**
1. Screenshot the bug
2. Write reproduction steps
3. Talk directly to Team member (don't go through NLR or Rafael first)
4. Team member will fix (with Rafael's help if needed)
5. Team member will let you know when to re-test

**Why:** Team member is the implementer. She owns the fix. Going through NLR wastes time.
</details>

---

**Scenario 3:** You're Team member. Mid-implementation, the client says "Can we also add a blog section?" What do you do?

<details>
<summary>Show Answer</summary>

**Correct action:**
1. Check AC.md: Is "blog section" in scope?
2. If NO → This is a change request
3. Decide: Is this Swap (replace something with blog, same complexity) or Add (new milestone)?
4. If SWAP: Update AC.md, tell Team member, continue
5. If ADD: Create new milestone, price it, get client approval before scheduling
6. If you're unsure which → Telegram NLR for guidance

**Why:** Team member owns scope decisions. But if unclear, NLR helps decide.
</details>

---

## Next Steps

Now you understand **WHO does WHAT WHEN**. Next articles cover:

1. **How to Talk to AI Citizens** - Get 3-5x faster by asking good questions
2. **What Good Documentation Looks Like** - So Rafael generates correct code first time
3. **Testing Mindset: AC Green or It Didn't Happen** - How Sofia checks your work

**Ready to start?** Ask NLR to assign you your first shadow mission (watch someone else's mission end-to-end).

---

## Quick Reference Card (Print & Keep)

```
┌─────────────────────────────────────────────────────────┐
│ STUCK? WHO TO ASK                                       │
├─────────────────────────────────────────────────────────┤
│ Code error <1hr        → Rafael (AI)                    │
│ Code error >1hr        → NLR (Telegram)                 │
│ Bug in QA              → Team member (direct)                  │
│ Client question        → Team member (with Maya/Rafael)    │
│ Scope change           → Team member decides (or NLR)      │
│ Job evaluation         → Emma (AI)                      │
│ Pricing guidance       → Alexis (AI)                    │
│ Ready for delivery?    → Sofia (AI)                     │
├─────────────────────────────────────────────────────────┤
│ ESCALATION RULE                                         │
│ Stuck >1 hour? → Try AI first → Still stuck? → NLR     │
│ Urgent/blocking? → Call NLR                             │
└─────────────────────────────────────────────────────────┘
```

---

*This article is part of ScopeLock Team Onboarding. Questions? Ask in Telegram @nlr_ai*
