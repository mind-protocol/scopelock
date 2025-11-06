# Pain Point → Implementation: How to Think Like a Builder

**Target audience:** Nigerian and Colombian developers joining ScopeLock
**Reading time:** 15 minutes
**Prerequisites:** [Complete Mission Flow](./complete-mission-flow.md)

---

## Why This Matters

Clients don't hire you to write code. They hire you to **solve problems**.

But here's the catch: **Clients often don't know what they actually need.**

They say:
- "I need a login system"
- "I need a dashboard"
- "I need AI integration"

But what they really mean:
- "I need to reduce support tickets from password resets"
- "I need to see which features users actually use"
- "I need to automate repetitive customer questions"

**If you build what they ask for instead of what they need, they reject the delivery and you don't get paid.**

This guide teaches you the 7-step framework ScopeLock uses to go from vague client pain → precise implementation plan → AC Green delivery.

---

## The Framework: 7 Steps from Pain to Payment

```
1. Pain Point       → What hurts?
2. Objective        → What would success look like?
3. Architecture     → What components are needed?
4. Flow             → How does data move?
5. Test Plan        → How do we verify it works?
6. Implementation   → What order to build?
7. Verification     → Does it match objective?
```

**Key insight:** Each step is a **filter** that prevents building the wrong thing.

---

## Step 1: Pain Point (What Hurts?)

### The Question

"What problem is the client actually experiencing?"

### How to Extract This

Most clients describe **solutions** (what they think they need), not **problems** (what actually hurts).

**Bad client brief:**
> "I need a chatbot on my website."

**Good pain extraction:**
> **You:** "What problem are you trying to solve with a chatbot?"
>
> **Client:** "I get 50+ emails per day asking the same 5 questions. I spend 2 hours daily copying the same answers."

**See the difference?**
- Solution thinking: "chatbot"
- Problem thinking: "Wasting 2hrs/day on repetitive emails"

### Real Example: TherapyKin

**Client said:**
> "I need voice AI for my therapy app."

**We extracted:**
> **Pain:** Therapists spend 15 min/session taking notes instead of listening to clients. Notes are inconsistent and hard to search.
>
> **Impact:** Lower session quality, harder to track patient progress, can't scale practice.

**Why this matters:** Now we know success = "reduce note-taking time to <2 min AND make notes searchable."

---

## Step 2: Objective (What Would Success Look Like?)

### The Question

"How do we know when the pain is solved?"

### How to Define This

Convert vague pain into **measurable outcomes**.

**Bad objective:**
> "Make the website faster"

**Good objective:**
> - Homepage loads in <2s (p95)
> - Search results appear in <500ms
> - No loading spinners for <3s operations
> - Lighthouse performance score >90

**Framework: Objective = Observable + Measurable + Testable**

### Real Example: TherapyKin

**Pain:** Therapists waste 15 min/session on notes

**Objective:**
1. **Reduce note-taking time:** From 15 min → <2 min per session
2. **Improve searchability:** Find any patient's history in <10s
3. **Increase consistency:** 90%+ sessions have structured notes
4. **Maintain quality:** Therapist approves AI-generated notes 95%+ of the time

**Why this matters:** Now Inna can write AC.md with objective pass/fail criteria. No room for "I don't like it" rejections.

---

## Step 3: Architecture (What Components Are Needed?)

### The Question

"What are the major building blocks to achieve the objective?"

### How to Think About This

Break the system into **high-level components** (not individual functions yet).

**Framework: Components = Data + Logic + Interface**

### Real Example: TherapyKin Voice Notes

**Objective:** Auto-generate therapy session notes from audio in <2 min

**Architecture:**

```
┌─────────────────┐
│  1. AUDIO       │  Record session audio (mobile app)
│     CAPTURE     │  → Store in Supabase storage
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. TRANSCRIBE  │  Send audio to Whisper API
│                 │  → Return timestamped transcript
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. STRUCTURE   │  Send transcript to Claude API
│                 │  → Extract: Chief complaint, symptoms, plan, etc.
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. REVIEW      │  Show structured note to therapist
│                 │  → Allow edits before saving
└────────┬────────┘
         ↓
┌─────────────────┐
│  5. STORE       │  Save to Supabase (linked to patient + session)
│                 │  → Make searchable via vector embeddings
└─────────────────┘
```

