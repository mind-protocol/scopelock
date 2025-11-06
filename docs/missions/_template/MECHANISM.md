# MECHANISM: [Mission Name]

**Mission:** [Brief mission name]
**Purpose:** High-level architecture, technology choices, and system design
**Date Created:** YYYY-MM-DD

---

## Architecture Overview

[High-level description of system architecture + diagram if helpful]

**System Components:**
- **[Component 1]:** [Responsibility]
- **[Component 2]:** [Responsibility]
- **[Component 3]:** [Responsibility]

**Data Flow:**
```
[User/Client] → [Frontend] → [API] → [Database]
                    ↓
            [External Services]
```

**Example:**
```
Components:
- Frontend (Next.js): User interface, client-side routing, form handling
- API (Next.js API routes): Business logic, authentication, data validation
- Database (PostgreSQL): User data, product catalog, orders
- External Services: Stripe (payments), SendGrid (emails)

Data Flow:
[User] → [Next.js Frontend] → [API Routes] → [PostgreSQL]
              ↓                    ↓
        [Stripe API]          [SendGrid API]
```

---

## Technology Stack

**IMPORTANT:** Verify against standard ScopeLock stack. See `docs/core/tech-stack.md`.

### Frontend

**Framework:** [Next.js / React / Vue / etc.]
**Version:** [specific version]
**Deployment:** [Vercel / Netlify / other]

**Why this choice:**
[Justification - must align with standard stack or explain deviation]

**Example:**
- **Framework:** Next.js 14 (App Router)
- **Version:** 14.0.4
- **Deployment:** Vercel
- **Why:** Standard ScopeLock stack - zero-config deployment, edge optimization, built-in performance

---

### Backend

**Framework:** [FastAPI / Django / Next.js API routes / Express / etc.]
**Language:** [Python / TypeScript / JavaScript]
**Deployment:** [Render / Railway / Vercel / other]

**Why this choice:**
[Justification]

**Example:**
- **Framework:** Next.js API Routes
- **Language:** TypeScript
- **Deployment:** Vercel (same as frontend)
- **Why:** Standard ScopeLock stack - collocated with frontend, serverless functions, fast iteration

**Alternative example (Python backend):**
- **Framework:** FastAPI 0.104.0
- **Language:** Python 3.11
- **Deployment:** Render
- **Why:** Standard ScopeLock stack - rapid development, excellent for AI/ML integration, reliable hosting

---

### Database

**Type:** [PostgreSQL / MySQL / MongoDB / Airtable / etc.]
**Version:** [specific version]
**Hosting:** [Render / AWS RDS / Supabase / etc.]

**Why this choice:**
[Justification - when to use PostgreSQL vs Airtable?]

**Example (PostgreSQL):**
- **Type:** PostgreSQL 15
- **Hosting:** Render (managed)
- **Why:** Complex relational data, requires JOINs and transactions, production-grade performance needs

**Example (Airtable):**
- **Type:** Airtable
- **Why:** Simple CRUD operations, client wants to edit data directly, low complexity, rapid prototyping

---

### AI & External Services

**LLM Calls (Internal Development ONLY):**
- **CRITICAL:** Use Claude Code with `claude -p "message" --continue` syntax
- **Why:** Budget compliance - subscription vs pay-per-token API costs
- **NEVER:** Direct API calls to Claude/OpenAI unless client explicitly pays separately

**Client-Facing AI (if applicable):**
[If client's app needs LLM features, document here with client's API keys/budget]

**Other External Services:**
- [Service 1]: [Purpose, API key requirements]
- [Service 2]: [Purpose, API key requirements]

**Example:**
- Stripe API: Payment processing (client provides API keys)
- SendGrid API: Email notifications (ScopeLock shared account)
- Ideogram API: Image generation (client's account + budget)

---

## Database Schema

### Tables/Collections

#### Table: [table_name]

**Purpose:** [What this table stores]

**Fields:**
- `id`: UUID (primary key)
- `[field_1]`: [type] - [description]
- `[field_2]`: [type] - [description]
- `created_at`: TIMESTAMP - Record creation time
- `updated_at`: TIMESTAMP - Last update time

**Indexes:**
- Primary: `id`
- Secondary: `[field]` (for fast lookups)

**Example:**
```
Table: users

Purpose: Store user account data

Fields:
- id: UUID (primary key)
- email: VARCHAR(255) NOT NULL UNIQUE - User email address
- password_hash: VARCHAR(255) NOT NULL - Bcrypt hashed password
- name: VARCHAR(255) - User's full name
- role: ENUM('user', 'admin') DEFAULT 'user' - User role
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

Indexes:
- Primary: id
- Unique: email (for login lookups)
```

---

#### Table: [table_name_2]

[Same structure]

---

### Relationships

**[Table 1] → [Table 2]:** [Relationship type, e.g., one-to-many]

**Example:**
- `users` → `orders`: One-to-many (one user has many orders)
- `orders` → `products`: Many-to-many (orders contain multiple products, products in multiple orders)

---

## API Design

**Base URL:** [Production/staging URL]

**Authentication:** [Method: JWT, session cookies, API keys, etc.]

**Example:**
- Base URL: `https://api.example.com/v1`
- Authentication: JWT tokens in Authorization header

---

### Endpoints

#### `POST /api/[resource]`

**Purpose:** [What this endpoint does]

**Authentication:** Required / Optional / None

**Request:**
```json
{
  "field1": "value",
  "field2": "value"
}
```

**Response (Success):**
```json
{
  "id": "uuid",
  "status": "success",
  "data": { ... }
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Example:**
```
POST /api/auth/login

Purpose: Authenticate user and return session token

Authentication: None (this IS the auth endpoint)

Request:
{
  "email": "user@example.com",
  "password": "Test123!"
}

Response (Success):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe"
  }
}

