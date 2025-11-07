# GUIDE: Mission Deck Compensation System

**Version:** 1.1 (WebSocket + Points-Based Payments)
**Created:** 2025-11-07
**Updated:** 2025-11-07
**Mission:** Setup, deployment, and usage guide for compensation system with WebSocket real-time updates and points-based mission payments

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
   - mission-proposal-voice-ai-2025-11-07 (1 point, available)
   - mission-proposal-ai-analytics-2025-11-06 (1 point, completed by member_a)
   - mission-proposal-chatbot-2025-11-05 (1 point, completed by member_b)
   - mission-proposal-dashboard-2025-11-04 (1 point, paid)
   - mission-proposal-landing-2025-11-03 (1 point, paid)

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

## Understanding the Points-Based Mission Payment System

### How Mission Payments Work

Missions earn **points** (NOT fixed dollar amounts). Points convert to earnings when the next job completes and pays out.

**Key Concepts:**

1. **Missions earn points:** Complete a proposal mission = 1 point
2. **Points accumulate:** Keep earning points until next job payment
3. **Points → Earnings:** Job's 5% mission pool split by point ratio
4. **Points reset:** After payment, everyone's points reset to 0

### Payment Example

**Current state:**
```
Active jobs:
- Job A ($1500): 30% team pool ($450), 5% mission pool ($75)
- Job B ($800): 30% team pool ($240), 5% mission pool ($40)
- Job C ($1200): 30% team pool ($360), 5% mission pool ($60)

Total mission fund: $175 (5% from all active jobs)

Completed missions:
- member_a: 2 points (completed 2 proposal missions)
- member_b: 1 point (completed 1 proposal mission)
Total points: 3
```

**Job A completes and pays:**
```
Job A's 5% mission pool: $75

Mission earnings distribution:
- member_a: (2/3) × $75 = $50.00
- member_b: (1/3) × $75 = $25.00

After payment:
- Points reset: member_a = 0, member_b = 0
- Mission statuses: completed → paid
- Mission fund decreases by $75
```

**If no missions completed:**
```
Job A's 5% mission pool: $75
No missions completed → $75 goes to NLR (org)
```

### Why Points-Based Payments?

**Problem solved:**
- Fixed payments create race conditions and claiming drama
- No way to batch mission payments with job payments
- Manual approval creates bottleneck (NLR approval required)

**Benefits:**
1. **Simple:** 1 point per mission, no complex tier calculations
2. **Batched:** Missions paid when jobs pay (simpler accounting)
3. **Auto-validated:** Emma validates via chat, no manual approval
4. **First to complete wins:** No claiming race, just do the work
5. **Fair:** Points = share of next job's mission pool

---

## WebSocket Real-Time Updates (Week 1 Scope)

### How WebSocket Works

**Traditional REST polling (OLD):**
```
Frontend: "What's my current earnings?" (every 5 seconds)
Backend: "Your earnings are $X"
Frontend: "What's my current earnings?" (5 seconds later)
Backend: "Your earnings are $X"
... (network waste, battery drain)
```

**WebSocket (NEW):**
```
Frontend: *connects once*
Backend: *pushes updates when they happen*
Backend → Frontend: "Interaction counted! +$10.50"
Backend → Frontend: "Mission completed! +1 point (3 total)"
... (efficient, real-time)
```

### WebSocket Events (Personal Earnings Only)

**Week 1 Scope:** Personal earnings updates only (no team broadcasts yet)

| Event | Trigger | Payload | What Happens |
|-------|---------|---------|--------------|
| `connected` | WebSocket connection established | `{event, memberId, timestamp}` | Frontend shows "Connected" status |
| `interaction_counted` | You send message to AI citizen | `{event, jobId, yourInteractions, teamTotal, yourPotentialEarning}` | Job card updates live |
| `mission_completed` | Emma validates mission completion | `{event, missionId, points, totalPoints, newTotal}` | Points counter updates |
| `job_paid` | NLR marks job payment received | `{event, jobId, yourEarning, missionEarning, totalPaid}` | Potential → Paid earnings, points reset to 0 |

### Testing WebSocket Connection

**Browser DevTools Test:**

1. Open Mission Deck: `http://localhost:3000/mission-deck/console`
2. Open DevTools (F12)
3. Network tab → Filter: WS (WebSocket)
4. You should see: `ws://localhost:8000/api/compensation/ws/[your-member-id]`
5. Status: `101 Switching Protocols` (success)
6. Messages tab shows: `{"event":"connected","memberId":"...","timestamp":"..."}`

