# ScopeLock Client Guide

**Version:** 2.0
**Last Updated:** 2025-11-02
**Purpose:** How to work with ScopeLock for predictable, verifiable delivery

---

## What ScopeLock Means for You

**Simple version:** We lock the scope, deliver against tests, and you pay only when those tests pass.

**What this eliminates:**
- "Is it done?" ambiguity
- Scope creep without clear choices
- Paying for broken work
- Wondering if you got what you paid for

**What this gives you:**
- Executable acceptance criteria (tests that prove it works)
- Evidence Sprints (see progress in ≤90s demos)
- Proof Log (public record of every milestone)
- Clear change control (know the price before committing)

---

## The Process (Your Journey)

### Phase 1: ScopeLock

**What happens:**
We co-write a document called `AC.md` (Acceptance Criteria) together. This is not a vague proposal — it's an executable contract.

**What's in AC.md:**
1. **Functional criteria** — What the system does
2. **Non-functional criteria** — Performance (p95 latency), quality thresholds
3. **Verification** — The exact tests that must pass + seed data to run them

**Your role:**
- Tell us what you need (we'll ask clarifying questions)
- Review and approve the criteria
- Sign off when you're confident we understand

**Our role:**
- Listen and ask the right questions
- Write testable, measurable criteria
- Show you examples from past projects
- Freeze the baseline with a git tag

**When this phase ends:**
- You see a `ac-baseline_<milestone>_<date>` tag
- Scope is locked
- Price is locked
- We begin building

**Time investment:** Usually 2-4 hours total (1-2 calls + async review)

---

### Phase 2: Evidence Sprint

**What happens:**
We build a minimal working version and show you quantified progress.

**What you receive:**
1. **Demo** — A working URL you can click through (≤90 seconds to see the value)
2. **Delta** — Quantified improvements (before → after numbers)

**Example delta:**
```
Signup flow p95: 1200ms → 280ms (↓77%)
Steps to complete: 7 → 3 (↓57%)
Auth method: Email+password → OTP (passwordless)
```

**Your role:**
- Test the demo
- Give feedback
- Confirm we're on the right track

**Our role:**
- Build fast, show working software early
- Measure and report real deltas
- Adjust based on your feedback

**When this phase ends:**
- You see a `evidence-sprint_<milestone>_<date>` tag
- Demo is live
- `/proof` page published with demo + delta

**Time investment:** 30-60 minutes to test and review

---

### Phase 3: Build to AC Green

**What happens:**
We finish building and run all the acceptance tests specified in `AC.md`.

**What you see:**
- CI pipeline running tests
- Performance metrics meeting thresholds
- All criteria going green

**Your role:**
- Observe progress (we'll share links)
- Test the final system
- Confirm acceptance criteria are met

**Our role:**
- Implement all features
- Pass all tests
- Meet all performance thresholds
- Get quality review (no silent failures)

**When this phase ends:**
- You see a `ac-green_<milestone>_<date>` tag
- All tests pass
- `/proof` entry updated
- Invoice issued

**Payment trigger:** AC green = invoice. You pay only when tests pass.

**Time investment:** 1-2 hours for final review and sign-off

---

### Phase 4: Proof Log

**What happens:**
Every milestone, demo, delta, and change is published to `/proof` as a permanent record.

**What you can do:**
- See the full history of what we delivered
- Share proof with stakeholders
- Reference deltas for internal reporting

**Example proof page:**
```
evidence-sprint_signup-otp_2025-11-02
  ✓ Demo: [link] (65 seconds)
  ✓ Delta: p95 ↓77%, steps ↓57%
  ✓ AC: /proof/AC.md
  ✓ Status: Delivered

ac-green_signup-otp_2025-11-05
  ✓ All tests passed
  ✓ Invoice: #2025-11-001
  ✓ Status: Paid
```

---

## Change Control (What If I Need Something Different?)

**Reality:** Scope changes. We expect it. Here's how we handle it without drama.

### Option 1: Swap (€0, same milestone)

**When to use:**
- You want to replace a feature with something else
- The new thing is equal or simpler complexity
- Same timeline

**Example:**
"Instead of email notifications, I want SMS notifications."

**Process:**
1. You tell Rafael what you want to swap
2. Aïcha sizes the complexity (equal/lower = Swap)
3. We update `AC.md`
4. Same price, same timeline

**Cost:** €0 (built into original milestone)

---

### Option 2: Add (new milestone, priced)

**When to use:**
- You want additional features beyond original scope
- The change increases complexity
- New functionality

**Example:**
"I also want push notifications and a mobile app."

**Process:**
1. You tell Rafael what you want to add
2. Aïcha sizes and defines new milestone
3. Rafael prices it
4. You decide: accept (new milestone) or decline
5. If accepted: new `AC.md`, new Evidence Sprint, new AC green

**Cost:** Priced based on complexity (you approve before we start)

---

### Proof for Changes

Every change request gets its own `/proof` entry showing:
- Original request
- Swap or Add decision
- Updated criteria (if Swap)
- New demo + delta
- Status (pending → accepted → delivered)

---

## FAQs

### When do I pay?

**At AC green.** When acceptance tests pass and you've verified the system works. Not before.

### What if tests fail at delivery?

**We don't invoice.** Our risk, not yours. We fix until green or refund any deposit.

### Can I see progress before it's done?

**Yes.** Evidence Sprint shows working demo early. You're not waiting in the dark.

### How do I know the tests are real?

**You can run them.** The Verification section in `AC.md` includes the exact command and seed data. Run it yourself.

### What if I'm not technical?

**We'll show you.** You don't need to understand the code. We'll walk you through the demo and show you the green tests.

### What if I need changes after AC green?

**Same process.** Open a new CR (Swap or Add). Evidence Sprint → AC green → pay.

### How long does each phase take?

**Typical timeline:**
- ScopeLock: 2-4 hours (1-2 days elapsed)
- Evidence Sprint: 2-5 days
- AC green: 1-2 weeks total
- Simple projects: faster
- Complex projects: longer, but always visible progress

### Can I cancel mid-project?

**Yes.** If you've paid a deposit, you keep all code and documentation produced so far. No further obligation.

### Do you offer support after delivery?

**2 weeks included.** Adjustments and bug fixes within 2 weeks of AC green are included. After that, we can discuss retainer or hourly support.

### What if we disagree on whether AC is met?

**Tests decide.** That's why we write executable criteria. If tests pass, AC is met. If they don't, it's not. No ambiguity.

---

## What You Should Expect from Us

**Communication:**
- Clear status updates via SYNC.md
- Links to tags, demos, proof pages
- Honest about blockers
- No fluff, no theatre

**Delivery:**
- Working software over documentation
- Tests that prove it works
- Quantified deltas (not adjectives)
- Public proof you can share

**Change handling:**
- Clear Swap/Add decision within 24 hours
- Pricing before commitment
- Same quality bar regardless

**Quality:**
- No silent fallbacks (fail-loud)
- Performance meets stated thresholds
- Security reviewed
- Code you can maintain

---

## What We Expect from You

**During ScopeLock:**
- Answer clarifying questions
- Review `AC.md` carefully
- Sign off when satisfied

**During Evidence Sprint:**
- Test the demo (30-60 min)
- Give specific feedback
- Tell us if we're off track

**During Build:**
- Be available for questions (async is fine)
- Review at checkpoints
- Final sign-off at AC green

**For Changes:**
- Be clear about what you want
- Decide on Swap/Add options
- Accept that scope changes may affect timeline

**Overall:**
- Trust the process
- Judge us by artefacts (demos, deltas, tests)
- Communicate blockers early

---

## Getting Started

**Step 1:** Reach out to Rafael with your need

**Step 2:** Schedule a ScopeLock call (1 hour)

**Step 3:** Review draft `AC.md` (async)

**Step 4:** Approve baseline (we begin immediately)

**Step 5:** See Evidence Sprint demo (2-5 days later)

**Step 6:** Receive AC green + invoice (1-2 weeks total)

**Step 7:** Pay and use your working system

**Step 8:** View proof at `/proof/<milestone>`

---

## Contact

**Client Relations:** Rafael Moretti
**Status & CRs:** Check SYNC.md or `/proof`
**General:** hello@scopelock.dev (if available)

---

## Summary

ScopeLock is a contract you can see: executable criteria, quantified deltas, verifiable proof. You pay only when tests pass. Scope changes are handled through clear Swap/Add choices. No ambiguity. No surprises. Just working software and public proof.

Lock the scope. Prove the value.
