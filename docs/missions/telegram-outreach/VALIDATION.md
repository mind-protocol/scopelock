# VALIDATION: Telegram Outreach System

**Mission:** Team Member Hunting via Telegram
**Purpose:** Test specifications mapped to AC.md acceptance criteria
**Date Created:** 2025-11-07

**TDD Workflow:** Sofia (The Checker) generates executable test code (pytest, Playwright) from these specifications BEFORE Rafael starts implementation. Tests define quality criteria; implementation makes tests pass.

---

## Test Framework

**Backend Framework:** pytest 7.4+
**Frontend Framework:** Playwright 1.40+ (E2E for QR code flow)
**Language:** Python (backend), TypeScript (frontend E2E)

**Why these frameworks:**
- **pytest:** Standard for Python testing, excellent async support for Telethon integration, rich fixtures
- **Playwright:** E2E testing for QR code UI flow, supports headless browser, CI-friendly

---

## Test Files Structure

**Backend Location:** `backend/tests/acceptance/telegram_outreach/`

**Structure:**
```
backend/tests/acceptance/telegram_outreach/
├── test_data_ingestion.py          # F1: Import 313 contacts
├── test_qr_authentication.py       # F2: QR code auth flow
├── test_message_generation.py      # F3: Maya AI message generation
├── test_outreach_queue.py          # F4: Queue display and filtering
├── test_manual_send_workflow.py    # F5: Mark as sent
├── test_conversation_monitoring.py # F6: Reply detection
├── test_disconnect_telegram.py     # F7: Session disconnect
├── test_performance.py             # NF1: Performance benchmarks
├── test_security.py                # NF4: Security (encryption, auth)
└── fixtures/
    ├── test_contacts.json          # 10 test contacts for seeding
    ├── mock_telegram_export.json   # Sample Telegram export structure
    └── conftest.py                 # Pytest fixtures (FalkorDB client, etc.)
```

**Frontend Location:** `frontend/tests/integration/telegram-outreach/`

**Structure:**
```
frontend/tests/integration/telegram-outreach/
├── qr-authentication.spec.ts      # E2E: QR code display and scan
├── outreach-queue.spec.ts         # E2E: Queue UI interactions
└── conversation-list.spec.ts      # E2E: Reply notifications
```

---

## Test Scenarios

### F1: Data Ingestion Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_data_ingestion.py`

#### Test 1.1: Import all 313 contacts successfully

**Description:** Verify that data ingestion script creates all 313 U4_Contact_Lead nodes in FalkorDB

**Given:**
- FalkorDB is running and accessible
- `team_members.json` contains 313 contacts
- Graph is empty (no existing U4_Contact_Lead nodes)

**When:** Data ingestion script runs

**Then:** All 313 contacts are imported as graph nodes

**Assertions:**
- [ ] Script completes without errors
- [ ] FalkorDB query `MATCH (c:U4_Contact_Lead) RETURN count(c)` returns 313
- [ ] All nodes have required fields: telegram_id, chat_type, profile_type, scores
- [ ] All nodes have outreach_status = "pending"
- [ ] Script execution time < 60 seconds

**Sofia's Test Code Specification:**
```python
def test_import_all_contacts_successfully():
    # Setup
    clear_falkordb_test_graph()
    contacts_json = load_fixture("team_members.json")

    # Execute
    result = run_data_ingestion_script(contacts_json)

    # Assert
    assert result.success == True
    assert result.imported_count == 313
    assert result.failed_count == 0

    # Query FalkorDB
    count_query = "MATCH (c:U4_Contact_Lead) RETURN count(c) as total"
    total = query_falkordb(count_query)[0]["total"]
    assert total == 313

    # Verify required fields
    sample_query = "MATCH (c:U4_Contact_Lead) RETURN c LIMIT 1"
    sample_node = query_falkordb(sample_query)[0]["c"]
    assert "telegram_id" in sample_node
    assert "chat_type" in sample_node
    assert "profile_type" in sample_node
    assert sample_node["outreach_status"] == "pending"
```

---

#### Test 1.2: Handle duplicate telegram_ids (update, don't duplicate)

**Description:** Verify that re-importing same contact updates existing node instead of creating duplicate

