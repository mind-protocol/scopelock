# ScopeLock Automation — Implementation Plan with Handoffs

**Version:** 1.0
**Date:** 2025-11-03
**Purpose:** Day-by-day plan with citizen handoffs, SYNC.md updates, and verification

---

## Overview

**Total Duration:** 10 weeks (91h)
**Approach:** Business impact first (Emma RSS → Response Mon → Delivery Pipeline → Quality Gates)
**Collaboration:** Nicolas (implementation) ↔ Citizens (verification) ↔ SYNC.md (status tracking)

---

## Citizen Roles in Automation

**Nicolas (Human):**
- Write code (services, scripts)
- Run tests locally
- Deploy to production
- Update PROGRESS.md

**Emma (The Scout):**
- Test lead evaluation logic
- Verify proposal quality
- Provide feedback on confidence scores

**Rafael (The Harbor):**
- Test response monitoring
- Verify draft quality
- Test AC.md drafting

**Daniel (The Forge):**
- Verify test generation
- Test DEMO/DELTA capture
- Validate proof pages

**Sofia (The Gauge):**
- Verify all automation follows R-400/R-401 (fail-loud)
- Review code for silent fallbacks
- Issue verdicts on each feature

**Maya (The Facet):**
- Verify proof page generation
- Test dashboard UI
- Validate accessibility

**Priya (The Pulse):**
- Monitor service health
- Track MTTR for incidents
- Verify all services in supervisor

---

## Week 1: Foundation (Lead Tracker + Emma RSS Setup)

### **Day 1: Lead Tracker (3h)**

**Owner:** Nicolas
**Handoffs:** Emma (test) → Sofia (verdict)

---

#### **Morning (9am-12pm): Implementation**

**Nicolas tasks:**
1. Create `scripts/track-lead.py` (from spec)
2. Test with sample data
3. Verify markdown regeneration

**SYNC.md update (Nicolas, 12pm):**
```markdown
## 2025-11-03 12:00 - Nicolas: Lead Tracker — Implementation Complete

**Work:** Created scripts/track-lead.py with JSON logging + markdown generation

**Status:** Implementation done, ready for testing
**Next:** Emma to test with real lead data
**Link:** scripts/track-lead.py, citizens/emma/leads.json

**Tests passed:**
- [x] JSON append works
- [x] Markdown regenerates
- [x] Stats calculations correct (GO rate, conversion)

**Handoff:** Emma, please test with 5 sample leads (3 GO, 2 NO-GO)
```

**Files created:**
- [ ] `scripts/track-lead.py`
- [ ] `citizens/emma/leads.json`
- [ ] `citizens/emma/leads-tracker.md`

---

#### **Afternoon (1pm-3pm): Emma Testing**

**Emma tasks:**
1. Run 5 test leads through tracker
2. Verify stats accuracy
3. Report any issues

**Emma executes:**
```bash
# Test 1: GO decision
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat widget" \
  --budget "$8,000" \
  --decision "GO" \
  --reason "AI domain, verified client, clear budget" \
  --urgency 8 \
  --pain 7

# Test 2-5: Mix of GO/NO-GO
# ... (4 more tests)

# Verify tracker
cat citizens/emma/leads-tracker.md
```

**Emma verification:**
- [ ] GO rate calculation correct (60% = 3/5)
- [ ] Markdown table formatted properly
- [ ] Stats update on each run

**SYNC.md update (Emma, 3pm):**
```markdown
## 2025-11-03 15:00 - Emma: Lead Tracker — Testing Complete

**Work:** Tested track-lead.py with 5 sample leads

**Status:** All tests pass, tracker working correctly
**Next:** Sofia verdict requested
**Link:** citizens/emma/leads-tracker.md (shows 3 GO, 2 NO-GO)

**Handoff:** Sofia, please issue verdict on scripts/track-lead.py
```

---

#### **Evening (3pm-4pm): Sofia Verdict**

**Sofia tasks:**
1. Review `scripts/track-lead.py` for fail-loud compliance
2. Check for silent fallbacks
3. Issue verdict

**Sofia checks:**
- [ ] Error handling: throws or emits errors
- [ ] No try/catch without rethrow
- [ ] File operations have error checks

**SYNC.md update (Sofia, 4pm):**
```markdown
## 2025-11-03 16:00 - Sofia: Lead Tracker — PASS Verdict

**Work:** Reviewed scripts/track-lead.py

**Verdict:** PASS ✅
**Findings:**
- No silent fallbacks detected
- Error handling proper (file operations check existence)
- Code follows ScopeLock standards

**Next:** Feature ready for production use
**Link:** /docs/automation/PROGRESS.md (Feature 3 marked DONE)
```

---

