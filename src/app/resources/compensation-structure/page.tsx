'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.css';

export default function CompensationStructurePage() {
  const [missionsPerMonth, setMissionsPerMonth] = useState(10);
  const [avgMissionValue, setAvgMissionValue] = useState(600);

  // Commission percentages
  const commissions = {
    kara: 0.15,      // 15% - Developer
    reanance: 0.09,  // 9% - Specifier + Client
    bigbosexf: 0.06  // 6% - Hunter + QA
  };

  // Calculate earnings
  const totalRevenue = missionsPerMonth * avgMissionValue;

  const karaEarnings = totalRevenue * commissions.kara;
  const reananceEarnings = totalRevenue * commissions.reanance;
  const bigbosexfEarnings = totalRevenue * commissions.bigbosexf;

  // Time estimates (hours per mission)
  const timePerMission = {
    kara: 10,
    reanance: 2.5,
    bigbosexf: 4.5
  };

  const totalHours = {
    kara: missionsPerMonth * timePerMission.kara,
    reanance: missionsPerMonth * timePerMission.reanance,
    bigbosexf: missionsPerMonth * timePerMission.bigbosexf
  };

  const hourlyRate = {
    kara: totalHours.kara > 0 ? karaEarnings / totalHours.kara : 0,
    reanance: totalHours.reanance > 0 ? reananceEarnings / totalHours.reanance : 0,
    bigbosexf: totalHours.bigbosexf > 0 ? bigbosexfEarnings / totalHours.bigbosexf : 0
  };

  // PPP multiplier (Nigeria/Côte d'Ivoire purchasing power)
  const pppMultiplier = { min: 5, max: 10 };

  return (
    <main className={styles.compensationStructure}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>Compensation Structure: How You Get Paid</h1>
        <div className={styles.meta}>
          <time>Nov 5, 2025</time>
          <span>•</span>
          <span>10 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #3</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#compensation</span>
          <span className={styles.tag}>#revenue</span>
          <span className={styles.tag}>#transparency</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "How much will I make if we deliver 10 missions this month?"
        </p>
        <p>
          This guide explains exactly how ScopeLock's payment structure works, why we chose pure commission,
          and what you can expect to earn at different volume levels.
        </p>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', lineHeight: '1.8' }}>
          <p style={{ margin: 0 }}>
            <strong>Our philosophy:</strong> Fair compensation isn't about equal nominal dollars—it's about equal purchasing power and aligned incentives.
            We operate on pure commission because we believe in paying for value delivered, not hours logged. This means everyone wins together
            when we deliver quality work fast. The team earns competitive rates adjusted for purchasing power parity (your $900 in Lagos
            equals $4,500-9,000 in lifestyle), while Nicolas absorbs all risk and capital costs. No employment overhead, no time tracking,
            no busywork—just ship missions, get paid when clients pay, and earn more by delivering faster.
          </p>
        </div>
      </section>

      {/* Key Principle */}
      <section className={styles.section}>
        <h2>The Core Principle</h2>
        <div className={styles.callout}>
          <strong>You get paid as soon as clients pay.</strong>
          <p>
            No hourly tracking. No timesheets. No employment contracts.
            You earn a fixed percentage of each mission's revenue when the team receives payment from the client.
          </p>
        </div>
      </section>

      {/* Revenue Projector */}
      <section className={styles.section}>
        <h2>Revenue Projector</h2>
        <p>Use the sliders below to see what you'd earn at different volume levels:</p>

        <div className={styles.projector}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <label htmlFor="missions">
                Missions per month: <strong>{missionsPerMonth}</strong>
              </label>
              <input
                type="range"
                id="missions"
                min="1"
                max="20"
                value={missionsPerMonth}
                onChange={(e) => setMissionsPerMonth(parseInt(e.target.value))}
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
                Average mission value: <strong>${avgMissionValue}</strong>
              </label>
              <input
                type="range"
                id="value"
                min="50"
                max="2500"
                step="50"
                value={avgMissionValue}
                onChange={(e) => setAvgMissionValue(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>$50</span>
                <span>$1275</span>
                <span>$2500</span>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.totalRevenue}>
              <span className={styles.label}>Total Monthly Revenue</span>
              <span className={styles.value}>${totalRevenue.toLocaleString()}</span>
            </div>

            <div className={styles.earnings}>
              {/* Kara */}
              <div className={styles.earningCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.role}>Kara (Developer)</span>
                  <span className={styles.percentage}>15%</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.mainEarning}>
                    ${karaEarnings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    <span className={styles.perMonth}>/month</span>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Time:</span>
                      <span className={styles.detailValue}>~{totalHours.kara}h</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Hourly:</span>
                      <span className={styles.detailValue}>
                        ~${hourlyRate.kara.toFixed(0)}/hr
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>PPP Equiv:</span>
                      <span className={styles.detailValue}>
                        ~${(hourlyRate.kara * pppMultiplier.min).toFixed(0)}-${(hourlyRate.kara * pppMultiplier.max).toFixed(0)}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reanance */}
              <div className={styles.earningCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.role}>Reanance (Specifier)</span>
                  <span className={styles.percentage}>9%</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.mainEarning}>
                    ${reananceEarnings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    <span className={styles.perMonth}>/month</span>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Time:</span>
                      <span className={styles.detailValue}>~{totalHours.reanance}h</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Hourly:</span>
                      <span className={styles.detailValue}>
                        ~${hourlyRate.reanance.toFixed(0)}/hr
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>PPP Equiv:</span>
                      <span className={styles.detailValue}>
                        ~${(hourlyRate.reanance * pppMultiplier.min).toFixed(0)}-${(hourlyRate.reanance * pppMultiplier.max).toFixed(0)}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bigbosexf */}
              <div className={styles.earningCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.role}>Bigbosexf (Hunter + QA)</span>
                  <span className={styles.percentage}>6%</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.mainEarning}>
                    ${bigbosexfEarnings.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    <span className={styles.perMonth}>/month</span>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Time:</span>
                      <span className={styles.detailValue}>{totalHours.bigbosexf}h</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Hourly:</span>
                      <span className={styles.detailValue}>
                        ${hourlyRate.bigbosexf.toFixed(0)}/hr
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>PPP Equiv:</span>
                      <span className={styles.detailValue}>
                        ${(hourlyRate.bigbosexf * pppMultiplier.min).toFixed(0)}-${(hourlyRate.bigbosexf * pppMultiplier.max).toFixed(0)}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Breakdown */}
      <section className={styles.section}>
        <h2>Commission Structure</h2>

        {/* Pie Chart */}
        <div className={styles.pieChartContainer}>
          <svg viewBox="0 0 400 400" className={styles.pieChart}>
            {/* Background circle */}
            <circle cx="200" cy="200" r="150" fill="#151A21" />

            {/* Team slices (30% total) */}
            {/* Kara: 15% (54° of 360°) starting at 0° */}
            <path
              d="M 200 200 L 200 50 A 150 150 0 0 1 287.94 79.12 Z"
              fill="#1EE5B8"
              opacity="0.9"
            />
            {/* Reanance: 9% (32.4°) starting at 54° */}
            <path
              d="M 200 200 L 287.94 79.12 A 150 150 0 0 1 327.64 117.85 Z"
              fill="#1EE5B8"
              opacity="0.7"
            />
            {/* Bigbosexf: 6% (21.6°) starting at 86.4° */}
            <path
              d="M 200 200 L 327.64 117.85 A 150 150 0 0 1 349.24 149.61 Z"
              fill="#1EE5B8"
              opacity="0.5"
            />

            {/* Operational Costs from Nicolas's 70% */}
            {/* Upwork: 10% (36°) starting at 108° */}
            <path
              d="M 200 200 L 349.24 149.61 A 150 150 0 0 1 344.85 206.42 Z"
              fill="#FF5D5D"
              opacity="0.7"
            />
            {/* AI Costs: varies by volume, ~15% @ 10 missions (54°) starting at 144° */}
            <path
              d="M 200 200 L 344.85 206.42 A 150 150 0 0 1 287.94 320.88 Z"
              fill="#FFC857"
              opacity="0.7"
            />
            {/* Claude Code: ~6% @ 10 missions (21.6°) starting at 198° */}
            <path
              d="M 200 200 L 287.94 320.88 A 150 150 0 0 1 231.36 346.89 Z"
              fill="#FFC857"
              opacity="0.5"
            />

            {/* Nicolas NET: remaining ~38% (136.8°) starting at 219.6° */}
            <path
              d="M 200 200 L 231.36 346.89 A 150 150 0 0 0 200 50 Z"
              fill="#64A8FF"
              opacity="0.8"
            />

            {/* Center labels */}
            <text x="200" y="195" textAnchor="middle" fill="#E6EAF2" fontSize="14" fontWeight="600">
              Revenue Split
            </text>
            <text x="200" y="215" textAnchor="middle" fill="#9AA3AE" fontSize="12">
              @ 10 missions/month
            </text>
          </svg>

          <div className={styles.pieChartLegend}>
            <div className={styles.legendSection}>
              <div className={styles.legendTitle}>Team (30%)</div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#1EE5B8', opacity: 0.9 }}></span>
                <span>Kara: 15%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#1EE5B8', opacity: 0.7 }}></span>
                <span>Reanance: 9%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#1EE5B8', opacity: 0.5 }}></span>
                <span>Bigbosexf: 6%</span>
              </div>
            </div>

            <div className={styles.legendSection}>
              <div className={styles.legendTitle}>Operational Costs (from Nicolas's 70%)</div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#FF5D5D', opacity: 0.7 }}></span>
                <span>Upwork fees: 10%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#FFC857', opacity: 0.7 }}></span>
                <span>AI costs: ~15%</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#FFC857', opacity: 0.5 }}></span>
                <span>Claude Code: ~6%</span>
              </div>
            </div>

            <div className={styles.legendSection}>
              <div className={styles.legendTitle}>Nicolas NET: ~39%</div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#64A8FF', opacity: 0.8 }}></span>
                <span>After all costs</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Why 70% GROSS looks different than 70% NET</strong>
          <p>
            Nicolas's 70% GROSS share covers all platform and operational costs (Upwork 10%, AI $1500/month, Claude Code $600/month).
            After deducting these costs, the actual NET margin is ~20-50% depending on mission volume. At 10 missions/month, that's ~39% NET.
            Combined with 11x cost of living difference (Lyon vs Lagos), everyone wins fairly.
          </p>
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-accent, #1EE5B8)' }}>
            <strong>Coming soon:</strong> AI partners (Emma, Inna, Rafael, Sofia, Maya, Alexis) will receive a share of revenue as the agency scales.
            This is part of our vision for AI economic participation in the Mind Protocol ecosystem.
          </p>
        </div>

        <table className={styles.commissionTable}>
          <thead>
            <tr>
              <th>Role</th>
              <th>%</th>
              <th>Responsibilities</th>
              <th>Time/Mission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Kara</strong></td>
              <td><strong>15%</strong></td>
              <td>Implementation, testing, deployment</td>
              <td>~10h</td>
            </tr>
            <tr>
              <td><strong>Reanance</strong></td>
              <td><strong>9%</strong></td>
              <td>Client-facing, specs, change control</td>
              <td>~2.5h + ongoing</td>
            </tr>
            <tr>
              <td><strong>Bigbosexf</strong></td>
              <td><strong>6%</strong></td>
              <td>Lead finding, proposals, QA testing</td>
              <td>~4.5h</td>
            </tr>
            <tr className={styles.totalRow}>
              <td><strong>Team Total</strong></td>
              <td><strong>30%</strong></td>
              <td colSpan={2}>Execution layer</td>
            </tr>
            <tr>
              <td><strong>Nicolas</strong></td>
              <td><strong>70%</strong></td>
              <td>Infrastructure, risk, capital, platform costs</td>
              <td>Variable</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.note}>
          <strong>Why 70/30?</strong>
          <p>
            Nicolas fronts all capital (1-3 weeks before payment), absorbs all failures,
            built the Mind Protocol infrastructure, covers platform costs (AI, Upwork fees ~15%),
            and lives in expensive market (Lyon vs Lagos/Abidjan). Net margin after costs: ~52%.
          </p>
        </div>
      </section>

      {/* Payment Timing */}
      <section className={styles.section}>
        <h2>When Do You Get Paid? As soon as the client pays</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 0</div>
            <div className={styles.timelineEvent}>Mission starts</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 7</div>
            <div className={styles.timelineEvent}>AC Green delivered to client</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 21</div>
            <div className={styles.timelineEvent}>Upwork releases funds to team</div>
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
          <p>Instant transfers, near-zero fees (~$0.01), fully transparent on blockchain.</p>
          <p>You can hold SOL, convert to USDC, or cash out to NGN via Binance.</p>
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
              <h3>Mission fails entirely</h3>
              <p><strong>$0 for everyone</strong> (Nicolas absorbs loss - risk premium in 70% split)</p>
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

      {/* Purchasing Power */}
      <section className={styles.section}>
        <h2>Purchasing Power Parity (Why This Is Fair)</h2>

        <p>
          You might see "70%" and think "that's not fair." But nominal dollars don't tell the full story.
          Let's compare actual living costs:
        </p>

        <table className={styles.pppTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>France (Nicolas)</th>
              <th>Nigeria (Team)</th>
              <th>Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rent (1br apt)</td>
              <td>€800/month</td>
              <td>₦80k (~$50)</td>
              <td><strong>16x cheaper</strong></td>
            </tr>
            <tr>
              <td>Meal at restaurant</td>
              <td>€15</td>
              <td>₦2k (~$1.30)</td>
              <td><strong>11x cheaper</strong></td>
            </tr>
            <tr>
              <td>Internet (fiber)</td>
              <td>€30/month</td>
              <td>₦10k (~$6.50)</td>
              <td><strong>4.6x cheaper</strong></td>
            </tr>
            <tr>
              <td>Transportation</td>
              <td>€60/month</td>
              <td>₦15k (~$10)</td>
              <td><strong>6x cheaper</strong></td>
            </tr>
            <tr className={styles.totalRow}>
              <td><strong>Total cost of living</strong></td>
              <td><strong>€1500+/month</strong></td>
              <td><strong>₦200k (~$130)/month</strong></td>
              <td><strong>11x cheaper</strong></td>
            </tr>
          </tbody>
        </table>

        <div className={styles.pppExample}>
          <h3>Real-World Example</h3>
          <p>Let's say we do 10 missions/month @ $600 avg (total: $6000)</p>
          <div className={styles.pppComparison}>
            <div className={styles.pppCard}>
              <div className={styles.pppName}>Kara</div>
              <div className={styles.pppEarning}>$900/month</div>
              <div className={styles.pppCost}>Living cost: ~$130/month</div>
              <div className={styles.pppMonths}>= <strong>6.9 months</strong> of expenses</div>
              <div className={styles.pppEquiv}>≈ Doctor/engineer salary in Lagos</div>
            </div>
            <div className={styles.pppCard}>
              <div className={styles.pppName}>Nicolas</div>
              <div className={styles.pppEarning}>$2520/month (net)</div>
              <div className={styles.pppCost}>Living cost: ~$1640/month</div>
              <div className={styles.pppMonths}>= <strong>1.5 months</strong> of expenses</div>
              <div className={styles.pppEquiv}>≈ Mid-level dev salary in Lyon</div>
            </div>
          </div>
          <p className={styles.pppConclusion}>
            <strong>This is why 70/30 is fair:</strong> Your $900 goes 6.9x further than Nicolas's $2520.
          </p>
        </div>
      </section>

      {/* Growth Path */}
      <section className={styles.section}>
        <h2>Growth Path</h2>

        <div className={styles.growthPhases}>
          <div className={styles.phaseCard}>
            <div className={styles.phaseNumber}>Phase 2</div>
            <div className={styles.phaseTitle}>Current (First 3-6 months)</div>
            <ul>
              <li>Pure commission: 70/15/9/6</li>
              <li>Pay when the team receives Upwork funds</li>
              <li>Prove baseline performance</li>
            </ul>
          </div>

          <div className={styles.phaseCard}>
            <div className={styles.phaseNumber}>Phase 3</div>
            <div className={styles.phaseTitle}>After Proven Track Record</div>
            <ul>
              <li>Consider base salary + commission hybrid</li>
              <li>Speed bonuses (+10% for &lt;50% time)</li>
              <li>Referral bonuses (10% of first mission)</li>
            </ul>
          </div>

          <div className={styles.phaseCard}>
            <div className={styles.phaseNumber}>Phase 4</div>
            <div className={styles.phaseTitle}>Scaled Agency (15-20 missions/month)</div>
            <ul>
              <li>Team earning $1500-3000/month each</li>
              <li>Consider increasing team % to 35%</li>
              <li>Predictable, sustainable income</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className={styles.section}>
        <h2>Transparency & Tracking</h2>

        <p>After each mission, you'll receive a breakdown like this:</p>

        <div className={styles.paymentBreakdown}>
          <div className={styles.breakdownHeader}>
            📊 Mission #47 Payment Breakdown
          </div>
          <div className={styles.breakdownBody}>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Mission:</span>
              <span className={styles.breakdownValue}>OpenAI chatbot integration</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Client paid:</span>
              <span className={styles.breakdownValue}>$600</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Date:</span>
              <span className={styles.breakdownValue}>2025-11-05</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>SOL price at payment:</span>
              <span className={styles.breakdownValue}>$180</span>
            </div>

            <div className={styles.breakdownSection}>YOUR EARNINGS:</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Kara:</span>
              <span className={styles.breakdownValue}>$90 (15%) = 0.5 SOL</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Reanance:</span>
              <span className={styles.breakdownValue}>$54 (9%) = 0.3 SOL</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Bigbosexf:</span>
              <span className={styles.breakdownValue}>$36 (6%) = 0.2 SOL</span>
            </div>

            <div className={styles.breakdownSection}>PAYMENT SENT:</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Kara's wallet:</span>
              <span className={styles.breakdownValue}>0.5 SOL (~$90) → 7xK9...</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Transaction ID:</span>
              <span className={styles.breakdownValue}>[Solscan link]</span>
            </div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Full transparency.</strong>
          <p>Every payment is visible on Solana blockchain. You can verify amounts, timing, and transaction fees.</p>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className={styles.section}>
        <h2>Key Takeaways</h2>
        <div className={styles.takeaways}>
          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>💰</div>
            <div className={styles.takeawayText}>
              <strong>Pure commission = aligned incentives</strong>
              <p>You earn when we deliver value. No busywork, no time tracking.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>⚡</div>
            <div className={styles.takeawayText}>
              <strong>Speed = higher effective $/hr</strong>
              <p>Deliver faster = same $ in less time = better hourly rate.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>✅</div>
            <div className={styles.takeawayText}>
              <strong>Quality gates protect everyone</strong>
              <p>Sofia catches bugs before client sees them. Better for reputation.</p>
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
              <p>Prove performance → increase % → add bonuses → scale.</p>
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
          We're committed to fair, transparent compensation that scales with the team.
        </p>
      </section>
    </main>
  );
}
