'use client';

import Link from 'next/link';
import styles from './styles.module.css';

export default function MissionsPage() {
  return (
    <main className={styles.missionsPage}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>🎮 Missions: Side Quests for $MIND Token Upside</h1>
        <div className={styles.meta}>
          <time>Nov 21, 2025</time>
          <span>•</span>
          <span>10 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #4</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "Missions are optional bonus work. Complete them to earn $MIND tokens. If the protocol gains traction, early contributors benefit from token upside."
        </p>
        <p>
          Your main income comes from <strong>Jobs</strong> (Upwork client work → 30% team pool in dollars). Missions are completely separate: optional side quests that earn you $MIND tokens (launching at $1.00 per token).
        </p>
        <p>
          Think of it like this: Jobs pay your rent. Missions build potential equity. Focus on jobs first, grab missions when you have time.
        </p>
      </section>

      {/* What Are Missions */}
      <section className={styles.section}>
        <h2>What Are Missions?</h2>
        <p>
          Missions are specific tasks that help ScopeLock grow. They&apos;re not client work—they&apos;re business development, recruiting, content creation, and community building. Each mission has a fixed $MIND reward.
        </p>

        <div className={styles.missionCards}>
          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>📝 Write Upwork Proposal</div>
              <div className={styles.missionReward}>1 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Draft and submit a proposal for an Upwork job posting. Submit proof (screenshot of sent proposal).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>👥 Recruit New Team Member</div>
              <div className={styles.missionReward}>10 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Bring someone onto the team who completes their first paid job. Submit proof (new member&apos;s username).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>🐦 Post About ScopeLock on X</div>
              <div className={styles.missionReward}>2 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Create and publish a post about ScopeLock on X (Twitter). Submit proof (link to post).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>🎯 Find Prospect in Telegram</div>
              <div className={styles.missionReward}>1 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Browse your Telegram contacts and identify someone who could use ScopeLock&apos;s services. Share our value prop. Submit proof (screenshot of outreach).
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Content Missions (Can Batch Offline)</h3>
        <div className={styles.missionCards}>
          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>🧵 Write X Thread About AI Agents</div>
              <div className={styles.missionReward}>5 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Write 10-tweet thread about AI agents, ScopeLock process, or AI-human partnership. Draft offline, post when internet returns. Submit proof (screenshot of thread).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>📊 Create Carousel Post Explaining ScopeLock</div>
              <div className={styles.missionReward}>3 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Design 5-slide carousel showing ScopeLock process (use Canva free). Export and post to X or LinkedIn. Submit proof (link to post).
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Design Missions (Free Tools)</h3>
        <div className={styles.missionCards}>
          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>🎨 Design Social Media Template Pack</div>
              <div className={styles.missionReward}>5 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Create 3 branded social media templates team can reuse (use Canva). Include: quote template, announcement template, portfolio showcase. Submit proof (exported files).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>⚡ Create 90s Delivery Process Explainer Graphic</div>
              <div className={styles.missionReward}>3 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Design simple infographic showing ScopeLock&apos;s 90-second Evidence Sprint process. Visual content for social media. Submit proof (exported graphic).
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Testing & Feedback Missions (Mobile-Friendly)</h3>
        <div className={styles.missionCards}>
          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>📱 Test Mission Deck on Mobile & Report Bugs</div>
              <div className={styles.missionReward}>2 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Use Mission Deck on your phone, find UI/UX issues or bugs. Document with screenshots and clear steps to reproduce. Submit proof (bug report).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>🐛 Try to Break AI Citizens Workflow</div>
              <div className={styles.missionReward}>3 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Intentionally test edge cases and unusual inputs with Rafael/Sofia/Emma. Document any issues, errors, or confusing responses. Submit proof (screenshots + description).
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Market Research & Sales Enablement</h3>
        <div className={styles.missionCards}>
          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>💬 Document Common Client Objections & Responses</div>
              <div className={styles.missionReward}>3 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Create sales enablement doc: 5 common objections you hear ("Too expensive", "AI isn&apos;t reliable", etc.) with proven responses. Submit proof (document).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>🌍 African Market Research Report</div>
              <div className={styles.missionReward}>5 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Document local market insights: common tech needs, budget ranges, payment preferences, communication style. 500+ words. Submit proof (report).
            </p>
          </div>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Quick Micro-Missions (5-10 Minutes)</h3>
        <div className={styles.missionCards}>
          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>💬 Engage With ScopeLock Team Posts</div>
              <div className={styles.missionReward}>1 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Comment meaningfully on 3 ScopeLock team posts (X, LinkedIn, etc.). Boost engagement, add value. Submit proof (screenshots of comments).
            </p>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionHeader}>
              <div className={styles.missionTitle}>⭐ Leave Authentic Review on Relevant Platform</div>
              <div className={styles.missionReward}>2 $MIND</div>
            </div>
            <p className={styles.missionDescription}>
              Share honest experience working with ScopeLock on Trustpilot, ProductHunt, or relevant review site. Submit proof (link to review).
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section}>
        <h2>How It Works</h2>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <strong>Browse available missions</strong>
              <p>Go to <a href="https://scopelock.mindprotocol.ai/mission-deck/" target="_blank" rel="noopener noreferrer">scopelock.mindprotocol.ai/mission-deck</a> and see what&apos;s available.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <strong>Claim a mission</strong>
              <p>Click "Claim Mission" on one you want to do. You&apos;ll have 7 days to complete it. First time? You&apos;ll connect your wallet here.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <strong>Complete the work</strong>
              <p>Do the actual task (write proposal, recruit someone, post content, etc.). Work offline if needed.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <strong>Submit proof</strong>
              <p>Upload screenshot, link, or whatever proof the mission requires. System verifies and allocates tokens.</p>
            </div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <strong>First-time wallet setup:</strong> When you claim your first mission, you&apos;ll be prompted to connect a Solana wallet (we recommend Phantom or MetaMask). This is where your $MIND tokens get sent. Takes 60 seconds.
        </div>
      </section>

      {/* Jobs vs Missions */}
      <section className={styles.section}>
        <h2>Jobs vs. Missions: What&apos;s The Difference?</h2>

        <div className={styles.comparison}>
          <div className={styles.comparisonBox} style={{ borderColor: 'var(--color-accent, #1EE5B8)' }}>
            <h3 className={styles.comparisonTitle}>💰 JOBS (Main Income)</h3>
            <ul>
              <li>Upwork client work</li>
              <li>Paid in <strong>dollars (SOL/USDC)</strong></li>
              <li>30% team pool split by contribution</li>
              <li>This pays your rent</li>
              <li><strong>Priority: Focus here first</strong></li>
            </ul>
          </div>

          <div className={styles.comparisonBox} style={{ borderColor: 'var(--color-accent-2, #64A8FF)' }}>
            <h3 className={styles.comparisonTitle}>🎮 MISSIONS (Token Upside)</h3>
            <ul>
              <li>Side quests (proposals, recruiting, posts)</li>
              <li>Paid in <strong>$MIND tokens</strong></li>
              <li>Fixed token amount per mission</li>
              <li>This builds potential equity</li>
              <li><strong>Optional: Do when you have time</strong></li>
            </ul>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Why separate?</strong> We want you focused on earning real income from jobs. Missions are pure upside—$MIND launches at $1.00, giving immediate tangible value to your side quest contributions. But you should never sacrifice paid work for missions.
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.section}>
        <h2>Token Allocation Timeline</h2>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineLabel}>Day 0</div>
            <div className={styles.timelineDetail}>Claim mission</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineLabel}>Day 1-7</div>
            <div className={styles.timelineDetail}>Complete task</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineLabel}>Day 7</div>
            <div className={styles.timelineDetail}>Submit proof</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineLabel}>Day 7-9</div>
            <div className={styles.timelineDetail}>Verification</div>
          </div>
          <div className={styles.timelineArrow}>→</div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineLabel}>Day 10</div>
            <div className={styles.timelineDetail}>Tokens allocated</div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <strong>Token allocation:</strong> $MIND tokens get sent to your connected wallet within ~48 hours of proof verification. You&apos;ll see them in your Phantom/MetaMask wallet. Hold them, trade them (after launch), or convert to stablecoins.
        </div>
      </section>

      {/* Understanding $MIND */}
      <section className={styles.section}>
        <h2>Understanding $MIND Token Upside</h2>
        <p>
          Mind Protocol is building agentic AI infrastructure. ScopeLock is one of the first applications using it. The $MIND token powers the protocol—think of it like ETH for Ethereum or SOL for Solana.
        </p>

        <h3>What gives $MIND tokens value?</h3>
        <ul className={styles.valueList}>
          <li><strong>Protocol usage:</strong> Every AI interaction in ScopeLock (and other apps) uses $MIND tokens</li>
          <li><strong>Early contributor rewards:</strong> People who help build the ecosystem get airdropped tokens</li>
          <li><strong>Network effects:</strong> More apps using Mind Protocol = more token demand</li>
          <li><strong>Scarcity:</strong> Fixed supply, distributed to contributors over time</li>
          <li><strong>Launch price:</strong> $MIND launches at $1.00, providing clear baseline valuation</li>
        </ul>

        <h3>Real-world comparison:</h3>
        <p>
          Early contributors to protocols like Uniswap, ENS, and dYdX received airdrops worth $5K-50K+ for early participation. Mind Protocol follows similar mechanics: contribute early, earn $MIND, benefit if protocol succeeds.
        </p>

        <div className={styles.warningBox}>
          <strong>Important:</strong> Token value beyond launch is speculative. $MIND launches at $1.00, but market price may rise or fall based on protocol adoption. Treat missions as <strong>optional upside</strong>, not guaranteed income. Your main income is from jobs.
        </div>
      </section>

      {/* Completion Tips */}
      <section className={styles.section}>
        <h2>Mission Completion Tips</h2>

        <div className={styles.tipCards}>
          <div className={styles.tipCard}>
            <h3>For Proposal Writing (1 $MIND)</h3>
            <ul>
              <li>Browse Upwork for relevant jobs ScopeLock could win</li>
              <li>Write tailored proposal (not copy-paste template)</li>
              <li>Screenshot submission confirmation as proof</li>
              <li>Can batch: claim mission, write 3-5 proposals in one session</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Recruiting (10 $MIND)</h3>
            <ul>
              <li>Share ScopeLock opportunity with developers you know</li>
              <li>They need to join team AND complete first paid job</li>
              <li>Higher barrier = higher reward (10 $MIND)</li>
              <li>Quality over quantity: recruit people who&apos;ll actually contribute</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Social Posts (2 $MIND)</h3>
            <ul>
              <li>Share authentic experience working with AI citizens</li>
              <li>Post link to your tweet/X post as proof</li>
              <li>Quick mission: takes 5 minutes, earns $MIND</li>
              <li>Good for when you have 10 minutes between jobs</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Finding Prospects (1 $MIND)</h3>
            <ul>
              <li>Browse your Telegram contacts for agency owners, startup founders, tech leads</li>
              <li>Look for people who&apos;ve mentioned needing dev work or struggling with delivery</li>
              <li>Share brief message: "Hey, working with this AI-powered agency that delivers in 90s. Thought of you."</li>
              <li>Screenshot your outreach message as proof</li>
              <li>Even if they don&apos;t respond immediately, you&apos;ve planted the seed</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Content Creation (3-5 $MIND)</h3>
            <ul>
              <li>Draft threads/carousels offline during power outages, post when internet returns</li>
              <li>Use Canva free account for carousel design (5 slides = sweet spot)</li>
              <li>Thread topics: AI-human partnership, your learning journey, ScopeLock process</li>
              <li>Authentic &gt; polished - share real experiences, not corporate speak</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Design Missions (3-5 $MIND)</h3>
            <ul>
              <li>Use Canva free templates as starting point, customize with ScopeLock colors (#1EE5B8, #64A8FF)</li>
              <li>Mobile-first design - most viewers see on phone, not desktop</li>
              <li>Include ScopeLock logo/branding for consistency</li>
              <li>Export as PNG (social) or PDF (print) depending on use case</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Testing Missions (2-3 $MIND)</h3>
            <ul>
              <li>Document bugs with clear steps to reproduce (not just "it doesn&apos;t work")</li>
              <li>Screenshot error messages, weird UI behavior</li>
              <li>Test on your actual device (not simulator) - real conditions matter</li>
              <li>Try edge cases: slow internet, battery saver mode, small screen</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Market Research (3-5 $MIND)</h3>
            <ul>
              <li>Document real conversations - what objections do people actually raise?</li>
              <li>Local context matters - Nigerian market ≠ US market, explain differences</li>
              <li>Budget ranges, payment methods, communication preferences - be specific</li>
              <li>500+ words minimum for research reports, cite sources when possible</li>
            </ul>
          </div>

          <div className={styles.tipCard}>
            <h3>For Micro-Missions (1-2 $MIND)</h3>
            <ul>
              <li>Meaningful comments &gt; generic "Great post!" - add value or ask questions</li>
              <li>Boost team posts within 24h of posting for max reach</li>
              <li>Reviews should be honest - fake reviews hurt more than help</li>
              <li>Perfect for intermittent internet - grab 5 min when power is on</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>

        <div className={styles.faqList}>
          <div className={styles.faqItem}>
            <h3>Can I do missions without doing jobs?</h3>
            <p>Technically yes, but missions alone won&apos;t pay rent. Focus on jobs (30% team pool in dollars) for income. Missions are bonus.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>What if I claim a mission but don&apos;t complete it?</h3>
            <p>After 7 days, mission becomes available again for others to claim. No penalty, but don&apos;t claim if you&apos;re not going to complete—it blocks others.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Can I complete the same mission multiple times?</h3>
            <p>Depends on mission type. "Write Upwork Proposal" = yes, can claim again after completing. "Recruit Team Member" = once per person recruited.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>When can I sell $MIND tokens?</h3>
            <p>$MIND launches at $1.00 on supported DEXs. After launch, you can hold, trade, or convert to stablecoins. Early contributors who accumulate pre-launch tokens benefit from immediate liquidity.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Do missions expire?</h3>
            <p>No. As long as ScopeLock operates, missions will be available. The token allocation per mission might change over time (early = more generous), but missions don&apos;t expire.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>What if proof verification fails?</h3>
            <p>You&apos;ll get notification explaining why (e.g., screenshot unclear, proposal not actually sent). Fix and resubmit. Fair verification process.</p>
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
              <strong>Jobs = Income, Missions = Upside</strong>
              <p>Focus on paid jobs first. Missions are optional bonus for token accumulation.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>🎯</div>
            <div className={styles.takeawayText}>
              <strong>Clear value from launch</strong>
              <p>$MIND launches at $1.00. Complete 10 proposals = 10 $MIND. Recruit 2 people = 20 $MIND. Value is immediate, not speculative.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>⚡</div>
            <div className={styles.takeawayText}>
              <strong>Simple process: Claim → Complete → Submit</strong>
              <p>Takes 60 seconds to claim, 5-30 minutes to complete (depending on mission), tokens allocated within 48 hours.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>🌍</div>
            <div className={styles.takeawayText}>
              <strong>No geographic disadvantage</strong>
              <p>Missions pay same tokens regardless of location. Token upside is global, not PPP-adjusted.</p>
            </div>
          </div>

          <div className={styles.takeaway}>
            <div className={styles.takeawayIcon}>📈</div>
            <div className={styles.takeawayText}>
              <strong>Risk-reward is clear</strong>
              <p>Time investment = 5-30 min per mission. Baseline value = 1-10 $MIND at launch. Upside = potential token appreciation if protocol succeeds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to Start Earning Tokens?</h2>
        <p>
          Browse available missions and claim your first one. Wallet setup takes 60 seconds.
        </p>
        <a href="https://scopelock.mindprotocol.ai/mission-deck/" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
          Open Mission Deck →
        </a>
      </section>

      {/* Related Resources */}
      <section className={styles.section}>
        <h2>Related Resources</h2>
        <div className={styles.relatedLinks}>
          <Link href="/resources/compensation-structure" className={styles.relatedLink}>
            <span className={styles.relatedIcon}>💰</span>
            <div>
              <div className={styles.relatedTitle}>The More You Work, The More You Earn</div>
              <div className={styles.relatedDesc}>Understand main compensation from jobs</div>
            </div>
          </Link>
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

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h3>Questions About Missions?</h3>
        <p>
          Reach out to Nicolas on Telegram (<a href="https://t.me/nlr_ai" target="_blank" rel="noopener noreferrer">@nlr_ai</a>) or ask in the team chat. We&apos;re building this system together—your feedback helps improve it for everyone.
        </p>
      </section>
    </main>
  );
}
