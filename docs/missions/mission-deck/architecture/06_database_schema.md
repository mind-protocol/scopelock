# Database Schema - Mission Deck

**Part:** 6 of 7
**Created:** 2025-11-05
**Prerequisites:** [05_api_design.md](./05_api_design.md)

---

## Schema Updates for Citizen Workspaces

### 1. missions (Updated)

**Add `github_url` column:**

```sql
ALTER TABLE missions ADD COLUMN github_url TEXT;
```

**Full schema:**
```sql
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  budget INTEGER NOT NULL,
  deadline TIMESTAMP NOT NULL,
  status TEXT NOT NULL,                  -- 'active', 'qa', 'complete'
  assigned_to TEXT NOT NULL,
  github_url TEXT,                       -- NEW: URL to GitHub repo
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Implementation:** `scripts/mission-deck/backend/migrations/001_add_github_url.sql.stub`

---

### 2. dod_items (Unchanged)

```sql
CREATE TABLE dod_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  text TEXT NOT NULL,
  category TEXT NOT NULL,               -- 'functional', 'non-functional', 'tests'
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP
);
```

**No changes needed for Week 1.**

---

### 3. chat_messages (Updated)

**Add `citizen` column to support multiple citizens:**

```sql
ALTER TABLE chat_messages ADD COLUMN citizen TEXT NOT NULL DEFAULT 'rafael';
CREATE INDEX idx_chat_mission_citizen ON chat_messages(mission_id, citizen);
```

**Full schema:**
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  citizen TEXT NOT NULL,                 -- NEW: 'rafael', 'sofia', 'emma', etc.
  sender TEXT NOT NULL,                  -- 'user' or 'citizen'
  message TEXT NOT NULL,
  code_blocks JSONB,                     -- [{ language: "python", code: "..." }]
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_mission_citizen ON chat_messages(mission_id, citizen);
```

**Implementation:** `scripts/mission-deck/backend/migrations/002_add_citizen_to_chat.sql.stub`

---

### 4. test_runs (New Table)

**For Sofia workspace test results:**

```sql
CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  status TEXT NOT NULL,                  -- 'running', 'passed', 'failed'
  summary JSONB,                         -- { passed: 8, failed: 2, duration: 5.2 }
  results JSONB,                         -- [{ test: "test_foo", status: "passed", ... }]
  logs TEXT,                             -- Full test output
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_test_runs_mission ON test_runs(mission_id, created_at DESC);
```

**Example data:**
```json
{
  "summary": {
    "functional_passed": 8,
    "functional_total": 10,
    "performance_passed": 2,
    "performance_total": 3
  },
  "results": [
    {
      "name": "test_send_message",
      "status": "passed",
      "duration": 0.5
    },
    {
      "name": "test_callback_handler",
      "status": "failed",
      "error": "KeyError: 'callback_data'",
      "traceback": "..."
    }
  ]
}
```

**Implementation:** `scripts/mission-deck/backend/migrations/003_create_test_runs.sql.stub`

---

## Migration Strategy

**Week 1 migrations (in order):**
1. `001_add_github_url.sql` - Add github_url to missions
2. `002_add_citizen_to_chat.sql` - Add citizen column to chat_messages
3. `003_create_test_runs.sql` - Create test_runs table

**Run migrations:**
```bash
# Local development
psql -U user -d scopelock_deck -f migrations/001_add_github_url.sql
psql -U user -d scopelock_deck -f migrations/002_add_citizen_to_chat.sql
psql -U user -d scopelock_deck -f migrations/003_create_test_runs.sql

# Production (Render)
# Migrations run automatically via Render deploy script
```

---

## Seed Data (For Testing)

**Seed missions with GitHub URLs:**

```sql
-- Mission 1
INSERT INTO missions (id, title, client, budget, deadline, status, assigned_to, github_url, created_at)
VALUES (
  '47',
  'Telegram Notifier',
  'Acme Corp',
  300,
  '2025-11-08 23:59:59',
  'active',
  'person1@scopelock.ai',
  'https://github.com/mind-protocol/mission-47',
  NOW()
);

-- Mission 2
INSERT INTO missions (id, title, client, budget, deadline, status, assigned_to, github_url, created_at)
VALUES (
  '48',
  'Landing Page',
  'Beta Inc',
  450,
  '2025-11-10 23:59:59',
  'active',
  'person1@scopelock.ai',
  'https://github.com/mind-protocol/mission-48',
  NOW()
);
```

**Seed test run data:**

```sql
INSERT INTO test_runs (id, mission_id, status, summary, results, created_at)
VALUES (
  'run-1',
  '47',
  'passed',
  '{"functional_passed": 8, "functional_total": 10, "performance_passed": 2, "performance_total": 3}',
  '[{"name": "test_send_message", "status": "passed"}, {"name": "test_callback_handler", "status": "failed", "error": "KeyError: callback_data"}]',
  NOW()
);
```

**Implementation:** `scripts/mission-deck/backend/migrations/004_seed_test_data.sql.stub`

---

## Related Documentation

**Previous:** [05_api_design.md](./05_api_design.md)
**Next:** [07_dependencies.md](./07_dependencies.md)

## Implementation Scripts

- `scripts/mission-deck/backend/migrations/001_add_github_url.sql.stub`
- `scripts/mission-deck/backend/migrations/002_add_citizen_to_chat.sql.stub`
- `scripts/mission-deck/backend/migrations/003_create_test_runs.sql.stub`
- `scripts/mission-deck/backend/migrations/004_seed_test_data.sql.stub`

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
