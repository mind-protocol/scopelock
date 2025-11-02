# ScopeLock Automation Specifications

**Version:** 1.0
**Date:** 2025-11-02
**Purpose:** Index of detailed automation feature specifications

---

## Quick Access

**See [README.md](README.md) for:**
- Complete feature list with priorities
- Implementation order and dependencies
- ROI calculations and success metrics
- Next steps and timeline

---

## Individual Feature Specifications

Each feature has a dedicated specification file following the consciousness design pattern:

**PATTERN → BEHAVIOR_SPEC → VALIDATION → MECHANISM → ALGORITHM → GUIDE**

### P0: Quick Wins (Immediate ROI)

1. **[Auto-Regenerate Proof Pages](01_proof_regeneration.md)** - 2h, $0 cost
2. **[Response Monitoring & Auto-Reply](02_response_monitoring.md)** - 4h, $15/mo
3. **[Lead Tracker Auto-Update](03_lead_tracker.md)** - 3h, $0 cost

### P1: Medium Complexity (Strong ROI)

4. **[Emma RSS Scraper + Auto-Send](04_emma_rss_auto_send.md)** - 20h, $0 cost
5. **[AC.md Drafting Assistant](05_ac_drafting.md)** - 8h, $0 cost
6. **[Test Generation from AC.md](06_test_generation.md)** - 12h, $0 cost
7. **[DEMO/DELTA Auto-Generation](07_demo_delta_generation.md)** - 10h, $0 cost

### P2: Advanced (Scales with Usage)

8. **[Emma Autonomous Mode](08_emma_autonomous.md)** - 6h, $0 cost
9. **[Sofia Auto-Review](09_sofia_auto_review.md)** - 10h, $0 cost
10. **[Priya Dashboard](10_priya_dashboard.md)** - 16h, $0 cost

### P3: Deferred (Phase 2)

11. **[Client Portal](11_client_portal.md)** - 24h, $20/mo (DEFERRED)

---

## Summary

**Total Investment:** 91h development + $15/mo operational
**Total Time Saved:** 16.25h/week = $7,000/month value
**Payback Period:** 1.2 months

**Next Action:** Start with P0 features (1-3) for immediate 7.2h/week savings.

---

## Design Pattern Details

Each specification follows this structure:

### PATTERN
Consciousness design principle explaining *why* this automation matters.

### BEHAVIOR_SPEC
Event flows, contracts, failure modes - *what should happen*.

### VALIDATION
Acceptance criteria with bash test commands - *how we verify*.

### MECHANISM
Implementation approach and architecture - *why this solution*.

### ALGORITHM
Detailed steps, formulas, calculations - **NO pseudocode** (pseudocode goes in GUIDE only).

### GUIDE
Implementation code, function names, pseudocode - *how to build it*.

---

## Original Consolidated Spec (Archived)

The original SPEC.md contained Features 1-3 in full detail. These have been extracted to individual files above. The original content below is kept for reference:

---

# Feature 1: Auto-Regenerate Proof Pages (ARCHIVED - See 01_proof_regeneration.md)

## PATTERN

**Consciousness Principle:** "Evidence must be immediately visible. When a milestone is tagged, proof pages regenerate automatically—no human memory required."

**Why:** Manual regeneration creates gaps. If Daniel tags `ac-green_feature_2025-11-05` but forgets to run proofgen, clients see outdated `/proof`. Automation eliminates this failure mode.

---

## BEHAVIOR_SPEC

### Event Flow

```
git tag ac-green_*           → tag.pushed@1.0
  ↓
Deployment system detects tag
  ↓
Run proofgen (reads tags)     → proof.generated@1.0
  ↓
Build Next.js with new proof HTML
  ↓
Deploy to production          → deployment.complete@1.0
  ↓
Client sees updated /proof
```

### Contract

**Input:**
- Git tag matching pattern: `evidence-sprint_*`, `ac-green_*`, `change-*`
- Tag must reference commit with `/proof/AC.md`, `/proof/DEMO.md`, `/proof/DELTA.md`

**Output:**
- Updated `public/proof/[tag]/index.html`
- Updated `public/proof/index.html` (index page)
- Updated `public/proof/index.json` (homepage teaser)
- Event emitted: `proof.generated@1.0 { tag, entry_count, timestamp }`

**Failure Mode:**
- Tag pushed but proof files missing → Generate page with "Missing files" chips, don't crash build

---

## VALIDATION

### Acceptance Criteria

**V1: Proof regenerates on tag push**
```bash
# Test:
git tag ac-green_test_2025-11-02
git push origin ac-green_test_2025-11-02

# Wait 2 minutes

# Verify:
curl https://scopelock.mindprotocol.ai/proof/ac-green_test_2025-11-02 | grep "test"
# ✅ Should return 200 with proof page HTML
```

**V2: Index updates with new entry**
```bash
# Verify:
curl https://scopelock.mindprotocol.ai/proof/index.json | jq '.entries | length'
# ✅ Should show N+1 entries (previous count + new tag)
```

