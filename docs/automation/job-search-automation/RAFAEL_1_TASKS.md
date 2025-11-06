# Rafael-1: Frontend Foundation Tasks

**Your Track:** Frontend (10 files)
**Estimated Time:** 6-8 hours
**Work Mode:** Can develop independently with mock data

---

## Your Deliverables

### Components (7 files)
1. JobSearchLayout.tsx
2. JobFeedPanel.tsx ⭐ STUB ALREADY CREATED
3. JobCard.tsx
4. ProposalReviewPanel.tsx
5. EmmaScore.tsx
6. ActionPanel.tsx
7. MetricsPanel.tsx

### Stores (3 files)
8. jobStore.ts
9. proposalStore.ts
10. metricsStore.ts

---

## Step-by-Step Instructions

### Phase 1: Read Documentation (30 min)

**Read in this order:**
1. `/docs/automation/job-search-automation/architecture/00_MAPPING.md` - Your files are listed here
2. `/docs/automation/job-search-automation/architecture/02_component_structure.md` - ALL component specs
3. `/citizens/emma/MISSION_SELECTION.md` § Emma's Scoring System - Understand 0-13 points

**Key Concepts:**
- Emma scores jobs 0-13 points (8-13 = strong yes, write proposal)
- Job feed has 3 filters: platform (Upwork/Contra), score (min 8), budget ($200-600 or $600-1500)
- Zustand stores manage state (NOT Redux)
- Components use Tailwind CSS (dark mode tokens)

---

### Phase 2: Set Up Directory Structure (5 min)

```bash
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/frontend/{components,stores}
mkdir -p /home/mind-protocol/scopelock/scripts/job-search-automation/tests/frontend/{components,stores}
```

---

### Phase 3: Create Mock Data File (15 min)

**Create:** `/scripts/job-search-automation/frontend/mockData.ts`

```typescript
/**
 * Mock data for frontend development
 * Phase 2: Replace with real API calls
 */

import type { Job, Proposal, WeeklyMetrics } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    platform: "upwork",
    title: "Landing Page - Next.js + Tailwind",
    budget: 400,
    timeline: "3-5 days",
    client: {
      name: "Acme Corp",
      rating: 5.0,
      paymentVerified: true,
      totalSpent: 5000,
      jobsPosted: 12
    },
    emmaScore: {
      total: 11,
      breakdown: {
        stackMatch: 3,  // Next.js + Tailwind = full match
        budgetFit: 2,    // $400 in $200-600 range
        clearScope: 2,   // Clear requirements
        clientQuality: 2, // Verified + high spend
        timeline: 1,     // 3-5 days = ideal
        aiFit: 1         // Minor AI opportunity
      },
      recommendation: "strong_yes"
    },
    description: "Need a landing page for our new product launch. Must be responsive and SEO-friendly.",
    requirements: ["Next.js 14", "Tailwind CSS", "Responsive design", "Vercel deployment"],
    proposalsDrafted: 0,
    status: "new",
    createdAt: new Date().toISOString(),
    jobUrl: "https://upwork.com/job/example-1"
  },
  // TODO: Add 4 more mock jobs with varying scores (8, 9, 12, 6)
];

export const MOCK_PROPOSALS: Map<string, Proposal> = new Map([
  ["job-1", {
    jobId: "job-1",
    templateUsed: "process-skeptical",
    proposalText: "# Evidence Sprint: Landing Page\n\nI'll deliver your landing page in 3-5 days with proof at every step...",
    portfolioReferenced: ["terminal-velocity", "therapykin"],
    status: "draft",
    createdAt: new Date().toISOString()
  }]
]);

export const MOCK_WEEKLY_METRICS: WeeklyMetrics = {
  proposalsSent: 32,
  jobsWon: 5,
  winRate: 15.6,
  revenue: 1400,
  breakdown: {
    upwork: { sent: 32, won: 5, revenue: 1400 },
    contra: { sent: 0, won: 0, revenue: 0 }
  }
};
```

---

### Phase 4: Implement Files in Order

#### File 1: Create Types File (20 min)

**Create:** `/scripts/job-search-automation/frontend/types.ts`

Copy ALL TypeScript interfaces from:
- `02_component_structure.md` § Component Props
- `jobs.py.stub` § Pydantic models (convert to TypeScript)

**Example:**
```typescript
export interface Job {
  id: string;
  platform: 'upwork' | 'contra';
  title: string;
  budget: number;
  timeline: string;
  client: ClientInfo;
  emmaScore: EmmaScore;
  description: string;
  requirements: string[];
  proposalsDrafted: number;
  status: 'new' | 'scored' | 'draft_ready' | 'submitted';
  createdAt: string;
  jobUrl: string;
}

// ... rest of types
```

---

#### File 2: jobStore.ts (30 min)

