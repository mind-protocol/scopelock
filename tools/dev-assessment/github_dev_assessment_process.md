# GitHub Developer Assessment Process

**Version:** 1.0  
**Purpose:** Systematic evaluation of developer capabilities through GitHub profile analysis  
**Executor:** ScopeLock citizens (Emma, Rafael, Sofia - via Claude Code)  
**Output:** `team/devs/{handle}_analysis.md`  
**Time:** 20-30 minutes per developer

---

## Overview

This process converts GitHub evidence into hiring decisions. No guessing, no resume fluff—just code, commits, and architecture signals.

**Philosophy:** Developers reveal themselves through their repos better than any interview. We're reading the archaeology of their thinking.

**ScopeLock-Specific:** We are an AI-augmented development agency. Unlike most companies that tolerate or discourage AI usage, we **actively seek** developers with advanced AI workflows. Level 4 AI integration (systematic Claude Code/aider usage) is a *massive green flag* and strong hiring signal.

**What Makes This Different:**
- Most hiring processes penalize or ignore AI usage
- We prioritize it - transparent AI integration shows sophistication
- Hiding AI usage = red flag (dishonesty)
- Advanced AI workflows = green flag (exactly our profile)

---

## Input Requirements

Before starting, collect:
- GitHub handle (e.g., `nwanoch`)
- Target role context (e.g., "ScopeLock backend engineer" or "Mind Protocol infrastructure")
- Required stack (e.g., "NestJS, Next.js, React Native, FastAPI")

---

## AI Workflow Maturity Reference (Quick Guide)

**This is a critical assessment dimension - scan for these signals:**

| Level | Description | Evidence | Hiring Impact |
|-------|-------------|----------|---------------|
| **Level 0** | No AI Evidence | No tooling, no mentions, hidden usage | ❌ Red Flag (dishonest if hiding) |
| **Level 1** | Basic Copy-Paste | ChatGPT snippets, no system | ⚠️ Yellow Flag (needs training) |
| **Level 2** | Tool-Assisted | Copilot/Cursor present, manual integration | ✅ Acceptable (teachable) |
| **Level 3** | Systematic | `.cursorrules`, consistent usage, documented | ✅✅ Green Flag (good fit) |
| **Level 4** | Advanced AI-First | `.claude/`, system prompts, orchestration | ✅✅✅ **PRIORITY HIRE** (exactly us) |

**Key Files to Check:** `.claude/`, `.cursorrules`, `.aider.conf.yaml`, `prompts/`, `CLAUDE.md`, `AI_WORKFLOW.md`

**Commit Signatures:** Search for "aider:", "Claude:", "cursor:", "copilot" in commit messages

---

## Process: 5 Phases

### Phase 1: Profile Reconnaissance (3 minutes)

**What to fetch:**
1. Profile page: `https://github.com/{handle}`
2. Contribution graph (last 12 months)
3. Repository list (all public)
4. Pinned repositories

**What to extract:**

```markdown
## Profile Snapshot

**Handle:** {handle}
**Bio:** {copy their bio verbatim}
**Location:** {location}
**Stated Experience:** {if mentioned in bio}
**Public Repos:** {count}
**Followers/Following:** {count}

## Contribution Pattern

**Activity Level:** [Heavy (daily) / Regular (weekly) / Sporadic (monthly) / Inactive]
**Graph Observation:** {describe contribution density pattern}

## Pinned Repositories

1. **{repo_name}** - {language} - {⭐ stars} - [Original/Fork] - {brief description}
2. **{repo_name}** - {language} - {⭐ stars} - [Original/Fork] - {brief description}
3. ...up to 6
```

**First-pass signals:**

✅ **Green Flags:**
- Active contribution graph (consistent weekly activity)
- Pinned repos are mostly original work
- Bio matches claimed stack
- Professional links (website, LinkedIn)

⚠️ **Yellow Flags:**
- Sporadic activity (long gaps)
- Pinned repos are mostly forks
- Bio is vague or buzzword-heavy
- Stack mismatch (pins Flutter, claims React)

