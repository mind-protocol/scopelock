# ScopeLock Standard Tech Stack

**Purpose:** Define the default technology stack for all ScopeLock client projects
**Owner:** Rafael (implementation) + Inna (specification)
**Last Updated:** 2025-11-05

---

## Why Standardize?

**Benefits:**
1. **Speed:** We know these stacks deeply, no learning curve per project
2. **Quality:** Proven patterns, debugged solutions, reliable deployments
3. **Budget:** Subscription tools (Claude Code) vs pay-per-token APIs = predictable costs
4. **Handoffs:** Any developer can jump into any project immediately
5. **Documentation:** Inna's docs are faster (known architecture patterns)
6. **Deployment:** One-click deploys, no custom DevOps required

**Rule:** Use standard stack unless client has hard constraints. Deviations require NLR approval.

---

## Standard Stack (Use by Default)

### Frontend

**Framework:** Next.js (latest stable)
**Deployment:** Vercel

**Why:**
- Zero-config deployment (push to GitHub → auto-deploy)
- Edge optimization built-in
- Excellent performance (Core Web Vitals)
- Built-in Image optimization
- App Router + Server Components (modern React patterns)

**Typical setup:**
```
frontend/ (or src/ if monorepo)
├── app/              # App Router pages
├── components/       # React components
├── lib/             # Utilities, API clients
├── public/          # Static assets
└── package.json
```

**Deploy:** Connect GitHub repo to Vercel → automatic deployments

---

### Backend

**Framework:** Python (FastAPI or Django)
**Deployment:** Render

**Why:**
- Rapid development (FastAPI auto-generates API docs)
- Excellent for AI/ML integration (Python ecosystem)
- Reliable managed hosting (Render)
- Easy database integration
- Strong typing (Pydantic for FastAPI, Django ORM)

**When to use FastAPI:**
- New API-first projects
- Need async/high performance
- Want auto-generated OpenAPI docs

**When to use Django:**
- Need admin panel
- Complex relational data with ORM
- Traditional web app with templates

**Typical setup:**
```
backend/
├── app/              # Application code
│   ├── main.py      # FastAPI entry point
│   ├── routers/     # API routes
│   ├── models/      # Database models
│   └── schemas/     # Pydantic schemas
├── tests/           # Tests
└── requirements.txt
```

**Deploy:** Connect GitHub repo to Render → automatic deployments

**Alternative (if no separate backend needed):**
- Next.js API Routes (serverless functions on Vercel)
- Use when: Simple API, no complex business logic, collocated with frontend

---

### Database

**Two options based on complexity:**

#### Option 1: Airtable
**Use when:**
- Simple CRUD operations
- Client wants to edit data directly (no-code admin)
- Low complexity (< 5 tables, no complex JOINs)
- Rapid prototyping

**Pros:**
- Client can self-service data management
- No database setup required
- Built-in API
- Visual interface for non-technical users

**Cons:**
- Limited to 50,000 records per base (free tier)
- No complex queries (no JOINs)
- API rate limits (5 requests/second)

**Typical use cases:**
- Contact forms → Airtable rows
- Product catalogs (small)
- Content management (blog posts, FAQs)

---

#### Option 2: PostgreSQL
**Use when:**
- Complex relational data
- Need JOINs and transactions
- High performance requirements
- Production-grade scale
- > 5 tables or > 50,000 records

**Hosting:** Render (managed PostgreSQL)

**Pros:**
- Production-grade performance
- ACID compliance
- Complex queries with JOINs
- Unlimited scale (with proper indexing)
- Full SQL support

**Cons:**
- Requires migrations
- Client cannot edit directly (need admin panel)

**Typical use cases:**
- E-commerce (products, orders, inventory)
- SaaS applications (multi-tenant)
- Healthcare (HIPAA-compliant data)
- Any production application

---

### AI Integration (CRITICAL - Budget Compliance)

#### Internal Development (ScopeLock Team)

**ONLY use Claude Code:**

```bash
cd project-directory
claude -p "Generate login API endpoint with JWT auth" --continue
```

**Why CRITICAL:**
- Budget: Subscription (€20/month) vs API costs ($$$)
- Keeps us profitable
- Predictable costs

**NEVER:**
- Direct API calls to Claude (`anthropic` library)
- Direct API calls to OpenAI (`openai` library)
- Any pay-per-token LLM API

**Exception:** Only if client explicitly pays for API costs separately

---

#### Client-Facing AI Features (Client's Budget)

**If client's app needs LLM features:**

**Recommended:** Use client's API keys + budget

**Example:**
```
Client wants AI chatbot in their app:
- Client provides OpenAI API key (or Anthropic)
- Client pays for API usage
- We implement using their keys in environment variables
```

**Document clearly:**
- API costs are client's responsibility
- Usage monitoring recommended
- Rate limiting implementation required

---

### Image Generation

**Service:** Ideogram
**Usage:** Client's account + budget (if needed)

---

### Voice Generation

**Service:** Eleven Labs
**Usage:** Client's account + budget (if needed)

---

### Testing

#### Frontend (Next.js)
**Framework:** Playwright
**Why:** E2E testing, headless browsers, excellent CI integration

**Typical setup:**
```
tests/
├── acceptance/
│   ├── auth.spec.ts
│   └── dashboard.spec.ts
└── playwright.config.ts
```

---

#### Backend (Python)
**Framework:** pytest
**Why:** Standard Python testing, fixtures, parametrize

**Typical setup:**
```
tests/
├── acceptance/
│   ├── test_auth.py
│   └── test_users.py
└── conftest.py
```

---

## Default Project Structures