**Manual cURL Test (Backend Only):**

```bash
# Install websocat (WebSocket CLI tool)
# macOS: brew install websocat
# Linux: cargo install websocat

# Connect to WebSocket endpoint
websocat ws://localhost:8000/api/compensation/ws/test-member-123

# Expected output:
# {"event":"connected","memberId":"test-member-123","timestamp":"2025-11-07T14:23:45.123Z"}
```

**Simulate Interaction Event:**

```python
# Run in Python shell (with backend running)
import requests

# Send message to AI citizen (this should trigger WebSocket broadcast)
response = requests.post(
    "http://localhost:8000/api/chat/send",
    json={
        "missionId": "test-job-1",
        "message": "Rafael, implement authentication",
        "citizenId": "rafael",
        "memberId": "test-member-123"
    }
)

# Check WebSocket message in browser DevTools
# Should see: {"event":"interaction_counted","jobId":"test-job-1",...}
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

### Issue: "I completed a mission but didn't get paid"

**Symptoms:**
- Mission shows status "completed"
- Points counter increased
- But no payment received yet

**Cause:**
- Missions pay when the **next job completes**, not immediately
- If no jobs have completed since your mission, you haven't been paid yet

**Fix:**

1. Check mission status:
   ```bash
   GET /api/compensation/missions
   ```
   - `status: "completed"` = waiting for next job payment
   - `status: "paid"` = already paid with a job

2. Check your points balance:
   ```bash
   GET /api/compensation/earnings/{your-member-id}
   ```
   - `currentMissionPoints: 2` = you have 2 points waiting for next job payment
   - `currentMissionPoints: 0` = points were already paid and reset

3. Wait for next job to complete:
   - Your mission earnings will be included in that job's payment
   - Formula: `(your_points / total_points) × job's_5%_pool`

**Example:**
- You complete mission on Monday → 1 point
- Job A completes on Wednesday → You get paid: `(1/3) × $75 = $25`
- Your points reset to 0 after payment

---

### Issue: "My points disappeared"

**Symptoms:**
- Had 2 points yesterday
- Today shows 0 points
- Don't remember getting paid

**Cause:**
- Points reset to 0 after each job payment (by design)
- Check your payment history to see the payment

**Fix:**

1. Check payment history:
   ```bash
   GET /api/compensation/earnings/{your-member-id}
   ```
   Look for recent `paidMissionEarnings` entries

2. Verify you received payment:
   - Mission earnings are combined with job earnings in single payment
   - Check your wallet for recent transaction
   - Check notification history for payment alert

**This is expected behavior:** Points are temporary counters that convert to actual earnings at job payment, then reset to 0.

---

### Issue: "Where did the mission pool go?"

**Symptoms:**
- Job completed and paid
- No mission earnings distributed
- 5% mission pool seems missing

**Cause:**
- If **no missions were completed** when job paid, the 5% mission pool goes to NLR (org)
- This is by design

**Fix:**

This is expected behavior. To earn from the mission pool:
1. Complete missions **before** a job pays out
2. Accumulate points while job is in progress
3. When job completes, your points convert to earnings from that job's 5% pool

**Example:**
- Job A in progress (no missions completed yet)
- Job A completes and pays
- 5% mission pool ($75) → goes to NLR (org)
- 30% job pool ($450) → distributed to contributors by interactions

To get mission earnings next time:
- Complete missions while jobs are in progress
- Build up points before job payment triggers

---

### Issue: "Real-time updates not working"

**Symptoms:**
- Send message
- Earnings don't update immediately
- Need to refresh page to see changes

**Cause:**
- WebSocket connection failed
- Browser doesn't support WebSocket
- Network firewall blocking WebSocket
- Wrong WebSocket URL configured

**Fix:**

1. Check WebSocket connection in DevTools:
   - Network tab → Filter "WS" (WebSocket)
   - Should see: `ws://localhost:8000/api/compensation/ws/[member-id]`
   - Status should be: `101 Switching Protocols`
   - If status is `400/403/500` → connection failed

2. Check browser console for WebSocket errors:
   ```
   WebSocket connection to 'ws://...' failed: ...
   ```

