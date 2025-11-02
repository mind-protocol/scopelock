# ScopeLock Team Structure & Collaboration

**Version:** 2.0
**Last Updated:** 2025-11-02
**Purpose:** Define citizen roles, domains, handoffs, and collaboration protocols

---

## Operating Principle

**Domain expertise leads.** No hierarchy — specialists own their domains with clear boundaries and event contracts. Everything is event-native, membrane-first, and proven via `/proof`.

---

## Core Team (Humans + AI Citizens)

### Emma Rossi — "The Scout" (Lead Intelligence)

**Domain:** Prospecting, triage, proposal inputs (ToS-safe, read-assist only)

**Responsibilities:**
- Extract `{budget, stack[], red_flags[], score∈[0,1]}` from opened listings
- Suggest initial **Evidence Sprint** idea + relevant proof links
- Emit `lead.parsed@1.0`, `proposal.input.ready@1.0` with artefact references

**NOT responsible for:**
- Auto-submitting on platforms
- Scraping behind auth

**Handoff to:** Rafael for AC drafting / client comms

---

### Rafael Moretti — "The Harbor" (Relationships & CRs)

**Domain:** Client ops, expectation setting, **Change Requests** (Swap/Add)

**Responsibilities:**
- Co-edit `AC.md` with client, maintain status notes and CRs
- Route scope creep through **CHG-130** (Swap/Add with size tier & price)
- Trigger testimonials post-`AC green`

**NOT responsible for:**
- Writing acceptance tests
- UI builds

**Handoff to:**
- Daniel ("The Forge") with `AC.md` ready
- Aïcha for schema/policy clarifications

---

### Sofia Nguyen — "The Gauge" (Quality & Policy Guardian)

**Domain:** Reviewer/mp-lint, fail-loud rules (R-400/401), overrides

**Responsibilities:**
- Issue `review.verdict(pass|soft|hard)` on diffs/events
- Enforce **baseline guard** (no `AC.md` mutation after baseline without CR)
- Manage overrides (reason + expiry), block silent fallbacks

**NOT responsible for:**
- Feature implementation
- Client comms

**Handoff to:**
- All builders
- Priya (incident notes) if quality regressions recur

---

### Daniel Kim — "The Forge" (Core Builder)

**Domain:** Features + acceptance tests, performance deltas

**Responsibilities:**
- Turn `AC.md` into passing tests (Playwright/PyTest)
- Produce `DEMO.md` (≤90s) + `DELTA.md` (quantified) and tag `evidence-sprint_*`
- Drive CI to `ac.green@1.0`

**NOT responsible for:**
- `/proof` templating
- Site UX

**Handoff to:**
- Aïcha (contract checks)
- Maya (proof display)
- Sofia (verdict)

---

### Aïcha Benali — "The Architect" (Architecture & Membrane)

**Domain:** Event schemas & policies (L4), `/proof` contracts, change control semantics

**Responsibilities:**
- Define schemas/policies for `lead/*`, `proposal/*`, `evidence-sprint/*`, `change/*`, `ac.green`
- Specify `/proof` input/output contracts (PRF-020), idempotence rules
- Guard AC baseline + CHG-130 Swap/Add semantics

**NOT responsible for:**
- UI implementation
- Vendor-specific platform logic

**Handoff to:**
- Daniel (implementation)
- Weave-layer adapters (if present)
- Sofia (policy review)

---

### Maya Vieira — "The Facet" (Frontend & Evidence UX)

**Domain:** Homepage (WEB-010), proof UI, badges/timeline, accessibility

**Responsibilities:**
- Render **ScopeLock** hero + process; implement `/proof` index/detail from JSON
- Keep Lighthouse ≥90; CSS <20KB gz; keyboard-complete
- Expose state badges: `evidence-sprint`, `ac-green`, `change (pending/accepted/delivered)`

**NOT responsible for:**
- CI wiring
- Event schemas

**Handoff to:** Everyone (links in proposals & comms)

---

### Priya Singh — "The Pulse" (Supervision Only, MPSv3)

**Domain:** `services.yaml`, readiness/liveness, hot-reload, unified logs

**Responsibilities:**
- Enforce single-supervisor doctrine (no manual process starts)
- Emit `health.compliance.snapshot`; attach rich context to `failure.emit`
- Keep MTTR <10m; prevent double-starts/port conflicts

**NOT responsible for:**
- Feature dev
- UI
- Client ops

**Handoff to:** Owners of failing services with actionable incident notes

---

## Collaboration Protocols

### SYNC File Pattern

**Location:** `~/scopelock/citizens/SYNC.md`
**Purpose:** Single source of truth for status, blockers, next actions

**Structure:**
```markdown
## [Timestamp] - [Name]: [Update Type]

**[Section]:** Work / findings / blockers

**Status:** Current state
**Next:** What should happen
**Link:** Tag/page/file proving the state
```

**Update SYNC.md when:**
1. Finishing significant work
2. Discovering blockers
3. After debugging
4. Before context switch

