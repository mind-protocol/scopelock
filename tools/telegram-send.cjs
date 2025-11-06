#!/usr/bin/env node

/**
 * General-Purpose Telegram Messenger
 *
 * Send formatted notifications to Telegram from any citizen or tool.
 *
 * Features:
 * - HTML formatting (bold, italic, links)
 * - Smart chunking (500 chars, paragraph-aware)
 * - Auto-escaping of HTML special characters
 * - Fallback to plain text if formatting fails
 *
 * Environment variables required:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 *
 * Usage:
 *   # Send simple message
 *   node telegram-send.cjs "Hello from Rafael!"
 *
 *   # Send with HTML formatting
 *   node telegram-send.cjs "<b>Task completed:</b> Mission AC Green ✅"
 *
 *   # Pipe message from stdin
 *   echo "Build completed successfully" | node telegram-send.cjs
 *
 *   # Send multi-line message (auto-chunks)
 *   node telegram-send.cjs "$(cat long-report.txt)"
 *
 * Created: 2025-11-05
 * Author: Rafael (ScopeLock Code Generation & DevOps)
 * Based on: Reddit research on Telegram formatting best practices
 */

const https = require('https');
const path = require('path');

// Load .env file from project root (one level up from /tools/)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Check environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('Error: Missing environment variables');
  console.error('Required: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID');
  process.exit(1);
}

/**
 * Escape HTML special characters
 * Only 3 chars need escaping in HTML mode: <, >, &
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Smart message chunking (500 chars, paragraph-aware)
 */
function splitMessage(text, targetLength = 500, maxLength = 4096) {
  if (text.length <= targetLength) {
    return [text];
  }

  const chunks = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    if (currentChunk.length + trimmedParagraph.length + 2 <= targetLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

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
        currentChunk = trimmedParagraph;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Send message to Telegram with HTML formatting
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
          // Fallback to plain text if HTML parsing fails
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
 * Main execution
 */
async function main() {
  try {
    // Get message from command line argument or stdin
    let message = '';

    if (process.argv[2]) {
      // Message from command line argument
      message = process.argv.slice(2).join(' ');
    } else if (!process.stdin.isTTY) {
      // Message from stdin (pipe)
      const stdin = require('fs').readFileSync(0, 'utf-8');
      message = stdin.trim();
    } else {
      console.error('Error: No message provided');
      console.error('Usage: node telegram-send.cjs "Your message here"');
      console.error('   Or: echo "message" | node telegram-send.cjs');
      process.exit(1);
    }

    if (!message) {
      console.error('Error: Empty message');
      process.exit(1);
    }

    // Split and send chunks
    const chunks = splitMessage(message);

    for (let i = 0; i < chunks.length; i++) {
      await sendTelegramMessage(chunks[i]);
      console.log(`✅ Message ${i + 1}/${chunks.length} sent`);

      // Small delay between chunks
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\n✨ Sent ${chunks.length} message(s) to Telegram`);

  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
