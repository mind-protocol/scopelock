# ScopeLock Proposal Framework

**Date:** 2025-11-02
**Purpose:** Structure and templates for client proposals
**Audience:** Emma (Scout), Rafael (Harbor)

---

## The Two-Speed Strategy

### Discovery

Different clients need different communication styles, but you can't know which until they engage.

### The Solution

**First contact: Neutral-to-skeptical positioning**
- Lead with deliverables
- Minimize branded terms
- Make verification easy
- Address "the catch" proactively

**After engagement: Adapt to their response**
- If they use your terminology → lean into methodology
- If they ask about process → explain ScopeLock fully
- If they stay code-focused → keep it technical

---

## Optimal Proposal Structure

### 1. Hook (Attention Filter Respect)

**Purpose:** Prove you read their requirements, not sending template

**Example:**
```
PINEAPPLE confirmed (attention filter check).
```

**Why it works:**
- Shows you read carefully
- Filters out lazy applicants
- Signals attention to detail

### 2. Pushback (Peer Positioning)

**Purpose:** Establish yourself as peer consultant, not desperate vendor

**Example:**
```
Seven deliverables is ambitious for $3,000, so let me propose a smarter path:
we build the core value first (vision API + analysis quality), validate it works,
then expand to the full feature set.
```

**Why it works:**
- Immediate peer positioning (not a servant)
- Shows experience (seen this scope-budget mismatch before)
- Activates Negotiator mode (not Rejection mode)
- Differentiates from "yes men"

### 3. Proof (Verifiable Links)

**Purpose:** Enable immediate verification

**Example:**
```
You can verify our work at:
- github.com/nlr-ai (personal - 65K commits in 2024, includes aider-assisted development)
- github.com/mind-protocol (org - terminal-velocity with 1.1k stars, therapykin, duoai)
- duoai.vercel.app (live demo - Claude vision API integration)
```

**Why it works:**
- Links feed Auditor mode (verification fantasy)
- Parenthetical context doesn't feel like bragging
- Multiple verifiable signals
- Shows AI tooling transparency

### 4. Deliverables (Concrete Code)

**Purpose:** Show actual work, not promises

**For Process-Skeptical Clients:**
```
Here's the actual work for Milestone 1 ($3,000):

1. Vision API Integration
   - Claude Sonnet 4.5 for skin analysis
   - Prompt engineering for [specific conditions client mentioned]
   - Error handling + fallbacks

2. Analysis Quality
   - Structured JSON output (condition, severity, confidence, recommendations)
   - Tests with [X] seed images covering edge cases

3. PDF Generation
   - Professional report template
   - Chart visualizations for severity metrics
   - Export tested across devices

4. Tests + Deploy
   - Acceptance tests (p95 <500ms for analysis)
   - Vercel deployment + GitHub Actions CI
```

**For Process-Friendly Clients:**
```
Evidence Sprint (Milestone 1) - $3,000:

This milestone validates the core risk: can we make vision API analysis
reliable enough for production use?

Deliverables:
[Same numbered list as above]

Acceptance Criteria:
- Vision API returns structured analysis in <500ms (p95)
- PDF generation completes in <2s
- All tests pass in CI
- Live deploy accessible for your review
```

**Key difference:** Process-friendly gets methodology context first, skeptical gets deliverables immediately.

### 5. Process (Briefly)

**For Process-Skeptical:**
```
We co-write acceptance criteria as executable tests. When tests pass,
milestone is done—no subjective judgment. You pay only when tests are green.
```

**For Process-Friendly:**
```
ScopeLock Process:
1. We co-write AC.md with functional + non-functional criteria
2. Build to passing tests (Evidence Sprint)
3. You verify on live deploy
4. Pay only at "AC green" (tests passing in CI)

See full process: scopelock.mindprotocol.ai/process
```

### 6. Pricing (Transparent)

**Always show total cost upfront:**

```
Milestone 1: $3,000 (core risk validation)
Milestone 2 estimate: $2,500-$3,500 (login, dashboard, catalog—mostly CRUD)

Total project: $5,500-$6,500

The AI workforce means Milestone 2 is cheaper, not more expensive—
you're not paying $60-150/hr for a human to type boilerplate.
```

**Why this works:**
- Shows total cost upfront
- Explains why later milestones are cheaper (AI advantage)
- Kills the "bait-and-switch" fear
- Client can budget accurately

### 7. "What's The Catch?" (Preemptive Trust Building)

**Include for process-skeptical clients:**

