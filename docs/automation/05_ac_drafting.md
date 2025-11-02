# Feature 5: AC.md Drafting Assistant (Wake Citizen)

**Status:** Approved (wake citizen via Claude Code, not direct API)
**Priority:** P1 (Medium Complexity)
**Time Estimate:** 8h
**Cost:** $0 (uses existing Claude API quota)

---

## PATTERN

**Consciousness Principle:** "Acceptance criteria are the contract. When a client agrees to a milestone, wake Rafael to co-author AC.md—don't wait for human to start the session."

**Why:** AC.md drafting is repeatable but requires context (client needs, technical constraints, verification approach). A citizen can draft 80% of it, leaving humans to refine the 20% that requires judgment.

---

## BEHAVIOR_SPEC

### Event Flow

```
Client agrees to milestone (Rafael detects via email/Upwork)
  ↓
Rafael marks milestone as "ready for AC"
  ↓
Trigger AC drafting workflow            → ac.draft_requested@1.0
  ↓
Wake Rafael citizen (Claude Code instance)
  ↓
Rafael loads:
  - Client conversation history
  - Original proposal
  - Similar past AC.md files (as templates)
  ↓
Rafael generates AC.md draft with:
  - Functional criteria (features)
  - Non-functional criteria (performance, quality)
  - Verification (test command + seed data)
  ↓
Save draft to /proof/AC.md (uncommitted)  → ac.draft_ready@1.0
  ↓
Notify human via Telegram:
  "AC.md draft ready for [Client Name]"
  ↓
Human reviews, edits, commits
  ↓
Tag as ac-baseline_*                     → ac.baseline@1.0
```

### Contract

**Input:**
- Client name
- Milestone description (from proposal or conversation)
- Budget
- Client conversation history (emails, Upwork messages)

