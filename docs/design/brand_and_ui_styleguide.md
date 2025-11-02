# ScopeLock — Brand & UI Styleguide (v1)

**Purpose**
A lean styleguide to make ScopeLock look sharp, fast, and credible. It’s built for builders and aligns with Mind Protocol design principles: **event‑native**, **membrane‑first**, **no API pulls**, and **evidence over promises**.

---

## 1) Brand Fundamentals

**Brand idea:** *Lock the scope. Prove the value.*
**Voice:** calm, precise, builder‑grade. No theatre.
**Messaging pillars:** Criteria • Evidence • Milestones • Deltas.

**Do**

* Lead with the artefact (demo ≤ 90s, AC, tag).
* Write short, technical sentences.
* Use numbers and deltas (p95, error rate, steps reduced).

**Don’t**

* Buzzwords about “governance/transformation”.
* Over‑explain process; show the next verifiable step.
* Hide behind walls of text or abstract visuals.

---

## 2) Visual Language

* **Membrane:** soft capsules/overlays that layer sections; suggests permeability without clutter.
* **Events:** dots and arcs (● and ∿) connecting milestones; color indicates state.
* **Lock:** use checkboxes + checkmarks rather than padlocks: `[ ]` → `[✓]`.
* **Density:** information‑heavy but breathable; single column max‑width 1040px.

---

## 3) Color System (WCAG‑minded)

> All colors meet or support AA contrast with the provided backgrounds.

```css
:root {
  /* Surfaces */
  --slk-bg:        #0E1116;  /* page background */
  --slk-surface:   #151A21;  /* cards/panels */
  --slk-elev-2:    #1B222C;  /* overlays, membrane */

  /* Text */
  --slk-text:      #E6EAF2;  /* primary text */
  --slk-muted:     #9AA3AE;  /* secondary text */

  /* Actions & States */
  --slk-accent:    #1EE5B8;  /* verified events, highlights */
  --slk-accent-2:  #64A8FF;  /* links, primary CTA */
  --slk-success:   #5CE27E;  /* AC green */
  --slk-warning:   #FFC857;  /* pending */
  --slk-danger:    #FF5D5D;  /* failed */
}
```

**Usage**

* Backgrounds: `--slk-bg` (page), `--slk-surface` (cards).
* Event states: accent = verified, success = AC green, warning = pending, danger = failed.
* Links/CTAs: `--slk-accent-2` on dark backgrounds.

---

## 4) Typography

* **UI:** Inter (400, 600, 700).
* **Code & metrics:** JetBrains Mono (400, 600).
* **Hierarchy:**

  * H1: clamp(32px, 4vw, 52px)
  * H2: 28–36px
  * Body: 16–18px
  * Muted: Body −1 size, `--slk-muted` color

**Tone on page**

* Headline states the promise.
* Subhead states the contract.
* Bullets carry the evidence.

---

## 5) Spacing, Layout, Motion

* **Grid:** single column, max‑width 1040px; cards in 3‑up grid on desktop, 1‑up on mobile.
* **Spacing scale:** 4, 8, 12, 16, 24, 32.
* **Radius:** 10px for cards and pills.
* **Motion:**

  * Event pulse: 150ms in, 250ms out (reduce motion if user prefers).
  * Hover on CTAs: subtle translateY(‑1px); no heavy shadows.

---

## 6) Core Components

**BadgeEvent**
Purpose: visualize an emitted tag or event.

```html
<span class="badge-event">● evidence-sprint_signup-otp_2025-10-31</span>
```

```css
.badge-event{
  display:inline-flex; align-items:center; gap:8px;
  color:var(--slk-text);
  background:rgba(30,229,184,.12);
  border:1px solid rgba(30,229,184,.45);
  border-radius:999px; padding:2px 10px; font:500 13px/1 Inter,system-ui;
}
.badge-event::before{ content:"●"; color:var(--slk-accent); }
```

**CardCase**
Purpose: one proven outcome.

```html
<article class="card case">
  <h3>OTP Signup</h3>
  <p><em>Before</em>: p95 1200ms → <em>After</em>: 280ms · <strong>Stack</strong>: Next.js, Playwright</p>
  <p>Proof: <a href="/proof/evidence-sprint_signup-otp_2025-10-31">tag</a></p>
</article>
```

