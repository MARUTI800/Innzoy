import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND, HOTELS, GUEST_HOUSES } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export const metadata: Metadata = {
  title: 'About — Innzoy Hotels & Guest Houses',
  description:
    'Innzoy operates hotels and guest houses across west Hyderabad, offering clean, affordable stays for business and family travellers.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-28 md:pt-36 pb-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal variant="fade-up">
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68]">
              About Innzoy
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-6">
            Affordable stays across Hyderabad
          </h1>

          <p className="text-base text-[#5A554D] leading-relaxed max-w-2xl">
            Innzoy runs {HOTELS.length} hotels and {GUEST_HOUSES.length} guest houses across west
            Hyderabad — Khajaguda, Gachibowli, Manikonda, HITEC City, Jubilee Hills, Kondapur and
            Gopanpally. Every property is run to the same standard: clean rooms, working amenities,
            and staff who answer the phone.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={100}>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#ECE8DE] my-12">
            <Image
              src={BRAND.heroImage}
              alt="Innzoy Hotels, Hyderabad"
              fill
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-[#171715]/10">
          {BRAND.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl font-light">{stat.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#777168] mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
          <div>
            <h2 className="font-serif text-2xl font-light mb-4">Hotels</h2>
            <p className="text-sm text-[#5A554D] leading-relaxed mb-5">
              Daily-rate rooms with 24/7 front desk, housekeeping and power backup. Built for short
              business trips, hospital visits and family travel.
            </p>
            <Link
              href="/stays?category=hotel"
              className="font-mono text-[10px] uppercase tracking-[0.22em] border-b border-[#171715]/30 hover:border-[#171715] pb-1 transition-colors"
            >
              View hotels →
            </Link>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-light mb-4">Guest Houses</h2>
            <p className="text-sm text-[#5A554D] leading-relaxed mb-5">
              Self-contained homes with kitchens, laundry and living space, bookable on Airbnb.
              Suited to families, relocations and stays of a week or more.
            </p>
            <Link
              href="/stays?category=guesthouse"
              className="font-mono text-[10px] uppercase tracking-[0.22em] border-b border-[#171715]/30 hover:border-[#171715] pb-1 transition-colors"
            >
              View guest houses →
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-[#171715]/10">
          <h2 className="font-serif text-2xl font-light mb-4">Head office</h2>
          <p className="text-sm text-[#5A554D] leading-relaxed max-w-lg">
            {BRAND.contact.headOffice}
          </p>
          <div className="flex flex-wrap gap-6 mt-5 text-sm">
            <a href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`} className="hover:text-[#A68A68]">
              {BRAND.contact.phone}
            </a>
            <a href={`mailto:${BRAND.contact.email}`} className="hover:text-[#A68A68]">
              {BRAND.contact.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
