# Upwork Project Catalog – Complete Guide

**Version:** 1.0
**Created:** 2025-11-03
**Source:** Upwork Help Center
**Purpose:** Reference for creating and managing ScopeLock projects in Upwork's Project Catalog

---

## Overview

Project Catalog allows freelancers to create up to 20 unique projects (plus 20 more in review) with fixed-price packages that clients can purchase directly.

---

## How to Decide What Projects to Offer

### Key Questions
1. **What work have you enjoyed the most?**
2. **What seems most in demand?** What do clients request most often?
3. **Which skills are easily packaged as fixed-price with set deliverables?**
4. **Do you have work samples** (images, video, PDFs) to market your project?

### Research Strategy
- Browse through Project Catalog to see what other freelancers offer
- Think about what you can offer that's unique or more specialized
- Remember: You can edit every part of your project later

---

## How to Create a Project

### Access
1. Go to **Find Work**
2. Choose **Your services**
3. Click green **Create Project** button

---

## Project Structure (Step-by-Step)

### 1. Project Overview

#### Title
- Say what you offer in just a few words
- Use search tags instead of making title longer
- Do NOT repeat "You will get"
- Follow regular capitalization rules
- Proofread for spelling and grammar

**ScopeLock Examples:**
```
Evidence Sprint: Working Prototype in 2-5 Days
AC.md + Acceptance Tests: Scope Lock Package
Full-Stack MVP with Pay-at-AC-Green Delivery
CHG-130 Change Control Implementation
```

#### Category
- Browse all categories to find best fit
- Avoid selecting "Other" unless absolutely necessary

**Relevant Categories for ScopeLock:**
- Web Development
- Mobile Development
- Software Development
- AI Services
- Technical Consulting

#### Specifics
- Checkboxes based on your category help clients discover your project
- Use image tagging options for better visibility

#### Search Tags
- Add up to 5 tags with relevant keywords

**ScopeLock Tag Examples:**
```
acceptance-criteria, evidence-sprint, fixed-price, mvp, pay-at-delivery
test-driven, scope-control, full-stack, rapid-prototyping, proof-based
```

---

### 2. Price and Scope

#### Package Tiers (up to 3)
- **Starter** (lower price, basic scope)
- **Standard** (mid-tier, most popular)
- **Advanced** (premium, comprehensive)

**ScopeLock Tier Structure Example:**

| Tier | Price | Scope | Delivery | Revisions |
|------|-------|-------|----------|-----------|
| **Starter** | $3,000 | Evidence Sprint (prototype + delta) | 2-5 days | 2 |
| **Standard** | $8,000 | AC.md + Acceptance Tests + MVP | 2-3 weeks | 3 |
| **Advanced** | $20,000 | Full milestone with CHG-130 + /proof | 4-6 weeks | Unlimited |

#### Add-ons
- Predefined or custom add-ons (e.g., extra-fast delivery)

**ScopeLock Add-on Examples:**
```
+ $500: Rush delivery (48-hour Evidence Sprint)
+ $1,000: Additional milestone with CHG-130
+ $750: Performance optimization (p95 < 200ms)
+ $2,000: HIPAA compliance audit
```

#### Pricing
- Range: $5 USD to $500,000 USD

#### Delivery Days
- Set realistic and attractive timeframe

**ScopeLock Delivery Standards:**
- Evidence Sprint: 2-5 days
- AC.md + Tests: 1-2 weeks
- Full MVP: 3-6 weeks

#### Revisions
- Choose how many revisions are included during delivery period

**ScopeLock Approach:**
- Revisions = fixing bugs against AC.md
- NOT scope changes (those go through CHG-130)

---

### 3. Gallery (Images & Video)

**Required:** Showcase samples of your work
- Learn about adding images: [Upwork guide]
- Learn about adding videos: [Upwork guide]