#### **End of Day: Nicolas Closes Feature**

**Nicolas tasks:**
1. Mark Feature 3 as ✅ DONE in PROGRESS.md
2. Update time spent (3h)
3. Update test results (3/3 passing)

**PROGRESS.md update:**
```markdown
## Feature 3: Lead Tracker Auto-Update

**Status:** ✅ DONE (completed 2025-11-03 16:00)
**Time:** 3/3h

### Acceptance Tests (3/3 passing)
V1: ✅ PASSED - Tracker updates automatically
V2: ✅ PASSED - Stats accurate (GO rate 60% = 3/5)
V3: ✅ PASSED - Script integrates with Emma workflow

**Completed by:** Nicolas
**Verified by:** Emma (functional), Sofia (quality)
```

---

### **Day 2-5: Emma RSS Setup (8h)**

**Owner:** Nicolas
**Handoffs:** Emma (test evaluations) → Sofia (verdict)

---

#### **Day 2 Morning (4h): RSS Monitor + Basic Structure**

**Nicolas tasks:**
1. Create `services/emma-rss/index.js` (RSS monitor)
2. Create `services/emma-rss/evaluator.js` (skeleton)
3. Test RSS feed parsing

**Implementation:**
```bash
# 1. Create directory
mkdir -p services/emma-rss

# 2. Install dependencies
cd services/emma-rss
npm init -y
npm install rss-parser @anthropic-ai/sdk node-telegram-bot-api

# 3. Create index.js (RSS monitor)
# Copy from spec: docs/automation/04_emma_rss_auto_send.md
```

**Test (dry-run mode):**
```bash
# Add RSS feed URL to .env
export UPWORK_RSS_FEED_URL="..."

# Run monitor (should detect posts)
node index.js

# Expected output:
# [NEW LEAD] Build AI chat widget
# [NEW LEAD] Backend API development
```

**SYNC.md update (Nicolas, Day 2 12pm):**
```markdown
## 2025-11-03 12:00 - Nicolas: Emma RSS — RSS Monitor Working

**Work:** Created RSS monitor, detects new posts every 5min

**Status:** RSS parsing works, sees new posts in feed
**Next:** Connect to Emma evaluator (Claude API)
**Link:** services/emma-rss/index.js

**Blocker:** None (RSS feed URL obtained from Upwork)

**Handoff:** Ready to add Emma evaluation logic
```

---

#### **Day 2 Afternoon (4h): Emma Evaluator**

**Nicolas tasks:**
1. Implement `evaluator.js` (calls Emma via Claude API)
2. Test with sample job post
3. Verify DECISION + REASON + PROPOSAL output

**Implementation:**
```bash
# Create evaluator.js
# Copy from spec: docs/automation/04_emma_rss_auto_send.md

# Test with manual job post
node -e "
const { evaluateLead } = require('./evaluator.js');
evaluateLead({
  title: 'Build AI chat widget',
  description: 'Need a chatbot for customer support...',
  budget: '$8,000',
  link: 'https://upwork.com/jobs/~test'
});
"

# Expected output:
# [EMMA] DECISION: GO
# [EMMA] REASON: AI domain, clear budget, verified client
# [EMMA] PROPOSAL: [300 word proposal mentioning AC.md, Evidence Sprint]
```

**SYNC.md update (Nicolas, Day 2 4pm):**
```markdown
## 2025-11-03 16:00 - Nicolas: Emma RSS — Evaluator Working

**Work:** Emma evaluator calls Claude API, generates proposals

**Status:** DECISION + PROPOSAL working, ready for Emma testing
**Next:** Emma to verify proposal quality
**Link:** services/emma-rss/evaluator.js

**Test output:** GO decision with 280-word proposal mentioning Evidence Sprint

**Handoff:** Emma, please verify proposal quality meets standards
```

---

#### **Day 2 Evening (30min): Emma Verification**

**Emma tasks:**
1. Review generated proposals
2. Check tone (calm, precise, builder-grade)
3. Verify ScopeLock concepts mentioned (AC.md, Evidence Sprint, /proof)

**Emma checks:**
- [ ] Tone: No "excited/passionate/thrilled"
- [ ] Content: Mentions AC.md or Evidence Sprint
- [ ] Length: 150-300 words
- [ ] References: Links to scopelock.mindprotocol.ai or github.com/mind-protocol

**SYNC.md update (Emma, Day 2 5pm):**
```markdown
## 2025-11-03 17:00 - Emma: Emma RSS — Proposal Quality Verified

**Work:** Reviewed 5 generated proposals from evaluator

**Status:** Proposal quality good, tone matches ScopeLock voice
**Next:** Ready for confidence calculator
**Link:** services/emma-rss/evaluator.js

**Feedback:**
- ✅ Tone: Calm, precise, no marketing fluff
- ✅ Content: 4/5 mentioned AC.md or Evidence Sprint
- ⚠️ 1/5 was generic (no ScopeLock concepts) - check confidence calculation

**Handoff:** Sofia verdict requested on evaluator.js
```

