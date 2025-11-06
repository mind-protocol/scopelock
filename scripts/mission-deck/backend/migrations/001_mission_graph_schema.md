# Mission Deck - FalkorDB Graph Schema

**Documentation:** `docs/missions/mission-deck/architecture/06_database_schema.md`
**Graph:** `scopelock` (Level 2 - Organization)
**Type Reference:** `/home/mind-protocol/mindprotocol/docs/COMPLETE_TYPE_REFERENCE.md`

---

## Node Types Used

### 1. Mission → `U4_Work_Item`

```cypher
// Mission node (work_type='mission')
(:U4_Work_Item {
  // Universal attributes (inherited)
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,
  name: string,
  description: string,
  type_name: 'U4_Work_Item',
  level: 'L2',
  scope_ref: 'scopelock',
  visibility: 'partners',
  created_by: 'scopelock-ingestion',
  substrate: 'organizational',

  // U4_Work_Item required fields
  work_type: 'mission',
  priority: enum('critical', 'high', 'medium', 'low'),
  state: enum('todo', 'doing', 'blocked', 'done', 'canceled'),

  // U4_Work_Item optional fields
  acceptance_criteria: string,
  assignee_ref: string,
  due_date: datetime,
  slug: string,
  status: 'active',

  // Custom fields for Mission Deck
  client: string,
  budget: integer,
  github_url: string
})
```

### 2. DoD Item → `U4_Work_Item`

```cypher
// DoD item node (work_type='task', linked to mission)
(:U4_Work_Item {
  // Universal + U4_Work_Item fields (same as above)
  work_type: 'task',
  priority: 'medium',
  state: enum('todo', 'done'),

  // Custom fields
  category: enum('functional', 'non-functional', 'tests'),
  completed_at: datetime
})-[:U4_MEMBER_OF {role: 'dod_item'}]->(:U4_Work_Item {work_type: 'mission'})
```

### 3. Chat Message → `U4_Event`

```cypher
// Chat message event
(:U4_Event {
  // Universal attributes
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,
  name: string,
  description: string,
  type_name: 'U4_Event',
  level: 'L2',
  scope_ref: 'scopelock',
  visibility: 'partners',
  created_by: 'scopelock-ingestion',
  substrate: 'organizational',

  // U4_Event required fields
  event_kind: 'message',
  actor_ref: string,  // 'user@scopelock.ai' or 'citizen:rafael'
  timestamp: datetime,

  // U4_Event optional fields
  subject_refs: array,
  status: 'active',

  // Custom fields
  citizen: enum('rafael', 'sofia', 'emma', 'inna', 'maya'),
  sender: enum('user', 'citizen'),
  message_text: string,
  code_blocks: string  // JSON array: [{"language": "python", "code": "..."}]
})-[:U4_ABOUT]->(:U4_Work_Item {work_type: 'mission'})
```

### 4. Test Run → `U4_Assessment`

```cypher
// Test execution assessment
(:U4_Assessment {
  // Universal attributes
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,
  name: string,
  description: string,
  type_name: 'U4_Assessment',
  level: 'L2',
  scope_ref: 'scopelock',
  visibility: 'partners',
  created_by: 'test-runner',
  substrate: 'organizational',

  // U4_Assessment required fields
  domain: enum('performance', 'quality'),
  assessor_ref: 'test-runner',
  score: float,  // 0.0 - 1.0 (pass rate)

  // U4_Assessment optional fields
  method: 'pytest',
  scale: 'pass_fail',
  status: 'active',

  // Custom fields
  test_status: enum('running', 'passed', 'failed'),
  summary: string,  // JSON: {"functional_passed": 8, "functional_total": 10}
  results: string,  // JSON array: [{"name": "test_send_message", "status": "passed"}]
  logs: string
})-[:U4_ABOUT]->(:U4_Work_Item {work_type: 'mission'})
```

---

## Link Types Used

### 1. DoD Item → Mission: `U4_MEMBER_OF`

```cypher
(:U4_Work_Item {work_type: 'task'})-[:U4_MEMBER_OF {
  // Universal link attributes
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,
  confidence: 1.0,
  energy: 0.5,
  forming_mindstate: 'specification',
  goal: 'Define acceptance criteria',
  visibility: 'partners',
  created_by: 'scopelock-ingestion',
  substrate: 'organizational',

  // U4_MEMBER_OF required fields
  membership_type: 'functional',
  role: 'dod_item'
}]->(:U4_Work_Item {work_type: 'mission'})
```