### Structure 1: Next.js + Python + PostgreSQL

**Use when:** Full-stack app with separate frontend/backend

```
project-root/
├── frontend/              # Next.js (deploy to Vercel)
│   ├── src/app/
│   ├── components/
│   └── package.json
│
├── backend/               # Python FastAPI (deploy to Render)
│   ├── app/
│   ├── tests/
│   └── requirements.txt
│
├── docs/                  # ScopeLock documentation
│   └── missions/[name]/
│
└── README.md
```

---

### Structure 2: Next.js + Airtable (Fullstack)

**Use when:** Simple app, no complex backend logic

```
project-root/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   └── page.tsx     # Pages
│   ├── components/      # React components
│   └── lib/
│       └── airtable.ts  # Airtable client
│
├── docs/                # ScopeLock documentation
├── tests/               # Playwright tests
└── package.json
```

---

### Structure 3: Next.js + PostgreSQL (Fullstack)

**Use when:** Medium complexity, PostgreSQL needed, no separate backend

```
project-root/
├── src/
│   ├── app/
│   │   ├── api/         # Next.js API routes
│   │   └── page.tsx
│   ├── components/
│   └── lib/
│       └── prisma.ts    # Prisma client
│
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/
│
├── docs/
├── tests/
└── package.json
```

---

## When to Deviate (Rare)

**Only deviate from standard stack if:**

1. **Client has existing infrastructure** we must integrate with
   - Example: Client has existing Django app we must extend
   - Decision: Use Django (deviation approved)

2. **Client has hard technical constraints**
   - Example: Must use AWS (company policy)
   - Decision: Deploy to AWS instead of Vercel/Render (deviation approved)

3. **Client explicitly requests and pays for different stack**
   - Example: Client wants React Native mobile app
   - Decision: Use React Native (deviation approved)

**Decision process:**
1. Document WHY standard stack won't work in `PATTERN.md`
2. Flag to NLR for approval BEFORE writing `MECHANISM.md`
3. Get explicit approval with date
4. Document deviation in `MECHANISM.md` with reasoning

---

## Technology Versions (Recommended)

**Frontend:**
- Node.js: ≥ 18.0.0
- Next.js: ≥ 14.0.0
- React: ≥ 18.0.0 (bundled with Next.js)
- TypeScript: ≥ 5.0.0

**Backend:**
- Python: ≥ 3.11
- FastAPI: ≥ 0.104.0
- Django: ≥ 4.2 (LTS)
- Pydantic: ≥ 2.0.0

**Database:**
- PostgreSQL: ≥ 15
- Prisma (ORM for Next.js): ≥ 5.0.0

**Testing:**
- Playwright: ≥ 1.40.0
- pytest: ≥ 7.0.0

---

## Deployment Platforms

**Vercel (Frontend):**
- Automatic deployments on git push
- Preview deployments for PRs
- Environment variables UI
- Analytics built-in
- Free tier generous

**Render (Backend + Database):**
- Automatic deployments on git push
- Managed PostgreSQL
- Free tier available
- Environment variables UI
- Logs dashboard

**Why these platforms:**
- Zero DevOps configuration
- Reliable uptime
- Automatic HTTPS
- Easy rollbacks
- Predictable pricing

---

## Standard Dependencies

### Frontend (Next.js)

**Core:**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "playwright": "^1.40.0"
  }
}
```

**Optional (common additions):**
- `zod`: Input validation
- `tailwindcss`: Styling (if not using CSS modules)
- `swr` or `@tanstack/react-query`: Data fetching

---

### Backend (FastAPI)

**Core:**
```txt
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```

**Database (PostgreSQL):**
```txt
psycopg2-binary>=2.9.0  # PostgreSQL adapter
sqlalchemy>=2.0.0       # ORM (optional)
```

**Testing:**
```txt
pytest>=7.0.0
httpx>=0.25.0  # For testing FastAPI
```

---

## Quick Decision Tree

**"Which stack should I use?"**

```
Does client have existing infrastructure we must use?
├─ Yes → Document in PATTERN.md, get NLR approval, use their stack
└─ No  → Continue

Is this a simple CRUD app with < 5 tables?
├─ Yes → Next.js + Airtable (fullstack)
└─ No  → Continue

Does it need complex business logic or AI/ML?
├─ Yes → Next.js (frontend) + Python FastAPI (backend) + PostgreSQL
└─ No  → Next.js (fullstack) + PostgreSQL + API Routes
```

---

## Examples from Past Projects

**TherapyKin (therapykin.ai):**
- Stack: Next.js + Airtable
- Why: Simple content management, client wanted direct data editing
- Result: 121+ deployments, rapid iteration

**La Serenissima (serenissima.ai):**
- Stack: Custom (multi-agent system, event-native)
- Why: Research project, requires Mind Protocol infrastructure
- Note: Deviation approved (not client project)

**KongInvest (konginvest.ai):**
- Stack: Python + PostgreSQL + Solana SDK
- Why: Trading bot, complex financial logic, blockchain integration
- Result: $75k$ AUM under management

---

## Questions?

**"Can I use [different framework]?"**
- Only with NLR approval after documenting justification in PATTERN.md

**"Client wants [technology X]"**
- If it's in standard stack: Yes, proceed
- If not: Document reason in PATTERN.md, get NLR approval

**"What if standard stack doesn't fit?"**
- Very rare - usually can adapt standard stack to needs
- If genuinely won't work: Follow deviation process above

---

**For technical stack questions:** Ask Rafael (The Guide)
**For documentation:** Ask Inna (The Specifier)
**For approvals:** Ask NLR