---

#### **Day 3 (4h): Confidence Calculator**

**Nicolas tasks:**
1. Create `confidence.js` with scoring formula
2. Test with sample posts (high/medium/low confidence)
3. Tune thresholds

**Implementation:**
```bash
# Create confidence.js
# Copy from spec: docs/automation/04_emma_rss_auto_send.md

# Test confidence scoring
node -e "
const { calculateConfidence } = require('./confidence.js');

// High confidence job
const high = calculateConfidence({
  description: 'Build AI chatbot. Budget: $10K. Verified client with 20+ jobs posted.',
  proposal: 'I propose an Evidence Sprint to demonstrate value...',
  urgency: 9
});
console.log('High confidence:', high); // Should be 85-95%

// Low confidence job
const low = calculateConfidence({
  description: 'Need developer. Budget negotiable. I have many questions: What stack? How long? Can you do X? What about Y?',
  proposal: 'I can help with your project...',
  urgency: 3
});
console.log('Low confidence:', low); // Should be 30-50%
"
```

**SYNC.md update (Nicolas, Day 3 4pm):**
```markdown
## 2025-11-03 16:00 - Nicolas: Emma RSS — Confidence Calculator Done

**Work:** Implemented confidence scoring with tunable thresholds

**Status:** Confidence calculator working, tested with high/low examples
**Next:** Emma to verify confidence scores make sense
**Link:** services/emma-rss/confidence.js

**Test results:**
- High confidence (clear budget, verified client, AI domain): 88%
- Medium confidence (vague budget, some questions): 62%
- Low confidence (many questions, new client): 35%

**Handoff:** Emma, do these confidence scores align with your judgment?
```

---

#### **Day 3 Evening (30min): Emma Confidence Review**

**Emma tasks:**
1. Review 10 sample confidence scores
2. Verify they match human judgment
3. Suggest threshold adjustments

**SYNC.md update (Emma, Day 3 5pm):**
```markdown
## 2025-11-03 17:00 - Emma: Emma RSS — Confidence Scores Validated

**Work:** Reviewed 10 confidence scores vs my own judgment

**Status:** Confidence calculator accurate in 9/10 cases
**Next:** Ready for Telegram approval flow
**Link:** services/emma-rss/confidence.js

**Findings:**
- ✅ 9/10 scores matched my judgment
- ⚠️ 1/10: Scored 78% but I'd rate 85% (missed urgency boost)
- 💡 Suggestion: Increase urgency_boost from ×2 to ×2.5

**Handoff:** Sofia verdict on confidence.js
```

---

#### **Day 4-5 (4h): Telegram Approval Flow**

**Nicolas tasks:**
1. Create `telegram-approval.js`
2. Set up Telegram bot
3. Test approval workflow (Approve/Edit/Reject)

**Implementation:**
```bash
# Create Telegram bot
# 1. Message @BotFather on Telegram
# 2. Create new bot: /newbot
# 3. Get token, save to .env: TELEGRAM_BOT_TOKEN="..."
# 4. Get your chat ID: NICOLAS_TELEGRAM_CHAT_ID="..."

# Create telegram-approval.js
# Copy from spec

# Test approval flow
node index.js  # Run in background
# Wait for low-confidence proposal
# Click [Approve] in Telegram
# Verify logged to citizens/emma/sent-proposals.log
```

**SYNC.md update (Nicolas, Day 5 4pm):**
```markdown
## 2025-11-04 16:00 - Nicolas: Emma RSS — Week 1 Complete (Dry-Run)

**Work:** Emma RSS running in dry-run mode (Telegram approval only, no auto-send)

**Status:** RSS → Evaluate → Confidence → Telegram approval working
**Next:** Monitor for 1 week, tune confidence thresholds, then add auto-send
**Link:** services/emma-rss/

**Current state:**
- ✅ RSS monitoring: Detects new posts every 5min
- ✅ Emma evaluation: DECISION + PROPOSAL generated
- ✅ Confidence scoring: 85% avg for GO decisions
- ✅ Telegram approval: [Approve] [Edit] [Reject] buttons work
- ⬜ Auto-send: Not implemented yet (Week 2)

**Handoff:** Sofia final verdict on Week 1 implementation
```

---

#### **Day 5 Evening: Sofia Week 1 Verdict**

**Sofia tasks:**
1. Review all Emma RSS code so far
2. Check fail-loud compliance
3. Issue verdict

