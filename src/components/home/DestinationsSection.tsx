'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DESTINATIONS } from '@/data/innzoyData';

export default function DestinationsSection() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#141413] text-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-white/10 pb-10">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              02 / CURATED DESTINATIONS
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase leading-[1.05]">
              PLACES WITH
              <br />
              <span className="italic font-normal text-stone-300">A SENSE OF PLACE.</span>
            </h2>
          </div>

          <p className="mt-6 md:mt-0 text-stone-400 max-w-sm text-sm font-light leading-relaxed">
            Each INNZOY destination is chosen for its cultural resonance, architectural honesty,
            and ability to transport the spirit.
          </p>
        </div>

        {/* Asymmetric Editorial Destination Spreads */}
        <div className="space-y-24 md:space-y-36">
          {DESTINATIONS.map((dest, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={dest.id}
                id={dest.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Anchor (60% width on desktop) */}
                <div
                  className={`lg:col-span-7 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}
                >
                  <div
                    className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden group shadow-2xl"
                    data-cursor="EXPLORE"
                  >
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover filter brightness-[0.88] transition-transform duration-1000 ease-luxury group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-stone-300">
                      <span>{dest.coordinates}</span>
                      <span>{dest.propertyCount} Sanctuaries</span>
                    </div>
                  </div>
                </div>

                {/* Narrative & Details (40% width on desktop) */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-center space-y-6 ${
                    isEven ? 'order-2' : 'order-2 lg:order-1'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.3em] text-[#B89F7D]">
                    <span>0{idx + 1}</span>
                    <span>—</span>
                    <span>{dest.region}, {dest.country}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white uppercase">
                    {dest.name}
                  </h3>

                  <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
                      SIGNATURE VIBE
                    </span>
                    <p className="text-xs font-serif italic text-stone-300">
                      &quot;{dest.tagline}&quot;
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/stays?destination=${dest.id}`}
                      className="group inline-flex items-center space-x-3 px-6 py-3.5 border border-white/30 text-white text-xs font-mono uppercase tracking-[0.22em] hover:bg-white hover:text-[#141413] transition-all duration-300"
                    >
                      <span>DISCOVER STAYS IN {dest.name.toUpperCase()}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Stays Link */}
        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
            EXPLORE THE FULL SANCTUARY PORTFOLIO
          </p>
          <Link
            href="/destinations"
            className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B89F7D] hover:text-white transition-colors"
          >
            <span>VIEW ALL REGIONS & EXPERIENCES</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
