# EMAIL OPPORTUNITY DETECTION SYSTEM
## AI-Powered Business Development Pipeline from Joe's Inbox

**Version:** 1.0  
**Created:** November 21, 2025  
**Purpose:** Extract and qualify business opportunities from Ikechukwu Okuzu's email archive  
**Expected Output:** 20-50 ranked opportunities with personalized pitch drafts  

---

## 🎯 SYSTEM OVERVIEW

### What This System Does:

1. **Extracts** Joe's last 12 months of emails
2. **Analyzes** them with AI to find opportunity signals
3. **Scores** each opportunity by urgency, budget, fit
4. **Researches** organizations via web search
5. **Generates** personalized pitch drafts
6. **Tracks** responses and conversions

### Expected Timeline:

- **Day 1-2:** Joe exports and shares emails
- **Day 3-5:** AI analysis and opportunity extraction
- **Day 6-7:** Web research and enrichment
- **Day 8-10:** Pitch generation for top 10-20 opportunities
- **Day 11+:** Outreach, tracking, follow-ups

### Expected Results:

- **Total opportunities identified:** 50-100
- **HOT opportunities:** 10-20
- **WARM opportunities:** 20-30
- **COLD opportunities:** 20-50
- **Qualified for immediate outreach:** 10-20
- **Expected response rate:** 30-40%
- **Expected conversion rate:** 10-25%
- **Expected contracts (90 days):** 1-3

---

## 📥 PHASE 1: EMAIL EXPORT & PREPARATION

### Step 1: Request Email Export from Joe

📋 **Send this to Joe via LinkedIn/WhatsApp:**

---

Hey Joe!

Ready to start mining opportunities from your inbox. Here's what I need:

**Option 1: Google Takeout (Recommended for Gmail)**

1. Go to: https://takeout.google.com
2. Click "Deselect all"
3. Scroll down and check ONLY "Mail"
4. Click "All Mail data included" → Deselect all → Select only:
   - ✅ Inbox
   - ✅ Sent Mail
5. Click "Next step"
6. Choose:
   - Export once
   - .zip format
   - File size: 10 GB max (or split into multiple files)
7. Click "Create export"
8. Wait for email notification (usually 2-24 hours)
9. Download the .zip file
10. Upload to Google Drive and share link with me

**Time Required:** 5 minutes setup + wait for Google to prepare

---

**Option 2: Outlook Export (If using Outlook/Microsoft)**

1. Open Outlook desktop app
2. File → Open & Export → Import/Export
3. Choose "Export to a file"
4. Select "Outlook Data File (.pst)"
5. Choose "Inbox" and "Sent Items"
6. Select date range: Last 12 months
7. Save file to desktop
8. Upload to Google Drive/Dropbox
9. Share link with me

**Time Required:** 10-15 minutes

---

