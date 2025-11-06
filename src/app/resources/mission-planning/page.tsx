'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.css';

export default function MissionPlanningPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: boolean }>({});

  const toggleStep = (stepIndex: number) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const toggleExample = (exampleIndex: number) => {
    setExpandedExample(expandedExample === exampleIndex ? null : exampleIndex);
  };

  const revealQuiz = (quizIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [quizIndex]: true });
  };

  const planningSteps = [
    {
      number: 1,
      name: 'Parse the Job Post',
      emoji: '🔍',
      purpose: 'Extract signal from noise',
      actions: [
        'Identify the real pain point (not stated requirements)',
        'Flag red flags (vague scope, unrealistic timeline, price shopping)',
        'Assess client type (process-skeptical vs process-friendly)',
        'Check verification signals (payment verified, spend history, reviews)'
      ],
      example: 'Job: "Need React developer for food delivery app." Real pain: "Current app slow, losing customers." Red flag: No mention of existing codebase or tech stack.',
      output: 'Pain point statement + client type + red flags'
    },
    {
      number: 2,
      name: 'Evidence Sprint or Full Mission?',
      emoji: '⚡',
      purpose: 'Right-size the engagement',
      actions: [
        'Evidence Sprint ($3-6K, 2-5 days): Unclear requirements, new client, rescue scenario',
        'Full Mission ($8-15K, 1-3 weeks): Clear scope, proven client, defined deliverables',
        'Multi-Milestone ($25K+, 1-3 months): Large project, multiple phases, long-term partnership'
      ],
      example: 'Burned founder + vague requirements + "need it fast" = Evidence Sprint. Then upsell to Full Mission after proving value.',
      output: 'Engagement type decision'
    },
    {
      number: 3,
      name: 'Define Success Criteria',
      emoji: '🎯',
      purpose: 'What does "done" mean?',
      actions: [
        'Functional criteria (user can signup, data exports to CSV)',
        'Non-functional criteria (p95 response time <500ms, 99% uptime)',
        'Business outcomes (reduces admin time by 50%, handles 1000 concurrent users)',
        'Verification method (test command, seed data, expected output)'
      ],
      example: 'AC: User can sign up with email. Verification: `npm run test:e2e -- signup.spec.ts` passes with seed data.',
      output: 'AC.md draft (BEHAVIOR_SPEC)'
    },
    {
      number: 4,
      name: 'Break Into Milestones',
      emoji: '📦',
      purpose: 'Bite-sized, testable chunks',
      actions: [
        'Each milestone = 1 payment point',
        'Each milestone has its own AC.md',
        'Vertical slices (not horizontal layers)',
        'Dependencies explicit (M2 requires M1)'
      ],
      example: 'BAD: M1 = Database, M2 = API, M3 = Frontend. GOOD: M1 = Auth flow (DB + API + UI), M2 = Dashboard (DB + API + UI)',
      output: 'Milestone list with dependencies'
    },
    {
      number: 5,
      name: 'Estimate Timeline & Price',
      emoji: '⏱️',
      purpose: 'Lock scope, lock price',
      actions: [
        'Evidence Sprint: 2-5 days, $3-6K (based on complexity)',
        'Full Mission: 1-3 weeks, $8-15K (based on scope)',
        'Account for: Rafael code gen (fast), testing (Sofia), edge cases (human)',
        'Add buffer: 20% for unknowns'
      ],
      example: 'Auth flow: 3 days Rafael + 1 day testing + 0.5 day edge cases = 4.5 days × $1.5K/day = $6.75K → Quote $7K',
      output: 'Fixed price per milestone'
    },
    {
      number: 6,
      name: 'Identify Risks & Dependencies',
      emoji: '⚠️',
      purpose: 'No surprises',
      actions: [
        'Technical risks (third-party API, legacy codebase, performance)',
        'Scope risks (vague requirements, client indecision)',
        'Timeline risks (holidays, client availability, dependencies)',
        'Mitigation strategies (spike stories, contingency milestones)'
      ],
      example: 'Risk: Client has no API docs for existing system. Mitigation: M0 = API discovery sprint ($2K, 2 days) before quoting main work.',
      output: 'Risk register with mitigations'
    },
    {
      number: 7,
      name: 'Lock Scope (AC.md Baseline)',
      emoji: '🔒',
      purpose: 'Prevent scope creep',
      actions: [
        'Co-write AC.md with client (they approve criteria)',
        'Tag baseline: `git tag ac-baseline_auth_2025-11-06`',
        'Any changes → Change Request (Swap or Add)',
        'CI enforces: AC.md cannot change without CR tag'
      ],
      example: 'After baseline, client says "add Google OAuth." Response: "That\'s a Change Request. Swap (replace email with Google, same price) or Add (new milestone, +$3K)?"',
      output: 'Locked AC.md + git tag + change control process'
    }
  ];

  const realExamples = [
    {
      name: 'TherapyKin: Therapy Companion App',
      situation: 'Vague job post: "Need AI chatbot for therapy patients." No tech stack mentioned. Budget: $5K. Client: 0 hires, payment verified.',
      decision: 'Evidence Sprint',
      breakdown: [
        'Pain point: Therapists spending 30min/day on check-ins',
        'Real need: Automated check-in system with therapist dashboard',
        'Evidence Sprint: Text-only MVP ($5K, 4 days)',
        'M1: Patient can text bot, therapist sees summary',
        'AC: p95 response <5s, handles 10 concurrent chats',
        'Verification: Playwright E2E test with 2 seed patients'
      ],
      upsell: 'After Evidence Sprint success → Full Mission: Add voice interface, ElevenLabs integration, Airtable logging ($12K, 2 weeks)',
      outcome: '121+ deployments, client paid $17K total across 3 milestones'
    },
    {
      name: 'KongInvest: Trading Bot',
      situation: 'Clear job post: "Solana trading bot with Jupiter DEX integration, portfolio tracking, risk management." Budget: $15K. Client: 8 hires, 4.9 rating.',
      decision: 'Full Mission (2 milestones)',
      breakdown: [
        'M1: Core Trading ($8K, 1 week)',
        '  - AC: Bot can buy/sell via Jupiter API',
        '  - AC: Portfolio tracking in real-time',
        '  - AC: p95 trade execution <2s',
        '  - Verification: `npm run test:integration -- trading.spec.ts`',
        '',
        'M2: Risk Management ($7K, 1 week)',
        '  - AC: Stop-loss triggers automatically',
        '  - AC: Position sizing based on risk tolerance',
        '  - AC: Daily PnL reports',
        '  - Verification: `npm run test:e2e -- risk.spec.ts`'
      ],
      outcome: 'Deployed in 14 days, managing $75K AUM, client paid full $15K'
    },
    {
      name: 'Rescue Mission: Broken E-commerce',
      situation: 'Job: "Previous dev disappeared, checkout broken, losing $2K/day." Existing Next.js codebase. Budget: Urgent, will pay $10K.',
      decision: 'Evidence Sprint + Emergency Premium',
      breakdown: [
        'Risk: Unknown codebase quality',
        'Evidence Sprint: Fix checkout ($6K, 2 days)',
        '  - AC: User can complete purchase',
        '  - AC: Stripe webhook processes payment',
        '  - AC: Email confirmation sent',
        '  - Verification: Playwright E2E with Stripe test mode',
        '',
        'Emergency premium: +$2K for 48h delivery',
        'Total: $8K Evidence Sprint'
      ],
      upsell: 'After rescue → Full audit + refactor ($15K, 3 weeks)',
      outcome: 'Fixed in 36 hours, saved client $6K in lost revenue, upsold to full refactor'
    }
  ];

  const quizScenarios = [
    {
      scenario: 'Job post: "Need help with my SaaS dashboard." Budget: $3K. Client: 0 hires, payment not verified.',
      question: 'What should you do?',
      wrongAnswer: 'Quote Full Mission: $8K, 2 weeks',
      rightAnswer: 'NO-GO. Payment unverified = cannot transact. If they verify payment, then Evidence Sprint: $3K discovery to define real scope.',
      explanation: 'Payment verification is non-negotiable. Never start work without it. If they verify, use Evidence Sprint to clarify vague scope before quoting larger work.'
    },
    {
      scenario: 'Clear requirements: "Build REST API for mobile app. 8 endpoints, PostgreSQL, FastAPI. Need in 2 weeks." Budget: $12K. Client: 15 hires, 5.0 rating.',
      question: 'Evidence Sprint or Full Mission?',
      wrongAnswer: 'Evidence Sprint to prove value first',
      rightAnswer: 'Full Mission: $12K, 2 weeks, 2 milestones (M1: Core 4 endpoints + auth, M2: Remaining 4 endpoints + deployment)',
      explanation: 'Clear scope + proven client + reasonable budget = Full Mission. Evidence Sprint is for unclear requirements or unproven clients.'
    },
    {
      scenario: 'After baseline tag, client says: "Actually, can we use MongoDB instead of PostgreSQL?"',
      question: 'How do you respond?',
      wrongAnswer: '"Sure, no problem!" and make the change',
      rightAnswer: 'Change Request: "That\'s a Swap (same milestone, same price if equal complexity) or Add (new milestone if architecture changes). Let me assess..."',
      explanation: 'After baseline, ALL changes go through Change Control (CHG-130). Never silently accept scope changes. Assess if Swap (equal/lower complexity) or Add (new price).'
    },
    {
      scenario: 'Job: "Improve performance of existing React app." No specifics. Budget: $5K.',
      question: 'What\'s your approach?',
      wrongAnswer: 'Quote $5K for "performance improvements"',
      rightAnswer: 'Evidence Sprint: $3K for performance audit + 1 high-impact fix with measured delta (e.g., "Reduced bundle size 40%, p95 load time 800ms → 320ms"). Then quote full optimization.',
      explanation: 'Vague scope = Evidence Sprint to demonstrate measurable value. Show specific delta (quantified improvement) before quoting larger work.'
    }
  ];

  return (
    <main className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>
          ← Back to Resources
        </Link>

        <div className={styles.badge}>Onboarding Series #7</div>

        <h1 className={styles.title}>Mission Planning: From Job Post to Locked Scope</h1>

        <div className={styles.meta}>
          <span className={styles.metaItem}>⏱️ 20 min read</span>
          <span className={styles.metaItem}>🎯 Critical</span>
          <span className={styles.metaItem}>📋 Scoping Framework</span>
        </div>
      </header>

      {/* Lead Section */}
      <section className={styles.section}>
        <p className={styles.lead}>
          You found a promising job post. Now what? How do you scope it? Break it into milestones?
          Estimate timeline? Lock the scope so it doesn't explode?
        </p>

        <p className={styles.lead}>
          This guide teaches the 7-step framework from <strong>job post → locked AC.md baseline</strong>.
          By the end, you'll know how to plan missions that are properly scoped, fairly priced, and protected from scope creep.
        </p>
      </section>

      {/* Why This Matters */}
      <section className={styles.section}>
        <h2>Why Mission Planning Matters</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>💸</div>
            <h3>Bad Planning = Money Lost</h3>
            <p>Vague scope → scope creep → 3x effort → you work for $20/hour instead of $150/hour.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>⏰</div>
            <h3>Bad Planning = Time Wasted</h3>
            <p>Unclear requirements → false starts → rewrites → missed deadlines → angry client.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Good Planning = Fast Delivery</h3>
            <p>Clear AC.md → Rafael generates correct code first time → Sofia verifies → payment in 1 week.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🔒</div>
            <h3>Good Planning = Protected Scope</h3>
            <p>Locked baseline → change control (Swap/Add) → no free work → profitable missions.</p>
          </div>
        </div>
      </section>

      {/* The 7-Step Framework */}
      <section className={styles.section}>
        <h2>The 7-Step Planning Framework</h2>

        <div className={styles.stepsContainer}>
          {planningSteps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div
                className={styles.stepHeader}
                onClick={() => toggleStep(index)}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepTitle}>
                  <span className={styles.stepEmoji}>{step.emoji}</span>
                  <h3>{step.name}</h3>
                </div>
                <button className={styles.expandButton}>
                  {expandedStep === index ? '−' : '+'}
                </button>
              </div>

              {expandedStep === index && (
                <div className={styles.stepContent}>
                  <p className={styles.stepPurpose}>
                    <strong>Purpose:</strong> {step.purpose}
                  </p>

                  <div className={styles.stepActions}>
                    <strong>Actions:</strong>
                    <ul>
                      {step.actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.stepExample}>
                    <strong>Example:</strong>
                    <p>{step.example}</p>
                  </div>

                  <div className={styles.stepOutput}>
                    <strong>Output:</strong> {step.output}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Real Examples */}
      <section className={styles.section}>
        <h2>Real Mission Planning Examples</h2>
        <p className={styles.intro}>
          See how the 7-step framework was applied to actual ScopeLock missions.
        </p>

        <div className={styles.examplesContainer}>
          {realExamples.map((example, index) => (
            <div key={index} className={styles.exampleCard}>
              <div
                className={styles.exampleHeader}
                onClick={() => toggleExample(index)}
              >
                <h3>{example.name}</h3>
                <button className={styles.expandButton}>
                  {expandedExample === index ? '−' : '+'}
                </button>
              </div>

              {expandedExample === index && (
                <div className={styles.exampleContent}>
                  <div className={styles.exampleSection}>
                    <strong>Situation:</strong>
                    <p>{example.situation}</p>
                  </div>

                  <div className={styles.exampleSection}>
                    <strong>Decision:</strong>
                    <div className={styles.decisionBadge}>{example.decision}</div>
                  </div>

                  <div className={styles.exampleSection}>
                    <strong>Breakdown:</strong>
                    <ul>
                      {example.breakdown.map((line, i) => (
                        line.trim() ? <li key={i}>{line}</li> : <br key={i} />
                      ))}
                    </ul>
                  </div>

                  {example.upsell && (
                    <div className={styles.exampleSection}>
                      <strong>Upsell:</strong>
                      <p>{example.upsell}</p>
                    </div>
                  )}

                  <div className={styles.exampleSection}>
                    <strong>Outcome:</strong>
                    <p className={styles.outcomeText}>{example.outcome}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Evidence Sprint vs Full Mission Decision Tree */}
      <section className={styles.section}>
        <h2>Evidence Sprint vs Full Mission: Decision Tree</h2>

        <div className={styles.decisionTree}>
          <div className={styles.decisionNode}>
            <div className={styles.decisionQuestion}>Is scope clear and detailed?</div>

            <div className={styles.decisionBranches}>
              <div className={styles.decisionBranch}>
                <div className={styles.branchLabel}>❌ NO (vague, undefined)</div>
                <div className={styles.branchResult}>
                  <div className={styles.resultBadge}>Evidence Sprint</div>
                  <p>$3-6K, 2-5 days. Deliver demo + delta. Then quote full work.</p>
                </div>
              </div>

              <div className={styles.decisionBranch}>
                <div className={styles.branchLabel}>✅ YES (detailed requirements)</div>
                <div className={styles.decisionQuestion}>Is client proven?</div>

                <div className={styles.decisionBranches}>
                  <div className={styles.decisionBranch}>
                    <div className={styles.branchLabel}>❌ NO (0-2 hires, new account)</div>
                    <div className={styles.branchResult}>
                      <div className={styles.resultBadge}>Evidence Sprint</div>
                      <p>Prove value first, build trust, then upsell.</p>
                    </div>
                  </div>

                  <div className={styles.decisionBranch}>
                    <div className={styles.branchLabel}>✅ YES (5+ hires, good rating)</div>
                    <div className={styles.decisionQuestion}>Is budget ≥$8K?</div>

                    <div className={styles.decisionBranches}>
                      <div className={styles.decisionBranch}>
                        <div className={styles.branchLabel}>❌ NO (&lt;$8K)</div>
                        <div className={styles.branchResult}>
                          <div className={styles.resultBadge}>Evidence Sprint</div>
                          <p>Right-size to budget, upsell later.</p>
                        </div>
                      </div>

                      <div className={styles.decisionBranch}>
                        <div className={styles.branchLabel}>✅ YES (≥$8K)</div>
                        <div className={styles.branchResult}>
                          <div className={styles.resultBadge}>Full Mission</div>
                          <p>$8-15K, 1-3 weeks, 2-3 milestones.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className={styles.section}>
        <h2>Test Your Planning Skills</h2>
        <p className={styles.intro}>
          For each scenario, decide what you would do. Click to reveal the answer.
        </p>

        <div className={styles.quizContainer}>
          {quizScenarios.map((quiz, index) => (
            <div key={index} className={styles.quizCard}>
              <div className={styles.quizScenario}>
                <strong>Scenario {index + 1}:</strong>
                <p>{quiz.scenario}</p>
              </div>

              <div className={styles.quizQuestion}>
                <strong>{quiz.question}</strong>
              </div>

              {!quizAnswers[index] ? (
                <button
                  className={styles.revealButton}
                  onClick={() => revealQuiz(index)}
                >
                  Reveal Answer
                </button>
              ) : (
                <div className={styles.quizAnswer}>
                  <div className={styles.wrongAnswer}>
                    <strong>❌ Wrong:</strong> {quiz.wrongAnswer}
                  </div>
                  <div className={styles.rightAnswer}>
                    <strong>✅ Right:</strong> {quiz.rightAnswer}
                  </div>
                  <div className={styles.explanation}>
                    <strong>Why:</strong> {quiz.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className={styles.section}>
        <h2>Mission Planning Templates</h2>

        <div className={styles.templatesGrid}>
          <div className={styles.templateCard}>
            <h3>📋 Evidence Sprint Template</h3>
            <pre className={styles.codeBlock}>{`# Evidence Sprint: [Project Name]

## Client Context
- Pain point: [Real problem, not stated requirement]
- Client type: [Process-skeptical / Process-friendly]
- Budget: $[3-6K]
- Timeline: [2-5 days]

## Deliverables
- [ ] Working demo (≤90s video)
- [ ] Quantified delta (2-3 metrics)
- [ ] AC.md baseline for potential full mission

## Acceptance Criteria
1. [Functional: User can...]
2. [Functional: System does...]
3. [Non-functional: p95 response time <Xms]
4. [Non-functional: Handles X concurrent users]

## Verification
\`\`\`bash
npm run test:e2e -- [test-file].spec.ts
# Expected: All tests pass (green)
\`\`\`

## Upsell Path
If Evidence Sprint succeeds:
- Full Mission: $[8-15K], [1-3 weeks]
- Scope: [Extended functionality...]`}</pre>
          </div>

          <div className={styles.templateCard}>
            <h3>🎯 Full Mission Template</h3>
            <pre className={styles.codeBlock}>{`# Full Mission: [Project Name]

## Overview
- Budget: $[8-15K]
- Timeline: [1-3 weeks]
- Milestones: [2-3]

## Milestone 1: [Name] ($[X]K, [Y] days)
### Acceptance Criteria
1. [Functional criteria...]
2. [Non-functional: p95 <Xms, uptime >99%]

### Verification
\`\`\`bash
npm run test:e2e -- m1.spec.ts
\`\`\`

### Dependencies
- None (first milestone)

## Milestone 2: [Name] ($[X]K, [Y] days)
### Acceptance Criteria
1. [Functional criteria...]
2. [Non-functional criteria...]

### Verification
\`\`\`bash
npm run test:e2e -- m2.spec.ts
\`\`\`

### Dependencies
- Requires M1 complete (auth, database)

## Change Control
After baseline (\`ac-baseline_[name]_2025-XX-XX\`):
- Swap: Equal/lower complexity, same price
- Add: New milestone, new price

## Risk Register
1. [Risk]: [Mitigation strategy]
2. [Risk]: [Mitigation strategy]`}</pre>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className={styles.section}>
        <h2>Mission Planning Checklist</h2>

        <div className={styles.checklistBox}>
          <h3>Before Writing Proposal</h3>
          <ul className={styles.checklist}>
            <li>☐ Parse job post: Pain point identified (not just stated requirements)</li>
            <li>☐ Red flags checked: Payment verified, reasonable budget, clear scope</li>
            <li>☐ Client type detected: Process-skeptical or process-friendly</li>
            <li>☐ Engagement type decided: Evidence Sprint, Full Mission, or Multi-Milestone</li>
            <li>☐ Portfolio match selected: Which past project proves relevant capability</li>
          </ul>

          <h3>Before Starting Work</h3>
          <ul className={styles.checklist}>
            <li>☐ AC.md drafted: Functional + non-functional criteria defined</li>
            <li>☐ Verification method specified: Test command + seed data + expected output</li>
            <li>☐ Milestones defined: Each milestone = vertical slice = 1 payment point</li>
            <li>☐ Dependencies mapped: What requires what</li>
            <li>☐ Risks identified: Technical, scope, timeline risks with mitigations</li>
            <li>☐ Timeline estimated: Account for code gen + testing + edge cases + 20% buffer</li>
            <li>☐ Price locked: Fixed price per milestone</li>
          </ul>

          <h3>After Proposal Acceptance</h3>
          <ul className={styles.checklist}>
            <li>☐ AC.md co-written with client: They approve criteria</li>
            <li>☐ DoD checklist created: From Inna's BEHAVIOR_SPEC + VALIDATION</li>
            <li>☐ Baseline tagged: `git tag ac-baseline_[name]_2025-XX-XX`</li>
            <li>☐ Change control explained: Client understands Swap vs Add</li>
            <li>☐ Handoff to Rafael: Complete 6-level docs ready for code generation</li>
          </ul>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className={styles.section}>
        <h2>6 Common Mission Planning Mistakes</h2>

        <div className={styles.mistakesGrid}>
          <div className={styles.mistakeCard}>
            <h3>❌ Mistake 1: Quoting hours instead of outcomes</h3>
            <p className={styles.mistakeWhy}>
              <strong>Why it fails:</strong> Hours are unbounded. Client hears "40 hours" and expects it, then scope creeps to 80 hours.
            </p>
            <p className={styles.mistakeFix}>
              <strong>Fix:</strong> Quote fixed price for defined outcome. "Milestone 1: Auth flow working and tested, $6K." Not "40 hours at $150/hour."
            </p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake 2: Horizontal milestones (layers not slices)</h3>
            <p className={styles.mistakeWhy}>
              <strong>Why it fails:</strong> M1 = Database, M2 = API, M3 = Frontend means nothing works until M3. No value delivered until end.
            </p>
            <p className={styles.mistakeFix}>
              <strong>Fix:</strong> Vertical slices. M1 = Auth (DB + API + UI working). Client sees value immediately, pays sooner.
            </p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake 3: No baseline tag = invisible scope creep</h3>
            <p className={styles.mistakeWhy}>
              <strong>Why it fails:</strong> Client changes requirements mid-work. You do extra work for free because no baseline to point to.
            </p>
            <p className={styles.mistakeFix}>
              <strong>Fix:</strong> `git tag ac-baseline_auth_2025-11-06` after AC.md approval. All changes after = Change Request (Swap/Add).
            </p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake 4: Vague acceptance criteria</h3>
            <p className={styles.mistakeWhy}>
              <strong>Why it fails:</strong> "Auth should work" is not testable. Client says "not done" even when it works.
            </p>
            <p className={styles.mistakeFix}>
              <strong>Fix:</strong> Executable AC. "User can signup with email. Verification: `npm run test:e2e -- signup.spec.ts` passes."
            </p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake 5: No buffer for unknowns</h3>
            <p className={styles.mistakeWhy}>
              <strong>Why it fails:</strong> Estimate 5 days, quote 5 days. Edge case appears, now it's 7 days. You work for free.
            </p>
            <p className={styles.mistakeFix}>
              <strong>Fix:</strong> Estimate 5 days, add 20% buffer, quote 6 days. Unknown appears, still profitable.
            </p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake 6: Ignoring red flags in planning</h3>
            <p className={styles.mistakeWhy}>
              <strong>Why it fails:</strong> Payment unverified, vague scope, "urgent"... you quote anyway, waste time on NO-GO client.
            </p>
            <p className={styles.mistakeFix}>
              <strong>Fix:</strong> Red flags in Step 1 = stop. NO-GO and move to next opportunity. Time is your most valuable resource.
            </p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className={styles.section}>
        <h2>Summary: Mission Planning in 3 Sentences</h2>

        <div className={styles.summaryBox}>
          <p>
            <strong>1. Parse job post → Evidence Sprint or Full Mission decision.</strong>
          </p>
          <p>
            <strong>2. Break into vertical-slice milestones with executable AC.md and fixed prices.</strong>
          </p>
          <p>
            <strong>3. Lock baseline with git tag → change control (Swap/Add) protects scope.</strong>
          </p>
        </div>

        <p className={styles.finalThought}>
          Good mission planning = fast delivery, happy client, profitable work. Bad planning = scope creep, unpaid hours, angry client.
        </p>

        <p className={styles.finalThought}>
          Use the 7-step framework. Use the templates. Use the checklist. Lock the scope. Get paid.
        </p>
      </section>

      {/* Next Steps */}
      <section className={styles.nextSteps}>
        <h2>What's Next?</h2>
        <div className={styles.nextStepsGrid}>
          <Link href="/resources/complete-mission-flow" className={styles.nextStepCard}>
            <span className={styles.nextStepIcon}>🔄</span>
            <h3>Complete Mission Flow</h3>
            <p>Understand WHO does WHAT WHEN from job post to payment</p>
          </Link>

          <Link href="/resources/good-documentation" className={styles.nextStepCard}>
            <span className={styles.nextStepIcon}>📚</span>
            <h3>Good Documentation (PATTERN→GUIDE)</h3>
            <p>After planning, write complete 6-level docs for Rafael</p>
          </Link>

          <Link href="/resources/testing-mindset" className={styles.nextStepCard}>
            <span className={styles.nextStepIcon}>✅</span>
            <h3>Testing Mindset: AC Green</h3>
            <p>How Sofia verifies your milestones before delivery</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