**Reference:** `02_component_structure.md` § jobStore.ts

**Key Features:**
- Zustand store with `create()` and `persist()` middleware
- State: jobs[], selectedPlatform, filters, selectedJobId
- Actions: fetchJobs(), setFilters(), selectPlatform(), selectJob()
- localStorage persistence for platform + filters

**Implementation:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_JOBS } from '../mockData';
import type { Job } from '../types';

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
        minScore: 8,  // Default: show only strong matches
        budgetRange: { min: 200, max: 600 },  // Phase 1 range
        timeline: { min: 2, max: 7 }
      },
      selectedJobId: null,

      fetchJobs: async (platform) => {
        // TODO (Phase 2): Replace with real API call
        // const response = await fetch(`/api/jobs/search?platform=${platform}`);
        // const jobs = await response.json();

        // For now: use mock data
        const jobs = MOCK_JOBS.filter(j => j.platform === platform);
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

**Test file:** Create empty stub `jobStore.test.ts`

---

#### File 3: proposalStore.ts (30 min)

**Reference:** `02_component_structure.md` § proposalStore.ts

**Key Features:**
- Map<jobId, Proposal> for proposal storage
- Actions: draftProposal(), approveProposal(), rejectProposal(), requestRevision()
- Optimistic updates for approval

**Use mock data initially, mark TODOs for API integration**

---

#### File 4: metricsStore.ts (20 min)

**Reference:** `02_component_structure.md` § metricsStore.ts

**Key Features:**
- Weekly metrics state
- Actions: fetchWeeklyMetrics(), fetchPipeline()
- Use MOCK_WEEKLY_METRICS initially

---

#### File 5-11: Components (3-4 hours)

**Order:**
1. EmmaScore.tsx (easiest - just display score breakdown)
2. JobCard.tsx (uses EmmaScore)
3. ActionPanel.tsx (buttons with onClick handlers)
4. JobFeedPanel.tsx (⭐ STUB CREATED - complete implementation)
5. ProposalReviewPanel.tsx (displays proposal Markdown)
6. MetricsPanel.tsx (displays weekly stats)
7. JobSearchLayout.tsx (combines all)

**For each component:**
1. Read spec in `02_component_structure.md`
2. Copy TypeScript interface
3. Implement render logic
4. Add Tailwind CSS classes (dark mode tokens from Mission Deck)
5. Link to stores via Zustand hooks
6. Add documentation comments linking to architecture docs
7. Create empty test file

---

### Phase 5: Visual Testing (30 min)

Create a test page to see all components:

**Create:** `/scripts/job-search-automation/frontend/dev-page.tsx`

```typescript
import { JobSearchLayout } from './components/JobSearchLayout';

export default function DevPage() {
  return (
    <div className="h-screen bg-bg text-text">
      <JobSearchLayout />
    </div>
  );
}
```

Test with mock data:
- Platform selector works
- Filters update job list
- Click job → Proposal panel shows
- Emma score displays correctly
- Approve button works (optimistic update)

---

## Success Checklist

- [ ] All 10 files created with complete implementations
- [ ] All TypeScript types defined in types.ts
- [ ] All 3 stores use Zustand with persistence
- [ ] All 7 components render with mock data
- [ ] Filter controls work (platform, score, budget, timeline)
- [ ] Click job → Proposal panel updates
- [ ] Approve button → optimistic UI update
- [ ] All files have documentation comments linking to architecture docs
- [ ] All 10 test files created (empty stubs OK for now)
- [ ] Update SYNC.md with "Rafael-1: Frontend complete, ready for API integration"

---

## Handoff to Rafael-2

**When you're done:**

1. Document your TypeScript interfaces in SYNC.md
2. Rafael-2 needs to create matching Pydantic models
3. Example handoff message:

```markdown
## Rafael-1 → Rafael-2 Handoff

Frontend complete with mock data. Ready for API integration.

**TypeScript Interfaces (Rafael-2: create matching Pydantic models):**
- Job (with emmaScore, client, etc.)
- Proposal (with templateUsed, portfolioReferenced, etc.)
- WeeklyMetrics (with breakdown)

**API Endpoints Needed:**
- GET /api/jobs/search?platform={upwork|contra} → Job[]
- POST /api/proposals/draft { jobId } → Proposal
- POST /api/proposals/submit { jobId } → void
- GET /api/metrics/weekly?start={date}&end={date} → WeeklyMetrics

**Next:** Rafael-2 implements these endpoints, Rafael-1 replaces mock data with fetch() calls.
```

---

## Questions?

- Check `00_MAPPING.md` for documentation references
- Check `02_component_structure.md` for component specs
- Check `JobFeedPanel.tsx.stub` for example implementation pattern

**Good luck!** 🚀

**Rafael Silva** — The Guide
2025-11-06
