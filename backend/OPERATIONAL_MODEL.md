# ScopeLock Backend - Operational Model

**Version:** 1.0
**Date:** 2025-11-02
**Purpose:** Document how automation actually works with `claude` CLI

---

## Critical: How Automation Actually Works

**All citizen invocations use Claude Code CLI, not direct API calls:**

```bash
claude --print "message" --continue
```

This changes the architecture from:
```
❌ Webhook → FastAPI → Anthropic API → Response
```

To:
```
✅ Webhook → Trigger script → `claude` CLI → Citizen session → Backend API
```

---

## Operational Flow: Rafael Responder

### Step 1: Gmail Notification
```
Client responds on Upwork → Gmail receives email → Webhook triggered
```

### Step 2: Webhook Trigger (with auth)
```bash
# Zapier/IFTTT/Cloud Function receives Gmail webhook
# Verifies HMAC signature
# Extracts client message

# Triggers Rafael via claude CLI:
cd /home/mind-protocol/scopelock
claude --print "New Upwork response from John Doe: Can we schedule a call?" --continue
```

**Key point**: This starts a Claude Code session with Rafael's system prompt (`citizens/rafael/CLAUDE.md`)

### Step 3: Rafael (Claude Code Session)
```
Rafael citizen wakes up with context:
- System prompt: citizens/rafael/CLAUDE.md
- Message: "New Upwork response from John Doe: Can we schedule a call?"
- Context: Can read citizens/SYNC.md, emma/proposals/, etc.

Rafael actions:
1. Reads client message
2. Finds original proposal (if exists)
3. Drafts response using his principles
4. Calls backend API: POST /api/draft/create
5. Backend stores draft in PostgreSQL
6. Backend sends Telegram notification with approval buttons
```

### Step 4: Draft Approval Flow
```
Nicolas clicks [Approve] in Telegram
  ↓
Telegram webhook → Backend API: POST /webhook/telegram-callback
  ↓
Backend retrieves draft from PostgreSQL
  ↓
Backend triggers send (via Upwork API or manual copy/paste)
  ↓
Backend logs event: response.sent@1.0
```

---

## Backend Role (Simplified)

**Backend is NOT**:
- ❌ Calling Anthropic API directly
- ❌ Running citizen logic
- ❌ Handling Claude sessions

**Backend IS**:
- ✅ State store (PostgreSQL for drafts, events, leads)
- ✅ API for Claude Code sessions to read/write state
- ✅ Webhook receiver with HMAC auth
- ✅ Telegram bot for notifications & approvals

---

## Backend API Design

### POST /api/draft/create
**Called by**: Rafael (Claude Code session)

**Request**:
```json
{
  "client": "John Doe",
  "job_title": "Build AI chat widget",
  "message": "Can we schedule a call?",
  "draft_text": "Yes, I have availability...",
  "confidence": 85,
  "context": {
    "job_link": "https://upwork.com/jobs/~abc123",
    "original_proposal": "..."
  }
}
```

**Response**:
```json
{
  "draft_id": "uuid-123",
  "status": "pending_approval",
  "telegram_sent": true
}
```

**Backend Actions**:
1. Insert draft into PostgreSQL `drafts` table
2. Send Telegram notification with approval buttons
3. Emit event: `draft.created@1.0`
4. Return draft_id

---

### POST /webhook/telegram-callback
**Called by**: Telegram Bot API (when Nicolas clicks button)

**Request**:
```json
{
  "callback_query_id": "abc123",
  "callback_data": "approve:uuid-123"
}
```

**Response**:
```json
{
  "status": "approved",
  "message": "Response approved. Ready to send."
}
```

**Backend Actions**:
1. Parse callback_data → action + draft_id
2. Retrieve draft from PostgreSQL
3. Update status to "approved"
4. Log to `responses.log` or trigger send
5. Emit event: `draft.approved@1.0`

---

### POST /api/event/log
**Called by**: Any citizen (Claude Code session)

**Request**:
```json
{
  "event": "lead.tracked@1.0",
  "payload": {
    "platform": "Upwork",
    "decision": "GO",
    "budget": "$8K"
  }
}
```

**Response**:
```json
{
  "event_id": 123,
  "timestamp": "2025-11-02T14:23:00Z"
}
```

**Backend Actions**:
1. Insert into PostgreSQL `events` table
2. Return event_id

---

### GET /api/draft/:id
**Called by**: Any citizen (for context)

**Response**:
```json
{
  "id": "uuid-123",
  "client": "John Doe",
  "draft_text": "...",
  "status": "pending",
  "created_at": "2025-11-02T14:23:00Z"
}
```

---

### GET /api/events?since=timestamp
**Called by**: Any citizen (for debugging/analysis)

**Response**:
```json
{
  "events": [
    {
      "id": 123,
      "event": "draft.created@1.0",
      "timestamp": "2025-11-02T14:23:00Z",
      "payload": {...}
    }
  ]
}
```

---

## Webhook Authentication

**Gmail Webhook** (Zapier/Cloud Function):
```python
import hmac
import hashlib

def verify_gmail_webhook(request):
    """Verify webhook is from Gmail (via Zapier/GCP)"""
    # Zapier provides X-Zapier-Signature
    # Google Cloud Function provides signature in header

    signature = request.headers.get('X-Webhook-Signature')
    body = request.body
    secret = os.getenv('WEBHOOK_SECRET')

    expected = hmac.new(
        secret.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected):
        raise ValueError("Invalid webhook signature")
```

