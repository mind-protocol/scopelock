# Acceptance Criteria: ScopeLock Mission Deck

**Mission:** Internal developer dashboard for mission execution with AI citizen guidance
**Version:** 1.0 (Week 1 MVP)
**Created:** 2025-11-05

---

## Functional Criteria

### F1: User Authentication

**User Story:**
As a ScopeLock developer, I want to log in securely, so that only team members can access missions.

**Given:** I am on the console home page (unauthenticated)
**When:** I click [Log In] and complete auth flow
**Then:** I am redirected to the console with mission list visible

**Acceptance:**
- [ ] Login page exists at `/` (or redirects to Clerk)
- [ ] Auth flow completes in ≤3 clicks
- [ ] After login, user sees their assigned missions
- [ ] Logout button works (clears session)
- [ ] Unauthorized users cannot access `/deck` routes

---

### F2: Mission Selector (Left Panel)

**User Story:**
As a developer, I want to see all my assigned missions, so I can switch between them quickly.

**Given:** I am logged in
**When:** I view the left panel
**Then:** I see a scrollable list of missions with key details

**Acceptance:**
- [ ] Left panel shows all missions for logged-in user
- [ ] Each mission card displays:
  - Mission number (e.g., "#47")
  - Title (e.g., "Telegram Notifier")
  - Budget (e.g., "$300")
  - Deadline (e.g., "Nov 8")
  - Status indicator (● green = active, ○ gray = not started, ✓ = in QA)
