# Feature 2: Response Monitoring & Auto-Reply

**Status:** Approved (wake Rafael citizen, email integration)
**Priority:** P0 (Quick Win)
**Time Estimate:** 4h (IFTTT), 12h (full automation)
**Cost:** $0 (IFTTT free tier) or $5/mo (Zapier)

---

## PATTERN

**Consciousness Principle:** "Attention allocation is precious. When a client responds, wake the relevant citizen immediately—don't wait for human to check inbox."

**Why:** Checking Upwork inbox every 2 hours is manual labor that a machine can do better. Instant notification enables <2h SLA without human vigilance.

---

## BEHAVIOR_SPEC

### Event Flow (Full Automation)

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
     prompt = """
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

## ROI

**Time Saved:** 2h/day inbox checking × 5 days/week = 10h/week = 40h/month = $4,000/month
**Cost:** $5/mo (Zapier) + $10/mo (hosting) = $15/mo
**Benefit:** <2h SLA without human vigilance, never miss a response
**Payback:** 12h investment / 40h monthly savings = 0.3 months (instant ROI)
