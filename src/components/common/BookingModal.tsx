'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Users, MapPin, Building, ArrowRight, MessageCircle } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { PROPERTIES, DESTINATIONS, BRAND } from '@/data/innzoyData';

export default function BookingModal() {
  const { isOpen, options, closeBooking } = useBooking();

  const [destination, setDestination] = useState('hyderabad');
  const [propertySlug, setPropertySlug] = useState('jubilee-hills');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  // Set default dates (today + 3 days, today + 5 days)
  useEffect(() => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 3);
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 5);

    const fmt = (d: Date) => d.toISOString().split('T')[0];
    setCheckIn(fmt(d1));
    setCheckOut(fmt(d2));
    setNights(2);
  }, []);

  // Update selected options when opened with params
  useEffect(() => {
    if (options.propertySlug) {
      setPropertySlug(options.propertySlug);
      const prop = PROPERTIES.find((p) => p.slug === options.propertySlug);
      if (prop) {
        if (prop.location.includes('Jaipur') || prop.location.includes('Rajasthan')) {
          setDestination('rajasthan');
        } else {
          setDestination('hyderabad');
        }
      }
    } else if (options.destination) {
      setDestination(options.destination);
    }
  }, [options]);

  // Recalculate nights when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();
      const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      setNights(diff);
    }
  }, [checkIn, checkOut]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeBooking();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeBooking]);

  if (!isOpen) return null;

  const currentProperty = PROPERTIES.find((p) => p.slug === propertySlug) || PROPERTIES[0];
  const totalPrice = currentProperty ? currentProperty.startingPrice * nights : 0;

  const filteredProperties = PROPERTIES.filter((p) => {
    if (destination === 'hyderabad') return p.location.includes('Hyderabad');
    if (destination === 'rajasthan') return p.location.includes('Rajasthan') || p.location.includes('Jaipur');
    return true;
  });

  const handleWhatsAppBooking = () => {
    const message = `Hello INNZOY Concierge, I would like to inquire about reserving a stay:%0A%0A*Property:* ${currentProperty.name}%0A*Check-in:* ${checkIn}%0A*Check-out:* ${checkOut}%0A*Nights:* ${nights}%0A*Guests:* ${guests}%0A*Estimated Total:* ₹${totalPrice.toLocaleString('en-IN')}%0A%0APlease let me know availability and suite options.`;
    window.open(`https://wa.me/918520963096?text=${message}`, '_blank');
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#141413]/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={closeBooking}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl h-full bg-[#FAF8F5] text-[#141413] shadow-2xl flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-700 ease-luxury">
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-[#141413]/8 flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D]">
              RESERVATION SANCTUARY
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight mt-1">
              Reserve Your Stay
            </h2>
          </div>
          <button
            onClick={closeBooking}
            className="p-2.5 rounded-full hover:bg-[#141413]/5 transition-colors focus:outline-none"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5 text-[#141413]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 flex-1">
          {submitted ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#141413] text-[#FAF8F5] flex items-center justify-center">
                ✓
              </div>
              <h3 className="font-serif text-3xl font-light">Inquiry Dispatched</h3>
              <p className="text-sm text-[#726E67] max-w-sm mx-auto leading-relaxed">
                Our silent human concierge has received your stay request for{' '}
                <strong className="text-[#141413] font-medium">{currentProperty.name}</strong>. We
                will confirm availability via email or WhatsApp within moments.
              </p>
              <div className="p-5 bg-[#F4EFEA] border border-[#141413]/5 text-left text-xs font-mono space-y-2">
                <div>
                  <span className="text-stone-400">STAY:</span> {currentProperty.name}
                </div>
                <div>
                  <span className="text-stone-400">DATES:</span> {checkIn} → {checkOut} ({nights}{' '}
                  nights)
                </div>
                <div>
                  <span className="text-stone-400">GUESTS:</span> {guests} Adults
                </div>
                <div>
                  <span className="text-stone-400">ESTIMATED:</span> ₹
                  {totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  closeBooking();
                }}
                className="w-full py-4 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.22em] hover:bg-[#2C2A29] transition-colors"
              >
                RETURN TO WEBSITE
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmReservation} className="space-y-8">
              {/* Destination selector */}
              <div>
                <label className="flex items-center text-[10px] font-mono uppercase tracking-[0.25em] text-[#726E67] mb-2.5">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-[#B89F7D]" />
                  01 — Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setDestination(d.id);
                        const match = PROPERTIES.find((p) =>
                          d.id === 'hyderabad'
                            ? p.location.includes('Hyderabad')
                            : p.location.includes('Rajasthan')
                        );
                        if (match) setPropertySlug(match.slug);
                      }}
                      className={`text-left px-4 py-3 border text-xs font-medium transition-all ${
                        destination === d.id
                          ? 'border-[#141413] bg-[#141413] text-[#FAF8F5]'
                          : 'border-[#141413]/10 bg-white hover:border-[#141413]/30 text-[#141413]'
                      }`}
                    >
                      <span className="block font-serif text-sm">{d.name}</span>
                      <span className="block font-mono text-[9px] opacity-70 tracking-widest uppercase">
                        {d.region}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property selector */}
              <div>
                <label className="flex items-center text-[10px] font-mono uppercase tracking-[0.25em] text-[#726E67] mb-2.5">
                  <Building className="w-3.5 h-3.5 mr-2 text-[#B89F7D]" />
                  02 — Sanctuary / Property
                </label>
                <select
                  value={propertySlug}
                  onChange={(e) => setPropertySlug(e.target.value)}
                  className="w-full bg-white border border-[#141413]/15 px-4 py-3.5 text-xs font-sans focus:outline-none focus:border-[#141413] transition-colors"
                >
                  {filteredProperties.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — From {p.formattedPrice}/night
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-mono text-stone-500 mt-1.5">
                  Coordinates: {currentProperty.coordinates}
                </p>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-[10px] font-mono uppercase tracking-[0.25em] text-[#726E67] mb-2.5">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#B89F7D]" />
                    03 — Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full bg-white border border-[#141413]/15 px-3 py-3 text-xs font-mono focus:outline-none focus:border-[#141413]"
                  />
                </div>
                <div>
                  <label className="flex items-center text-[10px] font-mono uppercase tracking-[0.25em] text-[#726E67] mb-2.5">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#B89F7D]" />
                    04 — Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-white border border-[#141413]/15 px-3 py-3 text-xs font-mono focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>

              {/* Guests selector */}
              <div>
                <label className="flex items-center text-[10px] font-mono uppercase tracking-[0.25em] text-[#726E67] mb-2.5">
                  <Users className="w-3.5 h-3.5 mr-2 text-[#B89F7D]" />
                  05 — Guests
                </label>
                <div className="flex items-center space-x-3">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2.5 text-xs font-mono border transition-all ${
                        guests === num
                          ? 'border-[#141413] bg-[#141413] text-[#FAF8F5]'
                          : 'border-[#141413]/10 bg-white hover:border-[#141413]/30'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="p-4 bg-[#F4EFEA] border border-[#141413]/6 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-500">
                    {currentProperty.formattedPrice} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span className="font-semibold text-stone-900">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                  <span>Taxes & Silent Concierge included</span>
                  <span>Free Cancellation (48h)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#141413] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.24em] font-medium flex items-center justify-center space-x-3 hover:bg-[#2C2A29] transition-colors"
                >
                  <span>REQUEST RESERVATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="w-full py-3.5 bg-white border border-[#141413]/15 text-[#141413] font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2.5 hover:bg-stone-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>DIRECT WHATSAPP CONCIERGE</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-6 md:p-8 border-t border-[#141413]/8 bg-[#F4EFEA]/50 text-center">
          <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
            For urgent reservations: {BRAND.contact.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