3. Verify WebSocket URL is correct:
   - Check frontend `.env.local`:
     ```bash
     NEXT_PUBLIC_WS_URL=ws://localhost:8000  # Local dev
     # Or for production:
     # NEXT_PUBLIC_WS_URL=wss://scopelock-backend.onrender.com
     ```
   - **Important:** Use `ws://` for local, `wss://` for production (secure WebSocket)

4. Test WebSocket endpoint manually:
   ```bash
   # Install websocat
   brew install websocat  # macOS
   cargo install websocat  # Linux

   # Connect to WebSocket
   websocat ws://localhost:8000/api/compensation/ws/test-member

   # Expected: {"event":"connected","memberId":"test-member",...}
   ```

5. Verify CORS headers allow WebSocket upgrade (if cross-origin):
   ```bash
   # Check CORS_ORIGINS in backend .env
   CORS_ORIGINS=https://deck.scopelock.mindprotocol.ai
   ```

6. Check backend logs for WebSocket errors:
   - Render dashboard → Logs
   - Search for "WebSocket" or "ws"

---

### Issue: "Cannot trigger payment - wallet not connected" (NEW)

**Symptoms:**
- NLR tries to trigger payment for completed job
- Error: "Cannot pay. These members need to connect wallet: member_b"
- Payment blocked

**Cause:**
- One or more team members haven't connected their Solana wallet
- Wallet connection required for all contributors before payment can be made

**Fix:**

1. Identify which members need wallets:
   - Error message lists specific member slugs
   - Example: "member_b, member_c"

2. Notify those members to connect wallet:
   ```
   @member_b Please connect your Solana wallet to receive payment.

   Steps:
   1. Go to Mission Deck → Settings
   2. Click "Connect Solana Wallet"
   3. Sign message to verify ownership
   4. Your wallet will be stored (encrypted)
   ```

3. Verify wallet connections:
   ```bash
   # Check which members have wallets
   curl GET https://scopelock-backend.onrender.com/api/compensation/team/wallet-status/member_b \
     -H "Authorization: Bearer <nlr-token>"

   # Expected: {"hasWallet": true/false, "walletAddress": "9xQe...rGtX", ...}
   ```

4. Once all members have wallets, retry payment:
   - Return to job
   - Click "Trigger Payment"
   - Should succeed this time

**Note:** Wallet connection uses existing wallet flow (already implemented). This spec just documents the storage schema.

---

### Issue: "Cannot view team leaderboard" (NEW)

**Symptoms:**
- Click "Team" page
- See "Connect Your Solana Wallet" prompt instead of leaderboard

**Cause:**
- Team leaderboard requires wallet connection (enforced)
- Privacy measure: only members ready to receive payment see earnings comparison

**Fix:**

1. Connect your Solana wallet:
   - Click "Connect Wallet" button on prompt
   - Or go to Settings → Connect Solana Wallet

2. Wallet connection flow:
   - Click "Connect Wallet"
   - Pop-up opens (Phantom/Solflare/etc.)
   - Sign message to verify ownership
   - Wallet address stored in FalkorDB (NOT encrypted - public by nature)

3. After connection:
   - Page automatically shows leaderboard
   - See team members ranked by potential earnings
   - Your rank highlighted

**Why required?**
- Leaderboard shows potential earnings (future payments)
- Only members ready to receive payment should see this data
- Wallet = proof you're ready for payment

---

## Usage Guide

### For Team Members

#### 1. Connecting Your Solana Wallet (Required)

**When to do this:**
- Before you can view team leaderboard
- Before you can receive payments from jobs/missions

**Steps:**

1. Open Mission Deck: https://deck.scopelock.mindprotocol.ai
2. Go to Settings → "Connect Solana Wallet"
3. Click "Connect" button
4. Phantom/Solflare wallet pop-up opens
5. Sign message to verify ownership (no transaction, just signature)
6. Success! Your wallet address is now stored

**What's stored:**
- `walletAddress`: Your Solana wallet address (public, NOT encrypted)
- `walletVerified`: Boolean (True after signing)
- `walletVerifiedAt`: Timestamp
- `walletSignature`: Proof of ownership

**Privacy:**
- Wallet addresses are public on blockchain anyway
- No private keys or seed phrases stored
- Only your signature (proves you own the wallet)

---

#### 2. Viewing Your Earnings

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

#### 3. Viewing Team Leaderboard (NEW)

