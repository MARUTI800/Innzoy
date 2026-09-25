'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { useBooking } from '@/context/BookingContext';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const introWordmarkRef = useRef<HTMLHeadingElement>(null);
  const heroImageContainerRef = useRef<HTMLDivElement>(null);
  const headlineLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  const { openBooking } = useBooking();
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (introOverlayRef.current) introOverlayRef.current.style.display = 'none';
      setIntroFinished(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => setIntroFinished(true),
      });

      // 1. Initial State
      gsap.set(introWordmarkRef.current, { opacity: 0, letterSpacing: '0.15em', y: 20 });
      gsap.set(heroImageContainerRef.current, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        scale: 1.08,
      });
      gsap.set(headlineLinesRef.current, { yPercent: 120, opacity: 0 });
      gsap.set(subtextRef.current, { opacity: 0, y: 30 });
      gsap.set(ctaGroupRef.current, { opacity: 0, y: 30 });
      gsap.set(metadataRef.current, { opacity: 0 });

      // 2. Intro Wordmark Animation
      tl.to(introWordmarkRef.current, {
        opacity: 1,
        y: 0,
        letterSpacing: '0.35em',
        duration: 1.2,
        ease: 'power3.out',
      })
        .to(introWordmarkRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.in',
        }, '+=0.4')
        // 3. Intro curtain lifts and Hero image reveals via smooth clip-path
        .to(introOverlayRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            if (introOverlayRef.current) {
              introOverlayRef.current.style.pointerEvents = 'none';
            }
          },
        }, '-=0.3')
        .to(heroImageContainerRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.8,
          ease: 'power3.inOut',
        }, '-=0.8')
        // 4. Headline reveals line-by-line
        .to(headlineLinesRef.current, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power4.out',
        }, '-=0.8')
        // 5. Subtext & CTA reveal
        .to(subtextRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
        }, '-=0.6')
        .to(ctaGroupRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
        }, '-=0.7')
        .to(metadataRef.current, {
          opacity: 1,
          duration: 1,
        }, '-=0.5');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#141413]">
      {/* 01. PRELOADER / INTRO OVERLAY */}
      <div
        ref={introOverlayRef}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] transition-opacity duration-700 ${
          introFinished ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <h1
          ref={introWordmarkRef}
          className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-[0.25em] text-[#141413] font-light"
        >
          INNZOY
        </h1>
        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#B89F7D] mt-3">
          QUIET LUXURY HOSPITALITY
        </p>
      </div>

      {/* 02. HERO BACKGROUND IMAGE WITH CINEMATIC LIGHTING */}
      <div
        ref={heroImageContainerRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2400&q=85"
          alt="INNZOY Architectural Sanctuaries"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.82] contrast-[1.05]"
        />

        {/* Luxury Vignette & Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/90 via-[#141413]/30 to-black/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#141413]/40" />
      </div>

      {/* 03. HERO CONTENT */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-24 text-[#FAF8F5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Headline Column */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden mb-3">
              <span className="inline-block font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#B89F7D]">
                INNZOY HOTELS & RESORTS
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.02] tracking-tight uppercase">
              <span className="block overflow-hidden">
                <span
                  ref={(el) => { headlineLinesRef.current[0] = el; }}
                  className="inline-block"
                >
                  STAY
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  ref={(el) => { headlineLinesRef.current[1] = el; }}
                  className="inline-block"
                >
                  SOMEWHERE
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  ref={(el) => { headlineLinesRef.current[2] = el; }}
                  className="inline-block"
                >
                  WORTH
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  ref={(el) => { headlineLinesRef.current[3] = el; }}
                  className="inline-block text-[#EDE5DC] italic font-normal"
                >
                  REMEMBERING.
                </span>
              </span>
            </h1>
          </div>

          {/* Subtext and CTA Column */}
          <div className="lg:col-span-4 flex flex-col justify-end space-y-8">
            <p
              ref={subtextRef}
              className="text-stone-300 text-sm md:text-base font-light leading-relaxed max-w-md border-l border-white/20 pl-5"
            >
              Thoughtfully designed places, considered service, and experiences shaped by where you
              are.
            </p>

            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/stays"
                data-cursor="EXPLORE"
                className="group inline-flex items-center space-x-3 px-6 py-3.5 bg-[#FAF8F5] text-[#141413] text-xs font-mono uppercase tracking-[0.24em] font-medium hover:bg-[#B89F7D] hover:text-white transition-all duration-300"
              >
                <span>EXPLORE OUR STAYS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => openBooking()}
                data-cursor="RESERVE"
                className="px-6 py-3.5 border border-white/60 text-white text-xs font-mono uppercase tracking-[0.24em] hover:bg-white/10 transition-colors"
              >
                BOOK A STAY
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Architectural Metadata Bar */}
        <div
          ref={metadataRef}
          className="mt-14 pt-6 border-t border-white/15 flex flex-wrap justify-between items-center text-[10px] font-mono uppercase tracking-widest text-stone-400 gap-4"
        >
          <div className="flex items-center space-x-6">
            <span>HYDERABAD · RAJASTHAN · GOA · HIMALAYAS</span>
            <span className="hidden sm:inline-block">17.4319° N / 78.4073° E</span>
          </div>

          <div className="flex items-center space-x-2 text-stone-300">
            <span>SCROLL TO DISCOVER</span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
