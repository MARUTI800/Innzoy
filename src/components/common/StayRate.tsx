import type { Property } from '@/types';

function formatPublishedRate(value: string) {
  return value.replace(/\d{4,}/g, number => Number(number).toLocaleString('en-IN'));
}

/** Published property information, never a quotation for the selected reservation. */
export default function StayRate({ property, className = '', showWeekend = true }: {
  property: Property; className?: string; showWeekend?: boolean;
}) {
  return <span className={`stay-rate ${className}`}>
    {property.weekdayPrice ? <>
      <span className="stay-rate-main"><span>From</span> <strong>{formatPublishedRate(property.weekdayPrice)}</strong><span>/ night</span></span>
      {showWeekend && property.weekendPrice && <span className="stay-rate-detail">Weekends from {formatPublishedRate(property.weekendPrice)} / night</span>}
    </> : <span className="stay-rate-external">{property.comingSoon ? 'Opening soon' : property.bookingUrl ? 'Rates on Airbnb' : 'Rates confirmed by the property'}</span>}
  </span>;
}
