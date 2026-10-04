import type { Metadata } from 'next';
import { Barlow_Condensed, Manrope, Newsreader, Space_Mono } from 'next/font/google';
import './globals.css';
import { GalleryProvider } from '@/components/common/GalleryLightbox';
import { BookingProvider } from '@/components/booking/BookingProvider';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PageTransition from '@/components/common/PageTransition';
import { BRAND } from '@/data/innzoyData';

const brand = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-brand',
  display: 'swap',
});

const editorial = Newsreader({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
});

const information = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-information',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

const SITE_URL = 'https://hotel-innzoy.vercel.app';
const DESCRIPTION =
  'Innzoy Hotels and Guest Houses — affordable, well-kept stays across Khajaguda, DLF Road, TNGO Colony, HITEC City, Jubilee Hills, Manikonda, Kondapur and Gopanpally in Hyderabad.';

export const metadata: Metadata = {
  title: 'Innzoy — Hotels & Guest Houses in Hyderabad',
  description: DESCRIPTION,
  keywords: [
    'Innzoy',
    'hotels in Hyderabad',
    'budget hotels Gachibowli',
    'guest house Hyderabad',
    'Khajaguda hotel',
    'HITEC City hotel',
    'Manikonda guest house',
    'corporate stays Hyderabad',
  ],
  authors: [{ name: 'Innzoy Hotels and Guesthouses' }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Innzoy — Hotels & Guest Houses in Hyderabad',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Innzoy',
    images: [{ url: BRAND.heroImage, width: 1200, height: 630, alt: 'Innzoy Hotels' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innzoy — Hotels & Guest Houses in Hyderabad',
    description: DESCRIPTION,
    images: [BRAND.heroImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelGroup',
    name: 'Innzoy Hotels and Guesthouses',
    url: SITE_URL,
    description: DESCRIPTION,
    telephone: BRAND.contact.phone,
    email: BRAND.contact.email,
    sameAs: [BRAND.contact.instagram],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4th Floor, Sri Sai Sigma 2, Kondapur',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500084',
      addressCountry: 'IN',
    },
  };

  return (
    <html lang="en" className={`${brand.variable} ${editorial.variable} ${information.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <BookingProvider>
          <GalleryProvider>
              <Navbar />
              <main className="min-h-screen"><PageTransition>{children}</PageTransition></main>
              <Footer />
          </GalleryProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
