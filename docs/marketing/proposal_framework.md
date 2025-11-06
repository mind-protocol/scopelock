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
-[platform not up anymore] (live demo - Claude vision API integration)
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

### 9. P.S. (Positioning Automation)

**Purpose:** Address the "Why is this senior person applying to my small job?" objection

**The Problem:**
- Your profile shows $75k$ AUMprojects, 1.1k GitHub stars, successful exits
- Client has a $600 chatbot job
- Implicit question: "What's the catch? Why is he here?"

**The Solution:**
Add a brief P.S. that positions automation as the reason:

```
P.S. I apply to small missions because I automate a lot. AI generates
the code, I supervise. It keeps me sharp on new patterns while staying
cost-effective for clients. Win-win.
```

**Why it works:**
- **Addresses objection proactively** (doesn't leave it as mystery)
- **Positions automation as advantage** (not "I'm desperate")
- **Confidence signal** (testing automation, not grinding for rent)
- **Differentiates from competition** (most won't mention automation)
- **True** (Rafael generates code, you supervise)

**When to use:**
- ✅ For $200-$1000 missions (where credibility gap is largest)
- ✅ For process-skeptical clients (reduces "too good to be true" fear)
- ⚠️ Skip for $2K+ missions (automation mention might reduce perceived value)
- ⚠️ Skip if client explicitly wants "no AI" or "human-only"

**Variations:**

**For chatbot/AI missions:**
```
P.S. I apply to small AI missions because I'm testing new Claude/GPT
patterns at scale. You get senior architecture at tactical pricing
because I'm optimizing for learning, not maximum revenue.
```

**For dashboard/CRUD missions:**
```
P.S. I apply to small missions because my AI workflow makes them
profitable at this price point. What used to take 40 hours takes 8.
I'd rather build than stay idle.
```

**What NOT to say:**
- ❌ "I'm using this to test my AI team" (sounds like guinea pig)
- ❌ "AI does everything" (reduces your value)
- ❌ "I have free time" (sounds desperate)
- ❌ Over-explain automation details (keep it brief)

**Strategic notes:**
- Keep it **1-2 sentences maximum** (P.S. should be quick read)
- Place it **after** the strategic question (last thing they read)
- Tone should be **confident, not defensive**
- Frame automation as **your advantage**, not apology

---

## Complete Proposal Templates

### Business Buyer Template (PRIMARY - 70% of revenue)

**Target:** Marketing managers, founders, small business owners - time-scarce, results-driven, risk-averse

**Budget range:** $400-1500

**Decision timeline:** 3-5 days (they move fast once they decide you're credible)

**Works for:** Creative AI (voice, images, presentations) AND development (dashboards, APIs, automation)

**Length:** 200-300 words (shorter than Technical Buyer templates - they skim fast)

---

#### Structure

1. **Personal greeting + pain mirror** (1 sentence - show you read their post)
2. **What they'll GET** (specific deliverables, outcome-focused, no jargon)
3. **When they'll get it** (timeline - speed matters)
4. **Fixed price with risk reversal** (removes budget anxiety)
5. **One relevant sample/proof link** (show, don't tell)
6. **Simple CTA** (frictionless next step, removes decision fatigue)

---

#### Language Rules

**❌ NEVER use:**
- Technical jargon: "API", "CI/CD", "acceptance criteria", "executable tests", "p95 latency"
- Process terms: "ScopeLock", "Evidence Sprint", "AC.md", "milestone", "acceptance criteria"
- Tool names: "Next.js", "Python", "Vercel", "FastAPI", "PostgreSQL"
- Time estimates: "10-12 hours of work", "this will take X days"

**✅ ALWAYS use:**
- Outcome focus: "You'll have X", "You'll be able to Y"
- Speed signals: "delivered in 5 days", "first version by Friday", "ready by Monday"
- Visual/live proof: Show working examples (live URLs, not GitHub repos)
- Plain language: "dashboard" not "admin panel", "works on mobile" not "responsive design"

---

#### Example 1: Development (Dashboard)

```
Hi Sarah,

I saw you need a dashboard to manage customer data. Here's what you'll get:

1. Clean dashboard showing all your customers in one place
2. Search and filter by name, email, or signup date
3. Export to Excel anytime
4. Works on desktop and mobile

Delivered in 7 days. Fixed price: $800 (includes 2 free revision rounds if anything needs tweaking).

You can see a similar dashboard I built here: therapykin.ai/demo

Want to start Monday? I'll send you the first working version by Friday.

Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available 14:00-19:00 Central for calls
```

**Why this works:**
- Time-scarce founders can skim in 30 seconds
- No jargon = no imposter syndrome trigger ("what's an API?")
- Fixed price + risk reversal = removes budget anxiety
- Live proof link = credibility without bragging
- Simple CTA = removes decision fatigue ("Want to start Monday?")
- Timeline shows urgency ("first version by Friday")

---

#### Example 2: Creative AI (Voice Generation)

```
Hey Marcus,

I can generate those 10 podcast voiceovers for you. Here's what you'll get:

1. 10 professional voiceovers (your scripts, any voice style you want)
2. High quality audio files (ready to publish)
3. 2 free revisions per voiceover if the tone isn't quite right

Delivered in 3 days. Fixed price: $400.

You can hear voice samples I've generated here: [portfolio URL with audio players]

Ready to start tomorrow? Send me the first 3 scripts and I'll show you what's possible.

Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available 14:00-19:00 Central for calls
```

**Why this works:**
- Addresses their immediate pain (need voiceovers)
- Speed signal (3 days = faster than hiring voice actors)
- Risk reversal (2 free revisions per voiceover)
- Live audio samples (proof they can actually hear)
- Low friction CTA ("send me first 3 scripts")

---

#### Example 3: Creative AI (Image Generation - Presentation Slides)

```
Hi Jessica,

I can create those 20 custom images for your investor presentation. Here's what you'll get:

1. 20 professional images matching your brand colors
2. High resolution (perfect for slides and printouts)
3. 2 free revisions if any image doesn't match your vision

Delivered in 4 days. Fixed price: $600.

You can see examples of presentation images I've created here: [portfolio with visual examples]

Need these by Friday? I can prioritize your project - just send me the 5 most important slides first.

Nicolas
github.com/nlr-ai • github.com/mind-protocol
Available 14:00-19:00 Central for calls
```

**Why this works:**
- Addresses urgent need (investor presentation = high stakes)
- Clear deliverable (20 images, not "image generation service")
- Risk reversal builds confidence (2 revisions per image)
- Visual proof (they can see quality before committing)
- Urgency acknowledged ("Need these by Friday?")

---

## Pricing Psychology for Business Buyers

**Context:** Business Buyers fear overpaying and making bad decisions. They're not technical, so they can't evaluate code quality or technical complexity. They evaluate on three factors: price transparency, speed, and risk.

### The 6 Pricing Rules

#### 1. ALWAYS Propose Fixed Price (Never Hourly for Defined Work)

**Why it works:**

Hourly pricing triggers three fears in Business Buyers:
- **Uncertainty fear:** "What if it takes longer than estimated? Will I get surprised with a bigger bill?"
- **Verification anxiety:** "How do I know they're not padding hours? I can't watch them work."
- **Budgeting paralysis:** "I can't plan my budget if the final cost is a range."

Fixed pricing removes all three fears. One number = they can decide yes/no immediately.

**Examples:**

❌ **BAD (hourly with range):**
"I charge $50/hour, this will take about 10-15 hours = $500-750"

✅ **GOOD (fixed with included value):**
"Fixed price: $650 (dashboard with 3 main features + 2 revision rounds)"

**When to use hourly (rare exceptions):**
- Ongoing retainer relationships after first project
- Truly undefined scope (exploration/research work)
- Client explicitly requests hourly AND you've established trust

#### 2. Include Risk Reversal ("2 Free Revisions" or "First Draft in 24h, Pay Only If You Like It")

**Why it works:**

Business Buyers are risk-averse. They've been burned before (see upwork_client_personas_research.md - the $80K disaster stories). Risk reversal flips the risk from them to you, which builds instant trust.

**Risk reversal options:**

**For creative work ($400-800):**
- "2 free revision rounds if anything needs tweaking"
- "First 3 samples delivered in 24h - if you don't like the style, no charge"
- "Unlimited revisions until you're happy (within original scope)"

**For development work ($600-1200):**
- "2 weeks of free bug fixes after delivery"
- "First working version in 48h - you can test it before paying anything"
- "Full refund if dashboard doesn't load in under 2 seconds"

**For high-value projects ($1200+):**
- "30-day money-back guarantee if it doesn't do what we agreed"
- "Free fixes for any issues in first 60 days"
- "Pay 50% upfront, rest only when you approve final version"

**Examples:**

❌ **BAD (no risk reversal):**
"Fixed price: $800. Payment upfront."

✅ **GOOD (risk reversal reduces fear):**
"Fixed price: $800 (includes 2 free revision rounds if anything needs tweaking)"

#### 3. Price Anchoring (Start High-Middle, Can Negotiate Down)

**Why it works:**

Business Buyers expect to negotiate (they're used to vendor negotiations). If you start at your floor price, they'll still ask for a discount and you'll either lose margin or have to say no (which feels confrontational).

**The anchoring strategy:**

1. **Calculate your acceptable range** based on AI-assisted time:
   - Low: Minimum you'll accept (e.g., $600 for 8 hours AI work)
   - High: Maximum they'd pay (e.g., $900 for similar scope)

2. **Quote high-middle** (e.g., $850):
   - Leaves room for small discount without losing margin
   - Positions you as premium (not desperate)

3. **Have negotiation plan ready:**
   - If they say "too expensive": "I can do $700 if we simplify feature X to just Y"
   - If they ghost: Follow up Day 3 with "$750 if you commit by Friday"
   - Floor price: $650 (below this, decline politely)

**Examples:**

❌ **BAD (starting at floor):**
"Fixed price: $600" → Client asks for $500 → You lose margin or say no

✅ **GOOD (anchoring high-middle):**
"Fixed price: $850" → Client asks for discount → "I can do $700 if we remove the Excel export feature"

#### 4. Use "All-Inclusive" Language (No Hidden Costs)

**Why it works:**

Business Buyers fear surprise charges. "All-inclusive" removes that fear and makes decision simple: one price = everything you need.

**What to include explicitly:**

For development work:
- Hosting setup (if applicable)
- Testing
- Deployment
- Documentation
- X revision rounds
- X days/weeks of bug fixes

For creative work:
- Source files (if applicable)
- Different formats (PNG, JPG, MP4, etc.)
- X revisions
- Commercial usage rights

**Examples:**

❌ **BAD (vague, implies hidden costs):**
"Fixed price: $800 for dashboard development"

✅ **GOOD (all-inclusive, transparent):**
"Fixed price: $800 (includes dashboard development, hosting setup, 2 revision rounds, and 30 days of bug fixes - no surprise charges)"

#### 5. Justify Price with Value, Not Hours

**Why it works:**

Business Buyers don't care how long it takes you. They care what it does for them (time saved, money made, problem solved). Justifying with hours makes them think "Why should I pay $50/hour when Fiverr is $10/hour?"

**The value justification formula:**

[Fixed price] - [Tangible outcome they care about]

**Examples:**

❌ **BAD (justifying with hours):**
"$800 because this is 10-12 hours of development work at my rate"

✅ **GOOD (justifying with value):**
"$800 - you'll save 5+ hours/week managing customers manually. That's 20+ hours/month back."

❌ **BAD (technical justification):**
"$500 for 8 hours of voice generation work using ElevenLabs API"

✅ **GOOD (outcome justification):**
"$500 - you'll have 10 podcast episodes ready to publish this week instead of waiting weeks for voice actor availability"

**More value justification examples:**

For dashboards:
- "See all your customer data in one place instead of juggling 3 spreadsheets"
- "Your team can update records themselves without asking you"

For voice generation:
- "Publish content 3x faster than hiring voice actors"
- "Consistent voice across all episodes (no scheduling conflicts)"

For image generation:
- "Professional images without waiting days for designer revisions"
- "Change images anytime (no designer retainer needed)"

#### 6. Payment Milestones for Projects $800+ (Not Full Upfront)

**Why it works:**

Business Buyers are cautious with money, especially with new vendors. Milestones build trust by showing you're confident in delivering value incrementally.

**Milestone structure by budget:**

**Under $600:** Full payment on delivery (one milestone)
- Why: Small enough that risk feels manageable
- Example: "$400 - pay when I deliver all 10 voiceovers"

**$600-1200:** 50% upfront, 50% on delivery (two milestones)
- Why: Balanced risk (you get commitment, they get proof before full payment)
- Example: "$800 total. $400 to start, $400 when dashboard is live and tested"

**$1200+:** 40% upfront, 40% at midpoint, 20% on delivery (three milestones)
- Why: Reduces risk for both (you get paid as you deliver, they pay as they verify)
- Example: "$1500 total. $600 to start, $600 when first version is live, $300 when everything is approved"

**Examples:**

❌ **BAD (full upfront for high-value work):**
"Fixed price: $1200. Payment upfront."
→ Business Buyer thinks: "What if they take my money and disappear?"

✅ **GOOD (milestone structure):**
"Fixed price: $1200. Payment: $500 upfront (to start work), $500 when dashboard is live for testing, $200 when everything is approved."
→ Business Buyer thinks: "I only pay the full amount after I see it works."

---

### Template A: Process-Skeptical Client (TECHNICAL BUYERS)

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

P.S. I apply to small missions because I automate a lot. AI generates
the code, I supervise. It keeps me sharp on new patterns while staying
cost-effective for clients. Win-win.

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
-[platform not up anymore] (Claude vision API in production)

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
