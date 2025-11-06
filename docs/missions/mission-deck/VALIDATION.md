# VALIDATION: ScopeLock Mission Deck

**Mission:** Internal developer dashboard
**Test Strategy:** Backend unit tests (pytest) + Frontend component tests (Jest/RTL) + Manual E2E (Week 1)
**Created:** 2025-11-05

---

## Test Framework

**Backend:**
- **Framework:** pytest 7.4+
- **Coverage:** pytest-cov
- **Async:** pytest-asyncio
- **Database:** pytest-postgresql (test DB)
- **Location:** `backend/tests/`

**Frontend:**
- **Framework:** Jest + React Testing Library
- **Coverage:** Built-in Jest coverage
- **E2E (Week 2):** Playwright
- **Location:** `frontend/src/__tests__/`

**Manual Testing:**
- **Tool:** Browser (Chrome/Firefox)
- **Checklist:** See "Manual Test Scenarios" below

---

## Test Files Structure

```
backend/
├── tests/
│   ├── conftest.py                  # Fixtures (test DB, test client)
│   ├── test_auth.py                 # F1: User Authentication
│   ├── test_missions.py             # F2: Mission Selector
│   ├── test_chat.py                 # F3: Rafael Chat
│   ├── test_dod.py                  # F4: DoD Checklist
│   ├── test_context.py              # F5: Context Tab
│   ├── test_performance.py          # NF1: Performance benchmarks
│   ├── test_security.py             # NF3: Security (8 critical tests) ⭐ NEW
│   └── test_error_handling.py       # NF1/NF2: Error handling (8 tests) ⭐ NEW

frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── MissionSelector.test.tsx   # F2
│   │   │   ├── ChatTab.test.tsx           # F3
│   │   │   ├── DODTab.test.tsx            # F4
│   │   │   ├── ContextTab.test.tsx        # F5
│   │   │   └── Layout.test.tsx            # F7: Responsive
│   │   └── integration/
│   │       └── mission-switch.test.tsx     # F6
│   ├── tests/
│   │   └── quality.test.ts          # NF2: Quality (10 tests) ⭐ NEW
```

---

## Test Scenarios

### F1: User Authentication

**File:** `backend/tests/test_auth.py`

**Test cases:**
1. `test_login_success` - Valid credentials return JWT token
2. `test_login_invalid_credentials` - Invalid credentials return 401
3. `test_logout` - Logout clears session/invalidates token
4. `test_protected_route_unauthorized` - Unauthorized user gets 401 on `/api/missions`
5. `test_protected_route_authorized` - Valid token accesses `/api/missions`

**Expected assertions:**
```python
def test_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": "person1@scopelock.ai",
        "password": "test123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_protected_route_unauthorized(client):
    response = client.get("/api/missions")
    assert response.status_code == 401
```

---

### F2: Mission Selector

**File:** `backend/tests/test_missions.py`

**Test cases:**
1. `test_list_missions` - GET /api/missions returns user's missions
2. `test_list_missions_empty` - Returns [] if no missions assigned
3. `test_list_missions_filters_by_user` - User A cannot see User B's missions
4. `test_get_mission_by_id` - GET /api/missions/1 returns mission details
5. `test_get_mission_not_found` - Non-existent mission returns 404

**Expected assertions:**
```python
def test_list_missions(client, auth_headers):
    response = client.get("/api/missions", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["title"] == "Telegram Notifier"
    assert data[0]["budget"] == 300
```

**File:** `frontend/src/__tests__/components/MissionSelector.test.tsx`

**Test cases:**
1. Renders mission list correctly
2. Highlights active mission
3. Switches mission on click
4. Shows correct status indicator (● vs ○ vs ✓)

**Expected assertions:**
```tsx
test('renders mission list', () => {
  const missions = [
    { id: '1', title: 'Telegram Notifier', budget: 300, status: 'active' }
  ];
  render(<MissionSelector missions={missions} activeMissionId="1" />);

  expect(screen.getByText('Telegram Notifier')).toBeInTheDocument();
  expect(screen.getByText('$300')).toBeInTheDocument();
});
```

---

### F3: Rafael Chat

**File:** `backend/tests/test_chat.py`

**Test cases:**
1. `test_send_message` - POST /api/missions/1/chat saves message and returns response
2. `test_send_message_empty` - Empty message returns 400
3. `test_send_message_too_long` - Message >10,000 chars returns 400
4. `test_list_messages` - GET /api/missions/1/messages returns message history
5. `test_rafael_response_includes_code` - Rafael response includes code_blocks array (if applicable)

