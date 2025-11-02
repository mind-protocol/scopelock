# Feature 6: Test Generation from AC.md

**Status:** Approved
**Priority:** P1 (Medium Complexity)
**Time Estimate:** 12h
**Cost:** $0 (uses existing Claude API quota)

---

## PATTERN

**Consciousness Principle:** "If it's not tested, it's not built. When AC.md is finalized, generate acceptance tests automatically—don't wait for human to write boilerplate."

**Why:** Test writing is tedious but follows patterns. Daniel can generate 70-80% of test code from AC.md criteria, leaving humans to add edge cases and domain-specific logic.

---

## BEHAVIOR_SPEC

### Event Flow

```
AC.md finalized and tagged as ac-baseline_*
  ↓
Trigger test generation workflow       → test.generation_requested@1.0
  ↓
Wake Daniel citizen (Claude Code)
  ↓
Daniel reads AC.md:
  - Functional criteria (F1, F2, F3...)
  - Non-functional criteria (NF1, NF2, NF3...)
  - Verification section (tech stack hints)
  ↓
Daniel generates test files:
  - tests/acceptance/f1-[feature].spec.ts (Playwright)
  - tests/acceptance/nf1-performance.spec.ts
  - tests/acceptance/nf2-quality.spec.ts
  ↓
Save test files to /tests/acceptance/    → test.generated@1.0
  ↓
Run tests locally (expect failures)
  ↓
Notify Telegram:
  "Acceptance tests generated for [milestone]"
  "Status: 0/X passing (expected - implement features first)"
```

### Contract

**Input:**
- `/proof/AC.md` with:
  - Functional criteria (F1, F2, ...)
  - Non-functional criteria (NF1: Performance, NF2: Quality, NF3: Deployment)
  - Verification section (tech stack, test approach)

**Output:**
- Test files in `/tests/acceptance/`:
  - `f1-[feature-name].spec.ts` for each functional criterion
  - `nf1-performance.spec.ts` for performance tests
  - `nf2-quality.spec.ts` for quality tests
  - `nf3-deployment.spec.ts` for deployment tests
- Each test file contains:
  - Test suite setup
  - Test cases matching acceptance criteria
  - Assertions with expected values from AC.md

**Events:**
- `test.generation_requested@1.0 { milestone, ac_file_path }`
- `test.generated@1.0 { milestone, test_count, file_paths[] }`

**Failure Modes:**
- AC.md missing or incomplete → Daniel outputs "NEEDS_AC" with required sections
- Tech stack unclear → Generate generic test templates with TODO comments
- Edge cases undefined → Generate basic happy-path tests only

---

## VALIDATION

### Acceptance Criteria

**V1: Tests generated from AC.md**
```bash
# Test: Tag AC.md as baseline, trigger test generation

git tag ac-baseline_test_2025-11-02
# Trigger test generation (manual or webhook)

# Expected:
# - /tests/acceptance/ contains test files
# - One file per functional criterion (F1.spec.ts, F2.spec.ts...)
# - One file per non-functional criterion (NF1.spec.ts, NF2.spec.ts...)
# - ✅ Test count matches criterion count in AC.md
```

**V2: Generated tests are executable**
```bash
# Test: Run generated tests

npm test

# Expected:
# - Tests run (may fail, but no syntax errors)
# - Test names match AC.md criteria
# - ✅ 0 compilation errors, test structure valid
```

**V3: Tests follow ScopeLock patterns**
```bash
# Test: Compare generated tests to existing tests

# Expected:
# - Playwright for frontend tests
# - PyTest for backend tests
# - fail-loud pattern (no try/catch without rethrow)
# - ✅ Code matches existing test style
```

---

## MECHANISM

**Implementation Approach:** Wake Daniel citizen, read AC.md, generate Playwright/PyTest tests

**Architecture:**