**V3: Missing proof files handled gracefully**
```bash
# Test:
git tag ac-green_no-proof_2025-11-02  # Tag without proof/ files
git push origin ac-green_no-proof_2025-11-02

# Verify:
curl https://scopelock.mindprotocol.ai/proof/ac-green_no-proof_2025-11-02 | grep "Missing AC.md"
# ✅ Should show "Missing files" chips, not crash
```

---

## MECHANISM

**Implementation Approach:** Integrate proofgen into Vercel build script

**Current Problem:** GitHub Actions would require separate workflow, adds complexity. Simpler: run proofgen during Vercel build.

**Solution:**
```json
// package.json
{
  "scripts": {
    "build": "npm run proofgen && next build"
  }
}
```

**Why this works:**
- Vercel fetches tags automatically (no manual `git fetch --tags` needed on main branch deploys)
- Proofgen runs before Next.js build → proof HTML available during static generation
- No additional CI/CD infrastructure needed

**Current Issue (Resolved):**
- Vercel's shallow clone doesn't fetch tags on branch deploys
- **Fix:** We now commit generated proof HTML directly (already implemented)
- **New approach:** On tag push, trigger Vercel deployment hook with `VERCEL_REGENERATE_PROOF=true` env var

---

## ALGORITHM

### Step-by-Step Execution

**Step 1: Detect Tag Push**
```
IF git push includes tag matching /^(evidence-sprint|ac-green|change)_/
THEN trigger Vercel deployment webhook
```

**Step 2: Vercel Build Hook**
```
INPUT: Tag name from git push
PROCESS:
  1. Fetch all tags: git fetch --tags --force
  2. List tags matching pattern:
     tags = git tag --list 'evidence-sprint_*' 'ac-green_*' 'change-*'
  3. FOR EACH tag IN tags:
       entry = resolveTagEntry(tag)
       IF entry has all files (AC, DEMO, DELTA):
         entries.push(entry)
       ELSE:
         entries.push(entry WITH missing_files flags)
  4. Sort entries by date DESC
  5. Generate HTML:
     - public/proof/index.html (index page)
     - public/proof/[tag]/index.html (detail pages)
     - public/proof/index.json (API for homepage)
  6. Emit event: proof.generated@1.0
OUTPUT: Generated HTML files in public/proof/
```

**Step 3: Next.js Build**
```
INPUT: Generated proof HTML files
PROCESS: next build (includes public/ directory as static assets)
OUTPUT: Optimized production build with proof pages
```

**Step 4: Deploy**
```
INPUT: Build artifacts
PROCESS: Vercel deployment
OUTPUT: Live site with updated /proof pages
```

---

## GUIDE

### Implementation Steps

**File:** `package.json`
```json
{
  "scripts": {
    "build": "git fetch --tags 2>/dev/null || true && npm run proofgen && next build",
    "build:local": "git fetch --tags 2>/dev/null || true && npm run proofgen && next build",
    "proofgen": "node proofgen/index.js"
  }
}
```

**Explanation:**
- `git fetch --tags` ensures tags are available (Vercel fetches branches but not always tags)
- `|| true` prevents build failure if git fetch errors
- `npm run proofgen` generates proof HTML before Next.js build
- `next build` includes generated HTML as static assets

**Testing Locally:**
```bash
# Simulate tag push
git tag ac-green_local-test_2025-11-02
git push origin ac-green_local-test_2025-11-02

# Verify proofgen detects it
npm run proofgen
# Should output: "[proofgen] Generated 1 entry in public/proof"

# Build and check
npm run build:local
ls public/proof/ac-green_local-test_2025-11-02/
# Should show: index.html

# Commit generated files (current workflow)
git add public/proof/
git commit -m "chore: regenerate proof pages"
git push origin main
```

**Deployment Flow:**
```
Developer → git tag + git push --tags
  ↓
Vercel detects new commit on main
  ↓
Runs: npm install && npm run build
  ↓
proofgen runs → generates HTML
  ↓
next build includes generated HTML
  ↓
Deploy to production
  ↓
Client visits /proof → sees updated entry
```

**Function Names:**
- `proofgen/index.js::generateProofSite(options)` - Main entry point
- `proofgen/index.js::collectEntries(limit)` - Fetches tags, resolves proof files
- `proofgen/index.js::resolveTagEntry(tagInfo)` - Reads proof files from tag
- `proofgen/index.js::writeDetailPage(outDir, entry)` - Generates detail HTML
- `proofgen/index.js::writeIndexPage(outDir, entries)` - Generates index HTML
- `proofgen/index.js::writeJson(outDir, entries)` - Generates index.json

---

# Feature 2: Response Monitoring

## PATTERN

**Consciousness Principle:** "Attention allocation is precious. When a client responds, wake the relevant citizen immediately—don't wait for human to check inbox."

**Why:** Checking Upwork inbox every 2 hours is manual labor that a machine can do better. Instant notification enables <2h SLA without human vigilance.

