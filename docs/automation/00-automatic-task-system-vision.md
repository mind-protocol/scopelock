# Automatic Task System - Strategic Vision

**Version:** 1.0
**Created:** 2025-11-05
**Owner:** Alexis (Strategy) + Emma (Specification) + Inna (Documentation)
**Purpose:** High-level architecture for automatic ScopeLock task management

---

## Executive Summary

**Problem:** Team members need to know what to do each day without manual coordination. Task handoffs are currently manual and slow.

**Solution:** Automatic task system using Mind Protocol v2 graph architecture with morning briefs, button-driven workflows, and auto-task creation.

**Key Benefits:**
- **Zero coordination overhead:** Morning briefs tell each person exactly what to do
- **Automatic handoffs:** Completing a task triggers brief for next person
- **Full audit trail:** Graph stores every task, dependency, and state change
- **Scalable:** Works for 3 people or 30 people

---

## Core Principles

### 1. Event-Driven (with Cron Bootstrap)

**Current state:** Cron triggers (anti-pattern, temporary)
**Future state:** L2 Stimulus Collector (proper event-driven)

**Why cron for now:**
- Fast to implement
- Proven technology
- Easy migration path to event-driven later

**Cron triggers:**
- 8:00 AM WAT: Morning briefs
- Every 2h: Overdue task checks
- Every 4h: Mission status sync
- 7 days after delivery: Follow-up tasks

### 2. AI Citizens Write Briefs, Not Dumb Task Lists

**Wrong approach:**
```
TODO for Bigbosexf:
- Review proposal #123
- QA test Mission #47
```

**Right approach:**
```
🌅 Good morning, Bigbosexf!

📊 ACTIVE MISSIONS (2)
• Mission #47: AI Chatbot - QA phase (you're testing)
  Client is waiting, expect delivery today.

🔴 URGENT TODAY (due in <8h)
• Review Emma's proposal for Job #123 ($800, 4h deadline)
  Emma matched this to our Terminal Velocity portfolio.

💡 CONTEXT
Mission #47: Client has been responsive. Sofia found no bugs
in her pre-check, but verify the OTP flow works on mobile.

—Emma (Scout)
```

**Why this matters:**
- Context explains WHY task matters
- AI citizen's voice (Emma, Maya, Rafael) provides perspective
- Humans don't need to remember mission details—brief includes everything

### 3. Button-Driven State Transitions

**Every task notification includes action buttons:**

```
📋 Review Emma's proposal for Job #123
Priority: HIGH | Due: 4h

[✅ Approve] [❌ Needs Revision] [👁️ View File]
```

**Button clicks trigger:**
1. Graph update (task state change)
2. Dependent task creation (if applicable)
3. Handoff brief to next person (if applicable)
4. Audit trail (who clicked, when, which button)

**Why buttons matter:**
- Zero friction (one tap vs typing command)
- Predictable actions (no ambiguity)
- Mobile-friendly (works on phone)
- Audit trail (graph stores every click)

### 4. Mission Pipeline as State Machine

**Every job follows predictable pipeline:**

```
LEAD_FOUND → PROPOSAL_DRAFT → PROPOSAL_REVIEW → PROPOSAL_SENT
  ↓
JOB_WON → SPEC_WRITING → SPEC_REVIEW → IMPLEMENTATION
  ↓
DEPLOYMENT → QA_TESTING → QA_PASSED → CLIENT_DELIVERY → COMPLETE
```

**With revision loops:**
- Proposal: Draft → Review → [Revision] → Review → Approve
- Bugs: Deploy → Test → [Fix] → Deploy → Test → Pass
- Spec: Write → Implement → [Clarify] → Implement

**Why state machine:**
- Predictable workflows (everyone knows the flow)
- Automatic task creation (pipeline creates all tasks upfront)
- Easy to visualize (graph shows mission progress)
- Handles failures gracefully (revision loops)

---

