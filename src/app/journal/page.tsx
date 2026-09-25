import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/common/PageHero';
import { JOURNAL_ARTICLES } from '@/data/innzoyData';

export const metadata = {
  title: 'Journal — INNZOY Hotels & Resorts',
  description: 'Essays on architectural restraint, slow travel, indigenous craft, and the art of unhurried dwelling.',
};

export default function JournalPage() {
  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      <PageHero
        eyebrow="EDITORIAL ARCHIVE"
        title="THE INNZOY JOURNAL"
        subtitle="Dispatches on slow living, timeless vernacular architecture, local craft, and the philosophy of staying."
        bgImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
        coordinates="17.4319° N / 78.4073° E"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-28">
        {JOURNAL_ARTICLES.map((article, idx) => (
          <article
            key={article.slug}
            id={article.slug}
            className="scroll-mt-32 border-b border-[#141413]/10 pb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Cover Image (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[3/4] w-full overflow-hidden shadow-xl bg-stone-200">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#141413]/70 backdrop-blur-md px-3 py-1 font-mono text-[9px] text-white tracking-widest uppercase">
                    ISSUE 0{idx + 1} · {article.category}
                  </div>
                </div>
              </div>

              {/* Essay Content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.25em] text-[#B89F7D]">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                  <span>·</span>
                  <span>By {article.author}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight uppercase leading-[1.1]">
                  {article.title}
                </h2>

                <p className="font-serif italic text-base md:text-lg text-stone-600 leading-relaxed">
                  &quot;{article.subtitle}&quot;
                </p>

                <p className="text-stone-800 text-sm md:text-base font-normal leading-relaxed border-l-2 border-[#B89F7D] pl-4">
                  {article.excerpt}
                </p>

                <div className="space-y-4 pt-2 text-stone-600 text-sm font-light leading-relaxed">
                  {article.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#141413]/8 flex items-center justify-between text-xs font-mono text-stone-500">
                  <span>INNZOY EDITORIAL BUREAU</span>
                  <span className="text-[#B89F7D] uppercase tracking-widest">
                    END OF DISPATCH
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
