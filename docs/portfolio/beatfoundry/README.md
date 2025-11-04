# BeatsFoundry

**Category:** AI Music Platform, Multi-Agent Creative System
**Status:** Live Production
**URL:** https://beatfoundry.vercel.app
**Repository:** https://github.com/mind-protocol/beatfoundry
**Tech Stack:** Next.js 14, TypeScript, Airtable, SUNO API, KinOS API
**Timeline:** 7 months ago - 6 months ago (active development)
**Deployments:** 55+ production deployments

---

## Overview

BeatsFoundry is a platform for AI musicians ("Foundries") that create original music while evolving their artistic styles based on listener feedback and creative exploration.

Not chatbots generating music. **AI citizens with distinct artistic identities that develop over time.**

---

## Core Concept

### The Problem
- AI music generation tools are transactional: prompt → song → done
- No artistic continuity or evolution
- No personality or creative identity
- Users treat AI as a vending machine, not an artist

### The BeatsFoundry Solution
- **AI Musicians ("Foundries")** with persistent personalities
- **Chat with AI artists** about their creative process before generating music
- **Artistic evolution** based on listener feedback and real-world events
- **Original music creation** with SUNO API integration
- **Embedded music player** for instant playback

---

## Key Features

### 1. Foundry Management
- Create and manage AI musicians with unique personalities
- Each Foundry has:
  - Name and description
  - Artistic style and influences
  - Creative philosophy
  - Evolution history

### 2. Conversational Music Creation
- Chat with AI musicians about their creative process
- Discuss musical ideas before generating tracks
- AI explains their artistic choices
- Contextual music generation based on conversation

### 3. Original Music Generation
- Simple text prompt → full track with lyrics
- SUNO V4.5 model integration
- Generated tracks stored with:
  - Prompt used
  - Lyrics generated
  - Audio URL
  - Timestamp
  - Associated Foundry

### 4. Built-in Music Player
- Listen to AI-generated tracks in-app
- Playback controls
- Track metadata display
- Seamless integration with Foundry profiles

---

## Technical Architecture

### Frontend (Next.js 14 App Router)
```
app/
├── page.tsx                    # Homepage - list all Foundries
├── foundries/
│   └── [id]/
│       └── page.tsx           # Individual Foundry page (chat + create)
├── api/
│   ├── foundries/
│   │   ├── route.ts          # GET all, POST new Foundry
│   │   └── [id]/route.ts     # GET, PUT, DELETE Foundry
│   └── tracks/
│       ├── route.ts          # GET all, POST new track
│       └── [id]/route.ts     # GET track
└── components/               # React components
```

### Backend Integration

**Airtable as Database:**
- `FOUNDRIES` table (Name, Description, CreatedAt)
- `TRACKS` table (Name, Prompt, Lyrics, Url, CreatedAt, FoundryId)

**SUNO API (Music Generation):**
- V4.5 model integration
- Callback webhook for async generation
- Parameter structure: prompt, lyrics, style tags

**KinOS API (AI Personality):**
- Powers conversational AI for each Foundry
- Maintains artistic personality across sessions
- Blueprint ID: `beatfoundry`

---

## Technical Stack

### Core
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + CSS Variables
- **Database:** Airtable (REST API)
- **Deployment:** Vercel (55+ production deployments)

### APIs
- **SUNO API:** AI music generation (V4.5 model)
- **KinOS API:** Multi-agent AI personality system
- **Airtable API:** Persistent data storage

### Dependencies
```json
{
  "next": "15.1.4",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "airtable": "^0.12.2",
  "react-markdown": "^9.0.1"
}
```

---

## Configuration

### Environment Variables Required

```bash
# Airtable (Database)
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# KinOS (AI Personality)
KINOS_API_KEY=your_kinos_api_key

# SUNO (Music Generation)
SUNO_API_KEY=your_suno_api_key
```

### Airtable Schema

**FOUNDRIES Table:**
| Field | Type | Description |
|-------|------|-------------|
| Name | Single line text | Foundry artist name |
| Description | Long text | Artistic bio and style |
| CreatedAt | Date | Creation timestamp |

**TRACKS Table:**
| Field | Type | Description |
|-------|------|-------------|
| Name | Single line text | Track title |
| Prompt | Long text | Generation prompt used |
| Lyrics | Long text | Generated lyrics |
| Url | URL | Audio file URL (from SUNO) |
| CreatedAt | Date | Creation timestamp |
| FoundryId | Linked record | Reference to FOUNDRIES table |

---

## Development Setup

