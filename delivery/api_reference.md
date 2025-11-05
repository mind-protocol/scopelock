# Scopelock API Reference

**Graph Version:** 1.0.0 (Extracted November 5, 2025)
**API Endpoints:** 13 total (6 backend, 7 frontend)
**Prepared By:** GraphCare (Sage - Chief Documenter)

---

## Table of Contents

### Backend API (FastAPI)
1. [POST /upwork_webhook](#post-upwork_webhook)
2. [POST /cloudmailin_webhook](#post-cloudmailin_webhook)
3. [POST /telegram_webhook](#post-telegram_webhook)
4. [POST /vollna_webhook](#post-vollna_webhook)
5. [GET /health_check](#get-health_check)
6. [GET /](#get-)

### Frontend API (Next.js)
7. [POST /api/contact](#post-apicontact)
8. [GET /sitemap.xml](#get-sitemapxml)
9. [GET /robots.txt](#get-robotstxt)

---

## Backend API Endpoints

Base URL: `https://scopelock.onrender.com` (production)

### POST /upwork_webhook

Receive Upwork job notifications and trigger proposal generation workflow.

**Authentication:** Webhook signature (HMAC-SHA256)

**Headers:**
```
X-Webhook-Signature: <hmac_sha256_signature>
Content-Type: application/json
```

**Request Body:**
```json
{
  "job_id": "~012345abcdef",
  "job_title": "Web Scraping Expert Needed",
  "job_url": "https://www.upwork.com/jobs/~012345abcdef",
  "job_description": "Need experienced Python developer for web scraping project...",
  "client_name": "Acme Corp",
  "client_spent": 15000.00,
  "client_rating": 4.8,
  "client_hires": 25,
  "client_payment_verified": true,
  "client_country": "United States",
  "budget": 500.00,
  "posted_at": "2025-11-05T10:30:00Z"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Job processed successfully",
  "draft_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "confidence": 0.85
}
```

**Response (Low Confidence - No Draft):**
```json
{
  "status": "skipped",
  "message": "Lead confidence too low",
  "confidence": 0.35
}
```

**Response (Error):**
```json
{
  "error": "invalid_signature",
  "message": "Webhook signature verification failed",
  "status_code": 401
}
```

**Status Codes:**
- `200 OK` - Job processed successfully
- `401 Unauthorized` - Invalid webhook signature
- `422 Validation Error` - Invalid request payload
- `500 Internal Server Error` - Server error

**Workflow:**
1. Validate webhook signature
2. Log event to database
3. Run Emma (AI lead evaluator)
4. If confidence > 0.7 → Run Rafael (AI proposal generator)
5. Send Telegram notification with draft
6. Return response

**Example (cURL):**
```bash
curl -X POST https://scopelock.onrender.com/upwork_webhook \
  -H "X-Webhook-Signature: sha256=abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "~012345abcdef",
    "job_title": "Web Scraping Expert Needed",
    "job_url": "https://www.upwork.com/jobs/~012345abcdef",
    "job_description": "Need experienced Python developer...",
    "client_name": "Acme Corp",
    "client_spent": 15000.00,
    "client_rating": 4.8,
    "client_hires": 25,
    "client_payment_verified": true,
    "client_country": "United States",
    "budget": 500.00,
    "posted_at": "2025-11-05T10:30:00Z"
  }'
```

---

### POST /cloudmailin_webhook

Process incoming emails containing job postings (alternative to Upwork webhook).

**Authentication:** None (CloudMailin IP whitelist)

**Request Body:**
```json
{
  "envelope": {
    "from": "jobs@freelancer.com",
    "to": ["proposals@scopelock.com"]
  },
  "plain": "New job posted: Web Scraping Project...",
  "html": "<html>...</html>",
  "subject": "New Job: Web Scraping Project",
  "from": "jobs@freelancer.com",
  "to": "proposals@scopelock.com",
  "headers": {...}
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Email processed successfully",
  "draft_id": "..."
}
```

**Status Codes:**
- `200 OK` - Email processed
- `422 Validation Error` - Invalid email format
- `500 Internal Server Error` - Server error

**Workflow:**
1. Extract job details from email body (regex parsing)
2. Run Emma to evaluate lead
3. If qualified → Generate draft
4. Notify via Telegram
5. Return response

---

### POST /telegram_webhook

Handle Telegram bot updates (messages, callbacks).

**Authentication:** Telegram Bot API (automatic)

**Request Body:**
```json
{
  "update_id": 123456789,
  "callback_query": {
    "id": "987654321",
    "from": {
      "id": 12345,
      "first_name": "John",
      "username": "johndoe"
    },
    "message": {
      "message_id": 456,
      "text": "New proposal draft ready!",
      "chat": {"id": 12345}
    },
    "data": "approve_a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Callback processed",
  "action": "approved",
  "draft_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Status Codes:**
- `200 OK` - Callback processed
- `404 Not Found` - Draft not found
- `500 Internal Server Error` - Server error

**Workflow:**
1. Extract callback_data (format: `<action>_<draft_id>`)
2. Parse action ("approve" or "reject")
3. Fetch Draft from database
4. If approve → Trigger UpworkProposalSubmitter
5. Update Draft status
6. Edit Telegram message with result
7. Return response

**Callback Data Format:**
- `approve_<draft_id>` - Approve draft
- `reject_<draft_id>` - Reject draft
- `submit_<proposal_id>` - Submit proposal (after approval)

---

### POST /vollna_webhook

Receive Vollna project notifications (alternative job platform).

**Authentication:** API Key (header)

**Headers:**
```
X-API-Key: <vollna_api_key>
Content-Type: application/json
```

**Request Body:**
```json
{
  "project_id": "proj_123456",
  "project_title": "Mobile App Development",
  "project_description": "Need iOS and Android developer...",
  "budget": 10000.00,
  "deadline": "2025-12-01",
  "client_info": {
    "name": "Tech Startup Inc",
    "country": "United Kingdom",
    "rating": 4.5
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Project processed",
  "draft_id": "..."
}
```

**Status Codes:**
- `200 OK` - Project processed
- `401 Unauthorized` - Invalid API key
- `422 Validation Error` - Invalid payload
- `500 Internal Server Error` - Server error

---

### GET /health_check

Service health monitoring endpoint (used by uptime monitors).

**Authentication:** None (public endpoint)

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "telegram": "healthy",
    "claude": "healthy",
    "upwork": "healthy"
  },
  "timestamp": "2025-11-05T12:00:00Z",
  "uptime_seconds": 86400
}
```

**Response (Degraded):**
```json
{
  "status": "degraded",
  "services": {
    "database": "healthy",
    "telegram": "down",
    "claude": "healthy",
    "upwork": "healthy"
  },
  "timestamp": "2025-11-05T12:00:00Z",
  "uptime_seconds": 86400
}
```

**Status Codes:**
- `200 OK` - Service healthy or degraded
- `503 Service Unavailable` - Service down

**Health Check Logic:**
- `healthy` - All services operational
- `degraded` - Some services down (non-critical)
- `down` - Critical services down (database)

**Usage:**
- Pingdom: Poll every 60 seconds
- Render: Health check path
- DataDog: Uptime monitoring

---

### GET /

API root endpoint (informational).

**Authentication:** None

**Response:**
```json
{
  "message": "Scopelock API",
  "version": "1.0.0",
  "status": "operational",
  "docs": "/docs",
  "health": "/health_check"
}
```

**Status Codes:**
- `200 OK` - API operational

---

## Frontend API Endpoints

Base URL: `https://scopelock.com` (production)

### POST /api/contact

Submit contact form (Next.js API route).

**Authentication:** None (public endpoint)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to discuss a project...",
  "subject": "Project Inquiry"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

**Status Codes:**
- `200 OK` - Message sent
- `400 Bad Request` - Invalid email or missing fields
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

**Rate Limit:** 5 requests per hour per IP

---

### GET /sitemap.xml

Generate sitemap for SEO.

**Response (XML):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://scopelock.com/</loc>
    <lastmod>2025-11-05</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://scopelock.com/about</loc>
    <lastmod>2025-11-05</lastmod>
    <priority>0.8</priority>
  </url>
  ...
</urlset>
```

**Status Codes:**
- `200 OK` - Sitemap generated

---

### GET /robots.txt

Generate robots.txt for web crawlers.

**Response (Plain Text):**
```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://scopelock.com/sitemap.xml
```

**Status Codes:**
- `200 OK` - Robots.txt generated

---

## Error Responses

All API endpoints return errors in consistent format:

**Standard Error Response:**
```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "status_code": 400,
  "details": {...}  // Optional
}
```

**Common Error Codes:**

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `invalid_signature` | 401 | Webhook signature verification failed |
| `invalid_request` | 422 | Request payload validation failed |
| `not_found` | 404 | Resource not found (draft_id, job_id) |
| `rate_limit_exceeded` | 429 | Too many requests |
| `internal_error` | 500 | Server error |
| `service_unavailable` | 503 | External service down (Claude API, Telegram) |

---

## Authentication

### Webhook Signature Verification

**Upwork, CloudMailin, Vollna webhooks use HMAC-SHA256 signatures:**

**Algorithm:**
```python
import hmac
import hashlib

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

**Header:** `X-Webhook-Signature: sha256=<hex_digest>`

**Example:**
```python
# Payload: b'{"job_id": "~012345"}'
# Secret: "my_webhook_secret"
# Signature: sha256=abc123def456...
```

---

### Telegram Bot Authentication

**Telegram webhook is automatically authenticated by Telegram servers.**

No additional authentication required. Telegram validates requests internally.

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /upwork_webhook | 100 requests | 1 minute |
| POST /telegram_webhook | 30 requests | 1 second |
| POST /api/contact | 5 requests | 1 hour |
| GET /health_check | Unlimited | N/A |

**Rate Limit Response:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 60,
  "status_code": 429
}
```

---

## Data Types

### LeadEvaluation
```typescript
{
  platform: "upwork" | "vollna" | "email",
  job_title: string,
  confidence: number,  // 0.0-1.0
  evaluation: string,
  should_respond: boolean,
  estimated_value: number,  // USD
  risk_factors: string[],
  created_at: string  // ISO 8601
}
```

### ResponseDraft
```typescript
{
  draft_id: string,  // UUID
  text: string,
  confidence: number,  // 0.0-1.0
  job_title: string,
  job_url: string,
  client: string,
  status: "pending" | "approved" | "rejected" | "submitted",
  created_at: string  // ISO 8601
}
```

### Event
```typescript
{
  event_id: string,  // UUID
  event_type: "webhook_received" | "draft_generated" | "proposal_submitted",
  payload: object,  // JSON blob
  timestamp: string,  // ISO 8601
  source: "upwork" | "telegram" | "vollna" | "email"
}
```

---

## Examples

### Example 1: Upwork Job → Draft Generation

**Request:**
```bash
curl -X POST https://scopelock.onrender.com/upwork_webhook \
  -H "X-Webhook-Signature: sha256=..." \
  -H "Content-Type: application/json" \
  -d @job_payload.json
```

**Response:**
```json
{
  "status": "success",
  "message": "Draft generated",
  "draft_id": "a1b2c3d4-...",
  "confidence": 0.85
}
```

**Telegram Notification:**
```
📝 New Proposal Draft

Client: Acme Corp
Job: Web Scraping Expert Needed
Budget: $500
Confidence: 85%

Draft:
"Dear Acme Corp,

I'm a Python developer with 5 years of web scraping experience..."

[Approve] [Reject]
```

---

### Example 2: User Approves Draft

**User clicks [Approve] → Telegram sends:**
```json
{
  "update_id": 123,
  "callback_query": {
    "id": "987",
    "data": "approve_a1b2c3d4-...",
    ...
  }
}
```

**Scopelock responds:**
1. Update Draft status → "approved"
2. Submit proposal via UpworkProposalSubmitter
3. Update Draft status → "submitted"
4. Edit Telegram message → "✅ Proposal submitted!"

---

## Troubleshooting

### Webhook Not Receiving Data

**Check:**
1. Webhook URL is correct (HTTPS required)
2. Signature verification is passing
3. Firewall/security groups allow inbound HTTPS

**Debug:**
```bash
# Check logs
render logs tail scopelock-backend

# Test webhook manually
curl -X POST https://scopelock.onrender.com/upwork_webhook \
  -H "X-Webhook-Signature: sha256=test" \
  -H "Content-Type: application/json" \
  -d '{"job_id": "test"}'
```

---

### Telegram Notifications Not Sending

**Check:**
1. `TELEGRAM_BOT_TOKEN` is valid
2. `TELEGRAM_CHAT_ID` is correct
3. Bot has permission to send messages to chat

**Debug:**
```python
# Test Telegram API directly
import requests

response = requests.post(
    f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
    json={"chat_id": TELEGRAM_CHAT_ID, "text": "Test"}
)
print(response.json())
```

---

### Proposal Submission Failing

**Check:**
1. Upwork credentials are valid (UPWORK_EMAIL, UPWORK_PASSWORD)
2. Upwork login flow hasn't changed (Playwright selectors)
3. Connects balance is sufficient

**Debug:**
```python
# Test login status
submitter = UpworkProposalSubmitter()
is_logged_in = submitter.check_login_status()
print(f"Logged in: {is_logged_in}")
```

---

## Support

**Questions?** hello@graphcare.ai
**API Issues?** Slack: #scopelock-support (if configured)
**Emergency?** PagerDuty alert will trigger on-call

---

**GraphCare** | Knowledge Extraction Service
*Your code, always documented. Always queryable.*