## System Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────┐
│                    CRON TRIGGERS                        │
│  • 8:00 AM: Morning briefs                             │
│  • Every 2h: Check overdue tasks                       │
│  • Every 4h: Sync mission status                       │
│  • 7 days: Post-delivery follow-up                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│              TASK AUTOMATION ENGINE                     │
│  • Query graph for context (per person, per mission)   │
│  • AI citizens write briefs (Emma/Maya/Rafael)         │
│  • Detect completions → trigger next tasks             │
│  • Handle state transitions → update graph             │
│  • Create dependent tasks → notify assignees           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│                 FALKORDB GRAPH                          │
│  Nodes: U4_Work_Item, U4_Agent, U4_Event, U4_Mission  │
│  Links: U4_ASSIGNED_TO, U4_DEPENDS_ON, U4_BLOCKED_BY  │
│                                                         │
│  TRUTH: Graph is single source of truth                │
│  - All tasks stored here                               │
│  - All dependencies encoded                            │
│  - All state changes logged                            │
│  - All button clicks recorded                          │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│              TELEGRAM BOT INTERFACE                     │
│  • Send morning briefs (personal DMs)                  │
│  • Send task notifications (with buttons)              │
│  • Receive button clicks → call automation engine      │
│  • Send handoff briefs (AI-written, contextual)        │
└─────────────────────────────────────────────────────────┘
```

---

## Data Model (Mind Protocol v2 Schema)

### Nodes

**U4_Work_Item** (Tasks)
- Required: `level`, `priority`, `scope_ref`, `state`, `work_type`
- Optional: `acceptance_criteria`, `assignee_ref`, `due_date`
- ScopeLock-specific: `mission_ref`, `pipeline_stage`

**U4_Mission** (Projects)
- Required: `name`, `client`, `budget`, `state`
- Optional: `upwork_job_url`, `start_date`, `delivery_date`
- Links to: U4_Work_Item nodes (all tasks for this mission)

**U4_Agent** (Team Members)
- Required: `name`, `role`, `telegram_id`
- Optional: `timezone`, `availability`
- Examples: Bigbosexf (Hunter), Reanance (Specifier), Kara (Builder)

**U4_Event** (Audit Trail)
- Required: `timestamp`, `event_type`, `actor`
- Optional: `task_ref`, `mission_ref`, `details`
- Examples: "button_click", "task_complete", "handoff_sent"

### Links

**U4_ASSIGNED_TO** (Task → Agent)
- Who owns this task
- Optional: `assignment_date`, `effort_estimate`

**U4_DEPENDS_ON** (Task → Task)
- Task A cannot start until Task B completes
- Required: `criticality` (blocking, preferred, optional)

**U4_BLOCKED_BY** (Task → Issue/Task)
- Task is blocked by external factor
- Required: `blocking_reason`, `severity`

**U4_TRIGGERED_BY** (Task → Event)
- Which button click or automation event created this task
- Audit trail for task creation

---

## Workflow Components

### 1. Morning Brief System

**Purpose:** Tell each person exactly what to do today, with full context

**Trigger:** Cron at 8:00 AM Nigeria time (WAT = UTC+1)

**Flow:**
```
Cron triggers → Automation Engine
  ↓
For each team member (Bigbosexf, Reanance, Kara):
  ↓
Query graph:
  - Active tasks (state: todo, doing)
  - Blocked tasks
  - Overdue tasks
  - Today's deadlines
  - Yesterday's completions
  - Mission status updates
  ↓
Appropriate AI citizen writes brief:
  - Bigbosexf → Emma (Hunter perspective, lead context)
  - Reanance → Maya (Client context, relationship focus)
  - Kara → Rafael (Technical focus, code generation)
  ↓
Send to personal Telegram channel:
  - @Bigbosefx2 private DM
  - @ReananceGlobal private DM
  - @kara339 private DM
```

**Brief Structure:**
```
🌅 Good morning, [Name]!

📊 ACTIVE MISSIONS (X)
• Mission #N: [Title] - [Stage] ([Your role])

🔴 URGENT TODAY (due in <8h)
• [Task] ([Deadline])

🟡 THIS WEEK
• [Task]

🚫 BLOCKED
• [Task] - [Blocker reason]

