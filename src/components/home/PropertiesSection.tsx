'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { GUEST_HOUSES, HOTELS } from '@/data/innzoyData';
import type { PropertyCategory } from '@/types';
import { enhanceMotion } from '@/lib/motion';
import StayRate from '@/components/common/StayRate';
import '@/styles/open-house-browsing.css';

export default function PropertiesSection() {
  const [category, setCategory] = useState<PropertyCategory>('hotel');
  const scene = useRef<HTMLElement>(null);
  const collection = category === 'hotel' ? HOTELS : GUEST_HOUSES;

  useLayoutEffect(() => {
    if (!scene.current) return;
    return enhanceMotion(scene.current, ({ gsap }) => {
      scene.current?.querySelectorAll<HTMLElement>('.open-house-discovery-photo').forEach(photograph => {
        gsap.fromTo(photograph, { clipPath: 'inset(0% 0% 9% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: .85, ease: 'power2.out',
          immediateRender: false, clearProps: 'clipPath',
          scrollTrigger: { trigger: photograph, start: 'top 88%', once: true },
        });
      });
    });
  }, [category]);

  return <section id="properties" className="open-house-browser" ref={scene} aria-labelledby="open-house-browser-title">
    <div className="open-house-browser-inner">
      <header className="open-house-browser-heading">
        <div><span className="open-house-eyebrow">Innzoy · Hyderabad</span><h2 id="open-house-browser-title">Find your place.</h2></div>
        <Link className="open-house-collection-link" href={`/stays?category=${category}`}>{category === 'hotel' ? 'Explore all hotels' : 'Explore all guest houses'} <ArrowUpRight size={16} strokeWidth={1.3} aria-hidden="true" /></Link>
      </header>
      <div className="open-house-collection-register">
        <div className="open-house-categories" role="group" aria-label="Choose a stay collection">
          <button type="button" aria-pressed={category === 'hotel'} aria-controls="open-house-collection" onClick={() => setCategory('hotel')}>Hotels <span>04</span></button>
          <button type="button" aria-pressed={category === 'guesthouse'} aria-controls="open-house-collection" onClick={() => setCategory('guesthouse')}>Guest houses <span>05</span></button>
        </div>
        <p>{category === 'hotel' ? 'Explore your hotel. Make it your stay.' : 'A little more space. A little more time.'}</p>
      </div>

      <div id="open-house-collection" className="open-house-discovery" key={category}>
        {collection.map((property, index) => {
          const href = `/stays/${property.slug}`;
          const action = property.category === 'hotel' ? 'View hotel' : 'View stay';
          return <article className={`open-house-discovery-stay${property.comingSoon ? ' is-announcement' : ''}`} key={property.id}>
            <Link href={href} className="open-house-discovery-photo" aria-label={`${action}: Innzoy ${property.name}`}>
              <Image src={property.heroImage} alt={`${property.name}, ${property.locality}`} fill sizes="(max-width: 767px) calc(100vw - 40px), 46vw" />
              <span className="open-house-photo-invitation">{property.comingSoon ? 'Opening soon' : `${property.gallery.length} photographs`} <ArrowUpRight size={19} strokeWidth={1.25} aria-hidden="true" /></span>
            </Link>
            <div className="open-house-discovery-caption">
              <div className="open-house-discovery-identity">
                <p className="open-house-discovery-locality"><span>{String(index + 1).padStart(2, '0')}</span>{property.locality}</p>
                <h3><Link href={href}>{property.name}</Link></h3>
              </div>
              <StayRate property={property} className="open-house-discovery-rate" showWeekend={false} />
              <Link href={href} className="open-house-view-hotel">{action}<ArrowUpRight size={16} strokeWidth={1.3} aria-hidden="true" /></Link>
              {property.bookingUrl && !property.comingSoon && <a className="open-house-airbnb" href={property.bookingUrl} target="_blank" rel="noopener noreferrer">Rates &amp; availability on Airbnb <ArrowUpRight size={13} aria-hidden="true" /></a>}
            </div>
          </article>;
        })}
      </div>
      {category === 'hotel' && <p className="open-house-published-note">Published starting rates. Your final rate is confirmed by the hotel.</p>}
    </div>
  </section>;
}
