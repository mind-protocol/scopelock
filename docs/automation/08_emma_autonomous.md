# Feature 8: Emma Autonomous Mode (Confidence-Based Routing)

**Status:** Approved (confidence >80% auto-send, <80% Telegram)
**Priority:** P2 (Advanced)
**Time Estimate:** 6h (logic layer on top of Feature 4)
**Cost:** $0

---

## PATTERN

**Consciousness Principle:** "Autonomy requires judgment. When Emma evaluates a lead, she decides whether to proceed independently or request human oversight—based on confidence in her assessment."

**Why:** Full automation without oversight is risky (could send bad proposals). Full manual review negates automation benefits. Confidence-based routing balances speed and safety.

---

## BEHAVIOR_SPEC

### Event Flow

```
Emma evaluates lead via RSS scraper
  ↓
Emma outputs: DECISION + REASON + PROPOSAL
  ↓
Calculate confidence score (0-100)     → confidence.calculated@1.0
  ↓
IF confidence ≥ 80%:
  Auto-send proposal                   → proposal.sent@1.0 { method: "auto" }
  Log to sent-proposals.log
  Notify Telegram: "Auto-sent (90% confidence)"
ELSE IF confidence ≥ 30% AND < 80%:
  Send to Telegram for approval        → proposal.approval_requested@1.0
  Wait for [Approve] [Edit] [Reject]
  IF approved:
    Send proposal                      → proposal.sent@1.0 { method: "manual" }
ELSE (confidence < 30%):
  Auto-reject (log only)               → proposal.rejected@1.0 { reason: "low_confidence" }
  Notify Telegram: "Auto-rejected (20% confidence)"
```

### Contract

**Input:**
- Emma's evaluation: `{ decision, reason, urgency, pain, proposal_text }`
- Job post data: `{ title, description, budget, client_info }`

**Output:**
- **High confidence (≥80%):** Proposal sent automatically
- **Medium confidence (30-79%):** Telegram approval request
- **Low confidence (<30%):** Auto-reject with notification

**Events:**
- `confidence.calculated@1.0 { score, factors }`
- `proposal.sent@1.0 { method: "auto"|"manual", confidence }`
- `proposal.approval_requested@1.0 { confidence, draft }`
- `proposal.rejected@1.0 { reason: "low_confidence", score }`

**Failure Modes:**
- Confidence calculation error → Default to manual approval (safety first)
- Auto-send fails (Upwork error) → Retry once, then send to Telegram

---

## VALIDATION

### Acceptance Criteria

**V1: High-confidence proposals auto-sent**
```bash
# Test: Emma evaluates simple, clear job post (verified client, clear budget, AI domain)

# Expected:
# - Confidence ≥ 80%
# - Proposal sent automatically within 2min
# - Telegram notification: "Auto-sent (85% confidence)"
# - ✅ No human intervention needed
```

**V2: Low-confidence proposals go to approval**
```bash
# Test: Emma evaluates complex job (vague scope, new client, budget negotiable)

# Expected:
# - Confidence < 80%
# - Telegram message with [Approve] [Edit] [Reject] buttons
# - Clicking [Approve] sends proposal
# - ✅ Human reviews before send
```

**V3: Very low confidence auto-rejects**
```bash
# Test: Emma evaluates mismatched job (wrong domain, budget too low)

# Expected:
# - Confidence < 30%
# - Proposal NOT sent
# - Telegram notification: "Auto-rejected (15% confidence) - budget too low"
# - ✅ No manual review needed for obvious NO-GO
```

---

## MECHANISM

**Implementation Approach:** Confidence calculator with tunable thresholds + routing logic

**Architecture:**

```
[Emma Evaluation]
  ↓
[Confidence Calculator]
  ↓ (score 0-100)
[Router]
  ├─ ≥80% → [Auto-Send] → [Log + Notify]
  ├─ 30-79% → [Telegram Approval] → [Manual Send]
  └─ <30% → [Auto-Reject] → [Log + Notify]
```

**Why confidence-based routing:**
- Reduces human workload for obvious GO decisions
- Preserves human judgment for edge cases
- Builds trust through transparency (confidence score visible)
- Enables tuning (adjust thresholds based on send/reject accuracy)

**Confidence Formula (from Feature 4):**
```
base_score = 100
- word_count_penalty (job desc >200 words)
- question_penalty (each "?" in description)
- vague_budget_penalty ("TBD" or "negotiable")
- new_client_penalty (<5 jobs posted)
- generic_proposal_penalty (no AC.md/Evidence Sprint mention)
- length_penalty (proposal >300 words)
+ urgency_boost (urgency score × 2)
```

---

## ALGORITHM

### 1. Confidence Calculation (Detailed)

**Input:** `{ job_post, proposal, urgency_score }`

**Formula breakdown:**

**Base score:** 100

**Penalty 1: Job complexity (word count)**
```
word_count = count_words(job_post.description)
IF word_count > 200:
  penalty = floor((word_count - 200) / 50) × 5
ELSE:
  penalty = 0

Example:
- 150 words → 0 penalty
- 250 words → floor((250-200)/50) × 5 = 5 penalty
- 400 words → floor((400-200)/50) × 5 = 20 penalty
```

