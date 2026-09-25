'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BRAND, DESTINATIONS } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer
      className="bg-[#121412] text-[#FAF9F6] pt-28 pb-16 md:pt-44 md:pb-20 border-t border-white/10"
      role="contentinfo"
    >
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Giant INNZOY Wordmark with Vertical Mask Reveal */}
        <ScrollReveal variant="clip-up" duration={1200}>
          <div className="mb-20 md:mb-28 overflow-hidden">
            <Link
              href="/"
              className="group block font-serif text-[4.5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] font-light leading-none tracking-tight text-[#FAF9F6] hover:text-[#A68A68] transition-colors duration-500 select-none uppercase"
              aria-label="INNZOY Home"
            >
              INNZOY
            </Link>
          </div>
        </ScrollReveal>

        {/* 4-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20 md:mb-28 pt-12 border-t border-white/10">
          {/* Column 1: Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
              NAVIGATE
            </span>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-widest">
              {[
                { href: '/stays', label: 'All Stays' },
                { href: '/destinations', label: 'Destinations' },
                { href: '/experiences', label: 'Experiences' },
                { href: '/journal', label: 'Journal' },
                { href: '/about', label: 'About & Ethos' },
                { href: '/contact', label: 'Concierge Desk' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Regional Sanctuaries (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
              REGIONS
            </span>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-widest">
              {DESTINATIONS.map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/destinations#${dest.id}`}
                    className="text-stone-400 hover:text-white transition-colors duration-200 flex items-center justify-between pr-8"
                  >
                    <span>{dest.name}</span>
                    <span className="text-[10px] text-stone-500">{dest.country}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Liaison (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
              DIRECT DESK
            </span>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[9px] text-stone-400 uppercase tracking-widest block">RESERVATIONS</span>
                <a
                  href={`tel:${BRAND.contact.reservationsPhone}`}
                  className="text-stone-200 hover:text-[#A68A68] transition-colors"
                >
                  {BRAND.contact.reservationsPhone}
                </a>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 uppercase tracking-widest block">CONCIERGE</span>
                <a
                  href={`mailto:${BRAND.contact.conciergeEmail}`}
                  className="text-stone-200 hover:text-[#A68A68] transition-colors"
                >
                  {BRAND.contact.conciergeEmail}
                </a>
              </div>
              <p className="text-[11px] text-stone-400 font-sans font-light pt-1">
                {BRAND.contact.office}
              </p>
            </div>
          </div>

          {/* Column 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
              EDITORIAL DISPATCHES
            </span>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Occasional dispatches on vernacular architecture, regional cuisine, and the art of unhurried arrival.
            </p>

            {subscribed ? (
              <p className="font-mono text-[10px] text-[#A68A68] uppercase tracking-wider py-3 border-b border-white/20">
                THANK YOU. YOU WILL RECEIVE OUR NEXT DISPATCH.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
                <div className="flex border-b border-white/20 pb-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-transparent text-white text-xs flex-1 outline-none placeholder:text-stone-400 font-sans"
                    aria-label="Email for dispatch subscription"
                  />
                  <button
                    type="submit"
                    className="font-mono text-[10px] uppercase tracking-widest text-[#A68A68] hover:text-white pl-3 transition-colors cursor-pointer"
                  >
                    JOIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Rule & Metadata */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.24em] text-stone-400">
          <p>© {new Date().getFullYear()} INNZOY HOTELS & RESORTS · ALL RIGHTS RESERVED</p>
          <div className="flex items-center gap-6">
            <span>26.9124° N / 75.7873° E</span>
            <Link href="/about" className="hover:text-white transition-colors">
              LEGAL & PRIVACY
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