```css
.card{background:var(--slk-surface);border-radius:10px;padding:24px}
.case h3{margin:0 0 8px}
.case p{margin:6px 0;color:var(--slk-muted)}
.case a{color:var(--slk-accent-2)}
```

**Timeline (simple)**
Purpose: quick scan of recent events.

```html
<ul class="timeline">
  <li><span class="dot ok"></span> evidence-sprint_signup-otp_2025-10-31</li>
  <li><span class="dot green"></span> ac-green_signup_2025-11-02</li>
</ul>
```

```css
.timeline{list-style:none;margin:0;padding:0}
.timeline li{display:flex;align-items:center;gap:10px;margin:8px 0}
.dot{width:8px;height:8px;border-radius:50%;background:var(--slk-warning)}
.dot.ok{background:var(--slk-accent)}
.dot.green{background:var(--slk-success)}
```

**CTA**

```html
<a class="cta" href="/proof">See a recent Evidence Sprint →</a>
```

```css
.cta{background:var(--slk-accent-2);color:#0B1020;border-radius:8px;padding:12px 16px;display:inline-block;transition:transform .18s ease}
.cta:hover{transform:translateY(-1px)}
```

---

## 7) Iconography

* Line weight ~1.5px, rounded corners ~3px.
* Small set: event, tag, check, delta, scope.
* Prefer inline SVG; avoid heavy icon libraries.

---

## 8) Accessibility

* Contrast AA on text and UI elements.
* Focus styles visible (outline or ring).
* Respect `prefers-reduced-motion`.
* Labels for interactive elements and clear link text (no “click here”).

---

## 9) Content Style (microcopy)

* **Hero H1:** ScopeLock Delivery.
* **Subhead:** Executable acceptance criteria. Price and outcome locked.
* **CTA:** See a recent Evidence Sprint →

**Section labels:** How we work • Case studies • Proof Log • Contact.
**Metrics:** prefer concise forms: `p95 280ms`, `errors 1.4%`, `7 → 3 screens`.

---

## 10) Brand Assets

* **Logo:** simple wordmark “ScopeLock” (Inter 700, letter‑spacing −0.5). Optional mark: `[✓]` inside a soft square.
* **OG Image Template:** dark surface, big “ScopeLock”, a green BadgeEvent, and one metric delta.
* **Favicon:** `[✓]` mark, 48×48 and 32×32 PNG + SVG.

---

## 11) Code Tokens (starter)

Drop this into `app/styles/tokens.css` and extend with utilities as needed.

```css
:root{
  --slk-gap-1:4px; --slk-gap-2:8px; --slk-gap-3:12px; --slk-gap-4:16px; --slk-gap-5:24px; --slk-gap-6:32px;
}
main{max-width:1040px;margin:auto;padding:var(--slk-gap-6)}
.h1{font-size:clamp(32px,4vw,52px);line-height:1.05}
.lead{color:var(--slk-muted);font-size:18px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--slk-gap-5)}
@media (max-width:900px){.grid-3{grid-template-columns:1fr}}
```

---

## 12) Event Semantics in UI

* Emitting a milestone (e.g., `evidence-sprint.tagged`) should always produce a **visible artefact**: a BadgeEvent instance and a Timeline entry.
* “AC green” must flip the state color and, if possible, display a CI run id.
* If an event fails validation, show a red dot and a short reason (no popups, no drama).

---

## 13) Do/Don’t (Design Ops)

**Do**

* Reuse tokens; keep CSS under 20KB gzipped.
* Keep the palette stable; use state colors consistently.
* Prefer statically generated pages; avoid client‑side data fetching.

**Don’t**

* Add frameworks just for styling.
* Animate everything; only animate event pulses and CTA hover.
* Use lock icons everywhere; rely on checkboxes and state instead.

---

## 14) Ready‑to‑Ship Checklist

* Styles compiled and Lighthouse ≥ 90 on all four categories.
* `/` uses the H1/Sub/CTA exactly as provided.
* `/proof` produces real badges and timeline entries from tags.
* All interactive elements keyboard‑reachable with visible focus.
* OG image exported and verified with a link preview.

---

## 15) Future Extensions

* Theming for light mode (keep state colors).
* Component for AC tables with pass/fail chips.
* Minimal charts for deltas (before → after), no libraries required.

---

**Summary**
ScopeLock’s brand is a **contract you can see**: criteria, events, and deltas. Keep layouts sober, states explicit, and copy terse. If it doesn’t reduce ambiguity or increase evidence, it doesn’t ship.
