# PATTERN: Team Member Hunting (Telegram Outreach System)

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Systematic outreach to 313 qualified Telegram contacts for ScopeLock team expansion

---

## Why ScopeLock Approach

**The Problem:** ScopeLock needs to scale from 3 human team members to 10+ within 60 days. Traditional recruitment (job boards, LinkedIn) is too slow and attracts wrong profile (corporate mindset, not hustle culture). We have 313 pre-qualified Telegram contacts from network analysis - people already in AI/dev communities, already grinding, already have the technical signals we need.

**Why This System:**
- **Personalization at Scale:** Maya generates unique messages based on each contact's profile (supervisor vs hustler), signals (voice AI, code review, productivity tools), and matching messages. No generic templates that get ignored.
- **Human-in-Loop Sending:** No automated spam - Bigbosexf manually confirms each send after reviewing Maya's draft. Protects Telegram account from suspension, ensures quality control.
- **Automated Reply Detection:** Telethon monitors conversations 24/7, detects replies within 60 seconds, creates FalkorDB events. No manual inbox checking, no missed opportunities.
- **Evidence-Native:** Every outreach, every reply, every conversion tracked in FalkorDB. Full audit trail for optimization.

**ScopeLock Advantage:** We can outreach to 313 contacts in 1-2 weeks (vs months of job board posting), with personalized messaging (vs generic InMails), with automated follow-up detection (vs manual inbox chaos).

---

## Core Principles

### 1. Personalization Over Templates

**Why:** Generic "join our team" messages get 2% response rates. Personalized "I saw you grinding on X, we're building Y" messages get 15-20% response rates.

**How:** Maya reads contact's full analysis data:
- **Profile type:** Supervisor (code review focus) vs Hustler (marketing/outreach focus) vs Hybrid
- **Signals:** Voice AI projects, code review activity, productivity tools, AI apps
- **Matching messages:** Actual Telegram messages that prove relevant skills
- **Scores:** supervisor_score (0-100) and hustler_score (0-100)

**Example:**
```
Contact: Liam
Profile: Hustler (supervisor_score=1, hustler_score=15)
Signals: voice_ai, productivity_tools
Matching messages: "Just launched a voice AI demo..." (Oct 15)

Maya generates:
"Hey Liam! Saw you grinding on voice AI stuff - that demo you posted on Oct 15 was fire 🔥.

We're building ScopeLock (AI-human dev agency) and need someone who can hunt Upwork jobs and write killer proposals. You'd be perfect for the hustler role - find jobs, write proposals with Emma (our AI), get paid per interaction.

No corporate BS, no timesheets. Just results. Interested?"
```

**Contrast with Generic Template:**
```
"Hi, we're hiring for a business development role. Apply here: [link]"
```

**Rule:** Every message MUST reference specific signal or message from contact's analysis. No generic openers allowed.

---

### 2. Manual Sending, Automated Monitoring

**Why Send Manually:**
- Protects Telegram account from spam detection/suspension
- Allows human quality control before send
- Enables timing optimization (send when contact likely online)
- Complies with Telegram ToS (no automated bulk sending)

**Why Monitor Automatically:**
- Humans can't check 313 conversations every hour
- Reply window is critical (respond within 2-4 hours = 3x conversion)
- Automated detection = zero missed replies
- FalkorDB event creation = instant dashboard notification

**Workflow:**
1. Dashboard shows next contact in queue (sorted by hustler/supervisor score)
2. Click contact → Maya generates message (5-10 seconds)
3. Human reviews, edits if needed, copies to clipboard
4. Opens Telegram, pastes, sends manually
5. Marks as sent in dashboard → Updates FalkorDB
6. Background worker monitors conversation every 60s → Detects reply → Dashboard notification

**Guardrail:** If human doesn't mark as sent, contact stays in queue. No silent drops.

---

### 3. Profile-Based Messaging Strategy

