# MECHANISM: Mission Deck Compensation System

**Version:** 1.1 (WebSocket + Tier-Based Payments)
**Created:** 2025-11-07
**Updated:** 2025-11-07
**Mission:** Architecture and implementation approach for interaction-based compensation with WebSocket real-time updates and tier-based mission payments

---

## Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                     Mission Deck Frontend                      │
│                    (Next.js 14 + React)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐│
│  │  JOBS Section             MISSIONS Section                 ││
│  │  ├─ Job Cards             ├─ Mission Cards                 ││
│  │  │  ├─ Interaction count  │  ├─ Fixed payment              ││
│  │  │  ├─ Potential earning  │  ├─ Claim button               ││
│  │  │  └─ Chat interface     │  └─ Completion form            ││
│  │  └─ Create Job button     └─ Mission fund balance          ││
│  │                                                             ││
│  │  Top Banner: Total Potential Earnings                      ││
│  └───────────────────────────────────────────────────────────┘│
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST API + WebSocket (real-time updates)
                       ↓
┌───────────────────────────────────────────────────────────────┐
│              Backend API (Python FastAPI)                      │
│                                                                 │
│  ┌──────────────────────┐  ┌────────────────────────────────┐│
│  │ Compensation Service │  │   Interaction Tracker          ││
│  │  ├─ Calculate        │  │   ├─ Count interactions        ││
│  │  │  earnings          │  │   ├─ Validate context         ││
│  │  ├─ Track mission    │  │   ├─ Prevent duplicates       ││
│  │  │  fund balance      │  │   └─ Emit events              ││
│  │  └─ Trigger payments  │  └────────────────────────────────┘│
│  └──────────────────────┘                                      │
│                                                                 │
│  ┌──────────────────────┐  ┌────────────────────────────────┐│
│  │  Mission Manager     │  │   Payment Processor            ││
│  │  ├─ Claim missions   │  │   ├─ Freeze interaction counts ││
│  │  ├─ Validate minimum │  │   ├─ Calculate final shares   ││
│  │  │  interactions      │  │   ├─ Update paid history      ││
│  │  ├─ Handle expiry    │  │   └─ Send notifications       ││
│  │  └─ Approve          │  └────────────────────────────────┘│
│  │     completions       │                                     │
│  └──────────────────────┘                                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ FalkorDB REST API (Cypher queries)
                       ↓
┌───────────────────────────────────────────────────────────────┐
│    FalkorDB Production Graph (Mind Protocol v2)                │
│    https://mindprotocol.onrender.com/admin/query              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Graph: scopelock (L2 org level)                          │ │
│  │                                                           │ │
│  │ Nodes:                                                    │ │
│  │  • U4_Work_Item (work_type='job')                        │ │
│  │    ├─ value, teamPool, missionFund                       │ │
│  │    ├─ status: active|completed|paid                      │ │
│  │    └─ totalInteractions                                  │ │
│  │                                                           │ │
│  │  • U4_Work_Item (work_type='mission')                    │ │
│  │    ├─ missionType: proposal|recruitment|social|other     │ │
│  │    ├─ fixedPayment                                       │ │
│  │    ├─ status: available|claimed|completed|paid           │ │
│  │    ├─ claimedBy (agent slug)                             │ │
│  │    └─ claimedAt, completedAt timestamps                  │ │
│  │                                                           │ │
│  │  • U4_Event (event_kind='message')                       │ │
│  │    ├─ actor_ref (member slug)                            │ │
│  │    ├─ content (message text)                             │ │
│  │    ├─ ai_recipient: rafael|inna|sofia|emma               │ │
│  │    └─ timestamp                                           │ │
│  │                                                           │ │
│  │  • U4_Agent (team members)                               │ │
│  │    ├─ totalInteractions (across all jobs)                │ │
│  │    ├─ potentialEarnings (cached sum)                     │ │
│  │    └─ paidEarnings (historical total)                    │ │
│  │                                                           │ │
│  │ Links:                                                    │ │
│  │  • (Event)-[:U4_ABOUT]->(Job) - Links messages to jobs   │ │
│  │  • (Event)-[:U4_CREATED_BY]->(Agent) - Message author    │ │
│  │  • (Mission)-[:U4_CLAIMED_BY]->(Agent) - Mission owner   │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
**Framework:** Next.js 14 (App Router) deployed on **Vercel**
- **Why:** Standard ScopeLock stack, zero-config deployment, real-time updates via WebSocket

**UI Library:** React 18.3+ with Zustand for state management
- **Why:** Zustand provides simple real-time state updates without Redux complexity

