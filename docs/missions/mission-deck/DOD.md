# Definition of Done: ScopeLock Mission Deck

**Mission:** Internal developer dashboard
**Purpose:** Verification checklist before delivery
**Created:** 2025-11-05

---

## Documentation Complete

- [ ] PATTERN.md created with principles and success criteria
- [ ] AC.md created with functional + non-functional + verification
- [ ] VALIDATION.md created with test specifications
- [ ] MECHANISM.md created with architecture and tech choices
- [ ] ALGORITHM.md created with implementation steps
- [ ] GUIDE.md created with setup and deployment steps
- [ ] This DOD.md checklist complete

---

## Backend Implementation

### Database

- [ ] PostgreSQL database created (Render managed or local)
- [ ] All tables created via Alembic migrations:
  - [ ] `users` table
  - [ ] `missions` table
  - [ ] `chat_messages` table
  - [ ] `dod_items` table
- [ ] Indexes created on frequently queried columns:
  - [ ] `users.email`
  - [ ] `missions.assigned_to`
  - [ ] `missions.status`
  - [ ] `chat_messages.mission_id`
  - [ ] `dod_items.mission_id`

### API Endpoints

- [ ] `POST /api/auth/login` implemented and tested
- [ ] `GET /api/missions` implemented and tested
- [ ] `GET /api/missions/:id` implemented and tested
- [ ] `POST /api/missions/:id/chat` implemented and tested
- [ ] `GET /api/missions/:id/messages` implemented and tested
- [ ] `GET /api/missions/:id/dod` implemented and tested
- [ ] `PATCH /api/missions/:id/dod/:item_id` implemented and tested
- [ ] `GET /health` returns `{"status": "ok"}`

### Rafael Integration

- [ ] Claude API integration working
- [ ] Code block extraction from Rafael responses working
- [ ] Error handling for API failures implemented
- [ ] Response time <10 seconds for typical questions

### Auth & Security

- [ ] JWT authentication implemented
- [ ] Password hashing with bcrypt working
- [ ] Protected routes require valid token
- [ ] Users can only access their assigned missions
- [ ] CORS configured for frontend domain
- [ ] No sensitive data in logs

### Tests

- [ ] Backend unit tests pass (pytest)
- [ ] Test coverage ≥80%
- [ ] All auth tests pass (login, logout, protected routes)
- [ ] All mission tests pass (list, get, filter by user)
- [ ] All chat tests pass (send message, list messages)
- [ ] All DoD tests pass (list items, toggle checkbox)

---

## Frontend Implementation

### Pages & Layout

- [ ] Login page implemented at `/`
- [ ] Console layout implemented at `/deck`
- [ ] Left panel (mission selector) implemented
- [ ] Tab navigation implemented (Chat, DoD, Context)
- [ ] Responsive layout working (desktop + tablet)

### Mission Selector

- [ ] Displays all assigned missions
- [ ] Shows mission status indicator (● green = active, etc.)
- [ ] Shows mission #, title, budget, deadline
- [ ] Click mission → switches to that mission
- [ ] Active mission highlighted
- [ ] Scrollable if >5 missions

### Chat Tab

- [ ] Chat input field working
- [ ] [Send] button sends message
- [ ] Enter key sends message
- [ ] User messages appear immediately (optimistic UI)
- [ ] Loading indicator while waiting for Rafael
- [ ] Rafael responses render correctly
- [ ] Code blocks have syntax highlighting
- [ ] [Copy Code] button works
- [ ] Auto-scrolls to bottom on new message
- [ ] Message history persists across page reloads

### DoD Tab

- [ ] Displays 3 sections: Functional, Non-Functional, Tests
- [ ] Checkbox toggle works
- [ ] Progress bar updates correctly (e.g., "3/11 (27%)")
- [ ] Checkbox state persists across page reloads
- [ ] [Mark All Complete] button works
- [ ] Mission status changes to "qa" when all complete
- [ ] Completed timestamp shown for checked items

### Context Tab

- [ ] Displays mission details (client, budget, deadline, status)
- [ ] Displays tech stack (backend, frontend, deploy, database)
- [ ] Notes text area is editable
- [ ] [Save Notes] button saves to database
- [ ] Notes persist across page reloads

### Mission Switching

- [ ] Clicking mission in left panel switches active mission
- [ ] All tabs reload with new mission data
- [ ] Chat history loads for new mission
- [ ] DoD checklist loads for new mission
- [ ] Context details load for new mission
- [ ] URL updates (e.g., `/deck/missions/48`)
- [ ] Browser back button works
- [ ] Switch completes in <1 second

