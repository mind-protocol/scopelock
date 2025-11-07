# Emma Service API Reference

**Location:** `/backend/app/api/mission_deck/services/emma.py`

Complete Python service functions for Emma's FalkorDB tracking.

---

## Core Functions

### 1. `log_upwork_search()`

**Purpose:** Log each Upwork search query execution

**Signature:**
```python
def log_upwork_search(
    search_query: str,
    jobs_filtered: int,
    proposals_sent: int,
    platform: str = "upwork",
    filters_applied: Optional[List[str]] = None
) -> Dict
```

**Parameters:**
- `search_query` (str) - Search query used (e.g., "AI integration Python Next.js")
- `jobs_filtered` (int) - Number of jobs reviewed
- `proposals_sent` (int) - Number of proposals sent from this search
- `platform` (str) - Platform searched (default "upwork")
- `filters_applied` (list) - Filters used (e.g., ["payment_verified", "fixed_price"])

**Returns:** Created `U4_Event` node with `event_kind='upwork_search'`

**Example:**
```python
from app.api.mission_deck.services.emma import log_upwork_search

search = log_upwork_search(
    search_query="AI integration Python Next.js",
    jobs_filtered=50,
    proposals_sent=5,
    filters_applied=["payment_verified", "fixed_price", "$3K+"]
)

print(search['slug'])  # "search-20251107-153045"
```

---

### 2. `create_proposal()`

**Purpose:** Create a proposal node when Emma sends a proposal

**Signature:**
```python
def create_proposal(
    job_title: str,
    job_url: str,
    budget_cents: int,
    client_info: Dict[str, Any],
    proposal_text: str,
    confidence: float,
    client_type: str,
    portfolio_match: str,
    questions: Optional[List[str]] = None,
    decision: str = "STRONG GO",
    urgency: int = 5,
    pain: int = 5,
    platform: str = "upwork"
) -> Dict
```

**Parameters:**
- `job_title` (str) - Job post title
- `job_url` (str) - URL to job post
- `budget_cents` (int) - Budget in cents (800000 = $8000)
- `client_info` (dict) - Client metadata:
  ```python
  {
    "name": "Dr. Smith",  # Optional, defaults to "Unknown Client"
    "spent": 12500.50,
    "rating": 4.9,
    "hires": 15,
    "payment_verified": True,
    "country": "United States",
    "rank": "Enterprise"  # Optional
  }
  ```
- `proposal_text` (str) - Full proposal content
- `confidence` (float) - Emma's confidence score (0-1)
- `client_type` (str) - "process-skeptical" or "process-friendly"
- `portfolio_match` (str) - Proof project used (e.g., "TherapyKin")
- `questions` (list, optional) - Clarification questions asked
- `decision` (str) - "STRONG GO" | "QUALIFIED MAYBE" | "HARD NO"
- `urgency` (int) - Urgency score 1-10
- `pain` (int) - Pain score 1-10
- `platform` (str) - Platform (default "upwork")

**Returns:** Created `U3_Deal` node with `state='Proposed'`

**Example:**
```python
from app.api.mission_deck.services.emma import create_proposal

proposal = create_proposal(
    job_title="Build Dental SaaS MVP with AI",
    job_url="https://www.upwork.com/jobs/~021985...",
    budget_cents=800000,  # $8000
    client_info={
        "name": "Dr. Smith",
        "spent": 12500.50,
        "rating": 4.9,
        "hires": 15,
        "payment_verified": True,
        "country": "United States",
        "rank": "Enterprise"
    },
    proposal_text="I noticed you need a Dental SaaS MVP...",
    confidence=0.85,
    client_type="process-skeptical",
    portfolio_match="TherapyKin",
    questions=["Which integration matters most?"],
    decision="STRONG GO",
    urgency=8,
    pain=9
)

print(proposal['slug'])  # "proposal-20251103-100045-build-dental-saas-mvp"
print(proposal['state'])  # "Proposed"
```

---

### 3. `link_search_to_proposal()`

**Purpose:** Link search event to proposal (tracks search effectiveness)

**Signature:**
```python
def link_search_to_proposal(
    search_slug: str,
    proposal_slug: str
) -> None
```

