/**
 * Emma + Vollna Webhook Integration
 *
 * PURPOSE: Receive Vollna job notifications, evaluate with Emma, draft proposals
 * DOCUMENTATION: /docs/automation/04_emma_rss_auto_send.md (updated for Vollna)
 * OWNER: Emma + Nicolas
 * EVENTS: job.received@1.0, job.evaluated@1.0, proposal.drafted@1.0
 *
 * FLOW:
 *   Vollna webhook → Parse job → Emma evaluates → Track lead → Draft proposal → Telegram notification
 *
 * DEPLOYMENT:
 *   Render web service at https://scopelock-backend.onrender.com/webhook/vollna-job
 */

const express = require('express');
const crypto = require('crypto');
const { evaluateWithEmma } = require('./evaluator');
const { draftScopeLockProposal } = require('./proposal');
const { sendTelegramNotification } = require('./telegram');
const { trackLead } = require('./tracker');

const app = express();
app.use(express.json());

// Store proposals temporarily (in-memory for now, use Redis/DB in prod)
const proposalStore = new Map();

/**
 * Webhook endpoint for Vollna job notifications
 *
 * Vollna sends batches of jobs matching filters.
 *
 * Payload structure:
 * {
 *   total: 19,
 *   results_url: "https://www.vollna.com/dashboard/monitoring/result/12345",
 *   filter: { id: 123, name: "Backend Development", url: "..." },
 *   filters: [{ id: 123, name: "Backend Development", url: "..." }, ...],
 *   projects: [
 *     {
 *       url: "https://www.vollna.com/go?...",
 *       title: "Build AI chatbot",
 *       description: "Looking for developer...",
 *       skills: ["AI", "Python"],
 *       budget_type: "fixed",
 *       budget: "8000 - 12000 USD",
 *       client_details: {
 *         rank: "Excellent",
 *         payment_method_verified: true,
 *         total_spent: 82639.95,
 *         total_hires: 25,
 *         rating: 4.95,
 *         reviews: 13,
 *         country: { name: "United States", iso_code2: "US" }
 *       },
 *       filters: [{ id: 123, name: "STRONG GO - Premium AI", url: "..." }]
 *     }
 *   ]
 * }
 */
