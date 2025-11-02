# Fixed-Price vs Hourly: Why Outcome-Based Pricing Works

**Published:** 2025-11-02
**Reading Time:** 8 minutes
**Author:** Nicolas Lester Reynolds

---

"How much will this cost?"

The most important question in software development. And the one with the worst answers.

**Hourly:** "It depends how long it takes" (translation: unknown)
**Fixed-bid:** "$40K for the whole project" (translation: padded heavily, or cut corners)

Both pricing models fail because they optimize for the wrong thing. **Outcome-based pricing** fixes this.

---

## The Three Pricing Models

### 1. Hourly Billing

**How it works:**
- Developer charges by the hour
- You pay $100-$250/hour
- Final cost = hours worked × rate

**The promise:** "You only pay for actual work"

**The reality:** Misaligned incentives

#### Problems with Hourly

**Problem 1: Slower Work = More Money**

Developer A: Solves problem in 8 hours
Developer B: Solves same problem in 40 hours

Hourly billing rewards Developer B (5× more revenue).

**Your question:** "How do I know if 40 hours was necessary?"
**Answer:** You don't.

**Problem 2: Unpredictable Total Cost**

Initial estimate: "Probably 40-60 hours"
After 60 hours: "We need another 30 hours for edge cases"
After 90 hours: "Just 20 more hours for polish"

**Final cost:** 110 hours × $150 = $16,500
**Your budget:** $9,000
**Your trust:** Destroyed

**Problem 3: No Incentive to Ship Fast**

Hourly billing rewards time spent, not results delivered.

- Meetings? Billable.
- Debugging their own mistakes? Billable.
- Learning a technology they claimed to know? Billable.
- Refactoring code they just wrote? Billable.

**You wanted:** Fast results.
**You got:** Billable hours.

---

### 2. Fixed-Bid Pricing

**How it works:**
- Developer quotes a total price upfront
- You pay the full amount (often split into milestones)
- Developer assumes all risk

**The promise:** "You know the cost upfront"

**The reality:** Padding, corners, or disputes

#### Problems with Fixed-Bid

**Problem 1: Heavy Padding**

Developer thinks: "This could take 40 hours, but what if it's 80? Better quote for 100 to be safe."

**Your quote:** $25K
**Actual work:** $12K worth
**Padding:** $13K "just in case"

You pay for hypothetical problems that never happened.

**Problem 2: Corners Get Cut**

Developer underestimates. Realizes mid-project they'll lose money.

**Options:**
- A) Take the loss (unlikely)
- B) Cut corners (tests skipped, quality sacrificed, "good enough" code)
- C) Renegotiate mid-project (trust damaged)

All three outcomes hurt you.

**Problem 3: Scope Disputes**

Your perspective: "This is obviously part of the project"
Developer: "That's out of scope, extra cost"

**Every. Single. Feature.**

Without clear acceptance criteria, every request becomes a negotiation.

---

### 3. Outcome-Based Pricing (ScopeLock Model)

**How it works:**
- We co-write AC.md (acceptance criteria) before starting
- We agree on a fixed price
- You pay when tests pass (AC green)

**The promise:** "Fixed price + pay when delivered"

**The reality:** Aligned incentives

---

## Why Outcome-Based Pricing Works

### 1. We Define "Done" Before Pricing

Before quoting a price, we write AC.md together:

```markdown
# AC.md: OTP Signup

## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session persists 30 days

## Non-Functional Criteria
- p95 latency: < 300ms
- Error rate: < 0.1%
- Mobile responsive

## Verification
npm run acceptance:signup
```

**Now both parties know:**
- Exactly what will be built
- How it will be tested
- What "done" looks like

**Price quote:** $8K to AC green.

No ambiguity. No scope disputes. Just clear criteria and a fixed price.

---

### 2. Payment at AC Green (Tests Passing)

We don't get paid for "almost done" or "90% complete."

**We get paid when:**
```bash
npm run acceptance
# All tests: ✅ PASS
```

**What this means:**
- All functional criteria satisfied
- All performance thresholds met
- All tests green

**You don't pay for:**
- Time spent debugging
- Code that doesn't work
- "In progress" work
- Meetings or coordination

**You pay for:** Working code that passes your tests.

---

### 3. We Assume the Risk

**Hourly model:** You assume risk (unknown total cost)
**Fixed-bid model:** Developer assumes risk (cuts corners or padding)
**Outcome-based model:** We assume risk (but we control it)

**How we control risk:**
- We write detailed AC.md (no ambiguity)
- We baseline the scope (no scope creep)
- We track changes via CHG-130 (Swap or Add)
- We ship Evidence Sprints first (validate early)

**Result:** Risk is minimized through process, not padding or corner-cutting.

---

## Real Example: OTP Signup Project

Let's price the same feature three ways.

### Hourly Approach

**Developer quote:** "$150/hour, estimate 40-80 hours"

**Questions you can't answer:**
- Will it be 40 or 80 hours?
- How do I know if 80 hours was necessary?
- What if it takes 120 hours?

**Likely range:** $6,000 - $18,000
**Predictability:** None

---

### Fixed-Bid Approach

**Developer quote:** "$15,000 for passwordless auth"

**Why $15K?**
- Developer estimates 60 hours
- Pads 40% for risk = 84 hours
- 84 hours × $150 = $12,600
- Rounds to $15,000

**Actual work:** Probably 50 hours ($7,500 worth)
**Padding:** $7,500
**Your question:** "How do I know this is fair?"
**Answer:** You don't.

---

### Outcome-Based Approach (ScopeLock)

**Our process:**