**Key decisions at this stage:**
- Where does data live? (Supabase)
- What external APIs? (Whisper, Claude)
- What's the user flow? (Record → Transcribe → Structure → Review → Save)

**Why this matters:** Now Rafael knows what to build. No "I didn't know you wanted that" surprises.

---

## Step 4: Flow (How Does Data Move?)

### The Question

"What's the step-by-step sequence of events, including edge cases?"

### How to Map This

Write the **happy path** (everything works) and **sad paths** (what breaks).

### Real Example: TherapyKin Voice Notes

**Happy Path:**

```
1. User opens session → Taps "Record"
2. App requests microphone permission → User grants
3. Audio records for 45 min → Stores locally while recording
4. User taps "Stop" → Audio uploads to Supabase
5. Upload completes → Triggers transcription job
6. Whisper transcribes → Returns text in 60s
7. Claude structures text → Returns formatted note in 15s
8. Note appears in app → Therapist reviews
9. Therapist taps "Save" → Note stored in Supabase
10. Success message → Return to patient list
```

**Sad Paths:**

```
Sad Path 1: No internet during recording
→ Store audio locally
→ Show "Upload pending" badge
→ Auto-upload when internet returns

Sad Path 2: Transcription fails (Whisper API down)
→ Retry 3x with exponential backoff
→ If still fails, show error: "Transcription unavailable. Try again later."
→ Allow manual upload of audio later

Sad Path 3: Therapist rejects AI note entirely
→ Provide blank note template
→ Log rejection reason (improve AI prompts)

Sad Path 4: Session recording is 3 hours (huge file)
→ Chunk audio into 30-min segments
→ Transcribe each chunk separately
→ Merge transcripts before structuring
```

**Why this matters:** Sofia knows what to test. Inna knows what to put in AC.md's "Error Handling" section.

---

## Step 5: Test Plan (How Do We Verify It Works?)

### The Question

"What specific tests prove the objective is met?"

### How to Design This

For each objective, write **testable acceptance criteria**.

### Real Example: TherapyKin Voice Notes

**Objective 1: Reduce note-taking time to <2 min**

**Test:**
1. Record 5-min test session audio
2. Upload to app
3. Measure time from "Stop Recording" to "Note Ready"
4. **Pass:** <2 min (p95)
5. **Fail:** >2 min

**Objective 2: Find patient history in <10s**

**Test:**
1. Create 100 test patient records with notes
2. Search for random patient by name
3. Measure time to results displayed
4. **Pass:** <10s (average of 20 searches)
5. **Fail:** >10s

**Objective 3: 90%+ sessions have structured notes**

**Test:**
1. Process 50 real session transcripts
2. Count how many produce valid structured notes
3. **Pass:** ≥45/50 (90%)
4. **Fail:** <45/50

**Objective 4: Therapist approves AI notes 95%+ of time**

**Test:**
1. Track approval/rejection rate in production for first 100 sessions
2. **Pass:** ≥95 approvals
3. **Fail:** <95 approvals

**Why this matters:** These become the **Verification** section in Inna's AC.md. Sofia runs these exact tests before delivery.

---

## Step 6: Implementation Plan (What Order to Build?)

### The Question

"What's the dependency order? What can we build in parallel?"

### How to Sequence This

Build **thin vertical slices**, not horizontal layers.

**Bad approach (horizontal layers):**
```
Week 1: Build entire database schema
Week 2: Build entire API
Week 3: Build entire UI
Week 4: Connect everything (surprise: nothing works together)
```

**Good approach (vertical slices):**
```
Slice 1 (2 days): Record audio → Upload to Supabase → Show "uploaded" message
Slice 2 (1 day): Trigger Whisper transcription on upload → Store transcript
Slice 3 (1 day): Send transcript to Claude → Get structured note → Display in UI
Slice 4 (1 day): Allow therapist edits → Save final note to database
Slice 5 (1 day): Build search (vector embeddings) → Test retrieval
```

