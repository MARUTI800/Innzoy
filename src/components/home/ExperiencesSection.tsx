'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { EXPERIENCES } from '@/data/innzoyData';

export default function ExperiencesSection() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#141413] text-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-white/10 pb-10">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              05 / CURATED IMMERSIONS
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase leading-[1.05]">
              THE STAY
              <br />
              IS MORE THAN
              <br />
              <span className="italic font-normal text-stone-300">THE ROOM.</span>
            </h2>
          </div>

          <p className="mt-6 md:mt-0 text-stone-400 max-w-sm text-sm font-light leading-relaxed">
            Crafted experiences shaped by regional geography, indigenous kitchen wisdom, and
            restorative rituals.
          </p>
        </div>

        {/* 2x2 Grid of Rich Immersive Experiences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-[#1C1B19] cursor-pointer"
              data-cursor="EXPLORE"
            >
              {/* Background Image with Hover Treatment */}
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-1000 ease-luxury filter brightness-[0.8] group-hover:scale-105 group-hover:brightness-[0.4]"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Category & Duration Tag */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#B89F7D]">
                <span>0{idx + 1} — {exp.category}</span>
                {exp.duration && <span>{exp.duration}</span>}
              </div>

              {/* Content Panel that shifts on hover */}
              <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 transform group-hover:-translate-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-300 block mb-1">
                  {exp.location}
                </span>

                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-white tracking-tight">
                    {exp.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                <p className="font-serif italic text-stone-300 text-xs mt-1">
                  {exp.subtitle}
                </p>

                {/* Secondary Description Revealed on Hover */}
                <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 ease-luxury">
                  <p className="mt-3 text-xs text-stone-300 leading-relaxed font-light border-t border-white/20 pt-3">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-16 text-center">
          <Link
            href="/experiences"
            className="inline-flex items-center space-x-3 px-8 py-4 border border-white/30 text-white font-mono text-xs uppercase tracking-[0.24em] hover:bg-white hover:text-[#141413] transition-colors"
          >
            <span>VIEW ALL CURATED EXPERIENCES</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
