# Mission Deck Frontend API Update - Summary

**Date:** 2025-11-06
**Status:** COMPLETE
**File Updated:** `/home/mind-protocol/scopelock/mission-deck-frontend/lib/api.ts`

---

## Overview

Updated the Mission Deck frontend API client to connect to the real FastAPI backend running on Render or localhost:8000. All API functions now make real fetch() calls instead of returning mock data.

---

## Changes Made

### 1. Enabled Real Backend Connection

```typescript
// Before:
const USE_MOCK_DATA = true; // Set to false when backend is ready

// After:
const USE_MOCK_DATA = false; // Connect to real FastAPI backend
```

### 2. Enhanced API Helper Function

Updated `apiCall<T>()` helper with:
- **JWT Token Handling:** Automatically includes `Authorization: Bearer <token>` header for authenticated requests
- **401 Unauthorized Handling:** Clears token and redirects to `/login` on session expiration
- **Improved Error Handling:** Parses backend error responses (detail field) and provides meaningful error messages
- **Error Status Codes:** Attaches HTTP status code to errors for better handling

```typescript
// Key features:
- Conditionally adds Authorization header only if token exists
- Catches 401 errors and clears local auth state
- Parses FastAPI error responses (detail field)
- Handles non-JSON error responses gracefully
```

### 3. Updated API Functions

#### Authentication
- **`login(email, password)`**
  - Now stores JWT token in localStorage after successful login
  - Token automatically used in subsequent requests
  - Signature unchanged, backward compatible

- **`logout()`**
  - Clears local token immediately (blocks UI from accessing protected pages)
  - Calls backend logout endpoint in background
  - Remains synchronous for backward compatibility with existing components

#### Missions
- **`listMissions()`**
  - Fetches from `/api/missions`
  - Extracts `missions[]` array from `MissionListResponse`
  - Returns `Mission[]` for component compatibility

- **`getMission(id)`**
  - Fetches from `/api/missions/{id}`
  - Returns single `Mission` object

- **`updateMissionNotes(missionId, notes)` - NEW**
  - PATCH `/api/missions/{missionId}/notes`
  - Updates mission notes in backend
  - Returns `{mission_id, notes, updated_at}`
  - Was not in mock data, now available from real backend

#### Chat
- **`sendMessage(missionId, message)`**
  - POST `/api/missions/{missionId}/chat`
  - Sends message to Claude/Rafael API
  - Returns `SendMessageResponse` with response text and code blocks

- **`getMessages(missionId)`**
  - Fetches from `/api/missions/{missionId}/messages`
  - Extracts `messages[]` array from `MessageHistoryResponse`
  - Returns `ChatMessage[]` for component compatibility

#### Definition of Done (DoD)
- **`getDODItems(missionId)`**
  - Fetches from `/api/missions/{missionId}/dod`
  - Extracts `items[]` array from `DoDListResponse`
  - Returns `DODItem[]` for component compatibility

- **`toggleDODItem(missionId, itemId, completed)`**
  - PATCH `/api/missions/{missionId}/dod/{itemId}`
  - Toggles completion state
  - Returns `DoDUpdateResponse` with updated state and timestamp

- **`markAllDODComplete(missionId)` - NEW**
  - PATCH `/api/missions/{missionId}/dod/complete`
  - Marks all DoD items complete and transitions mission to QA
  - Returns `{message, mission_status, completed_count}`

---

## Authentication Flow

### Login
```
1. User enters email/password
2. Frontend calls api.login(email, password)
3. Backend validates credentials against FalkorDB
4. Returns JWT access_token + user info
5. Frontend stores token in localStorage: access_token
6. Future requests automatically include: Authorization: Bearer <token>
```

### Protected Requests
```
1. Any authenticated API call automatically includes Authorization header
2. If backend returns 401 Unauthorized:
   - Frontend clears localStorage
   - Frontend redirects to /login
   - User must login again
```

### Logout
```
1. User clicks logout
2. Frontend calls api.logout()
3. Clears localStorage immediately (UI-blocking logout complete)
4. Sends POST /api/auth/logout to backend in background
5. Even if backend call fails, user is logged out locally
```

---

## Backend Endpoint Mapping

| Frontend Function | Backend Endpoint | Method | Auth Required |
|---|---|---|---|
| login | POST /api/auth/login | POST | No |
| logout | POST /api/auth/logout | POST | Yes |
| listMissions | GET /api/missions | GET | Yes |
| getMission | GET /api/missions/{id} | GET | Yes |
| updateMissionNotes | PATCH /api/missions/{id}/notes | PATCH | Yes |
| sendMessage | POST /api/missions/{id}/chat | POST | Yes |
| getMessages | GET /api/missions/{id}/messages | GET | Yes |
| getDODItems | GET /api/missions/{id}/dod | GET | Yes |
| toggleDODItem | PATCH /api/missions/{id}/dod/{item_id} | PATCH | Yes |
| markAllDODComplete | PATCH /api/missions/{id}/dod/complete | PATCH | Yes |

