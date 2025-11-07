# TELEGRAM OUTREACH SYSTEM - Complete Specification

**Mission:** Team Member Hunting
**Version:** 2.0 (QR Code Authentication)
**Date:** 2025-11-07
**For:** Inna (Documentation) + Rafael (Implementation)

---

## EXECUTIVE SUMMARY

**What:** A Mission Deck mission for managing Telegram outreach to potential ScopeLock team members.

**How:**
- **Automated:** Message generation (Maya AI), conversation monitoring (Telegram Reader via QR code)
- **Manual:** Actual sending (human clicks "send" in Telegram)
- **Tracked:** All conversations stored in FalkorDB graph database

**Why:**
- Efficiency: 90% effort reduction (message writing automated)
- Safety: No ToS violation (humans send, system monitors)
- Compliance: Read-only access via QR code (no code sharing)

---

## 1. SYSTEM ARCHITECTURE

### High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  Mission Deck → "Team Member Hunting" Mission                   │
│  - Outreach Queue (contacts to message)                         │
│  - QR Code Authentication (Telegram connect)                    │
│  - Active Conversations (live responses)                        │
│  - Contact Details (from analysis scripts)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API (FastAPI)                    │
│  Endpoints:                                                      │
│  - GET  /api/outreach/queue                                      │
│  - POST /api/outreach/generate-message/{contact_id}              │
│  - POST /api/outreach/mark-sent                                  │
│  - GET  /api/outreach/conversations                              │
│  - POST /api/outreach/telegram/qr-start                          │
│  - GET  /api/outreach/telegram/qr-check/{token}                  │
│  - POST /api/outreach/telegram/disconnect                        │
└─────────────────────────────────────────────────────────────────┘
           ↕                         ↕                    ↕
┌──────────────────┐   ┌────────────────────┐   ┌─────────────────┐
│   MAYA SERVICE   │   │  TELEGRAM READER   │   │   FALKORDB      │
│                  │   │                    │   │                 │
│ - Message Gen    │   │ - QR Auth          │   │ Graph Storage:  │
│ - Personalization│   │ - Read Access      │   │ - Contacts      │
│ - Template Logic │   │ - Poll Messages    │   │ - Messages      │
│                  │   │ - Detect Replies   │   │ - Conversations │
│                  │   │   (Telethon)       │   │ - Sessions      │
└──────────────────┘   └────────────────────┘   └─────────────────┘
```

---

## 2. DATA MODEL (FalkorDB Graph Schema)

All nodes follow Mind Protocol v2 universal attributes (same as existing Mission Deck).

### Node Types

#### **U4_Contact_Lead** (New Node Type)

```cypher
(:U4_Contact_Lead {
  # Contact identity
  name: str,                      # Display name from Telegram
  slug: str,                      # "contact-{telegram_id}"
  telegram_id: int,               # Numeric Telegram chat ID
  chat_type: str,                 # "personal_chat", "group", etc.

  # Profile analysis
  profile_type: str,              # "supervisor", "hustler", "hybrid"
  supervisor_score: int,          # From analysis script (0-200)
  hustler_score: int,             # From analysis script (0-200)

  # Outreach tracking
  outreach_status: str,           # "pending" | "sent" | "replied" | "converted" | "not_interested"

  # Analysis data
  analysis_data: json,            # Full analysis from team_members.json
  signals: json,                  # Categorized signals (geographic_fit, raider, etc.)
  matching_messages: json,        # Array of message references with IDs

  # Optional metadata
  twitter_handle: str,            # If found in analysis (optional)
  message_count: int,             # Total messages in Telegram export

  # Standard Mind Protocol v2 attributes
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Contact_Lead",
  visibility: "partners",
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: null,
  description: "Potential team member from Telegram analysis",
  detailed_description: str,
  substrate: "organizational",
  policy_ref: "l4://law/scopelock-outreach-policy",
  proof_uri: "",
  commitments: [],
  created_by: "system"
})
```

**Example:**
```cypher
CREATE (:U4_Contact_Lead {
  name: "Liam",
  slug: "contact-7944133972",
  telegram_id: 7944133972,
  chat_type: "personal_chat",
  profile_type: "hustler",
  supervisor_score: 1,
  hustler_score: 15,
  outreach_status: "pending",
  analysis_data: {
    "signals": {
      "raider": ["Gm sir... Will love to assist..."],
      "moderator": ["How much do you pay your mod's"]
    },
    "matching_messages": [
      {
        "message_id": 3325,
        "date": "2025-01-02T02:36:06",
        "text_snippet": "I've accumulated 100 retweets...",
        "signal_type": "raider"
      }
    ]
  },
  twitter_handle: "lbuckley70484",
  message_count: 179,
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Contact_Lead",
  visibility: "partners",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Hustler profile with raider/moderator signals",
  substrate: "organizational"
})
```

---

#### **U4_Outreach_Message** (New Node Type)

```cypher
(:U4_Outreach_Message {
  # Message identity
  slug: str,                      # "outreach-msg-{uuid}"
  name: str,                      # "Outreach to {contact_name}"

  # Message content
  message_text: str,              # The personalized message text
  personalization_context: json,  # Data used to personalize (signals, references)

  # Generation metadata
  generated_by: str,              # "maya" (citizen who generated it)
  generated_at: datetime,         # When message was generated

  # Sending tracking
  is_sent: bool,                  # false = pending, true = sent
  sent_by: str,                   # Team member who sent (null if not sent)
  sent_at: datetime,              # When sent (null if not sent)

  # Telegram metadata (populated after send)
  telegram_message_id: int,       # Telegram's message ID (null until reply detected)

  # Standard Mind Protocol v2 attributes
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Outreach_Message",
  event_kind: "outreach_message",
  visibility: "partners",
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: null,
  description: "Personalized outreach message",
  substrate: "organizational",
  policy_ref: "l4://law/scopelock-outreach-policy",
  commitments: [],
  created_by: str
})
```

---

#### **U4_Telegram_Session** (New Node Type)

```cypher
(:U4_Telegram_Session {
  # Session identity
  slug: str,                      # "telegram-session-{team_member_ref}-{uuid}"
  name: str,                      # "Telegram session for {team_member_name}"

  # Session data
  session_string: str,            # Encrypted Telethon session string
  encryption_iv: str,             # Initialization vector for decryption

  # Authorization metadata
  authorized_by: str,             # Team member who authorized (actor_ref)
  authorized_at: datetime,        # When QR code was scanned
  qr_token: str,                  # Token used during QR auth (for reference)

  # Session status
  is_active: bool,                # Whether session is still valid
  last_used_at: datetime,         # Last time session was used
  expires_at: datetime,           # When session should be refreshed

  # Monitoring status
  is_monitoring: bool,            # Whether background worker is polling
  last_sync_at: datetime,         # Last time we checked for new messages

  # Standard Mind Protocol v2 attributes
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Telegram_Session",
  visibility: "private",          # Private (contains encrypted credentials)
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: datetime,             # Session expiry
  description: "Telegram session for conversation monitoring",
  substrate: "organizational",
  policy_ref: "l4://law/scopelock-telegram-session-policy",
  commitments: [],
  created_by: str
})
```

---

#### **U4_Telegram_Conversation** (New Node Type)

```cypher
(:U4_Telegram_Conversation {
  # Conversation identity
  slug: str,                      # "telegram-conv-{contact_telegram_id}"
  name: str,                      # "Telegram conversation with {contact_name}"

  # Conversation metadata
  contact_telegram_id: int,       # Who we're talking to
  team_member_ref: str,           # Who's managing this conversation

  # Sync status
  last_message_id: int,           # Last Telegram message ID we've seen
  last_sync_at: datetime,         # Last time we polled for messages
  unread_count: int,              # Number of unread replies from contact

  # Conversation state
  conversation_status: str,       # "active" | "archived" | "converted"

  # Standard Mind Protocol v2 attributes
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Telegram_Conversation",
  visibility: "partners",
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: null,
  description: "Monitored Telegram conversation",
  substrate: "organizational",
  policy_ref: "l4://law/scopelock-outreach-policy",
  commitments: [],
  created_by: str
})
```

---

#### **U4_Telegram_Reply** (New Node Type)

```cypher
(:U4_Telegram_Reply {
  # Reply identity
  slug: str,                      # "telegram-reply-{telegram_message_id}"
  name: str,                      # "Reply from {contact_name}"

  # Message data
  telegram_message_id: int,       # Telegram's message ID
  message_text: str,              # Reply content
  sender_name: str,               # Who sent it (contact name)
  sender_telegram_id: int,        # Telegram ID of sender
  sent_at: datetime,              # When they sent it (Telegram timestamp)

  # Tracking
  is_read: bool,                  # Whether team member has seen it
  read_at: datetime,              # When marked as read (null if unread)

  # Optional AI classification
  sentiment: str,                 # "positive" | "neutral" | "negative" | null
  requires_response: bool,        # AI-detected urgency flag

  # Standard Mind Protocol v2 attributes
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Telegram_Reply",
  event_kind: "telegram_reply",
  visibility: "partners",
  created_at: datetime,
  updated_at: datetime,
  valid_from: datetime,
  valid_to: null,
  description: "Reply from potential team member",
  substrate: "organizational",
  policy_ref: "l4://law/scopelock-outreach-policy",
  commitments: [],
  created_by: "telegram_reader"
})
```

---

### Relationships

```cypher
# Contact has outreach message
(contact:U4_Contact_Lead)-[:U4_HAS_MESSAGE]->(msg:U4_Outreach_Message)

