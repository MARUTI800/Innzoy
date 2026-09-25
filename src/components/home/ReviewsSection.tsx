'use client';

import { REVIEWS } from '@/data/innzoyData';
import { Star } from 'lucide-react';

export default function ReviewsSection() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
            10 / GUEST TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-tight">
            WORDS FROM THOSE
            <br />
            <span className="italic font-normal text-[#726E67]">WHO STAYED WITH US.</span>
          </h2>
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs font-mono text-stone-500">
            <span className="font-semibold text-stone-900">4.9 ★ RATING</span>
            <span>·</span>
            <span>VERIFIED STAYS ACROSS HYDERABAD</span>
          </div>
        </div>

        {/* 3 Columns of Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.slice(0, 3).map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-8 md:p-10 border border-[#141413]/8 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
            >
              <div>
                <div className="flex items-center space-x-1 text-[#B89F7D] mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="font-serif text-lg md:text-xl font-light text-[#141413] leading-relaxed italic mb-8">
                  &quot;{rev.quote}&quot;
                </p>
              </div>

              <div className="pt-6 border-t border-[#141413]/6">
                <span className="font-sans text-sm font-medium text-stone-900 block">
                  {rev.guest}
                </span>
                <span className="font-mono text-[10px] text-stone-500 block uppercase tracking-wider mt-0.5">
                  {rev.stay}
                </span>
                <span className="font-mono text-[9px] text-[#B89F7D] block uppercase tracking-widest mt-1">
                  ✓ {rev.verifiedSource}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
