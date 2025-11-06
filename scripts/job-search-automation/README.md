# Job Search Automation

**Status:** Production Ready - Real API Integration ✅
**Tech Stack:** Next.js 14, TypeScript, Zustand, FastAPI Backend

---

## Quick Start

### Prerequisites
```bash
# Backend must be running on port 8001
cd backend && uvicorn main:app --reload --port 8001

# FalkorDB must be running with seed data
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Starts on port 3001
```

### Environment Variables
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## Architecture

**Frontend (Next.js + Zustand):**
- `types.ts` - TypeScript interfaces
- `api.ts` - API client (connects to FastAPI)
- `stores/` - Zustand stores (jobStore, proposalStore, metricsStore)

**Backend (FastAPI):**
- `/api/jobs/feed?platform={upwork|contra}` - Get jobs
- `/api/proposals/draft` - Generate proposal
- `/api/proposals/submit` - Submit proposal
- `/api/proposals/reject` - Reject proposal
- `/api/proposals/revise` - Request revision
- `/api/metrics/weekly?start={date}&end={date}` - Weekly metrics
- `/api/metrics/pipeline` - Proposal pipeline

**Database (FalkorDB):**
- Graph database storing jobs, proposals, clients, tasks

---

## Key Features

**Emma's Scoring (0-13 points):**
- Stack Match (0-3): Next.js+Tailwind=3
- Budget Fit (0-2): $200-600=2
- Clear Scope (0-2): Detailed=2
- Client Quality (0-2): Verified=2
- Timeline (0-1): 3-7 days=1
- AI Fit (0-3): AI opportunity=2-3

**Thresholds:**
- 8-13 = strong_yes (green)
- 6-7 = maybe (yellow)
- 0-5 = pass (red)

---

## Deployment

**Frontend: Vercel**
```bash
vercel --prod
# Set environment variable: NEXT_PUBLIC_API_URL={production_backend_url}
```

**Backend: Render**
```bash
# Deploy via Render dashboard
# Set CORS to allow Vercel domain
```

---

## Testing

```bash
# Unit tests (TODO)
npm test

# Integration test
curl http://localhost:8001/api/jobs/feed?platform=upwork
```

---

**Created:** 2025-11-06
**Team:** ScopeLock - rafael@scopelock