**Given:** Contact with telegram_id=7944133972 already exists in FalkorDB

**When:** Data ingestion script runs again with same contact

**Then:** Node is updated, total count remains 313 (no duplicate)

**Assertions:**
- [ ] Node count remains 313 after re-import
- [ ] Existing node updated (e.g., updated_at timestamp changes)
- [ ] No duplicate nodes with same telegram_id

**Sofia's Test Code Specification:**
```python
def test_handle_duplicate_telegram_ids():
    # Setup
    clear_falkordb_test_graph()
    contacts_json = load_fixture("team_members.json")

    # First import
    run_data_ingestion_script(contacts_json)
    count_before = count_contact_leads()

    # Second import (should update, not duplicate)
    run_data_ingestion_script(contacts_json)
    count_after = count_contact_leads()

    # Assert
    assert count_before == 313
    assert count_after == 313  # No duplicates

    # Verify specific contact not duplicated
    dup_check = """
        MATCH (c:U4_Contact_Lead {telegram_id: 7944133972})
        RETURN count(c) as dup_count
    """
    result = query_falkordb(dup_check)[0]["dup_count"]
    assert result == 1  # Only one node, not two
```

---

#### Test 1.3: Preserve matching_messages array from analysis

**Description:** Verify that matching_messages array is stored correctly in analysis_data field

**Given:** Contact has matching_messages array with 10 message references

**When:** Contact is imported

**Then:** analysis_data JSON field contains matching_messages array intact

**Assertions:**
- [ ] analysis_data field exists
- [ ] analysis_data.matching_messages is array with length > 0
- [ ] Each message has: message_id, date, text_snippet, signal_type

**Sofia's Test Code Specification:**
```python
def test_preserve_matching_messages_array():
    # Setup
    contact_with_messages = {
        "telegram_id": 7944133972,
        "name": "Liam",
        "matching_messages": [
            {"message_id": 123, "date": "2024-11-01", "text_snippet": "Completed 100 retweets", "signal_type": "hustler"},
            {"message_id": 124, "date": "2024-11-02", "text_snippet": "Ready for more tasks", "signal_type": "hustler"}
        ]
    }

    # Execute
    import_single_contact(contact_with_messages)

    # Query FalkorDB
    query = "MATCH (c:U4_Contact_Lead {telegram_id: 7944133972}) RETURN c.analysis_data as data"
    result = query_falkordb(query)[0]["data"]

    # Assert
    assert "matching_messages" in result
    assert len(result["matching_messages"]) == 2
    assert result["matching_messages"][0]["message_id"] == 123
    assert result["matching_messages"][0]["signal_type"] == "hustler"
```

---

### F2: QR Code Authentication Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_qr_authentication.py`

#### Test 2.1: Generate valid QR code

**Description:** Verify that POST /api/outreach/telegram/qr-start generates valid QR code image

**Given:** Team member is authenticated (valid session token)

**When:** POST /api/outreach/telegram/qr-start is called

**Then:** Response contains base64 QR code image and token

**Assertions:**
- [ ] HTTP 200 response
- [ ] Response has "qr_code" field (base64 PNG)
- [ ] Response has "token" field (hex string)
- [ ] Response has "expires_in" field (120 seconds)
- [ ] QR code image is valid PNG (can be decoded)

**Sofia's Test Code Specification:**
```python
async def test_generate_valid_qr_code():
    # Setup
    team_member_token = create_test_auth_token("test_member_123")

    # Execute
    response = await api_client.post(
        "/api/outreach/telegram/qr-start",
        headers={"Authorization": f"Bearer {team_member_token}"}
    )

    # Assert
    assert response.status_code == 200
    data = response.json()

    assert "qr_code" in data
    assert data["qr_code"].startswith("data:image/png;base64,")

    assert "token" in data
    assert len(data["token"]) == 64  # 32 bytes hex = 64 chars

    assert "expires_in" in data
    assert data["expires_in"] == 120

    # Verify QR code is valid PNG
    base64_data = data["qr_code"].split(",")[1]
    img_bytes = base64.b64decode(base64_data)
    img = Image.open(io.BytesIO(img_bytes))
    assert img.format == "PNG"
```

