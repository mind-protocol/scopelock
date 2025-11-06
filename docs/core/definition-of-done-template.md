# Definition of Done (DoD) Template

**Purpose:** Standard DoD checklist format for all ScopeLock missions
**Owner:** Sofia (The Checker) uses this to verify delivery readiness
**Last Updated:** 2025-11-05

---

## How to Use This Template

**When creating DoD for a specific mission:**

1. Copy this template to `docs/missions/[mission-name]/DOD.md`
2. Customize mission-specific sections (project name, specific criteria)
3. Remove sections that don't apply (e.g., if no API, remove API section)
4. Sofia uses this checklist before declaring mission complete

**Critical rule:** If ANY item is unchecked, mission is **NOT COMPLETE**.

---

## Standard DoD Checklist

### ✅ Documentation Complete

- [ ] `PATTERN.md` created with principles and success criteria
- [ ] `AC.md` created with functional + non-functional + verification
- [ ] `VALIDATION.md` created with test specifications
- [ ] `MECHANISM.md` created with architecture and tech choices
- [ ] `ALGORITHM.md` created with implementation steps
- [ ] `GUIDE.md` created with setup and deployment instructions
- [ ] `DOD.md` (this file) complete
- [ ] No TODO sections or placeholders remain
- [ ] All commands are copy-paste executable

---

### ✅ Acceptance Criteria Locked

- [ ] AC.md has specific, testable functional criteria
- [ ] AC.md has numbered non-functional criteria (p95 thresholds, error rates)
- [ ] Verification section has exact test commands
- [ ] `ac-baseline_[mission-name]_YYYY-MM-DD` tag created and pushed
- [ ] Client approval obtained

---

### ✅ Implementation Complete

- [ ] All features from AC.md implemented
- [ ] No TODO comments or placeholder code
- [ ] No console.log() debugging statements in production code
- [ ] Linter passes (no errors)
- [ ] Type checking passes (if TypeScript/Python with types)

---

### ✅ Tests Pass

- [ ] All unit tests written and passing (100% pass rate)
- [ ] All acceptance tests written and passing (100% pass rate)
- [ ] Tests run successfully in CI (green build)
- [ ] Performance benchmarks met (all p95 thresholds from AC.md)
- [ ] No flaky tests (consistent results across 3 runs)

---

### ✅ Security Verified

- [ ] Password hashing implemented correctly (if auth exists)
- [ ] Session/token management secure (if auth exists)
- [ ] No credentials in code (all in environment variables)
- [ ] HTTPS enforced for all endpoints (production)
- [ ] SQL injection prevented (parameterized queries or ORM)
- [ ] XSS prevented (input sanitization + output encoding)

---

### ✅ Deployment Successful

- [ ] Application deployed to production (Vercel/Render/platform)
- [ ] Production URL accessible
- [ ] All environment variables set in production
- [ ] Database connected and accessible
- [ ] Health endpoint returns 200 OK (or equivalent smoke test)
- [ ] Migrations run successfully

---

### ✅ Monitoring Configured

- [ ] Error tracking enabled (Sentry or equivalent)
- [ ] Test error sent and visible in dashboard
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured (if applicable)

---

### ✅ Proof Log Entry (if applicable)

**Evidence Sprint (optional):**
- [ ] `evidence-sprint_[mission-name]_YYYY-MM-DD` tag created
- [ ] `/proof/DEMO.md` created (≤90s demo + 3 bullets)
- [ ] `/proof/DELTA.md` created (2+ quantified deltas)
- [ ] Proof entry visible on scopelock.mindprotocol.ai/proof

**AC Green (required):**
- [ ] `ac-green_[mission-name]_YYYY-MM-DD` tag created
- [ ] `/proof/AC.md` included in tag
- [ ] Proof entry visible on scopelock.mindprotocol.ai/proof

---

### ✅ Client Acceptance

- [ ] Client tested on staging/production
- [ ] Client confirms all functional criteria met
- [ ] Client confirms performance acceptable
- [ ] Client confirms no critical bugs
- [ ] Client signed off on AC.md completion
- [ ] Payment received or invoiced

---

## Mission-Specific Additions

**Add custom checklist items specific to this mission below.**

**Example - If mission has API:**
- [ ] API documentation generated (OpenAPI/Swagger)
- [ ] All endpoints return correct HTTP status codes
- [ ] Rate limiting configured

**Example - If mission has admin panel:**
- [ ] Admin can create/update/delete resources
- [ ] Admin authentication working
- [ ] Admin panel mobile-responsive

**Example - If mission has payments:**
- [ ] Stripe test mode working
- [ ] Stripe production mode configured
- [ ] Webhook handler verified
- [ ] Payment receipts sent via email

**Example - If mission has email:**
- [ ] Email templates created
- [ ] SendGrid/email service configured
- [ ] Test emails sent successfully

---

## DoD Verification Process (Sofia)

### Step 1: Review Documentation

**Check all 6 levels exist and are complete:**
```bash
cd docs/missions/[mission-name]
ls -la
# Expected: PATTERN.md, AC.md, VALIDATION.md, MECHANISM.md, ALGORITHM.md, GUIDE.md, DOD.md
```

