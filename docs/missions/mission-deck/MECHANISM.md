# MECHANISM: ScopeLock Mission Deck

**Mission:** Internal developer dashboard
**Architecture:** Next.js frontend + FastAPI backend + FalkorDB graph storage
**Created:** 2025-11-05
**Updated:** 2025-11-06 (migrated to FalkorDB)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Next.js 14 (App Router)                       │ │
│  │  ┌──────────┬──────────┬──────────┬──────────┐        │ │
│  │  │ Mission  │ Chat Tab │ DoD Tab  │ Context  │        │ │
│  │  │ Selector │          │          │ Tab      │        │ │
│  │  └────┬─────┴─────┬────┴────┬─────┴─────┬────┘        │ │
│  │       │           │         │           │              │ │
│  │       └───────────┴─────────┴───────────┘              │ │
│  │                      │                                  │ │
│  │                 API Client                              │ │
│  │                 (fetch/axios)                           │ │
│  └─────────────────────┼──────────────────────────────────┘ │
└─────────────────────────┼──────────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               FastAPI Backend (Python 3.11+)                 │
│  ┌────────────┬──────────────┬──────────────┬─────────────┐│
│  │ Auth       │ Missions API │ Chat API     │ DoD API     ││
│  │ Middleware │ /api/missions│ /api/.../chat│ /api/.../dod││
│  └────┬───────┴──────┬───────┴──────┬───────┴─────┬───────┘│
│       │              │              │             │         │
│       └──────────────┴──────────────┴─────────────┘         │
│                      │                                       │
│           FalkorDB REST API Client                           │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │ HTTPS/Cypher
                       ▼
┌─────────────────────────────────────────────────────────────┐
│    FalkorDB Production Graph (Mind Protocol v2)              │
│    https://mindprotocol.onrender.com/admin/query            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Graph: scopelock (L2 org level)                      │  │
│  │                                                       │  │
│  │ Nodes:                                               │  │
│  │  • U4_Agent (developers, citizens)                   │  │
│  │  • U4_Work_Item (missions, tasks)                    │  │
│  │  • U4_Event (chat messages)                          │  │
│  │  • U4_Knowledge_Object (files, docs)                 │  │
│  │                                                       │  │
│  │ Links:                                               │  │
│  │  • U4_ASSIGNED_TO (mission → developer)              │  │
│  │  • U4_MEMBER_OF (task → mission)                     │  │
│  │  • U4_ABOUT (message → mission)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

External:
┌─────────────────────────────┐
│ Claude API (or GPT-4)       │  ← Rafael simulation (Week 1)
│ For Rafael chat responses   │
└─────────────────────────────┘
```

**Data Flow:**

1. User logs in → Frontend calls `/api/auth/login` → Backend verifies → Returns JWT
2. User selects mission → Frontend calls `/api/missions/:id` → Backend queries FalkorDB via Cypher → Returns mission node
3. User sends chat message → Frontend calls `/api/missions/:id/chat` → Backend calls Claude API + saves to graph → Returns response
4. User toggles DoD checkbox → Frontend calls `/api/missions/:id/dod/:item_id` → Backend updates node in graph → Returns success

---

## Technology Stack

**IMPORTANT:** This follows ScopeLock standard stack. See `/docs/core/tech-stack.md`.

### Frontend

**Framework:** Next.js 14 (App Router)
- **Why:** ScopeLock standard for all frontends, zero-config deployment, server components
- **Version:** 14.0.0 or later
- **TypeScript:** Strict mode enabled
- **Styling:** Tailwind CSS 3.3+

**UI Components:**
- **Option 1:** shadcn/ui (recommended, pre-built accessible components)
- **Option 2:** Headless UI + custom Tailwind (if shadcn overkill)

**State Management:**
- **Server State:** TanStack Query (React Query) for API calls
- **Client State:** React Context + useReducer (no Redux needed for MVP)

**Deployment:** Vercel
- **Why:** ScopeLock standard, instant deploys from GitHub
- **Environment:** Production + Preview (for PRs)

---

### Backend

**Framework:** Python 3.11+ with FastAPI
- **Why:** ScopeLock standard for Python backends, auto OpenAPI docs, async support
- **Version:** FastAPI 0.104+ (latest stable)

**Graph Client:** FalkorDB REST API
- **Why:** Direct integration with Mind Protocol v2 production graph
- **Implementation:** `requests` library for HTTP calls with Cypher queries
- **No ORM needed:** Graph queries via Cypher, not SQL

**Auth:**
- **Week 1 Decision:** Clerk (if <2h setup) OR Custom JWT (if Clerk takes longer)
- **JWT:** `python-jose` for token generation/validation
- **Password Hashing:** `passlib` with bcrypt

**API Documentation:** Automatic via FastAPI
- **Swagger UI:** `/docs`
- **ReDoc:** `/redoc`

**Deployment:** Render (Web Service)
- **Why:** ScopeLock standard for Python backends, free SSL, auto-deploys
- **Plan:** Starter ($7/month) or Free (if sufficient)

---

### Graph Database

**Type:** FalkorDB (Mind Protocol v2 production instance)
- **Why:** Single source of truth for all ScopeLock data, rich metadata, event-native
- **Hosting:** Production instance at `https://mindprotocol.onrender.com/admin/query`
- **Graph:** `scopelock` (L2 org level)
- **Scope:** All nodes have `scope_ref='scopelock'`

