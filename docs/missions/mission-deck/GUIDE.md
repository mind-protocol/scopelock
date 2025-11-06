# GUIDE: ScopeLock Mission Deck

**Mission:** Internal developer dashboard
**Purpose:** Setup, deployment, and troubleshooting instructions
**Created:** 2025-11-05

---

## Local Development Setup

### Prerequisites

- **Node.js:** 18.0.0 or higher
- **Python:** 3.11 or higher
- **PostgreSQL:** 15 or higher (or use Render managed DB)
- **Git:** Latest version
- **Code editor:** VS Code recommended

**Verify installations:**
```bash
node --version  # Should show v18.x or higher
python --version  # Should show 3.11.x or higher
psql --version  # Should show 15.x or higher
```

---

## Step 1: Navigate to Mission Deck

Mission Deck is part of the main ScopeLock repository (not a separate repo).

```bash
# If you haven't cloned ScopeLock yet:
git clone https://github.com/mind-protocol/scopelock.git
cd scopelock

# Mission Deck documentation and specs:
cd docs/missions/mission-deck

# Implementation will be in:
# - Backend: backend/mission-deck/
# - Frontend: src/app/deck/
```

---

## Step 2: Backend Setup

### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.104.0 uvicorn-0.24.0 sqlalchemy-2.0.23 ...
```

### 2.3 Setup Environment Variables

```bash
# Create .env file
cp .env.example .env

# Edit .env with your values:
DATABASE_URL=postgresql://user:password@localhost:5432/scopelock_console
JWT_SECRET=your-super-secret-key-here-256-bits
CLAUDE_API_KEY=sk-ant-api03-...
CORS_ORIGINS=http://localhost:3000
```

**To generate JWT_SECRET:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2.4 Setup Database

**Option 1: Local PostgreSQL**

```bash
# Create database
createdb scopelock_console

# Run migrations
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade  -> abc123, Initial schema
```

**Option 2: Use Render PostgreSQL**

```bash
# Create Render PostgreSQL instance
# Copy External Database URL from Render dashboard
# Update DATABASE_URL in .env

# Run migrations
alembic upgrade head
```

### 2.5 Seed Test Data

```bash
# Create test user and missions
python scripts/seed_test_data.py
```

**Expected output:**
```
✓ Created test user: person1@scopelock.ai (password: test123)
✓ Created Mission #1: Telegram Notifier
✓ Created Mission #2: Landing Page
✓ Seeded 6 DoD items
```

### 2.6 Run Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
```

**Verify:**
```bash
# Test health check
curl http://localhost:8000/health

# Expected: {"status":"ok"}
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

**Expected output:**
```
added 342 packages in 12s
```

### 3.2 Setup Environment Variables

```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3.3 Run Frontend

```bash
npm run dev
```

**Expected output:**
```
 ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

---

## Step 4: Verify Local Setup

### 4.1 Open Browser

Navigate to: `http://localhost:3000`

### 4.2 Login

**Credentials:**
- Email: `person1@scopelock.ai`
- Password: `test123`

### 4.3 Verify Features

