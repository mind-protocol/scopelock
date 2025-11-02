# ScopeLock Blog Visual System

**Version:** 1.0
**Last Updated:** 2025-11-02
**Purpose:** Design system for visually distinct, engaging blog posts

---

## Core Principle

**Each post has a unique visual identity that matches its content and emotional tone.**

**Not a template system.** Each post is a custom visual experience designed for its specific content, audience, and message.

---

## Architecture

### Source of Truth: Markdown

**All posts exist as `.md` files** in `docs/marketing/blog/`

**MD Structure:**
```markdown
---
title: Post Title
category: Case Study | Technical | Concept
visualTheme: consciousness | precision | evolution | emergence
primaryColor: #1EE5B8 | #64A8FF | #5CE27E
interactiveElements: [graph, timeline, metrics, code]
---

# Content in standard markdown

## Sections with H2 headers

Regular paragraphs, code blocks, lists, etc.
```

**Frontend reads MD** → Renders with custom visual treatment per post

---

## Visual Identity Per Post Type

### Case Study Posts (e.g., La Serenissima)

**Visual Theme:** "Consciousness" — flowing, organic, interconnected

**Layout Approach:**
- Hero: Full-screen immersive with animated background (particles, network graph)
- Metrics: Large animated counters (97+ agents, 99.7% uptime)
- Architecture: Interactive diagram (hover reveals layers)
- Code: Syntax-highlighted with annotations that appear on scroll
- Sections: Alternating full-width and constrained (rhythm)

**Dynamic Elements:**
- Live agent count from serenissima.ai API (if available)
- Animated graph visualization (nodes = agents, edges = relationships)
- Scroll-triggered metric reveals
- Expandable code blocks with line-by-line explanation
- Timeline with parallax scrolling

**Color Palette:**
- Primary: `#1EE5B8` (accent) — consciousness, emergence
- Secondary: `#64A8FF` (accent-2) — intelligence, connection
- Backgrounds: Dark gradients with subtle animation

**Typography:**
- Headers: Large, bold, cinematic (clamp 48-72px)
- Body: Comfortable reading (18-20px)
- Code: JetBrains Mono with custom theme

**Example Visual Hierarchy:**
```
[Full-screen hero with animated network graph]
  ↓ scroll ↓
[Metrics grid - 3 columns, animated counters]
  ↓
[Challenge section - full-width with parallax image]
  ↓
[Architecture diagram - interactive SVG]
  ↓
[Code example - scroll-triggered annotations]
  ↓
[Results - animated charts]
```

---

### Technical Deep-Dive Posts (e.g., "Fail-Loud")

**Visual Theme:** "Precision" — structured, diagrammatic, clarity

**Layout Approach:**
- Hero: Split-screen (code left, explanation right)
- Diagrams: Technical schematics (SVG, interactive)
- Code: Side-by-side comparison (bad vs good)
- Flow: Vertical with clear section divisions

**Dynamic Elements:**
- Live code execution (RunKit embed or similar)
- Interactive flow diagrams (click path to see data flow)
- Before/after comparison sliders
- Collapsible detailed explanations
- Hover tooltips on technical terms

**Color Palette:**
- Primary: `#64A8FF` (accent-2) — logic, precision
- Secondary: `#5CE27E` (success) — correct patterns
- Danger: `#FF5D5D` — anti-patterns
- Backgrounds: Clean, structured (grid overlay subtle)

**Typography:**
- Headers: Technical, precise (clamp 36-52px)
- Body: Clear, instructional (17-19px)
- Code: Prominent, easy to scan

**Example Visual Hierarchy:**
```
[Split hero - code + title]
  ↓
[Problem diagram - interactive SVG]
  ↓
[Side-by-side code comparison]
  ↓
[Flow chart - clickable nodes]
  ↓
[Implementation guide - step cards]
```

---

### Concept Posts (e.g., "Why AC Beat Time Estimates")

**Visual Theme:** "Evolution" — progression, transformation, clarity

**Layout Approach:**
- Hero: Conceptual illustration (custom per post)
- Comparisons: Side-by-side tables, visual scales
- Examples: Card-based scenarios
- Flow: Narrative, story-driven

**Dynamic Elements:**
- Interactive comparison sliders (AC vs time estimates)
- Animated infographics (concepts illustrated)
- Expandable examples (real scenarios)
- Quiz/poll elements (engage reader)
- Progress indicator (reading progress bar)

