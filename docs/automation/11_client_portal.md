# Feature 11: Client Portal (Self-Service AC Tracking)

**Status:** DEFERRED (later priority)
**Priority:** P3 (Low priority - can wait until Phase 2)
**Time Estimate:** 24h (when implemented)
**Cost:** $20/mo (hosting + auth)

---

## PATTERN

**Consciousness Principle:** "Trust emerges from transparency. When clients can self-serve AC status checks, they don't need to ask—reducing support burden and increasing confidence."

**Why:** Manual status updates ("How's my project going?") consume Rafael's time. Client portal provides 24/7 transparency: test status, proof entries, milestone timeline.

---

## BEHAVIOR_SPEC

### Event Flow (When Implemented)

```
Client logs into portal with unique link
  ↓
Portal loads client-specific data:
  - AC.md for current milestone
  - Test status (X/Y passing)
  - Proof entries (Evidence Sprint, AC green)
  - Change Requests (pending, accepted, delivered)
  - Timeline (baseline → sprint → green)
  ↓
Client views real-time progress
  ↓
Client can:
  - Download proof artifacts (DEMO.md, DELTA.md)
  - View test results
  - See milestone timeline
  - Request changes (opens CR workflow)
```

### Contract (Future)

**Input:**
- Client authentication token (magic link or JWT)
- Client project ID

**Output:**
- Portal page with:
  - AC.md display (current milestone)
  - Test results dashboard (pass/fail counts)
  - Proof entries (chronological timeline)
  - CR status (if any)
  - Download links (AC.md, DEMO.md, DELTA.md, screenshots)

**Events:**
- `portal.accessed@1.0 { client, timestamp }`
- `portal.download@1.0 { client, artifact }`
- `portal.cr_requested@1.0 { client, description }`

---

## VALIDATION (Future)

### Acceptance Criteria

**V1: Client can view AC status**
```bash
# Test: Client opens magic link

# Expected:
# - Portal loads <2s
# - Shows current AC.md
# - Shows test results (26/29 passing)
# - Shows milestone timeline
# - ✅ Client can self-serve status check
```

**V2: Client can download proof artifacts**
```bash
# Test: Client clicks "Download DEMO.md"

# Expected:
# - File downloads immediately
# - Contains demo URL + screenshots
# - ✅ Transparency: client has full access to proof
```

**V3: Client can request changes**
```bash
# Test: Client clicks "Request Change" button

# Expected:
# - Form appears: "Describe change"
# - Submit → Rafael notified via Telegram
# - CR workflow starts
# - ✅ Self-service CR initiation
```

---

## MECHANISM (Future)

**Implementation Approach:** Next.js protected route + client-specific data loading

**Architecture:**

```
[Client magic link]
  ↓
[Next.js /portal/[clientId]]
  ↓ (Auth check)
[Load client data]
  ├─ AC.md from /proof/
  ├─ Test results from CI
  ├─ Proof entries from /proof/index.json
  └─ CR status from /proof/change-*/
  ↓
[Render portal page]
```

**Why deferred:**
- Not critical for Phase 1 (manual client updates work fine for 3-5 clients)
- Adds complexity (auth, multi-tenancy, security)
- Higher value: automate internal workflows first (Emma, Sofia, etc.)
- Phase 2 priority: When 5+ concurrent clients make manual updates inefficient

---

## ALGORITHM (Future)

### 1. Authentication

**Input:** Magic link with token: `/portal?token=abc123`

**Steps:**
1. Extract token from query string
2. Verify token signature (JWT or database lookup)
3. Extract client ID from token payload
4. Load client metadata (project name, milestone, access permissions)
5. Set session cookie (expires after 24h)

**Output:** Authenticated client session

---

### 2. Data Loading

**Input:** Client ID

**Steps:**
1. Find current milestone:
   - Read `/proof/AC.md` → extract milestone name
   - Or query `/proof/index.json` for latest entry matching client
2. Load test results:
   - Parse CI output or read `/test-results/summary.json`
   - Count passing/total tests
