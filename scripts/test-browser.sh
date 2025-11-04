#!/bin/bash
# Test browser automation with a real Upwork job

# Set to test mode (won't actually submit)
export TEST_MODE=true
export BROWSER_HEADLESS=false
export OUTPUT_DIR=/home/mind-protocol/scopelock/browser-sessions

# Real Upwork job URL
JOB_URL="https://www.upwork.com/jobs/~021985511227443659632?referrer_url_path=%2Fmost-recent%2Fdetails%2F~021985511227443659632"

# Example proposal
PROPOSAL_TEXT="This is a test proposal.

I noticed your project needs [specific requirement]. I've built similar systems before, including:

- La Serenissima (97+ AI agents, 99.7% uptime)
- TherapyKin (HIPAA-compliant healthcare AI)
- Terminal Velocity (1.1k GitHub stars)

I use ScopeLock methodology:
✅ Executable acceptance criteria
✅ Fixed-price delivery
✅ Payment only at AC green
✅ Public proof log

Let's discuss scope and timeline.

Best regards"

BID_AMOUNT=3500

cd /home/mind-protocol/scopelock
node scripts/submit-upwork-proposal.js "$JOB_URL" "$PROPOSAL_TEXT" "$BID_AMOUNT"