---

#### Test 2.2: QR code expires after 120 seconds

**Description:** Verify that QR code token expires and polling returns error

**Given:** QR code generated with token

**When:** 121 seconds elapse without scan

**Then:** GET /api/outreach/telegram/qr-check/{token} returns expired error

**Assertions:**
- [ ] Before 120s: status = "pending"
- [ ] After 120s: status = "expired"
- [ ] HTTP 410 Gone status code

**Sofia's Test Code Specification:**
```python
async def test_qr_code_expires_after_120_seconds():
    # Setup
    response = await start_qr_auth("test_member_123")
    token = response["token"]

    # Check immediately (should be pending)
    check_response = await api_client.get(f"/api/outreach/telegram/qr-check/{token}")
    assert check_response.status_code == 200
    assert check_response.json()["status"] == "pending"

    # Simulate 121 seconds passing
    await asyncio.sleep(121)  # In real test, mock time instead

    # Check after expiry
    expired_response = await api_client.get(f"/api/outreach/telegram/qr-check/{token}")
    assert expired_response.status_code == 410  # Gone
    assert expired_response.json()["status"] == "expired"
```

---

#### Test 2.3: Session authorized successfully

**Description:** Verify that after QR scan, session is created and encrypted in FalkorDB

**Given:** QR code generated, user scans QR in Telegram app

**When:** Telegram authorization callback received

**Then:** U4_Telegram_Session node created with encrypted session_string

**Assertions:**
- [ ] U4_Telegram_Session node created
- [ ] session_string field is encrypted (not plain text)
- [ ] authorized_by = team member ref
- [ ] is_active = true
- [ ] is_monitoring = true
- [ ] Session string can be decrypted and used

**Sofia's Test Code Specification:**
```python
async def test_session_authorized_successfully():
    # Setup
    qr_response = await start_qr_auth("test_member_123")
    token = qr_response["token"]

    # Simulate Telegram authorization (mock Telethon callback)
    await simulate_telegram_qr_scan(token)

    # Poll for authorization
    check_response = await api_client.get(f"/api/outreach/telegram/qr-check/{token}")
    assert check_response.status_code == 200
    assert check_response.json()["status"] == "authorized"

    # Query FalkorDB for session node
    query = "MATCH (s:U4_Telegram_Session {authorized_by: 'test_member_123'}) RETURN s"
    session_node = query_falkordb(query)[0]["s"]

    # Assert
    assert session_node["is_active"] == True
    assert session_node["is_monitoring"] == True
    assert "session_string" in session_node

    # Verify encryption (session string should not be plain text)
    assert not session_node["session_string"].startswith("1")  # Telethon sessions start with version number

    # Verify can decrypt
    decrypted = decrypt_session_string(session_node["session_string"])
    assert decrypted.startswith("1")  # Valid Telethon session format
```

---

### F3: Message Generation Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_message_generation.py`

#### Test 3.1: Generate personalized message with hook

**Description:** Verify that Maya AI generates message referencing contact's actual activity

**Given:** Contact with matching_messages containing "Completed 100 retweets for UBC"

**When:** POST /api/outreach/generate-message/{contact_id}

**Then:** Generated message includes reference to retweets activity

**Assertions:**
- [ ] HTTP 200 response
- [ ] Response has "message_text" field
- [ ] Message length < 500 characters
- [ ] Message includes personalization (name, specific activity)
- [ ] Message includes ScopeLock value prop
- [ ] Message includes clear CTA
- [ ] U4_Outreach_Message node created in FalkorDB
- [ ] Generation time < 5 seconds

