# Proposal Template: Process-Oriented Client

**Use when:**
- Technical CTO or engineering leader
- Job post emphasizes process, documentation, testing
- Client asks about methodology or workflow
- Startup with investor demos/milestones
- Client wants clarity on "done"

**Key strategy:** Lead with methodology, explain process clearly, use branded terms confidently, provide structure.

---

## Template Structure

### 1. Hook (Attention Filter Respect)

```
[KEYWORD FROM JOB POST]

[One-sentence acknowledgment of their situation/timeline]
```

**Example:**
```
LIGHTHOUSE

Your investor demo is in 3 weeks and the current build is fragile.
```

---

### 2. Pushback (Peer Positioning)

```
[Scope observation that shows you understand the work + methodology insight]
```

**Example:**
```
Eight features in 3 weeks is aggressive, especially if the acceptance
criteria aren't locked yet. I recommend we Evidence Sprint the 3 features
that matter for the demo, prove they work with quantified deltas, then
expand post-demo with clear milestones.
```

---

### 3. Proof (Verifiable Links)

```
We built [Project Name] ([live-link]), [what it does with relevant metrics].
Check github.com/nlr-ai and github.com/mind-protocol (includes [repos with
stars/metrics]). [Capability statement with production context].
```

**Example:**
```
We built La Serenissima (serenissima.ai), an AI system with 130+ persistent
agents running for 6+ months in production (50,000+ state updates/hour).
Check github.com/nlr-ai and github.com/mind-protocol (includes
terminal-velocity with 1.1k stars). We know how to ship complex AI systems
that don't just demo well—they run reliably under load.
```

---

### 4. Methodology (ScopeLock Process)

**Explain the approach:**

```
Here's how we work (scopelock.mindprotocol.ai explains the full process):

1. ScopeLock: We co-write acceptance criteria (functional + non-functional
   requirements, executable tests, seed data). Baseline locked with git tag.

2. Evidence Sprint: Working demo in [timeframe], quantified delta
   (e.g., "Signup p95: 1200ms → 280ms, steps: 7 → 3"), published proof
   entry.

3. AC Green: You pay only when all tests pass (CI green) and performance
   thresholds are met.

For changes: Swap (equal/lower complexity, €0, same milestone) or Add (new
milestone with its own AC and price). Every milestone gets a public proof
entry showing what shipped and what the delta was.
```

---

### 5. Deliverables (Concrete + Process Context)

```
For [Project Name], I recommend this Evidence Sprint:

[Milestone name]: [Price] fixed, [timeframe]
- [Deliverable 1 with technical detail]
- [Deliverable 2 with technical detail]
- [Deliverable 3 with technical detail]
- [Non-functional requirement: performance, quality]
- [Verification: tests + seed data]

After this Evidence Sprint proves [core value], we scope [remaining
features] as separate AC-locked milestones. You see working [capability]
with quantified results before committing to the full build.
```

**Example:**
```
For your investor demo, I recommend this Evidence Sprint:

Demo-Ready Core: $6,000 fixed, 10 days
- Real-time dashboard with live data (WebSocket + React)
- AI prediction engine (Claude API with structured output)
- Performance: p95 < 500ms for predictions, 99.9% uptime
- Visual polish: branded theme, loading states, error handling
- Verification: Playwright tests with seed data, Lighthouse >90

After this Evidence Sprint proves the core experience works, we scope the
admin panel and API integrations as Milestone 2.
```

---

### 6. Pricing (Transparent + Structure)

```
Milestone structure:

Evidence Sprint: $[PRICE]
- [Core features for demo/validation]
- Timeline: [days]

Milestone 2 estimate: $[LOW]-[HIGH]
- [Remaining features]
- Timeline: [days]

Total project: $[LOW]-[HIGH]
Payment: 50/50 split (baseline lock + AC green)

The AI-assisted workflow means faster delivery—you're not paying $150/hr for
a human to type boilerplate. You're paying for architecture, tests, and
verifiable results.
```

---

### 7. Process Confidence (Why ScopeLock Works)

```
What this prevents:

"2 Weeks" Becomes 5 Months
→ Executable acceptance criteria define "done", not judgment calls

Scope Creep Surprises
→ Change Control: every change is Swap (€0) or Add (new price), you approve
first

"Tests Pass" But It's Broken
→ You can run the tests yourself, exact command + seed data in AC.md

The catch: acceptance criteria are executable tests in code, not subjective
judgment. When tests pass, milestone is done. Want to change criteria?
That's a Change Request (Swap or Add). If tests pass but it's still broken,
I fix the tests and code at no charge.
```

---

### 8. Question (Strategic Product Focus)

```
I'm in [location], available [time window] for calls. We can kick off within
[timeframe] if you want to move fast.

Reply with: [strategic question about their requirements or constraints]
```

