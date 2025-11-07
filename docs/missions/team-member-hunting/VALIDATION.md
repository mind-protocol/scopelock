# VALIDATION: Team Member Hunting (Telegram Outreach System)

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Test specifications for Telegram outreach system (313 contacts, Maya generation, Telethon monitoring)

---

## Test Framework

**Backend:**
- **Framework:** pytest 7.4+
- **Coverage Tool:** pytest-cov
- **Async Testing:** pytest-asyncio (for Telethon worker tests)
- **Mocking:** pytest-mock, responses (for external API calls)
- **Location:** `backend/tests/outreach/`

**Frontend:**
- **Framework:** Vitest 1.0+ (with React Testing Library)
- **Coverage Tool:** v8 (built into Vitest)
- **Location:** `frontend/tests/outreach/`

**E2E:**
- **Framework:** Playwright 1.40+
- **Browsers:** Chromium, Firefox, WebKit
- **Location:** `frontend/tests/e2e/`

**Performance:**
- **Framework:** k6 (load testing)
- **Location:** `backend/tests/load/`

---

## Test Files Structure

```
backend/tests/outreach/
├── test_message_generator.py        # Maps to AC.md F2 (Maya generation)
├── test_telegram_reader.py          # Maps to AC.md F4-F5 (session + monitoring)
├── test_outreach_tracker.py         # Maps to AC.md F3, F7 (send tracking, status)
├── test_api_endpoints.py            # Maps to all API routes
├── test_metrics_calculator.py       # Maps to AC.md F8 (metrics dashboard)
└── fixtures/
    ├── contact_analysis.json         # 5 sample contacts from team_members.json
    └── telegram_session_mock.py      # Mock Telethon session

frontend/tests/outreach/
├── contact-queue.test.tsx           # Maps to AC.md F1 (queue display)
├── message-generation.test.tsx      # Maps to AC.md F2 (Maya UI)
├── send-workflow.test.tsx           # Maps to AC.md F3 (copy + mark sent)
├── reply-notifications.test.tsx     # Maps to AC.md F6 (notifications)
├── metrics-dashboard.test.tsx       # Maps to AC.md F8 (metrics UI)
└── contact-profile.test.tsx         # Maps to AC.md F9 (profile view)

frontend/tests/e2e/
├── outreach-flow.spec.ts            # Complete workflow (generate → send → reply)
└── reply-detection-flow.spec.ts     # Reply monitoring end-to-end

backend/tests/load/
└── outreach-load.js                 # k6 performance tests
```

---

## Backend Tests (pytest)

### test_message_generator.py (Maya Personalization)

**Covers:** AC.md F2 (Message Generation)

**Test Cases:**

#### 1. `test_generate_hustler_message_includes_personalization`
```python
def test_generate_hustler_message_includes_personalization():
    """Generated message for hustler profile references specific signal."""
    # Setup
    contact = create_contact(
        name="Liam",
        profile_type="hustler",
        hustler_score=15,
        supervisor_score=1,
        signals=["voice_ai", "productivity_tools"],
        matching_messages=[{
            "text": "Just launched a voice AI demo...",
            "date": "2024-10-15",
            "score": 8.5
        }]
    )

    # Action
    message = generate_outreach_message(contact.id)

    # Assertions
    assert message is not None
    assert "Liam" in message  # Personal name
    assert "voice AI" in message or "voice_ai" in message  # Signal reference
    assert "hustler" in message.lower() or "find jobs" in message.lower()  # Role reference
    assert "ScopeLock" in message  # Brand mention
    assert len(message.split()) >= 80  # Minimum length (80 words)
    assert len(message.split()) <= 150  # Maximum length (150 words)

    # Verify FalkorDB logging
    events = query_graph("""
        MATCH (e:U4_Event {event_kind: 'message_generated'})
        WHERE e.contact_id = $contact_id
        RETURN e
    """, {"contact_id": contact.id})
    assert len(events) == 1
    assert events[0]["generated_by"] == "maya"
```

#### 2. `test_generate_supervisor_message_includes_code_review_context`
```python
def test_generate_supervisor_message_includes_code_review_context():
    """Generated message for supervisor profile emphasizes code review."""
    # Setup
    contact = create_contact(
        name="Alex",
        profile_type="supervisor",
        supervisor_score=22,
        hustler_score=3,
        signals=["code_review", "architecture", "testing"],
        matching_messages=[{
            "text": "Great PR feedback on the auth refactor...",
            "date": "2024-10-22",
            "score": 9.2
        }]
    )

    # Action
    message = generate_outreach_message(contact.id)

    # Assertions
    assert "Alex" in message
    assert any(word in message.lower() for word in ["code review", "mentor", "architecture", "guide"])
    assert "Rafael" in message  # AI code generator mention
    assert "ScopeLock" in message

    # Verify different messaging than hustler
    hustler_contact = create_contact(name="Liam", profile_type="hustler")
    hustler_message = generate_outreach_message(hustler_contact.id)
    assert "find jobs" in hustler_message.lower() or "proposal" in hustler_message.lower()
    assert "find jobs" not in message.lower()  # Supervisor message shouldn't mention job hunting
```

#### 3. `test_message_generation_under_5_seconds`
```python
@pytest.mark.timeout(5)
def test_message_generation_under_5_seconds():
    """Message generation completes in <5 seconds (p95 requirement)."""
    # Setup
    contact = create_contact(name="Test", profile_type="hustler")

    # Action
    start = time.time()
    message = generate_outreach_message(contact.id)
    duration = time.time() - start

    # Assertions
    assert message is not None
    assert duration < 5.0  # p95 threshold from NF1
```

#### 4. `test_message_generation_fails_gracefully_on_api_error`
```python
def test_message_generation_fails_gracefully_on_api_error():
    """If Maya API fails, error is logged and re-raised (fail-loud)."""
    # Setup: Mock Claude API to return error
    with responses.RequestsMock() as rsps:
        rsps.add(
            responses.POST,
            "https://api.anthropic.com/v1/messages",
            status=500,
            json={"error": "Internal server error"}
        )

        contact = create_contact(name="Test", profile_type="hustler")

        # Action & Assertion
        with pytest.raises(MessageGenerationError) as exc_info:
            generate_outreach_message(contact.id)

        # Verify failure event emitted
        events = query_graph("""
            MATCH (e:U4_Event {event_kind: 'failure.emit'})
            WHERE e.location CONTAINS 'message_generator.py'
            RETURN e
        """)
        assert len(events) == 1
        assert "Claude API error" in events[0]["reason"]
```

