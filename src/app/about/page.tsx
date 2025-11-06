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
        <h1>About</h1>
        <p className="lead">
          Solo architect + AI-assisted teams. Professional software & creative work.
          Fixed pricing. Fast delivery.
        </p>
      </header>

      <section className="card">
        <h2>What I Build</h2>
        <p>
          <strong>Development Services:</strong> Web apps, AI chatbots, backend APIs, document processing
        </p>
        <p>
          <strong>Creative AI Services:</strong> Presentations, voiceovers, translations, content writing, images, music
        </p>
        <p style={{ marginTop: '1.5rem' }}>
          <strong>How I work:</strong> Fixed pricing. Fast delivery (2-7 days). You pay only when satisfied. 2 revision rounds included.
        </p>
      </section>

      <section className="card">
        <h2>Nicolas Lester Reynolds — Solo Architect + AI-Assisted Teams</h2>

        <p>
          <strong>I&apos;m not a traditional agency.</strong> I&apos;m the solo architect who designs everything. I oversee a small team of developers
          who implement under my supervision, with custom AI-driven workflow for code generation.
        </p>

        <p>
          <strong>Result:</strong> 10-15 features/week vs. 2-3 for traditional solo dev. Team-level throughput with single-architect clarity.
        </p>

        <p>
          <strong>Proof:</strong> GitHub shows <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">65,000 commits in 2024</a>—you can verify the velocity. I don&apos;t hide the AI assistance.
        </p>

        <h3>Verification Links</h3>
        <ul>
          <li><strong>Personal GitHub:</strong> <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">@nlr-ai</a> — 65K commits, daily activity</li>
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

        <h3>Why This Approach Works</h3>
        <p>
          Most freelance work fails on ambiguity. You don&apos;t know if you&apos;re getting what you paid for until it&apos;s too late.
        </p>
        <p>
          <strong>My approach eliminates that:</strong> Fixed price quoted upfront. Daily progress updates. 2 revision rounds included. You only pay when you&apos;re completely satisfied.
        </p>
      </section>

      <TeamTools />

      <section className="card">
        <h2>How I&apos;m Different</h2>
        <p>
          Most freelancers sell hours. Agencies sell phases. I deliver <strong>complete projects at fixed prices</strong>.
        </p>
        <ul>
          <li>You know <strong>exactly what you&apos;re paying for</strong> (fixed price quoted upfront)</li>
          <li>You see <strong>progress daily</strong> (updates without you having to ask)</li>
          <li>You pay <strong>only when satisfied</strong> (2 revisions included, no surprise costs)</li>
          <li>You work <strong>directly with me</strong> (the architect, not account managers)</li>
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
