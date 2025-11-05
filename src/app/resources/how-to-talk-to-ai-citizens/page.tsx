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