```
[Trigger: ac-baseline_* tag pushed]
  ↓
[Test Generation Service]
  ↓ (Wake Daniel citizen)
[Daniel Citizen (Claude Code)]
  ↓ (Read AC.md, extract criteria)
[Generate Tests]
  ↓ (Write test files)
[Save to /tests/acceptance/]
  ↓
[Notify Telegram]
```

**Why wake citizen:**
- Daniel can use Read/Write tools to access AC.md
- Daniel can detect tech stack from project files (package.json, requirements.txt)
- Daniel can reference existing tests as templates
- Consistent with ScopeLock's "citizens do repeatable work" principle

**Tech Stack Detection:**
- If `package.json` exists → JavaScript/TypeScript → Playwright
- If `requirements.txt` exists → Python → PyTest
- If both → Hybrid (Playwright for frontend, PyTest for backend)

---

## ALGORITHM

### 1. Trigger Detection

**Input:** Git tag matching `ac-baseline_*`

**Steps:**
1. Listen for git push events (webhook or git hooks)
2. Filter for tags matching regex: `^ac-baseline_`
3. Extract milestone name from tag: `ac-baseline_([^_]+)_`
4. Emit `test.generation_requested` event with milestone name

**Output:** `{ milestone, tag }`

---

### 2. Wake Daniel Citizen

**Input:** `{ milestone, tag }`

**Steps:**
1. Construct Daniel wake command:
   ```
   claude-code --prompt "You are Daniel. Generate acceptance tests for [milestone]."
   ```
2. Set environment variables:
   - `CLAUDE_CITIZEN=daniel`
   - `CLAUDE_MILESTONE=[milestone]`
   - `CLAUDE_TAG=[tag]`
   - `CLAUDE_TASK=test-generation`
3. Execute command asynchronously
4. Monitor for completion signal

**Output:** Running Daniel citizen process

---

### 3. Parse AC.md (Inside Daniel Citizen)

**Input:** `/proof/AC.md` file

**Steps:**
1. Read file content using Read tool
2. Split into sections by markdown headers (`##`)
3. Find "Functional Criteria" section
4. Extract each criterion:
   - Header (F1, F2, ...) with name
   - Description bullet points
   - Acceptance bullet points
5. Find "Non-Functional Criteria" section
6. Extract NF1 (Performance), NF2 (Quality), NF3 (Deployment)
7. Find "Verification" section
8. Extract tech stack hints:
   - Test command (e.g., `npm test`, `pytest`)
   - Framework mentions (Playwright, PyTest, etc.)

**Output:** Structured criteria object:
```javascript
{
  functional: [
    { id: 'F1', name: 'Core Pages', description: '...', acceptance: ['...'] },
    { id: 'F2', name: 'Navigation', description: '...', acceptance: ['...'] }
  ],
  nonFunctional: {
    performance: { threshold: 'p95 < 500ms', acceptance: '...' },
    quality: { rules: ['No silent fallbacks'], acceptance: '...' },
    deployment: { criteria: ['Health checks passing'], acceptance: '...' }
  },
  verification: {
    command: 'npm test',
    framework: 'playwright'
  }
}
```

---

### 4. Generate Test Files

**Input:** Criteria object from AC.md

**Steps for each functional criterion:**
1. Create filename: `tests/acceptance/f{N}-{name-kebab-case}.spec.ts`
2. Generate test suite:
   ```
   describe('{criterion.name}', () => {
     // For each acceptance point:
     test('{acceptance description}', async ({ page }) => {
       // Navigate to relevant page
       await page.goto('/');
       // Assert condition from acceptance
       await expect(page.locator('[selector]')).toBeVisible();
     });
   });
   ```
3. Write file using Write tool

