# Mission Deck - Frontend

**Internal developer dashboard for ScopeLock missions**

---

## Overview

Mission Deck is ScopeLock's internal dashboard where developers:
- See their assigned missions
- Switch between AI citizen workspaces (Emma, Inna, Rafael, Sofia, Maya)
- Review Rafael's generated code on GitHub
- Chat with Rafael for implementation guidance
- Track Definition of Done (DoD) checklist and test results with Sofia

**Week 1 MVP:** Rafael workspace (GitHub view + Chat) + Sofia workspace (DoD + Test results)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.3
- **State Management:** Zustand (Week 2, not used yet in Week 1)
- **API Calls:** Native fetch with mock data (Week 1)
- **Syntax Highlighting:** react-syntax-highlighter
- **Deployment:** Vercel

---

## Quick Start

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)

### Installation

```bash
# Install dependencies
npm install

# Create .env.local (Week 1: not needed, using mock data)
cp .env.example .env.local

# Start development server
npm run dev
```

### Access

Open http://localhost:3002 in your browser.

**Login (Week 1 Mock Auth):**
- **Email:** Any email (e.g., `dev@scopelock.ai`)
- **Password:** Any password (e.g., `password`)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Next.js 14 (App Router)                       │ │
│  │  ┌──────────┬──────────┬──────────┬──────────┐        │ │
│  │  │ Mission  │ Citizen  │ Rafael   │ Sofia    │        │ │
│  │  │ Selector │ Selector │ Workspace│ Workspace│        │ │
│  │  └────┬─────┴─────┬────┴────┬─────┴─────┬────┘        │ │
│  │       │           │         │           │              │ │
│  │       └───────────┴─────────┴───────────┘              │ │
│  │                      │                                  │ │
│  │                 API Client                              │ │
│  │            (lib/api.ts - mock data)                     │ │
│  └─────────────────────┼──────────────────────────────────┘ │
└─────────────────────────┼──────────────────────────────────┘
                          │
                     (Week 2: Real Backend)
```

---

## Features Implemented (Week 1 MVP)

### ✅ F1: User Authentication
- Login page at `/`
- Mock auth (any email/password works)
- Redirects to `/console` after login
- Logout button

### ✅ F2: Mission Selector (Left Panel)
- Fixed width 200px
- Shows all assigned missions
- Status indicators (● green = active, ● blue = qa, ○ gray = not started)
- Mission card displays: #, title, client, budget, deadline
- Click to switch missions
- Scrollable if >5 missions

### ✅ F3: Citizen Workspace Selector
- Horizontal tabs: Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya
- Each with role label (Scout, Specifier, Guide, Checker, Bridge)
- Status indicator (● active, ● complete, ○ waiting)
- Click any citizen → right panel switches workspace
- Active citizen highlighted in teal

### ✅ F4: Rafael Workspace
**Top panel: GitHub Repository View**
- Shows file tree (folders and files)
- Shows recent commits (last 5)
- File metadata (last modified time, commit message snippet)
- [Open in GitHub ↗] button → opens full repo in new tab

**Bottom panel: Chat with Rafael**
- Chat interface for asking questions
- Rafael responds (mock responses Week 1)
- Code blocks with syntax highlighting
- [Copy Code] button → copies code to clipboard
- Chat history persists

### ✅ F5: Sofia Workspace
**Left panel: DoD Checklist**
- Shows 3 sections: Functional, Non-Functional, Tests
- Checkboxes to toggle completed state
- Progress bar shows X/Y completed (e.g., "3/11 (27%)")
- Completed items show timestamp
- [Mark All Complete] [Reset] buttons

**Right panel: Test Results**
- Shows latest test run output
- ✓ = Passed tests (green)
- ✗ = Failed tests (red)
- Click failed test → shows error details
- Performance metrics (e.g., "Response time: 145ms (threshold: 200ms)")
- [Re-run Tests] [View Logs] buttons

---

## Project Structure

```
mission-deck-frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Login page
│   ├── globals.css             # Global styles + Tailwind
│   └── console/
│       └── page.tsx            # Console dashboard (main page)
├── components/
│   ├── MissionSelector.tsx     # Left panel mission list
│   ├── CitizenSelector.tsx     # Horizontal citizen tabs
│   ├── ChatInterface.tsx       # Chat UI (used in Rafael/Sofia workspaces)
│   ├── RafaelWorkspace.tsx     # GitHub view + Chat
│   └── SofiaWorkspace.tsx      # DoD checklist + Test results
├── lib/
│   └── api.ts                  # API client (mock data Week 1)
├── types/
│   └── index.ts                # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md                   # This file
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on http://localhost:3002

# Build
npm run build        # Build production bundle

# Production
npm start            # Start production server

# Testing (Week 2)
npm test             # Run Vitest tests

# Linting
npm run lint         # Run ESLint
```

---

## Environment Variables

**Week 1 (Mock Data):**
No environment variables needed. API client uses mock data.

**Week 2 (Real Backend):**
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://api-scopelock.mindprotocol.ai/deck
```

