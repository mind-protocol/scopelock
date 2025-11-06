# Mission Deck Architecture - Citizen Workspaces

**Created:** 2025-11-05
**Version:** 1.0 (Week 1 MVP)
**Architect:** Rafael

---

## Overview

Mission Deck transforms from a simple chat interface into **context-aware citizen workspaces**, where each AI citizen provides specialized tools for their role.

**Key Change:**
- **Before:** Simple tabs (Chat, DoD, Context)
- **After:** 5 citizen workspaces (Emma, Inna, Rafael, Sofia, Maya), each with unique UI

**Week 1 MVP Scope:**
- ✅ Rafael workspace (code editor + terminal + file tree + chat)
- ✅ Sofia workspace (DoD checklist + test results + chat)
- ✅ Citizen selector (horizontal workflow tabs)

**Week 2:**
- Emma workspace (Upwork job feed)
- Inna workspace (doc editor)
- Maya workspace (client messages)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                        │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐ │
│  │              │  │  Citizen Workspace Router                │ │
│  │   Mission    │  │  ┌────────────────────────────────────┐ │ │
│  │   Selector   │  │  │  if (active === 'rafael')          │ │ │
│  │   (Left)     │  │  │    → RafaelWorkspace               │ │ │
│  │              │  │  │  if (active === 'sofia')           │ │ │
│  │  • Mission 1 │  │  │    → SofiaWorkspace                │ │ │
│  │  • Mission 2 │  │  │  if (active === 'emma')  (Week 2) │ │ │
│  │  • Mission 3 │  │  │    → EmmaWorkspace                 │ │ │
│  │              │  │  └────────────────────────────────────┘ │ │
│  └──────────────┘  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               ↕ REST API + WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Mission    │  │   Chat       │  │   Terminal         │   │
│  │   API        │  │   API        │  │   WebSocket        │   │
│  │              │  │              │  │                    │   │
│  │ GET /missions│  │ POST /chat   │  │ WS /terminal       │   │
│  │ GET /mission │  │ GET /messages│  │ → Execute command  │   │
│  │ PATCH /dod   │  │              │  │ → Stream output    │   │
│  └──────────────┘  └──────────────┘  └────────────────────────┘   │
│                         ↕                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                          │   │
│  │  • missions                                               │   │
│  │  • dod_items                                              │   │
│  │  • chat_messages (per citizen per mission)                │   │
│  │  • files (code files per mission)                         │   │
│  │  • terminal_sessions                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture (Frontend)