**SYNC.md update (Sofia, Day 5 5pm):**
```markdown
## 2025-11-04 17:00 - Sofia: Emma RSS Week 1 — PASS Verdict

**Work:** Reviewed services/emma-rss/ (index.js, evaluator.js, confidence.js, telegram-approval.js)

**Verdict:** PASS ✅
**Findings:**
- ✅ No silent fallbacks detected
- ✅ Error handling present (try/catch with rethrow)
- ✅ Telegram errors logged and re-emitted
- ⚠️ Minor: Add error context to Claude API failures (line 87 in evaluator.js)

**Next:** Week 1 dry-run approved, monitor for 1 week before auto-send
**Link:** /docs/automation/PROGRESS.md (Feature 4 marked 50% complete)
```

---

## Week 2: Emma RSS Monitoring + Tuning (8h)

**Owner:** Nicolas + Emma
**Goal:** Monitor dry-run, tune confidence, prepare for auto-send

---

### **Monday-Friday: Passive Monitoring**

**Emma RSS runs in dry-run mode:**
- Detects 50+ posts/day
- Generates proposals for GO decisions
- Sends to Telegram for approval
- Nicolas manually approves in Telegram

**Daily SYNC.md updates:**

**Example (Monday):**
```markdown
## 2025-11-04 18:00 - Nicolas: Emma RSS — Day 1 Monitoring

**Work:** Emma RSS detected 47 posts, generated 12 proposals

**Status:** Running smoothly, no errors
**Next:** Continue monitoring, log confidence scores
**Link:** services/emma-rss/state.json (47 posts seen)

**Stats:**
- Posts detected: 47
- GO decisions: 12 (26% GO rate)
- Avg confidence: 73%
- Proposals sent (manual): 8 (approved in Telegram)
- Rejected: 4 (low quality or off-topic)

**Notes:**
- Confidence seems low (73% avg) - may need threshold adjustment
- 4 rejections were correct (generic proposals, wrong domain)
```

---

### **Friday: Week Review + Threshold Tuning**

**Nicolas + Emma tasks:**
1. Review 1 week of data
2. Analyze confidence scores vs manual decisions
3. Tune thresholds

**Analysis:**
```bash
# Check sent proposals log
cat citizens/emma/sent-proposals.log | jq -r '[.confidence] | @csv' | awk '{sum+=$1; count++} END {print sum/count}'
# Output: Average confidence: 73%

# Count approvals vs rejections
approved=$(cat citizens/emma/sent-proposals.log | grep "approved" | wc -l)
rejected=$(cat citizens/emma/sent-proposals.log | grep "rejected" | wc -l)
echo "Approval rate: $approved / $(($approved + $rejected))"
# Output: Approval rate: 48 / 60 (80% approval)
```

**Findings:**
- 80% approval rate → High accuracy
- But average confidence only 73% → Threshold too conservative

**Adjustment:**
- Lower auto-send threshold from 80% → 75%
- Confidence formula seems accurate, just need to send more automatically

**SYNC.md update (Nicolas, Friday 5pm):**
```markdown
## 2025-11-08 17:00 - Nicolas: Emma RSS — Week 2 Review

**Work:** Analyzed 1 week of dry-run data (60 proposals, 48 approved)

**Status:** Ready for auto-send, thresholds tuned
**Next:** Week 3 - implement Puppeteer auto-send
**Link:** services/emma-rss/confidence.js (threshold adjusted to 75%)

**Week 2 Stats:**
- Posts detected: 287 total
- GO decisions: 60 (21% GO rate)
- Proposals generated: 60
- Manually approved: 48 (80% approval)
- Avg confidence: 73%

**Threshold adjustment:**
- Auto-send threshold: 80% → 75% (more aggressive)
- Manual threshold: 30% (unchanged)

**Handoff:** Ready for Week 3 auto-send implementation
```

---

## Week 3: Emma RSS Auto-Send (4h)

**Owner:** Nicolas
**Handoffs:** Emma (test) → Sofia (verdict) → Priya (service monitor)

---

### **Monday-Tuesday (4h): Puppeteer Implementation**

**Nicolas tasks:**
1. Create `upwork-sender.js` with Puppeteer
2. Test auto-submission (dry-run with test account first)
3. Add rate limiting (5min between sends)

**Implementation:**
```bash
# Install Puppeteer
npm install puppeteer

# Create upwork-sender.js
# Copy from spec: docs/automation/04_emma_rss_auto_send.md

# Test with dry-run (don't actually submit)
export DRY_RUN=true
node index.js

# Expected: Puppeteer opens browser, fills form, but doesn't submit
```

