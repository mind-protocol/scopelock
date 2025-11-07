# GUIDE: Telegram Outreach System

**Mission:** Team Member Hunting via Telegram
**Purpose:** How to set up, deploy, and troubleshoot the Telegram outreach system
**Date Created:** 2025-11-07

**CRITICAL:** All commands must be copy-paste executable. No placeholders.

---

## Prerequisites

**Required Tools:**
- Python 3.11 or higher (backend)
- Node.js 18.0.0 or higher (frontend - Mission Deck)
- npm 9.0.0 or higher
- Git
- Render account (for backend deployment)
- Vercel account (for frontend - already set up for Mission Deck)

**Check versions:**
```bash
python --version   # Should show Python 3.11.x or higher
node --version     # Should show v18.0.0 or higher
npm --version      # Should show 9.0.0 or higher
git --version
```

**Required External Accounts:**
- **Telegram API credentials:** Get from https://my.telegram.org
- **FalkorDB access:** Production instance at mindprotocol.onrender.com (already set up)
- **Maya AI service:** TBD (either Claude Code or REST endpoint)

---

## Local Development Setup

### 1. Clone Repository

**If starting fresh:**
```bash
git clone https://github.com/mind-protocol/scopelock
cd scopelock
```

**If repository already exists locally:**
```bash
cd scopelock
git pull origin main
```

---

### 2. Install Backend Dependencies

**Create Python virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Install Python packages:**
```bash
pip install -r requirements.txt
```

**Add new dependencies for Telegram Outreach:**
```bash
pip install telethon qrcode[pil] cryptography python-dotenv
pip freeze > requirements.txt  # Update requirements.txt
```

**Verify installation:**
```bash
pip list | grep telethon   # Should show telethon package
pip list | grep qrcode     # Should show qrcode package
pip list | grep cryptography  # Should show cryptography package
```

---

### 3. Install Frontend Dependencies

**Navigate to frontend:**
```bash
cd ../frontend  # From backend/ directory
```

**Install Node packages:**
```bash
npm install
```

**Verify installation:**
```bash
npm list --depth=0  # Should show all packages installed
```

---

### 4. Environment Variables - Backend

**Create .env file:**
```bash
cd ../backend
touch .env
```

**Edit .env with required values:**

```env
# FalkorDB Connection
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=[get-from-nicolas-or-production-env]
GRAPH_NAME=scopelock

# Telegram API Credentials
TELEGRAM_API_ID=[your-api-id]
TELEGRAM_API_HASH=[your-api-hash]

# Encryption (Session Strings)
FERNET_ENCRYPTION_KEY=[generate-32-byte-key]

# Maya AI Service (TBD)
MAYA_AI_ENDPOINT=[to-be-determined]

# Server Config
PORT=8000
```

**How to get each value:**

**FALKORDB_API_KEY:**
```bash
# Ask Nicolas or check existing backend .env file
cat backend/.env | grep FALKORDB_API_KEY
```

**TELEGRAM_API_ID and TELEGRAM_API_HASH:**
```
1. Go to https://my.telegram.org
2. Log in with your phone number
3. Navigate to "API development tools"
4. Create new application:
   - App title: "ScopeLock Dashboard"
   - Short name: "scopelock"
   - Platform: Other
5. Copy api_id (numeric) and api_hash (hex string)
6. Paste into .env file
```

**FERNET_ENCRYPTION_KEY:**
```bash
# Generate 32-byte Fernet key
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
# Copy output to .env file
```

---

### 5. Environment Variables - Frontend

**Frontend inherits Mission Deck environment variables.**

No additional environment variables needed for frontend (Mission Deck auth already configured).

---

### 6. Database Setup (FalkorDB)

**No migrations needed** - FalkorDB is schemaless. Nodes are created on first use.

**Test FalkorDB connection:**
```bash
cd backend
python -c "
import os
import requests
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('FALKORDB_API_URL')
api_key = os.getenv('FALKORDB_API_KEY')
graph = os.getenv('GRAPH_NAME')

response = requests.post(
    url,
    headers={'Content-Type': 'application/json', 'X-API-Key': api_key},
    json={'graph_name': graph, 'query': 'MATCH (n) RETURN count(n) as total'},
    timeout=10
)

print('FalkorDB connection:', 'OK' if response.status_code == 200 else 'FAILED')
print('Response:', response.json())
"
# Expected output: FalkorDB connection: OK
```

---

### 7. Import Contact Leads (One-Time Setup)

**Run data ingestion script:**
```bash
cd backend
python scripts/import_contact_leads.py
# This imports 313 contacts from outreach/team_members/team_members.json
```

