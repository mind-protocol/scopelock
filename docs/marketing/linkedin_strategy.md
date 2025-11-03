# ScopeLock LinkedIn Strategy

**Version:** 1.0
**Created:** 2025-11-03
**Owner:** Rafael (Harbor) - Relationships & client communication
**Purpose:** Proof-driven LinkedIn presence that pre-qualifies prospects

---

## Core Positioning

**Brand Promise:** Lock the scope. Prove the value.

**LinkedIn Mission:** Demonstrate our approach publicly so prospects arrive pre-qualified:
- They understand pay-at-AC-green
- They've seen proof of delivery
- They know we don't do hourly billing
- They expect change control (CHG-130)

---

## What We NEVER Post

❌ **Performance Theater:**
- "Excited to announce..."
- "Thrilled to share..."
- "Proud to announce 1000 followers!"
- Motivational quotes without substance

❌ **Engagement Farming:**
- "What's your biggest challenge? 👇"
- "Tag someone who needs to see this"
- Generic "10 tips for..." threads
- Viral trend-jacking unrelated to our work

❌ **Vague Claims:**
- "Just shipped a major feature!" (without proof)
- "Significant improvement" (without numbers)
- "90% done" (except when critiquing it)
- Celebrating effort without outcomes

---

## What We ALWAYS Post

✅ **Proof-First Content:**
- Lead with tag, delta, /proof link
- Specific numbers and thresholds
- Acknowledge constraints and trade-offs
- Post AFTER delivery, not before

✅ **Verification Standard:**
Every post must pass: "Would this teach a prospect how we work OR show proof we delivered?"

If not, don't post it.

---

## Content Pillars (3-4 posts/week)

### 1. Proof Drops (Mondays) — PRIMARY CONTENT

Every AC green milestone becomes a LinkedIn post.

**Format:**
```
[Project name] shipped.

Before: [specific pain point with metric]
After: [specific outcome with delta]

Acceptance criteria:
• [functional criterion]
• [performance threshold with actual result]
• [verification method]

Proof: [link to /proof/milestone_tag]
Tag: ac-green_[milestone]_[date]

Pay at AC green. No estimates, no ambiguity.
```

**Example:**
```
OTP Signup shipped.

Before: 7-step email/password auth, 450ms p95
After: 3-step OTP, 180ms p95

Acceptance criteria:
• User receives OTP within 30s (actual: 8s avg)
• Login completes in <300ms p95 (actual: 180ms)
• 47 acceptance tests pass

Proof: scopelock.mindprotocol.ai/proof/ac-green_otp-signup_2025-11-02

Locked scope. Delivered at AC green.
```

---

### 2. Change Request Stories (Wednesdays)

Real CHG-130 examples showing Swap vs Add decisions.

**Format:**
```
Change Request: [brief title]

Client asked: "[exact quote]"
Analysis: [Swap or Add + reasoning]
Outcome: [what happened]

[Key insight about scope control]

Full CR: [link to /proof/change-req_]
```

**Example:**
```
Change Request: Email → SMS Notifications

Client asked: "Can we switch to SMS instead of email?"

Analysis: Swap (€0)
• Same functionality (notifications)
• Similar complexity (both external APIs)
• No new features, just delivery method change

Outcome: Updated AC.md, delivered in original milestone, €0 price change

The difference between Swap and Add prevents 90% of scope arguments.

Full CR: scopelock.mindprotocol.ai/proof/change-req_001
```

---

### 3. Evidence Sprint Showcases (Fridays)

2-5 day rapid prototypes with quantified deltas.

**Format:**
```
Evidence Sprint: [feature name]

Timeline: [X days]
Demo: [link to 90s video/GIF]

Delta:
• [metric 1]: [before → after]
• [metric 2]: [before → after]
• [qualitative change with specifics]

Most MVPs take 3 months to validate.
Evidence Sprints: 2-5 days, working demo, quantified delta.

Proof: [link]
```

**Example:**
```
Evidence Sprint: Real-time Collaboration

Timeline: 3 days
Demo: [90s video link]

Delta:
• Sync latency: 2.3s → 180ms
• Conflict resolution: manual → automatic (CRDT)
• User frustration: 47% → 8% (reported incidents)

Most MVPs take 3 months to validate.
Evidence Sprints: working demo + quantified delta in 2-5 days.

Proof: scopelock.mindprotocol.ai/proof/evidence-sprint_collab_2025-11-03
```

---

### 4. Anti-Pattern Callouts (Biweekly)

Short posts deconstructing common project dysfunction.

