import { Star } from 'lucide-react';
import { BRAND, REVIEWS } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function ReviewsSection() {
  return (
    <section className="bg-[#ECE8DE] py-16 md:py-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-3 gap-6 pb-12 mb-12 border-b border-[#171715]/10">
          {BRAND.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#171715]">
                {stat.value}
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#777168] mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <ScrollReveal variant="fade-up" duration={500}>
          <div className="flex items-center space-x-3 mb-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68]">
              Customer Reviews
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#171715] mb-10">
            What our guests say
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {REVIEWS.map((review, i) => (
            <ScrollReveal key={review.name} variant="fade-up" duration={500} delay={i * 60}>
              <figure className="h-full flex flex-col bg-white border border-[#171715]/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-3.5 h-3.5 fill-[#A68A68] text-[#A68A68]" />
                  <span className="font-mono text-[11px] text-[#171715]">{review.rating}</span>
                </div>
                <figcaption className="font-serif text-lg text-[#171715] mb-3">
                  {review.title}
                </figcaption>
                <blockquote className="text-[13px] leading-relaxed text-[#5A554D] flex-1">
                  {review.text}
                </blockquote>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#777168] mt-5 pt-4 border-t border-[#171715]/10">
                  {review.name}
                </p>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