**Verify no TODOs:**
```bash
grep -r "TODO" docs/missions/[mission-name]/
# Expected: No results (or only in code examples)
```

---

### Step 2: Verify Baseline Tag

**Check tag exists:**
```bash
git tag | grep ac-baseline
# Expected: ac-baseline_[mission-name]_YYYY-MM-DD
```

**Verify AC.md is locked:**
```bash
grep "Status:" docs/missions/[mission-name]/AC.md
# Expected: "Baseline Locked" or similar
```

---

### Step 3: Run Tests Locally

**Run acceptance tests:**
```bash
[copy command from VALIDATION.md]
```

**Expected:** All tests pass (100% pass rate)

**If tests fail:**
- Mission is NOT complete
- Document failing tests
- Return to developer for fixes

---

### Step 4: Verify Deployment

**Check production URL:**
```bash
curl [production-url]/api/health
# OR open in browser: [production-url]
```

**Expected:** 200 OK response (or homepage loads)

**Check critical functionality:**
```bash
[Test login, core feature, etc.]
```

---

### Step 5: Review Code Quality

**Run linter:**
```bash
[copy command from project, e.g., npm run lint]
```

**Expected:** No errors (warnings acceptable if documented)

**Check for debugging code:**
```bash
grep -r "console.log\|print(" src/
# Expected: No results (or only in dev-only files)
```

---

### Step 6: Security Check

**Verify no secrets in code:**
```bash
grep -r "sk_live\|api_key\|password\|secret" src/
# Expected: No hardcoded secrets (only env var references)
```

**Check .env.example exists:**
```bash
cat .env.example
# Expected: All env vars listed with dummy values
```

---

### Step 7: Performance Verification

**Run performance tests:**
```bash
[copy command from VALIDATION.md]
```

**Expected:** All p95 thresholds met (per AC.md)

**If performance fails:**
- Mission is NOT complete
- Document which thresholds failed
- Return to developer for optimization

---

### Step 8: Final Sign-Off

**If all checks pass:**
- [ ] Mark DoD as "Ready for Delivery"
- [ ] Notify NLR for final approval (15 min review)
- [ ] Create `ac-green_*` tag after NLR approval
- [ ] Client can be invoiced

**If any check fails:**
- [ ] Mark DoD as "Not Ready"
- [ ] List specific blockers
- [ ] Return to developer/Rafael for fixes
- [ ] Re-verify after fixes

---

## Common Failure Patterns

**Watch out for these:**

### 1. Tests pass locally but fail in CI
**Cause:** Environment differences, missing env vars in CI
**Fix:** Verify .env.test exists, check CI env vars match

### 2. Deployment succeeds but app crashes
**Cause:** Missing production env vars, database connection issue
**Fix:** Check platform dashboard for errors, verify env vars set

### 3. Performance tests fail intermittently
**Cause:** Flaky tests, network issues, insufficient load
**Fix:** Re-run tests 3 times, average results, investigate outliers

### 4. Security scan finds vulnerabilities
**Cause:** Outdated dependencies, misconfiguration
**Fix:** Run `npm audit fix` or `pip-audit`, update dependencies

---

## DoD Status Levels

**Use one of these statuses:**

### ✅ READY FOR DELIVERY
- All checklist items complete
- No blockers
- Approved by Sofia
- Awaiting NLR final review

### ⚠️ MINOR ISSUES
- 1-2 non-critical items incomplete
- Can be fixed quickly (<1 hour)
- Example: Missing comment, small documentation update

### ❌ NOT READY
- Critical items incomplete
- Tests failing
- Deployment broken
- Security issues found

### 🔄 IN PROGRESS
- Implementation ongoing
- Not yet ready for DoD verification

---

## Template Customization Examples

### Example 1: E-Commerce Project

**Additional DoD items:**
```markdown
### ✅ Payment Processing
- [ ] Stripe production mode configured
- [ ] Payment webhook handler verified
- [ ] Receipt emails sent correctly
- [ ] Refund process tested

### ✅ Inventory Management
- [ ] Stock levels update correctly
- [ ] Out-of-stock products show as unavailable
- [ ] Low stock alerts working
```

---

### Example 2: Healthcare App (HIPAA)

**Additional DoD items:**
```markdown
### ✅ HIPAA Compliance
- [ ] PHI encrypted at rest
- [ ] PHI encrypted in transit (HTTPS)
- [ ] Audit logs capture all PHI access
- [ ] User authentication requires MFA
- [ ] Data export functionality tested
- [ ] Data deletion functionality tested
- [ ] BAA signed with hosting provider
```

---

### Example 3: Mobile App (React Native)

**Additional DoD items:**
```markdown
### ✅ Mobile-Specific
- [ ] App tested on iOS (physical device)
- [ ] App tested on Android (physical device)
- [ ] Push notifications working
- [ ] Offline mode functional
- [ ] App submitted to App Store (iOS)
- [ ] App submitted to Play Store (Android)
- [ ] App icons and splash screens correct
```

---

## Questions?

**For DoD verification:** Ask Sofia (The Checker)
**For DoD customization:** Ask Inna (The Specifier)
**For fixing DoD blockers:** Ask Rafael (The Guide)
