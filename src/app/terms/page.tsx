import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — ScopeLock',
  description: 'Terms of service for ScopeLock delivery engagements.',
};

export default function TermsPage() {
  return (
    <main>
      <header className="hero">
        <h1>Terms of Service</h1>
        <p className="lead">Last updated: November 2, 2025</p>
      </header>

      <section className="card">
        <h2>1. Agreement</h2>
        <p>
          By engaging ScopeLock for software delivery services, you (&quot;Client&quot;) agree to these Terms of Service.
          Each project begins with a Statement of Work (SOW) that references these terms.
        </p>
      </section>

      <section className="card">
        <h2>2. Scope Definition</h2>
        <p>
          All work is defined through <strong>Acceptance Criteria</strong> documented in <code>AC.md</code> files.
          The AC defines:
        </p>
        <ul>
          <li>Functional requirements (what the software must do)</li>
          <li>Non-functional requirements (performance, quality thresholds)</li>
          <li>Verification method (executable tests)</li>
        </ul>
        <p>
          Scope is locked once AC is agreed. Changes follow the Change Control process (CHG-130).
        </p>
      </section>

      <section className="card">
        <h2>3. Payment Terms</h2>
        <p><strong>Trigger:</strong> Invoices are issued when acceptance tests pass in CI/CD (<code>ac-green</code> tags).</p>
        <p><strong>Net:</strong> Payment due within 15 days of invoice date unless otherwise agreed.</p>
        <p><strong>Currency:</strong> USD or EUR as specified in SOW.</p>
        <p>
          If AC green is not achieved, Client is not obligated to pay for that milestone. Partial work
          is not invoiced unless it reaches AC green.
        </p>
      </section>

      <section className="card">
        <h2>4. Intellectual Property</h2>
        <p><strong>Client Ownership:</strong> All code, designs, and deliverables created specifically for Client are owned by Client upon full payment.</p>
        <p><strong>ScopeLock Retention:</strong> We retain rights to:</p>
        <ul>
          <li>Our delivery process and methodologies</li>
          <li>Internal tools (proofgen, event schemas, templates)</li>
          <li>Proof Log artifacts (with Client permission for public case studies)</li>
        </ul>
        <p>Open-source dependencies remain under their respective licenses.</p>
      </section>

      <section className="card">
        <h2>5. Warranties and Limitations</h2>
        <p><strong>Warranty:</strong> Work delivered at AC green meets the criteria defined in <code>AC.md</code>.</p>
        <p><strong>Limitation:</strong> We do not warrant against:</p>
        <ul>
          <li>Requirements not specified in AC</li>
          <li>Changes in third-party dependencies post-delivery</li>
          <li>Infrastructure failures outside our control</li>
        </ul>
        <p>
          <strong>Liability cap:</strong> Our total liability is limited to fees paid for the specific milestone in question.
        </p>
      </section>

      <section className="card">
        <h2>6. Termination</h2>
        <p>Either party may terminate with written notice:</p>
        <ul>
          <li><strong>Before work starts:</strong> No fees owed</li>
          <li><strong>Mid-milestone:</strong> Client pays for completed, AC-green milestones only</li>
          <li><strong>Material breach:</strong> Immediate termination with notice</li>
        </ul>
        <p>
          Milestones are atomic. Partial completion does not trigger payment unless explicitly agreed.
        </p>
      </section>

      <section className="card">
        <h2>7. Confidentiality</h2>
        <p>
          Both parties agree to keep confidential information private. We will not disclose Client
          code, data, or business details without permission.
        </p>
        <p>
          If Client agrees, we may create anonymized case studies for our <Link href="/proof">Proof Log</Link> and portfolio.
        </p>
      </section>

      <section className="card">
        <h2>8. Dispute Resolution</h2>
        <p><strong>Good Faith:</strong> Disputes should first be resolved through direct communication.</p>
        <p><strong>Mediation:</strong> If unresolved, parties agree to mediation before litigation.</p>
        <p><strong>Jurisdiction:</strong> Disputes governed by French law and Client&apos;s local jurisdiction as applicable.</p>
      </section>

      <section className="card">
        <h2>9. Change Control</h2>
        <p>
          Changes to scope after AC lock follow <strong>CHG-130</strong>:
        </p>
        <ul>
          <li><strong>Swap:</strong> Equal/lower complexity replacement → no price change</li>
          <li><strong>Add:</strong> New scope → new milestone, separately priced</li>
        </ul>
        <p>
          All changes require mutual agreement before implementation.
        </p>
      </section>

      <section className="card">
        <h2>10. Acceptance</h2>
        <p>
          By scheduling a kickoff or signing an SOW, Client accepts these terms. Questions about terms
          should be raised before engagement begins.
        </p>
      </section>

      <section className="card">
        <h2>11. Modifications</h2>
        <p>
          ScopeLock may update these terms with 30 days notice. Updates will be posted on this page
          with a new Last Updated date.
        </p>
        <p>
          Material changes that affect active engagements require Client acceptance for ongoing work.
          Existing milestones continue under the terms agreed at baseline.
        </p>
      </section>

      <section className="card">
        <h2>12. Entire Agreement</h2>
        <p>
          These Terms of Service plus the project-specific <code>AC.md</code> (Acceptance Criteria)
          constitute the entire agreement between ScopeLock and Client.
        </p>
        <p>
          These terms supersede all prior communications, proposals, or agreements (written or oral)
          relating to the subject matter.
        </p>
      </section>

      <section className="card">
        <h2>Questions?</h2>
        <p>
          Contact us at <a href="mailto:scopelock@mindprotocol.ai">scopelock@mindprotocol.ai</a> for clarifications.
        </p>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Schedule a kickoff</Link>
          <Link href="/faq">See FAQ →</Link>
        </div>
      </section>
    </main>
  );
}
