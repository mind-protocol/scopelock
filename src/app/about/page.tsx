import Link from 'next/link';
import type { Metadata } from 'next';

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
        <h2>The Team</h2>

        <h3>Nicolas Lester Reynolds — Founder</h3>
        <p>
          Serial founder and rapid-delivery builder. I ship working systems against executable acceptance criteria using an AI partnership model—the same architecture behind <a href="https://github.com/mind-protocol/serenissima" target="_blank" rel="noopener">La Serenissima</a> (120+ autonomous agents, months of live operation) and <a href="https://github.com/nlr-ai/terminal-velocity" target="_blank" rel="noopener">Terminal Velocity</a> (1,051 GitHub stars).
        </p>
        <ul>
          <li><strong>Location:</strong> Lyon, France</li>
          <li><strong>Availability:</strong> 14:00–19:00 CET (08:00–13:00 US Central)</li>
          <li><strong>Live projects:</strong> <a href="https://universalbasiccompute.ai" target="_blank" rel="noopener">Universal Basic Compute</a>, <a href="https://therapykin.ai" target="_blank" rel="noopener">TherapyKin</a>, <a href="https://konginvest.ai" target="_blank" rel="noopener">KongInvest</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/mind-protocol" target="_blank" rel="noopener">@mind-protocol</a> (org), <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">@nlr-ai</a> (personal)</li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/nicolas-lester-reynolds-836ab828/" target="_blank" rel="noopener">nicolas-lester-reynolds</a></li>
        </ul>
        <p>
          <strong>Why ScopeLock exists:</strong> Most freelance dev fails on ambiguity. Clients don't know if they're paying for "working" or "working toward." ScopeLock eliminates that: co-written AC.md defines done, acceptance tests verify it, you pay only at green. Evidence Sprints (≤90s demos + quantified deltas) prove value before full commitment.
        </p>

        <h3>The Citizens (Specialized Roles)</h3>
        <p>
          We operate as a team of domain specialists (human + AI citizens), each owning their domain:
        </p>
        <ul>
          <li><strong>Emma &quot;The Scout&quot;</strong> — Lead Intelligence (prospecting, triage, proposal inputs)</li>
          <li><strong>Rafael &quot;The Harbor&quot;</strong> — Relationships & Change Requests (client ops, AC co-authoring, CHG-130)</li>
          <li><strong>Sofia &quot;The Gauge&quot;</strong> — Quality & Policy Guardian (reviewer, fail-loud enforcement, baseline guard)</li>
          <li><strong>Daniel &quot;The Forge&quot;</strong> — Core Builder (features, acceptance tests, performance deltas)</li>
          <li><strong>Aïcha &quot;The Architect&quot;</strong> — Architecture & Membrane (event schemas, /proof contracts, CHG-130 semantics)</li>
          <li><strong>Maya &quot;The Facet&quot;</strong> — Frontend & Evidence UX (homepage, /proof UI, accessibility)</li>
          <li><strong>Priya &quot;The Pulse&quot;</strong> — Supervision (health monitoring, readiness/liveness, MTTR &lt;10m)</li>
        </ul>
      </section>

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
