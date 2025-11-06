# ScopeLock Roadmap

**Version:** 1.0
**Date:** 2025-11-02
**Purpose:** Concrete phases, milestones, and priorities

---

## Current State (2025-11-02)

### ✅ Completed

**Website & Proof System:**
- Next.js website live at scopelock.mindprotocol.ai
- Proof Log functional (`/proof` with index + detail pages)
- First proof entry: website itself (AC green, 26 passing tests)
- Build pipeline: proofgen → static HTML → Vercel deploy

**Citizen Infrastructure:**
- 7 citizens with defined domains (Emma, Rafael, Daniel, Sofia, Maya, Aïcha, Priya)
- Emma manual workflow (Upwork lead processing)
- SYNC.md collaboration protocol
- Clear handoff requirements

**Documentation:**
- Delivery model documented (ScopeLock → Evidence Sprint → AC Green)
- Portfolio (7 projects: Terminal Velocity, La Serenissima, etc.)
- Brand guide (process-skeptical vs process-friendly personas)
- Client guide (how to work with ScopeLock)

**Acceptance Testing:**
- 30 test cases across 5 files
- Playwright + Chromium infrastructure
- CI workflow configured
- R-500 compliance (all AC executable)

### 🚧 In Progress

- Manual Upwork lead processing (Emma + Nicolas)
- 20 posts target for first session

### ❌ Not Started

- Paid client engagement
- Testimonial collection
- Pricing validation
- Automated lead processing

---

## Phase 1: Prove the Model (Weeks 1-12)

**Goal:** Deliver 3-5 client milestones, validate pricing, collect testimonials

### Week 1-2: Client Acquisition

**Deliverables:**
- [ ] 20 Upwork posts evaluated (Emma)
- [ ] 5-10 proposals sent
- [ ] 1-2 responses/calls booked
- [ ] First client engagement confirmed

**Success Criteria:**
- Proposal response rate ≥15%
- At least 1 kickoff call scheduled
- GO rate on leads ≥30%

**Owner:** Emma (leads) → Rafael (client comms)

---

### Week 2-4: First Evidence Sprint

**Deliverables:**
- [ ] Co-written `AC.md` with client (functional + non-functional + verification)
- [ ] Baseline tag: `ac-baseline_client-feature_2025-11-XX`
- [ ] Working demo (≤90s)
- [ ] `DEMO.md` + `DELTA.md` with quantified improvements
- [ ] Tag: `evidence-sprint_client-feature_2025-11-XX`
- [ ] `/proof` entry published

**Success Criteria:**
- Client approves AC.md (no scope creep)
- Demo shows visible progress
- Delta has 2+ quantified metrics (p95, steps, error rate, etc.)
- Client opts to proceed to AC green OR pays for Evidence Sprint

**Owner:** Rafael (AC) → Daniel (build) → Sofia (verdict) → Maya (publish)

**Pricing:** $3K-$6K depending on scope

---

### Week 4-8: First AC Green

**Deliverables:**
- [ ] Full implementation per AC.md
- [ ] Acceptance tests green in CI
- [ ] Performance thresholds met (p95, quality gates)
- [ ] Tag: `ac-green_client-feature_2025-11-XX`
- [ ] `/proof` entry updated
- [ ] Invoice issued (payment at AC green)
- [ ] Client testimonial requested

**Success Criteria:**
- All acceptance criteria met (functional + non-functional)
- Client accepts delivery without disputes
- Payment received within NET 15
- Testimonial collected (with measurable outcome)

**Owner:** Daniel (implementation) → Sofia (quality gate) → Rafael (client handoff) → Priya (invoice)

**Pricing:** $5K-$15K depending on scope

---

### Week 8-12: Repeat x2

**Deliverables:**
- [ ] Second client milestone (Evidence Sprint or AC green)
- [ ] Third client milestone (Evidence Sprint or AC green)
- [ ] 3 total proof entries in `/proof` log
- [ ] 2-3 testimonials with measurable outcomes
- [ ] Case study draft for 1 client project

**Success Criteria:**
- 3 paid milestones delivered
- 3 client testimonials
- Average milestone value ≥$6K
- 0 payment disputes
- Change Request rate <10%

