/**
 * E2E Tests: Complete Compensation Flow (T7, T8)
 * Maps to: AC.md F1-F10 (Complete user flows)
 * Mission: mission-deck-compensation
 * Framework: Playwright
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Helper: Login as member
 */
async function loginAsMember(page: Page, username: string, password: string = 'test123') {
  await page.goto('https://deck.scopelock.mindprotocol.ai');
  await page.fill('[data-testid="username"]', username);
  await page.fill('[data-testid="password"]', password);
  await page.click('[data-testid="login-button"]');

  // Wait for dashboard to load
  await page.waitForSelector('[data-testid="deck-dashboard"]');
}

/**
 * Helper: Login as NLR
 */
async function loginAsNLR(page: Page) {
  await loginAsMember(page, 'nlr', 'admin789');
}

/**
 * T7: Complete Job Compensation Flow
 * Maps to: VALIDATION.md T7, AC.md F1-F3, F6
 *
 * Test scenario: Complete flow from job creation to payment
 */
test('complete job compensation flow', async ({ page }) => {
  // 1. Login as Member A
  await loginAsMember(page, 'member_a', 'test123');

  // 2. Create new job
  await page.click('[data-testid="create-job-button"]');
  await page.fill('[data-testid="job-title"]', 'Build AI Chatbot');
  await page.fill('[data-testid="job-client"]', 'TestCorp');
  await page.fill('[data-testid="job-value"]', '1500');
  await page.fill('[data-testid="job-due-date"]', '2025-11-20');
  await page.click('[data-testid="submit-job"]');

  // 3. Verify job appears with $0 initial earnings
  await expect(page.locator('[data-testid="job-card-chatbot"]')).toBeVisible();
  await expect(page.locator('[data-testid="your-interactions"]')).toHaveText('0');
  await expect(page.locator('[data-testid="potential-earning"]')).toHaveText('$0.00');

  // Verify team pool calculated correctly (30% of $1,500 = $450)
  await expect(page.locator('[data-testid="team-pool"]')).toHaveText('$450.00');

  // Verify mission fund contribution (5% of $1,500 = $75)
  await page.click('[data-testid="missions-tab"]');
  await expect(page.locator('[data-testid="mission-fund-balance"]')).toContainText('$75.00');
  await page.click('[data-testid="jobs-tab"]');

  // 4. Send 5 messages to Rafael
  for (let i = 0; i < 5; i++) {
    await page.click('[data-testid="job-card-chatbot"]');
    await page.fill('[data-testid="message-input"]', `Message ${i + 1} to Rafael`);
    await page.click('[data-testid="send-to-rafael"]');
    await page.waitForTimeout(300); // Wait for interaction to be tracked
  }

  // 5. Verify interaction count updated
  await expect(page.locator('[data-testid="your-interactions"]')).toHaveText('5');
  await expect(page.locator('[data-testid="team-total"]')).toHaveText('5');

  // 6. Verify earnings updated (5/5 × $450 = $450)
  await expect(page.locator('[data-testid="potential-earning"]')).toHaveText('$450.00');

  // 7. Verify top banner updated
  await expect(page.locator('[data-testid="total-earnings"]')).toContainText('$450.00');

  // 8. Login as Member B, send 3 messages
  await page.click('[data-testid="logout"]');
  await loginAsMember(page, 'member_b', 'test456');

  await page.click('[data-testid="job-card-chatbot"]');

  for (let i = 0; i < 3; i++) {
    await page.fill('[data-testid="message-input"]', `Member B message ${i + 1}`);
    await page.click('[data-testid="send-to-inna"]');
    await page.waitForTimeout(300);
  }

  // 9. Verify Member B earnings (3/8 × $450 = $168.75)
  await expect(page.locator('[data-testid="potential-earning"]')).toHaveText('$168.75');
  await expect(page.locator('[data-testid="total-earnings"]')).toContainText('$168.75');

  // 10. Login as NLR, trigger payment
  await page.click('[data-testid="logout"]');
  await loginAsNLR(page);

  await page.click('[data-testid="job-card-chatbot"]');
  await page.click('[data-testid="mark-payment-received"]');

  // Confirm cash received
  await page.check('[data-testid="confirm-cash-received"]');

  // Verify payment breakdown preview
  await expect(page.locator('[data-testid="payment-breakdown"]')).toBeVisible();
  await expect(page.locator('[data-testid="payment-member-a-preview"]')).toHaveText('$281.25');
  await expect(page.locator('[data-testid="payment-member-b-preview"]')).toHaveText('$168.75');

  // Confirm payment
  await page.click('[data-testid="confirm-payment"]');

  // 11. Verify payment breakdown displayed
  await expect(page.locator('[data-testid="payment-member-a"]')).toHaveText('$281.25');
  await expect(page.locator('[data-testid="payment-member-b"]')).toHaveText('$168.75');

  // 12. Verify job status changed to "Paid"
  await expect(page.locator('[data-testid="job-status"]')).toHaveText('Paid');

  // 13. Verify notifications sent (check notification panel)
  await page.click('[data-testid="notifications"]');
  await expect(page.locator('[data-testid="notification-payment-member-a"]')).toContainText('You earned $281.25 from Build AI Chatbot');
  await expect(page.locator('[data-testid="notification-payment-member-b"]')).toContainText('You earned $168.75 from Build AI Chatbot');
});

