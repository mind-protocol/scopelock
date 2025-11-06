# VALIDATION: [Mission Name]

**Mission:** [Brief mission name]
**Purpose:** Test specifications mapped to AC.md acceptance criteria
**Date Created:** YYYY-MM-DD

**TDD Workflow:** Sofia (The Checker) generates executable test code (pytest, Vitest, Playwright) from these specifications BEFORE Rafael starts implementation. Tests define quality criteria; implementation makes tests pass.

---

## Test Framework

**Framework:** [Playwright / Jest / pytest / other]
**Version:** [specific version, e.g., Playwright 1.40.0]
**Language:** [TypeScript / JavaScript / Python]

**Why this framework:**
[Brief justification for framework choice]

**Example:**
- **Framework:** Playwright 1.40.0
- **Language:** TypeScript
- **Why:** E2E testing for Next.js app, supports headless Chrome, excellent CI integration

---

## Test Files Structure

**Location:** `[path to test files]`

**Structure:**
```
tests/acceptance/
├── [feature-1].spec.[ts|py]      # Maps to AC.md F1
├── [feature-2].spec.[ts|py]      # Maps to AC.md F2
├── [feature-3].spec.[ts|py]      # Maps to AC.md F3
├── performance.spec.[ts|py]      # Maps to AC.md NF1 (Performance)
├── security.spec.[ts|py]         # Maps to AC.md NF4 (Security)
└── fixtures/
    ├── seed-data.[json|sql]      # Test data
    └── test-users.json           # User accounts for testing
```

**Example:**
```
tests/acceptance/
├── auth-login.spec.ts            # F1: User Login
├── auth-registration.spec.ts     # F2: User Registration
├── dashboard.spec.ts             # F3: Dashboard Display
├── performance.spec.ts           # NF1: Performance benchmarks
└── fixtures/
    ├── seed-data.sql
    └── test-users.json
```

---

## Test Scenarios

### F1: [Feature Name] Tests

**File:** `tests/acceptance/[feature-1].spec.[ts|py]`

**Test cases:**

#### Test 1.1: [Scenario name]
**Description:** [What this test verifies]
**Given:** [Precondition]
**When:** [Action]
**Then:** [Expected result]

**Assertions:**
- [ ] [Specific assertion 1]
- [ ] [Specific assertion 2]

**Example:**
```
#### Test 1.1: Valid login redirects to dashboard

Description: Verify that valid credentials redirect user to dashboard
Given: User exists with email "test@example.com" and password "Test123!"
When: User enters valid credentials and clicks "Login"
Then: User is redirected to /dashboard with session cookie set

Assertions:
- [ ] URL changes to /dashboard
- [ ] Session cookie "auth_token" is present
- [ ] Dashboard header shows user's name
- [ ] Login audit log entry created
```

#### Test 1.2: [Scenario name]
[Same structure]

---

### F2: [Feature Name] Tests

**File:** `tests/acceptance/[feature-2].spec.[ts|py]`

[Same structure as F1]

---

## Performance Tests

**File:** `tests/acceptance/performance.spec.[ts|py]`

### Performance Test 1: [Operation] Response Time

**Benchmark:** [Operation name] must complete in ≤ [X]ms (p95)

**Test:**
1. Execute [operation] 100 times
2. Calculate p95 latency
3. Assert p95 ≤ [X]ms

**Example:**
```
Performance Test 1: API Login Response Time

Benchmark: Login endpoint must respond in ≤ 200ms (p95)

Test:
1. POST /api/auth/login 100 times with valid credentials
2. Measure response time for each request
3. Calculate p95 latency
4. Assert p95 ≤ 200ms
```

### Performance Test 2: [Operation] Response Time

[Same structure]

---

## CI Integration

**CI Provider:** [GitHub Actions / GitLab CI / CircleCI / other]

**Test Command:**
```bash
[Exact command CI runs to execute tests]
```

**Example:**
```bash
# GitHub Actions test command
npm run test:acceptance

# Or for Python
pytest tests/acceptance/ -v --junitxml=test-results.xml
```

**Failure Threshold:** 0 test failures allowed

**Performance Gate:** All benchmarks must pass (p95 thresholds met)

---

## Configuration

**Test Environment:**
- Database: [Test database setup, e.g., PostgreSQL with seed data]
- API: [Local dev server or staging environment]
- Browser: [Chromium headless / headed]

**Example:**
```
Test Environment:
- Database: PostgreSQL test DB (localhost:5433)
- API: Next.js dev server (localhost:3000)
- Browser: Chromium headless
```

**Environment Variables:**
```
[List required env vars for tests]
```

**Example:**
```
DATABASE_URL=postgresql://test:test@localhost:5433/testdb
API_BASE_URL=http://localhost:3000
TEST_USER_PASSWORD=Test123!
```

---

## Test Data Management

**Seed Script:** `[path to seed script]`

**Setup:**
```bash
[Command to seed test database]
```

**Teardown:**
```bash
[Command to clean up after tests]
```

**Example:**
```bash
# Setup
npm run db:seed:test

# Run tests
npm run test:acceptance

# Teardown
npm run db:reset:test
```

---

## Coverage Requirements

**Overall Coverage:** ≥ [X]% code coverage

**Critical Paths Coverage:** ≥ [Y]% (authentication, payment, core business logic)

**Example:**
- Overall: ≥ 70%
- Authentication module: ≥ 90%
- Payment processing: ≥ 95%
- API routes: ≥ 80%

---

## Test Execution

### Run All Tests

```bash
[Command to run all acceptance tests]
```

**Example:**
```bash
npm run test:acceptance
```

---

### Run Specific Test Suite

```bash
[Command to run subset of tests]
```

**Example:**
```bash
# Run only login tests
npx playwright test tests/acceptance/auth-login.spec.ts

# Run only performance tests
npm run test:perf
```

---

### Run in Watch Mode (Local Development)

```bash
[Command to run tests in watch mode]
```

**Example:**
```bash
npm run test:acceptance:watch
```

---

## Debugging Failed Tests

**Enable verbose output:**
```bash
[Command with verbose/debug flags]
```

**Example:**
```bash
# Playwright with debug output
DEBUG=pw:api npx playwright test

# Jest with verbose
npm run test:acceptance -- --verbose

# pytest with print statements
pytest tests/acceptance/ -v -s
```

**Screenshots/Videos:**
[Location where test artifacts are saved]

**Example:**
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/videos/`
- Logs: `test-results/logs/`

---

## Success Criteria

Tests are considered passing when:
- ✅ All functional tests green (100% pass rate)
- ✅ All performance benchmarks met (p95 thresholds)
- ✅ Code coverage meets requirements
- ✅ Zero flaky tests (consistent results across 3 runs)

---

## Notes

[Any additional context, known issues, or testing considerations]