**Sofia's Test Code Specification:**
```python
async def test_generate_personalized_message_with_hook():
    # Setup
    contact_id = create_test_contact_with_activity({
        "telegram_id": 7944133972,
        "name": "Liam",
        "profile_type": "hustler",
        "matching_messages": [
            {"text_snippet": "Completed 100 retweets for UBC", "signal_type": "hustler"}
        ]
    })

    # Execute with timing
    start_time = time.time()
    response = await api_client.post(f"/api/outreach/generate-message/{contact_id}")
    duration = time.time() - start_time

    # Assert timing
    assert duration < 5.0  # < 5 seconds

    # Assert response
    assert response.status_code == 200
    data = response.json()

    assert "message_text" in data
    message = data["message_text"]
    assert len(message) < 500

    # Check personalization
    assert "Liam" in message or "you" in message.lower()
    assert "retweet" in message.lower()  # References activity

    # Check ScopeLock value prop mentioned
    assert "scopelock" in message.lower() or "team" in message.lower()

    # Check has CTA
    assert ("?" in message and "interested" in message.lower()) or "let me know" in message.lower()

    # Verify FalkorDB node created
    query = f"""
        MATCH (m:U4_Outreach_Message)-[:HAS_MESSAGE]->(c:U4_Contact_Lead {{telegram_id: 7944133972}})
        RETURN m
    """
    message_node = query_falkordb(query)[0]["m"]
    assert message_node["generated_by"] == "maya"
    assert message_node["is_sent"] == False
```

---

#### Test 3.2: Fallback to generic template on Maya timeout

**Description:** Verify that if Maya AI times out (>10s), system uses generic template

**Given:** Maya AI service is slow (simulated timeout)

**When:** POST /api/outreach/generate-message/{contact_id}

**Then:** Generic template returned with warning

**Assertions:**
- [ ] Response within 12 seconds (10s timeout + 2s buffer)
- [ ] Response has "message_text" with generic template
- [ ] Response has "warning" field indicating fallback
- [ ] Message is still valid (name, CTA, etc.)

**Sofia's Test Code Specification:**
```python
async def test_fallback_to_generic_template_on_maya_timeout():
    # Setup
    contact_id = create_test_contact_basic()

    # Mock Maya AI to timeout
    with mock_maya_timeout(delay_seconds=11):
        start_time = time.time()
        response = await api_client.post(f"/api/outreach/generate-message/{contact_id}")
        duration = time.time() - start_time

    # Assert timing (should not wait forever)
    assert duration < 12.0  # 10s timeout + buffer

    # Assert fallback used
    assert response.status_code == 200
    data = response.json()

    assert "warning" in data
    assert "fallback" in data["warning"].lower() or "timeout" in data["warning"].lower()

    # Message should still be valid
    message = data["message_text"]
    assert len(message) > 50  # Not empty
    assert len(message) < 500
```

---

### F4: Outreach Queue Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_outreach_queue.py`

#### Test 4.1: Display pending contacts sorted by score

**Description:** Verify that queue displays contacts sorted by supervisor_score + hustler_score descending

**Given:** 10 test contacts with varying scores

**When:** GET /api/outreach/queue

**Then:** Contacts returned in descending score order

**Assertions:**
- [ ] HTTP 200 response
- [ ] Response contains array of contacts
- [ ] Contacts sorted by (supervisor_score + hustler_score) DESC
- [ ] Each contact has: name, profile_type, scores, top_signals
- [ ] Response time < 1 second

**Sofia's Test Code Specification:**
```python
async def test_display_pending_contacts_sorted_by_score():
    # Setup: Create contacts with known scores
    create_test_contact({"name": "High Score", "supervisor_score": 10, "hustler_score": 10})  # Total: 20
    create_test_contact({"name": "Medium Score", "supervisor_score": 5, "hustler_score": 8})  # Total: 13
    create_test_contact({"name": "Low Score", "supervisor_score": 2, "hustler_score": 3})    # Total: 5

    # Execute
    start_time = time.time()
    response = await api_client.get("/api/outreach/queue")
    duration = time.time() - start_time

    # Assert timing
    assert duration < 1.0

    # Assert response
    assert response.status_code == 200
    contacts = response.json()["contacts"]

    assert len(contacts) == 3
    assert contacts[0]["name"] == "High Score"
    assert contacts[1]["name"] == "Medium Score"
    assert contacts[2]["name"] == "Low Score"

    # Verify sorting
    scores = [c["supervisor_score"] + c["hustler_score"] for c in contacts]
    assert scores == sorted(scores, reverse=True)
```

---

#### Test 4.2: Filter by profile type

**Description:** Verify that queue can be filtered by profile_type

