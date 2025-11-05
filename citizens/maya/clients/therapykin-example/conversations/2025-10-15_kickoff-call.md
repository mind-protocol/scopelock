# Kickoff Call — TherapyKin
**Date:** 2025-10-15, 10:00am PST
**Duration:** 30 minutes
**Participants:** Sarah Chen (Client), Maya Laurent (ScopeLock)
**Format:** Video call (Zoom)

---

## Call Summary

Initial kickoff to review project scope, timeline, communication plan, and address Sarah's concerns. Sarah was noticeably nervous due to previous agency experience but became more relaxed as we discussed ScopeLock's process.

---

## Discussion Points

### 1. Project Vision (Sarah's Words)

"I want to make therapy more accessible. Not everyone can afford $200/session, and not everyone has time for weekly appointments. I envision TherapyKin as a caring friend you can talk to anytime—through text or voice—who actually understands you and helps you work through your emotions."

**Key insight:** Emotional tone of voice is critical. She kept coming back to "empathetic," "caring," "warm."

---

### 2. Previous Agency Experience (Why She's Nervous)

**Sarah:** "My last agency quoted 4 weeks and took 6 months. They kept saying 'almost done' but I never saw anything working until month 5. I lost trust in agencies."

**My response:** Explained ScopeLock model:
- AC.md (executable acceptance criteria) — you'll know exactly what "done" means
- Evidence Sprint in 10 days — you'll see a working demo, not just promises
- Pay at AC Green — only pay when tests pass

**Sarah's reaction:** Visibly relieved. Said "This is exactly what I needed to hear."

---

### 3. Privacy & Compliance Concerns

**Sarah:** "Privacy is critical. My users are sharing deeply personal things. I'm not HIPAA-regulated, but I want to act like I am."

