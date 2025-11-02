# ScopeLock Marketing Documentation Structure

**Date:** 2025-11-02
**Purpose:** Consolidated documentation structure after cleaning up duplicates

---

## What Was Consolidated

### Archived (Moved to `/docs/archive/2025_11_02_consolidation/`)

1. `/docs/branding_communication_guide.md` (Version 1 - 454 lines)
   - Replaced by: `/docs/marketing/communication_guide.md`

2. `/docs/branding_quick_reference.md` (Version 1 - 148 lines)
   - Replaced by: Quick reference sections in communication_guide.md and README.md

3. `/docs/marketing/branding_communication_guide.md` (Version 2 - 544 lines)
   - Replaced by: `/docs/marketing/communication_guide.md` (most recent, comprehensive)

### Kept (Current Structure)

**Core Guides:**
1. `/docs/marketing/communication_guide.md` ⭐
   - Primary reference for all communication
   - 513 lines, comprehensive
   - Two client archetypes, language rules, transparency principles

2. `/docs/marketing/proposal_framework.md` ⭐
   - Proposal structure, templates, guidelines
   - Includes Template A & B examples
   - Before-send checklist

**Ready-to-Use Templates:**
3. `/docs/marketing/proposal_templates/` (3 files)
   - `README.md` - Decision tree (which template when)
   - `process-skeptical-client.md` - Full template for burned clients
   - `process-oriented-client.md` - Full template for process-friendly clients

**Supporting:**
4. `/docs/marketing/branding_communication_update_2025_11_02.md`
   - Summary of changes and learnings
   - What changed and why

5. `/docs/marketing/README.md`
   - Index of all marketing docs
   - Quick reference sections
   - Team responsibilities

6. `/docs/marketing/upwork_profile.txt`
   - Production profile text
   - Updated with new learnings

7. `/docs/marketing/blog_content_plan.md`
   - Editorial calendar

8. `/docs/marketing/portfolio_website_integration.md`
   - Portfolio strategy

9. `/docs/marketing/blog/`
   - Blog post content

---

## How Files Work Together

### For Writing Proposals

**Workflow:**
1. Read job post → Detect client type
2. Check **communication_guide.md** Section 2 (Two Client Archetypes)
3. Open appropriate template from **proposal_templates/**
4. Consult **proposal_framework.md** for structure guidelines
5. Use **README.md** Quick Reference for identity hierarchy
6. Run 5-question test before sending

**Primary files:**
- `communication_guide.md` - Language rules, detection criteria
- `proposal_templates/` - Ready-to-use templates
- `proposal_framework.md` - Structure and guidelines

### For Branding Decisions

**Workflow:**
1. Consult **communication_guide.md** for principles
2. Review **branding_communication_update_2025_11_02.md** for context
3. Apply core principles (Verifiable > Impressive, etc.)

**Primary file:**
- `communication_guide.md` (authoritative reference)

### For Profile Updates

**Workflow:**
1. Review **communication_guide.md** for new learnings
2. Update **upwork_profile.txt**
3. Sync to Upwork manually

**Primary files:**
- `communication_guide.md` - Source of truth
- `upwork_profile.txt` - Production text

---

## Single Source of Truth Principle

**To avoid future duplicates:**

1. **One authoritative guide**: `communication_guide.md`
   - All other docs reference this
   - Updates go here first

2. **One framework document**: `proposal_framework.md`
   - Structure and guidelines
   - References templates folder

3. **Separate ready-to-use templates**: `proposal_templates/`
   - Copy-paste ready
   - Detailed examples
   - References framework for guidelines

4. **One index**: `README.md`
   - Navigation hub
   - Quick references
   - Links to all docs

---

## File Sizes (Reference)

```
communication_guide.md           17K  (513 lines) ⭐ Primary
proposal_framework.md            14K  (~400 lines)
proposal_templates/README.md      6K  (220 lines)
proposal_templates/process-*      9K  (280-316 lines each)
branding_*_update_*.md            9K  (summary)
README.md                        11K  (330 lines)
upwork_profile.txt                6K  (187 lines)
```

---

## Update Protocol

**When adding new learnings:**

1. **Update communication_guide.md** first
   - Add to appropriate section
   - Update examples

2. **If affects proposals:**
   - Update proposal_framework.md
   - Update templates if needed

3. **If affects profile:**
   - Update upwork_profile.txt

4. **Update README.md** if structure changes

5. **Create dated summary** like `branding_communication_update_YYYY_MM_DD.md`

6. **Commit with context** explaining what changed and why

**Don't create:**
- New branding guides (update existing)
- New communication guides (update existing)
- Duplicate templates (update existing or add to templates/)

---

## Quick Navigation

### I need to...

**Write a proposal:**
→ `proposal_templates/README.md` (decision tree)
→ `proposal_templates/process-*.md` (templates)
→ `communication_guide.md` Section 2 (client types)

**Update profile:**
→ `communication_guide.md` (review changes)
→ `upwork_profile.txt` (update text)

**Understand recent changes:**
→ `branding_communication_update_2025_11_02.md`
→ `README.md` "Recent Major Update" section

**Find quick reference:**
→ `README.md` "Quick Reference" section
→ `communication_guide.md` Section headers

**Check team responsibilities:**
→ `README.md` "Team Responsibilities"

---

## Archive Location

**Old versions moved to:**
`/docs/archive/2025_11_02_consolidation/`

**Contains:**
- `branding_communication_guide.md` (Version 1 from /docs/)
- `branding_quick_reference.md` (Version 1 from /docs/)
- `branding_communication_guide.md` (Version 2 from /docs/marketing/)

**Reason for archiving:**
- Superseded by communication_guide.md
- Content preserved for reference
- Prevents confusion from multiple versions

---

## Core Principles (Preserved Across All Versions)

1. **Verifiable > Impressive** — Proof beats promises
2. **Specific > General** — "1.1k stars" beats "experienced"
3. **Transparent > Perfect** — Show AI tooling, don't hide it
4. **Deliverables > Process** — Lead with code for skeptical clients
5. **Preempt > React** — Answer "the catch" before they ask
6. **Adapt > Template** — Detect client type, adjust accordingly

**The Meta-Lesson:**
"Same substance, different packaging = 10x difference in trust"

**Brand Promise:**
"You'll know if we're good before you pay"

---

**Last Updated:** 2025-11-02
**Maintained By:** Rafael (strategy), Emma (execution)
**Next Review:** After 20 proposals using consolidated structure
