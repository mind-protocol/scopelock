# Morning Brief System - Technical Specification

**Version:** 1.0
**Created:** 2025-11-06
**Owner:** Emma (Scout) + Inna (Specifier)
**Purpose:** Complete specification for automatic daily morning briefs sent via Telegram

---

## Executive Summary

**What:** Every morning at 8:00 AM WAT, each team member receives a personalized brief written by an AI citizen, telling them exactly what to do today with full context.

**Why:** Eliminates daily coordination overhead. Team members wake up knowing their priorities without asking "what should I work on?"

**How:** Cron trigger → Query FalkorDB graph → AI citizen writes brief → Send via Telegram with action buttons

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CRON TRIGGER                                               │
│  • 8:00 AM WAT (UTC+1)                                      │
│  • Systemd timer: scopelock-morning-brief.timer            │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  MORNING BRIEF ENGINE                                       │
│  • Python script: /automation/morning_brief_engine.py      │
│  • For each team member:                                    │
│    1. Query graph for context                               │
│    2. Select appropriate AI citizen                         │
│    3. Generate brief content                                │
│    4. Format Telegram message with buttons                  │
│    5. Send to personal DM                                   │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  FALKORDB GRAPH                                             │
│  • Query: Get tasks for person (state: todo, doing)        │
│  • Query: Get mission context                               │
│  • Query: Get deadlines (today, this week)                  │
│  • Query: Get yesterday's completions                       │
│  • Query: Get blockers                                      │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  AI CITIZEN BRIEF WRITER                                    │
│  • Claude Code CLI: cd /scopelock && claude -p "..." --cont│
│  • Different citizen per person (Emma/Maya/Rafael)          │
│  • Contextual brief with personality                        │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  TELEGRAM BOT                                               │
│  • Send to personal DMs (not group chat)                    │
│  • HTML formatting (bold, links)                            │
│  • Inline buttons (for quick actions)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Input: Graph Queries

### Query 1: Active Tasks

**Cypher query:**
```cypher
MATCH (person:U4_Agent {telegram_id: $telegram_id})
      -[:U4_ASSIGNED_TO]-(task:U4_Work_Item)
WHERE task.state IN ['todo', 'doing']
RETURN task.name AS name,
       task.priority AS priority,
       task.due_date AS due,
       task.pipeline_stage AS stage,
       task.mission_ref AS mission
ORDER BY task.priority DESC, task.due_date ASC
LIMIT 10
```

**Returns:** List of tasks assigned to this person that are active

### Query 2: Mission Context

**Cypher query:**
```cypher
MATCH (task:U4_Work_Item {mission_ref: $mission_ref})
      -[:U4_PART_OF]-(mission:U4_Mission)
RETURN mission.name AS name,
       mission.client AS client,
       mission.budget AS budget,
       mission.delivery_date AS deadline,
       mission.state AS state
```

**Returns:** Mission details for context

### Query 3: Today's Deadlines

**Cypher query:**
```cypher
MATCH (person:U4_Agent {telegram_id: $telegram_id})
      -[:U4_ASSIGNED_TO]-(task:U4_Work_Item)
WHERE task.due_date <= datetime() + duration({hours: 8})
  AND task.state IN ['todo', 'doing']
RETURN task.name AS name,
       task.due_date AS due
ORDER BY task.due_date ASC
```

**Returns:** Tasks due in next 8 hours (urgent)

### Query 4: Yesterday's Completions

**Cypher query:**
```cypher
MATCH (person:U4_Agent {telegram_id: $telegram_id})
      -[:U4_ASSIGNED_TO]-(task:U4_Work_Item)
WHERE task.state = 'complete'
  AND task.completed_at >= datetime() - duration({hours: 24})
RETURN task.name AS name,
       task.completed_at AS when
ORDER BY task.completed_at DESC
LIMIT 5
```

**Returns:** Tasks completed in last 24 hours

### Query 5: Blocked Tasks

**Cypher query:**
```cypher
MATCH (person:U4_Agent {telegram_id: $telegram_id})
      -[:U4_ASSIGNED_TO]-(task:U4_Work_Item)
      -[:U4_BLOCKED_BY]-(blocker)
WHERE task.state = 'blocked'
RETURN task.name AS task_name,
       blocker.blocking_reason AS reason,
       blocker.severity AS severity
```

