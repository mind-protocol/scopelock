# GUIDE: [Mission Name]

**Mission:** [Brief mission name]
**Purpose:** How to set up, deploy, and troubleshoot this project
**Date Created:** YYYY-MM-DD

**CRITICAL:** All commands must be copy-paste executable. No placeholders.

---

## Prerequisites

**Required Tools:**
- [Tool 1] version [X.Y.Z] or higher
- [Tool 2] version [A.B.C] or higher
- [Tool 3]

**Example:**
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- PostgreSQL 15 (if running locally) OR Render account for managed database
- Git

**Check versions:**
```bash
node --version   # Should show v18.0.0 or higher
npm --version    # Should show 9.0.0 or higher
git --version
```

---

## Local Development Setup

### 1. Clone Repository

**If starting fresh:**
```bash
git clone [repository-url]
cd [repository-name]
```

**If repository already exists locally:**
```bash
cd [repository-name]
git pull origin main
```

**Example:**
```bash
git clone https://github.com/client/project-name
cd project-name
```

---

### 2. Install Dependencies

**Command:**
```bash
[exact install command]
```

**Example (Next.js):**
```bash
npm install
```

**Example (Python):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Verify installation:**
```bash
[command to verify dependencies installed]
```

**Example:**
```bash
npm list --depth=0  # Should show all packages installed
```

---

### 3. Environment Variables

**Copy template:**
```bash
cp .env.example .env.local
```

**Required variables:**

Edit `.env.local` with these values:

```env
# Database
DATABASE_URL=[your-database-url]

# Authentication
JWT_SECRET=[generate-random-secret]

# External Services
[SERVICE_API_KEY]=[your-api-key]
```

**How to get each value:**

**DATABASE_URL:**
```
[Exact instructions on where to get this value]
```

**Example:**
```
DATABASE_URL:
- If using Render managed database: Copy from Render dashboard → Database → Connection String (External)
- If using local PostgreSQL: postgresql://postgres:postgres@localhost:5432/[dbname]
```

**JWT_SECRET:**
```bash
# Generate random secret
openssl rand -base64 32
```

**[SERVICE_API_KEY]:**
```
[Where to get this key - dashboard link, signup process]
```

**Example:**
```
STRIPE_SECRET_KEY:
1. Log into Stripe dashboard: https://dashboard.stripe.com
2. Navigate to Developers → API keys
3. Copy "Secret key" (starts with sk_test_ for test mode)
4. Paste into .env.local
```

---

### 4. Database Setup

**Run migrations:**
```bash
[exact migration command]
```

**Seed database (optional):**
```bash
[exact seed command]
```

**Example (Prisma):**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test data (optional)
npx prisma db seed
```

**Example (Django):**
```bash
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json
```

**Verify database:**
```bash
[command to check database is working]
```

**Example:**
```bash
# Check Prisma connection
npx prisma db pull  # Should succeed without errors

# Or open Prisma Studio to view data
npx prisma studio
# Opens browser at http://localhost:5555
```

---

### 5. Run Development Server

**Start server:**
```bash
[exact dev server command]
```

**Example (Next.js):**
```bash
npm run dev
# Server starts at http://localhost:3000
```

**Example (FastAPI):**
```bash
uvicorn app.main:app --reload --port 8000
# Server starts at http://localhost:8000
# API docs at http://localhost:8000/docs
```

**Verify server running:**
```
Open browser to [URL]
You should see [expected page/response]
```

**Example:**
```
Open browser to http://localhost:3000
You should see the homepage with login form
```

---

## Running Tests Locally

### Unit Tests

**Run all unit tests:**
```bash
[exact test command]
```

**Example:**
```bash
npm run test
```

---

### Acceptance Tests

**Run acceptance tests:**
```bash
[exact acceptance test command]
```

**Example:**
```bash
# Make sure dev server is running first
npm run dev  # In one terminal

# Then run tests in another terminal
npm run test:acceptance
```

**Expected output:**
```
[What successful test run looks like]
```

---

### Performance Tests

**Run performance benchmarks:**
```bash
[exact performance test command]
```

**Example:**
```bash
npm run test:perf
```

**Expected benchmarks:**
- [Metric 1]: ≤ [threshold]
- [Metric 2]: ≤ [threshold]

---

## Deployment

### Platform: [Vercel / Render / Railway / etc.]

**Prerequisites:**
- Account on [platform]
- [Platform] CLI installed (if needed)

---

### Option 1: Deploy via Dashboard (Recommended)

**Steps:**

1. **Connect Repository:**
   ```
   [Step-by-step dashboard instructions]
   ```

2. **Configure Environment Variables:**
   ```
   [Where to add env vars in dashboard]
   ```

3. **Deploy:**
   ```
   [How to trigger deploy]
   ```

**Example (Vercel):**
```
1. Connect Repository:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Import"

2. Configure Environment Variables:
   - In project settings → Environment Variables
   - Add each variable from .env.local (except DATABASE_URL if using Vercel Postgres)
   - DATABASE_URL: Use Vercel Postgres connection string
   - JWT_SECRET: Generate new secret for production
   - STRIPE_SECRET_KEY: Use production key (sk_live_...)

3. Deploy:
   - Vercel auto-deploys on push to main branch
   - Or click "Deploy" button in dashboard for manual deploy
```

---

### Option 2: Deploy via CLI

**Install CLI:**
```bash
[installation command]
```

**Login:**
```bash
[login command]
```

**Deploy:**
```bash
[deploy command]
```

**Example (Vercel CLI):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
# Follow prompts to link project and deploy
```

---

### Post-Deployment Verification

**Check deployment:**
```bash
[command to check deployment status]
```

**Test endpoints:**
```bash
curl [production-url]/api/health
# Expected: {"status": "ok"}
```

