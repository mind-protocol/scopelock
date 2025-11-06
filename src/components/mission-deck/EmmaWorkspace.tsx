// EmmaWorkspace Component
// Shows Upwork in an iframe for job scouting

'use client';

interface EmmaWorkspaceProps {
  missionId: string;
}

export function EmmaWorkspace({ missionId }: EmmaWorkspaceProps) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src="https://www.upwork.com/nx/search/jobs/"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'var(--slk-bg)'
        }}
        title="Upwork Job Search"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