**ScopeLock Gallery Strategy:**
1. **Hero image:** ScopeLock logo + tagline "Lock the scope. Prove the value."
2. **AC.md example:** Screenshot of acceptance criteria structure
3. **Proof Log:** Screenshot from scopelock.mindprotocol.ai/proof
4. **Delta example:** Before/after metrics (e.g., "450ms → 180ms p95")
5. **Portfolio project:** La Serenissima (97 agents, 99.7% uptime)
6. **Video (90s):** Demo walkthrough of Evidence Sprint process

---

### 4. Client Requirements

**Purpose:** List all information you need from the client before starting work.

**Required step** before project begins.

**ScopeLock Requirements Template:**
```
1. What problem are you trying to solve? (2-3 sentences)
2. Who are the users/customers?
3. What does success look like? (measurable outcomes)
4. Do you have existing systems to integrate with?
5. What is your timeline constraint? (if any)
6. Budget range confirmed? (for package tier selection)
7. Preferred communication method? (email, Slack, Telegram)
```

**Important:** Don't ask for personal contact info here (against ToS)

---

### 5. Description

Three parts: **Project Summary**, **Project Steps**, **FAQs**

#### Project Summary
Explain what sets you and your project apart.

**ScopeLock Summary Template:**
```
I deliver software against executable acceptance criteria. You pay only when tests are green.

What you get:
• AC.md (functional + non-functional criteria)
• Acceptance tests (automated, executable)
• Public proof log (tags + quantified deltas)
• CHG-130 change control (Swap €0 or Add priced)

No time estimates. No scope creep. No surprise costs.

Evidence Sprints: Working prototype + quantified delta in 2-5 days.

Recent proof:
• Multi-agent systems: 97+ agents, 6+ months production, 99.7% uptime
• Healthcare AI: 121+ deployments, HIPAA-aware
• Terminal Velocity: 1.1k GitHub stars

Process:
1. Co-write AC.md (functional, performance p95, quality thresholds)
2. Build acceptance tests first
3. Deliver when tests green
4. Tag milestone (ac-green_project_date)
5. You pay only at delivery

Portfolio + proof: scopelock.mindprotocol.ai/proof
```

#### Project Steps
Break down your work process from start to finish.

**Important:** Client's job of submitting requirements, reviewing, and approving your work are already built in. Don't add these to your work steps.

**ScopeLock Steps Template:**

**Step 1: Kickoff + AC.md Co-Creation (Day 1-2)**
- Review requirements and clarify scope
- Co-write AC.md with functional + non-functional criteria
- Define performance thresholds (e.g., p95 < 300ms)
- Agree on verification method (test commands + seed data)
- Tag baseline: `ac-baseline_[project]_[date]`

**Step 2: Acceptance Tests First (Day 2-3)**
- Write Playwright/PyTest tests for all AC.md criteria
- Set up CI/CD pipeline
- Create seed data for reproducible tests
- Share test repo access for transparency

**Step 3: Implementation (Days 4-10)**
- Build features to pass acceptance tests
- Commit regularly with clear messages
- Run tests on every commit
- Daily async updates via SYNC.md

**Step 4: AC Green + Proof (Day 10-12)**
- All acceptance tests pass (green CI)
- Create DEMO.md (90-second walkthrough)
- Create DELTA.md (quantified before/after metrics)
- Tag milestone: `ac-green_[project]_[date]`
- Publish to public proof log

**Step 5: Handoff + Documentation**
- Deployment guide
- Architecture documentation
- Environment setup instructions
- Performance monitoring dashboard access

#### FAQs
Add answers to questions clients may ask.

**ScopeLock FAQ Template:**

**Q: What if I want to change scope mid-project?**
A: We use CHG-130 change control. Changes are either Swap (equal/lower complexity, €0, same milestone) or Add (new milestone, priced separately, you approve first).

**Q: What if I'm not satisfied with the result?**
A: You only pay when acceptance tests are green. If tests don't pass, I fix until they do. If you want different functionality, that's a change request (CHG-130).

**Q: How do I know it's done?**
A: When CI shows green tests for all AC.md criteria. No "90% done" ambiguity.

**Q: Can I see examples of your work?**
A: Yes. Public proof log: scopelock.mindprotocol.ai/proof. Every milestone I've shipped with tags, deltas, and demos.

