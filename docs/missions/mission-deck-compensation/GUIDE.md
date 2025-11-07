# GUIDE: Mission Deck Compensation System

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Setup, deployment, and usage guide for compensation system

---

## Local Development Setup

### Prerequisites

**Backend:**
- Python 3.11+
- pip (Python package manager)
- Access to FalkorDB production instance

**Frontend:**
- Node.js 18+
- npm or yarn

**Required accounts/access:**
- FalkorDB API key (from Mind Protocol production instance)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

---

### Step 1: Clone Repository

```bash
# If not already cloned
git clone https://github.com/mind-protocol/scopelock.git
cd scopelock
```

---

### Step 2: Backend Setup

#### Install Dependencies

```bash
cd docs/missions/mission-deck/backend
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.104.0 uvicorn-0.24.0 requests-2.31.0 ...
```

#### Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# FalkorDB Production Connection
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock

# Auth & Security
JWT_SECRET=<generate 256-bit random string>
NLR_ROLE_SLUG=nlr

# CORS (for local development)
CORS_ORIGINS=http://localhost:3000,http://localhost:3002

# Server
PORT=8000
```

**Generate JWT secret:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

#### Verify FalkorDB Connection

```bash
python3 scripts/test-falkordb-connection.py
```

**Expected output:**
```
✅ Connected to FalkorDB!
Found 234 nodes in scopelock graph
Connection test passed
```

#### Run Backend Server

```bash
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345]
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify server running:**
```bash
curl http://localhost:8000/health
```

**Expected:** `{"status": "ok"}`

---

### Step 3: Frontend Setup

#### Install Dependencies

```bash
cd ../../frontend  # From backend/ go to frontend/
npm install
```

**Expected output:**
```
added 1534 packages in 45s
```

#### Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Backend API URL (local development)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Production URL (commented out for local dev)
# NEXT_PUBLIC_API_URL=https://deck.scopelock.mindprotocol.ai/api
```

#### Run Frontend Dev Server

```bash
npm run dev
```

**Expected output:**
```
   ▲ Next.js 14.2.33
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.10:3000

 ✓ Ready in 2.1s
```

**Verify frontend:**
Open browser: `http://localhost:3000`

---

### Step 4: Seed Test Data

Create test jobs, missions, and interactions for local development:

```bash
cd ../backend
python3 scripts/seed-compensation-test-data.py
```

**Expected output:**
```
✅ Created 3 test jobs:
   - job-therapykin-chatbot-2025-11 ($1,500)
   - job-startupx-landing-2025-11 ($800)
   - job-techcorp-dashboard-2025-11 ($1,200)

✅ Created 5 test missions:
   - mission-proposal-ai-analytics ($1)
   - mission-x-post-scopelock ($2)
   - mission-recruitment-developer ($10)
   - mission-proposal-chatbot ($1)
   - mission-blog-post ($5)

✅ Seeded 45 interactions across 2 test members:
   - member_a: 25 interactions
   - member_b: 20 interactions

✅ Mission fund balance: $150.00

✅ Test data seed complete!

Member earnings:
- member_a: $164.00 potential
- member_b: $89.00 potential
```

---

### Step 5: Run Tests Locally

#### Backend Tests

```bash
cd backend
pytest tests/compensation/ -v --cov=services/compensation
```

**Expected output:**
```
tests/compensation/test_interaction_tracker.py::test_interaction_increments_on_message_sent PASSED
tests/compensation/test_interaction_tracker.py::test_interaction_counts_only_in_job_thread PASSED
...
tests/compensation/test_payment_processor.py::test_payment_trigger_requires_nlr_role PASSED

========== 47 passed in 12.3s ==========

Coverage report:
services/compensation/__init__.py          100%
services/compensation/interaction_tracker.py    98%
services/compensation/earnings_calculator.py    100%
services/compensation/mission_manager.py        97%
services/compensation/payment_processor.py      95%
------------------------------------------------------------
TOTAL                                      97%
```

#### Frontend Tests

```bash
cd ../frontend
npm test
```

**Expected output:**
```
 PASS  tests/compensation-ui.test.tsx
  ✓ test_earnings_banner_displays_total (45ms)
  ✓ test_earnings_update_on_new_interaction (123ms)
  ✓ test_job_card_shows_interaction_count (78ms)
  ...

Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
Time:        8.234s
```

#### E2E Tests

```bash
npx playwright test tests/e2e/compensation-flow.spec.ts
```

**Expected output:**
```
Running 12 tests using 3 workers

  ✓  [chromium] › compensation-flow.spec.ts:1:1 › complete job compensation flow (12s)
  ✓  [firefox] › compensation-flow.spec.ts:1:1 › complete job compensation flow (14s)
  ✓  [webkit] › compensation-flow.spec.ts:1:1 › complete job compensation flow (13s)
  ...

  12 passed (1.2m)
```

---

## Deployment

### Backend Deployment (Render)

