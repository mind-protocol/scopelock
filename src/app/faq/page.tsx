import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — ScopeLock',
  description: 'Common questions about ScopeLock delivery, pricing, and acceptance criteria.',
};

export default function FAQPage() {
  return (
    <main>
      <header className="hero">
        <h1>Frequently Asked Questions</h1>
        <p className="lead">Clear answers to common questions about how we work.</p>
      </header>

      <section className="card">
        <h2>What if scope changes mid-project?</h2>
        <p>
          We use <strong>Change Control (CHG-130)</strong> with two paths:
        </p>
        <ul>
          <li><strong>Swap:</strong> Replace existing scope with equal/lower complexity → €0 cost, same milestone</li>
          <li><strong>Add:</strong> New scope beyond original AC → new milestone, separately priced</li>
        </ul>
        <p>
          You never get surprise invoices. Changes are either swaps (no charge) or additions (priced upfront before work starts).
        </p>
      </section>

      <section className="card">
        <h2>How do you measure &quot;AC green&quot;?</h2>
        <p>
          <strong>Acceptance tests running in CI/CD.</strong> No judgment calls, no &quot;looks good to me.&quot;
        </p>
        <p>
          We co-write <code>AC.md</code> with you at the start. It lists functional + non-functional criteria
          (e.g., &quot;p95 latency &lt;300ms&quot;). We then write tests that verify those criteria.
          When the tests pass in your CI pipeline, that&apos;s AC green.
        </p>
        <p>
          The tests <em>are</em> the contract. If they pass, you pay. If they don&apos;t, we keep working or you walk away.
        </p>
      </section>

      <section className="card">
        <h2>What if I don&apos;t like the Evidence Sprint?</h2>
        <p>
          <strong>No obligation to continue.</strong>
        </p>
        <p>
          An Evidence Sprint is a ≤90s demo + measurable delta. It&apos;s designed to validate assumptions early.
          If it doesn&apos;t prove value, you stop. We only invoice for the Evidence Sprint itself (typically $3k–$6k).
        </p>
        <p>
          You&apos;re not locked into a multi-month engagement. Every milestone is atomic.
        </p>
      </section>

      <section className="card">
        <h2>Can you work hourly?</h2>
        <p>
          <strong>No.</strong> We deliver milestones, not hours.
        </p>
        <p>
          Hourly billing creates misaligned incentives (more hours = more money). We lock the outcome and price upfront.
          You know what you&apos;re getting and what it costs before we start.
        </p>
      </section>

      <section className="card">
        <h2>What tech stacks do you support?</h2>
        <p><strong>Primary stacks:</strong></p>
        <ul>
          <li>Frontend: React, Next.js, Vue, Svelte, plain HTML/CSS</li>
          <li>Backend: Node.js, Python (FastAPI, Django), Go</li>
          <li>Databases: PostgreSQL, MongoDB, Redis, SQLite</li>
          <li>Infrastructure: Vercel, AWS, Docker, CI/CD (GitHub Actions, GitLab CI)</li>
        </ul>
        <p>
          If your stack isn&apos;t listed, <Link href="/contact">ask</Link>. We evaluate case-by-case.
        </p>
      </section>

      <section className="card">
        <h2>What timezone are you in?</h2>
        <p>
          <strong>France-based</strong>, typically available <strong>14:00–19:00 Central European Time</strong>.
        </p>
        <p>
          We overlap with US East Coast afternoons and West Coast mornings. Async-first communication
          (email, Linear, Slack) works well across timezones.
        </p>
      </section>

      <section className="card">
        <h2>How fast can you start?</h2>
        <p>
          <strong>Kickoff typically ≤72 hours</strong> from first contact.
        </p>
        <p>
          Process: schedule a call → co-write <code>AC.md</code> → agree on price → start.
          If you have urgent needs, mention it upfront.
        </p>
      </section>

      <section className="card">
        <h2>Do you sign NDAs?</h2>
        <p>
          <strong>Yes.</strong> Standard mutual NDAs are fine. Send yours or we&apos;ll provide a template.
        </p>
      </section>

      <section className="card">
        <h2>Who owns the code?</h2>
        <p>
          <strong>You do.</strong> All code we write for your project is yours. We retain rights to our
          delivery framework (ScopeLock process, proofgen tools, etc.), but your features are yours.
        </p>
        <p>
          See <Link href="/terms">Terms of Service</Link> for details.
        </p>
      </section>

      <section className="card">
        <h2>What if we disagree on &quot;done&quot;?</h2>
        <p>
          <strong>The tests decide.</strong> That&apos;s why we co-write <code>AC.md</code> upfront.
        </p>
        <p>
          If acceptance tests pass, it&apos;s done. If you want something beyond the original AC,
          that&apos;s a change request (Swap or Add).
        </p>
        <p>
          This model eliminates subjective debates about completion.
        </p>
      </section>

      <section className="card">
        <h2>Can you handle maintenance after delivery?</h2>
        <p>
          <strong>Yes, as new milestones.</strong> Maintenance can be scoped as:
        </p>
        <ul>
          <li>Bug fixes → new AC green milestone</li>
          <li>Performance tuning → evidence sprint + AC green</li>
          <li>Feature enhancements → same as new features</li>
        </ul>
        <p>
          We don&apos;t do retainer hours. Each maintenance request is its own milestone with AC.
        </p>
      </section>

      <section className="card">
        <h2>Still have questions?</h2>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Schedule a call</Link>
          <Link href="/about">Learn more about us →</Link>
        </div>
      </section>
    </main>
  );
}
