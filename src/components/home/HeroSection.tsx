'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { BRAND } from '@/data/innzoyData';
import MagneticButton from '@/components/common/MagneticButton';

export default function HeroSection() {
  const { openBooking } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Staggered entrance timing
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Multi-layer depth and typographic handoff on scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = sectionRef.current?.offsetHeight || window.innerHeight;

      if (scrollY <= heroHeight * 1.5) {
        // Midground image parallax
        if (imageRef.current) {
          const imgY = scrollY * 0.28;
          imageRef.current.style.transform = `translate3d(0, ${imgY}px, 0) scale(${Math.max(1, 1.05 - scrollY * 0.00006)})`;
        }

        // Foreground text morph / handoff
        if (textContainerRef.current) {
          const textY = scrollY * 0.45;
          const opacity = Math.max(0, 1 - scrollY / (heroHeight * 0.75));
          textContainerRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
          textContainerRef.current.style.opacity = `${opacity}`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#121412]"
      aria-label="Hero: Welcome to INNZOY"
    >
      {/* Background Architectural Canvas (Multi-layer Depth) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: loaded ? 'scale(1.01)' : 'scale(1.08)',
            filter: loaded ? 'brightness(0.82) blur(0px)' : 'brightness(0.68) blur(5px)',
            transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), filter 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
            alt="INNZOY Architectural Cloister and Light"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Cinematic multi-gradient lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75 pointer-events-none" />
      </div>

      {/* Foreground Content with Typographic Window Reveal */}
      <div
        ref={textContainerRef}
        className="relative z-10 h-full flex flex-col justify-end max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 pb-16 md:pb-24 will-change-transform"
      >
        {/* Editorial Eyebrow */}
        <div className="overflow-hidden mb-4">
          <div
            className="flex items-center space-x-3 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: loaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 110%, 0)',
              transitionDelay: '300ms',
            }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68]">
              {BRAND.name} · {BRAND.subname}
            </span>
            <span className="w-8 h-[1px] bg-white/20" />
          </div>
        </div>

        {/* Master Headline: Physical Window Mask Reveal Line-by-Line */}
        <div className="max-w-[1000px] mb-6">
          <h1 className="font-serif text-white uppercase tracking-tight leading-[0.92]">
            <span className="block overflow-hidden py-1">
              <span
                className="block text-[3.2rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.8rem] font-light transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: loaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 112%, 0)',
                  transitionDelay: '420ms',
                  willChange: 'transform',
                }}
              >
                A PLACE
              </span>
            </span>

            <span className="block overflow-hidden py-1">
              <span
                className="block text-[3.2rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.8rem] font-light italic text-[#E8DFD3] transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: loaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 112%, 0)',
                  transitionDelay: '560ms',
                  willChange: 'transform',
                }}
              >
                TO ARRIVE.
              </span>
            </span>
          </h1>
        </div>

        {/* Supporting Editorial Copy */}
        <div className="overflow-hidden mb-8 max-w-[480px]">
          <p
            className="text-stone-300 text-sm md:text-base font-light leading-relaxed transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: loaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 110%, 0)',
              transitionDelay: '700ms',
            }}
          >
            Thoughtfully designed stays shaped by architecture, vernacular stone, and the quiet art of being present.
          </p>
        </div>

        {/* CTAs with Magnetic Attraction */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 transition-opacity duration-800"
          style={{
            opacity: loaded ? 1 : 0,
            transitionDelay: '850ms',
          }}
        >
          <MagneticButton strength={7}>
            <Link
              href="/stays"
              data-cursor="EXPLORE"
              className="group inline-flex items-center space-x-3 text-xs font-mono uppercase tracking-[0.26em] text-white border-b border-white/40 pb-1.5 hover:border-[#A68A68] hover:text-[#A68A68] transition-colors duration-300"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </MagneticButton>

          <MagneticButton strength={7}>
            <button
              onClick={() => openBooking()}
              data-cursor="RESERVE"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 font-mono text-xs text-white uppercase tracking-[0.24em] transition-all duration-300"
            >
              BOOK A STAY
            </button>
          </MagneticButton>
        </div>

        {/* Bottom-right Architectural Coordinates */}
        <div
          className="absolute bottom-16 right-6 md:bottom-24 md:right-12 lg:right-16 text-right hidden md:block transition-opacity duration-1000"
          style={{
            opacity: loaded ? 1 : 0,
            transitionDelay: '1000ms',
          }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68]">
            {BRAND.destinationsList}
          </p>
          <p className="font-mono text-[10px] text-stone-400 mt-1">
            {BRAND.coordinates}
          </p>
        </div>
      </div>
    </section>
  );
}
