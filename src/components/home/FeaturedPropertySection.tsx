'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PROPERTIES } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function FeaturedPropertySection() {
  const marqueeProperty =
    PROPERTIES.find((p) => p.slug === 'innzoy-jaipur') || PROPERTIES[0];

  const triggerRef = useRef<HTMLDivElement>(null);
  const expandBoxRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const overlayTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;

    const setupScrollTrigger = async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 1024px)').matches;

      if (prefersReducedMotion || isMobile) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
          },
        });

        // Step 1: Narrative text fades out smoothly
        tl.to(narrativeRef.current, {
          opacity: 0,
          y: -40,
          duration: 0.35,
          ease: 'power2.inOut',
        }, 0);

        // Step 2: Image expands horizontally, then vertically to fill viewport
        tl.to(expandBoxRef.current, {
          width: '100vw',
          height: '100vh',
          x: 0,
          y: 0,
          duration: 0.75,
          ease: 'power2.inOut',
        }, 0.15);

        // Step 3: Immersive overlay title appears over full-screen room
        tl.fromTo(overlayTitleRef.current, {
          opacity: 0,
          y: 60,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
        }, 0.65);
      }, triggerRef);
    };

    setupScrollTrigger();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={triggerRef}
      className="relative min-h-screen bg-[#F4F1EA] text-[#171715] overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-[1500px] w-full mx-auto px-6 md:px-12 lg:px-16 py-20 lg:py-28 relative">
        {/* Section Tag */}
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center justify-between mb-12 md:mb-16 pb-6 border-b border-[#171715]/10">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
              FEATURED SANCTUARY
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168]">
              {marqueeProperty.coordinates}
            </span>
          </div>
        </ScrollReveal>

        {/* Desktop Split / Expanding Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Restrained Editorial Narrative */}
          <div ref={narrativeRef} className="lg:col-span-5 space-y-8 will-change-transform">
            <div className="space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
                {marqueeProperty.region.toUpperCase()}
              </span>
              <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#171715] uppercase leading-[1.02]">
                {marqueeProperty.name}
              </h3>
            </div>

            <p className="text-[#5A554D] text-sm sm:text-base font-light leading-relaxed">
              {marqueeProperty.editorialSnippet}
            </p>

            <div className="pt-2 pb-4 border-y border-[#171715]/10 grid grid-cols-2 gap-6 text-[10px] font-mono uppercase tracking-[0.24em] text-[#777168]">
              <div>
                <span className="text-[#171715] block mb-1">STARTING AT</span>
                <span className="font-serif text-lg text-[#171715] lowercase">{marqueeProperty.formattedPrice}</span>
                <span className="text-[9px] text-[#777168]"> / night</span>
              </div>
              <div>
                <span className="text-[#171715] block mb-1">SANCTUARY TYPE</span>
                <span className="text-[#171715] capitalize">{marqueeProperty.type}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/stays/${marqueeProperty.slug}`}
                data-cursor="EXPLORE"
                className="group inline-flex items-center space-x-3 text-xs font-mono uppercase tracking-[0.28em] text-[#171715] border-b border-[#171715] pb-1 hover:text-[#A68A68] hover:border-[#A68A68] transition-colors duration-300"
              >
                <span>DISCOVER THE SANCTUARY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Expandable Architectural Canvas */}
          <div className="lg:col-span-7 flex justify-end">
            <div
              ref={expandBoxRef}
              className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto w-full lg:w-[680px] lg:h-[480px] overflow-hidden bg-[#E8E3DC] shadow-[0_20px_50px_rgba(0,0,0,0.08)] will-change-[width,height,transform]"
            >
              <Image
                src={marqueeProperty.heroImage}
                alt={marqueeProperty.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover object-center filter brightness-[0.92] contrast-[1.03]"
              />

              {/* Gradient Scrim for the Fullscreen Overlay State */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

              {/* Fullscreen Overlay Title (Revealed as image becomes physical room) */}
              <div
                ref={overlayTitleRef}
                className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 lg:p-24 text-white opacity-0 pointer-events-none lg:pointer-events-auto"
              >
                <div className="max-w-2xl space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68] block">
                    01 — PHYSICAL EXPANSION · {marqueeProperty.coordinates}
                  </span>
                  <h4 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-tight text-white leading-[0.95]">
                    {marqueeProperty.name}
                  </h4>
                  <p className="text-stone-300 text-sm md:text-base font-light max-w-lg leading-relaxed">
                    Monolithic sandstone volumes and subterranean stepwell courtyards carved from Rajasthan scrublands.
                  </p>
                  <div className="pt-4">
                    <Link
                      href={`/stays/${marqueeProperty.slug}`}
                      data-cursor="ENTER"
                      className="px-8 py-4 bg-[#F4F1EA] text-[#171715] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#A68A68] hover:text-white transition-colors duration-300 inline-flex items-center space-x-2"
                    >
                      <span>ENTER SANCTUARY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Default Subtle Tag (Visible in unexpanded state) */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#FAF9F6] drop-shadow-md">
                <span>VERNACULAR CLOISTER</span>
                <span>SCROLL TO EXPAND →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
