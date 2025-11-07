# GUIDE: Team Member Hunting (Telegram Outreach System)

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Setup, deployment, and usage guide for Telegram outreach to 313 contacts

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
- Telegram API credentials (API ID + API Hash)
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
cd backend
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.104.0 uvicorn-0.24.0 telethon-1.30.0 cryptography-41.0.0 ...
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

# Telegram API Credentials
# Get these from https://my.telegram.org/apps
TELEGRAM_API_ID=<your-api-id>
TELEGRAM_API_HASH=<your-api-hash>

# Telegram Session Encryption
TELEGRAM_SESSION_KEY=<generate-256-bit-key>

# Server
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
```

**Generate encryption key:**
```bash
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Copy output to `TELEGRAM_SESSION_KEY`.

#### Load Contacts into FalkorDB

```bash
python3 scripts/ingest_analysis_data.py ../data/team_members.json
```

**Expected output:**
```
Loading contacts from ../data/team_members.json...
Found 313 contacts
  Loaded 50/313 contacts...
  Loaded 100/313 contacts...
  ...
  Loaded 300/313 contacts...

✅ Successfully loaded 313 contacts:
   - Supervisors: 150
   - Hustlers: 129
   - Hybrids: 34

✅ Ingestion complete! 313 contacts ready for outreach.
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
cd ../frontend  # From backend/ go to frontend/
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
# NEXT_PUBLIC_API_URL=https://scopelock-outreach-backend.onrender.com/api
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
Open browser: `http://localhost:3000/deck/outreach`

---

### Step 4: Connect Telegram Session

Before reply monitoring can work, you need to authenticate a Telegram session:

1. Open Mission Deck in browser: `http://localhost:3000/deck/outreach`
2. Click "Settings" → "Connect Telegram"
3. Enter phone number (international format, e.g., `+1234567890`)
4. Telegram will send you a 2FA code
5. Enter code in dashboard
6. Session created and encrypted
7. Background worker starts monitoring

**Expected result:**
- "Telegram Connected ✅" shown in dashboard
- Worker logs: "Starting Telegram monitoring worker..."

---

### Step 5: Test Outreach Flow

#### Generate Message

1. Open outreach queue: `http://localhost:3000/deck/outreach`
2. Click first contact card
3. Click "Generate Message"
4. Wait 3-5 seconds
5. See personalized message in text area

**Expected:**
- Message references contact's name
- Message references specific signal (e.g., "voice AI")
- Message 80-150 words

#### Send Message (Manual)

1. Click "Copy to Clipboard"
2. See "Copied!" notification
3. Open Telegram app
4. Find contact by telegram_id or name
5. Paste message
6. Send manually via Telegram
7. Return to dashboard
8. Click "Mark as Sent"
9. Contact status updates to "Sent"

#### Verify Reply Detection

1. Wait for contact to reply (or simulate reply for testing)
2. Within 60 seconds, dashboard notification appears
3. Click notification badge
4. See reply in "Unread Replies" panel
5. Click "View Full" → see full conversation
6. Click "Mark Interested" → status updates

---

## Deployment

### Backend Deployment (Render)

#### Step 1: Configure Render Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect to GitHub repository: `mind-protocol/scopelock`
4. Configure:
   - **Name:** scopelock-outreach-backend
   - **Runtime:** Python 3.11
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Starter ($7/month)
   - **Region:** Oregon (same as FalkorDB)

#### Step 2: Add Environment Variables

In Render dashboard, add:

```
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock
TELEGRAM_API_ID=<your-api-id>
TELEGRAM_API_HASH=<your-api-hash>
TELEGRAM_SESSION_KEY=<your-256-bit-key>
PORT=10000
CORS_ORIGINS=https://deck.scopelock.mindprotocol.ai
```

#### Step 3: Deploy

Click "Create Web Service"

**Expected:**
- Build completes in ~5 minutes
- Service starts successfully
- Health check passes: `https://scopelock-outreach-backend.onrender.com/health`

#### Step 4: Load Contacts (Production)

SSH into Render or use Render shell:

```bash
python3 scripts/ingest_analysis_data.py data/team_members.json
```

**Expected:** 313 contacts loaded

#### Step 5: Connect Telegram Session (Production)

