# Feature 9: Sofia Auto-Review (GitHub Webhook)

**Status:** Approved
**Priority:** P2 (Advanced)
**Time Estimate:** 10h
**Cost:** $0

---

## PATTERN

**Consciousness Principle:** "Quality gates must be instant and deterministic. When code is pushed, Sofia reviews automatically—before humans even see the PR."

**Why:** Manual code review is slow and inconsistent. Sofia's rules (R-400/R-401: fail-loud, no silent fallbacks) are automatable. Humans should review architecture and logic, not boilerplate patterns.

---

## BEHAVIOR_SPEC

### Event Flow

```
Developer pushes commit to GitHub
  ↓
GitHub webhook triggers Sofia                → review.requested@1.0
  ↓
Sofia citizen wakes (Claude Code)
  ↓
Sofia analyzes diff:
  - Check for silent fallbacks (try/catch without rethrow/emit)
  - Check for baseline mutations (AC.md changed without CR tag)
  - Check for missing tests (new features without test files)
  - Check for performance regressions (p95 > threshold)
  ↓
Sofia outputs verdict:
  - PASS: No issues found
  - SOFT_FAIL: Warnings (e.g., missing comments, long functions)
  - HARD_FAIL: Blockers (e.g., silent fallbacks, AC.md mutation)
  ↓
IF HARD_FAIL:
  Block merge (GitHub status = failure)      → review.verdict.hard_fail@1.0
  Comment on PR with specific violations
ELSE IF SOFT_FAIL:
  Allow merge but flag warnings               → review.verdict.soft_fail@1.0
  Comment on PR with suggestions
ELSE (PASS):
  Approve merge (GitHub status = success)    → review.verdict.pass@1.0
```

### Contract

**Input:**
- GitHub webhook payload: `{ commit, diff, branch, author }`
- Changed files: `{ file_path, added_lines[], removed_lines[] }`

**Output:**
- GitHub commit status:
  - `success` (PASS)
  - `failure` (HARD_FAIL)
  - `pending` (Sofia running)
- PR comment with verdict details
- Event: `review.verdict@1.0 { verdict, violations[], warnings[] }`

**Events:**
- `review.requested@1.0 { commit_sha, branch }`
- `review.verdict@1.0 { verdict: "pass"|"soft_fail"|"hard_fail", details }`

**Failure Modes:**
- Sofia timeout (>5min) → Default to PASS with warning "Review timeout, manual review required"
- Diff too large (>500 lines) → Split into chunks, review each
- GitHub API error → Retry 3 times, then fail open (allow merge with warning)

---

## VALIDATION

### Acceptance Criteria

**V1: Silent fallbacks detected**
```bash
# Test: Push commit with try/catch without rethrow

git add -A
git commit -m "test: silent fallback"
git push origin feature-branch

# Expected:
# - GitHub status = failure
# - PR comment: "HARD_FAIL: Silent fallback detected in file.ts:42"
# - Merge blocked
# - ✅ Bad pattern caught before merge
```

**V2: AC.md mutation blocked**
```bash
# Test: Push commit that changes proof/AC.md without change-req_* tag

# Expected:
# - GitHub status = failure
# - PR comment: "HARD_FAIL: AC.md mutated without Change Request tag"
# - ✅ Baseline guard enforced
```

**V3: Clean code passes**
```bash
# Test: Push commit with proper error handling + tests

# Expected:
# - GitHub status = success
# - PR comment: "PASS: No violations found"
# - Merge allowed
# - ✅ Good code auto-approved
```

---

## MECHANISM

**Implementation Approach:** GitHub webhook → Sofia citizen → Policy checks → GitHub status API

**Architecture:**

```
[GitHub Push]
  ↓ (webhook)
[Sofia Review Service]
  ↓ (Wake Sofia citizen)
[Sofia Citizen (Claude Code)]
  ↓ (Read diff, apply policies)
[Policy Checks]
  ├─ R-400/R-401: Fail-loud enforcement
  ├─ Baseline guard: AC.md mutation check
  ├─ Test coverage: New features have tests
  └─ Performance: p95 regression check
  ↓
[Verdict: PASS | SOFT_FAIL | HARD_FAIL]
  ↓
[GitHub Commit Status API]
```

**Why wake citizen:**
- Sofia can use Grep tool to search for patterns
- Sofia can Read files to check context
- Sofia can apply complex policies (not just regex)
- Sofia can emit detailed explanations (not just "failed")

**GitHub Integration:**
- Webhook: `POST /webhook/github-push` on every push
- Status API: Update commit status (pending → success/failure)
- Comment API: Post PR comment with verdict details

---

## ALGORITHM

### 1. Webhook Handler

**Input:** GitHub webhook payload

**Steps:**
1. Extract commit SHA, branch name, author
2. Fetch diff via GitHub API: `GET /repos/:owner/:repo/compare/{base}...{head}`
3. Parse diff to extract changed files
4. Emit `review.requested` event
5. Set GitHub status to "pending": `POST /repos/:owner/:repo/statuses/{sha}`
6. Wake Sofia citizen with diff data

