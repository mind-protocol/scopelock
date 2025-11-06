# Telegram Analysis Scripts

Analyze Telegram export data to find potential team members and clients.

## Overview

These scripts analyze Telegram conversation exports to identify:
1. **Team Members** - People who could join ScopeLock as supervisors (AI does the coding)
2. **Clients** - Business owners who need software built (NOT developers offering services)

---

## Scripts

### 1. `find_team_members.py` ⭐ NEW

**Purpose:** Find people who could join ScopeLock team (supervise missions, not code)

**Target Profile:**
- From Nigeria, India, Philippines, Latin America, etc. (cost of living fit)
- Looking for remote/part-time work (5-30 hours/week)
- Students, recent graduates, junior developers
- Basic English, willing to learn, can follow guides
- **NOT** requiring: GitHub portfolios, years of experience, senior roles

**What They'll Do:**
- Supervise AI-generated code (Rafael writes 100% of code)
- Deploy to Vercel/Render (copy-paste commands from guides)
- Test using Sofia's QA checklists
- Earn $360-1800/month commission in $SOL

**Detection Signals:**
- Geographic fit (mentions target countries/cities)
- Seeking work ("looking for remote work", "need income")
- Hours availability ("can work 20 hours/week")
- Junior indicators ("student", "just graduated", "beginner")
- Willingness to learn ("willing to learn", "eager to work")
- Remote work interest ("upwork", "freelance", "work from home")

**Exclusions:**
- Senior developers (5+ years experience)
- High rates ($50+/hour - too expensive)
- CTOs, tech leads, architects

### 2. `find_potential_clients.py` ⭐ NEW

**Purpose:** Find business owners who need software built (NOT developers)

**Target Profile:**
- Business owners, founders, product managers
- Have project needs (websites, apps, APIs, chatbots)
- Complaining about unreliable developers (opportunity!)
- Mentions budget, timeline, urgency
- Creative work needs (presentations, voiceovers, translations)

**What They Need:**
- Fixed-price software delivery ($3k-15k missions)
- Fast delivery (Evidence Sprint 2-5 days, full build 1-3 weeks)
- Pay only when tests pass (AC green)
- Web development, AI chatbots, backend APIs
- Creative AI work (presentations, voice, content, images)

**Detection Signals:**
- Business owner ("I run a startup", "my company")
- Project needs ("I need a website", "looking for someone to build")
- Complains about devs ("developer disappeared", "too slow", "broken")
- Urgency ("need ASAP", "urgent", "deadline")
- Budget ("budget is $5k", "how much to build")
- Tech needs (mentions "login", "stripe", "API", "chatbot")
- Creative needs ("need presentation", "voiceover", "translation")

**Exclusions:**
- Developers offering services ("I can build for you")
- Service providers ("check out my portfolio", "my rate is...")

---

## Setup

### 1. Export Telegram Conversations

**Desktop App:**
1. Open Telegram Desktop
2. Settings → Advanced → Export Telegram data
3. Select: "Personal chats" + "Private groups"
4. Format: **JSON** (not HTML)
5. Export to: `C:\Users\[you]\Downloads\Telegram Desktop\DataExport_YYYY-MM-DD\`

**File you need:** `result.json` or `results.json`

### 2. Update Script Paths

Edit both scripts (lines ~22) and update:

```python
TELEGRAM_EXPORT = '/mnt/c/Users/reyno/Downloads/Telegram Desktop/DataExport_2025-11-05.zip/DataExport_2025-11-05/results.json'
```

**WSL2 Path Format:**
- Windows: `C:\Users\reyno\Downloads\...`
- WSL2: `/mnt/c/Users/reyno/Downloads/...`

### 3. Run Scripts

```bash
cd /home/mind-protocol/scopelock/outreach

# Find team members
python3 find_team_members.py

# Find potential clients
python3 find_potential_clients.py
```

---

## Output Files

### Team Members

**`team_members/team_members.json`**
- Full analysis with all signals
- Structured data for automation

**`team_members/team_members_summary.txt`**
- Human-readable summary
- Sorted by score (highest = best fit)
- Shows key signals + sample messages

### Potential Clients

**`potential_clients/potential_clients.json`**
- Full analysis with all signals
- Structured data for automation

**`potential_clients/potential_clients_summary.txt`**
- Human-readable summary
- Sorted by score (highest = best fit)
- Shows key signals + sample messages

---

## Next Steps

### For Team Members:

1. **Review** `team_members_summary.txt`
2. **Filter** for highest scores (15+ = very strong fit)
3. **Reach out** via Telegram with personalized message:

```
Hi [Name]!

Saw you're looking for remote work. We have paid positions at ScopeLock - AI-assisted software agency.

You supervise (AI does the coding). Deploy to Vercel/Render. Test against checklists. Earn $360-1800/month commission in $SOL.

