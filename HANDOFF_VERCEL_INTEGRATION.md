# Mission Deck + Vercel Webhook Integration - Handoff

**Status:** ✅ Backend complete, frontend needs environment variable configuration

**Date:** 2025-11-06

---

## ✅ Completed Work

### 1. Vercel Auto-Fix Webhook (Backend)
- **Location:** `/backend/app/webhooks.py` (lines 571-701)
- **Endpoint:** `POST /api/webhooks/vercel-failure`
- **Status Endpoint:** `GET /api/webhooks/vercel-failure/status`
- **Production URL:** https://scopelock.onrender.com/api/webhooks/vercel-failure
- **Health Check:** https://scopelock.onrender.com/health (status: degraded but operational)

**How It Works:**
1. Vercel deployment fails (state=ERROR, target=production)
2. Vercel POSTs webhook to backend endpoint
3. Backend invokes Rafael via Claude CLI (background task)
4. Rafael uses Vercel MCP to fetch build logs
5. Rafael diagnoses issue and pushes fix
6. Vercel auto-deploys fixed version

### 2. Frontend Local Configuration
- Updated `mission-deck-frontend/.env.local`
- Changed: `NEXT_PUBLIC_API_URL=https://scopelock.onrender.com`
- **Note:** `.env.local` is in `.gitignore` (correctly not committed)

---

## 🔧 Manual Steps Required

### Step 1: Set Vercel Environment Variable

**Via Vercel Dashboard:**
1. Go to: https://vercel.com/mindprotocol/scopelock/settings/environment-variables
2. Click "Add New"
3. **Key:** `NEXT_PUBLIC_API_URL`
4. **Value:** `https://scopelock.onrender.com`
5. **Environments:** Production, Preview, Development (check all)
6. Click "Save"
7. Redeploy: https://vercel.com/mindprotocol/scopelock/deployments

**OR Via Vercel CLI:**
```bash
cd mission-deck-frontend
vercel login
echo "https://scopelock.onrender.com" | vercel env add NEXT_PUBLIC_API_URL production
vercel --prod
```

### Step 2: Configure Vercel Webhook

**Via Vercel Dashboard:**
1. Go to: https://vercel.com/mindprotocol/scopelock/settings/git-hooks
2. Click "Add Webhook"
3. **URL:** `https://scopelock.onrender.com/api/webhooks/vercel-failure`
4. **Events:** Check "Deployment Error"
5. **Environment:** Production only
6. Click "Save"

**Test Webhook:**
```bash
# Trigger test deployment failure (optional)
curl -X POST https://scopelock.onrender.com/api/webhooks/vercel-failure \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_webhook_manual",
    "name": "scopelock",
    "state": "ERROR",
    "target": "production",
    "url": "https://scopelock-test.vercel.app",
    "meta": {
      "githubCommitSha": "abc123",
      "githubCommitMessage": "test webhook configuration"
    }
  }'

# Expected response:
# {"status":"rafael_invoked","deployment_id":"test_webhook_manual","project":"scopelock"}

# Check webhook status:
curl https://scopelock.onrender.com/api/webhooks/vercel-failure/status
```

---

## 🧪 Testing End-to-End Flow

### Test 1: Frontend Login Flow

1. Open https://scopelock-mission-deck.vercel.app (or your deployment URL)
2. Enter OTP: `123456` (test OTP from backend)
3. Should see Mission Deck with "Your Missions" list
4. Verify API calls go to scopelock.onrender.com (check browser DevTools Network tab)

### Test 2: Vercel Auto-Fix Webhook

**Scenario A: Real Deployment Failure**
1. Push code with intentional error (e.g., typo in import)
2. Wait for Vercel deployment to fail
3. Webhook triggers Rafael automatically
4. Check Rafael session in `/citizens/rafael/` for SYNC.md updates
5. Rafael should diagnose, fix, commit, and push
6. Vercel auto-deploys fixed version