**Output:** Sofia citizen process started

---

### 2. Sofia Policy Checks

**Input:** `{ changed_files[], commit_sha }`

**Check 1: Fail-Loud Enforcement (R-400/R-401)**

**Steps:**
1. For each changed file ending in `.ts`, `.js`, `.py`:
   - Grep for pattern: `catch.*\{[^}]*\}` (try/catch block)
   - For each match:
     - Check if block contains `throw` or `emit` or `console.error`
     - If not: flag as silent fallback violation
2. Collect violations: `{ file, line_number, code_snippet }`

**Verdict:**
- If violations.length > 0: HARD_FAIL
- Else: Continue to next check

---

**Check 2: Baseline Guard (AC.md mutation)**

**Steps:**
1. Check if `proof/AC.md` is in changed files
2. If yes:
   - Get current branch name
   - Check if branch is tagged with `change-req_*` pattern
   - If not: flag as baseline violation
3. Collect violations

**Verdict:**
- If AC.md changed without CR tag: HARD_FAIL
- Else: Continue

---

**Check 3: Test Coverage (New features have tests)**

**Steps:**
1. For each new file in `src/` or `app/`:
   - Extract feature name from file path
   - Check if corresponding test file exists:
     - `tests/**/{feature}.spec.ts` OR
     - `tests/**/{feature}.test.ts` OR
     - `__tests__/{feature}.test.ts`
   - If not found: flag as missing test warning
2. Collect warnings

**Verdict:**
- If missing tests: SOFT_FAIL (warning, allow merge)
- Else: Continue

---

**Check 4: Performance Regression (p95 threshold)**

**Steps:**
1. Check if `tests/acceptance/nf1-performance.spec.ts` exists
2. If yes:
   - Run performance test: `npm run test:performance`
   - Parse output for p95 value
   - Read AC.md to get p95 threshold
   - Compare: `actual_p95 > threshold_p95`
   - If regression: flag as performance violation
3. Collect violations

**Verdict:**
- If p95 regression: SOFT_FAIL (warning, but may be intentional)
- Else: PASS

---

### 3. Verdict Output

**Input:** `{ violations[], warnings[] }`

**Formula for final verdict:**
```
IF violations.length > 0:
  verdict = "HARD_FAIL"
  github_status = "failure"
ELSE IF warnings.length > 0:
  verdict = "SOFT_FAIL"
  github_status = "success" (with comment)
ELSE:
  verdict = "PASS"
  github_status = "success"
```

**Output:** GitHub status + PR comment

---

## GUIDE

### Implementation

**File Structure:**
```
/services/
  sofia-reviewer/
    index.js          # GitHub webhook handler
    wake-sofia.js     # Sofia citizen spawner
    policies/
      fail-loud.js    # R-400/R-401 check
      baseline.js     # AC.md guard
      coverage.js     # Test coverage check
      performance.js  # p95 regression check
```

**1. GitHub Webhook Handler**

File: `services/sofia-reviewer/index.js`
```javascript
import express from 'express';
import { Octokit } from '@octokit/rest';
import { wakeSofia } from './wake-sofia.js';

const app = express();
app.use(express.json());

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.post('/webhook/github-push', async (req, res) => {
  const { repository, ref, after: commitSha } = req.body;

  console.log(`[SOFIA] Review requested for ${commitSha}`);

  // Set status to pending
  await octokit.repos.createCommitStatus({
    owner: repository.owner.login,
    repo: repository.name,
    sha: commitSha,
    state: 'pending',
    context: 'Sofia Review',
    description: 'Analyzing changes...'
  });

  // Fetch diff
  const comparison = await octokit.repos.compareCommits({
    owner: repository.owner.login,
    repo: repository.name,
    base: 'main',
    head: commitSha
  });

  const changedFiles = comparison.data.files.map(file => ({
    path: file.filename,
    status: file.status,
    patch: file.patch
  }));

  // Wake Sofia
  const verdict = await wakeSofia({
    commitSha,
    branch: ref,
    changedFiles,
    repository
  });

  // Update GitHub status
  await octokit.repos.createCommitStatus({
    owner: repository.owner.login,
    repo: repository.name,
    sha: commitSha,
    state: verdict.status, // 'success' | 'failure'
    context: 'Sofia Review',
    description: verdict.message
  });

  // Post PR comment
  const prNumber = await findPRNumber(repository, ref);
  if (prNumber) {
    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: prNumber,
      body: formatVerdictComment(verdict)
    });
  }

  res.status(200).send('Review complete');
});

async function findPRNumber(repository, ref) {
  const prs = await octokit.pulls.list({
    owner: repository.owner.login,
    repo: repository.name,
    head: `${repository.owner.login}:${ref.replace('refs/heads/', '')}`,
    state: 'open'
  });
  return prs.data[0]?.number;
}

function formatVerdictComment(verdict) {
  let comment = `## Sofia Review: ${verdict.verdict}\n\n`;

  if (verdict.violations.length > 0) {
    comment += '### ❌ Violations (merge blocked):\n';
    verdict.violations.forEach(v => {
      comment += `- **${v.rule}** in \`${v.file}:${v.line}\`\n  \`\`\`\n${v.snippet}\n  \`\`\`\n`;
    });
  }

  if (verdict.warnings.length > 0) {
    comment += '\n### ⚠️ Warnings:\n';
    verdict.warnings.forEach(w => {
      comment += `- ${w.message}\n`;
    });
  }

  if (verdict.verdict === 'PASS') {
    comment += '✅ No violations found. Merge approved.\n';
  }

  return comment;
}