### Tests

- [ ] Frontend component tests pass (Jest + RTL)
- [ ] MissionSelector tests pass
- [ ] ChatTab tests pass
- [ ] DODTab tests pass
- [ ] ContextTab tests pass
- [ ] Mission switching integration test passes

---

## Deployment

### Backend (Render)

- [ ] Web Service created on Render
- [ ] PostgreSQL instance created on Render
- [ ] Environment variables configured:
  - [ ] `DATABASE_URL` (from PostgreSQL)
  - [ ] `JWT_SECRET` (256-bit random string)
  - [ ] `CLAUDE_API_KEY` (from Anthropic console)
  - [ ] `CORS_ORIGINS` (frontend URL)
- [ ] Database migrations run successfully (`alembic upgrade head`)
- [ ] Health check endpoint responding: `GET /health`
- [ ] Service URL accessible: `https://scopelock-deck-api.onrender.com`

### Frontend (Vercel)

- [ ] Project imported to Vercel
- [ ] Environment variable configured: `NEXT_PUBLIC_API_URL`
- [ ] Build successful
- [ ] Deployment URL accessible: `https://scopelock.mindprotocol.ai/deck`
- [ ] Custom domain configured: `scopelock.mindprotocol.ai/deck`
- [ ] DNS propagated and working

### Data Seeding

- [ ] Test data seeded (2 missions, DoD items, test user)
- [ ] Production user accounts created (person1-4@scopelock.ai)
- [ ] Initial passwords documented and shared with team

---

## Performance

### Page Load

- [ ] p95 page load time ≤2 seconds (Lighthouse)
- [ ] First Contentful Paint ≤1.2s
- [ ] Lighthouse Performance score ≥90

### API Response Times

- [ ] Rafael chat response ≤10 seconds (p95)
- [ ] DoD checkbox toggle ≤500ms (p95)
- [ ] Mission switch ≤1 second (p95)

### Asset Sizes

- [ ] CSS bundle ≤50KB gzipped
- [ ] JS bundle ≤300KB gzipped (excluding dependencies)

---

## Security

- [ ] No sensitive data in localStorage (JWT in httpOnly cookies OR short-lived tokens)
- [ ] All API inputs validated (chat message ≤10,000 chars, etc.)
- [ ] SQL injection prevented (parameterized queries only)
- [ ] XSS prevented (user input sanitized/escaped)
- [ ] CORS restricted to frontend domain only
- [ ] No .env files committed to git
- [ ] Production secrets stored in Render/Vercel environment variables

---

## Accessibility

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast ≥4.5:1 (WCAG AA)
- [ ] Screen reader friendly (semantic HTML, ARIA labels)

---

## Manual Testing (Person 1)

### Scenario 1: First-Time Login

- [ ] Navigate to `https://scopelock.mindprotocol.ai/deck`
- [ ] Click [Log In]
- [ ] Enter credentials: `person1@scopelock.ai` / `INITIAL_PASSWORD`
- [ ] Redirects to `/deck`
- [ ] Mission list appears

**Expected:** Login completes in ≤3 clicks, mission list loads in <2s

---

### Scenario 2: Chat with Rafael

- [ ] Select Mission #1
- [ ] Type: "How do I send a Telegram message with inline buttons?"
- [ ] Click [Send]
- [ ] User message appears immediately
- [ ] Loading indicator shows
- [ ] Rafael responds within 10 seconds
- [ ] Response contains Python code with syntax highlighting
- [ ] Hover over code block → [Copy Code] appears
- [ ] Click [Copy Code]
- [ ] Paste into text editor → code copied correctly

**Expected:** Response arrives in <10s, code formatting correct, copy works

---

### Scenario 3: DoD Progress Tracking

- [ ] Select Mission #1
- [ ] Switch to DoD tab
- [ ] Check 3 checkboxes
- [ ] Progress updates to "3/11 (27%)"
- [ ] Refresh page
- [ ] Checkboxes still checked
- [ ] Progress still shows "3/11 (27%)"

**Expected:** Checkbox toggles instant, progress updates, persistence works

---

### Scenario 4: Mission Switching

- [ ] Select Mission #1
- [ ] Verify context shows "Telegram Notifier"
- [ ] Select Mission #2
- [ ] Verify context shows "Landing Page"
- [ ] Verify DoD checklist different
- [ ] Verify chat history different
- [ ] Use browser back button
- [ ] Verify returns to Mission #1

**Expected:** Switch completes in <1s, data correct per mission

---

### Scenario 5: Notes Persistence