**Why vertical slices?**
- ✅ You can test end-to-end at each slice
- ✅ Client sees progress every 1-2 days
- ✅ If something breaks, you know which slice caused it

### Real Example: TherapyKin Voice Notes

**Implementation Order:**

```
Priority 1 (Must Have - Week 1):
├─ Audio recording UI
├─ Upload to Supabase storage
├─ Whisper transcription integration
└─ Display raw transcript

Priority 2 (Core Value - Week 1):
├─ Claude API for note structuring
├─ Review UI with edit capability
└─ Save structured note to database

Priority 3 (Polish - Week 2):
├─ Search with vector embeddings
├─ Error handling (retries, offline mode)
└─ Performance optimization (<2 min target)

Priority 4 (Nice to Have - Week 2):
├─ Export notes to PDF
├─ Share notes with patient (consent required)
└─ Analytics dashboard (note quality metrics)
```

**Why this matters:** Rafael generates code in this exact order. Kara deploys slice by slice. Client sees value in Week 1, not Week 4.

---

## Step 7: Verification (Does It Match Objective?)

### The Question

"Did we actually solve the pain?"

### How to Verify

Go back to Step 2 (Objective) and **measure actual outcomes**.

### Real Example: TherapyKin Voice Notes

**Objective (from Step 2):**
1. Reduce note-taking time: 15 min → <2 min ✅
2. Find patient history: <10s ✅
3. 90%+ sessions have notes ✅
4. 95%+ therapist approval ❌ (only 87%)

**What went wrong with #4?**

**Investigation:**
- Asked therapists why they rejected notes
- Found: AI missed context from previous sessions
- Solution: Feed last 3 session notes into Claude prompt
- Re-test: Approval rate → 96% ✅

**Why this matters:** If we shipped at 87% approval, client would've rejected delivery. No AC Green = no payment. Verification catches this **before** client sees it.

---

## Common Mistakes & How to Avoid Them

### Mistake 1: Building What Client Says, Not What They Need

**Example:**
Client: "I need a mobile app."
You: *Builds mobile app*
Client: "This doesn't solve my problem. I just wanted customers to book appointments easily."

**Fix:**
Extract the pain first: "What problem does a mobile app solve?"
Real need: "Easy appointment booking" → Could be solved with:
- Mobile app (expensive, 3 weeks)
- Web app (cheaper, 1 week)
- Calendly integration (cheapest, 2 hours)

**Ask: "What's the simplest solution to the pain?"**

---

### Mistake 2: Skipping the Test Plan

**Example:**
You build a "fast dashboard" but never define "fast."
Client: "This is too slow."
You: "It loads in 4 seconds, that's fast!"
Client: "I expected <1 second."

**Fix:**
Define "fast" in Step 2 (Objective):
- Dashboard loads in <1s (p95)
- Queries return in <500ms
- Lighthouse performance >90

Now it's objective pass/fail, not subjective opinion.

---

### Mistake 3: Building Everything at Once (Big Bang Integration)

**Example:**
Week 1-2: Build database
Week 3: Build API
Week 4: Build UI
Week 5: Try to connect everything → Nothing works together

**Fix:**
Build thin vertical slices:
- Slice 1: One feature, end-to-end, working
- Slice 2: Next feature, end-to-end, working
- Test integration at each slice

---

### Mistake 4: Not Handling Edge Cases

**Example:**
You build audio recording but assume:
- Internet is always available ❌
- API never fails ❌
- User never force-quits app ❌

Client tests → App crashes when internet drops → Rejected delivery

**Fix:**
Map sad paths in Step 4 (Flow):
- What if internet drops?
- What if API times out?
- What if user force-quits?

Rafael codes all sad paths before delivery.

---

## Real-World Example: Full Walkthrough

### Client Request

> "I need an AI chatbot for my e-commerce site to handle customer questions."

### Step 1: Pain Point

**You ask:** "What problem are you trying to solve?"

**Client:** "I get 200+ support tickets per week. 60% are the same 10 questions (shipping, returns, payment). I spend 15 hours/week answering them."

