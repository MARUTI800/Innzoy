import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { DESTINATIONS, PROPERTIES } from '@/data/innzoyData';

export const metadata = {
  title: 'Destinations — INNZOY Hotels & Resorts',
  description:
    'Discover INNZOY destinations across Jaipur, Goa, Udaipur, the Himalayas, and Hyderabad. Places chosen for their architectural honesty and quietude.',
};

export default function DestinationsPage() {
  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-32 sm:pt-40 pb-36">
      {/* Editorial Header */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-20 md:mb-28">
        <div className="flex items-center space-x-3 mb-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
            REGIONAL GEOGRAPHY
          </span>
          <span className="w-8 h-[1px] bg-[#171715]/15" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]">
              DESTINATIONS &
              <br />
              <span className="italic font-normal text-[#777168]">TERRAINS.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
              We locate our sanctuaries where cultural depth, local geology, and natural rhythms allow the mind to slow and dwell.
            </p>
          </div>
        </div>

        {/* Quick Nav Anchor Bar */}
        <div className="mt-16 pt-8 border-t border-[#171715]/10 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-[#777168] uppercase tracking-[0.24em] text-[9px]">JUMP TO REGION:</span>
          {DESTINATIONS.map((dest) => (
            <a
              key={dest.id}
              href={`#${dest.id}`}
              className="px-3 py-1 border border-[#171715]/15 uppercase tracking-[0.2em] text-[10px] hover:bg-[#171715] hover:text-[#FAF9F6] transition-colors"
            >
              {dest.name}
            </a>
          ))}
        </div>
      </section>

      {/* Destinations List */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 space-y-32 md:space-y-44">
        {DESTINATIONS.map((dest, idx) => {
          const matchingProperties = PROPERTIES.filter((p) => p.destinationId === dest.id);

          return (
            <section
              key={dest.id}
              id={dest.id}
              className="scroll-mt-36 border-t border-[#171715]/10 pt-20 md:pt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                {/* Big Editorial Image Left */}
                <div className="lg:col-span-7 space-y-6">
                  <div
                    className="relative aspect-[16/11] w-full overflow-hidden bg-[#E8E3DC]"
                    data-cursor="VIEW"
                  >
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover filter brightness-[0.93] contrast-[1.02] hover:scale-105 transition-transform duration-1000 ease-luxury"
                    />
                    <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-sm px-3 py-1.5 font-mono text-[9px] text-[#FAF9F6] tracking-widest uppercase border border-white/15">
                      {dest.coordinates}
                    </div>
                  </div>

                  {dest.climate && (
                    <div className="p-4 bg-[#EAE6DE] flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#777168]">
                      <span>SEASON & CLIMATE:</span>
                      <span className="text-[#171715] normal-case font-sans">{dest.climate}</span>
                    </div>
                  )}
                </div>

                {/* Text Narrative Right */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.3em] text-[#A68A68]">
                      <span>REGION 0{idx + 1}</span>
                      <span>·</span>
                      <span>{dest.region}</span>
                    </div>

                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight uppercase text-[#171715]">
                      {dest.name}
                    </h2>
                  </div>

                  <p className="font-serif italic text-base sm:text-lg text-[#5A554D] leading-snug border-l border-[#A68A68] pl-4">
                    &ldquo;{dest.tagline}&rdquo;
                  </p>

                  <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="pt-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block mb-3">
                        TERRAIN HIGHLIGHTS
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {dest.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white border border-[#171715]/10 font-mono text-[10px] text-[#171715]"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regional Sanctuaries */}
                  <div className="pt-4 border-t border-[#171715]/10">
                    <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block mb-3">
                      REGIONAL ADDRESS ({matchingProperties.length})
                    </span>
                    <div className="space-y-3">
                      {matchingProperties.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/stays/${p.slug}`}
                          className="group flex items-center justify-between p-4 bg-white border border-[#171715]/10 hover:border-[#171715] transition-all"
                        >
                          <div>
                            <span className="font-serif text-lg font-light text-[#171715] block group-hover:text-[#A68A68] transition-colors">
                              {p.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#777168] uppercase tracking-wider">
                              From {p.formattedPrice} / night
                            </span>
                          </div>
                          <div className="w-8 h-8 flex items-center justify-center border border-[#171715]/15 group-hover:bg-[#171715] group-hover:text-[#FAF9F6] transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
