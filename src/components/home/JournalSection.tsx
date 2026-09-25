'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/data/innzoyData';

export default function JournalSection() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-[#141413]/8 pb-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              09 / EDITORIAL JOURNAL
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase leading-[1.05]">
              NOTES ON TRAVEL,
              <br />
              <span className="italic font-normal text-[#726E67]">CRAFT & ARCHITECTURE.</span>
            </h2>
          </div>

          <Link
            href="/journal"
            className="mt-6 md:mt-0 group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] font-medium text-[#141413] hover:text-[#B89F7D] transition-colors"
          >
            <span>VIEW ALL DISPATCHES</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Magazine Cover Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {JOURNAL_ARTICLES.slice(0, 3).map((article, idx) => (
            <Link
              key={article.slug}
              href={`/journal#${article.slug}`}
              className="group flex flex-col justify-between"
              data-cursor="READ"
            >
              <div>
                {/* Magazine Cover Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E8E3DC] mb-6 shadow-[0_15px_35px_rgba(0,0,0,0.04)]">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-luxury filter brightness-[0.92] group-hover:scale-105"
                  />
                  {/* Subtle top issue badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#FAF8F5] drop-shadow">
                    <span>ISSUE 0{idx + 1}</span>
                    <span>{article.category}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-[#141413] tracking-tight group-hover:text-[#B89F7D] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#726E67] font-light leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <span className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest font-medium text-[#141413] group-hover:translate-x-1 transition-transform">
                  <span>READ ESSAY</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
