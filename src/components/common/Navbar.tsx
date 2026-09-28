'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND, waLink } from '@/data/innzoyData';

const NAV_LINKS = [
  { href: '/stays?category=hotel', label: 'HOTELS' },
  { href: '/stays?category=guesthouse', label: 'GUEST HOUSES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

const BOOK_URL = waLink(
  BRAND.contact.whatsapp,
  'Hello, I would like to book a stay with Innzoy. Please share availability and rates.'
);

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
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

  const isDarkHero = pathname === '/' || (pathname?.startsWith('/stays/') && pathname !== '/stays');
  const isLightText = !scrolled && isDarkHero;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#171715]/10'
            : isDarkHero
            ? 'bg-transparent'
            : 'bg-[#F4F1EA]/90 backdrop-blur-sm'
        }`}
        role="banner"
      >
        <nav
          className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-[68px] md:h-[76px]"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={`font-serif text-2xl md:text-[1.75rem] tracking-[0.08em] uppercase font-light transition-colors duration-300 ${
              isLightText ? 'text-[#FAF9F6]' : 'text-[#171715]'
            }`}
            aria-label="Innzoy home"
          >
            INNZOY
          </Link>

          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => {
              const path = link.href.split('?')[0];
              const isActive = pathname === path;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-[10px] uppercase tracking-[0.24em] transition-colors duration-300 ${
                    isLightText
                      ? isActive
                        ? 'text-white'
                        : 'text-stone-300 hover:text-white'
                      : isActive
                      ? 'text-[#171715]'
                      : 'text-[#5A554D] hover:text-[#171715]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:inline-block px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                isLightText
                  ? 'bg-white/15 border border-white/30 text-white hover:bg-white hover:text-[#171715]'
                  : 'bg-[#171715] text-[#FAF9F6] hover:bg-[#A68A68]'
              }`}
            >
              Book Now
            </a>

            <button
              onClick={toggleMenu}
              className={`lg:hidden relative w-7 h-5 flex flex-col justify-between transition-colors ${
                isLightText && !menuOpen ? 'text-white' : 'text-[#171715]'
              }`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-full h-[1.5px] bg-current transition-transform duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[9px]' : ''
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-current transition-transform duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[9px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#F4F1EA] transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex flex-col justify-center items-start h-full px-8 sm:px-12 max-w-lg mx-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block font-serif text-3xl uppercase tracking-tight mb-6 text-[#171715] hover:text-[#A68A68] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="w-full h-[1px] bg-[#171715]/10 my-6" />

          <a
            href={BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="px-6 py-3.5 bg-[#171715] text-[#FAF9F6] font-mono text-[11px] uppercase tracking-[0.2em]"
          >
            Book Now
          </a>
        </div>
      </div>
    </>
  );
}
