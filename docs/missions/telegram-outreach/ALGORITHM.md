# ALGORITHM: Telegram Outreach System

**Mission:** Team Member Hunting via Telegram
**Purpose:** Code-level implementation steps for each feature
**Date Created:** 2025-11-07

**For Rafael:** This document provides step-by-step implementation logic. Follow these algorithms when generating code to pass Sofia's test suite.

---

## Feature 1: Data Ingestion - Import Contact Leads

### Overview

**Purpose:** Import 313 analyzed contacts from `team_members.json` into FalkorDB as U4_Contact_Lead nodes

**Files to create/modify:**
- `backend/scripts/import_contact_leads.py` (new script)
- `backend/app/api/outreach/ingestion.py` (data ingestion service)
- `backend/app/services/falkordb_client.py` (FalkorDB REST API client)

---

### Step 1: Setup Phase

**Create file:** `backend/app/services/falkordb_client.py`

**Imports/Dependencies:**
```python
import requests
import os
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
```

**Initialize:**
```python
load_dotenv()

FALKORDB_API_URL = os.getenv("FALKORDB_API_URL")  # https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY = os.getenv("FALKORDB_API_KEY")
GRAPH_NAME = os.getenv("GRAPH_NAME", "scopelock")

if not FALKORDB_API_URL or not FALKORDB_API_KEY:
    raise EnvironmentError("Missing FALKORDB_API_URL or FALKORDB_API_KEY in environment")
```

---

### Step 2: Core Logic

**Function:** `import_contact_leads(contacts_json_path: str) -> dict`

**Pseudocode:**
```python
function import_contact_leads(contacts_json_path):
  1. Load contacts from JSON file:
     - Read file at contacts_json_path
     - Parse JSON to Python dict
     - Validate JSON structure (has required fields)

  2. Connect to FalkorDB:
     - Create FalkorDB client with API key
     - Test connection with simple query
     - If connection fails: throw error with clear message

  3. For each contact in JSON:
     - Transform contact data to graph node properties
     - Generate unique slug (e.g., "contact-liam-7944133972")
     - Add Mind Protocol v2 universal attributes (created_at, created_by)
     - Create/update U4_Contact_Lead node in FalkorDB

  4. Track import statistics:
     - Count successful imports
     - Count skipped duplicates
     - Count failures (with error details)

  5. Return summary:
     - Total contacts processed
     - Successful imports
     - Skipped duplicates
     - Failed imports with reasons
```

**Detailed Implementation:**

