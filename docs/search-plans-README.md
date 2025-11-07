# Upwork Search Plans (FalkorDB-Backed)

**Purpose:** Systematic search strategy stored in FalkorDB to track what works, avoid repetition, and coordinate team searches.

---

## For Team Members: How to Use

### Get Today's Search Plan

```bash
cd ~/scopelock
python3 tools/get-search-urls.py
```

**Output:** 6 search URLs ordered by priority (highest value first)

### Example Output:

```
1. Build AI Assistant - Customer Support ⭐
   Type: problem_focused | Quality: high_value
   When: First session - highest value searches first
   🔗 https://www.upwork.com/nx/search/jobs/?amount=500-1500&client_hires...
```

### Workflow

1. **Run the tool** → Get 6 URLs
2. **Open URLs 1-3** → First session (problem-focused, highest value)
3. **Copy-paste all job listings** → Send to Emma (or Claude) for evaluation
4. **Emma filters and drafts proposals** → You send them
5. **Later:** Open URLs 4-6 → Second session (niche + stack-focused)

---

## Search Strategy

### Priority Tiers

**Priority 1: Problem-Focused (⭐)**
- Search terms: "build AI assistant", "create custom dashboard", "AI automation business"
- Why: High-value clients ($100K+ spent) search for PROBLEMS not stacks
- Expected: $1,000-1,500 budgets, <10 proposals, excellent client quality

**Priority 3: Platform-Specific (⭐⭐⭐)**
- Search terms: "RAG LLM platform modification"
- Why: Niche but EXCELLENT client quality ($100K+ spent)
- Expected: Fewer jobs, but $1,200+ budgets from proven clients

**Priority 2: Stack-Focused (⭐⭐)**
- Search terms: "fastapi backend python", "nextjs dashboard custom"
- Why: Mixed results - attracts both high-value and low-value clients
- Expected: More jobs, but need to filter carefully by client spending history

### Filters Applied to ALL Searches

- Budget: $500-1,500 (eliminates <$500 gigs)
- Client hires: 10+ (eliminates brand new clients)
- Proposals: 0-14 (skips over-competitive jobs)
- Payment verified: Yes (eliminates unverified risk)
- Price type: Fixed (eliminates hourly consulting roles)
- Results per page: 50 (faster than 10/page)

---

## For Admins: Creating New Search Plans

### 1. Edit the JSON Template

Copy `/tmp/upwork_search_plan_2025-11-07_fixed.json` and update:
- `date`: New date
- `slug`: `search-plan-YYYY-MM-DD`
- `team_members`: Who's searching today
- `target_proposals_sent`: Goal for the day
- Optionally: Add/remove/edit search queries

### 2. Insert into FalkorDB

```bash
python3 /tmp/insert_search_plan_direct.py /path/to/your_plan.json
```

### 3. Create Relationships (if needed)

If relationships didn't auto-create, run:

```bash
python3 -c "
# See the manual relationship creation script in this README
"
```

### 4. Verify

```bash
python3 tools/get-search-urls.py YYYY-MM-DD
```

---

## Schema (Uses Official Mind Protocol Types)

### Nodes

**Search Plan Milestone → `U4_Work_Item`:**
- `type_name`: `"U4_Work_Item"`
- `work_type`: `"milestone"`
- `slug`: `"search-plan-YYYY-MM-DD"`
- `name`: `"Upwork Search Plan - November 7, 2025"`
- `state`: `"todo" | "doing" | "done"`
- `priority`: `"high" | "medium" | "low"`
- `level`: `"L2"`
- `scope_ref`: `"scopelock"`
- `acceptance_criteria`: Success criteria
- Universal attributes: `created_by`, `substrate`, `visibility`, `created_at`, etc.

**Search Task → `U4_Work_Item`:**
- `type_name`: `"U4_Work_Item"`
- `work_type`: `"task"`
- `slug`: `"search-task-ai-assistant"`
- `name`: `"Search: Build AI Assistant - Customer Support"`
- `url`: Full Upwork search URL
- `keywords`: `"build AI assistant customer support"`
- `search_type`: `"problem_focused" | "stack_focused" | "platform_specific"`
- `expected_quality`: `"high_value" | "mixed" | "niche_high_budget"`
- `portfolio_proof`: `["Terminal Velocity", "La Serenissima"]`
- `execution_priority`: `1-6`
- Universal attributes: `created_by`, `substrate`, `visibility`, `created_at`, etc.

### Relationships

**U4_DEPENDS_ON:**
- Links: `(U4_Work_Item:milestone)-[:U4_DEPENDS_ON]->(U4_Work_Item:task)`
- Properties:
  - `forming_mindstate`: `"planning"`
  - `goal`: `"Execute search plan in priority order"`
  - `confidence`: `1.0`
  - `energy`: `0.8`
  - `recommended_for`: `"First session - highest value searches first"`
  - Universal link attributes: `created_by`, `substrate`, `visibility`, `created_at`, `valid_from`, `valid_to`

---

## Future Enhancements

### Track Search Results

Add nodes/relationships to track:
- `(U4_Search_Query)-[:FOUND]->(U4_Upwork_Job)`
- `(U4_Upwork_Job)-[:GENERATED]->(U4_Proposal)`
- `(U4_Proposal)-[:WON]->(U4_Mission)`

**Value:** Analyze which searches lead to wins over time

### Win Rate by Search Type

Query:
```cypher
MATCH (sq:U4_Search_Query)-[:FOUND]->(job)-[:GENERATED]->(p:U4_Proposal)
OPTIONAL MATCH (p)-[:WON]->(m:U4_Mission)
RETURN sq.title, sq.type, count(p) as proposals_sent, count(m) as wins
ORDER BY wins DESC
```

**Value:** Identify highest-ROI searches, refine strategy

---

## Current Status (2025-11-07)

✅ Search plan created and stored in FalkorDB
✅ 6 search queries with priorities and rationale
✅ Retrieval tool working (`get-search-urls.py`)
✅ All searches pre-filtered for high-value clients
✅ Problem-focused searches prioritized (highest value)

**Next:** Execute today's plan, track results, iterate tomorrow

---

## Files

- `/tools/get-search-urls.py` - Retrieve today's search plan
- `/tmp/insert_search_plan_direct.py` - Insert new plans (admin)
- `/tmp/upwork_search_plan_2025-11-07_fixed.json` - Today's plan (template)
- This README: How it all works

---

**Questions?** Ask Nicolas or check SYNC.md for latest status.