**Given:** Contacts with profile_type "supervisor" and "hustler"

**When:** GET /api/outreach/queue?profile_type=hustler

**Then:** Only hustler contacts returned

**Assertions:**
- [ ] Response contains only contacts with profile_type="hustler"
- [ ] No supervisor contacts in response

**Sofia's Test Code Specification:**
```python
async def test_filter_by_profile_type():
    # Setup
    create_test_contact({"name": "Supervisor 1", "profile_type": "supervisor"})
    create_test_contact({"name": "Hustler 1", "profile_type": "hustler"})
    create_test_contact({"name": "Hustler 2", "profile_type": "hustler"})

    # Execute
    response = await api_client.get("/api/outreach/queue?profile_type=hustler")

    # Assert
    assert response.status_code == 200
    contacts = response.json()["contacts"]

    assert len(contacts) == 2
    for contact in contacts:
        assert contact["profile_type"] == "hustler"
```

---

### F5: Manual Send Workflow Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_manual_send_workflow.py`

#### Test 5.1: Mark message as sent updates contact status

**Description:** Verify that marking message as sent updates contact to "contacted" status

**Given:** Contact with generated message, outreach_status="pending"

**When:** POST /api/outreach/mark-sent with contact_id and message_id

**Then:** Contact status updated to "contacted", message marked sent

**Assertions:**
- [ ] HTTP 200 response
- [ ] U4_Contact_Lead outreach_status = "contacted"
- [ ] U4_Contact_Lead contacted_at timestamp set
- [ ] U4_Outreach_Message is_sent = true
- [ ] U4_Outreach_Message sent_at timestamp set
- [ ] Contact removed from pending queue

**Sofia's Test Code Specification:**
```python
async def test_mark_message_as_sent_updates_contact_status():
    # Setup
    contact_id = create_test_contact({"outreach_status": "pending"})
    message_id = create_test_message(contact_id, is_sent=False)

    # Execute
    response = await api_client.post("/api/outreach/mark-sent", json={
        "contact_id": contact_id,
        "message_id": message_id
    })

    # Assert response
    assert response.status_code == 200

    # Query FalkorDB for contact
    contact_query = f"MATCH (c:U4_Contact_Lead {{slug: '{contact_id}'}}) RETURN c"
    contact = query_falkordb(contact_query)[0]["c"]

    assert contact["outreach_status"] == "contacted"
    assert "contacted_at" in contact

    # Query FalkorDB for message
    message_query = f"MATCH (m:U4_Outreach_Message {{slug: '{message_id}'}}) RETURN m"
    message = query_falkordb(message_query)[0]["m"]

    assert message["is_sent"] == True
    assert "sent_at" in message

    # Verify not in pending queue
    queue_response = await api_client.get("/api/outreach/queue")
    queue_ids = [c["id"] for c in queue_response.json()["contacts"]]
    assert contact_id not in queue_ids
```

---

### F6: Conversation Monitoring Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_conversation_monitoring.py`

#### Test 6.1: Detect reply within 120 seconds

**Description:** Verify that background worker detects new Telegram reply within 120 seconds

**Given:** Monitoring active for contacted conversation

**When:** Contact sends Telegram reply

**Then:** Reply detected within 120 seconds, U4_Telegram_Reply node created

**Assertions:**
- [ ] Background worker polls every 60 seconds
- [ ] New message detected in poll
- [ ] U4_Telegram_Reply node created
- [ ] Reply has: telegram_message_id, message_text, received_at
- [ ] REPLY_TO relationship created to U4_Outreach_Message
- [ ] Contact status updated to "replied"
- [ ] Detection latency < 120 seconds (p95)

