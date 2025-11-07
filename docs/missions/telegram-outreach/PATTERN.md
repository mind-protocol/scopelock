# PATTERN: Telegram Outreach System

**Mission:** Team Member Hunting via Telegram
**Client:** Internal (ScopeLock Team Growth)
**Date Created:** 2025-11-07
**Owner:** Inna (The Specifier)

---

## Why ScopeLock Approach

This mission automates team member discovery and outreach while maintaining human oversight and Telegram ToS compliance. ScopeLock's structured approach ensures:

- **AC-first:** Clear success criteria before implementation (313 contacts imported, QR auth works, messages tracked)
- **Evidence-driven:** Quantified signals (supervisor_score, hustler_score) drive outreach decisions, not hunches
- **Fail-loud:** Telegram ToS violations caught early through read-only architecture + manual send workflow

---

## Core Principles

### 1. Pay at AC Green
Internal mission, but same rigor: All acceptance tests must pass before considering complete. No shortcuts.

### 2. Evidence Sprint First
Prove value with first 10 successful outreach messages before expanding to full 313 contacts.

### 3. ToS-First: Never Risk Account Bans

**Critical:** Telegram bans accounts for automated sending. This system is read-only for automation.

- **Monitoring:** Automated (polls conversations every 60s)
- **Sending:** Manual (human clicks send in Telegram app)
- **Authentication:** QR code (no sketchy "share your code" flow)

### 4. Personalization at Scale

Maya AI generates unique messages using contact's actual Telegram activity (matching_messages from analysis). 90% time savings while maintaining authenticity.

### 5. FalkorDB-Native Graph Storage

All data stored as Mind Protocol v2 graph nodes with universal attributes. Enables future relationship analysis (who knows who, network effects).

---

## Risk Factors

### Risk 1: Telegram Account Ban

**Description:** Automated sending from user accounts violates Telegram ToS. Could ban team member's personal account.

**Mitigation:**
- Read-only system access (no automated sending)
- Manual send workflow (human clicks in Telegram)
- QR code auth (transparent, revokable, no code sharing)
- Monitor Telegram ToS changes weekly

### Risk 2: Low Response Rate

**Description:** Cold outreach may yield <10% response rate, wasting team time.

**Mitigation:**
- High-quality targeting (supervisor_score ≥7 or hustler_score ≥10)
- Personalized messages (reference actual user activity)
- A/B test message templates (track response rates per template)
- Evidence Sprint proves concept with first 10 sends

### Risk 3: Session Encryption Failure

**Description:** Telegram session strings contain account access. If leaked, account is compromised.

**Mitigation:**
- Fernet encryption for session_string field (decrypt only in memory)
- Environment variable for encryption key (not in code)
- Auto-disconnect after 7 days of inactivity
- Team member can revoke in Telegram settings anytime

### Risk 4: Maya AI Generates Inappropriate Messages

**Description:** AI could generate spammy, aggressive, or unprofessional messages.

**Mitigation:**
- Human reviews generated message before sending (not automated)
- Maya uses template-based prompts (structure enforced)
- Track message quality via response rate (low rate = bad messages)
- A/B test message styles (find what works)

---

## Success Criteria

### Business Outcomes

**Primary:**
- 5 new qualified team members join ScopeLock within 30 days of system launch

**Secondary:**
- 90% time savings vs manual message writing (5 min → 30 sec per contact)
- 15%+ response rate (better than LinkedIn cold outreach baseline ~8%)
- Zero Telegram account bans

### Technical Milestones

- 313 contacts imported to FalkorDB with full metadata
- QR code authentication works (team member can connect Telegram in <2 minutes)
- Message generation completes in <5 seconds per contact
- Reply detection latency <120 seconds (polls every 60s)
- p95 API response time <500ms for all endpoints
- Zero data loss (all conversations tracked)

---

## Constraints

**Hard constraints:**

- **Must not violate Telegram ToS:** No automated sending from user accounts
- **Must use FalkorDB:** Per project architecture decision (not PostgreSQL)
- **Must integrate with Mission Deck:** Cannot be standalone app
- **Must use existing auth:** Reuse Mission Deck authentication (no separate login)
- **No analytics dashboard:** Simple queue-based workflow only

---

## Assumptions

**Verify these before proceeding:**

- Team members are willing to connect their personal Telegram accounts (QR code auth)
- Telegram export JSON format remains stable (may break if Telegram changes export structure)
- 313 contacts from analysis are still active on Telegram (accounts not deleted)
- Maya AI service is accessible from backend (API endpoint or Claude Code integration)
- FalkorDB REST API has sufficient query performance for 313+ contact nodes

---

## Dependencies

**External dependencies:**

- **Telegram API:** Requires API ID + API Hash from my.telegram.org (ScopeLock account)
- **Maya AI Service:** Must be running and accessible (exact integration TBD)
- **FalkorDB Production:** Must be deployed and accessible at mindprotocol.onrender.com
- **Telethon Library:** Python client for Telegram MTProto API
- **QRCode Library:** Python library for QR code generation
- **Cryptography Library:** Fernet encryption for session strings

---

## Out of Scope

**This mission does NOT include:**

- **Automated sending:** Humans manually send messages (ToS compliance)
- **Analytics dashboard:** No charts/graphs/metrics visualization
- **Multi-account management:** One Telegram connection per team member
- **Client outreach:** This is team member hunting only (client outreach is separate mission)
- **Email/LinkedIn outreach:** Telegram-only for this mission
- **Bulk import from other sources:** Only supports Telegram export JSON
- **Message scheduling:** Send immediately or manually (no scheduled sends)
- **Team member CRM:** Basic queue workflow only (no pipeline/stages/notes)

---

## Notes

**Key insights from discovery:**

1. **QR Code vs Phone Code:** User identified critical UX issue - phone code auth shows "NEVER SHARE THIS CODE" warning from Telegram, contradicts our system asking for code. QR code solves this (transparent, no code sharing).

2. **Telegram Export Limitations:** Telegram exports don't include @username handles, only numeric telegram_id. This is fine - telegram_id is permanent, usernames can change.

3. **Personalization Context:** The matching_messages array from analysis provides gold for personalization. Example: "Saw you grinding those 100 retweets for UBC" directly references actual user activity.

4. **Hybrid Approach:** Read-only automation + manual sending is the ONLY way to stay ToS compliant while gaining efficiency. Full automation would work for ~2 weeks then ban account.

5. **Mind Protocol v2 Universal Attributes:** All new node types must follow universal attribute standard (created_at, created_by, etc.) for consistency with existing Mission Deck nodes.