**Expected assertions:**
```python
def test_send_message(client, auth_headers):
    response = client.post("/api/missions/1/chat",
        headers=auth_headers,
        json={"message": "How do I send a Telegram message?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
    # Check response time
    assert response.elapsed.total_seconds() < 10
```

**File:** `frontend/src/__tests__/components/ChatTab.test.tsx`

**Test cases:**
1. Renders chat message history
2. Sends message on button click
3. Sends message on Enter key
4. Shows loading indicator while waiting for response
5. Renders code blocks with syntax highlighting
6. Copies code to clipboard on [Copy Code] click

**Expected assertions:**
```tsx
test('sends message on button click', async () => {
  render(<ChatTab missionId="1" />);

  const input = screen.getByPlaceholderText('Type your question...');
  const sendButton = screen.getByText('Send');

  fireEvent.change(input, { target: { value: 'How do I deploy?' } });
  fireEvent.click(sendButton);

  await waitFor(() => {
    expect(screen.getByText('How do I deploy?')).toBeInTheDocument();
  });
});
```

---

### F4: DoD Checklist

**File:** `backend/tests/test_dod.py`

**Test cases:**
1. `test_get_dod_items` - GET /api/missions/1/dod returns checklist
2. `test_toggle_checkbox` - PATCH /api/missions/1/dod/item-1 toggles completed state
3. `test_toggle_persists` - Toggle persists across requests
4. `test_mark_all_complete` - PATCH /api/missions/1/dod/complete marks all items complete
5. `test_reset` - PATCH /api/missions/1/dod/reset unchecks all items

**Expected assertions:**
```python
def test_toggle_checkbox(client, auth_headers):
    # Toggle to completed
    response = client.patch("/api/missions/1/dod/item-1",
        headers=auth_headers,
        json={"completed": True}
    )
    assert response.status_code == 200

    # Verify persistence
    response = client.get("/api/missions/1/dod", headers=auth_headers)
    items = response.json()
    item_1 = next(i for i in items if i["id"] == "item-1")
    assert item_1["completed"] == True
    assert "completed_at" in item_1
```

**File:** `frontend/src/__tests__/components/DODTab.test.tsx`

**Test cases:**
1. Renders DoD items grouped by category
2. Toggles checkbox on click
3. Updates progress bar after toggle
4. Shows "Mark All Complete" button
5. Disables "Mark All Complete" when not all items checked

---

### F5: Context Tab

**File:** `backend/tests/test_context.py`

**Test cases:**
1. `test_get_mission_context` - GET /api/missions/1/context returns details + stack
2. `test_save_notes` - PATCH /api/missions/1/notes saves developer notes
3. `test_notes_persist` - Notes persist across requests

**File:** `frontend/src/__tests__/components/ContextTab.test.tsx`

**Test cases:**
1. Renders mission details correctly
2. Renders tech stack correctly
3. Notes text area is editable
4. Save button saves notes

---

### F6: Mission Switching

**File:** `frontend/src/__tests__/integration/mission-switch.test.tsx`

**Test cases:**
1. Switching mission updates all tabs (chat, DoD, context)
2. Switching mission updates URL
3. Browser back button returns to previous mission
4. Switching mission clears chat input

**Expected assertions:**
```tsx
test('switching mission updates all tabs', async () => {
  render(<Console />);

  // Select Mission 1
  fireEvent.click(screen.getByText('Mission #1'));
  await waitFor(() => {
    expect(screen.getByText('Telegram Notifier')).toBeInTheDocument();
  });

  // Switch to Mission 2
  fireEvent.click(screen.getByText('Mission #2'));
  await waitFor(() => {
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  // Verify DoD checklist changed
  expect(screen.queryByText('Bot sends text messages')).not.toBeInTheDocument();
});
```

---

### F7: Responsive Layout

**File:** `frontend/src/__tests__/components/Layout.test.tsx`

**Test cases:**
1. Desktop layout shows left panel + tabs side-by-side
2. Tablet layout collapses left panel to drawer
3. No horizontal scroll on any screen size

**Expected assertions:**
```tsx
test('desktop layout', () => {
  global.innerWidth = 1440;
  render(<Layout />);

  const leftPanel = screen.getByTestId('mission-selector');
  expect(leftPanel).toHaveStyle({ width: '200px', position: 'static' });
});

test('tablet layout', () => {
  global.innerWidth = 768;
  render(<Layout />);

  const leftPanel = screen.getByTestId('mission-selector');
  expect(leftPanel).toHaveStyle({ position: 'fixed', transform: 'translateX(-100%)' });
});
```

