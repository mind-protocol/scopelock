# ScopeLock Automation - Implementation Progress

**Last Updated:** 2025-11-02
**Purpose:** Track TODO vs DONE status with test verification

**Note:** This file tracks **automation project milestones**. For real-time work updates, use `/citizens/SYNC.md`. See [SYNC_vs_PROGRESS.md](SYNC_vs_PROGRESS.md) for the difference.

---

## Progress Overview

| Feature | Status | Dev Time | Tests Passing | Deployed |
|---------|--------|----------|---------------|----------|
| 1. Proof Regeneration | ⬜ TODO | 0/2h | 0/3 | ❌ |
| 2. Response Monitoring | ⬜ TODO | 0/4h | 0/3 | ❌ |
| 3. Lead Tracker | 🟡 IN PROGRESS | 2/3h | 2/3 | ❌ |
| 4. Emma RSS Auto-Send | ⬜ TODO | 0/20h | 0/4 | ❌ |
| 5. AC Drafting | ⬜ TODO | 0/8h | 0/3 | ❌ |
| 6. Test Generation | ⬜ TODO | 0/12h | 0/3 | ❌ |
| 7. DEMO/DELTA Gen | ⬜ TODO | 0/10h | 0/3 | ❌ |
| 8. Emma Autonomous | ⬜ TODO | 0/6h | 0/3 | ❌ |
| 9. Sofia Auto-Review | ⬜ TODO | 0/10h | 0/3 | ❌ |
| 10. Priya Dashboard | ⬜ TODO | 0/16h | 0/3 | ❌ |
| 11. Client Portal | 🔵 DEFERRED | - | - | ❌ |

**Legend:**
- ⬜ TODO - Not started
- 🟡 IN PROGRESS - Currently working
- ✅ DONE - Implemented and tested
- 🔵 DEFERRED - Postponed to Phase 2

**Total Progress:** 0/91h (0%)

---

## Feature 1: Auto-Regenerate Proof Pages

**Status:** ⬜ TODO
**Time:** 0/2h
**Priority:** P0 (Week 1)

### Implementation Checklist

- [ ] Update `package.json` build script to include proofgen
- [ ] Test locally: `npm run build:local`
- [ ] Commit generated proof HTML
- [ ] Push to Vercel
- [ ] Verify proof pages regenerate on deploy

### Acceptance Tests (0/3 passing)

**V1: Proof regenerates on tag push**
```bash
# Test command:
git tag ac-green_test_2025-11-02
git push origin ac-green_test_2025-11-02
sleep 120  # Wait for Vercel deploy
curl https://scopelock.mindprotocol.ai/proof/ac-green_test_2025-11-02 | grep "test"

# Expected: ✅ Returns 200 with proof page HTML
# Actual: ⬜ Not tested yet
```

**V2: Index updates with new entry**
```bash
# Test command:
curl https://scopelock.mindprotocol.ai/proof/index.json | jq '.entries | length'

# Expected: ✅ Shows N+1 entries
# Actual: ⬜ Not tested yet
```

**V3: Missing proof files handled gracefully**
```bash
# Test command:
git tag ac-green_no-proof_2025-11-02  # Tag without proof/ files
git push origin ac-green_no-proof_2025-11-02
sleep 120
curl https://scopelock.mindprotocol.ai/proof/ac-green_no-proof_2025-11-02 | grep "Missing"

# Expected: ✅ Shows "Missing files" chips, not crash
# Actual: ⬜ Not tested yet
```

### Files to Create/Modify

- [ ] `package.json` (modify build script)
- [ ] `.vercelignore` (if needed)

### Done When

- [x] All 3 acceptance tests pass
- [x] Proof pages regenerate automatically on tag push
- [x] No manual `npm run proofgen` needed

---

## Feature 2: Response Monitoring & Auto-Reply

**Status:** ⬜ TODO
**Time:** 0/4h
**Priority:** P0 (Week 1)

### Implementation Checklist

**Phase 1: IFTTT (30min)**
- [ ] Create Gmail filter for Upwork responses
- [ ] Set up IFTTT Gmail → Telegram applet
- [ ] Test with fake Upwork email

**Phase 2: Full Automation (3.5h)**
- [ ] Create `services/rafael-responder/index.js`
- [ ] Create `services/rafael-responder/parse-email.js`
- [ ] Create `services/rafael-responder/draft-response.js`
- [ ] Create `services/rafael-responder/telegram-bot.js`
- [ ] Set up Gmail webhook (Zapier or Cloud Function)
- [ ] Deploy service with PM2
- [ ] Configure environment variables

