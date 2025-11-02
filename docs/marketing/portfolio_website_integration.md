# Portfolio → Website Integration

**Date:** 2025-11-02
**Status:** ✅ Complete (Homepage + About updated)

---

## What Was Updated

### Homepage (/) - "Proof in action" Section

**Before:**
1. Terminal Velocity (1,051 stars)
2. La Serenissima (120+ agents, months)
3. Universal Basic Compute (AI ecosystem)

**After:**
1. **Terminal Velocity** (1,051 stars, Novel by AI) — **Social proof**
2. **La Serenissima** (97+ agents, 6+ months, 50K+ updates/hour, 99.7% uptime) — **Technical depth**
3. **TherapyKin** (AI companion, 121+ deployments, text + voice) — **Business proof (B2C)**

**Rationale:**
- **Mix achieved:** Social proof (stars) + Technical depth (production AI) + Business proof (consumer product)
- **Quantified metrics:** All cards show measurable outcomes
- **Live links:** All link to working sites (serenissima.ai, therapykin.ai)

**File:** `src/app/page.tsx:57-91`

---

### About Page (/about) - Nicolas Bio

**Before:**
> La Serenissima (120+ autonomous agents, months of live operation)

**After:**
> La Serenissima (97+ agents, 6+ months production, 99.7% uptime)

**Rationale:**
- More precise agent count (97+ matches portfolio)
- Specific production timeline (6+ months)
- Quantified uptime (99.7%)
- Links to serenissima.ai (live site) instead of GitHub

**File:** `src/app/about/page.tsx:37`

---

## Current Portfolio Projects (4 Total)

### Shown on Website (3)

1. **Terminal Velocity**
   - Type: Novel AI project
   - Proof: 1,051 GitHub stars (social proof)
   - Link: github.com/nlr-ai/terminal-velocity

2. **La Serenissima**
   - Type: Multi-agent AI system
   - Proof: 97+ agents, 6+ months production, 99.7% uptime (technical depth)
   - Link: serenissima.ai

3. **TherapyKin**
   - Type: Consumer AI product (B2C)
   - Proof: 121+ deployments, privacy-first, text + voice (business proof)
   - Link: therapykin.ai

### Documented (Not Featured on Homepage)

4. **Mind Protocol V2**
   - Type: Infrastructure (graph substrate)
   - Proof: Powers La Serenissima, dual-memory architecture
   - Use: Deep technical proposals, architecture discussions
   - Location: `docs/portfolio/mindprotocol/`

5. **KinOS10**
   - Type: Predecessor to Mind Protocol
   - Proof: Evolution story (file-based → graph)
   - Use: Show learning/iteration, architectural progression
   - Location: `docs/portfolio/kinos/`

---

## Maintenance Guide

### When to Update Homepage

**Add new project when:**
- AC green delivered (all tests passing)
- Has stronger proof than current 3 (more stars, longer production, bigger scale)
- Fills a gap in mix (e.g., if we lack blockchain proof, add that)

**Replace decision matrix:**

| Current | Replace With | When |
|---------|--------------|------|
| Terminal Velocity (1,051 stars) | New project with >2K stars OR major press coverage | Stronger social proof |
| La Serenissima (97+ agents, 6+ months) | New multi-agent system with >200 agents OR >12 months | Stronger technical proof |
| TherapyKin (121+ deployments, B2C) | New B2C with >10K users OR major enterprise client | Stronger business proof |

**General rule:** Only replace if new project is **significantly stronger** (2x+ on key metric)

---

### When to Add to Portfolio Docs

**Always add when:**
- Client project reaches AC green
- You want Emma to reference it in proposals
- It demonstrates a new capability

**Process:**
1. Create folder: `docs/portfolio/[project-name]/`
2. Write `overview.md` (full technical description)
3. Write `quick-reference.md` (proposal snippets)
4. Add screenshots to `/screenshots/` folder
5. Update `docs/portfolio/README.md` with new entry

**Template locations:**
- See existing projects for structure
- Follow format in `docs/portfolio/README.md` section "Adding New Projects"

---

### When to Write Blog Post

**Write case study post when:**
- Project has measurable delta (before → after)
- Client approves public sharing (or internal project we own)
- Project demonstrates ScopeLock methodology (AC.md → Evidence Sprint → AC green)

**Format:** Use template from `docs/marketing/blog_content_plan.md` (Post 7 template)

---

## Project Proof Strength Ranking

**By Social Proof (Stars/Users):**
1. Terminal Velocity — 1,051 stars ⭐⭐⭐⭐⭐
2. TherapyKin — 121+ deployments, consumer users ⭐⭐⭐
3. La Serenissima — GitHub available, niche audience ⭐⭐

**By Technical Depth:**
1. Mind Protocol V2 — Novel graph architecture ⭐⭐⭐⭐⭐
2. La Serenissima — 97+ agents, 6+ months production ⭐⭐⭐⭐⭐
3. TherapyKin — Persistent memory, multi-modal ⭐⭐⭐⭐
4. KinOS — File-based, predecessor ⭐⭐

**By Business Proof:**
1. TherapyKin — Consumer product, 121+ deployments ⭐⭐⭐⭐⭐
2. La Serenissima — 6+ months production uptime ⭐⭐⭐⭐
3. Terminal Velocity — Finished novel (outcome delivered) ⭐⭐⭐

**Best Mix for Homepage (Current):**
- Terminal Velocity (social proof leader)
- La Serenissima (technical depth leader)
- TherapyKin (business proof leader)

---

## Portfolio Categories (Future Organization)

As more projects complete, organize by capability:

```
docs/portfolio/
├── README.md (index)
├── ai-agents/
│   ├── serenissima/
│   └── [future multi-agent projects]/
├── consumer-ai/
│   ├── therapykin/
│   └── [future B2C AI projects]/
├── infrastructure/
│   ├── mindprotocol/
│   ├── kinos/
│   └── [future substrate projects]/
├── blockchain/
│   └── [future crypto projects]/
└── enterprise/
    └── [future B2B projects]/
```

**When to reorganize:** After 10+ projects (currently 5, not urgent)

---

## Quick Reference: Proposal Use Cases

**Client needs AI agents?**
→ Reference La Serenissima (97+ agents, 6+ months)

**Client needs consumer product?**
→ Reference TherapyKin (B2C, privacy-first, 121+ deployments)

**Client needs graph database?**
→ Reference Mind Protocol V2 (dual-memory FalkorDB)

**Client needs proof of iteration?**
→ Reference KinOS → Mind Protocol evolution story

**Client needs social proof?**
→ Reference Terminal Velocity (1,051 stars)

**Client needs multi-LLM?**
→ Reference KinOS or Mind Protocol (multi-provider orchestration)

**All locations:** `docs/portfolio/[project]/quick-reference.md`

---

## Next Steps

**Immediate:**
- ✅ Homepage updated
- ✅ About page updated
- ✅ Portfolio docs exist and structured

**Short-term (as projects complete):**
- Add client projects to portfolio docs at AC green
- Write case study blog posts (La Serenissima first)
- Collect screenshots for portfolio folders

**Long-term:**
- Monitor homepage project strength (replace when significantly stronger projects complete)
- Reorganize portfolio by category when >10 projects
- Create /case-studies page with detailed writeups

---

**Last Updated:** 2025-11-02 by Rafael
**Next Review:** When next major project reaches AC green
