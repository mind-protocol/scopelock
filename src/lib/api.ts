// Mission Deck API Client
// Maps to: docs/missions/mission-deck/MECHANISM.md API Design
// Week 1: Mock data, Week 2: Real FastAPI backend

import type {
  Mission,
  ChatMessage,
  DODItem,
  LoginRequest,
  LoginResponse,
  SendMessageRequest,
  SendMessageResponse,
  ToggleDODRequest,
  ToggleDODResponse,
  GitHubFile,
  GitHubCommit,
  TestResult,
  PerformanceMetric,
  Lead,
  Proposal,
  EarningsData,
  MissionFundData,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://scopelock.onrender.com';
const USE_MOCK_DATA = true; // Use mock data for missions/chat/DoD (auth uses real backend)

// Mock data for Week 1 MVP
const MOCK_MISSIONS: Mission[] = [
  {
    id: '47',
    title: 'Telegram Notifier',
    client: 'Acme Corp',
    budget: 300,
    deadline: '2025-11-08T23:59:59Z',
    status: 'active',
    assigned_to: 'user-uuid-1',
    stack: {
      backend: 'Python FastAPI',
      frontend: null,
      deploy_backend: 'Render',
      deploy_frontend: null,
      database: 'FalkorDB',
    },
    notes: 'Client prefers inline buttons over separate commands.',
    created_at: '2025-11-05T10:00:00Z',
  },
  {
    id: '48',
    title: 'Landing Page',
    client: 'Beta Inc',
    budget: 450,
    deadline: '2025-11-10T23:59:59Z',
    status: 'active',
    assigned_to: 'user-uuid-1',
    stack: {
      backend: undefined,
      frontend: 'Next.js 14',
      deploy_backend: undefined,
      deploy_frontend: 'Vercel',
      database: undefined,
    },
    created_at: '2025-11-05T11:00:00Z',
  },
  {
    id: '49',
    title: 'Dashboard Analytics',
    client: 'Gamma LLC',
    budget: 600,
    deadline: '2025-11-12T23:59:59Z',
    status: 'qa',
    assigned_to: 'user-uuid-1',
    stack: {
      backend: 'Python FastAPI',
      frontend: 'Next.js 14',
      deploy_backend: 'Render',
      deploy_frontend: 'Vercel',
      database: 'PostgreSQL',
    },
    created_at: '2025-11-05T12:00:00Z',
  },
];

const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  '47': [
    {
      id: 'msg-1',
      role: 'system',
      content: 'Mission #47: Telegram Notifier\nReady to help. What do you need?',
      created_at: '2025-11-05T10:00:00Z',
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'How do I send a Telegram message with inline buttons?',
      created_at: '2025-11-05T10:05:00Z',
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: "Here's how to send a Telegram message with inline buttons:\n\n```python\nfrom telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup\n\nbot = Bot(token='YOUR_TOKEN')\nkeyboard = [\n    [InlineKeyboardButton('Option 1', callback_data='1')],\n    [InlineKeyboardButton('Option 2', callback_data='2')]\n]\nreply_markup = InlineKeyboardMarkup(keyboard)\nbot.send_message(chat_id=CHAT_ID, text='Choose:', reply_markup=reply_markup)\n```\n\nThe buttons will appear below your message. When clicked, they trigger a callback query you handle in your bot.",
      code_blocks: [
        {
          language: 'python',
          code: "from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup\n\nbot = Bot(token='YOUR_TOKEN')\nkeyboard = [\n    [InlineKeyboardButton('Option 1', callback_data='1')],\n    [InlineKeyboardButton('Option 2', callback_data='2')]\n]\nreply_markup = InlineKeyboardMarkup(keyboard)\nbot.send_message(chat_id=CHAT_ID, text='Choose:', reply_markup=reply_markup)",
          filename: 'telegram_inline_buttons.py',
        },
      ],
      created_at: '2025-11-05T10:05:10Z',
    },
  ],
};