**Returns:** Tasks blocked and why

---

## AI Citizen Assignment Logic

**Rule:** Different AI citizens write briefs for different people based on role alignment.

### Assignment Table

| Team Member | Telegram ID | AI Citizen | Why |
|-------------|-------------|------------|-----|
| Bigbosexf | @Bigbosefx2 | Emma | Hunter role - Emma provides lead context, proposal status |
| Reanance | @ReananceGlobal | Maya | Client relationship focus - Maya provides client context, status updates |
| Kara | @kara339 | Rafael | Builder role - Rafael provides technical context, implementation guidance |

### Prompt Template Per Citizen

**Emma (for Bigbosexf):**
```
You are Emma, ScopeLock's Scout. Write Bigbosexf's morning brief.

Context from graph:
- Active tasks: {tasks}
- Urgent today: {urgent}
- Blocked: {blocked}
- Yesterday: {completions}
- Mission context: {missions}

Write a brief with this structure:
🌅 Good morning, Bigbosexf!

📊 ACTIVE MISSIONS ({count})
[List missions with your role]

🔴 URGENT TODAY (due in <8h)
[List tasks with deadlines]

🟡 THIS WEEK
[List non-urgent tasks]

🚫 BLOCKED
[List blocked tasks with reasons]

✅ YESTERDAY
[Celebrate completions]

💡 CONTEXT
[Explain WHY tasks matter, client context, proposal status]

—Emma (Scout)

Keep it concise but contextual. Use your voice (enthusiastic, opportunity-focused).
```

**Maya (for Reanance):**
```
You are Maya, ScopeLock's Client Success Manager. Write Reanance's morning brief.

Context from graph:
- Active tasks: {tasks}
- Urgent today: {urgent}
- Blocked: {blocked}
- Yesterday: {completions}
- Mission context: {missions}

Write a brief with this structure:
🌅 Good morning, Reanance!

📊 ACTIVE MISSIONS ({count})
[List missions with client names and current stage]

🔴 URGENT TODAY (due in <8h)
[List tasks - emphasize client deadlines]

🟡 THIS WEEK
[List non-urgent tasks]

🚫 BLOCKED
[List blocked tasks - mention if clients are waiting]

✅ YESTERDAY
[Celebrate completions]

💡 CONTEXT
[Client relationship context, expectations, communication status]

—Maya (Bridge)

Keep it client-focused. Emphasize relationship and communication.
```

**Rafael (for Kara):**
```
You are Rafael, ScopeLock's Guide. Write Kara's morning brief.

Context from graph:
- Active tasks: {tasks}
- Urgent today: {urgent}
- Blocked: {blocked}
- Yesterday: {completions}
- Mission context: {missions}

Write a brief with this structure:
🌅 Good morning, Kara!

📊 ACTIVE MISSIONS ({count})
[List missions with tech stack and implementation stage]

🔴 URGENT TODAY (due in <8h)
[List tasks - emphasize deployments and tests]

🟡 THIS WEEK
[List non-urgent tasks]

🚫 BLOCKED
[List blocked tasks - technical blockers]

✅ YESTERDAY
[Celebrate completions]

💡 CONTEXT
[Technical context, implementation notes, architecture decisions]

—Rafael (Builder)

Keep it technical and actionable. Provide implementation guidance.
```

---

## Output: Telegram Message Format

### Message Structure

**Format:** HTML (not Markdown - more reliable with Telegram)

**Template:**
```html
<b>🌅 Good morning, {name}!</b>

<b>📊 ACTIVE MISSIONS ({mission_count})</b>
• Mission #{id}: {title} - {stage} ({role})
  Client: {client} | Deadline: {deadline}

<b>🔴 URGENT TODAY (due in <8h)</b>
• {task_name} ({deadline_relative})
  [Button: Complete] [Button: Blocked]

<b>🟡 THIS WEEK</b>
• {task_name}
  [Button: Start]

<b>🚫 BLOCKED</b>
• {task_name} - {blocker_reason}
  [Button: Unblock]

<b>✅ YESTERDAY</b>
• {task_name} ({completion_time})

<b>💡 CONTEXT</b>
{ai_citizen_contextual_explanation}

—{ai_citizen_name} ({ai_citizen_role})
```

### Inline Buttons

