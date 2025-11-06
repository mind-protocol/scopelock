# Emma Manual Workflow — Upwork Lead Processing

**Goal:** Process 20 Upwork posts → Generate proposals → Submit manually

---

## Setup (One-time)

1. **Open Emma in a separate Claude session:**
   - Copy the entire contents of `citizens/emma/CLAUDE.md`
   - Paste as the system prompt in a new Claude Code session
   - Title the session: "Emma - Upwork Scout"

2. **Prepare tracking file:**
   - Use `citizens/emma/leads-tracker.md` (created below)
   - Keep it open during your session

---

## Workflow (Repeat 20 times)

### Step 1: Find Upwork Post
- Go to Upwork.com
- Search: "web app", "AI", "React", "TypeScript", "API", etc.
- Filter: Fixed-price, $3K+, Posted recently
- Open a promising post

### Step 2: Paste to Emma
In your Emma session, paste:
```
[Full job post text]
---
Budget: $X,XXX
Posted: [date]
Proposals: X
Client: [Verified/Unverified]
Location: [country]
```

### Step 3: Emma Evaluates
Emma will respond with:
```
DECISION: GO or NO-GO
REASON: [one line]

[If GO: Complete proposal in plain text]
```

### Step 4a: If GO → Submit Proposal
1. Copy Emma's proposal text (plain text, no formatting)
2. Go back to Upwork post
3. Click "Submit a Proposal"
4. Paste Emma's text
5. Set bid amount (Emma will have suggested pricing)
6. Submit
7. Update `leads-tracker.md` with "Sent: Yes"

### Step 4b: If NO-GO → Skip
1. Note reason in tracker
2. Move to next post

---

## Tips

**Finding good posts:**
- Keywords: "web app", "SaaS", "dashboard", "API", "authentication", "AI", "LLM"
- Avoid: "WordPress", "Shopify", "logo", "content writing", "long-term partner" (without immediate milestone)
- Sweet spot: $5K-$15K, verified client, clear deadline

**Time management:**
- Batch: Review 10 posts, paste all to Emma, then submit all GO proposals
- Target: 20 posts in 60-90 minutes
- Quality over quantity: 5 strong GO proposals > 20 weak ones

**Platform notes:**
- Upwork has "Connects" cost per proposal (typically 6-16 connects)
- You can withdraw proposals if you change your mind
- First response time matters (aim for <2 hours after post)

---

## Tracking

After each post, update `citizens/emma/leads-tracker.md`:

```markdown
| Date | Platform | Title | Budget | GO/NO-GO | Sent? | Link |
|------|----------|-------|--------|----------|-------|------|
| 2025-11-02 | Upwork | Build AI chat widget | $8K | GO | Yes | [url] |
| 2025-11-02 | Upwork | WordPress migration | $2K | NO-GO | - | [url] |
```

---

## Success Metrics

**Target for today:**
- 20 posts evaluated
- 5-10 GO decisions
- 5-10 proposals sent
- Response rate: 20-30% (expect 1-3 replies within 24h)

**Quality indicators:**
- Emma's proposals reference specific client pain
- Pricing is clear and fixed
- Evidence Sprint offered for uncertain scope
- No "excited/passionate/perfect fit" language

---

## Escalation

**If you get a response:**
1. Copy the client's message
2. Post in SYNC.md under "Client Responses"
3. Ping Nicolas immediately
4. Rafael (Harbor) will take over client conversation

**If technical questions arise:**
1. Don't guess or make promises
2. Post question in SYNC.md
3. Tag Daniel (technical) or Aïcha (architecture)

---

## After 20 Posts

**Review session:**
1. Count: GO vs NO-GO ratio (target: 30-50% GO)
2. Sent: How many proposals submitted?
3. Quality check: Do proposals feel specific and credible?
4. Time: How long did 20 posts take? (target: 60-90min)

**Next steps:**
- Wait 24-48h for responses
- Follow up on Business Buyer posts after Day 3 (see Follow-Up Strategy below)
- Repeat workflow when ready for next batch

---

## Follow-Up Strategy (Business Buyers - 3-5 Day Timeline)

**Context:** Business Buyers (marketing managers, founders, small business owners) decide in 3-5 days, NOT 10-14 days like Technical Buyers. If you don't follow up by Day 3, they've likely hired someone else.

---

### When to Follow Up

