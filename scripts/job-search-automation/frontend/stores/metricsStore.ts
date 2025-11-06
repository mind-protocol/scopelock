/**
 * Metrics Store - Real API integration
 */

import { create } from 'zustand';
import { WeeklyMetrics, PipelineItem } from '../types';
import { api } from '../api';

interface MetricsStore {
  weeklyMetrics: WeeklyMetrics | null;
  pipeline: PipelineItem[];
  isLoading: boolean;
  error: string | null;

  fetchWeeklyMetrics: (weekStart: string, weekEnd: string) => Promise<void>;
  fetchPipeline: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
}

export const useMetricsStore = create<MetricsStore>((set, get) => ({
  weeklyMetrics: null,
  pipeline: [],
  isLoading: false,
  error: null,

  fetchWeeklyMetrics: async (weekStart, weekEnd) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getWeeklyMetrics(weekStart, weekEnd);
      set({ weeklyMetrics: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch metrics', isLoading: false });
    }
  },

  fetchPipeline: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.getPipeline();
      set({ pipeline: data.items, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch pipeline', isLoading: false });
    }
  },

  refreshMetrics: async () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weekStart = monday.toISOString().split('T')[0];
    const weekEnd = sunday.toISOString().split('T')[0];

    await Promise.all([
      get().fetchWeeklyMetrics(weekStart, weekEnd),
      get().fetchPipeline(),
    ]);
  },
}));
