# Technical Basics for ScopeLock Developers

**Audience:** New team members who may not have traditional coding background
**Purpose:** Understand the core concepts we use every day at ScopeLock

---

## 1. What is Markdown?

### Simple Explanation
Markdown is a way to format text using simple symbols. Instead of clicking buttons like in Word, you type symbols that become formatting.

### Why We Use It
- All our documentation is written in Markdown
- GitHub uses Markdown
- Claude understands Markdown
- It's simple and works everywhere

### Basic Markdown Examples

```markdown
# This is a big heading (H1)
## This is a medium heading (H2)
### This is a small heading (H3)

**This text is bold**
*This text is italic*

- This is a bullet point
- Another bullet point
  - Indented bullet point

1. Numbered list item
2. Another numbered item

`This is inline code`

[This is a link](https://example.com)
```

### How It Looks

- `# Heading` → Big title
- `**bold**` → **bold**
- `*italic*` → *italic*
- `- item` → bullet point
- ``` `code` ``` → highlighted code

### Where You'll Use It
- Writing documentation
- Creating README files
- Communicating in GitHub
- Writing specs for Claude

---

## 2. What is a System Prompt?

### Simple Explanation
A system prompt is the "personality" and "instructions" you give to an AI before it starts working. It tells the AI who it is, what it knows, and how it should behave.

### Real-World Analogy
Think of it like training a new employee on their first day:
- "You are a customer service agent"
- "You always speak politely"
- "You know our product catalog"
- "When customers ask X, you do Y"

### Example System Prompt

```
You are Maya, the Client Success Manager at ScopeLock.

Your responsibilities:
- Communicate with clients professionally
- Provide weekly status updates
- Handle change requests

Your personality:
- Warm but professional
- Proactive communicator
- Never overpromise

When a client asks about timeline, always check with the team first.
```

### Why It Matters
- Different system prompts = different AI behaviors
- A good system prompt = consistent, quality AI output
- Our AI citizens (Emma, Inna, Rafael, Sofia, Maya, Alexis) all have system prompts
- The system prompt is in the `CLAUDE.md` files

### Where You'll See System Prompts
- `/citizens/*/CLAUDE.md` files
- When you start a Claude Code session
- When configuring AI assistants

---

## 3. What is GitHub?

### Simple Explanation
GitHub is like Google Drive for code. It stores all your code files in the cloud, tracks every change ever made, and lets teams work together without overwriting each other's work.

### Key Concepts

**Repository (Repo)**
- A folder containing all your project files
- Example: `github.com/mind-protocol/scopelock` is our repo

**Commit**
- A "save point" with a description of what changed
- Like saving a game - you can go back to any commit
- Example: "Added login page" or "Fixed payment bug"

**Branch**
- A separate version of the code to work on features
- `main` branch = the production-ready code
- Feature branches = work in progress

**Pull Request (PR)**
- A request to merge your changes into the main code
- Others can review before it goes live

**Clone**
- Downloading a copy of the repo to your computer

### Common Commands You'll See

```bash
git status          # What files changed?
git add .           # Stage all changes for commit
git commit -m "message"  # Save changes with description
git push            # Upload changes to GitHub
git pull            # Download latest changes from GitHub
```

### Why GitHub Matters
- All our code lives there
- Every change is tracked (we can undo mistakes)
- Multiple people can work without conflicts
- It's the source of truth for what's deployed

---

## 4. What is a Specification (Spec)?

### Simple Explanation
A specification is a detailed document that describes EXACTLY what needs to be built, how it should work, and how we know it's done.

### Why We Write Specs
- No guessing about requirements
- AI (Rafael) can build from clear specs
- Everyone agrees on what "done" means
- Prevents "that's not what I wanted" problems

### What a Good Spec Includes

**1. What it does (Functional Requirements)**
- User can log in with email and password
- System sends confirmation email
- Dashboard shows last 30 days of data

**2. How well it does it (Non-Functional Requirements)**
- Page loads in under 2 seconds
- Works on mobile and desktop
- Handles 100 concurrent users

**3. How we verify it (Acceptance Criteria)**
- Test: Login with valid credentials → Success
- Test: Login with wrong password → Error message
- Test: Load time < 2 seconds on 3G connection

### Our Spec Structure (6 Levels)

1. **PATTERN** - Core principles
2. **BEHAVIOR_SPEC** - What it should do (AC.md)
3. **VALIDATION** - Tests to verify it works
4. **MECHANISM** - How it's built technically
5. **ALGORITHM** - Step-by-step code logic
6. **GUIDE** - How to use/deploy it

### Where Specs Live
- `/docs/missions/[mission-name]/`
- Inna writes these before Rafael codes

---

## 5. What are Tests?

### Simple Explanation
Tests are code that checks if your code works correctly. Instead of manually clicking through an app to check if it works, tests do it automatically in seconds.

### Why We Test
- Catch bugs before users see them
- Confidence that changes don't break things
- "If it's not tested, it's not built"
- Required for AC Green (client pays when tests pass)

### Types of Tests

**Unit Tests**
- Test one small piece in isolation
- Example: "Does the calculateTotal function return the right number?"

**Integration Tests**
- Test multiple pieces working together
- Example: "Does the checkout flow save to database correctly?"

**End-to-End (E2E) Tests**
- Test the whole app like a real user
- Example: "Can a user sign up, log in, and make a purchase?"

### What Tests Look Like

