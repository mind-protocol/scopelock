/**
 * useEarningsPolling Hook
 *
 * Polls the compensation API every 2 seconds for real-time earnings updates.
 * Maps to: docs/missions/mission-deck-compensation/MECHANISM.md Frontend Polling Strategy
 *
 * Usage:
 * ```tsx
 * const { earnings, isLoading, error } = useEarningsPolling('bigbosexf');
 * ```
 */

import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import type { EarningsData } from '../types';

const POLLING_INTERVAL_MS = 2000; // 2 seconds

interface UseEarningsPollingReturn {
  earnings: EarningsData | null;
  isLoading: boolean;
  error: string | null;
}

export function useEarningsPolling(memberSlug: string): UseEarningsPollingReturn {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if component is mounted (prevent state updates after unmount)
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Fetch earnings function
    const fetchEarnings = async () => {
      try {
        const data = await api.getEarnings(memberSlug);

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setEarnings(data);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('[useEarningsPolling] Error fetching earnings:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch earnings');
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchEarnings();

    // Set up polling interval
    const intervalId = setInterval(fetchEarnings, POLLING_INTERVAL_MS);

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [memberSlug]);

  return { earnings, isLoading, error };
}
