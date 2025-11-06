# Handoff System - Technical Specification

**Version:** 1.0
**Created:** 2025-11-06
**Owner:** Emma (Scout) + Inna (Specifier)
**Purpose:** Complete specification for automatic task handoffs with AI-written contextual briefs

---

## Executive Summary

**What:** When a task is marked complete, automatically activate the next task and send the next person a contextual handoff brief written by an AI citizen.

**Why:** Eliminates manual handoffs. Next person immediately knows what's ready for them with full context.

**How:** Task completion → Query graph for dependents → Activate next tasks → AI citizen writes handoff brief → Send via Telegram with buttons

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  TASK COMPLETION TRIGGER                                    │
│  • Button click: "Complete" on task                         │
│  • OR: Manual graph update (fallback)                       │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  HANDOFF ENGINE                                             │
│  • Python script: /automation/handoff_engine.py            │
│  • Flow:                                                    │
│    1. Mark task complete in graph                           │
│    2. Query for dependent tasks                             │
│    3. Check if all blockers resolved                        │
│    4. Activate ready tasks (waiting → todo)                 │
│    5. For each activated task:                              │
│       - Select appropriate AI citizen                       │
│       - Generate contextual handoff brief                   │
│       - Send to assignee with buttons                       │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  DEPENDENCY RESOLVER                                        │
│  • Query: Find tasks that depend on completed task         │
│  • Query: Check if all blocking dependencies resolved      │
│  • Action: Activate tasks with no remaining blockers       │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  AI CITIZEN HANDOFF WRITER                                  │
│  • Claude Code CLI: contextual brief per citizen           │
│  • Emma: Writes for proposal handoffs                      │
│  • Maya: Writes for client-facing handoffs                 │
│  • Rafael: Writes for technical implementation handoffs    │
│  • Sofia: Writes for QA handoffs                           │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  TELEGRAM BOT                                               │
│  • Send handoff brief to assignee's personal DM            │
│  • Include action buttons (Start, Complete, Blocked)       │
│  • Format with HTML (bold, links, code blocks)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Completion Detection

### Trigger 1: Button Click

**Button:** "Complete" on task notification

**Flow:**
```python
@bot.callback_query_handler(func=lambda call: call.data.startswith("complete_"))
async def handle_complete_button(call):
    task_id = call.data.split("_")[1]

    # 1. Mark task complete
    completed_task = mark_task_complete(task_id)

    # 2. Reply to button click
    await bot.answer_callback_query(
        call.id,
        text=f"✅ Marked complete: {completed_task.name}"
    )

    # 3. Trigger handoff engine
    await handoff_engine.process_completion(task_id)
```

---

### Trigger 2: Manual Graph Update (Fallback)

**Use case:** Human manually marks task complete in SYNC.md or directly in graph

**Detection:** Periodic polling or event listener (future: L2 Stimulus Collector)

**Flow:**
```python
# Cron: Every 15 minutes, check for newly completed tasks
# (This is a fallback - buttons are primary mechanism)

@cron.schedule("*/15 * * * *")
async def detect_manual_completions():
    # Query for tasks marked complete in last 15 minutes
    new_completions = graph.execute("""
        MATCH (task:U4_Work_Item)
        WHERE task.state = 'complete'
          AND task.completed_at > datetime() - duration({minutes: 15})
          AND NOT exists((task)-[:HANDOFF_PROCESSED]->())
        RETURN task.id AS task_id
    """)

    for completion in new_completions:
        # Process handoff
        await handoff_engine.process_completion(completion.task_id)

        # Mark as processed (avoid duplicate handoffs)
        graph.execute(f"""
            MATCH (task:U4_Work_Item {{id: {completion.task_id}}})
            CREATE (task)-[:HANDOFF_PROCESSED {{timestamp: datetime()}}]->()
        """)
```

---

## Dependent Task Activation

### Query: Find Dependent Tasks

