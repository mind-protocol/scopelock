// F4: SEO & Metadata - sitemap.xml, robots.txt, page titles, OpenGraph
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('F4: SEO & Metadata', () => {
  test('sitemap.xml exists and is valid', async ({ page, request }) => {
    const response = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('<url>');
  });

  test('robots.txt exists and allows indexing', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);
    expect(response?.status()).toBe(200);

    const content = await page.textContent('body');
    expect(content).toMatch(/user-agent/i);
    // Should not disallow all
    expect(content).not.toMatch(/disallow:\s*\/$/i);
  });

  test('Homepage has proper metadata', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(20);

    // Check OpenGraph metadata
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();
  });

  test('Favicon and brand assets present', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Check for favicon
    const favicon = page.locator('link[rel="icon"]');
    expect(await favicon.count()).toBeGreaterThan(0);

    const faviconHref = await favicon.first().getAttribute('href');
    expect(faviconHref).toBeTruthy();
  });

  test('All key pages have unique titles', async ({ page }) => {
    const pages = ['/', '/about', '/pricing', '/contact'];
    const titles = new Set<string>();

    for (const path of pages) {
      await page.goto(`${BASE_URL}${path}`);
      const title = await page.title();
      expect(title).toBeTruthy();
      titles.add(title);
    }

    // All titles should be unique
    expect(titles.size).toBe(pages.length);
  });
});
