# MECHANISM: Telegram Outreach System

**Mission:** Team Member Hunting via Telegram
**Purpose:** High-level architecture, technology choices, and system design
**Date Created:** 2025-11-07

---

## Architecture Overview

The Telegram Outreach System enables ScopeLock team members to systematically discover, contact, and track conversations with potential team members identified from Telegram message history.

**System Components:**

- **Frontend (Next.js):** Mission Deck integration with QR code auth UI, outreach queue dashboard, conversation list
- **Backend API (FastAPI):** REST endpoints for data ingestion, message generation, Telegram session management
- **Graph Database (FalkorDB):** Contact leads, messages, sessions, conversations, replies stored as graph nodes
- **Background Worker (AsyncIO):** Polls Telegram conversations every 60s to detect replies
- **Maya AI Service:** Generates personalized outreach messages using contact analysis data
- **Telegram Reader (Telethon):** Read-only Telegram client for QR auth and reply monitoring

**Data Flow:**

```
[Team Member] → [Mission Deck UI] → [FastAPI Backend] → [FalkorDB Graph]
                       ↓                    ↓
               [QR Code Display]    [Maya AI Service]
                       ↓                    ↓
            [Telegram App Scan]    [Message Generation]
                       ↓
         [Telethon Background Worker] ← polls every 60s → [Telegram API]
```

**Workflow:**

1. **Data Ingestion:** Import 313 contact leads from `team_members.json` → Create U4_Contact_Lead nodes in FalkorDB
2. **QR Auth:** Team member clicks "Connect Telegram" → QR code displayed → Scan in Telegram app → Session encrypted and stored
3. **Message Generation:** Team member selects contact → Maya AI generates personalized message → Preview in UI
4. **Manual Send:** Team member copies message → Sends via Telegram app manually (ToS compliant) → Marks as sent in dashboard
5. **Reply Monitoring:** Background worker polls conversations → Detects new replies → Notifies team member

**Critical Design Decision: Read-Only + Manual Send**

- **Problem:** Automated sending from user accounts violates Telegram ToS → account bans
- **Solution:** Hybrid approach - system monitors (read-only), human sends manually
- **Result:** ToS compliant, 90% effort reduction (AI generates messages), zero ban risk

---

## Technology Stack

**IMPORTANT:** Aligns with standard ScopeLock stack. See `docs/core/tech-stack.md`.

### Frontend

**Framework:** Next.js 14 (App Router)
**Language:** TypeScript
**Deployment:** Vercel (existing Mission Deck deployment)
**Integration:** Embedded as new mission in Mission Deck

**Why this choice:**
- **Standard ScopeLock stack:** Matches existing Mission Deck architecture
- **Zero additional deployment:** Integrates into current Vercel deployment
- **Reuses auth:** Mission Deck authentication already implemented
- **Component reuse:** Dashboard layout patterns already exist (Rafael/Sofia workspaces)

**Components:**
- `OutreachDashboard.tsx` - Main mission page (queue, stats)
- `TelegramConnect.tsx` - QR code modal
- `OutreachQueue.tsx` - Pending contacts table
- `MessageGenerator.tsx` - Maya AI message preview
- `ConversationList.tsx` - Reply notifications

---

### Backend

**Framework:** FastAPI 0.104+
**Language:** Python 3.11
**Deployment:** Render (existing backend)

**Why this choice:**
- **Standard ScopeLock stack:** Python backend on Render
- **Async support:** FastAPI + AsyncIO for background monitoring worker
- **Telethon integration:** Python library for Telegram MTProto API
- **Existing backend:** Extends current FastAPI backend (no new deployment)

**Dependencies:**
- `fastapi` - Web framework
- `telethon` - Telegram MTProto API client
- `qrcode` - QR code generation
- `cryptography` - Fernet encryption for session strings
- `requests` - FalkorDB REST API calls
- `python-dotenv` - Environment variable management

---

### Database

**Type:** FalkorDB (Graph Database)
**Access Method:** REST API (existing production instance)
**Hosting:** Render (mindprotocol.onrender.com)

**Why this choice:**
- **Project architecture decision:** Per user requirement (not PostgreSQL)
- **Existing infrastructure:** FalkorDB already deployed for Mission Deck
- **Graph relationships:** Natural fit for contact networks (who knows who, conversation threads)
- **Mind Protocol v2 standard:** All nodes follow universal attribute pattern

