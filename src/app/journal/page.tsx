import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/data/innzoyData';

export const metadata = {
  title: 'Journal — INNZOY Hotels & Resorts',
  description:
    'Essays on architectural restraint, slow travel, indigenous craft, and the philosophy of staying.',
};

export default function JournalPage() {
  const [leadArticle, ...otherArticles] = JOURNAL_ARTICLES;

  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-32 sm:pt-40 pb-36">
      {/* Editorial Header */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-20 md:mb-28">
        <div className="flex items-center space-x-3 mb-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
            EDITORIAL ARCHIVE
          </span>
          <span className="w-8 h-[1px] bg-[#171715]/15" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]">
              STORIES &
              <br />
              <span className="italic font-normal text-[#777168]">DISPATCHES.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
              Conversations on vernacular architecture, passive cooling wisdom, culinary craft, and the art of unhurried arrival.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Cover Story */}
      {leadArticle && (
        <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-28 md:mb-36">
          <Link
            href={`/journal/${leadArticle.slug}`}
            data-cursor="READ"
            className="group block border-t border-[#171715]/10 pt-12 md:pt-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-8">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E3DC]">
                  <Image
                    src={leadArticle.coverImage}
                    alt={leadArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover filter brightness-[0.92] contrast-[1.02] group-hover:scale-105 transition-transform duration-1200 ease-luxury"
                  />
                  <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-[0.3em] text-[#FAF9F6] bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/15">
                    COVER ESSAY · {leadArticle.category}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center space-x-3 text-[10px] font-mono text-[#A68A68] uppercase tracking-[0.25em]">
                  <span>{leadArticle.date}</span>
                  <span>·</span>
                  <span>{leadArticle.readTime}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#171715] leading-[1.02] group-hover:text-[#A68A68] transition-colors">
                  {leadArticle.title}
                </h2>

                <p className="font-serif italic text-base text-[#777168]">
                  &ldquo;{leadArticle.subtitle}&rdquo;
                </p>

                <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                  {leadArticle.excerpt}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#171715] border-b border-[#171715] pb-1 group-hover:translate-x-1 transition-transform">
                    <span>READ COVER ESSAY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Secondary Articles Grid */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto border-t border-[#171715]/10 pt-20 md:pt-28">
        <div className="mb-12">
          <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block">
            FURTHER READINGS & ESSAYS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {otherArticles.map((article, idx) => (
            <article key={article.slug} className="group">
              <Link href={`/journal/${article.slug}`} data-cursor="READ" className="block space-y-6">
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#E8E3DC]">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover filter brightness-[0.92] group-hover:scale-105 transition-transform duration-1000 ease-luxury"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-[#FAF9F6] bg-black/40 px-2.5 py-1">
                    ISSUE 0{idx + 2} · {article.category}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-[10px] font-mono text-[#A68A68] uppercase tracking-[0.24em]">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                    <span>·</span>
                    <span>By {article.author}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-tight text-[#171715] group-hover:text-[#A68A68] transition-colors leading-[1.1]">
                    {article.title}
                  </h3>

                  <p className="text-sm text-[#777168] font-light leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-[#171715] group-hover:translate-x-1 transition-transform">
                      <span>READ DISPATCH</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
