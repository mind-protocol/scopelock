import type { Metadata } from 'next';
import { BadVsGoodComparison } from './components/BadVsGoodComparison';
import { ContextChecklist } from './components/ContextChecklist';
import { ScenarioCards } from './components/ScenarioCards';
import { QuickReferenceCard } from './components/QuickReferenceCard';
import { RedFlags } from './components/RedFlags';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'How to Talk to AI Citizens: Context Is Everything | ScopeLock Resources',
  description: 'Learn how to ask AI citizens (Rafael, Sofia, Emma) the right questions to get 3-5x faster results. Internal guide for ScopeLock team members.',
  keywords: ['AI prompting', 'context', 'ScopeLock training', 'AI citizens', 'Rafael', 'Sofia', 'Emma'],
};

export default function HowToTalkToAICitizensPage() {
  return (
    <main className={styles.resourcePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          How to Talk to AI Citizens: Context Is Everything
        </h1>
        <p className={styles.heroSubtitle}>
          Get complete working code in minutes instead of spending 6 hours debugging
        </p>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>3-5x</span>
            <span className={styles.statLabel}>Faster Completion</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>8+</span>
            <span className={styles.statLabel}>Hours/Day with AI</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>10+</span>
            <span className={styles.statLabel}>Active Projects</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className={styles.content}>
        {/* Why This Matters */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎯</span>
            Why This Matters
          </h2>
          <p className={styles.sectionIntro}>
            You'll spend 8+ hours every day asking AI citizens (Rafael, Sofia, Emma) for code generation,
            bug fixes, quality verification, and proposal help. The difference between effective and
            ineffective questions is dramatic:
          </p>

          <div className={styles.comparisonContainer}>
            <div className={styles.alertBox + ' ' + styles.danger}>
              <div className={styles.alertTitle}>❌ Bad Question</div>
              <div className={styles.alertContent}>
                Vague request → AI guesses wrong → 6 hours wasted debugging
              </div>
            </div>
            <div className={styles.alertBox + ' ' + styles.success}>
              <div className={styles.alertTitle}>✅ Good Question</div>
              <div className={styles.alertContent}>
                Full context → Exact solution → 2 minutes to working code
              </div>
            </div>
          </div>
        </section>

        {/* The Golden Rule */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>⭐</span>
            The Golden Rule
          </h2>
          <div className={styles.alertBox + ' ' + styles.info}>
            <div className={styles.alertTitle}>AI Citizens Work Across 10+ Projects</div>
            <div className={styles.alertContent}>
              Rafael, Sofia, and Emma don't have your context. They need to know: Which project?
              What goal? What error? What did you try? Without this, they're guessing.
            </div>
          </div>
        </section>

        {/* How to Give Context */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📋</span>
            How to Give Context (The Right Way)
          </h2>
          <p className={styles.sectionIntro}>
            Don't explain what you think the AI needs to know. Show them the actual source material:
          </p>

          <div className={styles.methodsGrid}>
            <div className={styles.methodCard + ' ' + styles.best}>
              <div className={styles.methodRank}>🥇 Best</div>
              <div className={styles.methodTitle}>Copy-Paste Content Directly</div>
              <div className={styles.methodExample}>
                "Here's the error I'm getting:<br/><br/>
                <code style={{ display: 'block', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', marginTop: '8px' }}>
                TypeError: Cannot read property 'map' of undefined<br/>
                  at UserList.tsx:42:18<br/>
                  at renderWithHooks
                </code>
                <br/>
                Here's the component code:<br/><br/>
                <code style={{ display: 'block', padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', marginTop: '8px' }}>
                const UserList = ({'{'} users {'}'}) =&gt; {'{'}<br/>
                &nbsp;&nbsp;return users.map(user =&gt; ...<br/>
                {'}'}
                </code>"
              </div>
              <div className={styles.methodWhy}>
                <strong>Why:</strong> AI sees exactly what you see. No ambiguity. Instant understanding.
              </div>
            </div>

            <div className={styles.methodCard + ' ' + styles.good}>
              <div className={styles.methodRank}>🥈 Good</div>
              <div className={styles.methodTitle}>Give File Pointers</div>
              <div className={styles.methodExample}>
                "I'm getting an error in <code>/src/components/UserList.tsx</code> line 42.<br/><br/>
                The relevant code is in the <code>renderUsers</code> function.<br/><br/>
                Also check <code>/src/types/User.ts</code> for the User interface."
              </div>
              <div className={styles.methodWhy}>
                <strong>Why:</strong> AI can read the files and see the exact code. Still precise.
              </div>
            </div>

            <div className={styles.methodCard + ' ' + styles.bad}>
              <div className={styles.methodRank}>❌ Don't</div>
              <div className={styles.methodTitle}>Try to Explain</div>
              <div className={styles.methodExample}>
                "There's a problem with the user list component. It's not working right when I try to show the users. I think it's something about the data not loading properly."
              </div>
              <div className={styles.methodWhy}>
                <strong>Why:</strong> Vague. AI has to guess what "not working" means. Wastes time.
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration Modes */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎚️</span>
            Setting the Pace: Collaboration Modes
          </h2>
          <p className={styles.sectionIntro}>
            You control how much autonomy you give the AI. Choose your mode based on complexity and familiarity:
          </p>

          <div className={styles.collaborationScale}>
            <div className={styles.scaleHeader}>
              <span className={styles.scaleLabel}>Very Collaborative</span>
              <span className={styles.scaleLabel}>Balanced</span>
              <span className={styles.scaleLabel}>Very Autonomous</span>
            </div>

            <div className={styles.scaleBar}>
              <div className={styles.scaleMarker} style={{ left: '0%' }}>1</div>
              <div className={styles.scaleMarker} style={{ left: '25%' }}>2</div>
              <div className={styles.scaleMarker} style={{ left: '50%' }}>3</div>
              <div className={styles.scaleMarker} style={{ left: '75%' }}>4</div>
              <div className={styles.scaleMarker} style={{ left: '100%' }}>5</div>
            </div>

            <div className={styles.modeCards}>
              <div className={styles.modeCard}>
                <div className={styles.modeNumber}>1</div>
                <div className={styles.modeTitle}>Micro-Step Mode</div>
                <div className={styles.modeExample}>
                  "Goal: Add user authentication.<br/><br/>
                  First, tell me your plan. Don't implement yet.<br/><br/>
                  [AI gives plan]<br/><br/>
                  OK, start with step 1 only. Show me the code for just the login form."
                </div>
                <div className={styles.modeUse}>
                  <strong>Use when:</strong> Learning new tech, critical feature, need to understand each step
                </div>
              </div>

              <div className={styles.modeCard}>
                <div className={styles.modeNumber}>2</div>
                <div className={styles.modeTitle}>Plan-First Mode</div>
                <div className={styles.modeExample}>
                  "Goal: Add user authentication.<br/><br/>
                  What's your plan? List the steps and files you'll modify.<br/><br/>
                  [Review plan]<br/><br/>
                  Looks good. Go ahead and implement the whole thing."
                </div>
                <div className={styles.modeUse}>
                  <strong>Use when:</strong> Medium complexity, want to verify approach before implementation
                </div>
              </div>

              <div className={styles.modeCard}>
                <div className={styles.modeNumber}>3</div>
                <div className={styles.modeTitle}>Checkpoint Mode</div>
                <div className={styles.modeExample}>
                  "Goal: Add user authentication.<br/><br/>
                  Implement it following our standard pattern (JWT + bcrypt).<br/><br/>
                  Check in with me before deploying."
                </div>
                <div className={styles.modeUse}>
                  <strong>Use when:</strong> Standard feature, trust the AI, just want final review
                </div>
              </div>

              <div className={styles.modeCard}>
                <div className={styles.modeNumber}>4</div>
                <div className={styles.modeTitle}>Test-First Mode</div>
                <div className={styles.modeExample}>
                  "Goal: Add user authentication.<br/><br/>
                  Here's the AC.md with acceptance criteria. Implement it, run the tests, deploy to staging.<br/><br/>
                  Just ping me when it's live."
                </div>
                <div className={styles.modeUse}>
                  <strong>Use when:</strong> Well-defined requirements, tests exist, routine implementation
                </div>
              </div>

              <div className={styles.modeCard}>
                <div className={styles.modeNumber}>5</div>
                <div className={styles.modeTitle}>Full Autonomy Mode</div>
                <div className={styles.modeExample}>
                  "Goal: Add user authentication following our standard pattern.<br/><br/>
                  Go ahead and do everything. Deploy to production when tests pass. Update the SYNC.md when done."
                </div>
                <div className={styles.modeUse}>
                  <strong>Use when:</strong> Simple task, established patterns, high trust, time-sensitive
                </div>
              </div>
            </div>
          </div>

          <div className={styles.alertBox + ' ' + styles.info}>
            <div className={styles.alertTitle}>💡 Pro Tip: Start Collaborative, Build Trust</div>
            <div className={styles.alertContent}>
              New to working with an AI citizen? Start at Mode 1-2 until you understand their capabilities.
              After a few successful missions, shift to Mode 3-4 for routine work.
              Mode 5 is for when you've built complete trust and have strong tests.
            </div>
          </div>
        </section>

        {/* Bad vs Good Examples */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔄</span>
            Bad vs Good: See the Difference
          </h2>
          <BadVsGoodComparison />
        </section>

        {/* Context Checklist */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>✓</span>
            The Context Checklist
          </h2>
          <p className={styles.sectionIntro}>
            Before asking ANY AI citizen for help, include these essential elements:
          </p>
          <ContextChecklist />
        </section>

        {/* Common Scenarios */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📋</span>
            Common Scenarios
          </h2>
          <p className={styles.sectionIntro}>
            Learn from real examples of how to ask for help in typical situations:
          </p>
          <ScenarioCards />
        </section>

        {/* Red Flags */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🚩</span>
            Red Flags (You're Doing It Wrong)
          </h2>
          <RedFlags />
        </section>

        {/* Quick Reference */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📌</span>
            Quick Reference Card
          </h2>
          <p className={styles.sectionIntro}>
            Copy this template to your desktop for quick reference when asking questions:
          </p>
          <QuickReferenceCard />
        </section>

        {/* Which AI Citizen for What */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🤖</span>
            Which AI Citizen for What?
          </h2>

          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🔍</span>
                Emma - Proposal Help
              </div>
              <div className={styles.cardContent}>
                <strong>Ask when:</strong> Writing Upwork proposals<br />
                <strong>Provide:</strong> Job post URL or full copy-paste
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>⚙️</span>
                Rafael - Code & Debugging
              </div>
              <div className={styles.cardContent}>
                <strong>Ask when:</strong> Implementing features, fixing bugs<br />
                <strong>Provide:</strong> Error messages, code snippets, project context
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>✅</span>
                Sofia - Pre-Delivery QA
              </div>
              <div className={styles.cardContent}>
                <strong>Ask when:</strong> Ready to deploy<br />
                <strong>Provide:</strong> Live URL, test credentials, AC.md requirements
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>📝</span>
                Inna - Documentation & Scope
              </div>
              <div className={styles.cardContent}>
                <strong>Ask when:</strong> Need mission specs or handling scope changes<br />
                <strong>Provide:</strong> Client requirements, change requests
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎓</span>
            Remember: Context = Speed
          </h2>

          <div className={styles.alertBox + ' ' + styles.success}>
            <div className={styles.alertTitle}>Key Takeaways</div>
            <div className={styles.alertContent}>
              <ul style={{ margin: '8px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>AI citizens are powerful but need context</li>
                <li>2 minutes writing a good question saves 4 hours of back-and-forth</li>
                <li>Every project is different → always specify which one</li>
                <li>Full error messages &gt; vague descriptions</li>
                <li>Screenshots of code are useless → copy-paste text</li>
              </ul>
            </div>
          </div>

          <div className={styles.alertBox + ' ' + styles.warning}>
            <div className={styles.alertTitle}>Your Goal</div>
            <div className={styles.alertContent}>
              Get Rafael/Sofia/Emma to say <em>"I can fix this immediately"</em> instead of <em>"I need more information"</em>
            </div>
          </div>
        </section>
      </article>

      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <h2 className={styles.footerCtaTitle}>Ready to Level Up?</h2>
        <p className={styles.footerCtaText}>
          Practice with real missions. Start asking better questions today.
        </p>
        <a href="/resources" className={styles.ctaButton}>
          Back to Resources
        </a>
      </section>
    </main>
  );
}