**Sofia's Test Code Specification:**
```python
async def test_detect_reply_within_120_seconds():
    # Setup
    contact_id = create_test_contact({"outreach_status": "contacted"})
    session = create_test_telegram_session()

    # Start monitoring
    start_monitoring_for_contact(contact_id, session)

    # Simulate contact sending reply (mock Telethon)
    reply_text = "Yes, I'm interested!"
    reply_msg_id = 99999
    with mock_telegram_reply(contact_id, reply_msg_id, reply_text):
        # Wait for detection (max 2 poll cycles = 120s)
        # In real test, mock time to speed up
        await wait_for_reply_detection(contact_id, timeout=120)

    # Assert reply detected
    reply_query = f"""
        MATCH (r:U4_Telegram_Reply)-[:REPLY_TO]-(m:U4_Outreach_Message)-[:HAS_MESSAGE]-(c:U4_Contact_Lead {{slug: '{contact_id}'}})
        RETURN r
    """
    reply_node = query_falkordb(reply_query)[0]["r"]

    assert reply_node["telegram_message_id"] == 99999
    assert reply_node["message_text"] == "Yes, I'm interested!"
    assert "received_at" in reply_node

    # Assert contact status updated
    contact_query = f"MATCH (c:U4_Contact_Lead {{slug: '{contact_id}'}}) RETURN c"
    contact = query_falkordb(contact_query)[0]["c"]
    assert contact["outreach_status"] == "replied"
```

---

### F7: Disconnect Telegram Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_disconnect_telegram.py`

#### Test 7.1: Disconnect invalidates session and stops monitoring

**Description:** Verify that disconnect revokes Telegram session and stops background monitoring

**Given:** Active Telegram session with monitoring enabled

**When:** POST /api/outreach/telegram/disconnect

**Then:** Session invalidated, monitoring stopped

**Assertions:**
- [ ] HTTP 200 response
- [ ] U4_Telegram_Session is_active = false
- [ ] U4_Telegram_Session is_monitoring = false
- [ ] disconnected_at timestamp set
- [ ] Background worker stops polling for this session
- [ ] Telethon session logged out

**Sofia's Test Code Specification:**
```python
async def test_disconnect_invalidates_session_and_stops_monitoring():
    # Setup
    team_member_id = "test_member_123"
    session = create_active_telegram_session(team_member_id)

    # Verify monitoring active before
    assert is_monitoring_active(session["slug"]) == True

    # Execute disconnect
    response = await api_client.post("/api/outreach/telegram/disconnect", json={
        "session_id": session["slug"]
    })

    # Assert response
    assert response.status_code == 200

    # Query FalkorDB for session
    session_query = f"MATCH (s:U4_Telegram_Session {{slug: '{session['slug']}'}}) RETURN s"
    updated_session = query_falkordb(session_query)[0]["s"]

    assert updated_session["is_active"] == False
    assert updated_session["is_monitoring"] == False
    assert "disconnected_at" in updated_session

    # Verify monitoring stopped
    await asyncio.sleep(2)  # Give worker time to process
    assert is_monitoring_active(session["slug"]) == False
```

---

## Performance Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_performance.py`

### Performance Test 1: API Queue Response Time

**Benchmark:** Queue endpoint must respond in ≤ 500ms (p95) for 313 contacts

**Test:**
1. Import 313 contacts to FalkorDB
2. Execute GET /api/outreach/queue 100 times
3. Measure response time for each request
4. Calculate p95 latency
5. Assert p95 ≤ 500ms

**Sofia's Test Code Specification:**
```python
async def test_api_queue_response_time():
    # Setup
    import_313_test_contacts()

    # Execute 100 requests
    response_times = []
    for i in range(100):
        start = time.time()
        response = await api_client.get("/api/outreach/queue")
        duration = time.time() - start
        response_times.append(duration)
        assert response.status_code == 200

    # Calculate p95
    p95 = numpy.percentile(response_times, 95)

    # Assert
    assert p95 <= 0.5  # 500ms
    print(f"p95 latency: {p95*1000:.0f}ms")
```

---

### Performance Test 2: Message Generation Response Time

**Benchmark:** Message generation must complete in ≤ 5 seconds (p95)

**Test:**
1. Create 50 test contacts with varied data
2. Generate message for each contact
3. Measure generation time
4. Calculate p95
5. Assert p95 ≤ 5 seconds

**Sofia's Test Code Specification:**
```python
async def test_message_generation_response_time():
    # Setup
    contact_ids = [create_test_contact() for _ in range(50)]

    # Execute generation for all contacts
    generation_times = []
    for contact_id in contact_ids:
        start = time.time()
        response = await api_client.post(f"/api/outreach/generate-message/{contact_id}")
        duration = time.time() - start
        generation_times.append(duration)
        assert response.status_code == 200

    # Calculate p95
    p95 = numpy.percentile(generation_times, 95)

    # Assert
    assert p95 <= 5.0  # 5 seconds
    print(f"p95 generation time: {p95:.1f}s")
```

