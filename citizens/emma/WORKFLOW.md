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
- Follow up on high-value posts (>$10K) after 48h
- Repeat workflow when ready for next batch

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
