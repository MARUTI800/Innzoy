'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '@/data/innzoyData';

export default function HeroSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;
      if (imageRef.current) {
        imageRef.current.style.transform = `translate3d(0, ${scrollY * 0.06}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className="relative h-[78vh] min-h-[540px] w-full overflow-hidden bg-[#121412]"
      aria-label="Innzoy Hotels and Guest Houses, Hyderabad"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={BRAND.heroImage}
            alt="Innzoy Hotels, Hyderabad"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/80" />
      </div>

      <div
        className="relative z-10 h-full flex flex-col justify-end max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 pb-14 md:pb-20 transition-opacity duration-700"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <div className="flex items-center space-x-3 mb-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68]">
            {BRAND.name} · {BRAND.subname}
          </span>
          <span className="w-8 h-[1px] bg-white/20" />
        </div>

        <h1 className="font-serif text-white font-light leading-[1.05] max-w-[900px] text-[2.4rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.8rem] mb-8">
          {BRAND.headline}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/stays?category=hotel"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#A68A68] hover:bg-[#8E7047] font-mono text-[11px] text-white uppercase tracking-[0.2em] transition-colors duration-300"
          >
            <span>VIEW HOTELS</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/stays?category=guesthouse"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-white/35 hover:border-white hover:bg-white/10 font-mono text-[11px] text-white uppercase tracking-[0.2em] transition-colors duration-300"
          >
            VIEW GUEST HOUSES
          </Link>
        </div>
      </div>
    </section>
  );
}
