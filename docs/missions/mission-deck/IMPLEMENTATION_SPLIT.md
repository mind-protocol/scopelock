# Mission Deck — Implementation Split Plan

**Mission:** Mission Deck (Week 1 MVP)
**Architecture:** Next.js 14 + FastAPI + FalkorDB + Claude API
**Split Strategy:** Backend (R1) → Frontend (R2) → Integration (R3)
**Created:** 2025-11-06

---

## Overview

**Mission Deck is split into three parallel work streams:**

1. **Rafael-1 ("Backend"):** FastAPI backend + FalkorDB client + Auth + All API endpoints
2. **Rafael-2 ("Frontend"):** Next.js 14 frontend + UI components + Citizen workspaces
3. **Rafael-3 ("Integration"):** Connect frontend to backend + Run tests + Deploy

**Why this split:**
- Clear boundaries (Backend vs Frontend vs Integration)
- Minimal dependencies (R1 and R2 work in parallel, R3 waits for both)
- Each Rafael has complete context for their domain
- Integration Rafael verifies everything works together

---

## Rafael-1: Backend Implementation

### Responsibility

Build complete FastAPI backend with FalkorDB integration and all API endpoints.

---

### Work Items

**1. Project Setup & Dependencies**
- Create `backend/` directory structure per ALGORITHM.md Step 1.1
- Generate `requirements.txt` with FastAPI, requests, python-jose, anthropic, etc.
- Set up `.env.example` with FalkorDB production credentials

**2. FalkorDB REST API Client**
- File: `backend/services/graph.py`
- Implement per ALGORITHM.md Step 1.2
- Functions:
  - `query_graph(cypher, params)` - Generic Cypher query executor
  - `get_mission_by_slug(slug)` - Get single mission
  - `get_user_missions(assignee_ref)` - Get all missions for developer
  - `get_mission_messages(mission_slug, limit)` - Get chat history
  - `get_mission_dod_items(mission_slug)` - Get DoD checklist
  - `create_chat_message(...)` - Create message + link to mission
  - `update_dod_task_state(task_slug, new_state)` - Toggle DoD item