```python
import json
from datetime import datetime

def import_contact_leads(contacts_json_path: str) -> dict:
    """
    Import contact leads from team_members.json to FalkorDB.

    Args:
        contacts_json_path: Path to team_members.json file

    Returns:
        dict: Import statistics (imported, skipped, failed counts)
    """

    # Step 1: Load contacts from JSON
    try:
        with open(contacts_json_path, 'r', encoding='utf-8') as f:
            contacts_data = json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Contacts file not found: {contacts_json_path}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in contacts file: {e}")

    # Validate JSON structure
    if not isinstance(contacts_data, list):
        raise ValueError("Contacts JSON must be an array of contact objects")

    # Step 2: Initialize counters
    stats = {
        "total": len(contacts_data),
        "imported": 0,
        "skipped_duplicates": 0,
        "failed": 0,
        "errors": []
    }

    # Step 3: Import each contact
    for contact in contacts_data:
        try:
            # Validate required fields
            required_fields = ['telegram_id', 'name', 'profile_type', 'supervisor_score', 'hustler_score']
            for field in required_fields:
                if field not in contact:
                    raise ValueError(f"Missing required field: {field}")

            # Generate unique slug
            telegram_id = contact['telegram_id']
            name_slug = contact['name'].lower().replace(' ', '-')
            slug = f"contact-{name_slug}-{telegram_id}"

            # Prepare node properties
            node_properties = {
                "slug": slug,
                "telegram_id": telegram_id,
                "chat_type": contact.get('chat_type', 'personal_chat'),
                "name": contact['name'],
                "profile_type": contact['profile_type'],
                "supervisor_score": contact['supervisor_score'],
                "hustler_score": contact['hustler_score'],
                "outreach_status": "pending",
                "analysis_data": json.dumps(contact),  # Store full analysis as JSON
                "matching_messages": json.dumps(contact.get('matching_messages', [])),
                # Mind Protocol v2 universal attributes
                "created_at": datetime.utcnow().isoformat() + "Z",
                "created_by": "data-ingestion-script",
                "updated_at": datetime.utcnow().isoformat() + "Z",
                "updated_by": "data-ingestion-script"
            }

            # Check if contact already exists (by telegram_id)
            check_query = """
            MATCH (c:U4_Contact_Lead {telegram_id: $telegram_id})
            RETURN c
            """
            existing = query_falkordb(check_query, {"telegram_id": telegram_id})

            if existing:
                # Update existing node instead of creating duplicate
                update_query = """
                MATCH (c:U4_Contact_Lead {telegram_id: $telegram_id})
                SET c.name = $name,
                    c.profile_type = $profile_type,
                    c.supervisor_score = $supervisor_score,
                    c.hustler_score = $hustler_score,
                    c.analysis_data = $analysis_data,
                    c.matching_messages = $matching_messages,
                    c.updated_at = $updated_at,
                    c.updated_by = $updated_by
                RETURN c
                """
                query_falkordb(update_query, node_properties)
                stats["skipped_duplicates"] += 1
            else:
                # Create new node
                create_query = """
                CREATE (c:U4_Contact_Lead {
                    slug: $slug,
                    telegram_id: $telegram_id,
                    chat_type: $chat_type,
                    name: $name,
                    profile_type: $profile_type,
                    supervisor_score: $supervisor_score,
                    hustler_score: $hustler_score,
                    outreach_status: $outreach_status,
                    analysis_data: $analysis_data,
                    matching_messages: $matching_messages,
                    created_at: $created_at,
                    created_by: $created_by,
                    updated_at: $updated_at,
                    updated_by: $updated_by
                })
                RETURN c
                """
                query_falkordb(create_query, node_properties)
                stats["imported"] += 1

        except Exception as e:
            # Log error but continue with remaining contacts
            stats["failed"] += 1
            stats["errors"].append({
                "contact": contact.get('name', 'Unknown'),
                "telegram_id": contact.get('telegram_id', 'N/A'),
                "error": str(e)
            })
            print(f"Error importing contact {contact.get('name', 'Unknown')}: {e}")

    # Step 4: Return statistics
    return stats


def query_falkordb(cypher: str, params: Optional[Dict] = None) -> List[Dict]:
    """
    Execute Cypher query against FalkorDB via REST API.

    Args:
        cypher: Cypher query string
        params: Query parameters (optional)

    Returns:
        List of result dictionaries
    """
    response = requests.post(
        FALKORDB_API_URL,
        headers={
            "Content-Type": "application/json",
            "X-API-Key": FALKORDB_API_KEY
        },
        json={
            "graph_name": GRAPH_NAME,
            "query": cypher,
            "params": params or {}
        },
        timeout=10
    )

    if response.status_code != 200:
        raise Exception(f"FalkorDB API error: {response.status_code} - {response.text}")

    return response.json().get("results", [])
```

---

### Step 3: Error Handling

**Error Case 1: Invalid JSON File**

**When:** JSON file cannot be parsed or has invalid structure
**Response:**
```python
- Catch: json.JSONDecodeError
- Log: "Invalid JSON in contacts file: {error details}"
- Emit: failure.emit{location: "import_contact_leads.py:25", reason: "JSON parse error"}
- Raise: ValueError with clear message
```

**Error Case 2: FalkorDB Connection Failure**

**When:** Cannot connect to FalkorDB REST API (network error, invalid API key)
**Response:**
```python
- Catch: requests.exceptions.RequestException
- Log: "FalkorDB connection failed: {error}"
- Emit: failure.emit{location: "falkordb_client.py:45", reason: "Connection failed"}
- Retry: 3 times with exponential backoff (1s, 2s, 4s)
- If all retries fail: Raise exception
```

