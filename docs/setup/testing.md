# End-to-End Testing & Verification

**Purpose**: Verify complete automation flow works correctly
**Time**: 30 minutes
**Prerequisites**: Gmail webhook, Telegram bot, and backend deployed

---

## Testing Strategy

We test 3 levels:

1. **Unit tests** - Individual components (backend endpoints)
2. **Integration tests** - Component pairs (Gmail → Backend, Backend → Telegram)
3. **End-to-end test** - Full flow (Gmail → Backend → Claude → Telegram → Approval)

---

## Unit Tests

### Test 1: Backend Health Check

**Purpose**: Verify backend is running

```bash
curl https://scopelock-backend.onrender.com/health
```

**Expected response**:
```json
{
  "status": "healthy",
  "uptime_seconds": 1234,
  "services": {
    "file_storage": {
      "status": "connected",
      "last_check": "2025-11-02T23:50:00Z"
    },
    "telegram_bot": {
      "status": "connected",
      "last_check": "2025-11-02T23:50:00Z"
    },
    "claude_cli": {
      "status": "connected",
      "last_check": "2025-11-02T23:50:00Z"
    }
  }
}
```

**Pass criteria**: `status == "healthy"`, all services `"connected"`

---

### Test 2: Webhook Signature Verification

**Purpose**: Verify HMAC authentication works

**Generate signature**:
```bash
# Set your webhook secret
WEBHOOK_SECRET="your-secret-from-render-env"

# Payload
PAYLOAD='{"client":"Test","message":"Hello","job_title":"Test Job","job_link":"https://test.com"}'

# Generate HMAC-SHA256 signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

echo "Signature: $SIGNATURE"
```

**Test with valid signature**:
```bash
curl -X POST https://scopelock-backend.onrender.com/webhook/upwork \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Expected**: 200 OK + Rafael runs

**Test with invalid signature**:
```bash
curl -X POST https://scopelock-backend.onrender.com/webhook/upwork \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: invalid-signature" \
  -d "$PAYLOAD"
```

**Expected**: 401 Unauthorized
```json
{
  "detail": "Invalid webhook signature"
}
```

**Pass criteria**: Valid signature accepted, invalid rejected

---

### Test 3: Telegram Notification

**Purpose**: Verify Telegram bot can send messages

```bash
curl -X POST https://scopelock-backend.onrender.com/api/notify/draft \
  -H "Content-Type: application/json" \
  -d '{
    "draft_id": "test-notification-123",
    "client": "Unit Test Client",
    "draft_text": "This is a unit test notification.",
    "confidence": 90
  }'
```

**Expected response**:
```json
{
  "telegram_sent": true,
  "message_id": "456"
}
```

**Check Telegram**: You should receive message with approval buttons

**Pass criteria**: Message received in Telegram with 3 buttons

---

### Test 4: Telegram Approval Callback

**Purpose**: Verify approval button updates draft file

**Click [✅ Approve] button** in Telegram (from Test 3 message)

**Check backend response** (via Render logs):
```
[telegram:approve] Draft test-notification-123 approved
```

**Verify draft file**:
```bash
# Via Render shell or SSH
cat /var/data/drafts/test-notification-123.json
```

**Expected**:
```json
{
  "id": "test-notification-123",
  "client": "Unit Test Client",
  "draft_text": "This is a unit test notification.",
  "confidence": 90,
  "status": "approved",
  "telegram_message_id": "456"
}
```

**Pass criteria**: `status == "approved"`, Telegram message updated

---

## Integration Tests

### Test 5: Gmail → Backend (Mock Webhook)

**Purpose**: Verify Gmail webhook can trigger Rafael

**Generate valid signature**:
```bash
WEBHOOK_SECRET="your-secret"
PAYLOAD='{
  "client": "Integration Test Client",
  "message": "Can we schedule a call to discuss the project?",
  "job_title": "Build AI Chat Widget",
  "job_link": "https://upwork.com/jobs/test"
}'

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)
```

**Send webhook**:
```bash
curl -X POST https://scopelock-backend.onrender.com/webhook/upwork \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Expected backend logs** (check Render dashboard):
```
[webhook:upwork] Received response from Integration Test Client
[runner:rafael] Starting Claude Code session
[runner:rafael] Session completed successfully
```

**Expected output**:
```json
{
  "status": "triggered",
  "citizen": "rafael",
  "output": "Rafael's response (first 200 chars)..."
}
```

**Pass criteria**:
- Rafael runs successfully
- No error in logs
- Response status == "triggered"

---

### Test 6: Rafael → Telegram (Full Draft Flow)

**Purpose**: Verify Rafael can create draft and trigger notification

**Manually run Rafael** (simulate what webhook does):

