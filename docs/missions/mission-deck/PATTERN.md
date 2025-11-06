# PATTERN: ScopeLock Mission Deck

**Mission ID:** Internal Tool
**Created:** 2025-11-05
**Purpose:** Internal developer dashboard for mission execution with AI citizen guidance

---

## Why ScopeLock Approach

**Context:** ScopeLock developers (4 humans) execute 10+ simultaneous client missions. They need instant access to:
- AI citizen guidance (Rafael for code generation)
- Mission acceptance criteria (DoD tracking)
- Tech stack standards
- Mission context and deadlines

**Current pain:** Developers juggle Telegram, Claude Code CLI, Google Docs, and local files. Context switching kills productivity.

**Solution:** Single-page workspace where each AI citizen provides a specialized context:
- Emma: Upwork job feed (browse/analyze jobs)
- Inna: Documentation editor (specs, AC.md)
- Rafael: GitHub repository view + code guidance chat
- Sofia: QA dashboard (test results, DoD verification)
- Maya: Client communication (messages, status updates)

**Why this matters:**
- Reduces context switching from 50+ times/day to ~5
- Makes Rafael guidance accessible (no CLI knowledge needed)
- Tracks progress automatically (DoD checkboxes → status updates)
- Enforces ScopeLock standards (tech stack visible in every mission)

---

## Core Principles

### 1. **Context-Aware Citizen Workspaces**
Each citizen provides a specialized workspace optimized for their role:
- Emma workspace: Job feed + proposal drafting
- Inna workspace: Spec editor + AC.md builder
- Rafael workspace: GitHub repository view + code guidance chat (DEFAULT)
- Sofia workspace: Test runner + QA checklist
- Maya workspace: Client messages + status updates

**Why:** Different roles need different tools. Emma needs to see jobs, Rafael shows generated code on GitHub, Sofia needs to see tests.

### 2. **Zero External Context Needed**
Everything a developer needs is in the console:
- Mission budget, deadline, client name
- DoD checklist (what to build)
- Tech stack (how to build)
- Rafael (guidance on building)

**Why:** Eliminates "wait, which mission was this?" and "what was the budget again?"

### 3. **Progress Tracking is Passive**
Developers check DoD boxes as they complete features. No separate status update ritual.

**Why:** Reduces manual overhead. Progress visibility without effort.

### 4. **Mobile-Friendly (Week 2)**
Developers may check DoD status or ask Rafael quick questions from phone.

**Why:** Remote work, on-the-go access.

### 5. **Week 1 MVP = One Mission Completed**
Success metric: Person 1 completes ONE mission using this interface end-to-end.

**Why:** Prove value before scaling to 4 developers.

---

## Risk Factors

### R1: Rafael Integration Complexity
**Risk:** Rafael is Claude Code citizen, not API-based. May be complex to expose via web interface.

**Mitigation:**
- Week 1: Simulate Rafael with GPT-4 or Claude API (faster MVP)
- Week 2: Integrate actual Rafael citizen if needed
- Fallback: Human-in-loop (Rafael runs in terminal, human pastes response)

### R2: Developer Adoption
**Risk:** Developers prefer CLI + Telegram (existing workflow).

**Mitigation:**
- Test with Person 1 first (most willing to try new tools)
- Gather feedback, iterate quickly
- Don't force adoption if Week 1 fails
- Fallback: Keep existing workflow, console becomes optional

### R3: Mission Data Synchronization
**Risk:** If missions are tracked elsewhere (Airtable? Google Sheets?), data duplication issues.

**Mitigation:**
- Week 1: Console is source of truth (manual mission creation)
- Week 2: Sync with existing systems if needed
- Do NOT integrate with external systems until MVP proves valuable

---

## Success Criteria

### Business Outcomes

**Week 1 (MVP):**
- ✅ Person 1 completes 1 mission using console exclusively
- ✅ Person 1 asks ≥5 questions in Rafael chat
- ✅ Person 1 checks all DoD items before delivery
- ✅ Zero critical bugs reported

**Week 2 (Scale):**
- ✅ 4 developers complete ≥8 missions total using console
- ✅ Context switching reduced by ≥60% (self-reported survey)
- ✅ Average mission completion time unchanged or faster

### Technical Milestones

**Week 1:**
- ✅ Console deployed to Vercel (frontend) + Render (backend)
- ✅ Auth working (developers can log in)
- ✅ Chat tab functional (Rafael responds to questions)
- ✅ DoD tab functional (checkboxes persist, progress tracks)
- ✅ Context tab shows mission details
- ✅ Mission selector switches between ≥2 test missions

