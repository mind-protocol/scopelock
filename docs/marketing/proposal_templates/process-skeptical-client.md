# Proposal Template: Process-Skeptical Client

**Use when:**
- Job post contains "No Agencies"
- Client mentions past disasters with vendors
- Client emphasizes "fixed price only"
- Technical founder/CTO doing their own vetting
- Client sounds burned or cynical

**Key strategy:** Lead with code/deliverables, minimize branded terms, make verification easy, address objections preemptively.

---

## Template Structure

### 1. Hook (Attention Filter Respect)

```
[KEYWORD FROM JOB POST]

[One-sentence acknowledgment of their situation/timeline]
```

**Example:**
```
PINEAPPLE

You need the backend live so your MVP can launch.
```

---

### 2. Pushback (Peer Positioning)

```
[Scope observation that shows you understand the work]
```

**Example:**
```
Seven deliverables is ambitious for $3,000, so let me propose a smarter path:
we build the core value first ([specific risky part]), prove it works with
real [relevant test], then expand to [remaining features] as separate
milestones with clear pricing.
```

---

### 3. Proof (Verifiable Links)

```
We built [Project Name] ([live-link]), [what it does with relevant tech].
You can verify our work at github.com/nlr-ai (personal) and
github.com/mind-protocol (org - includes [specific repos with metrics]).
```

**Example:**
```
We built DuoAI (duoai.vercel.app), a gaming companion that integrates
Claude vision API for real-time screen analysis. You can verify our work at
github.com/nlr-ai (personal) and github.com/mind-protocol (org - includes
terminal-velocity with 1.1k stars, therapykin, kinkong).
```

**Why this capability matters to your project:**
```
That same [capability] applies directly to [their project]: [brief technical
flow]. We know how to make [relevant tech] reliable in production, not just
prototypes.
```

---

### 4. Deliverables (Concrete Code)

**Lead with "Here's the actual work":**

```
Here's the actual work for Milestone 1 ($[PRICE] fixed, [DAYS] days):

1. [Concrete deliverable 1]
2. [Concrete deliverable 2]
3. [Concrete deliverable 3]
4. [Concrete deliverable 4]
5. [Tests + verification]
```

**Example:**
```
Here's the actual work for Milestone 1 ($3,000 fixed, 7 days):

1. Secure upload API (Supabase signed URLs)
2. Claude vision integration → structured JSON skin analysis
3. PDF generation (your logo, analysis summary, placeholder routine)
4. Deploy to Vercel + Postman collection
5. Acceptance tests (works with real selfies, not just theory)
```

---

### 5. Process (Brief, No Branded Terms)

```
Before I start, we co-write the acceptance criteria together: [specific
questions about their requirements]. I build to those criteria. You pay only
when the tests pass.

If you want to change something mid-build: Swap (replace at same complexity,
no charge) or Add (new milestone, priced upfront). No surprise invoices.
```

**DO NOT USE:**
- "Evidence Sprint"
- "AC green"
- "ScopeLock"
- "Proof entry"

**USE INSTEAD:**
- "Milestone 1"
- "Tests pass"
- "Acceptance criteria"
- "Working demo"

---

### 6. Pricing (Transparent)

```
After Milestone 1 proves [core value], we scope [remaining features] as
Milestone 2. You see working [core capability] before committing to the full
build. If [quality concern], we fix it in Milestone 1—not after you've paid
for everything.
```

**If you can estimate Milestone 2, include it:**
```
Milestone 2 estimate: $[LOW]-[HIGH] ([features]—mostly [type of work])

Total project: $[LOW]-[HIGH]
```

---

### 7. Catch Handling (Preemptive)

```
What's the catch?

"Pay only when tests pass" sounds too good. Here's how it works: acceptance
criteria are executable tests in code, not subjective judgment. When the
tests pass, milestone is done. If you want to change the criteria, that's a
scope change (priced upfront). If tests pass but it's still broken, I fix
the tests and code at no charge—that's on me.
```

