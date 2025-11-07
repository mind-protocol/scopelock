# ALGORITHM: Team Member Hunting (Telegram Outreach System)

**Version:** 1.0
**Created:** 2025-11-07
**Mission:** Step-by-step implementation guide for Telegram outreach system

---

## Implementation Phases

### Phase 1: Contact Ingestion (Day 1)

**Goal:** Load 313 contacts from `team_members.json` into FalkorDB

**Steps:**

#### 1.1 Create Ingestion Script

**File:** `backend/scripts/ingest_analysis_data.py`

```python
import json
import sys
from datetime import datetime
from services.falkordb_client import query_graph

def ingest_contacts(json_path: str, graph_name: str = "scopelock"):
    """Load contacts from analysis JSON into FalkorDB."""

    print(f"Loading contacts from {json_path}...")

    # 1. Load JSON file
    with open(json_path, 'r') as f:
        data = json.load(f)

    contacts = data.get("contacts", [])
    print(f"Found {len(contacts)} contacts")

    # 2. Count profiles
    profile_counts = {"supervisor": 0, "hustler": 0, "hybrid": 0}

    # 3. Create nodes
    for i, contact in enumerate(contacts):
        slug = f"contact-{contact['telegram_id']}"

        # Cypher query
        cypher = """
        CREATE (c:U4_Contact_Lead {
          slug: $slug,
          name: $name,
          telegram_id: $telegram_id,
          profile_type: $profile_type,
          supervisor_score: $supervisor_score,
          hustler_score: $hustler_score,
          outreach_status: 'pending',
          sent_at: null,
          replied_at: null,
          converted_at: null,

          analysis_data: $analysis_data,

          type_name: 'U4_Contact_Lead',
          level: 'L2',
          scope_ref: $scope_ref,
          visibility: 'partners',
          created_at: datetime(),
          updated_at: datetime(),
          valid_from: datetime(),
          valid_to: null
        })
        RETURN c.slug AS slug
        """

        # Execute
        result = query_graph(cypher, {
            "slug": slug,
            "name": contact["name"],
            "telegram_id": contact["telegram_id"],
            "profile_type": contact["profile_type"],
            "supervisor_score": contact["supervisor_score"],
            "hustler_score": contact["hustler_score"],
            "analysis_data": json.dumps(contact["analysis_data"]),
            "scope_ref": graph_name
        })

        profile_counts[contact["profile_type"]] += 1

        if (i + 1) % 50 == 0:
            print(f"  Loaded {i + 1}/{len(contacts)} contacts...")

    print(f"\n✅ Successfully loaded {len(contacts)} contacts:")
    print(f"   - Supervisors: {profile_counts['supervisor']}")
    print(f"   - Hustlers: {profile_counts['hustler']}")
    print(f"   - Hybrids: {profile_counts['hybrid']}")

    return len(contacts)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 ingest_analysis_data.py <json_path>")
        sys.exit(1)

    json_path = sys.argv[1]
    count = ingest_contacts(json_path)

    print(f"\n✅ Ingestion complete! {count} contacts ready for outreach.")
```

#### 1.2 Run Ingestion

```bash
cd backend
python3 scripts/ingest_analysis_data.py ../data/team_members.json
```

**Expected Output:**
```
Loading contacts from ../data/team_members.json...
Found 313 contacts
  Loaded 50/313 contacts...
  Loaded 100/313 contacts...
  Loaded 150/313 contacts...
  Loaded 200/313 contacts...
  Loaded 250/313 contacts...
  Loaded 300/313 contacts...

✅ Successfully loaded 313 contacts:
   - Supervisors: 150
   - Hustlers: 129
   - Hybrids: 34

✅ Ingestion complete! 313 contacts ready for outreach.
```

---

### Phase 2: Backend Services (Day 2-3)

#### 2.1 Maya Service (Message Generation)

**File:** `backend/services/outreach/maya_service.py`