1. **Mission Selector:** Should show 2 test missions (#1, #2)
2. **Chat Tab:** Send message "How do I deploy to Render?" → Rafael should respond
3. **DoD Tab:** Check 1 checkbox → Progress should update
4. **Context Tab:** Edit notes → Click Save → Reload page → Notes should persist

**If all work: ✅ Local setup complete**

---

## Deployment

### Production Deployment to Render + Vercel

---

## Step 5: Deploy Backend (Render)

### 5.1 Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **[New +]** → **PostgreSQL**
3. Configure:
   - **Name:** `scopelock-deck-db`
   - **Database:** `scopelock_console`
   - **User:** (auto-generated)
   - **Region:** Oregon (US West)
   - **Plan:** Starter ($7/month)
4. Click **[Create Database]**
5. **Copy Internal Database URL** (for backend service)

---

### 5.2 Create Backend Web Service

1. Go to https://dashboard.render.com
2. Click **[New +]** → **Web Service**
3. Connect GitHub repo: `scopelock-deck`
4. Configure:
   - **Name:** `scopelock-deck-api`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Starter ($7/month)

5. **Environment Variables:** (click Advanced → Add Environment Variable)
   ```
   DATABASE_URL = [Internal Database URL from Step 5.1]
   JWT_SECRET = [Generate: python -c "import secrets; print(secrets.token_urlsafe(32))"]
   CLAUDE_API_KEY = sk-ant-api03-...
   CORS_ORIGINS = https://scopelock.mindprotocol.ai/deck,http://localhost:3000
   ```

6. Click **[Create Web Service]**

7. **Wait for deploy** (2-3 minutes)

8. **Copy Service URL:** `https://scopelock-deck-api.onrender.com`

---

### 5.3 Run Database Migrations

**Method 1: Via Render Shell**

1. Go to service page → **Shell** tab
2. Run:
   ```bash
   alembic upgrade head
   ```

**Method 2: Via Local Terminal**

1. Update local `.env` with production DATABASE_URL
2. Run:
   ```bash
   alembic upgrade head
   ```
3. Revert `.env` to local database URL

---

### 5.4 Seed Production Data

```bash
# SSH into Render service (Shell tab) or use local with prod DATABASE_URL
python scripts/seed_production_data.py
```

**This creates:**
- 4 real user accounts (person1-4@scopelock.ai)
- Initial passwords (users should change on first login)

---

### 5.5 Verify Backend

```bash
# Test health check
curl https://scopelock-deck-api.onrender.com/health

# Expected: {"status":"ok"}

# Test login
curl -X POST https://scopelock-deck-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"person1@scopelock.ai","password":"INITIAL_PASSWORD"}'

# Expected: {"access_token":"...","token_type":"bearer","user":{...}}
```

---

## Step 6: Deploy Frontend (Vercel)

### 6.1 Import Project

1. Go to https://vercel.com/new
2. Import Git repository: `scopelock-deck`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL = https://scopelock-deck-api.onrender.com
   ```

5. Click **[Deploy]**

6. **Wait for deploy** (1-2 minutes)

7. **Copy deployment URL:** `https://scopelock-deck-xyz.vercel.app`

---

### 6.2 Configure Next.js basePath

Since the app will be accessed at `scopelock.mindprotocol.ai/deck`, configure Next.js basePath:

1. Edit `frontend/next.config.js`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     basePath: '/deck',
     assetPrefix: '/deck',
   }

   module.exports = nextConfig
   ```

2. Commit and push:
   ```bash
   git add next.config.js
   git commit -m "feat: add basePath for /deck routing"
   git push origin main
   ```

3. Vercel will redeploy automatically

### 6.3 Configure Domain Routing

**Option A: Via Main Site Rewrites (Recommended)**

If you control `scopelock.mindprotocol.ai`, add rewrite rule:

```javascript
// In main scopelock.mindprotocol.ai next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/deck/:path*',
        destination: 'https://scopelock-deck-xyz.vercel.app/deck/:path*',
      },
    ]
  },
}
```

**Option B: Via Vercel Custom Domain**

1. Deploy to subdomain: `deck.scopelock.ai` (remove `/deck` from basePath)
2. Add CNAME: `deck.scopelock.ai` → `cname.vercel-dns.com`

---

### 6.4 Update CORS Origins

1. Go to Render backend service → **Environment**
2. Edit `CORS_ORIGINS`:
   ```
   https://scopelock.mindprotocol.ai/deck,http://localhost:3000
   ```
3. Save → Service will redeploy

---

### 6.5 Verify Production

1. Navigate to: `https://scopelock.mindprotocol.ai/deck`
2. Login with: `person1@scopelock.ai` / `INITIAL_PASSWORD`
3. Verify all features work (mission selector, chat, DoD, context)

