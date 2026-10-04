import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Property } from '@/types';
import StayRate from '@/components/common/StayRate';

interface PropertyCardProps { property: Property; index?: number; className?: string; journeyQuery?: string; }

export default function PropertyCard({ property, index, className = '', journeyQuery = '' }: PropertyCardProps) {
  const query = property.category === 'hotel' ? new URLSearchParams(journeyQuery).toString() : '';
  const href = `/stays/${property.slug}${query ? `?${query}` : ''}`;
  const action = property.category === 'hotel' ? 'View hotel' : 'View stay';
  const essentials = property.amenities.filter((amenity) => ['24/7 Front Desk', 'Free Wi-Fi', 'Power Backup', 'Fully Equipped Kitchen', 'Washing Machine', 'Workspace'].includes(amenity)).slice(0, 3);

  return <article className={`open-address discovery-address ${property.comingSoon ? 'is-announcement' : ''} ${className}`}>
    <Link href={href} className="open-address-photo" aria-label={`${action}: Innzoy ${property.name}`}>
      <Image src={property.heroImage} alt={`${property.name}, ${property.locality}`} fill sizes="(max-width: 760px) calc(100vw - 40px), 46vw" className={property.comingSoon ? 'open-announcement-photo' : ''} />
      <span className="open-address-photo-label">{property.comingSoon ? 'Opening soon' : `${property.gallery.length} photographs`} <ArrowUpRight size={18} strokeWidth={1.3} aria-hidden="true" /></span>
    </Link>
    <div className="discovery-address-caption">
      <header><p className="open-eyebrow">{index !== undefined && <span>{String(index + 1).padStart(2, '0')} / </span>}{property.locality}</p><h2><Link href={href}>{property.name}</Link></h2></header>
      <StayRate property={property} className="discovery-address-rate" showWeekend={false} />
      <Link href={href} className="discovery-address-action">{action}<ArrowUpRight size={16} strokeWidth={1.3} aria-hidden="true" /></Link>
      {property.bookingUrl && !property.comingSoon && <a className="discovery-address-airbnb" href={property.bookingUrl} target="_blank" rel="noopener noreferrer">Rates &amp; availability on Airbnb <ArrowUpRight size={13} aria-hidden="true" /></a>}
      <details className="discovery-address-details">
        <summary>About this address <span aria-hidden="true">+</span></summary>
        <div><p>{property.description}</p>{!property.comingSoon && <p className="discovery-address-essentials">{essentials.join(' · ')}</p>}{property.weekendPrice && <StayRate property={property} />}<address>{property.address}</address><a href={property.mapUrl} target="_blank" rel="noopener noreferrer">Open map <ArrowUpRight size={14} aria-hidden="true" /></a></div>
      </details>
    </div>
  </article>;
}
