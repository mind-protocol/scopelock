'use client';

import { useState } from 'react';
import styles from '../styles.module.css';

export function QuickReferenceCard() {
  const [copied, setCopied] = useState(false);

  const template = `[AI Citizen Name], working on Mission #[X] ([project name]).

[What I'm trying to do]

**Current state:**
[What's happening now]

**Error:**
[Full error message or issue description]

**What I tried:**
1. [First attempt]
2. [Second attempt]

**Environment:**
- [OS/platform]
- [Branch]
- [Relevant config]

**Question:**
[Specific question]

**Repo:** [GitHub URL]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.quickRefCard}>
      <div className={styles.quickRefTitle}>
        📋 Question Template (Copy This!)
      </div>

      <div style={{ marginBottom: '24px', color: '#9AA3AE', textAlign: 'center' }}>
        Use this template every time you ask an AI citizen for help
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px 16px',
            background: copied ? 'rgba(92, 226, 126, 0.2)' : 'rgba(30, 229, 184, 0.2)',
            border: `1px solid ${copied ? '#5CE27E' : '#1EE5B8'}`,
            borderRadius: '6px',
            color: copied ? '#5CE27E' : '#1EE5B8',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.background = 'rgba(30, 229, 184, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.background = 'rgba(30, 229, 184, 0.2)';
            }
          }}
        >
          {copied ? '✓ Copied!' : 'Copy Template'}
        </button>

        <div className={styles.templateBox}>
          {template}
        </div>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(100, 168, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(100, 168, 255, 0.2)' }}>
        <strong style={{ color: '#64A8FF', display: 'block', marginBottom: '8px' }}>
          💡 Pro Tip:
        </strong>
        <div style={{ color: '#9AA3AE', fontSize: '0.9375rem', lineHeight: '1.6' }}>
          Save this template to a text file on your desktop. When you need help, open it, fill in the
          blanks, and paste to Claude. You'll get answers 3-5x faster.
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', background: 'rgba(21, 26, 33, 0.6)', borderRadius: '8px', border: '1px solid rgba(154, 163, 174, 0.1)' }}>
          <div style={{ fontSize: '0.875rem', color: '#9AA3AE', marginBottom: '4px' }}>Before using template:</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FF5D5D' }}>6 hours</div>
          <div style={{ fontSize: '0.875rem', color: '#9AA3AE' }}>debugging time</div>
        </div>

        <div style={{ padding: '16px', background: 'rgba(21, 26, 33, 0.6)', borderRadius: '8px', border: '1px solid rgba(154, 163, 174, 0.1)' }}>
          <div style={{ fontSize: '0.875rem', color: '#9AA3AE', marginBottom: '4px' }}>After using template:</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#5CE27E' }}>2 minutes</div>
          <div style={{ fontSize: '0.875rem', color: '#9AA3AE' }}>to working code</div>
        </div>
      </div>
    </div>
  );
}
