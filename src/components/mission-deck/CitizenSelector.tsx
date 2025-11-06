// CitizenSelector Component
// Maps to: docs/missions/mission-deck/AC.md F3 (Citizen Workspace Selector)
// Implements: Horizontal tabs showing Emma → Inna → Rafael → Sofia → Maya

'use client';

import type { CitizenInfo, CitizenName } from '../../types';

interface CitizenSelectorProps {
  citizens: CitizenInfo[];
  activeCitizen: CitizenName;
  onSelect: (citizen: CitizenName) => void;
}

export function CitizenSelector({
  citizens,
  activeCitizen,
  onSelect,
}: CitizenSelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--slk-accent)';
      case 'complete': return 'var(--slk-success)';
      default: return 'rgba(154, 163, 174, 0.4)';
    }
  };

  return (
    <div style={{
      borderBottom: '1px solid rgba(230, 234, 242, 0.08)',
      background: 'var(--slk-surface)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        gap: '16px'
      }}>
        {citizens.map((citizen, index) => (
          <div key={citizen.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Citizen card */}
            <button
              onClick={() => onSelect(citizen.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                background: activeCitizen === citizen.id ? 'var(--slk-bg)' : 'rgba(21, 26, 33, 0.5)',
                border: activeCitizen === citizen.id ? '1px solid var(--slk-accent)' : '1px solid transparent',
                color: activeCitizen === citizen.id ? 'var(--slk-accent)' : 'var(--slk-muted)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (activeCitizen !== citizen.id) {
                  e.currentTarget.style.background = 'var(--slk-bg)';
                  e.currentTarget.style.color = 'var(--slk-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCitizen !== citizen.id) {
                  e.currentTarget.style.background = 'rgba(21, 26, 33, 0.5)';
                  e.currentTarget.style.color = 'var(--slk-muted)';
                }
              }}
            >
              {/* Status indicator */}
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getStatusColor(citizen.status),
                display: 'inline-block'
              }} />

              {/* Name + Role */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{citizen.name}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>{citizen.role}</span>
              </div>
            </button>

            {/* Arrow separator (except after last citizen) */}
            {index < citizens.length - 1 && (
              <div style={{
                color: 'var(--slk-muted)',
                fontSize: '0.875rem'
              }}>
                ──→
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