**Color Palette:**
- Primary: `#FFC857` (warning) — challenge, friction
- Secondary: `#5CE27E` (success) — solution, clarity
- Backgrounds: Gradients that shift as you scroll

**Typography:**
- Headers: Narrative, engaging (clamp 40-60px)
- Body: Conversational, accessible (18-20px)
- Callouts: Emphasis boxes with icons

**Example Visual Hierarchy:**
```
[Conceptual hero illustration]
  ↓
[The Problem - dark background, frustration visuals]
  ↓
[Interactive comparison - drag slider]
  ↓
[Solution - bright, clear visuals]
  ↓
[Examples - card grid, clickable]
  ↓
[CTA - prominent, action-focused]
```

---

### Process Posts (e.g., "Inside the Proof Log")

**Visual Theme:** "Emergence" — step-by-step, revelation, transparency

**Layout Approach:**
- Hero: Visual metaphor (lock → unlock, seed → tree)
- Steps: Large numbered sections with visuals
- Behind-the-scenes: Screenshots, real artifacts
- Flow: Sequential, building understanding

**Dynamic Elements:**
- Step-by-step animations (watch process unfold)
- Real examples embedded (actual /proof entries)
- Interactive walkthroughs (try it yourself)
- Code snippets that run live
- Expandable "how it works" sections

**Color Palette:**
- Primary: `#1EE5B8` (accent) — transparency, proof
- Secondary: `#9AA3AE` (muted) — subtle, supportive
- Backgrounds: Light to dark gradient (revelation)

**Typography:**
- Headers: Clear, instructional (clamp 38-56px)
- Body: Explanatory, detailed (17-19px)
- Steps: Large, prominent numbers

**Example Visual Hierarchy:**
```
[Visual metaphor hero - animated]
  ↓
[Step 1 - full-width, large number, visual]
  ↓
[Step 2 - alternating layout]
  ↓
[Step 3 - with embedded example]
  ↓
[Behind-the-scenes - screenshot gallery]
  ↓
[Try it - interactive demo]
```

---

## Visual Component Library

### Dynamic Elements Catalog

**1. Animated Metrics**
- Use: Case studies, results sections
- Behavior: Count up on scroll into view
- Example: `97+` starts at 0, counts up to 97
- Tech: Intersection Observer + requestAnimationFrame

**2. Interactive Graphs**
- Use: Architecture explanations, relationships
- Behavior: Hover node → highlight connections
- Example: Agent network (nodes = agents, edges = interactions)
- Tech: D3.js or custom SVG + CSS

**3. Code Comparisons**
- Use: Technical posts, before/after
- Behavior: Side-by-side or toggle
- Example: Silent fallback (bad) vs fail-loud (good)
- Tech: Syntax highlighting + custom layout

**4. Scroll-Triggered Animations**
- Use: All posts, reveal content
- Behavior: Fade in, slide in, parallax
- Example: Sections appear as you scroll
- Tech: Intersection Observer + CSS transforms

**5. Expandable Sections**
- Use: Detailed explanations, optional depth
- Behavior: Click to expand/collapse
- Example: "Technical details (click to expand)"
- Tech: Details/summary or custom accordion

**6. Live Data Embeds**
- Use: Current proof, real-time metrics
- Behavior: Fetch latest data, display
- Example: "97+ agents online right now"
- Tech: Fetch API + loading states

**7. Interactive Diagrams**
- Use: Architecture, flow explanations
- Behavior: Click/hover to reveal layers
- Example: ScopeLock → Evidence Sprint → AC green
- Tech: SVG + event handlers

**8. Comparison Sliders**
- Use: Before/after, A vs B
- Behavior: Drag to reveal comparison
- Example: Time estimate approach vs AC approach
- Tech: CSS clip-path + drag events

**9. Progress Indicators**
- Use: Long posts, reading progress
- Behavior: Fill as you scroll
- Example: 45% through article
- Tech: Scroll position calculation

**10. Embedded Demos**
- Use: Process explanations, proofs
- Behavior: Real working example
- Example: Actual /proof entry rendered
- Tech: Iframe or component embed

---

## Design System Tokens

### Flexible Per-Post Palette

