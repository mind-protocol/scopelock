# ScopeLock Task Catalog - Mission Deck Actions

**Purpose:** Complete list of actionable tasks team members can do to earn compensation
**Context:** Per-interaction compensation model - every task = points toward team pool
**Last Updated:** 2025-11-07

---

## How Task-Based Compensation Works

**Basic Principle:** Every meaningful action = +1 interaction point toward the job's team pool (30% of job value)

**Earnings Formula:** `(Your interactions / Team total interactions) × Job team pool`

**Example:**
- Job value: $1,500
- Team pool: $450 (30%)
- Your interactions: 20
- Team total: 100
- Your earnings: (20/100) × $450 = **$90**

---

## Task Categories

### 1. Client Acquisition (Finding Work)

#### Upwork Job Hunting
**Task:** Find potential Upwork job and share in Mission Deck
- Action: Post Upwork job link in Mission Deck JOBS section
- Points: +1 per job shared (regardless of if we win)
- Details needed: Job title, budget, client history, your assessment (good fit? red flags?)
- Why it matters: More jobs in pipeline = higher win rate

#### Cold Outreach
**Task:** Send cold outreach message to potential client
- Action: Message potential client on LinkedIn/X/email with ScopeLock pitch
- Points: +1 per message sent
- Details needed: Screenshot of message, contact name, platform
- Why it matters: Builds top-of-funnel leads

#### Post on Higgs
**Task:** Post about ScopeLock on Higgs social platform
- Action: Create post showcasing ScopeLock work/capabilities
- Points: +1 per post
- Details needed: Link to post, engagement metrics after 24h
- Why it matters: Brand visibility, attracts clients

#### Post on X (Twitter)
**Task:** Tweet about ScopeLock project or win
- Action: Create thread/post about delivered project or capability
- Points: +1 per post
- Details needed: Link to tweet, engagement metrics
- Why it matters: Builds social proof, attracts clients

#### Post on LinkedIn
**Task:** Share ScopeLock case study or achievement on LinkedIn
- Action: Professional post about project delivery
- Points: +1 per post
- Details needed: Link to post
- Why it matters: Attracts high-value B2B clients

#### Connect Telegram & Message Contact
**Task:** Connect with potential client on Telegram and send intro message
- Action: Add contact, send ScopeLock pitch message
- Points: +1 per new contact messaged
- Details needed: Screenshot of conversation start
- Why it matters: Direct relationship building

#### Follow Up with Warm Lead
**Task:** Send follow-up message to "maybe later" client
- Action: Check leads-tracker.md, message clients due for follow-up
- Points: +1 per follow-up sent
- Details needed: Client name, date of original conversation, outcome
- Why it matters: Convert 20-30% of warm leads to jobs

---

### 2. Proposal Writing

#### Draft Proposal with Emma
**Task:** Work with Emma to draft Upwork proposal
- Action: Ask Emma to analyze job, review draft, finalize proposal
- Points: +1 per proposal drafted (not sent yet)
- Details needed: Job link, proposal draft
- Why it matters: Quality proposals = higher win rate

#### Submit Proposal to Client
**Task:** Actually send proposal on Upwork/platform
- Action: Copy proposal, submit on platform
- Points: +2 (higher value because this is conversion-critical)
- Details needed: Screenshot of submission confirmation
- Why it matters: Can't win without submitting

#### Customize Portfolio for Proposal
**Task:** Tailor portfolio examples to match client's industry
- Action: Select 2-3 relevant projects, write custom intro
- Points: +1 per customized portfolio
- Details needed: Which projects selected, why relevant
- Why it matters: Personalization increases win rate

---

### 3. Client Communication & Management

#### Onboard New Client with Maya
**Task:** Send welcome message to new client after proposal win
- Action: Work with Maya to send onboarding email
- Points: +2 (critical handoff moment)
- Details needed: Client name, date sent
- Why it matters: Sets tone for entire relationship

#### Send Weekly Client Update
**Task:** Send proactive status update to client
- Action: Work with Maya to draft update, send via email/Upwork
- Points: +1 per update sent
- Details needed: Client name, week #, summary of progress
- Why it matters: Keeps client confident, prevents "what's happening?" questions