```python
# Python test example
def test_calculate_total():
    items = [{"price": 10}, {"price": 20}]
    result = calculate_total(items)
    assert result == 30  # Should equal 30
```

```javascript
// JavaScript test example
test('login shows error for wrong password', async () => {
  await page.fill('#password', 'wrong');
  await page.click('#submit');
  expect(page.locator('.error')).toBeVisible();
});
```

### Our Testing Tools
- **pytest** - Python backend tests
- **Vitest/Jest** - JavaScript/React tests
- **Playwright** - Browser E2E tests

### Key Concept: AC Green
- AC = Acceptance Criteria
- Green = All tests pass
- Clients pay at "AC Green" - when tests prove everything works

---

## 6. What Does "Pushing" Mean?

### Simple Explanation
"Pushing" means uploading your code changes from your computer to GitHub, so others can see and use them.

### The Flow

```
Your Computer → GitHub → Production Server
   (push)         (deploy)
```

1. You write code on your computer
2. You `git push` to send it to GitHub
3. The deployment system sees the new code
4. It automatically puts it on the live website

### Commands

```bash
git push origin main
```

- `git push` = Upload my changes
- `origin` = To the GitHub repository
- `main` = To the main branch

### What Happens After You Push
1. GitHub receives your code
2. Vercel/Render sees the new commit
3. They automatically build and deploy
4. ~2 minutes later, it's live on the website

---

## 7. What is "Production" and "Deployment"?

### Simple Explanation
**Production** = The live website that real users see
**Deployment** = The process of putting code onto production

### Our Deployment Setup

**Vercel** (Frontend)
- Hosts our Next.js website
- URL: scopelock.mindprotocol.ai
- Auto-deploys when we push to `main` branch
- Takes ~2 minutes

**Render** (Backend)
- Hosts our Python/FastAPI services
- Hosts our databases
- Also auto-deploys from GitHub

### The Deployment Flow

```
1. You push code to GitHub
2. Vercel/Render detects the push
3. They download the new code
4. They build it (compile, install dependencies)
5. They replace the old version with the new one
6. Users now see the new version
```

### Key Terms

**Build**
- Converting your code into something that can run
- Installing dependencies, compiling, optimizing

**Deploy**
- Putting the built code onto a server
- Making it available to users

**Rollback**
- Going back to a previous version if something breaks

### Why Auto-Deployment is Great
- No manual uploading files
- Every push = automatic update
- Consistent process every time
- Can see deployment logs if something fails

---

## 8. Putting It All Together: The Full Flow

### Typical Task Flow

```
1. SPEC (Inna)
   └─ Writes specification in Markdown
   └─ Defines acceptance criteria
   └─ Creates test requirements

2. TESTS (Sofia)
   └─ Generates test code from spec
   └─ Tests are ready before implementation

3. CODE (Rafael)
   └─ Generates implementation code
   └─ Code is designed to pass Sofia's tests

4. REVIEW (You)
   └─ Review the generated code
   └─ Run tests locally
   └─ Fix any issues

5. PUSH (You)
   └─ git add .
   └─ git commit -m "Add login feature"
   └─ git push origin main

6. DEPLOY (Automatic)
   └─ Vercel/Render sees the push
   └─ Builds and deploys automatically
   └─ Live in ~2 minutes

7. VERIFY (Sofia)
   └─ Runs full test suite against deployment
   └─ Verifies AC Green

8. DONE
   └─ Tests pass = AC Green
   └─ Client can verify
   └─ Invoice sent
```

### Example: Adding a Contact Form

```markdown
# Spec (Markdown)
## Contact Form
- Fields: name, email, message
- Validation: email must be valid
- On submit: save to database, send notification
- Success: show "Message sent!"
- Error: show specific error message

## Tests
- Submit with valid data → success message
- Submit with invalid email → error message
- Submit empty form → validation errors
```

```bash
# After Rafael generates code and Sofia generates tests
git add .
git commit -m "Add contact form with validation"
git push origin main

# Wait 2 minutes...
# Check scopelock.mindprotocol.ai/contact
# Run tests to verify
```

---

## Quick Reference Card

| Term | What It Means |
|------|--------------|
| **Markdown** | Text formatting with symbols (`#`, `**`, `-`) |
| **System Prompt** | Instructions that define AI behavior |
| **GitHub** | Cloud storage for code with version tracking |
| **Repository** | A project folder on GitHub |
| **Commit** | A saved checkpoint with description |
| **Push** | Upload code from your computer to GitHub |
| **Pull** | Download latest code from GitHub |
| **Spec** | Document describing what to build |
| **Tests** | Code that verifies other code works |
| **AC Green** | All acceptance tests passing |
| **Production** | The live website users see |
| **Deployment** | Process of putting code live |
| **Vercel** | Hosts our frontend (Next.js) |
| **Render** | Hosts our backend (Python) |
| **Build** | Compile and prepare code to run |

---

## Need Help?

**Stuck on Git?**
- Ask Rafael for git commands
- Check GitHub Desktop (visual interface)

**Confused about a spec?**
- Ask Inna for clarification
- Read the MECHANISM section

**Tests failing?**
- Ask Sofia what's wrong
- Check the error message carefully

**Deployment issues?**
- Check Vercel/Render dashboard for logs
- Ask Rafael for DevOps help

**General questions?**
- Post in team Telegram
- Check /resources/ for more guides

---

*"The best time to learn these basics was yesterday. The second best time is now."*

— ScopeLock Team