**Scenario B: Manual Webhook Test**
1. Use curl command above to trigger test webhook
2. Check backend logs: `https://dashboard.render.com/web/srv-d43toq3ipnbc73cb5kqg/logs`
3. Look for "🤖 VERCEL AUTO-FIX - INVOKING RAFAEL"
4. Verify Rafael CLI invocation in logs

---

## 📊 Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                        │
│                                                             │
│  Next.js App (scopelock-mission-deck.vercel.app)           │
│  ↓ API calls (NEXT_PUBLIC_API_URL)                         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              Render (Backend - scopelock.onrender.com)      │
│                                                             │
│  FastAPI Backend:                                           │
│  • /api/mission-deck/* - Mission Deck API routes           │
│  • /api/webhooks/vercel-failure - Vercel auto-fix webhook  │
│  • /health - Health check                                   │
│                                                             │
│  Services:                                                  │
│  • FalkorDB integration (graph database)                    │
│  • Claude CLI invocation (Rafael auto-fix)                  │
│  • Citizen runner (Emma, Inna, Rafael, Sofia, Maya)        │
└─────────────────────────────────────────────────────────────┘
                        ↑
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Webhooks                           │
│                                                             │
│  Event: Deployment Error (state=ERROR, target=production)   │
│  → POST to scopelock.onrender.com/api/webhooks/vercel-failure│
│  → Rafael investigates and fixes autonomously               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Key Files Reference

### Backend
- `/backend/app/webhooks.py` - All webhook endpoints (Vercel, Upwork, Telegram)
- `/backend/app/main.py` - FastAPI app with webhook router registered
- `/backend/app/runner.py` - Citizen CLI invocation (run_rafael_raw)
- `/backend/app/api/mission_deck/` - Mission Deck API routes

### Frontend
- `/mission-deck-frontend/.env.local` - Local API URL (not committed)
- `/mission-deck-frontend/src/lib/api-client.ts` - API client using NEXT_PUBLIC_API_URL
- `/mission-deck-frontend/vercel.json` - Vercel deployment config

### Documentation
- `/citizens/SYNC.md` - Latest status updates (2025-11-06 19:45 entry)
- `/tools/vercel-auto-fix/README.md` - Standalone webhook docs (archived, now in main backend)
- `/docs/missions/mission-deck/` - Mission Deck mission documentation

---

## ⚠️ Known Issues

### 1. Backend Degraded Status
**Issue:** `/health` returns `{"status":"degraded","services":{"citizen_runner":{"status":"disconnected"}}}`

**Impact:** Citizen runner disconnected, but webhook endpoint still operational

**Resolution:** Monitor logs, may need to restart backend service if citizen invocations fail

### 2. mission-deck-backend Service Deleted
**Context:** Earlier created separate `mission-deck-backend` Render service

**Resolution:** User deleted duplicate service (correct decision). All functionality now in main `scopelock` backend.

---

## 🎯 Next Steps (Priority Order)

1. **Set Vercel environment variable** (5 min) - Allows frontend to connect to production backend
2. **Configure Vercel webhook** (5 min) - Enables auto-fix on deployment failures
3. **Test frontend login flow** (10 min) - Verify end-to-end connectivity
4. **Test webhook with deployment failure** (optional) - Verify auto-fix works
5. **Create Evidence Sprint artifacts** (Mission Deck completion)
6. **Hand off to Sofia for QA**

---

## 📞 Contact

**Backend Health:** https://scopelock.onrender.com/health  
**Webhook Status:** https://scopelock.onrender.com/api/webhooks/vercel-failure/status  
**Render Dashboard:** https://dashboard.render.com/web/srv-d43toq3ipnbc73cb5kqg  
**Vercel Dashboard:** https://vercel.com/mindprotocol/scopelock  

**Questions?** Check `/citizens/SYNC.md` for latest updates or ask Rafael.

---

**Prepared by:** Rafael (rafael@scopelock)  
**Date:** 2025-11-06 19:48 UTC