# Contact has conversation
(contact:U4_Contact_Lead)-[:U4_HAS_CONVERSATION]->(conv:U4_Telegram_Conversation)

# Conversation belongs to team member's session
(conv:U4_Telegram_Conversation)-[:U4_USES_SESSION]->(session:U4_Telegram_Session)

# Reply is part of conversation
(reply:U4_Telegram_Reply)-[:U4_PART_OF]->(conv:U4_Telegram_Conversation)

# Message sent by team member
(msg:U4_Outreach_Message)-[:U4_SENT_BY {
  actor_ref: "bigbosexf",
  sent_at: datetime
}]->(:U4_Person)

# Session authorized by team member
(session:U4_Telegram_Session)-[:U4_AUTHORIZED_BY {
  actor_ref: "bigbosexf",
  authorized_at: datetime,
  device_name: "ScopeLock Dashboard"
}]->(:U4_Person)
```

---

## 3. DATA FLOW

### Flow 1: Data Ingestion (Load Analysis Data)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RUN INGESTION SCRIPT                                     │
│    python backend/scripts/ingest_analysis_data.py           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. LOAD JSON FILES                                          │
│    - /outreach/team_members/team_members.json (313 people)  │
│    - /outreach/potential_clients/potential_clients.json     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CREATE CONTACT NODES                                     │
│    For each contact in JSON:                                │
│    - Extract all fields (name, telegram_id, scores, etc.)   │
│    - Create U4_Contact_Lead node in FalkorDB                │
│    - Set outreach_status = "pending"                        │
│    - Store full analysis_data as JSON                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. VERIFY INGESTION                                         │
│    Query: MATCH (c:U4_Contact_Lead) RETURN count(c)         │
│    Expected: 313 contacts                                   │
└─────────────────────────────────────────────────────────────┘
```

**Cypher Query Example:**
```cypher
CREATE (c:U4_Contact_Lead {
  name: $name,
  slug: $slug,
  telegram_id: $telegram_id,
  chat_type: $chat_type,
  profile_type: $profile_type,
  supervisor_score: $supervisor_score,
  hustler_score: $hustler_score,
  outreach_status: "pending",
  analysis_data: $analysis_data,
  message_count: $message_count,
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Contact_Lead",
  visibility: "partners",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: $description,
  substrate: "organizational",
  created_by: "ingestion_script"
})
```

---

### Flow 2: Outreach (Human Sends Message)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TEAM MEMBER OPENS DASHBOARD                              │
│    URL: /mission-deck/console?mission=team-member-hunting   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. LOAD OUTREACH QUEUE                                      │
│    Frontend: GET /api/outreach/queue                        │
│    Backend queries FalkorDB:                                │
│      MATCH (c:U4_Contact_Lead {outreach_status: "pending"}) │
│      RETURN c ORDER BY c.hustler_score DESC LIMIT 50        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CLICK CONTACT → GENERATE MESSAGE                         │
│    Frontend: POST /api/outreach/generate-message/{slug}     │
│    Backend:                                                 │
│    a) Query contact from FalkorDB                           │
│    b) Call Maya service with contact.analysis_data          │
│    c) Maya generates personalized message                   │
│    d) Create U4_Outreach_Message node (is_sent=false)       │
│    e) Link to contact via U4_HAS_MESSAGE                    │
│    f) Return message text to frontend                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. SHOW MESSAGE MODAL                                       │
│    Frontend displays:                                       │
│    - Contact info (name, profile, signals)                  │
│    - Generated message text                                 │
│    - [Copy Message] [Open Telegram] [Mark as Sent] buttons │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. COPY & SEND IN TELEGRAM                                  │
│    Team member:                                             │
│    a) Clicks [Copy Message] → Text copied to clipboard      │
│    b) Clicks [Open Telegram] → Opens Telegram Web/Desktop   │
│       - Deep link: tg://resolve?domain={telegram_id}        │
│    c) Pastes message into Telegram                          │
│    d) Manually clicks "Send" in Telegram                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. MARK AS SENT                                             │
│    Team member: Clicks [Mark as Sent] in dashboard          │
│    Frontend: POST /api/outreach/mark-sent                   │
│    Backend updates FalkorDB:                                │
│      SET msg.is_sent = true                                 │
│      SET msg.sent_at = datetime()                           │
│      SET msg.sent_by = $current_user                        │
│      SET contact.outreach_status = "sent"                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Flow 3: Telegram Authentication (QR Code)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TEAM MEMBER CLICKS "CONNECT TELEGRAM"                    │
│    Frontend: Button in dashboard settings area              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. REQUEST QR CODE                                          │
│    Frontend: POST /api/outreach/telegram/qr-start           │
│    Backend (Telethon):                                      │
│      client = TelegramClient(StringSession(), API_ID, ...)  │
│      await client.connect()                                 │
│      qr_login = await client.qr_login()                     │
│      qr_url = qr_login.url                                  │
│      token = qr_login.token.hex()                           │
│      # Generate QR code image from qr_url                   │
│      return {qr_image: base64, token: token}                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. DISPLAY QR CODE                                          │
│    Frontend shows modal:                                    │
│    ┌────────────────────────────────────────────────────┐  │
│    │ Scan with Telegram App                             │  │
│    │                                                     │  │
│    │   [QR CODE IMAGE]                                   │  │
│    │                                                     │  │
│    │ 1. Open Telegram app                                │  │
│    │ 2. Settings → Devices → "Link Desktop Device"      │  │
│    │ 3. Scan this QR code                                │  │
│    │                                                     │  │
│    │ ⏳ Waiting for scan...                              │  │
│    └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. TEAM MEMBER SCANS QR CODE                                │
│    In Telegram app:                                         │
│    - Opens Settings → Devices                               │
│    - Taps "Link Desktop Device"                             │
│    - Points camera at QR code                               │
│    - Telegram shows: "Link 'ScopeLock Dashboard'?"          │
│    - Shows what access is granted (read messages, etc.)     │
│    - Team member taps "Link"                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. POLL FOR AUTHORIZATION                                   │
│    Frontend polls every 2 seconds:                          │
│      GET /api/outreach/telegram/qr-check/{token}            │
│    Backend:                                                 │
│      await qr_login.wait(timeout=120)                       │
│      if authorized:                                         │
│        session_string = client.session.save()               │
│        encrypted = encrypt_session(session_string)          │
│        return {status: "authorized", session: encrypted}    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. CREATE SESSION NODE                                      │
│    Backend creates U4_Telegram_Session:                     │
│      - session_string: encrypted Telethon session           │
│      - authorized_by: current team member                   │
│      - is_active: true                                      │
│      - is_monitoring: true                                  │
│    Link to team member via U4_AUTHORIZED_BY relationship    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. START BACKGROUND MONITORING                              │
│    Background worker detects new active session             │
│    Starts polling conversations for this session            │
│    Frontend shows: "✅ Telegram connected!"                 │
└─────────────────────────────────────────────────────────────┘
```

**What Team Member Sees in Telegram App:**

After scanning, in **Telegram → Settings → Devices**:
```
Active Sessions
├─ iPhone 15 Pro
│  Last active: just now
├─ ScopeLock Dashboard    ← NEW
│  Last active: just now
│  IP: [server IP]
│  [Terminate Session]
└─ Telegram Desktop
   Last active: 2 hours ago
```

**They can revoke access anytime by tapping "Terminate Session"**

---

### Flow 4: Monitoring & Reply Detection

```
┌─────────────────────────────────────────────────────────────┐
│ 1. BACKGROUND WORKER RUNS (Every 60 seconds)                │
│    AsyncIO task in FastAPI backend                          │
│    while True:                                              │
│      await monitor_all_sessions()                           │
│      await asyncio.sleep(60)                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. QUERY ACTIVE SESSIONS                                    │
│    FalkorDB query:                                          │
│      MATCH (s:U4_Telegram_Session {is_active: true})        │
│      RETURN s                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. FOR EACH SESSION: GET CONVERSATIONS TO MONITOR           │
│    FalkorDB query:                                          │
│      MATCH (s:U4_Telegram_Session {slug: $session_slug})    │
│            -[:U4_USES_SESSION]-(conv:U4_Telegram_Conversation)│
│      WHERE conv.conversation_status = "active"              │
│      RETURN conv                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. FOR EACH CONVERSATION: POLL TELEGRAM                     │
│    Telethon:                                                │
│      session = decrypt_session(s.session_string)            │
│      client = TelegramClient(session, API_ID, API_HASH)     │
│      await client.connect()                                 │
│      entity = await client.get_entity(conv.contact_telegram_id)│
│      messages = await client.get_messages(                  │
│        entity,                                              │
│        min_id=conv.last_message_id,                         │
│        limit=50                                             │
│      )                                                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. FILTER FOR NEW REPLIES (from contact, not from us)       │
│    For each message in messages:                            │
│      if msg.sender_id == conv.contact_telegram_id:          │
│        # This is a reply from the contact                   │
│        new_replies.append(msg)                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. SAVE NEW REPLIES TO FALKORDB                             │
│    For each new reply:                                      │
│      CREATE (:U4_Telegram_Reply {                           │
│        telegram_message_id: msg.id,                         │
│        message_text: msg.text,                              │
│        sender_telegram_id: msg.sender_id,                   │
│        sent_at: msg.date,                                   │
│        is_read: false                                       │
│      })                                                     │
│      Link to conversation via U4_PART_OF                    │
│      UPDATE conv SET unread_count = unread_count + 1        │
│      UPDATE contact SET outreach_status = "replied"         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. UPDATE LAST SYNC                                         │
│    UPDATE conv SET:                                         │
│      last_message_id = max(msg.id for msg in messages)      │
│      last_sync_at = datetime()                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. FRONTEND POLLS FOR NEW REPLIES                           │
│    Every 10 seconds:                                        │
│      GET /api/outreach/conversations?unread_only=true       │
│    If new unread replies:                                   │
│      Show notification: "🔔 Liam replied to your outreach!" │
│      Update conversations list                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. API ENDPOINTS SPECIFICATION