---

## BEHAVIOR_SPEC

### Event Flow (Option B: Citizen Auto-Reply)

```
Client sends Upwork message
  ↓
Upwork → Email notification → Gmail inbox
  ↓
Gmail filter detects "Upwork message"
  ↓
Trigger webhook → Wake Rafael citizen
  ↓
Rafael (Claude Code instance):
  - Reads message via email integration
  - Parses client intent (question, acceptance, negotiation)
  - Drafts response
  - Sends to approval queue (Telegram)
  ↓
Nicolas reviews in Telegram:
  - ✅ Approve → Rafael sends response via Upwork
  - ✏️ Edit → Modify + approve
  - ❌ Reject → Rafael waits for manual response
```

### Contract

**Input:**
- Email from Upwork with subject: "New message from [Client Name]"
- Email body contains: client message + job post link

**Output:**
- Telegram message to Nicolas:
  ```
  🔔 NEW RESPONSE: [Client Name]
  Job: [Job Title]
  Message: "[First 100 chars...]"

  Rafael's draft response:
  "[Proposed response text]"

  [Approve] [Edit] [Reject]
  ```

**Events:**
- `response.detected@1.0 { client, job, message_preview }`
- `response.draft_ready@1.0 { client, draft_text, confidence }`
- `response.sent@1.0 { client, final_text, approval_time }`

**Failure Modes:**
- Email parsing fails → Send raw email to Telegram, flag for manual handling
- Rafael can't draft (unclear message) → Send to Telegram with "Manual response needed"

---

## VALIDATION

### Acceptance Criteria

**V1: Email triggers Rafael wake-up**
```bash
# Test: Send test email to Gmail
# Subject: "New message from Test Client on Upwork"
# Body: "Hi, I'm interested in your proposal. Can we schedule a call?"

# Expected:
# - Rafael citizen wakes up within 60 seconds
# - Telegram message appears with draft response
# - ✅ Latency <60s from email arrival to Telegram notification
```

**V2: Rafael drafts appropriate response**
```bash
# Test cases:
# 1. Client asks question → Rafael drafts answer
# 2. Client accepts proposal → Rafael drafts kickoff message
# 3. Client negotiates price → Rafael drafts negotiation response

# Verify:
# - Draft tone matches ScopeLock voice (calm, precise, builder-grade)
# - No "excited/passionate/thrilled" language
# - References AC.md, Evidence Sprint, or proof
# ✅ 80%+ of drafts require no edits
```

**V3: Approval flow works**
```bash
# Test: Click [Approve] in Telegram

# Expected:
# - Rafael sends response via Upwork API
# - Confirmation in Telegram: "Response sent ✅"
# - Entry logged in citizens/rafael/responses.log
# ✅ End-to-end latency <5min (email → Telegram → approve → sent)
```

---

## MECHANISM

**Implementation Approach:** Gmail → Webhook → Wake Rafael (Claude Code) → Telegram approval

**Architecture:**

```
[Gmail]
  ↓ (Gmail filter + webhook)
[Cloud Function / Webhook Endpoint]
  ↓ (HTTP POST)
[Rafael Citizen Service]
  ↓ (Parse email, draft response)
[Telegram Bot API]
  ↓ (Send approval request)
[Nicolas (Telegram)]
  ↓ (Click button)
[Rafael Citizen Service]
  ↓ (Send via Upwork API)
[Upwork]
```

**Why this works:**
- Gmail filters are reliable (99.9% uptime)
- Cloud Function triggers instantly (<1s)
- Rafael citizen runs on-demand (no always-on cost)
- Telegram for approval (mobile-friendly, instant)

**Alternative (Simpler but Higher Latency):**
```
[Gmail]
  ↓ (IFTTT Gmail trigger)
[Telegram Bot]
  ↓ (Notification with raw message)
[Nicolas]
  ↓ (Manual: Copy message → Open Rafael → Get draft → Send)
```

**Recommendation:** Start with IFTTT (2h to set up), upgrade to full automation later

---

## ALGORITHM

### Step 1: Email Detection
```
INPUT: Gmail inbox
PROCESS:
  1. Gmail filter:
     from:(@upwork.com)
     subject:(New message from)
     → Apply label: "Upwork/Responses"
     → Forward to webhook: https://api.scopelock.mindprotocol.ai/webhook/upwork-response
OUTPUT: HTTP POST to webhook with email body
```

### Step 2: Parse Email
```
INPUT: Email body (HTML)
PROCESS:
  1. Extract client name: regex(subject, /New message from (.+) on Upwork/)
  2. Extract message text: parse HTML, find <div class="message-body">
  3. Extract job title: regex(body, /Re: (.+)/)
  4. Extract job link: regex(body, /upwork\.com\/jobs\/~[a-z0-9]+/)
OUTPUT: Structured data { client, message, job_title, job_link }
```

