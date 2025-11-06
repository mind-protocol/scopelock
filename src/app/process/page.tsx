import Link from 'next/link';
import type { Metadata } from 'next';
import { ProcessTimeline } from '../../components/ProcessTimeline';

export const metadata: Metadata = {
  title: 'How ScopeLock Works',
  description: 'Fixed pricing. Fast delivery (2-7 days). You pay only when satisfied. See how ScopeLock works with clients from kickoff to delivery.',
};

export default function ProcessPage() {
  return (
    <main>
      <header className="hero">
        <h1>How ScopeLock Works</h1>
        <p className="lead">Fixed pricing. Fast delivery (2-7 days). You pay only when satisfied.</p>
      </header>

      <ProcessTimeline />

      <section className="card">
        <h2>The Process</h2>
        <p>
          Most freelancers sell hours. Agencies sell phases. I deliver <strong>complete projects at fixed prices</strong>.
        </p>
        <p>Here&apos;s how it works:</p>
      </section>

      <section className="card scope-steps">
        <h2>Step 1: You Describe What You Need (Day 1)</h2>
        <p>
          I start with a 30-minute call where you tell me what you need. I ask questions to understand:
        </p>
        <ul>
          <li><strong>What it should do:</strong> Core features and functionality</li>
          <li><strong>Who will use it:</strong> Your target users and their needs</li>
          <li><strong>Success criteria:</strong> How we&apos;ll know it&apos;s working correctly</li>
        </ul>
        <p>
          Within 24 hours, I send you a fixed price quote and timeline (usually 2-7 days). The price won&apos;t change unless you change what you need.
        </p>
      </section>

      <section className="card scope-steps">
        <h2>Step 2: I Start Building (Days 2-3)</h2>
        <p>
          Once you approve the quote, I begin work immediately. Within 2-3 days, I share early progress with you:
        </p>
        <ul>
          <li><strong>Working demo:</strong> A clickable prototype or proof-of-concept</li>
          <li><strong>Progress update:</strong> What&apos;s done, what&apos;s next, any questions I have</li>
        </ul>
        <p>
          This lets you see progress early and make sure we&apos;re on the right track. If something needs adjustment, we catch it early.
        </p>
      </section>

      <section className="card scope-steps">
        <h2>Step 3: I Deliver the Full Project (Days 4-7)</h2>
        <p>
          I finish building and testing everything. You get:
        </p>
        <ul>
          <li><strong>Live deployment:</strong> Working website/app you can test immediately</li>
          <li><strong>Source code:</strong> All code, documentation, and deployment instructions</li>
          <li><strong>Access credentials:</strong> Everything you need to manage it yourself</li>
        </ul>
        <p>
          I test everything before handing it off to you. No surprises, no &quot;it works on my machine&quot; issues.
        </p>
      </section>

      <section className="card scope-steps">
        <h2>Step 4: You Test & Pay When Satisfied (Day 8+)</h2>
        <p>
          You test the project and let me know if anything needs adjustment. You get <strong>2 revision rounds included</strong> in the price.
        </p>
        <p>
          Common revisions: fixing bugs, adjusting styling, clarifying documentation, adding small features that were missed.
        </p>
        <p>
          You pay <strong>only when you&apos;re completely satisfied</strong>. No hourly surprises. No scope creep charges (unless you change what you originally asked for).
        </p>
      </section>

      <section className="card">
        <h2>What If I Change My Mind Mid-Project?</h2>
        <p>
          No problem. Here&apos;s how I handle scope changes:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Small adjustments (free):</strong> If you want to swap one feature for another of similar complexity, I&apos;ll do it at no extra cost. For example, changing &quot;Twitter login&quot; to &quot;Google login&quot; is a swap—same effort, same price.
        </p>
        <p>
          <strong>New features (priced separately):</strong> If you want to add something beyond the original scope, I&apos;ll give you a separate quote for it. You decide if you want to proceed.
        </p>
        <p>
          The key: I&apos;ll always tell you upfront if a change costs extra. No surprise bills.
        </p>
      </section>


      <section className="card">
        <h2>Why This Works</h2>
        <p><strong>For you:</strong></p>
        <ul>
          <li>Fixed pricing—no surprise hourly charges</li>
          <li>Fast delivery—2-7 days typical</li>
          <li>Early visibility—see progress within 2-3 days</li>
          <li>Risk-free—pay only when satisfied, 2 revisions included</li>
          <li>Direct communication—work with me, not account managers</li>
        </ul>
        <p><strong>For me:</strong></p>
        <ul>
          <li>Clear requirements upfront—no guessing games</li>
          <li>Efficient workflow—AI-assisted development speeds everything up</li>
          <li>Portfolio proof—every project becomes a case study</li>
        </ul>
      </section>

      <section className="card">
        <h2>Comparison: How I&apos;m Different</h2>
        <div className="grid-3">
          <article className="card card-case">
            <h3>Traditional Freelancers</h3>
            <ul>
              <li>Sell hours (&quot;$50/hour&quot;)</li>
              <li>Time estimates often wrong</li>
              <li>Scope creep = more hours = higher bill</li>
              <li>&quot;Done&quot; is subjective</li>
              <li>Pay regardless of quality</li>
            </ul>
          </article>
          <article className="card card-case">
            <h3>My Approach</h3>
            <ul>
              <li>Fixed price quoted upfront</li>
              <li>2-7 day delivery typical</li>
              <li>Scope changes handled clearly (swap vs add)</li>
              <li>&quot;Done&quot; = working + tested + deployed</li>
              <li>Pay only when satisfied</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="card">
        <h2>Ready to Get Started?</h2>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Get Free Estimate</Link>
          <Link href="/proof">See My Work →</Link>
        </div>
      </section>
    </main>
  );
}