#### Step 1: Configure Render Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect to GitHub repository: `mind-protocol/scopelock`
4. Configure:
   - **Name:** scopelock-compensation-backend
   - **Runtime:** Python 3.11
   - **Build Command:** `cd docs/missions/mission-deck/backend && pip install -r requirements.txt`
   - **Start Command:** `cd docs/missions/mission-deck/backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Starter ($7/month)
   - **Region:** Oregon (same as FalkorDB)

#### Step 2: Add Environment Variables

In Render dashboard, add:

```
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock
JWT_SECRET=<your-256-bit-secret>
NLR_ROLE_SLUG=nlr
CORS_ORIGINS=https://deck.scopelock.mindprotocol.ai
PORT=10000
```

#### Step 3: Deploy

Click "Create Web Service"

**Expected:**
- Build completes in ~5 minutes
- Service starts successfully
- Health check passes: `https://scopelock-compensation-backend.onrender.com/health`

#### Step 4: Verify Deployment

```bash
curl https://scopelock-compensation-backend.onrender.com/health
```

**Expected:** `{"status": "ok"}`

Test API endpoint:
```bash
curl https://scopelock-compensation-backend.onrender.com/api/compensation/jobs
```

**Expected:** JSON list of jobs

---

### Frontend Deployment (Vercel)

#### Step 1: Configure Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import GitHub repository: `mind-protocol/scopelock`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `docs/missions/mission-deck/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### Step 2: Add Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://scopelock-compensation-backend.onrender.com/api
```

#### Step 3: Deploy

Click "Deploy"

**Expected:**
- Build completes in ~3 minutes
- Deployment successful
- Live URL: `https://deck-scopelock.vercel.app`

#### Step 4: Verify Deployment

Open browser: `https://deck-scopelock.vercel.app`

**Expected:**
- Page loads successfully
- Earnings banner displays
- Job cards visible
- No console errors

---

### Database Migration (FalkorDB)

**Note:** FalkorDB is schema-free, so no migrations needed. However, you may want to seed production data.

#### Option 1: Manual Seed (for first deployment)

```bash
# Connect to production backend
ssh render-server

# Run seed script
python3 scripts/seed-compensation-production-data.py
```

#### Option 2: Gradual Migration (recommended)

No seed needed - data will accumulate naturally as team uses system:
1. Jobs created when Upwork work won
2. Missions created manually by NLR
3. Interactions tracked automatically

---

## Troubleshooting

### Issue: "Failed to connect to FalkorDB"

**Symptoms:**
- Backend server fails to start
- Error: `Connection refused` or `Timeout`

**Cause:**
- Incorrect FALKORDB_API_URL
- Incorrect FALKORDB_API_KEY
- Network firewall blocking connection

**Fix:**
```bash
# Verify environment variables
echo $FALKORDB_API_URL
echo $FALKORDB_API_KEY

# Test connection manually
curl -X POST $FALKORDB_API_URL \
  -H "Authorization: Bearer $FALKORDB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"graph": "scopelock", "query": "MATCH (n) RETURN count(n) AS count LIMIT 1"}'

# Expected: {"results": [{"count": <number>}]}
```

If still failing:
- Check FalkorDB instance is running: https://mindprotocol.onrender.com/health
- Verify API key hasn't been rotated
- Contact Mind Protocol admin for new credentials

---

### Issue: "Interaction not counted"

**Symptoms:**
- Send message to AI citizen
- Interaction count doesn't increment
- No error message

**Cause:**
- Duplicate message detection triggered
- Message sent outside job context
- API endpoint failure

**Fix:**

1. Check browser console for errors:
   - Open DevTools (F12)
   - Look for red errors in Console tab
   - Check Network tab for failed `/api/compensation/interactions` request