#### Respond to Client Question
**Task:** Answer client question within 2h SLA
- Action: Read question, work with appropriate citizen (Rafael/Inna/Sofia), send answer
- Points: +1 per question answered
- Details needed: Question summary, response time
- Why it matters: Fast responses = happy clients

#### Schedule Client Call
**Task:** Set up kickoff call or demo call with client
- Action: Send calendar invite with 3 time options
- Points: +1 per call scheduled
- Details needed: Call type, date/time
- Why it matters: Synchronous alignment prevents misunderstandings

#### Present Evidence Sprint Demo
**Task:** Present 90s demo to client (with Maya)
- Action: Walk through deployed feature, explain quantified delta
- Points: +2 (high-value client interaction)
- Details needed: Demo URL, client feedback
- Why it matters: Proves progress, builds confidence

#### Request Client Testimonial
**Task:** Ask happy client for testimonial after AC Green
- Action: Send testimonial request template 1 week post-delivery
- Points: +1 per request sent, +3 if testimonial received
- Details needed: Client name, testimonial text (if received)
- Why it matters: Social proof for future proposals

---

### 4. Specification & Documentation

#### Write AC.md with Inna
**Task:** Work with Inna to create acceptance criteria for new job
- Action: Collaborate on functional + non-functional criteria + verification
- Points: +3 (critical scope-locking document)
- Details needed: Job name, AC.md location
- Why it matters: Locks scope = no scope creep = predictable delivery

#### Create DoD Checklist
**Task:** Generate Definition of Done checklist from AC.md
- Action: Extract all criteria, create checklist format
- Points: +1 per DoD created
- Details needed: Job name, checklist location
- Why it matters: Clear completion criteria for QA

#### Document Architecture Decision
**Task:** Write MECHANISM.md section explaining tech choices
- Action: Work with Inna/Rafael to document why Next.js vs Django, etc.
- Points: +1 per architecture doc
- Details needed: Job name, decision documented
- Why it matters: Future developers understand reasoning

---

### 5. Implementation & Deployment

#### Generate Implementation Code with Rafael
**Task:** Ask Rafael to generate code from Inna's ALGORITHM.md
- Action: Provide ALGORITHM.md, specify what to generate, review output
- Points: +1 per code generation request
- Details needed: What was generated, file paths
- Why it matters: Rafael generates code, you supervise

#### Run Tests Locally
**Task:** Run Sofia's test suite locally before deploying
- Action: `npm test` or `pytest`, check for green
- Points: +1 per test run (only if all pass)
- Details needed: Test results screenshot, pass/fail count
- Why it matters: Catch bugs before client sees them

#### Deploy to Vercel/Render
**Task:** Deploy code to production hosting
- Action: Push to main → Vercel auto-deploys, or manual Render deploy
- Points: +2 (deployment is high-risk moment)
- Details needed: Deployment URL, success confirmation
- Why it matters: Can't deliver without deployment

#### Fix Bug Reported by Sofia
**Task:** Fix specific bug identified in QA
- Action: Read Sofia's bug report, implement fix, re-test
- Points: +1 per bug fixed
- Details needed: Bug description, fix applied
- Why it matters: Zero bugs at delivery = client satisfaction