**Real-time Updates:** WebSocket for personal earnings updates (Week 1 scope)
- **Why:** Bidirectional communication for future team features, persistent connection reduces latency
- **Scope:** Personal earnings only (no team broadcasts yet - deferred to Week 2+)

**Styling:** Tailwind CSS + ScopeLock design tokens
- **Why:** Consistent with existing Mission Deck UI

### Backend
**Framework:** Python 3.11+ with FastAPI deployed on **Render**
- **Why:** Standard ScopeLock stack, async support for real-time features

**Graph Client:** FalkorDB REST API via `requests` library
- **Why:** Direct integration with Mind Protocol v2 production graph

**Real-time:** FastAPI WebSocket endpoints for earnings broadcasts
- **Why:** Native async support in FastAPI, bidirectional communication, persistent connections
- **Library:** `websockets` for WebSocket protocol support

### Database
**Primary:** FalkorDB production graph (scopelock L2)
- **Why:** Unified data model with Mind Protocol v2, bitemporal audit trail

**Caching:** Redis (optional, for performance optimization)
- **Why:** Cache frequently-accessed earnings calculations

**No SQL database:** Everything stored as graph nodes/links

---

## FalkorDB Graph Schema

### Node: U4_Work_Item (Job)

**Purpose:** Represents a client job with interaction tracking

```cypher
CREATE (job:U4_Work_Item {
  name: "Build AI Chatbot - TherapyKin",
  work_type: "job",
  level: "L2",
  scope_ref: "scopelock",
  slug: "job-therapykin-chatbot-2025-11",
  status: "active",  // active|completed|paid

  // Job-specific fields
  client: "TherapyKin",
  value: 1500.00,                    // Dollar amount
  teamPool: 450.00,                  // value × 0.30
  missionFund: 75.00,                // value × 0.05
  dueDate: datetime("2025-11-20T00:00:00Z"),

  // Interaction tracking
  totalInteractions: 0,              // Sum across all members
  interactionCounts: {               // JSON object
    "member_a": 10,
    "member_b": 5
  },

  // Payment tracking
  cashReceivedAt: null,              // Timestamp when Upwork payment received
  paidAt: null,                      // Timestamp when team paid

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Build AI chatbot with OTP authentication",
  type_name: "U4_Work_Item",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-job-policy",
  created_by: "emma_citizen",
  substrate: "organizational"
})
```

**Indexes:**
- `slug` (unique identifier)
- `status` (for querying active/completed/paid jobs)
- `work_type = 'job'` (distinguish from missions)

---

### Node: U4_Work_Item (Mission)

**Purpose:** Represents an internal mission with points-based payment (proposal missions only for now)

**Payment Model:**
- Missions earn points (1 point for proposal missions)
- Points accumulate until next job completion
- Job's 5% pool split proportionally by total points
- If no missions completed → 5% pool goes to NLR

```cypher
CREATE (mission:U4_Work_Item {
  name: "Apply to all jobs from Emma search 'voice AI dashboard' (5 jobs)",
  work_type: "mission",
  level: "L2",
  scope_ref: "scopelock",
  slug: "mission-proposal-voice-ai-2025-11-07",
  status: "available",  // available|completed|paid

  // Mission-specific fields
  missionType: "proposal",           // Only 'proposal' for now (future: social, recruitment)
  points: 1,                         // Point value for payment calculation

  // Auto-creation metadata (from Emma)
  createdBy: "emma_citizen",
  emmaSearchQuery: "voice AI dashboard",
  emmaValidatedJobsCount: 5,
  emmaSearchDate: "2025-11-07",

  // Completion tracking (no claiming, no manual proof)
  completedBy: null,                 // Agent slug (first to complete wins)
  completedAt: null,                 // When Emma says "mission complete" in chat
  emmaChatSessionId: null,           // Chat session where Emma validated completion

  // Payment tracking (calculated at job completion)
  paidAt: null,                      // When next job completed
  paidWithJob: null,                 // Which job's payment batch (job slug)
  actualPayment: null,               // Calculated: (points / total_points) × job's 5% pool

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Apply to Upwork jobs validated by Emma for search 'voice AI dashboard'",
  type_name: "U4_Work_Item",
  visibility: "partners",
  policy_ref: "l4://law/scopelock-mission-policy",
  substrate: "organizational"
})
```

**Key Changes from Previous Model:**
- ❌ Removed: `fixedPayment`, `claimedBy`, `claimExpiresAt`, `proofUrl`, `proofNotes`, `approvedBy`, `approvedAt`
- ✅ Added: `points`, `emmaSearchQuery`, `emmaValidatedJobsCount`, `emmaChatSessionId`, `actualPayment`, `paidWithJob`
- ✅ Simplified: Status flow (available → completed → paid)
- ✅ Auto-validation: Emma detects "mission complete" in chat, no manual proof upload

