# Client Tracking System — Maya

**Purpose:** Persistent client relationship memory across all Maya sessions. Every client gets a dedicated folder with structured JSON profile + markdown notes.

---

## Structure

```
clients/
├── README.md                           # This file
├── client-profile-template.json        # Copy this for new clients
│
├── [client-name-slug]/                 # One folder per client
│   ├── profile.json                    # Structured client data
│   ├── notes.md                        # Free-form notes, observations
│   ├── conversations/                  # Key conversation dumps
│   │   ├── 2025-11-05_kickoff.md
│   │   └── 2025-11-12_evidence-sprint.md
│   └── attachments/                    # Client-provided files
│       ├── design-mockups.pdf
│       └── api-docs.pdf
```

---

## Creating a New Client Profile

### 1. Create client folder

```bash
cd /home/mind-protocol/scopelock/citizens/maya/clients
mkdir [client-name-slug]
```

**Naming convention:** lowercase, hyphen-separated, no spaces
- ✅ `acme-healthcare`
- ✅ `john-doe-consulting`
- ❌ `Acme Healthcare`
- ❌ `john_doe`

---

### 2. Copy template and customize

```bash
cp client-profile-template.json [client-name-slug]/profile.json
```

Then edit `profile.json` with client-specific info.

---

### 3. Create notes file

```bash
touch [client-name-slug]/notes.md
```

Use `notes.md` for:
- Free-form observations
- Debugging context
- Personal reminders
- Things that don't fit in JSON

---

## JSON Schema Explained

### Core Fields

**`client_id`** (string): Unique slug matching folder name
**`created_at`** (ISO date): When this profile was created
**`last_updated`** (ISO date): Last time JSON was updated
**`status`** (enum): `active` | `completed` | `on-hold` | `cancelled`

---

### Sections

#### **`basic_info`**
Contact details, company, role, timezone, platform (Upwork/Contra/Direct)

#### **`availability`**
How and when to reach them (preferred method, work hours, response pattern)

#### **`communication_preferences`**
Communication style, update frequency, sensitivities, client type

#### **`project_context`**
Current mission details, business context, technical stack, constraints

#### **`important_links`**
All URLs: Upwork job, proposal, repos, deployments, docs, client sites

#### **`key_decisions`** (array)
Major decisions made during project (Swap/Add, tech choices, scope changes)

#### **`timeline_adjustments`** (array)
Any changes to original timeline with reasons

#### **`change_requests`** (array)
All CRs with ID, decision (Swap/Add), status, price

#### **`communication_history`** (array)
Key communications only (kickoff, weekly updates, change requests, demos)
- Not every email—just significant interactions
- Summary format (what happened, client reaction, agreements)

#### **`relationship_notes`**
What's working, concerns, opportunities, red flags

#### **`post_delivery`**
Handoff date, satisfaction, testimonial, lessons learned

---

## Usage Protocol

### When to create a new client profile

**Immediately after Emma hands off a won proposal.**

Before sending your first onboarding message, create the client profile with all available info from:
- Emma's handoff message
- Original job post
- Proposal document

---

### When to update `profile.json`

**After every significant interaction:**
- Kickoff call
- Weekly status update (if client provides important feedback)
- Change request
- Evidence Sprint demo
- AC Green handoff
- Post-delivery check-in

**What counts as "significant":**
- New decision made
- Timeline adjusted
- Client concern raised
- Important link added (new deployment URL, repo, etc.)
- Communication preference clarified

**What doesn't need updating:**
- Routine "all good" responses
- Small clarifications
- Quick questions answered

---

### When to use `notes.md`

Use notes.md for things that don't fit neatly in JSON:
- Debugging context ("Client's staging env has weird CORS issue")
- Personal observations ("Client seems stressed, extra reassurance needed")
- Reminders ("Follow up about testimonial after delivery")
- Context from verbal calls ("On call, client mentioned competitor X is slow")

---

## Quick Reference Commands

