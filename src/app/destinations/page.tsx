import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { DESTINATIONS, PROPERTIES } from '@/data/innzoyData';

export const metadata = {
  title: 'Destinations — INNZOY Hotels & Resorts',
  description: 'Explore INNZOY destinations across Hyderabad, Rajasthan, Goa, and the Western Himalayas.',
};

export default function DestinationsPage() {
  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      <PageHero
        eyebrow="REGIONAL GEOGRAPHY"
        title="OUR DESTINATIONS"
        subtitle="Places chosen for their cultural depth, architectural honesty, and ability to quiet the spirit."
        bgImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85"
        coordinates="17.3850° N / 78.4867° E"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-32">
        {DESTINATIONS.map((dest, idx) => {
          const matchingProperties = PROPERTIES.filter((p) => {
            if (dest.id === 'hyderabad') return p.location.includes('Hyderabad');
            if (dest.id === 'rajasthan') return p.location.includes('Rajasthan') || p.location.includes('Jaipur');
            return false;
          });

          return (
            <div key={dest.id} id={dest.id} className="scroll-mt-32 border-b border-[#141413]/10 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Big Editorial Image */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-[16/10] w-full overflow-hidden shadow-2xl">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#141413]/80 backdrop-blur-md px-3 py-1 font-mono text-[9px] text-white tracking-widest uppercase">
                      {dest.coordinates}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.3em] text-[#B89F7D]">
                    <span>0{idx + 1}</span>
                    <span>—</span>
                    <span>{dest.region}, {dest.country}</span>
                  </div>

                  <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-tight uppercase">
                    {dest.name}
                  </h2>

                  <p className="font-serif italic text-base text-stone-600">
                    &quot;{dest.tagline}&quot;
                  </p>

                  <p className="text-sm text-[#726E67] font-light leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 block mb-2">
                      REGIONAL PROPERTIES ({matchingProperties.length})
                    </span>
                    <div className="space-y-2">
                      {matchingProperties.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/stays/${p.slug}`}
                          className="flex items-center justify-between p-3 bg-white border border-[#141413]/8 hover:border-[#141413]/30 transition-all text-xs font-mono"
                        >
                          <span className="font-serif text-sm font-medium">{p.name}</span>
                          <span className="text-[#B89F7D] flex items-center space-x-1">
                            <span>From {p.formattedPrice}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
