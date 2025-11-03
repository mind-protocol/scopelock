#!/usr/bin/env python3
"""
Lead Tracker Auto-Update

PURPOSE: Auto-update Emma's lead tracker from evaluation output
DOCUMENTATION: /docs/automation/03_lead_tracker.md
OWNER: Emma (automation foundation)
EVENTS: lead.tracked@1.0

USAGE:
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

FAILURE MODES:
  - Missing required args → exit 1 with usage
  - leads.json corrupted → skip bad lines, log error
  - tracker.md write fails → exit 1 with error

INTEGRATION: Called after Emma evaluates a lead (manual or via Emma RSS)
"""

import json
import argparse
from datetime import datetime
from pathlib import Path
import sys

# Paths
BASE_DIR = Path(__file__).parent.parent
LEADS_JSON = BASE_DIR / "citizens/emma/leads.json"
TRACKER_MD = BASE_DIR / "citizens/emma/leads-tracker.md"

def track_lead(platform, title, budget, decision, reason, sent=False, link=None, urgency=None, pain=None):
    """Track a new lead evaluation"""
    try:
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

    except Exception as e:
        # R-400: Fail-loud
        print(f"ERROR: Failed to track lead: {e}", file=sys.stderr)
        sys.exit(1)

def regenerate_tracker():
    """Regenerate leads-tracker.md from leads.json"""
    try:
        # Read all entries
        entries = []
        if LEADS_JSON.exists():
            with open(LEADS_JSON, "r") as f:
                for line_num, line in enumerate(f, 1):
                    if line.strip():
                        try:
                            entries.append(json.loads(line))
                        except json.JSONDecodeError as e:
                            # R-400: Fail-loud - log but continue
                            print(f"WARNING: Skipping corrupted line {line_num} in leads.json: {e}", file=sys.stderr)
                            continue

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

    except Exception as e:
        # R-400: Fail-loud
        print(f"ERROR: Failed to regenerate tracker: {e}", file=sys.stderr)
        sys.exit(1)

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
