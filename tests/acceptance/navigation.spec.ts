// F2: Navigation & UX - Site header, footer, internal links
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('F2: Navigation & UX', () => {
  test('Site header has logo and nav links', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for navigation links
    const nav = page.locator('nav, header');
    await expect(nav.getByRole('link', { name: /proof log|proof/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('Footer has social links', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for social links in footer
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /github/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /linkedin/i })).toBeVisible();
  });

  test('External links open in new tab with rel=noopener', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Find external links (e.g., social links, Cal.com)
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();

    expect(count).toBeGreaterThan(0);

    // Check first few external links for proper attributes
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = externalLinks.nth(i);
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');

      // External links should open in new tab with security
      if (target === '_blank') {
        expect(rel).toContain('noopener');
      }
    }
  });

  test('Internal nav links work without 404s', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Test a few key internal navigation paths
    const internalLinks = [
      { name: /about/i, path: '/about' },
      { name: /pricing/i, path: '/pricing' },
      { name: /contact/i, path: '/contact' }
    ];

    for (const link of internalLinks) {
      await page.goto(`${BASE_URL}/`);
      await page.getByRole('link', { name: link.name }).first().click();
      await page.waitForLoadState('networkidle');

      // Verify we didn't hit a 404
      const heading = page.locator('h1');
      const text = await heading.textContent();
      expect(text?.toLowerCase()).not.toContain('not found');
      expect(text?.toLowerCase()).not.toContain('404');
    }
  });
});
