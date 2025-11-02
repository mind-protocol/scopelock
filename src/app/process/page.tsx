import Link from 'next/link';
import type { Metadata } from 'next';
import { ProcessTimeline } from '../../components/ProcessTimeline';

export const metadata: Metadata = {
  title: 'Process — ScopeLock',
  description: 'Deep dive into the ScopeLock delivery model: from AC.md to Evidence Sprints to AC green.',
};

export default function ProcessPage() {
  return (
    <main>
      <header className="hero">
        <h1>How ScopeLock Works</h1>
        <p className="lead">A deep dive into our delivery model.</p>
      </header>

      <ProcessTimeline />

      <section className="card">
        <h2>The ScopeLock Flow</h2>
        <p>
          Most freelancing is based on time estimates (&quot;this will take 2 weeks&quot;) or story points.
          ScopeLock locks the <strong>outcome</strong> instead.
        </p>
        <p>Here&apos;s how:</p>
      </section>

      <section className="card scope-steps">
        <h2>1. ScopeLock Phase</h2>
        <p>
          We co-write <code>AC.md</code> (Acceptance Criteria) with you. This document defines:
        </p>
        <ul>
          <li><strong>Functional requirements:</strong> What the software must do</li>
          <li><strong>Non-functional requirements:</strong> Performance (p95 latency), quality (error rates), UX (steps to complete)</li>
          <li><strong>Verification:</strong> How we&apos;ll test it (e.g., Playwright tests, pytest, performance benchmarks)</li>
        </ul>
        <p>
          Once <code>AC.md</code> is agreed, we lock it with a git tag: <code>ac-baseline_*</code>.
          Changes after this require a formal Change Request.
        </p>

        <details style={{marginTop: '1.5rem', padding: '1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--muted)'}}>
          <summary style={{cursor: 'pointer', fontWeight: 600, marginBottom: '1rem'}}>
            Example AC.md (click to expand)
          </summary>
          <pre style={{background: 'var(--bg)', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.875rem'}}>
{`# Acceptance Criteria — OTP Signup

## Functional

- User can sign up with email + OTP (no password)
- OTP sent via email within 5 seconds
- OTP valid for 10 minutes
- User redirected to dashboard after successful OTP entry
- Failed OTP shows clear error message

## Non-Functional

- **Performance:** p95 signup flow <300ms (server-side)
- **Quality:** Error rate <0.1% on OTP send
- **UX:** Signup completes in ≤3 steps (email → OTP → dashboard)

## Verification

**Command:**
\`\`\`bash
npm run test:acceptance -- signup.spec.ts
\`\`\`

**Seed data:**
- Test user: test@example.com
- Mock OTP provider (bypasses real email in CI)

**Pass criteria:**
- All Playwright tests green
- p95 latency measured <300ms (10 sample runs)
- Manual walkthrough: <90s from landing to dashboard`}
          </pre>
        </details>
      </section>

      <section className="card scope-steps">
        <h2>2. Evidence Sprint</h2>
        <p>
          Before building the full feature, we produce <strong>evidence</strong>:
        </p>
        <ul>
          <li><strong>Demo ≤90s:</strong> A working prototype or proof-of-concept</li>
          <li><strong>DELTA.md:</strong> Quantified changes (e.g., &quot;p95 reduced from 1200ms to 280ms&quot;)</li>
        </ul>
        <p>
          This validates assumptions early. If the Evidence Sprint doesn&apos;t prove value, you can
          stop without committing to full delivery.
        </p>
        <p>
          Evidence Sprints are tagged: <code>evidence-sprint_feature_date</code> and published
          to our <Link href="/proof">Proof Log</Link>.
        </p>
      </section>

      <section className="card scope-steps">
        <h2>3. Build → AC Green</h2>
        <p>
          We implement the feature, writing <strong>acceptance tests</strong> as we go. These tests
          verify the criteria in <code>AC.md</code>.
        </p>
        <p>
          When all tests pass in CI/CD, we emit an <code>ac-green_*</code> tag. That&apos;s the
          completion signal. No subjective debate about &quot;done.&quot;
        </p>
        <p>
          At AC green:
        </p>
        <ul>
          <li>We issue an invoice</li>
          <li>You get production-ready code</li>
          <li>Proof is published with tag, demo, delta, and tests</li>
        </ul>
      </section>

      <section className="card">
        <h2>Change Control (CHG-130)</h2>
        <p>
          If scope changes after <code>ac-baseline</code>, we open a <strong>Change Request</strong>:
        </p>
        <ul>
          <li><strong>Swap:</strong> Replace existing scope with equal/lower complexity → €0, same milestone</li>
          <li><strong>Add:</strong> New scope beyond original AC → new milestone, priced separately</li>
        </ul>
        <p>
          Every CR is analyzed for size, risk, and impact. You decide whether to proceed.
        </p>
        <p>
          CRs are tagged: <code>change-req_*</code>, and their status is visible in the Proof Log.
        </p>
      </section>

      <section className="card">
        <h2>Proof Log (PRF-020)</h2>
        <p>
          Every milestone generates <strong>proof artifacts</strong>:
        </p>
        <ul>
          <li><code>AC.md</code> — The acceptance criteria</li>
          <li><code>DEMO.md</code> — Link to demo + 3-bullet summary</li>
          <li><code>DELTA.md</code> — Quantified deltas (≥2 metrics)</li>
        </ul>
        <p>
          These are compiled into a static <Link href="/proof">Proof Log</Link> at build time.
          No runtime fetches, no embellishment—just git tags and markdown.
        </p>
      </section>

      <section className="card">
        <h2>Why This Works</h2>
        <p><strong>For you:</strong></p>
        <ul>
          <li>Predictable pricing (no hourly creep)</li>
          <li>Measurable outcomes (tests define done)</li>
          <li>Evidence before commitment (Evidence Sprints)</li>
          <li>Transparent progress (Proof Log)</li>
        </ul>
        <p><strong>For us:</strong></p>
        <ul>
          <li>Clear success criteria (AC.md)</li>
          <li>No scope creep (Change Control)</li>
          <li>Portfolio proof (every milestone is public)</li>
        </ul>
      </section>

      <section className="card">
        <h2>Comparison: ScopeLock vs Traditional</h2>
        <div className="grid-3">
          <article className="card card-case">
            <h3>Traditional Freelancing</h3>
            <ul>
              <li>Sell hours or story points</li>
              <li>&quot;Done&quot; is subjective</li>
              <li>Scope creep common</li>
              <li>No measurable deltas</li>
              <li>Pay regardless of outcome</li>
            </ul>
          </article>
          <article className="card card-case">
            <h3>ScopeLock</h3>
            <ul>
              <li>Sell outcomes (AC green)</li>
              <li>&quot;Done&quot; = tests pass in CI</li>
              <li>Change Control (Swap/Add)</li>
              <li>Quantified deltas required</li>
              <li>Pay only at AC green</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="card">
        <h2>Ready to Lock Scope?</h2>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Schedule a kickoff</Link>
          <Link href="/proof">See proof of delivery →</Link>
        </div>
      </section>
    </main>
  );
}
