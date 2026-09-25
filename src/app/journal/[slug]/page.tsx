import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/data/innzoyData';

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: 'Essay Not Found — INNZOY' };

  return {
    title: `${article.title} — INNZOY Journal`,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const currentIndex = JOURNAL_ARTICLES.findIndex((a) => a.slug === slug);
  const nextArticle = JOURNAL_ARTICLES[(currentIndex + 1) % JOURNAL_ARTICLES.length];

  return (
    <article className="min-h-screen bg-[#F4F1EA] text-[#171715] pt-32 pb-36">
      {/* Header Breadcrumb */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 mb-12">
        <Link
          href="/journal"
          className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#777168] hover:text-[#171715] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>BACK TO ALL DISPATCHES</span>
        </Link>
      </div>

      {/* Editorial Title Spread */}
      <header className="max-w-4xl mx-auto px-6 md:px-12 mb-16 text-center space-y-6">
        <div className="flex items-center justify-center space-x-3 text-[10px] font-mono uppercase tracking-[0.32em] text-[#A68A68]">
          <span>{article.category}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-tight text-[#171715] leading-[1.02]">
          {article.title}
        </h1>

        <p className="font-serif italic text-lg sm:text-2xl text-[#777168] max-w-2xl mx-auto leading-relaxed">
          &quot;{article.subtitle}&quot;
        </p>

        <div className="pt-4 border-t border-[#171715]/10 max-w-xs mx-auto text-[10px] font-mono uppercase tracking-widest text-[#777168]">
          BY {article.author}
        </div>
      </header>

      {/* Main Cover Photograph */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E8E3DC] shadow-xl">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Essay Reading Body */}
      <div className="max-w-2xl mx-auto px-6 space-y-8 text-base sm:text-lg text-[#5A554D] font-light leading-relaxed">
        <p className="font-serif text-xl sm:text-2xl text-[#171715] leading-relaxed italic border-l-2 border-[#A68A68] pl-6 my-10">
          {article.excerpt}
        </p>

        {article.content.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}

        <div className="pt-16 mt-16 border-t border-[#171715]/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-mono uppercase tracking-[0.24em] text-[#777168]">
          <span>INNZOY EDITORIAL BUREAU</span>
          <span>END OF DISPATCH</span>
        </div>
      </div>

      {/* Next Article Recommendation */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 mt-28 pt-16 border-t border-[#171715]/10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block mb-2">
              NEXT DISPATCH
            </span>
            <Link href={`/journal/${nextArticle.slug}`} className="group block">
              <h3 className="font-serif text-2xl sm:text-4xl font-light uppercase text-[#171715] group-hover:text-[#A68A68] transition-colors">
                {nextArticle.title} →
              </h3>
            </Link>
          </div>

          <Link
            href={`/journal/${nextArticle.slug}`}
            className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-[#171715] border-b border-[#171715] pb-1 hover:text-[#A68A68] hover:border-[#A68A68] transition-colors"
          >
            <span>CONTINUE READING</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
