"""
Citizen CLI Integration for Mission Deck

This module provides chat functionality with any citizen via Claude CLI.
Uses subscription credentials (NOT pay-per-token API).

Architecture:
- Claude CLI: `cd citizens/{citizen_id} && claude -p "message" --continue --dangerously-skip-permissions`
- Each citizen has their own CLAUDE.md system prompt in their folder
- Code block extraction via regex
- Graceful failure handling (fail-loud but don't crash)

Authentication:
- Claude CLI must be authenticated on the server
- Use `claude setup-token` to generate long-lived token for production
- Store token in environment/config for persistence across deployments
"""

import subprocess
import re
import os
from typing import List, Dict, Optional


def extract_code_blocks(text: str) -> List[Dict[str, str]]:
    """
    Extract code blocks from citizen's markdown response.

    Args:
        text: Response text from citizen (may contain ```language\n...\n```)

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


def ask_citizen(citizen_id: str, user_message: str) -> tuple[str, List[Dict]]:
    """
    Get response from a citizen via Claude CLI.

    Uses Claude Code CLI with subscription credentials (NOT API key).
    Command: cd citizens/{citizen_id} && claude -p "message" --continue --dangerously-skip-permissions

    Args:
        citizen_id: Citizen identifier (emma, rafael, sofia, etc.)
        user_message: User's question/message

    Returns:
        Tuple of (response_text, code_blocks_list)

    Raises:
        Exception: If Claude CLI fails (caught and handled with fallback message)

    Example:
        response, code_blocks = ask_citizen(
            "rafael",
            "How do I deploy to Render?"
        )
    """
    # Find citizen's directory
    # citizen_cli.py is at: backend/app/api/mission_deck/services/citizen_cli.py
    # Need to go up 5 levels to backend/, then 1 more to scopelock/
    services_dir = os.path.dirname(os.path.abspath(__file__))  # services/
    mission_deck_dir = os.path.dirname(services_dir)  # mission_deck/
    api_dir = os.path.dirname(mission_deck_dir)  # api/
    app_dir = os.path.dirname(api_dir)  # app/
    backend_dir = os.path.dirname(app_dir)  # backend/
    scopelock_root = os.path.dirname(backend_dir)  # scopelock/
    citizen_dir = os.path.join(scopelock_root, "citizens", citizen_id)

    if not os.path.exists(citizen_dir):
        print(f"[citizen_cli.py:ask_citizen] Citizen directory not found: {citizen_dir}")
        return (
            f"Sorry, {citizen_id}'s workspace is not accessible. Please check the server configuration.",
            []
        )

    # Citizen's system prompt is in CLAUDE.md in their folder
    # The prompt is just the user's message - Claude will read CLAUDE.md automatically
    prompt = user_message

    # Find Claude CLI binary (installed by build.sh to backend/bin/claude)
    claude_bin = os.path.join(backend_dir, "bin", "claude")
    if not os.path.exists(claude_bin):
        # Fallback to PATH (for local development)
        claude_bin = "claude"
        print(f"[citizen_cli.py:ask_citizen] Claude binary not found at {os.path.join(backend_dir, 'bin', 'claude')}, using PATH")
    else:
        print(f"[citizen_cli.py:ask_citizen] Using Claude binary at {claude_bin}")

    try:
        # Try with --continue first (for ongoing conversations)
        result = subprocess.run(
            [claude_bin, "-p", prompt, "--continue", "--dangerously-skip-permissions", "--verbose"],
            cwd=citizen_dir,
            capture_output=True,
            text=True,
            timeout=60  # 60 second timeout for Claude response
        )

        # If "no conversation found to continue", retry WITHOUT --continue
        if "no conversation found to continue" in result.stdout.lower() or \
           "no conversation found to continue" in result.stderr.lower():
            print(f"[citizen_cli.py:ask_citizen] No conversation found for {citizen_id}, retrying without --continue")
            result = subprocess.run(
                [claude_bin, "-p", prompt, "--dangerously-skip-permissions", "--verbose"],
                cwd=citizen_dir,
                capture_output=True,
                text=True,
                timeout=60
            )

        # Debug: Log Claude CLI output
        print(f"[citizen_cli.py:ask_citizen] Claude CLI returncode: {result.returncode}")
        print(f"[citizen_cli.py:ask_citizen] Claude CLI stdout length: {len(result.stdout)}")
        print(f"[citizen_cli.py:ask_citizen] Claude CLI stdout repr: {repr(result.stdout[:200])}")
        print(f"[citizen_cli.py:ask_citizen] Claude CLI stderr: {result.stderr[:200] if result.stderr else 'None'}")

        if result.returncode != 0:
            # CLI failed - log error but return graceful message
            print(f"[citizen_cli.py:ask_citizen] Claude CLI failed for {citizen_id}: {result.stderr}")
            return (
                f"Sorry, I'm having trouble processing your request right now. Please try again in a moment.",
                []
            )

        # Extract response from stdout
        response_text = result.stdout.strip()

        # Debug: Check if response is empty
        if not response_text:
            print(f"[citizen_cli.py:ask_citizen] WARNING: Empty response from Claude CLI for {citizen_id}")
            print(f"[citizen_cli.py:ask_citizen] Citizen dir: {citizen_dir}")
            print(f"[citizen_cli.py:ask_citizen] Citizen dir exists: {os.path.exists(citizen_dir)}")
            print(f"[citizen_cli.py:ask_citizen] CLAUDE.md exists: {os.path.exists(os.path.join(citizen_dir, 'CLAUDE.md'))}")
            print(f"[citizen_cli.py:ask_citizen] Prompt: {prompt[:100]}")
            print(f"[citizen_cli.py:ask_citizen] Command: {[claude_bin, '-p', prompt[:50], '--continue', '--dangerously-skip-permissions', '--verbose']}")
            return (
                "Sorry, I received an empty response. This might be an authentication issue. Please contact support.",
                []
            )

        # Extract code blocks
        code_blocks = extract_code_blocks(response_text)

        return response_text, code_blocks

    except subprocess.TimeoutExpired:
        # Claude took too long
        print(f"[citizen_cli.py:ask_citizen] Claude CLI timeout (>60s) for {citizen_id}")
        return (
            "Sorry, your request is taking longer than expected. Please try a simpler question or try again later.",
            []
        )

    except FileNotFoundError:
        # Claude CLI not installed
        print(f"[citizen_cli.py:ask_citizen] Claude CLI not found in PATH")
        return (
            f"Sorry, {citizen_id}'s tools are not installed on this server. Please contact support.",
            []
        )

    except Exception as e:
        # Unexpected error - fail loud but don't crash
        print(f"[citizen_cli.py:ask_citizen] Unexpected error for {citizen_id}: {e}")
        return (
            "Sorry, something unexpected happened. The error has been logged. Please try again or contact support if this persists.",
            []
        )