**Error Case 3: Missing Required Field in Contact**

**When:** Contact object missing telegram_id, name, profile_type, etc.
**Response:**
```python
- Log: "Skipping contact due to missing field {field_name}"
- Increment stats["failed"]
- Append error to stats["errors"]
- Continue with next contact (don't stop entire import)
```

---

### Step 4: Edge Cases

**Edge Case 1: Duplicate telegram_ids**

**Handling:**
```python
- Before creating node, query FalkorDB for existing telegram_id
- If exists: UPDATE existing node instead of creating duplicate
- Increment stats["skipped_duplicates"]
- Log: "Updated existing contact {name} (telegram_id: {id})"
```

**Edge Case 2: Very long names (>255 characters)**

**Handling:**
```python
- Truncate name to 255 characters for slug generation
- Store full name in `name` property (no truncation)
- Log warning: "Contact name exceeds 255 chars, truncated for slug"
```

**Edge Case 3: Missing matching_messages array**

**Handling:**
```python
- Use contact.get('matching_messages', []) to default to empty array
- Don't fail import if matching_messages is missing
- Store empty array as JSON: "[]"
```

---

## Feature 2: QR Code Authentication

### Overview

**Purpose:** Generate QR code for team member to scan in Telegram app, authorize session, encrypt and store in FalkorDB

**Files to create/modify:**
- `backend/app/api/outreach/telegram/qr_auth.py` (QR auth endpoints)
- `backend/app/services/telegram_client.py` (Telethon client wrapper)
- `backend/app/services/encryption.py` (Fernet encryption for session strings)

---

### Step 1: Setup Phase

**Create file:** `backend/app/services/telegram_client.py`

**Imports/Dependencies:**
```python
from telethon import TelegramClient
from telethon.sessions import StringSession
import qrcode
import base64
import io
import os
from dotenv import load_dotenv
```

**Initialize:**
```python
load_dotenv()

TELEGRAM_API_ID = int(os.getenv("TELEGRAM_API_ID"))
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH")

if not TELEGRAM_API_ID or not TELEGRAM_API_HASH:
    raise EnvironmentError("Missing TELEGRAM_API_ID or TELEGRAM_API_HASH")
```

---

### Step 2: Core Logic - QR Code Generation

**Function:** `start_qr_auth(team_member_ref: str) -> dict`

**Pseudocode:**
```python
async function start_qr_auth(team_member_ref):
  1. Create Telethon client:
     - Use StringSession() (empty, no session yet)
     - Pass API_ID and API_HASH
     - Connect to Telegram

  2. Start QR login:
     - Call client.qr_login()
     - Get QR login object with .url and .token
     - QR URL contains tg://login?token={hex_token}

  3. Generate QR code image:
     - Create QR code from qr_login.url
     - Render as PNG image (PIL)
     - Convert PNG to base64 string
     - Prefix with "data:image/png;base64,"

  4. Store QR token temporarily:
     - Token = qr_login.token.hex()
     - Store in in-memory cache (Redis or Python dict)
     - TTL = 120 seconds (QR expires after 2 minutes)
     - Link token to team_member_ref

  5. Return response:
     - qr_code: base64 PNG image
     - token: hex string for polling
     - expires_in: 120 seconds
```

**Detailed Implementation:**

