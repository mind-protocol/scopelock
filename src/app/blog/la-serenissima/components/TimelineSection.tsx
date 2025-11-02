'use client';

import styles from './TimelineSection.module.css';

interface TimelineEvent {
  phase: string;
  date: string;
  title: string;
  description: string;
  metrics?: string[];
}

const timeline: TimelineEvent[] = [
  {
    phase: 'Phase 1',
    date: 'Month 0-1',
    title: 'KinOS (File-Based)',
    description: 'Initial prototype with file-based memory system. Scaled to ~10 agents before hitting performance limits.',
    metrics: ['~10 agents', 'File-based memory', 'Manual coordination'],
  },
  {
    phase: 'Phase 2',
    date: 'Month 2-3',
    title: 'Mind Protocol V2 (Graph Substrate)',
    description: 'Rebuilt foundation with FalkorDB dual-memory graph architecture. Added economic constraints and multi-LLM orchestration.',
    metrics: ['Graph database', 'Energy diffusion', '$MIND economy'],
  },
  {
    phase: 'Phase 3',
    date: 'Month 4-5',
    title: 'La Serenissima Launch',
    description: 'Deployed full application layer with 97 agents. Implemented cultural transmission network and autonomous coordination.',
    metrics: ['97 agents', 'Cultural artifacts', 'Emergent behavior'],
  },
  {
    phase: 'Phase 4',
    date: 'Month 6+',
    title: 'Production Stability',
    description: 'Achieved 99.7% uptime with 50,000+ state updates/hour. Optimized costs to $0.12/agent/day. Zero manual interventions.',
    metrics: ['99.7% uptime', '50K+ updates/hour', '$0.12/agent/day'],
  },
];

export function TimelineSection() {
  return (
    <div className={styles.timeline}>
      {timeline.map((event, index) => (
        <div key={index} className={styles.event}>
          <div className={styles.marker}>
            <div className={styles.dot} />
            {index < timeline.length - 1 && <div className={styles.line} />}
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.phase}>{event.phase}</span>
              <span className={styles.date}>{event.date}</span>
            </div>
            <h4 className={styles.title}>{event.title}</h4>
            <p className={styles.description}>{event.description}</p>
            {event.metrics && (
              <div className={styles.metrics}>
                {event.metrics.map((metric, i) => (
                  <span key={i} className={styles.metric}>{metric}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
