import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://rogueleather.ca',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://rogueleather.ca/commission',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
