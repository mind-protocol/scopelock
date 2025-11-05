#!/usr/bin/env node

/**
 * Telegram Notification Tool for Emma's Proposals
 *
 * Sends proposal notifications to Telegram with:
 * - Proposal text (auto-split at 4000 chars)
 * - Questions (one message per question)
 * - Job link for tracking
 * - Metadata (platform, budget, confidence)
 *
 * Features:
 * - HTML formatting for better readability (bold, links)
 * - Auto-escapes HTML special characters (<, >, &)
 * - Auto-splits messages >4000 characters
 * - Handles emoji safely
 * - Fallback to plain text if HTML parsing fails
 *
 * Environment variables required:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 *
 * Usage:
 *   node telegram-notify.cjs --proposal /path/to/proposal.json
 *
 * Improvements (2025-11-05):
 * - Added HTML formatting based on Reddit research on Telegram MarkdownV2 issues
 * - HTML mode chosen over MarkdownV2 (fewer special chars, more predictable with AI content)
 * - Proper escaping of <, >, & characters
 * - Clickable links with <a href="...">
 * - Bold headers for better visual hierarchy
 */

const fs = require('fs');
const https = require('https');

// Parse command line arguments
const args = process.argv.slice(2);
const proposalIndex = args.indexOf('--proposal');

if (proposalIndex === -1 || !args[proposalIndex + 1]) {
  console.error('Error: --proposal argument required');
  console.error('Usage: node telegram-notify.cjs --proposal /path/to/proposal.json');
  process.exit(1);
}

const proposalPath = args[proposalIndex + 1];

// Check environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('Error: Missing environment variables');
  console.error('Required: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID');
  process.exit(1);
}

// Read proposal JSON
let proposal;
try {
  const content = fs.readFileSync(proposalPath, 'utf8');
  proposal = JSON.parse(content);
} catch (err) {
  console.error(`Error reading proposal file: ${err.message}`);
  process.exit(1);
}

// Validate proposal structure
const required = ['job_title', 'job_url', 'proposal_text', 'platform', 'decision', 'confidence'];
for (const field of required) {
  if (!proposal[field]) {
    console.error(`Error: Missing required field "${field}" in proposal JSON`);
    process.exit(1);
  }
}

/**
 * Escape HTML special characters for safe Telegram HTML mode
 *
 * HTML mode requires escaping only 3 characters: <, >, &
 * This is much simpler than MarkdownV2's 18 special characters
 *
 * Based on: Reddit research, Telegram Bot API HTML docs
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')   // Must be first to avoid double-escaping
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Split long text into natural-looking chunks
 *
 * Strategy:
 * - Target 500 chars per message (feels more conversational)
 * - Split at paragraph boundaries (double newline)
 * - If paragraph >500 chars, split at sentence boundaries
 * - Max 4096 chars (Telegram hard limit)
 *
 * This makes messages appear natural in Telegram chat flow
 * Based on: User feedback for natural chunking
 */