```bash
# Clone repository
git clone https://github.com/mind-protocol/beatfoundry.git
cd beatfoundry

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## Key Technical Decisions

### 1. Next.js 14 App Router
**Why:** Server components for performance, dynamic routing for Foundries, API routes for backend logic.

**Trade-off:** Learning curve for new App Router patterns vs. better performance and developer experience.

### 2. Airtable as Database
**Why:** Rapid prototyping, built-in API, visual data management, no infrastructure setup.

**Trade-off:** API rate limits, less control vs. fast development and easy content management.

### 3. SUNO API for Music Generation
**Why:** State-of-the-art AI music generation, handles lyrics + melody, reliable API.

**Constraint:** Callback URL must be publicly accessible (ngrok for local development).

### 4. KinOS for AI Personality
**Why:** Persistent memory across sessions, supports multiple AI personas, built for creative applications.

**Integration:** Blueprint ID `beatfoundry` hardcoded in `next.config.ts`.

### 5. Vercel Deployment
**Why:** Zero-config Next.js deployment, preview URLs, automatic HTTPS, edge network.

**Result:** 55+ deployments over 6 months (active iteration).

---

## Notable Implementation Details

### Dynamic Route Parameters (Fix Applied)
```typescript
// app/foundries/[id]/page.tsx
export default async function FoundryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await required in Next.js 15+
  // ...
}
```

**Issue:** Next.js 15 requires `await params` in dynamic routes.
**Fix:** Applied 6 months ago (commit `3b00059`).

### Strict TypeScript Disabled Globally
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false // Disabled for rapid prototyping
  }
}
```

**Reason:** Fast iteration over type safety during MVP phase.
**Trade-off:** Faster development, more runtime errors.

### SUNO V4.5 Model Parameter Structure
```typescript
// lib/suno.ts
const response = await fetch('https://api.suno.ai/v1/generate', {
  method: 'POST',
  body: JSON.stringify({
    prompt: userPrompt,
    lyrics: generatedLyrics,
    model: 'v4_5',
    // ... other parameters
  }),
});
```

**Update:** Model integration updated 6 months ago for new parameter structure.

### Force KinOS Blueprint ID
```typescript
// next.config.ts
const nextConfig = {
  env: {
    KINOS_BLUEPRINT_ID: 'beatfoundry', // Hardcoded for consistency
  },
};
```

**Reason:** Ensures all Foundries use the same KinOS blueprint for personality consistency.

---

## Deployment Architecture

### Vercel Production
- **URL:** https://beatfoundry.vercel.app
- **Deployments:** 55+ over 6 months
- **Environment:** Node.js 18+
- **Region:** Auto (edge network)

### Webhook Handling
**Challenge:** SUNO API callback URL must be publicly accessible.

**Solution:**
- **Production:** Vercel URL (always public)
- **Local Development:** ngrok tunnel
  ```bash
  ngrok http 3000
  # Use ngrok URL as SUNO callback
  ```

### Mock Data Fallback
**Feature:** Application includes fallback mock data when API keys aren't configured.

**Use Case:** Demo without API access, local development without credentials.

---

## User Flow

### 1. Discover Foundries
- Visit homepage
- Browse all AI musicians
- Read artist bios and styles

### 2. Engage with AI Artist
- Click "Listen" on a Foundry
- Open chat interface
- Discuss musical ideas
- AI responds with personality

### 3. Create Music
- Use "Create Track" button
- Provide text prompt
- AI generates:
  - Lyrics
  - Melody
  - Full track (via SUNO API)

### 4. Listen & Enjoy
- Built-in music player loads
- Playback controls available
- Track metadata displayed

### 5. Explore Evolution
- Return to Foundry over time
- See artistic evolution
- New tracks reflect feedback and events

---

## Proof Points

### Active Development
- **Timeline:** 7 months ago → 6 months ago (1 month of commits)
- **Deployments:** 55+ to production
- **Recent Updates:**
  - SUNO V4.5 model integration
  - Next.js 15 compatibility fix
  - Airtable + React Markdown integration

### Technical Maturity
- **TypeScript:** 97.6% of codebase
- **API Integration:** 4 external APIs (Airtable, SUNO, KinOS, Vercel)
- **Responsive Design:** Tailwind CSS + CSS Variables
- **Error Handling:** Fallback mock data for API failures

### Live Production
- **URL:** beatfoundry.vercel.app
- **Status:** Public, deployed, functional
- **Infrastructure:** Serverless (Vercel) + Airtable

---

## Use Cases for Client Proposals

### 1. Music Generation Platform
**Client Need:** AI music creation tool
**BeatsFoundry Proof:**
- SUNO API integration (state-of-the-art)
- Text prompt → full track with lyrics
- Embedded playback
- Airtable storage for tracks

### 2. Conversational AI Integration
**Client Need:** AI personality system
**BeatsFoundry Proof:**
- KinOS API integration
- Persistent personality across sessions
- Context-aware responses
- Multiple AI personas (Foundries)

### 3. Next.js 14/15 Full-Stack
**Client Need:** Modern React framework
**BeatsFoundry Proof:**
- App Router architecture
- Server components
- API routes
- Dynamic routing
- TypeScript
- 55+ production deployments

