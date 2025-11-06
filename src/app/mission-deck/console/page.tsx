// Console Page - Main Mission Deck Dashboard
// Maps to: docs/missions/mission-deck/AC.md F2-F5
// Layout: Mission Selector (left) + Main Area (Citizen Selector + Workspace)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { MissionSelector } from '../../../components/mission-deck/MissionSelector';
import { CitizenSelector } from '../../../components/mission-deck/CitizenSelector';
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

  const handleLogout = () => {
    api.logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text">Loading missions...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left panel: Mission Selector */}
      <MissionSelector
        missions={missions}
        activeMissionId={activeMissionId}
        onSelect={setActiveMissionId}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-text">Mission Deck</h1>
            {activeMissionId && (
              <span className="text-muted text-sm">
                Mission #{activeMissionId}
              </span>
            )}
          </div>

          <button onClick={handleLogout} className="btn-secondary text-sm">
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

        {/* Workspace area */}
        <div className="flex-1 overflow-hidden">
          {!activeMissionId && (
            <div className="h-full flex items-center justify-center text-muted">
              No mission selected. Select a mission from the left panel.
            </div>
          )}

          {activeMissionId && activeCitizen === 'rafael' && (
            <RafaelWorkspace missionId={activeMissionId} />
          )}

          {activeMissionId && activeCitizen === 'sofia' && (
            <SofiaWorkspace missionId={activeMissionId} />
          )}

          {activeMissionId &&
            activeCitizen !== 'rafael' &&
            activeCitizen !== 'sofia' && (
              <div className="h-full flex items-center justify-center text-muted">
                {activeCitizen.charAt(0).toUpperCase() + activeCitizen.slice(1)}{' '}
                workspace - Week 2 feature (not implemented yet)
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
