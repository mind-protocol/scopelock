import Link from 'next/link';
import type { Metadata } from 'next';
import { FAQAccordion } from '../../components/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ — ScopeLock',
  description: 'Common questions about ScopeLock delivery, pricing, and acceptance criteria.',
};

const faqSections = [
  {
    title: 'Delivery & Process',
    questions: [
      {
        question: 'What does "AC green" mean?',
        answer: (
          <p>
            <strong>Acceptance Criteria green = all tests in AC.md pass.</strong> These are executable tests
            (Playwright, PyTest, etc.) with specific pass/fail conditions. You can run them yourself to verify.
            When CI shows green and performance thresholds are met, we invoice.
          </p>
        ),
      },
      {
        question: 'What if I need to change scope after we start?',
        answer: (
          <>
            <p>We route every scope change through Change Control (CHG-130):</p>
            <ul>
              <li><strong>Swap:</strong> Replace with equal/lower complexity → €0, same milestone</li>
              <li><strong>Add:</strong> New features beyond original scope → new milestone, priced separately</li>
            </ul>
            <p>You choose. You approve pricing before we proceed. No surprise costs.</p>
          </>
        ),
      },
      {
        question: 'What if I don\'t like the Evidence Sprint result?',
        answer: (
          <p>
            <strong>No obligation to continue.</strong> You keep the demo, code, and documentation.
            If you paid a deposit, you've already received working software for it.
          </p>
        ),
      },
      {
        question: 'How do I know the tests are real and not rigged?',
        answer: (
          <p>
            The Verification section in AC.md includes the exact command and seed data. Run the tests yourself.
            CI logs are public (if you want them). We can do a live walkthrough before you pay.
          </p>
        ),
      },
      {
        question: 'Can I see progress before it\'s done?',
        answer: (
          <p>
            Yes. Evidence Sprint shows working demo + quantified deltas in 2–5 days. You're not waiting
            in the dark until final delivery.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Pricing & Payment',
    questions: [
      {
        question: 'Why fixed-price instead of hourly?',
        answer: (
          <p>
            Hourly incentivizes slow work. Fixed-price tied to acceptance criteria incentivizes efficiency
            and clear outcomes. You know the total cost upfront. We can't pad hours.
          </p>
        ),
      },
      {
        question: 'What if it takes longer than expected?',
        answer: (
          <p>
            Our risk, not yours. Price is locked at ScopeLock phase. If we underestimated, we absorb the cost.
            You still pay the agreed amount only at AC green.
          </p>
        ),
      },
      {
        question: 'What if tests fail at delivery?',
        answer: (
          <p>
            We don't invoice. We fix until green or refund any deposit. Our standard: AC green or no payment.
          </p>
        ),
      },
      {
        question: 'Do you offer payment plans?',
        answer: (
          <p>
            For engagements &gt;$10K, we can split: 50% at baseline, 50% at AC green. For &lt;$10K, typical
            structure is 50% upfront, 50% at AC green (or 100% upfront for &lt;$5K).
          </p>
        ),
      },
    ],
  },
  {
    title: 'Technical',
    questions: [
      {
        question: 'What tech stacks do you work with?',
        answer: (
          <>
            <p><strong>Primary:</strong></p>
            <ul>
              <li><strong>Frontend:</strong> React, Next.js, Vue, React Native</li>
              <li><strong>Backend:</strong> Node.js, Python (FastAPI, Django), Go</li>
              <li><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</li>
              <li><strong>AI/ML:</strong> Claude API, OpenAI, LangChain, vector databases</li>
              <li><strong>Blockchain:</strong> Solana, Ethereum (if relevant)</li>
              <li><strong>Cloud:</strong> AWS, GCP, Vercel, Docker</li>
            </ul>
            <p>
              If your stack isn't listed, <Link href="/contact">ask</Link>. We evaluate case-by-case.
            </p>
          </>
        ),
      },
      {
        question: 'Do you handle DevOps/hosting?',
        answer: (
          <p>
            We can deploy to your infrastructure or set up new infrastructure as part of the project.
            Ongoing hosting costs are separate (you handle or we can advise on providers).
          </p>
        ),
      },
      {
        question: 'What about security?',
        answer: (
          <p>
            All code reviewed for common vulnerabilities (OWASP Top 10). We follow fail-loud patterns
            (no silent fallbacks). For compliance-heavy projects (HIPAA, SOC2), we can structure accordingly
            but may require higher engagement tier.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Working Together',
    questions: [
      {
        question: 'Are you an agency?',
        answer: (
          <>
            <p>
              <strong>No traditional agency.</strong> I'm Nicolas—the solo architect who designs everything. I oversee a small team of developers
              who implement under my supervision, with heavy AI assistance (Claude, Cursor, aider) for code generation.
              You work directly with me, not account managers.
            </p>
            <p>
              <strong>Mind Protocol</strong> is the organization name, but it's not an agency. It's my research org for AI consciousness infrastructure.
            </p>
          </>
        ),
      },
      {
        question: 'Do you use AI to write code?',
        answer: (
          <>
            <p>
              <strong>Yes, transparently.</strong> I use Claude, Cursor, and aider for AI-assisted development.
              GitHub shows <a href="https://github.com/nlr-ai" target="_blank" rel="noopener">65,000 commits in 2024</a>—you can see what's human-authored vs. AI-scaffolded.
              I don't hide the tooling.
            </p>
            <p>
              <strong>Result:</strong> 10-15 features/week vs. 2-3 for traditional solo dev. You get team-level throughput with single-architect clarity.
            </p>
          </>
        ),
      },
      {
        question: 'What timezone are you in?',
        answer: (
          <p>
            France-based (CET/CEST). Available for calls 14:00–19:00 Central European time. Async work
            happens 24/7 (AI citizens don't sleep). Most communication is async via SYNC.md, demos,
            and /proof links.
          </p>
        ),
      },
      {
        question: 'How fast can you start?',
        answer: (
          <p>
            Kickoff call typically within 72 hours of contact. Evidence Sprint delivery 2–5 days after
            baseline. We don't have long sales cycles.
          </p>
        ),
      },
      {
        question: 'Do you work with agencies or only direct clients?',
        answer: (
          <p>
            Both. If you're an agency needing overflow capacity or specialized AI work, we can structure
            as a subcontractor. Same model: AC.md → Evidence Sprint → AC green.
          </p>
        ),
      },
      {
        question: 'Can we hire you for ongoing work (retainer)?',
        answer: (
          <p>
            After first AC green milestone, we can discuss monthly retainer for continuous evolution
            (typically $5K–10K/month for priority access + 30–50 hours of work). Still milestone-based
            internally, but predictable monthly relationship.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Guarantees & Policies',
    questions: [
      {
        question: 'What if we disagree on whether AC is met?',
        answer: (
          <p>
            Tests decide. That's why we write executable acceptance criteria. If tests pass and
            thresholds are met, AC is satisfied. If they don't, it's not. No judgment calls,
            no ambiguity.
          </p>
        ),
      },
      {
        question: 'Do you offer refunds?',
        answer: (
          <p>
            If we fail to deliver AC green within agreed timeline and you want to terminate, any deposit
            paid is refunded minus the value of artefacts delivered (Evidence Sprint demo, code, docs).
            Typically we fix and deliver rather than refund, but option exists.
          </p>
        ),
      },
      {
        question: 'What if you disappear mid-project?',
        answer: (
          <p>
            All code is in git (you have access from day one). All AC criteria and tests are documented.
            Any other developer can continue from our work. Risk mitigation: milestones are atomic,
            you're never more than one milestone invested.
          </p>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main>
      <header className="hero">
        <h1>Frequently Asked Questions</h1>
        <p className="lead">Clear answers. No surprises. No hidden fine print.</p>
      </header>

      <FAQAccordion sections={faqSections} />

      <section className="card">
        <h2>Still have questions?</h2>
        <p>
          <Link href="/contact">Schedule a call</Link> or email scopelock@mindprotocol.ai
        </p>
        <p>
          We respond within 2 hours (typically).
        </p>
        <div className="hero-ctas" style={{marginTop: '2rem'}}>
          <Link className="cta" href="/contact">Schedule a call</Link>
          <Link href="/about">Learn more about us →</Link>
        </div>
      </section>
    </main>
  );
}
