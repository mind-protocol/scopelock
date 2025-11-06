# Documentation → Script Mapping

**Created:** 2025-11-05
**Purpose:** Many-to-one mapping of documentation files to implementation scripts

---

## Overview

Architecture documentation has been broken into 7 focused files. Each implementation script references the relevant documentation and test files.

**Documentation Structure:**
```
docs/missions/mission-deck/architecture/
├── 01_overview.md              # High-level architecture
├── 02_component_structure.md   # Frontend component hierarchy
├── 03_state_management.md      # Zustand stores
├── 04_data_flows.md            # Data flow diagrams
├── 05_api_design.md            # Backend API endpoints
├── 06_database_schema.md       # Database schema
└── 07_dependencies.md          # Tech stack
```

**Script Structure:**
```
scripts/mission-deck/
├── frontend/
│   ├── components/
│   │   ├── MissionSelector.tsx.stub
│   │   ├── CitizenSelector.tsx.stub
│   │   ├── workspaces/
│   │   │   ├── RafaelWorkspace.tsx.stub
│   │   │   └── SofiaWorkspace.tsx.stub
│   │   └── shared/
│   │       ├── ChatPanel.tsx.stub
│   │       ├── DODChecklist.tsx.stub
│   │       └── TestResults.tsx.stub
│   └── stores/
│       ├── workspaceStore.ts.stub
│       ├── missionStore.ts.stub
│       ├── chatStore.ts.stub
│       └── dodStore.ts.stub
└── backend/
    ├── api/
    │   ├── missions.py.stub
    │   ├── chat.py.stub
    │   ├── dod.py.stub
    │   └── tests.py.stub
    └── migrations/
        ├── 001_add_github_url.sql.stub
        ├── 002_add_citizen_to_chat.sql.stub
        ├── 003_create_test_runs.sql.stub
        └── 004_seed_test_data.sql.stub
```

---

## Mapping: Frontend Components

### MissionSelector.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "1. MissionSelector")
- Secondary: `01_overview.md`, `03_state_management.md` (missionStore), `04_data_flows.md` (Mission Selection Flow)

**Tests:**
- Unit: `frontend/src/__tests__/components/MissionSelector.test.tsx`
- Integration: `frontend/src/__tests__/integration/mission-switch.test.tsx`
- AC: `docs/missions/mission-deck/AC.md` (F2: Mission Selector)
- Validation: `docs/missions/mission-deck/VALIDATION.md` (F2 tests)

---

### CitizenSelector.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "2. CitizenSelector")
- Secondary: `01_overview.md`, `03_state_management.md` (workspaceStore), `04_data_flows.md` (Workspace Switch Flow)

**Tests:**
- Unit: `frontend/src/__tests__/components/CitizenSelector.test.tsx`
- Integration: `frontend/src/__tests__/integration/workspace-switch.test.tsx`
- AC: `docs/missions/mission-deck/AC.md` (F3: Citizen Workspace Selector)

---

### RafaelWorkspace.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "3. RafaelWorkspace")
- Secondary: `01_overview.md`, `04_data_flows.md` (Chat with Rafael Flow)

**Tests:**
- Unit: `frontend/src/__tests__/components/workspaces/RafaelWorkspace.test.tsx`
- Integration: `frontend/src/__tests__/integration/rafael-workflow.test.tsx`
- AC: `docs/missions/mission-deck/AC.md` (F4: Rafael Workspace)

---

### SofiaWorkspace.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "4. SofiaWorkspace")
- Secondary: `01_overview.md`, `04_data_flows.md` (DoD Checkbox Toggle Flow, Sofia → Rafael Handoff)

**Tests:**
- Unit: `frontend/src/__tests__/components/workspaces/SofiaWorkspace.test.tsx`
- Integration: `frontend/src/__tests__/integration/sofia-workflow.test.tsx`, `sofia-rafael-handoff.test.tsx`
- AC: `docs/missions/mission-deck/AC.md` (F5: Sofia Workspace)

---

### ChatPanel.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "5. ChatPanel")
- Secondary: `03_state_management.md` (chatStore), `04_data_flows.md` (Chat with Rafael Flow), `05_api_design.md` (Chat API)

**Tests:**
- Unit: `frontend/src/__tests__/components/shared/ChatPanel.test.tsx`
- Integration: `frontend/src/__tests__/integration/chat-flow.test.tsx`
- Backend: `backend/tests/test_chat.py`
- AC: `docs/missions/mission-deck/AC.md` (F4: Rafael Workspace - Chat)

---

### DODChecklist.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "6. DODChecklist")
- Secondary: `03_state_management.md` (dodStore), `04_data_flows.md` (DoD Checkbox Toggle Flow), `05_api_design.md` (DoD API)

