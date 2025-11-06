# Dependencies & Tech Stack - Mission Deck

**Part:** 7 of 7
**Created:** 2025-11-05
**Prerequisites:** [06_database_schema.md](./06_database_schema.md)

---

## Frontend Dependencies

### Required (Week 1)

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "@clerk/nextjs": "^4.29.0",             // Auth (or custom JWT)
    "react-markdown": "^9.0.0",             // Markdown rendering (chat)
    "react-syntax-highlighter": "^15.5.0",  // Syntax highlighting (code blocks)
    "zustand": "^4.4.7"                     // State management
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4"
  }
}
```

### NOT Needed (Removed from original plan)

```json
{
  "❌_removed": {
    "@monaco-editor/react": "^4.6.0",      // Code editor (not needed)
    "xterm": "^5.3.0",                     // Terminal emulator (not needed)
    "socket.io-client": "^4.6.0"           // WebSocket client (not needed Week 1)
  }
}
```

---

## Backend Dependencies

### Required (Week 1)

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
psycopg2-binary==2.9.9        # PostgreSQL driver
sqlalchemy==2.0.25            # ORM
pydantic==2.5.3               # Request/response validation
python-jose[cryptography]==3.3.0  # JWT tokens (if not using Clerk)
bcrypt==4.1.2                 # Password hashing
```

### NOT Needed (Removed from original plan)

```txt
❌ python-socketio==5.11.0      # WebSocket (not needed Week 1)
❌ asyncio==3.4.3               # Subprocess execution (not needed Week 1)
```

---

## Database

**PostgreSQL 15+**

**Development:**
```bash
# Local via Docker
docker run --name scopelock-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=scopelock_deck \
  -p 5432:5432 \
  -d postgres:15
```

**Production:**
- Render PostgreSQL (Starter plan or higher)
- Connection via DATABASE_URL env var

---

## Deployment

### Frontend (Vercel)

**Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://api.scopelock.mindprotocol.ai
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Deployment:**
```bash
# Push to GitHub → Vercel auto-deploys
git push origin main
```

### Backend (Render)

**Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/scopelock_deck
JWT_SECRET=your-secret-key-here
CLAUDE_API_KEY=sk-ant-...  # For Rafael simulation (Week 1)
CORS_ORIGINS=https://scopelock.mindprotocol.ai,http://localhost:3000
```

**Deployment:**
```bash
# Push to GitHub → Render auto-deploys
git push origin main
```

---

## Development Tools

**VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python
- PostgreSQL

**Recommended:**
- Postman/Insomnia (API testing)
- TablePlus/DBeaver (database GUI)

---

## Testing Tools

### Frontend

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",         // E2E tests
    "@testing-library/react": "^14.1.0",   // Component tests
    "@testing-library/jest-dom": "^6.1.0", // Jest matchers
    "jest": "^29.7.0"                      // Test runner
  }
}
```

### Backend

```txt
pytest==7.4.3                 # Test runner
pytest-asyncio==0.21.1        # Async test support
pytest-cov==4.1.0             # Coverage reporting
```

---

## Bundle Size Targets

**Frontend (production build):**
- CSS bundle: ≤20KB gzipped
- JS bundle: ≤150KB gzipped (simplified from 300KB in original)
- First Contentful Paint: ≤1.2s

**Why smaller:** No Monaco Editor (-200KB), No xterm.js (-50KB)

---

## Related Documentation

**Previous:** [06_database_schema.md](./06_database_schema.md)
**Start:** [01_overview.md](./01_overview.md)

## Complete Documentation Index

1. [01_overview.md](./01_overview.md) - Architecture overview
2. [02_component_structure.md](./02_component_structure.md) - Frontend components
3. [03_state_management.md](./03_state_management.md) - Zustand stores
4. [04_data_flows.md](./04_data_flows.md) - Data flow diagrams
5. [05_api_design.md](./05_api_design.md) - Backend API endpoints
6. [06_database_schema.md](./06_database_schema.md) - Database schema
7. **07_dependencies.md** - This file

---

**Rafael Silva** — The Specifier
ScopeLock Internal Tools
2025-11-05
