'use client';

import { useState } from 'react';
import styles from '../styles.module.css';

export function ScenarioCards() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const scenarios = [
    {
      title: 'Scenario 1: "Code isn\'t working"',
      icon: '💻',
      bad: `"Rafael, the component doesn't render"`,
      good: `Rafael, working on Mission #52 (KongInvest trading dashboard).

The TradeHistory component renders blank on /dashboard page.

**Error in console:**
TypeError: Cannot read property 'map' of undefined
at TradeHistory.tsx:45

**Code (TradeHistory.tsx:45):**
{trades.map(trade => <TradeRow key={trade.id} trade={trade} />)}

**Expected:** Show list of trades
**Actual:** Blank screen

**Environment:**
- Local dev (npm run dev)
- Branch: feature/dashboard

Can you help?`,
    },
    {
      title: 'Scenario 2: "How do I implement feature X?"',
      icon: '🔧',
      bad: `"How do I add authentication?"`,
      good: `Rafael, I need to implement email authentication for Mission #48 (DigitalKin admin panel).

**Requirements from AC.md:**
- Email + password login
- JWT tokens
- Remember me checkbox
- Password reset flow

**Current state:**
- Blank login page exists at /login
- No auth logic yet
- Using Next.js 14 App Router

**Question:**
What's the best approach? Should I use NextAuth or custom JWT implementation?

**Repo:** github.com/scopelock/digitalkin
**Branch:** feature/auth`,
    },
    {
      title: 'Scenario 3: "Is this ready to deploy?"',
      icon: '✅',
      bad: `"Sofia, check Mission #45"`,
      good: `Sofia, please verify Mission #45 (TherapyKin chat feature) is ready for delivery.

**What I completed:**
1. Implemented real-time chat (Socket.io)
2. Added message history
3. Deployed to Render
4. Tested locally

**AC.md requirements:**
- Real-time messaging ✅
- Message persistence ✅
- User presence indicators ✅
- Performance: messages <100ms ⚠️ (need verification)

**Live URL:** https://therapykin-staging.onrender.com/chat
**Test account:** user@test.com / password123

Can you run through the DoD checklist?`,
    },
    {
      title: 'Scenario 4: "Deployment failing"',
      icon: '🚀',
      bad: `"The deploy doesn't work"`,
      good: `Rafael, Mission #50 (Serenissima agent system) - deployment to Render is failing.

**What I'm deploying:**
5 new agents (agent-alpha through agent-epsilon)

**Error from Render:**
Error: build failed
npm ERR! Missing script: "build"

**What I tried:**
1. Added "build": "tsc" to package.json
2. Still fails with same error
3. Works fine locally (npm run build succeeds)

**Render logs:**
[paste full build log]

**Repo:** github.com/mind-protocol/serenissima
**Branch:** feature/new-agents
**Render service:** serenissima-prod

What am I missing?`,
    },
  ];

  return (
    <div>
      <div className={styles.cardGrid}>
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={() => setSelectedScenario(selectedScenario === index ? null : index)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.cardTitle}>
              <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{scenario.icon}</span>
              {scenario.title}
            </div>
            <div className={styles.cardContent}>
              Click to {selectedScenario === index ? 'hide' : 'view'} examples
            </div>
          </div>
        ))}
      </div>

      {/* Expanded scenario details */}
      {selectedScenario !== null && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ color: '#1EE5B8', fontSize: '1.5rem', marginBottom: '24px' }}>
            {scenarios[selectedScenario].icon} {scenarios[selectedScenario].title}
          </h3>

          <div className={styles.comparisonContainer}>
            {/* Bad Example */}
            <div>
              <div className={styles.badge + ' ' + styles.bad}>❌ Bad</div>
              <div className={styles.codeBlock + ' ' + styles.bad} style={{ marginTop: '16px' }}>
                {scenarios[selectedScenario].bad}
              </div>
            </div>

            {/* Good Example */}
            <div>
              <div className={styles.badge + ' ' + styles.good}>✅ Good</div>
              <div className={styles.codeBlock + ' ' + styles.good} style={{ marginTop: '16px', whiteSpace: 'pre-wrap' }}>
                {scenarios[selectedScenario].good}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedScenario(null)}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: 'rgba(154, 163, 174, 0.1)',
              border: '1px solid rgba(154, 163, 174, 0.2)',
              borderRadius: '8px',
              color: '#9AA3AE',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(154, 163, 174, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(154, 163, 174, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(154, 163, 174, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(154, 163, 174, 0.2)';
            }}
          >
            Close Example
          </button>
        </div>
      )}
    </div>
  );
}