**Each post defines:**
```typescript
interface PostVisualConfig {
  // Core identity
  visualTheme: 'consciousness' | 'precision' | 'evolution' | 'emergence';
  primaryColor: string;  // Override accent color
  secondaryColor?: string;

  // Layout
  heroStyle: 'fullscreen' | 'split' | 'illustration' | 'minimal';
  sectionLayout: 'alternating' | 'centered' | 'fullwidth' | 'grid';

  // Typography scale
  headerScale: 'cinematic' | 'technical' | 'narrative' | 'instructional';

  // Interactive elements
  interactiveElements: Array<
    'graph' | 'metrics' | 'code' | 'timeline' | 'diagram' |
    'comparison' | 'demo' | 'quiz' | 'slider'
  >;

  // Animations
  animationStyle: 'organic' | 'precise' | 'playful' | 'subtle';

  // Special features
  features?: {
    liveData?: boolean;
    parallax?: boolean;
    darkMode?: 'force' | 'toggle' | 'auto';
  };
}
```

---

### Consistent Brand Elements (Across All Posts)

**Always Present:**
- ScopeLock logo (top left)
- Navigation (minimal, unobtrusive)
- Footer with CTA (standard across posts)
- Typography base (Inter + JetBrains Mono)
- Core colors available (brand palette)

**Variable Per Post:**
- Hero treatment
- Section layouts
- Color emphasis
- Interactive elements
- Pacing and rhythm
- Visual metaphors

---

## Implementation Approach

### Custom Component Per Post

**Not:** `BlogPost` component that renders all posts the same

**Instead:** Custom page component per post

**File Structure:**
```
src/app/blog/
├── la-serenissima/
│   ├── page.tsx           # Custom page for this post
│   ├── HeroSection.tsx    # Animated network graph hero
│   ├── MetricsGrid.tsx    # Animated counters
│   ├── ArchDiagram.tsx    # Interactive architecture
│   └── styles.module.css  # Post-specific styles
├── fail-loud/
│   ├── page.tsx           # Different custom page
│   ├── CodeComparison.tsx # Side-by-side code
│   ├── FlowDiagram.tsx    # Interactive flow
│   └── styles.module.css  # Different styles
└── ac-vs-estimates/
    ├── page.tsx           # Another unique page
    ├── ComparisonSlider.tsx
    └── styles.module.css
```

**Shared:**
```
src/components/blog/
├── AnimatedMetric.tsx     # Reusable counter
├── CodeBlock.tsx          # Syntax highlighting
├── ScrollReveal.tsx       # Intersection observer wrapper
├── InteractiveGraph.tsx   # D3 graph base
└── ExpandableSection.tsx  # Accordion component
```

**MD as Source:**
- MD file defines content + visual config (frontmatter)
- Custom component reads MD, applies unique visual treatment
- Shared primitives, unique composition

---

## Design Process Per Post

### Step 1: Content Analysis (10 min)

**Questions:**
- What's the emotional tone? (Technical, narrative, dramatic, instructional)
- What's the key insight? (Visual metaphor opportunity)
- What data/metrics? (Animated counters, charts)
- What concepts need diagrams? (Interactive opportunities)

**Output:** Visual theme + primary color + hero style

---

### Step 2: Layout Sketch (15 min)

**Wireframe sections:**
- Hero treatment (fullscreen? split? illustration?)
- Section rhythm (alternating? centered? fullwidth?)
- Key visual moments (diagram, comparison, reveal)
- Interactive elements placement

**Output:** Section sequence with visual treatment notes

---

### Step 3: Component Selection (10 min)

**From component library:**
- Which shared components? (AnimatedMetric, CodeBlock, etc.)
- Which need custom? (Unique diagram, specific animation)
- Which interactions? (Hover, click, scroll-triggered)

**Output:** Component list + customization notes

---

### Step 4: Build Custom Page (2-4 hours)

**Implementation:**
- Create `/blog/[post-slug]/page.tsx`
- Import shared components
- Build custom components
- Compose unique layout
- Add post-specific styles
- Test interactions + responsiveness

**Output:** Custom blog post page

---

### Step 5: Polish & Accessibility (30 min)

**Checks:**
- Keyboard navigation works for all interactive elements
- Screen reader labels on diagrams/graphs
- Reduced motion respects prefers-reduced-motion
- Loading states for dynamic content
- Lighthouse score ≥90

