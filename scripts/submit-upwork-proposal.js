#!/usr/bin/env node
/**
 * Upwork Proposal Submission Automation
 *
 * Uses Playwright to submit proposals to Upwork jobs.
 * Can be called from Python backend or run standalone.
 *
 * Usage:
 *   node submit-upwork-proposal.js <job-url> <proposal-text> <bid-amount> [connects]
 *
 * Environment Variables:
 *   BROWSER_HEADLESS=true/false (default: false for debugging)
 *   UPWORK_PROFILE_DIR (default: ~/.playwright/upwork-profile)
 *   OUTPUT_DIR (default: ./browser-sessions)
 */

import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const HEADLESS = process.env.BROWSER_HEADLESS === 'true';
const PROFILE_DIR = process.env.UPWORK_PROFILE_DIR || join(homedir(), '.playwright', 'upwork-profile');
const OUTPUT_DIR = process.env.OUTPUT_DIR || join(process.cwd(), 'browser-sessions');

// Human-like interaction helpers
async function humanClick(locator, sessionId) {
  // Random delay before click (500-1500ms) - simulates reading/thinking
  const thinkDelay = 500 + Math.random() * 1000;
  console.log(`[${sessionId}] 🤔 Thinking (${Math.round(thinkDelay)}ms)...`);
  await new Promise(resolve => setTimeout(resolve, thinkDelay));

  // Click with delay option for more natural interaction
  await locator.click({ delay: 50 + Math.random() * 100 });

  // Random delay after click (200-800ms) - simulates page reaction time
  const reactionDelay = 200 + Math.random() * 600;
  await new Promise(resolve => setTimeout(resolve, reactionDelay));
}

async function humanType(locator, text, sessionId) {
  // Random delay before typing (300-1000ms)
  const thinkDelay = 300 + Math.random() * 700;
  await new Promise(resolve => setTimeout(resolve, thinkDelay));

  // Type with random delays between keystrokes (30-80ms per char)
  await locator.fill(text, { delay: 30 + Math.random() * 50 });

  // Random delay after typing (200-600ms)
  const pauseDelay = 200 + Math.random() * 400;
  await new Promise(resolve => setTimeout(resolve, pauseDelay));
}