**Supervisor Profile (High Code Review Signals):**
- Focus: Technical mentorship, code quality, AI-assisted development
- Value prop: "Guide junior devs with Rafael (AI code generator), get paid per interaction"
- Pain point: "Tired of writing the same code reviews? Let Rafael generate boilerplate, you focus on architecture."
- CTA: "15-min call to show you the workflow?"

**Hustler Profile (High Marketing/Outreach Signals):**
- Focus: Business development, proposal writing, client acquisition
- Value prop: "Hunt Upwork jobs, write proposals with Emma (AI), get paid per interaction"
- Pain point: "Tired of hourly rate grind? Get paid for finding/winning jobs, not just doing them."
- CTA: "Wanna see how we're using AI to 10x proposal output?"

**Hybrid Profile (Both Signals):**
- Focus: Full-stack contribution (code + biz dev)
- Value prop: "Contribute however you want - code, proposals, QA, docs - get paid for all of it"
- Pain point: "Most teams force you into one box. We pay for value, not role."
- CTA: "Curious how this works? 10-min demo?"

**Rule:** Message MUST align with profile type. No supervisor messaging to hustlers.

---

### 4. Fail-Loud on Monitoring Failures

**The Risk:** Background worker fails silently → replies go undetected → contact thinks we're ignoring them → lost conversion.

**The Solution:** Fail-loud + manual fallback.

**Implementation:**
```python
async def monitor_conversations():
    try:
        # Poll Telegram for new messages
        new_replies = await check_all_conversations()

        # Create FalkorDB events
        for reply in new_replies:
            create_telegram_reply_event(reply)

    except TelethonAuthKeyError:
        # Session expired - CRITICAL
        emit_failure("telegram.session_expired", {
            "location": "services/telegram_reader.py:45",
            "severity": "critical",
            "action": "Human must re-authenticate Telegram session"
        })
        # Send alert to team Telegram
        send_telegram_alert("🚨 Telegram monitoring DOWN - session expired")

    except NetworkError as e:
        # Temporary network issue - LOG but don't stop
        log.warning(f"Network error in monitoring: {e}")
        # Retry on next loop (60s)

    except Exception as e:
        # Unknown error - CRITICAL
        emit_failure("telegram.monitoring_unknown_error", {
            "location": "services/telegram_reader.py:60",
            "error": str(e),
            "action": "Human must check Telegram manually"
        })
        send_telegram_alert(f"🚨 Telegram monitoring ERROR: {e}")
```

**Manual Fallback:** If monitoring fails, human checks Telegram manually and creates reply events via dashboard UI.

**Rule:** Never silently fail. Always emit event + alert team.

---

### 5. Evidence Over Guessing

**What We Track:**
- **Outreach metrics:** messages generated, messages sent, time to send
- **Response metrics:** reply rate, reply time, sentiment (positive/neutral/negative)
- **Conversion metrics:** interested → call scheduled → joined team
- **Optimization data:** which signals correlate with replies? which CTAs work best?

**FalkorDB Audit Trail:**
```
(contact:U4_Contact_Lead)
  -[:U4_RECEIVED]->(msg:U4_Outreach_Message {sent_at, sent_by})
    -[:U4_GENERATED_BY]->(maya:U4_Agent {slug: 'maya'})
  -[:U4_REPLIED_VIA]->(reply:U4_Telegram_Reply {message_text, sent_at})
  -[:U4_CONVERTED_TO]->(member:U4_Agent {joined_at})
```

**Queryable Insights:**
- "What's our reply rate for hustler vs supervisor profiles?"
- "Which signals appear most in contacts who replied?"
- "What's average time from outreach to conversion?"
- "Which team member has highest send rate? conversion rate?"

**Rule:** If it's not in FalkorDB, it didn't happen. No "I think we reached out to 50 people."

---

## Risk Factors & Mitigation

### Risk 1: Telegram Account Suspension (Spam Detection)