✅ YESTERDAY
• [Completions]

💡 CONTEXT
[AI citizen provides mission context, explains priorities]

—[AI Citizen Name] ([Role])
```

### 2. Button Interface

**Purpose:** One-tap task actions (no typing, no ambiguity)

**Button Types:**

**Approval buttons:**
- ✅ Approve — Marks task complete, creates next task
- ❌ Needs Revision — Creates revision task for original author

**Status buttons:**
- ✅ Complete — Marks task done, triggers handoff
- 🚫 Blocked — Prompts for blocker reason, notifies lead
- 💬 Ask Question — Creates question task for spec author

**QA buttons:**
- ✅ QA Pass — Marks deployment ready for client delivery
- 🐛 Bugs Found — Creates bug fix task, blocks delivery

**Mission buttons:**
- ✅ Job Won — Creates entire mission pipeline
- 🚫 Job Lost — Archives proposal, updates stats

**Example Task Card:**
```
📋 Review Emma's proposal for Job #123
Priority: HIGH | Due: 4h
File: /citizens/emma/proposals/2025-11-05_job-123.txt

[✅ Approve] [❌ Needs Revision] [👁️ View File]
```

### 3. Auto-Task Creation

**Purpose:** When mission won, create entire pipeline automatically

**Example:** Bigbosexf clicks "Job Won" button

**Automation creates:**
```python
# U4_Mission node
create_mission(
    name="Mission #47: AI Chatbot",
    client="TechCorp",
    budget=800,
    upwork_url="...",
    state="active"
)

# U4_Work_Item nodes (pipeline tasks)
tasks = [
    {
        "name": "Write spec for Mission #47",
        "assign": "reanance",
        "state": "todo",  # Active immediately
        "pipeline_stage": "SPEC_WRITING",
        "blocks": ["implement_47"]
    },
    {
        "name": "Implement Mission #47",
        "assign": "kara",
        "state": "waiting",  # Blocked until spec done
        "pipeline_stage": "IMPLEMENTATION",
        "depends_on": "spec_47",
        "blocks": ["qa_47"]
    },
    {
        "name": "QA test Mission #47",
        "assign": "bigbosexf",
        "state": "waiting",  # Blocked until implementation done
        "pipeline_stage": "QA_TESTING",
        "depends_on": "implement_47"
    }
]

# U4_DEPENDS_ON links (encode dependencies)
# U4_TRIGGERED_BY links (audit: "Job Won" button created these)

# Send notification to Reanance
send_telegram(
    chat_id="@ReananceGlobal",
    message="📨 New mission! Write spec for Mission #47..."
)
```

### 4. Handoff Brief System

**Purpose:** When task completes, AI citizen writes contextual brief for next person

**Example:** Reanance clicks "Complete" on spec task

**Automation flow:**
```
Detect completion → Query graph for dependent tasks
  ↓
Find: "Implement Mission #47" (state: waiting, depends_on: spec_47)
  ↓
Activate task (state: waiting → todo)
  ↓
Determine next assignee (Kara) → Use Rafael to write brief
  ↓
Rafael writes technical handoff:
  "📨 Ready to implement: Mission #47

   Reanance completed the spec. Key implementation notes:
   - Next.js 14 app router
   - OpenAI GPT-4 integration via API
   - Deploy to Vercel
   - Acceptance criteria: OTP signup flow works on mobile

   I've generated the complete implementation. Review at:
   /citizens/rafael/implementations/mission-47/

   Let me know if you need clarification on any part.

   —Rafael (Builder)"
  ↓
Send to Kara's Telegram with buttons:
  [✅ Complete] [🚫 Blocked] [💬 Ask Question]
```

### 5. Revision Loop Handling

**Purpose:** Handle back-and-forth workflows gracefully

**Example: Proposal Revision Loop**
```
Emma drafts proposal → Creates "Review proposal #123" for Bigbosexf
  ↓
Bigbosexf clicks [❌ Needs Revision]
  ↓
Automation prompts: "What needs revision?"
  ↓
Bigbosexf types: "Budget too high, reduce to $600"
  ↓