#### 5. `test_no_generic_templates_allowed`
```python
def test_no_generic_templates_allowed():
    """Every message MUST reference contact-specific data (no generic spam)."""
    # Setup
    contacts = [
        create_contact(name="Liam", signals=["voice_ai"]),
        create_contact(name="Alex", signals=["code_review"]),
        create_contact(name="Emma", signals=["productivity_tools"])
    ]

    # Action
    messages = [generate_outreach_message(c.id) for c in contacts]

    # Assertions
    assert len(set(messages)) == 3  # All messages MUST be unique
    assert "voice_ai" in messages[0] or "voice AI" in messages[0]
    assert "code review" in messages[1] or "code_review" in messages[1]
    assert "productivity" in messages[2] or "productivity_tools" in messages[2]
```

#### 6. `test_message_generation_with_no_signals_shows_warning`
```python
def test_message_generation_with_no_signals_shows_warning():
    """If contact has no signals, generation proceeds but flags low quality."""
    # Setup
    contact = create_contact(
        name="Unknown",
        signals=[],  # No signals
        matching_messages=[]
    )

    # Action
    result = generate_outreach_message(contact.id, return_metadata=True)

    # Assertions
    assert result["message"] is not None
    assert result["warning"] == "Limited data available - message may be generic"
    assert result["confidence"] < 0.5  # Low confidence score
```

**Target Coverage:** ≥95% for `services/outreach/message_generator.py`

---

### test_telegram_reader.py (Telethon Monitoring)

**Covers:** AC.md F4-F5 (Session Connection + Reply Detection)

**Test Cases:**

#### 1. `test_telethon_session_creation_and_encryption`
```python
@pytest.mark.asyncio
async def test_telethon_session_creation_and_encryption():
    """Session created, encrypted with Fernet, stored in FalkorDB."""
    # Setup: Mock Telethon auth flow
    with patch('telethon.TelegramClient') as mock_client:
        mock_client.return_value.start.return_value = asyncio.coroutine(lambda: True)()

        # Action
        session_data = await create_telegram_session(
            phone="+1234567890",
            code="12345"  # Mock 2FA code
        )

        # Assertions
        assert session_data["is_encrypted"] is True
        assert "encrypted_session" in session_data
        assert session_data["encryption_key_id"] is not None

        # Verify session stored in FalkorDB
        conversations = query_graph("""
            MATCH (conv:U4_Telegram_Conversation)
            WHERE conv.phone = '+1234567890'
            RETURN conv
        """)
        assert len(conversations) == 1
        assert conversations[0]["telegram_session_data"] is not None

        # Verify session is encrypted (cannot be decoded without key)
        encrypted_blob = conversations[0]["telegram_session_data"]
        with pytest.raises(Exception):
            # Should fail without decryption key
            json.loads(encrypted_blob)
```

#### 2. `test_reply_detection_within_60_seconds`
```python
@pytest.mark.asyncio
async def test_reply_detection_within_60_seconds():
    """Background worker detects new reply <60s after send."""
    # Setup
    contact = create_contact(name="Liam", telegram_id=7944133972)
    outreach_msg = send_message_to_contact(contact.id, "Test message")
    mark_as_sent(outreach_msg.id)

    # Mock Telethon to return new message
    with patch('telethon.TelegramClient') as mock_client:
        mock_client.return_value.get_messages.return_value = [
            MockTelegramMessage(
                id=12345,
                text="Yeah, I'm interested. Tell me more.",
                date=datetime.now(),
                sender_id=7944133972
            )
        ]

        # Action: Run monitoring loop
        start = time.time()
        await monitor_conversations()
        duration = time.time() - start

        # Assertions
        assert duration < 60.0  # p95 requirement from NF1

        # Verify reply created in FalkorDB
        replies = query_graph("""
            MATCH (c:U4_Contact_Lead {telegram_id: 7944133972})-[:U4_REPLIED_VIA]->(r:U4_Telegram_Reply)
            RETURN r
        """)
        assert len(replies) == 1
        assert replies[0]["telegram_message_id"] == 12345
        assert replies[0]["message_text"] == "Yeah, I'm interested. Tell me more."

        # Verify status updated
        updated_contact = get_contact(contact.id)
        assert updated_contact["outreach_status"] == "replied"
```

#### 3. `test_duplicate_reply_prevention`
```python
@pytest.mark.asyncio
async def test_duplicate_reply_prevention():
    """Same telegram_message_id not created twice (idempotency)."""
    # Setup
    contact = create_contact(telegram_id=7944133972)

    # Mock same message returned twice
    with patch('telethon.TelegramClient') as mock_client:
        mock_client.return_value.get_messages.return_value = [
            MockTelegramMessage(id=12345, text="Test reply", sender_id=7944133972)
        ]

        # Action: Run monitoring twice
        await monitor_conversations()
        await monitor_conversations()

        # Assertion: Only ONE reply node created
        replies = query_graph("""
            MATCH (r:U4_Telegram_Reply {telegram_message_id: 12345})
            RETURN r
        """)
        assert len(replies) == 1
```

#### 4. `test_session_expired_triggers_failure_emit`
```python
@pytest.mark.asyncio
async def test_session_expired_triggers_failure_emit():
    """If session expires, emit failure event and alert team (fail-loud)."""
    # Setup: Mock session expiration
    with patch('telethon.TelegramClient') as mock_client:
        mock_client.return_value.get_messages.side_effect = AuthKeyError("Session expired")

        # Action
        with pytest.raises(TelegramSessionExpiredError):
            await monitor_conversations()

        # Assertions
        failures = query_graph("""
            MATCH (e:U4_Event {event_kind: 'failure.emit'})
            WHERE e.code = 'telegram.session_expired'
            RETURN e
        """)
        assert len(failures) == 1
        assert "Human must re-authenticate" in failures[0]["action"]

        # Verify team alert sent (check Telegram send log)
        # This would call telegram-send.cjs in real implementation
```

#### 5. `test_read_only_access_verified`
```python
@pytest.mark.asyncio
async def test_read_only_access_verified():
    """Telethon client CANNOT send messages (read-only enforcement)."""
    # Setup
    client = get_telethon_client()

    # Action & Assertion
    with pytest.raises(PermissionError, match="Read-only mode"):
        await client.send_message("test_user", "This should fail")

    # Verify no send_message method accessible
    assert not hasattr(client, 'send_message') or client.send_message is None
```

