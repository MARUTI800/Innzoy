import { MetadataRoute } from 'next';
import { PROPERTIES } from '@/data/innzoyData';

const BASE_URL = 'https://hotel-innzoy.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { url: BASE_URL, priority: 1 },
    { url: `${BASE_URL}/stays`, priority: 0.9 },
    { url: `${BASE_URL}/about`, priority: 0.6 },
    { url: `${BASE_URL}/contact`, priority: 0.6 },
  ].map((route) => ({
    ...route,
    lastModified: now,
    changeFrequency: 'monthly' as const,
  }));

  const propertyRoutes = PROPERTIES.map((property) => ({
    url: `${BASE_URL}/stays/${property.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