const MOCK_DOD_ITEMS: Record<string, DODItem[]> = {
  '47': [
    {
      id: 'dod-1',
      text: 'Bot sends text messages',
      category: 'functional',
      completed: true,
      completed_at: '2025-11-05T14:00:00Z',
    },
    {
      id: 'dod-2',
      text: 'Bot sends inline buttons',
      category: 'functional',
      completed: true,
      completed_at: '2025-11-05T14:30:00Z',
    },
    {
      id: 'dod-3',
      text: 'Bot handles callback queries',
      category: 'functional',
      completed: false,
      completed_at: null,
    },
    {
      id: 'dod-4',
      text: 'Response time <2s',
      category: 'non-functional',
      completed: false,
      completed_at: null,
    },
    {
      id: 'dod-5',
      text: 'Deployed to Render',
      category: 'non-functional',
      completed: false,
      completed_at: null,
    },
    {
      id: 'dod-6',
      text: 'Unit tests pass',
      category: 'tests',
      completed: true,
      completed_at: '2025-11-05T15:00:00Z',
    },
    {
      id: 'dod-7',
      text: 'Integration tests pass',
      category: 'tests',
      completed: false,
      completed_at: null,
    },
  ],
};

const MOCK_GITHUB_FILES: Record<string, GitHubFile[]> = {
  '47': [
    {
      name: 'telegram_bot.py',
      path: 'src/telegram_bot.py',
      type: 'file',
      lastModified: '2025-11-05T14:30:00Z',
      commitMessage: 'feat: add inline button support',
    },
    {
      name: 'handlers.py',
      path: 'src/handlers.py',
      type: 'file',
      lastModified: '2025-11-05T14:00:00Z',
      commitMessage: 'feat: implement message handlers',
    },
    {
      name: 'requirements.txt',
      path: 'requirements.txt',
      type: 'file',
      lastModified: '2025-11-05T13:00:00Z',
      commitMessage: 'chore: add python-telegram-bot dependency',
    },
  ],
};

const MOCK_GITHUB_COMMITS: Record<string, GitHubCommit[]> = {
  '47': [
    {
      sha: 'abc123',
      message: 'feat: add inline button support',
      author: 'Rafael',
      timestamp: '2025-11-05T14:30:00Z',
      relativeTime: '3h ago',
    },
    {
      sha: 'def456',
      message: 'feat: implement message handlers',
      author: 'Rafael',
      timestamp: '2025-11-05T14:00:00Z',
      relativeTime: '4h ago',
    },
    {
      sha: 'ghi789',
      message: 'chore: add python-telegram-bot dependency',
      author: 'Rafael',
      timestamp: '2025-11-05T13:00:00Z',
      relativeTime: '5h ago',
    },
  ],
};

const MOCK_TEST_RESULTS: Record<string, TestResult[]> = {
  '47': [
    {
      name: 'test_send_message',
      status: 'passed',
      duration: 145,
    },
    {
      name: 'test_inline_buttons',
      status: 'passed',
      duration: 220,
    },
    {
      name: 'test_callback_query',
      status: 'failed',
      duration: 180,
      error: 'AssertionError: Expected callback_data "1", got "undefined"',
    },
  ],
};

const MOCK_PERFORMANCE_METRICS: Record<string, PerformanceMetric[]> = {
  '47': [
    {
      name: 'Response Time',
      actual: 145,
      threshold: 200,
      unit: 'ms',
      status: 'pass',
    },
    {
      name: 'Memory Usage',
      actual: 85,
      threshold: 100,
      unit: 'MB',
      status: 'pass',
    },
  ],
};

const MOCK_LEADS: Record<string, Lead[]> = {
  '47': [
    {
      id: 'lead-1',
      title: 'Build AI Chatbot for E-commerce',
      description: 'Looking for a developer to build a chatbot using GPT-4 that can handle customer inquiries and product recommendations.',
      source: 'Upwork',
      confidence: 85,
      reason: 'Strong match: chatbot + GPT-4, budget $500-800, client is process-friendly',
      discoveredAt: '2025-11-06T10:30:00Z',
    },
    {
      id: 'lead-2',
      title: 'Next.js Landing Page with Animations',
      description: 'Need a modern landing page with smooth animations and mobile responsiveness.',
      source: 'Upwork',
      confidence: 75,
      reason: 'Good match: Next.js expertise, clear scope, but budget slightly low at $400',
      discoveredAt: '2025-11-06T09:15:00Z',
    },
    {
      id: 'lead-3',
      title: 'Python Data Pipeline on AWS',
      description: 'Build ETL pipeline using Python, S3, and Lambda functions.',
      source: 'Upwork',
      confidence: 50,
      reason: 'Weak match: requires AWS expertise not in standard stack, unclear requirements',
      discoveredAt: '2025-11-06T08:00:00Z',
    },
  ],
};

