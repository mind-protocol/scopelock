# ScopeLock Lite Version (Low-Bandwidth Access)

**Purpose:** Provide fast access to ScopeLock content for users on slow connections (2G/3G networks, high-latency regions like Nigeria).

**URL:** https://scopelock.mindprotocol.ai/lite.html

---

## Technical Specs

**File Size:** ~9 KB (HTML + inline CSS)
**Load Time on 2G:** <5 seconds
**Dependencies:** Zero (no JavaScript, no external stylesheets, no images)

---

## Content Included

All critical business content:
- Value proposition (pay only when tests pass)
- How we work (3-step process)
- Portfolio projects (Terminal Velocity, La Serenissima, TherapyKin)
- Pricing (Evidence Sprint, ScopeLock Mission, Multi-Milestone)
- FAQ (catch questions + technical FAQ)
- Contact information (email, cal.com, GitHub)

---

## What's Removed (for bandwidth)

- JavaScript (no LiveCommits, no ContactForm interactivity)
- External fonts (uses system fonts)
- SVG icons (text-only)
- Images
- React components
- External stylesheets (inline CSS only)

---

## Usage

### For Team Members

**When to share lite version:**
- Prospect mentions slow connection
- Working with clients in Nigeria, India, Philippines, remote areas
- Upwork job applications where bandwidth is a concern

**How to share:**
```
Full site: https://scopelock.mindprotocol.ai
Lite version (fast loading): https://scopelock.mindprotocol.ai/lite.html
```

### For Vercel Deployment

File is in `/public/lite.html` - automatically served at `/lite.html` route.

**To test locally:**
```bash
cd /home/mind-protocol/scopelock
npm run dev
# Visit: http://localhost:3000/lite.html
```

---

## Browser Recommendations (for low-bandwidth users)

**Best:** Opera Mini (server-side compression, reduces bandwidth by 90%)
- Download: https://www.opera.com/mobile/mini

**Alternative:** Lynx (text-only terminal browser)
```bash
sudo apt-get install lynx
lynx https://scopelock.mindprotocol.ai/lite.html
```

**Alternative:** w3m (text-only terminal browser)
```bash
sudo apt-get install w3m
w3m https://scopelock.mindprotocol.ai/lite.html
```

---

## Maintenance

**When to update:**
- Pricing changes → Update pricing section in lite.html
- Contact info changes → Update contact section
- New major portfolio projects → Add to "Proof in action" section
- Process changes → Update "How we work" section

**DO NOT add:**
- JavaScript dependencies
- External stylesheets or fonts
- Images or large media
- Complex animations or interactions

**Keep file size <15 KB total.**

---

## Analytics

Since lite version has no JavaScript, we cannot track:
- Page views (unless using server-side analytics)
- User interactions
- Conversion events

**Solution:** Add UTM parameters when sharing lite version:
```
https://scopelock.mindprotocol.ai/lite.html?utm_source=upwork&utm_medium=proposal&utm_campaign=nigeria
```

Vercel will log these in server access logs.

---

## Future Improvements

**Optional enhancements (only if needed):**
1. **Auto-detect slow connections** - Add small JS snippet to main site that redirects to /lite.html if connection speed < 500kbps
2. **AMP version** - Create Google AMP page for even faster mobile loading
3. **Service worker** - Cache lite.html for offline access

**Do NOT implement these unless users request them.** Simplicity is the feature.

---

**Created:** 2025-11-06
**Last Updated:** 2025-11-06
**Owner:** Rafael (team-wide maintenance)

rafael@scopelock