**SYNC.md update (Nicolas, Tuesday 4pm):**
```markdown
## 2025-11-11 16:00 - Nicolas: Emma RSS — Auto-Send Ready

**Work:** Puppeteer auto-send implemented with rate limiting

**Status:** Tested in dry-run mode, ready for production
**Next:** Emma to verify one auto-send in production
**Link:** services/emma-rss/upwork-sender.js

**Safety features:**
- ✅ Rate limiting: 5min between submissions
- ✅ Daily limit: 15 proposals max
- ✅ Dry-run mode: Can test without sending
- ✅ Error screenshots: Saved to /tmp/ on failure

**Handoff:** Emma, please verify one test auto-send on low-stakes job
```

---

### **Tuesday Evening (1h): Emma Test Auto-Send**

**Emma tasks:**
1. Find low-stakes test job (low budget, less critical)
2. Trigger auto-send
3. Verify proposal submitted correctly

**Emma test:**
```bash
# Emma manually triggers auto-send on test job
# (Nicolas grants Emma temporary access to trigger)

# Verify:
# 1. Proposal appeared in Upwork "My Proposals"
# 2. Cover letter text matches Emma's draft
# 3. Bid amount correct
# 4. No errors in logs
```

**SYNC.md update (Emma, Tuesday 6pm):**
```markdown
## 2025-11-11 18:00 - Emma: Emma RSS — Auto-Send Verified

**Work:** Test auto-send on low-stakes job

**Status:** Auto-send works perfectly ✅
**Next:** Sofia verdict, then go live
**Link:** Upwork proposal submitted (ID: 12345678)

**Verification:**
- ✅ Proposal submitted to correct job
- ✅ Cover letter matches my draft
- ✅ Bid amount correct ($8,500)
- ✅ Client can see proposal (checked in Upwork)

**Handoff:** Sofia final verdict on auto-send code
```

---

### **Wednesday Morning: Sofia Final Verdict**

**Sofia tasks:**
1. Review `upwork-sender.js`
2. Check error handling
3. Issue final verdict

**SYNC.md update (Sofia, Wednesday 10am):**
```markdown
## 2025-11-12 10:00 - Sofia: Emma RSS — PASS Verdict (Auto-Send)

**Work:** Reviewed upwork-sender.js for fail-loud compliance

**Verdict:** PASS ✅
**Findings:**
- ✅ Error handling: Screenshots on failure
- ✅ Rate limiting: Prevents spam
- ✅ Fail-loud: Errors emitted to Telegram
- ✅ No silent fallbacks

**Next:** Production deployment approved
**Link:** /docs/automation/PROGRESS.md (Feature 4 marked DONE)

**Handoff:** Priya, please add to supervisor for service monitoring
```

---

### **Wednesday Afternoon: Priya Service Setup**

**Priya tasks:**
1. Add Emma RSS to `services.yaml`
2. Start service with PM2
3. Verify health monitoring

**Priya executes:**
```bash
# Add to services.yaml
vim services.yaml
# Add:
# - name: emma-rss
#   command: node index.js
#   cwd: /home/mind-protocol/scopelock/services/emma-rss
#   restart: always

# Start with PM2
pm2 start services/emma-rss/index.js --name emma-rss
pm2 save

# Verify
pm2 status
# emma-rss should show "online"
```

**SYNC.md update (Priya, Wednesday 2pm):**
```markdown
## 2025-11-12 14:00 - Priya: Emma RSS — Service Deployed

**Work:** Added emma-rss to supervisor, deployed to production

**Status:** Service online, monitoring active ✅
**Next:** Monitor MTTR, ensure <10min recovery on failures
**Link:** PM2 dashboard (emma-rss: online, 0 restarts)

**Service health:**
- Status: Online
- Uptime: 2h 15min
- Memory: 84MB
- Restarts: 0
- MTTR: N/A (no failures yet)

**Handoff:** Feature 4 complete, running in production
```

---

### **Wednesday End of Day: Nicolas Closes Feature 4**

**PROGRESS.md update:**
```markdown
## Feature 4: Emma RSS Scraper + Auto-Send

**Status:** ✅ DONE (completed 2025-11-12 14:00)
**Time:** 20/20h (3 weeks)

### Implementation Timeline
- Week 1 (8h): RSS monitor, evaluator, confidence, Telegram
- Week 2 (8h): Dry-run monitoring, threshold tuning
- Week 3 (4h): Puppeteer auto-send, production deploy

### Acceptance Tests (4/4 passing)
V1: ✅ PASSED - RSS monitoring works (50+ posts/day detected)
V2: ✅ PASSED - Emma evaluates and generates proposals
V3: ✅ PASSED - Confidence-based routing (75% threshold)
V4: ✅ PASSED - Telegram approval flow + auto-send works

**Completed by:** Nicolas
**Verified by:** Emma (functional), Sofia (quality), Priya (ops)
**Production:** PM2 service "emma-rss" online
```

