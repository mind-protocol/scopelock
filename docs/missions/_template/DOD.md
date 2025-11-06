# Definition of Done: [Mission Name]

**Mission:** [Brief mission name]
**Purpose:** Comprehensive checklist for mission completion
**Date Created:** YYYY-MM-DD

**For Sofia (The Checker):** Use this checklist to verify the mission is ready for delivery.

---

## ✅ Documentation Complete

**All 6 levels of documentation exist and are complete:**

- [ ] `PATTERN.md` created with principles, risks, and success criteria
- [ ] `AC.md` created with functional + non-functional + verification section
- [ ] `VALIDATION.md` created with test specifications and framework details
- [ ] `MECHANISM.md` created with architecture, tech stack, and design decisions
- [ ] `ALGORITHM.md` created with step-by-step implementation logic
- [ ] `GUIDE.md` created with setup, deployment, and troubleshooting instructions
- [ ] `DOD.md` (this file) complete

**Documentation quality:**
- [ ] No placeholders or TODO sections remain
- [ ] All code examples are complete and accurate
- [ ] All commands are copy-paste executable
- [ ] All file paths reference actual files that exist

---

## ✅ Implementation Ready

**Dependencies documented:**
- [ ] All npm/pip packages listed in package.json/requirements.txt
- [ ] Versions specified for critical dependencies
- [ ] No unnecessary dependencies included

**Environment variables:**
- [ ] All required env vars listed in AC.md and GUIDE.md
- [ ] .env.example file created with all variables (dummy values)
- [ ] Instructions provided for obtaining each variable value

**Database schema:**
- [ ] Schema defined in MECHANISM.md (if database used)
- [ ] Migration files created
- [ ] Seed data provided (if applicable)

**API endpoints:**
- [ ] All endpoints documented in MECHANISM.md (if API exists)
- [ ] Request/response formats specified
- [ ] Authentication requirements clear

---

## ✅ Acceptance Criteria Locked

**AC.md completeness:**
- [ ] All functional criteria are specific and testable (no "user-friendly" vague criteria)
- [ ] All non-functional criteria have numbers (p95 thresholds, error rates, not "fast" or "reliable")
- [ ] Verification section has exact test commands (copy-paste ready)
- [ ] Seed data location and setup command specified

**Baseline tagged:**
- [ ] `ac-baseline_[mission-name]_YYYY-MM-DD` tag created
- [ ] Tag pushed to repository
- [ ] Client approval obtained (sign-off in AC.md)

**Scope frozen:**
- [ ] AC.md marked as "Baseline Locked"
- [ ] Team aware that changes require Change Request (CHG-130)

---

## ✅ Test Specifications Ready

**Test framework:**
- [ ] Framework selected and documented in VALIDATION.md
- [ ] Framework version specified
- [ ] Test files structure defined

**Test coverage:**
- [ ] Test files mapped to AC.md sections (F1 → test file 1, F2 → test file 2, etc.)
- [ ] All functional criteria have corresponding test cases
- [ ] Performance benchmarks specified with p95 thresholds
- [ ] Edge cases identified and test scenarios created

**CI integration:**
- [ ] Test command for CI documented
- [ ] Failure threshold specified (0 failures)
- [ ] Performance gate defined

**TDD Workflow:**
- [ ] Sofia generates executable test code from VALIDATION.md (TDD: tests first!)
- [ ] Test suite ready before Rafael starts implementation
- [ ] Tests define quality criteria (implementation makes tests pass)

---

## ✅ Implementation Guidance Complete

**ALGORITHM.md completeness:**
- [ ] Step-by-step implementation for each feature in AC.md
- [ ] Error handling strategies defined
- [ ] Edge cases identified and handling documented
- [ ] Data transformations specified
- [ ] External service calls documented

**Code-level clarity:**
- [ ] Sofia can generate test code from VALIDATION.md without asking questions
- [ ] Rafael can generate implementation code from ALGORITHM.md without asking questions
- [ ] File structure specified (which files to create)
- [ ] Import statements listed
- [ ] Function signatures provided

---

## ✅ Deployment Ready

**GUIDE.md completeness:**
- [ ] Local setup instructions complete (step-by-step)
- [ ] All environment variables documented
- [ ] Deployment platform specified (Vercel / Render / other)
- [ ] Deployment steps provided (dashboard OR CLI)
- [ ] Post-deployment verification steps included

**Commands verified:**
- [ ] All commands in GUIDE.md are copy-paste executable
- [ ] No placeholders like `[your-database-url]` in final commands
- [ ] Developer tested setup using GUIDE.md (ask Reanance/Kara to verify)

**Troubleshooting:**
- [ ] Common issues documented with fixes
- [ ] Log viewing commands provided
- [ ] Rollback procedure documented

---

## ✅ Technical Stack Compliance

**Standard stack verification:**
- [ ] Using Next.js + Vercel for frontend (OR deviation documented and approved)
- [ ] Using Python (FastAPI/Django) + Render for backend if needed (OR deviation documented)
- [ ] Using PostgreSQL OR Airtable for database (OR deviation documented)
- [ ] Using Claude Code for AI calls (NOT direct API calls)

**If deviation from standard stack:**
- [ ] Justification documented in PATTERN.md
- [ ] NLR approval obtained and dated
- [ ] Alternative stack documented in MECHANISM.md

---

## ✅ Implementation Complete

**Code written:**
- [ ] All features from AC.md implemented
- [ ] All files from ALGORITHM.md created
- [ ] No TODO comments or placeholder code
- [ ] No console.log() debugging statements left in production code

