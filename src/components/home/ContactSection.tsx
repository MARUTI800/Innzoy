import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND, HOTELS, waLink } from '@/data/innzoyData';
import { BookingTrigger } from '@/components/booking/BookingProvider';
import '@/styles/open-house-closing.css';

export default function ContactSection() {
  const stay = HOTELS[0];
  return <section id="contact" className="oh-direct" aria-labelledby="oh-direct-heading">
    <div className="oh-direct-note"><span className="oh-meta">{BRAND.subname}</span><h2 id="oh-direct-heading">For your next stay.</h2><p>{BRAND.headline}</p><BookingTrigger className="oh-action">Book your stay <ArrowUpRight size={18} aria-hidden="true" /></BookingTrigger></div>
    <div className="oh-direct-photo"><Link href={`/stays/${stay.slug}`} aria-label={`View ${stay.name}, the hotel pictured here`}><Image src={stay.gallery[1] || stay.heroImage} alt={`A room at Innzoy ${stay.name}`} fill sizes="(max-width:760px) 100vw, 32vw" /></Link><span>{stay.name} / Room interior</span></div>
    <div className="oh-direct-correspondence"><h3>Talk to us directly</h3><p>Message the front desk at any property on WhatsApp for availability and rates, or reach the head office for corporate bookings.</p><a href={`tel:${BRAND.contact.phone.replace(/\s/g,'')}`}>{BRAND.contact.phone} <ArrowUpRight size={15} aria-hidden="true" /></a><a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email} <ArrowUpRight size={15} aria-hidden="true" /></a><BookingTrigger intent="corporate" className="oh-action">Corporate booking <ArrowUpRight size={15} aria-hidden="true" /></BookingTrigger></div>
    <nav className="oh-desk-index" aria-label="Property front desks"><span className="oh-meta">Speak with your property</span><ol>{BRAND.desks.map(desk => <li key={desk.name}><a href={waLink(desk.whatsapp,`Hello, I got the contact number from your website. I would like to know about availability at Innzoy ${desk.name}.`)} target="_blank" rel="noopener noreferrer" aria-label={`${desk.name}, ${desk.phone}. Contact the front desk via WhatsApp, opens in a new tab.`}><strong>{desk.name}</strong><span>{desk.phone}</span><span>WhatsApp <ArrowUpRight size={14} aria-hidden="true" /></span></a></li>)}</ol></nav>
  </section>;
}