**Expected output:**
```
Loading contacts from: /home/mind-protocol/scopelock/outreach/team_members/team_members.json
Loaded 313 contacts
Importing to FalkorDB...
✓ contact-liam-7944133972 imported
✓ contact-sarah-1234567890 imported
...
Import complete:
- Total: 313
- Imported: 313
- Skipped duplicates: 0
- Failed: 0
```

**Verify import:**
```bash
python -c "
import requests, os
from dotenv import load_dotenv
load_dotenv()

url = os.getenv('FALKORDB_API_URL')
api_key = os.getenv('FALKORDB_API_KEY')
graph = os.getenv('GRAPH_NAME')

response = requests.post(
    url,
    headers={'Content-Type': 'application/json', 'X-API-Key': api_key},
    json={'graph_name': graph, 'query': 'MATCH (c:U4_Contact_Lead) RETURN count(c) as total'},
    timeout=10
)

print('Contacts in FalkorDB:', response.json()['results'][0]['total'])
"
# Expected: Contacts in FalkorDB: 313
```

---

### 8. Run Development Servers

**Start Backend (FastAPI):**
```bash
cd backend
source venv/bin/activate  # If not already activated
uvicorn app.main:app --reload --port 8000
# Backend starts at http://localhost:8000
# API docs at http://localhost:8000/docs
```

**Start Frontend (Next.js) - in separate terminal:**
```bash
cd frontend
npm run dev
# Frontend starts at http://localhost:3000
```

**Verify servers running:**
```bash
# Test backend health
curl http://localhost:8000/api/health
# Expected: {"status":"ok"}

# Test frontend (open in browser)
open http://localhost:3000
# Expected: Mission Deck dashboard loads
```

---

## Running Tests Locally

### Backend Acceptance Tests

**Run all backend tests:**
```bash
cd backend
pytest tests/acceptance/telegram_outreach/ -v
```

**Run specific test file:**
```bash
pytest tests/acceptance/telegram_outreach/test_qr_authentication.py -v
```

**Run with coverage:**
```bash
pytest tests/acceptance/telegram_outreach/ --cov=app.api.outreach --cov-report=html
# View coverage report: open htmlcov/index.html
```

**Expected output:**
```
✓ test_import_all_contacts_successfully (2.3s)
✓ test_generate_valid_qr_code (0.8s)
✓ test_session_authorized_successfully (1.2s)
✓ test_generate_personalized_message_with_hook (3.1s)
...
All tests passed (17/17)
```

---

### Frontend E2E Tests

**Run Playwright E2E tests:**
```bash
cd frontend
npx playwright test tests/integration/telegram-outreach/ --reporter=list
```

**Run with UI mode (for debugging):**
```bash
npx playwright test tests/integration/telegram-outreach/ --ui
```

---

### Performance Tests

**Run performance benchmarks:**
```bash
cd backend
python tests/performance/benchmark_telegram_outreach.py
```

**Expected benchmarks:**
- Contact queue query (313 nodes): ≤ 1000ms
- Message generation (Maya): ≤ 5000ms
- Reply detection polling cycle: ≤ 10000ms per session

---

## Deployment

### Backend Deployment (Render)

**Prerequisites:**
- Render account (if not already logged in)
- Render CLI (optional, can also use dashboard)

---

#### Option 1: Deploy via Render Dashboard (Recommended)

**Steps:**

1. **Create New Web Service:**
   ```
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repository: mind-protocol/scopelock
   - Click "Connect"
   ```

2. **Configure Service:**
   ```
   Name: scopelock-backend
   Region: Oregon (same as existing backend)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Plan: Starter (or match existing backend plan)
   ```

3. **Add Environment Variables:**
   ```
   Navigate to: Environment → Add Environment Variable

   Add each variable:
   - FALKORDB_API_URL = https://mindprotocol.onrender.com/admin/query
   - FALKORDB_API_KEY = [production key from existing backend]
   - GRAPH_NAME = scopelock
   - TELEGRAM_API_ID = [from my.telegram.org]
   - TELEGRAM_API_HASH = [from my.telegram.org]
   - FERNET_ENCRYPTION_KEY = [generated 32-byte key]
   - MAYA_AI_ENDPOINT = [TBD]
   ```

4. **Deploy:**
   ```
   - Click "Create Web Service"
   - Render will auto-deploy
   - Wait for build to complete (~3-5 minutes)
   ```

5. **Verify Deployment:**
   ```bash
   # Get deployment URL from Render dashboard
   curl https://scopelock-backend.onrender.com/api/health
   # Expected: {"status":"ok"}
   ```

---

#### Option 2: Deploy via Render CLI