### File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout with auth
│   │   ├── page.tsx                        # Landing/login page
│   │   └── deck/
│   │       ├── layout.tsx                  # Deck layout (mission selector + workspace)
│   │       ├── page.tsx                    # Main deck page
│   │       └── [missionId]/
│   │           └── page.tsx                # Mission detail page (citizen workspaces)
│   │
│   ├── components/
│   │   ├── MissionSelector.tsx             # Left panel: mission list
│   │   ├── CitizenSelector.tsx             # Horizontal tabs: Emma → Inna → Rafael → Sofia → Maya
│   │   │
│   │   ├── workspaces/                     # Citizen workspace components
│   │   │   ├── RafaelWorkspace.tsx         # Week 1 MVP
│   │   │   │   ├── FileTree.tsx
│   │   │   │   ├── CodeEditor.tsx          # Monaco Editor wrapper
│   │   │   │   ├── Terminal.tsx            # xterm.js wrapper
│   │   │   │   └── ChatPanel.tsx           # Rafael chat
│   │   │   │
│   │   │   ├── SofiaWorkspace.tsx          # Week 1 MVP
│   │   │   │   ├── DODChecklist.tsx        # Reuse from old design
│   │   │   │   ├── TestResults.tsx         # New: test output display
│   │   │   │   └── ChatPanel.tsx           # Sofia chat
│   │   │   │
│   │   │   ├── EmmaWorkspace.tsx           # Week 2
│   │   │   ├── InnaWorkspace.tsx           # Week 2
│   │   │   └── MayaWorkspace.tsx           # Week 2
│   │   │
│   │   ├── shared/
│   │   │   ├── ChatPanel.tsx               # Reusable chat component (used by all citizens)
│   │   │   ├── CodeBlock.tsx               # Code syntax highlighting
│   │   │   ├── StatusIndicator.tsx         # ● teal/blue/gray dot
│   │   │   └── WorkflowArrow.tsx           # ──→ arrow between citizens
│   │   │
│   │   └── ui/                             # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── api.ts                          # API client (fetch wrappers)
│   │   ├── websocket.ts                    # WebSocket client (terminal, tests)
│   │   └── types.ts                        # TypeScript types
│   │
│   └── hooks/
│       ├── useMission.ts                   # Fetch mission data
│       ├── useChat.ts                      # Send/receive chat messages
│       ├── useTerminal.ts                  # WebSocket terminal hook
│       └── useDOD.ts                       # DoD checklist state
│
├── public/
│   └── ...
│
├── package.json
├── tsconfig.json
└── next.config.js
```

### Component Hierarchy

```
Page: /deck/[missionId]
└─ DeckLayout
   ├─ MissionSelector (Left Panel)
   │  └─ MissionCard[] (list of missions)
   │
   └─ WorkspaceContainer (Right Panel)
      ├─ CitizenSelector (Horizontal Tabs)
      │  └─ CitizenTab[] (Emma, Inna, Rafael, Sofia, Maya)
      │
      └─ ActiveWorkspace (Conditionally Rendered)
         │
         ├─ if (active === 'rafael'):
         │  └─ RafaelWorkspace
         │     ├─ FileTree (left)
         │     ├─ CodeEditor (middle, Monaco)
         │     ├─ Terminal (right, xterm.js)
         │     └─ ChatPanel (bottom)
         │
         ├─ if (active === 'sofia'):
         │  └─ SofiaWorkspace
         │     ├─ DODChecklist (left)
         │     ├─ TestResults (right)
         │     └─ ChatPanel (bottom)
         │
         ├─ if (active === 'emma'):  (Week 2)
         │  └─ EmmaWorkspace
         │     ├─ JobFeed (left)
         │     └─ ChatPanel (right)
         │
         ├─ if (active === 'inna'):  (Week 2)
         │  └─ InnaWorkspace
         │     ├─ DocTree (left)
         │     ├─ MarkdownEditor (middle)
         │     └─ ChatPanel (bottom)
         │
         └─ if (active === 'maya'):  (Week 2)
            └─ MayaWorkspace
               ├─ ClientMessages (left)
               ├─ StatusUpdateDraft (right)
               └─ ChatPanel (bottom)
```

---

## State Management

### Approach: React Context + Zustand

**Why Zustand over Redux:**
- Simpler API (less boilerplate)
- Better TypeScript support
- Smaller bundle size
- Easier to test

### State Stores

**1. MissionStore**
```typescript
// stores/missionStore.ts
type MissionStore = {
  missions: Mission[];                    // All missions for user
  activeMissionId: string | null;         // Currently selected mission
  activeMission: Mission | null;          // Full mission object
  fetchMissions: () => Promise<void>;
  setActiveMission: (id: string) => void;
};
```

**2. WorkspaceStore**
```typescript
// stores/workspaceStore.ts
type WorkspaceStore = {
  activeCitizen: 'rafael' | 'sofia' | 'emma' | 'inna' | 'maya';
  setActiveCitizen: (citizen: string) => void;
  citizenStatus: Record<string, 'waiting' | 'active' | 'complete'>; // For status indicators
};
```

**3. ChatStore** (per citizen per mission)
```typescript
// stores/chatStore.ts
type ChatStore = {
  messages: Record<string, Record<string, ChatMessage[]>>; // { missionId: { citizen: [messages] } }
  sendMessage: (missionId: string, citizen: string, message: string) => Promise<void>;
  loadHistory: (missionId: string, citizen: string) => Promise<void>;
};
```

**4. FileTreeStore** (Rafael workspace)
```typescript
// stores/fileTreeStore.ts
type FileTreeStore = {
  files: FileNode[];                      // File tree structure
  activeFile: string | null;              // Currently open file path
  fileContents: Record<string, string>;   // { path: content }
  openFile: (path: string) => Promise<void>;
  saveFile: (path: string, content: string) => Promise<void>;
};
```

**5. TerminalStore** (Rafael workspace)
```typescript
// stores/terminalStore.ts
type TerminalStore = {
  sessionId: string | null;               // WebSocket session ID
  output: string[];                       // Terminal output lines
  sendCommand: (command: string) => void;
  clearTerminal: () => void;
};
```

**6. DODStore** (Sofia workspace)
```typescript
// stores/dodStore.ts
type DODStore = {
  items: DODItem[];                       // DoD checklist items
  progress: { completed: number; total: number };
  toggleItem: (itemId: string) => Promise<void>;
  markAllComplete: () => Promise<void>;
  reset: () => Promise<void>;
};
```

---

## Data Flows

### 1. Mission Selection Flow

```
User clicks Mission #47 in MissionSelector
  ↓
