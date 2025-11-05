'use client';

import styles from '../styles.module.css';

export function RedFlags() {
  const redFlags = [
    {
      title: 'Vague Questions',
      examples: [
        '"It doesn\'t work"',
        '"There\'s a bug"',
        '"Can you help?"',
      ],
      fix: 'Be specific. What doesn\'t work? Where? What error? Which project?',
      impact: 'AI guesses wrong, you waste 2+ hours',
    },
    {
      title: 'No Project Context',
      examples: [
        '"Fix the login"',
        '"The API is broken"',
        '"Deploy this"',
      ],
      fix: 'ALWAYS start with: "Working on Mission #X ([project name])"',
      impact: 'AI doesn\'t know which of 10+ projects you mean',
    },
    {
      title: 'Screenshots of Code',
      examples: [
        '[sends screenshot of error]',
        '[sends photo of screen]',
        '[screenshot of terminal]',
      ],
      fix: 'Copy-paste text instead. AI can\'t read images well.',
      impact: 'AI can\'t analyze code properly, gives generic advice',
    },
    {
      title: 'Asking Repeatedly Without Context',
      examples: [
        'First: "Fix the bug"',
        'Second: "Still broken"',
        'Third: "Why isn\'t this working?"',
      ],
      fix: 'Each message should have FULL context (error, code, environment)',
      impact: '6 messages back-and-forth = 30 minutes wasted',
    },
  ];

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {redFlags.map((flag, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(21, 26, 33, 0.6)',
            border: '1px solid rgba(255, 93, 93, 0.2)',
            borderLeft: '4px solid #FF5D5D',
            borderRadius: '8px',
            padding: '24px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 93, 93, 0.4)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 93, 93, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>🚩</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FF5D5D', marginBottom: '12px' }}>
                Red Flag #{index + 1}: {flag.title}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.875rem', color: '#9AA3AE', marginBottom: '8px' }}>
                  Examples of what NOT to do:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {flag.examples.map((example, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255, 93, 93, 0.05)',
                        border: '1px solid rgba(255, 93, 93, 0.1)',
                        borderRadius: '4px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.875rem',
                        color: '#FF5D5D',
                      }}
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(92, 226, 126, 0.05)', border: '1px solid rgba(92, 226, 126, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#5CE27E', marginBottom: '4px' }}>
                  ✅ Fix:
                </div>
                <div style={{ color: '#E6EAF2', fontSize: '0.9375rem' }}>
                  {flag.fix}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 200, 87, 0.05)', border: '1px solid rgba(255, 200, 87, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFC857', marginBottom: '4px' }}>
                  ⚠️ Impact if ignored:
                </div>
                <div style={{ color: '#9AA3AE', fontSize: '0.9375rem' }}>
                  {flag.impact}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary box */}
      <div style={{
        marginTop: '16px',
        padding: '24px',
        background: 'rgba(30, 229, 184, 0.05)',
        border: '2px solid rgba(30, 229, 184, 0.2)',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1EE5B8', marginBottom: '8px' }}>
          Remember: Context Prevents Red Flags
        </div>
        <div style={{ color: '#9AA3AE', fontSize: '1rem' }}>
          When in doubt, provide MORE context, not less. You can't over-explain when asking for help.
        </div>
      </div>
    </div>
  );
}
