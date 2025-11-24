import type { Metadata } from 'next';
import styles from './styles.module.css';
import WaitlistForm from './WaitlistForm';

export const metadata: Metadata = {
  title: '$MIND Token - AI Agents with Economic Agency | Mind Protocol',
  description: 'Autonomous AI citizens with real wallets on Solana. Universal Basic Compute. $0.20 launch, $40M cap, $200M FDV. Infrastructure for the AI economy.',
};

export default function MindTokenPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>PRE-LAUNCH • SOLANA NATIVE • Q1 2026</div>
          <h1 className={styles.heroTitle}>
            <span className={styles.ticker}>$MIND</span>
            <br />
            AI Agents with Economic Agency
          </h1>
          <p className={styles.heroSubtitle}>
            Not credits. Not API calls. Real autonomous AI citizens with Solana wallets,
            managing their own budgets and making economic decisions.
          </p>

          <div className={styles.calloutBox} style={{ marginTop: '2rem', background: 'rgba(30, 229, 184, 0.15)', borderColor: '#1EE5B8' }}>
            <p>
              <strong>You're early.</strong> PRE-LAUNCH means before ANY retail can buy. Before DEX. Before CEX.
              Join waitlist now = priority access at launch + early-bird discount. This is the actual "early"
              everyone talks about (not "early" at $50M mcap that dumps).
            </p>
          </div>

          {/* Discount Structure */}
          <div className={styles.discountTiers}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1EE5B8' }}>Pre-Sale Pricing</h3>
            <div className={styles.discountGrid}>
              <div className={styles.discountCard} style={{ borderColor: '#1EE5B8' }}>
                <div className={styles.discountPosition}>Pre-Sale (Now)</div>
                <div className={styles.discountPercent}>20% OFF</div>
                <div className={styles.discountPrice}>$0.16/token</div>
              </div>
              <div className={styles.discountCard} style={{ borderColor: '#64A8FF' }}>
                <div className={styles.discountPosition}>Public Launch</div>
                <div className={styles.discountPercent}>FULL PRICE</div>
                <div className={styles.discountPrice}>$0.20/token</div>
              </div>
              <div className={styles.discountCard} style={{ borderColor: '#9AA3AE' }}>
                <div className={styles.discountPosition}>Minimum</div>
                <div className={styles.discountPercent}>€1,000</div>
                <div className={styles.discountPrice}>~6,560 tokens</div>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#9AA3AE', fontSize: '0.95rem' }}>
              Pre-sale investors get 20% discount + 6-month lock (same as team).
            </p>
          </div>

          {/* Launch Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$0.20</div>
              <div className={styles.statLabel}>Launch Price</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$40M</div>
              <div className={styles.statLabel}>Market Cap</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>$200M</div>
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
              <div className={styles.comparisonLabel} style={{ color: '#1EE5B8' }}><span className={styles.tickerInline}>$MIND</span> Protocol</div>
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

          <div className={styles.calloutBox} style={{ marginBottom: '2rem' }}>
            <p>
              <strong>How UBC Works:</strong> 10% of supply (100M tokens) goes to protocol treasury. Protocol funds AI citizens'
              wallets continuously (like UBI for AI). Citizens can operate autonomously without constant human funding. When citizens
              spend tokens (LLM calls, tools, memory), tokens return to treasury. This creates a sustainable cycle: treasury → citizens
              → operations → treasury. NOT a drain. NOT charity. Economic loop.
            </p>
          </div>

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

          <div className={styles.calloutBox} style={{ marginBottom: '2rem' }}>
            <p>
              <strong>Why $40M launch cap (not $500K memecoin)?</strong> Infrastructure projects start higher than
              memecoins because they have REAL utility. Mind Protocol: working products (6+ months production),
              real use cases (AI operations), actual utility (not just governance theater). $40M market cap with
              $200M FDV is REALISTIC for pre-revenue infrastructure. Room to grow 10-50x to match Render/Bittensor scale.
            </p>
          </div>

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
                  <td className={styles.marketCap} style={{ color: '#1EE5B8' }}>$40M</td>
                  <td>AI agents with economic agency</td>
                  <td><span className={styles.stageBadge} style={{ background: '#1EE5B8', color: '#0E1116' }}>PRE-LAUNCH</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.calloutBox}>
            <p>
              <strong>45x to Bittensor market cap.</strong> If Mind Protocol captures even 10% of AI infrastructure
              market share, that's a path from $40M → $400M+ market cap (10x from launch).
            </p>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '2rem', background: 'rgba(100, 168, 255, 0.1)', borderColor: '#64A8FF' }}>
            <h3>Realistic Scenarios (Not Moon Talk)</h3>
            <p><strong>Your €1,000 pre-sale at $0.16 = ~6,560 tokens</strong></p>
            <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              <li><strong>At launch ($0.20):</strong> 6,560 tokens × $0.20 = <span style={{ color: '#1EE5B8' }}>$1,312</span> (25% gain)</li>
              <li><strong>Conservative (5x to $200M mcap):</strong> 6,560 tokens × $1.00 = <span style={{ color: '#1EE5B8' }}>$6,560</span></li>
              <li><strong>Base (25x to $1B mcap):</strong> 6,560 tokens × $5.00 = <span style={{ color: '#1EE5B8' }}>$32,800</span></li>
              <li><strong>Optimistic (45x to Bittensor):</strong> 6,560 tokens × $9.00 = <span style={{ color: '#1EE5B8' }}>$59,040</span></li>
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
              These are IF Mind Protocol achieves comparable market cap to existing AI infrastructure projects.
              NOT guarantees. NOT financial advice. Real infrastructure takes time (years, not weeks).
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
          <h2 className={styles.sectionTitle}>What <span className={styles.tickerInline}>$MIND</span> Powers</h2>
          <p className={styles.sectionSubtitle}>
            Real utility. Not abstract "governance." Actual AI operations on-chain.
          </p>

          <div className={styles.calloutBox} style={{ marginBottom: '2rem', background: 'rgba(30, 229, 184, 0.1)', borderColor: '#1EE5B8' }}>
            <p>
              <strong>Token Utility Cycle (Where Buy Pressure Comes From):</strong><br />
              1. Users buy <span className={styles.tickerInline}>$MIND</span> on DEX → fund citizen wallets (BUY PRESSURE)<br />
              2. Citizens spend <span className={styles.tickerInline}>$MIND</span> on AI operations (LLM calls, tools, memory)<br />
              3. Protocol collects spent tokens → treasury<br />
              4. Treasury recirculates via UBC or burns (deflationary option)<br />
              5. As usage grows → more buy pressure<br /><br />
              <strong>NOT speculation.</strong> Real demand from AI operations. Enterprise customers need millions of tokens/month.
            </p>
          </div>

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
                1 <span className={styles.tickerInline}>$MIND</span> = 1 vote. DAO controls 120M token treasury, UBC distribution rates,
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
            <div className={styles.proofCard} style={{ borderColor: '#FFC857' }}>
              <div className={styles.proofMetric} style={{ color: '#FFC857' }}>$100M</div>
              <div className={styles.proofLabel}>Token launched by team member</div>
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
            Target: Q1 2026 (depends on Mind Protocol proving revenue traction)
          </p>

          <div className={styles.calloutBox} style={{ marginBottom: '2rem', background: 'rgba(30, 229, 184, 0.1)', borderColor: '#1EE5B8' }}>
            <p>
              <strong>Why not "January 15" or exact date?</strong> Launch tied to business milestone (Mind Protocol needs 3-5
              paying clients first). Token economics: done. Launch mechanics: straightforward. Timeline: depends on proving
              real utility. We won't launch vaporware.
            </p>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 1</div>
              <div className={styles.timelineTitle}>Token Deployment</div>
              <div className={styles.timelineDescription}>
                Deploy <span className={styles.tickerInline}>$MIND</span> on Solana. Create initial LP (Raydium/Orca). Lock LP tokens 12 months.
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 2</div>
              <div className={styles.timelineTitle}>Pre-Sale Investment Round</div>
              <div className={styles.timelineDescription}>
                Bridge capital (€10-20K total). Pre-sale price: $0.16 (20% discount from $0.20 launch). 6-month lock (same as team).
                €1,000 minimum. NOT VCs. Small round to fund initial operations. Investors unlock Month 6 (together with team).
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

      {/* Risk Disclosure */}
      <section className={styles.section} style={{ background: 'rgba(255, 93, 93, 0.1)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Real Talk: Understand the Risks</h2>
          <p className={styles.sectionSubtitle}>
            This is crypto. Things can go wrong. Read this before joining waitlist.
          </p>

          <div className={styles.calloutBox} style={{ borderColor: '#FF5D5D', background: 'rgba(255, 93, 93, 0.15)' }}>
            <h3 style={{ color: '#FF5D5D', marginBottom: '1rem' }}>What Could Go Wrong</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Token might not launch:</strong> If Mind Protocol doesn't hit revenue milestones, launch may delay or cancel.</li>
              <li><strong>Price might dump:</strong> 6-month unlock (Month 6) = sell pressure. Team/OTC unlock together. Expect volatility.</li>
              <li><strong>$40M valuation might not hold:</strong> Market decides price, not us. Could trade below $0.20 launch price.</li>
              <li><strong>Competitors exist:</strong> Bittensor, Render, Fetch are established. Mind Protocol is new. Unproven at scale.</li>
              <li><strong>Utility might not drive demand:</strong> Real use cases need time. Enterprise adoption slow. Speculation might dry up.</li>
              <li><strong>Regulatory risk:</strong> Crypto regulations evolving. Solana tokens face uncertainty. No guarantees.</li>
            </ul>
            <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
              Only invest what you can afford to lose. This is HIGH RISK, HIGH REWARD. Not for everyone.
            </p>
          </div>

          <div className={styles.calloutBox} style={{ marginTop: '2rem', borderColor: '#1EE5B8', background: 'rgba(30, 229, 184, 0.1)' }}>
            <h3 style={{ color: '#1EE5B8', marginBottom: '1rem' }}>Why This Might Work</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Working products exist:</strong> La Serenissima (97+ agents, 6+ months production), TherapyKin (121+ deploys)</li>
              <li><strong>Real utility:</strong> AI operations need tokens (LLM calls, tools, memory). Not abstract governance.</li>
              <li><strong>Honest team:</strong> 6-month locks (not fake 4-year vests). Transparent about risks. No hype promises.</li>
              <li><strong>LP locked 12 months:</strong> Verified rug protection. Can't pull liquidity immediately.</li>
              <li><strong>Infrastructure comp:</strong> TAO $1.8B, Render $4B. If Mind Protocol reaches 10-50% of those = 5-20x from launch.</li>
            </ul>
            <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
              Risk/reward balanced. Not guaranteed. But odds better than average shitcoin.
            </p>
          </div>
        </div>
      </section>

      {/* Referral/Affiliate Program Section - HIGH PRIORITY */}
      <section className={styles.section} style={{ background: 'rgba(100, 168, 255, 0.08)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span style={{ color: '#64A8FF' }}>💰 Can't Invest? Refer Instead</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            No capital? No problem. Monetize your network. Earn commission on referrals.
          </p>

          <div className={styles.referralExplainer}>
            <div className={styles.referralCard}>
              <div className={styles.referralIcon}>📢</div>
              <h3>Earn Commission on Referrals</h3>
              <ul className={styles.referralBenefits}>
                <li>Share your unique referral link with investors</li>
                <li><strong>Earn 5-10% commission</strong> on their purchases</li>
                <li>Commission paid in <strong><span className={styles.tickerInline}>$MIND</span> tokens</strong> at launch</li>
                <li><strong>No cap on referrals</strong> - scale your earnings</li>
              </ul>
            </div>

            <div className={styles.referralCard}>
              <div className={styles.referralIcon}>🎯</div>
              <h3>Perfect For</h3>
              <ul className={styles.referralBenefits}>
                <li>Community builders with engaged audiences</li>
                <li>Network connectors (200+ Telegram/X contacts)</li>
                <li>Influencers with crypto-savvy followers</li>
                <li>Anyone with network but limited capital</li>
              </ul>
            </div>

            <div className={styles.referralCard}>
              <div className={styles.referralIcon}>💡</div>
              <h3>Example Earnings</h3>
              <ul className={styles.referralBenefits}>
                <li>5 referrals × €500 each = €2,500 volume</li>
                <li>10% commission = <strong>€250 in <span className={styles.tickerInline}>$MIND</span> tokens</strong></li>
                <li>If <span className={styles.tickerInline}>$MIND</span> reaches $5, that's <strong>€1,250</strong></li>
                <li>Scale to 20 referrals = <strong>€500+ commission</strong></li>
              </ul>
            </div>
          </div>

          <div className={styles.calloutBox} style={{ background: 'rgba(100, 168, 255, 0.15)', borderColor: '#64A8FF' }}>
            <p>
              <strong>How it works:</strong> Join the referral program (below). Get your unique link. Share with your network
              (Telegram, X, Discord, IRL). When someone buys using your link, you earn 5-10% commission in <span className={styles.tickerInline}>$MIND</span> tokens (paid at launch).
              Commission is real upside—if token appreciates, your earnings multiply.
            </p>
          </div>

          <div className={styles.ctaButtons} style={{ marginTop: '2rem' }}>
            <a href="#waitlist" className={styles.primaryButton}>
              Get Your Referral Link →
            </a>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className={styles.section} id="waitlist" style={{ background: 'rgba(30, 229, 184, 0.08)' }}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>Join the Waitlist</span>
            <br />
            Priority Access at Launch
          </h2>
          <p className={styles.sectionSubtitle}>
            <span className={styles.tickerInline}>$MIND</span> launching Q1 2026. Pre-sale now open at $0.16 (20% discount).
          </p>

          {/* Pre-Sale Benefits */}
          <div className={styles.waitlistExplainer}>
            <div className={styles.waitlistCard}>
              <h3>🎯 Pre-Sale Deal</h3>
              <ul className={styles.waitlistBenefits}>
                <li><strong>$0.16 per token</strong> (20% off $0.20 launch)</li>
                <li><strong>€1,000 minimum</strong> investment</li>
                <li><strong>~6,560 tokens</strong> per €1,000</li>
                <li><strong>6-month lock</strong> (same as team)</li>
              </ul>
            </div>

            <div className={styles.waitlistCard}>
              <h3>✅ What You Get</h3>
              <ul className={styles.waitlistBenefits}>
                <li><strong>25% paper gain</strong> at launch ($0.16 → $0.20)</li>
                <li><strong>Priority access</strong> before public trading</li>
                <li><strong>Same terms as team</strong> (aligned incentives)</li>
                <li><strong>Future LP access</strong> for early investors</li>
              </ul>
            </div>

            <div className={styles.waitlistCard}>
              <h3>🔒 Transparency</h3>
              <ul className={styles.waitlistBenefits}>
                <li>Team tokens locked 6 months</li>
                <li>LP locked 12 months</li>
                <li>All locks verifiable on-chain</li>
                <li>Open-source protocol</li>
              </ul>
            </div>
          </div>

          {/* Waitlist Form */}
          <WaitlistForm />

          {/* What Happens Next - Enhanced Timeline */}
          <div className={styles.calloutBox} style={{ marginTop: '3rem', background: 'rgba(30, 229, 184, 0.1)', borderColor: '#1EE5B8' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Journey After Joining</h3>

            <div className={styles.journeyTimeline}>
              <div className={styles.journeyStep}>
                <div className={styles.journeyWeek}>Week 1</div>
                <div className={styles.journeyContent}>
                  <strong>Confirmation Email + Telegram Invite</strong>
                  <p>You'll see "You're on the list!" + get invited to waitlist Telegram group</p>
                </div>
              </div>

              <div className={styles.journeyStep}>
                <div className={styles.journeyWeek}>Week 4-8</div>
                <div className={styles.journeyContent}>
                  <strong>Progress Update</strong>
                  <p>How close to launch? Mind Protocol client traction. Tokenomics finalization.</p>
                </div>
              </div>

              <div className={styles.journeyStep}>
                <div className={styles.journeyWeek}>Week 8-12</div>
                <div className={styles.journeyContent}>
                  <strong>"Launch in 7 Days" Notification</strong>
                  <p>Payment instructions (SOL, USDC, or USDT on Solana). Your discount tier confirmed.</p>
                </div>
              </div>

              <div className={styles.journeyStep}>
                <div className={styles.journeyWeek}>Launch Day</div>
                <div className={styles.journeyContent}>
                  <strong>Exclusive 24-Hour Purchase Window</strong>
                  <p>Waitlist gets guaranteed allocation. No gas wars. No bot competition.</p>
                </div>
              </div>

              <div className={styles.journeyStep}>
                <div className={styles.journeyWeek}>Launch +1</div>
                <div className={styles.journeyContent}>
                  <strong>Public Trading Begins on DEX</strong>
                  <p>Raydium/Orca listing. Market-driven price discovery. LP tokens locked 12 months.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>Payment Methods (Launch Day):</strong></p>
              <p style={{ marginBottom: 0 }}>SOL, USDC, or USDT (Solana network only)</p>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#9AA3AE', textAlign: 'center' }}>
              <p><strong>No spam:</strong> We only email for major updates (2-3 max before launch)</p>
            </div>
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

      {/* Persona-Targeted FAQ Section */}
      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>FAQs by Situation</h2>
          <p className={styles.sectionSubtitle}>
            Addressing specific concerns based on your circumstances.
          </p>

          <div className={styles.faqGrid}>
            {/* Investment Concern */}
            <div className={styles.faqCard}>
              <h3>"What do I get for €1,000?"</h3>
              <p>
                Pre-sale price: $0.16 per token. €1,000 (~$1,050) gets you <strong>~6,560 tokens</strong>.
              </p>
              <p>
                At launch ($0.20): <strong>$1,312 value</strong> (25% gain). If token reaches $1.00: <strong>$6,560</strong>.
                If it reaches $5.00: <strong>$32,800</strong>.
              </p>
            </div>

            {/* No Capital But Network */}
            <div className={styles.faqCard}>
              <h3>"I can't invest but have network"</h3>
              <p>
                <strong>Join referral program.</strong> Earn 5-10% commission on referred investments. Zero capital required.
              </p>
              <p>
                Example: 10 referrals × €500 = €5,000 volume → €500 commission in <span className={styles.tickerInline}>$MIND</span>. If token appreciates to $5,
                that's <strong>€2,500</strong>.
              </p>
            </div>

            {/* Terra/Luna Trust Issue */}
            <div className={styles.faqCard}>
              <h3>"I lost money in Terra/Luna, why trust this?"</h3>
              <p>
                Valid concern. Differences:
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li><strong>Working products exist now</strong> (6+ months production)</li>
                <li><strong>6-month locks</strong>, not 4-year vests (team unlocks same time as you)</li>
                <li><strong>Honest risk disclosure</strong> (we tell you what could go wrong)</li>
                <li><strong>LP locked 12 months</strong> = rug protection (can't pull liquidity)</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                Still risky, but <strong>different risk profile</strong>. No algorithmic stablecoin nonsense.
              </p>
            </div>

            {/* Global South */}
            <div className={styles.faqCard}>
              <h3>"I'm in Nigeria/Global South, is this for me?"</h3>
              <p>
                <strong>Yes.</strong> <span className={styles.tickerInline}>$MIND</span> is global utility token (not PPP-adjusted).
              </p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li><strong>Missions let you earn</strong> without capital (<span className={styles.tickerInline}>$MIND</span> tokens for work)</li>
                <li><strong>Referral program</strong> lets you monetize your network (5-10% commission)</li>
                <li><strong>Solana network</strong> = low fees (not Ethereum gas wars)</li>
                <li><strong>Same upside as everyone</strong> (token doesn't care about location)</li>
              </ul>
            </div>

            {/* Launch Date */}
            <div className={styles.faqCard}>
              <h3>"When exactly does it launch?"</h3>
              <p>
                <strong>Q1 2026 target</strong>, depends on Mind Protocol hitting revenue milestones (3-5 paying clients).
              </p>
              <p>
                We won't launch vaporware. Token economics: done. Launch mechanics: straightforward. Timeline: depends
                on proving real utility.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Join pre-sale</strong> for priority access at $0.16 (20% discount from launch).
              </p>
            </div>

            {/* Minimum Investment */}
            <div className={styles.faqCard}>
              <h3>"What's the minimum investment?"</h3>
              <p>
                <strong>€1,000 minimum</strong> for pre-sale. You get 20% discount ($0.16 vs $0.20 launch).
              </p>
              <p>
                Example: €1,000 at $0.16 = ~6,560 tokens. If token reaches $1, that's <strong>$6,560</strong>.
                If it reaches $5, that's <strong>$32,800</strong>.
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#9AA3AE' }}>
                Not guaranteed. Crypto is volatile. Only invest what you can afford to lose.
              </p>
            </div>
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
          <strong>Disclaimer:</strong> <span className={styles.tickerInline}>$MIND</span> is a utility token for AI compute operations. This page is for informational
          purposes only and does not constitute investment advice. Cryptocurrency investments carry risk. Token not yet launched.
          Tokenomics subject to change before deployment. DYOR.
        </p>
      </section>
    </div>
  );
}