**Penalty 2: Questions (indicates uncertainty)**
```
question_count = count_occurrences(job_post.description, "?")
penalty = question_count × 5

Example:
- "Build a chat widget. Budget: $8K." → 0 questions → 0 penalty
- "Can you build X? How long? What stack?" → 3 questions → 15 penalty
```

**Penalty 3: Vague budget**
```
IF "TBD" in job_post.budget OR "negotiable" in job_post.budget:
  penalty = 20
ELSE:
  penalty = 0
```

**Penalty 4: New/unverified client**
```
IF job_post.client_info.jobs_posted < 5:
  penalty = 15
ELSE:
  penalty = 0
```

**Penalty 5: Generic proposal**
```
IF "AC.md" not in proposal AND "Evidence Sprint" not in proposal:
  penalty = 15
ELSE:
  penalty = 0
```

**Penalty 6: Proposal length (overly verbose)**
```
proposal_word_count = count_words(proposal)
IF proposal_word_count > 300:
  penalty = 10
ELSE:
  penalty = 0
```

**Boost: Urgency (high urgency increases confidence)**
```
urgency_boost = urgency_score × 2

Example:
- Urgency 8/10 → +16 points
- Urgency 5/10 → +10 points
```

**Final confidence score:**
```
confidence = base_score
             - word_count_penalty
             - question_penalty
             - vague_budget_penalty
             - new_client_penalty
             - generic_proposal_penalty
             - length_penalty
             + urgency_boost

confidence = clamp(confidence, 0, 100)
```

**Output:** Integer 0-100

---

### 2. Routing Decision

**Input:** `{ confidence_score }`

**Decision tree:**
```
IF confidence >= 80:
  action = "AUTO_SEND"
  CALL send_via_upwork(proposal, job_link)
  CALL log_sent(job, proposal, "auto", confidence)
  CALL notify_telegram("Auto-sent (${confidence}% confidence)")

ELSE IF confidence >= 30:
  action = "APPROVAL_NEEDED"
  CALL send_telegram_approval_request(job, proposal, confidence)
  WAIT for_user_response()
  IF user_response == "APPROVE":
    CALL send_via_upwork(proposal, job_link)
    CALL log_sent(job, proposal, "manual", confidence)
  ELSE IF user_response == "REJECT":
    CALL log_rejected(job, "manual_reject", confidence)
  ELSE IF user_response == "EDIT":
    edited_proposal = WAIT for_user_edit()
    CALL send_via_upwork(edited_proposal, job_link)
    CALL log_sent(job, edited_proposal, "manual_edited", confidence)

ELSE (confidence < 30):
  action = "AUTO_REJECT"
  CALL log_rejected(job, "low_confidence", confidence)
  CALL notify_telegram("Auto-rejected (${confidence}% confidence) - ${reason}")
```

**Thresholds (tunable):**
- **Auto-send threshold:** 80% (conservative, can increase to 85-90% after validation)
- **Manual threshold:** 30% (below this, likely not worth human time)
- **Gap (30-79%):** Always requires human judgment

**Output:** Proposal sent, approval requested, or auto-rejected

---

## GUIDE

### Implementation

This feature is a **logic layer on top of Feature 4 (Emma RSS Auto-Send)**.

**File:** `services/emma-rss/confidence.js` (already exists from Feature 4)

**Enhancements:**

Add confidence breakdown for debugging:

```javascript
export function calculateConfidence(jobPost, proposal, urgency) {
  let score = 100;
  const breakdown = {
    base: 100,
    penalties: [],
    boosts: []
  };

  // Word count penalty
  const descWords = jobPost.description.split(/\s+/).length;
  if (descWords > 200) {
    const penalty = Math.floor((descWords - 200) / 50) * 5;
    score -= penalty;
    breakdown.penalties.push({ reason: 'long_description', value: -penalty });
  }

  // Question penalty
  const questionCount = (jobPost.description.match(/\?/g) || []).length;
  if (questionCount > 0) {
    const penalty = questionCount * 5;
    score -= penalty;
    breakdown.penalties.push({ reason: 'questions', value: -penalty });
  }

  // Vague budget
  if (/TBD|negotiable/i.test(jobPost.budget)) {
    score -= 20;
    breakdown.penalties.push({ reason: 'vague_budget', value: -20 });
  }

  // New client
  if (/new client|0 hires|no reviews/i.test(jobPost.description)) {
    score -= 15;
    breakdown.penalties.push({ reason: 'new_client', value: -15 });
  }

  // Generic proposal
  if (!proposal.includes('AC.md') && !proposal.includes('Evidence Sprint')) {
    score -= 15;
    breakdown.penalties.push({ reason: 'generic_proposal', value: -15 });
  }

  // Proposal length
  const proposalWords = proposal.split(/\s+/).length;
  if (proposalWords > 300) {
    score -= 10;
    breakdown.penalties.push({ reason: 'verbose_proposal', value: -10 });
  }

  // Urgency boost
  if (urgency) {
    const boost = urgency * 2;
    score += boost;
    breakdown.boosts.push({ reason: 'urgency', value: +boost });
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));
  breakdown.final = score;

  return { score, breakdown };
}
```

