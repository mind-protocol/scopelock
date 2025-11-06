# ScopeLock Internal Resources

**Audience:** Human team members (moderators, developers)
**Purpose:** Practical guides for working effectively with AI citizens

---

## Available Resources

### Week 1 Critical Path (Must Read Before First Mission)

#### 1. [How to Talk to AI Citizens: Context Is Everything](./how-to-talk-to-ai-citizens.md)

**Why this matters:**
- Team spends 8+ hours/day asking AI for code, fixes, verifications
- Bad questions = garbage output = wasted time
- Good questions = complete working code in minutes

**ROI:** 3-5x faster mission completion

**Blocker if missing:** Person spends 6 hours debugging when Rafael could've solved it in 2 minutes with proper context

---

#### 2. [The Complete Mission Flow: Who Does What When](./complete-mission-flow.md)

**Why this matters:**
- Prevents "I don't know what to do next" paralysis
- Shows when to ask which citizen vs. which human
- Makes handoffs explicit (Emma → Inna → Rafael → Sofia → NLR)

**ROI:** Zero wasted waiting time, clear ownership

**Blocker if missing:** Developer waits for NLR when Rafael could unblock them

---

#### 3. [Compensation Structure: How You Get Paid](./compensation-structure.md)

**Why this matters:**
- Motivates quality (you only get paid when client accepts)
- Clarifies commission percentages and payment timing
- Shows growth path and PPP purchasing power advantage

**ROI:** Aligned incentives = quality work

**Blocker if missing:** Confusion about "why am I doing this extra work?"

**Interactive calculator:** [scopelock.mindprotocol.ai/resources/compensation-structure](https://scopelock.mindprotocol.ai/resources/compensation-structure)

---

### Week 1 Quality Foundations (Before First Delivery)

#### 4. [Pain Point → Implementation: How to Think Like a Builder](./pain-point-to-implementation.md)

**Why this matters:**
- Clients say "I need X" but don't know what they actually need
- You must translate pain → objective → solution
- Prevents scope creep (we lock AC.md before coding)

**ROI:** Zero wasted work on wrong features

**Blocker if missing:** Build wrong thing, client rejects, no payment

**Framework:** 7-step process from vague client request to AC Green delivery

**Interactive visual guide:** [scopelock.mindprotocol.ai/resources/pain-point-to-implementation](https://scopelock.mindprotocol.ai/resources/pain-point-to-implementation)

---

## Publishing Process

1. Write markdown source in `docs/resources/[article-name].md`
2. Create visual TSX page in `src/app/resources/[article-name]/page.tsx`
3. Custom components in `src/app/resources/[article-name]/components/`
4. Each article is custom-made (no shared component library)

---

## Authentication

Currently public. Will add authentication system for internal-only access later.
