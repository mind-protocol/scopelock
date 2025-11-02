# ScopeLock Logo & Brand Assets

**Version:** 1.0
**Created:** 2025-11-02
**Designer:** Maya Vieira (The Facet)

## Logo System

The ScopeLock brand uses a clean, technical aesthetic built on our dark design tokens. The core identity is a **checkmark [✓]** in a soft square, representing verified delivery and locked acceptance criteria.

### Core Components

**Wordmark:** "ScopeLock" in Inter Bold (700), letter-spacing −0.5
**Mark:** Soft square (10px radius) with centered checkmark stroke
**Colors:** Default uses `--slk-accent` (#1EE5B8), success uses `--slk-success` (#5CE27E)

### Files & Usage

#### Primary Assets
- `scopelock-wordmark.svg` - Horizontal wordmark (180×32)
- `scopelock-wordmark-accent.svg` - Accent variant for CTA contexts
- `scopelock-mark.svg` - Standalone checkmark mark (32×32)
- `scopelock-mark-success.svg` - AC green celebration variant
- `scopelock-lockup.svg` - Mark + wordmark horizontal (224×32)

#### Web Assets
- `/favicon.svg` - Browser favicon (checkmark mark)
- `/og-scopelock.svg` - Open Graph image template (1200×630)

### Design Tokens

```css
--slk-text: #E6EAF2      /* Wordmark default */
--slk-accent: #1EE5B8     /* Check stroke */
--slk-accent-2: #64A8FF   /* CTA variant */
--slk-success: #5CE27E    /* AC green variant */
--slk-surface: #151A21    /* Mark background */
```

### Spacing & Sizing

**Minimum sizes:**
- Wordmark: 24px cap height (desktop), 18px (mobile)
- Mark: 16px (maintains check legibility)

**Clearspace:** Equal to cap height of "S" on all sides

**Lockup gap:** 12px between mark and wordmark at 24px base size

### Color Usage Rules

✓ **Do:**
- Use design tokens only
- Maintain AA contrast on dark backgrounds
- Keep check stroke clean and visible

✗ **Don't:**
- Add gradients, glows, or shadows
- Swap checkmark for lock icon
- Use colors outside the token palette

### Accessibility

- **Contrast:** AA compliant on `--slk-bg` and `--slk-surface`
- **Alt text:** "ScopeLock" (wordmark), "ScopeLock verified" (mark)
- **Focus states:** 2px outline with 4px offset

### Integration

The logo is wired into `/src/app/layout.tsx` as part of the site navigation. The favicon and OG image are automatically referenced via Next.js metadata.

```tsx
// Navigation logo
<img
  src="/brand/logo/scopelock-lockup.svg"
  alt="ScopeLock"
  width="224"
  height="32"
/>
```

### Performance

- **SVG only** (no raster fallbacks needed for web)
- Inline in HTML or served statically
- No runtime fetches
- Total logo asset size: <10KB

### Verification

- ✓ Contrast AA verified
- ✓ Favicon wired
- ✓ OG image present
- ✓ Lighthouse ≥90 maintained

---

**Next steps:** Export PNG variants at 48px, 96px, 192px if native app assets are needed. Current web deployment uses SVG exclusively.
