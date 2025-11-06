# Acceptance Criteria: [Mission Name]

**Mission:** [Brief mission name]
**Client:** [Client name]
**Date Created:** YYYY-MM-DD
**Baseline Tag:** `ac-baseline_[mission-name]_YYYY-MM-DD` (once locked)

---

## Overview

This document defines the **executable acceptance criteria** for [mission name]. The client pays only when all criteria below are met and verified by automated tests.

**Status:** Draft / Baseline Locked / Updated (CR-XXX)

---

## Functional Criteria

### F1: [Feature Name]

**User Story:**
As a [user type], I want to [action], so that [benefit].

**Given:** [Precondition - what state the system is in]
**When:** [Action - what the user does]
**Then:** [Expected outcome - what should happen]

**Acceptance:**
- [ ] [Specific testable criterion 1]
- [ ] [Specific testable criterion 2]
- [ ] [Specific testable criterion 3]

**Example:**
```
F1: User Login

User Story:
As a registered user, I want to log in with my email and password, so that I can access my account.

Given: User exists in database with email "user@example.com" and password "Test123!"
When: User enters email and password and clicks "Login"
Then: User is redirected to dashboard with session token set

Acceptance:
- [ ] Login form accepts email and password
- [ ] Valid credentials redirect to /dashboard
- [ ] Invalid credentials show error message "Invalid email or password"
- [ ] Session token is set in cookie with 24h expiry
- [ ] Login attempt is logged in audit table
```

---

### F2: [Feature Name]

[Same structure as F1]

---

### F3: [Feature Name]

[Continue for all functional features]

---

## Non-Functional Criteria

### NF1: Performance

**Response Time:**
- p95 latency ≤ [X]ms for [operation type]
- p99 latency ≤ [Y]ms for [operation type]
- Page load time ≤ [Z]ms (Time to Interactive)

**Example:**
- p95 API response time ≤ 200ms for all GET endpoints
- p99 API response time ≤ 500ms for all GET endpoints
- p95 database query time ≤ 50ms

**Database Performance:**
- Query execution time ≤ [X]ms for [query type]
- Database connection pool utilization <80%

**Example:**
- User lookup by email ≤ 10ms
- Full-text search across products ≤ 100ms

---

### NF2: Quality

**Error Rate:**
- Production error rate ≤ [X]% of requests
- Zero unhandled exceptions reaching client

**Example:**
- Production error rate ≤ 0.1% (1 in 1000 requests)
- All errors logged to error tracking system
- Critical errors trigger alert to on-call developer

**Test Coverage:**
- Code coverage ≥ [X]% for critical paths
- All acceptance criteria have automated tests

**Example:**
- Code coverage ≥ 80% for authentication module
- Code coverage ≥ 60% overall

---

### NF3: Deployment

**Deployment Process:**
- Zero-downtime deployment
- Rollback ready in ≤ [X] minutes
- Database migrations run automatically

**Example:**
- Blue-green deployment via Vercel
- Rollback via Vercel dashboard or `vercel rollback` CLI
- Prisma migrations run in deployment hook

**Monitoring:**
- Error tracking enabled (Sentry or equivalent)
- Performance monitoring enabled
- Uptime monitoring configured

---

### NF4: Security

**Authentication:**
- [Authentication method and requirements]

**Authorization:**
- [Authorization rules and access control]

**Data Protection:**
- [Encryption, backups, GDPR/HIPAA compliance if applicable]

**Example:**
- All passwords hashed with bcrypt (cost factor 12)
- Session tokens use httpOnly cookies
- HTTPS enforced for all endpoints
- Database backups daily at 2am UTC

---

### NF5: Accessibility (if applicable)

**Standards:**
- WCAG 2.1 Level [A/AA/AAA] compliance
- Keyboard navigation support
- Screen reader compatibility

---

## Verification

This section defines how to verify that all acceptance criteria are met.

### Test Command

**Run all acceptance tests:**
```bash
[Exact command to run tests, copy-paste ready]
```

**Example:**
```bash
# Run Playwright acceptance tests
npx playwright test tests/acceptance/

# Run Python backend tests
pytest tests/acceptance/ -v

# Run performance benchmarks
npm run test:perf
```

---

### Seed Data

**Location:** `[path to seed data or script]`

**Setup:**
```bash
[Exact command to seed test database]
```

**Example:**
```bash
# Seed test database
npx prisma db seed

# Or run custom seed script
node scripts/seed-test-data.js
```

**Required seed data:**
- [List what test data must exist]

**Example:**
- 10 test users (user001@test.com through user010@test.com, password: Test123!)
- 50 sample products across 5 categories
- 20 test orders in various states (pending, completed, refunded)

---

### Expected Outputs

**When all tests pass, you should see:**
```
[Example output of successful test run]
```

**Example:**
```
✓ F1: User Login - valid credentials (245ms)
✓ F1: User Login - invalid credentials shows error (123ms)
✓ F2: User Registration - creates account (456ms)
✓ NF1: Performance - API response time <200ms (189ms avg)
✓ NF2: Quality - zero unhandled exceptions (0 errors)

All tests passed (26/26)
```

---

### Performance Benchmarks

**Run performance tests:**
```bash
[Command to run performance tests]
```

**Expected results:**
- [Metric 1]: ≤ [threshold]
- [Metric 2]: ≤ [threshold]

**Example:**
```bash
npm run benchmark
```

Expected:
- Login endpoint p95: ≤ 150ms
- Product search p95: ≤ 200ms
- Checkout flow p95: ≤ 500ms

---

## Change Log

**Baseline:** YYYY-MM-DD - Initial acceptance criteria
**CR-001:** YYYY-MM-DD - [Description of change] (Swap/Add)

---

## Sign-Off

**Client Approval:** [Name, Date]
**Inna (Specifier):** [Date]
**Rafael (Code Gen):** [Date]

---

## Notes

[Any additional context, edge cases to consider, or clarifications needed]
