/**
 * API Client Configuration
 * Connects frontend to FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

export const api = {
  // Job Feed
  getJobs: (platform: 'upwork' | 'contra') =>
    fetchApi<{ jobs: any[]; total: number }>(`/api/jobs/feed?platform=${platform}`),

  // Proposals
  draftProposal: (jobId: string) =>
    fetchApi<{ proposal: any }>('/api/proposals/draft', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    }),

  submitProposal: (jobId: string) =>
    fetchApi<{ success: boolean }>('/api/proposals/submit', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    }),

  rejectProposal: (jobId: string, reason: string) =>
    fetchApi<{ success: boolean }>('/api/proposals/reject', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, reason }),
    }),

  reviseProposal: (jobId: string, notes: string) =>
    fetchApi<{ proposal: any }>('/api/proposals/revise', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, notes }),
    }),

  // Metrics
  getWeeklyMetrics: (weekStart: string, weekEnd: string) =>
    fetchApi<any>(`/api/metrics/weekly?start=${weekStart}&end=${weekEnd}`),

  getPipeline: () =>
    fetchApi<{ items: any[] }>('/api/metrics/pipeline'),
};
