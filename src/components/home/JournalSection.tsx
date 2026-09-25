'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';
import TextReveal from '@/components/common/TextReveal';

export default function JournalSection() {
  const dominantStory = JOURNAL_ARTICLES[0]; // The Art of Arriving
  const secondaryStory1 = JOURNAL_ARTICLES[1]; // 48 Hours in Jaipur
  const secondaryStory2 = JOURNAL_ARTICLES[2]; // Craft / Architecture / Place

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-[#F4F1EA] text-[#171715] border-t border-[#171715]/10">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-28 pb-8 border-b border-[#171715]/10">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-3">
                EDITORIAL DISPATCHES
              </span>
              <TextReveal
                as="h2"
                className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-[#171715] uppercase leading-[0.95]"
                lines={['STORIES FROM INNZOY']}
                delay={100}
              />
            </div>

            <Link
              href="/journal"
              data-cursor="READ"
              className="mt-6 md:mt-0 group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#171715] hover:text-[#A68A68] transition-colors"
            >
              <span>VIEW ALL ESSAYS</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Magazine-Like Editorial Layout: 1 Dominant Story (7 cols) + 2 Secondary Stories (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Dominant Story Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal variant="clip-up" duration={1000}>
              <Link
                href={`/journal/${dominantStory.slug}`}
                data-cursor="READ"
                className="group block"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#E8E3DC] mb-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
                  <Image
                    src={dominantStory.coverImage}
                    alt={dominantStory.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover filter brightness-[0.92] contrast-[1.02] transition-transform duration-1200 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.3em] text-[#FAF9F6] bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/15">
                    COVER ESSAY
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] font-mono text-[#777168] uppercase tracking-[0.25em] group-hover:text-[#A68A68] transition-colors">
                    <span>{dominantStory.category}</span>
                    <span>·</span>
                    <span>{dominantStory.readTime}</span>
                    <span>·</span>
                    <span>{dominantStory.date}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light uppercase text-[#171715] tracking-tight leading-[1.02] transition-all duration-300 group-hover:text-[#A68A68] group-hover:-translate-y-1">
                    {dominantStory.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed max-w-xl">
                    {dominantStory.excerpt}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#171715] group-hover:translate-x-2 transition-transform">
                      <span>READ ESSAY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>

          {/* 2 Secondary Stories Right (5 cols stacked with thin divider) */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-[#171715]/10 space-y-10 lg:space-y-12">
            {/* Story 2: 48 Hours in Jaipur */}
            <ScrollReveal variant="fade-up" duration={800} delay={150}>
              <Link
                href={`/journal/${secondaryStory1.slug}`}
                data-cursor="READ"
                className="group block pt-2 first:pt-0 space-y-4"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E3DC] mb-5">
                  <Image
                    src={secondaryStory1.coverImage}
                    alt={secondaryStory1.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover filter brightness-[0.92] transition-transform duration-1000 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-[#FAF9F6] bg-black/40 px-2.5 py-1">
                    FEATURED
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[9px] font-mono text-[#777168] uppercase tracking-[0.24em] group-hover:text-[#A68A68] transition-colors">
                    <span>{secondaryStory1.category}</span>
                    <span>·</span>
                    <span>{secondaryStory1.readTime}</span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl font-light uppercase text-[#171715] tracking-tight group-hover:text-[#A68A68] transition-all duration-300 group-hover:-translate-y-1">
                    {secondaryStory1.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#777168] font-light leading-relaxed line-clamp-2">
                    {secondaryStory1.excerpt}
                  </p>

                  <div className="pt-1">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#171715] group-hover:translate-x-1.5 transition-transform">
                      <span>READ DISPATCH</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Story 3: Craft / Architecture / Place */}
            <ScrollReveal variant="fade-up" duration={800} delay={250}>
              <Link
                href={`/journal/${secondaryStory2.slug}`}
                data-cursor="READ"
                className="group block pt-10 space-y-4"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E3DC] mb-5">
                  <Image
                    src={secondaryStory2.coverImage}
                    alt={secondaryStory2.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover filter brightness-[0.92] transition-transform duration-1000 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-[#FAF9F6] bg-black/40 px-2.5 py-1">
                    MATERIALITY
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[9px] font-mono text-[#777168] uppercase tracking-[0.24em] group-hover:text-[#A68A68] transition-colors">
                    <span>{secondaryStory2.category}</span>
                    <span>·</span>
                    <span>{secondaryStory2.readTime}</span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl font-light uppercase text-[#171715] tracking-tight group-hover:text-[#A68A68] transition-all duration-300 group-hover:-translate-y-1">
                    {secondaryStory2.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#777168] font-light leading-relaxed line-clamp-2">
                    {secondaryStory2.excerpt}
                  </p>

                  <div className="pt-1">
                    <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#171715] group-hover:translate-x-1.5 transition-transform">
                      <span>READ DISPATCH</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
