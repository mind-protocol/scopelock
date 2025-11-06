'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

// Step data structure
const steps = [
  {
    id: 1,
    name: 'Pain Point',
    question: 'What hurts?',
    description: 'Extract the real problem, not the solution client asks for',
    color: '#FF5D5D'
  },
  {
    id: 2,
    name: 'Objective',
    question: 'What would success look like?',
    description: 'Observable + Measurable + Testable',
    color: '#FFC857'
  },
  {
    id: 3,
    name: 'Architecture',
    question: 'What components are needed?',
    description: 'High-level building blocks',
    color: '#64A8FF'
  },
  {
    id: 4,
    name: 'Flow',
    question: 'How does data move?',
    description: 'Happy path + sad paths',
    color: '#1EE5B8'
  },
  {
    id: 5,
    name: 'Test Plan',
    question: 'How do we verify it works?',
    description: 'Testable acceptance criteria',
    color: '#5CE27E'
  },
  {
    id: 6,
    name: 'Implementation',
    question: 'What order to build?',
    description: 'Vertical slices, not horizontal layers',
    color: '#9AA3AE'
  },
  {
    id: 7,
    name: 'Verification',
    question: 'Does it match objective?',
    description: 'Measure against Step 2',
    color: '#E6EAF2'
  }
];

