# ScopeLock Repository Map

**Last Updated**: 2025-11-02
**Purpose**: Queryable navigation map with bidirectional script ↔ documentation links

---

## Repository Structure

```
scopelock/
├── 📋 REPO_MAP.md                    # THIS FILE - Complete repository navigation
├── 📋 repo-index.json                # Machine-readable repository index
├── 📄 README.md                      # Project overview
├── 📄 package.json                   # Next.js dependencies
│
├── 🌐 src/                           # Next.js website (scopelock.mindprotocol.ai)
│   ├── app/                          # App Router pages
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx            # About page
│   │   ├── pricing/page.tsx          # Pricing tiers
│   │   ├── proof/                    # Proof Log pages
│   │   │   ├── page.tsx              # Index: /proof
│   │   │   └── [tag]/page.tsx        # Detail: /proof/[tag]
│   │   └── blog/                     # Case studies
│   │       └── la-serenissima/       # La Serenissima case study
│   ├── components/                   # Shared components
│   └── globals.css                   # Global styles
│
├── 🧪 tests/                         # Acceptance tests
│   ├── acceptance/                   # Playwright E2E tests
│   │   ├── pages.spec.ts             # F1: Core Pages ✅
│   │   ├── navigation.spec.ts        # F2: Navigation & UX ✅
│   │   ├── content.spec.ts           # F3: Content Quality ✅
│   │   ├── seo.spec.ts               # F4: SEO & Metadata ✅
│   │   └── deployment.spec.ts        # NF2: Deployment (prod-only)
│   └── playwright.config.ts          # Playwright configuration
│
├── 📜 scripts/                       # Build & automation scripts
│   ├── run-test.mjs                  # Test runner (npm test)
│   │   └── 📖 docs: tests/README.md
│   └── track-lead.py                 # Lead tracking CLI (future)
│       └── 📖 docs: docs/automation/SPEC.md#lead-tracker
│
├── 🤖 citizens/                      # AI citizens (system prompts)
│   ├── CLAUDE.md                     # Team-wide citizen guide
│   ├── SYNC.md                       # Cross-citizen status tracker
│   ├── emma/                         # Emma "The Scout" (Lead Intelligence)
│   │   ├── CLAUDE.md                 # Emma system prompt
│   │   ├── WORKFLOW.md               # Manual Upwork process
│   │   ├── leads-tracker.md          # Session tracker
│   │   └── proposals/                # Generated proposals (.txt)
│   ├── rafael/                       # Rafael "The Harbor" (Client Relations)
│   │   └── CLAUDE.md                 # Rafael system prompt
│   ├── daniel/                       # Daniel "The Forge" (Core Builder)
│   │   └── CLAUDE.md                 # Daniel system prompt
│   ├── sofia/                        # Sofia "The Gauge" (Quality Guardian)
│   │   └── CLAUDE.md                 # Sofia system prompt
│   ├── aicha/                        # Aïcha "The Architect" (Architecture)
│   │   └── CLAUDE.md                 # Aïcha system prompt
│   └── maya/                         # Maya "The Facet" (Frontend)
│       └── CLAUDE.md                 # Maya system prompt
│
├── 📚 docs/                          # Documentation
│   ├── process/                      # ScopeLock process docs
│   │   ├── delivery_model.md         # Core delivery model
│   │   └── change_control.md         # CHG-130 spec
│   ├── automation/                   # Automation specs
│   │   └── SPEC.md                   # Feature specs (Rafael, Lead Tracker, etc.)
│   │       └── 🔗 implements: backend/
│   ├── portfolio/                    # Past projects (proof points)
│   │   └── README.md                 # 7 projects with "Use when" guidance
│   ├── marketing/                    # Client communication
│   │   ├── communication_guide.md    # Client archetypes & language rules
│   │   ├── proposal_framework.md     # Proposal structure & templates
│   │   ├── proposal_templates/       # Ready-to-use templates
│   │   └── README.md                 # 5-question test & quick links
│   ├── design/                       # Design specs (new)
│   ├── initial/                      # Initial project docs (new)
│   └── research/                     # Research notes (new)
│
├── 🔧 proofgen/                      # Proof page generator
│   ├── index.js                      # Main generator script
│   │   └── 📖 docs: docs/automation/SPEC.md#proof-regeneration
│   └── templates/                    # HTML templates
│
├── 📁 public/                        # Static assets
│   ├── brand/                        # Logo, icons
│   └── proof/                        # Generated proof pages
│       ├── index.html                # Proof log index
│       ├── index.json                # API for homepage teaser
│       └── [tag]/index.html          # Detail pages
│
├── 🗂️ proof/                         # Proof source files (committed with tags)
│   ├── AC.md                         # Acceptance Criteria
│   ├── DEMO.md                       # Demo URL + description
│   ├── DELTA.md                      # Quantified changes
│   └── CR.md                         # Change Request (optional)
│
└── 🐍 backend/                       # Python automation backend
    ├── ARCHITECTURE.md               # System design
    │   └── 📖 spec: docs/automation/SPEC.md
    ├── README.md                     # Quick start guide
    ├── requirements.txt              # Python dependencies
    ├── render.yaml                   # Render deployment config
    └── app/
        ├── main.py                   # FastAPI app entry point
        ├── config.py                 # Environment settings
        ├── contracts.py              # Pydantic request/response models
        ├── api/                      # HTTP endpoints (to implement)
        ├── services/                 # Business logic (to implement)
        │   ├── rafael_responder.py   # Auto-draft Upwork responses
        │   ├── lead_tracker.py       # Track Emma evaluations
        │   └── event_hub.py          # Pub/sub event system
        ├── integrations/             # External API clients (to implement)
        │   ├── anthropic_client.py   # Claude API
        │   ├── telegram_client.py    # Telegram Bot
        │   └── upwork_client.py      # Upwork API
        └── data/                     # Persistent storage
            ├── events.jsonl          # Event log
            ├── leads.json            # Lead evaluations
            └── responses.log         # Sent responses
```

