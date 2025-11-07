# Acceptance Criteria: Telegram Outreach System

**Mission:** Team Member Hunting via Telegram
**Client:** Internal (ScopeLock Team Growth)
**Date Created:** 2025-11-07
**Baseline Tag:** `ac-baseline_telegram-outreach_2025-11-07` (once locked)

---

## Overview

This document defines the **executable acceptance criteria** for the Telegram Outreach System. The mission is complete only when all criteria below are met and verified by automated tests.

**Status:** Draft

---

## Functional Criteria

### F1: Data Ingestion - Import Contact Leads

**User Story:**
As a team member, I want to import analyzed contacts from Telegram export JSON, so that I can start outreach to potential team members.

**Given:** Telegram analysis JSON exists at `outreach/team_members/team_members.json` with 313 contacts
**When:** Data ingestion script runs with FalkorDB connection
**Then:** All 313 contacts are created as U4_Contact_Lead nodes in FalkorDB graph

**Acceptance:**
- [ ] Script successfully connects to FalkorDB REST API
- [ ] All 313 contacts from JSON are imported as U4_Contact_Lead nodes
- [ ] Each node has telegram_id, chat_type, profile_type, supervisor_score, hustler_score
- [ ] Each node has outreach_status = "pending" initially
- [ ] Each node has matching_messages array preserved from analysis
- [ ] Each node has analysis_data JSON with all original fields
- [ ] Script completes in <60 seconds for 313 contacts
- [ ] Duplicate telegram_ids are handled (update existing, don't create duplicates)
- [ ] Script logs success count and any failures

---

### F2: QR Code Authentication - Connect Telegram Account

**User Story:**
As a team member, I want to connect my Telegram account using QR code, so that the system can monitor conversations (read-only, no sending).

**Given:** Team member is logged into Mission Deck and navigates to "Team Member Hunting" mission
**When:** Team member clicks "Connect Telegram" button
**Then:** QR code appears, team member scans with Telegram app, session is authorized and encrypted

**Acceptance:**
- [ ] "Connect Telegram" button visible in mission dashboard
- [ ] Clicking button triggers POST /api/outreach/telegram/qr-start
- [ ] QR code image displays within 2 seconds
- [ ] QR code is valid for 120 seconds (shows countdown timer)
- [ ] Frontend polls GET /api/outreach/telegram/qr-check/{token} every 2 seconds
- [ ] When user scans QR in Telegram app, Telegram shows "Link 'ScopeLock Dashboard'?" dialog
- [ ] After user accepts, backend receives authorization
- [ ] Session string is encrypted with Fernet before storing in FalkorDB
- [ ] U4_Telegram_Session node created with: session_string (encrypted), authorized_by (team member ref), is_active=true
- [ ] Frontend shows success message: "Telegram connected! Monitoring started."
- [ ] If QR expires before scan, shows "Expired" message and offers retry

**Security:**
- [ ] No phone code flow (NEVER ask user to enter code - violates Telegram warning)
- [ ] Session string never logged or exposed in API responses
- [ ] Encryption key stored in environment variable, not code
- [ ] QR code invalidates after single use or 120s timeout

---

### F3: Message Generation - Maya AI Creates Personalized Outreach

**User Story:**
As a team member, I want to generate a personalized outreach message for a contact, so that I can send it via Telegram without writing from scratch.

**Given:** Contact exists in queue with outreach_status = "pending" and matching_messages array populated
**When:** Team member clicks "Generate Message" for a contact
**Then:** Maya AI generates personalized message referencing contact's actual activity

**Acceptance:**
- [ ] Generate button visible for contacts with status = "pending"
- [ ] Clicking button triggers POST /api/outreach/generate-message/{contact_id}
- [ ] Maya service receives contact data: name, profile_type, signals, matching_messages
- [ ] Maya identifies best "hook" from matching_messages (highest-signal message)
- [ ] Maya generates message using template appropriate for profile_type (supervisor vs hustler)
- [ ] Generated message includes: personalized greeting, hook reference, ScopeLock value prop, clear CTA
- [ ] Message is <500 characters (Telegram best practice for cold outreach)
- [ ] Message generation completes in <5 seconds
- [ ] U4_Outreach_Message node created in FalkorDB with: message_text, generated_by="maya", is_sent=false
- [ ] U4_Outreach_Message HAS_MESSAGE relationship created to U4_Contact_Lead
- [ ] Frontend displays generated message in editable text area
- [ ] Team member can edit message before sending (manual override)
- [ ] Frontend shows "personalization_context" (which hook was used, which signals)

**Quality:**
- [ ] Message tone is professional, conversational, not spammy
- [ ] Message references specific user activity (not generic)
- [ ] Message explains ScopeLock value clearly
- [ ] CTA is clear ("Interested in hearing more? Let me know!")

---

### F4: Outreach Queue - View Pending Contacts

**User Story:**
As a team member, I want to see a queue of pending contacts to reach out to, so that I can systematically work through the list.

**Given:** 313 contacts imported with outreach_status = "pending"
**When:** Team member opens "Team Member Hunting" mission dashboard
**Then:** Queue displays contacts sorted by score (highest priority first)

**Acceptance:**
- [ ] Dashboard shows count: "313 pending contacts"
- [ ] Queue displays contacts in table/list format
- [ ] Each contact shows: name, profile_type, supervisor_score, hustler_score, top 2 signals
- [ ] Queue sorted by: supervisor_score + hustler_score (highest first)
- [ ] Can filter by profile_type: "Supervisor", "Hustler", "Both", "Unknown"
- [ ] Can filter by minimum score threshold
- [ ] Pagination: 20 contacts per page
- [ ] Queue loads in <1 second for first page
- [ ] Clicking contact expands detail panel showing: full signals, sample matching_messages

---

### F5: Manual Send Workflow - Mark Message as Sent

**User Story:**
As a team member, I want to mark a message as sent after I manually send it via Telegram, so that the system tracks outreach progress.

**Given:** Message generated for contact, team member manually sends message via Telegram app
**When:** Team member clicks "Mark as Sent" button in dashboard
**Then:** Contact status updates to "contacted", message marked sent with timestamp

**Acceptance:**
- [ ] "Mark as Sent" button visible after message is generated
- [ ] Clicking button triggers POST /api/outreach/mark-sent with contact_id, message_id
- [ ] U4_Outreach_Message node updated: is_sent=true, sent_at=[current timestamp], sent_by=[team member ref]
- [ ] U4_Contact_Lead node updated: outreach_status = "contacted", contacted_at=[current timestamp]
- [ ] Contact removed from pending queue
- [ ] Contact appears in "Contacted" view (separate tab)
- [ ] Frontend shows success confirmation: "Marked as sent!"
- [ ] Action logged in backend (for audit trail)

---

### F6: Conversation Monitoring - Detect Telegram Replies

**User Story:**
As a team member, I want the system to automatically detect when a contact replies on Telegram, so that I don't miss responses.

**Given:** Team member has connected Telegram session, message marked as sent to contact
**When:** Contact replies on Telegram
**Then:** System detects reply within 120 seconds and notifies team member

**Acceptance:**
- [ ] Background worker runs asyncio loop polling conversations every 60 seconds
- [ ] Worker uses encrypted session_string to connect via Telethon
- [ ] Worker queries Telegram for new messages in monitored conversations
- [ ] New message detected: U4_Telegram_Reply node created with: telegram_message_id, message_text, received_at
- [ ] U4_Telegram_Reply REPLY_TO relationship created to U4_Outreach_Message
- [ ] U4_Contact_Lead updated: outreach_status = "replied", replied_at=[timestamp]
- [ ] U4_Telegram_Conversation updated: last_message_id, unread_count+=1
- [ ] Reply detection latency p95 ≤ 120 seconds (worst case: just after previous poll + 60s interval)
- [ ] Frontend shows notification: "New reply from {contact_name}!"
- [ ] Unread count badge appears on dashboard

**Performance:**
- [ ] Worker handles up to 100 active conversations without lag
- [ ] Polling loop completes in <10 seconds per session
- [ ] No rate limit errors from Telegram API (max 30 requests/second respected)

---

### F7: Disconnect Telegram - Revoke Session

**User Story:**
As a team member, I want to disconnect my Telegram account from the system, so that monitoring stops and session is revoked.

**Given:** Team member has active Telegram session connected
**When:** Team member clicks "Disconnect Telegram" button
**Then:** Session is invalidated, monitoring stops, team member can reconnect later if needed

**Acceptance:**
- [ ] "Disconnect Telegram" button visible when session is active
- [ ] Clicking button shows confirmation dialog: "This will stop monitoring. Continue?"
- [ ] On confirm, triggers POST /api/outreach/telegram/disconnect
- [ ] Backend logs out Telegram session via Telethon
- [ ] U4_Telegram_Session node updated: is_active=false, is_monitoring=false, disconnected_at=[timestamp]
- [ ] Background worker stops polling for this session
- [ ] Frontend shows: "Telegram disconnected. Monitoring stopped."
- [ ] Team member can see "Connect Telegram" button again to reconnect
- [ ] Can also revoke in Telegram app settings (session shows as "ScopeLock Dashboard")

---

## Non-Functional Criteria

### NF1: Performance

**API Response Time:**
- p95 latency ≤ 500ms for all GET endpoints (queue, conversations)
- p95 latency ≤ 1000ms for POST endpoints (generate message, mark sent)
- p99 latency ≤ 2000ms for all endpoints

**Message Generation:**
- Maya AI response time ≤ 5 seconds per contact
- If Maya timeout (>10s), fallback to generic template with warning

**Background Monitoring:**
- Polling cycle completes in ≤ 10 seconds per Telegram session
- Reply detection latency p95 ≤ 120 seconds (60s poll interval + processing)

**Database Performance:**
- FalkorDB Cypher queries ≤ 200ms for single-node lookups
- FalkorDB Cypher queries ≤ 1000ms for queue listing (313 nodes with filters)
- Contact import script ≤ 60 seconds for 313 contacts

---

### NF2: Quality

**Error Rate:**
- Production error rate ≤ 1% of API requests (1 in 100 allowed to fail gracefully)
- Zero unhandled exceptions reaching frontend
- All errors logged with location (file:line) per ScopeLock fail-loud principle

**Error Handling:**
- Telegram API errors: Catch, log, emit failure event, show user-friendly message
- FalkorDB connection errors: Retry 3 times with exponential backoff, then fail-loud
- Maya AI errors: Fallback to generic template, log for debugging
- QR code timeout: Show clear message "QR expired, please retry"

**Data Integrity:**
- No duplicate contact nodes (telegram_id is unique constraint)
- No orphaned message nodes (all messages link to contact)
- Session encryption/decryption round-trips successfully (test before using)

---

### NF3: Deployment

**Platform:**
- Backend: FastAPI on Render (Python 3.11+)
- Frontend: Next.js integrated into existing Mission Deck (Vercel)
- Database: FalkorDB via REST API (existing production instance)

**Deployment Process:**
- Zero-downtime deployment (Render handles gracefully)
- Environment variables: TELEGRAM_API_ID, TELEGRAM_API_HASH, FALKORDB_API_KEY, FERNET_ENCRYPTION_KEY
- Database migrations: Not needed (FalkorDB is schemaless, nodes created on first use)

**Monitoring:**
- Backend error logging to stdout (Render captures)
- Frontend error tracking via existing Mission Deck monitoring
- Background worker health check: Logs heartbeat every 5 minutes

---

### NF4: Security

**Authentication:**
- Reuse Mission Deck authentication (team member must be logged in)
- No separate login for Telegram outreach mission

**Authorization:**
- Only authenticated team members can access outreach mission
- Team member can only see their own Telegram sessions (not others')

**Data Protection:**
- Telegram session strings encrypted with Fernet before storage
- Encryption key in environment variable (FERNET_ENCRYPTION_KEY), never in code
- Session strings never logged or exposed in API responses
- Session strings decrypted only in memory for Telethon connection

**Telegram ToS Compliance:**
- Read-only access via Telethon (no automated sending)
- QR code authentication (no phone code sharing)
- Manual send workflow (human clicks send in Telegram app)
- Background monitoring polls every 60s (respects rate limits)

---

### NF5: Telegram ToS Compliance (Critical)

**No Automated Sending:**
- System has ZERO capability to send messages via Telethon
- sendMessage() function is NEVER called from backend
- Team member manually sends via Telegram app (system only tracks)

**Read-Only Access:**
- Telethon client uses read permissions only
- System can: read messages, get conversations, check auth status
- System cannot: send messages, delete messages, modify settings

**Rate Limiting:**
- Background worker respects Telegram API limits (30 requests/second)
- Implements backoff if rate limit errors occur
- Logs rate limit warnings for debugging

---

## Verification

This section defines how to verify that all acceptance criteria are met.

### Test Command

**Run all acceptance tests:**
```bash
# Backend acceptance tests (pytest)
cd backend
pytest tests/acceptance/test_telegram_outreach.py -v

# Frontend integration tests (Playwright)
cd frontend
npx playwright test tests/integration/telegram-outreach.spec.ts

# Performance benchmarks
cd backend
python tests/performance/benchmark_telegram_outreach.py
```

---

### Seed Data

**Location:** `backend/tests/fixtures/telegram_outreach_seed.py`

**Setup:**
```bash
# Import seed contacts to FalkorDB
cd backend
python scripts/import_test_contacts.py

# This creates 10 test contacts in FalkorDB for testing
```

**Required seed data:**
- 10 test contacts (telegram_id: 1000001 through 1000010)
- Profile types: 5 supervisors, 5 hustlers
- All with matching_messages array (at least 3 messages each)
- All with outreach_status = "pending"

---

### Expected Outputs

**When all tests pass, you should see:**
```
✓ F1: Data Ingestion - imports 313 contacts successfully (2.3s)
✓ F2: QR Code Authentication - generates valid QR code (0.8s)
✓ F2: QR Code Authentication - authorizes session on scan (1.2s)
✓ F3: Message Generation - Maya generates personalized message (3.1s)
✓ F3: Message Generation - message includes hook reference (3.2s)
✓ F4: Outreach Queue - displays pending contacts sorted (0.5s)
✓ F4: Outreach Queue - filters by profile type (0.4s)
✓ F5: Manual Send Workflow - marks message as sent (0.3s)
✓ F5: Manual Send Workflow - updates contact status to contacted (0.3s)
✓ F6: Conversation Monitoring - detects reply within 120s (polling simulation)
✓ F6: Conversation Monitoring - creates U4_Telegram_Reply node (0.6s)
✓ F7: Disconnect Telegram - invalidates session (0.5s)
✓ F7: Disconnect Telegram - stops monitoring (0.2s)
✓ NF1: Performance - API p95 latency <500ms (measured: 287ms avg)
✓ NF1: Performance - Message generation <5s (measured: 3.2s avg)
✓ NF2: Quality - zero unhandled exceptions (0 errors)
✓ NF4: Security - session string encrypted (verified round-trip)

All tests passed (17/17)
```

---

### Performance Benchmarks

**Run performance tests:**
```bash
cd backend
python tests/performance/benchmark_telegram_outreach.py
```

**Expected results:**
- Contact queue query (313 nodes): ≤ 1000ms
- Single contact lookup: ≤ 200ms
- Message generation (Maya): ≤ 5000ms
- Mark as sent update: ≤ 300ms
- Reply detection polling cycle: ≤ 10000ms per session

---

## Change Log

**Baseline:** 2025-11-07 - Initial acceptance criteria

---

## Sign-Off

**Client Approval:** Internal (NLR approval required)
**Inna (Specifier):** 2025-11-07
**Rafael (Code Gen):** [Pending - after implementation]
**Sofia (QA):** [Pending - after testing]

---

## Notes

**Critical Design Decisions:**

1. **QR Code Authentication:** Uses QR instead of phone code to avoid Telegram's "NEVER SHARE THIS CODE" warning. More trustworthy UX.

2. **Read-Only System:** Telethon has read permissions only. Team member manually sends via Telegram app. This is the ONLY way to stay ToS-compliant.

3. **60-Second Polling:** Background worker polls conversations every 60 seconds. Reply detection latency p95 ≤ 120s (worst case: reply arrives just after poll + 60s wait).

4. **Session Encryption:** Fernet encryption for session_string because it contains account access. Decrypt only in memory, never log.

5. **Manual Send Tracking:** System can't verify message was actually sent (no access to user's sent messages). Relies on team member honesty when clicking "Mark as Sent."

**Edge Cases to Consider:**

- Contact deletes their Telegram account → Reply detection will fail gracefully (no user found)
- Team member loses phone → Can disconnect session from dashboard OR revoke in Telegram settings
- Telegram changes export format → Data ingestion script may break (validate JSON schema first)
- Maya AI generates inappropriate message → Team member reviews before sending (human in the loop)
- Multiple team members connect Telegram → Each has separate session, separate monitoring
