import { PremiumHome } from '@/components/premium-home';

const businessStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://rogueleather.ca/#organization',
      name: 'Rogue Artisan',
      url: 'https://rogueleather.ca/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rogueleather.ca/media/rogue-logo-1-vector.svg',
        width: 1009,
        height: 1009,
      },
      image: 'https://rogueleather.ca/og.jpg',
      email: 'rogueartisan@outlook.com',
      description:
        "One-of-one custom leather goods created through collaborative commissions or Maker's Choice.",
      sameAs: ['https://www.instagram.com/rogue_artisan'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://rogueleather.ca/#website',
      url: 'https://rogueleather.ca/',
      name: 'Rogue Artisan',
      description:
        'One-of-one custom leather goods and made-to-order commissions.',
      publisher: { '@id': 'https://rogueleather.ca/#organization' },
      inLanguage: 'en-CA',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://rogueleather.ca/#webpage',
      url: 'https://rogueleather.ca/',
      name: 'Custom Leather Goods & One-of-One Commissions | Rogue Artisan',
      description:
        'Commission a one-of-one leather wallet, card holder, cover, or small good from Rogue Artisan.',
      isPartOf: { '@id': 'https://rogueleather.ca/#website' },
      about: { '@id': 'https://rogueleather.ca/#organization' },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://rogueleather.ca/og.jpg',
      },
      inLanguage: 'en-CA',
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessStructuredData).replace(
            /</g,
            '\\u003c',
          ),
        }}
      />
      <PremiumHome />
      <noscript>
        The gallery requires JavaScript for swiping, but the full site content
        is available above.
      </noscript>
    </>
  );
}
