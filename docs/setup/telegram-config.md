# Telegram Bot Configuration

**Purpose**: Send draft notifications with approval buttons to Nicolas
**Cost**: $0 (free)
**Setup time**: 10 minutes (one-time)

---

## Overview

```
Rafael drafts response → Writes draft file → Calls backend /api/notify/draft
  ↓
Backend sends Telegram message with [✅ Approve] [✏️ Edit] [❌ Reject] buttons
  ↓
Nicolas clicks button → Telegram callback → Backend updates draft file status
```

**Why Telegram**:
- ✅ Free forever (no API costs)
- ✅ Mobile + desktop notifications
- ✅ Inline keyboards (approval buttons)
- ✅ Simple Bot API (just httpx, no SDK needed)
- ✅ Nicolas already has bot token

---

## Prerequisites

- Telegram account
- 5 minutes

---

## Step 1: Create Bot via @BotFather (5 minutes)

### 1.1. Start Chat with @BotFather

1. Open Telegram
2. Search for `@BotFather` (official Telegram bot with blue checkmark)
3. Click "Start" or send `/start`

### 1.2. Create New Bot

Send command:
```
/newbot
```

BotFather will ask:
```
Alright, a new bot. How are we going to call it? Please choose a name for your bot.
```

**Name your bot:**
```
ScopeLock Automation
```

BotFather will ask for username:
```
Good. Now let's choose a username for your bot. It must end in `bot`. Like this, for example: TetrisBot or tetris_bot.
```

**Choose username** (must end in "bot"):
```
scopelock_automation_bot
```

### 1.3. Save Bot Token

BotFather will respond with:
```
Done! Congratulations on your new bot. You will find it at t.me/scopelock_automation_bot.
You can now add a description, about section and profile picture for your bot.

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890

For a description of the Bot API, see this page: https://core.telegram.org/bots/api
```

**Copy the token** (long string like `123456789:ABC...`)

---

## Step 2: Get Your Chat ID (2 minutes)

### 2.1. Start Chat with Your Bot

1. Click the link in BotFather's message (e.g., `t.me/scopelock_automation_bot`)
2. Click "Start" to activate the bot

### 2.2. Send Test Message

Send any message to your bot:
```
Hello
```

### 2.3. Get Chat ID via API

**Option A: Use getUpdates API** (easiest)

Open this URL in your browser (replace `YOUR_BOT_TOKEN`):
```
https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```

You'll see JSON response like:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456,
      "message": {
        "message_id": 1,
        "from": {
          "id": 987654321,  ← This is your chat ID
          "is_bot": false,
          "first_name": "Nicolas",
          ...
        },
        "chat": {
          "id": 987654321,  ← Also here
          "first_name": "Nicolas",
          "type": "private"
        },
        "text": "Hello"
      }
    }
  ]
}
```

**Copy the `id` value** (e.g., `987654321`)

**Option B: Use @userinfobot**

1. Search for `@userinfobot` in Telegram
2. Click "Start"
3. Bot will reply with your User ID

---

## Step 3: Configure Backend (3 minutes)

### 3.1. Set Environment Variables in Render

1. Go to https://dashboard.render.com/
2. Select your `scopelock-backend` service
3. Click "Environment" tab
4. Add these variables:

**TELEGRAM_BOT_TOKEN**
```
Value: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
```
(Paste your bot token from Step 1)

**TELEGRAM_CHAT_ID**
```
Value: 987654321
```
(Paste your chat ID from Step 2)

**WEBHOOK_SECRET** (if not already set)
```
Value: (generate with: openssl rand -hex 32)
```

### 3.2. Trigger Redeploy

Click "Manual Deploy" → "Deploy latest commit"

Backend will restart with new environment variables.

---

## Step 4: Test Integration (5 minutes)

### 4.1. Test Notification Endpoint

**Local test** (if running backend locally):

```bash
# Generate test notification
curl -X POST http://localhost:8000/api/notify/draft \
  -H "Content-Type: application/json" \
  -d '{
    "draft_id": "test-uuid-123",
    "client": "Test Client",
    "draft_text": "This is a test draft response for approval.",
    "confidence": 85
  }'
