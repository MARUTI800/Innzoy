'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '@/types';
import EditorialImage from './EditorialImage';
import { useGallery } from './GalleryLightbox';
import '@/styles/property-photo-browser.css';

/** Each hotel page shows only that property's real photographs. */
export default function PropertyHeroGallery({ property }: { property: Property }) {
  const photos = [...new Set([property.heroImage, ...property.gallery])];
  const [index, setIndex] = useState(0);
  const { openGallery } = useGallery();
  const move = (direction: number) => setIndex(current => (current + direction + photos.length) % photos.length);
  return <figure className={`open-detail-photograph ${property.comingSoon ? 'is-announcement' : ''}`}>
    <EditorialImage key={photos[index]} bookingOrigin={property.id} src={photos[index]} alt={`Innzoy ${property.name}, photograph ${index + 1}`} fill preload={index === 0} sizes="100vw" containerClassName="open-photo-fill" imageClassName={property.comingSoon ? 'open-announcement-photo' : ''} revealType="curtain-h" delay={0} />
    <div className="open-detail-identity"><p className="open-eyebrow">{property.category === 'hotel' ? 'Your room in Hyderabad' : 'Your home in Hyderabad'}</p><h1>{property.name}</h1><p className="open-detail-locality">{property.locality}</p></div>
    <figcaption>
      <div className="hotel-photo-navigation" role="group" aria-label={`${property.name} photographs`} onKeyDown={event => { if (photos.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); } }}>
        <span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
        {photos.length > 1 && <><button type="button" aria-label={`Previous ${property.name} photograph`} onClick={() => move(-1)}><ChevronLeft size={19} strokeWidth={1.3} /></button><button type="button" aria-label={`Next ${property.name} photograph`} onClick={() => move(1)}><ChevronRight size={19} strokeWidth={1.3} /></button></>}
      </div>
      {!property.comingSoon && <button type="button" className="hotel-photo-open" aria-haspopup="dialog" onClick={() => openGallery(photos.map((src, photo) => ({ src, alt: `Innzoy ${property.name}, photograph ${photo + 1}`, caption: property.name, location: property.locality })), index)}>View all photos <ArrowUpRight size={16} strokeWidth={1.3} aria-hidden="true" /></button>}
    </figcaption>
  </figure>;
}
