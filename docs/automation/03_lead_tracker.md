# Feature 3: Lead Tracker Auto-Update

**Status:** Approved (Python script integration)
**Priority:** P0 (Quick Win)
**Time Estimate:** 3h
**Cost:** $0

---

## PATTERN

**Consciousness Principle:** "Metrics emerge from activity, not from manual logging. When Emma evaluates a lead, the tracker updates itself—no human bookkeeping."

**Why:** Manual tracking creates lag and errors. Automated tracking is instant, accurate, and enables analytics (GO rate, conversion rate, best job types).

---

## BEHAVIOR_SPEC

### Event Flow

```
Emma evaluates Upwork post
  ↓
Emma outputs: DECISION: GO/NO-GO + REASON
  ↓
Script captures output       → lead.evaluated@1.0
  ↓
Append to citizens/emma/leads.json
  ↓
Regenerate leads-tracker.md from JSON
  ↓
Human sees updated tracker
```

### Contract

**Input:**
- Emma's evaluation output (text)
  ```
  DECISION: GO
  REASON: AI chat widget, verified client, $8K budget
  Urgency: 8/10
  Pain: 7/10

  [Proposal text follows...]
  ```

**Output:**
- JSON entry:
  ```json
  {
    "timestamp": "2025-11-02T14:23:00Z",
    "platform": "Upwork",
    "title": "Build AI chat widget",
    "budget": "$8,000",
    "decision": "GO",
    "reason": "AI chat widget, verified client, $8K budget",
    "urgency": 8,
    "pain": 7,
    "sent": false,
    "link": "https://upwork.com/jobs/~abc123"
  }
  ```

- Markdown update:
  ```markdown
  ## Quick Stats
  - **Evaluated:** 1/20
  - **GO decisions:** 1 (100%)
  - **NO-GO decisions:** 0 (0%)
  - **Proposals sent:** 0
  ```

**Events:**
- `lead.tracked@1.0 { title, decision, budget }`

---

## VALIDATION

### Acceptance Criteria

**V1: Tracker updates automatically**
```bash
# Test: Paste job post to Emma, get GO decision

# Expected:
# - leads.json appends new entry within 1 second
# - leads-tracker.md regenerates with updated stats
# ✅ Manual markdown editing eliminated
```

**V2: Stats are accurate**
```bash
# Test: Evaluate 10 posts (mix of GO/NO-GO)

# Verify:
cat citizens/emma/leads-tracker.md | grep "GO rate"
# Expected: "GO rate: 40%" (if 4 out of 10 were GO)
# ✅ Stats match actual decisions
```

**V3: Script works with Emma workflow**
```python
# Test: Run script after Emma evaluation

python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat" \
  --budget "$8K" \
  --decision "GO" \
  --reason "AI + clear budget"

# Expected:
# - leads.json updated
# - leads-tracker.md regenerated
# ✅ Integration with Emma workflow seamless
```

---

## MECHANISM

**Implementation Approach:** Python script parses Emma output, appends JSON, regenerates markdown

**Why Python:**
- Simple file I/O
- JSON parsing built-in
- Easy to integrate with Emma (call after evaluation)

**Data Flow:**
```
Emma output (text)
  ↓
Python script parses:
  - Extract DECISION
  - Extract REASON
  - Extract Urgency/Pain (if present)
  ↓
Append to leads.json (newline-delimited JSON)
  ↓
Read all leads.json
  ↓
Calculate stats:
  - Total evaluated
  - GO count / NO-GO count
  - GO rate %
  - Proposals sent count
  ↓
Generate markdown table
  ↓
Write to leads-tracker.md
```

---

## ALGORITHM

### 1. Parse Emma Output

**Input:** Emma's text output (string)

**Steps:**
1. Split text into lines
2. Find line containing "DECISION:" substring
3. Extract value after colon and whitespace
4. Find line containing "REASON:" substring
5. Extract value after colon and whitespace
6. Search for "Urgency:" pattern with regex `Urgency:\s*(\d+)`
7. Search for "Pain:" pattern with regex `Pain:\s*(\d+)`

**Output:** Dictionary with `{ decision, reason, urgency, pain }`

---

### 2. Append to JSON Log

**Input:** `{ decision, reason, urgency, pain, title, budget, platform }`

**Steps:**
1. Get current UTC timestamp in ISO 8601 format
2. Construct JSON object with all fields plus timestamp
3. Set `sent` field to `false` by default
4. Set `link` field to `null` by default
5. Serialize object to JSON string
6. Append JSON string + newline to `citizens/emma/leads.json`

**Output:** Updated leads.json file with new entry

---

### 3. Calculate Stats

**Input:** All entries in leads.json file