---

### Performance Test 3: Background Monitoring Cycle Time

**Benchmark:** Polling cycle must complete in ≤ 10 seconds per session

**Test:**
1. Create active session with 20 monitored conversations
2. Execute one polling cycle
3. Measure cycle duration
4. Assert duration ≤ 10 seconds

**Sofia's Test Code Specification:**
```python
async def test_background_monitoring_cycle_time():
    # Setup
    session = create_active_telegram_session()
    create_20_monitored_conversations(session)

    # Execute one polling cycle
    start = time.time()
    await run_monitoring_cycle(session["slug"])
    duration = time.time() - start

    # Assert
    assert duration <= 10.0  # 10 seconds
    print(f"Cycle duration: {duration:.1f}s")
```

---

## Security Tests

**File:** `backend/tests/acceptance/telegram_outreach/test_security.py`

### Security Test 1: Session string encryption round-trip

**Description:** Verify that session strings are encrypted before storage and can be decrypted

**Test:**
1. Generate test Telethon session string
2. Encrypt with Fernet
3. Store in FalkorDB
4. Retrieve from FalkorDB
5. Decrypt
6. Verify decrypted matches original

**Sofia's Test Code Specification:**
```python
def test_session_string_encryption_roundtrip():
    # Setup
    original_session = "1AZWarzEBu7HBhpkSUB3zQAAAABYRmUs6gLGdH..." # Sample Telethon session

    # Encrypt
    encrypted = encrypt_session_string(original_session)

    # Verify encrypted is different from original
    assert encrypted != original_session

    # Store in FalkorDB
    create_session_node(encrypted_session_string=encrypted)

    # Retrieve
    query = "MATCH (s:U4_Telegram_Session) RETURN s.session_string as session_string LIMIT 1"
    retrieved_encrypted = query_falkordb(query)[0]["session_string"]

    # Decrypt
    decrypted = decrypt_session_string(retrieved_encrypted)

    # Assert
    assert decrypted == original_session
```

---

### Security Test 2: Session string never logged or exposed in API

**Description:** Verify that session strings never appear in logs or API responses

**Test:**
1. Create session via QR auth
2. Capture all log output
3. Capture API response
4. Assert session string not in logs or response

**Sofia's Test Code Specification:**
```python
async def test_session_string_never_logged_or_exposed():
    # Setup logging capture
    with captured_logs() as log_output:
        # Create session
        qr_response = await start_qr_auth("test_member_123")
        token = qr_response["token"]
        await simulate_telegram_qr_scan(token)

        # Check authorization endpoint
        check_response = await api_client.get(f"/api/outreach/telegram/qr-check/{token}")

        # Get logs
        logs = log_output.getvalue()

        # Query session from FalkorDB
        session_query = "MATCH (s:U4_Telegram_Session) RETURN s.session_string LIMIT 1"
        actual_session_string = query_falkordb(session_query)[0]["session_string"]

        # Decrypt to get raw session
        raw_session = decrypt_session_string(actual_session_string)

        # Assert session string NOT in logs
        assert raw_session not in logs
        assert actual_session_string not in logs

        # Assert session string NOT in API response
        response_text = json.dumps(check_response.json())
        assert raw_session not in response_text
        assert actual_session_string not in response_text
```

---

## CI Integration

**CI Provider:** GitHub Actions (or existing ScopeLock CI)

**Test Command:**
```bash
# Backend acceptance tests
cd backend
pytest tests/acceptance/telegram_outreach/ -v --junitxml=test-results.xml

# Frontend E2E tests
cd frontend
npx playwright test tests/integration/telegram-outreach/ --reporter=junit

# Performance benchmarks
cd backend
python tests/performance/benchmark_telegram_outreach.py --output=perf-results.json
```

**Failure Threshold:** 0 test failures allowed

**Performance Gate:** All benchmarks must pass (p95 thresholds met)

