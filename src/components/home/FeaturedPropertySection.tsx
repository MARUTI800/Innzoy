'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROPERTIES } from '@/data/innzoyData';
import { useBooking } from '@/context/BookingContext';

export default function FeaturedPropertySection() {
  const { openBooking } = useBooking();

  // Featured flagship: Jubilee Hills Villa
  const marqueeProperty =
    PROPERTIES.find((p) => p.slug === 'jubilee-hills') || PROPERTIES[0];

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D]">
            03 / FEATURED PROPERTY SPOTLIGHT
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#726E67]">
            {marqueeProperty.coordinates}
          </span>
        </div>

        {/* Magazine Spread Wrapper */}
        <div className="relative bg-[#141413] text-[#FAF8F5] overflow-hidden shadow-2xl">
          {/* Main Architectural Hero Image */}
          <div className="relative h-[65vh] md:h-[80vh] w-full" data-cursor="EXPLORE">
            <Image
              src={marqueeProperty.heroImage}
              alt={marqueeProperty.name}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center filter brightness-[0.8] contrast-[1.05]"
            />
            {/* Dark gradient for magazine layout */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/20 to-black/30" />

            {/* Top Right Tag */}
            <div className="absolute top-8 right-8 bg-[#141413]/60 backdrop-blur-md px-4 py-2 border border-white/10 font-mono text-[10px] uppercase tracking-widest text-[#FAF8F5]">
              {marqueeProperty.location}
            </div>

            {/* Bottom Content within Image */}
            <div className="absolute bottom-10 left-8 right-8 md:bottom-16 md:left-16 md:right-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#B89F7D] block mb-2">
                  FLAGSHIP SANCTUARY · {marqueeProperty.neighborhood}
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase leading-[1.05]">
                  {marqueeProperty.name}
                </h3>
                <p className="mt-4 text-stone-300 text-sm md:text-base font-light leading-relaxed max-w-xl">
                  {marqueeProperty.editorialSnippet}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href={`/stays/${marqueeProperty.slug}`}
                  className="px-6 py-3.5 bg-[#FAF8F5] text-[#141413] font-mono text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#B89F7D] hover:text-white transition-colors"
                >
                  DISCOVER THE PROPERTY →
                </Link>

                <button
                  onClick={() => openBooking({ propertySlug: marqueeProperty.slug })}
                  className="px-6 py-3.5 border border-white/40 text-white font-mono text-xs uppercase tracking-[0.22em] hover:bg-white/10 transition-colors"
                >
                  BOOK THIS STAY
                </button>
              </div>
            </div>
          </div>

          {/* Editorial Footer Grid below image */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-12 border-t border-white/10 bg-[#1C1B19]">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-1">
                STARTING FROM
              </span>
              <p className="font-serif text-2xl text-white font-light">
                {marqueeProperty.formattedPrice}
                <span className="text-xs text-stone-400 font-sans ml-1">/ night</span>
              </p>
            </div>

            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-1">
                ARCHITECTURE
              </span>
              <p className="font-sans text-xs text-stone-300 leading-relaxed">
                Warm teak millwork, hand-dressed masonry & courtyard shade
              </p>
            </div>

            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-1">
                SIGNATURE SUITES
              </span>
              <p className="font-sans text-xs text-stone-300 leading-relaxed">
                Boutique Private Suites & Grand 3BHK Villa Floors
              </p>
            </div>

            <div className="flex items-center justify-start md:justify-end">
              <Link
                href={`/stays/${marqueeProperty.slug}`}
                className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-[#B89F7D] hover:underline"
              >
                <span>VIEW SUITE SPECS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