```
WHAT'S THE CATCH?

"Pay only when tests pass" sounds too good. Here's how it works:

Q: What if I'm unreasonable and keep saying "not good enough"?
A: Acceptance criteria are executable tests in code, not subjective judgment.
   If tests pass, milestone is done. Want to change criteria? That's a Change Request.

Q: What if tests pass but it's still broken?
A: Tests were wrong—I fix at no charge. But if tests correctly verify original
   criteria and you want new criteria, that's a scope change.

Q: How do you prevent infinite revisions?
A: AC includes exact test command + seed data. When CI is green, you can verify
   yourself. Done means done.
```

### 8. Question (Strategic Close)

**Purpose:** Show strategic thinking, invite response

**Product-focused questions:**
```
Reply with one thing: what does a "good" skin analysis look like to you
(specific data points, tone, detail level)? That shapes the vision prompt
and determines if 7 days is realistic.
```

**Other examples:**
- "What's the current performance bottleneck?"
- "What would 'success' look like in 3 months?"
- "Which of the 7 features creates the most user value?"

**Why it works:**
- Proves you're thinking about the product, not just the sale
- Forces them to engage (can't just ghost)
- Positions you as strategic partner
- Makes proposal a conversation, not a pitch

---

## Complete Proposal Templates

### Template A: Process-Skeptical Client

**Signals:**
- "No Agencies" in post
- Past disaster mentioned
- Budget-constrained
- Detailed requirements with verification emphasis

**Proposal (400-500 words):**

```
[Attention filter check - if they included one]

[Pushback sentence - "Ambitious for $3K, let me propose smarter path"]

You can verify our work at:
- github.com/nlr-ai (personal - [relevant project])
- github.com/mind-protocol (org - [stars/metrics])
- [live-demo-url] (working example)

Here's the actual work for Milestone 1 ($3,000):

1. [Core feature with tech details]
2. [Quality/performance deliverable]
3. [Testing + deployment]
4. [Specific metric or output]

Milestone 2 estimate: $[X]-$[Y] ([remaining features])
Total project: $[X]-$[Y]

We co-write acceptance criteria as executable tests. When tests pass,
milestone is done—no subjective judgment. You pay only when tests are green.

WHAT'S THE CATCH?

[Q&A format addressing scope change, broken tests, revisions]

Reply with one thing: [strategic product question]?

Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available 14:00–19:00 Central for calls
```

### Template B: Process-Friendly Client

**Signals:**
- Mentions "process," "methodology," "framework"
- Asks for "acceptance criteria," "test coverage"
- Enterprise or VC-backed context
- Quality/reliability emphasis

**Proposal (400-500 words):**

```
[Attention filter check - if included]

[Brief intro with methodology mention]

You can verify our work at:
- github.com/nlr-ai (personal - [relevant project])
- github.com/mind-protocol (org - [stars/metrics])
- scopelock.mindprotocol.ai/process (methodology documentation)

ScopeLock Process:
1. Co-write AC.md with executable acceptance criteria
2. Evidence Sprint: working demo + quantified delta
3. Build to AC green (tests passing in CI)
4. You pay only when tests pass

Evidence Sprint (Milestone 1) - $[amount]:

This milestone validates [core risk]. We'll deliver:

1. [Feature with acceptance criteria]
2. [Performance/quality with metrics]
3. [Tests + deployment with verification]

Acceptance Criteria:
- [Functional criterion]
- [Non-functional criterion with metric]
- [Verification command]

Milestone 2 estimate: $[X]-$[Y] ([remaining scope])
Total project: $[X]-$[Y]

Reply with one thing: [strategic product question]?

Nicolas
ScopeLock — Lock the scope. Prove the value.
Available 14:00–19:00 Central for calls
```

---

## Word Count & Length

### Optimal Length

**Proposals:** 400-600 words (dense but readable)

- Too short (<300) = looks like template
- Too long (>700) = looks like desperation

**Structure Timing:**
- Hook: 1 sentence
- Pushback: 1-2 sentences
- Proof: 1 paragraph (3 links)
- Deliverables: 4-6 numbered items
- Process: 1-2 paragraphs
- "What's the catch?" (optional): 1 paragraph
- Close + question: 2 sentences

---

## Signature Strategy

### Process-Skeptical Signature

```
Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available 14:00–19:00 Central for calls
```

**Why:**
- No branding = no "marketing consultant" vibe
- Links = verifiable proof (Auditor satisfied)
- Availability = frictionless next step

### Process-Friendly Signature

```
Nicolas
ScopeLock — Lock the scope. Prove the value.
Available 14:00–19:00 Central for calls
```

**Why:**
- "ScopeLock" = system/methodology (they value process)
- Tagline = positioning statement
- Same structure, different emphasis

---

## Portfolio Presentation

### The Formula

```
[Project name] ([verifiable link]): [specific deliverable] with [relevant tech/metric]

Proves: [capability relevant to their project]
```

### Examples

**✅ Strong:**
```
DuoAI (duoai.vercel.app): Gaming companion integrating Claude vision API
for real-time screen analysis + voice response

Proves: We can make vision APIs reliable in production, not just prototypes
```

**✅ Strong:**
```
Terminal Velocity (github.com/nlr-ai/terminal-velocity): 1.1k GitHub stars,
526-page novel on Amazon, written by 10 autonomous AI agents

Proves: We can architect complex multi-agent systems that deliver finished products
```

**❌ Weak:**
```
We have experience with AI
```

**❌ Weak:**
```
We've built consciousness systems
```

---

## Common Mistakes to Avoid

### DON'T:

❌ Use branded terms with skeptical clients upfront
❌ Lead with process for burned founders
❌ Hide the Mind Protocol org (they'll find it)
❌ Brag about commit counts (let them verify)
❌ Say "excited, honored, passionate, perfect fit"
❌ Promise hours or daily availability
❌ Skip the trap word (PINEAPPLE or whatever they used)
❌ End with "When do we start?"
❌ Generic "I can do this" without proof
❌ Copy-paste obvious template

### DO:

✅ Pushback in first sentence ("ambitious for $3K")
✅ Lead with verifiable proof (live sites + GitHub)
✅ Detect client type (process-friendly vs skeptical)
✅ Adjust terminology accordingly
✅ Add "What's the catch?" for burned founders
✅ End with strategic product question
✅ Let them discover details (don't over-explain)
✅ Be transparent about AI tooling (but briefly)

---

## Adaptation Examples

### Example 1: Same Content, Different Ordering

**For Process-Skeptical (Burned Founder):**
1. Pushback
2. Proof links
3. **Deliverables first** ← Lead with code
4. Brief process explanation
5. "What's the catch?"
6. Question

**For Process-Friendly (Technical CTO):**
1. Brief intro
2. Proof links
3. **Process explanation first** ← Lead with methodology
4. Evidence Sprint deliverables
5. Acceptance criteria
6. Question

**Key insight:** Same substance, different packaging = 10x difference in trust.

---

## The Ultimate Test

Before sending any proposal, ask:

1. ✅ Did I pushback? (peer positioning)
2. ✅ Can they verify everything? (links to live demos + GitHub)
3. ✅ Did I lead with what they care about? (code for skeptical, process for friendly)
4. ✅ Did I address their fears proactively? ("What's the catch?")
5. ✅ Did I end with a strategic question? (not "when do we start?")

**If all 5 = ✅, send it.**

---

## Examples of Proposals That Worked

### Example A: Skin Analysis App (Process-Skeptical)

**Client signals:**
- Posted "No Agencies"
- Mentioned $80K disaster
- 7 deliverables for $3K (unrealistic scope)
- Attention filter: PINEAPPLE

**Our proposal (key elements):**

```
PINEAPPLE confirmed.

Seven deliverables is ambitious for $3,000, so let me propose a smarter path:
we build the core value first (vision API quality), validate it works, then expand.

You can verify our work at:
- github.com/nlr-ai (65K commits in 2024)
- github.com/mind-protocol (terminal-velocity: 1.1k stars)
- duoai.vercel.app (Claude vision API in production)

Here's the actual work for Milestone 1 ($3,000):
1. Vision API Integration...
2. Analysis Quality...
3. PDF Generation...
4. Tests + Deploy...

Milestone 2 estimate: $2,500-$3,500 (login, dashboard, catalog)
Total: $5,500-$6,500

WHAT'S THE CATCH?
[Q&A format]

Reply with one thing: what does a "good" skin analysis look like to you?

Nicolas
github.com/nlr-ai • github.com/mind-protocol
```

**Result:** Client spent 20+ minutes verifying, replied positively.

---

## Proposal Checklist

**Before sending, verify:**

- [ ] Included attention filter word (if they used one)
- [ ] Pushback in first 2 sentences
- [ ] 2-3 verifiable links (live demos + GitHub)
- [ ] Client type detected (skeptical vs. friendly)
- [ ] Terminology adapted accordingly
- [ ] Deliverables numbered and specific
- [ ] Total cost shown upfront (not hidden)
- [ ] "What's the catch?" included (if skeptical signals)
- [ ] Ended with strategic product question
- [ ] Signature matches client type
- [ ] Proofread for typos (hurts credibility)
- [ ] Word count: 400-600 words

---

**Last Updated:** 2025-11-02
**Owner:** Emma (Scout - proposal drafting), Rafael (Harbor - client comms)
**Next Review:** After 20 proposals using this framework
