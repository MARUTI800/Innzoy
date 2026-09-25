'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import MagneticButton from '@/components/common/MagneticButton';

const NAV_LINKS = [
  { href: '/stays', label: 'STAYS' },
  { href: '/destinations', label: 'DESTINATIONS' },
  { href: '/experiences', label: 'EXPERIENCES' },
  { href: '/journal', label: 'JOURNAL' },
  { href: '/about', label: 'ABOUT' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [menuOpen, closeMenu]);

  // Determine if the current page top has a dark full-bleed image (home and /stays/[slug])
  const isDarkHero = pathname === '/' || (pathname?.startsWith('/stays/') && pathname !== '/stays');
  const isLightText = !scrolled && isDarkHero;

  return (
    <>
      {/* Desktop / Mobile Top Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#171715]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
            : isDarkHero
            ? 'bg-transparent'
            : 'bg-[#F4F1EA]/80 backdrop-blur-sm'
        }`}
        role="banner"
      >
        <nav
          className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-[72px] md:h-[84px]"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className={`font-serif text-2xl md:text-3xl tracking-[0.08em] uppercase font-light transition-colors duration-300 ${
              isLightText ? 'text-[#FAF9F6]' : 'text-[#171715]'
            }`}
            aria-label="INNZOY Home"
          >
            INNZOY
          </Link>

          {/* Desktop Links with Left-to-Right Underline Expansion */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-1 font-mono text-[10px] uppercase tracking-[0.28em] transition-colors duration-300 ${
                    isActive
                      ? isLightText
                        ? 'text-white'
                        : 'text-[#171715]'
                      : isLightText
                      ? 'text-stone-300 hover:text-white'
                      : 'text-[#5A554D] hover:text-[#171715]'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Underline expanding from left to right */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1px] transition-transform duration-300 origin-left ${
                      isLightText ? 'bg-white' : 'bg-[#171715]'
                    } ${
                      isActive
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA + Mobile Hamburger */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:block">
              <MagneticButton strength={5}>
                <button
                  onClick={() => openBooking()}
                  data-cursor="RESERVE"
                  className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-all duration-300 border ${
                    isLightText
                      ? 'border-white/30 text-white hover:border-white hover:bg-white/10'
                      : 'border-[#171715]/25 text-[#171715] hover:border-[#171715] hover:bg-[#171715] hover:text-[#FAF9F6]'
                  }`}
                  aria-label="Book a stay"
                >
                  BOOK A STAY
                </button>
              </MagneticButton>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={toggleMenu}
              className={`lg:hidden relative w-7 h-5 flex flex-col justify-between transition-colors ${
                isLightText ? 'text-white' : 'text-[#171715]'
              }`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-full h-[1.5px] bg-current transition-all duration-400 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[9px]' : ''
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-current transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-current transition-all duration-400 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[9px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#121412] text-[#FAF9F6] transition-all duration-500 lg:hidden ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col justify-center items-start h-full px-8 sm:px-12 max-w-lg mx-auto">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block font-serif text-3xl sm:text-4xl uppercase tracking-tight mb-6 transition-all duration-500 text-stone-200 hover:text-white"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms',
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="w-full h-[1px] bg-white/10 my-8" />

          <button
            onClick={() => {
              closeMenu();
              openBooking();
            }}
            className="font-mono text-xs uppercase tracking-[0.24em] text-[#A68A68] hover:text-white transition-all duration-500"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: menuOpen ? '480ms' : '0ms',
            }}
          >
            BOOK A STAY →
          </button>

          <Link
            href="/contact"
            onClick={closeMenu}
            className="font-mono text-xs uppercase tracking-[0.24em] text-stone-400 hover:text-white mt-4 transition-all duration-500"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: menuOpen ? '560ms' : '0ms',
            }}
          >
            CONTACT DESK
          </Link>
        </div>
      </div>
    </>
  );
}
