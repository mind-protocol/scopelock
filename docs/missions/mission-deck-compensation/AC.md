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

### F4: Mission Listing and Claiming

**Given:** Team member views Mission Deck
**When:** They navigate to MISSIONS section
**Then:** They see available missions they can claim with fixed payment amounts

**Acceptance:**
- [ ] MISSIONS section lists all available missions
- [ ] Each mission card shows: Title, fixed payment, status (Available/Claimed/Completed)
- [ ] "Claim Mission" button on available missions
- [ ] After claiming: Status changes to "Claimed by [Name]", button becomes "Mark Complete"
- [ ] 24-hour claim expiry: If not completed in 24h, status reverts to "Available"
- [ ] Cannot claim if < 5 total interactions across all jobs (error: "Need 5+ interactions to claim missions")

**Test data:**
```
Available missions:
1. "Write proposal for 'AI Analytics Dashboard'" - $1.00
2. "Post about ScopeLock on X" - $2.00
3. "Recruit new team member" - $10.00 (requires approval)

Member with 3 interactions tries to claim → Error
Member with 10 interactions claims Mission 1 → Status: "Claimed by [Name]"
```

---

### F5: Mission Completion and Earnings

**Given:** Team member has claimed a mission
**When:** They mark it complete with proof (screenshot, link, etc.)
**Then:** Mission earnings added to their total potential earnings, mission fund balance decreases

**Acceptance:**
- [ ] "Mark Complete" button shows proof upload modal
- [ ] Required: Proof (URL or file upload), optional: Notes
- [ ] On submit: Mission status → "Completed", awaiting approval
- [ ] NLR sees: "Approve Mission Completion" notification
- [ ] After approval: Mission earnings added to member's total potential, mission fund decreases
- [ ] If mission fund insufficient: Error "Mission fund balance too low ($X available, need $Y)"

**Test data:**
```
Mission: "Post about ScopeLock on X" - $2.00
Current mission fund: $50.00

Member completes with proof: twitter.com/user/status/123
Expected:
- Mission status: "Completed (pending approval)"
- After NLR approval:
  - Member earnings: +$2.00
  - Mission fund: $48.00
  - Mission status: "Completed"
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

### F8: Mission Fund Balance Visibility

**Given:** Team member or NLR wants to check mission fund status
**When:** They view MISSIONS section
**Then:** Header shows current mission fund balance and source (5% from which jobs)

**Acceptance:**
- [ ] MISSIONS section header shows: "Mission Fund: $XX.XX available"
- [ ] Tooltip shows: "From: Job A ($X), Job B ($Y), Job C ($Z)"
- [ ] If balance < $10: Warning icon with "Low balance - complete jobs to increase fund"
- [ ] NLR sees additional: "Pending missions: $W" (total of claimed but incomplete missions)

**Test data:**
```
Job A ($1,500) contributed: $75
Job B ($800) contributed: $40
Job C ($1,200) contributed: $60
Spent: $25 on completed missions

Expected display:
Mission Fund: $150.00 available
From: Build Chatbot ($75), Landing Page ($40), Dashboard ($60)
Spent: $25
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