**Steps:**
1. Read file line by line
2. Parse each line as JSON object
3. Store in array `entries`
4. Count total entries: `total = length(entries)`
5. Filter entries where `decision == "GO"`, count: `go_count`
6. Filter entries where `decision == "NO-GO"`, count: `nogo_count`
7. Filter entries where `sent == true`, count: `sent_count`
8. Calculate GO rate percentage: `go_rate = (go_count / total) × 100` if total > 0, else 0

**Formula for GO rate:**
```
go_rate = { (go_count / total) × 100,  if total > 0
          { 0,                          if total = 0
```

**Output:** Statistics object `{ total, go_count, nogo_count, sent_count, go_rate }`

---

### 4. Generate Markdown

**Input:** `{ stats, entries }`

**Steps:**
1. Initialize markdown string with header "# Upwork Leads Tracker\n\n"
2. Add session date: current date in YYYY-MM-DD format
3. Add goal line: "**Goal:** 20 posts evaluated, 5-10 proposals sent"
4. Add separator: "---\n\n"
5. Add "## Quick Stats" section
6. Add evaluated line: `- **Evaluated:** {total}/20\n`
7. Add GO line: `- **GO decisions:** {go_count} ({go_rate:.1f}%)\n`
8. Add NO-GO line: `- **NO-GO decisions:** {nogo_count} ({100-go_rate:.1f}%)\n`
9. Add sent line: `- **Proposals sent:** {sent_count}\n`
10. Add table header with columns: #, Date, Platform, Title, Budget, GO/NO-GO, Reason, Sent?, Link
11. Iterate through entries with index starting at 1
12. For each entry:
    - Extract date from timestamp (first 10 chars)
    - Truncate title to 30 chars max
    - Truncate reason to 40 chars max
    - Convert sent boolean to "Yes" or "-"
    - Convert link to string or "-"
    - Add table row
13. Write final markdown string to `citizens/emma/leads-tracker.md`

**Output:** Updated leads-tracker.md file

---

## GUIDE

### Implementation

**File:** `scripts/track-lead.py`

```python
#!/usr/bin/env python3
import json
import argparse
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
LEADS_JSON = BASE_DIR / "citizens/emma/leads.json"
TRACKER_MD = BASE_DIR / "citizens/emma/leads-tracker.md"

def track_lead(platform, title, budget, decision, reason, sent=False, link=None, urgency=None, pain=None):
    """Track a new lead evaluation"""
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "platform": platform,
        "title": title,
        "budget": budget,
        "decision": decision,
        "reason": reason,
        "urgency": urgency,
        "pain": pain,
        "sent": sent,
        "link": link
    }

    # Append to JSON log
    with open(LEADS_JSON, "a") as f:
        f.write(json.dumps(entry) + "\n")

    # Regenerate markdown
    regenerate_tracker()

def regenerate_tracker():
    """Regenerate leads-tracker.md from leads.json"""
    # Read all entries
    entries = []
    if LEADS_JSON.exists():
        with open(LEADS_JSON, "r") as f:
            for line in f:
                if line.strip():
                    entries.append(json.loads(line))

    # Calculate stats
    total = len(entries)
    go_count = sum(1 for e in entries if e["decision"] == "GO")
    nogo_count = sum(1 for e in entries if e["decision"] == "NO-GO")
    sent_count = sum(1 for e in entries if e.get("sent", False))
    go_rate = (go_count / total * 100) if total > 0 else 0

    # Generate markdown
    md = f"""# Upwork Leads Tracker

**Session:** {datetime.now().strftime("%Y-%m-%d")}
**Goal:** 20 posts evaluated, 5-10 proposals sent

---

## Quick Stats

- **Evaluated:** {total}/20
- **GO decisions:** {go_count} ({go_rate:.1f}%)
- **NO-GO decisions:** {nogo_count} ({100-go_rate:.1f}%)
- **Proposals sent:** {sent_count}
- **Responses received:** 0

---

## Leads Log

| # | Date | Platform | Title | Budget | GO/NO-GO | Reason | Sent? | Link |
|---|------|----------|-------|--------|----------|--------|-------|------|
"""

    for i, entry in enumerate(entries, 1):
        date = entry["timestamp"][:10]
        title = entry["title"][:30]  # Truncate long titles
        budget = entry["budget"]
        decision = entry["decision"]
        reason = entry["reason"][:40]  # Truncate long reasons
        sent = "Yes" if entry.get("sent", False) else "-"
        link = entry.get("link", "-")

        md += f"| {i} | {date} | {entry['platform']} | {title} | {budget} | {decision} | {reason} | {sent} | {link} |\n"

    md += """
---

## Notes & Patterns

*Track what's working:*

**Good signals:**
-

**Red flags:**
-

**Winning proposal elements:**
-
"""

    # Write to file
    with open(TRACKER_MD, "w") as f:
        f.write(md)

    print(f"✅ Tracker updated: {total} leads, {go_count} GO, {sent_count} sent")

def parse_emma_output(text):
    """Parse Emma's output to extract decision details"""
    import re

    decision_match = re.search(r'DECISION:\s*(\w+)', text)
    reason_match = re.search(r'REASON:\s*(.+)', text)
    urgency_match = re.search(r'Urgency:\s*(\d+)', text)
    pain_match = re.search(r'Pain:\s*(\d+)', text)

    return {
        "decision": decision_match.group(1) if decision_match else "UNKNOWN",
        "reason": reason_match.group(1).strip() if reason_match else "",
        "urgency": int(urgency_match.group(1)) if urgency_match else None,
        "pain": int(pain_match.group(1)) if pain_match else None
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Track Emma lead evaluation")
    parser.add_argument("--platform", required=True, help="Platform (Upwork, Contra, etc.)")
    parser.add_argument("--title", required=True, help="Job title")
    parser.add_argument("--budget", required=True, help="Budget (e.g., '$8K')")
    parser.add_argument("--decision", required=True, choices=["GO", "NO-GO"], help="Decision")
    parser.add_argument("--reason", required=True, help="Reason for decision")
    parser.add_argument("--sent", action="store_true", help="Proposal was sent")
    parser.add_argument("--link", help="Job post URL")
    parser.add_argument("--urgency", type=int, help="Urgency score 1-10")
    parser.add_argument("--pain", type=int, help="Pain score 1-10")

    args = parser.parse_args()

    track_lead(
        platform=args.platform,
        title=args.title,
        budget=args.budget,
        decision=args.decision,
        reason=args.reason,
        sent=args.sent,
        link=args.link,
        urgency=args.urgency,
        pain=args.pain
    )
```