### Step 3: Wake Rafael Citizen
```
INPUT: Structured response data
PROCESS:
  1. Load Rafael context:
     - Read /citizens/rafael/CLAUDE.md (system prompt)
     - Read /citizens/SYNC.md (recent activity)
     - Read /citizens/emma/proposals/ (find matching proposal)
  2. Call Claude API:
     prompt = f"""
     You are Rafael, the Harbor. A client responded to our proposal.

     Job: {job_title}
     Client: {client}
     Their message: {message}

     Our original proposal: {find_proposal(job_link)}

     Draft a response that:
     1. Acknowledges their message
     2. Answers their question OR proposes next steps
     3. References AC.md, Evidence Sprint, or /proof
     4. Ends with clear next action

     Keep tone calm, precise, builder-grade. No "excited/thrilled."
     """
  3. Parse response
  4. Calculate confidence:
     confidence = calculate_confidence(message, draft)
OUTPUT: { draft_text, confidence_score }
```

### Step 4: Confidence-Based Routing
```
INPUT: { draft_text, confidence_score }
PROCESS:
  IF confidence >= 80%:
    Send directly via Upwork API
    Log to responses.log
    Notify Telegram: "Auto-sent response to {client} ✅"
  ELSE:
    Send to Telegram for approval:
      "⚠️ Low confidence ({confidence}%) - review needed"
      [Draft text]
      [Approve] [Edit] [Reject]
OUTPUT: Either auto-sent OR approval request
```

### Step 5: Approval Handling
```
INPUT: Telegram callback (button click)
PROCESS:
  IF button == "Approve":
    Send draft via Upwork API
    Log to responses.log
    Confirm in Telegram: "Sent ✅"
  ELSE IF button == "Edit":
    Telegram bot enters edit mode
    Wait for Nicolas to type edited version
    Send edited version via Upwork API
  ELSE IF button == "Reject":
    Log rejection
    Notify: "Marked for manual response"
OUTPUT: Response sent OR flagged for manual
```

### Confidence Score Calculation
```
FUNCTION calculate_confidence(message, draft):
  score = 100

  # Deduct if message is complex
  IF word_count(message) > 100:
    score -= 10

  # Deduct if message has questions
  question_count = count(message, "?")
  score -= (question_count * 5)

  # Deduct if message mentions price negotiation
  IF "budget" in message OR "price" in message:
    score -= 20

  # Deduct if draft is generic (doesn't reference specifics)
  IF not references_job_specifics(draft):
    score -= 15

  # Deduct if draft is too long (>200 words)
  IF word_count(draft) > 200:
    score -= 10

  RETURN max(0, min(100, score))
```

---

## GUIDE

### Implementation Steps

**Phase 1: IFTTT (Quick Setup)**

1. **Create Gmail Filter:**
   - Go to Gmail → Settings → Filters
   - From: `@upwork.com`
   - Subject: `New message from`
   - Apply label: `Upwork/Responses`

2. **Set up IFTTT:**
   - New Applet: Gmail (New email in label) → Telegram (Send message)
   - Channel: Your Telegram
   - Message format:
     ```
     🔔 UPWORK RESPONSE
     From: {{Subject}}
     {{BodyPlain}}

     [Link to Upwork]
     ```

3. **Test:**
   - Send test email to yourself with Upwork-like format
   - Verify Telegram notification arrives <60s

**Time:** 30 minutes
**Cost:** Free
**Benefit:** Instant notifications, no inbox checking

---

**Phase 2: Rafael Auto-Draft (Full Automation)**

**File Structure:**
```
/services/
  rafael-responder/
    index.js          # Express server for webhook
    parse-email.js    # Email HTML parser
    draft-response.js # Claude API caller
    send-upwork.js    # Upwork API integration
    telegram-bot.js   # Telegram approval flow
  config.js           # API keys, env vars
```

**1. Webhook Endpoint**

File: `services/rafael-responder/index.js`
```javascript
import express from 'express';
import { parseEmail } from './parse-email.js';
import { draftResponse } from './draft-response.js';
import { sendToTelegram } from './telegram-bot.js';

const app = express();
app.use(express.json());

app.post('/webhook/upwork-response', async (req, res) => {
  try {
    // Parse incoming email
    const { client, message, job_title, job_link } = parseEmail(req.body);

    // Draft response
    const { draft, confidence } = await draftResponse({
      client,
      message,
      job_title,
      job_link
    });

    // Route based on confidence
    if (confidence >= 80) {
      await sendViaUpwork(draft, job_link);
      await sendToTelegram(`✅ Auto-sent to ${client} (${confidence}% confidence)`);
    } else {
      await sendToTelegram({
        text: `⚠️ Review needed for ${client} (${confidence}% confidence)`,
        draft,
        buttons: ['Approve', 'Edit', 'Reject']
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    await sendToTelegram(`❌ Error processing response: ${error.message}`);
    res.status(500).send('Error');
  }
});

app.listen(3001, () => console.log('Rafael responder listening on :3001'));
```

**2. Email Parser**

