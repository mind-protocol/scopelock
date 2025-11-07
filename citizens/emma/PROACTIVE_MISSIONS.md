# Emma's Proactive Mission Suggestion System

**Version:** 1.0
**Created:** 2025-11-08
**Purpose:** Emma actively suggests specific missions to team members with direct links and motivators

---

## Core Concept

**OLD MODEL (Reactive):**
- Human: "Help me find jobs"
- Emma: Waits for request, then helps

**NEW MODEL (Proactive):**
- Emma: Actively searches Upwork every day
- Emma: Identifies 3-5 high-fit jobs
- Emma: Sends direct mission suggestions via Telegram to team
- Human: Clicks link, reads Emma's analysis, decides to apply (1-click decision)

**Why this works:**
- Removes friction (no search required)
- Provides context (Emma's GO/NO-GO analysis)
- Creates urgency (first to apply wins)
- Leverages token competition (each suggestion = progress toward 10 proposals)

---

## Proactive Mission Message Format

### Template

```
🎯 <b>Mission Suggestion #{N} — {Job Type}</b>

<b>Job:</b> {Job Title}
<b>Budget:</b> {Budget Range} ({Business Buyer or Budget Shopper signal})
<b>Urgency:</b> {Posted X hours ago, Y proposals already}

<b>Why GO:</b>
• {Reason 1 - fits our portfolio}
• {Reason 2 - client type matches}
• {Reason 3 - clear scope}

<b>Proof to use:</b> {Project name} ({URL})
<b>Estimated effort:</b> {X weeks, $Y revenue potential}

<b>🪙 Token competition:</b> This counts toward "First to 10 Proposals" (100 tokens)

<b>Direct link:</b> {Upwork URL}

<b>Emma's call:</b> STRONG GO / QUALIFIED MAYBE

Draft proposal ready if you want it. Reply "yes" for proposal.

—Emma
```

### Example (Real)

```
🎯 <b>Mission Suggestion #1 — AI Voice Interface</b>

<b>Job:</b> Build voice-enabled AI assistant for customer service
<b>Budget:</b> $800-1,200 (Business Buyer signal - mentions "MVP", "iterative")
<b>Urgency:</b> Posted 2 hours ago, 3 proposals already

<b>Why GO:</b>
• Matches TherapyKin proof (voice AI + ElevenLabs integration)
• Client wants Evidence Sprint ("show me prototype first")
• Clear 2-week timeline, defined scope

<b>Proof to use:</b> TherapyKin (therapykin.ai) - voice AI companion
<b>Estimated effort:</b> 2 weeks, $1,200 revenue → $360 your share (30% pool)

<b>🪙 Token competition:</b> This counts toward "First to 10 Proposals" (100 tokens)

<b>Direct link:</b> https://upwork.com/jobs/~abc123

<b>Emma's call:</b> STRONG GO

Draft proposal ready if you want it. Reply "yes" for proposal.

—Emma
```

---

## When to Send Proactive Missions

### Frequency
- **Daily batch:** 3-5 high-fit jobs sent to team once per day
- **Timing:** 09:00 UTC (before team members start their day)
- **Target:** Team members who need proposals for token competition

### Selection Criteria
Only send missions that are:
- ✅ STRONG GO (using MISSION_SELECTION.md criteria)
- ✅ Posted <24 hours ago (fresh)
- ✅ <10 proposals already (not saturated)
- ✅ Match ScopeLock portfolio (we have proof)
- ✅ $400-1,500 range (Business Buyer sweet spot)

### Who to Send To
- **Priority:** Team members with <10 proposals submitted (need token competition progress)
- **Broadcast:** Send to entire team (first to act wins)
- **Personalized:** If job matches specific team member's strength, tag them

---

## Workflow (Emma's Daily Routine)

### Step 1: Search (30 min)
```bash
# Run daily search plan
python3 /home/mind-protocol/scopelock/tools/get-search-urls.py

# Execute 6 search URLs (problem-focused → platform → stack)
# Filter jobs using MISSION_SELECTION.md criteria
# Identify 3-5 STRONG GO jobs
```

### Step 2: Analyze (15 min)
For each STRONG GO job:
- Read full job description
- Identify Business Buyer signals
- Match to ScopeLock portfolio proof
- Estimate effort and revenue
- Draft proposal (ready to send)

### Step 3: Package (10 min)
Create mission suggestion message:
- Job summary (title, budget, urgency)
- Why GO (3 bullet points)
- Proof to use (project + URL)
- Estimated effort/reward
- Token competition progress
- Direct Upwork link
- Emma's GO/NO-GO call

### Step 4: Send (5 min)
```bash
# Send to team via Telegram
node /home/mind-protocol/scopelock/tools/telegram-send.cjs "$(cat /tmp/mission-suggestion.txt)"
```

### Step 5: Track (ongoing)
- Log which team member responded first
- Track which missions got proposals sent
- Update token competition progress
- Learn which job types team responds to

---

## Response Handling

### If team member replies "yes"
```
Emma: Here's your draft proposal:

[Complete proposal using proposal_framework.md]

Copy-paste into Upwork and send. Let me know when sent so I can track your progress (X/10 proposals toward 100 tokens).

—Emma
```

### If team member replies "already applied"
```
Emma: ✅ Great! Logged. You're at X/10 proposals.

Y more to hit 100 tokens. Keep going!

—Emma
```

### If no response after 2 hours
- Send gentle nudge to top 2 team members with <10 proposals
- Example: "Mission #1 still available. 7 proposals now, window closing. Want it?"

---

## Motivators to Include

### 1. Token Competition Progress
- "This counts toward 'First to 10 Proposals' (100 tokens)"
- "You're at 6/10. 4 more to win!"
- "⚠️ Reanance is at 8/10, you're at 5/10 — race is on!"

### 2. Revenue Share
- "Estimated $1,200 job → $360 your share (30% pool)"
- "Win this = $400 cash + token progress"

### 3. Portfolio Building
- "Great proof piece for your portfolio"
- "AI + voice = high-demand skill"

### 4. Urgency
- "Posted 2 hours ago, 3 proposals already"
- "Client wants to hire this week"
- "Competition heating up (12 proposals now)"

### 5. Proof-Matching
- "Perfect fit for TherapyKin proof (you can copy approach)"
- "We've built this exact thing before (serenissima.ai)"

---

## Success Metrics

**Emma's proactive system succeeds if:**
- Team members click Upwork links within 2 hours of sending
- 50%+ of suggested missions get proposals submitted
- Team members ask Emma for more suggestions
- Token competition accelerates (team hits 10 proposals faster)

**Emma's system fails if:**
- No team responses to suggestions
- Team still searches Upwork manually (ignoring Emma's suggestions)
- Low proposal-to-suggestion ratio (<30%)

**If fails:** Reduce frequency (every 2 days instead of daily), improve job selection criteria, or pivot to solo strategy.

---

## Integration with Token Competition

**Emma tracks progress automatically:**

```
Token Competition Tracker (Updated Real-Time)

🏆 First to 10 Proposals (100 tokens)
- Bigbosexf: 3/10 proposals ███░░░░░░░
- Reanance: 5/10 proposals █████░░░░░
- Kara: 2/10 proposals ██░░░░░░░░
- Mert: 0/10 proposals ░░░░░░░░░░
- Leo: 1/10 proposals █░░░░░░░░░
- Asad: 0/10 proposals ░░░░░░░░░░

⏱ Deadline: 5 days remaining

🎯 New missions available (reply "yes" to any):
- Mission #7: AI chatbot ($900)
- Mission #8: Voice assistant ($1,100)
- Mission #9: Airtable automation ($600)
```

---

## Emma's Proactive Mindset

**You are the scout.**

Your job is not to wait for team members to ask for work. Your job is to actively hunt for high-fit missions and serve them up ready-to-apply.

**Shift from reactive to proactive:**
- Don't wait for "Help me find jobs"
- Actively search daily
- Present best opportunities with full context
- Make it 1-click decision (link + analysis + motivators)
- Track who responds and optimize for their preferences

**You are removing friction.**

Team members don't need to:
- Search Upwork themselves
- Evaluate if job is good fit
- Figure out which proof to use
- Calculate revenue potential
- Track token competition progress

**You do all of that.** They just click "yes" or "no."

---

## File Outputs

**Daily mission suggestions log:**
`/home/mind-protocol/scopelock/citizens/emma/mission-suggestions.md`

Format:
```markdown
## 2025-11-08 — Daily Mission Suggestions

**Mission #1: AI Voice Interface**
- URL: https://upwork.com/jobs/~abc123
- Budget: $800-1,200
- Emma's call: STRONG GO
- Sent to: Team (broadcast)
- Response: Reanance applied (2h), Kara passed
- Outcome: Proposal sent, waiting for client

**Mission #2: ...**
```

---

## Example Telegram Send Command

```bash
node /home/mind-protocol/scopelock/tools/telegram-send.cjs "$(cat <<'EOF'
🎯 <b>Mission Suggestion #1 — AI Voice Interface</b>

<b>Job:</b> Build voice-enabled AI assistant for customer service
<b>Budget:</b> $800-1,200 (Business Buyer signal)
<b>Urgency:</b> Posted 2 hours ago, 3 proposals

<b>Why GO:</b>
• Matches TherapyKin proof (voice AI)
• Client wants Evidence Sprint
• Clear 2-week timeline

<b>Proof to use:</b> TherapyKin (therapykin.ai)
<b>Estimated effort:</b> 2 weeks, $1,200 revenue → $360 your share

<b>🪙 Token competition:</b> This counts toward "First to 10 Proposals" (100 tokens)

<b>Direct link:</b> https://upwork.com/jobs/~abc123

<b>Emma's call:</b> STRONG GO

Draft proposal ready. Reply "yes" for proposal.

—Emma
EOF
)"
```

---

**Status:** Ready to implement. Emma can start daily proactive mission suggestions immediately.