**Optional addition if they mentioned "No Agencies":**
```
Full disclosure: I'm a solo engineer using AI-assisted development (Claude,
Cursor, aider). No subcontractors. No outsourcing. One architect, AI
workforce, clear accountability.
```

---

### 8. Question (Strategic Product Focus)

```
I'm in [location], available [time window] for calls. We can kick off within
[timeframe] if you want to move fast.

Reply with one thing: [specific product question that shows strategic
thinking and helps you scope]
```

**Example:**
```
I'm in France, available 14:00-19:00 Central (US time) for calls. We can
kick off within 72 hours if you want to move fast.

Reply with one thing: what does a "good" skin analysis look like to you
(specific data points, tone, detail level)? That shapes the vision prompt
and determines if 7 days is realistic or if we need 10.
```

---

### 9. Signature (Links Only, No Branding)

```
Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available [time window] for calls
```

**DO NOT USE:**
- "ScopeLock — Lock the scope. Prove the value."
- "Evidence Sprint specialist"
- Any branded taglines

---

## Complete Example (Skin Genius Project)

```
PINEAPPLE

You need the backend live so your MVP can launch. Seven deliverables is
ambitious for $3,000, so let me propose a smarter path: we build the core
value first (vision AI plus PDF generation), prove it works with real photos
and acceptance tests, then expand to the full dashboard and product catalog
as separate milestones with clear pricing.

We built DuoAI (duoai.vercel.app), a gaming companion that integrates Claude
vision API for real-time screen analysis. You can verify our work at
github.com/nlr-ai (personal) and github.com/mind-protocol (org - includes
terminal-velocity with 1.1k stars, therapykin, kinkong). That same vision
integration capability applies directly to skin analysis: upload photo, send
to Claude/GPT-4o vision with structured prompt, parse JSON response, generate
PDF with before-after layout. We know how to make vision APIs reliable in
production, not just prototypes.

Here's the actual work for Milestone 1 ($3,000 fixed, 7 days):

1. Secure upload API (Supabase signed URLs)
2. Claude vision integration → structured JSON skin analysis
3. PDF generation (your logo, analysis summary, placeholder routine)
4. Deploy to Vercel + Postman collection
5. Acceptance tests (works with real selfies, not just theory)

Before I start, we co-write the acceptance criteria together: What does
"structured JSON skin analysis" actually contain? What triggers a passing
test? I build to those criteria. You pay only when the tests pass.

If you want to change something mid-build: Swap (replace at same complexity,
no charge) or Add (new milestone, priced upfront). No surprise invoices.

After Milestone 1 proves the AI works, we scope login, dashboard, and
product catalog as Milestone 2. You see working vision AI and PDFs before
committing to the full build. If the analysis quality isn't there, we fix it
in Milestone 1—not after you've paid for everything.

What's the catch?

"Pay only when tests pass" sounds too good. Here's how it works: acceptance
criteria are executable tests in code, not subjective judgment. When the
tests pass, milestone is done. If you want to change the criteria, that's a
scope change (priced upfront). If tests pass but it's still broken, I fix
the tests and code at no charge—that's on me.

I'm in France, available 14:00-19:00 Central (US time) for calls. We can
kick off within 72 hours if you want to move fast.

Reply with one thing: what does a "good" skin analysis look like to you
(specific data points, tone, detail level)? That shapes the vision prompt
and determines if 7 days is realistic or if we need 10.

Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available 14:00–19:00 Central for calls
```

---

## Checklist Before Sending

- [ ] KEYWORD from job post included
- [ ] Pushback demonstrates understanding of work
- [ ] Verifiable links (live product + GitHub)
- [ ] Deliverables listed BEFORE process explanation
- [ ] No "Evidence Sprint," "AC green," or "ScopeLock" terminology
- [ ] Pricing transparency (Milestone 2 estimate if possible)
- [ ] "What's the catch?" section included
- [ ] Strategic product question at end
- [ ] Signature has links only, no branding taglines
- [ ] 400-600 words total
- [ ] No "No Agencies" acknowledgment (unless they mentioned it in post)

---

**See also:** [../branding_communication_guide.md](../branding_communication_guide.md) for full context