**Install Render CLI:**
```bash
brew install render  # macOS
# Or download from https://render.com/docs/cli
```

**Login:**
```bash
render login
```

**Create render.yaml:**
```bash
cd backend
cat > render.yaml << 'EOF'
services:
  - type: web
    name: scopelock-backend
    env: python
    region: oregon
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: FALKORDB_API_URL
        value: https://mindprotocol.onrender.com/admin/query
      - key: FALKORDB_API_KEY
        sync: false  # Set manually in dashboard
      - key: GRAPH_NAME
        value: scopelock
      - key: TELEGRAM_API_ID
        sync: false
      - key: TELEGRAM_API_HASH
        sync: false
      - key: FERNET_ENCRYPTION_KEY
        sync: false
EOF
```

**Deploy:**
```bash
render services create
# Follow prompts
```

---

### Frontend Deployment (Vercel)

**Frontend deploys as part of Mission Deck** (already set up on Vercel).

**No separate deployment needed** - Mission Deck auto-deploys when pushing to main branch.

**Integration:**
- Telegram Outreach mission UI integrates into Mission Deck app
- Reuses Mission Deck authentication and layout
- Located at: `src/app/missions/telegram-outreach/page.tsx`

**Vercel auto-deploys on push:**
```bash
git add .
git commit -m "feat: add Telegram Outreach mission"
git push origin main
# Vercel automatically deploys within 2-3 minutes
```

---

### Post-Deployment Verification

**Check backend deployment:**
```bash
# Test backend health
curl https://scopelock-backend.onrender.com/api/health
# Expected: {"status":"ok"}

# Test FalkorDB connection
curl https://scopelock-backend.onrender.com/api/outreach/queue
# Expected: {"contacts": [...], "total_count": 313}

# Test QR auth endpoint
curl -X POST https://scopelock-backend.onrender.com/api/outreach/telegram/qr-start \
  -H "Authorization: Bearer [valid-jwt-token]"
# Expected: {"qr_code": "data:image/png;base64,...", "token": "...", "expires_in": 120}
```

**Check frontend deployment:**
```bash
# Open Mission Deck
open https://scopelock.mindprotocol.ai/missions/telegram-outreach
# Expected: Telegram Outreach mission dashboard loads
```

---

### Background Worker Deployment

**Background monitoring worker runs as part of backend deployment.**

**Verify worker is running:**
```bash
# Check Render logs for heartbeat messages
render logs scopelock-backend | grep "Monitoring worker alive"
# Expected: Log entries every 5 minutes
```

**Worker auto-starts on backend startup:**
- Defined in `backend/app/main.py` as FastAPI lifespan event
- Runs AsyncIO loop polling Telegram conversations every 60 seconds

---

## Troubleshooting

### Issue: "Missing environment variable TELEGRAM_API_ID"

**Symptoms:**
- Backend crashes on startup
- Error in logs: "Missing TELEGRAM_API_ID or TELEGRAM_API_HASH"

**Cause:**
- Telegram API credentials not set in .env (local) or Render environment variables (production)

**Fix:**

**Local:**
```bash
# Verify .env file exists
cat backend/.env | grep TELEGRAM_API

# If missing, add to .env:
echo "TELEGRAM_API_ID=[your-api-id]" >> backend/.env
echo "TELEGRAM_API_HASH=[your-api-hash]" >> backend/.env

# Restart backend
cd backend
uvicorn app.main:app --reload
```

**Production (Render):**
```
1. Go to Render dashboard → scopelock-backend → Environment
2. Add environment variable: TELEGRAM_API_ID = [value]
3. Add environment variable: TELEGRAM_API_HASH = [value]
4. Render auto-redeploys after env var changes
```

---

### Issue: "FalkorDB connection failed"

**Symptoms:**
- API endpoints return 500 errors
- Error in logs: "FalkorDB API error: 401 - Unauthorized"

**Cause:**
- Invalid FALKORDB_API_KEY
- FalkorDB instance is down

**Fix:**

**Check API key:**
```bash
# Local:
cat backend/.env | grep FALKORDB_API_KEY
# Verify key is correct (compare with existing backend env)

# Production:
# Check Render dashboard → Environment → FALKORDB_API_KEY
```

**Test FalkorDB connection:**
```bash
curl -X POST https://mindprotocol.onrender.com/admin/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: [your-api-key]" \
  -d '{"graph_name":"scopelock","query":"MATCH (n) RETURN count(n)"}'
# Expected: {"results": [{"count(n)": ...}]}
```

**If FalkorDB is down:**
```
Contact Nicolas - FalkorDB instance may need restart
Check: https://dashboard.render.com/web/[falkordb-service-id]
```

