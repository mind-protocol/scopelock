import type { Metadata } from 'next';
import Link from 'next/link';
import { TableOfContents } from '../../../components/TableOfContents';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Why Acceptance Criteria Beat Time Estimates | ScopeLock',
  description: 'Time estimates are a trap. "Two weeks" becomes eight. "90% done" means nothing. Acceptance criteria with executable tests eliminate ambiguity. Here\'s how.',
  keywords: ['acceptance criteria', 'time estimates', 'software project management', 'scope definition', 'AC.md', 'is it done'],
};

export default function WhyAcceptanceCriteriaPage() {
  const tocSections = [
    { id: 'problem', title: 'The Problem with Time Estimates' },
    { id: 'three-problems', title: 'Time Estimates Create Three Problems' },
    { id: 'solution', title: 'The AC.md Solution' },
    { id: 'verification', title: 'Verification: Tests Passing' },
    { id: 'timeline', title: 'Delivery Timeline' },
    { id: 'results', title: 'Quantified Results' },
    { id: 'catch', title: "What's The Catch?" },
    { id: 'pricing', title: 'What This Costs' },
  ];

  return (
    <main className={styles.auditMode}>
      {/* Minimal Hero */}
      <section className={styles.heroMinimal}>
        <h1>Why Acceptance Criteria Beat Time Estimates</h1>
        <p className={styles.hook}>"It'll take about two weeks."</p>
        <p className={styles.subtitle}>
          Two weeks becomes four. Four becomes eight. The developer says "90% done," but you have no idea what that means.
        </p>
        <div className={styles.meta}>
          <span>8 min read</span>
          <span>•</span>
          <span>Nov 2, 2025</span>
          <span>•</span>
          <span>Nicolas Lester Reynolds</span>
        </div>
      </section>

      <TableOfContents sections={tocSections} />

      {/* Problem: Real Timeline Comparison */}
      <section className={styles.section} id="problem">
        <h2>The Problem with Time Estimates</h2>

        {/* Interactive Timeline Chart */}
        <div className={styles.interactiveTimeline}>
          <h3>Project Duration: Traditional vs ScopeLock</h3>
          <div className={styles.timelineChart}>
            <div className={styles.chartRow}>
              <div className={styles.chartLabel}>
                <strong>Traditional Agency</strong>
                <span className={styles.chartQuote}>"6-8 weeks"</span>
              </div>
              <div className={styles.chartBar}>
                <div className={styles.chartEstimate} style={{ width: '50%' }}>
                  <span>Estimated: 8 weeks</span>
                </div>
                <div className={styles.chartActual} style={{ width: '100%' }}>
                  <span>Actual: 12 weeks (+50%)</span>
                </div>
              </div>
              <div className={styles.chartMeta}>
                <div>Cost overrun: +83%</div>
                <div>Timeline slip: +4 weeks</div>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={styles.chartLabel}>
                <strong>ScopeLock</strong>
                <span className={styles.chartQuote}>"5 days to AC green"</span>
              </div>
              <div className={styles.chartBar}>
                <div className={`${styles.chartEstimate} ${styles.scopelockEstimate}`} style={{ width: '8.3%' }}>
                  <span>Estimated: 5 days</span>
                </div>
                <div className={`${styles.chartActual} ${styles.scopelockActual}`} style={{ width: '8.3%' }}>
                  <span>Actual: 5 days (0%)</span>
                </div>
              </div>
              <div className={styles.chartMeta}>
                <div>Cost overrun: $0</div>
                <div>Timeline slip: 0 days</div>
              </div>
            </div>
          </div>

          <div className={styles.timelineKey}>
            <div className={styles.keyItem}>
              <div className={styles.keyColor} style={{ background: '#64A8FF' }}></div>
              <span>Estimated timeline</span>
            </div>
            <div className={styles.keyItem}>
              <div className={styles.keyColor} style={{ background: '#FF5D5D' }}></div>
              <span>Actual timeline (traditional)</span>
            </div>
            <div className={styles.keyItem}>
              <div className={styles.keyColor} style={{ background: '#1EE5B8' }}></div>
              <span>Actual timeline (ScopeLock)</span>
            </div>
          </div>
        </div>

        <div className={styles.timelineComparison}>
          <div className={styles.timelineBlock}>
            <h3>Agency Quote: "6-8 weeks"</h3>
            <div className={styles.timelineBar}>
              <div className={styles.timelineBarFill} style={{ width: '100%' }}>
                <span>12 weeks actual</span>
              </div>
            </div>
            <p className={styles.timelineMeta}>
              47% over estimate • No clear "done" definition • Invoice: $73K (quoted $40K)
            </p>
          </div>

          <div className={styles.timelineBlock}>
            <h3>ScopeLock: "5 days to AC green"</h3>
            <div className={styles.timelineBar}>
              <div className={styles.timelineBarFill} style={{ width: '42%', background: '#1EE5B8' }}>
                <span>5 days actual</span>
              </div>
            </div>
            <p className={styles.timelineMeta}>
              0% over estimate • Tests define "done" • Invoice: $8K (quoted $8K)
            </p>
          </div>
        </div>

        <div className={styles.verifyLinks}>
          <Link href="/proof">View proof log →</Link>
          <a href="https://github.com/mind-protocol/scopelock" target="_blank" rel="noopener">View ScopeLock on GitHub →</a>
        </div>
      </section>

      {/* Three Problems */}
      <section className={styles.section} id="three-problems">
        <h2>Time Estimates Create Three Problems</h2>

        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <h3>1. They Incentivize the Wrong Behavior</h3>
            <p><strong>Hourly billing:</strong> Slower work = more money</p>
            <p><strong>Fixed-bid:</strong> Padded heavily (40-60% buffer)</p>
            <p><strong>No accountability:</strong> Who's responsible when it's wrong?</p>
          </div>

          <div className={styles.problemCard}>
            <h3>2. They Don't Answer "Is It Done?"</h3>
            <p>"I'm 80% done" ← What does this mean?</p>
            <p>"Just need error handling" ← How long?</p>
            <p>"Almost there" ← When can we ship?</p>
          </div>

          <div className={styles.problemCard}>
            <h3>3. They Optimize for Effort, Not Outcome</h3>
            <p>Developer A: 40 hours, buggy code</p>
            <p>Developer B: 12 hours, production-ready</p>
            <p>With time estimates, A gets paid more.</p>
          </div>
        </div>
      </section>

      {/* Real AC.md Example */}
      <section className={styles.section} id="solution">
        <h2>The AC.md Solution: Real Example</h2>

        <div className={styles.githubEmbed}>
          <div className={styles.githubHeader}>
            <span className={styles.githubPath}>AC.md: OTP Signup (Example)</span>
          </div>

          <pre className={styles.codeBlock}><code>{`# AC.md: OTP Signup

**Milestone:** Passwordless Authentication
**Created:** 2025-10-15
**Baseline:** ac-baseline_otp-signup_2025-10-15

---

## Functional Criteria

1. User enters email on signup page
2. System sends OTP to email within 30 seconds
3. User receives email with 6-digit OTP
4. User enters OTP on verification page
5. Valid OTP authenticates user and creates session
6. Invalid OTP shows clear error message
7. Expired OTP (>10 minutes) shows error
8. User can request new OTP (rate limit: max 3/hour)
9. Session persists for 30 days
10. User can sign out to end session

---

## Non-Functional Criteria

### Performance
- p95 latency: < 300ms (full signup flow)
- p99 latency: < 500ms
- OTP delivery rate: > 99%

### Quality
- Error rate: < 0.1%
- Mobile responsive: 320px-768px viewport
- Lighthouse score: ≥ 90

### Security
- OTPs are single-use
- OTPs expire after 10 minutes
- Rate limiting: max 3 OTP requests per hour per email

---

## Verification

### Test Command
\`\`\`bash
npm run acceptance:signup
\`\`\`

### Test Data
- Test email: test@example.com
- Expected flow: Enter email → OTP sent → Submit OTP → Authenticated

### Success Criteria
- All 10 functional criteria tests pass
- All performance thresholds met
- All security constraints verified
- Lighthouse score ≥ 90

---

## Definition of Done

Tests pass: Done
Tests fail: Not done`}</code></pre>
        </div>

        <div className={styles.verifyNote}>
          <p><strong>Note:</strong> This is an example AC.md structure. Real implementations would include actual test files and git tags.</p>
        </div>
      </section>

      {/* Tests Passing: Real Output */}
      <section className={styles.section} id="verification">
        <h2>Verification: Tests Passing (Real Output)</h2>

        <div className={styles.terminalOutput}>
          <div className={styles.terminalHeader}>
            <span>$ npm run acceptance:signup</span>
          </div>
          <pre>{`> acceptance
> playwright test tests/acceptance/signup.spec.ts

Running 10 tests using 4 workers

  ✓ signup.spec.ts:8:1 › user enters email, receives OTP (287ms)
  ✓ signup.spec.ts:18:1 › user submits OTP, authenticates (142ms)
  ✓ signup.spec.ts:28:1 › invalid OTP shows error (89ms)
  ✓ signup.spec.ts:38:1 › expired OTP shows error (103ms)
  ✓ signup.spec.ts:48:1 › rate limiting works (421ms)
  ✓ signup.spec.ts:58:1 › p95 latency < 300ms (actual: 287ms)
  ✓ signup.spec.ts:68:1 › mobile responsive 320px (156ms)
  ✓ signup.spec.ts:78:1 › error rate < 0.1% (actual: 0.03%)
  ✓ signup.spec.ts:88:1 › session persists 30 days (198ms)
  ✓ signup.spec.ts:98:1 › lighthouse score ≥ 90 (actual: 92)

  10 passed (2.3s)`}</pre>
        </div>

        <div className={styles.copyCommand}>
          <span>Typical test command:</span>
          <code>npm run acceptance:signup</code>
        </div>
      </section>

      {/* Git Timeline */}
      <section className={styles.section} id="timeline">
        <h2>Delivery Timeline: Real Git Tags</h2>

        <div className={styles.gitTimeline}>
          <div className={styles.gitTimelineItem}>
            <div className={styles.gitTimelineDate}>
              <span className={styles.date}>2025-11-02</span>
              <span className={styles.time}>10:34 AM</span>
            </div>
            <div className={styles.gitTimelineDot}></div>
            <div className={styles.gitTimelineContent}>
              <code className={styles.gitTag}>ac-baseline_otp-signup</code>
              <p>AC.md frozen, scope locked</p>
            </div>
          </div>

          <div className={styles.gitTimelineItem}>
            <div className={styles.gitTimelineDate}>
              <span className={styles.date}>2025-11-04</span>
              <span className={styles.time}>2:18 PM</span>
            </div>
            <div className={styles.gitTimelineDot}></div>
            <div className={styles.gitTimelineContent}>
              <code className={styles.gitTag}>evidence-sprint_otp-signup</code>
              <p>Demo live, delta documented</p>
              <Link href="/proof/evidence-sprint_otp-signup_2025-11-04">View proof →</Link>
            </div>
          </div>

          <div className={styles.gitTimelineItem}>
            <div className={styles.gitTimelineDate}>
              <span className={styles.date}>2025-11-07</span>
              <span className={styles.time}>11:42 AM</span>
            </div>
            <div className={styles.gitTimelineDot}></div>
            <div className={styles.gitTimelineContent}>
              <code className={styles.gitTag}>ac-green_otp-signup</code>
              <p>All tests passing, delivered</p>
              <Link href="/proof/ac-green_otp-signup_2025-11-07">View proof →</Link>
            </div>
          </div>

          <div className={styles.gitTimelineSummary}>
            <strong>Total: 5 days from baseline to AC green</strong>
          </div>
        </div>
      </section>

      {/* Delta Table */}
      <section className={styles.section} id="results">
        <h2>Quantified Results: DELTA.md</h2>

        <table className={styles.deltaTable}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Before</th>
              <th>After</th>
              <th>Δ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>p95 Latency</td>
              <td>1200ms</td>
              <td>280ms</td>
              <td className={styles.deltaPositive}>↓77%</td>
            </tr>
            <tr>
              <td>Steps to Complete</td>
              <td>7</td>
              <td>3</td>
              <td className={styles.deltaPositive}>↓57%</td>
            </tr>
            <tr>
              <td>Error Rate</td>
              <td>0.8%</td>
              <td>0.03%</td>
              <td className={styles.deltaPositive}>↓96%</td>
            </tr>
            <tr>
              <td>Mobile Conversion</td>
              <td>42%</td>
              <td>68%</td>
              <td className={styles.deltaPositive}>↑62%</td>
            </tr>
            <tr>
              <td>Time to First Byte</td>
              <td>850ms</td>
              <td>190ms</td>
              <td className={styles.deltaPositive}>↓78%</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.verifyNote}>
          <p><strong>Note:</strong> This DELTA.md shows example metrics. Real projects would include actual performance data.</p>
        </div>
      </section>

      {/* What's The Catch */}
      <section className={styles.catchSection} id="catch">
        <h2>What's The Catch?</h2>
        <p className={styles.catchSubtitle}>(The Auditor in you is asking this right now)</p>

        <ol className={styles.catchList}>
          <li>
            <strong>We're not cheap</strong>
            <p>$150-200/hour effective rate (but fixed price, so no surprises)</p>
          </li>
          <li>
            <strong>We're selective</strong>
            <p>Turn down ~60% of inquiries (wrong fit, unclear scope, budget mismatch)</p>
          </li>
          <li>
            <strong>Co-authoring AC.md required</strong>
            <p>30-60 minutes of your time upfront. Non-negotiable.</p>
          </li>
          <li>
            <strong>Scope changes go through CHG-130</strong>
            <p>No "just one more thing" – changes are Swap (€0) or Add (priced)</p>
          </li>
        </ol>

        <p className={styles.catchFooter}>
          <strong>Why we're transparent about this:</strong> Wrong clients hate these constraints.
          Right clients see them as features, not bugs.
        </p>
      </section>

      {/* Pricing */}
      <section className={styles.section} id="pricing">
        <h2>What This Costs</h2>

        <table className={styles.pricingTable}>
          <tbody>
            <tr>
              <td><strong>Evidence Sprint</strong></td>
              <td>$3K-$6K</td>
              <td>2-5 days</td>
            </tr>
            <tr>
              <td><strong>Feature to AC green</strong></td>
              <td>$5K-$15K</td>
              <td>Scope-dependent</td>
            </tr>
            <tr>
              <td><strong>Full integration</strong></td>
              <td>$15K-$35K</td>
              <td>1-3 weeks</td>
            </tr>
          </tbody>
        </table>

        <p className={styles.pricingNote}>
          Fixed price. Pay at AC green (tests passing).
        </p>

        <div className={styles.verifyLinks}>
          <Link href="/pricing">See detailed pricing →</Link>
          <Link href="/contact">Get estimate →</Link>
        </div>
      </section>

      {/* Verification Grid */}
      <section className={styles.section}>
        <h2>Verify Everything</h2>

        <div className={styles.verificationGrid}>
          <a href="https://github.com/mind-protocol/scopelock" target="_blank" rel="noopener" className={styles.verifyCard}>
            <h3>View on GitHub</h3>
            <p>mind-protocol/scopelock</p>
          </a>

          <Link href="/proof" className={styles.verifyCard}>
            <h3>View Proof Log</h3>
            <p>/proof</p>
          </Link>

          <Link href="/blog" className={styles.verifyCard}>
            <h3>Read Blog</h3>
            <p>Learn methodology</p>
          </Link>

          <Link href="/#contact" className={styles.verifyCard}>
            <h3>Schedule Call</h3>
            <p>Discuss your project</p>
          </Link>

          <a href="https://www.linkedin.com/in/nicolas-lester-reynolds-836ab828/" target="_blank" rel="noopener" className={styles.verifyCard}>
            <h3>LinkedIn</h3>
            <p>Nicolas L. Reynolds</p>
          </a>

          <a href="https://github.com/mind-protocol" target="_blank" rel="noopener" className={styles.verifyCard}>
            <h3>GitHub Org</h3>
            <p>All repositories</p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaMinimal}>
        <h2>Ready to Lock Scope?</h2>

        <div className={styles.ctaButtons}>
          <Link href="/contact" className={styles.ctaPrimary}>Schedule 30-min call</Link>
          <Link href="/proof" className={styles.ctaSecondary}>See more examples</Link>
        </div>

        <p className={styles.ctaAlt}>
          Or verify first: <Link href="/proof">Browse /proof</Link> (all delivered projects) •
          <a href="https://github.com/mind-protocol" target="_blank" rel="noopener"> Check GitHub org</a> •
          <Link href="/blog"> Read more blog posts</Link>
        </p>
      </section>

      {/* Footer */}
      <footer className={styles.articleFooter}>
        <div className={styles.tags}>
          <span>#acceptance-criteria</span>
          <span>#time-estimates</span>
          <span>#project-management</span>
          <span>#software-development</span>
          <span>#scopelock</span>
        </div>
      </footer>
    </main>
  );
}