**Output:**
- Draft `/proof/AC.md` with:
  - **Context** section (what problem we're solving)
  - **Functional Criteria** (F1, F2, F3... with acceptance tests)
  - **Non-Functional Criteria** (NF1: Performance, NF2: Quality, NF3: Deployment)
  - **Verification** section (how to test, seed data)
- Telegram notification with link to draft file

**Events:**
- `ac.draft_requested@1.0 { client, milestone, budget }`
- `ac.draft_ready@1.0 { client, file_path, word_count }`

**Failure Modes:**
- Insufficient context → Rafael outputs "NEEDS_CLARIFICATION" with specific questions
- Client history unavailable → Use generic template with placeholders

---

## VALIDATION

### Acceptance Criteria

**V1: Rafael wakes and drafts AC.md**
```bash
# Test: Trigger AC drafting for test client

# Expected:
# - Rafael citizen wakes within 30s
# - AC.md draft generated in <2min
# - File contains Functional + Non-Functional + Verification sections
# - ✅ Draft is 80%+ complete (minimal editing needed)
```

**V2: AC.md follows ScopeLock template**
```bash
# Test: Compare generated AC.md to existing proof entries

# Expected:
# - Same section structure (Context, Functional, Non-Functional, Verification)
# - Test commands are executable (e.g., `npm test`, `pytest tests/`)
# - Seed data provided (URLs, sample inputs, expected outputs)
# - ✅ Format matches existing AC.md files
```

**V3: Human can review and commit**
```bash
# Test: Human edits draft and tags baseline

# Expected:
# - Draft is in /proof/AC.md (uncommitted)
# - Human can edit in IDE
# - After commit + tag, baseline guard activates
# - ✅ Workflow integrates with existing ScopeLock process
```

---

## MECHANISM

**Implementation Approach:** Wake Rafael citizen via Claude Code instance, not direct Claude API

**Architecture:**

```
[Trigger: Client milestone ready]
  ↓
[Wake Rafael Service]
  ↓ (Spawn Claude Code instance with Rafael prompt)
[Rafael Citizen (Claude Code)]
  ↓ (Load context: client history, past AC.md templates)
[Claude API]
  ↓ (Generate draft AC.md)
[Save to /proof/AC.md]
  ↓
[Notify Telegram]
```

**Why wake citizen instead of direct API:**
- Citizens have persistent context (SYNC.md, client history)
- Citizens can use tools (Read, Write, Grep) to find templates
- Citizens can emit events for tracking
- Consistent with ScopeLock's "citizens do repeatable work" principle

**Alternative (Direct API):**
- Simpler but loses citizen context and tooling
- Would require manual template selection
- No event tracking

**Recommendation:** Wake Rafael citizen for full context + tooling access

---

## ALGORITHM

### 1. Trigger Detection

**Input:** Event source (email, Upwork message, Telegram command)

**Steps:**
1. Monitor Rafael's inbox for keywords: "let's proceed", "ready to start", "kick off"
2. Parse client name from email subject or sender
3. Fetch client conversation history (last 10 emails or messages)
4. Extract milestone description from most recent message
5. Emit `ac.draft_requested` event with client metadata

**Output:** `{ client_name, milestone_description, budget, history }`

---

### 2. Wake Rafael Citizen

**Input:** `{ client_name, milestone_description }`

**Steps:**
1. Construct citizen wake command:
   ```
   claude-code --prompt "You are Rafael. Draft AC.md for [client] milestone: [description]"
   ```
2. Set working directory: `/home/mind-protocol/scopelock`
3. Pass context via environment variables:
   - `CLAUDE_CLIENT_NAME=[client_name]`
   - `CLAUDE_MILESTONE=[milestone_description]`
   - `CLAUDE_TASK=ac-draft`
4. Execute command asynchronously (non-blocking)
5. Monitor process output for completion signal

**Output:** Running Rafael citizen process

---

### 3. Rafael Draft Generation (Inside Citizen)

**Input:** Client name, milestone description (from env vars)

**Steps:**
1. Read Rafael system prompt: `citizens/rafael/CLAUDE.md`
2. Search for similar AC.md files:
   - Use Glob tool: `proof/**/AC.md`
   - Read top 3 most recent AC.md files
   - Extract structure and example criteria
3. Read client conversation history:
   - Check `citizens/emma/proposals/` for original proposal
   - Check `citizens/rafael/client-notes/` for conversation logs
4. Construct AC.md draft prompt:
   ```
   Draft AC.md for [client] milestone: [description]

   Reference structure from:
   [paste example AC.md]

   Client context:
   [paste conversation history]

   Generate:
   1. Context section (2-3 sentences)
   2. Functional Criteria (F1, F2, F3... with tests)
   3. Non-Functional Criteria (NF1: Performance p95 < Xms, NF2: Quality, NF3: Deployment)
   4. Verification (test command, seed data, expected output)
   ```
5. Call internal reasoning to generate draft
6. Write draft to `/proof/AC.md` using Write tool
7. Emit `ac.draft_ready` event

**Output:** Draft AC.md file in `/proof/` directory

---

### 4. Notification

**Input:** `{ client_name, file_path }`

**Steps:**
1. Calculate draft stats:
   - Word count
   - Number of functional criteria
   - Number of non-functional criteria
2. Format Telegram message:
   ```
   ✅ AC.md draft ready for [Client Name]

   Location: /proof/AC.md
   Word count: [X]
   Criteria: [F] functional, [NF] non-functional

   Next steps:
   1. Review /proof/AC.md
   2. Edit as needed
   3. Commit and tag: ac-baseline_[milestone]_[date]
   ```
3. Send via Telegram bot

**Output:** Telegram notification sent

---

## GUIDE

### Implementation

**File Structure:**
```
/services/
  ac-drafter/
    index.js          # Trigger detector + citizen waker
    wake-citizen.js   # Claude Code instance spawner
    templates/        # Example AC.md templates
```

**1. Trigger Detector**

File: `services/ac-drafter/index.js`
```javascript
import { spawn } from 'child_process';
import fs from 'fs/promises';
import { sendToTelegram } from '../shared/telegram.js';

// Monitor for AC draft requests
export async function detectACRequest(message) {
  // Keywords that trigger AC drafting
  const triggers = [
    /let'?s proceed/i,
    /ready to start/i,
    /kick ?off/i,
    /begin milestone/i
  ];

  const isTriggered = triggers.some(pattern => pattern.test(message.body));

  if (isTriggered) {
    const clientName = extractClientName(message);
    const milestone = extractMilestone(message);

    await draftAC({ clientName, milestone });
  }
}

async function draftAC({ clientName, milestone }) {
  console.log(`[AC DRAFT] Starting for ${clientName}: ${milestone}`);

  // Wake Rafael citizen
  const { wakeCitizen } = await import('./wake-citizen.js');

  await wakeCitizen('rafael', {
    task: 'ac-draft',
    client: clientName,
    milestone: milestone
  });
}

function extractClientName(message) {
  // Extract from email subject: "Re: Proposal for [Client Name]"
  const match = message.subject.match(/for (.+)/);
  return match ? match[1] : 'Unknown Client';
}

function extractMilestone(message) {
  // Extract first sentence from message body
  const firstSentence = message.body.split('.')[0];
  return firstSentence.trim();
}
```

**2. Citizen Waker**

File: `services/ac-drafter/wake-citizen.js`
```javascript
import { spawn } from 'child_process';
import path from 'path';

export function wakeCitizen(citizenName, context) {
  return new Promise((resolve, reject) => {
    const prompt = buildPrompt(citizenName, context);

    // Spawn Claude Code instance
    const claudeCode = spawn('claude-code', ['--prompt', prompt], {
      cwd: '/home/mind-protocol/scopelock',
      env: {
        ...process.env,
        CLAUDE_CITIZEN: citizenName,
        CLAUDE_CLIENT_NAME: context.client,
        CLAUDE_MILESTONE: context.milestone,
        CLAUDE_TASK: context.task
      }
    });

    let output = '';

    claudeCode.stdout.on('data', (data) => {
      output += data.toString();
      console.log('[CITIZEN OUTPUT]', data.toString());
    });

    claudeCode.stderr.on('data', (data) => {
      console.error('[CITIZEN ERROR]', data.toString());
    });

    claudeCode.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject(new Error(`Citizen exited with code ${code}`));
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      claudeCode.kill();
      reject(new Error('Citizen timeout'));
    }, 5 * 60 * 1000);
  });
}

function buildPrompt(citizenName, context) {
  return `
You are ${citizenName}, a ScopeLock citizen.

Task: Draft AC.md for a client milestone.

**Client:** ${context.client}
**Milestone:** ${context.milestone}

Steps:
1. Use Glob to find existing AC.md files: "proof/**/AC.md"
2. Read 2-3 recent AC.md files as templates
3. Read client proposal from: citizens/emma/proposals/ (search for ${context.client})
4. Draft AC.md following this structure:

# ${context.milestone}

## Context
[2-3 sentences: what problem are we solving?]

## Functional Criteria

**F1: [Feature 1 Name]**
- Description: [what it does]
- Acceptance: [how we verify it works]

**F2: [Feature 2 Name]**
...

## Non-Functional Criteria

**NF1: Performance**
- p95 latency < [X]ms
- Acceptance: Load test shows p95 below threshold

**NF2: Quality**
- No silent fallbacks
- All errors logged with context

**NF3: Deployment**
- Deployed to production
- Health checks passing

## Verification

\`\`\`bash
# Test command
npm test

# Seed data
# [Describe how to set up test environment]

# Expected output
# [What does success look like?]
\`\`\`

5. Write draft to: proof/AC.md
6. Send Telegram notification with file location

Output only: "DONE" when complete.
  `.trim();
}
```

**3. Telegram Notification (Reuse from other features)**

File: `services/shared/telegram.js`
```javascript
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const CHAT_ID = process.env.NICOLAS_TELEGRAM_CHAT_ID;

