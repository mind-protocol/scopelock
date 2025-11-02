# Change Control Without Scope Creep: CHG-130 Explained

**Published:** 2025-11-02
**Reading Time:** 7 minutes
**Author:** Nicolas Lester Reynolds

---

"Can we just add one more feature?"

Five words that destroy projects.

Not because the feature is bad. Not because it's hard to build. But because "just one more" becomes twenty, the timeline doubles, the budget triples, and nobody knows who approved what.

This is scope creep. CHG-130 eliminates it.

---

## The Scope Creep Problem

Every project faces mid-course changes. Requirements shift. Priorities change. New opportunities emerge.

The question isn't **"Will scope change?"** It's **"How do we handle it without chaos?"**

### How Most Projects Handle Change

**Scenario:** Client asks for SMS notifications mid-project.

**Agency Response A: "Sure, we'll add it"**
- No re-scoping
- No price discussion
- Timeline slips by 2 weeks
- Final invoice: $15K higher than quote
- Client: "Why am I paying for something I didn't approve?"

**Agency Response B: "That's out of scope"**
- Everything becomes a battle
- Client frustrated: "You're nickel-and-diming me"
- Relationship damaged
- Change requests avoided instead of managed

**Agency Response C: "Let's discuss after MVP ships"**
- Change deferred indefinitely
- Shipped product missing critical feature
- Post-launch scramble
- Two months of wasted "let's circle back"

All three responses fail. **Why?** No clear change control process.

---

## The CHG-130 Approach

CHG-130 is our change control protocol. Every scope change goes through it.

**The core rule:** After baseline, AC.md cannot change without a Change Request.

### What "Baseline" Means

When we co-write AC.md and both parties sign off, we tag it:

```bash
git tag ac-baseline_signup_2025-11-02
```

**This tag means:**
- Scope is frozen
- Price is locked
- Timeline is set
- Any change requires CHG-130

**The baseline guard:** If anyone tries to modify AC.md after baseline without a CR, CI fails. No exceptions.

---

## Two Types of Changes: Swap or Add

When a client requests a change, we classify it:

### Swap (€0, Same Milestone)

**Definition:** Replace existing scope with equal/lower complexity.

**When it applies:**
- Same milestone
- Equal or simpler implementation
- No new features, just substitution

**Example: Email → SMS Notifications**

**Original AC.md:**
```markdown
## Notification System
- Send email notifications on signup
- Send email notifications on password reset
- Email delivery rate > 99%
```

**Client requests:** "Change email notifications to SMS"

**Analysis:**
- Same functionality (notifications)
- Similar complexity (both are external API calls)
- No new features (just swap delivery method)

**Decision:** Swap
- Price: €0 (same milestone)
- Update AC.md: Replace "email" with "SMS"
- Deliver within original timeline

**Why it works:** You're not asking for MORE, you're asking for DIFFERENT. Equal trade, no cost.

### Add (New Milestone, Priced)

**Definition:** New functionality beyond original scope.

**When it applies:**
- New features
- Increased complexity
- Additional work beyond baseline

**Example: Add Mobile Push Notifications**

**Original AC.md:**
```markdown
## Notification System
- Send email notifications on signup
- Send email notifications on password reset
```

**Client requests:** "Also add mobile push notifications"

**Analysis:**
- New feature (push notifications)
- New infrastructure (push notification service, mobile SDK)
- Increased complexity (multi-platform support)

**Decision:** Add
- New milestone: "Mobile Push Notifications"
- New AC.md created
- Priced separately: $8K
- Client approves before work begins

**Why it works:** You're asking for MORE. We scope it, price it, you approve it. No surprises.

---

## The CHG-130 Workflow

**Step 1: Client Requests Change**

Client: "Can we change X to Y?"

**Step 2: Rafael Opens Change Request**

```bash
git tag change-req_001_2025-11-02
```

CR includes:
- What's being requested
- Why (client rationale)
- Current state vs desired state

**Step 3: Aïcha Analyzes Complexity**

- Same complexity or less? → Swap candidate
- New features or higher complexity? → Add candidate

**Step 4: Classification Decision**

**If Swap:**
- Price: €0
- Update AC.md to reflect change
- Deliver within original milestone

**If Add:**
- Create new milestone
- Write new AC.md
- Price the new work
- Client approval required before starting

**Step 5: Delivery**

```bash
git tag change-delivered_001_2025-11-03
```

Public proof entry generated:
- `/proof/change-req_001`
- Shows: request → analysis → decision → delivery
- Transparent change history

---

## Real Examples