MissionStore.setActiveMission('47')
  ↓
Frontend: GET /api/missions/47
  ↓
Backend: Query database for mission details
  ↓
Frontend: Update MissionStore.activeMission
  ↓
All workspaces reload with Mission #47 data
  ↓
ChatStore loads chat history for active citizen + Mission #47
FileTreeStore loads files for Mission #47 (if Rafael workspace)
DODStore loads DoD items for Mission #47 (if Sofia workspace)
```

### 2. Citizen Workspace Switch Flow

```
User clicks "Rafael" in CitizenSelector
  ↓
WorkspaceStore.setActiveCitizen('rafael')
  ↓
WorkspaceContainer unmounts current workspace (e.g., SofiaWorkspace)
  ↓
WorkspaceContainer mounts RafaelWorkspace
  ↓
RafaelWorkspace initializes:
  - FileTreeStore.loadFiles(activeMissionId)
  - TerminalStore.connectWebSocket()
  - ChatStore.loadHistory(activeMissionId, 'rafael')
  ↓
User sees: File tree + Code editor + Terminal + Rafael chat
```

### 3. Rafael Code Editing Flow

```
User clicks "telegram_bot.py" in FileTree
  ↓
FileTreeStore.openFile('src/telegram_bot.py')
  ↓
Frontend: GET /api/missions/47/files/src/telegram_bot.py
  ↓
Backend: Read file from database or filesystem
  ↓
Frontend: FileTreeStore.fileContents['src/telegram_bot.py'] = content
  ↓
CodeEditor (Monaco) displays content
  ↓
User edits code
  ↓
User clicks [Save]
  ↓
FileTreeStore.saveFile('src/telegram_bot.py', newContent)
  ↓
Frontend: PATCH /api/missions/47/files/src/telegram_bot.py
  ↓
Backend: Save to database/filesystem
  ↓
Frontend: Show "Saved" toast notification
```

### 4. Terminal Command Execution Flow (WebSocket)

```
User types `pytest tests/` in Terminal
  ↓
Terminal component calls TerminalStore.sendCommand('pytest tests/')
  ↓
TerminalStore sends via WebSocket: { type: 'command', data: 'pytest tests/' }
  ↓
Backend WebSocket handler:
  - Execute command in subprocess
  - Stream stdout/stderr back to client
  ↓
Frontend WebSocket receives: { type: 'output', data: '...test output...' }
  ↓
TerminalStore.output.push('...test output...')
  ↓
Terminal component (xterm.js) displays output in real-time
```

### 5. Chat with Rafael Flow

```
User types "How do I add inline buttons?" in Rafael chat
  ↓
ChatStore.sendMessage('47', 'rafael', 'How do I add inline buttons?')
  ↓
Frontend: POST /api/missions/47/chat/rafael
  { message: "How do I add inline buttons?" }
  ↓
Backend:
  - Save user message to database
  - Call Rafael citizen API (Claude API or simulated)
  - Get response with code blocks
  - Save Rafael response to database
  ↓
Frontend receives: { response: "Here's the code...", code_blocks: [...] }
  ↓
ChatStore.messages['47']['rafael'].push(userMessage, rafaelResponse)
  ↓
ChatPanel displays messages with syntax-highlighted code blocks
  ↓
User clicks [Insert to Editor]
  ↓
