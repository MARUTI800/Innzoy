'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Maximize2, Users, Check } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import TextReveal from '@/components/common/TextReveal';
import EditorialImage from '@/components/common/EditorialImage';
import MagneticButton from '@/components/common/MagneticButton';

// Types matching the data structure
interface RoomType {
  name: string;
  price: string;
  note: string;
  image?: string;
  size?: string;
  guests?: number;
  bed?: string;
  amenities?: string[];
}

interface PropertyData {
  slug: string;
  name: string;
  heroImage: string;
  tagline: string;
  region: string;
  coordinates: string;
  elevation?: string;
  editorialSnippet: string;
  architectureDescription: string;
  architect?: string;
  yearOpened?: string;
  materialsUsed?: string[];
  features: string[];
  roomTypes: RoomType[];
  gallery: string[];
  diningSnippet?: string;
  wellnessSnippet?: string;
  formattedPrice: string;
  destinationId: string;
}

interface DestinationData {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  climate?: string;
}

interface Props {
  property: PropertyData;
  destination?: DestinationData;
}

function ParallaxHero({ property }: { property: PropertyData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / (viewportHeight * 0.5)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative h-[80vh] sm:h-[90vh] w-full overflow-hidden bg-[#171715] text-[#FAF9F6]">
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `scale(${1 + scrollProgress * 0.08}) translate3d(0, ${scrollProgress * 30}px, 0)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <Image
          src={property.heroImage}
          alt={property.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.78] contrast-[1.04]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#171715] via-[#171715]/20 to-black/40" />

      <div className="relative z-10 h-full max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-16 md:pb-24">
        <a
          href="/stays"
          className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.24em] text-stone-300 hover:text-white mb-8 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          <span>RETURN TO THE COLLECTION</span>
        </a>

        <div
          className="flex items-center space-x-4 text-[10px] font-mono uppercase tracking-[0.35em] text-[#A68A68] mb-4"
          style={{
            opacity: 1 - scrollProgress * 2,
            transform: `translate3d(0, ${scrollProgress * -20}px, 0)`,
          }}
        >
          <span>{property.region.toUpperCase()}</span>
          <span>·</span>
          <span>{property.coordinates}</span>
          {property.elevation && (
            <>
              <span>·</span>
              <span>ELEV. {property.elevation}</span>
            </>
          )}
        </div>

        <TextReveal
          lines={property.name.split(' ')}
          as="h1"
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light uppercase tracking-tight max-w-5xl leading-[0.92]"
          delay={400}
          stagger={100}
        />

        <ScrollReveal variant="fade-up" duration={800} delay={700}>
          <p className="mt-6 text-stone-300 text-sm sm:text-base md:text-lg font-light max-w-2xl leading-relaxed">
            {property.tagline}
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" duration={700} delay={900}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <MagneticButton as="div" strength={5}>
              <PropertyBookingButtonInline propertySlug={property.slug} />
            </MagneticButton>
            <div className="px-5 py-3.5 bg-black/40 backdrop-blur-md border border-white/15 font-mono text-xs text-white">
              Rates from <span className="font-serif text-base text-[#FAF9F6]">{property.formattedPrice}</span>
              <span className="text-[10px] text-stone-400"> / night</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function PropertyBookingButtonInline({ propertySlug, roomName, buttonLabel = 'RESERVE SANCTUARY' }: { propertySlug: string; roomName?: string; buttonLabel?: string }) {
  const { openBooking } = useBooking();
  return (
    <button
      onClick={() => openBooking({ propertySlug, roomName })}
      className="px-6 py-3.5 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#A68A68] transition-colors duration-500"
    >
      {buttonLabel}
    </button>
  );
}

export default function PropertyDetailClient({ property, destination }: Props) {
  return (
    <div className="bg-[#F4F1EA] text-[#171715]">
      {/* 01. PARALLAX CINEMATIC HERO */}
      <ParallaxHero property={property} />

      {/* 02. ARCHITECTURAL MONOGRAPH & VERNACULAR MATERIALITY */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto border-b border-[#171715]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <ScrollReveal variant="fade-up" duration={600}>
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-3">
                  01 / ARCHITECTURAL ARCHIVE
                </span>
              </ScrollReveal>
              <TextReveal
                lines={['SHAPED BY GEOLOGY,', 'LIGHT & STILLNESS.']}
                as="h2"
                className="font-serif text-4xl sm:text-6xl font-light tracking-tight uppercase leading-[0.96]"
                delay={200}
                stagger={140}
              />
            </div>

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
              <p className="text-base sm:text-lg text-[#5A554D] font-light leading-relaxed">
                {property.editorialSnippet}
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={300}>
              <div className="p-6 md:p-8 bg-[#EAE6DE] border-l-2 border-[#171715] space-y-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block">
                  VERNACULAR TECTONICS
                </span>
                <p className="text-xs sm:text-sm text-[#5A554D] font-light leading-relaxed">
                  {property.architectureDescription}
                </p>
              </div>
            </ScrollReveal>

            {/* Materials Used */}
            {property.materialsUsed && property.materialsUsed.length > 0 && (
              <ScrollReveal variant="fade-up" duration={800} delay={350}>
                <div className="pt-4 space-y-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block">
                    TACTILE MATERIAL PALETTE
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {property.materialsUsed.map((mat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 border border-[#171715]/15 bg-white/50 font-mono text-[10px] uppercase tracking-widest text-[#171715] hover:border-[#A68A68] hover:text-[#A68A68] transition-colors duration-400 cursor-default"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Distinctive Features */}
            <ScrollReveal variant="fade-up" duration={800} delay={400}>
              <div className="pt-6 border-t border-[#171715]/10">
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#777168] block mb-4">
                  SANCTUARY SPECIFICATIONS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-[#5A554D]">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#A68A68] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Asymmetric Side Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <EditorialImage
              src={property.gallery[1] || property.heroImage}
              alt={`${property.name} architectural perspective`}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              revealType="curtain-h"
              delay={300}
              containerClassName="relative aspect-[3/4] w-full bg-[#E8E3DC] shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
              imageClassName="filter brightness-[0.93]"
            />
            <ScrollReveal variant="fade-up" duration={600} delay={500}>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#777168] px-1">
                <span>ARCHITECTURAL DETAIL</span>
                <span>{property.yearOpened ? `COMPLETED ${property.yearOpened}` : 'ORIGINAL'}</span>
              </div>
            </ScrollReveal>

            {property.architect && (
              <ScrollReveal variant="fade-up" duration={700} delay={600}>
                <div className="p-4 border border-[#171715]/10 font-mono text-[10px] uppercase tracking-[0.22em] text-[#777168] flex items-center justify-between hover:border-[#A68A68]/40 transition-colors duration-500">
                  <span>MASTER ARCHITECT:</span>
                  <span className="text-[#171715] font-semibold">{property.architect}</span>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* 03. SUITES & LIVING QUARTERS */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto border-b border-[#171715]/10">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#171715]/10">
          <div>
            <ScrollReveal variant="fade-up" duration={600}>
              <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-2">
                02 / LIVING ACCOMMODATION
              </span>
            </ScrollReveal>
            <TextReveal
              lines={['SUITES & QUARTERS']}
              as="h2"
              className="font-serif text-4xl sm:text-6xl font-light tracking-tight uppercase leading-[0.96]"
              delay={200}
            />
          </div>
          <ScrollReveal variant="fade-up" duration={700} delay={300}>
            <p className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-[0.2em] text-[#777168]">
              Each suite features unhurried check-in and private host services
            </p>
          </ScrollReveal>
        </div>

        <div className="space-y-16">
          {property.roomTypes.map((room, idx) => (
            <ScrollReveal key={room.name} variant="fade-up" duration={900} delay={idx * 100}>
              <div className="p-8 sm:p-12 border border-[#171715]/10 bg-white grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group hover:border-[#A68A68]/30 transition-colors duration-700">
                <div className="lg:col-span-5">
                  <EditorialImage
                    src={room.image || property.gallery[idx % property.gallery.length]}
                    alt={room.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    revealType={idx % 2 === 0 ? 'curtain-v' : 'crop'}
                    delay={200}
                    containerClassName="relative aspect-[16/11] w-full bg-[#E8E3DC]"
                    imageClassName=""
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#A68A68]">
                      OPTION 0{idx + 1}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#171715] uppercase tracking-tight mt-1 group-hover:text-[#A68A68] transition-colors duration-500">
                      {room.name}
                    </h3>
                    <p className="text-sm text-[#5A554D] font-light leading-relaxed mt-3">
                      {room.note}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 py-4 border-y border-[#171715]/10 text-xs font-mono">
                    <div>
                      <span className="text-[#777168] block text-[9px] uppercase tracking-widest">NIGHTLY RATE</span>
                      <span className="font-serif text-lg text-[#171715]">{room.price}</span>
                    </div>
                    {room.size && (
                      <div>
                        <span className="text-[#777168] block text-[9px] uppercase tracking-widest">FOOTPRINT</span>
                        <span className="flex items-center space-x-1.5 text-[#171715] pt-0.5">
                          <Maximize2 className="w-3 h-3 text-[#A68A68]" />
                          <span>{room.size}</span>
                        </span>
                      </div>
                    )}
                    {room.guests && (
                      <div>
                        <span className="text-[#777168] block text-[9px] uppercase tracking-widest">CAPACITY</span>
                        <span className="flex items-center space-x-1.5 text-[#171715] pt-0.5">
                          <Users className="w-3 h-3 text-[#A68A68]" />
                          <span>{room.guests} Guests</span>
                        </span>
                      </div>
                    )}
                    {room.bed && (
                      <div>
                        <span className="text-[#777168] block text-[9px] uppercase tracking-widest">BED</span>
                        <span className="text-[#171715] pt-0.5 block">{room.bed}</span>
                      </div>
                    )}
                  </div>

                  {room.amenities && (
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider text-[#777168]">
                      {room.amenities.map((amenity, aIdx) => (
                        <span key={aIdx} className="px-2.5 py-1 bg-[#F4F1EA]">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  <div>
                    <MagneticButton as="div" strength={4}>
                      <PropertyBookingButtonInline
                        propertySlug={property.slug}
                        roomName={room.name}
                        buttonLabel="INQUIRE FOR THIS SUITE"
                      />
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 04. RITUALS & SENSORY PERSPECTIVES */}
      {(property.diningSnippet || property.wellnessSnippet) && (
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto border-b border-[#171715]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {property.diningSnippet && (
              <ScrollReveal variant="fade-up" duration={900}>
                <div className="p-8 sm:p-12 bg-[#EAE6DE] space-y-4 group hover:bg-[#E4DFD7] transition-colors duration-700">
                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
                    KITCHEN & HEARTH
                  </span>
                  <h3 className="font-serif text-3xl font-light uppercase text-[#171715]">
                    THE DINING RITUAL
                  </h3>
                  <p className="text-sm text-[#5A554D] font-light leading-relaxed">
                    {property.diningSnippet}
                  </p>
                  <div className="pt-2">
                    <a
                      href="/experiences#dining"
                      className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#171715] hover:text-[#A68A68] transition-colors editorial-link"
                    >
                      <span>EXPLORE DINING PROGRAM</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {property.wellnessSnippet && (
              <ScrollReveal variant="fade-up" duration={900} delay={150}>
                <div className="p-8 sm:p-12 bg-[#EAE6DE] space-y-4 group hover:bg-[#E4DFD7] transition-colors duration-700">
                  <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block">
                    BODY & STILLNESS
                  </span>
                  <h3 className="font-serif text-3xl font-light uppercase text-[#171715]">
                    THE WELLNESS RITUAL
                  </h3>
                  <p className="text-sm text-[#5A554D] font-light leading-relaxed">
                    {property.wellnessSnippet}
                  </p>
                  <div className="pt-2">
                    <a
                      href="/experiences#wellness"
                      className="inline-flex items-center space-x-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#171715] hover:text-[#A68A68] transition-colors editorial-link"
                    >
                      <span>EXPLORE WELLNESS PROGRAM</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* 05. PROPERTY PERSPECTIVES (GALLERY) — Staggered Masonry Reveals */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto border-b border-[#171715]/10">
        <div className="mb-12">
          <ScrollReveal variant="fade-up" duration={600}>
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-2">
              03 / VISUAL CHRONICLE
            </span>
          </ScrollReveal>
          <TextReveal
            lines={['PROPERTY PERSPECTIVES']}
            as="h2"
            className="font-serif text-4xl sm:text-5xl font-light uppercase tracking-tight"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {property.gallery.map((img, i) => {
            const revealTypes: Array<'curtain-v' | 'curtain-h' | 'center' | 'crop'> = ['curtain-v', 'curtain-h', 'center', 'crop'];
            return (
              <ScrollReveal key={i} variant="fade-up" duration={800} delay={i * 100}>
                <EditorialImage
                  src={img}
                  alt={`${property.name} perspective ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  revealType={revealTypes[i % revealTypes.length]}
                  delay={i * 80}
                  containerClassName="relative aspect-[4/3] bg-[#E8E3DC]"
                  imageClassName="filter brightness-[0.93]"
                />
                <div className="mt-2 font-mono text-[8px] uppercase tracking-widest text-[#777168]">
                  FIG. 0{i + 1}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 06. DESTINATION CONTEXT */}
      {destination && (
        <ScrollReveal variant="fade-up" duration={1000}>
          <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#171715] text-[#FAF9F6]">
            <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68] block mb-2">
                  04 / THE REGIONAL CONTEXT
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light uppercase text-white">
                  {destination.name} · {destination.region}
                </h3>
                <p className="font-mono text-xs text-stone-400 mt-2">
                  Coordinates: {destination.coordinates} · Climate: {destination.climate}
                </p>
              </div>

              <MagneticButton as="div" strength={5}>
                <a
                  href={`/destinations#${destination.id}`}
                  className="px-8 py-4 bg-[#F4F1EA] text-[#171715] font-mono text-xs uppercase tracking-[0.24em] hover:bg-[#A68A68] hover:text-white transition-colors shrink-0 text-center inline-flex items-center space-x-2"
                >
                  <span>EXPLORE {destination.name.toUpperCase()} REGION</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </MagneticButton>
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
}
