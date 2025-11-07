# Acceptance Criteria: Mission Deck Compensation System

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Add gamified, interaction-based compensation tracking to Mission Deck

---

## Functional Criteria

### F1: Job Tracking with Interaction Counting

**Given:** A team member is working on a client job in Mission Deck
**When:** They send a message to an AI citizen (Rafael, Inna, Sofia, Emma) in the job's dedicated chat thread
**Then:** Their interaction count for that job increments by 1 and their potential earnings update immediately

**Acceptance:**
- [ ] Job card displays: "Your interactions: X" (updates in <500ms after message sent)
- [ ] Job card displays: "Team total: Y" (updates in <500ms)
- [ ] Job card displays: "Earning at job completion: $Z.ZZ" (calculated as `(X/Y) × job.teamPool`)
- [ ] Interaction count persisted to FalkorDB as `U4_Event` node with link to job
- [ ] UI shows loading state during update
- [ ] Error message if update fails: "Failed to track interaction. Retry?"

**Test data:**
```
Job: Build Chatbot - TherapyKin
Value: $1,500
Team Pool: $450 (30%)
Initial interactions: Member A = 10, Member B = 5, Total = 15
```

**Expected after Member A sends 1 message:**
```
Member A interactions: 11
Team total: 16
Member A earning: (11/16) × $450 = $309.38
Member B earning: (5/16) × $450 = $140.62
```

---

### F2: Job Creation from Upwork Win

**Given:** Emma or team member wins an Upwork job
**When:** They create a new job in Mission Deck with client name and dollar value
**Then:** System automatically calculates team pool (30%) and mission fund (5%) and creates job card in JOBS section

**Acceptance:**
- [ ] "Create New Job" button visible in JOBS section
- [ ] Form fields: Job title, client name, dollar value, due date (optional)
- [ ] On submit: Job appears in JOBS section with status "Active"
- [ ] Job card shows: Team pool ($X × 0.30), Mission fund ($X × 0.05)
- [ ] Job card shows: "Your interactions: 0" initially
- [ ] Job stored in FalkorDB as `U4_Work_Item` with `work_type='job'`
- [ ] Mission fund balance increases by 5% of job value

**Test data:**
```
Input:
- Title: "Build AI Dashboard"
- Client: "TechCorp"
- Value: $2,000
- Due: 2025-11-20

Expected output:
- Team pool: $600
- Mission fund contribution: $100
- Status: Active
- Your interactions: 0
- Team total: 0
```

---

### F3: Real-Time Total Potential Earnings Display

**Given:** A team member has contributed to multiple jobs and completed missions
**When:** They view Mission Deck
**Then:** Top banner shows total potential earnings from all active jobs + completed missions

**Acceptance:**
- [ ] Banner displays: "YOUR TOTAL POTENTIAL EARNINGS: $X,XXX.XX" (prominent, always visible)
- [ ] Calculation: Sum of (potential earnings from each active job) + (mission earnings pending payment)
- [ ] Updates in <500ms when new interaction added
- [ ] Tooltip on hover: "From X active jobs + Y completed missions"
- [ ] Link to "View Earnings Breakdown" (detailed view)

**Test data:**
```
Job A: $1,500, Your 20/100 interactions → $90 potential
Job B: $800, Your 5/50 interactions → $24 potential
Job C: $1,200, Your 10/80 interactions → $45 potential
Mission earnings: 3 proposals ($3) + 1 X post ($2) = $5

Expected total: $90 + $24 + $45 + $5 = $164.00
Banner shows: "YOUR TOTAL POTENTIAL EARNINGS: $164.00"
```

---

### F4: Mission Listing (Emma Auto-Created, Points-Based)

**Given:** Team member views Mission Deck
**When:** They navigate to MISSIONS section
**Then:** They see Emma-created missions with points (no claiming, first to complete wins)

