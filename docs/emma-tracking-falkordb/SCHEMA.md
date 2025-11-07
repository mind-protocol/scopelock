# FalkorDB Schema for Emma Tracking

**Complete node and link type specifications**

---

## Node Types

### 1. Upwork Search → `U4_Event`

**Purpose:** Track each Upwork search query execution

**Type-Specific Fields:**
```json
{
  "type_name": "U4_Event",
  "event_kind": "upwork_search",
  "name": "Upwork Search: AI integration Python",
  "slug": "search-2025-11-07-001",
  "description": "Upwork search for AI integration jobs",
  "detailed_description": "Searched Upwork with query 'AI integration Python Next.js' with payment_verified=1 filter, fixed_price=true",

  "level": "L2",
  "scope_ref": "scopelock",
  "actor_ref": "emma",

  "search_query": "AI integration Python Next.js",
  "jobs_filtered": 50,
  "proposals_sent": 5,
  "platform": "upwork",
  "filters_applied": ["payment_verified", "fixed_price", "$3K+"],
  "timestamp": "2025-11-07T15:30:00Z",

  "created_by": "emma",
  "substrate": "organizational",
  "visibility": "partners",
  "policy_ref": "l4://law/scopelock-tracking-policy",
  "proof_uri": "",
  "commitments": [],

  "created_at": "2025-11-07T15:30:00Z",
  "updated_at": "2025-11-07T15:30:00Z",
  "valid_from": "2025-11-07T15:30:00Z",
  "valid_to": null
}
```

**Universal Attributes:** Inherits all `U4_Event` universal attributes from Mind Protocol schema.

---

### 2. Proposal → `U3_Deal`

**Purpose:** Track each proposal sent to clients

**Type-Specific Fields:**
```json
{
  "type_name": "U3_Deal",
  "deal_kind": "service",
  "name": "Proposal: Dental SaaS MVP",
  "slug": "proposal-2025-11-03-dental-saas",
  "description": "Proposal for Dental SaaS MVP with AI chatbot",
  "detailed_description": "Full-stack web app with AI chatbot, Airtable CRM, Stripe payments. Fixed price $8000, 2-week delivery.",

  "level": "L2",
  "scope_ref": "scopelock",
  "state": "Proposed",  // Proposed | Confirmed | Rejected | NoResponse

  // Job Details
  "job_title": "Build Dental SaaS MVP with AI",
  "job_url": "https://www.upwork.com/jobs/~021985...",
  "platform": "upwork",
  "job_posted_at": "2025-11-03T08:00:00Z",

  // Budget
  "amount_value": 8000.0,
  "amount_ccy": "USD",
  "budget_cents": 800000,  // For consistency with missions

  // Client Info
  "client_name": "Dr. Smith",
  "client_spent": 12500.50,
  "client_rating": 4.9,
  "client_hires": 15,
  "client_payment_verified": true,
  "client_country": "United States",
  "client_rank": "Enterprise",

  // Proposal Content
  "proposal_text": "Full proposal content...",
  "questions": ["Which integration matters most: Stripe or custom payment gateway?"],

  // Emma's Assessment
  "decision": "STRONG GO",  // STRONG GO | QUALIFIED MAYBE | HARD NO
  "confidence": 0.85,  // Emma's confidence score (0-1)
  "client_type": "process-skeptical",  // process-skeptical | process-friendly
  "portfolio_match": "TherapyKin",  // Which proof project was used
  "urgency": 8,  // 1-10 urgency score
  "pain": 9,  // 1-10 pain score

  // Timing
  "submitted_at": "2025-11-03T10:00:00Z",
  "response_at": null,  // When client responded
  "settlement_date": null,  // When project starts (if won)

  // Notes
  "notes": "Strong technical fit, high urgency, verified payment",
  "counterparties": ["dr-smith-upwork"],
  "status": "active",  // active | archived

  "created_by": "emma",
  "substrate": "organizational",
  "visibility": "partners",
  "policy_ref": "l4://law/scopelock-proposals-policy",
  "proof_uri": "",
  "commitments": [],

  "created_at": "2025-11-03T10:00:00Z",
  "updated_at": "2025-11-03T10:00:00Z",
  "valid_from": "2025-11-03T10:00:00Z",
  "valid_to": null
}
```