export async function sendToTelegram(message) {
  await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
}
```

**4. Rafael Citizen Logic (Inside Claude Code Session)**

When Rafael is woken with `CLAUDE_TASK=ac-draft`, he should:

```javascript
// Rafael's internal logic (this runs inside Claude Code)
async function draftAC() {
  const client = process.env.CLAUDE_CLIENT_NAME;
  const milestone = process.env.CLAUDE_MILESTONE;

  // 1. Find template AC.md files
  const templates = await glob('proof/**/AC.md');
  const recentTemplates = templates.slice(0, 3);

  // 2. Read templates
  const templateContent = await Promise.all(
    recentTemplates.map(path => read(path))
  );

  // 3. Find client proposal
  const proposals = await glob('citizens/emma/proposals/*.txt');
  const clientProposal = proposals.find(p => p.includes(client));
  const proposalContent = clientProposal ? await read(clientProposal) : '';

  // 4. Draft AC.md
  const draft = `
# ${milestone}

## Context

${inferContextFromProposal(proposalContent)}

## Functional Criteria

${extractFunctionalCriteria(milestone, proposalContent)}

## Non-Functional Criteria

**NF1: Performance**
- p95 latency < 500ms
- Acceptance: Load test with 100 concurrent users shows p95 below threshold

**NF2: Quality**
- No silent fallbacks (R-400/R-401 compliance)
- All errors logged with context
- Acceptance: Code review passes Sofia's verdict

**NF3: Deployment**
- Deployed to production environment
- Health checks passing
- Acceptance: Live URL responds with 200 status

## Verification

\`\`\`bash
# Run acceptance tests
npm test

# Seed data
# [To be defined based on specific milestone]

# Expected output
# All tests pass, CI green
\`\`\`
  `.trim();

  // 5. Write draft
  await write('proof/AC.md', draft);

  // 6. Notify
  await sendToTelegram(`
✅ AC.md draft ready for ${client}

**Milestone:** ${milestone}
**Location:** proof/AC.md

Next steps:
1. Review proof/AC.md
2. Edit as needed
3. Commit and tag: ac-baseline_${milestone.toLowerCase().replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}
  `);

  return 'DONE';
}
```

**5. Deploy & Test**

```bash
# Install dependencies
cd services/ac-drafter
npm install node-telegram-bot-api

