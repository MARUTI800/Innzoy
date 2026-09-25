'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DiningSection() {
  const culinaryConcepts = [
    {
      name: "The Deccan Hearth",
      type: "Heritage Courtyard Dining",
      location: "The Innzoy Villa Jubilee Hills",
      snippet: "Slow-simmered regional stews in unglazed earthenware, cold-pressed mustard infusions, and fragrant saffron rice beneath open night skies.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "The Western Terrace Grill",
      type: "Skyline Sunset Table",
      location: "The Innzoy Penthouse Kondapur",
      snippet: "Wood-fired artisanal flatbreads, coastal spices, and fresh herbs cultivated directly in our rooftop garden planters.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    },
    {
      name: "Country Farmhouse Table",
      type: "Organic Countryside Breakfasts",
      location: "The Innzoy Luxury Retreat Mokila",
      snippet: "Fresh country dairy, heirloom millets, and cold-pressed citrus juices served under ancient tamarind and neem shade.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-7xl mx-auto">
        {/* Full-width Top Editorial Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/10] w-full overflow-hidden mb-20 bg-[#141413]">
          <Image
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85"
            alt="Dining at INNZOY"
            fill
            sizes="100vw"
            className="object-cover filter brightness-[0.75] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141413]/80 via-[#141413]/40 to-transparent" />

          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center text-[#FAF8F5] max-w-2xl">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              06 / CULINARY CULTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-tight leading-[1.08]">
              DINING AT INNZOY
            </h2>
            <p className="mt-4 font-serif text-xl sm:text-2xl text-stone-200 italic font-normal leading-relaxed">
              &quot;Local ingredients.
              <br />
              Thoughtful kitchens.
              <br />
              Long evenings.&quot;
            </p>
          </div>
        </div>

        {/* Editorial Culinary Entries (Editorial magazine layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {culinaryConcepts.map((item, idx) => (
            <div key={item.name} className="flex flex-col justify-between group">
              <div>
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden mb-6"
                  data-cursor="VIEW"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#141413]/70 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono text-[#FAF8F5] tracking-widest uppercase">
                    0{idx + 1}
                  </div>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#B89F7D] block mb-1">
                  {item.type}
                </span>

                <h3 className="font-serif text-2xl font-light text-[#141413] tracking-tight mb-1">
                  {item.name}
                </h3>

                <p className="font-mono text-[10px] text-stone-500 uppercase tracking-wider mb-3">
                  {item.location}
                </p>

                <p className="text-xs text-[#726E67] font-light leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href="/experiences"
                  className="inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#141413] hover:text-[#B89F7D] transition-colors"
                >
                  <span>INQUIRE TASTINGS</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
