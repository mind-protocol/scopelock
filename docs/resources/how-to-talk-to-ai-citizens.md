# How to Talk to AI Citizens: Context Is Everything

**Target audience:** Human team members (developers, moderators)
**Reading time:** 10 minutes
**Impact:** 3-5x faster mission completion

---

## Why This Matters

You'll spend 8+ hours every day asking AI citizens (Rafael, Sofia, Emma) for:
- Code generation
- Bug fixes
- Quality verification
- Proposal help

**The difference between effective and ineffective questions:**
- ❌ Bad question → 6 hours debugging
- ✅ Good question → 2 minutes to working solution

---

## The Golden Rule: AI Citizens Need Context

AI citizens are powerful, but they work across **10+ different client projects**. They need to know:
- Which project you're working on
- What you're trying to accomplish
- What you've already tried
- What error you're seeing (full copy-paste)

---

## Part 1: The Bad Example (What NOT to Do)

### ❌ Bad Question

```
"Rafael, the login isn't working. Can you fix it?"
```

**Why this fails:**
- Which project? (Rafael works on 10+ repos)
- Which login? (email? phone? OAuth?)
- What error? (no details)
- What did you try? (unknown)

**Result:** Rafael guesses wrong → you waste 2 hours implementing the wrong fix

---

## Part 2: The Good Example (What TO Do)

### ✅ Good Question

```
Rafael, I'm working on Mission #47 (TherapyKin voice feature).

The OTP login flow is failing at signup.

**What I tried:**
1. User enters phone number
2. Clicks "Send Code"
3. Error: "Failed to send OTP"

**Error from console:**
[paste full error here]

**Environment:**
- Local dev (npm run dev)
- Using Twilio sandbox
- .env variables are set

**Repo:** github.com/scopelock/therapykin
**Branch:** feature/voice-otp

Can you help me debug this?
```

**Why this works:**
- Specific project identified
- Exact error provided
- Steps to reproduce included
- Environment context given
- What was already tried

**Result:** Rafael immediately sees the issue → provides exact fix in 2 minutes

---

## Part 3: The Context Checklist

Before asking ANY AI citizen for help, provide:

### ✅ Must Have (Always)
- [ ] **Which project/mission** (e.g., "Mission #47 - TherapyKin")
- [ ] **What you're trying to do** (e.g., "Implement OTP login")
- [ ] **What's broken** (e.g., "OTP not sending")
- [ ] **Full error message** (copy-paste from console/terminal)

