// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://unituspainting.com'; // Replace with your domain

  // Define all your routes
  const routes = [
    '',
    '/about',
    '/our-approach',
    '/warranty',
    '/services',
    '/services/cabinet-painting',
    '/services/carpentry',
    '/services/caulking',
    '/services/commercial-services',
    '/services/exterior-painting',
    '/services/interior-painting',
    '/services/line-painting',
    '/services/power-washing',
    '/services/repair',
    '/services/residential',
    '/services/strata-services',
    '/areas-served',
    '/blog',
    '/project-gallery',
    '/contact',
  ];

  // Create sitemap entries
  const sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return sitemap;
}