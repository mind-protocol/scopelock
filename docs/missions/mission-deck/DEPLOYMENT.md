# Mission Deck - Deployment Guide

**Version:** Week 1 MVP
**Last Updated:** 2025-11-07
**Platforms:** Render (backend) + Vercel (frontend)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ Backend tested locally (`http://localhost:8000`)
- ✅ Frontend tested locally (`http://localhost:3002`)
- ✅ FalkorDB connection working
- ✅ JWT authentication working
- ✅ All tests passing (pytest + Vitest)

---

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Verify environment variables** are set in `.env`:
   ```bash
   cd docs/missions/mission-deck/backend
   cat .env
   ```

   Required:
   - `FALKORDB_API_URL`
   - `FALKORDB_API_KEY`
   - `GRAPH_NAME`
   - `JWT_SECRET`
   - `CORS_ORIGINS` (must include production frontend URL)

2. **Test backend locally one more time**:
   ```bash
   uvicorn main:app --reload --port 8000
   curl http://localhost:8000/health
   ```

### Step 2: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `mind-protocol/scopelock`

**Service Configuration:**
- **Name:** `scopelock-mission-deck-api`
- **Region:** Oregon (or closest to your users)
- **Branch:** `main`
- **Root Directory:** `docs/missions/mission-deck/backend`
- **Runtime:** Python 3.10+
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Configure Environment Variables on Render

In the Render dashboard, add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `FALKORDB_API_URL` | `https://mindprotocol.onrender.com/admin/query` | Production FalkorDB |
| `FALKORDB_API_KEY` | `Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU` | From production |
| `GRAPH_NAME` | `scopelock` | Graph name |
| `JWT_SECRET` | Generate secure random | `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `CORS_ORIGINS` | `https://scopelock-mission-deck.vercel.app` | Production frontend URL |

### Step 4: Install Claude CLI on Render

**Important:** Mission Deck uses Claude CLI (subscription) not direct API calls.

Add a **Build Command** in Render dashboard:
```bash
curl -fsSL https://claude.ai/install.sh | bash && pip install -r requirements.txt
```

### Step 5: Upload Claude Credentials

Mission Deck requires `.claude/.credentials.json` for Rafael chat functionality.

**Option 1: Environment Variable (Recommended)**
```bash
# On your local machine (WSL):
cat /home/mind-protocol/.claude/.credentials.json | base64

# Add to Render as environment variable:
CLAUDE_CREDENTIALS_BASE64=<paste base64 output>
```

Then add to `main.py` startup:
```python
import os
import base64

# Decode and write credentials at startup
if os.getenv("CLAUDE_CREDENTIALS_BASE64"):
    creds_dir = os.path.expanduser("~/.claude")
    os.makedirs(creds_dir, exist_ok=True)
    creds_b64 = os.getenv("CLAUDE_CREDENTIALS_BASE64")
    creds_json = base64.b64decode(creds_b64).decode("utf-8")
    with open(os.path.join(creds_dir, ".credentials.json"), "w") as f:
        f.write(creds_json)
```

**Option 2: Persistent Disk (If supported by Render plan)**
- Mount persistent disk at `~/.claude/`
- Upload `.credentials.json` via Render dashboard

### Step 6: Deploy and Verify

1. **Deploy:** Click "Create Web Service" in Render
2. **Wait for build:** Monitor logs for errors
3. **Verify health endpoint:**
   ```bash
   curl https://scopelock-mission-deck-api.onrender.com/health
   # Expected: {"status":"ok","service":"mission-deck-api"}
   ```
4. **Test authentication:**
   ```bash
   curl -X POST https://scopelock-mission-deck-api.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"person1@scopelock.ai","password":"testpass"}'
   # Expected: {"access_token":"...", "user":{...}}
   ```

**Backend URL:** `https://scopelock-mission-deck-api.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update environment variable for production**:
   ```bash
   cd mission-deck-frontend
   cat .env.local
   ```

   Should contain:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Test frontend build locally**:
   ```bash
   npm run build
   npm run start
   ```

   Visit: http://localhost:3002

### Step 2: Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repository: `mind-protocol/scopelock`

**Project Configuration:**
- **Project Name:** `scopelock-mission-deck`
- **Framework Preset:** Next.js
- **Root Directory:** `mission-deck-frontend`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 3: Configure Environment Variables on Vercel

In Vercel project settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://scopelock-mission-deck-api.onrender.com` | Production |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Preview + Development |

### Step 4: Deploy and Verify

1. **Deploy:** Click "Deploy" in Vercel
2. **Wait for build:** Monitor deployment logs
3. **Visit production URL:** `https://scopelock-mission-deck.vercel.app`
4. **Test login flow:**
   - Open login page
   - Enter: `person1@scopelock.ai` / `testpass`
   - Should redirect to `/console`
   - Should show mission selector (may be empty if no missions in FalkorDB)