**Indexes:**
- `slug` (unique identifier)
- `status` (for querying available/completed missions)
- `missionType` (for filtering by category)
- `work_type = 'mission'` (distinguish from jobs)
- `completedBy` (for querying member's completed missions)

---

### Node: U4_Event (Message Interaction)

**Purpose:** Represents a message sent to an AI citizen (counts as interaction)

```cypher
CREATE (event:U4_Event {
  name: "member_a: Implement OTP flow...",
  slug: "chat-msg-uuid-12345",
  event_kind: "message",
  level: "L2",
  scope_ref: "scopelock",
  status: "active",

  // Message content
  actor_ref: "member_a",             // Member who sent message
  timestamp: datetime(),
  role: "user",
  content: "Rafael, implement OTP authentication flow with Twilio",
  code_blocks: [],

  // Interaction metadata
  ai_recipient: "rafael",            // rafael|inna|sofia|emma
  interaction_context: "job",        // job|mission|general
  job_slug: "job-therapykin-chatbot-2025-11",  // Null if not job-related

  // Duplicate detection
  content_hash: "sha256:abc123...",  // For detecting duplicate messages

  // Universal attributes
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  description: "Chat message from member_a to rafael",
  type_name: "U4_Event",
  visibility: "partners",
  created_by: "member_a",
  substrate: "organizational"
})
```

**Indexes:**
- `job_slug` (for querying interactions by job)
- `actor_ref` (for querying member's interactions)
- `timestamp` (for chronological ordering)
- `content_hash` (for duplicate detection)

---

### Node: U4_Agent (Enhanced with Earnings + Wallet)

**Purpose:** Team member with earnings tracking and Solana wallet for payments

**Existing fields + new compensation fields:**

```cypher
MATCH (agent:U4_Agent {slug: 'member_a'})
SET
  // Earnings tracking (direct fields)
  agent.totalInteractions = 35,          // Across all jobs (historical)
  agent.potentialEarnings = 164.00,      // Sum from active jobs + pending missions
  agent.paidEarnings = 450.00,           // Historical total paid

  // Solana wallet (for payments) - NOT ENCRYPTED
  agent.walletAddress = "9xQeWvG816bUx9EPjHmaT23yfAS2Zo1pEZGfSPqYrGtX",
  agent.walletVerified = true,           // Has ownership been proven via signature?
  agent.walletVerifiedAt = datetime("2025-11-07T10:00:00Z"),
  agent.walletSignature = "3yZe7d5F8C...",  // Proof of ownership (from existing signing flow)

  // Detailed earnings (JSON object)
  agent.compensationData = {
    jobEarnings: {                     // Per-job breakdown
      "job-therapykin-chatbot": {
        interactions: 20,
        potentialEarning: 90.00,
        status: "pending"
      },
      "job-startupx-landing": {
        interactions: 5,
        potentialEarning: 24.00,
        status: "pending"
      }
    },

    missionEarnings: {                 // Per-mission breakdown
      "mission-proposal-ai-analytics": {
        amount: 1.00,
        status: "pending"
      },
      "mission-x-post-nov5": {
        amount: 2.00,
        status: "paid"
      }
    }
  }
```

**Wallet Fields:**
- `walletAddress` (String): Solana wallet address (Base58, ~44 chars) - NOT encrypted (public by nature)
- `walletVerified` (Boolean): Has ownership been proven via signature?
- `walletVerifiedAt` (Datetime): When signature verification passed
- `walletSignature` (String): Signature proving ownership (from existing wallet connection flow)

**Note:** Wallet connection flow already exists in system. This spec documents the storage schema only.

---

### Link: (Event)-[:U4_ABOUT]->(Job)

**Purpose:** Links message to the job it contributes to (for interaction counting)

```cypher
MATCH (event:U4_Event {slug: 'chat-msg-uuid-12345'})
MATCH (job:U4_Work_Item {slug: 'job-therapykin-chatbot-2025-11'})
CREATE (event)-[:U4_ABOUT {
  focus_type: 'primary_subject',
  created_at: datetime(),
  updated_at: datetime(),
  valid_from: datetime(),
  valid_to: null,
  confidence: 1.0,
  energy: 0.7,
  forming_mindstate: 'guidance',
  goal: 'Message contributes to job',
  visibility: 'partners',
  created_by: 'member_a',
  substrate: 'organizational'
}]->(job)
```

---

## API Endpoints

### Base URL
```
https://deck.scopelock.mindprotocol.ai/api/compensation
```

---

### Jobs

#### `POST /api/compensation/jobs`
**Create new job**

**Request:**
```json
{
  "title": "Build AI Chatbot",
  "client": "TherapyKin",
  "value": 1500,
  "dueDate": "2025-11-20"
}
```

**Response:**
```json
{
  "jobId": "job-therapykin-chatbot-2025-11",
  "teamPool": 450.00,
  "missionFundContribution": 75.00,
  "status": "active"
}
```

---

#### `GET /api/compensation/jobs`
**List all jobs**

**Query params:**
- `status` (optional): `active`, `completed`, `paid`
- `memberId` (optional): Filter jobs where member contributed

**Response:**
```json
{
  "jobs": [
    {
      "id": "job-therapykin-chatbot-2025-11",
      "title": "Build AI Chatbot - TherapyKin",
      "client": "TherapyKin",
      "value": 1500,
      "teamPool": 450,
      "status": "active",
      "yourInteractions": 20,
      "teamTotal": 50,
      "yourPotentialEarning": 180.00
    }
  ]
}
```

---

#### `GET /api/compensation/jobs/{jobId}/interactions`
**Get interaction history for a job**

**Response:**
```json
{
  "jobId": "job-therapykin-chatbot-2025-11",
  "totalInteractions": 50,
  "memberBreakdown": {
    "member_a": {
      "count": 20,
      "potentialEarning": 180.00,
      "interactions": [
        {
          "timestamp": "2025-11-07T14:23:15Z",
          "messagePreview": "Rafael, implement OTP flow...",
          "aiRecipient": "rafael"
        }
      ]
    },
    "member_b": {
      "count": 30,
      "potentialEarning": 270.00
    }
  }
}
```

---

### Interactions

#### `POST /api/compensation/interactions`
**Track new interaction (called when message sent)**

**Request:**
```json
{
  "jobId": "job-therapykin-chatbot-2025-11",
  "memberId": "member_a",
  "message": "Rafael, implement OTP authentication",
  "aiRecipient": "rafael"
}
```

**Response:**
```json
{
  "interactionCounted": true,
  "newInteractionCount": 21,
  "teamTotal": 51,
  "newPotentialEarning": 185.29,
  "eventId": "chat-msg-uuid-12345"
}
```

**Error cases:**
- Duplicate message (within 1 second): `409 Conflict`
- Job not found: `404 Not Found`
- Invalid context: `400 Bad Request`

---

### Missions

#### `GET /api/compensation/missions`
**List available missions**

**Query params:**
- `status` (optional): `available`, `completed`, `paid`
- `type` (optional): `proposal` (only type for now)

**Response:**
```json
{
  "missionFundBalance": 150.00,
  "currentPoints": 3,
  "missions": [
    {
      "id": "mission-proposal-voice-ai-2025-11-07",
      "title": "Apply to all jobs from Emma search 'voice AI dashboard' (5 jobs)",
      "type": "proposal",
      "points": 1,
      "status": "available",
      "createdBy": "emma_citizen",
      "emmaSearchQuery": "voice AI dashboard",
      "emmaValidatedJobsCount": 5
    },
    {
      "id": "mission-proposal-ai-analytics-2025-11-06",
      "title": "Apply to all jobs from Emma search 'AI analytics' (3 jobs)",
      "type": "proposal",
      "points": 1,
      "status": "completed",
      "completedBy": "member_a",
      "completedAt": "2025-11-06T14:23:00Z"
    }
  ]
}
```

**Note:** Missions are auto-created by Emma when she completes job searches. First to complete wins (mission becomes unavailable).

---

#### `POST /api/compensation/missions/{missionId}/complete`
**Mark mission complete (called by Emma when she says "mission complete" in chat)**

**Request:**
```json
{
  "memberId": "member_a",
  "emmaChatSessionId": "chat-session-uuid-12345"
}
```

**Response:**
```json
{
  "missionId": "mission-proposal-voice-ai-2025-11-07",
  "status": "completed",
  "completedBy": "member_a",
  "completedAt": "2025-11-07T14:23:00Z",
  "points": 1,
  "totalPoints": 3,
  "paymentTiming": "At next job completion"
}
```

**Error cases:**
- Mission already completed: `409 Conflict - Mission already completed by member_b`
- Mission not found: `404 Not Found`

**Note:** Emma validates completion based on chat session where search completed and proposals formulated. No manual proof upload required. Trust member + spot check.

---

### Earnings

#### `GET /api/compensation/earnings/{memberId}`
**Get member's complete earnings breakdown**

**Response:**
```json
{
  "memberId": "member_a",
  "totalPotentialEarnings": 164.00,
  "totalPaidEarnings": 450.00,

  "activeJobs": [
    {
      "jobId": "job-therapykin-chatbot",
      "title": "Build AI Chatbot - TherapyKin",
      "yourInteractions": 20,
      "teamTotal": 50,
      "potentialEarning": 90.00,
      "status": "active"
    }
  ],

  "completedMissions": [
    {
      "missionId": "mission-proposal-ai-analytics",
      "title": "Write proposal for AI Analytics",
      "payment": 1.00,
      "status": "pending"
    }
  ],

  "paidHistory": [
    {
      "jobId": "job-voice-ai-jobcorp",
      "title": "Voice AI App - JobCorp",
      "interactions": 15,
      "earning": 120.00,
      "paidAt": "2025-11-01T10:00:00Z"
    }
  ]
}
```

---

### Payments

#### `POST /api/compensation/payments/trigger`
**Trigger payment for completed job (NLR only)**

**Request:**
```json
{
  "jobId": "job-therapykin-chatbot-2025-11",
  "triggeredBy": "nlr",
  "cashReceived": true
}
```

**Response:**
```json
{
  "jobId": "job-therapykin-chatbot-2025-11",
  "status": "paid",
  "totalPaid": 450.00,
  "memberPayments": {
    "member_a": {
      "interactions": 30,
      "earning": 270.00
    },
    "member_b": {
      "interactions": 20,
      "earning": 180.00
    }
  },
  "notificationsSent": 2
}
```

**Error cases:**
- Not NLR role: `403 Forbidden`
- Cash not received: `400 Bad Request - Cannot pay before receiving funds`
- Members without wallets: `400 Bad Request - Cannot pay. These members need to connect wallet: [list]`

---

### Team Leaderboard

#### `GET /api/compensation/team/leaderboard`
**Get team-wide potential earnings leaderboard (wallet connection required)**

**Query params:**
- `memberId` (required): Requesting member's ID (for wallet gate check)

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "memberId": "member_a",
      "name": "Alice",
      "potentialEarnings": 450.00,
      "walletAddress": "9xQe...rGtX"
    },
    {
      "rank": 2,
      "memberId": "member_b",
      "name": "Bob",
      "potentialEarnings": 320.00,
      "walletAddress": "8yPd...sWuY"
    }
  ]
}
```

**Error cases:**
- Wallet not connected: `403 Forbidden - Connect your Solana wallet to view team leaderboard`
- Wallet not verified: `403 Forbidden - Verify your wallet signature to view team leaderboard`

**Privacy notes:**
- Only shows potential earnings (NOT paid amounts)
- Only includes members with verified wallets
- No per-job breakdown (aggregate only)
- Wallet addresses truncated for display

---

#### `GET /api/compensation/team/wallet-status/{memberId}`
**Check if member has wallet connected (for UI state)**

**Response:**
```json
{
  "memberId": "member_a",
  "walletConnected": true,
  "walletAddress": "9xQe...rGtX",
  "walletVerified": true,
  "walletVerifiedAt": "2025-11-07T10:00:00Z"
}
```

---

### Real-Time Updates (WebSocket)

#### `WebSocket /api/compensation/ws/{memberId}`
**WebSocket connection for personal earnings updates (Week 1 scope)**

**Connection:**
```javascript
// Frontend: Establish WebSocket connection
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${protocol}//${window.location.host}/api/compensation/ws/${memberId}`;
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log('WebSocket connected');
  // Server sends: {"event":"connected","memberId":"...","timestamp":"..."}
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.event) {
    case 'connected':
      console.log('Connected as:', data.memberId);
      break;

    case 'interaction_counted':
      // Update job card interaction count + potential earning
      updateJobCard(data.jobId, {
        yourInteractions: data.yourInteractions,
        teamTotal: data.teamTotal,
        yourPotentialEarning: data.yourPotentialEarning
      });
      break;

    case 'mission_completed':
      // Update total points + potential earnings
      updateMissionPoints(data.points, data.totalPoints);
      updateTotalEarnings(data.newTotal);
      break;

    case 'job_paid':
      // Move from potential to paid earnings
      moveToPaidHistory(data.jobId, data.yourEarning);
      // Also moves mission earnings to paid
      if (data.missionEarning) {
        moveMissionToPaid(data.missionEarning);
      }
      break;
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket disconnected');
  // Attempt reconnect after 5 seconds
  setTimeout(() => reconnect(), 5000);
};
```

**Event Types (Personal Only - Week 1):**

| Event | Trigger | Payload | Purpose |
|-------|---------|---------|---------|
| `connected` | WebSocket established | `{event, memberId, timestamp}` | Confirm connection |
| `interaction_counted` | Member sends message | `{event, jobId, yourInteractions, teamTotal, yourPotentialEarning}` | Live interaction count update |
| `mission_completed` | Emma validates completion | `{event, missionId, points, totalPoints, newTotal}` | Update points + earnings |
| `job_paid` | NLR triggers payment | `{event, jobId, yourEarning, missionEarning, totalPaid}` | Move job + mission earnings to paid history |

**Backend Implementation:**
```python
# services/websocket_manager.py
from fastapi import WebSocket
from typing import Dict, Set
import asyncio

