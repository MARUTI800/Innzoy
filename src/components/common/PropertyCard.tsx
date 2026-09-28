import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Property } from '@/types';
import { waLink } from '@/data/innzoyData';

export default function PropertyCard({ property }: { property: Property }) {
  const bookHref =
    property.bookingUrl ??
    waLink(
      property.whatsapp ?? '918520963096',
      `Hello, I would like to check availability at Innzoy ${property.name}, Hyderabad.`
    );

  return (
    <article className="group flex flex-col bg-white border border-[#171715]/10 transition-colors duration-300 hover:border-[#171715]/25">
      <Link
        href={`/stays/${property.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#ECE8DE]"
      >
        <Image
          src={property.heroImage}
          alt={`Innzoy ${property.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {property.comingSoon && (
          <span className="absolute top-3 left-3 bg-[#171715] text-white font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1.5">
            Coming Soon
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#A68A68] mb-2">
          {property.label}
        </p>

        <h3 className="font-serif text-2xl font-normal text-[#171715] mb-2.5">
          <Link href={`/stays/${property.slug}`} className="hover:text-[#8E7047] transition-colors">
            {property.name}
          </Link>
        </h3>

        <p className="flex items-start gap-1.5 text-[13px] leading-relaxed text-[#5A554D] mb-4">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#A68A68]" />
          <span className="line-clamp-2">{property.address}</span>
        </p>

        <div className="mt-auto pt-4 border-t border-[#171715]/10">
          {property.weekdayPrice ? (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#777168]">
                From
              </span>
              <span className="font-serif text-2xl text-[#171715]">{property.weekdayPrice}</span>
              {property.weekendPrice && (
                <span className="font-mono text-[10px] text-[#777168]">
                  / {property.weekendPrice} weekends
                </span>
              )}
            </div>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#777168] mb-4">
              {property.comingSoon ? 'Opening soon' : 'Enquire for rates'}
            </p>
          )}

          <div className="flex items-center gap-3">
            {property.comingSoon ? (
              <span className="flex-1 text-center px-4 py-2.5 border border-[#171715]/15 font-mono text-[10px] uppercase tracking-[0.2em] text-[#777168]">
                Coming Soon
              </span>
            ) : (
              <a
                href={bookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2.5 bg-[#171715] hover:bg-[#A68A68] font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors duration-300"
              >
                {property.bookingUrl ? 'Book on Airbnb' : 'Book Now'}
              </a>
            )}

            <Link
              href={`/stays/${property.slug}`}
              className="px-4 py-2.5 border border-[#171715]/20 hover:border-[#171715] font-mono text-[10px] uppercase tracking-[0.2em] text-[#171715] transition-colors duration-300"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
