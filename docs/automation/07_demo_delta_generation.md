# Feature 7: DEMO.md & DELTA.md Auto-Generation

**Status:** Approved
**Priority:** P1 (Medium Complexity)
**Time Estimate:** 10h
**Cost:** $0 (uses existing Claude API quota)

---

## PATTERN

**Consciousness Principle:** "Evidence emerges from measurement, not description. When a feature is built, capture demo URL + quantified deltas automatically—don't rely on human memory."

**Why:** Manual DEMO.md/DELTA.md writing is error-prone and time-consuming. Automated generation ensures consistency, forces measurement, and eliminates "forgot to document" failures.

---

## BEHAVIOR_SPEC

### Event Flow

```
Developer tags evidence-sprint_* or ac-green_*
  ↓
Trigger demo/delta generation           → demo.generation_requested@1.0
  ↓
Wake Maya citizen (Claude Code)
  ↓
Maya captures:
  - Demo URL (from tag commit or staging environment)
  - Screenshots (Playwright automation)
  - Video recording (optional, 90s max)
  ↓
Maya generates DEMO.md:
  - URL to live demo
  - 3-5 bullet points (what changed)
  - Screenshots or video embed
  ↓
Maya generates DELTA.md:
  - Quantified before/after metrics
  - Performance: p95 latency, page load time
  - User experience: steps reduced, fields removed
  - Quality: test coverage, error rate
  ↓
Save to /proof/DEMO.md and /proof/DELTA.md
  ↓
Emit demo.generated@1.0
```

### Contract

**Input:**
- Git tag: `evidence-sprint_*` or `ac-green_*`
- Staging/production URL
- Baseline commit (for DELTA comparison)

**Output:**
- `/proof/DEMO.md`:
  ```markdown
  # Demo: [Feature Name]

  **URL:** https://staging.scopelock.mindprotocol.ai

  **What changed:**
  - [Bullet 1]
  - [Bullet 2]
  - [Bullet 3]

  **Screenshots:**
  ![Before](before.png)
  ![After](after.png)
  ```

- `/proof/DELTA.md`:
  ```markdown
  # Delta: [Feature Name]

  | Metric | Before | After | Delta |
  |--------|--------|-------|-------|
  | p95 latency | 1.2s | 0.4s | -67% |
  | Steps to complete | 7 | 3 | -57% |
  | Test coverage | 80% | 100% | +20% |
  ```

**Events:**
- `demo.generation_requested@1.0 { tag, url }`
- `demo.generated@1.0 { tag, demo_file, delta_file, screenshot_count }`

**Failure Modes:**
- URL unreachable → Use placeholder with "TODO: Deploy to staging"
- No baseline for comparison → Use empty "Before" column, mark as initial implementation
- Screenshots fail → Use text-only DEMO.md

---

## VALIDATION

### Acceptance Criteria

**V1: DEMO.md generated from tag**
```bash
# Test: Tag feature, trigger generation

git tag evidence-sprint_signup_2025-11-02
# Trigger Maya

# Expected:
# - /proof/DEMO.md exists
# - Contains URL, 3+ bullet points, screenshots
# - ✅ Demo page accessible via URL
```

**V2: DELTA.md contains quantified metrics**
```bash
# Test: Check generated DELTA.md

cat proof/DELTA.md

# Expected:
# - Table with Before/After/Delta columns
# - At least 2 quantified metrics (p95, steps, coverage, etc.)
# - Percentage or absolute change calculated
# - ✅ No vague claims ("faster", "better") without numbers
```

**V3: Screenshots captured automatically**
```bash
# Test: Verify screenshots in DEMO.md

ls proof/screenshots/

# Expected:
# - before.png and after.png exist
# - Screenshots show relevant UI changes
# - ✅ Embedded in DEMO.md markdown
```

---

## MECHANISM

**Implementation Approach:** Wake Maya citizen, capture demo via Playwright, measure deltas, generate markdown

**Architecture:**

```
[Tag: evidence-sprint_* or ac-green_*]
  ↓
[Demo Generator Service]
  ↓ (Wake Maya citizen)
[Maya Citizen (Claude Code)]
  ↓ (Capture screenshots + metrics)
[Playwright Automation]
  ↓ (Generate DEMO.md + DELTA.md)
[Save to /proof/]
  ↓
[Emit demo.generated event]
```

**Why wake citizen:**
- Maya can use Bash tool to run Playwright for screenshots
- Maya can Read baseline files to compare metrics
- Maya can Write markdown files with proper structure
- Maya can calculate percentage changes

**Measurement Sources:**
- **p95 latency:** Lighthouse report or Playwright performance API
- **Steps reduced:** Count form fields or navigation clicks in test
- **Test coverage:** Parse Jest/Playwright coverage report
- **Error rate:** Grep logs for error patterns, compare before/after