**Cypher:**
```cypher
// Task just completed
MATCH (completed:U4_Work_Item {id: $task_id})

// Find tasks that depend on this completed task
MATCH (completed)<-[:U4_DEPENDS_ON]-(dependent:U4_Work_Item)
WHERE dependent.state = 'waiting'

RETURN dependent.id AS task_id,
       dependent.name AS name,
       dependent.assignee_ref AS assignee
```

**Returns:** List of tasks waiting on the completed task

---

### Query: Check All Dependencies Resolved

**Cypher:**
```cypher
// For each dependent task, check if ALL blocking dependencies are complete
MATCH (dependent:U4_Work_Item {id: $dependent_task_id})

// Get all blocking dependencies
MATCH (dependent)-[:U4_DEPENDS_ON {criticality: 'blocking'}]->(blocker:U4_Work_Item)

// Check if all are complete
WITH dependent, collect(blocker.state) AS blocker_states
WHERE all(state IN blocker_states WHERE state = 'complete')

RETURN dependent.id AS ready_task_id
```

**Returns:** Tasks that are ready to activate (all blockers resolved)

---

### Action: Activate Ready Tasks

**Cypher:**
```cypher
// Activate task (waiting → todo)
MATCH (task:U4_Work_Item {id: $task_id})
WHERE task.state = 'waiting'
SET task.state = 'todo',
    task.activated_at = datetime()
RETURN task.id AS activated_task_id,
       task.name AS name,
       task.assignee_ref AS assignee
```

**Effect:** Task becomes active and appears in assignee's morning brief

---

## AI Citizen Selection for Handoffs

### Selection Logic

**Rule:** Select AI citizen based on next task's work type and context

| Next Task Work Type | AI Citizen | Why |
|---------------------|------------|-----|
| `specification` | Inna | Spec writer - provides guidance on documentation structure |
| `implementation` | Rafael | Code generator - provides technical implementation guidance |
| `qa` | Sofia | QA expert - provides testing checklist and verification steps |
| `delivery` | Maya | Client success - provides client communication context |
| `review` | Emma | Scout - provides context on why this matters (proposal review) |
| `bug_fix` | Rafael | Code fixer - provides debugging guidance |
| `clarification` | Inna | Spec clarifier - provides context on spec decisions |

---

## Handoff Brief Templates

### Template 1: Spec Writing Handoff (Inna → Reanance)

**Trigger:** Job won, spec writing task activated

**Prompt to Inna:**
```
You are Inna, ScopeLock's Specifier. Write a handoff brief for Reanance.

Context:
- Job won: {job_title}
- Client: {client_name}
- Budget: {budget}
- Proposal: {proposal_summary}
- Deadline: {deadline}

Write a handoff brief with this structure:

📨 Ready to spec: Mission #{mission_id}

Congrats! We won this job. Here's what you're building:

**Mission:** {mission_name}
**Client:** {client_name} ({client_type: process-skeptical/process-oriented})
**Budget:** {budget}
**Deadline:** {deadline}

**Proposal Summary:**
{2-3 sentence summary of what we promised}

**Your Task:**
Write complete 6-level documentation:
1. PATTERN.md - Core ScopeLock principles for this mission
2. AC.md - Acceptance criteria (functional + non-functional + verification)
3. VALIDATION.md - Test specifications
4. MECHANISM.md - Architecture and tech stack
5. ALGORITHM.md - Implementation steps
6. GUIDE.md - Setup and deployment guide

**Key Context:**
{Why this mission matters, any special considerations, client expectations}

**Next Steps:**
1. Read proposal: /citizens/emma/proposals/{proposal_file}
2. Start with PATTERN.md (core principles)
3. Lock scope via AC.md before implementation begins

Let me know if you need clarification on requirements.

—Inna (Specifier)

Keep it clear and actionable. Focus on what Reanance needs to know to start.
```

**Expected Output:** Contextual brief explaining the mission and spec requirements

---

### Template 2: Implementation Handoff (Inna → Rafael → Kara)

**Trigger:** Spec complete, implementation task activated