**Week 2:**
- ✅ Files tab (upload/download mission files)
- ✅ Screenshot upload for DoD verification
- ✅ 4 developer accounts created and active

---

## Constraints

### Hard Constraints (Non-Negotiable)

**C1: ScopeLock Standard Stack**
- Frontend: Next.js 14 + Vercel
- Backend: Python FastAPI + Render
- Database: PostgreSQL (Render managed)
- Why: Internal tool, must follow our own standards

**C2: Week 1 = 3 Days Max**
- Day 1: Backend + DB
- Day 2: Frontend shell
- Day 3: Polish + deploy
- Why: Prove value fast, don't over-engineer

**C3: No Email/Slack Integrations Week 1**
- Focus: Core console functionality only
- Why: Avoid scope creep, prove MVP first

### Soft Constraints (Flexible)

**C4: Auth Provider**
- Options: Clerk (fastest) OR JWT (custom)
- Decision: Clerk if <2h setup, otherwise simple JWT

**C5: Rafael Integration**
- Week 1: Simulate with API (GPT-4 or Claude API)
- Week 2: Integrate real Rafael citizen if value proven

---

## Assumptions

**A1: Developers have basic web literacy**
- Can click tabs, type in chat, check checkboxes
- No training needed beyond "here's the URL"

**A2: Missions are manually created by admin (Week 1)**
- No Upwork import, no automation
- Admin (Nicolas or Inna) creates missions via backend or SQL

**A3: One mission at a time per developer**
- Multi-mission juggling is Week 2 feature
- Week 1: Developer focuses on one mission, switches explicitly

**A4: Rafael responds in <10 seconds**
- If using API, this is achievable
- If using actual citizen, may need queue system Week 2

---

## Dependencies

### External Services

**D1: Vercel (Frontend Hosting)**
- Status: Available, account exists
- Cost: Free tier sufficient for Week 1

**D2: Render (Backend + Database)**
- Status: Available, account exists
- Cost: ~$7/month (Starter plan)

**D3: Clerk (Auth) OR Custom JWT**
- Status: TBD based on setup time
- Cost: Clerk free tier (10,000 users) or $0 for JWT

**D4: Claude API or GPT-4 API (Rafael Simulation)**
- Status: Available
- Cost: ~$5-10/month for Week 1 usage

### Internal Dependencies

**D5: Rafael Citizen Integration (Week 2)**
- Status: Rafael exists, needs web API wrapper
- Owner: Rafael/Inna to document integration approach

**D6: Mission Data Format**
- Status: Defined in this spec (see MECHANISM.md)
- Owner: Inna

---

## Out of Scope (Not Week 1)

**Week 2 or Later:**
- Files tab (upload/download)
- Screenshot upload for DoD verification
- Multi-citizen chat (Emma for proposals, Sofia for QA)
- Upwork job import
- Mission creation from frontend (admin UI)
- Payment tracking
- Analytics dashboard
- Notifications (email, Telegram)
- Mobile app (native iOS/Android)
- Real-time collaboration (multiple developers on same mission)

**Never (Explicitly Rejected):**
- Client-facing features (this is internal tool only)
- Billing/invoicing (use existing systems)
- Time tracking (not ScopeLock model)

---

## Design Philosophy

**Guiding Question:** "What does a developer need RIGHT NOW to complete this mission?"

**Answer:**
1. Rafael's guidance (chat)
2. What needs to be done (DoD)
3. Mission context (budget, deadline, stack)

Everything else is secondary.

**UI Principle:** Dark theme, monospace code, minimal chrome. Looks like a developer tool, not a marketing site.

**Interaction Principle:** Keyboard-friendly. Enter to send message, Tab to switch missions, Cmd+K for search (Week 2).

---

## Next Steps

After PATTERN approval:
1. Inna writes AC.md (acceptance criteria)
2. Inna writes VALIDATION.md (test specs)
3. Inna writes MECHANISM.md (architecture)
4. Inna writes ALGORITHM.md (implementation steps)
5. Inna writes GUIDE.md (deployment guide)
6. Rafael generates code from MECHANISM + ALGORITHM
7. Developer deploys following GUIDE
8. Sofia verifies using DOD checklist

**Estimated Timeline:**
- Documentation: 4 hours (Inna)
- Development: 3 days (Rafael + Developer)
- Testing: 1 day (Sofia + Person 1)
- **Total: 1 week from approval to production**

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
