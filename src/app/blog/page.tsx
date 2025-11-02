import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — ScopeLock',
  description: 'ScopeLock insights on executable acceptance criteria, Evidence Sprints, and outcome-based delivery.',
};

export default function BlogPage() {
  return (
    <main>
      <header className="hero">
        <h1>ScopeLock Blog</h1>
        <p className="lead">Insights on acceptance criteria, evidence-based delivery, and locking scope.</p>
      </header>

      <section className="card">
        <p>
          This blog shares our learnings from delivering features with <strong>locked scope</strong> and
          executable acceptance criteria. We write about Evidence Sprints, Change Control (CHG-130),
          performance deltas, and the architecture behind membrane-first, event-native systems.
        </p>
      </section>

      <article className="card">
        <header>
          <h2>How Evidence Sprints Prevent Wasted Work</h2>
          <div className="case-meta">
            <span>2025-11-02</span>
            <span>Process</span>
          </div>
        </header>
        <p>
          Most failed features die after weeks of development. Evidence Sprints flip this: prove value in
          ≤90s + quantified deltas BEFORE committing to full delivery. Here&apos;s how we do it.
        </p>
        <p>
          <strong>The problem:</strong> Traditional discovery involves mockups, user stories, and estimates—but
          no working code. By the time you realize a feature won&apos;t deliver value, you&apos;ve spent weeks.
        </p>
        <p>
          <strong>Evidence Sprint approach:</strong>
        </p>
        <ul>
          <li>Build a minimal working version (not a mockup)</li>
          <li>Measure real deltas (p95 latency, error rates, steps to complete)</li>
          <li>Record a demo ≤90s showing the full flow</li>
          <li>Publish proof with tag: <code>evidence-sprint_feature_date</code></li>
        </ul>
        <p>
          If the Evidence Sprint doesn&apos;t prove value, stop. You&apos;ve spent days instead of weeks.
          If it does, the AC is already validated and you proceed with confidence.
        </p>
        <p>
          <Link href="/case-studies">See Evidence Sprint examples →</Link>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>Why "Done" Must Be Executable</h2>
          <div className="case-meta">
            <span>2025-10-31</span>
            <span>Process</span>
          </div>
        </header>
        <p>
          &quot;Is it done?&quot; is the most expensive question in software. ScopeLock eliminates it by making
          acceptance criteria <strong>executable</strong>.
        </p>
        <p>
          Traditional acceptance criteria are prose: &quot;Users should be able to sign up quickly.&quot;
          What does &quot;quickly&quot; mean? How do you verify it? When is it done?
        </p>
        <p>
          <strong>Executable AC</strong> removes ambiguity:
        </p>
        <pre><code>{`## Functional
- User enters email → receives OTP → enters code → signed in

## Non-Functional
- p95 latency <300ms (measured via Playwright perf trace)
- Error rate <2% (malformed email, expired OTP)

## Verification
\`npm run test:acceptance -- signup-otp.spec.ts\``}</code></pre>
        <p>
          When tests pass in CI, the feature is <strong>AC green</strong>. No debate, no subjective judgment.
          The criteria define done, and the tests verify it automatically.
        </p>
        <p>
          <Link href="/process">Learn about our process →</Link>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>Change Control Without Drama (CHG-130)</h2>
          <div className="case-meta">
            <span>2025-10-30</span>
            <span>Process</span>
          </div>
        </header>
        <p>
          Scope creep kills projects. But so does rigidity—clients need flexibility. CHG-130 solves both.
        </p>
        <p>
          After <code>AC.md</code> is locked (tagged as <code>ac-baseline_*</code>), any change triggers
          a formal Change Request. We analyze size, risk, and impact, then classify as:
        </p>
        <ul>
          <li>
            <strong>Swap:</strong> Replace existing scope with equal/lower complexity → €0, same milestone.
            Example: &quot;Use email OTP instead of SMS OTP&quot; (same effort, different provider).
          </li>
          <li>
            <strong>Add:</strong> New scope beyond original AC → new milestone, priced separately.
            Example: &quot;Add social login (Google + GitHub)&quot; (new integrations, new tests).
          </li>
        </ul>
        <p>
          Every CR is tagged (<code>change-req_*</code>) and published to our <Link href="/proof">Proof Log</Link>.
          You see the status, the delta, and the updated AC. No hidden changes, no surprise invoices.
        </p>
        <p>
          <strong>Result:</strong> Clients can adapt without fear of runaway costs. We deliver without scope creep.
        </p>
        <p>
          <Link href="/pricing#change-control">See pricing impact →</Link>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>Measuring Quality: Beyond &quot;It Works&quot;</h2>
          <div className="case-meta">
            <span>2025-10-29</span>
            <span>Technical</span>
          </div>
        </header>
        <p>
          &quot;It works on my machine&quot; isn&apos;t quality. ScopeLock measures quality with
          quantifiable, repeatable thresholds.
        </p>
        <p>
          Every <code>AC.md</code> includes <strong>non-functional requirements</strong>:
        </p>
        <ul>
          <li><strong>Performance:</strong> p95 latency (e.g., &lt;300ms for signup flow)</li>
          <li><strong>Reliability:</strong> Error rate (e.g., &lt;2% for CSV import validation)</li>
          <li><strong>UX:</strong> Steps to complete (e.g., reduce from 7 steps to 3)</li>
        </ul>
        <p>
          We test these in CI using real tools: Playwright performance traces, pytest benchmarks, load tests
          with realistic data. If thresholds aren&apos;t met, the milestone isn&apos;t AC green—no invoice.
        </p>
        <p>
          <strong>Example delta</strong> from a search quality improvement:
        </p>
        <ul>
          <li><em>Before:</em> 12% zero-result rate (users got no results for valid queries)</li>
          <li><em>After:</em> 1.4% zero-result rate (91% improvement via pg_trgm fuzzy search)</li>
        </ul>
        <p>
          Quality isn&apos;t subjective. It&apos;s measurable, testable, and locked in AC.
        </p>
        <p>
          <Link href="/case-studies">See quality improvements →</Link>
        </p>
      </article>

      <section className="card">
        <h2>Stay Updated</h2>
        <p>
          New posts are published as we deliver milestones and refine our process. Follow our{' '}
          <Link href="/proof">Proof Log</Link> for real-time delivery evidence.
        </p>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Work with us</Link>
          <Link href="/proof">See our proof →</Link>
        </div>
      </section>
    </main>
  );
}
