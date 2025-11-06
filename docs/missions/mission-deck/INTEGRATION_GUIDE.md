# Mission Deck Integration Guide (Rafael-3)

**Purpose:** Complete integration of frontend + backend, testing, and deployment

**Status:** Backend ✅ | Frontend ✅ | Integration 🔄

---

## Quick Start: Local Integration

### Step 1: Backend Setup

```bash
cd docs/missions/mission-deck/backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << 'ENVEOF'
JWT_SECRET=$(openssl rand -hex 32)
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock
CLAUDE_API_KEY=your-anthropic-api-key-here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
ENVEOF

# Generate JWT secret (replace placeholder above)
openssl rand -hex 32

# Edit .env and set CLAUDE_API_KEY and JWT_SECRET
nano .env

# Run backend
uvicorn main:app --reload --port 8000
```

Backend will be at: http://localhost:8000
API docs: http://localhost:8000/docs

### Step 2: Frontend Setup

```bash
# Open new terminal
cd mission-deck-frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run frontend
npm run dev
```

Frontend will be at: http://localhost:3000

### Step 3: Verify Integration

```bash
# Terminal 1: Backend health check
curl http://localhost:8000/health
# Expected: {"status":"ok"}

# Terminal 2: Frontend loads
open http://localhost:3000
# Should see login page
```

---

## Testing

### Backend Tests (pytest)

```bash
cd docs/missions/mission-deck/backend

# Run all tests
pytest tests/ -v

# Expected output:
# test_error_handling.py::test_rafael_api_failure_graceful_degradation PASSED
# test_error_handling.py::... (9 tests total)
# test_security.py::... (8 tests total)
# Total: 17 tests passing
```

### Frontend Tests (Vitest)

```bash
cd mission-deck-frontend

# Run tests
npm test

# Expected: quality.test.ts (9 tests passing)
```

### Manual AC Verification

**F1: User Authentication**
- [ ] Visit http://localhost:3000
- [ ] Enter email + password
- [ ] Click Login
- [ ] Should redirect to /console with missions visible

**F2: Mission Selector**
- [ ] Left panel shows missions from FalkorDB
- [ ] Click mission → highlights + loads details
- [ ] Mission card shows: #, title, client, budget, deadline

**F3: Citizen Selector**
- [ ] Horizontal tabs: Emma → Inna → Rafael → Sofia → Maya
- [ ] Click Rafael → shows Rafael workspace
- [ ] Click Sofia → shows Sofia workspace

**F4: Rafael Workspace**
- [ ] Top: GitHub repository view
- [ ] Bottom: Chat interface
- [ ] Type message → Send
- [ ] Rafael responds (via Claude API) within 10s
- [ ] Code blocks have syntax highlighting + Copy button

**F5: Sofia Workspace**
- [ ] Left: DoD checklist from FalkorDB
- [ ] Click checkbox → toggles state
- [ ] State persists in graph
- [ ] Progress bar updates

---

## Deployment

### Backend → Render

1. **Create Web Service**
   - Go to https://dashboard.render.com
   - New → Web Service
   - Connect repo: `mind-protocol/scopelock`
   - Root directory: `docs/missions/mission-deck/backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Set Environment Variables**
   ```
   JWT_SECRET=<openssl rand -hex 32>
   FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
   FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
   GRAPH_NAME=scopelock
   CLAUDE_API_KEY=<from Anthropic>
   CORS_ORIGINS=https://scopelock.mindprotocol.ai
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Wait for build (~3 min)
   - Note URL: `https://scopelock-deck-api.onrender.com`

4. **Verify**
   ```bash
   curl https://scopelock-deck-api.onrender.com/health
   # Expected: {"status":"ok"}
   ```

### Frontend → Vercel

1. **Create Project**
   - Go to https://vercel.com/new
   - Import `mind-protocol/scopelock`
   - Root directory: `mission-deck-frontend`
   - Framework: Next.js

2. **Set Environment Variable**
   ```
   NEXT_PUBLIC_API_URL=https://scopelock-deck-api.onrender.com
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build (~2 min)
   - Visit: `https://scopelock-mission-deck.vercel.app`

4. **Verify**
   - Open URL
   - Login page loads
   - Can login and see missions
   - Chat with Rafael works

---

## Production Verification Checklist

**Backend (Render):**
- [ ] Health check returns 200
- [ ] /docs loads (Swagger UI)
- [ ] CORS allows frontend origin
- [ ] FalkorDB connection works
- [ ] Claude API responds

