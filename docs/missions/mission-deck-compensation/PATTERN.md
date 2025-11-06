# PATTERN: Mission Deck Compensation System

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Add gamified, interaction-based compensation tracking to Mission Deck

---

## Why ScopeLock Approach

This enhancement transforms Mission Deck from a chat interface into a **real-time earnings dashboard** where team members see their financial contribution value update with every interaction. It aligns with ScopeLock's core principle of **pay at AC green** by making compensation completely transparent, predictable, and tied to measurable work.

**Key insight:** Traditional hourly or role-based pay creates friction (timesheets, role disputes, unclear value). Interaction-based pay makes compensation **automatic, fair, and motivating**.

---

## Core Principles

### 1. Pay Per Interaction, Not Per Hour
**Why:** Eliminates timesheet overhead. Every message to an AI citizen counts as measurable work. No debates about "billable hours" or "what counts as work."

**How it works:**
- Send message to Rafael → +1 interaction → earnings increase
- Send message to Inna → +1 interaction → earnings increase
- Your share = (your interactions / total team interactions) × 30% of job value

**Example:**
```
Job: $1,000 chatbot
Team: 100 total interactions
You: 20 interactions
Your earnings: (20/100) × $300 = $60
```

### 2. Real-Time Earnings Visibility
**Why:** Gamification requires immediate feedback. Seeing earnings increase with each message motivates continued contribution.

**How it works:**
- Top banner shows: "YOUR TOTAL POTENTIAL EARNINGS: $342.50"
- Each job card shows: "Earning at job completion: $120.00" (updates live)
- Every message sent → UI updates immediately

**Psychological effect:** Creates positive reinforcement loop. "I just sent a message and earned $2.50" → "I want to send more messages."

### 3. Dual Revenue Streams: Jobs + Missions
**Why:** Not all valuable work is billable client work. Proposals, recruitment, social media all create value but aren't tied to specific jobs.

**How it works:**
- **Jobs** = Client work (e.g., "Build chatbot - $1,500") → 30% team pool split by interactions
- **Missions** = Internal work (e.g., "Write proposal - $1") → Fixed payment per completion
- Mission fund (5% of all jobs) finances mission completions

**Example:**
```
Jobs in progress:
├─ Chatbot ($1,500) - Your 20 interactions → $90 potential
├─ Landing page ($800) - Your 5 interactions → $30 potential
└─ Dashboard ($1,200) - Your 10 interactions → $72 potential

Completed missions:
├─ Wrote 3 proposals → $3 earned
└─ Posted on X → $2 earned

TOTAL POTENTIAL EARNINGS: $197.00
```

### 4. Payment at Cash Receipt (Not AC Green)
**Why:** ScopeLock principle "pay at AC green" means client pays when tests pass, but **team gets paid when WE receive the money**. Protects company cash flow.

**How it works:**
- AC green → Client approves
- Client releases payment → Upwork processes (2-5 days)
- **Cash hits our account → Team gets paid**

**Timeline:**
- Day 0: AC green, client approves
- Day 2-5: Upwork releases funds to us
- Day 5-7: **Team members receive payment**

### 5. Flexible Roles (Anyone Can Do Anything)
**Why:** Dedicated roles create bottlenecks. "Only Emma writes proposals" → Emma gets sick → proposals stop. Flexible system lets anyone contribute anywhere.

**How it works:**
- No role restrictions on jobs or missions
- Anyone can claim "Write proposal" mission
- Anyone can work on any job
- Earnings follow contribution, not title

---

## Risk Factors & Mitigation

### Risk 1: Interaction Gaming ("Spam messages to boost earnings")
**Mitigation:**
- Sofia's QA role includes reviewing interaction quality
- NLR can adjust/remove interactions that are clearly spam
- If abuse detected → manual adjustment before payment
- Future: Add quality score multiplier (low-quality messages count less)

**Detection:**
- Message with no actual work: "hi" "test" "checking"
- Duplicate messages with no new value
- Messages sent but no code changes, no docs updated

**Response:**
- First offense: Warning + earnings adjustment
- Repeat offense: Removal from project

### Risk 2: Mission Fund Exhaustion ("Too many missions, not enough jobs")
**Mitigation:**
- Mission fund rolls over between jobs (if surplus)
- Mission availability capped: Only 5 missions active at once
- High-value missions ($10+) require manual approval
- Monitor fund balance weekly

**Example:**
```
Current mission fund: $50
Available missions:
├─ Write proposal ($1) ✅ Available
├─ Post on X ($2) ✅ Available
├─ Recruit member ($10) ⚠️ Requires approval (would leave $37)
```

### Risk 3: Unclear Job Scope ("Which interactions count toward which job?")
**Mitigation:**
- Each job has dedicated chat thread in Mission Deck
- Messages sent in Job A's thread → count toward Job A
- Messages sent in general chat → don't count toward any job
- UI makes it obvious: "You're in: Build Chatbot - TherapyKin"

**Implementation:**
- Left panel: Job cards
- Click job card → opens dedicated chat
- Chat header shows: "Build Chatbot - TherapyKin ($1,500)"
- All messages in this chat count toward this job

### Risk 4: Payment Disputes ("I had 30 interactions, system shows 25")
**Mitigation:**
- Audit log: Every interaction stored with timestamp
- Member can view: "My interactions history" (sortable, filterable)
- Dispute process: Screenshot + GitHub issue → NLR reviews
- FalkorDB stores all U4_Event nodes (immutable history)