### 2. Chat Message → Mission: `U4_ABOUT`

```cypher
(:U4_Event {event_kind: 'message'})-[:U4_ABOUT {
  // Universal link attributes
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,
  confidence: 1.0,
  energy: 0.7,
  forming_mindstate: 'conversation',
  goal: 'Technical guidance',
  visibility: 'partners',
  created_by: 'chat-api',
  substrate: 'organizational'
}]->(:U4_Work_Item {work_type: 'mission'})
```

### 3. Test Run → Mission: `U4_ABOUT`

```cypher
(:U4_Assessment {domain: 'performance'})-[:U4_ABOUT {
  // Universal link attributes (same as above)
  forming_mindstate: 'quality_assurance',
  goal: 'Verify acceptance criteria'
}]->(:U4_Work_Item {work_type: 'mission'})
```

### 4. Mission → Assignee (Citizen): `U4_ASSIGNED_TO`

```cypher
(:U4_Work_Item {work_type: 'mission'})-[:U4_ASSIGNED_TO {
  // Universal link attributes
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,
  confidence: 1.0,
  energy: 0.8,
  forming_mindstate: 'resource_allocation',
  goal: 'Assign mission ownership',
  visibility: 'partners',
  created_by: 'scopelock-ingestion',
  substrate: 'organizational',

  // U4_ASSIGNED_TO optional fields
  assignment_date: datetime,
  effort_estimate: '1 week'
}]->(:U4_Agent {agent_type: 'citizen'})
```

---

## Implementation Notes

### Custom Fields

The Mind Protocol type system allows **custom fields** beyond the defined schema. For Mission Deck, we add:

**On `U4_Work_Item` (missions):**
- `client: string` - Client name (e.g., "Acme Corp")
- `budget: integer` - Mission budget in dollars
- `github_url: string` - GitHub repository URL

**On `U4_Work_Item` (DoD items):**
- `category: string` - 'functional', 'non-functional', 'tests'
- `completed_at: datetime` - When item was marked done

**On `U4_Event` (chat messages):**
- `citizen: string` - Which citizen ('rafael', 'sofia', etc.)
- `sender: string` - 'user' or 'citizen'
- `message_text: string` - Chat message content
- `code_blocks: string` - JSON array of code blocks

**On `U4_Assessment` (test runs):**
- `test_status: string` - 'running', 'passed', 'failed'
- `summary: string` - JSON with pass/fail counts
- `results: string` - JSON array of individual test results
- `logs: string` - Full test output

### Query Patterns

**Get all missions for a user:**
```cypher
MATCH (mission:U4_Work_Item {work_type: 'mission', level: 'L2', scope_ref: 'scopelock'})
-[:U4_ASSIGNED_TO]->(agent:U4_Agent {name: 'person1@scopelock.ai'})
WHERE mission.state IN ['todo', 'doing']
RETURN mission
ORDER BY mission.due_date ASC
```

**Get DoD items for a mission:**
```cypher
MATCH (dod:U4_Work_Item {work_type: 'task'})-[:U4_MEMBER_OF {role: 'dod_item'}]
->(mission:U4_Work_Item {work_type: 'mission', name: 'Telegram Notifier'})
RETURN dod
ORDER BY dod.category, dod.created_at
```

**Get chat history for mission + citizen:**
```cypher
MATCH (msg:U4_Event {event_kind: 'message', citizen: 'rafael'})-[:U4_ABOUT]
->(mission:U4_Work_Item {work_type: 'mission', slug: 'mission-47'})
RETURN msg
ORDER BY msg.timestamp ASC
```

**Get latest test run for mission:**
```cypher
MATCH (test:U4_Assessment)-[:U4_ABOUT]
->(mission:U4_Work_Item {work_type: 'mission', slug: 'mission-47'})
WHERE test.domain IN ['performance', 'quality']
RETURN test
ORDER BY test.created_at DESC
LIMIT 1
```

---

## Next Steps

1. **Create ingestion JSON files** (see `002_seed_missions.json`, `003_seed_dod_items.json`, etc.)
2. **Run ingestion:** `python3 tools/ingestion/falkordb_ingestor_rest.py seed_missions.json`
3. **Verify:** `python3 tools/query_production.py "MATCH (m:U4_Work_Item {work_type:'mission'}) RETURN count(m)"`
4. **Update API layer** to query FalkorDB instead of SQL

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
