'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { PROPERTIES } from '@/data/innzoyData';
import { useBooking } from '@/context/BookingContext';

export default function StaysPage() {
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'villa' | 'penthouse' | 'guesthouse'>('all');
  const [filterRegion, setFilterRegion] = useState<'all' | 'hyderabad' | 'rajasthan'>('all');
  const { openBooking } = useBooking();

  const filteredProperties = PROPERTIES.filter((p) => {
    const matchesType =
      filterType === 'all' ||
      (filterType === 'hotel' && p.type === 'hotel') ||
      (filterType === 'villa' && p.type === 'villa') ||
      (filterType === 'penthouse' && p.type === 'penthouse') ||
      (filterType === 'guesthouse' && (p.type === 'guesthouse' || p.type === 'villa' || p.type === 'penthouse'));

    const matchesRegion =
      filterRegion === 'all' ||
      (filterRegion === 'hyderabad' && p.location.includes('Hyderabad')) ||
      (filterRegion === 'rajasthan' && (p.location.includes('Rajasthan') || p.location.includes('Jaipur')));

    return matchesType && matchesRegion;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      <PageHero
        eyebrow="INNZOY COLLECTION"
        title="OUR STAYS & SANCTUARIES"
        subtitle="Nine curated boutique hotels, private villas, and skyline penthouses designed for quiet architectural rest and deep human comfort."
        bgImage="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85"
        coordinates="17.4319° N / 78.4073° E"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Editorial Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-16 border-b border-[#141413]/10 gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'ALL SANCTUARIES' },
              { id: 'hotel', label: 'BOUTIQUE HOTELS' },
              { id: 'villa', label: 'PRIVATE VILLAS & ESTATES' },
              { id: 'penthouse', label: 'ROOFTOP PENTHOUSES' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-mono uppercase tracking-[0.2em] transition-all border ${
                  filterType === tab.id
                    ? 'bg-[#141413] text-[#FAF8F5] border-[#141413]'
                    : 'bg-white text-[#726E67] border-[#141413]/10 hover:border-[#141413]/30 hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-stone-400 uppercase tracking-widest mr-2">REGION:</span>
            {[
              { id: 'all', label: 'ALL' },
              { id: 'hyderabad', label: 'HYDERABAD' },
              { id: 'rajasthan', label: 'RAJASTHAN' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setFilterRegion(reg.id as any)}
                className={`px-3 py-1.5 transition-colors uppercase tracking-widest ${
                  filterRegion === reg.id
                    ? 'font-bold text-[#141413] border-b border-[#141413]'
                    : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredProperties.map((property) => (
            <div
              key={property.slug}
              className="group bg-white border border-[#141413]/8 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-[#141413]/25 transition-all duration-500"
            >
              <div>
                {/* Image */}
                <div
                  className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100"
                  data-cursor="VIEW"
                >
                  <Image
                    src={property.heroImage}
                    alt={property.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#141413]/70 backdrop-blur-sm px-2.5 py-1 text-[8px] font-mono text-[#FAF8F5] tracking-widest uppercase">
                    {property.neighborhood}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#FAF8F5] px-2.5 py-1 font-mono text-[10px] text-[#141413] font-medium shadow">
                    From {property.formattedPrice}
                    <span className="text-[8px] text-stone-400 ml-1">/ night</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center space-x-2 text-[9px] font-mono uppercase tracking-[0.25em] text-[#B89F7D] mb-1.5">
                    <MapPin className="w-3 h-3" />
                    <span>{property.location}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-[#141413] tracking-tight group-hover:text-[#B89F7D] transition-colors leading-snug">
                    <Link href={`/stays/${property.slug}`}>{property.name}</Link>
                  </h3>

                  <p className="mt-3 text-xs text-[#726E67] font-light leading-relaxed line-clamp-3">
                    {property.editorialSnippet}
                  </p>

                  {/* Amenities highlights */}
                  <div className="mt-5 pt-4 border-t border-[#141413]/6 space-y-1.5">
                    {property.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center space-x-2 text-[11px] text-stone-600">
                        <Check className="w-3 h-3 text-[#B89F7D] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 md:p-8 pt-0 flex items-center justify-between border-t border-[#141413]/6 mt-4">
                <Link
                  href={`/stays/${property.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-[#141413] group-hover:text-[#B89F7D] transition-colors"
                >
                  <span>EXPLORE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  onClick={() => openBooking({ propertySlug: property.slug })}
                  className="px-4 py-2 border border-[#141413] text-[10px] font-mono uppercase tracking-widest hover:bg-[#141413] hover:text-[#FAF8F5] transition-colors"
                >
                  RESERVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Group & Corporate Inquiry Banner */}
        <div className="mt-20 p-8 md:p-14 bg-[#F4EFEA] border border-[#141413]/8 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              BESPOKE RESERVATIONS
            </span>
            <h3 className="font-serif text-3xl font-light text-[#141413]">
              Planning an Extended Stay or Corporate Offsite?
            </h3>
            <p className="text-sm text-[#726E67] font-light max-w-xl mt-2 leading-relaxed">
              Our direct concierge desk coordinates full villa floor buyouts, dedicated chefs, and
              streamlined corporate invoicing across HITEC City, Jubilee Hills, and Mokila.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-8 py-4 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#2C2A29] transition-colors shrink-0 text-center"
          >
            CONTACT CONCIERGE DESK
          </Link>
        </div>
      </div>
    </div>
  );
}