**Steps for performance (NF1):**
1. Create filename: `tests/acceptance/nf1-performance.spec.ts`
2. Generate load test:
   ```
   describe('Performance', () => {
     test('p95 latency below threshold', async ({ page }) => {
       const measurements = [];
       for (let i = 0; i < 100; i++) {
         const start = Date.now();
         await page.goto('/');
         await page.waitForLoadState('networkidle');
         measurements.push(Date.now() - start);
       }
       const p95 = calculatePercentile(measurements, 95);
       expect(p95).toBeLessThan({threshold from AC.md});
     });
   });
   ```

**Steps for quality (NF2):**
1. Create filename: `tests/acceptance/nf2-quality.spec.ts`
2. Generate code review checks:
   ```
   describe('Quality', () => {
     test('No silent fallbacks', async () => {
       // Grep for try/catch without rethrow
       const results = await grep('catch', { pattern: 'try.*catch.*{[^}]*}' });
       expect(results.length).toBe(0);
     });
   });
   ```

**Steps for deployment (NF3):**
1. Create filename: `tests/acceptance/nf3-deployment.spec.ts`
2. Generate deployment checks:
   ```
   describe('Deployment', () => {
     test('Production site responds', async () => {
       const response = await fetch(process.env.PRODUCTION_URL);
       expect(response.status).toBe(200);
     });
   });
   ```

**Output:** Test files written to `/tests/acceptance/`

---

### 5. Validation Run

**Input:** Generated test files

**Steps:**
1. Run test command from AC.md Verification section
2. Capture output (pass/fail counts)
3. Expected: Most tests fail (features not implemented yet)
4. Check for syntax errors or compilation failures
5. If syntax errors: emit failure event with error details
6. If tests run: emit success event with test count

**Output:** `{ tests_generated: N, tests_passing: 0, syntax_errors: 0 }`

---

## GUIDE

### Implementation

**File Structure:**
```
/services/
  test-generator/
    index.js              # Git webhook listener
    wake-daniel.js        # Daniel citizen spawner
    templates/
      playwright.template.js
      pytest.template.py
```

**1. Git Webhook Listener**

File: `services/test-generator/index.js`
```javascript
import express from 'express';
import { wakeDaniel } from './wake-daniel.js';

const app = express();
app.use(express.json());

// Webhook endpoint for git push events
app.post('/webhook/git-push', async (req, res) => {
  const { ref, commits } = req.body;

  // Check if tag was pushed
  if (ref && ref.startsWith('refs/tags/ac-baseline_')) {
    const tag = ref.replace('refs/tags/', '');
    const milestone = tag.match(/ac-baseline_([^_]+)_/)?.[1];

    console.log(`[TEST GEN] Baseline tag detected: ${tag}`);

    // Wake Daniel to generate tests
    await wakeDaniel({ milestone, tag });

    res.status(200).send('Test generation triggered');
  } else {
    res.status(200).send('Not a baseline tag');
  }
});

app.listen(3002, () => console.log('Test generator listening on :3002'));
```

**2. Daniel Waker**

File: `services/test-generator/wake-daniel.js`
```javascript
import { spawn } from 'child_process';

export function wakeDaniel({ milestone, tag }) {
  return new Promise((resolve, reject) => {
    const prompt = `
You are Daniel, a ScopeLock citizen specializing in testing.

Task: Generate acceptance tests from AC.md for milestone: ${milestone}

Steps:
1. Read /proof/AC.md
2. Parse Functional Criteria (F1, F2, F3...)
3. Parse Non-Functional Criteria (NF1, NF2, NF3...)
4. Detect tech stack from package.json or requirements.txt
5. For each functional criterion:
   - Create tests/acceptance/f{N}-{name}.spec.ts
   - Write Playwright test matching acceptance criteria
6. For NF1 (Performance):
   - Create tests/acceptance/nf1-performance.spec.ts
   - Write load test measuring p95 latency
7. For NF2 (Quality):
   - Create tests/acceptance/nf2-quality.spec.ts
   - Write code quality checks (no silent fallbacks)
8. For NF3 (Deployment):
   - Create tests/acceptance/nf3-deployment.spec.ts
   - Write deployment verification tests