**Owner:** Team (full delivery cycle)

**Revenue Target:** $15K-$30K (3 milestones × $5K-$10K avg)

---

## Phase 2: Scale Delivery (Weeks 13-24)

**Goal:** 2-4 concurrent clients, refine workflows, automate lead processing

### Week 13-16: Concurrent Delivery

**Deliverables:**
- [ ] 2 concurrent client engagements
- [ ] Workload balancing protocol (Priya orchestration)
- [ ] Citizen handoff optimization (reduce TAT)
- [ ] First retained client (second milestone)

**Success Criteria:**
- Both clients progressing without bottlenecks
- Nicolas time per client ≤10h/week (citizens handle repeatable work)
- No quality degradation (Sofia verdicts remain rigorous)
- 1 client returns for second milestone (retention validation)

**Owner:** Priya (orchestration) + full team

**Revenue Target:** $20K-$40K (4 milestones over 4 weeks)

---

### Week 17-20: Workflow Automation

**Deliverables:**
- [ ] Automated Upwork lead parsing (Emma RSS/API integration)
- [ ] Proposal template library (top 5 job types)
- [ ] One-click proof generation (tag → `/proof` page)
- [ ] Client dashboard (track AC progress, test status)

**Success Criteria:**
- Emma processes 50+ leads/day (up from 20 manual)
- Proposal generation time ≤10min (down from 30min manual)
- Proof pages auto-update within 5min of tag push
- Clients can self-serve AC status

**Owner:** Daniel (tooling) + Emma (workflow) + Maya (client UI)

**Investment:** 1 week eng time, validates efficiency gains

---

### Week 21-24: Portfolio Expansion

**Deliverables:**
- [ ] 5 total proof entries (client projects)
- [ ] 3 detailed case studies with metrics
- [ ] Portfolio categories (AI, DeFi, Frontend, etc.)
- [ ] "Before ScopeLock" blog post (client testimonial spotlight)

**Success Criteria:**
- `/proof` CTR from homepage ≥35%
- Case studies referenced in 50%+ of proposals
- Proof-driven leads convert 2x faster than cold outreach

**Owner:** Rafael (testimonials) + Maya (case study pages) + Aïcha (proof contracts)

**Revenue Target:** $25K-$50K (5-10 milestones over 4 weeks)

---

## Phase 3: Productize (Weeks 25-52)

**Goal:** ScopeLock as a service, open-source tooling, establish $50K+ MRR

### Week 25-32: SaaS Infrastructure

**Deliverables:**
- [ ] Multi-tenant proof generation (other freelancers can use)
- [ ] ScopeLock CLI (tag → proof → invoice workflow)
- [ ] Public API (integrate proof log into portfolios)
- [ ] Pricing tiers (solo freelancer, agency, enterprise)

**Success Criteria:**
- 3 beta users adopt ScopeLock tooling
- Proof generation works end-to-end without manual intervention
- First "ScopeLock Certified" freelancer delivers milestone

**Owner:** Daniel (platform) + Aïcha (schemas/contracts) + Rafael (onboarding)

**Revenue Model:** $99/mo (solo), $499/mo (agency), custom (enterprise)

---

### Week 33-40: Open Source + Community

**Deliverables:**
- [ ] Open-source proofgen (MIT license)
- [ ] Open-source citizen prompts (Emma, Rafael, etc.)
- [ ] ScopeLock Practitioner Guide (how to adopt the model)
- [ ] Discord/Slack community for practitioners

**Success Criteria:**
- 100+ GitHub stars on proofgen
- 10+ practitioners adopt ScopeLock model
- Community shares proof entries + case studies
- First external testimonial ("ScopeLock helped me 3x my rates")

**Owner:** Maya (docs) + Rafael (community) + Daniel (OSS maintenance)

**Growth Mechanism:** Proof-driven discovery (practitioners find us via `/proof` logs)

---

### Week 41-52: Market Leadership

**Deliverables:**
- [ ] 10+ client case studies
- [ ] 20+ proof entries in `/proof` log
- [ ] ScopeLock conference talk (proposal submitted)
- [ ] "State of Freelance Delivery" report (data from proof logs)