async function submitProposal(jobUrl, proposalText, bidAmount, connects = 6) {
  const sessionId = Date.now();
  const sessionDir = join(OUTPUT_DIR, `session-${sessionId}`);

  await mkdir(sessionDir, { recursive: true });

  console.log(`[${sessionId}] 🚀 Starting Upwork proposal submission`);
  console.log(`[${sessionId}] 📝 Job URL: ${jobUrl}`);
  console.log(`[${sessionId}] 💰 Bid Amount: $${bidAmount}`);
  console.log(`[${sessionId}] 🔌 Connects: ${connects}`);
  console.log(`[${sessionId}] 👁️  Headless: ${HEADLESS}`);

  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: HEADLESS,
    viewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    recordVideo: {
      dir: sessionDir,
      size: { width: 1280, height: 720 }
    }
  });

  try {
    const page = browser.pages()[0] || await browser.newPage();

    // Step 1: Navigate to job URL
    console.log(`[${sessionId}] 🌐 Navigating to job page...`);
    await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Human-like delay after page load (1-3 seconds)
    const readDelay = 1000 + Math.random() * 2000;
    console.log(`[${sessionId}] 👀 Reading page (${Math.round(readDelay)}ms)...`);
    await page.waitForTimeout(readDelay);

    await page.screenshot({ path: join(sessionDir, '01-job-page.png') });

    // Step 2: Check if already logged in
    console.log(`[${sessionId}] 🔐 Checking login status...`);
    const isLoggedIn = await checkLoginStatus(page);

    if (!isLoggedIn) {
      console.log(`[${sessionId}] ❌ Not logged in to Upwork`);
      console.log(`[${sessionId}] 💡 Please log in manually in the browser window`);
      console.log(`[${sessionId}] ⏸️  Waiting 60 seconds for manual login...`);

      // Wait for user to log in manually
      await page.waitForTimeout(60000);

      // Check again
      if (!await checkLoginStatus(page)) {
        throw new Error('Still not logged in after 60 seconds');
      }

      console.log(`[${sessionId}] ✅ Login detected`);
    } else {
      console.log(`[${sessionId}] ✅ Already logged in`);
    }

    // Step 3: Click "Submit a Proposal" button
    console.log(`[${sessionId}] 🔍 Looking for "Submit a Proposal" button...`);

    // Try multiple selectors (Upwork UI changes frequently)
    const submitButtonSelectors = [
      'button:has-text("Submit a Proposal")',
      'a:has-text("Submit a Proposal")',
      '[data-qa="submit-proposal"]',
      'button:has-text("Apply Now")',
      'a:has-text("Apply Now")'
    ];

    let submitButton = null;
    for (const selector of submitButtonSelectors) {
      submitButton = await page.locator(selector).first();
      if (await submitButton.count() > 0) {
        console.log(`[${sessionId}] ✅ Found button with selector: ${selector}`);
        break;
      }
    }

    if (!submitButton || await submitButton.count() === 0) {
      await page.screenshot({ path: join(sessionDir, 'error-no-button.png') });
      throw new Error('Could not find "Submit a Proposal" button');
    }

    await humanClick(submitButton, sessionId);
    console.log(`[${sessionId}] 👆 Clicked "Submit a Proposal"`);

    // Wait for proposal form to load
    await page.waitForTimeout(2000);
    await page.screenshot({ path: join(sessionDir, '02-proposal-form.png') });

    // Step 4: Fill proposal textarea
    console.log(`[${sessionId}] ✍️  Filling proposal text...`);

    const proposalTextareaSelectors = [
      'textarea[placeholder*="proposal"]',
      'textarea[placeholder*="cover letter"]',
      'textarea[name="coverLetter"]',
      '[data-qa="cover-letter"]',
      'textarea.air3-textarea'
    ];

    let proposalTextarea = null;
    for (const selector of proposalTextareaSelectors) {
      proposalTextarea = await page.locator(selector).first();
      if (await proposalTextarea.count() > 0) {
        console.log(`[${sessionId}] ✅ Found textarea with selector: ${selector}`);
        break;
      }
    }

    if (!proposalTextarea || await proposalTextarea.count() === 0) {
      await page.screenshot({ path: join(sessionDir, 'error-no-textarea.png') });
      throw new Error('Could not find proposal textarea');
    }

    await humanType(proposalTextarea, proposalText, sessionId);
    console.log(`[${sessionId}] ✅ Filled proposal text (${proposalText.length} chars)`);

    // Step 5: Set bid amount
    console.log(`[${sessionId}] 💵 Setting bid amount: $${bidAmount}...`);

    const bidInputSelectors = [
      'input[name="hourlyRate"]',
      'input[name="amount"]',
      'input[placeholder*="rate"]',
      '[data-qa="bid-amount"]',
      'input[type="number"]'
    ];

    let bidInput = null;
    for (const selector of bidInputSelectors) {
      bidInput = await page.locator(selector).first();
      if (await bidInput.count() > 0) {
        console.log(`[${sessionId}] ✅ Found bid input with selector: ${selector}`);
        break;
      }
    }

    if (bidInput && await bidInput.count() > 0) {
      await humanType(bidInput, bidAmount.toString(), sessionId);
      console.log(`[${sessionId}] ✅ Set bid amount: $${bidAmount}`);
    } else {
      console.log(`[${sessionId}] ⚠️  Could not find bid input - may be fixed-price job`);
    }

    await page.screenshot({ path: join(sessionDir, '03-filled-form.png') });

    // Step 6: Handle connects confirmation (if needed)
    console.log(`[${sessionId}] 🔌 Checking connects...`);
    await page.waitForTimeout(1000);

    // Step 7: Click "Send Proposal" button
    console.log(`[${sessionId}] 🚀 Looking for "Send" button...`);

    const sendButtonSelectors = [
      'button:has-text("Send")',
      'button:has-text("Submit")',
      '[data-qa="send-proposal"]',
      'button[type="submit"]'
    ];

    let sendButton = null;
    for (const selector of sendButtonSelectors) {
      sendButton = await page.locator(selector).first();
      if (await sendButton.count() > 0) {
        console.log(`[${sessionId}] ✅ Found send button with selector: ${selector}`);
        break;
      }
    }

    if (!sendButton || await sendButton.count() === 0) {
      await page.screenshot({ path: join(sessionDir, 'error-no-send-button.png') });
      throw new Error('Could not find "Send" button');
    }

    // SAFETY: Don't actually click in test mode
    const TEST_MODE = process.env.TEST_MODE === 'true';

    if (TEST_MODE) {
      console.log(`[${sessionId}] 🧪 TEST MODE: Would click "Send" button here`);
      await page.screenshot({ path: join(sessionDir, '04-ready-to-send.png') });
    } else {
      await humanClick(sendButton, sessionId);
      console.log(`[${sessionId}] 👆 Clicked "Send"`);

      // Wait for confirmation
      await page.waitForTimeout(3000);
      await page.screenshot({ path: join(sessionDir, '05-sent-confirmation.png') });

      // Check for success message
      const successIndicators = [
        'text="Proposal sent"',
        'text="Your proposal was sent"',
        'text="Successfully submitted"'
      ];

      let success = false;
      for (const indicator of successIndicators) {
        if (await page.locator(indicator).count() > 0) {
          success = true;
          console.log(`[${sessionId}] ✅ SUCCESS: Proposal submitted!`);
          break;
        }
      }

      if (!success) {
        console.log(`[${sessionId}] ⚠️  Could not find success confirmation - check screenshot`);
      }
    }

    // Save final state
    await page.screenshot({ path: join(sessionDir, '06-final.png') });

    const result = {
      success: true,
      sessionId,
      sessionDir,
      screenshots: [
        '01-job-page.png',
        '02-proposal-form.png',
        '03-filled-form.png',
        TEST_MODE ? '04-ready-to-send.png' : '05-sent-confirmation.png',
        '06-final.png'
      ],
      testMode: TEST_MODE
    };

    // Save result JSON
    await writeFile(
      join(sessionDir, 'result.json'),
      JSON.stringify(result, null, 2)
    );

    console.log(`[${sessionId}] ✅ Session complete`);
    console.log(`[${sessionId}] 📂 Output: ${sessionDir}`);

    return result;

  } catch (error) {
    console.error(`[${sessionId}] ❌ Error:`, error.message);

    // Try to capture error screenshot if page exists
    try {
      const page = browser.pages()[0];
      if (page) {
        await page.screenshot({ path: join(sessionDir, 'error-final.png') });
      }
    } catch (screenshotError) {
      console.error(`[${sessionId}] Could not capture error screenshot`);
    }

    const result = {
      success: false,
      sessionId,
      sessionDir,
      error: error.message
    };

    await writeFile(
      join(sessionDir, 'result.json'),
      JSON.stringify(result, null, 2)
    );

    throw error;

  } finally {
    await browser.close();
  }
}

