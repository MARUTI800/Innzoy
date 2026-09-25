'use client';

import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import TextReveal from '@/components/common/TextReveal';
import MagneticButton from '@/components/common/MagneticButton';

export default function BookingSection() {
  const { openBooking } = useBooking();
  const [destination, setDestination] = useState('jaipur');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openBooking({
      destination,
      guests: parseInt(guests) || 2,
    });
  };

  return (
    <section className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-[#191A18] text-[#FAF9F6] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        {/* Editorial Eyebrow */}
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center space-x-4 mb-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#A68A68]">
              YOUR NEXT STAY
            </span>
            <span className="w-12 h-[1px] bg-white/20" />
          </div>
        </ScrollReveal>

        {/* 12-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end">
          {/* Headline Column Left (7 cols) */}
          <div className="lg:col-span-7">
            <TextReveal
              as="h2"
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-white leading-[0.94]"
              lines={['WHERE WILL', 'YOU GO NEXT?']}
              lineClassName="first:text-white last:italic last:font-normal last:text-[#E8DFD3]"
              delay={100}
              stagger={160}
            />

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
              <p className="mt-8 text-stone-300 text-sm sm:text-base font-light max-w-lg leading-relaxed">
                Whether seeking the dry desert stepwells of Rajasthan, laterite coastal canopies in Goa,
                or high alpine stillness in the Dhauladhars—our resident concierge is at your service.
              </p>
            </ScrollReveal>
          </div>

          {/* Minimal Booking Controls Right (5 cols) */}
          <div className="lg:col-span-5">
            <ScrollReveal variant="fade-up" duration={800} delay={250}>
              <form
                onSubmit={handleSubmit}
                className="bg-[#212220] p-8 sm:p-10 border border-white/10 space-y-6 shadow-2xl"
              >
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 font-mono text-[9px] uppercase tracking-[0.28em] text-stone-400">
                    <MapPin className="w-3 h-3 text-[#A68A68]" />
                    <span>DESTINATION</span>
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#191A18] border border-white/20 px-4 py-3 text-xs text-[#FAF9F6] font-mono uppercase tracking-widest focus:outline-none focus:border-[#A68A68] transition-colors cursor-pointer"
                  >
                    <option value="jaipur">Jaipur (Amber Foothills Stepwell)</option>
                    <option value="goa">Goa (Morjim Coastal Pavilion)</option>
                    <option value="udaipur">Udaipur (Lake Pichola Cloister)</option>
                    <option value="himalayas">The Himalayas (Alpine Cedar Chalet)</option>
                    <option value="hyderabad">Hyderabad (Jubilee Hills Estate)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 font-mono text-[9px] uppercase tracking-[0.28em] text-stone-400">
                      <Calendar className="w-3 h-3 text-[#A68A68]" />
                      <span>APPROX. DATES</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next Month"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      className="w-full bg-[#191A18] border border-white/20 px-4 py-3 text-xs text-[#FAF9F6] placeholder-stone-500 font-sans focus:outline-none focus:border-[#A68A68] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 font-mono text-[9px] uppercase tracking-[0.28em] text-stone-400">
                      <Users className="w-3 h-3 text-[#A68A68]" />
                      <span>GUESTS</span>
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-[#191A18] border border-white/20 px-4 py-3 text-xs text-[#FAF9F6] font-mono tracking-widest focus:outline-none focus:border-[#A68A68] transition-colors cursor-pointer"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="4">3–4 Guests (Floor Suite)</option>
                      <option value="8">Full Estate Buyout</option>
                    </select>
                  </div>
                </div>

                <MagneticButton strength={4} className="w-full">
                  <button
                    type="submit"
                    data-cursor="RESERVE"
                    className="w-full group flex items-center justify-between px-6 py-4 bg-[#F4F1EA] text-[#171715] font-mono text-xs uppercase tracking-[0.26em] font-medium hover:bg-[#A68A68] hover:text-white transition-all duration-300"
                  >
                    <span>CHECK AVAILABILITY</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </MagneticButton>

                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400 text-center pt-1">
                  DIRECT CONCIERGE · WORKING INQUIRY
                </p>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