---

## Mock Data (Week 1)

**Location:** `lib/api.ts`

**Mock data includes:**
- 3 missions (IDs: 47, 48, 49)
- Chat messages for Mission #47 (Telegram Notifier)
- DoD checklist for Mission #47 (7 items)
- GitHub files and commits for Mission #47
- Test results for Mission #47 (3 tests)
- Performance metrics for Mission #47 (2 metrics)

**To modify mock data:** Edit `lib/api.ts` constants at the top of the file.

---

## Color Palette (ScopeLock Dark Theme)

From `tailwind.config.ts`:

```
background: #0E1116    (darkest background)
surface: #151A21       (panels, cards)
surface-hover: #1A2028 (hover state)
text: #E6EAF2          (primary text)
muted: #9AA3AE         (secondary text)
accent: #1EE5B8        (teal - primary accent)
accent-2: #64A8FF      (blue - secondary accent)
success: #5CE27E       (green - success state)
warning: #FFC857       (yellow - warning state)
danger: #FF5D5D        (red - error state)
border: #2A3139        (borders, dividers)
```

---

## Design Principles

1. **Dark theme:** Background #0E1116, Surface #151A21
2. **Fixed width left panel:** 200px for Mission Selector
3. **Horizontal citizen tabs:** Arrow separators (──→) show workflow progression
4. **Status indicators:** ● (filled circle) for status, different colors per state
5. **Syntax highlighting:** Code blocks use vscDarkPlus theme
6. **Copy-paste ready:** [Copy Code] button for all code blocks
7. **Responsive:** Desktop-first (mobile Week 2)

---

## Deployment

### Vercel (Production)

```bash
# 1. Connect GitHub repo to Vercel
# 2. Configure project:
#    - Framework: Next.js
#    - Build command: npm run build
#    - Output directory: .next
#    - Root directory: mission-deck-frontend

# 3. Set environment variables (if Week 2 backend ready):
#    - NEXT_PUBLIC_API_URL: https://api-scopelock.mindprotocol.ai/deck

# 4. Deploy
vercel --prod
```

**Domain:** `scopelock.mindprotocol.ai/deck` (via rewrite from main site)

---

## Week 2 Features (Not Implemented Yet)

- ❌ Emma workspace (Upwork job feed)
- ❌ Inna workspace (Specifications editor)
- ❌ Maya workspace (Client communication)
- ❌ Real backend integration (FastAPI + FalkorDB)
- ❌ TanStack Query for API caching
- ❌ Mobile responsive design
- ❌ Real GitHub API integration
- ❌ Real test runner integration

---

## Verification Before Handoff

**Prerequisites:**
```bash
npm install
```

**Verification steps:**

✅ **Frontend runs locally:**
```bash
npm run dev
# Open http://localhost:3002
# Login with any email/password
# Should see console with 3 mock missions
```

✅ **Mission selector shows 3 missions:**
- Mission #47: Telegram Notifier
- Mission #48: Landing Page
- Mission #49: Dashboard Analytics

✅ **Citizen selector shows 5 citizens:**
- Emma (Scout) ──→ Inna (Specifier) ──→ Rafael (Guide) ──→ Sofia (Checker) ──→ Maya (Bridge)

✅ **Clicking Rafael shows 2-panel layout:**
- Top: GitHub repository view (file tree, commits, [Open in GitHub ↗])
- Bottom: Chat with Rafael

✅ **Clicking Sofia shows 2-panel layout:**
- Left: DoD checklist (Functional, Non-Functional, Tests sections)
- Right: Test results placeholder

✅ **TypeScript compiles:**
```bash
npm run build
# Should complete without errors
```

---

## Troubleshooting

**Issue:** `npm install` fails
- **Fix:** Check Node.js version (need 18+): `node --version`

**Issue:** Port 3002 already in use
- **Fix:** Kill process on port 3002: `lsof -ti:3002 | xargs kill`
- Or change port in package.json dev script: `next dev -p 3003`

**Issue:** TypeScript errors in components
- **Fix:** Run `npm install` to ensure all dependencies installed
- Check tsconfig.json includes all TypeScript files

**Issue:** Tailwind styles not applying
- **Fix:** Ensure globals.css imported in app/layout.tsx
- Check tailwind.config.ts content paths match your file structure

---

## Support

**Documentation:**
- Specifications: `/docs/missions/mission-deck/`
- AC.md: Acceptance criteria
- MECHANISM.md: Architecture & tech stack
- ALGORITHM.md: Implementation steps

**Citizens:**
- **Rafael:** Implementation code generation & debugging (you're reading his work!)
- **Sofia:** Quality verification & testing
- **Inna:** Specifications & documentation

**Contact:**
- Repository: https://github.com/mind-protocol/scopelock
- Issues: Report via GitHub Issues

---

**Rafael Silva** — Code Generation, Mentorship & DevOps Support
ScopeLock Internal Tools
2025-11-06
