import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';
import { DecisionTree } from './DecisionTree';

export const metadata: Metadata = {
  title: 'Change Control Without Scope Creep: CHG-130 Explained | ScopeLock Blog',
  description: '"Just one more feature" destroys projects. CHG-130 makes every change either Swap (€0) or Add (priced).',
  keywords: ['scope-creep', 'change-control', 'project-management', 'chg-130', 'baseline-protection'],
};

export default function ChangeControlPage() {
  return (
    <main className={styles.controlMode}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/blog" className={styles.backLink}>← Blog</Link>
        <h1>Change Control Without Scope Creep: CHG-130 Explained</h1>
        <div className={styles.meta}>
          <time>Nov 2, 2025</time>
          <span>•</span>
          <span>7 min read</span>
          <span>•</span>
          <span>Nicolas Lester Reynolds</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#scope-creep</span>
          <span className={styles.tag}>#change-control</span>
          <span className={styles.tag}>#chg-130</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>"Can we just add one more feature?"</p>
        <p className={styles.leadText}>Five words that destroy projects.</p>
        <p>
          Not because the feature is bad. Not because it's hard to build. But because "just one more" becomes twenty, the timeline doubles, the budget triples, and nobody knows who approved what.
        </p>
        <p className={styles.callout}>
          This is scope creep. <strong>CHG-130 eliminates it.</strong>
        </p>
      </section>

      {/* Problem */}
      <section className={styles.problemSection}>
        <h2>The Scope Creep Problem</h2>
        <p>Every project faces mid-course changes. Requirements shift. Priorities change. New opportunities emerge.</p>
        <p className={styles.keyQuestion}>
          The question isn't <strong>"Will scope change?"</strong><br/>
          It's <strong>"How do we handle it without chaos?"</strong>
        </p>

        <div className={styles.scenarioBox}>
          <h3>Scenario: Client asks for SMS notifications mid-project</h3>

          <div className={styles.responsesGrid}>
            <div className={styles.responseCard}>
              <div className={styles.responseLabel}>❌ Response A: "Sure, we'll add it"</div>
              <ul>
                <li>No re-scoping</li>
                <li>No price discussion</li>
                <li>Timeline slips by 2 weeks</li>
                <li>Final invoice: $15K higher than quote</li>
              </ul>
              <div className={styles.clientReaction}>
                Client: "Why am I paying for something I didn't approve?"
              </div>
            </div>

            <div className={styles.responseCard}>
              <div className={styles.responseLabel}>❌ Response B: "That's out of scope"</div>
              <ul>
                <li>Everything becomes a battle</li>
                <li>Client frustrated: "You're nickel-and-diming me"</li>
                <li>Relationship damaged</li>
                <li>Change requests avoided instead of managed</li>
              </ul>
              <div className={styles.clientReaction}>
                Client: "This is adversarial, not collaborative"
              </div>
            </div>

            <div className={styles.responseCard}>
              <div className={styles.responseLabel}>❌ Response C: "Let's discuss after MVP ships"</div>
              <ul>
                <li>Change deferred indefinitely</li>
                <li>Shipped product missing critical feature</li>
                <li>Post-launch scramble</li>
                <li>Two months of wasted "let's circle back"</li>
              </ul>
              <div className={styles.clientReaction}>
                Client: "This will never get prioritized"
              </div>
            </div>
          </div>

          <div className={styles.failureReason}>
            <strong>All three responses fail. Why?</strong> No clear change control process.
          </div>
        </div>
      </section>

      {/* CHG-130 Approach */}
      <section className={styles.approachSection}>
        <h2>The CHG-130 Approach</h2>
        <p className={styles.sectionIntro}>
          CHG-130 is our change control protocol. Every scope change goes through it.
        </p>

        <div className={styles.coreRule}>
          <strong>The core rule:</strong> After baseline, AC.md cannot change without a Change Request.
        </div>

        <div className={styles.baselineBox}>
          <h3>What "Baseline" Means</h3>
          <p>When we co-write AC.md and both parties sign off, we tag it:</p>
          <pre className={styles.commandBlock}>git tag ac-baseline_signup_2025-11-02</pre>

          <div className={styles.baselineMeans}>
            <h4>This tag means:</h4>
            <ul>
              <li><span className={styles.lockIcon}>🔒</span> Scope is frozen</li>
              <li><span className={styles.lockIcon}>💰</span> Price is locked</li>
              <li><span className={styles.lockIcon}>📅</span> Timeline is set</li>
              <li><span className={styles.lockIcon}>🔄</span> Any change requires CHG-130</li>
            </ul>
          </div>

          <div className={styles.baselineGuard}>
            <strong>The baseline guard:</strong> If anyone tries to modify AC.md after baseline without a CR, CI fails. No exceptions.
          </div>
        </div>
      </section>

      {/* Two Types */}
      <section className={styles.typesSection}>
        <h2>Two Types of Changes: Swap or Add</h2>
        <p>When a client requests a change, we classify it:</p>

        <div className={styles.typesGrid}>
          <div className={`${styles.typeCard} ${styles.swapCard}`}>
            <div className={styles.typeHeader}>
              <h3>Swap</h3>
              <span className={styles.typeCost}>€0, Same Milestone</span>
            </div>

            <div className={styles.typeDefinition}>
              <strong>Definition:</strong> Replace existing scope with equal/lower complexity.
            </div>

            <div className={styles.typeWhen}>
              <strong>When it applies:</strong>
              <ul>
                <li>Same milestone</li>
                <li>Equal or simpler implementation</li>
                <li>No new features, just substitution</li>
              </ul>
            </div>

            <div className={styles.typeExample}>
              <h4>Example: Email → SMS Notifications</h4>

              <div className={styles.exampleBox}>
                <div className={styles.exampleLabel}>Original AC.md:</div>
                <pre className={styles.exampleCode}>{`## Notification System
- Send email notifications on signup
- Send email notifications on password reset
- Email delivery rate > 99%`}</pre>
              </div>

              <div className={styles.exampleBox}>
                <div className={styles.exampleLabel}>Client requests:</div>
                <p>"Change email notifications to SMS"</p>
              </div>

              <div className={styles.exampleBox}>
                <div className={styles.exampleLabel}>Analysis:</div>
                <ul className={styles.analysisList}>
                  <li>✓ Same functionality (notifications)</li>
                  <li>✓ Similar complexity (both are external API calls)</li>
                  <li>✓ No new features (just swap delivery method)</li>
                </ul>
              </div>

              <div className={styles.decisionBox}>
                <strong>Decision: Swap</strong>
                <div className={styles.decisionDetails}>
                  <div>Price: <span className={styles.free}>€0</span> (same milestone)</div>
                  <div>Update AC.md: Replace "email" with "SMS"</div>
                  <div>Deliver within original timeline</div>
                </div>
              </div>

              <div className={styles.whyWorks}>
                <strong>Why it works:</strong> You're not asking for MORE, you're asking for DIFFERENT. Equal trade, no cost.
              </div>
            </div>
          </div>

          <div className={`${styles.typeCard} ${styles.addCard}`}>
            <div className={styles.typeHeader}>
              <h3>Add</h3>
              <span className={styles.typeCost}>New Milestone, Priced</span>
            </div>

            <div className={styles.typeDefinition}>
              <strong>Definition:</strong> New functionality beyond original scope.
            </div>

            <div className={styles.typeWhen}>
              <strong>When it applies:</strong>
              <ul>
                <li>New features</li>
                <li>Increased complexity</li>
                <li>Additional work beyond baseline</li>
              </ul>
            </div>

            <div className={styles.typeExample}>
              <h4>Example: Add Mobile Push Notifications</h4>

              <div className={styles.exampleBox}>
                <div className={styles.exampleLabel}>Original AC.md:</div>
                <pre className={styles.exampleCode}>{`## Notification System
- Send email notifications on signup
- Send email notifications on password reset`}</pre>
              </div>

              <div className={styles.exampleBox}>
                <div className={styles.exampleLabel}>Client requests:</div>
                <p>"Also add mobile push notifications"</p>
              </div>

              <div className={styles.exampleBox}>
                <div className={styles.exampleLabel}>Analysis:</div>
                <ul className={styles.analysisList}>
                  <li>⚠ New feature (push notifications)</li>
                  <li>⚠ New infrastructure (push service, mobile SDK)</li>
                  <li>⚠ Increased complexity (multi-platform support)</li>
                </ul>
              </div>

              <div className={styles.decisionBox}>
                <strong>Decision: Add</strong>
                <div className={styles.decisionDetails}>
                  <div>New milestone: "Mobile Push Notifications"</div>
                  <div>New AC.md created</div>
                  <div>Price: <span className={styles.priced}>$8K</span></div>
                  <div>Client approves before work begins</div>
                </div>
              </div>

              <div className={styles.whyWorks}>
                <strong>Why it works:</strong> You're asking for MORE. We scope it, price it, you approve it. No surprises.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Decision Tree */}
      <DecisionTree />

      {/* Workflow */}
      <section className={styles.workflowSection}>
        <h2>The CHG-130 Workflow</h2>

        <div className={styles.workflowSteps}>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Client Requests Change</h3>
              <p className={styles.stepDetail}>Client: "Can we change X to Y?"</p>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Rafael Opens Change Request</h3>
              <pre className={styles.stepCode}>git tag change-req_001_2025-11-02</pre>
              <div className={styles.stepDetail}>
                <strong>CR includes:</strong>
                <ul>
                  <li>What's being requested</li>
                  <li>Why (client rationale)</li>
                  <li>Current state vs desired state</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Aïcha Analyzes Complexity</h3>
              <div className={styles.analysisDecision}>
                <div className={styles.analysisOption}>
                  <span className={styles.arrow}>→</span> Same complexity or less? <strong>Swap candidate</strong>
                </div>
                <div className={styles.analysisOption}>
                  <span className={styles.arrow}>→</span> New features or higher complexity? <strong>Add candidate</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Classification Decision</h3>
              <div className={styles.decisionPaths}>
                <div className={styles.decisionPath}>
                  <h4>If Swap:</h4>
                  <ul>
                    <li>Price: €0</li>
                    <li>Update AC.md to reflect change</li>
                    <li>Deliver within original milestone</li>
                  </ul>
                </div>
                <div className={styles.decisionPath}>
                  <h4>If Add:</h4>
                  <ul>
                    <li>Create new milestone</li>
                    <li>Write new AC.md</li>
                    <li>Price the new work</li>
                    <li>Client approval required before starting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3>Delivery</h3>
              <pre className={styles.stepCode}>git tag change-delivered_001_2025-11-03</pre>
              <div className={styles.proofEntry}>
                <strong>Public proof entry generated:</strong>
                <ul>
                  <li><code>/proof/change-req_001</code></li>
                  <li>Shows: request → analysis → decision → delivery</li>
                  <li>Transparent change history</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className={styles.examplesSection}>
        <h2>Real Examples</h2>

        <div className={styles.exampleGrid}>
          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <h3>Example 1: Swap</h3>
              <span className={styles.exampleType}>Authentication Method</span>
            </div>
            <div className={styles.exampleContent}>
              <div className={styles.exampleRow}>
                <strong>Original:</strong> Email + password authentication
              </div>
              <div className={styles.exampleRow}>
                <strong>Request:</strong> Switch to OTP (passwordless)
              </div>
              <div className={styles.exampleAnalysis}>
                <strong>Analysis:</strong>
                <ul>
                  <li>Both are auth methods</li>
                  <li>OTP is actually simpler (no password storage)</li>
                  <li>Equal complexity</li>
                </ul>
              </div>
              <div className={styles.exampleOutcome}>
                <strong>Decision:</strong> <span className={styles.swap}>Swap (€0)</span><br/>
                <strong>Outcome:</strong> Delivered in original timeline, no price change
              </div>
            </div>
          </div>

          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <h3>Example 2: Add</h3>
              <span className={styles.exampleType}>Analytics Dashboard</span>
            </div>
            <div className={styles.exampleContent}>
              <div className={styles.exampleRow}>
                <strong>Original:</strong> User signup + profile management
              </div>
              <div className={styles.exampleRow}>
                <strong>Request:</strong> Add analytics dashboard with charts
              </div>
              <div className={styles.exampleAnalysis}>
                <strong>Analysis:</strong>
                <ul>
                  <li>New feature (analytics)</li>
                  <li>New infrastructure (data aggregation, charting library)</li>
                  <li>Significantly more complex</li>
                </ul>
              </div>
              <div className={styles.exampleOutcome}>
                <strong>Decision:</strong> <span className={styles.add}>Add (new milestone)</span><br/>
                <strong>Price:</strong> $12K<br/>
                <strong>Client:</strong> Approved<br/>
                <strong>Outcome:</strong> New AC.md created, Evidence Sprint → AC green
              </div>
            </div>
          </div>

          <div className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <h3>Example 3: Swap</h3>
              <span className={styles.exampleType}>UI Framework</span>
            </div>
            <div className={styles.exampleContent}>
              <div className={styles.exampleRow}>
                <strong>Original:</strong> Build with React
              </div>
              <div className={styles.exampleRow}>
                <strong>Request:</strong> Use Vue instead
              </div>
              <div className={styles.exampleAnalysis}>
                <strong>Analysis:</strong>
                <ul>
                  <li>Same output (UI components)</li>
                  <li>Same complexity (modern frameworks)</li>
                  <li>Personal preference, not new features</li>
                </ul>
              </div>
              <div className={styles.exampleOutcome}>
                <strong>Decision:</strong> <span className={styles.swap}>Swap (€0)</span><br/>
                <strong>Note:</strong> Requested early in project, minimal rework<br/>
                <strong>Outcome:</strong> Swapped, delivered on time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className={styles.whySection}>
        <h2>Why This Prevents Scope Creep</h2>

        <div className={styles.reasonsGrid}>
          <div className={styles.reasonCard}>
            <h3>1. Explicit Classification</h3>
            <p>Every change is either Swap or Add. No gray area.</p>
            <div className={styles.dialogue}>
              <div className={styles.dialogueItem}>
                <strong>Client can't say:</strong> "But it's just a small change!"
              </div>
              <div className={styles.dialogueItem}>
                <strong>We respond:</strong> "Small changes are Swaps (€0). This is Add (new scope)."
              </div>
            </div>
          </div>

          <div className={styles.reasonCard}>
            <h3>2. Price Transparency</h3>
            <p>Adds are priced <strong>before</strong> work begins.</p>
            <div className={styles.noSurprises}>
              <strong>No surprise invoices.</strong> Client approves the price, then we build.
            </div>
          </div>

          <div className={styles.reasonCard}>
            <h3>3. Baseline Protection</h3>
            <p>AC.md is frozen after baseline. Changes require CR.</p>
            <div className={styles.noDrift}>
              <strong>No scope drift.</strong> Everyone knows exactly what was originally agreed.
            </div>
          </div>

          <div className={styles.reasonCard}>
            <h3>4. Audit Trail</h3>
            <p>Every CR is tagged and generates a public proof entry.</p>
            <div className={styles.transparency}>
              <strong>Full transparency:</strong> Client can see every change request, decision, and delivery.
            </div>
          </div>
        </div>
      </section>

      {/* The Math */}
      <section className={styles.mathSection}>
        <h2>The Math That Matters</h2>

        <div className={styles.mathComparison}>
          <div className={styles.mathCard}>
            <h3>❌ Project without CHG-130</h3>
            <div className={styles.mathBreakdown}>
              <div className={styles.mathRow}>Original quote: <strong>$40K</strong></div>
              <div className={styles.mathRow}>"Just one more" × 12 changes</div>
              <div className={styles.mathRow}>Final invoice: <strong className={styles.surprise}>$73K</strong></div>
              <div className={styles.mathReaction}>
                Client: "I never approved this!"
              </div>
              <div className={styles.mathOutcome}>
                → Dispute, damaged relationship
              </div>
            </div>
          </div>

          <div className={`${styles.mathCard} ${styles.mathSuccess}`}>
            <h3>✅ Project with CHG-130</h3>
            <div className={styles.mathBreakdown}>
              <div className={styles.mathRow}>Original scope: <strong>$40K</strong> (baselined)</div>
              <div className={styles.mathRow}>4 Swaps (<span className={styles.free}>€0</span> each)</div>
              <div className={styles.mathRow}>3 Adds ($8K, $5K, $4K) — all approved upfront</div>
              <div className={styles.mathRow}>Final invoice: <strong className={styles.expected}>$57K</strong></div>
              <div className={styles.mathReaction}>
                Client: "I approved every Add, this is fair"
              </div>
              <div className={styles.mathOutcome}>
                → Trust maintained
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mathConclusion}>
          <strong>The difference:</strong> Transparency and control.
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <h2>Common Questions</h2>

        <div className={styles.faqItem}>
          <h3>"What if I'm not sure if something is Swap or Add?"</h3>
          <p>That's what the analysis phase is for (Step 3).</p>
          <p>We err on the side of transparency:</p>
          <ul>
            <li>If it's borderline, we explain both options</li>
            <li>Client decides if the Add is worth it</li>
            <li>If not, we stick with original scope</li>
          </ul>
        </div>

        <div className={styles.faqItem}>
          <h3>"What if I want to Swap multiple things?"</h3>
          <p>Each Swap is a separate CR.</p>
          <p><strong>Why?</strong> Audit trail. We want clear history of every change.</p>
        </div>

        <div className={styles.faqItem}>
          <h3>"What happens if we disagree on Swap vs Add?"</h3>
          <p>We provide complexity analysis:</p>
          <ul>
            <li>Lines of code estimate</li>
            <li>New dependencies required</li>
            <li>Infrastructure changes needed</li>
          </ul>
          <p>If it's genuinely equal complexity, it's a Swap. If it's more, it's an Add.</p>
          <p><strong>Disagreement is rare because the analysis is objective.</strong></p>
        </div>

        <div className={styles.faqItem}>
          <h3>"Can I cancel an Add after approving?"</h3>
          <div className={styles.cancellationPolicy}>
            <div className={styles.policyRow}>
              <strong>Before work starts:</strong> Yes, full refund.
            </div>
            <div className={styles.policyRow}>
              <strong>After work starts:</strong> Pro-rated based on completion %.
            </div>
            <div className={styles.policyRow}>
              <strong>After delivery:</strong> No refund (you got working code).
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>What's Next?</h2>
        <p>At ScopeLock, CHG-130 is mandatory. We don't accept projects without baseline protection.</p>

        <div className={styles.whyMandatory}>
          <strong>Why?</strong> It protects both parties:
          <div className={styles.protectionGrid}>
            <div><strong>Client:</strong> No surprise costs</div>
            <div><strong>Developer:</strong> No unpaid scope creep</div>
          </div>
        </div>

        <div className={styles.ctaButtons}>
          <Link href="/proof" className={styles.ctaPrimary}>
            See CHG-130 in action
          </Link>
          <Link href="/#contact" className={styles.ctaSecondary}>
            Schedule a call
          </Link>
        </div>

        <div className={styles.ctaNote}>
          Check our <Link href="/proof">Proof Log</Link> for real change request examples
        </div>
      </section>

      {/* Footer nav */}
      <nav className={styles.postNav}>
        <Link href="/blog" className={styles.backToIndex}>← Back to Blog</Link>
      </nav>
    </main>
  );
}
