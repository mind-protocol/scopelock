# Feature 10: Priya Dashboard (Real-Time Metrics)

**Status:** Approved
**Priority:** P2 (Advanced)
**Time Estimate:** 16h
**Cost:** $0 (static site)

---

## PATTERN

**Consciousness Principle:** "Operations are observable. When systems run, metrics emit continuously—surfaced in a single pane of glass for instant health checks."

**Why:** Manual metric collection (check logs, count proposals, calculate GO rate) is slow and incomplete. Real-time dashboard enables proactive incident response and data-driven decisions.

---

## BEHAVIOR_SPEC

### Event Flow

```
Citizens emit events during operation:
  - lead.parsed@1.0 (Emma)
  - proposal.sent@1.0 (Emma)
  - response.sent@1.0 (Rafael)
  - review.verdict@1.0 (Sofia)
  - proof.generated@1.0 (Maya)
  - failure.emit@1.0 (any citizen)
  ↓
Events logged to /logs/events.json (append-only)
  ↓
Dashboard service reads events every 5 seconds
  ↓
Calculate metrics:
  - Acquisition: leads/day, GO rate, proposals sent
  - Client: responses, CR TAT, testimonials
  - Delivery: Evidence Sprints, AC green milestones
  - Quality: verdicts, silent fallbacks, override rate
  - Proof: entries, homepage CTR, proof generation time
  - Operations: MTTR, manual starts, service health
  ↓
Generate static dashboard HTML
  ↓
Serve at /dashboard (internal only, password protected)
```

### Contract

**Input:**
- Event log: `/logs/events.json` (newline-delimited JSON)
- Each event: `{ type, timestamp, data }`

**Output:**
- Dashboard HTML at `/dashboard`
- Metrics updated every 5 seconds
- Charts for trends (last 7 days, 30 days)
- Alerts for critical metrics (GO rate <30%, MTTR >10min)

**Events:**
- All citizen events flow into centralized log
- Dashboard reads log, calculates aggregates
- No write operations (read-only dashboard)

**Failure Modes:**
- Event log missing → Show "No data" placeholder
- Metric calculation error → Show last known value with warning
- Dashboard service down → Static fallback (last generated HTML)

---

## VALIDATION

### Acceptance Criteria

**V1: Dashboard loads and shows metrics**
```bash
# Test: Open /dashboard in browser

# Expected:
# - Dashboard loads <2s
# - Shows metrics for all categories (Acquisition, Client, Delivery, Quality, Proof, Ops)
# - Numbers match event log counts
# - ✅ Real-time updates (refresh every 5s)
```

**V2: Metrics are accurate**
```bash
# Test: Verify GO rate calculation

cat logs/events.json | grep "lead.parsed" | jq 'select(.data.decision == "GO")' | wc -l
# Compare to dashboard GO rate

# Expected:
# - Dashboard GO rate matches manual count
# - ✅ Calculations are correct
```

**V3: Alerts trigger for critical metrics**
```bash
# Test: Simulate low GO rate (add 10 NO-GO events)

# Expected:
# - Dashboard shows red alert: "GO rate below 30%"
# - Telegram notification sent
# - ✅ Alerts work
```

---

## MECHANISM

**Implementation Approach:** Event log → Aggregator service → Static HTML dashboard

**Architecture:**

```
[Citizens emit events]
  ↓
[/logs/events.json] (append-only log)
  ↓ (read every 5s)
[Dashboard Aggregator Service]
  ↓ (calculate metrics)
[Metrics Cache] (in-memory)
  ↓ (generate HTML)
[/dashboard/index.html] (static file)
  ↓ (serve via Next.js)
[Browser] (auto-refresh every 5s)
```

**Why static HTML:**
- No database needed (all data from event log)
- Fast load times (<500ms)
- Simple deployment (just HTML + CSS + JS)
- Can serve even if aggregator is down (last known state)

**Metrics Calculated:**

**Acquisition (Emma):**
- Leads evaluated today/week/month
- GO rate (GO leads / total leads)
- Proposals sent today/week
- Median time: parse → draft (SLA: <30min)