**Agreed approach:**
- Encryption at rest and in transit
- No third-party data sharing without explicit consent
- User data deletion on request (right to be forgotten)
- Minimal data collection (only what's necessary)

**Action item:** I'll ensure Inna includes privacy requirements in AC.md.

**Note (for future):** Should have asked explicitly: "Any regulatory or legal concerns?" — This would have flagged the "share with therapist" issue earlier (which came up at CR-003).

---

### 4. Voice Quality Discussion

**Sarah:** "Voice is make-or-break. If it sounds robotic, users won't trust it. I need it to feel like talking to a real person."

**Initial plan:** Browser TTS (text-to-speech)

**Sarah's concern:** "Will that sound empathetic enough?"

**My response:** "Let's do Evidence Sprint with browser TTS first, then you can decide if we need to upgrade to a professional voice API like Eleven Labs."

**Outcome:** She agreed to test browser TTS in Evidence Sprint. (Spoiler: She requested upgrade to Eleven Labs at CR-001 immediately after hearing browser TTS demo.)

---

### 5. Timeline

**Agreed timeline:**
- Start: Oct 15 (today)
- Evidence Sprint: Oct 25 (10 days)
- AC Green: Oct 29 (14 days total)

**Sarah's reaction:** "That's fast. Are you sure you can do it?"

**My response:** "Yes, because we're using our standardized stack (Next.js + FastAPI + PostgreSQL + Vercel/Render). No custom DevOps. We've built similar systems before."

**Sarah:** "Okay, I trust you. But please keep me updated weekly so I don't spiral." 😅

---

### 6. Communication Plan

**Agreed:**
- Weekly status updates every **Wednesday at 10am PST**
- Format: Executive summary (3 bullets) + optional detail links
- Response time: <2 hours during work hours (Maya)
- Preferred method: **Email** (Sarah explicitly said "I hate unnecessary calls")
- Emergency contact: Text message to Sarah's phone

**Sarah's preferences:**
- Don't call unless absolutely necessary
- Async communication preferred (she's in back-to-back meetings most days)
- Appreciates transparency about blockers/delays

---

### 7. Scope Review (High-Level)

**Core features (from proposal):**
1. User authentication (email + password)
2. Onboarding flow (10 questions to personalize AI)
3. Text-based chat with AI companion
4. Voice-based conversation (text-to-speech)
5. Journal view (past conversations)
6. Subscription flow (Stripe integration)

**Sarah:** "This is exactly what I need for MVP. Let's not add anything else."

**My response:** "Perfect. If you think of new features, we'll handle them as Change Requests (Swap or Add)."

**Sarah:** "Got it. Swap = no price change, Add = new milestone. I like that."

---

### 8. Success Metrics (from Sarah)

**What does success look like?**
- 100 beta users complete onboarding
- 70% retention after 7 days
- Voice response time <2 seconds
- Users feel emotionally supported (qualitative feedback)

**Action item:** Inna will include performance thresholds in AC.md (response time <2s, uptime >99%).

---

### 9. Questions from Sarah

**Q: "What if I need to change something mid-project?"**
A: "That's what Change Requests are for. We'll analyze if it's a Swap (no cost) or Add (new milestone). You decide if you want to proceed."

**Q: "What if you miss the deadline?"**
A: "If we hit a blocker that delays us, I'll tell you immediately with the new timeline. We don't let surprises happen on day 29."

**Q: "What if I'm not happy with the final product?"**
A: "You don't pay until all acceptance tests pass. If something doesn't meet criteria, we fix it. That's the AC Green guarantee."

**Sarah:** "Okay, I feel much better now."

---

## Action Items

**Maya (me):**
- ✅ Send onboarding email with timeline recap (done same day)
- ✅ Coordinate with Inna to include privacy requirements in AC.md
- ✅ Schedule Evidence Sprint demo for Oct 25, 10am PST
- ✅ Send first weekly update on Oct 18 (Wednesday)

**Sarah:**
- ✅ Provide Figma mockups by Oct 16 (she sent them next day)
- ✅ Provide privacy policy draft for reference (sent Oct 16)
- ✅ Set up Stripe account for subscription integration (done Oct 17)

---

## Client Sentiment Assessment

**At start of call:** Nervous (7/10), skeptical due to previous agency experience

**At end of call:** Relieved (3/10), cautiously optimistic, appreciated clarity

**Key trust-building moments:**
1. Explaining AC.md ("you'll know exactly what done means")
2. Evidence Sprint in 10 days ("you'll see something working soon")
3. Pay at AC Green ("you don't pay until it works")
4. Weekly updates ("I won't leave you wondering what's happening")

---

## Relationship Notes

**Green flags:**
- She's organized (already has mockups, privacy policy drafted)
- Clear about what she wants (MVP scope is tight)
- Respects our process (understood Swap/Add immediately)
- Fast responses (replied to onboarding email in 15 minutes)

**Yellow flags:**
- Anxious about timeline (previous trauma)
- Needs frequent reassurance in first 2 weeks

**Red flags:**
- None observed

---

## Personal Observations (Not Shared with Client)

Sarah is clearly passionate about mental health accessibility. She mentioned her background as a therapist multiple times. This is personal for her, not just a business.

She's also highly organized and detail-oriented. She had mockups, user research data, and a privacy policy draft ready on day 1. This will make the project smoother.

Her anxiety about agencies is real and justified (6-month delay is brutal). The best way to build trust with her: **proactive communication + visible progress early**.

Prediction: If we deliver Evidence Sprint on time with good quality, she'll relax completely and become a great client.

---

## Follow-Up (Post-Call)

**Same day (Oct 15, 2pm PST):**
Sent onboarding email with timeline recap, next steps, and request for Figma mockups.

**Sarah's response (Oct 15, 2:15pm PST):**
"Thanks Maya! This already feels different from my last experience. Attaching mockups and privacy policy. Let me know if you need anything else."

**Assessment:** Great start. She's engaged and responsive.
