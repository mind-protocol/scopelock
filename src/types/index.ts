// Mission Deck TypeScript Types
// Maps to: docs/missions/mission-deck/MECHANISM.md API Design

export interface Mission {
  id: string;
  title: string;
  client: string;
  budget: number;
  deadline: string; // ISO 8601 datetime
  status: 'active' | 'qa' | 'done' | 'blocked';
  assigned_to: string;
  stack?: {
    backend?: string;
    frontend?: string | null;
    deploy_backend?: string;
    deploy_frontend?: string | null;
    database?: string;
  };
  notes?: string;
  created_at: string; // ISO 8601 datetime
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  code_blocks?: CodeBlock[];
  created_at: string; // ISO 8601 datetime
}

export interface CodeBlock {
  language: string;
  code: string;
  filename: string;
}

export interface DODItem {
  id: string;
  text: string;
  category: 'functional' | 'non-functional' | 'tests';
  completed: boolean;
  completed_at: string | null; // ISO 8601 datetime or null
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  user: User;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  response: string;
  code_blocks: CodeBlock[];
}

export interface ToggleDODRequest {
  completed: boolean;
}

export interface ToggleDODResponse {
  id: string;
  completed: boolean;
  completed_at: string | null;
}

export type CitizenName = 'emma' | 'inna' | 'rafael' | 'sofia' | 'maya';

export interface CitizenInfo {
  id: CitizenName;
  name: string;
  role: string;
  status: 'active' | 'complete' | 'waiting';
}

// GitHub data (mock for Week 1, real GitHub API Week 2)
export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  lastModified: string;
  commitMessage: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  relativeTime: string;
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'pending';
  duration: number; // milliseconds
  error?: string;
}

export interface PerformanceMetric {
  name: string;
  actual: number;
  threshold: number;
  unit: string; // e.g., "ms", "MB", "%"
  status: 'pass' | 'warn' | 'fail';
}

// Emma workspace data types
export interface Lead {
  id: string;
  title: string;
  description: string;
  source: string; // e.g., "Upwork", "RSS Feed", etc.
  confidence: number; // 0-100
  reason?: string; // Emma's reasoning for confidence score
  discoveredAt: string; // ISO 8601 datetime
}

export interface Proposal {
  id: string;
  jobTitle: string;
  proposalText: string;
  budget: number;
  confidence: number; // 0-100
  status: 'auto_sent' | 'pending_approval' | 'approved' | 'rejected';
  decision?: string; // Emma's decision reasoning
  generatedAt: string; // ISO 8601 datetime
}

// Compensation system types (Week 1: REST API polling)
// Maps to: backend/app/api/mission_deck/compensation.py response models

export interface JobEarning {
  jobSlug: string;
  jobName: string;
  yourInteractions: number;
  teamTotal: number;
  earning: number;
}

export interface EarningsData {
  potentialFromJobs: number;
  completedMissions: number;
  grandTotal: number;
  jobs: JobEarning[];
  totalInteractions: number;
}

export interface MissionFundData {
  balance: number;
  tier: 1 | 2 | 3 | 4;
  tierName: string;
  tierStatus: string;
  tierColor: string;
  tierEmoji: string;
  missionPayments: {
    proposal: number;
    social: number;
    recruitment: number;
    other: number;
  };
}
