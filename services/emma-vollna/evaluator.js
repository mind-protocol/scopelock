/**
 * Emma Evaluator - Vollna Integration
 *
 * PURPOSE: Evaluate jobs using Emma's consciousness via Claude Code CLI
 * APPROACH: Wake Emma citizen with job context, get structured output
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Evaluate job with Emma (via Claude Code CLI)
 *
 * @param {Object} job - Normalized job data from Vollna
 * @returns {Promise<Object>} { decision, reason, confidence, urgency, pain }
 */
async function evaluateWithEmma(job) {
  // Build evaluation prompt for Emma
  const prompt = buildEmmaPrompt(job);

  try {
    // Option 1: Wake Emma via Claude Code CLI
    const evaluation = await wakeEmma(prompt);

    // Parse Emma's response
    return parseEmmaResponse(evaluation);

  } catch (error) {
    console.error('❌ Emma evaluation failed:', error);

    // R-400: Fail-loud
    // Return NO-GO on error rather than crashing
    return {
      decision: 'NO-GO',
      reason: `Evaluation error: ${error.message}`,
      confidence: 0,
      urgency: 0,
      pain: 0
    };
  }
}

/**
 * Build Emma evaluation prompt
 */
function buildEmmaPrompt(job) {
  return `You are Emma, ScopeLock's lead intelligence citizen.

**JOB POST:**

Title: ${job.title}
Budget: ${job.budget}
Description:
${job.description}

**CLIENT INFO:**

- Total spent: ${job.client.totalSpent}
- Rating: ${job.client.rating}
- Hires: ${job.client.hires}
- Payment verified: ${job.client.paymentVerified}
- Location: ${job.client.location}

**COMPETITION:**

- Current proposals: ${job.proposalsCount}

**CONTEXT:**

- Feed: ${job.feedName}
- Link: ${job.link}

---

**EVALUATE THIS JOB:**

Use your three-tier evaluation system:

**STRONG GO:** Payment verified + $3K+ budget + $5K+ client spend
**QUALIFIED MAYBE:** Payment verified + $2K+ budget + one positive signal
**HARD NO:** Payment unverified, <$2K, wrong domain

**OUTPUT FORMAT (required):**

DECISION: [GO or NO-GO]
REASON: [One clear sentence explaining why]
URGENCY: [1-10, how time-sensitive is this]
PAIN: [1-10, how painful is their problem]
CONFIDENCE: [0-100, how confident are you in this decision]

**REASONING:**
[Brief analysis of why this is a good/bad fit for ScopeLock]

---

Remember:
- ScopeLock does fixed-price milestones with Evidence Sprints
- We prove value with AC.md + executable tests
- Our portfolio: Terminal Velocity (1.1k stars), La Serenissima (97 agents), TherapyKin (healthcare AI)
- Sweet spot: $3-15K AI/ML projects with serious clients

GO if this is a good fit. NO-GO if not. Be decisive.`;
}

/**
 * Wake Emma via Claude Code CLI
 */
async function wakeEmma(prompt) {
  return new Promise((resolve, reject) => {
    // Path to Emma's context
    const emmaDir = path.join(__dirname, '../../citizens/emma');

    // Spawn Claude Code process
    const claude = spawn('claude', [
      '--print',
      prompt,
      '--continue'
    ], {
      cwd: emmaDir,
      env: {
        ...process.env,
        CLAUDE_CONTEXT_DIR: emmaDir
      }
    });

    let output = '';
    let errorOutput = '';

    claude.stdout.on('data', (data) => {
      output += data.toString();
    });

    claude.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    claude.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Emma evaluation failed: ${errorOutput}`));
      } else {
        resolve(output);
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      claude.kill();
      reject(new Error('Emma evaluation timeout (60s)'));
    }, 60000);
  });
}

/**
 * Parse Emma's response into structured data
 */
function parseEmmaResponse(text) {
  const lines = text.split('\n');

  let decision = 'NO-GO';
  let reason = 'Unknown';
  let urgency = 5;
  let pain = 5;
  let confidence = 50;

  for (const line of lines) {
    if (line.includes('DECISION:')) {
      const match = line.match(/DECISION:\s*(GO|NO-GO)/i);
      if (match) decision = match[1].toUpperCase();
    }

    if (line.includes('REASON:')) {
      reason = line.replace(/REASON:/i, '').trim();
    }

    if (line.includes('URGENCY:')) {
      const match = line.match(/URGENCY:\s*(\d+)/);
      if (match) urgency = parseInt(match[1]);
    }

    if (line.includes('PAIN:')) {
      const match = line.match(/PAIN:\s*(\d+)/);
      if (match) pain = parseInt(match[1]);
    }

    if (line.includes('CONFIDENCE:')) {
      const match = line.match(/CONFIDENCE:\s*(\d+)/);
      if (match) confidence = parseInt(match[1]);
    }
  }

  return {
    decision,
    reason,
    urgency,
    pain,
    confidence,
    rawResponse: text
  };
}

/**
 * Fallback: Simple heuristic evaluation (if Claude Code unavailable)
 */
function heuristicEvaluation(job) {
  console.log('⚠️ Using fallback heuristic evaluation');

  let confidence = 50;
  let decision = 'NO-GO';
  let reason = '';

  // Extract budget value
  const budgetMatch = job.budget.match(/\$?(\d+,?\d*)/);
  const budgetValue = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 0;

  // Check payment verification
  if (!job.client.paymentVerified) {
    return {
      decision: 'NO-GO',
      reason: 'Payment not verified',
      confidence: 90,
      urgency: 1,
      pain: 1
    };
  }

  // Check budget threshold
  if (budgetValue < 2000) {
    return {
      decision: 'NO-GO',
      reason: 'Budget too low (<$2K)',
      confidence: 90,
      urgency: 1,
      pain: 1
    };
  }

  // Check if AI-related
  const aiKeywords = ['ai', 'machine learning', 'ml', 'llm', 'gpt', 'chatbot', 'nlp', 'automation'];
  const hasAI = aiKeywords.some(kw =>
    job.title.toLowerCase().includes(kw) ||
    job.description.toLowerCase().includes(kw)
  );

  if (!hasAI) {
    return {
      decision: 'NO-GO',
      reason: 'Not AI/ML domain',
      confidence: 70,
      urgency: 1,
      pain: 1
    };
  }

  // STRONG GO criteria
  const clientSpendMatch = job.client.totalSpent.match(/\$?(\d+,?\d*)/);
  const clientSpend = clientSpendMatch ? parseInt(clientSpendMatch[1].replace(/,/g, '')) : 0;

  if (budgetValue >= 3000 && clientSpend >= 5000) {
    decision = 'GO';
    reason = 'Strong client + good budget + AI domain';
    confidence = 85;
  } else if (budgetValue >= 2000) {
    decision = 'GO';
    reason = 'Qualified MAYBE - payment verified + AI domain';
    confidence = 65;
  }

  return {
    decision,
    reason,
    confidence,
    urgency: budgetValue >= 5000 ? 7 : 5,
    pain: hasAI ? 6 : 4
  };
}

module.exports = { evaluateWithEmma, heuristicEvaluation };
