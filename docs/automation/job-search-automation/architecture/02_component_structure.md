# Job Search Automation - Component Structure

**Purpose:** Frontend component hierarchy for job search dashboard
**Framework:** Next.js 14, React 18.2, TypeScript 5.3, Tailwind CSS 3.4
**State Management:** Zustand 4.4 (chosen for simplicity over Redux)

---

## Component Tree

```
JobSearchLayout                          (/jobs route)
├── JobFeedPanel (left 40%)
│   ├── PlatformSelector                 (Upwork / Contra tabs)
│   ├── FilterControls                   (score 8-13, budget, etc.)
│   └── JobList
│       └── JobCard                      (one per job)
│           ├── JobHeader               (title, budget)
│           ├── EmmaScore               (0-13 points with breakdown)
│           └── ActionButtons           (View / Score / Draft)
│
├── ProposalReviewPanel (right 60%)
│   ├── JobDetailsView (top 30%)
│   │   ├── JobTitle
│   │   ├── JobDescription
│   │   ├── ClientInfo
│   │   └── Requirements
│   │
│   ├── ProposalDraft (middle 50%)
│   │   ├── TemplateUsed               (which template Emma selected)
│   │   ├── ProposalText               (markdown rendered)
│   │   └── PortfolioReferences        (which projects referenced)
│   │
│   └── ActionPanel (bottom 20%)
│       ├── ApproveButton
│       ├── RejectButton
│       ├── NeedsRevisionButton
│       └── StatusIndicator            (submitted / pending)
│
└── MetricsPanel (bottom panel, collapsible)
    ├── WeeklyStats
    │   ├── ProposalsSent
    │   ├── JobsWon
    │   ├── WinRate
    │   └── Revenue
    │
    └── PipelineView                     (Phase 2+)
        └── ProposalStatusList
            └── ProposalStatusCard
                ├── JobTitle
                ├── Status (submitted/viewed/interview/won/lost)
                ├── DaysSinceSubmitted
                └── FollowUpButton
```

---

## Component Specifications

### 1. JobSearchLayout

**Responsibility:** Top-level layout for job search dashboard

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                     Job Search Dashboard                     │
├─────────────────────┬────────────────────────────────────────┤
│                     │                                         │
│   JobFeedPanel      │      ProposalReviewPanel               │
│   (40% width)       │      (60% width)                       │
│                     │                                         │
│   • Platform tabs   │   ┌──────────────────────────────┐    │
│   • Filter controls │   │  Job Details (30%)           │    │
│   • Job list        │   │  • Title, budget, client     │    │
│                     │   └──────────────────────────────┘    │
│   [Job Card 1]      │                                         │
│   [Job Card 2]      │   ┌──────────────────────────────┐    │
│   [Job Card 3]      │   │  Proposal Draft (50%)        │    │
│   ...               │   │  • Template used             │    │
│                     │   │  • Proposal text (Markdown)  │    │
│                     │   └──────────────────────────────┘    │
│                     │                                         │
│                     │   ┌──────────────────────────────┐    │
│                     │   │  Action Panel (20%)          │    │
│                     │   │  [Approve] [Reject] [Revise] │    │
│                     │   └──────────────────────────────┘    │
│                     │                                         │
└─────────────────────┴────────────────────────────────────────┘
```

**Props:**
```typescript
interface JobSearchLayoutProps {
  children: React.ReactNode;
}
```

**State (none - layout only):**
- Uses Zustand stores for data

---

### 2. JobFeedPanel

**Responsibility:** Left panel showing Upwork/Contra job listings

**Key Functionality:**
- Platform selector (Upwork / Contra tabs)
- Filter by Emma's score (show only 8-13 points)
- Filter by budget range ($200-600, $600-1500)
- Filter by timeline (2-7 days)
- Infinite scroll for job list

**Props:**
```typescript
interface JobFeedPanelProps {
  onJobSelect: (jobId: string) => void;
  selectedJobId: string | null;
}
```

**State (via Zustand jobStore):**
```typescript
interface JobStore {
  jobs: Job[];
  selectedPlatform: 'upwork' | 'contra';
  filters: {
    minScore: number; // 8-13
    budgetRange: { min: number; max: number };
    timeline: { min: number; max: number };
  };
  fetchJobs: (platform: 'upwork' | 'contra') => Promise<void>;
  setFilters: (filters: Partial<JobStore['filters']>) => void;
  selectPlatform: (platform: 'upwork' | 'contra') => void;
}
```

**Data Flow:**
1. User selects platform (Upwork/Contra) → fetchJobs() called
2. Backend returns jobs with Emma's scores
3. Jobs displayed in list, filtered by score/budget/timeline
4. User clicks job → onJobSelect() → Proposal panel updates

---

### 3. JobCard

**Responsibility:** Display single job in feed with Emma's score

**Visual Layout:**
```
┌────────────────────────────────────────────────┐
│ Landing Page - $400 (3-5 days)        [⭐ 11]  │
│                                                 │
│ Client: Acme Corp (⭐⭐⭐⭐⭐)                     │
│ Payment Verified • $5,000+ spent                │
│                                                 │
│ Emma's Analysis:                                │
│ ✅ Stack match: 3/3 (Next.js, TypeScript)      │
│ ✅ Budget fit: 2/2 ($400 in range)             │
│ ✅ Clear scope: 2/2 (can write AC.md)          │
│ ✅ Client quality: 2/2 (verified, high spend)  │
│ ✅ Timeline: 1/1 (3-5 days)                    │
│ ✅ AI fit: 1/3 (AI integration opportunity)    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Total: 11/13 points — STRONG YES               │
│                                                 │
│ [View Details] [Draft Proposal]                │
└────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

