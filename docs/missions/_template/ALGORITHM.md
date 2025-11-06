# ALGORITHM: [Mission Name]

**Mission:** [Brief mission name]
**Purpose:** Code-level implementation steps for each feature
**Date Created:** YYYY-MM-DD

**For Rafael:** This document provides step-by-step implementation logic. Follow these algorithms when generating code.

---

## Feature 1: [Feature Name]

### Overview

**Purpose:** [What this feature accomplishes]
**Files to create/modify:**
- `[file path 1]`
- `[file path 2]`
- `[file path 3]`

---

### Step 1: Setup Phase

**Create file:** `[file path]`

**Imports/Dependencies:**
```
[List required imports]
```

**Initialize:**
```
[Setup code, state initialization, context creation]
```

**Example:**
```typescript
// Create file: src/app/api/auth/login/route.ts

Imports:
- import { NextRequest, NextResponse } from 'next/server'
- import bcrypt from 'bcrypt'
- import jwt from 'jsonwebtoken'
- import { prisma } from '@/lib/prisma'

Initialize:
- Set up Prisma client connection
- Load JWT secret from environment
```

---

### Step 2: Core Logic

**Function:** `[function name]`

**Pseudocode:**
```
function handle[Feature]():
  1. Validate input:
     - Check [condition 1]
     - Check [condition 2]
     - Throw error if [invalid case]

  2. Process data:
     - Transform [input] to [format]
     - Apply [business rule]
     - Call [external service/database]

  3. Handle response:
     - If success: return [success response]
     - If failure: return [error response]

  4. Side effects:
     - Log [action]
     - Emit event: [event name]
     - Update [state/database]
```

**Example:**
```typescript
function handleLogin(email: string, password: string):
  1. Validate input:
     - Check email is valid format (regex)
     - Check password is not empty
     - Throw 400 error if validation fails

  2. Query database:
     - Find user by email in database
     - If user not found: throw 401 "Invalid email or password"
     - If user found: proceed to password check

  3. Verify password:
     - Compare password with stored hash using bcrypt.compare()
     - If password invalid: throw 401 "Invalid email or password"
     - If password valid: proceed to token generation

  4. Generate token:
     - Create JWT payload: { userId, email, role }
     - Sign JWT with secret key
     - Set expiry: 24 hours

  5. Return response:
     - Set httpOnly cookie with JWT token
     - Return user data (id, email, name) as JSON
     - HTTP 200 status

  6. Audit log:
     - Insert record into audit_log table
     - Fields: userId, action: "login", timestamp, ip_address
```

---

### Step 3: Error Handling

**Error Cases:**

#### Error Case 1: [Error Type]

**When:** [Condition that triggers error]
**Response:**
```
- Log: [error details]
- Emit: failure.emit{location: "[file:line]", reason: "[clear message]"}
- Return: [error response or rethrow]
```

**Example:**
```
Error Case 1: Invalid Credentials

When: Email not found OR password doesn't match
Response:
- Log: Login attempt failed for ${email} from ${ip_address}
- Return: HTTP 401 with { error: "Invalid email or password" }
- Do NOT reveal whether email exists (security)
```

---

#### Error Case 2: [Error Type]

[Same structure]

---

### Step 4: Edge Cases

**Edge Case 1:** [Description]

**Handling:**
```
[How to handle this edge case]
```

**Example:**
```
Edge Case 1: Account locked after 5 failed login attempts

Handling:
- Check user.failed_login_attempts before password verification
- If >= 5 and last_failed_login < 15 minutes ago:
  - Return HTTP 429 "Too many failed attempts. Try again in X minutes."
- After successful login: reset failed_login_attempts to 0
- After failed login: increment failed_login_attempts, update last_failed_login
```

---

**Edge Case 2:** [Description]

[Same structure]

---

## Feature 2: [Feature Name]

### Overview

[Same structure as Feature 1]

---

### Step 1: Setup Phase

[Implementation steps]

---

### Step 2: Core Logic

[Implementation steps]

---

### Step 3: Error Handling

[Error cases]

---

### Step 4: Edge Cases

[Edge cases]

---

## Feature 3: [Feature Name]

[Continue for all features...]

---

## Data Transformations

### Transformation 1: [Input] → [Output]

**Input Format:**
```json
[Example input]
```

**Output Format:**
```json
[Example output]
```

**Transformation Logic:**
```
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

**Example:**
```
Transformation 1: User Registration Input → Database Record

Input Format:
{
  "email": "user@example.com",
  "password": "Test123!",
  "name": "John Doe"
}

Output Format (Database):
{
  "id": "uuid-generated",
  "email": "user@example.com",
  "password_hash": "$2b$12$...",
  "name": "John Doe",
  "role": "user",
  "created_at": "2025-11-05T12:00:00Z",
  "updated_at": "2025-11-05T12:00:00Z"
}

