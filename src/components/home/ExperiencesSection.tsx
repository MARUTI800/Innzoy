'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { EXPERIENCES } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function ExperiencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;

    const setupHorizontalScroll = async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      if (prefersReducedMotion || !isDesktop) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const track = horizontalTrackRef.current;
        if (!track) return;

        // Calculate scroll width: distance needed to move all 4 cards into view
        const totalCards = EXPERIENCES.length;
        const scrollDistance = (totalCards - 1) * 75; // percentage

        gsap.to(track, {
          xPercent: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${window.innerWidth * 1.5}`,
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);
    };

    setupHorizontalScroll();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-36 lg:py-0 px-6 md:px-12 lg:px-16 bg-[#F4F1EA] text-[#171715] border-t border-[#171715]/10 overflow-hidden lg:h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div className="max-w-[1500px] w-full mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-12 pb-6 border-b border-[#171715]/10">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-2">
                CURATED IMMERSIONS
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#171715] uppercase leading-[0.96]">
                THE STAY EXTENDS <span className="italic font-normal text-[#777168]">BEYOND THE ROOM.</span>
              </h2>
            </div>

            <p className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-[0.2em] text-[#777168] max-w-sm">
              Rituals and immersions shaped by regional cuisine, silence, and terrain.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: Pinned Horizontal Track (smooth scrub) */}
        <div className="hidden lg:block relative w-full overflow-hidden pt-4 pb-6">
          <div
            ref={horizontalTrackRef}
            className="flex items-center space-x-16 will-change-transform"
            style={{ width: `${EXPERIENCES.length * 75}%` }}
          >
            {EXPERIENCES.map((exp, idx) => (
              <div
                key={exp.id}
                className="w-[68vw] max-w-[1000px] shrink-0 grid grid-cols-12 gap-10 items-center bg-[#EAE6DE] p-8 border border-[#171715]/10 shadow-[0_10px_35px_rgba(0,0,0,0.03)]"
              >
                {/* Image Column */}
                <div className="col-span-7">
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden bg-[#E0DCD3]"
                    data-cursor="VIEW"
                  >
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      sizes="50vw"
                      className="object-cover filter brightness-[0.92] contrast-[1.02] hover:scale-105 transition-transform duration-1000 ease-luxury"
                    />
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 font-mono text-[9px] text-[#FAF9F6] tracking-widest uppercase border border-white/15">
                      0{idx + 1} / {exp.category}
                    </div>
                  </div>
                </div>

                {/* Details Column */}
                <div className="col-span-5 space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A68A68] block">
                    {exp.category.toUpperCase()} · {exp.location}
                  </span>
                  <h3 className="font-serif text-3xl font-light text-[#171715] uppercase tracking-tight leading-[1.05]">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#5A554D] font-light leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/experiences"
                      className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#171715] border-b border-[#171715] pb-1 hover:text-[#A68A68] hover:border-[#A68A68] transition-colors"
                    >
                      <span>EXPLORE RITUAL</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Clean Vertical Storytelling Stack (no horizontal lock) */}
        <div className="lg:hidden space-y-16">
          {EXPERIENCES.map((exp, idx) => (
            <div key={exp.id} className="space-y-4 border-b border-[#171715]/10 pb-12 last:border-b-0">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E3DC]">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-2.5 py-1 font-mono text-[9px] text-white tracking-widest uppercase">
                  0{idx + 1} / {exp.category}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A68A68] block">
                  {exp.category} · {exp.location}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#171715] uppercase">
                  {exp.title}
                </h3>
                <p className="text-xs text-[#5A554D] font-light leading-relaxed">
                  {exp.description}
                </p>
                <div className="pt-1">
                  <Link
                    href="/experiences"
                    className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#171715] border-b border-[#171715] pb-0.5"
                  >
                    <span>EXPLORE →</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Experiences Link */}
        <div className="mt-12 lg:mt-6 pt-6 border-t border-[#171715]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#777168]">
            IMMERSIONS ARE COMPLIMENTARY FOR REGISTERED INNZOY GUESTS
          </p>
          <Link
            href="/experiences"
            data-cursor="EXPLORE"
            className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#171715] hover:text-[#A68A68] transition-colors"
          >
            <span>VIEW ALL CURATED IMMERSIONS</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