**Graph Schema:** See Database Schema section below

---

### AI & External Services

**Maya AI Service:**
- **Purpose:** Generate personalized outreach messages
- **Integration:** TBD (either REST endpoint or Claude Code integration)
- **Input:** Contact data (name, profile_type, signals, matching_messages)
- **Output:** Personalized message text (<500 chars) + personalization context

**Telegram API (Read-Only):**
- **Library:** Telethon (Python MTProto client)
- **Authentication:** QR code (no phone code sharing)
- **Permissions:** Read-only (getMessage, getDialogs, getHistory)
- **Rate Limits:** 30 requests/second (Telegram API limit)
- **Compliance:** Manual send workflow ensures ToS compliance

**No Image/Voice Generation:**
- This mission does not require Ideogram or Eleven Labs
- Pure text-based outreach

---

## Database Schema

**Graph Database:** FalkorDB using Cypher query language

**Mind Protocol v2 Universal Attributes (all nodes):**
```
created_at: DATETIME (when node created)
created_by: STRING (team member or system that created node)
updated_at: DATETIME (last modification)
updated_by: STRING (who last updated)
slug: STRING (unique identifier, kebab-case)
```

### Node Types

#### Node: U4_Contact_Lead

**Purpose:** Store potential team member contact data from Telegram analysis

**Properties:**
- `slug`: STRING (unique ID, e.g., "contact-liam-7944133972")
- `telegram_id`: INTEGER (numeric Telegram user ID - permanent identifier)
- `chat_type`: STRING ("personal_chat", "group", "channel")
- `name`: STRING (display name from Telegram export)
- `profile_type`: STRING ("supervisor", "hustler", "both", "unknown")
- `supervisor_score`: INTEGER (0-15, from analysis)
- `hustler_score`: INTEGER (0-15, from analysis)
- `outreach_status`: STRING ("pending", "contacted", "replied", "rejected")
- `contacted_at`: DATETIME (when message was sent)
- `replied_at`: DATETIME (when first reply received)
- `analysis_data`: JSON (full analysis output including signals, sample_messages)
- `matching_messages`: JSON ARRAY (message references with message_id, date, text_snippet, signal_type)
- Mind Protocol v2 universal attributes

**Indexes:**
- Primary: `slug`
- Unique: `telegram_id` (prevent duplicates)
- Query: `outreach_status` (for queue filtering)

**Example Node:**
```cypher
CREATE (c:U4_Contact_Lead {
  slug: "contact-liam-7944133972",
  telegram_id: 7944133972,
  chat_type: "personal_chat",
  name: "Liam",
  profile_type: "hustler",
  supervisor_score: 1,
  hustler_score: 15,
  outreach_status: "pending",
  analysis_data: {...},
  matching_messages: [
    {message_id: 123, date: "2024-11-01", text_snippet: "Completed 100 retweets", signal_type: "hustler"}
  ],
  created_at: datetime("2025-11-07T10:00:00Z"),
  created_by: "data-ingestion-script"
})
```

---

#### Node: U4_Outreach_Message

**Purpose:** Store generated and sent outreach messages

**Properties:**
- `slug`: STRING (unique ID, e.g., "message-contact-liam-2025-11-07")
- `message_text`: STRING (actual message content, <500 chars)
- `generated_by`: STRING ("maya" or "generic-template")
- `personalization_context`: JSON ({hook: {...}, signals_used: [...], message_referenced: {...}})
- `is_sent`: BOOLEAN (false until team member marks as sent)
- `sent_at`: DATETIME (when marked as sent)
- `sent_by`: STRING (team member ref who sent it)
- Mind Protocol v2 universal attributes

**Relationships:**
- `(U4_Outreach_Message)-[:HAS_MESSAGE]->(U4_Contact_Lead)` - Links message to contact

**Example Node:**
```cypher
CREATE (m:U4_Outreach_Message {
  slug: "message-contact-liam-2025-11-07",
  message_text: "Hey Liam, saw you grinding those 100 retweets for UBC...",
  generated_by: "maya",
  personalization_context: {hook: "Completed 100 retweets", signals_used: ["hustler", "raider"]},
  is_sent: false,
  created_at: datetime("2025-11-07T10:05:00Z"),
  created_by: "team-member-nicolas"
})
```

