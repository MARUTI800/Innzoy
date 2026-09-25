'use client';

import Image from 'next/image';
import { useGallery } from '@/components/common/GalleryLightbox';

interface Props {
  images: string[];
  propertyName: string;
  region: string;
}

export default function InteractiveGalleryGrid({ images, propertyName, region }: Props) {
  const { openGallery } = useGallery();

  const handleOpen = (index: number) => {
    const items = images.map((src, i) => ({
      src,
      alt: `${propertyName} architectural perspective ${i + 1}`,
      caption: `Perspective 0${i + 1} · ${propertyName}`,
      location: region,
    }));
    openGallery(items, index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => handleOpen(i)}
          className="relative aspect-[4/3] overflow-hidden bg-[#E8E3DC] group text-left cursor-pointer border border-[#171715]/10"
          data-cursor="EXPAND"
          aria-label={`View perspective ${i + 1} fullscreen`}
        >
          <Image
            src={img}
            alt={`${propertyName} perspective ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover filter brightness-[0.93] group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-3 left-3 font-mono text-[8px] uppercase tracking-widest text-[#FAF9F6] bg-black/50 px-2 py-1 backdrop-blur-sm">
            FIG. 0{i + 1} · CLICK TO EXPAND
          </div>
        </button>
      ))}
    </div>
  );
}
