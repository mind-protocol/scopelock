import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <header className="hero">
        <div className="event-pulse">
          <span className="badge-event" aria-live="polite">Tag emitted · 2025-01-09T08:24:00Z</span>
        </div>
        <h1>ScopeLock Delivery.</h1>
        <p className="lead">Executable acceptance criteria. Price and outcome locked.</p>
        <div className="hero-ctas">
          <Link className="cta" href="/proof">
            <span>View a recent Evidence Sprint</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="#contact">Schedule a kickoff (≤ 72h) →</Link>
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
            <article className="card card-case">
              <header>
                <h3>Terminal Velocity</h3>
                <p className="case-delta">Novel written by 10 autonomous AI agents</p>
              </header>
              <div className="case-meta">
                <span>1,051 GitHub stars</span>
                <span>Python</span>
              </div>
              <p><a href="https://github.com/nlr-ai/terminal-velocity" target="_blank" rel="noopener">View on GitHub →</a></p>
            </article>
            <article className="card card-case">
              <header>
                <h3>La Serenissima</h3>
                <p className="case-delta">120+ AI agents, months of autonomous operation</p>
              </header>
              <div className="case-meta">
                <span>Multi-agent</span>
                <span>Python</span>
              </div>
              <p><a href="https://github.com/mind-protocol/serenissima" target="_blank" rel="noopener">View on GitHub →</a></p>
            </article>
            <article className="card card-case">
              <header>
                <h3>Universal Basic Compute</h3>
                <p className="case-delta">AI agent ecosystem with economic layer</p>
              </header>
              <div className="case-meta">
                <span>Live production</span>
                <span>TypeScript</span>
              </div>
              <p><a href="https://universalbasiccompute.ai" target="_blank" rel="noopener">Visit live site →</a></p>
            </article>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="timeline">
        <h2 id="timeline">How ScopeLock Delivery Works</h2>
        <p>Every project follows the same transparent process:</p>
        <div className="timeline">
          <article className="timeline-item">
            <div className="timeline-time">Step 1 · ScopeLock</div>
            <p>We co-write <code>AC.md</code> with you. Scope locked, price fixed.</p>
          </article>
          <article className="timeline-item">
            <div className="timeline-time">Step 2 · Evidence Sprint</div>
            <p>Working demo ≤90s + quantified delta. You see it before committing to full build.</p>
          </article>
          <article className="timeline-item">
            <div className="timeline-time">Step 3 · AC Green</div>
            <p>Acceptance tests pass in CI. You pay only when tests are green.</p>
          </article>
        </div>
        <p className="proof-link">
          <span>See our public Proof Log →</span>
          <Link href="/proof">/proof</Link>
        </p>
      </section>

      <section className="card proof-list" aria-labelledby="proof-log">
        <h2 id="proof-log">Proof Log</h2>
        <p>Follow tagged milestones: <code>evidence-sprint_*</code> (demo ≤90s) and <code>ac-green_*</code> (acceptance tests green).</p>
        <form className="proof-search" role="search">
          <label htmlFor="proof-search-input">Search by &lt;feature&gt;</label>
          <input id="proof-search-input" type="search" name="feature" placeholder="e.g., signup-otp" autoComplete="off" />
        </form>
        <ul>
          <li data-proof-item data-feature="signup-otp evidence-sprint">
            <code>evidence-sprint_signup-otp_2025-10-31</code><br />
            <small>Demo ≤90s, p95 delta 1200ms → 280ms.</small>
          </li>
          <li data-proof-item data-feature="signup-otp ac-green">
            <code>ac-green_signup-otp</code><br />
            <small>Acceptance tests green, release tagged.</small>
          </li>
          <li data-proof-item data-feature="import-csv evidence-sprint">
            <code>evidence-sprint_import-csv_2025-11-02</code><br />
            <small>UX delta: 7 screens → 3 screens.</small>
          </li>
          <li data-proof-item data-feature="search evidence-sprint">
            <code>evidence-sprint_search_2025-11-03</code><br />
            <small>Error delta: 12% → 1.4%.</small>
          </li>
        </ul>
        <p className="proof-empty" data-proof-empty hidden>No tag matches this feature. Try another search term.</p>
        <p><Link href="/proof">See full Proof Log →</Link></p>
      </section>

      <section className="card" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p><strong>Kickoff ≤ 72h.</strong> Tell us about a milestone: we write <code>AC.md</code> together and deliver until &quot;AC green&quot;.</p>
        <div className="contact-actions">
          <a className="cta" href="https://cal.com/scopelock/kickoff" target="_blank" rel="noopener">Book a slot</a>
          <a href="mailto:hello@scopelock.dev">hello@scopelock.dev</a>
        </div>
      </section>
    </main>
  );
}