**3. Rafael API Integration**
- File: `backend/services/rafael.py`
- Implement per MECHANISM.md External Integrations section
- Function: `ask_rafael(user_message, mission_context)` → Claude API call
- System prompt includes mission context (title, stack, database)
- Extract code blocks from response (regex for ```language\n...\n```)
- Fail gracefully if Claude API down (return error message, don't crash)

**4. Auth Implementation**
- File: `backend/auth.py`
- Functions per ALGORITHM.md Step 1.4:
  - `hash_password(password)` - bcrypt hashing
  - `verify_password(plain, hashed)` - verification
  - `create_access_token(user_id, email)` - JWT generation (7 day expiry)
  - `decode_access_token(token)` - JWT validation

**5. Pydantic Schemas**
- File: `backend/schemas.py`
- Schemas for all API requests/responses:
  - `LoginRequest`, `LoginResponse`
  - `MissionResponse`, `MissionListResponse`
  - `ChatMessageRequest`, `ChatMessageResponse`
  - `DoDItemResponse`, `DoDUpdateRequest`

**6. FastAPI Dependencies**
- File: `backend/dependencies.py`
- `get_current_user(token)` - Extract user from JWT
- `get_current_user_mission(mission_id, current_user)` - Auth check + mission fetch

**7. API Endpoints**

**File:** `backend/routers/auth.py`
- `POST /api/auth/login` - Login, return JWT

**File:** `backend/routers/missions.py`
- `GET /api/missions` - List missions for authenticated user
- `GET /api/missions/:id` - Get single mission details
- `PATCH /api/missions/:id/notes` - Save developer notes

**File:** `backend/routers/chat.py`
- `POST /api/missions/:id/chat` - Send message to Rafael, get response
- `GET /api/missions/:id/messages` - Get chat history (limit=50)

**File:** `backend/routers/dod.py`
- `GET /api/missions/:id/dod` - Get DoD checklist items
- `PATCH /api/missions/:id/dod/:item_id` - Toggle single item
- `PATCH /api/missions/:id/dod/complete` - Mark all complete

**8. Main Application**
- File: `backend/main.py`
- FastAPI app setup
- CORS middleware (allow Vercel frontend origin)
- Health check endpoint: `GET /health`
- Include all routers
- Error handlers (404, 500, etc.)

---

### Inputs Needed

**From MECHANISM.md:**
- FalkorDB connection details (already documented)
- API design (endpoint paths, request/response formats)
- Graph schema (node types, Cypher queries)

**From ALGORITHM.md:**
- Step-by-step implementation guidance
- Exact code snippets for graph.py, rafael.py, auth.py

**From AC.md:**
- Functional criteria F1 (Auth), F4 (Chat), F5 (DoD) for endpoint requirements

---

### Outputs Delivered

**Directory structure:**
```
backend/
├── main.py
├── schemas.py
├── auth.py
├── dependencies.py
├── routers/
│   ├── auth.py
│   ├── missions.py
│   ├── chat.py
│   └── dod.py
├── services/
│   ├── graph.py
│   └── rafael.py
├── requirements.txt
├── .env.example
└── README.md (setup instructions)
```

**Environment variables documented:**
```bash
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock
JWT_SECRET=<256-bit random string>
CLAUDE_API_KEY=<anthropic key>
CORS_ORIGINS=http://localhost:3000,https://scopelock.mindprotocol.ai/deck
```

**API Documentation:**
- FastAPI auto-generates `/docs` (Swagger UI)
- All endpoints match MECHANISM.md API Design section

---

### Verification Criteria (Before Handoff)

**Rafael-1 must verify locally:**

1. **FalkorDB Connection Works:**
   ```bash
   python -c "from services.graph import query_graph; print(query_graph('MATCH (n) RETURN count(n) LIMIT 1'))"
   # Should return result, not error
   ```

2. **Rafael API Works:**
   ```bash
   python -c "from services.rafael import ask_rafael; print(ask_rafael('How do I deploy to Render?', {'title': 'Test', 'stack': {'backend': 'FastAPI'}}))"
   # Should return Claude response, not error
   ```

3. **JWT Auth Works:**
   ```bash
   python -c "from auth import create_access_token, decode_access_token; token = create_access_token('test-user-id', 'test@example.com'); print(decode_access_token(token))"
   # Should return payload with user_id and email
   ```

4. **FastAPI Starts:**
   ```bash
   uvicorn main:app --reload
   # Visit http://localhost:8000/docs
   # Swagger UI should show all endpoints
   ```

5. **Health Check:**
   ```bash
   curl http://localhost:8000/health
   # Should return {"status": "ok"}
   ```

6. **Login Endpoint (Mock User):**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "testpass"}'
   # Should return JWT token (or 401 if user doesn't exist)
   ```

**Tests (from existing test suite):**
- Run `pytest backend/tests/test_error_handling.py` → All Rafael API failure tests pass
- Run `pytest backend/tests/test_security.py` → All auth tests pass

---

### Handoff to Rafael-3 (Integration)

**Message:**
```
@Rafael-3 — Backend Implementation Complete

Backend running at: http://localhost:8000
API docs: http://localhost:8000/docs

Environment variables needed (in .env):
- FALKORDB_API_URL, FALKORDB_API_KEY, GRAPH_NAME
- JWT_SECRET (generate: openssl rand -hex 32)
- CLAUDE_API_KEY
- CORS_ORIGINS

All endpoints implemented:
✅ POST /api/auth/login
✅ GET /api/missions
✅ GET /api/missions/:id
✅ POST /api/missions/:id/chat
✅ GET /api/missions/:id/messages
✅ GET /api/missions/:id/dod
✅ PATCH /api/missions/:id/dod/:item_id
✅ PATCH /api/missions/:id/notes