**Day 3 (72 hours after proposal sent):**
- If no response from Business Buyer post
- Only follow up on jobs with $400+ budget (don't waste time on low-value)
- Skip Technical Buyer posts (they take 10-14 days)

**How to identify Business Buyer posts in tracker:**
- Budget: $400-1500 (not $200-600)
- Job title: Marketing Manager, Founder, CEO, Business Owner
- Language: Outcome-focused ("I need X delivered"), no technical jargon

---

### Follow-Up Message Templates (Business Buyers)

**Template 1: Value Reminder (Day 3)**

*Use when client is time-scarce and may have just forgotten to respond.*

```
Hi [Name],

Following up on my proposal for [brief project description]. I have capacity this week and can deliver by [specific date if you mentioned one].

Quick reminder of what you'll get:
- [Key deliverable 1]
- [Key deliverable 2]
- Fixed price: $[amount] (includes [risk reversal from original proposal])

Ready to start whenever you are.

Nicolas
```

**Why this works:**
- Brief (Business Buyers skim fast)
- Outcome-focused (what they'll GET)
- Specific timeline (removes uncertainty)
- No pressure (respectful of their time)

---

**Template 2: Deadline Urgency (Day 3, if they mentioned deadline)**

*Use when original post mentioned deadline like "need by Friday" or "launching next week".*

```
Hi [Name],

Saw your deadline is [date mentioned in post]. I have availability this week and can prioritize your project to meet that timeline.

[Key deliverable] delivered by [date] - fixed price $[amount].

Want me to block off time for you? Just confirm and I'll get started.

Nicolas
```

**Why this works:**
- Acknowledges their deadline urgency
- Positions you as solution to their time problem
- Simple yes/no decision (removes decision fatigue)

---

**Template 3: Discount Anchor (Day 3, if competitive budget)**

*Use when original budget was competitive or you quoted high-middle of your range.*

```
Hi [Name],

I can reduce the price to $[reduced by $50-100] if you commit by Friday.

Same deliverables:
- [Key deliverable 1]
- [Key deliverable 2]
- Fixed price, [risk reversal]

Let me know if that works.

Nicolas
```

**Why this works:**
- Price anchoring: Started higher, now "discount" feels like win
- Time-bound offer (creates urgency)
- Business Buyers expect to negotiate

---

**Template 4: Social Proof (Day 3, if you have relevant portfolio)**

*Use when you have highly relevant completed project to show.*

```
Hi [Name],

Quick follow-up - I just finished a similar project for another client:
[Live URL of relevant completed project]

Same type of work you need ([brief description]). Delivered in [X days], they were happy with results.

Still available this week if you want to move forward.

Nicolas
```

**Why this works:**
- Social proof reduces risk fear
- Live example is concrete (not just claims)
- Shows recent delivery (you're actively working, not desperate)

---

### When to Stop Following Up

**Day 5 (120 hours after proposal):**
- If no response after Day 3 follow-up → Move on
- Business Buyers decide in 3-5 days, if they haven't responded by Day 5, they've hired someone else
- Don't waste time on more follow-ups

**Exception:**
- High-value jobs ($1200+): One final follow-up on Day 7 with social proof template
- After Day 7: Archive and move on

---

### Tracking Follow-Ups

**Add these columns to `leads-tracker.md`:**

```markdown
| Date | Platform | Title | Budget | Sent? | Follow-Up Day 3? | Response? | Status |
|------|----------|-------|--------|-------|------------------|-----------|--------|
| 2025-11-02 | Upwork | Podcast voiceovers | $600 | Yes | 2025-11-05 | No | Archived |
| 2025-11-03 | Upwork | Dashboard for CRM | $900 | Yes | 2025-11-06 | Yes! | Client replied |
```

**Status values:**
- "Waiting" = Proposal sent, waiting for response
- "Follow-up sent" = Day 3 follow-up sent
- "Client replied" = Got response (escalate to Nicolas)
- "Archived" = No response by Day 5, move on

---

### Success Metrics (Follow-Up)

**Target follow-up conversion:**
- 10 proposals sent → 3 Day 3 follow-ups → 1 client response (10% total conversion)
- Without follow-ups: ~5% conversion
- With follow-ups: ~10-15% conversion (2-3x improvement)

**Quality indicators:**
- Follow-up messages are <100 words (Business Buyers skim)
- Always outcome-focused (what they'll get, when they'll get it)
- No apologies ("sorry to bother you") - you're offering value
- Clear CTA (simple yes/no decision)

---

## Troubleshooting

**Emma gives NO-GO too often:**
- You're selecting posts that don't match ScopeLock's fit
- Look for: clear outcomes, verified clients, fixed budgets $3K+

**Proposals feel generic:**
- Give Emma more context from the post (client's exact words)
- Include deadline pressure if present
- Mention their specific tech stack

**Budget confusion:**
- If hourly: calculate total (hourly rate × estimated hours)
- If range: use midpoint for Emma's evaluation
- If missing: Emma will propose Evidence Sprint at $3K-$6K

---

**Ready to start?** Open Emma in a new Claude session and paste your first Upwork post!
