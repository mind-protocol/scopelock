'use client';

import { useState } from 'react';
import styles from './CodeComparison.module.css';

interface CodeComparisonProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function CodeComparison({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: CodeComparisonProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <div className={styles.comparison}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'before' ? styles.active : ''}`}
          onClick={() => setActiveTab('before')}
        >
          {beforeLabel}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'after' ? styles.active : ''}`}
          onClick={() => setActiveTab('after')}
        >
          {afterLabel}
        </button>
      </div>
      <div className={styles.codeContainer}>
        {activeTab === 'before' ? (
          <pre className={styles.code}>
            <code>{before}</code>
          </pre>
        ) : (
          <pre className={styles.code}>
            <code>{after}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
