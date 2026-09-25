'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { EXPERIENCES } from '@/data/innzoyData';
import { useBooking } from '@/context/BookingContext';
import TextReveal from '@/components/common/TextReveal';
import EditorialImage from '@/components/common/EditorialImage';
import ScrollReveal from '@/components/common/ScrollReveal';
import MagneticButton from '@/components/common/MagneticButton';

export default function ExperiencesPage() {
  const { openBooking } = useBooking();

  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-32 sm:pt-40 pb-36">
      {/* Editorial Header */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-20 md:mb-28">
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
              CURATED IMMERSIONS
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]">
              <TextReveal
                lines={['THE STAY EXTENDS']}
                as="div"
                className=""
                delay={200}
                stagger={160}
              />
              <TextReveal
                lines={['BEYOND THE ROOM.']}
                as="div"
                className="italic font-normal text-[#777168]"
                delay={360}
                stagger={160}
              />
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <ScrollReveal variant="fade-up" duration={800} delay={500}>
              <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                Thoughtful culinary rituals, biological stillness, and intimate encounters with regional craft and landscape.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Quick Nav Bar */}
        <ScrollReveal variant="fade-up" duration={700} delay={300}>
          <div className="mt-16 pt-8 border-t border-[#171715]/10 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="text-[#777168] uppercase tracking-[0.24em] text-[9px]">DISCIPLINES:</span>
            {EXPERIENCES.map((exp) => (
              <a
                key={exp.id}
                href={`#${exp.id}`}
                className="px-3 py-1 border border-[#171715]/15 uppercase tracking-[0.2em] text-[10px] hover:bg-[#171715] hover:text-[#FAF9F6] transition-colors duration-400"
              >
                {exp.category}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Experiences Detailed Storytelling List */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 space-y-32 md:space-y-44">
        {EXPERIENCES.map((exp, idx) => {
          const isEven = idx % 2 === 0;
          const revealTypes: Array<'curtain-v' | 'curtain-h' | 'center' | 'crop'> = ['curtain-v', 'curtain-h', 'center', 'crop'];

          return (
            <section
              key={exp.id}
              id={exp.id}
              className="scroll-mt-36 border-t border-[#171715]/10 pt-20 md:pt-28 relative"
            >
              {/* Anchor aliases for category navigation */}
              {exp.category.toLowerCase() === 'wellness' && (
                <span id="wellness" className="absolute -top-36" aria-hidden="true" />
              )}
              {exp.category.toLowerCase() === 'dining' && (
                <span id="dining" className="absolute -top-36" aria-hidden="true" />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                {/* Visual Canvas — Editorial Image Reveal */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <EditorialImage
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    revealType={revealTypes[idx % revealTypes.length]}
                    delay={100}
                    containerClassName="relative aspect-[16/11] w-full bg-[#E8E3DC]"
                    imageClassName="filter brightness-[0.92] contrast-[1.02]"
                  />
                  <ScrollReveal variant="fade-up" duration={600} delay={400}>
                    <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#777168]">
                      <span>0{idx + 1} / {exp.category}</span>
                      <span>{exp.location}</span>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Narrative & Details */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <ScrollReveal variant="fade-up" duration={700}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A68A68] block">
                      IMMERSION 0{idx + 1} · {exp.category.toUpperCase()}
                    </span>
                  </ScrollReveal>

                  <TextReveal
                    lines={exp.title.split(' ').reduce((acc: string[], word: string, i: number) => {
                      if (i % 3 === 0) acc.push(word);
                      else acc[acc.length - 1] += ` ${word}`;
                      return acc;
                    }, [])}
                    as="h2"
                    className="font-serif text-3xl sm:text-5xl font-light tracking-tight uppercase text-[#171715] leading-[1.02]"
                    delay={200}
                    stagger={120}
                  />

                  <ScrollReveal variant="fade-up" duration={800} delay={200}>
                    <p className="font-serif italic text-base text-[#5A554D] border-l border-[#A68A68] pl-4">
                      &ldquo;{exp.subtitle}&rdquo;
                    </p>
                  </ScrollReveal>

                  <ScrollReveal variant="fade-up" duration={800} delay={250}>
                    <p className="text-sm sm:text-base text-[#5A554D] font-light leading-relaxed">
                      {exp.description}
                    </p>
                  </ScrollReveal>

                  <ScrollReveal variant="fade-up" duration={700} delay={300}>
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#171715]/10 text-xs font-mono">
                      <div>
                        <span className="text-[#777168] block text-[9px] uppercase tracking-widest">
                          LOCATION
                        </span>
                        <span className="text-[#171715]">{exp.location}</span>
                      </div>
                      {exp.duration && (
                        <div>
                          <span className="text-[#777168] block text-[9px] uppercase tracking-widest">
                            DURATION
                          </span>
                          <span className="text-[#171715]">{exp.duration}</span>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ScrollReveal variant="fade-up" duration={800} delay={350}>
                      <div className="space-y-2 pt-1">
                        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block">
                          CURATED ELEMENTS
                        </span>
                        <div className="space-y-1 text-xs text-[#5A554D]">
                          {exp.highlights.map((h, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Check className="w-3.5 h-3.5 text-[#A68A68] shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  )}

                  <ScrollReveal variant="fade-up" duration={700} delay={400}>
                    <div className="pt-4">
                      <MagneticButton
                        as="button"
                        onClick={() => openBooking()}
                        className="px-6 py-3.5 bg-[#171715] text-[#FAF9F6] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#A68A68] transition-colors inline-flex items-center space-x-2"
                        data-cursor="RESERVE"
                      >
                        <span>INQUIRE WITH CONCIERGE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </MagneticButton>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>
          );
        })}

        {/* Bespoke Private Arrangements Box */}
        <ScrollReveal variant="scale-in" duration={1000}>
          <section className="bg-[#EAE6DE] p-10 md:p-16 text-center max-w-4xl mx-auto space-y-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68] block">
              TAILORED PRIVATE IMMERSIONS
            </span>
            <TextReveal
              lines={['CUSTOM PRIVATE ITINERARIES']}
              as="h3"
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#171715] uppercase tracking-tight"
              delay={300}
            />
            <p className="text-sm sm:text-base text-[#5A554D] font-light max-w-xl mx-auto leading-relaxed">
              Our silent concierge curates bespoke private arrangements—from intimate courtyard dining under starlit desert skies to guided botanical mountain walks.
            </p>
            <div className="pt-4">
              <MagneticButton as="div" strength={5}>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-[#171715] text-[#FAF9F6] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#A68A68] transition-colors inline-block"
                >
                  SPEAK WITH A PRIVATE HOST
                </Link>
              </MagneticButton>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