**Client (Rafael):**
- Responses sent today/week
- Response SLA (<2h target)
- Change Requests opened/closed
- CR TAT (time to analyze: target <24h)
- Testimonials collected this month

**Delivery (Daniel):**
- Evidence Sprints delivered this week
- AC green milestones this month
- Test coverage (avg across all projects)
- Build success rate (target >95%)

**Quality (Sofia):**
- Verdicts issued today (PASS, SOFT_FAIL, HARD_FAIL counts)
- Silent fallbacks detected (target: 0)
- Override rate (target <5%)
- Verdict TAT (target <4h)

**Proof (Maya + Aïcha):**
- Proof entries this month (target: 3/month)
- Homepage CTR (from analytics, if available)
- Proof generation time (tag → published, target <5min)
- Detail page views this week

**Operations (Priya):**
- Service health (all citizens: online/offline)
- MTTR for failures (target <10min)
- Manual process starts (target: 0)
- Incidents this week (count + details)

---

## ALGORITHM

### 1. Event Log Format

**Structure:**
```json
{
  "type": "lead.parsed@1.0",
  "timestamp": "2025-11-02T14:23:00Z",
  "data": {
    "platform": "Upwork",
    "title": "Build AI chat widget",
    "decision": "GO",
    "urgency": 8,
    "pain": 7
  }
}
```

**All event types:**
- `lead.parsed@1.0`: Emma evaluates lead
- `proposal.sent@1.0`: Emma sends proposal
- `response.sent@1.0`: Rafael responds to client
- `change.requested@1.0`: Rafael opens CR
- `evidence-sprint.tagged@1.0`: Daniel tags Evidence Sprint
- `ac.green@1.0`: Daniel tags AC green
- `review.verdict@1.0`: Sofia issues verdict
- `proof.generated@1.0`: Maya publishes proof
- `failure.emit@1.0`: Any citizen reports failure

---

### 2. Metric Calculations

**GO Rate:**
```
total_leads = count(events where type == "lead.parsed")
go_leads = count(events where type == "lead.parsed" AND data.decision == "GO")
go_rate = (go_leads / total_leads) × 100
```

**Response SLA:**
```
response_events = filter(events, type == "response.sent")
latencies = []
FOR EACH response IN response_events:
  request_time = find_previous_event("response.detected", response.data.client).timestamp
  latency = response.timestamp - request_time
  latencies.push(latency)

median_latency = percentile(latencies, 50)
p95_latency = percentile(latencies, 95)
sla_met = p95_latency < 2h ? "Yes" : "No"
```

**MTTR (Mean Time To Recovery):**
```
failure_events = filter(events, type == "failure.emit")
recovery_times = []
FOR EACH failure IN failure_events:
  recovery_event = find_next_event("service.recovered", failure.data.service)
  IF recovery_event:
    ttf = recovery_event.timestamp - failure.timestamp
    recovery_times.push(ttf)

mttr = mean(recovery_times)
```

**Verdict Distribution:**
```
verdicts = filter(events, type == "review.verdict")
pass_count = count(verdicts where data.verdict == "PASS")
soft_fail_count = count(verdicts where data.verdict == "SOFT_FAIL")
hard_fail_count = count(verdicts where data.verdict == "HARD_FAIL")

verdict_distribution = {
  pass: pass_count,
  soft_fail: soft_fail_count,
  hard_fail: hard_fail_count
}
```

---

### 3. Alert Logic

**GO Rate Alert:**
```
IF go_rate < 30% AND total_leads >= 10:
  EMIT alert.go_rate_low { current: go_rate, threshold: 30 }
  CALL sendToTelegram("⚠️ GO rate dropped to ${go_rate}% (target: ≥30%)")
```

**MTTR Alert:**
```
IF mttr > 10 * 60 * 1000 (10 minutes in ms):
  EMIT alert.mttr_high { current: mttr, threshold: 10min }
  CALL sendToTelegram("⚠️ MTTR is ${mttr/60}min (target: <10min)")
```

**Silent Fallback Alert:**
```
IF silent_fallback_count > 0:
  EMIT alert.silent_fallback { count: silent_fallback_count }
  CALL sendToTelegram("❌ ${silent_fallback_count} silent fallbacks detected (target: 0)")
```

