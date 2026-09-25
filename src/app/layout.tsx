import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BookingModal from '@/components/common/BookingModal';
import CustomCursor from '@/components/common/CustomCursor';
import SmoothScroll from '@/components/common/SmoothScroll';

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
  title: 'INNZOY — Hotels, Resorts & Places Worth Remembering',
  description:
    'Discover INNZOY hotels and resorts — thoughtfully designed stays, meaningful experiences and destinations shaped by place across Hyderabad, Rajasthan, and beyond.',
  keywords: [
    'INNZOY',
    'luxury boutique hotel Hyderabad',
    'Jubilee Hills villa',
    'HITEC City executive hotel',
    'Kondapur penthouse suite',
    'Mokila retreat',
    'architectural hospitality India',
    'quiet luxury hotel',
  ],
  authors: [{ name: 'INNZOY Hospitality Group' }],
  metadataBase: new URL('https://hotel-innzoy.vercel.app'),
  openGraph: {
    title: 'INNZOY — Hotels, Resorts & Places Worth Remembering',
    description:
      'Curated boutique hotels, private villas, and penthouses. Experience architectural calm, understated luxury, and 24/7 human concierge.',
    url: 'https://hotel-innzoy.vercel.app',
    siteName: 'INNZOY',
    images: [
      {
        url: 'https://innzoy.in/wp-content/uploads/2025/10/Hotel-Main-Elevation-e1763746501737-2048x1363.jpg',
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
    title: 'INNZOY — Hotels, Resorts & Places Worth Remembering',
    description:
      'Curated boutique hotels and residences. Quiet luxury, human warmth, and architectural calm.',
    images: [
      'https://innzoy.in/wp-content/uploads/2025/10/Hotel-Main-Elevation-e1763746501737-2048x1363.jpg',
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${spaceMono.variable}`}>
      <body className="antialiased bg-[#FAF8F5] text-[#141413]">
        <BookingProvider>
          <SmoothScroll>
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
        </BookingProvider>
      </body>
    </html>
  );
}
