'use client';

import Link from 'next/link';
import styles from './styles.module.css';

export default function JoinPage() {
  return (
    <main className={styles.main}>
      {/* Hero - What YOU Get */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Earn like a Developer
          </h1>

          <p className={styles.heroSubtitle}>
            Let AI do everything for you with ScopeLock. You guide the process, AI writes the code.
            Earn commission on every mission clients accept.
          </p>
        </div>
      </section>

      {/* How It Works - Horizontal Process with Mirroring */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Simple workflow. AI does the heavy lifting. You supervise and deploy.
          </p>

          <div className={styles.processHorizontal}>
            {/* Step 1 - You (top) */}
            <div className={styles.processStepTop}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepActor} style={{ borderColor: '#64A8FF' }}>
                <div className={styles.stepIcon}>👤</div>
                <div className={styles.stepName}>You</div>
              </div>
              <div className={styles.stepAction}>Find job on Upwork</div>
              <div className={styles.stepTime}>5 min</div>
            </div>

            <div className={styles.processConnector}>→</div>

            {/* Step 2 - AI (bottom) */}
            <div className={styles.processStepBottom}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepActor} style={{ borderColor: '#1EE5B8' }}>
                <div className={styles.stepIcon}>🤖</div>
                <div className={styles.stepName}>Emma AI</div>
              </div>
              <div className={styles.stepAction}>Write complete proposal</div>
              <div className={styles.stepTime}>2 min</div>
            </div>

            <div className={styles.processConnector}>→</div>

            {/* Step 3 - AI (top) */}
            <div className={styles.processStepTop}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepActor} style={{ borderColor: '#1EE5B8' }}>
                <div className={styles.stepIcon}>🤖</div>
                <div className={styles.stepName}>Rafael AI</div>
              </div>
              <div className={styles.stepAction}>Generate all code</div>
              <div className={styles.stepTime}>2 min</div>
            </div>

            <div className={styles.processConnector}>→</div>

            {/* Step 4 - You (bottom) */}
            <div className={styles.processStepBottom}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepActor} style={{ borderColor: '#64A8FF' }}>
                <div className={styles.stepIcon}>👤</div>
                <div className={styles.stepName}>You</div>
              </div>
              <div className={styles.stepAction}>Deploy & test</div>
              <div className={styles.stepTime}>2 hours</div>
            </div>

            <div className={styles.processConnector}>→</div>

            {/* Result */}
            <div className={styles.processResult}>
              <div className={styles.resultIcon}>✅</div>
              <div className={styles.resultText}>Client accepts</div>
              <div className={styles.resultPay}>You get paid</div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.4)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Requirements</h2>

          <div className={styles.requirements}>
            <div className={styles.requirement}>
              <div className={styles.requirementIcon}>✓</div>
              <div className={styles.requirementText}>
                <strong>Understand English</strong> — Read documentation, write clear messages to clients
              </div>
            </div>
            <div className={styles.requirement}>
              <div className={styles.requirementIcon}>✓</div>
              <div className={styles.requirementText}>
                <strong>Follow step-by-step project guides</strong> — Deployment guides, testing checklists
              </div>
            </div>
            <div className={styles.requirement}>
              <div className={styles.requirementIcon}>✓</div>
              <div className={styles.requirementText}>
                <strong>5-30 hours per week</strong> — Flexible schedule, work when you want
              </div>
            </div>
            <div className={styles.requirement}>
              <div className={styles.requirementIcon}>✓</div>
              <div className={styles.requirementText}>
                <strong>Willingness to learn</strong> — AI teaches you by showing you working code
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Expect */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What You Can Expect</h2>
          <p className={styles.sectionSubtitle}>
            You earn commission on every mission. Here's what that looks like at different volumes.
          </p>

          <div className={styles.scenarios}>
            {/* Scenario 1 */}
            <div className={styles.scenario}>
              <div className={styles.scenarioHeader}>
                <div className={styles.scenarioTitle}>10 missions/month</div>
                <div className={styles.scenarioRevenue}>$6,000 total revenue</div>
              </div>
              <div className={styles.scenarioEarnings}>
                <div className={styles.earningRow}>
                  <span className={styles.earningRole}>Developer (15%)</span>
                  <span className={styles.earningAmount}>$900/month</span>
                </div>
                <div className={styles.earningRow}>
                  <span className={styles.earningRole}>Specifier (9%)</span>
                  <span className={styles.earningAmount}>$540/month</span>
                </div>
                <div className={styles.earningRow}>
                  <span className={styles.earningRole}>QA Tester (6%)</span>
                  <span className={styles.earningAmount}>$360/month</span>
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className={styles.scenario}>
              <div className={styles.scenarioHeader}>
                <div className={styles.scenarioTitle}>20 missions/month</div>
                <div className={styles.scenarioRevenue}>$12,000 total revenue</div>
              </div>
              <div className={styles.scenarioEarnings}>
                <div className={styles.earningRow}>
                  <span className={styles.earningRole}>Developer (15%)</span>
                  <span className={styles.earningAmount}>$1,800/month</span>
                </div>
                <div className={styles.earningRow}>
                  <span className={styles.earningRole}>Specifier (9%)</span>
                  <span className={styles.earningAmount}>$1,080/month</span>
                </div>
                <div className={styles.earningRow}>
                  <span className={styles.earningRole}>QA Tester (6%)</span>
                  <span className={styles.earningAmount}>$720/month</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.commissionsNote}>
            <strong>Commission structure:</strong> Team 30%, Upwork 10%, Organization 21%, NLR 39%
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.4)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>When Do You Get Paid?</h2>
          <p className={styles.sectionSubtitle}>
            You get paid as soon as the client pays.
          </p>

          <div className={styles.paymentTimeline}>
            <div className={styles.timelineStep}>
              <div className={styles.timelineDay}>Day 0</div>
              <div className={styles.timelineAction}>Mission starts</div>
            </div>
            <div className={styles.timelineArrow}>↓</div>
            <div className={styles.timelineStep}>
              <div className={styles.timelineDay}>Day 7</div>
              <div className={styles.timelineAction}>AC Green delivered to client</div>
            </div>
            <div className={styles.timelineArrow}>↓</div>
            <div className={styles.timelineStep}>
              <div className={styles.timelineDay}>Day 21</div>
              <div className={styles.timelineAction}>Upwork releases funds to team</div>
            </div>
            <div className={styles.timelineArrow}>↓</div>
            <div className={styles.timelineStep} style={{ borderColor: '#1EE5B8' }}>
              <div className={styles.timelineDay}>Day 21</div>
              <div className={styles.timelineAction}><strong>You get paid (SOL) — within 4 hours</strong></div>
            </div>
          </div>

          <div className={styles.paymentMethod}>
            <h3>Payment Method: Solana (SOL)</h3>
            <ul>
              <li>✅ Instant transfers</li>
              <li>✅ Near-zero fees (~$0.01)</li>
              <li>✅ Fully transparent on blockchain</li>
              <li>✅ Convert to USDC or cash out to local currency via Binance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Your First Week */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Your First Week</h2>

          <div className={styles.firstWeek}>
            <div className={styles.weekItem}>
              <div className={styles.weekDay}>Day 1</div>
              <div className={styles.weekContent}>
                <div className={styles.weekWhat}>We onboard you</div>
                <div className={styles.weekGet}>→ Read docs, set up wallet, get Mission Deck access</div>
              </div>
            </div>

            <div className={styles.weekItem}>
              <div className={styles.weekDay}>Day 2-7</div>
              <div className={styles.weekContent}>
                <div className={styles.weekWhat}>Complete real mission (AI-supervised)</div>
                <div className={styles.weekGet}>→ Emma writes proposal, Rafael codes, you deploy, client accepts</div>
              </div>
            </div>

            <div className={styles.weekItem}>
              <div className={styles.weekDay}>Week 2+</div>
              <div className={styles.weekContent}>
                <div className={styles.weekWhat}>Regular missions</div>
                <div className={styles.weekGet}>→ Steady income, payments every 21 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready to Start?</h2>
          <p className={styles.ctaSubtitle}>
            Message Nicolas on Telegram. Include your country and hours/week you can work.
          </p>

          <a
            href="https://t.me/nlr_ai"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            Apply via Telegram →
          </a>

          <div className={styles.ctaTemplate}>
            <div className={styles.templateTitle}>Message template:</div>
            <div className={styles.templateBox}>
              Hi Nicolas, I want to join ScopeLock.
              <br />
              <br />
              Country: [Your country]
              <br />
              Hours/week: [5-30]
              <br />
              <br />
              I understand AI does the coding, I supervise and deploy.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
