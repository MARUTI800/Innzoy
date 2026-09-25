'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROPERTIES } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function TheCollection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  const activeProperty = PROPERTIES[activeIndex] || PROPERTIES[0];

  // Subtle image follow cursor (10-16px max lerped physical anchoring)
  useEffect(() => {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        mousePos.current = {
          x: Math.max(-14, Math.min(14, normX * 14)),
          y: Math.max(-14, Math.min(14, normY * 14)),
        };
      } else {
        mousePos.current = { x: 0, y: 0 };
      }
    };

    let rafId: number;
    const animateFollow = () => {
      currentOffset.current.x += (mousePos.current.x - currentOffset.current.x) * 0.12;
      currentOffset.current.y += (mousePos.current.y - currentOffset.current.y) * 0.12;

      if (previewBoxRef.current) {
        previewBoxRef.current.style.transform = `translate3d(${currentOffset.current.x}px, ${currentOffset.current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateFollow);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateFollow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="collection"
      className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-[#F4F1EA] text-[#171715] border-t border-[#171715]/10"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-28 pb-8 border-b border-[#171715]/10">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-3">
                SANCTUARY ARCHIVE
              </span>
              <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-[#171715] uppercase leading-[0.95]">
                THE COLLECTION
              </h2>
            </div>

            <p className="mt-6 md:mt-0 font-mono text-xs uppercase tracking-[0.22em] text-[#777168] max-w-sm">
              Hover to preview architecture · Stays shaped by geography and silence
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop Split Index (Left: Interactive List / Right: Large Dynamic Photo) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Property List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[#171715]/10">
            {PROPERTIES.map((item, idx) => {
              const isActive = activeIndex === idx;
              const itemNumber = String(idx + 1).padStart(2, '0');
              const destinationLabel = item.region.split(',')[0].toUpperCase();

              return (
                <div
                  key={item.slug}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="group py-8 md:py-10 transition-colors duration-300"
                >
                  <Link
                    href={`/stays/${item.slug}`}
                    data-cursor="EXPLORE"
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline space-x-4 sm:space-x-8">
                        <span
                          className={`font-mono text-xs sm:text-sm transition-all duration-300 ${
                            isActive
                              ? 'text-[#171715] translate-x-1.5 font-bold'
                              : 'text-[#777168]'
                          }`}
                        >
                          {itemNumber} —
                        </span>
                        <h3
                          className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-light uppercase tracking-tight transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive
                              ? 'text-[#171715] translate-x-3'
                              : 'text-[#777168] hover:text-[#171715]'
                          }`}
                        >
                          {destinationLabel}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-[#777168]">
                          From {item.formattedPrice}
                        </span>
                        <div
                          className={`w-7 h-7 flex items-center justify-center border transition-all duration-300 ${
                            isActive
                              ? 'border-[#171715] bg-[#171715] text-[#F4F1EA] scale-110'
                              : 'border-[#171715]/20 text-[#171715]'
                          }`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="pl-8 sm:pl-16 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#777168] gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#171715]">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-light">
                        {item.region}
                      </span>
                    </div>

                    {/* Mobile Only: Inline Photo for touch screens */}
                    <div className="lg:hidden mt-4 pt-2">
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E3DC]">
                        <Image
                          src={item.heroImage}
                          alt={item.name}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#777168] font-light">
                        {item.tagline}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Large Image Viewer on Desktop (5 cols sticky with subtle cursor-anchor physics) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div
              ref={previewBoxRef}
              className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8E3DC] shadow-[0_15px_45px_rgba(0,0,0,0.06)] will-change-transform"
            >
              {PROPERTIES.map((item, idx) => {
                const isCurrent = activeIndex === idx;

                return (
                  <div
                    key={item.slug}
                    className={`absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isCurrent
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                    style={{
                      clipPath: isCurrent
                        ? 'inset(0% 0% 0% 0%)'
                        : 'inset(0% 12% 0% 12%)',
                      transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), clip-path 0.75s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <Image
                      src={item.heroImage}
                      alt={item.name}
                      fill
                      priority={idx === 0}
                      sizes="40vw"
                      className="object-cover filter brightness-[0.92] contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-85" />

                    {/* Architectural Overlay Information */}
                    <div className="absolute bottom-6 left-6 right-6 text-[#FAF9F6] flex flex-col justify-end space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#E8DFD3]">
                        <span>{item.coordinates}</span>
                        <span>{item.formattedPrice} / night</span>
                      </div>
                      <p className="font-serif text-xl font-light text-white uppercase pt-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-light text-stone-300 leading-snug line-clamp-1">
                        {item.tagline}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sub-bar below desktop preview */}
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-[#777168]">
              <span>
                CURRENT SELECTION: {String(activeIndex + 1).padStart(2, '0')} / {String(PROPERTIES.length).padStart(2, '0')}
              </span>
              <Link
                href={`/stays/${activeProperty.slug}`}
                data-cursor="EXPLORE"
                className="text-[#171715] hover:text-[#A68A68] transition-colors"
              >
                VIEW ARCHITECTURE →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