#### 6. `test_network_error_retry_logic`
```python
@pytest.mark.asyncio
async def test_network_error_retry_logic():
    """Temporary network errors retry on next loop (don't crash worker)."""
    # Setup: First call fails, second succeeds
    with patch('telethon.TelegramClient') as mock_client:
        mock_client.return_value.get_messages.side_effect = [
            NetworkError("Timeout"),  # First call fails
            []  # Second call succeeds (no new messages)
        ]

        # Action: Run monitoring twice
        await monitor_conversations()  # Fails gracefully, logs warning
        await monitor_conversations()  # Succeeds

        # Assertions
        # Verify worker didn't crash (no failure.emit for network errors)
        failures = query_graph("""
            MATCH (e:U4_Event {event_kind: 'failure.emit'})
            WHERE e.code = 'telegram.network_error'
            RETURN e
        """)
        assert len(failures) == 0  # Network errors are warnings, not failures
```

**Target Coverage:** ≥95% for `services/outreach/telegram_reader.py`

---

### test_outreach_tracker.py (Send Tracking & Status)

**Covers:** AC.md F3, F7 (Mark as Sent, Status Lifecycle)

**Test Cases:**

#### 1. `test_mark_as_sent_creates_nodes_and_links`
```python
def test_mark_as_sent_creates_nodes_and_links():
    """Marking message as sent creates U4_Outreach_Message and links to contact."""
    # Setup
    contact = create_contact(telegram_id=7944133972)
    message_text = "Hey Liam! Saw you grinding on voice AI..."

    # Action
    result = mark_as_sent(
        contact_id=contact.id,
        message=message_text,
        sent_by="bigbosexf"
    )

    # Assertions
    assert result["success"] is True
    assert result["outreach_message_id"] is not None

    # Verify U4_Outreach_Message created
    messages = query_graph("""
        MATCH (m:U4_Outreach_Message)
        WHERE m.contact_id = $contact_id
        RETURN m
    """, {"contact_id": contact.id})
    assert len(messages) == 1
    assert messages[0]["message_text"] == message_text
    assert messages[0]["sent_by"] == "bigbosexf"
    assert messages[0]["is_sent"] is True

    # Verify link to contact
    links = query_graph("""
        MATCH (c:U4_Contact_Lead)-[:U4_RECEIVED]->(m:U4_Outreach_Message)
        WHERE c.telegram_id = 7944133972
        RETURN m
    """)
    assert len(links) == 1

    # Verify status updated
    updated_contact = get_contact(contact.id)
    assert updated_contact["outreach_status"] == "sent"
```

#### 2. `test_cannot_send_twice_to_same_contact`
```python
def test_cannot_send_twice_to_same_contact():
    """Duplicate send prevention (status=sent blocks second send)."""
    # Setup
    contact = create_contact(telegram_id=7944133972)

    # First send succeeds
    mark_as_sent(contact.id, "First message", sent_by="bigbosexf")

    # Second send fails
    with pytest.raises(DuplicateSendError, match="Already sent"):
        mark_as_sent(contact.id, "Second message", sent_by="bigbosexf")

    # Verify only ONE message in FalkorDB
    messages = query_graph("""
        MATCH (m:U4_Outreach_Message)
        WHERE m.contact_id = $contact_id
        RETURN count(m) AS count
    """, {"contact_id": contact.id})
    assert messages[0]["count"] == 1
```

#### 3. `test_status_transitions_full_lifecycle`
```python
def test_status_transitions_full_lifecycle():
    """Status moves through: pending → sent → replied → interested → converted."""
    # Setup
    contact = create_contact(telegram_id=7944133972)
    assert contact["outreach_status"] == "pending"

    # Transition 1: pending → sent
    mark_as_sent(contact.id, "Message", sent_by="bigbosexf")
    assert get_contact(contact.id)["outreach_status"] == "sent"

    # Transition 2: sent → replied
    create_reply(contact.id, "Yeah, I'm interested", telegram_msg_id=12345)
    assert get_contact(contact.id)["outreach_status"] == "replied"

    # Transition 3: replied → interested
    mark_interest(contact.id, interested=True)
    assert get_contact(contact.id)["outreach_status"] == "interested"

    # Transition 4: interested → converted
    mark_converted(contact.id, joined_at=datetime.now())
    assert get_contact(contact.id)["outreach_status"] == "converted"

    # Verify audit trail
    history = query_graph("""
        MATCH (c:U4_Contact_Lead {telegram_id: 7944133972})-[:U4_STATUS_CHANGED]->(e:U4_Event)
        RETURN e.from_status, e.to_status, e.changed_at
        ORDER BY e.changed_at ASC
    """)
    assert len(history) == 4
    assert history[0]["to_status"] == "sent"
    assert history[1]["to_status"] == "replied"
    assert history[2]["to_status"] == "interested"
    assert history[3]["to_status"] == "converted"
```

#### 4. `test_mark_not_interested_transitions_correctly`
```python
def test_mark_not_interested_transitions_correctly():
    """replied → not_interested transition works (different from interested)."""
    # Setup
    contact = create_contact(telegram_id=7944133972)
    mark_as_sent(contact.id, "Message", sent_by="bigbosexf")
    create_reply(contact.id, "Not right now", telegram_msg_id=12345)
    assert get_contact(contact.id)["outreach_status"] == "replied"

    # Action
    mark_interest(contact.id, interested=False)

    # Assertion
    assert get_contact(contact.id)["outreach_status"] == "not_interested"

    # Verify cannot convert to interested later (one-way transition)
    with pytest.raises(InvalidStatusTransitionError):
        mark_interest(contact.id, interested=True)
```

#### 5. `test_status_history_queryable`
```python
def test_status_history_queryable():
    """Can reconstruct full status timeline from FalkorDB."""
    # Setup
    contact = create_contact(telegram_id=7944133972)
    mark_as_sent(contact.id, "Message", sent_by="bigbosexf")
    time.sleep(0.1)
    create_reply(contact.id, "Interested!", telegram_msg_id=12345)
    time.sleep(0.1)
    mark_interest(contact.id, interested=True)

    # Action
    timeline = get_status_timeline(contact.id)

    # Assertions
    assert len(timeline) == 3
    assert timeline[0] == {"status": "sent", "timestamp": ANY, "changed_by": "bigbosexf"}
    assert timeline[1] == {"status": "replied", "timestamp": ANY, "changed_by": "telegram_worker"}
    assert timeline[2] == {"status": "interested", "timestamp": ANY, "changed_by": "bigbosexf"}
```

