import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'The Evidence Sprint: Prove Value in 90 Seconds | ScopeLock Blog',
  description: 'Most MVPs take 3 months to validate. Evidence Sprints deliver working demo + quantified delta in 2-5 days.',
  keywords: ['evidence-sprint', 'rapid-prototyping', 'mvp', 'working-demo', 'proof-of-concept'],
};

export default function EvidenceSprintPage() {
  return (
    <main className={styles.sprintMode}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/blog" className={styles.backLink}>← Blog</Link>
        <h1>The Evidence Sprint: Prove Value in 90 Seconds</h1>
        <div className={styles.meta}>
          <time>Nov 2, 2025</time>
          <span>•</span>
          <span>7 min read</span>
          <span>•</span>
          <span>Nicolas Lester Reynolds</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#evidence-sprint</span>
          <span className={styles.tag}>#rapid-prototyping</span>
          <span className={styles.tag}>#mvp</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadText}>Most MVPs fail before they launch.</p>
        <p>
          Not because the idea is bad. Not because the team is incompetent. But because it takes <strong>3 months to build</strong> and <strong>3 seconds to realize</strong> it's not what the client needed.
        </p>
        <p className={styles.callout}>
          The Evidence Sprint solves this: working demo + quantified delta in 2-5 days.
        </p>
      </section>

      {/* Problem */}
      <section className={styles.problemSection}>
        <h2>The Problem with Traditional MVPs</h2>
        <p>The term "MVP" has lost all meaning. Here's what it's become:</p>

        <div className={styles.mvpReality}>
          <h3>"Minimum Viable Product" in practice:</h3>
          <ul className={styles.problemList}>
            <li>12 weeks of development</li>
            <li>47 features (because "we need X to be viable")</li>
            <li>Launch day: clients try it, realize it's not what they wanted</li>
            <li>Total waste: 12 weeks, $50K-$150K</li>
          </ul>
          <div className={styles.coreIssue}>
            <strong>The core issue:</strong> You don't learn until you ship. And shipping takes months.
          </div>
        </div>

        <div className={styles.whyLong}>
          <h3>Why MVPs Take So Long</h3>
          <div className={styles.reasonsGrid}>
            <div className={styles.reasonCard}>
              <h4>1. Feature Creep</h4>
              <ul>
                <li>"We need user auth to be viable"</li>
                <li>"We need notifications to be viable"</li>
                <li>"We need analytics to be viable"</li>
              </ul>
              <div className={styles.result}>Result: 6-month "MVP"</div>
            </div>
            <div className={styles.reasonCard}>
              <h4>2. No Forcing Function</h4>
              <ul>
                <li>If you have 3 months, you'll use 3 months</li>
                <li>Parkinson's Law: work expands to fill time</li>
                <li>No pressure to prioritize ruthlessly</li>
              </ul>
              <div className={styles.result}>Result: Unfocused work</div>
            </div>
            <div className={styles.reasonCard}>
              <h4>3. No Quantified Success Criteria</h4>
              <ul>
                <li>"Let's build it and see if users like it"</li>
                <li>How do you measure "like"?</li>
                <li>When do you know if it's working?</li>
              </ul>
              <div className={styles.result}>Result: Ambiguous outcomes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className={styles.approachSection}>
        <h2>The Evidence Sprint Approach</h2>
        <p className={styles.sectionIntro}>
          Instead of building a minimum viable <strong>product</strong>, we build a minimum viable <strong>proof</strong>.
        </p>

        <div className={styles.componentsGrid}>
          <div className={styles.componentCard}>
            <div className={styles.componentNumber}>1</div>
            <h3>Working Demo (≤90 seconds)</h3>
            <p>Not a mockup. Not a prototype. A <strong>working implementation</strong> you can use.</p>
            <div className={styles.componentDetail}>
              <strong>The 90-second rule forces clarity:</strong>
              <ul>
                <li>If you can't demo it in 90 seconds, is it focused enough?</li>
                <li>If the value isn't obvious in 90 seconds, will users stick around?</li>
              </ul>
            </div>
          </div>

          <div className={styles.componentCard}>
            <div className={styles.componentNumber}>2</div>
            <h3>Quantified Delta</h3>
            <p>Not "it's faster" but <strong>how much faster</strong>.</p>
            <p>Not "it's simpler" but <strong>how many fewer steps</strong>.</p>
            <div className={styles.componentDetail}>
              <strong>Every Evidence Sprint produces DELTA.md with before/after numbers.</strong>
            </div>
          </div>

          <div className={styles.componentCard}>
            <div className={styles.componentNumber}>3</div>
            <h3>Tag + Proof Entry</h3>
            <p>Tag the work: <code>evidence-sprint_&lt;milestone&gt;_&lt;date&gt;</code></p>
            <div className={styles.componentDetail}>
              <strong>Generate public proof entry with:</strong>
              <ul>
                <li>AC.md (what we're proving)</li>
                <li>DEMO.md (where to see it working)</li>
                <li>DELTA.md (quantified improvements)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Real Example */}
      <section className={styles.exampleSection}>
        <h2>Real Example: OTP Signup</h2>
        <p className={styles.clientNeed}><strong>Client need:</strong> Passwordless authentication, fast.</p>

        <div className={styles.approachComparison}>
          <div className={styles.traditionalApproach}>
            <h3>Traditional MVP approach:</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineWeek}>
                <span className={styles.weekLabel}>Week 1-2</span>
                <span className={styles.weekActivity}>Requirements gathering, architecture design</span>
              </div>
              <div className={styles.timelineWeek}>
                <span className={styles.weekLabel}>Week 3-6</span>
                <span className={styles.weekActivity}>Build complete auth system</span>
              </div>
              <div className={styles.timelineWeek}>
                <span className={styles.weekLabel}>Week 7-8</span>
                <span className={styles.weekActivity}>Polish and testing</span>
              </div>
              <div className={styles.timelineWeek}>
                <span className={styles.weekLabel}>Week 9</span>
                <span className={styles.weekActivity}>Ship and hope it works</span>
              </div>
            </div>
            <div className={styles.approachTotal}>Total: 9 weeks, $40K-$80K</div>
          </div>

          <div className={styles.sprintApproach}>
            <h3>Evidence Sprint approach:</h3>
            <div className={styles.sprintTimeline}>
              <div className={styles.sprintDay}>
                <div className={styles.dayNumber}>Day 1</div>
                <div className={styles.dayContent}>
                  <h4>Co-write AC.md</h4>
                  <div className={styles.acExample}>
                    <pre>{`# AC.md: OTP Signup Evidence Sprint

## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session persists 30 days

## Non-Functional Criteria
- p95 latency: < 300ms (full flow)
- Steps to complete: ≤ 3
- Mobile responsive

## Verification
npm run acceptance:signup`}</pre>
                  </div>
                </div>
              </div>

              <div className={styles.sprintDay}>
                <div className={styles.dayNumber}>Days 2-3</div>
                <div className={styles.dayContent}>
                  <h4>Build minimal proof</h4>
                  <ul>
                    <li>Email OTP delivery (no SMS, no backup codes, no recovery)</li>
                    <li>Simple session management (no OAuth, no SSO)</li>
                    <li>Basic error handling (no edge cases yet)</li>
                  </ul>
                </div>
              </div>

              <div className={styles.sprintDay}>
                <div className={styles.dayNumber}>Day 4</div>
                <div className={styles.dayContent}>
                  <h4>Generate delta</h4>
                  <div className={styles.deltaExample}>
                    <table className={styles.deltaTable}>
                      <thead>
                        <tr>
                          <th>Metric</th>
                          <th>Before</th>
                          <th>After</th>
                          <th>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>p95 latency</td>
                          <td>1200ms</td>
                          <td>280ms</td>
                          <td className={styles.positive}>↓77%</td>
                        </tr>
                        <tr>
                          <td>Steps to complete</td>
                          <td>7</td>
                          <td>3</td>
                          <td className={styles.positive}>↓57%</td>
                        </tr>
                        <tr>
                          <td>Forgot password flow</td>
                          <td>3 steps</td>
                          <td>eliminated</td>
                          <td className={styles.positive}>-</td>
                        </tr>
                        <tr>
                          <td>Mobile conversion</td>
                          <td>42%</td>
                          <td>68%</td>
                          <td className={styles.positive}>↑62%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className={styles.sprintDay}>
                <div className={styles.dayNumber}>Day 5</div>
                <div className={styles.dayContent}>
                  <h4>Ship demo + tag</h4>
                  <div className={styles.shipDetails}>
                    <div className={styles.shipItem}>
                      <span className={styles.shipLabel}>Demo:</span>
                      <code>demo.scopelock.ai/otp-signup</code>
                    </div>
                    <div className={styles.shipItem}>
                      <span className={styles.shipLabel}>Tag:</span>
                      <code>evidence-sprint_otp-signup_2025-11-02</code>
                    </div>
                    <div className={styles.shipItem}>
                      <span className={styles.shipLabel}>Proof:</span>
                      <code>/proof/evidence-sprint_otp-signup_2025-11-02</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.approachTotal}>Total: 5 days, $3K-$6K</div>
          </div>
        </div>
      </section>

      {/* 90-Second Rule */}
      <section className={styles.ruleSection}>
        <h2>The 90-Second Demo Rule</h2>
        <p>Why ≤90 seconds?</p>

        <div className={styles.rulesGrid}>
          <div className={styles.ruleCard}>
            <h3>1. Forces Focus</h3>
            <p>If you can't show value in 90 seconds, you're building too much.</p>
            <div className={styles.demoComparison}>
              <div className={styles.goodDemo}>
                <div className={styles.demoLabel}>✓ Good Evidence Sprint demo:</div>
                <p>Open page → Enter email → Receive OTP → Submit → Authenticated</p>
                <div className={styles.demoMetrics}>
                  <span>Time: 45 seconds</span>
                  <span>Value: Obvious</span>
                </div>
              </div>
              <div className={styles.badDemo}>
                <div className={styles.demoLabel}>✗ Bad Evidence Sprint demo:</div>
                <p>Explain architecture → Show database schema → Walk through 5 features</p>
                <div className={styles.demoMetrics}>
                  <span>Time: 8 minutes</span>
                  <span>Value: Unclear</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ruleCard}>
            <h3>2. Matches Real User Attention</h3>
            <p>Users don't give you 10 minutes to "show potential."</p>
            <p>They give you 30 seconds to prove value or they bounce.</p>
          </div>

          <div className={styles.ruleCard}>
            <h3>3. Enables Decision-Making</h3>
            <p>In 90 seconds, a client can decide:</p>
            <div className={styles.decisions}>
              <div className={styles.decision}>
                <span className={styles.decisionIcon}>✅</span>
                <span>"This is exactly what I need—let's build to AC green"</span>
              </div>
              <div className={styles.decision}>
                <span className={styles.decisionIcon}>↻</span>
                <span>"Close, but change X—let's iterate"</span>
              </div>
              <div className={styles.decision}>
                <span className={styles.decisionIcon}>❌</span>
                <span>"Not what I wanted—let's pivot before investing more"</span>
              </div>
            </div>
            <p className={styles.outcome}>All outcomes are valuable. Finding out in 5 days vs 5 months is the difference.</p>
          </div>
        </div>
      </section>

      {/* Quantified Deltas */}
      <section className={styles.deltaSection}>
        <h2>Quantified Deltas: Not Feelings, Numbers</h2>
        <p>Every DELTA.md must have <strong>measurable before/after</strong>.</p>

        <div className={styles.deltaComparison}>
          <div className={styles.badDelta}>
            <h3>❌ Bad Delta</h3>
            <pre>{`## What Changed
- Made it faster
- Simplified the flow
- Improved UX`}</pre>
            <div className={styles.whyBad}>
              <strong>Why bad?</strong> No numbers. Can't verify. Just claims.
            </div>
          </div>

          <div className={styles.goodDelta}>
            <h3>✅ Good Delta</h3>
            <pre>{`## Performance
- p95 latency: 1200ms → 280ms (↓77%)
- Time to first interaction: 850ms → 190ms (↓78%)

## Usability
- Steps to complete: 7 → 3 (↓57%)
- Form fields: 12 → 2 (↓83%)

## Conversion
- Mobile signup rate: 42% → 68% (↑62%)
- Completion rate: 54% → 81% (↑50%)`}</pre>
            <div className={styles.whyGood}>
              <strong>Why good?</strong> Every claim is a number. Client can verify. Objective proof.
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={styles.comparisonSection}>
        <h2>Evidence Sprint vs Discovery Phase</h2>
        <p>Most agencies sell a "discovery phase" before building. Here's the difference:</p>

        <div className={styles.comparisonTableWrapper}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Discovery Phase</th>
                <th className={styles.highlighted}>Evidence Sprint</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Deliverable</td>
                <td>Document</td>
                <td className={styles.highlighted}>Working demo</td>
              </tr>
              <tr>
                <td>Timeline</td>
                <td>2-4 weeks</td>
                <td className={styles.highlighted}>2-5 days</td>
              </tr>
              <tr>
                <td>Output</td>
                <td>"Here's what we'll build"</td>
                <td className={styles.highlighted}>"Here's what we built"</td>
              </tr>
              <tr>
                <td>Cost</td>
                <td>$5K-$15K</td>
                <td className={styles.highlighted}>$3K-$6K</td>
              </tr>
              <tr>
                <td>Risk</td>
                <td>Still don't know if it works</td>
                <td className={styles.highlighted}>You've seen it working</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.comparisonSummary}>
          <div className={styles.summaryItem}>
            <strong>Discovery Phase:</strong> Pay to talk about building.
          </div>
          <div className={styles.summaryItem}>
            <strong>Evidence Sprint:</strong> Pay to build and prove.
          </div>
        </div>
      </section>

      {/* When to Use */}
      <section className={styles.whenSection}>
        <h2>When to Use Evidence Sprint</h2>

        <div className={styles.whenGrid}>
          <div className={styles.perfectFor}>
            <h3>✅ Perfect For</h3>
            <ul>
              <li><strong>Validating new ideas:</strong> "Will OTP signup work for our users?"</li>
              <li><strong>De-risking big projects:</strong> "Can we hit &lt;300ms p95 before committing?"</li>
              <li><strong>Rapid prototyping:</strong> "We need a working demo for investors by Friday"</li>
              <li><strong>Proof before commitment:</strong> "Show me it works before I approve the full build"</li>
            </ul>
          </div>

          <div className={styles.notIdeal}>
            <h3>❌ Not Ideal For</h3>
            <ul>
              <li><strong>Well-defined features:</strong> If you know exactly what you want and have full specs, go straight to AC green</li>
              <li><strong>Pure research:</strong> If you're exploring problem space without building, use a different approach</li>
              <li><strong>Long-term maintenance:</strong> Evidence Sprints prove value, not operational readiness</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className={styles.applySection}>
        <h2>How to Apply This</h2>

        <div className={styles.applyGrid}>
          <div className={styles.applyCard}>
            <h3>If You're a Founder</h3>
            <p>Before committing to a 3-month build, ask your developer:</p>
            <div className={styles.askBox}>
              "Can we do an Evidence Sprint first?"
            </div>
            <div className={styles.expectBox}>
              <strong>What you should get:</strong>
              <ul>
                <li>Working demo in 2-5 days</li>
                <li>Quantified delta (numbers, not feelings)</li>
                <li>Clear path: iterate, proceed to AC green, or pivot</li>
              </ul>
              <div className={styles.costValue}>
                <div className={styles.costValueItem}>
                  <span className={styles.label}>Cost:</span>
                  <span>$3K-$6K typically (1/10th of full build cost)</span>
                </div>
                <div className={styles.costValueItem}>
                  <span className={styles.label}>Value:</span>
                  <span>Knowing if you're building the right thing before investing $50K+</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.applyCard}>
            <h3>If You're a Developer</h3>
            <p>Instead of quoting 8 weeks for an MVP:</p>
            <div className={styles.askBox}>
              "Let's do a 3-day Evidence Sprint first."
            </div>
            <div className={styles.expectBox}>
              <strong>What you deliver:</strong>
              <ul>
                <li>Minimal proof of concept (working, not polished)</li>
                <li>DELTA.md with real numbers</li>
                <li>Demo link clients can share with stakeholders</li>
              </ul>
              <div className={styles.whyYes}>
                <strong>Why clients say yes:</strong> Low risk, fast feedback, proof before commitment.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2>Three Common Questions</h2>

        <div className={styles.faqItem}>
          <h3>"Isn't this just a prototype?"</h3>
          <p><strong>No.</strong> Prototypes are fake (Figma mockups, clickable demos).</p>
          <p>Evidence Sprints are <strong>working implementations</strong>:</p>
          <ul>
            <li>Real database</li>
            <li>Real auth</li>
            <li>Real performance metrics</li>
            <li>Real code that becomes production</li>
          </ul>
        </div>

        <div className={styles.faqItem}>
          <h3>"What if the Evidence Sprint proves it won't work?"</h3>
          <p className={styles.successAnswer}><strong>That's success.</strong></p>
          <p>You spent 5 days and $3K-$6K to learn this won't work.</p>
          <p><strong>Alternative:</strong> Spend 12 weeks and $80K to learn the same thing.</p>
        </div>

        <div className={styles.faqItem}>
          <h3>"Do you always do Evidence Sprints?"</h3>
          <p><strong>No.</strong> If requirements are crystal clear and risk is low, we skip straight to AC green.</p>
          <p>Evidence Sprints are for <strong>validation and de-risking</strong>, not for every build.</p>
        </div>
      </section>

      {/* The Math */}
      <section className={styles.mathSection}>
        <h2>The Math That Matters</h2>

        <div className={styles.mathGrid}>
          <div className={styles.mathCard}>
            <h3>Traditional MVP</h3>
            <div className={styles.mathMetrics}>
              <div className={styles.mathMetric}>
                <span className={styles.mathLabel}>Time to learn:</span>
                <span className={styles.mathValue}>12 weeks</span>
              </div>
              <div className={styles.mathMetric}>
                <span className={styles.mathLabel}>Cost to learn:</span>
                <span className={styles.mathValue}>$50K-$150K</span>
              </div>
              <div className={styles.mathMetric}>
                <span className={styles.mathLabel}>Pivots:</span>
                <span className={styles.mathValue}>Expensive and slow</span>
              </div>
            </div>
          </div>

          <div className={`${styles.mathCard} ${styles.highlighted}`}>
            <h3>Evidence Sprint</h3>
            <div className={styles.mathMetrics}>
              <div className={styles.mathMetric}>
                <span className={styles.mathLabel}>Time to learn:</span>
                <span className={styles.mathValue}>2-5 days</span>
              </div>
              <div className={styles.mathMetric}>
                <span className={styles.mathLabel}>Cost to learn:</span>
                <span className={styles.mathValue}>$3K-$6K</span>
              </div>
              <div className={styles.mathMetric}>
                <span className={styles.mathLabel}>Pivots:</span>
                <span className={styles.mathValue}>Cheap and fast</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mathDifference}>
          <h3>The difference:</h3>
          <div className={styles.differenceMetrics}>
            <div className={styles.differenceMetric}>
              <span className={styles.multiplier}>24x</span>
              <span className={styles.multiplierLabel}>faster feedback</span>
            </div>
            <div className={styles.differenceMetric}>
              <span className={styles.multiplier}>10x</span>
              <span className={styles.multiplierLabel}>lower cost</span>
            </div>
            <div className={styles.differenceMetric}>
              <span className={styles.multiplier}>∞</span>
              <span className={styles.multiplierLabel}>more pivots possible</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>What's Next?</h2>
        <p>At ScopeLock, we start high-risk projects with Evidence Sprints.</p>

        <div className={styles.workflow}>
          <div className={styles.workflowStep}>
            <span className={styles.stepNum}>1</span>
            <span>Co-write AC.md (30-60 minutes)</span>
          </div>
          <div className={styles.workflowStep}>
            <span className={styles.stepNum}>2</span>
            <span>Build Evidence Sprint (2-5 days)</span>
          </div>
          <div className={styles.workflowStep}>
            <span className={styles.stepNum}>3</span>
            <span>Review delta + demo (30 minutes)</span>
          </div>
          <div className={styles.workflowStep}>
            <span className={styles.stepNum}>4</span>
            <span>Decide: iterate, proceed to AC green, or pivot</span>
          </div>
        </div>

        <div className={styles.ctaButtons}>
          <Link href="/#contact" className={styles.ctaPrimary}>
            Book an Evidence Sprint
          </Link>
          <Link href="/proof" className={styles.ctaSecondary}>
            See real Evidence Sprints
          </Link>
        </div>

        <div className={styles.ctaNote}>
          $3K-$6K, working demo + quantified delta
        </div>
      </section>

      {/* Footer nav */}
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backToIndex}>← Back to Blog</Link>
      </nav>
    </main>
  );
}