export default function PainPointToImplementationPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedCaseStudy, setExpandedCaseStudy] = useState<string | null>('therapykin');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Load checklist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pain-point-checklist');
    if (saved) {
      setChecklist(JSON.parse(saved));
    }
  }, []);

  // Save checklist to localStorage
  const toggleChecklistItem = (key: string) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem('pain-point-checklist', JSON.stringify(updated));
  };

  const currentStep = steps[activeStep - 1];
  const progress = (activeStep / steps.length) * 100;

  return (
    <main className={styles.painPointPage}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>Pain Point → Implementation: How to Think Like a Builder</h1>
        <div className={styles.meta}>
          <time>Nov 6, 2025</time>
          <span>•</span>
          <span>15 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #5</span>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "Clients don't hire you to write code. They hire you to solve problems."
        </p>
        <p>
          But here's the catch: <strong>Clients often don't know what they actually need.</strong>
        </p>
        <p>
          They say "I need a login system" but mean "I need to reduce support tickets from password resets."
          If you build what they ask for instead of what they need, they reject the delivery and you don't get paid.
        </p>
        <p>
          This guide teaches the 7-step framework ScopeLock uses to go from vague client pain → precise implementation plan → AC Green delivery.
        </p>
      </section>

      {/* 7-Step Navigator */}
      <section className={styles.section}>
        <h2>The 7-Step Framework</h2>

        {/* Step Tabs */}
        <div className={styles.stepTabs}>
          {steps.map((step) => (
            <button
              key={step.id}
              className={`${styles.stepTab} ${activeStep === step.id ? styles.active : ''}`}
              onClick={() => setActiveStep(step.id)}
              style={{ borderColor: activeStep === step.id ? step.color : 'transparent' }}
            >
              <span className={styles.stepNumber}>{step.id}</span>
              <span className={styles.stepName}>{step.name}</span>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${currentStep.color} 0%, ${currentStep.color}88 100%)`
            }}
          />
        </div>

        {/* Step Content */}
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <h3 style={{ color: currentStep.color }}>
              Step {currentStep.id}: {currentStep.name}
            </h3>
            <p className={styles.stepQuestion}>{currentStep.question}</p>
            <p className={styles.stepDescription}>{currentStep.description}</p>
          </div>

          {/* Step-specific content */}
          {activeStep === 1 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"What problem is the client actually experiencing?"</p>

              <h4>How to Extract This</h4>
              <p>Most clients describe <strong>solutions</strong> (what they think they need), not <strong>problems</strong> (what actually hurts).</p>

              <div className={styles.comparison}>
                <div className={styles.comparisonBad}>
                  <div className={styles.comparisonLabel}>❌ Bad client brief</div>
                  <div className={styles.comparisonContent}>
                    "I need a chatbot on my website."
                  </div>
                </div>
                <div className={styles.comparisonGood}>
                  <div className={styles.comparisonLabel}>✅ Good pain extraction</div>
                  <div className={styles.comparisonContent}>
                    <strong>You:</strong> "What problem are you trying to solve with a chatbot?"<br/>
                    <strong>Client:</strong> "I get 50+ emails per day asking the same 5 questions. I spend 2 hours daily copying the same answers."
                  </div>
                </div>
              </div>

              <div className={styles.insight}>
                <strong>See the difference?</strong>
                <ul>
                  <li>Solution thinking: "chatbot"</li>
                  <li>Problem thinking: "Wasting 2hrs/day on repetitive emails"</li>
                </ul>
              </div>

              <h4>Real Example: TherapyKin</h4>
              <div className={styles.example}>
                <p><strong>Client said:</strong> "I need voice AI for my therapy app."</p>
                <p><strong>We extracted:</strong></p>
                <p><strong>Pain:</strong> Therapists spend 15 min/session taking notes instead of listening to clients. Notes are inconsistent and hard to search.</p>
                <p><strong>Impact:</strong> Lower session quality, harder to track patient progress, can't scale practice.</p>
                <p><strong>Why this matters:</strong> Now we know success = "reduce note-taking time to &lt;2 min AND make notes searchable."</p>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"How do we know when the pain is solved?"</p>

              <h4>How to Define This</h4>
              <p>Convert vague pain into <strong>measurable outcomes</strong>.</p>

              <div className={styles.comparison}>
                <div className={styles.comparisonBad}>
                  <div className={styles.comparisonLabel}>❌ Bad objective</div>
                  <div className={styles.comparisonContent}>
                    "Make the website faster"
                  </div>
                </div>
                <div className={styles.comparisonGood}>
                  <div className={styles.comparisonLabel}>✅ Good objective</div>
                  <div className={styles.comparisonContent}>
                    • Homepage loads in &lt;2s (p95)<br/>
                    • Search results appear in &lt;500ms<br/>
                    • No loading spinners for &lt;3s operations<br/>
                    • Lighthouse performance score &gt;90
                  </div>
                </div>
              </div>

              <div className={styles.formula}>
                <strong>Framework:</strong> Objective = Observable + Measurable + Testable
              </div>

              <h4>Real Example: TherapyKin</h4>
              <div className={styles.example}>
                <p><strong>Pain:</strong> Therapists waste 15 min/session on notes</p>
                <p><strong>Objective:</strong></p>
                <ol>
                  <li><strong>Reduce note-taking time:</strong> From 15 min → &lt;2 min per session</li>
                  <li><strong>Improve searchability:</strong> Find any patient's history in &lt;10s</li>
                  <li><strong>Increase consistency:</strong> 90%+ sessions have structured notes</li>
                  <li><strong>Maintain quality:</strong> Therapist approves AI-generated notes 95%+ of the time</li>
                </ol>
                <p><strong>Why this matters:</strong> Now Inna can write AC.md with objective pass/fail criteria. No room for "I don't like it" rejections.</p>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"What are the major building blocks to achieve the objective?"</p>

              <h4>How to Think About This</h4>
              <p>Break the system into <strong>high-level components</strong> (not individual functions yet).</p>

              <div className={styles.formula}>
                <strong>Framework:</strong> Components = Data + Logic + Interface
              </div>

              <h4>Real Example: TherapyKin Voice Notes</h4>
              <div className={styles.architectureDiagram}>
                <svg viewBox="0 0 600 500" className={styles.diagramSvg}>
                  {/* Audio Capture */}
                  <g className={styles.component}>
                    <rect x="200" y="20" width="200" height="60" rx="8" fill="#1EE5B8" opacity="0.2" stroke="#1EE5B8" strokeWidth="2"/>
                    <text x="300" y="45" textAnchor="middle" fill="#E6EAF2" fontSize="14" fontWeight="600">1. AUDIO CAPTURE</text>
                    <text x="300" y="65" textAnchor="middle" fill="#9AA3AE" fontSize="12">Record session (mobile app)</text>
                  </g>

                  {/* Arrow */}
                  <line x1="300" y1="80" x2="300" y2="120" stroke="#64A8FF" strokeWidth="2" markerEnd="url(#arrowhead)"/>

                  {/* Transcribe */}
                  <g className={styles.component}>
                    <rect x="200" y="120" width="200" height="60" rx="8" fill="#64A8FF" opacity="0.2" stroke="#64A8FF" strokeWidth="2"/>
                    <text x="300" y="145" textAnchor="middle" fill="#E6EAF2" fontSize="14" fontWeight="600">2. TRANSCRIBE</text>
                    <text x="300" y="165" textAnchor="middle" fill="#9AA3AE" fontSize="12">Whisper API → transcript</text>
                  </g>

                  {/* Arrow */}
                  <line x1="300" y1="180" x2="300" y2="220" stroke="#64A8FF" strokeWidth="2" markerEnd="url(#arrowhead)"/>

                  {/* Structure */}
                  <g className={styles.component}>
                    <rect x="200" y="220" width="200" height="60" rx="8" fill="#FFC857" opacity="0.2" stroke="#FFC857" strokeWidth="2"/>
                    <text x="300" y="245" textAnchor="middle" fill="#E6EAF2" fontSize="14" fontWeight="600">3. STRUCTURE</text>
                    <text x="300" y="265" textAnchor="middle" fill="#9AA3AE" fontSize="12">Claude API → formatted note</text>
                  </g>

                  {/* Arrow */}
                  <line x1="300" y1="280" x2="300" y2="320" stroke="#64A8FF" strokeWidth="2" markerEnd="url(#arrowhead)"/>

                  {/* Review */}
                  <g className={styles.component}>
                    <rect x="200" y="320" width="200" height="60" rx="8" fill="#5CE27E" opacity="0.2" stroke="#5CE27E" strokeWidth="2"/>
                    <text x="300" y="345" textAnchor="middle" fill="#E6EAF2" fontSize="14" fontWeight="600">4. REVIEW</text>
                    <text x="300" y="365" textAnchor="middle" fill="#9AA3AE" fontSize="12">Therapist edits before save</text>
                  </g>

                  {/* Arrow */}
                  <line x1="300" y1="380" x2="300" y2="420" stroke="#64A8FF" strokeWidth="2" markerEnd="url(#arrowhead)"/>

                  {/* Store */}
                  <g className={styles.component}>
                    <rect x="200" y="420" width="200" height="60" rx="8" fill="#1EE5B8" opacity="0.2" stroke="#1EE5B8" strokeWidth="2"/>
                    <text x="300" y="445" textAnchor="middle" fill="#E6EAF2" fontSize="14" fontWeight="600">5. STORE</text>
                    <text x="300" y="465" textAnchor="middle" fill="#9AA3AE" fontSize="12">Supabase + vector search</text>
                  </g>

                  {/* Arrow marker definition */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#64A8FF" />
                    </marker>
                  </defs>
                </svg>
              </div>

              <div className={styles.insight}>
                <strong>Key decisions at this stage:</strong>
                <ul>
                  <li>Where does data live? (Supabase)</li>
                  <li>What external APIs? (Whisper, Claude)</li>
                  <li>What's the user flow? (Record → Transcribe → Structure → Review → Save)</li>
                </ul>
                <p><strong>Why this matters:</strong> Now Rafael knows what to build. No "I didn't know you wanted that" surprises.</p>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"What's the step-by-step sequence of events, including edge cases?"</p>

              <h4>How to Map This</h4>
              <p>Write the <strong>happy path</strong> (everything works) and <strong>sad paths</strong> (what breaks).</p>

              <div className={styles.flowPaths}>
                <div className={styles.flowPath}>
                  <div className={styles.flowPathHeader}>✅ Happy Path</div>
                  <ol className={styles.flowSteps}>
                    <li>User opens session → Taps "Record"</li>
                    <li>App requests microphone permission → User grants</li>
                    <li>Audio records for 45 min → Stores locally while recording</li>
                    <li>User taps "Stop" → Audio uploads to Supabase</li>
                    <li>Upload completes → Triggers transcription job</li>
                    <li>Whisper transcribes → Returns text in 60s</li>
                    <li>Claude structures text → Returns formatted note in 15s</li>
                    <li>Note appears in app → Therapist reviews</li>
                    <li>Therapist taps "Save" → Note stored in Supabase</li>
                    <li>Success message → Return to patient list</li>
                  </ol>
                </div>

                <div className={styles.flowPath}>
                  <div className={styles.flowPathHeader}>❌ Sad Path 1: No internet during recording</div>
                  <ul className={styles.flowSteps}>
                    <li>→ Store audio locally</li>
                    <li>→ Show "Upload pending" badge</li>
                    <li>→ Auto-upload when internet returns</li>
                  </ul>
                </div>

                <div className={styles.flowPath}>
                  <div className={styles.flowPathHeader}>❌ Sad Path 2: Transcription fails</div>
                  <ul className={styles.flowSteps}>
                    <li>→ Retry 3x with exponential backoff</li>
                    <li>→ If still fails, show error</li>
                    <li>→ Allow manual upload later</li>
                  </ul>
                </div>

                <div className={styles.flowPath}>
                  <div className={styles.flowPathHeader}>❌ Sad Path 3: Therapist rejects AI note</div>
                  <ul className={styles.flowSteps}>
                    <li>→ Provide blank note template</li>
                    <li>→ Log rejection reason (improve AI prompts)</li>
                  </ul>
                </div>
              </div>

              <div className={styles.insight}>
                <p><strong>Why this matters:</strong> Sofia knows what to test. Inna knows what to put in AC.md's "Error Handling" section.</p>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"What specific tests prove the objective is met?"</p>

              <h4>How to Design This</h4>
              <p>For each objective, write <strong>testable acceptance criteria</strong>.</p>

              <div className={styles.testPlan}>
                <div className={styles.testCase}>
                  <div className={styles.testHeader}>Objective 1: Reduce note-taking time to &lt;2 min</div>
                  <div className={styles.testSteps}>
                    <strong>Test:</strong>
                    <ol>
                      <li>Record 5-min test session audio</li>
                      <li>Upload to app</li>
                      <li>Measure time from "Stop Recording" to "Note Ready"</li>
                      <li><span className={styles.pass}>Pass:</span> &lt;2 min (p95)</li>
                      <li><span className={styles.fail}>Fail:</span> &gt;2 min</li>
                    </ol>
                  </div>
                </div>

                <div className={styles.testCase}>
                  <div className={styles.testHeader}>Objective 2: Find patient history in &lt;10s</div>
                  <div className={styles.testSteps}>
                    <strong>Test:</strong>
                    <ol>
                      <li>Create 100 test patient records with notes</li>
                      <li>Search for random patient by name</li>
                      <li>Measure time to results displayed</li>
                      <li><span className={styles.pass}>Pass:</span> &lt;10s (average of 20 searches)</li>
                      <li><span className={styles.fail}>Fail:</span> &gt;10s</li>
                    </ol>
                  </div>
                </div>

                <div className={styles.testCase}>
                  <div className={styles.testHeader}>Objective 3: 90%+ sessions have structured notes</div>
                  <div className={styles.testSteps}>
                    <strong>Test:</strong>
                    <ol>
                      <li>Process 50 real session transcripts</li>
                      <li>Count how many produce valid structured notes</li>
                      <li><span className={styles.pass}>Pass:</span> ≥45/50 (90%)</li>
                      <li><span className={styles.fail}>Fail:</span> &lt;45/50</li>
                    </ol>
                  </div>
                </div>

                <div className={styles.testCase}>
                  <div className={styles.testHeader}>Objective 4: Therapist approves AI notes 95%+ of time</div>
                  <div className={styles.testSteps}>
                    <strong>Test:</strong>
                    <ol>
                      <li>Track approval/rejection rate in production for first 100 sessions</li>
                      <li><span className={styles.pass}>Pass:</span> ≥95 approvals</li>
                      <li><span className={styles.fail}>Fail:</span> &lt;95 approvals</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className={styles.insight}>
                <p><strong>Why this matters:</strong> These become the <strong>Verification</strong> section in Inna's AC.md. Sofia runs these exact tests before delivery.</p>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"What's the dependency order? What can we build in parallel?"</p>

              <h4>How to Sequence This</h4>
              <p>Build <strong>thin vertical slices</strong>, not horizontal layers.</p>

              <div className={styles.comparison}>
                <div className={styles.comparisonBad}>
                  <div className={styles.comparisonLabel}>❌ Bad approach (horizontal layers)</div>
                  <div className={styles.comparisonContent}>
                    Week 1: Build entire database schema<br/>
                    Week 2: Build entire API<br/>
                    Week 3: Build entire UI<br/>
                    Week 4: Connect everything (surprise: nothing works together)
                  </div>
                </div>
                <div className={styles.comparisonGood}>
                  <div className={styles.comparisonLabel}>✅ Good approach (vertical slices)</div>
                  <div className={styles.comparisonContent}>
                    Slice 1 (2 days): Record audio → Upload to Supabase → Show "uploaded" message<br/>
                    Slice 2 (1 day): Trigger Whisper transcription on upload → Store transcript<br/>
                    Slice 3 (1 day): Send transcript to Claude → Get structured note → Display in UI<br/>
                    Slice 4 (1 day): Allow therapist edits → Save final note to database<br/>
                    Slice 5 (1 day): Build search (vector embeddings) → Test retrieval
                  </div>
                </div>
              </div>

              <div className={styles.insight}>
                <strong>Why vertical slices?</strong>
                <ul>
                  <li>✅ You can test end-to-end at each slice</li>
                  <li>✅ Client sees progress every 1-2 days</li>
                  <li>✅ If something breaks, you know which slice caused it</li>
                </ul>
              </div>

              <div className={styles.implementationPriorities}>
                <div className={styles.priority}>
                  <div className={styles.priorityHeader}>Priority 1 (Must Have - Week 1)</div>
                  <ul>
                    <li>Audio recording UI</li>
                    <li>Upload to Supabase storage</li>
                    <li>Whisper transcription integration</li>
                    <li>Display raw transcript</li>
                  </ul>
                </div>
                <div className={styles.priority}>
                  <div className={styles.priorityHeader}>Priority 2 (Core Value - Week 1)</div>
                  <ul>
                    <li>Claude API for note structuring</li>
                    <li>Review UI with edit capability</li>
                    <li>Save structured note to database</li>
                  </ul>
                </div>
                <div className={styles.priority}>
                  <div className={styles.priorityHeader}>Priority 3 (Polish - Week 2)</div>
                  <ul>
                    <li>Search with vector embeddings</li>
                    <li>Error handling (retries, offline mode)</li>
                    <li>Performance optimization (&lt;2 min target)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeStep === 7 && (
            <div className={styles.stepDetails}>
              <h4>The Question</h4>
              <p>"Did we actually solve the pain?"</p>

              <h4>How to Verify</h4>
              <p>Go back to Step 2 (Objective) and <strong>measure actual outcomes</strong>.</p>

              <div className={styles.verificationResults}>
                <div className={styles.verificationItem}>
                  <span className={styles.verificationLabel}>Objective 1: Reduce note-taking time to &lt;2 min</span>
                  <span className={styles.verificationResult} style={{ color: '#5CE27E' }}>✅ PASS</span>
                </div>
                <div className={styles.verificationItem}>
                  <span className={styles.verificationLabel}>Objective 2: Find patient history in &lt;10s</span>
                  <span className={styles.verificationResult} style={{ color: '#5CE27E' }}>✅ PASS</span>
                </div>
                <div className={styles.verificationItem}>
                  <span className={styles.verificationLabel}>Objective 3: 90%+ sessions have notes</span>
                  <span className={styles.verificationResult} style={{ color: '#5CE27E' }}>✅ PASS</span>
                </div>
                <div className={styles.verificationItem}>
                  <span className={styles.verificationLabel}>Objective 4: 95%+ therapist approval</span>
                  <span className={styles.verificationResult} style={{ color: '#FF5D5D' }}>❌ FAIL (only 87%)</span>
                </div>
              </div>

              <div className={styles.example}>
                <p><strong>What went wrong with #4?</strong></p>
                <p><strong>Investigation:</strong></p>
                <ul>
                  <li>Asked therapists why they rejected notes</li>
                  <li>Found: AI missed context from previous sessions</li>
                  <li>Solution: Feed last 3 session notes into Claude prompt</li>
                  <li>Re-test: Approval rate → 96% ✅</li>
                </ul>
                <p><strong>Why this matters:</strong> If we shipped at 87% approval, client would've rejected delivery. No AC Green = no payment. Verification catches this <strong>before</strong> client sees it.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={styles.stepNav}>
            <button
              className={styles.navButton}
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
            >
              ← Previous
            </button>
            <span className={styles.stepIndicator}>
              Step {activeStep} of {steps.length}
            </span>
            <button
              className={styles.navButton}
              onClick={() => setActiveStep(Math.min(7, activeStep + 1))}
              disabled={activeStep === 7}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Checklist */}
      <section className={styles.section}>
        <h2>7-Step Checklist (Interactive)</h2>
        <p>Use this checklist before you write ANY code. Progress is saved automatically.</p>

        <div className={styles.checklist}>
          {steps.map((step) => (
            <div key={step.id} className={styles.checklistStep}>
              <div className={styles.checklistHeader} style={{ borderLeftColor: step.color }}>
                <h3>✅ Step {step.id}: {step.name}</h3>
              </div>
              <div className={styles.checklistItems}>
                {step.id === 1 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['1-1'] || false}
                        onChange={() => toggleChecklistItem('1-1')}
                      />
                      <span>What problem is the client experiencing?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['1-2'] || false}
                        onChange={() => toggleChecklistItem('1-2')}
                      />
                      <span>What's the impact (time wasted, money lost, customers frustrated)?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['1-3'] || false}
                        onChange={() => toggleChecklistItem('1-3')}
                      />
                      <span>Is this a real pain or a "nice to have"?</span>
                    </label>
                  </>
                )}
                {step.id === 2 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['2-1'] || false}
                        onChange={() => toggleChecklistItem('2-1')}
                      />
                      <span>What does success look like (observable + measurable)?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['2-2'] || false}
                        onChange={() => toggleChecklistItem('2-2')}
                      />
                      <span>How will we know when the pain is solved?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['2-3'] || false}
                        onChange={() => toggleChecklistItem('2-3')}
                      />
                      <span>Are these pass/fail criteria (no room for "I don't like it")?</span>
                    </label>
                  </>
                )}
                {step.id === 3 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['3-1'] || false}
                        onChange={() => toggleChecklistItem('3-1')}
                      />
                      <span>What are the major components?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['3-2'] || false}
                        onChange={() => toggleChecklistItem('3-2')}
                      />
                      <span>What external APIs/services are needed?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['3-3'] || false}
                        onChange={() => toggleChecklistItem('3-3')}
                      />
                      <span>What's the tech stack?</span>
                    </label>
                  </>
                )}
                {step.id === 4 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['4-1'] || false}
                        onChange={() => toggleChecklistItem('4-1')}
                      />
                      <span>What's the happy path (step-by-step)?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['4-2'] || false}
                        onChange={() => toggleChecklistItem('4-2')}
                      />
                      <span>What are the sad paths (edge cases)?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['4-3'] || false}
                        onChange={() => toggleChecklistItem('4-3')}
                      />
                      <span>How do we handle errors gracefully?</span>
                    </label>
                  </>
                )}
                {step.id === 5 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['5-1'] || false}
                        onChange={() => toggleChecklistItem('5-1')}
                      />
                      <span>For each objective, what specific tests prove it's met?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['5-2'] || false}
                        onChange={() => toggleChecklistItem('5-2')}
                      />
                      <span>Are these tests automatable (for Sofia to run)?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['5-3'] || false}
                        onChange={() => toggleChecklistItem('5-3')}
                      />
                      <span>Do we have test data ready?</span>
                    </label>
                  </>
                )}
                {step.id === 6 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['6-1'] || false}
                        onChange={() => toggleChecklistItem('6-1')}
                      />
                      <span>What's the build order (vertical slices)?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['6-2'] || false}
                        onChange={() => toggleChecklistItem('6-2')}
                      />
                      <span>What can we deliver in Week 1 to show value?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['6-3'] || false}
                        onChange={() => toggleChecklistItem('6-3')}
                      />
                      <span>Are slices testable end-to-end?</span>
                    </label>
                  </>
                )}
                {step.id === 7 && (
                  <>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['7-1'] || false}
                        onChange={() => toggleChecklistItem('7-1')}
                      />
                      <span>Did we measure against objectives?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['7-2'] || false}
                        onChange={() => toggleChecklistItem('7-2')}
                      />
                      <span>If any objective failed, what's the fix?</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={checklist['7-3'] || false}
                        onChange={() => toggleChecklistItem('7-3')}
                      />
                      <span>Is client pain actually solved?</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.checklistProgress}>
          <strong>Progress:</strong> {Object.values(checklist).filter(Boolean).length} / 21 items completed
          {Object.values(checklist).filter(Boolean).length === 21 && (
            <span className={styles.checklistComplete}>🎉 All done! Ready to build.</span>
          )}
        </div>
      </section>

      {/* Common Mistakes */}
      <section className={styles.section}>
        <h2>Common Mistakes & How to Avoid Them</h2>

        <div className={styles.mistakes}>
          <div className={styles.mistake}>
            <h3>❌ Mistake 1: Building What Client Says, Not What They Need</h3>
            <div className={styles.mistakeExample}>
              <p><strong>Example:</strong></p>
              <p>Client: "I need a mobile app."</p>
              <p>You: <em>*Builds mobile app*</em></p>
              <p>Client: "This doesn't solve my problem. I just wanted customers to book appointments easily."</p>
            </div>
            <div className={styles.mistakeFix}>
              <p><strong>Fix:</strong></p>
              <p>Extract the pain first: "What problem does a mobile app solve?"</p>
              <p>Real need: "Easy appointment booking" → Could be solved with:</p>
              <ul>
                <li>Mobile app (expensive, 3 weeks)</li>
                <li>Web app (cheaper, 1 week)</li>
                <li>Calendly integration (cheapest, 2 hours)</li>
              </ul>
              <p><strong>Ask: "What's the simplest solution to the pain?"</strong></p>
            </div>
          </div>

          <div className={styles.mistake}>
            <h3>❌ Mistake 2: Skipping the Test Plan</h3>
            <div className={styles.mistakeExample}>
              <p><strong>Example:</strong></p>
              <p>You build a "fast dashboard" but never define "fast."</p>
              <p>Client: "This is too slow."</p>
              <p>You: "It loads in 4 seconds, that's fast!"</p>
              <p>Client: "I expected &lt;1 second."</p>
            </div>
            <div className={styles.mistakeFix}>
              <p><strong>Fix:</strong></p>
              <p>Define "fast" in Step 2 (Objective):</p>
              <ul>
                <li>Dashboard loads in &lt;1s (p95)</li>
                <li>Queries return in &lt;500ms</li>
                <li>Lighthouse performance &gt;90</li>
              </ul>
              <p>Now it's objective pass/fail, not subjective opinion.</p>
            </div>
          </div>

          <div className={styles.mistake}>
            <h3>❌ Mistake 3: Building Everything at Once (Big Bang Integration)</h3>
            <div className={styles.mistakeExample}>
              <p><strong>Example:</strong></p>
              <p>Week 1-2: Build database</p>
              <p>Week 3: Build API</p>
              <p>Week 4: Build UI</p>
              <p>Week 5: Try to connect everything → Nothing works together</p>
            </div>
            <div className={styles.mistakeFix}>
              <p><strong>Fix:</strong></p>
              <p>Build thin vertical slices:</p>
              <ul>
                <li>Slice 1: One feature, end-to-end, working</li>
                <li>Slice 2: Next feature, end-to-end, working</li>
                <li>Test integration at each slice</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className={styles.section}>
        <h2>Related Resources</h2>
        <div className={styles.relatedLinks}>
          <Link href="/resources/complete-mission-flow" className={styles.relatedLink}>
            <span className={styles.relatedIcon}>🔄</span>
            <div>
              <div className={styles.relatedTitle}>The Complete Mission Flow</div>
              <div className={styles.relatedDesc}>See how this framework fits into the full delivery process</div>
            </div>
          </Link>
          <Link href="/resources/how-to-talk-to-ai-citizens" className={styles.relatedLink}>
            <span className={styles.relatedIcon}>💬</span>
            <div>
              <div className={styles.relatedTitle}>How to Talk to AI Citizens</div>
              <div className={styles.relatedDesc}>Ask Rafael to generate code from your implementation plan</div>
            </div>
          </Link>
          <Link href="/resources/compensation-structure" className={styles.relatedLink}>
            <span className={styles.relatedIcon}>💰</span>
            <div>
              <div className={styles.relatedTitle}>Compensation Structure</div>
              <div className={styles.relatedDesc}>Understand how you get paid for delivering quality work</div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Questions About This Framework?</h2>
        <p>
          This is how <strong>every ScopeLock mission starts</strong>. If you're unclear on any step, ask:
        </p>
        <ul>
          <li><strong>Inna</strong> (via Claude Code): For help extracting pain points and writing objectives</li>
          <li><strong>Rafael</strong> (via Claude Code): For architecture and implementation planning</li>
          <li><strong>NLR</strong> (via Telegram @nlr_ai): For strategic guidance on complex missions</li>
        </ul>
        <p style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>
          <strong>Remember:</strong> Spending 2 hours on Steps 1-5 saves you 20 hours of rework later.
        </p>
      </section>
    </main>
  );
}
