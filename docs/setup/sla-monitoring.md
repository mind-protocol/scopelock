# SLA Monitoring - <2h Response Time

**Requirement**: Gmail alert → Rafael auto-draft → Response within 2 hours

**Status**: ✅ Implemented and tested

---

## Overview

The backend tracks response time from Gmail alert to approval, ensuring clients receive responses within the 2-hour SLA.

```
Gmail receives client message (T=0)
  ↓ Backend stores received_at timestamp

Backend triggers Rafael (T=0 + 5s)
  ↓ Rafael drafts response via Claude CLI

Telegram notification sent (T=0 + 30s)
  ↓ User receives approval request

User clicks [✅ Approve] (T=0 + 45m)
  ↓ Backend calculates response_time = 45 minutes
  ↓ SLA check: 45m < 120m? ✅ YES

Telegram message updates:
"✅ Response Time: 45m (Target: <120m)"
```

---

## How It Works

### 1. Timestamp Collection

**Gmail Webhook (T=0)**
```python
# backend/app/webhooks.py
received_at = datetime.utcnow().isoformat()  # "2025-11-03T00:00:00Z"

# Pass to Rafael via env var
result = runner.run_rafael(..., received_at=received_at)
```

**Rafael Execution (T=0 + 5s)**
```bash
# Backend runs subprocess with RECEIVED_AT env var
claude --print "New Upwork response..." --continue
# (RECEIVED_AT is available to Rafael as environment variable)
```

**Telegram Notification (T=0 + 30s)**
```python
# Rafael calls via Bash tool:
curl -X POST /api/notify/draft?received_at=$RECEIVED_AT...

# Backend stores in draft file:
{
  "timestamps": {
    "received_at": "2025-11-03T00:00:00Z",
    "notified_at": "2025-11-03T00:00:30Z"
  }
}
```

**User Approval (T=0 + 45m)**
```python
# User clicks [✅ Approve]
# Backend calculates:
response_time_minutes = (approved_at - received_at).total_seconds() / 60
sla_met = response_time_minutes < 120  # <2h

# Stores SLA data:
{
  "timestamps": {
    "received_at": "2025-11-03T00:00:00Z",
    "notified_at": "2025-11-03T00:00:30Z",
    "approved_at": "2025-11-03T00:45:00Z"
  },
  "sla": {
    "response_time_minutes": 45,
    "sla_met": true,
    "target_minutes": 120
  }
}
```

---

## Monitoring

### Backend Logs

Check Render logs for SLA status:

```bash
# View recent SLA logs
curl https://scopelock.onrender.com/logs | grep "SLA:"

# Example output:
# [telegram:approve] SLA: 45m (✅ MET)
# [telegram:approve] SLA: 135m (❌ MISSED)
```

### Telegram Messages

Users see SLA status in approval message:

**SLA Met (< 2 hours)**
```
✅ **Draft Approved**
...
✅ **Response Time: 45m (Target: <120m)**
```

**SLA Missed (> 2 hours)**
```
✅ **Draft Approved**
...
⚠️ **Response Time: 135m (Target: <120m)**
```

### Draft Files

Query SLA data from persistent draft files:

```bash
# Via Render shell or SSH
cd /var/data/drafts

# Count SLA met vs missed
grep -r '"sla_met": true' . | wc -l   # SLA met count
grep -r '"sla_met": false' . | wc -l  # SLA missed count

# Get average response time
jq '.sla.response_time_minutes' *.json | awk '{sum+=$1; n++} END {print sum/n " minutes"}'

# Find longest response time
jq '.sla.response_time_minutes' *.json | sort -n | tail -1
```

---

## Alerting (Future Enhancement)

### Warning at 1.5h (90 minutes)

If draft is still pending after 90 minutes, send alert:

```python
# Pseudo-code for future implementation
if (now - received_at).total_seconds() / 60 > 90 and status == "pending":
    send_telegram_message(
        f"⚠️ Draft {draft_id} approaching 2h SLA (90m elapsed)"
    )
```

### Daily SLA Report

Generate daily report with:
- Total responses
- SLA met percentage
- Average response time
- Longest response time
- Missed SLA reasons (if available)

---

## Testing SLA Tracking

### Test 1: Fast Response (< 2h)