**Acceptance:**
- [ ] MISSIONS section lists all missions (available, completed, paid)
- [ ] Each mission card shows: Title, **points value** (not dollar amount), status, Emma search query
- [ ] Mission title format: "Apply to all jobs from Emma search '[query]' (X jobs)"
- [ ] Status badge: Available (green), Completed (blue), Paid (gray)
- [ ] If completed: Shows "Completed by [Name]" and completion timestamp
- [ ] Points indicator: "1 point" (for proposal missions)
- [ ] Current points total shown: "You have 3 points" (resets at next job payment)
- [ ] Payment timing note: "Points convert to earnings at next job completion"
- [ ] No claiming mechanism (missions go straight from available → completed)
- [ ] No requirements to complete (anyone can do any mission)
- [ ] First to complete wins (mission becomes unavailable to others)

**Test data (Available missions):**
```
Mission Fund Balance: $150.00 (from 5% of active jobs)
Current Points: member_a = 2, member_b = 1

Available missions:
1. "Apply to all jobs from Emma search 'voice AI dashboard' (5 jobs)" - 1 point ⚪ Available
   Created by: emma_citizen
   Search date: 2025-11-07

2. "Apply to all jobs from Emma search 'AI analytics' (3 jobs)" - 1 point ⚪ Available
   Created by: emma_citizen
   Search date: 2025-11-06

Completed missions:
3. "Apply to all jobs from Emma search 'chatbot integration' (2 jobs)" - 1 point ✅ Completed
   Completed by: member_a on 2025-11-05T14:23:00Z
```

**Test data (First to complete wins):**
```
Mission 1 is available.
member_a completes it via Emma chat validation.
→ Mission 1 status: Completed by member_a
→ Mission 1 no longer available to member_b
→ member_a points: 3 (was 2, +1 from this mission)
```

---

### F5: Mission Completion via Emma Chat Validation

**Given:** Team member completes a mission (applies to jobs from Emma search)
**When:** Emma says "mission complete" in chat session
**Then:** Mission auto-completes, points added to member, paid at next job completion

**Acceptance:**
- [ ] Emma validates completion via chat (no manual proof upload)
- [ ] When Emma says "mission complete" in chat: Mission status → "Completed"
- [ ] Emma tracks chat session ID for audit trail
- [ ] Member's points increase immediately (+1 for proposal missions)
- [ ] Mission earnings = (member_points / total_points) × next_job's_5%_pool
- [ ] Payment timing: Batched with next job completion (NOT immediate)
- [ ] If no missions completed when job pays → 5% pool goes to NLR
- [ ] Points reset to 0 after each job payment
- [ ] No NLR approval needed (auto-approved, trust member + spot check)

**Test data (Emma chat validation):**
```
Mission: "Apply to all jobs from Emma search 'voice AI dashboard' (5 jobs)" - 1 point

Chat session:
member_a: "Emma, search for 'voice AI dashboard' jobs"
Emma: [searches Upwork, finds 5 jobs]
Emma: "Found 5 jobs. Writing proposals now..."
Emma: [generates 5 proposals]
Emma: "mission complete"

Expected:
- Mission status: Completed by member_a
- member_a points: +1 (e.g., from 2 → 3)
- Chat session ID stored: "chat-session-uuid-12345"
- Payment timing: "At next job completion"
- No manual proof required
```

**Test data (Points-based payment at job completion):**
```
Current state:
- member_a: 3 points (completed 3 missions)
- member_b: 1 point (completed 1 mission)
- Total points: 4

Job completes with $1000 value:
- 30% team pool: $300 (split by interactions)
- 5% mission pool: $50 (split by points)

Mission payments:
- member_a: (3/4) × $50 = $37.50
- member_b: (1/4) × $50 = $12.50

After payment:
- Points reset to 0 for all members
- Mission statuses: Completed → Paid
```

**Test data (No missions completed → pool goes to NLR):**
```
Job completes with $1000 value:
- 30% team pool: $300 (split by interactions)
- 5% mission pool: $50

No missions completed since last job.
→ $50 goes to NLR (org)
```

---

### F6: Job Completion and Payment Trigger

**Given:** Client job reaches AC green and client releases payment on Upwork
**When:** NLR marks job as "Payment Received" in Mission Deck
**Then:** All team members who contributed receive their final earnings based on interaction counts