interface Job {
  id: string;
  platform: 'upwork' | 'contra';
  title: string;
  budget: number;
  timeline: string; // "3-5 days"
  client: {
    name: string;
    rating: number; // 1-5
    paymentVerified: boolean;
    totalSpent: number;
  };
  emmaScore: {
    total: number; // 0-13
    breakdown: {
      stackMatch: number; // 0-3
      budgetFit: number; // 0-2
      clearScope: number; // 0-2
      clientQuality: number; // 0-2
      timeline: number; // 0-1
      aiFit: number; // 0-3
    };
    recommendation: 'strong_yes' | 'maybe' | 'pass';
  };
  description: string;
  requirements: string[];
  proposalsDrafted: number; // how many Emma has drafted for this job
  status: 'new' | 'scored' | 'draft_ready' | 'submitted';
}
```

**Color Coding:**
- **Strong Yes (8-13 points):** Green border
- **Maybe (6-7 points):** Yellow border
- **Pass (0-5 points):** Gray (not shown by default)

---

### 4. ProposalReviewPanel

**Responsibility:** Right panel showing job details + Emma's draft proposal

**Key Functionality:**
- Display selected job details
- Show Emma's draft proposal (Markdown rendered)
- Show which template Emma used
- Show which portfolio projects Emma referenced
- Approve/Reject/Needs Revision buttons

**Props:**
```typescript
interface ProposalReviewPanelProps {
  jobId: string | null;
}
```

**State (via Zustand proposalStore):**
```typescript
interface ProposalStore {
  proposals: Map<string, Proposal>; // jobId → Proposal
  draftProposal: (jobId: string) => Promise<Proposal>;
  approveProposal: (jobId: string) => Promise<void>;
  rejectProposal: (jobId: string, reason: string) => Promise<void>;
  requestRevision: (jobId: string, feedback: string) => Promise<void>;
}

