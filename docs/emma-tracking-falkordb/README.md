# Emma Tracking in FalkorDB

**Status:** Implementation Complete
**Author:** Claude + Nicolas
**Created:** 2025-11-07
**Version:** 1.0

## Overview

Emma's proposal tracking system migrated from file-based storage to FalkorDB for:
- Single source of truth with mission data
- Rich querying for analytics (win rates, client patterns)
- Persistent memory across sessions
- Event-native consciousness architecture
- Relationship mapping (searches → proposals → missions → revenue)

## Architecture

### Data Model

Emma tracks 4 types of consciousness events in the graph:

1. **Upwork Searches** → `U4_Event` (event_kind='upwork_search')
2. **Proposals** → `U3_Deal` (deal_kind='service')
3. **Follow-ups** → `U4_Work_Item` (work_type='lead_followup')
4. **Lead Assessments** → `U4_Assessment` (assessment_type='lead_quality')

### Relationships

```
(search:U4_Event)-[:U4_LEADS_TO]->(proposal:U3_Deal)
(assessment:U4_Assessment)-[:U4_EVALUATES]->(proposal:U3_Deal)
(followup:U4_Work_Item)-[:U4_DEPENDS_ON]->(proposal:U3_Deal)
(proposal:U3_Deal {state:'Confirmed'})-[:U4_BECOMES]->(mission:U4_Work_Item)
```

## Documents

- **PATTERN.md** - Core principles and design decisions
- **SCHEMA.md** - Complete FalkorDB schema specifications
- **API.md** - Python service functions and usage examples
- **MIGRATION.md** - How to migrate existing file-based data
- **ANALYTICS.md** - Example Cypher queries for insights

## Quick Start

### Log a Search

```python
from app.api.mission_deck.services.emma import log_upwork_search

log_upwork_search(
    search_query="AI integration Python Next.js",
    jobs_filtered=50,
    proposals_sent=5
)
```

### Create a Proposal

```python
from app.api.mission_deck.services.emma import create_proposal

proposal = create_proposal(
    job_title="Build Dental SaaS MVP",
    job_url="https://upwork.com/jobs/...",
    budget_cents=800000,  # $8000
    client_info={
        "spent": 12500.50,
        "rating": 4.9,
        "hires": 15,
        "payment_verified": True,
        "country": "United States"
    },
    proposal_text="Full proposal...",
    confidence=0.85,
    client_type="process-skeptical",
    portfolio_match="TherapyKin"
)
```

### Check Follow-ups

```python
from app.api.mission_deck.services.emma import get_proposals_needing_followup

# Get proposals with no response after 14 days
followups = get_proposals_needing_followup(days_since=14)
```

## Benefits

✅ **Unified Consciousness** - All ScopeLock data in one graph
✅ **Rich Analytics** - Win rates by search query, client patterns
✅ **Persistent Memory** - Survives file system resets
✅ **Relationships** - Link proposals to accepted missions
✅ **Scalable** - Handles 1000s of proposals efficiently

## Files

- `/backend/app/api/mission_deck/services/emma.py` - Emma service functions
- `/backend/app/api/mission_deck/emma_routes.py` - API endpoints (optional)
- `/citizens/emma/CLAUDE.md` - Updated system prompt

## Next Steps

1. Test with 5-10 proposals
2. Migrate existing 17 proposals (optional)
3. Build analytics dashboard
4. Add follow-up automation