const MOCK_PROPOSALS: Record<string, Proposal[]> = {
  '47': [
    {
      id: 'proposal-1',
      jobTitle: 'Build AI Chatbot for E-commerce',
      proposalText: 'Hi! I can deliver your GPT-4 chatbot with ScopeLock\'s proven process: executable acceptance criteria, Evidence Sprint demo, and payment only at AC green. Similar to our TherapyKin project (121+ deployments). Budget: $600 | Timeline: 5-7 days',
      budget: 600,
      confidence: 85,
      status: 'auto_sent',
      decision: 'Auto-sent (confidence ≥80%): Strong portfolio match + process-friendly client',
      generatedAt: '2025-11-06T10:45:00Z',
    },
    {
      id: 'proposal-2',
      jobTitle: 'Next.js Landing Page with Animations',
      proposalText: 'Hi! I can build your Next.js landing page with smooth animations using Framer Motion. ScopeLock process: lock scope via AC.md, demo within 90s, pay only at AC green. See scopelock.mindprotocol.ai for our methodology. Budget: $450 | Timeline: 3-4 days',
      budget: 450,
      confidence: 75,
      status: 'pending_approval',
      decision: 'Pending approval (confidence <80%): Budget slightly low, waiting for human review',
      generatedAt: '2025-11-06T09:30:00Z',
    },
  ],
};

