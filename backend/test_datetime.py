#!/usr/bin/env python3
"""Test FalkorDB datetime support."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.api.mission_deck.services.graph import query_graph

# Test 1: CREATE with datetime()
print("\n=== Test 1: datetime() function ===")
try:
    result = query_graph("""
        CREATE (n:TestNode {name: 'test', created_at: datetime()})
        RETURN n
    """)
    print(f"✅ datetime() works: {result}")
except Exception as e:
    print(f"❌ datetime() failed: {e}")

# Test 2: CREATE with ISO string
print("\n=== Test 2: ISO datetime string ===")
try:
    result = query_graph("""
        CREATE (n:TestNode {name: 'test2', created_at: $timestamp})
        RETURN n
    """, {"timestamp": "2025-11-07T15:00:00Z"})
    print(f"✅ ISO string works: {result}")
except Exception as e:
    print(f"❌ ISO string failed: {e}")

# Test 3: Simple CREATE without datetime
print("\n=== Test 3: Simple CREATE ===")
try:
    result = query_graph("""
        CREATE (n:TestNode {name: 'test3'})
        RETURN n
    """)
    print(f"✅ Simple CREATE works: {result}")
except Exception as e:
    print(f"❌ Simple CREATE failed: {e}")

# Clean up test nodes
print("\n=== Cleanup ===")
try:
    query_graph("MATCH (n:TestNode) DELETE n")
    print("✅ Cleanup successful")
except Exception as e:
    print(f"❌ Cleanup failed: {e}")
