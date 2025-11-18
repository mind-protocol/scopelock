# ALGORITHM: ScopeLock Mission Deck

**Mission:** Internal developer dashboard
**Purpose:** Step-by-step implementation guidance for Rafael to generate code
**Created:** 2025-11-05
**Updated:** 2025-11-06 (migrated to FalkorDB)

---

## Implementation Phases

**Phase 1 (Day 1):** Backend + FalkorDB Graph Client
**Phase 2 (Day 2):** Frontend Shell + Basic Tabs
**Phase 3 (Day 3):** Polish + Deploy + Testing

---

## Phase 1: Backend + FalkorDB Graph Client (Day 1)

### Step 1.1: Project Setup

```
1. Create backend directory structure:
   backend/
   ├── main.py                    # FastAPI app entry
   ├── schemas.py                 # Pydantic schemas (for API requests/responses)
   ├── auth.py                    # JWT auth functions
   ├── dependencies.py            # FastAPI dependencies
   ├── routers/
   │   ├── auth.py                # Auth endpoints
   │   ├── missions.py            # Mission endpoints
   │   ├── chat.py                # Chat endpoints
   │   └── dod.py                 # DoD endpoints
   ├── services/
   │   ├── graph.py               # FalkorDB REST API client
   │   └── rafael.py              # Rafael API integration
   └── requirements.txt

   # Note: No database/ or alembic/ - FalkorDB is schema-free

2. Initialize Python venv:
   - python -m venv venv
   - source venv/bin/activate

3. Create requirements.txt:
   fastapi==0.104.0
   uvicorn[standard]==0.24.0
   requests==2.31.0               # For FalkorDB REST API calls
   python-jose[cryptography]==3.3.0
   passlib[bcrypt]==1.7.4
   python-multipart==0.0.6
   anthropic==0.7.0
   python-dotenv==1.0.0

   # Removed: sqlalchemy, alembic, psycopg2-binary (no PostgreSQL)

4. Install dependencies:
   - pip install -r requirements.txt
```

---

### Step 1.2: FalkorDB REST API Client

**File:** `backend/services/graph.py`