---

## Week 4: Response Monitoring + Autonomous Mode (10h)

**Owner:** Nicolas
**Handoffs:** Rafael (test) → Sofia (verdict)

---

### **Monday-Tuesday (4h): Response Monitoring**

**Phase 1: IFTTT Quick Win (30min)**

**Nicolas tasks:**
1. Set up Gmail filter
2. Create IFTTT Gmail → Telegram
3. Test with fake email

**SYNC.md update (Nicolas, Monday 10am):**
```markdown
## 2025-11-15 10:00 - Nicolas: Response Monitoring Phase 1 — IFTTT Done

**Work:** Gmail filter + IFTTT notification setup

**Status:** Instant notifications working ✅
**Next:** Phase 2 - Rafael auto-draft
**Link:** IFTTT applet "Upwork Response → Telegram"

**Test result:**
- Sent test email with subject "New message from Test Client on Upwork"
- Telegram notification arrived in 12 seconds
- ✅ <2h SLA achievable

**Handoff:** Phase 1 complete, starting Phase 2 (Rafael responder service)
```

---

**Phase 2: Rafael Auto-Draft (3.5h)**

**Nicolas tasks:**
1. Create `services/rafael-responder/`
2. Implement email parser, response drafter, Telegram bot
3. Test with Rafael

**Implementation:**
```bash
# Create service
mkdir -p services/rafael-responder
cd services/rafael-responder
npm install express node-telegram-bot-api @anthropic-ai/sdk node-html-parser

# Create files (from spec)
# - index.js (webhook endpoint)
# - parse-email.js
# - draft-response.js
# - telegram-bot.js

# Test with mock email
curl -X POST http://localhost:3001/webhook/upwork-response \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "New message from Test Client on Upwork",
    "body": "Hi, I am interested in your proposal. Can we schedule a call?"
  }'

# Expected: Telegram message with draft + approval buttons
```

**SYNC.md update (Nicolas, Tuesday 2pm):**
```markdown
## 2025-11-16 14:00 - Nicolas: Response Monitoring — Rafael Auto-Draft Working

**Work:** Rafael responder service generating draft responses

**Status:** Email → Parse → Draft → Telegram approval working
**Next:** Rafael to verify draft quality
**Link:** services/rafael-responder/

**Test output:**
- Received test email
- Parsed client name, message, job title
- Generated draft: "Thank you for your interest. Let's schedule a 30min call to co-write AC.md..."
- Draft tone: Calm, precise, references AC.md ✅

**Handoff:** Rafael, please verify 5 draft responses match your voice
```

---

**Tuesday Evening: Rafael Verification**

**Rafael tasks:**
1. Test with 5 different client message types
2. Verify draft quality and tone
3. Approve for production

**Rafael tests:**
```
1. Client asks question → Draft answers clearly
2. Client accepts proposal → Draft suggests kickoff call + AC.md
3. Client negotiates price → Draft refers to Evidence Sprint as entry point
4. Client has concerns → Draft addresses with proof (/proof link)
5. Client requests changes → Draft opens Change Request discussion
```

**SYNC.md update (Rafael, Tuesday 5pm):**
```markdown
## 2025-11-16 17:00 - Rafael: Response Monitoring — Draft Quality Verified

**Work:** Tested 5 draft responses across different message types

**Status:** Draft quality excellent, tone matches my voice ✅
**Next:** Sofia verdict requested
**Link:** services/rafael-responder/draft-response.js

**Findings:**
- ✅ 5/5 drafts required no edits
- ✅ Tone: Calm, precise, professional (no "excited/thrilled")
- ✅ Content: All referenced AC.md, Evidence Sprint, or /proof
- ✅ Next actions: Clear (schedule call, co-write AC, etc.)

**Handoff:** Sofia, please review rafael-responder for fail-loud compliance
```

---

### **Wednesday (2h): Sofia Verdict + Priya Deploy**

**SYNC.md update (Sofia, Wednesday 10am):**
```markdown
## 2025-11-17 10:00 - Sofia: Response Monitoring — PASS Verdict

**Work:** Reviewed services/rafael-responder/

**Verdict:** PASS ✅
**Findings:**
- ✅ No silent fallbacks
- ✅ Email parse errors → Logged and sent to Telegram
- ✅ Claude API errors → Retries with exponential backoff
- ✅ Telegram errors → Logged with context

**Next:** Production deployment approved
**Link:** /docs/automation/PROGRESS.md (Feature 2 marked DONE)

**Handoff:** Priya, deploy rafael-responder to production
```