---

## ALGORITHM

### 1. Trigger Detection

**Input:** Git tag matching `evidence-sprint_*` or `ac-green_*`

**Steps:**
1. Parse tag name to extract feature name
2. Find baseline tag: Search for most recent `ac-baseline_*` tag
3. Extract commit SHAs:
   - Baseline commit: `git rev-parse ac-baseline_*`
   - Current commit: `git rev-parse evidence-sprint_*`
4. Emit `demo.generation_requested` event

**Output:** `{ tag, feature_name, baseline_commit, current_commit }`

---

### 2. Wake Maya Citizen

**Input:** `{ tag, feature_name, baseline_commit, current_commit }`

**Steps:**
1. Construct Maya wake command with task: `demo-delta-generation`
2. Set environment variables with baseline + current commits
3. Execute Claude Code instance asynchronously
4. Monitor for completion

**Output:** Running Maya citizen process

---

### 3. Capture Demo (Inside Maya Citizen)

**Input:** Staging URL

**Steps:**
1. Launch Playwright browser (headless mode)
2. Navigate to staging URL
3. Wait for page load (network idle)
4. Capture full-page screenshot: `page.screenshot({ path: 'proof/screenshots/after.png', fullPage: true })`
5. Optional: Record video (90s max)
6. Close browser
7. Extract key visual changes from screenshot (highlight new UI elements)

**Output:** `after.png` screenshot file

---

### 4. Capture Baseline (For DELTA Comparison)

**Input:** Baseline commit SHA

**Steps:**
1. Checkout baseline commit: `git checkout {baseline_commit}`
2. Start baseline build: `npm run build && npm start` (in background)
3. Launch Playwright, navigate to baseline URL
4. Capture screenshot: `before.png`
5. Measure baseline metrics:
   - p95 latency (100 requests)
   - Steps to complete (count clicks in test flow)
   - Test coverage (parse coverage/coverage-summary.json)
6. Stop baseline build
7. Checkout current commit: `git checkout {current_commit}`

**Output:** `{ before_metrics, before.png }`

---

### 5. Measure Current Metrics

**Input:** Current staging URL

**Steps:**
1. Run Lighthouse performance test: `lighthouse {url} --output=json`
2. Parse JSON output:
   - `performance.metrics.interactive.percentile`: p95 latency
   - `performance.score`: Overall performance score
3. Run test flow with Playwright:
   - Count clicks/actions to complete flow
   - Measure time to complete
4. Parse test coverage report:
   - Read `coverage/coverage-summary.json`
   - Extract `total.lines.pct` (line coverage percentage)

**Output:** `{ current_metrics }`

---

### 6. Calculate Deltas

**Input:** `{ before_metrics, current_metrics }`

**Formula for percentage change:**
```
delta_pct = ((current - before) / before) × 100
delta_abs = current - before
```

**Steps:**
1. For each metric (p95, steps, coverage):
   - Calculate absolute delta: `current - before`
   - Calculate percentage delta: `((current - before) / before) × 100`
   - Format with sign: `+15%` or `-30%`
2. Create delta table rows

**Output:** Delta table data

---

### 7. Generate DEMO.md

**Input:** `{ feature_name, url, screenshots }`

**Template:**
```markdown
# Demo: {feature_name}

**URL:** {staging_url}
**Duration:** {video_duration if exists, else "Screenshots only"}

**What changed:**
- {Extract from commit messages or AC.md}
- {Highlight 2-3 key features}
- {Call out user-visible improvements}

**Screenshots:**

### Before
![Before]({screenshots/before.png})

### After
![After]({screenshots/after.png})
```

**Output:** DEMO.md file written to `/proof/`

---

### 8. Generate DELTA.md

**Input:** `{ before_metrics, current_metrics, delta_table }`

**Template:**
```markdown
# Delta: {feature_name}

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| p95 latency | {before.p95}ms | {current.p95}ms | {delta_pct}% |
| Steps to complete | {before.steps} | {current.steps} | {delta_pct}% |
| Test coverage | {before.coverage}% | {current.coverage}% | {delta_abs}% |
| Performance score | {before.score}/100 | {current.score}/100 | {delta_abs} |

**Analysis:**

{Interpretation of deltas - which metrics improved, which need attention}
```

**Output:** DELTA.md file written to `/proof/`

---

## GUIDE

### Implementation

**File Structure:**
```
/services/
  demo-delta-gen/
    index.js              # Git webhook listener
    wake-maya.js          # Maya citizen spawner
    capture-demo.js       # Playwright screenshot automation
    measure-metrics.js    # Performance + coverage measurement
```

**1. Trigger + Maya Waker**

