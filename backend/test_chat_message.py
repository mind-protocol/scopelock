#!/usr/bin/env python3
"""Test if create_chat_message works (uses datetime())."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.api.mission_deck.services.graph import create_chat_message

try:
    # Try creating a test message
    result = create_chat_message(
        mission_slug="test-mission",
        actor_ref="claude",
        role="assistant",
        content="Test message",
        code_blocks=[]
    )
    print(f"✅ create_chat_message works: {result}")
except Exception as e:
    print(f"❌ create_chat_message failed: {e}")
    import traceback
    traceback.print_exc()
