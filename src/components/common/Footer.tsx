import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { BRAND, HOTELS, GUEST_HOUSES } from '@/data/innzoyData';
import { BookingTrigger } from '@/components/booking/BookingProvider';
import HotelJourneyLink from './HotelJourneyLink';

export default function Footer() {
  return <footer className="open-footer">
    <div className="open-footer-spread">
      <div className="open-footer-intro"><Link href="/" className="open-footer-signature" aria-label="Innzoy home"><Image className="open-footer-company-logo" src="/images/innzoy-logo.png" width={222} height={186} alt="Innzoy" unoptimized /></Link><p>{BRAND.subname}</p><p>{BRAND.tagline}</p><BookingTrigger className="open-footer-book">Book your stay <ArrowUpRight size={16} aria-hidden="true" /></BookingTrigger></div>
      <div className="open-footer-contact"><a href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`}>{BRAND.contact.phone}</a><a href={`mailto:${BRAND.contact.email}`}>{BRAND.contact.email}</a><a href={BRAND.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram · innzoy_hotels <ArrowUpRight size={14} aria-hidden="true" /></a></div>
      <div className="open-footer-office"><h2>Head office</h2><p>{BRAND.contact.headOffice}</p><p>Hotels and guest houses across Hyderabad.</p></div>
      <div className="open-footer-directory">
        <nav className="open-footer-addresses" aria-label="Hotels"><h2>Hotels</h2><ul>{HOTELS.map(property => <li key={property.id}><HotelJourneyLink href={`/stays/${property.slug}`}>{property.name}</HotelJourneyLink></li>)}</ul></nav>
        <nav className="open-footer-addresses" aria-label="Guest houses"><h2>Guest houses</h2><ul>{GUEST_HOUSES.map(property => <li key={property.id}><Link href={`/stays/${property.slug}`}>{property.name}</Link></li>)}</ul></nav>
      </div>
    </div>
    <div className="open-footer-bottom"><p>© {new Date().getFullYear()} Innzoy · All rights reserved</p><nav aria-label="Company"><Link href="/about">About</Link><Link href="/contact">Contact</Link><BookingTrigger intent="corporate">Corporate booking</BookingTrigger></nav></div>
  </footer>;
}
