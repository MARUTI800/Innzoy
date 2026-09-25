import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { GalleryProvider } from '@/components/common/GalleryLightbox';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BookingModal from '@/components/common/BookingModal';
import CustomCursor from '@/components/common/CustomCursor';
import SmoothScroll from '@/components/common/SmoothScroll';
import ScrollProgress from '@/components/common/ScrollProgress';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'INNZOY — Contemporary Luxury Hospitality Group',
  description:
    'Discover INNZOY hotels, sanctuaries, and residences — architectural calm, tactile materials, and quiet hospitality across Jaipur, Goa, Udaipur, the Himalayas, and Hyderabad.',
  keywords: [
    'INNZOY',
    'luxury boutique hotel',
    'quiet luxury hospitality',
    'architectural sanctuary',
    'Jaipur heritage stay',
    'Goa pavilion villa',
    'Udaipur lake cloister',
    'Himalayas alpine retreat',
    'Hyderabad Jubilee Hills',
  ],
  authors: [{ name: 'INNZOY Hospitality Group' }],
  metadataBase: new URL('https://hotel-innzoy.vercel.app'),
  openGraph: {
    title: 'INNZOY — Contemporary Luxury Hospitality Group',
    description:
      'Curated boutique sanctuaries, private pavilions, and alpine chalets. Architectural calm, tactile materials, and human warmth.',
    url: 'https://hotel-innzoy.vercel.app',
    siteName: 'INNZOY',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85',
        width: 1200,
        height: 630,
        alt: 'INNZOY Hotels & Resorts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INNZOY — Contemporary Luxury Hospitality Group',
    description:
      'Curated boutique sanctuaries and residences. Quiet luxury, human warmth, and architectural calm.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85',
    ],
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
    name: 'INNZOY Hotels & Resorts',
    url: 'https://hotel-innzoy.vercel.app',
    logo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85',
    description:
      'Curated boutique sanctuaries, private pavilions, and alpine chalets across Jaipur, Goa, Udaipur, the Himalayas, and Hyderabad.',
    telephone: '+91 85209 63096',
    email: 'concierge@innzoy.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jubilee Hills',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500033',
      addressCountry: 'IN',
    },
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${spaceMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#F4F1EA] text-[#171715]">
        <BookingProvider>
          <GalleryProvider>
            <SmoothScroll>
              {/* Subtle Scroll Progress Indicator */}
              <ScrollProgress />

              {/* Film grain effect */}
              <div className="film-grain" aria-hidden="true" />

              {/* Custom interactive desktop cursor */}
              <CustomCursor />

              {/* Global minimal navigation */}
              <Navbar />

              {/* Page content */}
              <main className="min-h-screen">{children}</main>

              {/* Global slide-over reservation drawer */}
              <BookingModal />

              {/* Global editorial footer */}
              <Footer />
            </SmoothScroll>
          </GalleryProvider>
        </BookingProvider>
      </body>
    </html>
  );
}
