'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, LoaderCircle, X } from 'lucide-react';
import { BRAND, PROPERTIES, waLink } from '@/data/innzoyData';
import { MAX_BOOKING_GUESTS, type Booking, type BookingAvailability } from '@/lib/booking';
import BookingCalendar from './BookingCalendar';
import { bookingCalendar, dateAfter, formatStayDate, guestErrors, nightsBetween, todayInHyderabad } from './booking-client';
import { enhanceMotion } from '@/lib/motion';
import StayRate from '@/components/common/StayRate';
import { type BookingPhotoTransition } from './booking-photo-transition';
import { resolveBookingSelection, type BookingSelection } from './booking-selection';

const STEPS = ['Stay', 'Details', 'Review'];
const DRAFT_KEY = 'innzoy-reservation-draft-v1';
const RECEIPT_KEY = 'innzoy-reservation-receipt-v1';
const RETRY_KEY = 'innzoy-reservation-retry-v1';
const BOOKABLE = PROPERTIES.filter(p => p.category === 'hotel' && !p.comingSoon && !p.bookingUrl);
type Details = { first_name: string; last_name: string; email: string; phone: string; notes: string };
const EMPTY_DETAILS: Details = { first_name: '', last_name: '', email: '', phone: '', notes: '' };
type Receipt = { booking: Booking; access_token: string };

function BookingValue({ value, children }: { value: string | number; children: ReactNode }) {
  return <span className="bk-value-mask" data-bk-value={String(value)}><span data-bk-value-content>{children}</span></span>;
}

function readSession(key: string) {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null'); } catch { return null; }
}
function writeSession(key: string, value: unknown) {
  try { if (value === null) sessionStorage.removeItem(key); else sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Booking still works without browser storage. */ }
}

