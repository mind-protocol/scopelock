# Vercel Auto-Fix - Rafael Auto-Invocation

**Status:** ✅ INTEGRATED into Mission Deck backend (see below)

**Purpose:** Automatically invoke Rafael when Vercel deployments fail, enabling autonomous deployment fixing.

**Integration:** This webhook is now integrated into the Mission Deck FastAPI backend at:
- **File:** `/docs/missions/mission-deck/backend/routers/webhooks.py`
- **Endpoint:** `POST /api/webhooks/vercel-failure`
- **Registered in:** `main.py` (included with other routers)

The standalone Express server in this directory is **no longer used** and kept only for reference.

## Architecture

```
Vercel Deployment Fails
    ↓
Webhook sent to Render server
    ↓
Server invokes `claude` CLI with failure details
    ↓
Rafael investigates using Vercel MCP
    ↓
Rafael fixes the issue
    ↓
Rafael pushes fix to main
    ↓
Vercel auto-deploys fixed version
```

## Deployment to Render

### 1. Create New Web Service

1. Go to Render Dashboard: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect to GitHub repository: `mind-protocol/scopelock`
4. Configure service:
   - **Name:** `vercel-auto-fix`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `tools/vercel-auto-fix`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 2. Set Environment Variables

In Render dashboard, add:

```bash
NODE_ENV=production
PORT=3100
```

### 3. Deploy

Click "Create Web Service" and wait for deployment to complete.

**Service URL will be:** `https://vercel-auto-fix.onrender.com`

## Configure Vercel Webhook

### 1. Go to Vercel Project Settings

1. Open https://vercel.com/mindprotocol/scopelock
2. Go to Settings → Git → Deploy Hooks

### 2. Add Webhook

Actually, use Integration Webhooks instead:

1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. Configure:
   - **Endpoint:** `https://vercel-auto-fix.onrender.com/vercel-webhook`
   - **Events:** Select only `deployment.error` (or `deployment` if that's not available)
   - **Projects:** Select `scopelock`

4. Click "Create Webhook"
5. Copy the webhook secret (optional, for future HMAC verification)

### 3. Test the Webhook

Trigger a deployment failure (or wait for one) and check Render logs to verify Rafael is invoked.

## Local Testing

### 1. Install Dependencies

```bash
cd /home/mind-protocol/scopelock/tools/vercel-auto-fix
npm install
```

### 2. Run Server

```bash
npm start
```

Server runs on http://localhost:3100

### 3. Test Health Check

```bash
curl http://localhost:3100/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "vercel-auto-fix",
  "uptime": 123.45,
  "handledDeployments": 0
}
```

### 4. Simulate Webhook (Manual Test)

```bash
curl -X POST http://localhost:3100/vercel-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "dpl_test123",
    "name": "scopelock",
    "url": "scopelock-test.vercel.app",
    "state": "ERROR",
    "target": "production",
    "meta": {
      "githubCommitMessage": "test: simulate failure",
      "githubCommitSha": "abc123def456"
    }
  }'
```

This will invoke Rafael with a test failure.

## How It Works

### 1. Webhook Received

When Vercel deployment fails, webhook POST is sent to `/vercel-webhook` with:

```json
{
  "id": "dpl_ABC123",
  "name": "scopelock",
  "url": "scopelock-xyz.vercel.app",
  "state": "ERROR",
  "target": "production",
  "meta": {
    "githubCommitMessage": "fix: some change",
    "githubCommitSha": "abc123..."
  }
}
```

### 2. Rafael Invoked

Server executes:

```bash
cd /home/mind-protocol/scopelock/citizens/rafael && \
claude -p "Vercel deployment FAILED..." --continue --dangerously-skip-permissions
```

### 3. Rafael Investigates

Rafael's session starts with full context:
- Deployment ID
- Project name
- Commit SHA
- Inspector URL
- Task: "Fix this autonomously using Vercel MCP"

### 4. Rafael Fixes

Rafael:
1. Uses `mcp__vercel__get_deployment_build_logs` to see error
2. Diagnoses root cause
3. Fixes code
4. Commits and pushes to main
5. Updates SYNC.md with fix details

### 5. Vercel Re-deploys

Push to main triggers new Vercel deployment (should succeed this time).

## Duplicate Prevention

The server tracks handled deployment IDs in `handled-deployments.json` to avoid:
- Processing the same failure twice
- Infinite loops if fix doesn't work

## Monitoring

### Check Render Logs

View real-time logs in Render dashboard to see:
- Webhook receipts
- Rafael invocations
- Fix completions

### Health Check

```bash
curl https://vercel-auto-fix.onrender.com/health
```

Returns:
- Service status
- Uptime
- Number of handled deployments

## Troubleshooting

### Issue: Webhook not received

**Check:**
1. Render service is running (green status)
2. Vercel webhook is configured correctly
3. Endpoint URL is correct: `https://vercel-auto-fix.onrender.com/vercel-webhook`

### Issue: Rafael not invoked

**Check:**
1. Render logs show "INVOKING RAFAEL" message
2. Claude CLI is accessible on Render server (may need to install)
3. Credentials are available: `~/.claude/.credentials.json`

**Note:** Render free tier may not have Claude CLI installed. You may need to:
- Upgrade to paid tier for persistent disk
- Or use Claude API instead of CLI

### Issue: Same error keeps triggering

**Solution:** Check `handled-deployments.json` - if deployment ID is already there, it won't be processed again. This is intentional to prevent loops.

## Future Enhancements

- [ ] HMAC signature verification for webhook security
- [ ] Retry logic if fix fails
- [ ] Slack/Discord notifications when Rafael completes a fix
- [ ] Dashboard showing fix history
- [ ] Support for other projects beyond scopelock

## Security Notes

- Webhook endpoint is public (anyone can POST to it)
- Consider adding HMAC verification using Vercel webhook secret
- Limit to production deployments only (already implemented)
- Duplicate prevention via deployment ID tracking

---

**Built by:** rafael@scopelock
**Deployed on:** Render (https://vercel-auto-fix.onrender.com)
**Monitors:** Vercel deployments for mind-protocol/scopelock
