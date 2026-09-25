'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Check, ArrowRight, ArrowUpRight } from 'lucide-react';
import { BRAND, PROPERTIES } from '@/data/innzoyData';
import TextReveal from '@/components/common/TextReveal';
import ScrollReveal from '@/components/common/ScrollReveal';
import MagneticButton from '@/components/common/MagneticButton';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'Stay Reservation',
    destination: 'jaipur',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-32 sm:pt-40 pb-36">
      {/* Editorial Header */}
      <section className="px-6 md:px-12 lg:px-16 max-w-[1500px] mx-auto mb-20 md:mb-28">
        <ScrollReveal variant="fade-up" duration={600}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168]">
              DIRECT LIAISON
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light uppercase tracking-tight text-[#171715] leading-[0.92]">
              <TextReveal
                lines={['SPEAK WITH']}
                as="div"
                className=""
                delay={200}
                stagger={160}
              />
              <TextReveal
                lines={['OUR DESK.']}
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
                24/7 dedicated human concierge. We assist with sanctuary reservations, private architectural buyouts, dining preferences, and travel transfers.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Main Two-Column Contact Section */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Contact Channels */}
          <div className="lg:col-span-5 space-y-10">
            <ScrollReveal variant="fade-up" duration={700}>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block mb-2">
                  COMMUNICATION LINES
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight">
                  HUMAN CONCIERGE
                </h2>
                <p className="mt-4 text-sm text-[#5A554D] font-light leading-relaxed">
                  No automated bot menus or impersonal ticketing. Our resident team is observant, responsive, and available around the clock.
                </p>
              </div>
            </ScrollReveal>

            {/* Direct Channels */}
            <div className="space-y-6 pt-6 border-t border-[#171715]/10">
              <ScrollReveal variant="fade-up" duration={700} delay={100}>
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-[#EAE6DE] border border-[#171715]/10 shrink-0 group-hover:bg-[#171715] group-hover:border-[#171715] transition-colors duration-500">
                    <Phone className="w-4 h-4 text-[#171715] group-hover:text-[#FAF9F6] transition-colors duration-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#777168] block">
                      TELEPHONE (DIRECT CONCIERGE)
                    </span>
                    <a
                      href={`tel:${BRAND.contact.reservationsPhone}`}
                      className="font-serif text-xl text-[#171715] hover:text-[#A68A68] transition-colors"
                    >
                      {BRAND.contact.reservationsPhone}
                    </a>
                    <p className="text-[11px] text-[#777168] mt-0.5">
                      Available 24 hours daily for inquiries and guest arrivals
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" duration={700} delay={200}>
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-[#EAE6DE] border border-[#171715]/10 shrink-0 group-hover:bg-[#171715] group-hover:border-[#171715] transition-colors duration-500">
                    <Mail className="w-4 h-4 text-[#171715] group-hover:text-[#FAF9F6] transition-colors duration-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#777168] block">
                      CONCIERGE & RESERVATIONS EMAIL
                    </span>
                    <a
                      href={`mailto:${BRAND.contact.conciergeEmail}`}
                      className="font-serif text-xl text-[#171715] hover:text-[#A68A68] transition-colors"
                    >
                      {BRAND.contact.conciergeEmail}
                    </a>
                    <p className="text-[11px] text-[#777168] mt-0.5">
                      For itinerary planning and bespoke suite requests
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" duration={700} delay={300}>
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-[#EAE6DE] border border-[#171715]/10 shrink-0 group-hover:bg-[#A68A68] group-hover:border-[#A68A68] transition-colors duration-500">
                    <Mail className="w-4 h-4 text-[#A68A68] group-hover:text-[#FAF9F6] transition-colors duration-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#777168] block">
                      PRESS & ARCHITECTURAL INQUIRIES
                    </span>
                    <a
                      href={`mailto:${BRAND.contact.pressEmail}`}
                      className="font-serif text-xl text-[#171715] hover:text-[#A68A68] transition-colors"
                    >
                      {BRAND.contact.pressEmail}
                    </a>
                    <p className="text-[11px] text-[#777168] mt-0.5">
                      Editorial publications, photography rights, and partnerships
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" duration={700} delay={400}>
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-[#EAE6DE] border border-[#171715]/10 shrink-0 group-hover:bg-[#171715] group-hover:border-[#171715] transition-colors duration-500">
                    <MapPin className="w-4 h-4 text-[#171715] group-hover:text-[#FAF9F6] transition-colors duration-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#777168] block">
                      CENTRAL RESIDENT DESK
                    </span>
                    <p className="font-sans text-xs text-[#5A554D] leading-relaxed mt-1">
                      {BRAND.contact.office}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right: Clean Editorial Inquiry Form */}
          <ScrollReveal variant="fade-up" duration={900} delay={200} className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-12 md:p-14 border border-[#171715]/10 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#A68A68] block mb-2">
                DISPATCH AN INQUIRY
              </span>
              <h3 className="font-serif text-3xl font-light uppercase tracking-tight mb-8">
                CONCIERGE DESK NOTE
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-[#171715] text-[#FAF9F6] flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-3xl font-light uppercase">Inquiry Received</h4>
                  <p className="text-sm text-[#5A554D] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#171715]">{formData.name}</strong>. Our guest concierge has received your note and will reply directly to {formData.email}.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 border border-[#171715] font-mono text-xs uppercase tracking-widest text-[#171715] hover:bg-[#171715] hover:text-[#FAF9F6] transition-colors"
                    >
                      SEND ANOTHER NOTE
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#777168] mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Mehra"
                      className="w-full bg-[#F4F1EA] border border-[#171715]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#171715] font-sans transition-colors duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#777168] mb-2">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="radhika@example.com"
                        className="w-full bg-[#F4F1EA] border border-[#171715]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#171715] font-sans transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#777168] mb-2">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F4F1EA] border border-[#171715]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#171715] font-sans transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#777168] mb-2">
                        DESTINATION OF INTEREST
                      </label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-[#F4F1EA] border border-[#171715]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#171715] font-mono uppercase tracking-wider transition-colors duration-300"
                      >
                        <option value="jaipur">Jaipur (Sandstone Cloister)</option>
                        <option value="goa">Goa (Laterite Coastal Pavilion)</option>
                        <option value="udaipur">Udaipur (Marble Lake Cloister)</option>
                        <option value="himalayas">The Himalayas (Alpine Cedar Chalet)</option>
                        <option value="hyderabad">Hyderabad (Jubilee Hills Estate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#777168] mb-2">
                        PURPOSE OF INQUIRY
                      </label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full bg-[#F4F1EA] border border-[#171715]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#171715] font-mono uppercase tracking-wider transition-colors duration-300"
                      >
                        <option value="Stay Reservation">Stay Reservation & Dates</option>
                        <option value="Private Estate Buyout">Private Estate Buyout</option>
                        <option value="Curated Dining / Event">Curated Dining / Special Evening</option>
                        <option value="Press & Media">Press & Architectural Documentation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#777168] mb-2">
                      TRAVEL DATES & SPECIAL PREFERENCES
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Approximate dates, number of guests, or bespoke architectural/culinary requests..."
                      className="w-full bg-[#F4F1EA] border border-[#171715]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#171715] font-sans transition-colors duration-300"
                    />
                  </div>

                  <div className="pt-2">
                    <MagneticButton
                      as="button"
                      className="w-full py-4 bg-[#171715] text-[#FAF9F6] font-mono text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#A68A68] transition-colors flex items-center justify-center space-x-2"
                      data-cursor="SUBMIT"
                    >
                      <span>SUBMIT INQUIRY TO CONCIERGE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Sanctuary Directory Index */}
        <section className="mt-28 pt-16 border-t border-[#171715]/10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 gap-4">
            <div>
              <ScrollReveal variant="fade-up" duration={600}>
                <span className="font-mono text-[9px] uppercase tracking-[0.38em] text-[#777168] block mb-2">
                  ACTIVE PORTFOLIO DIRECTORY
                </span>
              </ScrollReveal>
              <TextReveal
                lines={['ALL SANCTUARY ADDRESSES']}
                as="h3"
                className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight"
                delay={200}
              />
            </div>
            <ScrollReveal variant="fade-up" duration={700} delay={300}>
              <Link
                href="/stays"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#171715] hover:text-[#A68A68] transition-colors inline-flex items-center space-x-1"
              >
                <span>VIEW FULL COLLECTION</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTIES.map((p, idx) => (
              <ScrollReveal key={p.slug} variant="fade-up" duration={800} delay={idx * 80}>
                <div className="p-6 bg-white border border-[#171715]/10 space-y-3 group hover:border-[#A68A68]/40 transition-colors duration-500">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A68A68] uppercase tracking-wider">
                    <span>{p.region}</span>
                    <span>{p.type}</span>
                  </div>
                  <h4 className="font-serif text-xl font-light uppercase text-[#171715] group-hover:text-[#A68A68] transition-colors duration-400">
                    <Link href={`/stays/${p.slug}`} className="hover:text-[#A68A68] transition-colors">
                      {p.name}
                    </Link>
                  </h4>
                  <p className="text-xs text-[#5A554D] font-light leading-relaxed line-clamp-2">
                    {p.tagline}
                  </p>
                  <div className="pt-2 border-t border-[#171715]/10 flex items-center justify-between text-[10px] font-mono text-[#777168]">
                    <span>{p.coordinates}</span>
                    <Link
                      href={`/stays/${p.slug}`}
                      className="text-[#171715] hover:text-[#A68A68] uppercase tracking-wider"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
