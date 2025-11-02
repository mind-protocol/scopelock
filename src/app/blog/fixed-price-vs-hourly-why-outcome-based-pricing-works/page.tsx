import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';
import { PricingCalculator } from './PricingCalculator';

export const metadata: Metadata = {
  title: 'Fixed-Price vs Hourly: Why Outcome-Based Pricing Works | ScopeLock Blog',
  description: 'Hourly incentivizes slow work. Fixed-bid gets padded heavily. Outcome-based pricing aligns incentives: pay at AC green.',
  keywords: ['pricing', 'fixed-price', 'hourly-billing', 'outcome-based-pricing', 'software-development'],
};

export default function PricingModelsPage() {
  return (
    <main className={styles.pricingMode}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/blog" className={styles.backLink}>← Blog</Link>
        <h1>Fixed-Price vs Hourly: Why Outcome-Based Pricing Works</h1>
        <div className={styles.meta}>
          <time>Nov 2, 2025</time>
          <span>•</span>
          <span>8 min read</span>
          <span>•</span>
          <span>Nicolas Lester Reynolds</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#pricing</span>
          <span className={styles.tag}>#fixed-price</span>
          <span className={styles.tag}>#hourly-billing</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>"How much will this cost?"</p>
        <p className={styles.leadText}>The most important question in software development. And the one with the worst answers.</p>

        <div className={styles.badAnswers}>
          <div className={styles.badAnswer}>
            <strong>Hourly:</strong> "It depends how long it takes" <span className={styles.translation}>(translation: unknown)</span>
          </div>
          <div className={styles.badAnswer}>
            <strong>Fixed-bid:</strong> "$40K for the whole project" <span className={styles.translation}>(translation: padded heavily, or cut corners)</span>
          </div>
        </div>

        <p className={styles.callout}>
          Both pricing models fail because they optimize for the wrong thing. <strong>Outcome-based pricing</strong> fixes this.
        </p>
      </section>

      {/* Three Models Overview */}
      <section className={styles.modelsSection}>
        <h2>The Three Pricing Models</h2>

        <div className={styles.modelsGrid}>
          {/* Hourly */}
          <div className={`${styles.modelCard} ${styles.hourlyCard}`}>
            <div className={styles.modelHeader}>
              <h3>1. Hourly Billing</h3>
              <span className={styles.modelBadge}>❌ Misaligned</span>
            </div>

            <div className={styles.modelHow}>
              <strong>How it works:</strong>
              <ul>
                <li>Developer charges by the hour</li>
                <li>You pay $100-$250/hour</li>
                <li>Final cost = hours worked × rate</li>
              </ul>
            </div>

            <div className={styles.modelPromise}>
              <strong>The promise:</strong> "You only pay for actual work"
            </div>

            <div className={styles.modelReality}>
              <strong>The reality:</strong> Misaligned incentives
            </div>

            <div className={styles.problems}>
              <div className={styles.problem}>
                <h4>Problem 1: Slower Work = More Money</h4>
                <div className={styles.problemExample}>
                  <div>Developer A: Solves problem in 8 hours</div>
                  <div>Developer B: Solves same problem in 40 hours</div>
                  <div className={styles.problemResult}>
                    Hourly billing rewards Developer B (5× more revenue).
                  </div>
                </div>
                <div className={styles.yourQuestion}>
                  <strong>Your question:</strong> "How do I know if 40 hours was necessary?"<br/>
                  <strong>Answer:</strong> You don't.
                </div>
              </div>

              <div className={styles.problem}>
                <h4>Problem 2: Unpredictable Total Cost</h4>
                <div className={styles.escalation}>
                  <div className={styles.escalationStep}>
                    <span className={styles.estimate}>Initial estimate:</span> "Probably 40-60 hours"
                  </div>
                  <div className={styles.escalationStep}>
                    <span className={styles.estimate}>After 60 hours:</span> "We need another 30 hours for edge cases"
                  </div>
                  <div className={styles.escalationStep}>
                    <span className={styles.estimate}>After 90 hours:</span> "Just 20 more hours for polish"
                  </div>
                  <div className={styles.escalationResult}>
                    <strong>Final cost:</strong> 110 hours × $150 = <span className={styles.surprise}>$16,500</span><br/>
                    <strong>Your budget:</strong> $9,000<br/>
                    <strong>Your trust:</strong> <span className={styles.destroyed}>Destroyed</span>
                  </div>
                </div>
              </div>

              <div className={styles.problem}>
                <h4>Problem 3: No Incentive to Ship Fast</h4>
                <p>Hourly billing rewards time spent, not results delivered.</p>
                <div className={styles.billableList}>
                  <div>Meetings? <span>Billable.</span></div>
                  <div>Debugging their own mistakes? <span>Billable.</span></div>
                  <div>Learning a technology they claimed to know? <span>Billable.</span></div>
                  <div>Refactoring code they just wrote? <span>Billable.</span></div>
                </div>
                <div className={styles.wantedGot}>
                  <div><strong>You wanted:</strong> Fast results.</div>
                  <div><strong>You got:</strong> Billable hours.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed-Bid */}
          <div className={`${styles.modelCard} ${styles.fixedCard}`}>
            <div className={styles.modelHeader}>
              <h3>2. Fixed-Bid Pricing</h3>
              <span className={styles.modelBadge}>⚠️ Padded</span>
            </div>

            <div className={styles.modelHow}>
              <strong>How it works:</strong>
              <ul>
                <li>Developer quotes a total price upfront</li>
                <li>You pay the full amount (often split into milestones)</li>
                <li>Developer assumes all risk</li>
              </ul>
            </div>

            <div className={styles.modelPromise}>
              <strong>The promise:</strong> "You know the cost upfront"
            </div>

            <div className={styles.modelReality}>
              <strong>The reality:</strong> Padding, corners, or disputes
            </div>

            <div className={styles.problems}>
              <div className={styles.problem}>
                <h4>Problem 1: Heavy Padding</h4>
                <div className={styles.paddingMath}>
                  <div className={styles.paddingRow}>
                    <span>Developer thinks:</span>
                    <span>"This could take 40 hours, but what if it's 80? Better quote for 100 to be safe."</span>
                  </div>
                  <div className={styles.paddingBreakdown}>
                    <div><strong>Your quote:</strong> $25K</div>
                    <div><strong>Actual work:</strong> $12K worth</div>
                    <div><strong>Padding:</strong> <span className={styles.waste}>$13K</span> "just in case"</div>
                  </div>
                  <div className={styles.paddingResult}>
                    You pay for hypothetical problems that never happened.
                  </div>
                </div>
              </div>

              <div className={styles.problem}>
                <h4>Problem 2: Corners Get Cut</h4>
                <p>Developer underestimates. Realizes mid-project they'll lose money.</p>
                <div className={styles.cornerOptions}>
                  <div className={styles.option}>
                    <strong>Option A:</strong> Take the loss <span className={styles.unlikely}>(unlikely)</span>
                  </div>
                  <div className={styles.option}>
                    <strong>Option B:</strong> Cut corners <span>(tests skipped, quality sacrificed, "good enough" code)</span>
                  </div>
                  <div className={styles.option}>
                    <strong>Option C:</strong> Renegotiate mid-project <span>(trust damaged)</span>
                  </div>
                </div>
                <div className={styles.optionsResult}>
                  All three outcomes hurt you.
                </div>
              </div>

              <div className={styles.problem}>
                <h4>Problem 3: Scope Disputes</h4>
                <div className={styles.disputeDialogue}>
                  <div className={styles.dialogueLine}>
                    <strong>Your perspective:</strong> "This is obviously part of the project"
                  </div>
                  <div className={styles.dialogueLine}>
                    <strong>Developer:</strong> "That's out of scope, extra cost"
                  </div>
                </div>
                <div className={styles.disputeResult}>
                  <strong>Every. Single. Feature.</strong>
                </div>
                <p>Without clear acceptance criteria, every request becomes a negotiation.</p>
              </div>
            </div>
          </div>

          {/* Outcome-Based */}
          <div className={`${styles.modelCard} ${styles.outcomeCard}`}>
            <div className={styles.modelHeader}>
              <h3>3. Outcome-Based Pricing</h3>
              <span className={styles.modelBadge}>✅ Aligned</span>
            </div>

            <div className={styles.modelSubtitle}>ScopeLock Model</div>

            <div className={styles.modelHow}>
              <strong>How it works:</strong>
              <ul>
                <li>We co-write AC.md (acceptance criteria) before starting</li>
                <li>We agree on a fixed price</li>
                <li>You pay when tests pass (AC green)</li>
              </ul>
            </div>

            <div className={styles.modelPromise}>
              <strong>The promise:</strong> "Fixed price + pay when delivered"
            </div>

            <div className={styles.modelReality}>
              <strong>The reality:</strong> Aligned incentives
            </div>

            <div className={styles.advantages}>
              <div className={styles.advantage}>
                <h4>1. We Define "Done" Before Pricing</h4>
                <p>Before quoting a price, we write AC.md together:</p>
                <pre className={styles.acExample}>{`# AC.md: OTP Signup

## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session persists 30 days

## Non-Functional Criteria
- p95 latency: < 300ms
- Error rate: < 0.1%
- Mobile responsive

## Verification
npm run acceptance:signup`}</pre>
                <div className={styles.nowBothKnow}>
                  <strong>Now both parties know:</strong>
                  <ul>
                    <li>Exactly what will be built</li>
                    <li>How it will be tested</li>
                    <li>What "done" looks like</li>
                  </ul>
                </div>
                <div className={styles.priceQuote}>
                  <strong>Price quote:</strong> $8K to AC green.
                </div>
                <p>No ambiguity. No scope disputes. Just clear criteria and a fixed price.</p>
              </div>

              <div className={styles.advantage}>
                <h4>2. Payment at AC Green (Tests Passing)</h4>
                <p>We don't get paid for "almost done" or "90% complete."</p>
                <div className={styles.paidWhen}>
                  <strong>We get paid when:</strong>
                  <pre className={styles.testOutput}>{`npm run acceptance
# All tests: ✅ PASS`}</pre>
                </div>
                <div className={styles.meansLists}>
                  <div className={styles.meansList}>
                    <strong>What this means:</strong>
                    <ul>
                      <li>All functional criteria satisfied</li>
                      <li>All performance thresholds met</li>
                      <li>All tests green</li>
                    </ul>
                  </div>
                  <div className={styles.meansList}>
                    <strong>You don't pay for:</strong>
                    <ul>
                      <li>Time spent debugging</li>
                      <li>Code that doesn't work</li>
                      <li>"In progress" work</li>
                      <li>Meetings or coordination</li>
                    </ul>
                  </div>
                </div>
                <div className={styles.payFor}>
                  <strong>You pay for:</strong> Working code that passes your tests.
                </div>
              </div>

              <div className={styles.advantage}>
                <h4>3. We Assume the Risk</h4>
                <div className={styles.riskComparison}>
                  <div className={styles.riskRow}>
                    <strong>Hourly model:</strong> <span>You assume risk (unknown total cost)</span>
                  </div>
                  <div className={styles.riskRow}>
                    <strong>Fixed-bid model:</strong> <span>Developer assumes risk (cuts corners or padding)</span>
                  </div>
                  <div className={styles.riskRow}>
                    <strong>Outcome-based model:</strong> <span>We assume risk (but we control it)</span>
                  </div>
                </div>
                <div className={styles.riskControl}>
                  <strong>How we control risk:</strong>
                  <ul>
                    <li>We write detailed AC.md (no ambiguity)</li>
                    <li>We baseline the scope (no scope creep)</li>
                    <li>We track changes via CHG-130 (Swap or Add)</li>
                    <li>We ship Evidence Sprints first (validate early)</li>
                  </ul>
                </div>
                <div className={styles.riskResult}>
                  <strong>Result:</strong> Risk is minimized through process, not padding or corner-cutting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Example */}
      <section className={styles.exampleSection}>
        <h2>Real Example: OTP Signup Project</h2>
        <p className={styles.exampleIntro}>Let's price the same feature three ways.</p>

        <div className={styles.exampleGrid}>
          <div className={styles.exampleCard}>
            <h3>Hourly Approach</h3>
            <div className={styles.exampleQuote}>
              <strong>Developer quote:</strong> "$150/hour, estimate 40-80 hours"
            </div>
            <div className={styles.exampleQuestions}>
              <strong>Questions you can't answer:</strong>
              <ul>
                <li>Will it be 40 or 80 hours?</li>
                <li>How do I know if 80 hours was necessary?</li>
                <li>What if it takes 120 hours?</li>
              </ul>
            </div>
            <div className={styles.exampleResult}>
              <div><strong>Likely range:</strong> <span className={styles.range}>$6,000 - $18,000</span></div>
              <div><strong>Predictability:</strong> <span className={styles.none}>None</span></div>
            </div>
          </div>

          <div className={styles.exampleCard}>
            <h3>Fixed-Bid Approach</h3>
            <div className={styles.exampleQuote}>
              <strong>Developer quote:</strong> "$15,000 for passwordless auth"
            </div>
            <div className={styles.exampleBreakdown}>
              <strong>Why $15K?</strong>
              <ul>
                <li>Developer estimates 60 hours</li>
                <li>Pads 40% for risk = 84 hours</li>
                <li>84 hours × $150 = $12,600</li>
                <li>Rounds to $15,000</li>
              </ul>
            </div>
            <div className={styles.exampleResult}>
              <div><strong>Actual work:</strong> Probably 50 hours ($7,500 worth)</div>
              <div><strong>Padding:</strong> <span className={styles.waste}>$7,500</span></div>
              <div><strong>Your question:</strong> "How do I know this is fair?"</div>
              <div><strong>Answer:</strong> You don't.</div>
            </div>
          </div>

          <div className={`${styles.exampleCard} ${styles.outcomeExample}`}>
            <h3>Outcome-Based Approach (ScopeLock)</h3>
            <div className={styles.exampleProcess}>
              <div className={styles.processStep}>
                <strong>1. Co-write AC.md</strong> (30 minutes)
                <pre className={styles.miniCode}>{`## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session persists 30 days`}</pre>
              </div>
              <div className={styles.processStep}>
                <strong>2. Price the outcome</strong> (5 minutes)
                <ul>
                  <li>We estimate: 40 hours to AC green</li>
                  <li>Our rate: $175/hour effective</li>
                  <li>Quote: $8,000 flat</li>
                </ul>
              </div>
              <div className={styles.processStep}>
                <strong>3. Lock the scope</strong>
                <pre className={styles.miniCode}>git tag ac-baseline_otp-signup_2025-11-02</pre>
              </div>
              <div className={styles.processStep}>
                <strong>4. Deliver when tests pass</strong>
                <ul>
                  <li>Build to AC green</li>
                  <li>All tests passing</li>
                  <li>Invoice issued: $8,000 (exactly)</li>
                </ul>
              </div>
            </div>
            <div className={styles.exampleResult}>
              <strong>Your questions answered:</strong>
              <ul>
                <li><strong>Total cost:</strong> $8,000 (known upfront)</li>
                <li><strong>When you pay:</strong> When tests pass</li>
                <li><strong>What you get:</strong> Working code, verified by tests</li>
                <li><strong>Risk:</strong> Ours (if tests fail, we keep working until they pass)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Calculator */}
      <PricingCalculator />

      {/* Three-Question Test */}
      <section className={styles.testSection}>
        <h2>The Three-Question Test</h2>
        <p>When evaluating pricing models, ask:</p>

        <div className={styles.questionGrid}>
          <div className={styles.questionCard}>
            <h3>Question 1: "How much will this cost?"</h3>
            <div className={styles.answers}>
              <div className={styles.answer}><strong>Hourly:</strong> "Depends on hours" <span className={styles.bad}>❌</span></div>
              <div className={styles.answer}><strong>Fixed-bid:</strong> "$25K" (but padded) <span className={styles.warning}>⚠️</span></div>
              <div className={styles.answer}><strong>Outcome-based:</strong> "$8K to AC green" <span className={styles.good}>✅</span></div>
            </div>
          </div>

          <div className={styles.questionCard}>
            <h3>Question 2: "When do I pay?"</h3>
            <div className={styles.answers}>
              <div className={styles.answer}><strong>Hourly:</strong> "Every 2 weeks" (ongoing) <span className={styles.bad}>❌</span></div>
              <div className={styles.answer}><strong>Fixed-bid:</strong> "50% upfront, 50% at delivery" <span className={styles.warning}>⚠️</span></div>
              <div className={styles.answer}><strong>Outcome-based:</strong> "When tests pass" <span className={styles.good}>✅</span></div>
            </div>
          </div>

          <div className={styles.questionCard}>
            <h3>Question 3: "How do I know it's done?"</h3>
            <div className={styles.answers}>
              <div className={styles.answer}><strong>Hourly:</strong> "Developer says so" <span className={styles.bad}>❌</span></div>
              <div className={styles.answer}><strong>Fixed-bid:</strong> "Developer says so" <span className={styles.bad}>❌</span></div>
              <div className={styles.answer}><strong>Outcome-based:</strong> "Run tests, check results" <span className={styles.good}>✅</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* The Math */}
      <section className={styles.mathSection}>
        <h2>The Math That Matters</h2>

        <div className={styles.mathGrid}>
          <div className={styles.mathCard}>
            <h3>Hourly project</h3>
            <div className={styles.mathRows}>
              <div>Estimate: 60 hours</div>
              <div>Actual: 95 hours <span className={styles.reason}>(scope creep, debugging, rework)</span></div>
              <div><strong>Cost:</strong> 95 × $150 = <span className={styles.surprise}>$14,250</span></div>
              <div><strong>Trust:</strong> <span className={styles.destroyed}>Damaged</span> ("Why did it take 95 hours?")</div>
            </div>
          </div>

          <div className={styles.mathCard}>
            <h3>Fixed-bid project</h3>
            <div className={styles.mathRows}>
              <div>Quote: $18,000 <span className={styles.reason}>(heavily padded)</span></div>
              <div>Actual work: 55 hours ($8,250 worth)</div>
              <div><strong>Padding:</strong> <span className={styles.waste}>$9,750</span></div>
              <div><strong>Value:</strong> Poor (you paid for insurance, not work)</div>
            </div>
          </div>

          <div className={`${styles.mathCard} ${styles.outcomeMath}`}>
            <h3>Outcome-based project</h3>
            <div className={styles.mathRows}>
              <div>AC.md: Co-written, clear criteria</div>
              <div>Quote: $9,500 to AC green</div>
              <div>Delivered: When tests pass</div>
              <div><strong>Total:</strong> <span className={styles.exact}>$9,500 (exactly)</span></div>
              <div><strong>Trust:</strong> <span className={styles.built}>Built</span> (you got exactly what was promised)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>What's Next?</h2>
        <p>At ScopeLock, we only do outcome-based pricing.</p>

        <div className={styles.whyBox}>
          <strong>Why?</strong>
          <ul>
            <li>Aligns incentives (we ship faster when we control the timeline)</li>
            <li>Builds trust (you pay for results, not time)</li>
            <li>Eliminates disputes (tests define "done," not opinions)</li>
          </ul>
        </div>

        <div className={styles.ctaButtons}>
          <Link href="/" className={styles.ctaPrimary}>
            See our process
          </Link>
          <Link href="/#contact" className={styles.ctaSecondary}>
            Schedule a call
          </Link>
        </div>

        <div className={styles.ctaNote}>
          Co-write AC.md, lock scope, pay at AC green
        </div>
      </section>

      {/* Footer nav */}
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backToIndex}>← Back to Blog</Link>
      </nav>
    </main>
  );
}
