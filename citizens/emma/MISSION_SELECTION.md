# ScopeLock Upwork Mission Selection Criteria

## The Golden Rule

**We only take missions where AI can generate 80%+ of the code and humans just deploy/verify.**

If Rafael can't build it in one conversation → we pass.

---

## Green Light Criteria (All Must Match)

### 1. **Budget: $400-$1500 (Business Buyer Sweet Spot)**

**Why this range:**
- Below $400: Too small for Business Buyers (marketing managers, founders, small business owners)
- $400-1500: Business Buyer sweet spot (70% of our target revenue)
- Above $1500: Enterprise complexity or requires multi-milestone structure

**Budget by service type:**

**Creative AI Services (70-85% margin):**
- Voice generation: $400-700
- Image generation (bulk): $400-800
- Presentation/PDF design: $400-800
- Translation: $500-1000
- Content writing: $600-1200
- Music generation: $300-600
- Video generation: $600-1200

**Development Services (50-60% margin):**
- Simple dashboards: $600-1200
- API integrations: $600-1000
- CRUD apps: $800-1500

**Red flag budgets:**
- $50-300: "Looking for cheap labor," not Business Buyers
- $2000+: Enterprise complexity or scope creep risk (need multi-milestone structure)

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

### 6. **Business Buyer Detection (Target 70% of Revenue)**