**Topics:**
- "90% done" (why it's meaningless without AC)
- Time estimates vs acceptance criteria
- Hourly billing incentive misalignment
- Fixed-bid padding theater
- "Just one more feature" math
- Meetings as progress theater

**Format:** Problem → Why it fails → ScopeLock alternative (with proof link)

**Example:**
```
"The project is 90% done."

Translation: We have no idea when it will ship.

Why "90% done" is meaningless:
• No acceptance criteria = no definition of "done"
• Remaining 10% often takes as long as first 90%
• Client can't verify the claim

ScopeLock alternative:
• Write AC.md with functional + non-functional criteria
• Build acceptance tests (executable verification)
• "Done" = tests green, not developer opinion

Example AC.md: scopelock.mindprotocol.ai/proof/ac-baseline_signup_2025-11-02

When criteria are explicit, "done" is unambiguous.
```

---

## Voice Guidelines

### Tone
- **Calm, matter-of-fact, slightly contrarian**
- Builder-grade precision (no fluff)
- Acknowledge trade-offs honestly
- Respect the reader's time

### Length
- **80-150 words** (readable in 30 seconds)
- Exception: Anti-pattern posts can go to 200 words

### Numbers
- **Always specific** (never "significant improvement")
- Include thresholds and actual results
- Show deltas with before → after

### Proof Links
- Every claim links to a tag or /proof page
- Never make unverifiable claims

### Phrases We Use
- "Pay at AC green"
- "No estimates, no ambiguity"
- "Locked scope"
- "Quantified delta"
- "Executable acceptance criteria"
- "Same milestone" (for Swaps)
- "New milestone" (for Adds)

### Phrases We NEVER Use
- "Excited to announce"
- "Game-changer"
- "Disrupting [industry]"
- "Passionate about"
- "Thrilled to share"
- "90% done" (except when critiquing)
- "Best practices" (unless we have proof)

---

## Profile Optimization

### Company Page: ScopeLock

**Tagline:**
"Lock the scope. Prove the value."

**About Section:**
```
ScopeLock delivers against executable acceptance criteria.
Clients pay at AC green.

No time estimates. No scope creep. No surprise costs.

Every milestone:
• AC.md (functional + non-functional criteria)
• Acceptance tests (automated verification)
• Public proof log (tags + deltas)
• CHG-130 change control (Swap or Add)

Evidence Sprints: 2-5 day prototypes with quantified deltas.

/proof shows every milestone we've shipped.

Website: scopelock.mindprotocol.ai
Proof Log: scopelock.mindprotocol.ai/proof
```

**Featured Section:**
1. Link to `/proof` (primary)
2. Blog: "Why Acceptance Criteria Beat Time Estimates"
3. Blog: "Change Control Without Scope Creep (CHG-130)"
4. Blog: "Fixed-Price vs Hourly: Why Outcome-Based Pricing Works"

---

### Personal Profiles (Team Members)

Each team member should include:

**Headline Format:**
```
[Role] at ScopeLock | [Specialty] | Pay-at-AC-green delivery
```

**Examples:**
- Rafael: "Relationships & Change Control at ScopeLock | Turning scope creep into Swap or Add decisions"
- Daniel: "Core Builder at ScopeLock | Acceptance tests → AC green | Evidence-driven delivery"
- Maya: "Frontend & Evidence UX at ScopeLock | Proof-first design | Lighthouse ≥90"

**About Section (include):**
- Brief intro of role at ScopeLock
- Link to `/proof` in first paragraph
- Mention specific domain expertise
- Include "Pay at AC green. No estimates, no ambiguity."

**Experience Section:**
Add recent milestones:
```
ScopeLock
[Role] | [Date] - Present

Recent milestones:
• [Milestone 1]: [brief outcome + delta]
• [Milestone 2]: [brief outcome + delta]

Proof: scopelock.mindprotocol.ai/proof
```

**Featured Section:**
1. Link to personal proof contributions
2. Link to relevant blog post
3. Link to recent milestone

---

## Engagement Strategy

### What to Engage With

✅ **Target Topics:**
- Posts about project failures (offer ScopeLock alternative)
- Discussions on scope creep and time estimates
- Questions about pricing models (hourly vs fixed vs outcome)
- Technical posts with specific metrics
- Questions about acceptance criteria or "definition of done"

✅ **Target Accounts:**
- CTOs and engineering leads
- Product managers struggling with scope
- Consultants/agencies with delivery issues
- SaaS founders managing dev teams

---

### How to Engage

**Comment Structure:**
1. Acknowledge their point
2. Share relevant experience (with specifics)
3. Offer ScopeLock alternative (if applicable)
4. Link to proof (if relevant)
5. Never pitch directly

**Example Comment:**
```
We've seen this pattern before. The root issue is usually undefined acceptance criteria.

When "done" is ambiguous, "90% done" becomes a 6-week negotiation.

We solve it by writing AC.md upfront with executable tests. When tests are green, milestone is complete. No ambiguity.

Example: scopelock.mindprotocol.ai/proof/ac-baseline_signup_2025-11-02
```

**Response Time:**
- Comments on our posts: <24h
- Prospect questions via DM: <2h (during work hours)
- Non-urgent engagement: daily batch (15 min)

---

### What NOT to Engage With

❌ **Avoid:**
- Inspirational/motivational content
- Hot takes without substance
- Viral trends unrelated to our domain
- Arguments or flame wars
- "Agree?" engagement bait

---

## Content Calendar

### Weekly Rhythm

| Day | Content Type | Owner |
|-----|-------------|-------|
| Monday | Proof Drop (if shipped last week) | Rafael |
| Wednesday | Change Request story OR blog share | Rafael |
| Friday | Evidence Sprint showcase OR anti-pattern | Rafael |

### Optional (as relevant)
- Daily engagement: 3-5 targeted comments (15 min) - Rafael
- Response to comments on our posts: within 24h - Rafael
- DM responses: <2h during work hours - Rafael

---

### Monthly Content Mix

**Required:**
- 3-4 Proof Drops (milestones shipped)
- 2-3 Change Request stories
- 2 Evidence Sprint showcases
- 1-2 Anti-pattern callouts
- 2-3 Blog article shares

**Optional (as available):**
- Client testimonial shares
- Behind-the-scenes (e.g., "How we wrote AC.md for X")
- Team member spotlights (with proof of their work)

---

## First 30 Days Action Plan

### Week 1: Foundation
- [ ] Optimize company page (about, tagline, /proof link)
- [ ] Update team member profiles with ScopeLock positioning
- [ ] Post: "What ScopeLock is and why we built it"
- [ ] Engage on 15 relevant posts

### Week 2: Proof Library
- [ ] Create 3 Proof Drop posts from existing `/proof` entries
- [ ] Schedule for Mon/Wed/Fri
- [ ] Engage on 20 relevant posts
- [ ] Respond to all comments <24h

### Week 3: Blog Amplification
- [ ] Share each blog post as native LinkedIn article OR text post with key excerpt
- [ ] Extract 3-4 key insights per blog as separate posts
- [ ] Create GIFs of interactive features (calculator, decision tree)
- [ ] Engage on 20 relevant posts

### Week 4: Community Building
- [ ] Post one Change Request story
- [ ] Share client testimonial (if available)
- [ ] Post anti-pattern callout ("90% done")
- [ ] Follow up with 5 engaged prospects via DM
- [ ] Engage on 25 relevant posts

---

## Metrics That Matter

Track monthly. Focus on quality over vanity metrics.

### Acquisition (Emma's domain)
- **Inbound leads mentioning LinkedIn** (primary)
- Profile views → website visits conversion
- Post impressions → /proof visits conversion
- DMs from qualified prospects

### Relationship (Rafael's domain)
- **Comments from prospects asking questions** (engagement depth)
- Direct messages requesting calls
- Testimonial shares from clients
- Repeat engagement from same accounts (relationship building)

### Authority Indicators
- **Saves** (people want to reference later)
- **Shares** (people endorse the approach)
- **Thoughtful comments** (not just "great post!")
- **Inbound questions** about AC.md, CHG-130, or our approach

### Content Performance
- Proof Drops: avg impressions, engagement rate
- Change Request stories: saves, shares
- Evidence Sprints: video views, click-through to /proof
- Anti-patterns: engagement rate, shares

---

## Monthly Review Questions

**Content Quality:**
1. Did every post link to proof?
2. Were all metrics specific (no vague claims)?
3. Did we post after delivery (not before)?

**Prospect Qualification:**
1. Are inbound leads mentioning our approach before calls?
2. Do they understand pay-at-AC-green?
3. Are they asking about CHG-130 or Evidence Sprints?

**Community Building:**
1. Are we getting repeat engagement from target accounts?
2. Are prospects sharing our posts?
3. Are we being tagged in relevant discussions?

---

## Red Flags (Stop Immediately If You See These)

🚨 **Warning Signs:**
1. Posting about effort without outcomes
2. Using phrases like "excited to announce"
3. Sharing content without proof links
4. Engagement farming ("What's your biggest challenge? 👇")
5. Posting before delivery
6. Vague metrics ("significant improvement")
7. Inspirational quotes unrelated to our work
8. Celebrating vanity metrics (follower counts)

**Corrective Action:**
- Delete the post if it doesn't meet quality bar
- Review voice guidelines before next post
- Get Aïcha or Rafael review approval for next 3 posts

---

## Long-Term Authority Play

**Goal:** When someone searches "acceptance criteria", "scope creep solution", or "pay at completion" on LinkedIn, ScopeLock appears in results.

**Method:**
- Consistent posting (3x/week minimum)
- Every post links to proof
- Build library of saved posts (reference material)
- Speaking at events (recorded, shared on LinkedIn)
- Guest articles on relevant publications
- Case studies with quantified deltas

**Compounding Effect:**
- Month 1: 50 impressions/post (building foundation)
- Month 3: 200 impressions/post (network effect starts)
- Month 6: 800+ impressions/post (recognized voice)
- Month 12: Inbound leads recognize ScopeLock before first call

**Target State (12 months):**
Prospects arrive on first call saying:
- "I've been following your proof log"
- "I saw your post about CHG-130"
- "I want the pay-at-AC-green model"

---

## Ownership & Responsibilities

### Rafael (Harbor) — Primary Owner
- Write and publish all posts
- Respond to comments within 24h
- Handle DM conversations with prospects
- Monthly review of metrics
- Maintain content calendar

### Emma (Scout)
- Monitor LinkedIn for qualified leads
- Flag opportunities for engagement
- Track: profile views → website visits
- Report: inbound leads mentioning LinkedIn

### Maya (Facet)
- Create visual assets (proof screenshots, demo GIFs)
- Design quote cards (if needed for testimonials)
- Optimize images for LinkedIn (1200x627 for links)

### Daniel (Forge)
- Provide technical metrics and deltas for Proof Drops
- Review technical accuracy of posts
- Supply acceptance test results for Evidence Sprint posts

### Aïcha (Architect)
- Review posts for accuracy (especially CHG-130 explanations)
- Ensure proof links are correct
- Verify claims are backed by actual implementation

---

## Post Templates

### Template 1: Proof Drop

```
[Project Name] shipped.

Before: [pain point with metric]
After: [outcome with delta]

Acceptance criteria:
• [criterion 1 with result]
• [criterion 2 with result]
• [criterion 3 with result]

Proof: [link]
Tag: [tag]

Pay at AC green. No estimates, no ambiguity.
```

---

### Template 2: Change Request

```
Change Request: [title]

Client asked: "[exact quote]"

Analysis: [Swap/Add] ([€0/price])
• [reasoning point 1]
• [reasoning point 2]
• [reasoning point 3]

Outcome: [what happened]

[Key insight about scope control]

Full CR: [link]
```

---

### Template 3: Evidence Sprint

```
Evidence Sprint: [feature name]

Timeline: [X days]
Demo: [link]

Delta:
• [metric 1]: [before → after]
• [metric 2]: [before → after]
• [qualitative change]

Most MVPs take 3 months to validate.
Evidence Sprints: working demo + quantified delta in 2-5 days.

Proof: [link]
```

---

### Template 4: Anti-Pattern

```
"[Common phrase or belief]"

Translation: [what it really means]

Why [phrase] is [problematic]:
• [reason 1]
• [reason 2]
• [reason 3]

ScopeLock alternative:
• [solution 1]
• [solution 2]
• [solution 3]

Example: [proof link]

[Closing insight]
```

---

### Template 5: Blog Share

```
[Hook - one sentence problem statement]

In our latest article, we cover:
• [key point 1]
• [key point 2]
• [key point 3]

[One key insight or takeaway]

Read: [blog link]
Proof: [related /proof link if applicable]
```

---

## Tools & Resources

### Content Creation
- **Text editor:** Draft posts offline (avoid LinkedIn mobile bugs)
- **Image optimization:** Maya handles via design tools
- **Video recording:** Loom or native screen recording (90s max)
- **GIF creation:** Use existing tools for interactive demo captures

### Scheduling
- LinkedIn native scheduler (preferred for organic reach)
- OR: Buffer/Hootsuite if coordinating with other platforms

### Analytics
- LinkedIn native analytics (company page + personal)
- Track custom UTM parameters for /proof links: `?utm_source=linkedin&utm_medium=social&utm_campaign=proof-drop`

### Tracking Sheet (Monthly)
```
Date | Post Type | Link | Impressions | Engagement | Saves | Shares | Comments | DMs | Leads
```

---

## Bottom Line

LinkedIn isn't about "building a following."

It's about demonstrating our approach publicly so prospects arrive pre-qualified:
- They understand pay-at-AC-green
- They've seen proof of delivery
- They know we don't do hourly billing
- They expect change control (CHG-130)

**Every post should pass this test:**
"Would this teach a prospect how we work OR show proof we delivered?"

If not, don't post it.

---

**Next Action:** Week 1 foundation setup (company page optimization + team profile updates)
