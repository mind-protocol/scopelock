# State Management - Mission Deck

**Part:** 3 of 7
**Created:** 2025-11-05
**Prerequisites:** [02_component_structure.md](./02_component_structure.md)

---

## Approach: Zustand

Using **Zustand** instead of Redux for state management.

**Why Zustand:**
- Simpler API (less boilerplate than Redux)
- Better TypeScript support
- Smaller bundle size (~1KB vs Redux 3KB)
- No Provider/Context wrapper needed
- Easier to test

---

## Store Architecture

```
stores/
├── workspaceStore.ts    # Active citizen, workspace state
├── missionStore.ts      # Missions list, active mission
├── chatStore.ts         # Chat messages per citizen per mission
└── dodStore.ts          # DoD items and progress
```

---

## 1. WorkspaceStore

**Purpose:** Track which citizen workspace is active

```typescript
// stores/workspaceStore.ts
type WorkspaceStore = {
  activeCitizen: 'rafael' | 'sofia' | 'emma' | 'inna' | 'maya';
  setActiveCitizen: (citizen: string) => void;

  // Status indicators (● teal/blue/gray)
  citizenStatus: Record<string, 'waiting' | 'active' | 'complete'>;
  updateCitizenStatus: (citizen: string, status: string) => void;
};
```

**Usage:**
```typescript
const { activeCitizen, setActiveCitizen } = useWorkspaceStore();

// Switch workspace
setActiveCitizen('sofia');
```

**Implementation:** `scripts/mission-deck/frontend/stores/workspaceStore.ts.stub`
**Tests:** `frontend/src/__tests__/stores/workspaceStore.test.ts`

---

## 2. MissionStore

**Purpose:** Manage missions list and active mission

```typescript
// stores/missionStore.ts
type MissionStore = {
  missions: Mission[];                    // All missions for user
  activeMissionId: string | null;         // Currently selected mission
  activeMission: Mission | null;          // Full mission object

  fetchMissions: () => Promise<void>;
  setActiveMission: (id: string) => void;
  refreshMission: (id: string) => Promise<void>;
};
```

**Usage:**
```typescript
const { missions, activeMission, setActiveMission } = useMissionStore();

// Select mission
setActiveMission('47');

// Fetch missions on mount
useEffect(() => {
  fetchMissions();
}, []);
```

**Implementation:** `scripts/mission-deck/frontend/stores/missionStore.ts.stub`
**Tests:** `frontend/src/__tests__/stores/missionStore.test.ts`

---

## 3. ChatStore

**Purpose:** Manage chat messages per citizen per mission

```typescript
// stores/chatStore.ts
type ChatStore = {
  // { missionId: { citizen: [messages] } }
  messages: Record<string, Record<string, ChatMessage[]>>;

  sendMessage: (
    missionId: string,
    citizen: string,
    message: string
  ) => Promise<void>;

  loadHistory: (
    missionId: string,
    citizen: string
  ) => Promise<void>;

  clearHistory: (missionId: string, citizen: string) => void;
};

type ChatMessage = {
  id: string;
  sender: 'user' | 'citizen';
  message: string;
  code_blocks?: CodeBlock[];
  created_at: string;
};
```

**Usage:**
```typescript
const { messages, sendMessage } = useChatStore();

// Get messages for Rafael + Mission 47
const rafaelMessages = messages['47']?.['rafael'] || [];

// Send message
await sendMessage('47', 'rafael', 'How do I add inline buttons?');
```

**Implementation:** `scripts/mission-deck/frontend/stores/chatStore.ts.stub`
**Tests:** `frontend/src/__tests__/stores/chatStore.test.ts`

---

## 4. DODStore

**Purpose:** Manage DoD checklist items and progress

```typescript
// stores/dodStore.ts
type DODStore = {
  items: Record<string, DODItem[]>;       // { missionId: [items] }
  progress: Record<string, Progress>;     // { missionId: { completed, total } }

  loadItems: (missionId: string) => Promise<void>;
  toggleItem: (missionId: string, itemId: string) => Promise<void>;
  markAllComplete: (missionId: string) => Promise<void>;
  reset: (missionId: string) => Promise<void>;
};

type DODItem = {
  id: string;
  text: string;
  category: 'functional' | 'non-functional' | 'tests';
  completed: boolean;
  completed_at?: string;
};

type Progress = {
  completed: number;
  total: number;
};
```

