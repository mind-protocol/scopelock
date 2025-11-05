# Notes — TherapyKin

**Quick context:** Mental health AI companion. CEO Sarah is time-pressed, burned by previous agency, very privacy-conscious.

---

## Personal Observations

**Sarah's Communication Style:**
- Prefers email over calls (explicitly stated in kickoff)
- Responds within 2h during work hours (8am-7pm PST)
- Appreciates executive summaries with "click for details" links
- Gets anxious when timeline shifts (previous agency trauma)
- Needs extra reassurance in first 2 weeks of project

**What Makes Her Happy:**
- Fast responses (she notices if >4h)
- Proactive suggestions (loved that we flagged Eleven Labs upgrade)
- Transparency about what's happening and why
- Being able to test things herself (loves preview links)

**Red Flags That Never Materialized:**
- Initial kickoff call: she seemed very nervous about timeline
- After week 1: anxiety disappeared once she saw consistent progress
- By Evidence Sprint: completely trusting, no micromanagement

---

## Technical Context (for quick reference)

**Voice Quality:**
- This is THE most important feature for Sarah
- Tried browser TTS initially → too robotic
- Upgraded to Eleven Labs Professional Voice (CR-001, +€1500)
- Target: empathetic, warm, "like talking to a caring friend"
- Latency requirement: <2s response time

**Privacy Concerns:**
- HIPAA-adjacent (not regulated, but users expect HIPAA-level privacy)
- No data sharing with third parties without explicit consent
- User data encryption at rest and in transit
- "Share with therapist" feature removed due to compliance concerns (CR-003)

**User Testing Insights (from Sarah):**
- Drop-off at onboarding question 6 → simplified to 5 questions (CR-002)
- Users love voice quality (specifically mentioned in user feedback)
- 92% onboarding completion rate (way above her 70% target)

---

## Timeline Context

**Original Plan:**
- Kickoff: Oct 15
- Evidence Sprint: Oct 25
- AC Green: Oct 29

**Adjustments:**
1. **Oct 22:** Evidence Sprint delayed by 1 day due to Eleven Labs API rate limits. Sarah was fine with it (we communicated proactively).

**Delivery:**
- Delivered on Oct 29 as adjusted. All tests green.
- Sarah paid invoice within 2 hours.

---

## Change Requests (CRs)

### CR-001: Eleven Labs Professional Voice
- **Why:** Browser TTS too robotic for empathetic AI companion
- **Decision:** Add (+€1500)
- **Sarah's response:** Approved immediately, no hesitation
- **Lesson:** Voice quality is make-or-break for this product

### CR-002: Simplify Onboarding (10 → 5 questions)
- **Why:** User testing showed 40% drop-off at question 6
- **Decision:** Swap (equal complexity)
- **Sarah's response:** Grateful for flexibility, said "this is what I wish the last agency did"
- **Lesson:** User testing data = instant Swap approval

### CR-003: Remove "Share with Therapist", Add "Export PDF"
- **Why:** Legal advisor raised HIPAA concerns
- **Decision:** Swap (equal complexity)
- **Sarah's response:** Relieved we could pivot without timeline impact
- **Lesson:** Should have flagged compliance concerns earlier in kickoff

---

## Post-Delivery Stats (from 1-week check-in)

**Success Metrics:**
- 50 beta users onboarded
- 92% completion rate (target was 70%)
- No bugs reported
- Voice latency averaging 1.3s (target was <2s)

**User Feedback (via Sarah):**
- "Voice is so comforting"
- "Feels like talking to a real person"
- "Finally, affordable therapy that fits my schedule"

---

## Relationship Evolution

**Week 1 (Oct 15-22):**
- Sarah nervous, checking in frequently
- Needed extra reassurance about timeline
- Sent preview link early to build confidence → worked

**Week 2 (Oct 22-29):**
- Anxiety disappeared
- Fully trusting
- Started thinking about Phase 2 already

**Post-Delivery (Nov 5):**
- Extremely happy
- Already planning Phase 2 (mobile app)
- Sent testimonial
- Referred 2 colleagues

---

## Testimonial (Exact Quote)

"Working with ScopeLock was the best agency experience I've ever had. They delivered exactly what they promised, on time, and were incredibly responsive to our needs. The ScopeLock model (pay at AC green) completely eliminated my anxiety about getting burned again. I've already referred them to 3 other founders. 10/10 would work with them again."

**Usage:** Perfect for process-skeptical clients who've been burned before.

---

## Phase 2 Ideas (from conversations)

**Sarah mentioned:**
- Mobile app (iOS + Android) — Q1 2026
- Integration with therapist portals — Q2 2026
- Group therapy sessions (AI-moderated) — exploratory

**Not committed yet, but strong interest.**

---

## Lessons Learned (Personal Notes)

**What Worked:**
1. **Fast response time (<2h):** Sarah specifically mentioned this multiple times
2. **Weekly update format:** Executive summary + optional detail links = perfect for her
3. **Proactive suggestions:** Flagging Eleven Labs upgrade early built trust
4. **Preview links:** Letting her test before Evidence Sprint reduced anxiety
5. **Swap/Add framework:** She understood it immediately, no scope disputes

**What to Improve:**
1. **Compliance discussion in kickoff:** Should have asked "Any regulatory concerns?" explicitly
   - CR-003 (remove "share with therapist") came late because we didn't flag this early
   - Next time: add compliance/legal check to kickoff template

2. **Timeline buffer:** Eleven Labs rate limit issue wasn't predictable, but having 1-day buffer would have helped
   - Suggestion: Always add 10% buffer for external API integrations

**What NOT to Do (based on this client):**
- ❌ Don't call unless she requests it (prefers async)
- ❌ Don't send walls of text (she's time-pressed)
- ❌ Don't be vague about timelines (previous agency trauma)

---

## Referrals (Track These)

**From Sarah:**
1. **Alex Martinez** — Mental health startup founder, saw TherapyKin demo, interested in similar AI companion
2. **Jordan Lee** — Building meditation app, wants voice integration
3. **[Name TBD]** — Third referral mentioned, haven't received details yet

**Status:** None converted yet, but warm leads.

---

## Random Context (might be useful later)

- Sarah's background: Former therapist, switched to tech entrepreneurship
- She user-tests everything herself before showing investors
- Based in San Francisco, but fully remote team
- Funding: Pre-seed ($500K), looking to raise seed round in Q1 2026
- Our delivery helps her seed pitch: "working product + 50 beta users + 92% retention"

---

## Quick Reference (for next session)

**If Sarah reaches out:**
- Response time target: <2h
- Tone: Professional but warm
- Format: Executive summary first, details below
- Always mention timeline explicitly
- If scope change: explain Swap vs Add with examples

**If she refers someone:**
- Use TherapyKin as case study in proposal
- Mention: "92% user retention, delivered on time, voice latency <2s"
- Reference her testimonial
