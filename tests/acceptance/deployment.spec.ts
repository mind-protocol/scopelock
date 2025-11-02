// NF2: Deployment - Production site returns 200 with valid SSL
import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://scopelock.mindprotocol.ai';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('NF2: Deployment', () => {
  test.skip(BASE_URL !== PRODUCTION_URL, 'Production deployment checks');

  test('Production site returns HTTP 200', async ({ page }) => {
    const response = await page.goto(PRODUCTION_URL);
    expect(response?.status()).toBe(200);
  });

  test('SSL certificate is valid', async ({ page, context }) => {
    // Playwright will automatically fail if SSL is invalid
    // This test verifies we can connect with valid SSL
    const response = await page.goto(PRODUCTION_URL);
    expect(response?.status()).toBe(200);

    // If we got here, SSL is valid (Playwright would have thrown otherwise)
    expect(response?.url()).toContain('https://');
  });

  test('No console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });

    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    // Allow some non-critical errors but fail on serious issues
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') && // Favicon 404s are non-critical
      !err.includes('analytics') && // Analytics errors are non-critical
      !err.includes('Extension')    // Browser extension errors don't count
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
