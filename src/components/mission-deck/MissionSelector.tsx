// MissionSelector Component
// Maps to: docs/missions/mission-deck/AC.md F2 (Mission Selector)
// Implements: Left panel (200px fixed width, scrollable) showing assigned missions

'use client';

import type { Mission } from '../../types';

interface MissionSelectorProps {
  missions: Mission[];
  activeMissionId: string;
  onSelect: (id: string) => void;
}

export function MissionSelector({
  missions,
  activeMissionId,
  onSelect,
}: MissionSelectorProps) {
  return (
    <div className="w-[200px] bg-background border-r border-border h-screen overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h2 className="text-text font-semibold mb-4 text-sm uppercase tracking-wide">
          Missions
        </h2>

        {missions.length === 0 && (
          <div className="text-muted text-sm p-3">No missions assigned</div>
        )}

        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`p-3 rounded-md cursor-pointer mb-2 transition-colors ${
              mission.id === activeMissionId
                ? 'bg-surface'
                : 'hover:bg-surface-hover'
            }`}
            onClick={() => onSelect(mission.id)}
          >
            {/* Status indicator + Mission number */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  mission.status === 'active'
                    ? 'bg-success'
                    : mission.status === 'qa'
                    ? 'bg-accent-2'
                    : mission.status === 'done'
                    ? 'bg-muted'
                    : 'bg-warning'
                }`}
              />
              <span className="text-muted text-xs font-mono">
                #{mission.id}
              </span>
            </div>

            {/* Mission title */}
            <div className="text-text font-medium text-sm mb-1">
              {mission.title}
            </div>

            {/* Client + Budget */}
            <div className="text-muted text-xs mb-1">{mission.client}</div>

            {/* Budget + Deadline */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-success font-medium">
                ${mission.budget}
              </span>
              <span className="text-muted">
                {formatDeadline(mission.deadline)}
              </span>
            </div>
          </div>
        ))}
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