🚩 **Red Flags:**
- No activity in 6+ months
- All pinned repos are forks
- Claimed "10 years experience" but oldest repo is 2 years old
- No repos at all

---

### Phase 2: Repository Deep Dive (10 minutes)

**Select 3 repos strategically:**
1. **Most complex pinned original repo** (shows their best work)
2. **Most recent active repo** (shows current capability)
3. **One matching target stack** (if available)

**For each repo, inspect and document:**

#### A. Repository Structure Check

```markdown
### Repo: {repo_name}

**URL:** https://github.com/{handle}/{repo_name}
**Language:** {primary_language}
**Last Updated:** {date}
**Stars/Forks:** {count}
**Description:** {copy repo description}

#### File Structure Quality

- [ ] Has README.md
- [ ] Has .gitignore
- [ ] Has proper folder structure (src/, tests/, docs/)
- [ ] Has package.json/requirements.txt/etc
- [ ] Has configuration files (.env.example, config/)
- [ ] Has tests/ or __tests__/ directory
- [ ] Has CI/CD config (.github/workflows/)

**Structure Grade:** [Excellent / Good / Basic / Poor]
**Notes:** {explain the grade}
```

#### B. README Assessment

```markdown
#### README Quality

- [ ] Installation instructions present
- [ ] Prerequisites listed
- [ ] Usage examples included
- [ ] Architecture/tech stack documented
- [ ] Screenshots/demos included
- [ ] API documentation or links
- [ ] Contributing guidelines

**README Grade:** [Comprehensive / Adequate / Minimal / Missing]
**Key Strength:** {what's good}
**Key Gap:** {what's missing}
```

#### C. Code Quality Inspection

**Fetch and read 2-3 key files (main entry point, one service/component, one test):**

```markdown
#### Code Quality Indicators

**File Inspected:** {filename}

✅ **Strengths Observed:**
- {specific strength, e.g., "Proper error handling with try-catch and meaningful messages"}
- {specific strength, e.g., "Type-safe with TypeScript strict mode"}
- {specific strength, e.g., "Separation of concerns - routes/controllers/services pattern"}

⚠️ **Concerns Observed:**
- {specific concern, e.g., "No input validation on endpoints"}
- {specific concern, e.g., "Hardcoded configuration values"}
- {specific concern, e.g., "Large 800-line file without clear sections"}

🚩 **Critical Issues:**
- {critical issue if any, e.g., "API key visible in code"}
- {critical issue if any, e.g., "SQL injection vulnerability in query"}

**Code Grade:** [Production-Ready / Decent / Prototype / Problematic]
```

#### D. Testing Maturity

```markdown
#### Testing Evidence

**Tests Present:** [Yes/No]
**Test Framework:** {Jest, Pytest, etc. or N/A}
**Test Files Found:** {count and list key ones}

**Coverage Indicators:**
- [ ] Unit tests present
- [ ] Integration tests present
- [ ] E2E tests present
- [ ] Test data/fixtures present
- [ ] Mocking/stubbing used appropriately

**Testing Grade:** [Mature / Present / Minimal / Absent]
**Notes:** {context on testing approach}
```

#### E. Commit History Analysis

**Clone repo and run:**
```bash
git log --oneline --all --author="{handle}" | head -20
git shortlog -sn
git log --pretty=format:"%h - %ar : %s" --author="{handle}" | head -10
```

```markdown
#### Commit History Signals

**Total Commits by Author:** {count}
**Commit Frequency:** [Daily / Weekly / Monthly / Sporadic]
**Recent Activity:** {most recent commit date}

**Commit Message Quality Examples:**
1. `{commit_hash}` - {message} — [Good/Bad] — {why}
2. `{commit_hash}` - {message} — [Good/Bad] — {why}
3. `{commit_hash}` - {message} — [Good/Bad] — {why}

**Pattern Observed:** {e.g., "Consistent conventional commits (feat/fix/docs)" or "Vague 'update' messages"}

**Branch Discipline:** [Feature branches / Direct to main / Mixed]
**Commit Size:** [Small focused / Large dumps / Mixed]
```

