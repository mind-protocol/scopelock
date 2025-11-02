# ScopeLock Documentation

**Purpose:** Central documentation hub for ScopeLock methodology, branding, and portfolio.

---

## Directory Structure

```
/docs/
├── README.md (you are here)
├── branding_communication_guide.md    # Full branding & client persona guide
├── branding_quick_reference.md        # Fast lookup for proposal writing
├── portfolio/                         # Past projects with proof points
│   ├── README.md
│   ├── kinos/
│   ├── mindprotocol/
│   ├── serenissima/
│   ├── therapykin/
│   ├── kinkong/
│   ├── duoai/
│   └── terminal-velocity/
├── marketing/
│   └── upwork_profile.txt            # Full Upwork profile text
├── core/                             # Core ScopeLock methodology docs
├── design/                           # Visual design, blog system
└── archive/                          # Historical/deprecated docs
```

---

## Quick Navigation

### For Proposal Writing (Emma)

1. **Client persona detection** → `branding_quick_reference.md`
2. **Portfolio match** → `portfolio/README.md`
3. **Full branding guide** → `branding_communication_guide.md`

### For Profile Updates

- **Upwork profile** → `marketing/upwork_profile.txt`
- **Portfolio projects** → `portfolio/[project-name]/quick-reference.md`

### For Process Documentation

- **Core methodology** → `core/` (ScopeLock principles)
- **Team structure** → See `/citizens/CLAUDE.md` at repo root

---

## Key Documents

### Branding & Communication

**`branding_communication_guide.md`** (16KB, comprehensive)
- Client personas (process-skeptical vs process-friendly)
- The Discovery Principle (let them find, don't tell)
- Terminology strategy (when to use "Evidence Sprint" vs "Milestone 1")
- Proof architecture (verification hierarchy)
- "What's the catch?" technique
- AI tooling disclosure strategy
- Proposal structure templates
- Pre-send checklist

**`branding_quick_reference.md`** (fast lookup)
- Quick client type detection
- Terminology map
- Proof links template
- "What's the catch?" copy-paste
- Signature variations
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

1. Check `/portfolio/README.md` to match job post to project
2. Use `branding_quick_reference.md` to detect client type
3. Apply correct terminology (skeptical vs friendly)
4. Include proof links (both GitHubs + relevant portfolio project)
5. Run pre-send checklist
6. Save to `/citizens/emma/proposals/YYYY-MM-DD_platform_title.txt`

### Updating Portfolio

When completing a client project:
1. Create folder: `/portfolio/[project-name]/`
2. Write `overview.md` (technical depth)
3. Write `quick-reference.md` (proposal snippets)
4. Add to `portfolio/README.md` with "Use when" guidance

### Branding Evolution

When discovering new friction patterns:
1. Document in `branding_communication_guide.md`
2. Update `branding_quick_reference.md` if it affects fast decisions
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