```bash
cd /home/mind-protocol/scopelock

export BACKEND_API_URL="https://scopelock-backend.onrender.com"

claude --print "New Upwork response from Test Client: Can we hop on a call?

Job: Build AI Chat Widget
Link: https://upwork.com/jobs/test123

Draft a response following ScopeLock principles and call POST /api/notify/draft when ready." --continue
```

**Rafael should**:
1. Draft a response
2. Create draft file: `Write(draft-{uuid}.json, ...)`
3. Call backend: `Bash("curl -X POST $BACKEND_API_URL/api/notify/draft ...")`

**Expected Telegram message**: Draft notification with approval buttons

**Pass criteria**:
- Rafael completes without errors
- Draft file created
- Telegram notification sent
- Approval buttons work

---

## End-to-End Test

### Test 7: Full Gmail → Rafael → Telegram → Approval Flow

**Purpose**: Verify complete automation pipeline

**Step 1: Trigger via Gmail Webhook (Cloud Function)**

Option A: **Send real test email** to your Gmail

```
From: test@upwork.com
Subject: New message from Integration Test Client on Upwork
Body:
Hi Nicolas,

I reviewed your profile and I'm interested in working together.
Can we schedule a call this week to discuss the project?

Best,
Test Client
```

Option B: **Trigger Cloud Function directly** (if configured)

```bash
# Via Cloud Function HTTP trigger
curl -X POST https://us-central1-YOUR-PROJECT.cloudfunctions.net/gmail-upwork-webhook-http \
  -H "Content-Type: application/json" \
  -d '{
    "client": "E2E Test Client",
    "message": "Can we schedule a call?",
    "job_title": "Build AI Chat Widget",
    "job_link": "https://upwork.com/jobs/test"
  }'
```

**Step 2: Verify Gmail → Backend**

Check Cloud Function logs:
```
Received notification...
Calling Render webhook...
```

Check Backend logs (Render):
```
[webhook:upwork] Received response from E2E Test Client
[runner:rafael] Starting Claude Code session
```

**Step 3: Verify Rafael Runs**

Rafael (Claude Code session) should:
1. Load system prompt: `citizens/rafael/CLAUDE.md`
2. Read context: `citizens/SYNC.md`, `citizens/emma/proposals/`
3. Draft response using ScopeLock principles
4. Create draft file
5. Call `/api/notify/draft`

**Step 4: Verify Telegram Notification**

