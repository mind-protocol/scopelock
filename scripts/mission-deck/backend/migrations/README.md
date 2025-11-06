# Mission Deck - FalkorDB Data Layer

**Purpose:** Graph database implementation for Mission Deck using Mind Protocol type system

---

## Files

1. **001_mission_graph_schema.md** - Graph schema documentation (node/link types, query patterns)
2. **002_seed_missions.json** - 2 missions (Telegram Notifier, Landing Page)
3. **003_seed_dod_items.json** - 5 DoD items linked to Mission 47
4. **004_seed_chat_test_data.json** - 4 chat messages + 2 test runs

---

## Ingestion (Development)

### Step 1: Set Environment Variables

```bash
export FALKORDB_API_URL="https://mindprotocol.onrender.com/admin/query"
export FALKORDB_API_KEY="Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU"
export GRAPH_NAME="scopelock"
```

### Step 2: Ingest Data (Order Matters)

```bash
# Navigate to Mind Protocol root
cd /home/mind-protocol/mindprotocol

# Ingest missions first (other data depends on them)
python3 tools/ingestion/falkordb_ingestor_rest.py \
  /home/mind-protocol/scopelock/scripts/mission-deck/backend/migrations/002_seed_missions.json

# Ingest DoD items (linked to missions via U4_MEMBER_OF)
python3 tools/ingestion/falkordb_ingestor_rest.py \
  /home/mind-protocol/scopelock/scripts/mission-deck/backend/migrations/003_seed_dod_items.json

# Ingest chat messages and test runs (linked to missions via U4_ABOUT)
python3 tools/ingestion/falkordb_ingestor_rest.py \
  /home/mind-protocol/scopelock/scripts/mission-deck/backend/migrations/004_seed_chat_test_data.json
```

### Step 3: Verify Ingestion

```bash
# Count missions
python3 tools/query_production.py "MATCH (m:U4_Work_Item {work_type:'mission'}) RETURN count(m)"
# Expected: 2

# Count DoD items
python3 tools/query_production.py "MATCH (d:U4_Work_Item {work_type:'task'})-[:U4_MEMBER_OF]->(m:U4_Work_Item {work_type:'mission'}) RETURN count(d)"
# Expected: 5

# Count chat messages
python3 tools/query_production.py "MATCH (msg:U4_Event {event_kind:'message'}) RETURN count(msg)"
# Expected: 4

# Count test runs
python3 tools/query_production.py "MATCH (t:U4_Assessment)-[:U4_ABOUT]->(m:U4_Work_Item {work_type:'mission'}) RETURN count(t)"
# Expected: 2
```

---

## Query Patterns (For API Implementation)

### 1. GET /api/missions

**Get all missions assigned to user:**

```cypher
MATCH (mission:U4_Work_Item {work_type: 'mission', level: 'L2', scope_ref: 'scopelock'})
WHERE mission.assignee_ref = $user_email
  AND mission.state IN ['todo', 'doing']
RETURN mission
ORDER BY mission.due_date ASC
```

**Python FastAPI Example:**
```python
query = """
MATCH (mission:U4_Work_Item {work_type: 'mission', level: 'L2', scope_ref: 'scopelock'})
WHERE mission.assignee_ref = $user_email
  AND mission.state IN ['todo', 'doing']
RETURN mission
ORDER BY mission.due_date ASC
"""
result = falkor_client.query(graph_name="scopelock", query=query, params={"user_email": current_user.email})
missions = [Mission(**record['mission']) for record in result]
```

---

### 2. GET /api/missions/{id}

**Get single mission by slug:**

```cypher
MATCH (mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
WHERE mission.assignee_ref = $user_email
RETURN mission
```

---

### 3. GET /api/missions/{id}/dod

**Get DoD items for mission:**

```cypher
MATCH (dod:U4_Work_Item {work_type: 'task'})-[:U4_MEMBER_OF {role: 'dod_item'}]
->(mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
WHERE mission.assignee_ref = $user_email
RETURN dod
ORDER BY dod.category, dod.created_at
```

**Group by category in Python:**
```python
items = query_dod_items(mission_slug)
grouped = {
    "functional": [i for i in items if i.category == "functional"],
    "non-functional": [i for i in items if i.category == "non-functional"],
    "tests": [i for i in items if i.category == "tests"]
}
```

---

### 4. PATCH /api/missions/{id}/dod/{item_id}

**Toggle DoD item completion:**