**SYNC.md update (Priya, Wednesday 2pm):**
```markdown
## 2025-11-17 14:00 - Priya: Response Monitoring — Service Deployed

**Work:** Deployed rafael-responder with PM2

**Status:** Service online, webhook configured ✅
**Link:** PM2 dashboard (rafael-responder: online)

**Service health:**
- Status: Online
- Webhook: https://api.scopelock.mindprotocol.ai/webhook/upwork-response
- Gmail integration: Active (IFTTT forwarding emails)
- MTTR: N/A (no failures yet)

**Next:** Monitor <2h response SLA
```

---

### **Wednesday-Friday (6h): Emma Autonomous Mode**

**Nicolas tasks:**
1. Add confidence breakdown to `confidence.js`
2. Create `router.js` with auto-send/approval/reject logic
3. Test all three routing paths

**Implementation:**
```bash
# Update confidence.js with breakdown
# Create router.js
# Update evaluator.js to use router

# Test routing:
# - High confidence (85%) → Auto-send
# - Medium confidence (65%) → Telegram approval
# - Low confidence (25%) → Auto-reject + log
```

**SYNC.md update (Nicolas, Thursday 4pm):**
```markdown
## 2025-11-18 16:00 - Nicolas: Emma Autonomous Mode — Router Working

**Work:** Confidence-based routing with 3 paths (auto-send, approval, reject)

**Status:** Router implemented, ready for testing
**Next:** Emma to verify routing logic with sample jobs
**Link:** services/emma-rss/router.js

**Routing thresholds:**
- ≥75%: Auto-send (no human review)
- 30-74%: Telegram approval (human decides)
- <30%: Auto-reject (log only, no human time)

**Handoff:** Emma, test with 10 sample jobs (mix of high/medium/low quality)
```

---

**Friday: Emma Testing + Sofia Verdict**

**Emma tests routing with 10 jobs:**
- 5 high quality (verified client, clear budget, AI domain) → Expect auto-send
- 3 medium quality (some questions, vague budget) → Expect approval request
- 2 low quality (wrong domain, budget too low) → Expect auto-reject

**SYNC.md update (Emma, Friday 2pm):**
```markdown
## 2025-11-19 14:00 - Emma: Emma Autonomous — Routing Verified

**Work:** Tested routing with 10 sample jobs

**Status:** Routing works perfectly ✅
**Next:** Sofia verdict, then deploy
**Link:** services/emma-rss/router.js

**Test results:**
- 5 high quality → 5 auto-sent ✅
- 3 medium quality → 3 approval requests ✅
- 2 low quality → 2 auto-rejected ✅

**Confidence breakdown helpful:**
- Can see exact penalties (vague budget -20, new client -15, etc.)
- Makes routing decisions transparent

**Handoff:** Sofia final verdict
```

**SYNC.md update (Sofia, Friday 4pm):**
```markdown
## 2025-11-19 16:00 - Sofia: Emma Autonomous — PASS Verdict

**Work:** Reviewed router.js and updated confidence.js

**Verdict:** PASS ✅
**Findings:**
- ✅ Routing logic clear and deterministic
- ✅ Auto-reject logs decisions (no silent drops)
- ✅ Confidence breakdown aids debugging

**Next:** Deploy to production
**Link:** /docs/automation/PROGRESS.md (Feature 8 marked DONE)

**Handoff:** Priya, update emma-rss service with router
```

---

## Week 5-10: Remaining Features (Same Pattern)

**All remaining features follow the same handoff pattern:**

1. **Nicolas implements** (following spec)
2. **Relevant citizen tests** (Emma/Rafael/Daniel/Maya based on domain)
3. **Sofia issues verdict** (quality gate)
4. **Priya deploys** (adds to supervisor)
5. **Nicolas updates PROGRESS.md** (marks DONE)
6. **All update SYNC.md** (current status)

---

### **Week 5-7: Delivery Pipeline (30h)**

**Feature 5: AC Drafting (8h)**
- Nicolas implements → Rafael tests → Sofia verdict → Done

**Feature 6: Test Generation (12h)**
- Nicolas implements → Daniel tests → Sofia verdict → Done

**Feature 7: DEMO/DELTA Gen (10h)**
- Nicolas implements → Maya tests → Sofia verdict → Done

---

### **Week 8-9: Quality Gates (26h)**

**Feature 9: Sofia Auto-Review (10h)**
- Nicolas implements → Sofia tests (on herself!) → Priya deploys → Done

**Feature 10: Priya Dashboard (16h)**
- Nicolas implements → Priya tests → Sofia verdict → Maya tests UI → Done

---

### **Week 10: Polish (2h)**

