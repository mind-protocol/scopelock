# Mission Deck - Citizen Workspace Specifications

**Purpose:** Define what each citizen's workspace shows and how it works
**Created:** 2025-11-05

---

## Interface Layout

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  [ScopeLock] Mission Deck                              [@person1] [Settings]  │
├─────────────┬─────────────────────────────────────────────────────────────────┤
│             │                                                                  │
│  Missions   │  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                   │
│  ─────      │   ○         ○        ●         ○         ○                      │
│             │  Scout   Specifier  Guide   Checker   Bridge                    │
│  ● #47      │  ──────────────────────────────────────────────────────────────│
│    Telegram │                                                                  │
│    $300     │  [RAFAEL'S WORKSPACE SHOWS HERE]                                │
│    Nov 8    │  • Code editor                                                  │
│             │  • File tree                                                    │
│  ○ #48      │  • Terminal                                                     │
│    Landing  │  • Chat with Rafael                                             │
│    $450     │                                                                  │
│    Nov 10   │                                                                  │
│             │                                                                  │
└─────────────┴─────────────────────────────────────────────────────────────────┘
```

**Key concept:** Click different citizen → Right panel completely changes to show that citizen's workspace.

---

## Citizen 1: Emma "The Scout" Workspace

### What Shows When You Click Emma

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                                 │
│   ●         ○        ○         ○         ○                                    │
│  ──────────────────────────────────────────────────────────────────────────────│
│                                                                                │
│  Emma's Workspace: Job Discovery & Proposal Drafting                          │
│                                                                                │
│  ┌─── Upwork Jobs (Embedded Feed) ──────────────┬─── Chat with Emma ───────┐│
│  │                                                │                          ││
│  │  🔍 [Search: "fastapi telegram bot"]          │  Emma: Found 3 promising ││
│  │                                                │  jobs matching our stack││
│  │  ┌────────────────────────────────────────┐  │                          ││
│  │  │ 💼 Build Telegram Bot with FastAPI    │  │  You: Analyze Job #1     ││
│  │  │ Budget: $300-500 | Fixed Price         │  │                          ││
│  │  │ Posted: 2h ago | 5 proposals           │  │  Emma: Analyzing...      ││
│  │  │                                         │  │                          ││
│  │  │ Looking for a developer to build...    │  │  ✅ STRONG GO            ││
│  │  │                                         │  │  • Client type: Process- ││
│  │  │ [Analyze Job] [Draft Proposal]         │  │    skeptical            ││
│  │  └────────────────────────────────────────┘  │  • Stack match: 100%     ││
│  │                                                │  • Budget: $400 (good)   ││
│  │  ┌────────────────────────────────────────┐  │  • Competition: Low      ││
│  │  │ 💼 API Integration + Dashboard         │  │                          ││
│  │  │ Budget: $800-1200 | Fixed Price        │  │  [View Full Analysis]   ││
│  │  │ Posted: 5h ago | 12 proposals          │  │  [Draft Proposal]       ││
│  │  │                                         │  │                          ││
│  │  │ Need someone to integrate...            │  │                          ││
│  │  │                                         │  │                          ││
│  │  │ [Analyze Job] [Draft Proposal]         │  │                          ││
│  │  └────────────────────────────────────────┘  │                          ││
│  │                                                │                          ││
│  │  [Load More Jobs]                             │                          ││
│  │                                                │                          ││
│  └────────────────────────────────────────────────┴──────────────────────────┘│
│                                                                                │
│  Recent Proposals (3)                                                          │
│  • Job #123: Telegram Bot - SENT (awaiting response)                          │
│  • Job #124: Dashboard - DRAFT (needs review)                                 │
│  • Job #125: API Fix - DECLINED (budget too low)                              │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Features

**Left Panel: Upwork Job Feed**
- **Option A (Week 1):** Embedded iframe of Upwork search results (if Upwork allows)
- **Option B (Week 1):** Scraped/parsed job list via Upwork RSS or API
- **Search bar:** Filter by keywords, budget range, posted time
- **Each job card shows:**
  - Title, budget, posted time, proposal count
  - Brief description (first 100 chars)
  - [Analyze Job] button → Emma analyzes client type, stack match, competition
  - [Draft Proposal] button → Emma drafts custom proposal

**Right Panel: Chat with Emma**
- Emma provides analysis results
- Shows STRONG GO / QUALIFIED MAYBE / HARD NO verdict
- Explains reasoning (client type, stack match, budget fit)
- Drafts proposal when requested

**Bottom: Recent Proposals**
- List of last 5 proposals
- Status: DRAFT / SENT / WON / DECLINED

---

## Citizen 2: Inna "The Specifier" Workspace

### What Shows When You Click Inna

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                                 │
│   ○         ●        ○         ○         ○                                    │
│  ──────────────────────────────────────────────────────────────────────────────│
│                                                                                │
│  Inna's Workspace: Specification & Documentation                              │
│                                                                                │
│  ┌─── Documentation Tree ───────┬─── Editor ──────────────────────────────┐ │
│  │                               │                                          │ │
│  │  Mission #47: Telegram Bot    │  # AC.md: Telegram Notifier             │ │
│  │  ├─ PATTERN.md        ✓       │                                          │ │
│  │  ├─ AC.md             ✓       │  ## Functional Criteria                 │ │
│  │  ├─ VALIDATION.md     ✓       │                                          │ │
│  │  ├─ MECHANISM.md      ✓       │  ### F1: Send Text Messages             │ │
│  │  ├─ ALGORITHM.md      ✓       │  **Given:** Bot is authenticated        │ │
│  │  ├─ GUIDE.md          ○       │  **When:** User sends /start            │ │
│  │  └─ DOD.md            ○       │  **Then:** Bot responds with welcome    │ │
│  │                               │                                          │ │
│  │  [New Document]               │  **Acceptance:**                         │ │
│  │  [Generate DoD from AC]       │  - [ ] Bot sends text messages          │ │
│  │                               │  - [ ] Response time <2s                │ │
│  │                               │                                          │ │
│  │                               │  ### F2: Inline Buttons                  │ │
│  │                               │  **Given:** Bot receives command         │ │
│  │                               │  **When:** User clicks button            │ │
│  │                               │  **Then:** Callback triggered           │ │
│  │                               │                                          │ │
│  │                               │  [Save] [Preview] [Generate DoD]        │ │
│  └───────────────────────────────┴──────────────────────────────────────────┘ │
│                                                                                │
│  Chat with Inna                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Inna: AC.md is complete. Ready to lock scope?                          │  │
│  │                                                                         │  │
│  │ You: Yes, lock it.                                                      │  │
│  │                                                                         │  │
│  │ Inna: Scope locked. Generated DoD checklist with 11 items.             │  │
│  │ [View DOD.md]                                                           │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Features

**Left Panel: Documentation Tree**
- Shows 6-level hierarchy (PATTERN → GUIDE → DOD)
- ✓ = Complete, ○ = Not started
- Click file → Opens in editor
- [New Document] → Create new doc
- [Generate DoD from AC] → Inna auto-generates DoD checklist

**Right Panel (Top): Markdown Editor**
- Full markdown editor (Monaco Editor or similar)
- Syntax highlighting
- Live preview toggle
- [Save] [Preview] [Generate DoD] buttons

**Right Panel (Bottom): Chat with Inna**
- Ask questions about specs
- Request clarifications
- Inna explains AC criteria, generates DoD

---

## Citizen 3: Rafael "The Guide" Workspace (DEFAULT)

### What Shows When You Click Rafael

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                                 │
│   ○         ○        ●         ○         ○                                    │
│  ──────────────────────────────────────────────────────────────────────────────│
│                                                                                │
│  Rafael's Workspace: Code Generation & Implementation Guidance                │
│                                                                                │
│  ┌─── GitHub Repository View ────────────────────────────────────────────┐  │
│  │                                                                         │  │
│  │  nlr-ai/mission-47-telegram-bot              [Open in GitHub ↗]        │  │
│  │  ────────────────────────────────────────────────────────────────────  │  │
│  │                                                                         │  │
│  │  📁 src/                                                                │  │
│  │    📄 bot.py              from telegram import Bot...       3h ago     │  │
│  │    📄 main.py             FastAPI application entry...      3h ago     │  │
│  │    📄 handlers.py         Message and callback handlers     2h ago     │  │
│  │                                                                         │  │
│  │  📁 tests/                                                              │  │
│  │    📄 test_bot.py         Test bot message sending          1h ago     │  │
│  │    📄 test_handlers.py    Test callback handlers            1h ago     │  │
│  │                                                                         │  │
│  │  📄 .env.example          Environment variables template    4h ago     │  │
│  │  📄 requirements.txt      python-telegram-bot==20.7         4h ago     │  │
│  │  📄 README.md             Setup and deployment guide        3h ago     │  │
│  │                                                                         │  │
│  │  Recent commits (3)                                                     │  │
│  │  ● feat: add inline button handlers               Rafael   1h ago     │  │
│  │  ● fix: callback error handling                   Rafael   2h ago     │  │
│  │  ● initial: telegram bot structure                Rafael   4h ago     │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Chat with Rafael                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ You: How do I add inline buttons?                                       │  │
│  │                                                                         │  │
│  │ Rafael: I've generated the inline button code and pushed it to GitHub. │  │
│  │                                                                         │  │
│  │ ```python                                                               │  │
│  │ from telegram import InlineKeyboardButton, InlineKeyboardMarkup        │  │
│  │                                                                         │  │
│  │ keyboard = [[                                                           │  │
│  │     InlineKeyboardButton("✅ Approve", callback_data='approve'),       │  │
│  │     InlineKeyboardButton("❌ Reject", callback_data='reject')          │  │
│  │ ]]                                                                      │  │
│  │ reply_markup = InlineKeyboardMarkup(keyboard)                           │  │
│  │ await update.message.reply_text("Choose:", reply_markup=reply_markup)  │  │
│  │ ```                                                                     │  │
│  │                                                                         │  │
│  │ Updated file: src/handlers.py (see GitHub view above)                  │  │
│  │                                                                         │  │
│  │ Next steps:                                                             │  │
│  │ 1. Pull latest changes: `git pull origin main`                         │  │
│  │ 2. Test locally: `python src/bot.py`                                   │  │
│  │ 3. Deploy to Render when ready                                         │  │
│  │                                                                         │  │
│  │ [Copy Code] [View Full File on GitHub] [Ask Follow-up]                 │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Features

**Top Panel: GitHub Repository View**
- **Read-only display** of repository structure and files
- Shows file tree with folders and files
- Recent commits list (last 5)
- File preview (click file name → shows snippet or link to GitHub)
- [Open in GitHub ↗] button → Opens full GitHub repo in new tab
- **Why read-only:** Developers edit code locally in their IDE, not in browser
- **Purpose:** Quick reference to see what Rafael generated

**Bottom Panel: Chat with Rafael**
- Rafael generates complete implementation code
- Code is automatically committed to GitHub repository
- Rafael provides copy-paste commands for local development
- [Copy Code] → Copy code snippet to clipboard
- [View Full File on GitHub] → Direct link to file on GitHub
- [Ask Follow-up] → Ask clarifying questions about implementation

**Key Insight:**
- This is NOT an IDE - it's a **code review and guidance interface**
- Developers code in VS Code/PyCharm locally
- Rafael generates code and pushes to GitHub
- Developers pull changes, test locally, deploy
- GitHub view shows what Rafael generated (audit trail)

---

## Citizen 4: Sofia "The Checker" Workspace

### What Shows When You Click Sofia

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                                 │
│   ○         ○        ○         ●         ○                                    │
│  ──────────────────────────────────────────────────────────────────────────────│
│                                                                                │
│  Sofia's Workspace: Quality Assurance & Verification                          │
│                                                                                │
│  ┌─── DoD Checklist ──────────────────┬─── Test Results ─────────────────┐  │
│  │                                     │                                   │  │
│  │  Mission #47: Telegram Notifier     │  Functional Tests: 8/10 passed   │  │
│  │                                     │                                   │  │
│  │  Functional (6/8)                   │  ✓ test_send_text_message        │  │
│  │  ☑ Bot sends text messages          │  ✓ test_inline_buttons           │  │
│  │  ☑ Bot sends inline buttons         │  ✗ test_callback_handler         │  │
│  │  ☑ Callback triggers correctly      │    Expected: 200, Got: 500       │  │
│  │  ☐ Bot edits messages               │    Error: KeyError 'callback_d...'│  │
│  │                                     │  ✗ test_error_handling           │  │
│  │  Non-Functional (2/3)               │    Timeout after 5s               │  │
│  │  ☑ Deployed to Render               │                                   │  │
│  │  ☑ Health check responds            │  Performance Tests: 2/3 passed   │  │
│  │  ☐ Response time <200ms (450ms)     │  ✓ Health check <200ms (145ms)   │  │
│  │                                     │  ✓ Message send <2s (1.2s)       │  │
│  │  Tests (1/2)                        │  ✗ Database query <100ms (350ms) │  │
│  │  ☑ Manual test: Send message        │                                   │  │
│  │  ☐ Manual test: Click button        │  [Re-run Tests] [View Logs]      │  │
│  │                                     │                                   │  │
│  │  Progress: 9/13 (69%)               │                                   │  │
│  │  ████████████░░░░░░░                │                                   │  │
│  │                                     │                                   │  │
│  │  [Mark All Complete] [Reset]        │                                   │  │
│  └─────────────────────────────────────┴───────────────────────────────────┘  │
│                                                                                │
│  Chat with Sofia                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Sofia: Found 2 failing tests and 1 performance issue.                  │  │
│  │                                                                         │  │
│  │ Issues:                                                                 │  │
│  │ 1. Callback handler error (line 47: KeyError 'callback_data')          │  │
│  │ 2. Database query slow (350ms, threshold: 100ms)                       │  │
│  │                                                                         │  │
│  │ Recommendations:                                                        │  │
│  │ 1. Add error handling for missing callback_data                        │  │
│  │ 2. Add database index on `user_id` column                              │  │
│  │                                                                         │  │
│  │ [Ask Rafael to Fix] [Mark as Known Issue]                              │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Features

**Left Panel: DoD Checklist**
- Shows DoD items from Inna's specs
- ☑ = Checked, ☐ = Unchecked
- Click checkbox → Toggle state
- Shows performance metrics (actual vs threshold)
- Progress bar
- [Mark All Complete] → Ready for delivery
- [Reset] → Uncheck all

**Right Panel: Test Results**
- Shows test output (pytest, Playwright, etc.)
- ✓ = Passed, ✗ = Failed
- Click failed test → Shows error details
- [Re-run Tests] → Runs tests again
- [View Logs] → Shows full test logs

**Bottom: Chat with Sofia**
- Sofia analyzes test failures
- Provides specific fix recommendations
- [Ask Rafael to Fix] → Creates task for Rafael, switches to Rafael workspace
- [Mark as Known Issue] → Documents issue, doesn't block delivery

---

## Citizen 5: Maya "The Bridge" Workspace

### What Shows When You Click Maya

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Emma ──→ Inna ──→ Rafael ──→ Sofia ──→ Maya                                 │
│   ○         ○        ○         ○         ●                                    │
│  ──────────────────────────────────────────────────────────────────────────────│
│                                                                                │
│  Maya's Workspace: Client Communication & Success                             │
│                                                                                │
│  ┌─── Client Messages ──────────────┬─── Status Update Draft ──────────────┐│
│  │                                   │                                       ││
│  │  Acme Corp (Mission #47)          │  Weekly Status Update: Nov 5          ││
│  │                                   │                                       ││
│  │  Client: When will bot be ready?  │  Hi [Client Name],                    ││
│  │  Nov 4, 3:45 PM                   │                                       ││
│  │                                   │  Here's your weekly update for        ││
│  │  You: We're in QA testing now.    │  Mission #47 (Telegram Notifier):    ││
│  │  Expected delivery: Nov 8.        │                                       ││
│  │  Nov 4, 4:12 PM                   │  ✅ COMPLETED THIS WEEK               ││
│  │                                   │  • Core bot functionality             ││
│  │  Client: Great! Can you add SMS?  │  • Inline button handlers             ││
│  │  Nov 5, 10:23 AM                  │  • Deployment to Render               ││
│  │                                   │                                       ││
│  │  [Draft Response]                 │  🔄 IN PROGRESS                       ││
│  │                                   │  • Final QA testing (Sofia)           ││
│  │  ────────────────────────────────  │  • Performance optimization           ││
│  │                                   │                                       ││
│  │  Beta Inc (Mission #48)           │  📅 ON TRACK FOR NOV 8 DELIVERY       ││
│  │                                   │                                       ││
│  │  Client: Status update?           │  CHANGE REQUEST RECEIVED:             ││
│  │  Nov 5, 9:00 AM                   │  "Can you add SMS notifications?"     ││
│  │                                   │                                       ││
│  │  [Draft Response]                 │  → This is an ADD request (new        ││
│  │                                   │  milestone). Quoted at $150, 3 days.  ││
│  │  ────────────────────────────────  │  Awaiting your approval.              ││
│  │                                   │                                       ││
│  │  [Templates]                      │  Questions? Reply anytime.            ││
│  │  • Weekly status update           │                                       ││
│  │  • Evidence Sprint demo           │  [Edit] [Send Now] [Schedule]        ││
│  │  • AC Green handoff               │                                       ││
│  │  • Change request response        │                                       ││
│  └───────────────────────────────────┴───────────────────────────────────────┘│
│                                                                                │
│  Chat with Maya                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ You: Client asked to add SMS notifications                             │  │
│  │                                                                         │  │
│  │ Maya: This is an ADD request (new scope). I've drafted a response:     │  │
│  │                                                                         │  │
│  │ "Thanks for the feedback! SMS notifications would be a separate        │  │
│  │ milestone. Scoped as Mission #47B for $150, 3-day delivery.            │  │
│  │ Want to proceed after AC Green on Mission #47?"                        │  │
│  │                                                                         │  │
│  │ [Approve & Send] [Edit Message] [Ask Inna for Pricing]                 │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Features

**Left Panel: Client Messages**
- Shows message threads per client
- Most recent first
- Click thread → Expands messages
- [Draft Response] → Maya drafts response
- [Templates] dropdown:
  - Weekly status update
  - Evidence Sprint demo
  - AC Green handoff
  - Change request response

**Right Panel: Status Update Draft**
- Maya auto-generates status update
- Shows completed work, in-progress, timeline
- Handles change requests (Swap vs Add)
- [Edit] → Edit message manually
- [Send Now] → Sends immediately
- [Schedule] → Schedule for later

**Bottom: Chat with Maya**
- Maya drafts client communication
- Handles change requests (consults Inna for pricing)
- [Approve & Send] → Sends message to client
- [Edit Message] → Opens editor
- [Ask Inna for Pricing] → Switches to Inna workspace, creates pricing task

---

## Implementation Notes

### Week 1 MVP Scope

**MUST HAVE:**
- ✅ Rafael workspace (code editor + terminal + chat)
- ✅ Sofia workspace (DoD checklist + test results placeholder)
- ✅ Citizen selector (horizontal tabs)

**WEEK 2:**
- Emma workspace (Upwork integration)
- Inna workspace (doc editor)
- Maya workspace (client messages)

### Technical Stack for Workspaces

**Code Editor (Rafael):**
- Monaco Editor (same as VS Code)
- Syntax highlighting for 20+ languages
- File tree: react-file-tree or custom

**Terminal (Rafael):**
- xterm.js (full terminal emulator)
- Connects to backend WebSocket for command execution

**Markdown Editor (Inna):**
- Monaco Editor with markdown mode
- Live preview: react-markdown

**Job Feed (Emma):**
- Option A: Embedded iframe (if Upwork allows)
- Option B: Upwork RSS → parsed job list
- Option C: Upwork API (if access available)

**Test Runner (Sofia):**
- Backend executes pytest/Playwright
- WebSocket streams test results live
- Parses output → shows pass/fail

**Client Messages (Maya):**
- Email integration (IMAP/SMTP for replies)
- OR: Simple message log (manual copy-paste Week 1)

---

## Updated Success Metrics

**Week 1 (Rafael + Sofia workspaces):**
- ✅ Person 1 (Kara) completes ONE mission using Rafael workspace exclusively
- ✅ Kara asks ≥5 questions in Rafael chat
- ✅ Kara uses code editor to implement (not external IDE)
- ✅ Kara uses terminal to run tests (not external terminal)
- ✅ Sofia workspace shows DoD progress correctly

**Week 2 (All workspaces):**
- ✅ Bigbosexf uses Emma workspace to analyze jobs
- ✅ Reanance uses Inna workspace to write specs
- ✅ Reanance uses Maya workspace to send client updates

---

**Inna Petrova** — The Specifier
ScopeLock Internal Tools
2025-11-05
