# ScopeLock Backend

**Python FastAPI service for event-native citizen automation**

## Overview

The ScopeLock backend powers automation for ScopeLock citizens:

- **Rafael Responder**: Auto-draft responses to Upwork messages
- **Lead Tracker**: Log and analyze Emma's lead evaluations
- **Event Hub**: Centralized pub/sub event system
- **Webhook Receiver**: Handle triggers from Gmail, Telegram, GitHub

**Deployment**: Render Web Service (Python 3.11+, $7/month Starter plan)

## Quick Start

### Local Development

```bash
# 1. Install dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Set environment variables
export ANTHROPIC_API_KEY="sk-ant-..."
export TELEGRAM_BOT_TOKEN="..."
export TELEGRAM_CHAT_ID="..."
export LOG_LEVEL="DEBUG"
export ENVIRONMENT="development"

# 3. Run server
uvicorn app.main:app --reload --port 8000

# 4. Visit docs
open http://localhost:8000/docs
```

### Test Health Check

```bash
curl http://localhost:8000/health
# Expected: { "status": "healthy", "uptime_seconds": 123, ... }
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design.

**Key directories**:
- `app/api/` - HTTP endpoints (webhooks, tracking, events)
- `app/services/` - Business logic (Rafael, Lead Tracker, Event Hub)
- `app/integrations/` - External API clients (Anthropic, Telegram, Upwork)
- `app/data/` - Persistent data (events.jsonl, leads.json, responses.log)

## API Endpoints

### POST /webhook/upwork-response
Receive Gmail webhook when Upwork client responds.

```json
{
  "subject": "New message from John Doe on Upwork",
  "body_html": "<html>...",
  "from_email": "upwork@upwork.com"
}
```

**Response**: `{ "status": "drafted", "confidence": 85, "action": "sent_for_approval" }`

**Events**: `response.detected@1.0`, `response.drafted@1.0`

---

### POST /api/lead/track
Log Emma's lead evaluation.

```json
{
  "platform": "Upwork",
  "title": "Build AI chat widget",
  "budget": "$8,000",
  "decision": "GO",
  "reason": "AI + verified client",
  "urgency": 8,
  "pain": 7
}
```

**Response**: `{ "status": "tracked", "total_evaluated": 15, "go_rate": 60.0 }`

**Events**: `lead.tracked@1.0`

---

### GET /api/events?since=<timestamp>&limit=100
Query event log.

**Response**:
```json
{
  "events": [
    {
      "event": "response.drafted@1.0",
      "timestamp": "2025-11-02T14:23:00Z",
      "payload": { "client": "John Doe", "confidence": 85 }
    }
  ],
  "total": 1
}
```

---

### GET /health
Health check for Render monitoring.

**Response**:
```json
{
  "status": "healthy",
  "uptime_seconds": 3600,
  "services": {
    "anthropic_api": { "status": "connected" },
    "telegram_bot": { "status": "connected" },
    "data_storage": { "status": "connected" }
  }
}
```

## Deployment (Render)

### Setup

1. **Create Render Web Service**:
   - Go to https://dashboard.render.com
   - New → Web Service
   - Connect GitHub repo: `mind-protocol/scopelock`
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Set Environment Variables**:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...
   ENVIRONMENT=production
   LOG_LEVEL=INFO
   DATA_DIR=/var/data
   ```

3. **Add Persistent Disk**:
   - Name: `scopelock-data`
   - Mount path: `/var/data`
   - Size: 1GB

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deploy (~2 minutes)
   - Visit: `https://scopelock-backend.onrender.com/health`

### Auto-Deploy

Render auto-deploys on push to `main` branch when files in `backend/` change.

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=term-missing

# Run specific test file
pytest tests/test_rafael_responder.py -v

# Run integration tests
pytest tests/test_webhooks.py -v
```

## Events

All significant actions emit events to `data/events.jsonl`:

- `response.detected@1.0` - Upwork message received
- `response.drafted@1.0` - Response drafted
- `response.sent@1.0` - Response sent to Upwork
- `response.approval_requested@1.0` - Sent to Telegram for approval
- `lead.tracked@1.0` - Lead evaluation logged
- `failure.emit` - Service error

**Event Structure**:
```json
{
  "event": "response.drafted@1.0",
  "timestamp": "2025-11-02T14:23:00Z",
  "payload": { "client": "John Doe", "confidence": 85 }
}
```

## Monitoring

**Render Dashboard**: View logs, metrics, and deploy history
**Health Endpoint**: `/health` returns service status
**Event Log**: Query `/api/events` for recent activity

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/rafael-improvements

# 2. Make changes
# ... edit app/services/rafael_responder.py

# 3. Run tests
pytest tests/test_rafael_responder.py

# 4. Commit
git add app/services/rafael_responder.py
git commit -m "feat(rafael): improve confidence scoring"

# 5. Push
git push origin feature/rafael-improvements

# 6. Create PR, merge to main
# Render auto-deploys on merge
```

## Next Steps

**Immediate (MVP)**:
1. Implement `app/services/rafael_responder.py`
2. Implement `app/services/lead_tracker.py`
3. Add API routes in `app/api/`
4. Write acceptance tests
5. Deploy to Render

**Future Enhancements**:
- Upwork API integration (auto-send messages)
- Gmail webhook setup (Zapier or Cloud Function)
- Telegram bot approval flow
- Analytics dashboard

## Questions?

- Architecture: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- Automation Spec: See [../docs/automation/SPEC.md](../docs/automation/SPEC.md)
- Issues: Open issue in GitHub repo

---

**Status**: 🚧 Architecture complete, implementation in progress

**Last Updated**: 2025-11-02 by Daniel "The Forge"