```

**Production test** (after deploying to Render):

```bash
curl -X POST https://scopelock-backend.onrender.com/api/notify/draft \
  -H "Content-Type: application/json" \
  -d '{
    "draft_id": "test-uuid-123",
    "client": "Test Client",
    "draft_text": "This is a test draft response for approval.",
    "confidence": 85
  }'
```

### 4.2. Verify Telegram Message

You should receive a Telegram message like:

```
📝 **New Draft Response**

**Client:** Test Client
**Confidence:** 85%

**Draft:**
```
This is a test draft response for approval.
```

Draft ID: `test-uuid-123`
```

With 3 buttons:
- [✅ Approve]
- [✏️ Edit]
- [❌ Reject]

### 4.3. Test Approval Flow

Click [✅ Approve] button.

Message should update to:

```
✅ **Draft Approved**

**Client:** Test Client
**Confidence:** 85%

**Draft:**
```
This is a test draft response for approval.
```

Draft ID: `test-uuid-123`
Status: **Approved**
```

### 4.4. Verify Draft File Updated

Check backend storage:

```bash
# On Render shell (via dashboard)
cat /var/data/drafts/test-uuid-123.json
```

Should show:
```json
{
  "id": "test-uuid-123",
  "client": "Test Client",
  "draft_text": "This is a test draft response for approval.",
  "confidence": 85,
  "status": "approved",
  "telegram_message_id": "123"
}
```

---

## Troubleshooting

### Bot doesn't send messages

**Check:**
```bash
# Verify bot token is correct
curl https://api.telegram.org/botYOUR_TOKEN/getMe

# Should return:
{
  "ok": true,
  "result": {
    "id": 123456789,
    "is_bot": true,
    "first_name": "ScopeLock Automation",
    "username": "scopelock_automation_bot"
  }
}
```

**If error**:
- Token is invalid → Create new bot with @BotFather
- Token not set in Render → Check environment variables

### Wrong chat ID

**Symptom**: Bot sends messages but you don't receive them

**Fix**:
1. Send `/start` to your bot again
2. Use getUpdates to get correct chat ID
3. Update TELEGRAM_CHAT_ID in Render

### Approval buttons don't work

**Check webhook callback endpoint**:

```bash
# Test callback directly
curl -X POST https://scopelock-backend.onrender.com/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 123,
    "callback_query": {
      "id": "abc",
      "data": "approve:test-uuid-123"
    }
  }'
```

**Check backend logs** in Render dashboard:
- Should see `[telegram:approve] Draft test-uuid-123 approved`

---

## Bot Commands (Optional)

You can set bot commands for convenience:

Send to @BotFather:
```
/setcommands
```

Select your bot, then paste:
```
status - Check backend status
help - Show help message
```

Users can now type `/status` to trigger commands.

---

## Security Notes

1. **Bot token is secret** - Never commit to git
2. **Chat ID is not secret** - But should only be yours
3. **Webhook callbacks** - No signature verification from Telegram (built into SDK)
4. **Draft files** - Stored on disk, not publicly accessible

---

## Cost Estimate

**Telegram Bot API**: $0 (free forever)

**Message limits**:
- 30 messages/second (per bot)
- No monthly cap

**Expected usage** (100 drafts/day):
- 100 notifications/day
- 100 approval callbacks/day
- **Total**: 200 API calls/day (well under limit)

---

## Maintenance

**Never**:
- Token doesn't expire
- Chat ID doesn't change
- No renewal needed

**As needed**:
- Update bot description/photo via @BotFather
- Add commands for convenience

---

## Alternative: Telegram Group

**For multi-user approval**:

1. Create Telegram group
2. Add bot to group (`@scopelock_automation_bot`)
3. Make bot admin (to post messages)
4. Get group chat ID (negative number, e.g., `-987654321`)
5. Set `TELEGRAM_CHAT_ID=-987654321` in Render

All group members can now approve drafts.

---

## Next Steps

After Telegram is configured:
1. Test end-to-end with real Gmail webhook (see `gmail-webhook-cloudfunction.md`)
2. Deploy backend to Render (see `render-deploy.md`)
3. Run full integration test (see `testing.md`)

---

**Telegram bot ready. Notifications + approvals working.**
