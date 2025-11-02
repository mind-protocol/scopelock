import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import styles from '../proof.module.css';

interface ProofEntry {
  tag: string;
  type: string;
  date: string;
  feature: string;
  featureLabel: string;
  commit: string;
  demoUrl: string | null;
  files: {
    AC: string | null;
    DEMO: string | null;
    DELTA: string | null;
  };
}

async function getProofEntries(): Promise<ProofEntry[]> {
  try {
    const proofIndexPath = path.join(process.cwd(), 'public', 'proof', 'index.json');
    const data = await fs.readFile(proofIndexPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('No proof data found, returning empty array');
    return [];
  }
}

export default async function ProofIndexPage() {
  const entries = await getProofEntries();
  const displayEntries = entries.slice(0, 10);

  return (
    <main className={styles.proofPage}>
      <header className={`${styles.stack} ${styles.intro}`}>
        <h1>Proof Log</h1>
        <p className="lead">Evidence sprints and AC green tags rendered at build time.</p>
        <div className={styles.legend} role="note">
          <span className={styles.dotEvidence} aria-hidden="true"></span>
          <span>Evidence sprint</span>
          <span className={styles.dotGreen} aria-hidden="true"></span>
          <span>AC green</span>
        </div>
      </header>

      {entries.length === 0 ? (
        <section className={styles.empty}>
          <div className="card">
            <h2>No proof tags yet</h2>
            <p style={{color: 'var(--slk-muted)'}}>
              Add git tags named <code>evidence-sprint_*</code> or <code>ac-green_*</code> with proof markdown to populate this log.
            </p>
          </div>
        </section>
      ) : (
        <section>
          <header className={styles.listHead}>
            <h2>Latest {displayEntries.length} of {entries.length}</h2>
          </header>
          <ul className={styles.proofList}>
            {displayEntries.map((entry) => {
              const dotClass = entry.type === 'ac-green' ? styles.dotGreen : styles.dotEvidence;
              const displayFeature = entry.featureLabel || entry.feature;

              return (
                <li key={entry.tag} data-type={entry.type} data-feature={entry.feature}>
                  <span className={dotClass} aria-hidden="true"></span>
                  <div className={styles.entry}>
                    <Link href={`/proof/${entry.tag}`}>{entry.tag}</Link>
                    <small>{entry.date} • {displayFeature}</small>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