FileTreeStore.activeFile content += code_block
  ↓
CodeEditor (Monaco) updates with inserted code
```

### 6. Sofia DoD Verification Flow

```
User switches to Sofia workspace
  ↓
SofiaWorkspace loads:
  - DODStore.loadItems('47')
  - TestResultsStore.loadLatestRun('47')
  ↓
Frontend: GET /api/missions/47/dod
Frontend: GET /api/missions/47/tests/latest
  ↓
Backend: Query database for DoD items + latest test run
  ↓
Frontend displays:
  - Left: DoD checklist (9/13 completed)
  - Right: Test results (8/10 passed, 2 failed)
  ↓
User checks "Bot sends inline buttons" checkbox
  ↓
DODStore.toggleItem('item-id-2')
  ↓
Frontend: PATCH /api/missions/47/dod/item-id-2 { completed: true }
  ↓
Backend: Update database, calculate new progress
  ↓
Frontend: DODStore.progress = { completed: 10, total: 13 }
  ↓
Progress bar updates: 10/13 (77%)
```

---

## API Design (Backend)

### RESTful Endpoints

**Missions:**
```
GET    /api/missions                      # List all missions for user
GET    /api/missions/{id}                 # Get mission details
POST   /api/missions                      # Create mission (admin)
PATCH  /api/missions/{id}                 # Update mission
DELETE /api/missions/{id}                 # Delete mission (admin)
```

**DoD (Sofia workspace):**
```
GET    /api/missions/{id}/dod             # Get DoD items
PATCH  /api/missions/{id}/dod/{item_id}   # Toggle DoD item
POST   /api/missions/{id}/dod/complete    # Mark all complete
POST   /api/missions/{id}/dod/reset       # Reset all
```

**Chat (All workspaces):**
```
GET    /api/missions/{id}/chat/{citizen}        # Get chat history
POST   /api/missions/{id}/chat/{citizen}        # Send message to citizen
DELETE /api/missions/{id}/chat/{citizen}        # Clear chat history
```

**Files (Rafael workspace):**
```
GET    /api/missions/{id}/files                 # List all files (file tree)
GET    /api/missions/{id}/files/{path}          # Read file content
PATCH  /api/missions/{id}/files/{path}          # Save file content
POST   /api/missions/{id}/files                 # Create new file
DELETE /api/missions/{id}/files/{path}          # Delete file
```

**Tests (Sofia workspace):**
```
GET    /api/missions/{id}/tests/latest          # Get latest test run results
POST   /api/missions/{id}/tests/run             # Trigger test run
GET    /api/missions/{id}/tests/{run_id}        # Get specific test run
GET    /api/missions/{id}/tests/{run_id}/logs   # Get full test logs
```

### WebSocket Endpoints

**Terminal (Rafael workspace):**
```
WS     /api/terminal/{mission_id}

Client → Server:
  { type: 'command', data: 'pytest tests/' }

Server → Client:
  { type: 'output', data: '...test output line...' }
  { type: 'exit', code: 0 }
```

**Test Runner (Sofia workspace, Week 1 placeholder):**
```
WS     /api/tests/stream/{mission_id}

Server → Client (real-time test results):
  { type: 'test_start', test: 'test_send_message' }
  { type: 'test_pass', test: 'test_send_message', duration: 0.5 }
  { type: 'test_fail', test: 'test_callback', error: 'KeyError...' }
  { type: 'run_complete', summary: { passed: 8, failed: 2 } }
```

---

## Database Schema Updates

### New Tables

**1. files** (for Rafael workspace)
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  path TEXT NOT NULL,                    -- e.g., "src/telegram_bot.py"
  content TEXT NOT NULL,                 -- File contents
  language TEXT,                         -- "python", "typescript", "markdown"
  modified_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(mission_id, path)
);
```

