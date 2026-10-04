'use client';

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { GUEST_HOUSES, HOTELS, PROPERTIES } from '@/data/innzoyData';
import type { Property, PropertyCategory } from '@/types';
import { enhanceMotion, type GsapRuntime } from '@/lib/motion';
import StayRate from '@/components/common/StayRate';
import '@/styles/open-house-browsing.css';

const collectionFor = (category: PropertyCategory) => category === 'hotel' ? HOTELS : GUEST_HOUSES;
const wrap = (index: number, length: number) => ((index % length) + length) % length;
type Choice = { category: PropertyCategory; index: number };
type Gesture = { pointerId: number; x: number; y: number; start: number; chosen: number; lastX: number; lastAt: number; velocity: number; dragging: boolean };

export default function PropertiesSection() {
  const [choice, setChoice] = useState<Choice>({ category: 'hotel', index: 0 });
  const [windowCenter, setWindowCenter] = useState(0);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());
  const scene = useRef<HTMLElement>(null);
  const photographs = useRef<HTMLDivElement>(null);
  const target = useRef<Choice>(choice);
  const position = useRef({ value: 0 });
  const visibleCenter = useRef(0);
  const runtime = useRef<GsapRuntime | null>(null);
  const animation = useRef<ReturnType<GsapRuntime['to']> | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const draggedAt = useRef(0);
  const category = choice.category;
  const collection = collectionFor(category);
  const active = wrap(choice.index, collection.length);
  const property = collection[active];
  const frames = Array.from({ length: 5 }, (_, offset) => {
    const index = windowCenter + offset - 2;
    return { index, stay: collection[wrap(index, collection.length)] };
  });

  function syncWindow(index: number) {
    const center = Math.round(index);
    if (center === visibleCenter.current) return;
    visibleCenter.current = center;
    setWindowCenter(center);
  }

  function frameStep() {
    const track = photographs.current;
    const frame = track?.querySelector<HTMLElement>('[data-track-index]');
    if (!track || !frame) return 1;
    return frame.offsetWidth + (Number.parseFloat(window.getComputedStyle(track).columnGap) || 0);
  }

  function paintTrack() {
    const track = photographs.current;
    if (!track?.isConnected) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = frameStep();
    const angle = Math.PI / 12;
    const radius = step / Math.sin(angle);
    track.querySelectorAll<HTMLElement>('[data-track-index]').forEach(frame => {
      if (reduced) { frame.style.removeProperty('transform'); frame.style.removeProperty('z-index'); return; }
      const distance = Number(frame.dataset.trackIndex) - position.current.value;
      const radians = distance * angle;
      const x = radius * Math.sin(radians);
      const y = radius * (1 - Math.cos(radians));
      frame.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${distance * 15}deg)`;
      frame.style.zIndex = String(10 - Math.min(9, Math.round(Math.abs(distance) * 2)));
    });
    syncWindow(position.current.value);
  }

  function releaseGesture() {
    const current = gesture.current;
    gesture.current = null;
    const track = photographs.current;
    if (!track) return;
    delete track.dataset.dragging;
    if (current && track.hasPointerCapture(current.pointerId)) track.releasePointerCapture(current.pointerId);
  }

  function selectIndex(index: number) {
    releaseGesture();
    animation.current?.kill();
    target.current = { ...target.current, index };
    setChoice(target.current);
    if (!runtime.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      position.current.value = index;
      syncWindow(index);
      paintTrack();
      return;
    }
    // One changing angle carries the photographs and captions together around the arc.
    // Retargeting starts from this exact position, including an interrupted drag or tween.
    animation.current = runtime.current.to(position.current, {
      value: index, duration: .9, ease: 'power3.out',
      onUpdate: paintTrack,
      onComplete: () => { position.current.value = index; syncWindow(index); paintTrack(); animation.current = null; },
    });
  }

  function chooseStay(stay: Property, travel = 1) {
    const nextCollection = collectionFor(stay.category);
    const next = nextCollection.findIndex(item => item.id === stay.id);
    if (stay.category !== target.current.category) {
      releaseGesture();
      animation.current?.kill();
      animation.current = null;
      target.current = { category: stay.category, index: next };
      position.current.value = next;
      syncWindow(next);
      setChoice(target.current);
      return;
    }
    const current = wrap(target.current.index, nextCollection.length);
    const distance = travel < 0 ? -wrap(current - next, nextCollection.length) : wrap(next - current, nextCollection.length);
    selectIndex(target.current.index + distance);
  }
  const move = (travel: number) => selectIndex(target.current.index + travel);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, start: position.current.value,
      chosen: target.current.index, lastX: event.clientX, lastAt: event.timeStamp, velocity: 0, dragging: false };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const x = event.clientX - current.x;
    const y = event.clientY - current.y;
    if (!current.dragging) {
      if (Math.abs(y) > 8 && Math.abs(y) > Math.abs(x)) { releaseGesture(); return; }
      if (Math.abs(x) < 8 || Math.abs(x) < Math.abs(y) * 1.6) return;
      current.dragging = true;
      current.start = position.current.value;
      current.chosen = target.current.index;
      animation.current?.kill();
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = 'true';
    }
    event.preventDefault();
    const elapsed = Math.max(8, event.timeStamp - current.lastAt);
    current.velocity = (event.clientX - current.lastX) / elapsed;
    current.lastX = event.clientX;
    current.lastAt = event.timeStamp;
    position.current.value = current.start - x / frameStep();
    draggedAt.current = Date.now();
    paintTrack();
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const x = event.clientX - current.x;
    releaseGesture();
    if (!current.dragging) return;
    event.preventDefault();
    draggedAt.current = Date.now();
    let next = current.chosen;
    if (Math.abs(x) >= 55) {
      const coast = event.timeStamp - current.lastAt > 80 ? 0 : Math.max(-.4, Math.min(.4, -current.velocity * 150 / frameStep()));
      next = Math.round(position.current.value + coast);
      const from = Math.round(current.start);
      if (next === from) next = from + (x < 0 ? 1 : -1);
    }
    selectIndex(next);
  }

  function cancelPointer() {
    const wasDragging = gesture.current?.dragging;
    releaseGesture();
    if (wasDragging) { draggedAt.current = Date.now(); selectIndex(target.current.index); }
  }

  useLayoutEffect(() => {
    const scope = scene.current;
    const track = photographs.current;
    if (!scope || !track) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const settle = () => {
      releaseGesture();
      animation.current?.kill();
      animation.current = null;
      runtime.current = null;
      position.current.value = target.current.index;
      syncWindow(target.current.index);
      paintTrack();
    };
    preference.addEventListener('change', settle);
    const stopEnhancement = enhanceMotion(scope, ({ gsap }) => {
      runtime.current = gsap;
      paintTrack();
      // The parent enters quietly; only the circular track owns frame transforms.
      gsap.fromTo(track, { y: 16 }, { y: 0, duration: 1, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: track, start: 'top 85%', once: true } });
    });
    const resize = new ResizeObserver(paintTrack);
    resize.observe(track);
    window.addEventListener('blur', cancelPointer);
    return () => {
      releaseGesture();
      animation.current?.kill();
      runtime.current = null;
      preference.removeEventListener('change', settle);
      window.removeEventListener('blur', cancelPointer);
      resize.disconnect();
      stopEnhancement();
    };
  }, []);

  useLayoutEffect(() => {
    paintTrack();
  }, [category, windowCenter]);

  return <section id="properties" className="open-house-browser" ref={scene} aria-labelledby="open-house-browser-title">
    <div className="open-house-browser-inner">
      <header className="open-house-browser-heading">
        <div><span className="open-house-eyebrow">Innzoy · Hyderabad</span><h2 id="open-house-browser-title">Hotels &amp; Guest Houses</h2></div>
        <Link className="open-house-collection-link" href={`/stays?category=${category}`}>{category === 'hotel' ? 'All hotels' : 'All guest houses'} <ArrowUpRight size={16} strokeWidth={1.3} aria-hidden="true" /></Link>
      </header>
        <div className="open-house-categories" role="group" aria-label="Choose a stay collection">
          <button type="button" aria-pressed={category === 'hotel'} aria-controls="open-house-address" onClick={() => chooseStay(HOTELS[0])}>Hotels <span>04</span></button>
          <button type="button" aria-pressed={category === 'guesthouse'} aria-controls="open-house-address" onClick={() => chooseStay(GUEST_HOUSES[0])}>Guest houses <span>05</span></button>
        </div>

      <div id="open-house-address" className="open-house-address">
        <div className="open-house-photographs" ref={photographs} onClickCapture={event => {
          if (Date.now() - draggedAt.current < 500) { event.preventDefault(); event.stopPropagation(); }
        }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
          onPointerCancel={cancelPointer} onLostPointerCapture={cancelPointer} onDragStart={event => event.preventDefault()}>
          {frames.map(({ index, stay }) => {
            const centered = index === choice.index;
            const slot = index - windowCenter;
            const visible = Math.abs(slot) <= 1;
            const photoLoaded = loaded.has(stay.heroImage);
            const photoFailed = failed.has(stay.heroImage);
            return <figure key={`${category}:${index}`} className={`open-house-frame${centered ? ' open-house-central-door' : ''}`}
              data-track-index={index} data-slot={slot} data-property-id={stay.id} aria-hidden={!visible}>
              <Link href={`/stays/${stay.slug}`} className={`open-house-photo${stay.comingSoon ? ' is-announcement' : ''}`}
                aria-label={`View ${stay.name} stay`} tabIndex={centered && visible ? 0 : -1} aria-hidden={!centered}
                data-booking-origin={centered && photoLoaded ? stay.id : undefined} aria-busy={!photoLoaded && !photoFailed}>
                <Image src={stay.heroImage} alt={`${stay.name}, ${stay.label}`} fill data-photo-property={stay.id}
                  sizes="(max-width: 767px) 76vw, (max-width: 1476px) 27vw, 390px" loading="eager" draggable={false}
                  onLoad={event => {
                    if (!event.currentTarget.isConnected || event.currentTarget.dataset.photoProperty !== stay.id) return;
                    setLoaded(current => current.has(stay.heroImage) ? current : new Set(current).add(stay.heroImage));
                  }} onError={event => {
                    if (!event.currentTarget.isConnected || event.currentTarget.dataset.photoProperty !== stay.id) return;
                    setFailed(current => current.has(stay.heroImage) ? current : new Set(current).add(stay.heroImage));
                  }} />
                {photoFailed && <span className="open-house-photo-message is-error" role="status">Explore this stay’s photographs →</span>}
              </Link>
              <figcaption className="open-house-frame-caption"><h3><Link href={`/stays/${stay.slug}`} tabIndex={centered && visible ? 0 : -1} aria-hidden={!centered}><span className="open-house-name">{stay.name}</span></Link></h3></figcaption>
              {!centered && <button type="button" className="open-house-frame-select" tabIndex={visible ? 0 : -1}
                aria-label={`${index < choice.index ? 'Previous' : 'Next'} address: ${stay.name}`} aria-controls="open-house-address" onClick={() => selectIndex(index)} />}
            </figure>;
          })}
        </div>

        <div className="open-house-address-caption">
          <div className="open-house-identity">
            <div className="open-house-facts"><span className="open-house-address-number">{String(active + 1).padStart(2, '0')} / {String(collection.length).padStart(2, '0')}</span><span>{property.locality}</span></div>
            <span className={`open-house-availability${property.comingSoon ? ' is-unavailable' : ''}`}><span aria-hidden="true">—</span>{property.comingSoon ? 'Opening soon' : property.category === 'hotel' ? 'Choose dates for availability' : 'Availability on Airbnb'}</span>
          </div>
          <div className="open-house-commerce">
            <StayRate property={property} className="open-house-rate" showWeekend={false} />
            <div className="open-house-stay-actions">
              {property.category === 'hotel' ? <Link href={`/stays/${property.slug}`} className="open-house-action">View hotel <ArrowRight size={17} strokeWidth={1.3} aria-hidden="true" /></Link>
                : property.bookingUrl && !property.comingSoon ? <a className="open-house-action" href={property.bookingUrl} target="_blank" rel="noopener noreferrer">Book on Airbnb <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" /></a> : null}
              {property.category === 'guesthouse' && <Link className="open-house-view-stay" href={`/stays/${property.slug}`}>View stay <ArrowUpRight size={15} strokeWidth={1.3} aria-hidden="true" /></Link>}
            </div>
          </div>
          <div className="open-house-navigation" role="group" aria-label="Browse addresses" onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
          }}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous address" aria-controls="open-house-address"><ArrowLeft size={18} strokeWidth={1.3} aria-hidden="true" /><span>Previous</span></button>
            <button type="button" onClick={() => move(1)} aria-label="Next address" aria-controls="open-house-address"><span>Next</span><ArrowRight size={18} strokeWidth={1.3} aria-hidden="true" /></button>
          </div>
        </div>

        <div className="open-house-information">
          <details className="open-house-dossier"><summary>Stay details <span aria-hidden="true">+</span></summary><div>
            <p>{property.description}</p>
            <span className="open-house-detail-label">At this address</span><ul aria-label={`${property.name} amenities`}>{property.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}</ul>
            {property.weekendPrice && <StayRate property={property} />}
            <p className="open-house-detail-note">{property.category === 'hotel' ? 'Published rates are a guide. Guest capacity and your stay’s price are confirmed by the property.' : property.comingSoon ? 'This address is not yet open for bookings.' : 'Guest capacity, current rates and available dates are listed on Airbnb.'}</p>
            <span className="open-house-detail-label">Find us</span><p>{property.address}</p>
            <div className="open-house-detail-actions"><a href={property.mapUrl} target="_blank" rel="noopener noreferrer">Open in Maps <ArrowUpRight size={15} aria-hidden="true" /></a><Link href={`/stays/${property.slug}`}>View the stay <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
          </div></details>
          <details className="open-house-directory"><summary>All nine addresses <span aria-hidden="true">+</span></summary><div className="open-house-directory-columns">
            {[{ title: 'Hotels', stays: HOTELS }, { title: 'Guest houses', stays: GUEST_HOUSES }].map(group => <div key={group.title}><h4>{group.title}</h4><ul>{group.stays.map(stay => <li key={stay.id}><button type="button" aria-pressed={property.id === stay.id} aria-controls="open-house-address" onClick={() => chooseStay(stay, PROPERTIES.findIndex(item => item.id === stay.id) >= PROPERTIES.findIndex(item => item.id === property.id) ? 1 : -1)}><span>{stay.name}</span><small>{stay.comingSoon ? 'Opening soon' : stay.startingPrice ? `From ₹${stay.startingPrice.toLocaleString('en-IN')} / night` : 'Rates on Airbnb'}</small><ArrowUpRight size={15} aria-hidden="true" /></button></li>)}</ul></div>)}
          </div></details>
        </div>
      </div>
    </div>
  </section>;
}