```python
import subprocess
import json
from typing import Dict, List

class MayaMessageGenerator:
    """Generate personalized outreach messages using Claude Code."""

    def generate_message(
        self,
        name: str,
        profile_type: str,
        signals: List[str],
        matching_messages: List[dict]
    ) -> Dict:
        """Generate personalized Telegram message."""

        # 1. Build prompt
        prompt = self._build_prompt(name, profile_type, signals, matching_messages)

        # 2. Call Claude Code (subscription budget, not API)
        message_text = self._call_claude_code(prompt)

        # 3. Calculate confidence (based on personalization)
        confidence = self._calculate_confidence(message_text, signals, matching_messages)

        return {
            "text": message_text,
            "confidence": confidence,
            "context": {
                "profile_type": profile_type,
                "signals_used": signals[:2],
                "message_referenced": matching_messages[0]["text"][:50] if matching_messages else None
            }
        }

    def _build_prompt(
        self,
        name: str,
        profile_type: str,
        signals: List[str],
        matching_messages: List[dict]
    ) -> str:
        """Build Claude Code prompt for message generation."""

        # Profile-specific angle
        if profile_type == "supervisor":
            angle = "Focus on code review/mentorship angle. Mention Rafael (AI code generator)."
        elif profile_type == "hustler":
            angle = "Focus on business development/proposal writing. Mention Emma (AI proposal writer)."
        else:
            angle = "Focus on versatile contribution (code + biz dev)."

        # Recent activity
        activity = "\n".join([
            f"- {msg['text'][:100]}... ({msg['date']}, score: {msg['score']})"
            for msg in matching_messages[:3]
        ])

        prompt = f"""Generate a personalized Telegram outreach message for {name}.

Profile type: {profile_type}
{angle}

Signals: {', '.join(signals)}

Their recent Telegram activity:
{activity}

Requirements:
1. Reference their name
2. Reference specific signal or message (prove we read their profile, not spam)
3. Explain ScopeLock value prop relevant to their profile
4. Keep it 80-150 words
5. Casual, builder-grade tone (no "Dear Sir/Madam" corporate jargon)
6. End with clear CTA (call to action)

ScopeLock context:
- AI-human dev agency
- Interaction-based pay (not hourly)
- AI citizens: Rafael (code gen), Emma (proposals), Sofia (QA), Maya (specs)
- Build in public, own your impact

Generate the message:"""

        return prompt

    def _call_claude_code(self, prompt: str) -> str:
        """Call Claude Code via subprocess (subscription budget)."""

        # Write prompt to temp file
        with open('/tmp/maya_prompt.txt', 'w') as f:
            f.write(prompt)

        # Call claude CLI
        result = subprocess.run(
            ['claude', '-p', prompt, '--continue'],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode != 0:
            raise Exception(f"Claude Code error: {result.stderr}")

        return result.stdout.strip()

    def _calculate_confidence(
        self,
        message: str,
        signals: List[str],
        matching_messages: List[dict]
    ) -> float:
        """Calculate confidence score (0-1) based on personalization."""

        score = 0.5  # Base score

        # +0.2 if signal referenced
        for signal in signals[:2]:
            if signal.replace('_', ' ') in message.lower():
                score += 0.2
                break

        # +0.2 if matching message referenced
        if matching_messages:
            msg_keywords = matching_messages[0]["text"][:30].lower().split()
            if any(kw in message.lower() for kw in msg_keywords):
                score += 0.2

        # +0.1 if name referenced
        if any(msg.get("name", "") in message for msg in matching_messages):
            score += 0.1

        return min(score, 1.0)
```

#### 2.2 Outreach Tracker (Send + Status Management)

**File:** `backend/services/outreach/outreach_tracker.py`