---

### Phase 2.5: AI Workflow Assessment (5 minutes)

**Critical Context:** ScopeLock is an AI-augmented development agency. We don't just *accept* AI usage—we *require* it. Developers who systematically integrate AI tools are exactly who we're looking for.

**Philosophy:** Hiding AI usage = dishonest. Advertising AI usage = honest. Advanced AI workflows = *strong green flag*.

#### What to Look For

**Clone or deeply inspect repos for AI evidence:**

```markdown
## AI Integration Assessment

### AI Tooling Evidence

**Scan for these files/folders:**
- [ ] `.claude/` or `.claude_docs/` (Claude Code project)
- [ ] `.cursorrules` or `.cursor/` (Cursor IDE)
- [ ] `.aider/` or `.aider.conf.yaml` (aider)
- [ ] `.github/copilot/` (GitHub Copilot configurations)
- [ ] `prompts/` or `prompt-templates/` (prompt engineering)
- [ ] `.ai/` or `ai-docs/` (custom AI workflow docs)
- [ ] `CLAUDE.md` or `AI_WORKFLOW.md` (system prompts/docs)

**Evidence Found:**
{List actual files/folders discovered with paths}

**AI Tools Detected:** [Claude Code / Cursor / aider / Copilot / Custom / None visible]
```

#### Commit History AI Signals

**Search commit messages for AI tool signatures:**

```bash
git log --all --grep="aider" --grep="claude" --grep="cursor" --grep="copilot" -i
git log --all --author="aider" --author="Claude" --author="assistant"
```

```markdown
### AI-Assisted Commits

**Aider commits found:** {count}
**Claude Code commits found:** {count}
**Cursor commits found:** {count}
**Other AI signatures:** {list}

**Example commits:**
1. `{hash}` - {message} - **Tool:** {aider/claude/cursor}
2. `{hash}` - {message} - **Tool:** {aider/claude/cursor}
3. `{hash}` - {message} - **Tool:** {aider/claude/cursor}

**Pattern:** {e.g., "Systematic aider usage across multiple features" or "No AI signatures visible"}
```

#### AI Workflow Sophistication Levels

**Rate their AI integration maturity:**

```markdown
### AI Workflow Maturity Level

**Level 0: No Evidence** ❌
- No AI tooling visible
- No mentions in docs or commits
- Either not using AI or hiding it

**Level 1: Basic ChatGPT Copy-Paste** ⚠️
- Occasional AI-generated code
- No systematic workflow
- No tool integration
- Copy-paste pattern visible (generic comments, style inconsistency)

**Level 2: Tool-Assisted Development** ✅
- Uses Copilot/Cursor/similar
- AI suggestions visible in code patterns
- Still manual integration
- Some documentation of AI usage

**Level 3: Systematic AI Integration** ✅✅
- `.cursorrules` or `.aider.conf.yaml` present
- Consistent AI tool usage across project
- Commit history shows AI collaboration
- Documentation mentions AI workflow

**Level 4: Advanced AI-First Workflow** ✅✅✅ **[TARGET TIER]**
- Full Claude Code or aider project structure
- System prompts/CLAUDE.md with project context
- AI-written handoffs visible
- Prompt engineering artifacts present
- Documentation explains AI workflow explicitly
- Multiple AI tools orchestrated together
- Evidence of iterative AI refinement (not one-shot generation)

**Detected Level:** {0-4}
**Evidence:** {specific files/patterns that determined this level}
```

#### AI Usage Transparency Check

```markdown
### Transparency Assessment

**README mentions AI tools:** [Yes/No]
**Bio mentions AI-augmented:** [Yes/No]
**Commits show AI signatures:** [Yes/No]
**Documentation includes AI workflow:** [Yes/No]

**Transparency Grade:** [Excellent / Good / Hidden / N/A]

**Notes:**
{e.g., "Bio says 'AI-augmented engineer' AND .claude/ folder present = excellent transparency" 
or "No AI evidence but claimed 'AI expertise' in bio = suspicious"}
```