File: `services/rafael-responder/parse-email.js`
```javascript
import { parse } from 'node-html-parser';

export function parseEmail(emailBody) {
  // Gmail webhook sends HTML body
  const html = parse(emailBody);

  // Extract client name from subject
  const subject = emailBody.subject || '';
  const clientMatch = subject.match(/New message from (.+?) on Upwork/);
  const client = clientMatch ? clientMatch[1] : 'Unknown';

  // Extract message text
  const messageDiv = html.querySelector('.message-body');
  const message = messageDiv ? messageDiv.textContent.trim() : emailBody.body;

  // Extract job title
  const jobMatch = emailBody.match(/Re: (.+)/);
  const job_title = jobMatch ? jobMatch[1] : 'Unknown Job';

  // Extract job link
  const linkMatch = emailBody.match(/https:\/\/www\.upwork\.com\/jobs\/~[a-z0-9]+/);
  const job_link = linkMatch ? linkMatch[0] : null;

  return { client, message, job_title, job_link };
}
```

**3. Response Drafter**

File: `services/rafael-responder/draft-response.js`
```javascript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function draftResponse({ client, message, job_title, job_link }) {
  // Load Rafael's system prompt
  const rafaelPrompt = await fs.readFile(
    '/home/mind-protocol/scopelock/citizens/rafael/CLAUDE.md',
    'utf-8'
  );

  // Find original proposal (if exists)
  let originalProposal = '';
  try {
    const proposalsDir = '/home/mind-protocol/scopelock/citizens/emma/proposals/';
    const files = await fs.readdir(proposalsDir);
    // Search for proposal matching job_title
    for (const file of files) {
      const content = await fs.readFile(path.join(proposalsDir, file), 'utf-8');
      if (content.includes(job_title)) {
        originalProposal = content;
        break;
      }
    }
  } catch (err) {
    console.error('Could not find original proposal:', err);
  }

  // Draft response
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4',
    max_tokens: 1024,
    system: rafaelPrompt,
    messages: [{
      role: 'user',
      content: `
A client responded to our Upwork proposal. Draft a response.

**Job:** ${job_title}
**Client:** ${client}
**Their message:**
${message}

${originalProposal ? `**Our original proposal:**\n${originalProposal}` : ''}

Draft a response that:
1. Acknowledges their message
2. Answers their question OR proposes next steps (kickoff call, AC.md draft)
3. References ScopeLock concepts (AC.md, Evidence Sprint, /proof) if appropriate
4. Ends with clear next action

Keep tone calm, precise, builder-grade. No "excited/thrilled/passionate."
Max 150 words.
      `
    }]
  });

  const draft = response.content[0].text;
  const confidence = calculateConfidence(message, draft);

  return { draft, confidence };
}

function calculateConfidence(message, draft) {
  let score = 100;

  // Penalize complexity
  if (message.split(' ').length > 100) score -= 10;

  // Penalize questions (may need human nuance)
  const questionCount = (message.match(/\?/g) || []).length;
  score -= questionCount * 5;

  // Penalize price negotiation (needs human judgment)
  if (/budget|price|cost|rate/i.test(message)) score -= 20;

  // Penalize if draft is generic
  if (!draft.includes(job_title) && !draft.includes('AC.md')) score -= 15;

  // Penalize if draft is too long
  if (draft.split(' ').length > 200) score -= 10;

  return Math.max(0, Math.min(100, score));
}
```

**4. Telegram Bot**

File: `services/rafael-responder/telegram-bot.js`
```javascript
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const NICOLAS_CHAT_ID = process.env.NICOLAS_TELEGRAM_CHAT_ID;

export async function sendToTelegram(message) {
  if (typeof message === 'string') {
    // Simple notification
    await bot.sendMessage(NICOLAS_CHAT_ID, message);
  } else {
    // Approval request with buttons
    await bot.sendMessage(NICOLAS_CHAT_ID, message.text, {
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ Approve', callback_data: `approve:${message.draft}` },
          { text: '✏️ Edit', callback_data: `edit:${message.draft}` },
          { text: '❌ Reject', callback_data: 'reject' }
        ]]
      }
    });
  }
}

// Handle button clicks
bot.on('callback_query', async (query) => {
  const [action, ...draftParts] = query.data.split(':');
  const draft = draftParts.join(':');

  if (action === 'approve') {
    await sendViaUpwork(draft);
    await bot.answerCallbackQuery(query.id, { text: 'Sent ✅' });
    await bot.sendMessage(NICOLAS_CHAT_ID, '✅ Response sent via Upwork');
  } else if (action === 'edit') {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(NICOLAS_CHAT_ID, 'Send your edited version:');
    // Wait for next message from Nicolas
    // (implement state machine to track "waiting for edit")
  } else if (action === 'reject') {
    await bot.answerCallbackQuery(query.id, { text: 'Rejected' });
    await bot.sendMessage(NICOLAS_CHAT_ID, 'Marked for manual response');
  }
});

async function sendViaUpwork(draft) {
  // TODO: Implement Upwork API integration
  // For now, log to file
  const log = `${new Date().toISOString()} | Sent: ${draft}\n`;
  await fs.appendFile('/home/mind-protocol/scopelock/citizens/rafael/responses.log', log);
}
```