async function checkLoginStatus(page) {
  // Check for logged-in indicators
  const loggedInIndicators = [
    '[data-qa="header-user-menu"]',
    'button:has-text("Find Work")',
    'a[href="/nx/find-work"]',
    '.nav-user-menu'
  ];

  for (const indicator of loggedInIndicators) {
    if (await page.locator(indicator).count() > 0) {
      return true;
    }
  }

  // Check for login page indicators
  const loginIndicators = [
    'input[name="login[username]"]',
    'input[type="email"]',
    'button:has-text("Log In")',
    'text="Log in to Upwork"'
  ];

  for (const indicator of loginIndicators) {
    if (await page.locator(indicator).count() > 0) {
      return false;
    }
  }

  // Uncertain - assume logged in
  return true;
}

// CLI usage
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [jobUrl, proposalText, bidAmount, connects] = process.argv.slice(2);

  if (!jobUrl || !proposalText || !bidAmount) {
    console.error('Usage: node submit-upwork-proposal.js <job-url> <proposal-text> <bid-amount> [connects]');
    console.error('');
    console.error('Environment Variables:');
    console.error('  TEST_MODE=true           - Dry run (dont actually submit)');
    console.error('  BROWSER_HEADLESS=true    - Run headless');
    console.error('  UPWORK_PROFILE_DIR=path  - Custom profile directory');
    console.error('  OUTPUT_DIR=path          - Custom output directory');
    process.exit(1);
  }

  submitProposal(jobUrl, proposalText, parseInt(bidAmount), parseInt(connects) || 6)
    .then(result => {
      console.log('\n✅ Submission complete:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Submission failed:', error.message);
      process.exit(1);
    });
}

export { submitProposal };