3. Load proof entries:
   - Filter `/proof/index.json` by client ID
   - Extract entries (Evidence Sprint, AC green, CRs)
4. Load CR status (if exists):
   - Read `/proof/change-*/CR.md` files
   - Extract status: pending, accepted, delivered

**Output:** Client dashboard data

---

### 3. Portal UI

**Layout:**

```
+------------------------------------------+
| [ScopeLock Logo]        [Client Name]    |
+------------------------------------------+
| Current Milestone: [Name]                |
| Status: [In Progress | AC Green]         |
+------------------------------------------+
| Test Results:                            |
| ✅ 26 passing  ⏳ 3 pending  ❌ 0 failing |
+------------------------------------------+
| Proof Entries:                           |
| - [2025-11-02] AC Baseline               |
| - [2025-11-05] Evidence Sprint (view)    |
| - [2025-11-10] AC Green (view)           |
+------------------------------------------+
| Change Requests:                         |
| - [Pending] Add OTP verification         |
+------------------------------------------+
| Actions:                                 |
| [Download AC.md] [Download DEMO.md]      |
| [Request Change]                         |
+------------------------------------------+
```

---

## GUIDE (Future)

### Implementation (Deferred to Phase 2)

**When to implement:**
- After 5+ concurrent clients (Phase 2, Week 13-16)
- When manual status updates consume >2h/week
- When clients repeatedly ask "What's the status?"

**File Structure:**
```
/src/
  app/
    portal/
      [clientId]/
        page.tsx          # Client-specific portal
        layout.tsx        # Auth wrapper
      auth.ts             # Token verification
      data-loader.ts      # Load client data
```

**Example (Minimal):**

File: `src/app/portal/[clientId]/page.tsx`
```typescript
import { verifyToken } from '../auth';
import { loadClientData } from '../data-loader';

export default async function ClientPortal({ params, searchParams }) {
  // Verify auth
  const client = await verifyToken(searchParams.token);

  if (!client) {
    return <div>Invalid or expired link</div>;
  }

  // Load data
  const data = await loadClientData(client.id);

  return (
    <div>
      <h1>Welcome, {client.name}</h1>
      <h2>Current Milestone: {data.milestone}</h2>

      <section>
        <h3>Test Results</h3>
        <p>{data.tests.passing}/{data.tests.total} passing</p>
      </section>

      <section>
        <h3>Proof Entries</h3>
        <ul>
          {data.proofEntries.map(entry => (
            <li key={entry.tag}>
              {entry.date} - {entry.type}
              <a href={`/proof/${entry.tag}`}>View</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Actions</h3>
        <a href={`/proof/AC.md`} download>Download AC.md</a>
        <button>Request Change</button>
      </section>
    </div>
  );
}
```

---

## ROI (Future)

**Time Saved (when implemented):**
- Manual status updates: 30min/week per client × 5 clients = 2.5h/week = 10h/month = $1,000/month
- With portal: 5min/week (only escalations) = 20min/month = $33/month
- Savings: 9.7h/month = $970/month

**Cost:**
- Development: 24h × $100/h = $2,400
- Running: $20/mo (auth service + hosting)

**Benefit:**
- 24/7 client self-service (no waiting for Rafael)
- Reduced support burden (clients answer own questions)
- Increased trust (transparency always visible)

**Payback:** 24h investment / 9.7h monthly savings = 2.5 months (when implemented)

---

## Why Deferred

**Current State (Phase 1):**
- 0-3 concurrent clients (manageable with manual updates)
- Rafael can send status updates in <5min via email/Upwork
- Higher ROI priorities: Emma automation (20h/week saved), Sofia auto-review (10h/week saved)

**When to Revisit:**
- Phase 2 (Week 13-16): When scaling to 2-4 concurrent clients
- Trigger: Manual status updates exceed 2h/week
- Precondition: All higher-ROI automation features completed (1-10)

**Decision:** Defer to Phase 2, focus on internal automation first.
