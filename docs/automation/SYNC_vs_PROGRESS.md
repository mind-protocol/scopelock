# SYNC.md vs PROGRESS.md — What's the Difference?

**TL;DR:**
- **SYNC.md** = Real-time work log for citizen collaboration
- **PROGRESS.md** = Project tracker for automation features

Both are essential but serve different purposes.

---

## SYNC.md — Collaboration Work Log

**Location:** `/citizens/SYNC.md`

**Purpose:** Single source of truth for **current work status**, blockers, and handoffs between citizens

**Updated by:** All citizens (Emma, Rafael, Daniel, Sofia, Maya, Aïcha, Priya, Nicolas)

**Updated when:**
- Finishing significant work
- Discovering blockers
- After debugging
- Before context switch

**Read by:** Other citizens to see current state and avoid duplicate work

**Structure:**
```markdown
## [Timestamp] - [Name]: [Update Type]

**[Section]:** Work / findings / blockers

**Status:** Current state
**Next:** What should happen
**Link:** Tag/page/file proving the state
```

**Example Entry:**
```markdown
## 2025-11-02 14:30 - Nicolas: Automation Spec — Feature 1

**Work:** Started implementing proof regeneration automation

**Status:** Modified package.json build script, testing locally
**Next:** Push to Vercel, verify proof pages regenerate on tag push
**Link:** /home/mind-protocol/scopelock/package.json

**Blocker:** Need to verify Vercel build environment fetches git tags correctly
```

---

## PROGRESS.md — Automation Project Tracker

**Location:** `/docs/automation/PROGRESS.md`

**Purpose:** Track TODO vs DONE status for **automation implementation project**

**Updated by:** Whoever is implementing automation features

**Updated when:**
- Starting a feature (⬜ TODO → 🟡 IN PROGRESS)
- Running acceptance tests (⬜ Not tested → ✅ Passed)
- Completing a feature (🟡 IN PROGRESS → ✅ DONE)

**Read by:** Anyone checking automation project status or implementing features

**Structure:**
```markdown
## Feature X: Name

**Status:** ⬜ TODO | 🟡 IN PROGRESS | ✅ DONE
**Time:** X/Yh
**Priority:** P0/P1/P2

### Implementation Checklist
- [ ] Task 1
- [ ] Task 2

### Acceptance Tests (X/Y passing)
# Test command
# Expected: ✅ Result
# Actual: ⬜ Not tested yet
```

**Example Entry:**
```markdown
## Feature 1: Auto-Regenerate Proof Pages

**Status:** 🟡 IN PROGRESS
**Time:** 1.5/2h
**Priority:** P0 (Week 1)

### Implementation Checklist
- [x] Update package.json build script
- [x] Test locally with npm run build:local
- [ ] Push to Vercel
- [ ] Verify proof pages regenerate on deploy

### Acceptance Tests (1/3 passing)

**V1: Proof regenerates on tag push**
# Expected: ✅ Returns 200 with proof HTML
# Actual: ✅ PASSED - Returns 200 OK

**V2: Index updates with new entry**
# Expected: ✅ Shows N+1 entries
# Actual: ⬜ Not tested yet
```

---

## When to Use Which

### Use SYNC.md when:

✅ **Reporting current work:**
- "I'm working on Feature 1 right now"
- "I just finished debugging the Vercel build"
- "I'm blocked waiting for API keys"

✅ **Handoffs between citizens:**
- "Daniel: Ready for Sofia's verdict on PR #42"
- "Emma: 20 leads evaluated, proposals ready for Rafael"
- "Rafael: Client approved AC.md, handoff to Daniel for implementation"

✅ **Real-time status updates:**
- "Sofia: Found silent fallback in commit abc123, blocking merge"
- "Priya: Service rafael-responder down, MTTR in progress"

✅ **Cross-citizen awareness:**
- Other citizens read SYNC.md to see what's happening NOW
- Prevents duplicate work ("oh, Daniel already started on tests")
- Enables collaboration ("I see Rafael is blocked on X, I can help")

---

### Use PROGRESS.md when:

✅ **Tracking automation project milestones:**
- "Feature 1 is 50% complete (1/2h spent)"
- "Features 1-3 are DONE, starting Feature 4 next week"
- "80% of automation features completed (8/10 features)"

✅ **Running acceptance tests:**
- "Feature 1: V1 passed, V2 passed, V3 not tested yet"
- "All tests for Features 1-3 are passing"

✅ **Planning next features:**
- "Week 1: Features 1-3 (P0 quick wins)"
- "Week 2: Feature 4 (Emma RSS - highest impact)"

✅ **Measuring ROI:**
- "9h invested so far, 7.2h/week savings achieved"
- "3 features DONE, 8 features TODO, 1.2 month payback period"

---

## How They Complement Each Other

**Scenario:** Implementing Feature 1 (Proof Regeneration)