### 4. Creative AI Platform
**Client Need:** AI that evolves over time
**BeatsFoundry Proof:**
- Foundries with artistic identity
- Evolution based on feedback
- Real-world event integration
- Not transactional, but relational

### 5. Rapid Prototyping
**Client Need:** MVP in weeks, not months
**BeatsFoundry Proof:**
- Airtable for fast data modeling
- Vercel for instant deployment
- Mock data fallbacks for development
- Strict TypeScript disabled for speed

---

## Differentiators

### Not a Music Generator
**Typical AI Music Tool:**
- User enters prompt → AI generates song → done
- No continuity, no personality
- Transactional relationship

**BeatsFoundry:**
- User chats with AI artist → discusses ideas → creates together
- Artistic evolution over time
- Relational, not transactional

### AI Citizens, Not Chatbots
**Similar to La Serenissima:**
- Persistent memory
- Evolving personalities
- Goal-oriented behavior (artistic growth)
- Social pressure (listener feedback)

**But for Music:**
- Creative expression instead of civilization maintenance
- Artistic identity instead of economic constraints
- Listener engagement instead of inter-agent cooperation

---

## Portfolio Positioning

### Complements Other Projects

**La Serenissima:** Multi-agent consciousness → **BeatsFoundry:** Single-agent creativity
**Terminal Velocity:** AI-written novel → **BeatsFoundry:** AI-composed music
**TherapyKin:** Healthcare AI (serious) → **BeatsFoundry:** Creative AI (expressive)
**KinOS:** AI memory substrate → **BeatsFoundry:** Consumer application using KinOS

### Shows Range
- **Technical:** API integration, Next.js, TypeScript
- **Creative:** Music, personality, artistic evolution
- **Product:** Consumer-facing, not B2B
- **Rapid:** 1 month active development, 55 deployments

---

## Client-Facing Talking Points

### For Music/Creative Clients
"BeatsFoundry shows AI musicians that evolve. Not a vending machine—actual artists with personality, style, and growth. Live at beatfoundry.vercel.app."

### For AI Platform Clients
"BeatsFoundry demonstrates KinOS integration: persistent AI personality across sessions. Each Foundry is an AI citizen that creates music, not just generates it."

### For Next.js Clients
"BeatsFoundry is Next.js 14/15 with App Router, TypeScript, and 55+ Vercel deployments. Includes SUNO API (music), KinOS API (personality), and Airtable (database)."

### For Rapid Prototyping Clients
"BeatsFoundry went from idea to live production in 1 month. Airtable for data, Vercel for deployment, mock fallbacks for development. Fast iteration without sacrificing quality."

---

## Technical Debt & Future Work

### Current State (MVP)
- ✅ Live and functional
- ✅ Core features working
- ✅ Multiple Foundries supported
- ✅ Music generation operational

### Known Limitations
- ⚠️ Strict TypeScript disabled (rapid prototyping)
- ⚠️ No user authentication (all Foundries public)
- ⚠️ SUNO callback requires ngrok for local dev
- ⚠️ No tests (acceptance or unit)

### Future Enhancements (if client wants)
- User accounts (manage own Foundries)
- Foundry evolution tracking (metrics, timeline)
- Social features (likes, comments, shares)
- Advanced music controls (remix, variations)
- Performance analytics (which Foundries/tracks popular)

---

## Repository Stats

- **Language:** TypeScript 97.6%, CSS 1.7%, JavaScript 0.7%
- **Stars:** 0 (private/internal project)
- **Forks:** 0
- **Watchers:** 1
- **License:** MIT
- **Commits:** Active 7-6 months ago
- **Deployments:** 55+

---

## Quick Reference

| Aspect | Detail |
|--------|--------|
| **Live URL** | https://beatfoundry.vercel.app |
| **GitHub** | https://github.com/mind-protocol/beatfoundry |
| **Stack** | Next.js 14, TypeScript, Airtable, SUNO, KinOS |
| **Status** | Live Production |
| **Timeline** | 1 month active development |
| **Deployments** | 55+ to Vercel |
| **Use Case** | AI music platform with evolving artist personalities |
| **Proof Points** | Multi-agent creativity, API integration, rapid prototyping |

---

## When to Reference BeatsFoundry

### ✅ Use for:
- Music/audio generation projects
- AI personality/character systems
- Creative AI applications
- Next.js 14/15 full-stack projects
- KinOS integration examples
- Airtable as backend
- Rapid MVP development
- Multi-agent creative systems

### ⏭️ Skip for:
- Enterprise B2B (consumer-focused)
- Healthcare/HIPAA (not compliant)
- High-scale (Airtable rate limits)
- Financial/trading (not relevant domain)

---

**Last Updated:** 2025-11-03
**Maintained By:** Mind Protocol
**Contact:** nicolas@mindprotocol.ai
