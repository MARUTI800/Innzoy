'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import TextReveal from '@/components/common/TextReveal';
import MagneticButton from '@/components/common/MagneticButton';

export default function FinalStatement() {
  const { openBooking } = useBooking();

  return (
    <section className="py-36 sm:py-48 md:py-60 px-6 md:px-12 lg:px-16 bg-[#F4F1EA] text-[#171715] border-t border-[#171715]/10 relative overflow-hidden">
      {/* Subtle background ambient text watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]"
      >
        <span className="font-serif text-[28vw] font-light leading-none tracking-tighter whitespace-nowrap text-[#171715]">
          INNZOY
        </span>
      </div>

      <div className="max-w-[1500px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Main Statement */}
          <div className="lg:col-span-8">
            <ScrollReveal variant="fade-up" duration={700}>
              <div className="flex items-center space-x-3 mb-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
                  AN INVITATION
                </span>
                <span className="w-8 h-[1px] bg-[#171715]/15" />
              </div>
            </ScrollReveal>

            <TextReveal
              as="h2"
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]"
              lines={['STAY A LITTLE', 'LONGER.']}
              lineClassName="first:text-[#171715] last:italic last:font-normal last:text-[#777168]"
              delay={100}
              stagger={160}
            />
          </div>

          {/* Action Column */}
          <div className="lg:col-span-4 lg:pt-8 space-y-8">
            <ScrollReveal variant="fade-up" duration={800} delay={200}>
              <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                Whether arriving for a secluded monsoon season on the Goan coast, quiet courtyard contemplation in Jaipur, or high-altitude mountain retreat in the Himalayas.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={300}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <MagneticButton strength={6}>
                  <button
                    onClick={() => openBooking()}
                    data-cursor="RESERVE"
                    className="w-full sm:w-auto px-8 py-4 bg-[#171715] text-[#FAF9F6] font-mono text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#A68A68] transition-colors duration-300 text-center"
                  >
                    REQUEST RESERVATION
                  </button>
                </MagneticButton>

                <Link
                  href="/stays"
                  className="group inline-flex items-center justify-center space-x-2 px-6 py-4 border border-[#171715]/20 text-[#171715] font-mono text-xs uppercase tracking-[0.24em] hover:border-[#171715] transition-colors duration-300"
                >
                  <span>ALL STAYS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Quiet Footnote Rule */}
        <ScrollReveal variant="fade-in" duration={800} delay={400}>
          <div className="mt-28 pt-8 border-t border-[#171715]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168]">
            <span>THE ARCHITECTURE OF REST · CONTEMPORARY HOSPITALITY GROUP</span>
            <span>26.9124° N, 75.7873° E — GLOBAL COORDINATES</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
