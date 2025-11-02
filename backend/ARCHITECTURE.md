# ScopeLock Backend Architecture

**Version:** 1.0
**Date:** 2025-11-02
**Platform:** Python 3.11+ on Render
**Purpose:** Event-native automation services for ScopeLock citizens

---

## Overview

The ScopeLock backend is a Python FastAPI service that powers citizen automation:
- **Rafael Responder**: Auto-draft responses to Upwork messages
- **Lead Tracker**: Log and analyze Emma's lead evaluations
- **Event Hub**: Publish/subscribe system for citizen coordination
- **Webhook Receiver**: Handle external triggers (Gmail, Telegram, GitHub)

**Deployment**: Single Render Web Service with background workers for async tasks.

---

## Design Principles

### 1. Event-Native
Every significant action emits an event with structured payload:
```python
{
  "event": "response.drafted@1.0",
  "timestamp": "2025-11-02T14:23:00Z",
  "payload": {
    "client": "John Doe",
    "confidence": 85,
    "draft_text": "..."
  }
}
```

### 2. Fail-Loud
All errors log to structured logs and emit `failure.emit` events:
```python
try:
    result = draft_response(message)
except Exception as e:
    logger.error(f"[rafael_responder] Failed to draft: {e}", exc_info=True)
    emit_event("failure.emit", {
        "code_location": "rafael_responder:draft_response",
        "reason": str(e)
    })
    raise
```

### 3. Contract-First
All endpoints and functions have explicit input/output contracts verified at runtime:
```python
class ResponseDraftRequest(BaseModel):
    client: str
    message: str
    job_title: str
    job_link: Optional[str] = None

class ResponseDraftResult(BaseModel):
    draft_text: str
    confidence: int  # 0-100
    reasoning: str
```

### 4. Testable
All services have acceptance tests that verify contracts:
```python
def test_rafael_drafts_response():
    """V1: Rafael can draft a response to client question"""
    result = draft_response(
        client="Test Client",
        message="Can we schedule a call?",
        job_title="Build AI chat widget"
    )
    assert result.confidence > 50
    assert "AC.md" in result.draft_text or "Evidence Sprint" in result.draft_text
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    External Triggers                         │
│  [Gmail] [Telegram] [GitHub Webhooks] [Manual Scripts]      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Web Service (Render)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             API Endpoints                             │  │
│  │  POST /webhook/upwork-response                       │  │
│  │  POST /webhook/telegram-callback                     │  │
│  │  POST /api/lead/track                                │  │
│  │  GET  /api/events?since=timestamp                    │  │
│  │  GET  /health                                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Service Layer                                │  │
│  │  - rafael_responder.py (draft responses)             │  │
│  │  - lead_tracker.py (log & analyze leads)             │  │
│  │  - event_hub.py (pub/sub event bus)                  │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Integration Layer                              │  │
│  │  - anthropic_client.py (Claude API)                  │  │
│  │  - telegram_client.py (Bot API)                      │  │
│  │  - upwork_client.py (Send messages)                  │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Data Layer                                   │  │
│  │  - events.jsonl (append-only event log)              │  │
│  │  - leads.json (newline-delimited JSON)               │  │
│  │  - responses.log (Rafael sent messages)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  [Anthropic API] [Telegram Bot API] [Upwork API]           │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
backend/
├── ARCHITECTURE.md           # This file
├── README.md                 # Quick start guide
├── requirements.txt          # Python dependencies
├── pyproject.toml           # Poetry config (optional)
├── render.yaml              # Render deployment config
│
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment variables, settings
│   ├── contracts.py         # Pydantic models for all requests/responses
│   │
│   ├── api/                 # HTTP endpoints
│   │   ├── __init__.py
│   │   ├── webhooks.py      # POST /webhook/* endpoints
│   │   ├── tracking.py      # POST /api/lead/track
│   │   ├── events.py        # GET /api/events
│   │   └── health.py        # GET /health
│   │
│   ├── services/            # Business logic
│   │   ├── __init__.py
│   │   ├── rafael_responder.py   # Draft Upwork responses
│   │   ├── lead_tracker.py       # Track Emma evaluations
│   │   ├── event_hub.py          # Event pub/sub
│   │   └── email_parser.py       # Parse Gmail webhooks
│   │
│   ├── integrations/        # External API clients
│   │   ├── __init__.py
│   │   ├── anthropic_client.py   # Claude API wrapper
│   │   ├── telegram_client.py    # Telegram Bot API
│   │   └── upwork_client.py      # Upwork messaging (future)
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── logger.py        # Structured logging
│   │   └── file_storage.py  # JSONL append helpers
│   │
│   └── data/                # Data files (mounted volume on Render)
│       ├── events.jsonl
│       ├── leads.json
│       └── responses.log
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_rafael_responder.py
│   ├── test_lead_tracker.py
│   ├── test_event_hub.py
│   └── test_webhooks.py
│
└── scripts/
    ├── track_lead.py        # CLI tool for manual tracking
    └── send_test_webhook.py # Local testing
```

