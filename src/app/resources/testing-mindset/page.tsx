'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.css';

export default function TestingMindsetPage() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: boolean }>({});

  const toggleScenario = (scenarioIndex: number) => {
    setExpandedScenario(expandedScenario === scenarioIndex ? null : scenarioIndex);
  };

  const toggleQuizAnswer = (questionIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: !quizAnswers[questionIndex]
    });
  };

  const testingLevels = [
    {
      level: 'Unit Tests',
      emoji: '🔬',
      scope: 'Individual functions/components',
      who: 'Rafael generates + Kara verifies',
      example: 'Does signupWithEmail() return error for invalid email?',
      speed: 'Fast (milliseconds)',
      when: 'After writing each function'
    },
    {
      level: 'Integration Tests',
      emoji: '🔗',
      scope: 'Multiple components working together',
      who: 'Rafael generates + Kara verifies',
      example: 'Does auth flow work with database + Redis?',
      speed: 'Medium (seconds)',
      when: 'After connecting components'
    },
    {
      level: 'E2E Tests',
      emoji: '🎭',
      scope: 'Full user flows in real browser',
      who: 'Inna defines + Rafael generates + Sofia runs',
      example: 'Can user sign up → verify OTP → see dashboard?',
      speed: 'Slow (10-30 seconds per test)',
      when: 'Before claiming AC Green'
    },
    {
      level: 'Manual Testing',
      emoji: '👤',
      scope: 'Human verification of UX/edge cases',
      who: 'Bigbosexf (QA)',
      example: 'Does the app feel responsive? Any visual bugs?',
      speed: 'Slowest (minutes)',
      when: 'Final verification before delivery'
    }
  ];

  return (
    <main className={styles.testingMindset}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>Testing Mindset: AC Green or It Didn't Happen</h1>
        <div className={styles.meta}>
          <time>Nov 6, 2025</time>
          <span>•</span>
          <span>15 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #6</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#onboarding</span>
          <span className={styles.tag}>#testing</span>
          <span className={styles.tag}>#quality</span>
        </div>
        <div className={styles.resources}>
          📚 <strong>Resources:</strong>
          <a href="#quick-ref">Testing Checklist</a> •
          <a href="#examples">Real Scenarios</a> •
          <a href="#quiz">Quiz</a>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "It compiled. Ship it."
        </p>
        <p>
          You're Kara. You just finished implementing a feature. You ran <code>npm run build</code>. No errors. You deployed to Vercel. The page loads. <strong>You tell the team it's ready.</strong>
        </p>
        <p className={styles.callout}>
          <strong>But did you test it?</strong> Did you try signing up with an invalid email? Did you check if the OTP actually arrives? Did you verify the session expires after 7 days?
        </p>
        <p>
          <strong>No.</strong> You assumed it works because it compiled.
        </p>
        <p className={styles.danger}>
          Bigbosexf tests it. Finds 3 bugs. Client sees broken demo. <strong>You wasted 4 hours.</strong>
        </p>
      </section>

      {/* The Iron Law */}
      <section className={styles.ironLaw}>
        <h2>The Iron Law of ScopeLock</h2>

        <div className={styles.lawBox}>
          <h3>🔒 AC Green or It Didn't Happen</h3>
          <p className={styles.lawStatement}>
            <strong>If the acceptance tests don't pass, the feature doesn't exist.</strong>
          </p>
          <p>
            Not "mostly works." Not "works on my machine." Not "I manually tested it once."
          </p>
          <p>
            <strong>Green tests = Feature exists.</strong><br />
            <strong>Red/missing tests = Feature doesn't exist.</strong>
          </p>
        </div>

        <div className={styles.whyItMatters}>
          <h3>Why This Matters</h3>
          <ul>
            <li><strong>Client trust:</strong> Green tests = objective proof. Client sees we delivered what we promised.</li>
            <li><strong>Payment:</strong> We only get paid when tests pass. No green = no money.</li>
            <li><strong>Future you:</strong> When you touch this code again in 3 months, tests prevent breaking existing features.</li>
            <li><strong>Team coordination:</strong> Green tests mean Bigbosexf can verify quickly without guessing what to test.</li>
            <li><strong>Reputation:</strong> Shipping broken code = client complains on Upwork = harder to win future jobs.</li>
          </ul>
        </div>

        <div className={styles.falseEquivalences}>
          <h3>❌ False Equivalences (Don't Fall for These)</h3>
          <div className={styles.falseGrid}>
            <div className={styles.falseCard}>
              <h4>"It compiled" ≠ "It works"</h4>
              <p>TypeScript catches type errors. It doesn't verify business logic, API calls, or user flows.</p>
            </div>
            <div className={styles.falseCard}>
              <h4>"I tested it once" ≠ "It's tested"</h4>
              <p>Manual testing is unreliable. You forget edge cases. Automated tests run every time.</p>
            </div>
            <div className={styles.falseCard}>
              <h4>"The page loads" ≠ "The feature works"</h4>
              <p>The page can load but the form doesn't submit, the email doesn't send, the session doesn't persist.</p>
            </div>
            <div className={styles.falseCard}>
              <h4>"No errors in console" ≠ "It's correct"</h4>
              <p>Silent failures are common. Email might not send. Database write might fail. No error shown.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Testing Levels */}
      <section className={styles.testingLevels}>
        <h2>The 4 Testing Levels</h2>

        <p className={styles.intro}>
          Each level catches different types of bugs. <strong>You need all 4</strong> for AC Green.
        </p>

        <div className={styles.levelsGrid}>
          {testingLevels.map((level, index) => (
            <div key={index} className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <span className={styles.levelEmoji}>{level.emoji}</span>
                <h3>{level.level}</h3>
              </div>
              <div className={styles.levelContent}>
                <p><strong>Scope:</strong> {level.scope}</p>
                <p><strong>Who:</strong> {level.who}</p>
                <p><strong>Example:</strong> {level.example}</p>
                <p><strong>Speed:</strong> {level.speed}</p>
                <p><strong>When:</strong> {level.when}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.levelsPyramid}>
          <h3>The Testing Pyramid (Quantity)</h3>
          <div className={styles.pyramid}>
            <div className={styles.pyramidLevel} style={{ width: '25%' }}>
              <span>👤 Manual (5-10 tests)</span>
            </div>
            <div className={styles.pyramidLevel} style={{ width: '50%' }}>
              <span>🎭 E2E (10-20 tests)</span>
            </div>
            <div className={styles.pyramidLevel} style={{ width: '75%' }}>
              <span>🔗 Integration (20-40 tests)</span>
            </div>
            <div className={styles.pyramidLevel} style={{ width: '100%' }}>
              <span>🔬 Unit (50-100 tests)</span>
            </div>
          </div>
          <p className={styles.pyramidExplanation}>
            <strong>Bottom-heavy pyramid:</strong> Many fast unit tests, fewer slow E2E tests, minimal manual testing.
          </p>
        </div>
      </section>

      {/* Real Scenarios */}
      <section className={styles.scenarios} id="examples">
        <h2>Real Scenarios: What Can Go Wrong</h2>

        <div className={styles.scenariosList}>
          <div
            className={styles.scenarioCard}
            onClick={() => toggleScenario(0)}
          >
            <div className={styles.scenarioHeader}>
              <h3>❌ Scenario 1: "It works on my machine"</h3>
              <button className={styles.expandButton}>
                {expandedScenario === 0 ? '−' : '+'}
              </button>
            </div>
            {expandedScenario === 0 && (
              <div className={styles.scenarioContent}>
                <p><strong>What happened:</strong></p>
                <p>Kara implemented auth. Tested locally. Everything works. Deployed to Vercel. Client reports: "Can't sign up."</p>

                <p><strong>Root cause:</strong></p>
                <p>Kara's local <code>.env</code> has <code>SENDGRID_API_KEY</code>. Vercel doesn't (forgot to set env var). No email sends. No tests caught this.</p>

                <p><strong>What should have happened:</strong></p>
                <ul>
                  <li>✅ E2E test: "user receives OTP email" (would fail on Vercel)</li>
                  <li>✅ Integration test: "sendEmail() returns success" (would fail without API key)</li>
                  <li>✅ Sofia's DoD checklist: "Verify all env vars set in Vercel"</li>
                </ul>

                <p><strong>Lesson:</strong> Test in production environment, not just locally.</p>
              </div>
            )}
          </div>

          <div
            className={styles.scenarioCard}
            onClick={() => toggleScenario(1)}
          >
            <div className={styles.scenarioHeader}>
              <h3>❌ Scenario 2: "I tested the happy path"</h3>
              <button className={styles.expandButton}>
                {expandedScenario === 1 ? '−' : '+'}
              </button>
            </div>
            {expandedScenario === 1 && (
              <div className={styles.scenarioContent}>
                <p><strong>What happened:</strong></p>
                <p>Kara tested signup with valid email. Works. Didn't test invalid email. Client enters "notanemail". App crashes.</p>

                <p><strong>Root cause:</strong></p>
                <p>No validation for email format. No test for error case.</p>

                <p><strong>What should have happened:</strong></p>
                <ul>
                  <li>✅ Unit test: "signupWithEmail() returns error for invalid format"</li>
                  <li>✅ E2E test: "user sees error message for invalid email"</li>
                  <li>✅ Test both happy path AND error paths</li>
                </ul>

                <p><strong>Lesson:</strong> Test edge cases, not just happy paths.</p>
              </div>
            )}
          </div>

          <div
            className={styles.scenarioCard}
            onClick={() => toggleScenario(2)}
          >
            <div className={styles.scenarioHeader}>
              <h3>❌ Scenario 3: "Tests pass but feature is broken"</h3>
              <button className={styles.expandButton}>
                {expandedScenario === 2 ? '−' : '+'}
              </button>
            </div>
            {expandedScenario === 2 && (
              <div className={styles.scenarioContent}>
                <p><strong>What happened:</strong></p>
                <p>All tests green. Client reports: "Session expires after 1 hour, not 7 days."</p>

                <p><strong>Root cause:</strong></p>
                <p>Code says <code>maxAge: 7 * 24 * 60</code> (minutes, not seconds). Tests mock the cookie, don't verify actual expiry.</p>

                <p><strong>What should have happened:</strong></p>
                <ul>
                  <li>✅ Integration test: "JWT cookie expires in 7 days" (check actual cookie, not mock)</li>
                  <li>✅ Test matches AC.md non-functional criteria: "Session expires after 7 days"</li>
                </ul>

                <p><strong>Lesson:</strong> Tests must verify actual behavior, not mocks.</p>
              </div>
            )}
          </div>

          <div
            className={styles.scenarioCard}
            onClick={() => toggleScenario(3)}
          >
            <div className={styles.scenarioHeader}>
              <h3>✅ Scenario 4: "AC Green done right"</h3>
              <button className={styles.expandButton}>
                {expandedScenario === 3 ? '−' : '+'}
              </button>
            </div>
            {expandedScenario === 3 && (
              <div className={styles.scenarioContent}>
                <p><strong>What happened:</strong></p>
                <p>Kara implemented auth. Ran all tests locally → green. Deployed to Vercel. Ran E2E tests against production → green. Sofia verified DoD checklist → all ✅. Client demo → perfect.</p>

                <p><strong>Why it worked:</strong></p>
                <ul>
                  <li>✅ Unit tests: All functions verified (email validation, OTP generation, JWT signing)</li>
                  <li>✅ Integration tests: Database + Redis + SendGrid work together</li>
                  <li>✅ E2E tests: Full signup/login flows work in production</li>
                  <li>✅ Manual: Bigbosexf tested edge cases (spam folder, expired OTP, invalid JWT)</li>
                  <li>✅ DoD: Sofia verified all AC.md criteria + env vars + performance thresholds</li>
                </ul>

                <p><strong>Result:</strong> Client accepted immediately. Payment received. Zero rework.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sofia's DoD Verification Process */}
      <section className={styles.sofiaProcess}>
        <h2>How Sofia Verifies Your Work</h2>

        <p className={styles.intro}>
          Sofia is your QA citizen. She verifies AC Green BEFORE you claim "ready for delivery."
        </p>

        <div className={styles.dodSteps}>
          <div className={styles.dodStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Read AC.md</h3>
              <p>Sofia reads the acceptance criteria from Inna's BEHAVIOR_SPEC. She knows exactly what "done" means.</p>
            </div>
          </div>

          <div className={styles.dodStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Run Automated Tests</h3>
              <p>Sofia runs <code>npm run test</code> (unit + integration) and <code>npm run test:e2e</code> (end-to-end). All must be green.</p>
            </div>
          </div>

          <div className={styles.dodStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Verify Deployment</h3>
              <p>Sofia checks the production URL. Is it accessible? Does the feature exist? Are there console errors?</p>
            </div>
          </div>

          <div className={styles.dodStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Check Performance Thresholds</h3>
              <p>Sofia verifies non-functional criteria from AC.md. Is API response p95 &lt; 200ms? Is page load &lt; 2s?</p>
            </div>
          </div>

          <div className={styles.dodStep}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3>Verify DoD Checklist</h3>
              <p>Sofia checks Inna's DoD checklist. Are all items ✅? Documentation updated? Env vars set? Tests written?</p>
            </div>
          </div>

          <div className={styles.dodStep}>
            <div className={styles.stepNumber}>6</div>
            <div className={styles.stepContent}>
              <h3>Return Verdict</h3>
              <p><strong>AC Green:</strong> All criteria met → Handoff to NLR for delivery.<br /><strong>Not Green:</strong> Specific issues listed → Back to developer for fixes.</p>
            </div>
          </div>
        </div>

        <div className={styles.sofiaOutput}>
          <h3>Example Sofia Output</h3>
          <div className={styles.outputBox}>
            <pre>{`## Sofia's Verification Report

**Mission:** User Authentication (auth-feature-001)
**Developer:** Kara
**Date:** 2025-11-06

### AC.md Criteria (3/3 ✅)
✅ AC#1: User can signup with email (E2E test: auth/signup.spec.ts)
✅ AC#2: User can login with email (E2E test: auth/login.spec.ts)
✅ AC#3: Session expires after 7 days (Integration test: auth.test.ts:42)

### Non-Functional Criteria (3/3 ✅)
✅ OTP delivery p95 < 5s (measured: 2.3s avg via SendGrid logs)
✅ Login API p95 < 200ms (measured: 145ms p95 via Vercel analytics)
✅ No console errors (verified in Chrome DevTools)

### Test Results
✅ Unit tests: 12/12 passed (coverage: 94%)
✅ Integration tests: 8/8 passed
✅ E2E tests: 5/5 passed (production environment)

### DoD Checklist (6/6 ✅)
✅ All AC.md criteria verified
✅ Deployment accessible (https://client-project.vercel.app)
✅ Environment variables set (DATABASE_URL, REDIS_URL, SENDGRID_API_KEY, JWT_SECRET)
✅ Documentation updated (AC.md, GUIDE.md)
✅ Tests written and passing
✅ Performance thresholds met

### VERDICT: ✅ AC GREEN

Ready for delivery. No issues found.

— Sofia`}</pre>
          </div>
        </div>
      </section>

      {/* Common Testing Mistakes */}
      <section className={styles.mistakes}>
        <h2>Common Testing Mistakes (And How to Fix)</h2>

        <div className={styles.mistakesGrid}>
          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: "I'll write tests later"</h3>
            <p><strong>Reality:</strong> You won't. Later never comes. You ship untested code.</p>
            <p><strong>Fix:</strong> Write tests BEFORE claiming done. Make it part of your implementation workflow.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: "Testing is QA's job"</h3>
            <p><strong>Reality:</strong> Bigbosexf finds bugs you should have caught. Wastes 2+ hours.</p>
            <p><strong>Fix:</strong> YOU write automated tests. Bigbosexf does final manual verification.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: "Tests are too slow"</h3>
            <p><strong>Reality:</strong> Fixing bugs in production is 10x slower than writing tests.</p>
            <p><strong>Fix:</strong> Write fast unit tests first. Slow E2E tests only for critical flows.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: "100% coverage = good tests"</h3>
            <p><strong>Reality:</strong> You can have 100% coverage with useless tests that don't verify behavior.</p>
            <p><strong>Fix:</strong> Test behavior, not code. Ask: "Does this test catch real bugs?"</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: "Tests are passing, ship it"</h3>
            <p><strong>Reality:</strong> Tests might be wrong. Or mocking too much. Or missing edge cases.</p>
            <p><strong>Fix:</strong> Run tests in production environment. Verify with manual testing too.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: "I don't know how to write tests"</h3>
            <p><strong>Reality:</strong> Rafael generates tests for you. You just need to run them.</p>
            <p><strong>Fix:</strong> Ask Rafael: "Generate unit + E2E tests per VALIDATION.md"</p>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className={styles.quiz} id="quiz">
        <h2>Quiz: Test Your Testing Mindset</h2>

        <div className={styles.quizQuestion}>
          <h4>Scenario 1: You deployed your feature. npm run build passed. The page loads. Are you done?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(1)}
          >
            {quizAnswers[1] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[1] && (
            <div className={styles.quizAnswer}>
              <p><strong>NO. You're not done.</strong></p>
              <p>You still need to:</p>
              <ul>
                <li>Run all automated tests (unit + integration + E2E)</li>
                <li>Verify tests pass in PRODUCTION environment (not just local)</li>
                <li>Check Sofia's DoD checklist</li>
                <li>Verify all AC.md criteria</li>
                <li>Check performance thresholds</li>
              </ul>
              <p><strong>"Page loads" ≠ "Feature works"</strong></p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 2: You tested the signup flow manually. It works. Do you need automated tests?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(2)}
          >
            {quizAnswers[2] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[2] && (
            <div className={styles.quizAnswer}>
              <p><strong>YES. Automated tests are non-negotiable.</strong></p>
              <p><strong>Why:</strong></p>
              <ul>
                <li>Manual testing is unreliable (you forget edge cases)</li>
                <li>Future changes might break signup (tests catch regressions)</li>
                <li>Sofia can't verify without tests (how does she know it works?)</li>
                <li>Client wants proof (green tests = objective evidence)</li>
              </ul>
              <p><strong>Manual testing complements automated tests, doesn't replace them.</strong></p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 3: Your E2E tests pass locally but fail on Vercel. What's the problem?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(3)}
          >
            {quizAnswers[3] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[3] && (
            <div className={styles.quizAnswer}>
              <p><strong>Likely: Environment variable missing or different config.</strong></p>
              <p><strong>Common causes:</strong></p>
              <ul>
                <li>Env vars not set in Vercel dashboard (DATABASE_URL, API keys, etc.)</li>
                <li>Different Node version (local vs Vercel)</li>
                <li>Missing dependencies (forgot to add to package.json)</li>
                <li>Hardcoded localhost URLs (change to production URLs)</li>
              </ul>
              <p><strong>Fix:</strong> Check Vercel deployment logs. Verify all env vars. Run E2E tests against PRODUCTION URL.</p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 4: You're stuck writing tests. What do you do?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(4)}
          >
            {quizAnswers[4] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[4] && (
            <div className={styles.quizAnswer}>
              <p><strong>Ask Rafael to generate tests for you.</strong></p>
              <p><strong>Command:</strong></p>
              <pre className={styles.codeSnippet}>
                "Rafael, generate unit + integration + E2E tests for auth.ts per VALIDATION.md"
              </pre>
              <p><strong>Rafael will provide:</strong></p>
              <ul>
                <li>Unit tests (tests/auth.test.ts)</li>
                <li>Integration tests (tests/integration/auth.integration.test.ts)</li>
                <li>E2E tests (tests/e2e/auth.e2e.ts)</li>
                <li>Test setup/teardown code</li>
                <li>Example test data</li>
              </ul>
              <p><strong>Your job:</strong> Run the tests. Fix any failures. Verify they cover all AC.md criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Reference */}
      <section className={styles.quickRef} id="quick-ref">
        <h2>Testing Checklist (Print & Keep)</h2>

        <div className={styles.checklistCard}>
          <h3>Before You Say "Ready for QA"</h3>

          <div className={styles.checklistSection}>
            <h4>□ Automated Tests Written</h4>
            <ul>
              <li>□ Unit tests for all functions</li>
              <li>□ Integration tests for component interactions</li>
              <li>□ E2E tests for critical user flows</li>
              <li>□ Tests match VALIDATION.md criteria</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ All Tests Passing</h4>
            <ul>
              <li>□ Local: <code>npm run test</code> → all green</li>
              <li>□ Local: <code>npm run test:e2e</code> → all green</li>
              <li>□ Production: E2E tests against deployed URL → all green</li>
              <li>□ No console errors in browser DevTools</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ AC.md Criteria Verified</h4>
            <ul>
              <li>□ Functional criteria: All user flows work</li>
              <li>□ Non-functional: Performance thresholds met</li>
              <li>□ Edge cases: Error handling tested</li>
              <li>□ Verification commands from AC.md executed</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ Deployment Verified</h4>
            <ul>
              <li>□ Production URL accessible</li>
              <li>□ All environment variables set</li>
              <li>□ Feature works in production (not just local)</li>
              <li>□ No errors in production logs</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ DoD Checklist Complete</h4>
            <ul>
              <li>□ All items from Inna's DoD marked ✅</li>
              <li>□ Documentation updated</li>
              <li>□ Code reviewed (if required)</li>
              <li>□ Performance measured and meets targets</li>
            </ul>
          </div>
        </div>

        <div className={styles.goNoGo}>
          <h3>GO / NO-GO Decision</h3>
          <p><strong>GO (Hand off to Sofia):</strong> ALL checkboxes above are ✅</p>
          <p><strong>NO-GO (Keep working):</strong> ANY checkbox is ❌</p>
          <p className={styles.finalRule}>
            <strong>If in doubt, it's NO-GO.</strong> Better to spend 30 more minutes testing than waste 4 hours fixing bugs later.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className={styles.nextSteps}>
        <h2>Next Steps</h2>
        <p>Now you understand <strong>AC Green testing mindset</strong>. Related resources:</p>
        <ol>
          <li><Link href="/resources/complete-mission-flow"><strong>The Complete Mission Flow</strong></Link> - Where testing fits in the delivery process</li>
          <li><Link href="/resources/good-documentation"><strong>What Good Documentation Looks Like</strong></Link> - How VALIDATION.md defines test criteria</li>
          <li><Link href="/resources/how-to-talk-to-ai-citizens"><strong>How to Talk to AI Citizens</strong></Link> - How to ask Rafael to generate tests</li>
        </ol>
        <p><strong>Practice:</strong> Take your next feature. Write tests BEFORE you claim done. Run Sofia's verification. See how much cleaner the handoff is.</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>This article is part of ScopeLock Team Onboarding.</p>
        <p>Questions? Ask in Telegram <a href="https://t.me/nlr_ai">@nlr_ai</a> or ask Sofia (AI) for testing guidance.</p>
      </footer>
    </main>
  );
}