#### Update Environment Variables
**Task:** Set ENV vars for production deployment
- Action: Add API keys, database URLs, etc. to Vercel/Render
- Points: +1 per ENV update task
- Details needed: Which variables added (don't share secrets)
- Why it matters: Apps don't work without proper config

---

### 6. Quality Assurance & Testing

#### Run Full QA Test with Sofia
**Task:** Run Sofia's complete test suite against deployment
- Action: Execute all tests, document results
- Points: +2 (comprehensive QA is high-value)
- Details needed: Test results, pass/fail breakdown
- Why it matters: Verify all AC criteria met

#### Manual Exploratory Testing
**Task:** Click through deployed app looking for issues
- Action: Test user flows, try edge cases, document findings
- Points: +1 per testing session
- Details needed: What you tested, issues found
- Why it matters: Catch UI/UX issues tests miss

#### Verify AC Green Criteria
**Task:** Check that all AC.md criteria are met
- Action: Go through AC.md checklist item by item
- Points: +1 per AC verification
- Details needed: Job name, all criteria status
- Why it matters: Can't invoice without AC Green

#### Test on Mobile Device
**Task:** Test deployment on real mobile phone
- Action: Open site on phone, test responsive design
- Points: +1 per mobile test
- Details needed: Device type, issues found
- Why it matters: 50%+ traffic is mobile

---

### 7. Team Building & Referrals

#### Onboard New Team Member
**Task:** Walk new developer through ScopeLock process
- Action: Explain Mission Deck, compensation, workflow
- Points: +5 (high-value onboarding)
- Details needed: New member name, completion date
- Why it matters: Scales team capacity

#### Refer New Team Member
**Task:** Recruit developer from your network to join ScopeLock
- Action: Pitch ScopeLock opportunity, intro to NLR
- Points: +3 for referral, +10 if they complete first job
- Details needed: Referral name, current status
- Why it matters: Quality referrals > job boards

#### Create Training Documentation
**Task:** Write "How to..." guide for common task
- Action: Document process, add screenshots, test with new member
- Points: +2 per doc created
- Details needed: Doc title, location
- Why it matters: Speeds up future onboarding

#### Answer Team Member Question
**Task:** Help another developer solve technical issue
- Action: Read their question, provide solution or point to citizen
- Points: +1 per question answered
- Details needed: Question summary, outcome
- Why it matters: Unblocks teammates = faster delivery

---

### 8. Learning & Skill Building

#### Complete Training Mission
**Task:** Finish assigned training project (for new members)
- Action: Build sample feature per specifications
- Points: +5 (one-time, proves capability)
- Details needed: Training mission completed, code location
- Why it matters: Verifies you can deliver before real client work

#### Learn New Tool/Framework
**Task:** Study tool in standard stack (Next.js, Render, etc.)
- Action: Complete tutorial, build sample project
- Points: +1 per learning session logged
- Details needed: What you learned, how long
- Why it matters: Better skills = faster delivery

#### Review Peer's Code
**Task:** Review another developer's code before deployment
- Action: Check code quality, suggest improvements
- Points: +1 per code review
- Details needed: What you reviewed, feedback given
- Why it matters: Catches bugs, shares knowledge

---

### 9. Internal Tools & Mission Deck

#### Log Interaction in Mission Deck
**Task:** Document work done on job (this is automatic when messaging citizens)
- Action: Send message to Rafael/Inna/Sofia/Emma/Maya about job
- Points: +1 per message (tracked automatically)
- Details needed: None (automatic)
- Why it matters: Transparent contribution tracking

#### Update SYNC.md with Progress
**Task:** Add entry to SYNC.md about completed work
- Action: Document what you did, blockers, next steps
- Points: +1 per SYNC update
- Details needed: Update summary
- Why it matters: Team visibility, coordination

#### Send Team Telegram Update
**Task:** Post progress update to ScopeLock Telegram
- Action: Use telegram-send.cjs script, explain impact
- Points: +1 per team update
- Details needed: Message content
- Why it matters: Keeps everyone aligned

#### Report Bug in Mission Deck
**Task:** Find and report bug in Mission Deck system
- Action: Document bug, steps to reproduce, expected vs actual
- Points: +2 per bug reported (if confirmed)
- Details needed: Bug description, severity
- Why it matters: Improves internal tools

---

### 10. Marketing & Content

#### Write Blog Post with Emma
**Task:** Create SEO-optimized blog post about delivered project
- Action: Work with Emma to draft post, publish to site
- Points: +3 per published post
- Details needed: Blog post URL
- Why it matters: Organic traffic = passive leads

#### Create Case Study
**Task:** Document completed project as portfolio case study
- Action: Extract proof entry data, write narrative, add metrics
- Points: +3 per case study
- Details needed: Project name, case study location
- Why it matters: Sales collateral for proposals

#### Record Demo Video
**Task:** Create screen recording of delivered feature
- Action: Record 90s walkthrough, add voiceover
- Points: +2 per video created
- Details needed: Video link
- Why it matters: Visual proof for marketing

#### Update Portfolio Page
**Task:** Add new project to scopelock.mindprotocol.ai portfolio
- Action: Write project card, add to portfolio page
- Points: +1 per portfolio update
- Details needed: Project added
- Why it matters: Always show latest work

---

## Task Rewards Summary

| Task Type | Base Points | Notes |
|-----------|-------------|-------|
| Find Upwork job | +1 | Per job shared |
| Cold outreach | +1 | Per message sent |
| Social media post | +1 | Per platform |
| Draft proposal | +1 | With Emma |
| Submit proposal | +2 | Higher value (conversion moment) |
| Onboard client | +2 | Critical handoff |
| Weekly client update | +1 | Per update |
| Answer client question | +1 | <2h response |
| Present demo | +2 | High-value interaction |
| Write AC.md | +3 | Scope-locking doc |
| Generate code with Rafael | +1 | Per request |
| Deploy to production | +2 | High-risk moment |
| Fix bug | +1 | Per bug fixed |
| Full QA test | +2 | Comprehensive |
| Onboard team member | +5 | High-value |
| Refer team member | +3 → +10 | If they complete job |
| Write blog post | +3 | Published content |
| Complete training | +5 | One-time |

---

## How to Log Tasks in Mission Deck

**Automatic Tracking:**
- Messaging AI citizens (Rafael, Inna, Sofia, Emma, Maya) in job thread = automatic +1 per message

**Manual Logging:**
- For tasks not tied to AI messages (social posts, outreach, etc.), post in Mission Deck job thread:
  ```
  [TASK] Posted ScopeLock case study on LinkedIn
  Link: [LinkedIn URL]
  Engagement: 42 likes, 8 comments after 24h
  ```

**Why Manual Logging Matters:**
- Proves you did the work
- Shares results with team
- Contributes to job completion pool

---

## Task Selection Strategy

**For New Members (building reputation):**
1. Complete training mission (+5)
2. Find 5 Upwork jobs (+5)
3. Help with 2 proposals (+4)
4. Run QA on deployment (+2)
5. **Total:** +16 points = prove capability

**For Experienced Members (maximize earnings):**
1. Focus on high-value tasks: onboarding (+5), proposals (+2), demos (+2), QA (+2)
2. Consistent client communication (weekly updates = +1 each)
3. Refer quality team members (+10 if successful)

**For Marketing-Focused Members:**
1. Blog posts (+3 each)
2. Social media presence (+1 per post × 3 platforms = +3/day)
3. Case studies (+3 each)
4. Follow-up warm leads (+1 each)

---

## Task Guidelines

**DO:**
- Log tasks immediately after completing
- Provide evidence (links, screenshots, metrics)
- Explain impact ("Why this matters")
- Help teammates with tasks

**DON'T:**
- Log tasks you didn't actually do (fraud = removal)
- Spam low-value tasks (quality > quantity)
- Work on tasks outside assigned jobs (focus matters)
- Skip documentation ("I'll log it later" = forgotten)

---

## Future Task Types (Coming Soon)

- **Code review tasks** (+1 per review)
- **Documentation updates** (+1 per doc improved)
- **Tool improvement tasks** (Mission Deck features)
- **Client referrals** (+% of new client revenue)
- **Mentor junior developer** (+2 per session)

---

## Questions?

**"How do I know which tasks to prioritize?"**
→ Focus on tasks for active jobs you're assigned to. High-value tasks (proposals, demos, QA) earn more points faster.

**"Can I do tasks for jobs I'm not assigned to?"**
→ Yes! Anyone can contribute to any job. More contributions = higher earnings share.

**"What if I complete a task but forget to log it?"**
→ Log it retroactively with date completed. Provide evidence (screenshot, link). NLR reviews and approves.

**"How do I see my current earnings?"**
→ Mission Deck shows real-time: "Your interactions: X, Earning at completion: $Y.YY"

**"What if someone logs fake tasks?"**
→ All tasks require evidence. NLR spot-checks. Fraud = immediate removal + no payment.

---

**Last Updated:** 2025-11-07
**Owner:** Team (maintained by Alexis + NLR)
**Review Cadence:** Monthly (add new task types as workflow evolves)