**2. chat_messages** (updated schema)
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  citizen TEXT NOT NULL,                 -- "rafael", "sofia", "emma", etc.
  sender TEXT NOT NULL,                  -- "user" or "citizen"
  message TEXT NOT NULL,
  code_blocks JSONB,                     -- [{ language: "python", code: "..." }]
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_mission_citizen ON chat_messages(mission_id, citizen);
```

**3. terminal_sessions** (for Rafael workspace)
```sql
CREATE TABLE terminal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  websocket_id TEXT NOT NULL,            -- WebSocket connection ID
  cwd TEXT,                              -- Current working directory
  output TEXT[],                         -- Array of output lines
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW()
);
```

**4. test_runs** (for Sofia workspace)
```sql
CREATE TABLE test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  status TEXT NOT NULL,                  -- "running", "passed", "failed"
  summary JSONB,                         -- { passed: 8, failed: 2, duration: 5.2 }
  results JSONB,                         -- [{ test: "test_foo", status: "passed", ... }]
  logs TEXT,                             -- Full test output
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_test_runs_mission ON test_runs(mission_id, created_at DESC);
```

---

## Technical Dependencies

### Frontend

**New Dependencies (Week 1):**
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",      // Code editor (VS Code)
    "xterm": "^5.3.0",                      // Terminal emulator
    "xterm-addon-fit": "^0.8.0",            // Auto-resize terminal
    "xterm-addon-web-links": "^0.9.0",      // Clickable URLs in terminal
    "react-resizable-panels": "^1.0.0",     // Resizable panels (file tree/editor/terminal)
    "zustand": "^4.4.7",                    // State management
    "socket.io-client": "^4.6.0"            // WebSocket client
  }
}
```

**Existing Dependencies:**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "@clerk/nextjs": "^4.29.0",             // Auth (or custom JWT)
    "react-markdown": "^9.0.0",             // Markdown rendering (chat code blocks)
    "react-syntax-highlighter": "^15.5.0"   // Syntax highlighting
  }
}
```

### Backend

**New Dependencies (Week 1):**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-socketio==5.11.0       # WebSocket for terminal/tests
psycopg2-binary==2.9.9        # PostgreSQL
sqlalchemy==2.0.25            # ORM
pydantic==2.5.3               # Request/response validation
python-jose[cryptography]==3.3.0  # JWT tokens (if not using Clerk)
asyncio==3.4.3                # Async command execution
```

---

## Implementation Phases

### Phase 1: Foundation (Days 1-2)

**Goal:** Basic citizen workspace switching without specialized UIs

**Tasks:**
1. Update frontend component structure:
   - Create `CitizenSelector.tsx` (horizontal tabs)
   - Create `WorkspaceContainer.tsx` (conditional rendering)
   - Create placeholder workspace components (RafaelWorkspace, SofiaWorkspace, etc.)
2. Update state management:
   - Create `WorkspaceStore` (activeCitizen, citizenStatus)
   - Update `MissionStore` (no changes needed)
3. Update routing:
   - `/deck/[missionId]` → renders WorkspaceContainer
   - Default active citizen: Rafael
4. Backend:
   - Update chat API to support `citizen` parameter
   - Add database migration for `chat_messages.citizen` column

**Deliverable:** Click citizen tabs → workspace switches (even if workspace is empty placeholder)

---

### Phase 2: Rafael Workspace - File Tree (Days 3-4)

**Goal:** File tree + code editor (Monaco) working

**Tasks:**
1. Database:
   - Create `files` table
   - Seed with sample files for test mission
2. Backend:
   - `GET /api/missions/{id}/files` → list files
   - `GET /api/missions/{id}/files/{path}` → read file
   - `PATCH /api/missions/{id}/files/{path}` → save file
3. Frontend:
   - Create `FileTree.tsx`:
     - Fetch files from API
     - Display as collapsible tree
     - Click file → opens in editor
   - Create `CodeEditor.tsx`:
     - Integrate Monaco Editor
     - Load file content when file selected
     - [Save] button → PATCH to API
     - Syntax highlighting for .py, .ts, .js, .md
4. State:
   - Create `FileTreeStore` (files, activeFile, fileContents)

**Deliverable:** File tree shows files → click file → opens in Monaco editor → edit → save works

---

### Phase 3: Rafael Workspace - Terminal (Days 5-6)

**Goal:** Terminal (xterm.js) + WebSocket command execution

