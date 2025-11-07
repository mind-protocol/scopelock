# Acceptance Criteria: Team Member Hunting (Telegram Outreach System)

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Systematic Telegram outreach to 313 qualified contacts for ScopeLock team expansion

---

## Functional Criteria

### F1: Contact Queue Display

**Given:** 313 contacts loaded into FalkorDB from analysis JSON
**When:** User opens Mission Deck → OUTREACH section
**Then:** Contact queue displays with filtering and sorting

**Acceptance:**
- [ ] All 313 contacts visible in queue (paginated, 20 per page)
- [ ] Filters available: profile type (supervisor/hustler/hybrid), outreach status (pending/sent/replied/converted)
- [ ] Default sort: hustler_score DESC (highest hustlers first)
- [ ] Can switch sort to: supervisor_score DESC, name ASC
- [ ] Each contact card shows:
  - Name
  - Telegram ID
  - Profile type badge (color-coded: supervisor=blue, hustler=green, hybrid=purple)
  - Scores (supervisor_score, hustler_score)
  - Outreach status (pending/sent/replied/converted)
  - Top 3 signals (voice_ai, code_review, etc.)
  - Send button (if status=pending) OR "Sent on [date]" (if status=sent)
- [ ] Mobile-responsive (works on phone for on-the-go outreach)

**Test Data:**
```json
// Sample contact (from analysis JSON)
{
  "telegram_id": 7944133972,
  "name": "Liam",
  "profile_type": "hustler",
  "supervisor_score": 1,
  "hustler_score": 15,
  "signals": ["voice_ai", "productivity_tools", "ai_apps"],
  "matching_messages": [
    {
      "text": "Just launched a voice AI demo...",
      "date": "2024-10-15",
      "score": 8.5
    }
  ]
}
```

**Expected UI:**
```
┌─────────────────────────────────────┐
│ OUTREACH QUEUE (313 contacts)      │
│ [Filter: All] [Sort: Hustler ▼]    │
├─────────────────────────────────────┤
│ Liam                         HUSTLER│
│ @7944133972                         │
│ Supervisor: 1 • Hustler: 15         │
│ 🎤 voice_ai 🛠️ productivity_tools   │
│ Status: Pending                     │
│ [Generate Message] ──────────────── │
├─────────────────────────────────────┤
│ Alex                      SUPERVISOR│
│ ...                                 │
└─────────────────────────────────────┘
```

---

### F2: Maya Message Generation (Personalized)

**Given:** Contact with profile type, signals, and matching messages
**When:** User clicks "Generate Message" on contact card
**Then:** Maya generates personalized outreach message in <5 seconds