**Acceptance:**
- [ ] "Mark Payment Received" button visible to NLR only
- [ ] Shows confirmation: "Pay $X to Y team members?" with breakdown
- [ ] On confirm: Job status → "Paid", interaction counts frozen
- [ ] Each member's earnings moved from "potential" to "paid history"
- [ ] Payment breakdown visible: "Member A: $X for Y interactions, Member B: $Z for W interactions"
- [ ] Notification sent to all contributors: "You earned $X from [Job Name]"

**Test data:**
```
Job: "Build Chatbot - TherapyKin" - $1,500
Team pool: $450
Final interactions: Member A = 30, Member B = 20, Total = 50

Expected payments:
- Member A: (30/50) × $450 = $270.00
- Member B: (20/50) × $450 = $180.00

After payment:
- Job status: "Paid"
- Member A total paid earnings: +$270.00
- Member B total paid earnings: +$180.00
- Notifications sent
```

---

### F7: Earnings Breakdown View

**Given:** Team member wants detailed view of their earnings
**When:** They click "View Earnings Breakdown" from top banner
**Then:** Modal shows detailed breakdown by job and mission with audit trail

**Acceptance:**
- [ ] Modal title: "Your Earnings Breakdown"
- [ ] Two tabs: "Active Jobs" and "Completed Missions"
- [ ] Active Jobs tab shows: Job title, your interactions, team total, potential earning, status
- [ ] Completed Missions tab shows: Mission title, payment, completion date, status (pending/paid)
- [ ] "Paid History" section shows: All paid jobs and missions with totals
- [ ] Each item clickable → Shows interaction/completion history with timestamps

**Test data:**
```
Active Jobs:
├─ Chatbot - TherapyKin: 20 interactions, $90.00 potential
├─ Landing Page - StartupX: 5 interactions, $24.00 potential
└─ Dashboard - TechCorp: 10 interactions, $45.00 potential

Completed Missions:
├─ Write proposal (AI Analytics) - $1.00 - Pending payment
├─ Post on X (Nov 5) - $2.00 - Pending payment
└─ Write proposal (Chatbot) - $1.00 - Paid

Paid History:
└─ Voice AI App - JobCorp: 15 interactions → $120.00 (Paid Nov 1)
```

---

### F8: Mission Fund Balance Visibility (5% Pool from Jobs)

**Given:** Team member or NLR wants to check mission fund status
**When:** They view MISSIONS section
**Then:** Header shows current mission fund balance and source (5% from which jobs)

**Acceptance:**
- [ ] MISSIONS section header shows: "Mission Fund: $XX.XX available"
- [ ] Tooltip shows source: "From: Job A ($X), Job B ($Y), Job C ($Z)"
- [ ] Current points total shown: "Total points in system: X" (sum of all completed missions)
- [ ] Payment timing note: "Points convert to earnings at next job completion"
- [ ] If no active jobs: Info message "No active jobs - mission fund at $0"
- [ ] If no completed missions: Note "No missions completed yet - 5% pool will go to org at next job payment"
- [ ] NLR sees additional: "Completed missions: X (worth Y points total)"

**Test data (Mission fund accumulation - 5% from jobs):**
```
Active jobs:
- Job A ($1,500): 30% team pool ($450 for interactions), 5% mission pool ($75)
- Job B ($800): 30% team pool ($240 for interactions), 5% mission pool ($40)
- Job C ($1,200): 30% team pool ($360 for interactions), 5% mission pool ($60)

Mission Fund Total: $175.00 (5% from all active jobs)
Completed missions: 3 (3 points total)

Expected display:
Mission Fund: $175.00 available
From: Build Chatbot ($75), Landing Page ($40), Dashboard ($60)
Total points in system: 3
Payment timing: At next job completion

Note: Job earnings (30% pools) are separate and split by interactions.
Mission earnings (5% pools) are separate and split by points.
```

