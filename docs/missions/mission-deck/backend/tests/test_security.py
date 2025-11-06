"""
Security Tests for ScopeLock Mission Deck

Maps to: AC.md section NF3 (Security)
Severity: CRITICAL (all must pass for AC Green)
Implements: L4 conformance patterns with attestation evidence

Test Coverage:
- S1: JWT token expiration validation
- S2: JWT signature validation
- S3: Missing authentication token handling
- S4: Authorization boundaries (mission access)
- S5: Authorization boundaries (DoD access)
- S6: Authorization boundaries (chat access)
- S7: XSS prevention (notes and chat sanitization)
- S8: SQL injection prevention (parameterized queries)

Pass Rate Requirement: 100% (critical severity, 0 failures allowed)
"""

import pytest
import time
import jwt
from datetime import datetime, timedelta
from sqlalchemy.sql import text


# ==============================================================================
# S1: JWT Token Expiration Validation
# ==============================================================================

def test_jwt_expired_token_rejected(client, test_user):
    """
    CRITICAL: Expired JWT tokens must be rejected.

    Given: A JWT token expired 1 day ago
    When: Client attempts to access /api/missions
    Then: Response is 401 Unauthorized with "Token expired" error

    Maps to: AC.md NF3 "JWT tokens expire after 7 days"
    Severity: critical
    """
    # Generate expired token (expired 1 day ago)
    expired_payload = {
        "sub": test_user.id,
        "email": test_user.email,
        "exp": datetime.utcnow() - timedelta(days=1)
    }
    expired_token = jwt.encode(
        expired_payload,
        "test-secret-key",  # Same secret as app uses in test
        algorithm="HS256"
    )

    # Attempt to access protected route with expired token
    response = client.get(
        "/api/missions",
        headers={"Authorization": f"Bearer {expired_token}"}
    )

    # Assertions
    assert response.status_code == 401, "Expired token should return 401"
    data = response.json()
    assert "expired" in data.get("detail", "").lower(), \
        "Error message should indicate token expiration"

    # L4 attestation evidence
    assert response.elapsed.total_seconds() < 0.5, \
        "Token validation should be fast (<500ms)"


# ==============================================================================
# S2: JWT Signature Validation
# ==============================================================================

