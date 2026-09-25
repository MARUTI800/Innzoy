'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'STAYS', href: '/stays' },
    { label: 'DESTINATIONS', href: '/destinations' },
    { label: 'EXPERIENCES', href: '/experiences' },
    { label: 'JOURNAL', href: '/journal' },
    { label: 'ABOUT', href: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-luxury ${
          scrolled || !isHome
            ? 'bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#141413]/8 py-4 text-[#141413] shadow-[0_4px_30px_rgba(0,0,0,0.02)]'
            : 'bg-transparent py-7 text-[#FAF8F5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* LEFT: INNZOY Wordmark */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span
              className={`font-serif text-2xl md:text-3xl font-light tracking-[0.22em] transition-colors duration-500 ${
                scrolled || !isHome ? 'text-[#141413]' : 'text-[#FAF8F5]'
              }`}
            >
              INNZOY
            </span>
            <span
              className={`font-mono text-[8px] uppercase tracking-[0.35em] -mt-1 transition-colors duration-500 opacity-60 ${
                scrolled || !isHome ? 'text-[#141413]' : 'text-[#FAF8F5]'
              }`}
            >
              HOTELS & RESORTS
            </span>
          </Link>

          {/* CENTER: Editorial Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300 relative py-1 ${
                    scrolled || !isHome
                      ? active
                        ? 'text-[#141413] font-semibold'
                        : 'text-[#141413]/70 hover:text-[#141413]'
                      : active
                      ? 'text-white font-semibold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1px] ${
                        scrolled || !isHome ? 'bg-[#141413]' : 'bg-white'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Action & Mobile Trigger */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => openBooking()}
              className={`group hidden sm:inline-flex items-center space-x-2.5 px-5 py-2.5 text-[10px] uppercase font-mono tracking-[0.22em] transition-all duration-500 border ${
                scrolled || !isHome
                  ? 'border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#FAF8F5]'
                  : 'border-white/80 text-white hover:bg-white hover:text-[#141413]'
              }`}
            >
              <span>BOOK A STAY</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors duration-300 focus:outline-none ${
                scrolled || !isHome ? 'text-[#141413]' : 'text-white'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE EDITORIAL MENU */}
      <div
        className={`fixed inset-0 z-40 bg-[#141413] text-[#FAF8F5] flex flex-col justify-between p-8 md:p-16 transition-all duration-700 ease-luxury ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-between items-center pt-4">
          <div>
            <span className="font-serif text-2xl tracking-[0.25em] text-[#FAF8F5]">INNZOY</span>
            <span className="block font-mono text-[9px] tracking-[0.35em] text-[#B89F7D]">
              HYDERABAD & BEYOND
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-stone-300 p-2 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <nav className="my-auto flex flex-col space-y-5">
          {navLinks.map((link, idx) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-baseline justify-between py-2 border-b border-white/10"
            >
              <div className="flex items-baseline space-x-4">
                <span className="font-mono text-[10px] text-[#B89F7D]">0{idx + 1}</span>
                <span className="font-serif text-3xl md:text-5xl tracking-wide group-hover:translate-x-2 transition-transform duration-500 font-light">
                  {link.label}
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-baseline justify-between py-2 border-b border-white/10"
          >
            <div className="flex items-baseline space-x-4">
              <span className="font-mono text-[10px] text-[#B89F7D]">06</span>
              <span className="font-serif text-3xl md:text-5xl tracking-wide group-hover:translate-x-2 transition-transform duration-500 font-light">
                CONCIERGE & CONTACT
              </span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-stone-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </Link>
        </nav>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-stone-400 uppercase">
              24/7 Silent Human Concierge
            </p>
            <p className="font-serif text-lg text-[#B89F7D]">+91 85209 63096</p>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openBooking();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FAF8F5] text-[#141413] font-mono text-xs uppercase tracking-[0.2em] font-medium"
          >
            RESERVE A SANCTUARY
          </button>
        </div>
      </div>
    </>
  );
}
