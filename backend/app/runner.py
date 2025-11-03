"""
Citizen Runner - Direct Claude CLI Execution

Executes Claude CLI directly via subprocess with full tool access.
"""

import logging
import subprocess
import json
import os
from pathlib import Path
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class ClaudeRunner:
    """
    Execute Claude Code sessions directly via subprocess

    Uses native Claude CLI (installed via curl -fsSL https://claude.ai/install.sh | bash)
    which doesn't require Node.js.

    Benefits:
    - Single service (no separate Node.js service needed)
    - Citizens get full tool access (Read, Write, Bash, Grep)
    - Uses subscription ($20/month) not API calls ($60-180/month)
    - System prompts already defined in citizens/*.md
    """

    def __init__(self):
        """Initialize runner and set up Claude credentials"""
        self.backend_api_url = settings.backend_api_url
        self.timeout = 180  # 3 minutes
        self._setup_credentials()

    def _setup_credentials(self):
        """Write Claude credentials from env var to ~/.claude/.credentials.json"""
        credentials_env = os.getenv('CLAUDE_CREDENTIALS')
        if not credentials_env:
            logger.warning('⚠️  CLAUDE_CREDENTIALS not set, Claude CLI may fail')
            return

        try:
            claude_dir = Path.home() / '.claude'
            credentials_path = claude_dir / '.credentials.json'

            # Create .claude directory if it doesn't exist
            claude_dir.mkdir(parents=True, exist_ok=True)

            # Write credentials file
            credentials_path.write_text(credentials_env)
            logger.info(f'✅ Claude credentials written to {credentials_path}')
        except Exception as error:
            logger.error(f'❌ Failed to write Claude credentials: {error}')

    def run_rafael(self, client: str, message: str, job_title: str, job_link: str, received_at: Optional[str] = None) -> dict:
        """
        Trigger Rafael (response drafter) via Claude CLI

        Args:
            client: Client name
            message: Client message
            job_title: Job title
            job_link: Job URL
            received_at: ISO timestamp when Gmail alert received (for SLA tracking)

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

Draft a response following ScopeLock principles and call POST /api/notify/draft when ready."""

        return self._run_claude(prompt, citizen="rafael", received_at=received_at)

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

    def _run_claude(self, prompt: str, citizen: str = "rafael", received_at: Optional[str] = None) -> dict:
        """
        Execute Claude CLI via subprocess

        Args:
            prompt: Message to send to Claude
            citizen: Citizen name (for logging)
            received_at: ISO timestamp for SLA tracking

        Returns:
            {
                "success": bool,
                "output": str,
                "error": Optional[str]
            }
        """
        try:
            logger.info(f"[runner:{citizen}] Spawning Claude CLI")
            logger.debug(f"[runner:{citizen}] Prompt: {prompt[:100]}...")

            # Prepare environment variables
            env = os.environ.copy()
            env['BACKEND_API_URL'] = self.backend_api_url
            if received_at:
                env['RECEIVED_AT'] = received_at

            # Get repo path (parent of backend dir)
            repo_path = Path(__file__).parent.parent.parent

            # Run Claude CLI from project bin directory (persists from build to runtime)
            backend_path = Path(__file__).parent.parent
            claude_path = backend_path / 'bin' / 'claude'

            if not claude_path.exists():
                # Fallback to ~/.local/bin if project bin doesn't exist
                claude_path = Path.home() / '.local' / 'bin' / 'claude'
            result = subprocess.run(
                [str(claude_path), '--print', prompt, '--continue'],
                cwd=str(repo_path),
                env=env,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )

            logger.info(f"[runner:{citizen}] Claude CLI completed (exit_code: {result.returncode}, stdout_length: {len(result.stdout)}, stderr_length: {len(result.stderr)})")

            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout,
                    "error": None
                }
            else:
                return {
                    "success": False,
                    "output": result.stdout,
                    "error": result.stderr or f"Process exited with code {result.returncode}"
                }

        except subprocess.TimeoutExpired:
            error = f"Claude CLI timeout after {self.timeout}s"
            logger.error(f"[runner:{citizen}] {error}")
            return {
                "success": False,
                "output": "",
                "error": error
            }

        except FileNotFoundError:
            error = "Claude CLI not found - ensure it's installed via build.sh"
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
