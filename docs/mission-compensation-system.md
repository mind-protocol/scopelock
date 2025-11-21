# Mission Compensation System (High-Level)

**Version:** 1.0
**Date:** 2025-11-07
**Owner:** Alexis (Strategy) → Inna (Detailed Specs)

---

## Overview

ScopeLock is transitioning from dedicated roles to a **flexible, gamified compensation system** where any team member can work on any task and earn based on contribution.

**Key principles:**
- Pay per productive interaction (not hourly or per role)
- Real-time visibility into potential earnings
- Gamified to motivate team members
- Flexible roles (anyone can do anything)

---

## Terminology

### Jobs
**Revenue-generating Upwork client work.**

Examples:
- "Build AI chatbot for TherapyKin - $1,500"
- "Create landing page for FinTech startup - $800"

**Characteristics:**
- Has a dollar value (the client payment)
- Generates team earnings (30% pool + 5% mission fund)
- Tracked in Mission Deck under "JOBS" section

### Missions
**Internal work NOT directly linked to client revenue.**

Examples:
- "Write proposal for Upwork job" → $1-2
- "Recruit new team member" → $5-10
- "Post about ScopeLock on X" → $1-2

**Characteristics:**
- Fixed dollar value per completion
- Financed from 5% mission fund across all jobs
- Tracked in Mission Deck under "MISSIONS" section

---

## Compensation Breakdown

### For Each Job

**Client pays:** $X
**Team pool (30%):** Split by interaction count
**Mission fund (5%):** Finances mission completions
**Total to team:** 35% of job value

### Example Calculation

```
JOB: Build chatbot for Client - $1,000
├─ Team pool: $1,000 × 30% = $300
├─ Mission fund: $1,000 × 5% = $50
└─ ScopeLock revenue: $650

TEAM INTERACTIONS:
├─ Member A: 15 messages to AIs
├─ Member B: 10 messages to AIs
└─ Total: 25 interactions

EARNINGS:
├─ Member A: (15/25) × $300 = $180
└─ Member B: (10/25) × $300 = $120

Mission fund ($50) finances missions during this job:
- Write proposal: $1
- Post on X: $2
- Total spent: $3
- Remaining: $47 (rolls over to next job)
```

---

## Interaction Counting Rules

**What counts as an interaction:**
- ✅ Sending a message to AI (Rafael, Inna, Sofia, Emma) from Mission Deck

**What does NOT count (for now):**
- ❌ File uploads
- ❌ Deployments
- ❌ Testing actions
- ❌ Direct messages outside Mission Deck

**Implementation:** Mission Deck tracks each message sent to an AI and increments interaction count for that team member on that job.

---

## Mission Types & Pricing

### Proposal Writing
**Mission:** "Write proposal for [Upwork Job Name]"
**Payment:** $1 per proposal
**Trigger:** When proposal is submitted to Upwork

### Recruitment
**Mission:** "Recruit new team member"
**Payment:** $10 per successful hire
**Trigger:** When new member completes their first paid job

### Social Media
**Mission:** "Post about ScopeLock on X"
**Payment:** $2 per post
**Trigger:** When post is live with proof (screenshot/link)

### More Mission Types (To Be Added)
- Blog post writing
- Case study creation
- Client testimonial collection
- Documentation improvements
- Bug hunting

---

## Payment Timing

**Team members get paid when:**
1. Client completes the Upwork job
2. Client releases payment to ScopeLock
3. **We receive the money** (not when AC green, not when client approves, but when cash hits our account)

**Typical timeline:**
- Job completes: Day 0
- Client approves: Day 0-2
- Upwork releases funds: Day 2-5
- **Team gets paid:** Day 5-7 (after we receive funds)

---

## Mission Deck UI Requirements

### Left Panel Structure

**Two sections:**

#### JOBS Section
```
┌─ JOBS ─────────────────────────────┐
│                                     │
│ [JOB CARD]                          │
│ Build AI Chatbot - TherapyKin      │
│ Client: TherapyKin                  │
│ Value: $1,500                       │
│ Status: In Progress                 │
│                                     │
│ Your interactions: 12               │
│ Team total: 45                      │
│ Earning at job completion: $120.00  │ ← Updates live
│                                     │
│ [VIEW DETAILS] [MESSAGE AI]        │
└─────────────────────────────────────┘
```