**State Transitions:**
- `Proposed` → `Confirmed` (client accepts, job won)
- `Proposed` → `Rejected` (client says no)
- `Proposed` → `NoResponse` (14+ days, no reply)

**Universal Attributes:** Inherits all `U3_Deal` universal attributes from Mind Protocol schema.

---

### 3. Follow-up Task → `U4_Work_Item`

**Purpose:** Reminder to follow up on proposals with no response

**Type-Specific Fields:**
```json
{
  "type_name": "U4_Work_Item",
  "work_type": "lead_followup",
  "name": "Follow up: Dental SaaS (no response)",
  "slug": "followup-dental-saas-2025-11-20",
  "description": "Follow up on Dental SaaS proposal after 14 days no response",
  "detailed_description": "Client Dr. Smith hasn't responded to proposal sent 2025-11-03. Send follow-up message with value reminder.",

  "level": "L2",
  "scope_ref": "scopelock",
  "state": "todo",  // todo | doing | done | cancelled

  // Assignment
  "assignee_ref": "emma",
  "due_date": "2025-11-20T00:00:00Z",

  // Follow-up Details
  "client_name": "Dr. Smith",
  "proposal_ref": "proposal-2025-11-03-dental-saas",
  "reason": "No response after 14 days",
  "followup_type": "no_response",  // no_response | maybe_later | warm_lead
  "days_since_proposal": 14,

  // Notes
  "notes": "Use 'Quick question' approach, offer Evidence Sprint",

  "created_by": "emma",
  "substrate": "organizational",
  "visibility": "partners",
  "policy_ref": "l4://law/scopelock-tasks-policy",
  "proof_uri": "",
  "commitments": [],

  "created_at": "2025-11-17T10:00:00Z",
  "updated_at": "2025-11-17T10:00:00Z",
  "valid_from": "2025-11-17T10:00:00Z",
  "valid_to": null
}
```

**Universal Attributes:** Inherits all `U4_Work_Item` universal attributes from Mind Protocol schema.

---

### 4. Lead Assessment → `U4_Assessment`

**Purpose:** Store Emma's evaluation reasoning for proposals

**Type-Specific Fields:**
```json
{
  "type_name": "U4_Assessment",
  "assessment_type": "lead_quality",
  "name": "Lead Assessment: Dental SaaS",
  "slug": "assessment-dental-saas-2025-11-03",
  "description": "Emma's GO/NO-GO assessment for Dental SaaS proposal",
  "detailed_description": "STRONG GO decision based on: payment verified, $12.5K client spend, detailed spec, technical fit with TherapyKin proof.",

  "level": "L2",
  "scope_ref": "scopelock",

  // Assessment Results
  "decision": "STRONG GO",  // STRONG GO | QUALIFIED MAYBE | HARD NO
  "confidence_score": 0.85,
  "budget_range": "$8K-10K",

  // Signals Detected
  "client_signals": [
    "payment_verified",
    "high_spend",
    "detailed_spec",
    "technical_role",
    "urgency_mentioned"
  ],
  "red_flags": [],  // Empty if clean

  // Business Buyer Detection
  "buyer_type": "Business Buyer",  // Business Buyer | Technical Buyer
  "buyer_signals_count": 5,
  "job_title_signal": "Founder",
  "language_signals": ["need ASAP", "launching next week"],
  "budget_psychology": "round_number",  // round_number | precise | range

  // Reasoning
  "tier_rationale": "Payment verified + $12.5K spent + detailed outcome-focused spec + 5 Business Buyer signals",
  "persona_guess": "funded_non_technical",
  "urgency_score": 8,
  "pain_score": 9,

  "created_by": "emma",
  "substrate": "organizational",
  "visibility": "partners",
  "policy_ref": "l4://law/scopelock-assessments-policy",
  "proof_uri": "",
  "commitments": [],

  "created_at": "2025-11-03T09:30:00Z",
  "updated_at": "2025-11-03T09:30:00Z",
  "valid_from": "2025-11-03T09:30:00Z",
  "valid_to": null
}
```

**Universal Attributes:** Inherits all `U4_Assessment` universal attributes from Mind Protocol schema.

---

## Link Types

### 1. Search → Proposal: `U4_LEADS_TO`

**Purpose:** Track which search queries led to proposals

**Schema:**
```
(search:U4_Event {event_kind:'upwork_search'})
  -[:U4_LEADS_TO]->
(proposal:U3_Deal)
```

