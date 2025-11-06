/**
 * Vercel Auto-Fix Webhook Listener
 *
 * Listens for Vercel deployment failures and automatically invokes Rafael
 * to investigate and fix the issue using Claude CLI.
 *
 * Deploy to Render as a background worker.
 */

import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3100;

// Middleware
app.use(express.json());

// Track handled deployments to avoid duplicates
const handledDeployments = new Set();
const HANDLED_LOG = path.join(__dirname, 'handled-deployments.json');

// Load previously handled deployments
function loadHandled() {
  try {
    if (fs.existsSync(HANDLED_LOG)) {
      const data = JSON.parse(fs.readFileSync(HANDLED_LOG, 'utf-8'));
      data.forEach(id => handledDeployments.add(id));
      console.log(`Loaded ${handledDeployments.size} handled deployments`);
    }
  } catch (error) {
    console.error('Error loading handled deployments:', error);
  }
}

// Save handled deployment ID
function markHandled(deploymentId) {
  handledDeployments.add(deploymentId);
  fs.writeFileSync(HANDLED_LOG, JSON.stringify([...handledDeployments]), 'utf-8');
}

// Invoke Rafael via Claude CLI
function invokeRafael(deployment) {
  const { id, name, url, meta } = deployment;

  const commitMessage = meta?.githubCommitMessage || 'Unknown commit';
  const commitSha = meta?.githubCommitSha || 'Unknown SHA';

  const prompt = `Vercel deployment FAILED - Auto-fix requested

Project: ${name}
Deployment ID: ${id}
URL: ${url}
Commit: ${commitSha.substring(0, 7)} - ${commitMessage.split('\\n')[0]}
Inspector: https://vercel.com/mindprotocol/${name}/${id}

TASK: Fix this deployment failure autonomously

1. Use the Vercel MCP to get deployment build logs
2. Diagnose the root cause of the error
3. Fix the issue in the codebase
4. Push the fix to main branch
5. Update SYNC.md with fix details

Work autonomously. No human intervention needed.

Use these MCP tools:
- mcp__vercel__get_deployment_build_logs
- mcp__vercel__get_deployment

Start by fetching the build logs to see what failed.
`;

  const claudeCmd = `cd /home/mind-protocol/scopelock/citizens/rafael && claude -p "${prompt.replace(/"/g, '\\"')}" --continue --dangerously-skip-permissions`;

  console.log('\\n' + '='.repeat(80));
  console.log('🤖 INVOKING RAFAEL');
  console.log('='.repeat(80));
  console.log(`Deployment: ${name} (${id})`);
  console.log(`Commit: ${commitSha.substring(0, 7)}`);
  console.log(`Inspector: https://vercel.com/mindprotocol/${name}/${id}`);
  console.log('='.repeat(80) + '\\n');

  exec(claudeCmd, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error invoking Rafael:', error);
      console.error('stderr:', stderr);
      return;
    }

    console.log('\\n' + '='.repeat(80));
    console.log('✅ RAFAEL COMPLETED');
    console.log('='.repeat(80));
    console.log(stdout);
    console.log('='.repeat(80) + '\\n');
  });

  markHandled(id);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'vercel-auto-fix',
    uptime: process.uptime(),
    handledDeployments: handledDeployments.size
  });
});

// Vercel webhook endpoint
app.post('/vercel-webhook', (req, res) => {
  const { deployment_id, id, name, url, state, type, target, meta } = req.body;

  const deploymentId = deployment_id || id;

  console.log(`\\n[${new Date().toISOString()}] Webhook received`);
  console.log(`  Project: ${name}`);
  console.log(`  State: ${state}`);
  console.log(`  Target: ${target}`);
  console.log(`  Type: ${type}`);

  // Only handle ERROR deployments to production
  if (state === 'ERROR' && target === 'production') {
    if (handledDeployments.has(deploymentId)) {
      console.log(`  ⏭️  Already handled: ${deploymentId}`);
      res.status(200).json({ status: 'already_handled', deploymentId });
      return;
    }

    console.log(`  🚨 DEPLOYMENT FAILURE DETECTED`);
    console.log(`  🤖 Invoking Rafael...`);

    // Invoke Rafael asynchronously
    setImmediate(() => {
      invokeRafael({ id: deploymentId, name, url, meta });
    });

    res.status(200).json({
      status: 'rafael_invoked',
      deploymentId,
      message: 'Rafael is investigating the failure'
    });
  } else {
    console.log(`  ✅ Non-failure deployment (state: ${state})`);
    res.status(200).json({ status: 'ignored', reason: 'not_an_error' });
  }
});

// Startup
loadHandled();

app.listen(PORT, '0.0.0.0', () => {
  console.log('\\n' + '='.repeat(80));
  console.log('🤖 Vercel Auto-Fix Server - Rafael Auto-Invocation');
  console.log('='.repeat(80));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📥 Webhook endpoint: http://localhost:${PORT}/vercel-webhook`);
  console.log(`📊 Tracked deployments: ${handledDeployments.size}`);
  console.log('='.repeat(80) + '\\n');
  console.log('Waiting for Vercel deployment failures...');
});
