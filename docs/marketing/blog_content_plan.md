# ScopeLock Blog Content Plan

**Version:** 1.0
**Last Updated:** 2025-11-02
**Purpose:** Authority building, client education, SEO, differentiation

---

## Content Strategy

**Goals:**
1. **Educate clients** on why ScopeLock methodology works
2. **Build SEO** around "acceptance criteria", "scope lock", "evidence-based delivery"
3. **Differentiate** from hourly freelancers and agencies
4. **Demonstrate expertise** through technical depth and real examples
5. **Generate inbound leads** via search and social sharing

**Voice:** Builder-grade, calm, precise. Evidence over adjectives. No buzzwords.

**Format:** 800-1,500 words per post. Code examples, screenshots, real deltas when possible.

**Cadence:** 1 post per Evidence Sprint delivery (organic tie-in to real work)

---

## Priority 1: Foundation Posts (Ship First)

These establish core ScopeLock concepts and rank for key search terms.

### Post 1: "Why Acceptance Criteria Beat Time Estimates"

**Target Audience:** Clients burned by "2 weeks" that became 2 months

**Key Points:**
- Time estimates incentivize slow work (hourly) or padding (fixed-bid)
- AC.md defines outcome, not effort
- Tests remove "is it done?" ambiguity
- Example: 3 identical projects, 3 different time estimates—but AC.md would be the same

**SEO Keywords:** acceptance criteria, time estimates, software project management, scope definition

**CTA:** See our [pricing](/pricing) or [schedule a kickoff](/contact)

**Estimated Length:** 1,200 words

**Examples to Include:**
- Sample AC.md (OTP signup from /process page)
- Comparison table: Time estimate vs AC approach
- Real scenario: "Developer says 90% done, but what does that mean?"

**Status:** READY TO WRITE (can use existing docs)

---

### Post 2: "The Evidence Sprint: Prove Value in 90 Seconds"

**Target Audience:** Clients hesitant to commit to full builds without seeing progress

**Key Points:**
- Most MVPs fail because they're not really minimal (3 months to validate)
- Evidence Sprint = working demo + quantified delta in 2-5 days
- ≤90s demo rule forces clarity: "If I can't show it in 90s, is it valuable?"
- DELTA.md requires numbers, not feelings

**SEO Keywords:** evidence sprint, rapid prototyping, MVP development, working demo

**CTA:** Book an [Evidence Sprint](/pricing) ($3K-6K, 2-5 days)

**Estimated Length:** 1,000 words

**Examples to Include:**
- Before/after delta (p95: 1200ms → 280ms, steps: 7 → 3)
- Screenshot of DEMO.md + DELTA.md structure
- Comparison: "Evidence Sprint vs traditional 'discovery phase'"

**Status:** READY TO WRITE (can use delivery_model.md + client_guide.md)

---

### Post 3: "Change Control Without Scope Creep: CHG-130 Explained"

**Target Audience:** Clients frustrated by "just one more feature" becoming $10K surprise

**Key Points:**
- Scope creep kills projects (and trust)
- CHG-130: every change is either Swap (€0) or Add (new price)
- Client always approves pricing before work begins
- Baseline guard: AC.md can't change without CR after baseline tag

**SEO Keywords:** scope creep, change control, software project management, scope management

**CTA:** See how we handle scope changes in our [process](/process)

**Estimated Length:** 900 words

**Examples to Include:**
- Real Swap example: "Email notifications → SMS notifications" (equal complexity)
- Real Add example: "Add mobile app + push notifications" (new milestone)
- Diagram: Baseline tag → Change Request → Swap/Add decision tree

**Status:** READY TO WRITE (can use delivery_model.md CHG-130 section)

---

## Priority 2: Technical Depth Posts (Demonstrate Expertise)

These show technical chops and attract developer/CTO readers.

### Post 4: "Fail-Loud: Why We Don't Catch Errors Silently"

**Target Audience:** Technical readers (CTOs, senior devs)

