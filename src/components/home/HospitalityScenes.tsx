'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND, HOTELS, GUEST_HOUSES } from '@/data/innzoyData';
import { useGallery } from '@/components/common/GalleryLightbox';
import { enhanceMotion } from '@/lib/motion';
import '@/styles/hospitality-scenes.css';

export function HospitalityIntroduction() {
  const scene = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!scene.current) return;
    return enhanceMotion(scene.current, ({ gsap }) => {
      gsap.fromTo('.hospitality-introduction-image', { scale: 1.05 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: scene.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.fromTo('.hospitality-introduction-copy', { y: 24 }, { y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: scene.current, start: 'top 60%', once: true }, clearProps: 'transform' });
      gsap.fromTo('.hospitality-introduction-copy h2 > span', { yPercent: 105 }, { yPercent: 0, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: scene.current, start: 'top 65%', once: true }, clearProps: 'transform' });
    });
  }, []);
  return <section ref={scene} className="hospitality-introduction" aria-labelledby="hospitality-introduction-title">
    <Image className="hospitality-introduction-image" src={BRAND.heroImage} alt="Innzoy Hotels in Hyderabad" fill sizes="100vw" />
    <div className="hospitality-introduction-copy"><p>Hotels & guest houses in Hyderabad</p><h2 id="hospitality-introduction-title"><span>{BRAND.headline}</span></h2><p className="hospitality-introduction-description">Clean rooms, working amenities, and staff who answer the phone. Hotels and guest houses across west Hyderabad.</p></div>
  </section>;
}

export function HospitalityStory() {
  const [collection, setCollection] = useState<'hotel' | 'guesthouse'>('hotel');
  const scene = useRef<HTMLElement>(null);
  const stay = collection === 'hotel' ? HOTELS[1] : GUEST_HOUSES[1];
  useLayoutEffect(() => {
    if (!scene.current) return;
    return enhanceMotion(scene.current, ({ gsap }) => {
      gsap.fromTo('.hospitality-story-photo img', { scale: 1.035 }, { scale: 1, duration: .75, ease: 'power3.out', clearProps: 'transform' });
    });
  }, [collection]);
  return <section ref={scene} className="hospitality-story" aria-labelledby="hospitality-story-title">
    <figure className="hospitality-story-photo"><Image key={collection} src={collection === 'hotel' ? stay.gallery[1] : stay.heroImage} alt={`${collection === 'hotel' ? 'A room' : 'Living space'} at Innzoy ${stay.name}`} fill sizes="(max-width:760px) 100vw, 50vw" /><figcaption>{stay.name} / {stay.locality}</figcaption></figure>
    <div className="hospitality-story-copy"><p className="hospitality-eyebrow">Stay. Explore. Repeat.</p><h2 id="hospitality-story-title">{collection === 'hotel' ? 'A room in the city.' : 'A home for a while.'}</h2><p>{collection === 'hotel' ? 'Daily-rate rooms with 24/7 front desk, housekeeping and power backup. Built for short business trips, hospital visits and family travel.' : 'Self-contained homes with kitchens, laundry and living space, bookable on Airbnb. Suited to families, relocations and stays of a week or more.'}</p><div className="hospitality-story-choices" role="group" aria-label="Explore ways to stay"><button type="button" aria-pressed={collection === 'hotel'} onClick={() => setCollection('hotel')}>Hotels <span>{HOTELS.length} addresses</span></button><button type="button" aria-pressed={collection === 'guesthouse'} onClick={() => setCollection('guesthouse')}>Guest houses <span>{GUEST_HOUSES.length} addresses</span></button></div><Link className="hospitality-text-action" href={`/stays?category=${collection}`}>Explore {collection === 'hotel' ? 'hotels' : 'guest houses'} <ArrowRight size={17} aria-hidden="true" /></Link></div>
  </section>;
}

export function HospitalityGallery() {
  const { openGallery } = useGallery();
  const stays = [HOTELS[0], HOTELS[1], GUEST_HOUSES[1]];
  const images = stays.map(stay => ({ src: stay.gallery[1] || stay.heroImage, alt: `Inside Innzoy ${stay.name}`, caption: `Innzoy ${stay.name}`, location: stay.locality }));
  return <section className="hospitality-gallery" aria-labelledby="hospitality-gallery-title"><header><p className="hospitality-eyebrow">A closer look</p><h2 id="hospitality-gallery-title">{BRAND.tagline}</h2><a className="hospitality-text-action" href={BRAND.contact.instagram} target="_blank" rel="noopener noreferrer">More on Instagram <ArrowRight size={16} aria-hidden="true" /></a></header><div className="hospitality-gallery-images">{images.map((photo, index) => <button key={photo.src} type="button" aria-label={`View ${photo.caption} photograph fullscreen`} aria-haspopup="dialog" onClick={event => { event.currentTarget.focus({ preventScroll: true }); openGallery(images, index); }}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width:760px) 78vw, 33vw" /><span>{stays[index].name}</span></button>)}</div></section>;
}