```python
import uuid
from datetime import datetime
from services.falkordb_client import query_graph

class OutreachTracker:
    """Track outreach sends and status transitions."""

    def mark_as_sent(
        self,
        contact_id: str,
        message: str,
        sent_by: str
    ) -> Dict:
        """Mark message as sent (after human manually sent via Telegram)."""

        # 1. Get contact
        contact = self._get_contact(contact_id)

        # 2. Check if already sent
        if contact["outreach_status"] != "pending":
            raise DuplicateSendError(f"Already sent to {contact['name']}")

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
          was_edited: false,

          type_name: 'U4_Outreach_Message',
          level: 'L2',
          scope_ref: 'scopelock',
          visibility: 'partners',
          created_at: datetime(),
          updated_at: datetime(),
          valid_from: datetime(),
          valid_to: null
        })
        RETURN m.slug AS slug
        """

        query_graph(cypher_create, {
            "slug": message_slug,
            "name": f"Outreach to {contact['name']}",
            "message_text": message,
            "sent_by": sent_by
        })

        # 4. Link to contact
        cypher_link = """
        MATCH (c:U4_Contact_Lead {slug: $contact_id})
        MATCH (m:U4_Outreach_Message {slug: $message_slug})
        CREATE (c)-[:U4_RECEIVED {
          received_at: datetime(),
          channel: 'telegram'
        }]->(m)
        """

        query_graph(cypher_link, {
            "contact_id": contact_id,
            "message_slug": message_slug
        })

        # 5. Update contact status
        self._update_status(contact_id, "sent", sent_at=datetime.now())

        return {
            "success": True,
            "outreach_message_id": message_slug,
            "contact_status": "sent"
        }

    def _update_status(
        self,
        contact_id: str,
        new_status: str,
        **kwargs
    ):
        """Update contact outreach_status and timestamp fields."""

        # Build SET clause
        set_fields = [f"c.outreach_status = '{new_status}'", "c.updated_at = datetime()"]

        if "sent_at" in kwargs:
            set_fields.append("c.sent_at = datetime()")
        if "replied_at" in kwargs:
            set_fields.append("c.replied_at = datetime()")
        if "converted_at" in kwargs:
            set_fields.append("c.converted_at = datetime()")

        cypher = f"""
        MATCH (c:U4_Contact_Lead {{slug: $contact_id}})
        SET {', '.join(set_fields)}
        RETURN c
        """

        query_graph(cypher, {"contact_id": contact_id})

        # Create status change event (for audit trail)
        self._create_status_event(contact_id, new_status)

    def _create_status_event(self, contact_id: str, new_status: str):
        """Create U4_Event for status change (audit trail)."""

        event_slug = f"status-change-{uuid.uuid4()}"

        cypher = """
        CREATE (e:U4_Event {
          slug: $slug,
          event_kind: 'status_changed',
          from_status: null,
          to_status: $to_status,
          changed_at: datetime(),
          changed_by: 'system',

          type_name: 'U4_Event',
          level: 'L2',
          scope_ref: 'scopelock'
        })

        WITH e
        MATCH (c:U4_Contact_Lead {slug: $contact_id})
        CREATE (c)-[:U4_STATUS_CHANGED]->(e)
        """

        query_graph(cypher, {
            "slug": event_slug,
            "to_status": new_status,
            "contact_id": contact_id
        })
```

#### 2.3 Telegram Reader (Background Worker)

**File:** `backend/services/outreach/telegram_reader.py`