---

### Issue: "QR code generation fails"

**Symptoms:**
- POST /api/outreach/telegram/qr-start returns 500 error
- Error in logs: "Failed to start QR login: ..."

**Cause:**
- Telegram API credentials invalid
- Network issue connecting to Telegram servers
- Telethon library not installed

**Fix:**

**Verify Telegram credentials:**
```bash
# Test Telegram API connection
python -c "
from telethon import TelegramClient
from telethon.sessions import StringSession
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test():
    client = TelegramClient(
        StringSession(),
        int(os.getenv('TELEGRAM_API_ID')),
        os.getenv('TELEGRAM_API_HASH')
    )
    await client.connect()
    print('Telegram connection: OK')
    await client.disconnect()

asyncio.run(test())
"
# Expected: Telegram connection: OK
```

**If Telethon not installed:**
```bash
pip install telethon
```

**If credentials invalid:**
```
1. Go to https://my.telegram.org
2. Verify API credentials are correct
3. Regenerate if needed
4. Update .env file
```

---

### Issue: "Session encryption failed"

**Symptoms:**
- Error after QR scan: "Critical: Session encryption failed"
- Error in logs: "InvalidToken" from cryptography library

**Cause:**
- FERNET_ENCRYPTION_KEY not set or invalid
- Key is not 32 bytes (URL-safe base64-encoded)

**Fix:**

**Generate new Fernet key:**
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
# Output example: "xK8jD3mP9nQ2rT5vW8yZ1aB4cE6fG9hJ0kL3mN6p="
```

**Update environment:**
```bash
# Local:
echo "FERNET_ENCRYPTION_KEY=[generated-key]" >> backend/.env

# Production:
# Add to Render dashboard → Environment → FERNET_ENCRYPTION_KEY
```

**Verify key works:**
```bash
python -c "
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv('FERNET_ENCRYPTION_KEY').encode()
cipher = Fernet(key)

# Test encryption/decryption
original = 'test session string'
encrypted = cipher.encrypt(original.encode())
decrypted = cipher.decrypt(encrypted).decode()

assert original == decrypted
print('Encryption key: OK')
"
# Expected: Encryption key: OK
```

---

### Issue: "Maya AI timeout"

**Symptoms:**
- Message generation takes >10 seconds
- Response includes: {warning: "Maya AI timed out, using generic template"}

**Cause:**
- Maya AI service slow or unreachable
- MAYA_AI_ENDPOINT not configured

**Fix:**

**Check Maya AI endpoint:**
```bash
cat backend/.env | grep MAYA_AI_ENDPOINT
# If not set or incorrect, update
```

**Test Maya AI service:**
```bash
# TBD: Depends on Maya AI implementation (REST or Claude Code)
```

**Temporary workaround:**
```
Generic template fallback is working correctly
Message generation will use non-personalized template
Team member can manually edit before sending
```

---

### Issue: "Background worker not polling"

**Symptoms:**
- Replies not detected
- No "Monitoring worker alive" logs

**Cause:**
- Worker crashed on startup
- No active Telegram sessions to monitor

**Fix:**

**Check backend logs:**
```bash
# Local:
# Worker logs appear in terminal where backend is running

# Production (Render):
render logs scopelock-backend | grep "monitoring"
# Look for startup errors or crash messages
```

**Verify active sessions:**
```bash
curl https://scopelock-backend.onrender.com/api/outreach/conversations
# Expected: {"conversations": [...]}
# If empty array: No sessions connected, worker has nothing to monitor
```

**Restart backend:**
```bash
# Production (Render):
# Dashboard → scopelock-backend → Manual Deploy → Clear build cache & deploy
```

---

### Issue: "Import contact leads script fails"

**Symptoms:**
- Script errors when running `python scripts/import_contact_leads.py`
- Error: "FileNotFoundError: team_members.json not found"

**Cause:**
- Running script from wrong directory
- team_members.json doesn't exist

**Fix:**

**Run from correct directory:**
```bash
cd /home/mind-protocol/scopelock
python backend/scripts/import_contact_leads.py
# Script expects to find: outreach/team_members/team_members.json
```

**Verify file exists:**
```bash
ls -lh outreach/team_members/team_members.json
# Expected: -rw-r--r-- ... 460K Nov 7 ... team_members.json
```

**If file missing:**
```bash
# Re-run analysis script to generate team_members.json
python outreach/find_team_members.py
# This creates outreach/team_members/team_members.json
```

---

## Monitoring & Logs

### View Logs

**Development (Backend):**
```bash
cd backend
uvicorn app.main:app --reload --log-level debug
# Logs appear in terminal with DEBUG level details
```

**Development (Frontend):**
```bash
cd frontend
npm run dev
# Logs appear in terminal where Next.js is running
```

**Production (Backend - Render):**
```bash
# View latest logs
render logs scopelock-backend

