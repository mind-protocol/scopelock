# Mission Deck Frontend → FastAPI Backend Integration
## Implementation Report

**Status:** ✅ COMPLETE
**File:** `/home/mind-protocol/scopelock/mission-deck-frontend/lib/api.ts`
**Date:** 2025-11-06
**TypeScript Validation:** ✅ PASSED

---

## Summary

Successfully updated the Mission Deck frontend API client from mock data to real FastAPI backend connections. The frontend now makes authenticated requests to the production-ready FastAPI backend running on Render or localhost.

---

## What Changed

### 1. API Backend Switch
```typescript
// BEFORE: Returning mock data
const USE_MOCK_DATA = true;

// AFTER: Connected to real FastAPI backend
const USE_MOCK_DATA = false;
```

### 2. JWT Authentication Handling

**Token Storage:**
- Login stores JWT in `localStorage.access_token`
- Automatically included in all authenticated request headers: `Authorization: Bearer <token>`
- Cleared on logout or 401 response

**Session Management:**
- 401 Unauthorized errors automatically redirect to `/login`
- Token cleared on session expiration
- Frontend gracefully handles backend auth failures

### 3. API Helper Function Enhancement

The `apiCall<T>()` helper now:
- ✅ Automatically retrieves JWT token from localStorage
- ✅ Conditionally adds `Authorization: Bearer` header
- ✅ Intercepts 401 errors and redirects to login
- ✅ Parses backend error responses (FastAPI `detail` field)
- ✅ Provides meaningful error messages to components
- ✅ Gracefully handles JSON parsing errors

### 4. API Functions Updated

**Authentication:**
- `login()` - Stores JWT token after successful authentication
- `logout()` - Clears token immediately, calls backend in background

**Missions:**
- `listMissions()` - Extracts array from backend response wrapper
- `getMission(id)` - Fetches single mission from backend
- `updateMissionNotes(id, notes)` - NEW: Update mission notes via backend

**Chat/Support:**
- `sendMessage()` - Posts to Rafael AI endpoint
- `getMessages()` - Fetches message history, extracts array

**Definition of Done:**
- `getDODItems()` - Fetches checklist items, extracts array
- `toggleDODItem()` - Toggles item completion state
- `markAllDODComplete()` - NEW: Transitions mission to QA phase

---

## Backend Integration Points

| Component | Endpoint | Method | Response |
|-----------|----------|--------|----------|
| **Auth** | POST `/api/auth/login` | Credentials → JWT |
| | POST `/api/auth/logout` | Logout (stateless) |
| **Missions** | GET `/api/missions` | List all assigned missions |
| | GET `/api/missions/{id}` | Get single mission |
| | PATCH `/api/missions/{id}/notes` | Update mission notes |
| **Chat** | POST `/api/missions/{id}/chat` | Send message, get response |
| | GET `/api/missions/{id}/messages` | Fetch message history |
| **DoD** | GET `/api/missions/{id}/dod` | List DoD checklist |
| | PATCH `/api/missions/{id}/dod/{item_id}` | Toggle item completion |
| | PATCH `/api/missions/{id}/dod/complete` | Mark all done, transition QA |

---

## Response Format Handling

Backend returns wrapped responses, frontend extracts clean arrays:

```typescript
// Backend: MissionListResponse {missions: [...], total: 5}
// Frontend: api.listMissions() → returns Mission[]

// Backend: MessageHistoryResponse {messages: [...], total: 20}
// Frontend: api.getMessages() → returns ChatMessage[]

// Backend: DoDListResponse {items: [...], total: 7, completed: 3}
// Frontend: api.getDODItems() → returns DODItem[]
```

This maintains **zero breaking changes** - components see same return types.

---

## Authentication Flow Diagram

```
User Login
    ↓
frontend/api.login(email, pwd)
    ↓
POST /api/auth/login {email, password}
    ↓
Backend validates credentials (FalkorDB)
    ↓
Returns {access_token: "jwt...", user: {...}}
    ↓
Frontend stores: localStorage.access_token = "jwt..."
    ↓
Future Requests Automatically Include:
    Authorization: Bearer jwt...
    ↓
Protected Endpoint Responses
    ↓
If 401 Unauthorized:
    ├─ Clear localStorage.access_token
    ├─ Redirect to /login
    └─ User must authenticate again
```

---

## Error Handling

All API functions properly handle errors:

```typescript
// Example: Component usage
try {
  const missions = await api.listMissions();
} catch (error) {
  if ((error as any).status === 401) {
    // Already handled by apiCall() - redirected to login
  } else if ((error as any).status === 404) {
    console.log('Mission not found');
  } else if ((error as any).status === 500) {
    console.log('Backend error:', error.message);
  } else {
    // Network error or unknown
    console.log('Request failed:', error.message);
  }
}
```