```python
import asyncio
import os
from datetime import datetime
from telethon import TelegramClient
from telethon.sessions import StringSession
from cryptography.fernet import Fernet
from services.falkordb_client import query_graph

class TelegramMonitoringWorker:
    """Background worker to monitor Telegram conversations for replies."""

    def __init__(self):
        self.client = None
        self.is_running = False
        self.poll_interval = 60  # Check every 60 seconds
        self.last_check = None

    async def start(self):
        """Start monitoring worker."""

        print("Starting Telegram monitoring worker...")

        # 1. Load encrypted session from FalkorDB
        session_data = self._load_session()
        if not session_data:
            raise Exception("No Telegram session found. Connect via /api/outreach/connect-telegram first.")

        # 2. Decrypt session
        decrypted_session = self._decrypt_session(session_data["telegram_session_data"])

        # 3. Create Telethon client (read-only)
        api_id = os.getenv('TELEGRAM_API_ID')
        api_hash = os.getenv('TELEGRAM_API_HASH')

        self.client = TelegramClient(
            StringSession(decrypted_session),
            api_id,
            api_hash
        )

        await self.client.connect()

        if not await self.client.is_user_authorized():
            raise Exception("Telegram session expired. Re-authenticate required.")

        print("✅ Telegram client connected")

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

        # 1. Get all contacts with status 'sent' or 'replied'
        contacts = query_graph("""
            MATCH (c:U4_Contact_Lead)
            WHERE c.outreach_status IN ['sent', 'replied']
            AND c.scope_ref = 'scopelock'
            RETURN c.telegram_id AS telegram_id, c.slug AS contact_id, c.name AS name
        """, {})

        print(f"Checking {len(contacts)} conversations...")

        # 2. For each contact, get recent messages
        for contact in contacts:
            try:
                messages = await self.client.get_messages(
                    int(contact["telegram_id"]),
                    limit=5  # Last 5 messages
                )

                # 3. Check for new replies (from contact, not from us)
                for msg in messages:
                    if msg.from_id.user_id == int(contact["telegram_id"]):
                        # This is from the contact (not us)

                        # Check if already in DB
                        existing = query_graph("""
                            MATCH (r:U4_Telegram_Reply {telegram_message_id: $msg_id})
                            RETURN count(r) AS count
                        """, {"msg_id": msg.id})

                        if existing[0]["count"] == 0:
                            # New reply! Create event
                            print(f"  📩 New reply from {contact['name']}: {msg.text[:50]}...")
                            await self._create_reply_event(contact, msg)

            except Exception as e:
                print(f"  ⚠️  Error checking {contact['name']}: {e}")
                continue

    async def _create_reply_event(self, contact: dict, msg):
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
          visibility: 'partners',
          created_at: datetime(),
          updated_at: datetime()
        })
        RETURN r.slug AS slug
        """

        query_graph(cypher_create, {
            "slug": reply_slug,
            "name": f"Reply from {contact['name']}",
            "msg_id": msg.id,
            "text": msg.text or "",
            "sender_id": contact["telegram_id"],
            "sender_name": contact["name"],
            "sent_at": msg.date.isoformat()
        })

        # 2. Link to contact
        cypher_link = """
        MATCH (c:U4_Contact_Lead {slug: $contact_id})
        MATCH (r:U4_Telegram_Reply {slug: $reply_slug})
        CREATE (c)-[:U4_REPLIED_VIA {
          replied_at: $sent_at,
          channel: 'telegram'
        }]->(r)
        """

        query_graph(cypher_link, {
            "contact_id": contact["contact_id"],
            "reply_slug": reply_slug,
            "sent_at": msg.date.isoformat()
        })

        # 3. Update contact status to 'replied'
        cypher_update = """
        MATCH (c:U4_Contact_Lead {slug: $contact_id})
        SET c.outreach_status = 'replied',
            c.replied_at = datetime(),
            c.updated_at = datetime()
        """

        query_graph(cypher_update, {"contact_id": contact["contact_id"]})

        print(f"  ✅ Created reply event: {reply_slug}")

    def _load_session(self) -> dict:
        """Load encrypted session from FalkorDB."""

        result = query_graph("""
            MATCH (conv:U4_Telegram_Conversation)
            WHERE conv.scope_ref = 'scopelock'
            RETURN conv.telegram_session_data AS telegram_session_data
            LIMIT 1
        """, {})

        if not result:
            return None

        return result[0]

    def _decrypt_session(self, encrypted_session: str) -> str:
        """Decrypt Telethon session using Fernet."""

        encryption_key = os.getenv('TELEGRAM_SESSION_KEY').encode()
        f = Fernet(encryption_key)
        return f.decrypt(encrypted_session.encode()).decode()

    async def _handle_error(self, error: Exception):
        """Fail-loud error handling."""

        from telethon.errors import AuthKeyError, NetworkError

        if isinstance(error, AuthKeyError):
            # Session expired - CRITICAL
            print("🚨 CRITICAL: Telegram session expired!")
            # Emit failure event
            # Stop worker
            self.is_running = False

        elif isinstance(error, NetworkError):
            # Temporary network issue - LOG but continue
            print(f"⚠️  Network error: {error}")
            # Will retry on next loop

        else:
            # Unknown error - LOG
            print(f"❌ Unknown error: {error}")
```