**Frontend URL:** `https://scopelock-mission-deck.vercel.app`

---

## Post-Deployment Verification

### Backend Checklist

- ✅ Health endpoint returns 200: `GET /health`
- ✅ Login works: `POST /api/auth/login`
- ✅ Missions endpoint (authenticated): `GET /api/missions`
- ✅ FalkorDB connection successful (check logs)
- ✅ CORS allows frontend domain
- ✅ No errors in Render logs

### Frontend Checklist

- ✅ Login page loads
- ✅ Can login with test credentials
- ✅ Redirects to `/console` after login
- ✅ Mission selector renders (empty list OK for now)
- ✅ Citizen selector tabs visible
- ✅ No console errors in browser DevTools
- ✅ Network requests succeed (check DevTools Network tab)

### Integration Verification

Test full flow:
1. Open `https://scopelock-mission-deck.vercel.app`
2. Login with `person1@scopelock.ai` / `testpass`
3. Should see Mission Deck console
4. Click citizen tabs (Emma → Inna → Rafael → Sofia → Maya)
5. If missions exist in FalkorDB, should be visible in left panel

---

## Troubleshooting

### Backend Issues

**Issue:** Health endpoint returns 502/503
- **Cause:** Service not started correctly
- **Fix:** Check Render logs for startup errors, verify build command

**Issue:** Login returns 500
- **Cause:** JWT_SECRET missing or database connection failed
- **Fix:** Check environment variables in Render dashboard

**Issue:** Missions endpoint returns 500
- **Cause:** FalkorDB connection failed
- **Fix:** Verify `FALKORDB_API_URL` and `FALKORDB_API_KEY` are correct

**Issue:** Chat endpoint returns 500
- **Cause:** Claude CLI not installed or credentials missing
- **Fix:** Verify Claude CLI install in build command, check credentials upload

### Frontend Issues

**Issue:** Login page loads but login fails
- **Cause:** Backend URL incorrect or CORS blocked
- **Fix:** Check `NEXT_PUBLIC_API_URL`, verify CORS_ORIGINS on backend

**Issue:** Console page is blank after login
- **Cause:** API requests failing (401/403)
- **Fix:** Check browser DevTools Console and Network tabs for errors

**Issue:** "Failed to fetch missions" error
- **Cause:** Backend missions endpoint failing
- **Fix:** Test backend endpoint directly, check backend logs

---

## Monitoring and Maintenance

### Logs

**Backend (Render):**
- Dashboard → Service → Logs
- Real-time logs available
- Search for error keywords: `ERROR`, `FAIL`, `Exception`

**Frontend (Vercel):**
- Dashboard → Project → Deployments → Logs
- Function logs for API routes
- Runtime logs for SSR errors

### Performance Monitoring

**Backend:**
- Monitor response times via Render metrics
- Target: p95 < 500ms for all endpoints
- Alert on: >1% error rate

**Frontend:**
- Vercel Analytics (if enabled)
- Target: Page load < 3s
- Monitor: Lighthouse scores ≥90

### Rollback Procedure

**Backend:**
1. Go to Render dashboard → Service → Deploys
2. Find previous successful deploy
3. Click "Redeploy"

**Frontend:**
1. Go to Vercel dashboard → Project → Deployments
2. Find previous production deployment
3. Click "⋯" → "Promote to Production"

---

## Security Notes

- ✅ JWT tokens expire after 7 days (configurable in `auth.py`)
- ✅ HTTPS enforced (Render + Vercel provide SSL automatically)
- ✅ CORS restricted to frontend domain only
- ✅ FalkorDB credentials stored as environment variables
- ⚠️  Week 1 uses hardcoded test users (replace with real auth in Week 2)

---

## Cost Estimates

**Render (Backend):**
- Free tier: 750 hours/month (sufficient for MVP)
- Paid tier: $7/month (if need always-on)

**Vercel (Frontend):**
- Hobby tier: Free for non-commercial
- Pro tier: $20/month (if commercial)

**Total:** $0-27/month depending on tier choices

---

## Support

If deployment fails:
1. Check this guide's Troubleshooting section
2. Review Render/Vercel logs for specific errors
3. Test backend/frontend locally to isolate issue
4. Contact Nicolas (@nlr_ai) for architecture questions
5. Escalate to Sofia for QA verification

---

**Deployment Status Tracker:**

- [ ] Backend deployed to Render
- [ ] Claude CLI installed on Render
- [ ] Credentials uploaded to Render
- [ ] Backend health check passing
- [ ] Frontend deployed to Vercel
- [ ] Frontend can login successfully
- [ ] Integration test passed (login → console → missions)
- [ ] Sofia QA verification complete
- [ ] Production URLs documented in SYNC.md
