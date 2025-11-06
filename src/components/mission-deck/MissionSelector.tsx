// MissionSelector Component
// Maps to: docs/missions/mission-deck/AC.md F2 (Mission Selector)
// Implements: Left panel (200px fixed width, scrollable) showing assigned missions

'use client';

import type { Mission } from '../../types';

interface MissionSelectorProps {
  missions: Mission[];
  activeMissionId: string;
  onSelect: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function MissionSelector({
  missions,
  activeMissionId,
  onSelect,
  isCollapsed,
  onToggleCollapse,
}: MissionSelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--slk-success)';
      case 'qa': return 'var(--slk-accent-2)';
      case 'done': return 'var(--slk-muted)';
      default: return 'var(--slk-warning)';
    }
  };

  const activeMission = missions.find(m => m.id === activeMissionId);

  return (
    <div style={{
      width: isCollapsed ? '60px' : '200px',
      background: 'var(--slk-bg)',
      borderRight: '1px solid rgba(230, 234, 242, 0.08)',
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0,
      transition: 'width 0.3s ease'
    }}>
      <div style={{ padding: '16px' }}>
        {/* Collapsed View */}
        {isCollapsed && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Expand button */}
            <button
              onClick={onToggleCollapse}
              style={{
                background: 'var(--slk-surface)',
                border: '1px solid rgba(230, 234, 242, 0.08)',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--slk-text)',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
              title="Expand missions"
            >
              ☰
            </button>

            {/* Active mission indicator */}
            {activeMission && (
              <div style={{
                background: 'var(--slk-surface)',
                borderRadius: '6px',
                padding: '8px',
                textAlign: 'center',
                width: '40px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getStatusColor(activeMission.status),
                  margin: '0 auto 6px'
                }} />
                <div style={{
                  color: 'var(--slk-muted)',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace'
                }}>
                  #{activeMission.id}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expanded View */}
        {!isCollapsed && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{
                color: 'var(--slk-text)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0
              }}>
                Missions
              </h2>
              <button
                onClick={onToggleCollapse}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--slk-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '1rem'
                }}
                title="Collapse panel"
              >
                ←
              </button>
            </div>

            {missions.length === 0 && (
              <div style={{
                color: 'var(--slk-muted)',
                fontSize: '0.875rem',
                padding: '12px'
              }}>
                No missions assigned
              </div>
            )}

            {missions.map((mission) => (
          <div
            key={mission.id}
            style={{
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '8px',
              background: mission.id === activeMissionId ? 'var(--slk-surface)' : 'transparent',
              transition: 'background 0.2s'
            }}
            onClick={() => onSelect(mission.id)}
            onMouseEnter={(e) => {
              if (mission.id !== activeMissionId) {
                e.currentTarget.style.background = 'rgba(21, 26, 33, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (mission.id !== activeMissionId) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {/* Status indicator + Mission number */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getStatusColor(mission.status),
                display: 'inline-block'
              }} />
              <span style={{
                color: 'var(--slk-muted)',
                fontSize: '0.75rem',
                fontFamily: 'monospace'
              }}>
                #{mission.id}
              </span>
            </div>

            {/* Mission title */}
            <div style={{
              color: 'var(--slk-text)',
              fontWeight: 500,
              fontSize: '0.875rem',
              marginBottom: '4px'
            }}>
              {mission.title}
            </div>

            {/* Client + Budget */}
            <div style={{
              color: 'var(--slk-muted)',
              fontSize: '0.75rem',
              marginBottom: '4px'
            }}>
              {mission.client}
            </div>

            {/* Budget + Deadline */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem'
            }}>
              <span style={{
                color: 'var(--slk-success)',
                fontWeight: 500
              }}>
                ${mission.budget}
              </span>
              <span style={{ color: 'var(--slk-muted)' }}>
                {formatDeadline(mission.deadline)}
              </span>
            </div>
          </div>
        ))}
          </>
        )}
      </div>
    </div>
  );
}

function formatDeadline(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `${diffDays}d`;

  // Return as "Nov 8"
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
