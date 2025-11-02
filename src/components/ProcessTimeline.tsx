'use client';

import styles from './ProcessTimeline.module.css';

interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  tag?: string;
  duration?: string;
  optional?: boolean;
}

const processSteps: ProcessStep[] = [
  {
    number: '1',
    title: 'ScopeLock Phase',
    subtitle: 'Co-author acceptance criteria',
    description: 'We write AC.md together defining functional requirements, performance thresholds, and verification tests.',
    deliverables: [
      'AC.md with functional + non-functional criteria',
      'Verification command + seed data',
      'Git tag: ac-baseline_*',
      'Fixed price agreed',
    ],
    tag: 'ac-baseline_*',
    duration: 'Free (30-60 min)',
  },
  {
    number: '2',
    title: 'Evidence Sprint',
    subtitle: 'Prove value in 2-5 days',
    description: 'Build a working demo and measure quantifiable improvements. Validate assumptions before full commitment.',
    deliverables: [
      'Working demo (≤90 seconds)',
      'DELTA.md with quantified metrics',
      'Published /proof entry',
      'Decision point: continue or stop',
    ],
    tag: 'evidence-sprint_*',
    duration: '2-5 days',
  },
  {
    number: '3',
    title: 'Build → AC Green',
    subtitle: 'Tests passing = delivery',
    description: 'Implement the feature with acceptance tests. When all tests pass in CI, we tag ac-green and invoice.',
    deliverables: [
      'Production-ready code',
      'All acceptance tests passing',
      'Performance thresholds met',
      'Git tag: ac-green_*',
      'Invoice issued',
    ],
    tag: 'ac-green_*',
    duration: '1-4 weeks',
  },
  {
    number: 'CR',
    title: 'Change Control',
    subtitle: 'Scope changes without drama',
    description: 'If scope changes after baseline, open a Change Request. Either Swap (€0, same milestone) or Add (new milestone, priced).',
    deliverables: [
      'Swap: equal/lower complexity → €0',
      'Add: new scope → new milestone',
      'Git tag: change-req_*',
      'Transparent status in /proof',
    ],
    tag: 'change-req_*',
    duration: 'As needed',
    optional: true,
  },
];

export function ProcessTimeline() {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <h2>The ScopeLock Delivery Flow</h2>
        <p>From acceptance criteria to AC green—measurable, predictable, proven.</p>
      </div>

      <div className={styles.steps}>
        {processSteps.map((step, index) => (
          <div key={index} className={`${styles.step} ${step.optional ? styles.stepOptional : ''}`}>
            <div className={styles.stepNumber}>
              <span>{step.number}</span>
            </div>

            {index < processSteps.length - 1 && !step.optional && (
              <div className={styles.connector}>
                <svg width="2" height="100%" viewBox="0 0 2 100" preserveAspectRatio="none">
                  <line x1="1" y1="0" x2="1" y2="100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            )}

            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <h3>{step.title}</h3>
                {step.duration && <span className={styles.duration}>{step.duration}</span>}
              </div>
              <p className={styles.subtitle}>{step.subtitle}</p>
              <p className={styles.description}>{step.description}</p>

              <div className={styles.deliverables}>
                <strong>Deliverables:</strong>
                <ul>
                  {step.deliverables.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {step.tag && (
                <div className={styles.tag}>
                  <code>{step.tag}</code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.timelineFooter}>
        <div className={styles.principle}>
          <strong>Core Principle:</strong> You pay only when tests pass. No "almost done" ambiguity.
        </div>
      </div>
    </div>
  );
}