---

### Phase 3: API Endpoints (Day 4)

**File:** `backend/api/outreach/routes.py`

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.outreach.maya_service import MayaMessageGenerator
from services.outreach.outreach_tracker import OutreachTracker
from services.falkordb_client import query_graph

router = APIRouter(prefix="/api/outreach", tags=["outreach"])

maya = MayaMessageGenerator()
tracker = OutreachTracker()

# Request models
class GenerateMessageRequest(BaseModel):
    contact_id: str

class MarkSentRequest(BaseModel):
    contact_id: str
    message: str
    sent_by: str

# --- Endpoints ---

@router.get("/queue")
async def get_outreach_queue(
    page: int = 1,
    limit: int = 20,
    profile_type: Optional[str] = None,
    status: Optional[str] = None,
    sort: str = "hustler_score_desc"
):
    """Fetch contact queue with filters and pagination."""

    # Build WHERE clauses
    where_clauses = ["c.scope_ref = 'scopelock'", "c.type_name = 'U4_Contact_Lead'"]

    if profile_type:
        where_clauses.append(f"c.profile_type = '{profile_type}'")
    if status:
        where_clauses.append(f"c.outreach_status = '{status}'")

    # Build ORDER BY
    order_by_map = {
        "hustler_score_desc": "c.hustler_score DESC",
        "supervisor_score_desc": "c.supervisor_score DESC",
        "name_asc": "c.name ASC"
    }
    order_by = order_by_map.get(sort, "c.hustler_score DESC")

    # Query contacts
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
    count_cypher = f"""
    MATCH (c:U4_Contact_Lead)
    WHERE {' AND '.join(where_clauses)}
    RETURN count(c) AS total
    """
    total = query_graph(count_cypher, {})[0]["total"]

    # Format contacts
    contacts = [_format_contact(r["c"]) for r in results]

    return {
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "limit": limit,
        "contacts": contacts
    }