# Active WebSocket connections: {member_id: Set[WebSocket]}
active_connections: Dict[str, Set[WebSocket]] = {}

async def connect_member(websocket: WebSocket, member_id: str):
    """Accept WebSocket connection and add to active connections."""
    await websocket.accept()

    if member_id not in active_connections:
        active_connections[member_id] = set()

    active_connections[member_id].add(websocket)

    await websocket.send_json({
        "event": "connected",
        "memberId": member_id,
        "timestamp": datetime.utcnow().isoformat()
    })

def broadcast_to_member(member_id: str, data: dict):
    """Broadcast message to specific member's WebSocket connections."""
    asyncio.create_task(async_broadcast_to_member(member_id, data))

async def async_broadcast_to_member(member_id: str, data: dict):
    """Async broadcast to member's connections."""
    if member_id not in active_connections:
        return

    dead_connections = set()

    for connection in active_connections[member_id]:
        try:
            await connection.send_json(data)
        except Exception:
            dead_connections.add(connection)

    # Clean up dead connections
    active_connections[member_id] -= dead_connections
```

**Keepalive (Ping/Pong):**
```javascript
// Frontend: Send ping every 30 seconds to keep connection alive
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);

// Backend handles ping automatically (FastAPI WebSocket)
```

---

## Business Logic

### Interaction Counting Logic

**File:** `services/interaction_tracker.py`

```python
from services.graph import query_graph
from datetime import datetime, timedelta
import hashlib