**Acceptance:**
- [ ] Message generated in <5 seconds (p95 latency)
- [ ] Message includes:
  - Personal hook (references contact's name)
  - Context (references specific signal or matching message)
  - Personalization (shows we read their profile, not spam)
  - Value proposition (relevant to profile type: supervisor vs hustler)
  - Bridge (connect their interest to ScopeLock)
  - CTA (call to action, relevant to profile)
- [ ] Message follows ScopeLock brand voice (casual, builder-grade, no corporate jargon)
- [ ] Message length: 80-150 words (long enough for context, short enough to read quickly)
- [ ] NO generic templates (every message references specific signal/message)
- [ ] Different messaging for supervisor vs hustler profiles
- [ ] Message appears in editable text area (human can review/edit before sending)
- [ ] Copy button visible (one-click copy to clipboard)

**Example Messages:**

**Hustler Profile:**
```
Hey Liam! Saw you grinding on voice AI stuff - that demo you posted on Oct 15 was fire 🔥.

We're building ScopeLock (AI-human dev agency) and need someone who can hunt Upwork jobs and write killer proposals. You'd be perfect for the hustler role - find jobs, write proposals with Emma (our AI), get paid per interaction.

No corporate BS, no timesheets. Just results. Interested?
```

**Supervisor Profile:**
```
Hey Alex! Noticed your code review game is strong - especially that PR feedback on the auth refactor (Oct 22). Clear, actionable, no fluff.

We're ScopeLock (AI-human dev agency) and need someone to mentor junior devs with Rafael (our AI code generator). You review architecture, Rafael handles boilerplate. Get paid per interaction, not hours.

Build in public, own your impact. Want a 15-min demo?
```

**Error Handling:**
- [ ] If Maya API call fails → show error message "Generation failed, try again"
- [ ] If contact has no signals → show warning "Limited data, message may be generic"
- [ ] If message generation takes >10 seconds → show loading spinner with "Generating..."

---

### F3: Manual Send Workflow (Human in Loop)

**Given:** Maya-generated message displayed in text area
**When:** User reviews message, optionally edits, and clicks "Copy & Mark Sent"
**Then:** Message copied to clipboard, user manually sends via Telegram, marks as sent in system

**Acceptance:**
- [ ] "Copy to Clipboard" button copies exact message text
- [ ] Browser shows "Copied!" confirmation (toast notification)
- [ ] "Mark as Sent" button updates FalkorDB:
  - Creates U4_Outreach_Message node
  - Links to U4_Contact_Lead via U4_RECEIVED
  - Sets outreach_status = 'sent'
  - Records sent_by (human's username)
  - Records sent_at (current timestamp)
- [ ] Contact moves out of "Pending" queue into "Sent" section
- [ ] Cannot send to same contact twice (button disabled if status=sent)
- [ ] Can edit message before copying (text area editable)
- [ ] If edited, log edit diff for Maya training (future feature)

**Workflow:**
1. User clicks "Generate Message" → Maya generates in 3s
2. User reviews message in text area
3. User clicks "Copy to Clipboard" → text copied
4. User opens Telegram app → finds contact → pastes → sends manually
5. User returns to dashboard → clicks "Mark as Sent" → FalkorDB updated
6. Contact card shows "Sent on Nov 7, 2025"

**Rate Limiting:**
- [ ] Dashboard warns if >20 sends in one day ("Slow down to avoid spam detection")
- [ ] Can override warning (not hard limit, just advisory)

---

### F4: Telegram Session Connection (Telethon Auth)

**Given:** User wants to enable reply monitoring
**When:** User clicks "Connect Telegram" in settings
**Then:** Telethon authentication flow completes and session stored securely

**Acceptance:**
- [ ] "Connect Telegram" button in dashboard settings
- [ ] Clicking button prompts for:
  - Phone number (international format, e.g., +1234567890)
  - 2FA code (sent to phone via Telegram)
- [ ] After entering code, Telethon creates session
- [ ] Session encrypted with Fernet (symmetric encryption)
- [ ] Encrypted session stored in FalkorDB (U4_Telegram_Conversation node)
- [ ] Encryption key stored in environment variable (TELEGRAM_SESSION_KEY)
- [ ] Session never committed to git (verified via .gitignore)
- [ ] Read-only access verified (cannot send messages via Telethon)
- [ ] Session validity checked on startup (if invalid, prompt re-auth)
- [ ] Dashboard shows "Telegram Connected ✅" when session active

**Error Handling:**
- [ ] If phone number invalid → show error "Invalid phone number format"
- [ ] If 2FA code wrong → show error "Invalid code, try again"
- [ ] If session creation fails → show error "Connection failed, contact support"

**Security Requirements:**
- [ ] Session file never in plaintext on disk
- [ ] Session encrypted before storing in FalkorDB
- [ ] Encryption key rotates every 90 days (future feature)
- [ ] Security audit passed (no plaintext sessions found)

---

### F5: Reply Detection (Background Worker)

**Given:** Telethon session connected and active
**When:** Contact sends reply via Telegram
**Then:** Background worker detects reply within 60 seconds and creates FalkorDB event

**Acceptance:**
- [ ] Background worker runs continuously (AsyncIO task)
- [ ] Polls all sent conversations every 60 seconds
- [ ] Detects new messages from contacts (not from us)
- [ ] Creates U4_Telegram_Reply node in FalkorDB:
  - telegram_message_id (unique ID from Telegram)
  - message_text (reply content)
  - sender_name (contact's name)
  - sent_at (timestamp from Telegram)
  - is_read (false initially)
- [ ] Links reply to contact via U4_REPLIED_VIA relationship
- [ ] Updates contact's outreach_status = 'replied'
- [ ] Emits event `telegram.reply.detected` for dashboard notification
- [ ] Duplicate detection (same message_id not created twice)
- [ ] Worker uptime ≥99.5% (max 3.6 hours downtime per month)

**Test Scenario:**
1. Send message to contact "Liam" (telegram_id: 7944133972)
2. Mark as sent in dashboard
3. Wait 30 seconds
4. Liam replies: "Yeah, I'm interested. Tell me more."
5. Within 60 seconds:
   - Worker detects new message
   - Creates U4_Telegram_Reply node
   - Links to Liam's U4_Contact_Lead
   - Dashboard notification appears

**Error Handling:**
- [ ] If Telethon session expired → emit `failure.emit` + alert team + stop worker
- [ ] If network error → log warning + retry on next loop (60s later)
- [ ] If unknown error → emit `failure.emit` + alert team + manual fallback

**Monitoring:**
- [ ] Health check endpoint: GET /api/outreach/worker-health
  - Returns: `{"status": "running", "last_check": "2025-11-07T12:00:00Z"}`
- [ ] If no health check update in 5 minutes → alert team
- [ ] Metrics: replies detected per hour, average detection latency

---

### F6: Reply Notifications (Dashboard Alerts)

**Given:** New reply detected by background worker
**When:** User is viewing dashboard
**Then:** Notification appears instantly (via SSE or polling)

**Acceptance:**
- [ ] Dashboard subscribes to `telegram.reply.detected` events (SSE preferred)
- [ ] Notification badge appears on OUTREACH section (red dot with count)
- [ ] Clicking badge opens "Unread Replies" panel
- [ ] Panel shows:
  - Contact name
  - Reply preview (first 100 characters)
  - Time received (e.g., "2 minutes ago")
  - [View Full Reply] button
- [ ] Clicking [View Full Reply] opens conversation view:
  - Original outreach message we sent
  - Contact's reply (full text)
  - Timestamp
  - [Mark Interested] [Mark Not Interested] buttons
- [ ] Marking interest updates outreach_status:
  - "Interested" → status = 'interested'
  - "Not Interested" → status = 'not_interested'
- [ ] Notification dismissed after reading (badge count decrements)

**Real-Time Requirements:**
- [ ] Notification appears <5 seconds after worker detects reply
- [ ] SSE connection maintained (fallback to polling if SSE fails)
- [ ] No page refresh required to see new replies

**Example UI:**
```
┌─────────────────────────────────────┐
│ OUTREACH • Unread (3) 🔴           │
├─────────────────────────────────────┤
│ Liam (2 min ago)                    │
│ "Yeah, I'm interested. Tell me..." │
│ [View Full] ────────────────────────│
├─────────────────────────────────────┤
│ Alex (15 min ago)                   │
│ "Not right now, maybe later."       │
│ [View Full] ────────────────────────│
└─────────────────────────────────────┘
```

---

### F7: Outreach Status Tracking (Full Lifecycle)

**Given:** Contact moves through outreach funnel
**When:** Status changes (pending → sent → replied → interested → converted)
**Then:** FalkorDB accurately reflects current status at all times

**Acceptance:**
- [ ] Status field: `outreach_status` on U4_Contact_Lead node
- [ ] Valid statuses: `pending`, `sent`, `replied`, `interested`, `not_interested`, `converted`
- [ ] Status transitions:
  - `pending` → `sent` (when marked as sent)
  - `sent` → `replied` (when reply detected)
  - `replied` → `interested` OR `not_interested` (human marks interest)
  - `interested` → `converted` (when contact joins team)
- [ ] Each status change creates audit event in FalkorDB
- [ ] Status history queryable (can see full timeline)
- [ ] Dashboard filters by status:
  - Pending (not yet reached)
  - Sent (waiting for reply)
  - Replied (needs human review)
  - Interested (needs follow-up)
  - Converted (joined team) ✅

**Audit Trail:**
```cypher
// Query status history for contact
MATCH (c:U4_Contact_Lead {telegram_id: 7944133972})-[:U4_STATUS_CHANGED]->(e:U4_Event)
RETURN e.from_status, e.to_status, e.changed_at, e.changed_by
ORDER BY e.changed_at ASC

// Expected output:
// from: null,      to: 'pending',       changed_at: '2025-11-07T10:00:00Z', changed_by: 'system'
// from: 'pending', to: 'sent',          changed_at: '2025-11-07T11:30:00Z', changed_by: 'bigbosexf'
// from: 'sent',    to: 'replied',       changed_at: '2025-11-07T13:45:00Z', changed_by: 'telegram_worker'
// from: 'replied', to: 'interested',    changed_at: '2025-11-07T14:00:00Z', changed_by: 'bigbosexf'
// from: 'interested', to: 'converted',  changed_at: '2025-11-10T09:00:00Z', changed_by: 'nlr'
```

---

### F8: Metrics Dashboard (Optimization Insights)

**Given:** Multiple outreach messages sent and replies received
**When:** User opens "Metrics" tab in OUTREACH section
**Then:** Dashboard displays actionable metrics for optimization

**Acceptance:**
- [ ] **Overview Metrics:**
  - Total contacts: 313
  - Reached: X (Y%)
  - Replied: X (Y% reply rate)
  - Interested: X (Y% of replies)
  - Converted: X (Y% of interested)
- [ ] **Reply Rate by Profile Type:**
  - Supervisor: X% (sent to A, replied B)
  - Hustler: X% (sent to A, replied B)
  - Hybrid: X% (sent to A, replied B)
- [ ] **Reply Rate by Signal (Top 5):**
  - voice_ai: X% (sent to A, replied B)
  - code_review: X%
  - productivity_tools: X%
  - ai_apps: X%
  - ai_agents: X%
- [ ] **Time to Reply (Histogram):**
  - <1 hour: X contacts
  - 1-6 hours: X contacts
  - 6-24 hours: X contacts
  - 1-3 days: X contacts
  - >3 days: X contacts
- [ ] **Conversion Funnel:**
  - Pending: 313
  - Sent: 127 (40%)
  - Replied: 19 (15%)
  - Interested: 7 (37%)
  - Converted: 3 (43%)

**Queryable Insights:**
```cypher
// Reply rate by profile type
MATCH (c:U4_Contact_Lead)-[:U4_RECEIVED]->(m:U4_Outreach_Message)
OPTIONAL MATCH (c)-[:U4_REPLIED_VIA]->(r:U4_Telegram_Reply)
WITH c.profile_type AS profile, count(DISTINCT m) AS sent, count(DISTINCT r) AS replied
RETURN profile, sent, replied, (replied * 100.0 / sent) AS reply_rate
ORDER BY reply_rate DESC

// Reply rate by signal
MATCH (c:U4_Contact_Lead)-[:U4_RECEIVED]->(m:U4_Outreach_Message)
OPTIONAL MATCH (c)-[:U4_REPLIED_VIA]->(r:U4_Telegram_Reply)
UNWIND c.analysis_data.signals AS signal
WITH signal, count(DISTINCT m) AS sent, count(DISTINCT r) AS replied
RETURN signal, sent, replied, (replied * 100.0 / sent) AS reply_rate
ORDER BY reply_rate DESC
LIMIT 5
```

**Expected UI:**
```
┌─────────────────────────────────────┐
│ OUTREACH METRICS                    │
├─────────────────────────────────────┤
│ Reply Rate by Profile               │
│ Hustler:    18.2% (sent 55, got 10) │
│ Hybrid:     14.3% (sent 35, got 5)  │
│ Supervisor: 11.1% (sent 37, got 4)  │
├─────────────────────────────────────┤
│ Top Signals (by reply rate)         │
│ 🎤 voice_ai:       23.5% (sent 17)  │
│ 🔍 code_review:    15.8% (sent 19)  │
│ 🛠️ productivity:   12.5% (sent 16)  │
└─────────────────────────────────────┘
```

---

### F9: Contact Profile View (Full Context)

**Given:** User clicks contact name in queue
**When:** Profile panel opens
**Then:** All analysis data displayed for informed outreach

**Acceptance:**
- [ ] Panel shows:
  - Name, Telegram ID
  - Profile type (supervisor/hustler/hybrid)
  - Scores (supervisor_score, hustler_score)
  - All signals (not just top 3)
  - Matching messages (all, not just preview)
  - Outreach history:
    - Message sent (if any), timestamp, sent by
    - Reply received (if any), full text, timestamp
    - Status changes (pending → sent → replied → interested)
- [ ] Can edit outreach status manually (if monitoring failed)
- [ ] Can add notes (e.g., "Called on Nov 10, wants to start in December")
- [ ] Can mark as converted manually

**Example Data:**
```
┌─────────────────────────────────────┐
│ Contact Profile: Liam               │
├─────────────────────────────────────┤
│ Telegram ID: 7944133972             │
│ Profile: HUSTLER (supervisor: 1,    │
│          hustler: 15)               │
│                                     │
│ Signals (5):                        │
│ • voice_ai                          │
│ • productivity_tools                │
│ • ai_apps                           │
│ • automation                        │
│ • ai_agents                         │
│                                     │
│ Matching Messages (3):              │
│ 1. "Just launched a voice AI demo   │
│    for my productivity app..." (8.5)│
│    Oct 15, 2024                     │
│ 2. "Anyone building with LangChain? │
│    Need feedback on my agent..." (7)│
│    Oct 20, 2024                     │
│ 3. "Shipped 3 features this week... │
│    automation is the way" (6.2)     │
│    Oct 22, 2024                     │
│                                     │
│ Outreach History:                   │
│ • Nov 7, 11:30 - Message sent       │
│   (by bigbosexf)                    │
│ • Nov 7, 13:45 - Reply received     │
│   "Yeah, I'm interested..."         │
│ • Nov 7, 14:00 - Marked interested  │
│   (by bigbosexf)                    │
│                                     │
│ Notes:                              │
│ [Add note...]                       │
└─────────────────────────────────────┘
```

---

### F10: Manual Reply Creation (Fallback)

**Given:** Reply monitoring failed (network issue, session expired, etc.)
**When:** User manually checks Telegram and sees reply
**Then:** User can manually create reply event in dashboard

**Acceptance:**
- [ ] "Add Manual Reply" button on contact profile
- [ ] Form fields:
  - Contact (pre-filled)
  - Reply text (paste from Telegram)
  - Timestamp (defaults to now, editable)
- [ ] Submit creates U4_Telegram_Reply node
- [ ] Links to contact via U4_REPLIED_VIA
- [ ] Updates outreach_status = 'replied'
- [ ] Shows in dashboard as normal reply
- [ ] Marks as manual (flag: `is_manual_entry: true`) for auditing

**Use Case:** Monitoring worker fails for 2 hours. User checks Telegram manually, sees 3 replies. User adds them manually via dashboard. System state restored.

---

## Non-Functional Criteria

### NF1: Performance (Fast Interactions)

**Message Generation:**
- [ ] p95 latency ≤5 seconds (Maya API call to display message)
- [ ] p99 latency ≤10 seconds
- [ ] Median latency ≤3 seconds

**Reply Detection:**
- [ ] p95 detection time ≤60 seconds (from send to FalkorDB event)
- [ ] p99 detection time ≤120 seconds
- [ ] Median detection time ≤30 seconds

**Dashboard Loading:**
- [ ] Contact queue loads in ≤2 seconds (first 20 contacts)
- [ ] Profile view opens in ≤1 second
- [ ] Metrics dashboard renders in ≤3 seconds

**Monitoring:**
- [ ] Track latency metrics in FalkorDB (for optimization)
- [ ] Alert if p95 exceeds thresholds

---

### NF2: Reliability (High Uptime)

**Reply Monitoring Uptime:**
- [ ] Worker uptime ≥99.5% (max 3.6 hours downtime per month)
- [ ] If worker crashes, auto-restart within 60 seconds
- [ ] Health check every 5 minutes (GET /api/outreach/worker-health)

**FalkorDB Availability:**
- [ ] All writes succeed or retry 3x before failing
- [ ] If FalkorDB unreachable, emit `failure.emit` + alert team
- [ ] No silent data loss (every send/reply recorded)

**Dashboard Availability:**
- [ ] Frontend uptime ≥99.9% (Vercel standard)
- [ ] Backend uptime ≥99.5% (Render standard)

**Disaster Recovery:**
- [ ] If Telegram session expires, alert team within 5 minutes
- [ ] Manual fallback documented (add replies via dashboard UI)
- [ ] Can recreate full state from FalkorDB (no ephemeral data)

---

### NF3: Security (Session Protection)

**Session Encryption:**
- [ ] All Telethon sessions encrypted with Fernet before storage
- [ ] Encryption key stored in environment variable (not in code)
- [ ] Key rotation every 90 days (future feature)
- [ ] Session files never committed to git (verified via audit)

**Read-Only Access:**
- [ ] Telethon configured for read-only (cannot send messages via API)
- [ ] Verified via security audit (cannot call send_message())
- [ ] All sends must be manual (human pastes in Telegram app)

**Data Protection:**
- [ ] Contact analysis data (signals, messages) visible only to authenticated team
- [ ] No public API endpoints exposing contact data
- [ ] FalkorDB access restricted (only backend can query)

**Security Audit:**
- [ ] No plaintext sessions found (automated check)
- [ ] No encryption keys in git history (automated check)
- [ ] No contact PII exposed in logs (manual review)

---

### NF4: Data Accuracy (100% Tracking)

**Send Tracking:**
- [ ] 100% of sends tracked in FalkorDB (no "I think I sent it")
- [ ] Duplicate detection (cannot send to same contact twice)
- [ ] Audit trail for every send (who, when, what message)

**Reply Tracking:**
- [ ] 100% of replies detected (if monitoring active)
- [ ] No duplicate reply events (same telegram_message_id only once)
- [ ] Manual fallback for missed replies (UI available)

**Status Tracking:**
- [ ] Status always reflects reality (no stale pending when already sent)
- [ ] Status history preserved (can reconstruct timeline)
- [ ] No orphan nodes (every message links to contact)

**Verification:**
- [ ] Can query FalkorDB and get exact count of sends, replies, conversions
- [ ] Metrics dashboard matches FalkorDB query results
- [ ] No discrepancies between UI and database

---

### NF5: Usability (Efficient Workflow)

**Send Workflow Efficiency:**
- [ ] Generate → Copy → Mark Sent = 3 clicks (no more)
- [ ] Keyboard shortcuts available:
  - Ctrl+G: Generate message
  - Ctrl+C: Copy to clipboard
  - Ctrl+M: Mark as sent
- [ ] Can queue multiple sends (generate 5 messages, send in batch)

**Learning Curve:**
- [ ] New team member can send first message in <5 minutes (with quick start guide)
- [ ] No training required (UI self-explanatory)
- [ ] Onboarding checklist:
  1. Connect Telegram (2 min)
  2. Generate first message (1 min)
  3. Copy → Paste → Mark sent (2 min)

**Mobile Usability:**
- [ ] Dashboard works on phone (responsive design)
- [ ] Can generate + copy message on mobile
- [ ] Can mark as sent on mobile
- [ ] Can view replies on mobile

**Error Messages:**
- [ ] All errors show actionable fix (not "Error 500")
- [ ] Example: "Telegram session expired. Click here to re-authenticate."
- [ ] No technical jargon (avoid "Telethon AuthKeyError")

---

## Verification

**Test Command:**
```bash
# Backend tests
cd backend/
pytest tests/outreach/ -v --cov=services/outreach

# Frontend tests
cd frontend/
npm test -- tests/outreach/

# E2E tests
npx playwright test tests/e2e/outreach-flow.spec.ts
```

**Seed Data:**
```bash
# Load 313 contacts from analysis JSON
python3 scripts/ingest_analysis_data.py \
  --input data/team_members.json \
  --graph scopelock

# Expected output:
# ✅ Loaded 313 contacts (150 supervisors, 129 hustlers, 34 hybrids)
# ✅ Created U4_Contact_Lead nodes with analysis data
# ✅ Ready for outreach
```

**Expected Outputs:**

**Backend Tests:**
```
tests/outreach/test_message_generator.py::test_generate_hustler_message PASSED
tests/outreach/test_message_generator.py::test_generate_supervisor_message PASSED
tests/outreach/test_message_generator.py::test_personalization_required PASSED
tests/outreach/test_telegram_reader.py::test_reply_detection PASSED
tests/outreach/test_telegram_reader.py::test_duplicate_prevention PASSED
tests/outreach/test_telegram_reader.py::test_session_encryption PASSED
tests/outreach/test_outreach_tracker.py::test_mark_as_sent PASSED
tests/outreach/test_outreach_tracker.py::test_status_transitions PASSED
tests/outreach/test_outreach_tracker.py::test_duplicate_send_prevention PASSED

========== 47 passed in 15.3s ==========

Coverage:
services/outreach/message_generator.py    100%
services/outreach/telegram_reader.py       97%
services/outreach/outreach_tracker.py      98%
------------------------------------------------------------
TOTAL                                      98%
```

**Frontend Tests:**
```
PASS  tests/outreach/contact-queue.test.tsx
  ✓ displays 313 contacts with pagination (89ms)
  ✓ filters by profile type (45ms)
  ✓ sorts by hustler score (67ms)

PASS  tests/outreach/message-generation.test.tsx
  ✓ generates message in <5 seconds (123ms)
  ✓ includes personalization for hustler (78ms)
  ✓ includes personalization for supervisor (82ms)
  ✓ allows editing before send (34ms)

PASS  tests/outreach/reply-detection.test.tsx
  ✓ displays notification on new reply (156ms)
  ✓ updates status to replied (92ms)
  ✓ shows unread badge count (45ms)

Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
Time:        12.456s
```

**E2E Test:**
```
npx playwright test tests/e2e/outreach-flow.spec.ts

Running 12 tests using 3 workers

  ✓  [chromium] › outreach-flow.spec.ts:1:1 › complete outreach flow (15s)
  ✓  [firefox] › outreach-flow.spec.ts:1:1 › complete outreach flow (17s)
  ✓  [webkit] › outreach-flow.spec.ts:1:1 › complete outreach flow (16s)

  12 passed (1.5m)
```

**Manual Verification (Checklist):**

After automated tests pass, human verifies:

- [ ] Load 313 contacts → all visible in dashboard
- [ ] Generate message for hustler → references specific signal
- [ ] Generate message for supervisor → references code review
- [ ] Copy message → paste in Telegram → mark sent → FalkorDB updated
- [ ] Send test reply from contact → detected within 60 seconds
- [ ] Dashboard notification appears → click → full reply visible
- [ ] Mark as interested → status updated → shows in "Interested" filter
- [ ] Metrics dashboard shows correct counts (sent, replied, converted)
- [ ] Connect Telegram session → 2FA flow works → session encrypted
- [ ] Mobile view → contact queue responsive → can generate message

**Performance Verification:**
```bash
# Load test message generation
k6 run tests/load/outreach-load.js

# Expected:
# http_req_duration (message generation): p95=4.2s, p99=7.8s ✅
# http_req_duration (mark sent): p95=180ms, p99=350ms ✅
```

---

## Success Criteria Summary

**Must Have (MVP):**
- ✅ F1-F5: Core workflow (queue → generate → send → monitor → notify)
- ✅ F7: Status tracking (full lifecycle)
- ✅ NF1-NF4: Performance, reliability, security, accuracy

**Should Have (Post-MVP):**
- F6: Reply notifications (SSE real-time updates)
- F8: Metrics dashboard (optimization insights)
- F9: Contact profile view (full context)

**Nice to Have (Future):**
- F10: Manual reply creation (fallback UI)
- Follow-up messages (if no reply after 7 days)
- A/B testing CTAs (different variants)
- Calendar integration (auto-detect call scheduled)

---

**Acceptance Gate:** All F1-F5 + F7 + NF1-NF4 must pass before deployment. F6, F8, F9, F10 can be added in subsequent iterations.

**Timeline:** 2 weeks from spec approval to first outreach message sent.

**Next:** VALIDATION.md (test specifications) → MECHANISM.md (architecture) → ALGORITHM.md (implementation) → GUIDE.md (deployment)