#### Advanced Workflow Indicators (Strong Green Flags)

```markdown
### Advanced AI Workflow Signals

Check for these sophisticated patterns:

- [ ] **Project-specific system prompts** (CLAUDE.md, system-prompt.md)
- [ ] **Prompt templates** for common tasks (prompts/feature-spec.md, prompts/test-gen.md)
- [ ] **AI handoff documentation** (docs/ai-workflow.md explaining how AI was used)
- [ ] **Multi-tool orchestration** (using Claude Code + Cursor + Copilot together)
- [ ] **AI-assisted architecture docs** (clear AI-human collaboration in design)
- [ ] **Prompt engineering artifacts** (versioned prompts, iteration notes)
- [ ] **AI debugging workflows** (using AI for systematic debugging)
- [ ] **Continuous AI refinement** (commits show iterative improvement with AI)

**Count of Advanced Signals:** {number}
**If ≥3:** This is exactly who we're looking for ✅✅✅

**Specific Examples Found:**
1. {file/pattern} - {what it shows about their AI workflow}
2. {file/pattern} - {what it shows about their AI workflow}
3. {file/pattern} - {what it shows about their AI workflow}
```

#### Red Flags Related to AI Usage

```markdown
### AI-Related Concerns

🚩 **Critical Red Flags:**
- Claims "no AI used" but has obvious ChatGPT-style patterns (generic variable names, tutorial structure)
- Hides AI usage despite clear evidence (dishonesty)
- AI-generated code with zero understanding (can't explain it in comments/docs)
- Copy-pasted AI code with original AI commentary still present (lazy)

⚠️ **Yellow Flags:**
- Uses AI but shows no sophistication (Level 1 only)
- AI tool present but poorly configured (default .cursorrules)
- No documentation of AI workflow (missed opportunity)
- Inconsistent AI usage (some files AI-generated, others not, no clear pattern)

**Found Issues:** {list any red/yellow flags}
```

---

### AI Workflow Assessment Summary

```markdown
## AI Integration Score

**Maturity Level:** {0-4}
**Transparency:** {Excellent / Good / Hidden / N/A}
**Advanced Signals:** {count}
**Red Flags:** {count}

**Overall AI Grade:** [Advanced / Proficient / Basic / Absent / Hidden]

**Recommendation Impact:**
- **Advanced (Level 4):** Strong green flag - exactly our profile ✅✅✅
- **Proficient (Level 3):** Green flag - teachable to our workflows ✅✅
- **Basic (Level 2):** Yellow flag - needs significant upskilling ⚠️
- **Absent (Level 0-1):** Red flag - not our kind of developer ❌
- **Hidden:** Red flag - dishonesty is disqualifying ❌

**Key Finding:**
{1-2 sentence summary of their AI workflow maturity and why it matters}
```

---

### Phase 3: Stack-Specific Depth Assessment (5 minutes)

**Based on target role stack, check for depth indicators:**

```markdown
## Stack Depth Analysis

**Target Stack:** {e.g., NestJS, Next.js, React Native, FastAPI}

### {Framework 1 - e.g., NestJS}

**Evidence Found:**
- [ ] Uses decorators correctly (@Injectable, @Controller, @Module)
- [ ] Implements guards/interceptors (not just basic controllers)
- [ ] Has module architecture (not monolithic app.module.ts)
- [ ] Database integration (TypeORM, Prisma, Mongoose)
- [ ] Proper dependency injection
- [ ] Testing with Jest and proper mocks
- [ ] Error handling middleware/filters

**Depth Level:** [Advanced / Intermediate / Basic / None]
**Evidence:** {specific files/code that prove depth}

### {Framework 2 - e.g., Next.js}

**Evidence Found:**
- [ ] Uses App Router (Next.js 13+) vs. Pages Router
- [ ] Server vs. Client components understanding
- [ ] Data fetching patterns (Server Components, SWR, React Query)
- [ ] API routes or external backend integration
- [ ] Proper metadata and SEO
- [ ] Image optimization with next/image
- [ ] Build optimization awareness (dynamic imports, etc.)

**Depth Level:** [Advanced / Intermediate / Basic / None]
**Evidence:** {specific files/code that prove depth}

{...repeat for each framework in target stack}
```