**Pain extracted:**
- 120 repetitive tickets/week
- 15 hours wasted on copy-paste answers
- Customer wait time: 4-24 hours for simple questions

---

### Step 2: Objective

**Success looks like:**

1. **Reduce repetitive tickets:** From 120/week → <20/week (AI handles 100+)
2. **Faster responses:** Instant answers for common questions (vs 4-24 hours)
3. **Maintain quality:** Customer satisfaction ≥4/5 for AI responses
4. **Easy handoff:** AI escalates to human when uncertain (vs giving wrong answers)

**Measurable:** We can track ticket volume, response times, CSAT scores, escalation rate.

---

### Step 3: Architecture

**Components needed:**

```
┌─────────────────┐
│  1. CHAT UI     │  Widget on website (bottom-right)
│                 │  → Customer types question
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. CLASSIFY    │  Claude API: Categorize question
│                 │  → Shipping? Returns? Payment? Other?
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. KNOWLEDGE   │  Search FAQ database (vector similarity)
│     BASE        │  → Find best-matching answer
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. GENERATE    │  Claude API: Generate personalized response
│     RESPONSE    │  → Based on FAQ + customer order history
└────────┬────────┘
         ↓
┌─────────────────┐
│  5. ESCALATE?   │  If confidence <80% → Create human ticket
│                 │  If confidence ≥80% → Send AI response
└─────────────────┘
```

**Tech stack:**
- Frontend: React chat widget embedded in Shopify site
- Backend: FastAPI (Python) on Render
- AI: Claude API (Anthropic)
- Database: Supabase (FAQ storage + vector embeddings)
- Escalation: Zendesk API (create tickets)

---

### Step 4: Flow

**Happy Path:**

```
1. Customer clicks chat widget → Opens chat UI
2. Customer types: "Where is my order?" → Sends to API
3. API classifies question → Category: "Order Tracking"
4. API searches FAQ database → Finds: "Track order via [link]"
5. API checks Shopify API → Gets customer's order status
6. Claude generates response → "Your order #12345 shipped yesterday. Track here: [link]"
7. Confidence = 95% → Send to customer
8. Customer sees response in 3 seconds → Issue resolved
9. Ask: "Was this helpful?" → Customer clicks "Yes"
10. Log satisfaction score → No ticket created
```

**Sad Path 1: Ambiguous question**

```
Customer: "I have a problem"
→ API: Confidence = 30% (too vague)
→ Ask clarifying question: "What kind of problem? Shipping, payment, or product?"
→ Customer clarifies → Retry classification
```

**Sad Path 2: AI unsure**

```
Customer: "Can I get a refund for this custom order?"
→ API: Confidence = 60% (policy unclear)
→ Escalate to human: "I'll connect you with our team. Typical response time: 2 hours."
→ Create Zendesk ticket with conversation history
```

**Sad Path 3: Customer unhappy with AI response**

```
AI provides answer
→ Customer clicks "Not helpful"
→ Escalate to human immediately
→ Log feedback to improve knowledge base
```

---

### Step 5: Test Plan

**Objective 1: Reduce repetitive tickets to <20/week**

**Test:**
1. Run chatbot for 2 weeks
2. Track ticket volume by category
3. **Pass:** Shipping/Returns/Payment tickets <20/week
4. **Fail:** ≥20/week

**Objective 2: Instant responses (<3s)**

**Test:**
1. Send 50 test questions
2. Measure time from "send" to "response displayed"
3. **Pass:** Average <3s
4. **Fail:** Average ≥3s

**Objective 3: Customer satisfaction ≥4/5**

**Test:**
1. Collect "Was this helpful?" ratings for first 200 interactions
2. Calculate average
3. **Pass:** ≥4.0/5.0
4. **Fail:** <4.0/5.0