/**
 * T8: Mission Claiming and Completion Flow
 * Maps to: VALIDATION.md T8, AC.md F4-F5
 */
test('mission claiming and completion flow', async ({ page }) => {
  // 1. Login as member with 10 interactions (meets minimum)
  await loginAsMember(page, 'member_a', 'test123');

  // Ensure member has ≥5 interactions (prerequisite for claiming missions)
  // Assuming test data already seeded

  // 2. Navigate to MISSIONS section
  await page.click('[data-testid="missions-tab"]');

  // 3. Verify mission fund balance visible
  await expect(page.locator('[data-testid="mission-fund-balance"]')).toContainText('$150.00');

  // 4. Claim "Write proposal" mission ($1)
  await page.click('[data-testid="mission-claim-proposal"]');

  // Confirmation modal appears
  await expect(page.locator('[data-testid="claim-confirmation-modal"]')).toBeVisible();
  await expect(page.locator('[data-testid="claim-amount"]')).toHaveText('$1.00');

  await page.click('[data-testid="confirm-claim"]');

  // 5. Verify mission status changed to "Claimed by You"
  await expect(page.locator('[data-testid="mission-status-proposal"]')).toHaveText('Claimed by You');
  await expect(page.locator('[data-testid="mission-button-proposal"]')).toHaveText('Mark Complete');

  // 6. Mark mission complete with proof
  await page.click('[data-testid="mission-button-proposal"]');

  // Completion modal appears
  await expect(page.locator('[data-testid="completion-modal"]')).toBeVisible();

  await page.fill('[data-testid="proof-url"]', 'https://upwork.com/job/123/proposal');
  await page.fill('[data-testid="proof-notes"]', 'Submitted proposal for AI Dashboard job');

  await page.click('[data-testid="submit-completion"]');

  // 7. Verify mission status "Pending Approval"
  await expect(page.locator('[data-testid="mission-status-proposal"]')).toHaveText('Pending Approval');

  // 8. Login as NLR, approve mission
  await page.click('[data-testid="logout"]');
  await loginAsNLR(page);

  await page.click('[data-testid="missions-tab"]');

  // NLR sees pending missions
  await expect(page.locator('[data-testid="mission-pending-proposal"]')).toBeVisible();

  // Review proof
  await page.click('[data-testid="mission-review-proposal"]');
  await expect(page.locator('[data-testid="proof-url-display"]')).toHaveText('https://upwork.com/job/123/proposal');

  // Approve
  await page.click('[data-testid="mission-approve-proposal"]');

  // Confirmation
  await expect(page.locator('[data-testid="approval-success"]')).toContainText('Mission approved');

  // 9. Verify mission earnings added to member total
  await page.click('[data-testid="logout"]');
  await loginAsMember(page, 'member_a', 'test123');

  // Check top banner earnings increased by $1
  await expect(page.locator('[data-testid="total-earnings"]')).toContainText('+$1.00');

  // 10. Verify mission fund decreased
  await page.click('[data-testid="missions-tab"]');
  await expect(page.locator('[data-testid="mission-fund-balance"]')).toContainText('$149.00');
});

/**
 * Test: Mission claim expiry after 24 hours
 * Maps to: AC.md F4
 */
test('mission claim expires after 24 hours', async ({ page }) => {
  // Setup: Login and claim mission
  await loginAsMember(page, 'member_a', 'test123');

  await page.click('[data-testid="missions-tab"]');
  await page.click('[data-testid="mission-claim-xpost"]');
  await page.click('[data-testid="confirm-claim"]');

  // Verify claimed
  await expect(page.locator('[data-testid="mission-status-xpost"]')).toHaveText('Claimed by You');

  // Simulate time passage (25 hours) - requires backend mock or time manipulation
  // For testing purposes, trigger expiry check endpoint
  await page.evaluate(() => {
    fetch('/api/missions/check-expiry', { method: 'POST' });
  });

  await page.waitForTimeout(1000);
  await page.reload();

  // Verify reverted to available
  await expect(page.locator('[data-testid="mission-status-xpost"]')).toHaveText('Available');
});

/**
 * Test: Cannot claim mission with insufficient interactions
 * Maps to: AC.md F4
 */