---

## GUIDE

### Implementation

**File Structure:**
```
/services/
  priya-dashboard/
    index.js                # Dashboard aggregator service
    calculate-metrics.js    # Metric calculation logic
    generate-html.js        # HTML template generator
    alerts.js               # Alert rules engine
  /public/
    dashboard/
      index.html            # Generated dashboard HTML
      styles.css            # Dashboard styles
      refresh.js            # Auto-refresh script
```

**1. Dashboard Aggregator**

File: `services/priya-dashboard/index.js`
```javascript
import fs from 'fs/promises';
import { calculateMetrics } from './calculate-metrics.js';
import { generateHTML } from './generate-html.js';
import { checkAlerts } from './alerts.js';

const EVENT_LOG = '/home/mind-protocol/scopelock/logs/events.json';
const DASHBOARD_HTML = '/home/mind-protocol/scopelock/public/dashboard/index.html';
const REFRESH_INTERVAL = 5000; // 5 seconds

async function readEvents() {
  const content = await fs.readFile(EVENT_LOG, 'utf-8');
  const lines = content.trim().split('\n');
  return lines.map(line => JSON.parse(line));
}

async function aggregateDashboard() {
  try {
    // Read events
    const events = await readEvents();

    // Calculate metrics
    const metrics = calculateMetrics(events);

    // Check alerts
    await checkAlerts(metrics);

    // Generate HTML
    const html = generateHTML(metrics);

    // Write to public dashboard
    await fs.writeFile(DASHBOARD_HTML, html);

    console.log(`[DASHBOARD] Updated with ${events.length} events`);
  } catch (error) {
    console.error('[DASHBOARD ERROR]', error.message);
  }
}

// Run on startup
aggregateDashboard();

// Refresh every 5 seconds
setInterval(aggregateDashboard, REFRESH_INTERVAL);

console.log('[DASHBOARD] Service started, refreshing every 5s');
```

**2. Metric Calculator**

File: `services/priya-dashboard/calculate-metrics.js`
```javascript
export function calculateMetrics(events) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Filter events by time
  const eventsToday = events.filter(e => new Date(e.timestamp).getTime() > oneDayAgo);
  const eventsWeek = events.filter(e => new Date(e.timestamp).getTime() > oneWeekAgo);
  const eventsMonth = events.filter(e => new Date(e.timestamp).getTime() > oneMonthAgo);

  // Acquisition metrics
  const leadsParsed = eventsToday.filter(e => e.type === 'lead.parsed@1.0');
  const goLeads = leadsParsed.filter(e => e.data.decision === 'GO');
  const goRate = leadsParsed.length > 0 ? (goLeads.length / leadsParsed.length * 100).toFixed(1) : 0;
  const proposalsSent = eventsToday.filter(e => e.type === 'proposal.sent@1.0').length;

  // Client metrics
  const responsesSent = eventsToday.filter(e => e.type === 'response.sent@1.0').length;
  const crsOpened = eventsWeek.filter(e => e.type === 'change.requested@1.0').length;

  // Delivery metrics
  const evidenceSprints = eventsWeek.filter(e => e.type === 'evidence-sprint.tagged@1.0').length;
  const acGreen = eventsMonth.filter(e => e.type === 'ac.green@1.0').length;

  // Quality metrics
  const verdicts = eventsToday.filter(e => e.type === 'review.verdict@1.0');
  const pass = verdicts.filter(e => e.data.verdict === 'PASS').length;
  const softFail = verdicts.filter(e => e.data.verdict === 'SOFT_FAIL').length;
  const hardFail = verdicts.filter(e => e.data.verdict === 'HARD_FAIL').length;

  // Proof metrics
  const proofEntries = eventsMonth.filter(e => e.type === 'proof.generated@1.0').length;

  // Operations metrics
  const failures = eventsToday.filter(e => e.type === 'failure.emit@1.0');
  const mttr = calculateMTTR(events);

  return {
    acquisition: {
      leadsEvaluated: leadsParsed.length,
      goRate,
      proposalsSent
    },
    client: {
      responsesSent,
      crsOpened
    },
    delivery: {
      evidenceSprints,
      acGreen
    },
    quality: {
      verdicts: { pass, softFail, hardFail },
      silentFallbacks: 0 // TODO: Calculate from events
    },
    proof: {
      entries: proofEntries
    },
    operations: {
      failures: failures.length,
      mttr
    }
  };
}

function calculateMTTR(events) {
  const failures = events.filter(e => e.type === 'failure.emit@1.0');
  const recoveries = events.filter(e => e.type === 'service.recovered@1.0');

  let totalRecoveryTime = 0;
  let recoveryCount = 0;

  failures.forEach(failure => {
    const recovery = recoveries.find(r =>
      r.data.service === failure.data.service &&
      new Date(r.timestamp) > new Date(failure.timestamp)
    );

    if (recovery) {
      const ttf = new Date(recovery.timestamp) - new Date(failure.timestamp);
      totalRecoveryTime += ttf;
      recoveryCount++;
    }
  });

  const mttr = recoveryCount > 0 ? (totalRecoveryTime / recoveryCount / 60000).toFixed(1) : 0;
  return mttr; // in minutes
}
```