```python
async def start_qr_auth(team_member_ref: str) -> dict:
    """
    Start QR code authentication flow for Telegram.

    Args:
        team_member_ref: Team member slug (e.g., "team-member-nicolas")

    Returns:
        dict: {qr_code: base64 PNG, token: hex string, expires_in: seconds}
    """

    # Step 1: Create Telethon client
    client = TelegramClient(StringSession(), TELEGRAM_API_ID, TELEGRAM_API_HASH)
    await client.connect()

    # Step 2: Start QR login
    try:
        qr_login = await client.qr_login()
    except Exception as e:
        await client.disconnect()
        raise Exception(f"Failed to start QR login: {e}")

    # Step 3: Generate QR code image
    qr = qrcode.QRCode(
        version=1,  # Small QR code
        box_size=10,
        border=5
    )
    qr.add_data(qr_login.url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_bytes = buffered.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

    # Step 4: Store QR token for polling
    qr_token = qr_login.token.hex()

    # Store in in-memory cache (implementation depends on cache system)
    # For now, simple Python dict with cleanup task
    store_qr_token_in_cache(qr_token, {
        "team_member_ref": team_member_ref,
        "client": client,  # Keep client alive for polling
        "qr_login": qr_login,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(seconds=120)
    })

    # Step 5: Return response
    return {
        "qr_code": f"data:image/png;base64,{img_base64}",
        "token": qr_token,
        "expires_in": 120
    }
```

---

### Step 3: Core Logic - QR Authentication Polling

**Function:** `check_qr_auth(qr_token: str) -> dict`

**Pseudocode:**
```python
async function check_qr_auth(qr_token):
  1. Look up QR token in cache:
     - Retrieve stored data by token
     - If token not found: return {status: "expired"}
     - If token expired (>120s old): return {status: "expired"}

  2. Check if user scanned QR code:
     - Call qr_login.wait(timeout=1) to check for scan
     - Non-blocking check (1 second timeout)

  3. If user approved authorization:
     - Get session string from client
     - Encrypt session string (Fernet)
     - Create U4_Telegram_Session node in FalkorDB
     - Start monitoring for this session
     - Clear QR token from cache
     - Disconnect temporary client
     - Return {status: "authorized", session_id: ...}

  4. If still pending:
     - Return {status: "pending"}

  5. If QR expired without scan:
     - Clear QR token from cache
     - Disconnect client
     - Return {status: "expired"}
```

**Detailed Implementation:**

```python
async def check_qr_auth(qr_token: str) -> dict:
    """
    Poll QR authentication status.

    Args:
        qr_token: QR token from start_qr_auth

    Returns:
        dict: {status: "pending" | "authorized" | "expired", ...}
    """

    # Step 1: Look up token in cache
    qr_data = get_qr_token_from_cache(qr_token)

    if not qr_data:
        return {"status": "expired", "message": "QR token not found or expired"}

    # Check if expired
    if datetime.utcnow() > qr_data["expires_at"]:
        remove_qr_token_from_cache(qr_token)
        await qr_data["client"].disconnect()
        return {"status": "expired", "message": "QR code expired"}

    # Step 2: Check if user scanned QR code
    client = qr_data["client"]
    qr_login = qr_data["qr_login"]

    try:
        # Non-blocking check with 1s timeout
        await qr_login.wait(timeout=1)
    except asyncio.TimeoutError:
        # Still pending
        return {"status": "pending", "message": "Waiting for QR scan..."}

    # Step 3: User approved! Get session string
    try:
        session_string = client.session.save()  # Get session string

        # Encrypt session string
        from app.services.encryption import encrypt_session_string
        encrypted_session = encrypt_session_string(session_string)

        # Generate unique slug for session
        session_slug = f"telegram-session-{qr_data['team_member_ref']}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

        # Create U4_Telegram_Session node in FalkorDB
        create_session_query = """
        CREATE (s:U4_Telegram_Session {
            slug: $slug,
            session_string: $session_string,
            authorized_by: $authorized_by,
            qr_token: $qr_token,
            is_active: true,
            is_monitoring: true,
            created_at: $created_at,
            created_by: $created_by,
            updated_at: $updated_at,
            updated_by: $updated_by
        })
        RETURN s
        """

        query_falkordb(create_session_query, {
            "slug": session_slug,
            "session_string": encrypted_session,
            "authorized_by": qr_data["team_member_ref"],
            "qr_token": qr_token,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "created_by": qr_data["team_member_ref"],
            "updated_at": datetime.utcnow().isoformat() + "Z",
            "updated_by": qr_data["team_member_ref"]
        })

        # Step 4: Clean up
        remove_qr_token_from_cache(qr_token)
        await client.disconnect()

        # Step 5: Return success
        return {
            "status": "authorized",
            "message": "Telegram connected! Monitoring started.",
            "session_id": session_slug
        }

    except Exception as e:
        # Error during authorization
        await client.disconnect()
        raise Exception(f"Authorization failed: {e}")
```