**Tasks:**
1. Backend:
   - WebSocket endpoint: `/api/terminal/{mission_id}`
   - Handler:
     - Receive command from client
     - Execute in subprocess (asyncio)
     - Stream stdout/stderr back to client
     - Handle command exit codes
2. Frontend:
   - Create `Terminal.tsx`:
     - Integrate xterm.js
     - Connect to WebSocket
     - Send commands on Enter key
     - Display output in real-time
     - [Clear] button
3. State:
   - Create `TerminalStore` (sessionId, output, sendCommand)

**Deliverable:** Terminal works → type `python --version` → see output → type `pytest tests/` → see test results

---

### Phase 4: Rafael Workspace - Chat Integration (Day 7)

**Goal:** Chat with Rafael works in Rafael workspace

**Tasks:**
1. Backend:
   - `POST /api/missions/{id}/chat/rafael` → send message to Rafael
   - Simulate Rafael responses (GPT-4 API or hardcoded responses for MVP)
2. Frontend:
   - Create `ChatPanel.tsx` (reusable for all citizens):
     - Message input
     - Message history
     - Code blocks with syntax highlighting
     - [Copy Code] [Insert to Editor] [Run in Terminal] buttons
   - Integrate into `RafaelWorkspace` (bottom panel)
3. Actions:
   - [Insert to Editor] → append code to active file in CodeEditor
   - [Run in Terminal] → send command to TerminalStore

**Deliverable:** Ask Rafael "How do I send Telegram message?" → Rafael responds with code → click [Insert to Editor] → code appears in editor

---

### Phase 5: Sofia Workspace - DoD + Test Results (Days 8-9)

**Goal:** Sofia workspace with DoD checklist + test results display

**Tasks:**
1. Backend:
   - Create `test_runs` table
   - `GET /api/missions/{id}/tests/latest` → get latest test run
   - `POST /api/missions/{id}/tests/run` → trigger test run (manual Week 1)
   - Seed database with sample test results for test mission
2. Frontend:
   - Create `TestResults.tsx`:
     - Display test results (✓ passed, ✗ failed)
     - Show error details for failed tests
     - Performance metrics (actual vs threshold)
     - [Re-run Tests] button (placeholder Week 1)
   - Create `SofiaWorkspace.tsx`:
     - Left: DODChecklist (reuse from old design)
     - Right: TestResults
     - Bottom: ChatPanel (Sofia chat)
3. State:
   - Create `TestResultsStore` (latestRun, loadLatestRun)

**Deliverable:** Sofia workspace shows DoD (9/13 completed) + Test results (8/10 passed) + Sofia chat

---

### Phase 6: Polish & Testing (Days 10-11)

**Goal:** Bug fixes, performance optimization, accessibility

**Tasks:**
1. Responsive design:
   - Tablet (768px): Collapse mission selector to drawer
   - Mobile: Stack workspaces vertically (optional Week 1)
2. Accessibility:
   - Focus indicators on all interactive elements
   - Keyboard navigation (Tab, Enter, Escape)
   - ARIA labels for screen readers
