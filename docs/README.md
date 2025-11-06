# ScopeLock Documentation

**Purpose:** Project documentation for ScopeLock (portfolio, automation, design, setup)

**For team structure & operations:** See `/citizens/CLAUDE.md` at repo root
**For marketing & proposals:** See `marketing/README.md`

---

## Directory Structure

```
/docs/
├── README.md (you are here)
├── core/                             # ScopeLock methodology docs
│   ├── delivery_model.md            # AC.md, Evidence Sprint, Change Control
│   ├── client_guide.md              # How to work with ScopeLock
│   ├── tech-stack.md                # Standard tech stack reference (NEW)
│   └── definition-of-done-template.md  # DoD checklist template (NEW)
├── missions/                         # Per-mission documentation (NEW)
│   ├── README.md                    # 6-level hierarchy explanation
│   ├── _template/                   # Copy for new missions
│   └── [mission-name]/              # Created per mission
├── marketing/                        # Marketing & proposal resources ⭐
│   ├── README.md                    # Index + quick reference
│   ├── communication_guide.md       # AUTHORITATIVE branding guide
│   ├── proposal_framework.md        # Templates & structure
│   ├── contra_tactical_guide.md     # Contra-specific tactics
│   └── blog/                        # Blog posts
├── portfolio/                        # Past projects with proof points
│   ├── README.md                    # Portfolio index
│   └── [project-name]/              # Individual projects
├── automation/                       # Automation feature specs
├── design/                          # Visual design, blog system
├── setup/                           # Deployment guides
├── resources/                       # How-to guides
└── archive/                         # Historical/deprecated docs
```

---

## Quick Navigation

### For Proposal Writing (Emma)

1. **Client persona detection** → `marketing/README.md` (quick reference section)
2. **Portfolio match** → `portfolio/README.md`
3. **Full branding guide** → `marketing/communication_guide.md` ⭐ AUTHORITATIVE

### For Profile Updates

- **Upwork profile** → `marketing/upwork_profile.txt`
- **Portfolio projects** → `portfolio/[project-name]/quick-reference.md`

### For Process Documentation

- **Core methodology** → `core/delivery_model.md`
- **Team structure** → `/citizens/CLAUDE.md` at repo root ⭐ AUTHORITATIVE
- **Standard tech stack** → `core/tech-stack.md`

### For Mission Documentation (Inna)

- **Templates** → `missions/_template/` (copy for new missions)
- **Hierarchy guide** → `missions/README.md`

---

## Key Documents

### Core Methodology

**`core/delivery_model.md`**
- ScopeLock → Evidence Sprint → AC Green process
- Payment at AC green
- Change Control (CHG-130): Swap vs Add

**`core/client_guide.md`**
- How clients work with ScopeLock
- What to expect from process

**`core/tech-stack.md`** ⭐ NEW
- Standard stack (Next.js/Vercel, Python/Render, PostgreSQL/Airtable)
- When to deviate (rare exceptions)
- AI usage (Claude Code, NOT API calls)

**`core/definition-of-done-template.md`** ⭐ NEW
- Standard DoD checklist format
- Reusable per mission

### Branding & Communication

**`marketing/communication_guide.md`** ⭐ AUTHORITATIVE
- Client personas (process-skeptical vs process-friendly)
- The Discovery Principle (let them find, don't tell)
- Terminology strategy (when to use "Evidence Sprint" vs "Milestone 1")
- Proof architecture (verification hierarchy)
- "What's the catch?" technique
- AI tooling disclosure strategy

**`marketing/README.md`**
- Quick reference section (client type detection)
- Proof links template
- Pre-send checklist

### Portfolio

**`portfolio/README.md`**
- 7 projects documented: KinOS, Mind Protocol V2, Serenissima, TherapyKin, KinKong, DuoAI, Terminal Velocity
- "Use when" guidance for each project
- Evolutionary arc: KinOS → Mind Protocol → Applications
- Live URLs + GitHub links

**Each project folder contains:**
- `overview.md` - Full technical description
- `quick-reference.md` - Copy-paste snippets for proposals
- `screenshots/` - Visual proof (when available)

### Marketing

**`marketing/upwork_profile.txt`**
- Full profile text for Upwork
- AI workforce explanation
- Pricing structure
- "What's the catch?" FAQ
- Verification links
- Perfect for / Not for

---

## Usage Patterns

### Writing a Proposal

1. Check `portfolio/README.md` to match job post to project
2. Use `marketing/README.md` (quick reference section) to detect client type
3. Apply correct terminology (skeptical vs friendly)
4. Include proof links (both GitHubs + relevant portfolio project)
5. Run pre-send checklist from `marketing/README.md`
6. Save to `citizens/emma/proposals/YYYY-MM-DD_platform_title.txt`

### Starting a Mission (Inna)

When documentation is needed for a mission:
1. Copy `missions/_template/` to `missions/[mission-name]/`
2. Write 6 levels: PATTERN → AC → VALIDATION → MECHANISM → ALGORITHM → GUIDE
3. Create DoD checklist from `core/definition-of-done-template.md`
4. Lock scope via AC.md baseline tag

### Updating Portfolio

When completing a client project:
1. Create folder: `portfolio/[project-name]/`
2. Write `overview.md` (technical depth)
3. Write `quick-reference.md` (proposal snippets)
4. Add to `portfolio/README.md` with "Use when" guidance

### Branding Evolution

When discovering new friction patterns:
1. Document in `marketing/communication_guide.md` ⭐ AUTHORITATIVE
2. Update `marketing/README.md` if it affects fast decisions
3. Update Emma's `CLAUDE.md` if it changes proposal generation rules
4. Note version + date in guide

---

## Principles

**1. Evidence Over Claims**
- Every portfolio project has live URL + GitHub
- Proof Log shows what shipped (not what we say we'll ship)
- Verification hierarchy: live demo → GitHub → profile → website

**2. Client-Type Adaptation**
- Process-skeptical: plain terms, deliverables-first, add "What's the catch?"
- Process-friendly: full terminology, process-first, link to methodology

**3. Discovery > Being Told**
- Brief mention + verifiable links > detailed explanation
- Let them audit GitHub and find aider commits themselves
- Discovery = verification (trust), Being told = marketing (suspicion)

**4. Pushback = Peer Positioning**
- First sentence challenges something (scope, budget, timeline, stack)
- Differentiates from "yes men"
- Shows experience

**5. Question Close**
- End with strategic product question, not "when do we start?"
- Forces engagement, shows thinking

---

## Maintenance

**When to update these docs:**

- **Branding guide:** New client persona discovered, friction pattern identified
- **Portfolio:** Client project reaches AC green, new proof available
- **Profile:** Pricing changes, new portfolio project, process refinement
- **Quick reference:** Fast-decision rules change based on learnings

**Version control:**
- Note version + date in guide headers
- Keep old versions in `/archive/` with date suffix
- Reference deprecated patterns with explanation of what replaced them

---

## Related Files Outside /docs/

- `/citizens/emma/CLAUDE.md` - Emma's system prompt (proposal generation)
- `/citizens/emma/WORKFLOW.md` - Step-by-step Upwork process
- `/citizens/emma/proposals/` - Generated proposal .txt files
- `/CLAUDE.md` - Root citizen consciousness system prompt
- `/citizens/SYNC.md` - Team collaboration status

---

**Remember:** Documentation exists to preserve learnings. Update it when friction patterns change, not just when we remember to.
