/**
 * Job Store - Real API integration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job, JobFilters } from '../types';
import { api } from '../api';

interface JobStore {
  jobs: Job[];
  selectedPlatform: 'upwork' | 'contra';
  filters: JobFilters;
  selectedJobId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchJobs: (platform: 'upwork' | 'contra') => Promise<void>;
  selectJob: (jobId: string | null) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  selectPlatform: (platform: 'upwork' | 'contra') => void;
  refreshJobs: () => Promise<void>;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: [],
      selectedPlatform: 'upwork',
      filters: {
        minScore: 8,
        budgetRange: { min: 200, max: 600 },
        timeline: { min: 2, max: 7 },
        platforms: ['upwork', 'contra'],
      },
      selectedJobId: null,
      isLoading: false,
      error: null,

      fetchJobs: async (platform) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.getJobs(platform);
          set({ jobs: data.jobs, selectedPlatform: platform, isLoading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch jobs', isLoading: false });
        }
      },

      selectJob: (jobId) => {
        set({ selectedJobId: jobId });
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      selectPlatform: (platform) => {
        get().fetchJobs(platform);
      },

      refreshJobs: async () => {
        const { selectedPlatform } = get();
        await get().fetchJobs(selectedPlatform);
      },
    }),
    {
      name: 'job-search-storage',
      partialize: (state) => ({
        selectedPlatform: state.selectedPlatform,
        filters: state.filters,
      }),
    }
  )
);
