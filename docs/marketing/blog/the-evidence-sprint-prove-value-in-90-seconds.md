# The Evidence Sprint: Prove Value in 90 Seconds

**Published:** 2025-11-02
**Reading Time:** 7 minutes
**Author:** Nicolas Lester Reynolds

---

Most MVPs fail before they launch.

Not because the idea is bad. Not because the team is incompetent. But because it takes **3 months to build** and **3 seconds to realize** it's not what the client needed.

The Evidence Sprint solves this: working demo + quantified delta in 2-5 days.

---

## The Problem with Traditional MVPs

The term "MVP" has lost all meaning. Here's what it's become:

**"Minimum Viable Product" in practice:**
- 12 weeks of development
- 47 features (because "we need X to be viable")
- Launch day: clients try it, realize it's not what they wanted
- Total waste: 12 weeks, $50K-$150K

**The core issue:** You don't learn until you ship. And shipping takes months.

### Why MVPs Take So Long

**1. Feature Creep**
- "We need user auth to be viable"
- "We need notifications to be viable"
- "We need analytics to be viable"
- Result: 6-month "MVP"

**2. No Forcing Function**
- If you have 3 months, you'll use 3 months
- Parkinson's Law: work expands to fill time available
- No pressure to prioritize ruthlessly

**3. No Quantified Success Criteria**
- "Let's build it and see if users like it"
- How do you measure "like"?
- When do you know if it's working?

---

## The Evidence Sprint Approach

Instead of building a minimum viable **product**, we build a minimum viable **proof**.

### The Three Components

**1. Working Demo (≤90 seconds)**

Not a mockup. Not a prototype. A **working implementation** you can use.

The 90-second rule forces clarity:
- If you can't demo it in 90 seconds, is it focused enough?
- If the value isn't obvious in 90 seconds, will users stick around?

**2. Quantified Delta**

Not "it's faster" but **how much faster**.
Not "it's simpler" but **how many fewer steps**.

Every Evidence Sprint produces `DELTA.md` with before/after numbers.

**3. Tag + Proof Entry**

Tag the work: `evidence-sprint_<milestone>_<date>`

