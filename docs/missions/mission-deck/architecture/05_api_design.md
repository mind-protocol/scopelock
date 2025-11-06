# API Design - Mission Deck

**Part:** 5 of 7
**Created:** 2025-11-05
**Prerequisites:** [04_data_flows.md](./04_data_flows.md)

---

## RESTful Endpoints

### Missions API

```python
GET    /api/missions                      # List all missions for user
GET    /api/missions/{id}                 # Get mission details
POST   /api/missions                      # Create mission (admin)
PATCH  /api/missions/{id}                 # Update mission
DELETE /api/missions/{id}                 # Delete mission (admin)
```

**Implementation:** `scripts/mission-deck/backend/api/missions.py.stub`
**Tests:** `backend/tests/test_missions.py`

---

### Chat API

```python
GET    /api/missions/{id}/chat/{citizen}        # Get chat history
POST   /api/missions/{id}/chat/{citizen}        # Send message to citizen
DELETE /api/missions/{id}/chat/{citizen}        # Clear chat history
```

**Request/Response:**
```typescript
// POST /api/missions/47/chat/rafael
{
  "message": "How do I add inline buttons?"
}

// Response
{
  "response": "Here's the code for inline buttons:",
  "code_blocks": [
    {
      "language": "python",
      "code": "from telegram import InlineKeyboardButton..."
    }
  ]
}
```

**Implementation:** `scripts/mission-deck/backend/api/chat.py.stub`
**Tests:** `backend/tests/test_chat.py`

---

### DoD API

```python
GET    /api/missions/{id}/dod             # Get DoD items
PATCH  /api/missions/{id}/dod/{item_id}   # Toggle DoD item
POST   /api/missions/{id}/dod/complete    # Mark all complete
POST   /api/missions/{id}/dod/reset       # Reset all
```

**Request/Response:**
```typescript
// PATCH /api/missions/47/dod/item-1
{
  "completed": true
}

// Response
{
  "item": {
    "id": "item-1",
    "completed": true,
    "completed_at": "2025-11-05T20:30:00Z"
  },
  "progress": {
    "completed": 10,
    "total": 13
  }
}
```

**Implementation:** `scripts/mission-deck/backend/api/dod.py.stub`
**Tests:** `backend/tests/test_dod.py`

---

### Tests API

```python
GET    /api/missions/{id}/tests/latest          # Get latest test run results
POST   /api/missions/{id}/tests/run             # Trigger test run (Week 2)
GET    /api/missions/{id}/tests/{run_id}        # Get specific test run
GET    /api/missions/{id}/tests/{run_id}/logs   # Get full test logs
```

**Response:**
```typescript
// GET /api/missions/47/tests/latest
{
  "id": "run-1",
  "status": "passed",
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
      "error": "KeyError: 'callback_data'"
    }
  ]
}
```

**Implementation:** `scripts/mission-deck/backend/api/tests.py.stub`
**Tests:** `backend/tests/test_tests.py`

---

## Error Handling

All API endpoints follow this error format:

```typescript
// 400 Bad Request
{
  "detail": "Message too long (max 10,000 characters)"
}

// 401 Unauthorized
{
  "detail": "Authentication required"
}

// 404 Not Found
{
  "detail": "Mission not found"
}

// 500 Internal Server Error
{
  "detail": "Internal server error",
  "error_id": "err_abc123"  // For debugging
}
```

---

## Authentication

**Week 1:** Clerk or JWT tokens

**Headers:**
```
Authorization: Bearer {token}
```

**Backend validation:**
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    # Validate JWT token or Clerk session
    user = validate_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
```

---

## Related Documentation

**Previous:** [04_data_flows.md](./04_data_flows.md)
**Next:** [06_database_schema.md](./06_database_schema.md)

## Implementation Scripts

- `scripts/mission-deck/backend/api/missions.py.stub`
- `scripts/mission-deck/backend/api/chat.py.stub`
- `scripts/mission-deck/backend/api/dod.py.stub`
- `scripts/mission-deck/backend/api/tests.py.stub`

## Test Files

- `backend/tests/test_missions.py`
- `backend/tests/test_chat.py`
- `backend/tests/test_dod.py`
- `backend/tests/test_tests.py`

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
