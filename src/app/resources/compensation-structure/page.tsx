'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.css';

export default function CompensationStructurePage() {
  const [jobsPerMonth, setJobsPerMonth] = useState(10);
  const [avgJobValue, setAvgJobValue] = useState(800);
  const [yourInteractionPct, setYourInteractionPct] = useState(50); // % of team interactions
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN' | 'COP'>('USD');

  // Exchange rates (approximate, as of Nov 2025)
  const exchangeRates = {
    USD: 1,
    NGN: 1650,  // Nigerian Naira
    COP: 4100   // Colombian Peso
  };

  // Currency symbols
  const currencySymbols = {
    USD: '$',
    NGN: '₦',
    COP: '$'
  };

  // Format currency based on selection
  const formatCurrency = (amount: number) => {
    const converted = amount * exchangeRates[selectedCurrency];
    const symbol = currencySymbols[selectedCurrency];
    return `${symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Calculate earnings
  const totalRevenue = jobsPerMonth * avgJobValue;
  const teamPool = totalRevenue * 0.30; // 30% to team
  const missionFund = totalRevenue * 0.05; // 5% for missions

  // Your share based on interaction %
  const yourJobEarnings = teamPool * (yourInteractionPct / 100);

  // Estimate missions completed (proportional to your activity)
  const estimatedProposals = Math.floor(jobsPerMonth * (yourInteractionPct / 100) * 0.8); // ~80% of active members write proposals
  const estimatedPosts = Math.floor((yourInteractionPct / 100) * 5); // ~5 posts/month for active member
  const yourMissionEarnings = (estimatedProposals * 1) + (estimatedPosts * 2);

  const yourTotalEarnings = yourJobEarnings + yourMissionEarnings;

  // PPP multiplier (Nigeria/Côte d'Ivoire purchasing power)
  const pppMultiplier = { min: 5, max: 10 };

  return (
    <main className={styles.compensationStructure}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>The More You Work, The More You Earn</h1>
        <div className={styles.meta}>
          <time>Nov 7, 2025</time>
          <span>•</span>
          <span>12 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #3</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "The more you contribute, the more you earn. And you see the estimate live."
        </p>
        <p>
          Most agencies pay fixed salaries or hourly rates. You work hard on a project, but your teammate slacks off—you both get paid the same. That&apos;s not fair.
        </p>
        <p>
          <strong>ScopeLock is different:</strong> Your contribution to each job is tracked automatically as you work with AI citizens.
          Your share: <code>(Your contribution % / Total team contribution) × 30% of job value</code>.
          Real-time visibility. 100% transparent. 100% fair.
        </p>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '8px', border: '1px solid rgba(30, 229, 184, 0.3)', lineHeight: '1.8' }}>
          <p style={{ margin: 0 }}>
            <strong>Why this is cool:</strong> Contribute 2x as much → earn 2x as much. No politics, no favoritism, no arbitrary roles.
            Everyone sees their live earnings estimate in real-time. More contribution = more money. Less contribution = less money. <strong>Fair.</strong>
          </p>
        </div>
      </section>

      {/* Key Principle */}
      <section className={styles.section}>
        <h2>How It Works</h2>
        <div className={styles.callout}>
          <strong>Step 1:</strong> Work on jobs via Mission Deck with AI citizens (Rafael, Inna, Sofia, Emma)
          <br/>
          <strong>Step 2:</strong> Your contribution is tracked automatically in the background
          <br/>
          <strong>Step 3:</strong> See your live earnings estimate as you work
          <br/>
          <strong>Step 4:</strong> Get paid when client pays (typically 21 days after delivery)
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '8px', border: '1px solid rgba(30, 229, 184, 0.3)' }}>
          <p style={{ margin: 0, lineHeight: '1.8' }}>
            <strong>The system tracks your work automatically.</strong> You don&apos;t need to log hours or fill timesheets.
            Just work with the AI citizens, and your contribution percentage updates in real-time.
            The more you contribute to a job, the higher your share of the 30% team pool.
          </p>
        </div>
      </section>

      {/* Revenue Projector */}
      <section className={styles.section}>
        <h2>Your Potential Earnings Calculator</h2>
        <p>Use the sliders below to see what you&apos;d earn based on activity level:</p>

        {/* Currency Selector */}
        <div className={styles.currencySelector}>
          <label>Show amounts in:</label>
          <div className={styles.currencyButtons}>
            <button
              className={`${styles.currencyButton} ${selectedCurrency === 'USD' ? styles.active : ''}`}
              onClick={() => setSelectedCurrency('USD')}
            >
              USD ($)
            </button>
            <button
              className={`${styles.currencyButton} ${selectedCurrency === 'NGN' ? styles.active : ''}`}
              onClick={() => setSelectedCurrency('NGN')}
            >
              NGN (₦) Nigeria
            </button>
            <button
              className={`${styles.currencyButton} ${selectedCurrency === 'COP' ? styles.active : ''}`}
              onClick={() => setSelectedCurrency('COP')}
            >
              COP ($) Colombia
            </button>
          </div>
        </div>

        <div className={styles.projector}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <label htmlFor="jobs">
                Jobs per month: <strong>{jobsPerMonth}</strong>
              </label>
              <input
                type="range"
                id="jobs"
                min="1"
                max="20"
                value={jobsPerMonth}
                onChange={(e) => setJobsPerMonth(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>1</span>
                <span>10</span>
                <span>20</span>
              </div>
            </div>

            <div className={styles.control}>
              <label htmlFor="value">
                Average job value: <strong className={styles.metallicText}>${avgJobValue}</strong>
              </label>
              <input
                type="range"
                id="value"
                min="100"
                max="2000"
                step="50"
                value={avgJobValue}
                onChange={(e) => setAvgJobValue(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span className={styles.metallicText}>$100</span>
                <span className={styles.metallicText}>$1050</span>
                <span className={styles.metallicText}>$2000</span>
              </div>
            </div>

            <div className={styles.control}>
              <label htmlFor="activity">
                Your contribution level: <strong>{yourInteractionPct}%</strong>
                <br/>
                <span style={{ fontSize: '0.85rem', color: 'var(--slk-muted, #9AA3AE)' }}>
                  (50% = average contributor, 70%+ = very active)
                </span>
              </label>
              <input
                type="range"
                id="activity"
                min="10"
                max="90"
                step="5"
                value={yourInteractionPct}
                onChange={(e) => setYourInteractionPct(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>10%</span>
                <span>50%</span>
                <span>90%</span>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.totalRevenue}>
              <span className={styles.label}>Total Monthly Revenue</span>
              <span className={`${styles.value} ${styles.metallicText}`}>{formatCurrency(totalRevenue)}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '8px', border: '1px solid rgba(30, 229, 184, 0.3)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slk-muted, #9AA3AE)', marginBottom: '0.5rem' }}>Team Pool (30%)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slk-accent, #1EE5B8)' }}>{formatCurrency(teamPool)}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(100, 168, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(100, 168, 255, 0.3)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slk-muted, #9AA3AE)', marginBottom: '0.5rem' }}>Mission Fund (5%)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slk-accent-2, #64A8FF)' }}>{formatCurrency(missionFund)}</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(30, 229, 184, 0.15)', borderRadius: '12px', border: '2px solid var(--slk-accent, #1EE5B8)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--slk-muted, #9AA3AE)', marginBottom: '0.5rem' }}>YOUR TOTAL POTENTIAL EARNINGS</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--slk-accent, #1EE5B8)', marginBottom: '1rem' }}>
                {formatCurrency(yourTotalEarnings)}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--slk-muted)' }}>/month</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(230, 234, 242, 0.1)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slk-muted)', marginBottom: '0.25rem' }}>From jobs ({yourInteractionPct}% contribution):</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(yourJobEarnings)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slk-muted)', marginBottom: '0.25rem' }}>From missions (~{estimatedProposals} proposals, {estimatedPosts} posts):</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(yourMissionEarnings)}</div>
                </div>
              </div>

              {selectedCurrency === 'USD' && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slk-muted)' }}>Purchasing Power Equivalent (Nigeria/Colombia):</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.25rem' }}>
                    ~${(yourTotalEarnings * pppMultiplier.min).toLocaleString()} - ${(yourTotalEarnings * pppMultiplier.max).toLocaleString()}/month in US terms
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className={styles.section}>
        <h2>Real Examples: How Fair Distribution Works</h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Example 1 */}
          <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(230, 234, 242, 0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--slk-success, #5CE27E)' }}>✅ Equal Contribution → Equal Pay</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Job: $1,000 | Team pool: $300 (30%)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slk-muted)' }}>You: 33.3%</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slk-accent)' }}>$100</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slk-muted)' }}>Teammate A: 33.3%</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slk-accent)' }}>$100</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slk-muted)' }}>Teammate B: 33.3%</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slk-accent)' }}>$100</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', fontStyle: 'italic' }}>Everyone contributed equally → everyone earns equally.</p>
          </div>

          {/* Example 2 */}
          <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(230, 234, 242, 0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--slk-accent, #1EE5B8)' }}>💪 You Contribute More → You Earn More</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Job: $1,000 | Team pool: $300 (30%)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(30, 229, 184, 0.2)', borderRadius: '6px', border: '2px solid var(--slk-accent)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slk-muted)' }}>You: 66.7%</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--slk-accent)' }}>$200</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>High contribution</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(30, 229, 184, 0.05)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slk-muted)' }}>Teammate A: 22.2%</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slk-text)' }}>$67</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Medium contribution</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(30, 229, 184, 0.05)', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slk-muted)' }}>Teammate B: 11.1%</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slk-text)' }}>$33</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Lower contribution</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', fontStyle: 'italic', color: 'var(--slk-accent)' }}>
              <strong>You contributed 3x more than Teammate A → you earn 3x as much. Fair.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Commission Breakdown */}
      <section className={styles.section}>
        <h2>Where Your Money Comes From</h2>

        <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>For every $1,000 job:</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '6px' }}>
              <span>30% → Team Pool (split by interactions)</span>
              <strong style={{ color: 'var(--slk-accent)' }}>$300</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(100, 168, 255, 0.1)', borderRadius: '6px' }}>
              <span>5% → Mission Fund (proposals, posts, recruitment)</span>
              <strong style={{ color: 'var(--slk-accent-2)' }}>$50</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
              <span>10% → Upwork fees</span>
              <strong>$100</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
              <span>~21% → AI costs (Claude API, tools)</span>
              <strong>$210</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
              <span>~34% → ScopeLock profit</span>
              <strong>$340</strong>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '8px', border: '1px solid rgba(30, 229, 184, 0.3)' }}>
          <strong>You earn from:</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
            <li><strong>Team pool:</strong> Your % of 30% based on contribution level</li>
            <li><strong>Missions:</strong> Fixed $ per mission (proposals $1, posts $2, recruitment $10)</li>
          </ul>
        </div>
      </section>

      {/* Why This System Is Better */}
      <section className={styles.section}>
        <h2>Why This System Is Better</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(255, 93, 93, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 93, 93, 0.3)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--slk-danger)' }}>❌ Old System (Fixed Roles)</h3>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <li>Kara always gets 15%, even if he barely contributes</li>
              <li>Reanance always gets 9%, even if she works overtime</li>
              <li>No incentive to contribute more</li>
              <li>Resentment builds when effort isn&apos;t rewarded</li>
            </ul>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(30, 229, 184, 0.1)', borderRadius: '8px', border: '1px solid rgba(30, 229, 184, 0.3)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--slk-success)' }}>✅ New System (Contribution-Based)</h3>
            <ul style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <li>Contribute 2x as much → earn 2x as much</li>
              <li>Real-time visibility into earnings estimates</li>
              <li>100% transparent (everyone sees their live contribution %)</li>
              <li>Natural incentive to contribute more</li>
              <li>Fair distribution based on actual work</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Payment Timing */}
      <section className={styles.section}>
        <h2>When Do You Get Paid?</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 0</div>
            <div className={styles.timelineEvent}>Job starts</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 7</div>
            <div className={styles.timelineEvent}>AC Green delivered to client</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 21</div>
            <div className={styles.timelineEvent}>Upwork releases funds to ScopeLock</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 21</div>
            <div className={styles.timelineEvent}>
              <strong>You get paid (SOL)</strong>
              <span className={styles.timelineNote}>Within 4 hours</span>
            </div>
          </div>
        </div>

        <div className={styles.callout}>
          <strong>Payment method: Solana (SOL)</strong>
          <p>Instant transfers, near-zero fees (<span className={styles.metallicText}>~$0.01</span>), fully transparent on blockchain.</p>
          <p>You can hold SOL, convert to USDC, or cash out to local currency via Binance.</p>
        </div>
      </section>

      {/* Quality Gates */}
      <section className={styles.section}>
        <h2>Quality Gates & Penalties</h2>

        <div className={styles.qualityGates}>
          <div className={styles.gateCard}>
            <div className={styles.gateIcon}>⚠️</div>
            <div className={styles.gateContent}>
              <h3>Sofia finds critical bugs</h3>
              <p><strong>Commission held</strong> until bugs fixed and re-verified</p>
            </div>
          </div>

          <div className={styles.gateCard}>
            <div className={styles.gateIcon}>❌</div>
            <div className={styles.gateContent}>
              <h3>Client rejects delivery</h3>
              <p><strong>No commission</strong> until client accepts (AC.md not met)</p>
            </div>
          </div>

          <div className={styles.gateCard}>
            <div className={styles.gateIcon}>💥</div>
            <div className={styles.gateContent}>
              <h3>Job fails entirely</h3>
              <p><strong>$0 for everyone</strong> (ScopeLock absorbs loss)</p>
            </div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>This is why quality matters.</strong>
          <p>
            You only get paid when the client accepts. Rushing and shipping broken code = delayed payment or no payment.
          </p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className={styles.section}>
        <h2>Key Takeaways</h2>
        <div className={styles.takeaways}>
          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>💰</div>
            <div className={styles.takeawayText}>
              <strong>Fair distribution = motivated team</strong>
              <p>Work more → earn more. Work less → earn less. No politics.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>⚡</div>
            <div className={styles.takeawayText}>
              <strong>Real-time visibility = no surprises</strong>
              <p>You always know exactly what you&apos;ll earn before the job completes.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>✅</div>
            <div className={styles.takeawayText}>
              <strong>Quality gates protect everyone</strong>
              <p>Sofia catches bugs before client sees them. Better for reputation and earnings.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>🌍</div>
            <div className={styles.takeawayText}>
              <strong>PPP advantage is massive</strong>
              <p>Your earnings go 5-10x further than nominal $ suggests.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>📈</div>
            <div className={styles.takeawayText}>
              <strong>Growth path is clear</strong>
              <p>Contribute more → earn more → build reputation → handle bigger jobs → earn even more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className={styles.section}>
        <h2>Related Resources</h2>
        <div className={styles.relatedLinks}>
          <Link href="/resources/complete-mission-flow" className={styles.relatedLink}>
            <span className={styles.relatedIcon}>🔄</span>
            <div>
              <div className={styles.relatedTitle}>The Complete Mission Flow</div>
              <div className={styles.relatedDesc}>Understand who does what when</div>
            </div>
          </Link>
          <Link href="/resources/how-to-talk-to-ai-citizens" className={styles.relatedLink}>
            <span className={styles.relatedIcon}>💬</span>
            <div>
              <div className={styles.relatedTitle}>How to Talk to AI Citizens</div>
              <div className={styles.relatedDesc}>Get better output from Rafael and Sofia</div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Questions About Compensation?</h2>
        <p>
          Reach out to Nicolas on Telegram (@nlr_ai) or ask in the team chat.
          We&apos;re committed to fair, transparent compensation that scales with contribution.
        </p>
      </section>
    </main>
  );
}
