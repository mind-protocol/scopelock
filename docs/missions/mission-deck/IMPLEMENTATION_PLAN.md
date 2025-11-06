# Mission Deck - Implementation Plan (Simplified)

**Created:** 2025-11-05
**Version:** 1.0 (Week 1 MVP - SIMPLIFIED)
**Architect:** Rafael

---

## Scope Simplification

**USER CLARIFICATION:**
> "Monaco Editor, xterm.js, react-file-tree are not needed; we just need to display to the human the files, so maybe a view of GitHub and that's it, and the chat of course."

**Updated Week 1 MVP Scope:**
- ✅ Rafael workspace: **GitHub embed** + **Chat with Rafael**
- ✅ Sofia workspace: **DoD checklist** + **Test results placeholder** + **Chat with Sofia**
- ✅ Citizen selector (horizontal workflow tabs)

**What We're NOT Building (Week 1):**
- ❌ Code editor (Monaco) - developers use their own IDE
- ❌ Terminal (xterm.js) - developers use their own terminal
- ❌ File tree component - GitHub embed shows files

**Why This Is Better:**
- Faster to build (5-7 days vs 13 days)
- Lower risk (no complex WebSocket terminal, no code editing sync issues)
- Better UX (don't try to replicate VS Code, just augment existing workflow)

---

## Simplified Architecture

### Rafael Workspace Layout

```
┌───────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                 │
│   ○         ○        ●         ○         ○                    │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  Rafael's Workspace: Code Reference & Guidance                │
│                                                                │
│  ┌─── GitHub Repository View ──────────────────────────────┐ │
│  │                                                          │ │
│  │  [Embedded GitHub Repository]                           │ │
│  │  https://github.com/mind-protocol/mission-47            │ │
│  │                                                          │ │
│  │  Shows: Files, commits, branches, README                │ │
│  │  Developers click files → view in GitHub → copy code   │ │
│  │                                                          │ │
│  │  [Open in GitHub] [Open in VS Code]                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Chat with Rafael                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ You: How do I add inline buttons to Telegram bot?       │ │
│  │                                                          │ │
│  │ Rafael: Here's the code for inline buttons:             │ │
│  │                                                          │ │
│  │ ```python                                                │ │
│  │ from telegram import InlineKeyboardButton, ...          │ │
│  │                                                          │ │
│  │ keyboard = [[                                            │ │
│  │   InlineKeyboardButton("Option 1", callback_data='1')  │ │
│  │ ]]                                                       │ │
│  │ ```                                                      │ │
│  │                                                          │ │
│  │ Add this to your bot handler in src/bot.py (line 47).  │ │
│  │                                                          │ │
│  │ [Copy Code] [Open File in GitHub]                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### Sofia Workspace Layout (Unchanged)

```
┌───────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                 │
│   ○         ○        ○         ●         ○                    │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  Sofia's Workspace: Quality Assurance & Verification          │
│                                                                │
│  ┌─── DoD Checklist ──────────┬─── Test Results ───────────┐ │
│  │                             │                             │ │
│  │  Functional (6/8)           │  Functional Tests: 8/10 ✓  │ │
│  │  ☑ Bot sends text messages  │                             │ │
│  │  ☑ Bot sends inline buttons │  ✓ test_send_message       │ │
│  │  ☐ Bot edits messages       │  ✗ test_callback_handler   │ │
│  │                             │    Error: KeyError...       │ │
│  │  Non-Functional (2/3)       │                             │ │
│  │  ☑ Deployed to Render       │  Performance: 2/3 ✓        │ │
│  │  ☐ Response time <200ms     │  ✓ Health check (145ms)    │ │
│  │                             │  ✗ DB query (350ms)        │ │
│  │  Progress: 8/11 (73%)       │                             │ │
│  │  ████████████░░░░           │  [Re-run Tests] [Logs]     │ │
│  └─────────────────────────────┴─────────────────────────────┘ │
│                                                                │
│  Chat with Sofia                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Sofia: Found 2 failing tests. Recommendations:           │ │
│  │ 1. Add error handling for callback_data (line 47)       │ │
│  │ 2. Add database index on user_id column                 │ │
│  │                                                          │ │
│  │ [Ask Rafael to Fix] [Mark as Known Issue]               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## Simplified Component Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Login page
│   │   └── deck/
│   │       └── [missionId]/
│   │           └── page.tsx            # Main deck page
│   │
│   ├── components/
│   │   ├── MissionSelector.tsx         # Left panel (unchanged)
│   │   ├── CitizenSelector.tsx         # Horizontal tabs (NEW)
│   │   │
│   │   ├── workspaces/
│   │   │   ├── RafaelWorkspace.tsx     # GitHub embed + Chat
│   │   │   ├── SofiaWorkspace.tsx      # DoD + Test results + Chat
│   │   │   └── [Week 2: Emma, Inna, Maya workspaces]
│   │   │
│   │   └── shared/
│   │       ├── ChatPanel.tsx           # Reusable chat (used by all)
│   │       ├── CodeBlock.tsx           # Syntax highlighting
│   │       ├── StatusIndicator.tsx     # ● dot (teal/blue/gray)
│   │       ├── DODChecklist.tsx        # Reuse from old design
│   │       └── TestResults.tsx         # Test output display
│   │
│   ├── lib/
│   │   ├── api.ts                      # API client
│   │   └── types.ts                    # TypeScript types
│   │
│   └── hooks/
│       ├── useMission.ts               # Fetch mission data
│       ├── useChat.ts                  # Send/receive chat
│       └── useDOD.ts                   # DoD checklist state
│
├── package.json
└── tsconfig.json
```

---

## Simplified Technical Dependencies

### Frontend (Week 1)

**Required Dependencies:**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "@clerk/nextjs": "^4.29.0",             // Auth
    "react-markdown": "^9.0.0",             // Markdown (chat messages)
    "react-syntax-highlighter": "^15.5.0",  // Syntax highlighting (code blocks)
    "zustand": "^4.4.7"                     // State management (lightweight)
  }
}
```

**NOT NEEDED (removed from original plan):**
- ❌ @monaco-editor/react (code editor)
- ❌ xterm (terminal emulator)
- ❌ xterm-addon-fit
- ❌ react-resizable-panels
- ❌ socket.io-client (no WebSocket needed Week 1)

### Backend (Week 1)

**Required Dependencies:**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
psycopg2-binary==2.9.9        # PostgreSQL
sqlalchemy==2.0.25            # ORM
pydantic==2.5.3               # Validation
python-jose[cryptography]==3.3.0  # JWT (if not using Clerk)
```

**NOT NEEDED (Week 1):**
- ❌ python-socketio (no WebSocket)
- ❌ asyncio subprocess handling (no terminal)

---

## Simplified Data Flows

### 1. Rafael Workspace: GitHub View + Chat

```
User selects Rafael workspace
  ↓
Frontend renders RafaelWorkspace component
  ↓
Component fetches mission.github_url from MissionStore
  ↓
Displays embedded GitHub view:
  Option A: iframe (if allowed by GitHub)
  Option B: Link with [Open in GitHub] button
  Option C: GitHub API to fetch file tree (read-only display)
  ↓
User asks Rafael: "How do I add inline buttons?"
  ↓
ChatStore.sendMessage('rafael', 'How do I add inline buttons?')
  ↓
POST /api/missions/47/chat/rafael
  ↓
Backend:
  - Save user message
  - Call Rafael (Claude API or simulated)
  - Get response with code blocks
  - Save response
  ↓
Frontend displays Rafael's response with syntax highlighting
  ↓
User clicks [Copy Code] → clipboard
User clicks [Open File in GitHub] → opens specific file in new tab
```

**No complex file editing sync, no terminal WebSocket → Much simpler!**

### 2. Sofia Workspace: DoD + Test Results

```
User selects Sofia workspace
  ↓
Frontend renders SofiaWorkspace component
  ↓
Component fetches:
  - DODStore.loadItems(missionId)
  - TestResultsStore.loadLatest(missionId)
  ↓
GET /api/missions/47/dod
GET /api/missions/47/tests/latest
  ↓
Backend:
  - Query DoD items
  - Query latest test run (or return placeholder)
  ↓
Frontend displays:
  - Left: DoD checklist (8/11 completed)
  - Right: Test results (8/10 passed, placeholder Week 1)
  ↓
User checks DoD item
  ↓
PATCH /api/missions/47/dod/{item_id} { completed: true }
  ↓
Backend updates database
  ↓
Frontend updates progress bar
```

---

## Simplified Database Schema

### No New Tables Needed (Week 1)!

**Existing tables are sufficient:**

**missions** (unchanged)
```sql
CREATE TABLE missions (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  budget INTEGER NOT NULL,
  deadline TIMESTAMP NOT NULL,
  status TEXT NOT NULL,
  assigned_to TEXT NOT NULL,
  github_url TEXT,                    -- NEW: URL to GitHub repo
  created_at TIMESTAMP DEFAULT NOW()
);
```

**dod_items** (unchanged)
```sql
CREATE TABLE dod_items (
  id UUID PRIMARY KEY,
  mission_id UUID REFERENCES missions(id),
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP
);
```

**chat_messages** (updated)
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  mission_id UUID REFERENCES missions(id),
  citizen TEXT NOT NULL,              -- 'rafael', 'sofia', 'emma', etc.
  sender TEXT NOT NULL,               -- 'user' or 'citizen'
  message TEXT NOT NULL,
  code_blocks JSONB,                  -- [{ language: "python", code: "..." }]
  created_at TIMESTAMP DEFAULT NOW()
);
```

**test_runs** (placeholder Week 1, can be manual data)
```sql
CREATE TABLE test_runs (
  id UUID PRIMARY KEY,
  mission_id UUID REFERENCES missions(id),
  status TEXT NOT NULL,
  summary JSONB,                      -- { passed: 8, failed: 2 }
  results JSONB,                      -- [{ test: "test_foo", status: "passed" }]
  logs TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Plan (Simplified)

### Phase 1: Citizen Selector (Day 1)

**Goal:** Horizontal citizen tabs with workflow arrows

**Tasks:**
1. Create `CitizenSelector.tsx`:
   ```tsx
   const citizens = ['emma', 'inna', 'rafael', 'sofia', 'maya'];
   const activeCitizen = 'rafael'; // default

   return (
     <div className="flex items-center gap-2">
       {citizens.map((citizen, i) => (
         <>
           <CitizenTab
             name={citizen}
             active={activeCitizen === citizen}
             onClick={() => setActiveCitizen(citizen)}
           />
           {i < citizens.length - 1 && <WorkflowArrow />}
         </>
       ))}
     </div>
   );
   ```

2. Create `WorkspaceStore`:
   ```typescript
   type WorkspaceStore = {
     activeCitizen: 'rafael' | 'sofia' | 'emma' | 'inna' | 'maya';
     setActiveCitizen: (citizen: string) => void;
   };
   ```

3. Update `/deck/[missionId]/page.tsx`:
   - Render `CitizenSelector` at top
   - Conditionally render workspace based on `activeCitizen`

**Deliverable:** Click citizen tabs → active state changes (visual only)

**Time:** 1 day

---

### Phase 2: Rafael Workspace - GitHub View (Day 2)

**Goal:** Display GitHub repository link/embed

**Tasks:**
1. Update `missions` table:
   ```sql
   ALTER TABLE missions ADD COLUMN github_url TEXT;
   UPDATE missions SET github_url = 'https://github.com/mind-protocol/mission-47' WHERE id = '47';
   ```

2. Create `RafaelWorkspace.tsx`:
   ```tsx
   export function RafaelWorkspace({ missionId }) {
     const mission = useMission(missionId);

     return (
       <div className="flex flex-col h-full">
         {/* GitHub View */}
         <div className="flex-1 border rounded p-4">
           <div className="flex items-center gap-4 mb-4">
             <h3>GitHub Repository</h3>
             <a href={mission.github_url} target="_blank" className="btn">
               Open in GitHub
             </a>
             <a href={`vscode://vscode.git/clone?url=${mission.github_url}`} className="btn">
               Open in VS Code
             </a>
           </div>

           {/* Option A: Embed iframe (if allowed) */}
           <iframe
             src={mission.github_url}
             className="w-full h-full"
           />

           {/* Option B: Simple link (fallback if iframe blocked) */}
           <p>View code: <a href={mission.github_url}>{mission.github_url}</a></p>
         </div>

         {/* Chat with Rafael */}
         <ChatPanel citizen="rafael" missionId={missionId} />
       </div>
     );
   }
   ```

3. Backend:
   - `GET /api/missions/{id}` → include `github_url` in response

**Deliverable:** Rafael workspace shows GitHub link + iframe (if works) + chat placeholder

**Time:** 1 day

---

### Phase 3: Chat with Rafael (Day 3)

**Goal:** Chat component working, Rafael responds with code blocks

**Tasks:**
1. Create `ChatPanel.tsx` (reusable):
   ```tsx
   export function ChatPanel({ citizen, missionId }) {
     const { messages, sendMessage } = useChat(missionId, citizen);

     return (
       <div className="flex flex-col h-64 border-t">
         {/* Message History */}
         <div className="flex-1 overflow-y-auto p-4">
           {messages.map(msg => (
             <div key={msg.id} className={msg.sender === 'user' ? 'user-msg' : 'citizen-msg'}>
               <p>{msg.message}</p>
               {msg.code_blocks?.map(block => (
                 <CodeBlock language={block.language} code={block.code} />
               ))}
             </div>
           ))}
         </div>

         {/* Input */}
         <div className="flex gap-2 p-4 border-t">
           <input type="text" placeholder="Ask Rafael..." />
           <button onClick={handleSend}>Send</button>
         </div>
       </div>
     );
   }
   ```

2. Create `useChat.ts` hook:
   ```typescript
   export function useChat(missionId: string, citizen: string) {
     const [messages, setMessages] = useState([]);

     const sendMessage = async (text: string) => {
       // Optimistic update
       setMessages(prev => [...prev, { sender: 'user', message: text }]);

       // API call
       const response = await fetch(`/api/missions/${missionId}/chat/${citizen}`, {
         method: 'POST',
         body: JSON.stringify({ message: text })
       });

       const data = await response.json();
       setMessages(prev => [...prev, {
         sender: 'citizen',
         message: data.response,
         code_blocks: data.code_blocks
       }]);
     };

     return { messages, sendMessage };
   }
   ```

3. Backend:
   - Update `POST /api/missions/{id}/chat/{citizen}`:
     ```python
     @app.post("/api/missions/{mission_id}/chat/{citizen}")
     async def send_chat_message(mission_id: str, citizen: str, message: dict):
         user_msg = message["message"]

         # Save user message
         save_message(mission_id, citizen, "user", user_msg)

         # Simulate Rafael (Week 1) or call Claude API
         if citizen == "rafael":
             response = simulate_rafael_response(user_msg)
         else:
             response = simulate_citizen_response(citizen, user_msg)

         # Save citizen response
         save_message(mission_id, citizen, "citizen", response["text"], response.get("code_blocks"))

         return {"response": response["text"], "code_blocks": response.get("code_blocks", [])}
     ```

4. Create `simulate_rafael_response()` (Week 1 placeholder):
   ```python
   def simulate_rafael_response(message: str):
       # Hardcoded responses for common questions
       if "inline buttons" in message.lower():
           return {
               "text": "Here's how to add inline buttons to your Telegram bot:",
               "code_blocks": [{
                   "language": "python",
                   "code": """from telegram import InlineKeyboardButton, InlineKeyboardMarkup

keyboard = [[
    InlineKeyboardButton("Option 1", callback_data='1'),
    InlineKeyboardButton("Option 2", callback_data='2')
]]
reply_markup = InlineKeyboardMarkup(keyboard)
await update.message.reply_text('Choose:', reply_markup=reply_markup)"""
               }]
           }

       # Week 2: Replace with Claude API call
       return {"text": "I need more context. Can you clarify your question?"}
   ```

**Deliverable:** Ask Rafael "How do I add inline buttons?" → Rafael responds with code → [Copy Code] works

**Time:** 1 day

---

### Phase 4: Sofia Workspace - DoD Checklist (Day 4)

**Goal:** DoD checklist displays and toggles work

**Tasks:**
1. Create `DODChecklist.tsx` (reuse from old design with minor tweaks):
   ```tsx
   export function DODChecklist({ missionId }) {
     const { items, progress, toggleItem } = useDOD(missionId);

     return (
       <div className="flex flex-col h-full p-4">
         <h3>Definition of Done</h3>

         <div className="progress-bar mb-4">
           <span>{progress.completed}/{progress.total} ({Math.round(progress.completed / progress.total * 100)}%)</span>
           <div className="bar" style={{ width: `${progress.completed / progress.total * 100}%` }} />
         </div>

         {/* Functional */}
         <h4>Functional</h4>
         {items.filter(i => i.category === 'functional').map(item => (
           <label key={item.id}>
             <input
               type="checkbox"
               checked={item.completed}
               onChange={() => toggleItem(item.id)}
             />
             {item.text}
           </label>
         ))}

         {/* Non-Functional */}
         <h4>Non-Functional</h4>
         {items.filter(i => i.category === 'non-functional').map(item => (
           <label key={item.id}>
             <input type="checkbox" checked={item.completed} onChange={() => toggleItem(item.id)} />
             {item.text}
           </label>
         ))}

         {/* Buttons */}
         <div className="flex gap-2 mt-4">
           <button onClick={markAllComplete}>Mark All Complete</button>
           <button onClick={reset}>Reset</button>
         </div>
       </div>
     );
   }
   ```

2. Create `useDOD.ts` hook:
   ```typescript
   export function useDOD(missionId: string) {
     const [items, setItems] = useState([]);
     const [progress, setProgress] = useState({ completed: 0, total: 0 });

     useEffect(() => {
       fetch(`/api/missions/${missionId}/dod`)
         .then(res => res.json())
         .then(data => {
           setItems(data.items);
           setProgress(data.progress);
         });
     }, [missionId]);

     const toggleItem = async (itemId: string) => {
       await fetch(`/api/missions/${missionId}/dod/${itemId}`, {
         method: 'PATCH',
         body: JSON.stringify({ completed: !items.find(i => i.id === itemId).completed })
       });

       // Refetch
       // ...
     };

     return { items, progress, toggleItem, markAllComplete, reset };
   }
   ```

3. Backend:
   - `GET /api/missions/{id}/dod` (already exists)
   - `PATCH /api/missions/{id}/dod/{item_id}` (already exists)

**Deliverable:** DoD checklist displays → click checkbox → toggle works → progress updates

**Time:** 1 day

---

### Phase 5: Sofia Workspace - Test Results Placeholder (Day 5)

**Goal:** Test results display (manual data Week 1)

**Tasks:**
1. Create `TestResults.tsx`:
   ```tsx
   export function TestResults({ missionId }) {
     const { latestRun, reRun } = useTestResults(missionId);

     if (!latestRun) return <p>No test results yet.</p>;

     return (
       <div className="flex flex-col h-full p-4">
         <h3>Test Results</h3>

         <div className="summary mb-4">
           <p>Functional Tests: {latestRun.summary.functional_passed}/{latestRun.summary.functional_total} ✓</p>
           <p>Performance Tests: {latestRun.summary.performance_passed}/{latestRun.summary.performance_total} ✓</p>
         </div>

         <div className="results">
           {latestRun.results.map(test => (
             <div key={test.name} className={test.status === 'passed' ? 'pass' : 'fail'}>
               {test.status === 'passed' ? '✓' : '✗'} {test.name}
               {test.status === 'failed' && <p className="error">{test.error}</p>}
             </div>
           ))}
         </div>

         <div className="flex gap-2 mt-4">
           <button onClick={reRun}>Re-run Tests</button>
           <button onClick={() => window.open(`/api/missions/${missionId}/tests/${latestRun.id}/logs`)}>View Logs</button>
         </div>
       </div>
     );
   }
   ```

2. Create `useTestResults.ts` hook:
   ```typescript
   export function useTestResults(missionId: string) {
     const [latestRun, setLatestRun] = useState(null);

     useEffect(() => {
       fetch(`/api/missions/${missionId}/tests/latest`)
         .then(res => res.json())
         .then(data => setLatestRun(data));
     }, [missionId]);

     const reRun = async () => {
       // Week 1 placeholder: Just refetch
       // Week 2: POST /api/missions/{id}/tests/run
       alert('Re-run tests: Not implemented Week 1 (manual test run)');
     };

     return { latestRun, reRun };
   }
   ```

3. Backend:
   - Create sample test run data:
     ```python
     # Seed database with sample test results
     test_run = {
       "id": "run-1",
       "mission_id": "47",
       "status": "passed",
       "summary": {
         "functional_passed": 8,
         "functional_total": 10,
         "performance_passed": 2,
         "performance_total": 3
       },
       "results": [
         {"name": "test_send_message", "status": "passed"},
         {"name": "test_callback_handler", "status": "failed", "error": "KeyError: 'callback_data'"},
         # ...
       ]
     }
     ```

   - `GET /api/missions/{id}/tests/latest`:
     ```python
     @app.get("/api/missions/{mission_id}/tests/latest")
     async def get_latest_test_run(mission_id: str):
         # Query database for latest test run
         return test_run  # Placeholder: return hardcoded for Week 1
     ```

**Deliverable:** Sofia workspace shows test results (8/10 passed, 2 failed) with error details

**Time:** 1 day

---

### Phase 6: Sofia Chat + Integration (Day 6)

**Goal:** Chat with Sofia works, [Ask Rafael to Fix] button switches workspaces

**Tasks:**
1. Integrate `ChatPanel` into `SofiaWorkspace.tsx`:
   ```tsx
   export function SofiaWorkspace({ missionId }) {
     return (
       <div className="grid grid-cols-2 gap-4 h-full">
         <DODChecklist missionId={missionId} />
         <TestResults missionId={missionId} />
         <ChatPanel citizen="sofia" missionId={missionId} className="col-span-2" />
       </div>
     );
   }
   ```

2. Add `[Ask Rafael to Fix]` button to Sofia chat:
   ```tsx
   // In ChatPanel when citizen === 'sofia'
   {msg.sender === 'citizen' && (
     <button onClick={handleAskRafael}>Ask Rafael to Fix</button>
   )}
   ```

3. Implement workspace switching:
   ```tsx
   const handleAskRafael = () => {
     // Switch to Rafael workspace
     workspaceStore.setActiveCitizen('rafael');

     // Pre-fill Rafael chat with Sofia's recommendation
     chatStore.sendMessage(missionId, 'rafael',
       `Sofia identified an issue: ${msg.message}. Can you help fix it?`
     );
   };
   ```

4. Backend:
   - `simulate_sofia_response()`:
     ```python
     def simulate_sofia_response(message: str):
         # Sofia analyzes test failures
         return {
             "text": """Found 2 failing tests:
1. test_callback_handler - KeyError: 'callback_data'
   Fix: Add error handling in bot.py line 47
2. test_performance_db_query - 350ms (threshold: 100ms)
   Fix: Add database index on user_id column

Recommendations ready to send to Rafael."""
         }
     ```

**Deliverable:** Sofia analyzes tests → click [Ask Rafael to Fix] → switches to Rafael workspace with pre-filled question

**Time:** 1 day

---

### Phase 7: Polish & Testing (Day 7)

**Goal:** Bug fixes, responsive design, accessibility

**Tasks:**
1. Responsive design:
   - Desktop (≥1280px): Mission selector + workspaces side-by-side
   - Tablet (768px-1279px): Mission selector collapses to hamburger menu
   - Test on iPad/tablet

2. Accessibility:
   - Add ARIA labels to all interactive elements
   - Ensure keyboard navigation works (Tab, Enter)
   - Test with screen reader (basic)

3. Error handling:
   - API failures → show error toast
   - Chat failures → show "Rafael unavailable, try again" message
   - Loading states → show spinners

4. Performance:
   - Lazy load workspaces (`React.lazy`)
   - Debounce chat input (don't send on every keystroke)

5. Manual E2E test:
   - Log in
   - Select Mission #47
   - Switch to Rafael workspace → ask question → get response
   - Switch to Sofia workspace → check DoD boxes → see test results
   - Verify persistence (reload page → state preserved)

**Deliverable:** All Week 1 acceptance criteria passing, no critical bugs

**Time:** 1 day

---

### Phase 8: Deployment (Day 8)

**Goal:** Deploy to production, verify with real user

**Tasks:**
1. Frontend (Vercel):
   - Push to GitHub
   - Vercel auto-deploys
   - Set environment variables

2. Backend (Render):
   - Push to GitHub
   - Render auto-deploys
   - Run migrations
   - Seed test data

3. User testing:
   - Person 1 (Kara) uses Mission Deck for ONE mission
   - Gather feedback

**Deliverable:** Mission Deck deployed, Person 1 successfully completes mission

**Time:** 1 day

---

## Success Metrics (Week 1 MVP)

**Week 1 Goals:**
- ✅ Person 1 completes ONE mission using Mission Deck
- ✅ Rafael workspace used for ≥3 questions (vs Telegram)
- ✅ Sofia workspace used for final QA verification
- ✅ Zero critical bugs in production

**If success:**
- Week 2: Add Emma, Inna, Maya workspaces
- Scale to 4 developers

**If failure:**
- Gather feedback: What's missing? What's broken?
- Iterate on Week 1 MVP
- Fallback: Keep existing workflow, Mission Deck optional

---

## Summary

**Week 1 MVP (SIMPLIFIED):**
- 8 days total (vs 13 days in original plan)
- No code editor (Monaco) → GitHub view only
- No terminal (xterm.js) → developers use own terminal
- Focus on chat + DoD tracking + test results
- Much lower risk, faster to build

**Week 2 Expansion:**
- Add Emma workspace (Upwork job feed)
- Add Inna workspace (doc editor)
- Add Maya workspace (client messages)
- Consider code editor if Week 1 proves valuable

---

**Rafael Silva** — The Guide
ScopeLock Internal Tools
2025-11-05
