# Component Structure - Mission Deck

**Part:** 2 of 7
**Created:** 2025-11-05
**Prerequisites:** [01_overview.md](./01_overview.md)

---

## File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout with auth
│   │   ├── page.tsx                        # Landing/login page
│   │   └── deck/
│   │       └── [missionId]/
│   │           └── page.tsx                # Main deck page
│   │
│   ├── components/
│   │   ├── MissionSelector.tsx             # Left panel: mission list
│   │   ├── CitizenSelector.tsx             # Horizontal tabs
│   │   │
│   │   ├── workspaces/                     # Citizen workspace components
│   │   │   ├── RafaelWorkspace.tsx         # Week 1 MVP
│   │   │   ├── SofiaWorkspace.tsx          # Week 1 MVP
│   │   │   ├── EmmaWorkspace.tsx           # Week 2
│   │   │   ├── InnaWorkspace.tsx           # Week 2
│   │   │   └── MayaWorkspace.tsx           # Week 2
│   │   │
│   │   └── shared/
│   │       ├── ChatPanel.tsx               # Reusable chat (all citizens)
│   │       ├── CodeBlock.tsx               # Syntax highlighting
│   │       ├── StatusIndicator.tsx         # ● dot (teal/blue/gray)
│   │       ├── DODChecklist.tsx            # DoD checklist
│   │       └── TestResults.tsx             # Test output display
│   │
│   ├── lib/
│   │   ├── api.ts                          # API client
│   │   └── types.ts                        # TypeScript types
│   │
│   └── hooks/
│       ├── useMission.ts                   # Fetch mission data
│       ├── useChat.ts                      # Send/receive chat
│       └── useDOD.ts                       # DoD checklist state
```

---

## Component Hierarchy

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
         │     ├─ GitHubView (GitHub embed/link)
         │     └─ ChatPanel (Rafael chat)
         │
         ├─ if (active === 'sofia'):
         │  └─ SofiaWorkspace
         │     ├─ DODChecklist (left)
         │     ├─ TestResults (right)
         │     └─ ChatPanel (Sofia chat)
         │
         ├─ if (active === 'emma'):  (Week 2)
         │  └─ EmmaWorkspace
         │     ├─ JobFeed (left)
         │     └─ ChatPanel (Emma chat)
         │
         ├─ if (active === 'inna'):  (Week 2)
         │  └─ InnaWorkspace
         │     ├─ DocTree (left)
         │     ├─ MarkdownEditor (middle)
         │     └─ ChatPanel (Inna chat)
         │
         └─ if (active === 'maya'):  (Week 2)
            └─ MayaWorkspace
               ├─ ClientMessages (left)
               ├─ StatusUpdateDraft (right)
               └─ ChatPanel (Maya chat)
```

---

## Key Components

### 1. MissionSelector

**Purpose:** Left panel showing all missions for current user

**Props:**
```typescript
type MissionSelectorProps = {
  missions: Mission[];
  activeMissionId: string | null;
  onSelectMission: (id: string) => void;
};
```

**Visual:**
```
┌─────────────┐
│  Missions   │
│  ─────      │
│             │
│  ● #47      │ ← Active (green dot)
│    Telegram │
│    $300     │
│    Nov 8    │
│             │
│  ○ #48      │ ← Not started (gray dot)
│    Landing  │
│    $450     │
│    Nov 10   │
└─────────────┘
```

**Implementation:** `scripts/mission-deck/frontend/components/MissionSelector.tsx.stub`
**Tests:** `frontend/src/__tests__/components/MissionSelector.test.tsx`

---

### 2. CitizenSelector

**Purpose:** Horizontal tabs showing workflow progression

**Props:**
```typescript
type CitizenSelectorProps = {
  activeCitizen: 'rafael' | 'sofia' | 'emma' | 'inna' | 'maya';
  onSelectCitizen: (citizen: string) => void;
};
```

**Visual:**
```
Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya
 ○         ○        ●         ○         ○
Scout   Specifier  Guide   Checker   Bridge
```

**Implementation:** `scripts/mission-deck/frontend/components/CitizenSelector.tsx.stub`
**Tests:** `frontend/src/__tests__/components/CitizenSelector.test.tsx`

---

### 3. RafaelWorkspace

**Purpose:** GitHub view + Chat for code implementation