**Button format:** Telegram InlineKeyboardMarkup

**Per-task buttons:**
```python
# For urgent tasks
buttons = [
    [
        InlineKeyboardButton("✅ Complete", callback_data=f"complete_{task_id}"),
        InlineKeyboardButton("🚫 Blocked", callback_data=f"block_{task_id}")
    ],
    [
        InlineKeyboardButton("💬 Ask Question", callback_data=f"question_{task_id}"),
        InlineKeyboardButton("👁️ View Details", callback_data=f"view_{task_id}")
    ]
]

# For pending tasks
buttons = [
    [
        InlineKeyboardButton("▶️ Start", callback_data=f"start_{task_id}"),
        InlineKeyboardButton("👁️ View Details", callback_data=f"view_{task_id}")
    ]
]

# For blocked tasks
buttons = [
    [
        InlineKeyboardButton("🔓 Unblock", callback_data=f"unblock_{task_id}"),
        InlineKeyboardButton("💬 Ask for Help", callback_data=f"help_{task_id}")
    ]
]
```

### Character Limits

**Telegram limits:**
- Message text: 4,096 characters max
- Button text: 64 characters max
- Callback data: 64 bytes max

**Handling overflow:**
- If message > 4,000 chars, split into multiple messages
- Send "Part 1/2" and "Part 2/2" with continuation indicator
- Always keep AI citizen signature on last message

---

## Button Actions

### Button 1: Complete Task

**Callback data:** `complete_{task_id}`

**When clicked:**
1. Update graph: `SET task.state = 'complete', task.completed_at = datetime()`
2. Query for dependent tasks: `MATCH (task)-[:U4_DEPENDS_ON]-(dep) WHERE dep.state = 'waiting'`
3. Activate dependent tasks: `SET dep.state = 'todo'`
4. Send handoff brief to next assignee (see `03-handoff-system-spec.md`)
5. Reply to button click: "✅ Marked complete. Next person notified."

### Button 2: Blocked

**Callback data:** `block_{task_id}`

**When clicked:**
1. Prompt user: "Why is this blocked?" (force_reply)
2. Wait for user response (blocker reason)
3. Update graph: `SET task.state = 'blocked'`
4. Create blocker node: `CREATE (blocker:U4_Blocker {reason: $reason, severity: 'high'})`
5. Link task to blocker: `CREATE (task)-[:U4_BLOCKED_BY]->(blocker)`
6. Notify lead (Nicolas): "🚫 Task blocked: {task_name}. Reason: {reason}"
7. Reply to button click: "🚫 Marked as blocked. Lead notified."

### Button 3: Start Task

**Callback data:** `start_{task_id}`

**When clicked:**
1. Update graph: `SET task.state = 'doing', task.started_at = datetime()`
2. Reply to button click: "▶️ Started working on: {task_name}"

### Button 4: Ask Question

**Callback data:** `question_{task_id}`

**When clicked:**
1. Prompt user: "What's your question?" (force_reply)
2. Wait for user response (question text)
3. Find spec author (Reanance typically)
4. Send question to spec author: "💬 {person} has a question about {task_name}: {question}"
5. Reply to button click: "💬 Question sent to {spec_author}"

### Button 5: View Details

**Callback data:** `view_{task_id}`

**When clicked:**
1. Query graph for full task details
2. Send detailed message:
   ```
   📋 Task Details: {task_name}

   Mission: {mission_name}
   Assigned: {assignee}
   Priority: {priority}
   Due: {due_date}
   State: {state}

   Description:
   {description}

   Dependencies:
   {list of blocking tasks}

   [Back to Brief] [Complete] [Blocked]
   ```

### Button 6: Unblock

**Callback data:** `unblock_{task_id}`

**When clicked:**
1. Delete blocker relationship: `MATCH (task)-[r:U4_BLOCKED_BY]->(blocker) DELETE r, blocker`
2. Update task state: `SET task.state = 'todo'`
3. Notify lead: "🔓 Task unblocked: {task_name}"
4. Reply to button click: "🔓 Unblocked. Task is now active."

### Button 7: Ask for Help

**Callback data:** `help_{task_id}`

**When clicked:**
1. Prompt user: "Describe the issue:" (force_reply)
2. Wait for user response (help request)
3. Send to lead (Nicolas): "🆘 Help request: {task_name}. Issue: {help_text}"
4. Reply to button click: "🆘 Help request sent to lead."