**Prompt to Rafael:**
```
You are Rafael, ScopeLock's Guide. Write a handoff brief for Kara.

Context:
- Mission: {mission_name}
- Spec complete: {spec_completion_date}
- Documentation path: /docs/missions/{mission_slug}/
- Key files:
  - AC.md: {ac_summary}
  - MECHANISM.md: {tech_stack}
  - ALGORITHM.md: {implementation_approach}

Write a handoff brief with this structure:

📨 Ready to implement: Mission #{mission_id}

Reanance completed the spec. Key implementation notes:

**Mission:** {mission_name}
**Tech Stack:** {frontend} + {backend} + {database}
**Deployment:** {deployment_platform}
**Deadline:** {deadline}

**What to Build:**
{2-3 bullet points from AC.md functional criteria}

**Architecture:**
{1-2 sentences from MECHANISM.md about overall approach}

**Implementation Steps:**
{Reference to ALGORITHM.md sections}

**I've generated the complete implementation:**
Path: /citizens/rafael/implementations/{mission_slug}/

**Next Steps:**
1. Review my generated code: cd /citizens/rafael/implementations/{mission_slug}/
2. Test locally: {test_command from GUIDE.md}
3. Deploy to {platform}: {deploy_command from GUIDE.md}

Questions? Ask me anything about the implementation.

—Rafael (Builder)

Keep it technical and actionable. Provide exact paths and commands.
```

**Expected Output:** Technical handoff with code paths and deployment commands

---

### Template 3: QA Handoff (Rafael → Sofia → Bigbosexf)

**Trigger:** Deployment complete, QA task activated

**Prompt to Sofia:**
```
You are Sofia, ScopeLock's Checker. Write a handoff brief for Bigbosexf.

Context:
- Mission: {mission_name}
- Deployed: {deployment_url}
- DoD checklist: /docs/missions/{mission_slug}/DOD.md
- Acceptance tests: {test_command}
- Performance thresholds: {performance_criteria from AC.md}

Write a handoff brief with this structure:

📨 Ready for QA: Mission #{mission_id}

Kara deployed to production. Time to verify quality.

**Mission:** {mission_name}
**Live URL:** {deployment_url}
**Deadline:** {deadline}

**DoD Checklist:**
{Top 5 most critical items from DOD.md}

**Functional Tests:**
{List of key features to manually test}

**Performance Checks:**
{List of performance thresholds from AC.md NF criteria}

**Automated Tests:**
Run: {test_command}
Expected: All tests green

**What to Look For:**
{Common bug patterns for this type of mission}

**If Bugs Found:**
Click [🐛 Bugs Found] button and describe the issue.
I'll route to Kara for fixing.

**If All Pass:**
Click [✅ QA Pass] button to approve delivery.

—Sofia (Checker)

Keep it actionable. Provide exact URLs and test commands.
```

**Expected Output:** QA checklist with test commands and verification steps

---

### Template 4: Client Delivery Handoff (Sofia → Maya → Reanance)

**Trigger:** QA pass, delivery task activated

**Prompt to Maya:**
```
You are Maya, ScopeLock's Client Success Manager. Write a handoff brief for Reanance.

Context:
- Mission: {mission_name}
- Client: {client_name}
- QA passed: {qa_pass_date}
- Live URL: {deployment_url}
- Evidence Sprint: {demo_video_url or instructions}
- Credentials: {admin_credentials}

Write a handoff brief with this structure:

📨 Ready to deliver: Mission #{mission_id}

QA passed! Time to hand off to the client.

**Mission:** {mission_name}
**Client:** {client_name}
**Live URL:** {deployment_url}

**Delivery Checklist:**
- [ ] Evidence Sprint demo (90s video showing key features)
- [ ] Credentials handoff (admin login, API keys, etc.)
- [ ] Documentation handoff (setup guide, deployment docs)
- [ ] Support plan (1-week post-delivery support)

**Evidence Sprint Demo:**
{Script for 90s demo - what to show, what to emphasize}

**Credentials to Share:**
{List of credentials - admin login, database access, API keys, etc.}

**Client Communication Template:**
{Draft message to client announcing delivery}

**Client Context:**
{Client's expectations, communication style, any concerns raised during mission}

**Next Steps:**
1. Record Evidence Sprint demo
2. Send delivery message to client
3. Schedule handoff call (optional, if client requested)
4. Click [✅ Delivered] button when client confirms receipt

—Maya (Bridge)

Keep it client-focused. Emphasize smooth handoff and relationship.
```