**Test data (Points-based distribution when job pays):**
```
Job A completes and pays:
- 30% team pool ($450) → Split by interactions among contributors
- 5% mission pool ($75) → Split by points among mission completers

Mission pool distribution:
member_a: 2 points (completed 2 missions)
member_b: 1 point (completed 1 mission)
Total: 3 points

Mission earnings from Job A's 5%:
- member_a: (2/3) × $75 = $50.00
- member_b: (1/3) × $75 = $25.00

After payment:
- Points reset to 0 for both members
- Mission statuses: Completed → Paid
- Mission fund decreases by $75
```

**Test data (No missions completed):**
```
Fund: $175.00
Completed missions: 0

Expected display:
Mission Fund: $175.00 available
Total points in system: 0
Note: "No missions completed. At next job payment, this fund goes to org."
```

---

### F9: Interaction History Audit

**Given:** Team member wants to verify their interaction count
**When:** They click on "Your interactions: X" on a job card
**Then:** Modal shows complete list of interactions with timestamps and message previews

**Acceptance:**
- [ ] Modal title: "[Job Name] - Your Interaction History"
- [ ] Table columns: Timestamp, Message preview (first 50 chars), AI recipient
- [ ] Sorted by timestamp (newest first)
- [ ] Search/filter: By AI recipient, by date range
- [ ] Export button: Download CSV of interaction history
- [ ] Each row clickable → Jumps to actual message in chat

**Test data:**
```
Job: Build Chatbot - TherapyKin
Your interactions: 20

Expected display:
┌──────────────────────────────────────────────────────┐
│ 2025-11-07 14:23:15  "Rafael, implement OTP flow..." │ → Rafael
│ 2025-11-07 13:45:02  "Inna, update AC.md with new..." │ → Inna
│ 2025-11-07 12:10:33  "Sofia, run acceptance tests..." │ → Sofia
│ ... (17 more)
└──────────────────────────────────────────────────────┘
```

---

### F10: Mobile-Responsive Earnings UI

**Given:** Team member accesses Mission Deck on mobile device
**When:** They view jobs, missions, and earnings
**Then:** All compensation features work correctly on mobile (320px width minimum)

**Acceptance:**
- [ ] Top banner stacks vertically on mobile: "YOUR TOTAL" on one line, "$X,XXX.XX" on next
- [ ] Job cards show abbreviated view: Title, value, your earning (3 lines max)
- [ ] Tap job card → Expands to show full details (interactions, team total, etc.)
- [ ] Mission cards show: Title, payment, "Claim" button (vertical layout)
- [ ] Earnings breakdown modal scrollable on mobile
- [ ] All buttons minimum 44px touch target

**Test devices:**
- iPhone SE (320px width)
- iPhone 12 (390px width)
- Android mid-range (360px width)

---

### F11: Team Leaderboard (Mandatory Wallet Connection)

**Given:** Team member wants to view team-wide potential earnings leaderboard
**When:** They navigate to Team page
**Then:** If wallet connected, show leaderboard; if not, show wallet connection prompt

**Acceptance:**
- [ ] New "Team" page accessible from main navigation
- [ ] **If wallet NOT connected:**
  - [ ] Show prompt: "Connect Your Solana Wallet"
  - [ ] Explanation: "Required to receive payments and view team leaderboard"
  - [ ] "Connect Wallet" button → Opens existing wallet connection flow
  - [ ] After wallet connected → Automatically shows leaderboard