#### MISSIONS Section
```
┌─ MISSIONS ─────────────────────────┐
│                                     │
│ [MISSION CARD]                      │
│ Write proposal for "AI Dashboard"   │
│ Complete this mission: +$1.00       │ ← Fixed amount
│ Status: Available                   │
│                                     │
│ [CLAIM MISSION]                     │
└─────────────────────────────────────┘
```

### Top Banner (Persistent)

```
╔═══════════════════════════════════════════════════╗
║  YOUR TOTAL POTENTIAL EARNINGS: $342.50          ║ ← Big, prominent
║  (From 3 active jobs + 5 completed missions)     ║
╚═══════════════════════════════════════════════════╝
```

---

## Data Model Requirements (For Inna)

### Job Object
```typescript
{
  id: string;
  title: string;
  client: string;
  value: number; // Dollar amount
  status: 'active' | 'completed' | 'paid';
  teamPool: number; // value × 0.30
  missionFund: number; // value × 0.05
  interactions: {
    [memberId: string]: number; // Count per member
  };
  totalInteractions: number;
}
```

### Mission Object
```typescript
{
  id: string;
  title: string;
  type: 'proposal' | 'recruitment' | 'social' | 'other';
  fixedPayment: number; // $1, $2, $10, etc.
  status: 'available' | 'claimed' | 'completed' | 'paid';
  claimedBy?: string; // memberId
  completedAt?: Date;
}
```

### Member Earnings Object
```typescript
{
  memberId: string;
  jobEarnings: {
    [jobId: string]: {
      interactions: number;
      potentialEarning: number; // (interactions/total) × teamPool
      status: 'pending' | 'paid';
    };
  };
  missionEarnings: {
    [missionId: string]: {
      amount: number;
      status: 'pending' | 'paid';
    };
  };
  totalPotentialEarnings: number; // Sum of all pending
  totalPaidEarnings: number; // Sum of all paid
}
```

---

## Business Logic Requirements (For Inna)

### When a message is sent to AI from Mission Deck:

1. **Identify:** Which job is this message related to?
2. **Increment:** `job.interactions[memberId] += 1`
3. **Recalculate:** All team members' potential earnings for this job
4. **Update UI:** Real-time update of "Earning at job completion" for all members

### When a mission is completed:

1. **Deduct:** Mission payment from mission fund
2. **Record:** Member's mission earnings
3. **Update UI:** Total potential earnings

### When we receive payment from client:

1. **Mark job as paid:** `job.status = 'paid'`
2. **Calculate final shares:** Using final interaction counts
3. **Trigger payments:** To all team members who contributed
4. **Update UI:** Move earnings from "potential" to "paid"

---

## Migration Plan (For Inna)

### Phase 1: Data Model
- Create database schema for jobs, missions, interactions, earnings
- Seed with current active Upwork jobs (if any)

### Phase 2: UI Updates
- Add JOBS and MISSIONS sections to left panel
- Add "Total Potential Earnings" banner
- Add interaction tracking to message sending

### Phase 3: Testing
- Test interaction counting with 2-3 team members
- Verify earnings calculations are correct
- Test mission completion flow

### Phase 4: Launch
- Announce new system to team
- Migrate existing work to new structure
- Monitor for issues first week

---

## Open Questions (For Inna to Resolve)

1. **Mission fund rollover:** If mission fund has surplus, does it roll over to next job or get distributed to team?
2. **Minimum interactions:** Should there be a minimum interaction count to qualify for job earnings?
3. **Mission claiming:** Can multiple people claim same mission, or is it one-per-mission?
4. **Historical data:** Do we backfill interaction counts for work already done, or start fresh?
5. **Dispute resolution:** What if someone disputes their interaction count?

---

## Success Metrics

**Week 1:**
- All team members understand new system
- At least 3 jobs tracked with interaction counts
- At least 5 missions completed

**Month 1:**
- 10+ jobs completed under new system
- Average 50+ interactions per job
- Team members report feeling motivated by real-time earnings visibility

---

## Next Steps

**Inna:** Create detailed specification with:
- Complete data model (database schema)
- API endpoints needed
- UI components breakdown
- State management approach
- Migration scripts

**Rafael:** Implement backend logic (after Inna's spec)
- Interaction tracking
- Earnings calculation
- Payment triggers

**Developer:** Implement frontend (after Inna's spec)
- Mission Deck UI updates
- Real-time earnings display
- Mission claiming flow

**Sofia:** Create test cases (after Inna's spec)
- Interaction counting accuracy
- Earnings calculation correctness
- Edge cases (zero interactions, mission fund exhaustion, etc.)
