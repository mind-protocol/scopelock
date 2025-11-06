import Link from 'next/link';
import type { Metadata } from 'next';
import { PricingTiers } from '../../components/PricingTiers';

export const metadata: Metadata = {
  title: 'Pricing — ScopeLock',
  description: 'Transparent pricing. Payment only at AC green. Fixed-price milestones from Evidence Sprints to full integrations.',
};

const pricingTiers = [
  {
    name: 'Evidence Sprint',
    price: '$3K–$6K',
    priceLabel: 'typical investment',
    timeline: '2–5 days',
    bestFor: 'Validate approach, test collaboration, show stakeholders',
    features: [
      'Co-authored AC.md (functional + non-functional criteria + verification)',
      'Working demo (≤90 seconds to see the value)',
      'Quantified DELTA.md (before→after with numbers)',
      'Published /proof entry',
      'No obligation to continue',
    ],
  },
  {
    name: 'Feature to AC Green',
    price: '$5K–$15K',
    priceLabel: 'fixed price',
    timeline: '1–2 weeks',
    bestFor: 'Single feature, MVP, core system component',
    popular: true,
    features: [
      'Everything in Evidence Sprint',
      'Full implementation to acceptance criteria',
      'All tests passing (CI green)',
      'Performance thresholds met (p95, quality gates)',
      '2 weeks of adjustments included',
    ],
  },
  {
    name: 'Week-Scale Integration',
    price: '$15K–$35K',
    priceLabel: 'scope-dependent',
    timeline: '2–4 weeks',
    bestFor: 'Multi-feature systems, integrations, transformations',
    features: [
      'Multiple Evidence Sprints',
      'Full system integration',
      'Multiple AC green milestones',
      'Architecture documentation',
      '2 weeks support post-delivery',
    ],
  },
];

export default function PricingPage() {
  return (
    <main>
      <header className="hero">
        <h1>Transparent Pricing. Payment Only at AC Green.</h1>
        <p className="lead">
          No hourly rates. No time-and-materials uncertainty.
          Fixed-price milestones tied to executable acceptance criteria.
        </p>
      </header>

      <section className="card">
        <h2>Pricing Tiers</h2>
        <p>Choose the engagement level that fits your needs. All tiers include fixed pricing and payment only at AC green.</p>
      </section>

      <PricingTiers tiers={pricingTiers} />

      <section className="card">
        <p><strong>Minimum Engagement:</strong> $2,500 (proof-of-concept Evidence Sprint)</p>
      </section>

      <section className="card">
        <h2>How Pricing Works</h2>

        <h3>1. ScopeLock Phase (Free)</h3>
        <ul>
          <li>We co-write AC.md together</li>
          <li>You approve scope and price</li>
          <li>Baseline tagged (scope locked)</li>
        </ul>

        <h3>2. Evidence Sprint</h3>
        <ul>
          <li>You pay 50% upfront (or full amount if &lt;$5k)</li>
          <li>We deliver demo + delta</li>
          <li>Remainder due at AC green</li>
        </ul>

        <h3>3. Payment Trigger: AC Green</h3>
        <ul>
          <li>All acceptance tests pass (you can run them yourself)</li>
          <li>Performance thresholds met</li>
          <li>Quality gates passed</li>
          <li>Invoice issued</li>
        </ul>

        <p><strong>You never pay for incomplete work.</strong></p>
      </section>

      <section className="card">
        <h2 id="change-control">What If Scope Changes? (CHG-130)</h2>

        <h3>Swap (€0, same milestone)</h3>
        <ul>
          <li>Replace feature with equal/lower complexity</li>
          <li>Same timeline, same price</li>
          <li><em>Example:</em> &quot;Use SMS instead of email notifications&quot;</li>
        </ul>

        <h3>Add (new milestone, priced separately)</h3>
        <ul>
          <li>Additional features beyond original scope</li>
          <li>New AC.md, new Evidence Sprint, new AC green</li>
          <li>You approve price before we start</li>
          <li><em>Example:</em> &quot;Add mobile app + push notifications&quot;</li>
        </ul>
      </section>

      <section className="card">
        <h2>What&apos;s Included</h2>
        <ul>
          <li>✅ Co-authored AC.md (executable acceptance criteria)</li>
          <li>✅ All source code (you own it)</li>
          <li>✅ Acceptance tests + seed data</li>
          <li>✅ Documentation (technical + user-facing)</li>
          <li>✅ 2 weeks of adjustments post-AC green</li>
          <li>✅ Public /proof entry (shareable with stakeholders)</li>
          <li>✅ Architecture diagrams (if applicable)</li>
        </ul>
      </section>

      <section className="card">
        <h2>Not Included</h2>
        <ul>
          <li>❌ Ongoing hosting/infrastructure costs (we can advise)</li>
          <li>❌ Third-party API fees</li>
          <li>❌ Support beyond 2 weeks (we can discuss retainer)</li>
          <li>❌ Changes after AC green without new CR</li>
        </ul>
      </section>

      <section className="card">
        <h2>Compare</h2>
        <table>
          <thead>
            <tr>
              <th>Approach</th>
              <th>Cost</th>
              <th>Timeline</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Hourly Freelancer</strong></td>
              <td>$50–150/hr (unknown total)</td>
              <td>2–4 weeks</td>
              <td>High (unclear scope)</td>
            </tr>
            <tr>
              <td><strong>Agency</strong></td>
              <td>$50K–200K</td>
              <td>8–16 weeks</td>
              <td>High (meetings, phases)</td>
            </tr>
            <tr>
              <td><strong>ScopeLock</strong></td>
              <td>$5K–35K (fixed)</td>
              <td>1–4 weeks</td>
              <td>Low (pay at AC green)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Ready to Start?</h2>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Schedule a ScopeLock call →</Link>
          <Link href="/case-studies">View case studies →</Link>
        </div>
      </section>
    </main>
  );
}