```python
import os
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

FALKORDB_API_URL = os.getenv("FALKORDB_API_URL")
FALKORDB_API_KEY = os.getenv("FALKORDB_API_KEY")
GRAPH_NAME = os.getenv("GRAPH_NAME", "scopelock")

def query_graph(cypher: str, params: Optional[Dict[str, Any]] = None) -> List[Dict]:
    """
    Execute Cypher query on FalkorDB production graph.

    Args:
        cypher: Cypher query string (use $param for parameterized queries)
        params: Dict of parameters to substitute in query

    Returns:
        List of result dictionaries

    Raises:
        requests.HTTPError: If FalkorDB API returns error
    """
    response = requests.post(
        FALKORDB_API_URL,
        headers={"Authorization": f"Bearer {FALKORDB_API_KEY}"},
        json={
            "graph": GRAPH_NAME,
            "query": cypher,
            "params": params or {}
        },
        timeout=10
    )
    response.raise_for_status()
    return response.json().get("results", [])


def get_mission_by_slug(slug: str) -> Optional[Dict]:
    """Get mission node by slug."""
    cypher = """
    MATCH (m:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
    WHERE m.work_type = 'mission'
    RETURN m
    """
    results = query_graph(cypher, {"slug": slug})
    return results[0]["m"] if results else None


def get_user_missions(assignee_ref: str) -> List[Dict]:
    """Get all missions assigned to a developer."""
    cypher = """
    MATCH (m:U4_Work_Item {scope_ref: 'scopelock'})
    WHERE m.work_type = 'mission'
      AND m.assignee_ref = $assignee_ref
      AND m.state IN ['todo', 'doing']
    RETURN m
    ORDER BY m.due_date ASC
    """
    results = query_graph(cypher, {"assignee_ref": assignee_ref})
    return [r["m"] for r in results]


def get_mission_messages(mission_slug: str, limit: int = 50) -> List[Dict]:
    """Get chat messages for a mission."""
    cypher = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, scope_ref: 'scopelock'})
          <-[:U4_ABOUT]-(msg:U4_Event)
    WHERE msg.event_kind = 'message'
      AND msg.scope_ref = 'scopelock'
    RETURN msg
    ORDER BY msg.timestamp ASC
    LIMIT $limit
    """
    results = query_graph(cypher, {"mission_slug": mission_slug, "limit": limit})
    return [r["msg"] for r in results]


def get_mission_dod_items(mission_slug: str) -> List[Dict]:
    """Get DoD checklist items for a mission."""
    cypher = """
    MATCH (mission:U4_Work_Item {slug: $mission_slug, scope_ref: 'scopelock'})
          <-[:U4_MEMBER_OF {role: 'dod_task'}]-(task:U4_Work_Item)
    WHERE task.scope_ref = 'scopelock'
    RETURN task
    ORDER BY task.dod_category, task.dod_sort_order
    """
    results = query_graph(cypher, {"mission_slug": mission_slug})
    return [r["task"] for r in results]


def create_chat_message(
    mission_slug: str,
    role: str,
    content: str,
    actor_ref: str,
    code_blocks: Optional[List[Dict]] = None
) -> Dict:
    """
    Create a new chat message and link to mission.

    Returns:
        Created message node
    """
    import uuid
    from datetime import datetime

    msg_slug = f"chat-msg-{uuid.uuid4()}"

    # Create message node
    cypher_create = """
    CREATE (msg:U4_Event {
      name: $name,
      slug: $slug,
      event_kind: 'message',
      level: 'L2',
      scope_ref: 'scopelock',
      actor_ref: $actor_ref,
      timestamp: datetime($timestamp),
      status: 'active',
      role: $role,
      content: $content,
      code_blocks: $code_blocks,
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      description: $description,
      detailed_description: $detailed_description,
      type_name: 'U4_Event',
      visibility: 'partners',
      policy_ref: 'l4://law/scopelock-chat-policy',
      proof_uri: '',
      commitments: [],
      created_by: $created_by,
      substrate: 'organizational'
    })
    RETURN msg
    """

    results = query_graph(cypher_create, {
        "name": f"{actor_ref}: {content[:50]}...",
        "slug": msg_slug,
        "actor_ref": actor_ref,
        "timestamp": datetime.utcnow().isoformat(),
        "role": role,
        "content": content,
        "code_blocks": code_blocks or [],
        "description": f"Chat message from {actor_ref}",
        "detailed_description": content[:200],
        "created_by": actor_ref
    })

    # Link message to mission
    cypher_link = """
    MATCH (msg:U4_Event {slug: $msg_slug})
    MATCH (mission:U4_Work_Item {slug: $mission_slug})
    CREATE (msg)-[:U4_ABOUT {
      focus_type: 'primary_subject',
      created_at: datetime(),
      updated_at: datetime(),
      valid_from: datetime(),
      valid_to: null,
      confidence: 1.0,
      energy: 0.7,
      forming_mindstate: 'guidance',
      goal: 'Chat message about mission',
      visibility: 'partners',
      commitments: [],
      created_by: $created_by,
      substrate: 'organizational'
    }]->(mission)
    """

    query_graph(cypher_link, {
        "msg_slug": msg_slug,
        "mission_slug": mission_slug,
        "created_by": actor_ref
    })

    return results[0]["msg"] if results else None


def update_dod_task_state(task_slug: str, new_state: str) -> Dict:
    """Update DoD task state (todo/doing/done)."""
    from datetime import datetime

    cypher = """
    MATCH (task:U4_Work_Item {slug: $slug, scope_ref: 'scopelock'})
    SET task.state = $new_state,
        task.updated_at = datetime()
    RETURN task
    """

    results = query_graph(cypher, {
        "slug": task_slug,
        "new_state": new_state
    })

    return results[0]["task"] if results else None
```

---

### Step 1.4: Auth Implementation

**File:** `backend/auth.py`

```python
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": expire
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

---

### Step 1.5: Dependencies

**File:** `backend/dependencies.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from sqlalchemy.orm import Session
from database import get_db
from auth import decode_token
from models import User, Mission

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user

def get_user_mission(
    mission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Mission:
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    if mission.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return mission
```

---

### Step 1.6: Rafael Service

**File:** `backend/services/rafael.py`

```python
import os
import re
import anthropic

client = anthropic.Anthropic(api_key=os.environ["CLAUDE_API_KEY"])

def ask_rafael(user_message: str, mission_context: dict) -> tuple[str, list]:
    """
    Ask Rafael citizen (via Claude API) and return response + extracted code blocks.

    Returns:
        (response_text, code_blocks)
        code_blocks = [{"language": "python", "code": "...", "filename": "file.py"}]
    """
    system_prompt = f"""You are Rafael, a code generation citizen at ScopeLock.

Mission: {mission_context['title']}
Stack: {mission_context['stack_backend']}, {mission_context.get('stack_frontend') or 'backend-only'}
Database: {mission_context['stack_database']}

Help the developer with implementation questions. Provide complete code examples."""

    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )

        response_text = response.content[0].text
        code_blocks = extract_code_blocks(response_text)

        return response_text, code_blocks

    except Exception as e:
        print(f"Rafael API error: {e}")
        return "Sorry, I'm having trouble connecting right now. Please try again.", []