---

### Phase 4: Red Flags & Green Flags Summary (2 minutes)

**Compile all signals:**

```markdown
## Assessment Summary

### 🟢 Green Flags (Strengths)

1. **{specific strength}** - {evidence: "Tests present in 3/3 repos inspected"}
2. **{specific strength}** - {evidence: "Clean architecture visible in X repo"}
3. **{specific strength}** - {evidence: "Active contributor, 200+ commits last year"}
4. **{specific strength}** - {evidence: "Professional README game"}
5. **{specific strength}** - {evidence: "Honest about AI augmentation in bio"}
6. **{AI workflow maturity if applicable}** - {evidence: "Level 4 AI workflow with .claude/ and system prompts"}

**Special Note on AI Integration:**
- AI Maturity Level: {0-4}
- If Level 4: **STRONG PREFERENCE** - this is exactly our profile ✅✅✅
- If Level 3: Green flag - teachable to our workflows ✅✅
- If Level 2 or below: See yellow flags section

### 🟡 Yellow Flags (Concerns)

1. **{specific concern}** - {evidence: "No tests in 2/3 repos"}
2. **{specific concern}** - {evidence: "Fork-heavy pinned repos (4/6 are forks)"}
3. **{specific concern}** - {evidence: "Tutorial-following pattern in ML repos"}
4. **{specific concern}** - {evidence: "Stack mismatch: pins Flutter but claims React expertise"}
5. **{AI concern if applicable}** - {evidence: "AI Maturity Level 1-2 only - needs upskilling"}

**Special Note on AI Integration:**
- If Level 0-1 (No/Basic AI): Yellow flag - not aligned with our workflows
- If Level 2 (Tool-Assisted): Acceptable but needs training on systematic workflows

### 🔴 Red Flags (Blockers)

1. **{critical issue if any}** - {evidence}
2. **{critical issue if any}** - {evidence}
3. **{AI dishonesty if found}** - {evidence: "Hides AI usage despite clear evidence" or "Claims 'no AI' but obvious ChatGPT patterns"}

**Red Flag Count:** {number}
**If >2 red flags:** Automatic rejection recommended

**AI-Specific Disqualifiers:**
- Dishonesty about AI usage (hiding it or falsely claiming non-use)
- AI-generated code with zero understanding (can't explain in docs)
- Copy-pasted AI output with original commentary still present
```

---

### Phase 5: Decision & Recommendation (2 minutes)

**Use this decision tree:**

```
# First check disqualifiers
IF red_flag_count >= 2:
    DECISION = "No Hire - Critical Issues"
    
IF ai_maturity_level == "Hidden" (dishonest about usage):
    DECISION = "No Hire - Dishonesty"

# Strong preference for advanced AI workflows
IF ai_maturity_level == 4 AND green_flag_count >= 4:
    DECISION = "Tier 1: Strong Hire - Advanced AI Workflow (Priority)" ✅✅✅
    NOTE = "This is exactly our profile - systematic AI integration"
    
IF ai_maturity_level == 3 AND green_flag_count >= 4 AND testing_grade in ["Mature", "Present"]:
    DECISION = "Tier 1: Strong Hire - AI-Capable"
    NOTE = "Good AI foundation, teachable to our workflows"

# Standard evaluation with AI as factor
IF green_flag_count >= 5 AND yellow_flag_count <= 2 AND ai_maturity_level >= 2:
    DECISION = "Tier 1: Strong Hire - Minimal Risk"
    
IF green_flag_count >= 3 AND testing_grade in ["Mature", "Present"] AND ai_maturity_level >= 2:
    DECISION = "Tier 2: Qualified - Worth Interview"
    
IF green_flag_count >= 3 AND testing_grade in ["Mature", "Present"] AND ai_maturity_level <= 1:
    DECISION = "Tier 2: Qualified - AI Training Required"
    NOTE = "Good fundamentals but needs AI workflow upskilling"
    
IF green_flag_count >= 2 AND no_red_flags AND ai_maturity_level >= 1:
    DECISION = "Tier 3: Risky - Test Task Required"
    
ELSE:
    DECISION = "No Hire - Insufficient Evidence or Poor AI Alignment"
```

