// SofiaWorkspace Component
// Maps to: docs/missions/mission-deck/AC.md F5 (Sofia Workspace)
// Implements: 2-panel layout - DoD Checklist (left) + Test Results (right)

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '../../lib/api';
import type {
  DODItem,
  TestResult,
  PerformanceMetric,
  CitizenInfo,
  CitizenName,
} from '../../types';

interface SofiaWorkspaceProps {
  missionId: string;
  citizens: CitizenInfo[];
  activeCitizen: CitizenName;
  onSelectCitizen: (citizen: CitizenName) => void;
}

export function SofiaWorkspace({ missionId, citizens, activeCitizen, onSelectCitizen }: SofiaWorkspaceProps) {
  const [dodItems, setDodItems] = useState<DODItem[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [missionId]);

  const loadData = async () => {
    try {
      const [dodData, testData, metricsData] = await Promise.all([
        api.getDODItems(missionId),
        api.getTestResults(missionId),
        api.getPerformanceMetrics(missionId),
      ]);
      setDodItems(dodData);
      setTestResults(testData);
      setPerformanceMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load Sofia workspace data:', error);
    }
  };

  const handleToggleDOD = async (itemId: string, completed: boolean) => {
    setIsLoading(true);
    try {
      await api.toggleDODItem(missionId, itemId, completed);
      // Reload DoD items
      const updatedDod = await api.getDODItems(missionId);
      setDodItems(updatedDod);
    } catch (error) {
      console.error('Failed to toggle DoD item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress
  const completedCount = dodItems.filter((item) => item.completed).length;
  const totalCount = dodItems.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group DoD items by category
  const functionalItems = dodItems.filter(
    (item) => item.category === 'functional'
  );
  const nonFunctionalItems = dodItems.filter(
    (item) => item.category === 'non-functional'
  );
  const testItems = dodItems.filter((item) => item.category === 'tests');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--slk-accent)';
      case 'complete': return 'var(--slk-success)';
      default: return 'rgba(154, 163, 174, 0.4)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Citizen Selector Header */}
      <div style={{
        borderBottom: '1px solid rgba(230, 234, 242, 0.08)',
        background: 'var(--slk-surface)',
        padding: '12px 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {citizens.map((citizen) => (
            <button
              key={citizen.id}
              onClick={() => onSelectCitizen(citizen.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                background: activeCitizen === citizen.id ? 'var(--slk-bg)' : 'transparent',
                border: activeCitizen === citizen.id ? '1px solid var(--slk-accent)' : '1px solid transparent',
                color: activeCitizen === citizen.id ? 'var(--slk-accent)' : 'var(--slk-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
              onMouseEnter={(e) => {
                if (activeCitizen !== citizen.id) {
                  e.currentTarget.style.background = 'var(--slk-bg)';
                  e.currentTarget.style.color = 'var(--slk-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCitizen !== citizen.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--slk-muted)';
                }
              }}
            >
              {/* Profile Picture */}
              <div style={{ position: 'relative' }}>
                <Image
                  src={`/citizens/${citizen.id}/avatar.png`}
                  alt={`${citizen.name} avatar`}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: '50%',
                    border: activeCitizen === citizen.id ? '2px solid var(--slk-accent)' : '2px solid transparent'
                  }}
                />
                {/* Status indicator overlay */}
                <span style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: getStatusColor(citizen.status),
                  border: '2px solid var(--slk-surface)',
                  display: 'inline-block'
                }} />
              </div>

              {/* Name + Role */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{citizen.name}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{citizen.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content: DoD + Test Results */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left panel: DoD Checklist */}
      <div style={{ width: '50%', borderRight: '1px solid var(--slk-border)', overflowY: 'auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)' }}>
              Definition of Done
            </h3>
            <span style={{ fontSize: '14px', color: 'var(--slk-muted)' }}>
              {completedCount}/{totalCount} ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', background: 'var(--slk-surface-hover)', borderRadius: '9999px', height: '8px' }}>
            <div
              style={{ background: 'var(--slk-accent)', height: '8px', borderRadius: '9999px', transition: 'all 0.3s', width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Functional criteria */}
        {functionalItems.length > 0 && (
          <DODSection
            title="Functional"
            items={functionalItems}
            onToggle={handleToggleDOD}
            isLoading={isLoading}
          />
        )}

        {/* Non-functional criteria */}
        {nonFunctionalItems.length > 0 && (
          <DODSection
            title="Non-Functional"
            items={nonFunctionalItems}
            onToggle={handleToggleDOD}
            isLoading={isLoading}
          />
        )}

        {/* Test criteria */}
        {testItems.length > 0 && (
          <DODSection
            title="Tests"
            items={testItems}
            onToggle={handleToggleDOD}
            isLoading={isLoading}
          />
        )}

        {dodItems.length === 0 && (
          <div style={{ color: 'var(--slk-muted)', fontSize: '14px', padding: '16px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px' }}>
            No DoD items defined for this mission
          </div>
        )}

        {/* Action buttons */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          <button style={{ flex: 1, padding: '10px 16px', background: 'var(--slk-accent)', color: 'var(--slk-bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Mark All Complete</button>
          <button style={{ padding: '10px 16px', background: 'var(--slk-surface)', color: 'var(--slk-text)', border: '1px solid var(--slk-border)', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
        </div>
      </div>

      {/* Right panel: Test Results */}
      <div style={{ width: '50%', overflowY: 'auto', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--slk-text)', marginBottom: '24px' }}>Test Results</h3>

        {/* Test results */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Latest Test Run
          </h4>

          {testResults.length === 0 && (
            <div style={{ color: 'var(--slk-muted)', fontSize: '14px', padding: '16px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px' }}>
              No test results yet. Run tests to see results here.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {testResults.map((test) => (
              <div key={test.name} style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '18px',
                        color: test.status === 'passed'
                          ? 'var(--slk-success)'
                          : test.status === 'failed'
                          ? 'var(--slk-danger)'
                          : 'var(--slk-warning)'
                      }}
                    >
                      {test.status === 'passed'
                        ? '✓'
                        : test.status === 'failed'
                        ? '✗'
                        : '○'}
                    </span>
                    <span style={{ color: 'var(--slk-text)', fontSize: '14px', fontFamily: 'monospace' }}>
                      {test.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--slk-muted)' }}>{test.duration}ms</span>
                </div>

                {test.error && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--slk-danger)', background: 'color-mix(in srgb, var(--slk-danger) 10%, transparent)', padding: '8px', borderRadius: '4px' }}>
                    {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance metrics */}
        {performanceMetrics.length > 0 && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Performance Metrics
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {performanceMetrics.map((metric) => (
                <div key={metric.name} style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--slk-text)', fontSize: '14px' }}>{metric.name}</span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: metric.status === 'pass'
                          ? 'var(--slk-success)'
                          : metric.status === 'warn'
                          ? 'var(--slk-warning)'
                          : 'var(--slk-danger)'
                      }}
                    >
                      {metric.actual}
                      {metric.unit}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--slk-muted)' }}>
                    <span>Threshold: {metric.threshold}{metric.unit}</span>
                    <span>•</span>
                    <span
                      style={{
                        color: metric.status === 'pass' ? 'var(--slk-success)' : 'var(--slk-danger)'
                      }}
                    >
                      {metric.status === 'pass' ? 'Within limits' : 'Exceeds threshold'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          <button style={{ flex: 1, padding: '10px 16px', background: 'var(--slk-surface)', color: 'var(--slk-text)', border: '1px solid var(--slk-border)', borderRadius: '4px', cursor: 'pointer' }}>Re-run Tests</button>
          <button style={{ padding: '10px 16px', background: 'var(--slk-surface)', color: 'var(--slk-text)', border: '1px solid var(--slk-border)', borderRadius: '4px', cursor: 'pointer' }}>View Logs</button>
        </div>
      </div>
      </div>
    </div>
  );
}

function DODSection({
  title,
  items,
  onToggle,
  isLoading,
}: {
  title: string;
  items: DODItem[];
  onToggle: (itemId: string, completed: boolean) => void;
  isLoading: boolean;
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slk-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <label
            key={item.id}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'var(--slk-surface)', border: '1px solid var(--slk-border)', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--slk-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--slk-surface)'}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              disabled={isLoading}
              style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: 'var(--slk-accent)' }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', color: item.completed ? 'var(--slk-muted)' : 'var(--slk-text)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                {item.text}
              </div>

              {item.completed_at && (
                <div style={{ fontSize: '12px', color: 'var(--slk-muted)', marginTop: '4px' }}>
                  Completed: {formatTime(item.completed_at)}
                </div>
              )}
            </div>
          </label>
        ))}
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