---

## Configuration

**Test Environment:**
- Database: FalkorDB test instance (separate from production)
- API: FastAPI dev server (localhost:8000)
- Frontend: Next.js dev server (localhost:3000) for E2E tests
- Telegram: Mock Telethon client (no real Telegram API calls in tests)

**Environment Variables:**
```
FALKORDB_API_URL=https://test.falkordb.api/admin/query
FALKORDB_API_KEY=test_api_key_xxxxx
GRAPH_NAME=scopelock_test
FERNET_ENCRYPTION_KEY=test_encryption_key_32_bytes_xxxx
TELEGRAM_API_ID=12345  # Test credentials
TELEGRAM_API_HASH=test_hash_xxxx
MAYA_AI_ENDPOINT=http://localhost:9000/generate  # Mock Maya service
```

---

## Test Data Management

**Seed Script:** `backend/tests/fixtures/seed_telegram_outreach_test_data.py`

**Setup:**
```bash
# Clear test graph
python backend/tests/fixtures/clear_test_graph.py

# Seed 10 test contacts
python backend/tests/fixtures/seed_telegram_outreach_test_data.py

# Verify seeded
python backend/tests/fixtures/verify_test_data.py
```

**Teardown:**
```bash
# Clear test graph after tests
python backend/tests/fixtures/clear_test_graph.py
```

---

## Coverage Requirements

**Overall Coverage:** ≥ 75% code coverage for Telegram outreach module

**Critical Paths Coverage:**
- QR authentication flow: ≥ 90%
- Session encryption/decryption: ≥ 95%
- Message generation: ≥ 80%
- Background monitoring worker: ≥ 85%

---

## Test Execution

### Run All Tests

```bash
cd backend
pytest tests/acceptance/telegram_outreach/ -v
```

---

### Run Specific Test Suite

```bash
# Run only QR auth tests
pytest tests/acceptance/telegram_outreach/test_qr_authentication.py -v

# Run only performance tests
pytest tests/acceptance/telegram_outreach/test_performance.py -v

# Run with coverage report
pytest tests/acceptance/telegram_outreach/ --cov=app.api.outreach --cov-report=html
```

---

### Run in Watch Mode (Local Development)

```bash
# Using pytest-watch
cd backend
ptw tests/acceptance/telegram_outreach/ -- -v
```

---

## Debugging Failed Tests

**Enable verbose output:**
```bash
# pytest with verbose and print statements
pytest tests/acceptance/telegram_outreach/ -v -s

# pytest with debug logging
pytest tests/acceptance/telegram_outreach/ -v --log-cli-level=DEBUG
```

**Test artifacts:**
- Logs: `backend/tests/logs/test_run_TIMESTAMP.log`
- Performance results: `backend/tests/performance/results/`
- Mock data: `backend/tests/fixtures/mock_telegram_responses.json`

---

## Success Criteria

Tests are considered passing when:
- ✅ All functional tests green (17/17 pass rate)
- ✅ All performance benchmarks met (p95 thresholds)
- ✅ Code coverage ≥ 75% overall, ≥ 90% for auth/encryption
- ✅ Zero flaky tests (consistent results across 3 runs)
- ✅ No session strings logged or exposed (security tests pass)

---

## Notes

**Mock Strategy:**

Since these are acceptance tests running without real Telegram API access, we need mocks for:

1. **Telethon Client:** Mock QR code generation, authorization callback, message polling
2. **Maya AI Service:** Mock message generation (either local service or mock responses)
3. **FalkorDB:** Use real test instance, but isolated graph name

**Real vs Mock:**

- **Real FalkorDB:** Yes (test instance with separate graph)
- **Real Telegram API:** No (mocked Telethon)
- **Real Maya AI:** Optional (can use mock or actual test instance)
- **Real Frontend:** Yes for E2E (Playwright tests)

**Test Data Fixtures:**

All test contacts should have realistic data matching actual Telegram export structure:
- telegram_id: 1000001-1000010 (test range)
- Varied profile types (supervisor, hustler, both)
- Varied scores (0-15 range)
- matching_messages arrays with sample activity

Sofia will create these fixtures as part of test suite generation.