---

### NF3: Security Tests ⭐ NEW

**File:** `backend/tests/test_security.py`

**Test cases:**
1. `test_jwt_expired_token_rejected` - Expired JWT tokens return 401
2. `test_jwt_invalid_signature_rejected` - Invalid JWT signature returns 401
3. `test_missing_auth_token_rejected` - Missing auth token returns 401
4. `test_user_cannot_access_others_missions` - Users can only see their own missions
5. `test_user_cannot_access_others_dod_items` - Users cannot modify others' DoD items
6. `test_user_cannot_access_others_chat_history` - Users cannot read others' chat messages
7. `test_xss_prevention_in_notes_and_chat` - Script tags are sanitized in notes/chat
8. `test_sql_injection_prevention` - SQL injection payloads are blocked

**Expected assertions:**
```python
def test_jwt_expired_token_rejected(client, test_user):
    # Generate expired token (expired 1 day ago)
    expired_token = jwt.encode(
        {"sub": test_user.id, "exp": datetime.utcnow() - timedelta(days=1)},
        "test-secret-key",
        algorithm="HS256"
    )

    response = client.get(
        "/api/missions",
        headers={"Authorization": f"Bearer {expired_token}"}
    )

    assert response.status_code == 401
    assert "expired" in response.json().get("detail", "").lower()

def test_xss_prevention_in_notes_and_chat(client, auth_headers, test_mission):
    xss_payload = "<script>alert('XSS')</script>"

    # Test XSS in notes
    response = client.patch(
        f"/api/missions/{test_mission.id}/notes",
        headers=auth_headers,
        json={"notes": xss_payload}
    )

    # Retrieve and verify sanitization
    response = client.get(f"/api/missions/{test_mission.id}/context", headers=auth_headers)
    notes = response.json().get("notes", "")
    assert "<script>" not in notes
```

**Severity:** CRITICAL (all must pass, 0 failures allowed)
**Maps to:** AC.md NF3 (Security)

---

### NF2: Quality Tests ⭐ NEW

**File:** `frontend/tests/quality.test.ts`

**Test cases:**
1. `test_typescript_strict_mode_enabled` - tsconfig.json has strict: true
2. `test_no_any_types_in_source` - No `: any` or `as any` in source code
3. `test_next_build_zero_errors` - `tsc --noEmit` produces zero errors
4. `test_eslint_config_strict` - ESLint uses recommended rules
5. `test_eslint_zero_warnings` - `eslint src/ --max-warnings=0` passes
6. `test_keyboard_navigation_tab` - Tab key navigates through mission cards
7. `test_keyboard_navigation_enter` - Enter key activates mission selection
8. `test_keyboard_navigation_escape` - Escape key closes modals
9. `test_focus_indicators_visible` - All interactive elements show focus indicators
10. `test_color_contrast_wcag_aa` - All text meets ≥4.5:1 contrast (via axe-core)

**Expected assertions:**
```typescript
test('tsconfig.json has strict mode enabled', () => {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
  expect(tsconfig.compilerOptions?.strict).toBe(true);
});

test('eslint passes with zero warnings', () => {
  const output = execSync('npx eslint src/ --max-warnings=0', { encoding: 'utf-8' });
  // If no exception, eslint passed with 0 warnings
  console.log('✓ ESLint passed');
});

test('focus indicators visible', async ({ page }) => {
  await page.goto('http://localhost:3000/deck');
  const buttons = await page.locator('button').all();

  for (const button of buttons.slice(0, 10)) {
    await button.focus();
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return { outlineWidth: computed.outlineWidth, boxShadow: computed.boxShadow };
    });

    const hasFocusIndicator = styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    expect(hasFocusIndicator).toBe(true);
  }
});
```

**Severity:** HIGH (≥95% pass rate required)
**Maps to:** AC.md NF2 (Quality)

---

### NF1/NF2: Error Handling Tests ⭐ NEW

**File:** `backend/tests/test_error_handling.py`

**Test cases:**
1. `test_rafael_api_failure_graceful_degradation` - Rafael API down returns 503 (not 500)
2. `test_rafael_api_retry_logic` - Rafael API retry with exponential backoff
3. `test_database_connection_failure_clear_error` - DB connection lost returns 503
4. `test_database_retry_on_transient_failure` - Transient DB errors trigger retry
5. `test_dod_race_condition_handling` - Simultaneous DoD updates handled correctly
6. `test_dod_progress_calculation_race_condition` - Progress accurate during concurrent updates
7. `test_rafael_timeout_handling` - Rafael >10s times out with clear error
8. `test_rafael_timeout_does_not_block_other_requests` - One timeout doesn't block others