def track_interaction(
    job_id: str,
    member_id: str,
    message: str,
    ai_recipient: str
) -> dict:
    """Track new interaction and update earnings."""

    # 1. Check for duplicate (same message within 1 second)
    content_hash = hashlib.sha256(message.encode()).hexdigest()
    recent_duplicate = check_duplicate(member_id, content_hash, seconds=1)

    if recent_duplicate:
        raise ValueError("Duplicate message detected")

    # 2. Create U4_Event node
    event_slug = f"chat-msg-{uuid.uuid4()}"
    cypher_create_event = """
    CREATE (e:U4_Event {
      slug: $slug,
      name: $name,
      event_kind: 'message',
      level: 'L2',
      scope_ref: 'scopelock',
      actor_ref: $actor_ref,
      timestamp: datetime($timestamp),
      content: $content,
      ai_recipient: $ai_recipient,
      content_hash: $content_hash,
      job_slug: $job_slug,
      // ... universal attributes
    })
    RETURN e
    """

    query_graph(cypher_create_event, {
        "slug": event_slug,
        "name": f"{member_id}: {message[:50]}...",
        "actor_ref": member_id,
        "timestamp": datetime.utcnow().isoformat(),
        "content": message,
        "ai_recipient": ai_recipient,
        "content_hash": content_hash,
        "job_slug": job_id
    })

    # 3. Link event to job
    cypher_link = """
    MATCH (e:U4_Event {slug: $event_slug})
    MATCH (job:U4_Work_Item {slug: $job_slug})
    CREATE (e)-[:U4_ABOUT]->(job)
    """
    query_graph(cypher_link, {"event_slug": event_slug, "job_slug": job_id})

    # 4. Update job interaction counts
    cypher_update_job = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    SET job.interactionCounts[$member_id] =
        coalesce(job.interactionCounts[$member_id], 0) + 1,
        job.totalInteractions = job.totalInteractions + 1,
        job.updated_at = datetime()
    RETURN job
    """
    updated_job = query_graph(cypher_update_job, {
        "job_slug": job_id,
        "member_id": member_id
    })

    # 5. Recalculate earnings for all members
    new_earnings = calculate_all_member_earnings(job_id)

    # 6. Broadcast update via WebSocket (personal earnings only)
    from services.websocket_manager import broadcast_to_member
    broadcast_to_member(member_id, {
        "event": "interaction_counted",
        "jobId": job_id,
        "yourInteractions": updated_job[0]["job"]["interactionCounts"][member_id],
        "teamTotal": updated_job[0]["job"]["totalInteractions"],
        "yourPotentialEarning": new_earnings[member_id]
    })

    return {
        "interactionCounted": True,
        "newInteractionCount": updated_job[0]["job"]["interactionCounts"][member_id],
        "teamTotal": updated_job[0]["job"]["totalInteractions"],
        "newPotentialEarning": new_earnings[member_id],
        "eventId": event_slug
    }
```

---

### Earnings Calculation Logic

**File:** `services/earnings_calculator.py`

```python
def calculate_member_earning(job_id: str, member_id: str) -> float:
    """Calculate member's potential earning for a job."""

    # Get job data
    cypher = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    RETURN job.teamPool AS pool,
           job.interactionCounts AS counts,
           job.totalInteractions AS total
    """
    result = query_graph(cypher, {"job_slug": job_id})

    if not result:
        return 0.0

    data = result[0]
    team_pool = data["pool"]
    member_interactions = data["counts"].get(member_id, 0)
    total_interactions = data["total"]

    if total_interactions == 0:
        return 0.0

    # Formula: (member_interactions / total_interactions) × team_pool
    earning = (member_interactions / total_interactions) * team_pool

    # Round to 2 decimals
    return round(earning, 2)


def calculate_all_member_earnings(job_id: str) -> dict:
    """Calculate earnings for all members who contributed to job."""

    cypher = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    RETURN job.interactionCounts AS counts
    """
    result = query_graph(cypher, {"job_slug": job_id})

    counts = result[0]["counts"]
    earnings = {}

    for member_id in counts.keys():
        earnings[member_id] = calculate_member_earning(job_id, member_id)

    return earnings
