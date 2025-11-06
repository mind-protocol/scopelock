# ScopeLock Website Improvement Plan V2 (Business Buyers Only)

**Created:** 2025-11-07
**Owner:** Alexis (Strategic Operations)
**Revised Based On:** Nicolas feedback - solo founder voice, business buyers only, include development services

---

## KEY CONSTRAINTS

1. **Solo founder voice** - Use "I" (Nicolas), NOT "we" or "agency"
2. **Target ONLY business buyers** - Forget technical buyers for now
3. **Include BOTH services:**
   - Creative AI services (presentations, voice, images, music, translation, content)
   - Development services (websites, AI chatbots, web apps, integrations)
4. **Use existing portfolio** - Nicolas's live websites + GitHub projects
5. **NO phone calls** - Don't waste time on calls
6. **NO testimonials yet** - Don't have them
7. **NO "Trusted By" section yet** - Need client permissions first
8. **NO separate Process page** - Emma handles technical proposals differently

---

## HOMEPAGE IMPROVEMENTS (Business Buyer Focus)

### 1. Hero Section Rewrite

**CURRENT:**
```
"Software locked to executable acceptance criteria"
"I write tests with you, you pay only when tests pass"
"Solo engineer + AI team. 65k commits in 2024."
CTA: "Start with Evidence Sprint"
```