test('cannot claim mission with insufficient interactions', async ({ page }) => {
  // Login as member with only 3 interactions
  await loginAsMember(page, 'member_new', 'test789');

  await page.click('[data-testid="missions-tab"]');

  // Claim button should be disabled
  const claimButton = page.locator('[data-testid="mission-claim-proposal"]');
  await expect(claimButton).toBeDisabled();

  // Tooltip shows reason
  await claimButton.hover();
  await expect(page.locator('[data-testid="claim-disabled-tooltip"]')).toContainText('Need 5+ interactions to claim missions. Currently: 3');
});

/**
 * Test: Earnings breakdown modal displays correctly
 * Maps to: AC.md F7
 */
test('earnings breakdown modal displays correctly', async ({ page }) => {
  // Login
  await loginAsMember(page, 'member_a', 'test123');

  // Click "View Earnings Breakdown" from top banner
  await page.click('[data-testid="view-earnings-breakdown"]');

  // Modal opens
  await expect(page.locator('[data-testid="earnings-breakdown-modal"]')).toBeVisible();

  // Verify tabs
  await expect(page.locator('[data-testid="tab-active-jobs"]')).toBeVisible();
  await expect(page.locator('[data-testid="tab-completed-missions"]')).toBeVisible();

  // Active Jobs tab shows job details
  const job1 = page.locator('[data-testid="job-breakdown-chatbot"]');
  await expect(job1).toContainText('20 interactions');
  await expect(job1).toContainText('$90.00 potential');

  // Switch to Completed Missions tab
  await page.click('[data-testid="tab-completed-missions"]');

  // Verify completed missions listed
  await expect(page.locator('[data-testid="mission-completed-proposal"]')).toContainText('$1.00');
  await expect(page.locator('[data-testid="mission-status-pending"]')).toContainText('Pending payment');

  // Verify Paid History section
  await expect(page.locator('[data-testid="paid-history"]')).toBeVisible();
  await expect(page.locator('[data-testid="paid-job-voice-ai"]')).toContainText('$120.00 (Paid Nov 1)');
});

/**
 * Test: Interaction history audit trail
 * Maps to: AC.md F9
 */
test('interaction history audit trail', async ({ page }) => {
  // Login
  await loginAsMember(page, 'member_a', 'test123');

  // Click on job card
  await page.click('[data-testid="job-card-chatbot"]');

  // Click on "Your interactions: 20"
  await page.click('[data-testid="your-interactions"]');

  // Modal opens with interaction history
  await expect(page.locator('[data-testid="interaction-history-modal"]')).toBeVisible();
  await expect(page.locator('[data-testid="modal-title"]')).toHaveText('Build Chatbot - TherapyKin - Your Interaction History');

  // Verify table structure
  await expect(page.locator('[data-testid="history-table"]')).toBeVisible();

  // Verify first row (newest first)
  const firstRow = page.locator('[data-testid="interaction-row-0"]');
  await expect(firstRow.locator('[data-testid="timestamp"]')).toContainText('2025-11-07 14:23:15');
  await expect(firstRow.locator('[data-testid="message-preview"]')).toContainText('Rafael, implement OTP flow...');
  await expect(firstRow.locator('[data-testid="ai-recipient"]')).toHaveText('→ Rafael');

  // Test search/filter
  await page.fill('[data-testid="filter-ai"]', 'Rafael');
  await expect(page.locator('[data-testid="interaction-row"]')).toHaveCount(15); // Filtered to Rafael only

  // Test export
  await page.click('[data-testid="export-csv"]');
  // Verify download triggered (check downloads)
});

/**
 * Test: Mobile responsive layout
 * Maps to: AC.md F10
 */
test('mobile responsive layout', async ({ page, context }) => {
  // Set mobile viewport (iPhone SE - 320px width)
  await page.setViewportSize({ width: 320, height: 568 });

  // Login
  await loginAsMember(page, 'member_a', 'test123');

  // Verify top banner stacks vertically
  const banner = page.locator('[data-testid="earnings-banner"]');
  await expect(banner).toHaveCSS('flex-direction', 'column');

  // Verify earnings text layout
  await expect(page.locator('[data-testid="banner-label"]')).toContainText('YOUR TOTAL');
  await expect(page.locator('[data-testid="banner-amount"]')).toContainText('$164.00');

  // Verify job card abbreviated view
  const jobCard = page.locator('[data-testid="job-card-chatbot"]');
  await expect(jobCard).toBeVisible();

  // Tap to expand
  await jobCard.click();
  await expect(page.locator('[data-testid="job-details-expanded"]')).toBeVisible();

  // Verify mission cards vertical layout
  await page.click('[data-testid="missions-tab"]');
  const missionCard = page.locator('[data-testid="mission-card-proposal"]');
  await expect(missionCard).toHaveCSS('flex-direction', 'column');

  // Verify buttons have 44px minimum touch target
  const claimButton = page.locator('[data-testid="mission-claim-proposal"]');
  const boundingBox = await claimButton.boundingBox();
  expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
});
