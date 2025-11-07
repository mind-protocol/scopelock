// RafaelWorkspace Component
// Maps to: docs/missions/mission-deck/AC.md F4 (Rafael Workspace)
// Implements: GitHub repository view

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { GitHubFile, GitHubCommit } from '../../types';

interface RafaelWorkspaceProps {
  missionId: string;
}

export function RafaelWorkspace({ missionId }: RafaelWorkspaceProps) {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);

  useEffect(() => {
    loadData();
  }, [missionId]);

  const loadData = async () => {
    try {
      const [filesData, commitsData] = await Promise.all([
        api.getGitHubFiles(missionId),
        api.getGitHubCommits(missionId),
      ]);
      setFiles(filesData);
      setCommits(commitsData);
    } catch (error) {
      console.error('Failed to load Rafael workspace data:', error);
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)' }}>
              GitHub Repository
            </h3>
            <a
              href={`https://github.com/mind-protocol/scopelock-mission-${missionId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--slk-accent)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            >
              Open in GitHub ↗
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* File tree */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Files
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {files.length === 0 && (
                  <div style={{ color: 'var(--slk-muted)', fontSize: '14px', padding: '12px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px' }}>
                    No files generated yet
                  </div>
                )}
                {files.map((file) => (
                  <div
                    key={file.path}
                    style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', padding: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slk-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--slk-surface)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--slk-accent)', fontSize: '12px' }}>
                        {file.type === 'directory' ? '📁' : '📄'}
                      </span>
                      <span style={{ color: 'var(--slk-text)', fontSize: '14px', fontFamily: 'monospace' }}>
                        {file.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--slk-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.commitMessage}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--slk-muted)', opacity: 0.6, marginTop: '4px' }}>
                      {formatTime(file.lastModified)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent commits */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recent Commits
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {commits.length === 0 && (
                  <div style={{ color: 'var(--slk-muted)', fontSize: '14px', padding: '12px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px' }}>
                    No commits yet
                  </div>
                )}
                {commits.map((commit) => (
                  <div key={commit.sha} style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', padding: '12px' }}>
                    <div style={{ color: 'var(--slk-text)', fontSize: '14px', marginBottom: '4px' }}>
                      {commit.message}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--slk-muted)' }}>
                      <span style={{ color: 'var(--slk-accent)' }}>{commit.author}</span>
                      <span>{commit.relativeTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}