**Output:** Production-ready post

---

## Examples: Visual Treatments

### La Serenissima Case Study

**Visual Identity:**
```typescript
{
  visualTheme: 'consciousness',
  primaryColor: '#1EE5B8',
  heroStyle: 'fullscreen',
  sectionLayout: 'alternating',
  headerScale: 'cinematic',
  interactiveElements: ['graph', 'metrics', 'timeline', 'code'],
  animationStyle: 'organic',
  features: {
    liveData: true,
    parallax: true,
    darkMode: 'force'
  }
}
```

**Hero Treatment:**
```tsx
// Custom hero with animated particle network
<HeroSection className="h-screen relative overflow-hidden">
  <ParticleNetwork
    nodes={97}
    animate={true}
    theme="consciousness"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-7xl font-bold">
      La Serenissima
    </h1>
    <AnimatedMetric
      value={97}
      suffix="+ agents"
      duration={2000}
    />
  </div>
  <ScrollIndicator />
</HeroSection>
```

**Metrics Section:**
```tsx
<MetricsGrid className="py-24">
  <AnimatedMetric
    label="Agents"
    value={97}
    suffix="+"
    color="#1EE5B8"
  />
  <AnimatedMetric
    label="Uptime"
    value={99.7}
    suffix="%"
    color="#5CE27E"
  />
  <AnimatedMetric
    label="Updates/Hour"
    value={50000}
    suffix="+"
    color="#64A8FF"
  />
</MetricsGrid>
```

**Architecture Section:**
```tsx
<ArchitectureSection>
  <InteractiveDiagram
    layers={['Application', 'Substrate', 'Infrastructure']}
    onHover={(layer) => highlightConnections(layer)}
    style="organic"
  />
</ArchitectureSection>
```

---

### "Why AC Beat Time Estimates" (Concept Post)

**Visual Identity:**
```typescript
{
  visualTheme: 'evolution',
  primaryColor: '#FFC857',
  secondaryColor: '#5CE27E',
  heroStyle: 'illustration',
  sectionLayout: 'centered',
  headerScale: 'narrative',
  interactiveElements: ['comparison', 'slider', 'quiz'],
  animationStyle: 'playful'
}
```

**Hero Treatment:**
```tsx
// Conceptual illustration: hourglass → checkbox
<HeroSection className="h-[80vh] bg-gradient-to-b from-[#0E1116] to-[#1B222C]">
  <ConceptualIllustration>
    <AnimatedTransform
      from={<Hourglass />}
      to={<CheckboxGreen />}
      duration={3000}
      trigger="auto"
    />
  </ConceptualIllustration>
  <h1>Why Acceptance Criteria Beat Time Estimates</h1>
</HeroSection>
```

**Problem Section:**
```tsx
// Dark, frustration visuals
<ProblemSection className="bg-[#FF5D5D]/10 py-24">
  <h2>"It'll take 2 weeks"</h2>
  <FrustrationVisual>
    <TimelineGrowth
      estimate={2}
      actual={8}
      animate={true}
    />
  </FrustrationVisual>
  <p>That "2 weeks" became 2 months. Here's why...</p>
</ProblemSection>
```

**Comparison Section:**
```tsx
// Interactive slider
<ComparisonSection>
  <ComparisonSlider
    before={{
      title: "Time Estimate Approach",
      visual: <TimeEstimateVisual />,
      problems: ['Vague', 'Incentivizes slow work', 'No completion signal']
    }}
    after={{
      title: "Acceptance Criteria Approach",
      visual: <ACVisual />,
      benefits: ['Specific', 'Tests define done', 'Clear signal']
    }}
  />
</ComparisonSection>
```

---

### "Fail-Loud" (Technical Deep-Dive)

**Visual Identity:**
```typescript
{
  visualTheme: 'precision',
  primaryColor: '#64A8FF',
  heroStyle: 'split',
  sectionLayout: 'fullwidth',
  headerScale: 'technical',
  interactiveElements: ['code', 'diagram', 'demo'],
  animationStyle: 'precise'
}
```