```

---

### Mission Claiming Logic

**File:** `services/mission_manager.py`

```python
from datetime import datetime, timedelta

def claim_mission(mission_id: str, member_id: str) -> dict:
    """Claim a mission (with validation)."""

    # 1. Check member has minimum 5 total interactions
    total_interactions = get_member_total_interactions(member_id)
    if total_interactions < 5:
        raise ValueError(f"Need 5+ interactions to claim missions. Currently: {total_interactions}")

    # 2. Check mission is available
    cypher_check = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, work_type: 'mission'})
    RETURN mission.status AS status
    """
    result = query_graph(cypher_check, {"mission_slug": mission_id})

    if result[0]["status"] != "available":
        raise ValueError("Mission not available")

    # 3. Calculate tier-based payment dynamically
    from services.compensation.tier_calculator import (
        get_current_tier,
        get_mission_payment,
        get_mission_fund_balance
    )

    # Get mission type
    cypher_type = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    RETURN mission.missionType AS missionType
    """
    mission_type_result = query_graph(cypher_type, {"mission_slug": mission_id})
    mission_type = mission_type_result[0]["missionType"]

    # Calculate payment based on current tier
    tier, fund_balance = get_current_tier()
    mission_payment = get_mission_payment(mission_type)

    # Verify fund sufficient
    if fund_balance < mission_payment:
        raise ValueError(f"Mission fund insufficient (${fund_balance} available, need ${mission_payment})")

    # 4. Update mission status + store payment and tier (locked at claim time)
    expires_at = datetime.utcnow() + timedelta(hours=24)

    cypher_claim = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    SET mission.status = 'claimed',
        mission.claimedBy = $member_id,
        mission.claimedAt = datetime($claimed_at),
        mission.claimExpiresAt = datetime($expires_at),
        mission.fixedPayment = $payment,
        mission.claimTier = $tier,
        mission.updated_at = datetime()
    RETURN mission
    """

    query_graph(cypher_claim, {
        "mission_slug": mission_id,
        "member_id": member_id,
        "claimed_at": datetime.utcnow().isoformat(),
        "expires_at": expires_at.isoformat(),
        "payment": float(mission_payment),
        "tier": tier
    })

    # 5. Create link
    cypher_link = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    MATCH (agent:U4_Agent {slug: $member_id})
    CREATE (mission)-[:U4_CLAIMED_BY {
      claimed_at: datetime(),
      expires_at: datetime($expires_at)
    }]->(agent)
    """
    query_graph(cypher_link, {
        "mission_slug": mission_id,
        "member_id": member_id,
        "expires_at": expires_at.isoformat()
    })

    return {
        "missionId": mission_id,
        "status": "claimed",
        "claimedBy": member_id,
        "expiresAt": expires_at.isoformat()
    }
