# Architecture Overview - Mission Deck

**Part:** 1 of 7
**Created:** 2025-11-05
**Source:** ARCHITECTURE.md (simplified)

---

## System Purpose

Mission Deck transforms from a simple chat interface into **context-aware citizen workspaces**, where each AI citizen provides specialized tools for their role.

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
                               ↕ REST API
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Mission    │  │   Chat       │  │   DoD              │   │
│  │   API        │  │   API        │  │   API              │   │
│  │              │  │              │  │                    │   │
│  │ GET /missions│  │ POST /chat   │  │ PATCH /dod         │   │
│  │ GET /mission │  │ GET /messages│  │ GET /tests/latest  │   │
│  └──────────────┘  └──────────────┘  └────────────────────────┘   │
│                         ↕                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                          │   │
│  │  • missions                                               │   │
│  │  • dod_items                                              │   │
│  │  • chat_messages (per citizen per mission)                │   │
│  │  • test_runs                                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Week 1 MVP Scope

**MUST BUILD:**
- ✅ Rafael workspace: GitHub embed + Chat
- ✅ Sofia workspace: DoD checklist + Test results + Chat
- ✅ Citizen selector: Horizontal tabs

**Week 2:**
- Emma workspace (Upwork job feed)
- Inna workspace (doc editor)
- Maya workspace (client messages)

## Key Design Decisions

### 1. Context-Aware Workspaces

Each citizen provides a completely different UI:
- Rafael: GitHub view + Chat
- Sofia: DoD checklist + Test results + Chat
- Emma: Job feed + Chat (Week 2)

**Why:** Different roles need different tools. No "one-size-fits-all" tab interface.

### 2. Simplified Rafael Workspace

**What we're NOT building:**
- ❌ Code editor (Monaco) - developers use VS Code
- ❌ Terminal (xterm.js) - developers use their terminal
- ❌ File tree component - GitHub shows files

**Why:** Don't replicate VS Code in the browser. Augment existing developer workflow instead.

### 3. State Management: Zustand

Using Zustand instead of Redux:
- Simpler API (less boilerplate)
- Better TypeScript support
- Smaller bundle size (~1KB vs 3KB)

### 4. No WebSocket (Week 1)

Terminal and live test streaming require WebSocket. Not needed for Week 1 MVP.

## Related Documentation

**Next:** [02_component_structure.md](./02_component_structure.md) - Frontend component hierarchy
**See also:** [07_dependencies.md](./07_dependencies.md) - Full tech stack

## Implementation Scripts

This overview document maps to:
- `scripts/mission-deck/frontend/components/WorkspaceContainer.tsx.stub` - Main workspace router
- `scripts/mission-deck/frontend/components/CitizenSelector.tsx.stub` - Horizontal tabs

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