**If all work: ✅ Production deployment complete**

---

## Testing

### Run Backend Tests

```bash
cd backend
pytest tests/ -v --cov=./ --cov-report=term-missing
```

**Expected output:**
```
tests/test_auth.py::test_login_success PASSED
tests/test_auth.py::test_login_invalid_credentials PASSED
tests/test_missions.py::test_list_missions PASSED
tests/test_chat.py::test_send_message PASSED
tests/test_dod.py::test_toggle_checkbox PASSED
...
======================== 15 passed in 2.3s =========================

Coverage: 87%
```

---

### Run Frontend Tests

```bash
cd frontend
npm run test
```

**Expected output:**
```
PASS  src/components/MissionSelector.test.tsx
PASS  src/components/ChatTab.test.tsx
PASS  src/components/DODTab.test.tsx

Test Suites: 8 passed, 8 total
Tests:       42 passed, 42 total
```

---

### Performance Test

```bash
# Run Lighthouse against production URL
npx lighthouse https://scopelock.mindprotocol.ai/deck --view
```

**Expected scores:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90

---

## Troubleshooting

### Issue: Backend won't start

**Symptoms:**
```
ERROR: Could not connect to database
```

**Cause:** Database connection failed

**Fix:**
```bash
# 1. Verify DATABASE_URL is correct
echo $DATABASE_URL

# 2. Test connection manually
psql $DATABASE_URL

# 3. Check if migrations ran
alembic current
# Should show: abc123 (head)

# 4. If no migrations, run:
alembic upgrade head
```

---

### Issue: Rafael not responding

**Symptoms:**
- Chat message sends, but response is "Sorry, I'm having trouble..."

**Cause:** Claude API key invalid or API down

**Fix:**
```bash
# 1. Verify API key is set
echo $CLAUDE_API_KEY

# 2. Test API key manually
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'

# 3. If invalid, get new key from https://deck.anthropic.com
# 4. Update .env (local) or Render environment variables (production)
```

---

### Issue: Frontend shows "Network Error"

**Symptoms:**
- Login button does nothing, or shows "Failed to fetch"

**Cause:** CORS issue or backend URL wrong

**Fix:**
```bash
# 1. Check frontend is pointing to correct backend URL
# In browser console:
console.log(process.env.NEXT_PUBLIC_API_URL)

# 2. Check backend CORS_ORIGINS includes frontend URL
# In backend .env:
CORS_ORIGINS=https://scopelock.mindprotocol.ai/deck,http://localhost:3000

# 3. Check backend is running:
curl https://scopelock-deck-api.onrender.com/health

# 4. Check browser console for CORS errors
# If CORS error, update backend CORS_ORIGINS and redeploy
```

---

### Issue: DoD checkboxes don't save

**Symptoms:**
- Checkbox toggles, but after refresh, state is reset

**Cause:** Database update failed or auth token invalid

**Fix:**
```bash
# 1. Check browser console for errors
# Look for: 401 Unauthorized or 403 Forbidden

# 2. If 401, re-login (token expired)

# 3. Check backend logs on Render:
# Render dashboard → Service → Logs tab
# Look for database errors

# 4. Verify database connection:
# Render dashboard → PostgreSQL instance → Connections tab
# Verify service is connected
```

---

### Issue: Slow performance (>5s page load)

**Symptoms:**
- Console takes >5 seconds to load
- Chat responses take >15 seconds

**Cause:** Cold start (Render free/starter tier) or database query slow

**Fix:**
```bash
# 1. Check Lighthouse performance score:
npx lighthouse https://scopelock.mindprotocol.ai/deck --only-categories=performance

# 2. If backend cold start issue:
# - Upgrade to Render Standard plan (no cold starts)
# - OR: Use uptime monitor to ping /health every 5 min

# 3. If database query slow:
# - Check indexes exist:
psql $DATABASE_URL
\d missions  # Should show indexes on assigned_to, status

# 4. If frontend bundle large:
npm run build
# Check .next/static/chunks sizes
# If >500KB, analyze with:
npx @next/bundle-analyzer
```

