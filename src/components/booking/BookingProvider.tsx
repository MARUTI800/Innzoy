'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { captureBookingPhoto, type BookingPhotoTransition } from './booking-photo-transition';
import { bookingSelectionFromSearch, hotelBrowseHref, type BookingSelection } from './booking-selection';
import { HOTEL_BOOKING_IDS } from '@/lib/booking';
import { HOTELS } from '@/data/innzoyData';
import './booking.css';

const BookingCloseContext = createContext<(() => void) | null>(null);
function BookingLoading() {
  const close = useContext(BookingCloseContext);
  return <><div className="bk-loading-shell" /><div className="bk-loading-header"><Image className="bk-loading-company-logo" src="/images/innzoy-logo.png" width={222} height={186} alt="Innzoy" unoptimized /><p role="status">Preparing your stay…</p><button className="bk-loading-close" type="button" aria-label="Close booking" onClick={() => close?.()}>Close ×</button></div></>;
}
const loadBooking = () => import('./BookingOverlay');
const BookingOverlay = dynamic(loadBooking, {
  ssr: false,
  loading: BookingLoading,
});

type BookingIntent = 'stay' | 'corporate';
type OpenOptions = { propertyId?: string; intent?: BookingIntent; selection?: BookingSelection };
const BookingContext = createContext<((options: OpenOptions, trigger?: HTMLElement) => void) | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OpenOptions>({});
  const returnFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  const photoTransition = useRef<BookingPhotoTransition | null>(null);

  useEffect(() => () => photoTransition.current?.cancel(), []);

  useEffect(() => {
    if (open) { wasOpen.current = true; return; }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const trigger = returnFocus.current;
    const frame = requestAnimationFrame(() => {
      const visibleTriggers = [...document.querySelectorAll<HTMLElement>('[data-booking-trigger]')]
        .filter(element => !element.closest('dialog:not([open])') && element.getClientRects().length > 0);
      const target = trigger?.isConnected && !trigger.closest('dialog:not([open])')
        ? trigger
        : visibleTriggers.find(element => element.dataset.bookingTrigger === (trigger?.dataset.bookingTrigger ?? options.propertyId ?? 'all'))
          ?? visibleTriggers[0];
      target?.focus({ preventScroll: true });
      returnFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, options.propertyId]);

  useEffect(() => {
    const sync = () => {
      const url = new URL(window.location.href);
      const next = url.searchParams.get('booking') === '1';
      photoTransition.current?.cancel();
      photoTransition.current = null;
      if (next) {
        const propertyId = url.searchParams.get('property') ?? '';
        const intent = url.searchParams.get('booking_intent') === 'corporate' ? 'corporate' : 'stay';
        const selection = bookingSelectionFromSearch(url.searchParams);
        if (!HOTEL_BOOKING_IDS.some(id => id === propertyId)) {
          setOpen(false);
          router.replace(hotelBrowseHref(selection, intent));
          return;
        }
        setOptions({ propertyId, intent, selection });
      }
      setOpen(next);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [router]);

  const openBooking = useCallback((next: OpenOptions, trigger?: HTMLElement) => {
    const url = new URL(window.location.href);
    const selection = next.selection ?? bookingSelectionFromSearch(url.searchParams);
    const intent = next.intent ?? (url.searchParams.get('booking_intent') === 'corporate' ? 'corporate' : 'stay');
    if (!next.propertyId || !HOTEL_BOOKING_IDS.some(id => id === next.propertyId)) {
      router.push(hotelBrowseHref(selection, intent));
      return;
    }
    photoTransition.current?.cancel();
    photoTransition.current = captureBookingPhoto(next.propertyId, trigger);
    returnFocus.current = trigger && !trigger.closest('dialog:not([open])')
      ? trigger
      : document.activeElement instanceof HTMLElement ? document.activeElement : null;
    url.searchParams.set('booking', '1');
    if (next.propertyId) url.searchParams.set('property', next.propertyId);
    else url.searchParams.delete('property');
    if (intent === 'corporate') url.searchParams.set('booking_intent', 'corporate');
    else url.searchParams.delete('booking_intent');
    if (new URL(window.location.href).searchParams.get('booking') !== '1') {
      window.history.pushState({ ...window.history.state, innzoyBooking: true }, '', url);
    }
    setOptions({ ...next, intent, selection });
    setOpen(true);
  }, [router]);

  const closeBooking = useCallback(() => {
    photoTransition.current?.cancel();
    setOpen(false);
    if (window.history.state?.innzoyBooking) window.history.back();
    else {
      const url = new URL(window.location.href);
      ['booking', 'property', 'booking_intent'].forEach((key) => url.searchParams.delete(key));
      window.history.replaceState(window.history.state, '', url);
    }
  }, []);

  const browseHotels = useCallback((selection: BookingSelection) => {
    photoTransition.current?.cancel();
    setOpen(false);
    router.replace(hotelBrowseHref(selection, options.intent));
  }, [router, options.intent]);

  useEffect(() => {
    if (!open) return;
    const dismissLoading = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('.bk-dialog[open]')) closeBooking();
    };
    window.addEventListener('keydown', dismissLoading);
    return () => window.removeEventListener('keydown', dismissLoading);
  }, [open, closeBooking]);

  return <BookingContext.Provider value={openBooking}>
    {children}
    <BookingCloseContext.Provider value={closeBooking}>{open && <BookingOverlay {...options} photoTransition={photoTransition.current} onClose={closeBooking} onBrowseHotels={browseHotels} />}</BookingCloseContext.Provider>
  </BookingContext.Provider>;
}

export function BookingTrigger({ propertyId, intent, selection, onClick, onPointerEnter, onPointerDown, onFocus, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & OpenOptions) {
  const open = useContext(BookingContext);
  const pathname = usePathname();
  const selectedHotel = propertyId ?? HOTELS.find(hotel => pathname === `/stays/${hotel.slug}`)?.id;
  return <button {...props} type="button" aria-haspopup={selectedHotel ? 'dialog' : undefined} data-booking-trigger={selectedHotel ?? 'all'} onPointerEnter={event => { onPointerEnter?.(event); if (selectedHotel) void loadBooking().catch(() => {}); }} onPointerDown={event => { onPointerDown?.(event); if (selectedHotel) void loadBooking().catch(() => {}); }} onFocus={event => { onFocus?.(event); if (selectedHotel) void loadBooking().catch(() => {}); }} onClick={(event) => {
    onClick?.(event);
    if (!event.defaultPrevented) open?.({ propertyId: selectedHotel, intent, selection }, event.currentTarget);
  }}>{children}</button>;
}