- [ ] **If wallet connected:**
  - [ ] Page title: "Team Potential Earnings Leaderboard"
  - [ ] Shows all team members ranked by `potentialEarnings` (DESC)
  - [ ] Table columns: Rank (#1, #2, #3...), Name, Potential Earnings
  - [ ] Current user row highlighted (different background color)
  - [ ] Real-time updates via WebSocket (<1s after earnings change)
  - [ ] Shows total team potential: "Team Total: $X,XXX.XX"
- [ ] **Wallet display:**
  - [ ] User's connected wallet shown in header (truncated): "9xQe...rGtX"
  - [ ] Click wallet → Show full address + "Disconnect" option
  - [ ] If wallet disconnected → Returns to connection prompt
- [ ] **Privacy:**
  - [ ] Only shows potential earnings (NOT paid earnings)
  - [ ] Only shows totals (NOT per-job breakdown)
  - [ ] No interaction counts visible

**Test data:**
```
Team members (sorted by potential earnings):
1. member_a: $450.00 (Alice) ← Current user
2. member_b: $320.00 (Bob)
3. member_c: $180.00 (Carol)
4. member_d: $90.00 (Dan)

Team Total: $1,040.00
```

**Expected display (wallet connected):**
```
┌─────────────────────────────────────────────────────┐
│ Team Potential Earnings Leaderboard                 │
│ Connected: 9xQe...rGtX                              │
├─────────────────────────────────────────────────────┤
│ Rank  Name     Potential Earnings                   │
├─────────────────────────────────────────────────────┤
│  #1   Alice    $450.00                   ← You      │
│  #2   Bob      $320.00                              │
│  #3   Carol    $180.00                              │
│  #4   Dan      $90.00                               │
├─────────────────────────────────────────────────────┤
│ Team Total: $1,040.00                               │
└─────────────────────────────────────────────────────┘
```

**Expected display (wallet NOT connected):**
```
┌─────────────────────────────────────────────────────┐
│ Connect Your Solana Wallet                          │
│                                                      │
│ Required to receive payments and view team          │
│ leaderboard                                          │
│                                                      │
│ [Connect Wallet]                                     │
│                                                      │
│ Use Phantom, Solflare, or any Solana wallet         │
└─────────────────────────────────────────────────────┘
```

**Verification:**
- [ ] Cannot view leaderboard without wallet (enforced on backend)
- [ ] Wallet stored in `agent.walletAddress` field (from existing flow)
- [ ] Leaderboard query checks `walletAddress IS NOT NULL`
- [ ] Real-time updates work (WebSocket)

---

## Non-Functional Criteria

### NF1: Performance

**Real-time interaction tracking:**
- p95 latency ≤ 500ms from message sent to UI update (interaction count + earnings)
- p95 latency ≤ 200ms for earnings calculation (server-side)
- Page load ≤ 2s with 50 active jobs + 100 missions

**Database query performance:**
- Get member earnings: ≤ 100ms (cached)
- Get job interactions: ≤ 150ms
- Update interaction count: ≤ 50ms (write to FalkorDB)

**UI responsiveness:**
- Scroll 60fps with 100+ job cards
- Earnings breakdown modal opens in <300ms
- No janky animations on earnings updates

### NF2: Data Accuracy

**Interaction counting:**
- 100% accuracy: Every message counted exactly once
- Zero duplicate counts
- Zero missed interactions

**Earnings calculation:**
- Calculation accuracy: ±$0.01 (rounding to 2 decimals)
- Team pool sum = exactly 30% of job value
- Mission fund sum = exactly 5% of job value
- No floating-point errors causing discrepancies

**Audit trail:**
- Every interaction stored in FalkorDB with timestamp
- Earnings calculations traceable via audit log
- Historical data never deleted (only marked `valid_to`)

### NF3: Availability

**Uptime:**
- 99.5% uptime for Mission Deck compensation features
- Earnings calculation endpoint: 99.9% uptime
- Graceful degradation: If FalkorDB unavailable, show cached earnings with warning

**Error recovery:**
- If interaction tracking fails, retry 3× before alerting
- If earnings calculation fails, log error + show last known value
- Background sync every 5 minutes to catch missed interactions

### NF4: Security

**Authorization:**
- Team members can only view their own detailed earnings
- Team members can see team totals (not individual breakdowns)
- NLR can view all earnings and approve mission completions
- Payment trigger requires NLR role + 2FA confirmation

**Data privacy:**
- Interaction messages not visible to other members (only counts)
- Mission proof visible only to claimant + NLR
- Earnings breakdown visible only to member + NLR

**Audit logging:**
- All earnings changes logged with: Who, what, when, why
- Payment triggers logged with IP, timestamp, 2FA confirmation
- Mission approvals logged with approver, timestamp, decision

### NF5: Usability

**Learning curve:**
- New team member understands system in <15 minutes (with walkthrough)
- First earnings update visible in <2 minutes of using Mission Deck
- Zero training required for "see your earnings" use case

**Error messages:**
- All errors human-readable: "Mission fund insufficient ($5 available, need $10)"
- Actionable guidance: "Need 5+ interactions to claim missions. Currently: 3."
- No technical jargon in user-facing messages

**Accessibility:**
- WCAG 2.1 AA compliant (color contrast, keyboard navigation, screen reader support)
- Earnings amounts announced by screen readers
- Keyboard shortcuts: "E" opens earnings breakdown, "M" opens missions section

---

## Verification

### Test Command

```bash
# Backend tests (interaction tracking, earnings calculation)
cd /home/mind-protocol/scopelock/docs/missions/mission-deck/backend
pytest tests/test_compensation.py -v

# Frontend tests (UI updates, real-time visibility)
cd /home/mind-protocol/scopelock/docs/missions/mission-deck/frontend
npm test -- compensation.test.tsx

# Integration tests (end-to-end flow)
cd /home/mind-protocol/scopelock
playwright test tests/compensation-e2e.spec.ts
```

### Seed Data

```bash
# Create test jobs and missions
python3 scripts/seed-compensation-test-data.py

# Expected seed data:
# - 3 active jobs (values: $1,500, $800, $1,200)
# - 5 available missions (proposals $1, X posts $2, recruitment $10)
# - 2 test team members with historical interactions
# - Mission fund balance: $150
```

### Expected Outputs

**After running seed script:**
```
✅ Created 3 jobs
✅ Created 5 missions
✅ Seeded 45 interactions across 2 members
✅ Mission fund balance: $150.00
✅ Member A potential earnings: $164.00
✅ Member B potential earnings: $89.00
```

**After running tests:**
```
Backend: 47 tests passed, 0 failed
Frontend: 23 tests passed, 0 failed
Integration: 12 tests passed, 0 failed

Performance benchmarks:
├─ Interaction tracking: p95 = 287ms ✅
├─ Earnings calculation: p95 = 142ms ✅
├─ Page load: 1.8s ✅
└─ UI update latency: p95 = 310ms ✅
```

---

## Acceptance Checklist

### Functional Complete
- [ ] F1: Job tracking with interaction counting (tested, working)
- [ ] F2: Job creation from Upwork win (tested, working)
- [ ] F3: Real-time total potential earnings display (tested, working)
- [ ] F4: Mission listing and claiming (tested, working)
- [ ] F5: Mission completion and earnings (tested, working)
- [ ] F6: Job completion and payment trigger (tested, working)
- [ ] F7: Earnings breakdown view (tested, working)
- [ ] F8: Mission fund balance visibility (tested, working)
- [ ] F9: Interaction history audit (tested, working)
- [ ] F10: Mobile-responsive earnings UI (tested on 3 devices)

### Non-Functional Complete
- [ ] NF1: Performance thresholds met (p95 ≤ 500ms for interaction tracking)
- [ ] NF2: Data accuracy verified (100% interaction counting accuracy)
- [ ] NF3: Availability targets met (99.5% uptime)
- [ ] NF4: Security requirements implemented (authorization, audit logging)
- [ ] NF5: Usability validated (new member learns in <15 min)

### Integration Complete
- [ ] FalkorDB schema includes compensation nodes/links
- [ ] Mission Deck UI updated with JOBS and MISSIONS sections
- [ ] Top banner displays total potential earnings
- [ ] Real-time updates working (<500ms latency)
- [ ] Payment trigger integrated with Upwork webhooks (optional)

### Documentation Complete
- [ ] User guide: "How to earn money in Mission Deck"
- [ ] NLR guide: "How to approve missions and trigger payments"
- [ ] FAQ: Common questions about compensation system
- [ ] Troubleshooting: "Interaction not counted?" "Earnings don't match?"

---

## Sign-Off

**Developer:** I confirm all functional criteria are implemented and tested.
**Sofia (QA):** I confirm all acceptance criteria pass and DoD checklist complete.
**NLR:** I approve delivery and authorize payment trigger.

**Date:** _______________
**AC Green Tag:** `ac-green_mission-deck-compensation_2025-11-XX`