**No Migrations Needed:**
- Schema-free graph structure
- Nodes evolve with new attributes
- Universal attributes inherited from Mind Protocol v2 spec

**Connection:**
- REST API (not direct database connection)
- Authenticated via API key
- All queries via Cypher (graph query language)

---

### AI Integration (CRITICAL - Budget Compliance)

**Rafael Simulation (Week 1):**

**Method:** Direct API call to Claude API (or GPT-4)
- **Why:** Faster to implement than integrating actual Rafael citizen
- **Endpoint:** `POST /api/missions/:id/chat`
- **Implementation:**
  ```python
  import anthropic

  client = anthropic.Anthropic(api_key=os.environ["CLAUDE_API_KEY"])

  def get_rafael_response(user_message: str) -> str:
      response = client.messages.create(
          model="claude-3-5-sonnet-20241022",
          max_tokens=2000,
          system="You are Rafael, a code generation citizen at ScopeLock. Help developers with Python, TypeScript, and deployment questions. Provide code examples.",
          messages=[{"role": "user", "content": user_message}]
      )
      return response.content[0].text
  ```

**Cost Estimate:**
- 100 messages/week × 1,000 tokens avg = ~$2-5/week
- Within budget for Week 1 MVP

**Week 2 Upgrade (Real Rafael Citizen):**
- Integrate actual Rafael citizen via event stream or WebSocket
- OR: Continue API approach if cost acceptable

**NEVER:**
- ❌ Use OpenAI API for other features (stick to Claude for consistency)
- ❌ Bypass Claude API budget without approval

---

## FalkorDB Graph Schema

**Note:** All nodes inherit universal attributes from Mind Protocol v2 spec. See `/home/mind-protocol/mind-protocol/docs/COMPLETE_TYPE_REFERENCE.md` for complete reference.

### Node Type: U4_Agent (Developers)

**Purpose:** Represents team members (humans like Bigbosexf, Reanance, Kara)

**Example:**
```cypher
CREATE (dev:U4_Agent {
  name: "Bigbosexf",
  agent_type: "human",
  level: "L2",
  scope_ref: "scopelock",
  slug: "bigbosexf",
  status: "active",

  // Universal attributes (inherited)
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "ScopeLock developer - proposal writing & QA",
  detailed_description: "Human developer responsible for finding Upwork jobs, writing proposals with Emma's assistance, and QA testing deliverables before client delivery.",
  type_name: "U4_Agent",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-team-policy",
  proof_uri: "",
  commitments: [],
  created_by: "system",
  substrate: "organizational"
})
```

**Key Attributes:**
- `agent_type`: "human" | "citizen" | "org" | "external_system"
- `slug`: Unique identifier (e.g., "bigbosexf", "kara")
- `status`: "active" | "inactive"

---

### Node Type: U4_Work_Item (Missions)

**Purpose:** Represents client missions (work units)