### ✅ Should Have (Usually)
- [ ] **What you tried** (so AI doesn't suggest same thing)
- [ ] **Environment** (local dev? production? which branch?)
- [ ] **Relevant code snippets** (the file causing issues)

### ✅ Nice to Have (When Relevant)
- [ ] **Screenshots** (if UI issue)
- [ ] **Network logs** (if API issue)
- [ ] **Configuration files** (if setup issue)

---

## Part 4: Common Scenarios

### Scenario 1: "Code isn't working"

**❌ Bad:**
```
"Rafael, the component doesn't render"
```

**✅ Good:**
```
Rafael, working on Mission #52 (KongInvest trading dashboard).

The TradeHistory component renders blank on /dashboard page.

**Error in console:**
TypeError: Cannot read property 'map' of undefined
at TradeHistory.tsx:45

**Code:**
[paste relevant component code]

**Expected:** Show list of trades
**Actual:** Blank screen

Can you help?
```

---

### Scenario 2: "How do I implement feature X?"

**❌ Bad:**
```
"How do I add authentication?"
```

**✅ Good:**
```
Rafael, I need to implement email authentication for Mission #48 (DigitalKin admin panel).

**Requirements from AC.md:**
- Email + password login
- JWT tokens
- Remember me checkbox
- Password reset flow

**Current state:**
- Blank login page exists at /login
- No auth logic yet
- Using Next.js 14 App Router

**Question:**
What's the best approach? Should I use NextAuth or custom JWT implementation?

**Repo:** github.com/scopelock/digitalkin
```

---

### Scenario 3: "Is this ready to deploy?"

**❌ Bad:**
```
"Sofia, check Mission #45"
```

**✅ Good:**
```
Sofia, please verify Mission #45 (TherapyKin chat feature) is ready for delivery.

**What I completed:**
1. Implemented real-time chat (Socket.io)
2. Added message history
3. Deployed to Render
4. Tested locally

**AC.md requirements:**
[paste relevant acceptance criteria]

**Live URL:** https://therapykin-staging.onrender.com/chat
**Test account:** user@test.com / password123

Can you run through the DoD checklist?
```

---

## Part 5: Speed Patterns (Ask Smarter, Not Harder)

### Pattern 1: Bundle Related Questions

**❌ Slow:**
```
[Ask question 1, wait]
[Get answer, ask question 2, wait]
[Get answer, ask question 3, wait]
```

**✅ Fast:**
```
Rafael, I have 3 questions about Mission #47:

1. [Question with context]
2. [Question with context]
3. [Question with context]

All in one message. Get all answers at once.
```

---

### Pattern 2: Provide Files Proactively

**❌ Slow:**
```
You: "The API call fails"
Rafael: "Show me the code"
You: [paste code]
Rafael: "Show me the API response"
You: [paste response]
```

**✅ Fast:**
```
You: "The API call fails"

**Code:**
[paste code]

**API Response:**
[paste response]

**Error:**
[paste error]

Rafael gets everything immediately → faster solution
```

---

## Part 6: Which AI Citizen for What?

### Emma - Proposal Help
**Ask when:** Writing Upwork proposals
**Provide:** Job post URL or full copy-paste

### Rafael - Code & Debugging
**Ask when:** Implementing features, fixing bugs
**Provide:** Error messages, code snippets, project context

### Sofia - Pre-Delivery QA
**Ask when:** Ready to deploy
**Provide:** Live URL, test credentials, AC.md requirements

### Inna - Documentation & Scope
**Ask when:** Need mission specs or handling scope changes
**Provide:** Client requirements, change requests

---

## Part 7: Red Flags (You're Doing It Wrong)

### 🚩 Red Flag 1: Vague Questions
```
"It doesn't work"
"There's a bug"
"Can you help?"
```

**Fix:** Be specific. What doesn't work? Where? What error?

---

### 🚩 Red Flag 2: No Project Context
```
"Fix the login"
```

**Fix:** Which project? Which login? What's broken?

---

### 🚩 Red Flag 3: Screenshots of Code
```
[sends screenshot of error]
```

**Fix:** Copy-paste text. AI can't read screenshots well.

---

### 🚩 Red Flag 4: Asking Repeatedly Without Context
```
First ask: "Fix the bug"
Second ask: "Still broken"
Third ask: "Why isn't this working?"
```

**Fix:** Each message should have FULL context (error, code, environment)

---

## Part 8: Real Examples (Learn From These)

### Example 1: Excellent Question ✅

```
Rafael, working on Mission #53 (Serenissima agent deployment).

I need to deploy 5 new agents to production using the deploy script.

**Current state:**
- Agents are coded and tested locally
- deploy.sh script exists but fails

**Error when running `./scripts/deploy.sh agent-name`:**
Error: DEPLOY_KEY not found in environment
at deploy.sh:12

**Environment:**
- Ubuntu 22.04
- Node v18.17.0
- .env file has DEPLOY_KEY="sk_xxx..."

**Question:**
Why isn't the script reading the .env file?

**Repo:** github.com/mind-protocol/serenissima
**Branch:** feature/new-agents
```

**Why excellent:**
- Mission identified
- Error provided
- Environment details included
- What was tried
- Specific question

---

### Example 2: Needs Improvement ❌ → ✅

**❌ Before:**
```
"Sofia, is it ready?"
```

**✅ After:**
```
Sofia, please verify Mission #49 (KongInvest trading bot) is ready for delivery.

**Completed work:**
1. Solana DEX integration
2. Auto-trading logic
3. Risk management (max 5% per trade)
4. Deployed to Render

**AC.md requirements:**
- Connect to Phantom wallet ✅
- Execute trades on Jupiter DEX ✅
- Stop-loss at 5% ✅
- Performance: trades execute <2s ⚠️ (need to verify)

**Live URL:** https://konginvest-prod.onrender.com
**Test wallet:** [wallet address]

**Questions:**
1. Can you verify the 2s trade execution requirement?
2. Should I test with real funds (small amount) or is testnet sufficient?
```

**Why improved:**
- Mission identified
- Work completed listed
- AC requirements mapped
- Specific verification questions
- Shows what's uncertain

---

## Part 9: Practice Exercises

### Exercise 1: Fix This Bad Question

**Bad:**
```
"Emma, write a proposal"
```

**Your turn:** Rewrite with proper context

**Answer:**
```
Emma, I need help writing a proposal for this Upwork job:

[paste full job post or URL]

**Client type:** Process-oriented (mentions "clear timeline" and "deliverables")
**Budget:** $2,000-$5,000
**Timeline:** 2-4 weeks
**Relevant portfolio:** TherapyKin (similar AI chat feature)

Can you draft a proposal using the process-oriented template?
```

---

### Exercise 2: Fix This Bad Question

**Bad:**
```
"Rafael, it crashes"
```

**Your turn:** Rewrite with proper context

**Answer:**
```
Rafael, working on Mission #50 (DigitalKin automation feature).

The app crashes when I click "Run Automation" button.

**Error in console:**
Uncaught TypeError: automation.run is not a function
at AutomationPage.tsx:78

**Code (AutomationPage.tsx:78):**
const handleRun = () => {
  automation.run()  // This line fails
}

**Expected:** Automation starts running
**Actual:** App crashes

**Environment:**
- Local dev (npm run dev)
- Branch: feature/automation

Can you help debug this?
```

---

## Part 10: Quick Reference Card

**Copy this to your desktop for quick reference:**

---

### Before Asking ANY AI Citizen:

1. **Project:** Which mission/repo?
2. **Goal:** What am I trying to do?
3. **Problem:** What's broken/unclear?
4. **Error:** Full copy-paste of error
5. **Tried:** What did I already attempt?
6. **Environment:** Local? Production? Which branch?

---

### Question Template:

```
[AI Citizen Name], working on Mission #[X] ([project name]).

[What I'm trying to do]

**Current state:**
[What's happening now]

**Error:**
[Full error message]

**What I tried:**
1. [First attempt]
2. [Second attempt]

**Environment:**
- [OS/platform]
- [Branch]
- [Relevant config]

**Question:**
[Specific question]

**Repo:** [GitHub URL]
```

---

## Conclusion: Context = Speed

**Remember:**
- AI citizens are powerful but need context
- 2 minutes writing a good question saves 4 hours of back-and-forth
- Every project is different → always specify which one
- Full error messages > vague descriptions
- Screenshots of code are useless → copy-paste text

**Your goal:** Get Rafael/Sofia/Emma to say *"I can fix this immediately"* instead of *"I need more information"*

---

## Next Steps

1. Bookmark this guide
2. Practice with the exercises
3. Use the Quick Reference Card template
4. Track your question quality (are you getting faster answers?)

**If you're stuck:** Re-read Part 3 (Context Checklist) and Part 10 (Quick Reference)
