'use client';

import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PROPERTIES } from '@/data/innzoyData';
import PropertyCard from '@/components/common/PropertyCard';
import '@/styles/hotel-discovery.css';

const FILTERS = [
  { key: 'all', label: 'All properties' },
  { key: 'hotel', label: 'Hotels' },
  { key: 'guesthouse', label: 'Guest houses' },
];
const COPY: Record<string, { title: string; description: string }> = {
  all: { title: 'Find your place.', description: 'Every Innzoy hotel and guest house across Hyderabad.' },
  hotel: { title: 'Choose your hotel.', description: 'Clean, well-kept rooms with 24/7 front desk service, across Khajaguda, Gachibowli, Manikonda and HITEC City.' },
  guesthouse: { title: 'A home for a while.', description: 'Self-contained homes with kitchens and living space, suited to families and longer stays.' },
};

const isDate = (value: string | null): value is string => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};
const shortDate = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

function StaysContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? 'all';
  const active = FILTERS.some(filter => filter.key === category) ? category : 'all';
  const properties = useMemo(() => active === 'all' ? PROPERTIES : PROPERTIES.filter((property) => property.category === active), [active]);
  const journey = new URLSearchParams();
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');
  const guests = searchParams.get('guests');
  if (isDate(checkIn) || checkIn === '') journey.set('check_in', checkIn);
  if (isDate(checkOut) || checkOut === '') journey.set('check_out', checkOut);
  if (guests && /^(?:[1-9]|1[0-2])$/.test(guests)) journey.set('guests', guests);
  if (searchParams.get('booking_intent') === 'corporate') journey.set('booking_intent', 'corporate');
  const journeyQuery = journey.toString();
  const filterHref = (filter: string) => {
    const next = new URLSearchParams(journeyQuery);
    if (filter !== 'all') next.set('category', filter);
    return `/stays${next.size ? `?${next.toString()}` : ''}`;
  };
  const staySummary = [isDate(checkIn) && isDate(checkOut) ? `${shortDate(checkIn)} — ${shortDate(checkOut)}` : '', journey.has('guests') ? `${guests} ${guests === '1' ? 'guest' : 'guests'}` : ''].filter(Boolean).join(' · ');

  return <div className="open-catalog open-page hotel-discovery-catalog">
    <header className="discovery-catalog-heading"><div><p className="open-eyebrow">Innzoy / Hyderabad</p><h1>{COPY[active].title}</h1></div><p>{COPY[active].description}</p></header>
    {staySummary && active !== 'guesthouse' && <div className="discovery-stay-summary"><span>Your stay</span><p>{staySummary}</p><span>Choose a hotel to continue</span></div>}
    <div className="open-catalog-register"><nav aria-label="Filter properties">{FILTERS.map((filter) => <Link key={filter.key} href={filterHref(filter.key)} className={active === filter.key ? 'is-current' : ''} aria-current={active === filter.key ? 'page' : undefined}>{filter.label}<span>{String(filter.key === 'all' ? PROPERTIES.length : PROPERTIES.filter((property) => property.category === filter.key).length).padStart(2, '0')}</span></Link>)}</nav><p role="status">{String(properties.length).padStart(2, '0')} addresses</p></div>
    <div className="open-address-book" key={active}>{properties.map((property, index) => <PropertyCard property={property} index={index} journeyQuery={journeyQuery} key={property.id} />)}</div>
    {active !== 'guesthouse' && <p className="discovery-catalog-note">Published starting rates. Your final rate is confirmed by the hotel.</p>}
  </div>;
}

export default function StaysPage() {
  return <Suspense fallback={<div className="open-catalog open-page hotel-discovery-catalog" aria-busy="true" aria-label="Loading properties"><p className="open-eyebrow">Innzoy / Hyderabad</p><h1>Find your place.</h1><p>Loading properties…</p></div>}><StaysContent /></Suspense>;
}