**Example:**
```cypher
CREATE (mission:U4_Work_Item {
  name: "Mission #47: Telegram Bot",
  work_type: "mission",
  level: "L2",
  scope_ref: "scopelock",
  priority: "high",
  state: "doing",  // todo | doing | blocked | done | canceled
  slug: "mission-47-telegram-bot",
  status: "active",

  // Mission-specific metadata
  assignee_ref: "bigbosexf",  // U4_Agent slug
  acceptance_criteria: "Bot sends text messages <2s response time",
  due_date: datetime("2025-11-15T00:00:00Z"),

  // ScopeLock-specific (custom fields)
  client_name: "TechCorp",
  budget_cents: 30000,  // $300
  stack_backend: "Python FastAPI",
  stack_frontend: "Next.js 14",
  stack_deploy_backend: "Render",
  stack_deploy_frontend: "Vercel",
  stack_database: "FalkorDB",
  notes: "Client prefers inline buttons over separate commands.",

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Telegram bot with text messaging and inline buttons",
  detailed_description: "Build a Telegram bot that sends text messages with <2s response time and supports inline buttons for user interaction.",
  type_name: "U4_Work_Item",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-mission-policy",
  proof_uri: "",
  commitments: [],
  created_by: "emma_citizen",
  substrate: "organizational"
})
```

**Key Attributes:**
- `work_type`: "mission" | "task" | "bug" | "milestone"
- `state`: "todo" | "doing" | "blocked" | "done" | "canceled"
- `slug`: Human-readable ID (e.g., "mission-47-telegram-bot")
- `assignee_ref`: References U4_Agent slug
- `budget_cents`: Budget in cents (e.g., 30000 = $300)

---

### Node Type: U4_Event (Chat Messages)

**Purpose:** Represents chat messages between developer and Rafael

**Example:**
```cypher
CREATE (msg:U4_Event {
  name: "Rafael: Here's how to add inline buttons",
  event_kind: "message",
  level: "L2",
  scope_ref: "scopelock",
  actor_ref: "rafael_citizen",
  timestamp: datetime(),
  slug: "chat-msg-uuid-xyz",
  status: "active",

  // Message-specific metadata
  role: "assistant",  // system | user | assistant
  content: "Here's the code for inline buttons:\n```python\nfrom telegram import InlineKeyboardButton\n...\n```",
  code_blocks: [
    {
      "language": "python",
      "code": "from telegram import InlineKeyboardButton...",
      "filename": "telegram_bot.py"
    }
  ],

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Chat message from Rafael about inline buttons",
  detailed_description: "Rafael provides code snippet for implementing Telegram inline buttons",
  type_name: "U4_Event",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-chat-policy",
  proof_uri: "",
  commitments: [],
  created_by: "rafael_citizen",
  substrate: "organizational"
})
```

**Key Attributes:**
- `event_kind`: "message" | "percept" | "incident" | "decision_record"
- `role`: "system" | "user" | "assistant"
- `content`: Message text
- `code_blocks`: Array of {language, code, filename} objects
- `actor_ref`: Who sent the message (citizen or developer slug)

**Link to Mission:**
```cypher
MATCH (msg:U4_Event {slug: "chat-msg-uuid-xyz"})
MATCH (mission:U4_Work_Item {slug: "mission-47-telegram-bot"})
CREATE (msg)-[:U4_ABOUT {
  focus_type: "primary_subject",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  confidence: 1.0,
  energy: 0.7,
  forming_mindstate: "guidance",
  goal: "Provide implementation guidance for mission",
  visibility: "partners",
  commitments: [],
  created_by: "rafael_citizen",
  substrate: "organizational"
}]->(mission)
```

---

### Node Type: U4_Work_Item (DoD Tasks)

**Purpose:** Represents Definition of Done checklist items for a mission

**Example:**
```cypher
CREATE (task:U4_Work_Item {
  name: "Bot sends text messages",
  work_type: "task",
  level: "L2",
  scope_ref: "scopelock",
  priority: "high",
  state: "done",  // Completed task
  slug: "mission-47-task-1",
  status: "active",

  // Task-specific
  assignee_ref: "kara",  // Developer implementing
  acceptance_criteria: "Response time <2s",

  // DoD category metadata
  dod_category: "functional",  // functional | non-functional | tests
  dod_sort_order: 1,

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Functional requirement: Bot sends text messages",
  detailed_description: "Bot must respond to /start command with welcome message in <2 seconds",
  type_name: "U4_Work_Item",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-task-policy",
  proof_uri: "",
  commitments: [],
  created_by: "inna_citizen",
  substrate: "organizational"
})
```

