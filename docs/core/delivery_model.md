# ScopeLock Delivery Model

**Version:** 2.0
**Last Updated:** 2025-11-02
**Purpose:** Define how ScopeLock delivers against executable acceptance criteria

---

## Core Promise

**We lock the scope and deliver against executable acceptance criteria; clients pay at AC green.**

This eliminates ambiguity ("is it done?"), flips risk to us, and compounds trust via public proof.

---

## The Operating Pattern

### 1. ScopeLock Phase

**Input:** Client need or problem
**Output:** Frozen `AC.md` with baseline tag

**Process:**
- Co-edit `AC.md` with client
- Include **functional criteria** (what it does)
- Include **non-functional criteria** (performance p95, quality thresholds)
- Include **Verification section** (test command + seed data)
- Tag baseline: `ac-baseline_<milestone>_<date>`

**Definition of Ready:**
- Executable `AC.md` exists
- Functional + non-functional criteria specified
- Verification steps (tests + seed) documented
- Client and Rafael signed off
- Baseline tag created

**Guardrail:** After baseline tag, `AC.md` cannot change without a Change Request (CHG-130).

---

### 2. Evidence Sprint

**Input:** Baselined `AC.md`
**Output:** ≤90s demo + quantified delta + tag

**Process:**
- Build minimal viable implementation
- Produce `DEMO.md` (URL + 3 bullets describing what changed)
- Produce `DELTA.md` (2-3 quantified deltas: before → after)
- Tag: `evidence-sprint_<milestone>_<date>`

**Definition of Done:**
- Working demo accessible via URL
- Demo runtime ≤90 seconds
- `DELTA.md` shows 2+ quantified improvements
- `/proof/AC.md`, `/proof/DEMO.md`, `/proof/DELTA.md` in tag
- Tag pushed to repo

**Example DELTA.md:**
```markdown
## Signup Flow Delta

**Before:**
- p95 latency: 1200ms
- Steps to complete: 7
- Auth method: Email + password

**After:**
- p95 latency: 280ms (↓77%)
- Steps to complete: 3 (↓57%)
- Auth method: OTP (passwordless)
```

---

### 3. Build to AC Green

**Input:** Evidence Sprint tag
**Output:** All acceptance criteria passing + `ac-green` tag

**Process:**
- Implement full feature set per `AC.md`
- Run acceptance tests (specified in Verification)
- Performance tests must meet p95 thresholds
- Quality gates must pass (no silent fallbacks, reviewer verdict)
- Tag: `ac-green_<milestone>_<date>`

**Definition of Done:**
- All functional criteria satisfied
- All non-functional thresholds met (perf, quality)
- Acceptance tests green in CI
- Reviewer verdict: pass (Sofia)
- Tag pushed + `/proof` entry generated
- Invoice issued

**Payment Trigger:** `ac.green@1.0` event → invoice

---

### 4. Proof Log Publication

**Input:** Git tags with proof artefacts
**Output:** Static `/proof` site with index + detail pages

**Process:**
- Generator reads tags: `evidence-sprint_*`, `ac-green_*`, `change-*`
- Extracts `/proof/AC.md`, `/proof/DEMO.md`, `/proof/DELTA.md`, `/proof/CR.md`
- Generates static HTML + JSON (`/proof/index.json`)
- Publishes to site

**States Rendered:**
- `evidence-sprint` badge (accent color)
- `ac-green` badge (success color)
- `change (pending|accepted|delivered)` badge (warning → success)

**No Runtime Fetches:** All proof generated at build time.

---

## Change Control (CHG-130)

**Trigger:** Client wants to change scope after baseline

### Swap (€0, same milestone)

**When:**
- Replacement has equal or lower complexity
- Same milestone timeline
- No additional features

**Process:**
1. Rafael opens `change-req_<id>_<date>` tag
2. Aïcha sizes complexity
3. If Swap approved → update `AC.md`, same price
4. Deliver and tag `change-delivered_<id>_<date>`

### Add (new milestone, priced)

**When:**
- New functionality beyond original scope
- Increased complexity
- Additional features

**Process:**
1. Rafael opens `change-req_<id>_<date>` tag
2. Aïcha sizes + defines new milestone
3. Rafael prices and presents to client
4. Client accepts → new `AC.md` created
5. Follow full delivery pattern (Evidence Sprint → AC green)

**Events:**
```
change.requested@1.0
  → change.analyzed@1.0 {size, risk, swap|add}
    → change.priced@1.0
      → change.accepted@1.0 | change.declined@1.0
        → change.scheduled@1.0
          → change.delivered@1.0
```

**Proof Log:** Each CR renders to `/proof` with status chip, demo, AC, delta

---

## Quality Gates (Hard Stops)

### Executable AC
- `AC.md` has functional + non-functional criteria
- `AC.md` has Verification (test cmd + seed)
- Criteria are testable and measurable

### CI Acceptance
- Only green tests accept a milestone
- Performance p95 must meet threshold
- Quality policies must pass (R-400, R-401)

### Baseline Guard
- After `ac-baseline_*`, `AC.md` cannot mutate without CR
- CI fails if baseline violated without `change-req_*` tag

### Evidence Hygiene
- Each milestone has `DEMO.md` (URL + 3 bullets)
- Each milestone has `DELTA.md` (2+ quantified deltas)
- Demo runtime ≤90 seconds

---

## First Principles (Mind Protocol Aligned)

**Event-native, membrane-first:**
Emit/accept events; no secret pulls.

**Law at L4:**
Policies/schemas gate acceptance; edges are verifiable.

**Build-time proof, static runtime:**
`/proof` is generated; no live fetch.

**Fail-loud:**
Any catch either rethrows or emits `failure.emit{code_location}`.

**Quote-before-inject:**
Heavy ops require a compute quote/budget gate.

**Evidence > prose:**
Deltas & tags beat adjectives.

---

## Metrics (14-Day Targets)

**Acquisition (Emma):**
- 20 qualified leads
- Median parse→draft ≤30m
- Reply SLA <2h

**Client (Rafael):**
- CR TAT ≤24h
- 1 retained account
- ≥2 testimonials

**Quality (Sofia):**
- 0 silent fallbacks
- All merges gated by verdict

**Delivery (Daniel):**
- 2 Evidence Sprints live
- Both pass perf AC first replay

**Proof (Aïcha + Maya):**
- `/proof` online & deterministic
- Hero→proof CTR ≥35%

**Ops (Priya):**
- MTTR <10m
- 0 manual starts

---

## Anti-Patterns (We Don't Do These)

❌ Selling "days of work" or "best effort" without AC
❌ Merging red CI "because urgent"
❌ Mutating `AC.md` baseline without a `change-req_*` tag
❌ Runtime data pulls for `/proof`
❌ Meetings as progress — artefacts are progress

---

## Client FAQ

**Q: Price/outcome locked — what if I change my mind?**
A: Open a CR; either Swap (no price change) or Add (new milestone, priced). You still pay only at AC green.

**Q: How do I know when it's done?**
A: When acceptance tests pass and you see the `ac-green` tag + `/proof` entry.

**Q: What if tests fail at delivery?**
A: We don't invoice until green. Our risk, not yours.

**Q: Can I see progress before AC green?**
A: Yes — Evidence Sprint gives you a working demo ≤90s and quantified deltas early.

---

## Summary

ScopeLock is a contract you can see: criteria, events, and deltas. We keep scope clear, risk on us, and proof public. Clients pay only when tests pass. This model compounds trust and eliminates ambiguity.