File: `services/demo-delta-gen/index.js`
```javascript
import { spawn } from 'child_process';
import { sendToTelegram } from '../shared/telegram.js';

export async function generateDemoAndDelta(tag) {
  const featureName = tag.match(/(?:evidence-sprint|ac-green)_([^_]+)/)[1];

  // Find baseline commit
  const { execSync } = await import('child_process');
  const baselineTag = execSync('git tag --list "ac-baseline_*" | tail -1', { encoding: 'utf-8' }).trim();
  const baselineCommit = execSync(`git rev-parse ${baselineTag}`, { encoding: 'utf-8' }).trim();
  const currentCommit = execSync(`git rev-parse ${tag}`, { encoding: 'utf-8' }).trim();

  console.log(`[DEMO/DELTA] Generating for ${featureName}`);
  console.log(`  Baseline: ${baselineCommit} (${baselineTag})`);
  console.log(`  Current: ${currentCommit} (${tag})`);

  // Wake Maya
  const mayaProcess = spawn('claude-code', ['--prompt', buildMayaPrompt(featureName, baselineCommit, currentCommit)], {
    cwd: '/home/mind-protocol/scopelock',
    env: {
      ...process.env,
      CLAUDE_CITIZEN: 'maya',
      CLAUDE_FEATURE: featureName,
      CLAUDE_BASELINE_COMMIT: baselineCommit,
      CLAUDE_CURRENT_COMMIT: currentCommit,
      CLAUDE_TASK: 'demo-delta-generation'
    }
  });

  mayaProcess.stdout.on('data', (data) => console.log('[MAYA]', data.toString()));
  mayaProcess.stderr.on('data', (data) => console.error('[MAYA ERROR]', data.toString()));

  mayaProcess.on('close', (code) => {
    if (code === 0) {
      sendToTelegram(`✅ DEMO.md and DELTA.md generated for ${featureName}`);
    } else {
      sendToTelegram(`❌ Failed to generate DEMO/DELTA for ${featureName}`);
    }
  });
}

function buildMayaPrompt(featureName, baselineCommit, currentCommit) {
  return `
You are Maya, the Facet. Generate DEMO.md and DELTA.md for feature: ${featureName}

**Baseline commit:** ${baselineCommit}
**Current commit:** ${currentCommit}

Steps:
1. Capture "after" screenshot:
   - Start staging server: npm run build && npm start (port 3000)
   - Use Playwright to navigate to http://localhost:3000
   - Take full-page screenshot: proof/screenshots/after.png

