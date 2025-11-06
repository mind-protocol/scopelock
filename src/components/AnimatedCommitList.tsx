'use client';

import { useEffect, useState } from 'react';
import styles from './AnimatedCommitList.module.css';

interface CommitData {
  sha: string;
  message: string;
  url: string;
  repo: string;
  isAI: boolean;
  timestamp: string;
}

interface AnimatedCommitListProps {
  commits: CommitData[];
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const commitDate = new Date(timestamp);
  const diffMs = now.getTime() - commitDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return commitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export function AnimatedCommitList({ commits }: AnimatedCommitListProps) {
  const [visibleCount, setVisibleCount] = useState(10); // Start with 10 visible
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded && visibleCount < commits.length) {
      // Gradually reveal more commits when expanded
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 5, commits.length));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, visibleCount, commits.length]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setVisibleCount(10);
  };

  return (
    <div className={styles.commitContainer}>
      <ul className={styles.commitList}>
        {commits.slice(0, visibleCount).map((commit, index) => (
          <li
            key={commit.sha + commit.repo}
            className={styles.commitItem}
            style={{
              animationDelay: `${index * 0.03}s`,
              opacity: 0,
              animation: `${styles.fadeInUp} 0.4s ease forwards`
            }}
          >
            <a href={commit.url} target="_blank" rel="noopener" className={styles.commitLink}>
              <span className={styles.commitSha}>{commit.sha}</span>
              <span className={styles.commitMsg}>{commit.message}</span>
              <span className={styles.commitRepo}>{commit.repo.split('/')[1]}</span>
              <span className={styles.commitTime}>{getRelativeTime(commit.timestamp)}</span>
              <span className={`${styles.commitAuthor} ${commit.isAI ? styles.ai : styles.human}`}>
                {commit.isAI ? 'AI' : 'Human'}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {!isExpanded && commits.length > 10 && (
        <button onClick={handleExpand} className={styles.expandButton}>
          Show all {commits.length} commits →
        </button>
      )}

      {isExpanded && (
        <button onClick={handleCollapse} className={styles.collapseButton}>
          Show less ↑
        </button>
      )}
    </div>
  );
}