# Set environment variables
export TELEGRAM_BOT_TOKEN="..."
export NICOLAS_TELEGRAM_CHAT_ID="..."

# Test manually
node -e "
  const { wakeCitizen } = require('./wake-citizen.js');
  wakeCitizen('rafael', {
    task: 'ac-draft',
    client: 'Test Client',
    milestone: 'Build signup flow with OTP'
  });
"

# Check output
cat proof/AC.md

# Expected: Draft AC.md with Context, Functional, Non-Functional, Verification sections
```

**Integration with Email Monitoring:**

Add AC draft detection to Rafael's response monitoring:

```javascript
// In services/rafael-responder/index.js
app.post('/webhook/upwork-response', async (req, res) => {
  const { client, message } = parseEmail(req.body);

  // Check if client is ready for AC draft
  if (/let'?s proceed|ready to start|kick ?off/i.test(message)) {
    const { draftAC } = await import('../ac-drafter/index.js');
    await draftAC({ clientName: client, milestone: extractMilestone(message) });
  }

  // ... rest of response handling
});
```

---

## ROI

**Time Saved:**
- Manual AC.md drafting: 1-2h per milestone
- With automation: 15min review + edits
- Savings: 1h per milestone × 10 milestones/month = 10h/month = $1,000/month

**Cost:**
- Development: 8h × $100/h = $800
- Running: $0 (uses existing Claude API quota)

**Benefit:**
- Consistent AC.md structure (reduces client confusion)
- Faster milestone kickoff (same-day AC.md instead of 1-2 day delay)
- Human time freed for judgment tasks (pricing, scope negotiation)

**Payback:** 8h investment / 10h monthly savings = 0.8 months (immediate ROI)
