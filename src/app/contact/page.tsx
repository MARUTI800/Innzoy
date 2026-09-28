import type { Metadata } from 'next';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { BRAND, PROPERTIES, CORPORATE_BOOKING_URL, waLink } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export const metadata: Metadata = {
  title: 'Contact — Innzoy Hotels & Guest Houses',
  description:
    'Reach the Innzoy front desks on WhatsApp, or contact the head office in Kondapur, Hyderabad for corporate bookings.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#F4F1EA] text-[#171715] min-h-screen pt-28 md:pt-36 pb-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal variant="fade-up">
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68]">
              Contact
            </span>
            <span className="w-8 h-[1px] bg-[#171715]/15" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-5">
            Get in touch
          </h1>
          <p className="text-base text-[#5A554D] max-w-2xl leading-relaxed">
            Message any front desk on WhatsApp for availability and rates, or reach the head office
            for corporate bookings and invoicing.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-16">
          {BRAND.desks.map((desk, i) => (
            <ScrollReveal key={desk.name} variant="fade-up" delay={i * 60}>
              <a
                href={waLink(
                  desk.whatsapp,
                  `Hello, I got the contact number from your website. I would like to know about availability at Innzoy ${desk.name}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 h-full bg-white border border-[#171715]/10 hover:border-[#A68A68] p-5 transition-colors duration-300"
              >
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#A68A68] mb-2">
                    {desk.name}
                  </p>
                  <p className="font-serif text-xl">{desk.phone}</p>
                </div>
                <MessageCircle className="w-5 h-5 text-[#171715]/25 group-hover:text-[#A68A68] transition-colors" />
              </a>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 border-y border-[#171715]/10">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-2xl font-light mb-5">Head office</h2>
            <div className="space-y-4 text-sm">
              <p className="flex items-start gap-2.5 text-[#5A554D] leading-relaxed">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#A68A68]" />
                {BRAND.contact.headOffice}
              </p>
              <a
                href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 text-[#5A554D] hover:text-[#171715] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#A68A68]" />
                {BRAND.contact.phone}
              </a>
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="flex items-center gap-2.5 text-[#5A554D] hover:text-[#171715] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#A68A68]" />
                {BRAND.contact.email}
              </a>
            </div>

            <a
              href={CORPORATE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-7 px-6 py-3.5 bg-[#171715] hover:bg-[#A68A68] font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors duration-300"
            >
              Corporate Booking
            </a>
          </div>

          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-light mb-5">All addresses</h2>
            <ul className="divide-y divide-[#171715]/10">
              {PROPERTIES.map((property) => (
                <li key={property.id} className="py-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-md">
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#A68A68] mb-1.5">
                      {property.label}
                    </p>
                    <p className="font-serif text-lg">{property.name}</p>
                    <p className="text-xs text-[#777168] mt-1 leading-relaxed">{property.address}</p>
                  </div>
                  <a
                    href={property.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5A554D] hover:text-[#171715] border-b border-[#171715]/25 hover:border-[#171715] pb-0.5 transition-colors whitespace-nowrap"
                  >
                    Map →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