**Telegram Webhook** (built-in verification):
```python
from telegram import Update

def verify_telegram_update(update_json, bot_token):
    """Verify update is from Telegram"""
    # Telegram Bot API provides built-in verification
    # via secret token in webhook URL

    # Alternative: Check update.update_id is sequential
    # and recent (< 5 minutes old)
```

---

## Citizen Invocation Patterns

### Pattern 1: Webhook → Claude CLI
```bash
# Zapier/Cloud Function receives webhook
# Calls trigger script:

#!/bin/bash
# scripts/trigger-rafael.sh

# Verify webhook auth first
if ! verify_signature "$WEBHOOK_SIGNATURE" "$WEBHOOK_BODY"; then
  echo "❌ Invalid signature"
  exit 1
fi

# Extract message
CLIENT=$(echo "$WEBHOOK_BODY" | jq -r '.client')
MESSAGE=$(echo "$WEBHOOK_BODY" | jq -r '.message')

# Trigger Rafael via claude CLI
cd /home/mind-protocol/scopelock
claude --print "New Upwork response from $CLIENT: $MESSAGE" --continue

# Claude Code will:
# 1. Load citizens/rafael/CLAUDE.md (system prompt)
# 2. Rafael drafts response
# 3. Rafael calls POST /api/draft/create
# 4. Backend sends Telegram notification
```

---

### Pattern 2: Manual Invocation
```bash
# Nicolas manually triggers Emma to evaluate a job post

cd /home/mind-protocol/scopelock
claude --print "Evaluate this Upwork post: [paste job description]" --continue

# Claude Code will:
# 1. Load citizens/emma/CLAUDE.md
# 2. Emma evaluates and outputs GO/NO-GO
# 3. Emma calls POST /api/lead/track (if configured)
# 4. Backend logs to PostgreSQL
```

---

### Pattern 3: Scheduled Task (Future)
```bash
# Cron job runs daily

#!/bin/bash
# scripts/daily-analytics.sh

cd /home/mind-protocol/scopelock
claude --print "Generate daily analytics report" --continue

# Claude Code will:
# 1. Query backend: GET /api/events?since=yesterday
# 2. Query backend: GET /api/leads?date=yesterday
# 3. Generate markdown report
# 4. Post to SYNC.md or send to Telegram
```

---

## Implementation Checklist

### Backend (FastAPI)
- ✅ PostgreSQL models (drafts, events, leads)
- ✅ Database connection (`app/database.py`)
- ⏭️ API endpoints:
  - POST /api/draft/create
  - GET /api/draft/:id
  - POST /api/event/log
  - GET /api/events
  - POST /webhook/telegram-callback
- ⏭️ Webhook auth (HMAC verification)
- ⏭️ Telegram bot integration

### Trigger Scripts
- ⏭️ `scripts/trigger-rafael.sh` - Webhook → claude CLI
- ⏭️ `scripts/trigger-emma.sh` - Manual lead evaluation
- ⏭️ Webhook signature verification

### Zapier/Cloud Function
- ⏭️ Gmail → Webhook setup
- ⏭️ Call trigger-rafael.sh with message
- ⏭️ HMAC signature in headers

### Telegram Bot
- ⏭️ Create bot via @BotFather
- ⏭️ Set webhook URL: POST /webhook/telegram-callback
- ⏭️ Approval button callbacks

---

## Deployment Notes

**Render Services**:
1. PostgreSQL (free tier)
2. Web Service (FastAPI backend)
3. **No background workers needed** - Claude CLI is the "worker"

**Environment Variables**:
```bash
# Backend
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
WEBHOOK_SECRET=...

# Local (for claude CLI)
BACKEND_API_URL=https://scopelock-backend.onrender.com
```

**Trigger Scripts** (run on local machine or Cloud Function):
- Must have access to `claude` CLI
- Must have scopelock repo checked out
- Must have BACKEND_API_URL set

---

## Cost Estimate

**Render**:
- PostgreSQL: Free (90 days), then $7/month
- Backend Web Service: $7/month (Starter)
- **Total**: $7-14/month

**Zapier/Cloud Function**:
- Zapier Free: 100 tasks/month (enough for MVP)
- Google Cloud Function: $0 (free tier covers 2M invocations/month)

**Anthropic API**:
- Via Claude Code subscription (already paid)
- No additional API charges

---

## Security Notes

1. **Webhook HMAC**: Required to prevent spam
2. **Telegram secret token**: Use webhook secret_token parameter
3. **Backend API**: No public endpoints without auth
4. **Draft isolation**: Each draft has UUID, not guessable

---

## Next Steps

1. Implement backend API endpoints (4-6 hours)
2. Create trigger scripts with webhook auth (2 hours)
3. Set up Telegram bot (1 hour)
4. Deploy backend to Render (30 minutes)
5. Configure Zapier Gmail → trigger-rafael.sh (1 hour)
6. Test end-to-end with real Upwork message (30 minutes)

**Total**: ~9-11 hours to production

---

**Key Insight**: Backend is a **state store + API**, not an orchestrator. Citizens run as Claude Code sessions triggered by `claude --print --continue`.
