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
            Earn like a Developer<br />Without Needing to Know How to Code
          </h1>

          <p className={styles.heroSubtitle}>
            Our AI partners do 95% of the work, and 100% of the coding and writing. You just supervise.
            Earn commission on every mission clients accept.
          </p>
        </div>
      </section>

      {/* How It Works - With Central Line and Avatars */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            AI does 95% of the work. You supervise, deploy, and get paid.
          </p>

          <div className={styles.processFlow}>
            {/* Central horizontal line (fil rouge) */}
            <div className={styles.filRouge}></div>

            {/* Process steps */}
            <div className={styles.processSteps}>
              {/* Step 1: You - Find job */}
              <div className={styles.processStep}>
                <div className={styles.stepTop} title="Search Upwork for jobs matching our criteria">
                  <div className={styles.stepAvatar} style={{ borderColor: '#64A8FF' }}>
                    <div className={styles.humanIcon}>👤</div>
                  </div>
                  <div className={styles.stepLabel}>You</div>
                  <div className={styles.stepAction}>Find job</div>
                </div>
                <div className={styles.stepDot}></div>
              </div>

              {/* Step 2: Emma - Analyze */}
              <div className={styles.processStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBottom} title="Emma analyzes job posts and writes complete proposal with budget and timeline">
                  <div className={styles.stepAvatar} style={{ borderColor: '#1EE5B8' }}>
                    <img src="/citizens/emma/avatar.png" alt="Emma" />
                  </div>
                  <div className={styles.stepLabel}>Emma</div>
                  <div className={styles.stepAction}>Write proposal</div>
                </div>
              </div>

              {/* Step 3: You - Submit */}
              <div className={styles.processStep}>
                <div className={styles.stepTop} title="Review Emma's proposal and submit to client on Upwork">
                  <div className={styles.stepAvatar} style={{ borderColor: '#64A8FF' }}>
                    <div className={styles.humanIcon}>👤</div>
                  </div>
                  <div className={styles.stepLabel}>You</div>
                  <div className={styles.stepAction}>Submit</div>
                </div>
                <div className={styles.stepDot}></div>
              </div>

              {/* Step 4: Inna - Specs */}
              <div className={styles.processStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBottom} title="Inna writes complete technical specifications with acceptance criteria">
                  <div className={styles.stepAvatar} style={{ borderColor: '#1EE5B8' }}>
                    <img src="/citizens/inna/avatar.png" alt="Inna" />
                  </div>
                  <div className={styles.stepLabel}>Inna</div>
                  <div className={styles.stepAction}>Write specs</div>
                </div>
              </div>

              {/* Step 5: You - Lock scope */}
              <div className={styles.processStep}>
                <div className={styles.stepTop} title="Review and approve the scope with client">
                  <div className={styles.stepAvatar} style={{ borderColor: '#64A8FF' }}>
                    <div className={styles.humanIcon}>👤</div>
                  </div>
                  <div className={styles.stepLabel}>You</div>
                  <div className={styles.stepAction}>Lock scope</div>
                </div>
                <div className={styles.stepDot}></div>
              </div>

              {/* Step 6: Rafael - Code */}
              <div className={styles.processStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBottom} title="Rafael generates 100% of the code based on Inna's specifications">
                  <div className={styles.stepAvatar} style={{ borderColor: '#1EE5B8' }}>
                    <img src="/citizens/rafael/avatar.png" alt="Rafael" />
                  </div>
                  <div className={styles.stepLabel}>Rafael</div>
                  <div className={styles.stepAction}>Generate code</div>
                </div>
              </div>

              {/* Step 7: You - Deploy */}
              <div className={styles.processStep}>
                <div className={styles.stepTop} title="Review Rafael's code and deploy to production">
                  <div className={styles.stepAvatar} style={{ borderColor: '#64A8FF' }}>
                    <div className={styles.humanIcon}>👤</div>
                  </div>
                  <div className={styles.stepLabel}>You</div>
                  <div className={styles.stepAction}>Deploy</div>
                </div>
                <div className={styles.stepDot}></div>
              </div>

              {/* Step 8: Sofia - QA */}
              <div className={styles.processStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBottom} title="Sofia generates complete QA checklist with test cases">
                  <div className={styles.stepAvatar} style={{ borderColor: '#1EE5B8' }}>
                    <img src="/citizens/sofia/avatar.png" alt="Sofia" />
                  </div>
                  <div className={styles.stepLabel}>Sofia</div>
                  <div className={styles.stepAction}>QA checklist</div>
                </div>
              </div>

              {/* Step 9: You - Test */}
              <div className={styles.processStep}>
                <div className={styles.stepTop} title="Run through Sofia's QA checklist and test everything">
                  <div className={styles.stepAvatar} style={{ borderColor: '#64A8FF' }}>
                    <div className={styles.humanIcon}>👤</div>
                  </div>
                  <div className={styles.stepLabel}>You</div>
                  <div className={styles.stepAction}>Test</div>
                </div>
                <div className={styles.stepDot}></div>
              </div>

              {/* Step 10: Maya - Demo */}
              <div className={styles.processStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepBottom} title="Maya creates demo script showing what to present to client">
                  <div className={styles.stepAvatar} style={{ borderColor: '#1EE5B8' }}>
                    <img src="/citizens/maya/avatar.png" alt="Maya" />
                  </div>
                  <div className={styles.stepLabel}>Maya</div>
                  <div className={styles.stepAction}>Demo script</div>
                </div>
              </div>

              {/* Step 11: You - Present */}
              <div className={styles.processStep}>
                <div className={styles.stepTop} title="Present completed work to client following Maya's script">
                  <div className={styles.stepAvatar} style={{ borderColor: '#64A8FF' }}>
                    <div className={styles.humanIcon}>👤</div>
                  </div>
                  <div className={styles.stepLabel}>You</div>
                  <div className={styles.stepAction}>Present</div>
                </div>
                <div className={styles.stepDot}></div>
              </div>

              {/* Result */}
              <div className={styles.processStep}>
                <div className={styles.stepDot}></div>
                <div className={styles.stepResult}>
                  <div className={styles.resultIcon}>✅</div>
                  <div className={styles.resultText}>Client accepts</div>
                  <div className={styles.resultPay}>You get paid</div>
                </div>
              </div>
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
        </div>
      </section>

      {/* Payment */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.4)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get Paid Automatically</h2>
          <p className={styles.sectionSubtitle}>
            You get paid as soon as the client pays.
          </p>

          <div className={styles.paymentTimelineHorizontal}>
            <div className={styles.timelineStepHorizontal}>
              <div className={styles.timelineDay}>Day 0</div>
              <div className={styles.timelineAction}>Mission starts</div>
            </div>
            <div className={styles.timelineArrowHorizontal}>→</div>
            <div className={styles.timelineStepHorizontal}>
              <div className={styles.timelineDay}>Day 7</div>
              <div className={styles.timelineAction}>Delivered to client</div>
            </div>
            <div className={styles.timelineArrowHorizontal}>→</div>
            <div className={styles.timelineStepHorizontal}>
              <div className={styles.timelineDay}>Day 21</div>
              <div className={styles.timelineAction}>Upwork releases <span className={styles.dollarAmount}>$</span></div>
            </div>
            <div className={styles.timelineArrowHorizontal}>→</div>
            <div className={styles.timelineStepHorizontal} style={{ borderColor: '#1EE5B8', background: 'rgba(30, 229, 184, 0.1)' }}>
              <div className={styles.timelineDay}>Day 21</div>
              <div className={styles.timelineAction}><strong>You get <span className={styles.solAmount}>$SOL</span> (4 hours)</strong></div>
            </div>
          </div>

          <div className={styles.paymentMethod}>
            <h3>Payment in Solana</h3>
            <p>We explain everything and make the process super simple. No crypto experience needed.</p>
          </div>
        </div>
      </section>

      {/* Your First Week */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Your First Week</h2>

          <div className={styles.firstWeekHorizontal}>
            <div className={styles.weekStage} style={{ background: 'linear-gradient(135deg, rgba(100, 168, 255, 0.1) 0%, rgba(100, 168, 255, 0.05) 100%)' }}>
              <div className={styles.weekDay} style={{ color: '#64A8FF' }}>Day 1</div>
              <div className={styles.weekWhat}>We onboard you</div>
              <div className={styles.weekGet}>Set up wallet, access Mission Deck</div>
            </div>

            <div className={styles.weekArrow}>→</div>

            <div className={styles.weekStage} style={{ background: 'linear-gradient(135deg, rgba(30, 229, 184, 0.15) 0%, rgba(30, 229, 184, 0.08) 100%)' }}>
              <div className={styles.weekDay} style={{ color: '#1EE5B8' }}>Day 2-7</div>
              <div className={styles.weekWhat}>First real mission</div>
              <div className={styles.weekGet}>AI does the work, you supervise</div>
            </div>

            <div className={styles.weekArrow}>→</div>

            <div className={styles.weekStage} style={{ background: 'linear-gradient(135deg, rgba(30, 229, 184, 0.25) 0%, rgba(30, 229, 184, 0.15) 100%)', transform: 'scale(1.05)' }}>
              <div className={styles.weekDay} style={{ color: '#1EE5B8', fontSize: '1.25rem' }}>Week 2+</div>
              <div className={styles.weekWhat} style={{ fontSize: '1.125rem' }}>Regular missions</div>
              <div className={styles.weekGet}>Steady income, every 21 days</div>
              <div className={styles.weekEarnings}>$450-900/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} style={{ background: 'rgba(21, 26, 33, 0.4)' }}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Common Questions</h2>

          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>What if I mess up?</div>
              <div className={styles.faqAnswer}>The AI guides you and the human team helps each other. You're never alone—if you get stuck, ask in the team chat and someone will help.</div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>How is this different from just using ChatGPT?</div>
              <div className={styles.faqAnswer}>Our AI partners do 95% of the work, and 100% of the coding and writing. You just supervise. ChatGPT gives you code. We give you: proposal writing, client management, QA testing, deployment guides, and 5 specialized AI citizens who know the ScopeLock workflow.</div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>Do I need to know how to code?</div>
              <div className={styles.faqAnswer}>No. Rafael writes 100% of the code. You copy-paste, deploy, and test. If something breaks, Rafael fixes it.</div>
            </div>

            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>What if the client doesn't pay?</div>
              <div className={styles.faqAnswer}>Upwork escrow protects you. Client must fund before work starts. You only get paid when client pays, but clients can't run off without paying through Upwork.</div>
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
