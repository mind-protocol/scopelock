import Link from 'next/link';

export const metadata = {
  title: 'Mission Deck - ScopeLock Internal Developer Dashboard',
  description: 'Internal developer dashboard for mission execution with AI citizen guidance',
};

export default function MissionDeckPage() {
  return (
    <main className="container">
      <section className="hero-simple">
        <h1>Mission Deck</h1>
        <p className="subtitle">
          Internal developer dashboard for mission execution with AI citizen guidance
        </p>
      </section>

      <section className="content-section">
        <div className="feature-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* What is Mission Deck */}
          <div className="feature-card">
            <h2>🎯 What is Mission Deck?</h2>
            <p>
              Mission Deck is ScopeLock's internal developer dashboard that provides:
            </p>
            <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
              <li><strong>Mission Overview:</strong> See all assigned missions with budgets, deadlines, and status</li>
              <li><strong>AI Citizen Workspaces:</strong> Switch between Emma, Inna, Rafael, Sofia, and Maya for specialized guidance</li>
              <li><strong>Code Generation:</strong> Rafael generates complete implementations you can review and deploy</li>
              <li><strong>Real-time Guidance:</strong> Chat with AI citizens for implementation help</li>
              <li><strong>Quality Verification:</strong> Sofia checks your work against DoD before delivery</li>
            </ul>
          </div>

          {/* Status */}
          <div className="feature-card" style={{ background: 'var(--surface-accent)' }}>
            <h2>🚧 Status: In Development</h2>
            <p>
              Mission Deck is currently being built for ScopeLock's internal team.
              It will provide a unified interface for developers to work on missions
              with AI citizen assistance at every step.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
              <strong>Target Launch:</strong> Week 1 MVP (Rafael workspace)
            </p>
          </div>

          {/* Key Features */}
          <div className="feature-card">
            <h2>⚡ Key Features</h2>
            <div style={{ textAlign: 'left' }}>
              <p><strong>Left Panel:</strong> Mission selector with quick-switch between active missions</p>
              <p><strong>Citizen Selector:</strong> Emma → Inna → Rafael → Sofia → Maya workflow</p>
              <p><strong>Rafael Workspace:</strong></p>
              <ul>
                <li>GitHub PR preview (commits, files changed, diff)</li>
                <li>Implementation chat guidance</li>
                <li>One-click code pull</li>
              </ul>
              <p style={{ marginTop: '1rem' }}><strong>Sofia Workspace:</strong> DoD checklist verification before delivery</p>
            </div>
          </div>

          {/* Documentation */}
          <div className="feature-card">
            <h2>📚 Documentation</h2>
            <p>Complete Mission Deck documentation is available in the ScopeLock repository:</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="https://github.com/mind-protocol/scopelock/tree/main/docs/missions/mission-deck"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View Docs on GitHub →
              </a>
            </div>
          </div>

          {/* For Team Members */}
          <div className="feature-card" style={{ background: 'var(--surface)' }}>
            <h2>👥 For ScopeLock Team Members</h2>
            <p>
              Mission Deck is being built iteratively. The first version (Rafael workspace)
              will be deployed as a separate application. Access will be provided to team
              members once the MVP is ready.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <strong>Questions?</strong> Ask Nicolas on Telegram (@nlr_ai)
            </p>
          </div>

        </div>
      </section>

      {/* Back to Home */}
      <section className="content-section" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <Link href="/" className="btn-secondary">
          ← Back to Home
        </Link>
      </section>
    </main>
  );
}