**Props:**
```typescript
type RafaelWorkspaceProps = {
  missionId: string;
  githubUrl: string;
};
```

**Layout:**
```
┌─────────────────────────────────────────┐
│  GitHub Repository View                 │
│  [Open in GitHub] [Open in VS Code]    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Chat with Rafael                       │
└─────────────────────────────────────────┘
```

**Implementation:** `scripts/mission-deck/frontend/components/workspaces/RafaelWorkspace.tsx.stub`
**Tests:** `frontend/src/__tests__/components/workspaces/RafaelWorkspace.test.tsx`

---

### 4. SofiaWorkspace

**Purpose:** DoD checklist + Test results + Chat for QA

**Props:**
```typescript
type SofiaWorkspaceProps = {
  missionId: string;
};
```

**Layout:**
```
┌───────────────────┬──────────────────┐
│  DoD Checklist    │  Test Results    │
└───────────────────┴──────────────────┘
┌─────────────────────────────────────┐
│  Chat with Sofia                    │
└─────────────────────────────────────┘
```

**Implementation:** `scripts/mission-deck/frontend/components/workspaces/SofiaWorkspace.tsx.stub`
**Tests:** `frontend/src/__tests__/components/workspaces/SofiaWorkspace.test.tsx`

---

### 5. ChatPanel (Shared Component)

**Purpose:** Reusable chat component for all citizens

**Props:**
```typescript
type ChatPanelProps = {
  missionId: string;
  citizen: 'rafael' | 'sofia' | 'emma' | 'inna' | 'maya';
};
```

**Features:**
- Message history
- Code blocks with syntax highlighting
- [Copy Code] button
- [Ask Rafael to Fix] button (Sofia only)
- Auto-scroll to bottom

**Implementation:** `scripts/mission-deck/frontend/components/shared/ChatPanel.tsx.stub`
**Tests:** `frontend/src/__tests__/components/shared/ChatPanel.test.tsx`

---

### 6. DODChecklist (Shared Component)

**Purpose:** Display DoD items with checkboxes

**Props:**
```typescript
type DODChecklistProps = {
  missionId: string;
};
```

**Features:**
- 3 sections: Functional, Non-Functional, Tests
- Checkboxes (toggle state)
- Progress bar
- [Mark All Complete] [Reset] buttons

**Implementation:** `scripts/mission-deck/frontend/components/shared/DODChecklist.tsx.stub`
**Tests:** `frontend/src/__tests__/components/shared/DODChecklist.test.tsx`

---

### 7. TestResults (Shared Component)

**Purpose:** Display test output with pass/fail indicators

**Props:**
```typescript
type TestResultsProps = {
  missionId: string;
};
```

**Features:**
- Summary (X/Y passed)
- ✓ Passed tests (green)
- ✗ Failed tests (red) with error details
- Performance metrics
- [Re-run Tests] [View Logs] buttons

**Implementation:** `scripts/mission-deck/frontend/components/shared/TestResults.tsx.stub`
**Tests:** `frontend/src/__tests__/components/shared/TestResults.test.tsx`

---

## Component Communication

### Props Drilling vs State Management

**Props (preferred for simple data):**
- MissionSelector receives `missions` array from parent
- ChatPanel receives `missionId` and `citizen` from parent

**Zustand Store (for shared state):**
- `workspaceStore` - activeCitizen, citizenStatus
- `missionStore` - missions, activeMissionId
- `chatStore` - messages per citizen per mission
- `dodStore` - DoD items and progress

See: [03_state_management.md](./03_state_management.md)

---

## Styling Approach

**Tailwind CSS:**
- Utility-first CSS
- Dark theme tokens (from MECHANISM.md):
  - bg: `#0E1116`
  - surface: `#151A21`
  - text: `#E6EAF2`
  - accent: `#1EE5B8`

**Component Library:**
- shadcn/ui for base components (button, card, etc.)
- Custom components for domain-specific UI

---

## Related Documentation

**Previous:** [01_overview.md](./01_overview.md)
**Next:** [03_state_management.md](./03_state_management.md)

## Implementation Scripts

This document maps to all component stub files in:
- `scripts/mission-deck/frontend/components/*.tsx.stub`
- `scripts/mission-deck/frontend/components/workspaces/*.tsx.stub`
- `scripts/mission-deck/frontend/components/shared/*.tsx.stub`

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