@router.post("/generate-message/{contact_id}")
async def generate_message(contact_id: str):
    """Generate personalized message for contact."""

    # Get contact
    contact = _get_contact(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    # Generate message via Maya
    result = maya.generate_message(
        name=contact["name"],
        profile_type=contact["profile_type"],
        signals=contact["analysis_data"]["signals"],
        matching_messages=contact["analysis_data"]["matching_messages"]
    )

    return result

@router.post("/mark-sent")
async def mark_sent(req: MarkSentRequest):
    """Mark message as sent after human manually sent via Telegram."""

    try:
        result = tracker.mark_as_sent(
            contact_id=req.contact_id,
            message=req.message,
            sent_by=req.sent_by
        )
        return result

    except DuplicateSendError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Helper functions
def _get_contact(contact_id: str) -> Optional[dict]:
    result = query_graph("""
        MATCH (c:U4_Contact_Lead {slug: $contact_id})
        RETURN c
    """, {"contact_id": contact_id})

    return result[0]["c"] if result else None

def _format_contact(node: dict) -> dict:
    return {
        "id": node["slug"],
        "telegram_id": node["telegram_id"],
        "name": node["name"],
        "profile_type": node["profile_type"],
        "supervisor_score": node["supervisor_score"],
        "hustler_score": node["hustler_score"],
        "signals": json.loads(node["analysis_data"])["signals"][:3],
        "outreach_status": node["outreach_status"],
        "sent_at": node.get("sent_at"),
        "replied_at": node.get("replied_at")
    }
```

---

### Phase 4: Frontend (Day 5-6)

#### 4.1 Zustand Store

**File:** `frontend/stores/outreachStore.ts`

```typescript
import { create } from 'zustand';

interface Contact {
  id: string;
  telegram_id: number;
  name: string;
  profile_type: 'supervisor' | 'hustler' | 'hybrid';
  supervisor_score: number;
  hustler_score: number;
  signals: string[];
  outreach_status: string;
}

interface OutreachState {
  contacts: Contact[];
  total: number;
  page: number;
  loading: boolean;

  fetchQueue: (page: number, filters?: any) => Promise<void>;
  generateMessage: (contactId: string) => Promise<string>;
  markSent: (contactId: string, message: string) => Promise<void>;
}

export const useOutreachStore = create<OutreachState>((set, get) => ({
  contacts: [],
  total: 0,
  page: 1,
  loading: false,

  fetchQueue: async (page = 1, filters = {}) => {
    set({ loading: true });

    const query = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      ...filters
    });

    const res = await fetch(`/api/outreach/queue?${query}`);
    const data = await res.json();

    set({
      contacts: data.contacts,
      total: data.total,
      page: data.page,
      loading: false
    });
  },

  generateMessage: async (contactId: string) => {
    const res = await fetch(`/api/outreach/generate-message/${contactId}`, {
      method: 'POST'
    });
    const data = await res.json();
    return data.message;
  },

  markSent: async (contactId: string, message: string) => {
    await fetch('/api/outreach/mark-sent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contact_id: contactId,
        message,
        sent_by: 'bigbosexf'
      })
    });

    // Refresh queue
    await get().fetchQueue(get().page);
  }
}));
```

#### 4.2 Contact Queue Component

**File:** `frontend/components/outreach/OutreachQueue.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useOutreachStore } from '@/stores/outreachStore';
import { ContactCard } from './ContactCard';

export function OutreachQueue() {
  const { contacts, total, page, loading, fetchQueue } = useOutreachStore();

  useEffect(() => {
    fetchQueue(1);
  }, []);

  return (
    <div className="outreach-queue">
      <h2>Outreach Queue ({total} contacts)</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Phase 5: Deployment (Day 7)

#### 5.1 Backend (Render)

**File:** `backend/render.yaml`

```yaml
services:
  - type: web
    name: scopelock-outreach-backend
    runtime: python
    plan: starter
    region: oregon
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: FALKORDB_API_URL
        value: https://mindprotocol.onrender.com/admin/query
      - key: FALKORDB_API_KEY
        sync: false
      - key: TELEGRAM_SESSION_KEY
        generateValue: true
      - key: TELEGRAM_API_ID
        sync: false
      - key: TELEGRAM_API_HASH
        sync: false
```

#### 5.2 Frontend (Vercel)

**File:** `frontend/vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://scopelock-outreach-backend.onrender.com/api"
  }
}
```

---

## Complete Implementation Checklist

- [ ] Phase 1: Contact ingestion (load 313 contacts)
- [ ] Phase 2: Backend services (Maya, Tracker, Reader)
- [ ] Phase 3: API endpoints (11 routes)
- [ ] Phase 4: Frontend (Queue, Generator, Notifications)
- [ ] Phase 5: Background worker (Telethon monitoring)
- [ ] Phase 6: Testing (pytest, Vitest, Playwright)
- [ ] Phase 7: Deployment (Render + Vercel)

**Timeline:** 7 days (1 week sprint)

**Next:** GUIDE.md (setup instructions, deployment steps, troubleshooting)
