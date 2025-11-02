// F1: Core Pages - All pages return HTTP 200
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const PAGES = [
  '/',
  '/about',
  '/pricing',
  '/faq',
  '/contact',
  '/proof',
  '/case-studies',
  '/process',
  '/blog',
  '/terms',
  '/privacy',
  '/404'
];

test.describe('F1: Core Pages', () => {
  for (const path of PAGES) {
    test(`${path} returns HTTP 200`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${path}`);
      expect(response?.status()).toBe(200);
    });
  }

  test('Homepage has hero section', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for key hero content
    await expect(page.getByRole('heading', { name: /lock the scope/i })).toBeVisible();
    await expect(page.getByText(/pay at ac green/i)).toBeVisible();
  });

  test('/proof page is ready for tags', async ({ page }) => {
    await page.goto(`${BASE_URL}/proof`);

    // Page should render without error even if no tags exist yet
    await expect(page.getByRole('heading', { name: /proof log/i })).toBeVisible();
  });
});
