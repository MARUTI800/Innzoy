import type { ReactNode } from 'react';
import '@/app/globals.css';
import { BookingProvider } from '@/components/booking/BookingProvider';
import { Barlow_Condensed, Manrope, Newsreader, Space_Mono } from 'next/font/google';

const brand = Barlow_Condensed({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-brand', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], variable: '--font-editorial', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-information', display: 'swap' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400','700'], variable: '--font-space-mono', display: 'swap' });

export default function FixtureLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={`${brand.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}><body><BookingProvider>{children}</BookingProvider></body></html>;
}
