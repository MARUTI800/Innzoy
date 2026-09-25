'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BRAND } from '@/data/innzoyData';

export default function ManifestoSection() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Big Architectural Statement */}
          <div className="lg:col-span-7">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-4">
              01 / OUR PHILOSOPHY
            </span>

            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.08] uppercase text-[#141413]">
              WE CREATE
              <br />
              PLACES TO
              <br />
              <span className="italic font-normal text-[#B89F7D]">FEEL SOMETHING.</span>
            </h2>

            <div className="mt-10 space-y-6 text-[#726E67] text-base md:text-lg font-light leading-relaxed max-w-xl">
              <p>
                We believe a stay should never feel transactional, sterile, or detached from its
                surroundings. Founded on the principle of understated luxury, INNZOY transforms
                urban sanctuaries and countryside retreats into intimate spaces of restorative
                calm.
              </p>
              <p className="text-sm md:text-base">
                Whether nestled amidst the quiet banyan canopy of Jubilee Hills, overlooking the
                panoramic skyline in Kondapur, or welcoming business travelers beside the IT
                corridors of HITEC City, each address is a masterclass in quiet architecture,
                orthopedic rest, and 24/7 silent human hospitality.
              </p>
            </div>

            <div className="mt-12 flex items-center space-x-8">
              <Link
                href="/about"
                className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] font-medium border-b border-[#141413] pb-1 hover:text-[#B89F7D] hover:border-[#B89F7D] transition-colors"
              >
                <span>READ THE ARCHITECTURAL MANIFESTO</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Photo Composition */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Main Architectural Image */}
              <div
                className="relative aspect-[3/4] w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
                data-cursor="VIEW"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                  alt="INNZOY Architecture and Light"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-1000 ease-luxury hover:scale-105"
                />
              </div>

              {/* Architectural Label Badge */}
              <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#726E67]">
                <span>ARCHITECTURAL CALM</span>
                <span>VOL. 01 / FORM & LIGHT</span>
              </div>

              {/* Stats Overlay Card */}
              <div className="mt-8 grid grid-cols-2 gap-4 p-6 bg-[#F4EFEA] border border-[#141413]/5">
                {BRAND.stats.slice(0, 2).map((s, idx) => (
                  <div key={idx}>
                    <span className="font-serif text-3xl md:text-4xl text-[#141413] font-light">
                      {s.value}
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-stone-500 mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
