// Console Page - Main Mission Deck Dashboard
// Maps to: docs/missions/mission-deck/AC.md F2-F5
// Layout: Mission Selector (left) + Main Area (Citizen Selector + Workspace)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { MissionSelector } from '../../../components/mission-deck/MissionSelector';
import { EmmaWorkspace } from '../../../components/mission-deck/EmmaWorkspace';
import { RafaelWorkspace } from '../../../components/mission-deck/RafaelWorkspace';
import { SofiaWorkspace } from '../../../components/mission-deck/SofiaWorkspace';
import type { Mission, CitizenInfo, CitizenName } from '../../../types';

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

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    loadMissions();
  }, []);

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

        {/* Workspace area */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {!activeMissionId && (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--slk-muted)'
            }}>
              No mission selected. Select a mission from the left panel.
            </div>
          )}

          {activeMissionId && activeCitizen === 'emma' && (
            <EmmaWorkspace missionId={activeMissionId} />
          )}

          {activeMissionId && activeCitizen === 'rafael' && (
            <RafaelWorkspace
              missionId={activeMissionId}
              citizens={CITIZENS}
              activeCitizen={activeCitizen}
              onSelectCitizen={setActiveCitizen}
            />
          )}

          {activeMissionId && activeCitizen === 'sofia' && (
            <SofiaWorkspace missionId={activeMissionId} />
          )}

          {activeMissionId &&
            activeCitizen !== 'emma' &&
            activeCitizen !== 'rafael' &&
            activeCitizen !== 'sofia' && (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--slk-muted)'
              }}>
                {activeCitizen.charAt(0).toUpperCase() + activeCitizen.slice(1)}{' '}
                workspace - Week 2 feature (not implemented yet)
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
