# PATTERN: [Mission Name]

**Mission:** [Brief mission name, e.g., "Customer Portal MVP"]
**Client:** [Client name]
**Date Created:** YYYY-MM-DD
**Owner:** Inna (The Specifier)

---

## Why ScopeLock Approach

[Explain why ScopeLock methodology fits this specific mission]

**Example:**
*"Client has been burned by agencies with scope creep. ScopeLock's AC.md baseline + payment at green tests provides the certainty they need."*

---

## Core Principles

### 1. Pay at AC Green
Client pays only when all acceptance tests pass. No ambiguity about "done."

### 2. Evidence Sprint First
90s demo + quantified delta before expanding scope. Prove value early.

### 3. [Project-Specific Principle]

[Add mission-specific principles here]

**Examples:**
- "HIPAA-first: All data handling must comply with HIPAA requirements"
- "Real-time <50ms: User interactions must feel instant (p95 latency <50ms)"
- "Offline-first: App must work without internet connection"
- "Mobile-first: Responsive design with touch-optimized UI"

---

## Risk Factors

### Risk 1: [Risk Name]

**Description:** [What could go wrong?]

**Mitigation:**
- [Specific action to reduce risk]
- [Monitoring/verification approach]

**Example:**
- **Risk:** Third-party API rate limits could block functionality
- **Mitigation:** Implement caching layer + fallback to local data; monitor API usage daily

### Risk 2: [Risk Name]

[Same structure]

---

## Success Criteria

### Business Outcomes

**Primary:**
- [Main business goal, measurable]

**Secondary:**
- [Additional valuable outcomes]

**Example:**
- **Primary:** Reduce customer onboarding time from 20 minutes to <5 minutes
- **Secondary:** Enable self-service for 80% of common support requests

### Technical Milestones

- [Technical achievement 1]
- [Technical achievement 2]

**Example:**
- Green acceptance tests (all functional criteria met)
- p95 response time <200ms for all API endpoints
- Zero critical bugs at delivery

---

## Constraints

[Hard constraints that cannot be changed]

**Examples:**
- Must integrate with client's existing Stripe account
- Must use client's existing AWS infrastructure
- Must support IE11 (legacy requirement)
- GDPR compliance mandatory (EU data protection)

---

## Assumptions

[Things we're assuming are true - verify these]

**Examples:**
- Client has access to production database credentials
- Client's API documentation is accurate and up-to-date
- Client team is available for questions within 24h
- Staging environment mirrors production

---

## Dependencies

[External dependencies that could block progress]

**Examples:**
- Client must provide API keys for Stripe integration (by Day 2)
- Design team must deliver final mockups (by Day 5)
- Client's IT team must whitelist our deployment IP addresses

---

## Out of Scope

[Explicitly what this mission does NOT include]

**Examples:**
- Admin dashboard (separate milestone)
- Mobile app (separate milestone)
- Data migration from old system (client responsibility)
- Training materials for end users

---

## Notes

[Any additional context, learnings from discovery, or special considerations]
