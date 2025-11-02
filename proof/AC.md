# Acceptance Criteria — ScopeLock Website

**Milestone:** ScopeLock public website (scopelock.mindprotocol.ai)
**Type:** Evidence Sprint → AC Green
**Date:** 2025-11-02

---

## Functional Requirements

### F1. Core Pages
- ✅ Homepage with hero, process explanation, portfolio proof, contact
- ✅ /about — Team, Nicolas bio with portfolio, citizen roles, Mind Protocol context
- ✅ /pricing — Transparent tiers ($3k-$6k, $5k-$15k, $15k-$35k), payment structure, CHG-130
- ✅ /faq — 10+ common questions with clear answers
- ✅ /contact — Working Cal.com booking link, email, social handles
- ✅ /proof — Index page with build-time data fetching (ready for tags)
- ✅ /proof/[tag] — Dynamic detail pages for proof entries

### F2. Navigation & UX
- ✅ Site header with logo and nav links (Proof Log, Contact)
- ✅ Footer with social links (GitHub, LinkedIn, X, Telegram)
- ✅ All internal links working (no 404s)
- ✅ External links open in new tab with `rel="noopener"`

### F3. Content Quality
- ✅ No broken proof links (replaced placeholders with real portfolio)
- ✅ Portfolio proof visible: Terminal Velocity (1.1k stars), La Serenissima, UBC
- ✅ Working Cal.com booking: cal.com/lester-reynolds-ieksyx/30min
- ✅ Social handles present: @nlr_ai (X, Telegram), GitHub orgs linked

### F4. SEO & Metadata
- ✅ Proper page titles and descriptions
- ✅ OpenGraph metadata for social sharing
- ✅ sitemap.xml generated at build time
- ✅ robots.txt allowing indexing
- ✅ Favicon and brand assets

---

## Non-Functional Requirements

### NF1. Performance
- ✅ Build completes successfully (`npm run build`)
- ✅ First contentful paint < 2s (Next.js optimized)
- ✅ CSS modules (no runtime styled-jsx overhead)
- ✅ Static generation where possible

### NF2. Deployment
- ✅ Deployed to scopelock.mindprotocol.ai
- ✅ SSL valid (Vercel certificate)
- ✅ CI/CD passing (.github/workflows/ci.yml)
- ✅ No console errors on page load

### NF3. Code Quality
- ✅ TypeScript with strict mode
- ✅ Accessible HTML (semantic tags, ARIA labels)
- ✅ Responsive design (mobile-first)
- ✅ No linter errors

---

## Verification

### Acceptance Tests
```bash
npm install
npx playwright install --with-deps chromium
npm test
# ✅ All acceptance tests pass
```

Test coverage:
- F1: All 12 pages return HTTP 200
- F2: Navigation links present and functional
- F3: Cal.com booking link, portfolio proof, social handles
- F4: sitemap.xml, robots.txt, metadata, favicon
- NF2: Production SSL and no console errors

### Build Test
```bash
npm run build
# ✅ Build exits with code 0
```

### Deployment Test
```bash
curl -I https://scopelock.mindprotocol.ai
# ✅ Returns HTTP 200
# ✅ SSL certificate valid
```

---

## Acceptance Test Results

**Status:** ✅ AC GREEN (All criteria met)

**Verified:** 2025-11-02 18:55 UTC
**Commits:**
- aea9659: Next.js migration complete
- e0ff872: Portfolio + proof fixes
- caabb42: Cal.com + social handles
- 9f2ba8e: Documentation updated

**Production URL:** https://scopelock.mindprotocol.ai
