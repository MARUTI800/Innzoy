'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Maximize2 } from 'lucide-react';
import { PROPERTIES } from '@/data/innzoyData';
import { useBooking } from '@/context/BookingContext';

export default function RoomsPreviewSection() {
  const { openBooking } = useBooking();

  // Curate 3 standout suites across the portfolio
  const featuredSuites = [
    {
      number: "01",
      name: "Boutique Private Suite",
      property: "The Innzoy Villa Jubilee Hills",
      propertySlug: "jubilee-hills",
      destination: "Jubilee Hills, Hyderabad",
      quote: "Quiet mornings, natural teak materials and views designed to slow the day down.",
      price: "₹6,999",
      size: "54 m²",
      guests: 2,
      bed: "Custom King",
      image: "https://innzoy.in/wp-content/uploads/2025/10/jublie-hill-bedroom-2.jpg"
    },
    {
      number: "02",
      name: "Panoramic Skyline Suite",
      property: "The Innzoy Penthouse Kondapur",
      propertySlug: "kondapur",
      destination: "JV Hills Skyline, Kondapur",
      quote: "Direct terrace access overlooking the Western horizon, filled with evening golden hour light.",
      price: "₹2,499",
      size: "46 m²",
      guests: 2,
      bed: "Plush King",
      image: "https://innzoy.in/wp-content/uploads/2025/11/9-scaled.jpg"
    },
    {
      number: "03",
      name: "Private Country Villa Estate",
      property: "The Innzoy Luxury Retreat Mokila",
      propertySlug: "mokila",
      destination: "Mokila Countryside, Hyderabad",
      quote: "Low-slung pavilion architecture surrounded by private lawns, fresh morning dew and birdsong.",
      price: "₹6,999",
      size: "140 m²",
      guests: 6,
      bed: "3 King Bedrooms",
      image: "https://innzoy.in/wp-content/uploads/2025/11/Frame-38-2.png"
    }
  ];

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#FAF8F5] text-[#141413] border-b border-[#141413]/8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-[#141413]/8 pb-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              04 / ROOMS & LIVING SPACES
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase leading-[1.05]">
              SUITES DESIGNED
              <br />
              <span className="italic font-normal text-[#726E67]">TO SLOW TIME DOWN.</span>
            </h2>
          </div>

          <p className="mt-6 md:mt-0 text-[#726E67] max-w-sm text-sm font-light leading-relaxed">
            Orthopedic comfort bedding, natural finishes, unhurried check-outs, and deep acoustic
            silence across every address.
          </p>
        </div>

        {/* Large Horizontal Editorial Suites */}
        <div className="space-y-20 md:space-y-28">
          {featuredSuites.map((suite, idx) => {
            const isReversed = idx % 2 !== 0;

            return (
              <div
                key={suite.name}
                className="group border border-[#141413]/10 bg-white p-6 md:p-10 transition-all duration-700 hover:border-[#141413]/30"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                    isReversed ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Block (60%) */}
                  <div
                    className={`lg:col-span-7 overflow-hidden ${
                      isReversed ? 'order-1 lg:order-2' : 'order-1'
                    }`}
                  >
                    <div
                      className="relative aspect-[16/10] w-full overflow-hidden"
                      data-cursor="VIEW"
                    >
                      <Image
                        src={suite.image}
                        alt={suite.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-1000 ease-luxury group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-4 left-4 bg-[#141413]/70 backdrop-blur-sm px-3 py-1 font-mono text-[9px] text-[#FAF8F5] tracking-widest uppercase">
                        {suite.destination}
                      </div>
                    </div>
                  </div>

                  {/* Text & Specs Block (40%) */}
                  <div
                    className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${
                      isReversed ? 'order-2 lg:order-1' : 'order-2'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-3 font-mono text-[10px] text-[#B89F7D] tracking-[0.3em] uppercase mb-2">
                        <span>{suite.number}</span>
                        <span>—</span>
                        <span>{suite.property}</span>
                      </div>

                      <h3 className="font-serif text-3xl md:text-4xl font-light text-[#141413] tracking-tight mb-3">
                        {suite.name}
                      </h3>

                      <p className="text-sm text-[#726E67] font-light leading-relaxed italic">
                        &quot;{suite.quote}&quot;
                      </p>
                    </div>

                    {/* Suite Specifications */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#141413]/8 text-xs font-mono">
                      <div>
                        <span className="text-[9px] uppercase text-stone-400 block tracking-widest">
                          FROM
                        </span>
                        <span className="font-semibold text-stone-900">{suite.price}</span>
                        <span className="text-[10px] text-stone-400 block">/ night</span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase text-stone-400 block tracking-widest">
                          GUESTS
                        </span>
                        <span className="flex items-center space-x-1 font-medium text-stone-900">
                          <Users className="w-3 h-3 text-[#B89F7D]" />
                          <span>{suite.guests} Adults</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase text-stone-400 block tracking-widest">
                          DIMENSIONS
                        </span>
                        <span className="flex items-center space-x-1 font-medium text-stone-900">
                          <Maximize2 className="w-3 h-3 text-[#B89F7D]" />
                          <span>{suite.size}</span>
                        </span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center space-x-4 pt-2">
                      <Link
                        href={`/stays/${suite.propertySlug}`}
                        className="group/btn inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.22em] font-medium text-[#141413] hover:text-[#B89F7D] transition-colors"
                      >
                        <span>VIEW SUITE & PROPERTY</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>

                      <button
                        onClick={() => openBooking({ propertySlug: suite.propertySlug, roomName: suite.name })}
                        className="px-4 py-2 border border-[#141413] text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-[#141413] hover:text-[#FAF8F5] transition-colors"
                      >
                        BOOK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
