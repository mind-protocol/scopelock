import Link from 'next/link';
import { Suspense } from 'react';
import { LiveCommits } from '../components/LiveCommits';
import { ProofTeaser } from '../components/ProofTeaser';
import { ContactForm } from '../components/ContactForm';

export default function HomePage() {
  return (
    <main>
      <header className="hero">
        <h1>Lock the scope.<br />Prove the value.</h1>
        <p className="lead">You'll know if we're good before you pay.</p>
        <p className="hero-pitch">
          Fixed-price software delivery with executable acceptance criteria—pay only when tests pass.
        </p>
        <p className="hero-tagline">
          Solo engineer + AI workforce · <a href="https://github.com/nlr-ai" target="_blank" rel="noopener" className="verify-link">65K commits in 2024 →</a>
        </p>
        <div className="hero-ctas">
          <a className="cta-primary" href="https://cal.com/lester-reynolds-ieksyx/30min" target="_blank" rel="noopener">
            <span>Book 30min kickoff</span>
            <span aria-hidden="true">→</span>
          </a>
          <Link className="cta-secondary" href="/proof">See proof log</Link>
          <a className="cta-tertiary" href="https://github.com/nlr-ai" target="_blank" rel="noopener">
            View code on GitHub
          </a>
        </div>
      </header>

      <section className="card scope-steps" aria-labelledby="process">
        <h2 id="process">How we work</h2>
        <ol>
          <li>
            <strong>ScopeLock</strong> — We co-write <code>AC.md</code> (acceptance criteria) and write the corresponding acceptance tests.
          </li>
          <li>
            <strong>Evidence Sprint</strong> — We produce a visible artifact (demo ≤90s + <code>DELTA.md</code>) to validate choices and tighten <code>AC.md</code>.
          </li>
          <li>
            <strong>Build → AC green</strong> — We deliver through tagged milestones until the criteria pass in CI/CD.
          </li>
        </ol>
      </section>

      <section aria-labelledby="quick-scope">
        <h2 id="quick-scope">ScopeLock in 60 seconds</h2>
        <div className="scope-quick-grid">
          <article>
            <h3>1. You see/test the demo.</h3>
            <p>Each milestone comes with a demo ≤90s and a measurable delta.</p>
          </article>
          <article>
            <h3>2. You accept when tests pass.</h3>
            <p>Criteria are locked in <code>AC.md</code> and executed on every run.</p>
          </article>
          <article>
            <h3>3. You pay at &quot;AC green&quot;.</h3>
            <p>Invoicing triggered only when <code>ac-green_*</code> tags are emitted.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="cases">
        <div className="card">
          <h2 id="cases">Proof in action</h2>
          <div className="grid-3">
            <article className="card card-case card-github">
              <div className="github-header">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <h3>nlr-ai / terminal-velocity</h3>
              </div>
              <p className="case-delta">Novel written by 10 autonomous AI agents</p>
              <div className="case-meta github-meta">
                <span className="github-stars">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                  </svg>
                  1,051
                </span>
                <span>Python</span>
                <span>Top 0.01%</span>
              </div>
              <p><a href="https://github.com/nlr-ai/terminal-velocity" target="_blank" rel="noopener">github.com/nlr-ai/terminal-velocity →</a></p>
            </article>
            <article className="card card-case card-serenissima">
              <div className="serenissima-glow"></div>
              <header>
                <h3>La Serenissima</h3>
                <p className="case-delta">97+ AI agents · 6+ months production · 50K+ state updates/hour</p>
              </header>
              <div className="case-meta serenissima-meta">
                <span className="uptime-badge">
                  <span className="uptime-dot"></span>
                  99.7% uptime
                </span>
                <span>Multi-agent city</span>
              </div>
              <p><a href="https://serenissima.ai" target="_blank" rel="noopener" className="serenissima-link">Visit live site →</a></p>
            </article>
            <article className="card card-case card-therapykin">
              <header>
                <h3>TherapyKin</h3>
                <p className="case-delta">AI therapeutic companion · Persistent memory · Text + voice</p>
              </header>
              <div className="case-meta therapykin-meta">
                <span className="deployment-badge">121+ deployments</span>
                <span>Next.js · Vercel</span>
              </div>
              <p><a href="https://therapykin.ai" target="_blank" rel="noopener">therapykin.ai →</a></p>
            </article>
          </div>
        </div>
      </section>

      <ProofTeaser />

      <section className="card process-card" aria-labelledby="timeline">
        <h2 id="timeline">How it works</h2>
        <p className="process-intro">Every project follows the same transparent process:</p>
        <div className="process-flow">
          <article className="process-step process-step-1">
            <div className="process-icon process-icon-lock">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="process-content">
              <h3>1. ScopeLock</h3>
              <p>We co-write <code>AC.md</code> with you. Scope locked, price fixed.</p>
              <div className="process-badge">[ ]</div>
            </div>
          </article>

          <div className="process-arrow">→</div>

          <article className="process-step process-step-2">
            <div className="process-icon process-icon-sprint">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="process-content">
              <h3>2. Evidence Sprint</h3>
              <p>Working demo ≤90s + quantified delta. You see it before committing to full build.</p>
              <div className="process-badge process-badge-active">[●]</div>
            </div>
          </article>

          <div className="process-arrow">→</div>

          <article className="process-step process-step-3">
            <div className="process-icon process-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="process-content">
              <h3>3. AC Green</h3>
              <p>Acceptance tests pass in CI. You pay only when tests are green.</p>
              <div className="process-badge process-badge-success">[✓]</div>
            </div>
          </article>
        </div>
      </section>

      <section className="card card-membrane proof-live" aria-labelledby="proof-log">
        <h2 id="proof-log">Live Activity</h2>
        <p className="proof-intro">Show don't tell. Here's what we're building right now:</p>

        <div className="activity-card activity-commits">
          <div className="activity-header">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M1.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm9.22 3.72a.75.75 0 000 1.06L10.69 8 9.22 9.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM6.78 6.53a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 101.06-1.06L5.31 8l1.47-1.47z"/>
            </svg>
            <h3>Recent Commits</h3>
          </div>
          <Suspense fallback={
            <ul className="commit-list">
              <li>
                <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">
                  <span className="commit-sha">•••••••</span>
                  <span className="commit-msg">Loading recent activity...</span>
                </a>
              </li>
            </ul>
          }>
            <LiveCommits />
          </Suspense>
          <a href="https://github.com/nlr-ai" target="_blank" rel="noopener" className="activity-link">
            View all 65,000+ commits across all repos →
          </a>
        </div>

        <div className="proof-footer">
          <p>Looking for tagged milestones and acceptance criteria?</p>
          <Link href="/proof" className="cta-secondary">View full Proof Log →</Link>
        </div>
      </section>

      <section className="card catch-section" aria-labelledby="catch-title">
        <h2 id="catch-title">What&apos;s The Catch?</h2>
        <p className="catch-intro">&quot;Pay only when tests pass&quot; sounds too good. Here&apos;s how it actually works:</p>

        <div className="catch-grid">
          <article className="catch-item">
            <h3>What if I&apos;m unreasonable and keep saying &quot;not good enough&quot;?</h3>
            <p>
              Acceptance criteria are <strong>executable tests in code</strong>, not subjective judgment.
              If tests pass, milestone is done. Want to change criteria? That&apos;s a Change Request.
            </p>
          </article>

          <article className="catch-item">
            <h3>What if tests pass but it&apos;s still broken?</h3>
            <p>
              Tests were wrong—I fix at no charge. But if tests correctly verify original
              criteria and you want <em>new</em> criteria, that&apos;s a scope change.
            </p>
          </article>

          <article className="catch-item">
            <h3>How do you prevent infinite revisions?</h3>
            <p>
              <code>AC.md</code> includes exact test command + seed data. When CI is green, you can verify
              yourself. Done means done.
            </p>
          </article>

          <article className="catch-item">
            <h3>What if we discover the scope was wrong?</h3>
            <p>
              <strong>Change Request:</strong> document what changed, <strong>Swap</strong> ($0) or <strong>Add</strong> (new price),
              you approve first. No surprise invoices.
            </p>
          </article>
        </div>

        <p className="catch-footer">
          You&apos;ll know if we&apos;re good before you pay.
        </p>
      </section>

      <section className="card" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p><strong>Kickoff ≤ 72h.</strong> Tell us about a milestone: we write <code>AC.md</code> together and deliver until &quot;AC green&quot;.</p>

        <ContactForm />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--slk-text-muted)' }}>
            Prefer to book directly?
          </p>
          <div className="contact-actions">
            <a className="cta-primary" href="https://cal.com/lester-reynolds-ieksyx/30min" target="_blank" rel="noopener">Book 30min kickoff</a>
            <a className="cta-secondary" href="mailto:scopelock@mindprotocol.ai">scopelock@mindprotocol.ai</a>
          </div>
        </div>
      </section>
    </main>
  );
}