Requirements:
- Understand English (read docs, write clear messages)
- Follow step-by-step guides
- 5-30 hours/week flexible
- Willingness to learn

Interested? Let's chat!

https://scopelock.mindprotocol.ai/join
```

### For Potential Clients:

1. **Review** `potential_clients_summary.txt`
2. **Prioritize** by:
   - 😤 Complains about devs (highest priority - they're in pain!)
   - 💰 Budget mentioned (serious, ready to pay)
   - ⏰ Urgent (need fast delivery)
3. **Reach out** via Telegram with personalized message:

**If they complained about developers:**
```
Hi [Name]!

Saw you had issues with [developer problem]. We solve that exact problem.

ScopeLock delivers fixed-price software. You pay ONLY when acceptance tests pass (AC green). No more "90% done" or disappearing devs.

Evidence Sprint: $3k-6k, 2-5 days - you see working demo before committing to full build.

Want to see how it works?
https://scopelock.mindprotocol.ai
```

**If they need something built:**
```
Hi [Name]!

Saw you need [project]. We specialize in fast, fixed-price delivery.

Web apps, AI chatbots, APIs - delivered in 1-3 weeks. You test it yourself, pay only when it works.

Evidence Sprint (2-5 days, $3k-6k) = working demo before full build.

Interested?
https://scopelock.mindprotocol.ai
```

---

## Improvements Over Old Scripts

### Old: `find_developers.py`

**Problem:**
- Looked for experienced developers with GitHub portfolios
- Filtered for 5+ years experience, tech stacks, senior roles
- ❌ Wrong target: ScopeLock needs **supervisors** who don't code

**What we changed:**
- NEW: `find_team_members.py`
- Target: Students, juniors, people seeking remote work
- Geographic fit (Nigeria, India, Philippines = cost of living match)
- Willing to learn (NOT requiring existing skills)
- Part-time availability (5-30 hours/week)
- Excludes senior developers (too expensive)

### Old: `find_service_providers.py`

**Problem:**
- Looked for people offering services **TO US**
- Found developers/designers pitching their services
- ❌ Wrong target: These are competitors, not clients

**What we changed:**
- NEW: `find_potential_clients.py`
- Target: Business owners **ASKING FOR** software to be built
- Detects project needs ("I need a website")
- Detects complaints about devs (opportunity!)
- Detects budget mentions (serious buyers)
- Excludes developers offering services

---

## Key Differences: Team vs Client

### Team Member = Wants to Work FOR US
- "Looking for remote work"
- "Need income", "Can work 20 hours/week"
- "Student", "Junior developer"
- From Nigeria, India, Philippines
- Willing to learn

### Client = Wants US to Work for THEM
- "I need a website/app/chatbot"
- "Can someone build..."
- "My developer disappeared"
- Business owner, founder
- Has budget

---

## Tips

### High-Quality Matches

**Team Members:**
- Score 15+ = excellent fit
- Geographic fit + seeking work + junior = perfect
- Avoid if they mention "senior", "5+ years", "$50/hour"

**Clients:**
- Score 18+ = excellent fit
- Complains about devs = highest priority (pain point!)
- Budget + urgency = ready to buy
- Avoid if they say "I can build", "my portfolio"

### Follow-Up

- **Response rate goal:** 20-30% reply
- **Conversion goal (team):** 5-10% join
- **Conversion goal (clients):** 2-5% become paying clients

### Iteration

- Run scripts monthly on new Telegram export
- Track which messages work best
- Refine patterns based on false positives/negatives

---

## Troubleshooting

### Script Errors

**File not found:**
```
FileNotFoundError: [Errno 2] No such file or directory
```
→ Update `TELEGRAM_EXPORT` path in script (line ~22)

**JSON decode error:**
```
json.decoder.JSONDecodeError: Expecting value
```
→ Make sure you exported as **JSON** (not HTML)
→ Check file path ends with `result.json` or `results.json`

### No Results Found

**0 team members / 0 clients:**
1. Check export includes "Personal chats" (not just channels)
2. Verify export is recent (patterns may change over time)
3. Lower score threshold (line ~165 in each script)

---

## Files

```
outreach/
├── ANALYSIS_SCRIPTS_README.md (this file)
├── find_team_members.py (NEW - replaces find_developers.py)
├── find_potential_clients.py (NEW - replaces find_service_providers.py)
├── find_developers.py (OLD - deprecated, looks for wrong profiles)
├── find_service_providers.py (OLD - deprecated, finds competitors not clients)
├── team_members/ (output)
│   ├── team_members.json
│   └── team_members_summary.txt
└── potential_clients/ (output)
    ├── potential_clients.json
    └── potential_clients_summary.txt
```

---

**Created:** 2025-11-06
**Author:** Rafael @ ScopeLock
**Purpose:** Find right people (supervisors, not coders) + right clients (buyers, not sellers)
