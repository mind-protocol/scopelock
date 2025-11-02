"""
Rafael Runner HTTP Client

Calls Node.js Rafael Runner service to execute Claude CLI with tool access.
"""

import logging
import httpx
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class ClaudeRunner:
    """
    Execute Claude Code sessions via Rafael Runner service

    This is the core operational model: backend calls Rafael Runner (Node.js service)
    which runs `claude --print --continue` with full tool access.

    Benefits:
    - Citizens get full tool access (Read, Write, Bash, Grep)
    - Uses subscription ($20/month) not API calls ($60-180/month)
    - System prompts already defined in citizens/*.md
    - Separate service = simpler deployments (Python + Node.js native runtimes)
    """

    def __init__(self, rafael_runner_url: Optional[str] = None):
        """
        Initialize runner

        Args:
            rafael_runner_url: URL of Rafael Runner service (default: from env)
        """
        self.rafael_runner_url = rafael_runner_url or settings.rafael_runner_url
        self.backend_api_url = settings.backend_api_url

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
        Execute Claude via Rafael Runner service (HTTP)

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
            logger.info(f"[runner:{citizen}] Calling Rafael Runner service")
            logger.debug(f"[runner:{citizen}] Prompt: {prompt[:100]}...")

            # Prepare request payload
            payload = {
                "prompt": prompt,
                "citizen": citizen,
                "received_at": received_at
            }

            # Call Rafael Runner via HTTP
            with httpx.Client(timeout=130.0) as client:  # 130s timeout (slightly longer than Rafael's 120s)
                response = client.post(
                    f"{self.rafael_runner_url}/run",
                    json=payload
                )

                response.raise_for_status()
                result = response.json()

            if result.get("success"):
                logger.info(f"[runner:{citizen}] Session completed successfully (request_id: {result.get('request_id')})")
                return {
                    "success": True,
                    "output": result.get("output", ""),
                    "error": None
                }
            else:
                logger.error(f"[runner:{citizen}] Session failed: {result.get('error')}")
                return {
                    "success": False,
                    "output": result.get("output", ""),
                    "error": result.get("error", "Unknown error")
                }

        except httpx.TimeoutException:
            error = "Rafael Runner timeout after 130s"
            logger.error(f"[runner:{citizen}] {error}")
            return {
                "success": False,
                "output": "",
                "error": error
            }

        except httpx.HTTPStatusError as e:
            error = f"Rafael Runner HTTP error: {e.response.status_code}"
            logger.error(f"[runner:{citizen}] {error}")
            return {
                "success": False,
                "output": "",
                "error": error
            }

        except httpx.RequestError as e:
            error = f"Rafael Runner connection error: {str(e)}"
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