- [ ] Select Mission #1
- [ ] Switch to Context tab
- [ ] Enter notes: "Client prefers inline buttons"
- [ ] Click [Save Notes]
- [ ] Refresh page
- [ ] Verify notes still present

**Expected:** Notes save and persist

---

## Bug Tracking

### Critical Bugs (Must Fix Before Delivery)

- [ ] Zero critical bugs remaining
- [ ] All login issues resolved
- [ ] All data persistence issues resolved
- [ ] All Rafael integration issues resolved

### Minor Bugs (Can Fix Post-Delivery)

- [ ] Minor UI issues documented in GitHub issues
- [ ] Performance optimizations documented for Week 2
- [ ] Feature requests documented for Week 2

---

## Documentation

- [ ] GUIDE.md tested by following all setup steps
- [ ] Troubleshooting section verified with common errors
- [ ] Environment variable examples accurate
- [ ] Deployment steps tested end-to-end

---

## Team Handoff

### To Person 1 (First User)

- [ ] Account credentials provided: `person1@scopelock.ai`
- [ ] Console URL shared: `https://scopelock.mindprotocol.ai/deck`
- [ ] Brief onboarding call scheduled (15 min)
- [ ] Asked to complete ONE mission using console exclusively
- [ ] Feedback form shared (collect after first mission)

### To Sofia (QA Verification)

- [ ] This DOD checklist reviewed together
- [ ] All checkboxes verified (not just marked by developer)
- [ ] Manual test scenarios completed with Sofia watching
- [ ] Zero critical bugs confirmed
- [ ] Performance metrics verified (Lighthouse screenshots)

### To NLR (Final Approval)

- [ ] 15-minute demo of console functionality
- [ ] Show: login, mission selector, chat, DoD, context
- [ ] Show: production deployment (Render + Vercel)
- [ ] Show: test results (backend + frontend)
- [ ] Show: Lighthouse performance score
- [ ] Get approval to mark AC Green

---

## Success Metrics (Week 1 Targets)

### User Adoption

- [ ] Person 1 completes 1 mission using console exclusively
- [ ] Person 1 asks ≥5 questions in Rafael chat
- [ ] Person 1 checks all DoD items before delivery
- [ ] Person 1 satisfaction survey ≥4/5 stars

### Technical Quality

- [ ] Zero critical bugs reported in first week
- [ ] p95 response times meet thresholds (see Performance section)
- [ ] Lighthouse score ≥90
- [ ] Uptime ≥99% during work hours (9 AM - 6 PM CET)

### Cost

- [ ] Backend cost ≤$15/month (Render Starter + PostgreSQL)
- [ ] Frontend cost = $0 (Vercel free tier)
- [ ] Claude API cost ≤$10/month (Week 1 usage)
- [ ] **Total:** ≤$25/month

---

## Definition of AC Green

**Mission is AC Green when ALL of the following are TRUE:**

1. ✅ All items in this DOD checklist are checked
2. ✅ Sofia has verified all checkboxes (not self-reported)
3. ✅ Person 1 has completed ONE mission using console end-to-end
4. ✅ All backend tests pass (pytest)
5. ✅ All frontend tests pass (Jest)
6. ✅ Lighthouse Performance score ≥90
7. ✅ Zero critical bugs reported
8. ✅ NLR has approved delivery (15 min demo)

**If ANY of the above are FALSE: Mission is NOT AC Green.**

---

## Post-Delivery (Week 2 and Beyond)

**Planned Features (Not Week 1):**

- [ ] Files tab (upload/download mission files)
- [ ] Screenshot upload for DoD verification
- [ ] Multi-citizen chat (Emma for proposals, Sofia for QA)
- [ ] Mission creation from frontend (admin UI)
- [ ] Upwork job import
- [ ] Real-time notifications (Telegram, email)
- [ ] Analytics dashboard (usage metrics)

**Metrics to Track:**

- [ ] Number of missions completed via console (vs. old workflow)
- [ ] Average questions asked per mission (Rafael chat)
- [ ] Context switching reduction (self-reported survey)
- [ ] Developer satisfaction (monthly survey)

---

**Sofia's Final Verification:**

```
Date: __________
Verified by: __________
All checkboxes verified: YES / NO
Critical bugs remaining: __________
Ready for NLR approval: YES / NO
```

---

**NLR's Final Approval:**

```
Date: __________
Approved by: Nicolas (NLR)
Demo completed: YES / NO
Approved for AC Green: YES / NO
Payment authorized: YES / NO
```

---

**Mission Status:** ⬜ In Progress | ⬜ Ready for QA | ⬜ AC Green

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