**Option 3: Simple Forward (If exports don't work)**

Just forward me your last 500-1000 emails to: [YOUR EMAIL]

Sort by date, select in batches, forward. I'll handle the rest.

**Time Required:** 20-30 minutes

---

**Privacy Note:**
- I'll only analyze business-relevant emails
- After analysis, I'll delete the export file
- You can redact sensitive personal emails before sharing
- No one else will see your emails

Let me know which option works best for you!

Marco

---

### Step 2: Receive and Prepare Email Data

**When Joe sends the file:**

1. Download to secure location
2. Extract .zip if needed
3. Identify file format (.mbox, .pst, or forwarded emails)
4. Prepare for upload to Claude

**File Size Considerations:**

- Claude can handle large files, but for efficiency:
- If file >100MB: Split into batches (6-month chunks)
- If file >500MB: Process in 3-month chunks
- Prioritize: Recent emails first (last 3 months most relevant)

---

## 🔍 PHASE 2: AI OPPORTUNITY ANALYSIS

### Step 1: Initial Email Analysis

Upload Joe's email file to Claude and use this prompt:

---

📋 **PROMPT 1: EMAIL OPPORTUNITY EXTRACTION**

Copy-paste this to Claude (after uploading email file):

---

Hey Claude, I need you to analyze this email archive to identify business development opportunities for ScopeLock.

**CONTEXT:**

This email archive belongs to Ikechukwu Okuzu:
- Chair of International Water Association Young Water Professionals - Nigeria
- Climate Change Officer at Federal Ministry of Environment, Nigeria
- Africa Regional Coordinator for Swiss Agency for Development and Cooperation
- Based in Maiduguri, Borno State, Nigeria
- Network: 36 state water ministries, federal government, international development organizations

**ABOUT SCOPELOCK:**

ScopeLock is an AI-assisted software development agency that delivers:
- Government-grade software systems (water management, climate monitoring, disaster coordination)
- Fixed-price, results-based model (clients only pay when acceptance tests pass)
- Fast delivery (4-8 weeks typical)
- Specialized in: water infrastructure software, environmental monitoring, disaster management, university systems

**YOUR TASK:**

Analyze EVERY email in this archive and identify opportunities where someone:

1. **Mentioned needing technology/software solutions**
   - "We need a system for..."
   - "Looking for a developer/vendor for..."
   - "Do you know anyone who can build..."
   - "Our current system isn't working..."

2. **Discussed budget/funding for technology**
   - Mentioned dollar/naira amounts
   - "Budget approved for..."
   - "We have funding for..."
   - Grant applications, RFPs, tenders

3. **Expressed pain points that software could solve**
   - Manual processes causing problems
   - Data collection difficulties
   - Coordination challenges
   - Lack of visibility/dashboards

4. **Requested meetings about technology projects**
   - "Can we discuss our project?"
   - "We'd like a proposal for..."
   - "When can we meet to talk about..."

5. **Mentioned procurement/vendor selection**
   - RFPs (Request for Proposals)
   - Tenders
   - Vendor evaluation
   - Technical requirements documents

**FOR EACH OPPORTUNITY FOUND, EXTRACT:**

```
OPPORTUNITY #[number]

ORGANIZATION: [Full organization name]
CONTACT PERSON: [Name and title]
CONTACT EMAIL: [Email address]

EMAIL DATE: [When email was sent]
LAST INTERACTION: [Days/weeks/months ago]
RESPONSE STATUS: [Did Ikechukwu reply? Still open? Conversation ongoing?]

OPPORTUNITY TYPE: [What they need - be specific]
THEIR PAIN POINT: [The problem they mentioned]
SPECIFIC NEED STATEMENT: [Direct quote from email if possible]

BUDGET SIGNALS:
- [Any dollar/naira amounts mentioned]
- [Any indication of funding availability]
- [Any timeline pressure suggesting budget allocated]

TIMELINE MENTIONED:
- [Any deadlines mentioned]
- [Any urgency indicators]
- [Expected start/completion dates]

DECISION MAKERS INVOLVED:
- [Who is involved in decision - commissioners, directors, etc.]
- [Who initiated the inquiry]

SCOPELOCK FIT SCORE: [0-100%]
- [How well does this match ScopeLock's capabilities?]
- [Are there any technical challenges?]

ESTIMATED CONTRACT VALUE: $[amount range]
- [Based on scope + Nigerian government/NGO budget levels]

URGENCY LEVEL: [HOT 🔥 / WARM 🌡️ / COLD ❄️]
- HOT: Active need, deadline <60 days, budget available
- WARM: Expressed need, no immediate deadline, exploring options
- COLD: General inquiry, no specific need yet, networking

COMPETITION SIGNALS:
- [Any mention of other vendors?]
- [Any mention of existing solutions?]

NEXT BEST ACTION:
- [What should we do next with this opportunity?]
```

**OUTPUT FORMAT:**

First, provide summary statistics:
```
ANALYSIS SUMMARY:
Total emails analyzed: [number]
Opportunities identified: [number]
- HOT: [number]
- WARM: [number]
- COLD: [number]

By Category:
- Water Infrastructure: [number]
- Environmental/Climate: [number]
- Disaster Management: [number]
- University/Education: [number]
- Other: [number]

Total Estimated Pipeline Value: $[amount]
```

Then list all opportunities, starting with HOT, then WARM, then COLD.

**IMPORTANT INSTRUCTIONS:**

1. **Be thorough** - Don't skip emails that seem vague. Even indirect mentions of technology needs count.

2. **Look for missed opportunities** - Pay special attention to emails Ikechukwu didn't respond to. These are often gold mines.

3. **Extract exact quotes** - When someone expresses a need, copy their exact words. This helps us craft personalized responses.

4. **Note relationships** - If the email shows a warm relationship (friendly tone, previous collaboration), highlight this.

5. **Identify decision-maker level** - Commissioner > Director > Manager. Higher = higher priority.

6. **Don't filter out "maybe" opportunities** - Include anything that could possibly be relevant. We'll filter later.

7. **Note language used** - If they mention specific technologies, frameworks, or systems, capture that.

Start analysis now. Begin with HOT opportunities.

---

### Step 2: Wait for Claude's Analysis

**Expected Output:**

Claude will return a structured list of 30-100 opportunities, categorized and scored.

**Review the output:**
- Does it make sense?
- Are there obvious misses?
- Are there false positives?

**If needed, refine with follow-up prompt:**

---

📋 **PROMPT 2: REFINEMENT (If needed)**

---

Thanks Claude! Now let's refine this list:

1. **Re-analyze emails from [specific dates]** - I think you might have missed some opportunities in this period

2. **Focus specifically on** [water ministry / disaster management / etc.] opportunities

3. **For the top 20 HOT opportunities**, provide MORE detail:
   - Exact quote of their need statement
   - All decision-makers mentioned in email thread
   - Any mentions of timeline or budget
   - Relationship indicators (how well does Joe know them?)

4. **Flag any opportunities where:**
   - Budget amount was explicitly mentioned
   - A deadline was explicitly mentioned
   - The inquiry was sent TO Joe (not just CC'd)
   - The email was unreplied by Joe

Provide the enhanced top 20 opportunities now.

---

---

## 🌐 PHASE 3: WEB RESEARCH & ENRICHMENT

For each HOT and WARM opportunity, enrich with public data.

### Step 1: Organization Research

📋 **PROMPT 3: ORGANIZATION RESEARCH**

Copy-paste for EACH hot opportunity:

---

Hey Claude, I need you to research this organization and enrich the opportunity profile.

**ORGANIZATION TO RESEARCH:**
[Organization name from email analysis]

**CONTACT PERSON:**
[Name and title from email]

**WHAT I NEED:**

1. **Find their official website**
   - Search: "[Organization name] Nigeria official website"
   - Provide URL

2. **Analyze key pages:**
   - About page (mission, vision, size)
   - Projects page (current initiatives)
   - News/Press releases (recent 6 months)
   - Team/Leadership page (decision-makers)
   - Contact page (official channels)

3. **Look for:**
   - Current technology projects mentioned
   - Pain points expressed publicly
   - Budget information (if public sector)
   - Strategic priorities/plans
   - Recent wins or challenges
   - Existing technology stack (if mentioned)

4. **Search for recent news:**
   - "[Organization name] Nigeria news 2024 2025"
   - "[Organization name] technology project"
   - "[Organization name] water system" (or relevant keywords)

5. **Find additional decision-makers:**
   - Who are the key people in tech/IT/operations?
   - Commissioner/Director/Manager hierarchy
   - LinkedIn profiles if available

**OUTPUT FORMAT:**

```
ENRICHED OPPORTUNITY PROFILE

ORGANIZATION: [Name]
OFFICIAL WEBSITE: [URL]
ORGANIZATION TYPE: [State Ministry / Federal Agency / NGO / University]
SIZE/SCOPE: [Geographic coverage, budget size, staff size if available]

STRATEGIC PRIORITIES (from website/news):
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

RECENT DEVELOPMENTS (Last 6 months):
- [News item 1]
- [News item 2]
- [News item 3]

CURRENT TECHNOLOGY SITUATION:
- Existing systems: [What they currently use, if mentioned]
- Technology challenges: [Pain points found in public statements]
- Digital transformation mentions: [Any modernization initiatives]

BUDGET INDICATORS:
- [Any budget information found]
- [Funding sources mentioned]
- [Past project costs if available]

DECISION MAKERS:
1. [Name, Title] - [LinkedIn URL if found]
2. [Name, Title] - [LinkedIn URL if found]
3. [Name, Title] - [LinkedIn URL if found]

COMPETITIVE LANDSCAPE:
- [Any vendors/partners mentioned on website]
- [Any existing technology providers]

SCOPELOCK RELEVANCE:
- Specific pain points we can solve: [List 2-3]
- Our differentiators for this client: [List 2-3]
- Potential objections we'll face: [List 1-2]

PERSONALIZATION HOOKS:
- [Things to reference in pitch - recent achievements, challenges, strategic goals]
- [Connection to Joe - how does his role/work relate to their mission?]

ESTIMATED CONTRACT VALUE (Refined): $[amount]
- [Justification based on organization size, budget indicators, scope]

NEXT STEP RECOMMENDATION:
- [What should we do next with this opportunity?]
```

Start research now.

---

**Repeat this for top 10-20 opportunities.**

**Time-saving tip:** You can batch these:
"Claude, research these 5 organizations and provide enriched profiles for each: [List 5]"

---

## 📝 PHASE 4: PERSONALIZED PITCH GENERATION

Now create customized outreach for each qualified opportunity.

### Step 1: Generate Pitch Email

📋 **PROMPT 4: PITCH EMAIL GENERATION**

For each enriched opportunity:

---

Hey Claude, create a personalized follow-up email from Ikechukwu to this contact.

**OPPORTUNITY CONTEXT:**

[Paste the enriched opportunity profile from Phase 3]

**ORIGINAL EMAIL CONTEXT:**

[Paste relevant excerpts from the original email thread]

**ABOUT SCOPELOCK (for context):**

ScopeLock is an AI-assisted software development agency specializing in government and enterprise software:

- **Fixed-price model:** Client only pays when acceptance tests pass (AC Green)
- **Fast delivery:** 4-8 weeks typical (10x faster than traditional vendors)
- **Government expertise:** Water infrastructure, climate monitoring, disaster management, university systems
- **Proven track record:** Public proof log at scopelock.mindprotocol.ai
- **Technology stack:** Next.js (frontend), FastAPI/Django (backend), PostgreSQL/Airtable (database)

**YOUR TASK:**

Write a personalized email from Ikechukwu to [Contact Name] that:

1. **References the specific conversation** from [date]
   - Quote or paraphrase their need statement
   - Show you remember the context
   - Acknowledge any timeline they mentioned

2. **Connects Joe's credibility to their need**
   - Mention his IWA Chair role (if water-related)
   - Mention Federal Ministry role (if climate/environment)
   - Mention Swiss Agency role (if international development)
   - Position him as expert who understands their sector

3. **Introduces ScopeLock as solution partner**
   - Don't just say "I know a vendor"
   - Say "I've partnered with a specialized development agency"
   - Emphasize government expertise and fixed-price model

4. **Proposes concrete solution**
   - Address their specific pain point
   - List 3-4 key deliverables
   - Mention timeline (e.g., "6-week delivery")
   - Include rough budget range if appropriate

5. **Includes social proof**
   - Reference similar systems built (if any)
   - Mention public proof log
   - Emphasize government-grade quality

6. **Clear call-to-action**
   - Request 30-minute call
   - Offer to send detailed proposal
   - Suggest specific dates/times if possible

**EMAIL TONE:**
- Professional but warm (they already know Joe)
- Solution-focused, not salesy
- Confident but not arrogant
- Respectful of their time and budget

**LENGTH:**
- 200-300 words max
- 3-4 short paragraphs
- Scannable (they're busy)

**SUBJECT LINE:**
- Should reference the original conversation topic
- Should be specific, not generic
- Should create curiosity/urgency

**OUTPUT FORMAT:**

```
SUBJECT: [Compelling subject line]

EMAIL BODY:

[Draft complete email]

---

FOLLOW-UP STRATEGY:
If no response in 7 days: [Suggest follow-up approach]
If no response in 14 days: [Suggest second follow-up]
If response is interested: [Next steps]
If response is "not now": [How to stay warm]
```

Write the email now.

---

**Repeat for top 10 opportunities initially.**

---

### Step 2: Review and Refine Pitches

**Review checklist for each email:**

- ✅ References specific original conversation
- ✅ Addresses their actual pain point
- ✅ Proposes concrete solution
- ✅ Includes rough timeline and budget
- ✅ Has clear call-to-action
- ✅ Sounds like Joe's voice (professional but personable)
- ✅ Under 300 words
- ✅ No generic template language

**If any email doesn't pass, refine with:**

"Claude, this email feels too generic. Make it more personalized by emphasizing [specific aspect from their organization]."

---

## 📊 PHASE 5: OPPORTUNITY SCORING & PRIORITIZATION

Create final ranked list of opportunities to pursue.

### Scoring Framework:

**Each opportunity gets scored 0-100:**

**Category 1: URGENCY (0-25 points)**
- Deadline <30 days: 25 points
- Deadline 30-60 days: 20 points
- Deadline 60-90 days: 15 points
- Deadline >90 days or vague: 10 points
- No deadline mentioned: 5 points

**Category 2: BUDGET SIZE (0-25 points)**
- $100K+: 25 points
- $50K-100K: 20 points
- $20K-50K: 15 points
- $5K-20K: 10 points
- No budget mentioned: 5 points

**Category 3: DECISION-MAKER LEVEL (0-20 points)**
- Commissioner/Minister: 20 points
- Director: 15 points
- Manager: 10 points
- Officer/Coordinator: 5 points

**Category 4: RESPONSE STATUS (0-15 points)**
- Joe never replied: 15 points (biggest opportunity)
- Joe replied but no follow-up: 10 points
- Active conversation: 5 points
- Already declined/closed: 0 points

**Category 5: SCOPELOCK FIT (0-15 points)**
- Perfect fit (water/climate/disaster): 15 points
- Good fit (can definitely deliver): 10 points
- Moderate fit (need to stretch): 5 points
- Poor fit (outside expertise): 0 points

**TOTAL SCORE: 0-100**

---

📋 **PROMPT 5: FINAL SCORING & RANKING**

---

Hey Claude, take all the opportunities we've identified and score them using this framework:

[Paste scoring framework above]

For each opportunity, calculate:
1. Urgency score
2. Budget size score
3. Decision-maker level score
4. Response status score
5. ScopeLock fit score
6. TOTAL SCORE

Then provide output in this format:

```
FINAL RANKED OPPORTUNITY LIST

TOP 10 OPPORTUNITIES (Score 70-100):

1. [Organization] - [Contact] - Score: 95/100
   - Why it's top: [Brief reasoning]
   - Estimated value: $[amount]
   - Next action: [What to do]

2. [Organization] - [Contact] - Score: 92/100
   - Why it's top: [Brief reasoning]
   - Estimated value: $[amount]
   - Next action: [What to do]

[Continue for top 10]

NEXT TIER (Score 50-69):
[List next 10-15]

LONG-TERM PIPELINE (Score <50):
[List remaining opportunities]

RECOMMENDED OUTREACH SEQUENCE:

Week 1: Send to opportunities #1-5
Week 2: Send to opportunities #6-10
Week 3: Follow up with #1-5, send to #11-15
Week 4: Follow up with #6-10, send to #16-20
```

Provide the final ranked list now.

---

---

## 📧 PHASE 6: OUTREACH EXECUTION

### Step 1: Prepare Outreach Package for Joe

Create a simple doc for Joe to review:

---

📋 **OUTREACH PACKAGE FOR JOE**

---

Hey Joe,

Here are the top 10 opportunities I found in your inbox. I've drafted personalized emails for each.

**Your job:** Review, edit if needed, and send (or approve me to send on your behalf).

---

**OPPORTUNITY #1: [Organization Name]**

**Why this is top priority:**
- [Brief reasoning]
- Estimated value: $[amount]
- Timeline: [Urgent/Medium/Long-term]

**Original Context:**
- Email date: [Date]
- They asked about: [Brief summary]
- You replied: [Yes/No/Partially]

**Personalized Email Draft:**

```
SUBJECT: [Subject line]

[Full email draft]
```

**Your Review:**
- ✅ Approve as-is (just send)
- ✏️ Edit needed (tell me what to change)
- ❌ Skip for now (not ready yet)

---

[Repeat for all 10 opportunities]

---

**Sending Options:**

**Option A:** You send from your email
- Just copy-paste and send
- I'll track responses

**Option B:** I send on your behalf (if you give me access)
- Faster execution
- You still approve each one first
- I can set up automated follow-ups

**Option C:** Mix
- You send to top 3 (personal touch)
- I send to others (save time)

Let me know which option works for you!

Marco

---

### Step 2: Track Responses

Create a simple tracking spreadsheet:

```
OPPORTUNITY TRACKING SHEET

| # | Organization | Contact | Value | Sent Date | Response? | Status | Next Action | Deadline |
|---|--------------|---------|-------|-----------|-----------|--------|-------------|----------|
| 1 | Kaduna Water | Commissioner | $75K | 2025-01-15 | Yes | Meeting booked | Prepare demo | 2025-01-22 |
| 2 | Fed Ministry | Director | $120K | 2025-01-15 | Waiting | - | Follow-up Jan 22 | - |
| 3 | Rivers State | Manager | $50K | 2025-01-16 | No | Sent | Follow-up Jan 23 | - |
```

---

### Step 3: Follow-Up System

**Follow-up Timing:**

- **Day 7:** First follow-up (if no response)
- **Day 14:** Second follow-up (if still no response)
- **Day 21:** Final follow-up (then mark as cold)

**Follow-up Templates:**

📋 **7-DAY FOLLOW-UP:**

```
SUBJECT: Re: [Original subject]

Hi [Name],

Following up on my email from last week about [their need].

I know you're busy, so I'll keep this brief:

We can deliver [solution] in [timeline] for approximately [budget]. This would solve your [specific pain point].

Are you available for a 15-minute call this week to discuss?

Best,
Ikechukwu
```

---

📋 **14-DAY FOLLOW-UP:**

```
SUBJECT: Quick check-in: [Original subject]

Hi [Name],

I wanted to reach out one more time about [their need].

If timing isn't right now, I completely understand. Would [next quarter] be better?

Alternatively, if you could point me to the right person on your team, I'd appreciate it.

Thanks,
Ikechukwu
```

---

📋 **21-DAY FINAL FOLLOW-UP:**

```
SUBJECT: Last note: [Original subject]

Hi [Name],

Last follow-up from me - don't want to be a pest!

If [their need] is still a priority, I'm here to help. If not, I'll follow up again in [3-6 months].

Either way, wishing you all the best with [their organization's mission].

Ikechukwu
```

---

---

## 📈 PHASE 7: RESULTS TRACKING & OPTIMIZATION

### Key Metrics to Track:

**Pipeline Metrics:**
- Total opportunities identified: [Number]
- HOT opportunities: [Number]
- Emails sent: [Number]
- Response rate: [%]
- Meeting booked rate: [%]
- Proposal sent: [Number]
- Conversion rate: [%]

**Financial Metrics:**
- Total pipeline value: $[Amount]
- Average deal size: $[Amount]
- Contracts signed: [Number]
- Total revenue: $[Amount]
- Joe's commission earned: $[Amount]

**Efficiency Metrics:**
- Time from email sent to response: [Days]
- Time from response to meeting: [Days]
- Time from meeting to proposal: [Days]
- Time from proposal to contract: [Days]
- Total sales cycle: [Days]

---

### Weekly Review Process:

**Every Monday:**

1. **Review pipeline status**
   - What moved forward?
   - What stalled?
   - Any new responses?

2. **Send new outreach batch**
   - Next 5 opportunities
   - Follow-ups from previous weeks

3. **Update Joe**
   - Quick summary email
   - Wins to celebrate
   - Actions needed from him

4. **Optimize**
   - What email approaches got best response?
   - What organizations are most responsive?
   - Any patterns in what works/doesn't work?

---

### Optimization Prompts:

📋 **PROMPT 6: RESPONSE ANALYSIS**

After getting 5-10 responses:

---

Hey Claude, analyze these email responses and help me optimize our approach:

**EMAILS THAT GOT POSITIVE RESPONSES:**

[Paste 3-5 emails that got interested responses]

**EMAILS THAT GOT NO RESPONSE:**

[Paste 3-5 emails that got no response]

**EMAILS THAT GOT DECLINED:**

[Paste 2-3 emails that got "not interested"]

**ANALYSIS NEEDED:**

1. What patterns do you see in emails that got positive responses?
   - Subject line approach?
   - Opening paragraph?
   - Call-to-action?
   - Length?

2. What might be wrong with emails that got no response?
   - Too long?
   - Not specific enough?
   - Wrong timing?
   - Poor subject line?

3. For declined emails, what were the objections?
   - Budget?
   - Timing?
   - Already have solution?
   - Other?

4. How should we adjust our email template for next batch?

Provide recommendations now.

---

---

## 🔄 PHASE 8: ONGOING EMAIL MONITORING

After initial analysis, set up quarterly refresh:

### Every 3 Months:

1. **Joe exports last 3 months of emails**
2. **Run analysis again** (same process)
3. **Find new opportunities**
4. **Update existing opportunity status**
5. **Adjust strategy based on learnings**

**Why quarterly?**
- Fresh opportunities emerge
- Follow up on old conversations that went quiet
- Track relationship development over time
- Avoid missing new inbound inquiries

---

## 🛠️ TOOLS & RESOURCES

### Required Tools:

**For Email Export:**
- Google Takeout (Gmail)
- Outlook Export (Microsoft)

**For Analysis:**
- Claude (via claude.ai)
- This prompt document

**For Tracking:**
- Google Sheets (simple tracking)
- OR Airtable (more robust)
- OR Notion (if preferred)

**For Follow-ups:**
- Gmail/Outlook (manual sending)
- OR Mailchimp (if scaling)
- OR HubSpot free (if want automation)

---

### Optional Enhancements:

**If this works well, later build:**

1. **Automated Email Monitor**
   - Connect to Joe's email via API
   - Auto-analyze new emails weekly
   - Alert when hot opportunity arrives

2. **Opportunity Dashboard**
   - Visual pipeline view
   - Conversion rate tracking
   - Revenue forecasting

3. **AI Follow-up System**
   - Auto-generate follow-up emails
   - Auto-track response status
   - Alert when action needed

**But for now: Manual process is FINE and proves the concept.**

---

## 📋 COMPLETE EXECUTION CHECKLIST

### Pre-Launch (Before Joe sends emails):

- [ ] Send email export request to Joe
- [ ] Receive and download email export
- [ ] Verify file format and accessibility
- [ ] Prepare Claude for analysis
- [ ] Review all prompts in this document

### Week 1: Analysis

- [ ] Upload emails to Claude
- [ ] Run Prompt 1: Opportunity Extraction
- [ ] Review results, refine if needed
- [ ] Run Prompt 2: Refinement (if needed)
- [ ] Generate summary statistics

### Week 2: Enrichment

- [ ] Select top 20 opportunities
- [ ] Run Prompt 3: Organization Research (for each)
- [ ] Compile enriched profiles
- [ ] Update opportunity scores

### Week 3: Pitch Creation

- [ ] Run Prompt 4: Pitch Email Generation (for top 10)
- [ ] Review and refine drafts
- [ ] Get Joe's feedback on email tone
- [ ] Finalize first batch of 5 emails

### Week 4: Outreach Launch

- [ ] Run Prompt 5: Final Scoring & Ranking
- [ ] Send outreach package to Joe for review
- [ ] Get Joe's approval on first 5 emails
- [ ] Send first batch
- [ ] Set up tracking sheet
- [ ] Schedule follow-ups

### Week 5-8: Follow-ups & Expansion

- [ ] Send 7-day follow-ups
- [ ] Send second batch (opportunities 6-10)
- [ ] Send 14-day follow-ups
- [ ] Book meetings from responses
- [ ] Send third batch (opportunities 11-15)
- [ ] Run Prompt 6: Response Analysis

### Week 9-12: Optimization & Scaling

- [ ] Analyze conversion rates
- [ ] Refine email templates based on results
- [ ] Send fourth batch (opportunities 16-20)
- [ ] Close first contract (hopefully!)
- [ ] Document learnings
- [ ] Plan next quarter's email export

---

## 🎯 SUCCESS CRITERIA

### Phase 1 Success (First 30 days):
- ✅ 50+ opportunities identified
- ✅ 20+ qualified as HOT/WARM
- ✅ 10 personalized pitches sent
- ✅ 3+ positive responses
- ✅ 1+ meeting booked

### Phase 2 Success (60 days):
- ✅ 20+ emails sent
- ✅ 8+ responses (40% response rate)
- ✅ 3+ meetings held
- ✅ 2+ proposals submitted
- ✅ 1 contract in final negotiation

### Phase 3 Success (90 days):
- ✅ 30+ emails sent
- ✅ 1+ contract signed
- ✅ $50K-100K in signed contracts
- ✅ Process documented and repeatable
- ✅ Joe sees commission ($7.5K-15K)

---

## 🚨 TROUBLESHOOTING

### Problem: Too many irrelevant opportunities

**Solution:** Refine Prompt 1 with more specific criteria:
- Add: "ONLY include opportunities where explicit technology/software need was mentioned"
- Add: "SKIP networking emails, event invitations, general updates"

---

### Problem: Not enough opportunities found

**Solution:** 
1. Broaden search in Prompt 1: "Also look for indirect mentions of technology challenges"
2. Ask Joe to export older emails (18-24 months)
3. Ask Joe to forward specific folders (e.g., "Projects" folder)

---

### Problem: Email drafts sound too generic

**Solution:**
- Provide more context to Prompt 4
- Give Claude examples of Joe's writing style
- Ask Claude: "Make this sound more like Joe's voice - professional but warm"

---

### Problem: Low response rate (<20%)

**Solution:**
1. Run Prompt 6 to analyze what's not working
2. Try different subject lines (reference specific conversation topics)
3. Shorten emails (aim for <200 words)
4. Have Joe personally call top 3 before emailing (warm them up)

---

### Problem: Responses are interested but no budget

**Solution:**
- Focus on smaller pilot projects ($5K-10K)
- Position as "pilot before full rollout"
- Suggest grant funding sources (Joe can help with Swiss Agency)

---

## 💡 PRO TIPS

1. **Start small:** Don't send 50 emails at once. Send 5, learn, adjust, then scale.

2. **Personalize subject lines:** Generic subjects get ignored. Reference specific conversations.

3. **Track relationship temperature:** Not all opportunities are equal. Warm relationships convert better.

4. **Use Joe's credibility:** Every email should mention his IWA/Federal Ministry/Swiss Agency roles.

5. **Focus on unreplied emails:** Joe's biggest opportunities are probably emails he didn't respond to.

6. **Time your sends:** Send Tuesday-Thursday, 9-11am WAT (Nigerian business hours).

7. **Keep Joe involved:** Don't let this become "Marco's process." Joe needs to own it.

8. **Celebrate quick wins:** First response, first meeting, first contract - celebrate each milestone.

9. **Document learnings:** What works in Nigeria might work across Africa. Build playbook.

10. **Be patient:** Government sales take 60-120 days typically. Don't give up early.

---

## 📞 WHEN TO ESCALATE TO KAI

Contact me (Kai) if:

- You're not sure how to interpret Claude's analysis
- You need help refining prompts
- Response rate is <15% after 20 emails
- Joe is getting overwhelmed or confused
- You want to automate parts of this process
- You're ready to build the full OpportunityMiner AI system

---

## 🔥 FINAL CHECKLIST BEFORE STARTING

Before you send the export request to Joe:

- [ ] I've read this entire document
- [ ] I understand the 8 phases
- [ ] I have all prompts ready to copy-paste
- [ ] I have a tracking system ready (spreadsheet)
- [ ] I've blocked time this week to do the analysis
- [ ] I'm ready to support Joe through the process
- [ ] I understand this takes 2-4 weeks to see results

**If all checked: Send that email export request to Joe NOW.** 🚀

---

**END OF DOCUMENT**

---

*System created by: Kai "The Orchestrator"*  
*For: Marco @ ScopeLock*  
*Version: 1.0*  
*Date: November 21, 2025*  
*Next Update: After first 90 days of results*