import Link from 'next/link';
import { Suspense } from 'react';
import { LiveCommits } from '../components/LiveCommits';
import { ProofTeaser } from '../components/ProofTeaser';
import { ContactForm } from '../components/ContactForm';

export default function HomePage() {
  return (
    <main>
      <header className="hero">
        {/* CHANGE #1: Proof-first - live URLs before tagline */}
        <p className="hero-proof" style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--slk-text-muted)' }}>
          <a href="https://serenissima.ai" target="_blank" rel="noopener">serenissima.ai</a> ·
          <a href="https://therapykin.ai" target="_blank" rel="noopener" style={{ marginLeft: '0.5rem' }}>therapykin.ai</a> ·
          <a href="https://konginvest.ai" target="_blank" rel="noopener" style={{ marginLeft: '0.5rem' }}>konginvest.ai</a> ·
          <a href="https://github.com/nlr-ai/terminal-velocity" target="_blank" rel="noopener" style={{ marginLeft: '0.5rem' }}>1.1k ⭐</a>
        </p>

        <h1>Software locked to executable acceptance criteria.<br />Pay only when tests pass.</h1>

        <p className="hero-pitch">
          I write the tests with you. You verify them yourself. No hourly billing, no scope creep, no trust required.
        </p>
        <p className="hero-tagline">
          Solo engineer + AI workforce · <a href="https://github.com/nlr-ai" target="_blank" rel="noopener" className="verify-link">65K commits in 2024 →</a>
        </p>

        {/* CHANGE #7: CTA hierarchy aligned to process */}
        <div className="hero-ctas">
          <a className="cta-primary" href="#contact">
            <span>Start with Evidence Sprint</span>
            <span aria-hidden="true">→</span>
          </a>
          <Link className="cta-secondary" href="/proof">See proof log</Link>
        </div>
      </header>

      {/* CHANGE #4: Empathy section - answers in titles, not questions */}
      <section className="card card-empathy" style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)' }}>
        <h2>You see working code before you pay.</h2>
        <div className="empathy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="empathy-item" style={{ padding: '1rem', background: 'var(--slk-bg)', borderRadius: '8px', borderLeft: '3px solid var(--slk-success)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--slk-text)' }}>No disappearing act</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slk-text-muted)' }}>
              Milestones tagged with <code>ac-green_*</code>. You verify tests pass yourself. Payment only after green.
            </p>
          </div>
          <div className="empathy-item" style={{ padding: '1rem', background: 'var(--slk-bg)', borderRadius: '8px', borderLeft: '3px solid var(--slk-success)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--slk-text)' }}>No endless &quot;90% done&quot;</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slk-text-muted)' }}>
              Acceptance criteria locked in <code>AC.md</code>. Tests run in CI. Done means tests pass, not &quot;almost.&quot;
            </p>
          </div>
          <div className="empathy-item" style={{ padding: '1rem', background: 'var(--slk-bg)', borderRadius: '8px', borderLeft: '3px solid var(--slk-success)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--slk-text)' }}>No surprise invoices</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slk-text-muted)' }}>
              Price locked after co-writing <code>AC.md</code>. Changes? <strong>Swap</strong> (€0) or <strong>Add</strong> (new milestone, new price).
            </p>
          </div>
        </div>
      </section>

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
            {/* CHANGE #2: Numbers subtle in titles/descriptions, not prominent */}
            <article className="card card-case card-github">
              <div className="github-header">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                <h3>Terminal Velocity</h3>
              </div>
              <p className="case-delta">Novel written by 10 autonomous AI agents · Generated in 6 hours</p>
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
                <p className="case-delta">Multi-agent city · 97 agents · 6 months production · 99.7% uptime</p>
              </header>
              <div className="case-meta serenissima-meta">
                <span className="uptime-badge">
                  <span className="uptime-dot"></span>
                  0 downtime incidents
                </span>
                <span>50K state updates/hour</span>
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
                <span>1,000+ sessions · p95: 280ms</span>
              </div>
              <p><a href="https://therapykin.ai" target="_blank" rel="noopener">therapykin.ai →</a></p>
            </article>
          </div>
        </div>
      </section>

      <ProofTeaser />

      {/* CHANGE #8: "Built This Week" section */}
      <section className="card card-membrane proof-live" aria-labelledby="built-this-week">
        <h2 id="built-this-week">Built This Week</h2>
        <p className="proof-intro">We ship multiple missions simultaneously. Here&apos;s what went live recently:</p>

        <div className="recent-ships" style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
          <article className="ship-item" style={{ padding: '1.5rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
            <div className="ship-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="ship-date" style={{ fontSize: '0.875rem', color: 'var(--slk-text-muted)' }}>Nov 4, 2025</span>
              <span className="ship-tag" style={{ fontFamily: 'var(--slk-font-mono)', fontSize: '0.875rem', color: 'var(--slk-success)' }}>ac-green_otp-signup</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>OTP Signup Flow</h3>
            <p className="ship-delta" style={{ color: 'var(--slk-text-muted)', marginBottom: '0.75rem' }}>
              p95: 1200ms → 280ms (↓77%) · Steps: 7 → 3 (↓57%)
            </p>
            <Link href="/proof" className="ship-link" style={{ fontSize: '0.9rem', color: 'var(--slk-accent)' }}>View proof →</Link>
          </article>
        </div>

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

      {/* CHANGE #5: Reordered "What's The Catch?" - most common fear first */}
      <section className="card catch-section" aria-labelledby="catch-title">
        <h2 id="catch-title">What&apos;s The Catch?</h2>
        <p className="catch-intro">&quot;Pay only when tests pass&quot; sounds too good. Here&apos;s how it actually works:</p>

        <div className="catch-grid">
          <article className="catch-item">
            <h3>What if tests pass but it&apos;s still broken?</h3>
            <p>
              Tests were wrong—I fix at no charge. But if tests correctly verify original
              criteria and you want <em>new</em> criteria, that&apos;s a scope change.
            </p>
          </article>

          <article className="catch-item">
            <h3>What if I&apos;m unreasonable and keep saying &quot;not good enough&quot;?</h3>
            <p>
              Acceptance criteria are <strong>executable tests in code</strong>, not subjective judgment.
              If tests pass, milestone is done. Want to change criteria? That&apos;s a Change Request.
            </p>
          </article>

          <article className="catch-item">
            <h3>What if we discover the scope was wrong?</h3>
            <p>
              <strong>Change Request:</strong> document what changed, <strong>Swap</strong> ($0) or <strong>Add</strong> (new price),
              you approve first. No surprise invoices.
            </p>
          </article>

          <article className="catch-item">
            <h3>How do you prevent infinite revisions?</h3>
            <p>
              <code>AC.md</code> includes exact test command + seed data. When CI is green, you can verify
              yourself. Done means done.
            </p>
          </article>
        </div>

        <p className="catch-footer">
          You&apos;ll know if we&apos;re good before you pay.
        </p>
      </section>

      {/* CHANGE #3: Pricing section before contact */}
      <section className="card card-pricing" aria-labelledby="pricing-title">
        <h2 id="pricing-title">Transparent Pricing</h2>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <article className="pricing-tier" style={{ padding: '1.5rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Evidence Sprint</h3>
            <p className="price-range" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--slk-accent)', marginBottom: '0.25rem' }}>$3,000 - $6,000</p>
            <p className="price-timeline" style={{ fontSize: '0.875rem', color: 'var(--slk-text-muted)', marginBottom: '1rem' }}>2-5 days</p>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
              <li>✓ Working demo (≤90s)</li>
              <li>✓ Quantified delta (DELTA.md)</li>
              <li>✓ Decision: build full or pivot</li>
            </ul>
          </article>

          <article className="pricing-tier pricing-tier-popular" style={{ padding: '1.5rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '2px solid var(--slk-accent)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--slk-accent)', color: 'var(--slk-bg)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>MOST POPULAR</div>
            <h3 style={{ marginBottom: '0.5rem' }}>ScopeLock Mission</h3>
            <p className="price-range" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--slk-accent)', marginBottom: '0.25rem' }}>$8,000 - $15,000</p>
            <p className="price-timeline" style={{ fontSize: '0.875rem', color: 'var(--slk-text-muted)', marginBottom: '1rem' }}>1-3 weeks</p>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
              <li>✓ Co-written AC.md</li>
              <li>✓ Executable acceptance tests</li>
              <li>✓ Pay only at AC green</li>
              <li>✓ Proof log entry</li>
            </ul>
          </article>

          <article className="pricing-tier" style={{ padding: '1.5rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Multi-Milestone</h3>
            <p className="price-range" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--slk-accent)', marginBottom: '0.25rem' }}>$25,000+</p>
            <p className="price-timeline" style={{ fontSize: '0.875rem', color: 'var(--slk-text-muted)', marginBottom: '1rem' }}>1-3 months</p>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
              <li>✓ Multiple AC green milestones</li>
              <li>✓ Change control (Swap/Add)</li>
              <li>✓ Dedicated timeline</li>
            </ul>
          </article>
        </div>

        <p className="pricing-footer" style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--slk-text-muted)' }}>
          Final price locked after co-writing AC.md. No hourly rates, no surprises.
        </p>
      </section>

      {/* CHANGE #6: Technical FAQ section */}
      <section className="card card-technical-faq" aria-labelledby="technical-faq-title">
        <h2 id="technical-faq-title">Technical FAQ</h2>

        <details style={{ marginTop: '1rem', padding: '1rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>What test frameworks do you use?</summary>
          <p style={{ marginTop: '0.5rem', color: 'var(--slk-text-muted)' }}>
            Playwright for E2E (web apps), pytest for Python, Jest for Node.js.
            We match your existing stack or choose based on AC.md requirements.
          </p>
        </details>

        <details style={{ marginTop: '1rem', padding: '1rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>How do you handle CI/CD?</summary>
          <p style={{ marginTop: '0.5rem', color: 'var(--slk-text-muted)' }}>
            GitHub Actions by default. We emit <code>ac-green_*</code> tags when
            acceptance tests pass in CI. You can run tests locally before approving payment.
          </p>
        </details>

        <details style={{ marginTop: '1rem', padding: '1rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>What if our stack is [specific framework]?</summary>
          <p style={{ marginTop: '0.5rem', color: 'var(--slk-text-muted)' }}>
            We work in: Next.js, Django, FastAPI, React Native, Go. If your stack is different,
            we&apos;ll assess fit during ScopeLock phase (before committing).
          </p>
        </details>

        <details style={{ marginTop: '1rem', padding: '1rem', background: 'var(--slk-surface)', borderRadius: '8px', border: '1px solid var(--slk-border)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>Do you sign NDAs?</summary>
          <p style={{ marginTop: '0.5rem', color: 'var(--slk-text-muted)' }}>
            Yes. Standard mutual NDA available on request.
          </p>
        </details>
      </section>

      {/* CHANGE #9: "Not a Good Fit If..." filter */}
      <section className="card card-not-fit" style={{ background: 'var(--slk-surface)', border: '1px solid var(--slk-border)' }} aria-labelledby="not-fit-title">
        <h2 id="not-fit-title">Not a Good Fit If...</h2>
        <ul className="not-fit-list" style={{ marginTop: '1rem', lineHeight: '1.8', color: 'var(--slk-text-muted)' }}>
          <li>✗ You need someone full-time (we work on milestones, not retainers)</li>
          <li>✗ You want hourly billing (we only do fixed-price)</li>
          <li>✗ Scope is undefined (&quot;just start building, we&apos;ll figure it out&quot;)</li>
          <li>✗ You need hardware, blockchain, or WordPress customization</li>
        </ul>

        <p style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--slk-bg)', borderRadius: '8px', borderLeft: '3px solid var(--slk-success)' }}>
          <strong>Good fit:</strong> AI integration, web apps, APIs, SaaS MVPs,
          data pipelines - where we can write executable acceptance criteria.
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
