# Emma + Vollna Webhook Integration

**Purpose:** Receive Vollna job notifications, evaluate with Emma, draft ScopeLock proposals, send Telegram notifications for approval.

## Architecture

```
Vollna filters jobs (30+ attributes)
  ↓ Real-time webhook
Backend receives job data
  ↓ Wake Emma citizen
Emma evaluates (GO/NO-GO + confidence)
  ↓ Track lead (Feature 3)
Draft ScopeLock proposal
  ↓ Send Telegram notification
You review and approve
  ↓ Manual submission to Upwork
Update tracker with "sent" status
```

## Setup

### 1. Install Dependencies

```bash
cd services/emma-vollna
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
- `VOLLNA_WEBHOOK_SECRET` - From Vollna webhook settings
- `TELEGRAM_BOT_TOKEN` - From @BotFather
- `TELEGRAM_CHAT_ID` - Your Telegram user ID
- `SITE_URL` - Your ScopeLock website URL
- `CAL_COM_URL` - Your Cal.com booking URL

### 3. Run Locally (Development)

```bash
npm run dev
```

Server runs on `http://localhost:3001`

Test webhook endpoint:
```bash
curl http://localhost:3001/health
```

### 4. Deploy to Render

Create `render.yaml` in project root (see deployment config below).

```bash
git push origin main
# Render auto-deploys
```

Your webhook URL will be:
```
https://scopelock-backend.onrender.com/webhook/vollna-job
```

### 5. Configure Vollna Webhook

In Vollna dashboard:
1. Go to Integrations → Webhooks
2. Add webhook URL: `https://scopelock-backend.onrender.com/webhook/vollna-job`
3. Select events: "New Job Posted"
4. Select feeds: All 5 feeds
5. Test webhook

## Usage

### Webhook Flow

1. **Vollna detects job** matching your filters
2. **Webhook fires** → POST to `/webhook/vollna-job`
3. **Emma evaluates** (via Claude Code CLI)
4. **Lead tracked** (Feature 3: `scripts/track-lead.py`)
5. **Proposal drafted** (ScopeLock style)
6. **Telegram notification** sent with buttons

### Telegram Notification Format

```
✅ HIGH CONFIDENCE (87%)

📋 Build AI chatbot for patient engagement
💰 Budget: $8,000
📊 Client: $50K spent, 5.0⭐, 23 hires
📢 Proposals: 5 to 10
🎯 Feed: STRONG GO - Premium AI

Emma's reasoning:
Perfect TherapyKin match. Healthcare + AI + verified client + premium budget.

Urgency: 8/10 | Pain: 7/10

Proposal preview:
I see you need a HIPAA-compliant chatbot for patient engagement...

[Full proposal attached]

[✅ Submit] [✏️ Edit] [❌ Skip]
```

### Approval Actions

**Submit:** Get instructions to manually submit proposal to Upwork
**Edit:** Request to edit proposal before submitting
**Skip:** Ignore this job, don't submit

## Files

- `webhook.js` - Main webhook receiver + Telegram callback handler
- `evaluator.js` - Emma evaluation logic (via Claude Code CLI)
- `proposal.js` - ScopeLock proposal generator
- `telegram.js` - Telegram notification system
- `tracker.js` - Lead tracker integration (Feature 3)

## Testing

### Test Webhook Locally

```bash
# Start server
npm run dev

# Send test payload
curl -X POST http://localhost:3001/webhook/vollna-job \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test123",
    "title": "Build AI chatbot",
    "description": "Looking for developer to build HIPAA-compliant AI chatbot...",
    "budget": "$8,000",
    "client": {
      "totalSpent": "$50,000",
      "rating": "5.0",
      "hires": 23,
      "paymentVerified": true
    },
    "proposalsCount": 5,
    "feedName": "STRONG GO - Premium AI",
    "link": "https://www.upwork.com/jobs/~test123"
  }'
```

Expected output:
```
📥 Received Vollna webhook: 2025-11-03T...
📋 Job: Build AI chatbot
💰 Budget: $8,000
🎯 Feed: STRONG GO - Premium AI
🤖 Emma evaluating...
📊 Decision: GO
💭 Reason: Perfect match...
📈 Confidence: 87%
✍️ Drafting ScopeLock proposal...
✅ Proposal drafted and notification sent
```

### Test Emma Evaluation

```bash
# Manually call evaluator
node -e "
const { evaluateWithEmma } = require('./evaluator');
evaluateWithEmma({
  title: 'Build AI chatbot',
  description: 'Looking for developer...',
  budget: '\$8,000',
  client: { totalSpent: '\$50K', rating: '5.0', hires: 23, paymentVerified: true }
}).then(console.log);
"
```

## Deployment

### Render Configuration

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: scopelock-backend
    env: node
    region: oregon
    plan: starter
    buildCommand: cd services/emma-vollna && npm install
    startCommand: cd services/emma-vollna && npm start
    envVars:
      - key: VOLLNA_WEBHOOK_SECRET
        sync: false
      - key: TELEGRAM_BOT_TOKEN
        sync: false
      - key: TELEGRAM_CHAT_ID
        sync: false
      - key: SITE_URL
        value: https://scopelock.mindprotocol.ai
      - key: CAL_COM_URL
        value: https://cal.com/scopelock/kickoff
      - key: PORT
        value: 3001
```

### Environment Variables (Render Dashboard)

Add these in Render → Environment:
- `VOLLNA_WEBHOOK_SECRET` - From Vollna
- `TELEGRAM_BOT_TOKEN` - From @BotFather
- `TELEGRAM_CHAT_ID` - Your Telegram user ID

## Monitoring

### Health Check

```bash
curl https://scopelock-backend.onrender.com/health
```

Response:
```json
{
  "status": "healthy",
  "service": "emma-vollna-webhook",
  "timestamp": "2025-11-03T10:30:00.000Z",
  "proposalsStored": 3
}
```

### Logs

View logs in Render dashboard or:
```bash
render logs scopelock-backend
```

## Troubleshooting

### Webhook not receiving data

1. Check Render logs for errors
2. Test health endpoint
3. Verify Vollna webhook URL is correct
4. Check Vollna webhook test results

### Emma evaluation failing

1. Check Claude Code CLI is accessible
2. Verify Emma citizen directory exists (`citizens/emma/`)
3. Check ANTHROPIC_API_KEY is set
4. Falls back to heuristic evaluation if Emma unavailable

### Telegram notifications not sending

1. Verify TELEGRAM_BOT_TOKEN is correct
2. Verify TELEGRAM_CHAT_ID is your user ID
3. Check bot has permission to send messages
4. Test with `/health` endpoint first

## Next Steps

After deployment:
1. Configure Vollna webhook URL
2. Test with Vollna's test webhook
3. Wait for first real job notification
4. Verify full flow: Webhook → Emma → Telegram → Manual submit
5. Monitor logs for errors
6. Adjust Emma evaluation thresholds if needed

## Support

- Webhook issues: Check Render logs
- Emma evaluation issues: Check `citizens/emma/CLAUDE.md`
- Telegram issues: Test with @BotFather
- Feature 3 integration: Check `scripts/track-lead.py`