---

## Response Format Mapping

Backend returns wrapper objects, frontend extracts arrays:

| Backend Response | Frontend Extraction |
|---|---|
| `MissionListResponse {missions[], total}` | Extract `missions[]` |
| `MessageHistoryResponse {messages[], total}` | Extract `messages[]` |
| `DoDListResponse {items[], total, completed}` | Extract `items[]` |
| Single object (Mission, DoDUpdateResponse, etc) | Return as-is |

This ensures component code remains unchanged - all API functions still return arrays/objects, not wrapped responses.

---

## Error Handling

All API functions use try/catch or throw errors that components can handle:

```typescript
try {
  const missions = await api.listMissions();
} catch (error) {
  // Backend returned error (4xx, 5xx)
  // 401 errors automatically redirect to login
  // Other errors have message from backend
}
```

---

## Environment Configuration

Backend URL configured via environment variable:

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (Vercel)
NEXT_PUBLIC_API_URL=https://scopelock-deck-api.onrender.com
```

Default: `http://localhost:8000` if not set.

---

## Mock Data Retention

All mock data retained in `api.ts` for reference and fallback:
- `MOCK_MISSIONS`
- `MOCK_CHAT_MESSAGES`
- `MOCK_DOD_ITEMS`
- `MOCK_GITHUB_FILES`
- `MOCK_GITHUB_COMMITS`
- `MOCK_TEST_RESULTS`
- `MOCK_PERFORMANCE_METRICS`

When `USE_MOCK_DATA = false`, these are not used but available for easy rollback or testing.

---

## Breaking Changes

**None.** All changes are backward compatible:

- `login()` signature unchanged
- `logout()` remains synchronous (callbacks happen in background)
- `listMissions()` still returns `Mission[]`
- `getMessages()` still returns `ChatMessage[]`
- `getDODItems()` still returns `DODItem[]`

New functions added:
- `updateMissionNotes()` - available but not required by existing components
- `markAllDODComplete()` - available but not required by existing components

---

## Testing Checklist

Before considering complete:

- [ ] Backend running (http://localhost:8000 or production URL)
- [ ] User can login with test credentials:
  - Email: `person1@scopelock.ai`
  - Password: `testpass`
- [ ] After login, token visible in browser DevTools → Application → localStorage → `access_token`
- [ ] Can fetch missions list (GET /api/missions)
- [ ] Can view individual mission (GET /api/missions/{id})
- [ ] Can send chat message (POST /api/missions/{id}/chat)
- [ ] Can fetch chat history (GET /api/missions/{id}/messages)
- [ ] Can fetch DoD items (GET /api/missions/{id}/dod)
- [ ] Can toggle DoD item (PATCH /api/missions/{id}/dod/{id})
- [ ] Can update mission notes (PATCH /api/missions/{id}/notes)
- [ ] Logging out clears token and redirects to login
- [ ] 401 errors redirect to login and clear token
- [ ] Network errors display meaningful messages

---

## Files Modified

- `/home/mind-protocol/scopelock/mission-deck-frontend/lib/api.ts` - Updated API client

## Files Not Modified (Backward Compatible)

- `/home/mind-protocol/scopelock/mission-deck-frontend/app/console/page.tsx` - Works as-is
- All other components - No changes needed

---

## Related Backend Files

Implementation references:
- Backend auth router: `/home/mind-protocol/scopelock/docs/missions/mission-deck/backend/routers/auth.py`
- Backend missions router: `/home/mind-protocol/scopelock/docs/missions/mission-deck/backend/routers/missions.py`
- Backend chat router: `/home/mind-protocol/scopelock/docs/missions/mission-deck/backend/routers/chat.py`
- Backend DoD router: `/home/mind-protocol/scopelock/docs/missions/mission-deck/backend/routers/dod.py`

---

## Next Steps

1. Start backend: `cd /home/mind-protocol/scopelock/docs/missions/mission-deck && python -m uvicorn main:app --reload`
2. Set environment: `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Start frontend: `npm run dev`
4. Test login with `person1@scopelock.ai` / `testpass`
5. Verify mission list loads from backend
6. Run full test checklist above

---

## JWT Token Details

- **Storage:** Browser localStorage, key `access_token`
- **Lifetime:** Configured in backend (default: 24 hours)
- **Format:** JWT (JSON Web Token)
- **Header:** `Authorization: Bearer <token>`
- **Expiration:** 401 response triggers automatic redirect to login
- **Secure:** Tokens never exposed in URLs, only in Authorization header

---

**Status:** Ready for testing with real backend