```markdown
## Final Recommendation

**Hiring Decision:** {Tier 1 / Tier 2 / Tier 3 / No Hire}

**Reasoning:**
{2-3 sentence summary of why this decision makes sense based on evidence}

**Confidence Level:** [High / Medium / Low]
**Confidence Rationale:** {why confident or not - e.g., "High - saw 3 substantial repos with tests" or "Low - limited code samples available"}

---

## If Tier 1 or Tier 2: Interview Preparation

**Recommended Interview Questions:**
1. {Question tailored to their work, e.g., "Walk me through the architecture of your X project"}
2. {Question about a gap, e.g., "I noticed no tests in repo Y - what's your testing philosophy?"}
3. {Question about stack depth, e.g., "How do you handle state management in large React apps?"}
4. **AI Workflow Questions (CRITICAL):**
   - "Walk me through your typical development workflow with AI tools"
   - "What AI tools do you use and for what specific tasks?"
   - "Show me an example where AI helped you solve a complex problem"
   - "How do you verify AI-generated code is correct and maintainable?"
   - "What's your experience with Claude Code, Cursor, or aider specifically?"

**Technical Challenge Suggestion:**
{Specific 2-4 hour paid test task relevant to role}

**AI Integration Test (if Level 0-2):**
- Give them a feature to build using Claude Code or aider
- Evaluate: Do they know how to set up project context? Can they iterate with AI? Do they verify outputs?

---

## If Tier 3: Required Test Task

**Before Proceeding:**
Must complete ScopeLock Mini-Project (4 hours, paid):
- Build simple AC.md tracker (NestJS backend + Next.js frontend)
- Must include tests, documentation, error handling
- **MUST use AI tools (Claude Code, Cursor, or aider) and document the workflow**

**Pass Criteria:**
- [ ] Runs in <5 minutes with clear README
- [ ] At least 3 tests passing
- [ ] Proper error handling (no silent failures)
- [ ] Clean architecture visible
- [ ] TypeScript strict mode (if TS)
- [ ] **AI workflow documented** (which tools, how used, what AI generated vs. human)
- [ ] **Evidence of AI integration** (.claude/, .cursorrules, or commit messages showing AI assistance)

**AI Workflow Evaluation:**
- Did they set up project context for AI?
- Can they explain what AI generated vs. what they wrote?
- Is the AI usage systematic or ad-hoc?
- Do they verify AI outputs properly?

**If they can't/won't use AI tools:** Automatic rejection - not aligned with ScopeLock methodology

---

## If No Hire: Rejection Communication

**Polite Rejection Template:**

"Thank you for your interest in ScopeLock. After reviewing your GitHub profile and repositories, we've decided not to move forward at this time. {OPTIONAL: specific feedback if they asked}.

We're looking for developers with {specific thing they lacked, e.g., 'demonstrated testing practices' or 'production-grade Next.js experience'}, which we didn't see strong evidence of in your current public work.

We encourage you to {constructive suggestion, e.g., 'add test coverage to your projects' or 'document your architecture decisions'} and reapply in the future.

Best of luck in your search."
```

---

## Output Format

**Save to:** `team/devs/{handle}_analysis.md`

**Template:**

