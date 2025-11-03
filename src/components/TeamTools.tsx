import styles from './TeamTools.module.css';

const aiCitizens = [
  {
    name: 'Emma',
    nickname: 'The Scout',
    domain: 'Lead Intelligence',
    description: 'Prospecting, triage, proposal inputs',
    color: 'accent',
  },
  {
    name: 'Rafael',
    nickname: 'The Harbor',
    domain: 'Client Relationships',
    description: 'Client ops, AC co-authoring, change requests',
    color: 'accent2',
  },
  {
    name: 'Sofia',
    nickname: 'The Gauge',
    domain: 'Quality Guardian',
    description: 'Code review, fail-loud enforcement, baseline protection',
    color: 'success',
  },
  {
    name: 'Daniel',
    nickname: 'The Forge',
    domain: 'Core Builder',
    description: 'Features, acceptance tests, performance optimization',
    color: 'accent',
  },
  {
    name: 'Aïcha',
    nickname: 'The Architect',
    domain: 'System Architecture',
    description: 'Event schemas, contracts, change control semantics',
    color: 'accent2',
  },
  {
    name: 'Maya',
    nickname: 'The Facet',
    domain: 'Frontend & UX',
    description: 'UI implementation, /proof pages, accessibility',
    color: 'accent',
  },
  {
    name: 'Priya',
    nickname: 'The Pulse',
    domain: 'Operations',
    description: 'Health monitoring, deployment, incident response',
    color: 'warning',
  },
];

const tooling = [
  {
    name: 'Claude',
    description: 'Core AI reasoning engine',
    category: 'AI Platform',
  },
  {
    name: 'Cursor',
    description: 'AI-native code editor',
    category: 'Development',
  },
  {
    name: 'aider',
    description: 'AI pair programming',
    category: 'Development',
  },
  {
    name: 'GitHub',
    description: '65K commits in 2024',
    category: 'Version Control',
  },
  {
    name: 'Next.js',
    description: 'React framework',
    category: 'Frontend',
  },
  {
    name: 'FastAPI',
    description: 'Python async backend',
    category: 'Backend',
  },
  {
    name: 'PostgreSQL',
    description: 'Primary database',
    category: 'Data',
  },
  {
    name: 'Vercel',
    description: 'Deployment platform',
    category: 'Infrastructure',
  },
];

export function TeamTools() {
  return (
    <div className={styles.teamTools}>
      {/* AI Citizens Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>AI Citizens (Specialized Agents)</h2>
          <p>7 autonomous specialists with domain ownership, persistent memory, and decision-making authority.</p>
        </div>

        <div className={styles.citizensGrid}>
          {aiCitizens.map((citizen) => (
            <div key={citizen.name} className={`${styles.citizenCard} ${styles[`citizen${citizen.color}`]}`}>
              <div className={styles.citizenHeader}>
                <h3>{citizen.name}</h3>
                <span className={styles.nickname}>{citizen.nickname}</span>
              </div>
              <div className={styles.citizenDomain}>{citizen.domain}</div>
              <p className={styles.citizenDescription}>{citizen.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.citizenFooter}>
          <p>
            <strong>Not autocomplete.</strong> These are autonomous agents with 15 years of custom tooling
            + domain-specific AI infrastructure. Parallel work streams without coordination overhead.
          </p>
        </div>
      </section>

      {/* Tooling Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Development Tooling</h2>
          <p>Modern stack optimized for AI-assisted development and rapid iteration.</p>
        </div>

        <div className={styles.toolingGrid}>
          {tooling.map((tool) => (
            <div key={tool.name} className={styles.toolCard}>
              <div className={styles.toolHeader}>
                <h4>{tool.name}</h4>
                <span className={styles.toolCategory}>{tool.category}</span>
              </div>
              <p className={styles.toolDescription}>{tool.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.toolingFooter}>
          <p>
            <strong>Result:</strong> 10-15 features/week vs. 2-3 for traditional solo dev.
            Team-level throughput with single-architect clarity.
          </p>
        </div>
      </section>
    </div>
  );
}