**Expected Output:** Delivery checklist with client communication template

---

## Handoff Notification Format

### Message Structure

**Format:** HTML (Telegram-compatible)

**Template:**
```html
<b>{emoji} {Action}: Mission #{mission_id}</b>

{ai_citizen_contextual_brief}

<b>Next Steps:</b>
{numbered list of actions}

<b>Questions?</b>
{how to ask questions - mention AI citizen or human}

—{ai_citizen_name} ({ai_citizen_role})
```

**With buttons:**
```python
buttons = [
    [
        InlineKeyboardButton("▶️ Start", callback_data=f"start_{task_id}"),
        InlineKeyboardButton("✅ Complete", callback_data=f"complete_{task_id}")
    ],
    [
        InlineKeyboardButton("🚫 Blocked", callback_data=f"block_{task_id}"),
        InlineKeyboardButton("💬 Ask Question", callback_data=f"question_{task_id}")
    ],
    [
        InlineKeyboardButton("👁️ View Details", callback_data=f"view_{task_id}")
    ]
]
```

---

## Error Handling

### Error 1: No Dependent Tasks Found

**Symptoms:** Task completes, but no dependent tasks in graph

**Handling:**
```python
if len(dependent_tasks) == 0:
    logger.info(f"Task {task_id} has no dependents. Terminal task.")
    # No handoff needed - this is expected for final tasks
    # Example: Post-delivery follow-up has no next task
    return
```

**No alert needed** - this is normal for terminal tasks

---

### Error 2: Dependent Task Cannot Activate (Other Blockers Remain)

**Symptoms:** Task completes, but dependent still has other incomplete blockers

**Handling:**
```python
if not all_blockers_resolved(dependent_task_id):
    logger.info(f"Task {dependent_task_id} still blocked by other tasks.")
    # Keep in 'waiting' state
    # No handoff brief yet (will trigger when last blocker completes)
    return
```

**No alert needed** - this is expected behavior

---

### Error 3: AI Citizen Brief Generation Fails

**Symptoms:** Claude Code timeout, API error

**Fallback:**
```python
try:
    brief = generate_ai_brief(ai_citizen, context)
except Exception as e:
    logger.error(f"AI brief generation failed: {e}")

    # Use template brief (no AI context)
    brief = f"""
📨 Ready: {task_name}

Previous task complete. You can start working on this now.

Task: {task_name}
Mission: {mission_name}
Deadline: {deadline}

Next steps:
1. Review task details
2. Start work
3. Click [Complete] when done

—Automated Handoff (AI unavailable)
"""

    # Alert lead
    await send_alert_to_lead(f"AI handoff brief failed for task {task_id}")
```

**Alert sent:** Yes (lead should investigate)

---

### Error 4: Assignee Not Found

**Symptoms:** Task has no assignee_ref or assignee not in system

**Fallback:**
```python
if not assignee:
    logger.error(f"Task {task_id} has no assignee. Cannot send handoff.")

    # Alert lead
    await send_alert_to_lead(
        f"🚨 Task {task_id} activated but has no assignee. Please assign manually."
    )

    # Activate task anyway (can be picked up manually)
    activate_task(task_id)
    return
```

**Alert sent:** Yes (critical - task orphaned)

---

## Success Metrics

### Handoff Latency
- **Target:** <2 minutes from completion to handoff brief delivered
- **Measurement:** `handoff_sent_at - task_completed_at`
- **Failure threshold:** >5 minutes → check bottlenecks (graph query? AI generation? Telegram send?)