#### 6. `test_100_percent_tracking_no_orphans`
```python
def test_100_percent_tracking_no_orphans():
    """Every outreach message links to a contact (no orphan nodes)."""
    # Setup: Create 10 contacts, send to 5
    contacts = [create_contact(telegram_id=1000+i) for i in range(10)]
    for i in range(5):
        mark_as_sent(contacts[i].id, f"Message {i}", sent_by="bigbosexf")

    # Action: Query for orphan messages
    orphans = query_graph("""
        MATCH (m:U4_Outreach_Message)
        WHERE NOT (m)<-[:U4_RECEIVED]-(:U4_Contact_Lead)
        RETURN count(m) AS orphan_count
    """)

    # Assertion
    assert orphans[0]["orphan_count"] == 0  # No orphans allowed
```

**Target Coverage:** ≥95% for `services/outreach/outreach_tracker.py`

---

### test_api_endpoints.py (API Routes)

**Covers:** All `/api/outreach/*` endpoints

**Test Cases:**

#### 1. `test_get_outreach_queue_returns_313_contacts`
```python
def test_get_outreach_queue_returns_313_contacts(client):
    """GET /api/outreach/queue returns all contacts with pagination."""
    # Setup: Load 313 contacts from fixture
    load_contacts_from_json("tests/fixtures/team_members.json")

    # Action
    response = client.get("/api/outreach/queue?page=1&limit=20")

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 313
    assert len(data["contacts"]) == 20  # First page
    assert data["page"] == 1
    assert data["pages"] == 16  # 313 / 20 = 15.65 → 16 pages

    # Verify contact structure
    contact = data["contacts"][0]
    assert "telegram_id" in contact
    assert "name" in contact
    assert "profile_type" in contact
    assert "outreach_status" in contact
    assert "supervisor_score" in contact
    assert "hustler_score" in contact
```

#### 2. `test_generate_message_endpoint_calls_maya`
```python
def test_generate_message_endpoint_calls_maya(client):
    """POST /api/outreach/generate-message/{contact_id} generates personalized message."""
    # Setup
    contact = create_contact(name="Liam", profile_type="hustler")

    # Action
    response = client.post(f"/api/outreach/generate-message/{contact.id}")

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Liam" in data["message"]
    assert len(data["message"]) > 50  # Non-empty message
    assert data["generated_by"] == "maya"
    assert "confidence" in data
```

#### 3. `test_mark_sent_endpoint_updates_falkordb`
```python
def test_mark_sent_endpoint_updates_falkordb(client):
    """POST /api/outreach/mark-sent creates outreach message node."""
    # Setup
    contact = create_contact(telegram_id=7944133972)

    # Action
    response = client.post("/api/outreach/mark-sent", json={
        "contact_id": contact.id,
        "message": "Hey Liam! Test message",
        "sent_by": "bigbosexf"
    })

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["outreach_message_id"] is not None

    # Verify in FalkorDB
    messages = query_graph("""
        MATCH (m:U4_Outreach_Message {contact_id: $contact_id})
        RETURN m
    """, {"contact_id": contact.id})
    assert len(messages) == 1
```

#### 4. `test_get_conversations_returns_sent_contacts`
```python
def test_get_conversations_returns_sent_contacts(client):
    """GET /api/outreach/conversations returns only sent/replied contacts."""
    # Setup
    c1 = create_contact(name="Pending", telegram_id=1001)  # pending
    c2 = create_contact(name="Sent", telegram_id=1002)
    c3 = create_contact(name="Replied", telegram_id=1003)

    mark_as_sent(c2.id, "Message", sent_by="bigbosexf")
    mark_as_sent(c3.id, "Message", sent_by="bigbosexf")
    create_reply(c3.id, "Reply", telegram_msg_id=12345)

    # Action
    response = client.get("/api/outreach/conversations")

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert len(data["conversations"]) == 2  # c2, c3 only (not c1)
    telegram_ids = [conv["telegram_id"] for conv in data["conversations"]]
    assert 1002 in telegram_ids
    assert 1003 in telegram_ids
    assert 1001 not in telegram_ids
```

#### 5. `test_connect_telegram_endpoint_creates_session`
```python
@pytest.mark.asyncio
async def test_connect_telegram_endpoint_creates_session(client):
    """POST /api/outreach/connect-telegram initiates Telethon auth."""
    # Setup: Mock Telethon client
    with patch('telethon.TelegramClient') as mock_client:
        mock_client.return_value.start.return_value = asyncio.coroutine(lambda: True)()

        # Action
        response = client.post("/api/outreach/connect-telegram", json={
            "phone": "+1234567890",
            "code": "12345"
        })

        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["session_created"] is True

        # Verify session in FalkorDB
        sessions = query_graph("""
            MATCH (s:U4_Telegram_Conversation {phone: '+1234567890'})
            RETURN s
        """)
        assert len(sessions) == 1
```

#### 6. `test_worker_health_endpoint_returns_status`
```python
def test_worker_health_endpoint_returns_status(client):
    """GET /api/outreach/worker-health returns worker status."""
    # Action
    response = client.get("/api/outreach/worker-health")

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert "status" in data  # running | stopped | error
    assert "last_check" in data  # timestamp
    assert "uptime_seconds" in data
```

**Target Coverage:** ≥95% for `api/outreach/*` routes

---

### test_metrics_calculator.py (Analytics)

**Covers:** AC.md F8 (Metrics Dashboard)

**Test Cases:**