**Success Criteria:**
- Recognized as thought leader in executable AC delivery
- Inbound leads > outbound (proof log drives discovery)
- Retained clients contribute 50%+ of revenue
- Pricing power: average milestone ≥$12K (up from $6K)

**Owner:** Rafael (thought leadership) + Priya (data analysis) + Team (delivery excellence)

**Revenue Target:** $50K+ MRR (mix of client work + SaaS subscriptions)

---

## Ongoing Initiatives (All Phases)

### Quality Gates (Sofia)

**Weekly:**
- [ ] Review all merges (verdict: pass/soft/hard)
- [ ] Block silent fallbacks (R-400/R-401 enforcement)
- [ ] Baseline guard checks (no AC mutation without CR)

**Monthly:**
- [ ] Quality report (verdict stats, override reasons, regression trends)
- [ ] Refinement proposals (new policies, test coverage improvements)

**Success Metric:** 0 silent fallbacks, 100% gated merges

---

### Proof Generation (Aïcha + Maya)

**Per Milestone:**
- [ ] Schema validation (AC.md, DEMO.md, DELTA.md structure)
- [ ] Proof page generation (static HTML from tag)
- [ ] Homepage teaser update (index.json)
- [ ] Verification (proof pages match tag content)

**Monthly:**
- [ ] Proof contract updates (new fields, better structure)
- [ ] Template improvements (visual polish, accessibility)

**Success Metric:** 100% automated, 0 manual proof generation

---

### Client Success (Rafael)

**Per Engagement:**
- [ ] AC.md co-editing (clear criteria, executable tests)
- [ ] Change Request triage (Swap vs Add sizing)
- [ ] Testimonial collection (within 7 days of AC green)
- [ ] Retention touchpoint (next milestone proposal within 14 days)

**Monthly:**
- [ ] Client health check (satisfaction, blockers, opportunities)
- [ ] Testimonial showcase (add to website, proposals)

**Success Metric:** 30% retention rate, 100% testimonial collection

---

### Operations (Priya)

**Weekly:**
- [ ] Orchestration review (handoffs, bottlenecks, delays)
- [ ] Budget tracking (milestone profitability, citizen efficiency)
- [ ] Incident log (failures, MTTR, resolution patterns)

**Monthly:**
- [ ] Efficiency report (proposals/week, milestones/month, revenue/hour)
- [ ] Process refinements (workflow optimizations, citizen protocol updates)

**Success Metric:** MTTR <10min, 0 manual process starts, increasing revenue/hour

---

## Metrics Dashboard (Track Weekly)

### Acquisition (Emma)

| Metric | Target | Current |
|--------|--------|---------|
| Leads evaluated | 100/week | 0 |
| GO rate | ≥30% | TBD |
| Proposals sent | 20/week | 0 |
| Response rate | ≥15% | TBD |

### Client (Rafael)

| Metric | Target | Current |
|--------|--------|---------|
| Kickoff calls | 2/week | 0 |
| AC.md drafted | 1/week | 0 |
| CR TAT | <24h | TBD |
| Testimonials | 100% of AC green | 0 |

### Delivery (Daniel)

| Metric | Target | Current |
|--------|--------|---------|
| Evidence Sprints | 1/week | 0 |
| AC green milestones | 1/2 weeks | 0 |
| Test coverage | 100% of AC | 100% (website) |
| Build success rate | >95% | 100% |

### Quality (Sofia)

| Metric | Target | Current |
|--------|--------|---------|
| Silent fallbacks | 0 | 0 |
| Gated merges | 100% | 100% |
| Override rate | <5% | TBD |
| Verdict TAT | <4h | TBD |

### Proof (Maya + Aïcha)

| Metric | Target | Current |
|--------|--------|---------|
| Proof entries | 3/month | 1 |
| Homepage CTR | ≥35% | TBD |
| Proof generation | 100% automated | 100% |
| Detail page views | 50/week | TBD |

### Business (Priya)

| Metric | Target | Current |
|--------|--------|---------|
| MRR | $10K (Phase 1) | $0 |
| Avg milestone | $8K | TBD |
| Retention rate | 30% | TBD |
| Client satisfaction | NPS >8 | TBD |