**Feature 1: Proof Regeneration (2h)**
- Nicolas implements → Daniel tests → Sofia verdict → Done

---

## SYNC.md Update Cadence

**During active implementation:**
- **After each major milestone** (2-4h of work)
- **After handoffs** (when requesting review/verdict)
- **After blockers** (immediately)
- **End of day** (status summary)

**Example end-of-day update:**
```markdown
## 2025-11-12 18:00 - Nicolas: Day Summary

**Today:** Completed Feature 4 auto-send, deployed to production

**Features status:**
- ✅ Feature 3: Lead Tracker (DONE)
- ✅ Feature 4: Emma RSS (DONE - 3 weeks)
- ⬜ Feature 2: Response Mon (starting Monday)
- ⬜ Feature 8: Autonomous (Week 4)

**Next:** Week 4 - Response monitoring + autonomous mode (10h)
**Blockers:** None

**Time tracking:**
- Week 1: 11h (3h tracker + 8h RSS setup)
- Week 2: 8h (RSS monitoring)
- Week 3: 4h (RSS auto-send)
- Total so far: 23/91h (25%)
```

---

## Handoff Checklist Template

**For each feature handoff:**

### **Implementation → Testing Handoff**

```markdown
## [Date] [Time] - [Implementer]: [Feature] — Ready for Testing

**Work:** [What was built]

**Status:** Implementation complete
**Next:** [Tester name], please verify [specific tests]
**Link:** [File/service path]

**Tests to run:**
- [ ] Test 1: [Description + expected result]
- [ ] Test 2: [Description + expected result]
- [ ] Test 3: [Description + expected result]

**Handoff:** [Tester name], please confirm tests pass
```

---

### **Testing → Verdict Handoff**

```markdown
## [Date] [Time] - [Tester]: [Feature] — Testing Complete

**Work:** Tested [feature] with [N] test cases

**Status:** All tests pass ✅ (or: X/Y tests pass, details below)
**Next:** Sofia verdict requested
**Link:** [Test results file/log]

**Test results:**
- ✅ Test 1: Passed
- ✅ Test 2: Passed
- ⚠️ Test 3: Failed (details: ...)

**Handoff:** Sofia, please issue verdict on [file/service]
```

---

### **Verdict → Deployment Handoff**

```markdown
## [Date] [Time] - Sofia: [Feature] — Verdict Issued

**Work:** Reviewed [files] for fail-loud compliance

**Verdict:** PASS ✅ (or: SOFT_FAIL / HARD_FAIL with reasons)
**Findings:**
- ✅ Finding 1
- ✅ Finding 2
- ⚠️ Finding 3 (non-blocking)

**Next:** Production deployment approved
**Link:** /docs/automation/PROGRESS.md ([Feature] marked DONE)

**Handoff:** Priya, deploy [service] to production
```

---

### **Deployment → Closure**

```markdown
## [Date] [Time] - Priya: [Feature] — Deployed

**Work:** Deployed [service] with PM2

**Status:** Service online, monitoring active ✅
**Link:** PM2 dashboard ([service]: online)

**Service health:**
- Status: Online
- Uptime: [time]
- Memory: [MB]
- MTTR: [<10min target]

**Next:** Feature complete, monitoring for incidents
```

---

## Summary: Collaboration Flow

```
Nicolas (implement)
  ↓ SYNC.md: "Ready for testing"
  ↓
Citizen (test - Emma/Rafael/Daniel/Maya based on domain)
  ↓ SYNC.md: "Tests pass, verdict requested"
  ↓
Sofia (verdict)
  ↓ SYNC.md: "PASS - deploy approved"
  ↓
Priya (deploy)
  ↓ SYNC.md: "Service online"
  ↓
Nicolas (close feature)
  ↓ PROGRESS.md: "✅ DONE"
```

**Every handoff has:**
1. Clear next action
2. Verification criteria
3. Link to artifact
4. SYNC.md update

**No invisible work:** If it's not in SYNC.md, it didn't happen.

---

## Next Action

**To start today:**

1. Read this plan
2. Update SYNC.md:
   ```markdown
   ## 2025-11-03 [Time] - Nicolas: Automation — Week 1 Starting

   **Work:** Beginning automation implementation (Feature 3: Lead Tracker)

   **Status:** Starting Day 1 (3h for Lead Tracker)
   **Next:** Implement scripts/track-lead.py
   **Link:** /docs/automation/IMPLEMENTATION_PLAN.md

   **Plan:** 10-week implementation, business impact first (Emma RSS → Response Mon → Delivery → Quality)
   ```

3. Mark Feature 3 as 🟡 IN PROGRESS in PROGRESS.md
4. Start implementing `scripts/track-lead.py`

Ready to start?