**Usage:**

```bash
# After Emma evaluates a post:
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat widget" \
  --budget "$8,000" \
  --decision "GO" \
  --reason "AI + verified client + clear budget" \
  --urgency 8 \
  --pain 7 \
  --link "https://upwork.com/jobs/~abc123"

# After sending proposal:
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "Build AI chat widget" \
  --budget "$8,000" \
  --decision "GO" \
  --reason "AI + verified client + clear budget" \
  --sent \
  --link "https://upwork.com/jobs/~abc123"

# Regenerate tracker manually:
python -c "from scripts.track_lead import regenerate_tracker; regenerate_tracker()"
```

**Integration with Emma Workflow:**

Option A: Manual (call script after evaluation)
```bash
# 1. Paste job post to Emma
# 2. Emma outputs decision
# 3. Run tracking script
python scripts/track-lead.py --platform Upwork --title "..." --budget "..." --decision GO --reason "..."
```

Option B: Semi-automated (wrapper script)
```bash
#!/bin/bash
# scripts/emma-evaluate.sh

echo "Paste job post:"
read -r -d '' JOB_POST

echo "Evaluating with Emma..."
# Call Emma (Claude Code instance)
EMMA_OUTPUT=$(python scripts/call-emma.py "$JOB_POST")

echo "$EMMA_OUTPUT"

# Parse output
DECISION=$(echo "$EMMA_OUTPUT" | grep "DECISION:" | cut -d: -f2 | xargs)
REASON=$(echo "$EMMA_OUTPUT" | grep "REASON:" | cut -d: -f2 | xargs)

# Extract title/budget from job post (basic parsing)
TITLE=$(echo "$JOB_POST" | head -1)
BUDGET=$(echo "$JOB_POST" | grep -oP '\$[0-9,]+')

# Track
python scripts/track-lead.py \
  --platform "Upwork" \
  --title "$TITLE" \
  --budget "$BUDGET" \
  --decision "$DECISION" \
  --reason "$REASON"
```

**Testing:**
```bash
# Create test data
python scripts/track-lead.py --platform Upwork --title "Test 1" --budget "$5K" --decision GO --reason "Good fit"
python scripts/track-lead.py --platform Upwork --title "Test 2" --budget "$2K" --decision NO-GO --reason "Budget too low"

# Verify tracker
cat citizens/emma/leads-tracker.md
# Should show:
# - Evaluated: 2/20
# - GO decisions: 1 (50%)
# - Table with 2 rows
```

---

## ROI

**Time Saved:** 10 min/day manual logging × 5 days/week = 50 min/week = 3.3h/month = $330/month
**Cost:** $0
**Benefit:** Real-time analytics, no manual data entry
**Payback:** 3h investment / 3.3h monthly savings = 0.9 months (immediate ROI)