**Code quality:**
- [ ] Linter passes (no errors)
- [ ] TypeScript/Python type checking passes (if applicable)
- [ ] No unused imports or dead code

**Error handling:**
- [ ] All try-catch blocks present (per ALGORITHM.md)
- [ ] All errors emit failure.emit with location and reason
- [ ] No silent failures (errors are logged or rethrown)

---

## ✅ Tests Pass

**Unit tests:**
- [ ] All unit tests written (Sofia generates from VALIDATION.md)
- [ ] All unit tests pass (100% pass rate)

**Acceptance tests:**
- [ ] All acceptance tests written by Sofia (per VALIDATION.md - TDD workflow)
- [ ] Rafael's implementation passes all Sofia's tests (100% pass rate)
- [ ] Tests run successfully in CI

**Performance tests:**
- [ ] Performance benchmarks implemented (Sofia generates from VALIDATION.md)
- [ ] All p95 thresholds met (per AC.md NF1)
- [ ] No performance regressions vs baseline

**Test results:**
- [ ] Screenshot/proof of all tests passing
- [ ] CI build green
- [ ] No flaky tests (tests pass consistently across 3 runs)

---

## ✅ Security Verified

**Authentication:**
- [ ] Password hashing implemented correctly (bcrypt/argon2)
- [ ] Session/token management secure (httpOnly cookies OR proper JWT storage)
- [ ] No credentials in code (all in environment variables)

**Authorization:**
- [ ] Access control implemented (per MECHANISM.md)
- [ ] Users cannot access unauthorized resources (tested)

**Data protection:**
- [ ] HTTPS enforced for all endpoints (production)
- [ ] Secrets stored in environment variables (not in code)
- [ ] SQL injection prevented (parameterized queries OR ORM)
- [ ] XSS prevented (input sanitization + output encoding)

**Compliance (if applicable):**
- [ ] GDPR compliance verified (data export/deletion endpoints if EU users)
- [ ] HIPAA compliance verified (if healthcare data)

---

## ✅ Deployment Successful

**Deployed to production:**
- [ ] Application deployed to [Vercel / Render / platform]
- [ ] Deployment successful (no errors)
- [ ] Production URL accessible

**Environment configured:**
- [ ] All environment variables set in production
- [ ] Database connected and accessible
- [ ] External services configured (Stripe, SendGrid, etc.)

**Verification:**
- [ ] Health endpoint returns 200 OK
- [ ] Can login with test user
- [ ] Core functionality works (smoke test)

**Database:**
- [ ] Migrations run successfully
- [ ] Seed data loaded (if applicable)
- [ ] Database backups configured

---

## ✅ Monitoring Configured

**Error tracking:**
- [ ] Error tracking enabled (Sentry or equivalent)
- [ ] Test error sent and visible in dashboard
- [ ] Alerts configured for critical errors

**Performance monitoring:**
- [ ] Performance monitoring enabled (Vercel Analytics or equivalent)
- [ ] Baseline metrics captured

**Uptime monitoring:**
- [ ] Uptime monitoring configured (Better Uptime or equivalent)
- [ ] Alert contacts set (Slack / email)

---

## ✅ Documentation Delivered

**Client-facing documentation:**
- [ ] User guide created (if applicable)
- [ ] API documentation generated (if API exposed to client)
- [ ] Admin panel documentation (if admin features exist)

**Handoff documentation:**
- [ ] Credentials provided to client (database, APIs, admin access)
- [ ] Deployment access granted (Vercel/Render account shared)
- [ ] Support plan documented (who to contact for issues)

---

## ✅ Proof Log Entry

**Evidence Sprint (if applicable):**
- [ ] `evidence-sprint_[mission-name]_YYYY-MM-DD` tag created
- [ ] `/proof/DEMO.md` created (≤90s demo URL + 3 bullets)
- [ ] `/proof/DELTA.md` created (2+ quantified deltas)
- [ ] Tag pushed to repository
- [ ] Proof entry visible on scopelock.mindprotocol.ai/proof

**AC Green:**
- [ ] `ac-green_[mission-name]_YYYY-MM-DD` tag created
- [ ] `/proof/AC.md` included in tag
- [ ] `/proof/DEMO.md` updated (if changed since Evidence Sprint)
- [ ] `/proof/DELTA.md` updated (if changed since Evidence Sprint)
- [ ] Tag pushed to repository
- [ ] Proof entry visible on scopelock.mindprotocol.ai/proof

---

## ✅ Client Acceptance

**Acceptance testing:**
- [ ] Client tested on staging/production
- [ ] Client confirms all functional criteria met
- [ ] Client confirms performance acceptable
- [ ] Client confirms no critical bugs

**Sign-off:**
- [ ] Client signed off on AC.md completion
- [ ] Client approved for invoice
- [ ] Payment received (or invoiced)

---

## ✅ Final Checklist

**Before declaring mission complete, verify:**

- [ ] All sections above are ✅ (100% complete)
- [ ] No blockers or open issues remain
- [ ] Client is satisfied with delivery
- [ ] Team has no outstanding concerns

**If ANY item is unchecked:**
- Mission is **NOT COMPLETE**
- Return to incomplete items
- Do not invoice client

**If ALL items are checked:**
- Mission is **AC GREEN** ✅
- Create `ac-green_*` tag
- Invoice client
- Celebrate! 🎉

---

## Notes

[Any mission-specific notes, edge cases verified, or post-delivery considerations]

---

**Verified By:** [Sofia - The Checker]
**Date Verified:** YYYY-MM-DD
**Status:** Ready for Delivery / Not Ready (see blockers above)
