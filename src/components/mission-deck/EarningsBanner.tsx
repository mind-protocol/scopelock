/**
 * EarningsBanner Component
 *
 * Displays member's real-time earnings summary in the Mission Deck console.
 * Updates every 2 seconds via REST API polling.
 *
 * Maps to: docs/missions/mission-deck-compensation/MECHANISM.md Frontend Components
 */

'use client';

import { useEarningsPolling } from '../../hooks/useEarningsPolling';

interface EarningsBannerProps {
  memberSlug: string;
}

export function EarningsBanner({ memberSlug }: EarningsBannerProps) {
  const { earnings, isLoading, error } = useEarningsPolling(memberSlug);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(30, 229, 184, 0.1)',
          border: '1px solid rgba(30, 229, 184, 0.2)',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: 'var(--slk-accent)',
        }}
      >
        <span>Loading earnings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255, 93, 93, 0.1)',
          border: '1px solid rgba(255, 93, 93, 0.2)',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: 'var(--slk-danger)',
        }}
      >
        <span>⚠️ {error}</span>
      </div>
    );
  }

  if (!earnings) {
    return null;
  }

  const { grandTotal, potentialFromJobs, completedMissions, totalInteractions, jobs } = earnings;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 16px',
        background: 'rgba(30, 229, 184, 0.08)',
        border: '1px solid rgba(30, 229, 184, 0.2)',
        borderRadius: '8px',
      }}
    >
      {/* Grand Total */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--slk-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Total Estimated Earnings
        </span>
        <span
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--slk-accent)',
            fontFamily: 'monospace',
          }}
        >
          ${grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '1px',
          height: '24px',
          background: 'rgba(230, 234, 242, 0.1)',
        }}
      />

      {/* Breakdown */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
        {/* Jobs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--slk-muted)', fontSize: '0.7rem' }}>From Jobs</span>
          <span style={{ color: 'var(--slk-text)', fontFamily: 'monospace' }}>
            ${potentialFromJobs.toFixed(2)}
          </span>
        </div>

        {/* Missions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--slk-muted)', fontSize: '0.7rem' }}>From Missions</span>
          <span style={{ color: 'var(--slk-text)', fontFamily: 'monospace' }}>
            ${completedMissions.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Job Count Badge */}
      {jobs.length > 0 && (
        <>
          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'rgba(230, 234, 242, 0.1)',
            }}
          />
          <div
            style={{
              padding: '4px 8px',
              background: 'rgba(100, 168, 255, 0.1)',
              border: '1px solid rgba(100, 168, 255, 0.2)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--slk-accent-2)',
              fontWeight: '500',
            }}
          >
            {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
          </div>
        </>
      )}
    </div>
  );
}