---

## Core Services

### 1. Rafael Responder

**Purpose**: Auto-draft responses to Upwork messages via Gmail webhook.

**Flow**:
```
Gmail → Webhook → Parse email → Load context → Call Claude API
  → Calculate confidence → Route (auto-send OR Telegram approval)
```

**Contract**:
```python
# Input
class UpworkResponseWebhook(BaseModel):
    subject: str
    body_html: str
    from_email: str
    received_at: datetime

# Output
class ResponseDraft(BaseModel):
    client: str
    job_title: str
    draft_text: str
    confidence: int  # 0-100
    reasoning: str
    timestamp: datetime
```

**Confidence Routing**:
- `>= 80%`: Auto-send via Upwork API + notify Telegram
- `< 80%`: Send to Telegram for approval with buttons

**File**: `app/services/rafael_responder.py`

---

### 2. Lead Tracker

**Purpose**: Log Emma's lead evaluations and regenerate analytics.

**Flow**:
```
Manual/Script → POST /api/lead/track → Append to leads.json
  → Emit lead.tracked@1.0 → Regenerate leads-tracker.md
```

**Contract**:
```python
class LeadEvaluation(BaseModel):
    platform: str  # "Upwork", "Contra", etc.
    title: str
    budget: str
    decision: Literal["GO", "NO-GO"]
    reason: str
    urgency: Optional[int] = None  # 1-10
    pain: Optional[int] = None     # 1-10
    link: Optional[str] = None
    sent: bool = False

class LeadStats(BaseModel):
    total_evaluated: int
    go_count: int
    nogo_count: int
    sent_count: int
    go_rate: float  # percentage
```

**File**: `app/services/lead_tracker.py`

---

### 3. Event Hub

**Purpose**: Centralized event publishing and querying.

**Events Published**:
- `response.drafted@1.0` - Rafael drafts response
- `response.sent@1.0` - Response sent to Upwork
- `lead.tracked@1.0` - Lead evaluation logged
- `failure.emit` - Any service error

**Contract**:
```python
class Event(BaseModel):
    event: str  # e.g., "response.drafted@1.0"
    timestamp: datetime
    payload: dict

# Append-only log
def emit_event(event: str, payload: dict):
    entry = Event(
        event=event,
        timestamp=datetime.utcnow(),
        payload=payload
    )
    append_to_jsonl("data/events.jsonl", entry.dict())
```

**File**: `app/services/event_hub.py`

---

## API Endpoints

### POST /webhook/upwork-response

**Purpose**: Receive Gmail webhook when client responds on Upwork.

**Request**:
```json
{
  "subject": "New message from John Doe on Upwork",
  "body_html": "<html>...",
  "from_email": "upwork@upwork.com",
  "received_at": "2025-11-02T14:23:00Z"
}
```

**Response**:
```json
{
  "status": "drafted",
  "confidence": 85,
  "action": "sent_for_approval"
}
```

**Events Emitted**:
- `response.detected@1.0`
- `response.drafted@1.0`
- `response.sent@1.0` OR `response.approval_requested@1.0`

---

### POST /webhook/telegram-callback

**Purpose**: Handle Telegram bot button callbacks (Approve/Edit/Reject).

**Request**:
```json
{
  "callback_id": "abc123",
  "action": "approve",
  "draft_id": "xyz789"
}
```

**Response**:
```json
{
  "status": "sent",
  "message": "Response sent to Upwork"
}
```

**Events Emitted**:
- `response.approved@1.0`
- `response.sent@1.0`

---

### POST /api/lead/track

**Purpose**: Log Emma's lead evaluation.

**Request**:
```json
{
  "platform": "Upwork",
  "title": "Build AI chat widget",
  "budget": "$8,000",
  "decision": "GO",
  "reason": "AI + verified client + clear budget",
  "urgency": 8,
  "pain": 7,
  "link": "https://upwork.com/jobs/~abc123"
}
```