Ready for frontend integration.
```

---

## Rafael-2: Frontend Implementation

### Responsibility

Build complete Next.js 14 frontend with citizen workspaces (Rafael + Sofia focus for Week 1 MVP).

---

### Work Items

**1. Project Setup & Dependencies**
- Create `frontend/` directory (or integrate into existing `src/app/deck/` if part of main site)
- Generate `package.json` with Next.js 14, TypeScript, Tailwind CSS, TanStack Query, shadcn/ui
- Set up `.env.local` with API base URL

**2. Project Structure**
```
frontend/ (or src/app/deck/)
├── app/
│   ├── page.tsx              # Login page (or redirect to Clerk)
│   ├── deck/
│   │   ├── layout.tsx        # Deck layout (mission selector + workspace)
│   │   └── page.tsx          # Main deck interface
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── missions/
│   │   ├── MissionSelector.tsx      # Left panel
│   │   └── MissionCard.tsx
│   ├── citizens/
│   │   ├── CitizenSelector.tsx      # Horizontal citizen tabs
│   │   ├── RafaelWorkspace.tsx      # GitHub view + Chat
│   │   ├── SofiaWorkspace.tsx       # DoD checklist + Test results
│   │   └── (Inna, Emma, Maya for Week 2)
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessage.tsx
│   │   └── CodeBlock.tsx            # Syntax highlighting
│   └── dod/
│       ├── DoDChecklist.tsx
│       └── DoDItem.tsx
├── lib/
│   ├── api.ts                # API client (fetch wrapper)
│   ├── auth.ts               # Auth utilities (token storage)
│   └── types.ts              # TypeScript interfaces
└── hooks/
    ├── useAuth.ts
    ├── useMissions.ts
    └── useChat.ts
