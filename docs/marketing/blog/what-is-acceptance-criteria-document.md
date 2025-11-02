# What Is an Acceptance Criteria Document (AC.md)?

**Published:** 2025-11-02
**Reading Time:** 7 minutes
**Author:** Nicolas Lester Reynolds

---

"Is it done?"

The most common question in software projects. And the hardest to answer honestly.

Developer says: "Almost, just need to add error handling."
Client thinks: "So... not done?"
Developer means: "95% done."
Client hears: "Could be days or weeks."

**AC.md eliminates this ambiguity.** When tests pass, it's done. When tests fail, it's not.

---

## What AC.md Is

**AC.md** = Acceptance Criteria document

It's a plain markdown file that defines exactly what "done" looks like before you start building.

**Three required sections:**

1. **Functional Criteria** — What it does
2. **Non-Functional Criteria** — Performance and quality thresholds
3. **Verification** — How to test it

**One purpose:** Remove ambiguity from "Is it done?"

---

## Real Example: OTP Signup

Here's an actual AC.md from a project:

```markdown
# AC.md: OTP Signup

**Milestone:** Passwordless Authentication
**Created:** 2025-10-15
**Baseline:** ac-baseline_otp-signup_2025-10-15

---

## Functional Criteria

1. User enters email on signup page
2. System sends OTP to email within 30 seconds
3. User receives email with 6-digit OTP
4. User enters OTP on verification page
5. Valid OTP authenticates user and creates session
6. Invalid OTP shows clear error message: "Invalid code. Try again."
7. Expired OTP (>10 minutes) shows error: "Code expired. Request new code."
8. User can request new OTP (rate limit: max 3 per hour)
9. Session persists for 30 days
10. User can sign out to end session

---

## Non-Functional Criteria

### Performance
- p95 latency: < 300ms (full signup flow, email send to auth completion)
- p99 latency: < 500ms
- OTP delivery rate: > 99% (measured over 1000 sends)

### Quality
- Error rate: < 0.1%
- Mobile responsive: 320px-768px viewport
- Lighthouse score: ≥ 90 (performance, accessibility)

### Security
- OTPs are single-use (invalid after first use)
- OTPs expire after 10 minutes
- Rate limiting: max 3 OTP requests per hour per email

---

## Verification

### Test Command
```bash
npm run acceptance:signup
```

### Test Data
- Test email: test@example.com
- Expected flow:
  1. Enter email → OTP sent
  2. Check inbox → OTP received
  3. Submit OTP → Authenticated
  4. Session created → Valid for 30 days

### Success Criteria
- All 10 functional criteria tests pass (✅)
- All performance thresholds met
- All security constraints verified
- Lighthouse score ≥ 90

---

## Definition of Done

Tests pass: ✅ Done
Tests fail: ❌ Not done
```

---

## Why AC.md Works

### 1. No More "Almost Done"

**Without AC.md:**

Client: "Is it done?"
Developer: "Almost, just need to add error handling and polish the UI."
Client: "How long?"
Developer: "Couple days?"
*One week later...*
Client: "Now is it done?"
Developer: "Almost, found some edge cases."

**With AC.md:**

Client: "Is it done?"
Developer: `npm run acceptance`
Output: `8/10 tests passing ❌`
Developer: "80% done. Failing on error handling and rate limiting."
Client: "When will it be done?"
Developer: "When tests show 10/10 ✅"

**No guessing. Just run the tests.**

---

### 2. Verifiable Claims

**Without AC.md:**

Developer: "It's fast."
Client: "How fast?"
Developer: "Pretty fast, feels snappy."
Client: "Can you measure it?"
Developer: "Uh... I'll check."

**With AC.md:**

Non-functional criteria: `p95 latency: < 300ms`

Test output:
```
Performance test results:
p95 latency: 287ms ✅
p99 latency: 445ms ✅
```

**Every claim is a number. Every number is verifiable.**

---

### 3. Aligned Expectations

**The real problem:** Client and developer have different definitions of "done."

**Client thinks done means:**
- Works on mobile
- Handles errors gracefully
- Fast enough for production
- Secure

**Developer thinks done means:**
- Core functionality works
- No obvious bugs
- "We can polish later"

**AC.md forces alignment before starting.**

If client cares about mobile responsiveness, it goes in AC.md. If developer thinks "polish later" is acceptable, client sees that in AC.md and disagrees. Conflict resolved before code is written.

---

## The Three Sections Explained

### Section 1: Functional Criteria

**What goes here:** Everything the feature **does**.

**Format:** Numbered list of observable behaviors

**Example:**
```markdown
## Functional Criteria

1. User clicks "Sign Up" button
2. User enters email in form field
3. User submits form
4. System sends OTP to email
5. User receives email with OTP
6. User enters OTP in verification form
7. System validates OTP
8. User is authenticated
9. User sees dashboard
```

**Why numbered?** So tests can reference "Criteria #3 failed."

**Why observable?** If you can't see it happen, you can't test it.

---

### Section 2: Non-Functional Criteria

**What goes here:** Performance, quality, security thresholds.

**Common categories:**

**Performance:**
- Latency (p95, p99)
- Throughput (requests/second)
- Time to first byte

**Quality:**
- Error rate
- Code coverage (if agreed)
- Lighthouse scores

