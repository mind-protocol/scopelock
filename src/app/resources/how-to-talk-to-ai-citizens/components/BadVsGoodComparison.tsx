'use client';

import styles from '../styles.module.css';

export function BadVsGoodComparison() {
  return (
    <div className={styles.comparisonContainer}>
      {/* Bad Example */}
      <div>
        <div className={styles.badge + ' ' + styles.bad}>❌ Bad Example</div>
        <div className={styles.codeBlock + ' ' + styles.bad} style={{ marginTop: '16px' }}>
          <div style={{ color: '#FF5D5D', marginBottom: '12px' }}>
            "Rafael, the login isn't working. Can you fix it?"
          </div>
          <div style={{ color: '#9AA3AE', fontSize: '0.8125rem', marginTop: '16px', borderTop: '1px solid rgba(154, 163, 174, 0.1)', paddingTop: '12px' }}>
            <strong style={{ color: '#FF5D5D' }}>Why this fails:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Which project?</li>
              <li>Which login flow?</li>
              <li>What error?</li>
              <li>What did you try?</li>
            </ul>
            <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(255, 93, 93, 0.1)', borderRadius: '4px' }}>
              <strong>Result:</strong> Rafael guesses wrong → 2 hours wasted
            </div>
          </div>
        </div>
      </div>

      {/* Good Example */}
      <div>
        <div className={styles.badge + ' ' + styles.good}>✅ Good Example</div>
        <div className={styles.codeBlock + ' ' + styles.good} style={{ marginTop: '16px' }}>
          <div style={{ color: '#5CE27E', marginBottom: '8px', fontWeight: 600 }}>
            Rafael, working on Mission #47 (TherapyKin voice feature).
          </div>
          <div style={{ marginTop: '12px' }}>
            The OTP login flow is failing at signup.
          </div>
          <div style={{ marginTop: '12px' }}>
            <strong>What I tried:</strong>
            <ol style={{ marginTop: '4px', paddingLeft: '20px' }}>
              <li>User enters phone number</li>
              <li>Clicks "Send Code"</li>
              <li>Error: "Failed to send OTP"</li>
            </ol>
          </div>
          <div style={{ marginTop: '12px' }}>
            <strong>Error from console:</strong><br />
            <code style={{ color: '#FF5D5D' }}>TwilioError: Invalid phone number format</code>
          </div>
          <div style={{ marginTop: '12px' }}>
            <strong>Environment:</strong>
            <ul style={{ marginTop: '4px', paddingLeft: '20px', fontSize: '0.8125rem' }}>
              <li>Local dev (npm run dev)</li>
              <li>Branch: feature/voice-otp</li>
              <li>.env has TWILIO_AUTH_TOKEN set</li>
            </ul>
          </div>
          <div style={{ color: '#9AA3AE', fontSize: '0.8125rem', marginTop: '16px', borderTop: '1px solid rgba(154, 163, 174, 0.1)', paddingTop: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(92, 226, 126, 0.1)', borderRadius: '4px' }}>
              <strong style={{ color: '#5CE27E' }}>Result:</strong> Rafael sees exact issue → provides fix in 2 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