**Expected assertions:**
```python
def test_rafael_api_failure_graceful_degradation(client, auth_headers, test_mission):
    with patch('services.rafael.send_to_rafael') as mock_rafael:
        mock_rafael.side_effect = Exception("Rafael API timeout")

        response = client.post(
            f"/api/missions/{test_mission.id}/chat",
            headers=auth_headers,
            json={"message": "How do I deploy?"}
        )

        assert response.status_code == 503  # Not 500!
        assert "unavailable" in response.json().get("detail", "").lower()

def test_dod_race_condition_handling(client, auth_headers, test_mission, test_db):
    # Two requests toggle same DoD item simultaneously
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future1 = executor.submit(toggle_dod_item)
        future2 = executor.submit(toggle_dod_item)

        response1 = future1.result()
        response2 = future2.result()

    # Both succeeded OR one returned 409 Conflict
    success_count = sum([1 for r in [response1, response2] if r.status_code == 200])
    assert success_count >= 1  # At least one succeeded

    # Verify no data corruption
    test_db.refresh(dod_item)
    assert dod_item.completed is True

def test_rafael_timeout_handling(client, auth_headers, test_mission):
    def slow_rafael(message):
        time.sleep(12)  # >10s
        return {"response": "Too late"}

    with patch('services.rafael.send_to_rafael', side_effect=slow_rafael):
        start = time.time()
        response = client.post(f"/api/missions/{test_mission.id}/chat", ...)
        elapsed = time.time() - start

        assert elapsed <= 11  # Timed out after 10s
        assert response.status_code in [408, 503]
```

**Severity:** MEDIUM (≥90% pass rate required)
**Maps to:** AC.md NF1 (Performance), NF2 (Quality), NF4 (Deployment)

---

## Performance Tests

**File:** `backend/tests/test_performance.py`

**Test cases:**
1. `test_mission_list_query_time` - Query ≤200ms for 100 missions
2. `test_chat_message_insert_time` - Insert ≤100ms
3. `test_dod_toggle_time` - Update ≤100ms

**Expected assertions:**
```python
import time

def test_mission_list_query_time(client, auth_headers, seed_100_missions):
    start = time.time()
    response = client.get("/api/missions", headers=auth_headers)
    elapsed = time.time() - start

    assert response.status_code == 200
    assert elapsed < 0.2  # 200ms threshold
```

---

## CI Integration

**GitHub Actions Workflow:** `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: |
          cd backend
          pytest tests/ -v --cov=./ --cov-report=term-missing
      - name: Check coverage
        run: |
          cd backend
          coverage report --fail-under=80
      - name: Run security tests (CRITICAL)
        run: |
          cd backend
          pytest tests/test_security.py -v
          # All 8 security tests must pass (0 failures allowed)
      - name: Run error handling tests
        run: |
          cd backend
          pytest tests/test_error_handling.py -v

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm run test -- --coverage
      - name: Check coverage
        run: |
          cd frontend
          npx jest --coverage --coverageThreshold='{"global":{"lines":80}}'
      - name: Run quality tests (HIGH priority)
        run: |
          cd frontend
          npx playwright test tests/quality.test.ts
          # ≥95% pass rate required
```

**CI Failure Threshold:**
- 0 test failures allowed
- Coverage ≥80% for backend
- Coverage ≥80% for frontend (Week 2, optional Week 1)

---

## Manual Test Scenarios (Week 1)

**Scenario 1: First-Time Login**
1. Navigate to console URL
2. Click [Log In]
3. Complete auth flow (Clerk or JWT)
4. Verify redirect to `/deck`
5. Verify mission list appears

**Expected:** Login completes in ≤3 clicks, mission list loads in <2s

---

**Scenario 2: Chat with Rafael**
1. Select Mission #1
2. Type: "How do I send a Telegram message with inline buttons?"
3. Click [Send]
4. Wait for response
5. Verify response contains Python code
6. Hover over code block → [Copy Code] button appears
7. Click [Copy Code]
8. Paste into text editor → verify code copied correctly

**Expected:** Response arrives in <10s, code formatting correct, copy works

---

**Scenario 3: DoD Progress Tracking**
1. Select Mission #1
2. Switch to DoD tab
3. Check 3 boxes
4. Verify progress updates to "3/11 (27%)"
5. Refresh page
6. Verify checkboxes still checked
7. Click [Mark All Complete]
8. Verify all boxes checked + mission status → "qa"