**Key Points:**
- Silent fallbacks hide problems until production
- Fail-loud principle: any catch either rethrows or emits failure.emit{code_location}
- Better to fail visibly in staging than silently in production
- How we enforce this (Sofia's review verdicts, mp-lint rules)

**SEO Keywords:** error handling, fail-loud, defensive programming, software quality

**CTA:** See our [quality standards](/about) or [FAQ on security](/faq)

**Estimated Length:** 1,200 words

**Examples to Include:**
- Code example: Silent fallback (bad) vs fail-loud (good)
- Real incident: "Error rate was 12%, we thought it was 0.1%" (if we have one)
- How to implement fail-loud in your codebase

**Status:** NEEDS REAL EXAMPLES (wait until we have shipped projects with this)

---

### Post 5: "Event-Native Architecture: Build-Time Proof, Static Runtime"

**Target Audience:** Technical readers, developers interested in architecture

**Key Points:**
- /proof is generated at build time, not runtime fetched
- Events as first-class citizens (evidence-sprint.tagged@1.0, ac.green@1.0)
- Why: determinism, portability, no hidden state
- Mind Protocol influence (event-native, membrane-first)

**SEO Keywords:** event-driven architecture, static site generation, proof generation, build-time optimization

**CTA:** Check our [public Proof Log](/proof)

**Estimated Length:** 1,500 words

**Examples to Include:**
- Diagram: Git tag → proofgen → static /proof output
- Code snippet: Event schema example
- Comparison: Runtime API calls vs build-time generation

**Status:** NEEDS TECHNICAL EXAMPLES (can write after /proof is fully operational)

---

### Post 6: "How We Deliver in 1 Week What Agencies Quote in 8"

**Target Audience:** Founders comparing ScopeLock to agencies

**Key Points:**
- Agencies optimize for billable hours, not speed
- Meetings, phases, "discovery" all extend timeline
- Our advantage: no meetings overhead, AI citizens for parallel work, clear AC
- Not about working harder—about eliminating waste

**SEO Keywords:** rapid development, agency alternative, fast software delivery, startup development

**CTA:** Compare our [pricing](/pricing) to agency quotes

**Estimated Length:** 1,100 words

**Examples to Include:**
- Timeline comparison: Agency (12 weeks) vs ScopeLock (2 weeks)
- Real case study (when available): "Client's agency quoted 8 weeks, we delivered in 6 days"
- What we cut: status meetings, discovery phases, internal coordination

**Status:** READY TO WRITE (can use upwork_profile.txt + pricing comparisons)

---

## Priority 3: Case Studies (Proof of Delivery)

These are evidence-based posts tied to real projects.

### Post 7: "Case Study: OTP Signup in 5 Days (p95 ↓77%)"

**Target Audience:** Prospective clients wanting proof

**Structure:**
- **Challenge:** Client needed passwordless auth, fast
- **Approach:** Evidence Sprint → AC green
- **AC.md:** Functional + non-functional criteria
- **Evidence Sprint:** Working demo in 3 days
- **Delta:** p95: 1200ms → 280ms (↓77%), steps: 7 → 3 (↓57%)
- **AC Green:** All tests passing, delivered day 5
- **Proof:** [Link to /proof tag]

**SEO Keywords:** passwordless authentication, OTP implementation, rapid development case study

**CTA:** See more [case studies](/case-studies) or [schedule a kickoff](/contact)

**Estimated Length:** 800 words

**Examples to Include:**
- Screenshot of AC.md
- Screenshot of DELTA.md
- Link to live /proof entry
- Client testimonial (if available)

**Status:** WRITE AFTER FIRST REAL DELIVERY (needs actual project)

---

### Post 8: "Case Study: [Next Real Project]"

**Format:** Same as Post 7

**Status:** TEMPLATE READY, needs real project

---

## Priority 4: SEO & Differentiation

Posts targeting specific search queries and positioning.

### Post 9: "Fixed-Price vs Hourly: Why Outcome-Based Pricing Works"

**Target Audience:** Clients comparing pricing models

**Key Points:**
- Hourly: incentivizes slow work, unpredictable total
- Fixed-bid: contractor assumes all risk, often pads heavily
- ScopeLock: fixed price + payment at AC green = aligned incentives
- Client knows cost upfront, pays only when tests pass

**SEO Keywords:** fixed-price development, hourly vs fixed-price, software pricing models

**CTA:** See our [transparent pricing](/pricing)

**Estimated Length:** 1,000 words

**Status:** READY TO WRITE

---

### Post 10: "What Is an Acceptance Criteria Document (AC.md)?"

**Target Audience:** Clients unfamiliar with AC concept

**Key Points:**
- Definition: functional + non-functional + verification
- Why: eliminates "is it done?" ambiguity
- How to write one (co-authoring process)
- Example AC.md walkthrough

**SEO Keywords:** acceptance criteria, software requirements, AC.md, requirements document

**CTA:** [Schedule a ScopeLock call](/contact) to co-write your AC.md

**Estimated Length:** 900 words

**Status:** READY TO WRITE (use /process page example)

---

## Priority 5: Operational Transparency

Behind-the-scenes posts that build trust.

### Post 11: "How We Use AI Citizens (Not ChatGPT Wrappers)"

**Target Audience:** Technical readers curious about AI partnership model

**Key Points:**
- Domain-specific citizens (Emma, Rafael, Sofia, Daniel, Aïcha, Maya, Priya)
- Each owns a domain, not general-purpose assistants
- 15 years of custom tooling, not prompt engineering
- Parallel work streams: architecture + features + quality simultaneously

**SEO Keywords:** AI development team, multi-agent systems, AI partnership, autonomous AI agents

**CTA:** Learn about [our team](/about)

**Estimated Length:** 1,300 words

**Status:** READY TO WRITE (can use team_structure.md + upwork_profile.txt)

---

### Post 12: "Inside the Proof Log: How We Generate Build-Time Evidence"

**Target Audience:** Technical readers, transparency-focused clients

**Key Points:**
- Git tags as source of truth (evidence-sprint_*, ac-green_*)
- proofgen reads tags, extracts /proof/AC.md, /proof/DEMO.md, /proof/DELTA.md
- Generates static HTML + JSON (no runtime fetches)
- Why: determinism, portability, client can verify independently

**SEO Keywords:** proof generation, git tags, static site generation, evidence-based delivery

**CTA:** Browse our [Proof Log](/proof)

**Estimated Length:** 1,200 words

**Status:** WRITE AFTER /PROOF IS OPERATIONAL (needs real examples)

---

## Publishing Schedule

**Phase 1 (Month 1):** Foundation
- Week 1: Post 1 (Why Acceptance Criteria Beat Time Estimates)
- Week 2: Post 2 (The Evidence Sprint)
- Week 3: Post 3 (Change Control Without Scope Creep)
- Week 4: Post 9 (Fixed-Price vs Hourly)

**Phase 2 (Month 2):** Technical Depth + Differentiation
- Week 5: Post 6 (How We Deliver in 1 Week)
- Week 6: Post 11 (How We Use AI Citizens)
- Week 7: Post 10 (What Is AC.md?)
- Week 8: Post 4 (Fail-Loud) *if we have examples*

**Phase 3 (Month 3+):** Case Studies + Advanced Topics
- Week 9+: Post 7, 8 (Case studies as projects complete)
- Week 10+: Post 5 (Event-Native Architecture)
- Week 11+: Post 12 (Inside the Proof Log)

**Ongoing:** 1 case study post per Evidence Sprint delivered

---

## Distribution Strategy

**Channels:**
1. **Blog (/blog)** — Primary home
2. **LinkedIn** — Share with founder/CTO network
3. **X (Twitter)** — Thread format, link to full post
4. **Telegram** — NLR_AI channel
5. **Hacker News** — Submit technical posts (Post 4, 5, 11, 12)
6. **Dev.to / Medium** — Cross-post for reach (canonical link to our blog)

**Internal Linking:**
- Every post links to at least 2 other pages (/pricing, /process, /about, /faq, /contact)
- Case studies link to /proof entries
- Technical posts link to /process for methodology

**SEO Optimization:**
- Meta descriptions (150-160 chars)
- H1 = post title, H2 = sections
- Alt text on images/screenshots
- Internal linking to other posts + pages
- External links to authoritative sources (minimal, only when necessary)

---

## Content Creation Process

**For each post:**

1. **Research** (30 min)
   - Review relevant docs (delivery_model.md, team_structure.md, etc.)
   - Check existing /proof entries for examples
   - Find real deltas, screenshots if available

2. **Outline** (15 min)
   - Key points (3-5 bullets)
   - Examples to include
   - CTA decision

3. **Draft** (60-90 min)
   - Write in builder-grade voice (calm, precise, no buzzwords)
   - Use real examples, code snippets, numbers
   - Include comparison tables where relevant

4. **Review** (30 min)
   - Sofia checks for clarity and quality
   - Rafael checks for client-facing accuracy
   - Aïcha checks technical claims

5. **Publish** (15 min)
   - Add to /blog page
   - Meta tags, SEO optimization
   - Schedule social posts

**Total time per post:** 2.5-3 hours

---

## Success Metrics

**Track:**
- Page views per post
- Time on page (>2 min = engaged)
- Click-through to /pricing, /contact (conversion intent)
- Social shares (LinkedIn, X)
- Inbound links (DA >30 sites)
- Search ranking for target keywords (3 months to rank)

**Goals (6 months):**
- 10 posts published
- 5,000+ monthly blog visitors
- 50+ inbound leads attributed to blog
- 3+ posts ranking page 1 for target keywords

---

## Quick-Start: First 3 Posts (Week 1-3)

**Post 1: "Why Acceptance Criteria Beat Time Estimates"**
- Status: Ready to write (all material exists in docs)
- Effort: 2.5 hours
- Impact: HIGH (core differentiator, SEO)

**Post 2: "The Evidence Sprint: Prove Value in 90 Seconds"**
- Status: Ready to write
- Effort: 2.5 hours
- Impact: HIGH (unique methodology, SEO)

**Post 3: "Change Control Without Scope Creep: CHG-130 Explained"**
- Status: Ready to write
- Effort: 2.5 hours
- Impact: MEDIUM-HIGH (addresses common pain point)

**Total effort:** ~7.5 hours for first 3 posts (spread over 3 weeks)

**Immediate action:** Draft Post 1 this week

---

## Post Templates

### Template: Concept Post

```markdown
# [Title: How/Why/What Is X]

[Hook: 1-2 sentences stating the problem]

## The Problem

[2-3 paragraphs: what goes wrong with traditional approach]

## The ScopeLock Approach

[2-3 paragraphs: how we solve it]

### Example

[Real example with code/screenshot/delta]

## Why This Works

[Bullet points: benefits]

## How to Apply This

[3-5 actionable steps for reader]

## What's Next?

[CTA paragraph with link]
```

### Template: Case Study Post

```markdown
# Case Study: [Project Name] — [One-line outcome]

**Client:** [Industry] (anonymized if needed)
**Timeline:** [X days]
**Delta:** [Key metrics]

## The Challenge

[What client needed, why it was urgent]

## The Approach

### ScopeLock Phase
[AC.md highlights]

### Evidence Sprint
[Demo + delta]

### AC Green
[Tests passing, delivery]

## The Results

[Quantified outcomes]

## Proof

[Link to /proof entry]

[Client testimonial if available]

## Want Similar Results?

[CTA]
```

---

## Content Library (Reference Material)

**For writers:**
- docs/core/delivery_model.md — ScopeLock methodology
- docs/core/team_structure.md — Citizen roles
- docs/core/client_guide.md — Client-facing explanations
- docs/design/brand_and_ui_styleguide.md — Voice & tone
- docs/marketing/upwork_profile.txt — Positioning language
- /process page — AC.md example

**Voice guide:**
- ✅ "Tests pass" not "high quality"
- ✅ "p95: 280ms" not "very fast"
- ✅ "7 steps → 3 steps" not "much simpler"
- ✅ Builder-grade, calm, precise
- ❌ No "transformation," "innovative," "cutting-edge"

---

**Next Action:** Draft Post 1 ("Why Acceptance Criteria Beat Time Estimates") this week
