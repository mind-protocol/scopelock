# Mission Deck Backend

FastAPI backend for Mission Deck - internal developer dashboard for ScopeLock missions.

## Architecture

- **Framework:** FastAPI 0.104+ (Python 3.11+)
- **Database:** FalkorDB (Mind Protocol v2 production graph)
- **Auth:** JWT with bcrypt password hashing
- **AI:** Claude 3.5 Sonnet (for Rafael chat simulation)
- **Deployment:** Render Web Service

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Generate JWT secret
openssl rand -hex 32

# Edit .env and set:
# - JWT_SECRET (from openssl command above)
# - CLAUDE_API_KEY (from Anthropic dashboard)
# - CORS_ORIGINS (your frontend URL)
```

### 3. Run Locally

```bash
# Development mode (auto-reload)
uvicorn main:app --reload --port 8000

# Or use Python directly
python main.py

# API available at: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
# Health check: curl http://localhost:8000/health
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password → JWT token
- `POST /api/auth/logout` - Logout (stateless, client discards token)

### Missions
- `GET /api/missions` - List user's assigned missions
- `GET /api/missions/{mission_id}` - Get mission details
- `PATCH /api/missions/{mission_id}/notes` - Update developer notes

### Chat (Rafael)
- `POST /api/missions/{mission_id}/chat` - Send message to Rafael
- `GET /api/missions/{mission_id}/messages` - Get chat history (limit 50)

### Definition of Done (DoD)
- `GET /api/missions/{mission_id}/dod` - List DoD checklist items
- `PATCH /api/missions/{mission_id}/dod/{item_id}` - Toggle item state
- `PATCH /api/missions/{mission_id}/dod/complete` - Mark all items complete

### Health & Docs
- `GET /health` - Health check (returns `{"status": "ok"}`)
- `GET /docs` - Swagger UI (interactive API documentation)
- `GET /redoc` - ReDoc (alternative API documentation)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing (256-bit) | `openssl rand -hex 32` |
| `FALKORDB_API_URL` | FalkorDB REST API endpoint | `https://mindprotocol.onrender.com/admin/query` |
| `FALKORDB_API_KEY` | FalkorDB authentication key | *(from Mind Protocol v2)* |
| `GRAPH_NAME` | Graph name in FalkorDB | `scopelock` |
| `CLAUDE_API_KEY` | Anthropic Claude API key | `sk-ant-api03-...` |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | `http://localhost:3000,https://scopelock.mindprotocol.ai` |

## Deployment (Render)

### 1. Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `mind-protocol/scopelock`
4. Configure:
   - **Name:** `scopelock-deck-api`
   - **Region:** Oregon (or closest to users)
   - **Branch:** `main`
   - **Root Directory:** `docs/missions/mission-deck/backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2. Set Environment Variables

In Render dashboard, add all environment variables from `.env.example`:
- `JWT_SECRET`
- `FALKORDB_API_URL`
- `FALKORDB_API_KEY`
- `GRAPH_NAME`
- `CLAUDE_API_KEY`
- `CORS_ORIGINS`

### 3. Deploy

Click "Create Web Service" → Wait for build → Service will be live at:
`https://scopelock-deck-api.onrender.com`

### 4. Verify Deployment

```bash
# Health check
curl https://scopelock-deck-api.onrender.com/health
# Expected: {"status":"ok"}

# API docs
open https://scopelock-deck-api.onrender.com/docs
```

## Testing

### Run Existing Test Suite

```bash
# Backend tests (pytest)
pytest tests/test_error_handling.py tests/test_security.py

# Expected: 17 tests passing
```

### Manual Testing

```bash
# 1. Health check
curl http://localhost:8000/health

# 2. Login (if test user exists in FalkorDB)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass"}'

# 3. Get missions (with JWT token from login)
curl http://localhost:8000/api/missions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── main.py                     # FastAPI app entry point
├── auth.py                     # JWT authentication
├── dependencies.py             # Reusable FastAPI dependencies
├── schemas.py                  # Pydantic request/response models
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
├── README.md                   # This file
├── routers/                    # API endpoint routers
│   ├── auth.py                 # /api/auth/*
│   ├── missions.py             # /api/missions/*
│   ├── chat.py                 # /api/missions/:id/chat
│   └── dod.py                  # /api/missions/:id/dod
├── services/                   # External integrations
│   ├── graph.py                # FalkorDB client
│   └── rafael.py               # Claude API (Rafael simulation)
└── tests/                      # Test suite
    ├── test_error_handling.py  # Error handling tests (467 lines)
    └── test_security.py        # Security tests (454 lines)
```

## Troubleshooting

### Issue: "JWT_SECRET environment variable is required"

**Cause:** Missing or empty `JWT_SECRET` in `.env`

**Fix:**
```bash
# Generate secret
openssl rand -hex 32

# Add to .env
echo "JWT_SECRET=<your-generated-secret>" >> .env
```

### Issue: "FalkorDB credentials missing"

**Cause:** `FALKORDB_API_URL` or `FALKORDB_API_KEY` not set

**Fix:** Check `.env` file has correct FalkorDB credentials from Mind Protocol v2

### Issue: "Claude API connection error"

**Cause:** Invalid `CLAUDE_API_KEY` or API rate limit

**Fix:**
1. Verify API key: https://console.anthropic.com/
2. Check rate limits (Claude API usage dashboard)
3. Rafael will gracefully return error message to user (won't crash)

### Issue: CORS errors from frontend

**Cause:** Frontend origin not in `CORS_ORIGINS`

**Fix:**
```bash
# Add frontend URL to .env
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

## Development Notes

### Architecture Decisions

- **JWT Auth (not Clerk):** Custom JWT implementation for Week 1 MVP (faster setup)
- **FalkorDB REST API:** Direct HTTP calls (no ORM) for graph queries
- **Claude API Direct:** Week 1 simulates Rafael via API (Week 2 will use actual citizen)
- **No Database Migrations:** Schema-free graph structure evolves with new attributes

### Security

- **Password Hashing:** bcrypt with salt rounds (via passlib)
- **JWT Expiry:** 7 days (configurable in `auth.py`)
- **CORS:** Whitelist-only (no wildcard `*`)
- **HTTPS:** Required in production (Render provides free SSL)

### Performance

- **Response Times:** <100ms for graph queries (FalkorDB REST API)
- **Chat Latency:** 3-10s (Claude API inference time)
- **Health Check:** <50ms (no database query)

## Support

- **Documentation:** See `/docs/missions/mission-deck/` for complete specs
- **Issues:** Open issue in `mind-protocol/scopelock` GitHub repo
- **Team Contact:** @nlr_ai (Telegram)

---

**Last Updated:** 2025-11-06  
**Version:** 1.0 (Week 1 MVP)  
**Status:** Production-ready
