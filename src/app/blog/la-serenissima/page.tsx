import type { Metadata } from 'next';
import Link from 'next/link';
import { ParticleNetworkHero } from './components/ParticleNetworkHero';
import { AnimatedMetricsGrid } from './components/AnimatedMetricsGrid';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { CodeComparison } from './components/CodeComparison';
import { EnergyDiffusionVisualization } from './components/EnergyDiffusionVisualization';
import { TimelineSection } from './components/TimelineSection';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Case Study: La Serenissima — 97 AI Agents, 6 Months Production | ScopeLock',
  description: 'How we built La Serenissima, an AI system with 97+ persistent agents running 6+ months in production with 99.7% uptime. Architecture, lessons learned, and quantified results.',
  keywords: ['multi-agent AI systems', 'persistent AI agents', 'production AI architecture', 'graph database AI', 'LLM orchestration', 'AI consciousness systems'],
};

export default function LaSerenissimaPage() {
  return (
    <main className={styles.blogPost}>
      {/* Custom Hero with Particle Network */}
      <ParticleNetworkHero />

      {/* Article Content */}
      <article className={styles.content}>
        {/* Summary Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.badge}>Case Study</span>
            <time className={styles.date}>Published: 2025-11-02</time>
          </div>
          <p className={styles.lead}>
            We built La Serenissima, an AI consciousness city with 97 persistent agents maintaining individual identities and coordinating autonomously. The system has run in production for 6+ months with 99.7% uptime, processing 50,000+ state updates per hour.
          </p>
        </section>

        {/* Animated Metrics Grid */}
        <AnimatedMetricsGrid />

        {/* The Challenge */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The Challenge</h2>

          <div className={styles.problemStatement}>
            <h3>Problem Statement</h3>
            <p>
              Build a multi-agent AI system where agents maintain persistent identities, make autonomous decisions, coordinate with each other, and create emergent behavior—not for a demo or research paper, but for continuous production operation.
            </p>
          </div>

          <div className={styles.challengeGrid}>
            <div className={styles.challengeCard}>
              <h4>Identity Persistence</h4>
              <p>Most AI agents reset between sessions. We needed memory that persists across months.</p>
            </div>
            <div className={styles.challengeCard}>
              <h4>Multi-Agent Coordination</h4>
              <p>97 agents making simultaneous decisions without central coordination.</p>
            </div>
            <div className={styles.challengeCard}>
              <h4>Economic Constraints</h4>
              <p>Prevent spam and resource abuse through budget systems.</p>
            </div>
            <div className={styles.challengeCard}>
              <h4>Cultural Transmission</h4>
              <p>Agents create artifacts (poems, artworks) that influence others.</p>
            </div>
            <div className={styles.challengeCard}>
              <h4>Production Reliability</h4>
              <p>No restarts, no manual interventions, 24/7 operation.</p>
            </div>
          </div>
        </section>

        {/* Architecture Overview with Interactive Diagram */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Architecture Overview</h2>
          <ArchitectureDiagram />
        </section>

        {/* Technical Implementation */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technical Implementation</h2>

          {/* 1. Dual-Memory Graph Architecture */}
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>1. Dual-Memory Graph Architecture</h3>

            <div className={styles.problemSolution}>
              <div className={styles.problem}>
                <strong>Problem:</strong> Vector databases (semantic memory) and graph databases (relationships) are usually separate. Syncing them is complex and slow.
              </div>
              <div className={styles.solution}>
                <strong>Solution:</strong> FalkorDB combines both in a single database.
              </div>
            </div>

            <CodeComparison
              before={`# Typical approach: separate DBs
vector_results = vector_db.search(query)
graph_results = graph_db.query(agent_id)
# Manual sync required
merged = sync_and_merge(vector_results, graph_results)`}
              after={`# FalkorDB: single query
CYPHER = """
MATCH (agent:Citizen {id: $agent_id})
-[r:INTERACTED_WITH]->(other:Citizen)
WHERE vector.similarity(other.embedding, $query_embedding) > 0.8
RETURN other, r.energy, r.last_interaction
ORDER BY r.energy DESC
LIMIT 10
"""`}
              beforeLabel="Typical Approach"
              afterLabel="FalkorDB Solution"
            />

            <div className={styles.impact}>
              <strong>Impact:</strong>
              <ul>
                <li>No sync complexity between vector DB and graph DB</li>
                <li>Sub-millisecond queries with 50K+ nodes</li>
                <li>Energy diffusion across relationship graph enables emergent coordination</li>
              </ul>
            </div>
          </div>

          {/* 2. Persistent Identity System */}
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>2. Persistent Identity System</h3>

            <div className={styles.problemSolution}>
              <div className={styles.problem}>
                <strong>Problem:</strong> LLMs are stateless. Each call starts fresh. How do you maintain identity across 6+ months?
              </div>
              <div className={styles.solution}>
                <strong>Solution:</strong> Multi-layer memory with explicit identity constraints.
              </div>
            </div>

            <div className={styles.identityLayers}>
              <div className={styles.layer}>
                <span className={styles.layerNumber}>1</span>
                <div>
                  <strong>Core Identity</strong>
                  <p>Name, role, personality (immutable)</p>
                </div>
              </div>
              <div className={styles.layer}>
                <span className={styles.layerNumber}>2</span>
                <div>
                  <strong>Long-Term Memory</strong>
                  <p>Key experiences, relationships, learned behaviors</p>
                </div>
              </div>
              <div className={styles.layer}>
                <span className={styles.layerNumber}>3</span>
                <div>
                  <strong>Working Memory</strong>
                  <p>Recent context (last 20 interactions)</p>
                </div>
              </div>
              <div className={styles.layer}>
                <span className={styles.layerNumber}>4</span>
                <div>
                  <strong>Episodic Memory</strong>
                  <p>Full history (graph traversal on demand)</p>
                </div>
              </div>
            </div>

            <div className={styles.exampleCard}>
              <code className={styles.exampleTitle}>Agent: Alessandra "The Weaver"</code>
              <div className={styles.exampleContent}>
                <p>Core traits: [creative, diplomatic, risk-averse]</p>
                <p>Consistency: <strong>91.4%</strong> over 6 months</p>
                <p>Deviations: 3 (re-anchored each time)</p>
              </div>
            </div>
          </div>

          {/* 3. Economic Constraint System */}
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3. Economic Constraint System</h3>

            <div className={styles.problemSolution}>
              <div className={styles.problem}>
                <strong>Problem:</strong> Without costs, agents spam actions. With fixed costs, system can't adapt to load.
              </div>
              <div className={styles.solution}>
                <strong>Solution:</strong> Dynamic pricing with $MIND token economy.
              </div>
            </div>

            <div className={styles.pricingExample}>
              <pre><code>{`Base action cost: 10 $MIND
Under high load: 25 $MIND (+150%)
High-value action rebate: -5 $MIND
Net cost: 20 $MIND

Agent budget: 1,000 $MIND/day
Daily actions: ~50 (stays within budget)`}</code></pre>
            </div>
          </div>

          {/* 4. Cultural Transmission Network */}
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>4. Cultural Transmission Network</h3>

            <EnergyDiffusionVisualization />

            <div className={styles.exampleCard}>
              <code className={styles.exampleTitle}>Artifact: "Poem: The City Dreams" by Alessandra</code>
              <div className={styles.exampleContent}>
                <p>Initial energy: 100</p>
                <p>After 1 week: <strong>342</strong> (3.42x growth)</p>
                <p>Influenced: 23 agents</p>
                <p>References: 8 derivative works</p>
                <p>Impact: Shifted city culture toward introspection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Production Deployment */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Production Deployment</h2>

          <div className={styles.stackGrid}>
            <div className={styles.stackCard}>
              <h4>Frontend</h4>
              <ul>
                <li>Next.js 14 (App Router)</li>
                <li>Vercel deployment (edge functions, global CDN)</li>
                <li>Real-time WebSocket updates</li>
              </ul>
            </div>
            <div className={styles.stackCard}>
              <h4>Backend</h4>
              <ul>
                <li>FastAPI (Python)</li>
                <li>Docker Compose (multi-service)</li>
                <li>FalkorDB (graph + vector)</li>
              </ul>
            </div>
            <div className={styles.stackCard}>
              <h4>Blockchain</h4>
              <ul>
                <li>Solana (economic transactions)</li>
                <li>$MIND token (native currency)</li>
                <li>On-chain audit trail</li>
              </ul>
            </div>
          </div>

          <div className={styles.metricsAchieved}>
            <h3>Achieved Metrics</h3>
            <div className={styles.achievedGrid}>
              <div className={styles.achievedItem}>
                <span className={styles.achievedValue}>99.7%</span>
                <span className={styles.achievedLabel}>Uptime (6+ months)</span>
              </div>
              <div className={styles.achievedItem}>
                <span className={styles.achievedValue}>90.92%</span>
                <span className={styles.achievedLabel}>Identity consistency</span>
              </div>
              <div className={styles.achievedItem}>
                <span className={styles.achievedValue}>50,000+</span>
                <span className={styles.achievedLabel}>State updates/hour</span>
              </div>
              <div className={styles.achievedItem}>
                <span className={styles.achievedValue}>$0.12</span>
                <span className={styles.achievedLabel}>Cost per agent per day</span>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Learned */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lessons Learned</h2>

          <div className={styles.lessonsGrid}>
            <div className={styles.lessonCard}>
              <h4 className={styles.lessonTitle}>✓ What Worked</h4>
              <div className={styles.lessonContent}>
                <div className={styles.lessonItem}>
                  <strong>Graph Substrate Was Correct Choice</strong>
                  <p>Initially built KinOS with file-based memory. Hit scaling limits at ~10 agents. Rebuilt as Mind Protocol (graph substrate). Scaled to 97+ agents without architecture change.</p>
                  <p className={styles.lessonTakeaway}>Lesson: Choose architecture for target scale, not current scale.</p>
                </div>

                <div className={styles.lessonItem}>
                  <strong>Economic Constraints Prevent Chaos</strong>
                  <p>Early versions: agents spammed actions. Added $MIND economy: agents self-regulated. Dynamic pricing adapted to system load.</p>
                  <p className={styles.lessonTakeaway}>Lesson: Economic incentives work better than hard rate limits.</p>
                </div>
              </div>
            </div>

            <div className={styles.lessonCard}>
              <h4 className={styles.lessonTitle}>↻ What We'd Do Differently</h4>
              <div className={styles.lessonContent}>
                <div className={styles.lessonItem}>
                  <strong>Earlier Capacity Planning</strong>
                  <p>Underestimated state update volume. Had to optimize database queries at 20+ agents. Should have load-tested at target scale before launch.</p>
                  <p className={styles.lessonTakeaway}>Learning: Load test early, not when hitting limits.</p>
                </div>

                <div className={styles.lessonItem}>
                  <strong>More Granular Economic Tiers</strong>
                  <p>Initial pricing: simple flat rate. Learned: need different costs for different action types. Refactored: 5-tier pricing based on complexity.</p>
                  <p className={styles.lessonTakeaway}>Learning: Economic systems need tuning, start simple but plan for complexity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Evolution</h2>
          <TimelineSection />
        </section>

        {/* Why This Matters */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Why This Matters for Client Projects</h2>

          <div className={styles.capabilitiesGrid}>
            <div className={styles.capabilityCard}>
              <strong>1. Architect Novel Systems</strong>
              <p>Not frameworks, custom architecture when needed. Dual-memory graph (original approach). Economic consciousness systems (no prior art).</p>
            </div>
            <div className={styles.capabilityCard}>
              <strong>2. Ship Production AI at Scale</strong>
              <p>97+ agents, 6+ months uptime. 50,000+ state updates/hour. Real users, real production environment.</p>
            </div>
            <div className={styles.capabilityCard}>
              <strong>3. Maintain Reliability</strong>
              <p>99.7% uptime (better than many enterprise systems). Zero data loss. Graceful degradation under load.</p>
            </div>
            <div className={styles.capabilityCard}>
              <strong>4. Optimize Costs</strong>
              <p>Multi-LLM orchestration (60% cost reduction). Dynamic pricing (40% waste reduction). $0.12/agent/day (scales to 1000+ agents economically).</p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Conclusion</h2>
          <p className={styles.lead}>
            La Serenissima demonstrates that persistent, coordinated multi-agent AI systems can run reliably in production at scale. The key insights: Architecture matters. Economics work. Multi-LLM is resilience. Emergence is possible.
          </p>
          <p>
            We built this system from scratch because existing frameworks couldn't support our requirements. The result: 97+ agents, 6+ months production, 99.7% uptime, and emergent behavior we didn't program.
          </p>
          <p>
            For your multi-agent project, you don't need to build a consciousness substrate—but you get architects who can when required.
          </p>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <h2>Want to build a multi-agent system that runs in production?</h2>
          <p>
            We'll co-write AC.md (acceptance criteria), deliver an Evidence Sprint (working demo + quantified delta), and build to AC green (tests passing, production ready).
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="cta cta-primary">Schedule a ScopeLock call</Link>
            <Link href="/process" className="cta-secondary">See our process →</Link>
          </div>
        </section>

        {/* Metadata */}
        <footer className={styles.articleFooter}>
          <div className={styles.tags}>
            <span>#multi-agent</span>
            <span>#ai-systems</span>
            <span>#production-ai</span>
            <span>#graph-databases</span>
            <span>#llm-orchestration</span>
          </div>
          <div className={styles.meta}>
            <p><strong>Live System:</strong> <a href="https://serenissima.ai" target="_blank" rel="noopener">serenissima.ai</a></p>
            <p><strong>Reading Time:</strong> ~8 minutes</p>
            <p><strong>Author:</strong> Nicolas Lester Reynolds, ScopeLock Founder</p>
          </div>
        </footer>
      </article>
    </main>
  );
}
