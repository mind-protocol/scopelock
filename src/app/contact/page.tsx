import Link from 'next/link';
import type { Metadata } from 'next';
import { ContactForm } from '../../components/ContactForm';
import { TimezoneConverter } from '../../components/TimezoneConverter';

export const metadata: Metadata = {
  title: 'Contact — ScopeLock',
  description: 'Get in touch to schedule a kickoff. Typical response time <2 hours.',
};

export default function ContactPage() {
  return (
    <main>
      <header className="hero">
        <h1>Get in Touch</h1>
        <p className="lead">Start within 24-48 hours. Typical response &lt;2 hours.</p>
      </header>

      <section className="card">
        <h2>Schedule a Kickoff</h2>
        <p>
          The fastest way to start is to <strong>book a call</strong>. I&apos;ll understand your needs,
          give you a fixed price + timeline, and we can start immediately.
        </p>
        <p>
          <a className="cta" href="https://cal.com/lester-reynolds-ieksyx/30min" target="_blank" rel="noopener">
            Book a 30-minute kickoff call →
          </a>
        </p>
        <p>
          <small>Powered by Cal.com. Choose a time that works for you.</small>
        </p>
      </section>

      <section className="card">
        <h2>Send a Message</h2>
        <p>
          Not ready to schedule a call? Send me a message and I&apos;ll get back to you within 2 hours.
        </p>
        <ContactForm />
      </section>

      <section className="card">
        <h2>Email</h2>
        <p>
          Prefer email? Reach me at:
        </p>
        <p>
          <a href="mailto:scopelock@mindprotocol.ai" style={{fontSize: '1.25rem', fontWeight: 600}}>
            scopelock@mindprotocol.ai
          </a>
        </p>
        <p>
          <strong>Response time:</strong> Typically &lt;2 hours during core hours (14:00–19:00 CET).
        </p>
      </section>

      <section className="card">
        <h2>Availability</h2>
        <p><strong>Location:</strong> France (Central European Time)</p>
        <TimezoneConverter />
        <p><strong>Kickoff timing:</strong> Usually ≤72 hours from first contact</p>
      </section>

      <section className="card">
        <h2>Connect on Social</h2>
        <p>Find me on other platforms:</p>
        <ul>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/nicolas-lester-reynolds-836ab828/" target="_blank" rel="noopener">nicolas-lester-reynolds</a></li>
          <li><strong>X (Twitter):</strong> <a href="https://x.com/nlr_ai" target="_blank" rel="noopener">@nlr_ai</a></li>
          <li><strong>Telegram:</strong> <a href="https://t.me/nlr_ai" target="_blank" rel="noopener">@nlr_ai</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/mind-protocol" target="_blank" rel="noopener">@mind-protocol</a></li>
          <li><strong>Upwork:</strong> <a href="https://www.upwork.com/freelancers/~0121cfb6a08401468a" target="_blank" rel="noopener">View profile</a></li>
          <li><strong>Contra:</strong> Independent work platform</li>
        </ul>
        <p>
          <strong>Note:</strong> Direct engagement via email or Cal.com is preferred for fastest response.
        </p>
      </section>

      <section className="card">
        <h2>What Happens Next?</h2>
        <ol>
          <li><strong>Initial call (30 min):</strong> I understand your needs and explain how I work</li>
          <li><strong>Fixed price quote:</strong> I send you a detailed quote with timeline (2-7 days typical)</li>
          <li><strong>Start immediately:</strong> Once you approve, I begin work within 24-48 hours</li>
          <li><strong>Daily updates:</strong> You get progress updates without having to ask</li>
          <li><strong>Delivery & payment:</strong> You test, request changes (2 revisions included), pay only when satisfied</li>
        </ol>
        <p>
          No hourly billing. No surprise costs. Just fixed pricing and fast delivery.
        </p>
      </section>

      <section className="card">
        <h2>Questions Before Reaching Out?</h2>
        <div className="hero-ctas">
          <Link href="/faq">Read FAQ</Link>
          <Link href="/pricing">See pricing</Link>
          <Link href="/process">How we work</Link>
        </div>
      </section>
    </main>
  );
}
