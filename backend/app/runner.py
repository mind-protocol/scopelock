"""
Claude CLI subprocess runner

Executes citizens via `claude --print "message" --continue`
"""

import subprocess
import logging
import os
from pathlib import Path
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class ClaudeRunner:
    """
    Execute Claude Code sessions via CLI

    This is the core operational model: backend runs `claude --print --continue`
    instead of calling Anthropic API directly.

    Benefits:
    - Citizens get full tool access (Read, Write, Bash, Grep)
    - Uses subscription ($20/month) not API calls ($60-180/month)
    - System prompts already defined in citizens/*.md
    """

    def __init__(self, repo_path: Optional[Path] = None):
        """
        Initialize runner

        Args:
            repo_path: Path to ScopeLock repository (default: from settings)
        """
        self.repo_path = repo_path or settings.scopelock_repo
        self.backend_api_url = os.getenv("BACKEND_API_URL", "http://localhost:8000")

    def run_rafael(self, client: str, message: str, job_title: str, job_link: str) -> dict:
        """
        Trigger Rafael (response drafter) via Claude CLI

        Args:
            client: Client name
            message: Client message
            job_title: Job title
            job_link: Job URL

        Returns:
            {
                "success": bool,
                "output": str,  # Claude's response
                "error": Optional[str]
            }
        """
        prompt = f"""New Upwork response from {client}: {message}

Job: {job_title}
Link: {job_link}

Draft a response following ScopeLock principles and call POST /api/draft/create when ready."""

        return self._run_claude(prompt, citizen="rafael")

    def run_emma(self, job_post: str) -> dict:
        """
        Trigger Emma (lead evaluator) via Claude CLI

        Args:
            job_post: Full job post text

        Returns:
            {
                "success": bool,
                "output": str,
                "error": Optional[str]
            }
        """
        prompt = f"""Evaluate this Upwork post and call POST /api/lead/track with your decision:

{job_post}"""

        return self._run_claude(prompt, citizen="emma")

    def _run_claude(self, prompt: str, citizen: str = "rafael") -> dict:
        """
        Execute claude CLI in subprocess

        Args:
            prompt: Message to send to Claude
            citizen: Citizen name (for logging)

        Returns:
            {
                "success": bool,
                "output": str,
                "error": Optional[str]
            }
        """
        try:
            logger.info(f"[runner:{citizen}] Starting Claude Code session")
            logger.debug(f"[runner:{citizen}] Prompt: {prompt[:100]}...")

            # Set environment variables for Claude session
            env = os.environ.copy()
            env["BACKEND_API_URL"] = self.backend_api_url

            # Run claude CLI
            result = subprocess.run(
                ["claude", "--print", prompt, "--continue"],
                cwd=self.repo_path,
                env=env,
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout
            )

            if result.returncode == 0:
                logger.info(f"[runner:{citizen}] Session completed successfully")
                return {
                    "success": True,
                    "output": result.stdout,
                    "error": None
                }
            else:
                logger.error(f"[runner:{citizen}] Session failed: {result.stderr}")
                return {
                    "success": False,
                    "output": result.stdout,
                    "error": result.stderr
                }

        except subprocess.TimeoutExpired:
            error = f"Claude session timeout after 120s"
            logger.error(f"[runner:{citizen}] {error}")
            return {
                "success": False,
                "output": "",
                "error": error
            }

        except FileNotFoundError:
            error = "claude CLI not found - ensure Claude Code is installed"
            logger.error(f"[runner:{citizen}] {error}")
            return {
                "success": False,
                "output": "",
                "error": error
            }

        except Exception as e:
            error = f"Unexpected error: {str(e)}"
            logger.error(f"[runner:{citizen}] {error}", exc_info=True)
            return {
                "success": False,
                "output": "",
                "error": error
            }


# Global runner instance
runner = ClaudeRunner()