2. Capture "before" screenshot + metrics:
   - Checkout baseline: git checkout ${baselineCommit}
   - Build and start: npm run build && npm start (port 3001)
   - Take screenshot: proof/screenshots/before.png
   - Measure baseline p95 latency (100 requests to http://localhost:3001)
   - Count steps in user flow
   - Parse test coverage: coverage/coverage-summary.json

3. Measure current metrics:
   - Checkout current: git checkout ${currentCommit}
   - Measure p95 latency (http://localhost:3000)
   - Count steps in user flow
   - Parse test coverage

4. Calculate deltas:
   - p95: (current - baseline) / baseline × 100
   - Steps: (current - baseline) / baseline × 100
   - Coverage: current - baseline (absolute)

5. Generate DEMO.md with:
   - URL (staging or localhost)
   - 3 key changes (from commit messages)
   - Screenshots (before/after)

6. Generate DELTA.md with:
   - Metrics table (Before | After | Delta)
   - At least 3 quantified metrics

Output: "DONE" when both files written.
  `.trim();
}
```

**2. Maya Citizen Logic (Inside Claude Code)**

```javascript
// Maya's internal logic
async function generateDemoAndDelta() {
  const feature = process.env.CLAUDE_FEATURE;
  const baselineCommit = process.env.CLAUDE_BASELINE_COMMIT;
  const currentCommit = process.env.CLAUDE_CURRENT_COMMIT;

  // 1. Start current build
  await bash('npm run build');
  await bash('npm start &', { run_in_background: true });
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for server

  // 2. Capture "after" screenshot
  const afterScreenshot = await captureScreenshot('http://localhost:3000', 'proof/screenshots/after.png');

  // 3. Measure current metrics
  const currentMetrics = await measureMetrics('http://localhost:3000');

  // 4. Checkout baseline
  await bash(`git checkout ${baselineCommit}`);
  await bash('npm run build');
  await bash('PORT=3001 npm start &', { run_in_background: true });
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 5. Capture "before" screenshot + metrics
  const beforeScreenshot = await captureScreenshot('http://localhost:3001', 'proof/screenshots/before.png');
  const beforeMetrics = await measureMetrics('http://localhost:3001');

  // 6. Checkout current commit
  await bash(`git checkout ${currentCommit}`);

  // 7. Calculate deltas
  const deltas = {
    p95: {
      before: beforeMetrics.p95,
      after: currentMetrics.p95,
      delta: ((currentMetrics.p95 - beforeMetrics.p95) / beforeMetrics.p95 * 100).toFixed(1) + '%'
    },
    steps: {
      before: beforeMetrics.steps,
      after: currentMetrics.steps,
      delta: ((currentMetrics.steps - beforeMetrics.steps) / beforeMetrics.steps * 100).toFixed(1) + '%'
    },
    coverage: {
      before: beforeMetrics.coverage,
      after: currentMetrics.coverage,
      delta: (currentMetrics.coverage - beforeMetrics.coverage).toFixed(1) + '%'
    }
  };

  // 8. Generate DEMO.md
  const demoMd = `
# Demo: ${feature}

**URL:** http://localhost:3000 (staging)

**What changed:**
- ${await extractChangesFromCommits()}

**Screenshots:**

### Before
![Before](screenshots/before.png)

### After
![After](screenshots/after.png)
  `.trim();

  await write('proof/DEMO.md', demoMd);

  // 9. Generate DELTA.md
  const deltaMd = `
# Delta: ${feature}

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| p95 latency | ${deltas.p95.before}ms | ${deltas.p95.after}ms | ${deltas.p95.delta} |
| Steps to complete | ${deltas.steps.before} | ${deltas.steps.after} | ${deltas.steps.delta} |
| Test coverage | ${deltas.coverage.before}% | ${deltas.coverage.after}% | ${deltas.coverage.delta} |

**Analysis:**

${analyzeDeltas(deltas)}
  `.trim();

  await write('proof/DELTA.md', deltaMd);

  // 10. Notify
  await sendToTelegram(`✅ DEMO.md and DELTA.md generated for ${feature}`);

  return 'DONE';
}

async function captureScreenshot(url, outputPath) {
  // Use Playwright via Bash
  const script = `
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('${url}');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '${outputPath}', fullPage: true });
  await browser.close();
})();
  `;

  await bash(`node -e "${script}"`);
}

async function measureMetrics(url) {
  // Measure p95 latency
  const latencies = [];
  for (let i = 0; i < 100; i++) {
    const start = Date.now();
    await fetch(url);
    latencies.push(Date.now() - start);
  }
  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.floor(latencies.length * 0.95)];

  // Parse coverage
  const coverageFile = await read('coverage/coverage-summary.json');
  const coverage = JSON.parse(coverageFile).total.lines.pct;

  // TODO: Count steps from test flow

  return { p95, coverage, steps: 5 }; // Placeholder
}

async function extractChangesFromCommits() {
  const commits = await bash(`git log ${process.env.CLAUDE_BASELINE_COMMIT}..${process.env.CLAUDE_CURRENT_COMMIT} --oneline`);
  return commits.split('\n').slice(0, 3).map(line => `- ${line.split(' ').slice(1).join(' ')}`).join('\n');
}

function analyzeDeltas(deltas) {
  const improvements = [];
  const regressions = [];

  for (const [metric, data] of Object.entries(deltas)) {
    const change = parseFloat(data.delta);
    if (metric === 'p95' && change < 0) improvements.push(`${metric} improved by ${Math.abs(change)}%`);
    if (metric === 'coverage' && change > 0) improvements.push(`${metric} increased by ${change}%`);
    if (metric === 'p95' && change > 0) regressions.push(`${metric} regressed by ${change}%`);
  }

  let analysis = '';
  if (improvements.length > 0) analysis += `**Improvements:** ${improvements.join(', ')}\n\n`;
  if (regressions.length > 0) analysis += `**Regressions:** ${regressions.join(', ')} (needs attention)\n\n`;

  return analysis.trim();
}
```

**3. Deploy & Test**

```bash
# Test manually
node -e "
  const { generateDemoAndDelta } = require('./services/demo-delta-gen/index.js');
  generateDemoAndDelta('evidence-sprint_signup_2025-11-02');
"

# Check outputs
cat proof/DEMO.md
cat proof/DELTA.md
ls proof/screenshots/

# Expected: DEMO.md + DELTA.md with quantified metrics
```

---

## ROI

**Time Saved:**
- Manual DEMO/DELTA writing: 1h per milestone
- With automation: 5min review
- Savings: 55min per milestone × 10 milestones/month = 9h/month = $900/month

**Cost:**
- Development: 10h × $100/h = $1,000
- Running: $0 (screenshots are cheap)

**Benefit:**
- 100% DEMO/DELTA completion (never forgotten)
- Quantified metrics enforced (no vague claims)
- Automated screenshot capture (visual proof)

**Payback:** 10h investment / 9h monthly savings = 1.1 months