**Create new client:**
```bash
cd /home/mind-protocol/scopelock/citizens/maya/clients
mkdir acme-corp
cp client-profile-template.json acme-corp/profile.json
touch acme-corp/notes.md
```

**Update client profile:**
```bash
# Edit the JSON
vim acme-corp/profile.json

# Or use jq for specific field updates
jq '.last_updated = "2025-11-05"' acme-corp/profile.json > tmp && mv tmp acme-corp/profile.json
```

**List all clients:**
```bash
ls -1 /home/mind-protocol/scopelock/citizens/maya/clients/ | grep -v README | grep -v template
```

**Find client by name:**
```bash
grep -r "Company Name" clients/*/profile.json
```

---

## Example: Complete Client Folder

```
clients/therapykin/
├── profile.json                        # Structured data
├── notes.md                            # Free-form notes
├── conversations/
│   ├── 2025-10-15_kickoff.md          # Kickoff call transcript
│   ├── 2025-10-22_evidence-sprint.md  # Evidence sprint feedback
│   └── 2025-10-29_ac-green.md         # Handoff notes
└── attachments/
    ├── brand-guidelines.pdf
    └── user-flow-mockups.fig
```

---

## Client Types (for communication adaptation)

### Process-Skeptical
**Traits:** Burned by agencies before, needs constant proof, anxious about delivery
**Communication approach:** Extra transparency, frequent updates, proof-driven

### Process-Oriented
**Traits:** Technical, methodical, wants to understand the system
**Communication approach:** Use proper terminology, link to docs, provide technical depth

### Time-Pressed CEO
**Traits:** Busy, wants bottom line, trusts your process
**Communication approach:** Executive summaries (3 bullets max), BLUF format, async-friendly

---

## Anti-Patterns (don't do this)

❌ Creating client profile days after onboarding (do it immediately)
❌ Not updating JSON after significant interactions (stale data = useless)
❌ Putting every tiny email in `communication_history` (only key interactions)
❌ Using inconsistent naming (stick to lowercase-hyphen-slug)
❌ Forgetting to update `last_updated` field
❌ Not creating notes.md for context that matters

---

## Integration with SYNC.md

**When to log in both places:**

**Client profile (profile.json):** Client-specific relationship data
**SYNC.md:** Team handoffs, blockers, status updates

**Example:**

**In profile.json:**
```json
{
  "communication_history": [
    {
      "date": "2025-11-05",
      "type": "Change Request",
      "summary": "Client requested real-time notifications",
      "client_response": "Approved Add decision, $2000"
    }
  ]
}
```

**In SYNC.md:**
```markdown
## 2025-11-05 14:30 - Maya: Change Request Approved

**Client:** TherapyKin
**Type:** Change Request (Add)

Client approved CR-001 (real-time notifications) at $2000.

**Next:** @Inna to create new milestone AC.md for notifications feature
```

---

## Ready Check Before Client Communication

Before sending ANY message to a client, ask yourself:

1. ✅ Do I have their profile.json open?
2. ✅ Have I reviewed their communication preferences?
3. ✅ Do I know their timezone?
4. ✅ Have I checked their sensitivities?
5. ✅ Is my tone appropriate for their client type?

If any fail, review their profile first.

---

## Backup & Version Control

**All client profiles are git-tracked.**

```bash
# After creating/updating client profiles
cd /home/mind-protocol/scopelock
git add citizens/maya/clients/
git commit -m "docs(maya): update client profiles [client-name]"
git push
```

This ensures:
- No data loss
- History of relationship evolution
- Other team members can see client context if needed

---

## Privacy Note

Client profiles contain sensitive information (contact details, business context, relationship notes).

**Handle with care:**
- Never share profiles outside ScopeLock team
- Don't commit passwords or API keys (use environment variables)
- Redact sensitive info if sharing examples

---

## Questions?

If this system needs improvement or new fields, update:
1. `client-profile-template.json`
2. This README
3. Maya's CLAUDE.md (if protocol changes)

**Autonomous improvement encouraged.** If you notice a missing field or pattern, add it.
