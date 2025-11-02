import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ScopeLock',
  description: 'How we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <main>
      <header className="hero">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: November 2, 2025</p>
      </header>

      <section className="card">
        <h2>1. Information We Collect</h2>
        <p>When you engage with ScopeLock, we may collect:</p>
        <ul>
          <li><strong>Contact information:</strong> Name, email, company name</li>
          <li><strong>Project data:</strong> Requirements, code repositories, technical specifications</li>
          <li><strong>Payment information:</strong> Billing address, payment method details (processed by third parties)</li>
          <li><strong>Communication:</strong> Emails, messages, meeting notes</li>
          <li><strong>Usage data:</strong> Website analytics (IP address, browser, pages visited)</li>
        </ul>
      </section>

      <section className="card">
        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Deliver software development services</li>
          <li>Communicate about projects and milestones</li>
          <li>Process payments</li>
          <li>Improve our services and website</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your data to third parties or use it for advertising.
        </p>
      </section>

      <section className="card">
        <h2>3. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Cal.com:</strong> Meeting scheduling (see their <a href="https://cal.com/privacy" target="_blank" rel="noopener">privacy policy</a>)</li>
          <li><strong>Payment processors:</strong> Stripe, PayPal for payments</li>
          <li><strong>Email:</strong> Email service providers for communications</li>
          <li><strong>Analytics:</strong> Basic website analytics (no cross-site tracking)</li>
        </ul>
        <p>
          Each third party has their own privacy policy governing data use.
        </p>
      </section>

      <section className="card">
        <h2>4. Data Retention</h2>
        <p>We retain data for:</p>
        <ul>
          <li><strong>Project files:</strong> Duration of engagement + 1 year for support</li>
          <li><strong>Communication:</strong> 2 years for reference and legal compliance</li>
          <li><strong>Payment records:</strong> 7 years for tax/legal requirements</li>
          <li><strong>Analytics:</strong> Aggregated, anonymized data indefinitely</li>
        </ul>
        <p>
          You may request earlier deletion subject to legal/contractual obligations.
        </p>
      </section>

      <section className="card">
        <h2>5. Your Rights (GDPR/Privacy Laws)</h2>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your data</li>
          <li><strong>Correction:</strong> Update incorrect information</li>
          <li><strong>Deletion:</strong> Request removal of your data (subject to legal requirements)</li>
          <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
          <li><strong>Objection:</strong> Object to certain data processing</li>
        </ul>
        <p>
          Contact <a href="mailto:hello@scopelock.dev">hello@scopelock.dev</a> to exercise these rights.
        </p>
      </section>

      <section className="card">
        <h2>6. Security</h2>
        <p>We implement reasonable security measures:</p>
        <ul>
          <li>Encrypted communications (TLS/SSL)</li>
          <li>Access controls and authentication</li>
          <li>Regular security reviews</li>
          <li>Secure code repositories (private by default)</li>
        </ul>
        <p>
          No system is 100% secure. We will notify you promptly of any data breaches affecting your information.
        </p>
      </section>

      <section className="card">
        <h2>7. Cookies and Tracking</h2>
        <p>
          Our website uses minimal cookies for:
        </p>
        <ul>
          <li>Session management</li>
          <li>Basic analytics (page views, navigation)</li>
        </ul>
        <p>
          We do <strong>not</strong> use tracking pixels, cross-site cookies, or ad retargeting.
        </p>
      </section>

      <section className="card">
        <h2>8. International Data Transfers</h2>
        <p>
          We&apos;re based in France (EU). If you&apos;re outside the EU, your data may be transferred
          to the EU for processing. We comply with applicable data transfer regulations.
        </p>
      </section>

      <section className="card">
        <h2>9. Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to individuals under 18. We do not knowingly collect data
          from children.
        </p>
      </section>

      <section className="card">
        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this policy as our services evolve. Material changes will be communicated
          to active clients via email.
        </p>
      </section>

      <section className="card">
        <h2>Questions or Concerns?</h2>
        <p>
          Contact us at <a href="mailto:hello@scopelock.dev">hello@scopelock.dev</a> for privacy-related questions.
        </p>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Get in touch</Link>
          <Link href="/terms">See Terms of Service →</Link>
        </div>
      </section>
    </main>
  );
}
