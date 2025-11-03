import Link from 'next/link';
import { readFile } from 'fs/promises';
import { join } from 'path';
import styles from './ProofTeaser.module.css';

interface ProofEntry {
  tag: string;
  type: 'evidence-sprint' | 'ac-green' | 'change-req';
  date: string;
  feature: string;
  featureLabel: string;
  commit: string;
  demoUrl?: string;
  files: {
    AC: string;
    DEMO: string;
    DELTA: string;
  };
}

interface ProofIndex {
  entries: ProofEntry[];
}

const getStatusBadge = (type: string) => {
  switch (type) {
    case 'ac-green':
      return { label: 'AC Green', className: styles.badgeGreen };
    case 'evidence-sprint':
      return { label: 'Evidence Sprint', className: styles.badgeSprint };
    case 'change-req':
      return { label: 'Change Request', className: styles.badgeChange };
    default:
      return { label: type, className: styles.badgeDefault };
  }
};

export async function ProofTeaser() {
  let entries: ProofEntry[] = [];

  try {
    const proofIndexPath = join(process.cwd(), 'public', 'proof', 'index.json');
    const proofData = await readFile(proofIndexPath, 'utf-8');
    const proofIndex: ProofIndex = JSON.parse(proofData);
    entries = proofIndex.entries.slice(0, 3); // Latest 3 entries
  } catch (error) {
    // If proof index doesn't exist or can't be read, return empty state
    console.warn('Could not read proof index:', error);
  }

  if (entries.length === 0) {
    return (
      <section className={styles.proofTeaser}>
        <h2>Latest Deliveries</h2>
        <p className={styles.emptyState}>
          Proof entries will appear here as milestones are delivered.
        </p>
        <Link href="/proof" className={styles.viewAll}>
          View full Proof Log →
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.proofTeaser}>
      <div className={styles.header}>
        <h2>Latest Deliveries</h2>
        <p className={styles.subtitle}>
          Recent milestones tagged and published to the Proof Log.
        </p>
      </div>

      <div className={styles.entries}>
        {entries.map((entry) => {
          const badge = getStatusBadge(entry.type);
          const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <Link key={entry.tag} href={`/proof/${entry.tag}`} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div className={styles.entryTitle}>
                  <h3>{entry.featureLabel}</h3>
                  <span className={`${styles.badge} ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <time className={styles.date}>{formattedDate}</time>
              </div>

              <div className={styles.entryMeta}>
                <code className={styles.tag}>{entry.tag}</code>
                <span className={styles.commit}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M11.93 8.5a4.002 4.002 0 01-7.86 0H.75a.75.75 0 010-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 010 1.5h-3.32zM8 6a2 2 0 100 4 2 2 0 000-4z"/>
                  </svg>
                  {entry.commit}
                </span>
              </div>

              {entry.demoUrl && (
                <div className={styles.demo}>
                  <span>→ {entry.demoUrl}</span>
                </div>
              )}

              <div className={styles.files}>
                <span>AC.md</span>
                <span>DEMO.md</span>
                <span>DELTA.md</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={styles.footer}>
        <Link href="/proof" className={styles.viewAll}>
          View full Proof Log →
        </Link>
      </div>
    </section>
  );
}
