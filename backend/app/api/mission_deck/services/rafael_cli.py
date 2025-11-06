"""
Rafael API Integration for Mission Deck (Claude CLI version)

This module provides Rafael citizen chat functionality via Claude CLI.
Uses subscription credentials (NOT pay-per-token API).

Architecture:
- Claude CLI: `cd citizens/rafael && claude -p "message" --continue --dangerously-skip-permissions`
- Mission context in prompt
- Code block extraction via regex
- Graceful failure handling (fail-loud but don't crash)
"""

import subprocess
import re
from typing import List, Dict, Optional


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
    Get response from Rafael citizen via Claude CLI.

    Uses Claude Code CLI with subscription credentials (NOT API key).
    Command: cd citizens/rafael && claude -p "message" --continue --dangerously-skip-permissions

    Args:
        user_message: Developer's question/message
        mission_context: Dict with mission details:
            - title: Mission title
            - stack: {backend, frontend, database}
            - notes: Developer notes (optional)

    Returns:
        Tuple of (response_text, code_blocks_list)

    Raises:
        Exception: If Claude CLI fails (caught and handled with fallback message)

    Example:
        response, code_blocks = ask_rafael(
            "How do I deploy to Render?",
            {"title": "Telegram Bot", "stack": {"backend": "FastAPI", "database": "FalkorDB"}}
        )
    """
    # Build prompt with mission context
    stack_backend = mission_context.get("stack", {}).get("backend", "unknown")
    stack_frontend = mission_context.get("stack", {}).get("frontend", "backend-only")
    stack_database = mission_context.get("stack", {}).get("database", "unknown")

    prompt = f"""Mission: {mission_context.get('title', 'Unknown')}
Stack:
  - Backend: {stack_backend}
  - Frontend: {stack_frontend}
  - Database: {stack_database}

Developer question: {user_message}

Provide complete, copy-paste ready code with error handling.
Use Markdown code blocks with language labels (```python, ```typescript, etc.).
Keep response concise but thorough."""

    # Find Rafael's citizen directory
    # Assume backend is at: docs/missions/mission-deck/backend/
    # Rafael is at: citizens/rafael/
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scopelock_root = os.path.dirname(os.path.dirname(os.path.dirname(backend_dir)))
    rafael_dir = os.path.join(scopelock_root, "citizens", "rafael")

    if not os.path.exists(rafael_dir):
        print(f"[rafael_cli.py:ask_rafael] Rafael directory not found: {rafael_dir}")
        return (
            "Sorry, Rafael's workspace is not accessible. Please check the server configuration.",
            []
        )

    try:
        # Try with --continue first (for ongoing conversations)
        result = subprocess.run(
            ["claude", "-p", prompt, "--continue", "--dangerously-skip-permissions"],
            cwd=rafael_dir,
            capture_output=True,
            text=True,
            timeout=60  # 60 second timeout for Claude response
        )

        # If "no conversation found to continue", retry WITHOUT --continue
        if "no conversation found to continue" in result.stdout.lower() or \
           "no conversation found to continue" in result.stderr.lower():
            print("[rafael_cli.py:ask_rafael] No conversation found, retrying without --continue")
            result = subprocess.run(
                ["claude", "-p", prompt, "--dangerously-skip-permissions"],
                cwd=rafael_dir,
                capture_output=True,
                text=True,
                timeout=60
            )

        if result.returncode != 0:
            # CLI failed - log error but return graceful message
            print(f"[rafael_cli.py:ask_rafael] Claude CLI failed: {result.stderr}")
            return (
                "Sorry, I'm having trouble processing your request right now. Please try again in a moment.",
                []
            )

        # Extract response from stdout
        response_text = result.stdout.strip()

        # Extract code blocks
        code_blocks = extract_code_blocks(response_text)

        return response_text, code_blocks

    except subprocess.TimeoutExpired:
        # Claude took too long
        print("[rafael_cli.py:ask_rafael] Claude CLI timeout (>60s)")
        return (
            "Sorry, your request is taking longer than expected. Please try a simpler question or try again later.",
            []
        )

    except FileNotFoundError:
        # Claude CLI not installed
        print("[rafael_cli.py:ask_rafael] Claude CLI not found in PATH")
        return (
            "Sorry, Rafael's tools are not installed on this server. Please contact support.",
            []
        )

    except Exception as e:
        # Unexpected error - fail loud but don't crash
        print(f"[rafael_cli.py:ask_rafael] Unexpected error: {e}")
        return (
            "Sorry, something unexpected happened. The error has been logged. Please try again or contact support if this persists.",
            []
        )
