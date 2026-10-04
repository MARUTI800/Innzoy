'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { BRAND, HOTELS } from '@/data/innzoyData';
import { BookingTrigger } from '@/components/booking/BookingProvider';
import BookingCalendar from '@/components/booking/BookingCalendar';
import { hotelBrowseHref } from '@/components/booking/booking-selection';
import { dateAfter, formatStayDate, nightsBetween, todayInHyderabad } from '@/components/booking/booking-client';
import { BOOKING_HORIZON_DAYS, MAX_BOOKING_GUESTS } from '@/lib/booking';
import StayRate from '@/components/common/StayRate';
import { enhanceMotion } from '@/lib/motion';
import '@/styles/open-house.css';
import '@/styles/hero-calendar.css';

const property = HOTELS.find(stay => stay.id === 'dlf-road') ?? HOTELS[0];

export default function HeroSection() {
  const [painted, setPainted] = useState<string | null>(null);
  const source = property.heroImage;
  const scene = useRef<HTMLElement>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [floating, setFloating] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selecting, setSelecting] = useState<'check_in' | 'check_out'>('check_in');
  const [month, setMonth] = useState(() => todayInHyderabad().slice(0, 7));
  const [calendarPosition, setCalendarPosition] = useState({ left: 16, top: 16, width: 332, maxHeight: 440 });
  const calendarId = useId();
  const identityArcId = useId();
  const dock = useRef<HTMLFieldSetElement>(null);
  const calendar = useRef<HTMLDivElement>(null);
  const arrivalButton = useRef<HTMLButtonElement>(null);
  const departureButton = useRef<HTMLButtonElement>(null);
  const calendarOpener = useRef<HTMLButtonElement | null>(null);
  const today = todayInHyderabad();
  const nights = nightsBetween(checkIn, checkOut);
  const lastDate = dateAfter(today, BOOKING_HORIZON_DAYS);
  const browseHref = hotelBrowseHref({ checkIn, checkOut, guests });
  const preferences = new URLSearchParams(browseHref.split('?')[1]);
  preferences.delete('category');
  const propertyHref = `/stays/${property.slug}?${preferences.toString()}`;

  function openCalendar(next: 'check_in' | 'check_out', opener: HTMLButtonElement) {
    calendarOpener.current = opener;
    setSelecting(next);
    setMonth((next === 'check_out' ? checkOut || checkIn : checkIn || today).slice(0, 7));
    setCalendarOpen(true);
  }

  function closeCalendar(restoreFocus = true) {
    setCalendarOpen(false);
    if (restoreFocus) calendarOpener.current?.focus({ preventScroll: true });
  }

  function selectDate(next: string) {
    if (selecting === 'check_in') {
      setCheckIn(next);
      setCheckOut('');
      setSelecting('check_out');
      return;
    }
    setCheckOut(next);
    closeCalendar(false);
    departureButton.current?.focus({ preventScroll: true });
  }

  useLayoutEffect(() => {
    if (!calendarOpen || !calendar.current) return;
    const updatePosition = () => {
      if (!dock.current || !calendar.current) return;
      const bounds = dock.current.getBoundingClientRect();
      const anchor = calendarOpener.current?.getBoundingClientRect() ?? bounds;
      const viewport = window.visualViewport;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const offsetTop = viewport?.offsetTop ?? 0;
      const mobile = viewportWidth <= 760;
      const width = Math.min(mobile ? 340 : 332, viewportWidth - 24);
      const left = mobile ? (viewportWidth - width) / 2 : Math.min(Math.max(anchor.left, 12), viewportWidth - width - 12);
      const height = calendar.current.scrollHeight;
      const preferredTop = bounds.top - height - 10;
      // The popover stays above the dock where space allows, and scrolls internally on short screens.
      const top = Math.max(offsetTop + 12, preferredTop);
      const maxHeight = Math.max(240, Math.min(bounds.top - offsetTop - 22, viewportHeight - 24));
      setCalendarPosition({ left, top, width, maxHeight });
    };
    updatePosition();
    calendar.current.focus({ preventScroll: true });
    const observer = new ResizeObserver(updatePosition);
    observer.observe(calendar.current);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
    };
  }, [calendarOpen]);

  useEffect(() => {
    if (!calendarOpen) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || calendar.current?.contains(target) || arrivalButton.current?.contains(target) || departureButton.current?.contains(target)) return;
      closeCalendar(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      closeCalendar();
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [calendarOpen]);

  useEffect(() => {
    if (!calendarOpen || !calendar.current) return;
    return enhanceMotion(calendar.current, ({ gsap }) => {
      gsap.fromTo(calendar.current, { y: 10, opacity: .65 }, { y: 0, opacity: 1, duration: .85, ease: 'sine.inOut', clearProps: 'transform,opacity' });
    });
  }, [calendarOpen]);

  useEffect(() => {
    const followPage = () => setFloating(window.scrollY > 80);
    followPage();
    window.addEventListener('scroll', followPage, { passive: true });
    return () => window.removeEventListener('scroll', followPage);
  }, []);

  useLayoutEffect(() => {
    if (!scene.current || painted !== source) return;
    return enhanceMotion(scene.current, ({ gsap }) => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.lp-photo-window img', { scale: 1.035 }, { scale: 1, duration: 1.2, clearProps: 'transform' }, 0)
        .fromTo('.lp-identity-word > span', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, clearProps: 'transform,opacity' }, .12);
      if (window.matchMedia('(min-width: 900px) and (pointer: fine)').matches) {
        gsap.fromTo('.lp-room-photograph', { scale: 1.025, yPercent: 0 }, {
          scale: 1.075, yPercent: -2, ease: 'none',
          scrollTrigger: { trigger: scene.current, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
    });
  }, [source, painted]);

  return <section className="lp-arrival" ref={scene} aria-label="Innzoy, DLF Road in Hyderabad">
    <figure className="lp-room-photograph">
      <Link href={propertyHref} aria-label={`Explore ${property.name}`} className="lp-photo-window" data-booking-origin={painted === source ? property.id : undefined} aria-busy={painted !== source}>
        <Image src={source} fill sizes="100vw" alt={`${property.label}, ${property.name}`} preload onLoad={event => { if (event.currentTarget.isConnected) setPainted(source); }} />
      </Link>
    </figure>
    <header className="lp-identity">
      <p>Hyderabad <span>India</span></p>
      <h1 className="lp-identity-word"><span><Image className="lp-identity-logo" src="/images/innzoy-logo.png" width={222} height={186} alt={BRAND.name} unoptimized preload /></span></h1>
      <svg className="lp-identity-subname" viewBox="0 0 220 30" role="img" aria-label={BRAND.subname} focusable="false">
        <defs><path id={identityArcId} d="M 8 3 Q 110 47 212 3" /></defs>
        <text fill="currentColor" textAnchor="middle"><textPath href={`#${identityArcId}`} startOffset="50%">{BRAND.subname}</textPath></text>
      </svg>
      <span className="lp-identity-tagline">{BRAND.tagline}</span>
    </header>
    <div className="lp-reservation" data-floating={floating}>
      <div className="lp-stay-context"><Link href={propertyHref}>DLF Road · Gachibowli <ArrowUpRight size={13} strokeWidth={1.3} aria-hidden="true" /></Link><Link href={browseHref}>Browse hotels <ArrowRight size={14} strokeWidth={1.3} aria-hidden="true" /></Link></div>
      <fieldset className="lp-booking-dock" ref={dock}>
        <legend className="sr-only">Plan your stay</legend>
        <button type="button" className={`lp-date-field lp-date-button${calendarOpen && selecting === 'check_in' ? ' is-open' : ''}`} ref={arrivalButton} aria-label={`Arrival${checkIn ? `, ${formatStayDate(checkIn)}` : ', choose a date'}`} aria-haspopup="dialog" aria-expanded={calendarOpen && selecting === 'check_in'} aria-controls={calendarOpen ? calendarId : undefined} onClick={event => openCalendar('check_in', event.currentTarget)}>
          <span className="lp-field-label">Arrival</span>
          <span className="lp-date-value">{checkIn ? formatStayDate(checkIn, true) : 'Choose a date'}</span>
        </button>
        <button type="button" className={`lp-date-field lp-date-button${!checkIn ? ' is-awaiting' : ''}${calendarOpen && selecting === 'check_out' ? ' is-open' : ''}`} ref={departureButton} aria-label={`Departure${checkOut ? `, ${formatStayDate(checkOut)}` : ', choose a date'}`} disabled={!checkIn} aria-haspopup="dialog" aria-expanded={calendarOpen && selecting === 'check_out'} aria-controls={calendarOpen ? calendarId : undefined} onClick={event => openCalendar('check_out', event.currentTarget)}>
          <span className="lp-field-label">Departure</span>
          <span className="lp-date-value">{checkOut ? formatStayDate(checkOut, true) : 'Choose a date'}</span>
        </button>
        <div className="lp-guest-field">
          <span className="lp-field-label" id="hero-guest-label">Guests</span>
          <div className="lp-guests"><output aria-labelledby="hero-guest-label">{String(guests).padStart(2, '0')}</output><div><button type="button" aria-label="Remove a guest" disabled={guests <= 1} onClick={() => setGuests(value => value - 1)}>−</button><button type="button" aria-label="Add a guest" disabled={guests >= MAX_BOOKING_GUESTS} onClick={() => setGuests(value => value + 1)}>+</button></div></div>
        </div>
        <BookingTrigger selection={{checkIn, checkOut, guests}} className="lp-book-action">Book your stay <ArrowRight size={19} strokeWidth={1.3} aria-hidden="true" /></BookingTrigger>
      </fieldset>
      <div className="lp-guide"><StayRate property={property} showWeekend={false} /><span>{nights > 0 && nights <= 30 ? `${nights} ${nights === 1 ? 'night' : 'nights'} selected · published guide rate` : 'Published starting rate · final rate confirmed by the property'}</span></div>
    </div>
    {calendarOpen && createPortal(<div className="lp-calendar-popover" id={calendarId} ref={calendar} role="dialog" aria-modal="false" aria-label="Choose your stay dates" tabIndex={-1} style={{ left: calendarPosition.left, top: calendarPosition.top, width: calendarPosition.width, maxHeight: calendarPosition.maxHeight }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeCalendar(); } }} onBlurCapture={event => { const next = event.relatedTarget as Node | null; if (next && !event.currentTarget.contains(next) && next !== arrivalButton.current && next !== departureButton.current) closeCalendar(false); }}>
      <div className="lp-calendar-topline"><span>Your dates <span aria-hidden="true">/</span> Your stay</span><button type="button" aria-label="Close date calendar" onClick={() => closeCalendar()}><X size={17} strokeWidth={1.3} aria-hidden="true" /></button></div>
      <BookingCalendar preferenceOnly motionPace="gentle" month={month} onMonthChange={setMonth} checkIn={checkIn} checkOut={checkOut} onSelect={selectDate} dates={[]} loading={false} unavailable={false} minDate={today} maxDate={lastDate} selecting={selecting} />
      <div className="lp-calendar-bottomline"><span>{selecting === 'check_in' ? '01 / Arrival' : '02 / Departure'}</span><button type="button" onClick={() => { setCheckIn(''); setCheckOut(''); setSelecting('check_in'); }}>Clear dates</button></div>
    </div>, document.body)}
  </section>;
}