app.post('/webhook/vollna-job', async (req, res) => {
  try {
    console.log('📥 Received Vollna webhook:', new Date().toISOString());
    console.log(`Total projects: ${req.body.total || 0}`);

    // Verify webhook authentication if configured
    if (process.env.VOLLNA_WEBHOOK_SECRET) {
      const isValid = verifyWebhookAuth(req);
      if (!isValid) {
        console.error('❌ Invalid webhook authentication');
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const payload = req.body;
    const projects = payload.projects || [];

    if (projects.length === 0) {
      console.log('⚠️ No projects in webhook payload');
      return res.json({ received: true, processed: 0 });
    }

    // Respond quickly (within 10s timeout)
    // Process jobs asynchronously after response
    res.json({
      received: true,
      total: payload.total,
      processing: projects.length
    });

    // Process each project asynchronously
    for (const project of projects) {
      processProject(project, payload.filter || payload.filters?.[0])
        .catch(error => {
          console.error('❌ Failed to process project:', error);
          console.error('Project:', project.title);
        });
    }

  } catch (error) {
    // R-400: Fail-loud
    console.error('❌ Webhook processing failed:', error);
    console.error('Stack:', error.stack);

    // Return 200 to avoid Vollna auto-disable
    // (We log the error but don't want webhook disabled)
    res.status(200).json({
      received: true,
      error: error.message
    });
  }
});

/**
 * Process individual project from Vollna webhook
 */
async function processProject(project, feedInfo) {
  try {
    const job = normalizeJobData(project, feedInfo);

    console.log(`\n📋 Processing: ${job.title}`);
    console.log(`💰 Budget: ${job.budget}`);
    console.log(`🎯 Feed: ${job.feedName}`);

    // 1. Emma evaluates
    console.log('🤖 Emma evaluating...');
    const evaluation = await evaluateWithEmma(job);

    console.log(`📊 Decision: ${evaluation.decision}`);
    console.log(`💭 Reason: ${evaluation.reason}`);
    console.log(`📈 Confidence: ${evaluation.confidence}%`);

    // 2. Track lead (Feature 3)
    await trackLead({
      platform: 'Upwork',
      title: job.title,
      budget: job.budget,
      decision: evaluation.decision,
      reason: evaluation.reason,
      link: job.link,
      urgency: evaluation.urgency,
      pain: evaluation.pain
    });

    // 3. If GO decision, draft proposal and notify
    if (evaluation.decision === 'GO') {
      console.log('✍️ Drafting ScopeLock proposal...');
      const proposal = await draftScopeLockProposal(job, evaluation);

      // Store proposal for later submission
      proposalStore.set(job.id, {
        job,
        evaluation,
        proposal,
        createdAt: new Date().toISOString()
      });

      // Send Telegram notification
      await sendTelegramNotification({
        job,
        evaluation,
        proposal
      });

      console.log('✅ Proposal drafted and notification sent');
    } else {
      console.log('⏭️ NO-GO decision, skipping proposal');
    }

  } catch (error) {
    console.error('❌ Project processing failed:', error);
    throw error; // Re-throw for outer catch
  }
}

/**
 * Telegram callback handler for proposal approval
 */
app.post('/webhook/telegram-callback', async (req, res) => {
  try {
    const callback = req.body.callback_query;
    if (!callback) {
      return res.json({ ok: true });
    }

    const [action, jobId] = callback.data.split('_');
    const userId = callback.from.id;

    console.log(`📱 Telegram callback: ${action} for job ${jobId}`);

    const stored = proposalStore.get(jobId);
    if (!stored) {
      await sendTelegramMessage(userId, '❌ Proposal not found (may have expired)');
      return res.json({ ok: true });
    }

    const { job, proposal } = stored;

    if (action === 'submit') {
      // Send instructions for manual submission
      await sendTelegramMessage(userId, `✅ Approved! Here's what to do:

1. Open: ${job.link}
2. Click "Submit Proposal"
3. Copy the proposal below and paste into cover letter
4. Set your bid amount
5. Submit

**Full proposal:**
${proposal}

---

Reply "sent ${jobId}" when done to update tracker.`);

      // Mark as approved in store
      proposalStore.set(jobId, {
        ...stored,
        approvedAt: new Date().toISOString()
      });

    } else if (action === 'edit') {
      await sendTelegramMessage(userId, `✏️ Edit mode:

**Current proposal:**
${proposal}

Send me your edited version and I'll update it.`);

    } else if (action === 'skip') {
      await sendTelegramMessage(userId, '⏭️ Skipped. No action taken.');
      proposalStore.delete(jobId);
    }

    res.json({ ok: true });

  } catch (error) {
    console.error('❌ Telegram callback failed:', error);
    res.json({ ok: true }); // Don't fail the callback
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'emma-vollna-webhook',
    timestamp: new Date().toISOString(),
    proposalsStored: proposalStore.size
  });
});

/**
 * Normalize Vollna project data to our internal format
 */
function normalizeJobData(project, feedInfo) {
  // Extract job ID from Vollna's URL (format: ~01146ebeb34b098d8c)
  const jobIdMatch = project.url?.match(/~([a-f0-9]+)/);
  const jobId = jobIdMatch ? jobIdMatch[1] : `vollna_${Date.now()}`;

  // Extract clean Upwork URL from Vollna's tracking link
  const upworkUrlMatch = project.url?.match(/url=(.+?)(?:&|$)/);
  const upworkUrl = upworkUrlMatch
    ? decodeURIComponent(upworkUrlMatch[1])
    : project.url;

  // Feed name from filters array or main filter
  const feedName = project.filters?.[0]?.name
    || feedInfo?.name
    || 'Unknown Feed';

  return {
    id: jobId,
    title: project.title || '',
    description: project.description || '',
    budget: project.budget || 'Not specified',
    budgetType: project.budget_type || 'fixed', // 'fixed' or 'hourly'
    client: {
      totalSpent: `$${project.client_details?.total_spent?.toLocaleString() || '0'}`,
      rating: project.client_details?.rating?.toString() || '0',
      hires: project.client_details?.total_hires || 0,
      paymentVerified: project.client_details?.payment_method_verified || false,
      location: project.client_details?.country?.name || 'Unknown',
      rank: project.client_details?.rank || 'Unknown',
      reviews: project.client_details?.reviews || 0
    },
    proposalsCount: 0, // Vollna doesn't provide this in webhook
    feedName: feedName,
    link: upworkUrl,
    postedAt: project.published || new Date().toISOString(),
    skills: project.skills || [],
    categories: project.categories || [],
    duration: project.duration || '',
    engagement: project.engagement || '',
    experienceLevel: project.experience_level || '',
    jobType: project.job_type || '',
    questions: project.questions || [],
    usOnly: project.us_only || false,
    ukOnly: project.uk_only || false,
    rawPayload: project // Keep original for debugging
  };
}

/**
 * Verify webhook authentication (Vollna uses Basic Auth)
 */
function verifyWebhookAuth(req) {
  const secret = process.env.VOLLNA_WEBHOOK_SECRET;
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.warn('⚠️ No authorization header in webhook request');
    return false;
  }

  // Vollna sends Basic Auth: "Basic base64(username:password)"
  const expectedAuth = `Basic ${Buffer.from(`:${secret}`).toString('base64')}`;

  return authHeader === expectedAuth;
}

/**
 * Send simple Telegram message (for callbacks)
 */
async function sendTelegramMessage(chatId, text) {
  const fetch = (await import('node-fetch')).default;

  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    })
  });

  if (!response.ok) {
    console.error('Telegram send failed:', await response.text());
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Emma-Vollna webhook server running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/vollna-job`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, proposalStore };