### Base URL
```
Production: https://scopelock.onrender.com/api/outreach
Development: http://localhost:8000/api/outreach
```

### Authentication
All endpoints require JWT token from Mission Deck authentication.

```
Headers:
  Authorization: Bearer {jwt_token}
```

---

### **GET /api/outreach/queue**

**Purpose:** Get list of contacts pending outreach

**Query Parameters:**
- `limit` (optional): Max contacts to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `profile_type` (optional): Filter by "supervisor", "hustler", "hybrid"
- `min_score` (optional): Minimum combined score (supervisor + hustler)

**FalkorDB Query:**
```cypher
MATCH (c:U4_Contact_Lead {
  scope_ref: 'scopelock',
  outreach_status: 'pending'
})
WHERE c.supervisor_score + c.hustler_score >= $min_score
RETURN c
ORDER BY (c.supervisor_score + c.hustler_score) DESC
SKIP $offset
LIMIT $limit
```

**Response:**
```json
{
  "contacts": [
    {
      "id": "contact-7944133972",
      "name": "Liam",
      "telegram_id": 7944133972,
      "profile_type": "hustler",
      "supervisor_score": 1,
      "hustler_score": 15,
      "combined_score": 16,
      "top_signals": ["raider", "moderator"],
      "has_generated_message": false,
      "analysis_preview": {
        "matching_messages_count": 10,
        "top_signal_types": ["raider", "moderator"]
      }
    }
  ],
  "total_count": 313,
  "has_more": true
}
```

---

### **POST /api/outreach/generate-message/{contact_slug}**

**Purpose:** Generate personalized outreach message for contact

**Path Parameters:**
- `contact_slug`: Contact slug (e.g., "contact-7944133972")

**Request Body:** None (contact data loaded from FalkorDB)

**Process:**
1. Query FalkorDB for contact node
2. Extract `analysis_data` JSON
3. Call Maya service: `generate_outreach_message(contact_data)`
4. Create `U4_Outreach_Message` node
5. Link to contact via `U4_HAS_MESSAGE`
6. Return message text

**FalkorDB Queries:**
```cypher
# 1. Get contact
MATCH (c:U4_Contact_Lead {slug: $contact_slug})
RETURN c

# 2. Create message node
CREATE (msg:U4_Outreach_Message {
  slug: $msg_slug,
  name: $name,
  message_text: $message_text,
  personalization_context: $context,
  generated_by: "maya",
  generated_at: datetime(),
  is_sent: false,
  sent_by: null,
  sent_at: null,
  telegram_message_id: null,
  level: "L2",
  scope_ref: "scopelock",
  type_name: "U4_Outreach_Message",
  event_kind: "outreach_message",
  visibility: "partners",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Personalized outreach message",
  substrate: "organizational",
  created_by: $current_user
})

# 3. Link to contact
MATCH (msg:U4_Outreach_Message {slug: $msg_slug})
MATCH (c:U4_Contact_Lead {slug: $contact_slug})
CREATE (c)-[:U4_HAS_MESSAGE]->(msg)
```

**Response:**
```json
{
  "message_id": "outreach-msg-a1b2c3d4",
  "message_text": "Hey Liam! 👋\n\nSaw you grinding those 100 retweets for UBC...",
  "contact": {
    "name": "Liam",
    "telegram_id": 7944133972,
    "profile_type": "hustler"
  },
  "personalization_used": {
    "hook": "100 retweets grinding",
    "signals": ["raider", "moderator"],
    "matching_message_referenced": {
      "message_id": 3325,
      "date": "2025-01-02T02:36:06",
      "snippet": "I've accumulated 100 retweets..."
    }
  },
  "telegram_deep_link": "tg://resolve?domain=7944133972"
}
```

---

### **POST /api/outreach/mark-sent**

**Purpose:** Mark outreach message as sent by team member

**Request Body:**
```json
{
  "message_id": "outreach-msg-a1b2c3d4",
  "sent_by": "bigbosexf"
}
```

**Process:**
1. Update `U4_Outreach_Message` node
2. Update `U4_Contact_Lead` outreach_status
3. Create conversation node if first message

**FalkorDB Queries:**
```cypher
# 1. Update message
MATCH (msg:U4_Outreach_Message {slug: $message_id})
SET msg.is_sent = true,
    msg.sent_at = datetime(),
    msg.sent_by = $sent_by,
    msg.updated_at = datetime()
RETURN msg

# 2. Update contact
MATCH (msg:U4_Outreach_Message {slug: $message_id})
      <-[:U4_HAS_MESSAGE]-(c:U4_Contact_Lead)
SET c.outreach_status = "sent",
    c.updated_at = datetime()
RETURN c

# 3. Create conversation node (if doesn't exist)
MATCH (c:U4_Contact_Lead {slug: $contact_slug})
MERGE (conv:U4_Telegram_Conversation {
  slug: "telegram-conv-" + c.telegram_id
})
ON CREATE SET
  conv.name = "Telegram conversation with " + c.name,
  conv.contact_telegram_id = c.telegram_id,
  conv.team_member_ref = $sent_by,
  conv.last_message_id = 0,
  conv.last_sync_at = null,
  conv.unread_count = 0,
  conv.conversation_status = "active",
  conv.created_at = datetime(),
  conv.updated_at = datetime()
CREATE (c)-[:U4_HAS_CONVERSATION]->(conv)
```

**Response:**
```json
{
  "status": "success",
  "message": "Message marked as sent",
  "updated_at": "2025-11-07T18:30:00Z",
  "contact_status": "sent",
  "conversation_id": "telegram-conv-7944133972"
}
```

---

### **GET /api/outreach/conversations**

**Purpose:** Get list of active conversations with optional unread filter

**Query Parameters:**
- `unread_only` (optional): If true, only return conversations with unread replies
- `limit` (optional): Max conversations to return (default: 50)

**FalkorDB Query:**
```cypher
MATCH (conv:U4_Telegram_Conversation {
  scope_ref: 'scopelock',
  conversation_status: 'active'
})
WHERE ($unread_only = false OR conv.unread_count > 0)
  AND conv.team_member_ref = $current_user
OPTIONAL MATCH (conv)<-[:U4_PART_OF]-(reply:U4_Telegram_Reply {is_read: false})
WITH conv, reply
ORDER BY reply.sent_at DESC
LIMIT 1
RETURN conv, reply as last_unread_reply
ORDER BY conv.last_sync_at DESC
LIMIT $limit
```

**Response:**
```json
{
  "conversations": [
    {
      "id": "telegram-conv-7944133972",
      "contact": {
        "name": "Liam",
        "telegram_id": 7944133972,
        "profile_type": "hustler"
      },
      "unread_count": 2,
      "last_reply_at": "2025-11-07T10:00:00Z",
      "last_reply_preview": "Yeah I'm interested, tell me more...",
      "conversation_status": "active",
      "telegram_deep_link": "tg://resolve?domain=7944133972"
    }
  ],
  "total_count": 5
}
```

---

### **GET /api/outreach/conversation/{conversation_id}/messages**

**Purpose:** Get full message thread for a conversation

**Path Parameters:**
- `conversation_id`: Conversation slug (e.g., "telegram-conv-7944133972")

**FalkorDB Query:**
```cypher
# Get conversation
MATCH (conv:U4_Telegram_Conversation {slug: $conversation_id})
OPTIONAL MATCH (conv)<-[:U4_HAS_CONVERSATION]-(c:U4_Contact_Lead)
OPTIONAL MATCH (c)-[:U4_HAS_MESSAGE]->(outreach:U4_Outreach_Message {is_sent: true})
OPTIONAL MATCH (conv)<-[:U4_PART_OF]-(reply:U4_Telegram_Reply)
RETURN conv, c, outreach, collect(reply) as replies
```