1. Open production frontend: `https://deck.scopelock.mindprotocol.ai/deck/outreach`
2. Click "Settings" → "Connect Telegram"
3. Enter phone number + 2FA code
4. Session created and encrypted in production FalkorDB
5. Background worker starts

**Verify worker health:**
```bash
curl https://scopelock-outreach-backend.onrender.com/api/outreach/worker-health
```

**Expected:** `{"status": "running", "last_check": "..."}`

---

### Frontend Deployment (Vercel)

#### Step 1: Configure Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import GitHub repository: `mind-protocol/scopelock`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### Step 2: Add Environment Variables

In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://scopelock-outreach-backend.onrender.com/api
```

#### Step 3: Deploy

Click "Deploy"

**Expected:**
- Build completes in ~3 minutes
- Deployment successful
- Live URL: `https://deck-scopelock.vercel.app/deck/outreach`

#### Step 4: Verify Deployment

Open browser: `https://deck-scopelock.vercel.app/deck/outreach`

**Expected:**
- Page loads successfully
- Contact queue displays 313 contacts
- Can generate messages
- Can copy to clipboard
- No console errors

---

## Troubleshooting

### Issue: "Failed to connect to FalkorDB"

**Symptoms:**
- Backend server fails to start
- Error: `Connection refused` or `Timeout`

**Cause:**
- Incorrect FALKORDB_API_URL
- Incorrect FALKORDB_API_KEY

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

---

### Issue: "Telegram session expired"

**Symptoms:**
- Worker logs: "CRITICAL: Telegram session expired!"
- No reply detection

**Cause:**
- Telethon session expired (usually after 30 days)
- Session revoked from another device

**Fix:**
1. Open dashboard: Settings → Connect Telegram
2. Re-enter phone number + 2FA code
3. New session created
4. Worker restarts automatically

**Alternative (SSH into Render):**
```bash
# Delete old session
python3 -c "
from services.falkordb_client import query_graph
query_graph('MATCH (conv:U4_Telegram_Conversation) DELETE conv', {})
"

# Reconnect via dashboard
```

---

### Issue: "Message generation takes >10 seconds"

**Symptoms:**
- Click "Generate Message"
- Loading spinner shows for 10+ seconds
- Sometimes times out

**Cause:**
- Claude Code subprocess slow
- Contact has too much analysis data

**Fix:**
```python
# In maya_service.py, reduce matching_messages sent to Claude
# From:
activity = "\n".join([
    f"- {msg['text'][:100]}..." for msg in matching_messages[:3]
])

# To:
activity = "\n".join([
    f"- {msg['text'][:50]}..." for msg in matching_messages[:2]  # Only top 2
])
```

**Alternative:** Use shorter timeout in API call

---

### Issue: "Reply not detected for 5+ minutes"

**Symptoms:**
- Contact replied on Telegram
- Dashboard notification doesn't appear
- Check worker health: shows "running"

**Cause:**
- Worker polling but not finding new messages
- Contact telegram_id mismatch

**Fix:**

1. Check worker logs (Render dashboard → Logs):
```
Checking 127 conversations...
  ⚠️  Error checking Liam: No such user
```

If "No such user" → telegram_id is wrong

2. Manually create reply event (fallback):
- Dashboard → Contact profile → "Add Manual Reply"
- Paste reply text
- Submit

---

### Issue: "Cannot send to same contact twice"

**Symptoms:**
- Try to mark message as sent
- Error: "Already sent to this contact"

**Cause:**
- Contact status is already 'sent' (expected behavior)
- Duplicate send prevention working correctly

**Fix:**
- This is correct behavior (not a bug)
- To reset for testing:
```bash
# SSH into backend or use FalkorDB query tool
python3 -c "
from services.outreach.outreach_tracker import OutreachTracker
tracker = OutreachTracker()
tracker._update_status('contact-7944133972', 'pending')
"
```

**Note:** Only reset in development. In production, cannot resend to same contact.

---

### Issue: "Worker status shows 'stopped'"

**Symptoms:**
- GET /api/outreach/worker-health returns `{"status": "stopped"}`
- No reply detection

**Cause:**
- Worker crashed
- Session expired
- Unknown error

**Fix:**

