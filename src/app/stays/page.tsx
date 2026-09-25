'use client';

import { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PROPERTIES, DESTINATIONS } from '@/data/innzoyData';
import { useBooking } from '@/context/BookingContext';
import ScrollReveal from '@/components/common/ScrollReveal';

function StaysContent() {
  const searchParams = useSearchParams();
  const destQuery = searchParams.get('destination');
  const { openBooking } = useBooking();

  const [selectedDestination, setSelectedDestination] = useState<string>(
    destQuery || 'all'
  );
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((property) => {
      const matchDest =
        selectedDestination === 'all' ||
        property.destinationId.toLowerCase() === selectedDestination.toLowerCase();
      const matchType =
        selectedType === 'all' || property.type.toLowerCase() === selectedType.toLowerCase();
      return matchDest && matchType;
    });
  }, [selectedDestination, selectedType]);

  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-32 sm:pt-40 pb-36">
      {/* Editorial Header */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-16 md:mb-24">
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
              ACCOMMODATION ARCHIVE
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <ScrollReveal variant="clip-up" duration={900} delay={100}>
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]">
                ALL STAYS &
                <br />
                <span className="italic font-normal text-[#777168]">SANCTUARIES.</span>
              </h1>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <ScrollReveal variant="fade-up" duration={800} delay={200}>
              <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                Each INNZOY address is an intentional architectural intervention in dialogue with native stone, filtered light, and contemplative stillness.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="mt-16 pt-8 border-t border-[#171715]/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Destination tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#777168] mr-2">
              DESTINATION:
            </span>
            <button
              onClick={() => setSelectedDestination('all')}
              className={`px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-all ${
                selectedDestination === 'all'
                  ? 'bg-[#171715] text-[#FAF9F6]'
                  : 'bg-transparent text-[#777168] hover:text-[#171715]'
              }`}
            >
              ALL ({PROPERTIES.length})
            </button>
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={`px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-all ${
                  selectedDestination === dest.id
                    ? 'bg-[#171715] text-[#FAF9F6]'
                    : 'bg-transparent text-[#777168] hover:text-[#171715]'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>

          {/* Results count & status */}
          <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168]">
            SHOWING {filteredProperties.length} OF {PROPERTIES.length} SANCTUARIES
          </div>
        </div>
      </section>

      {/* Property Listing: Asymmetric Magazine Style */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto space-y-24 md:space-y-36">
        {filteredProperties.map((property, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <article
              key={property.slug}
              className="border-t border-[#171715]/10 pt-16 md:pt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Image Column */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <ScrollReveal variant="clip-up" duration={1000}>
                    <Link
                      href={`/stays/${property.slug}`}
                      data-cursor="VIEW"
                      className="group block relative aspect-[16/11] w-full overflow-hidden bg-[#E8E3DC]"
                    >
                      <Image
                        src={property.heroImage}
                        alt={property.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover filter brightness-[0.93] contrast-[1.02] transition-transform duration-1200 ease-luxury group-hover:scale-105"
                      />
                      <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.3em] text-[#FAF9F6] bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/15">
                        SANCTUARY 0{idx + 1}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#FAF9F6]">
                        <span>{property.coordinates}</span>
                        <span>EXPLORE PERSPECTIVES →</span>
                      </div>
                    </Link>
                  </ScrollReveal>

                  {/* Secondary Image Strip for desktop */}
                  {property.gallery && property.gallery.length > 1 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {property.gallery.slice(1, 4).map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative aspect-[16/10] overflow-hidden bg-[#E8E3DC]"
                        >
                          <Image
                            src={img}
                            alt={`${property.name} detail ${imgIdx + 1}`}
                            fill
                            sizes="20vw"
                            className="object-cover filter brightness-[0.9] hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <ScrollReveal variant="fade-up" duration={700}>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-[#A68A68] uppercase tracking-[0.28em]">
                      <span>{property.region}</span>
                      <span>·</span>
                      <span className="capitalize">{property.type}</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light uppercase tracking-tight text-[#171715] mt-2 leading-[1.02]">
                      <Link
                        href={`/stays/${property.slug}`}
                        className="hover:text-[#A68A68] transition-colors"
                      >
                        {property.name}
                      </Link>
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal variant="fade-up" duration={800} delay={100}>
                    <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                      {property.editorialSnippet}
                    </p>
                  </ScrollReveal>

                  {/* Architectural metadata */}
                  <ScrollReveal variant="fade-up" duration={800} delay={150}>
                    <div className="py-4 border-y border-[#171715]/10 grid grid-cols-2 gap-4 font-mono text-[9px] uppercase tracking-[0.24em] text-[#777168]">
                      <div>
                        <span className="text-[#171715] block mb-1">STARTING AT</span>
                        <span className="font-serif text-base text-[#171715]">
                          {property.formattedPrice}
                        </span>
                        <span className="lowercase"> / night</span>
                      </div>
                      {property.architect && (
                        <div>
                          <span className="text-[#171715] block mb-1">ARCHITECT</span>
                          <span className="line-clamp-1">{property.architect}</span>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>

                  {/* Signature features */}
                  <ScrollReveal variant="fade-up" duration={800} delay={200}>
                    <div className="space-y-2 pt-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block mb-2">
                        DISTINCTIVE ATTRIBUTES
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#5A554D] font-light">
                        {property.features.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-[#A68A68] rounded-none shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>

                  {/* Actions */}
                  <ScrollReveal variant="fade-up" duration={800} delay={250}>
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/stays/${property.slug}`}
                        data-cursor="EXPLORE"
                        className="px-6 py-3.5 bg-[#171715] text-[#FAF9F6] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#A68A68] transition-colors inline-flex items-center space-x-2"
                      >
                        <span>VIEW SANCTUARY</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() =>
                          openBooking({
                            propertySlug: property.slug,
                            destination: property.destinationId,
                          })
                        }
                        data-cursor="RESERVE"
                        className="px-6 py-3.5 border border-[#171715]/30 text-[#171715] font-mono text-xs uppercase tracking-[0.24em] hover:border-[#171715] transition-colors"
                      >
                        INQUIRE
                      </button>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default function StaysPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center font-mono text-xs tracking-widest text-[#777168]">
          LOADING SANCTUARIES...
        </div>
      }
    >
      <StaysContent />
    </Suspense>
  );
}
