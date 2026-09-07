import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rogueleather.ca'),
  title: {
    default: 'Custom Leather Goods & One-of-One Commissions | Rogue Artisan',
    template: '%s | Rogue Artisan',
  },
  description:
    'Commission a one-of-one leather wallet, card holder, cover, or small good from Rogue Artisan. Choose every detail or leave the aesthetic to the maker.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    siteName: 'Rogue Artisan',
    title: 'Custom Leather Goods & One-of-One Commissions | Rogue Artisan',
    description:
      'Commission a one-of-one leather wallet, card holder, cover, or small good. Choose every detail or leave the aesthetic to the maker.',
    type: 'website',
    locale: 'en_CA',
    url: '/',
    images: [
      {
        url: '/og.jpg',
        width: 675,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Handcrafted Rogue Artisan leatherwork',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Leather Goods & One-of-One Commissions | Rogue Artisan',
    description:
      'Commission a one-of-one leather wallet, card holder, cover, or small good from Rogue Artisan.',
    images: ['/og.jpg'],
  },
  icons: { icon: '/media/rogue-logo-1-vector.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
