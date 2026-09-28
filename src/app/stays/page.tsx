'use client';

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PROPERTIES } from '@/data/innzoyData';
import PropertyCard from '@/components/common/PropertyCard';
import ScrollReveal from '@/components/common/ScrollReveal';

const FILTERS = [
  { key: 'all', label: 'All Properties', href: '/stays' },
  { key: 'hotel', label: 'Hotels', href: '/stays?category=hotel' },
  { key: 'guesthouse', label: 'Guest Houses', href: '/stays?category=guesthouse' },
];

const COPY: Record<string, { title: string; description: string }> = {
  all: {
    title: 'All Properties',
    description: 'Every Innzoy hotel and guest house across Hyderabad.',
  },
  hotel: {
    title: 'Hotels',
    description:
      'Clean, well-kept rooms with 24/7 front desk service, across Khajaguda, Gachibowli, Manikonda and HITEC City.',
  },
  guesthouse: {
    title: 'Guest Houses',
    description:
      'Self-contained homes with kitchens and living space, suited to families and longer stays.',
  },
};

function StaysContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? 'all';
  const active = COPY[category] ? category : 'all';

  const properties = useMemo(
    () => (active === 'all' ? PROPERTIES : PROPERTIES.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-28 md:pt-36 pb-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal variant="fade-up">
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68]">
              Innzoy Hyderabad
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#171715] mb-4">
            {COPY[active].title}
          </h1>
          <p className="text-sm sm:text-base text-[#5A554D] max-w-2xl leading-relaxed">
            {COPY[active].description}
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap gap-3 mt-10 mb-12 pb-8 border-b border-[#171715]/10">
          {FILTERS.map((filter) => (
            <Link
              key={filter.key}
              href={filter.href}
              className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] border transition-colors duration-300 ${
                active === filter.key
                  ? 'bg-[#171715] border-[#171715] text-[#FAF9F6]'
                  : 'border-[#171715]/20 text-[#5A554D] hover:border-[#171715] hover:text-[#171715]'
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {properties.map((property, i) => (
            <ScrollReveal key={property.id} variant="fade-up" delay={i * 50}>
              <PropertyCard property={property} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StaysPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F1EA]" />}>
      <StaysContent />
    </Suspense>
  );
}