Automation creates:
  - New task: "Revise proposal #123" (assign: Emma)
  - Original task state: "waiting" (blocked until revision done)
  - U4_BLOCKED_BY link with blocking_reason: "Budget too high..."
  ↓
Emma receives notification with revision request
  ↓
Emma revises → Clicks [✅ Complete]
  ↓
Automation:
  - Marks revision task complete
  - Removes blocker from original review task
  - Reactivates "Review proposal #123" for Bigbosexf
  ↓
Bigbosexf receives notification: "Revised proposal ready for review"
```

**Example: Bug Fix Loop**
```
Kara deploys → Creates "QA test Mission #47" for Bigbosexf
  ↓
Bigbosexf tests → Clicks [🐛 Bugs Found]
  ↓
Automation prompts: "Describe bugs found"
  ↓
Bigbosexf types: "OTP doesn't work on iPhone Safari"
  ↓
Automation creates:
  - New task: "Fix bugs in Mission #47" (assign: Kara, priority: high)
  - QA task state: "blocked" (can't complete until bugs fixed)
  - U4_BLOCKED_BY link with blocking_reason: "OTP doesn't work..."
  ↓
Kara receives notification with bug details
  ↓
Kara fixes → Redeploys → Clicks [✅ Complete]
  ↓
Automation:
  - Marks bug fix complete
  - Removes blocker from QA task
  - Reactivates "QA test Mission #47" for Bigbosexf
  ↓
Bigbosexf receives notification: "Bug fix deployed, please re-test"
```

---

## Migration Path (Cron → Event-Driven)

### Phase 1: Cron-Based (Current Plan)

**Implementation:**
- Cron triggers automation engine
- Automation engine queries graph
- AI citizens write briefs
- Telegram bot sends notifications

**Limitations:**
- Not real-time (waits for cron interval)
- Polling-based (inefficient)
- Hard-coded schedules

### Phase 2: Hybrid (Future)

**Add event triggers:**
- SYNC.md updates → detect "✅" markers → trigger handoff
- Git commits → detect "AC Green" tags → trigger QA
- Button clicks → immediate graph update → no polling

**Keep cron for:**
- Morning briefs (time-based, not event-based)
- Overdue checks (scheduled verification)

### Phase 3: Full L2 Stimulus Collector (Long-term)

**Replace cron entirely:**
- File operations → L2 Stimulus Collector
- Git commits → L2 Stimulus Collector
- SYNC updates → L2 Stimulus Collector
- Button clicks → L2 Stimulus Collector

**Benefits:**
- Real-time (no polling)
- Event-driven (proper architecture)
- Energy-based priority (important tasks surface automatically)
- Saturation gating (no notification spam)

**See:** `/home/mind-protocol/mindprotocol/docs/specs/v2/autonomy/architecture/l2_stimulus_collector.md`

---

## Success Metrics

### Team Efficiency
- **Time to task clarity:** <2 min (morning brief tells you exactly what to do)
- **Handoff latency:** <15 min (completion → next person notified)
- **Coordination overhead:** 0 messages (automation handles all handoffs)

### System Reliability
- **Morning brief delivery:** 100% (every day, 8:00 AM WAT)
- **Button action success:** >99% (graph updates reliably)
- **Task creation accuracy:** 100% (pipeline creates all needed tasks)

### Quality
- **Missed handoffs:** 0 (automation never forgets)
- **Task duplication:** 0 (graph enforces uniqueness)
- **Audit completeness:** 100% (every action logged)

---

## Risk Mitigation

### Risk: Cron Fails

**Mitigation:**
- Systemd timer + cron (redundancy)
- Health check endpoint (ping every hour)
- Telegram alert if morning brief doesn't send
- Manual fallback: SYNC.md still works

### Risk: Graph Becomes Inconsistent

**Mitigation:**
- Validation layer (checks required fields)
- Transaction semantics (all-or-nothing updates)
- Periodic audit script (finds orphaned tasks)
- Manual repair tools (fix graph issues)

### Risk: Button Spam

**Mitigation:**
- Debounce (ignore duplicate clicks within 5 seconds)
- Idempotency (clicking "Complete" twice doesn't create two tasks)
- Confirmation prompts (destructive actions ask "Are you sure?")

### Risk: AI Citizen Writes Bad Brief

**Mitigation:**
- Template validation (required sections)
- Fallback to last good brief (if AI fails)
- Human override (Nicolas can edit briefs manually)
- Feedback loop (team reports bad briefs → improve prompts)

---

## Next Steps

### For Emma (Specification)
Create `/docs/automation/01-morning-brief-spec.md`:
- Input: Graph context (tasks, missions, deadlines)
- Output: Formatted Telegram message with buttons
- AI citizen assignment logic (who writes for whom)
- Button definitions (what each button does)
- Error handling (what if graph query fails)

Create `/docs/automation/02-task-pipeline-spec.md`:
- Mission states and transitions
- Auto-task creation rules
- Dependency encoding (U4_DEPENDS_ON logic)
- Revision loop patterns

Create `/docs/automation/03-handoff-system-spec.md`:
- Completion detection
- Dependent task activation
- AI citizen handoff brief generation
- Telegram notification formatting

### For Inna (Complete Documentation)
For each feature, create 6-level docs:
- **PATTERN:** Core principle (e.g., "Event-driven task handoffs")
- **BEHAVIOR_SPEC:** What happens (e.g., "When spec completes...")
- **VALIDATION:** How to verify (e.g., "Check graph for new task")
- **MECHANISM:** How it works (e.g., "Cypher query + API call")
- **ALGORITHM:** Code-level steps
- **GUIDE:** How to use (e.g., "Click [Complete] button")

See: `/docs/missions/_template/` for structure

### For Rafael (Implementation)
Once Inna has complete 6-level docs:
- Generate Python automation engine
- Generate Telegram bot with button handlers
- Generate graph query/update functions
- Generate AI citizen brief writers
- Generate cron job definitions

**Do NOT implement before Inna's docs are complete.**

### For Alexis (Strategic Tracking)
Update `/citizens/alexis/ROADMAP.md`:
- Add "Phase 2: Automatic Task System" milestone
- Define success criteria (efficiency, reliability, quality)
- Track progress weekly

Update `/citizens/alexis/TODOS.md`:
- [ ] Review Emma's specifications (by 2025-11-08)
- [ ] Review Inna's documentation (by 2025-11-12)
- [ ] Approve Rafael's implementation plan (by 2025-11-15)
- [ ] Test system with 1 mission before rollout (by 2025-11-18)

---

## Questions for Nicolas

**Before proceeding, clarify:**

1. **Personal vs Group Chat?**
   - Morning briefs → Personal DMs or team channel?
   - Task notifications → Personal DMs or team channel?
   - Recommendation: Personal DMs (less noise, mobile-friendly)

2. **Telegram Bot Setup:**
   - Who creates the bot? (Nicolas or Rafael)
   - Single bot for all notifications or separate bots per citizen?
   - Recommendation: Single bot, different citizens sign messages

3. **Graph Database:**
   - Use existing FalkorDB instance or create new graph?
   - Where is FalkorDB hosted? (localhost, cloud)
   - Connection credentials stored where?

4. **Cron Permissions:**
   - Which user runs cron? (mind-protocol user, dedicated bot user)
   - WSL environment or native Linux?
   - Recommendation: Systemd timers (more reliable than cron)

5. **AI Citizen Integration:**
   - How does automation engine call AI citizens?
   - Direct Claude API calls or via Claude Code CLI?
   - Recommendation: Claude Code CLI (budget-friendly, uses subscription)

6. **Rollout Strategy:**
   - Test with 1 person first (Bigbosexf) or all 3 at once?
   - Parallel run (manual + automatic) for 1 week?
   - Recommendation: Bigbosexf only for 3 days, then full team

---

**This document is the strategic vision. Emma creates specs. Inna creates complete docs. Rafael implements. Let's build this systematically.**

—Alexis (Strategist)
ScopeLock — Strategic Operations & Business Management