**Parameters:**
- `search_slug` (str) - Slug of search event
- `proposal_slug` (str) - Slug of proposal

**Returns:** None (creates `U4_LEADS_TO` relationship)

**Example:**
```python
from app.api.mission_deck.services.emma import link_search_to_proposal

link_search_to_proposal(
    search_slug="search-20251107-153045",
    proposal_slug="proposal-20251103-100045-build-dental-saas-mvp"
)

# Now you can query: which searches led to most wins?
```

---

### 4. `update_proposal_state()`

**Purpose:** Update proposal when client responds

**Signature:**
```python
def update_proposal_state(
    proposal_slug: str,
    new_state: str,
    response_timestamp: Optional[str] = None
) -> Dict
```

**Parameters:**
- `proposal_slug` (str) - Slug of proposal
- `new_state` (str) - "Confirmed" | "Rejected" | "NoResponse"
- `response_timestamp` (str, optional) - When client responded (ISO format)

**Returns:** Updated proposal node

**Example:**
```python
from app.api.mission_deck.services.emma import update_proposal_state

# Client accepted!
updated = update_proposal_state(
    proposal_slug="proposal-20251103-100045-build-dental-saas-mvp",
    new_state="Confirmed",
    response_timestamp="2025-11-05T14:30:00Z"
)

print(updated['state'])  # "Confirmed"
print(updated['response_at'])  # "2025-11-05T14:30:00Z"
```

---

### 5. `create_followup_task()`

**Purpose:** Create follow-up task for cold proposals

**Signature:**
```python
def create_followup_task(
    proposal_slug: str,
    followup_date: str,
    reason: str,
    followup_type: str = "no_response"
) -> Dict
```

**Parameters:**
- `proposal_slug` (str) - Slug of proposal
- `followup_date` (str) - Due date (ISO format, e.g., "2025-11-20")
- `reason` (str) - Why following up
- `followup_type` (str) - "no_response" | "maybe_later" | "warm_lead"

**Returns:** Created `U4_Work_Item` node with `work_type='lead_followup'`

**Example:**
```python
from app.api.mission_deck.services.emma import create_followup_task

followup = create_followup_task(
    proposal_slug="proposal-20251103-100045-build-dental-saas-mvp",
    followup_date="2025-11-20",
    reason="No response after 14 days",
    followup_type="no_response"
)

print(followup['slug'])  # "followup-proposal-20251103-dental-20251117"
print(followup['state'])  # "todo"
print(followup['due_date'])  # "2025-11-20T00:00:00Z"
```

---

### 6. `get_proposals_needing_followup()`

**Purpose:** Get proposals with no response after N days

**Signature:**
```python
def get_proposals_needing_followup(
    days_since: int = 14
) -> List[Dict]
```

**Parameters:**
- `days_since` (int) - Days since proposal submission (default 14)

**Returns:** List of proposal nodes needing follow-up

**Example:**
```python
from app.api.mission_deck.services.emma import get_proposals_needing_followup

# Get all proposals with no response after 14 days
cold_proposals = get_proposals_needing_followup(days_since=14)

for proposal in cold_proposals:
    print(f"{proposal['client_name']}: {proposal['job_title']}")
    # "Dr. Smith: Build Dental SaaS MVP"
```

---

### 7. `get_proposal_by_slug()`

**Purpose:** Get single proposal by slug

**Signature:**
```python
def get_proposal_by_slug(slug: str) -> Optional[Dict]
```

**Parameters:**
- `slug` (str) - Proposal slug

**Returns:** Proposal node or None if not found

**Example:**
```python
from app.api.mission_deck.services.emma import get_proposal_by_slug

proposal = get_proposal_by_slug("proposal-20251103-100045-build-dental-saas-mvp")

if proposal:
    print(proposal['state'])
    print(proposal['client_name'])
else:
    print("Proposal not found")
```

---

### 8. `get_proposals_by_state()`

**Purpose:** Get proposals filtered by state

**Signature:**
```python
def get_proposals_by_state(
    state: str,
    limit: int = 50
) -> List[Dict]
```

**Parameters:**
- `state` (str) - "Proposed" | "Confirmed" | "Rejected" | "NoResponse"
- `limit` (int) - Max proposals to return (default 50)