**PROBLEMS:**
- "Executable acceptance criteria" = jargon (business buyers don't know what this means)
- Focus on process, not outcome
- Only one CTA
- No mention of creative services

**RECOMMENDED:**
```
Hero H1: "Professional Software & Creative Work. Delivered Fast."

Hero pitch: "I build websites, AI chatbots, and web apps. I also create presentations,
voiceovers, translations, and content using AI. Fixed pricing. Fast delivery.
You pay only when it works."

Subtext: "Solo developer + AI-assisted workflow. 65k commits in 2024. 121+ deployments."

CTAs:
- "Get Free Estimate" (primary - AI-powered form)
- "See My Work" (secondary - portfolio page)
```

**Why this works:**
- Mentions BOTH services (development + creative AI)
- Outcome-focused ("delivered fast")
- Solo voice ("I build," not "we build")
- Multiple CTAs
- Risk reversal ("pay only when it works")
- Credibility ("65k commits, 121+ deployments")

**Implementation:**
- Effort: 1 hour
- Owner: Nicolas (or whoever updates website)

---

### 2. Services Section (Split: Development + Creative)

**CURRENT:**
Text-heavy descriptions, no clear structure

**RECOMMENDED:**
Visual grid with icons, split into two categories

**DEVELOPMENT SERVICES:**

```
[Icon: Code] Web Development
Build landing pages, web apps, SaaS products
Starting at $200 | 2-7 days | Next.js + Vercel

[Icon: Robot] AI Chatbot Integration
Add AI chat to your website or app
Starting at $400 | 3-7 days | OpenAI/Claude API

[Icon: Database] Backend APIs
Build REST APIs, database integrations
Starting at $300 | 3-7 days | FastAPI + PostgreSQL

[Icon: Document] Document Processing
Extract data from PDFs, emails, documents using AI
Starting at $400 | 3-7 days | Python + Claude API
```

**CREATIVE AI SERVICES:**

```
[Icon: Presentation] Presentations & PDFs
Create pitch decks, sales presentations, handbooks
Starting at $400 | 1-3 days | AI-powered design

[Icon: Voice] Voice & Audio
Voiceovers for videos, audiobooks, podcast intros
Starting at $300 | 1-3 days | ElevenLabs AI

[Icon: Globe] Translation
Translate your website, app, or content to 50+ languages
Starting at $500 | 2-5 days | Claude AI

[Icon: Pen] Content Writing
SEO blog posts, product descriptions, email campaigns
Starting at $600 | 2-5 days | AI-assisted writing

[Icon: Image] Images & Graphics
Product images, social media graphics, marketing materials
Starting at $400 | 1-3 days | Ideogram AI

[Icon: Music] Music & Sound
Background music, podcast intros, custom jingles
Starting at $300 | 1-3 days | Suno/Udio AI
```

**Why this works:**
- Shows BOTH development AND creative services
- Scannable (addresses decision fatigue)
- Fixed pricing visible (addresses budget anxiety)
- Fast timelines (addresses time poverty)
- Specific tools mentioned (builds credibility)

**Implementation:**
- Effort: 3-4 hours (design + copy)
- Owner: Nicolas (or whoever updates website)

---

### 3. "How It Works" Section (Business-Friendly, No Calls)

**CURRENT:**
AC.md → Evidence Sprint → AC Green (technical jargon)

**RECOMMENDED:**

```
HOW I WORK

1. YOU DESCRIBE WHAT YOU NEED (Day 1)
   Send me a message or fill out the estimate form. I'll confirm I understand
   and give you a fixed price + timeline.

2. I CREATE SAMPLES (Days 2-3)
   For creative work: I create 5-10 samples in your style. You approve or request changes.
   For development: I build a working demo or first feature. You test it.

3. I DELIVER THE FULL PROJECT (Days 4-7)
   I complete the rest based on your approved samples/demo.
   You get daily updates (no need to check in).

4. YOU TEST & PAY WHEN SATISFIED (Day 8+)
   Test everything. Request changes if needed (2 revision rounds included).
   You only pay when you're completely happy.
```

**Why this works:**
- Solo voice ("I create," not "we create")
- No phone calls mentioned (just message or form)
- Simple 4-step process
- Emphasizes speed (day numbers)
- Risk reversal ("pay only when satisfied")
- For development AND creative (mentions both)

**Implementation:**
- Effort: 1 hour
- Owner: Alexis (draft copy) → Nicolas (approve)

---

### 4. Portfolio Section ("See My Work")

**CURRENT:**
No visual portfolio on homepage, just text descriptions

**RECOMMENDED:**

Create separate **Portfolio page** (`/portfolio` or `/work`) with:

**Development Projects:**

```
[Screenshot: TherapyKin]
TherapyKin - AI Companion Platform
Next.js + FastAPI + ElevenLabs + Vercel/Render
121+ deployments | 1.2M+ interactions
[View Live] [View Code on GitHub]

[Screenshot: La Serenissima]
La Serenissima - Multi-Agent Orchestration
97 agents | 99.7% uptime | 6+ months production
[View Live] [View Code on GitHub]

[Screenshot: KinKong]
KinKong - Trading Infrastructure
Solana DEX integration | $75K AUM
[View Live] [View Code on GitHub]

[Screenshot: Terminal Velocity]
Terminal Velocity - CLI Tool
1,051 GitHub stars | Top 0.01% of GitHub projects
[View Code on GitHub]

(Add more from your portfolio README)
```

**Creative AI Projects (If You Have Any):**

If you've created presentations, voiceovers, etc., show them here.
If not yet, show placeholders:

```
[Icon: Presentation]
Sample Pitch Deck
Created with Gamma AI | 15 slides | Investor-ready design
[View Sample PDF]

[Icon: Voice]
Sample Voiceover
Created with ElevenLabs | 60-second demo | Professional quality
[Listen to Sample]

(Show actual client work once you have it)
```

**Why this works:**
- Shows BOTH development AND creative work
- Live links = credibility (they can test it)
- GitHub links = technical proof
- Metrics = results-focused ("121+ deployments," "99.7% uptime")

**Implementation:**
- Effort: 4-6 hours (extract from portfolio README, create page, add screenshots)
- Owner: Nicolas (or whoever updates website)
- Source: `/home/mind-protocol/scopelock/docs/portfolio/README.md`

---

### 5. About / Credibility Section

**CURRENT:**
"Solo engineer + AI team. 65k commits in 2024."

**RECOMMENDED:**

```
ABOUT ME

I'm Nicolas, a solo developer who ships fast.

I've built AI companion platforms (121+ deployments), trading bots ($75K AUM),
and multi-agent systems (97 agents, 99.7% uptime). My open-source CLI tool has
1,051 GitHub stars (top 0.01% of GitHub).

I use AI to speed up delivery without compromising quality. What used to take
agencies 4 weeks, I deliver in 4 days. You get professional work at fair prices.

Links:
→ GitHub (Personal): github.com/nlr-ai (65K commits in 2024, 37 repos)
→ GitHub (Organization): github.com/mind-protocol (23 repos, Terminal Velocity 1.1k stars)
→ LinkedIn: linkedin.com/in/[your-profile]

No agencies. No teams. Just me + AI-assisted workflow.
```

**Why this works:**
- Solo voice ("I'm Nicolas," not "we are ScopeLock")
- Credibility metrics (commits, stars, deployments)
- Explains AI advantage (speed without quality loss)
- Links to verify (GitHub, LinkedIn)
- Emphasizes solo founder ("No agencies. No teams.")

**Implementation:**
- Effort: 1 hour
- Owner: Alexis (draft) → Nicolas (approve + add LinkedIn URL)

---

### 6. FAQ Section (Business Buyer Focus)

**RECOMMENDED:**

```
FREQUENTLY ASKED QUESTIONS

Q: How fast can you deliver?
A: Most projects are delivered in 2-7 days. Simple projects (landing pages,
   presentations) in 2-3 days. Complex projects (web apps, integrations) in 5-7 days.
   Rush delivery (1-2 days) available for +30%.

Q: What if I don't like the result?
A: You don't pay until you're happy. 2 revision rounds included. I'll keep
   revising until it meets your standards.

Q: Do you work with agencies or outsource the work?
A: No. I do all the work myself, with AI assistance. No teams, no outsourcing.
   You work directly with me.

Q: What's your pricing model?
A: Fixed price, quoted upfront. No hourly rates. No surprise costs.
   Development: $200-600. Creative services: $300-1500.

Q: Can you start immediately?
A: Yes. Most projects I can start same day or next day.

Q: Do you sign NDAs?
A: Yes, I'm happy to sign your NDA before we start.

Q: What if my project is larger than your typical scope?
A: I can break it into smaller milestones. You pay per milestone, only when
   each milestone is delivered and tested.
```

**Why this works:**
- Addresses common business buyer fears (speed, quality, transparency)
- Solo voice ("I do all the work myself")
- Risk removal ("don't pay until happy")
- Fixed pricing (no surprises)

**Implementation:**
- Effort: 1 hour
- Owner: Alexis (draft) → Nicolas (approve)

---

### 7. "Get Free Estimate" Form (AI-Powered)

**CURRENT:**
Contact form or manual

**RECOMMENDED:**

Create AI-powered estimate form that:

1. **Asks minimal questions:**
   - What do you need? (text area)
   - Type of project: [Development] [Creative Services] [Both]
   - Timeline: [1-3 days] [4-7 days] [1-2 weeks] [Flexible]
   - Budget: [<$500] [$500-1000] [$1000-2000] [>$2000]
   - Your email

2. **AI analyzes the request** (using Claude API):
   - Determines project complexity
   - Suggests appropriate service (web dev, chatbot, presentation, etc.)
   - Estimates timeline
   - Suggests fixed price range

3. **Auto-responds with estimate:**
   ```
   Hi [Name],

   Thanks for reaching out! Based on your description, here's what I can do:

   PROJECT: [AI-generated summary of what they need]

   DELIVERABLES:
   ✓ [Auto-generated deliverable 1]
   ✓ [Auto-generated deliverable 2]
   ✓ [Auto-generated deliverable 3]

   TIMELINE: [X] days

   PRICE: $[Y] fixed (no surprise costs)

   I can start [immediately / tomorrow / this week].

   If this sounds good, reply to this email and I'll send you the next steps.

   Best,
   Nicolas
   ```

**Why this works:**
- No manual work for Nicolas (AI does the estimate)
- Instant response (addresses time poverty)
- Fixed price quoted (addresses budget anxiety)
- Prescriptive (tells them what they need, addresses decision fatigue)

**Implementation:**
- Effort: 6-8 hours (build AI estimate form + Claude API integration)
- Owner: Rafael (implementation) → Nicolas (approve logic)
- Tech: Simple Next.js form → Claude API → Email via SendGrid/Resend

---

## HOMEPAGE STRUCTURE (Final Layout)

```
1. HERO
   - H1: "Professional Software & Creative Work. Delivered Fast."
   - Pitch: Brief description (2 lines)
   - Subtext: Credibility (commits, deployments)
   - CTAs: "Get Free Estimate" | "See My Work"

2. SERVICES (Split Development + Creative)
   - Visual grid with 10 service types
   - Each: Icon, title, description, starting price, timeline, tech

3. HOW IT WORKS
   - 4 steps, business-friendly language
   - No technical jargon, no calls

4. PORTFOLIO PREVIEW
   - 3-4 top projects with screenshots
   - Link to full portfolio page

5. ABOUT ME
   - Solo founder positioning
   - Credibility metrics
   - Links to GitHub + LinkedIn

6. FAQ
   - 6-7 questions addressing business buyer fears

7. FOOTER
   - "Get Free Estimate" CTA (repeated)
   - Links: Portfolio, GitHub, LinkedIn
   - Contact email
```

**Total page length:** ~3-4 scrolls (not too long, not too short)

---

## PORTFOLIO PAGE STRUCTURE

```
/portfolio or /work

HEADER:
"My Work"
"Live projects and open-source contributions"

DEVELOPMENT PROJECTS:
[Grid of 6-8 projects with:]
- Screenshot
- Project name
- Tech stack
- Key metrics (stars, deployments, uptime)
- Links: [View Live] [View Code]

CREATIVE AI SAMPLES (Once Available):
[Grid of samples:]
- Presentations (PDF previews)
- Voiceovers (audio players)
- Images (visual gallery)
- Content samples (blog post previews)

GITHUB STATS:
- 65K commits in 2024
- 37 personal repos
- 23 Mind Protocol repos
- 1,051 stars on Terminal Velocity
- Links to both GitHub profiles
```

---

## PROPOSAL TEMPLATES (Emma Uses These)

### Business Buyer Proposal (All Services)

**Template:**

```
Hi [Name],

I'll create [specific deliverable] in [timeline].

What you'll get:
✓ [Deliverable 1]
✓ [Deliverable 2]
✓ [Deliverable 3]
✓ 2 revision rounds included

Timeline: [X] days
Price: $[Y] fixed (no surprise costs)

Here's similar work I've done: [link to portfolio project]

I can start immediately and have [first milestone] to you by [date].

Ready to get started? Just confirm and I'll begin.

Best,
Nicolas
```

**Word count:** 200-300 words max

**Usage:**
- For ALL services (development + creative)
- Customize deliverables based on service type
- Always link to relevant portfolio project
- Always use "I" (not "we")
- Fixed price, fast timeline

---

## UPWORK PROFILE UPDATES

**Current Problems (Assumed):**
- May focus too much on technical dev work
- May not mention creative AI services
- May use "we" instead of "I"

**Recommended Profile:**

**Title:**
"Full-Stack Developer + AI Services | Web Apps, Chatbots, Presentations, Content | Fixed Price"

**Overview (First 3 Lines - CRITICAL):**
```
I build websites, AI chatbots, and web apps. I also create presentations, voiceovers,
translations, and content using AI. Fixed pricing. Fast delivery (2-7 days).
You pay only when you're completely satisfied.
```

**Services List:**
```
DEVELOPMENT:
✓ Web Development (Next.js, React, landing pages)
✓ AI Chatbot Integration (OpenAI, Claude API)
✓ Backend APIs (FastAPI, PostgreSQL)
✓ Document Processing (PDF parsing, AI extraction)

CREATIVE AI SERVICES:
✓ Presentations & Pitch Decks (Gamma AI)
✓ Voice & Audio (ElevenLabs)
✓ Translation (50+ languages, Claude AI)
✓ Content Writing (SEO blogs, product descriptions)
✓ Images & Graphics (Ideogram AI)
✓ Music & Sound (Suno/Udio AI)
```

**Portfolio:**
- 10-15 projects (mix of development + creative when available)
- Live links to deployed projects
- GitHub links
- Screenshots/previews

**Voice:**
- Use "I" throughout (not "we")
- Solo founder positioning
- Emphasize AI-assisted speed

---

## PRICING STRATEGY (Business Buyer Focus)

### Fixed Pricing Always (No Hourly)

**Development Services:**
- Landing pages: $200-400
- AI chatbot integration: $400-600
- Backend APIs: $300-500
- Document processing: $400-800

**Creative AI Services:**
- Presentations (10-15 slides): $400-600
- Voiceovers (10 videos): $300-600
- Translation (10K words): $500-1000
- Content writing (10 blog posts): $600-1200
- Images (50 graphics): $400-800
- Music (5 tracks): $300-600

**Tiered Pricing (Advanced - Optional):**

For larger projects, offer tiers:

```
EXAMPLE: Presentation Services

BASIC: $400
- 10-slide presentation
- Your brand colors
- 1 revision round
- Delivered in 5 days

STANDARD: $600 ⭐ MOST POPULAR
- 15-slide presentation
- Professional design
- 2 revision rounds
- Delivered in 4 days
- Editable PowerPoint file

PREMIUM: $900
- 20-slide presentation
- Custom visual design
- 3 revision rounds
- Delivered in 3 days
- PowerPoint + PDF + Google Slides
```

---

## COMMUNICATION STRATEGY (Business Buyers)

### During Project (Daily Updates)

**Template:**
```
Hi [Name],

Quick update: I've finished [X] of the [Y total]. They're looking great -
[specific positive detail about the work].

I'll have the remaining [Z] done by [date] and send everything for your review.

No action needed from you - just wanted to keep you in the loop!

Best,
Nicolas
```

**Why this works:**
- Reassures them (work is progressing)
- No action required (doesn't add to decision burden)
- Friendly tone (builds relationship)
- Solo voice ("I've finished," not "we've finished")

---

## IMPLEMENTATION ROADMAP

### Week 1 (High Priority)

**Day 1-2:**
- [ ] Hero section rewrite (1 hour)
- [ ] Services section redesign (3 hours - development + creative grid)
- [ ] "How It Works" section (1 hour)
- [ ] FAQ section (1 hour)

**Day 3-4:**
- [ ] About Me section (1 hour)
- [ ] Portfolio page creation (4-6 hours - extract from portfolio README, add screenshots)
- [ ] Get LinkedIn URL, add all GitHub links

**Day 5:**
- [ ] Final review and publish
- [ ] Update Upwork profile (1 hour)

**Total effort:** ~15-20 hours

---

### Week 2 (Polish)

**Optional improvements:**
- [ ] AI-powered estimate form (6-8 hours - Rafael implements)
- [ ] Add more portfolio projects
- [ ] Create creative AI samples (if you do client work)

---

## SUCCESS METRICS

**Homepage:**
- Bounce rate: Target <40%
- Time on page: Target >3 minutes
- "Get Free Estimate" clicks: Target >15% of visitors
- "See My Work" clicks: Target >20% of visitors

**Proposals (Emma tracks):**
- Win rate: Target 25-30%
- Response rate: Target >50%
- Average project value: Target $500-700
- Time to first response: Target <2 hours

**Revenue:**
- Week 1-2: Target $1200-1900/week
- Month 2+: Target $5000-7500/month

---

## CRITICAL CHANGES FROM V1

**What Changed:**
1. ✅ Solo founder voice ("I," not "we")
2. ✅ Removed "Trusted By" section (no client logos yet)
3. ✅ Removed testimonials (don't have them yet)
4. ✅ Removed "Schedule Call" CTA (no calls)
5. ✅ Added DEVELOPMENT services prominently (not just creative)
6. ✅ Portfolio page uses Nicolas's existing projects
7. ✅ Links to personal + Mind Protocol GitHub
8. ✅ Links to LinkedIn
9. ✅ Removed separate Process page (Emma handles technical proposals)
10. ✅ Focused ONLY on business buyers

**What Stayed:**
- Fixed pricing (no hourly)
- Fast timelines (2-7 days)
- Risk reversal ("pay only when satisfied")
- Visual portfolio
- Simple 4-step "How It Works"
- Business buyer FAQ

---

## NEXT STEPS

**For Nicolas:**
1. Approve this plan
2. Provide LinkedIn URL
3. Confirm which portfolio projects to showcase
4. Decide: implement yourself OR hire someone ($0-500)

**For Alexis:**
1. Draft all copy (hero, services, about, FAQ)
2. Extract portfolio projects from README
3. Wait for Nicolas approval

**For Rafael (if needed):**
1. Implement AI-powered estimate form (Week 2)
2. Help with portfolio page if Nicolas needs

**For Emma:**
1. Update proposal templates (use "I," not "we")
2. Emphasize BOTH development and creative services in job searches
3. Use business buyer template for all proposals

---

**Signature:**
Alexis — ScopeLock Strategic Operations
"Solo founder. Fast delivery. Fixed pricing. No BS."

**Last Updated:** 2025-11-07 (Revised based on Nicolas feedback)