---

### Step 4: Error Handling

**Error Case 1: Telegram API Connection Failure**

**When:** Cannot connect to Telegram servers
**Response:**
```python
- Catch: telethon.errors.ConnectionError
- Log: "Telegram connection failed: {error}"
- Emit: failure.emit{location: "telegram_client.py:45", reason: "Telegram API unreachable"}
- Return: HTTP 503 with {error: "Telegram service temporarily unavailable"}
```

**Error Case 2: QR Code Expired Before Scan**

**When:** User doesn't scan within 120 seconds
**Response:**
```python
- Remove token from cache
- Disconnect temporary Telethon client
- Return: HTTP 410 Gone with {status: "expired", message: "QR code expired. Please try again."}
```

**Error Case 3: Session Encryption Failure**

**When:** Fernet encryption fails (invalid key, corrupted data)
**Response:**
```python
- Catch: cryptography.fernet.InvalidToken
- Log: "Session encryption failed: {error}"
- Emit: failure.emit{location: "encryption.py:12", reason: "Encryption failed"}
- Disconnect client
- Raise: Exception("Critical: Session encryption failed")
```

---

### Step 5: Edge Cases

**Edge Case 1: Multiple QR Requests from Same User**

**Handling:**
```python
- Before creating new QR: Check if active QR token exists for team_member_ref
- If exists: Invalidate old token, create new one
- Log: "Replacing active QR token for {team_member_ref}"
```

**Edge Case 2: User Revokes Session in Telegram App**

**Handling:**
```python
- When background worker tries to use session: Catch AuthKeyUnregisteredException
- Update U4_Telegram_Session: is_active=false, is_monitoring=false
- Notify team member: "Your Telegram session was revoked. Please reconnect."
```

---

## Feature 3: Message Generation - Maya AI

### Overview

**Purpose:** Generate personalized outreach message for contact using Maya AI service

**Files to create/modify:**
- `backend/app/api/outreach/message_generation.py` (message generation endpoint)
- `backend/app/services/maya_ai.py` (Maya AI integration)
- `backend/app/services/message_personalizer.py` (find hooks, build prompts)

---

### Step 1: Setup Phase

**Create file:** `backend/app/services/message_personalizer.py`

**Imports/Dependencies:**
```python
import json
from typing import Dict, List, Optional
from datetime import datetime
```

**Initialize:**
```python
# No global state needed for this service
```

---

### Step 2: Core Logic - Find Best Hook

**Function:** `find_best_hook(matching_messages: List[dict], signals: dict) -> dict`

**Pseudocode:**
```python
function find_best_hook(matching_messages, signals):
  1. Score each matching message:
     - Calculate hook_score based on:
       - Signal type strength (hustler > supervisor > geographic_fit > etc.)
       - Message recency (newer messages score higher)
       - Message length (50-200 chars is ideal, too short/long scores lower)

  2. Sort messages by hook_score (highest first)

  3. Return best scoring message:
     - If no matching_messages: return None (use generic template)
     - Otherwise: return highest-scoring message
```

**Detailed Implementation:**

