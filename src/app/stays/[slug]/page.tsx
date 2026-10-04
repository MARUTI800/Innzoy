import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import HotelJourneyLink from '@/components/common/HotelJourneyLink';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PROPERTIES } from '@/data/innzoyData';
import { BookingTrigger } from '@/components/booking/BookingProvider';
import PropertyHeroGallery from '@/components/common/PropertyHeroGallery';
import InteractiveGalleryGrid from '@/components/common/InteractiveGalleryGrid';
import StayRate from '@/components/common/StayRate';

interface PropertyPageProps { params: Promise<{ slug: string }>; }
export async function generateStaticParams() { return PROPERTIES.map((property) => ({ slug: property.slug })); }
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = PROPERTIES.find((property) => property.slug === slug);
  if (!property) return { title: 'Property not found — Innzoy' };
  const title = property.label + ' ' + property.name + ', Hyderabad — Innzoy';
  return { title, description: property.description, openGraph: { title, description: property.description, images: [{ url: property.heroImage }] } };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = PROPERTIES.find((property) => property.slug === slug);
  if (!property) notFound();
  const related = PROPERTIES.filter((item) => item.category === property.category && item.slug !== property.slug).slice(0, 3);
  const essentials = property.amenities.filter((amenity) => ['24/7 Front Desk', 'Free Wi-Fi', 'Power Backup', 'Fully Equipped Kitchen', 'Washing Machine', 'Workspace'].includes(amenity)).slice(0, 3);
  const bookingAction = (className = 'open-action') => property.comingSoon ? <span className="open-status">Coming soon</span> : property.bookingUrl
    ? <a href={property.bookingUrl} target="_blank" rel="noopener noreferrer" className={className}>Book on Airbnb <ArrowUpRight size={17} aria-hidden="true" /></a>
    : <BookingTrigger propertyId={property.id} className={className}>Book your stay <ArrowUpRight size={17} aria-hidden="true" /></BookingTrigger>;

  return <article className="open-detail open-page">
    <div className="open-detail-wayfinding"><HotelJourneyLink href={`/stays?category=${property.category}`}><ArrowLeft size={14} aria-hidden="true" />{property.category === 'hotel' ? 'All hotels' : 'All guest houses'}</HotelJourneyLink><span className="open-eyebrow">{property.label} / Hyderabad</span></div>
    <header className="open-detail-spread">
      <PropertyHeroGallery property={property} />
      <div className="open-detail-context">
        {!property.comingSoon && <p className="open-detail-essentials">{essentials.join(' · ')}</p>}
        <div className="open-detail-reserve"><StayRate property={property} />{property.weekdayPrice && <p className="open-rate-note">Published starting rates. Final rates confirmed by the property.</p>}{bookingAction()}{!property.comingSoon && <p className="open-availability">{property.bookingUrl ? 'Rates & availability on Airbnb' : 'Select dates to check availability'}</p>}</div>
        {property.phoneDisplay && <a className="open-detail-phone" href={`tel:${property.phoneDisplay.replace(/\s/g, '')}`}>Front desk <span>{property.phoneDisplay}</span></a>}
      </div>
    </header>

    <section className="open-detail-information" aria-label="Property information and booking">
      <div className="open-detail-description"><p className="open-eyebrow">The stay</p><h2>Settle in.</h2><p>{property.description}</p>{!property.comingSoon && <p className="open-capacity-note">Guest capacity is confirmed by the property.</p>}</div>
      <div className="open-detail-amenities"><h2>Amenities</h2><ul>{property.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul></div>
      <div className="open-detail-location"><p className="open-eyebrow">Find us</p><address>{property.address}</address><a href={property.mapUrl} target="_blank" rel="noopener noreferrer" className="open-action">Open map <ArrowUpRight size={16} aria-hidden="true" /></a></div>
    </section>

    {property.gallery.length > 1 && <section className="open-detail-gallery" aria-labelledby="property-gallery-title"><div className="open-section-heading"><div><p className="open-eyebrow">A closer look</p><h2 id="property-gallery-title">Inside {property.name}.</h2></div><p>{String(property.gallery.length).padStart(2, '0')} photographs<br />Select to view fullscreen</p></div><InteractiveGalleryGrid images={property.gallery} propertyName={`Innzoy ${property.name}`} region={property.locality} /></section>}

    {related.length > 0 && <section className="open-detail-related" aria-labelledby="related-properties-title"><div className="open-section-heading"><h2 id="related-properties-title">More places to stay.</h2><HotelJourneyLink href={`/stays?category=${property.category}`} className="open-action">All {property.category === 'hotel' ? 'hotels' : 'guest houses'} <ArrowUpRight size={17} aria-hidden="true" /></HotelJourneyLink></div><div className="open-related-index">{related.map((item, index) => <HotelJourneyLink href={`/stays/${item.slug}`} className="open-related-stay" key={item.id}><span className="open-related-image"><Image src={item.heroImage} alt={`Innzoy ${item.name}`} fill sizes="(max-width: 760px) 26vw, 17vw" className={item.comingSoon ? 'open-announcement-photo' : ''} /></span><span className="open-related-name"><small>{String(index + 1).padStart(2, '0')} / {item.label}</small><span>{item.name}</span><small>{item.locality}</small></span><StayRate property={item} showWeekend={false} /><ArrowUpRight size={18} aria-hidden="true" /></HotelJourneyLink>)}</div></section>}
  </article>;
}
