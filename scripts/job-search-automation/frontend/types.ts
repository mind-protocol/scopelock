/**
 * Job Search Automation - Type Definitions
 * Maps to backend Python models (camelCase → snake_case)
 */

export interface EmmaScore {
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
  reasoning: string;
}

export interface ClientInfo {
  name: string;
  rating?: number;
  totalSpent?: number;
  jobsPosted?: number;
  hireRate?: number;
  verified: boolean;
  paymentVerified: boolean;
  location?: string;
}

export interface Job {
  id: string;
  platform: 'upwork' | 'contra';
  title: string;
  description: string;
  requirements: string[];
  budget: number;
  timeline: string;
  client: ClientInfo;
  emmaScore: EmmaScore;
  proposalsDrafted: number;
  status: 'new' | 'scored' | 'draft_ready' | 'submitted' | 'rejected';
  createdAt: string;
  jobUrl: string;
  tags?: string[];
}

export interface ProposalDraft {
  jobId: string;
  content: string;
  status: 'draft' | 'approved' | 'submitted' | 'rejected' | 'needs_revision';
  createdAt: string;
  submittedAt?: string;
  rejectionReason?: string;
  revisionNotes?: string;
}

export interface WeeklyMetrics {
  weekStart: string;
  weekEnd: string;
  proposalsSent: number;
  jobsWon: number;
  revenue: number;
  winRate: number;
  platformBreakdown: {
    upwork: { sent: number; won: number; revenue: number };
    contra: { sent: number; won: number; revenue: number };
  };
}

export interface PipelineItem {
  jobId: string;
  jobTitle: string;
  platform: 'upwork' | 'contra';
  proposalStatus: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  clientResponse?: 'pending' | 'interview' | 'hired' | 'declined';
  expectedRevenue: number;
}

export interface JobFilters {
  minScore: number;
  budgetRange: { min: number; max: number };
  timeline: { min: number; max: number };
  platforms: ('upwork' | 'contra')[];
}
