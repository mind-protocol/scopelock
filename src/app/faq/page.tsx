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
        <p className="lead">Clear answers. No surprises. No hidden fine print.</p>
      </header>

      <section className="card">
        <h2>Delivery & Process</h2>

        <h3>What does "AC green" mean?</h3>
        <p>
          <strong>Acceptance Criteria green = all tests in AC.md pass.</strong> These are executable tests
          (Playwright, PyTest, etc.) with specific pass/fail conditions. You can run them yourself to verify.
          When CI shows green and performance thresholds are met, we invoice.
        </p>

        <h3>What if I need to change scope after we start?</h3>
        <p>
          We route every scope change through Change Control (CHG-130):
        </p>
        <ul>
          <li><strong>Swap:</strong> Replace with equal/lower complexity → €0, same milestone</li>
          <li><strong>Add:</strong> New features beyond original scope → new milestone, priced separately</li>
        </ul>
        <p>
          You choose. You approve pricing before we proceed. No surprise costs.
        </p>

        <h3>What if I don&apos;t like the Evidence Sprint result?</h3>
        <p>
          <strong>No obligation to continue.</strong> You keep the demo, code, and documentation.
          If you paid a deposit, you&apos;ve already received working software for it.
        </p>

        <h3>How do I know the tests are real and not rigged?</h3>
        <p>
          The Verification section in AC.md includes the exact command and seed data. Run the tests yourself.
          CI logs are public (if you want them). We can do a live walkthrough before you pay.
        </p>

        <h3>Can I see progress before it&apos;s done?</h3>
        <p>
          Yes. Evidence Sprint shows working demo + quantified deltas in 2–5 days. You&apos;re not waiting
          in the dark until final delivery.
        </p>
      </section>

      <section className="card">
        <h2>Pricing & Payment</h2>

        <h3>Why fixed-price instead of hourly?</h3>
        <p>
          Hourly incentivizes slow work. Fixed-price tied to acceptance criteria incentivizes efficiency
          and clear outcomes. You know the total cost upfront. We can&apos;t pad hours.
        </p>

        <h3>What if it takes longer than expected?</h3>
        <p>
          Our risk, not yours. Price is locked at ScopeLock phase. If we underestimated, we absorb the cost.
          You still pay the agreed amount only at AC green.
        </p>

        <h3>What if tests fail at delivery?</h3>
        <p>
          We don&apos;t invoice. We fix until green or refund any deposit. Our standard: AC green or no payment.
        </p>

        <h3>Do you offer payment plans?</h3>
        <p>
          For engagements &gt;$10K, we can split: 50% at baseline, 50% at AC green. For &lt;$10K, typical
          structure is 50% upfront, 50% at AC green (or 100% upfront for &lt;$5K).
        </p>
      </section>

      <section className="card">
        <h2>Technical</h2>

        <h3>What tech stacks do you work with?</h3>
        <p><strong>Primary:</strong></p>
        <ul>
          <li><strong>Frontend:</strong> React, Next.js, Vue, React Native</li>
          <li><strong>Backend:</strong> Node.js, Python (FastAPI, Django), Go</li>
          <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</li>
          <li><strong>AI/ML:</strong> Claude API, OpenAI, LangChain, vector databases</li>
          <li><strong>Blockchain:</strong> Solana, Ethereum (if relevant)</li>
          <li><strong>Cloud:</strong> AWS, GCP, Vercel, Docker</li>
        </ul>
        <p>
          If your stack isn&apos;t listed, <Link href="/contact">ask</Link>. We evaluate case-by-case.
        </p>

        <h3>Do you handle DevOps/hosting?</h3>
        <p>
          We can deploy to your infrastructure or set up new infrastructure as part of the project.
          Ongoing hosting costs are separate (you handle or we can advise on providers).
        </p>

        <h3>What about security?</h3>
        <p>
          All code reviewed for common vulnerabilities (OWASP Top 10). We follow fail-loud patterns
          (no silent fallbacks). For compliance-heavy projects (HIPAA, SOC2), we can structure accordingly
          but may require higher engagement tier.
        </p>
      </section>

      <section className="card">
        <h2>Working Together</h2>

        <h3>What timezone are you in?</h3>
        <p>
          France-based (CET/CEST). Available for calls 14:00–19:00 Central European time. Async work
          happens 24/7 (AI citizens don&apos;t sleep). Most communication is async via SYNC.md, demos,
          and /proof links.
        </p>

        <h3>How fast can you start?</h3>
        <p>
          Kickoff call typically within 72 hours of contact. Evidence Sprint delivery 2–5 days after
          baseline. We don&apos;t have long sales cycles.
        </p>

        <h3>Do you work with agencies or only direct clients?</h3>
        <p>
          Both. If you&apos;re an agency needing overflow capacity or specialized AI work, we can structure
          as a subcontractor. Same model: AC.md → Evidence Sprint → AC green.
        </p>

        <h3>Can we hire you for ongoing work (retainer)?</h3>
        <p>
          After first AC green milestone, we can discuss monthly retainer for continuous evolution
          (typically $5K–10K/month for priority access + 30–50 hours of work). Still milestone-based
          internally, but predictable monthly relationship.
        </p>
      </section>

      <section className="card">
        <h2>Guarantees & Policies</h2>

        <h3>What if we disagree on whether AC is met?</h3>
        <p>
          Tests decide. That&apos;s why we write executable acceptance criteria. If tests pass and
          thresholds are met, AC is satisfied. If they don&apos;t, it&apos;s not. No judgment calls,
          no ambiguity.
        </p>

        <h3>Do you offer refunds?</h3>
        <p>
          If we fail to deliver AC green within agreed timeline and you want to terminate, any deposit
          paid is refunded minus the value of artefacts delivered (Evidence Sprint demo, code, docs).
          Typically we fix and deliver rather than refund, but option exists.
        </p>

        <h3>What if you disappear mid-project?</h3>
        <p>
          All code is in git (you have access from day one). All AC criteria and tests are documented.
          Any other developer can continue from our work. Risk mitigation: milestones are atomic,
          you&apos;re never more than one milestone invested.
        </p>
      </section>

      <section className="card">
        <h2>Still have questions?</h2>
        <p>
          <Link href="/contact">Schedule a call</Link> or email scopelock@mindprotocol.ai
        </p>
        <p>
          We respond within 2 hours (typically).
        </p>
        <div className="hero-ctas" style={{marginTop: '2rem'}}>
          <Link className="cta" href="/contact">Schedule a call</Link>
          <Link href="/about">Learn more about us →</Link>
        </div>
      </section>
    </main>
  );
}