Transformation Logic:
1. Generate UUID for id field
2. Hash password using bcrypt (cost factor 12)
3. Set default role to "user"
4. Set created_at and updated_at to current timestamp
5. Email and name pass through unchanged
```

---

## Database Operations

### Operation 1: [Operation Name]

**Type:** INSERT / UPDATE / DELETE / SELECT

**Query:**
```sql
[SQL query or ORM equivalent]
```

**Parameters:**
```
[List query parameters]
```

**Example:**
```
Operation 1: Create New User

Type: INSERT

Query (Prisma):
await prisma.user.create({
  data: {
    email: email,
    passwordHash: hashedPassword,
    name: name,
    role: 'user'
  }
})

Parameters:
- email: string (validated email address)
- hashedPassword: string (bcrypt hash)
- name: string (user's full name)

Returns: Created user object with id
```

---

### Operation 2: [Operation Name]

[Same structure]

---

## External Service Calls

### Service Call 1: [Service Name] - [Operation]

**Endpoint:** `[API endpoint]`
**Method:** GET / POST / PUT / DELETE

**Request:**
```
[Request structure]
```

**Response:**
```
[Response structure]
```

**Error Handling:**
```
[How to handle service errors]
```

**Example:**
```
Service Call 1: Stripe - Create Payment Intent

Endpoint: POST https://api.stripe.com/v1/payment_intents
Method: POST

Request:
{
  "amount": 1000,  // cents
  "currency": "usd",
  "metadata": {
    "order_id": "order_123"
  }
}

Headers:
- Authorization: Bearer ${STRIPE_SECRET_KEY}

Response (Success):
{
  "id": "pi_123456789",
  "client_secret": "pi_123_secret_456",
  "status": "requires_payment_method"
}

Error Handling:
- Network error: Retry 3 times with exponential backoff
- 400 error: Log error, return to client with clear message
- 500 error: Retry once, then fail gracefully
- Emit: failure.emit{location: "payment.ts:45", reason: "Stripe API error"}
```

---

## State Management

**If using client-side state (React/Vue):**

### State 1: [State Name]

**Type:** [Type definition]

**Initial Value:**
```
[Initial state]
```

**Updates:**
- [Action 1]: [How state changes]
- [Action 2]: [How state changes]

**Example:**
```
State 1: authState

Type:
{
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

Initial Value:
{
  user: null,
  isAuthenticated: false,
  loading: true
}

Updates:
- Login success: Set user to returned user object, isAuthenticated = true, loading = false
- Logout: Set user to null, isAuthenticated = false
- Check session on load: loading = true, then update based on result
```

---

## File Structure

**Files to create for this mission:**

```
[project-root]/
├── [path]/
│   ├── [file1]       # [Purpose]
│   ├── [file2]       # [Purpose]
│   └── [file3]       # [Purpose]
```

**Example:**
```
src/
├── app/
│   └── api/
│       └── auth/
│           ├── login/route.ts         # Login endpoint
│           ├── register/route.ts      # Registration endpoint
│           └── logout/route.ts        # Logout endpoint
├── lib/
│   ├── prisma.ts                      # Prisma client singleton
│   ├── auth.ts                        # Auth utility functions
│   └── validation.ts                  # Input validation helpers
└── types/
    └── auth.ts                        # TypeScript types for auth
```

---

## Testing Hooks

**Where to add test hooks for validation:**

```
[List specific points in code where tests should verify behavior]
```

**Example:**
```
Testing Hooks:

1. After password validation:
   - Test: Valid password passes
   - Test: Weak password rejected

2. After database query:
   - Test: User found returns user object
   - Test: User not found throws 401

3. After token generation:
   - Test: Token contains correct payload
   - Test: Token expiry is 24 hours from now
```

---

## Performance Considerations

**Optimization 1:** [What to optimize]

**How:**
```
[Optimization technique]
```

**Example:**
```
Optimization 1: Database query performance

How:
- Add index on users.email (unique)
- Use SELECT with specific fields instead of SELECT *
- Implement connection pooling (Prisma default)
- Cache user lookup results in Redis (5 minute TTL)
```

---

## Security Considerations

**Security Measure 1:** [What to protect]

**Implementation:**
```
[How to implement security]
```

**Example:**
```
Security Measure 1: Prevent timing attacks on login

Implementation:
- Always bcrypt.compare() even if email not found (use dummy hash)
- Return same error message for "email not found" and "wrong password"
- Log failed attempts but don't reveal which field was wrong
```

---

## Notes for Rafael

[Any additional context, implementation tips, or clarifications]

**Common Pitfalls:**
- [Pitfall 1 and how to avoid it]
- [Pitfall 2 and how to avoid it]

**Example:**
```
Common Pitfalls:

1. Don't use plain bcrypt.compare() without try-catch
   - Wrap in try-catch to handle bcrypt errors gracefully

2. Don't forget to sanitize user input before database queries
   - Use Prisma's parameterized queries (automatically handled)
   - Still validate input format before passing to Prisma

3. Don't store JWT secret in code
   - Always load from environment variable
   - Fail loudly if JWT_SECRET not set (don't use default)
```
