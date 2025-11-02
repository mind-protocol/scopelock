# ScopeLock Backend Architecture v2

**Version:** 2.0 (Operational Model)
**Date:** 2025-11-02
**Platform:** Python 3.11+ FastAPI on Render + PostgreSQL
**Key Change:** Backend is state store + API, not orchestrator

---

## Critical Operational Model

**Citizens run as Claude Code sessions via CLI, not API calls:**

```bash
# How automation actually works:
webhook → trigger script → claude --print "message" --continue
```

**Backend role**: State store (PostgreSQL) + REST API for Claude Code sessions

---

## System Architecture (Updated)

```
┌─────────────────────────────────────────────────────────────┐
│                    External Triggers                         │
│         [Gmail] [Manual] [Scheduled Tasks]                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │   Webhook/Trigger Script  │
         │   - Verify HMAC signature │
         │   - Extract message       │
         │   - Call claude CLI       │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │   Claude Code Session     │
         │   (Rafael/Emma/Daniel)    │
         │   - Load system prompt    │
         │   - Process message       │
         │   - Call backend API      │
         └───────────┬───────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           FastAPI Backend (State Store + API)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          REST API Endpoints                           │  │
│  │  POST /api/draft/create      (store draft)          │  │
│  │  GET  /api/draft/:id         (retrieve draft)       │  │
│  │  POST /api/event/log         (log event)            │  │
│  │  GET  /api/events            (query events)         │  │
│  │  POST /webhook/telegram      (approval buttons)     │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                           │  │
│  │  - events (append-only log with indexes)            │  │
│  │  - drafts (pending approvals, persistent)           │  │
│  │  - leads (Emma evaluations)                         │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Integration: Telegram Bot                        │  │
│  │  - Send notifications with approval buttons          │  │
│  │  - Handle callback queries                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Example Flow: Rafael Responds to Upwork Message

### Step 1: Gmail Webhook Trigger
```
Client responds on Upwork
  ↓
Gmail receives email
  ↓
Zapier webhook triggered
```

### Step 2: Trigger Script (with auth)
```bash
#!/bin/bash
# scripts/trigger-rafael.sh

# Verify HMAC signature
SIGNATURE=$(echo -n "$WEBHOOK_BODY" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET")
if [ "$SIGNATURE" != "$PROVIDED_SIGNATURE" ]; then
  echo "❌ Invalid signature"; exit 1
fi

# Extract message
CLIENT=$(echo "$WEBHOOK_BODY" | jq -r '.client')
MESSAGE=$(echo "$WEBHOOK_BODY" | jq -r '.message')

# Trigger Rafael via claude CLI
cd /home/mind-protocol/scopelock
export BACKEND_API_URL="https://scopelock-backend.onrender.com"

claude --print "New Upwork response from $CLIENT: $MESSAGE

Job: Build AI chat widget
Link: https://upwork.com/jobs/~abc123

Draft a response following ScopeLock principles and call POST /api/draft/create when ready." \
  --continue
```

### Step 3: Rafael (Claude Code Session)
```
Claude Code loads:
- System prompt: citizens/rafael/CLAUDE.md
- Context: citizens/SYNC.md, emma/proposals/

Rafael:
1. Reads client message
2. Finds original proposal (if exists)
3. Drafts response using ScopeLock principles
4. Calls backend API:

   curl -X POST $BACKEND_API_URL/api/draft/create \
     -H "Content-Type: application/json" \
     -d '{
       "client": "John Doe",
       "job_title": "Build AI chat widget",
       "message": "Can we schedule a call?",
       "draft_text": "Yes, I have availability this week...",
       "confidence": 85
     }'

5. Backend stores draft in PostgreSQL
6. Backend sends Telegram notification with [Approve] [Edit] [Reject] buttons
```

### Step 4: Approval Flow
```
Nicolas clicks [Approve] in Telegram
  ↓
Telegram webhook → POST /webhook/telegram-callback
  ↓
Backend retrieves draft from PostgreSQL
  ↓
Backend updates status to "approved"
  ↓
Backend logs event: response.approved@1.0
  ↓
Backend returns success (Rafael can now send via Upwork API or manual copy)
```

---

## API Endpoints

### POST /api/draft/create
**Purpose**: Store draft created by Rafael

**Request**:
```json
{
  "client": "John Doe",
  "job_title": "Build AI chat widget",
  "message": "Can we schedule a call?",
  "draft_text": "Yes, I have availability...",
  "confidence": 85,
  "context": {
    "job_link": "https://upwork.com/jobs/~abc123"
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

**Database**: Insert into `drafts` table, emit `draft.created@1.0`

---

### GET /api/draft/:id
**Purpose**: Retrieve draft by ID

**Response**:
```json
{
  "id": "uuid-123",
  "client": "John Doe",
  "draft_text": "...",
  "confidence": 85,
  "status": "pending",
  "created_at": "2025-11-02T14:23:00Z"
}
```

---

### POST /api/event/log
**Purpose**: Log event to append-only audit trail

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

**Database**: Insert into `events` table with timestamp index

---

### GET /api/events?since=timestamp&event=name&limit=100
**Purpose**: Query event log

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
  ],
  "total": 1
}
```

---

### POST /webhook/telegram-callback
**Purpose**: Handle Telegram approval button clicks

**Request** (from Telegram):
```json
{
  "update_id": 123456,
  "callback_query": {
    "id": "abc123",
    "data": "approve:uuid-123"
  }
}
```

**Response**:
```json
{
  "status": "approved",
  "message": "Response approved"
}
```

**Actions**:
1. Parse callback_data → action + draft_id
2. Retrieve draft from PostgreSQL
3. Update status to "approved"
4. Emit event: `draft.approved@1.0`
5. Notify Telegram: "✅ Approved"

---

## Database Models

### `events` Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    payload JSONB NOT NULL
);

CREATE INDEX idx_events_event ON events(event);
CREATE INDEX idx_events_timestamp ON events(timestamp DESC);
```

