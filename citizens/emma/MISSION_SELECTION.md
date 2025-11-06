# ScopeLock Upwork Mission Selection Criteria

## The Golden Rule

**We only take missions where AI can generate 80%+ of the code and humans just deploy/verify.**

If Rafael can't build it in one conversation → we pass.

---

## Green Light Criteria (All Must Match)

### 1. **Budget: $200-$600 (Week 1-2), $600-$1500 (Week 3+)**

**Why this range:**
- Below $200: Client expects "cheap freelancer," high support burden
- $200-600: Perfect for 2-3 day missions, good client quality
- Above $1500: Scope too large OR client expectations too high for Week 1

**Red flag budgets:**
- $50-150: "Looking for cheap labor"
- $2000+: Enterprise complexity or scope creep risk

---

### 2. **Stack Match: 80%+ Our Tools**

**We say YES to:**
- Python backend (FastAPI, Flask, Django)
- JavaScript/TypeScript frontend (React, Next.js, Vue)
- Standard databases (PostgreSQL, MongoDB, SQLite)
- Cloud deploy (Render, Vercel, Heroku, Railway)
- APIs we know (Telegram, Stripe, SendGrid, Twilio, OpenAI)

**We say NO to:**
- Mobile apps (React Native, Flutter, Swift)
- Languages outside Python/JS/TS (Java, C#, PHP, Ruby)
- Proprietary platforms (Salesforce, SAP, custom CMS)
- Desktop apps (Electron okay, native no)
- Game development (Unity, Unreal)

**Gray area (ask NLR first):**
- WordPress/PHP if simple plugin
- Ruby/Rails if mostly frontend work
- Go/Rust if it's just API wrapper

---

### 3. **Clear Deliverable: You Can Write AC.md in 5 Minutes**

**Green flag descriptions:**
```
✅ "Build a landing page with email capture form"
✅ "Create Telegram bot that sends daily notifications"
✅ "Fix bug: API returns 500 on /users endpoint"
✅ "Deploy existing Next.js app to Vercel"
✅ "Add Stripe payment to existing checkout flow"
```

**Red flag descriptions:**
```
❌ "Improve our website" (what does improve mean?)
❌ "Make it faster" (how fast? which metric?)
❌ "Add features" (which features?)
❌ "Ongoing maintenance" (what counts as done?)
❌ "Help with project" (what project?)
```

**Test:** Can you list 5 acceptance criteria in 30 seconds?
- Yes → Clear deliverable
- No → Vague scope, pass

---

### 4. **Timeline: 2-7 Days**

**Sweet spot: 2-3 days for Week 1-2**

**Why:**
- Faster cash conversion
- Lower client anxiety
- Smaller scope = less risk
- Easier to test completely

**Red flags:**
- "ASAP" or "urgent" → Client disorganized, will change requirements
- "Ongoing" → Never-ending scope creep
- "1 day" → Unrealistic expectations
- "30+ days" → Too large, break into milestones

**Gray area:**
- "1 week" → Acceptable if scope is clear
- "2 weeks" → Only if milestones defined

---

### 5. **Client Quality: 3+ Indicators**

**Green flags (need 3+):**
- ✅ Payment verified
- ✅ $1000+ spent on Upwork
- ✅ 5+ hires
- ✅ 4.5+ rating
- ✅ Clear English communication
- ✅ Realistic budget for scope
- ✅ Responds to questions in proposal

**Red flags (1 = pass):**
- ❌ No payment verified
- ❌ First hire ever (risky, but okay if other green flags)
- ❌ <4.0 rating (difficult client)
- ❌ $0 spent (might be tire-kicker)
- ❌ "Many proposals" but no hires (shopping, won't decide)

**Auto-pass:**
- "Budget: $10-100" for complex work
- Poor English + vague scope (communication nightmare)
- Demands "cheap + fast + perfect"

---

### 6. **Competition: <15 Proposals**

**Why:**
- More than 15 proposals = lottery, low win rate
- Less than 5 proposals = might be hard job (others passed)
- 5-15 proposals = sweet spot

**Exception:**
- High-paying job ($1000+) with perfect fit → worth competing even if 20+ proposals

---

## Mission Type Targets (Priority Order)

### Tier 1: Fast Cash (2-3 days, $200-400)

**1. Landing Pages / Marketing Sites**
```
Example: "Build 3-page site: Home, About, Contact with email form"
Why it works: Next.js + Tailwind = Rafael knows this cold
Time: 6-8 hours actual work
```

**2. Telegram/Discord Bots**
```
Example: "Bot that sends daily weather updates to channel"
Why it works: Standard API pattern, Rafael has examples
Time: 4-6 hours actual work
```

**3. Simple APIs / Webhooks**
```
Example: "Webhook receiver that logs to database and notifies Slack"
Why it works: FastAPI boilerplate, standard flow
Time: 4-6 hours actual work
```

**4. Deployment / DevOps**
```
Example: "Deploy my Next.js app to Vercel with custom domain"
Why it works: Known process, clear success criteria
Time: 2-4 hours actual work
```

**5. Bug Fixes**
```
Example: "Fix: User login returns 500 error"
Why it works: Contained scope, debugging with Rafael
Time: 2-6 hours actual work (variable)
```

---

### Tier 2: Solid Revenue (3-5 days, $400-800)

**6. CRUD Dashboards**
```
Example: "Admin panel: Create/Read/Update/Delete users with search"
Why it works: Standard patterns, Rafael knows React Admin
Time: 12-20 hours actual work
```

**7. Payment Integration**
```
Example: "Add Stripe checkout to existing site"
Why it works: Well-documented API, Rafael has examples
Time: 8-12 hours actual work
```

**8. API Integration Projects**
```
Example: "Connect Airtable to SendGrid for automated emails"
Why it works: Two known APIs + glue code
Time: 10-16 hours actual work
```

**9. Email Automation**
```
Example: "Parse incoming emails, extract data, save to database"
Why it works: Standard parsing patterns
Time: 8-14 hours actual work
```

---

### Tier 3: Higher Value (5-7 days, $800-1500) - Week 3+

**10. Multi-Feature Web Apps**
```
Example: "Job board: Post jobs, apply, admin dashboard"
Why it works: Known patterns combined, clear scope
Time: 25-35 hours actual work
```

**11. Real-Time Features**
```
Example: "Add WebSocket chat to existing app"
Why it works: Socket.io patterns, Rafael knows this
Time: 15-25 hours actual work
```

---

## AI Integration Missions (Strategic Advantage)

### Why AI Integration Missions Are Perfect for ScopeLock

**The Strategic Advantage:**

1. **AI excels at these** - This is what Claude/GPT actually do natively
2. **Less competition** - Traditional devs don't know AI APIs well
3. **Higher perceived value** - "AI integration" sounds premium
4. **Faster delivery** - Often 4-8 hours vs. 20+ for web apps
5. **Better margins** - $400 for 6 hours of work vs. $400 for 20 hours
6. **Rafael's sweet spot** - Generating code that calls AI APIs = trivial for Claude

**The Risk We Must Manage:**

❌ Subjective quality ("make it perfect")
✅ Objective acceptance criteria ("95% accuracy on test set")

---

### Tier 1: Document & Data Processing (HIGHEST PRIORITY)

**Why These Are Gold:**
- **Objective AC.md possible** - "Extract these fields with 95%+ accuracy"
- **Clients have test data** - They can verify immediately
- **One-shot deliverable** - Process, deliver, done
- **Low API costs** - Parsing is cheap ($0.01-0.10 per document)

**Mission Types We Should Hunt:**

**1. PDF/Document Parsing**
```
Example: "Extract invoice data (date, total, items) from 500 PDFs"

AC.md writes itself:
- Extract fields: {date, invoice_number, total, line_items[]}
- Test on 50 sample PDFs (client provides)
- Accuracy: 95%+ vs. manual check
- Output: CSV with all extracted data
- Handle errors: Log failed parses

Budget: $400-800
Time: 6-12 hours
Stack: Python + LangChain/PyPDF2 + Claude API
API Cost: ~$5-15 (Claude for structured extraction)
```

**2. Email Processing Automation**
```
Example: "Parse support emails, categorize, extract customer info"

AC.md:
- Categories: {bug_report, feature_request, question, billing}
- Extract: {customer_email, subject, category, priority, summary}
- Test: 100 sample emails
- Accuracy: 90%+ on category classification
- Output: PostgreSQL database + Slack notification

Budget: $350-600
Time: 8-14 hours
Stack: Python + Gmail API + Claude API + PostgreSQL
API Cost: ~$2-8
```

**3. Data Extraction from Unstructured Text**
```
Example: "Extract company info from 1000 LinkedIn profiles"

AC.md:
- Extract: {company_name, industry, employee_count, location, description}
- Input: Text dumps or screenshots
- Accuracy: 85%+ (some profiles incomplete)
- Output: Structured JSON
- Handle: Missing fields gracefully

Budget: $300-600
Time: 6-10 hours
Stack: Python + Claude API + Pandas
API Cost: ~$10-20 (lots of text)
```

**4. Document Classification**
```
Example: "Sort 5000 customer documents into 10 categories"

AC.md:
- Categories: {contract, invoice, receipt, report, correspondence, ...}
- Test set: 200 pre-labeled documents
- Accuracy: 92%+ on test set
- Output: Organized folder structure OR database
- Speed: <1 second per document

Budget: $400-700
Time: 8-12 hours
Stack: Python + Claude/GPT-4 + embeddings
API Cost: ~$15-30 (classification with embeddings)
```

---

### Tier 2: Content Generation (GOOD, But Need Clear Templates)

**Why These Work (If Scoped Right):**
- **Template-based** - Clear format = objective AC
- **Bulk operations** - 100 items, not custom artisan content
- **Client provides examples** - "Make it like this"

**Mission Types We Should Hunt:**

**5. Product Description Generation**
```
Example: "Generate 500 product descriptions from spec sheets"

AC.md (the key is TEMPLATE):
- Input: CSV with {name, features, specs, price}
- Template: [Client provides 5 example descriptions]
- Tone: Professional, benefit-focused
- Length: 100-150 words each
- Output: CSV with generated descriptions
- Quality gate: Client approves 10 random samples before bulk

Budget: $400-800
Time: 6-10 hours (mostly setup + testing)
Stack: Python + Claude API + CSV processing
API Cost: ~$20-40 (500 generations)
```

**6. Blog Post Outlines from Keywords**
```
Example: "Generate 200 SEO blog outlines for SaaS topics"

AC.md:
- Input: Keywords list
- Output format: {title, H2s, H3s, key_points[]}
- Structure: Intro, 3-5 sections, conclusion, CTA
- Template: [Client provides 3 examples]
- SEO: Include keyword in title + 2 H2s
- Quality: Client approves 20 samples

Budget: $350-600
Time: 6-8 hours
Stack: Python + Claude API
API Cost: ~$15-30
```

**7. Email Template Personalization**
```
Example: "Personalize 1000 outreach emails from prospect data"

AC.md:
- Input: CSV with {name, company, industry, pain_point}
- Template: [Client provides base email]
- Personalize: Greeting, problem statement, CTA
- Constraints: <200 words, professional tone
- Output: 1000 unique emails
- Quality: No repeated phrases across emails

Budget: $300-500
Time: 4-8 hours
Stack: Python + Claude API + CSV
API Cost: ~$10-25
```

---

### Tier 3: Image Generation/Processing (PROCEED WITH CAUTION)

**Why These Are Tricky:**
- ⚠️ Subjective quality ("I don't like the style")
- ⚠️ High API costs ($0.02-0.10 per image)
- ⚠️ Iteration risk (endless "make it better")

**When to Say Yes:**

Only if client provides:
1. Exact style reference images
2. Specific dimensions/format requirements
3. Test batch approval before bulk generation
4. Fixed revision rounds (1-2 max)

**8. Automated Background Removal (SAFE)**
```
Example: "Remove background from 500 product photos"

AC.md (this one is OBJECTIVE):
- Input: 500 JPGs
- Process: Remove background → transparent PNG
- Quality: No artifacts on edges (visual inspection on 10 samples)
- Output: 500 PNGs, same dimensions
- Speed: Batch process, <5min total

Budget: $250-400
Time: 3-6 hours (mostly setup)
Stack: Python + remove.bg API or rembg library
API Cost: ~$50-100 (remove.bg) OR $0 (local rembg)

WHY THIS WORKS: Objective success criteria (background gone or not)
```

**9. Bulk Social Media Graphics (RISKY BUT POSSIBLE)**
```
Example: "Generate 100 Instagram posts for motivational quotes"

AC.md (KEY: Strict template):
- Input: CSV with {quote, author}
- Template: [Client provides 3 approved designs]
- Dimensions: 1080x1080px
- Format: PNG
- Consistency: Use exact same layout/fonts/colors
- Client approves: 5 samples before bulk generation

Budget: $400-700
Time: 8-12 hours (template setup + generation)
Stack: Python + Pillow/Canva API + template system
API Cost: ~$0-20 (if using Canva API)

WHY RISKY: "I don't like the font" → endless revisions
HOW TO MITIGATE: Client MUST approve template upfront
```

**10. AI Image Generation (HIGHEST RISK)**
```
Example: "Generate 50 unique illustrations for blog posts"

RED FLAGS:
❌ "Make them beautiful" (subjective)
❌ "Match our brand style" (vague)
❌ No reference images provided
❌ Open-ended revisions

ONLY SAY YES IF:
✅ Client provides 5+ reference images ("like this")
✅ Fixed style (e.g., "flat illustration, blue/orange palette")
✅ Test batch: Generate 5, client approves before bulk
✅ Max 1 revision round per image
✅ Budget accounts for API costs + revisions

Budget: $600-1000 (higher due to revision risk)
Time: 10-16 hours
Stack: Python + DALL-E/Midjourney API
API Cost: ~$50-150 (depending on model + revisions)
```

---

### Tier 4: AI-Powered Features (ADVANCED - Week 4+)

**11. Chatbot Integration**
```
Example: "Add AI chatbot to website for customer support"

Budget: $600-1200
Time: 12-20 hours
Stack: Next.js + OpenAI API + vector DB (Pinecone)
API Cost: ~$10-30/month ongoing
```

**12. Recommendation Engines**
```
Example: "Build product recommendation system based on user behavior"

Budget: $800-1500
Time: 20-30 hours
Stack: Python + embeddings + similarity search
```

---

## Auto-Pass Categories

**Never bid on these (Week 1-8):**

❌ **Mobile Apps**
- React Native, Flutter, Swift, Kotlin
- Why: Outside stack, different testing requirements

❌ **Machine Learning / Data Science**
- "Train a model," "Predict X," "Analyze dataset"
- Why: Requires specialized skills AI can't fully generate

❌ **Game Development**
- Unity, Unreal, Godot
- Why: Complex physics/rendering, high bug risk

❌ **Legacy Code Modernization**
- "Rewrite old PHP site to React"
- Why: Hidden complexity, scope creep guaranteed

❌ **"Ongoing" or "Maintenance" Without Clear Deliverables**
- "Help maintain our codebase"
- Why: Never done, scope creep

❌ **SEO / Marketing / Content**
- "Optimize our site for Google"
- Why: Not development work

❌ **Complex Algorithms**
- "Implement custom encryption"
- Why: High risk of bugs, hard to test

---

## Decision Flowchart

```
New Upwork Job Posted
    ↓
Budget $200-600? → NO → Pass
    ↓ YES
Stack 80%+ match? → NO → Pass
    ↓ YES
Can write AC.md in 5 min? → NO → Pass
    ↓ YES
Timeline 2-7 days? → NO → Pass
    ↓ YES
Client has 3+ green flags? → NO → Maybe (ask NLR)
    ↓ YES
<15 proposals? → NO → Maybe (if perfect fit)
    ↓ YES
Tier 1 or Tier 2 type? → NO → Pass
    ↓ YES
✅ WRITE PROPOSAL
```

---

## Updated Decision Criteria

### Add These Green Flags

**For Document/Data Processing:**
- ✅ Client has sample data (test set)
- ✅ Clear fields to extract (not "get all useful info")
- ✅ Measurable accuracy (95%+ on test set)
- ✅ Client can verify output objectively

**For Content Generation:**
- ✅ Template provided by client
- ✅ Bulk operation (50+ items, not custom)
- ✅ Approval gate (5-10 samples before bulk)
- ✅ Fixed format (not "be creative")

**For Image Tasks:**
- ✅ Objective criteria (dimensions, format, specific style)
- ✅ Reference images provided
- ✅ Test batch approval built into timeline
- ✅ Fixed revision rounds (1-2 max)

### Add These Red Flags

**For ANY AI Integration:**
- ❌ "Make it perfect" (subjective)
- ❌ "Be creative" without constraints
- ❌ No test data provided
- ❌ Unlimited revisions expected
- ❌ "I'll know it when I see it"

---

## Pricing Strategy for AI Missions

**Formula:**
```
Base Dev Time × Hourly Rate + API Cost × 3 + Revision Buffer

Example:
- Dev time: 8 hours × $50/hr = $400
- API cost: $20 × 3 = $60 (buffer for errors/testing)
- Revision buffer: $100 (for 1 round of fixes)
Total: $560 → Round to $600
```

**Why 3x API cost:**
- 1x for production
- 1x for testing
- 1x for mistakes/revisions

---

## Week 1 Target Profile

**Perfect first missions:**
- Budget: $250-400
- Type: Landing page OR Telegram bot OR simple API
- Client: Payment verified, $2000+ spent, 5+ hires
- Timeline: 2-3 days
- Proposals: 5-10
- Stack: 100% match (Next.js OR FastAPI, not both)

**Goal:** Land 1-2 of these by Friday.

---

## Emma's Evaluation Script

When Emma sees a job, she scores it:

```
Stack Match: 0-3 points (3 = 100% match)
Budget Fit: 0-2 points (2 = $200-600)
Clear Scope: 0-2 points (2 = can write AC.md instantly)
Client Quality: 0-2 points (2 = 4+ green flags)
Timeline: 0-1 point (1 = 2-7 days)
AI Integration Fit: 0-3 points (3 = Perfect, 2 = Good, 1 = Risky, 0 = No AI)

Total: 0-13 points

Score:
- 8-13: Strong yes, write proposal
- 6-7: Maybe, ask NLR
- 0-5: Pass
```

---

## Mission Target Summary Table

| Type | Budget | Time | API Cost | Competition | Priority |
|------|--------|------|----------|-------------|----------|
| **PDF Parsing** | $400-800 | 6-12h | $5-15 | Low | ⭐⭐⭐⭐⭐ |
| **Email Processing** | $350-600 | 8-14h | $2-8 | Low | ⭐⭐⭐⭐⭐ |
| **Data Extraction** | $300-600 | 6-10h | $10-20 | Medium | ⭐⭐⭐⭐ |
| **Doc Classification** | $400-700 | 8-12h | $15-30 | Low | ⭐⭐⭐⭐ |
| **Product Descriptions** | $400-800 | 6-10h | $20-40 | Medium | ⭐⭐⭐⭐ |
| **Blog Outlines** | $350-600 | 6-8h | $15-30 | Medium | ⭐⭐⭐ |
| **Email Personalization** | $300-500 | 4-8h | $10-25 | High | ⭐⭐⭐ |
| **Background Removal** | $250-400 | 3-6h | $0-100 | Medium | ⭐⭐⭐ |
| **Social Graphics** | $400-700 | 8-12h | $0-20 | Medium | ⭐⭐ |
| **AI Image Gen** | $600-1000 | 10-16h | $50-150 | High | ⭐ |
| Landing Pages | $200-400 | 6-8h | $0 | High | ⭐⭐⭐⭐ |
| Telegram Bots | $200-400 | 4-6h | $0 | Low | ⭐⭐⭐⭐⭐ |

---

## Week 1 Revised Target Mix

**Ideal portfolio:**
- 1x Telegram bot ($250) - Fast cash, proven
- 1x PDF parsing ($500) - Higher value, AI integration proof
- 1x Landing page ($300) - Fallback if above don't land

**Total: $1050 in pipeline, expect to land 1-2 = $250-800 Week 1 revenue**

---

## Real Examples (What to Look For)

### ✅ PERFECT JOB
```
Title: Build Landing Page for SaaS Product
Budget: $350
Description:
- Single page website
- Hero section with CTA
- Features grid (4 items)
- Pricing table
- Contact form (EmailJS)
- Deploy to Vercel
- Design: Clean, modern (provide Figma)
- Timeline: 3 days

Client: $5K spent, 12 hires, 4.9 rating, payment verified
Proposals: 8

Why perfect:
✅ $350 = sweet spot
✅ 100% Next.js + Tailwind
✅ Clear deliverables (can write AC.md instantly)
✅ 3 days = fast cash
✅ Great client
✅ Low competition
```

### ❌ AVOID
```
Title: Help with our website
Budget: $500
Description:
- Make website faster
- Improve design
- Add some features
- Ongoing help needed

Client: $0 spent, 0 hires, no payment verified
Proposals: 23

Why avoid:
❌ Vague scope ("help," "improve," "some")
❌ First-time client
❌ High competition
❌ "Ongoing" = never done
```

---

## Strategy Progression

**Week 1-2:** Focus on Web Dev + Document Processing (proven + easy AC.md)

**Week 3-4:** Add Content Generation (once we've proven we can deliver)

**Month 2+:** Carefully add Image tasks (highest risk, need track record first)

---

**This document is Emma's primary reference for evaluating which Upwork jobs to pursue. When in doubt, consult NLR.**