3. Performance:
   - Lazy load workspace components (React.lazy)
   - Debounce file saves (don't save on every keystroke)
   - WebSocket reconnection logic
4. Error handling:
   - Show error toasts for API failures
   - Graceful degradation if Rafael/Sofia unavailable
5. Testing:
   - Write unit tests for stores
   - Write integration tests for chat flow
   - Manual E2E test: Complete one mission using Rafael → Sofia workspaces

**Deliverable:** All Week 1 acceptance criteria passing

---

### Phase 7: Deployment & Verification (Days 12-13)

**Goal:** Deploy to production, verify with real user

**Tasks:**
1. Deploy frontend to Vercel:
   - Set environment variables (API URL, Clerk keys)
   - Verify build passes
2. Deploy backend to Render:
   - Set environment variables (DATABASE_URL, JWT_SECRET)
   - Run database migrations
   - Verify WebSocket connections work
3. Seed production database:
   - Create 2 test missions
   - Seed files for Mission #1
   - Seed DoD items + test results
4. User testing:
   - Person 1 (Kara) completes ONE mission using Mission Deck
   - Track: Time spent, errors encountered, feedback
5. Iterate based on feedback

**Deliverable:** Mission Deck deployed, Person 1 successfully completes mission

---

## Week 2 Expansion Plan (Optional)

### Emma Workspace (Days 14-16)

**Goal:** Upwork job feed + proposal drafting

**Tasks:**
1. Backend:
   - Upwork RSS/API integration (or manual job scraping)
   - `GET /api/jobs` → list Upwork jobs
   - `POST /api/jobs/{id}/analyze` → Emma analyzes job
2. Frontend:
   - Create `EmmaWorkspace.tsx`:
     - Left: JobFeed (list of jobs)
     - Right: ChatPanel (Emma chat)
   - Create `JobFeed.tsx`:
     - Display job cards (title, budget, posted time)
     - [Analyze Job] [Draft Proposal] buttons

### Inna Workspace (Days 17-19)

**Goal:** Documentation editor + AC.md builder

**Tasks:**
1. Backend:
   - `GET /api/missions/{id}/docs` → list docs (PATTERN, AC, etc.)
   - `GET /api/missions/{id}/docs/{file}` → read doc
   - `PATCH /api/missions/{id}/docs/{file}` → save doc
2. Frontend:
   - Create `InnaWorkspace.tsx`:
     - Left: DocTree (6-level hierarchy)
     - Middle: MarkdownEditor (Monaco with markdown mode)
     - Bottom: ChatPanel (Inna chat)

### Maya Workspace (Days 20-22)

**Goal:** Client messages + status updates

**Tasks:**
1. Backend:
   - Email integration (IMAP/SMTP) or manual message log
   - `GET /api/missions/{id}/client-messages` → list messages
   - `POST /api/missions/{id}/client-messages` → send message
2. Frontend:
   - Create `MayaWorkspace.tsx`:
     - Left: ClientMessages (message threads)
     - Right: StatusUpdateDraft (auto-generated update)
     - Bottom: ChatPanel (Maya chat)

---

## Success Metrics (Week 1)

**Quantitative:**
- ✅ Person 1 completes ONE mission using Mission Deck exclusively
- ✅ Rafael workspace used for ≥60% of coding time (vs external IDE)
- ✅ Terminal used for ≥80% of commands (vs external terminal)
- ✅ Sofia workspace used for final QA verification
- ✅ Zero critical bugs in production after 7 days

**Qualitative (from Person 1 feedback):**
- ✅ "Faster than switching between Telegram + CLI + IDE"
- ✅ "Rafael guidance is accessible (no CLI knowledge needed)"
- ✅ "DoD tracking is automatic (no manual updates)"

**If Success Metrics NOT Met:**
- Gather feedback: What's missing? What's broken?
- Iterate for Week 2 (fix blockers)
- Fallback: Keep existing workflow, Mission Deck optional

---

## Risk Mitigation

### R1: Rafael Integration Too Complex

**Risk:** Rafael is Claude Code citizen, not API-based. Web integration difficult.

**Mitigation:**
- Week 1: Simulate Rafael with Claude API (faster MVP)
- Week 2: Integrate actual Rafael citizen if needed
- Fallback: Human-in-loop (Rafael runs in terminal, human pastes response)

### R2: WebSocket Terminal Unreliable

**Risk:** WebSocket connections drop, terminal sessions lost.

**Mitigation:**
- Implement reconnection logic (auto-reconnect on disconnect)
- Store terminal output in database (persistent across refreshes)
- Fallback: Show error message, ask user to refresh

### R3: Monaco Editor Performance Issues

**Risk:** Large files (>10,000 lines) cause editor to lag.

**Mitigation:**
- Limit file size in Week 1 MVP (warn if file >5,000 lines)
- Lazy load file content (don't load until file clicked)
- Week 2: Consider alternative editors (CodeMirror) if Monaco too heavy

### R4: Developer Adoption Low

**Risk:** Developers prefer existing workflow (CLI + Telegram).

**Mitigation:**
- Test with Person 1 first (most willing to try new tools)
- Gather feedback, iterate quickly
- Don't force adoption if Week 1 fails
- Keep existing workflow available

---

**Rafael Silva** — The Guide
ScopeLock Internal Tools
2025-11-05