**Q: What if the project takes longer than estimated?**
A: Delivery days are targets, not guarantees. You pay at AC green, not at day count. If delays occur, I communicate via SYNC.md with reasons and new timeline.

**Q: Do you work hourly?**
A: No. Fixed-price milestones only. Hourly creates incentive misalignment (slower = more money). I want fast delivery.

**Q: What tech stack do you use?**
A: Next.js, FastAPI, PostgreSQL, Claude Code, multi-agent orchestration. Flexible based on project needs.

**Q: Can you do rush delivery?**
A: Yes. Evidence Sprints in 2-5 days. Add-on: $500 for 48-hour delivery.

---

### 6. Submit Project

#### Concurrent Project Limit
Set maximum number of concurrent projects (up to 20).

**ScopeLock Recommendation:** Start with 5 concurrent, adjust based on capacity.

#### Project Stages

**1. Under Review / Pending Approval**
- Our team is reviewing for completeness and professionalism
- You'll be notified when review is complete
- **Top Rated/Top Rated Plus/Expert-Vetted:** Reviewed within 2 business days
- **Others:** May take a few weeks due to volume

**2. Approved / Accepted**
- Project moves to active tab and is switched on automatically
- You'll get confirmation email when it goes live
- Clients can now purchase

**3. Needs Changes**
- You'll receive email with suggestions
- You can edit and resubmit OR remove and start over

---

## What Upwork Reviews

### Project Overview Review

**Title:**
- Service is clearly described
- Service is in a category permitted on Upwork
- No off-the-shelf products (crafts, software)
- No services not covered by Upwork (e.g., dog grooming)

**Note:** Can't sell pre-made products, only services you can deliver.

---

### Pricing Section Review

Upwork checks custom add-ons and custom tiers for:
- Personal contact information (not allowed)
- Inappropriate content that violates Terms of Service

---

### Gallery Review

**What they check:**

**1. Aesthetics**
- Image cropping
- Image resolution
- Density of text
- Other aesthetic concerns

**2. Accuracy**
- Content accurately reflects you, your work experience, and the services offered
- Specific to THIS project (not generic portfolio)

**3. Clear and professional content**
- Images are easy to understand
- Professional quality
- Free of clickbait-like qualities
- No competitor logos
- No policy violations

**ScopeLock Gallery Checklist:**
- ✅ High-resolution images (1920x1080 minimum)
- ✅ Clear text (not too dense)
- ✅ Proof screenshots from live systems
- ✅ Real metrics (not stock images)
- ✅ No competitor logos (GitHub, VS Code logos OK if showing code)
- ✅ Professional aesthetic (dark mode, clean design)

---

### Description Review

All three sections (summary, steps, FAQs) are checked for:
- Personal contact information (not allowed)
- Payment information outside Upwork (not allowed)
- Meets Upwork's Terms of Service

**For consultations:** Areas of expertise + guidance description also reviewed.

---

### Requirements Review

Checked for:
- Personal contact information (not allowed)
- Payment information outside Upwork (not allowed)
- Meets Terms of Service

**Note:** You can ask for business info, details, software access — just not personal contact details.

---

### What Happens After Edits

**Once your project is live, you can make changes anytime.**

**Review after edits:**
- **Category change:** Project temporarily removed while reviewed
- **Other changes:** Project stays live during re-review (unless specific concern)

---

## ScopeLock Project Catalog Strategy

### Recommended Projects to Create (Priority Order)

**1. Evidence Sprint (Starter)**
```
Title: Evidence Sprint: Working Prototype in 2-5 Days
Price: $3,000 - $5,000
Delivery: 2-5 days
Category: Web Development or Software Development
```

**2. AC.md + MVP Package (Standard)**
```
Title: Full-Stack MVP with Acceptance Criteria + Tests
Price: $8,000 - $15,000
Delivery: 3-4 weeks
Category: Web Development
```

**3. CHG-130 Change Control (Advanced)**
```
Title: Scope-Locked Development with CHG-130 Change Control
Price: $20,000 - $35,000
Delivery: 4-6 weeks
Category: Software Development
```

