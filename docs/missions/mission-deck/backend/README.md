# Mission Deck Backend

Internal developer dashboard API for ScopeLock mission execution.

## Overview

FastAPI-based REST API that provides:
- **Authentication** - JWT-based auth with bcrypt password hashing
- **Mission Management** - CRUD operations for developer missions
- **Rafael Chat** - AI assistant integration via Claude API
- **DoD Tracking** - Definition of Done checklist management
- **FalkorDB Integration** - Graph database queries for missions, messages, tasks

**Architecture:**
- FastAPI 0.104+ for REST API
- FalkorDB (Mind Protocol v2 production) for data persistence
- JWT authentication with 7-day token expiry
- Claude 3.5 Sonnet for Rafael chat functionality
- CORS enabled for frontend integration

## Prerequisites

- **Python 3.10+**
- **FalkorDB API access** (Mind Protocol production instance)
- **Claude API key** (Anthropic)
- **Git** (for cloning repository)

## Installation

### 1. Clone Repository

```bash
cd /home/mind-protocol/scopelock/docs/missions/mission-deck
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your actual values:

```bash
# Required variables
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=your_actual_api_key_here
GRAPH_NAME=scopelock
JWT_SECRET=your_generated_jwt_secret_here
CLAUDE_API_KEY=your_anthropic_api_key_here
CORS_ORIGINS=http://localhost:3000
```

**Generate JWT secret:**

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste into `JWT_SECRET` in `.env`.

## Running Locally

### Start Development Server

```bash
uvicorn main:app --reload
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.

================================================================================
Mission Deck API - Starting Up
================================================================================

✅ All required environment variables configured
✅ FalkorDB connected (X nodes)

🚀 Mission Deck API ready
   Docs: http://localhost:8000/docs
   Health: http://localhost:8000/health
================================================================================
```

### Verify Health Check

In a new terminal:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "mission-deck-api",
  "timestamp": "2025-11-06T12:00:00Z"
}
```

## API Documentation

Once running, visit:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

Interactive API documentation with request/response examples and "Try it out" functionality.

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email/password, returns JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

### Missions

- `GET /api/missions` - List all missions for authenticated user
- `GET /api/missions/{mission_id}` - Get single mission details
- `PATCH /api/missions/{mission_id}/notes` - Update mission notes

### Chat (Rafael)

- `POST /api/missions/{mission_id}/chat` - Send message to Rafael, get AI response
- `GET /api/missions/{mission_id}/messages` - Get chat history for mission

### DoD (Definition of Done)

- `GET /api/missions/{mission_id}/dod` - List DoD checklist items
- `PATCH /api/missions/{mission_id}/dod/{item_id}` - Toggle DoD item completion
- `PATCH /api/missions/{mission_id}/dod/complete` - Mark all items complete, transition to QA

### Health

- `GET /health` - Health check endpoint (no auth required)

## Testing

### Run All Tests

```bash
pytest
```

### Run Specific Test Files

```bash
# Error handling tests
pytest tests/test_error_handling.py

# Security tests
pytest tests/test_security.py
```

### Run with Verbose Output

```bash
pytest -v
```

### Run with Coverage

```bash
pytest --cov=. --cov-report=html
```

Coverage report will be in `htmlcov/index.html`.

## Testing Authentication

### 1. Get JWT Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "person1@scopelock.ai",
    "password": "testpass"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "bigbosexf",
    "email": "person1@scopelock.ai",
    "name": "Person 1"
  }
}
```

### 2. Use Token for Protected Endpoints

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8000/api/missions \
  -H "Authorization: Bearer $TOKEN"
```

## Testing Rafael Chat

### Send Message to Rafael

```bash
TOKEN="your_jwt_token_here"
MISSION_ID="mission-47-telegram-bot"

curl -X POST http://localhost:8000/api/missions/$MISSION_ID/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I send a Telegram message in Python?"
  }'
```

Response includes Rafael's answer and any extracted code blocks:

```json
{
  "response": "Here's how to send a Telegram message...\n```python\nfrom telegram import Bot\n```",
  "code_blocks": [
    {
      "language": "python",
      "code": "from telegram import Bot",
      "filename": "code.py"
    }
  ]
}
```

## Week 1 MVP Test Users

Hardcoded test users for development (password: `testpass` for all):

| Email | User ID | Name |
|-------|---------|------|
| person1@scopelock.ai | bigbosexf | Person 1 |
| person2@scopelock.ai | kara | Person 2 |
| person3@scopelock.ai | reanance | Person 3 |

