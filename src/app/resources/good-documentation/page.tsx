'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './styles.module.css';

export default function GoodDocumentationPage() {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [selectedExample, setSelectedExample] = useState<'bad' | 'good'>('bad');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: boolean }>({});

  const toggleLevel = (levelIndex: number) => {
    setExpandedLevel(expandedLevel === levelIndex ? null : levelIndex);
  };

  const toggleQuizAnswer = (questionIndex: number) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: !quizAnswers[questionIndex]
    });
  };

  const levels = [
    {
      number: 1,
      name: 'PATTERN',
      emoji: '🎯',
      purpose: 'Core principles for this mission',
      audience: 'Everyone',
      example: '"Pay at AC green" - client only pays when tests pass'
    },
    {
      number: 2,
      name: 'BEHAVIOR_SPEC',
      emoji: '📋',
      purpose: 'What success looks like (AC.md)',
      audience: 'Client + Team',
      example: 'Functional criteria: "User can sign up with email" + verification steps'
    },
    {
      number: 3,
      name: 'VALIDATION',
      emoji: '✅',
      purpose: 'How we verify it works',
      audience: 'Sofia + Bigbosexf',
      example: 'Acceptance tests, performance thresholds (p95 < 200ms)'
    },
    {
      number: 4,
      name: 'MECHANISM',
      emoji: '🏗️',
      purpose: 'Implementation approach',
      audience: 'Kara + Rafael',
      example: 'Architecture: Next.js frontend, FastAPI backend, PostgreSQL'
    },
    {
      number: 5,
      name: 'ALGORITHM',
      emoji: '⚙️',
      purpose: 'Code-level steps',
      audience: 'Rafael (generates code)',
      example: 'Detailed flow: API call → validate → store → send email → return 201'
    },
    {
      number: 6,
      name: 'GUIDE',
      emoji: '📖',
      purpose: 'How to adopt/deploy',
      audience: 'Kara + Client',
      example: 'CLI commands, Vercel deploy steps, environment variables'
    }
  ];

  const badExample = `# User Authentication

The app needs user authentication.

Users should be able to sign up and log in.

Please implement this feature.`;

  const goodExample = `# User Authentication (PATTERN → GUIDE)

## PATTERN
**Core principle:** Users own their data. Authentication protects access while maintaining zero-knowledge privacy.

**Key decisions:**
- Email-based (no OAuth dependencies)
- JWT tokens (stateless, edge-compatible)
- One-time passwords (no password storage)

## BEHAVIOR_SPEC (AC.md)

### Functional Criteria
1. **Signup Flow**
   - User enters email
   - System sends 6-digit OTP
   - User enters OTP within 10 minutes
   - System creates account + session
   - User lands on dashboard

2. **Login Flow**
   - User enters email
   - System sends 6-digit OTP
   - User enters OTP within 10 minutes
   - System validates account exists
   - User lands on dashboard

3. **Session Management**
   - JWT token expires after 7 days
   - User can logout (clears token)
   - Invalid token redirects to login

### Non-Functional Criteria
- OTP delivery: p95 < 5 seconds
- Login validation: p95 < 200ms
- Email deliverability: >98%
- Mobile responsive (320px+)

### Verification
\`\`\`bash
# Test signup flow
npm run test:e2e -- --spec=auth/signup.spec.ts

# Test login flow
npm run test:e2e -- --spec=auth/login.spec.ts

# Seed data (test accounts)
npm run seed:auth
\`\`\`

## VALIDATION

### Acceptance Tests
\`\`\`typescript
// tests/auth/signup.spec.ts
test('user can sign up with valid email', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  // Should show OTP input
  await expect(page.locator('[name="otp"]')).toBeVisible();

  // Get OTP from test inbox
  const otp = await getTestOTP('test@example.com');
  await page.fill('[name="otp"]', otp);
  await page.click('button:has-text("Verify")');

  // Should land on dashboard
  await expect(page).toHaveURL('/dashboard');
});
\`\`\`

### Performance Thresholds
- OTP API response: p50 < 100ms, p95 < 200ms, p99 < 500ms
- Email delivery: p95 < 5 seconds
- JWT validation: p95 < 50ms

### Quality Gates
- ✅ All acceptance tests pass
- ✅ Email deliverability >98% (verified via SendGrid metrics)
- ✅ No console errors in browser
- ✅ Lighthouse Accessibility score ≥90

## MECHANISM

### Architecture
**Frontend:**
- Next.js 14 App Router
- Server actions for auth mutations
- Client components for forms
- Edge-compatible (no Node.js-only APIs)

**Backend:**
- Supabase Auth (managed service)
- PostgreSQL for user profiles
- SendGrid for email delivery

**Session:**
- JWT stored in httpOnly cookie
- Middleware validates on protected routes
- Auto-refresh before expiry

### Data Flow
1. User submits email → Server action
2. Server generates 6-digit OTP
3. Server stores OTP in Redis (TTL 10min)
4. Server sends email via SendGrid
5. User submits OTP → Server action
6. Server validates OTP from Redis
7. Server creates user record if new
8. Server generates JWT + httpOnly cookie
9. Server returns redirect to dashboard

### Tech Stack Rationale
- **Supabase Auth:** Battle-tested, handles edge cases, managed service
- **SendGrid:** 99.9% uptime, delivery analytics, scalable
- **Redis:** Fast OTP lookup, automatic expiry

## ALGORITHM

### Signup Flow (Code-Level)
\`\`\`typescript
// app/actions/auth.ts
export async function signupWithEmail(email: string) {
  // 1. Validate email format
  if (!isValidEmail(email)) {
    return { error: 'Invalid email format' };
  }

  // 2. Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: 'Email already registered' };
  }

  // 3. Generate OTP
  const otp = generateOTP(); // 6 digits

  // 4. Store in Redis with 10min TTL
  await redis.set(\`otp:\${email}\`, otp, 'EX', 600);

  // 5. Send email
  await sendEmail({
    to: email,
    subject: 'Your signup code',
    text: \`Your code is: \${otp}\`,
    html: renderOTPEmail(otp)
  });

  // 6. Return success (no OTP in response!)
  return { success: true };
}

export async function verifyOTP(email: string, otp: string) {
  // 1. Get stored OTP
  const storedOTP = await redis.get(\`otp:\${email}\`);

  // 2. Validate match
  if (storedOTP !== otp) {
    return { error: 'Invalid or expired code' };
  }

  // 3. Create user if new
  const user = await db.user.upsert({
    where: { email },
    create: { email, createdAt: new Date() },
    update: { lastLoginAt: new Date() }
  });

  // 4. Delete OTP (one-time use)
  await redis.del(\`otp:\${email}\`);

  // 5. Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 6. Set httpOnly cookie
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });

  // 7. Return user
  return { user };
}
\`\`\`

### Login Flow (Code-Level)
Same as signup but with user existence check first:
\`\`\`typescript
export async function loginWithEmail(email: string) {
  // 1. Check if user exists
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return { error: 'No account found with this email' };
  }

  // 2-6. Same as signup (generate OTP, store, send email)
  // ...
}
\`\`\`

## GUIDE

### How to Adopt

**1. Environment Setup**
\`\`\`bash
# .env.local
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
SENDGRID_API_KEY="SG.xxx"
JWT_SECRET="your-secret-here"
\`\`\`

**2. Install Dependencies**
\`\`\`bash
npm install @supabase/supabase-js ioredis @sendgrid/mail jsonwebtoken
npm install -D @types/jsonwebtoken
\`\`\`

**3. Run Database Migrations**
\`\`\`bash
npx prisma migrate dev
\`\`\`

**4. Test Locally**
\`\`\`bash
# Start dev server
npm run dev

# In another terminal, run acceptance tests
npm run test:e2e
\`\`\`

**5. Deploy to Vercel**
\`\`\`bash
# Set environment variables in Vercel dashboard
vercel env add DATABASE_URL
vercel env add REDIS_URL
vercel env add SENDGRID_API_KEY
vercel env add JWT_SECRET

# Deploy
vercel --prod
\`\`\`

### Common Issues

**OTP not arriving:**
- Check SendGrid dashboard for delivery status
- Verify SENDGRID_API_KEY is valid
- Check spam folder

**JWT validation fails:**
- Verify JWT_SECRET matches between environments
- Check cookie is httpOnly (not accessible via JS)
- Ensure middleware runs on protected routes

**Redis connection fails:**
- Check REDIS_URL format
- Verify Redis instance is accessible from deployment

### How to Test Manually
1. Go to /signup
2. Enter email: test@example.com
3. Check terminal for OTP (dev mode logs it)
4. Enter OTP
5. Should redirect to /dashboard
6. Verify cookie set in browser DevTools (Application tab)`;

  return (
    <main className={styles.goodDocumentation}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/resources" className={styles.backLink}>← Resources</Link>
        <h1>What Good Documentation Looks Like (PATTERN→GUIDE)</h1>
        <div className={styles.meta}>
          <time>Nov 6, 2025</time>
          <span>•</span>
          <span>18 min read</span>
          <span>•</span>
          <span>Team Onboarding Series #4</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.tag}>#onboarding</span>
          <span className={styles.tag}>#documentation</span>
          <span className={styles.tag}>#quality</span>
        </div>
        <div className={styles.resources}>
          📚 <strong>Resources:</strong>
          <a href="#quick-ref">6-Level Checklist</a> •
          <a href="#examples">Before/After Examples</a> •
          <a href="#quiz">Quiz</a>
        </div>
      </header>

      {/* Lead */}
      <section className={styles.lead}>
        <p className={styles.leadQuote}>
          "The app needs user authentication. Please implement this feature."
        </p>
        <p>
          You're Kara. You just received this "spec" from Reanance. You ask Rafael to generate code. Rafael asks: <strong>"What kind of authentication? OAuth? Email/password? What happens on signup? What about password reset?"</strong>
        </p>
        <p className={styles.callout}>
          <strong>30 minutes wasted</strong> going back and forth. Then Rafael generates code. You deploy. Tests fail. Client complains: "Wait, I wanted social login."
        </p>
        <p>
          <strong>This is what bad documentation costs:</strong> rework, client frustration, wasted AI tokens, delayed delivery.
        </p>
        <p>
          <strong>Good documentation prevents this.</strong> Rafael generates correct code first time. Sofia verifies against clear criteria. Client knows exactly what they're getting. Everyone saves hours.
        </p>
      </section>

      {/* The Problem */}
      <section className={styles.problem}>
        <h2>The Problem: Ambiguity Kills Speed</h2>

        <div className={styles.problemExample}>
          <h3>❌ Bad Documentation (What Most Teams Write)</h3>
          <pre className={styles.codeBlock}>{badExample}</pre>

          <div className={styles.problemList}>
            <h4>What's Wrong?</h4>
            <ul>
              <li><strong>No context:</strong> Why authentication? What problem does it solve?</li>
              <li><strong>No specifics:</strong> Email? OAuth? Magic links? Password?</li>
              <li><strong>No verification:</strong> How do we know it works?</li>
              <li><strong>No implementation guidance:</strong> What tech stack? What architecture?</li>
              <li><strong>No deployment steps:</strong> How does Kara deploy this?</li>
            </ul>
          </div>

          <div className={styles.costBox}>
            <h4>💰 Real Cost</h4>
            <ul>
              <li><strong>3-5 back-and-forth messages</strong> clarifying requirements (30-60 min)</li>
              <li><strong>Rafael generates wrong code</strong> (wastes tokens + 20 min rework)</li>
              <li><strong>Tests fail</strong> because no clear criteria (40 min debugging)</li>
              <li><strong>Client unhappy</strong> with deliverable (2 hours rework + reputation damage)</li>
            </ul>
            <p className={styles.totalCost}>
              <strong>Total waste: 4+ hours per feature</strong>
            </p>
          </div>
        </div>

        <div className={styles.solutionTeaser}>
          <h3>✅ Good Documentation Solves This</h3>
          <p>
            By using <strong>6 levels of refinement</strong> (PATTERN → BEHAVIOR_SPEC → VALIDATION → MECHANISM → ALGORITHM → GUIDE), we eliminate ambiguity at every stage.
          </p>
          <p>
            <strong>Result:</strong> Rafael generates correct code first time. Sofia knows exactly what to verify. Kara deploys with confidence. Client gets what they expected.
          </p>
        </div>
      </section>

      {/* The 6 Levels */}
      <section className={styles.levels}>
        <h2>The 6 Levels (PATTERN→GUIDE)</h2>

        <p className={styles.intro}>
          Each level serves a specific purpose and audience. <strong>Skip a level = introduce ambiguity.</strong>
        </p>

        <div className={styles.levelsContainer}>
          {levels.map((level, index) => (
            <div key={level.number} className={styles.levelCard}>
              <div
                className={styles.levelHeader}
                onClick={() => toggleLevel(index)}
              >
                <div className={styles.levelTitle}>
                  <span className={styles.levelNumber}>{level.emoji}</span>
                  <h3>{level.number}. {level.name}</h3>
                </div>
                <button className={styles.expandButton}>
                  {expandedLevel === index ? '−' : '+'}
                </button>
              </div>

              <div className={styles.levelSummary}>
                <p><strong>Purpose:</strong> {level.purpose}</p>
                <p><strong>Audience:</strong> {level.audience}</p>
              </div>

              {expandedLevel === index && (
                <div className={styles.levelDetails}>
                  <h4>Example</h4>
                  <div className={styles.exampleBox}>
                    <code>{level.example}</code>
                  </div>

                  <h4>When to Write</h4>
                  {level.number === 1 && (
                    <p>Reanance writes this FIRST during client onboarding. Sets the foundation for all decisions.</p>
                  )}
                  {level.number === 2 && (
                    <p>Reanance writes this collaboratively with client. Gets client sign-off BEFORE implementation starts.</p>
                  )}
                  {level.number === 3 && (
                    <p>Inna writes this for Sofia/Bigbosexf. Defines "done" with testable criteria.</p>
                  )}
                  {level.number === 4 && (
                    <p>Inna writes this for Kara/Rafael. Architecture decisions that guide implementation.</p>
                  )}
                  {level.number === 5 && (
                    <p>Inna writes this for Rafael. Detailed enough that Rafael can generate complete, correct code.</p>
                  )}
                  {level.number === 6 && (
                    <p>Inna writes this for Kara and client. Step-by-step deployment and usage instructions.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.insight}>
          <h3>💡 Key Insight</h3>
          <p>
            <strong>Each level refines the previous one.</strong> You can't write ALGORITHM without MECHANISM. You can't write VALIDATION without BEHAVIOR_SPEC.
          </p>
          <p>
            This hierarchy <strong>forces clarity</strong> and prevents gaps.
          </p>
        </div>
      </section>

      {/* Complete Example */}
      <section className={styles.completeExample} id="examples">
        <h2>Complete Example: User Authentication</h2>

        <div className={styles.exampleToggle}>
          <button
            className={`${styles.toggleButton} ${selectedExample === 'bad' ? styles.active : ''}`}
            onClick={() => setSelectedExample('bad')}
          >
            ❌ Bad (4 lines)
          </button>
          <button
            className={`${styles.toggleButton} ${selectedExample === 'good' ? styles.active : ''}`}
            onClick={() => setSelectedExample('good')}
          >
            ✅ Good (200+ lines)
          </button>
        </div>

        <div className={styles.exampleContent}>
          {selectedExample === 'bad' ? (
            <div className={styles.badExampleContent}>
              <pre className={styles.codeBlock}>{badExample}</pre>
              <div className={styles.consequences}>
                <h4>Consequences:</h4>
                <ul>
                  <li>Rafael asks 10 clarifying questions</li>
                  <li>Generates OAuth code, but client wanted email</li>
                  <li>No tests = Sofia can't verify</li>
                  <li>Kara doesn't know how to deploy</li>
                  <li>Client rejects deliverable</li>
                </ul>
                <p className={styles.wastedTime}><strong>⏱️ 4+ hours wasted</strong></p>
              </div>
            </div>
          ) : (
            <div className={styles.goodExampleContent}>
              <pre className={styles.codeBlockLarge}>{goodExample}</pre>
              <div className={styles.benefits}>
                <h4>Benefits:</h4>
                <ul>
                  <li>✅ Rafael generates correct code first time (no questions)</li>
                  <li>✅ Sofia runs acceptance tests (all pass)</li>
                  <li>✅ Kara follows deployment guide (15 min to production)</li>
                  <li>✅ Client sees demo matching exact spec (immediate approval)</li>
                </ul>
                <p className={styles.timeSaved}><strong>⏱️ 4+ hours saved</strong></p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sideBySide}>
          <div className={styles.comparison}>
            <h3>Time Comparison</h3>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Bad Docs</th>
                  <th>Good Docs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Clarification</td>
                  <td>60 min</td>
                  <td className={styles.good}>0 min</td>
                </tr>
                <tr>
                  <td>Code generation</td>
                  <td>40 min (2 attempts)</td>
                  <td className={styles.good}>10 min (first try)</td>
                </tr>
                <tr>
                  <td>Testing</td>
                  <td>60 min (no criteria)</td>
                  <td className={styles.good}>20 min (clear tests)</td>
                </tr>
                <tr>
                  <td>Deployment</td>
                  <td>45 min (trial/error)</td>
                  <td className={styles.good}>15 min (step-by-step)</td>
                </tr>
                <tr>
                  <td>Rework</td>
                  <td>120 min (client unhappy)</td>
                  <td className={styles.good}>0 min</td>
                </tr>
                <tr className={styles.totalRow}>
                  <td><strong>TOTAL</strong></td>
                  <td className={styles.bad}><strong>5h 25min</strong></td>
                  <td className={styles.good}><strong>45min</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to Write Each Level */}
      <section className={styles.howTo}>
        <h2>How to Write Each Level</h2>

        <div className={styles.howToGrid}>
          <div className={styles.howToCard}>
            <h3>🎯 1. PATTERN</h3>
            <h4>Questions to Answer:</h4>
            <ul>
              <li>Why does this feature exist?</li>
              <li>What problem does it solve?</li>
              <li>What are the key principles?</li>
              <li>What's our stance vs alternatives?</li>
            </ul>
            <div className={styles.template}>
              <h4>Template:</h4>
              <pre>{`**Core principle:** [Why this matters]

**Key decisions:**
- [Decision 1 with rationale]
- [Decision 2 with rationale]
- [Decision 3 with rationale]`}</pre>
            </div>
          </div>

          <div className={styles.howToCard}>
            <h3>📋 2. BEHAVIOR_SPEC</h3>
            <h4>Questions to Answer:</h4>
            <ul>
              <li>What can the user do?</li>
              <li>What are the happy paths?</li>
              <li>What are the error cases?</li>
              <li>What are performance targets?</li>
              <li>How do we verify it works?</li>
            </ul>
            <div className={styles.template}>
              <h4>Template:</h4>
              <pre>{`### Functional Criteria
1. **[Flow Name]**
   - User does X
   - System does Y
   - User sees Z

### Non-Functional Criteria
- Performance: p95 < Xms
- Quality: [Lighthouse/accessibility scores]

### Verification
\`\`\`bash
npm run test:e2e
\`\`\``}</pre>
            </div>
          </div>

          <div className={styles.howToCard}>
            <h3>✅ 3. VALIDATION</h3>
            <h4>Questions to Answer:</h4>
            <ul>
              <li>What are the acceptance tests?</li>
              <li>What are the performance thresholds?</li>
              <li>What are the quality gates?</li>
              <li>How does Sofia verify?</li>
            </ul>
            <div className={styles.template}>
              <h4>Template:</h4>
              <pre>{`### Acceptance Tests
\`\`\`typescript
test('user can [action]', async ({ page }) => {
  // Given: [initial state]
  // When: [user action]
  // Then: [expected outcome]
});
\`\`\`

### Performance Thresholds
- API: p50 < Xms, p95 < Yms
- Page load: p95 < Zms

### Quality Gates
- ✅ All tests pass
- ✅ No console errors
- ✅ Lighthouse ≥90`}</pre>
            </div>
          </div>

          <div className={styles.howToCard}>
            <h3>🏗️ 4. MECHANISM</h3>
            <h4>Questions to Answer:</h4>
            <ul>
              <li>What's the architecture?</li>
              <li>What tech stack?</li>
              <li>What's the data flow?</li>
              <li>Why these choices?</li>
            </ul>
            <div className={styles.template}>
              <h4>Template:</h4>
              <pre>{`### Architecture
**Frontend:** [Framework + key libraries]
**Backend:** [Service + key libraries]
**Database:** [Choice with rationale]

### Data Flow
1. User action → [step 1]
2. System → [step 2]
3. ...

### Tech Stack Rationale
- **[Choice]:** [Why this vs alternatives]`}</pre>
            </div>
          </div>

          <div className={styles.howToCard}>
            <h3>⚙️ 5. ALGORITHM</h3>
            <h4>Questions to Answer:</h4>
            <ul>
              <li>What's the exact code flow?</li>
              <li>What functions are needed?</li>
              <li>What are the edge cases?</li>
              <li>What are the error paths?</li>
            </ul>
            <div className={styles.template}>
              <h4>Template:</h4>
              <pre>{`### [Function Name] (Code-Level)
\`\`\`typescript
export async function doThing(input: string) {
  // 1. Validate
  if (!isValid(input)) {
    return { error: 'Invalid' };
  }

  // 2. Process
  const result = await process(input);

  // 3. Store
  await db.save(result);

  // 4. Return
  return { success: true, result };
}
\`\`\``}</pre>
            </div>
          </div>

          <div className={styles.howToCard}>
            <h3>📖 6. GUIDE</h3>
            <h4>Questions to Answer:</h4>
            <ul>
              <li>How does Kara deploy this?</li>
              <li>What environment variables?</li>
              <li>What are common issues?</li>
              <li>How to test manually?</li>
            </ul>
            <div className={styles.template}>
              <h4>Template:</h4>
              <pre>{`### How to Adopt
**1. Environment Setup**
\`\`\`bash
# .env.local
VAR_NAME="value"
\`\`\`

**2. Install Dependencies**
\`\`\`bash
npm install [packages]
\`\`\`

**3. Deploy**
\`\`\`bash
vercel --prod
\`\`\`

### Common Issues
**[Issue]:** [Solution]`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className={styles.quiz} id="quiz">
        <h2>Quiz: Test Your Understanding</h2>

        <div className={styles.quizQuestion}>
          <h4>Scenario 1: You're Reanance. Client says "I want users to be able to leave reviews." What do you write first?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(1)}
          >
            {quizAnswers[1] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[1] && (
            <div className={styles.quizAnswer}>
              <p><strong>Correct: Start with PATTERN</strong></p>
              <p>Before diving into "how," understand "why":</p>
              <ul>
                <li>Why reviews? (Build trust? Filter quality?)</li>
                <li>Who can review? (Any user? Verified purchases only?)</li>
                <li>What's moderated? (Spam? Profanity?)</li>
                <li>What's the key principle? (Authentic feedback vs spam prevention)</li>
              </ul>
              <p><strong>THEN</strong> move to BEHAVIOR_SPEC (what can users do).</p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 2: You're Inna writing docs. You've written PATTERN and BEHAVIOR_SPEC. Rafael says "I don't know how to implement the search feature." What's missing?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(2)}
          >
            {quizAnswers[2] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[2] && (
            <div className={styles.quizAnswer}>
              <p><strong>Missing: MECHANISM + ALGORITHM</strong></p>
              <ul>
                <li><strong>MECHANISM:</strong> What's the architecture? (PostgreSQL full-text search? Algolia? ElasticSearch?)</li>
                <li><strong>ALGORITHM:</strong> What's the exact code flow? (Query → sanitize → search → rank → return)</li>
              </ul>
              <p>Rafael needs these two levels to generate correct code.</p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 3: You're Sofia testing a feature. The docs say "Users can filter products." How do you know what to test?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(3)}
          >
            {quizAnswers[3] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[3] && (
            <div className={styles.quizAnswer}>
              <p><strong>You need: BEHAVIOR_SPEC + VALIDATION</strong></p>
              <ul>
                <li><strong>BEHAVIOR_SPEC:</strong> What filters exist? (Price, category, rating?) What happens when you select them?</li>
                <li><strong>VALIDATION:</strong> What are the acceptance tests? What's the expected behavior?</li>
              </ul>
              <p>Without these, you're guessing what "filter products" means.</p>
            </div>
          )}
        </div>

        <div className={styles.quizQuestion}>
          <h4>Scenario 4: You're Kara. You've got Rafael's code. You want to deploy. Where do you look?</h4>
          <button
            className={styles.quizButton}
            onClick={() => toggleQuizAnswer(4)}
          >
            {quizAnswers[4] ? 'Hide Answer' : 'Show Answer'}
          </button>
          {quizAnswers[4] && (
            <div className={styles.quizAnswer}>
              <p><strong>Look at: GUIDE</strong></p>
              <p>GUIDE contains:</p>
              <ul>
                <li>Environment variables to set</li>
                <li>Dependencies to install</li>
                <li>Deploy commands</li>
                <li>Common issues + solutions</li>
                <li>How to test manually</li>
              </ul>
              <p>If GUIDE is missing, you're guessing how to deploy.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Reference */}
      <section className={styles.quickRef} id="quick-ref">
        <h2>6-Level Checklist (Print & Keep)</h2>

        <div className={styles.checklistCard}>
          <h3>Before You Say "Spec is Done"</h3>

          <div className={styles.checklistSection}>
            <h4>□ 1. PATTERN (Context)</h4>
            <ul>
              <li>□ Why does this feature exist?</li>
              <li>□ What problem does it solve?</li>
              <li>□ What are the key principles?</li>
              <li>□ What's our stance vs alternatives?</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ 2. BEHAVIOR_SPEC (What Success Looks Like)</h4>
            <ul>
              <li>□ What can the user do? (Functional criteria)</li>
              <li>□ What are performance targets? (Non-functional)</li>
              <li>□ How do we verify? (Test commands)</li>
              <li>□ Client sign-off?</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ 3. VALIDATION (How We Verify)</h4>
            <ul>
              <li>□ Acceptance tests written?</li>
              <li>□ Performance thresholds defined?</li>
              <li>□ Quality gates listed?</li>
              <li>□ Sofia can verify independently?</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ 4. MECHANISM (Implementation Approach)</h4>
            <ul>
              <li>□ Architecture diagram/description?</li>
              <li>□ Tech stack chosen with rationale?</li>
              <li>□ Data flow documented?</li>
              <li>□ Rafael understands the structure?</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ 5. ALGORITHM (Code-Level Steps)</h4>
            <ul>
              <li>□ Exact code flow documented?</li>
              <li>□ Functions/methods listed?</li>
              <li>□ Edge cases covered?</li>
              <li>□ Rafael can generate code without questions?</li>
            </ul>
          </div>

          <div className={styles.checklistSection}>
            <h4>□ 6. GUIDE (How to Adopt)</h4>
            <ul>
              <li>□ Environment setup documented?</li>
              <li>□ Deploy steps clear?</li>
              <li>□ Common issues + solutions listed?</li>
              <li>□ Kara can deploy without asking questions?</li>
            </ul>
          </div>
        </div>

        <div className={styles.completionRule}>
          <h3>Completion Rule</h3>
          <p><strong>ALL 6 levels must be complete before handoff to Rafael.</strong></p>
          <p>Skip one = introduce ambiguity = waste hours.</p>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className={styles.mistakes}>
        <h2>Common Mistakes (And How to Fix)</h2>

        <div className={styles.mistakesGrid}>
          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: Skipping PATTERN</h3>
            <p><strong>Symptom:</strong> Implementation works but client says "This isn't what I wanted."</p>
            <p><strong>Why it happens:</strong> You jumped to "how" without understanding "why."</p>
            <p><strong>Fix:</strong> Always start with PATTERN. Ask: Why does this feature exist? What problem does it solve?</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: Vague BEHAVIOR_SPEC</h3>
            <p><strong>Symptom:</strong> Sofia says "I don't know what to test." Rafael asks 10 clarifying questions.</p>
            <p><strong>Why it happens:</strong> BEHAVIOR_SPEC says "User can filter" but not WHAT filters or WHAT happens.</p>
            <p><strong>Fix:</strong> Be specific. List exact user actions and system responses. Include non-functional criteria (performance, quality).</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: No VALIDATION</h3>
            <p><strong>Symptom:</strong> Sofia manually tests but misses bugs. No clear "done" criteria.</p>
            <p><strong>Why it happens:</strong> No acceptance tests written. No performance thresholds defined.</p>
            <p><strong>Fix:</strong> Write executable tests. Define thresholds (p95 < 200ms). List quality gates.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: Missing MECHANISM</h3>
            <p><strong>Symptom:</strong> Rafael generates code but it's the wrong architecture. Kara says "This won't scale."</p>
            <p><strong>Why it happens:</strong> No architecture guidance. Rafael guesses.</p>
            <p><strong>Fix:</strong> Document architecture, tech stack, and data flow BEFORE Rafael generates code.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: Vague ALGORITHM</h3>
            <p><strong>Symptom:</strong> Rafael's code is incomplete or has logic errors. Kara finds bugs during testing.</p>
            <p><strong>Why it happens:</strong> ALGORITHM says "validate input" but not HOW to validate or WHAT validations.</p>
            <p><strong>Fix:</strong> Write code-level pseudocode. Be explicit about every step, validation, and error case.</p>
          </div>

          <div className={styles.mistakeCard}>
            <h3>❌ Mistake: No GUIDE</h3>
            <p><strong>Symptom:</strong> Kara can't deploy. Client can't use the feature. Common issues not documented.</p>
            <p><strong>Why it happens:</strong> Documentation ends at code generation. No deployment or usage docs.</p>
            <p><strong>Fix:</strong> Write step-by-step deployment guide. Document common issues. Include manual testing steps.</p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className={styles.nextSteps}>
        <h2>Next Steps</h2>
        <p>Now you understand <strong>what good documentation looks like</strong>. Related articles:</p>
        <ol>
          <li><Link href="/resources/complete-mission-flow"><strong>The Complete Mission Flow</strong></Link> - WHO writes documentation WHEN</li>
          <li><Link href="/resources/how-to-talk-to-ai-citizens"><strong>How to Talk to AI Citizens</strong></Link> - Get better output from Rafael/Inna</li>
          <li><strong>Testing Mindset: AC Green or It Didn't Happen</strong> - How Sofia verifies your work</li>
        </ol>
        <p><strong>Practice:</strong> Take a simple feature (e.g., "contact form") and write all 6 levels. Share in Telegram for feedback.</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>This article is part of ScopeLock Team Onboarding.</p>
        <p>Questions? Ask in Telegram <a href="https://t.me/nlr_ai">@nlr_ai</a> or ask Inna (AI) directly.</p>
      </footer>
    </main>
  );
}