```python
def find_best_hook(matching_messages: List[dict], signals: dict) -> Optional[dict]:
    """
    Find the best message to use as a personalization hook.

    Args:
        matching_messages: Array of message references from analysis
        signals: Dict of signals from contact analysis

    Returns:
        Best message dict or None if no good hooks
    """

    if not matching_messages:
        return None

    # Signal type scores (higher = better hook)
    signal_scores = {
        "hustler": 10,
        "supervisor": 9,
        "raider": 8,
        "moderator": 7,
        "geographic_fit": 5,
        "project_experience": 6,
        "default": 3
    }

    scored_messages = []

    for msg in matching_messages:
        signal_type = msg.get("signal_type", "default")
        text_snippet = msg.get("text_snippet", "")
        date_str = msg.get("date", "")

        # Calculate hook score
        score = 0

        # Signal type score
        score += signal_scores.get(signal_type, signal_scores["default"])

        # Message length score (prefer 50-200 chars)
        text_len = len(text_snippet)
        if 50 <= text_len <= 200:
            score += 5
        elif text_len < 50:
            score += 2
        else:
            score += 3

        # Recency score (newer is better, but not critical)
        # Simple heuristic: messages from 2024 get +2, 2023 get +1
        if "2024" in date_str:
            score += 2
        elif "2023" in date_str:
            score += 1

        scored_messages.append({
            "message": msg,
            "score": score
        })

    # Sort by score (highest first)
    scored_messages.sort(key=lambda x: x["score"], reverse=True)

    # Return best message
    return scored_messages[0]["message"]
```

---

### Step 3: Core Logic - Generate Message

**Function:** `generate_outreach_message(contact_data: dict) -> dict`

**Pseudocode:**
```python
async function generate_outreach_message(contact_data):
  1. Find best hook from matching_messages:
     - Call find_best_hook(matching_messages, signals)
     - If no hook found: use generic template

  2. Build Maya AI prompt:
     - Include: name, profile_type, hook text, signals
     - Specify constraints: <500 chars, include CTA, reference activity

  3. Call Maya AI service:
     - POST to Maya endpoint (or invoke Claude Code)
     - Timeout: 10 seconds
     - If timeout: fallback to generic template

  4. Validate generated message:
     - Check length <500 characters
     - Check includes contact name or "you"
     - Check has question mark or CTA phrase

  5. Create U4_Outreach_Message node:
     - Store message_text, personalization_context, generated_by
     - Link to U4_Contact_Lead via HAS_MESSAGE relationship

  6. Return response:
     - message_id, message_text, personalization_context, generated_by
```

**Detailed Implementation:**

