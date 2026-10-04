import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BRAND, HOTELS, GUEST_HOUSES } from '@/data/innzoyData';
import EditorialImage from '@/components/common/EditorialImage';

export const metadata: Metadata = {
  title: 'About — Innzoy Hotels & Guest Houses',
  description: 'Innzoy operates hotels and guest houses across west Hyderabad, offering clean, affordable stays for business and family travellers.',
};
export default function AboutPage() {
  return <article className="open-about open-page">
    <header className="open-about-opening">
      <div className="open-about-intro"><p className="open-eyebrow">About Innzoy / Hyderabad, India</p><h1>Good places. Easy stays.</h1><p>{BRAND.tagline}</p><span>{BRAND.subname}</span></div>
      <figure className="open-about-opening-photo"><EditorialImage src={BRAND.heroImage} alt="Innzoy Hotels, Hyderabad" fill preload sizes="100vw" containerClassName="open-photo-fill" revealType="curtain-h" delay={0} /><figcaption>Innzoy Hotels / West Hyderabad</figcaption></figure>
    </header>
    <section className="open-about-standard" aria-label="About Innzoy"><p className="open-eyebrow">Our approach</p><p>Innzoy runs {HOTELS.length} hotels and {GUEST_HOUSES.length} guest houses across west Hyderabad — Khajaguda, Gachibowli, Manikonda, HITEC City, Jubilee Hills, Kondapur and Gopanpally. Every property is run to the same standard: clean rooms, working amenities, and staff who answer the phone.</p></section>
    <aside className="open-about-numbers" aria-label="Innzoy in numbers">{BRAND.stats.map((stat) => <div key={stat.label}><p>{stat.value}</p><span>{stat.label}</span></div>)}</aside>
    <section className="open-about-ways" aria-label="Ways to stay">
      <div className="open-about-way"><figure><EditorialImage src={HOTELS[1].gallery[1]} alt={`A room at Innzoy ${HOTELS[1].name}`} fill sizes="(max-width: 760px) 100vw, 58vw" containerClassName="open-photo-fill" revealType="curtain-h" /><figcaption>{HOTELS[1].name} / Hotel</figcaption></figure><div><p className="open-eyebrow">01 / {HOTELS.length} properties</p><h2>A room in the city.</h2><p>Daily-rate rooms with 24/7 front desk, housekeeping and power backup. Built for short business trips, hospital visits and family travel.</p><Link href="/stays?category=hotel" className="open-action">View hotels <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
      <div className="open-about-way"><figure><EditorialImage src={GUEST_HOUSES[1].heroImage} alt={`Living space at Innzoy ${GUEST_HOUSES[1].name}`} fill sizes="(max-width: 760px) 100vw, 58vw" containerClassName="open-photo-fill" revealType="curtain-h" /><figcaption>{GUEST_HOUSES[1].name} / Guest house</figcaption></figure><div><p className="open-eyebrow">02 / {GUEST_HOUSES.length} properties</p><h2>A home for a while.</h2><p>Self-contained homes with kitchens, laundry and living space, bookable on Airbnb. Suited to families, relocations and stays of a week or more.</p><Link href="/stays?category=guesthouse" className="open-action">View guest houses <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div>
    </section>
    <section className="open-about-close" aria-label="A closer look at Innzoy"><figure><EditorialImage src={HOTELS[2].heroImage} alt={`Innzoy ${HOTELS[2].name}`} fill sizes="(max-width: 760px) 60vw, 36vw" containerClassName="open-photo-fill" revealType="curtain-h" /><figcaption>{HOTELS[2].name} / Hotel</figcaption></figure><figure><EditorialImage src={GUEST_HOUSES[1].gallery[2]} alt={`Kitchen at Innzoy ${GUEST_HOUSES[1].name}`} fill sizes="(max-width: 760px) 40vw, 25vw" containerClassName="open-photo-fill" revealType="curtain-v" /><figcaption>{GUEST_HOUSES[1].name} / Guest house</figcaption></figure><div><p className="open-eyebrow">Find us</p><h2>Head office</h2><address>{BRAND.contact.headOffice}</address><a href={`tel:${BRAND.contact.phone.replace(/\s/g, '')}`} className="open-action">{BRAND.contact.phone}</a><a href={`mailto:${BRAND.contact.email}`} className="open-action">{BRAND.contact.email}</a></div></section>
  </article>;
}