**1. Co-write AC.md** (30 minutes)
```markdown
## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session persists 30 days

## Non-Functional Criteria
- p95 < 300ms
- Error rate < 0.1%
- Mobile responsive

## Verification
npm run acceptance:signup
```

**2. Price the outcome** (5 minutes)
- We estimate: 40 hours to AC green
- Our rate: $175/hour effective
- Quote: $8,000 flat

**3. Lock the scope**
```bash
git tag ac-baseline_otp-signup_2025-11-02
```

**4. Deliver when tests pass**
- Build to AC green
- All tests passing
- Invoice issued: $8,000 (exactly)

**Your questions answered:**
- Total cost: $8,000 (known upfront)
- When you pay: When tests pass
- What you get: Working code, verified by tests
- Risk: Ours (if tests fail, we keep working until they pass)

---

## The Three-Question Test

When evaluating pricing models, ask:

### Question 1: "How much will this cost?"

**Hourly:** "Depends on hours" ❌
**Fixed-bid:** "$25K" (but padded) ⚠️
**Outcome-based:** "$8K to AC green" ✅

### Question 2: "When do I pay?"

**Hourly:** "Every 2 weeks" (ongoing) ❌
**Fixed-bid:** "50% upfront, 50% at delivery" ⚠️
**Outcome-based:** "When tests pass" ✅

### Question 3: "How do I know it's done?"

**Hourly:** "Developer says so" ❌
**Fixed-bid:** "Developer says so" ❌
**Outcome-based:** "Run tests, check results" ✅

---

## Handling Scope Changes

**Inevitable question:** "What if I want to add a feature mid-project?"

### Hourly Model
- "Sure, more hours" (unknown cost)

### Fixed-Bid Model
- "That's out of scope, extra $10K" (every request is a battle)

### Outcome-Based Model (CHG-130)

We classify every change:

**Swap (€0, same milestone):**
- Replace email with SMS notifications
- Swap React for Vue
- Change UI color scheme

**Add (new milestone, priced):**
- Add analytics dashboard
- Add mobile app
- Add third-party integrations

**Client approves Adds before we start. No surprises.**

---

## Common Objections

**"Isn't outcome-based just fixed-price?"**

No. Fixed-price often means:
- Vague deliverables ("fully functional dashboard")
- Payment regardless of quality ("it's delivered")
- Scope disputes ("that's not included")

Outcome-based means:
- Explicit criteria (AC.md with tests)
- Payment at AC green (tests must pass)
- No scope disputes (baseline + CHG-130)

**"What if the AC.md was underspecified?"**

That's on both of us. We co-write it together.

If criteria are vague, we don't baseline until they're clear.

**Example: Vague → Specific**

❌ Vague: "Fast performance"
✅ Specific: "p95 latency < 300ms"

❌ Vague: "User-friendly"
✅ Specific: "Task completion rate > 85%"

**"What if tests are too easy?"**

Then you approved bad AC.md.

This is why co-authoring matters. You define what "pass" means.

If you accept "Tests pass when page loads," that's what you'll get.

Better AC.md: "Tests pass when user completes full OTP flow in <30s with <0.1% error rate."

---

## How to Apply This

### If You're Hiring a Developer

Ask three questions:

**1. "Can we co-write AC.md before you quote?"**

✅ Good: "Yes, let's define done together"
❌ Red flag: "I'll figure out the specs"

**2. "When do I pay?"**

✅ Good: "When tests pass"
⚠️ Okay: "At milestones" (if milestones have tests)
❌ Red flag: "50% upfront, non-refundable"

**3. "How do we handle changes?"**

✅ Good: "Swap or Add via CHG-130"
⚠️ Okay: "Change requests priced before work"
❌ Red flag: "Everything is extra"

---

### If You're a Developer

Stop selling hours. Start selling outcomes.

**Instead of:**
"$150/hour, probably 40-60 hours"

**Try:**
"Let's write AC.md together. I'll quote a fixed price. You pay when tests pass."

**Your clients will ask:**
"What if it takes longer than you thought?"

**Your answer:**
"That's my risk to manage. You know the price upfront. You pay when delivered."

**Why clients say yes:**
- Fixed price (budget certainty)
- Pay at AC green (no risk of paying for broken code)
- Clear scope (AC.md eliminates ambiguity)

---

## The Math That Matters

**Hourly project:**
- Estimate: 60 hours
- Actual: 95 hours (scope creep, debugging, rework)
- Cost: 95 × $150 = $14,250
- Trust: Damaged ("Why did it take 95 hours?")

**Fixed-bid project:**
- Quote: $18,000 (heavily padded)
- Actual work: 55 hours ($8,250 worth)
- Padding: $9,750
- Value: Poor (you paid for insurance, not work)

**Outcome-based project:**
- AC.md: Co-written, clear criteria
- Quote: $9,500 to AC green
- Delivered: When tests pass
- Total: $9,500 (exactly)
- Trust: Built (you got exactly what was promised)

---

## What's Next?

At ScopeLock, we only do outcome-based pricing.

**Why?**
- Aligns incentives (we ship faster when we control the timeline)
- Builds trust (you pay for results, not time)
- Eliminates disputes (tests define "done," not opinions)

**Want outcome-based pricing for your project?**

[See our process](/process) — co-write AC.md, lock scope, pay at AC green

[Schedule a call](/contact) — 30 minutes to discuss your project

---

**Tags:** #pricing #fixed-price #hourly-billing #outcome-based-pricing #software-development

**SEO Keywords:** fixed-price development, hourly vs fixed-price, software pricing models, outcome-based pricing, pay for results, software development costs