1. Check backend logs for errors
2. Look for last error before stop:
```
🚨 CRITICAL: Telegram session expired!
```
or
```
❌ Unknown error: ...
```

3. If session expired → Reconnect (see above)
4. If unknown error → Restart backend service (Render dashboard → Manual Deploy)

---

## Usage Guide

### For Team Members

#### 1. Viewing Outreach Queue

1. Open Mission Deck: https://deck.scopelock.mindprotocol.ai/deck/outreach
2. See 313 contacts sorted by hustler score (highest first)
3. Filters available:
   - Profile type: Supervisor / Hustler / Hybrid
   - Status: Pending / Sent / Replied / Interested
4. Click contact to see full profile

#### 2. Generating & Sending Messages

1. Click contact card → Opens profile
2. Click "Generate Message"
3. Wait 3-5 seconds → Personalized message appears
4. Review message (edit if needed)
5. Click "Copy to Clipboard"
6. Open Telegram app
7. Find contact (search by name or telegram_id)
8. Paste message → Send manually
9. Return to dashboard
10. Click "Mark as Sent"
11. Contact moves to "Sent" section

#### 3. Responding to Replies

1. When contact replies, notification badge appears (red dot with count)
2. Click notification → "Unread Replies" panel opens
3. See reply preview + timestamp
4. Click "View Full" → See full conversation
5. Read reply → Mark interest:
   - "Mark Interested" → Status = interested (follow up needed)
   - "Mark Not Interested" → Status = not_interested (no follow up)

#### 4. Tracking Metrics

1. Click "Metrics" tab
2. See overview:
   - Total reached
   - Reply rate
   - Conversion rate
3. See breakdown by profile type:
   - Hustlers: X% reply rate
   - Supervisors: X% reply rate
4. See top signals (which correlate with replies)

---

### For NLR (Admin)

#### 1. Monitoring Worker Health

```bash
# Check worker status
curl https://scopelock-outreach-backend.onrender.com/api/outreach/worker-health

# Expected output:
{
  "status": "running",
  "last_check": "2025-11-07T14:00:00Z",
  "uptime_seconds": 21600,
  "monitored_contacts": 127
}
```

If status != "running" → Worker down, needs restart or reconnection

#### 2. Reviewing Metrics

1. Open Metrics tab
2. Answer questions:
   - Which profile type gets better response? (hustler vs supervisor)
   - Which signals correlate with replies? (voice_ai, code_review, etc.)
   - What's our overall conversion rate? (replied → interested → converted)

3. Optimize based on data:
   - If hustlers get 2x better response → prioritize reaching hustlers first
   - If voice_ai signal gets 3x better response → reference it more in messages

#### 3. Manual Intervention (Edge Cases)

**If worker misses a reply:**
1. Contact profile → "Add Manual Reply"
2. Paste reply text from Telegram
3. Submit → Creates reply event

**If contact status wrong:**
```bash
# Update status manually (via backend shell)
python3 -c "
from services.outreach.outreach_tracker import OutreachTracker
tracker = OutreachTracker()
tracker._update_status('contact-12345', 'interested')
"
```

---

## Next Steps

After successful deployment:

**Week 1:** Test outreach flow
- Send to 20 contacts (mix of supervisors + hustlers)
- Monitor reply rate
- Fix any bugs

**Week 2:** Scale outreach
- Send to 50+ contacts
- Track which profile types / signals perform best
- Refine Maya prompts based on feedback

**Week 3:** Full rollout
- Reach all 313 contacts
- Follow up with interested contacts (schedule calls)
- Convert interested → team members

**Goal:** 5+ new team members within 60 days

---

## Related Documentation

- `/docs/missions/team-member-hunting/PATTERN.md` - Core principles
- `/docs/missions/team-member-hunting/AC.md` - Acceptance criteria
- `/docs/missions/team-member-hunting/VALIDATION.md` - Test specifications
- `/docs/missions/team-member-hunting/MECHANISM.md` - Architecture details
- `/docs/missions/team-member-hunting/ALGORITHM.md` - Implementation steps

---

**Sign-Off:**

Inna — ScopeLock
GUIDE complete. Setup documented. Deployment steps ready. Troubleshooting covered.
Ready for DOD.md (Definition of Done checklist).
