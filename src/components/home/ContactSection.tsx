import { Mail, Phone, MessageCircle } from 'lucide-react';
import { BRAND, CORPORATE_BOOKING_URL, waLink } from '@/data/innzoyData';
import ScrollReveal from '@/components/common/ScrollReveal';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#121412] text-[#F7F5F0] py-16 md:py-24">
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <ScrollReveal variant="fade-up" duration={500}>
              <div className="flex items-center space-x-3 mb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#A68A68]">
                  Reservations
                </span>
                <span className="w-8 h-[1px] bg-white/20" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light mb-5">
                Talk to us directly
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed mb-8 max-w-md">
                Message the front desk at any property on WhatsApp for availability and rates, or
                reach the head office for corporate bookings.
              </p>

              <div className="space-y-3">
                <a
                  href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-sm text-stone-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#A68A68]" />
                  {BRAND.contact.phone}
                </a>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="flex items-center gap-3 text-sm text-stone-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#A68A68]" />
                  {BRAND.contact.email}
                </a>
              </div>

              <a
                href={CORPORATE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8 px-6 py-3.5 bg-[#A68A68] hover:bg-[#8E7047] font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors duration-300"
              >
                Corporate Booking
              </a>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BRAND.desks.map((desk, i) => (
                <ScrollReveal key={desk.name} variant="fade-up" duration={500} delay={i * 60}>
                  <a
                    href={waLink(
                      desk.whatsapp,
                      `Hello, I got the contact number from your website. I would like to know about availability at Innzoy ${desk.name}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 h-full border border-white/15 hover:border-[#A68A68] p-5 transition-colors duration-300"
                  >
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#A68A68] mb-2">
                        {desk.name}
                      </p>
                      <p className="font-serif text-xl text-white">{desk.phone}</p>
                    </div>
                    <MessageCircle className="w-5 h-5 text-white/40 group-hover:text-[#A68A68] transition-colors" />
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
