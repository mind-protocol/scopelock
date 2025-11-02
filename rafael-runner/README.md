# Rafael Runner Service

**Purpose**: Node.js service that executes Rafael (Claude CLI) with full tool access

**Architecture**: 2-service split (Python backend + Node.js Rafael runner)

---

## Why This Service Exists

**Problem**: Rafael needs Claude CLI (requires Node.js), but backend is Python.

**Solution**: Split into 2 services:
1. **Python Backend** (backend/) - Receives webhooks, sends Telegram
2. **Node.js Rafael Runner** (this service) - Runs Claude CLI with tool access

**Benefits**:
- ✅ Rafael has full tool access (Read, Write, Bash, Grep)
- ✅ Both services use native runtimes (no Docker)
- ✅ Simpler, faster builds (~1 min each)
- ✅ Clear separation of concerns

**Cost**: $7/month × 2 = $14/month

---

## How It Works

```
Gmail webhook → Python Backend
                    ↓
                HTTP POST /run
                    ↓
            Rafael Runner (this service)
                    ↓
        subprocess: claude --print --continue
                    ↓
            Rafael executes with tool access:
            - Read(citizens/emma/proposals/)
            - Write(/var/data/drafts/{uuid}.json)
            - Bash("curl -X POST $BACKEND_API_URL/api/notify/draft")
                    ↓
            Returns output to Python Backend
```

---

## API

### `POST /run`

Execute Rafael via Claude CLI

**Request**:
```json
{
  "prompt": "New Upwork response from Client: message...",
  "citizen": "rafael",
  "received_at": "2025-11-03T00:00:00Z"
}
```

**Response (success)**:
```json
{
  "success": true,
  "output": "Rafael's stdout output...",
  "error": null,
  "request_id": "abc123"
}
```

**Response (failure)**:
```json
{
  "success": false,
  "output": "Partial output...",
  "error": "Error message...",
  "request_id": "abc123"
}
```

### `GET /health`

Health check endpoint

**Response**:
```json
{
  "service": "Rafael Runner",
  "status": "healthy",
  "version": "1.0.0",
  "repo_path": "/opt/render/project/src",
  "backend_api_url": "https://scopelock.onrender.com"
}
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Service port (Render provides) | `3000` |
| `BACKEND_API_URL` | Python backend URL | `https://scopelock.onrender.com` |
| `REPO_PATH` | ScopeLock repo path | `/opt/render/project/src` |
| `TIMEOUT_MS` | Claude CLI timeout | `120000` (2 minutes) |
| `NODE_ENV` | Node environment | `production` |

---

## Local Development

### Prerequisites
- Node.js 20+
- Claude CLI installed: `npm install -g @anthropic-ai/claude-code`
- ScopeLock repo cloned

### Setup

```bash
cd rafael-runner

# Install dependencies
npm install

# Set environment variables
export BACKEND_API_URL="http://localhost:8000"
export REPO_PATH="/home/mind-protocol/scopelock"
export PORT=3000

# Start service
npm start
```

### Test

```bash
# Health check
curl http://localhost:3000/health

# Run Rafael
curl -X POST http://localhost:3000/run \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test prompt",
    "citizen": "rafael"
  }'
```

---

## Deployment (Render)

**Deployed via**: `backend/render.yaml` (2nd service)

**Build command**: `npm install && npm install -g @anthropic-ai/claude-code`

**Start command**: `node index.js`

**Health check**: `/health`

---

## Logs

Service logs to stdout in JSON format:

```json
{
  "timestamp": "2025-11-03T00:00:00.000Z",
  "level": "info",
  "message": "Rafael execution requested",
  "request_id": "abc123",
  "citizen": "rafael",
  "prompt_length": 150
}
```

**View logs on Render**:
1. Go to https://dashboard.render.com/
2. Select `scopelock-rafael-runner`
3. Click "Logs" tab

---

## Monitoring

### Health Check

```bash
curl https://scopelock-rafael-runner.onrender.com/health
```

Should return `status: "healthy"`

### Test Run

```bash
curl -X POST https://scopelock-rafael-runner.onrender.com/run \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "echo test",
    "citizen": "test"
  }'
```

Should return Claude CLI output

---

## Troubleshooting

### Service not responding

**Check**: Health endpoint
```bash
curl https://scopelock-rafael-runner.onrender.com/health
```

**If timeout**: Service may be sleeping (Render free tier). Wait 30s and retry.

### Claude CLI not found

**Check logs** for:
```
Failed to spawn Claude CLI: command not found
```

**Fix**: Ensure buildCommand includes:
```bash
npm install -g @anthropic-ai/claude-code
```

### REPO_PATH incorrect

**Symptom**: Rafael can't find citizens/

**Check**: Render deploys full repo to `/opt/render/project/src`

**Fix**: Set `REPO_PATH=/opt/render/project/src` in render.yaml

---

## Architecture Decision

**Why not run Rafael in Python backend?**
- Python backend can't install Node.js (native runtime)
- Docker adds 3-5 min build time
- 2 services = cleaner, simpler

**Trade-off**:
- ✅ Faster builds (~1 min each vs 3-5 min Docker)
- ✅ Native runtimes (Python + Node.js)
- ✅ Clear separation
- ❌ Cost: $14/month vs $7/month (but worth it for simplicity)

---

**Rafael Runner ready. Executes citizens with full tool access.**