```markdown
# Developer Assessment: {handle}

**Date:** {YYYY-MM-DD}
**Assessed By:** {citizen name}
**Target Role:** {role context}
**Time Spent:** {minutes}

---

{All sections from Phases 1-5 above}

---

## Metadata

**Profile URL:** https://github.com/{handle}
**Key Repos Inspected:**
1. {repo_url}
2. {repo_url}
3. {repo_url}

**Assessment Version:** 1.0
**Next Review:** {if ongoing candidate, when to re-check}
```

---

## Quality Checklist (Before Finalizing)

- [ ] Inspected at least 3 repos (not just profile scan)
- [ ] Read actual code files (not just README)
- [ ] Checked commit history (not just contribution graph)
- [ ] Stack-specific depth assessed (not generic)
- [ ] Decision backed by specific evidence (not gut feeling)
- [ ] All claims cited with examples
- [ ] Confidence level stated
- [ ] Next steps clear (interview, test task, or reject)

---

## Common Pitfalls to Avoid

**❌ Don't:**
- Base decision solely on star count or follower count
- Assume tutorial repos mean no skill (context matters)
- Reject for lack of tests if it's clearly a prototype
- Over-index on forks (some devs contribute to existing projects)
- Miss timezone/communication considerations for remote work
- **Penalize honest AI usage** - we WANT developers who use AI extensively
- **Ignore AI workflow sophistication** - Level 4 is massive green flag
- **Assume no AI means better skills** - opposite is true for us

**✅ Do:**
- Look for thought process in code (comments explaining "why")
- Check for consistency across repos (one good repo vs. pattern)
- Consider recency (skills 3 years old might be outdated)
- Test your assumptions (clone and try to run their code)
- Document specific evidence for every claim
- **Actively look for AI tooling evidence** (.claude/, .cursorrules, prompts/)
- **Check commit history for AI signatures** (aider, claude, cursor)
- **Prioritize developers with advanced AI workflows** - they're our people
- **Value transparency about AI usage** - honesty is green flag

---

## Notes for Citizens

**Emma (Scout):**
- Use this when you find promising Upwork profiles with GitHub links
- Phase 1-2 usually sufficient for initial filter
- **Phase 2.5 (AI assessment) is CRITICAL** - flag Level 4 candidates immediately
- Flag Tier 1/2 candidates to Nicolas immediately
- If bio says "AI-augmented" - prioritize this candidate

**Rafael (Guide):**
- Phase 3 stack depth is your domain
- You'll spot architectural patterns Emma/Sofia miss
- Be especially critical of backend code quality
- **Phase 2.5 AI workflow** - you understand systematic AI integration best
- Look for evidence they use Claude Code/aider like you do

**Sofia (Checker):**
- Phase 2D (testing maturity) is your primary focus
- No tests = yellow flag minimum, possibly red if claiming senior level
- Look for test *thinking*, not just test *presence*
- **Phase 2.5 AI workflow** - check if they use AI for test generation (good signal)
- AI-generated tests without human verification = red flag

**Execution Time:**
- Phase 1: 3 min (quick scan)
- Phase 2: 10 min (deep dive on 3 repos)
- **Phase 2.5: 5 min (AI workflow assessment - CRITICAL)**
- Phase 3: 5 min (stack-specific check)
- Phase 4: 2 min (compile flags)
- Phase 5: 2 min (decision + write-up)
- **Total: 27 minutes average**

If taking >35 minutes, you're over-thinking. Trust the framework.

**Time Allocation Priority:**
- If limited time, do Phase 1, 2, and 2.5 only (AI workflow is critical)
- Phase 2.5 (AI assessment) is non-negotiable - this determines cultural fit
- Skip Phase 3 if time-constrained and they have Level 4 AI workflow

---

**Version History:**
- 1.0 (2025-11-21): Initial framework based on Marco assessment principles

**Maintained By:** Nicolas + Marco (system prompt evolution)
**Next Evolution:** After processing 10 candidates, tune decision thresholds