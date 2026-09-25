'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
  location?: string;
}

interface GalleryContextType {
  openGallery: (items: LightboxItem[], startIndex?: number) => void;
  closeGallery: () => void;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return ctx;
}

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const openGallery = (galleryItems: LightboxItem[], startIndex = 0) => {
    setItems(galleryItems);
    setCurrentIndex(startIndex);
    setIsRendered(true);
    // Allow DOM to mount before animating in
    setTimeout(() => setIsOpen(true), 20);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setIsRendered(false);
      setItems([]);
      document.body.style.overflow = '';
    }, 400);
  }, []);

  const nextImage = useCallback(() => {
    if (items.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }
  }, [items.length]);

  const prevImage = useCallback(() => {
    if (items.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRendered) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, closeGallery, nextImage, prevImage]);

  const currentItem = items[currentIndex];

  return (
    <GalleryContext.Provider value={{ openGallery, closeGallery }}>
      {children}

      {isRendered && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 transition-opacity duration-400 ease-out"
          style={{ opacity: isOpen ? 1 : 0 }}
        >
          {/* Top Controls */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-[#FAF9F6]">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone-400">
              PERSPECTIVE {currentIndex + 1} OF {items.length}
              {currentItem.location && ` · ${currentItem.location}`}
            </div>

            <button
              onClick={closeGallery}
              data-cursor="CLOSE"
              className="p-3 text-stone-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Previous / Next Arrow Buttons */}
          {items.length > 1 && (
            <>
              <button
                onClick={prevImage}
                data-cursor="PREV"
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 hidden sm:block cursor-pointer"
                aria-label="Previous perspective"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                data-cursor="NEXT"
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 hidden sm:block cursor-pointer"
                aria-label="Next perspective"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Fullscreen Image Viewport */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-6xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: isOpen ? 'scale(1)' : 'scale(0.92)',
            }}
          >
            <Image
              src={currentItem.src}
              alt={currentItem.alt || 'Gallery perspective'}
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Bottom Caption */}
          {currentItem.caption && (
            <div className="absolute bottom-6 left-6 right-6 text-center z-20 font-serif text-sm font-light text-stone-300 italic">
              {currentItem.caption}
            </div>
          )}
        </div>
      )}
    </GalleryContext.Provider>
  );
}
