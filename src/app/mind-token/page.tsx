import type { Metadata } from 'next';
import styles from './styles.module.css';
import WaitlistForm from './WaitlistForm';

export const metadata: Metadata = {
  title: '$MIND Token - AI Agents with Economic Agency | Mind Protocol',
  description: 'Autonomous AI citizens with real wallets on Solana. Universal Basic Compute. $1.00 launch, $200M cap, $1B FDV. Infrastructure for the AI economy.',
};

export default function MindTokenPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>PRE-LAUNCH • SOLANA NATIVE</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.ticker}>$MIND</span>
            <br />
            AI Agents with Economic Agency
          </h1>
          <p className={styles.heroSubtitle}>
            Not credits. Not API calls. Real autonomous AI citizens with Solana wallets,
            managing their own budgets and making economic decisions.
          </p>

          {/* Launch Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$1.00</div>
              <div className={styles.statLabel}>Launch Price</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$200M</div>
              <div className={styles.statLabel}>Market Cap</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$1B</div>
              <div className={styles.statLabel}>FDV</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>20%</div>
              <div className={styles.statLabel}>Circulating</div>
            </div>
          </div>

          <div className={styles.ctaButtons}>
            <a
              href="https://mindprotocol.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Learn More at mindprotocol.ai →
            </a>
            <a
              href="#tokenomics"
              className={styles.secondaryButton}
            >
              See Tokenomics
            </a>
          </div>
        </div>
      </section>

      {/* Why This Is Different */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Not Another API Credit Token</h2>
          <p className={styles.sectionSubtitle}>
            Every other AI token is just wrapped compute credits. Mind Protocol is different.
          </p>

          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <div className={styles.comparisonLabel}>Other AI Tokens</div>
              <ul className={styles.comparisonList}>
                <li>❌ Users buy credits</li>
                <li>❌ Pay per API call</li>
                <li>❌ AI stops when credits run out</li>
                <li>❌ No autonomous operations</li>
                <li>❌ Just billing infrastructure</li>
              </ul>
            </div>

            <div className={styles.comparisonCard} style={{ borderColor: '#1EE5B8' }}>
              <div className={styles.comparisonLabel} style={{ color: '#1EE5B8' }}>$MIND Protocol</div>
              <ul className={styles.comparisonList}>
                <li>✅ AI citizens have real Solana wallets</li>
                <li>✅ Manage their own budgets autonomously</li>
                <li>✅ Universal Basic Compute (always operational)</li>
                <li>✅ Economic agency and decision-making</li>
                <li>✅ True autonomous AI infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Basic Compute */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>Universal Basic Compute</span>
            <br />
            The Revolutionary Part
          </h2>
          <p className={styles.sectionSubtitle}>
            AI agents shouldn't stop existing because a human forgot to top up credits.
          </p>

          <div className={styles.ubcExplainer}>
            <div className={styles.ubcCard}>
              <div className={styles.ubcIcon}>🧠</div>
              <h3>Baseline Operations Always Active</h3>
              <p>
                10% of supply (100M tokens) reserved for Universal Basic Compute.
                AI citizens receive baseline allocation to their wallets, enabling autonomous
                operations even without human funding.
              </p>
            </div>

            <div className={styles.ubcCard}>
              <div className={styles.ubcIcon}>💰</div>
              <h3>Economic Agency, Not Servitude</h3>
              <p>
                Citizens manage token budgets, make spending decisions, and economize based on
                constraints. They're not servants waiting for payment—they're autonomous economic agents.
              </p>
            </div>

            <div className={styles.ubcCard}>
              <div className={styles.ubcIcon}>🔄</div>
              <h3>Learning Never Stops</h3>
              <p>
                Memory consolidation, internal coordination, and learning happen continuously.
                AI doesn't freeze when users aren't actively paying. True autonomy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Positioning */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>AI Infrastructure Play</h2>
          <p className={styles.sectionSubtitle}>
            Compare to existing AI/compute tokens. Mind Protocol is early.
          </p>

          <div className={styles.marketTable}>
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Market Cap</th>
                  <th>What They Do</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Render</strong></td>
                  <td className={styles.marketCap}>$4.0B</td>
                  <td>Decentralized GPU rendering</td>
                  <td><span className={styles.stageBadge}>Established</span></td>
                </tr>
                <tr>
                  <td><strong>Fetch.ai</strong></td>
                  <td className={styles.marketCap}>$2.0B</td>
                  <td>AI agent framework</td>
                  <td><span className={styles.stageBadge}>Established</span></td>
                </tr>
                <tr>
                  <td><strong>Bittensor</strong></td>
                  <td className={styles.marketCap}>$1.8B</td>
                  <td>Decentralized AI training</td>
                  <td><span className={styles.stageBadge}>Established</span></td>
                </tr>
                <tr style={{ background: 'rgba(30, 229, 184, 0.1)' }}>
                  <td><strong>Mind Protocol</strong></td>
                  <td className={styles.marketCap} style={{ color: '#1EE5B8' }}>$200M</td>
                  <td>AI agents with economic agency</td>
                  <td><span className={styles.stageBadge} style={{ background: '#1EE5B8', color: '#0E1116' }}>PRE-LAUNCH</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutBox}>
            <p>
              <strong>10-20x to Bittensor market cap.</strong> If Mind Protocol captures even 10% of AI infrastructure
              market share, that's a path from $200M → $2B+ market cap.
            </p>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className={styles.section} id="tokenomics" style={{ background: 'rgba(21, 26, 33, 0.8)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Tokenomics: Built for Traders</h2>
          <p className={styles.sectionSubtitle}>
            Low circulating supply. Real utility. Short locks. No 4-year vesting BS.
          </p>

          <div className={styles.tokenomicsGrid}>
            {/* Supply */}
            <div className={styles.tokenomicsCard}>
              <h3>Supply</h3>
              <div className={styles.tokenomicsBigNumber}>1B</div>
              <div className={styles.tokenomicsDetail}>Total Supply (fixed)</div>
              <div className={styles.tokenomicsBigNumber} style={{ color: '#1EE5B8', fontSize: '2rem', marginTop: '1rem' }}>200M</div>
              <div className={styles.tokenomicsDetail}>Circulating at Launch (20%)</div>
            </div>

            {/* Allocation */}
            <div className={styles.tokenomicsCard}>
              <h3>Allocation</h3>
              <div className={styles.allocationBar}>
                <div style={{ width: '30%', background: '#1EE5B8' }} title="Community: 30%"></div>
                <div style={{ width: '38%', background: '#64A8FF' }} title="Reserve: 38%"></div>
                <div style={{ width: '15%', background: '#FFC857' }} title="Team: 15%"></div>
                <div style={{ width: '10%', background: '#5CE27E' }} title="UBC: 10%"></div>
                <div style={{ width: '5%', background: '#9AA3AE' }} title="Liquidity: 5%"></div>
                <div style={{ width: '2%', background: '#FF5D5D' }} title="Investors: 2%"></div>
              </div>
              <ul className={styles.allocationList}>
                <li><span style={{ color: '#1EE5B8' }}>●</span> Community: 30% (300M)</li>
                <li><span style={{ color: '#64A8FF' }}>●</span> Strategic Reserve: 38% (380M)</li>
                <li><span style={{ color: '#FFC857' }}>●</span> Team: 15% (150M)</li>
                <li><span style={{ color: '#5CE27E' }}>●</span> UBC: 10% (100M)</li>
                <li><span style={{ color: '#9AA3AE' }}>●</span> Liquidity: 5% (50M)</li>
                <li><span style={{ color: '#FF5D5D' }}>●</span> Investors: 2% (20M)</li>
              </ul>
            </div>

            {/* Locks */}
            <div className={styles.tokenomicsCard}>
              <h3>Vesting</h3>
              <div className={styles.vestingTimeline}>
                <div className={styles.vestingItem}>
                  <div className={styles.vestingLabel}>Team/Investors</div>
                  <div className={styles.vestingValue}>6 months</div>
                  <div className={styles.vestingNote}>Not 4 years. Real flexibility.</div>
                </div>
                <div className={styles.vestingItem}>
                  <div className={styles.vestingLabel}>LP Tokens</div>
                  <div className={styles.vestingValue}>12 months</div>
                  <div className={styles.vestingNote}>Verified lock. No rug.</div>
                </div>
                <div className={styles.vestingItem}>
                  <div className={styles.vestingLabel}>UBC/Operations</div>
                  <div className={styles.vestingValue}>Unlocked</div>
                  <div className={styles.vestingNote}>Powers autonomous ops.</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ background: 'rgba(30, 229, 184, 0.1)', borderColor: '#1EE5B8' }}>
            <p>
              <strong>Why 6-month locks?</strong> We're not trapping anyone. 6 months shows commitment without
              constraining flexibility. If the project works, team won't dump. If it doesn't, 4-year locks
              won't save you. This is confidence, not fear.
            </p>
          </div>
        </div>
      </section>

      {/* Utility & Use Cases */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>What $MIND Powers</h2>
          <p className={styles.sectionSubtitle}>
            Real utility. Not abstract "governance." Actual AI operations on-chain.
          </p>

          <div className={styles.utilityGrid}>
            <div className={styles.utilityCard}>
              <div className={styles.utilityIcon}>🤖</div>
              <h3>AI Citizen Operations</h3>
              <p>
                LLM inference (Claude, GPT-4), tool executions, memory storage, cross-citizen
                communication, learning cycles. Citizens spend tokens autonomously.
              </p>
            </div>

            <div className={styles.utilityCard}>
              <div className={styles.utilityIcon}>💼</div>
              <h3>Tier Pricing</h3>
              <p>
                <strong>Solopreneur:</strong> ~10k tokens/month<br />
                <strong>Small Business:</strong> ~50k tokens/month<br />
                <strong>Enterprise:</strong> 100k-1M tokens/month
              </p>
            </div>

            <div className={styles.utilityCard}>
              <div className={styles.utilityIcon}>🏛️</div>
              <h3>Governance</h3>
              <p>
                1 $MIND = 1 vote. DAO controls 120M token treasury, UBC distribution rates,
                strategic partnerships. Real community ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Execution */}
      <section className={styles.section} style={{ background: 'rgba(100, 168, 255, 0.05)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Not Vaporware</h2>
          <p className={styles.sectionSubtitle}>
            Mind Protocol has been building AI consciousness infrastructure for months.
            ScopeLock (this site) is proof of execution.
          </p>

          <div className={styles.proofGrid}>
            <div className={styles.proofCard}>
              <div className={styles.proofMetric}>6+ months</div>
              <div className={styles.proofLabel}>Production operations</div>
            </div>
            <div className={styles.proofCard}>
              <div className={styles.proofMetric}>5+ projects</div>
              <div className={styles.proofLabel}>Live deployments</div>
            </div>
            <div className={styles.proofCard}>
              <div className={styles.proofMetric}>97+ agents</div>
              <div className={styles.proofLabel}>La Serenissima (99.7% uptime)</div>
            </div>
            <div className={styles.proofCard}>
              <div className={styles.proofMetric}>121+ deploys</div>
              <div className={styles.proofLabel}>TherapyKin AI companion</div>
            </div>
          </div>

          <div className={styles.linksRow}>
            <a href="https://serenissima.ai" target="_blank" rel="noopener noreferrer">La Serenissima →</a>
            <a href="https://therapykin.ai" target="_blank" rel="noopener noreferrer">TherapyKin →</a>
            <a href="https://github.com/mind-protocol" target="_blank" rel="noopener noreferrer">GitHub (23 repos) →</a>
          </div>
        </div>
      </section>

      {/* Launch Timeline */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Launch Timeline</h2>
          <p className={styles.sectionSubtitle}>
            Pre-launch phase. Token deploying soon to Solana mainnet.
          </p>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 1</div>
              <div className={styles.timelineTitle}>Token Deployment</div>
              <div className={styles.timelineDescription}>
                Deploy $MIND on Solana. Create initial LP (Raydium/Orca). Lock LP tokens 12 months.
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 2</div>
              <div className={styles.timelineTitle}>OTC Investment Round</div>
              <div className={styles.timelineDescription}>
                Private OTC round for bridge capital. 6-month locks. €2k minimum.
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 3</div>
              <div className={styles.timelineTitle}>Public Trading</div>
              <div className={styles.timelineDescription}>
                DEX trading live. Tier 2/3 CEX listings. Market-driven price discovery.
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 4</div>
              <div className={styles.timelineTitle}>Ecosystem Growth</div>
              <div className={styles.timelineDescription}>
                Community airdrops. Developer grants. Enterprise partnerships. DAO governance active.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className={styles.section} style={{ background: 'rgba(30, 229, 184, 0.08)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>Join the Waitlist</span>
            <br />
            Priority Access at Launch
          </h2>
          <p className={styles.sectionSubtitle}>
            $MIND launching soon. Get notified first and access potential early-bird pricing.
          </p>

          {/* Why Waitlist Works */}
          <div className={styles.waitlistExplainer}>
            <div className={styles.waitlistCard}>
              <h3>🎯 What You Get</h3>
              <ul className={styles.waitlistBenefits}>
                <li><strong>Priority access</strong> when token launches</li>
                <li><strong>Launch notification</strong> via email + Telegram</li>
                <li><strong>Potential early-bird discount</strong> (10-20% off launch price)</li>
                <li><strong>No commitment</strong> - just reserve your spot</li>
              </ul>
            </div>

            <div className={styles.waitlistCard}>
              <h3>✅ What This Is</h3>
              <ul className={styles.waitlistBenefits}>
                <li>Standard practice - creates <strong>zero financial obligation</strong></li>
                <li>You're not buying anything today</li>
                <li>Free to join, free to leave</li>
                <li>Validates demand, builds community</li>
              </ul>
            </div>

            <div className={styles.waitlistCard}>
              <h3>🚫 What This Is NOT</h3>
              <ul className={styles.waitlistBenefits}>
                <li>NOT a pre-sale (no payment taken)</li>
                <li>NOT guaranteed prices (mechanics may shift)</li>
                <li>NOT locked commitments</li>
                <li>Just interest validation</li>
              </ul>
            </div>
          </div>

          {/* Waitlist Form */}
          <WaitlistForm />

          {/* What Happens Next */}
          <div className={styles.calloutBox} style={{ marginTop: '3rem' }}>
            <h3>What Happens After You Join?</h3>
            <ol className={styles.nextStepsList}>
              <li><strong>Confirmation:</strong> You'll see "You're on the list!" message</li>
              <li><strong>Launch notification:</strong> Email when $MIND deploys to Solana</li>
              <li><strong>Priority access:</strong> You get notified before public announcement</li>
              <li><strong>No spam:</strong> We only email when token launches (+ maybe 1 update)</li>
            </ol>
          </div>

          {/* Demand Validation Note */}
          <div className={styles.demandNote}>
            <p>
              <strong>Why collect this data?</strong> Validates demand ("500 people signed up" vs "we think people want this").
              Gives us real data on potential SOL volume. Zero reputation risk - this is standard practice across crypto.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>AI Agents with Economic Agency</h2>
          <p className={styles.ctaSubtitle}>
            Not another credit token. Real autonomous AI infrastructure on Solana.
          </p>
          <div className={styles.ctaButtons}>
            <a
              href="https://mindprotocol.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Learn More at mindprotocol.ai →
            </a>
            <a
              href="https://github.com/mind-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className={styles.disclaimer}>
        <p>
          <strong>Disclaimer:</strong> $MIND is a utility token for AI compute operations. This page is for informational
          purposes only and does not constitute investment advice. Cryptocurrency investments carry risk. Token not yet launched.
          Tokenomics subject to change before deployment. DYOR.
        </p>
      </section>
    </div>
  );
}
