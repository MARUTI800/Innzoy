import Link from 'next/link';
import { HOTELS, GUEST_HOUSES } from '@/data/innzoyData';
import PropertyCard from '@/components/common/PropertyCard';
import ScrollReveal from '@/components/common/ScrollReveal';

function Group({
  eyebrow,
  title,
  description,
  href,
  properties,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  properties: typeof HOTELS;
}) {
  return (
    <div>
      <ScrollReveal variant="fade-up" duration={500}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68]">
                {eyebrow}
              </span>
              <span className="w-8 h-[1px] bg-[#171715]/15" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#171715]">{title}</h2>
            <p className="text-sm text-[#5A554D] mt-2 max-w-xl">{description}</p>
          </div>

          <Link
            href={href}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#171715] border-b border-[#171715]/30 hover:border-[#171715] pb-1 transition-colors"
          >
            View all →
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {properties.map((property, i) => (
          <ScrollReveal key={property.id} variant="fade-up" duration={500} delay={i * 60}>
            <PropertyCard property={property} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesSection() {
  return (
    <section id="properties" className="bg-[#F4F1EA] py-16 md:py-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 space-y-20">
        <Group
          eyebrow="Our Properties"
          title="Hotels"
          description="Four addresses across Hyderabad's west — Khajaguda, Gachibowli, Manikonda and HITEC City."
          href="/stays?category=hotel"
          properties={HOTELS}
        />

        <Group
          eyebrow="Extended Stays"
          title="Guest Houses"
          description="Self-contained homes with kitchens and living space, for families and longer stays."
          href="/stays?category=guesthouse"
          properties={GUEST_HOUSES}
        />
      </div>
    </section>
  );
}