**Objective 4: Escalation accuracy (don't answer when unsure)**

**Test:**
1. Review 100 escalated conversations
2. Check: Did AI correctly identify it couldn't answer?
3. **Pass:** ≥90% were correct escalations
4. **Fail:** <90% (AI escalated too much or too little)

---

### Step 6: Implementation Plan

**Slice 1 (2 days): Basic chat widget + echo response**
- Embed chat UI on site
- Customer types message → API receives → Echo back "I received: [message]"
- **Test:** Can send and receive messages

**Slice 2 (1 day): Claude API classification**
- Send message to Claude → Get category (Shipping/Returns/Payment/Other)
- Display category to customer: "I understand this is about [Shipping]"
- **Test:** 20 test questions correctly classified

**Slice 3 (2 days): FAQ search + response generation**
- Load FAQ database with 50 common questions
- Search for matching FAQ → Generate personalized response
- **Test:** 10 test questions get relevant answers

**Slice 4 (1 day): Shopify order lookup**
- Integrate Shopify API
- When customer asks about order → Fetch real order status
- **Test:** "Where is my order?" returns real tracking info

**Slice 5 (1 day): Escalation to Zendesk**
- If confidence <80% → Create Zendesk ticket
- Include conversation history
- **Test:** Low-confidence question creates ticket

**Slice 6 (1 day): Polish + performance**
- Optimize response time (<3s)
- Add "Was this helpful?" feedback
- Error handling (API timeouts)
- **Test:** All acceptance criteria pass

**Total: 8 days (1.5 weeks)**

---

### Step 7: Verification

**Deploy to production → Measure for 2 weeks:**

**Results:**
1. ✅ Repetitive tickets: 120/week → 12/week (90% reduction)
2. ✅ Response time: <2s average
3. ✅ Customer satisfaction: 4.3/5
4. ❌ Escalation accuracy: 78% (too many false escalations)

**Issue found:** AI escalating questions it could actually answer

**Fix:** Lowered confidence threshold from 80% → 70%

**Re-test:** Escalation accuracy → 92% ✅

**Client accepts → AC Green → Team gets paid**

---

## Summary: The 7-Step Checklist

Before you write ANY code, complete this checklist:

### ✅ Step 1: Pain Point
- [ ] What problem is the client experiencing?
- [ ] What's the impact (time wasted, money lost, customers frustrated)?
- [ ] Is this a real pain or a "nice to have"?

### ✅ Step 2: Objective
- [ ] What does success look like (observable + measurable)?
- [ ] How will we know when the pain is solved?
- [ ] Are these pass/fail criteria (no room for "I don't like it")?

### ✅ Step 3: Architecture
- [ ] What are the major components?
- [ ] What external APIs/services are needed?
- [ ] What's the tech stack?

### ✅ Step 4: Flow
- [ ] What's the happy path (step-by-step)?
- [ ] What are the sad paths (edge cases)?
- [ ] How do we handle errors gracefully?

### ✅ Step 5: Test Plan
- [ ] For each objective, what specific tests prove it's met?
- [ ] Are these tests automatable (for Sofia to run)?
- [ ] Do we have test data ready?

### ✅ Step 6: Implementation Plan
- [ ] What's the build order (vertical slices)?
- [ ] What can we deliver in Week 1 to show value?
- [ ] Are slices testable end-to-end?

### ✅ Step 7: Verification
- [ ] Did we measure against objectives?
- [ ] If any objective failed, what's the fix?
- [ ] Is client pain actually solved?

**If you skip any step, you risk building the wrong thing and not getting paid.**

---

## Related Resources

**🔄 [The Complete Mission Flow](./complete-mission-flow.md)**
See how this framework fits into the full delivery process

**💬 [How to Talk to AI Citizens](./how-to-talk-to-ai-citizens.md)**
Ask Rafael to generate code from your implementation plan

**📋 [What Good Documentation Looks Like](./good-documentation-structure.md)**
See how Inna writes AC.md following this framework

---

## Questions?

This framework is how **every ScopeLock mission starts**. If you're unclear on any step, ask:
- **Inna** (via Claude Code): For help extracting pain points and writing objectives
- **Rafael** (via Claude Code): For architecture and implementation planning
- **NLR** (via Telegram @nlr_ai): For strategic guidance on complex missions

**Remember:** Spending 2 hours on Steps 1-5 saves you 20 hours of rework later.