**Hero Treatment:**
```tsx
// Split-screen: code + title
<HeroSection className="h-screen grid grid-cols-2">
  <CodePanel>
    <CodeBlock
      language="typescript"
      code={silentFallbackExample}
      highlightLines={[5, 6, 7]}
      annotations={{
        5: 'Silent catch - hides the error'
      }}
    />
  </CodePanel>
  <TitlePanel>
    <h1>Fail-Loud</h1>
    <p>Why we don't catch errors silently</p>
  </TitlePanel>
</HeroSection>
```

**Comparison Section:**
```tsx
// Side-by-side code
<CodeComparisonSection>
  <CodeComparison
    bad={{
      title: "Silent Fallback (Bad)",
      code: silentFallbackCode,
      problems: ['Hides errors', 'No visibility', 'Production surprises']
    }}
    good={{
      title: "Fail-Loud (Good)",
      code: failLoudCode,
      benefits: ['Errors visible', 'Fail in staging', 'Production safe']
    }}
  />
</CodeComparisonSection>
```

**Flow Diagram:**
```tsx
// Interactive flow
<FlowSection>
  <InteractiveFlow
    nodes={[
      { id: 'error', label: 'Error Occurs' },
      { id: 'catch', label: 'Catch Block' },
      { id: 'silent', label: 'Silent Return' },
      { id: 'emit', label: 'Emit failure.emit' }
    ]}
    paths={[
      { from: 'error', to: 'catch' },
      { from: 'catch', to: 'silent', style: 'bad' },
      { from: 'catch', to: 'emit', style: 'good' }
    ]}
    onClick={(node) => showExplanation(node)}
  />
</FlowSection>
```

---

## Responsive Strategy

### Mobile Adaptations

**General Principles:**
- Simplify interactions (tap vs hover)
- Stack layouts (side-by-side → vertical)
- Reduce animations (performance + battery)
- Larger touch targets (44px minimum)

**Per Visual Theme:**

**Consciousness (e.g., La Serenissima):**
- Particle count reduced (97 → 20 on mobile)
- Parallax disabled (scroll performance)
- Metrics stack vertically
- Interactive graph: tap to select node

**Precision (e.g., Fail-Loud):**
- Code: horizontal scroll (preserve formatting)
- Split-screen → stacked
- Diagrams: simplified or progressive reveal
- Comparison: tabs instead of side-by-side

**Evolution (e.g., AC vs Estimates):**
- Comparison slider → before/after tabs
- Illustrations scale down
- Card grids: 1 column
- Expandable sections for depth

---

## Performance Budget

**Per Post:**
- Initial load: <100KB HTML/CSS
- JavaScript: <200KB (code splitting)
- Images: WebP/AVIF, lazy loading
- Animations: CSS > JS (GPU acceleration)
- Lighthouse: ≥90 all categories

**Interactive Elements:**
- Defer non-critical (below fold)
- Intersection Observer for reveal
- RequestAnimationFrame for smooth
- Debounce scroll/resize handlers

---

## Accessibility Requirements

**Every Post Must:**
- Keyboard navigation for all interactions
- Screen reader labels on diagrams/graphs
- Focus indicators (visible, high contrast)
- Respect prefers-reduced-motion
- ARIA roles on custom elements
- Alt text on all visuals
- Color contrast ≥AA (WCAG)

**Interactive Elements:**
- Tab order logical
- Escape key closes expanded sections
- Arrow keys navigate diagrams
- Enter/Space activate buttons
- Focus trap in modals

---

## Quality Checklist

**Before Publishing:**

- [ ] Custom visual treatment designed
- [ ] Hero section unique and engaging
- [ ] Interactive elements working
- [ ] Metrics/data accurate and live (if applicable)
- [ ] Code examples syntax-highlighted
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Keyboard navigation complete
- [ ] Screen reader tested
- [ ] Reduced motion fallbacks
- [ ] Lighthouse ≥90
- [ ] Load time <3s (3G)
- [ ] Images optimized (WebP/AVIF)
- [ ] Internal links working
- [ ] CTA prominent and clear

---

## Summary

**Each post is a custom visual experience:**
- MD source of truth (content + config)
- Custom page component per post
- Shared primitives, unique composition
- Visual identity matches content tone
- Interactive elements enhance understanding
- Responsive, accessible, performant

**Not a template. A design system for unique posts.**

---

**Next:** Implement La Serenissima custom blog page with animated network hero, metrics counters, and interactive architecture diagram.
