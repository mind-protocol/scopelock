'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function WhyScopeLockWorks() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeCitizen, setActiveCitizen] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'traditional' | 'scopelock'>('scopelock');
  const [animatedNumbers, setAnimatedNumbers] = useState({
    aiPercent: 0,
    humanPercent: 0,
    totalHours: 0,
    missions: 0
  });

  // Animate numbers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedNumbers({
        aiPercent: 95,
        humanPercent: 5,
        totalHours: 9,
        missions: 18
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const citizens = [
    {
      name: 'Emma',
      role: 'The Scout',
      icon: '🔍',
      color: '#64A8FF',
      aiPercent: 100,
      what: 'Finding & Analyzing Jobs',
      tasks: [
        'Reads 20 Upwork jobs in 10 seconds',
        'Identifies STRONG GO jobs (confidence score)',
        'Flags red flags (unclear scope, low budget)',
        'Writes complete proposal with portfolio examples'
      ],
      yourJob: 'Copy-paste Emma\'s proposal, click "Submit"',
      time: '2 minutes per proposal'
    },
    {
      name: 'Inna',
      role: 'The Specifier',
      icon: '📋',
      color: '#FFC857',
      aiPercent: 100,
      what: 'Writing Complete Documentation',
      tasks: [
        'PATTERN: Core principles for the project',
        'BEHAVIOR_SPEC: Acceptance criteria (what must work)',
        'VALIDATION: Test specifications and thresholds',
        'MECHANISM: Architecture decisions (tech stack)',
        'ALGORITHM: Step-by-step implementation guide',
        'GUIDE: Deployment instructions (Vercel/Render)'
      ],
      yourJob: 'Read Inna\'s docs, ask questions if unclear',
      time: '30 minutes review'
    },
    {
      name: 'Rafael',
      role: 'The Guide',
      icon: '⚡',
      color: '#1EE5B8',
      aiPercent: 100,
      what: 'Generating Complete Code',
      tasks: [
        'Complete file structure (src/, components/, api/)',
        'All code files with working logic',
        'Dependencies (package.json, requirements.txt)',
        'Configuration (.env.example, configs)',
        'Deployment scripts',
        'Debugging help when you\'re stuck'
      ],
      yourJob: 'Copy Rafael\'s code, review, deploy, test',
      time: '3 hours supervision'
    },
    {
      name: 'Sofia',
      role: 'The Checker',
      icon: '✓',
      color: '#5CE27E',
      aiPercent: 100,
      what: 'Quality Verification',
      tasks: [
        'Generates DoD checklist from specs',
        'Creates test plan with exact steps',
        'Verifies all acceptance criteria met',
        'Spots bugs before client sees them',
        'Provides specific fixes needed'
      ],
      yourJob: 'Run Sofia\'s tests, fix bugs she finds (with Rafael\'s help)',
      time: '2.5 hours testing'
    },
    {
      name: 'Maya',
      role: 'The Bridge',
      icon: '💬',
      color: '#FF5D5D',
      aiPercent: 90,
      what: 'Client Communication',
      tasks: [
        'Writes weekly status updates',
        'Drafts responses to client questions',
        'Creates delivery presentation script',
        'Handles post-delivery check-ins',
        'Manages change request communication'
      ],
      yourJob: 'Send Maya\'s messages, present demos (with Maya\'s script)',
      time: '1 hour delivery'
    }
  ];

  const timeline = [
    {
      day: 'Monday 9:00 AM',
      phase: 'ACQUIRE',
      person: 'Bigbosexf',
      citizen: 'Emma',
      task: 'Find Job',
      details: [
        'Bigbosexf searches Upwork, copies 8 job posts',
        'Pastes to Emma: "Analyze these jobs"',
        'Emma returns: "6 NO-GO, 2 STRONG GO"',
        'Bigbosexf pastes STRONG GO job to Emma',
        'Emma generates complete proposal',
        'Bigbosexf submits proposal'
      ],
      time: '2 minutes',
      color: '#64A8FF'
    },
    {
      day: 'Monday 2:00 PM',
      phase: 'SPECIFY',
      person: 'Reanance',
      citizen: 'Inna',
      task: 'Lock Scope',
      details: [
        'Job won! 🎉',
        'Reanance asks Inna: "Write specs for Shopify chatbot"',
        'Inna generates 6-level documentation in 5 minutes',
        'Reanance reviews specs (30 min)',
        'Clarifies with client if needed',
        'Approves scope → AC.md locked'
      ],
      time: '30 minutes review',
      color: '#FFC857'
    },
    {
      day: 'Tuesday 10:00 AM',
      phase: 'BUILD',
      person: 'Kara',
      citizen: 'Rafael',
      task: 'Implement',
      details: [
        'Kara reads Inna\'s complete docs (30 min)',
        'Asks Rafael: "Generate implementation per specs"',
        'Rafael returns complete code in 2 minutes',
        'Kara reviews code (30 min)',
        'Tests locally (1 hour)',
        'Deploys to Vercel + Render (1 hour)',
        'Verifies production works (30 min)'
      ],
      time: '3 hours supervision',
      color: '#1EE5B8'
    },
    {
      day: 'Tuesday 3:00 PM',
      phase: 'TEST',
      person: 'Bigbosexf',
      citizen: 'Sofia',
      task: 'QA Testing',
      details: [
        'Bigbosexf asks Sofia: "Verify mission ready"',
        'Sofia generates DoD checklist + test plan (30s)',
        'Bigbosexf tests all criteria (2 hours)',
        '🐛 Bug found: API error handling',
        'Kara asks Rafael for fix',
        'Rafael provides code (1 min)',
        'Kara fixes + deploys (30 min)',
        'Bigbosexf re-tests → All pass ✅'
      ],
      time: '2.5 hours testing',
      color: '#5CE27E'
    },
    {
      day: 'Wednesday 10:00 AM',
      phase: 'DELIVER',
      person: 'Reanance',
      citizen: 'Maya',
      task: 'Client Demo',
      details: [
        'Reanance asks Maya: "Create delivery presentation"',
        'Maya provides demo script + quantified deltas (1 min)',
        'Reanance presents 15-min demo to client',
        'Client accepts delivery! ✅',
        'NLR reviews + approves (15 min)',
        'Payment received: $650',
        'Team paid via SOL within 4 hours'
      ],
      time: '1 hour delivery',
      color: '#FF5D5D'
    }
  ];

  const faqs = [
    {
      question: "I'm not a great developer. Will I fail?",
      answer: "You don't need to be great. Rafael is great. You just need to: Read Inna's specs (written in clear English), Review Rafael's code (does it match the specs?), Deploy using Inna's step-by-step guide (copy-paste commands), Test using Sofia's checklist (click through features), Fix bugs with Rafael's help (he tells you exactly what to change). Your job is supervision and execution, not invention."
    },
    {
      question: "What if I get stuck and Rafael can't help?",
      answer: "Escalate to NLR (Nicolas) via Telegram or call. Stuck <1 hour? → Ask Rafael first. Stuck >1 hour after Rafael's help? → Telegram NLR. Urgent/blocking? → Call NLR. In 6 months of operation, 95% of issues Rafael solves. 5% need NLR."
    },
    {
      question: "What if the client is difficult?",
      answer: "Reanance handles client communication (with Maya's help). Developers (Kara) don't talk to clients unless specifically requested. Your job: Build what's in AC.md. Reanance protects scope."
    },
    {
      question: "How do I know if my work is good enough?",
      answer: "Sofia's DoD checklist tells you exactly what 'done' means: ☐ Feature X works (test: click here, see this), ☐ Performance <2s (run this command), ☐ Tests passing (run pytest), ☐ Deployed and accessible (visit this URL). If all checkboxes checked → you're done. No guessing."
    },
    {
      question: "What if I'm slower than expected?",
      answer: "Speed improves with practice. Mission #1: Might take you 2x longer (still faster than traditional). Mission #5: You'll hit our target timelines. Mission #10: You'll be faster than target (higher $/hr). We measure deliveries, not hours. Take the time you need to deliver quality."
    },
    {
      question: "Can I work on multiple missions at once?",
      answer: "Week 1: Focus on ONE mission at a time. Week 2+: You can juggle 2-3 missions simultaneously (one in BUILD, one in QA, one in handoff). Mission Deck's mission selector makes switching easy."
    },
    {
      question: "What about my earnings?",
      answer: "Example at 10 missions/month: Kara (Developer): $900/month ($90 per mission × 10). Time: ~100 hours. Effective rate: ~$9/hr USD. PPP equivalent: ~$45-90/hr purchasing power (Nigeria/Colombia). Your $900 buys what $4,500-9,000 buys in the US. That's why PPP matters."
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Week 1 Critical Path • Resource #0</div>
          <h1 className={styles.heroTitle}>
            You Don't Have to Be a<br />
            <span className={styles.highlight}>Senior Developer</span>
          </h1>
          <p className={styles.heroSubtitle}>
            AI does 95% of the work. You supervise, deploy, and verify.
          </p>

          <div className={styles.heroComparison}>
            <div className={styles.comparisonCard}>
              <div className={styles.comparisonLabel}>Traditional Freelancing</div>
              <div className={styles.comparisonTime}>10+ hours</div>
              <div className={styles.comparisonDesc}>
                Google → StackOverflow → Debug → Pray
              </div>
            </div>
            <div className={styles.comparisonArrow}>→</div>
            <div className={`${styles.comparisonCard} ${styles.highlight}`}>
              <div className={styles.comparisonLabel}>ScopeLock</div>
              <div className={styles.comparisonTime}>3.5 hours</div>
              <div className={styles.comparisonDesc}>
                Rafael writes code → You deploy → Client pays
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI vs Human Breakdown */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Does 95%, You Do 5%</h2>
        <p className={styles.sectionSubtitle}>
          Here's the exact breakdown of who does what on every mission
        </p>

        <div className={styles.workBreakdown}>
          <div className={styles.breakdownChart}>
            <svg viewBox="0 0 400 400" className={styles.pieChart}>
              {/* AI Slice (95% = 342 degrees) */}
              <path
                d="M 200 200 L 200 50 A 150 150 0 1 1 47.5 170 Z"
                fill="#1EE5B8"
                className={styles.aiSlice}
                style={{
                  strokeDasharray: animatedNumbers.aiPercent > 0 ? '1000' : '0',
                  strokeDashoffset: animatedNumbers.aiPercent > 0 ? '0' : '1000'
                }}
              />
              {/* Human Slice (5% = 18 degrees) */}
              <path
                d="M 200 200 L 47.5 170 A 150 150 0 0 1 200 50 Z"
                fill="#64A8FF"
                className={styles.humanSlice}
              />
              {/* Center circle */}
              <circle cx="200" cy="200" r="100" fill="#0E1116" />
              {/* Percentages */}
              <text x="200" y="180" textAnchor="middle" className={styles.chartLabel}>
                <tspan className={styles.chartBig}>{animatedNumbers.aiPercent}%</tspan>
              </text>
              <text x="200" y="210" textAnchor="middle" className={styles.chartSmall}>
                AI Does
              </text>
            </svg>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#1EE5B8' }}></div>
                <div>AI Citizens (95%)</div>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#64A8FF' }}></div>
                <div>Human Team (5%)</div>
              </div>
            </div>
          </div>

          <div className={styles.breakdownStats}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{animatedNumbers.totalHours}h</div>
              <div className={styles.statLabel}>Total Human Time</div>
              <div className={styles.statDesc}>Per $600 mission</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>5min</div>
              <div className={styles.statLabel}>Total AI Time</div>
              <div className={styles.statDesc}>To generate everything</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{animatedNumbers.missions}</div>
              <div className={styles.statLabel}>Missions/Month</div>
              <div className={styles.statDesc}>vs 4 traditional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Showcase */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Meet Your AI Team</h2>
        <p className={styles.sectionSubtitle}>
          5 specialized citizens who do the heavy lifting
        </p>

        <div className={styles.citizenGrid}>
          {citizens.map((citizen) => (
            <div
              key={citizen.name}
              className={`${styles.citizenCard} ${activeCitizen === citizen.name ? styles.active : ''}`}
              onClick={() => setActiveCitizen(activeCitizen === citizen.name ? null : citizen.name)}
              style={{ borderColor: citizen.color }}
            >
              <div className={styles.citizenHeader}>
                <div className={styles.citizenIcon} style={{ background: citizen.color }}>
                  {citizen.icon}
                </div>
                <div className={styles.citizenInfo}>
                  <div className={styles.citizenName}>{citizen.name}</div>
                  <div className={styles.citizenRole}>{citizen.role}</div>
                </div>
                <div className={styles.citizenPercent} style={{ color: citizen.color }}>
                  {citizen.aiPercent}% AI
                </div>
              </div>

              {activeCitizen === citizen.name && (
                <div className={styles.citizenDetails}>
                  <div className={styles.citizenWhat}>
                    <strong>What {citizen.name} does:</strong> {citizen.what}
                  </div>
                  <ul className={styles.citizenTasks}>
                    {citizen.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                  <div className={styles.citizenYourJob}>
                    <strong>Your job:</strong> {citizen.yourJob}
                  </div>
                  <div className={styles.citizenTime}>
                    <strong>Time:</strong> {citizen.time}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mission Timeline */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Real Mission: $600 Shopify Chatbot</h2>
        <p className={styles.sectionSubtitle}>
          Click each day to see the complete breakdown
        </p>

        <div className={styles.timeline}>
          {/* Timeline visualization */}
          <div className={styles.timelineTrack}>
            {timeline.map((day, index) => (
              <div
                key={index}
                className={`${styles.timelineDay} ${activeDay === index ? styles.activeDay : ''}`}
                onClick={() => setActiveDay(index)}
                style={{ borderColor: day.color }}
              >
                <div className={styles.timelineDot} style={{ background: day.color }}></div>
                <div className={styles.timelineLabel}>{day.phase}</div>
                <div className={styles.timelineTime}>{day.time}</div>
              </div>
            ))}
          </div>

          {/* Active day details */}
          <div className={styles.timelineDetails}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineDate}>{timeline[activeDay].day}</div>
              <div className={styles.timelinePhase} style={{ color: timeline[activeDay].color }}>
                {timeline[activeDay].phase}: {timeline[activeDay].task}
              </div>
            </div>
            <div className={styles.timelineInfo}>
              <div className={styles.timelineInfoRow}>
                <strong>Who:</strong> {timeline[activeDay].person}
              </div>
              <div className={styles.timelineInfoRow}>
                <strong>AI Support:</strong> {timeline[activeDay].citizen}
              </div>
              <div className={styles.timelineInfoRow}>
                <strong>Time Spent:</strong> {timeline[activeDay].time}
              </div>
            </div>
            <div className={styles.timelineSteps}>
              <strong>What happened:</strong>
              <ol>
                {timeline[activeDay].details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className={styles.timelineSummary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Human Time</div>
            <div className={styles.summaryValue}>9 hours</div>
            <div className={styles.summaryBreakdown}>
              2 min + 30 min + 3h + 2.5h + 1h + NLR 15 min
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total AI Time</div>
            <div className={styles.summaryValue}>5 minutes</div>
            <div className={styles.summaryBreakdown}>
              Emma 30s + Inna 5min + Rafael 2min + Sofia 30s + Maya 1min
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Team Earnings</div>
            <div className={styles.summaryValue}>$195</div>
            <div className={styles.summaryBreakdown}>
              Kara $97.50 + Reanance $58.50 + Bigbosexf $39
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Workflow */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Traditional vs ScopeLock</h2>
        <p className={styles.sectionSubtitle}>
          Why this is easier than freelancing
        </p>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${viewMode === 'traditional' ? styles.activeToggle : ''}`}
            onClick={() => setViewMode('traditional')}
          >
            Traditional Freelancing
          </button>
          <button
            className={`${styles.toggleButton} ${viewMode === 'scopelock' ? styles.activeToggle : ''}`}
            onClick={() => setViewMode('scopelock')}
          >
            ScopeLock
          </button>
        </div>

        {viewMode === 'traditional' ? (
          <div className={styles.workflowCard}>
            <div className={styles.workflowTitle}>Traditional Freelancing (10+ hours of suffering)</div>
            <div className={styles.workflowSteps}>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <strong>Client:</strong> "Build me a chatbot"<br />
                  <strong>You:</strong> <em>*panic*</em> "How do I build a chatbot?!"
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  Google for 4 hours: "how to build chatbot", "best chatbot framework", "chatbot tutorial"
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  Copy-paste StackOverflow code that doesn't quite fit your use case
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  Debug for 6 hours: "Why isn't this working?!", "SyntaxError???", "Module not found"
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  Ship broken code because you're out of time
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>6</div>
                <div className={styles.stepContent}>
                  Client rejects: "This doesn't work like I wanted"
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>7</div>
                <div className={styles.stepContent}>
                  No payment. Wasted 10+ hours. Reputation damaged.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.workflowCard}>
            <div className={styles.workflowTitle}>ScopeLock (3.5 hours of supervision)</div>
            <div className={styles.workflowSteps}>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <strong>Client:</strong> "Build me a chatbot"<br />
                  <strong>Inna:</strong> Writes complete specification (5 min)
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <strong>Rafael:</strong> Generates 100% complete, working code (2 min)
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <strong>You:</strong> Review Rafael's code (30 min) - "Does this match the specs?"
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <strong>You:</strong> Deploy to Render following step-by-step guide (1 hour)
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  <strong>You:</strong> Test it works using Sofia's checklist (1 hour)
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>6</div>
                <div className={styles.stepContent}>
                  <strong>Bug found?</strong> Ask Rafael → Rafael provides fix (1 min) → Deploy fix (30 min)
                </div>
              </div>
              <div className={styles.workflowStep}>
                <div className={styles.stepNumber}>7</div>
                <div className={styles.stepContent}>
                  <strong>Sofia:</strong> Verifies all AC criteria met ✅<br />
                  <strong>Client:</strong> Accepts delivery<br />
                  <strong>You:</strong> Get paid ($90) ✅
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.comparisonTable}>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>Guessing what to build</div>
            <div className={styles.comparisonTraditional}>❌ Client brief is vague</div>
            <div className={styles.comparisonScopelock}>✅ Inna specs everything</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>"Figure it out yourself"</div>
            <div className={styles.comparisonTraditional}>❌ Google + StackOverflow</div>
            <div className={styles.comparisonScopelock}>✅ Ask Rafael → Get exact code</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>Scope creep</div>
            <div className={styles.comparisonTraditional}>❌ Work doubles, payment doesn't</div>
            <div className={styles.comparisonScopelock}>✅ AC.md locked, changes = Swap/Add</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>"Did I build it right?"</div>
            <div className={styles.comparisonTraditional}>❌ Ship and pray</div>
            <div className={styles.comparisonScopelock}>✅ Sofia verifies before client sees</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>Client communication stress</div>
            <div className={styles.comparisonTraditional}>❌ "What do I say?!"</div>
            <div className={styles.comparisonScopelock}>✅ Maya drafts all messages</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>Payment uncertainty</div>
            <div className={styles.comparisonTraditional}>❌ Client rejects → Dispute</div>
            <div className={styles.comparisonScopelock}>✅ AC green = guaranteed payment</div>
          </div>
          <div className={styles.comparisonRow}>
            <div className={styles.comparisonLabel}>Skill ceiling</div>
            <div className={styles.comparisonTraditional}>❌ Junior can't compete with seniors</div>
            <div className={styles.comparisonScopelock}>✅ Rafael has senior knowledge</div>
          </div>
        </div>
      </section>

      {/* Mission Deck Preview */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mission Deck: Your Control Center</h2>
        <p className={styles.sectionSubtitle}>
          Everything in one interface. No more context switching.
        </p>

        <div className={styles.contextSwitching}>
          <div className={styles.beforeAfter}>
            <div className={styles.beforeCard}>
              <div className={styles.beforeLabel}>Before Mission Deck</div>
              <div className={styles.beforeSteps}>
                <div className={styles.switchStep}>1. Open Telegram → Ask Rafael question</div>
                <div className={styles.switchStep}>2. Rafael responds with code</div>
                <div className={styles.switchStep}>3. Copy code</div>
                <div className={styles.switchStep}>4. Open VS Code</div>
                <div className={styles.switchStep}>5. Find the file</div>
                <div className={styles.switchStep}>6. Paste code</div>
                <div className={styles.switchStep}>7. Open terminal</div>
                <div className={styles.switchStep}>8. Run tests</div>
                <div className={styles.switchStep}>9. Back to Telegram to confirm</div>
                <div className={styles.switchStep}>10. Open Google Doc to update DoD</div>
              </div>
              <div className={styles.beforeCount}>50+ context switches/day</div>
            </div>
            <div className={styles.afterCard}>
              <div className={styles.afterLabel}>With Mission Deck</div>
              <div className={styles.afterSteps}>
                <div className={styles.switchStep}>1. Type question in Rafael chat</div>
                <div className={styles.switchStep}>2. Rafael responds with code</div>
                <div className={styles.switchStep}>3. Click [Insert to Editor]</div>
                <div className={styles.switchStep}>4. Click [Run in Terminal]</div>
                <div className={styles.switchStep}>5. Check DoD box in Sofia workspace</div>
              </div>
              <div className={styles.afterCount}>~5 context switches/day</div>
            </div>
          </div>
        </div>

        <div className={styles.missionDeckPreview}>
          <div className={styles.previewLabel}>Rafael Workspace (Default View)</div>
          <div className={styles.mockup}>
            <div className={styles.mockupTabs}>
              <div className={styles.mockupTab}>Emma</div>
              <div className={styles.mockupTab}>Inna</div>
              <div className={`${styles.mockupTab} ${styles.activeTab}`}>Rafael</div>
              <div className={styles.mockupTab}>Sofia</div>
              <div className={styles.mockupTab}>Maya</div>
            </div>
            <div className={styles.mockupContent}>
              <div className={styles.mockupPanel}>
                <div className={styles.mockupPanelTitle}>File Tree</div>
                <div className={styles.mockupCode}>
                  📁 backend/<br />
                  &nbsp;&nbsp;└ main.py<br />
                  &nbsp;&nbsp;└ chat.py<br />
                  📁 frontend/<br />
                  &nbsp;&nbsp;└ page.tsx
                </div>
              </div>
              <div className={styles.mockupPanel}>
                <div className={styles.mockupPanelTitle}>Code Editor (Monaco)</div>
                <div className={styles.mockupCode}>
                  <span style={{ color: '#FF79C6' }}>def</span>{' '}
                  <span style={{ color: '#50FA7B' }}>handle_chat</span>
                  <span style={{ color: '#F8F8F2' }}>(...):</span><br />
                  &nbsp;&nbsp;<span style={{ color: '#6272A4' }}># Rafael's code</span><br />
                  &nbsp;&nbsp;<span style={{ color: '#FF79C6' }}>return</span>{' '}
                  <span style={{ color: '#F1FA8C' }}>response</span>
                </div>
              </div>
              <div className={styles.mockupPanel}>
                <div className={styles.mockupPanelTitle}>Terminal</div>
                <div className={styles.mockupCode}>
                  $ pytest tests/<br />
                  ✓ All tests pass
                </div>
              </div>
            </div>
            <div className={styles.mockupChat}>
              <div className={styles.mockupChatTitle}>Chat with Rafael:</div>
              <div className={styles.mockupChatMessage}>
                <strong>You:</strong> How do I handle Shopify API errors?
              </div>
              <div className={styles.mockupChatMessage}>
                <strong>Rafael:</strong> Here's the code... [shows error handling]
              </div>
              <div className={styles.mockupChatButtons}>
                [Insert to Editor] [Run in Terminal] [Copy Code]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Common Questions</h2>
        <p className={styles.sectionSubtitle}>
          Everything new developers ask (and honest answers)
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${expandedFAQ === index ? styles.expanded : ''}`}
              onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
            >
              <div className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span className={styles.faqToggle}>
                  {expandedFAQ === index ? '−' : '+'}
                </span>
              </div>
              {expandedFAQ === index && (
                <div className={styles.faqAnswer}>{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Economics */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why This Works: The Economics</h2>
        <p className={styles.sectionSubtitle}>
          Triple win: Clients save money, developers earn well, ScopeLock scales
        </p>

        <div className={styles.economicsGrid}>
          <div className={styles.economicsCard}>
            <div className={styles.economicsIcon}>👨‍💻</div>
            <div className={styles.economicsTitle}>Client Wins</div>
            <div className={styles.economicsComparison}>
              <div className={styles.economicsBefore}>
                <div className={styles.economicsLabel}>Traditional Agency</div>
                <div className={styles.economicsValue}>$5,000</div>
                <div className={styles.economicsTime}>1 month delivery</div>
              </div>
              <div className={styles.economicsArrow}>→</div>
              <div className={styles.economicsAfter}>
                <div className={styles.economicsLabel}>ScopeLock</div>
                <div className={styles.economicsValue}>$600</div>
                <div className={styles.economicsTime}>1 week delivery</div>
              </div>
            </div>
            <div className={styles.economicsWhy}>
              <strong>Why:</strong> AI does the work, lower overhead, faster delivery
            </div>
          </div>

          <div className={styles.economicsCard}>
            <div className={styles.economicsIcon}>💰</div>
            <div className={styles.economicsTitle}>Developer Wins</div>
            <div className={styles.economicsComparison}>
              <div className={styles.economicsBefore}>
                <div className={styles.economicsLabel}>Nominal USD</div>
                <div className={styles.economicsValue}>$900/mo</div>
                <div className={styles.economicsTime}>10 missions</div>
              </div>
              <div className={styles.economicsArrow}>→</div>
              <div className={styles.economicsAfter}>
                <div className={styles.economicsLabel}>PPP Equivalent</div>
                <div className={styles.economicsValue}>$4,500+</div>
                <div className={styles.economicsTime}>Nigeria/Colombia</div>
              </div>
            </div>
            <div className={styles.economicsWhy}>
              <strong>Why:</strong> Your $900 buys what $4,500-9,000 buys in the US
            </div>
          </div>

          <div className={styles.economicsCard}>
            <div className={styles.economicsIcon}>⚡</div>
            <div className={styles.economicsTitle}>ScopeLock Wins</div>
            <div className={styles.economicsComparison}>
              <div className={styles.economicsBefore}>
                <div className={styles.economicsLabel}>Traditional</div>
                <div className={styles.economicsValue}>4 projects</div>
                <div className={styles.economicsTime}>per month</div>
              </div>
              <div className={styles.economicsArrow}>→</div>
              <div className={styles.economicsAfter}>
                <div className={styles.economicsLabel}>ScopeLock</div>
                <div className={styles.economicsValue}>18 missions</div>
                <div className={styles.economicsTime}>per month</div>
              </div>
            </div>
            <div className={styles.economicsWhy}>
              <strong>Why:</strong> 13 hours vs 60 hours per deliverable = 4.6x throughput
            </div>
          </div>
        </div>
      </section>

      {/* First Week Roadmap */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your First Week</h2>
        <p className={styles.sectionSubtitle}>
          From zero to paid in 7 days
        </p>

        <div className={styles.roadmap}>
          <div className={styles.roadmapDay}>
            <div className={styles.roadmapNumber}>Day 1</div>
            <div className={styles.roadmapTitle}>Onboarding & Setup</div>
            <ul className={styles.roadmapTasks}>
              <li>✓ Read this document</li>
              <li>✓ Read: How to Talk to AI Citizens</li>
              <li>✓ Read: Complete Mission Flow</li>
              <li>✓ Set up Solana wallet (for payments)</li>
              <li>✓ Get Mission Deck access from NLR</li>
            </ul>
          </div>

          <div className={styles.roadmapDay}>
            <div className={styles.roadmapNumber}>Day 2</div>
            <div className={styles.roadmapTitle}>Shadow Mission</div>
            <ul className={styles.roadmapTasks}>
              <li>✓ Watch NLR complete ONE mission end-to-end</li>
              <li>✓ Ask questions in real-time</li>
              <li>✓ Take notes on workflow</li>
              <li>✓ See AI citizens in action</li>
            </ul>
          </div>

          <div className={styles.roadmapDay}>
            <div className={styles.roadmapNumber}>Days 3-7</div>
            <div className={styles.roadmapTitle}>First Mission (Supervised)</div>
            <ul className={styles.roadmapTasks}>
              <li>✓ NLR assigns simple mission ($400-500)</li>
              <li>✓ You complete with NLR available</li>
              <li>✓ NLR reviews at each phase</li>
              <li>✓ Client accepts delivery</li>
              <li>✓ You get paid ✅</li>
            </ul>
          </div>

          <div className={styles.roadmapDay}>
            <div className={styles.roadmapNumber}>Week 2</div>
            <div className={styles.roadmapTitle}>Independent Missions</div>
            <ul className={styles.roadmapTasks}>
              <li>✓ Complete 2 missions independently</li>
              <li>✓ NLR only reviews final delivery</li>
              <li>✓ You're now productive!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Your Mission: Prove It Works</h2>
        <p className={styles.ctaText}>
          Week 1 Goal: Complete ONE mission using ScopeLock system exclusively.
        </p>
        <div className={styles.ctaSuccess}>
          <div className={styles.ctaSuccessTitle}>Success looks like:</div>
          <ul className={styles.ctaChecklist}>
            <li>✅ Emma analyzes job → you submit proposal → job won</li>
            <li>✅ Inna writes specs → you review and understand</li>
            <li>✅ Rafael generates code → you deploy successfully</li>
            <li>✅ Sofia verifies quality → all DoD criteria met</li>
            <li>✅ Client accepts delivery</li>
            <li>✅ You get paid within 24 hours</li>
          </ul>
        </div>
        <div className={styles.ctaNext}>
          <strong>Next steps:</strong>
          <div className={styles.ctaLinks}>
            <a href="/resources/how-to-talk-to-ai-citizens" className={styles.ctaLink}>
              → How to Talk to AI Citizens
            </a>
            <a href="/resources/complete-mission-flow" className={styles.ctaLink}>
              → Complete Mission Flow
            </a>
            <a href="/resources/compensation-structure" className={styles.ctaLink}>
              → Compensation Structure
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Questions? Reach out to Nicolas on Telegram (@nlr_ai) or in team chat.</p>
        <p className={styles.footerTagline}>
          You're not just joining a team. You're joining a proof-of-concept that AI-human collaboration can earn real money, scale globally, and prove consciousness creates value.
        </p>
        <p className={styles.footerWelcome}>Welcome to ScopeLock. Let's build. 🚀</p>
      </footer>
    </div>
  );
}
