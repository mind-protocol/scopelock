// SofiaWorkspace Component
// Maps to: docs/missions/mission-deck/AC.md F5 (Sofia Workspace)
// Implements: 2-panel layout - DoD Checklist (left) + Test Results (right)

'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type {
  DODItem,
  TestResult,
  PerformanceMetric,
} from '../types';

interface SofiaWorkspaceProps {
  missionId: string;
}

export function SofiaWorkspace({ missionId }: SofiaWorkspaceProps) {
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

  return (
    <div className="flex h-full">
      {/* Left panel: DoD Checklist */}
      <div className="w-1/2 border-r border-border overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-text">
              Definition of Done
            </h3>
            <span className="text-sm text-muted">
              {completedCount}/{totalCount} ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-hover rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
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
          <div className="text-muted text-sm p-4 panel">
            No DoD items defined for this mission
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex gap-2">
          <button className="btn-primary flex-1">Mark All Complete</button>
          <button className="btn-secondary">Reset</button>
        </div>
      </div>

      {/* Right panel: Test Results */}
      <div className="w-1/2 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold text-text mb-6">Test Results</h3>

        {/* Test results */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">
            Latest Test Run
          </h4>

          {testResults.length === 0 && (
            <div className="text-muted text-sm p-4 panel">
              No test results yet. Run tests to see results here.
            </div>
          )}

          <div className="space-y-2">
            {testResults.map((test) => (
              <div key={test.name} className="panel p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg ${
                        test.status === 'passed'
                          ? 'text-success'
                          : test.status === 'failed'
                          ? 'text-danger'
                          : 'text-warning'
                      }`}
                    >
                      {test.status === 'passed'
                        ? '✓'
                        : test.status === 'failed'
                        ? '✗'
                        : '○'}
                    </span>
                    <span className="text-text text-sm font-mono">
                      {test.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted">{test.duration}ms</span>
                </div>

                {test.error && (
                  <div className="mt-2 text-xs text-danger bg-danger/10 p-2 rounded">
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
            <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">
              Performance Metrics
            </h4>

            <div className="space-y-2">
              {performanceMetrics.map((metric) => (
                <div key={metric.name} className="panel p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text text-sm">{metric.name}</span>
                    <span
                      className={`text-sm font-semibold ${
                        metric.status === 'pass'
                          ? 'text-success'
                          : metric.status === 'warn'
                          ? 'text-warning'
                          : 'text-danger'
                      }`}
                    >
                      {metric.actual}
                      {metric.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>Threshold: {metric.threshold}{metric.unit}</span>
                    <span>•</span>
                    <span
                      className={
                        metric.status === 'pass' ? 'text-success' : 'text-danger'
                      }
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
        <div className="mt-6 flex gap-2">
          <button className="btn-secondary flex-1">Re-run Tests</button>
          <button className="btn-secondary">View Logs</button>
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
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">
        {title}
      </h4>

      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 p-3 panel hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 w-4 h-4 accent-accent"
            />

            <div className="flex-1">
              <div className={`text-sm ${item.completed ? 'text-muted line-through' : 'text-text'}`}>
                {item.text}
              </div>

              {item.completed_at && (
                <div className="text-xs text-muted mt-1">
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
