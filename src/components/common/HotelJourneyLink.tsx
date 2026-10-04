'use client';

import { Suspense, type ComponentProps } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HOTELS } from '@/data/innzoyData';
import { bookingSelectionFromSearch, hotelBrowseHref } from '@/components/booking/booking-selection';

type HotelJourneyLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

function LinkWithPreferences({ href, ...props }: HotelJourneyLinkProps) {
  const search = useSearchParams();
  const browseHref = hotelBrowseHref(bookingSelectionFromSearch(search), search.get('booking_intent') === 'corporate' ? 'corporate' : 'stay');
  const query = new URLSearchParams(browseHref.slice(browseHref.indexOf('?') + 1));
  query.delete('category');
  const destination = href === '/stays?category=hotel'
    ? browseHref
    : `${href}${query.size ? `?${query}` : ''}`;
  return <Link {...props} href={destination} />;
}

/** Keep public stay preferences while comparing hotels; guest house journeys stay unchanged. */
export default function HotelJourneyLink({ href, ...props }: HotelJourneyLinkProps) {
  const isHotelJourney = href === '/stays?category=hotel' || HOTELS.some(hotel => href === `/stays/${hotel.slug}`);
  if (!isHotelJourney) return <Link {...props} href={href} />;
  return <Suspense fallback={<Link {...props} href={href} />}><LinkWithPreferences {...props} href={href} /></Suspense>;
}