---

#### Node: U4_Telegram_Session

**Purpose:** Store encrypted Telegram session for background monitoring

**Properties:**
- `slug`: STRING (unique ID, e.g., "telegram-session-nicolas-2025-11-07")
- `session_string`: STRING (Fernet-encrypted Telethon session string)
- `authorized_by`: STRING (team member ref who connected Telegram)
- `qr_token`: STRING (hex token from QR auth, for polling)
- `is_active`: BOOLEAN (true if session valid, false if disconnected)
- `is_monitoring`: BOOLEAN (true if background worker should poll this session)
- `disconnected_at`: DATETIME (when session was disconnected)
- Mind Protocol v2 universal attributes

**Security:**
- `session_string` field is ALWAYS encrypted (Fernet) before storage
- Decryption happens only in memory when needed for Telethon connection
- Encryption key stored in environment variable `FERNET_ENCRYPTION_KEY`

**Example Node:**
```cypher
CREATE (s:U4_Telegram_Session {
  slug: "telegram-session-nicolas-2025-11-07",
  session_string: "gAAAAABmXYZ...",  # Encrypted!
  authorized_by: "team-member-nicolas",
  qr_token: "a1b2c3d4...",
  is_active: true,
  is_monitoring: true,
  created_at: datetime("2025-11-07T10:10:00Z"),
  created_by: "qr-auth-handler"
})
```

---

#### Node: U4_Telegram_Conversation

**Purpose:** Track active conversations being monitored for replies

**Properties:**
- `slug`: STRING (unique ID, e.g., "conv-liam-7944133972")
- `contact_telegram_id`: INTEGER (matches U4_Contact_Lead.telegram_id)
- `last_message_id`: INTEGER (last Telegram message ID seen, for polling incremental)
- `unread_count`: INTEGER (number of unread replies)
- `conversation_status`: STRING ("active", "paused", "closed")
- Mind Protocol v2 universal attributes

**Relationships:**
- `(U4_Telegram_Conversation)-[:U4_PART_OF]->(U4_Telegram_Session)` - Links conversation to session
- `(U4_Telegram_Conversation)-[:U4_WITH]->(U4_Contact_Lead)` - Links conversation to contact

**Example Node:**
```cypher
CREATE (conv:U4_Telegram_Conversation {
  slug: "conv-liam-7944133972",
  contact_telegram_id: 7944133972,
  last_message_id: 98765,
  unread_count: 0,
  conversation_status: "active",
  created_at: datetime("2025-11-07T10:15:00Z"),
  created_by: "monitoring-worker"
})
```

---

#### Node: U4_Telegram_Reply

**Purpose:** Store replies received from contacts

