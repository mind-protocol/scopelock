# Claude CLI Setup for Render Backend

## Overview

The backend calls Claude CLI to get Rafael's responses for chat. Claude CLI needs credentials to authenticate.

**Good news:** You only need to set environment variables ONCE. The backend automatically writes them to the filesystem on every deployment.

## How It Works

1. **Render Environment Variables** (set once, persist forever)
   - `CLAUDE_CREDENTIALS` - Your Claude session credentials
   - `CLAUDE_SETTINGS` - Claude CLI preferences (optional)

2. **Backend Startup** (automatic on every deploy)
   - `runner.py` reads env vars
   - Writes `~/.claude/.credentials.json`
   - Writes `~/.claude/settings.json` (if provided)
   - Logs confirmation: "✅ Claude credentials written"

3. **Chat Endpoint** (uses written files)
   - User sends chat message
   - Backend calls: `claude -p "message" --continue`
   - Claude CLI reads credentials from `~/.claude/.credentials.json`
   - Response returned to user

**No manual upload needed after each deployment!** Environment variables persist, and the startup script handles file creation automatically.

---

## Step 1: Get Credentials from Local Machine

### Option A: Read Files Directly (Recommended)

```bash
# On your local machine where Claude CLI is authenticated:

# 1. View credentials
cat ~/.claude/.credentials.json

# 2. View settings (optional)
cat ~/.claude/settings.json
```

### Option B: Use JSON Tools (If Multi-line)

If credentials span multiple lines, convert to single-line JSON:

```bash
# Credentials (required)
cat ~/.claude/.credentials.json | jq -c

# Settings (optional)
cat ~/.claude/settings.json | jq -c
```

**Example Output:**
```json
{"sessionKey":"sk_ant_sid01-AbCdEf...","email":"you@example.com"}
```

---

## Step 2: Add to Render Environment Variables

### Via Render Dashboard (Easiest)

1. Go to: https://dashboard.render.com/web/srv-d43toq3ipnbc73cb5kqg
2. Navigate to: **Environment** tab
3. Click: **Add Environment Variable**
4. Add credentials:
   - **Key:** `CLAUDE_CREDENTIALS`
   - **Value:** Paste the JSON from Step 1 (entire file as single line)
   - Click **Save**
5. *(Optional)* Add settings:
   - **Key:** `CLAUDE_SETTINGS`
   - **Value:** Paste settings JSON
   - Click **Save**
6. Render will automatically redeploy with new environment variables

### Via Render API (For Automation)

```bash
# Set CLAUDE_CREDENTIALS
curl -X PUT "https://api.render.com/v1/services/srv-d43toq3ipnbc73cb5kqg/env-vars/CLAUDE_CREDENTIALS" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "{\"sessionKey\":\"sk_ant_...\",\"email\":\"you@example.com\"}"
  }'

# Set CLAUDE_SETTINGS (optional)
curl -X PUT "https://api.render.com/v1/services/srv-d43toq3ipnbc73cb5kqg/env-vars/CLAUDE_SETTINGS" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "{\"model\":\"claude-sonnet-4.5\",\"maxTokens\":8000}"
  }'
```

**Important:** Escape quotes in JSON when using curl!

---

## Step 3: Verify Setup

After deployment completes, check Render logs:

```
✅ Claude credentials written to /home/user/.claude/.credentials.json
✅ Claude settings written to /home/user/.claude/settings.json
```

If you see warnings:
```
⚠️  CLAUDE_CREDENTIALS not set, Claude CLI may fail
```

→ Go back to Step 2 and verify environment variables are set correctly.

---

## Troubleshooting

### "Token decode error" in logs

**Symptom:** Chat gives 401 errors, logs show token decode errors

**Cause:** Wrong issue - this is JWT_SECRET not Claude credentials

**Fix:** Add JWT_SECRET to Render (see main README.md)

### "Claude CLI not found"

**Symptom:** Logs show "Claude CLI not found - ensure it's installed via build.sh"

**Cause:** Build script didn't install Claude CLI

**Fix:**
1. Check `backend/build.sh` exists and installs Claude CLI
2. Verify build command in Render: `./backend/build.sh`

### "CLAUDE_CREDENTIALS not set"

**Symptom:** Warning in logs, chat fails with authentication errors

**Cause:** Environment variable not added to Render

**Fix:**
1. Go to Render dashboard
2. Environment tab
3. Add `CLAUDE_CREDENTIALS` (see Step 2)
4. Redeploy

### Credentials expired (sessionKey invalid)

**Symptom:** Chat works initially, then fails after days/weeks

**Cause:** Claude session expired (sessions expire after ~30 days)

**Fix:**
1. Re-authenticate Claude CLI on local machine: `claude auth login`
2. Get new credentials: `cat ~/.claude/.credentials.json`
3. Update Render environment variable (Step 2)
4. Redeploy

---

## Security Notes

**DO NOT commit credentials to git!**
- ✅ Store in Render environment variables
- ✅ Use `.env` locally (gitignored)
- ❌ Never commit `.env` or credentials to git

**Credentials contain:**
- `sessionKey` - Your Claude authentication token
- `email` - Your Claude account email

If compromised, anyone can use Claude on your subscription.

---

## When to Update

**Automatic (no action needed):**
- ✅ After every deployment (runner.py writes files)
- ✅ When backend restarts (runner.py runs on startup)

**Manual update required:**
- ⚠️ When session expires (~30 days)
- ⚠️ When you change Claude account
- ⚠️ When you reset Claude CLI authentication

**To update:**
1. Get new credentials from local machine (Step 1)
2. Update Render environment variable (Step 2)
3. Render redeploys automatically

---

## Quick Reference

**Local machine commands:**
```bash
# View credentials
cat ~/.claude/.credentials.json | jq -c

# View settings
cat ~/.claude/settings.json | jq -c

# Test Claude CLI works locally
claude --help
```

**Render dashboard:**
- Dashboard: https://dashboard.render.com/web/srv-d43toq3ipnbc73cb5kqg
- Environment: https://dashboard.render.com/web/srv-d43toq3ipnbc73cb5kqg/env

**Backend code:**
- Credential setup: `backend/app/runner.py` (lines 39-72)
- Chat endpoint: `backend/app/api/mission_deck/chat.py`
- Rafael CLI service: `backend/app/api/mission_deck/services/rafael_cli.py`

---

## Summary

**One-time setup:**
1. Get credentials from `~/.claude/.credentials.json`
2. Add to Render environment variables
3. Done! ✅

**Automatic on every deploy:**
- Backend reads env vars
- Writes files to `~/.claude/`
- Chat with Rafael works

**No manual upload needed!**