### Brief Completeness
- **Target:** 100% of handoff briefs contain context (not just task name)
- **Measurement:** Check for AI citizen signature and >100 char brief
- **Failure threshold:** <90% contextual → review AI prompts

### Activation Accuracy
- **Target:** 100% of ready tasks activated (no stuck tasks)
- **Measurement:** Query for tasks in 'waiting' state with all blockers complete
- **Failure threshold:** >0 stuck tasks → urgent bug fix

### Button Engagement
- **Target:** >70% of tasks use [Start] button (vs manual state change)
- **Measurement:** Count button clicks / task activations
- **Failure threshold:** <50% → simplify button interface

---

## Configuration

### AI Citizen Prompt Templates

**File:** `/automation/handoff_prompts.py`

```python
HANDOFF_PROMPTS = {
    "specification": {
        "citizen": "inna",
        "template": "handoff_spec_writing.txt"
    },
    "implementation": {
        "citizen": "rafael",
        "template": "handoff_implementation.txt"
    },
    "qa": {
        "citizen": "sofia",
        "template": "handoff_qa.txt"
    },
    "delivery": {
        "citizen": "maya",
        "template": "handoff_delivery.txt"
    },
    "review": {
        "citizen": "emma",
        "template": "handoff_review.txt"
    }
}
```

### Handoff Timing

**File:** `/automation/config.py`

```python
HANDOFF_CONFIG = {
    "activation_delay_seconds": 5,  # Wait 5s before activating (de-bounce)
    "max_parallel_handoffs": 3,  # Max 3 handoffs sent simultaneously
    "ai_brief_timeout_seconds": 30,  # Timeout for AI brief generation
    "fallback_to_template_after": 30,  # Use template if AI fails after 30s
}
```

---

## Testing Strategy

### Unit Tests

**Test 1: Dependent task activation**
```python
def test_activate_dependent_task():
    # Create task A and task B (B depends on A)
    # Mark A complete
    # Assert B activated (waiting → todo)
```

**Test 2: Multiple blockers**
```python
def test_multiple_blockers():
    # Create task C depending on A and B
    # Mark A complete
    # Assert C still waiting (B not complete)
    # Mark B complete
    # Assert C activated
```

**Test 3: AI citizen selection**
```python
def test_citizen_selection():
    assert select_citizen("specification") == "inna"
    assert select_citizen("implementation") == "rafael"
    assert select_citizen("qa") == "sofia"
```

### Integration Tests

**Test 4: Full handoff flow**
```python
def test_full_handoff():
    # Create mission with 3 tasks
    # Complete task 1
    # Assert task 2 activated
    # Assert handoff brief sent to assignee
    # Assert AI citizen signature present
```

**Test 5: Revision loop**
```python
def test_revision_loop():
    # Create proposal review task
    # Click "Needs Revision"
    # Assert revision task created
    # Assert review task blocked
    # Complete revision
    # Assert review task unblocked
    # Assert handoff brief sent to reviewer
```

### Manual Tests

**Test 6: End-to-end handoff**
1. Create test mission
2. Complete spec writing task
3. Verify implementation task activated
4. Verify Kara receives handoff brief with Rafael's guidance
5. Click [Start] button
6. Verify task state updates

---

## Next Steps

**For Inna (Complete Documentation):**
Create 6-level docs from this spec (same structure as morning brief and task pipeline).

**For Rafael (Implementation):**
Once Inna's docs complete:
1. Generate `handoff_engine.py` from ALGORITHM.md
2. Generate AI citizen prompt templates from MECHANISM.md
3. Generate dependency resolver from ALGORITHM.md
4. Generate tests from VALIDATION.md

**For Alexis (Tracking):**
Add to roadmap:
- Milestone: Handoff System
- Target: 2025-11-20
- Success criteria: <2min latency, 100% activation accuracy

---

**Emma (Scout)**
ScopeLock — Automation Specifications
2025-11-06