function splitMessage(text, targetLength = 500, maxLength = 4096) {
  if (text.length <= targetLength) {
    return [text];
  }

  const chunks = [];

  // Split by paragraphs first (double newline or \n\n)
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // If adding this paragraph keeps us under target, add it
    if (currentChunk.length + trimmedParagraph.length + 2 <= targetLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    } else {
      // Save current chunk if it exists
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      // If paragraph itself is >target, split by sentences
      if (trimmedParagraph.length > targetLength) {
        const sentences = trimmedParagraph.split(/([.!?]+\s+)/);
        let sentenceChunk = '';

        for (const sentence of sentences) {
          if (!sentence.trim()) continue;

          if (sentenceChunk.length + sentence.length <= targetLength) {
            sentenceChunk += sentence;
          } else {
            if (sentenceChunk) {
              chunks.push(sentenceChunk.trim());
              sentenceChunk = '';
            }

            // If single sentence is still too long, force split at maxLength
            if (sentence.length > maxLength) {
              let remaining = sentence;
              while (remaining.length > 0) {
                chunks.push(remaining.substring(0, maxLength).trim());
                remaining = remaining.substring(maxLength);
              }
            } else {
              sentenceChunk = sentence;
            }
          }
        }

        if (sentenceChunk.trim()) {
          chunks.push(sentenceChunk.trim());
        }
      } else {
        // Paragraph fits in target, start new chunk with it
        currentChunk = trimmedParagraph;
      }
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Send message to Telegram with HTML formatting
 *
 * Uses HTML parse_mode for better formatting:
 * - <b>bold</b>
 * - <i>italic</i>
 * - <a href="url">link</a>
 *
 * Fallback to plain text if HTML parsing fails
 */
function sendTelegramMessage(text, useHtml = true) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: useHtml ? "HTML" : undefined,
      disable_web_page_preview: false
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          // If HTML parsing failed, try plain text fallback
          if (useHtml && data.includes('can\'t parse entities')) {
            console.warn('⚠️  HTML parsing failed, retrying with plain text...');
            resolve(sendTelegramMessage(text, false));
          } else {
            reject(new Error(`Telegram API error: ${res.statusCode} - ${data}`));
          }
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Format client info for display (with HTML formatting)
 */
function formatClientInfo(client) {
  if (!client) return 'N/A';

  const parts = [];
  if (client.spent) parts.push(`$${client.spent.toLocaleString()} spent`);
  if (client.rating) parts.push(`${client.rating}★`);
  if (client.hires) parts.push(`${client.hires} hires`);
  if (client.payment_verified) parts.push('✅ verified');
  if (client.country) parts.push(escapeHtml(client.country));

  return parts.join(' • ');
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log(`Sending proposal notification for: ${proposal.job_title}`);

    // 1. Build main message with HTML formatting
    const decisionEmoji = proposal.decision === 'STRONG GO' ? '🎯' : (proposal.decision === 'QUALIFIED MAYBE' ? '⚠️' : 'ℹ️');

    let mainMessage = `<b>${decisionEmoji} ${escapeHtml(proposal.decision)} • ${escapeHtml(proposal.platform.toUpperCase())} • ${proposal.confidence}% confidence</b>\n\n`;
    mainMessage += `<b>${escapeHtml(proposal.job_title)}</b>\n\n`;

    if (proposal.budget_range) mainMessage += `💰 ${escapeHtml(proposal.budget_range)}`;
    if (proposal.bid_amount) mainMessage += ` (bid: $${proposal.bid_amount})`;
    if (proposal.budget_range || proposal.bid_amount) mainMessage += '\n';

    if (proposal.client_info) mainMessage += `👤 ${formatClientInfo(proposal.client_info)}\n`;
    if (proposal.portfolio_match) mainMessage += `📁 Proof: ${escapeHtml(proposal.portfolio_match)}\n`;
    if (proposal.client_type) mainMessage += `🎭 Type: ${escapeHtml(proposal.client_type)}\n`;
    if (proposal.urgency) mainMessage += `⚡ Urgency: ${proposal.urgency}/10\n`;
    if (proposal.pain) mainMessage += `😰 Pain: ${proposal.pain}/10\n`;

    mainMessage += `\n━━━━━━━━━━━━━━━━━━━━\n<b>PROPOSAL:</b>\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    mainMessage += `${escapeHtml(proposal.proposal_text)}\n\n`;
    mainMessage += `<a href="${proposal.job_url}">🔗 View Job on ${escapeHtml(proposal.platform)}</a>`;

    // 2. Split and send message chunks
    const chunks = splitMessage(mainMessage);

    for (let i = 0; i < chunks.length; i++) {
      await sendTelegramMessage(chunks[i]);
      console.log(`✅ Message chunk ${i + 1}/${chunks.length} sent`);

      // Small delay between chunks
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Small delay before questions
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Send questions (one message per question)
    if (proposal.questions && proposal.questions.length > 0) {
      const questionsHeader = `<b>❓ Questions for Client (${proposal.questions.length}):</b>`;
      await sendTelegramMessage(questionsHeader);
      console.log('✅ Questions header sent');

      for (let i = 0; i < proposal.questions.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const questionMsg = `<b>Q${i + 1}:</b> ${escapeHtml(proposal.questions[i])}`;
        await sendTelegramMessage(questionMsg);
        console.log(`✅ Question ${i + 1} sent`);
      }
    }

    console.log('\n✨ All notifications sent successfully!');
    console.log(`📱 Check Telegram for proposal: ${proposal.job_title}`);

  } catch (err) {
    console.error(`\n❌ Error sending notifications: ${err.message}`);
    process.exit(1);
  }
}

main();