---

## Decision Gates

### After Phase 1 (Week 12)

**Go/No-Go Criteria:**
- ✅ **GO:** 3+ milestones delivered, 2+ testimonials, avg milestone ≥$5K
- ❌ **NO-GO:** <2 milestones, pricing not validated, retention = 0%

**If GO:** Proceed to Phase 2 (scale delivery)
**If NO-GO:** Refine model, adjust pricing, improve proposal quality

### After Phase 2 (Week 24)

**Go/No-Go Criteria:**
- ✅ **GO:** $30K+ MRR, 5+ proof entries, 30%+ retention, citizens demonstrably scaling capacity
- ❌ **NO-GO:** <$20K MRR, low retention, Nicolas still bottleneck

**If GO:** Proceed to Phase 3 (productize)
**If NO-GO:** Double down on delivery, defer SaaS

### After Phase 3 (Week 52)

**Go/No-Go Criteria:**
- ✅ **GO:** $50K+ MRR, 10+ practitioners, OSS traction, inbound > outbound
- ❌ **NO-GO:** Stalled at client delivery, no community adoption

**If GO:** Scale SaaS, hire first human (support/sales)
**If NO-GO:** Remain boutique consultancy, focus on premium clients

---

## Risk Mitigation

### Risk 1: No Client Traction

**Symptoms:** <15% proposal response rate, 0 kickoff calls after 50 proposals

**Mitigation:**
- Refine Emma's proposal templates (A/B test messaging)
- Expand to Contra, LinkedIn (not just Upwork)
- Lower initial pricing ($3K Evidence Sprints as entry point)
- Target process-friendly clients first (easier sell)

### Risk 2: Scope Creep Despite Baseline

**Symptoms:** CR rate >20%, clients dispute AC.md interpretation

**Mitigation:**
- More explicit AC.md (reference screenshots, exact copy, performance numbers)
- Video walkthrough of AC.md before baseline tag
- Stricter Change Control (Rafael enforces Swap/Add discipline)
- Add AC.md examples to `/process` page

### Risk 3: Citizens Don't Scale

**Symptoms:** Nicolas still spending >30h/week, proposals still manual

**Mitigation:**
- Audit citizen workflows (where is Nicolas involved?)
- Automate bottlenecks (Emma lead parsing, Daniel test generation)
- Refine prompts (clearer instructions, better context)
- Add more citizens if needed (e.g., "Alex the Tester")

### Risk 4: Proof Log Doesn't Drive Leads

**Symptoms:** `/proof` CTR <10%, no proof-driven inbound

**Mitigation:**
- Improve SEO (proof pages indexed, metadata optimized)
- Share proof entries on X, LinkedIn (social amplification)
- Add "How It Works" video to homepage
- A/B test homepage hero (proof-first vs process-first)

---

## Next Actions (This Week)

**Immediate (Today):**
1. [ ] Start Upwork lead processing (Emma manual workflow)
2. [ ] Evaluate 20 posts
3. [ ] Send 5-10 proposals
4. [ ] Track in `citizens/emma/leads-tracker.md`

**This Week:**
1. [ ] Monitor proposal responses
2. [ ] Book first kickoff call (if responses come in)
3. [ ] Draft AC.md template for common job types
4. [ ] Refine pricing tiers based on initial feedback

**Next Week:**
1. [ ] Send second batch of proposals (20 more posts)
2. [ ] Analyze response rate (adjust messaging if <15%)
3. [ ] First client engagement (Evidence Sprint or AC green)
4. [ ] Update roadmap based on learnings

---

## Summary

**Phase 1 (Weeks 1-12):** Prove the model — 3-5 milestones, testimonials, pricing validation

**Phase 2 (Weeks 13-24):** Scale delivery — concurrent clients, automation, portfolio expansion

**Phase 3 (Weeks 25-52):** Productize — SaaS, open source, community, $50K+ MRR

**Current Focus:** Client acquisition (Emma → Rafael → first Evidence Sprint)

**Success = Proof:** Every milestone tagged in `/proof` is validation that the model works.

Let's ship.