**Tests:**
- Unit: `frontend/src/__tests__/components/shared/DODChecklist.test.tsx`
- Integration: `frontend/src/__tests__/integration/dod-workflow.test.tsx`
- Backend: `backend/tests/test_dod.py`
- AC: `docs/missions/mission-deck/AC.md` (F5: Sofia Workspace - DoD Checklist)

---

### TestResults.tsx.stub

**Documentation:**
- Primary: `02_component_structure.md` (Section: "7. TestResults")
- Secondary: `05_api_design.md` (Tests API)

**Tests:**
- Unit: `frontend/src/__tests__/components/shared/TestResults.test.tsx`
- Backend: `backend/tests/test_tests.py`
- AC: `docs/missions/mission-deck/AC.md` (F5: Sofia Workspace - Test Results)

---

## Mapping: Frontend Stores

### workspaceStore.ts.stub

**Documentation:**
- Primary: `03_state_management.md` (Section: "1. WorkspaceStore")
- Secondary: `01_overview.md`, `04_data_flows.md` (Workspace Switch Flow)

**Tests:**
- Unit: `frontend/src/__tests__/stores/workspaceStore.test.ts`
- Integration: `frontend/src/__tests__/integration/workspace-switch.test.tsx`

---

### missionStore.ts.stub

**Documentation:**
- Primary: `03_state_management.md` (Section: "2. MissionStore")
- Secondary: `04_data_flows.md` (Mission Selection Flow), `05_api_design.md` (Missions API)

**Tests:**
- Unit: `frontend/src/__tests__/stores/missionStore.test.ts`
- Integration: `frontend/src/__tests__/integration/mission-switch.test.tsx`
- Backend: `backend/tests/test_missions.py`

---

### chatStore.ts.stub

**Documentation:**
- Primary: `03_state_management.md` (Section: "3. ChatStore")
- Secondary: `04_data_flows.md` (Chat with Rafael Flow), `05_api_design.md` (Chat API)

**Tests:**
- Unit: `frontend/src/__tests__/stores/chatStore.test.ts`
- Integration: `frontend/src/__tests__/integration/chat-flow.test.tsx`
- Backend: `backend/tests/test_chat.py`

---

### dodStore.ts.stub

**Documentation:**
- Primary: `03_state_management.md` (Section: "4. DODStore")
- Secondary: `04_data_flows.md` (DoD Checkbox Toggle Flow), `05_api_design.md` (DoD API)

**Tests:**
- Unit: `frontend/src/__tests__/stores/dodStore.test.ts`
- Integration: `frontend/src/__tests__/integration/dod-workflow.test.tsx`
- Backend: `backend/tests/test_dod.py`

---

## Mapping: Backend API

### missions.py.stub

**Documentation:**
- Primary: `05_api_design.md` (Section: "Missions API")
- Secondary: `06_database_schema.md` (missions table), `04_data_flows.md` (Mission Selection Flow)

**Tests:**
- Unit: `backend/tests/test_missions.py`
- AC: `docs/missions/mission-deck/AC.md` (F2: Mission Selector)
- Validation: `docs/missions/mission-deck/VALIDATION.md` (F2 tests)
- Security: `backend/tests/test_security.py` (S4: Authorization boundaries)

---

### chat.py.stub

**Documentation:**
- Primary: `05_api_design.md` (Section: "Chat API")
- Secondary: `06_database_schema.md` (chat_messages table), `04_data_flows.md` (Chat with Rafael Flow)

**Tests:**
- Unit: `backend/tests/test_chat.py`
- AC: `docs/missions/mission-deck/AC.md` (F4: Rafael Workspace - Chat)
- Validation: `docs/missions/mission-deck/VALIDATION.md` (F3 tests)
- Security: `backend/tests/test_security.py` (S6: Chat authorization, S7: XSS prevention)
- Error Handling: `backend/tests/test_error_handling.py` (E1: Rafael API failure)

---

### dod.py.stub

**Documentation:**
- Primary: `05_api_design.md` (Section: "DoD API")
- Secondary: `06_database_schema.md` (dod_items table), `04_data_flows.md` (DoD Checkbox Toggle Flow)

**Tests:**
- Unit: `backend/tests/test_dod.py`
- AC: `docs/missions/mission-deck/AC.md` (F5: Sofia Workspace - DoD Checklist)
- Validation: `docs/missions/mission-deck/VALIDATION.md` (F4 tests)
- Security: `backend/tests/test_security.py` (S5: DoD authorization)
- Error Handling: `backend/tests/test_error_handling.py` (E3: Race conditions)

---

### tests.py.stub

**Documentation:**
- Primary: `05_api_design.md` (Section: "Tests API")
- Secondary: `06_database_schema.md` (test_runs table)

**Tests:**
- Unit: `backend/tests/test_tests.py`
- AC: `docs/missions/mission-deck/AC.md` (F5: Sofia Workspace - Test Results)

