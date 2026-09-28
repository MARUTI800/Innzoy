import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Check, ArrowLeft } from 'lucide-react';
import { PROPERTIES, waLink } from '@/data/innzoyData';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);
  if (!property) return { title: 'Property not found — Innzoy' };

  const title = `${property.label} ${property.name}, Hyderabad — Innzoy`;

  return {
    title,
    description: property.description,
    openGraph: {
      title,
      description: property.description,
      images: [{ url: property.heroImage }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = PROPERTIES.find((p) => p.slug === slug);

  if (!property) notFound();

  const bookHref =
    property.bookingUrl ??
    waLink(
      property.whatsapp ?? '918520963096',
      `Hello, I would like to check availability at Innzoy ${property.name}, Hyderabad.`
    );

  const related = PROPERTIES.filter(
    (p) => p.category === property.category && p.slug !== property.slug
  ).slice(0, 3);

  return (
    <div className="bg-[#F4F1EA] text-[#171715]">
      <section className="relative h-[58vh] min-h-[380px] w-full overflow-hidden bg-[#121412]">
        <Image
          src={property.heroImage}
          alt={`Innzoy ${property.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />

        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 pb-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68] mb-3">
            {property.label}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white">
            {property.name}
          </h1>
          <p className="text-sm text-stone-300 mt-3">{property.locality}</p>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 py-14 md:py-20">
        <Link
          href={`/stays?category=${property.category}`}
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5A554D] hover:text-[#171715] transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {property.category === 'hotel' ? 'All hotels' : 'All guest houses'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <p className="text-base text-[#5A554D] leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-light mb-5">Amenities</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2.5 text-sm text-[#5A554D]">
                    <Check className="w-3.5 h-3.5 text-[#A68A68] shrink-0" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            {property.gallery.length > 1 && (
              <div>
                <h2 className="font-serif text-2xl font-light mb-5">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.gallery.map((src, i) => (
                    <div key={src} className="relative aspect-[4/3] overflow-hidden bg-[#ECE8DE]">
                      <Image
                        src={src}
                        alt={`Innzoy ${property.name} photo ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 bg-white border border-[#171715]/10 p-6 md:p-8">
              {property.weekdayPrice ? (
                <div className="pb-6 mb-6 border-b border-[#171715]/10">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#777168] mb-2">
                    Prices starting at
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-4xl text-[#171715]">
                      {property.weekdayPrice}
                    </span>
                    {property.weekendPrice && (
                      <span className="text-sm text-[#777168]">
                        {property.weekendPrice} on weekends
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pb-6 mb-6 border-b border-[#171715]/10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#777168]">
                    {property.comingSoon ? 'Opening soon' : 'Enquire for rates'}
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-7">
                <a
                  href={property.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-[#5A554D] hover:text-[#171715] transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#A68A68]" />
                  <span>{property.address}</span>
                </a>

                {property.phoneDisplay && (
                  <a
                    href={`tel:${property.phoneDisplay.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-sm text-[#5A554D] hover:text-[#171715] transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0 text-[#A68A68]" />
                    {property.phoneDisplay}
                  </a>
                )}
              </div>

              {property.comingSoon ? (
                <span className="block text-center px-6 py-3.5 border border-[#171715]/15 font-mono text-[11px] uppercase tracking-[0.2em] text-[#777168]">
                  Coming Soon
                </span>
              ) : (
                <a
                  href={bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-6 py-3.5 bg-[#171715] hover:bg-[#A68A68] font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors duration-300"
                >
                  {property.bookingUrl ? 'Book on Airbnb' : 'Book on WhatsApp'}
                </a>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#171715]/10">
            <h2 className="font-serif text-2xl font-light mb-8">
              Other {property.category === 'hotel' ? 'hotels' : 'guest houses'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/stays/${item.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#ECE8DE] mb-4">
                    <Image
                      src={item.heroImage}
                      alt={`Innzoy ${item.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="font-serif text-xl group-hover:text-[#8E7047] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#777168] mt-1">{item.locality}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
