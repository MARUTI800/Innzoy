import Link from 'next/link';
import { BRAND, HOTELS, GUEST_HOUSES, CORPORATE_BOOKING_URL } from '@/data/innzoyData';

export default function Footer() {
  return (
    <footer className="bg-[#121412] text-[#FAF9F6] pt-16 pb-10 border-t border-white/10" role="contentinfo">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          <div className="col-span-2 lg:col-span-3">
            <Link
              href="/"
              className="font-serif text-3xl font-light tracking-[0.08em] uppercase hover:text-[#A68A68] transition-colors"
            >
              INNZOY
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed mt-4 max-w-xs">
              {BRAND.tagline} Hotels and guest houses across Hyderabad.
            </p>
            <a
              href={BRAND.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors"
            >
              Instagram · innzoy_hotels
            </a>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A68A68] block">
              Hotels
            </span>
            <ul className="space-y-2.5 text-xs">
              {HOTELS.map((property) => (
                <li key={property.id}>
                  <Link
                    href={`/stays/${property.slug}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {property.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A68A68] block">
              Guest Houses
            </span>
            <ul className="space-y-2.5 text-xs">
              {GUEST_HOUSES.map((property) => (
                <li key={property.id}>
                  <Link
                    href={`/stays/${property.slug}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {property.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A68A68] block">
              Head Office
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">{BRAND.contact.headOffice}</p>
            <div className="space-y-1.5 text-xs">
              <a
                href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`}
                className="block text-stone-200 hover:text-[#A68A68] transition-colors"
              >
                {BRAND.contact.phone}
              </a>
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="block text-stone-200 hover:text-[#A68A68] transition-colors"
              >
                {BRAND.contact.email}
              </a>
            </div>
            <a
              href={CORPORATE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-[#A68A68] hover:text-white transition-colors"
            >
              Corporate Booking →
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-stone-500">
          <p>© {new Date().getFullYear()} Innzoy · All rights reserved</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