**File:** `services/emma-rss/router.js` (new)

```javascript
import { sendViaUpwork } from './upwork-sender.js';
import { requestApproval } from './telegram-approval.js';
import { sendToTelegram } from '../shared/telegram.js';
import fs from 'fs/promises';

const AUTO_SEND_THRESHOLD = 80;
const MANUAL_THRESHOLD = 30;

export async function routeProposal(jobPost, proposal, confidence) {
  const { score, breakdown } = confidence;

  // Log confidence breakdown
  console.log(`[CONFIDENCE] ${score}% for "${jobPost.title}"`);
  console.log('  Penalties:', breakdown.penalties);
  console.log('  Boosts:', breakdown.boosts);

  if (score >= AUTO_SEND_THRESHOLD) {
    // Auto-send
    console.log('[AUTO-SEND] High confidence, sending immediately...');
    await sendViaUpwork(jobPost, proposal);
    await logSent(jobPost, proposal, 'auto', score);
    await sendToTelegram(`✅ Auto-sent proposal for "${jobPost.title}" (${score}% confidence)`);

  } else if (score >= MANUAL_THRESHOLD) {
    // Request approval
    console.log('[APPROVAL] Medium confidence, requesting approval...');
    await requestApproval(jobPost, proposal, score);
    // Approval flow handled in telegram-approval.js

  } else {
    // Auto-reject
    console.log('[AUTO-REJECT] Low confidence, rejecting...');
    await logRejected(jobPost, 'low_confidence', score);
    await sendToTelegram(`⚠️ Auto-rejected "${jobPost.title}" (${score}% confidence)\nReason: ${getRejectReason(breakdown)}`);
  }
}

async function logSent(jobPost, proposal, method, confidence) {
  const entry = {
    timestamp: new Date().toISOString(),
    job: jobPost.title,
    link: jobPost.link,
    method,
    confidence,
    proposal_preview: proposal.slice(0, 100)
  };

  await fs.appendFile(
    'citizens/emma/sent-proposals.log',
    JSON.stringify(entry) + '\n'
  );
}

async function logRejected(jobPost, reason, confidence) {
  const entry = {
    timestamp: new Date().toISOString(),
    job: jobPost.title,
    link: jobPost.link,
    reason,
    confidence
  };

  await fs.appendFile(
    'citizens/emma/rejected-leads.log',
    JSON.stringify(entry) + '\n'
  );
}

function getRejectReason(breakdown) {
  const topPenalty = breakdown.penalties.sort((a, b) => a.value - b.value)[0];
  return topPenalty ? topPenalty.reason.replace(/_/g, ' ') : 'unknown';
}
```

**Integration with Feature 4:**

Update `services/emma-rss/evaluator.js`:

```javascript
// In evaluateLead() function:

if (decision === 'GO' && proposal) {
  // Calculate confidence (returns { score, breakdown })
  const confidence = calculateConfidence(jobPost, proposal, urgency);

  // Route based on confidence
  await routeProposal(jobPost, proposal, confidence);
}
```

**Testing:**

```bash
# Test auto-send (high confidence)
# Create test job with:
# - Clear budget ($10K)
# - Simple description (50 words)
# - Verified client (10+ jobs)
# - Proposal mentions "Evidence Sprint"
# - Urgency: 9/10

# Expected: Confidence ≥ 80%, auto-sent

# Test manual approval (medium confidence)
# Create test job with:
# - Vague budget ("negotiable")
# - 3 questions in description
# - New client (0 hires)

# Expected: Confidence 30-79%, Telegram approval request

# Test auto-reject (low confidence)
# Create test job with:
# - Budget $500 (too low)
# - Long description (500 words)
# - 5+ questions
# - New client

# Expected: Confidence < 30%, auto-rejected
```

**Tuning Thresholds:**

After 50+ proposals, analyze accuracy:

```bash
# Count auto-sends that were good/bad
cat citizens/emma/sent-proposals.log | jq 'select(.method == "auto")'

# Calculate precision:
# precision = good_auto_sends / total_auto_sends

# If precision > 95%: Increase threshold to 85% (more aggressive)
# If precision < 85%: Decrease threshold to 75% (more conservative)
```

---

## ROI

**Time Saved:**
- Manual proposal review: 5min per proposal × 20 proposals/day = 100min/day = 8h/week
- With confidence routing: 5min × 20% (low confidence) = 1min/day × 5 days = 5min/week
- Savings: 8h - 5min = 7.9h/week = 32h/month = $3,200/month

**Cost:**
- Development: 6h × $100/h = $600 (logic layer only, reuses Feature 4)
- Running: $0

**Benefit:**
- 80% of proposals auto-sent (zero human time)
- 15% require approval (5min review each)
- 5% auto-rejected (zero human time)
- Human time freed for high-value tasks (client calls, AC drafting)

**Payback:** 6h investment / 32h monthly savings = 0.2 months (immediate ROI)