**Usage:**
```typescript
const { items, progress, toggleItem } = useDODStore();

// Get DoD items for Mission 47
const dodItems = items['47'] || [];
const dodProgress = progress['47'] || { completed: 0, total: 0 };

// Toggle checkbox
await toggleItem('47', 'item-id-1');
```

**Implementation:** `scripts/mission-deck/frontend/stores/dodStore.ts.stub`
**Tests:** `frontend/src/__tests__/stores/dodStore.test.ts`

---

## State Initialization Flow

### 1. Page Load

```
User navigates to /deck/mission-47
  ↓
Page component mounts
  ↓
useEffect runs:
  - missionStore.fetchMissions()
  - missionStore.setActiveMission('47')
  - workspaceStore.setActiveCitizen('rafael')  // default
  ↓
Rafael workspace renders
  ↓
useEffect in RafaelWorkspace:
  - chatStore.loadHistory('47', 'rafael')
  ↓
Chat messages displayed
```

### 2. Workspace Switch

```
User clicks "Sofia" in CitizenSelector
  ↓
workspaceStore.setActiveCitizen('sofia')
  ↓
WorkspaceContainer unmounts RafaelWorkspace
  ↓
WorkspaceContainer mounts SofiaWorkspace
  ↓
useEffect in SofiaWorkspace:
  - dodStore.loadItems('47')
  - chatStore.loadHistory('47', 'sofia')
  ↓
DoD checklist + Sofia chat displayed
```

### 3. Mission Switch

```
User clicks Mission #48 in MissionSelector
  ↓
missionStore.setActiveMission('48')
  ↓
Active workspace re-renders with new missionId
  ↓
useEffect in active workspace:
  - Reload data for Mission 48
  - chatStore.loadHistory('48', activeCitizen)
  - dodStore.loadItems('48')  (if Sofia workspace)
```

---

## State Persistence

### LocalStorage

Persist certain state across page reloads:

```typescript
// workspaceStore: Save activeCitizen
const workspaceStore = create(
  persist(
    (set) => ({
      activeCitizen: 'rafael',
      setActiveCitizen: (citizen) => set({ activeCitizen: citizen }),
    }),
    { name: 'workspace-storage' }
  )
);
```

**What to persist:**
- ✅ activeCitizen (last workspace user was viewing)
- ❌ missions (fetch fresh on load)
- ❌ chat messages (fetch fresh on load)
- ❌ DoD items (fetch fresh on load)

---

## Store Testing Strategy

**Unit tests:**
```typescript
// stores/workspaceStore.test.ts
test('setActiveCitizen updates state', () => {
  const { result } = renderHook(() => useWorkspaceStore());

  act(() => {
    result.current.setActiveCitizen('sofia');
  });

  expect(result.current.activeCitizen).toBe('sofia');
});
```

**Integration tests:**
```typescript
// __tests__/integration/workspace-switching.test.tsx
test('switching workspace loads correct data', async () => {
  render(<DeckPage missionId="47" />);

  // Start in Rafael workspace
  expect(screen.getByText('GitHub Repository')).toBeInTheDocument();

  // Switch to Sofia
  fireEvent.click(screen.getByText('Sofia'));

  // Verify Sofia workspace loaded
  await waitFor(() => {
    expect(screen.getByText('Definition of Done')).toBeInTheDocument();
  });
});
```

---

## Related Documentation

**Previous:** [02_component_structure.md](./02_component_structure.md)
**Next:** [04_data_flows.md](./04_data_flows.md)

## Implementation Scripts

This document maps to:
- `scripts/mission-deck/frontend/stores/*.ts.stub` (all store files)

## Test Files

- `frontend/src/__tests__/stores/workspaceStore.test.ts`
- `frontend/src/__tests__/stores/missionStore.test.ts`
- `frontend/src/__tests__/stores/chatStore.test.ts`
- `frontend/src/__tests__/stores/dodStore.test.ts`

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
