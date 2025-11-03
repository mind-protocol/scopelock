# CloudMailin Setup for Gmail → Render Webhook

**Purpose**: Convert Gmail notifications to HTTP webhooks (simpler alternative to Cloud Functions)
**Cost**: $0 (free tier: 10K emails/month)
**Setup time**: 5 minutes

---

## Why CloudMailin?

- ✅ No OAuth complexity
- ✅ No Google Cloud Functions
- ✅ No Pub/Sub configuration
- ✅ 5-minute setup vs 30-minute Cloud Function
- ✅ Free tier is generous (10K emails/month)
- ✅ Production-grade reliability

---

## Step 1: Sign Up for CloudMailin (2 minutes)

1. Go to: https://www.cloudmailin.com/
2. Click "Sign Up" (free account)
3. Verify your email
4. Log in to dashboard

---

## Step 2: Create Email Address (1 minute)

1. In CloudMailin dashboard, click "Create Address"
2. **Address format**: `<random>@cloudmailin.net` (automatically generated)
3. **Target URL**: `https://scopelock-backend.onrender.com/api/webhooks/cloudmailin`
4. **Format**: Select "JSON (Normalized)" (easiest to parse)
5. Click "Create Address"

**Example CloudMailin address**: `rafael-4f3c2a@cloudmailin.net`

---

## Step 3: Configure Gmail Filter (2 minutes)

### 3.1. Create Gmail Filter

1. Open Gmail: https://mail.google.com/
2. Click Settings (gear icon) → "See all settings"
3. Go to "Filters and Blocked Addresses" tab
4. Click "Create a new filter"

**Filter criteria:**
- From: `@upwork.com`
- Subject: `New message from`

5. Click "Create filter"

**Filter actions:**
- ✅ Skip the Inbox (Archive it)
- ✅ Forward it to: `<your-cloudmailin-address>@cloudmailin.net`

6. Click "Create filter"

### 3.2. Verify Forwarding Address

Gmail will send a verification email to CloudMailin:
1. Check CloudMailin dashboard → Messages
2. Open the verification email from Gmail
3. Click the verification link
4. Confirm forwarding is active

---

## Step 4: Update Backend Webhook (Done)

The backend webhook endpoint `/api/webhooks/cloudmailin` is already configured to:
- Parse CloudMailin's JSON format
- Extract Upwork client name and message
- Trigger Rafael via Citizen Runner
- Send Telegram notification with inline approval

---

## Step 5: Test the Setup (5 minutes)

### 5.1. Send Test Email

**Option A: Gmail to Gmail**
1. From another Gmail account (or the same one)
2. Send email to your Gmail
3. From: Make it look like it's from Upwork (or just test)
4. Subject: "New message from Test Client on Upwork"
5. Body: "Can we schedule a call to discuss your proposal?"

**Option B: Forward Existing Upwork Email**
1. Find an existing Upwork email
2. Forward it to: `<your-cloudmailin-address>@cloudmailin.net`

### 5.2. Verify CloudMailin Received

1. Go to CloudMailin dashboard → Messages
2. You should see the test email
3. Status should be "200 OK" (webhook delivered successfully)

### 5.3. Verify Backend Processed

Check Render logs for backend:
```bash
# Should see:
POST /api/webhooks/cloudmailin 200
[cloudmailin] Parsed email from: Test Client
[runner:rafael] Calling Citizen Runner service
[telegram] Draft notification sent
```

### 5.4. Verify Telegram Notification

Check your Telegram chat:
- Should receive message: "📝 New Draft Ready"
- From: Test Client
- Preview of the message
- Approve/Reject buttons

---

## Troubleshooting

### CloudMailin shows 4xx/5xx error

**Check:**
1. Backend is deployed and healthy: `https://scopelock-backend.onrender.com/health`
2. Webhook URL is correct in CloudMailin settings
3. Check Render backend logs for errors

**Fix:**
- Redeploy backend if needed
- Update CloudMailin target URL
- Check WEBHOOK_SECRET environment variable

### Gmail not forwarding

**Check:**
1. Filter is active (Gmail Settings → Filters)
2. Forwarding address is verified (Gmail Settings → Forwarding)
3. Email matches filter criteria (from @upwork.com, subject contains "New message from")

**Fix:**
- Recreate Gmail filter
- Re-verify CloudMailin forwarding address
- Test with manual forward first

### Backend not parsing email correctly

**Check CloudMailin format:**
- Dashboard → Settings → Message Format
- Should be: "JSON (Normalized)"

**Check backend logs:**
- Look for parsing errors
- Verify envelope.from and subject extraction

### Telegram not receiving notifications

**Check:**
1. TELEGRAM_BOT_TOKEN is set correctly
2. TELEGRAM_CHAT_ID is correct
3. Bot has permission to send messages to chat

**Fix:**
- Test bot directly: `/start` command in Telegram
- Check backend health: `/health` endpoint
- Verify environment variables in Render dashboard

---

## Security Notes

**CloudMailin Address Security:**
- Your CloudMailin address is semi-private (hard to guess)
- Anyone with the address can send emails to your webhook
- Consider adding authentication in webhook endpoint

**Recommendation for Production:**
1. Use CloudMailin's SPF/DKIM verification (paid plan)
2. Add IP whitelist in backend (only accept from CloudMailin IPs)
3. Implement rate limiting

**For MVP:** Current setup is fine (CloudMailin validates incoming emails)

---

## Cost & Limits

**Free Tier:**
- 10,000 emails/month
- 30-day history
- JSON/raw formats
- Community support

**Expected Usage:**
- ~100 Upwork responses/month
- Well under free tier limits

**If you exceed:** Upgrade to $9/month (100K emails)

---

## CloudMailin Address Management

**Your CloudMailin addresses:**
- Create multiple addresses for different purposes
- rafael@... → Upwork client responses
- emma@... → Lead notifications (future)
- sofia@... → Quality alerts (future)

**Best practice:** One address per workflow for easier filtering

---

## Maintenance

**Weekly:**
- Check CloudMailin dashboard for failed deliveries
- Monitor Render logs for errors

**Monthly:**
- Review CloudMailin usage (dashboard shows email count)
- Clean up old messages if needed

**As needed:**
- Update webhook URL if backend URL changes
- Rotate WEBHOOK_SECRET if compromised

---

## Next Steps

After CloudMailin is configured:
1. ✅ Gmail watch configured (7-day expiry, renew weekly)
2. ✅ CloudMailin forwarding emails to backend
3. ⏳ Deploy backend to Render
4. ⏳ Test end-to-end: Gmail → CloudMailin → Backend → Telegram → Approval
5. ⏳ Configure SLA monitoring (<2h response time)

---

## Alternative: Keep Gmail Watch

**Why you might want both:**
- Gmail Watch: Real-time notifications via Pub/Sub
- CloudMailin: Backup/redundancy

**Why choose one:**
- CloudMailin alone is simpler and sufficient for MVP
- Gmail Watch requires Cloud Function to be useful

**Recommendation:** Use CloudMailin only for MVP, add Gmail Watch + Cloud Function later if needed for redundancy or advanced filtering.
