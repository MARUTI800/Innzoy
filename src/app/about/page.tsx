'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND, DESTINATIONS } from '@/data/innzoyData';
import TextReveal from '@/components/common/TextReveal';
import EditorialImage from '@/components/common/EditorialImage';
import ScrollReveal from '@/components/common/ScrollReveal';
import MagneticButton from '@/components/common/MagneticButton';
import { useRef, useEffect, useState } from 'react';

const principles = [
  {
    number: '01',
    title: 'Material Honesty',
    desc: 'We build with tactile, unadorned materials—native Dholpur sandstone, hand-hewn laterite, unfinished deodar cedar, and chuna lime plaster. Materials that age with dignity under sunlight and rain.',
  },
  {
    number: '02',
    title: 'Monastic Calm & Light',
    desc: 'Rooms are not decorated; they are carved for light and volume. Deep recessed jali screens temper fierce midday heat into soft rhythmic shadows, slowing the human pulse upon entry.',
  },
  {
    number: '03',
    title: 'Silent Human Host',
    desc: 'No automated bureaucracy or scripted coldness. Our resident concierges are observant, intuitive, and present 24/7 without ever intruding upon the solitude of your stay.',
  },
  {
    number: '04',
    title: 'Rooted in Geography',
    desc: 'Each address is a direct response to its geographic coordinates—from coastal Goan tidal palms to Mewari lake cloisters and high-altitude Himalayan slate hearths.',
  },
];

function ParallaxHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-28 md:mb-40">
      <EditorialImage
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
        alt="INNZOY Architecture and Light"
        fill
        priority
        sizes="100vw"
        revealType="crop"
        delay={100}
        threshold={0.05}
        containerClassName="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#262522]"
        imageClassName="filter brightness-[0.88] contrast-[1.04]"
      />
      <div className="relative mt-[-80px] z-10 flex items-center justify-between px-6 font-mono text-[9px] uppercase tracking-widest text-[#FAF9F6]">
        <ScrollReveal variant="fade-up" duration={700} delay={400}>
          <span>INNZOY ARCHITECTURAL MONOGRAPH</span>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" duration={700} delay={600}>
          <span>26.9124° N / 75.7873° E</span>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-32 sm:pt-40 pb-36">
      {/* Editorial Header — Line-by-line TextReveal */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-20 md:mb-28">
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
              THE INNZOY PHILOSOPHY
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]">
              <TextReveal
                lines={['HOSPITALITY,']}
                as="div"
                className=""
                delay={200}
                stagger={160}
              />
              <TextReveal
                lines={['WITHOUT THE NOISE.']}
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
                We design sanctuaries that converse with their environment. Spaces where architecture, light, and silence converge into an enduring sense of arrival.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Hero Architectural Spread — Cinematic Image Reveal */}
      <ParallaxHero />

      {/* The Manifesto: Two-Column Essay with Staggered Reveals */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-28 md:mb-40 border-t border-[#171715]/10 pt-20 md:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal variant="fade-up" duration={600}>
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
                THE MANIFESTO
              </span>
            </ScrollReveal>
            <TextReveal
              lines={['PLACES DESIGNED', 'TO STAY WITH YOU.']}
              as="h2"
              className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-tight text-[#171715] leading-[1.02]"
              delay={200}
              stagger={140}
            />
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#5A554D] text-base sm:text-lg font-light leading-relaxed">
            <ScrollReveal variant="fade-up" duration={800} delay={100}>
              <p>
                Contemporary hospitality has become an industry of uniformity—sterile hotel boxes, transactional interactions, and artificial opulence that could exist in any airport district on earth.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" duration={800} delay={200}>
              <p>
                INNZOY was founded to build the antithesis of the generic hotel. We believe that true luxury is tactile, understated, and quiet. It is found in the cool touch of burnished chuna plaster during a Rajasthani afternoon; the scent of rain-soaked red laterite on the Goan coast; and the warmth of a slate hearth as snow dusts the Dhauladhar ridges.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" duration={800} delay={300}>
              <p>
                Every property in our collection is an intimate conversation with its coordinates. We do not construct monuments to vanity; we curate sanctuaries for rest.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Principles Grid — Staggered Card Reveals */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-28 md:mb-40 border-t border-[#171715]/10 pt-20 md:pt-28">
        <div className="mb-16">
          <ScrollReveal variant="fade-up" duration={600}>
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-2">
              FOUNDING TENETS
            </span>
          </ScrollReveal>
          <TextReveal
            lines={['WHAT SHAPES EVERY ADDRESS']}
            as="h2"
            className="font-serif text-4xl sm:text-5xl font-light uppercase tracking-tight"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map((p, idx) => (
            <ScrollReveal
              key={p.number}
              variant="fade-up"
              duration={900}
              delay={idx * 120}
            >
              <div className="p-8 bg-white border border-[#171715]/10 flex flex-col justify-between space-y-8 group hover:border-[#A68A68]/40 transition-colors duration-700">
                <span className="font-mono text-xs text-[#A68A68] block">
                  {p.number} —
                </span>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-light uppercase text-[#171715] group-hover:text-[#A68A68] transition-colors duration-500">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A554D] font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Destinations Footprint — Cinematic Dark Section */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto border-t border-[#171715]/10 pt-20 md:pt-28">
        <ScrollReveal variant="scale-in" duration={1000}>
          <div className="bg-[#171715] text-[#FAF9F6] p-10 md:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="space-y-3 max-w-xl">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
                THE ACTIVE PORTFOLIO
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-light uppercase text-white">
                {DESTINATIONS.length} REGIONS ACROSS INDIA
              </h3>
              <p className="text-sm text-stone-300 font-light leading-relaxed">
                Explore our sanctuaries in Jaipur, Goa, Udaipur, the Western Himalayas, and Hyderabad.
              </p>
            </div>

            <MagneticButton as="div" strength={5}>
              <Link
                href="/stays"
                className="px-8 py-4 bg-[#F4F1EA] text-[#171715] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#A68A68] hover:text-white transition-colors inline-flex items-center space-x-2 shrink-0"
              >
                <span>EXPLORE THE ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