### Acceptance Tests (0/3 passing)

**V1: Email triggers Rafael wake-up**
```bash
# Test: Send test email
# Subject: "New message from Test Client on Upwork"
# Body: "Hi, I'm interested in your proposal. Can we schedule a call?"

# Expected: ✅ Telegram message appears within 60s
# Actual: ⬜ Not tested yet
```

**V2: Rafael drafts appropriate response**
```bash
# Test: Check draft tone and content

# Expected: ✅ Draft mentions AC.md or Evidence Sprint, calm tone
# Actual: ⬜ Not tested yet
```

**V3: Approval flow works**
```bash
# Test: Click [Approve] in Telegram

# Expected: ✅ Response sent, confirmation received
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/rafael-responder/index.js`
- [ ] `services/rafael-responder/parse-email.js`
- [ ] `services/rafael-responder/draft-response.js`
- [ ] `services/rafael-responder/telegram-bot.js`
- [ ] `citizens/rafael/responses.log`

### Environment Variables Needed

- [ ] `ANTHROPIC_API_KEY`
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `NICOLAS_TELEGRAM_CHAT_ID`
- [ ] `GMAIL_WEBHOOK_URL`

### Done When

- [x] Phase 1 IFTTT working (instant notifications)
- [x] Phase 2 auto-draft working (80%+ drafts require no edits)
- [x] All 3 acceptance tests pass

---

## Feature 3: Lead Tracker Auto-Update

**Status:** 🟡 IN PROGRESS (Implementation Complete, Testing)
**Time:** 2/3h (Started: 2025-11-03 08:30)
**Priority:** P0 (Week 1)

### Implementation Checklist

- [x] Create `scripts/track-lead.py`
- [x] Test with sample data
- [ ] Integrate with Emma workflow (next: Emma testing)
- [x] Verify stats calculations

### Acceptance Tests (2/3 passing)

**V1: Tracker updates automatically**
```bash
# Test command:
python3 scripts/track-lead.py \
  --platform "Upwork" \
  --title "Test Job" \
  --budget "\$5K" \
  --decision "GO" \
  --reason "Good fit"

# Expected: ✅ leads.json appends, leads-tracker.md regenerates
# Actual: ✅ PASS (2025-11-03) - leads.json created, tracker updated
```

**V2: Stats are accurate**
```bash
# Test: Add 4 leads (3 GO, 1 NO-GO), check stats
cat citizens/emma/leads-tracker.md | grep "GO rate"

# Expected: ✅ Stats match actual decisions
# Actual: ✅ PASS (2025-11-03) - Shows "3 (75.0%)" correctly
```

**V3: Script works with Emma workflow**
```bash
# Test: Run after Emma evaluation
# (Manual integration test)

# Expected: ✅ Seamless workflow
# Actual: ⏭️ PENDING - Needs Emma to test with real lead evaluation
```

### Files to Create

- [ ] `scripts/track-lead.py`
- [ ] `citizens/emma/leads.json`
- [ ] `citizens/emma/leads-tracker.md` (auto-generated)

### Done When

- [x] All 3 acceptance tests pass
- [x] GO rate calculation accurate
- [x] Manual markdown editing eliminated

---

## Feature 4: Emma RSS Scraper + Auto-Send

**Status:** ⬜ TODO
**Time:** 0/20h
**Priority:** P1 (Week 2-3)

### Implementation Checklist