```cypher
MATCH (dod:U4_Work_Item {work_type: 'task', slug: $item_slug})
-[:U4_MEMBER_OF {role: 'dod_item'}]
->(mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
WHERE mission.assignee_ref = $user_email
SET dod.state = $new_state,
    dod.completed_at = CASE WHEN $new_state = 'done' THEN datetime() ELSE null END,
    dod.updated_at = datetime()
RETURN dod
```

**Python FastAPI Example:**
```python
@router.patch("/missions/{mission_slug}/dod/{item_slug}")
async def toggle_dod_item(mission_slug: str, item_slug: str, request: ToggleDODRequest):
    query = """
    MATCH (dod:U4_Work_Item {work_type: 'task', slug: $item_slug})
    -[:U4_MEMBER_OF {role: 'dod_item'}]
    ->(mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
    WHERE mission.assignee_ref = $user_email
    SET dod.state = $new_state,
        dod.completed_at = CASE WHEN $new_state = 'done' THEN datetime() ELSE null END,
        dod.updated_at = datetime()
    RETURN dod
    """
    result = falkor_client.query(
        graph_name="scopelock",
        query=query,
        params={
            "mission_slug": mission_slug,
            "item_slug": item_slug,
            "user_email": current_user.email,
            "new_state": "done" if request.completed else "todo"
        }
    )
    return result[0]['dod']
```

---

### 5. GET /api/missions/{id}/chat/{citizen}

**Get chat history for mission + citizen:**

```cypher
MATCH (msg:U4_Event {event_kind: 'message', citizen: $citizen})-[:U4_ABOUT]
->(mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
WHERE mission.assignee_ref = $user_email
RETURN msg
ORDER BY msg.timestamp ASC
```

---

### 6. POST /api/missions/{id}/chat/{citizen}

**Save user message:**

```cypher
MATCH (mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
WHERE mission.assignee_ref = $user_email
CREATE (msg:U4_Event {
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  name: 'Chat message',
  description: 'User message to ' + $citizen,
  detailed_description: $message_text,
  type_name: 'U4_Event',
  level: 'L2',
  scope_ref: 'scopelock',
  visibility: 'partners',
  commitments: [],
  policy_ref: 'l4://law/EVENT-001',
  proof_uri: 'l4://proof/' + $msg_slug,
  created_by: 'chat-api',
  substrate: 'organizational',
  event_kind: 'message',
  actor_ref: $user_email,
  timestamp: datetime(),
  status: 'active',
  slug: $msg_slug,
  citizen: $citizen,
  sender: 'user',
  message_text: $message_text,
  code_blocks: null
})
CREATE (msg)-[:U4_ABOUT {
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  confidence: 1.0,
  energy: 0.7,
  forming_mindstate: 'conversation',
  goal: 'Technical guidance',
  commitments: [],
  visibility: 'partners',
  created_by: 'chat-api',
  substrate: 'organizational'
}]->(mission)
RETURN msg
```

**Save citizen response (similar pattern with sender='citizen' and code_blocks populated)**

---

### 7. GET /api/missions/{id}/tests/latest

**Get latest test run:**

```cypher
MATCH (test:U4_Assessment)-[:U4_ABOUT]
->(mission:U4_Work_Item {work_type: 'mission', slug: $mission_slug})
WHERE mission.assignee_ref = $user_email
  AND test.domain IN ['performance', 'quality']
RETURN test
ORDER BY test.created_at DESC
LIMIT 1
```

---

## API Implementation Checklist

**Backend changes needed:**

- [ ] Replace SQL database connection with FalkorDB client
- [ ] Update `missions.py` to use Cypher queries
- [ ] Update `chat.py` to use Cypher queries
- [ ] Update `dod.py` to use Cypher queries
- [ ] Update `tests.py` to use Cypher queries
- [ ] Add FalkorDB client to `dependencies.py`
- [ ] Update authentication to use `assignee_ref` field
- [ ] Test all endpoints with seed data

**FalkorDB Client Setup:**
```python
# backend/app/dependencies.py
from falkordb import FalkorDB

def get_falkor_client():
    return FalkorDB(
        host=os.getenv("FALKORDB_API_URL"),
        api_key=os.getenv("FALKORDB_API_KEY")
    )
```

---

## Notes

- **Authorization:** All queries include `WHERE mission.assignee_ref = $user_email` to enforce access control
- **Bitemporal:** Use `valid_from` and `valid_to` for time-travel queries (Week 2)
- **Custom Fields:** Mind Protocol type system allows custom fields beyond schema
- **Graph Benefits:** Can traverse relationships (e.g., "Which citizens worked on this mission?", "What patterns exist across missions?")

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