**Properties:**
- `slug`: STRING (unique ID, e.g., "reply-liam-99999")
- `telegram_message_id`: INTEGER (Telegram's message ID)
- `message_text`: STRING (actual reply content)
- `received_at`: DATETIME (when reply was sent by contact)
- `detected_at`: DATETIME (when our worker detected it)
- `is_read`: BOOLEAN (has team member viewed this reply?)
- `sentiment`: STRING ("positive", "neutral", "negative", "unknown")
- Mind Protocol v2 universal attributes

**Relationships:**
- `(U4_Telegram_Reply)-[:REPLY_TO]->(U4_Outreach_Message)` - Links reply to original message
- `(U4_Telegram_Reply)-[:U4_PART_OF]->(U4_Telegram_Conversation)` - Links reply to conversation

**Example Node:**
```cypher
CREATE (r:U4_Telegram_Reply {
  slug: "reply-liam-99999",
  telegram_message_id: 99999,
  message_text: "Yes, I'm interested! Tell me more.",
  received_at: datetime("2025-11-07T14:30:00Z"),
  detected_at: datetime("2025-11-07T14:31:23Z"),
  is_read: false,
  sentiment: "positive",
  created_at: datetime("2025-11-07T14:31:23Z"),
  created_by: "monitoring-worker"
})
```

---

### Relationships Summary

```
(U4_Contact_Lead)-[:U4_HAS_MESSAGE]-(U4_Outreach_Message)
(U4_Outreach_Message)-[:REPLY_TO]-(U4_Telegram_Reply)
(U4_Telegram_Session)-[:U4_PART_OF]-(U4_Telegram_Conversation)
(U4_Contact_Lead)-[:U4_WITH]-(U4_Telegram_Conversation)
(U4_Telegram_Conversation)-[:U4_PART_OF]-(U4_Telegram_Reply)
```

---

## API Design

**Base URL:** `https://backend.scopelock.mindprotocol.ai/api/outreach` (or existing backend URL)

**Authentication:** Reuses Mission Deck JWT authentication (Bearer token in Authorization header)

**FalkorDB Access Pattern:**

All endpoints interact with FalkorDB via REST API:

```python
import requests

FALKORDB_API_URL = "https://mindprotocol.onrender.com/admin/query"
FALKORDB_API_KEY = os.getenv("FALKORDB_API_KEY")
GRAPH_NAME = "scopelock"

def query_falkordb(cypher: str, params: dict = None):
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
    return response.json().get("results", [])
```

---

### Endpoints

#### `GET /api/outreach/queue`

**Purpose:** Get list of pending contacts sorted by score (for outreach queue dashboard)

**Authentication:** Required (team member JWT)

**Query Parameters:**
- `profile_type` (optional): Filter by "supervisor", "hustler", "both", "unknown"
- `min_score` (optional): Minimum supervisor_score + hustler_score threshold
- `limit` (optional): Number of results (default: 20, for pagination)
- `offset` (optional): Skip N results (for pagination)

**Response (Success):**
```json
{
  "contacts": [
    {
      "id": "contact-liam-7944133972",
      "name": "Liam",
      "telegram_id": 7944133972,
      "profile_type": "hustler",
      "supervisor_score": 1,
      "hustler_score": 15,
      "total_score": 16,
      "top_signals": ["raider", "hustler"],
      "sample_messages": ["Completed 100 retweets", "Ready for more tasks"],
      "outreach_status": "pending"
    }
  ],
  "total_count": 313,
  "filtered_count": 250
}
```

**Cypher Query:**
```cypher
MATCH (c:U4_Contact_Lead)
WHERE c.outreach_status = 'pending'
  AND ($profile_type IS NULL OR c.profile_type = $profile_type)
  AND (c.supervisor_score + c.hustler_score >= $min_score)
RETURN c
ORDER BY (c.supervisor_score + c.hustler_score) DESC
SKIP $offset
LIMIT $limit
```

---

#### `POST /api/outreach/generate-message/{contact_id}`

**Purpose:** Generate personalized outreach message for contact using Maya AI

**Authentication:** Required

**Path Parameters:**
- `contact_id`: Contact slug (e.g., "contact-liam-7944133972")

**Request Body:** None (contact data fetched from FalkorDB)

**Response (Success):**
```json
{
  "message_id": "message-contact-liam-2025-11-07",
  "message_text": "Hey Liam, saw you grinding those 100 retweets for UBC. Noticed you're interested in earning opportunities. We're ScopeLock – AI-assisted agency helping junior devs build real projects with AI. Interested in hearing more? Let me know!",
  "personalization_context": {
    "hook": {
      "message_id": 123,
      "text_snippet": "Completed 100 retweets for UBC",
      "signal_type": "hustler"
    },
    "signals_used": ["hustler", "raider"],
    "message_referenced": true
  },
  "generated_by": "maya",
  "generated_at": "2025-11-07T10:05:00Z"
}
```

**Response (Timeout Fallback):**
```json
{
  "message_id": "message-contact-liam-2025-11-07",
  "message_text": "Hey Liam, I came across your profile and thought you'd be a great fit for ScopeLock...",
  "warning": "Maya AI timed out, using generic template",
  "generated_by": "generic-template"
}
```

**Backend Flow:**
1. Query FalkorDB for contact data
2. Call Maya AI service with contact context
3. Create U4_Outreach_Message node in FalkorDB
4. Return message to frontend

**Maya AI Integration:**
```python
async def generate_message(contact_data: dict) -> dict:
    # Find best hook from matching_messages
    hook = find_best_hook(contact_data["matching_messages"], contact_data["signals"])

    # Build prompt for Maya
    prompt = f"""
    Generate a personalized Telegram outreach message for:
    Name: {contact_data["name"]}
    Profile: {contact_data["profile_type"]}
    Hook: "{hook["text_snippet"]}"

    Message should:
    - Reference their specific activity
    - Explain ScopeLock value prop
    - Be <500 characters
    - Have clear CTA
    """

    # Call Maya (implementation TBD - either REST or Claude Code)
    message_text = await call_maya_service(prompt)

    return {
        "message_text": message_text,
        "personalization_context": {
            "hook": hook,
            "signals_used": list(contact_data["signals"].keys())
        }
    }
```

---

#### `POST /api/outreach/mark-sent`

**Purpose:** Mark message as sent after team member manually sends it via Telegram app

**Authentication:** Required

**Request Body:**
```json
{
  "contact_id": "contact-liam-7944133972",
  "message_id": "message-contact-liam-2025-11-07"
}
```

**Response (Success):**
```json
{
  "success": true,
  "contact_status": "contacted",
  "sent_at": "2025-11-07T10:20:00Z"
}
```

**Cypher Queries:**
```cypher
// Update message node
MATCH (m:U4_Outreach_Message {slug: $message_id})
SET m.is_sent = true,
    m.sent_at = datetime(),
    m.sent_by = $team_member_ref,
    m.updated_at = datetime()

// Update contact node
MATCH (c:U4_Contact_Lead {slug: $contact_id})
SET c.outreach_status = 'contacted',
    c.contacted_at = datetime(),
    c.updated_at = datetime()
```

---

#### `GET /api/outreach/conversations`

**Purpose:** Get list of active conversations with unread counts (for reply notifications)

**Authentication:** Required

**Query Parameters:**
- `unread_only` (optional): Boolean, show only conversations with unread replies

**Response (Success):**
```json
{
  "conversations": [
    {
      "conversation_id": "conv-liam-7944133972",
      "contact": {
        "id": "contact-liam-7944133972",
        "name": "Liam",
        "telegram_id": 7944133972
      },
      "unread_count": 2,
      "last_reply_at": "2025-11-07T14:30:00Z",
      "last_reply_preview": "Yes, I'm interested! Tell me more.",
      "conversation_status": "active"
    }
  ],
  "total_unread": 5
}
```

**Cypher Query:**
```cypher
MATCH (conv:U4_Telegram_Conversation)-[:U4_WITH]->(c:U4_Contact_Lead)
WHERE conv.conversation_status = 'active'
  AND ($unread_only IS NULL OR conv.unread_count > 0)
OPTIONAL MATCH (conv)-[:U4_PART_OF]-(r:U4_Telegram_Reply)
WITH conv, c, r
ORDER BY r.received_at DESC
RETURN conv, c, collect(r)[0] as latest_reply
```

---

#### `POST /api/outreach/telegram/qr-start`

**Purpose:** Start QR code authentication flow for team member to connect Telegram

**Authentication:** Required

**Request Body:** None (team member identified from JWT)

**Response (Success):**
```json
{
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "token": "a1b2c3d4e5f6...",
  "expires_in": 120
}
```

**Backend Flow:**
1. Create Telethon client with StringSession
2. Call `client.qr_login()` to get QR login object
3. Generate QR code image from `qr_login.url`
4. Convert image to base64 PNG
5. Store QR token temporarily (in-memory cache or short-lived DB entry)
6. Return QR code + token to frontend

**Implementation:**
```python
from telethon import TelegramClient
from telethon.sessions import StringSession
import qrcode
import base64
import io

async def start_qr_auth(team_member_ref: str) -> dict:
    client = TelegramClient(StringSession(), API_ID, API_HASH)
    await client.connect()

    # Start QR login
    qr_login = await client.qr_login()

    # Generate QR code image
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_login.url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    # Convert to base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    # Store token for polling
    qr_token = qr_login.token.hex()
    store_qr_token(qr_token, team_member_ref, expiry=120)

    return {
        "qr_code": f"data:image/png;base64,{img_str}",
        "token": qr_token,
        "expires_in": 120
    }
```

---

#### `GET /api/outreach/telegram/qr-check/{token}`

**Purpose:** Poll QR authentication status (frontend calls every 2 seconds until scanned)

**Authentication:** Required

**Path Parameters:**
- `token`: QR token from qr-start response

**Response (Pending):**
```json
{
  "status": "pending",
  "message": "Waiting for QR scan..."
}
```

**Response (Authorized):**
```json
{
  "status": "authorized",
  "message": "Telegram connected! Monitoring started.",
  "session_id": "telegram-session-nicolas-2025-11-07"
}
```

**Response (Expired):**
```json
{
  "status": "expired",
  "message": "QR code expired. Please try again."
}
```
**HTTP Status:** 410 Gone

**Backend Flow:**
1. Look up QR token (check if exists and not expired)
2. Check if Telegram authorization completed (via Telethon)
3. If authorized:
   - Get session string from Telethon client
   - Encrypt session string with Fernet
   - Create U4_Telegram_Session node in FalkorDB
   - Start monitoring for this session
   - Return success
4. If pending: Return "pending"
5. If expired: Return 410 Gone

---

#### `POST /api/outreach/telegram/disconnect`

**Purpose:** Disconnect Telegram session and stop monitoring

**Authentication:** Required

**Request Body:**
```json
{
  "session_id": "telegram-session-nicolas-2025-11-07"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Telegram disconnected. Monitoring stopped."
}
```

**Backend Flow:**
1. Query FalkorDB for session node
2. Decrypt session string
3. Create Telethon client with decrypted session
4. Log out from Telegram (`await client.log_out()`)
5. Update U4_Telegram_Session node: `is_active=false`, `is_monitoring=false`, `disconnected_at=now()`
6. Background worker automatically stops polling this session

**Cypher Query:**
```cypher
MATCH (s:U4_Telegram_Session {slug: $session_id})
SET s.is_active = false,
    s.is_monitoring = false,
    s.disconnected_at = datetime(),
    s.updated_at = datetime()
```

---

## External Integrations

### Telegram API (via Telethon)

**Purpose:** Read-only access to user's Telegram account for reply monitoring

**API:** Telegram MTProto API (via Telethon Python library)
**Documentation:** https://docs.telethon.dev/

**Authentication:**
- Method: QR code (no phone code sharing)
- User scans QR code in Telegram app
- Telegram shows "Link 'ScopeLock Dashboard'?" dialog
- User approves → session string returned
- Session string encrypted and stored in FalkorDB

**Rate Limits:**
- 30 requests/second (Telegram API enforced)
- Background worker respects limits with 60s polling interval

**Integration Points:**

1. **QR Code Authentication** (`POST /api/outreach/telegram/qr-start`)
   - Calls `client.qr_login()` to generate QR code
   - Returns QR code image to frontend

2. **Background Monitoring Worker** (AsyncIO loop)
   - Polls conversations every 60 seconds
   - Calls `client.get_messages(contact, limit=100)` to check for new messages
   - Detects replies by comparing message IDs

**Permissions:** Read-only
- Can: `getDialogs`, `getMessages`, `getHistory`, check authorization status
- Cannot: `sendMessage`, `deleteMessage`, `editMessage` (ToS compliance)

**Error Handling:**
- Rate limit errors: Backoff with exponential retry
- Session invalid: Notify team member to reconnect
- Network errors: Retry 3 times, then skip this poll cycle

---

### Maya AI Service

**Purpose:** Generate personalized outreach messages

**Integration Method:** **Claude Code subprocess invocation** (approved by NLR 2025-11-07)

**Why Claude Code subprocess:**
- Budget compliance: Uses subscription, not pay-per-token API costs
- Simpler deployment: No separate service to deploy
- Existing infrastructure: Claude Code already authenticated on backend
- Standard ScopeLock pattern: Internal AI calls via Claude Code

**Implementation:**
```python
import subprocess
import asyncio

async def call_maya_ai(prompt: str) -> str:
    """
    Call Claude Code via subprocess for message generation.

    Args:
        prompt: Generation prompt with contact context

    Returns:
        Generated message text

    Raises:
        Exception: If Claude Code fails or times out
    """
    try:
        # Run Claude Code with prompt
        result = await asyncio.create_subprocess_exec(
            "claude",
            "-p", prompt,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd="/home/mind-protocol/scopelock"  # Project root for context
        )

        stdout, stderr = await asyncio.wait_for(
            result.communicate(),
            timeout=10.0  # 10 second timeout
        )

        if result.returncode == 0:
            return stdout.decode('utf-8').strip()
        else:
            raise Exception(f"Claude Code failed: {stderr.decode('utf-8')}")

    except asyncio.TimeoutError:
        raise Exception("Claude Code timed out after 10 seconds")
```

**Input Prompt Format:**
```
Generate a personalized Telegram outreach message for:

Name: Liam
Profile Type: hustler
Signals: raider, hustler
Hook (their actual activity): "Completed 100 retweets for UBC"

Message requirements:
1. Reference their specific activity from the hook
2. Explain ScopeLock: AI-assisted agency helping junior devs build real projects with AI guidance
3. Include clear call-to-action (e.g., "Interested in hearing more?")
4. Keep it under 500 characters
5. Be conversational and friendly, not salesy

Example tone: "Hey Liam, saw you grinding those 100 retweets for UBC. Noticed you're into earning opportunities. We're ScopeLock – helping junior devs build client projects with AI. Want to hear more?"
```

**Output:**
```
Hey Liam, saw you grinding those 100 retweets for UBC. Noticed you're into earning opportunities. We're ScopeLock – helping junior devs build client projects with AI. Want to hear more?
```

**Timeout:** 10 seconds (fallback to generic template if subprocess times out)

**Fallback Template:**
```
Hey {name}, came across your profile and noticed your {profile_type} skills. We're ScopeLock – an AI-human agency helping junior developers build real projects with AI guidance. Interested in hearing more about joining our team? Let me know!
```

**Environment Requirements:**
- Claude CLI must be authenticated on backend server
- CLAUDE_CREDENTIALS env var set in Render (already configured)
- Working directory: /home/mind-protocol/scopelock (for project context)

---

## Security Approach

### Authentication

**Method:** JWT tokens (reuses Mission Deck authentication)

**Token Storage:** httpOnly cookies (frontend)

**Token Expiry:** Inherits Mission Deck token expiry (24 hours)

**Authorization:**
- Only authenticated team members can access Telegram outreach mission
- Team members can only see their own Telegram sessions (not others')
- No separate authorization levels (all team members have same access)

---

### Data Protection

**Session String Encryption:**
- **Algorithm:** Fernet (symmetric encryption)
- **Key:** 32-byte key stored in environment variable `FERNET_ENCRYPTION_KEY`
- **Storage:** Encrypted session strings stored in FalkorDB `session_string` field
- **Decryption:** Only happens in memory when needed for Telethon connection, never logged

**Encryption Implementation:**
```python
from cryptography.fernet import Fernet
import os

FERNET_KEY = os.getenv("FERNET_ENCRYPTION_KEY").encode()
cipher_suite = Fernet(FERNET_KEY)

def encrypt_session_string(session_string: str) -> str:
    encrypted = cipher_suite.encrypt(session_string.encode())
    return encrypted.decode()

def decrypt_session_string(encrypted_string: str) -> str:
    decrypted = cipher_suite.decrypt(encrypted_string.encode())
    return decrypted.decode()
```

**Data in Transit:**
- HTTPS enforced for all API endpoints (Render + Vercel HTTPS by default)
- Telegram API uses MTProto encryption (built into Telethon)

**Secrets Never Logged:**
- Session strings never appear in logs or API responses
- QR tokens are ephemeral (120s expiry, stored in-memory cache)
- Fernet key only in environment variables, never in code

---

### Telegram ToS Compliance (Critical)

**No Automated Sending:**
- System has ZERO capability to send Telegram messages
- `sendMessage()` function is NEVER called from backend
- Team member manually sends via Telegram app
- System only tracks when team member marks as sent

**Read-Only Permissions:**
- Telethon client uses read permissions only
- System can: read messages, get conversations, check auth status
- System cannot: send messages, delete messages, modify user data

**Rate Limiting:**
- Background worker respects Telegram API limits (30 req/s)
- 60-second polling interval prevents rate limit issues
- Exponential backoff if rate limit errors occur

**Session Revocation:**
- User can revoke access in Telegram app settings anytime
- Sessions show as "ScopeLock Dashboard" in Telegram active sessions
- System handles revoked sessions gracefully (notifies team member to reconnect)

---

## Performance Considerations

**Caching:**
- **QR Tokens:** In-memory cache (Redis or Python dict with TTL)
  - TTL: 120 seconds
  - Cleared after successful auth or expiry
- **Contact Queue:** No caching (query FalkorDB directly for real-time status)
- **Generated Messages:** Stored in FalkorDB (not cached)

**Background Worker Optimization:**
- **Polling Interval:** 60 seconds (balances reply latency vs API load)
- **Concurrent Sessions:** AsyncIO handles up to 100 sessions concurrently
- **Conversation Filtering:** Only polls "active" conversations (not all 313 contacts)
- **Incremental Polling:** Uses `last_message_id` to fetch only new messages (not full history)

**Database Query Optimization:**
- **Queue Endpoint:** Indexed on `outreach_status` for fast filtering
- **Conversation List:** Indexed on `conversation_status` and `unread_count`
- **Contact Lookup:** Unique index on `telegram_id` for O(1) lookups

**Maya AI Timeout:**
- **Timeout:** 10 seconds per message generation
- **Fallback:** Generic template if Maya doesn't respond
- **Prevents:** Frontend waiting forever for slow AI

---

## Deployment Architecture

**Environments:**
- Development: Local (localhost:8000 backend, localhost:3000 frontend)
- Production: Render backend + Vercel frontend (existing deployments)

**Backend Deployment (Render):**
- Service: Extends existing FastAPI backend
- Environment Variables:
  - `TELEGRAM_API_ID` - Telegram API credentials (from my.telegram.org)
  - `TELEGRAM_API_HASH` - Telegram API credentials
  - `FALKORDB_API_KEY` - FalkorDB REST API access
  - `FALKORDB_API_URL` - https://mindprotocol.onrender.com/admin/query
  - `GRAPH_NAME` - "scopelock"
  - `FERNET_ENCRYPTION_KEY` - 32-byte encryption key for session strings
  - `MAYA_AI_ENDPOINT` - Maya service URL (TBD)
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Frontend Deployment (Vercel):**
- Integrates into existing Mission Deck Next.js deployment
- No additional deployment needed
- Environment Variables: (inherits Mission Deck config)

**Background Worker:**
- Runs as part of FastAPI backend (AsyncIO task)
- Starts on application startup
- Runs continuously in background (infinite loop with 60s sleep)

---

## Monitoring & Observability

**Error Tracking:**
- Backend errors logged to stdout (Render captures)
- Frontend errors tracked via existing Mission Deck monitoring

**Background Worker Health:**
- Logs heartbeat every 5 minutes: "Monitoring worker alive - polling X sessions"
- Logs errors for: Telegram API failures, FalkorDB connection issues, decryption failures

**Performance Monitoring:**
- API response times logged per endpoint
- Maya AI generation time tracked (alert if p95 > 5s)
- Background worker cycle time logged (alert if > 10s per session)

**Alerts:**
- Telegram API rate limit warnings → Log for debugging
- Session encryption/decryption failures → Critical alert (indicates key issue)
- Background worker crash → Auto-restart via Render (built-in)

---

## Technology Deviations

**No deviations from standard ScopeLock stack.**

This mission uses:
- ✅ Next.js (frontend) on Vercel
- ✅ FastAPI (backend) on Render
- ✅ FalkorDB (database) per project architecture
- ✅ Claude Code for internal LLM calls (Maya AI implementation)

---

## Notes

**Critical Architectural Decisions:**

1. **QR Code vs Phone Code:** QR code avoids Telegram's "NEVER SHARE THIS CODE" warning, more trustworthy UX
2. **Read-Only + Manual Send:** Only way to stay ToS-compliant while automating discovery
3. **Fernet Encryption:** Session strings contain account access, must be encrypted at rest
4. **60s Polling Interval:** Balances reply detection latency (p95 <120s) vs API load
5. **Maya AI Timeout:** 10s timeout + generic fallback prevents frontend hangs

**Future Considerations:**

- **Multi-Account Support:** If multiple team members need separate queues, add team_member filter to queue endpoint
- **Reply Sentiment Analysis:** Could add sentiment classification (positive/neutral/negative) for reply prioritization
- **Network Analysis:** FalkorDB graph relationships enable "who knows who" analysis (future feature)
- **A/B Testing:** Track response rates per message template type to optimize Maya prompts
