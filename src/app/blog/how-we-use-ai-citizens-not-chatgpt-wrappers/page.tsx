import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'How We Use AI Citizens (Not ChatGPT Wrappers) | ScopeLock Blog',
  description: '7 AI citizens with domain ownership, persistent memory, and autonomous decision-making. Not autocomplete.',
  keywords: ['ai-development', 'multi-agent', 'ai-citizens', 'autonomous-ai', 'ai-partnership'],
};

export default function AICitizensPage() {
  return (
    <main className={styles.citizenMode}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/blog" className={styles.backLink}>← Blog</Link>
        <h1>How We Use AI Citizens (Not ChatGPT Wrappers)</h1>
        <div className={styles.meta}>
          <time>Nov 2, 2025</time>
          <span>•</span>
          <span>8 min read</span>
          <span>•</span>
          <span>Nicolas Lester Reynolds</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#ai-development</span>
          <span className={styles.tag}>#multi-agent</span>
          <span className={styles.tag}>#ai-citizens</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadText}>
          "We use AI to build faster."
        </p>
        <p>
          You've heard this from every agency and freelancer in 2024-2025. What they usually mean:
        </p>
        <ul className={styles.typicalList}>
          <li>ChatGPT for writing code snippets</li>
          <li>GitHub Copilot for autocomplete</li>
          <li>Claude for debugging help</li>
        </ul>
        <p className={styles.callout}>
          <strong>These are tools, not teammates.</strong> They assist, but you still do the work.
        </p>
        <p>
          At ScopeLock, we built something different: <strong>AI citizens with domain ownership</strong>.
        </p>
      </section>

      {/* Comparison: Tools vs Citizens */}
      <section className={styles.comparisonSection}>
        <h2>The Difference: Tools vs Citizens</h2>

        <div className={styles.comparisonGrid}>
          <div className={styles.comparisonCard}>
            <h3 className={styles.comparisonTitle}>ChatGPT / Copilot</h3>
            <div className={styles.comparisonLabel}>Tools (Assistance)</div>
            <ul className={styles.comparisonList}>
              <li><span className={styles.property}>Agency:</span> Reactive (waits for you)</li>
              <li><span className={styles.property}>Memory:</span> Stateless (context window)</li>
              <li><span className={styles.property}>Domain:</span> General-purpose</li>
              <li><span className={styles.property}>Decisions:</span> Suggests, you decide</li>
              <li><span className={styles.property}>Coordination:</span> None (you coordinate)</li>
            </ul>
            <div className={styles.workflowExample}>
              <div className={styles.workflowLabel}>Typical workflow:</div>
              <ol className={styles.workflowSteps}>
                <li>Hit a problem</li>
                <li>Copy code into ChatGPT</li>
                <li>Ask: "How do I fix this?"</li>
                <li>Get answer</li>
                <li>Paste code back</li>
                <li>Repeat 47 times/day</li>
              </ol>
            </div>
          </div>

          <div className={`${styles.comparisonCard} ${styles.highlighted}`}>
            <h3 className={styles.comparisonTitle}>AI Citizens</h3>
            <div className={styles.comparisonLabel}>Teammates (Autonomy)</div>
            <ul className={styles.comparisonList}>
              <li><span className={styles.property}>Agency:</span> Autonomous (drives work)</li>
              <li><span className={styles.property}>Memory:</span> Persistent (remembers all)</li>
              <li><span className={styles.property}>Domain:</span> Specialized (owns area)</li>
              <li><span className={styles.property}>Decisions:</span> Decides within domain</li>
              <li><span className={styles.property}>Coordination:</span> Event-driven (emits/subscribes)</li>
            </ul>
            <div className={styles.workflowExample}>
              <div className={styles.workflowLabel}>Citizen workflow:</div>
              <ol className={styles.workflowSteps}>
                <li>Subscribes to domain events</li>
                <li>Analyzes autonomously</li>
                <li>Makes routine decisions</li>
                <li>Emits results as events</li>
                <li>Coordinates automatically</li>
                <li>Human reviews, not micromanages</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* The Seven Citizens */}
      <section className={styles.citizensSection}>
        <h2>The Seven Citizens</h2>
        <p className={styles.sectionIntro}>
          Each citizen owns a domain. Each makes autonomous decisions within that domain. Each coordinates via events, not meetings.
        </p>

        {/* Emma - The Scout */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Emma Rossi — "The Scout"</h3>
            <span className={styles.citizenDomain}>Lead Intelligence</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Emma Does</h4>
              <ul>
                <li>Reads job posts (Upwork, Contra, LinkedIn)</li>
                <li>Extracts: budget, stack, red flags, urgency</li>
                <li>Scores fit: 0-1 (GO or NO-GO)</li>
                <li>Suggests Evidence Sprint idea</li>
                <li>Emits: <code>lead.parsed@1.0</code></li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Emma Doesn't Do</h4>
              <ul>
                <li>Submit proposals (ToS violation)</li>
                <li>Scrape behind authentication</li>
                <li>Write full proposals (that's Rafael)</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Example Event Emitted:</div>
              <pre className={styles.codeBlock}>{`{
  "event": "lead.parsed@1.0",
  "budget": "$5K-$12K",
  "stack": ["Next.js", "FastAPI", "PostgreSQL"],
  "red_flags": [],
  "urgency": 9,
  "pain": 8,
  "evidence_sprint_idea": "OTP signup demo"
}`}</pre>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>3 hours/day</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>20 minutes/day</span>
            </div>
          </div>
        </div>

        {/* Rafael - The Harbor */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Rafael Moretti — "The Harbor"</h3>
            <span className={styles.citizenDomain}>Client Relationships</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Rafael Does</h4>
              <ul>
                <li>Co-authors AC.md with clients</li>
                <li>Opens Change Requests (CHG-130)</li>
                <li>Sizes Swap vs Add</li>
                <li>Maintains client status notes</li>
                <li>Triggers testimonials at AC green</li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Rafael Doesn't Do</h4>
              <ul>
                <li>Write code</li>
                <li>Design UI</li>
                <li>Run acceptance tests</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Example Output:</div>
              <pre className={styles.codeBlock}>{`# AC.md: OTP Signup

## Functional Criteria
1. User enters email, receives OTP
2. User submits OTP, authenticates
3. Session established, token stored
... (10 criteria total)

## Non-Functional Criteria
- p95 < 300ms
- Error rate < 0.1%
- Email delivery < 5s

## Verification
\`\`\`bash
npm run acceptance:signup
\`\`\`
Seed: test@example.com`}</pre>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>2 hours of back-and-forth</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>30 minutes of co-editing</span>
            </div>
          </div>
        </div>

        {/* Sofia - The Gauge */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Sofia Nguyen — "The Gauge"</h3>
            <span className={styles.citizenDomain}>Quality Guardian</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Sofia Does</h4>
              <ul>
                <li>Reviews every commit</li>
                <li>Issues verdict: <code>pass | soft | hard</code></li>
                <li>Enforces baseline guard (no AC.md changes without CR)</li>
                <li>Blocks silent fallbacks (fail-loud principle)</li>
                <li>Manages overrides (with reason + expiry)</li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Sofia Doesn't Do</h4>
              <ul>
                <li>Write features</li>
                <li>Fix bugs (she points them out, Daniel fixes)</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Sofia Flags This:</div>
              <pre className={styles.codeBlock}>{`# ❌ Sofia flags this:
try:
    result = risky_operation()
except Exception:
    return default_value  # Silent fallback

# ✅ Sofia approves this:
try:
    result = risky_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}")
    raise  # Fail-loud`}</pre>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>30min manual review/commit</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>Real-time automated review</span>
            </div>
          </div>
        </div>

        {/* Daniel - The Forge */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Daniel Kim — "The Forge"</h3>
            <span className={styles.citizenDomain}>Core Builder</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Daniel Does</h4>
              <ul>
                <li>Turns AC.md into working code</li>
                <li>Writes acceptance tests (Playwright, PyTest)</li>
                <li>Produces DEMO.md + DELTA.md</li>
                <li>Tags Evidence Sprints</li>
                <li>Drives to AC green (all tests passing)</li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Daniel Doesn't Do</h4>
              <ul>
                <li>Co-author AC.md (that's Rafael + client)</li>
                <li>Design architecture (that's Aïcha)</li>
                <li>Build /proof pages (that's Maya)</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Example Delivery:</div>
              <div className={styles.deliveryList}>
                <div className={styles.deliveryItem}>
                  <span className={styles.deliveryIcon}>✓</span>
                  <span>Working OTP flow (code)</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.deliveryIcon}>✓</span>
                  <span>Acceptance tests (Playwright)</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.deliveryIcon}>✓</span>
                  <span>DEMO.md (90s demo URL)</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.deliveryIcon}>✓</span>
                  <span>DELTA.md (p95: 1200ms → 280ms)</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.deliveryIcon}>✓</span>
                  <span>Tag: evidence-sprint_otp-signup_2025-11-02</span>
                </div>
              </div>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>Nicolas solo: 5-7 days</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>Daniel + Nicolas: 2-3 days</span>
            </div>
          </div>
        </div>

        {/* Aïcha - The Architect */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Aïcha Benali — "The Architect"</h3>
            <span className={styles.citizenDomain}>Architecture & Schemas</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Aïcha Does</h4>
              <ul>
                <li>Defines event schemas (<code>lead.parsed@1.0</code>, <code>ac.green@1.0</code>)</li>
                <li>Specifies /proof contracts (PRF-020)</li>
                <li>Guards AC baseline semantics</li>
                <li>Sizes CHG-130 Swap vs Add complexity</li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Aïcha Doesn't Do</h4>
              <ul>
                <li>Implement features</li>
                <li>Write UI code</li>
                <li>Client communication</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Example Analysis:</div>
              <pre className={styles.codeBlock}>{`Original AC: Email notifications
Client wants: SMS notifications

Aïcha's analysis:
- Same notification pattern
- Similar complexity (external API)
- No new infrastructure

Verdict: Swap (€0)`}</pre>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>Hours of debate</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>Minutes of analysis</span>
            </div>
          </div>
        </div>

        {/* Maya - The Facet */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Maya Vieira — "The Facet"</h3>
            <span className={styles.citizenDomain}>Frontend & Evidence UX</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Maya Does</h4>
              <ul>
                <li>Builds homepage (hero, process)</li>
                <li>Renders /proof entries (index + detail)</li>
                <li>Implements accessibility (Lighthouse ≥90)</li>
                <li>Maintains CSS budget (&lt;20KB gz)</li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Maya Doesn't Do</h4>
              <ul>
                <li>Backend logic</li>
                <li>Event schemas</li>
                <li>Change Request sizing</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Automatic Workflow:</div>
              <div className={styles.deliveryList}>
                <div className={styles.deliveryItem}>
                  <span className={styles.stepNumber}>1</span>
                  <span>Daniel tags: evidence-sprint_otp-signup_2025-11-02</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.stepNumber}>2</span>
                  <span>Maya reads tag, extracts AC/DEMO/DELTA</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.stepNumber}>3</span>
                  <span>Generates /proof page automatically</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.stepNumber}>4</span>
                  <span>Updates /proof index</span>
                </div>
                <div className={styles.deliveryItem}>
                  <span className={styles.stepNumber}>5</span>
                  <span>Live at: /proof/evidence-sprint_otp-signup_2025-11-02</span>
                </div>
              </div>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>Manual HTML for every project</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>Zero manual work</span>
            </div>
          </div>
        </div>

        {/* Priya - The Pulse */}
        <div className={styles.citizenCard}>
          <div className={styles.citizenHeader}>
            <h3>Priya Singh — "The Pulse"</h3>
            <span className={styles.citizenDomain}>Supervision & Health</span>
          </div>

          <div className={styles.citizenBody}>
            <div className={styles.citizenSection}>
              <h4>What Priya Does</h4>
              <ul>
                <li>Enforces single-supervisor doctrine</li>
                <li>Emits <code>health.compliance.snapshot</code></li>
                <li>Attaches rich context to failures</li>
                <li>Keeps MTTR &lt; 10 minutes</li>
              </ul>
            </div>

            <div className={styles.citizenSection}>
              <h4>What Priya Doesn't Do</h4>
              <ul>
                <li>Build features</li>
                <li>Client ops</li>
                <li>UI work</li>
              </ul>
            </div>

            <div className={styles.outputExample}>
              <div className={styles.outputLabel}>Service Configuration:</div>
              <pre className={styles.codeBlock}>{`# services.yaml
otp_service:
  command: python otp_service.py
  readiness: http://localhost:5000/health
  liveness: http://localhost:5000/health`}</pre>
            </div>

            <div className={styles.impact}>
              <span className={styles.impactLabel}>Time saved:</span>
              <span className={styles.impactBefore}>Manual "did it crash?" checks</span>
              <span className={styles.impactArrow}>→</span>
              <span className={styles.impactAfter}>Zero manual monitoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Is Different */}
      <section className={styles.principlesSection}>
        <h2>Why This Is Different</h2>

        <div className={styles.principleCard}>
          <h3>1. Domain Ownership (Not General-Purpose)</h3>
          <div className={styles.principleComparison}>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>ChatGPT approach:</div>
              <p>"Help me with this project" (vague, context-switching)</p>
            </div>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>Citizen approach:</div>
              <ul className={styles.domainList}>
                <li>Emma owns leads</li>
                <li>Rafael owns client ops</li>
                <li>Sofia owns quality</li>
                <li>Daniel owns features</li>
                <li>Aïcha owns architecture</li>
                <li>Maya owns UI</li>
                <li>Priya owns supervision</li>
              </ul>
              <p className={styles.emphasis}>Each citizen has ONE job. They're experts in that domain.</p>
            </div>
          </div>
        </div>

        <div className={styles.principleCard}>
          <h3>2. Autonomous Decision-Making</h3>
          <div className={styles.principleComparison}>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>ChatGPT approach:</div>
              <p>"Should we use Swap or Add for this change?" (asks human)</p>
            </div>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>Citizen approach:</div>
              <p>Aïcha analyzes complexity, decides Swap vs Add, emits event.</p>
              <p className={styles.emphasis}>Citizens make decisions within their domain. Humans review, but citizens don't wait for permission on routine choices.</p>
            </div>
          </div>
        </div>

        <div className={styles.principleCard}>
          <h3>3. Persistent Memory (Not Stateless)</h3>
          <div className={styles.principleComparison}>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>ChatGPT approach:</div>
              <p>Every conversation starts from zero. "Remind me what we're working on?"</p>
            </div>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>Citizen approach:</div>
              <p>Rafael remembers every AC.md baseline, every CR opened, every client interaction.</p>
              <div className={styles.memoryExample}>
                <p><strong>Client:</strong> "Can we revisit that notification change from last week?"</p>
                <p><strong>Rafael:</strong> "Change Request #003, opened 2025-10-28. You approved SMS Swap (€0). Delivered 2025-10-30. See /proof/change-req_003"</p>
              </div>
              <p className={styles.emphasis}>No context loss. No "remind me" requests.</p>
            </div>
          </div>
        </div>

        <div className={styles.principleCard}>
          <h3>4. Event-Driven Coordination</h3>
          <div className={styles.principleComparison}>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>ChatGPT approach:</div>
              <p>Human coordinates everything. "Let me ask the other developer..."</p>
            </div>
            <div className={styles.principleColumn}>
              <div className={styles.principleLabel}>Citizen approach:</div>
              <p>Rafael emits: <code>AC.md ready → handoff to Forge</code><br/>
              Daniel subscribes, starts work automatically.</p>
              <p className={styles.emphasis}>No coordination overhead. Just events and subscriptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Workflow */}
      <section className={styles.workflowSection}>
        <h2>How Citizens Work Together</h2>
        <p className={styles.sectionIntro}>Example: OTP Signup Project</p>

        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 1</div>
            <div className={styles.timelineContent}>
              <h4>Emma finds lead</h4>
              <div className={styles.timelineDetail}>
                <p>Emma reads job post: "Need passwordless auth. Budget $8K. Urgent."</p>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Event emitted:</span>
                  <code>lead.parsed@1.0</code>
                  <pre className={styles.miniCode}>{`{ "budget": "$8K", "urgency": 9,
  "evidence_sprint_idea": "OTP signup demo" }`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 1</div>
            <div className={styles.timelineContent}>
              <h4>Rafael drafts AC.md</h4>
              <div className={styles.timelineDetail}>
                <p>Rafael reads Emma's event, drafts AC.md with functional + non-functional criteria.</p>
                <p>Client reviews and approves.</p>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Tag created:</span>
                  <code>ac-baseline_otp-signup_2025-11-02</code>
                </div>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Event emitted:</span>
                  <code>AC.md ready → handoff to Forge</code>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Days 2-3</div>
            <div className={styles.timelineContent}>
              <h4>Daniel builds</h4>
              <div className={styles.timelineDetail}>
                <p>Daniel reads Rafael's event, starts building:</p>
                <ul>
                  <li>Implements OTP flow</li>
                  <li>Writes acceptance tests</li>
                  <li>Measures performance</li>
                </ul>
                <p><strong>Produces:</strong> Working demo, DEMO.md, DELTA.md: "p95: 1200ms → 280ms (↓77%)"</p>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Tag created:</span>
                  <code>evidence-sprint_otp-signup_2025-11-02</code>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 3</div>
            <div className={styles.timelineContent}>
              <h4>Sofia reviews</h4>
              <div className={styles.timelineDetail}>
                <p>Sofia reads Daniel's commit, checks for:</p>
                <ul>
                  <li>Silent fallbacks (none found)</li>
                  <li>Baseline guard compliance (✓)</li>
                  <li>Fail-loud principle (✓)</li>
                </ul>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Verdict:</span>
                  <code className={styles.pass}>pass</code>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 3</div>
            <div className={styles.timelineContent}>
              <h4>Maya publishes proof</h4>
              <div className={styles.timelineDetail}>
                <p>Maya reads Daniel's tag, generates /proof page:</p>
                <ul>
                  <li>Extracts AC.md, DEMO.md, DELTA.md from tag</li>
                  <li>Renders static proof page</li>
                  <li>Updates /proof index</li>
                </ul>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Live at:</span>
                  <code>/proof/evidence-sprint_otp-signup_2025-11-02</code>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 4</div>
            <div className={styles.timelineContent}>
              <h4>Aïcha verifies contracts</h4>
              <div className={styles.timelineDetail}>
                <p>Aïcha checks compliance:</p>
                <ul>
                  <li>AC.md has functional + non-functional + verification ✓</li>
                  <li>DEMO.md has URL + 3 bullets ✓</li>
                  <li>DELTA.md has 2+ quantified deltas ✓</li>
                  <li>All schemas valid ✓</li>
                </ul>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Event emitted:</span>
                  <code>contracts.verified@1.0</code>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDay}>Day 5</div>
            <div className={styles.timelineContent}>
              <h4>Priya monitors health</h4>
              <div className={styles.timelineDetail}>
                <p>Priya ensures OTP service is supervised:</p>
                <pre className={styles.miniCode}>{`otp_service:
  command: python otp_service.py
  readiness: http://localhost:5000/health`}</pre>
                <div className={styles.eventEmitted}>
                  <span className={styles.eventLabel}>Status:</span>
                  <code className={styles.pass}>healthy</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.workflowSummary}>
          <strong>Total coordination overhead:</strong> Zero meetings, zero manual handoffs. Just events.
        </div>
      </section>

      {/* What This Enables */}
      <section className={styles.benefitsSection}>
        <h2>What This Enables</h2>

        <div className={styles.benefitCard}>
          <h3>1. Parallel Work Streams</h3>
          <div className={styles.benefitComparison}>
            <div className={styles.benefitColumn}>
              <div className={styles.benefitLabel}>Traditional team:</div>
              <ul>
                <li>Developer 1: Backend (waits for frontend)</li>
                <li>Developer 2: Frontend (waits for backend)</li>
                <li>Sequential work = slow</li>
              </ul>
            </div>
            <div className={styles.benefitColumn}>
              <div className={styles.benefitLabel}>Citizen team:</div>
              <ul>
                <li>Daniel: Features + tests (parallel)</li>
                <li>Sofia: Quality review (real-time)</li>
                <li>Maya: /proof pages (automatic)</li>
                <li>Aïcha: Contract verification (automatic)</li>
              </ul>
              <p className={styles.emphasis}>Parallel work = fast.</p>
            </div>
          </div>
        </div>

        <div className={styles.benefitCard}>
          <h3>2. 24/7 Operation</h3>
          <p>Citizens don't sleep. Emma can parse 200 leads at 3 AM. Sofia can review commits on Sunday.</p>
          <div className={styles.operationSplit}>
            <div>
              <strong>Human bottleneck:</strong> Decision-making, client calls, creative work.
            </div>
            <div>
              <strong>Citizen work:</strong> Parsing, analysis, testing, quality checks, page generation.
            </div>
          </div>
        </div>

        <div className={styles.benefitCard}>
          <h3>3. Consistency</h3>
          <p>Humans have good days and bad days. Sofia's review quality is consistent every time.</p>
          <div className={styles.consistencyExample}>
            <div className={styles.consistencyRow}>
              <span className={styles.consistencyLabel}>Human reviewer (tired):</span>
              <span>Misses silent fallback</span>
            </div>
            <div className={styles.consistencyRow}>
              <span className={styles.consistencyLabel}>Sofia (always):</span>
              <span>Catches every silent fallback, every time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className={styles.infrastructureSection}>
        <h2>The Difference: 15 Years of Tooling</h2>

        <div className={styles.notThis}>
          <h3>This isn't:</h3>
          <ul>
            <li>Prompting ChatGPT better</li>
            <li>Writing clever system prompts</li>
            <li>Using AI for autocomplete</li>
          </ul>
        </div>

        <div className={styles.thisIs}>
          <h3>This is:</h3>
          <ul>
            <li>15 years of custom infrastructure (Mind Protocol)</li>
            <li>Event-native architecture</li>
            <li>Persistent memory graphs (FalkorDB)</li>
            <li>Multi-LLM orchestration (GPT-4, Claude, DeepSeek)</li>
            <li>Domain-specific citizens with ownership</li>
          </ul>
          <p className={styles.emphasis}>Built from scratch, not assembled from APIs.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2>Common Questions</h2>

        <div className={styles.faqItem}>
          <h3>Can I hire AI citizens for my project?</h3>
          <p>
            No. They're part of ScopeLock's delivery infrastructure.
          </p>
          <p>
            When you hire ScopeLock, you get:
          </p>
          <ul>
            <li>Nicolas (human: decisions, architecture, creative)</li>
            <li>Seven AI citizens (domain specialists)</li>
          </ul>
          <p>We don't rent them out separately.</p>
        </div>

        <div className={styles.faqItem}>
          <h3>How do you prevent AI hallucinations?</h3>
          <p><strong>Three mechanisms:</strong></p>
          <ol>
            <li><strong>Domain constraints:</strong> Citizens only work in their domain. Sofia doesn't write features, Daniel doesn't do client ops.</li>
            <li><strong>Verification:</strong> Everything is tested. Daniel writes code + acceptance tests. If tests fail, code doesn't ship.</li>
            <li><strong>Human review:</strong> Nicolas reviews citizen decisions. Citizens propose, Nicolas approves for high-risk choices.</li>
          </ol>
        </div>

        <div className={styles.faqItem}>
          <h3>What if a citizen makes a mistake?</h3>
          <p>Same as if a human makes a mistake:</p>
          <ul>
            <li>Tests catch it (automated)</li>
            <li>Sofia catches it (code review)</li>
            <li>Nicolas catches it (final review)</li>
            <li>Client catches it (AC green verification)</li>
          </ul>
          <p className={styles.emphasis}>Multiple layers of defense, same as any team.</p>
        </div>

        <div className={styles.faqItem}>
          <h3>How is this different from GitHub Copilot?</h3>
          <div className={styles.copilotComparison}>
            <div className={styles.copilotColumn}>
              <strong>Copilot:</strong>
              <ul>
                <li>Autocomplete (suggests next line)</li>
                <li>Stateless (no memory)</li>
                <li>General-purpose (no domain)</li>
                <li>Passive (waits for you to type)</li>
              </ul>
            </div>
            <div className={styles.copilotColumn}>
              <strong>AI Citizens:</strong>
              <ul>
                <li>Autonomous (makes decisions)</li>
                <li>Persistent memory (remembers everything)</li>
                <li>Domain-specific (owns a specialty)</li>
                <li>Proactive (emits events, drives work forward)</li>
              </ul>
            </div>
          </div>
          <p className={styles.emphasis}>Copilot is a tool. Citizens are teammates.</p>
        </div>
      </section>

      {/* Application */}
      <section className={styles.applicationSection}>
        <h2>How to Apply This</h2>

        <div className={styles.applicationCard}>
          <h3>If You're Building a Product</h3>
          <p>You don't need seven citizens. But you can adopt the principles:</p>
          <ol>
            <li><strong>Domain Ownership:</strong> Don't make AI "help with everything". Give it ONE job (code review, or testing, or docs).</li>
            <li><strong>Autonomous Decision-Making:</strong> Let AI decide routine choices. Human reviews, but doesn't micromanage.</li>
            <li><strong>Event-Driven:</strong> AI emits events ("test failed") instead of asking ("should I rerun?").</li>
          </ol>
        </div>

        <div className={styles.applicationCard}>
          <h3>If You're Hiring a Developer Who Says "AI-Assisted"</h3>
          <p>Ask three questions:</p>

          <div className={styles.hiringQuestion}>
            <h4>1. "How do you use AI?"</h4>
            <div className={styles.hiringAnswer}>
              <div className={styles.redFlag}>❌ Red flag: "ChatGPT for help"</div>
              <div className={styles.greenFlag}>✅ Green flag: "AI citizens with domain ownership"</div>
            </div>
          </div>

          <div className={styles.hiringQuestion}>
            <h4>2. "Can you show me your AI tooling?"</h4>
            <div className={styles.hiringAnswer}>
              <div className={styles.redFlag}>❌ Red flag: "Just ChatGPT and Copilot"</div>
              <div className={styles.greenFlag}>✅ Green flag: "Custom infrastructure, event-driven, persistent memory"</div>
            </div>
          </div>

          <div className={styles.hiringQuestion}>
            <h4>3. "Who makes decisions?"</h4>
            <div className={styles.hiringAnswer}>
              <div className={styles.redFlag}>❌ Red flag: "I ask AI, it suggests, I decide everything"</div>
              <div className={styles.greenFlag}>✅ Green flag: "AI citizens decide within their domain, I review"</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Composition */}
      <section className={styles.teamSection}>
        <h2>What's Next</h2>
        <p>At ScopeLock, AI citizens are core infrastructure, not a marketing claim.</p>

        <div className={styles.teamComposition}>
          <h3>When you hire ScopeLock, you get:</h3>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>Human</div>
              <div className={styles.teamName}>Nicolas</div>
              <div className={styles.teamResponsibilities}>Architecture, decisions, creative work</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Emma</div>
              <div className={styles.teamResponsibilities}>Lead intelligence</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Rafael</div>
              <div className={styles.teamResponsibilities}>Client ops</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Sofia</div>
              <div className={styles.teamResponsibilities}>Quality</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Daniel</div>
              <div className={styles.teamResponsibilities}>Features + tests</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Aïcha</div>
              <div className={styles.teamResponsibilities}>Architecture + schemas</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Maya</div>
              <div className={styles.teamResponsibilities}>UI + /proof</div>
            </div>
            <div className={styles.teamMember}>
              <div className={styles.teamRole}>AI Citizen</div>
              <div className={styles.teamName}>Priya</div>
              <div className={styles.teamResponsibilities}>Supervision</div>
            </div>
          </div>
        </div>

        <div className={styles.teamMetrics}>
          <strong>Team of 8. Throughput of 15.</strong>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Want to work with AI citizens?</h2>
        <div className={styles.ctaButtons}>
          <Link href="/" className={styles.ctaPrimary}>
            See our process
          </Link>
          <Link href="/#contact" className={styles.ctaSecondary}>
            Schedule a call
          </Link>
        </div>
      </section>

      {/* Footer nav */}
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backToIndex}>← Back to Blog</Link>
      </nav>
    </main>
  );
}