**Expected:** Checkbox toggles instant, progress updates, persistence works

---

**Scenario 4: Mission Switching**
1. Select Mission #1 → verify "Telegram Notifier" context
2. Select Mission #2 → verify "Landing Page" context
3. Verify DoD checklist different between missions
4. Verify chat history different between missions
5. Use browser back button → verify returns to Mission #1

**Expected:** Switch completes in <1s, data correct per mission

---

**Scenario 5: Responsive Layout (Tablet)**
1. Open console on iPad or resize browser to 768px width
2. Verify left panel collapses to hamburger menu
3. Click hamburger → verify drawer opens
4. Select mission from drawer → verify drawer closes
5. Verify tabs still accessible

**Expected:** No horizontal scroll, drawer works smoothly

---

## Test Data Seed Script

**File:** `backend/scripts/seed_test_data.py`

```python
from sqlalchemy.orm import Session
from models import Mission, DODItem, User
from datetime import datetime, timedelta

def seed_test_data(db: Session):
    # Create test user
    user = User(
        id="user-1",
        email="person1@scopelock.ai",
        name="Person 1"
    )
    db.add(user)

    # Mission 1: Telegram Notifier
    mission1 = Mission(
        id="1",
        title="Telegram Notifier",
        client="Acme Corp",
        budget=300,
        deadline=datetime.now() + timedelta(days=3),
        status="active",
        assigned_to="user-1"
    )
    db.add(mission1)

    # DoD items for Mission 1
    dod_items = [
        DODItem(mission_id="1", text="Bot sends text messages", category="functional"),
        DODItem(mission_id="1", text="Bot sends inline buttons", category="functional"),
        DODItem(mission_id="1", text="Deployed to Render", category="non-functional"),
    ]
    db.add_all(dod_items)

    # Mission 2: Landing Page
    mission2 = Mission(
        id="2",
        title="Landing Page",
        client="Beta Inc",
        budget=450,
        deadline=datetime.now() + timedelta(days=5),
        status="active",
        assigned_to="user-1"
    )
    db.add(mission2)

    db.commit()
```

**Usage:**
```bash
cd backend
python scripts/seed_test_data.py
```

---

## Coverage Thresholds

**Backend:**
- Line coverage: ≥80%
- Branch coverage: ≥70%
- Critical paths (auth, chat, DoD): ≥95%
- **Security tests: 100% pass required** (8 critical tests, 0 failures allowed) ⭐
- **Error handling: ≥90% pass required** (8 tests) ⭐

**Frontend:**
- Component coverage: ≥80%
- Integration coverage: ≥60% (Week 1, ≥80% Week 2)
- **Quality tests: ≥95% pass required** (10 tests) ⭐

**Measurement:**
```bash
# Backend
cd backend
pytest --cov=./ --cov-report=html
open htmlcov/index.html

# Frontend
cd frontend
npm run test -- --coverage
open coverage/lcov-report/index.html
```

---

## Performance Benchmarks

**Tool:** Lighthouse (run against deployed production URL)

**Thresholds:**
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥80 (not critical for internal tool)

**Command:**
```bash
npx lighthouse https://scopelock.mindprotocol.ai/deck --view
```

**If scores below threshold:**
1. Check bundle sizes (JS, CSS)
2. Optimize images (if any)
3. Enable caching headers
4. Minify assets

---

## Test Execution Order

**Pre-Deploy (Local):**
1. Run backend unit tests: `pytest backend/tests/ -v`
2. **Run security tests: `pytest backend/tests/test_security.py -v`** (8 tests, all must pass) ⭐
3. **Run error handling tests: `pytest backend/tests/test_error_handling.py -v`** (8 tests, ≥90%) ⭐
4. Run frontend unit tests: `npm run test`
5. **Run quality tests: `npx playwright test frontend/tests/quality.test.ts`** (10 tests, ≥95%) ⭐
6. Run manual E2E scenarios (5 scenarios above)
7. Verify all pass → proceed to deploy

**Post-Deploy (Production):**
1. Run Lighthouse performance test
2. Manual smoke test (login, select mission, send chat message)
3. **Verify security tests pass on production** (JWT validation, authorization, XSS) ⭐
4. Monitor error logs for 24h
5. If zero critical bugs → AC Green

**CRITICAL:** If any security test fails (test_security.py), **DO NOT DEPLOY**. Mission is NOT AC Green.

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
