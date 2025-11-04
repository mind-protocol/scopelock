import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'How We Deliver in 1 Week What Agencies Quote in 8 | ScopeLock Blog',
  description: 'Agencies optimize for billable hours. We optimize for speed. Learn how we eliminate waste, cut meetings, and deliver faster without cutting quality.',
  keywords: ['rapid development', 'agency alternative', 'fast software delivery', 'startup development', 'software agency'],
};

export default function AgencySpeedPage() {
  return (
    <main className={styles.agencySpeed}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/blog" className={styles.backLink}>← Blog</Link>
        <h1>How We Deliver in 1 Week What Agencies Quote in 8</h1>
        <div className={styles.meta}>
          <time>Nov 4, 2025</time>
          <span>•</span>
          <span>9 min read</span>
          <span>•</span>
          <span>Nicolas Lester Reynolds</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#rapid-development</span>
          <span className={styles.tag}>#agency-alternative</span>
          <span className={styles.tag}>#speed</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "Your agency quoted 12 weeks. Why do you think you can do it in 2?"
        </p>
        <p>
          Fair question. The answer isn't that we work harder or cut corners. It's that we eliminate the structural waste that agencies can't.
        </p>
        <p className={styles.callout}>
          Agencies optimize for <strong>billable hours.</strong> We optimize for <strong>speed.</strong>
        </p>
      </section>

      {/* The Math */}
      <section className={styles.mathSection}>
        <h2>The Math That Reveals Everything</h2>

        <p>Let's break down a typical agency's 8-week timeline:</p>

        <div className={styles.timelineBreakdown}>
          <div className={styles.breakdownCard}>
            <div className={styles.breakdownWeek}>Week 1-2</div>
            <div className={styles.breakdownActivity}>Discovery & Planning</div>
            <div className={styles.breakdownTime}>80 hours</div>
            <div className={styles.breakdownDetail}>
              Kickoff meeting, requirements gathering, wireframes, architecture docs, internal alignment
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.breakdownWeek}>Week 3-6</div>
            <div className={styles.breakdownActivity}>Development</div>
            <div className={styles.breakdownTime}>160 hours</div>
            <div className={styles.breakdownDetail}>
              Backend setup, frontend work, API integration, design implementation, internal reviews
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.breakdownWeek}>Week 7</div>
            <div className={styles.breakdownActivity}>QA & Revisions</div>
            <div className={styles.breakdownTime}>40 hours</div>
            <div className={styles.breakdownDetail}>
              Testing, bug fixes, client feedback rounds, adjustments
            </div>
          </div>

          <div className={styles.breakdownCard}>
            <div className={styles.breakdownWeek}>Week 8</div>
            <div className={styles.breakdownActivity}>Deployment & Handoff</div>
            <div className={styles.breakdownTime}>40 hours</div>
            <div className={styles.breakdownDetail}>
              Final review, deployment, documentation, training, knowledge transfer
            </div>
          </div>
        </div>

        <div className={styles.total}>
          <strong>Total: 320 hours</strong> across 8 weeks
        </div>

        <p className={styles.mathQuestion}>But here's the question nobody asks:</p>

        <div className={styles.mathReveal}>
          <strong>How many of those 320 hours are actual development?</strong>
        </div>

        <p>About 160 hours. The other 160? Coordination overhead.</p>
      </section>

      {/* The Overhead */}
      <section className={styles.overheadSection}>
        <h2>What We Cut (And Why Agencies Can't)</h2>

        <div className={styles.overheadGrid}>
          <div className={styles.overheadCard}>
            <div className={styles.overheadIcon}>📅</div>
            <h3>Status Meetings</h3>
            <div className={styles.overheadTime}>~20 hours/project</div>
            <p className={styles.overheadDesc}>
              <strong>Agency:</strong> Weekly check-ins, sprint planning, retrospectives, internal syncs.
            </p>
            <p className={styles.overheadDesc}>
              <strong>ScopeLock:</strong> SYNC.md. Written updates. No meetings until delivery.
            </p>
            <div className={styles.overheadSavings}>Savings: 20 hours</div>
          </div>

          <div className={styles.overheadCard}>
            <div className={styles.overheadIcon}>🔍</div>
            <h3>Discovery Phase</h3>
            <div className={styles.overheadTime}>~40 hours/project</div>
            <p className={styles.overheadDesc}>
              <strong>Agency:</strong> Requirements gathering, workshops, wireframes, architecture docs.
            </p>
            <p className={styles.overheadDesc}>
              <strong>ScopeLock:</strong> AC.md. Co-written in 2 hours. Executable criteria, no ambiguity.
            </p>
            <div className={styles.overheadSavings}>Savings: 38 hours</div>
          </div>

          <div className={styles.overheadCard}>
            <div className={styles.overheadIcon}>🎨</div>
            <h3>Design Iterations</h3>
            <div className={styles.overheadTime}>~30 hours/project</div>
            <p className={styles.overheadDesc}>
              <strong>Agency:</strong> Mockups, client review, revisions, handoff to dev.
            </p>
            <p className={styles.overheadDesc}>
              <strong>ScopeLock:</strong> Build directly. Design in-browser. Evidence Sprint shows working UI in 2-5 days.
            </p>
            <div className={styles.overheadSavings}>Savings: 25 hours</div>
          </div>

          <div className={styles.overheadCard}>
            <div className={styles.overheadIcon}>🔄</div>
            <h3>Internal Coordination</h3>
            <div className={styles.overheadTime}>~30 hours/project</div>
            <p className={styles.overheadDesc}>
              <strong>Agency:</strong> Backend/frontend sync, designer/dev handoff, PM updates, timesheet management.
            </p>
            <p className={styles.overheadDesc}>
              <strong>ScopeLock:</strong> AI citizens work in parallel. No handoffs. No internal coordination.
            </p>
            <div className={styles.overheadSavings}>Savings: 30 hours</div>
          </div>

          <div className={styles.overheadCard}>
            <div className={styles.overheadIcon}>📋</div>
            <h3>QA Phase</h3>
            <div className={styles.overheadTime}>~25 hours/project</div>
            <p className={styles.overheadDesc}>
              <strong>Agency:</strong> Separate QA team, test plan, bug reports, back-and-forth with dev.
            </p>
            <p className={styles.overheadDesc}>
              <strong>ScopeLock:</strong> Acceptance tests written first. CI runs on every commit. Green = done.
            </p>
            <div className={styles.overheadSavings}>Savings: 20 hours</div>
          </div>

          <div className={styles.overheadCard}>
            <div className={styles.overheadIcon}>📝</div>
            <h3>Documentation & Handoff</h3>
            <div className={styles.overheadTime}>~15 hours/project</div>
            <p className={styles.overheadDesc}>
              <strong>Agency:</strong> Final documentation, deployment guide, training session, knowledge transfer.
            </p>
            <p className={styles.overheadDesc}>
              <strong>ScopeLock:</strong> README + inline docs during development. Public proof log. Self-documenting.
            </p>
            <div className={styles.overheadSavings}>Savings: 10 hours</div>
          </div>
        </div>

        <div className={styles.overheadTotal}>
          <strong>Total Overhead Cut:</strong> 143 hours<br/>
          <span className={styles.overheadPercent}>That's 45% of the agency timeline</span>
        </div>
      </section>

      {/* Side by Side */}
      <section className={styles.comparisonSection}>
        <h2>Side-by-Side: Same Project, Different Timelines</h2>

        <div className={styles.comparisonGrid}>
          <div className={styles.comparisonCard}>
            <div className={styles.comparisonHeader}>
              <h3>Traditional Agency</h3>
              <div className={styles.comparisonTime}>8 weeks</div>
            </div>

            <div className={styles.comparisonTimeline}>
              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Week 1-2</div>
                <div className={styles.weekActivity}>Discovery & Planning</div>
                <div className={styles.weekMeetings}>3 meetings</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Week 3-4</div>
                <div className={styles.weekActivity}>Backend Development</div>
                <div className={styles.weekMeetings}>2 status calls</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Week 5-6</div>
                <div className={styles.weekActivity}>Frontend Development</div>
                <div className={styles.weekMeetings}>2 status calls</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Week 7</div>
                <div className={styles.weekActivity}>QA & Revisions</div>
                <div className={styles.weekMeetings}>1 review meeting</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Week 8</div>
                <div className={styles.weekActivity}>Deployment</div>
                <div className={styles.weekMeetings}>1 handoff call</div>
              </div>
            </div>

            <div className={styles.comparisonFooter}>
              <div>Total: 320 hours</div>
              <div>9 meetings</div>
              <div>5 phases</div>
            </div>
          </div>

          <div className={`${styles.comparisonCard} ${styles.scopelockCard}`}>
            <div className={styles.comparisonHeader}>
              <h3>ScopeLock</h3>
              <div className={styles.comparisonTime}>1 week</div>
            </div>

            <div className={styles.comparisonTimeline}>
              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Day 1</div>
                <div className={styles.weekActivity}>AC.md Co-Creation</div>
                <div className={styles.weekMeetings}>2 hours</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Day 2</div>
                <div className={styles.weekActivity}>Acceptance Tests Written</div>
                <div className={styles.weekMeetings}>No meetings</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Day 3-5</div>
                <div className={styles.weekActivity}>Implementation (parallel: backend + frontend + tests)</div>
                <div className={styles.weekMeetings}>No meetings</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Day 6</div>
                <div className={styles.weekActivity}>AC Green (all tests pass)</div>
                <div className={styles.weekMeetings}>No meetings</div>
              </div>

              <div className={styles.comparisonWeek}>
                <div className={styles.weekLabel}>Day 7</div>
                <div className={styles.weekActivity}>Proof Published</div>
                <div className={styles.weekMeetings}>Ready for deployment</div>
              </div>
            </div>

            <div className={styles.comparisonFooter}>
              <div>Total: 80 hours</div>
              <div>1 kickoff session</div>
              <div>1 phase</div>
            </div>
          </div>
        </div>

        <div className={styles.comparisonResult}>
          <strong>Same deliverable. 75% less time. 0 meetings (except kickoff).</strong>
        </div>
      </section>

      {/* How */}
      <section className={styles.howSection}>
        <h2>How Is This Possible?</h2>

        <p>Three structural advantages:</p>

        <div className={styles.advantagesList}>
          <div className={styles.advantageCard}>
            <div className={styles.advantageNumber}>1</div>
            <div className={styles.advantageContent}>
              <h3>No Internal Coordination</h3>
              <p>
                Agencies have backend devs, frontend devs, designers, QA, PMs. Every handoff adds delays.
              </p>
              <p>
                <strong>ScopeLock:</strong> AI citizens (Rafael, Daniel, Maya, Sofia) work in parallel. No handoffs. They read/write shared files (AC.md, SYNC.md) instead of scheduling meetings.
              </p>
              <p className={styles.advantageExample}>
                <strong>Example:</strong> While Daniel writes backend, Maya builds frontend, and Sofia writes tests—simultaneously. Traditional teams do this sequentially (weeks apart).
              </p>
            </div>
          </div>

          <div className={styles.advantageCard}>
            <div className={styles.advantageNumber}>2</div>
            <div className={styles.advantageContent}>
              <h3>Acceptance Criteria First</h3>
              <p>
                Agencies start with "requirements gathering" (vague). Then wireframes. Then development. Discovery takes 2-4 weeks.
              </p>
              <p>
                <strong>ScopeLock:</strong> AC.md in 2 hours. Functional criteria + performance thresholds + verification method. No ambiguity. Development starts immediately.
              </p>
              <p className={styles.advantageExample}>
                <strong>Example:</strong> Traditional agency spends Week 1-2 on discovery. We spend 2 hours on AC.md, then start building. 38-hour savings.
              </p>
            </div>
          </div>

          <div className={styles.advantageCard}>
            <div className={styles.advantageNumber}>3</div>
            <div className={styles.advantageContent}>
              <h3>Tests Define Done</h3>
              <p>
                Agencies have a "QA phase" at the end (Week 7). Testing is separate from development. Bugs get reported back to dev. More delays.
              </p>
              <p>
                <strong>ScopeLock:</strong> Acceptance tests written Day 2. CI runs on every commit. When tests are green, milestone is complete. No separate QA phase.
              </p>
              <p className={styles.advantageExample}>
                <strong>Example:</strong> Agency finds bugs in Week 7, fixes in Week 8. We catch them on commit #3 (Day 3). 25-hour savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objections */}
      <section className={styles.objectionsSection}>
        <h2>Common Objections (And Why They Don't Hold)</h2>

        <div className={styles.objectionsList}>
          <div className={styles.objectionCard}>
            <h3>"You must be cutting corners on quality"</h3>
            <p>
              <strong>Reality:</strong> We have <em>more</em> tests than most agencies. Acceptance tests + CI on every commit. Sofia (our quality citizen) blocks merges that don't meet standards.
            </p>
            <p>
              Agencies often skip tests entirely ("we'll add those later"). We write tests first (Day 2).
            </p>
          </div>

          <div className={styles.objectionCard}>
            <h3>"Fast means expensive developers"</h3>
            <p>
              <strong>Reality:</strong> Our pricing is often <em>lower</em> than agencies. Why? Because we cut 143 hours of overhead. Agency charges you for meetings and coordination. We don't.
            </p>
            <p>
              Compare: Agency at $150/hr × 320 hours = $48K. ScopeLock: 80 hours of actual work = $12K-18K depending on complexity.
            </p>
          </div>

          <div className={styles.objectionCard}>
            <h3>"Our project is too complex for 1 week"</h3>
            <p>
              <strong>Reality:</strong> Fair point. Not every project fits 1 week. Complex systems take longer.
            </p>
            <p>
              But here's the pattern: Agency quotes 12 weeks. We deliver in 3-4 weeks. Same ratio (3-4× faster), different baseline.
            </p>
            <p>
              <strong>Why?</strong> Because the overhead scales linearly with project size. Longer project = more meetings, more phases, more coordination. We eliminate that regardless of size.
            </p>
          </div>

          <div className={styles.objectionCard}>
            <h3>"What about changes mid-project?"</h3>
            <p>
              <strong>Reality:</strong> CHG-130 handles this. Change is either <strong>Swap</strong> (equal/lower complexity, €0, same timeline) or <strong>Add</strong> (new milestone, priced separately).
            </p>
            <p>
              Agencies often say "yes" to changes, then surprise you with extra costs. We're transparent upfront.
            </p>
            <p>
              <Link href="/blog/change-control-without-scope-creep">Read: Change Control Without Scope Creep</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Real Example */}
      <section className={styles.exampleSection}>
        <h2>Real Example: OTP Signup</h2>

        <div className={styles.exampleComparison}>
          <div className={styles.exampleColumn}>
            <h3>Agency Quote (Real)</h3>
            <div className={styles.exampleDetail}>
              <strong>Timeline:</strong> 6 weeks
            </div>
            <div className={styles.exampleDetail}>
              <strong>Breakdown:</strong>
              <ul>
                <li>Week 1: Requirements & planning</li>
                <li>Week 2-3: Development</li>
                <li>Week 4: Testing</li>
                <li>Week 5: Revisions</li>
                <li>Week 6: Deployment & docs</li>
              </ul>
            </div>
            <div className={styles.exampleDetail}>
              <strong>Price:</strong> $18K (120 hours × $150/hr)
            </div>
            <div className={styles.exampleDetail}>
              <strong>Meetings:</strong> 6 scheduled calls
            </div>
          </div>

          <div className={styles.exampleColumn}>
            <h3>ScopeLock Delivery</h3>
            <div className={styles.exampleDetail}>
              <strong>Timeline:</strong> 5 days
            </div>
            <div className={styles.exampleDetail}>
              <strong>Breakdown:</strong>
              <ul>
                <li>Day 1: AC.md co-creation (2 hours)</li>
                <li>Day 2: Acceptance tests written</li>
                <li>Day 3-4: Implementation + tests green</li>
                <li>Day 5: Proof published, deployed</li>
              </ul>
            </div>
            <div className={styles.exampleDetail}>
              <strong>Price:</strong> $5K (fixed-price milestone)
            </div>
            <div className={styles.exampleDetail}>
              <strong>Meetings:</strong> 1 kickoff (2 hours)
            </div>
          </div>
        </div>

        <div className={styles.exampleOutcome}>
          <strong>Result:</strong> Same deliverable. 83% faster. 72% cheaper. 0 scope ambiguity.
        </div>

        <p>
          <Link href="/blog/why-acceptance-criteria-beat-time-estimates" className={styles.exampleLink}>
            Read the full breakdown: Why Acceptance Criteria Beat Time Estimates
          </Link>
        </p>
      </section>

      {/* Why Agencies Can't */}
      <section className={styles.whySection}>
        <h2>Why Agencies Can't Do This</h2>

        <p>It's not that agencies are incompetent. It's structural:</p>

        <div className={styles.structuralGrid}>
          <div className={styles.structuralCard}>
            <h3>Billable Hours Model</h3>
            <p>
              Agencies charge by the hour. Faster delivery = less revenue. Every meeting, every phase, every handoff is billable time.
            </p>
            <p>
              <strong>Incentive:</strong> Extend timeline.
            </p>
          </div>

          <div className={styles.structuralCard}>
            <h3>Team Coordination Overhead</h3>
            <p>
              Human teams need handoffs. Backend finishes, then frontend starts. Designer creates mockups, developer implements. Sequential, not parallel.
            </p>
            <p>
              <strong>Result:</strong> Delays compound.
            </p>
          </div>

          <div className={styles.structuralCard}>
            <h3>Risk Aversion</h3>
            <p>
              Agencies add "buffer time" to every estimate. Discovery phase = buffer. QA phase = buffer. Revision rounds = buffer.
            </p>
            <p>
              <strong>Why:</strong> Protect reputation. Easier to finish early than explain delays.
            </p>
          </div>

          <div className={styles.structuralCard}>
            <h3>Meeting Culture</h3>
            <p>
              Status meetings exist because coordination is hard. Without meetings, teams drift. So agencies schedule weekly check-ins, standups, retrospectives.
            </p>
            <p>
              <strong>Cost:</strong> 20-30 hours per project.
            </p>
          </div>
        </div>

        <div className={styles.structuralConclusion}>
          <p>
            None of this is malicious. It's just how agencies are built. They optimize for <strong>revenue consistency</strong>, not <strong>client speed</strong>.
          </p>
          <p>
            ScopeLock optimizes differently. Fixed-price + pay-at-AC-green = we benefit from speed, not delays.
          </p>
        </div>
      </section>

      {/* What This Means */}
      <section className={styles.meansSection}>
        <h2>What This Means for You</h2>

        <div className={styles.meansList}>
          <div className={styles.meansCard}>
            <div className={styles.meansIcon}>⚡</div>
            <h3>Launch Faster</h3>
            <p>
              Agency timeline: 12 weeks. ScopeLock: 3 weeks. That's 9 weeks you can spend on <em>running</em> your product instead of <em>building</em> it.
            </p>
          </div>

          <div className={styles.meansCard}>
            <div className={styles.meansIcon}>💰</div>
            <h3>Lower Total Cost</h3>
            <p>
              We cut 45% of overhead. That savings goes to you, not us. Compare quotes: agency $48K, ScopeLock $18K. Same deliverable.
            </p>
          </div>

          <div className={styles.meansCard}>
            <div className={styles.meansIcon}>📊</div>
            <h3>Less Risk</h3>
            <p>
              Pay at AC green. If tests don't pass, you don't pay. No "90% done" ambiguity. No surprise costs. You know the price before we start.
            </p>
          </div>

          <div className={styles.meansCard}>
            <div className={styles.meansIcon}>🎯</div>
            <h3>Clear Outcomes</h3>
            <p>
              AC.md defines "done" before we start. Acceptance tests verify it. No debates, no interpretation. Tests green = milestone complete.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Compare for Yourself</h2>

        <p>
          Get an agency quote. Then schedule a ScopeLock kickoff. Compare:
        </p>

        <div className={styles.ctaComparison}>
          <div className={styles.ctaRow}>
            <div className={styles.ctaLabel}>Timeline</div>
            <div className={styles.ctaValue}>Agency: 8-12 weeks → ScopeLock: 1-3 weeks</div>
          </div>
          <div className={styles.ctaRow}>
            <div className={styles.ctaLabel}>Meetings</div>
            <div className={styles.ctaValue}>Agency: 6-10 calls → ScopeLock: 1 kickoff</div>
          </div>
          <div className={styles.ctaRow}>
            <div className={styles.ctaLabel}>Phases</div>
            <div className={styles.ctaValue}>Agency: 5-7 phases → ScopeLock: 1 phase</div>
          </div>
          <div className={styles.ctaRow}>
            <div className={styles.ctaLabel}>Price</div>
            <div className={styles.ctaValue}>Agency: $30K-80K → ScopeLock: $8K-25K</div>
          </div>
          <div className={styles.ctaRow}>
            <div className={styles.ctaLabel}>Payment</div>
            <div className={styles.ctaValue}>Agency: Upfront/milestones → ScopeLock: Pay at AC green</div>
          </div>
        </div>

        <div className={styles.ctaButtons}>
          <Link href="/pricing" className={styles.ctaPrimary}>
            See Our Pricing
          </Link>
          <Link href="/contact" className={styles.ctaSecondary}>
            Schedule Kickoff Call
          </Link>
        </div>

        <p className={styles.ctaFooter}>
          Not sure if your project fits? <Link href="/blog/the-evidence-sprint-prove-value-in-90-seconds">Start with an Evidence Sprint</Link> ($3K-6K, 2-5 days).
        </p>
      </section>

      {/* Footer nav */}
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backToIndex}>← Back to Blog</Link>
      </nav>
    </main>
  );
}