async function requestJson(url: string, init?: RequestInit) {
  const controller = init?.signal ? null : new AbortController();
  const timeout = controller ? setTimeout(() => controller.abort(), 18000) : null;
  try {
    const response = await fetch(url, { ...init, cache: 'no-store', signal: init?.signal ?? controller!.signal });
    const data = await response.json();
    if (!response.ok) throw Object.assign(new Error(data.error?.message ?? 'Something went wrong. Please try again.'), { status: response.status, fields: data.error?.fields, code: data.error?.code });
    return data;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export default function BookingOverlay({ propertyId, intent = 'stay', selection, photoTransition, onClose, onBrowseHotels }: { propertyId?: string; intent?: 'stay' | 'corporate'; selection?: BookingSelection; photoTransition?: BookingPhotoTransition | null; onClose: () => void; onBrowseHotels: (selection: BookingSelection) => void }) {
  const today = todayInHyderabad();
  const dialog = useRef<HTMLDialogElement>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRequest = useRef<{ fingerprint: string; key: string } | null>(null);
  const previousStep = useRef(0);
  const ledgerSnapshot = useRef(new WeakMap<HTMLElement, string>());
  const [closing, setClosing] = useState(false);
  const [ready, setReady] = useState(false);
  const [property, setProperty] = useState(BOOKABLE.find(p => p.id === propertyId) ?? BOOKABLE[0]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selecting, setSelecting] = useState<'check_in' | 'check_out'>('check_in');
  const [month, setMonth] = useState(today.slice(0, 7));
  const [arrival, setArrival] = useState('');
  const [guests, setGuests] = useState(2);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [step, setStep] = useState(0);
  const [availability, setAvailability] = useState<BookingAvailability | null>(null);
  const [checking, setChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [retry, setRetry] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [viewBooking, setViewBooking] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const draft = readSession(DRAFT_KEY);
    const desiredProperty = BOOKABLE.find(p => p.id === (propertyId ?? draft?.property_id)) ?? BOOKABLE[0];
    setProperty(desiredProperty);
    const opening = resolveBookingSelection(selection, draft?.property_id === desiredProperty.id ? { checkIn: draft.check_in, checkOut: draft.check_out, guests: draft.guests } : undefined, today);
    setCheckIn(opening.checkIn); setCheckOut(opening.checkOut); setGuests(opening.guests);
    if (opening.checkIn) { setMonth(opening.checkIn.slice(0, 7)); setSelecting('check_out'); }
    if (draft?.property_id === desiredProperty.id) {
      if (typeof draft.arrival_time === 'string' && /^\d{2}:\d{2}$/.test(draft.arrival_time)) setArrival(draft.arrival_time);
    }
    setReady(true);
    const saved = readSession(RECEIPT_KEY);
    if (typeof saved?.reference === 'string' && typeof saved?.access_token === 'string' && (!propertyId || propertyId === saved.property_id)) {
      setRestoring(true);
      requestJson(`/api/bookings/${encodeURIComponent(saved.reference)}`, { headers: { Authorization: `Bearer ${saved.access_token}` } })
        .then(data => { setReceipt({ booking: data.booking, access_token: saved.access_token }); setProperty(BOOKABLE.find(p => p.id === data.booking.property_id) ?? desiredProperty); })
        .catch(error => { if (error.status === 401 || error.status === 404) writeSession(RECEIPT_KEY, null); else setSubmitError('Unable to retrieve your previous reservation. Please try View booking again before making another reservation.'); })
        .finally(() => setRestoring(false));
    }
  // The opening configuration is fixed for this dialog instance.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (!element.open) element.showModal();
    photoTransition?.enter(element);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      element.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    photoTransition?.cancel();
    setClosing(true);
    closeTimer.current = setTimeout(onClose, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
  }, [closing, onClose, photoTransition]);

  useEffect(() => {
    if (!dialog.current) return;
    if (photoTransition?.active && photoTransition.propertyId === property.id) return;
    return enhanceMotion(dialog.current, ({ gsap }) => {
      // Reframe the destination while the live selection is already usable.
      gsap.fromTo('.bk-record-photo', { clipPath: 'inset(0% 12% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .35, ease: 'power3.out', clearProps: 'clipPath' });
      gsap.fromTo('.bk-property-image', { scale: 1.055, xPercent: 1 }, { scale: 1, xPercent: 0, duration: .4, ease: 'power3.out', clearProps: 'transform' });
    });
  }, [property.id, photoIndex]);

  useEffect(() => {
    if (!dialog.current) return;
    return enhanceMotion(dialog.current, ({ gsap }) => {
      if (!photoTransition?.active) gsap.fromTo('.bk-scene-caption', { x: -7 }, { x: 0, duration: .28, ease: 'power3.out', clearProps: 'transform' });
    });
  }, []);

  useEffect(() => {
    const direction = step >= previousStep.current ? 1 : -1;
    previousStep.current = step;
    if (!dialog.current || !ready || restoring) return;
    return enhanceMotion(dialog.current, ({ gsap }) => {
      gsap.fromTo('.bk-step, .bk-success', { x: direction * 9 }, { x: 0, duration: .26, ease: 'power3.out', clearProps: 'transform' });
      gsap.fromTo('.bk-step h2, .bk-success h2', { clipPath: 'inset(0% 0% 100% 0%)', y: 5 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: .28, ease: 'power3.out', clearProps: 'clipPath,transform' });
      if (receipt) gsap.fromTo('.bk-confirmed-rule', { scaleX: .88 }, { scaleX: 1, transformOrigin: 'left', duration: .35, ease: 'power3.out', clearProps: 'transform,transformOrigin' });
    });
  }, [step, receipt, ready, restoring]);

  useEffect(() => {
    if (ready) writeSession(DRAFT_KEY, { property_id: property.id, check_in: checkIn, check_out: checkOut, guests, arrival_time: arrival });
  }, [ready, property.id, checkIn, checkOut, guests, arrival]);

  useEffect(() => {
    if (!ready || receipt) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error('timeout')), 15000);
    let active = true;
    setChecking(true); setAvailabilityError(''); setAvailability(null);
    const query = new URLSearchParams({ property_id: property.id, month, guests: String(guests) });
    if (checkIn && checkOut) { query.set('check_in', checkIn); query.set('check_out', checkOut); }
    requestJson(`/api/bookings/availability?${query}`, { signal: controller.signal })
      .then(data => { if (active) { setAvailability(data); if (arrival && checkIn && checkOut && !data.slots.some((slot: {time: string; available: boolean}) => slot.time === arrival && slot.available)) setArrival(''); } })
      .catch(() => { if (active) setAvailabilityError('Online booking is unavailable. Our front desk can confirm your stay.'); })
      .finally(() => { if (active) setChecking(false); clearTimeout(timeout); });
    return () => { active = false; controller.abort(); clearTimeout(timeout); };
  // Arrival does not change hotel availability.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, property.id, month, checkIn, checkOut, guests, retry, receipt]);

  useEffect(() => {
    if (ready) { dialog.current?.scrollTo({ top: 0, behavior: 'instant' }); stepHeading.current?.focus({ preventScroll: true }); }
  }, [step, receipt, ready]);

  const offline = !!availabilityError;
  const nights = nightsBetween(checkIn, checkOut);
  const validDates = checkIn >= today && nights > 0 && nights <= 30 && checkOut <= dateAfter(today, 365);
  const validArrival = /^([01]\d|2[0-3]):[0-5]\d$/.test(arrival);
  const canContinue = validDates && !checking && (step === 0 ? offline || availability?.available : offline ? !arrival || validArrival : validArrival && availability?.available && availability.slots.some(slot => slot.time === arrival && slot.available));
  const canConfirm = !checking && !offline && availability?.available && availability.slots.some(slot => slot.time === arrival && slot.available) && validDates;

  function changeStep(next: number) {
    setSubmitError('');
    setStep(next);
  }
  function selectDate(date: string) {
    setArrival(''); setSubmitError('');
    if (selecting === 'check_in') { setCheckIn(date); setCheckOut(''); setSelecting('check_out'); }
    else {
      const blockedNight = availability?.dates.find(night => night.date >= checkIn && night.date < date && !night.available);
      if (!offline && blockedNight) { setSubmitError('Your stay includes an unavailable night. Please choose another date range.'); return; }
      setCheckOut(date);
    }
  }
  function continueStep(event: FormEvent) {
    event.preventDefault();
    if (step === 1) {
      const found = guestErrors(details); setErrors(found);
      if (Object.keys(found).length) { dialog.current?.querySelector<HTMLInputElement>(`[name="${Object.keys(found)[0]}"]`)?.focus(); return; }
    }
    if (canContinue) changeStep(Math.min(step + 1, 2));
  }

  async function submit() {
    if (!canConfirm || submitting) return;
    const found = guestErrors(details);
    if (Object.keys(found).length) { setErrors(found); setStep(1); return; }
    setSubmitting(true); setSubmitError('');
    const payload = { property_id: property.id, check_in: checkIn, check_out: checkOut, arrival_time: arrival, guests, ...Object.fromEntries(Object.entries(details).map(([key, value]) => [key, value.trim()])) };
    try {
      const key = await requestJson('/api/bookings/request-key', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const fingerprint = key.fingerprint;
      const previous = retryRequest.current ?? readSession(RETRY_KEY);
      const validPreviousKey = typeof previous?.key === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(previous.key);
      const idempotency_key = previous?.fingerprint === fingerprint && validPreviousKey ? previous.key : key.idempotency_key;
      retryRequest.current = { fingerprint, key: idempotency_key };
      writeSession(RETRY_KEY, { fingerprint, key: idempotency_key });
      const data: Receipt = await requestJson('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, idempotency_key }) });
      writeSession(RECEIPT_KEY, { reference: data.booking.booking_reference, access_token: data.access_token, property_id: data.booking.property_id });
      writeSession(RETRY_KEY, null);
      retryRequest.current = null;
      setReceipt(data);
    } catch (error) {
      const failure = error as Error & { status?: number; fields?: Record<string, string> };
      if (failure.status === 409 && (failure as Error & { code?: string }).code === 'IDEMPOTENCY_CONFLICT') { writeSession(RETRY_KEY, null); retryRequest.current = null; setSubmitError('Your request has changed. Please review the details and confirm again.'); }
      else if (failure.status === 409) { setSubmitError('This stay or arrival time is no longer available. Please choose another date or time.'); setArrival(''); setStep(1); setRetry(value => value + 1); }
      else if (failure.fields) {
        setErrors(failure.fields); setSubmitError(failure.message);
        if (['check_in', 'check_out', 'property_id', 'guests', 'room_unit_id'].some(key => failure.fields?.[key])) { setStep(0); setSubmitError(Object.entries(failure.fields).map(([,value]) => value).join(' ')); }
        else if (failure.fields.arrival_time) { setStep(1); setSubmitError(failure.fields.arrival_time); setArrival(''); setRetry(value => value + 1); }
        else if (failure.fields.notes) { setStep(2); setSubmitError(failure.fields.notes); }
        else setStep(1);
      }
      else setSubmitError('Unable to confirm your reservation. Please try again. Retrying the same details will not create a duplicate booking.');
    } finally { setSubmitting(false); }
  }

  async function refreshBooking() {
    const saved = receipt ? { reference: receipt.booking.booking_reference, access_token: receipt.access_token } : readSession(RECEIPT_KEY);
    if (!saved) return;
    setViewLoading(true); setSubmitError('');
    try { const data = await requestJson(`/api/bookings/${encodeURIComponent(saved.reference)}`, { headers: { Authorization: `Bearer ${saved.access_token}` } }); setReceipt({ booking: data.booking, access_token: saved.access_token }); setViewBooking(true); }
    catch { setSubmitError('Unable to retrieve your reservation. Please try again or contact the front desk with your reference.'); }
    finally { setViewLoading(false); }
  }

  function downloadCalendar() {
    if (!receipt) return;
    const file = new Blob([bookingCalendar(receipt.booking, property.name, property.address)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.booking.booking_reference}.ics`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const booking = receipt?.booking;
  const capturedPhoto = photoTransition?.propertyId === property.id ? photoTransition : null;
  const photos = [capturedPhoto?.src ?? property.heroImage, ...property.gallery.filter(src => src !== property.heroImage && src !== capturedPhoto?.src)];
  const selectedPhoto = photos[photoIndex % photos.length];
  const displayIn = booking?.check_in ?? checkIn;
  const displayOut = booking?.check_out ?? checkOut;
  const displayArrival = booking?.arrival_time ?? arrival;
  const displayGuests = booking?.guests ?? guests;
  const recordState = booking ? `Reservation ${booking.status}` : checking ? 'Checking your dates' : offline ? 'Preferred dates · request only' : validDates && availability?.available ? 'Stay available for your selection' : validDates && availability ? 'No online stay available' : 'Choose dates to check availability';
  const availabilityState = booking ? booking.status === 'confirmed' ? 'available' : 'unavailable' : checking ? 'unchecked' : offline ? 'request' : validDates && availability?.available ? 'available' : validDates && availability ? 'unavailable' : 'unchecked';
  const supportMessage = booking
    ? `Hello Innzoy, I need help with reservation ${booking.booking_reference} at ${property.name}. Stay: ${booking.check_in} to ${booking.check_out}, arrival ${booking.arrival_time} IST, ${booking.guests} guest(s).`
    : [`Hello Innzoy, I would like to request ${intent === 'corporate' ? 'a corporate stay' : 'a stay'} at ${property.name}.`, `Check-in: ${checkIn || 'To be arranged'}`, `Check-out: ${checkOut || 'To be arranged'}`, `Preferred arrival: ${arrival || 'To be arranged'} IST`, `Guests: ${guests}`, details.first_name || details.last_name ? `Guest: ${details.first_name} ${details.last_name}`.trim() : '', details.email ? `Email: ${details.email}` : '', details.phone ? `Phone: ${details.phone}` : '', details.notes ? `Requests: ${details.notes}` : '', 'Please confirm availability and rates. This is a request, not a confirmed reservation.'].filter(Boolean).join('\n');
  const supportUrl = waLink(intent === 'corporate' ? BRAND.contact.whatsapp : property.whatsapp ?? BRAND.contact.whatsapp, supportMessage);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const changed = [...element.querySelectorAll<HTMLElement>('[data-bk-value]')].filter(value => {
      const next = value.dataset.bkValue ?? '';
      const previous = ledgerSnapshot.current.get(value);
      ledgerSnapshot.current.set(value, next);
      return next !== '' && next !== previous;
    });
    if (!changed.length) return;
    return enhanceMotion(element, ({ gsap }) => {
      const contents = changed.flatMap(value => [...value.querySelectorAll<HTMLElement>('[data-bk-value-content]')]);
      gsap.fromTo(contents, { yPercent: 45 }, { yPercent: 0, duration: .22, ease: 'power3.out', clearProps: 'transform' });
    });
  }, [property.id, displayIn, displayOut, displayArrival, displayGuests, recordState, step, ready]);

  return <dialog ref={dialog} className={`bk-dialog ${closing ? 'bk-closing' : ''}`} aria-labelledby="bk-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }} data-availability={availabilityState} data-step={step} data-lenis-prevent>
    <div className="bk-shell">
      <header className="bk-header"><div className="bk-brand"><Image src="/images/innzoy-logo.png" alt="Innzoy" width={222} height={186} className="bk-brand-logo" unoptimized /></div><span className="bk-header-note">Direct reservations · Hyderabad</span><button className="bk-close" aria-label="Close booking" onClick={close}><span>Close</span><X size={18} /></button></header>
      <div className="bk-sheet">
        <div className="bk-layout">
        <aside className="bk-room-scene" aria-label="Your hotel">
          <div className="bk-selected-hotel"><span><small>Your hotel</small><strong><BookingValue value={property.id}>{property.name}</BookingValue></strong></span><button type="button" className="bk-change-label" disabled={submitting || !!receipt} onClick={() => onBrowseHotels({ checkIn, checkOut, guests })}>Change hotel <ArrowRight size={14} aria-hidden="true" /></button></div>
          <figure className="bk-room-figure">
            <div className="bk-record-photo" id="bk-room-photograph" data-booking-photo={property.id}><Image key={`${property.id}-${selectedPhoto}`} src={selectedPhoto} unoptimized={!!capturedPhoto} alt={`Hotel gallery at Innzoy ${property.name}, photo ${photoIndex % photos.length + 1}`} fill sizes="(max-width: 700px) 100vw, 480px" className="bk-property-image" style={{ objectPosition: photoIndex === 0 ? capturedPhoto?.objectPosition : undefined }} />
              <div className="bk-photo-controls"><span>{String(photoIndex % photos.length + 1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><button type="button" aria-label="Previous hotel photo" onClick={() => setPhotoIndex(index => (index + photos.length - 1) % photos.length)}><ChevronLeft size={17} /></button><button type="button" aria-label="Next hotel photo" onClick={() => setPhotoIndex(index => (index + 1) % photos.length)}><ChevronRight size={17} /></button></div>
            </div>
            <figcaption className="bk-scene-caption"><span>{property.locality}</span><div className="bk-published-rate"><StayRate property={property} showWeekend={false} /><small>Published starting rate</small></div></figcaption>
          </figure>
          {step > 0 && <div className="bk-selection-summary"><span><small>Your dates</small>{formatStayDate(displayIn, true)} — {formatStayDate(displayOut, true)}</span><span><small>Your party</small>{displayGuests} {displayGuests === 1 ? 'guest' : 'guests'}{displayArrival ? ` · ${displayArrival} IST` : ''}</span><button type="button" disabled={submitting || !!receipt} onClick={() => changeStep(0)}>Edit stay <ArrowRight size={14} /></button></div>}
        </aside>
        <div className="bk-main" data-lenis-prevent>
          {!receipt && <nav className="bk-progress" aria-label="Reservation progress"><ol>{STEPS.map((label, index) => <li key={label} className={step === index ? 'bk-current' : step > index ? 'bk-complete' : ''} aria-current={step === index ? 'step' : undefined}><button type="button" disabled={index > step || submitting} onClick={() => changeStep(index)}>{label}<span>{step > index ? <Check size={12} /> : <ArrowRight size={12} />}</span></button></li>)}</ol></nav>}

          {restoring ? <div className="bk-restoring" role="status"><LoaderCircle size={24} className="bk-spin" /><h2 id="bk-title">Retrieving your reservation…</h2></div> : receipt && booking ? <div className="bk-success bk-step-enter">
            <div className="bk-confirmed-rule" data-state={booking.status === 'confirmed' ? 'available' : 'unavailable'}>{booking.status === 'confirmed' ? <Check size={17} strokeWidth={1.4} /> : <span aria-hidden="true">—</span>}<span>{booking.status === 'confirmed' ? 'Your stay is reserved' : `Status: ${booking.status}`}</span></div>
            <h2 id="bk-title" ref={stepHeading} tabIndex={-1}>{booking.status === 'confirmed' ? 'See you soon.' : 'Your reservation.'}</h2>
            <p>Your stay at {property.name}, {formatStayDate(booking.check_in, true)} — {formatStayDate(booking.check_out, true)}.</p>
            <div className="bk-reference"><span className="bk-eyebrow">Confirmation number</span><strong>{booking.booking_reference}</strong></div>
            <dl className="bk-confirm-details"><div><dt>Guest</dt><dd>{booking.first_name} {booking.last_name}</dd></div><div><dt>Email</dt><dd>{booking.email}</dd></div><div><dt>Arrival</dt><dd>{booking.arrival_time} IST · {booking.guests} guests</dd></div></dl>
            {viewBooking && <div className="bk-booking-view"><span className="bk-eyebrow">Reservation details</span><p>{property.address}</p><p>{booking.phone}</p>{booking.notes && <p>Special requests: {booking.notes}</p>}<p className="bk-status-line">Status: {booking.status}</p></div>}
            <div className="bk-success-actions"><button className="bk-primary" onClick={downloadCalendar}>Add to calendar<ArrowRight size={16} /></button><button className="bk-secondary" onClick={refreshBooking} disabled={viewLoading}>{viewLoading ? 'Retrieving…' : 'View booking'}</button></div>
            {submitError && <p className="bk-error" role="alert">{submitError}</p>}
            <button className="bk-text-button" onClick={close}>Return to website <ArrowRight size={14} /></button>
            <div className="bk-help"><a href={supportUrl} target="_blank" rel="noopener noreferrer">Contact the front desk ↗</a></div>
            <button className="bk-text-button bk-new-stay" onClick={() => { writeSession(RECEIPT_KEY, null); setReceipt(null); setViewBooking(false); setStep(0); setCheckIn(''); setCheckOut(''); setArrival(''); setPhotoIndex(0); setSelecting('check_in'); setMonth(today.slice(0, 7)); setDetails(EMPTY_DETAILS); setErrors({}); setSubmitError(''); }}>Plan another stay</button>
          </div> : <form className={step === 0 ? 'bk-form-dates' : undefined} onSubmit={continueStep} noValidate>
            <div className={`bk-step bk-step-enter${step === 0 ? ' bk-step-dates' : ''}`} key={step}>
              {intent === 'corporate' && <span className="bk-eyebrow">Your corporate stay</span>}
              <h2 id="bk-title" ref={stepHeading} tabIndex={-1}>{step === 0 ? 'Your dates.' : step === 1 ? 'A few details.' : 'Review your stay.'}</h2>
              <p className="bk-intro">{step === 0 ? 'Choose your hotel, dates and guests.' : step === 1 ? 'Your arrival and the guest we’ll be welcoming.' : 'Review your details before reserving.'}</p>

              {step === 0 && <>
                <div className="bk-date-desk">
                  <div className="bk-date-fields"><button type="button" className={selecting === 'check_in' ? 'bk-active' : ''} onClick={() => setSelecting('check_in')}><span>Check-in</span><strong><BookingValue value={checkIn}>{formatStayDate(checkIn, true)}</BookingValue></strong></button><button type="button" className={selecting === 'check_out' ? 'bk-active' : ''} onClick={() => { if (checkIn) setSelecting('check_out'); }} disabled={!checkIn}><span>Check-out</span><strong><BookingValue value={checkOut}>{formatStayDate(checkOut, true)}</BookingValue></strong></button></div>
                  <div className="bk-guests"><label htmlFor="bk-guests">Guests <span>For this reservation</span></label><div><button type="button" aria-label="Remove a guest" disabled={guests <= 1} onClick={() => { setGuests(v => v - 1); setArrival(''); }}>−</button><output id="bk-guests" aria-live="polite"><BookingValue value={guests}>{guests}</BookingValue></output><button type="button" aria-label="Add a guest" disabled={guests >= MAX_BOOKING_GUESTS} onClick={() => { setGuests(v => v + 1); setArrival(''); }}>+</button></div></div>
                </div>
                <BookingCalendar month={month} onMonthChange={next => { setChecking(true); setMonth(next); }} checkIn={checkIn} checkOut={checkOut} onSelect={selectDate} dates={availability?.dates ?? []} loading={checking || !ready} unavailable={offline} minDate={availability?.min_date ?? today} maxDate={availability?.max_date ?? dateAfter(today, 365)} selecting={selecting} onRetry={() => setRetry(value => value + 1)} />
              </>}

              {step === 1 && <>
                <div className="bk-fields">{([{ name: 'first_name', label: 'First name', complete: 'given-name', type: 'text' }, { name: 'last_name', label: 'Last name', complete: 'family-name', type: 'text' }, { name: 'email', label: 'Email address', complete: 'email', type: 'email' }, { name: 'phone', label: 'Phone · include country code', complete: 'tel', type: 'tel' }] as const).map(field => <div className="bk-field" key={field.name}><label htmlFor={`bk-${field.name}`}>{field.label}</label><input id={`bk-${field.name}`} name={field.name} type={field.type} autoComplete={field.complete} maxLength={field.name === 'email' ? 254 : field.name === 'phone' ? 25 : 80} value={details[field.name]} onChange={event => { setDetails(value => ({ ...value, [field.name]: event.target.value })); setErrors(value => ({ ...value, [field.name]: '' })); }} required aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `bk-${field.name}-error` : undefined} />{errors[field.name] && <span id={`bk-${field.name}-error`} className="bk-field-error">{errors[field.name]}</span>}</div>)}</div>
                <div className="bk-arrival-section"><span className="bk-eyebrow">Arrival time · Hyderabad (IST)</span>
                {checking ? <div className="bk-slot-loading" role="status"><LoaderCircle size={18} className="bk-spin" />Checking availability…</div> : offline ? <div className="bk-field"><label htmlFor="bk-preferred-arrival">Preferred arrival · optional request time</label><input id="bk-preferred-arrival" name="arrival_time" inputMode="numeric" maxLength={5} placeholder="HH:MM, e.g. 14:00" value={arrival} onChange={event => setArrival(event.target.value)} aria-invalid={!!arrival && !validArrival} aria-describedby={`bk-arrival-help${arrival && !validArrival ? ' bk-arrival-error' : ''}`} /><p id="bk-arrival-help">The front desk will confirm your preferred time.</p>{arrival && !validArrival && <span id="bk-arrival-error" className="bk-field-error">Use a 24-hour time, for example 14:00, or leave this blank.</span>}</div> : <>
                  <div className="bk-time-grid" role="group" aria-label="Available arrival times">{availability?.slots.map(slot => <button type="button" key={slot.time} disabled={!slot.available} aria-pressed={arrival === slot.time} className={arrival === slot.time ? 'bk-selected' : ''} onClick={() => setArrival(slot.time)}><span>{slot.time}</span><small>{!slot.available ? 'Unavailable' : arrival === slot.time ? 'Selected' : 'Arrival'}</small>{arrival === slot.time && <Check size={14} />}</button>)}</div>
                  {!availability?.available && <div className="bk-empty"><span className="bk-eyebrow">Choose another stay</span><h3>Let’s find another<br /><em>way to stay.</em></h3><p>No online stay is available for these dates and {guests} guests at {property.name}.</p><button type="button" className="bk-text-button" onClick={() => changeStep(0)}>Change dates or address <ArrowRight size={14} /></button></div>}
                </>}
                {!checking && !offline && availability?.available && !availability.slots.some(slot => slot.available) && <p className="bk-error">No arrival times remain for these dates. Please choose another stay.</p>}

                </div><p className="bk-footnote">Your details are used to manage this reservation.</p>
              </>}

              {step === 2 && <>
                <div className="bk-review-card"><div><span className="bk-eyebrow">Dates & guests</span><button type="button" disabled={submitting} onClick={() => changeStep(0)}>Edit stay</button></div><p>{formatStayDate(checkIn, true)} — {formatStayDate(checkOut, true)} · {nights} {nights === 1 ? 'night' : 'nights'}</p><p>{guests} {guests === 1 ? 'guest' : 'guests'} · {arrival ? `${arrival} IST` : 'Arrival to be arranged'}</p></div>
                <div className="bk-review-guest"><div><span className="bk-eyebrow">Lead guest</span><button type="button" disabled={submitting} onClick={() => changeStep(1)}>Edit details</button></div><p>{details.first_name} {details.last_name}<br />{details.email}<br />{details.phone}</p></div>
                <details className="bk-requests" open={errors.notes ? true : undefined}><summary>Special requests <span>Optional <ChevronDown size={14} /></span></summary><div className="bk-field"><label htmlFor="bk-notes" className="bk-sr-only">Special requests</label><textarea id="bk-notes" name="notes" rows={2} maxLength={1000} placeholder={intent === 'corporate' ? 'Company details, invoicing or anything else we should know…' : 'Anything we should know…'} value={details.notes} onChange={event => setDetails(value => ({ ...value, notes: event.target.value }))} /></div></details>
                <p className="bk-footnote">The published rate is a guide. Our team confirms the final price, taxes and any requests. No payment is collected here.</p>
                {!offline && <p className="bk-footnote">Availability is checked again when you confirm.</p>}
              </>}
            </div>

            <div className="bk-notices" aria-live="polite">
              {validDates && !checking && !offline && availability?.available && <p className="bk-availability-state" data-state="available"><span />Stay available · {nights} {nights === 1 ? 'night' : 'nights'}, {guests} {guests === 1 ? 'guest' : 'guests'}{arrival ? ` · ${arrival} arrival` : ''}</p>}
              {step === 0 && validDates && !checking && !offline && availability && !availability.available && <p className="bk-availability-state" data-state="unavailable"><span />No online stay available for this selection. Choose different dates or another address.</p>}
              {availabilityError && step !== 0 && <div className="bk-offline"><p>{availabilityError}</p><button type="button" onClick={() => setRetry(v => v + 1)} disabled={checking}>Check again</button></div>}
              {checking && step === 2 && <p className="bk-loading-line"><LoaderCircle size={14} className="bk-spin" />Checking availability…</p>}
              {submitError && <p className="bk-error" role="alert">{submitError}{readSession(RECEIPT_KEY) && <button type="button" className="bk-text-button" onClick={refreshBooking} disabled={viewLoading}>View booking</button>}</p>}
            </div>
            <footer className="bk-actions">
              {step > 0 ? <button type="button" className="bk-back" onClick={() => changeStep(step - 1)} disabled={submitting}><ArrowLeft size={16} /><span>Back</span></button> : <span className="bk-actions-note">{validDates ? `${nights} ${nights === 1 ? 'night' : 'nights'} · ${guests} ${guests === 1 ? 'guest' : 'guests'}` : 'Choose your dates to begin'}</span>}
              {step < 2 ? <button className="bk-primary" type="submit" disabled={!canContinue || submitting}> {step === 0 ? 'Continue' : 'Review your stay'}<ArrowRight size={16} /></button> : offline ? <a className="bk-primary" href={supportUrl} target="_blank" rel="noopener noreferrer">Send booking request<ArrowRight size={16} /></a> : <button type="button" className="bk-primary" onClick={submit} disabled={!canConfirm || submitting}>{submitting ? <><LoaderCircle size={16} className="bk-spin" />Confirming reservation…</> : <>Confirm reservation<ArrowRight size={16} /></>}</button>}
            </footer>
            {(offline || !!submitError) && step < 2 && <div className="bk-fallback"><a href={supportUrl} target="_blank" rel="noopener noreferrer">Ask the front desk ↗</a></div>}
            {!!submitError && step === 2 && !offline && <div className="bk-fallback"><a href={supportUrl} target="_blank" rel="noopener noreferrer">Request assistance via WhatsApp ↗</a></div>}
          </form>}
        </div>
      </div>
      </div>
    </div>
  </dialog>;
}