**Transparency:**
- Member sees: "25 interactions" (clickable)
- Click → Shows list of all 25 messages with timestamps
- "Message to Rafael at 2025-11-07 14:23:15 UTC"
- Each message links to actual chat history

### Risk 5: First-Week Confusion ("I don't understand the new system")
**Mitigation:**
- Launch with 1-week trial (earnings shown but not paid)
- "Practice mode" banner: "This is practice mode - earnings are simulated"
- Team training session: NLR walks through system
- FAQ doc: "How do I earn money?" "When do I get paid?"

**Onboarding flow:**
1. New system announced in Telegram (Emma sends)
2. Practice week: Interact normally, see simulated earnings
3. Week-end review: Check your earnings, ask questions
4. Week 2: Real earnings start

---

## Success Criteria

### Business Outcomes (Week 1)
- ✅ All 4 team members understand new system (verified via quiz/interview)
- ✅ At least 3 jobs tracked with interaction counts
- ✅ At least 5 missions completed
- ✅ Zero payment disputes

### Business Outcomes (Month 1)
- ✅ 10+ jobs completed under new system
- ✅ Average 50+ interactions per job
- ✅ Team members report increased motivation (survey ≥4/5 avg)
- ✅ Proposal writing time reduced 30% (anyone can write, not just Emma)

### Technical Milestones
- ✅ Real-time earnings updates (<500ms latency)
- ✅ 100% interaction tracking accuracy (audit vs actual)
- ✅ Zero data loss (all interactions persisted to FalkorDB)
- ✅ Mobile-responsive UI (works on phone)

---

## Open Questions (Resolved Before Implementation)

### Q1: Mission fund rollover
**Decision:** Surplus rolls over to next job. If balance exceeds $200, excess distributed to team proportionally.

**Rationale:** Encourages mission completion without fear of "wasting" fund. Cap prevents fund hoarding.

### Q2: Minimum interaction threshold
**Decision:** No minimum for jobs. For missions: Must have 5+ interactions on ANY job to claim missions.

**Rationale:** Prevents drive-by mission claiming. Ensures claimant is active contributor.

### Q3: Mission claiming mechanism
**Decision:** One person per mission, first-come-first-served. 24-hour claim expiry if not completed.

**Rationale:** Prevents duplicate work. Expiry prevents hoarding uncompleted missions.

### Q4: Historical data
**Decision:** Start fresh. No backfill of historical interactions.

**Rationale:** Too complex to estimate past interactions accurately. Clean slate avoids disputes.

### Q5: Interaction weighting (future consideration)
**Question:** Should different actions count differently? (e.g., deployment = 5 interactions, message = 1)

**Decision:** Phase 1 = all messages count equally. Phase 2 (after 1 month data) = consider weighting.

**Rationale:** Simplicity first. Gather data before optimizing.

---

## Alignment with ScopeLock First Principles

### Event-Native, Membrane-First ✅
- Every interaction is a `U4_Event` node in FalkorDB
- Links: `(Event)-[:U4_ABOUT]->(Work_Item {work_type: 'job'})`
- No hidden state: All earnings calculable from event graph

### Law at L4 ✅
- Compensation policy stored as `policy_ref` on job nodes
- Schema enforces: `teamPool = value × 0.30`, `missionFund = value × 0.05`
- Cannot create job without compensation breakdown

### Build-Time Proof, Static Runtime ✅
- Earnings calculations happen on interaction (not on page load)
- Results cached in member earnings object
- UI reads cached values (no real-time calculation loops)

### Fail-Loud ✅
- Interaction count mismatch → Error logged, alert sent
- Mission fund insufficient → Block mission claiming with clear error
- Payment trigger without cash receipt → Fail with "Cash not received" error

### Quote-Before-Inject ✅
- Mission fund balance checked before mission creation
- Team pool calculated before job creation
- Earnings update operation budgeted (max 100ms compute)

### Evidence > Prose ✅
- "I earned $342" → Links to interaction history (proof)
- "Job completed" → Links to AC green proof page
- "Mission claimed" → Links to claim timestamp and completion proof

---

## Non-Negotiable Constraints

1. **No hourly tracking:** System must never ask "how many hours did you work?" Must be 100% interaction-based.

2. **Real-time visibility:** Earnings update must happen immediately when message sent (<500ms UI update).

3. **Zero manual calculation:** No spreadsheets, no manual earnings tallying. 100% automated.

4. **Audit trail:** Every interaction and earnings change must be traceable in FalkorDB.

5. **Mobile-first UI:** System must work on phone (team members work on mobile often).

---

## Related Documentation

- `/docs/missions/mission-deck/PATTERN.md` - Original Mission Deck principles
- `/docs/core/delivery_model.md` - ScopeLock "pay at AC green" methodology
- `/docs/mission-compensation-system.md` - High-level compensation overview (source doc)

---

## Next Steps

1. **Inna** creates remaining 5 documentation levels:
   - AC.md (acceptance criteria)
   - VALIDATION.md (test specs)
   - MECHANISM.md (architecture & data models)
   - ALGORITHM.md (implementation steps)
   - GUIDE.md (deployment & setup)

2. **Rafael** implements backend after spec complete

3. **Developer** implements frontend after spec complete

4. **Sofia** creates test suite after VALIDATION complete
