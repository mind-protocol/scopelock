#!/usr/bin/env python3
"""Test creating a node with all the fields Emma uses."""

import sys
from pathlib import Path
import requests
sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings
from datetime import datetime

# Test with simplified node first
timestamp = datetime.utcnow().isoformat()

query = """
CREATE (s:U4_Event {
  name: $name,
  slug: $slug,
  event_kind: 'upwork_search',
  level: 'L2',
  scope_ref: 'scopelock',
  actor_ref: 'emma',
  search_query: $search_query,
  jobs_filtered: $jobs_filtered,
  proposals_sent: $proposals_sent,
  platform: $platform,
  timestamp: $timestamp,
  created_at: $created_at
})
RETURN s
"""

params = {
    "name": "Test Search",
    "slug": "test-search-001",
    "search_query": "AI integration",
    "jobs_filtered": 50,
    "proposals_sent": 3,
    "platform": "upwork",
    "timestamp": timestamp,
    "created_at": timestamp
}

print(f"Query: {query}")
print(f"Params: {params}")

response = requests.post(
    settings.falkordb_api_url,
    headers={"Content-Type": "application/json", "X-API-Key": settings.falkordb_api_key},
    json={"graph_name": settings.graph_name, "query": query, "params": params}
)

print(f"\nStatus: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code != 200:
    print("\n❌ CREATE failed - FalkorDB returned error")
else:
    print("\n✅ CREATE successful")
    result = response.json()
    print(f"Result: {result}")