---

## Key Documents by Purpose

### 🎯 Getting Started
- **Project Overview**: [`README.md`](../README.md)
- **Team Structure**: [`citizens/CLAUDE.md`](citizens/CLAUDE.md)
- **Current Status**: [`citizens/SYNC.md`](citizens/SYNC.md)

### 📦 ScopeLock Process
- **Delivery Model**: [`docs/process/delivery_model.md`](docs/process/delivery_model.md)
- **Change Control (CHG-130)**: [`docs/process/change_control.md`](docs/process/change_control.md)
- **Proof Log System**: [`docs/automation/SPEC.md#proof-regeneration`](docs/automation/SPEC.md)

### 👥 Client Communication (Emma/Rafael)
- **Communication Guide**: [`docs/marketing/communication_guide.md`](docs/marketing/communication_guide.md) ⭐⭐
- **Proposal Framework**: [`docs/marketing/proposal_framework.md`](docs/marketing/proposal_framework.md)
- **Portfolio Projects**: [`docs/portfolio/README.md`](docs/portfolio/README.md)
- **Proposal Templates**: [`docs/marketing/proposal_templates/`](docs/marketing/proposal_templates/)

### 🏗️ Architecture & Implementation
- **Acceptance Criteria**: [`proof/AC.md`](proof/AC.md)
- **Backend Architecture**: [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md)
- **Automation Spec**: [`docs/automation/SPEC.md`](docs/automation/SPEC.md)
- **Test Suite**: [`tests/acceptance/`](tests/acceptance/)

### 🤖 Citizen Roles
- **Emma** (Lead Intelligence): [`citizens/emma/CLAUDE.md`](citizens/emma/CLAUDE.md)
- **Rafael** (Client Relations): [`citizens/rafael/CLAUDE.md`](citizens/rafael/CLAUDE.md)
- **Daniel** (Core Builder): [`citizens/daniel/CLAUDE.md`](citizens/daniel/CLAUDE.md)
- **Sofia** (Quality Guardian): [`citizens/sofia/CLAUDE.md`](citizens/sofia/CLAUDE.md)
- **Aïcha** (Architecture): [`citizens/aicha/CLAUDE.md`](citizens/aicha/CLAUDE.md)
- **Maya** (Frontend): [`citizens/maya/CLAUDE.md`](citizens/maya/CLAUDE.md)

---

