/**
 * Proposal Store - Real API integration
 */

import { create } from 'zustand';
import { ProposalDraft } from '../types';
import { api } from '../api';

interface ProposalStore {
  proposals: Map<string, ProposalDraft>;
  loadingStates: Map<string, boolean>;
  errors: Map<string, string>;

  draftProposal: (jobId: string) => Promise<void>;
  approveProposal: (jobId: string) => Promise<void>;
  rejectProposal: (jobId: string, reason: string) => Promise<void>;
  requestRevision: (jobId: string, notes: string) => Promise<void>;
  getProposal: (jobId: string) => ProposalDraft | undefined;
  isLoading: (jobId: string) => boolean;
}

export const useProposalStore = create<ProposalStore>((set, get) => ({
  proposals: new Map(),
  loadingStates: new Map(),
  errors: new Map(),

  draftProposal: async (jobId) => {
    set((state) => {
      const loadingStates = new Map(state.loadingStates);
      loadingStates.set(jobId, true);
      return { loadingStates };
    });

    try {
      const data = await api.draftProposal(jobId);
      set((state) => {
        const proposals = new Map(state.proposals);
        proposals.set(jobId, data.proposal);
        const loadingStates = new Map(state.loadingStates);
        loadingStates.set(jobId, false);
        return { proposals, loadingStates };
      });
    } catch (error) {
      set((state) => {
        const loadingStates = new Map(state.loadingStates);
        loadingStates.set(jobId, false);
        const errors = new Map(state.errors);
        errors.set(jobId, error instanceof Error ? error.message : 'Failed to draft proposal');
        return { loadingStates, errors };
      });
    }
  },

  approveProposal: async (jobId) => {
    const proposal = get().proposals.get(jobId);
    if (!proposal) return;

    // Optimistic update
    set((state) => {
      const proposals = new Map(state.proposals);
      proposals.set(jobId, {
        ...proposal,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      });
      return { proposals };
    });

    try {
      await api.submitProposal(jobId);
    } catch (error) {
      // Revert on error
      set((state) => {
        const proposals = new Map(state.proposals);
        proposals.set(jobId, proposal);
        return { proposals };
      });
      console.error('Failed to submit proposal:', error);
    }
  },

  rejectProposal: async (jobId, reason) => {
    const proposal = get().proposals.get(jobId);
    if (!proposal) return;

    set((state) => {
      const proposals = new Map(state.proposals);
      proposals.set(jobId, {
        ...proposal,
        status: 'rejected',
        rejectionReason: reason,
      });
      return { proposals };
    });

    try {
      await api.rejectProposal(jobId, reason);
    } catch (error) {
      console.error('Failed to reject proposal:', error);
    }
  },

  requestRevision: async (jobId, notes) => {
    const proposal = get().proposals.get(jobId);
    if (!proposal) return;

    set((state) => {
      const proposals = new Map(state.proposals);
      proposals.set(jobId, {
        ...proposal,
        status: 'needs_revision',
        revisionNotes: notes,
      });
      const loadingStates = new Map(state.loadingStates);
      loadingStates.set(jobId, true);
      return { proposals, loadingStates };
    });

    try {
      const data = await api.reviseProposal(jobId, notes);
      set((state) => {
        const proposals = new Map(state.proposals);
        proposals.set(jobId, data.proposal);
        const loadingStates = new Map(state.loadingStates);
        loadingStates.set(jobId, false);
        return { proposals, loadingStates };
      });
    } catch (error) {
      set((state) => {
        const loadingStates = new Map(state.loadingStates);
        loadingStates.set(jobId, false);
        return { loadingStates };
      });
      console.error('Failed to revise proposal:', error);
    }
  },

  getProposal: (jobId) => {
    return get().proposals.get(jobId);
  },

  isLoading: (jobId) => {
    return get().loadingStates.get(jobId) ?? false;
  },
}));