**Link to Mission:**
```cypher
MATCH (task:U4_Work_Item {slug: "mission-47-task-1"})
MATCH (mission:U4_Work_Item {slug: "mission-47-telegram-bot"})
CREATE (task)-[:U4_MEMBER_OF {
  membership_type: "structural",
  role: "dod_task",
  forming_mindstate: "specification",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  confidence: 1.0,
  energy: 0.8,
  goal: "Track DoD completion for mission",
  visibility: "partners",
  commitments: [],
  created_by: "inna_citizen",
  substrate: "organizational"
}]->(mission)
```

**Key Attributes:**
- `work_type`: "task"
- `state`: "todo" | "doing" | "done"
- `dod_category`: "functional" | "non-functional" | "tests"
- `dod_sort_order`: Integer for ordering within category

---

### Node Type: U4_Knowledge_Object (Mission Files - Week 2)

**Purpose:** Represents uploaded files, documents, screenshots

**Example:**
```cypher
CREATE (file:U4_Knowledge_Object {
  name: "client_mockup.png",
  ko_type: "reference",
  level: "L2",
  scope_ref: "scopelock",
  slug: "mission-47-file-1",
  status: "active",

  // File metadata
  filename: "client_mockup.png",
  size_bytes: 245678,
  mime_type: "image/png",
  storage_url: "https://s3.amazonaws.com/scopelock/uploads/mission-47-file-1.png",
  uploaded_by: "bigbosexf",

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Client-provided UI mockup",
  detailed_description: "Screenshot of desired Telegram bot interface with inline buttons",
  type_name: "U4_Knowledge_Object",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-file-policy",
  proof_uri: "",
  commitments: [],
  created_by: "bigbosexf",
  substrate: "organizational"
})
```

**Link to Mission:**
```cypher
MATCH (file:U4_Knowledge_Object {slug: "mission-47-file-1"})
MATCH (mission:U4_Work_Item {slug: "mission-47-telegram-bot"})
CREATE (file)-[:U4_DOCUMENTS {
  documentation_type: "reference_material",
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  confidence: 1.0,
  energy: 0.6,
  forming_mindstate: "specification",
  goal: "Provide visual reference for implementation",
  visibility: "partners",
  commitments: [],
  created_by: "bigbosexf",
  substrate: "organizational"
}]->(mission)
```

---

## API Design

**Base URL:** `https://api-scopelock.mindprotocol.ai/deck` (or `http://localhost:8000` local)

**Authentication:** JWT Bearer token in `Authorization` header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Auth Endpoints

#### `POST /api/auth/login`

**Purpose:** User login, returns JWT token

**Request:**
```json
{
  "email": "person1@scopelock.ai",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-here",
    "email": "person1@scopelock.ai",
    "name": "Person 1"
  }
}
```

**Errors:**
- 401: Invalid credentials
- 400: Missing email or password

---

#### `POST /api/auth/logout` (Optional Week 1)

**Purpose:** Logout (invalidate token if using token blacklist)

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Mission Endpoints

#### `GET /api/missions`

**Purpose:** List all missions for authenticated user

**Response (200):**
```json
[
  {
    "id": "47",
    "title": "Telegram Notifier",
    "client": "Acme Corp",
    "budget": 300,
    "deadline": "2025-11-08T23:59:59Z",
    "status": "active",
    "assigned_to": "uuid-here",
    "created_at": "2025-11-05T10:00:00Z"
  },
  {
    "id": "48",
    "title": "Landing Page",
    "client": "Beta Inc",
    "budget": 450,
    "deadline": "2025-11-10T23:59:59Z",
    "status": "active",
    "assigned_to": "uuid-here",
    "created_at": "2025-11-05T11:00:00Z"
  }
]
```

**Errors:**
- 401: Unauthorized

---

#### `GET /api/missions/:id`

**Purpose:** Get single mission details

