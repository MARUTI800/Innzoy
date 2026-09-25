'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { BRAND, DESTINATIONS } from '@/data/innzoyData';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#141413] text-[#FAF8F5] pt-24 pb-12 px-6 md:px-12 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Editorial Invitation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-white/10">
          <div className="lg:col-span-7">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              THE NEXT CHAPTER
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.05]">
              WHERE WILL
              <br />
              YOU GO NEXT?
            </h2>
            <p className="mt-6 text-[#99938A] max-w-md text-sm md:text-base leading-relaxed font-light">
              Thoughtfully curated urban sanctuaries and countryside retreats across Hyderabad,
              Rajasthan, and emerging destinations.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <div className="bg-[#1C1B19] p-8 border border-white/10">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
                NEWSLETTER
              </span>
              <h3 className="font-serif text-2xl font-light mb-2">Notes from the road</h3>
              <p className="text-xs text-[#99938A] mb-6 leading-relaxed">
                Seasonal architectural dispatches, quiet retreat openings, and cultural reflections.
              </p>

              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs font-mono text-[#B89F7D] py-3">
                  <Check className="w-4 h-4" />
                  <span>You are subscribed to INNZOY Dispatches.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 bg-[#141413] border border-white/20 px-4 py-3 text-xs text-[#FAF8F5] placeholder-[#726E67] focus:outline-none focus:border-[#B89F7D] font-sans"
                  />
                  <button
                    type="submit"
                    className="px-5 bg-[#FAF8F5] text-[#141413] text-xs font-mono uppercase tracking-widest font-medium hover:bg-[#B89F7D] hover:text-white transition-colors"
                  >
                    JOIN
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Middle Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/10 text-xs font-mono">
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#B89F7D] mb-5">PORTFOLIO</h4>
            <ul className="space-y-3 font-sans text-xs">
              <li>
                <Link href="/stays" className="text-stone-400 hover:text-white transition-colors">
                  All Stays & Sanctuaries
                </Link>
              </li>
              <li>
                <Link
                  href="/stays/jubilee-hills"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Jubilee Hills Villa
                </Link>
              </li>
              <li>
                <Link
                  href="/stays/kondapur"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Kondapur Penthouse
                </Link>
              </li>
              <li>
                <Link
                  href="/stays/mokila"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Mokila Country Retreat
                </Link>
              </li>
              <li>
                <Link
                  href="/stays/dlf-road"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  DLF Cyber City Hotel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#B89F7D] mb-5">
              DESTINATIONS
            </h4>
            <ul className="space-y-3 font-sans text-xs">
              {DESTINATIONS.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/destinations#${d.id}`}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#B89F7D] mb-5">
              EXPLORATION
            </h4>
            <ul className="space-y-3 font-sans text-xs">
              <li>
                <Link
                  href="/experiences"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Curated Experiences
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-stone-400 hover:text-white transition-colors">
                  Editorial Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-stone-400 hover:text-white transition-colors">
                  Architectural Philosophy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-400 hover:text-white transition-colors">
                  Concierge & Reservations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#B89F7D] mb-5">
              DIRECT CONCIERGE
            </h4>
            <p className="text-stone-400 font-sans text-xs mb-2">24/7 Silent Human Host</p>
            <p className="font-serif text-lg text-white mb-2">{BRAND.contact.phone}</p>
            <p className="text-stone-400 font-sans text-xs mb-4">{BRAND.contact.email}</p>
            <a
              href={BRAND.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-[#B89F7D] hover:underline"
            >
              <span>WhatsApp Concierge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Large Architectural Wordmark */}
        <div className="py-12 md:py-16 text-center select-none overflow-hidden">
          <span className="font-serif text-[18vw] leading-none tracking-[0.16em] text-white/[0.04] uppercase font-light inline-block">
            INNZOY
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#726E67] pt-8 border-t border-white/5 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} INNZOY HOSPITALITY GROUP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-8">
            <span className="hover:text-stone-400 cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-stone-400 cursor-pointer">TERMS OF STAY</span>
            <span className="hover:text-stone-400 cursor-pointer">ARCHITECTURAL ARCHIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
