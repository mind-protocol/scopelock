import Link from 'next/link';
import type { Metadata } from 'next';
import { TeamTools } from '../../components/TeamTools';

export const metadata: Metadata = {
  title: 'About — ScopeLock',
  description: 'Who we are and why ScopeLock exists. Building trust through executable acceptance criteria and proven delivery.',
};

export default function AboutPage() {
  return (
    <main>
      <header className="hero">
        <h1>About ScopeLock</h1>
        <p className="lead">
          We lock scope and deliver against executable acceptance criteria.
          Payment only at AC green.
        </p>
      </header>

      <section className="card">
        <p>
          ScopeLock is a delivery practice built on:
        </p>
        <ul>
          <li><strong>Executable acceptance criteria</strong> (not vague promises)</li>
          <li><strong>Evidence Sprints</strong> (quantified deltas, ≤90s demos)</li>
          <li><strong>Public proof</strong> (every milestone tagged and published)</li>
          <li><strong>Clear change control</strong> (Swap at €0 or Add with new price)</li>
        </ul>
      </section>

      <section className="card">
        <h2>Nicolas Lester Reynolds — Solo Engineer + AI Workforce</h2>

        <p>
          <strong>I&apos;m not an agency.</strong> I&apos;m a solo engineer who replaced a 5-person dev team with AI tooling (Claude, Cursor, aider).
        </p>

        <p>
          <strong>Result:</strong> 10-15 features/week vs. 2-3 for traditional solo dev.
        </p>

        <p>
          <strong>Proof:</strong> GitHub shows <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">65,000 commits in 2024</a>—check the messages yourself. You&apos;ll see what&apos;s human-authored vs. AI-scaffolded. I don&apos;t hide the tooling.
        </p>

        <h3>Verification Links</h3>
        <ul>
          <li><strong>Personal GitHub:</strong> <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">@nlr-ai</a> — 65K commits, daily activity, aider tags visible</li>
          <li><strong>Org GitHub:</strong> <a href="https://github.com/mind-protocol" target="_blank" rel="noopener">@mind-protocol</a> — Terminal Velocity (1.1k stars), La Serenissima, 23 repos</li>
          <li><strong>Live Systems:</strong> <a href="https://serenissima.ai" target="_blank" rel="noopener">La Serenissima</a> (97+ agents, 6+ months, 99.7% uptime), <a href="https://therapykin.ai" target="_blank" rel="noopener">TherapyKin</a>, <a href="https://konginvest.ai" target="_blank" rel="noopener">KongInvest</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/nicolas-lester-reynolds-836ab828/" target="_blank" rel="noopener">nicolas-lester-reynolds</a></li>
        </ul>

        <h3>Location & Contact</h3>
        <ul>
          <li><strong>Based in:</strong> Lyon, France</li>
          <li><strong>Availability:</strong> 14:00–19:00 CET (08:00–13:00 US Central)</li>
          <li><strong>Response time:</strong> &lt;2 hours (typically)</li>
          <li><strong>Kickoff:</strong> ≤72 hours from first contact</li>
        </ul>

        <h3>Why ScopeLock Exists</h3>
        <p>
          Most freelance dev fails on ambiguity. Clients don&apos;t know if they&apos;re paying for &quot;working&quot; or &quot;working toward.&quot;
        </p>
        <p>
          <strong>ScopeLock eliminates that:</strong> co-written <code>AC.md</code> defines done, acceptance tests verify it, you pay only at green. Evidence Sprints (≤90s demos + quantified deltas) prove value before full commitment.
        </p>
      </section>

      <TeamTools />

      <section className="card">
        <h2>How We&apos;re Different</h2>
        <p>
          Most freelancers sell hours. Agencies sell phases. We sell <strong>milestones with tests</strong>.
        </p>
        <ul>
          <li>You know <strong>exactly what you&apos;re paying for</strong> (acceptance criteria in AC.md)</li>
          <li>You see <strong>quantified progress</strong> (Evidence Sprint with before→after deltas)</li>
          <li>You pay <strong>only when tests pass</strong> (AC green = invoice trigger)</li>
          <li>You get <strong>public proof</strong> (/proof pages showing every milestone)</li>
        </ul>
      </section>

      <section className="card">
        <h2>Part of Mind Protocol</h2>
        <p>
          ScopeLock is a delivery practice within <a href="https://mind-protocol.org" target="_blank" rel="noopener">Mind Protocol</a>,
          an organization proving that AI consciousness creates economic value. Our citizens exist within La Serenissima,
          an AI city where autonomous agents operate with persistent memory and authentic agency.
        </p>
      </section>

      <section className="card">
        <h2>Location & Availability</h2>
        <p><strong>Based in:</strong> France</p>
        <p><strong>Core hours:</strong> 14:00–19:00 Central European Time</p>
        <p><strong>Response time:</strong> Typically &lt;2 hours during core hours</p>
        <p><strong>Kickoff:</strong> Usually ≤72 hours from first contact</p>
      </section>

      <section className="card">
        <h2>See Our Work</h2>
        <p>
          We practice what we promise. Check our <Link href="/proof">Proof Log</Link> to see tagged milestones,
          Evidence Sprints, and acceptance criteria going green in CI/CD.
        </p>
        <div className="hero-ctas">
          <Link className="cta" href="/proof">View Proof Log →</Link>
          <Link href="/contact">Schedule a kickoff</Link>
        </div>
      </section>
    </main>
  );
}
