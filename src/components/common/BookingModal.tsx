'use client';

import { useState, useRef, FormEvent } from 'react';
import { useBooking } from '@/context/BookingContext';
import { PROPERTIES } from '@/data/innzoyData';

export default function BookingModal() {
  const { isOpen, options, closeBooking } = useBooking();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({
    property: options.propertySlug || '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormState({
      property: '',
      checkIn: '',
      checkOut: '',
      guests: '2',
      name: '',
      email: '',
      message: '',
    });
    closeBooking();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-ink-dark/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[520px] z-[61] bg-ivory overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Booking inquiry"
      >
        <div className="p-8 md:p-12 min-h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <p className="font-metadata text-ink-muted mb-2">INNZOY</p>
              <h2 className="font-serif-display text-3xl text-ink">
                Reserve a Stay
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-ink-muted hover:text-ink transition-colors duration-200 mt-1"
              aria-label="Close booking"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitted ? (
            <div className="flex-1 flex flex-col items-start justify-center">
              <p className="font-metadata text-earth mb-3">INQUIRY RECEIVED</p>
              <h3 className="font-serif-display text-2xl text-ink mb-4">
                Thank you.
              </h3>
              <p className="text-ink-secondary text-sm leading-relaxed mb-8">
                Our concierge team will respond to your inquiry within 24 hours with
                availability and personalized recommendations.
              </p>
              <button
                onClick={handleClose}
                className="font-metadata text-ink border-b border-ink/20 hover:border-ink pb-1 transition-colors duration-300"
              >
                CLOSE
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col gap-8">
              {/* Property */}
              <div>
                <label className="font-metadata text-ink-muted block mb-3">PROPERTY</label>
                <select
                  value={formState.property}
                  onChange={(e) => setFormState({ ...formState, property: e.target.value })}
                  className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a property</option>
                  {PROPERTIES.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="font-metadata text-ink-muted block mb-3">CHECK-IN</label>
                  <input
                    type="date"
                    value={formState.checkIn}
                    onChange={(e) => setFormState({ ...formState, checkIn: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="font-metadata text-ink-muted block mb-3">CHECK-OUT</label>
                  <input
                    type="date"
                    value={formState.checkOut}
                    onChange={(e) => setFormState({ ...formState, checkOut: e.target.value })}
                    className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="font-metadata text-ink-muted block mb-3">GUESTS</label>
                <select
                  value={formState.guests}
                  onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
                  className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n.toString()}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Email */}
              <div>
                <label className="font-metadata text-ink-muted block mb-3">NAME</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors"
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="font-metadata text-ink-muted block mb-3">EMAIL</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="font-metadata text-ink-muted block mb-3">MESSAGE (OPTIONAL)</label>
                <textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-transparent border-b border-ink/10 py-3 text-ink text-sm outline-none focus:border-ink/40 transition-colors resize-none"
                  rows={3}
                  placeholder="Special requests or notes"
                />
              </div>

              {/* Submit */}
              <div className="mt-auto pt-8">
                <button
                  type="submit"
                  className="w-full bg-ink-dark text-ivory font-metadata py-4 hover:bg-ink transition-colors duration-300"
                >
                  CHECK AVAILABILITY
                </button>
                <p className="text-ink-muted text-xs mt-4 text-center">
                  This is a concierge inquiry — no payment required.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