```

---

### Payment Trigger Logic

**File:** `services/payment_processor.py`

```python
def trigger_payment(job_id: str, triggered_by: str, cash_received: bool) -> dict:
    """Trigger payment for completed job (NLR only)."""

    # 1. Verify NLR role
    if not is_nlr(triggered_by):
        raise PermissionError("Only NLR can trigger payments")

    # 2. Verify cash received
    if not cash_received:
        raise ValueError("Cannot pay before receiving funds from Upwork")

    # 3. Get job data
    cypher_job = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    RETURN job.teamPool AS pool,
           job.interactionCounts AS counts,
           job.status AS status
    """
    result = query_graph(cypher_job, {"job_slug": job_id})
    job_data = result[0]

    if job_data["status"] == "paid":
        raise ValueError("Job already paid")

    # 4. Calculate final shares
    member_payments = {}
    for member_id, interactions in job_data["counts"].items():
        earning = calculate_member_earning(job_id, member_id)
        member_payments[member_id] = earning

    # 5. Update job status
    cypher_update = """
    MATCH (job:U4_Work_Item {slug: $job_slug})
    SET job.status = 'paid',
        job.paidAt = datetime(),
        job.updated_at = datetime()
    """
    query_graph(cypher_update, {"job_slug": job_id})

    # 6. Update member paid histories
    for member_id, amount in member_payments.items():
        update_member_paid_earnings(member_id, job_id, amount)

    # 7. Send notifications
    notifications_sent = 0
    for member_id, amount in member_payments.items():
        send_payment_notification(member_id, job_id, amount)
        notifications_sent += 1

    return {
        "jobId": job_id,
        "status": "paid",
        "totalPaid": sum(member_payments.values()),
        "memberPayments": member_payments,
        "notificationsSent": notifications_sent
    }
```

---

## State Management (Frontend)

**Zustand Store:** `stores/compensationStore.ts`

```typescript
import create from 'zustand';

interface CompensationState {
  totalPotentialEarnings: number;
  jobs: Job[];
  missions: Mission[];
  updateEarnings: (newEarnings: number) => void;
  addInteraction: (jobId: string, memberId: string) => void;
}

export const useCompensationStore = create<CompensationState>((set) => ({
  totalPotentialEarnings: 0,
  jobs: [],
  missions: [],

  updateEarnings: (newEarnings) => set({ totalPotentialEarnings: newEarnings }),

  addInteraction: (jobId, memberId) => set((state) => ({
    jobs: state.jobs.map(job =>
      job.id === jobId
        ? {
            ...job,
            yourInteractions: job.yourInteractions + 1,
            teamTotal: job.teamTotal + 1,
            yourPotentialEarning: recalculate(job)
          }
        : job
    )
  }))
}));
```

---

## Deployment Architecture

**Frontend:** Vercel (automatic from main branch)
**Backend:** Render (Python web service)
**Database:** FalkorDB production (already deployed)

**Environment variables:**
```bash
# Backend (.env)
FALKORDB_API_URL=https://mindprotocol.onrender.com/admin/query
FALKORDB_API_KEY=Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU
GRAPH_NAME=scopelock
JWT_SECRET=<256-bit secret>
NLR_ROLE_SLUG=nlr

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://deck.scopelock.mindprotocol.ai/api
```

---

## Security

### Authorization Enforcement

**Job/Mission Creation:** Any authenticated team member
**Mission Claiming:** Requires 5+ total interactions
**Mission Approval:** NLR only
**Payment Trigger:** NLR only + 2FA confirmation

**Implementation:**
```python
from functools import wraps

def require_nlr(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        current_user = get_current_user()
        if current_user.slug != "nlr":
            raise PermissionError("NLR role required")
        return func(*args, **kwargs)
    return wrapper

@require_nlr
def trigger_payment(job_id, triggered_by, cash_received):
    ...
```

### Data Privacy

- Members see only their own detailed earnings
- Team totals visible (not individual breakdowns)
- NLR sees all earnings

---

## Related Documentation

- `/docs/missions/mission-deck/MECHANISM.md` - Original Mission Deck architecture
- `/docs/mission-compensation-system.md` - High-level compensation overview
- `/docs/missions/mission-deck-compensation/PATTERN.md` - Compensation principles

---

## Next: ALGORITHM.md

Rafael will use this MECHANISM document to understand:
- What nodes/links to create in FalkorDB
- What API endpoints to implement
- What business logic to code

Next document (ALGORITHM.md) will provide step-by-step implementation instructions.