**Response**:
```json
{
  "status": "tracked",
  "total_evaluated": 15,
  "go_rate": 60.0
}
```

**Events Emitted**:
- `lead.tracked@1.0`

---

### GET /api/events

**Purpose**: Query event log for debugging/analytics.

**Query Params**:
- `since`: ISO timestamp (default: last 24h)
- `event`: Filter by event name (e.g., `response.drafted@1.0`)
- `limit`: Max results (default: 100)

**Response**:
```json
{
  "events": [
    {
      "event": "response.drafted@1.0",
      "timestamp": "2025-11-02T14:23:00Z",
      "payload": {
        "client": "John Doe",
        "confidence": 85
      }
    }
  ],
  "total": 1
}
```

---

### GET /health

**Purpose**: Health check for Render monitoring.

**Response**:
```json
{
  "status": "healthy",
  "uptime_seconds": 3600,
  "services": {
    "anthropic_api": "connected",
    "telegram_bot": "connected",
    "data_storage": "writable"
  }
}
```

---

## Integrations

### 1. Anthropic Claude API

**Purpose**: Draft responses using Rafael's system prompt.

**Client**: `app/integrations/anthropic_client.py`

```python
async def draft_response(
    message: str,
    context: dict
) -> str:
    """
    Call Claude API with Rafael's system prompt + client message.

    Returns: Draft response text
    """
    system_prompt = load_file("/citizens/rafael/CLAUDE.md")

    response = await anthropic.messages.create(
        model="claude-sonnet-4",
        max_tokens=1024,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": f"""
            A client responded to our proposal.

            Job: {context['job_title']}
            Client: {context['client']}
            Message: {message}

            Draft a response following ScopeLock principles.
            """
        }]
    )

    return response.content[0].text
```

---

### 2. Telegram Bot API

**Purpose**: Send notifications and handle approval buttons.

**Client**: `app/integrations/telegram_client.py`

```python
async def send_approval_request(
    draft: ResponseDraft
) -> str:
    """
    Send draft to Nicolas with approval buttons.

    Returns: Message ID for tracking callback
    """
    bot = TelegramBot(token=config.TELEGRAM_BOT_TOKEN)

    message = f"""
🔔 NEW RESPONSE: {draft.client}
Job: {draft.job_title}
Confidence: {draft.confidence}%

Draft:
{draft.draft_text}

[Approve] [Edit] [Reject]
    """

    result = await bot.send_message(
        chat_id=config.NICOLAS_CHAT_ID,
        text=message,
        reply_markup={
            "inline_keyboard": [[
                {"text": "✅ Approve", "callback_data": f"approve:{draft.id}"},
                {"text": "✏️ Edit", "callback_data": f"edit:{draft.id}"},
                {"text": "❌ Reject", "callback_data": f"reject:{draft.id}"}
            ]]
        }
    )

    return result.message_id
```

---

### 3. Upwork API (Future)

**Purpose**: Send messages via Upwork API.

**Status**: Requires Upwork OAuth + API key. For MVP, use manual send + log.

**Client**: `app/integrations/upwork_client.py`

```python
async def send_message(
    job_link: str,
    message: str
) -> bool:
    """
    Send message via Upwork API.

    For MVP: Log to responses.log, return True
    Future: Implement actual Upwork API call
    """
    # TODO: Implement Upwork OAuth + message API
    log_response(job_link, message)
    return True
```

---

## Data Storage

### Append-Only Event Log

**File**: `app/data/events.jsonl`

**Format**: Newline-delimited JSON (one event per line)

```json
{"event":"response.drafted@1.0","timestamp":"2025-11-02T14:23:00Z","payload":{"client":"John Doe","confidence":85}}
{"event":"lead.tracked@1.0","timestamp":"2025-11-02T14:25:00Z","payload":{"decision":"GO","budget":"$8K"}}
```

**Helper**:
```python
def append_to_jsonl(filepath: str, data: dict):
    with open(filepath, "a") as f:
        f.write(json.dumps(data) + "\n")
```

---

### Lead Evaluations

**File**: `app/data/leads.json`

**Format**: Newline-delimited JSON

```json
{"timestamp":"2025-11-02T14:00:00Z","platform":"Upwork","title":"Build AI chat","budget":"$8K","decision":"GO","reason":"AI + verified client","urgency":8,"pain":7,"sent":false}
```

---

### Response Log

**File**: `app/data/responses.log`

