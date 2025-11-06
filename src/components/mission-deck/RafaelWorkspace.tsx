// RafaelWorkspace Component
// Maps to: docs/missions/mission-deck/AC.md F4 (Rafael Workspace)
// Implements: 2-panel layout - GitHub repository view (top) + Chat with Rafael (bottom)

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { ChatMessage, GitHubFile, GitHubCommit } from '../../types';
import { ChatInterface } from './ChatInterface';

interface RafaelWorkspaceProps {
  missionId: string;
}

export function RafaelWorkspace({ missionId }: RafaelWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [missionId]);

  const loadData = async () => {
    try {
      const [messagesData, filesData, commitsData] = await Promise.all([
        api.getMessages(missionId),
        api.getGitHubFiles(missionId),
        api.getGitHubCommits(missionId),
      ]);
      setMessages(messagesData);
      setFiles(filesData);
      setCommits(commitsData);
    } catch (error) {
      console.error('Failed to load Rafael workspace data:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await api.sendMessage(missionId, message);
      // Reload messages to get updated chat history
      const updatedMessages = await api.getMessages(missionId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top panel: GitHub repository view */}
      <div className="h-[45%] border-b border-border overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">
              GitHub Repository
            </h3>
            <a
              href={`https://github.com/mind-protocol/scopelock-mission-${missionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 text-sm flex items-center gap-1"
            >
              Open in GitHub ↗
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* File tree */}
            <div>
              <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">
                Files
              </h4>
              <div className="space-y-2">
                {files.length === 0 && (
                  <div className="text-muted text-sm p-3 panel">
                    No files generated yet
                  </div>
                )}
                {files.map((file) => (
                  <div
                    key={file.path}
                    className="panel p-3 hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-accent text-xs">
                        {file.type === 'directory' ? '📁' : '📄'}
                      </span>
                      <span className="text-text text-sm font-mono">
                        {file.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted truncate">
                      {file.commitMessage}
                    </div>
                    <div className="text-xs text-muted/60 mt-1">
                      {formatTime(file.lastModified)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent commits */}
            <div>
              <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">
                Recent Commits
              </h4>
              <div className="space-y-2">
                {commits.length === 0 && (
                  <div className="text-muted text-sm p-3 panel">
                    No commits yet
                  </div>
                )}
                {commits.map((commit) => (
                  <div key={commit.sha} className="panel p-3">
                    <div className="text-text text-sm mb-1">
                      {commit.message}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="text-accent">{commit.author}</span>
                      <span>{commit.relativeTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel: Chat with Rafael */}
      <div className="h-[55%]">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
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