**Returns:** List of proposal nodes

**Example:**
```python
from app.api.mission_deck.services.emma import get_proposals_by_state

# Get all confirmed (won) proposals
wins = get_proposals_by_state("Confirmed")

# Get all pending proposals
pending = get_proposals_by_state("Proposed", limit=20)
```

---

## Analytics Functions

### 9. `get_win_rate_by_search_query()`

**Purpose:** Calculate win rate for each search query

**Signature:**
```python
def get_win_rate_by_search_query() -> List[Dict]
```

**Parameters:** None

**Returns:** List of dicts with:
- `search_query` (str)
- `total_proposals` (int)
- `wins` (int)
- `win_rate` (float, 0-1)

**Example:**
```python
from app.api.mission_deck.services.emma import get_win_rate_by_search_query

results = get_win_rate_by_search_query()

for row in results:
    query = row['search_query']
    total = row['total_proposals']
    wins = row['wins']
    win_rate = row['win_rate'] * 100

    print(f"{query}: {wins}/{total} wins ({win_rate:.1f}%)")

# Output:
# AI integration Python Next.js: 3/10 wins (30.0%)
# FastAPI React MVP urgent: 2/5 wins (40.0%)
```

---

## Usage in Emma's Workflow

### Complete Example Session

```python
from app.api.mission_deck.services.emma import (
    log_upwork_search,
    create_proposal,
    link_search_to_proposal,
    update_proposal_state,
    create_followup_task,
    get_proposals_needing_followup
)

# 1. Log search
search = log_upwork_search(
    search_query="AI integration Python Next.js",
    jobs_filtered=50,
    proposals_sent=5
)

# 2. Create proposal
proposal = create_proposal(
    job_title="Build AI Chatbot MVP",
    job_url="https://upwork.com/jobs/123",
    budget_cents=500000,  # $5000
    client_info={
        "name": "John Doe",
        "spent": 8000.0,
        "rating": 4.8,
        "hires": 10,
        "payment_verified": True,
        "country": "Canada"
    },
    proposal_text="I noticed you need an AI chatbot...",
    confidence=0.80,
    client_type="process-skeptical",
    portfolio_match="TherapyKin"
)

# 3. Link search to proposal
link_search_to_proposal(search['slug'], proposal['slug'])

# 4. Later: client responds
update_proposal_state(
    proposal_slug=proposal['slug'],
    new_state="Confirmed"
)

# 5. Check for cold proposals needing follow-up
cold_proposals = get_proposals_needing_followup(days_since=14)

# 6. Create follow-up tasks
for cold in cold_proposals:
    create_followup_task(
        proposal_slug=cold['slug'],
        followup_date="2025-11-20",
        reason="No response after 14 days"
    )
```

---

## Error Handling

All functions follow **fail-loud principle**:

```python
try:
    proposal = create_proposal(...)
except Exception as e:
    print(f"Failed to create proposal: {e}")
    # Error logged, exception raised
    # Local backup saved if possible
```

**Resilience:**
- Local JSON backup saved for each proposal
- If FalkorDB unavailable, backup allows manual recovery
- Backup location: `/var/data/emma/proposals/{slug}.json`

---

## Testing

```python
# Test search logging
search = log_upwork_search(
    search_query="TEST: AI integration",
    jobs_filtered=1,
    proposals_sent=1
)
assert search['slug'].startswith('search-')
assert search['event_kind'] == 'upwork_search'

# Test proposal creation
proposal = create_proposal(
    job_title="TEST: Build MVP",
    job_url="https://test.com",
    budget_cents=100000,
    client_info={"spent": 1000, "rating": 5.0, "hires": 1, "payment_verified": True, "country": "US"},
    proposal_text="Test proposal",
    confidence=0.9,
    client_type="process-skeptical",
    portfolio_match="TestProof"
)
assert proposal['state'] == 'Proposed'
assert proposal['budget_cents'] == 100000

print("✅ All tests passed")
```

---

## Next Steps

1. Import functions in Emma's system prompt
2. Replace file writes with function calls
3. Test with 5-10 real proposals
4. Build analytics dashboard using `get_win_rate_by_search_query()`
5. Automate follow-up task creation