**Link Attributes:**
```json
{
  "created_at": "2025-11-03T10:00:00Z",
  "updated_at": "2025-11-03T10:00:00Z",
  "valid_from": "2025-11-03T10:00:00Z",
  "valid_to": null,

  "confidence": 1.0,
  "energy": 0.8,
  "forming_mindstate": "opportunity_detection",
  "goal": "Track search query effectiveness",

  "visibility": "partners",
  "commitments": [],
  "created_by": "emma",
  "substrate": "organizational"
}
```

---

### 2. Assessment → Proposal: `U4_EVALUATES`

**Purpose:** Link Emma's assessment reasoning to proposal

**Schema:**
```
(assessment:U4_Assessment {assessment_type:'lead_quality'})
  -[:U4_EVALUATES]->
(proposal:U3_Deal)
```

**Link Attributes:**
```json
{
  "created_at": "2025-11-03T09:30:00Z",
  "updated_at": "2025-11-03T09:30:00Z",
  "valid_from": "2025-11-03T09:30:00Z",
  "valid_to": null,

  "confidence": 0.85,
  "energy": 0.9,
  "forming_mindstate": "evaluation",
  "goal": "Assess lead quality before proposal",

  "visibility": "partners",
  "commitments": [],
  "created_by": "emma",
  "substrate": "organizational"
}
```

---

### 3. Follow-up → Proposal: `U4_DEPENDS_ON`

**Purpose:** Link follow-up tasks to original proposals

**Schema:**
```
(followup:U4_Work_Item {work_type:'lead_followup'})
  -[:U4_DEPENDS_ON]->
(proposal:U3_Deal)
```

**Link Attributes:**
```json
{
  "created_at": "2025-11-17T10:00:00Z",
  "updated_at": "2025-11-17T10:00:00Z",
  "valid_from": "2025-11-17T10:00:00Z",
  "valid_to": null,

  "confidence": 1.0,
  "energy": 0.6,
  "forming_mindstate": "nurturing",
  "goal": "Follow up on cold proposal",

  "visibility": "partners",
  "commitments": [],
  "created_by": "emma",
  "substrate": "organizational"
}
```

---

### 4. Proposal → Mission: `U4_BECOMES`

**Purpose:** Link won proposals to resulting missions

**Schema:**
```
(proposal:U3_Deal {state:'Confirmed'})
  -[:U4_BECOMES]->
(mission:U4_Work_Item {work_type:'mission'})
```

**Link Attributes:**
```json
{
  "created_at": "2025-11-05T14:00:00Z",
  "updated_at": "2025-11-05T14:00:00Z",
  "valid_from": "2025-11-05T14:00:00Z",
  "valid_to": null,

  "confidence": 1.0,
  "energy": 1.0,
  "forming_mindstate": "conversion",
  "goal": "Track proposal-to-revenue conversion",

  "visibility": "partners",
  "commitments": [],
  "created_by": "emma",
  "substrate": "organizational"
}
```

---

## Indexes

For optimal query performance:

```cypher
// Proposal lookups
CREATE INDEX ON :U3_Deal(slug)
CREATE INDEX ON :U3_Deal(state)
CREATE INDEX ON :U3_Deal(platform)
CREATE INDEX ON :U3_Deal(submitted_at)

// Search lookups
CREATE INDEX ON :U4_Event(event_kind)
CREATE INDEX ON :U4_Event(search_query)
CREATE INDEX ON :U4_Event(timestamp)

// Follow-up lookups
CREATE INDEX ON :U4_Work_Item(work_type)
CREATE INDEX ON :U4_Work_Item(state)
CREATE INDEX ON :U4_Work_Item(due_date)

// Assessment lookups
CREATE INDEX ON :U4_Assessment(assessment_type)
CREATE INDEX ON :U4_Assessment(decision)
```

---

## Validation Rules

1. **Proposal slugs must be unique:** `CONSTRAINT ON (p:U3_Deal) ASSERT p.slug IS UNIQUE`
2. **State transitions must be valid:** `Proposed → {Confirmed, Rejected, NoResponse}`
3. **Budget cents must be positive:** `budget_cents > 0`
4. **Confidence must be in range:** `0 <= confidence <= 1`
5. **Universal attributes required:** All nodes must have `created_at`, `level`, `scope_ref`