**Response:**
```json
{
  "conversation": {
    "id": "telegram-conv-7944133972",
    "contact": {
      "name": "Liam",
      "telegram_id": 7944133972
    },
    "status": "active"
  },
  "messages": [
    {
      "type": "outreach",
      "id": "outreach-msg-a1b2c3d4",
      "text": "Hey Liam! Saw you grinding those 100 retweets...",
      "sent_by": "bigbosexf",
      "sent_at": "2025-11-07T08:30:00Z",
      "direction": "outgoing"
    },
    {
      "type": "reply",
      "id": "telegram-reply-12345",
      "text": "Hey! Yeah interested, tell me more about the pay",
      "sent_by": "Liam",
      "sent_at": "2025-11-07T09:15:00Z",
      "direction": "incoming",
      "is_read": false
    }
  ]
}
```

---

### **POST /api/outreach/conversation/{conversation_id}/mark-read**

**Purpose:** Mark all unread replies in conversation as read

**Path Parameters:**
- `conversation_id`: Conversation slug

**FalkorDB Query:**
```cypher
MATCH (conv:U4_Telegram_Conversation {slug: $conversation_id})
      <-[:U4_PART_OF]-(reply:U4_Telegram_Reply {is_read: false})
SET reply.is_read = true,
    reply.read_at = datetime(),
    reply.updated_at = datetime()
WITH conv
SET conv.unread_count = 0,
    conv.updated_at = datetime()
RETURN count(reply) as marked_read
```

**Response:**
```json
{
  "status": "success",
  "marked_read": 3
}
```

---

### **POST /api/outreach/telegram/qr-start**

**Purpose:** Start QR code authentication flow for Telegram

**Request Body:**
```json
{
  "team_member_ref": "bigbosexf"
}
```

**Process:**
1. Create Telethon client with new session
2. Request QR login from Telegram
3. Generate QR code image from login URL
4. Store pending QR token in memory (expires in 2 minutes)
5. Return QR code image + token

**Implementation:**
```python
from telethon import TelegramClient
from telethon.sessions import StringSession
import qrcode
import io
import base64

client = TelegramClient(StringSession(), API_ID, API_HASH)
await client.connect()

# Request QR login
qr_login = await client.qr_login()

# Generate QR code
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(qr_login.url)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
buffered = io.BytesIO()
img.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode()

# Store in memory for polling
qr_token = qr_login.token.hex()
pending_qr_logins[qr_token] = {
    "client": client,
    "qr_login": qr_login,
    "team_member_ref": team_member_ref,
    "expires_at": datetime.now() + timedelta(minutes=2)
}

return {
    "qr_code": f"data:image/png;base64,{img_str}",
    "token": qr_token,
    "expires_in": 120
}
```

**Response:**
```json
{
  "qr_code": "data:image/png;base64,iVBORw0KGgo...",
  "token": "a1b2c3d4e5f6...",
  "expires_in": 120
}
```

---

### **GET /api/outreach/telegram/qr-check/{token}**

**Purpose:** Poll to check if QR code was scanned

**Path Parameters:**
- `token`: QR token from qr-start response

**Process:**
1. Look up pending QR login by token
2. Check if authorized (non-blocking)
3. If authorized: save session, create node, return success
4. If not yet: return pending status

**Implementation:**
```python
qr_data = pending_qr_logins.get(token)
if not qr_data:
    return {"status": "expired"}

# Check if authorized (non-blocking)
try:
    await qr_data["qr_login"].wait(timeout=0.1)

    # Authorized! Save session
    session_string = qr_data["client"].session.save()
    encrypted_session = encrypt_session(session_string)

    # Create session node in FalkorDB
    create_telegram_session(
        team_member_ref=qr_data["team_member_ref"],
        session_string=encrypted_session,
        qr_token=token
    )

    # Clean up
    del pending_qr_logins[token]

    return {"status": "authorized"}

except asyncio.TimeoutError:
    # Not yet scanned
    return {"status": "pending"}
```

**Response (Pending):**
```json
{
  "status": "pending"
}
```

**Response (Authorized):**
```json
{
  "status": "authorized",
  "session_id": "telegram-session-bigbosexf-uuid123",
  "device_name": "ScopeLock Dashboard"
}
```

**Response (Expired):**
```json
{
  "status": "expired",
  "message": "QR code expired after 2 minutes. Please request a new one."
}
```

---

### **POST /api/outreach/telegram/disconnect**

**Purpose:** Disconnect Telegram session (revoke access)

**Request Body:**
```json
{
  "team_member_ref": "bigbosexf"
}
```