#### 1. `test_reply_rate_by_profile_type`
```python
def test_reply_rate_by_profile_type():
    """Calculate reply rate: hustler vs supervisor vs hybrid."""
    # Setup
    hustlers = [create_contact(profile_type="hustler", telegram_id=1000+i) for i in range(10)]
    supervisors = [create_contact(profile_type="supervisor", telegram_id=2000+i) for i in range(10)]

    # Send to all
    for c in hustlers + supervisors:
        mark_as_sent(c.id, "Message", sent_by="bigbosexf")

    # Hustlers: 6/10 reply
    for i in range(6):
        create_reply(hustlers[i].id, "Reply", telegram_msg_id=3000+i)

    # Supervisors: 3/10 reply
    for i in range(3):
        create_reply(supervisors[i].id, "Reply", telegram_msg_id=4000+i)

    # Action
    metrics = calculate_reply_rate_by_profile()

    # Assertions
    assert metrics["hustler"]["sent"] == 10
    assert metrics["hustler"]["replied"] == 6
    assert metrics["hustler"]["reply_rate"] == 60.0

    assert metrics["supervisor"]["sent"] == 10
    assert metrics["supervisor"]["replied"] == 3
    assert metrics["supervisor"]["reply_rate"] == 30.0
```

#### 2. `test_reply_rate_by_signal`
```python
def test_reply_rate_by_signal():
    """Calculate which signals correlate with highest reply rates."""
    # Setup
    voice_ai_contacts = [
        create_contact(signals=["voice_ai"], telegram_id=1000+i) for i in range(10)
    ]
    code_review_contacts = [
        create_contact(signals=["code_review"], telegram_id=2000+i) for i in range(10)
    ]

    # Send to all
    for c in voice_ai_contacts + code_review_contacts:
        mark_as_sent(c.id, "Message", sent_by="bigbosexf")

    # voice_ai: 8/10 reply (high correlation)
    for i in range(8):
        create_reply(voice_ai_contacts[i].id, "Reply", telegram_msg_id=3000+i)

    # code_review: 2/10 reply (low correlation)
    for i in range(2):
        create_reply(code_review_contacts[i].id, "Reply", telegram_msg_id=4000+i)

    # Action
    metrics = calculate_reply_rate_by_signal()

    # Assertions
    assert metrics["voice_ai"]["reply_rate"] == 80.0
    assert metrics["code_review"]["reply_rate"] == 20.0
    assert metrics["voice_ai"]["sent"] == 10
```

#### 3. `test_conversion_funnel_counts`
```python
def test_conversion_funnel_counts():
    """Calculate funnel: pending → sent → replied → interested → converted."""
    # Setup: 100 contacts
    contacts = [create_contact(telegram_id=1000+i) for i in range(100)]

    # 50 sent
    for i in range(50):
        mark_as_sent(contacts[i].id, "Message", sent_by="bigbosexf")

    # 15 replied
    for i in range(15):
        create_reply(contacts[i].id, "Reply", telegram_msg_id=2000+i)

    # 5 interested
    for i in range(5):
        mark_interest(contacts[i].id, interested=True)

    # 2 converted
    for i in range(2):
        mark_converted(contacts[i].id, joined_at=datetime.now())

    # Action
    funnel = calculate_conversion_funnel()

    # Assertions
    assert funnel["pending"] == 50  # 100 - 50
    assert funnel["sent"] == 50
    assert funnel["replied"] == 15
    assert funnel["interested"] == 5
    assert funnel["converted"] == 2

    # Verify conversion rates
    assert funnel["reply_rate"] == 30.0  # 15/50
    assert funnel["interest_rate"] == 33.33  # 5/15 (of replies)
    assert funnel["conversion_rate"] == 40.0  # 2/5 (of interested)
```

**Target Coverage:** ≥95% for `services/outreach/metrics_calculator.py`

---

## Frontend Tests (Vitest + React Testing Library)

### contact-queue.test.tsx (Queue Display)

**Covers:** AC.md F1 (Contact Queue)

**Test Cases:**

#### 1. `test_displays_313_contacts_with_pagination`
```typescript
it('displays 313 contacts with pagination', async () => {
  // Setup
  render(<OutreachQueue />);

  // Wait for contacts to load
  await waitFor(() => {
    expect(screen.getByText(/313 contacts/i)).toBeInTheDocument();
  });

  // Assertions
  const contactCards = screen.getAllByTestId('contact-card');
  expect(contactCards).toHaveLength(20);  // First page

  expect(screen.getByText(/Page 1 of 16/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /next page/i })).toBeEnabled();
});
```

#### 2. `test_filters_by_profile_type`
```typescript
it('filters by profile type', async () => {
  // Setup
  render(<OutreachQueue />);
  await waitFor(() => screen.getByText(/313 contacts/i));

  // Action: Click "Hustler" filter
  fireEvent.click(screen.getByRole('button', { name: /hustler/i }));

  // Assertions
  await waitFor(() => {
    const cards = screen.getAllByTestId('contact-card');
    cards.forEach(card => {
      expect(within(card).getByText(/HUSTLER/i)).toBeInTheDocument();
    });
  });
});
```

#### 3. `test_sorts_by_hustler_score`
```typescript
it('sorts by hustler score descending', async () => {
  // Setup
  render(<OutreachQueue />);
  await waitFor(() => screen.getByText(/313 contacts/i));

  // Action: Select "Hustler Score" sort
  fireEvent.change(screen.getByRole('combobox', { name: /sort/i }), {
    target: { value: 'hustler_score_desc' }
  });

  // Assertions
  await waitFor(() => {
    const scores = screen.getAllByTestId('hustler-score').map(
      el => parseInt(el.textContent!)
    );
    expect(scores).toEqual([...scores].sort((a, b) => b - a));  // Descending
  });
});
```

#### 4. `test_shows_top_3_signals`
```typescript
it('shows top 3 signals for each contact', async () => {
  // Setup
  render(<OutreachQueue />);
  await waitFor(() => screen.getByText(/313 contacts/i));

  // Assertions
  const firstCard = screen.getAllByTestId('contact-card')[0];
  const signals = within(firstCard).getAllByTestId('signal-badge');
  expect(signals).toHaveLength(3);  // Top 3 only
});
```

#### 5. `test_mobile_responsive`
```typescript
it('is mobile responsive', async () => {
  // Setup: Resize to mobile
  global.innerWidth = 375;
  global.innerHeight = 667;
  fireEvent(window, new Event('resize'));

  render(<OutreachQueue />);
  await waitFor(() => screen.getByText(/313 contacts/i));

  // Assertions
  const container = screen.getByTestId('outreach-queue-container');
  expect(container).toHaveClass('mobile-layout');

  // Verify cards stack vertically
  const cards = screen.getAllByTestId('contact-card');
  expect(cards[0]).toHaveStyle({ width: '100%' });
});
```

**Target Coverage:** ≥85% for `components/OutreachQueue.tsx`

---

