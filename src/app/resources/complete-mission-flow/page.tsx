'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './styles.module.css';

export default function CompleteMissionFlowPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: boolean }>({});

  const togglePhase = (phaseIndex: number) => {
    setExpandedPhase(expandedPhase === phaseIndex ? null : phaseIndex);
  };

  const toggleQuizAnswer = (questionIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: !quizAnswers[questionIndex]
    });
  };

  const phases = [
    {
      number: 1,
      name: 'ACQUIRE',
      emoji: '🎯',
      duration: '~2 min',
      owner: 'Bigbosexf',
      aiSupport: 'Emma',
      avatar: '/citizens/emma/avatar.png',
      description: 'Find job on Upwork and draft winning proposal'
    },
    {
      number: 2,
      name: 'SPECIFY',
      emoji: '📋',
      duration: 'TBD',
      owner: 'Reanance',
      aiSupport: 'Inna',
      avatar: '/citizens/inna/avatar.png',
      description: 'Lock scope with complete 6-level documentation'
    },
    {
      number: 3,
      name: 'BUILD',
      emoji: '⚙️',
      duration: '2-5 days',
      owner: 'Kara',
      aiSupport: 'Rafael',
      avatar: '/citizens/rafael/avatar.png',
      description: 'Generate code, test locally, deploy to production'
    },
    {
      number: 4,
      name: 'TEST',
      emoji: '✅',
      duration: '2-4 hours',
      owner: 'Bigbosexf',
      aiSupport: 'Sofia',
      avatar: '/citizens/sofia/avatar.png',
      description: 'QA testing against AC.md criteria'
    },
    {
      number: 5,
      name: 'DELIVER',
      emoji: '🚀',
      duration: '~1 day',
      owner: 'Reanance',
      aiSupport: 'Maya',
      avatar: '/citizens/maya/avatar.png',
      description: 'Present demo, client accepts, payment received'
    }
  ];

  return (
    <main className={styles.missionFlow}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>The Complete Mission Flow: Who Does What When</h1>
        <div className={styles.meta}>
          <time>Nov 5, 2025</time>
          <span>•</span>
          <span>12 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #2</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#onboarding</span>
          <span className={styles.tag}>#workflow</span>
          <span className={styles.tag}>#collaboration</span>
        </div>
        <div className={styles.resources}>
          📚 <strong>Resources:</strong>
          <a href="#quick-ref">Quick Reference Card</a> •
          <a href="#quiz">Quiz (Test Your Understanding)</a>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "I don't know what to do next."
        </p>
        <p>
          You're joining a team where <strong>AI does 95% of the heavy lifting</strong> and you supervise, deploy, and verify. But if you don't know WHO to ask when stuck, WHEN to escalate vs. continue, and WHAT a good handoff looks like...
        </p>
        <p className={styles.callout}>
          ...you'll waste hours in confusion instead of shipping fast.
        </p>
        <p>
          This guide shows the complete flow from "job posted on Upwork" to "client paid, testimonial received."
        </p>
      </section>

      {/* Visual Flow Diagram */}
      <section className={styles.visualFlow}>
        <h2>The Big Picture: 5 Phases</h2>
        <p className={styles.flowSubtitle}>From job post to payment in 1-2 weeks</p>

        <div className={styles.flowDiagram}>
          {phases.map((phase, index) => (
            <div key={phase.number} className={styles.flowPhaseWrapper}>
              <div className={styles.flowPhase}>
                <div className={styles.flowPhaseIcon}>{phase.emoji}</div>
                <div className={styles.flowPhaseNumber}>{phase.number}</div>
                <div className={styles.flowPhaseName}>{phase.name}</div>
                <div className={styles.flowPhaseDuration}>{phase.duration}</div>
              </div>
              {index < phases.length - 1 && (
                <div className={styles.flowArrow}>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                    <path d="M0 12 L50 12 M50 12 L45 7 M50 12 L45 17"
                          stroke="#1ee5b8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.flowTimeline}>
          <div className={styles.timelineBar}>
            <div className={styles.timelineProgress}></div>
          </div>
          <div className={styles.timelineLabels}>
            <span>Day 1</span>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Payment</span>
          </div>
        </div>
      </section>

      {/* Detailed Phase Cards */}
      <section className={styles.bigPicture}>
        <h2>Phase Details</h2>

        <div className={styles.phaseDiagram}>
          {phases.map((phase, index) => (
            <div key={phase.number} className={styles.phaseContainer}>
              <div
                className={`${styles.phase} ${expandedPhase === index ? styles.phaseExpanded : ''}`}
                onClick={() => togglePhase(index)}
              >
                <div className={styles.phaseHeader}>
                  <span className={styles.phaseNumber}>{phase.number}</span>
                  <h3>{phase.name}</h3>
                  <span className={styles.phaseDuration}>{phase.duration}</span>
                </div>

                <div className={styles.phaseOwner}>
                  <div className={styles.ownerInfo}>
                    <span className={styles.ownerLabel}>Owner:</span>
                    <span className={styles.ownerName}>{phase.owner}</span>
                  </div>
                  <div className={styles.aiSupportInfo}>
                    <Image
                      src={phase.avatar}
                      alt={phase.aiSupport}
                      width={32}
                      height={32}
                      className={styles.avatar}
                    />
                    <span className={styles.aiSupportName}>{phase.aiSupport} (AI)</span>
                  </div>
                </div>

                <p className={styles.phaseDescription}>{phase.description}</p>

                {expandedPhase === index && (
                  <div className={styles.phaseDetails}>
                    <a href={`#phase-${phase.number}`} className={styles.detailsLink}>
                      → Read detailed breakdown
                    </a>
                  </div>
                )}
              </div>

              {index < phases.length - 1 && (
                <div className={styles.arrow}>→</div>
              )}
            </div>
          ))}
        </div>

        <p className={styles.insight}>
          <strong>Key insight:</strong> Each phase has a clear owner, AI support, and handoff criteria.
        </p>
      </section>

      {/* Phase 1: ACQUIRE */}
      <section className={styles.phaseSection} id="phase-1">
        <div className={styles.phaseSectionHeader}>
          <h2>Phase 1: ACQUIRE (~2 minutes)</h2>
          <div className={styles.phaseSectionMeta}>
            <span>👤 Owner: <strong>Bigbosexf</strong></span>
            <span>🤖 AI Support: <strong>Emma</strong></span>
          </div>
        </div>

        <div className={styles.flowSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Search & Filter (Bigbosexf)</h4>
              <ol>
                <li>Open Upwork, search for jobs matching criteria</li>
                <li>Copy entire results page</li>
                <li>Paste to Emma: <code>"Emma, analyze these jobs"</code></li>
              </ol>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Emma's Analysis (AI, instant)</h4>
              <ul>
                <li>Emma reads all job posts</li>
                <li>Returns: <code>"3 NO-GO (reasons), 2 STRONG GO (confidence scores)"</code></li>
                <li>Provides brief rationale for each decision</li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Deep Dive (Bigbosexf)</h4>
              <ul>
                <li>Open each STRONG GO job</li>
                <li>Copy ENTIRE job description (don't summarize!)</li>
                <li>Paste to Emma: <code>"Emma, write proposal for this job"</code></li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h4>Emma Generates Complete Proposal (AI, ~60 seconds)</h4>
              <p>Emma produces:</p>
              <ul className={styles.checklist}>
                <li>✅ Full proposal text (plain text, ready to paste)</li>
                <li>✅ Answers to client questions</li>
                <li>✅ Metadata JSON (budget, timeline, client info)</li>
                <li>✅ Telegram notification to team</li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h4>Send (Bigbosexf)</h4>
              <ul>
                <li>Review Emma's proposal (30 seconds)</li>
                <li>Copy-paste into Upwork</li>
                <li>Submit!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.calloutBox}>
          <h4>⏱️ Duration: ~2 minutes per proposal</h4>
          <p>10 minutes = 2 proposals sent + 8 minutes for coffee ☕</p>
        </div>

        <div className={styles.escalationBox}>
          <h4>When to Escalate</h4>
          <ul>
            <li>❌ <strong>DON'T escalate:</strong> Emma says NO-GO → Trust her, move on</li>
            <li>✅ <strong>DO escalate:</strong> Client responds with technical question you can't answer → Telegram NLR</li>
          </ul>
        </div>
      </section>

      {/* Phase 2: SPECIFY */}
      <section className={styles.phaseSection} id="phase-2">
        <div className={styles.phaseSectionHeader}>
          <h2>Phase 2: SPECIFY (Duration: TBD)</h2>
          <div className={styles.phaseSectionMeta}>
            <span>👤 Owner: <strong>Reanance</strong></span>
            <span>🤖 AI Support: <strong>Inna</strong></span>
          </div>
        </div>

        <div className={styles.placeholder}>
          <p><strong>[PLACEHOLDER - Multi-step process being documented]</strong></p>
          <p>This phase involves:</p>
          <ol>
            <li>Client onboarding (with Maya's guidance)</li>
            <li>Requirements gathering</li>
            <li>Writing complete specifications with Inna (6 levels: PATTERN → BEHAVIOR_SPEC → VALIDATION → MECHANISM → ALGORITHM → GUIDE)</li>
            <li>Locking scope via AC.md baseline</li>
            <li>Creating DoD (Definition of Done) checklist</li>
          </ol>
        </div>

        <div className={styles.calloutBox}>
          <h4>What Gets Produced</h4>
          <ul className={styles.checklist}>
            <li>✅ AC.md (Acceptance Criteria)</li>
            <li>✅ DoD checklist</li>
            <li>✅ Architecture notes</li>
            <li>✅ Deployment guide</li>
            <li>✅ Test plan</li>
          </ul>
        </div>
      </section>

      {/* Phase 3: BUILD */}
      <section className={styles.phaseSection} id="phase-3">
        <div className={styles.phaseSectionHeader}>
          <h2>Phase 3: BUILD (2-5 days)</h2>
          <div className={styles.phaseSectionMeta}>
            <span>👤 Owner: <strong>Kara</strong></span>
            <span>🤖 AI Support: <strong>Rafael</strong></span>
          </div>
        </div>

        <div className={styles.flowSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Read Specs (Kara, 30 min)</h4>
              <ul>
                <li>Read Reanance's complete specs</li>
                <li>Check AC.md (what must work)</li>
                <li>Check DoD checklist (how we verify)</li>
                <li>Review architecture notes</li>
                <li>Check deployment guide</li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Generate Code (Rafael, AI, instant)</h4>
              <p>Kara asks Rafael:</p>
              <div className={styles.codeBlock}>
                <code>"Rafael, generate implementation for Mission #47 per Reanance's specs"</code>
              </div>
              <p>Rafael returns:</p>
              <ul className={styles.checklist}>
                <li>✅ Complete file structure</li>
                <li>✅ All code files</li>
                <li>✅ Dependencies (package.json, requirements.txt)</li>
                <li>✅ Configuration (.env.example)</li>
                <li>✅ Deployment instructions</li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Review & Test Locally (Kara, 2-4 hours)</h4>
              <ul>
                <li>Create project from Rafael's code</li>
                <li>Install dependencies</li>
                <li>Run locally</li>
                <li>Test against AC.md criteria</li>
                <li>Fix any obvious issues</li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h4>Deploy (Kara, 1-2 hours)</h4>
              <ul>
                <li>Deploy to Vercel (frontend) or Render (backend)</li>
                <li>Configure environment variables</li>
                <li>Test deployed version</li>
                <li>Verify all AC.md criteria pass on production</li>
              </ul>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h4>Update SYNC.md (Kara)</h4>
              <div className={styles.syncExample}>
                <pre>{`## 2025-11-05 14:30 - Kara: Mission #47 Deployed

**Status:** Deployed to production, ready for QA
**URL:** https://client-project.vercel.app
**What works:** All 5 AC.md criteria tested and passing
**Next:** Bigbosexf QA testing`}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.calloutBox}>
          <h4>⏱️ Duration</h4>
          <ul>
            <li><strong>Simple</strong> (landing page, bot): 2 days</li>
            <li><strong>Medium</strong> (CRUD dashboard, API integration): 3-4 days</li>
            <li><strong>Complex</strong> (multi-feature app): 5 days</li>
          </ul>
        </div>

        <div className={styles.escalationBox}>
          <h4>When to Escalate</h4>
          <p><strong>If stuck &gt;1 hour:</strong></p>
          <ol>
            <li>Try asking Rafael first: <code>"Rafael, I'm getting this error..."</code></li>
            <li>If still stuck after Rafael's guidance → <strong>Telegram NLR</strong></li>
            <li>If truly urgent/blocking → <strong>Call NLR</strong></li>
          </ol>
        </div>
      </section>

      {/* Phase 4: TEST */}
      <section className={styles.phaseSection} id="phase-4">
        <div className={styles.phaseSectionHeader}>
          <h2>Phase 4: TEST (2-4 hours)</h2>
          <div className={styles.phaseSectionMeta}>
            <span>👤 Owner: <strong>Bigbosexf</strong></span>
            <span>🤖 AI Support: <strong>Sofia</strong></span>
          </div>
        </div>

        <div className={styles.bugFixLoop}>
          <h3>Bug Fix Loop</h3>
          <div className={styles.flowChart}>
            <div className={styles.flowStep}>Bigbosexf finds bug</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>Talks to Kara (direct)</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>Kara fixes (with Rafael if needed)</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>Kara deploys fix</div>
            <div className={styles.flowArrow}>↓</div>
            <div className={styles.flowStep}>Bigbosexf re-tests ONLY fixed part</div>
            <div className={styles.flowSplit}>
              <div className={styles.flowBranch}>
                <span>❌ Still broken</span>
                <span className={styles.flowArrowLoop}>↺ Repeat</span>
              </div>
              <div className={styles.flowBranch}>
                <span>✅ Fixed</span>
                <span className={styles.flowArrowContinue}>→ Continue QA</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.escalationBox}>
          <h4>When to Escalate</h4>
          <ul>
            <li>❌ <strong>DON'T escalate:</strong> Bug found → Talk to Kara directly</li>
            <li>✅ <strong>DO escalate:</strong> Bug is critical AND Kara can't fix in 2 hours → Telegram NLR</li>
          </ul>
        </div>
      </section>

      {/* Phase 5: DELIVER */}
      <section className={styles.phaseSection} id="phase-5">
        <div className={styles.phaseSectionHeader}>
          <h2>Phase 5: DELIVER (~1 day)</h2>
          <div className={styles.phaseSectionMeta}>
            <span>👤 Owner: <strong>Reanance</strong></span>
            <span>🤖 AI Support: <strong>Maya</strong></span>
          </div>
        </div>

        <div className={styles.placeholder}>
          <p><strong>[PLACEHOLDER: Payment flow details TBD]</strong></p>
          <p><strong>[PLACEHOLDER: Team payment distribution TBD]</strong></p>
        </div>
      </section>

      {/* Decision Points Reference */}
      <section className={styles.decisionPoints}>
        <h2>"Who Do I Ask?"</h2>

        <table className={styles.referenceTable}>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Ask</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Code error &lt;1hr</td>
              <td><strong>Rafael</strong> (AI)</td>
              <td>He debugs instantly</td>
            </tr>
            <tr>
              <td>Code error &gt;1hr</td>
              <td><strong>NLR</strong> (Telegram)</td>
              <td>Need human guidance</td>
            </tr>
            <tr>
              <td>Bug in QA</td>
              <td><strong>Kara</strong> (direct)</td>
              <td>She's the implementer</td>
            </tr>
            <tr>
              <td>Client question</td>
              <td><strong>Reanance</strong> (with Maya/Rafael)</td>
              <td>Reanance owns client relationship</td>
            </tr>
            <tr>
              <td>Scope change</td>
              <td><strong>Reanance</strong> decides (or NLR)</td>
              <td>Reanance owns scope decisions</td>
            </tr>
            <tr>
              <td>Job evaluation</td>
              <td><strong>Emma</strong> (AI)</td>
              <td>She evaluates fit</td>
            </tr>
            <tr>
              <td>Ready for delivery?</td>
              <td><strong>Sofia</strong> (AI)</td>
              <td>She verifies DoD</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.escalationRule}>
          <h3>Escalation Rule</h3>
          <p>Stuck &gt;1 hour? → Try AI first → Still stuck? → NLR</p>
          <p>Urgent/blocking? → Call NLR</p>
        </div>
      </section>

      {/* Quiz */}
      <section className={styles.quiz} id="quiz">
        <h2>Quiz: Test Your Understanding</h2>

        <div className={styles.quizQuestion}>
          <h4>Scenario 1: You're Kara. You deployed the app but get a weird error you've never seen. You've been stuck for 45 minutes. What do you do?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(1)}
          >
            {quizAnswers[1] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[1] && (
            <div className={styles.quizAnswer}>
              <p><strong>Correct action:</strong></p>
              <ol>
                <li>Ask Rafael with specific context: "Rafael, I'm getting this error: [paste error]. I tried [X and Y]. What should I do?"</li>
                <li>If Rafael's solution doesn't work after 30 min → Telegram NLR with: error, what you tried, Rafael's suggestion</li>
              </ol>
              <p><strong>Why:</strong> Rafael can debug most issues instantly. Only escalate to NLR if Rafael can't solve it.</p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 2: You're Bigbosexf doing QA. You find a bug where the contact form doesn't send emails. What do you do?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(2)}
          >
            {quizAnswers[2] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[2] && (
            <div className={styles.quizAnswer}>
              <p><strong>Correct action:</strong></p>
              <ol>
                <li>Screenshot the bug</li>
                <li>Write reproduction steps</li>
                <li>Talk directly to Kara (don't go through NLR or Rafael first)</li>
                <li>Kara will fix (with Rafael's help if needed)</li>
                <li>Kara will let you know when to re-test</li>
              </ol>
              <p><strong>Why:</strong> Kara is the implementer. She owns the fix. Going through NLR wastes time.</p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 3: You're Reanance. Mid-implementation, the client says "Can we also add a blog section?" What do you do?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(3)}
          >
            {quizAnswers[3] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[3] && (
            <div className={styles.quizAnswer}>
              <p><strong>Correct action:</strong></p>
              <ol>
                <li>Check AC.md: Is "blog section" in scope?</li>
                <li>If NO → This is a change request</li>
                <li>Decide: Is this Swap (replace something with blog, same complexity) or Add (new milestone)?</li>
                <li>If SWAP: Update AC.md, tell Kara, continue</li>
                <li>If ADD: Create new milestone, price it, get client approval before scheduling</li>
                <li>If you're unsure which → Telegram NLR for guidance</li>
              </ol>
              <p><strong>Why:</strong> Reanance owns scope decisions. But if unclear, NLR helps decide.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Reference Card */}
      <section className={styles.quickRef} id="quick-ref">
        <h2>Quick Reference Card (Print & Keep)</h2>

        <div className={styles.refCard}>
          <h3>STUCK? WHO TO ASK</h3>
          <ul>
            <li>Code error &lt;1hr → <strong>Rafael</strong> (AI)</li>
            <li>Code error &gt;1hr → <strong>NLR</strong> (Telegram)</li>
            <li>Bug in QA → <strong>Kara</strong> (direct)</li>
            <li>Client question → <strong>Reanance</strong> (with Maya/Rafael)</li>
            <li>Scope change → <strong>Reanance</strong> decides (or NLR)</li>
            <li>Job evaluation → <strong>Emma</strong> (AI)</li>
            <li>Pricing guidance → <strong>Alexis</strong> (AI)</li>
            <li>Ready for delivery? → <strong>Sofia</strong> (AI)</li>
          </ul>

          <h3>ESCALATION RULE</h3>
          <p>Stuck &gt;1 hour? → Try AI first → Still stuck? → NLR</p>
          <p>Urgent/blocking? → Call NLR</p>
        </div>
      </section>

      {/* Next Steps */}
      <section className={styles.nextSteps}>
        <h2>Next Steps</h2>
        <p>Now you understand <strong>WHO does WHAT WHEN</strong>. Next articles cover:</p>
        <ol>
          <li><strong>How to Talk to AI Citizens</strong> - Get 3-5x faster by asking good questions</li>
          <li><strong>What Good Documentation Looks Like</strong> - So Rafael generates correct code first time</li>
          <li><strong>Testing Mindset: AC Green or It Didn't Happen</strong> - How Sofia checks your work</li>
        </ol>
        <p><strong>Ready to start?</strong> Ask NLR to assign you your first shadow mission (watch someone else's mission end-to-end).</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>This article is part of ScopeLock Team Onboarding.</p>
        <p>Questions? Ask in Telegram <a href="https://t.me/nlr_ai">@nlr_ai</a></p>
      </footer>
    </main>
  );
}