Response (Error):
{
  "error": "Invalid email or password",
  "code": "AUTH_FAILED"
}
```

---

#### `GET /api/[resource]`

[Same structure]

---

## External Integrations

### [Service Name]

**Purpose:** [Why we integrate with this service]
**API:** [API documentation link]
**Authentication:** [How we auth with this service]
**Rate Limits:** [Request limits to be aware of]

**Integration Points:**
- [Where in our app we call this service]

**Example:**
```
Stripe Payment API

Purpose: Process customer payments
API: https://stripe.com/docs/api
Authentication: Secret API key (client provides)
Rate Limits: 100 requests/second

Integration Points:
- Checkout flow (POST /api/checkout/create-payment-intent)
- Webhook handler (POST /api/webhooks/stripe) for payment confirmations
```

---

### [Service Name 2]

[Same structure]

---

## Security Approach

### Authentication

**Method:** [JWT / Session cookies / OAuth / etc.]

**Token Storage:** [Where tokens are stored on client]

**Token Expiry:** [How long tokens are valid]

**Example:**
- Method: JWT tokens
- Storage: httpOnly cookies (prevent XSS)
- Expiry: 24 hours (refresh tokens valid for 30 days)
- Refresh: Automatic refresh when <1 hour remaining

---

### Authorization

**Access Control:** [RBAC / attribute-based / etc.]

**Permissions:**
- [Role 1]: Can [action1, action2]
- [Role 2]: Can [action1, action2, action3]

**Example:**
- user: Can view their own data, create orders
- admin: Can view all data, create/update/delete users, view analytics

---

### Data Protection

**Password Security:**
- Hashing: [bcrypt / argon2 / etc.]
- Cost factor: [e.g., bcrypt cost 12]

**Encryption:**
- Data in transit: HTTPS (TLS 1.3)
- Data at rest: [Database encryption if applicable]

**Backups:**
- Frequency: [Daily / hourly]
- Retention: [How long backups kept]
- Location: [Where backups stored]

**Compliance:**
- [GDPR / HIPAA / PCI-DSS if applicable]

**Example:**
- Passwords: bcrypt (cost factor 12)
- HTTPS enforced for all endpoints
- Database: Render managed backups (daily, 7-day retention)
- GDPR: User data export and deletion endpoints implemented

---

### Secrets Management

**Environment Variables:**
[How secrets are managed]

**Example:**
- Development: `.env.local` (gitignored)
- Staging: Vercel environment variables
- Production: Vercel environment variables (encrypted)

**Required Secrets:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Token signing key
- `STRIPE_SECRET_KEY` - Stripe API key (client provides)

---

## Performance Considerations

**Caching:**
- [What is cached, where, and for how long]

**Example:**
- API responses: Redis cache (5 minute TTL)
- Static assets: CDN edge caching (1 year TTL)
- Database queries: In-memory LRU cache (100 items, 1 minute TTL)

**Optimization Strategies:**
- [Database query optimization]
- [Image optimization]
- [Code splitting]

**Example:**
- Database: Indexes on frequently queried fields (email, user_id)
- Images: Next.js Image component (automatic WebP conversion, lazy loading)
- Code: Dynamic imports for heavy components

---

## Deployment Architecture

**Environments:**
- Development: Local (localhost:3000)
- Staging: [staging URL]
- Production: [production URL]

**Example:**
- Development: localhost:3000 (Next.js dev server)
- Staging: https://staging-app.vercel.app
- Production: https://app.example.com

**Deployment Process:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Example:**
1. Push to `main` branch (GitHub)
2. Vercel auto-deploys to staging
3. Manual promotion to production after QA approval
4. Database migrations run automatically via Prisma

---

## Monitoring & Observability

**Error Tracking:** [Sentry / LogRocket / etc.]
**Performance Monitoring:** [Vercel Analytics / New Relic / etc.]
**Uptime Monitoring:** [Better Uptime / Pingdom / etc.]

**Alerts:**
- [When alerts are triggered]

**Example:**
- Error tracking: Sentry (production errors trigger Slack alert)
- Performance: Vercel Analytics (built-in)
- Uptime: Better Uptime (checks every 1 minute, alerts if down >2 minutes)

---

## Technology Deviations

**IF this mission deviates from standard ScopeLock stack:**

### Deviation 1: [Technology/Stack]

**Standard:** [What standard stack recommends]
**Actual:** [What we're using instead]
**Reason:** [Why deviation is necessary]
**Approved By:** NLR on [date]

**Example:**
```
Deviation 1: Backend Framework

Standard: Python FastAPI on Render
Actual: Django on Railway
Reason: Client has existing Django codebase; integration required
Approved By: NLR on 2025-11-01
```

---

## Notes

[Any additional architectural context, trade-offs considered, future considerations]
