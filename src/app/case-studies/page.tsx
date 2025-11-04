import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — ScopeLock',
  description: 'Detailed case studies showing Evidence Sprints, deltas, and AC green milestones.',
};

export default function CaseStudiesPage() {
  return (
    <main>
      <header className="hero">
        <h1>Case Studies</h1>
        <p className="lead">Evidence of delivery: demos, deltas, and AC green milestones.</p>
      </header>

      <section className="card">
        <p>
          Every project we deliver generates <strong>proof artifacts</strong>: executable acceptance criteria,
          working demos ≤90s, and quantified deltas. Below are detailed writeups of select engagements.
        </p>
        <p>
          For real-time proof, see our <Link href="/proof">Proof Log</Link> with all tagged milestones.
        </p>
      </section>

      <article className="card">
        <header>
          <h2>OTP Signup Flow</h2>
          <div className="case-meta">
            <span>Stack: Next.js</span>
            <span>Playwright</span>
            <span>Evidence Sprint</span>
          </div>
        </header>
        <p className="case-delta"><em>Before:</em> p95 1200ms, 7 steps → <em>After:</em> p95 280ms, 3 steps</p>
        <h3>Challenge</h3>
        <p>
          Client had a traditional email + password signup flow that was slow (1.2s p95) and required
          users to confirm email, set password, verify email—7 steps total. Drop-off was high.
        </p>
        <h3>Solution</h3>
        <p>
          We proposed OTP (one-time password) signup: enter email → receive code → enter code → signed in.
          This reduces steps to 3 and eliminates password management.
        </p>
        <h3>Evidence Sprint</h3>
        <ul>
          <li>Built working OTP flow in Next.js + Playwright tests</li>
          <li>Measured p95 latency: 280ms (76% improvement)</li>
          <li>Recorded 65s demo showing full flow</li>
        </ul>
        <h3>Outcome</h3>
        <p>
          Client approved. We delivered full feature with acceptance tests green. Drop-off reduced by ~40%
          in first week post-launch.
        </p>
        <p>
          <em>Example case study - see <Link href="/proof">Proof Log</Link> for real deliveries</em>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>CSV Import Simplification</h2>
          <div className="case-meta">
            <span>Stack: Node</span>
            <span>React Table</span>
            <span>UX Optimization</span>
          </div>
        </header>
        <p className="case-delta"><em>Before:</em> 7 screens, 12% error rate → <em>After:</em> 3 screens, 1.4% error rate</p>
        <h3>Challenge</h3>
        <p>
          Existing CSV import required users to navigate through 7 screens (upload, map columns, validate, review, confirm, etc.).
          Error rate was 12% (users abandoning or importing bad data).
        </p>
        <h3>Solution</h3>
        <p>
          Consolidate to 3 screens: upload + auto-detect columns → review + inline fixes → confirm.
          Add real-time validation and smart defaults.
        </p>
        <h3>Evidence Sprint</h3>
        <ul>
          <li>Prototype with React Table + validation</li>
          <li>Measured: 3 screens (down from 7), error rate 1.4% in test runs</li>
          <li>88s demo</li>
        </ul>
        <h3>Outcome</h3>
        <p>
          Delivered with acceptance tests covering edge cases (malformed CSVs, encoding issues).
          Client reported 10x fewer support tickets related to imports.
        </p>
        <p>
          <em>Example case study - see <Link href="/proof">Proof Log</Link> for real deliveries</em>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>Search Quality Improvement</h2>
          <div className="case-meta">
            <span>Stack: Postgres</span>
            <span>pg_trgm</span>
            <span>Performance</span>
          </div>
        </header>
        <p className="case-delta"><em>Before:</em> 12% error rate (no results) → <em>After:</em> 1.4% error rate</p>
        <h3>Challenge</h3>
        <p>
          Client&apos;s search was using basic SQL <code>LIKE</code> queries. Typos, partial matches, and multi-word
          queries often returned zero results (12% of searches).
        </p>
        <h3>Solution</h3>
        <p>
          Implement full-text search with Postgres <code>pg_trgm</code> (trigram matching) for fuzzy search.
          Add ranking and partial match support.
        </p>
        <h3>Evidence Sprint</h3>
        <ul>
          <li>Set up pg_trgm indexes</li>
          <li>Tested against sample queries: 1.4% zero-result rate (91% improvement)</li>
          <li>Demo: 72s showing typo tolerance and ranking</li>
        </ul>
        <h3>Outcome</h3>
        <p>
          AC green with performance tests (p95 &lt;100ms on 10k row dataset). Client saw immediate
          improvement in user satisfaction scores.
        </p>
        <p>
          <em>Example case study - see <Link href="/proof">Proof Log</Link> for real deliveries</em>
        </p>
      </article>

      <section className="card">
        <h2>More Case Studies Coming</h2>
        <p>
          As we deliver more milestones, we&apos;ll add detailed writeups here. For the latest proof,
          check the <Link href="/proof">Proof Log</Link>.
        </p>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Work with us</Link>
          <Link href="/proof">See all proof →</Link>
        </div>
      </section>
    </main>
  );
}