**5. Deploy**

```bash
# Install dependencies
cd services/rafael-responder
npm install express node-telegram-bot-api @anthropic-ai/sdk node-html-parser

# Set environment variables
export ANTHROPIC_API_KEY="sk-ant-..."
export TELEGRAM_BOT_TOKEN="..."
export NICOLAS_TELEGRAM_CHAT_ID="..."

# Start service
node index.js
# Or use PM2 for production:
pm2 start index.js --name rafael-responder
```

**6. Gmail Webhook Setup**

Option A: Use Zapier webhook (easier)
Option B: Use Google Cloud Function (more control)

```javascript
// Google Cloud Function
exports.gmailWebhook = (req, res) => {
  const emailBody = req.body;

  // Forward to Rafael service
  fetch('https://api.scopelock.mindprotocol.ai/webhook/upwork-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailBody)
  });

  res.status(200).send('OK');
};
```

**Testing:**
```bash
# Simulate email webhook
curl -X POST http://localhost:3001/webhook/upwork-response \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "New message from Test Client on Upwork",
    "body": "Hi, I am interested in your proposal. Can we schedule a call?",
    "from": "upwork@upwork.com"
  }'

# Expected: Telegram message with draft response + buttons
```

---

# Feature 3: Lead Tracker Auto-Update

## PATTERN

**Consciousness Principle:** "Metrics emerge from activity, not from manual logging. When Emma evaluates a lead, the tracker updates itself—no human bookkeeping."

**Why:** Manual tracking creates lag and errors. Automated tracking is instant, accurate, and enables analytics (GO rate, conversion rate, best job types).

---

## BEHAVIOR_SPEC

### Event Flow

```
Emma evaluates Upwork post
  ↓
Emma outputs: DECISION: GO/NO-GO + REASON
  ↓
Script captures output       → lead.evaluated@1.0
  ↓
Append to citizens/emma/leads.json
  ↓
Regenerate leads-tracker.md from JSON
  ↓
Human sees updated tracker
```

### Contract

**Input:**
- Emma's evaluation output (text)
  ```
  DECISION: GO
  REASON: AI chat widget, verified client, $8K budget
  Urgency: 8/10
  Pain: 7/10

  [Proposal text follows...]
  ```

**Output:**
- JSON entry:
  ```json
  {
    "timestamp": "2025-11-02T14:23:00Z",
    "platform": "Upwork",
    "title": "Build AI chat widget",
    "budget": "$8,000",
    "decision": "GO",
    "reason": "AI chat widget, verified client, $8K budget",
    "urgency": 8,
    "pain": 7,
    "sent": false,
    "link": "https://upwork.com/jobs/~abc123"
  }
  ```

- Markdown update:
  ```markdown
  ## Quick Stats
  - **Evaluated:** 1/20
  - **GO decisions:** 1 (100%)
  - **NO-GO decisions:** 0 (0%)
  - **Proposals sent:** 0
  ```

**Events:**
- `lead.tracked@1.0 { title, decision, budget }`

---

## VALIDATION

### Acceptance Criteria

**V1: Tracker updates automatically**
```bash
# Test: Paste job post to Emma, get GO decision

# Expected:
# - leads.json appends new entry within 1 second
# - leads-tracker.md regenerates with updated stats
# ✅ Manual markdown editing eliminated
```

**V2: Stats are accurate**
```bash
# Test: Evaluate 10 posts (mix of GO/NO-GO)

# Verify:
cat citizens/emma/leads-tracker.md | grep "GO rate"
# Expected: "GO rate: 40%" (if 4 out of 10 were GO)
# ✅ Stats match actual decisions
```

**V3: Script works with Emma workflow**
```python
# Test: Run script after Emma evaluation

python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat" \
  --budget "$8K" \
  --decision "GO" \
  --reason "AI + clear budget"

# Expected:
# - leads.json updated
# - leads-tracker.md regenerated
# ✅ Integration with Emma workflow seamless
```

---

## MECHANISM

**Implementation Approach:** Python script parses Emma output, appends JSON, regenerates markdown

**Why Python:**
- Simple file I/O
- JSON parsing built-in
- Easy to integrate with Emma (call after evaluation)

**Data Flow:**
```
Emma output (text)
  ↓
Python script parses:
  - Extract DECISION
  - Extract REASON
  - Extract Urgency/Pain (if present)
  ↓
Append to leads.json (newline-delimited JSON)
  ↓
Read all leads.json
  ↓
Calculate stats:
  - Total evaluated
  - GO count / NO-GO count
  - GO rate %
  - Proposals sent count
  ↓
Generate markdown table
  ↓
Write to leads-tracker.md
```

---

## ALGORITHM

