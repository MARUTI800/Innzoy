'use client';

import { useBooking } from '@/context/BookingContext';

interface Props {
  propertySlug: string;
  roomName?: string;
  buttonLabel?: string;
}

export default function PropertyBookingButton({
  propertySlug,
  roomName,
  buttonLabel = 'RESERVE SANCTUARY',
}: Props) {
  const { openBooking } = useBooking();

  return (
    <button
      onClick={() => openBooking({ propertySlug, roomName })}
      className="px-6 py-3.5 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#2C2A29] transition-colors"
    >
      {buttonLabel}
    </button>
  );
}
