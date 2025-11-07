#!/usr/bin/env python3
"""Test search logging specifically."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.api.mission_deck.services.emma import log_upwork_search

try:
    search = log_upwork_search(
        search_query="AI integration Python Next.js",
        jobs_filtered=50,
        proposals_sent=3,
        filters_applied=["payment_verified", "fixed_price", "$3K+"]
    )
    print(f"✅ Search logged successfully!")
    print(f"   Slug: {search.get('slug') if isinstance(search, dict) else 'N/A'}")
    print(f"   Full result: {search}")
except Exception as e:
    print(f"❌ Search logging failed: {e}")
    import traceback
    traceback.print_exc()