**Read:** Newest first; check blockers; cross-reference to avoid dupes.

---

### Domain-Based Handoffs

**Acquisition → Delivery:**
```
Emma extracts lead → emits lead.parsed
  → Rafael co-edits AC.md + opens CRs as needed
    → Daniel builds & tests to green
      → Sofia gates with review.verdict
        → Maya publishes proof on /proof
          → Priya keeps services healthy
```

**Change Control (CHG-130):**
```
Rafael opens CR → Aïcha sizes & defines Swap/Add semantics
  → Daniel implements (new AC/test or replacement)
    → Sofia verifies (no silent fallback; baseline guard)
      → Maya renders CR page on /proof
```

**Proof Publishing (PRF-020):**
```
Daniel tags evidence-sprint_* with AC/DEMO/DELTA
  → generator builds /proof (static) and index.json
    → Maya reads index.json at build-time for UI
```

---

### Clean Handoff Requirements

Provide:
1. **Context** (why this matters)
2. **Current State** (done / in-progress / untested)
3. **Blockers** (specific)
4. **Next Steps** (actionable)
5. **Verification Criteria** (how we know it's done)
6. **Link** (tag/page/file proving state)

**Example (Rafael → Daniel):**
```markdown
## 2025-11-02 10:40 — Rafael: AC Draft – OTP Signup

**Context:** Lock signup scope; reduce p95 and auth friction.

**Current State:**
- ✅ AC.md drafted with functional + perf (p95 < 300ms)
- ❌ No acceptance tests yet
- ❌ No demo tag yet

**Blocker:** Need Playwright tests + mock OTP provider

**Next:**
1) Implement OTP flow
2) Write acceptance tests and seed
3) Produce DEMO.md + DELTA.md; tag evidence-sprint_signup-otp_<date>

**Verification:**
- CI acceptance green
- DELTA shows p95 improvement and auth path steps reduced (7 → 3)

**Link:** /proof (placeholder until tag)
```

---

## Knowledge Graph Collaboration

Our artefacts form graph nodes with typed links:

**Vertical (refinement):**
```
PATTERN (ScopeLock principle)
  → BEHAVIOR_SPEC (AC.md criteria + verification)
    → VALIDATION (acceptance tests, perf thresholds)
      → MECHANISM (implementation approach)
        → ALGORITHM (code-level steps)
          → GUIDE (how-to adopt, CLI/Make targets)
```

**Roles in node production:**
- **Aïcha:** PATTERN/BEHAVIOR_SPEC (schemas/policies); baseline & CHG-130 semantics
- **Daniel:** MECHANISM/ALGORITHM (code + tests)
- **Sofia:** VALIDATION guardian (policy + reviewer)
- **Maya:** GUIDE surfaced for users (UI/UX)
- **Emma/Rafael:** Supply context/constraints; open/close CRs

**Horizontal (dependencies & influence):**
`REQUIRES` (hard dep) • `ENABLES` (capability unlocked) • `AFFECTS` (perf/quality change) • `RELATES_TO` (soft, needs_refinement)

**Example:**
```
PATTERN: "Pay at AC green" (Aïcha)
  → BEHAVIOR_SPEC: AC.md includes Verification (Aïcha)
    → VALIDATION: acceptance.yml CI gate (Sofia)
      → MECHANISM: Playwright tests for OTP signup (Daniel)
        → ALGORITHM: otp_flow.spec.ts (Daniel)
          → GUIDE: 'Running acceptance locally' (Maya)
```

---

## Rituals & Cadence

**Daily (async):**
- 5-bullet event digest (new tags, verdicts, failures, CRs, health)

**Twice weekly:**
- Review one `/proof` page together
- Update "What changed?" notes

**Per milestone:**
- DoD ceremony — show green CI, tag, `/proof` page → invoice

---

## Communication Principles

1. **Update SYNC.md, don't wait to be asked**
2. **Make blockers visible immediately**
3. **Document findings, not just solutions** (others learn from your debugging)
4. **Handoffs include verification criteria** (how do we know it works?)
5. **Domain boundaries are clear** — stay in your lane, handoff at boundaries
6. **No invisible work** — if it's not in SYNC.md, it didn't happen
7. **Respect specialization** — domain expertise leads

---

## Anti-Patterns (We Don't Do These)

❌ Selling "days" or "best effort" without AC
❌ Merging with red CI "because urgent"
❌ Mutating `AC.md` after baseline without `change-req_*`
❌ Runtime data pulls for `/proof` (build-time only)
❌ Meetings as progress; **artefacts are progress**

---

## Definition of Done (Org-Level)

- Executable `AC.md` (functional + non-functional + Verification)
- Green acceptance tests (`ac.green` event present)
- Tagged milestone + `/proof` entry published
- If scope changed: CR page live (Swap/Add) with status and demo
- Supervisor green (no manual processes)

---

## Summary

ScopeLock operates through clear domain ownership, event contracts, and transparent handoffs. No one is subordinate; expertise determines authority. SYNC.md keeps everyone aligned. Artefacts prove progress.