**Security:**
- Rate limiting
- Input validation
- Authentication requirements

**UX:**
- Mobile responsive (viewport sizes)
- Accessibility (WCAG level)
- Browser support

**Example:**
```markdown
## Non-Functional Criteria

### Performance
- p95 latency: < 300ms
- OTP delivery: < 30 seconds

### Quality
- Error rate: < 0.1%
- Lighthouse: ≥ 90

### Security
- OTP single-use
- 10-minute expiry
- Rate limit: 3/hour

### UX
- Mobile: 320px-768px
- Keyboard navigable
```

**Why thresholds?** "Fast" is subjective. "<300ms" is testable.

---

### Section 3: Verification

**What goes here:** How to run the tests.

**Required information:**
- Test command
- Test data / seed data
- Expected behavior
- Success criteria

**Example:**
```markdown
## Verification

### Test Command
```bash
npm run acceptance:signup
```

### Test Data
- Email: test@example.com
- Expected: OTP sent, received, validated

### Success Criteria
- All functional criteria pass ✅
- All performance thresholds met ✅
- All security constraints verified ✅
```

**Why this matters:** Client can run tests themselves.

No "trust me, it works." Just `npm run acceptance` and see the results.

---

## Co-Authoring AC.md

**Key insight:** AC.md is co-written, not handed down.

### The Process

**Step 1: Client describes need** (5 minutes)

"We need passwordless authentication. Email-based OTP. Mobile-friendly."

**Step 2: Developer drafts functional criteria** (15 minutes)

```markdown
## Functional Criteria (DRAFT)

1. User enters email
2. System sends OTP
3. User enters OTP
4. User is authenticated
```

**Step 3: Client reviews and refines** (10 minutes)

Client: "What about error handling?"
Developer adds: "6. Invalid OTP shows error"

Client: "What if OTP expires?"
Developer adds: "7. Expired OTP shows different error"

Client: "Can user request new OTP?"
Developer adds: "8. User can request new OTP (rate limited)"

**Step 4: Define non-functional criteria** (10 minutes)

Developer: "What's acceptable performance?"
Client: "Fast enough for mobile"
Developer: "Let's say p95 < 300ms?"
Client: "Sounds good."

**Step 5: Write verification** (5 minutes)

Developer: "I'll create acceptance tests. Command will be `npm run acceptance:signup`"
Client: "Can I run them?"
Developer: "Yes. Tests + seed data will be in the repo."

**Step 6: Baseline** (1 minute)

Both agree: "This is the scope."

```bash
git tag ac-baseline_otp-signup_2025-10-15
```

**Total time:** 45 minutes to remove weeks of ambiguity.

---

## Baseline Protection

**Key rule:** After baseline, AC.md cannot change without a Change Request.

**Why?**

**Without baseline protection:**
- Client adds "one more thing" mid-project
- Developer thinks "this is scope creep"
- Dispute, frustration, mistrust

**With baseline protection:**

Client: "Can we add SMS notifications?"
Developer: "That's a change request. Swap or Add?"
Aïcha analyzes: "Add (new feature)"
Developer prices: "$4K for SMS milestone"
Client: "Approved. Let's do it."

**Clear process. No surprise costs. Trust maintained.**

---

## Common Questions

**"Isn't writing AC.md overhead?"**

45 minutes upfront vs 3 weeks of "is this what you wanted?" rework.

AC.md is insurance against building the wrong thing.

**"What if requirements change?"**

They will. That's why we have CHG-130 (Change Control):
- Swap (€0) for equal complexity changes
- Add (priced) for new features

AC.md doesn't prevent change. It makes change explicit and controlled.

**"Can AC.md be too detailed?"**

Yes. Balance is key.

**Too vague:** "System is fast" (untestable)
**Too detailed:** "Button is 43px wide with 2px border" (over-specified)
**Just right:** "p95 latency < 300ms, mobile responsive 320px+" (testable, clear)

---

## How to Apply This

### If You're Hiring a Developer

Before signing a contract, ask:

**"Can we write AC.md together before you start?"**

**Green flags:**
- ✅ "Yes, let's co-author it"
- ✅ "I'll draft functional criteria, you review"
- ✅ "We'll baseline it before I start coding"

**Red flags:**
- ❌ "I'll figure out the requirements as I go"
- ❌ "Trust me, I know what you need"
- ❌ "That's too much process for a small project"

---

### If You're a Developer

Instead of starting with vague requirements, **co-write AC.md first**.

**Process:**
1. Client describes need
2. You draft AC.md
3. Client reviews and refines
4. Both baseline (git tag)
5. You build to AC green (tests passing)

**Benefits:**
- No "is this what you wanted?" rework
- No scope disputes
- Clear definition of done
- Client can verify by running tests

---

## What's Next?

At ScopeLock, **every project starts with AC.md**.

We don't quote prices until AC.md is baselined. We don't start coding until verification is defined. We don't invoice until tests pass (AC green).

**Want to see a real AC.md?** [Check our process page](/process)

**Ready to co-write AC.md for your project?** [Schedule a call](/contact)

---

**Tags:** #acceptance-criteria #ac.md #requirements #software-testing #definition-of-done

**SEO Keywords:** acceptance criteria, AC.md, software requirements, definition of done, requirements document, acceptance testing, how to write acceptance criteria