You should receive Telegram message:
```
📝 **New Draft Response**

**Client:** E2E Test Client
**Confidence:** 85%

**Draft:**
```
[Rafael's drafted response]
```

Draft ID: `{uuid}`
```

With buttons: [✅ Approve] [✏️ Edit] [❌ Reject]

**Step 5: Test Approval Flow**

Click [✅ Approve]

Message should update:
```
✅ **Draft Approved**

[same content]

Status: **Approved**
```

**Step 6: Verify Draft File Updated**

```bash
# Via Render shell
ls /var/data/drafts/
cat /var/data/drafts/{uuid}.json
```

Should show `"status": "approved"`

**Pass Criteria** (all must pass):
1. ✅ Gmail webhook triggers backend
2. ✅ Backend runs Rafael via Claude CLI
3. ✅ Rafael drafts response
4. ✅ Rafael creates draft file
5. ✅ Rafael calls notification endpoint
6. ✅ Telegram message sent with buttons
7. ✅ Approval button updates draft status
8. ✅ No errors in any logs

---

## Performance Tests

### Test 8: Response Time

**Gmail Webhook → Telegram Notification latency**

**Expected**:
- Gmail webhook → Backend: <500ms
- Backend → Rafael start: <1s
- Rafael draft → Telegram: <30s (depends on Claude Code response time)
- **Total**: <35s from Gmail to Telegram

**Measure**:
```bash
# Time the webhook call
time curl -X POST https://scopelock-backend.onrender.com/webhook/upwork \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Pass criteria**: Backend responds <2s (Rafael runs asynchronously)

---

### Test 9: Concurrent Webhooks

**Purpose**: Verify backend handles multiple webhooks

```bash
# Send 5 webhooks in parallel
for i in {1..5}; do
  curl -X POST https://scopelock-backend.onrender.com/webhook/upwork \
    -H "X-Webhook-Signature: $SIGNATURE" \
    -d "{\"client\":\"Client $i\",\"message\":\"Test\",\"job_title\":\"Job\",\"job_link\":\"https://test.com\"}" &
done

wait
```

**Expected**: All 5 webhooks processed, 5 Rafael sessions run

**Pass criteria**: No timeouts, no errors, all drafts created

---

## Failure Tests

### Test 10: Invalid Webhook Signature

**Already tested in Unit Test 2**

**Pass criteria**: 401 Unauthorized

---

### Test 11: Rafael Timeout

**Purpose**: Verify backend handles Claude CLI timeout

**Mock long-running Rafael** (edit `backend/app/runner.py` temporarily):

```python
# In _run_claude, reduce timeout to 5s
result = subprocess.run(
    ["claude", "--print", prompt, "--continue"],
    timeout=5  # Reduced from 120s
)
```

**Trigger webhook** with complex prompt that takes >5s

**Expected**:
```json
{
  "success": false,
  "error": "Claude session timeout after 5s"
}
```

**Pass criteria**: Backend doesn't crash, returns error gracefully

---

### Test 12: Telegram API Down

**Purpose**: Verify backend handles Telegram failures

**Mock Telegram failure** (edit `backend/app/telegram.py` temporarily):

```python
# In send_message, force failure
raise Exception("Telegram API unavailable")
```

**Trigger notification**:
```bash
curl -X POST https://scopelock-backend.onrender.com/api/notify/draft \
  -d '{"draft_id":"test","client":"Test","draft_text":"Test","confidence":80}'
```

**Expected backend logs**:
```
[telegram:send] Failed to send message: Telegram API unavailable
```

**Pass criteria**:
- Backend doesn't crash
- Error logged with code_location
- Draft file still created
- Returns error response

---

## Test Checklist

Before going to production, all tests must pass:

**Unit Tests**:
- [ ] Backend health check returns "healthy"
- [ ] HMAC signature verification works (valid accepted, invalid rejected)
- [ ] Telegram notification sends successfully
- [ ] Approval callback updates draft file

**Integration Tests**:
- [ ] Gmail webhook triggers Rafael
- [ ] Rafael creates draft and triggers Telegram
- [ ] Approval flow works end-to-end

**End-to-End**:
- [ ] Full Gmail → Rafael → Telegram → Approval flow works
- [ ] No errors in any logs
- [ ] Draft file created and updated correctly

**Performance**:
- [ ] Backend responds <2s
- [ ] Concurrent webhooks handled correctly

**Failure Handling**:
- [ ] Invalid signatures rejected
- [ ] Timeouts handled gracefully
- [ ] External API failures don't crash backend

---

## Monitoring After Launch

### Daily Checks

**Check backend health**:
```bash
curl https://scopelock-backend.onrender.com/health | jq
```

**Check Render logs** for errors:
- Go to https://dashboard.render.com/
- Select `scopelock-backend`
- Click "Logs" tab
- Look for `[ERROR]` or `[WARNING]`

**Check Telegram notifications**:
- Verify drafts arriving
- Test approval buttons

### Weekly Checks

**Check disk usage**:
```bash
# Via Render shell
du -sh /var/data/drafts/
du -sh /var/data/events.jsonl
```

**If >500MB**: Clean up old drafts (keep last 30 days)

**Check Cloud Function invocations** (if using GCP):
- Go to https://console.cloud.google.com/functions
- Check `gmail-upwork-webhook` metrics
- Verify <2M invocations/month (free tier limit)

### Monthly Checks

**Review costs**:
- Render: $7/month (should be constant)
- Google Cloud: $0 (verify under free tier)
- Telegram: $0 (always free)

**Review metrics**:
- Number of drafts created
- Approval rate (approved / total)
- Average response time

---

## Troubleshooting

### Gmail webhook not triggering

**Check**:
1. Cloud Function deployed? (`gcloud functions list`)
2. Gmail watch active? (Run `python scripts/setup-gmail-watch.py` again)
3. Pub/Sub subscription exists? (`gcloud pubsub subscriptions list`)

**Fix**: Re-run Gmail setup from `gmail-webhook-cloudfunction.md`

---

### Rafael not running

**Check backend logs**:
```
[runner:rafael] claude CLI not found
```

**Fix**: Ensure Claude Code is installed on Render instance

**Or**:
```
[runner:rafael] /home/mind-protocol/scopelock not found
```

**Fix**: Clone scopelock repo on Render instance

---

### Telegram notifications not arriving

**Check**:
```bash
curl https://api.telegram.org/botYOUR_TOKEN/getMe
```

**If error**: Token is invalid → Re-create bot with @BotFather

**Check backend logs**:
```
[telegram:send] API error: Forbidden: bot was blocked by the user
```

**Fix**: Unblock bot in Telegram, send `/start` again

---

### Approval buttons not working

**Check Telegram webhook callback**:
```
[webhook:telegram] No callback_query in update
```

**Fix**: Ensure `/webhook/telegram` endpoint is accessible

**Check draft file**:
```bash
ls /var/data/drafts/{uuid}.json
```

**If missing**: Rafael didn't create file → Check Rafael logs

---

## Next Steps

After all tests pass:

1. ✅ Deploy to production
2. ✅ Monitor for 1 week
3. ✅ Document any issues in `SYNC.md`
4. ✅ Iterate on Rafael's system prompt if needed

---

**Testing complete. Automation ready for production.**