interface Proposal {
  jobId: string;
  templateUsed: 'process-skeptical' | 'process-oriented';
  proposalText: string; // Markdown
  portfolioReferenced: string[]; // ['la-serenissima', 'terminal-velocity']
  status: 'draft' | 'approved' | 'submitted' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  submittedAt?: string;
}
```

---

### 5. EmmaScore

**Responsibility:** Display Emma's 0-13 point score breakdown

**Visual Layout:**
```
┌──────────────────────────────────┐
│ Emma's Analysis: 11/13 points    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                   │
│ ✅ Stack match: 3/3               │
│    (Next.js, TypeScript, Vercel)  │
│                                   │
│ ✅ Budget fit: 2/2                │
│    ($400 in $200-600 range)       │
│                                   │
│ ✅ Clear scope: 2/2               │
│    (Can write AC.md in 5 min)     │
│                                   │
│ ✅ Client quality: 2/2            │
│    (Verified, $5k+ spent, 5★)     │
│                                   │
│ ✅ Timeline: 1/1                  │
│    (3-5 days fits our range)      │
│                                   │
│ ⚠️ AI fit: 1/3                    │
│    (Minor AI opportunity)         │
│                                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Recommendation: STRONG YES        │
└──────────────────────────────────┘
```

**Props:**
```typescript
interface EmmaScoreProps {
  score: Job['emmaScore'];
  compact?: boolean; // if true, show just total score
}
```

---

### 6. ActionPanel

**Responsibility:** Approve/Reject/Revise buttons for proposal

**Visual Layout:**
```
┌──────────────────────────────────────────────┐
│ Status: Draft ready for review               │
│                                               │
│ [✅ Approve & Submit]  [❌ Reject]            │
│ [✏️ Needs Revision]                          │
│                                               │
│ Estimated win rate: 15-20% (based on score)  │
└──────────────────────────────────────────────┘
```

**Props:**
```typescript
interface ActionPanelProps {
  jobId: string;
  proposalStatus: Proposal['status'];
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onRevise: (feedback: string) => Promise<void>;
}
```

**Button Behavior:**

**Approve:**
1. User clicks [Approve]
2. Frontend: proposalStore.approveProposal(jobId)
3. Backend: POST /api/proposals/submit (auto-submits to Upwork/Contra)
4. Backend: Logs in FalkorDB graph (U4_Work_Item node created)
5. Backend: Creates follow-up reminder tasks (24h, 48h)
6. Frontend: Status updates to "submitted"
7. Telegram: Notification sent to Bigbosexf "Proposal submitted: [Job Title]"

**Reject:**
1. User clicks [Reject]
2. Modal asks: "Reason for rejection?"
3. User enters feedback for Emma
4. Frontend: proposalStore.rejectProposal(jobId, reason)
5. Backend: Logs rejection reason (Emma learns from this)
6. Frontend: Job removed from feed

**Needs Revision:**
1. User clicks [Needs Revision]
2. Modal asks: "What needs to change?"
3. User enters feedback
4. Frontend: proposalStore.requestRevision(jobId, feedback)
5. Backend: Emma re-drafts proposal with feedback
6. Frontend: New draft appears in panel
7. User reviews again → Approve or Reject

---

### 7. MetricsPanel

**Responsibility:** Weekly metrics dashboard (bottom panel, collapsible)

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ This Week: Nov 4-10, 2025                      [▼ Collapse]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Proposals Sent   Jobs Won    Win Rate    Revenue                │
│  ┌──────────┐   ┌────────┐   ┌────────┐  ┌──────────┐          │
│  │    32    │   │   5    │   │  15.6% │  │  $1,400  │          │
│  └──────────┘   └────────┘   └────────┘  └──────────┘          │
│                                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  Pipeline (Phase 2+)                                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Landing Page - $400        [Submitted]      2 days ago      │ │
│  │ Acme Corp • Viewed by client                                │ │
│  │ [Send Follow-up]                                             │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ PDF Parser - $600          [Interview]      1 day ago       │ │
│  │ Beta Inc • Invited to interview                             │ │
│  │ [Schedule Call]                                              │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ Telegram Bot - $300        [Won]            3 hours ago     │ │
│  │ Gamma LLC • Contract awarded                                │ │
│  │ [Start Mission]                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface MetricsPanelProps {
  week: { start: string; end: string };
  metrics: WeeklyMetrics;
  pipeline: ProposalStatus[];
}

interface WeeklyMetrics {
  proposalsSent: number;
  jobsWon: number;
  winRate: number; // percentage
  revenue: number; // USD
  breakdown: {
    upwork: { sent: number; won: number; revenue: number };
    contra: { sent: number; won: number; revenue: number };
  };
}

interface ProposalStatus {
  jobId: string;
  jobTitle: string;
  client: string;
  budget: number;
  status: 'submitted' | 'viewed' | 'interview' | 'won' | 'lost';
  submittedAt: string;
  daysSinceSubmitted: number;
  needsFollowUp: boolean; // true if >24h and no response
}
```

