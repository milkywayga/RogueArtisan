import type { Metadata } from 'next';

import { CommissionPageContent } from '@/components/commission-page-content';

export const metadata: Metadata = {
  title: "Custom Leather Commissions & Maker's Choice",
  description:
    "Start a one-of-one custom leather commission. Bring your own direction or choose Maker's Choice, with commissions starting at $100 CAD.",
  alternates: {
    canonical: '/commission',
  },
  openGraph: {
    title: "Custom Leather Commissions & Maker's Choice | Rogue Artisan",
    description:
      "Bring your own direction or choose Maker's Choice for a one-of-one leather commission, starting at $100 CAD.",
    url: '/commission',
  },
};

const commissionStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://rogueleather.ca/commission/#webpage',
      url: 'https://rogueleather.ca/commission/',
      name: "Custom Leather Commissions & Maker's Choice | Rogue Artisan",
      description:
        "Start a one-of-one custom leather commission with your own direction or Maker's Choice.",
      isPartOf: { '@id': 'https://rogueleather.ca/#website' },
      about: { '@id': 'https://rogueleather.ca/#organization' },
      inLanguage: 'en-CA',
    },
    {
      '@type': 'Service',
      '@id': 'https://rogueleather.ca/commission/#service',
      name: 'Custom leather commissions',
      serviceType: 'One-of-one custom leathercraft commission',
      url: 'https://rogueleather.ca/commission/',
      provider: { '@id': 'https://rogueleather.ca/#organization' },
      description:
        "Collaborative and Maker's Choice commissions for one-of-one leather goods.",
      offers: {
        '@type': 'Offer',
        priceCurrency: 'CAD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: 100,
          priceCurrency: 'CAD',
        },
      },
    },
  ],
};

export default async function CommissionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialType =
    params.type === 'makers-choice' ? 'makers-choice' : 'guided';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(commissionStructuredData).replace(
            /</g,
            '\\u003c',
          ),
        }}
      />
      <CommissionPageContent initialType={initialType} />
    </>
  );
}