---

### Issue: Migration fails

**Symptoms:**
```
alembic upgrade head
ERROR: Target database is not up to date
```

**Cause:** Database schema out of sync

**Fix:**
```bash
# 1. Check current migration version:
alembic current

# 2. If no version shown, stamp initial:
alembic stamp head

# 3. If version conflicts:
# - Create new migration:
alembic revision --autogenerate -m "Fix schema conflict"

# - Review generated migration in alembic/versions/
# - Apply migration:
alembic upgrade head

# 4. If total database reset needed (DANGER - deletes all data):
# DROP DATABASE scopelock_console;
# CREATE DATABASE scopelock_console;
# alembic upgrade head
# python scripts/seed_test_data.py
```

---

## Monitoring

### Backend Logs

**Render:**
1. Go to service page → **Logs** tab
2. Filter by level: Error, Warning, Info
3. Search for specific errors

**Local:**
```bash
# Backend logs to stdout
uvicorn main:app --log-level debug
```

---

### Database Monitoring

**Check connections:**
```bash
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity WHERE datname='scopelock_console';"
```

**Check table sizes:**
```bash
psql $DATABASE_URL -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

### Performance Monitoring

**Frontend (Vercel):**
- Analytics → Performance tab
- Shows: Core Web Vitals, page load times

**Backend (Render):**
- Metrics tab
- Shows: CPU usage, memory usage, response times

---

## Updating Production

### Backend Update

```bash
# 1. Make changes locally
# 2. Test locally
npm run test  # (in backend/)

# 3. Commit and push to main
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. Render auto-deploys on push to main
# 5. Verify deployment on Render dashboard → Logs tab
```

---

### Frontend Update

```bash
# 1. Make changes locally
# 2. Test locally
npm run build  # (in frontend/)

# 3. Commit and push to main
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. Vercel auto-deploys on push to main
# 5. Verify deployment on Vercel dashboard
```

---

### Database Migration

```bash
# 1. Create migration locally
cd backend
alembic revision --autogenerate -m "Add new column"

# 2. Review migration in alembic/versions/
# 3. Test migration locally:
alembic upgrade head

# 4. Commit migration file:
git add alembic/versions/*.py
git commit -m "db: add migration for new column"
git push origin main

# 5. Run migration on production:
# - Render dashboard → Service → Shell tab
# - Run: alembic upgrade head

# 6. Verify migration:
alembic current  # Should show new version
```

---

## Rollback Strategy

### Frontend Rollback

1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click **[···]** → **Promote to Production**
4. Confirm → Instant rollback

---

### Backend Rollback

**Method 1: Redeploy previous commit**

```bash
# 1. Find working commit hash
git log --oneline

# 2. Go to Render dashboard → Service → Manual Deploy
# 3. Enter commit hash → Deploy
```

**Method 2: Git revert**

```bash
# 1. Revert bad commit
git revert <bad-commit-hash>

# 2. Push to main
git push origin main

# 3. Render auto-deploys
```

---

### Database Rollback

```bash
# 1. Downgrade migration
alembic downgrade -1  # Go back one migration

# 2. Verify:
alembic current

# 3. If data loss risk, backup first:
pg_dump $DATABASE_URL > backup.sql

# 4. Restore if needed:
psql $DATABASE_URL < backup.sql
```

---

## Support

**For issues:**
- Check this guide first (Troubleshooting section)
- Check backend logs (Render dashboard)
- Check frontend logs (browser console)
- Ask in #scopelock-deck Slack channel

**For bugs:**
- Create GitHub issue with:
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots
  - Browser console logs
  - Backend logs (if relevant)

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
