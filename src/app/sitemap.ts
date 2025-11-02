import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scopelock.dev';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/pricing',
    '/faq',
    '/terms',
    '/privacy',
    '/process',
    '/case-studies',
    '/blog',
    '/contact',
    '/proof',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic proof pages
  let proofEntries: MetadataRoute.Sitemap = [];
  try {
    const proofIndexPath = path.join(process.cwd(), 'public', 'proof', 'index.json');
    if (fs.existsSync(proofIndexPath)) {
      const proofData = JSON.parse(fs.readFileSync(proofIndexPath, 'utf-8'));
      proofEntries = proofData.entries.map((entry: { tag: string; date: string }) => ({
        url: `${baseUrl}/proof/${entry.tag}`,
        lastModified: new Date(entry.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.warn('Could not read proof index for sitemap:', error);
  }

  return [...staticEntries, ...proofEntries];
}
