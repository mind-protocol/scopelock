// F3: Content Quality - Cal.com, portfolio proof, social handles
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('F3: Content Quality', () => {
  test('Cal.com booking link present on contact page', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);

    // Check for Cal.com link
    const calLink = page.getByRole('link', { name: /schedule|book|cal\.com|30min/i });
    await expect(calLink).toBeVisible();

    const href = await calLink.getAttribute('href');
    expect(href).toContain('cal.com');
    expect(href).toContain('lester-reynolds-ieksyx');
  });

  test('Portfolio proof visible on homepage', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for portfolio items mentioned in AC.md
    // Terminal Velocity (1.1k stars), La Serenissima, UBC
    const portfolioSection = page.locator('text=/portfolio|proof|work|clients/i').first();
    await expect(portfolioSection).toBeVisible();

    // Look for GitHub stars indicator or project names
    const content = await page.textContent('body');
    expect(content).toMatch(/terminal velocity|la serenissima|ubc/i);
  });

  test('Social handles present and valid', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for social handles: @nlr_ai (X, Telegram), GitHub orgs
    const footer = page.locator('footer');

    // GitHub
    const githubLink = footer.getByRole('link', { name: /github/i });
    await expect(githubLink).toBeVisible();
    const githubHref = await githubLink.getAttribute('href');
    expect(githubHref).toMatch(/github\.com/);

    // X (Twitter)
    const xLink = footer.getByRole('link', { name: /x|twitter/i });
    if (await xLink.count() > 0) {
      const xHref = await xLink.getAttribute('href');
      expect(xHref).toMatch(/x\.com|twitter\.com/);
    }

    // LinkedIn
    const linkedinLink = footer.getByRole('link', { name: /linkedin/i });
    await expect(linkedinLink).toBeVisible();
    const linkedinHref = await linkedinLink.getAttribute('href');
    expect(linkedinHref).toMatch(/linkedin\.com/);
  });

  test('No broken proof links (portfolio URLs valid format)', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Find all links in proof/portfolio section
    const links = page.locator('a[href^="http"]');
    const count = await links.count();

    // Verify links are not placeholder URLs
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toMatch(/example\.com|placeholder|todo/i);
    }
  });
});