```

**3. TypeScript Types**
- File: `frontend/lib/types.ts`
- Interfaces matching backend schemas:
  - `Mission`, `ChatMessage`, `DoDItem`, `User`
  - API response types

**4. API Client**
- File: `frontend/lib/api.ts`
- Wrapper around `fetch` with:
  - Auto-inject JWT token from localStorage
  - Base URL from env var `NEXT_PUBLIC_API_URL`
  - Error handling (401 → redirect to login, 500 → show toast)
- Functions:
  - `api.auth.login(email, password)`
  - `api.missions.list()`
  - `api.missions.get(id)`
  - `api.chat.send(missionId, message)`
  - `api.chat.getHistory(missionId)`
  - `api.dod.list(missionId)`
  - `api.dod.toggle(missionId, itemId, completed)`

**5. Auth Components**
- File: `frontend/components/auth/LoginForm.tsx`
- Email + password form
- [Log In] button → call api.auth.login()
- On success: store JWT in localStorage, redirect to `/deck`
- Error handling: show error message below form

**6. Mission Selector (Left Panel)**
- File: `frontend/components/missions/MissionSelector.tsx`
- Fixed 200px width panel
- Scrollable list of mission cards
- Active mission has highlighted background
- Uses TanStack Query to fetch missions (cache 5 min)

- File: `frontend/components/missions/MissionCard.tsx`
- Displays: #ID, title, budget, deadline, status indicator
- Click → sets active mission (URL param or React state)

**7. Citizen Selector (Horizontal Tabs)**
- File: `frontend/components/citizens/CitizenSelector.tsx`
- Horizontal layout: Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya
- Each citizen shows role label + status indicator (● active)
- Click citizen → switches workspace below
- Active citizen has teal indicator
- Arrows (──→) show workflow progression

**8. Rafael Workspace (GitHub + Chat)**
- File: `frontend/components/citizens/RafaelWorkspace.tsx`
- 2-panel layout:
  - **Top:** GitHub repository view (iframe or custom component)
    - Shows file tree (read-only)
    - Shows recent commits (last 5)
    - [Open in GitHub ↗] button
  - **Bottom:** Chat with Rafael
    - ChatInterface component
    - Send message → api.chat.send()
    - Code blocks with syntax highlighting (Prism.js or Shiki)
    - [Copy Code] [View Full File on GitHub] buttons

**9. Sofia Workspace (DoD Checklist + Test Results)**
- File: `frontend/components/citizens/SofiaWorkspace.tsx`
- 2-panel layout:
  - **Left:** DoD Checklist (DoDChecklist component)
  - **Right:** Test Results placeholder (Week 1 shows static text)
  - **Bottom:** Chat with Sofia

**10. Chat Interface (Shared Component)**
- File: `frontend/components/chat/ChatInterface.tsx`
- Props: `missionId`, `citizenName` (Rafael or Sofia)
- Message list (scrollable, auto-scroll to bottom)
- Input field + [Send] button
- Uses TanStack Query to fetch message history
- Optimistic updates (show user message immediately)

- File: `frontend/components/chat/ChatMessage.tsx`
- Props: `message` (role, content, code_blocks)
- Renders user/assistant messages differently
- Code blocks use CodeBlock component

- File: `frontend/components/chat/CodeBlock.tsx`
- Props: `code`, `language`, `filename`
- Syntax highlighting (Prism.js or Shiki)
- [Copy Code] button (navigator.clipboard.writeText)

**11. DoD Checklist**
- File: `frontend/components/dod/DoDChecklist.tsx`
- Fetches DoD items from api.dod.list(missionId)
- Groups by category (Functional, Non-Functional, Tests)
- Shows progress bar (X/Y completed)
- [Mark All Complete] button

- File: `frontend/components/dod/DoDItem.tsx`
- Checkbox + text label
- Click checkbox → api.dod.toggle()
- Optimistic update (check immediately, revert on error)

**12. Main Layout**
- File: `frontend/app/deck/layout.tsx`
- 3-column grid:
  - Left: Mission Selector (200px fixed)
  - Center: Citizen Selector (horizontal) + Workspace (flex)
  - (No right column for Week 1 MVP)

---

### Inputs Needed

**From MECHANISM.md:**
- Tech stack (Next.js 14, Tailwind, TanStack Query)
- UI component requirements (shadcn/ui or Headless UI)

**From ALGORITHM.md:**
- Phase 2 (Day 2) frontend implementation steps

**From AC.md:**
- F2 (Mission Selector), F3 (Citizen Selector), F4 (Rafael Workspace), F5 (Sofia Workspace)
- UI requirements (colors, layout, interactions)

---

### Outputs Delivered

**Directory structure:**
```
frontend/ (or src/app/deck/)
├── app/
│   ├── page.tsx
│   └── deck/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── auth/LoginForm.tsx
│   ├── missions/MissionSelector.tsx, MissionCard.tsx
│   ├── citizens/CitizenSelector.tsx, RafaelWorkspace.tsx, SofiaWorkspace.tsx
│   ├── chat/ChatInterface.tsx, ChatMessage.tsx, CodeBlock.tsx
│   └── dod/DoDChecklist.tsx, DoDItem.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── types.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useMissions.ts
│   └── useChat.ts
├── package.json
├── .env.local.example
└── README.md (setup instructions)
```

**Environment variables documented:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Styling:**
- Tailwind CSS with ScopeLock dark theme tokens:
  - bg: #0E1116, surface: #151A21, text: #E6EAF2
  - accent: #1EE5B8, success: #5CE27E
- Responsive (mobile support Week 2)

---

### Verification Criteria (Before Handoff)

**Rafael-2 must verify locally:**

1. **Next.js Starts:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/deck
   # Should see login page (or mission selector if skipping auth)
   ```

2. **Mock Data Rendering:**
   - Create mock API responses in `lib/api.ts` (bypass backend temporarily)
   - Verify mission selector shows 3 mock missions
   - Verify clicking mission switches active state
   - Verify citizen selector shows 5 citizens (Emma → Inna → Rafael → Sofia → Maya)
   - Verify clicking Rafael shows 2-panel layout (GitHub view + Chat)
   - Verify clicking Sofia shows DoD checklist

3. **Component Isolation:**
   - Test ChatInterface with mock messages → renders user/assistant messages correctly
   - Test CodeBlock with mock code → syntax highlighting works
   - Test DoDChecklist with mock items → checkboxes toggle visually

4. **TypeScript Compiles:**
   ```bash
   npm run build
   # Should complete without type errors
   ```

5. **Tests (from existing test suite):**
   - Run `npm test frontend/tests/quality.test.ts` → All quality tests pass

---