---

## Backward Compatibility

✅ **No breaking changes to component code:**
- All function signatures unchanged
- All return types unchanged
- `logout()` remains synchronous (backend call in background)
- All existing components continue to work

✅ **New features available** (but optional):
- `updateMissionNotes()` - Update mission notes
- `markAllDODComplete()` - Mark all DoD done

---

## Environment Configuration

```bash
# Development (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (Vercel env vars)
NEXT_PUBLIC_API_URL=https://scopelock-deck-api.onrender.com

# Default (if not set)
http://localhost:8000
```

---

## Testing Credentials

Test the integration with:
- **Email:** `person1@scopelock.ai`
- **Password:** `testpass`

Also available:
- `person2@scopelock.ai` / `testpass` (user: kara)
- `person3@scopelock.ai` / `testpass` (user: reanance)

---

## Mock Data Retention

All mock data files remain in `api.ts` for reference:
- `MOCK_MISSIONS` - Sample mission data
- `MOCK_CHAT_MESSAGES` - Sample conversations
- `MOCK_DOD_ITEMS` - Sample checklist items
- `MOCK_GITHUB_*` - Sample code metadata
- `MOCK_TEST_RESULTS` - Sample test results
- `MOCK_PERFORMANCE_METRICS` - Sample metrics

When `USE_MOCK_DATA = false`, these are unused but available for rollback.

---

## Files Modified

| File | Changes |
|------|---------|
| `/home/mind-protocol/scopelock/mission-deck-frontend/lib/api.ts` | ✅ Updated API client |

## Files NOT Modified (Backward Compatible)

- `/app/console/page.tsx` - Uses existing API (works as-is)
- All other components - No changes needed
- Type definitions - Unchanged

---

## Validation Results

✅ TypeScript syntax: **PASSED** (no compiler errors)
✅ Function signatures: **BACKWARD COMPATIBLE**
✅ Error handling: **COMPLETE**
✅ Token management: **IMPLEMENTED**
✅ 401 redirect: **IMPLEMENTED**
✅ Response mapping: **IMPLEMENTED**

---

## Pre-Production Checklist

Before deploying to production:

- [ ] Backend running: `python -m uvicorn main:app --reload`
- [ ] Test login with `person1@scopelock.ai` / `testpass`
- [ ] Verify token stored in localStorage
- [ ] Test mission list loads from backend
- [ ] Test chat message sends to Claude API
- [ ] Test DoD item toggle works
- [ ] Test session expiration (401 redirects to login)
- [ ] Test logout clears token
- [ ] Environment variable set: `NEXT_PUBLIC_API_URL`
- [ ] No console errors during normal flow

---

## Implementation Details

### JWT Token Lifecycle

1. **Login:** User submits credentials → Backend issues JWT → Frontend stores in localStorage
2. **Authenticated Requests:** Frontend automatically includes `Authorization: Bearer <token>` header
3. **Token Expiration:** Backend returns 401 → Frontend clears token and redirects to login
4. **Logout:** Frontend clears token immediately, calls backend logout in background

### Error Response Handling

FastAPI errors return JSON with `detail` field:
```json
{
  "detail": "Invalid email or password"
}
```

Frontend extracts and displays this message to users.

### Response Wrapper Extraction

Backend endpoints return wrapper objects (for pagination/metadata), frontend extracts arrays:
```typescript
// Backend returns wrapper
response = {
  missions: [Mission, Mission, ...],
  total: 5
}

// Frontend extracts array for components
return response.missions;
```

---

## Next Steps

1. **Start Backend:**
   ```bash
   cd /home/mind-protocol/scopelock/docs/missions/mission-deck
   python -m uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend:**
   ```bash
   cd /home/mind-protocol/scopelock/mission-deck-frontend
   NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
   ```

3. **Test Login:**
   - Navigate to http://localhost:3000
   - Login with: `person1@scopelock.ai` / `testpass`
   - Verify token in DevTools → Application → localStorage

4. **Test Features:**
   - View missions list
   - Open mission details
   - Send chat message
   - Toggle DoD items
   - Logout

---

## Support

**Implementation based on:**
- `/home/mind-protocol/scopelock/docs/missions/mission-deck/backend/routers/` - Backend endpoints
- `/home/mind-protocol/scopelock/mission-deck-frontend/types/index.ts` - Frontend types
- `/home/mind-protocol/scopelock/citizens/rafael/CLAUDE.md` - Integration guidance

**API Documentation:**
- FastAPI backend: `http://localhost:8000/docs` (Swagger UI)
- OpenAPI schema: `http://localhost:8000/openapi.json`

---

**Implementation Status:** ✅ READY FOR TESTING
