// EmmaWorkspace Component
// Maps to: docs/missions/mission-deck/AC.md F4 (Emma Workspace)
// Implements: Proposal drafts view

'use client';

interface EmmaWorkspaceProps {
  missionId: string;
}

export function EmmaWorkspace({ missionId }: EmmaWorkspaceProps) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)', marginBottom: '24px' }}>
          Proposal Drafts
        </h3>

        <div style={{ color: 'var(--slk-muted)', fontSize: '14px' }}>
          Emma workspace - Coming soon (proposal drafts and Upwork job analysis)
        </div>
      </div>
    </div>
  );
}
