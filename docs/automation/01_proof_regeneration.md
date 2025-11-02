# Feature 1: Auto-Regenerate Proof Pages

**Status:** Approved (deployment script integration)
**Priority:** P0 (Quick Win)
**Time Estimate:** 2h
**Cost:** $0 (built-in)

---

## PATTERN

**Consciousness Principle:** "Evidence must be immediately visible. When a milestone is tagged, proof pages regenerate automatically—no human memory required."

**Why:** Manual regeneration creates gaps. If Daniel tags `ac-green_feature_2025-11-05` but forgets to run proofgen, clients see outdated `/proof`. Automation eliminates this failure mode.

---

## BEHAVIOR_SPEC

### Event Flow

```
git tag ac-green_*           → tag.pushed@1.0
  ↓
Deployment system detects tag
  ↓
Run proofgen (reads tags)     → proof.generated@1.0
  ↓
Build Next.js with new proof HTML
  ↓
Deploy to production          → deployment.complete@1.0
  ↓
Client sees updated /proof
```

### Contract

**Input:**
- Git tag matching pattern: `evidence-sprint_*`, `ac-green_*`, `change-*`
- Tag must reference commit with `/proof/AC.md`, `/proof/DEMO.md`, `/proof/DELTA.md`

**Output:**
- Updated `public/proof/[tag]/index.html`
- Updated `public/proof/index.html` (index page)
- Updated `public/proof/index.json` (homepage teaser)
- Event emitted: `proof.generated@1.0 { tag, entry_count, timestamp }`

**Failure Mode:**
- Tag pushed but proof files missing → Generate page with "Missing files" chips, don't crash build

---

## VALIDATION

### Acceptance Criteria

**V1: Proof regenerates on tag push**
```bash
# Test:
git tag ac-green_test_2025-11-02
git push origin ac-green_test_2025-11-02

# Wait 2 minutes

# Verify:
curl https://scopelock.mindprotocol.ai/proof/ac-green_test_2025-11-02 | grep "test"
# ✅ Should return 200 with proof page HTML
```

**V2: Index updates with new entry**
```bash
# Verify:
curl https://scopelock.mindprotocol.ai/proof/index.json | jq '.entries | length'
# ✅ Should show N+1 entries (previous count + new tag)
```

**V3: Missing proof files handled gracefully**
```bash
# Test:
git tag ac-green_no-proof_2025-11-02  # Tag without proof/ files
git push origin ac-green_no-proof_2025-11-02

# Verify:
curl https://scopelock.mindprotocol.ai/proof/ac-green_no-proof_2025-11-02 | grep "Missing AC.md"
# ✅ Should show "Missing files" chips, not crash
```

---

## MECHANISM

**Implementation Approach:** Integrate proofgen into Vercel build script

**Current Problem:** GitHub Actions would require separate workflow, adds complexity. Simpler: run proofgen during Vercel build.

**Solution:**
```json
// package.json
{
  "scripts": {
    "build": "npm run proofgen && next build"
  }
}
```

**Why this works:**
- Vercel fetches tags automatically (no manual `git fetch --tags` needed on main branch deploys)
- Proofgen runs before Next.js build → proof HTML available during static generation
- No additional CI/CD infrastructure needed

**Current Issue (Resolved):**
- Vercel's shallow clone doesn't fetch tags on branch deploys
- **Fix:** We now commit generated proof HTML directly (already implemented)
- **New approach:** On tag push, trigger Vercel deployment hook with `VERCEL_REGENERATE_PROOF=true` env var

---

## ALGORITHM

### Step-by-Step Execution

**Step 1: Detect Tag Push**
```
IF git push includes tag matching /^(evidence-sprint|ac-green|change)_/
THEN trigger Vercel deployment webhook
```

**Step 2: Vercel Build Hook**
```
INPUT: Tag name from git push
PROCESS:
  1. Fetch all tags: git fetch --tags --force
  2. List tags matching pattern:
     tags = git tag --list 'evidence-sprint_*' 'ac-green_*' 'change-*'
  3. FOR EACH tag IN tags:
       entry = resolveTagEntry(tag)
       IF entry has all files (AC, DEMO, DELTA):
         entries.push(entry)
       ELSE:
         entries.push(entry WITH missing_files flags)
  4. Sort entries by date DESC
  5. Generate HTML:
     - public/proof/index.html (index page)
     - public/proof/[tag]/index.html (detail pages)
     - public/proof/index.json (API for homepage)
  6. Emit event: proof.generated@1.0
OUTPUT: Generated HTML files in public/proof/
```

**Step 3: Next.js Build**
```
INPUT: Generated proof HTML files
PROCESS: next build (includes public/ directory as static assets)
OUTPUT: Optimized production build with proof pages
```

**Step 4: Deploy**
```
INPUT: Build artifacts
PROCESS: Vercel deployment
OUTPUT: Live site with updated /proof pages
```

---

## GUIDE

### Implementation Steps

**File:** `package.json`
```json
{
  "scripts": {
    "build": "git fetch --tags 2>/dev/null || true && npm run proofgen && next build",
    "build:local": "git fetch --tags 2>/dev/null || true && npm run proofgen && next build",
    "proofgen": "node proofgen/index.js"
  }
}
```

**Explanation:**
- `git fetch --tags` ensures tags are available (Vercel fetches branches but not always tags)
- `|| true` prevents build failure if git fetch errors
- `npm run proofgen` generates proof HTML before Next.js build
- `next build` includes generated HTML as static assets

**Testing Locally:**
```bash
# Simulate tag push
git tag ac-green_local-test_2025-11-02
git push origin ac-green_local-test_2025-11-02

# Verify proofgen detects it
npm run proofgen
# Should output: "[proofgen] Generated 1 entry in public/proof"

# Build and check
npm run build:local
ls public/proof/ac-green_local-test_2025-11-02/
# Should show: index.html

# Commit generated files (current workflow)
git add public/proof/
git commit -m "chore: regenerate proof pages"
git push origin main
```

**Deployment Flow:**
```
Developer → git tag + git push --tags
  ↓
Vercel detects new commit on main
  ↓
Runs: npm install && npm run build
  ↓
proofgen runs → generates HTML
  ↓
next build includes generated HTML
  ↓
Deploy to production
  ↓
Client visits /proof → sees updated entry
```

**Function Names:**
- `proofgen/index.js::generateProofSite(options)` - Main entry point
- `proofgen/index.js::collectEntries(limit)` - Fetches tags, resolves proof files
- `proofgen/index.js::resolveTagEntry(tagInfo)` - Reads proof files from tag
- `proofgen/index.js::writeDetailPage(outDir, entry)` - Generates detail HTML
- `proofgen/index.js::writeIndexPage(outDir, entries)` - Generates index HTML
- `proofgen/index.js::writeJson(outDir, entries)` - Generates index.json

---

## ROI

**Time Saved:** 5 min per proof entry × 20 entries/year = 100 min/year = 1.7h/year
**Cost:** $0 (built-in to deployment)
**Benefit:** Zero risk of forgetting to regenerate proof pages
**Payback:** Immediate (one-time 2h setup)