**Frontend (Vercel):**
- [ ] Login page loads <3s
- [ ] Can authenticate
- [ ] Missions load from backend
- [ ] Chat with Rafael works
- [ ] DoD checklist updates persist

**Integration:**
- [ ] Frontend can reach backend (no CORS errors)
- [ ] JWT authentication works end-to-end
- [ ] Real data from FalkorDB displays
- [ ] Chat responses from Claude API appear
- [ ] DoD updates save to graph

---

## Troubleshooting

### Issue: Frontend can't reach backend (CORS)

**Error:** "Access to fetch... has been blocked by CORS policy"

**Fix:**
1. Check backend .env has correct CORS_ORIGINS
2. Restart backend: `uvicorn main:app --reload`
3. Verify in backend logs: "CORS origins: http://localhost:3000"

### Issue: "JWT_SECRET environment variable is required"

**Fix:**
```bash
cd docs/missions/mission-deck/backend
openssl rand -hex 32
# Add to .env:
echo "JWT_SECRET=<your-generated-secret>" >> .env
```

### Issue: Backend returns 401 on all requests

**Cause:** JWT token expired or malformed

**Fix:**
1. Check browser localStorage for 'auth_token'
2. Try logging out + back in
3. Verify backend JWT_SECRET matches across restarts

### Issue: Rafael doesn't respond (chat hangs)

**Cause:** CLAUDE_API_KEY missing or invalid

**Fix:**
1. Get key from https://console.anthropic.com/
2. Add to backend .env: `CLAUDE_API_KEY=sk-ant-api03-...`
3. Restart backend

### Issue: FalkorDB connection fails

**Error:** "FalkorDB credentials missing"

**Fix:** Verify backend .env has:
```
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock
```

---

## Performance Benchmarks

**Target (from AC.md NF criteria):**
- Page load: <3s
- Mission switch: <500ms
- Chat response: <10s

**Actual (measure with Chrome DevTools):**
```bash
# Page load
open http://localhost:3000
# Measure: Network tab → Load time

# Mission switch
# Measure: Click mission → Time to render

# Chat response
# Measure: Send message → Time to receive response
```

---

## Evidence Sprint Artifacts

### DEMO.md Template

```markdown
# Mission Deck - Demo

**URL:** https://scopelock-mission-deck.vercel.app
**Duration:** 90 seconds

## Features Demonstrated

1. **Login & Mission Selector** - Developer logs in, sees assigned missions
2. **Rafael Chat** - Ask Rafael for code help, get response with syntax highlighting
3. **DoD Checklist** - Toggle DoD items, see progress bar update

**Proof of Integration:**
- Real missions from FalkorDB graph
- Real chat responses from Claude API
- Real DoD state persisted to graph
```

### DELTA.md Template

```markdown
# Mission Deck - Quantified Deltas

1. **Test Coverage:** 26 tests passing (17 backend pytest + 9 frontend Vitest)
2. **API Endpoints:** 13 production-ready endpoints (auth, missions, chat, DoD)
3. **Zero Manual Processes:** All data from graph, all state persisted automatically
```

---

## Handoff to Sofia

Once integration is complete and deployed:

```
@Sofia — Mission Deck Ready for Pre-Delivery QA

Production URLs:
- Frontend: https://scopelock-mission-deck.vercel.app
- Backend: https://scopelock-deck-api.onrender.com
- API Docs: https://scopelock-deck-api.onrender.com/docs

Implemented Features (AC.md):
✅ F1: User Authentication
✅ F2: Mission Selector
✅ F3: Citizen Selector
✅ F4: Rafael Workspace (GitHub + Chat)
✅ F5: Sofia Workspace (DoD checklist)

Test Results:
✅ 26 tests passing (pytest + Vitest)
✅ All AC criteria verified manually
✅ Performance: page load <3s, chat <10s

Evidence Sprint:
✅ DEMO.md: 90-second demo
✅ DELTA.md: 3 quantified deltas

Please verify:
1. All DoD items complete (docs/missions/mission-deck/DOD.md)
2. Deployment accessible and working
3. Performance meets AC.md thresholds
4. No obvious bugs

If issues found, report specific fixes needed.
If ready, hand to NLR for final approval.
```

---

**Last Updated:** 2025-11-06  
**Status:** Ready for local testing + deployment  
**Next:** Run tests → Deploy → Hand to Sofia