**Requirement:** Must have Solana wallet connected

1. Left panel → TEAM section
2. See team-wide potential earnings leaderboard
3. Members ranked by total potential earnings (jobs + missions)
4. Your row highlighted in yellow
5. Team total shown at top
6. Real-time updates via WebSocket (<1s after any earnings change)

**What you see:**
- Rank (#1, #2, #3...)
- Member name
- Potential earnings (NOT paid earnings - privacy)
- Your rank highlighted

**What you DON'T see:**
- Paid earnings (private)
- Per-job breakdown (private)
- Interaction counts (private)

**Why wallet required?**
- Leaderboard shows future payments
- Only members ready to receive payment see this data
- Ensures everyone has payment method before viewing earnings

---

#### 4. Completing a Mission (via Emma in Chat)

**Missions are completed via Emma in chat - NOT through UI claiming.**

**For Proposal Missions:**
1. In chat, ask Emma to search for jobs: "Emma, search for 'voice AI dashboard' jobs"
2. Emma searches Upwork and finds matching jobs
3. Emma writes proposals for all validated jobs
4. When Emma finishes, she says "mission complete" in chat
5. Backend automatically completes the mission and awards you points
6. Points accumulate until next job payment (NOT immediate)

**How to check your progress:**
1. Left panel → MISSIONS section
2. See available missions (created by Emma after searches)
3. See your current points total: "You have 3 points"
4. Payment timing: "Points convert to earnings at next job completion"

**First to complete wins:**
- If you complete a mission, it becomes unavailable to others
- No claiming required - just work with Emma in chat

#### 5. Checking Payment History

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

#### 2. Viewing Mission Progress

**Missions are auto-approved (Emma validates) - no manual approval needed.**

1. MISSIONS section → See all missions
2. Filter by status: Available, Completed, Paid
3. View completed missions: Who completed them, when, chat session ID
4. Trust member + spot check (no formal approval flow)

**Spot checking (if needed):**
- Check chat session ID to see Emma's validation
- Verify member actually completed the work
- If issue found: Discuss with team, adjust manually

#### 3. Triggering Payments (Pays BOTH Jobs + Missions)

**When you trigger payment for a job, it pays:**
1. **30% job pool** (split by interactions among contributors)
2. **5% mission pool** (split by points among mission completers)
3. If no missions completed → 5% pool goes to you (NLR/org)

**Steps:**
1. Wait for client to release payment on Upwork
2. Verify cash received in bank account
3. JOBS section → Click completed job
4. Click "Mark Payment Received"
5. Confirm: "Pay job earnings ($450) + mission earnings ($50) = $500 total to team?"
6. Enter 2FA code
7. Click "Confirm Payment"
8. System distributes:
   - Job earnings by interaction ratios
   - Mission earnings by point ratios
9. Team members receive combined notifications
10. Mission points reset to 0 for all members
11. Earnings moved from "potential" to "paid"

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

## Next Steps (Week 2+ Features)

**Team awareness features** (deferred until team is active):

1. **Live Activity Feed** - See other team members' recent interactions in real-time
2. **Real-Time Leaderboard** - Live ranking by total potential earnings (updates as interactions happen)
3. **Mission Claiming Race** - See who's claiming missions in real-time with countdown timers
4. **Team Velocity Tracker** - Live team-wide interaction rate (interactions/hour) with trend arrows
5. **Live Streak Display** - Daily interaction streaks with fire emojis and team streak competition

**Why deferred:**
> "We cannot do the real-time game team visibility right now because there's nobody working right now. It won't feel powerful." - Alexis

**When to enable:** Week 2+ when at least 3+ active team members are working simultaneously. The WebSocket infrastructure is already built, so enabling these features will be straightforward.

**Implementation note:** All team broadcast events are commented out in `websocket_manager.py`. To enable:
1. Uncomment `broadcast_to_all()` function
2. Update frontend to handle team events (`team_interaction`, `live_leaderboard_update`, etc.)
3. Test with 3+ concurrent users

---

## Related Documentation

- `/docs/mission-compensation-system.md` - High-level compensation overview
- `/docs/missions/mission-deck-compensation/PATTERN.md` - Core principles
- `/docs/missions/mission-deck-compensation/MECHANISM.md` - Architecture details
- `/docs/missions/mission-deck-compensation/ALGORITHM.md` - Implementation steps
