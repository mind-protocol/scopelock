/**
 * Telegram Notification System
 *
 * PURPOSE: Send rich notifications with proposal previews and approval buttons
 */

/**
 * Send Telegram notification for new proposal
 */
async function sendTelegramNotification({ job, evaluation, proposal }) {
  const fetch = (await import('node-fetch')).default;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Telegram not configured (missing BOT_TOKEN or CHAT_ID)');
    return;
  }

  // Build notification message
  const message = buildNotificationMessage(job, evaluation, proposal);

  // Build inline keyboard (buttons)
  const keyboard = {
    inline_keyboard: [[
      { text: '✅ Submit', callback_data: `submit_${job.id}` },
      { text: '✏️ Edit', callback_data: `edit_${job.id}` },
      { text: '❌ Skip', callback_data: `skip_${job.id}` }
    ]]
  };

  try {
    // Send message with buttons
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
          disable_web_page_preview: true
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Telegram send failed:', error);
      return;
    }

    console.log('✅ Telegram notification sent');

    // Also send full proposal as document
    await sendProposalDocument(botToken, chatId, job, proposal);

  } catch (error) {
    console.error('❌ Telegram notification failed:', error);
  }
}

/**
 * Build notification message text
 */
function buildNotificationMessage(job, evaluation, proposal) {
  const confidenceEmoji = evaluation.confidence >= 80 ? '✅' : '⚠️';
  const confidenceLabel = evaluation.confidence >= 80 ? 'HIGH CONFIDENCE' : 'REVIEW NEEDED';

  // Truncate proposal preview
  const proposalPreview = proposal.substring(0, 400) + '...';

  return `${confidenceEmoji} **${confidenceLabel}** (${evaluation.confidence}%)

📋 **${job.title}**
💰 Budget: ${job.budget}
📊 Client: ${job.client.totalSpent} spent, ${job.client.rating}⭐, ${job.client.hires} hires
📢 Proposals: ${job.proposalsCount}
🎯 Feed: ${job.feedName || 'Unknown'}

**Emma's reasoning:**
${evaluation.reason}

**Urgency:** ${evaluation.urgency}/10 | **Pain:** ${evaluation.pain}/10

**Proposal preview:**
${proposalPreview}

[Full proposal attached below]

🔗 ${job.link}`;
}

/**
 * Send full proposal as document attachment
 */
async function sendProposalDocument(botToken, chatId, job, proposal) {
  const fetch = (await import('node-fetch')).default;
  const FormData = (await import('form-data')).default;

  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('document', Buffer.from(proposal), {
    filename: `proposal_${job.id}.txt`,
    contentType: 'text/plain'
  });
  form.append('caption', `Full proposal for: ${job.title}`);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        method: 'POST',
        body: form
      }
    );

    if (!response.ok) {
      console.error('❌ Telegram document send failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ Telegram document send error:', error);
  }
}

module.exports = { sendTelegramNotification };