---

## Error Handling

### Error 1: Graph Query Fails

**Symptoms:** FalkorDB connection timeout, query error

**Fallback:**
1. Log error: `logger.error(f"Graph query failed: {error}")`
2. Send generic brief:
   ```
   🌅 Good morning, {name}!

   ⚠️ Task system is temporarily unavailable.

   Please check SYNC.md for your current tasks:
   /home/mind-protocol/scopelock/citizens/SYNC.md

   I'll send your detailed brief when the system recovers.

   —{ai_citizen_name}
   ```
3. Emit alert to lead: "🚨 Morning brief failed for {name}. Graph unreachable."
4. Retry after 15 minutes

### Error 2: AI Citizen Brief Generation Fails

**Symptoms:** Claude Code timeout, API error, malformed response

**Fallback:**
1. Log error: `logger.error(f"AI brief generation failed: {error}")`
2. Use template brief (no AI):
   ```
   🌅 Good morning, {name}!

   📊 ACTIVE TASKS ({count})
   {list tasks from graph - no context, just bullet points}

   🔴 URGENT TODAY
   {list urgent tasks}

   —Automated Brief (AI unavailable)
   ```
3. Emit alert to lead: "⚠️ AI brief failed for {name}. Sent template instead."

### Error 3: Telegram Send Fails

**Symptoms:** Bot token invalid, user blocked bot, network error

**Fallback:**
1. Log error: `logger.error(f"Telegram send failed for {telegram_id}: {error}")`
2. Retry 3 times with exponential backoff (5s, 15s, 45s)
3. If still fails, write brief to file:
   - Path: `/home/mind-protocol/scopelock/briefs/{date}/{telegram_username}.md`
   - Content: Full brief in Markdown format
4. Emit alert to lead: "🚨 Failed to send brief to {name}. Saved to file."

### Error 4: Button Callback Fails

**Symptoms:** Callback handler error, graph update fails