---

## Mapping: Database Migrations

### 001_add_github_url.sql.stub

**Documentation:**
- Primary: `06_database_schema.md` (Section: "1. missions (Updated)")
- Secondary: `05_api_design.md` (Missions API)

**Tests:**
- Migration test: `backend/tests/test_migrations.py` (test_001_add_github_url)

---

### 002_add_citizen_to_chat.sql.stub

**Documentation:**
- Primary: `06_database_schema.md` (Section: "3. chat_messages (Updated)")
- Secondary: `05_api_design.md` (Chat API)

**Tests:**
- Migration test: `backend/tests/test_migrations.py` (test_002_add_citizen_column)
- Data integrity: `backend/tests/test_chat.py` (test_chat_citizen_filtering)

---

### 003_create_test_runs.sql.stub

**Documentation:**
- Primary: `06_database_schema.md` (Section: "4. test_runs (New Table)")
- Secondary: `05_api_design.md` (Tests API)

**Tests:**
- Migration test: `backend/tests/test_migrations.py` (test_003_create_test_runs)
- API test: `backend/tests/test_tests.py` (test_get_latest_test_run)

---

### 004_seed_test_data.sql.stub

**Documentation:**
- Primary: `06_database_schema.md` (Section: "Seed Data")
- Secondary: All docs (uses all tables)

**Tests:**
- Seed verification: `backend/tests/test_seed_data.py` (verify_seed_data_exists)

---

## Cross-Reference Matrix

| Script File | Primary Docs | Secondary Docs | Test Files | AC Section |
|------------|--------------|----------------|-----------|-----------|
| **Frontend Components** |
| MissionSelector.tsx.stub | 02 | 01, 03, 04 | MissionSelector.test.tsx, mission-switch.test.tsx | F2 |
| CitizenSelector.tsx.stub | 02 | 01, 03, 04 | CitizenSelector.test.tsx, workspace-switch.test.tsx | F3 |
| RafaelWorkspace.tsx.stub | 02 | 01, 04 | RafaelWorkspace.test.tsx, rafael-workflow.test.tsx | F4 |
| SofiaWorkspace.tsx.stub | 02 | 01, 04 | SofiaWorkspace.test.tsx, sofia-workflow.test.tsx, sofia-rafael-handoff.test.tsx | F5 |
| ChatPanel.tsx.stub | 02 | 03, 04, 05 | ChatPanel.test.tsx, chat-flow.test.tsx, test_chat.py | F4 |
| DODChecklist.tsx.stub | 02 | 03, 04, 05 | DODChecklist.test.tsx, dod-workflow.test.tsx, test_dod.py | F5 |
| TestResults.tsx.stub | 02 | 05 | TestResults.test.tsx, test_tests.py | F5 |
| **Frontend Stores** |
| workspaceStore.ts.stub | 03 | 01, 04 | workspaceStore.test.ts, workspace-switch.test.tsx | F3 |
| missionStore.ts.stub | 03 | 04, 05 | missionStore.test.ts, mission-switch.test.tsx, test_missions.py | F2 |
| chatStore.ts.stub | 03 | 04, 05 | chatStore.test.ts, chat-flow.test.tsx, test_chat.py | F4 |
| dodStore.ts.stub | 03 | 04, 05 | dodStore.test.ts, dod-workflow.test.tsx, test_dod.py | F5 |
| **Backend API** |
| missions.py.stub | 05 | 04, 06 | test_missions.py, test_security.py (S4) | F2 |
| chat.py.stub | 05 | 04, 06 | test_chat.py, test_security.py (S6, S7), test_error_handling.py (E1) | F4 |
| dod.py.stub | 05 | 04, 06 | test_dod.py, test_security.py (S5), test_error_handling.py (E3) | F5 |
| tests.py.stub | 05 | 06 | test_tests.py | F5 |
| **Migrations** |
| 001_add_github_url.sql.stub | 06 | 05 | test_migrations.py (test_001) | F4 |
| 002_add_citizen_to_chat.sql.stub | 06 | 05 | test_migrations.py (test_002), test_chat.py | F4 |
| 003_create_test_runs.sql.stub | 06 | 05 | test_migrations.py (test_003), test_tests.py | F5 |
| 004_seed_test_data.sql.stub | 06 | All | test_seed_data.py | All |

---

## Usage

**For Developers:**
1. Start with documentation (e.g., `02_component_structure.md`)
2. Find corresponding stub file (e.g., `MissionSelector.tsx.stub`)
3. Stub file header lists all relevant docs and tests
4. Implement following stub structure
5. Run associated tests to verify

**For Reviewers:**
1. Check stub file references match this mapping
2. Verify tests cover all documented behavior
3. Ensure AC criteria are met

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