- [ ] Create RSS monitor: `services/emma-rss/index.js`
- [ ] Create evaluator: `services/emma-rss/evaluator.js`
- [ ] Create confidence calculator: `services/emma-rss/confidence.js`
- [ ] Create Upwork sender: `services/emma-rss/upwork-sender.js` (Puppeteer)
- [ ] Create Telegram approval: `services/emma-rss/telegram-approval.js`
- [ ] Get Upwork RSS feed URL (with security token)
- [ ] Test with dry-run mode (don't send proposals)
- [ ] Go live with rate limiting (5min between sends)

### Acceptance Tests (0/4 passing)

**V1: RSS monitoring works continuously**
```bash
# Test: Monitor feed for 1 hour
# Check logs for new post detection

# Expected: ✅ New posts detected within 5min
# Actual: ⬜ Not tested yet
```

**V2: Emma evaluates and generates proposals**
```bash
# Test: Add test job to feed
# Check Emma output

# Expected: ✅ DECISION + REASON + PROPOSAL generated
# Actual: ⬜ Not tested yet
```

**V3: Confidence-based auto-send works**
```bash
# Test: Trigger 5 GO decisions with varying complexity

# Expected: ✅ High confidence auto-sent, low confidence → Telegram
# Actual: ⬜ Not tested yet
```

**V4: Telegram approval flow works**
```bash
# Test: Click [Approve] on low-confidence proposal

# Expected: ✅ Proposal sent within 30s
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/emma-rss/index.js`
- [ ] `services/emma-rss/evaluator.js`
- [ ] `services/emma-rss/confidence.js`
- [ ] `services/emma-rss/upwork-sender.js`
- [ ] `services/emma-rss/telegram-approval.js`
- [ ] `services/emma-rss/state.json`
- [ ] `citizens/emma/sent-proposals.log`

### Environment Variables Needed

- [ ] `UPWORK_RSS_FEED_URL`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `NICOLAS_TELEGRAM_CHAT_ID`

### Done When

- [x] 50+ leads evaluated per day (up from 20 manual)
- [x] 80%+ proposals auto-sent (no human time)
- [x] All 4 acceptance tests pass

---

## Feature 5: AC.md Drafting Assistant

**Status:** ⬜ TODO
**Time:** 0/8h
**Priority:** P1 (Week 3)

### Implementation Checklist

- [ ] Create AC draft trigger: `services/ac-drafter/index.js`
- [ ] Create citizen waker: `services/ac-drafter/wake-citizen.js`
- [ ] Test Rafael citizen wake with AC draft task
- [ ] Verify AC.md structure matches templates
- [ ] Test Telegram notification

### Acceptance Tests (0/3 passing)

**V1: Rafael wakes and drafts AC.md**
```bash
# Test: Trigger AC drafting for test client
node -e "
  const { wakeCitizen } = require('./services/ac-drafter/wake-citizen.js');
  wakeCitizen('rafael', {
    task: 'ac-draft',
    client: 'Test Client',
    milestone: 'Build signup flow with OTP'
  });
"

# Expected: ✅ AC.md draft in /proof/ within 2min
# Actual: ⬜ Not tested yet
```

**V2: AC.md follows ScopeLock template**
```bash
# Test: Compare generated AC.md to existing proofs
cat proof/AC.md

# Expected: ✅ Contains Context, Functional, Non-Functional, Verification
# Actual: ⬜ Not tested yet
```

**V3: Human can review and commit**
```bash
# Test: Edit draft, commit, tag baseline
git add proof/AC.md
git commit -m "docs: add AC.md for signup OTP"
git tag ac-baseline_signup-otp_2025-11-02

# Expected: ✅ Workflow integrates smoothly
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/ac-drafter/index.js`
- [ ] `services/ac-drafter/wake-citizen.js`

### Done When

- [x] AC.md draft is 80%+ complete (minimal editing)
- [x] All 3 acceptance tests pass
- [x] 1h saved per milestone

---

## Feature 6: Test Generation from AC.md

**Status:** ⬜ TODO
**Time:** 0/12h
**Priority:** P1 (Week 3-4)

### Implementation Checklist

- [ ] Create test gen webhook: `services/test-generator/index.js`
- [ ] Create Daniel waker: `services/test-generator/wake-daniel.js`
- [ ] Test Daniel citizen wake with test generation task
- [ ] Verify generated tests are executable
- [ ] Set up GitHub webhook or git hook

### Acceptance Tests (0/3 passing)

**V1: Tests generated from AC.md**
```bash
# Test: Tag AC.md as baseline
git tag ac-baseline_test_2025-11-02
# Trigger test generation

ls tests/acceptance/

# Expected: ✅ f1-*.spec.ts, f2-*.spec.ts, nf1-*.spec.ts files exist
# Actual: ⬜ Not tested yet
```

**V2: Generated tests are executable**
```bash
# Test: Run generated tests
npm test

# Expected: ✅ 0 syntax errors, tests run (may fail)
# Actual: ⬜ Not tested yet
```

**V3: Tests follow ScopeLock patterns**
```bash
# Test: Compare to existing tests
cat tests/acceptance/f1-core-pages.spec.ts

# Expected: ✅ Playwright style, fail-loud pattern
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/test-generator/index.js`
- [ ] `services/test-generator/wake-daniel.js`
- [ ] `.git/hooks/post-receive` (or GitHub webhook)

### Done When

- [x] Test count matches AC criteria count
- [x] All 3 acceptance tests pass
- [x] 3h saved per milestone

---

## Feature 7: DEMO/DELTA Auto-Generation

**Status:** ⬜ TODO
**Time:** 0/10h
**Priority:** P1 (Week 4)

### Implementation Checklist

- [ ] Create demo gen service: `services/demo-delta-gen/index.js`
- [ ] Create Maya waker: `services/demo-delta-gen/wake-maya.js`
- [ ] Test screenshot capture (Playwright)
- [ ] Test metric measurement (p95, coverage)
- [ ] Test delta calculation
- [ ] Verify DEMO.md and DELTA.md structure

### Acceptance Tests (0/3 passing)

**V1: DEMO.md generated from tag**
```bash
# Test: Tag feature, trigger generation
git tag evidence-sprint_signup_2025-11-02

cat proof/DEMO.md

# Expected: ✅ Contains URL, bullets, screenshots
# Actual: ⬜ Not tested yet
```

**V2: DELTA.md contains quantified metrics**
```bash
# Test: Check DELTA.md
cat proof/DELTA.md

# Expected: ✅ Table with Before/After/Delta, 2+ metrics
# Actual: ⬜ Not tested yet
```

**V3: Screenshots captured automatically**
```bash
# Test: Check screenshots
ls proof/screenshots/

# Expected: ✅ before.png and after.png exist
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/demo-delta-gen/index.js`
- [ ] `services/demo-delta-gen/wake-maya.js`
- [ ] `proof/screenshots/` (directory)

### Done When

- [x] DEMO.md and DELTA.md auto-generated
- [x] All 3 acceptance tests pass
- [x] 55min saved per milestone

---

## Feature 8: Emma Autonomous Mode

**Status:** ⬜ TODO
**Time:** 0/6h
**Priority:** P2 (Week 5)
**Depends on:** Feature 4 (Emma RSS)

### Implementation Checklist

- [ ] Add confidence breakdown to `confidence.js`
- [ ] Create router: `services/emma-rss/router.js`
- [ ] Update evaluator to use router
- [ ] Test auto-send threshold (≥80%)
- [ ] Test manual threshold (<80%)
- [ ] Test auto-reject threshold (<30%)
- [ ] Track accuracy, tune thresholds

### Acceptance Tests (0/3 passing)

**V1: High-confidence proposals auto-sent**
```bash
# Test: Simple job (clear budget, verified client, AI domain)

# Expected: ✅ Confidence ≥80%, auto-sent
# Actual: ⬜ Not tested yet
```

**V2: Low-confidence proposals go to approval**
```bash
# Test: Complex job (vague scope, new client)

# Expected: ✅ Confidence <80%, Telegram approval request
# Actual: ⬜ Not tested yet
```

**V3: Very low confidence auto-rejects**
```bash
# Test: Mismatched job (wrong domain, budget too low)

# Expected: ✅ Confidence <30%, auto-rejected
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/emma-rss/router.js`
- [ ] `citizens/emma/rejected-leads.log`

### Done When

- [x] 80%+ of proposals auto-sent
- [x] All 3 acceptance tests pass
- [x] 7.9h/week saved

---

## Feature 9: Sofia Auto-Review

**Status:** ⬜ TODO
**Time:** 0/10h
**Priority:** P2 (Week 6)

### Implementation Checklist

- [ ] Create GitHub webhook handler: `services/sofia-reviewer/index.js`
- [ ] Create Sofia waker: `services/sofia-reviewer/wake-sofia.js`
- [ ] Create policy checks: `services/sofia-reviewer/policies/`
- [ ] Set up GitHub webhook in repo settings
- [ ] Test with test commits (silent fallback, AC mutation)
- [ ] Verify GitHub status updates

### Acceptance Tests (0/3 passing)

**V1: Silent fallbacks detected**
```bash
# Test: Push commit with try/catch without rethrow
git add -A
git commit -m "test: silent fallback"
git push origin feature-branch

# Expected: ✅ GitHub status = failure, merge blocked
# Actual: ⬜ Not tested yet
```

**V2: AC.md mutation blocked**
```bash
# Test: Push commit that changes proof/AC.md without CR tag

# Expected: ✅ GitHub status = failure, "AC.md mutated" error
# Actual: ⬜ Not tested yet
```

**V3: Clean code passes**
```bash
# Test: Push commit with proper error handling

# Expected: ✅ GitHub status = success, merge allowed
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/sofia-reviewer/index.js`
- [ ] `services/sofia-reviewer/wake-sofia.js`
- [ ] `services/sofia-reviewer/policies/fail-loud.js`
- [ ] `services/sofia-reviewer/policies/baseline.js`
- [ ] `services/sofia-reviewer/policies/coverage.js`

### Environment Variables Needed

- [ ] `GITHUB_TOKEN`

### Done When

- [x] All 3 acceptance tests pass
- [x] 100% R-400/R-401 enforcement
- [x] 8.3h/month saved

---

## Feature 10: Priya Dashboard

**Status:** ⬜ TODO
**Time:** 0/16h
**Priority:** P2 (Week 7)

### Implementation Checklist

- [ ] Create dashboard service: `services/priya-dashboard/index.js`
- [ ] Create metrics calculator: `services/priya-dashboard/calculate-metrics.js`
- [ ] Create HTML generator: `services/priya-dashboard/generate-html.js`
- [ ] Create alerts engine: `services/priya-dashboard/alerts.js`
- [ ] Set up event logging (all citizens emit to `/logs/events.json`)
- [ ] Deploy dashboard service with PM2
- [ ] Test with sample events

### Acceptance Tests (0/3 passing)

**V1: Dashboard loads and shows metrics**
```bash
# Test: Open /dashboard in browser
open http://localhost:3000/dashboard

# Expected: ✅ Loads <2s, shows all metric categories
# Actual: ⬜ Not tested yet
```

**V2: Metrics are accurate**
```bash
# Test: Verify GO rate
cat logs/events.json | grep "lead.parsed" | jq 'select(.data.decision == "GO")' | wc -l

# Compare to dashboard GO rate

# Expected: ✅ Dashboard matches manual count
# Actual: ⬜ Not tested yet
```

**V3: Alerts trigger for critical metrics**
```bash
# Test: Simulate low GO rate (add 10 NO-GO events)

# Expected: ✅ Dashboard shows red alert, Telegram notification
# Actual: ⬜ Not tested yet
```

### Files to Create

- [ ] `services/priya-dashboard/index.js`
- [ ] `services/priya-dashboard/calculate-metrics.js`
- [ ] `services/priya-dashboard/generate-html.js`
- [ ] `services/priya-dashboard/alerts.js`
- [ ] `public/dashboard/index.html` (auto-generated)
- [ ] `public/dashboard/styles.css`
- [ ] `/logs/events.json`

### Done When

- [x] All 3 acceptance tests pass
- [x] Real-time updates (5s refresh)
- [x] 4h/month saved

---

## Feature 11: Client Portal

**Status:** 🔵 DEFERRED
**Reason:** Not needed until 5+ concurrent clients (Phase 2)
**Will revisit:** Week 13-16 or when manual status updates exceed 2h/week

---

## Testing Summary

### Test Commands Quick Reference

```bash
# Feature 1 - Proof Regeneration
npm run build:local && git tag test_$(date +%s) && git push --tags

# Feature 2 - Response Monitoring
curl -X POST http://localhost:3001/webhook/upwork-response -d '{"subject":"Test","body":"Test message"}'

# Feature 3 - Lead Tracker
python scripts/track-lead.py --platform Upwork --title "Test" --budget "$5K" --decision GO --reason "Test"

# Feature 4 - Emma RSS
# (Monitor logs: tail -f /var/log/emma-rss.log)

# Feature 5 - AC Drafting
# (Trigger via email or Telegram command)

# Feature 6 - Test Generation
git tag ac-baseline_test_$(date +%s) && git push --tags

# Feature 7 - DEMO/DELTA
git tag evidence-sprint_test_$(date +%s) && git push --tags

# Feature 8 - Emma Autonomous
# (Verify via confidence scores in logs)

# Feature 9 - Sofia Auto-Review
git checkout -b test-branch && echo "try {} catch {}" >> test.ts && git add . && git commit -m "test" && git push origin test-branch

# Feature 10 - Priya Dashboard
open http://localhost:3000/dashboard
```

---

## Next Actions

**This Week (P0 Quick Wins):**
1. [ ] Implement Feature 1 (2h)
2. [ ] Implement Feature 3 (3h)
3. [ ] Implement Feature 2 Phase 1 IFTTT (30min)
4. [ ] Test all three features
5. [ ] Mark features as ✅ DONE when all tests pass

**Next Week:**
1. [ ] Start Feature 4 (Emma RSS) - 20h
2. [ ] Run in dry-run mode for 1 week
3. [ ] Go live when confidence scores stable

**Update This File:**
- Mark tasks complete with timestamps
- Update test results (⬜ → ✅)
- Log issues/blockers
- Track actual time vs estimates