```python
async def generate_outreach_message(contact_data: dict) -> dict:
    """
    Generate personalized outreach message using Maya AI.

    Args:
        contact_data: Contact node data from FalkorDB

    Returns:
        dict: {message_id, message_text, personalization_context, generated_by}
    """

    # Step 1: Find best hook
    matching_messages = json.loads(contact_data.get("matching_messages", "[]"))
    analysis_data = json.loads(contact_data.get("analysis_data", "{}"))
    signals = analysis_data.get("signals", {})

    best_hook = find_best_hook(matching_messages, signals)

    # Step 2: Build prompt for Maya
    if best_hook:
        hook_text = best_hook.get("text_snippet", "")
        prompt = f"""
Generate a personalized Telegram outreach message for:

Name: {contact_data['name']}
Profile Type: {contact_data['profile_type']}
Signals: {', '.join(signals.keys())}
Hook (their actual activity): "{hook_text}"

Message requirements:
1. Reference their specific activity from the hook
2. Explain ScopeLock: AI-assisted agency helping junior devs build real projects with AI guidance
3. Include clear call-to-action (e.g., "Interested in hearing more?")
4. Keep it under 500 characters
5. Be conversational and friendly, not salesy

Example tone: "Hey Liam, saw you grinding those 100 retweets for UBC. Noticed you're into earning opportunities. We're ScopeLock – helping junior devs build client projects with AI. Want to hear more?"
"""
    else:
        # No good hook, use generic template
        prompt = f"""
Generate a personalized Telegram outreach message for:

Name: {contact_data['name']}
Profile Type: {contact_data['profile_type']}

Message requirements:
1. Generic but personalized greeting
2. Explain ScopeLock: AI-assisted agency helping junior devs build real projects
3. Include clear call-to-action
4. Keep it under 500 characters
5. Be conversational and friendly
"""

    # Step 3: Call Maya AI
    try:
        # Timeout after 10 seconds
        message_text = await asyncio.wait_for(
            call_maya_ai(prompt),
            timeout=10.0
        )
        generated_by = "maya"

    except asyncio.TimeoutError:
        # Fallback to generic template
        message_text = generate_generic_template(contact_data)
        generated_by = "generic-template"

    # Step 4: Validate message
    if len(message_text) > 500:
        message_text = message_text[:497] + "..."  # Truncate with ellipsis

    # Step 5: Create U4_Outreach_Message node
    message_slug = f"message-{contact_data['slug']}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    personalization_context = {
        "hook": best_hook if best_hook else None,
        "signals_used": list(signals.keys()),
        "message_referenced": bool(best_hook)
    }

    create_message_query = """
    MATCH (c:U4_Contact_Lead {slug: $contact_slug})
    CREATE (m:U4_Outreach_Message {
        slug: $message_slug,
        message_text: $message_text,
        generated_by: $generated_by,
        personalization_context: $personalization_context,
        is_sent: false,
        created_at: $created_at,
        created_by: $created_by,
        updated_at: $updated_at,
        updated_by: $updated_by
    })
    CREATE (m)-[:HAS_MESSAGE]->(c)
    RETURN m
    """

    query_falkordb(create_message_query, {
        "contact_slug": contact_data["slug"],
        "message_slug": message_slug,
        "message_text": message_text,
        "generated_by": generated_by,
        "personalization_context": json.dumps(personalization_context),
        "created_at": datetime.utcnow().isoformat() + "Z",
        "created_by": "maya-ai-service",
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "updated_by": "maya-ai-service"
    })

    # Step 6: Return response
    return {
        "message_id": message_slug,
        "message_text": message_text,
        "personalization_context": personalization_context,
        "generated_by": generated_by,
        "generated_at": datetime.utcnow().isoformat() + "Z"
    }


def generate_generic_template(contact_data: dict) -> str:
    """
    Generate generic fallback template when Maya times out.

    Args:
        contact_data: Contact info

    Returns:
        Generic message string
    """
    name = contact_data['name']
    profile_type = contact_data['profile_type']

    return f"Hey {name}, came across your profile and noticed your {profile_type} skills. We're ScopeLock – an AI-human agency helping junior developers build real projects with AI guidance. Interested in hearing more about joining our team? Let me know!"


async def call_maya_ai(prompt: str) -> str:
    """
    Call Maya AI service to generate message.

    Implementation TBD: Either REST API or Claude Code invocation.

    Args:
        prompt: Generation prompt

    Returns:
        Generated message text
    """
    # TODO: Implement Maya AI integration
    # Option 1: REST API call
    # Option 2: Claude Code subprocess invocation

    # Placeholder implementation
    import subprocess

    # Example using Claude Code (adjust path as needed)
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True,
        timeout=10
    )

    if result.returncode == 0:
        return result.stdout.strip()
    else:
        raise Exception(f"Maya AI failed: {result.stderr}")
```

---

### Step 4: Error Handling

**Error Case 1: Maya AI Timeout**

**When:** Maya AI doesn't respond within 10 seconds
**Response:**
```python
- Catch: asyncio.TimeoutError
- Log: "Maya AI timed out after 10s"
- Fallback: Use generate_generic_template()
- Set generated_by: "generic-template"
- Include warning in response: {warning: "Maya AI timed out, using generic template"}
```

**Error Case 2: Invalid Contact Data**

**When:** Contact missing required fields (name, profile_type)
**Response:**
```python
- Validate contact_data before proceeding
- If missing fields: raise ValueError("Missing required contact fields")
- HTTP 400: {error: "Invalid contact data"}
```

---

### Step 5: Edge Cases

**Edge Case 1: No Matching Messages**

**Handling:**
```python
- find_best_hook() returns None
- Use generic template prompt (no hook reference)
- Set personalization_context.message_referenced = false
```

**Edge Case 2: Generated Message Too Long (>500 chars)**

**Handling:**
```python
- Truncate to 497 characters
- Append "..." to indicate truncation
- Log warning: "Maya generated message exceeded 500 chars, truncated"
```

---

*Due to response length limits, I'll continue with the remaining features (4-7), database operations, and testing hooks in the next part. Let me create the complete ALGORITHM.md file with all sections.*
