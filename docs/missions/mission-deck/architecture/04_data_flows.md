# Data Flows - Mission Deck

**Part:** 4 of 7
**Created:** 2025-11-05
**Prerequisites:** [03_state_management.md](./03_state_management.md)

---

## Key Data Flows

### 1. Mission Selection Flow

```
User clicks Mission #47 in MissionSelector
  ↓
missionStore.setActiveMission('47')
  ↓
Frontend: GET /api/missions/47
  ↓
Backend: Query database for mission details
  ↓
Frontend: Update missionStore.activeMission
  ↓
All workspaces reload with Mission #47 data
```

**Implementation:**
- Component: `MissionSelector.tsx.stub`
- Store: `missionStore.ts.stub`
- API: `backend/api/missions.py.stub`
- Tests: `MissionSelector.test.tsx`, `missionStore.test.ts`

---

### 2. Workspace Switch Flow

```
User clicks "Rafael" in CitizenSelector
  ↓
workspaceStore.setActiveCitizen('rafael')
  ↓
WorkspaceContainer unmounts current workspace
  ↓
WorkspaceContainer mounts RafaelWorkspace
  ↓
RafaelWorkspace useEffect:
  - chatStore.loadHistory('47', 'rafael')
  ↓
Chat messages displayed
```

**Implementation:**
- Component: `CitizenSelector.tsx.stub`, `RafaelWorkspace.tsx.stub`
- Store: `workspaceStore.ts.stub`, `chatStore.ts.stub`
- API: `backend/api/chat.py.stub`
- Tests: `CitizenSelector.test.tsx`, `workspaceStore.test.ts`

---

### 3. Chat with Rafael Flow

```
User types "How do I add inline buttons?"
  ↓
chatStore.sendMessage('47', 'rafael', message)
  ↓
Optimistic update: Add user message to UI immediately
  ↓
Frontend: POST /api/missions/47/chat/rafael
  { message: "How do I add inline buttons?" }
  ↓
Backend:
  - Save user message to database
  - Call simulate_rafael_response() (Week 1)
  - Save Rafael response to database
  ↓
Frontend receives: { response: "...", code_blocks: [...] }
  ↓
chatStore updates messages['47']['rafael']
  ↓
ChatPanel displays Rafael's response with code blocks
```

**Implementation:**
- Component: `ChatPanel.tsx.stub`
- Store: `chatStore.ts.stub`
- API: `backend/api/chat.py.stub`
- Tests: `ChatPanel.test.tsx`, `chatStore.test.ts`, `backend/tests/test_chat.py`

---

### 4. DoD Checkbox Toggle Flow

```
User checks "Bot sends inline buttons"
  ↓
dodStore.toggleItem('47', 'item-id-2')
  ↓
Optimistic update: Check box immediately in UI
  ↓
Frontend: PATCH /api/missions/47/dod/item-id-2
  { completed: true }
  ↓
Backend:
  - Update dod_items table
  - Calculate new progress
  - Return updated progress
  ↓
Frontend: dodStore.progress['47'] = { completed: 10, total: 13 }
  ↓
Progress bar updates: 10/13 (77%)
```

**Implementation:**
- Component: `DODChecklist.tsx.stub`
- Store: `dodStore.ts.stub`
- API: `backend/api/dod.py.stub`
- Tests: `DODChecklist.test.tsx`, `dodStore.test.ts`, `backend/tests/test_dod.py`

---

### 5. Sofia → Rafael Handoff Flow

```
Sofia detects failing test
  ↓
Sofia chat displays: "Fix: Add error handling line 47"
  ↓
User clicks [Ask Rafael to Fix]
  ↓
workspaceStore.setActiveCitizen('rafael')
  ↓
chatStore.sendMessage('47', 'rafael',
  "Sofia identified: <issue>. Can you help fix it?"
)
  ↓
Switch to Rafael workspace with pre-filled question
```

**Implementation:**
- Component: `ChatPanel.tsx.stub` (Sofia-specific button)
- Store: `workspaceStore.ts.stub`, `chatStore.ts.stub`
- Tests: `sofia-rafael-handoff.test.tsx`

---

## Related Documentation

**Previous:** [03_state_management.md](./03_state_management.md)
**Next:** [05_api_design.md](./05_api_design.md)

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
