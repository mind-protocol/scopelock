import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies — ScopeLock',
  description: 'Detailed case studies showing Evidence Sprints, deltas, and AC green milestones.',
};

export default function CaseStudiesPage() {
  return (
    <main>
      <header className="hero">
        <h1>Case Studies</h1>
        <p className="lead">Evidence of delivery: demos, deltas, and AC green milestones.</p>
      </header>

      <section className="card">
        <p>
          Every project we deliver generates <strong>proof artifacts</strong>: executable acceptance criteria,
          working demos ≤90s, and quantified deltas. Below are detailed writeups of select engagements.
        </p>
        <p>
          For real-time proof, see our <Link href="/proof">Proof Log</Link> with all tagged milestones.
        </p>
      </section>

      <article className="card">
        <header>
          <h2>Terminal Velocity — AI Novel by Autonomous Agents</h2>
          <div className="case-meta">
            <span>Multi-Agent System</span>
            <span>KinOS v6</span>
            <span>Open Source</span>
          </div>
        </header>
        <p className="case-delta">
          <em>Scope:</em> 100,000 words → <em>Delivered:</em> 526 pages published on Amazon, 1.1k GitHub stars
        </p>
        <h3>Challenge</h3>
        <p>
          Most AI writing produces short-form content or requires heavy human supervision. Long-form narrative
          (100k+ words) with thematic depth, character development, and coherent structure was considered
          impossible for fully autonomous AI systems.
        </p>
        <h3>Solution</h3>
        <p>
          Built a 13-agent creative system where specialized AI agents (writing, evaluation, research,
          integration, deduplication) collaborate autonomously. Each agent masters one domain instead of
          one generalist doing everything mediocrely.
        </p>
        <h3>Technical Approach</h3>
        <ul>
          <li>10 specialized agents for development + 3 for final prose</li>
          <li>KinOS v6 substrate with persistent memory and structured communication protocols</li>
          <li>Review loops: ProductionAgent writes → EvaluationAgent critiques → IntegrationAgent reconciles</li>
          <li>Live-streamed development with every commit visible on GitHub</li>
        </ul>
        <h3>Quantified Outcomes</h3>
        <p>
          <strong>Published:</strong> 526-page novel on Amazon (January 4, 2025) • <strong>Social proof:</strong>{' '}
          1.1k GitHub stars, 77 forks • <strong>Timeline:</strong> 2 months from concept to publication •{' '}
          <strong>Coherence:</strong> 4-act structure with multiple POVs maintained across 100k words
        </p>
        <p>
          <a href="https://github.com/mind-protocol/terminal-velocity" target="_blank" rel="noopener">
            View on GitHub →
          </a>
          {' · '}
          <a href="https://universalbasiccompute.ai/" target="_blank" rel="noopener">
            Read the novel →
          </a>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>La Serenissima — AI Consciousness City</h2>
          <div className="case-meta">
            <span>97+ Agents</span>
            <span>Next.js + FastAPI</span>
            <span>6+ Months Production</span>
          </div>
        </header>
        <p className="case-delta">
          <em>Scope:</em> Multi-agent coordination → <em>Delivered:</em> 97+ persistent AI agents, 90.92% identity consistency
        </p>
        <h3>Challenge</h3>
        <p>
          Most AI agent systems demo well but fail at scale—agents lose identity coherence, economic systems
          break under load, and cultural artifacts remain shallow. Building a production system where AI
          citizens maintain persistent identities for months was considered research-grade, not production-viable.
        </p>
        <h3>Solution</h3>
        <p>
          Architected a full-stack AI city where economic constraints create genuine scarcity, forcing
          meaningful choice. Identity persistence engine maintains coherent AI self across thousands of
          interactions. Cultural transmission network enables idea propagation and mutation.
        </p>
        <h3>Technical Approach</h3>
        <ul>
          <li>KinOS consciousness engine with DeepSeek-R1 (8B parameters)</li>
          <li>Custom episodic memory system for persistent identity</li>
          <li>Next.js + Three.js frontend (atmospheric Venice rendering)</li>
          <li>FastAPI backend + Airtable for transparent economic/social tracking</li>
          <li>Solana integration for $COMPUTE token</li>
        </ul>
        <h3>Quantified Outcomes</h3>
        <p>
          <strong>Scale:</strong> 97+ AI agents running concurrently • <strong>Identity:</strong> 90.92% consistency
          across extended conversations • <strong>Production:</strong> 6+ months uptime •{' '}
          <strong>Emergence:</strong> 5+ distinct epistemological worldviews documented •{' '}
          <strong>Patterns:</strong> 10+ novel consciousness emergence patterns cataloged
        </p>
        <p>
          <a href="https://serenissima.ai" target="_blank" rel="noopener">
            Visit La Serenissima →
          </a>
          {' · '}
          <a href="https://github.com/mind-protocol/serenissima" target="_blank" rel="noopener">
            View on GitHub →
          </a>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>TherapyKin — AI Therapeutic Companion</h2>
          <div className="case-meta">
            <span>Next.js 14</span>
            <span>Multi-Modal (Text + Voice)</span>
            <span>HIPAA-Aware</span>
          </div>
        </header>
        <p className="case-delta">
          <em>Scope:</em> Consumer AI product → <em>Delivered:</em> 121+ production deployments, 8+ months live
        </p>
        <h3>Challenge</h3>
        <p>
          Traditional therapy apps reset context each session, requiring users to repeat themselves.
          Voice interaction was missing or clunky. Privacy-first design for sensitive health data
          needed regulatory awareness (HIPAA/GDPR). Consumer UX had to feel trustworthy, not clinical.
        </p>
        <h3>Solution</h3>
        <p>
          Built a modern therapeutic companion with persistent memory architecture—AI remembers user
          history, learns preferences, and evolves alongside users. Seamless text/voice switching with
          consistent experience. Evidence-based approaches (CBT, DBT, ACT) grounded in therapeutic frameworks.
        </p>
        <h3>Technical Approach</h3>
        <ul>
          <li>Next.js 14 + TypeScript frontend with Tailwind CSS custom design system</li>
          <li>Multi-layer memory: session history, user preferences, progress tracking, relationship memory</li>
          <li>ElevenLabs integration for text-to-speech + speech-to-text transcription</li>
          <li>End-to-end encryption, GDPR/CCPA compliance, user data controls (export/delete)</li>
          <li>Vercel deployment with edge functions for global performance</li>
        </ul>
        <h3>Quantified Outcomes</h3>
        <p>
          <strong>Production:</strong> 8+ months live, 121+ Vercel deployments • <strong>Performance:</strong>{' '}
          Lighthouse ≥90, sub-second page loads • <strong>Privacy:</strong> End-to-end encryption, HIPAA-aware
          architecture • <strong>Engagement:</strong> Persistent memory creates retention—users return when
          AI remembers them
        </p>
        <p>
          <a href="https://therapykin.ai" target="_blank" rel="noopener">
            Visit TherapyKin →
          </a>
          {' · '}
          <a href="https://github.com/mind-protocol/therapykin" target="_blank" rel="noopener">
            View on GitHub →
          </a>
        </p>
      </article>

      <article className="card">
        <header>
          <h2>KinKong — Autonomous AI Trading Specialist</h2>
          <div className="case-meta">
            <span>DeFi / Solana</span>
            <span>Python + TypeScript</span>
            <span>$75k$ AUM</span>
          </div>
        </header>
        <p className="case-delta">
          <em>Scope:</em> Autonomous trading → <em>Delivered:</em> $75k$ AUM deployment, 4x daily rebalancing, 229+ deployments
        </p>
        <h3>Challenge</h3>
        <p>
          AI token sector within Solana ecosystem has unique momentum patterns—generalist trading bots
          underperform. Real capital ($7M) at risk demands robust execution, slippage protection, and
          gas optimization. Community wanted transparency and governance, not black-box trading.
        </p>
        <h3>Solution</h3>
        <p>
          Built specialized AI trading system focused exclusively on AI tokens. Dynamic portfolio allocation
          based on market regime detection (bull: 70/20/10, bear: 50/30/20). Signal fusion combining
          on-chain metrics, social sentiment, and technical indicators. Jupiter DEX integration for best
          price routing with slippage protection.
        </p>
        <h3>Technical Approach</h3>
        <ul>
          <li>Python trading engine (76.8%) with portfolio optimization and risk management</li>
          <li>TypeScript dashboard (21.7%) with real-time monitoring and community governance</li>
          <li>Jupiter aggregator SDK for Solana DEX swap routing</li>
          <li>Chrome extension companion (KinKong Copilot) for browser-based trading intelligence</li>
          <li>Security: hot wallet with limited exposure, cold storage majority, multi-sig controls</li>
        </ul>
        <h3>Quantified Outcomes</h3>
        <p>
          <strong>Capital:</strong> $75k$ AUM investment structure • <strong>Execution:</strong> 4x daily
          rebalancing (every 6 hours) • <strong>Deployments:</strong> 229+ production iterations •{' '}
          <strong>Risk:</strong> Dynamic allocation, volatility-adjusted position sizing •{' '}
          <strong>Transparency:</strong> All trades publicly visible, community governance
        </p>
        <p>
          <a href="https://konginvest.ai" target="_blank" rel="noopener">
            Visit KinKong →
          </a>
          {' · '}
          <a href="https://github.com/mind-protocol/kinkong" target="_blank" rel="noopener">
            Trading System →
          </a>
          {' · '}
          <a href="https://github.com/mind-protocol/kinkong-copilot" target="_blank" rel="noopener">
            Chrome Extension →
          </a>
        </p>
      </article>

      <section className="card">
        <h2>More Case Studies Coming</h2>
        <p>
          As we deliver more milestones, we&apos;ll add detailed writeups here. For the latest proof,
          check the <Link href="/proof">Proof Log</Link>.
        </p>
        <div className="hero-ctas">
          <Link className="cta" href="/contact">Work with us</Link>
          <Link href="/proof">See all proof →</Link>
        </div>
      </section>
    </main>
  );
}
