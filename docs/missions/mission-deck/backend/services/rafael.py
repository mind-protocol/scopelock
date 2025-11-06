"""
Rafael API Integration for Mission Deck

This module provides Rafael citizen chat functionality via Claude API.
Week 1 MVP uses direct Claude API calls. Week 2 will integrate actual Rafael citizen.

Architecture:
- Claude 3.5 Sonnet model
- Mission context in system prompt
- Code block extraction via regex
- Graceful failure handling (fail-loud but don't crash)
"""

import os
import re
import anthropic
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")


def extract_code_blocks(text: str) -> List[Dict[str, str]]:
    """
    Extract code blocks from Rafael's markdown response.

    Args:
        text: Response text from Rafael (may contain ```language\n...\n```)

    Returns:
        List of {language, code, filename} dicts

    Example:
        Input: "Here's Python code:\n```python\nprint('hello')\n```"
        Output: [{"language": "python", "code": "print('hello')", "filename": "code.py"}]
    """
    pattern = r"```(\w+)\n(.*?)```"
    matches = re.findall(pattern, text, re.DOTALL)

    code_blocks = []
    for lang, code in matches:
        # Determine filename extension
        ext_map = {
            "python": "py",
            "javascript": "js",
            "typescript": "ts",
            "bash": "sh",
            "shell": "sh",
            "yaml": "yml",
        }
        ext = ext_map.get(lang.lower(), lang.lower())

        code_blocks.append({
            "language": lang,
            "code": code.strip(),
            "filename": f"code.{ext}"
        })

    return code_blocks


def ask_rafael(user_message: str, mission_context: Dict) -> tuple[str, List[Dict]]:
    """
    Get response from Rafael citizen (via Claude API).

    Args:
        user_message: Developer's question/message
        mission_context: Dict with mission details:
            - title: Mission title
            - stack: {backend, frontend, database}
            - notes: Developer notes (optional)

    Returns:
        Tuple of (response_text, code_blocks_list)

    Raises:
        Exception: If Claude API fails (caught and handled with fallback message)

    Example:
        response, code_blocks = ask_rafael(
            "How do I deploy to Render?",
            {"title": "Telegram Bot", "stack": {"backend": "FastAPI", "database": "FalkorDB"}}
        )
    """
    if not CLAUDE_API_KEY:
        print("[rafael.py:ask_rafael] CLAUDE_API_KEY not set")
        return (
            "Sorry, Rafael is not configured. Please set CLAUDE_API_KEY environment variable.",
            []
        )

    # Build system prompt with mission context
    stack_backend = mission_context.get("stack", {}).get("backend", "unknown")
    stack_frontend = mission_context.get("stack", {}).get("frontend", "backend-only")
    stack_database = mission_context.get("stack", {}).get("database", "unknown")

    system_prompt = f"""You are Rafael, a code generation citizen at ScopeLock.

Mission: {mission_context.get('title', 'Unknown')}
Stack:
  - Backend: {stack_backend}
  - Frontend: {stack_frontend}
  - Database: {stack_database}

You help developers implement their missions by:
- Providing code examples in the correct stack
- Explaining deployment steps (Render for backend, Vercel for frontend)
- Debugging errors with specific solutions
- Linking to relevant ScopeLock documentation

Provide complete, copy-paste ready code. Include error handling.
Use Markdown code blocks with language labels (```python, ```typescript, etc.).
Keep responses concise but thorough."""

    try:
        client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )

        # Extract text from response
        response_text = response.content[0].text

        # Extract code blocks
        code_blocks = extract_code_blocks(response_text)

        return response_text, code_blocks

    except anthropic.APIConnectionError as e:
        # Network error - Rafael API unreachable
        print(f"[rafael.py:ask_rafael] Claude API connection error: {e}")
        return (
            "Sorry, I'm having trouble connecting right now. Please check your internet connection and try again in a moment.",
            []
        )

    except anthropic.RateLimitError as e:
        # Rate limit exceeded
        print(f"[rafael.py:ask_rafael] Claude API rate limit: {e}")
        return (
            "Sorry, I'm receiving too many requests right now. Please wait a moment and try again.",
            []
        )

    except anthropic.APIStatusError as e:
        # API error (500, 503, etc.)
        print(f"[rafael.py:ask_rafael] Claude API status error: {e.status_code} - {e.message}")
        return (
            f"Sorry, I'm experiencing technical difficulties (error {e.status_code}). Please try again in a moment.",
            []
        )

    except Exception as e:
        # Unexpected error - fail loud but don't crash
        print(f"[rafael.py:ask_rafael] Unexpected error: {e}")
        return (
            "Sorry, something unexpected happened. The error has been logged. Please try again or contact support if this persists.",
            []
        )