2. Verify message sent in correct context:
   - Are you in a job's dedicated chat thread?
   - Or in general chat (which doesn't count)?

3. Check backend logs:
   ```bash
   # On Render dashboard
   View Logs → Filter for "interaction"
   ```

4. Test API manually:
   ```bash
   curl -X POST https://scopelock-compensation-backend.onrender.com/api/compensation/interactions \
     -H "Content-Type: application/json" \
     -d '{
       "jobId": "job-therapykin-chatbot-2025-11",
       "memberId": "member_a",
       "message": "Test message",
       "aiRecipient": "rafael"
     }'
   ```

   **Expected:** `{"interactionCounted": true, "newInteractionCount": 21, ...}`

---

### Issue: "Earnings don't match expected"

**Symptoms:**
- Expect $90 earning, see $85
- Math seems wrong

**Cause:**
- Rounding discrepancy
- Cached value not updated
- Calculation error

**Fix:**

1. Verify calculation manually:
   ```
   Your interactions: 20
   Team total: 50
   Team pool: $450

   Expected: (20/50) × $450 = $180.00
   ```

2. Check audit trail:
   - Click on "Your interactions: 20" (opens interaction history modal)
   - Count messages manually
   - Verify count matches

3. Force recalculation:
   ```bash
   # Via API (NLR only)
   curl -X POST https://scopelock-compensation-backend.onrender.com/api/compensation/jobs/job-id/recalculate \
     -H "Authorization: Bearer <nlr-token>"
   ```

4. If persistent, file bug report with:
   - Job ID
   - Member ID
   - Expected vs actual earnings
   - Screenshot of interaction history

---

### Issue: "Mission fund insufficient"

**Symptoms:**
- Try to claim mission worth $10
- Error: "Mission fund insufficient ($5 available, need $10)"

**Cause:**
- Too many missions completed vs jobs completed
- Mission fund not replenished

**Fix:**

1. Check mission fund balance:
   - Go to MISSIONS section
   - See "Mission Fund: $X.XX available"

2. Wait for new jobs to complete:
   - Each job contributes 5% to mission fund
   - $1,000 job → +$50 to fund

3. Or lower mission payment amount (NLR only):
   - Edit mission, change from $10 to $5

4. Or complete more client jobs (increases fund)

---

### Issue: "Real-time updates not working"

**Symptoms:**
- Send message
- Earnings don't update immediately
- Need to refresh page to see changes

**Cause:**
- SSE connection failed
- Browser doesn't support SSE
- Network firewall blocking SSE

**Fix:**

1. Check SSE connection in DevTools:
   - Network tab → Filter "stream"
   - Should see: `/api/compensation/earnings/member_a/stream` (pending, never completes)
   - If it completes immediately → connection failed

2. Check browser console for SSE errors:
   ```
   EventSource failed: ...
   ```

3. Fallback to polling (if SSE unavailable):
   - Frontend will automatically fall back to polling every 5 seconds
   - Less real-time, but works everywhere

4. Verify CORS headers (if cross-origin):
   ```bash
   # Check CORS_ORIGINS in backend .env
   CORS_ORIGINS=https://deck.scopelock.mindprotocol.ai
   ```

---

## Usage Guide

### For Team Members

#### 1. Viewing Your Earnings

1. Open Mission Deck: https://deck.scopelock.mindprotocol.ai
2. Top banner shows: "YOUR TOTAL POTENTIAL EARNINGS: $164.00"
3. Click "View Breakdown" to see details

#### 2. Working on a Job

1. Left panel → JOBS section
2. Click a job card (e.g., "Build AI Chatbot - TherapyKin")
3. Opens dedicated chat thread
4. Send messages to AI citizens (Rafael, Inna, Sofia, Emma)
5. Each message = +1 interaction
6. Watch your earnings update in real-time

#### 3. Claiming a Mission

1. Left panel → MISSIONS section
2. See available missions with fixed payments
3. Click "Claim Mission" (requires 5+ total interactions)
4. Work on the mission (write proposal, post on X, etc.)
5. Click "Mark Complete", upload proof
6. Wait for NLR approval
7. Earnings added to your total

#### 4. Checking Payment History

1. Click "View Breakdown" in top banner
2. Tab: "Paid History"
3. See all completed jobs and missions you were paid for

---

### For NLR (Admin)

#### 1. Creating a New Job

1. JOBS section → "Create New Job" button
2. Fill in:
   - Title: "Build AI Chatbot"
   - Client: "TherapyKin"
   - Value: $1,500
   - Due date: 2025-11-20 (optional)
3. Click "Create"
4. Team pool ($450) and mission fund ($75) calculated automatically

#### 2. Approving Mission Completions

1. MISSIONS section → Filter "Pending Approval"
2. Click mission → See proof uploaded by member
3. Review proof (URL, screenshot, etc.)
4. Click "Approve" or "Reject"
5. If approved: Member earnings updated, mission fund decreased

#### 3. Triggering Payments

1. Wait for client to release payment on Upwork
2. Verify cash received in bank account
3. JOBS section → Click completed job
4. Click "Mark Payment Received"
5. Confirm: "Pay $450 to 2 team members?"
6. Enter 2FA code
7. Click "Confirm Payment"
8. Team members receive notifications
9. Earnings moved from "potential" to "paid"

---

## Next Steps

After successful deployment:

1. **Week 1:** Practice mode
   - Team uses system normally
   - Earnings shown but not paid
   - Gather feedback, fix bugs

2. **Week 2:** Real earnings start
   - First job payment triggered
   - Team members receive actual money
   - Monitor for issues

3. **Month 1:** Iterate and improve
   - Add more mission types
   - Improve UI/UX based on feedback
   - Consider weighting different actions (future)

---

## Related Documentation

- `/docs/mission-compensation-system.md` - High-level compensation overview
- `/docs/missions/mission-deck-compensation/PATTERN.md` - Core principles
- `/docs/missions/mission-deck-compensation/MECHANISM.md` - Architecture details
- `/docs/missions/mission-deck-compensation/ALGORITHM.md` - Implementation steps