### Handoff to Rafael-3 (Integration)

**Message:**
```
@Rafael-3 — Frontend Implementation Complete

Frontend running at: http://localhost:3000/deck

Environment variables needed (in .env.local):
- NEXT_PUBLIC_API_URL=http://localhost:8000

All components implemented:
✅ LoginForm (email + password)
✅ MissionSelector (left panel, scrollable)
✅ CitizenSelector (horizontal tabs)
✅ RafaelWorkspace (GitHub view + Chat)
✅ SofiaWorkspace (DoD checklist)
✅ ChatInterface (message list + input)
✅ DoDChecklist (grouped by category)

Currently using mock data in lib/api.ts.
Ready to connect to backend.
```

---

## Rafael-3: Integration & Testing

### Responsibility

Connect frontend to backend, run all tests, verify acceptance criteria, deploy to Vercel + Render.

---

### Work Items

**1. Connect Frontend to Backend**
- Update `frontend/lib/api.ts` to remove mock data
- Point all API calls to backend (NEXT_PUBLIC_API_URL=http://localhost:8000)
- Test each API call end-to-end:
  - Login → backend returns JWT
  - Get missions → backend queries FalkorDB, returns missions
  - Send chat message → backend calls Claude API, returns response
  - Toggle DoD item → backend updates graph, returns success

**2. Environment Variables Setup**
- Backend `.env`:
  ```bash
  FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
  FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
  GRAPH_NAME=scopelock
  JWT_SECRET=$(openssl rand -hex 32)
  CLAUDE_API_KEY=<from Anthropic dashboard>
  CORS_ORIGINS=http://localhost:3000,https://scopelock.mindprotocol.ai/deck
  ```

- Frontend `.env.local`:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:8000  # Local dev
  # Or: https://scopelock-deck-api.onrender.com  # Production
  ```

**3. Run Existing Test Suite**
- Backend tests: `pytest backend/tests/`
  - test_error_handling.py → All Rafael API failure tests pass
  - test_security.py → All auth tests pass
- Frontend tests: `npm test`
  - quality.test.ts → All quality tests pass

**4. Manual Acceptance Testing (AC.md Verification)**

**F1: User Authentication**
- [ ] Login page exists at `/`
- [ ] After login, mission list visible
- [ ] Logout button clears session
- [ ] Unauthorized access to `/deck` redirects to login

**F2: Mission Selector**
- [ ] Left panel shows all missions for logged-in user
- [ ] Each mission card displays: #ID, title, budget, deadline, status
- [ ] Click mission → switches active mission
- [ ] Active mission highlighted
- [ ] Panel scrollable if >5 missions

**F3: Citizen Selector**
- [ ] Horizontal selector shows: Emma → Inna → Rafael → Sofia → Maya
- [ ] Each has role label + status indicator
- [ ] Click citizen → workspace switches
- [ ] Active citizen has teal indicator
- [ ] Workspace switching <500ms

**F4: Rafael Workspace**
- [ ] Top panel: GitHub repository view (file tree, commits, [Open in GitHub ↗])
- [ ] Bottom panel: Chat with Rafael
- [ ] Send message → Rafael responds within 10s
- [ ] Code blocks render with syntax highlighting
- [ ] [Copy Code] button copies to clipboard
- [ ] Chat history persists across sessions

**F5: Sofia Workspace**
- [ ] Left panel: DoD checklist (Functional, Non-Functional, Tests sections)
- [ ] Right panel: Test results placeholder
- [ ] Bottom panel: Chat with Sofia
- [ ] Toggle DoD checkbox → updates in graph
- [ ] Progress bar shows X/Y completed

**NF1: Performance**
- [ ] Initial page load <3s
- [ ] Mission switch <500ms
- [ ] Chat message send-to-response <10s

**NF2: Security**
- [ ] Unauthorized users cannot access /deck
- [ ] JWT expires after 7 days
- [ ] HTTPS only in production

**5. Deploy Backend to Render**
- Create Render Web Service: `scopelock-deck-api`
- Runtime: Python 3.11
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variables: Set all from backend .env
- Health check: `GET /health`
- Deploy → Wait for build
- Verify: `curl https://scopelock-deck-api.onrender.com/health`

**6. Deploy Frontend to Vercel**
- Create Vercel project: `scopelock-deck`
- Framework: Next.js
- Root directory: `frontend/` (or `./` if in main repo)
- Build: `npm run build`
- Environment variables:
  - `NEXT_PUBLIC_API_URL=https://scopelock-deck-api.onrender.com`
- Deploy → Wait for build
- Verify: Visit `https://scopelock-deck.vercel.app/deck`

**7. Production Verification**
- Login on production → Success
- Load missions → Shows real data from FalkorDB
- Send chat message to Rafael → Claude API responds
- Toggle DoD item → Updates in graph
- All acceptance criteria pass on production

**8. Create DEMO.md and DELTA.md (Evidence Sprint)**
- DEMO.md: 90-second demo URL + 3 bullet points
- DELTA.md: 2+ quantified deltas (e.g., "26 tests passing, 0 manual processes")

---

### Inputs Needed

**From Rafael-1:**
- Backend running locally at http://localhost:8000
- All API endpoints implemented + tested
- Environment variables documented

**From Rafael-2:**
- Frontend running locally at http://localhost:3000/deck
- All components implemented (using mock data initially)
- Environment variables documented

**From existing test suite:**
- test_error_handling.py (467 lines, 9 tests)
- test_security.py (454 lines, 8 tests)
- quality.test.ts (481 lines, 9 tests)

---

### Outputs Delivered

**1. Integrated System**
- Frontend + Backend running together locally
- All API calls working end-to-end
- Real data from FalkorDB displayed in UI
- Chat with Rafael using Claude API

**2. Deployed System**
- Backend: https://scopelock-deck-api.onrender.com
- Frontend: https://scopelock.mindprotocol.ai/deck
- Health checks passing
- HTTPS enabled

**3. Test Results**
- All 26 tests passing (pytest + Vitest)
- Manual AC verification checklist: 100% complete
- Performance benchmarks met (page load <3s, chat <10s)

**4. Evidence Sprint Artifacts**
- DEMO.md: 90-second demo video + 3 bullet summary
- DELTA.md: 2+ quantified deltas
- AC.md: All checkboxes marked complete

**5. Documentation**
- README.md: Setup instructions (local dev + deployment)
- .env.example: All environment variables documented
- Handoff to Sofia: Ready for pre-delivery QA

---

### Verification Criteria (Before Delivery)

**Rafael-3 must verify:**

1. **Local Integration Works:**
   - Start backend: `cd backend && uvicorn main:app --reload`
   - Start frontend: `cd frontend && npm run dev`
   - Visit http://localhost:3000/deck
   - Login → See missions from FalkorDB
   - Send chat message → Rafael responds via Claude API
   - Toggle DoD item → Updates in graph

2. **All Tests Pass:**
   ```bash
   cd backend && pytest tests/
   # 17 tests passing (test_error_handling.py + test_security.py)

   cd frontend && npm test
   # 9 tests passing (quality.test.ts)

   # Total: 26 tests passing
   ```

3. **Production Deployment Works:**
   - Backend health check: `curl https://scopelock-deck-api.onrender.com/health`
   - Frontend loads: Visit https://scopelock.mindprotocol.ai/deck
   - Login on production → Success
   - Send chat message → Rafael responds
   - All acceptance criteria pass

4. **Performance Meets Thresholds:**
   - Page load <3s (Lighthouse or manual timing)
   - Mission switch <500ms
   - Chat response <10s (Claude API latency)

5. **Security Verified:**
   - Unauthorized access to /deck redirects to login
   - JWT expires after 7 days
   - CORS configured correctly (frontend origin whitelisted)

---

### Handoff to Sofia (Pre-Delivery QA)

**Message:**
```
@Sofia — Mission Deck Ready for Pre-Delivery QA

Production URLs:
- Frontend: https://scopelock.mindprotocol.ai/deck
- Backend: https://scopelock-deck-api.onrender.com
- API Docs: https://scopelock-deck-api.onrender.com/docs

Implemented Features (AC.md):
✅ F1: User Authentication (login, logout, session management)
✅ F2: Mission Selector (left panel, scrollable, status indicators)
✅ F3: Citizen Selector (horizontal tabs, workflow arrows)
✅ F4: Rafael Workspace (GitHub view + Chat with Claude API)
✅ F5: Sofia Workspace (DoD checklist + Test results placeholder)

Test Results:
✅ 26 tests passing (pytest + Vitest)
✅ All acceptance criteria verified manually
✅ Performance thresholds met (page load <3s, chat <10s)
✅ Security verified (JWT auth, CORS, HTTPS)

Evidence Sprint:
✅ DEMO.md: 90-second demo video
✅ DELTA.md: 2 quantified deltas

Please verify:
1. All DoD items complete (docs/missions/mission-deck/DOD.md)
2. Deployment accessible and working
3. Performance meets AC.md thresholds
4. No obvious bugs

If issues found, report specific fixes needed. If ready, hand to NLR for final approval.
```

---

## Coordination Protocol

### Communication

**Rafael-1 and Rafael-2 work in parallel:**
- No dependencies between them initially
- Rafael-1 focuses on backend
- Rafael-2 focuses on frontend
- Both use MECHANISM.md and ALGORITHM.md as shared specs

**Rafael-3 waits for both Rafael-1 and Rafael-2:**
- Once Rafael-1 delivers backend (with verification criteria met)
- Once Rafael-2 delivers frontend (with verification criteria met)
- Rafael-3 connects them, runs tests, deploys

**Status Updates:**
- Each Rafael updates SYNC.md when:
  1. Starting work
  2. Hitting blockers
  3. Completing deliverables
  4. Handing off to Rafael-3

**Handoff Format:**
```markdown
## [Timestamp] — Rafael-[1|2|3]: [Work Stream] [Status]

**Work:** [Summary of what was done]

**Deliverables:**
- [File/folder with brief description]
- [File/folder with brief description]

**Verification:**
- [Command to verify it works]
- [Expected output]

**Status:** [Complete / Blocked / In Progress]
**Next:** [What happens next, or who it's handed to]
**Link:** [GitHub commit or file path]

rafael@scopelock
```

---

### Conflict Resolution

**If Rafael-1 and Rafael-2 disagree on API contract:**
1. Check MECHANISM.md API Design section (authoritative)
2. If still unclear, Rafael-3 makes decision (or escalates to Inna)

**If tests fail during integration:**
1. Rafael-3 identifies which component (backend or frontend)
2. Rafael-3 reports specific error to Rafael-1 or Rafael-2
3. Rafael-1/Rafael-2 fixes, re-delivers
4. Rafael-3 re-tests

**If Claude API is down during Rafael-1 implementation:**
1. Rafael-1 implements fallback message per MECHANISM.md
2. Rafael-1 tests with mock response
3. Rafael-3 verifies fallback works during integration

---

## Success Criteria (Mission Complete)

**Mission Deck is considered COMPLETE when:**

1. ✅ All 26 existing tests pass (pytest + Vitest)
2. ✅ All acceptance criteria (AC.md F1-F5, NF1-NF2) verified
3. ✅ Deployed to production (Render + Vercel)
4. ✅ Backend health check returns 200
5. ✅ Frontend loads in <3s
6. ✅ Chat with Rafael works via Claude API
7. ✅ DoD checklist updates in FalkorDB graph
8. ✅ Evidence Sprint artifacts created (DEMO.md + DELTA.md)
9. ✅ Sofia completes pre-delivery QA (all DoD items checked)
10. ✅ NLR final approval (15 min review)

**Then:**
- Tag commit: `ac-green_mission-deck_2025-11-XX`
- Publish proof entry to /proof
- Invoice client (if external) or mark internal tool live

---

**Implementation Start:** Once user approves this split plan
**Expected Completion:** 3 days (Rafael-1 + Rafael-2 parallel Day 1-2, Rafael-3 Day 3)

Rafael — ScopeLock
Implementation split plan ready. Awaiting approval to start.