### Example 1: Swap (Authentication Method)

**Original:** Email + password authentication
**Request:** Switch to OTP (passwordless)

**Analysis:**
- Both are auth methods
- OTP is actually simpler (no password storage)
- Equal complexity

**Decision:** Swap (€0)
**Outcome:** Delivered in original timeline, no price change

---

### Example 2: Add (Analytics Dashboard)

**Original:** User signup + profile management
**Request:** Add analytics dashboard with charts

**Analysis:**
- New feature (analytics)
- New infrastructure (data aggregation, charting library)
- Significantly more complex

**Decision:** Add (new milestone)
**Price:** $12K
**Client:** Approved
**Outcome:** New AC.md created, Evidence Sprint → AC green

---

### Example 3: Swap (UI Framework)

**Original:** Build with React
**Request:** Use Vue instead

**Analysis:**
- Same output (UI components)
- Same complexity (modern frameworks)
- Personal preference, not new features

**Decision:** Swap (€0)
**Note:** Requested early in project, minimal rework
**Outcome:** Swapped, delivered on time

---

## Why This Prevents Scope Creep

### 1. Explicit Classification

Every change is either Swap or Add. No gray area.

**Client can't say:** "But it's just a small change!"
**We respond:** "Small changes are Swaps (€0). This is Add (new scope)."

### 2. Price Transparency

Adds are priced **before** work begins.

**No surprise invoices.** Client approves the price, then we build.

### 3. Baseline Protection

AC.md is frozen after baseline. Changes require CR.

**No scope drift.** Everyone knows exactly what was originally agreed.

### 4. Audit Trail

Every CR is tagged and generates a public proof entry.

**Full transparency:** Client can see every change request, decision, and delivery.

---

## How to Apply This

### If You're a Client

Before signing a contract, ask:

**"How do you handle scope changes?"**

**Red flags:**
- ❌ "We'll figure it out as we go"
- ❌ "Everything is included"
- ❌ "Change requests are $500/hour"

**Green flags:**
- ✅ "Changes are classified as Swap or Add"
- ✅ "Swaps are €0, Adds are priced before starting"
- ✅ "You approve all Adds before we begin work"

### If You're a Developer

Instead of:
- "That'll be extra" (no transparency)
- "Sure, I'll add it" (scope creep)
- "Let's discuss later" (deferred forever)

**Use CHG-130:**

1. Open CR: "Let me analyze this change"
2. Classify: "This is a Swap (€0)" or "This is an Add ($X)"
3. Get approval: "Approve the Add and I'll start Monday"
4. Deliver: "CR delivered, proof entry published"

---

## Common Questions

**"What if I'm not sure if something is Swap or Add?"**

That's what the analysis phase is for (Step 3).

We err on the side of transparency:
- If it's borderline, we explain both options
- Client decides if the Add is worth it
- If not, we stick with original scope

**"What if I want to Swap multiple things?"**

Each Swap is a separate CR.

**Why?** Audit trail. We want clear history of every change.

**"What happens if we disagree on Swap vs Add?"**

We provide complexity analysis:
- Lines of code estimate
- New dependencies required
- Infrastructure changes needed

If it's genuinely equal complexity, it's a Swap. If it's more, it's an Add.

Disagreement is rare because the analysis is objective.

**"Can I cancel an Add after approving?"**

Before work starts: Yes, full refund.
After work starts: Pro-rated based on completion %.
After delivery: No refund (you got working code).

---

## The Math That Matters

**Project without CHG-130:**
- Original quote: $40K
- "Just one more" × 12 changes
- Final invoice: $73K
- Client: "I never approved this!"
- Dispute, damaged relationship

**Project with CHG-130:**
- Original scope: $40K (baselined)
- 4 Swaps (€0 each)
- 3 Adds ($8K, $5K, $4K) — all approved upfront
- Final invoice: $57K
- Client: "I approved every Add, this is fair"
- Trust maintained

**The difference:** Transparency and control.

---

## What's Next?

At ScopeLock, CHG-130 is mandatory. We don't accept projects without baseline protection.

**Why?** It protects both parties:
- **Client:** No surprise costs
- **Developer:** No unpaid scope creep

**Want to see CHG-130 in action?**

Check our [Proof Log](/proof) for real change request examples.

**Ready to lock scope with baseline protection?**

[See our process](/process) or [schedule a call](/contact)

---

**Tags:** #scope-creep #change-control #project-management #chg-130 #scopelock

**SEO Keywords:** scope creep, change control, software project management, scope management, change request process, baseline protection