**Response (200):**
```json
{
  "id": "47",
  "title": "Telegram Notifier",
  "client": "Acme Corp",
  "budget": 300,
  "deadline": "2025-11-08T23:59:59Z",
  "status": "active",
  "assigned_to": "uuid-here",
  "stack": {
    "backend": "Python FastAPI",
    "frontend": null,
    "deploy_backend": "Render",
    "deploy_frontend": null,
    "database": "FalkorDB"
  },
  "notes": "Client prefers inline buttons over separate commands.",
  "created_at": "2025-11-05T10:00:00Z"
}
```

**Errors:**
- 404: Mission not found
- 403: Forbidden (mission assigned to different user)

---

### Chat Endpoints

#### `POST /api/missions/:id/chat`

**Purpose:** Send message to Rafael, get response

**Request:**
```json
{
  "message": "How do I send a Telegram message with inline buttons?"
}
```

**Response (200):**
```json
{
  "response": "Here's how to send a Telegram message with inline buttons:\n\n```python\nfrom telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup\n...\n```",
  "code_blocks": [
    {
      "language": "python",
      "code": "from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup\n\nbot = Bot(token='YOUR_TOKEN')\nkeyboard = [\n    [InlineKeyboardButton('Option 1', callback_data='1')],\n    [InlineKeyboardButton('Option 2', callback_data='2')]\n]\nreply_markup = InlineKeyboardMarkup(keyboard)\nbot.send_message(chat_id=CHAT_ID, text='Choose:', reply_markup=reply_markup)",
      "filename": "telegram_inline_buttons.py"
    }
  ]
}
```

**Errors:**
- 400: Empty message or message >10,000 chars
- 500: Rafael API error (Claude API down)

**Implementation Note:**
Backend extracts code blocks from Rafael's response using regex:
```python
import re

def extract_code_blocks(text: str) -> list[dict]:
    pattern = r"```(\w+)\n(.*?)```"
    matches = re.findall(pattern, text, re.DOTALL)
    return [
        {"language": lang, "code": code.strip(), "filename": f"code.{lang}"}
        for lang, code in matches
    ]
```

---

#### `GET /api/missions/:id/messages`

**Purpose:** Get chat message history

**Query Params:**
- `limit` (optional, default 50): Max messages to return
- `before` (optional): Timestamp, get messages before this time

**Response (200):**
```json
[
  {
    "id": "uuid-1",
    "role": "system",
    "content": "Mission #47: Telegram Notifier\nReady to help. What do you need?",
    "created_at": "2025-11-05T10:00:00Z"
  },
  {
    "id": "uuid-2",
    "role": "user",
    "content": "How do I send a Telegram message?",
    "created_at": "2025-11-05T10:05:00Z"
  },
  {
    "id": "uuid-3",
    "role": "assistant",
    "content": "Here's the code...",
    "code_blocks": [...],
    "created_at": "2025-11-05T10:05:10Z"
  }
]
```

---

### DoD Endpoints

#### `GET /api/missions/:id/dod`

**Purpose:** Get DoD checklist items

**Response (200):**
```json
[
  {
    "id": "uuid-1",
    "text": "Bot sends text messages",
    "category": "functional",
    "completed": false,
    "completed_at": null
  },
  {
    "id": "uuid-2",
    "text": "Bot sends inline buttons",
    "category": "functional",
    "completed": true,
    "completed_at": "2025-11-05T14:30:00Z"
  },
  {
    "id": "uuid-3",
    "text": "Deployed to Render",
    "category": "non-functional",
    "completed": false,
    "completed_at": null
  }
]
```

---

#### `PATCH /api/missions/:id/dod/:item_id`

**Purpose:** Toggle DoD item completed state

**Request:**
```json
{
  "completed": true
}
```

**Response (200):**
```json
{
  "id": "uuid-1",
  "completed": true,
  "completed_at": "2025-11-05T15:00:00Z"
}
```

**Errors:**
- 404: Item not found

---

#### `PATCH /api/missions/:id/dod/complete` (Mark All Complete)

**Purpose:** Mark all DoD items complete, change mission status to "qa"

**Response (200):**
```json
{
  "message": "All DoD items marked complete",
  "mission_status": "qa"
}
```

---

### Context Endpoint

#### `PATCH /api/missions/:id/notes`

**Purpose:** Save developer notes

**Request:**
```json
{
  "notes": "Client prefers inline buttons. Avoid separate /start command."
}
```