**Likelihood:** Medium (if sending too fast)
**Impact:** High (lose access to all conversations, can't monitor replies)

**Mitigation:**
- Manual sending only (no automation = no spam patterns)
- Rate limiting: max 20 sends per day (built into dashboard)
- Human review before each send (catches accidental duplicates)
- No bulk actions (no "send to all 313 at once" button)
- Stagger sends (don't send 20 in 10 minutes - spread over hours)

**Detection:** If Telegram API returns 420 FLOOD error, stop sending for 24 hours + alert team.

**Fallback:** If account suspended, use backup Telegram account + re-authenticate Telethon session.

---

### Risk 2: Low Response Rates (<10%)

**Likelihood:** Medium (depends on message quality)
**Impact:** Medium (slow team growth, wasted effort)

**Mitigation:**
- Personalization (reference specific signals/messages)
- Profile-based messaging (supervisor vs hustler angles)
- Timing optimization (send when contact likely online - future feature)
- A/B testing different CTAs (future feature)
- Follow-up after 3 days if no reply (future feature)

**Detection:** If reply rate drops below 10% after 50 sends, pause and analyze.

**Response:** Review messages with low reply rates → identify patterns → adjust Maya's generation prompt.

---

### Risk 3: Session Security (Telethon Session Leak)

**Likelihood:** Low (if proper encryption)
**Impact:** Critical (account compromise, data breach)

**Mitigation:**
- Encrypt session files with Fernet (symmetric encryption)
- Store encryption key in environment variable (not in code)
- Never commit session files to git (.gitignore enforced)
- Read-only Telethon access (no message sending via API)
- Session stored in FalkorDB as encrypted blob (not plaintext)

**Detection:** Regular security audits, check for session files in git history.

**Response:** If session leaked, revoke immediately + re-authenticate + rotate encryption key.

---

### Risk 4: Conversation Tracking Failures (Missed Replies)

**Likelihood:** Medium (network issues, API changes)
**Impact:** High (lost conversions, bad user experience)

**Mitigation:**
- Fail-loud on errors (emit event + alert team)
- Manual fallback UI (human can manually add replies)
- Retry logic for temporary network errors
- Health check endpoint (monitor worker status)
- Duplicate detection (don't create same reply twice)

**Detection:** If no new replies detected in 24 hours + we sent 20 messages, trigger alert.

**Response:** Human checks Telegram manually, creates missing reply events via dashboard.

---

### Risk 5: Maya Generates Bad Messages (Off-Brand, Spammy)

**Likelihood:** Low (with good prompts)
**Impact:** Medium (low response rates, brand damage)

**Mitigation:**
- Human review before every send (quality gate)
- Maya prompt includes ScopeLock brand voice (no "Dear Sir/Madam")
- Example messages in prompt (show good vs bad)
- Feedback loop (human can edit Maya's draft, log edits for training)

**Detection:** If human edits >50% of Maya's messages, prompt needs fixing.

**Response:** Analyze common edits → update Maya's generation prompt → re-test.

---

## Success Criteria

### Business Outcomes (60 Days)

**Primary Goal:** Recruit 5+ new team members (3 hustlers, 2 supervisors)

**Metrics:**
- **Outreach volume:** 313 contacts reached (100%)
- **Reply rate:** ≥15% (47+ replies)
- **Conversion rate:** ≥10% of replies → calls scheduled (5+ calls)
- **Join rate:** ≥80% of calls → team members (4-5 joins)

**Revenue Impact:**
- New hustlers find 10+ Upwork jobs/month → +$5k-10k/month revenue
- New supervisors reduce NLR bottleneck → faster delivery → more projects

---

### Technical Milestones (Implementation)

**Week 1:**
- ✅ All 313 contacts loaded into FalkorDB (from analysis JSON)
- ✅ Maya message generation working (<5s per message)
- ✅ Dashboard shows outreach queue (sorted by score)
- ✅ Manual send workflow functional (copy → Telegram → mark sent)

**Week 2:**
- ✅ Telethon background worker deployed (monitoring all conversations)
- ✅ Reply detection working (<60s from send to FalkorDB event)
- ✅ Dashboard notifications for new replies
- ✅ Reply rate tracking (metrics dashboard)

**Week 3:**
- ✅ 50+ contacts reached (first batch)
- ✅ Reply rate measured (adjust if <10%)
- ✅ First conversions tracked (interested → call → joined)

**Week 4+:**
- ✅ Remaining 263 contacts reached
- ✅ Follow-up system for non-replies (future feature)
- ✅ A/B testing different messages (future feature)

---

### Quality Gates (Non-Negotiable)

**Message Quality:**
- 100% of messages MUST reference specific signal or message from contact's analysis
- 0% generic templates ("Dear hiring manager")
- Human edits <20% of Maya's drafts (if higher, prompt needs fixing)

**System Reliability:**
- Reply detection uptime ≥99.5% (max 3.6 hours downtime/month)
- Zero silent failures (all errors → FalkorDB event + team alert)
- Session security audit passed (no plaintext sessions, encryption verified)

**Data Integrity:**
- 100% of sends tracked in FalkorDB (no "I think I sent it")
- 100% of replies tracked in FalkorDB (no manual inbox checking)
- Audit trail complete (can reconstruct full outreach history from graph)

---

## Alignment with ScopeLock First Principles

### Event-Native, Membrane-First

**Every interaction is an event:**
- `outreach.message.generated` (Maya creates draft)
- `outreach.message.sent` (human confirms send)
- `telegram.reply.detected` (Telethon finds new message)
- `outreach.contact.converted` (contact joins team)

**Membrane boundaries:**
- Maya service boundary: `/api/outreach/generate-message` (emit/accept events)
- Telegram Reader boundary: background worker (emit reply events)
- Dashboard boundary: UI renders events, emits send confirmations

**No secret pulls:** Dashboard doesn't poll backend for "are there new replies?" - backend emits events, dashboard subscribes.

---

### Law at L4 (Policies/Schemas Gate Acceptance)

**Schema enforcement:**
- U4_Contact_Lead MUST have `telegram_id`, `profile_type`, `outreach_status`
- U4_Outreach_Message MUST link to U4_Contact_Lead via U4_RECEIVED
- U4_Telegram_Reply MUST have `message_text`, `sent_at`, `telegram_message_id`

**Policy gates:**
- Cannot send message if `outreach_status = 'sent'` (prevent duplicates)
- Cannot monitor conversation if Telegram session invalid (fail-loud)
- Cannot mark as sent without message text (prevent empty sends)

---

### Build-Time Proof, Static Runtime

**What's static:**
- Contact analysis data (loaded once from JSON, immutable)
- Profile type assignments (supervisor/hustler, calculated at load time)
- Scoring (supervisor_score, hustler_score, pre-calculated)

**What's dynamic:**
- Outreach status (pending → sent → replied)
- Message generation (Maya generates on-demand)
- Reply detection (Telethon polls live Telegram)

**Proof artifact:** Can generate full outreach report at any time from FalkorDB (no live data needed).

---

### Fail-Loud (No Silent Errors)

**Critical paths protected:**
- Telethon session expired → emit event + alert team + manual fallback
- Network error during monitoring → log + retry on next loop
- Unknown monitoring error → emit event + alert team + stop worker
- Message generation error → show error in UI + don't allow send
- FalkorDB write failure → retry 3x + emit event if still failing

**Rule:** Every `try/except` either rethrows OR emits `failure.emit{location, reason}`. No swallowed exceptions.

---

### Quote-Before-Inject (Compute Budget Gates)

**Heavy operations:**
- Maya message generation (LLM call via Claude Code)
- Telethon session creation (Telegram API auth)
- Bulk contact ingestion (313 FalkorDB writes)

**Budget gates:**
- Message generation: max 313 calls (one per contact) - acceptable on Claude Code subscription
- Session creation: one-time auth (human confirms 2FA) - no ongoing cost
- Contact ingestion: one-time bulk load - acceptable

**Monitoring:** If Claude Code usage spikes unexpectedly, alert team.

---

### Evidence > Prose

**We don't say:** "We reached out to a bunch of people and got some replies."

**We say:** "We reached 127 contacts (40.6% of queue), 19 replied (15.0% reply rate), 3 converted (15.8% conversion rate). Best-performing profile: hustler (18.2% reply rate vs 11.1% supervisor). Best-performing signal: voice_ai (23.5% reply rate)."

**Source:** FalkorDB queries, not gut feelings.

**Queryable at any time:**
```cypher
// Reply rate by profile type
MATCH (c:U4_Contact_Lead)-[:U4_RECEIVED]->(m:U4_Outreach_Message)
OPTIONAL MATCH (c)-[:U4_REPLIED_VIA]->(r:U4_Telegram_Reply)
WITH c.profile_type AS profile, count(DISTINCT m) AS sent, count(DISTINCT r) AS replied
RETURN profile, sent, replied, (replied * 100.0 / sent) AS reply_rate
ORDER BY reply_rate DESC
```

---

## Open Questions (To Be Resolved)

### Q1: Follow-Up Strategy

**Question:** If contact doesn't reply after 3 days, do we send a follow-up? If yes, what's the message?

**Options:**
1. No follow-up (respect their silence, avoid spam)
2. One gentle follow-up after 7 days ("Hey, just checking if you saw my message?")
3. Two follow-ups (day 3 + day 7)

**Decision:** TBD (start with no follow-up, measure conversion rate, add if needed)

---

### Q2: Timing Optimization

**Question:** Should we analyze when contacts are most active on Telegram and send messages at optimal times?

**Options:**
1. Send whenever human is available (simple, immediate)
2. Queue messages and send at optimal times (complex, potentially higher reply rate)

**Decision:** TBD (start with option 1, add option 2 if reply rate <10%)

---

### Q3: A/B Testing CTAs

**Question:** Should we test different call-to-action phrases ("Interested?" vs "Wanna see how it works?" vs "15-min call?")?

**Options:**
1. No A/B testing (use best practices, iterate based on reply rate)
2. A/B test CTAs (randomly assign contacts to different variants)

**Decision:** TBD (start with option 1, add option 2 if reply rate plateaus)

---

### Q4: Conversion Tracking Beyond Telegram

**Question:** How do we track "interested → call scheduled → call completed → joined team"? Is this in FalkorDB or separate?

**Options:**
1. Manual tracking (human updates contact status in dashboard)
2. Calendar integration (auto-detect call scheduled via Google Calendar)
3. Hybrid (manual for now, integrate later)

**Decision:** TBD (likely option 1 for MVP, option 3 for future)

---

## Next Steps

**After PATTERN approved:**
1. Inna writes AC.md (functional + non-functional acceptance criteria)
2. Inna writes VALIDATION.md (test specifications)
3. Inna writes MECHANISM.md (architecture, FalkorDB schema, API endpoints)
4. Inna writes ALGORITHM.md (step-by-step implementation)
5. Inna writes GUIDE.md (setup, deployment, troubleshooting)
6. Inna writes DOD.md (Definition of Done checklist)
7. Rafael implements backend (Maya service, Telegram Reader, API endpoints)
8. Developer implements frontend (Mission Deck outreach dashboard)
9. Sofia verifies (tests, DoD checklist)
10. NLR approves → Deploy → Start outreach

**Timeline estimate:** 2 weeks from spec approval to first outreach message sent.

---

**Scope Locked:** This system handles 313 pre-qualified contacts from Telegram analysis. Future expansions (LinkedIn outreach, Twitter DMs, email campaigns) are separate missions with separate AC.md.

**Handoff to:** Rafael (implementation) + Sofia (QA) + Bigbosexf (sends messages) + NLR (approval)

---

**Sign-Off:**

Inna — ScopeLock
PATTERN complete. Ready for AC.md.
Scope: 313 Telegram contacts, Maya generation, Telethon monitoring, Mission Deck UI.