**Example:**
```bash
# Check Vercel deployment
vercel ls

# Test health endpoint
curl https://your-app.vercel.app/api/health
# Expected: {"status":"ok","timestamp":"2025-11-05T12:00:00Z"}

# Test authentication (should fail without credentials)
curl https://your-app.vercel.app/api/auth/me
# Expected: 401 Unauthorized
```

---

### Database Migrations (Production)

**IMPORTANT:** Always backup database before migrations

**Backup:**
```bash
[backup command]
```

**Run migration:**
```bash
[migration command for production]
```

**Example (Prisma):**
```bash
# Backup (Render manages backups automatically, but verify)
# Check Render dashboard → Database → Backups

# Run migration (automatically runs on deploy via package.json postinstall script)
# Or run manually:
npx prisma migrate deploy
```

---

## Troubleshooting

### Issue: [Common Problem 1]

**Symptoms:**
```
[What the user sees / error message]
```

**Cause:**
```
[Why this happens]
```

**Fix:**
```bash
[Exact commands to fix the issue]
```

**Example:**
```
Issue: "Error: P1001: Can't reach database server"

Symptoms:
- Application crashes on startup
- Error in logs: "P1001: Can't reach database server at localhost:5432"

Cause:
- PostgreSQL is not running
- OR DATABASE_URL in .env.local is incorrect

Fix:
# Check if PostgreSQL is running
pg_isready

# If not running, start it:
# macOS (Homebrew):
brew services start postgresql@15

# Ubuntu/Debian:
sudo systemctl start postgresql

# Verify DATABASE_URL in .env.local is correct:
cat .env.local | grep DATABASE_URL

# Test connection:
npx prisma db pull
```

---

### Issue: [Common Problem 2]

[Same structure]

**Example:**
```
Issue: "Module not found" errors

Symptoms:
- Import errors in console
- Application fails to start

Cause:
- node_modules not installed or out of date

Fix:
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Verify installation
npm list --depth=0
```

---

### Issue: [Common Problem 3]

**Example:**
```
Issue: Tests fail locally but pass in CI

Symptoms:
- Acceptance tests fail on your machine
- Same tests pass in GitHub Actions

Cause:
- Local environment variables missing or incorrect
- Test database not seeded

Fix:
# Ensure .env.test exists (copy from .env.example)
cp .env.example .env.test

# Verify DATABASE_URL points to test database
cat .env.test | grep DATABASE_URL

# Reset and seed test database
npx prisma migrate reset --force
npx prisma db seed

# Run tests again
npm run test:acceptance
```

---

### Issue: Deployment succeeds but app crashes

**Symptoms:**
- Vercel shows "Deployment successful"
- Opening app URL shows error page or 500 error

**Cause:**
- Missing environment variables in production
- Database connection issues

**Fix:**
```bash
# Check Vercel logs
vercel logs [deployment-url]

# Verify all environment variables set in Vercel dashboard:
# Settings → Environment Variables
# Ensure these are present:
# - DATABASE_URL
# - JWT_SECRET
# - [all other required vars]

# Check database connection:
# In Vercel dashboard → Storage → Database
# Verify status is "Active"

# Redeploy after fixing env vars
vercel --prod
```

---

## Monitoring & Logs

### View Logs

**Development:**
```bash
[command to view dev logs]
```

**Example:**
```bash
# Logs appear in terminal where dev server is running
npm run dev

# For more verbose logging:
DEBUG=* npm run dev
```

**Production:**
```bash
[command to view production logs]
```

**Example (Vercel):**
```bash
# View logs for latest deployment
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]

# Stream logs in real-time
vercel logs --follow
```

---

### Error Tracking

**Platform:** [Sentry / LogRocket / etc.]

**View errors:**
```
[Link to error tracking dashboard]
```

**Example:**
```
Platform: Sentry

View errors: https://sentry.io/organizations/[org]/projects/[project]

Real-time alerts sent to: [Slack channel / email]
```

---

### Performance Monitoring

**Platform:** [Vercel Analytics / New Relic / etc.]

**View metrics:**
```
[Link to performance dashboard]
```

**Example:**
```
Platform: Vercel Analytics (built-in)

View metrics: https://vercel.com/[team]/[project]/analytics

Key metrics:
- Web Vitals (LCP, FID, CLS)
- Page load times
- API response times
```

---

## Useful Commands

**Quick Reference:**

```bash
# Development
[dev server command]                    # Start dev server
[test command]                          # Run tests
[lint command]                          # Run linter

# Database
[migration command]                     # Run migrations
[seed command]                          # Seed database
[studio/admin command]                  # Open database GUI

# Deployment
[deploy command]                        # Deploy to production
[logs command]                          # View logs
[rollback command]                      # Rollback deployment
```

**Example:**
```bash
# Development
npm run dev                             # Start dev server
npm run test                            # Run all tests
npm run lint                            # Run ESLint

# Database
npx prisma migrate dev                  # Run migrations
npx prisma db seed                      # Seed database
npx prisma studio                       # Open Prisma Studio

# Deployment
vercel --prod                           # Deploy to production
vercel logs                             # View logs
vercel rollback                         # Rollback to previous deployment
```

---

## Support

**For questions about this mission:**
- **Technical issues:** Ask Rafael (The Guide)
- **Deployment issues:** Ask Rafael (DevOps support)
- **Scope/requirements:** Ask Inna (The Specifier)
- **QA/testing:** Ask Sofia (The Checker)

**Documentation:**
- Mission documentation: `docs/missions/[mission-name]/`
- ScopeLock process: `docs/core/delivery_model.md`
- Standard tech stack: `docs/core/tech-stack.md`

---

## Notes

[Any additional deployment tips, gotchas, or things to be aware of]