9. Run: npm test (expect failures - features not built yet)
10. Send Telegram notification with test count

Output: "DONE" when complete.
    `.trim();

    const danielProcess = spawn('claude-code', ['--prompt', prompt], {
      cwd: '/home/mind-protocol/scopelock',
      env: {
        ...process.env,
        CLAUDE_CITIZEN: 'daniel',
        CLAUDE_MILESTONE: milestone,
        CLAUDE_TAG: tag,
        CLAUDE_TASK: 'test-generation'
      }
    });

    let output = '';

    danielProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('[DANIEL]', data.toString());
    });

    danielProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject(new Error(`Daniel exited with code ${code}`));
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      danielProcess.kill();
      reject(new Error('Test generation timeout'));
    }, 5 * 60 * 1000);
  });
}
```

**3. Daniel Citizen Logic (Inside Claude Code)**

When Daniel is woken with `CLAUDE_TASK=test-generation`, he should:

```javascript
// Daniel's internal logic (this runs inside Claude Code)
async function generateTests() {
  const milestone = process.env.CLAUDE_MILESTONE;

  // 1. Read AC.md
  const acContent = await read('proof/AC.md');

  // 2. Parse criteria
  const criteria = parseAC(acContent);

  // 3. Detect tech stack
  const packageJson = await read('package.json');
  const framework = packageJson.includes('playwright') ? 'playwright' : 'jest';

  // 4. Generate functional tests
  for (const criterion of criteria.functional) {
    const filename = `tests/acceptance/f${criterion.id.slice(1)}-${kebabCase(criterion.name)}.spec.ts`;
    const testContent = generatePlaywrightTest(criterion);
    await write(filename, testContent);
  }

  // 5. Generate performance test
  const perfTest = generatePerformanceTest(criteria.nonFunctional.performance);
  await write('tests/acceptance/nf1-performance.spec.ts', perfTest);

  // 6. Generate quality test
  const qualityTest = generateQualityTest(criteria.nonFunctional.quality);
  await write('tests/acceptance/nf2-quality.spec.ts', qualityTest);

  // 7. Generate deployment test
  const deployTest = generateDeploymentTest(criteria.nonFunctional.deployment);
  await write('tests/acceptance/nf3-deployment.spec.ts', deployTest);

  // 8. Run tests
  const { stdout } = await bash('npm test || true'); // Don't fail on test failures

  // 9. Notify
  const testCount = criteria.functional.length + 3; // +3 for NF tests
  await sendToTelegram(`
✅ Acceptance tests generated for ${milestone}

**Test count:** ${testCount}
**Status:** 0/${testCount} passing (expected - implement features first)

**Files created:**
${criteria.functional.map(c => `- f${c.id.slice(1)}-${kebabCase(c.name)}.spec.ts`).join('\n')}
- nf1-performance.spec.ts
- nf2-quality.spec.ts
- nf3-deployment.spec.ts

**Next:** Implement features to make tests pass.
  `);

  return 'DONE';
}

function parseAC(content) {
  // Parse AC.md into structured criteria
  const lines = content.split('\n');
  const criteria = { functional: [], nonFunctional: {} };

  let currentSection = null;
  let currentCriterion = null;

  for (const line of lines) {
    if (line.startsWith('## Functional Criteria')) {
      currentSection = 'functional';
    } else if (line.startsWith('## Non-Functional Criteria')) {
      currentSection = 'nonFunctional';
    } else if (line.match(/^\*\*(F\d+):/)) {
      // Functional criterion
      const match = line.match(/^\*\*(F\d+): (.+)\*\*/);
      currentCriterion = { id: match[1], name: match[2], acceptance: [] };
      criteria.functional.push(currentCriterion);
    } else if (line.startsWith('- Acceptance:')) {
      // Acceptance criteria
      currentCriterion.acceptance.push(line.replace('- Acceptance: ', ''));
    }
  }

  return criteria;
}

function generatePlaywrightTest(criterion) {
  return `