app.listen(3003, () => console.log('Sofia reviewer listening on :3003'));
```

**2. Sofia Citizen Logic (Inside Claude Code)**

```javascript
// Sofia's internal logic (woken with CLAUDE_TASK=review)
async function reviewChanges() {
  const changedFiles = JSON.parse(process.env.CLAUDE_CHANGED_FILES);
  const violations = [];
  const warnings = [];

  // Check 1: Fail-loud enforcement
  for (const file of changedFiles) {
    if (file.path.match(/\.(ts|js|py)$/)) {
      const content = await read(file.path);
      const catchBlocks = content.match(/catch\s*\([^)]*\)\s*\{[^}]*\}/g) || [];

      for (const block of catchBlocks) {
        if (!block.includes('throw') && !block.includes('emit') && !block.includes('console.error')) {
          violations.push({
            rule: 'R-400: Silent fallback',
            file: file.path,
            line: findLineNumber(content, block),
            snippet: block
          });
        }
      }
    }
  }

  // Check 2: Baseline guard
  if (changedFiles.some(f => f.path === 'proof/AC.md')) {
    const branch = process.env.CLAUDE_BRANCH;
    if (!branch.match(/change-req_/)) {
      violations.push({
        rule: 'Baseline guard',
        file: 'proof/AC.md',
        line: 0,
        snippet: 'AC.md modified without change-req_* tag'
      });
    }
  }

  // Check 3: Test coverage
  const newSrcFiles = changedFiles.filter(f => f.path.startsWith('src/') && f.status === 'added');
  for (const srcFile of newSrcFiles) {
    const testFile = srcFile.path.replace('src/', 'tests/').replace(/\.(ts|js)$/, '.spec.$1');
    const testExists = await fileExists(testFile);
    if (!testExists) {
      warnings.push({
        message: `Missing test for ${srcFile.path} (expected ${testFile})`
      });
    }
  }

  // Determine verdict
  let verdict, status, message;
  if (violations.length > 0) {
    verdict = 'HARD_FAIL';
    status = 'failure';
    message = `${violations.length} violations found`;
  } else if (warnings.length > 0) {
    verdict = 'SOFT_FAIL';
    status = 'success';
    message = `${warnings.length} warnings (merge allowed)`;
  } else {
    verdict = 'PASS';
    status = 'success';
    message = 'No violations found';
  }

  return { verdict, status, message, violations, warnings };
}

function findLineNumber(content, snippet) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(snippet.slice(0, 20))) {
      return i + 1;
    }
  }
  return 0;
}

async function fileExists(path) {
  try {
    await read(path);
    return true;
  } catch {
    return false;
  }
}
```

**3. GitHub Webhook Setup**

In GitHub repository settings:
1. Go to Settings → Webhooks → Add webhook
2. Payload URL: `https://api.scopelock.mindprotocol.ai/webhook/github-push`
3. Content type: `application/json`
4. Events: `Push` + `Pull request`
5. Save

**4. Testing**

```bash
# Test locally with ngrok
ngrok http 3003

# Update GitHub webhook URL to ngrok URL
# Push test commit

git add -A
git commit -m "test: silent fallback"
git push origin test-branch

# Expected:
# - GitHub status appears on commit (pending → failure)
# - PR comment posted by Sofia
# - Merge blocked

# Check Sofia logs
tail -f /var/log/sofia-reviewer.log
```

---

## ROI

**Time Saved:**
- Manual code review: 30min per PR × 20 PRs/month = 10h/month = $1,000/month
- With Sofia: 5min review (logic/architecture only) × 20 PRs = 1.7h/month = $170/month
- Savings: 8.3h/month = $830/month

**Cost:**
- Development: 10h × $100/h = $1,000
- Running: $0 (GitHub webhooks free, Claude API minimal usage)

**Benefit:**
- Instant review (no waiting for human)
- 100% policy enforcement (R-400/R-401 never slip through)
- Baseline guard automated (AC.md mutations caught immediately)
- Human reviewers focus on logic, not boilerplate patterns

**Payback:** 10h investment / 8.3h monthly savings = 1.2 months
