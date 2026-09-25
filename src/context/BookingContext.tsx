'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BookingModalOptions {
  propertySlug?: string;
  destination?: string;
  roomName?: string;
  guests?: number;
  dates?: string;
}

interface BookingContextType {
  isOpen: boolean;
  options: BookingModalOptions;
  openBooking: (options?: BookingModalOptions) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<BookingModalOptions>({});

  const openBooking = (opts?: BookingModalOptions) => {
    if (opts) setOptions(opts);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBooking = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <BookingContext.Provider value={{ isOpen, options, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