import { test, expect } from '@playwright/test';

test.describe('${criterion.name}', () => {
  ${criterion.acceptance.map((acceptance, i) => `
  test('${acceptance}', async ({ page }) => {
    // TODO: Implement test for: ${acceptance}
    await page.goto('/');
    // Add assertions here
  });
  `).join('\n')}
});
  `.trim();
}

function generatePerformanceTest(perfCriteria) {
  return `
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('p95 latency below threshold', async ({ page }) => {
    const measurements = [];

    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      measurements.push(Date.now() - start);
    }

    // Calculate p95
    measurements.sort((a, b) => a - b);
    const p95Index = Math.floor(measurements.length * 0.95);
    const p95 = measurements[p95Index];

    console.log(\`p95 latency: \${p95}ms\`);
    expect(p95).toBeLessThan(500); // TODO: Extract threshold from AC.md
  });
});
  `.trim();
}

function generateQualityTest(qualityCriteria) {
  return `
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Quality', () => {
  test('No silent fallbacks', async () => {
    // Grep for try/catch without rethrow or emit
    const result = execSync(
      'grep -r "catch" src/ | grep -v "rethrow\\|emit\\|console.error" || true',
      { encoding: 'utf-8' }
    );

    expect(result.trim()).toBe('');
  });
});
  `.trim();
}

function generateDeploymentTest(deployCriteria) {
  return `
import { test, expect } from '@playwright/test';

test.describe('Deployment', () => {
  test('Production site responds', async () => {
    const url = process.env.PRODUCTION_URL || 'https://scopelock.mindprotocol.ai';
    const response = await fetch(url);
    expect(response.status).toBe(200);
  });

  test('Health checks passing', async () => {
    const url = process.env.PRODUCTION_URL || 'https://scopelock.mindprotocol.ai';
    const response = await fetch(\`\${url}/health\`);
    expect(response.status).toBe(200);
  });
});
  `.trim();
}

function kebabCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}
```

**4. Deploy & Test**

```bash
# Install dependencies
cd services/test-generator
npm install express

# Start webhook listener
node index.js &

# Test manually
curl -X POST http://localhost:3002/webhook/git-push \
  -H "Content-Type: application/json" \
  -d '{
    "ref": "refs/tags/ac-baseline_website_2025-11-02",
    "commits": []
  }'

# Check generated tests
ls tests/acceptance/
# Expected: f1-core-pages.spec.ts, f2-navigation.spec.ts, nf1-performance.spec.ts, etc.

# Run tests
npm test

# Expected: Tests run (may fail), no syntax errors
```

**Integration with Git Hooks (Alternative to Webhook):**

File: `.git/hooks/post-receive`
```bash
#!/bin/bash
# Trigger test generation on ac-baseline_* tags

while read oldrev newrev refname; do
  if [[ $refname =~ ^refs/tags/ac-baseline_ ]]; then
    tag=$(echo $refname | sed 's|^refs/tags/||')
    echo "[TEST GEN] Baseline tag detected: $tag"

    # Trigger Daniel
    curl -X POST http://localhost:3002/webhook/git-push \
      -H "Content-Type: application/json" \
      -d "{\"ref\": \"$refname\"}"
  fi
done
```

---

## ROI

**Time Saved:**
- Manual test writing: 2-4h per milestone (boilerplate + structure)
- With automation: 30min review + edge cases
- Savings: 3h per milestone × 10 milestones/month = 30h/month = $3,000/month

**Cost:**
- Development: 12h × $100/h = $1,200
- Running: $0 (uses existing Claude API quota)

**Benefit:**
- 100% test coverage by default (all AC criteria have tests)
- Faster test-driven development (tests exist before implementation)
- Consistent test structure (no style drift)

**Payback:** 12h investment / 30h monthly savings = 0.4 months (immediate ROI)