- [ ] Click mission card → switch to that mission (all tabs reload)
- [ ] Active mission has highlighted background (#151A21)
- [ ] Hover shows subtle highlight (#1A2028)
- [ ] Panel is fixed width (200px)
- [ ] Scrollable if >5 missions

---

### F3: Citizen Workspace Selector

**User Story:**
As a developer, I want to switch between different citizen workspaces, so I can use specialized tools for each role.

**Given:** I am on a mission
**When:** I click a citizen in the horizontal selector
**Then:** The right panel changes to show that citizen's specialized workspace

**Acceptance:**
- [ ] Horizontal citizen selector at top of right panel shows:
  - Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya
  - Each with role label (Scout, Specifier, Guide, Checker, Bridge)
  - Status indicator (● active, ● complete, ○ waiting)
- [ ] Click any citizen → right panel switches to that workspace
- [ ] Active citizen has teal indicator (●)
- [ ] Workspace switching happens in <500ms
- [ ] Current workspace persists (reload → same workspace shown)
- [ ] Arrow (──→) shows workflow progression visually

---

### F4: Rafael Workspace (Code Generation & Guidance) - WEEK 1 MVP

**User Story:**
As a developer implementing a mission, I want to see what Rafael generated on GitHub and get implementation guidance via chat, so I can review, pull, and deploy Rafael's code.

**Given:** I have selected Rafael in the citizen selector
**When:** I view Rafael's workspace
**Then:** I see a 2-panel layout: GitHub repository view (top), chat with Rafael (bottom)

**Acceptance - Layout:**
- [ ] Top panel: GitHub repository view
  - Shows file tree (folders and files)
  - Shows recent commits (last 5)
  - File snippets (first few lines of code)
  - [Open in GitHub ↗] button → opens full repo in new tab
- [ ] Bottom panel: Chat with Rafael
  - Chat interface for asking questions
  - Rafael provides code snippets and deployment commands
  - [Copy Code] [View Full File on GitHub] [Ask Follow-up] buttons

**Acceptance - GitHub Repository View:**
- [ ] Shows repository file structure (folders and files)
- [ ] Shows file metadata (last modified time, commit message snippet)
- [ ] Shows recent commits list (last 5)
  - Commit message
  - Author (Rafael)
  - Relative time (e.g., "3h ago")
- [ ] Click file name → shows brief code snippet OR links to GitHub
- [ ] [Open in GitHub ↗] button → opens full repository on GitHub.com in new tab
- [ ] **Read-only view** (no editing in browser)
- [ ] Updates when Rafael pushes new commits

**Acceptance - Chat with Rafael:**
- [ ] Chat input at bottom
- [ ] [Send] button sends message (Enter key also works)
- [ ] Rafael responds within 10 seconds
- [ ] Code blocks render with syntax highlighting
- [ ] [Copy Code] → copies code snippet to clipboard
- [ ] [View Full File on GitHub] → direct link to specific file on GitHub
- [ ] [Ask Follow-up] → prompts for clarifying question
- [ ] Rafael provides git commands (e.g., `git pull origin main`)
- [ ] Rafael provides test commands (e.g., `pytest tests/`)
- [ ] Rafael provides deployment commands (e.g., `git push render main`)
- [ ] Chat history persists across sessions

**Why This Design:**
- Developers code locally in VS Code/PyCharm (NOT in browser)
- Rafael generates complete implementations and commits to GitHub
- GitHub view shows audit trail (what Rafael generated, when)
- Chat provides guidance on how to pull, test, and deploy
- Simpler implementation (no Monaco Editor, xterm.js, or react-file-tree needed)

---

### F5: Sofia Workspace (QA & DoD Verification) - WEEK 1 MVP

**User Story:**
As a developer testing my work, I want to see DoD checklist and test results side-by-side, so I can verify quality before delivery.

**Given:** I have selected Sofia in the citizen selector
**When:** I view Sofia's workspace
**Then:** I see DoD checklist on left, test results on right

**Acceptance - Layout:**
- [ ] Left panel: DoD Checklist (same as before)
  - Functional, Non-Functional, Tests sections
  - Checkboxes, progress bar
  - [Mark All Complete] [Reset] buttons
- [ ] Right panel: Test Results
  - Shows latest test run output
  - Pass/fail indicators (✓/✗)
  - Performance metrics (actual vs threshold)
  - [Re-run Tests] [View Logs] buttons
- [ ] Bottom panel: Chat with Sofia
  - Sofia analyzes test failures
  - Provides fix recommendations

**Acceptance - DoD Checklist:**
- [ ] Shows 3 sections: Functional, Non-Functional, Tests
- [ ] Each section has ≥1 checklist item
- [ ] Click checkbox → toggle completed state
- [ ] Checkbox state persists
- [ ] Progress bar shows X/Y completed (e.g., "3/11 (27%)")
- [ ] [Mark All Complete] → checks all boxes, mission status → "qa"
- [ ] [Reset] → unchecks all boxes
- [ ] Completed items show timestamp

**Acceptance - Test Results:**
- [ ] Shows test output from last run (placeholder Week 1)
- [ ] ✓ = Passed tests shown in green
- [ ] ✗ = Failed tests shown in red
- [ ] Click failed test → shows error details
- [ ] Performance metrics shown (e.g., "Response time: 145ms (threshold: 200ms)")
- [ ] [Re-run Tests] button (placeholder Week 1, manual refresh)
- [ ] [View Logs] → shows full test logs

**Acceptance - Chat with Sofia:**
- [ ] Sofia analyzes test failures when tests fail
- [ ] Provides specific fix recommendations
- [ ] [Ask Rafael to Fix] button → switches to Rafael workspace
- [ ] [Mark as Known Issue] → documents issue without blocking delivery

---

### F6: Emma Workspace (Job Discovery) - WEEK 2

**User Story:**
As a hunter finding new jobs, I want to browse Upwork jobs and draft proposals without leaving Mission Deck.

**Given:** I have selected Emma in the citizen selector
**When:** I view Emma's workspace
**Then:** I see Upwork job feed on left, chat with Emma on right

**Acceptance:**
- [ ] Left panel: Upwork job feed (embedded or scraped)
  - Search bar for filtering
  - Each job shows title, budget, posted time, proposal count
  - [Analyze Job] [Draft Proposal] buttons
- [ ] Right panel: Chat with Emma
  - Emma analyzes job (client type, stack match, budget fit)
  - Shows STRONG GO / QUALIFIED MAYBE / HARD NO verdict
  - Drafts proposal when requested
- [ ] Bottom: Recent proposals list (DRAFT / SENT / WON / DECLINED)

**Note:** Week 2 feature, not in MVP.

---

### F7: Inna Workspace (Documentation Editor) - WEEK 2

**User Story:**
As a specifier writing mission docs, I want to edit markdown specs without switching to external editor.

**Given:** I have selected Inna in the citizen selector
**When:** I view Inna's workspace
**Then:** I see documentation tree on left, markdown editor on right

**Acceptance:**
- [ ] Left panel: Documentation tree
  - Shows 6-level hierarchy (PATTERN → GUIDE → DOD)
  - ✓ = Complete, ○ = Not started
  - Click file → opens in editor
  - [New Document] [Generate DoD from AC] buttons
- [ ] Right panel (Top): Markdown editor (Monaco Editor with markdown mode)
  - Syntax highlighting
  - [Save] [Preview] [Generate DoD] buttons
- [ ] Right panel (Bottom): Chat with Inna
  - Ask questions about specs, request clarifications

**Note:** Week 2 feature, not in MVP.

---

### F8: Maya Workspace (Client Communication) - WEEK 2

**User Story:**
As a client success manager, I want to draft status updates and handle client messages without switching to email.

**Given:** I have selected Maya in the citizen selector
**When:** I view Maya's workspace
**Then:** I see client messages on left, status update draft on right

**Acceptance:**
- [ ] Left panel: Client message threads
  - Shows messages per client
  - Most recent first
  - [Draft Response] button
  - [Templates] dropdown (weekly update, AC green handoff, change request)
- [ ] Right panel: Status update draft
  - Maya auto-generates status update
  - Shows completed work, in-progress, timeline
  - Handles change requests (Swap vs Add)
  - [Edit] [Send Now] [Schedule] buttons
- [ ] Bottom: Chat with Maya
  - Maya drafts client communication
  - [Approve & Send] [Edit Message] buttons

**Note:** Week 2 feature, not in MVP.

---

### F9: Mission Switching

**User Story:**
As a developer, I want to switch missions without losing context, so I can handle multiple missions efficiently.

**Given:** I am viewing Mission #47
**When:** I click Mission #48 in the left panel
**Then:** All workspaces reload with Mission #48 data

**Acceptance:**
- [ ] Click mission in left panel → active mission changes
- [ ] Current citizen workspace reloads with new mission data
- [ ] Rafael workspace: Loads Mission #48 code repository
- [ ] Sofia workspace: Loads Mission #48 DoD checklist
- [ ] URL updates to `/deck/missions/48`
- [ ] Browser back button works (returns to previous mission)
- [ ] Switch completes in <1 second

---

### F10: Responsive Layout

**User Story:**
As a developer, I want Mission Deck to work on desktop and tablet, so I can check progress on any device.

**Given:** I am on Mission Deck
**When:** I view on different screen sizes
**Then:** Layout adapts without breaking

**Acceptance:**
- [ ] Desktop (≥1280px): Left panel + workspace side-by-side
- [ ] Tablet (768px - 1279px): Left panel collapses to drawer (hamburger menu)
- [ ] Mobile (<768px): Stacked layout (Week 2 feature, OPTIONAL Week 1)
- [ ] No horizontal scroll on any screen size
- [ ] Text remains readable on all screens

---

## Non-Functional Criteria

### NF1: Performance

**Response Times:**
- p95 page load time ≤ 2 seconds (desktop, 4G connection)
- p95 Rafael response time ≤ 10 seconds (API call)
- p95 DoD checkbox toggle ≤ 500ms (database update)
- Mission switch ≤ 1 second (includes data fetch)

**Database:**
- Chat message insert ≤ 100ms
- Mission list query ≤ 200ms (even with 100+ missions)

**Assets:**
- CSS bundle ≤ 50KB gzipped
- JS bundle ≤ 300KB gzipped (excluding dependencies)
- First Contentful Paint ≤ 1.2s

---

### NF2: Quality

**Error Rates:**
- ≤1% error rate on Rafael chat API
- ≤0.1% error rate on DoD updates
- Zero data loss on mission switch

**Code Quality:**
- TypeScript strict mode enabled
- Zero TypeScript errors on build
- ESLint passes with zero warnings
- No `any` types (use proper types or `unknown`)

**Accessibility:**
- Keyboard navigation works (Tab, Enter, Escape)
- Focus indicators visible on all interactive elements
- Color contrast ≥4.5:1 (WCAG AA)

---

### NF3: Security

**Authentication:**
- JWT tokens expire after 7 days (if using custom JWT)
- OR Clerk session management (if using Clerk)
- No sensitive data in localStorage (use httpOnly cookies for tokens)

**Authorization:**
- Users can only see their assigned missions
- No admin routes accessible to non-admin users (Week 2 feature)

**Data Validation:**
- All API inputs validated (chat message length ≤10,000 chars)
- SQL injection prevented (use parameterized queries)
- XSS prevented (sanitize user notes, chat messages)

---

### NF4: Deployment

**Hosting:**
- Frontend: Vercel (automatic deploys from `main` branch)
- Backend: Render (Web Service, Python 3.11+)
- Database: Render PostgreSQL (Starter plan or higher)

**Uptime:**
- ≥99% uptime during work hours (9 AM - 6 PM CET)
- Graceful degradation if Rafael API is down (show error, don't crash)

**Rollback:**
- Vercel: Instant rollback via dashboard
- Render: Rollback via git revert + redeploy (≤5 min)

---

### NF5: Monitoring (Week 2, OPTIONAL Week 1)

**Logging:**
- All Rafael chat requests logged (timestamp, user, mission, question)
- All errors logged (Sentry or CloudWatch)

**Metrics:**
- Track: Chat messages sent/day, DoD items completed/day, missions completed/week
- Dashboard: Grafana or Render metrics (Week 2)

---

## Verification

### Test Environment Setup

**Prerequisites:**
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ (or use Render managed DB)
- Vercel account
- Render account
- Clerk account (if using Clerk) OR JWT secret (if using custom auth)

**Environment Variables:**

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # If using Clerk
CLERK_SECRET_KEY=sk_test_...  # If using Clerk
```

**Backend (.env):**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/scopelock_console
JWT_SECRET=your-secret-key-here  # If using custom JWT
CLAUDE_API_KEY=sk-ant-...  # For Rafael simulation
CORS_ORIGINS=http://localhost:3000,https://scopelock.mindprotocol.ai/deck
```

---

### Test Commands

**1. Backend Tests:**
```bash
cd backend
python -m pytest tests/ -v

# Expected output:
# tests/test_missions.py::test_list_missions PASSED
# tests/test_chat.py::test_send_message PASSED
# tests/test_dod.py::test_toggle_checkbox PASSED
# ======================== 15 passed in 2.3s =========================
```

**2. Frontend Tests:**
```bash
cd frontend
npm run test

# Expected output:
# PASS  src/components/MissionSelector.test.tsx
# PASS  src/components/ChatTab.test.tsx
# PASS  src/components/DODTab.test.tsx
#
# Test Suites: 8 passed, 8 total
# Tests:       42 passed, 42 total
```

**3. End-to-End Test (Manual Week 1):**
```bash
# Start backend
cd backend && uvicorn main:app --reload

# Start frontend
cd frontend && npm run dev

# Open browser: http://localhost:3000
# 1. Log in
# 2. Select Mission #1
# 3. Send message in chat: "How do I send a Telegram message?"
# 4. Verify Rafael responds with code
# 5. Click [Copy Code] → verify code copied
# 6. Switch to DoD tab → check 3 boxes
# 7. Verify progress shows "3/11 (27%)"
# 8. Switch to Mission #2
# 9. Verify Mission #2 data loads (different DoD checklist)
```

**4. Performance Test:**
```bash
# Use Lighthouse or PageSpeed Insights
# Target URL: https://scopelock.mindprotocol.ai/deck (after deploy)

# Expected scores:
# Performance: ≥90
# Accessibility: ≥90
# Best Practices: ≥90
# SEO: ≥80 (not critical for internal tool)
```

---

### Seed Data (For Testing)

**Create 2 test missions in database:**

```sql
-- Mission 1
INSERT INTO missions (id, title, client, budget, deadline, status, assigned_to, created_at)
VALUES (
  '1',
  'Telegram Notifier',
  'Acme Corp',
  300,
  '2025-11-08 23:59:59',
  'active',
  'person1@scopelock.ai',
  NOW()
);

-- Mission 2
INSERT INTO missions (id, title, client, budget, deadline, status, assigned_to, created_at)
VALUES (
  '2',
  'Landing Page',
  'Beta Inc',
  450,
  '2025-11-10 23:59:59',
  'active',
  'person1@scopelock.ai',
  NOW()
);

-- DoD items for Mission 1
INSERT INTO dod_items (mission_id, text, category, completed) VALUES
  ('1', 'Bot sends text messages', 'functional', false),
  ('1', 'Bot sends messages with inline buttons', 'functional', false),
  ('1', 'Inline buttons trigger callbacks', 'functional', false),
  ('1', 'Deployed to Render', 'non-functional', false),
  ('1', 'Health check endpoint responds', 'non-functional', false),
  ('1', 'Manual test: Send message (screenshot)', 'tests', false);
```

---

### Expected Outputs

**After all tests pass:**
- ✅ Backend returns 200 OK for all API endpoints
- ✅ Frontend renders without console errors
- ✅ Login flow completes successfully
- ✅ Chat sends message and receives Rafael response
- ✅ DoD checkbox toggles and persists
- ✅ Mission switch loads new data correctly
- ✅ Lighthouse performance score ≥90

**If any test fails:**
- ❌ DO NOT mark mission as AC Green
- ❌ Return to development, fix issue
- ❌ Re-run tests until all pass

---

## Definition of Done (Summary)

**Mission is AC Green when:**

1. ✅ All functional criteria (F1-F7) tested and working
2. ✅ All non-functional criteria (NF1-NF5) measured and passing
3. ✅ All test commands run successfully (backend, frontend, E2E)
4. ✅ Deployed to production (Vercel + Render)
5. ✅ Person 1 completes ONE mission using the console end-to-end
6. ✅ Zero critical bugs reported
7. ✅ Sofia verification checklist complete (see DOD.md)

**Payment:** Upon AC Green confirmation.

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