---

## State Management (Zustand Stores)

### jobStore.ts

**Responsibility:** Job feed data and filters

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JobStore {
  jobs: Job[];
  selectedPlatform: 'upwork' | 'contra';
  filters: {
    minScore: number;
    budgetRange: { min: number; max: number };
    timeline: { min: number; max: number };
  };
  selectedJobId: string | null;

  // Actions
  fetchJobs: (platform: 'upwork' | 'contra') => Promise<void>;
  setFilters: (filters: Partial<JobStore['filters']>) => void;
  selectPlatform: (platform: 'upwork' | 'contra') => void;
  selectJob: (jobId: string | null) => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: [],
      selectedPlatform: 'upwork',
      filters: {
        minScore: 8, // default: show only 8-13 point jobs
        budgetRange: { min: 200, max: 600 },
        timeline: { min: 2, max: 7 }
      },
      selectedJobId: null,

      fetchJobs: async (platform) => {
        const response = await fetch(`/api/jobs/search?platform=${platform}`);
        const jobs = await response.json();
        set({ jobs, selectedPlatform: platform });
      },

      setFilters: (newFilters) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      selectPlatform: (platform) => {
        set({ selectedPlatform: platform });
        get().fetchJobs(platform);
      },

      selectJob: (jobId) => {
        set({ selectedJobId: jobId });
      }
    }),
    {
      name: 'job-search-storage',
      partialize: (state) => ({
        selectedPlatform: state.selectedPlatform,
        filters: state.filters
      })
    }
  )
);
```

---

### proposalStore.ts

**Responsibility:** Proposal drafts and submission

```typescript
import { create } from 'zustand';

interface ProposalStore {
  proposals: Map<string, Proposal>;
  loadingStates: Map<string, boolean>;

  // Actions
  draftProposal: (jobId: string) => Promise<Proposal>;
  approveProposal: (jobId: string) => Promise<void>;
  rejectProposal: (jobId: string, reason: string) => Promise<void>;
  requestRevision: (jobId: string, feedback: string) => Promise<void>;
}

export const useProposalStore = create<ProposalStore>((set, get) => ({
  proposals: new Map(),
  loadingStates: new Map(),

  draftProposal: async (jobId) => {
    set((state) => ({
      loadingStates: new Map(state.loadingStates).set(jobId, true)
    }));

    const response = await fetch('/api/proposals/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    });

    const proposal = await response.json();

    set((state) => ({
      proposals: new Map(state.proposals).set(jobId, proposal),
      loadingStates: new Map(state.loadingStates).set(jobId, false)
    }));

    return proposal;
  },

  approveProposal: async (jobId) => {
    const response = await fetch('/api/proposals/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId })
    });

    if (!response.ok) throw new Error('Proposal submission failed');

    // Update proposal status
    set((state) => {
      const proposals = new Map(state.proposals);
      const proposal = proposals.get(jobId);
      if (proposal) {
        proposals.set(jobId, {
          ...proposal,
          status: 'submitted',
          submittedAt: new Date().toISOString()
        });
      }
      return { proposals };
    });
  },

  rejectProposal: async (jobId, reason) => {
    await fetch('/api/proposals/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, reason })
    });

    // Remove proposal from map
    set((state) => {
      const proposals = new Map(state.proposals);
      proposals.delete(jobId);
      return { proposals };
    });
  },

  requestRevision: async (jobId, feedback) => {
    const response = await fetch('/api/proposals/revise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, feedback })
    });

    const revisedProposal = await response.json();

    set((state) => ({
      proposals: new Map(state.proposals).set(jobId, revisedProposal)
    }));
  }
}));
```

---

### metricsStore.ts

**Responsibility:** Weekly metrics and pipeline status

```typescript
import { create } from 'zustand';

