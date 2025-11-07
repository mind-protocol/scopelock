#!/usr/bin/env python3
"""
Get Today's Upwork Search URLs from FalkorDB

Usage:
    python3 tools/get-search-urls.py                    # Get today's URLs
    python3 tools/get-search-urls.py 2025-11-07         # Get specific date
"""

import sys
import os
import requests
from datetime import datetime

# FalkorDB connection
API_URL = "https://mindprotocol.onrender.com/admin/query"
API_KEY = os.getenv("FALKORDB_API_KEY", "Sxv48F2idLAXMnvqQTdvlQ4gArsDVhK4ROGyU")
GRAPH_NAME = "scopelock"

def query_graph(cypher: str) -> dict:
    """Execute Cypher query"""
    payload = {
        "graph_name": GRAPH_NAME,
        "query": cypher
    }
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    response = requests.post(API_URL, json=payload, headers=headers)
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return {}
    return response.json()

def get_search_urls(date: str = None):
    """Get and display search URLs in execution order"""

    # Use today's date if not specified
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")

    slug = f"search-plan-{date}"

    # Get milestone and its tasks
    cypher = f"""
    MATCH (m:U4_Work_Item {{slug: '{slug}', work_type: 'milestone'}})-[r:U4_DEPENDS_ON]->(t:U4_Work_Item {{work_type: 'task'}})
    RETURN t.name, t.url, t.priority, t.search_type, t.expected_quality, t.execution_priority, r.recommended_for
    ORDER BY t.execution_priority
    """

    result = query_graph(cypher)

    if not result or 'result' not in result:
        print(f"❌ No search plan found for {date}")
        return

    data = result.get('result', [[]])

    if len(data) < 2 or not data[1]:
        print(f"❌ No search tasks found for {date}")
        # Show what milestone exists
        milestone_check = query_graph(f"MATCH (m:U4_Work_Item {{slug: '{slug}'}}) RETURN m.name, m.work_type")
        print(f"\nDebug: Milestone check: {milestone_check}")
        return

    print("=" * 100)
    print(f"📋 UPWORK SEARCH PLAN - {date}")
    print("=" * 100)
    print()

    # Show tasks
    for row in data[1]:
        title = row[0]
        url = row[1]
        priority = row[2]
        search_type = row[3]
        quality = row[4]
        order = row[5]
        when = row[6]

        stars = "⭐" * (4 - priority) if isinstance(priority, int) and priority <= 3 else "⭐"
        if priority == "high":
            stars = "⭐"
        elif priority == "medium":
            stars = "⭐⭐"

        print(f"{order}. {title} {stars}")
        print(f"   Type: {search_type} | Quality: {quality}")
        print(f"   When: {when}")
        print(f"   🔗 {url}")
        print()

    print("=" * 100)
    print(f"\n✅ Found {len(data[1])} searches - work through them in order above!")
    print()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == '--help' or arg == '-h':
            print(__doc__)
        else:
            get_search_urls(date=arg)
    else:
        get_search_urls()
