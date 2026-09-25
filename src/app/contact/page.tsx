'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Check, ArrowRight } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { BRAND, PROPERTIES } from '@/data/innzoyData';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'Stay Reservation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#141413]">
      <PageHero
        eyebrow="DIRECT CONCIERGE"
        title="SPEAK WITH OUR DESK"
        subtitle="24/7 dedicated human concierge. We assist with bespoke stays, extended corporate leases, private dining, and group villa retreats."
        bgImage="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=80"
        coordinates="17.4699° N / 78.3578° E"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
                COMMUNICATION LINES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight">
                ALWAYS ACCESSIBLE
              </h2>
              <p className="mt-4 text-sm text-[#726E67] font-light leading-relaxed">
                Whether you need early morning airport transfers, dietary preferences noted for your
                suite, or high-speed fiber credentials, our desk responds immediately.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-6 pt-4 border-t border-[#141413]/8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#F4EFEA] border border-[#141413]/10">
                  <Phone className="w-5 h-5 text-[#B89F7D]" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 block">
                    TELEPHONE (24/7 CONCIERGE)
                  </span>
                  <a
                    href={`tel:${BRAND.contact.phone}`}
                    className="font-serif text-xl text-stone-900 hover:text-[#B89F7D] transition-colors"
                  >
                    {BRAND.contact.phone}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">Direct reservations & check-in host</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#F4EFEA] border border-[#141413]/10">
                  <MessageCircle className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 block">
                    WHATSAPP CONCIERGE
                  </span>
                  <a
                    href={BRAND.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-xl text-stone-900 hover:text-[#B89F7D] transition-colors"
                  >
                    Open WhatsApp Chat →
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">Average reply time under 2 minutes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#F4EFEA] border border-[#141413]/10">
                  <Mail className="w-5 h-5 text-[#B89F7D]" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 block">
                    EMAIL INQUIRIES
                  </span>
                  <a
                    href={`mailto:${BRAND.contact.email}`}
                    className="font-serif text-xl text-stone-900 hover:text-[#B89F7D] transition-colors"
                  >
                    {BRAND.contact.email}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">Corporate billing and long-term stays</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#F4EFEA] border border-[#141413]/10">
                  <MapPin className="w-5 h-5 text-[#B89F7D]" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 block">
                    CENTRAL HEADQUARTERS
                  </span>
                  <p className="font-sans text-xs text-stone-700 leading-relaxed mt-1">
                    {BRAND.contact.headOffice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Editorial Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-14 border border-[#141413]/8 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-2">
              DISPATCH AN INQUIRY
            </span>
            <h3 className="font-serif text-3xl font-light uppercase tracking-tight mb-8">
              CONCIERGE INQUIRY DESK
            </h3>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#141413] text-white flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-2xl font-light">Inquiry Successfully Dispatched</h4>
                <p className="text-sm text-[#726E67] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-stone-900">{formData.name}</strong>. Our guest
                  concierge has received your details and will connect with you directly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 border border-[#141413] font-mono text-xs uppercase tracking-widest text-[#141413] hover:bg-[#141413] hover:text-white transition-colors"
                  >
                    SEND ANOTHER NOTE
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#726E67] mb-2">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full bg-[#FAF8F5] border border-[#141413]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#141413] font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#726E67] mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@example.com"
                      className="w-full bg-[#FAF8F5] border border-[#141413]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#141413] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#726E67] mb-2">
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF8F5] border border-[#141413]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#141413] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#726E67] mb-2">
                    PURPOSE OF INQUIRY
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#141413]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#141413] font-sans"
                  >
                    <option value="Stay Reservation">Stay Reservation & Availability</option>
                    <option value="Corporate Extended Stay">Corporate Extended Stay / Monthly Lease</option>
                    <option value="Full Villa Buyout">Full Villa Buyout / Celebration</option>
                    <option value="Property Partnership">Property Partnership & Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#726E67] mb-2">
                    MESSAGE / DATES / SPECIAL PREFERENCES
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your upcoming travel dates, suite requirements, or any specific requests..."
                    className="w-full bg-[#FAF8F5] border border-[#141413]/15 px-4 py-3 text-xs focus:outline-none focus:border-[#141413] font-sans"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#2C2A29] transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>SUBMIT TO CONCIERGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Property Directory Index */}
        <div className="mt-28 pt-16 border-t border-[#141413]/10">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
            ADDRESS DIRECTORY
          </span>
          <h3 className="font-serif text-3xl font-light uppercase tracking-tight mb-10">
            ALL SANCTUARY LOCATIONS IN HYDERABAD
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTIES.filter((p) => p.location.includes('Hyderabad')).map((p) => (
              <div key={p.slug} className="p-6 bg-white border border-[#141413]/8 text-xs font-mono space-y-1.5">
                <span className="font-serif text-base font-medium text-stone-900 block font-sans">
                  {p.name}
                </span>
                <p className="text-stone-500 font-sans text-xs leading-relaxed">{p.address}</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-[#B89F7D]">
                  <span>{p.coordinates}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      p.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Map ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