```bash
# Create draft with timestamp 30 minutes ago
RECEIVED_AT=$(python3 -c "from datetime import datetime, timedelta; print((datetime.utcnow() - timedelta(minutes=30)).isoformat())")

curl -X POST "https://scopelock.onrender.com/api/notify/draft?draft_id=test-30m&client=Test&draft_text=Fast%20response&confidence=85&received_at=$RECEIVED_AT"

# Approve it
curl -X POST https://scopelock.onrender.com/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{"update_id":1,"callback_query":{"id":"1","data":"approve:test-30m"}}'

# Check Telegram: Should show "✅ Response Time: 30m"
```

### Test 2: Slow Response (> 2h)

```bash
# Create draft with timestamp 150 minutes ago
RECEIVED_AT=$(python3 -c "from datetime import datetime, timedelta; print((datetime.utcnow() - timedelta(minutes=150)).isoformat())")

curl -X POST "https://scopelock.onrender.com/api/notify/draft?draft_id=test-150m&client=Test&draft_text=Slow%20response&confidence=85&received_at=$RECEIVED_AT"

# Approve it
curl -X POST https://scopelock.onrender.com/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{"update_id":2,"callback_query":{"id":"2","data":"approve:test-150m"}}'

# Check Telegram: Should show "⚠️ Response Time: 150m"
# Check backend logs: Should show "[telegram:approve] SLA: 150m (❌ MISSED)"
```

---

## SLA Compliance Targets

**Target**: >95% of responses within 2 hours

**Measurement period**: 30 days rolling

**Formula**:
```
SLA Compliance % = (Responses within 2h / Total responses) × 100
```

**Example**:
```
Total responses: 100
Within 2h: 97
SLA Compliance: 97% ✅ (target: >95%)
```

---

## Troubleshooting

### SLA not calculated (no timestamps)

**Symptom**: Approval works but no "Response Time" shown

**Cause**: `received_at` not passed from Gmail webhook

**Fix**: Ensure Gmail webhook includes timestamp:
```bash
# Gmail webhook should send:
{
  "client": "...",
  "message": "...",
  "job_title": "...",
  "job_link": "..."
}

# Backend automatically adds received_at and passes to Rafael
```

### SLA shows incorrect time

**Symptom**: Response time is wrong (e.g., shows 1000 minutes)

**Cause**: Timestamp format mismatch

**Fix**: Ensure all timestamps are ISO 8601 format:
```python
datetime.utcnow().isoformat()  # "2025-11-03T00:00:00.123456"
```

### SLA not stored in draft file

**Symptom**: Backend logs show SLA but draft file doesn't have it

**Cause**: File write failed or timestamps missing

**Fix**: Check backend logs for:
```
[telegram:notify] Draft file created: /var/data/drafts/{uuid}.json
[telegram:approve] SLA: 45m (✅ MET)
```

If missing, check disk space:
```bash
df -h /var/data
```

---

## Reporting

### Weekly SLA Report

Generate report from draft files:

```bash
#!/bin/bash
# weekly-sla-report.sh

cd /var/data/drafts

echo "SLA Report (Last 7 days)"
echo "========================"

# Count total approved drafts
TOTAL=$(jq -r 'select(.status == "approved") | .id' *.json | wc -l)
echo "Total responses: $TOTAL"

# Count SLA met
MET=$(jq -r 'select(.sla.sla_met == true) | .id' *.json | wc -l)
echo "SLA met (<2h): $MET"

# Calculate compliance
COMPLIANCE=$(echo "scale=2; $MET / $TOTAL * 100" | bc)
echo "Compliance: ${COMPLIANCE}%"

# Average response time
AVG=$(jq -r '.sla.response_time_minutes' *.json | awk '{sum+=$1; n++} END {printf "%.0f", sum/n}')
echo "Average response time: ${AVG}m"

# Longest response time
MAX=$(jq -r '.sla.response_time_minutes' *.json | sort -n | tail -1)
echo "Longest response time: ${MAX}m"
```

---

## Next Steps

1. ✅ SLA tracking implemented
2. ✅ Tested with mock data (45m response)
3. ⏳ Wait for Docker deploy (Claude CLI support)
4. ⏳ Configure Gmail webhook (Cloud Function)
5. ⏳ Test full E2E flow (real Upwork message)
6. ⏳ Monitor first week for SLA compliance
7. 🔮 Future: Add 90-minute warning alerts
8. 🔮 Future: Automated weekly SLA reports

---

**SLA monitoring ready. Responses tracked from Gmail to approval.**
