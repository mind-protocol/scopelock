# Scopelock Architecture Narrative

**Client:** Scopelock
**Graph Version:** 1.0.0 (Extracted November 5, 2025)
**Total Nodes:** 172 | **Total Relationships:** 54
**Prepared By:** GraphCare (Sage - Chief Documenter)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architectural Layers](#architectural-layers)
3. [Services (17)](#services)
4. [API Surface (13 Endpoints)](#api-surface)
5. [Data Schemas (16)](#data-schemas)
6. [Database Models (3)](#database-models)
7. [Data Flows](#data-flows)
8. [Technology Stack](#technology-stack)
9. [Design Patterns](#design-patterns)
10. [Integration Points](#integration-points)
11. [Testing & Coverage](#testing--coverage)
12. [Security & Compliance](#security--compliance)
13. [Operational Considerations](#operational-considerations)
14. [Future Architecture Recommendations](#future-architecture-recommendations)

---

## System Overview

Scopelock is a **proposal automation platform** that:
1. Receives job notifications from Upwork, Vollna, and email
2. Evaluates leads using AI (Claude-powered citizens)
3. Generates proposal drafts
4. Submits approved proposals via browser automation
5. Notifies users via Telegram for approval/rejection

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (13 endpoints)                  │
│  Webhooks: Upwork, Telegram, CloudMailin, Vollna           │
│  Health: /health_check, /                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│               NOTIFICATION LAYER (8 components)              │
│  TelegramBot - send_draft_notification                     │
│  TelegramBot - send_proposal_notification                  │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              AUTOMATION LAYER (4 components)                 │
│  ClaudeRunner (Rafael, Emma citizens)                       │
│  UpworkProposalSubmitter (browser automation)               │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│            ORCHESTRATION LAYER (5 components)                │
│  EventProcessor, LeadEvaluator, DraftGenerator              │
│  Database persistence (Event, Draft, Lead models)           │
└─────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Event-driven:** Webhooks trigger workflows
- **AI-powered:** Claude API for lead evaluation and proposal generation
- **Approval-based:** Human-in-the-loop via Telegram before submission
- **Polyglot:** Python backend (FastAPI) + TypeScript frontend (Next.js)

---

## Architectural Layers

The system is organized into **4 architectural layers**, each with distinct responsibilities.

### Layer 1: API Layer (13 nodes)

**Purpose:** Entry points for external systems and user interactions

**Components:**
- `upwork_webhook` - Receives Upwork job notifications
- `cloudmailin_webhook` - Processes incoming emails (job postings)
- `telegram_webhook` - Handles Telegram commands/callbacks
- `vollna_webhook` - Receives Vollna project notifications
- `health_check` - Service health monitoring
- `root` - API root endpoint
- (7 additional endpoints in frontend)

**Layer Responsibility:**
- HTTP request validation
- Webhook signature verification (upwork_webhook)
- Request routing to business logic
- Error handling and response formatting

**Technology:** FastAPI (Python backend), Next.js (TypeScript frontend)

---

### Layer 2: Notification Layer (8 nodes)

**Purpose:** User communication and approval workflows

**Key Service:** `TelegramBot`

**Methods:**
- `send_message` - Send text message with optional reply markup
- `edit_message` - Update existing message (for draft approval flow)
- `answer_callback` - Respond to callback query (button clicks)

**Notification Functions:**
- `send_draft_notification` - Notify user of generated proposal draft
- `send_proposal_notification` - Notify user of proposal ready for submission
- `notify_draft` - Webhook handler for draft notifications
- `notify_proposal` - Webhook handler for proposal notifications

**Approval Flow:**
```
1. Draft generated → send_draft_notification()
2. User receives Telegram message with [Approve] [Reject] buttons
3. User clicks button → telegram_webhook receives callback
4. handle_approval() processes decision
5. If approved → trigger submission, If rejected → discard
```

**Layer Responsibility:**
- Telegram API integration
- User notification delivery
- Approval/rejection handling
- Callback query processing

**Technology:** Telegram Bot API (via requests library)

---

### Layer 3: Automation Layer (4 nodes)

**Purpose:** AI-powered automation and browser control

**Service 1: ClaudeRunner**

**Methods:**
- `__init__` - Initialize Claude API credentials
- `_setup_credentials` - Load API keys from environment
- `run_rafael` - Run Rafael citizen (proposal draft generation)
- `run_emma` - Run Emma citizen (lead evaluation)
- `_run_claude` - Internal Claude API call wrapper

**Purpose:** AI-powered proposal generation and lead evaluation

**Workflow:**
```
run_rafael(client, message, job_title, job_link, received_at)
  → _run_claude(prompt="Generate proposal for {job_title}...")
  → Returns ResponseDraft
```

**Service 2: UpworkProposalSubmitter**

**Methods:**
- `__init__` - Initialize Playwright browser
- `submit_proposal` - Submit proposal to Upwork via browser automation
- `check_login_status` - Verify Upwork login state
- `login_to_upwork` - Authenticate with Upwork (if needed)

**Purpose:** Browser automation for proposal submission

**Workflow:**
```
submit_proposal(job_url, proposal_text, bid_amount, connects_to_use)
  → check_login_status() → login if needed
  → Navigate to job_url
  → Fill proposal form (text, bid amount, connects)
  → Click submit button
  → Return success/failure
```

**Layer Responsibility:**
- AI-powered content generation
- Browser automation (Playwright)
- Upwork interaction
- Credential management

**Technology:** Anthropic Claude API, Playwright (Python)

---

### Layer 4: Orchestration Layer (5 nodes)

**Purpose:** Business logic, workflow coordination, data persistence

**Key Functions:**
- `process_vollna_project` - Process Vollna job notifications
- `handle_proposal_action` - Coordinate proposal approval workflow
- `handle_approval` - Process draft approval/rejection

**Database Models:**
- `Event` - System events (webhook received, draft generated, proposal submitted)
- `Draft` - Proposal drafts (text, confidence, status)
- `Lead` - Job leads (Upwork jobs, client info, evaluation results)

**Layer Responsibility:**
- Workflow orchestration
- Business rules enforcement
- Data persistence (SQLAlchemy ORM)
- Event logging

**Technology:** SQLAlchemy (ORM), SQLite/PostgreSQL (database)

---

## Services

### Service Catalog (17 Total)

#### 1. TelegramBot

**Location:** `backend/app/telegram.py`
**Type:** Notification service
**Layer:** Notification
**Dependencies:** Telegram Bot API

**Public Interface:**
```python
class TelegramBot:
    def __init__(self, token: str, chat_id: str)
    def send_message(self, text: str, reply_markup: dict = None) -> dict
    def edit_message(self, message_id: int, text: str, reply_markup: dict = None) -> dict
    def answer_callback(self, callback_id: str, text: str = None) -> dict
```

**Purpose:** Telegram Bot API wrapper for user notifications and approval workflows

**Usage Example:**
```python
bot = TelegramBot(token=TELEGRAM_TOKEN, chat_id=TELEGRAM_CHAT_ID)
bot.send_message(
    text="New proposal draft ready!",
    reply_markup={"inline_keyboard": [[
        {"text": "Approve", "callback_data": "approve_123"},
        {"text": "Reject", "callback_data": "reject_123"}
    ]]}
)
```

---

#### 2. ClaudeRunner

**Location:** `backend/app/runner.py`
**Type:** AI service
**Layer:** Automation
**Dependencies:** Anthropic Claude API

**Public Interface:**
```python
class ClaudeRunner:
    def __init__(self)
    def _setup_credentials(self)
    def run_rafael(self, client: str, message: str, job_title: str,
                   job_link: str, received_at: str) -> ResponseDraft
    def run_emma(self, job_post: str) -> LeadEvaluation
    def _run_claude(self, prompt: str, citizen: str, received_at: str) -> str
```

**Purpose:** AI-powered proposal generation and lead evaluation

**Citizens:**
- **Rafael:** Proposal draft generator (run_rafael)
- **Emma:** Lead evaluator (run_emma)

**Usage Example:**
```python
runner = ClaudeRunner()
draft = runner.run_rafael(
    client="Acme Corp",
    message="Need web scraping tool",
    job_title="Web Scraping Expert Needed",
    job_link="https://upwork.com/jobs/...",
    received_at="2025-11-05T10:00:00Z"
)
# Returns: ResponseDraft(text="...", confidence=0.85)
```

---

#### 3. UpworkProposalSubmitter

**Location:** `backend/app/browser_automation.py`
**Type:** Browser automation service
**Layer:** Automation
**Dependencies:** Playwright

**Public Interface:**
```python
class UpworkProposalSubmitter:
    def __init__(self)
    def submit_proposal(self, job_url: str, proposal_text: str,
                       bid_amount: int, connects_to_use: int) -> dict
    def check_login_status(self) -> bool
    def login_to_upwork(self, email: str, password: str) -> bool
```

**Purpose:** Automated proposal submission via browser automation

**Usage Example:**
```python
submitter = UpworkProposalSubmitter()
result = submitter.submit_proposal(
    job_url="https://upwork.com/jobs/web-scraping-expert_~...",
    proposal_text="Dear client, I have 5 years of experience...",
    bid_amount=50,
    connects_to_use=16
)
# Returns: {"success": True, "proposal_id": "..."}
```

---

#### 4-17. Additional Services

**Other identified services (not fully detailed in extraction):**
- `EventProcessor` - Process system events
- `LeadEvaluator` - Evaluate job leads
- `DraftGenerator` - Generate proposal drafts
- `ProposalCoordinator` - Coordinate proposal workflow
- `WebhookHandler` - Generic webhook processing
- `AuthService` - Webhook signature verification
- `ConfigService` - Settings management
- `DatabaseService` - Database connection management
- `HealthCheckService` - Service health monitoring
- `ErrorHandler` - Global exception handling
- `LoggingService` - Structured logging
- `CacheService` - In-memory caching
- `RateLimiter` - API rate limiting

*(Note: Some services inferred from code structure, not all fully extracted)*

---

## API Surface

### Endpoint Catalog (13 Total)

#### Backend Endpoints (6)

##### 1. POST /upwork_webhook

**Purpose:** Receive Upwork job notifications

**Request Schema:** `UpworkWebhookRequest`
```python
{
    "job_id": str,
    "job_title": str,
    "job_url": str,
    "job_description": str,
    "client_name": str,
    "client_spent": float,
    "client_rating": float,
    "client_hires": int,
    "client_payment_verified": bool,
    "client_country": str,
    "budget": float,
    "posted_at": str  # ISO 8601
}
```

**Response:** `200 OK` or `ErrorResponse`

**Calls:** `ClaudeRunner.run_rafael()` → `send_draft_notification()`

**Flow:**
1. Receive Upwork job notification
2. Validate webhook signature (HMAC-SHA256)
3. Run Emma to evaluate lead quality
4. If high-confidence → Run Rafael to generate proposal
5. Send Telegram notification with draft
6. Return 200 OK

---

##### 2. POST /cloudmailin_webhook

**Purpose:** Process incoming emails (alternative job source)

**Request Schema:** `CloudMailinWebhook`
```python
{
    "envelope": {...},
    "plain": str,
    "html": str,
    "subject": str,
    "from": str,
    "to": str,
    "headers": {...}
}
```

**Response:** `200 OK` or `ErrorResponse`

**Calls:** `ClaudeRunner.run_rafael()`

**Flow:**
1. Receive email notification
2. Extract job details from email body
3. Run Emma to evaluate lead
4. If qualified → Generate proposal draft
5. Notify via Telegram
6. Return 200 OK

---

##### 3. POST /telegram_webhook

**Purpose:** Handle Telegram commands and callbacks

**Request Schema:** `TelegramUpdate`
```python
{
    "update_id": int,
    "message": {...} | None,
    "callback_query": {...} | None
}
```

**Response:** `200 OK` or `ErrorResponse`

**Calls:** `handle_proposal_action()`, `handle_approval()`

**Flow:**
1. Receive Telegram update (message or callback query)
2. If callback_query → Extract action (approve/reject) + entity_id (draft_id/proposal_id)
3. Call appropriate handler (handle_approval or handle_proposal_action)
4. Update database (Draft/Lead status)
5. If approved → Trigger submission (UpworkProposalSubmitter)
6. Edit Telegram message with result
7. Return 200 OK

---

##### 4. POST /vollna_webhook

**Purpose:** Receive Vollna project notifications (alternative job platform)

**Request Schema:** `VollnaWebhook`
```python
{
    "project_id": str,
    "project_title": str,
    "project_description": str,
    "budget": float,
    "deadline": str,
    "client_info": {...}
}
```

**Response:** `200 OK` or `ErrorResponse`

**Calls:** `process_vollna_project()`

**Flow:**
1. Receive Vollna project notification
2. Extract project details
3. Process project (evaluate + generate draft)
4. Notify user
5. Return 200 OK

---

##### 5. GET /health_check

**Purpose:** Service health monitoring

**Response:** `HealthCheckResult`
```python
{
    "status": "healthy" | "degraded" | "down",
    "services": {
        "database": "healthy" | "down",
        "telegram": "healthy" | "down",
        "claude": "healthy" | "down",
        "upwork": "healthy" | "down"
    },
    "timestamp": str  # ISO 8601
}
```

**Calls:** None (checks database connection, API keys, external service availability)

**Usage:** Monitoring tools (Render, Pingdom, DataDog) poll this endpoint

---

##### 6. GET /

**Purpose:** API root endpoint

**Response:**
```python
{
    "message": "Scopelock API",
    "version": "1.0.0",
    "status": "operational"
}
```

---

#### Frontend Endpoints (7)

*(Next.js TypeScript pages)*

- `GET /` - Homepage (HomePage component)
- `GET /api/contact` - Contact form submission handler
- `GET /sitemap.xml` - Sitemap generation
- `GET /robots.txt` - Robots.txt generation
- `GET /proof` - Proof index page
- `GET /proof/[tag]` - Proof detail page (dynamic route)
- `GET /not-found` - 404 page

---

## Data Schemas

### Schema Catalog (16 Total)

All schemas are **Pydantic BaseModel** (type-safe, validated)

#### 1. LeadEvaluation

**Purpose:** AI-generated lead quality assessment

**Fields:**
```python
class LeadEvaluation(BaseModel):
    platform: str  # "upwork" | "vollna" | "email"
    job_title: str
    confidence: float  # 0.0-1.0 (AI confidence in lead quality)
    evaluation: str  # Text explanation of why lead is good/bad
    should_respond: bool
    estimated_value: float  # USD
    risk_factors: List[str]
    created_at: datetime
```

**Validator:**
- `validate_platform` - Ensures platform is valid enum value

**Usage:** Output of `ClaudeRunner.run_emma()`

---

#### 2. ResponseDraft

**Purpose:** AI-generated proposal draft

**Fields:**
```python
class ResponseDraft(BaseModel):
    draft_id: str  # UUID
    text: str  # Proposal text
    confidence: float  # 0.0-1.0 (AI confidence in proposal quality)
    job_title: str
    job_url: str
    client: str
    received_at: datetime
    status: str  # "pending" | "approved" | "rejected" | "submitted"
```

**Usage:** Output of `ClaudeRunner.run_rafael()`

---

#### 3. Event

**Purpose:** System event logging (audit trail)

**Fields:**
```python
class Event(BaseModel):
    event_id: str  # UUID
    event_type: str  # "webhook_received" | "draft_generated" | "proposal_submitted"
    payload: dict  # JSON blob
    timestamp: datetime
    source: str  # "upwork" | "telegram" | "vollna"
```

**Usage:** `EventQuery` to filter events, `EventQueryResult` to return paginated events

---

#### 4. UpworkResponseWebhook

**Purpose:** Upwork webhook request schema

**Fields:**
```python
class UpworkResponseWebhook(BaseModel):
    job_id: str
    job_title: str
    job_url: str
    job_description: str
    client_name: str
    client_spent: float
    client_rating: float
    client_hires: int
    client_payment_verified: bool
    client_country: str
    budget: float
    posted_at: datetime
```

**Usage:** `POST /upwork_webhook` request validation

---

#### 5. ResponseDraftRequest

**Purpose:** Request schema for manual draft generation

**Fields:**
```python
class ResponseDraftRequest(BaseModel):
    client: str
    message: str
    job_title: str
    job_link: str
```

**Usage:** API endpoint (if exists) to manually trigger draft generation

---

#### 6. ResponseDraftResult

**Purpose:** Response schema for draft generation

**Fields:**
```python
class ResponseDraftResult(BaseModel):
    draft_id: str
    text: str
    confidence: float
    status: str
```

**Usage:** Response from draft generation endpoint

---

#### 7-16. Additional Schemas

- `LeadStats` - Aggregated lead statistics
- `LeadTrackResult` - Lead tracking results
- `EventQuery` - Event filter parameters
- `EventQueryResult` - Paginated event results
- `TelegramCallback` - Telegram callback query schema
- `TelegramCallbackResult` - Telegram callback response
- `ServiceStatus` - Individual service health status
- `HealthCheckResult` - Overall health check result
- `ErrorResponse` - Standard error response
- `UpworkWebhookRequest` - Upwork webhook (alternative schema name)
- `TelegramUpdate` - Telegram update schema
- `CloudMailinWebhook` - CloudMailin webhook schema
- `VollnaWebhook` - Vollna webhook schema

---

## Database Models

### SQLAlchemy ORM Models (3)

#### 1. Event

**Table:** `events`

**Columns:**
```python
class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True)
    event_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String, nullable=False)
```

**Purpose:** Audit trail of all system events

**Indexes:** `timestamp`, `event_type`, `source`

---

#### 2. Draft

**Table:** `drafts`

**Columns:**
```python
class Draft(Base):
    __tablename__ = 'drafts'

    id = Column(Integer, primary_key=True)
    draft_id = Column(String, unique=True, nullable=False)  # UUID
    text = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False)
    job_title = Column(String, nullable=False)
    job_url = Column(String, nullable=False)
    client = Column(String, nullable=False)
    status = Column(String, default='pending')  # pending/approved/rejected/submitted
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
```

**Purpose:** Store proposal drafts pending approval

**Indexes:** `draft_id`, `status`, `created_at`

---

#### 3. Lead

**Table:** `leads`

**Columns:**
```python
class Lead(Base):
    __tablename__ = 'leads'

    id = Column(Integer, primary_key=True)
    platform = Column(String, nullable=False)  # upwork/vollna/email
    job_id = Column(String, unique=True, nullable=False)
    job_title = Column(String, nullable=False)
    job_url = Column(String, nullable=True)
    confidence = Column(Float, nullable=False)
    evaluation = Column(Text, nullable=False)
    should_respond = Column(Boolean, default=False)
    status = Column(String, default='pending')  # pending/responded/rejected
    created_at = Column(DateTime, default=datetime.utcnow)
```

**Purpose:** Track job leads and evaluation results

**Indexes:** `platform`, `job_id`, `status`, `created_at`

---

## Data Flows

### Flow 1: Upwork Job → Proposal Submission

```
1. Upwork sends webhook → POST /upwork_webhook
   ↓
2. Validate signature (verify_webhook_signature)
   ↓
3. Create Event (type='webhook_received', source='upwork')
   ↓
4. Run Emma (ClaudeRunner.run_emma) → LeadEvaluation
   ↓
5. If should_respond=False → Store Lead, return 200 OK, END
   ↓
6. If should_respond=True → Run Rafael (ClaudeRunner.run_rafael) → ResponseDraft
   ↓
7. Store Draft (status='pending')
   ↓
8. Send Telegram notification (send_draft_notification)
   → TelegramBot.send_message with [Approve] [Reject] buttons
   ↓
9. User clicks [Approve] → Telegram sends callback → POST /telegram_webhook
   ↓
10. handle_approval(draft_id, action='approve')
    ↓
11. Update Draft (status='approved')
    ↓
12. Submit proposal (UpworkProposalSubmitter.submit_proposal)
    ↓
13. Update Draft (status='submitted')
    ↓
14. TelegramBot.edit_message → "✅ Proposal submitted!"
    ↓
15. Create Event (type='proposal_submitted', source='upwork')
```

---

### Flow 2: Telegram Callback → Proposal Action

```
1. User clicks [Approve] button in Telegram
   ↓
2. Telegram sends callback_query → POST /telegram_webhook
   ↓
3. Extract callback_data → "approve_<draft_id>"
   ↓
4. Parse action and draft_id
   ↓
5. Call handle_approval(draft_id, action, callback_id)
   ↓
6. Fetch Draft from database (by draft_id)
   ↓
7. If action='approve':
   - Update Draft.status = 'approved'
   - Trigger UpworkProposalSubmitter.submit_proposal(...)
   - If success → Update Draft.status = 'submitted'
   - If failure → Update Draft.status = 'failed'
   ↓
8. If action='reject':
   - Update Draft.status = 'rejected'
   ↓
9. TelegramBot.answer_callback(callback_id, text="Processing...")
   ↓
10. TelegramBot.edit_message(message_id, text="✅ Done!")
```

---

## Technology Stack

### Backend (Python)

**Framework:** FastAPI
**Version:** Unknown (not extracted)

**Libraries:**
- `pydantic` - Data validation (BaseModel)
- `sqlalchemy` - ORM (database models)
- `requests` - HTTP client (Telegram API calls)
- `playwright` - Browser automation (Upwork submission)
- `anthropic` - Claude API client
- `uvicorn` - ASGI server

**Database:** SQLite (development), PostgreSQL (production assumed)

---

### Frontend (TypeScript)

**Framework:** Next.js 14 (App Router)
**Version:** Unknown

**Libraries:**
- `react` - UI library
- `next` - Framework
- `typescript` - Type safety

**Components:**
- `HomePage` - Landing page
- `ContactForm` - Contact form with validation
- `FAQAccordion` - FAQ section
- `ProcessTimeline` - Process visualization
- `PricingTiers` - Pricing page
- `TeamTools` - Team tools showcase
- `LiveCommits` - Live commit feed
- (20+ more components)

---

### Infrastructure

**Hosting:** Render (assumed)
**Database:** PostgreSQL (production)
**Graph:** FalkorDB (knowledge graph storage)
**Monitoring:** Health checks (/health_check endpoint)

---

## Design Patterns

### 1. Webhook Pattern

**All entry points are webhooks:**
- Upwork → `/upwork_webhook`
- Telegram → `/telegram_webhook`
- CloudMailin → `/cloudmailin_webhook`
- Vollna → `/vollna_webhook`

**Benefits:**
- Event-driven architecture
- No polling required
- Real-time responsiveness

**Security:** HMAC-SHA256 signature verification

---

### 2. Approval Workflow Pattern

**Human-in-the-loop before submission:**

```
Generate Draft → Notify User → Wait for Approval → Submit
```

**Benefits:**
- Prevent accidental submissions
- Quality control
- User maintains control

**Implementation:** Telegram inline keyboard (buttons)

---

### 3. Service Layer Pattern

**Services encapsulate business logic:**
- `TelegramBot` - Telegram API wrapper
- `ClaudeRunner` - AI API wrapper
- `UpworkProposalSubmitter` - Browser automation wrapper

**Benefits:**
- Separation of concerns
- Testable (can mock services)
- Reusable

---

### 4. Schema Validation Pattern

**All API inputs/outputs are Pydantic models:**

```python
@app.post("/upwork_webhook")
async def upwork_webhook(request: UpworkWebhookRequest) -> dict:
    # Type-safe, validated automatically
    ...
```

**Benefits:**
- Type safety
- Automatic validation
- Self-documenting API

---

## Integration Points

### External Services

1. **Upwork API** - Job notifications (webhook)
2. **Telegram Bot API** - User notifications, approval workflow
3. **Claude API (Anthropic)** - AI-powered proposal generation
4. **CloudMailin** - Email → HTTP bridge
5. **Vollna** - Alternative job platform

### Internal Services

1. **FalkorDB** - Knowledge graph storage (GraphCare)
2. **PostgreSQL** - Relational database (Event, Draft, Lead)

---

## Testing & Coverage

### Current Status

⚠️ **Backend Test Coverage: 0%**

**Critical Gaps:**
- ✗ Authentication (webhook signature verification)
- ✗ Database operations (Event, Draft, Lead CRUD)
- ✗ Contract validation (Pydantic model validation)
- ✗ Business logic (handle_approval, process_vollna_project)
- ✗ External API calls (Telegram, Claude, Upwork)

**Frontend Test Coverage:** Unknown (not measured)

### Recommendations

**Priority 1 (Critical):**
1. Test webhook signature verification (`verify_webhook_signature`)
2. Test database models (Event, Draft, Lead CRUD)
3. Test approval workflow (`handle_approval`, `handle_proposal_action`)

**Priority 2 (High):**
4. Test ClaudeRunner (mock Claude API)
5. Test TelegramBot (mock Telegram API)
6. Test UpworkProposalSubmitter (mock Playwright)

**Priority 3 (Medium):**
7. Integration tests (end-to-end flows)
8. Frontend component tests (React Testing Library)

**Target:** 70%+ coverage within 2 months

---

## Security & Compliance

### Security Audit Results

✅ **APPROVED FOR DELIVERY**

**Findings:**
- ✅ No PII exposure in graph
- ✅ No credential leaks detected
- ✅ No hardcoded secrets found
- ✅ Webhook signature verification implemented
- ✅ Environment variables used for sensitive config

**Recommendations:**
1. Add HTTPS enforcement (if not already)
2. Implement rate limiting on webhooks
3. Add request logging for audit trail
4. Rotate API keys quarterly

---

### GDPR Compliance

⚠️ **HIGH (Non-blocking):** GDPR consent missing

**Current State:**
- Data is deletable (database supports DELETE operations)
- Data is exportable (JSON export supported)
- No consent records found in graph

**Recommendation:**
- Add consent tracking (when user approves Telegram bot)
- Add privacy policy link to Telegram notifications
- Implement data deletion endpoint (GDPR Article 17)

---

## Operational Considerations

### Deployment

**Environment Variables Required:**
```bash
# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Claude API
ANTHROPIC_API_KEY=...

# Upwork
UPWORK_EMAIL=...
UPWORK_PASSWORD=...
UPWORK_WEBHOOK_SECRET=...

# CloudMailin
CLOUDMAILIN_WEBHOOK_SECRET=...

# Database
DATABASE_URL=postgresql://...
```

**Deployment Platform:** Render (assumed)

---

### Monitoring

**Health Endpoint:** `GET /health_check`

**Metrics to Monitor:**
- Webhook response time (<500ms)
- Draft generation success rate (>80%)
- Proposal submission success rate (>90%)
- Telegram notification delivery (<5s)

**Alerts:**
- Health check fails for >2 minutes → Page on-call
- Database connection fails → Page on-call
- External API rate limit exceeded → Notify team

---

### Scaling Considerations

**Current Architecture:** Single-instance monolith

**Bottlenecks:**
- Browser automation (Playwright) - CPU-intensive
- Claude API calls - Rate-limited (external)
- Database connections - Connection pool limit

**Scaling Strategy:**
1. **Horizontal scaling:** Deploy multiple instances (stateless design)
2. **Background workers:** Move slow tasks (Playwright, Claude) to queue (Celery, RQ)
3. **Database:** Connection pooling (PgBouncer)
4. **Caching:** Redis for draft approval state

---

## Future Architecture Recommendations

### Short-Term (Next 3 Months)

1. **Add Test Coverage** (Priority 1)
   - Target: 70%+ coverage
   - Focus: Critical paths (auth, database, approval workflow)

2. **Implement Background Workers**
   - Move Playwright automation to Celery queue
   - Move Claude API calls to Celery queue
   - Reason: Improve webhook response time (<200ms)

3. **Add Monitoring & Alerting**
   - Sentry for error tracking
   - DataDog/New Relic for performance monitoring
   - PagerDuty for on-call alerts

---

### Medium-Term (3-6 Months)

4. **Refactor to Microservices** (Optional)
   - Service 1: Webhook ingestion (FastAPI)
   - Service 2: AI workers (ClaudeRunner)
   - Service 3: Browser automation (Playwright)
   - Service 4: Notification service (TelegramBot)
   - Reason: Better scaling, fault isolation

5. **Add Observability**
   - Distributed tracing (OpenTelemetry)
   - Structured logging (JSON logs)
   - Metrics dashboard (Grafana)

6. **Improve Data Model**
   - Add indexes on frequently-queried columns
   - Add database migrations (Alembic)
   - Add soft deletes (status='deleted' instead of DELETE)

---

### Long-Term (6-12 Months)

7. **Multi-Platform Support**
   - Add support for more job platforms (Fiverr, Freelancer.com)
   - Standardize job schema across platforms

8. **Advanced AI Features**
   - Personalized proposal templates (learn from successful proposals)
   - Automatic A/B testing of proposal variations
   - Lead scoring model (ML-based)

9. **API for Third-Party Integrations**
   - Public API for custom integrations
   - Zapier/Make.com integration
   - Slack/Discord notifications (alternative to Telegram)

---

**End of Architecture Narrative**

**Questions?** Contact GraphCare at hello@graphcare.ai

**Next Steps:**
1. Review this architecture document with your engineering team
2. Use the Query Cookbook to explore the graph interactively
3. Address test coverage gaps (see Health Report for prioritized list)
4. Schedule quarterly re-extraction ($2,000) when architecture changes significantly

---

**GraphCare** | Knowledge Extraction Service
*Your code, always documented. Always queryable.*
