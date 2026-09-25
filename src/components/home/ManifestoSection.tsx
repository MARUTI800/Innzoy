'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import TextReveal from '@/components/common/TextReveal';

export default function ManifestoSection() {
  return (
    <section className="py-36 sm:py-44 md:py-52 lg:py-60 px-6 md:px-12 lg:px-16 bg-[#F4F1EA] text-[#171715] relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        {/* Small Editorial Metadata */}
        <ScrollReveal variant="fade-up" duration={700}>
          <div className="flex items-center space-x-4 mb-8 sm:mb-12">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
              THE INNZOY PHILOSOPHY
            </span>
            <span className="w-12 h-[1px] bg-[#171715]/15" />
          </div>
        </ScrollReveal>

        {/* 12-Column Editorial Grid: Headline Left / Text in Narrow Offset Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Headline Column: 8 Columns with Physical Window Mask Reveals */}
          <div className="lg:col-span-8">
            <TextReveal
              as="h2"
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light tracking-tight leading-[0.94] text-[#171715] uppercase"
              lines={['PLACES DESIGNED', 'TO STAY WITH YOU.']}
              lineClassName="first:text-[#171715] last:italic last:font-normal last:text-[#777168]"
              delay={100}
              stagger={160}
            />
          </div>

          {/* Narrow Offset Column: 4 Columns placed deliberately */}
          <div className="lg:col-span-4 lg:pt-6 space-y-8">
            <ScrollReveal variant="fade-up" duration={800} delay={250}>
              <p className="text-[#5A554D] text-base sm:text-lg font-light leading-relaxed">
                We believe a sanctuary should never feel generic, sterile, or detached from its environment.
                INNZOY creates spaces where contemporary architecture converses with quiet comfort, local stone,
                and deeply human warmth.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={350}>
              <p className="text-[#777168] text-xs sm:text-sm font-light leading-relaxed">
                From monastic cloister courtyards to high-altitude cedar chalets and coastal verandahs,
                every address is shaped to slow the pulse, filter the light, and leave an enduring impression.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={450}>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="group inline-flex items-center space-x-3 text-xs font-mono uppercase tracking-[0.28em] text-[#171715] border-b border-[#171715] pb-1 hover:text-[#A68A68] hover:border-[#A68A68] transition-colors duration-300"
                >
                  <span>ABOUT OUR ARCHITECTURE</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Editorial Footnote: Subtle architectural principles */}
        <ScrollReveal variant="fade-in" duration={800} delay={400}>
          <div className="mt-24 sm:mt-32 pt-10 border-t border-[#171715]/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-[9px] font-mono uppercase tracking-[0.28em] text-[#777168]">
            <div>
              <span className="text-[#171715] block mb-1">01 / MATERIALITY</span>
              <span>Granite, teak, lime plaster</span>
            </div>
            <div>
              <span className="text-[#171715] block mb-1">02 / LIGHT</span>
              <span>Courtyard shadow & ambient daylight</span>
            </div>
            <div>
              <span className="text-[#171715] block mb-1">03 / SERVICE</span>
              <span>24/7 Silent human host</span>
            </div>
            <div>
              <span className="text-[#171715] block mb-1">04 / TIME</span>
              <span>Unhurried arrival & presence</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
