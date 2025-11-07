# MECHANISM: Team Member Hunting (Telegram Outreach System)

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Architecture, data models, and API design for Telegram outreach to 313 contacts

---

## Architecture Overview

**High-Level Components:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Mission Deck Frontend                     │
│                  (Next.js 14 on Vercel)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Outreach     │  │ Message      │  │ Reply        │     │
│  │ Queue        │  │ Generator    │  │ Notifications│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (FastAPI on Render)                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              /api/outreach/* Routes                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Maya Service │  │ Telegram     │  │ Outreach     │     │
│  │ (Message Gen)│  │ Reader       │  │ Tracker      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    FalkorDB Graph Store                      │
│                  (Mind Protocol v2 Schema)                   │
│                                                              │
│  U4_Contact_Lead ──[U4_RECEIVED]──> U4_Outreach_Message     │
│       │                                                       │
│       └──[U4_REPLIED_VIA]──> U4_Telegram_Reply              │
│                                                              │
│  U4_Telegram_Conversation (encrypted session storage)        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Telegram (via Telethon)                     │
│                  Read-Only MTProto Access                    │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**

1. **Contact Ingestion:** Load 313 contacts from `team_members.json` → FalkorDB (U4_Contact_Lead nodes)
2. **Outreach Generation:** Human clicks contact → Maya generates personalized message → Display in UI
3. **Manual Send:** Human copies message → Pastes in Telegram app → Marks as sent → FalkorDB (U4_Outreach_Message node + link)
4. **Reply Monitoring:** Background worker polls Telegram every 60s → Detects new replies → FalkorDB (U4_Telegram_Reply node + link)
5. **Notification:** Worker emits event → Dashboard subscribes (SSE) → Notification appears
6. **Status Tracking:** Every action updates `outreach_status` (pending → sent → replied → interested → converted)

---

## Technology Stack

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **Deployment:** Vercel
- **State Management:** Zustand
- **UI Library:** Tailwind CSS + shadcn/ui components
- **Real-Time:** EventSource (SSE for reply notifications)
- **Why:** ScopeLock standard stack, zero-config deployment, optimal performance

**Backend:**
- **Framework:** FastAPI 0.104+
- **Language:** Python 3.11+
- **Deployment:** Render (web service)
- **Async:** AsyncIO (for Telethon background worker)
- **Why:** ScopeLock standard stack, rapid development, excellent async support for Telegram monitoring

**Database:**
- **Primary:** FalkorDB (graph database via REST API)
- **Schema:** Mind Protocol v2 (universal attributes + typed relationships)
- **Connection:** REST API (`https://mindprotocol.onrender.com/admin/query`)
- **Why:** Organization standard, graph queries ideal for relationships (contact → message → reply)

**External Services:**
- **Telegram Library:** Telethon 1.30+ (Python MTProto implementation)
- **Message Generation:** Maya (Claude Code via `<claude_message>--continue` syntax)
- **Session Encryption:** Fernet (symmetric encryption for Telethon sessions)
- **Why:** Telethon = official MTProto library, Claude Code = subscription budget (not API costs)

**Testing:**
- **Backend:** pytest 7.4+, pytest-asyncio
- **Frontend:** Vitest 1.0+, React Testing Library
- **E2E:** Playwright 1.40+
- **Performance:** k6 (load testing)

---

## FalkorDB Schema (Mind Protocol v2)

### Node Type 1: U4_Contact_Lead (Potential Team Member)

**Purpose:** Represents one of the 313 pre-qualified Telegram contacts from analysis

**Schema:**
```cypher
CREATE (contact:U4_Contact_Lead {
  // Universal Mind Protocol v2 attributes
  slug: "contact-7944133972",              // Unique identifier
  name: "Liam",                            // Human-readable name
  type_name: "U4_Contact_Lead",            // Node type
  level: "L2",                             // Logic level (data)
  scope_ref: "scopelock",                  // Organization scope
  visibility: "partners",                  // Who can see this
  created_at: datetime(),                  // Creation timestamp
  updated_at: datetime(),                  // Last update
  valid_from: datetime(),                  // Validity window start
  valid_to: null,                          // Validity window end (null = active)

  // Contact-specific fields
  telegram_id: 7944133972,                 // Telegram user ID (from analysis)
  profile_type: "hustler",                 // supervisor | hustler | hybrid
  supervisor_score: 1,                     // 0-100 (code review signals)
  hustler_score: 15,                       // 0-100 (marketing/biz dev signals)

  // Outreach tracking
  outreach_status: "pending",              // pending | sent | replied | interested | not_interested | converted
  sent_at: null,                           // When message sent (datetime or null)
  replied_at: null,                        // When first reply received (datetime or null)
  converted_at: null,                      // When joined team (datetime or null)

  // Analysis data (from team_members.json)
  analysis_data: {
    "signals": ["voice_ai", "productivity_tools", "ai_apps"],
    "matching_messages": [
      {
        "text": "Just launched a voice AI demo...",
        "date": "2024-10-15",
        "score": 8.5,
        "group": "AI Builders"
      }
    ],
    "groups": ["AI Builders", "Productivity Geeks"],
    "last_active": "2024-10-22"
  }
})
```

**Indexes:**
```cypher
CREATE INDEX contact_telegram_id FOR (c:U4_Contact_Lead) ON (c.telegram_id);
CREATE INDEX contact_status FOR (c:U4_Contact_Lead) ON (c.outreach_status);
CREATE INDEX contact_profile_type FOR (c:U4_Contact_Lead) ON (c.profile_type);
```

---

### Node Type 2: U4_Outreach_Message (Generated & Sent Message)

**Purpose:** Represents a personalized outreach message generated by Maya and sent via Telegram

**Schema:**
```cypher
CREATE (message:U4_Outreach_Message {
  // Universal attributes
  slug: "outreach-msg-abc123",
  name: "Outreach to Liam",
  type_name: "U4_Outreach_Message",
  level: "L2",
  scope_ref: "scopelock",
  visibility: "partners",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,

  // Message-specific fields
  message_text: "Hey Liam! Saw you grinding on voice AI...",  // Full message content
  generated_by: "maya",                                       // AI agent who generated
  sent_by: "bigbosexf",                                       // Human who sent
  sent_at: datetime("2025-11-07T10:30:00Z"),                 // When sent via Telegram
  is_sent: true,                                              // Confirmation flag

  // Generation metadata
  personalization_context: {
    "profile_type": "hustler",
    "signals_used": ["voice_ai", "productivity_tools"],
    "message_referenced": "Just launched a voice AI demo...",
    "generation_time_ms": 3200,
    "confidence": 0.85
  },

  // Editing tracking (if human edited before sending)
  was_edited: false,
  edit_diff: null  // Diff if edited (for Maya training)
})
```

**Relationships:**
```cypher
// Link message to contact
MATCH (c:U4_Contact_Lead {telegram_id: 7944133972})
MATCH (m:U4_Outreach_Message {slug: "outreach-msg-abc123"})
CREATE (c)-[:U4_RECEIVED {
  received_at: datetime("2025-11-07T10:30:00Z"),
  channel: "telegram"
}]->(m)

// Link message to Maya (who generated)
MATCH (maya:U4_Agent {slug: "maya"})
MATCH (m:U4_Outreach_Message {slug: "outreach-msg-abc123"})
CREATE (m)-[:U4_GENERATED_BY {
  generated_at: datetime("2025-11-07T10:29:45Z"),
  model: "claude-sonnet-4-5-20250929"
}]->(maya)
```

---

### Node Type 3: U4_Telegram_Conversation (Session Storage)

**Purpose:** Stores encrypted Telethon session for monitoring conversations

**Schema:**
```cypher
CREATE (conversation:U4_Telegram_Conversation {
  // Universal attributes
  slug: "telegram-conv-bigbosexf",
  name: "Telegram Session (bigbosexf)",
  type_name: "U4_Telegram_Conversation",
  level: "L2",
  scope_ref: "scopelock",
  visibility: "private",  // Only backend can access
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,

  // Session-specific fields
  phone: "+1234567890",                          // Phone number used for auth
  telegram_session_data: "gAAAAABf...",          // Fernet-encrypted Telethon session
  encryption_key_id: "key-2025-11-07",           // Which encryption key used
  is_monitoring: true,                           // Whether monitoring is active
  last_sync_at: datetime("2025-11-07T12:00:00Z"), // Last time worker checked

  // Monitoring config
  poll_interval_seconds: 60,                     // How often to check (60s default)
  monitored_contact_count: 313,                  // How many contacts to monitor

  // Health tracking
  session_valid: true,                           // Whether session is still valid
  last_auth_at: datetime("2025-11-07T08:00:00Z"), // When last authenticated
  auth_expires_at: null                          // Session expiry (if known)
})
```

**Security Notes:**
- `telegram_session_data` is ALWAYS encrypted with Fernet before storage
- Encryption key stored in environment variable `TELEGRAM_SESSION_KEY`
- Never logged, never committed to git, never sent in API responses
- Read-only access (Telethon cannot send messages)

---

### Node Type 4: U4_Telegram_Reply (Detected Reply)

**Purpose:** Represents a reply detected from a contact via Telethon monitoring

**Schema:**
```cypher
CREATE (reply:U4_Telegram_Reply {
  // Universal attributes
  slug: "telegram-reply-12345",
  name: "Reply from Liam",
  type_name: "U4_Telegram_Reply",
  level: "L2",
  scope_ref: "scopelock",
  visibility: "partners",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,

  // Reply-specific fields
  telegram_message_id: 12345,                    // Unique message ID from Telegram
  message_text: "Yeah, I'm interested. Tell me more.", // Reply content
  sender_id: 7944133972,                         // Telegram user ID (matches contact)
  sender_name: "Liam",                           // Name from Telegram
  sent_at: datetime("2025-11-07T13:45:00Z"),    // When contact sent reply

  // Detection metadata
  detected_at: datetime("2025-11-07T13:45:32Z"), // When worker detected (should be <60s after sent_at)
  detected_by: "telegram_worker",                 // Background worker
  detection_latency_ms: 32000,                    // Time from sent to detected

  // Status tracking
  is_read: false,                                 // Whether human has read in dashboard
  read_at: null,                                  // When marked read
  read_by: null,                                  // Who marked read

  // Interest classification (set by human)
  interest_level: null  // null | interested | not_interested (set manually)
})
```

**Relationships:**
```cypher
// Link reply to contact
MATCH (c:U4_Contact_Lead {telegram_id: 7944133972})
MATCH (r:U4_Telegram_Reply {telegram_message_id: 12345})
CREATE (c)-[:U4_REPLIED_VIA {
  replied_at: datetime("2025-11-07T13:45:00Z"),
  channel: "telegram"
}]->(r)
```

**Indexes:**
```cypher
CREATE INDEX reply_telegram_msg_id FOR (r:U4_Telegram_Reply) ON (r.telegram_message_id);
CREATE INDEX reply_is_read FOR (r:U4_Telegram_Reply) ON (r.is_read);
```

---

## API Endpoints (FastAPI)

### Base URL
- **Local:** `http://localhost:8000/api/outreach`
- **Production:** `https://scopelock-outreach.onrender.com/api/outreach`

---

### 1. GET /api/outreach/queue

**Purpose:** Fetch contact queue with filters and pagination

**Query Parameters:**
- `page` (int, default=1): Page number
- `limit` (int, default=20): Contacts per page
- `profile_type` (str, optional): Filter by "supervisor", "hustler", "hybrid"
- `status` (str, optional): Filter by "pending", "sent", "replied", "interested", "converted"
- `sort` (str, default="hustler_score_desc"): Sort by "hustler_score_desc", "supervisor_score_desc", "name_asc"

**Response:**
```json
{
  "total": 313,
  "page": 1,
  "pages": 16,
  "limit": 20,
  "contacts": [
    {
      "id": "contact-7944133972",
      "telegram_id": 7944133972,
      "name": "Liam",
      "profile_type": "hustler",
      "supervisor_score": 1,
      "hustler_score": 15,
      "signals": ["voice_ai", "productivity_tools", "ai_apps"],
      "outreach_status": "pending",
      "sent_at": null,
      "replied_at": null
    }
  ]
}
```

**Implementation:**
```python
@router.get("/queue")
async def get_outreach_queue(
    page: int = 1,
    limit: int = 20,
    profile_type: Optional[str] = None,
    status: Optional[str] = None,
    sort: str = "hustler_score_desc"
):
    # Build Cypher query with filters
    where_clauses = ["c.scope_ref = 'scopelock'", "c.type_name = 'U4_Contact_Lead'"]

    if profile_type:
        where_clauses.append(f"c.profile_type = '{profile_type}'")
    if status:
        where_clauses.append(f"c.outreach_status = '{status}'")

    # Sort
    order_by = {
        "hustler_score_desc": "c.hustler_score DESC",
        "supervisor_score_desc": "c.supervisor_score DESC",
        "name_asc": "c.name ASC"
    }[sort]

    # Query FalkorDB
    cypher = f"""
    MATCH (c:U4_Contact_Lead)
    WHERE {' AND '.join(where_clauses)}
    RETURN c
    ORDER BY {order_by}
    SKIP {(page - 1) * limit}
    LIMIT {limit}
    """

    results = query_graph(cypher, {})

    # Count total
    count_query = f"""
    MATCH (c:U4_Contact_Lead)
    WHERE {' AND '.join(where_clauses)}
    RETURN count(c) AS total
    """
    total = query_graph(count_query, {})[0]["total"]

    return {
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "limit": limit,
        "contacts": [format_contact(r["c"]) for r in results]
    }
```

---

### 2. POST /api/outreach/generate-message/{contact_id}

**Purpose:** Generate personalized outreach message for contact (via Maya)

**Path Parameters:**
- `contact_id` (str): Contact slug (e.g., "contact-7944133972")

**Response:**
```json
{
  "message": "Hey Liam! Saw you grinding on voice AI stuff - that demo you posted on Oct 15 was fire 🔥.\n\nWe're building ScopeLock (AI-human dev agency) and need someone who can hunt Upwork jobs and write killer proposals. You'd be perfect for the hustler role - find jobs, write proposals with Emma (our AI), get paid per interaction.\n\nNo corporate BS, no timesheets. Just results. Interested?",
  "generated_by": "maya",
  "confidence": 0.85,
  "generation_time_ms": 3200,
  "personalization_context": {
    "profile_type": "hustler",
    "signals_used": ["voice_ai", "productivity_tools"],
    "message_referenced": "Just launched a voice AI demo..."
  }
}
```

**Implementation:**
```python
@router.post("/generate-message/{contact_id}")
async def generate_outreach_message(contact_id: str):
    # 1. Get contact from FalkorDB
    contact = get_contact_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    # 2. Call Maya service (Claude Code)
    start = time.time()
    message = await maya_service.generate_outreach_message(
        name=contact["name"],
        profile_type=contact["profile_type"],
        signals=contact["analysis_data"]["signals"],
        matching_messages=contact["analysis_data"]["matching_messages"]
    )
    generation_time_ms = int((time.time() - start) * 1000)

    # 3. Return message + metadata
    return {
        "message": message["text"],
        "generated_by": "maya",
        "confidence": message["confidence"],
        "generation_time_ms": generation_time_ms,
        "personalization_context": message["context"]
    }
```

**Maya Service Implementation:**
```python
# services/outreach/maya_service.py
async def generate_outreach_message(
    name: str,
    profile_type: str,
    signals: List[str],
    matching_messages: List[dict]
) -> dict:
    """Generate personalized message using Claude Code."""

    # Build prompt for Maya
    prompt = f"""Generate a personalized Telegram outreach message for {name}.

Profile type: {profile_type}
{"(Focus on code review/mentorship angle)" if profile_type == "supervisor" else "(Focus on business development/hustler angle)"}

Signals: {', '.join(signals)}

Their recent activity:
{chr(10).join([f"- {msg['text'][:100]}... ({msg['date']})" for msg in matching_messages[:3]])}

Requirements:
- Reference their name
- Reference specific signal or message (prove we read their profile)
- Explain ScopeLock value prop relevant to their profile
- Keep it 80-150 words
- Casual, builder-grade tone (no corporate jargon)
- End with clear CTA

Generate the message:"""

    # Call Claude Code (subscription budget, not API)
    # This would use subprocess or similar to call: claude -p "{prompt}" --continue
    message_text = await call_claude_code(prompt)

    return {
        "text": message_text,
        "confidence": 0.85,  # Could calculate based on how many signals referenced
        "context": {
            "profile_type": profile_type,
            "signals_used": signals[:2],  # Top signals used
            "message_referenced": matching_messages[0]["text"][:50] if matching_messages else None
        }
    }
```

---

### 3. POST /api/outreach/mark-sent

**Purpose:** Mark message as sent (after human manually sent via Telegram)

**Request Body:**
```json
{
  "contact_id": "contact-7944133972",
  "message": "Hey Liam! Saw you grinding...",
  "sent_by": "bigbosexf"
}
```

**Response:**
```json
{
  "success": true,
  "outreach_message_id": "outreach-msg-abc123",
  "contact_status": "sent"
}
```

**Implementation:**
```python
@router.post("/mark-sent")
async def mark_message_sent(req: MarkSentRequest):
    # 1. Get contact
    contact = get_contact_by_id(req.contact_id)

    # 2. Check if already sent
    if contact["outreach_status"] != "pending":
        raise HTTPException(status_code=400, detail="Already sent to this contact")

    # 3. Create U4_Outreach_Message node
    message_slug = f"outreach-msg-{uuid.uuid4()}"
    cypher_create = """
    CREATE (m:U4_Outreach_Message {
      slug: $slug,
      name: $name,
      message_text: $message_text,
      generated_by: 'maya',
      sent_by: $sent_by,
      sent_at: datetime(),
      is_sent: true,
      type_name: 'U4_Outreach_Message',
      level: 'L2',
      scope_ref: 'scopelock',
      created_at: datetime(),
      updated_at: datetime()
    })
    RETURN m
    """
    query_graph(cypher_create, {
        "slug": message_slug,
        "name": f"Outreach to {contact['name']}",
        "message_text": req.message,
        "sent_by": req.sent_by
    })

    # 4. Link to contact
    cypher_link = """
    MATCH (c:U4_Contact_Lead {slug: $contact_id})
    MATCH (m:U4_Outreach_Message {slug: $message_slug})
    CREATE (c)-[:U4_RECEIVED {received_at: datetime(), channel: 'telegram'}]->(m)
    """
    query_graph(cypher_link, {"contact_id": req.contact_id, "message_slug": message_slug})

    # 5. Update contact status
    update_contact_status(req.contact_id, "sent", sent_at=datetime.now())

    return {
        "success": True,
        "outreach_message_id": message_slug,
        "contact_status": "sent"
    }
```

---

### 4. GET /api/outreach/conversations

**Purpose:** Get list of conversations being monitored (sent or replied contacts)

**Query Parameters:**
- `unread_only` (bool, default=false): Only show conversations with unread replies

**Response:**
```json
{
  "conversations": [
    {
      "contact_id": "contact-7944133972",
      "name": "Liam",
      "telegram_id": 7944133972,
      "status": "replied",
      "sent_at": "2025-11-07T10:30:00Z",
      "last_reply_at": "2025-11-07T13:45:00Z",
      "unread_count": 1
    }
  ]
}
```

---

### 5. POST /api/outreach/connect-telegram

**Purpose:** Initiate Telethon session creation (2FA auth flow)

**Request Body:**
```json
{
  "phone": "+1234567890",
  "code": "12345"
}
```

**Response:**
```json
{
  "success": true,
  "session_created": true,
  "phone": "+1234567890"
}
```

**Implementation:**
```python
@router.post("/connect-telegram")
async def connect_telegram_session(req: ConnectTelegramRequest):
    # 1. Create Telethon client
    client = TelegramClient('session_name', API_ID, API_HASH)

    # 2. Authenticate with 2FA code
    await client.start(phone=req.phone, code_callback=lambda: req.code)

    # 3. Get session string
    session_data = client.session.save()

    # 4. Encrypt session with Fernet
    encryption_key = os.getenv('TELEGRAM_SESSION_KEY').encode()
    f = Fernet(encryption_key)
    encrypted_session = f.encrypt(session_data.encode()).decode()

    # 5. Store in FalkorDB
    cypher = """
    MERGE (conv:U4_Telegram_Conversation {phone: $phone})
    SET conv.telegram_session_data = $encrypted_session,
        conv.encryption_key_id = $key_id,
        conv.is_monitoring = true,
        conv.last_auth_at = datetime(),
        conv.updated_at = datetime()
    RETURN conv
    """
    query_graph(cypher, {
        "phone": req.phone,
        "encrypted_session": encrypted_session,
        "key_id": "key-2025-11-07"
    })

    # 6. Start background worker
    start_telegram_worker()

    return {"success": True, "session_created": True, "phone": req.phone}
```

---

### 6. GET /api/outreach/worker-health

**Purpose:** Check health of background Telegram monitoring worker

**Response:**
```json
{
  "status": "running",
  "last_check": "2025-11-07T14:00:00Z",
  "uptime_seconds": 21600,
  "monitored_contacts": 313,
  "last_reply_detected": "2025-11-07T13:45:32Z"
}
```

---

### 7. GET /api/outreach/metrics

**Purpose:** Get analytics metrics (reply rates, conversion funnel)

**Response:**
```json
{
  "overview": {
    "total_contacts": 313,
    "reached": 127,
    "replied": 19,
    "interested": 7,
    "converted": 3
  },
  "reply_rate_by_profile": {
    "hustler": {"sent": 55, "replied": 10, "reply_rate": 18.2},
    "supervisor": {"sent": 37, "replied": 4, "reply_rate": 10.8},
    "hybrid": {"sent": 35, "replied": 5, "reply_rate": 14.3}
  },
  "reply_rate_by_signal": {
    "voice_ai": {"sent": 17, "replied": 4, "reply_rate": 23.5},
    "code_review": {"sent": 19, "replied": 3, "reply_rate": 15.8}
  }
}
```

---

## Background Worker (Telegram Monitoring)

**Implementation:** `services/outreach/telegram_worker.py`

**Purpose:** Continuously monitor Telegram conversations for new replies

**Architecture:**
```python
import asyncio
from telethon import TelegramClient
from cryptography.fernet import Fernet

class TelegramMonitoringWorker:
    def __init__(self):
        self.client = None
        self.is_running = False
        self.poll_interval = 60  # seconds
        self.last_check = None

    async def start(self):
        """Start monitoring worker."""
        # 1. Load encrypted session from FalkorDB
        session_data = self._load_session()

        # 2. Decrypt session
        decrypted_session = self._decrypt_session(session_data["telegram_session_data"])

        # 3. Create Telethon client (read-only)
        self.client = TelegramClient(
            StringSession(decrypted_session),
            API_ID,
            API_HASH
        )
        await self.client.connect()

        # 4. Start monitoring loop
        self.is_running = True
        while self.is_running:
            try:
                await self._check_conversations()
                self.last_check = datetime.now()
                await asyncio.sleep(self.poll_interval)
            except Exception as e:
                await self._handle_error(e)

    async def _check_conversations(self):
        """Check all sent conversations for new replies."""
        # 1. Get all sent contacts
        contacts = query_graph("""
            MATCH (c:U4_Contact_Lead)
            WHERE c.outreach_status IN ['sent', 'replied']
            RETURN c.telegram_id AS telegram_id, c.slug AS contact_id
        """, {})

        # 2. For each contact, get messages
        for contact in contacts:
            messages = await self.client.get_messages(
                contact["telegram_id"],
                limit=10  # Last 10 messages
            )

            # 3. Check for new replies (not from us)
            for msg in messages:
                if msg.from_id == contact["telegram_id"]:  # From contact, not us
                    # Check if already in DB
                    existing = query_graph("""
                        MATCH (r:U4_Telegram_Reply {telegram_message_id: $msg_id})
                        RETURN count(r) AS count
                    """, {"msg_id": msg.id})

                    if existing[0]["count"] == 0:
                        # New reply! Create event
                        await self._create_reply_event(contact["contact_id"], msg)

    async def _create_reply_event(self, contact_id: str, msg):
        """Create U4_Telegram_Reply node and update contact status."""
        reply_slug = f"telegram-reply-{msg.id}"

        # 1. Create reply node
        cypher_create = """
        CREATE (r:U4_Telegram_Reply {
          slug: $slug,
          name: $name,
          telegram_message_id: $msg_id,
          message_text: $text,
          sender_id: $sender_id,
          sender_name: $sender_name,
          sent_at: $sent_at,
          detected_at: datetime(),
          detected_by: 'telegram_worker',
          is_read: false,
          type_name: 'U4_Telegram_Reply',
          level: 'L2',
          scope_ref: 'scopelock',
          created_at: datetime(),
          updated_at: datetime()
        })
        RETURN r
        """
        query_graph(cypher_create, {
            "slug": reply_slug,
            "name": f"Reply from {msg.sender.first_name}",
            "msg_id": msg.id,
            "text": msg.text,
            "sender_id": msg.from_id,
            "sender_name": msg.sender.first_name,
            "sent_at": msg.date
        })

        # 2. Link to contact
        cypher_link = """
        MATCH (c:U4_Contact_Lead {slug: $contact_id})
        MATCH (r:U4_Telegram_Reply {slug: $reply_slug})
        CREATE (c)-[:U4_REPLIED_VIA {replied_at: $sent_at, channel: 'telegram'}]->(r)
        """
        query_graph(cypher_link, {
            "contact_id": contact_id,
            "reply_slug": reply_slug,
            "sent_at": msg.date
        })

        # 3. Update contact status
        update_contact_status(contact_id, "replied", replied_at=msg.date)

        # 4. Emit event for dashboard notification
        emit_event("telegram.reply.detected", {
            "contact_id": contact_id,
            "reply_id": reply_slug,
            "message_preview": msg.text[:100]
        })

    async def _handle_error(self, error: Exception):
        """Fail-loud error handling."""
        if isinstance(error, AuthKeyError):
            # Session expired - CRITICAL
            emit_failure("telegram.session_expired", {
                "location": "services/telegram_worker.py:120",
                "severity": "critical",
                "action": "Human must re-authenticate Telegram session"
            })
            send_telegram_alert("🚨 Telegram monitoring DOWN - session expired")
            self.is_running = False
        elif isinstance(error, NetworkError):
            # Temporary network issue - LOG but continue
            log.warning(f"Network error in monitoring: {error}")
            # Will retry on next loop
        else:
            # Unknown error - CRITICAL
            emit_failure("telegram.monitoring_unknown_error", {
                "location": "services/telegram_worker.py:135",
                "error": str(error),
                "action": "Human must check Telegram manually"
            })
            send_telegram_alert(f"🚨 Telegram monitoring ERROR: {error}")

    def _decrypt_session(self, encrypted_session: str) -> str:
        """Decrypt Telethon session using Fernet."""
        encryption_key = os.getenv('TELEGRAM_SESSION_KEY').encode()
        f = Fernet(encryption_key)
        return f.decrypt(encrypted_session.encode()).decode()
```

**Deployment:**
- Runs as background task in FastAPI (via startup event)
- Auto-restart on crash (Render service config)
- Health check every 5 minutes (GET /api/outreach/worker-health)

---

## Security Architecture

### Session Encryption (Fernet)

**Why Fernet:**
- Symmetric encryption (same key encrypts + decrypts)
- Built-in authentication (detects tampering)
- Time-based expiry support (future feature)

**Key Management:**
```bash
# Generate encryption key
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

# Store in environment variable
export TELEGRAM_SESSION_KEY="<generated-key>"
```

**Encryption Flow:**
```python
from cryptography.fernet import Fernet

# Encrypt session before storage
def encrypt_session(session_data: str) -> str:
    key = os.getenv('TELEGRAM_SESSION_KEY').encode()
    f = Fernet(key)
    return f.encrypt(session_data.encode()).decode()

# Decrypt session for use
def decrypt_session(encrypted_session: str) -> str:
    key = os.getenv('TELEGRAM_SESSION_KEY').encode()
    f = Fernet(key)
    return f.decrypt(encrypted_session.encode()).decode()
```

**Key Rotation (Future):**
- Rotate key every 90 days
- Re-encrypt all sessions with new key
- Graceful transition (both keys valid during rotation window)

---

### Read-Only Telegram Access

**Enforcement:**
```python
# Telethon client configured for read-only
client = TelegramClient(session, API_ID, API_HASH)

# Override send_message to raise error
def send_message(*args, **kwargs):
    raise PermissionError("Read-only mode: Cannot send messages via API")

client.send_message = send_message  # Block sending
```

**Verification:**
- Security audit checks for `send_message` calls
- E2E test verifies send_message raises PermissionError

---

### Data Protection

**Access Control:**
- FalkorDB queries restricted to backend only
- No public API endpoints exposing contact PII
- Frontend gets filtered data (no Telegram IDs in URLs)

**.gitignore Rules:**
```
# Telegram session files
*.session
telegram_session.json

# Encryption keys
.env
*.key
```

---

## Deployment Architecture

### Backend (Render)

**Service Configuration:**
```yaml
name: scopelock-outreach-backend
type: web
runtime: python
buildCommand: pip install -r requirements.txt
startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
plan: starter
region: oregon

envVars:
  - key: FALKORDB_API_URL
    value: https://mindprotocol.onrender.com/admin/query
  - key: FALKORDB_API_KEY
    sync: false  # Secret
  - key: TELEGRAM_SESSION_KEY
    generateValue: true  # Auto-generate
  - key: TELEGRAM_API_ID
    sync: false
  - key: TELEGRAM_API_HASH
    sync: false
```

**Health Check:**
- Endpoint: GET /health
- Expected: `{"status": "ok", "worker": "running"}`

---

### Frontend (Vercel)

**Project Configuration:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "rootDirectory": "frontend",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://scopelock-outreach-backend.onrender.com/api"
  }
}
```

---

## Data Ingestion (One-Time)

**Script:** `scripts/ingest_analysis_data.py`

**Purpose:** Load 313 contacts from `team_members.json` into FalkorDB

**Usage:**
```bash
python3 scripts/ingest_analysis_data.py \
  --input data/team_members.json \
  --graph scopelock
```

**Implementation:**
```python
import json
from falkordb_client import query_graph

def ingest_contacts(json_path: str):
    # Load JSON
    with open(json_path) as f:
        contacts = json.load(f)

    # Create U4_Contact_Lead nodes
    for contact in contacts:
        slug = f"contact-{contact['telegram_id']}"

        cypher = """
        CREATE (c:U4_Contact_Lead {
          slug: $slug,
          name: $name,
          telegram_id: $telegram_id,
          profile_type: $profile_type,
          supervisor_score: $supervisor_score,
          hustler_score: $hustler_score,
          outreach_status: 'pending',
          analysis_data: $analysis_data,
          type_name: 'U4_Contact_Lead',
          level: 'L2',
          scope_ref: 'scopelock',
          visibility: 'partners',
          created_at: datetime(),
          updated_at: datetime(),
          valid_from: datetime()
        })
        """

        query_graph(cypher, {
            "slug": slug,
            "name": contact["name"],
            "telegram_id": contact["telegram_id"],
            "profile_type": contact["profile_type"],
            "supervisor_score": contact["supervisor_score"],
            "hustler_score": contact["hustler_score"],
            "analysis_data": contact  # Full analysis object
        })

    print(f"✅ Loaded {len(contacts)} contacts")
```

---

## Related Documentation

- **PATTERN.md:** Core principles, risks, success criteria
- **AC.md:** Functional + non-functional acceptance criteria
- **VALIDATION.md:** Test specifications (pytest, Vitest, Playwright)
- **ALGORITHM.md:** Step-by-step implementation guide
- **GUIDE.md:** Setup, deployment, troubleshooting

**Next:** ALGORITHM.md (code-level implementation steps) → GUIDE.md (deployment instructions)

---

**Sign-Off:**

Inna — ScopeLock
MECHANISM complete. Architecture defined. FalkorDB schema ready. API endpoints specified.
Ready for ALGORITHM.md (implementation steps).