def test_jwt_invalid_signature_rejected(client, test_user):
    """
    CRITICAL: JWT tokens with invalid signatures must be rejected.

    Given: A JWT token signed with wrong secret key
    When: Client attempts to access /api/missions
    Then: Response is 401 Unauthorized with "Invalid token" error

    Maps to: AC.md NF3 "JWT tokens expire after 7 days"
    Severity: critical
    """
    # Generate token with WRONG secret key
    payload = {
        "sub": test_user.id,
        "email": test_user.email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    invalid_token = jwt.encode(
        payload,
        "wrong-secret-key",  # Intentionally wrong
        algorithm="HS256"
    )

    # Attempt to access protected route with invalid token
    response = client.get(
        "/api/missions",
        headers={"Authorization": f"Bearer {invalid_token}"}
    )

    # Assertions
    assert response.status_code == 401, "Invalid signature should return 401"
    data = response.json()
    assert "invalid" in data.get("detail", "").lower(), \
        "Error message should indicate invalid token"


# ==============================================================================
# S3: Missing Authentication Token
# ==============================================================================

def test_missing_auth_token_rejected(client):
    """
    CRITICAL: Requests without authentication tokens must be rejected.

    Given: Client sends request with NO Authorization header
    When: Client attempts to access /api/missions
    Then: Response is 401 Unauthorized

    Maps to: AC.md F1 "Unauthorized users cannot access /deck routes"
    Severity: critical
    """
    # Attempt to access protected route WITHOUT auth header
    response = client.get("/api/missions")

    # Assertions
    assert response.status_code == 401, "Missing token should return 401"
    data = response.json()
    assert "authorization" in data.get("detail", "").lower() or \
           "unauthorized" in data.get("detail", "").lower(), \
        "Error message should indicate missing authorization"


# ==============================================================================
# S4: Authorization Boundaries (Mission Access)
# ==============================================================================

def test_user_cannot_access_others_missions(client, auth_headers, test_db, test_user):
    """
    CRITICAL: Users can only see their own assigned missions.

    Given: User A is authenticated
    When: User A attempts to access User B's mission via GET /api/missions/{id}
    Then: Response is 403 Forbidden OR mission is not in list

    Maps to: AC.md NF3 "Users can only see their assigned missions"
    Severity: critical
    """
    # Create another user (User B)
    from models import Mission, User
    user_b = User(
        id="user-b-id",
        email="userb@scopelock.ai",
        name="User B"
    )
    test_db.add(user_b)

    # Create mission assigned to User B
    mission_b = Mission(
        id="mission-b-id",
        title="User B's Secret Mission",
        client="User B Corp",
        budget=500,
        deadline=datetime.utcnow() + timedelta(days=5),
        status="active",
        assigned_to="user-b-id"
    )
    test_db.add(mission_b)
    test_db.commit()

    # User A (test_user) attempts to list missions
    response = client.get("/api/missions", headers=auth_headers)
    assert response.status_code == 200
    missions = response.json()

    # Assertion: User A should NOT see User B's mission
    mission_ids = [m["id"] for m in missions]
    assert "mission-b-id" not in mission_ids, \
        "User A should not see User B's missions in list"

    # User A attempts to access User B's mission directly
    response = client.get("/api/missions/mission-b-id", headers=auth_headers)
    assert response.status_code in [403, 404], \
        "Direct access to other user's mission should return 403 or 404"


# ==============================================================================
# S5: Authorization Boundaries (DoD Access)
# ==============================================================================

def test_user_cannot_access_others_dod_items(client, auth_headers, test_db):
    """
    CRITICAL: Users cannot modify DoD items for missions they don't own.

    Given: User A is authenticated
    When: User A attempts to toggle DoD item for User B's mission
    Then: Response is 403 Forbidden

    Maps to: AC.md NF3 "Users can only see their assigned missions"
    Severity: critical
    """
    # Use mission created in previous test (mission-b-id assigned to user-b-id)
    from models import DODItem

    # Create DoD item for User B's mission
    dod_item = DODItem(
        id="dod-b-1",
        mission_id="mission-b-id",
        text="User B's DoD item",
        category="functional",
        completed=False
    )
    test_db.add(dod_item)
    test_db.commit()

    # User A attempts to toggle User B's DoD item
    response = client.patch(
        "/api/missions/mission-b-id/dod/dod-b-1",
        headers=auth_headers,
        json={"completed": True}
    )

    # Assertion: Should return 403 Forbidden
    assert response.status_code in [403, 404], \
        "User A should not be able to modify User B's DoD items"


# ==============================================================================
# S6: Authorization Boundaries (Chat Access)
# ==============================================================================

def test_user_cannot_access_others_chat_history(client, auth_headers, test_db):
    """
    CRITICAL: Users cannot read chat messages for missions they don't own.

    Given: User A is authenticated
    When: User A attempts to GET /api/missions/{user_b_mission}/messages
    Then: Response is 403 Forbidden

    Maps to: AC.md NF3 "Users can only see their assigned missions"
    Severity: critical
    """
    from models import ChatMessage

    # Create chat message for User B's mission
    chat_msg = ChatMessage(
        id="msg-b-1",
        mission_id="mission-b-id",
        sender="user",
        message="User B's secret question",
        created_at=datetime.utcnow()
    )
    test_db.add(chat_msg)
    test_db.commit()

    # User A attempts to read User B's chat messages
    response = client.get(
        "/api/missions/mission-b-id/messages",
        headers=auth_headers
    )

    # Assertion: Should return 403 Forbidden or 404
    assert response.status_code in [403, 404], \
        "User A should not be able to read User B's chat messages"


# ==============================================================================
# S7: XSS Prevention (Input Sanitization)
# ==============================================================================

def test_xss_prevention_in_notes_and_chat(client, auth_headers, test_db, test_mission):
    """
    CRITICAL: XSS attacks prevented via input sanitization.

    Given: User submits notes/chat with XSS payloads
    When: Data is saved and retrieved
    Then: Script tags are escaped/sanitized

    Maps to: AC.md NF3 "XSS prevented (sanitize user notes, chat messages)"
    Severity: critical
    """
    # XSS payload examples
    xss_payloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "<svg onload=alert('XSS')>",
        "javascript:alert('XSS')",
    ]

    for payload in xss_payloads:
        # Test 1: XSS in notes (Context tab)
        response = client.patch(
            f"/api/missions/{test_mission.id}/notes",
            headers=auth_headers,
            json={"notes": payload}
        )
        assert response.status_code == 200

        # Retrieve notes and verify sanitization
        response = client.get(
            f"/api/missions/{test_mission.id}/context",
            headers=auth_headers
        )
        data = response.json()
        notes = data.get("notes", "")

        # Assertion: Script tags should be escaped or removed
        assert "<script>" not in notes, "Script tags should be sanitized"
        assert "onerror=" not in notes, "Event handlers should be sanitized"
        assert "javascript:" not in notes, "JavaScript protocol should be sanitized"

        # Test 2: XSS in chat messages
        response = client.post(
            f"/api/missions/{test_mission.id}/chat",
            headers=auth_headers,
            json={"message": payload}
        )
        assert response.status_code == 200

        # Retrieve chat and verify sanitization
        response = client.get(
            f"/api/missions/{test_mission.id}/messages",
            headers=auth_headers
        )
        messages = response.json()
        latest_message = messages[0]["message"]

        # Assertion: XSS should be sanitized
        assert "<script>" not in latest_message, \
            "Chat messages should sanitize script tags"