Generate public proof entry with:
- AC.md (what we're proving)
- DEMO.md (where to see it working)
- DELTA.md (quantified improvements)

---

## Real Example: OTP Signup

**Client need:** Passwordless authentication, fast.

**Traditional MVP approach:**
- Week 1-2: Requirements gathering, architecture design
- Week 3-6: Build complete auth system
- Week 7-8: Polish and testing
- Week 9: Ship and hope it works

**Evidence Sprint approach:**

### Day 1: Co-write AC.md
```markdown
# AC.md: OTP Signup Evidence Sprint

## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session persists 30 days

## Non-Functional Criteria
- p95 latency: < 300ms (full flow)
- Steps to complete: ≤ 3
- Mobile responsive

## Verification
npm run acceptance:signup
```

### Days 2-3: Build minimal proof
- Email OTP delivery (no SMS, no backup codes, no recovery)
- Simple session management (no OAuth, no SSO)
- Basic error handling (no edge cases yet)

### Day 4: Generate delta
```markdown
# DELTA.md

## Before (Email + Password)
- p95 latency: 1200ms
- Steps to complete: 7
- Forgot password flow: 3 additional steps
- Mobile conversion: 42%

## After (OTP)
- p95 latency: 280ms (↓77%)
- Steps to complete: 3 (↓57%)
- Forgot password: eliminated
- Mobile conversion: 68% (↑62%)
```

### Day 5: Ship demo + tag
- Working demo: `demo.scopelock.ai/otp-signup`
- Tag: `evidence-sprint_otp-signup_2025-11-02`
- Public proof: `/proof/evidence-sprint_otp-signup_2025-11-02`

**Total time:** 5 days from "let's try this" to "here's proof it works."

---

## The 90-Second Demo Rule

Why ≤90 seconds?

**1. Forces Focus**

If you can't show value in 90 seconds, you're building too much.

**Good Evidence Sprint demo:**
- Open page → Enter email → Receive OTP → Submit → Authenticated
- Time: 45 seconds
- Value: Obvious

**Bad Evidence Sprint demo:**
- Explain architecture → Show database schema → Walk through 5 features
- Time: 8 minutes
- Value: Unclear

**2. Matches Real User Attention**

Users don't give you 10 minutes to "show potential."

They give you 30 seconds to prove value or they bounce.

**3. Enables Decision-Making**

In 90 seconds, a client can decide:
- ✅ "This is exactly what I need—let's build to AC green"
- ↻ "Close, but change X—let's iterate"
- ❌ "Not what I wanted—let's pivot before investing more"

All outcomes are valuable. Finding out in 5 days vs 5 months is the difference.

---

## Quantified Deltas: Not Feelings, Numbers

Every `DELTA.md` must have **measurable before/after**.

### ❌ Bad Delta
```markdown
## What Changed
- Made it faster
- Simplified the flow
- Improved UX
```

**Why bad?** No numbers. Can't verify. Just claims.

### ✅ Good Delta
```markdown
## Performance
- p95 latency: 1200ms → 280ms (↓77%)
- Time to first interaction: 850ms → 190ms (↓78%)

## Usability
- Steps to complete: 7 → 3 (↓57%)
- Form fields: 12 → 2 (↓83%)

## Conversion
- Mobile signup rate: 42% → 68% (↑62%)
- Completion rate: 54% → 81% (↑50%)
```

**Why good?** Every claim is a number. Client can verify. Objective proof.

---

## Evidence Sprint vs Discovery Phase

Most agencies sell a "discovery phase" before building. Here's the difference:

| Discovery Phase | Evidence Sprint |
|----------------|-----------------|
| Deliverable: Document | Deliverable: Working demo |
| Timeline: 2-4 weeks | Timeline: 2-5 days |
| Output: "Here's what we'll build" | Output: "Here's what we built" |
| Cost: $5K-$15K | Cost: $3K-$6K |
| Risk: Still don't know if it works | Risk: You've seen it working |

**Discovery Phase:** Pay to talk about building.
**Evidence Sprint:** Pay to build and prove.

---

## When to Use Evidence Sprint

### ✅ Perfect For

- **Validating new ideas:** "Will OTP signup work for our users?"
- **De-risking big projects:** "Can we hit <300ms p95 before committing?"
- **Rapid prototyping:** "We need a working demo for investors by Friday"
- **Proof before commitment:** "Show me it works before I approve the full build"

### ❌ Not Ideal For

- **Well-defined features:** If you know exactly what you want and have full specs, go straight to AC green
- **Pure research:** If you're exploring problem space without building, use a different approach
- **Long-term maintenance:** Evidence Sprints prove value, not operational readiness

---

## How to Apply This

### If You're a Founder

Before committing to a 3-month build, ask your developer:

**"Can we do an Evidence Sprint first?"**

**What you should get:**
- Working demo in 2-5 days
- Quantified delta (numbers, not feelings)
- Clear path: iterate, proceed to AC green, or pivot

**Cost:** $3K-$6K typically (1/10th of full build cost)

**Value:** Knowing if you're building the right thing before investing $50K+

### If You're a Developer

Instead of quoting 8 weeks for an MVP:

**"Let's do a 3-day Evidence Sprint first."**

**What you deliver:**
- Minimal proof of concept (working, not polished)
- DELTA.md with real numbers
- Demo link clients can share with stakeholders

**Why clients say yes:** Low risk, fast feedback, proof before commitment.

---

## Three Common Questions

**"Isn't this just a prototype?"**

No. Prototypes are fake (Figma mockups, clickable demos).

Evidence Sprints are **working implementations**:
- Real database
- Real auth
- Real performance metrics
- Real code that becomes production

**"What if the Evidence Sprint proves it won't work?"**

**That's success.**

You spent 5 days and $3K-$6K to learn this won't work.

Alternative: Spend 12 weeks and $80K to learn the same thing.

**"Do you always do Evidence Sprints?"**

No. If requirements are crystal clear and risk is low, we skip straight to AC green.

Evidence Sprints are for **validation and de-risking**, not for every build.

---

## The Math That Matters

**Traditional MVP:**
- Time to learn: 12 weeks
- Cost to learn: $50K-$150K
- Pivots: Expensive and slow

**Evidence Sprint:**
- Time to learn: 2-5 days
- Cost to learn: $3K-$6K
- Pivots: Cheap and fast

**The difference:**
- 24x faster feedback
- 10x lower cost
- Infinite more pivots possible

---

## What's Next?

At ScopeLock, we start high-risk projects with Evidence Sprints.

**The workflow:**
1. Co-write AC.md (30-60 minutes)
2. Build Evidence Sprint (2-5 days)
3. Review delta + demo (30 minutes)
4. Decide: iterate, proceed to AC green, or pivot

**Want to validate your idea in 5 days instead of 5 months?**

[Book an Evidence Sprint](/contact) — $3K-$6K, working demo + quantified delta

**See a real Evidence Sprint:** Check our [Proof Log](/proof) for examples

---

**Tags:** #evidence-sprint #rapid-prototyping #mvp #working-demo #proof-of-concept

**SEO Keywords:** evidence sprint, rapid prototyping, MVP development, working demo, proof of concept, validate startup idea
