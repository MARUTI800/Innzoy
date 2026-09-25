'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function WellnessSection() {
  const rituals = [
    { name: "Deccan Herbal Compress", duration: "75 Min", desc: "Local camphor, eucalyptus, and warm volcanic stones." },
    { name: "Sunrise Prana Flow", duration: "60 Min", desc: "Guided breathwork and open-terrace stretches above the morning mist." },
    { name: "Mineral Soaking Baths", duration: "45 Min", desc: "Hand-chiseled stone soaking tubs infused with essential rose waters." }
  ];

  return (
    <section className="py-32 md:py-44 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left: Slow image composition */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div
              className="relative aspect-[3/4] w-full overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.06)]"
              data-cursor="CALM"
            >
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85"
                alt="INNZOY Stillness and Wellness"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-[2000ms] ease-luxury hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#726E67]">
              <span>REST & RESTORATION</span>
              <span>SILENT PROTOCOLS</span>
            </div>
          </div>

          {/* Right: Generous whitespace & architectural typography */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block">
              07 / RECOVERY & WELLNESS
            </span>

            <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light uppercase tracking-tight leading-[0.95] text-[#141413]">
              TIME TO
              <br />
              <span className="italic font-normal text-[#B89F7D]">SLOW DOWN.</span>
            </h2>

            <p className="text-stone-600 text-base md:text-lg font-light leading-relaxed max-w-lg">
              In a culture that celebrates speed, we build temples of stillness. Our wellness
              offerings are not cosmetic; they are architectural invitations to restore cognitive
              clarity, physiological calm, and uninterrupted sleep.
            </p>

            {/* Rituals List */}
            <div className="pt-4 divide-y divide-[#141413]/10">
              {rituals.map((r, i) => (
                <div key={i} className="py-4 flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-xl font-light text-stone-900">{r.name}</h4>
                    <p className="text-xs text-stone-500 font-light mt-0.5">{r.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-[#B89F7D] tracking-widest">
                    {r.duration}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/experiences#wellness"
                className="inline-flex items-center space-x-3 text-xs font-mono uppercase tracking-[0.24em] font-medium text-[#141413] border-b border-[#141413] pb-1 hover:text-[#B89F7D] hover:border-[#B89F7D] transition-colors"
              >
                <span>EXPLORE ALL WELLNESS PROTOCOLS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