**3. HTML Generator**

File: `services/priya-dashboard/generate-html.js`
```javascript
export function generateHTML(metrics) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Priya Dashboard - ScopeLock</title>
  <meta http-equiv="refresh" content="5">
  <style>
    body { font-family: Inter, sans-serif; background: #0E1116; color: #E6EAF2; padding: 2rem; }
    h1 { color: #1EE5B8; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .card { background: #151A21; padding: 1.5rem; border-radius: 8px; }
    .card h2 { margin: 0 0 1rem 0; font-size: 1.2rem; color: #9AA3AE; }
    .metric { font-size: 2.5rem; font-weight: bold; margin: 0.5rem 0; }
    .metric.good { color: #5CE27E; }
    .metric.warning { color: #FFC857; }
    .metric.danger { color: #FF5D5D; }
    .label { font-size: 0.9rem; color: #9AA3AE; }
    .alert { background: #FF5D5D; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>Priya Dashboard</h1>
  <p class="label">Last updated: ${new Date().toLocaleString()} (auto-refresh every 5s)</p>

  ${generateAlerts(metrics)}

  <div class="grid">
    <!-- Acquisition -->
    <div class="card">
      <h2>Acquisition (Emma)</h2>
      <div class="metric ${metrics.acquisition.goRate >= 30 ? 'good' : 'danger'}">${metrics.acquisition.goRate}%</div>
      <div class="label">GO rate (target: ≥30%)</div>
      <div class="metric">${metrics.acquisition.leadsEvaluated}</div>
      <div class="label">Leads evaluated today</div>
      <div class="metric">${metrics.acquisition.proposalsSent}</div>
      <div class="label">Proposals sent today</div>
    </div>

    <!-- Client -->
    <div class="card">
      <h2>Client (Rafael)</h2>
      <div class="metric">${metrics.client.responsesSent}</div>
      <div class="label">Responses sent today</div>
      <div class="metric">${metrics.client.crsOpened}</div>
      <div class="label">Change Requests this week</div>
    </div>

    <!-- Delivery -->
    <div class="card">
      <h2>Delivery (Daniel)</h2>
      <div class="metric">${metrics.delivery.evidenceSprints}</div>
      <div class="label">Evidence Sprints this week</div>
      <div class="metric">${metrics.delivery.acGreen}</div>
      <div class="label">AC green this month</div>
    </div>

    <!-- Quality -->
    <div class="card">
      <h2>Quality (Sofia)</h2>
      <div class="metric good">${metrics.quality.verdicts.pass}</div>
      <div class="label">PASS verdicts today</div>
      <div class="metric warning">${metrics.quality.verdicts.softFail}</div>
      <div class="label">SOFT_FAIL verdicts today</div>
      <div class="metric danger">${metrics.quality.verdicts.hardFail}</div>
      <div class="label">HARD_FAIL verdicts today</div>
      <div class="metric ${metrics.quality.silentFallbacks === 0 ? 'good' : 'danger'}">${metrics.quality.silentFallbacks}</div>
      <div class="label">Silent fallbacks (target: 0)</div>
    </div>

    <!-- Proof -->
    <div class="card">
      <h2>Proof (Maya + Aïcha)</h2>
      <div class="metric">${metrics.proof.entries}</div>
      <div class="label">Proof entries this month (target: 3)</div>
    </div>

    <!-- Operations -->
    <div class="card">
      <h2>Operations (Priya)</h2>
      <div class="metric ${metrics.operations.failures === 0 ? 'good' : 'warning'}">${metrics.operations.failures}</div>
      <div class="label">Failures today</div>
      <div class="metric ${metrics.operations.mttr < 10 ? 'good' : 'danger'}">${metrics.operations.mttr}min</div>
      <div class="label">MTTR (target: <10min)</div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateAlerts(metrics) {
  const alerts = [];

  if (metrics.acquisition.goRate < 30 && metrics.acquisition.leadsEvaluated >= 10) {
    alerts.push(`GO rate dropped to ${metrics.acquisition.goRate}% (target: ≥30%)`);
  }

  if (metrics.operations.mttr > 10) {
    alerts.push(`MTTR is ${metrics.operations.mttr}min (target: <10min)`);
  }

  if (metrics.quality.silentFallbacks > 0) {
    alerts.push(`${metrics.quality.silentFallbacks} silent fallbacks detected (target: 0)`);
  }

  if (alerts.length === 0) return '';

  return `
    <div class="alert">
      <strong>⚠️ Alerts:</strong>
      <ul>
        ${alerts.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  `;
}
```

**4. Alerts Engine**

File: `services/priya-dashboard/alerts.js`
```javascript
import { sendToTelegram } from '../shared/telegram.js';

const ALERT_COOLDOWN = 60 * 60 * 1000; // 1 hour
const lastAlerts = {};

export async function checkAlerts(metrics) {
  const now = Date.now();

  // GO rate alert
  if (metrics.acquisition.goRate < 30 && metrics.acquisition.leadsEvaluated >= 10) {
    if (!lastAlerts.goRate || now - lastAlerts.goRate > ALERT_COOLDOWN) {
      await sendToTelegram(`⚠️ **GO rate alert:** ${metrics.acquisition.goRate}% (target: ≥30%)`);
      lastAlerts.goRate = now;
    }
  }

  // MTTR alert
  if (metrics.operations.mttr > 10) {
    if (!lastAlerts.mttr || now - lastAlerts.mttr > ALERT_COOLDOWN) {
      await sendToTelegram(`⚠️ **MTTR alert:** ${metrics.operations.mttr}min (target: <10min)`);
      lastAlerts.mttr = now;
    }
  }

  // Silent fallback alert
  if (metrics.quality.silentFallbacks > 0) {
    if (!lastAlerts.silentFallbacks || now - lastAlerts.silentFallbacks > ALERT_COOLDOWN) {
      await sendToTelegram(`❌ **Silent fallbacks detected:** ${metrics.quality.silentFallbacks} (target: 0)`);
      lastAlerts.silentFallbacks = now;
    }
  }
}
```

**5. Deploy & Test**

```bash
# Start dashboard service
cd services/priya-dashboard
node index.js &

# Open dashboard
open http://localhost:3000/dashboard

# Simulate events
echo '{"type":"lead.parsed@1.0","timestamp":"2025-11-02T14:00:00Z","data":{"decision":"GO","urgency":8}}' >> logs/events.json

# Wait 5s, refresh browser
# Expected: Dashboard shows updated metrics
```

---

## ROI

**Time Saved:**
- Manual metric collection: 1h/week (check logs, calculate stats, report)
- With dashboard: 0h/week (automatic, always visible)
- Savings: 1h/week × 4 weeks = 4h/month = $400/month

**Cost:**
- Development: 16h × $100/h = $1,600
- Running: $0 (static HTML)

**Benefit:**
- Real-time visibility (no waiting for reports)
- Proactive alerts (catch issues before clients notice)
- Data-driven decisions (adjust thresholds based on trends)

**Payback:** 16h investment / 4h monthly savings = 4 months
