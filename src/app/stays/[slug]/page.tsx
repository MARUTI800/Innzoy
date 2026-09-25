import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Check, MapPin, Users, Maximize2 } from 'lucide-react';
import { PROPERTIES } from '@/data/innzoyData';
import PropertyBookingButton from './PropertyBookingButton';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) return { title: 'Property Not Found — INNZOY' };

  return {
    title: `${property.name} — INNZOY Hotels & Resorts`,
    description: property.editorialSnippet,
    openGraph: {
      title: `${property.name} | INNZOY`,
      description: property.editorialSnippet,
      images: [{ url: property.heroImage }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      {/* 01. FULL-BLEED CINEMATIC HERO */}
      <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-[#141413] text-[#FAF8F5]">
        <Image
          src={property.heroImage}
          alt={property.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/30 to-black/40" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-16 md:pb-24">
          <Link
            href="/stays"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO ALL STAYS</span>
          </Link>

          <div className="flex items-center space-x-3 text-[10px] font-mono uppercase tracking-[0.35em] text-[#B89F7D] mb-3">
            <span>{property.chapter}</span>
            <span>·</span>
            <span>{property.coordinates}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light uppercase tracking-tight max-w-4xl">
            {property.name}
          </h1>

          <p className="mt-4 text-stone-300 text-sm md:text-base font-light max-w-xl leading-relaxed">
            {property.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PropertyBookingButton propertySlug={property.slug} />
            <div className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 font-mono text-xs text-white">
              Rates from <span className="font-bold text-[#FAF8F5]">{property.formattedPrice}</span>
              /night
            </div>
          </div>
        </div>
      </div>

      {/* 02. ARCHITECTURAL STORY & PHILOSOPHY */}
      <section className="py-24 md:py-32 px-6 md:px-12 border-b border-[#141413]/8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              01 / ARCHITECTURAL PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight uppercase leading-[1.1]">
              DESIGNED FOR CALM,
              <br />
              <span className="italic font-normal text-[#726E67]">INSPIRED BY LOCATION.</span>
            </h2>

            <p className="mt-6 text-base text-[#726E67] font-light leading-relaxed">
              {property.editorialSnippet}
            </p>

            {property.architectureDescription && (
              <p className="mt-4 text-sm text-[#726E67] font-light leading-relaxed border-l-2 border-[#B89F7D] pl-4 italic">
                {property.architectureDescription}
              </p>
            )}

            {/* Signature Features */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-[#141413]/8">
              {property.features.map((feat, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs font-mono text-stone-700">
                  <Check className="w-3.5 h-3.5 text-[#B89F7D] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-2xl">
              <Image
                src={property.gallery[1] || property.heroImage}
                alt="Architecture and materials"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 03. SUITES & LIVING QUARTERS */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white border-b border-[#141413]/8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 pb-6 border-b border-[#141413]/8">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              02 / LIVING ACCOMMODATION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight uppercase">
              ROOMS & SUITES
            </h2>
          </div>

          <div className="space-y-12">
            {property.roomTypes.map((room, idx) => (
              <div
                key={room.name}
                className="p-8 md:p-12 border border-[#141413]/10 bg-[#FAF8F5] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={room.image || property.gallery[idx % property.gallery.length]}
                      alt={room.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#B89F7D]">
                      SUITE OPTION 0{idx + 1}
                    </span>
                    <h3 className="font-serif text-3xl font-light text-[#141413] mt-1">
                      {room.name}
                    </h3>
                    <p className="text-xs text-[#726E67] font-light leading-relaxed mt-2">
                      {room.note}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 py-3 border-y border-[#141413]/8 text-xs font-mono">
                    <div>
                      <span className="text-stone-400 block text-[9px]">RATE</span>
                      <span className="font-bold text-stone-900">{room.price}</span> / night
                    </div>
                    {room.size && (
                      <div>
                        <span className="text-stone-400 block text-[9px]">FOOTPRINT</span>
                        <span className="flex items-center space-x-1">
                          <Maximize2 className="w-3 h-3 text-[#B89F7D]" />
                          <span>{room.size}</span>
                        </span>
                      </div>
                    )}
                    {room.guests && (
                      <div>
                        <span className="text-stone-400 block text-[9px]">CAPACITY</span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-[#B89F7D]" />
                          <span>{room.guests} Guests</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <PropertyBookingButton
                      propertySlug={property.slug}
                      roomName={room.name}
                      buttonLabel="RESERVE THIS SUITE"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. PROPERTY GALLERY */}
      <section className="py-24 md:py-32 px-6 md:px-12 border-b border-[#141413]/8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              03 / VISUAL CHRONICLE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight">
              PROPERTY PERSPECTIVES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {property.gallery.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <Image
                  src={img}
                  alt={`${property.name} perspective ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05. LOCATION & ADDRESS */}
      <section className="py-20 px-6 md:px-12 bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              04 / SANCTUARY ADDRESS
            </span>
            <h3 className="font-serif text-2xl font-light">{property.address}</h3>
            <p className="font-mono text-xs text-stone-500 mt-1">
              Coordinates: {property.coordinates}
            </p>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              property.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#2C2A29] transition-colors shrink-0 text-center"
          >
            OPEN IN GOOGLE MAPS →
          </a>
        </div>
      </section>
    </div>
  );
}
