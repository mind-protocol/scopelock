#!/usr/bin/env python3
"""Test FalkorDB connection with minimal query."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.api.mission_deck.services.graph import query_graph

try:
    # Simple query to test connection
    result = query_graph("MATCH (n) RETURN count(n) as node_count LIMIT 1")
    print(f"✅ FalkorDB connection successful")
    print(f"   Result: {result}")
except Exception as e:
    print(f"❌ FalkorDB connection failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
