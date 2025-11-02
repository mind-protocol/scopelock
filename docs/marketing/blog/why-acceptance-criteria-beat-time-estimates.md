# Why Acceptance Criteria Beat Time Estimates

**Published:** 2025-11-02
**Reading Time:** 8 minutes
**Author:** Nicolas Lester Reynolds

---

"It'll take about two weeks."

You've heard this before. Two weeks becomes four. Four becomes eight. The developer says they're "90% done," but you have no idea what that means. When you ask if it's ready, the answer is always "almost."

This is the time estimate trap. And it's not the developer's fault—it's the wrong question.

---

## The Problem with Time Estimates

Time estimates create three fundamental problems:

### 1. They Incentivize the Wrong Behavior

**Hourly billing:** Developers are paid for time spent, not results delivered. Slower work = more money.

**Fixed-bid padding:** Contractors know estimates are usually wrong, so they pad heavily. Your 2-week project gets quoted at 6 weeks "to be safe."

**No accountability:** When the estimate is wrong, who's responsible? The developer says "requirements changed." You say "you promised 2 weeks." Nobody wins.

### 2. They Don't Answer "Is It Done?"

Imagine asking a developer: "Is the signup flow ready?"

**With time estimates:**
- "I'm 80% done" ← What does this mean?
- "Just need to finish error handling" ← How long will that take?
- "Almost there" ← When can we ship?

**With acceptance criteria:**
- Run tests: `npm run acceptance`
- Tests pass: ✅ Done
- Tests fail: ❌ Not done

No ambiguity. No guessing. Just green or red.

### 3. They Optimize for Effort, Not Outcome

Time estimates measure **how long you worked**, not **what you delivered**.

Two developers building the same feature:
- Developer A: Works 40 hours, ships buggy code
- Developer B: Works 12 hours, ships production-ready code

With time estimates, Developer A gets paid more. With acceptance criteria, only Developer B gets paid.

---

## The Acceptance Criteria Approach

Instead of estimating time, we define **what "done" looks like** before starting.

### What Goes in AC.md?

An acceptance criteria document has three parts:

**1. Functional Criteria** — What it does
```markdown
## Functional Criteria

1. User can request OTP via email
2. User receives OTP within 30 seconds
3. User can submit OTP to authenticate
4. Invalid OTP shows clear error message
5. OTP expires after 10 minutes
```

**2. Non-Functional Criteria** — Performance and quality thresholds
```markdown
## Non-Functional Criteria

- p95 latency: < 300ms (signup flow completion)
- Error rate: < 0.1%
- OTP delivery rate: > 99%
- Mobile responsive (320px viewport)
```

**3. Verification** — How to test it
```markdown
## Verification

**Test Command:**
```bash
npm run acceptance:signup
```

**Test Data:**
- Email: test@example.com
- Expected: OTP sent, user authenticated
```

---

## Real Example: The Same Feature, Different Quotes

We've seen this pattern repeatedly:

**Agency A:** "8-12 weeks for OTP authentication"
**Agency B:** "6 weeks for passwordless login"
**Freelancer C:** "Probably 4 weeks, maybe more"

Same feature. Three wildly different time estimates.

**Here's our AC.md for the same work:**

```markdown
# AC.md: OTP Signup

## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Invalid OTP shows error

## Non-Functional Criteria
- p95 < 300ms
- Error rate < 0.1%
- Mobile responsive

## Verification
npm run acceptance:signup
```

**Time to AC green:** 5 days.

Why the difference? Because we're optimizing for **outcome** (tests passing), not **effort** (hours worked).

---

## What "90% Done" Really Means

With time estimates, "90% done" is meaningless. Here's why:

**Developer's perspective:**
- "I wrote 90% of the code"
- (Missing: error handling, edge cases, tests, polish)

**Client's perspective:**
- "It's 90% ready to ship"
- (Reality: 50% of remaining work is in the last 10%)

**With AC.md:**
- Tests passing: 8/10 ✅
- Tests failing: 2/10 ❌
- Status: 80% done (precise, verifiable)

No interpretation needed. Run the tests. Count the green checks.

---

## The Three-Project Test

Imagine three projects with identical requirements:

| Project | Time Estimate | AC.md |
|---------|--------------|-------|
| Project A | "2 weeks, maybe 3" | 12 functional criteria, 4 non-functional, 20 tests |
| Project B | "Could be 6 weeks if issues" | Same AC.md |
| Project C | "3-4 weeks minimum" | Same AC.md |

**The insight:** Time estimates vary wildly. AC.md is identical.

If we can agree on **what "done" looks like**, the time estimate becomes irrelevant. Either the tests pass or they don't.

---

## How to Apply This

### If You're Hiring a Developer

Instead of asking: **"How long will this take?"**

Ask: **"Can we write AC.md together before starting?"**

**What to look for:**
- ✅ They suggest specific tests
- ✅ They define performance thresholds
- ✅ They propose verification steps
- ❌ They resist writing criteria
- ❌ They say "we'll figure it out as we go"

### If You're a Developer

Instead of saying: **"This will take 2-3 weeks"**

Say: **"Here's the AC.md. I'll deliver when all tests pass."**

**What to include:**
- Functional criteria (what it does)
- Non-functional criteria (performance, quality)
- Verification steps (how to test)
- Payment trigger: AC green (all tests passing)

---

## Why This Works

**1. Eliminates Ambiguity**

"Is it done?" is answered by running tests, not asking the developer.

**2. Aligns Incentives**

Developers are rewarded for shipping working code, not for spending time.

**3. Builds Trust**

When the client can verify every claim by running tests, trust compounds.

**4. Enables Fixed Pricing**

If we know what "done" looks like, we can price the outcome, not the hours.

---

## Common Objections

**"But requirements change mid-project"**

Yes. That's why we have Change Control (CHG-130):
- **Swap:** Replace with equal/lower complexity → €0, same milestone
- **Add:** New requirement → New milestone, new price

AC.md gets baselined. Changes require a Change Request. No surprise costs.

**"Writing AC.md takes time upfront"**

30-60 minutes co-editing AC.md vs. weeks of "is this what you wanted?" back-and-forth.

We'd rather spend an hour getting it right than three weeks building the wrong thing.

**"Some things can't be tested"**

If it can't be tested, it can't be verified. If it can't be verified, how do you know it works?

Even subjective criteria can be made testable:
- "Looks good" → Lighthouse score ≥ 90
- "Fast enough" → p95 latency < 300ms
- "User-friendly" → Task completion rate > 85%

---

## What's Next?

At ScopeLock, we co-write AC.md with every client before starting. We freeze it with a baseline tag. We build to AC green (tests passing). You pay when the tests pass.

No time estimates. No "almost done." No ambiguity.

**Want to see a real AC.md?** Check our [process page](/process) for a complete example.

**Ready to lock scope on your project?** [Schedule a ScopeLock call](/contact)

---

**Tags:** #acceptance-criteria #time-estimates #project-management #software-development #scopelock

**SEO Keywords:** acceptance criteria, time estimates, software project management, scope definition, AC.md, is it done