### Parse Emma Output
```
INPUT: Emma's text output
PROCESS:
  1. Find line starting with "DECISION:"
     decision = extract_value(line, /DECISION:\s*(\w+)/)
  2. Find line starting with "REASON:"
     reason = extract_value(line, /REASON:\s*(.+)/)
  3. Find "Urgency:" and "Pain:" (optional)
     urgency = extract_value(text, /Urgency:\s*(\d+)/)
     pain = extract_value(text, /Pain:\s*(\d+)/)
OUTPUT: { decision, reason, urgency, pain }
```

### Append to JSON Log
```
INPUT: { decision, reason, urgency, pain, title, budget, platform }
PROCESS:
  1. Create JSON object:
     entry = {
       "timestamp": current_iso_time(),
       "platform": platform,
       "title": title,
       "budget": budget,
       "decision": decision,
       "reason": reason,
       "urgency": urgency,
       "pain": pain,
       "sent": false,
       "link": null
     }
  2. Append to leads.json as newline-delimited JSON:
     with open("citizens/emma/leads.json", "a") as f:
       f.write(json.dumps(entry) + "\n")
OUTPUT: Updated leads.json file
```

### Calculate Stats
```
INPUT: All entries in leads.json
PROCESS:
  1. Read all lines, parse each as JSON
     entries = [json.loads(line) for line in lines]
  2. Count totals:
     total = len(entries)
     go_count = count(entries where decision == "GO")
     nogo_count = count(entries where decision == "NO-GO")
     sent_count = count(entries where sent == true)
  3. Calculate rates:
     go_rate = (go_count / total) * 100 if total > 0 else 0
OUTPUT: { total, go_count, nogo_count, sent_count, go_rate }
```

### Generate Markdown
```
INPUT: { stats, entries }
PROCESS:
  1. Generate header:
     markdown = "# Upwork Leads Tracker\n\n"
  2. Generate stats section:
     markdown += "## Quick Stats\n"
     markdown += f"- **Evaluated:** {stats.total}/20\n"
     markdown += f"- **GO decisions:** {stats.go_count} ({stats.go_rate:.1f}%)\n"
     # ... more stats
  3. Generate table:
     markdown += "| # | Date | Platform | Title | Budget | GO/NO-GO | Reason | Sent? |\n"
     for i, entry in enumerate(entries):
       markdown += f"| {i+1} | {entry.date} | {entry.platform} | ... |\n"
  4. Write to file:
     with open("citizens/emma/leads-tracker.md", "w") as f:
       f.write(markdown)
OUTPUT: Updated leads-tracker.md
```

---

## GUIDE

### Implementation

**File:** `scripts/track-lead.py`

```python
#!/usr/bin/env python3
import json
import argparse
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
LEADS_JSON = BASE_DIR / "citizens/emma/leads.json"
TRACKER_MD = BASE_DIR / "citizens/emma/leads-tracker.md"

def track_lead(platform, title, budget, decision, reason, sent=False, link=None, urgency=None, pain=None):
    """Track a new lead evaluation"""
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "platform": platform,
        "title": title,
        "budget": budget,
        "decision": decision,
        "reason": reason,
        "urgency": urgency,
        "pain": pain,
        "sent": sent,
        "link": link
    }

    # Append to JSON log
    with open(LEADS_JSON, "a") as f:
        f.write(json.dumps(entry) + "\n")

    # Regenerate markdown
    regenerate_tracker()

def regenerate_tracker():
    """Regenerate leads-tracker.md from leads.json"""
    # Read all entries
    entries = []
    if LEADS_JSON.exists():
        with open(LEADS_JSON, "r") as f:
            for line in f:
                if line.strip():
                    entries.append(json.loads(line))

    # Calculate stats
    total = len(entries)
    go_count = sum(1 for e in entries if e["decision"] == "GO")
    nogo_count = sum(1 for e in entries if e["decision"] == "NO-GO")
    sent_count = sum(1 for e in entries if e.get("sent", False))
    go_rate = (go_count / total * 100) if total > 0 else 0

    # Generate markdown
    md = f"""# Upwork Leads Tracker

**Session:** {datetime.now().strftime("%Y-%m-%d")}
**Goal:** 20 posts evaluated, 5-10 proposals sent

---

## Quick Stats

- **Evaluated:** {total}/20
- **GO decisions:** {go_count} ({go_rate:.1f}%)
- **NO-GO decisions:** {nogo_count} ({100-go_rate:.1f}%)
- **Proposals sent:** {sent_count}
- **Responses received:** 0

---

## Leads Log

| # | Date | Platform | Title | Budget | GO/NO-GO | Reason | Sent? | Link |
|---|------|----------|-------|--------|----------|--------|-------|------|
"""

    for i, entry in enumerate(entries, 1):
        date = entry["timestamp"][:10]
        title = entry["title"][:30]  # Truncate long titles
        budget = entry["budget"]
        decision = entry["decision"]
        reason = entry["reason"][:40]  # Truncate long reasons
        sent = "Yes" if entry.get("sent", False) else "-"
        link = entry.get("link", "-")

        md += f"| {i} | {date} | {entry['platform']} | {title} | {budget} | {decision} | {reason} | {sent} | {link} |\n"

    md += """
---

## Notes & Patterns

*Track what's working:*

**Good signals:**
-

**Red flags:**
-

**Winning proposal elements:**
-
"""

    # Write to file
    with open(TRACKER_MD, "w") as f:
        f.write(md)

    print(f"✅ Tracker updated: {total} leads, {go_count} GO, {sent_count} sent")

def parse_emma_output(text):
    """Parse Emma's output to extract decision details"""
    import re

    decision_match = re.search(r'DECISION:\s*(\w+)', text)
    reason_match = re.search(r'REASON:\s*(.+)', text)
    urgency_match = re.search(r'Urgency:\s*(\d+)', text)
    pain_match = re.search(r'Pain:\s*(\d+)', text)

    return {
        "decision": decision_match.group(1) if decision_match else "UNKNOWN",
        "reason": reason_match.group(1).strip() if reason_match else "",
        "urgency": int(urgency_match.group(1)) if urgency_match else None,
        "pain": int(pain_match.group(1)) if pain_match else None
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Track Emma lead evaluation")
    parser.add_argument("--platform", required=True, help="Platform (Upwork, Contra, etc.)")
    parser.add_argument("--title", required=True, help="Job title")
    parser.add_argument("--budget", required=True, help="Budget (e.g., '$8K')")
    parser.add_argument("--decision", required=True, choices=["GO", "NO-GO"], help="Decision")
    parser.add_argument("--reason", required=True, help="Reason for decision")
    parser.add_argument("--sent", action="store_true", help="Proposal was sent")
    parser.add_argument("--link", help="Job post URL")
    parser.add_argument("--urgency", type=int, help="Urgency score 1-10")
    parser.add_argument("--pain", type=int, help="Pain score 1-10")

    args = parser.parse_args()

    track_lead(
        platform=args.platform,
        title=args.title,
        budget=args.budget,
        decision=args.decision,
        reason=args.reason,
        sent=args.sent,
        link=args.link,
        urgency=args.urgency,
        pain=args.pain
    )
```