### message-generation.test.tsx (Maya UI)

**Covers:** AC.md F2 (Message Generation UI)

**Test Cases:**

#### 1. `test_generate_button_calls_api`
```typescript
it('generates message when button clicked', async () => {
  // Setup
  const mockGenerate = vi.fn().mockResolvedValue({
    message: "Hey Liam! Test message...",
    generated_by: "maya"
  });
  render(<MessageGenerator contactId="contact-123" onGenerate={mockGenerate} />);

  // Action
  fireEvent.click(screen.getByRole('button', { name: /generate message/i }));

  // Assertions
  await waitFor(() => {
    expect(mockGenerate).toHaveBeenCalledWith("contact-123");
    expect(screen.getByDisplayValue(/Hey Liam!/i)).toBeInTheDocument();
  });
});
```

#### 2. `test_message_editable_before_send`
```typescript
it('allows editing message before send', async () => {
  // Setup
  render(<MessageGenerator contactId="contact-123" />);
  fireEvent.click(screen.getByRole('button', { name: /generate/i }));
  await waitFor(() => screen.getByRole('textbox'));

  // Action: Edit message
  const textarea = screen.getByRole('textbox');
  fireEvent.change(textarea, {
    target: { value: 'Edited message content' }
  });

  // Assertion
  expect(textarea).toHaveValue('Edited message content');
});
```

#### 3. `test_copy_to_clipboard`
```typescript
it('copies message to clipboard when button clicked', async () => {
  // Setup
  const mockClipboard = vi.spyOn(navigator.clipboard, 'writeText');
  render(<MessageGenerator contactId="contact-123" />);

  fireEvent.click(screen.getByRole('button', { name: /generate/i }));
  await waitFor(() => screen.getByRole('textbox'));

  // Action
  fireEvent.click(screen.getByRole('button', { name: /copy/i }));

  // Assertions
  expect(mockClipboard).toHaveBeenCalled();
  expect(screen.getByText(/copied!/i)).toBeInTheDocument();
});
```

#### 4. `test_generation_under_5_seconds_shows_loading`
```typescript
it('shows loading spinner during generation', async () => {
  // Setup: Mock delayed response
  const mockGenerate = vi.fn().mockImplementation(() =>
    new Promise(resolve => setTimeout(() => resolve({ message: "Test" }), 3000))
  );
  render(<MessageGenerator contactId="contact-123" onGenerate={mockGenerate} />);

  // Action
  fireEvent.click(screen.getByRole('button', { name: /generate/i }));

  // Assertions
  expect(screen.getByText(/generating.../i)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
});
```

**Target Coverage:** ≥85% for `components/MessageGenerator.tsx`

---

### send-workflow.test.tsx (Copy + Mark Sent)

**Covers:** AC.md F3 (Send Workflow)

**Test Cases:**

#### 1. `test_mark_sent_updates_status`
```typescript
it('marks message as sent and updates status', async () => {
  // Setup
  const mockMarkSent = vi.fn().mockResolvedValue({ success: true });
  render(<SendWorkflow contactId="contact-123" onMarkSent={mockMarkSent} />);

  // Generate message first
  fireEvent.click(screen.getByRole('button', { name: /generate/i }));
  await waitFor(() => screen.getByRole('textbox'));

  // Action
  fireEvent.click(screen.getByRole('button', { name: /mark sent/i }));

  // Assertions
  await waitFor(() => {
    expect(mockMarkSent).toHaveBeenCalledWith({
      contact_id: "contact-123",
      message: expect.any(String),
      sent_by: "bigbosexf"
    });
    expect(screen.getByText(/sent on/i)).toBeInTheDocument();
  });
});
```

#### 2. `test_cannot_send_twice`
```typescript
it('disables send button after marking as sent', async () => {
  // Setup
  render(<SendWorkflow contactId="contact-123" status="sent" />);

  // Assertion
  const sendButton = screen.queryByRole('button', { name: /mark sent/i });
  expect(sendButton).not.toBeInTheDocument();
  expect(screen.getByText(/already sent/i)).toBeInTheDocument();
});
```

#### 3. `test_rate_limiting_warning`
```typescript
it('shows warning if >20 sends in one day', async () => {
  // Setup: Mock 20 sends today
  const mockStore = { sendCountToday: 20 };
  render(<SendWorkflow contactId="contact-123" sendCountToday={20} />);

  // Assertion
  expect(screen.getByText(/slow down to avoid spam/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /send anyway/i })).toBeEnabled();
});
```

**Target Coverage:** ≥85% for `components/SendWorkflow.tsx`

---

### reply-notifications.test.tsx (SSE Notifications)

**Covers:** AC.md F6 (Reply Notifications)

**Test Cases:**

#### 1. `test_notification_appears_on_new_reply`
```typescript
it('displays notification when reply detected', async () => {
  // Setup: Mock SSE connection
  const mockEventSource = createMockEventSource();
  render(<ReplyNotifications userId="bigbosexf" />);

  // Action: Simulate SSE event
  mockEventSource.simulateMessage({
    type: 'telegram.reply.detected',
    data: {
      contact_name: 'Liam',
      reply_preview: 'Yeah, I'm interested...',
      telegram_id: 7944133972
    }
  });

  // Assertions
  await waitFor(() => {
    expect(screen.getByText(/Liam/i)).toBeInTheDocument();
    expect(screen.getByText(/Yeah, I'm interested.../i)).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('1');
  });
});
```

#### 2. `test_unread_badge_count_increments`
```typescript
it('increments unread badge count on multiple replies', async () => {
  // Setup
  const mockEventSource = createMockEventSource();
  render(<ReplyNotifications userId="bigbosexf" />);

  // Action: Simulate 3 replies
  for (let i = 0; i < 3; i++) {
    mockEventSource.simulateMessage({
      type: 'telegram.reply.detected',
      data: { contact_name: `Contact ${i}`, reply_preview: "Reply..." }
    });
  }

  // Assertion
  await waitFor(() => {
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('3');
  });
});
```

#### 3. `test_notification_dismissed_on_read`
```typescript
it('dismisses notification after reading', async () => {
  // Setup
  const mockEventSource = createMockEventSource();
  render(<ReplyNotifications userId="bigbosexf" />);
  mockEventSource.simulateMessage({
    type: 'telegram.reply.detected',
    data: { contact_name: 'Liam', reply_preview: 'Test' }
  });

  await waitFor(() => screen.getByText(/Liam/i));

  // Action: Click "View Full"
  fireEvent.click(screen.getByRole('button', { name: /view full/i }));

  // Assertions
  await waitFor(() => {
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('0');
  });
});
```

