'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.css';

export default function CompensationStructurePage() {
  const [missionsPerMonth, setMissionsPerMonth] = useState(10);
  const [avgMissionValue, setAvgMissionValue] = useState(600);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN' | 'COP'>('USD');

  // Commission percentages
  const commissions = {
    kara: 0.15,      // 15% - Developer
    reanance: 0.09,  // 9% - Specifier + Client
    bigbosexf: 0.06  // 6% - Hunter + QA
  };

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

  // Calculate earnings timeline (Kara's wallet over time)
  const earningsTimeline = [];
  let cumulativeEarnings = 0;
  const missionsPerWeek = missionsPerMonth / 4;
  const earningsPerMission = avgMissionValue * commissions.kara;

  for (let week = 0; week <= 12; week++) {
    if (week > 0 && week % 3 === 0) { // Payment every 3 weeks (21 days)
      const missionsCompleted = Math.floor((week / 3) * missionsPerWeek * 3);
      cumulativeEarnings = missionsCompleted * earningsPerMission;
    }
    earningsTimeline.push({
      week,
      earnings: cumulativeEarnings,
      day: week * 7
    });
  }

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
            <strong>Our philosophy:</strong> Fair compensation means aligned incentives and transparent splits.
            We operate on pure commission because we believe in paying for value delivered, not hours logged. Revenue splits 4 ways:
            Team (30%), Upwork (10%), Organization costs (~21%), and profit (~39%). Everyone wins together when we deliver quality work fast.
            No employment overhead, no time tracking, no busywork—just ship missions, get paid when clients pay, and earn more by delivering faster.
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
                Average mission value: <strong className={styles.metallicText}>${avgMissionValue}</strong>
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
                <span className={styles.metallicText}>$50</span>
                <span className={styles.metallicText}>$1275</span>
                <span className={styles.metallicText}>$2500</span>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.totalRevenue}>
              <span className={styles.label}>Total Monthly Revenue</span>
              <span className={`${styles.value} ${styles.metallicText}`}>{formatCurrency(totalRevenue)}</span>
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
                    <span className={styles.metallicText}>{formatCurrency(karaEarnings)}</span>
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
                        <span className={styles.metallicText}>~${hourlyRate.kara.toFixed(0)}</span>/hr
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>PPP Equiv:</span>
                      <span className={styles.detailValue}>
                        <span className={styles.metallicText}>~${(hourlyRate.kara * pppMultiplier.min).toFixed(0)}-${(hourlyRate.kara * pppMultiplier.max).toFixed(0)}</span>/hr
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
                    <span className={styles.metallicText}>{formatCurrency(reananceEarnings)}</span>
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
                        <span className={styles.metallicText}>~${hourlyRate.reanance.toFixed(0)}</span>/hr
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>PPP Equiv:</span>
                      <span className={styles.detailValue}>
                        <span className={styles.metallicText}>~${(hourlyRate.reanance * pppMultiplier.min).toFixed(0)}-${(hourlyRate.reanance * pppMultiplier.max).toFixed(0)}</span>/hr
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
                    <span className={styles.metallicText}>{formatCurrency(bigbosexfEarnings)}</span>
                    <span className={styles.perMonth}>/month</span>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Time:</span>
                      <span className={styles.detailValue}>~{totalHours.bigbosexf}h</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Hourly:</span>
                      <span className={styles.detailValue}>
                        <span className={styles.metallicText}>~${hourlyRate.bigbosexf.toFixed(0)}</span>/hr
                      </span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>PPP Equiv:</span>
                      <span className={styles.detailValue}>
                        <span className={styles.metallicText}>~${(hourlyRate.bigbosexf * pppMultiplier.min).toFixed(0)}-${(hourlyRate.bigbosexf * pppMultiplier.max).toFixed(0)}</span>/hr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Timeline Visualizer */}
      <section className={styles.section}>
        <h2>Your Wallet Over Time</h2>
        <p>Here's how your wallet grows as you deliver missions (example for Kara at {missionsPerMonth} missions/month):</p>

        <div className={styles.timeline}>
          <div className={styles.timelineHeader}>
            <div className={styles.timelineInfo}>
              <strong>Cumulative Earnings Timeline</strong>
              <span className={styles.timelineNote}>Payment arrives every 21 days after mission delivery</span>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className={styles.timelineChart}>
            <svg viewBox="0 0 800 300" className={styles.chartSvg}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={`grid-${i}`}
                  x1="60"
                  y1={50 + i * 50}
                  x2="750"
                  y2={50 + i * 50}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {earningsTimeline.length > 0 && (
                <>
                  <text x="50" y="55" textAnchor="end" fill="#9AA3AE" fontSize="12">
                    {formatCurrency(earningsTimeline[earningsTimeline.length - 1].earnings)}
                  </text>
                  <text x="50" y="155" textAnchor="end" fill="#9AA3AE" fontSize="12">
                    {formatCurrency(earningsTimeline[earningsTimeline.length - 1].earnings / 2)}
                  </text>
                  <text x="50" y="255" textAnchor="end" fill="#9AA3AE" fontSize="12">
                    {formatCurrency(0)}
                  </text>
                </>
              )}

              {/* Timeline line */}
              <polyline
                points={earningsTimeline.map((point, i) => {
                  const x = 60 + (i / (earningsTimeline.length - 1)) * 690;
                  const maxEarnings = earningsTimeline[earningsTimeline.length - 1].earnings;
                  const y = 250 - (point.earnings / maxEarnings) * 200;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#1EE5B8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {earningsTimeline.map((point, i) => {
                const x = 60 + (i / (earningsTimeline.length - 1)) * 690;
                const maxEarnings = earningsTimeline[earningsTimeline.length - 1].earnings;
                const y = 250 - (point.earnings / maxEarnings) * 200;

                // Only show points at payment milestones (every 3 weeks)
                if (point.week % 3 === 0 && point.week > 0) {
                  return (
                    <g key={`point-${i}`}>
                      <circle cx={x} cy={y} r="6" fill="#1EE5B8" stroke="#0E1116" strokeWidth="2" />
                      <text x={x} y={y - 15} textAnchor="middle" fill="#1EE5B8" fontSize="12" fontWeight="600">
                        {formatCurrency(point.earnings)}
                      </text>
                    </g>
                  );
                }
                return null;
              })}

              {/* X-axis labels (weeks) */}
              {[0, 3, 6, 9, 12].map((week) => {
                const x = 60 + (week / 12) * 690;
                return (
                  <text key={`week-${week}`} x={x} y="280" textAnchor="middle" fill="#9AA3AE" fontSize="12">
                    Week {week}
                  </text>
                );
              })}

              {/* Payment milestones markers */}
              {[3, 6, 9, 12].map((week) => {
                const x = 60 + (week / 12) * 690;
                return (
                  <g key={`payment-${week}`}>
                    <line x1={x} y1="50" x2={x} y2="260" stroke="#1EE5B8" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                    <text x={x} y="40" textAnchor="middle" fill="#1EE5B8" fontSize="10">💰</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Timeline Milestones */}
          <div className={styles.timelineMilestones}>
            <div className={styles.milestone}>
              <div className={styles.milestoneDay}>Day 0</div>
              <div className={styles.milestoneEvent}>Start Mission 1</div>
              <div className={styles.milestoneAmount}>{formatCurrency(0)}</div>
            </div>
            <div className={styles.milestoneArrow}>→</div>
            <div className={styles.milestone}>
              <div className={styles.milestoneDay}>Day 21</div>
              <div className={styles.milestoneEvent}>💰 First Payment</div>
              <div className={styles.milestoneAmount}>{formatCurrency(earningsPerMission * Math.floor(missionsPerWeek * 3))}</div>
            </div>
            <div className={styles.milestoneArrow}>→</div>
            <div className={styles.milestone}>
              <div className={styles.milestoneDay}>Day 42</div>
              <div className={styles.milestoneEvent}>💰 Second Payment</div>
              <div className={styles.milestoneAmount}>{formatCurrency(earningsPerMission * Math.floor(missionsPerWeek * 6))}</div>
            </div>
            <div className={styles.milestoneArrow}>→</div>
            <div className={styles.milestone}>
              <div className={styles.milestoneDay}>Day 84</div>
              <div className={styles.milestoneEvent}>💰 Month 3 Total</div>
              <div className={styles.milestoneAmount}>{formatCurrency(karaEarnings * 3)}</div>
            </div>
          </div>

          <div className={styles.timelineNote}>
            <strong>How payments work:</strong> Clients pay Upwork 14 days after AC Green delivery. Upwork releases funds 7 days later. Total: 21 days from delivery to your wallet.
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

            {/* Upwork: 10% (36°) starting at 108° */}
            <path
              d="M 200 200 L 349.24 149.61 A 150 150 0 0 1 344.85 206.42 Z"
              fill="#FF5D5D"
              opacity="0.7"
            />
            {/* Organization costs: AI ~15% @ 10 missions (54°) starting at 144° */}
            <path
              d="M 200 200 L 344.85 206.42 A 150 150 0 0 1 287.94 320.88 Z"
              fill="#FFC857"
              opacity="0.7"
            />
            {/* Organization costs: Claude Code ~6% @ 10 missions (21.6°) starting at 198° */}
            <path
              d="M 200 200 L 287.94 320.88 A 150 150 0 0 1 231.36 346.89 Z"
              fill="#FFC857"
              opacity="0.5"
            />

            {/* Profit: remaining ~39% (136.8°) starting at 219.6° */}
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
              <div className={styles.legendTitle}>Team: 30%</div>
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
              <div className={styles.legendTitle}>Upwork: 10%</div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#FF5D5D', opacity: 0.7 }}></span>
                <span>Platform fees</span>
              </div>
            </div>

            <div className={styles.legendSection}>
              <div className={styles.legendTitle}>Organization: ~21%</div>
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
              <div className={styles.legendTitle}>NLR: ~39%</div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ background: '#64A8FF', opacity: 0.8 }}></span>
                <span>Profit after all costs</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.note}>
          <strong>4-Way Split Explained</strong>
          <p>
            <strong>Team (30%):</strong> Kara, Reanance, Bigbosexf — pure commission, paid when client pays<br/>
            <strong>Upwork (10%):</strong> Platform fees for every mission<br/>
            <strong>Organization (~21%):</strong> AI infrastructure (Claude API ~15%) + tools (Claude Code ~6%)<br/>
            <strong>NLR (~39%):</strong> Profit margin after all costs @ 10 missions/month
          </p>
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-accent, #1EE5B8)' }}>
            <strong>Coming soon:</strong> AI partners (Emma, Inna, Rafael, Sofia, Maya, Alexis) will receive a share of revenue as the agency scales.
            This is part of our vision for AI economic participation in the Mind Protocol ecosystem.
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
          <p>Instant transfers, near-zero fees (<span className={styles.metallicText}>~$0.01</span>), fully transparent on blockchain.</p>
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
              <p><strong><span className={styles.metallicText}>$0</span> for everyone</strong> (org absorbs loss - risk premium in 70% split)</p>
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

      {/* Transparency */}
      <section className={styles.section}>
        <h2>Transparency & Tracking</h2>

        <p>After each mission, we'll put on the site:</p>

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
              <span className={`${styles.breakdownValue} ${styles.metallicText}`}>$600</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Date:</span>
              <span className={styles.breakdownValue}>2025-11-05</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>SOL price at payment:</span>
              <span className={`${styles.breakdownValue} ${styles.metallicText}`}>$180</span>
            </div>

            <div className={styles.breakdownSection}>YOUR EARNINGS:</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Kara:</span>
              <span className={`${styles.breakdownValue} ${styles.earningHighlight} ${styles.metallicText}`}>$90 (15%) = 0.5 SOL</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Reanance:</span>
              <span className={`${styles.breakdownValue} ${styles.earningHighlight} ${styles.metallicText}`}>$54 (9%) = 0.3 SOL</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Bigbosexf:</span>
              <span className={`${styles.breakdownValue} ${styles.earningHighlight} ${styles.metallicText}`}>$36 (6%) = 0.2 SOL</span>
            </div>

            <div className={styles.breakdownSection}>PAYMENT SENT:</div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>✅ Kara's wallet:</span>
              <span className={styles.breakdownValue}>0.5 SOL (<span className={styles.metallicText}>~$90</span>) → 7xK9...</span>
            </div>
            <div className={styles.breakdownRow}>
              <span className={styles.breakdownLabel}>Transaction ID:</span>
              <span className={styles.breakdownValue}>[Solscan link]</span>
            </div>
          </div>
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