**Why Business Buyers:**
- Time-scarce (drowning in tasks, need fast results)
- Results-driven (don't care about process, only outcomes)
- Risk-averse (fear overpaying, making bad decisions)
- Decision timeline: 3-5 days (move fast once credible)
- Budget: $400-1500 (higher than Technical Buyers)

---

#### Business Buyer Signals (Look for 3+)

**Job Title Signals:**
- ✅ Marketing Manager, Content Manager, Social Media Manager
- ✅ Founder, Co-Founder, CEO, Business Owner
- ✅ Operations Manager, Project Manager
- ✅ "Small business owner," "Entrepreneur"
- ✅ Agency roles: "Agency owner," "Agency director"

**Language Patterns (Outcome-Focused):**
- ✅ "I need X delivered by [date]"
- ✅ "Looking for someone to handle Y"
- ✅ "Need help getting Z done quickly"
- ✅ "Deliver X so I can focus on my business"
- ✅ "Fast turnaround," "Quick delivery," "Need this ASAP"

**Description Style (Non-Technical):**
- ✅ Plain language (no technical jargon)
- ✅ Describes desired outcome, not implementation ("a dashboard to see my customers" not "React admin panel with PostgreSQL backend")
- ✅ Focuses on "what" not "how" ("10 podcast voiceovers" not "ElevenLabs API integration")
- ✅ Time pressure mentioned ("launching next week," "urgent," "deadline Friday")
- ✅ Business impact described ("save time," "grow audience," "launch faster")

**Budget Psychology Signals:**
- ✅ Fixed price explicitly requested
- ✅ "All-inclusive" or "turnkey" language
- ✅ Asks about revisions upfront ("how many revisions included?")
- ✅ Mentions past bad experiences ("need reliable person," "had issues before")
- ✅ Budget is round number ($500, $800, $1000 not $487 or $923)

**Decision Timeline Signals:**
- ✅ "Need to start immediately"
- ✅ "Looking to make decision this week"
- ✅ "Deadline in 5-7 days"
- ✅ Posts on Monday/Tuesday (ready to commit by Friday)
- ✅ Responds to proposals within 24 hours

---

#### Technical Buyer Signals (AVOID - Different Persona)

**These are NOT Business Buyers (30% revenue, different communication style):**

❌ Job titles: CTO, Tech Lead, Senior Developer, Engineering Manager
❌ Language: "CI/CD," "acceptance criteria," "test coverage," "scalability," "architecture"
❌ Process-focused: Mentions "methodology," "workflow," "best practices"
❌ Budget: $200-600 (lower than Business Buyers)
❌ Decision timeline: 10-14 days (slower, more technical evaluation)
❌ Description style: Technical implementation details, stack requirements

**If you see Technical Buyer signals:** SKIP (not our target persona for now)

---

### 7. **Competition: <15 Proposals**

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

## ⭐ CREATIVE AI SERVICES (STRATEGIC PRIORITY - HIGHEST MARGIN)

### Why Creative AI Is Our Competitive Moat

**The Game-Changing Advantage:**

1. **Zero traditional dev competition** - Dev shops don't bid on creative work
2. **AI-native workflow** - We have Ideogram, Runway, Suno, ElevenLabs, Gamma integrated
3. **Massive margins** - 70-85% profit (AI does the work, humans QA)
4. **Higher budgets** - $400-1500 vs $200-400 for dev work
5. **Faster delivery** - 4-10 hours vs 20-40 hours for equivalent value
6. **Clear AC.md possible** - Objective criteria (quantity, format, approval gates)
7. **Scalable** - One human can QA 10x more creative output than code

**The Risk We Must Manage:**

❌ Subjective quality ("make it beautiful")
✅ Objective acceptance criteria ("Client approves 10 samples before bulk")

**Critical Success Factor:**
- **Template/Style approval UPFRONT** - Client must approve samples before bulk generation
- **Fixed revision rounds** - 1-2 rounds max, scoped in AC.md
- **Reference materials required** - Client provides examples of desired style

---

### Tier 1A: Image Generation (Ideogram) - ⭐⭐⭐⭐⭐

**Why Ideogram Is Perfect:**
- Text-in-image capability (better than DALL-E/Midjourney for branded content)
- Consistent style across batches
- Fast generation (<30s per image)
- Affordable API ($0.50-1.00 per image)

**Mission Types:**

**1. Bulk Product Images**
```
Example: "Generate 100 product mockup images for e-commerce store"

AC.md Template:
- Input: Product names + descriptions (CSV)
- Style: [Client provides 3-5 reference images]
- Format: 1024x1024 PNG, transparent background
- Text: Product name on each image (if applicable)
- Quantity: 100 images
- Approval gate: Client approves 10 sample images before bulk
- Revisions: 1 round for failed images only (missing text, wrong style)
- Output: ZIP file organized by product category
- Delivery: Google Drive link + organized folder structure

Budget: $400-800
Time: 4-8 hours (setup + generation + QA)
API Cost: ~$50-100 (Ideogram $0.50-1.00 per image)
Margin: 75-80%

Red Flags to Avoid:
❌ "Make them beautiful" (too subjective)
❌ No reference images provided
❌ Client wants "unique artistic vision" (scope creep)
❌ Unlimited revisions expected

Green Flags to Seek:
✅ Client has clear brand guidelines
✅ Provides 3+ reference images
✅ Bulk operation (50+ images)
✅ Willing to approve sample batch first
```

**2. Social Media Content (Branded)**
```
Example: "Create 30 Instagram posts with motivational quotes"

AC.md Template:
- Input: 30 quotes (client provides CSV)
- Brand: Colors, fonts, logo (client provides brand kit)
- Dimensions: 1080x1080px (Instagram square)
- Style: Consistent across all images
- Text placement: Quote centered, author bottom-right
- Approval: Client approves 5 sample images before bulk
- Revisions: Max 2 rounds of template adjustments
- Delivery: 30 JPGs + Canva template for future use

Budget: $350-600
Time: 6-10 hours (template creation + generation + QA)
API Cost: ~$30-60
Margin: 70-75%
```

**3. Marketing Visuals (Blog Headers, Ads)**
```
Example: "Generate 20 unique header images for blog posts"

AC.md Template:
- Topics: [Client provides list of 20 blog post titles]
- Style: Professional, modern, consistent color palette
- Dimensions: 1200x630px (blog header standard + social share)
- Text overlay: Blog post title on each image
- Format: JPG
- Brand consistency: Use client's primary colors
- Approval: Client approves 3 samples before bulk
- Revisions: 1 round per batch of 10

Budget: $300-500
Time: 4-6 hours
API Cost: ~$20-40
Margin: 75%
```

**4. E-book/PDF Covers**
```
Example: "Design 5 e-book covers for lead magnets"

AC.md Template:
- Titles: [5 e-book titles provided]
- Style: [Client provides 2-3 reference covers]
- Dimensions: 1600x2560px (standard e-book cover)
- Format: PNG with transparent background + JPG preview
- Text: Title, subtitle, author name
- Branding: Client logo included
- Approval: Client approves 1 sample before creating remaining 4
- Revisions: 2 rounds max (text placement, color adjustments)

Budget: $250-500
Time: 4-8 hours
API Cost: ~$10-25
Margin: 80%
```

---

### Tier 1B: Video Generation (Runway) - ⭐⭐⭐⭐⭐

**Why Runway Is Strategic:**
- Text-to-video + image-to-video capability
- Professional quality (competitors charge $500+ per video)
- Fast generation (2-5 min per 10-second clip)
- Perfect for product demos, ads, social media

**Mission Types:**

**1. Product Demo Videos**
```
Example: "Create 10 short product demo videos (15-30 seconds each)"

AC.md Template:
- Input: Product images + text descriptions
- Style: [Client provides reference video OR we suggest template]
- Duration: 15-30 seconds per video
- Format: MP4, 1080p, 30fps
- Voiceover: AI-generated (ElevenLabs) OR text-on-screen (client choice)
- Music: Royalty-free background music included
- Transitions: Smooth cuts, professional pacing
- Branding: Client logo in corner (optional)
- Approval: Client approves 2 sample videos before bulk
- Revisions: 1 round of edits per video (timing, text, music)

Budget: $600-1200
Time: 8-16 hours (video editing + generation + rendering)
API Cost: ~$100-200 (Runway ~$10-20 per video)
Margin: 50-60%
```

**2. Social Media Ads (TikTok/Instagram Reels)**
```
Example: "Generate 5 TikTok-style video ads (10-15 seconds)"

AC.md Template:
- Input: Product photos + key selling points
- Style: Dynamic, eye-catching, trending format
- Duration: 10-15 seconds each
- Format: Vertical 9:16, MP4
- Text overlays: Product name + CTA + price (if applicable)
- Music: Trending audio track (client provides OR we source royalty-free)
- Hooks: Attention-grabbing first 2 seconds
- Approval: Client approves 1 sample before bulk
- Delivery: 5 MP4 files + source files

Budget: $400-700
Time: 6-10 hours
API Cost: ~$50-100
Margin: 55-65%
```

**3. Explainer Videos (Animated)**
```
Example: "Create 3-minute explainer video for SaaS product"

AC.md Template:
- Script: [Client provides OR we write based on brief]
- Style: [Client provides reference video]
- Duration: 2-3 minutes
- Format: MP4, 1080p horizontal
- Voiceover: Professional AI voice (ElevenLabs)
- Visuals: Product screenshots + animated transitions
- Music: Background music throughout
- CTA: Call-to-action at end
- Approval: Client approves 30-second preview before full video
- Revisions: 2 rounds (script changes, timing, visuals)

Budget: $800-1500
Time: 12-20 hours
API Cost: ~$150-300 (Runway + ElevenLabs)
Margin: 45-55%
```

---

### Tier 1C: Music Generation (Suno/Udio) - ⭐⭐⭐⭐⭐

**Why Music Generation Is Undervalued:**
- Traditional music licensing: $50-500 per track
- Suno/Udio: $0.10-1.00 per generation
- Custom music = premium pricing
- Perfect for videos, podcasts, ads, apps

**Mission Types:**

**1. Background Music for Videos**
```
Example: "Create 10 royalty-free background tracks for YouTube videos (2-3 min each)"

AC.md Template:
- Style: [Client provides reference tracks OR describes mood]
- Duration: 2-3 minutes each (loopable)
- Genre: Upbeat corporate, chill lofi, energetic pop, etc.
- Tempo: BPM range specified
- Instruments: [Client specifies OR we suggest based on mood]
- Format: MP3 320kbps + WAV (lossless)
- Usage: Royalty-free, client owns rights
- Approval: Client approves 2 sample tracks before bulk
- Revisions: 1 round per track (tempo, instrumentation)

Budget: $300-600
Time: 4-8 hours (generation + editing/trimming)
API Cost: ~$10-30 (Suno/Udio $1-3 per track)
Margin: 75-80%
```

**2. Podcast Intro/Outro Music**
```
Example: "Create custom intro + outro music for podcast (30 seconds each)"

AC.md Template:
- Style: [Client provides reference OR describes brand]
- Duration: 30 seconds intro + 30 seconds outro
- Branding: Upbeat, memorable, podcast-appropriate
- Voiceover space: Leave 10 seconds in middle for voice (intro only)
- Format: MP3 + WAV
- Revisions: 2 rounds (style, tempo, length)
- Usage: Exclusive rights for client

Budget: $200-400
Time: 3-6 hours
API Cost: ~$5-15
Margin: 75%
```

**3. App/Game Sound Effects + Music**
```
Example: "Create 20 sound effects + 3 background tracks for mobile game"

AC.md Template:
- Sound effects: Button clicks, success sounds, error sounds, etc.
- Background tracks: Menu music, gameplay music, boss fight music
- Style: [Client provides reference game OR describes vibe]
- Format: WAV (lossless) for integration
- Duration: Sound effects 0.5-2s each, tracks 1-2 min (loopable)
- Approval: Client approves 5 sound effects + 1 track before bulk
- Revisions: 1 round

Budget: $400-800
Time: 6-12 hours
API Cost: ~$30-60
Margin: 70%
```

**4. Custom Jingles/Brand Music**
```
Example: "Create 15-second brand jingle for radio/video ads"

AC.md Template:
- Style: Catchy, memorable, brand-appropriate
- Duration: 15 seconds
- Lyrics: Client provides OR we write based on tagline
- Vocals: AI-generated singing (Suno) OR instrumental only
- Variations: 3 versions (full, instrumental, shortened 5s)
- Format: MP3 + WAV
- Approval: Client approves 1 concept before refinement
- Revisions: 3 rounds (this is high-value creative work)

Budget: $500-1000
Time: 8-12 hours (multiple iterations)
API Cost: ~$20-40
Margin: 60-70%
```

---

### Tier 1D: Voice Generation (ElevenLabs) - ⭐⭐⭐⭐⭐

**Why ElevenLabs Is High-Value:**
- Professional voiceover talent: $100-500 per project
- ElevenLabs: $0.30-3.00 per 1000 characters
- Instant turnaround (no voice actor scheduling)
- Multiple language support

**Mission Types:**

**1. Video Voiceovers**
```
Example: "Generate voiceovers for 10 product videos (30-60 seconds each)"

AC.md Template:
- Scripts: [Client provides OR we write based on video content]
- Voice: [Client chooses from ElevenLabs voice library OR we suggest]
- Tone: Professional, friendly, energetic (client specifies)
- Duration: 30-60 seconds per video (300-500 words total per video)
- Format: MP3 320kbps
- Pacing: Natural pauses, emphasis on key points
- Sync: Timed to match video scenes (if client provides video)
- Approval: Client approves 1 sample voiceover before bulk
- Revisions: 1 round (re-record with adjusted tone/pacing)

Budget: $300-600
Time: 4-8 hours (script writing + generation + timing)
API Cost: ~$10-30 (ElevenLabs ~$1-3 per video)
Margin: 75-80%
```

**2. Audiobook Narration**
```
Example: "Narrate 10,000-word e-book (approx 1 hour audio)"

AC.md Template:
- Input: Text document (Word/PDF)
- Voice: [Client selects from voice library]
- Tone: Consistent with book genre (business, fiction, self-help)
- Length: ~10,000 words = ~60 minutes audio
- Format: MP3 chapters + single full audiobook file
- Editing: Remove long pauses, normalize volume
- Approval: Client approves 5-minute sample before full narration
- Revisions: 1 round (re-record specific sections if needed)

Budget: $400-800
Time: 6-10 hours (generation + editing + chapter splitting)
API Cost: ~$30-60 (ElevenLabs charges by character count)
Margin: 70-75%
```

**3. Podcast Voiceover / Narration**
```
Example: "Generate voiceovers for 10 podcast episodes (5-10 min each)"

AC.md Template:
- Scripts: [Client provides per episode]
- Voice: Consistent voice across all episodes
- Tone: Conversational, engaging
- Duration: 5-10 minutes per episode (500-1000 words)
- Format: MP3 per episode
- Quality: Studio-quality audio, minimal background noise
- Approval: Client approves episode 1 before bulk
- Revisions: 1 round per episode

Budget: $400-700
Time: 6-10 hours
API Cost: ~$30-50
Margin: 70%
```

**4. IVR / Phone System Messages**
```
Example: "Create 20 IVR messages for business phone system"

AC.md Template:
- Messages: Greeting, menu options, hold music message, voicemail, etc.
- Voice: Professional, clear pronunciation
- Scripts: [Client provides OR we write standard IVR copy]
- Format: WAV (phone system compatible)
- Length: 5-30 seconds per message
- Approval: Client approves 3 sample messages
- Revisions: 1 round

Budget: $250-500
Time: 4-6 hours
API Cost: ~$5-15
Margin: 80%
```

**5. Language Learning / Pronunciation Audio**
```
Example: "Generate 500 pronunciation audio files for language app (words + sentences)"

AC.md Template:
- Input: CSV with 500 words/sentences
- Languages: [Client specifies, ElevenLabs supports 29 languages]
- Voice: Native speaker accent
- Format: MP3 per word/sentence, organized in folders
- Speed: Normal speaking pace (or client-specified)
- Quality: Clear pronunciation for learning
- Approval: Client reviews 20 samples before bulk
- Revisions: Re-record mispronounced words

Budget: $400-800
Time: 6-10 hours (batch processing + QA)
API Cost: ~$50-100
Margin: 65-70%
```

---

### Tier 1E: Presentation/PDF Generation (Gamma) - ⭐⭐⭐⭐

**Why Gamma Is Strategic:**
- Professional designers charge $500-2000 for pitch decks
- Gamma generates in minutes
- AI-powered layout + design
- Perfect for startup pitch decks, sales presentations, reports

**Mission Types:**

**1. Pitch Deck / Investor Presentation**
```
Example: "Create 15-slide investor pitch deck for startup"

AC.md Template:
- Content: [Client provides outline OR we structure based on brief]
- Slides: Problem, Solution, Market, Traction, Team, Ask (standard pitch format)
- Design: Professional, clean, brand colors
- Charts: Market size, revenue projections (client provides data)
- Length: 12-15 slides
- Format: PDF + editable Gamma link
- Revisions: 2 rounds (content, design, data)
- Delivery: PDF for sharing + Gamma link for future edits

Budget: $400-800
Time: 6-10 hours (content + design + data visualization)
API Cost: ~$10-20 (Gamma Pro subscription)
Margin: 75%
```

**2. Sales Presentation / One-Pager**
```
Example: "Create 10-slide sales deck + 1-page PDF summary"

AC.md Template:
- Content: Product overview, benefits, case studies, pricing
- Design: Client brand colors + logo
- Length: 10 slides + 1-page summary
- Format: PDF (presentation) + PDF (one-pager)
- Approval: Client reviews slide 1-3 before completing deck
- Revisions: 2 rounds

Budget: $300-600
Time: 5-8 hours
API Cost: ~$5-10
Margin: 75-80%
```

**3. Training Manuals / Employee Handbooks**
```
Example: "Create 30-page employee onboarding handbook (PDF)"

AC.md Template:
- Content: [Client provides outline + raw text]
- Sections: Welcome, Company values, Policies, Benefits, Resources
- Design: Professional layout, branded
- Length: 25-30 pages
- Format: PDF
- Visuals: Icons, diagrams, photos (client provides OR we source stock)
- Approval: Client reviews first 10 pages before completing
- Revisions: 2 rounds

Budget: $500-1000
Time: 8-14 hours
API Cost: ~$10-20
Margin: 70%
```

**4. Lead Magnet PDFs / E-books**
```
Example: "Design 20-page e-book for lead generation"

AC.md Template:
- Content: [Client provides text content]
- Design: Eye-catching cover + clean interior layout
- Length: 15-20 pages
- Format: PDF
- Branding: Client logo, colors, fonts
- CTA: Links to client website/landing page
- Approval: Client approves cover + first 3 pages
- Revisions: 2 rounds

Budget: $300-600
Time: 5-8 hours
API Cost: ~$5-10
Margin: 75%
```

**5. Reports / White Papers**
```
Example: "Create 40-page industry report with data visualizations"

AC.md Template:
- Content: [Client provides research data + text]
- Charts: 10-15 data visualizations (graphs, charts, infographics)
- Design: Professional, report-appropriate layout
- Length: 35-40 pages
- Format: PDF
- Citations: Properly formatted references
- Approval: Client reviews first 10 pages + 3 sample charts
- Revisions: 2 rounds

Budget: $700-1200
Time: 10-16 hours
API Cost: ~$15-25
Margin: 65-70%
```

---

### Tier 1F: Translation Services - ⭐⭐⭐⭐

**Why Translation Is High-Margin:**
- Professional translators: $0.10-0.30 per word
- Claude API: $0.001-0.003 per word
- 95%+ accuracy for most language pairs
- Fast turnaround (10,000 words in 2 hours)

**Mission Types:**

**1. Website/App Translation**
```
Example: "Translate website from English to 5 languages (French, Spanish, German, Italian, Portuguese)"

AC.md Template:
- Input: Website content (JSON/CSV/TXT files)
- Languages: 5 target languages
- Word count: [Estimate from client content]
- Tone: Maintain original tone (professional, casual, technical)
- Context-aware: Technical terms, brand names preserved correctly
- Format: Same structure as input (JSON keys preserved, HTML tags intact)
- QA: Native speaker review for 10% of content (client provides reviewer OR we charge extra $100)
- Revisions: 1 round of corrections per language

Budget: $500-1000 (based on word count)
Example pricing: 10,000 words × 5 languages = 50,000 words → $600
Time: 6-10 hours (setup + QA + formatting)
API Cost: ~$30-60 (Claude translation)
Margin: 70-75%
```

**2. Document Translation (Bulk)**
```
Example: "Translate 200 product descriptions from English to Spanish"

AC.md Template:
- Input: 200 descriptions (CSV)
- Source: English
- Target: Spanish (Latin America variant OR Spain Spanish - client specifies)
- Word count: ~20,000 words total
- Maintain formatting: Bullet points, capitalization, special characters
- Quality: Natural-sounding, not literal translation
- Terminology: Consistent product terms throughout
- Approval: Client reviews 20 sample translations before bulk
- Delivery: CSV with original + translated columns

Budget: $300-600
Time: 4-8 hours
API Cost: ~$20-40
Margin: 70%
```

**3. Marketing Content Translation**
```
Example: "Translate 10 blog posts from English to German (8,000 words total)"

AC.md Template:
- Input: 10 blog posts (Markdown or Word)
- Target: German (formal vs informal - client specifies)
- Word count: ~8,000 words
- Tone: Marketing-appropriate, engaging
- SEO: Translate meta descriptions + alt text
- Links: Preserve all hyperlinks
- Approval: Client reviews 1 full blog post before bulk
- Revisions: 1 round per post

Budget: $400-700
Time: 6-10 hours
API Cost: ~$25-40
Margin: 70%
```

**4. Legal/Technical Document Translation (Higher Complexity)**
```
Example: "Translate legal contract from English to French (5,000 words)"

AC.md Template:
- Input: Legal contract (PDF/Word)
- Target: French (legal terminology)
- Word count: 5,000 words
- Accuracy: Legal terms must be precise
- Format: Preserve exact formatting (clauses, sections, numbering)
- QA: MANDATORY native legal professional review (we coordinate)
- Disclaimer: Translation for reference only, not legal advice
- Revisions: 2 rounds after legal review

Budget: $600-1000 (higher due to legal complexity + required review)
Time: 8-12 hours (translation + legal reviewer coordination)
API Cost: ~$30-50
Margin: 60% (lower due to required legal review)

⚠️ RED FLAG: Only take legal/medical translations if client understands limitations
```

---

### Tier 1G: Content Writing/Editing - ⭐⭐⭐⭐

**Why Content Writing Works:**
- Professional writers: $0.10-0.50 per word
- AI generation: $0.001-0.005 per word
- Human QA ensures quality
- Scalable (can produce 10K words/day)

**Mission Types:**

**1. SEO Blog Posts (Bulk)**
```
Example: "Write 10 SEO-optimized blog posts (800-1200 words each)"

AC.md Template:
- Topics: [Client provides keywords + outlines OR we research]
- Tone: Professional, informative (client provides 2-3 reference posts)
- SEO requirements:
  - Keyword in title, H1, first paragraph, 2+ H2s
  - Meta description (150-160 chars)
  - Internal links (3-5 per post)
  - Alt text for images
- Structure: Intro, 3-5 H2 sections, conclusion with CTA
- Length: 800-1200 words per post
- Quality gate: Client approves 2 sample posts before bulk
- Revisions: 1 round of edits per post (fact corrections, tone adjustments)
- Delivery: 10 Markdown files + meta descriptions + suggested images

Budget: $600-1200 ($60-120 per post)
Time: 8-16 hours (research + generation + editing + SEO optimization)
API Cost: ~$30-60
Margin: 60-70%
```

**2. Product Descriptions (E-commerce)**
```
Example: "Write 500 unique product descriptions (100-150 words each)"

AC.md Template:
- Input: Product specs (CSV: name, features, benefits, price)
- Tone: [Client provides 5 example descriptions]
- Structure: Feature highlight → Benefit → CTA
- Length: 100-150 words each
- SEO: Include product name + category keywords naturally
- Uniqueness: No duplicate phrasing across descriptions (we ensure variety)
- Format: CSV with descriptions column added
- Approval: Client reviews 20 sample descriptions before bulk
- Revisions: 1 round for style/tone adjustments (not individual product edits)

Budget: $400-800
Time: 6-10 hours
API Cost: ~$40-80 (500 generations)
Margin: 65-70%
```

**3. Email Campaigns**
```
Example: "Write 12 email sequences for SaaS onboarding (6 emails × 2 personas)"

AC.md Template:
- Personas: [Client defines 2 target personas with pain points]
- Sequence timing: Day 0, 2, 4, 7, 14, 21 (welcome → activation → retention)
- Tone: Friendly, helpful (client provides reference emails)
- Length: 150-250 words per email
- Structure: Hook → Value → CTA
- CTAs: Clear action in each email (login, complete profile, book demo, etc.)
- Subject lines: 3 options per email (A/B test ready)
- Approval: Client reviews 1 complete sequence (6 emails) before finalizing second persona
- Delivery: Google Docs with all emails organized by persona + day

Budget: $350-600
Time: 6-10 hours
API Cost: ~$10-20
Margin: 70%
```

**4. Social Media Content Calendar**
```
Example: "Create 30 days of social media posts (LinkedIn + Twitter)"

AC.md Template:
- Platforms: LinkedIn + Twitter (different copy for each)
- Frequency: 1 post per day × 30 days × 2 platforms = 60 posts
- Tone: [Client provides brand voice guidelines]
- Topics: [Client provides themes OR we suggest based on industry]
- Length: LinkedIn 150-300 words, Twitter 200-280 chars
- Hashtags: 3-5 relevant hashtags per post
- CTAs: Include link/CTA every 3rd post
- Format: CSV with columns: Date, Platform, Post, Hashtags, Link
- Approval: Client reviews week 1 (7 days × 2 platforms) before bulk
- Revisions: 1 round for tone adjustments

Budget: $400-700
Time: 6-10 hours
API Cost: ~$20-40
Margin: 70%
```

**5. Case Studies / Testimonial Writing**
```
Example: "Write 5 customer case studies (800-1000 words each)"

AC.md Template:
- Input: Client provides customer interview notes OR we conduct interviews (extra $100/interview)
- Structure: Challenge → Solution → Results (with metrics)
- Tone: Professional, results-focused
- Length: 800-1000 words each
- Quotes: Include 2-3 customer quotes per case study
- Metrics: Before/after data (revenue increase, time saved, etc.)
- Approval: Client + customer review each case study
- Revisions: 2 rounds per case study (client + customer feedback)

Budget: $500-900
Time: 8-14 hours (interviewing + writing + revisions)
API Cost: ~$15-30
Margin: 65%
```

**6. Text Review/Proofreading**
```
Example: "Proofread and edit 50 blog posts for grammar, clarity, SEO"

AC.md Template:
- Input: 50 blog posts (Google Docs or Markdown)
- Tasks:
  - Fix grammar, spelling, punctuation
  - Improve clarity and flow (sentence restructuring)
  - Optimize for SEO (keyword density, readability score, meta descriptions)
  - Suggest better headlines/subheadings
- Track changes: All edits visible (Google Docs suggestions mode)
- Comments: Flag major issues for client review
- Delivery: Edited documents + summary report of major changes
- Quality: Client reviews 5 sample edits before bulk

Budget: $300-600
Time: 8-12 hours
API Cost: ~$20-40
Margin: 70%
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

**CREATIVE AI SERVICES (HIGHEST MARGIN, LOWEST COMPETITION):**

| Type | Budget | Time | API Cost | Margin | Competition | Priority |
|------|--------|------|----------|--------|-------------|----------|
| **Presentation/Decks (Gamma)** | $400-800 | 4-8h | $10-20 | 75-80% | Very Low | ⭐⭐⭐⭐⭐ |
| **Translation (Claude)** | $500-1000 | 6-10h | $10-30 | 70-75% | Low | ⭐⭐⭐⭐⭐ |
| **Voice Gen (ElevenLabs)** | $300-600 | 4-8h | $20-60 | 75-80% | Very Low | ⭐⭐⭐⭐⭐ |
| **Content Writing (Claude)** | $600-1200 | 8-12h | $30-100 | 60-70% | Medium | ⭐⭐⭐⭐⭐ |
| **Image Gen (Ideogram)** | $400-800 | 4-8h | $50-100 | 75-80% | Low | ⭐⭐⭐⭐ |
| **Music Gen (Suno/Udio)** | $300-600 | 4-8h | $10-40 | 75-80% | Very Low | ⭐⭐⭐⭐ |
| **Video Gen (Runway)** | $600-1200 | 8-16h | $100-200 | 50-60% | Low | ⭐⭐⭐ |

**TRADITIONAL DEV + AI INTEGRATION:**

| Type | Budget | Time | API Cost | Margin | Competition | Priority |
|------|--------|------|----------|--------|-------------|----------|
| **PDF Parsing** | $400-800 | 6-12h | $5-15 | 60-70% | Low | ⭐⭐⭐⭐⭐ |
| **Email Processing** | $350-600 | 8-14h | $2-8 | 60-70% | Low | ⭐⭐⭐⭐⭐ |
| **Data Extraction** | $300-600 | 6-10h | $10-20 | 55-65% | Medium | ⭐⭐⭐⭐ |
| **Doc Classification** | $400-700 | 8-12h | $15-30 | 60-70% | Low | ⭐⭐⭐⭐ |
| **Telegram Bots** | $200-400 | 4-6h | $0 | 60-70% | Low | ⭐⭐⭐⭐ |
| **Landing Pages** | $200-400 | 6-8h | $0 | 50-60% | High | ⭐⭐⭐ |

---

## Week 1 Revised Target Mix

**NEW PRIORITY (Creative AI Services First):**

**Ideal portfolio:**
- 1x Presentation/PDF generation (Gamma) ($500) - Highest margin (75-80%), very low competition
- 1x Voice generation (ElevenLabs) ($400) - Fast delivery (4-8h), 75-80% margin, unique offering
- 1x Translation job ($600) - Clear AC.md, 70-75% margin, scalable
- 1x PDF parsing ($500) - Fallback, proven AI integration

**Total: $2000 in pipeline, expect to land 1-2 = $400-1100 Week 1 revenue**

**Why creative services first:**
- ✅ 70-85% margins vs 50-60% for traditional dev
- ✅ Zero traditional dev competition (they don't have Ideogram/Runway/Suno/ElevenLabs)
- ✅ Faster delivery (4-10 hours vs 20-40 hours for equivalent value)
- ✅ Clear AC.md possible ("Client approves 10 samples before bulk")
- ✅ Higher budgets ($400-1500 vs $200-400)
- ✅ One human can QA 10x more creative output than code

**Traditional dev as fallback:**
- Only bid on Telegram bots, PDF parsing if creative services pipeline is empty
- Still valuable for building portfolio + proving delivery capability

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

**Week 1-2 (NEW STRATEGY):**
- **PRIMARY:** Creative AI services (Gamma, ElevenLabs, Translation, Content Writing) - 70-85% margins, low competition
- **SECONDARY:** Document Processing (PDF parsing, Email processing) - proven AI integration
- **FALLBACK:** Simple dev (Telegram bots, Landing pages) - only if creative pipeline empty

**Week 3-4:**
- **Add:** Image generation (Ideogram) - bulk product images, social media graphics
- **Add:** Music generation (Suno/Udio) - podcast intros, background music, jingles
- **Continue:** Creative AI services (this is the core business now)

**Month 2+:**
- **Carefully add:** Video generation (Runway) - higher API costs, needs client education
- **Scale:** Creative services to $5-10K monthly revenue before adding complex dev work
- **Future:** Evidence Sprint → Full Build only after proving creative services delivery

---

**This document is Emma's primary reference for evaluating which Upwork jobs to pursue. When in doubt, consult NLR.**