**Target Coverage:** ≥85% for `components/ReplyNotifications.tsx`

---

## E2E Tests (Playwright)

### outreach-flow.spec.ts (Complete Workflow)

**Covers:** AC.md F1-F7 (End-to-End Flow)

**Test Scenarios:**

#### 1. Complete Outreach Flow (Happy Path)
```typescript
test('complete outreach flow: generate → send → reply → convert', async ({ page }) => {
  // Step 1: Load queue
  await page.goto('http://localhost:3000/deck/outreach');
  await expect(page.locator('text=313 contacts')).toBeVisible();

  // Step 2: Click first contact
  await page.locator('[data-testid="contact-card"]').first().click();

  // Step 3: Generate message
  await page.click('button:has-text("Generate Message")');
  await expect(page.locator('textarea[name="message"]')).toBeVisible({ timeout: 5000 });
  const message = await page.locator('textarea[name="message"]').inputValue();
  expect(message).toContain('ScopeLock');  // Brand mention

  // Step 4: Copy to clipboard
  await page.click('button:has-text("Copy")');
  await expect(page.locator('text=Copied!')).toBeVisible();

  // Step 5: Mark as sent
  await page.click('button:has-text("Mark as Sent")');
  await expect(page.locator('text=Sent on')).toBeVisible();

  // Step 6: Simulate reply (via API)
  await page.request.post('http://localhost:8000/api/outreach/test/simulate-reply', {
    data: {
      telegram_id: 7944133972,
      message: "Yeah, I'm interested!",
      telegram_message_id: 12345
    }
  });

  // Step 7: Verify notification appears
  await expect(page.locator('[data-testid="notification-badge"]')).toHaveText('1', { timeout: 65000 });  // 60s + buffer

  // Step 8: View reply
  await page.click('text=View Full');
  await expect(page.locator('text=Yeah, I\'m interested!')).toBeVisible();

  // Step 9: Mark interested
  await page.click('button:has-text("Mark Interested")');
  await expect(page.locator('text=Status: Interested')).toBeVisible();
});
```

#### 2. Duplicate Send Prevention
```typescript
test('cannot send message to same contact twice', async ({ page }) => {
  // Step 1: Send to contact
  await page.goto('http://localhost:3000/deck/outreach');
  await page.locator('[data-testid="contact-card"]').first().click();
  await page.click('button:has-text("Generate Message")');
  await page.waitForSelector('textarea[name="message"]');
  await page.click('button:has-text("Mark as Sent")');

  // Step 2: Try to send again
  await expect(page.locator('button:has-text("Mark as Sent")')).not.toBeVisible();
  await expect(page.locator('text=Already sent')).toBeVisible();
});
```

#### 3. Filter and Sort
```typescript
test('filters contacts by profile type and sorts by score', async ({ page }) => {
  // Step 1: Load queue
  await page.goto('http://localhost:3000/deck/outreach');

  // Step 2: Filter by "Hustler"
  await page.click('button:has-text("Hustler")');
  await page.waitForTimeout(500);  // Wait for filter

  // Step 3: Verify all cards show "HUSTLER"
  const cards = await page.locator('[data-testid="contact-card"]').all();
  for (const card of cards) {
    await expect(card.locator('text=HUSTLER')).toBeVisible();
  }

  // Step 4: Sort by hustler score
  await page.selectOption('select[name="sort"]', 'hustler_score_desc');
  await page.waitForTimeout(500);

  // Step 5: Verify descending order
  const scores = await page.locator('[data-testid="hustler-score"]').allTextContents();
  const numericScores = scores.map(s => parseInt(s));
  expect(numericScores).toEqual([...numericScores].sort((a, b) => b - a));
});
```

**Expected Results:**
- All 3 tests pass in Chromium, Firefox, WebKit
- Complete flow takes <60 seconds total
- No console errors

---

### reply-detection-flow.spec.ts (Reply Monitoring)

**Covers:** AC.md F5-F6 (Background Worker + Notifications)

**Test Scenarios:**

#### 1. Reply Detected Within 60 Seconds
```typescript
test('reply detected within 60 seconds of send', async ({ page }) => {
  // Step 1: Send message
  await page.goto('http://localhost:3000/deck/outreach');
  await page.locator('[data-testid="contact-card"]').first().click();
  await page.click('button:has-text("Generate Message")');
  await page.waitForSelector('textarea[name="message"]');
  await page.click('button:has-text("Mark as Sent")');

  // Step 2: Get telegram_id
  const telegramId = await page.getAttribute('[data-testid="telegram-id"]', 'data-value');

  // Step 3: Simulate reply via API
  const startTime = Date.now();
  await page.request.post('http://localhost:8000/api/outreach/test/simulate-reply', {
    data: {
      telegram_id: parseInt(telegramId!),
      message: "Interested!",
      telegram_message_id: Date.now()
    }
  });

  // Step 4: Wait for notification (should appear <60s)
  await expect(page.locator('[data-testid="notification-badge"]')).not.toHaveText('0', { timeout: 65000 });
  const detectionTime = Date.now() - startTime;

  // Assertion
  expect(detectionTime).toBeLessThan(60000);  // p95 requirement
});
```

#### 2. Multiple Replies Update Badge Count
```typescript
test('notification badge increments for multiple replies', async ({ page }) => {
  // Setup: Send to 3 contacts
  await page.goto('http://localhost:3000/deck/outreach');

  for (let i = 0; i < 3; i++) {
    await page.locator('[data-testid="contact-card"]').nth(i).click();
    await page.click('button:has-text("Generate Message")');
    await page.waitForSelector('textarea[name="message"]');
    await page.click('button:has-text("Mark as Sent")');
    await page.goBack();
  }

  // Simulate 3 replies
  for (let i = 0; i < 3; i++) {
    await page.request.post('http://localhost:8000/api/outreach/test/simulate-reply', {
      data: {
        telegram_id: 1000 + i,
        message: `Reply ${i}`,
        telegram_message_id: 5000 + i
      }
    });
  }

  // Wait for all notifications
  await expect(page.locator('[data-testid="notification-badge"]')).toHaveText('3', { timeout: 65000 });
});
```

