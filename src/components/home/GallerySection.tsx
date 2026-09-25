'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryItem {
  src: string;
  caption: string;
  location: string;
  tag: string;
}

export default function GallerySection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const images: GalleryItem[] = [
    {
      src: "https://innzoy.in/wp-content/uploads/2025/10/Hotel-Main-Elevation-e1763746501737-2048x1363.jpg",
      caption: "Main Elevation against Deccan Rock Formations",
      location: "Khajaguda Sanctuary",
      tag: "EXTERIOR ARCHITECTURE"
    },
    {
      src: "https://innzoy.in/wp-content/uploads/2025/10/jublie-hill-bedroom-2.jpg",
      caption: "Bespoke Teak Millwork & Soft Diffuse Daylight",
      location: "The Villa Jubilee Hills",
      tag: "SUITE INTERIORS"
    },
    {
      src: "https://innzoy.in/wp-content/uploads/2025/11/9-scaled.jpg",
      caption: "Wrap-Around Skyline Sky Deck at Dusk",
      location: "The Penthouse Kondapur",
      tag: "TERRACE & VIEWS"
    },
    {
      src: "https://innzoy.in/wp-content/uploads/2025/10/Premium-Room-4-2048x1536.webp",
      caption: "Acoustically Insulated Executive Quarters",
      location: "DLF Cyber City Hotel",
      tag: "BUSINESS RESIDENCE"
    },
    {
      src: "https://innzoy.in/wp-content/uploads/2025/11/Frame-38-2.png",
      caption: "Manicured Lawns & Native Tamarind Groves",
      location: "Mokila Luxury Retreat",
      tag: "ESTATE GROUNDS"
    }
  ];

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev! + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev! - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, images.length]);

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-[#141413] text-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#B89F7D] block mb-3">
              08 / VISUAL ARCHIVE
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase leading-[1.05]">
              LIGHT, FORM
              <br />
              <span className="italic font-normal text-stone-300">& PROPORTION.</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-stone-400 font-mono text-[10px] uppercase tracking-widest">
            CLICK ANY FRAME FOR EXPANDED VIEW · [ESC] TO CLOSE
          </p>
        </div>

        {/* Asymmetric Gallery Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Top Left Major Feature (7 cols) */}
          <div
            onClick={() => setActiveIdx(0)}
            className="md:col-span-7 relative aspect-[16/10] overflow-hidden group cursor-pointer bg-[#1C1B19]"
            data-cursor="EXPAND"
          >
            <Image
              src={images[0].src}
              alt={images[0].caption}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-1000 ease-luxury filter brightness-[0.85] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#B89F7D] block">
                  {images[0].tag}
                </span>
                <p className="font-serif text-lg text-white font-light">{images[0].caption}</p>
              </div>
              <Maximize2 className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Top Right Tall Feature (5 cols) */}
          <div
            onClick={() => setActiveIdx(1)}
            className="md:col-span-5 relative aspect-[4/5] overflow-hidden group cursor-pointer bg-[#1C1B19]"
            data-cursor="EXPAND"
          >
            <Image
              src={images[1].src}
              alt={images[1].caption}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-1000 ease-luxury filter brightness-[0.85] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#B89F7D] block">
                  {images[1].tag}
                </span>
                <p className="font-serif text-lg text-white font-light">{images[1].caption}</p>
              </div>
              <Maximize2 className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Bottom 3 Columns (4 cols each) */}
          {images.slice(2, 5).map((img, i) => (
            <div
              key={img.caption}
              onClick={() => setActiveIdx(i + 2)}
              className="md:col-span-4 relative aspect-[4/3] overflow-hidden group cursor-pointer bg-[#1C1B19]"
              data-cursor="EXPAND"
            >
              <Image
                src={img.src}
                alt={img.caption}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-luxury filter brightness-[0.85] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#B89F7D] block">
                  {img.tag}
                </span>
                <p className="font-serif text-sm text-white font-light truncate">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeIdx !== null && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 md:p-12 animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-[#FAF8F5]">
            <div className="font-mono text-xs uppercase tracking-widest">
              <span className="text-[#B89F7D]">0{activeIdx + 1}</span> / 0{images.length} —{' '}
              {images[activeIdx].location}
            </div>
            <button
              onClick={() => setActiveIdx(null)}
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image Center Stage */}
          <div className="relative w-full max-w-5xl h-[70vh] mx-auto my-auto flex items-center justify-center">
            <Image
              src={images[activeIdx].src}
              alt={images[activeIdx].caption}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {/* Bottom Bar & Nav Controls */}
          <div className="flex items-center justify-between text-[#FAF8F5] pt-4 border-t border-white/10">
            <p className="font-serif text-lg md:text-xl font-light text-stone-200">
              {images[activeIdx].caption}
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev! - 1 + images.length) % images.length)
                }
                className="p-3 border border-white/20 hover:border-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIdx((prev) => (prev! + 1) % images.length)}
                className="p-3 border border-white/20 hover:border-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