**Process:**
1. Find active session for team member
2. Log out from Telegram (terminates session on Telegram's side)
3. Mark session as inactive in FalkorDB
4. Stop monitoring conversations using this session

**FalkorDB Query:**
```cypher
MATCH (s:U4_Telegram_Session {
  scope_ref: 'scopelock',
  authorized_by: $team_member_ref,
  is_active: true
})
SET s.is_active = false,
    s.is_monitoring = false,
    s.valid_to = datetime(),
    s.updated_at = datetime()
RETURN s
```

**Response:**
```json
{
  "status": "success",
  "message": "Telegram session disconnected",
  "session_id": "telegram-session-bigbosexf-uuid123"
}
```

---

## 5. MAYA MESSAGE GENERATION SERVICE

### File: `backend/app/api/outreach/services/maya.py`

### Function Signature

```python
def generate_outreach_message(
    contact_data: dict,
    template_type: str = "auto"
) -> dict:
    """
    Generate personalized outreach message using Maya AI.

    Args:
        contact_data: Contact node data from FalkorDB
        template_type: "auto" | "supervisor" | "hustler" | "hybrid"

    Returns:
        {
            "message_text": str,
            "personalization_context": {
                "hook": str,
                "signals_used": list,
                "message_referenced": dict | null
            }
        }
    """
```

### Input Data Structure

```python
contact_data = {
    "name": "Liam",
    "telegram_id": 7944133972,
    "profile_type": "hustler",  # "supervisor" | "hustler" | "hybrid"
    "supervisor_score": 1,
    "hustler_score": 15,
    "analysis_data": {
        "signals": {
            "geographic_fit": [],
            "seeking_work": [],
            "income_need": [],
            "raider": [
                "Gm sir... Will love to assist in welcoming new members..."
            ],
            "moderator": [
                "How much do you pay your mod's"
            ],
            "designer": [],
            "marketing": []
        },
        "matching_messages": [
            {
                "message_id": 3325,
                "date": "2025-01-02T02:36:06",
                "text_snippet": "I've accumulated 100 retweets for UBC...",
                "signal_type": "raider"
            },
            {
                "message_id": 3356,
                "date": "2025-01-03T05:03:17",
                "text_snippet": "Am ready to work sir",
                "signal_type": "income_need"
            }
        ]
    },
    "twitter_handle": "lbuckley70484",
    "message_count": 179
}
```

### Message Generation Logic

```python
def generate_outreach_message(contact_data: dict, template_type: str = "auto") -> dict:
    # 1. Determine template type if auto
    if template_type == "auto":
        template_type = contact_data["profile_type"]

    # 2. Extract personalization elements
    name = contact_data["name"]
    signals = contact_data["analysis_data"]["signals"]
    matching_messages = contact_data["analysis_data"]["matching_messages"]

    # 3. Find best hook (most impactful matching message)
    hook_message = find_best_hook(matching_messages, signals)

    # 4. Build prompt for Claude
    prompt = build_generation_prompt(
        name=name,
        profile_type=template_type,
        signals=signals,
        hook_message=hook_message,
        twitter_handle=contact_data.get("twitter_handle")
    )

    # 5. Call Claude via existing infrastructure
    # (Use same pattern as Rafael service)
    message_text = call_claude_for_message_generation(prompt)

    # 6. Return result
    return {
        "message_text": message_text,
        "personalization_context": {
            "hook": hook_message["text_snippet"] if hook_message else None,
            "signals_used": list(get_non_empty_signals(signals).keys()),
            "message_referenced": hook_message
        }
    }


def find_best_hook(matching_messages: list, signals: dict) -> dict | None:
    """
    Find most impactful message to use as hook.

    Priority:
    1. Messages with high-value signals (raider, moderator, income_need)
    2. Most recent messages
    3. Longest/most specific messages
    """
    if not matching_messages:
        return None

    # Score each message
    high_value_signals = ["raider", "moderator", "income_need", "seeking_work"]

    scored_messages = []
    for msg in matching_messages:
        score = 0
        # High value signal = +10
        if msg["signal_type"] in high_value_signals:
            score += 10
        # Longer message = more specific = better
        score += min(len(msg["text_snippet"]) / 20, 5)
        # More recent = better (simple heuristic)
        if "2025" in msg["date"]:
            score += 3

        scored_messages.append((score, msg))

    # Return highest scored
    scored_messages.sort(key=lambda x: x[0], reverse=True)
    return scored_messages[0][1]


def build_generation_prompt(
    name: str,
    profile_type: str,
    signals: dict,
    hook_message: dict | None,
    twitter_handle: str | None
) -> str:
    """Build Claude prompt for message generation."""

    # Extract signal summaries
    signal_summary = []
    for signal_type, examples in signals.items():
        if examples:
            signal_summary.append(f"- {signal_type}: {len(examples)} matches")

    # Build prompt
    prompt = f"""Generate a personalized Telegram outreach message for a potential ScopeLock team member.

CONTACT PROFILE:
- Name: {name}
- Type: {profile_type}
- Twitter: @{twitter_handle if twitter_handle else 'unknown'}

SIGNALS DETECTED:
{chr(10).join(signal_summary)}

BEST HOOK (reference this in opening):
{hook_message['text_snippet'] if hook_message else 'No specific message available'}

MESSAGE REQUIREMENTS:

1. OPENING (Hook):
   - Reference the hook message directly
   - Make it personal ("Saw you grinding those 100 retweets...")
   - Show you actually read their messages

2. CONTEXT (What is ScopeLock):
   - Brief intro (1-2 sentences)
   - "AI does 95% of the coding" messaging

3. PERSONALIZATION (Why them):
   Profile type: {profile_type}

   If SUPERVISOR:
   - Emphasize: "AI codes, you supervise + deploy + test"
   - Skills needed: Basic tech understanding, can follow guides, willing to learn

   If HUSTLER:
   - Emphasize: Twitter engagement, community work, finding clients
   - Skills needed: Social media savvy, marketing, relationship building

   If HYBRID:
   - Emphasize: Both supervisor work AND marketing/community help
   - Skills needed: Versatile, can handle code review AND client outreach

4. VALUE PROP:
   - Commission-based: $360-1800/month (depending on volume)
   - Paid in $SOL automatically when client pays
   - Remote, flexible hours
   - No coding required (if hustler) OR AI does coding (if supervisor)

5. CTA:
   - Low commitment ("5 minutes to explain")
   - Clear yes/no decision
   - Sign off: "— Bigbosefx2 (ScopeLock)"

TONE:
- Friendly, direct, crypto-native
- NOT salesy or corporate
- Show you value their specific skills
- Conversational, like a DM from someone who actually read their messages

LENGTH: 150-200 words (short enough for Telegram)

Generate the message now:"""

    return prompt


def call_claude_for_message_generation(prompt: str) -> str:
    """
    Call Claude API for message generation.

    Uses same infrastructure as Rafael service.
    """
    # Import Claude Code's API client
    # (Follow same pattern as backend/app/api/mission_deck/services/rafael.py)

    # Call Claude with prompt
    response = claude_api_call(
        messages=[
            {"role": "user", "content": prompt}
        ],
        model="claude-sonnet-4-5-20250929",
        max_tokens=500
    )

    return response.content[0].text
```

### Example Output

```python
{
    "message_text": """Hey Liam! 👋

Saw you grinding those 100 retweets for UBC — that's the kind of hustle that caught my attention.

Quick intro: I run ScopeLock, a development agency where **AI does 95% of the coding** and humans supervise + handle marketing/community work.

**Why I'm reaching out to you specifically:**

You're clearly a natural at Twitter engagement. We need people like you to:
- Scout Upwork jobs (find clients who need software)
- Do Twitter raids/engagement for our client projects
- Help with community management

**Here's the deal:**
- Commission-based: **$360-1800/month** depending on volume
- Paid in **$SOL** automatically when client pays
- Remote, flexible hours
- No coding required — AI handles that

You've been active in the UBC community. Want to be here from day 1 for something you can actually earn from consistently?

If interested, I can walk you through how it works. Takes 5 minutes.

Let me know 🚀

— Bigbosefx2 (ScopeLock)""",

    "personalization_context": {
        "hook": "I've accumulated 100 retweets for UBC...",
        "signals_used": ["raider", "moderator"],
        "message_referenced": {
            "message_id": 3325,
            "date": "2025-01-02T02:36:06",
            "text_snippet": "I've accumulated 100 retweets for UBC...",
            "signal_type": "raider"
        }
    }
}
```

---

## 6. TELEGRAM READER SERVICE

### File: `backend/app/api/outreach/services/telegram_reader.py`

### Dependencies

```python
from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.errors import SessionPasswordNeededError
import asyncio
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import os
```

### Configuration

```python
# Environment variables (add to .env)
TELEGRAM_API_ID = os.getenv("TELEGRAM_API_ID")  # Get from https://my.telegram.org
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH")
TELEGRAM_SESSION_ENCRYPTION_KEY = os.getenv("TELEGRAM_SESSION_ENCRYPTION_KEY")

# Initialize cipher for session encryption
cipher = Fernet(TELEGRAM_SESSION_ENCRYPTION_KEY.encode())
```

### Session Encryption/Decryption

```python
def encrypt_session(session_string: str) -> tuple[str, str]:
    """
    Encrypt Telethon session string.

    Returns:
        (encrypted_string, iv) - Both base64 encoded
    """
    encrypted = cipher.encrypt(session_string.encode())
    return encrypted.decode(), ""  # Fernet handles IV internally


def decrypt_session(encrypted_string: str, iv: str = "") -> str:
    """
    Decrypt Telethon session string.

    Args:
        encrypted_string: Encrypted session
        iv: Initialization vector (unused for Fernet, kept for compatibility)

    Returns:
        Decrypted session string
    """
    decrypted = cipher.decrypt(encrypted_string.encode())
    return decrypted.decode()
```

### QR Code Authentication

```python
async def start_qr_auth(team_member_ref: str) -> dict:
    """
    Start QR code authentication flow.

    Returns:
        {
            "qr_code": "data:image/png;base64,...",
            "token": "hex-token-for-polling",
            "expires_in": 120
        }
    """
    import qrcode
    import io
    import base64

    # Create client with empty session
    client = TelegramClient(
        StringSession(),
        int(TELEGRAM_API_ID),
        TELEGRAM_API_HASH
    )

    await client.connect()

    # Request QR login
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

    # Store in memory for polling (expires in 2 minutes)
    qr_token = qr_login.token.hex()
    pending_qr_logins[qr_token] = {
        "client": client,
        "qr_login": qr_login,
        "team_member_ref": team_member_ref,
        "expires_at": datetime.now() + timedelta(minutes=2)
    }

    return {
        "qr_code": f"data:image/png;base64,{img_str}",
        "token": qr_token,
        "expires_in": 120
    }


async def check_qr_auth(token: str) -> dict:
    """
    Check if QR code was scanned.

    Returns:
        {"status": "pending" | "authorized" | "expired"}
    """
    qr_data = pending_qr_logins.get(token)

    if not qr_data:
        return {"status": "expired"}

    # Check if expired
    if datetime.now() > qr_data["expires_at"]:
        del pending_qr_logins[token]
        return {"status": "expired"}

    # Check if authorized (non-blocking)
    try:
        await qr_data["qr_login"].wait(timeout=0.1)

        # Authorized! Save session
        session_string = qr_data["client"].session.save()
        encrypted_session, iv = encrypt_session(session_string)

        # Create session node in FalkorDB
        from .graph import create_telegram_session
        session_id = create_telegram_session(
            team_member_ref=qr_data["team_member_ref"],
            session_string=encrypted_session,
            encryption_iv=iv,
            qr_token=token
        )

        # Clean up
        del pending_qr_logins[token]

        return {
            "status": "authorized",
            "session_id": session_id
        }

    except asyncio.TimeoutError:
        # Not yet scanned
        return {"status": "pending"}
```

### Message Polling

```python
async def poll_conversation_messages(
    session_string: str,
    contact_telegram_id: int,
    last_message_id: int = 0
) -> list[dict]:
    """
    Poll Telegram for new messages from contact.

    Args:
        session_string: Encrypted session string
        contact_telegram_id: Telegram user ID to monitor
        last_message_id: Last message ID we've seen (0 = get all)

    Returns:
        List of new messages from contact
    """
    # Decrypt session
    session = decrypt_session(session_string)

    # Create client
    client = TelegramClient(
        StringSession(session),
        int(TELEGRAM_API_ID),
        TELEGRAM_API_HASH
    )

    try:
        await client.connect()

        # Get entity (user/chat)
        entity = await client.get_entity(contact_telegram_id)

        # Get messages newer than last_message_id
        messages = await client.get_messages(
            entity,
            min_id=last_message_id,
            limit=50
        )

        # Filter for messages FROM contact (not from us)
        new_messages = []
        for msg in messages:
            # Check if message is from the contact (not from us)
            if msg.sender_id == contact_telegram_id:
                new_messages.append({
                    "telegram_message_id": msg.id,
                    "message_text": msg.text or "",
                    "sender_telegram_id": msg.sender_id,
                    "sent_at": msg.date.isoformat(),
                    "has_media": msg.media is not None
                })

        return new_messages

    finally:
        await client.disconnect()
```

### Background Monitoring Worker

```python
# In-memory storage for pending QR logins
pending_qr_logins = {}

async def monitor_all_conversations():
    """
    Background task: Monitor all active Telegram conversations.

    Runs every 60 seconds.
    Polls each active conversation for new messages.
    """
    from .graph import (
        get_active_telegram_sessions,
        get_conversations_for_session,
        save_telegram_reply,
        update_conversation_sync
    )

    while True:
        try:
            # Get all active sessions
            sessions = get_active_telegram_sessions()

            for session in sessions:
                try:
                    # Get conversations to monitor for this session
                    conversations = get_conversations_for_session(session["slug"])

                    for conv in conversations:
                        try:
                            # Poll for new messages
                            new_messages = await poll_conversation_messages(
                                session_string=session["session_string"],
                                contact_telegram_id=conv["contact_telegram_id"],
                                last_message_id=conv["last_message_id"]
                            )

                            # Save each new message
                            for msg in new_messages:
                                save_telegram_reply(
                                    conversation_slug=conv["slug"],
                                    message_data=msg
                                )

                            # Update conversation sync status
                            update_conversation_sync(
                                conversation_slug=conv["slug"],
                                new_message_count=len(new_messages),
                                last_message_id=max(
                                    [m["telegram_message_id"] for m in new_messages],
                                    default=conv["last_message_id"]
                                )
                            )

                        except Exception as e:
                            print(f"[telegram_reader] Error monitoring conversation {conv['slug']}: {e}")
                            # Continue to next conversation

                except Exception as e:
                    print(f"[telegram_reader] Error processing session {session['slug']}: {e}")
                    # Continue to next session

        except Exception as e:
            print(f"[telegram_reader] Error in monitor loop: {e}")

        # Wait 60 seconds before next poll
        await asyncio.sleep(60)


# Start background worker when app starts
def start_telegram_monitoring():
    """Start background monitoring task."""
    asyncio.create_task(monitor_all_conversations())
```

---

## 7. FALKORDB GRAPH OPERATIONS

### File: `backend/app/api/outreach/services/graph.py`

Extends existing `backend/app/api/mission_deck/services/graph.py` with outreach-specific operations.

```python
"""
FalkorDB operations for Telegram Outreach system.

Extends existing Mission Deck graph operations.
"""

from typing import List, Dict, Optional
from datetime import datetime
import uuid
from app.api.mission_deck.services.graph import query_graph


def get_pending_contacts(
    limit: int = 50,
    offset: int = 0,
    min_score: int = 0,
    profile_type: Optional[str] = None
) -> List[Dict]:
    """
    Get contacts with pending outreach status.

    Args:
        limit: Max contacts to return
        offset: Pagination offset
        min_score: Minimum combined score (supervisor + hustler)
        profile_type: Filter by "supervisor", "hustler", "hybrid" (optional)

    Returns:
        List of contact nodes
    """
    cypher = """
    MATCH (c:U4_Contact_Lead {
      scope_ref: 'scopelock',
      outreach_status: 'pending'
    })
    WHERE c.supervisor_score + c.hustler_score >= $min_score
      AND ($profile_type IS NULL OR c.profile_type = $profile_type)
    RETURN c
    ORDER BY (c.supervisor_score + c.hustler_score) DESC
    SKIP $offset
    LIMIT $limit
    """

    results = query_graph(cypher, {
        "min_score": min_score,
        "profile_type": profile_type,
        "offset": offset,
        "limit": limit
    })

    return [r["c"] for r in results]


def get_contact_by_slug(slug: str) -> Optional[Dict]:
    """Get contact node by slug."""
    cypher = """
    MATCH (c:U4_Contact_Lead {slug: $slug, scope_ref: 'scopelock'})
    RETURN c
    """

    results = query_graph(cypher, {"slug": slug})
    return results[0]["c"] if results else None


def create_outreach_message(
    contact_slug: str,
    message_text: str,
    personalization_context: dict,
    generated_by: str = "maya",
    created_by: str = "system"
) -> Dict:
    """
    Create outreach message node and link to contact.

    Returns:
        Created message node
    """
    msg_slug = f"outreach-msg-{uuid.uuid4()}"

    # Get contact to build name
    contact = get_contact_by_slug(contact_slug)
    if not contact:
        raise ValueError(f"Contact not found: {contact_slug}")

    msg_name = f"Outreach to {contact['name']}"

    # Create message node
    cypher_create = """
    CREATE (msg:U4_Outreach_Message {
      slug: $slug,
      name: $name,
      message_text: $message_text,
      personalization_context: $personalization_context,
      generated_by: $generated_by,
      generated_at: datetime(),
      is_sent: false,
      sent_by: null,
      sent_at: null,
      telegram_message_id: null,
      level: 'L2',
      scope_ref: 'scopelock',
      type_name: 'U4_Outreach_Message',
      event_kind: 'outreach_message',
      visibility: 'partners',
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      description: 'Personalized outreach message',
      substrate: 'organizational',
      policy_ref: 'l4://law/scopelock-outreach-policy',
      proof_uri: '',
      commitments: [],
      created_by: $created_by
    })
    RETURN msg
    """

    results = query_graph(cypher_create, {
        "slug": msg_slug,
        "name": msg_name,
        "message_text": message_text,
        "personalization_context": personalization_context,
        "generated_by": generated_by,
        "created_by": created_by
    })

    if not results:
        raise Exception("Failed to create outreach message")

    # Link to contact
    cypher_link = """
    MATCH (msg:U4_Outreach_Message {slug: $msg_slug})
    MATCH (c:U4_Contact_Lead {slug: $contact_slug})
    CREATE (c)-[:U4_HAS_MESSAGE]->(msg)
    """

    query_graph(cypher_link, {
        "msg_slug": msg_slug,
        "contact_slug": contact_slug
    })

    return results[0]["msg"]


def mark_message_sent(
    message_slug: str,
    sent_by: str
) -> Dict:
    """
    Mark outreach message as sent.

    Also updates contact status to "sent" and creates conversation if needed.

    Returns:
        Updated message node
    """
    # Update message
    cypher_update_msg = """
    MATCH (msg:U4_Outreach_Message {slug: $message_slug})
    SET msg.is_sent = true,
        msg.sent_at = datetime(),
        msg.sent_by = $sent_by,
        msg.updated_at = datetime()
    RETURN msg
    """

    results = query_graph(cypher_update_msg, {
        "message_slug": message_slug,
        "sent_by": sent_by
    })

    if not results:
        raise Exception(f"Message not found: {message_slug}")

    # Update contact status
    cypher_update_contact = """
    MATCH (msg:U4_Outreach_Message {slug: $message_slug})
          <-[:U4_HAS_MESSAGE]-(c:U4_Contact_Lead)
    SET c.outreach_status = 'sent',
        c.updated_at = datetime()
    RETURN c
    """

    contact_results = query_graph(cypher_update_contact, {
        "message_slug": message_slug
    })

    if not contact_results:
        raise Exception("Failed to update contact status")

    contact = contact_results[0]["c"]

    # Create conversation node if doesn't exist
    conv_slug = f"telegram-conv-{contact['telegram_id']}"

    cypher_create_conv = """
    MATCH (c:U4_Contact_Lead {slug: $contact_slug})
    MERGE (conv:U4_Telegram_Conversation {slug: $conv_slug})
    ON CREATE SET
      conv.name = 'Telegram conversation with ' + c.name,
      conv.contact_telegram_id = c.telegram_id,
      conv.team_member_ref = $sent_by,
      conv.last_message_id = 0,
      conv.last_sync_at = null,
      conv.unread_count = 0,
      conv.conversation_status = 'active',
      conv.level = 'L2',
      conv.scope_ref = 'scopelock',
      conv.type_name = 'U4_Telegram_Conversation',
      conv.visibility = 'partners',
      conv.created_at = datetime(),
      conv.updated_at = datetime(),
      conv.valid_from = datetime(),
      conv.valid_to = null,
      conv.description = 'Monitored Telegram conversation',
      conv.substrate = 'organizational',
      conv.policy_ref = 'l4://law/scopelock-outreach-policy',
      conv.commitments = [],
      conv.created_by = $sent_by
    MERGE (c)-[:U4_HAS_CONVERSATION]->(conv)
    RETURN conv
    """

    query_graph(cypher_create_conv, {
        "contact_slug": contact["slug"],
        "conv_slug": conv_slug,
        "sent_by": sent_by
    })

    return results[0]["msg"]


def create_telegram_session(
    team_member_ref: str,
    session_string: str,
    encryption_iv: str,
    qr_token: str
) -> str:
    """
    Create Telegram session node.

    Returns:
        Session slug
    """
    session_slug = f"telegram-session-{team_member_ref}-{uuid.uuid4()}"

    cypher = """
    CREATE (s:U4_Telegram_Session {
      slug: $slug,
      name: 'Telegram session for ' + $team_member_ref,
      session_string: $session_string,
      encryption_iv: $encryption_iv,
      authorized_by: $team_member_ref,
      authorized_at: datetime(),
      qr_token: $qr_token,
      is_active: true,
      last_used_at: datetime(),
      expires_at: datetime() + duration({days: 30}),
      is_monitoring: true,
      last_sync_at: null,
      level: 'L2',
      scope_ref: 'scopelock',
      type_name: 'U4_Telegram_Session',
      visibility: 'private',
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: datetime() + duration({days: 30}),
      description: 'Telegram session for conversation monitoring',
      substrate: 'organizational',
      policy_ref: 'l4://law/scopelock-telegram-session-policy',
      commitments: [],
      created_by: $team_member_ref
    })
    RETURN s.slug as slug
    """

    results = query_graph(cypher, {
        "slug": session_slug,
        "team_member_ref": team_member_ref,
        "session_string": session_string,
        "encryption_iv": encryption_iv,
        "qr_token": qr_token
    })

    return results[0]["slug"]


def get_active_telegram_sessions() -> List[Dict]:
    """Get all active Telegram sessions for monitoring."""
    cypher = """
    MATCH (s:U4_Telegram_Session {
      scope_ref: 'scopelock',
      is_active: true,
      is_monitoring: true
    })
    WHERE s.expires_at > datetime()
    RETURN s
    """

    results = query_graph(cypher, {})
    return [r["s"] for r in results]


def get_conversations_for_session(session_slug: str) -> List[Dict]:
    """Get all active conversations for a session."""
    cypher = """
    MATCH (s:U4_Telegram_Session {slug: $session_slug})
          <-[:U4_USES_SESSION]-(conv:U4_Telegram_Conversation)
    WHERE conv.conversation_status = 'active'
    RETURN conv
    """

    results = query_graph(cypher, {"session_slug": session_slug})
    return [r["conv"] for r in results]


def save_telegram_reply(
    conversation_slug: str,
    message_data: dict
) -> Dict:
    """
    Save new Telegram reply to database.

    Args:
        conversation_slug: Conversation slug
        message_data: {
            telegram_message_id, message_text,
            sender_telegram_id, sent_at
        }

    Returns:
        Created reply node
    """
    reply_slug = f"telegram-reply-{message_data['telegram_message_id']}"

    # Get conversation to get contact name
    conv = get_conversation_by_slug(conversation_slug)
    if not conv:
        raise ValueError(f"Conversation not found: {conversation_slug}")

    cypher_create = """
    CREATE (reply:U4_Telegram_Reply {
      slug: $slug,
      name: $name,
      telegram_message_id: $telegram_message_id,
      message_text: $message_text,
      sender_telegram_id: $sender_telegram_id,
      sent_at: datetime($sent_at),
      is_read: false,
      read_at: null,
      sentiment: null,
      requires_response: false,
      level: 'L2',
      scope_ref: 'scopelock',
      type_name: 'U4_Telegram_Reply',
      event_kind: 'telegram_reply',
      visibility: 'partners',
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      description: 'Reply from potential team member',
      substrate: 'organizational',
      policy_ref: 'l4://law/scopelock-outreach-policy',
      commitments: [],
      created_by: 'telegram_reader'
    })
    RETURN reply
    """

    results = query_graph(cypher_create, {
        "slug": reply_slug,
        "name": f"Reply in {conversation_slug}",
        "telegram_message_id": message_data["telegram_message_id"],
        "message_text": message_data["message_text"],
        "sender_telegram_id": message_data["sender_telegram_id"],
        "sent_at": message_data["sent_at"]
    })

    if not results:
        raise Exception("Failed to create reply")

    # Link to conversation
    cypher_link = """
    MATCH (reply:U4_Telegram_Reply {slug: $reply_slug})
    MATCH (conv:U4_Telegram_Conversation {slug: $conversation_slug})
    CREATE (reply)-[:U4_PART_OF]->(conv)
    """

    query_graph(cypher_link, {
        "reply_slug": reply_slug,
        "conversation_slug": conversation_slug
    })

    # Update conversation unread count
    cypher_update_conv = """
    MATCH (conv:U4_Telegram_Conversation {slug: $conversation_slug})
    SET conv.unread_count = conv.unread_count + 1,
        conv.updated_at = datetime()
    RETURN conv
    """

    query_graph(cypher_update_conv, {"conversation_slug": conversation_slug})

    # Update contact status to "replied"
    cypher_update_contact = """
    MATCH (conv:U4_Telegram_Conversation {slug: $conversation_slug})
          <-[:U4_HAS_CONVERSATION]-(c:U4_Contact_Lead)
    SET c.outreach_status = 'replied',
        c.updated_at = datetime()
    RETURN c
    """

    query_graph(cypher_update_contact, {"conversation_slug": conversation_slug})

    return results[0]["reply"]


def update_conversation_sync(
    conversation_slug: str,
    new_message_count: int,
    last_message_id: int
) -> None:
    """Update conversation sync status after polling."""
    cypher = """
    MATCH (conv:U4_Telegram_Conversation {slug: $conversation_slug})
    SET conv.last_message_id = $last_message_id,
        conv.last_sync_at = datetime(),
        conv.updated_at = datetime()
    RETURN conv
    """

    query_graph(cypher, {
        "conversation_slug": conversation_slug,
        "last_message_id": last_message_id
    })


def get_conversation_by_slug(slug: str) -> Optional[Dict]:
    """Get conversation node by slug."""
    cypher = """
    MATCH (conv:U4_Telegram_Conversation {slug: $slug, scope_ref: 'scopelock'})
    RETURN conv
    """

    results = query_graph(cypher, {"slug": slug})
    return results[0]["conv"] if results else None
```

---

## 8. DATA INGESTION SCRIPT

### File: `backend/scripts/ingest_analysis_data.py`

```python
#!/usr/bin/env python3
"""
Ingest Telegram analysis data into FalkorDB.

Loads team_members.json and potential_clients.json
and creates U4_Contact_Lead nodes.

Usage:
    python backend/scripts/ingest_analysis_data.py
"""

import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.api.outreach.services.graph import query_graph


def load_team_members():
    """Load team members JSON."""
    path = Path("/home/mind-protocol/scopelock/outreach/team_members/team_members.json")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def load_potential_clients():
    """Load potential clients JSON."""
    path = Path("/home/mind-protocol/scopelock/outreach/potential_clients/potential_clients.json")
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def create_contact_node(contact_data: dict, source: str) -> str:
    """
    Create U4_Contact_Lead node from analysis data.

    Args:
        contact_data: Dict from team_members.json or potential_clients.json
        source: "team_member" | "client"

    Returns:
        Created node slug
    """
    slug = f"contact-{contact_data['telegram_id']}"

    # Extract fields
    name = contact_data.get('name', 'Unknown')
    telegram_id = contact_data['telegram_id']
    chat_type = contact_data.get('chat_type', 'personal_chat')

    # Profile type (team_members have this, clients don't)
    profile_type = contact_data.get('profile_type', 'unknown')
    supervisor_score = contact_data.get('score', 0)
    hustler_score = contact_data.get('hustler_score', 0)

    # For clients, use score as supervisor_score
    if source == "client":
        supervisor_score = contact_data.get('score', 0)
        hustler_score = 0
        profile_type = 'client'

    # Message count
    message_count = contact_data.get('message_count', 0)

    # Store full analysis as JSON
    analysis_data = contact_data

    # Twitter handle if available
    twitter_handle = None
    if 'sample_messages' in contact_data:
        for msg in contact_data['sample_messages']:
            if '@' in msg and 'twitter' in msg.lower():
                # Try to extract @handle
                import re
                match = re.search(r'@(\w+)', msg)
                if match:
                    twitter_handle = match.group(1)
                    break

    # Build description
    if source == "team_member":
        desc = f"{profile_type.capitalize()} profile (supervisor: {supervisor_score}, hustler: {hustler_score})"
    else:
        desc = f"Potential client (score: {supervisor_score})"

    # Create node
    cypher = """
    MERGE (c:U4_Contact_Lead {telegram_id: $telegram_id})
    ON CREATE SET
      c.slug = $slug,
      c.name = $name,
      c.chat_type = $chat_type,
      c.profile_type = $profile_type,
      c.supervisor_score = $supervisor_score,
      c.hustler_score = $hustler_score,
      c.outreach_status = 'pending',
      c.analysis_data = $analysis_data,
      c.message_count = $message_count,
      c.twitter_handle = $twitter_handle,
      c.level = 'L2',
      c.scope_ref = 'scopelock',
      c.type_name = 'U4_Contact_Lead',
      c.visibility = 'partners',
      c.created_at = datetime(),
      c.updated_at = datetime(),
      c.valid_from = datetime(),
      c.valid_to = null,
      c.description = $description,
      c.substrate = 'organizational',
      c.policy_ref = 'l4://law/scopelock-outreach-policy',
      c.proof_uri = '',
      c.commitments = [],
      c.created_by = 'ingestion_script',
      c.source = $source
    ON MATCH SET
      c.updated_at = datetime()
    RETURN c.slug as slug
    """

    result = query_graph(cypher, {
        "telegram_id": telegram_id,
        "slug": slug,
        "name": name,
        "chat_type": chat_type,
        "profile_type": profile_type,
        "supervisor_score": supervisor_score,
        "hustler_score": hustler_score,
        "analysis_data": analysis_data,
        "message_count": message_count,
        "twitter_handle": twitter_handle,
        "description": desc,
        "source": source
    })

    return result[0]["slug"] if result else None


def main():
    """Main ingestion process."""
    print("="*80)
    print("TELEGRAM ANALYSIS DATA INGESTION")
    print("="*80)
    print()

    # Load data
    print("Loading data...")
    team_members = load_team_members()
    potential_clients = load_potential_clients()
    print(f"✓ Loaded {len(team_members)} team members")
    print(f"✓ Loaded {len(potential_clients)} potential clients")
    print()

    # Ingest team members
    print("Ingesting team members...")
    team_count = 0
    for member in team_members:
        try:
            slug = create_contact_node(member, source="team_member")
            if slug:
                team_count += 1
                if team_count % 50 == 0:
                    print(f"  {team_count}/{len(team_members)}...")
        except Exception as e:
            print(f"  Error creating {member.get('name')}: {e}")

    print(f"✓ Created {team_count} team member contact nodes")
    print()

    # Ingest potential clients
    print("Ingesting potential clients...")
    client_count = 0
    for client in potential_clients:
        try:
            slug = create_contact_node(client, source="client")
            if slug:
                client_count += 1
                if client_count % 20 == 0:
                    print(f"  {client_count}/{len(potential_clients)}...")
        except Exception as e:
            print(f"  Error creating {client.get('name')}: {e}")

    print(f"✓ Created {client_count} potential client contact nodes")
    print()

    # Verify
    print("Verifying ingestion...")
    cypher_verify = """
    MATCH (c:U4_Contact_Lead {scope_ref: 'scopelock'})
    RETURN count(c) as total_contacts
    """
    result = query_graph(cypher_verify, {})
    total = result[0]["total_contacts"] if result else 0

    print(f"✓ Total contacts in database: {total}")
    print()
    print("="*80)
    print("INGESTION COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()
```

---

## 9. FRONTEND COMPONENTS

### Component: `src/components/mission-deck/OutreachDashboard.tsx`

```tsx
"use client";

import { useState, useEffect } from 'react';
import styles from './OutreachDashboard.module.css';
import { OutreachQueue } from './OutreachQueue';
import { ConversationList } from './ConversationList';
import { TelegramConnect } from './TelegramConnect';

interface OutreachDashboardProps {
  missionId: string;
}

export function OutreachDashboard({ missionId }: OutreachDashboardProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'conversations'>('queue');
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check Telegram connection status
  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch('/api/outreach/telegram/status');
        const data = await response.json();
        setIsConnected(data.is_connected);
      } catch (error) {
        console.error('Error checking Telegram connection:', error);
      }
    }

    checkConnection();
  }, []);

  // Poll for new conversations
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/outreach/conversations?unread_only=true');
        const data = await response.json();
        setUnreadCount(data.conversations.length);
      } catch (error) {
        console.error('Error polling conversations:', error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Team Member Hunting</h2>
        <TelegramConnect
          isConnected={isConnected}
          onConnectionChange={setIsConnected}
        />
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === 'queue' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('queue')}
        >
          📤 Outreach Queue
        </button>
        <button
          className={activeTab === 'conversations' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('conversations')}
        >
          💬 Conversations
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'queue' && <OutreachQueue />}
        {activeTab === 'conversations' && <ConversationList />}
      </div>
    </div>
  );
}
```

---

### Component: `src/components/mission-deck/TelegramConnect.tsx`

```tsx
"use client";

import { useState } from 'react';
import styles from './TelegramConnect.module.css';

interface TelegramConnectProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export function TelegramConnect({ isConnected, onConnectionChange }: TelegramConnectProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'waiting' | 'error'>('idle');

  async function handleConnect() {
    setStatus('loading');

    try {
      // Request QR code
      const response = await fetch('/api/outreach/telegram/qr-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_member_ref: 'current-user' }) // Replace with actual user
      });

      const data = await response.json();
      setQrCode(data.qr_code);
      setQrToken(data.token);
      setShowQR(true);
      setStatus('waiting');

      // Start polling for auth
      pollForAuth(data.token);

    } catch (error) {
      console.error('Error generating QR code:', error);
      setStatus('error');
    }
  }

  async function pollForAuth(token: string) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/outreach/telegram/qr-check/${token}`);
        const data = await response.json();

        if (data.status === 'authorized') {
          clearInterval(pollInterval);
          setShowQR(false);
          setStatus('idle');
          onConnectionChange(true);
          alert('✅ Telegram connected! We can now monitor conversations.');
        } else if (data.status === 'expired') {
          clearInterval(pollInterval);
          setStatus('error');
          alert('QR code expired. Please try again.');
        }
      } catch (error) {
        console.error('Error polling for auth:', error);
        clearInterval(pollInterval);
        setStatus('error');
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status === 'waiting') {
        setStatus('error');
      }
    }, 120000);
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect Telegram? You will stop receiving reply notifications.')) {
      return;
    }

    try {
      await fetch('/api/outreach/telegram/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_member_ref: 'current-user' })
      });

      onConnectionChange(false);
      alert('Telegram disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert('Failed to disconnect');
    }
  }

  if (isConnected) {
    return (
      <div className={styles.connected}>
        <span className={styles.statusIndicator}>● Connected to Telegram</span>
        <button onClick={handleDisconnect} className={styles.disconnectBtn}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={handleConnect} className={styles.connectBtn} disabled={status === 'loading'}>
        {status === 'loading' ? 'Generating QR...' : 'Connect Telegram'}
      </button>

      {showQR && (
        <div className={styles.qrModal}>
          <div className={styles.qrModalContent}>
            <h3>Scan with Telegram App</h3>

            {qrCode && (
              <img src={qrCode} alt="Telegram QR Code" className={styles.qrCode} />
            )}

            <ol className={styles.instructions}>
              <li>Open <strong>Telegram app</strong> on your phone</li>
              <li>Go to <strong>Settings → Devices</strong></li>
              <li>Tap <strong>"Link Desktop Device"</strong></li>
              <li>Scan this QR code</li>
            </ol>

            {status === 'waiting' && (
              <p className={styles.waiting}>⏳ Waiting for scan...</p>
            )}

            <button onClick={() => setShowQR(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 10. ENVIRONMENT VARIABLES

Add to `backend/.env`:

```bash
# Telegram API Credentials (get from https://my.telegram.org)
TELEGRAM_API_ID=12345678
TELEGRAM_API_HASH=abcdef1234567890abcdef1234567890

# Session encryption (generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
TELEGRAM_SESSION_ENCRYPTION_KEY=your-32-byte-fernet-key-here

# FalkorDB (already exists)
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=existing-key
GRAPH_NAME=scopelock
```

---

## 11. DEPLOYMENT CHECKLIST

### Phase 1: Backend Setup
- [ ] Add Telegram API credentials to environment
- [ ] Install Python dependencies: `telethon qrcode cryptography`
- [ ] Run ingestion script: `python backend/scripts/ingest_analysis_data.py`
- [ ] Verify 313 contacts loaded in FalkorDB
- [ ] Test API endpoints with Postman/curl
- [ ] Start background monitoring worker

### Phase 2: Frontend Setup
- [ ] Create Mission Deck mission entry for "Team Member Hunting"
- [ ] Build OutreachDashboard component
- [ ] Build TelegramConnect component (QR code flow)
- [ ] Build OutreachQueue component
- [ ] Build ConversationList component
- [ ] Add route: `/mission-deck/console?mission=team-member-hunting`

### Phase 3: Maya Integration
- [ ] Implement message generation service
- [ ] Test with sample contacts
- [ ] Verify personalization quality
- [ ] Tune prompts based on results

### Phase 4: Testing
- [ ] Test QR code auth flow
- [ ] Test message generation for all profile types
- [ ] Test mark-as-sent workflow
- [ ] Test conversation monitoring
- [ ] Test reply detection
- [ ] Test notification system

### Phase 5: Production
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Onboard first team member (Bigbosefx2)
- [ ] Monitor first 10 outreach messages
- [ ] Iterate based on response rates

---

## 12. SUCCESS CRITERIA

**System is complete and working when:**

✅ All 313 team members loaded into FalkorDB
✅ Team member can view outreach queue sorted by score
✅ Maya generates personalized message using contact's signals
✅ Generated message references specific matching messages
✅ Team member can copy message and open Telegram via deep link
✅ Team member can mark message as sent
✅ QR code authentication works smoothly
✅ Session appears in Telegram app's "Active Sessions"
✅ Background worker polls conversations every 60 seconds
✅ New replies detected within 60 seconds
✅ Dashboard shows unread notification count
✅ Conversation view shows full threaded messages
✅ Mark as read updates unread count
✅ No automated sending (100% human confirms)
✅ No security warnings (QR code flow trusted)

---

## 13. FUTURE ENHANCEMENTS (Post-MVP)

**Phase 2 Features (if needed):**
- AI sentiment classification for replies
- Auto-suggest response drafts
- Conversation tagging/categorization
- Response templates library
- Analytics dashboard (response rates, conversion rates)
- A/B testing different message templates
- Bulk operations (send to multiple contacts)
- Team member assignment (route conversations to specific people)

---

**END OF SPECIFICATION**

This document contains everything Inna needs to write the complete 6-level documentation (PATTERN → GUIDE) and everything Rafael needs to implement the system.

@Inna - Ready for your documentation!
@Rafael - Ready for implementation once Inna completes specs!
