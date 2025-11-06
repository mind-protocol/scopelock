# ScopeLock Mission Documentation

**Purpose:** Per-mission documentation following the 6-level knowledge graph hierarchy

**Owner:** Inna (The Specifier)

---

## What is a Mission?

A **mission** is a client project or feature set that goes through the ScopeLock delivery process:
1. ScopeLock (scope definition via AC.md)
2. Evidence Sprint (90s demo + delta)
3. Build to AC Green (all tests passing)

Each mission requires complete documentation before implementation begins.

---

## 6-Level Documentation Hierarchy

Inna writes documentation at 6 levels, from principles to deployment guides:

```
PATTERN (Why this approach?)
  ↓
BEHAVIOR_SPEC (What must work? AC.md)
  ↓
VALIDATION (How do we verify? Tests)
  ↓
MECHANISM (What's the architecture?)
  ↓
ALGORITHM (What are the code-level steps?)
  ↓
GUIDE (How do we deploy/adopt?)
```

Plus **DoD** (Definition of Done) checklist derived from BEHAVIOR_SPEC.

---

## How to Use This Structure

### When Starting a New Mission

1. **Copy the template:**
   ```bash
   cp -r docs/missions/_template docs/missions/[mission-name]
   ```

2. **Write in order:**
   - Start with `PATTERN.md` (principles, risks, success criteria)
   - Then `AC.md` (acceptance criteria - BEHAVIOR_SPEC)
   - Then `VALIDATION.md` (test specifications)
   - Then `MECHANISM.md` (architecture, tech choices)
   - Then `ALGORITHM.md` (implementation steps)
   - Then `GUIDE.md` (setup, deployment)
   - Finally `DOD.md` (derived from AC.md)

3. **Lock scope:**
   ```bash
   git tag -a "ac-baseline_[mission-name]_YYYY-MM-DD" -m "Scope locked"
   git push origin --tags
   ```

4. **TDD Workflow (Tests First!):**
   - Sofia generates executable test code from VALIDATION.md (pytest, Vitest, Playwright)
   - Tests define quality criteria BEFORE implementation begins
   - Rafael generates implementation from MECHANISM + ALGORITHM to pass Sofia's tests
   - Developer runs Sofia's tests locally, reviews, and deploys per GUIDE
   - Sofia verifies deployment using her test suite + DOD

---

## File Descriptions

### PATTERN.md
**Purpose:** Core principles for this specific mission

**Content:**
- Why ScopeLock approach for this mission?
- Project-specific principles (e.g., "HIPAA-first", "Real-time <50ms")
- Risk factors and mitigation strategies
- Success criteria (business outcomes)

---

### AC.md (BEHAVIOR_SPEC)
**Purpose:** Executable acceptance criteria

**Content:**
- **Functional criteria:** What features must work? (testable, specific)
- **Non-functional criteria:** Performance (p95 latency), quality (error rate), uptime
- **Verification section:** Exact test commands, seed data, expected outputs

**Critical:** This file gets locked via baseline tag. Changes after baseline require Change Request (CHG-130).

---

### VALIDATION.md
**Purpose:** Test specifications mapped to AC.md

**Content:**
- Test framework selection (Playwright? Jest? pytest?)
- Test file structure and naming conventions
- Specific test scenarios mapped to AC.md sections
- Performance test specifications
- CI/CD integration requirements

**TDD Workflow:** Sofia generates executable test code (pytest, Vitest, Playwright) from these specifications BEFORE Rafael starts implementation. Tests define quality; implementation makes tests pass.

---

### MECHANISM.md
**Purpose:** High-level architecture and tech choices

**Content:**
- Architecture overview (components, data flow)
- Technology stack (why Next.js vs Django? why Vercel vs Render?)
- Database schema (if applicable)
- API design (endpoints, payload structure)
- External integrations (third-party APIs, services)
- Security approach (auth, data protection)

**Note:** Must follow standard ScopeLock stack unless exceptions approved. See `docs/core/tech-stack.md`.

---

### ALGORITHM.md
**Purpose:** Code-level implementation steps

**Content:**
- Detailed implementation steps for each feature
- Code-level logic (clear pseudocode/steps, not full code)
- Data transformations
- Error handling strategies
- Edge cases handling

**For Rafael:** This is what Rafael uses to generate code.

---

### GUIDE.md
**Purpose:** How to deploy and adopt

**Content:**
- Local development setup (exact commands)
- Environment variables needed
- Deployment steps (platform-specific)
- Testing locally
- Troubleshooting common issues

**Critical:** All commands must be copy-paste executable. No placeholders.

---

### DOD.md (Definition of Done)
**Purpose:** Checklist derived from BEHAVIOR_SPEC

**Content:**
- Documentation complete checklist
- Implementation ready checklist
- Acceptance criteria locked checklist
- Test specifications ready checklist
- Deployment ready checklist

**For Sofia:** This is what Sofia uses to verify mission is ready for delivery.

---

## Mission Folder Structure

After creating from template:

```
docs/missions/[mission-name]/
├── PATTERN.md          # Principles, risks, success criteria
├── AC.md               # Acceptance criteria (BEHAVIOR_SPEC)
├── VALIDATION.md       # Test specifications
├── MECHANISM.md        # Architecture, tech choices
├── ALGORITHM.md        # Implementation steps
├── GUIDE.md            # Setup, deployment, troubleshooting
└── DOD.md              # Definition of Done checklist
```

Optional (for Change Requests):
```
└── CR-001.md           # Change Request 001 (Swap or Add decision)
```

---

## Standard Tech Stack

**Before writing MECHANISM.md, verify:**
- Are you using the standard ScopeLock stack? (Next.js/Vercel, Python/Render, PostgreSQL/Airtable)
- If deviating, have you documented WHY in PATTERN.md?
- If deviating, have you gotten NLR approval?

**See:** `docs/core/tech-stack.md` for full stack reference.

---

## Change Requests (CHG-130)

If client requests scope change after AC baseline:

1. **Inna analyzes:** Swap (€0, same milestone) or Add (new milestone, priced)?
2. **If Swap:** Update AC.md section, mark with comment
3. **If Add:** Create `docs/missions/[mission-name]/CR-001.md` with decision
4. **Document:** Why Swap or Add, complexity analysis, updated docs

---

## Success Metrics

**Mission documentation is complete when:**
- ✅ All 6 levels written (PATTERN → GUIDE)
- ✅ DoD checklist complete
- ✅ Sofia can generate test code from VALIDATION.md without asking questions (TDD: tests first!)
- ✅ Rafael can generate implementation code from ALGORITHM.md without asking questions
- ✅ Developer can run Sofia's tests and deploy using GUIDE commands

**If any fails, documentation is incomplete. Do not hand off to Sofia/Rafael.**

---

## Examples

(As missions are completed, example folders will be added here)

```
docs/missions/
├── _template/          # Copy this for new missions
├── example-mission-1/  # (Future: first completed mission)
└── example-mission-2/  # (Future: second completed mission)
```

---

## Questions?

- **For mission documentation process:** Ask Inna
- **For standard tech stack:** See `docs/core/tech-stack.md`
- **For DoD format:** See `docs/core/definition-of-done-template.md`
- **For ScopeLock methodology:** See `docs/core/delivery_model.md`
