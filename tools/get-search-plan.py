#!/usr/bin/env python3
"""
Get Today's Upwork Search Plan from FalkorDB

Usage:
    python3 tools/get-search-plan.py                    # Get today's plan
    python3 tools/get-search-plan.py 2025-11-07         # Get specific date
    python3 tools/get-search-plan.py --urls-only        # Just output URLs
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

def get_search_plan(date: str = None, urls_only: bool = False):
    """Get and display search plan"""

    # Use today's date if not specified
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")

    slug = f"search-plan-{date}"

    # Get plan with all queries
    cypher = f"""
    MATCH (p:U4_Search_Plan {{slug: '{slug}'}})-[r:INCLUDES_QUERY]->(q:U4_Search_Query)
    RETURN p, r, q
    ORDER BY r.execution_order
    """

    result = query_graph(cypher)

    if not result or 'result' not in result:
        print(f"❌ No search plan found for {date}")
        print(f"\nAvailable plans:")
        list_plans = query_graph("MATCH (p:U4_Search_Plan) RETURN p.slug, p.date ORDER BY p.date DESC LIMIT 5")
        return

    # Parse result
    if urls_only:
        # Just output URLs in execution order
        data = result.get('result', [[]])
        if len(data) > 1:
            for row in data[1]:
                if len(row) > 2 and len(row[2]) > 2:
                    # Extract URL from query node properties
                    props = row[2][2]
                    for prop in props:
                        if prop[0] == 'url':
                            print(prop[1])
        return

    # Full formatted output
    print("=" * 80)
    print(f"📋 UPWORK SEARCH PLAN - {date}")
    print("=" * 80)

    data = result.get('result', [[]])
    if len(data) < 2:
        print("No queries found")
        return

    # Extract plan info from first row
    if len(data) > 1 and len(data[1]) > 0:
        plan_props = data[1][0][0][2]  # First row, plan node, properties

        # Parse plan properties
        plan_info = {}
        for prop in plan_props:
            plan_info[prop[0]] = prop[1]

        print(f"\nTarget: {plan_info.get('target_proposals_sent', '?')} proposals sent")
        print(f"Team: {', '.join(plan_info.get('team_members', []))}")
        print(f"Status: {plan_info.get('status', 'unknown').upper()}")
        print("\n" + "-" * 80)

    # Show queries in execution order
    for idx, row in enumerate(data[1], 1):
        if len(row) < 3:
            continue

        # Parse relationship and query node
        rel_props = row[1][2] if len(row[1]) > 2 else []
        query_props = row[2][2] if len(row[2]) > 2 else []

        # Extract query properties
        query_info = {}
        for prop in query_props:
            query_info[prop[0]] = prop[1]

        # Extract relationship properties
        rel_info = {}
        for prop in rel_props:
            rel_info[prop[0]] = prop[1]

        # Format output
        print(f"\n{idx}. {query_info.get('title', 'Untitled')} ⭐" * query_info.get('priority', 1))
        print(f"   Type: {query_info.get('type', 'unknown')}")
        print(f"   Expected Quality: {query_info.get('expected_quality', 'unknown')}")
        print(f"   Portfolio Proof: {', '.join(query_info.get('portfolio_proof', []))}")
        print(f"   When: {rel_info.get('recommended_for', 'Anytime')}")
        print(f"\n   🔗 {query_info.get('url', 'No URL')}")
        print(f"\n   💡 {query_info.get('rationale', '')}")
        print()

    print("=" * 80)
    print("\n✅ Copy-paste URLs above into browser tabs, then work through them in order!")
    print()

def list_plans():
    """List all available search plans"""
    cypher = "MATCH (p:U4_Search_Plan) RETURN p.slug, p.date, p.status ORDER BY p.date DESC"
    result = query_graph(cypher)

    print("\n📋 Available Search Plans:")
    print("-" * 40)

    data = result.get('result', [[]])
    if len(data) > 1:
        for row in data[1]:
            print(f"  {row[0][1]} - {row[0][2]} ({row[0][3]})")
    else:
        print("  No plans found")
    print()

if __name__ == '__main__':
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg == '--list':
            list_plans()
        elif arg == '--urls-only':
            get_search_plan(urls_only=True)
        elif arg == '--help' or arg == '-h':
            print(__doc__)
        else:
            # Assume it's a date
            get_search_plan(date=arg)
    else:
        get_search_plan()