**Note:** Week 2 will integrate with FalkorDB U4_Agent nodes for real user authentication.

## Architecture Notes

### FalkorDB Integration

- **Access Method:** REST API (not direct database connection)
- **Query Language:** Cypher (similar to Neo4j)
- **Node Types Used:**
  - `U4_Work_Item` - Missions (work_type='mission') and DoD tasks (work_type='task')
  - `U4_Event` - Chat messages (event_kind='message')
  - `U4_Agent` - Developers and AI citizens
- **Relationships:**
  - `U4_ABOUT` - Links messages to missions
  - `U4_MEMBER_OF` - Links DoD tasks to missions
  - `U4_ASSIGNED_TO` - Links missions to developers

### Error Handling

Follows ScopeLock **fail-loud** principle:

```python
try:
    # Operation
except Exception as e:
    print(f"[module:function] Error: {e}")  # Log with location
    # Emit failure event if applicable
    raise HTTPException(status_code=500, detail="User-friendly message")
```

All errors are:
1. Logged with file location and context
2. Converted to appropriate HTTP status codes
3. Returned with user-friendly messages (no internal details exposed)

### Security

- **Password Hashing:** bcrypt via passlib
- **JWT Algorithm:** HS256
- **Token Expiry:** 7 days
- **CORS:** Configurable allowed origins
- **SQL Injection Prevention:** All Cypher queries use parameterization
- **Authentication:** Required for all endpoints except /health and /api/auth/login

## Troubleshooting

### Issue: "Missing environment variables" on startup

**Solution:** Ensure `.env` file exists and contains all required variables. Copy from `.env.example` and fill in actual values.

### Issue: "FalkorDB connection failed"

**Solution:** 
1. Verify `FALKORDB_API_URL` is correct
2. Check `FALKORDB_API_KEY` is valid
3. Ensure network connectivity to FalkorDB instance
4. Test connection manually:

```bash
python3 tools/query_production.py "MATCH (n) RETURN count(n)"
```

### Issue: "Invalid authentication token"

**Solution:**
1. Verify JWT_SECRET is the same used to generate the token
2. Check token hasn't expired (7-day expiry)
3. Ensure token format is correct: `Bearer <token>`

### Issue: "Rafael chat not working"

**Solution:**
1. Verify `CLAUDE_API_KEY` is valid
2. Check Anthropic API quota/limits
3. Review logs for specific API error messages

### Issue: Port 8000 already in use

**Solution:**

```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)

# Or run on different port
uvicorn main:app --reload --port 8001
```

## Development

### Code Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── auth.py                 # JWT token creation/validation
├── dependencies.py         # FastAPI dependencies for auth
├── schemas.py              # Pydantic models for API
├── requirements.txt        # Python dependencies
├── routers/
│   ├── auth.py            # Login/logout endpoints
│   ├── missions.py        # Mission CRUD endpoints
│   ├── chat.py            # Rafael chat endpoints
│   └── dod.py             # DoD checklist endpoints
├── services/
│   ├── graph.py           # FalkorDB client
│   └── rafael.py          # Claude API integration
└── tests/
    ├── test_error_handling.py
    └── test_security.py
```

### Adding New Endpoints

1. Create function in appropriate router file (routers/*.py)
2. Use `@router.[method](path)` decorator
3. Add authentication dependency: `current_user: CurrentUser = Depends(get_current_user)`
4. Update schemas.py with request/response models
5. Add Cypher queries to services/graph.py if needed
6. Add tests to tests/

### Code Style

- **Imports:** Standard library → Third-party → Local
- **Docstrings:** All public functions have docstrings
- **Error Handling:** Fail-loud with location logging
- **Type Hints:** Use Python type hints for function parameters/returns

## Deployment

**Week 1 MVP:** Local development only

**Week 2:** Deploy to Render

```bash
# Will include:
# - render.yaml configuration
# - Environment variable setup in Render dashboard
# - Database connection configuration
# - Production CORS origins
```

## Support

For issues or questions:
- **Documentation:** See `/docs/missions/mission-deck/`
- **Team:** @Rafael on ScopeLock Telegram
- **SYNC:** Update `/citizens/SYNC.md` with blockers

---

**Mission Deck Backend** - Part of ScopeLock internal tooling
Built with FastAPI + FalkorDB + Claude API
