import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scopelock.mindprotocol.ai';

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
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return staticEntries;
}