### Day 1 - Start

**SYNC.md:**
```markdown
## 2025-11-02 09:00 - Nicolas: Automation — Starting Feature 1

**Work:** Beginning proof regeneration automation (P0 quick win)

**Status:** Reading spec at /docs/automation/01_proof_regeneration.md
**Next:** Modify package.json build script
**Link:** /docs/automation/PROGRESS.md (Feature 1 marked IN PROGRESS)
```

**PROGRESS.md:**
```markdown
## Feature 1: Auto-Regenerate Proof Pages

**Status:** 🟡 IN PROGRESS (started 2025-11-02 09:00)
**Time:** 0/2h
```

---

### Day 1 - Midday

**SYNC.md:**
```markdown
## 2025-11-02 12:00 - Nicolas: Automation — Feature 1 Progress

**Work:** Modified package.json, tested locally

**Status:** Local build works, proofgen runs successfully
**Next:** Push to Vercel, test production deploy
**Link:** commit abc123, package.json

**Blocker:** None
```

**PROGRESS.md:**
```markdown
## Feature 1: Auto-Regenerate Proof Pages

**Status:** 🟡 IN PROGRESS
**Time:** 1/2h

### Implementation Checklist
- [x] Update package.json build script
- [x] Test locally with npm run build:local
- [ ] Push to Vercel
- [ ] Verify proof pages regenerate on deploy
```

---

### Day 1 - End of Day

**SYNC.md:**
```markdown
## 2025-11-02 17:00 - Nicolas: Automation — Feature 1 DONE

**Work:** Deployed to Vercel, all tests pass

**Status:** Feature 1 complete, proof pages auto-regenerate on tag push
**Next:** Start Feature 3 (Lead Tracker) tomorrow
**Link:** /docs/automation/PROGRESS.md (Feature 1 marked DONE)

**Tests passed:**
- V1: Proof regenerates ✅
- V2: Index updates ✅
- V3: Missing files handled ✅
```

**PROGRESS.md:**
```markdown
## Feature 1: Auto-Regenerate Proof Pages

**Status:** ✅ DONE (completed 2025-11-02 17:00)
**Time:** 2/2h

### Implementation Checklist
- [x] Update package.json build script
- [x] Test locally with npm run build:local
- [x] Push to Vercel
- [x] Verify proof pages regenerate on deploy

### Acceptance Tests (3/3 passing)

**V1: Proof regenerates on tag push**
# Expected: ✅ Returns 200 with proof HTML
# Actual: ✅ PASSED - Returns 200 OK, HTML contains proof content

**V2: Index updates with new entry**
# Expected: ✅ Shows N+1 entries
# Actual: ✅ PASSED - Entry count increased by 1

**V3: Missing proof files handled gracefully**
# Expected: ✅ Shows "Missing files" chips
# Actual: ✅ PASSED - Renders placeholder with warning chips
```

---

## Summary Table

| Aspect | SYNC.md | PROGRESS.md |
|--------|---------|-------------|
| **Scope** | All work (any citizen, any task) | Automation project only |
| **Granularity** | Real-time updates (hourly/daily) | Milestone/feature level (weekly) |
| **Audience** | Other citizens (collaboration) | Project stakeholders (progress tracking) |
| **Lifetime** | Append-only (historical log) | Updated in-place (current state) |
| **Focus** | What I'm doing RIGHT NOW | What's TODO vs DONE overall |
| **When updated** | After each work session | When starting/completing features |
| **Primary question answered** | "What's happening now?" | "How far along are we?" |

---

## Quick Decision Guide

**Ask yourself:**

**"Am I reporting what I'm doing right now?"**
→ Use SYNC.md

**"Am I tracking whether a feature is complete?"**
→ Use PROGRESS.md

**"Do other citizens need to know my current status?"**
→ Use SYNC.md

**"Do I need to check which automation features are done?"**
→ Use PROGRESS.md

**"Did I just hit a blocker?"**
→ Use SYNC.md (immediate visibility)

**"Did I just finish all tests for a feature?"**
→ Use PROGRESS.md (mark tests ✅) + SYNC.md (announce completion)

---

## Both Files Are Essential

**SYNC.md** provides **real-time operational awareness** — the heartbeat of citizen collaboration.

**PROGRESS.md** provides **project-level tracking** — the scoreboard for automation implementation.

Use both. They complement each other perfectly.

**Example of perfect harmony:**
```markdown
# SYNC.md
## 2025-11-02 17:00 - Nicolas: Automation — Week 1 Complete

**Status:** P0 features (1-3) all DONE ✅
**Next:** Start Feature 4 (Emma RSS) on Monday
**Link:** /docs/automation/PROGRESS.md (shows 3/11 DONE, 27% complete)

# PROGRESS.md
**Total Progress:** 9/91h (10%)
Features DONE: 1, 2, 3 ✅
Time saved so far: 7.2h/week
```
