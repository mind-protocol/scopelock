/**
 * Citizen Runner Service
 *
 * Node.js service that executes Rafael (Claude CLI) with full tool access.
 * Called by Python backend when Gmail webhook received.
 *
 * Why separate service:
 * - Render's Python runtime doesn't have Node.js
 * - Rafael needs Claude CLI (requires Node.js)
 * - This service provides HTTP interface to Claude CLI
 *
 * Architecture:
 * Python Backend → HTTP POST /run → This Service → subprocess: claude --print --continue
 *                                                  ↓
 *                                            Rafael has tool access:
 *                                            - Read(citizens/emma/proposals/)
 *                                            - Write(drafts/{uuid}.json)
 *                                            - Bash("curl -X POST /api/notify/draft")
 */

const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const REPO_PATH = process.env.REPO_PATH || '/opt/render/project/src';

// Setup Claude credentials at startup
function setupClaudeCredentials() {
  const credentialsEnv = process.env.CLAUDE_CREDENTIALS;
  if (!credentialsEnv) {
    console.log('⚠️  CLAUDE_CREDENTIALS not set, Claude CLI may fail');
    return;
  }

  try {
    const claudeDir = path.join(os.homedir(), '.claude');
    const credentialsPath = path.join(claudeDir, '.credentials.json');

    // Create .claude directory if it doesn't exist
    if (!fs.existsSync(claudeDir)) {
      fs.mkdirSync(claudeDir, { recursive: true });
    }

    // Write credentials file
    fs.writeFileSync(credentialsPath, credentialsEnv);
    console.log(`✅ Claude credentials written to ${credentialsPath}`);
  } catch (error) {
    console.error('❌ Failed to write Claude credentials:', error);
  }
}

// Setup credentials on startup
setupClaudeCredentials();
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';
const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || '120000'); // 2 minutes

app.use(bodyParser.json({ limit: '10mb' }));

// Logging
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    level,
    message,
    ...meta
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'Citizen Runner',
    status: 'healthy',
    version: '1.0.0',
    repo_path: REPO_PATH,
    backend_api_url: BACKEND_API_URL
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Citizen Runner',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      run: 'POST /run'
    }
  });
});

// Main endpoint: Run Rafael via Claude CLI
app.post('/run', async (req, res) => {
  const {
    prompt,
    citizen = 'rafael',
    received_at = null
  } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: prompt'
    });
  }

  const requestId = Math.random().toString(36).substring(7);
  log('info', 'Rafael execution requested', {
    request_id: requestId,
    citizen,
    prompt_length: prompt.length,
    received_at
  });

  try {
    // Prepare environment variables
    const env = {
      ...process.env,
      BACKEND_API_URL,
      REQUEST_ID: requestId
    };

    // Add received_at for SLA tracking
    if (received_at) {
      env.RECEIVED_AT = received_at;
    }

    // Spawn Claude CLI subprocess via npx (works with local npm install)
    log('info', 'Spawning Claude CLI', { request_id: requestId });

    const claude = spawn('npx', ['@anthropic-ai/claude-code', '--print', prompt, '--continue'], {
      cwd: REPO_PATH,
      env,
      shell: false
    });

    let stdout = '';
    let stderr = '';

    // Collect stdout
    claude.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    // Collect stderr
    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Handle timeout
    const timeout = setTimeout(() => {
      log('warn', 'Claude CLI timeout', { request_id: requestId, timeout_ms: TIMEOUT_MS });
      claude.kill('SIGTERM');
    }, TIMEOUT_MS);

    // Wait for process to complete
    claude.on('close', (code) => {
      clearTimeout(timeout);

      log('info', 'Claude CLI completed', {
        request_id: requestId,
        exit_code: code,
        stdout_length: stdout.length,
        stderr_length: stderr.length
      });

      if (code === 0) {
        res.json({
          success: true,
          output: stdout,
          error: null,
          request_id: requestId
        });
      } else {
        res.json({
          success: false,
          output: stdout,
          error: stderr || `Process exited with code ${code}`,
          request_id: requestId
        });
      }
    });

    // Handle spawn errors
    claude.on('error', (err) => {
      clearTimeout(timeout);
      log('error', 'Claude CLI spawn error', {
        request_id: requestId,
        error: err.message
      });

      res.status(500).json({
        success: false,
        output: '',
        error: `Failed to spawn Claude CLI: ${err.message}`,
        request_id: requestId
      });
    });

  } catch (err) {
    log('error', 'Rafael execution failed', {
      request_id: requestId,
      error: err.message,
      stack: err.stack
    });

    res.status(500).json({
      success: false,
      output: '',
      error: err.message,
      request_id: requestId
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  log('error', 'Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });

  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  log('info', 'Citizen Runner started', {
    port: PORT,
    repo_path: REPO_PATH,
    backend_api_url: BACKEND_API_URL,
    timeout_ms: TIMEOUT_MS
  });
});
