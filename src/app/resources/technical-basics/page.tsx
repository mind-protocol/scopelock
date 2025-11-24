import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './styles.module.css';

export const metadata: Metadata = {
  title: 'Technical Basics for ScopeLock Developers | ScopeLock Resources',
  description: 'Learn the fundamentals: Markdown, System Prompts, GitHub, Specifications, Tests, Pushing, and Deployment. Essential knowledge for new ScopeLock team members.',
  keywords: ['markdown', 'github', 'system prompt', 'deployment', 'testing', 'specifications', 'ScopeLock training'],
};

export default function TechnicalBasicsPage() {
  return (
    <main className={styles.resourcePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>📚 TEAM TRAINING</div>
        <h1 className={styles.heroTitle}>
          Technical Basics for ScopeLock Developers
        </h1>
        <p className={styles.heroSubtitle}>
          Everything you need to know to start contributing. No prior coding experience required.
        </p>

        <div className={styles.tocBox}>
          <h3>What You'll Learn</h3>
          <div className={styles.tocGrid}>
            <a href="#markdown" className={styles.tocItem}>1. Markdown</a>
            <a href="#system-prompt" className={styles.tocItem}>2. System Prompts</a>
            <a href="#github" className={styles.tocItem}>3. GitHub</a>
            <a href="#specs" className={styles.tocItem}>4. Specifications</a>
            <a href="#tests" className={styles.tocItem}>5. Tests</a>
            <a href="#pushing" className={styles.tocItem}>6. Pushing Code</a>
            <a href="#deployment" className={styles.tocItem}>7. Deployment</a>
            <a href="#full-flow" className={styles.tocItem}>8. Full Flow</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className={styles.content}>

        {/* Section 1: Markdown */}
        <section className={styles.section} id="markdown">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1</span>
            What is Markdown?
          </h2>

          <div className={styles.definition}>
            <strong>Simple explanation:</strong> Markdown is a way to format text using simple symbols.
            Instead of clicking buttons like in Word, you type symbols that become formatting.
          </div>

          <div className={styles.whyBox}>
            <h4>Why We Use It</h4>
            <ul>
              <li>All our documentation is written in Markdown</li>
              <li>GitHub uses Markdown</li>
              <li>Claude understands Markdown</li>
              <li>It's simple and works everywhere</li>
            </ul>
          </div>

          <div className={styles.exampleBox}>
            <h4>Basic Markdown Examples</h4>
            <div className={styles.codeComparison}>
              <div className={styles.codeBlock}>
                <div className={styles.codeLabel}>What You Type</div>
                <pre>{`# Big Heading
## Medium Heading
### Small Heading

**This is bold**
*This is italic*

- Bullet point
- Another bullet

1. Numbered item
2. Another number

\`inline code\`

[Link text](https://example.com)`}</pre>
              </div>
              <div className={styles.resultBlock}>
                <div className={styles.codeLabel}>What You Get</div>
                <div className={styles.resultContent}>
                  <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Big Heading</h1>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Medium Heading</h2>
                  <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Small Heading</h3>
                  <p><strong>This is bold</strong></p>
                  <p><em>This is italic</em></p>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>Bullet point</li>
                    <li>Another bullet</li>
                  </ul>
                  <ol style={{ marginLeft: '20px' }}>
                    <li>Numbered item</li>
                    <li>Another number</li>
                  </ol>
                  <p><code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: '4px' }}>inline code</code></p>
                  <p><a href="#" style={{ color: '#1EE5B8' }}>Link text</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.useCase}>
            <h4>Where You'll Use It</h4>
            <ul>
              <li>Writing documentation</li>
              <li>Creating README files</li>
              <li>Communicating in GitHub</li>
              <li>Writing specs for Claude</li>
            </ul>
          </div>
        </section>

        {/* Section 2: System Prompt */}
        <section className={styles.section} id="system-prompt">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2</span>
            What is a System Prompt?
          </h2>

          <div className={styles.definition}>
            <strong>Simple explanation:</strong> A system prompt is the "personality" and "instructions"
            you give to an AI before it starts working. It tells the AI who it is, what it knows, and
            how it should behave.
          </div>

          <div className={styles.analogyBox}>
            <h4>Real-World Analogy</h4>
            <p>Think of it like training a new employee on their first day:</p>
            <ul>
              <li>"You are a customer service agent"</li>
              <li>"You always speak politely"</li>
              <li>"You know our product catalog"</li>
              <li>"When customers ask X, you do Y"</li>
            </ul>
          </div>

          <div className={styles.exampleBox}>
            <h4>Example System Prompt</h4>
            <pre className={styles.codeSnippet}>{`You are Maya, the Client Success Manager at ScopeLock.

Your responsibilities:
- Communicate with clients professionally
- Provide weekly status updates
- Handle change requests

Your personality:
- Warm but professional
- Proactive communicator
- Never overpromise

When a client asks about timeline, always check
with the team first.`}</pre>
          </div>

          <div className={styles.whyBox}>
            <h4>Why It Matters</h4>
            <ul>
              <li>Different system prompts = different AI behaviors</li>
              <li>A good system prompt = consistent, quality AI output</li>
              <li>Our AI citizens (Emma, Inna, Rafael, Sofia, Maya, Alexis) all have system prompts</li>
              <li>The system prompt lives in <code>CLAUDE.md</code> files</li>
            </ul>
          </div>

          <div className={styles.useCase}>
            <h4>Where You'll See System Prompts</h4>
            <ul>
              <li><code>/citizens/*/CLAUDE.md</code> files</li>
              <li>When you start a Claude Code session</li>
              <li>When configuring AI assistants</li>
            </ul>
          </div>
        </section>

        {/* Section 3: GitHub */}
        <section className={styles.section} id="github">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3</span>
            What is GitHub?
          </h2>

          <div className={styles.definition}>
            <strong>Simple explanation:</strong> GitHub is like Google Drive for code. It stores all
            your code files in the cloud, tracks every change ever made, and lets teams work together
            without overwriting each other's work.
          </div>

          <div className={styles.conceptsGrid}>
            <div className={styles.conceptCard}>
              <h4>Repository (Repo)</h4>
              <p>A folder containing all your project files</p>
              <div className={styles.conceptExample}>
                Example: <code>github.com/mind-protocol/scopelock</code>
              </div>
            </div>

            <div className={styles.conceptCard}>
              <h4>Commit</h4>
              <p>A "save point" with a description of what changed</p>
              <div className={styles.conceptExample}>
                Like saving a game - you can go back to any commit
              </div>
            </div>

            <div className={styles.conceptCard}>
              <h4>Branch</h4>
              <p>A separate version of the code to work on features</p>
              <div className={styles.conceptExample}>
                <code>main</code> = production-ready code
              </div>
            </div>

            <div className={styles.conceptCard}>
              <h4>Pull Request (PR)</h4>
              <p>A request to merge your changes into the main code</p>
              <div className={styles.conceptExample}>
                Others can review before it goes live
              </div>
            </div>
          </div>

          <div className={styles.exampleBox}>
            <h4>Common Commands You'll See</h4>
            <pre className={styles.codeSnippet}>{`git status          # What files changed?
git add .           # Stage all changes for commit
git commit -m "message"  # Save changes with description
git push            # Upload changes to GitHub
git pull            # Download latest changes from GitHub`}</pre>
          </div>

          <div className={styles.whyBox}>
            <h4>Why GitHub Matters</h4>
            <ul>
              <li>All our code lives there</li>
              <li>Every change is tracked (we can undo mistakes)</li>
              <li>Multiple people can work without conflicts</li>
              <li>It's the source of truth for what's deployed</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Specifications */}
        <section className={styles.section} id="specs">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>4</span>
            What is a Specification (Spec)?
          </h2>

          <div className={styles.definition}>
            <strong>Simple explanation:</strong> A specification is a detailed document that describes
            EXACTLY what needs to be built, how it should work, and how we know it's done.
          </div>

          <div className={styles.whyBox}>
            <h4>Why We Write Specs</h4>
            <ul>
              <li>No guessing about requirements</li>
              <li>AI (Rafael) can build from clear specs</li>
              <li>Everyone agrees on what "done" means</li>
              <li>Prevents "that's not what I wanted" problems</li>
            </ul>
          </div>

          <div className={styles.specStructure}>
            <h4>What a Good Spec Includes</h4>

            <div className={styles.specItem}>
              <div className={styles.specLabel}>1. Functional Requirements</div>
              <div className={styles.specDesc}>What it does</div>
              <ul>
                <li>User can log in with email and password</li>
                <li>System sends confirmation email</li>
                <li>Dashboard shows last 30 days of data</li>
              </ul>
            </div>

            <div className={styles.specItem}>
              <div className={styles.specLabel}>2. Non-Functional Requirements</div>
              <div className={styles.specDesc}>How well it does it</div>
              <ul>
                <li>Page loads in under 2 seconds</li>
                <li>Works on mobile and desktop</li>
                <li>Handles 100 concurrent users</li>
              </ul>
            </div>

            <div className={styles.specItem}>
              <div className={styles.specLabel}>3. Acceptance Criteria</div>
              <div className={styles.specDesc}>How we verify it</div>
              <ul>
                <li>Test: Login with valid credentials → Success</li>
                <li>Test: Login with wrong password → Error message</li>
                <li>Test: Load time &lt; 2 seconds on 3G connection</li>
              </ul>
            </div>
          </div>

          <div className={styles.levelBox}>
            <h4>Our 6-Level Spec Structure</h4>
            <ol>
              <li><strong>PATTERN</strong> - Core principles</li>
              <li><strong>BEHAVIOR_SPEC</strong> - What it should do (AC.md)</li>
              <li><strong>VALIDATION</strong> - Tests to verify it works</li>
              <li><strong>MECHANISM</strong> - How it's built technically</li>
              <li><strong>ALGORITHM</strong> - Step-by-step code logic</li>
              <li><strong>GUIDE</strong> - How to use/deploy it</li>
            </ol>
          </div>
        </section>

        {/* Section 5: Tests */}
        <section className={styles.section} id="tests">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>5</span>
            What are Tests?
          </h2>

          <div className={styles.definition}>
            <strong>Simple explanation:</strong> Tests are code that checks if your code works correctly.
            Instead of manually clicking through an app to check if it works, tests do it automatically in seconds.
          </div>

          <div className={styles.whyBox}>
            <h4>Why We Test</h4>
            <ul>
              <li>Catch bugs before users see them</li>
              <li>Confidence that changes don't break things</li>
              <li><strong>"If it's not tested, it's not built"</strong></li>
              <li>Required for AC Green (client pays when tests pass)</li>
            </ul>
          </div>

          <div className={styles.testTypes}>
            <h4>Types of Tests</h4>

            <div className={styles.testCard}>
              <div className={styles.testType}>Unit Tests</div>
              <p>Test one small piece in isolation</p>
              <div className={styles.testExample}>
                "Does the calculateTotal function return the right number?"
              </div>
            </div>

            <div className={styles.testCard}>
              <div className={styles.testType}>Integration Tests</div>
              <p>Test multiple pieces working together</p>
              <div className={styles.testExample}>
                "Does the checkout flow save to database correctly?"
              </div>
            </div>

            <div className={styles.testCard}>
              <div className={styles.testType}>End-to-End (E2E) Tests</div>
              <p>Test the whole app like a real user</p>
              <div className={styles.testExample}>
                "Can a user sign up, log in, and make a purchase?"
              </div>
            </div>
          </div>

          <div className={styles.exampleBox}>
            <h4>What Tests Look Like</h4>
            <pre className={styles.codeSnippet}>{`# Python test example
def test_calculate_total():
    items = [{"price": 10}, {"price": 20}]
    result = calculate_total(items)
    assert result == 30  # Should equal 30

// JavaScript test example
test('login shows error for wrong password', async () => {
  await page.fill('#password', 'wrong');
  await page.click('#submit');
  expect(page.locator('.error')).toBeVisible();
});`}</pre>
          </div>

          <div className={styles.acGreenBox}>
            <h4>Key Concept: AC Green</h4>
            <ul>
              <li><strong>AC</strong> = Acceptance Criteria</li>
              <li><strong>Green</strong> = All tests pass</li>
              <li><strong>Clients pay at "AC Green"</strong> - when tests prove everything works</li>
            </ul>
          </div>

          <div className={styles.toolsBox}>
            <h4>Our Testing Tools</h4>
            <ul>
              <li><strong>pytest</strong> - Python backend tests</li>
              <li><strong>Vitest/Jest</strong> - JavaScript/React tests</li>
              <li><strong>Playwright</strong> - Browser E2E tests</li>
            </ul>
          </div>
        </section>

        {/* Section 6: Pushing */}
        <section className={styles.section} id="pushing">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>6</span>
            What Does "Pushing" Mean?
          </h2>

          <div className={styles.definition}>
            <strong>Simple explanation:</strong> "Pushing" means uploading your code changes from your
            computer to GitHub, so others can see and use them.
          </div>

          <div className={styles.flowDiagram}>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}>💻</div>
              <div className={styles.flowLabel}>Your Computer</div>
            </div>
            <div className={styles.flowArrow}>→ push →</div>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}>🐙</div>
              <div className={styles.flowLabel}>GitHub</div>
            </div>
            <div className={styles.flowArrow}>→ deploy →</div>
            <div className={styles.flowStep}>
              <div className={styles.flowIcon}>🌐</div>
              <div className={styles.flowLabel}>Live Website</div>
            </div>
          </div>

          <div className={styles.exampleBox}>
            <h4>The Command</h4>
            <pre className={styles.codeSnippet}>{`git push origin main

# git push = Upload my changes
# origin   = To the GitHub repository
# main     = To the main branch`}</pre>
          </div>

          <div className={styles.whyBox}>
            <h4>What Happens After You Push</h4>
            <ol>
              <li>GitHub receives your code</li>
              <li>Vercel/Render sees the new commit</li>
              <li>They automatically build and deploy</li>
              <li>~2 minutes later, it's live on the website</li>
            </ol>
          </div>
        </section>

        {/* Section 7: Deployment */}
        <section className={styles.section} id="deployment">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>7</span>
            What is "Production" and "Deployment"?
          </h2>

          <div className={styles.definition}>
            <strong>Production</strong> = The live website that real users see<br />
            <strong>Deployment</strong> = The process of putting code onto production
          </div>

          <div className={styles.platformsGrid}>
            <div className={styles.platformCard}>
              <div className={styles.platformLogo}>▲</div>
              <h4>Vercel</h4>
              <p>Hosts our <strong>Frontend</strong> (Next.js)</p>
              <ul>
                <li>URL: scopelock.mindprotocol.ai</li>
                <li>Auto-deploys when we push to <code>main</code></li>
                <li>Takes ~2 minutes</li>
              </ul>
            </div>

            <div className={styles.platformCard}>
              <div className={styles.platformLogo}>◉</div>
              <h4>Render</h4>
              <p>Hosts our <strong>Backend</strong> (Python/FastAPI)</p>
              <ul>
                <li>Also hosts databases</li>
                <li>Also auto-deploys from GitHub</li>
                <li>Reliable and scalable</li>
              </ul>
            </div>
          </div>

          <div className={styles.deploymentFlow}>
            <h4>The Deployment Flow</h4>
            <ol>
              <li>You push code to GitHub</li>
              <li>Vercel/Render detects the push</li>
              <li>They download the new code</li>
              <li>They build it (compile, install dependencies)</li>
              <li>They replace the old version with the new one</li>
              <li>Users now see the new version</li>
            </ol>
          </div>

          <div className={styles.termsGrid}>
            <div className={styles.termCard}>
              <h4>Build</h4>
              <p>Converting your code into something that can run. Installing dependencies, compiling, optimizing.</p>
            </div>
            <div className={styles.termCard}>
              <h4>Deploy</h4>
              <p>Putting the built code onto a server. Making it available to users.</p>
            </div>
            <div className={styles.termCard}>
              <h4>Rollback</h4>
              <p>Going back to a previous version if something breaks.</p>
            </div>
          </div>
        </section>

        {/* Section 8: Full Flow */}
        <section className={styles.section} id="full-flow">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>8</span>
            Putting It All Together: The Full Flow
          </h2>

          <div className={styles.fullFlow}>
            <div className={styles.flowCard}>
              <div className={styles.flowNum}>1</div>
              <div className={styles.flowTitle}>SPEC (Inna)</div>
              <ul>
                <li>Writes specification in Markdown</li>
                <li>Defines acceptance criteria</li>
                <li>Creates test requirements</li>
              </ul>
            </div>

            <div className={styles.flowCard}>
              <div className={styles.flowNum}>2</div>
              <div className={styles.flowTitle}>TESTS (Sofia)</div>
              <ul>
                <li>Generates test code from spec</li>
                <li>Tests are ready before implementation</li>
              </ul>
            </div>

            <div className={styles.flowCard}>
              <div className={styles.flowNum}>3</div>
              <div className={styles.flowTitle}>CODE (Rafael)</div>
              <ul>
                <li>Generates implementation code</li>
                <li>Code is designed to pass Sofia's tests</li>
              </ul>
            </div>

            <div className={styles.flowCard}>
              <div className={styles.flowNum}>4</div>
              <div className={styles.flowTitle}>REVIEW (You)</div>
              <ul>
                <li>Review the generated code</li>
                <li>Run tests locally</li>
                <li>Fix any issues</li>
              </ul>
            </div>

            <div className={styles.flowCard}>
              <div className={styles.flowNum}>5</div>
              <div className={styles.flowTitle}>PUSH (You)</div>
              <ul>
                <li><code>git add .</code></li>
                <li><code>git commit -m "Add feature"</code></li>
                <li><code>git push origin main</code></li>
              </ul>
            </div>

            <div className={styles.flowCard}>
              <div className={styles.flowNum}>6</div>
              <div className={styles.flowTitle}>DEPLOY (Automatic)</div>
              <ul>
                <li>Vercel/Render sees the push</li>
                <li>Builds and deploys automatically</li>
                <li>Live in ~2 minutes</li>
              </ul>
            </div>

            <div className={styles.flowCard}>
              <div className={styles.flowNum}>7</div>
              <div className={styles.flowTitle}>VERIFY (Sofia)</div>
              <ul>
                <li>Runs full test suite against deployment</li>
                <li>Verifies AC Green</li>
              </ul>
            </div>

            <div className={styles.flowCard} style={{ borderColor: '#1EE5B8', background: 'rgba(30, 229, 184, 0.1)' }}>
              <div className={styles.flowNum} style={{ background: '#1EE5B8', color: '#0E1116' }}>8</div>
              <div className={styles.flowTitle} style={{ color: '#1EE5B8' }}>DONE ✅</div>
              <ul>
                <li>Tests pass = AC Green</li>
                <li>Client can verify</li>
                <li>Invoice sent</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className={styles.section} id="reference">
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>📋</span>
            Quick Reference Card
          </h2>

          <div className={styles.referenceTable}>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Markdown</div>
              <div className={styles.refDef}>Text formatting with symbols (<code>#</code>, <code>**</code>, <code>-</code>)</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>System Prompt</div>
              <div className={styles.refDef}>Instructions that define AI behavior</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>GitHub</div>
              <div className={styles.refDef}>Cloud storage for code with version tracking</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Repository</div>
              <div className={styles.refDef}>A project folder on GitHub</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Commit</div>
              <div className={styles.refDef}>A saved checkpoint with description</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Push</div>
              <div className={styles.refDef}>Upload code from your computer to GitHub</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Pull</div>
              <div className={styles.refDef}>Download latest code from GitHub</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Spec</div>
              <div className={styles.refDef}>Document describing what to build</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Tests</div>
              <div className={styles.refDef}>Code that verifies other code works</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>AC Green</div>
              <div className={styles.refDef}>All acceptance tests passing</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Production</div>
              <div className={styles.refDef}>The live website users see</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Deployment</div>
              <div className={styles.refDef}>Process of putting code live</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Vercel</div>
              <div className={styles.refDef}>Hosts our frontend (Next.js)</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Render</div>
              <div className={styles.refDef}>Hosts our backend (Python)</div>
            </div>
            <div className={styles.refRow}>
              <div className={styles.refTerm}>Build</div>
              <div className={styles.refDef}>Compile and prepare code to run</div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className={styles.helpSection}>
          <h2>Need Help?</h2>
          <div className={styles.helpGrid}>
            <div className={styles.helpCard}>
              <h4>Stuck on Git?</h4>
              <ul>
                <li>Ask Rafael for git commands</li>
                <li>Check GitHub Desktop (visual interface)</li>
              </ul>
            </div>
            <div className={styles.helpCard}>
              <h4>Confused about a spec?</h4>
              <ul>
                <li>Ask Inna for clarification</li>
                <li>Read the MECHANISM section</li>
              </ul>
            </div>
            <div className={styles.helpCard}>
              <h4>Tests failing?</h4>
              <ul>
                <li>Ask Sofia what's wrong</li>
                <li>Check the error message carefully</li>
              </ul>
            </div>
            <div className={styles.helpCard}>
              <h4>Deployment issues?</h4>
              <ul>
                <li>Check Vercel/Render dashboard for logs</li>
                <li>Ask Rafael for DevOps help</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className={styles.footer}>
          <p className={styles.footerQuote}>
            "The best time to learn these basics was yesterday. The second best time is now."
          </p>
          <p className={styles.footerAttribution}>— ScopeLock Team</p>
          <div className={styles.footerLinks}>
            <Link href="/resources">← All Resources</Link>
            <Link href="/resources/how-to-talk-to-ai-citizens">How to Talk to AI Citizens →</Link>
          </div>
        </section>

      </article>
    </main>
  );
}
