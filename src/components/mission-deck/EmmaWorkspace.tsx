// EmmaWorkspace Component
// Maps to: docs/missions/mission-deck/AC.md F4 (Emma Workspace)
// Implements: 2-panel layout - Proposal drafts (left) + Chat with Emma (right)

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { ChatMessage, CitizenInfo, CitizenName } from '../../types';
import { ChatInterface } from './ChatInterface';

interface EmmaWorkspaceProps {
  missionId: string;
  citizens: CitizenInfo[];
  activeCitizen: CitizenName;
  onSelectCitizen: (citizen: CitizenName) => void;
}

export function EmmaWorkspace({ missionId, citizens, activeCitizen, onSelectCitizen }: EmmaWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(70); // percentage
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadData();
  }, [missionId]);

  // Handle mouse drag for resizing panels
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const windowWidth = window.innerWidth;
      const newWidth = (e.clientX / windowWidth) * 100;
      // Constrain between 20% and 80%
      if (newWidth >= 20 && newWidth <= 80) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const loadData = async () => {
    try {
      const messagesData = await api.getMessages(missionId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load Emma workspace data:', error);
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
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden' }}>
      {/* Left panel: Proposal drafts view */}
      <div style={{
        width: `${leftPanelWidth}%`,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)', marginBottom: '24px' }}>
            Proposal Drafts
          </h3>

          <div style={{ color: 'var(--slk-muted)', fontSize: '14px' }}>
            Emma workspace - Coming soon (proposal drafts and Upwork job analysis)
          </div>
        </div>
      </div>

      {/* Draggable divider */}
      <div
        onMouseDown={() => setIsDragging(true)}
        style={{
          width: '4px',
          cursor: 'col-resize',
          background: isDragging ? 'var(--slk-accent)' : 'rgba(230, 234, 242, 0.08)',
          transition: 'background 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.background = 'var(--slk-accent)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.background = 'rgba(230, 234, 242, 0.08)';
          }
        }}
      />

      {/* Right panel: Chat with Emma */}
      <div style={{
        width: `${100 - leftPanelWidth}%`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          citizens={citizens}
          activeCitizen={activeCitizen}
          onSelectCitizen={onSelectCitizen}
        />
      </div>
    </div>
  );
}