interface MetricsStore {
  weeklyMetrics: WeeklyMetrics | null;
  pipeline: ProposalStatus[];

  // Actions
  fetchWeeklyMetrics: (weekStart: string, weekEnd: string) => Promise<void>;
  fetchPipeline: () => Promise<void>;
}

export const useMetricsStore = create<MetricsStore>((set) => ({
  weeklyMetrics: null,
  pipeline: [],

  fetchWeeklyMetrics: async (weekStart, weekEnd) => {
    const response = await fetch(
      `/api/metrics/weekly?start=${weekStart}&end=${weekEnd}`
    );
    const metrics = await response.json();
    set({ weeklyMetrics: metrics });
  },

  fetchPipeline: async () => {
    const response = await fetch('/api/proposals/list?status=submitted,viewed,interview,won');
    const pipeline = await response.json();
    set({ pipeline });
  }
}));
```

---

## Data Flow Examples

### 1. User Approves Proposal

```
User clicks [Approve] in ActionPanel
  → proposalStore.approveProposal(jobId)
    → POST /api/proposals/submit { jobId }
      → Backend: Submit to Upwork/Contra API
      → Backend: Create U4_Work_Item node in FalkorDB
      → Backend: Create follow-up reminder tasks (24h, 48h)
      → Backend: Send Telegram notification to Bigbosexf
      → Response: { success: true, proposalId: "..." }
    → proposalStore updates proposal status to 'submitted'
  → UI updates: [Approve] button → "Submitted" badge
  → metricsStore.fetchPipeline() refreshes pipeline view
```

---

### 2. Emma Scores New Job

```
Cron job fetches new Upwork jobs (via RSS)
  → POST /api/jobs/score { jobUrl }
    → Backend: job_scoring_engine.py runs Emma's 0-13 scoring
      → Check stack match (3 points)
      → Check budget fit (2 points)
      → Check clear scope (2 points)
      → Check client quality (2 points)
      → Check timeline (1 point)
      → Check AI fit (3 points)
    → Backend: Create U4_Work_Item node (work_type='job_opportunity')
    → Backend: Link to U4_Agent (Bigbosexf) via U4_CANDIDATE_FOR
    → Response: { jobId, score: { total: 11, breakdown: {...} } }
  → Frontend: jobStore.fetchJobs() pulls new scored jobs
  → UI: New job appears in feed with Emma's score
```

---

### 3. Morning Brief Generation

```
Cron at 8:00 AM WAT
  → Backend: morning_brief_cron.py runs
    → Query FalkorDB:
      - New jobs scored overnight (work_type='job_opportunity', created_at > yesterday)
      - Proposals needing follow-up (>24h, no followup_sent)
      - Jobs won yesterday (state='won', created_at = yesterday)
    → Generate personalized brief:
      "Good morning! 5 new jobs found (3 strong matches), 2 proposals need follow-up, 1 job won yesterday."
    → Send via Telegram with action buttons
  → User receives notification
  → User clicks button → Opens Mission Deck job search page
```

---

**Related Documents:**
- `/docs/automation/job-search-automation/architecture/01_overview.md` - Architecture overview
- `/docs/automation/job-search-automation/architecture/03_api_design.md` - API endpoints
- `/docs/automation/job-search-automation/architecture/04_state_machines.md` - Proposal/task state machines

**Rafael Silva** — The Guide
Job Search Automation - Component Structure
2025-11-06
