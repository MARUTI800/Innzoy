'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import TextReveal from '@/components/common/TextReveal';

export default function ArchitectureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const overlapImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (prefersReducedMotion || isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        const offset = (window.innerHeight - rect.top) * 0.1;
        if (mainImageRef.current) {
          mainImageRef.current.style.transform = `translate3d(0, ${offset * 0.6}px, 0)`;
        }
        if (overlapImageRef.current) {
          overlapImageRef.current.style.transform = `translate3d(0, ${-offset * 0.8}px, 0)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-[#191A18] text-[#FAF9F6] relative overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Editorial Eyebrow */}
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center justify-between mb-16 pb-6 border-b border-white/10">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68]">
              ARCHITECTURE / PLACE
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-stone-400">
              FORM, LIGHT & MONASTIC DISCIPLINE
            </span>
          </div>
        </ScrollReveal>

        {/* Large Primary Architectural Canvas with Subtle Parallax */}
        <ScrollReveal variant="clip-up" duration={1100}>
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-[#262522]">
            <div ref={mainImageRef} className="absolute inset-0 w-full h-[115%] -top-[7%] will-change-transform">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
                alt="INNZOY Monastic Architecture — Volume and Light"
                fill
                sizes="100vw"
                className="object-cover object-center filter brightness-[0.85] contrast-[1.05]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

            {/* Minimal Overlay Information */}
            <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 max-w-xl z-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block mb-2">
                01 — THE MONASTIC RATIO
              </span>
              <TextReveal
                as="h3"
                className="font-serif text-3xl sm:text-5xl md:text-6xl font-light uppercase text-white tracking-tight leading-[1.02]"
                lines={['VOLUME, SILENCE,', 'AND SHADOW.']}
                delay={200}
                stagger={140}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Overlapping Editorial Geometry (Physical Depth Layering) */}
        <div className="relative -mt-12 sm:-mt-24 md:-mt-32 lg:-mt-40 z-20 flex flex-col lg:flex-row items-end justify-between gap-12">
          {/* Restrained Editorial Narrative Left */}
          <div className="max-w-md lg:mb-12 space-y-6">
            <ScrollReveal variant="fade-up" duration={800} delay={200}>
              <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68] block">
                VERNACULAR TECTONICS
              </span>
              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                Rather than imposing artificial decoration, our spaces are carved from the vernacular geology of their coordinates:
                heavy granitic mass, passive courtyard cross-ventilation, and unpolished lime plaster that softens harsh desert and Deccan sun.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={300}>
              <Link
                href="/about"
                data-cursor="EXPLORE"
                className="group inline-flex items-center space-x-3 text-xs font-mono uppercase tracking-[0.28em] text-white border-b border-white/40 pb-1 hover:border-[#A68A68] hover:text-[#A68A68] transition-colors"
              >
                <span>READ THE ARCHITECTURAL STUDY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Second Smaller Overlapping Photograph */}
          <div
            ref={overlapImageRef}
            className="w-full sm:w-80 md:w-96 lg:w-[460px] aspect-[4/5] relative overflow-hidden bg-[#262522] shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 will-change-transform"
          >
            <ScrollReveal variant="fade-up" duration={1000} delay={300}>
              <div className="relative w-full h-full aspect-[4/5]" data-cursor="VIEW">
                <Image
                  src="https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=85"
                  alt="INNZOY Tactile Materiality and Water Reflection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover filter brightness-[0.9] hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-stone-300 drop-shadow">
                  <span>FIG. 02 — WATER & JALI</span>
                  <span>UDAIPUR CLOISTER</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