## Script → Documentation Map

| Script | Purpose | Documentation | Status |
|--------|---------|---------------|--------|
| `scripts/run-test.mjs` | Run Playwright tests | [`tests/README.md`](tests/README.md) | ✅ Active |
| `scripts/track-lead.py` | Track Emma evaluations | [`docs/automation/SPEC.md#lead-tracker`](docs/automation/SPEC.md) | 📝 Spec only |
| `proofgen/index.js` | Generate proof pages | [`docs/automation/SPEC.md#proof-regeneration`](docs/automation/SPEC.md) | ✅ Active |
| `backend/app/main.py` | FastAPI backend | [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md) | 🚧 Scaffolded |

---

## Documentation → Implementation Map

| Documentation | Implements | Status |
|---------------|------------|--------|
| [`docs/automation/SPEC.md#proof-regeneration`](docs/automation/SPEC.md) | `proofgen/index.js` | ✅ Implemented |
| [`docs/automation/SPEC.md#rafael-responder`](docs/automation/SPEC.md) | `backend/app/services/rafael_responder.py` | 📝 Spec only |
| [`docs/automation/SPEC.md#lead-tracker`](docs/automation/SPEC.md) | `backend/app/services/lead_tracker.py` + `scripts/track-lead.py` | 📝 Spec only |
| [`proof/AC.md`](proof/AC.md) | `tests/acceptance/*.spec.ts` | ✅ Implemented (26 tests) |
| [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md) | `backend/app/` | 🚧 Infrastructure only |

---

## Citizen → Responsibilities Map

| Citizen | Domain | Key Files | Documentation |
|---------|--------|-----------|---------------|
| **Emma** | Lead Intelligence | `citizens/emma/proposals/`, `scripts/track-lead.py` | [`citizens/emma/CLAUDE.md`](citizens/emma/CLAUDE.md) |
| **Rafael** | Client Relations | `backend/app/services/rafael_responder.py` | [`citizens/rafael/CLAUDE.md`](citizens/rafael/CLAUDE.md) |
| **Daniel** | Core Builder | `src/`, `backend/`, `tests/`, `proofgen/` | [`citizens/daniel/CLAUDE.md`](citizens/daniel/CLAUDE.md) |
| **Sofia** | Quality Guardian | `tests/`, CI/CD, linting | [`citizens/sofia/CLAUDE.md`](citizens/sofia/CLAUDE.md) |
| **Aïcha** | Architecture | `docs/process/`, `backend/ARCHITECTURE.md`, schemas | [`citizens/aicha/CLAUDE.md`](citizens/aicha/CLAUDE.md) |
| **Maya** | Frontend | `src/app/`, `src/components/`, CSS | [`citizens/maya/CLAUDE.md`](citizens/maya/CLAUDE.md) |

---

## Event Flow Map

### Website Build & Deploy
```
Developer → git tag → GitHub → Vercel
  ↓
Vercel build: npm run build
  ↓
proofgen/index.js → reads tags → generates public/proof/*.html
  ↓
Next.js build → static pages
  ↓
Deploy to scopelock.mindprotocol.ai
```

**Documentation**: [`docs/automation/SPEC.md#proof-regeneration`](docs/automation/SPEC.md)

---

### Upwork Response Flow (Future)
```
Client responds → Gmail → Webhook → backend/app/api/webhooks.py
  ↓
rafael_responder.py → Claude API → Draft response
  ↓
confidence >= 80%? → Auto-send : Telegram approval
  ↓
Upwork API → Response sent
  ↓
Event logged to data/events.jsonl
```

**Documentation**: [`docs/automation/SPEC.md#rafael-responder`](docs/automation/SPEC.md)
**Implementation**: [`backend/app/services/rafael_responder.py`](backend/app/services/rafael_responder.py) (to implement)

---

### Lead Tracking Flow (Future)
```
Emma evaluates post → DECISION: GO/NO-GO
  ↓
scripts/track-lead.py → Append to data/leads.json
  ↓
Regenerate citizens/emma/leads-tracker.md
  ↓
Event: lead.tracked@1.0
```

**Documentation**: [`docs/automation/SPEC.md#lead-tracker`](docs/automation/SPEC.md)
**Implementation**: [`backend/app/services/lead_tracker.py`](backend/app/services/lead_tracker.py) (to implement)