# ==============================================================================
# S8: SQL Injection Prevention
# ==============================================================================

def test_sql_injection_prevention(client, auth_headers, test_db):
    """
    CRITICAL: SQL injection attacks prevented via parameterized queries.

    Given: User submits mission_id with SQL injection payload
    When: Backend queries database
    Then: Injection is prevented, no database compromise

    Maps to: AC.md NF3 "SQL injection prevented (use parameterized queries)"
    Severity: critical
    """
    # SQL injection payloads
    sql_injection_payloads = [
        "1' OR '1'='1",
        "1; DROP TABLE missions--",
        "1' UNION SELECT * FROM users--",
        "1' AND 1=1--",
    ]

    for payload in sql_injection_payloads:
        # Attempt SQL injection via mission_id parameter
        response = client.get(
            f"/api/missions/{payload}",
            headers=auth_headers
        )

        # Assertion: Should return 404 (not found) or 400 (bad request)
        # NOT 500 (server error indicating SQL injection succeeded)
        assert response.status_code in [400, 404], \
            f"SQL injection payload '{payload}' should not cause server error"

        # Verify database integrity (missions table still exists)
        result = test_db.execute(text("SELECT COUNT(*) FROM missions"))
        count = result.scalar()
        assert count >= 0, "Missions table should still exist (not dropped)"

    # Additional check: Verify no error logs contain raw SQL
    # (In production, this would check logging system)
    # For now, we assert that no 500 errors occurred (indicating SQL injection)
    pass


# ==============================================================================
# Test Fixtures
# ==============================================================================

@pytest.fixture
def test_user(test_db):
    """Create test user for authentication tests."""
    from models import User
    user = User(
        id="test-user-id",
        email="tester@scopelock.ai",
        name="Test User"
    )
    test_db.add(user)
    test_db.commit()
    return user


@pytest.fixture
def test_mission(test_db, test_user):
    """Create test mission assigned to test_user."""
    from models import Mission
    mission = Mission(
        id="test-mission-id",
        title="Test Mission",
        client="Test Corp",
        budget=300,
        deadline=datetime.utcnow() + timedelta(days=3),
        status="active",
        assigned_to=test_user.id
    )
    test_db.add(mission)
    test_db.commit()
    return mission


@pytest.fixture
def auth_headers(test_user):
    """Generate valid JWT token for test_user."""
    payload = {
        "sub": test_user.id,
        "email": test_user.email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(
        payload,
        "test-secret-key",
        algorithm="HS256"
    )
    return {"Authorization": f"Bearer {token}"}


# ==============================================================================
# L4 Conformance Summary
# ==============================================================================

"""
Conformance Results:
- Test Count: 8
- Severity: critical (all)
- Pass Rate Requirement: 100% (0 failures allowed)
- Maps to: AC.md NF3 (Security)

Attestation Evidence:
- JWT validation: S1, S2, S3
- Authorization boundaries: S4, S5, S6
- Input validation: S7, S8
- Response time: <500ms (S1 verified)

If any test fails: MISSION IS NOT AC GREEN
Critical security failures block delivery.
"""
