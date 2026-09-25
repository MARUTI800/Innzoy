import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/common/PageHero';
import { BRAND } from '@/data/innzoyData';

export const metadata = {
  title: 'About — INNZOY Hotels & Resorts',
  description: 'The philosophy, architecture, and human hospitality behind INNZOY.',
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Quiet Architecture",
      desc: "We prioritize honest materials—natural stone, solid wood, acoustic glass, and filtered sunlight—over decorative excess. A room should breathe."
    },
    {
      title: "Human Hospitality",
      desc: "No scripted greetings or transactional coldness. Our silent concierge is genuinely observant, attentive to what matters, and available 24/7."
    },
    {
      title: "Orthopedic Rest",
      desc: "Every bed in the INNZOY portfolio is custom-engineered with orthopedic pressure-relieving support and 400-thread-count linens for restorative biological sleep."
    },
    {
      title: "A Sense of Place",
      desc: "From Deccan basalt rock formations in Khajaguda to tree-shaded boulevards in Jubilee Hills, each sanctuary is anchored in the cultural reality of its address."
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      <PageHero
        eyebrow="BRAND PHILOSOPHY"
        title="WE CREATE PLACES TO FEEL SOMETHING"
        subtitle="Hospitality without the noise. Sanctuaries crafted for quiet living, human connection, and architectural calm."
        bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
        coordinates="17.4319° N / 78.4073° E"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-28">
        {/* Section 01: The Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block">
              OUR GENESIS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight uppercase leading-[1.1]">
              HOSPITALITY,
              <br />
              <span className="italic font-normal text-[#726E67]">WITHOUT THE NOISE.</span>
            </h2>

            <div className="space-y-4 text-[#726E67] text-base font-light leading-relaxed">
              {BRAND.manifesto.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#141413]/8">
              {BRAND.stats.map((s, idx) => (
                <div key={idx}>
                  <span className="font-serif text-3xl sm:text-4xl font-light text-stone-900">
                    {s.value}
                  </span>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500 mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl bg-stone-200">
              <Image
                src="https://innzoy.in/wp-content/uploads/2025/10/Hotel-Main-Elevation-e1763746501737-2048x1363.jpg"
                alt="INNZOY Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Section 02: Core Pillars */}
        <div>
          <div className="mb-14 pb-6 border-b border-[#141413]/8">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              FOUNDING TENETS
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight">
              WHAT GUIDES EVERY SANCTUARY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="p-8 bg-white border border-[#141413]/8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#B89F7D] tracking-widest block mb-4">
                    0{idx + 1}
                  </span>
                  <h4 className="font-serif text-2xl font-light text-stone-900 mb-3">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#726E67] font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 03: Verified Credibility */}
        <div className="p-10 md:p-14 bg-[#F4EFEA] border border-[#141413]/8 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              VERIFIED HOSPITALITY PARTNERS
            </span>
            <h4 className="font-serif text-2xl font-light text-stone-900">
              MakeMyTrip Verified · Airbnb Superhost · 4.8★ Google Reviews
            </h4>
            <p className="text-xs text-stone-500 font-light mt-1">
              Top Rated Partner 2024 across corporate stays, executive suites, and private villa bookings.
            </p>
          </div>

          <Link
            href="/stays"
            className="px-8 py-3.5 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#2C2A29] transition-colors shrink-0 text-center"
          >
            DISCOVER ALL STAYS →
          </Link>
        </div>
      </div>
    </div>
  );
}