---

## Technology Stack

| Layer | Technology | Files |
|-------|------------|-------|
| **Frontend** | Next.js 14, React, TypeScript | `src/`, `public/` |
| **Testing** | Playwright, Pytest | `tests/` |
| **Backend** | Python 3.11+, FastAPI, Uvicorn | `backend/` |
| **AI** | Anthropic Claude API | `backend/app/integrations/anthropic_client.py` |
| **Deployment** | Vercel (frontend), Render (backend) | `.github/workflows/`, `render.yaml` |
| **Data** | JSONL (events), JSON (leads), PostgreSQL (future) | `backend/app/data/` |

---

## Quick Navigation

### I want to...

**...understand ScopeLock's delivery model**
→ [`docs/process/delivery_model.md`](docs/process/delivery_model.md)

**...write a proposal for Upwork**
→ [`docs/marketing/communication_guide.md`](docs/marketing/communication_guide.md) (detect client type)
→ [`docs/marketing/proposal_templates/`](docs/marketing/proposal_templates/) (use template)
→ [`docs/portfolio/README.md`](docs/portfolio/README.md) (pick proof point)

**...understand how proof pages work**
→ [`docs/automation/SPEC.md#proof-regeneration`](docs/automation/SPEC.md)
→ [`proofgen/index.js`](proofgen/index.js) (implementation)

**...run acceptance tests**
→ `npm test` (runs `scripts/run-test.mjs`)
→ [`tests/acceptance/`](tests/acceptance/) (test files)
→ [`proof/AC.md`](proof/AC.md) (acceptance criteria)

**...deploy the backend**
→ [`backend/README.md`](backend/README.md) (quick start)
→ [`backend/ARCHITECTURE.md`](backend/ARCHITECTURE.md) (system design)
→ [`render.yaml`](render.yaml) (deployment config)

**...know what each citizen does**
→ [`citizens/CLAUDE.md`](citizens/CLAUDE.md) (team structure)
→ [`citizens/SYNC.md`](citizens/SYNC.md) (current status)

**...see recent activity**
→ [`citizens/SYNC.md`](citizens/SYNC.md)

**...understand the automation roadmap**
→ [`docs/automation/SPEC.md`](docs/automation/SPEC.md)

---

## Status Legend

- ✅ **Implemented & Tested** - Code exists, tests pass
- 🚧 **In Progress** - Partially implemented
- 📝 **Spec Only** - Documented but not built
- ❌ **Deprecated** - No longer used
- ⏭️ **Skipped** - Deferred to future iteration

---

## Querying This Map

### JSON Index
```bash
# Machine-readable repository structure
cat repo-index.json | jq '.scripts[] | select(.status == "active")'
```

### Find Documentation for a Script
```bash
# Example: Find docs for run-test.mjs
grep -A 2 "run-test.mjs" REPO_MAP.md | grep "docs:"
# Result: docs: tests/README.md
```

### Find Implementation for a Doc
```bash
# Example: Find implementation of rafael-responder
grep -A 2 "rafael-responder" REPO_MAP.md | grep "implements:"
# Result: implements: backend/app/services/rafael_responder.py
```

---

## Maintenance

**Update this map when**:
1. Adding new scripts → Add entry to "Script → Documentation Map"
2. Creating new docs → Add entry to "Documentation → Implementation Map"
3. Implementing a spec → Update status from 📝 to 🚧 or ✅
4. Restructuring directories → Update "Repository Structure"

**Who maintains**:
- **Daniel**: Scripts, tests, backend implementation
- **Aïcha**: Architecture docs, specs, contracts
- **Emma/Rafael**: Marketing/communication docs

**Last verified**: 2025-11-02 by Daniel

---

## External Links

- **Production Site**: https://scopelock.mindprotocol.ai
- **GitHub Repo**: https://github.com/mind-protocol/scopelock
- **Vercel Dashboard**: https://vercel.com/mind-protocol/scopelock
- **Render Dashboard**: https://dashboard.render.com (backend, when deployed)

---

**Next**: See [`repo-index.json`](repo-index.json) for machine-readable format.