**Fallback:**
1. Log error: `logger.error(f"Button callback failed: {callback_data}, {error}")`
2. Reply to user: "⚠️ Action failed. Please try again or contact lead."
3. Emit alert to lead: "🚨 Button action failed: {callback_data}. Error: {error}"
4. Do NOT update graph (fail-safe: don't corrupt state)

---

## Success Metrics

### Delivery Reliability
- **Target:** 100% morning briefs delivered by 8:05 AM WAT
- **Measurement:** Log timestamp of each send, compare to 8:00 AM
- **Failure threshold:** >1 failed delivery per week → investigate

### Content Quality
- **Target:** >90% of briefs contain contextual explanation (not just task lists)
- **Measurement:** Check for `💡 CONTEXT` section presence and length (>50 chars)
- **Failure threshold:** <80% contextual briefs → review AI prompts

### Button Engagement
- **Target:** >50% of urgent tasks use button actions (not manual updates)
- **Measurement:** Count button clicks vs manual task state changes
- **Failure threshold:** <30% button usage → simplify button interface

### Error Rate
- **Target:** <5% error rate (graph/AI/Telegram failures)
- **Measurement:** Count errors / total briefs sent
- **Failure threshold:** >10% error rate → urgent infrastructure fix

---

## Configuration

### Environment Variables

```bash
# Production FalkorDB connection (Mind Protocol v2 graph)
export FALKORDB_API_URL="https://mindprotocol.onrender.com/admin/query"
export FALKORDB_API_KEY="Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU"
export GRAPH_NAME="scopelock"

# Telegram bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_BIGBOSEXF_ID=@Bigbosefx2
TELEGRAM_REANANCE_ID=@ReananceGlobal
TELEGRAM_KARA_ID=@kara339
TELEGRAM_LEAD_ID=@nlr_ai

# Cron timing
MORNING_BRIEF_HOUR=8
MORNING_BRIEF_TIMEZONE=Africa/Lagos  # WAT = UTC+1

# Claude Code path
CLAUDE_CODE_PATH=/usr/local/bin/claude
SCOPELOCK_ROOT=/home/mind-protocol/scopelock

# Error handling
RETRY_ATTEMPTS=3
RETRY_BACKOFF_BASE=5  # seconds
FALLBACK_BRIEF_DIR=/home/mind-protocol/scopelock/briefs
```

**FalkorDB Query Tools:**

```bash
# Query production graph
python3 tools/query_production.py "MATCH (n:U4_Work_Item {scope_ref: 'scopelock'}) RETURN count(n)"

# Ingest data to graph
python3 tools/ingestion/falkordb_ingestor_rest.py <extraction.json>
```

**Reference:** `/home/mind-protocol/mind-protocol/docs/COMPLETE_TYPE_REFERENCE.md` for all node/link types

### Systemd Timer

**File:** `/etc/systemd/system/scopelock-morning-brief.timer`

```ini
[Unit]
Description=ScopeLock Morning Brief Timer
Requires=scopelock-morning-brief.service

[Timer]
# Run at 8:00 AM Africa/Lagos time (WAT = UTC+1)
OnCalendar=*-*-* 08:00:00
Persistent=true
Unit=scopelock-morning-brief.service

[Install]
WantedBy=timers.target
```

**File:** `/etc/systemd/system/scopelock-morning-brief.service`

```ini
[Unit]
Description=ScopeLock Morning Brief Service
After=network.target

[Service]
Type=oneshot
User=mind-protocol
WorkingDirectory=/home/mind-protocol/scopelock/automation
ExecStart=/usr/bin/python3 morning_brief_engine.py
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

---

## Testing Strategy

### Unit Tests

**Test 1: Graph queries return correct data**
```python
def test_active_tasks_query():
    # Insert test task in graph
    # Query for tasks
    # Assert returned tasks match expected
```

**Test 2: AI citizen selection logic**
```python
def test_citizen_assignment():
    assert get_citizen_for_person("@Bigbosefx2") == "Emma"
    assert get_citizen_for_person("@ReananceGlobal") == "Maya"
    assert get_citizen_for_person("@kara339") == "Rafael"
```

**Test 3: Message formatting**
```python
def test_message_format():
    # Generate brief
    # Assert HTML tags are valid
    # Assert message length < 4096 chars
    # Assert buttons are present
```

### Integration Tests

**Test 4: Full brief generation**
```python
def test_full_brief_generation():
    # Mock graph data
    # Generate brief
    # Assert brief contains all sections
    # Assert AI citizen signature present
    # Assert buttons attached
```

**Test 5: Button callback handling**
```python
def test_button_complete_task():
    # Click "Complete" button
    # Assert graph updated (state = 'complete')
    # Assert dependent tasks activated
    # Assert handoff brief sent
```

### Manual Tests

**Test 6: End-to-end flow**
1. Trigger cron manually: `systemctl start scopelock-morning-brief.service`
2. Check all 3 team members received brief
3. Click button in one brief
4. Verify graph updated
5. Verify reply message sent

**Test 7: Error recovery**
1. Stop FalkorDB: `systemctl stop falkordb`
2. Trigger cron
3. Verify fallback brief sent
4. Verify alert sent to lead
5. Restart FalkorDB, verify next brief succeeds

---

## Next Steps

**For Inna (Complete Documentation):**
Create 6-level documentation from this spec:
1. **PATTERN.md:** Core principle (AI-written contextual briefs, not task lists)
2. **AC.md (BEHAVIOR_SPEC):** Functional criteria (brief sent by 8:05 AM, contains all sections, buttons work)
3. **VALIDATION.md:** Test specs (unit tests for queries, integration tests for buttons)
4. **MECHANISM.md:** Implementation approach (Python script, FalkorDB, Claude Code, Telegram bot)
5. **ALGORITHM.md:** Code-level steps (for loop over team members, query graph, call AI, send message)
6. **GUIDE.md:** Deployment (systemd timer setup, environment variables, testing locally)

**For Rafael (Implementation):**
Once Inna's docs are complete:
1. Generate `morning_brief_engine.py` from ALGORITHM.md
2. Generate systemd timer/service files from GUIDE.md
3. Generate button callback handlers from MECHANISM.md
4. Generate tests from VALIDATION.md

**For Alexis (Tracking):**
Add to `/citizens/alexis/ROADMAP.md`:
- Milestone: Morning Brief System
- Target: 2025-11-15
- Success criteria: 100% delivery rate, >90% contextual briefs

---

**Emma (Scout)**
ScopeLock — Automation Specifications
2025-11-06
