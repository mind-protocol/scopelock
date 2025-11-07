// Console Page - Main Mission Deck Dashboard
// Maps to: docs/missions/mission-deck/AC.md F2-F5
// Layout: Mission Selector (left) + Main Area (Citizen Selector + Workspace)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { MissionSelector } from '../../../components/mission-deck/MissionSelector';
import { CitizenSelector } from '../../../components/mission-deck/CitizenSelector';
import { EmmaWorkspace } from '../../../components/mission-deck/EmmaWorkspace';
import { RafaelWorkspace } from '../../../components/mission-deck/RafaelWorkspace';
import { SofiaWorkspace } from '../../../components/mission-deck/SofiaWorkspace';
import { ChatInterface } from '../../../components/mission-deck/ChatInterface';
import type { Mission, CitizenInfo, CitizenName, ChatMessage } from '../../../types';

const CITIZENS: CitizenInfo[] = [
  {
    id: 'emma',
    name: 'Emma',
    role: 'Scout',
    status: 'waiting',
  },
  {
    id: 'inna',
    name: 'Inna',
    role: 'Specifier',
    status: 'waiting',
  },
  {
    id: 'rafael',
    name: 'Rafael',
    role: 'Guide',
    status: 'active',
  },
  {
    id: 'sofia',
    name: 'Sofia',
    role: 'Checker',
    status: 'waiting',
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Bridge',
    status: 'waiting',
  },
];

export default function ConsolePage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string>('');
  const [activeCitizen, setActiveCitizen] = useState<CitizenName>('rafael');
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [workspaceWidth, setWorkspaceWidth] = useState(60); // percentage (chat gets 40%)
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    loadMissions();
  }, []);

  // Load messages when mission or citizen changes
  useEffect(() => {
    if (activeMissionId) {
      loadMessages();
    }
  }, [activeMissionId, activeCitizen]);

  // Handle mouse drag for resizing panels
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const windowWidth = window.innerWidth - 200; // Subtract mission selector width
      const newWidth = ((e.clientX - 200) / windowWidth) * 100;
      // Constrain between 20% and 80%
      if (newWidth >= 20 && newWidth <= 80) {
        setWorkspaceWidth(newWidth);
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

  const loadMissions = async () => {
    try {
      const missionsData = await api.listMissions();
      setMissions(missionsData);

      // Select first mission by default
      if (missionsData.length > 0) {
        setActiveMissionId(missionsData[0].id);
      }
    } catch (error) {
      console.error('Failed to load missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesData = await api.getMessages(activeMissionId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    setIsChatLoading(true);
    try {
      await api.sendMessage(activeMissionId, message);
      // Reload messages to get updated chat history
      const updatedMessages = await api.getMessages(activeMissionId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleMissionSelect = (id: string) => {
    setActiveMissionId(id);
  };

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--slk-bg)',
        color: 'var(--slk-text)'
      }}>
        <div>Loading missions...</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--slk-bg)',
      overflow: 'hidden'
    }}>
      {/* Left panel: Mission Selector */}
      <MissionSelector
        missions={missions}
        activeMissionId={activeMissionId}
        onSelect={handleMissionSelect}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          background: 'var(--slk-surface)',
          borderBottom: '1px solid rgba(230, 234, 242, 0.08)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'var(--slk-text)',
              margin: 0
            }}>Mission Deck</h1>
            {activeMissionId && (
              <span style={{
                color: 'var(--slk-muted)',
                fontSize: '0.875rem'
              }}>
                Mission #{activeMissionId}
              </span>
            )}
          </div>

          <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
            Log Out
          </button>
        </div>

        {/* Citizen selector */}
        {activeMissionId && (
          <CitizenSelector
            citizens={CITIZENS}
            activeCitizen={activeCitizen}
            onSelect={setActiveCitizen}
          />
        )}

        {/* Content area: Workspace + Chat */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {!activeMissionId && (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slk-muted)'
            }}>
              No mission selected. Select a mission from the left panel.
            </div>
          )}

          {activeMissionId && (
            <>
              {/* Left: Workspace content */}
              <div style={{
                width: `${workspaceWidth}%`,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                {activeCitizen === 'emma' && (
                  <EmmaWorkspace missionId={activeMissionId} />
                )}

                {activeCitizen === 'rafael' && (
                  <RafaelWorkspace missionId={activeMissionId} />
                )}

                {activeCitizen === 'sofia' && (
                  <SofiaWorkspace missionId={activeMissionId} />
                )}

                {activeCitizen !== 'emma' &&
                  activeCitizen !== 'rafael' &&
                  activeCitizen !== 'sofia' && (
                    <div style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--slk-muted)',
                      padding: '24px'
                    }}>
                      {activeCitizen.charAt(0).toUpperCase() + activeCitizen.slice(1)}{' '}
                      workspace - Week 2 feature (not implemented yet)
                    </div>
                  )}
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

              {/* Right: Chat (always visible) */}
              <div style={{
                width: `${100 - workspaceWidth}%`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                  citizens={CITIZENS}
                  activeCitizen={activeCitizen}
                  onSelectCitizen={setActiveCitizen}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