# Stream logs in real-time
render logs scopelock-backend --tail

# Filter logs
render logs scopelock-backend | grep "ERROR"
```

**Production (Frontend - Vercel):**
```bash
# View latest deployment logs
vercel logs

# Stream logs in real-time
vercel logs --follow

# View specific deployment
vercel logs [deployment-url]
```

---

### Error Tracking

**Platform:** Backend logs to stdout (Render captures)

**View errors:**
```bash
# Render dashboard
https://dashboard.render.com/web/[service-id]/logs

# Filter for errors
render logs scopelock-backend | grep -i "error\|exception\|failed"
```

**Critical errors to watch for:**
- Session encryption failures
- FalkorDB connection errors
- Telegram API rate limit warnings
- Background worker crashes

---

### Performance Monitoring

**Platform:** Render built-in monitoring

**View metrics:**
```
https://dashboard.render.com/web/[service-id]/metrics

Key metrics:
- CPU usage (should stay <70%)
- Memory usage (should stay <80% of limit)
- Response time (p95 should be <500ms for API endpoints)
```

**Background worker health:**
```bash
# Check for heartbeat logs (every 5 minutes)
render logs scopelock-backend | grep "Monitoring worker alive"
# Expected: Recent log entries within last 5 minutes
```

---

## Useful Commands

**Quick Reference:**

```bash
# Development
cd backend && uvicorn app.main:app --reload                    # Start backend
cd frontend && npm run dev                                      # Start frontend
cd backend && pytest tests/acceptance/telegram_outreach/ -v    # Run tests

# Database
python backend/scripts/import_contact_leads.py                 # Import contacts
python -c "..." # Test FalkorDB connection (see above)         # Test FalkorDB

# Deployment
git push origin main                                            # Deploy (auto)
render logs scopelock-backend                                   # View backend logs
vercel logs                                                     # View frontend logs
render services restart scopelock-backend                       # Restart backend

# Troubleshooting
render logs scopelock-backend | grep ERROR                      # Find errors
curl [backend-url]/api/health                                   # Test health
curl [backend-url]/api/outreach/queue                           # Test queue
```

---

## Support

**For questions about this mission:**
- **Technical issues:** Ask Rafael (The Guide) - backend/Telegram/deployment
- **Deployment issues:** Ask Rafael (DevOps support) - Render/Vercel troubleshooting
- **Scope/requirements:** Ask Inna (The Specifier) - AC.md questions
- **QA/testing:** Ask Sofia (The Checker) - test failures, DoD verification

**Documentation:**
- Mission documentation: `docs/missions/telegram-outreach/`
  - AC.md - Acceptance criteria
  - MECHANISM.md - Architecture
  - ALGORITHM.md - Implementation steps
  - VALIDATION.md - Test specifications
- ScopeLock process: `docs/core/delivery_model.md`
- Standard tech stack: `docs/core/tech-stack.md`

---

## Notes

**Important Production Considerations:**

1. **Fernet Encryption Key:** NEVER commit to Git. Store only in environment variables.
   - Losing this key means all stored sessions become unusable
   - Keep backup of production key in secure password manager

2. **Telegram API Rate Limits:** Background worker respects 30 req/s limit
   - If monitoring 100+ sessions: May need to increase polling interval from 60s to 90s
   - Monitor Render logs for rate limit warnings

3. **Background Worker:** Runs as part of FastAPI app (not separate process)
   - Auto-starts on backend startup
   - Auto-recovers from crashes (FastAPI restarts on error)
   - Logs heartbeat every 5 minutes (if no heartbeat, worker crashed)

4. **Session Revocation:** Users can revoke in Telegram app settings
   - Session shows as "ScopeLock Dashboard" in active sessions
   - System handles revoked sessions gracefully (updates is_active=false)

5. **Data Persistence:** All data in FalkorDB (no local state)
   - Backend can be restarted without losing sessions/messages
   - FalkorDB managed by Render (automatic backups)

**Common Gotchas:**

- **QR Code Expires:** QR codes expire after 120 seconds - user must scan quickly
- **Maya AI Timeout:** 10s timeout may be too short for complex prompts - generic template fallback works fine
- **Contact Import:** Can be run multiple times safely (updates existing, doesn't duplicate)
- **Manual Send Tracking:** System can't verify message was actually sent - relies on team member honesty
