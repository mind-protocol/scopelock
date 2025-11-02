import Link from 'next/link';
import type { Metadata } from 'next';
import { ContactForm } from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — ScopeLock',
  description: 'Get in touch to schedule a kickoff. Typical response time <2 hours.',
};

export default function ContactPage() {
  return (
    <main>
      <header className="hero">
        <h1>Get in Touch</h1>
        <p className="lead">Schedule a kickoff. Typical response &lt;2 hours.</p>
      </header>

      <section className="card">
        <h2>Schedule a Kickoff</h2>
        <p>
          The fastest way to start is to <strong>book a call</strong>. We&apos;ll discuss your needs,
          co-write <code>AC.md</code>, and agree on price before any work begins.
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
          Not ready to schedule a call? Send us a message and we&apos;ll get back to you.
        </p>
        <ContactForm />
      </section>

      <section className="card">
        <h2>Email</h2>
        <p>
          Prefer email? Reach us at:
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
        <ul>
          <li><strong>Location:</strong> France (Central European Time)</li>
          <li><strong>Core hours:</strong> 14:00–19:00 CET (overlaps with US East Coast afternoons, West Coast mornings)</li>
          <li><strong>Kickoff timing:</strong> Usually ≤72 hours from first contact</li>
        </ul>
      </section>

      <section className="card">
        <h2>Find Us Elsewhere</h2>
        <p>Connect on other platforms:</p>
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
          <li><strong>Initial call (30 min):</strong> Understand your needs, explain our model</li>
          <li><strong>Co-write AC.md:</strong> Define acceptance criteria together</li>
          <li><strong>Price & timeline:</strong> Fixed price for milestone(s), kickoff timing</li>
          <li><strong>Start:</strong> Evidence Sprint or full feature development</li>
        </ol>
        <p>
          No hourly billing. No vague estimates. Just locked scope, locked price, and AC green delivery.
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