**Usage:**

```bash
# After Emma evaluates a post:
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat widget" \
  --budget "$8,000" \
  --decision "GO" \
  --reason "AI + verified client + clear budget" \
  --urgency 8 \
  --pain 7 \
  --link "https://upwork.com/jobs/~abc123"

# After sending proposal:
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat widget" \
  --budget "$8,000" \
  --decision "GO" \
  --reason "AI + verified client + clear budget" \
  --sent \
  --link "https://upwork.com/jobs/~abc123"

# Regenerate tracker manually:
python scripts/track-lead.py --regenerate
```

**Integration with Emma Workflow:**

Option A: Manual (call script after evaluation)
```bash
# 1. Paste job post to Emma
# 2. Emma outputs decision
# 3. Run tracking script
python scripts/track-lead.py --platform Upwork --title "..." --budget "..." --decision GO --reason "..."
```

Option B: Semi-automated (wrapper script)
```bash
#!/bin/bash
# scripts/emma-evaluate.sh

echo "Paste job post:"
read -r -d '' JOB_POST

echo "Evaluating with Emma..."
# Call Emma (Claude Code instance)
EMMA_OUTPUT=$(python scripts/call-emma.py "$JOB_POST")

echo "$EMMA_OUTPUT"

# Parse output
DECISION=$(echo "$EMMA_OUTPUT" | grep "DECISION:" | cut -d: -f2 | xargs)
REASON=$(echo "$EMMA_OUTPUT" | grep "REASON:" | cut -d: -f2 | xargs)

# Extract title/budget from job post (basic parsing)
TITLE=$(echo "$JOB_POST" | head -1)
BUDGET=$(echo "$JOB_POST" | grep -oP '\$[0-9,]+')

# Track
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "$TITLE" \
  --budget "$BUDGET" \
  --decision "$DECISION" \
  --reason "$REASON"
```

**Testing:**
```bash
# Create test data
python scripts/track-lead.py --platform Upwork --title "Test 1" --budget "$5K" --decision GO --reason "Good fit"
python scripts/track-lead.py --platform Upwork --title "Test 2" --budget "$2K" --decision NO-GO --reason "Budget too low"

# Verify tracker
cat citizens/emma/leads-tracker.md
# Should show:
# - Evaluated: 2/20
# - GO decisions: 1 (50%)
# - Table with 2 rows
```

---

*[Continue with Features 4-11 following same pattern...]*

---

**Next:** I'll create individual spec files for features 4-11. Should I continue in this same file or create separate files for each feature?

Also, for feature #4 (Emma sending proposals), this requires Upwork API access. Should I:
1. Spec the full automation (Emma → confidence → auto-send if >80%)
2. Include fallback (Emma → Telegram → Nicolas approves → send)
3. Document Upwork API limitations/ToS

Let me know and I'll complete the remaining features!