**Format**: Plain text log

```
2025-11-02T14:30:00Z | Client: John Doe | Job: AI chat widget | Sent: Yes
Draft: "Thanks for your interest..."
---
```

---

## Deployment (Render)

### render.yaml

```yaml
services:
  - type: web
    name: scopelock-backend
    env: python
    plan: starter  # $7/month
    region: oregon
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: ANTHROPIC_API_KEY
        sync: false  # Set in Render dashboard
      - key: TELEGRAM_BOT_TOKEN
        sync: false
      - key: TELEGRAM_CHAT_ID
        sync: false
      - key: PYTHON_VERSION
        value: "3.11"
    disk:
      name: data
      mountPath: /app/data
      sizeGB: 1
```

---

### Environment Variables

**Required**:
- `ANTHROPIC_API_KEY` - Claude API key
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_CHAT_ID` - Nicolas's Telegram chat ID
- `UPWORK_API_KEY` - (Future) Upwork API credentials

**Optional**:
- `LOG_LEVEL` - `DEBUG`, `INFO`, `WARNING` (default: `INFO`)
- `DATA_DIR` - Path to data files (default: `/app/data`)

---

## Testing Strategy

### Unit Tests

```python
# tests/test_rafael_responder.py
def test_calculate_confidence():
    """Confidence scoring works correctly"""
    assert calculate_confidence(
        message="Can we schedule a call?",
        draft="Yes, here's my calendar link..."
    ) > 80  # Simple question, clear answer

    assert calculate_confidence(
        message="What's your budget for this?",
        draft="..."
    ) < 60  # Price negotiation, needs human
```

### Integration Tests

```python
# tests/test_webhooks.py
@pytest.mark.asyncio
async def test_upwork_webhook_end_to_end():
    """Full flow: webhook → parse → draft → Telegram"""
    response = await client.post("/webhook/upwork-response", json={
        "subject": "New message from Test Client on Upwork",
        "body_html": "<html>Can we schedule a call?</html>",
        "from_email": "upwork@upwork.com"
    })

    assert response.status_code == 200
    assert response.json()["status"] == "drafted"

    # Verify event was emitted
    events = read_events()
    assert any(e["event"] == "response.drafted@1.0" for e in events)
```

### Acceptance Tests (Manual)

```bash
# Test 1: Send test email to trigger Rafael
curl -X POST https://scopelock-backend.onrender.com/webhook/upwork-response \
  -H "Content-Type: application/json" \
  -d @test_webhook_data.json

# Expected: Telegram message within 10 seconds

# Test 2: Track lead
curl -X POST https://scopelock-backend.onrender.com/api/lead/track \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "Upwork",
    "title": "Test Job",
    "budget": "$5K",
    "decision": "GO",
    "reason": "Test"
  }'

# Expected: HTTP 200, leads.json updated
```

---

## Next Steps

1. **Implement Core Services** (3-5 hours)
   - `rafael_responder.py` with Claude API integration
   - `lead_tracker.py` with JSON log + stats
   - `event_hub.py` with JSONL append

2. **Build API Endpoints** (2-3 hours)
   - FastAPI routes for webhooks
   - Request validation with Pydantic
   - Error handling + logging

3. **Deploy to Render** (1 hour)
   - Create Render service from dashboard
   - Set environment variables
   - Test with curl

4. **Set Up Integrations** (2 hours)
   - Create Telegram bot via @BotFather
   - Configure Gmail filter + webhook (Zapier/IFTTT)
   - Test end-to-end flow

5. **Write Acceptance Tests** (2 hours)
   - Pytest suite for all services
   - Integration tests for webhooks
   - Load Rafael's system prompt and verify output

**Total Estimate**: 10-13 hours to full MVP

---

## Questions for User

1. **Render Plan**: Starter ($7/month) sufficient? Or need Pro for more CPU/memory?
2. **Upwork API**: Do we have access yet? Or MVP with manual send + log?
3. **Telegram Bot**: Should I create the bot or do you have one?
4. **Gmail Webhook**: Prefer Zapier (easier) or Google Cloud Function (more control)?

---

## Success Criteria

**MVP Complete When**:
- ✅ Rafael can draft responses to Upwork messages (confidence scoring works)
- ✅ Drafts appear in Telegram with approval buttons
- ✅ Lead tracking logs to JSON and regenerates markdown
- ✅ All events logged to events.jsonl
- ✅ Deployed to Render with health check passing
- ✅ Acceptance tests green