**Expected Results:**
- Reply detection <60s (p95 requirement met)
- Badge count accurately reflects reply count
- No duplicate notifications

---

## Performance Tests (k6)

### outreach-load.js (Load Testing)

**Covers:** AC.md NF1 (Performance Requirements)

**Test Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration{endpoint:generate}': ['p(95)<5000'],    // Generate <5s (p95)
    'http_req_duration{endpoint:mark_sent}': ['p(95)<500'],    // Mark sent <500ms (p95)
    'http_req_duration{endpoint:queue}': ['p(95)<2000'],       // Queue <2s (p95)
  },
};

export default function () {
  // Test 1: Load queue
  const queueRes = http.get('http://localhost:8000/api/outreach/queue?page=1&limit=20', {
    tags: { endpoint: 'queue' },
  });
  check(queueRes, {
    'queue returns 200': (r) => r.status === 200,
    'queue returns 20 contacts': (r) => JSON.parse(r.body).contacts.length === 20,
  });

  sleep(1);

  // Test 2: Generate message
  const contactId = JSON.parse(queueRes.body).contacts[0].id;
  const generateRes = http.post(
    `http://localhost:8000/api/outreach/generate-message/${contactId}`,
    null,
    { tags: { endpoint: 'generate' } }
  );
  check(generateRes, {
    'generate returns 200': (r) => r.status === 200,
    'message includes contact name': (r) => JSON.parse(r.body).message.length > 50,
  });

  sleep(2);

  // Test 3: Mark as sent
  const message = JSON.parse(generateRes.body).message;
  const markSentRes = http.post(
    'http://localhost:8000/api/outreach/mark-sent',
    JSON.stringify({
      contact_id: contactId,
      message: message,
      sent_by: 'load_test_user',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'mark_sent' },
    }
  );
  check(markSentRes, {
    'mark sent returns 200': (r) => r.status === 200,
    'mark sent succeeds': (r) => JSON.parse(r.body).success === true,
  });

  sleep(1);
}
```

**Expected Results:**
```
✓ http_req_duration{endpoint:generate}   p(95)=4.2s   ✅ (threshold <5s)
✓ http_req_duration{endpoint:mark_sent}  p(95)=180ms  ✅ (threshold <500ms)
✓ http_req_duration{endpoint:queue}      p(95)=1.8s   ✅ (threshold <2s)

✓ queue returns 200:           100% pass
✓ generate returns 200:         98% pass
✓ mark sent returns 200:       100% pass
```

---

## CI Integration

**GitHub Actions Workflow:**
```yaml
name: Outreach System Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    paths:
      - 'backend/services/outreach/**'
      - 'frontend/components/outreach/**'

jobs:
  backend-tests:
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

      - name: Run pytest
        run: |
          cd backend
          pytest tests/outreach/ -v --cov=services/outreach --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml
          flags: backend

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run Vitest
        run: |
          cd frontend
          npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/coverage-final.json
          flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npx playwright test tests/e2e/outreach-flow.spec.ts

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/
```

**Failure Thresholds:**
- Backend coverage <95% → Fail CI
- Frontend coverage <85% → Fail CI
- Any E2E test failure → Fail CI
- Performance test p95 exceeded → Fail CI

---

## Test Data

### Sample Contacts (tests/fixtures/contact_analysis.json)
```json
[
  {
    "telegram_id": 7944133972,
    "name": "Liam",
    "profile_type": "hustler",
    "supervisor_score": 1,
    "hustler_score": 15,
    "signals": ["voice_ai", "productivity_tools", "ai_apps"],
    "matching_messages": [
      {
        "text": "Just launched a voice AI demo for my productivity app...",
        "date": "2024-10-15",
        "score": 8.5,
        "group": "AI Builders"
      }
    ]
  },
  {
    "telegram_id": 7698765432,
    "name": "Alex",
    "profile_type": "supervisor",
    "supervisor_score": 22,
    "hustler_score": 3,
    "signals": ["code_review", "architecture", "testing"],
    "matching_messages": [
      {
        "text": "Great PR feedback on the auth refactor - clean separation of concerns",
        "date": "2024-10-22",
        "score": 9.2,
        "group": "Code Review Masters"
      }
    ]
  },
  {
    "telegram_id": 7123456789,
    "name": "Emma",
    "profile_type": "hybrid",
    "supervisor_score": 12,
    "hustler_score": 14,
    "signals": ["productivity_tools", "automation", "ai_agents"],
    "matching_messages": [
      {
        "text": "Built an AI agent to automate proposal writing - 10x faster now",
        "date": "2024-10-18",
        "score": 7.8,
        "group": "Automation Geeks"
      }
    ]
  }
]
```

---

## Coverage Targets

**Backend:** ≥95%
- `services/outreach/message_generator.py`: 100%
- `services/outreach/telegram_reader.py`: 97%
- `services/outreach/outreach_tracker.py`: 98%
- `services/outreach/metrics_calculator.py`: 95%
- `api/outreach/*.py`: 95%

**Frontend:** ≥85%
- `components/OutreachQueue.tsx`: 90%
- `components/MessageGenerator.tsx`: 85%
- `components/SendWorkflow.tsx`: 88%
- `components/ReplyNotifications.tsx`: 82%
- `components/MetricsDashboard.tsx`: 80%

**E2E:** 100% of critical paths
- Complete outreach flow (generate → send → reply → convert)
- Reply detection flow (monitoring + notifications)
- Filter + sort + pagination

---

## Acceptance Gate

**Before deployment, ALL tests must pass:**
- ✅ Backend tests: 47/47 passed, ≥95% coverage
- ✅ Frontend tests: 23/23 passed, ≥85% coverage
- ✅ E2E tests: 12/12 passed (Chromium + Firefox + WebKit)
- ✅ Performance tests: p95 thresholds met (generate <5s, mark sent <500ms)

**Manual verification checklist:**
- [ ] Load 313 contacts from JSON → all visible
- [ ] Generate message for hustler → references specific signal
- [ ] Generate message for supervisor → references code review
- [ ] Send workflow completes in 3 clicks
- [ ] Reply detected <60 seconds after send
- [ ] Notification appears instantly (SSE)
- [ ] Metrics dashboard shows correct counts

**Next:** MECHANISM.md (architecture, FalkorDB schema, API design) → ALGORITHM.md (implementation steps) → GUIDE.md (setup, deployment)
