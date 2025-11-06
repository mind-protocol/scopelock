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
  return (
    <div className="border-b border-border bg-surface">
      <div className="flex items-center px-6 py-4 gap-4">
        {citizens.map((citizen, index) => (
          <div key={citizen.id} className="flex items-center gap-2">
            {/* Citizen card */}
            <button
              onClick={() => onSelect(citizen.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeCitizen === citizen.id
                  ? 'bg-background border border-accent text-accent'
                  : 'bg-surface-hover hover:bg-background text-muted hover:text-text'
              }`}
            >
              {/* Status indicator */}
              <span
                className={`w-2 h-2 rounded-full ${
                  citizen.status === 'active'
                    ? 'bg-accent'
                    : citizen.status === 'complete'
                    ? 'bg-success'
                    : 'bg-muted/40'
                }`}
              />

              {/* Name + Role */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{citizen.name}</span>
                <span className="text-xs opacity-75">{citizen.role}</span>
              </div>
            </button>

            {/* Arrow separator (except after last citizen) */}
            {index < citizens.length - 1 && (
              <div className="text-muted text-sm">──→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