**4. Healthcare AI (Specialized)**
```
Title: HIPAA-Compliant Healthcare AI + RAG System
Price: $12,000 - $25,000
Delivery: 4-6 weeks
Category: AI Services
```

**5. Multi-Agent System (Premium)**
```
Title: Multi-Agent AI System with Persistent Memory
Price: $25,000 - $50,000
Delivery: 6-8 weeks
Category: AI Services
```

---

## Common Rejection Reasons

**Top reason:** Issues with gallery content

**Other reasons:**
- Title not clear or violates guidelines
- Category mismatch
- Personal contact info in description
- Low-quality images
- Clickbait or unprofessional content
- Violates Terms of Service

---

## Tips for Approval

### Gallery
1. **High-resolution images** (1920x1080+)
2. **Real work samples** (not stock photos)
3. **Clear text overlays** (readable, not dense)
4. **Professional aesthetic**
5. **Accurate to your service**

### Description
1. **Free of personal contact info**
2. **Professional tone**
3. **Clear and specific**
4. **Grammar and spelling checked**
5. **Client-focused** (benefits, not features)

### Pricing
1. **Realistic delivery timeframes**
2. **Competitive but not underpriced**
3. **Clear tier differentiation**
4. **Value-based** (outcomes, not hours)

---

## Editing After Approval

### You Can Always:
- Update images
- Change description
- Adjust pricing
- Modify delivery days
- Add/remove tiers
- Update FAQs

### Will Trigger Re-Review:
- Category change (temporary removal)
- Major content changes
- Gallery updates

### Visibility Toggle:
- Turn project off temporarily without deleting
- Switch back on anytime

---

## ScopeLock-Specific Guidelines

### What to INCLUDE:
✅ Link to scopelock.mindprotocol.ai/proof (in description)
✅ Real metrics from La Serenissima, Terminal Velocity, etc.
✅ AC.md example screenshots
✅ Before/after deltas
✅ "Pay at AC green" positioning
✅ CHG-130 change control explanation

### What to AVOID:
❌ Personal email in requirements/description
❌ Telegram/Discord handles
❌ "Contact me outside Upwork"
❌ Off-platform payment mentions
❌ Competitor bashing
❌ Unrealistic delivery promises ("24-hour MVP")

---

## Review Timeline

**Top Rated / Top Rated Plus / Expert-Vetted:**
- Reviewed within **2 business days**

**Other freelancers:**
- May take **a few weeks** due to volume

**Notification:**
- Email when review is complete (approved or needs changes)

---

## Best Practices

### 1. Start with One High-Quality Project
- Perfect your Evidence Sprint project first
- Get approved, gather reviews
- Then add more projects

### 2. Use Real Work Samples
- Screenshots from La Serenissima
- Terminal Velocity GitHub stats
- TherapyKin deployment metrics
- Proof log entries

### 3. Client-Centric Language
- Focus on client outcomes, not your process
- "You get a working prototype in 2-5 days" (not "I will build")
- "You pay only at AC green" (not "I deliver when done")

### 4. Specific, Verifiable Claims
- "97 agents, 99.7% uptime, 6+ months" (not "highly reliable")
- "1.1k GitHub stars" (not "popular project")
- "p95 < 300ms" (not "fast performance")

### 5. Differentiation
- Show what makes you different (pay-at-AC-green, CHG-130)
- Explain why it matters (no scope creep, no surprise costs)
- Provide proof (link to /proof log)

---

## Next Steps

1. **Create first project:** Evidence Sprint (easiest to approve)
2. **Prepare gallery:** 6 images + 1 video (90s)
3. **Write description:** Use templates above
4. **Submit for review:** Expect 2 days - 2 weeks
5. **Monitor:** Check for "Needs Changes" email
6. **Iterate:** Edit based on feedback
7. **Launch:** Turn on visibility when approved

---

**Reference:** https://support.upwork.com/hc/en-us/articles/13787478608539-How-to-create-a-project-in-Project-Catalog

**Last Updated:** 2025-11-03