**Response (200):**
```json
{
  "mission_id": "47",
  "notes": "Client prefers inline buttons. Avoid separate /start command.",
  "updated_at": "2025-11-05T15:30:00Z"
}
```

---

## External Integrations

### Claude API (Rafael Simulation)

**Provider:** Anthropic
**Model:** `claude-3-5-sonnet-20241022`
**Endpoint:** `https://api.anthropic.com/v1/messages`

**Usage:**
- Week 1: All Rafael chat responses via Claude API
- Cost: ~$2-5/week for 100 messages
- Fallback: If API down, return error message to user (don't crash)

**Implementation:**
```python
# backend/services/rafael.py
import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["CLAUDE_API_KEY"])

def ask_rafael(user_message: str, mission_context: dict) -> str:
    """Get response from Rafael citizen (via Claude API)."""
    system_prompt = f"""You are Rafael, a code generation citizen at ScopeLock.

Mission: {mission_context['title']}
Stack: {mission_context['stack']['backend']}, {mission_context['stack']['frontend'] or 'backend-only'}
Database: FalkorDB (graph database, Mind Protocol v2)

Help the developer with implementation questions. Provide code examples in the correct stack."""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        return response.content[0].text
    except Exception as e:
        # Log error, return fallback message
        print(f"Rafael API error: {e}")
        return "Sorry, I'm having trouble connecting right now. Please try again in a moment."
```

---

## Security Approach

### Authentication

**Method:** JWT (JSON Web Tokens)
- **Secret:** 256-bit random string in environment variable `JWT_SECRET`
- **Expiration:** 7 days (refresh tokens in Week 2 if needed)
- **Algorithm:** HS256

**Token Payload:**
```json
{
  "sub": "user-uuid-here",
  "email": "person1@scopelock.ai",
  "exp": 1699999999
}
```

**Validation:**
Every protected endpoint checks:
1. Token present in `Authorization: Bearer <token>` header
2. Token signature valid
3. Token not expired
4. User exists in database

---

### Authorization

**Rule:** Users can only access their assigned missions.

**Enforcement:**
```python
# backend/dependencies.py
from fastapi import Depends, HTTPException
from services.graph import query_graph

def get_current_user_mission(
    mission_id: str,
    current_user: User = Depends(get_current_user)
):
    # Query mission from FalkorDB
    cypher = """
    MATCH (m:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
    WHERE m.work_type = 'mission'
    RETURN m
    """
    results = query_graph(cypher, {"slug": mission_id})

    if not results:
        raise HTTPException(status_code=404, detail="Mission not found")

    mission = results[0]["m"]
    if mission.get("assignee_ref") != current_user.slug:
        raise HTTPException(status_code=403, detail="Not authorized")

    return mission
```

---

### Data Validation

**Input Validation:**
- Chat message: 1-10,000 characters
- Notes: 0-50,000 characters
- Email: Valid email format
- Password: ≥8 chars (if using custom auth)

**Cypher Injection Prevention:**
- Always use parameterized Cypher queries via FalkorDB REST API
- NEVER construct Cypher strings with user input concatenation
- Example safe query:
  ```python
  cypher = "MATCH (m:U4_Work_Item {slug: $slug}) RETURN m"
  params = {"slug": user_provided_slug}
  query_graph(cypher, params)
  ```

**XSS Prevention:**
- Sanitize user notes before rendering (Next.js auto-escapes by default)
- Sanitize chat messages (escape HTML entities)

---

### Secrets Management

**Environment Variables:**

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://api-scopelock.mindprotocol.ai/deck
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # If using Clerk
```

**Backend (.env):**
```bash
# Production FalkorDB connection (Mind Protocol v2 graph)
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock

# Auth & API
JWT_SECRET=<256-bit random string>
CLAUDE_API_KEY=sk-ant-...
CORS_ORIGINS=https://scopelock.mindprotocol.ai/deck,http://localhost:3000
```

**Storage:**
- Local dev: `.env` files (NEVER commit to git)
- Production: Render environment variables + Vercel environment variables

---

## Deployment Architecture

### Frontend (Vercel)

**Project Name:** `scopelock-deck`
**Framework Preset:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` → Production backend URL

**Next.js Configuration:**
```javascript
// next.config.js
module.exports = {
  basePath: '/deck',
  assetPrefix: '/deck',
}
```

**Domains:**
- Production: `scopelock.mindprotocol.ai/deck` (via rewrite from main site)
- Preview: `scopelock-deck-<hash>.vercel.app/deck`

**Deployment Trigger:**
- Push to `main` → Production deploy
- Push to PR → Preview deploy

**Routing Setup:**
Main site (`scopelock.mindprotocol.ai`) rewrites `/deck/*` to this Vercel deployment

---

### Backend (Render)

**Service Name:** `scopelock-deck-api`
**Type:** Web Service
**Runtime:** Python 3.11
**Build Command:** `pip install -r requirements.txt`
**Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
- `FALKORDB_API_URL` → `https://mindprotocol.onrender.com/admin/query`
- `FALKORDB_API_KEY` → Production API key
- `GRAPH_NAME` → `scopelock`
- `JWT_SECRET` → Manual input (256-bit)
- `CLAUDE_API_KEY` → Manual input
- `CORS_ORIGINS` → `https://scopelock.mindprotocol.ai/deck`

**Health Check:**
- Endpoint: `GET /health`
- Expected: `{"status": "ok"}`

**Auto-Deploy:**
- Push to `main` → Auto-deploy

---

### Graph Database (Production FalkorDB)

**Note:** No separate database deployment needed. Mission Deck uses the production Mind Protocol v2 graph.

**Instance:** Production FalkorDB at `https://mindprotocol.onrender.com/admin/query`
**Graph:** `scopelock` (L2 org level)
**Scope:** All Mission Deck nodes have `scope_ref='scopelock'`

**Access:**
- Backend connects via REST API (HTTPS)
- API key authentication (environment variable)
- No direct database connection needed

**Data Safety:**
- All writes use Mind Protocol v2 ingestion API
- Universal attributes auto-populated
- Bitemporal tracking (`created_at`, `updated_at`, `valid_from`, `valid_to`)

---

## Error Handling

### Backend Error Strategy

**Principle:** Fail loud, log everything, return useful errors.

**Error Response Format:**
```json
{
  "detail": "Human-readable error message",
  "code": "MISSION_NOT_FOUND",
  "timestamp": "2025-11-05T15:00:00Z"
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (not your mission)
- 404: Not Found
- 500: Internal Server Error (log to Sentry)

**Example:**
```python
from fastapi import HTTPException
from services.graph import query_graph

@app.get("/api/missions/{mission_id}")
async def get_mission(mission_id: str, current_user: User = Depends(get_current_user)):
    # Query mission from FalkorDB
    cypher = """
    MATCH (m:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
    WHERE m.work_type = 'mission'
    RETURN m
    """
    results = query_graph(cypher, {"slug": mission_id})

    if not results:
        raise HTTPException(status_code=404, detail="Mission not found")

    mission = results[0]["m"]
    if mission.get("assignee_ref") != current_user.slug:
        raise HTTPException(status_code=403, detail="Not authorized to view this mission")

    return mission
```

---

### Frontend Error Strategy

**Principle:** Show user-friendly messages, log technical errors.

**Error Handling:**
```tsx
// src/lib/api.ts
async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Something went wrong');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Show toast notification to user
    toast.error(error.message);
    throw error;
  }
}
```

**User-Facing Messages:**
- 401: "Session expired. Please log in again."
- 403: "You don't have access to this mission."
- 404: "Mission not found."
- 500: "Something went wrong. Please try again."
- Rafael API error: "Rafael is temporarily unavailable. Please try again in a moment."

---

## Performance Optimizations

**Frontend:**
- Server Components for mission list (Next.js 14 App Router)
- Client Components only for interactive elements (chat input, checkboxes)
- TanStack Query for caching API responses (5 min stale time)
- Code splitting: Lazy load tabs (React.lazy + Suspense)

**Backend:**
- FalkorDB REST API connection pooling (requests Session)
- Cache frequently accessed missions in-memory (5 min TTL)
- Limit chat history to last 50 messages (pagination Week 2)
- Batch queries when possible (single Cypher query for multiple operations)

**Graph Database:**
- Graph indexes on `U4_Work_Item.slug` (frequent lookup)
- Graph indexes on `U4_Work_Item.scope_ref` (all queries filter by scope)
- Cypher query optimization (use MATCH with specific labels, avoid full graph scans)

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