**Example:**
```
I'm in France, available 14:00-19:00 Central (US time) for calls. We can
kick off within 48 hours if you want to move fast for the demo.

Reply with: What are the 3 metrics the investors will judge the demo on?
That shapes the Evidence Sprint scope and determines what we can cut safely.
```

---

### 9. Signature (With Branding)

```
Nicolas
ScopeLock — Lock the scope. Prove the value.
github.com/nlr-ai • github.com/mind-protocol
Available [time window] for calls
```

---

## Complete Example (Investor Demo Rush)

```
LIGHTHOUSE

Your investor demo is in 3 weeks and the current build is fragile. Eight
features in 3 weeks is aggressive, especially if the acceptance criteria
aren't locked yet. I recommend we Evidence Sprint the 3 features that matter
for the demo, prove they work with quantified deltas, then expand post-demo
with clear milestones.

We built La Serenissima (serenissima.ai), an AI system with 130+ persistent
agents running for 6+ months in production (50,000+ state updates/hour).
Check github.com/nlr-ai and github.com/mind-protocol (includes
terminal-velocity with 1.1k stars, KinKong trading $75k$ AUM). We know how
to ship complex AI systems that don't just demo well—they run reliably under
load.

Here's how we work (scopelock.mindprotocol.ai explains the full process):

1. ScopeLock: We co-write acceptance criteria (functional + non-functional
   requirements, executable tests, seed data). Baseline locked with git tag.

2. Evidence Sprint: Working demo in 7-10 days, quantified delta
   (e.g., "Dashboard load: 3.2s → 480ms"), published proof entry.

3. AC Green: You pay only when all tests pass (CI green) and performance
   thresholds are met.

For changes: Swap (equal/lower complexity, €0, same milestone) or Add (new
milestone with its own AC and price). Every milestone gets a public proof
entry showing what shipped and what the delta was.

For your investor demo, I recommend this Evidence Sprint:

Demo-Ready Core: $6,000 fixed, 10 days
- Real-time dashboard with live data (WebSocket + React)
- AI prediction engine (Claude API with structured output)
- Performance: p95 < 500ms for predictions, 99.9% uptime
- Visual polish: branded theme, loading states, error handling
- Verification: Playwright tests with seed data, Lighthouse >90

After this Evidence Sprint proves the core experience works, we scope the
admin panel and API integrations as Milestone 2 ($4,000-6,000 estimate).

What this prevents:

"2 Weeks" Becomes 5 Months
→ Executable acceptance criteria define "done", not judgment calls

Scope Creep Surprises
→ Change Control: every change is Swap (€0) or Add (new price), you approve
first

"Tests Pass" But It's Broken
→ You can run the tests yourself, exact command + seed data in AC.md

The catch: acceptance criteria are executable tests in code, not subjective
judgment. When tests pass, milestone is done. Want to change criteria?
That's a Change Request (Swap or Add). If tests pass but it's still broken,
I fix the tests and code at no charge.

I'm in France, available 14:00-19:00 Central (US time) for calls. We can
kick off within 48 hours if you want to move fast for the demo.

Reply with: What are the 3 metrics the investors will judge the demo on?
That shapes the Evidence Sprint scope and determines what we can cut safely.

Nicolas
ScopeLock — Lock the scope. Prove the value.
github.com/nlr-ai • github.com/mind-protocol
Available 14:00–19:00 Central for calls
```

---

## Checklist Before Sending

- [ ] KEYWORD from job post included
- [ ] Pushback demonstrates methodology understanding
- [ ] Verifiable links with metrics (live product + GitHub)
- [ ] ScopeLock process explained (3 phases)
- [ ] "Evidence Sprint," "AC green" terminology used confidently
- [ ] Deliverables with non-functional requirements
- [ ] Pricing transparency (Milestone 2 estimate)
- [ ] "What this prevents" section included
- [ ] Strategic product question at end
- [ ] Signature includes "ScopeLock — Lock the scope. Prove the value."
- [ ] 500-700 words total
- [ ] Process explanation comes BEFORE or alongside deliverables

---

## When to Use Which Template

**Use Process-Oriented Template if:**
- Job post mentions "testing," "CI/CD," "documentation," "process"
- Client is a CTO or engineering leader at a funded startup
- Previous communication showed they value methodology
- They ask "how do you work?" or "what's your process?"
- Timeline is tight (investor demo, launch deadline)

**Use Process-Skeptical Template if:**
- Job post says "No Agencies"
- Client mentions past vendor disasters
- Client emphasizes "fixed price" or "no hourly"
- Technical founder doing their own vetting
- Skeptical or burned tone in job post

**If unsure:** Start with Process-Skeptical template (safer, less friction). You can introduce methodology after they engage.

---

**See also:** [../branding_communication_guide.md](../branding_communication_guide.md) for full context
