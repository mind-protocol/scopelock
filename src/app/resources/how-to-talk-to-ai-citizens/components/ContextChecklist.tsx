'use client';

import styles from '../styles.module.css';

export function ContextChecklist() {
  const mustHave = [
    {
      icon: '🎯',
      label: 'Which project/mission',
      example: 'e.g., "Mission #47 - TherapyKin"',
    },
    {
      icon: '🔨',
      label: 'What you\'re trying to do',
      example: 'e.g., "Implement OTP login"',
    },
    {
      icon: '💥',
      label: 'What\'s broken',
      example: 'e.g., "OTP not sending"',
    },
    {
      icon: '📄',
      label: 'Full error message',
      example: 'Copy-paste from console/terminal',
    },
  ];

  const shouldHave = [
    {
      icon: '🔍',
      label: 'What you tried',
      example: 'So AI doesn\'t suggest same thing',
    },
    {
      icon: '🌍',
      label: 'Environment',
      example: 'Local dev? Production? Which branch?',
    },
    {
      icon: '💻',
      label: 'Relevant code snippets',
      example: 'The file causing issues',
    },
  ];

  const niceToHave = [
    {
      icon: '📸',
      label: 'Screenshots',
      example: 'If UI issue (not code screenshots!)',
    },
    {
      icon: '🌐',
      label: 'Network logs',
      example: 'If API issue',
    },
    {
      icon: '⚙️',
      label: 'Configuration files',
      example: 'If setup issue',
    },
  ];

  return (
    <div>
      {/* Must Have */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#1EE5B8', fontSize: '1.25rem', marginBottom: '16px' }}>
          ✅ Must Have (Always)
        </h3>
        <ul className={styles.checklist}>
          {mustHave.map((item, index) => (
            <li key={index} className={styles.checklistItem}>
              <span className={styles.checklistIcon}>{item.icon}</span>
              <div className={styles.checklistText}>
                <strong>{item.label}</strong>
                <div style={{ color: '#9AA3AE', fontSize: '0.875rem', marginTop: '4px' }}>
                  {item.example}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Should Have */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#64A8FF', fontSize: '1.25rem', marginBottom: '16px' }}>
          ⚠️ Should Have (Usually)
        </h3>
        <ul className={styles.checklist}>
          {shouldHave.map((item, index) => (
            <li key={index} className={styles.checklistItem}>
              <span className={styles.checklistIcon}>{item.icon}</span>
              <div className={styles.checklistText}>
                <strong>{item.label}</strong>
                <div style={{ color: '#9AA3AE', fontSize: '0.875rem', marginTop: '4px' }}>
                  {item.example}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Nice to Have */}
      <div>
        <h3 style={{ color: '#9AA3AE', fontSize: '1.25rem', marginBottom: '16px' }}>
          💡 Nice to Have (When Relevant)
        </h3>
        <ul className={styles.checklist}>
          {niceToHave.map((item, index) => (
            <li key={index} className={styles.checklistItem}>
              <span className={styles.checklistIcon}>{item.icon}</span>
              <div className={styles.checklistText}>
                <strong>{item.label}</strong>
                <div style={{ color: '#9AA3AE', fontSize: '0.875rem', marginTop: '4px' }}>
                  {item.example}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