def extract_code_blocks(text: str) -> list:
    """Extract code blocks from markdown ```language\ncode``` format."""
    pattern = r"```(\w+)\n(.*?)```"
    matches = re.findall(pattern, text, re.DOTALL)

    return [
        {
            "language": lang,
            "code": code.strip(),
            "filename": f"code.{lang}"
        }
        for lang, code in matches
    ]
```

---

### Step 1.7: API Routes

**File:** `backend/routers/auth.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User
from auth import verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.id, user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name
        }
    }
```

**File:** `backend/routers/missions.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Mission
from dependencies import get_current_user, get_user_mission

router = APIRouter(prefix="/api/missions", tags=["missions"])

@router.get("")
def list_missions(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    missions = db.query(Mission).filter(Mission.assigned_to == current_user.id).all()
    return [
        {
            "id": m.id,
            "title": m.title,
            "client": m.client,
            "budget": m.budget,
            "deadline": m.deadline.isoformat(),
            "status": m.status,
            "created_at": m.created_at.isoformat()
        }
        for m in missions
    ]

@router.get("/{mission_id}")
def get_mission(mission: Mission = Depends(get_user_mission)):
    return {
        "id": mission.id,
        "title": mission.title,
        "client": mission.client,
        "budget": mission.budget,
        "deadline": mission.deadline.isoformat(),
        "status": mission.status,
        "stack": {
            "backend": mission.stack_backend,
            "frontend": mission.stack_frontend,
            "deploy_backend": mission.stack_deploy_backend,
            "deploy_frontend": mission.stack_deploy_frontend,
            "database": mission.stack_database
        },
        "notes": mission.notes,
        "created_at": mission.created_at.isoformat()
    }
```

**File:** `backend/routers/chat.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import ChatMessage
from dependencies import get_user_mission
from services.rafael import ask_rafael

router = APIRouter(prefix="/api/missions", tags=["chat"])

class SendMessageRequest(BaseModel):
    message: str

@router.post("/{mission_id}/chat")
def send_message(
    request: SendMessageRequest,
    mission = Depends(get_user_mission),
    db: Session = Depends(get_db)
):
    if not request.message or len(request.message) > 10000:
        raise HTTPException(status_code=400, detail="Invalid message length")

    # Save user message
    user_msg = ChatMessage(
        mission_id=mission.id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # Get Rafael response
    mission_context = {
        "title": mission.title,
        "stack_backend": mission.stack_backend,
        "stack_frontend": mission.stack_frontend,
        "stack_database": mission.stack_database
    }

    response_text, code_blocks = ask_rafael(request.message, mission_context)

    # Save assistant message
    assistant_msg = ChatMessage(
        mission_id=mission.id,
        role="assistant",
        content=response_text,
        code_blocks=code_blocks
    )
    db.add(assistant_msg)
    db.commit()

    return {
        "response": response_text,
        "code_blocks": code_blocks
    }

@router.get("/{mission_id}/messages")
def list_messages(
    mission = Depends(get_user_mission),
    db: Session = Depends(get_db),
    limit: int = 50
):
    messages = db.query(ChatMessage)\
        .filter(ChatMessage.mission_id == mission.id)\
        .order_by(ChatMessage.created_at.asc())\
        .limit(limit)\
        .all()

    return [
        {
            "id": str(m.id),
            "role": m.role,
            "content": m.content,
            "code_blocks": m.code_blocks,
            "created_at": m.created_at.isoformat()
        }
        for m in messages
    ]
```

**File:** `backend/routers/dod.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import DODItem
from dependencies import get_user_mission

router = APIRouter(prefix="/api/missions", tags=["dod"])

@router.get("/{mission_id}/dod")
def list_dod_items(
    mission = Depends(get_user_mission),
    db: Session = Depends(get_db)
):
    items = db.query(DODItem).filter(DODItem.mission_id == mission.id).all()
    return [
        {
            "id": str(item.id),
            "text": item.text,
            "category": item.category,
            "completed": item.completed,
            "completed_at": item.completed_at.isoformat() if item.completed_at else None
        }
        for item in items
    ]

class ToggleRequest(BaseModel):
    completed: bool

@router.patch("/{mission_id}/dod/{item_id}")
def toggle_dod_item(
    item_id: str,
    request: ToggleRequest,
    mission = Depends(get_user_mission),
    db: Session = Depends(get_db)
):
    item = db.query(DODItem).filter(DODItem.id == item_id).first()
    if not item or item.mission_id != mission.id:
        raise HTTPException(status_code=404, detail="Item not found")

    item.completed = request.completed
    item.completed_at = datetime.utcnow() if request.completed else None
    db.commit()

    return {
        "id": str(item.id),
        "completed": item.completed,
        "completed_at": item.completed_at.isoformat() if item.completed_at else None
    }
```

---

### Step 1.8: Main App

**File:** `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routers import auth, missions, chat, dod

load_dotenv()

app = FastAPI(title="ScopeLock Mission Deck API")

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(auth.router)
app.include_router(missions.router)
app.include_router(chat.router)
app.include_router(dod.router)
```

---

### Step 1.9: Graph Schema Setup

**Note:** FalkorDB is schema-free. No migrations needed.

**Verification:**
```python
# Test FalkorDB connection
from services.graph import query_graph

# Simple query to verify connection
results = query_graph("MATCH (n {scope_ref: 'scopelock'}) RETURN count(n) AS node_count")
print(f"Connected! Found {results[0]['node_count']} scopelock nodes.")
```

**Initial Data (Optional):**
If testing locally, you can create test mission nodes manually or via the ingestion tool.
See: `/home/mind-protocol/mind-protocol/tools/ingestion/falkordb_ingestor_rest.py`

---

## Phase 2: Frontend Shell (Day 2)

### Step 2.1: Next.js Setup

```bash
1. Create frontend directory:
   npx create-next-app@latest frontend --typescript --tailwind --app --no-src

2. Install dependencies:
   cd frontend
   npm install @tanstack/react-query axios zustand react-syntax-highlighter

3. Directory structure:
   frontend/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx                  # Login page
   │   └── console/
   │       ├── layout.tsx            # Console shell (left panel + tabs)
   │       └── missions/
   │           └── [id]/page.tsx     # Mission detail view
   ├── components/
   │   ├── MissionSelector.tsx
   │   ├── ChatTab.tsx
   │   ├── DODTab.tsx
   │   └── ContextTab.tsx
   ├── lib/
   │   ├── api.ts                    # API client
   │   └── auth.ts                   # Auth helpers
   └── types/
       └── index.ts                  # TypeScript types
```

---

### Step 2.2: API Client

**File:** `frontend/lib/api.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
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
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Missions
  listMissions: () => apiCall<Mission[]>('/api/missions'),
  getMission: (id: string) => apiCall<Mission>(`/api/missions/${id}`),

  // Chat
  sendMessage: (missionId: string, message: string) =>
    apiCall(`/api/missions/${missionId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  getMessages: (missionId: string) =>
    apiCall<ChatMessage[]>(`/api/missions/${missionId}/messages`),

  // DoD
  getDODItems: (missionId: string) =>
    apiCall<DODItem[]>(`/api/missions/${missionId}/dod`),
  toggleDODItem: (missionId: string, itemId: string, completed: boolean) =>
    apiCall(`/api/missions/${missionId}/dod/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
};
```

---

### Step 2.3: Components

**File:** `frontend/components/MissionSelector.tsx`

```typescript
'use client';

export function MissionSelector({
  missions,
  activeMissionId,
  onSelect,
}: {
  missions: Mission[];
  activeMissionId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-[200px] bg-[#0E1116] border-r border-[#2A3139] h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-[#E6EAF2] font-semibold mb-4">Missions</h2>
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`p-3 rounded cursor-pointer mb-2 ${
              mission.id === activeMissionId
                ? 'bg-[#151A21]'
                : 'hover:bg-[#1A2028]'
            }`}
            onClick={() => onSelect(mission.id)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${
                mission.status === 'active' ? 'bg-[#5CE27E]' :
                mission.status === 'qa' ? 'bg-[#64A8FF]' :
                'bg-[#9AA3AE]'
              }`} />
              <span className="text-[#E6EAF2] text-sm">#{mission.id}</span>
            </div>
            <div className="text-[#E6EAF2] font-medium text-sm mb-1">
              {mission.title}
            </div>
            <div className="text-[#9AA3AE] text-xs">
              ${mission.budget} · {new Date(mission.deadline).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

(Continue with ChatTab, DODTab, ContextTab in similar pattern...)

---

## Phase 3: Polish + Deploy (Day 3)

### Step 3.1: Testing

```bash
1. Backend tests:
   cd backend
   pytest tests/ -v

2. Frontend build test:
   cd frontend
   npm run build

3. Manual E2E test (see VALIDATION.md)
```

---

### Step 3.2: Deploy Backend

```bash
1. Push to GitHub
2. Create Render Web Service:
   - Connect GitHub repo
   - Build command: pip install -r requirements.txt
   - Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
   - Environment variables: DATABASE_URL, JWT_SECRET, CLAUDE_API_KEY
3. Run migrations on Render:
   - alembic upgrade head
```

---

### Step 3.3: Deploy Frontend

```bash
1. Push to GitHub
2. Import project to Vercel:
   - Framework: Next.js
   - Build command: npm run build
   - Environment variable: NEXT_PUBLIC_API_URL (Render backend URL)
3. Deploy
4. Configure custom domain: scopelock.mindprotocol.ai/deck
```

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