### `drafts` Table
```sql
CREATE TABLE drafts (
    id VARCHAR(36) PRIMARY KEY,  -- UUID
    client VARCHAR(200) NOT NULL,
    job_title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    draft_text TEXT NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, approved, rejected
    telegram_message_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drafts_status ON drafts(status);
CREATE INDEX idx_drafts_created ON drafts(created_at DESC);
```

### `leads` Table
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    budget VARCHAR(100) NOT NULL,
    decision VARCHAR(10) NOT NULL,  -- GO, NO-GO
    reason TEXT NOT NULL,
    urgency INTEGER CHECK (urgency >= 1 AND urgency <= 10),
    pain INTEGER CHECK (pain >= 1 AND pain <= 10),
    link VARCHAR(500),
    sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_decision ON leads(decision);
CREATE INDEX idx_leads_platform ON leads(platform);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

---

## Webhook Authentication

**HMAC Verification** (required for all webhooks):

```python
import hmac
import hashlib
from fastapi import HTTPException, Header

def verify_webhook_signature(
    body: bytes,
    signature: str = Header(..., alias="X-Webhook-Signature")
):
    """Verify webhook HMAC signature"""
    secret = settings.webhook_secret.encode()
    expected = hmac.new(secret, body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="Invalid signature")
```

**Usage in endpoint**:
```python
@app.post("/webhook/upwork-response")
async def upwork_webhook(
    request: Request,
    signature: str = Header(..., alias="X-Webhook-Signature")
):
    body = await request.body()
    verify_webhook_signature(body, signature)
    # ... process webhook
```

---

## Deployment

### Render Services (via render.yaml)

1. **PostgreSQL** (free tier, then $7/month)
   - Database: scopelock
   - Auto-linked to backend via DATABASE_URL

2. **FastAPI Backend** ($7/month Starter)
   - Auto-deploy on push to main
   - Health check: /health
   - Logs viewable in dashboard

### Environment Variables (Set in Render Dashboard)

```bash
# API Keys
TELEGRAM_BOT_TOKEN=...         # From @BotFather
TELEGRAM_CHAT_ID=...           # Nicolas's chat ID
WEBHOOK_SECRET=...             # Generate: openssl rand -hex 32

# Database (auto-set by Render)
DATABASE_URL=postgresql://...

# App Config
ENVIRONMENT=production
LOG_LEVEL=INFO
```

### Trigger Scripts (Run on local or Cloud Function)

```bash
# Set on machine running trigger scripts
BACKEND_API_URL=https://scopelock-backend.onrender.com
WEBHOOK_SECRET=...  # Same as backend
```

---

## Implementation Checklist

### Backend API (8-10 hours)
- ✅ PostgreSQL models defined
- ✅ Database connection
- ⏭️ API endpoints:
  - POST /api/draft/create (2h)
  - GET /api/draft/:id (30m)
  - POST /api/event/log (1h)
  - GET /api/events (1h)
  - POST /webhook/telegram-callback (2h)
- ⏭️ HMAC webhook auth (1h)
- ⏭️ Telegram bot integration (2h)

### Trigger Scripts (3-4 hours)
- ⏭️ scripts/trigger-rafael.sh (1h)
- ⏭️ scripts/trigger-emma.sh (30m)
- ⏭️ Webhook signature generation (1h)
- ⏭️ Testing with mock data (1h)

### External Setup (2-3 hours)
- ⏭️ Telegram bot creation (@BotFather) (30m)
- ⏭️ Zapier Gmail webhook (1h)
- ⏭️ Test end-to-end with real message (1h)

**Total**: 13-17 hours to production

---

## Key Differences from v1

| Aspect | v1 (Original) | v2 (Operational) |
|--------|---------------|------------------|
| **Citizen execution** | Backend calls Claude API | `claude --print --continue` |
| **Backend role** | Orchestrator | State store + API |
| **System prompts** | Loaded by backend | Loaded by Claude Code |
| **Complexity** | High (manage sessions) | Low (just store state) |
| **API calls** | Backend → Anthropic | Claude Code → Backend |
| **Cost** | Anthropic API charges | Included in Claude Code subscription |

---

## Benefits of v2

1. **Simpler backend** - Just REST API + database
2. **No API management** - Claude Code handles sessions
3. **System prompts** - Already defined in citizens/*.md
4. **Cost** - No additional Anthropic charges
5. **Flexibility** - Easy to trigger citizens manually or via cron
6. **Debugging** - Can run `claude --print` locally to test

---

## Next Steps

1. Implement backend API endpoints (POST /api/draft/create first)
2. Create trigger-rafael.sh with HMAC verification
3. Set up Telegram bot
4. Deploy to Render
5. Configure Zapier webhook
6. Test with real Upwork message

---

**Architecture v2 is production-ready with PostgreSQL, webhook auth, and correct operational model.**