// Helper to get token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Helper to make API calls with automatic token handling
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  // Handle 401 Unauthorized - redirect to mission-deck login
  if (response.status === 401) {
    // Clear token and redirect to wallet login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/mission-deck';
    }
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    let errorDetail = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || errorDetail;
    } catch {
      // Couldn't parse error response, use status text
      errorDetail = response.statusText || errorDetail;
    }

    const error = new Error(errorDetail);
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (USE_MOCK_DATA) {
      // Mock login
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockResponse: LoginResponse = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        user: {
          id: 'user-uuid-1',
          email,
          name: 'Test Developer',
        },
      };
      localStorage.setItem('access_token', mockResponse.access_token);
      return mockResponse;
    }

    const response = await apiCall<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store JWT token for future authenticated requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
    }

    return response;
  },

  // Solana wallet authentication
  // IMPORTANT: Auth NEVER uses mock data (chat endpoints need real JWT tokens)
  loginWithWallet: async (
    wallet_address: string,
    signature: string,
    message: string
  ): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/api/auth/wallet-login', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address,
        signature,
        message,
      }),
    });

    // Store JWT token for future authenticated requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
    }

    return response;
  },

  logout: (): void => {
    // Clear local token immediately
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }

    // Call backend logout endpoint in background (don't block UI)
    if (!USE_MOCK_DATA) {
      apiCall('/api/auth/logout', { method: 'POST' }).catch((error) => {
        // Log but don't throw - logout already succeeded locally
        console.warn('Backend logout request failed:', error);
      });
    }
  },

  // Missions
  listMissions: async (): Promise<Mission[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_MISSIONS;
    }

    // Fetch from backend and extract missions array from MissionListResponse
    const response = await apiCall<{ missions: Mission[]; total: number }>(
      '/api/missions'
    );
    return response.missions;
  },

  getMission: async (id: string): Promise<Mission> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const mission = MOCK_MISSIONS.find((m) => m.id === id);
      if (!mission) throw new Error('Mission not found');
      return mission;
    }

    return apiCall<Mission>(`/api/missions/${id}`);
  },

  updateMissionNotes: async (
    missionId: string,
    notes: string
  ): Promise<{ mission_id: string; notes: string; updated_at: string }> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const mission = MOCK_MISSIONS.find((m) => m.id === missionId);
      if (!mission) throw new Error('Mission not found');
      mission.notes = notes;
      return {
        mission_id: missionId,
        notes,
        updated_at: new Date().toISOString(),
      };
    }

    return apiCall(
      `/api/missions/${missionId}/notes`,
      {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      }
    );
  },

  // Chat - NO MOCK DATA (always use real backend with Claude Code CLI)
  sendMessage: async (
    missionId: string,
    message: string
  ): Promise<SendMessageResponse> => {
    return apiCall<SendMessageResponse>(
      `/api/missions/${missionId}/chat`,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      }
    );
  },

  getMessages: async (missionId: string): Promise<ChatMessage[]> => {
    // Fetch from backend and extract messages array from MessageHistoryResponse
    const response = await apiCall<{
      messages: ChatMessage[];
      total: number;
    }>(`/api/missions/${missionId}/messages`);
    return response.messages;
  },

  // DoD
  getDODItems: async (missionId: string): Promise<DODItem[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_DOD_ITEMS[missionId] || [];
    }

    // Fetch from backend and extract items array from DoDListResponse
    const response = await apiCall<{
      items: DODItem[];
      total: number;
      completed: number;
    }>(`/api/missions/${missionId}/dod`);
    return response.items;
  },

  toggleDODItem: async (
    missionId: string,
    itemId: string,
    completed: boolean
  ): Promise<ToggleDODResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const items = MOCK_DOD_ITEMS[missionId];
      const item = items?.find((i) => i.id === itemId);
      if (!item) throw new Error('Item not found');
      item.completed = completed;
      item.completed_at = completed ? new Date().toISOString() : null;
      return {
        id: itemId,
        completed,
        completed_at: item.completed_at,
      };
    }

    return apiCall<ToggleDODResponse>(
      `/api/missions/${missionId}/dod/${itemId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      }
    );
  },

  markAllDODComplete: async (
    missionId: string
  ): Promise<{
    message: string;
    mission_status: string;
    completed_count: number;
  }> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const items = MOCK_DOD_ITEMS[missionId] || [];
      const incompleteItems = items.filter((i) => !i.completed);
      incompleteItems.forEach((item) => {
        item.completed = true;
        item.completed_at = new Date().toISOString();
      });
      return {
        message: 'All DoD items marked complete',
        mission_status: 'qa',
        completed_count: incompleteItems.length,
      };
    }

    return apiCall(
      `/api/missions/${missionId}/dod/complete`,
      { method: 'PATCH' }
    );
  },

  // GitHub (mock for Week 1, real GitHub API Week 2)
  getGitHubFiles: async (missionId: string): Promise<GitHubFile[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_GITHUB_FILES[missionId] || [];
  },

  getGitHubCommits: async (missionId: string): Promise<GitHubCommit[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_GITHUB_COMMITS[missionId] || [];
  },

  // Tests (mock for Week 1)
  getTestResults: async (missionId: string): Promise<TestResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_TEST_RESULTS[missionId] || [];
  },

  getPerformanceMetrics: async (missionId: string): Promise<PerformanceMetric[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PERFORMANCE_METRICS[missionId] || [];
  },

  // Emma workspace - Leads and Proposals
  getLeads: async (missionId: string): Promise<Lead[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_LEADS[missionId] || [];
  },

  getProposals: async (missionId: string): Promise<Proposal[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PROPOSALS[missionId] || [];
  },

  // Compensation system (Week 1: REST API polling, no mock data)
  // Maps to: backend/app/api/mission_deck/compensation.py

  /**
   * Get member's complete earnings summary
   * Polled by frontend every 2 seconds for real-time updates
   */
  getEarnings: async (memberSlug: string): Promise<EarningsData> => {
    return apiCall<EarningsData>(`/api/compensation/earnings/${memberSlug}`);
  },

  /**
   * Get current mission fund balance and tier information
   */
  getMissionFund: async (): Promise<MissionFundData> => {
    return apiCall<MissionFundData>('/api/compensation/mission-fund');
  },

  /**
   * Get member's earnings for a specific job
   */
  getJobEarnings: async (jobSlug: string, memberSlug: string) => {
    return apiCall<{
      earning: number;
      yourInteractions: number;
      teamTotal: number;
    }>(`/api/compensation/jobs/${jobSlug}/earnings/${memberSlug}`);
  },
};
